# -*- coding: utf-8 -*-
"""
深度检查逻辑一致性 - 检查所有8个主题
Deep logic consistency checker for all 8 topics
"""

import json
import re
from pathlib import Path

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
            "is_strong": count >= 2
        }

def deep_check_file(file_path):
    """深度检查单个文件"""
    
    issues = []
    stats = {"total": 0, "strong": 0, "weak": 0, "contradictions": 0}
    
    with open(file_path, 'r', encoding='utf-8') as f:
        for line_num, line in enumerate(f, 1):
            if not line.strip():
                continue
            
            stats["total"] += 1
            
            try:
                conv = json.loads(line)
                user_content = conv['messages'][1]['content']
                assistant_content = conv['messages'][2]['content']
                
                # 提取八字
                match = re.search(r'我的八字是[：:]\s*(.+?)[\n。]', user_content)
                if not match:
                    continue
                
                bazi_string = match.group(1).strip()
                analyzer = BaziAnalyzer(bazi_string)
                analysis = analyzer.analyze_shenqiang()
                
                is_strong = analysis['is_strong']
                strength = analysis['strength']
                
                if is_strong:
                    stats["strong"] += 1
                else:
                    stats["weak"] += 1
                
                # 检查矛盾
                problems = []
                
                # 身强检查
                if is_strong:
                    # 不应出现的身弱话术
                    weak_phrases = [
                        '身子弱扛不住',
                        '财太重、压力太大',
                        '瘦弱的人被派去扛重物',
                        '扛着一袋金子在闹市走路',
                        '小孩拿着100万现金',
                        '瘦子骨扛不住',
                        '像浮萍',
                        '财务管理、会计出纳',
                        '企业财务、银行柜员',
                        '有师傅带的学徒',
                        '借力不丢人',
                        '找大平台、找靠山'
                    ]
                    
                    for phrase in weak_phrases:
                        if phrase in assistant_content:
                            problems.append(f"身强用了身弱话术: '{phrase}'")
                
                # 身弱检查
                else:
                    # 不应出现的身强话术
                    strong_phrases = [
                        '天生做生意的料',
                        '能持续创造、还能守住大钱',
                        '参天大树',
                        '猛虎入山',
                        '顶级创业者',
                        '越折腾越旺',
                        '科技创业、连锁餐饮',
                        '投资理财、技术顾问',
                        '自主创业、加盟连锁',
                        '最怕安稳',
                        '你太保守了'
                    ]
                    
                    for phrase in strong_phrases:
                        if phrase in assistant_content:
                            problems.append(f"身弱用了身强话术: '{phrase}'")
                
                if problems:
                    stats["contradictions"] += 1
                    issues.append({
                        'line': line_num,
                        'bazi': bazi_string,
                        'strength': strength,
                        'is_strong': is_strong,
                        'problems': problems
                    })
            
            except Exception as e:
                print(f"    ⚠️ 行{line_num}解析失败: {e}")
    
    return issues, stats

def main():
    """主函数"""
    
    biao_dir = Path("e:/SD/bazi/sanbanfu/biao")
    
    print("=" * 80)
    print("🔍 深度检查逻辑一致性（所有8个主题）")
    print("=" * 80)
    
    all_stats = {}
    all_issues = {}
    
    # 检查所有优化文件
    topic_files = sorted(biao_dir.glob("*_优化完整对话.jsonl"))
    
    for topic_file in topic_files:
        topic = topic_file.stem.replace('_优化完整对话', '')
        print(f"\n📋 {topic}:")
        
        issues, stats = deep_check_file(topic_file)
        all_stats[topic] = stats
        
        print(f"   总数: {stats['total']}条")
        print(f"   身强: {stats['strong']}条 ({stats['strong']*100//stats['total']}%)")
        print(f"   身弱: {stats['weak']}条 ({stats['weak']*100//stats['total']}%)")
        
        if issues:
            all_issues[topic] = issues
            print(f"   ❌ 逻辑矛盾: {stats['contradictions']}条")
            
            # 显示前2个问题
            for issue in issues[:2]:
                print(f"\n     行{issue['line']}: {issue['bazi']}")
                print(f"     实际: {issue['strength']} ({'身强' if issue['is_strong'] else '身弱'})")
                for p in issue['problems'][:2]:
                    print(f"       • {p}")
        else:
            print(f"   ✅ 逻辑一致")
    
    # 总结
    print("\n" + "=" * 80)
    print("📊 总体统计")
    print("=" * 80)
    
    total_samples = sum(s['total'] for s in all_stats.values())
    total_contradictions = sum(s['contradictions'] for s in all_stats.values())
    
    print(f"总样本数: {total_samples}条")
    print(f"逻辑矛盾: {total_contradictions}条 ({total_contradictions*100//total_samples}%)")
    
    if all_issues:
        print(f"\n⚠️  需要修复的主题: {', '.join(all_issues.keys())}")
    
    return all_issues

if __name__ == "__main__":
    all_issues = main()
    
    # 保存检查报告
    if all_issues:
        print("\n💾 保存详细检查报告...")
        
        report_file = Path("e:/SD/bazi/sanbanfu/biao/逻辑检查报告.txt")
        with open(report_file, 'w', encoding='utf-8') as f:
            for topic, issues in all_issues.items():
                f.write(f"\n{'='*60}\n")
                f.write(f"{topic} - 共{len(issues)}个问题\n")
                f.write(f"{'='*60}\n")
                
                for issue in issues:
                    f.write(f"\n行{issue['line']}: {issue['bazi']}\n")
                    f.write(f"实际强度: {issue['strength']}\n")
                    f.write("问题:\n")
                    for p in issue['problems']:
                        f.write(f"  • {p}\n")
        
        print(f"✅ 报告已保存: {report_file}")
