# -*- coding: utf-8 -*-
"""
八字分析引擎 - 自动走树形图生成断语
Bazi Analysis Engine - Automatically traverse tree structure to generate responses
"""

import json
import re
from pathlib import Path

# ============================================================================
# 八字分析器
# ============================================================================

class BaziAnalyzer:
    """八字分析器 - 判断身强身弱和十神"""
    
    # 天干五行
    TIANGAN_WUXING = {
        '甲': '木', '乙': '木',
        '丙': '火', '丁': '火',
        '戊': '土', '己': '土',
        '庚': '金', '辛': '金',
        '壬': '水', '癸': '水',
    }
    
    # 地支五行（主气）
    DIZHI_WUXING = {
        '子': '水', '丑': '土', '寅': '木', '卯': '木',
        '辰': '土', '巳': '火', '午': '火', '未': '土',
        '申': '金', '酉': '金', '戌': '土', '亥': '水',
    }
    
    # 月令得令表（简化版）
    YUELING_DELING = {
        '寅': ['甲', '乙', '丙', '丁'],  # 木火
        '卯': ['甲', '乙'],
        '辰': ['戊', '己'],
        '巳': ['丙', '丁', '戊', '己'],
        '午': ['丙', '丁'],
        '未': ['戊', '己'],
        '申': ['庚', '辛', '壬', '癸'],
        '酉': ['庚', '辛'],
        '戌': ['戊', '己'],
        '亥': ['壬', '癸', '甲', '乙'],
        '子': ['壬', '癸'],
        '丑': ['戊', '己'],
    }
    
    def __init__(self, bazi_string):
        """初始化八字 - 格式：甲寅年 丙寅月 甲子日 甲子时"""
        parts = bazi_string.strip().split()
        if len(parts) != 4:
            raise ValueError(f"八字格式错误: {bazi_string}")
        
        self.nian = parts[0][:2]  # 年柱
        self.yue = parts[1][:2]   # 月柱
        self.ri = parts[2][:2]    # 日柱
        self.shi = parts[3][:2]   # 时柱
        
        self.riyuan = self.ri[0]  # 日元
        self.yuezhi = self.yue[1]  # 月支
        
    def analyze_shenqiang(self):
        """分析身强身弱"""
        deling = self._check_deling()
        dedi = self._check_dedi()
        dezhu = self._check_dezhu()
        
        count = sum([deling, dedi, dezhu])
        
        if count >= 3:
            strength = "身极强"
        elif count >= 2:
            strength = "身强"
        elif count == 1:
            strength = "身弱"
        else:
            strength = "身极弱"
        
        analysis = {
            "strength": strength,
            "deling": deling,
            "dedi": dedi,
            "dezhu": dezhu,
            "deling_text": self._get_deling_text(),
            "dedi_text": self._get_dedi_text(),
            "dezhu_text": self._get_dezhu_text(),
        }
        
        return analysis
    
    def _check_deling(self):
        """检查是否得令"""
        return self.riyuan in self.YUELING_DELING.get(self.yuezhi, [])
    
    def _check_dedi(self):
        """检查是否得地（简化：看地支是否有生扶）"""
        riyuan_wuxing = self.TIANGAN_WUXING[self.riyuan]
        dizhi = [self.nian[1], self.yue[1], self.ri[1], self.shi[1]]
        
        # 简化逻辑：检查地支中有没有同五行或生我的
        for zhi in dizhi:
            zhi_wuxing = self.DIZHI_WUXING.get(zhi)
            if zhi_wuxing == riyuan_wuxing:
                return True
            # TODO: 添加相生逻辑
        
        return len([z for z in dizhi if self.DIZHI_WUXING.get(z) == riyuan_wuxing]) >= 2
    
    def _check_dezhu(self):
        """检查是否得助（天干有比劫）"""
        tiangan = [self.nian[0], self.yue[0], self.shi[0]]  # 不含日元
        riyuan_wuxing = self.TIANGAN_WUXING[self.riyuan]
        
        count = sum(1 for gan in tiangan if self.TIANGAN_WUXING.get(gan) == riyuan_wuxing)
        return count >= 1
    
    def _get_deling_text(self):
        """得令分析文本"""
        if self._check_deling():
            return f"①得令：{self.yuezhi}月为{self.riyuan}木当令之地"
        else:
            return f"①失令：{self.yuezhi}月不当令"
    
    def _get_dedi_text(self):
        """得地分析文本"""
        if self._check_dedi():
            return "②得地：地支有根"
        else:
            return "②失地：地支无根"
    
    def _get_dezhu_text(self):
        """得助分析文本"""
        if self._check_dezhu():
            return "③得助：天干有比劫帮身"
        else:
            return "③无助：天干无帮身"

# ============================================================================
# 树形图断语库
# ============================================================================

CAIKUN_DUANYU = {
    "身强_财旺_有食伤": {
        "pattern": "身强财旺、食伤生财",
        "description": "顶级创业者的配置",
        "advice": "大胆创业、做生意、搞投资，技术+财路两手抓",
        "fengxian": "命中无官杀制约，比劫旺容易与人合作出问题",
    },
    "身弱_财旺_无印": {
        "pattern": "身弱财旺无印",
        "description": "扛着一袋金子在闹市走",
        "advice": "找大平台、大企业，有人帮你分担压力",
        "fengxian": "容易因财务问题、合同纠纷惹上麻烦",
    },
    "身弱_财旺_官杀压": {
        "pattern": "身弱财旺官杀压",
        "description": "扛着一袋金子还要被人催债",
        "advice": "找大平台、大企业或者找个靠谱的合伙人",
        "fengxian": "七杀透干无食伤制，容易因财务问题惹麻烦",
    },
}

