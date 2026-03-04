# -*- coding: utf-8 -*-
"""
为每个主题生成50条模板化训练数据
Generate 50 template-based training samples for each of 8 topics (400 total)
"""

import json
import random
from pathlib import Path

SYSTEM_PROMPT = "你是一位精通三板斧命理体系的算命大师,风格专业准确且接地气。你擅长从八字推断身强身弱,并结合现实情况给出中肯建议。"

# ============================================================================
# 八字样本库 - 覆盖身强/身弱的各种组合
# ============================================================================

BAZI_SAMPLES = {
    "身极强": [
        "甲寅年 丙寅月 甲子日 甲子时",  # 得令+得地+得助
        "乙卯年 己卯月 乙亥日 丁亥时",
        "丙午年 甲午月 丙寅日 甲寅时",
    ],
    "身强": [
        "戊戌年 甲寅月 戊午日 壬子时",  # 得令+得地
        "庚申年 戊申月 庚辰日 丙子时",
        "壬子年 壬子月 壬寅日 庚戌时",
    ],
    "身弱": [
        "己卯年 丙寅月 己亥日 甲子时",  # 仅得令
        "辛酉年 庚子月 辛巳日 己丑时",
        "癸亥年 甲寅月 癸巳日 乙卯时",
    ],
    "身极弱": [
        "丙午年 庚午月 丙子日 戊子时",  # 三项全无
        "丁未年 辛未月 丁亥日 辛亥时",
        "乙酉年 戊子月 辛巳日 己丑时",
    ],
}

# ============================================================================
# 用户场景库 - 每个主题50个不同场景
# ============================================================================

USER_SCENARIOS = {
    "财运": [
        "大师，我开了个小店半年了，天天起早贪黑但就是赚不到钱，房租都快交不起了",
        "大师您看看，我做生意三年了一直不温不火，想扩张又怕亏",
        "大师救命！我投资股票亏了20万，现在不敢告诉家里人",
        "大师，我朋友都发财了就我还月光，每个月工资刚发就没了",
        "您好，我在公司干了5年工资还是那点死钱，看着外面的人都买车买房了",
        "大师，我老是存不住钱，刚发工资就被朋友借走了",
        "您好大师，我想创业但家里人都反对，说我没做生意的命",
        "大师救命！我被人骗了30万，现在还欠着银行贷款",
        "大师，我开餐馆三个月了，每天营业额还不够成本",
        "您好大师，我做微商一年了赚的还不如打工",
        # ... 继续添加到50个
    ],
    "事业": [
        "大师，我在公司就是个小透明。开会从来没人听我说话",
        "您好大师，我毕业三年换了五份工作，每次都干不长",
        "大师帮帮我！我每天加班到半夜，领导还说我效率低",
        "您好，我35岁了公司开始裁员，我怕下一个就是我",
        "大师，我在体制内干了10年，看着外面的朋友都发财了",
        "您好大师，我考公务员三战都没上岸",
        "大师救命！我创业失败欠了20万",
        "您好，我跟同事关系很差，天天被排挤",
        "大师，我技术很好但就是升不上去",
        "您好大师，我跳槽三次了工资还是没涨",
        # ... 继续添加到50个
    ],
    # 其他主题类似...
}

# ============================================================================
# 响应模板生成器
# ============================================================================

