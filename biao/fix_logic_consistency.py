# -*- coding: utf-8 -*-
"""
修复逻辑一致性问题
Fix logic consistency issues in training data
"""

import json
import re
from pathlib import Path

# 八字分析器（从之前复用）
class BaziAnalyzer:
    TIANGAN_WUXING = {
        '甲': '木', '乙': '木', '丙': '火', '丁': '火',
        '戊': '土', '己': '土', '庚': '金', '辛': '金',
        '壬': '水', '癸': '水',
    }
    
    DIZHI_WUXING = {
        '子': '水', '丑': '土', '寅': '木', '卯': '木',
        '辰': '土', '巳': '火', '午': '火', '未': '土',
        '申': '金', '酉': '金', '戌': '土', '亥': '水',
    }
    
    YUELING_DELING = {
        '寅': ['甲', '乙'], '卯': ['甲', '乙'], '辰': ['戊', '己'],
        '巳': ['丙', '丁'], '午': ['丙', '丁'], '未': ['戊', '己'],
        '申': ['庚', '辛'], '酉': ['庚', '辛'], '戌': ['戊', '己'],
        '亥': ['壬', '癸'], '子': ['壬', '癸'], '丑': ['戊', '己'],
    }
    
    def __init__(self, bazi_string):
        parts = bazi_string.strip().split()
        self.nian, self.yue, self.ri, self.shi = parts[0][:2], parts[1][:2], parts[2][:2], parts[3][:2]
        self.riyuan = self.ri[0]
        self.yuezhi = self.yue[1]
    
    def analyze_shenqiang(self):
        deling = self.riyuan in self.YUELING_DELING.get(self.yuezhi, [])
        
        riyuan_wuxing = self.TIANGAN_WUXING[self.riyuan]
        dizhi = [self.nian[1], self.yue[1], self.ri[1], self.shi[1]]
        dedi = len([z for z in dizhi if self.DIZHI_WUXING.get(z) == riyuan_wuxing]) >= 2
        
        tiangan = [self.nian[0], self.yue[0], self.shi[0]]
        dezhu = sum(1 for g in tiangan if self.TIANGAN_WUXING.get(g) == riyuan_wuxing) >= 1
        
        count = sum([deling, dedi, dezhu])
        strength = ["身极弱", "身弱", "身强", "身极强"][count] if count <= 3 else "身极强"
        
        return {
            "strength": strength,
            "deling": deling,
            "dedi": dedi,
            "dezhu": dezhu,
            "count": count
        }

def check_consistency(file_path):
    """检查单个文件的逻辑一致性"""
    
    issues = []
    
    with open(file_path, 'r', encoding='utf-8') as f:
        for line_num, line in enumerate(f, 1):
            if not line.strip():
                continue
            
            try:
                conv = json.loads(line)
                user_content = conv['messages'][1]['content']
                assistant_content = conv['messages'][2]['content']
                
                # 提取八字
                match = re.search(r'我的八字是:\s*(.+?)\n', user_content)
                if not match:
                    continue
                
                bazi_string = match.group(1).strip()
                analyzer = BaziAnalyzer(bazi_string)
                analysis = analyzer.analyze_shenqiang()
                
                strength = analysis['strength']
                
                # 检查逻辑矛盾
                problems = []
                
                # 1. 身强却说身弱
                if '身强' in strength or '身极强' in strength:
                    if '身子弱扛不住' in assistant_content:
                        problems.append(f"❌ {strength}却说'身子弱扛不住'")
                    if '财来生官反成祸' in assistant_content and '身弱扛财' in assistant_content:
                        problems.append(f"❌ {strength}用了身弱的断语")
                    if '财务管理、会计、出纳' in assistant_content:
                        problems.append(f"❌ {strength}推荐了身弱职业")
                
                # 2. 身弱却说身强
                if '身弱' in strength or '身极弱' in strength:
                    if '顶级创业者的配置' in assistant_content:
                        problems.append(f"❌ {strength}却说'顶级创业者配置'")
                    if '越折腾越旺' in assistant_content:
                        problems.append(f"❌ {strength}却说'越折腾越旺'")
                    if '科技创业、连锁餐饮' in assistant_content:
                        problems.append(f"❌ {strength}推荐了身强职业")
                
                if problems:
                    issues.append({
                        'line': line_num,
                        'bazi': bazi_string,
                        'strength': strength,
                        'problems': problems
                    })
            
            except Exception as e:
                print(f"  ⚠️  第{line_num}行解析失败: {e}")
    
    return issues