# ============================================================================
# 响应生成器
# ============================================================================

def generate_response_from_analysis(bazi_string, topic, scenario, analysis):
    """根据分析结果生成回复"""
    
    # 这里简化处理，实际需要根据十神组合匹配更精准的断语
    strength = analysis["strength"]
    
    # 根据身强弱选择断语（简化版）
    if "身强" in strength or "身极强" in strength:
        pattern_key = "身强_财旺_有食伤"
    else:
        pattern_key = "身弱_财旺_官杀压"
    
    duanyu = CAIKUN_DUANYU.get(pattern_key, CAIKUN_DUANYU["身弱_财旺_无印"])
    
    # 解析八字
    parts = bazi_string.strip().split()
    
    response = f"""**分析命局**：{bazi_string}。日元{bazi_string.split()[2][0]}生于{bazi_string.split()[1][1]}月。

**分析身旺**：{analysis['deling_text']}。{analysis['dedi_text']}。{analysis['dezhu_text']}。综合来看，**{strength}**。

**分析财运**：你命中{duanyu['pattern']}。这叫**{duanyu['description']}**！

{_get_detailed_analysis(strength, topic)}

**官非情况**：{duanyu['fengxian']}。开店要特别注意合规经营，账目清晰，别被人抓把柄。

**命局特征**：{_get_mingjiu_tezheng(strength)}

**生于{bazi_string.split()[1][1]}月**：{_get_yueling_analysis(bazi_string.split()[1][1])}

**财运方面**：{duanyu['advice']}。

具体建议：{_get_specific_advice(strength, topic)}"""
    
    return response

def _get_detailed_analysis(strength, topic):
    """获取详细分析"""
    if "身强" in strength:
        return "你现在觉得赚不到钱，不是命不好，是你太保守了！身强能扛大财，你就是天生做生意的料，**能持续创造、还能守住大钱**。"
    else:
        return "财星本是好事，但你身子弱扛不住。**财来生官反成祸**。你现在的困境不是没财运，是财太重、压力太大，自己一个人扛不住。"

def _get_mingjiu_tezheng(strength):
    """获取命局特征"""
    if "身强" in strength:
        return "比劫成群、食伤有力、财星得根。这种格局**最怕被束缚**，打工只会埋没你的财运。"
    else:
        return "财官旺而身弱，缺少比劫印星帮身。这种格局最怕单打独斗、孤军奋战。你越想靠自己扛财，越会被财拖垮。"

def _get_yueling_analysis(yuezhi):
    """获取月令分析"""
    yue_texts = {
        '寅': "寅月木旺，印星有力。春天出生，创意和执行力都强。",
        '午': "午月火旺，食伤有力。夏天出生，表达欲强、想法多。",
        '申': "申月金旺，财星有力。秋天生人，现实感强、重视物质。",
        '子': "子月水旺，印星当令。冬天出生，聪明有想法。",
    }
    return yue_texts.get(yuezhi, f"{yuezhi}月出生，需结合大运分析。")

def _get_specific_advice(strength, topic):
    """获取具体建议"""
    if "身强" in strength:
        return "科技创业、餐饮连锁、电商平台、投资理财。你适合做需要持续创新的行业，别守着小摊子不动。"
    else:
        return "财务管理、会计、出纳等职位适合你，有平台依靠、责任分散。或者加盟大品牌连锁店，背靠大树好乘凉。"

# ============================================================================
# 主函数  - 填充400条数据
# ============================================================================

def enrich_all_data():
    """为所有400条数据填充详细回复"""
    
    topics = ["财运", "事业", "婚姻", "学业", "子女", "官非", "夫妻性生活", "身强身弱用神"]
    
    biao_dir = Path("e:/SD/bazi/sanbanfu/biao")
    total_enriched = 0
    
    print("开始填充400条训练数据...")
    print("=" * 60)
    
    for topic in topics:
        input_file = biao_dir / f"{topic}_50条模板化对话.jsonl"
        output_file = biao_dir / f"{topic}_完整对话.jsonl"
        
        if not input_file.exists():
            print(f"⚠️  {topic} 文件不存在，跳过")
            continue
        
        print(f"\n正在处理 {topic}...")
        
        enriched_conversations = []
        
        with open(input_file, 'r', encoding='utf-8') as f:
            for line_num, line in enumerate(f, 1):
                if not line.strip():
                    continue
                
                try:
                    conv = json.loads(line)
                    user_content = conv['messages'][1]['content']
                    
                    # 提取八字
                    match = re.search(r'我的八字是:\s*(.+?)\n', user_content)
                    if not match:
                        continue
                    
                    bazi_string = match.group(1).strip()
                    scenario = user_content.split('\n\n', 1)[1] if '\n\n' in user_content else ""
                    
                    # 分析八字
                    analyzer = BaziAnalyzer(bazi_string)
                    analysis = analyzer.analyze_shenqiang()
                    
                    # 生成回复
                    response = generate_response_from_analysis(bazi_string, topic, scenario, analysis)
                    
                    # 更新对话
                    conv['messages'][2]['content'] = response
                    enriched_conversations.append(conv)
                    
                except Exception as e:
                    print(f"  ❌ 第{line_num}条出错: {e}")
                    continue
        
        # 保存
        with open(output_file, 'w', encoding='utf-8') as f:
            for conv in enriched_conversations:
                f.write(json.dumps(conv, ensure_ascii=False) + '\n')
        
        total_enriched += len(enriched_conversations)
        print(f"✅ {topic}: {len(enriched_conversations)} 条已完善 -> {output_file.name}")
    
    print("\n" + "=" * 60)
    print(f"🎉 全部完成！共完善 {total_enriched} 条训练对话")

if __name__ == "__main__":
    enrich_all_data()