def generate_response_template(topic, bazi_strength, specific_pattern):
    """根据主题、身强弱、具体格局生成响应"""
    
    templates = {
        "财运_身极强_财旺食伤": """**分析命局**：{bazi}。日元{riyuan}生于{month}月，{structure}。

**分析身旺**：①得令：{deling_analysis}。②得地：{dedi_analysis}。③得助：{dezhu_analysis}。三项俱全，**身极强**。

**分析财运**：你命中身强财旺、还有食伤生财。这叫**身强财旺、食伤生财**，是**顶级创业者的配置**！

你现在觉得赚不到钱，不是命不好，是你太保守了！身强能扛大财，食伤聪明灵活会变通，财星又有根基。你就是天生做生意的料，**能持续创造、还能守住大钱**。

**官非情况**：命中无官杀制约，比劫旺容易与人合作出问题。扩张时别轻易找合伙人，宁可贷款也要自己掌控主导权。

**命局特征**：比劫成群、食伤有力、财星得根。这种格局**最怕被束缚**，打工只会埋没你的财运。你的问题不是能不能成，而是**胆子够不够大**。

**生于{month}月**：{month_analysis}

**财运方面**：**大胆扩张**！别怕亏，你这命格就是越折腾越旺。技术创业、连锁经营、投资理财都适合。现在这点困难算什么？该投资就投资，该扩张就扩张。

具体建议：科技创业、餐饮连锁、电商平台、投资理财。你适合做需要持续创新的行业，别守着小摊子不动。""",
        
        "财运_身弱_财旺官杀":  """**分析命局**：{bazi}。日元{riyuan}生于{month}月，{structure}。

**分析身旺**：①得令：{deling_analysis}。②得地：{dedi_analysis}。③得助：{dezhu_analysis}。综合来看，**身弱**。

**分析财运**：你命中身弱财旺、官杀压身。这叫**身弱财旺官杀压**，就像扛着一袋金子还要被人催债，累得要死还招灾。

财星本是好事，但你身子弱扛不住。**财来生官反成祸**。你现在的困境不是没财运，是财太重、压力太大，自己一个人扛不住。

**官非情况**：七杀透干无食伤制，容易因财务问题、合同纠纷惹上麻烦。开店要特别注意合规经营，账目清晰，别被人抓把柄。

**命局特征**：财官旺而身弱，缺少比劫印星帮身。这种格局最怕单打独斗、孤军奋战。你越想靠自己扛财，越会被财拖垮。

**生于{month}月**：{month_analysis}

**财运方面**：你这命不适合自己当老板硬扛。**建议找大平台、大企业**，有人帮你分担压力。或者找个靠谱的合伙人，互相扶持。别再一个人死撑了，**借力才能发财**。

具体建议：财务管理、会计、出纳等职位适合你，有平台依靠、责任分散。或者加盟大品牌连锁店，背靠大树好乘凉。""",
        
        # 添加更多模板...
    }
    
    return templates.get(f"{topic}_{bazi_strength}_{specific_pattern}", "")

def generate_50_samples_for_topic(topic_name):
    """为单个主题生成50条样本"""
    
    conversations = []
    
    # 确保生成50条不同的对话
    for i in range(50):
        # 随机选择身强弱类型
        strength_type = random.choice(list(BAZI_SAMPLES.keys()))
        bazi_chart = random.choice(BAZI_SAMPLES[strength_type])
        
        # 随机选择用户场景
        if topic_name in USER_SCENARIOS and USER_SCENARIOS[topic_name]:
            scenario = random.choice(USER_SCENARIOS[topic_name])
        else:
            scenario = f"大师，请帮我看看{topic_name}方面的情况"
        
        # 生成简化版响应（先用占位符）
        response = f"[{topic_name}第{i+1}条训练数据 - 待完善]"
        
        conversation = {
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"我的八字是: {bazi_chart}\n\n{scenario}"},
                {"role": "assistant", "content": response}
            ]
        }
        
        conversations.append(conversation)
    
    return conversations

def main():
    """生成所有主题的训练数据"""
    
    topics = ["财运", "事业", "婚姻", "学业", "子女", "官非", "夫妻性生活", "身强身弱用神"]
    
    output_dir = Path("e:/SD/bazi/sanbanfu/biao")
    total_count = 0
    
    print("开始生成400条模板化训练数据...")
    print("=" * 60)
    
    for topic_name in topics:
        print(f"\n正在生成 {topic_name} 的50条训练数据...")
        
        try:
            conversations = generate_50_samples_for_topic(topic_name)
            
            # 保存为JSONL
            output_file = output_dir / f"{topic_name}_50条模板化对话.jsonl"
            with open(output_file, 'w', encoding='utf-8') as f:
                for conv in conversations:
                    f.write(json.dumps(conv, ensure_ascii=False) + '\n')
            
            total_count += len(conversations)
            print(f"✅ {topic_name}: {len(conversations)} 条 -> {output_file.name}")
        
        except Exception as e:
            print(f"❌ {topic_name} 生成失败: {e}")
    
    print("\n" + "=" * 60)
    print(f"🎉 全部完成！共生成 {total_count} 条模板化训练对话")
    print(f"平均每个主题: {total_count // len(topics)} 条")

if __name__ == "__main__":
    main()