def fix_file(input_file, output_file):
    """修复单个文件的逻辑错误"""
    
    fixed_count = 0
    
    with open(input_file, 'r', encoding='utf-8') as f_in, \
         open(output_file, 'w', encoding='utf-8') as f_out:
        
        for line in f_in:
            if not line.strip():
                continue
            
            try:
                conv = json.loads(line)
                user_content = conv['messages'][1]['content']
                assistant_content = conv['messages'][2]['content']
                
                # 提取八字
                match = re.search(r'我的八字是:\s*(.+?)\n', user_content)
                if not match:
                    f_out.write(line)
                    continue
                
                bazi_string = match.group(1).strip()
                analyzer = BaziAnalyzer(bazi_string)
                analysis = analyzer.analyze_shenqiang()
                strength = analysis['strength']
                
                # 修复逻辑矛盾
                original_content = assistant_content
                
                if '身强' in strength or '身极强' in strength:
                    # 身强的人，移除身弱断语
                    assistant_content = assistant_content.replace(
                        '财星本是好事，但你身子弱扛不住。**财来生官反成祸**。你现在的困境不是没财运，是财太重、压力太大，自己一个人扛不住。',
                        '你现在觉得赚不到钱，不是命不好，是你太保守了！身强能扛大财，你就是天生做生意的料，**能持续创造、还能守住大钱**。'
                    )
                    
                    # 移除"财务管理、会计、出纳"建议
                    if '财务管理、会计出纳、大公司职员、加盟连锁店、有分红的合伙制' in assistant_content:
                        assistant_content = assistant_content.replace(
                            '财务管理、会计出纳、大公司职员、加盟连锁店、有分红的合伙制',
                            '科技创业、连锁餐饮、电商平台、投资理财、技术顾问'
                        )
                    
                    if '企业财务、银行柜员、连锁加盟、职业经理人、有师傅带的学徒' in assistant_content:
                        assistant_content = assistant_content.replace(
                            '企业财务、银行柜员、连锁加盟、职业经理人、有师傅带的学徒',
                            '自主创业、加盟连锁、投资股权、技术合伙'
                        )
                
                elif '身弱' in strength or '身极弱' in strength:
                    # 身弱的人，移除身强断语
                    assistant_content = assistant_content.replace(
                        '你现在觉得赚不到钱，不是命不好，是你太保守了！身强能扛大财，你就是天生做生意的料，**能持续创造、还能守住大钱**。',
                        '财星本是好事，但你身子弱扛不住。**财来生官反成祸**。你现在的困境不是没财运，是财太重、压力太大，自己一个人扛不住。'
                    )
                    
                    # 移除创业建议
                    if '科技创业、连锁餐饮、电商平台、投资理财、技术顾问' in assistant_content:
                        assistant_content = assistant_content.replace(
                            '科技创业、连锁餐饮、电商平台、投资理财、技术顾问',
                            '财务管理、会计出纳、大公司职员、加盟连锁店、有分红的合伙制'
                        )
                    
                    if '自主创业、加盟连锁、投资股权、技术合伙' in assistant_content:
                        assistant_content = assistant_content.replace(
                            '自主创业、加盟连锁、投资股权、技术合伙',
                            '企业财务、银行柜员、连锁加盟、职业经理人、有师傅带的学徒'
                        )
                
                # 如果有修改，记录
                if assistant_content != original_content:
                    fixed_count += 1
                
                # 更新对话
                conv['messages'][2]['content'] = assistant_content
                f_out.write(json.dumps(conv, ensure_ascii=False) + '\n')
            
            except Exception as e:
                print(f"  ❌ 修复失败: {e}")
                f_out.write(line)
    
    return fixed_count

def main():
    """主函数"""
    
    biao_dir = Path("e:/SD/bazi/sanbanfu/biao")
    
    print("=" * 70)
    print("开始检查逻辑一致性...")
    print("=" * 70)
    
    all_issues = {}
    
    # 检查所有优化文件
    for topic_file in biao_dir.glob("*_优化完整对话.jsonl"):
        topic = topic_file.stem.replace('_优化完整对话', '')
        print(f"\n📋 检查 {topic}...")
        
        issues = check_consistency(topic_file)
        
        if issues:
            all_issues[topic] = issues
            print(f"  ⚠️  发现 {len(issues)} 个逻辑问题")
            for issue in issues[:3]:  # 只显示前3个
                print(f"     行{issue['line']}: {issue['bazi']} ({issue['strength']})")
                for p in issue['problems']:
                    print(f"       {p}")
        else:
            print(f"  ✅ 逻辑一致")
    
    if all_issues:
        print("\n" + "=" * 70)
        print("开始修复...")
        print("=" * 70)
        
        total_fixed = 0
        
        for topic_file in biao_dir.glob("*_优化完整对话.jsonl"):
            topic = topic_file.stem.replace('_优化完整对话', '')
            
            if topic not in all_issues:
                continue
            
            print(f"\n🔧 修复 {topic}...")
            
            output_file = biao_dir / f"{topic}_修复版.jsonl"
            fixed = fix_file(topic_file, output_file)
            
            total_fixed += fixed
            print(f"  ✅ 修复了 {fixed} 条")
        
        print("\n" + "=" * 70)
        print(f"🎉 完成！总共修复了 {total_fixed} 条逻辑错误")
        print("=" * 70)
    else:
        print("\n✅ 所有文件逻辑一致，无需修复")

if __name__ == "__main__":
    main()
