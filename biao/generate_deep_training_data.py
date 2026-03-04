# -*- coding: utf-8 -*-
"""
深度八字训练数据生成器 - 带有"药方感"的精准断语
Based on specific tree structure conclusions
"""

import json
import random
from pathlib import Path

SYSTEM_PROMPT = "你是一位精通三板斧命理体系的算命大师,风格专业准确且接地气。你擅长从八字推断身强身弱,并结合现实情况给出中肯建议。"

# ============================================================================
# 精准八字样本 - 每个都对应树形结构图中的具体分支
# ============================================================================

DETAILED_BAZI_PATTERNS = [
    # 身强财旺类
    {
        "chart": "甲寅年 丙寅月 甲子日 甲子时",
        "analysis": "得令(月支寅木比肩)、得地(年日支寅子有根)、得助(三甲透干)，这是**身极强**的格局。你命里财星旺相(子水为财)，还有食伤生财(丙火食神)。",
        "pattern": "身强财旺有食伤生财",
        "prescription": "你这叫**顶级创业者配置**——身体棒、有干劲，脑子还特别灵光，外面遍地是黄金。能持续创造还能守住大钱。",
        "advice": "建议你大胆创业、做生意、搞投资，技术+财路两手抓。别给人打工浪费这富贵命。",
        "topic": "财运"
    },
    {
        "chart": "戊戌年 甲寅月 戊午日 壬子时",
        "analysis": "得令(月支寅木印星)、得地(年日支戌午有根)，身强。命里官杀为用(寅木七杀)，还有财生官(壬子水财)。",
        "pattern": "身强官杀为用+财生官",
        "prescription": "你这叫**由富入贵**——钱赚够了社会地位也跟着涨，在职场混得风生水起，要钱有钱要面子有面子。",
        "advice": "建议你走金融管理、企业高管路线，钱权双收才是你的归宿。",
        "topic": "事业"
    },
    
    # 身强官杀旺类
    {
        "chart": "庚申年 戊申月 庚辰日 丙子时",
        "analysis": "得令(月支申金比劫)、得地(年支申金有根)，身强。但命里缺少食伤制杀，官杀(戊土辰土)压力大。",
        "pattern": "身强官杀旺无食伤制",
        "prescription": "你现在压力全自己扛，**事业卡壳**。官杀没人化也没人管，硬刚只会把自己累垮。",
        "advice": "建议你先练级，等大运走食伤制杀年(走火运)，再冲刺晋升。现在别硬来。",
        "topic": "事业"
    },
    {
        "chart": "甲寅年 丙寅月 甲午日 丙申时",
        "analysis": "得令(月支寅木比劫)、得助(甲木透干)，身强。命里有食伤(丙火)能制杀，这叫**化杀为权**。",
        "pattern": "身强有食伤制杀",
        "prescription": "你这种格局适合去腥风血雨里拼杀。七杀有食神管着，**有领导范儿**，能驾驭复杂局面。",
        "advice": "建议你走企业管理、创业者、投资经理路线，别窝在小公司当螺丝钉。",
        "topic": "事业"
    },
    
    # 身弱财旺类
    {
        "chart": "甲申年 丙子月 庚午日 丙戌时",
        "analysis": "失令(月支子水伤官)、无根(申金被午火克)、无帮，身弱。命里财旺(子水午火财星),财多身弱。",
        "pattern": "身弱财旺无印",
        "prescription": "你这就是**扛着一袋金子在闹市走**——累得半死还招贼。满地是钱但你拿不动，也没人帮你拿。",
        "advice": "建议你找大平台、大企业，有导师带的环境。别单打独斗，借力才能发财。",
        "topic": "财运"
    },
    {
        "chart": "癸亥年 甲寅月 丙午日 甲午时",
        "analysis": "得地(日支午火、时支午火有根)，但失令(月支寅木泄气)，身弱。财星(亥水癸水)生官(甲木寅木),财生官杀。",
        "pattern": "身弱财生官",
        "prescription": "你这叫**因财招灾**——压力大还要借钱创业，钱没赚到先把债务滚成雪球。赚的钱全送医院了。",
        "advice": "建议你别碰高风险投资，找个稳定工作保命要紧。钱让别人管，你别操心。",
        "topic": "财运"
    },
    
    # 身弱官杀旺类
    {
        "chart": "乙酉年 戊子月 辛巳日 己丑时",
        "analysis": "失令(月支子水伤官)、失根(酉金被巳火克)、无帮，身极弱。官杀旺(戊土己土)还无印化解。",
        "pattern": "身弱官杀旺无印化",
        "prescription": "你这**压力爆表，事业凉凉**。官杀没大没小，身子又弱，硬扛只会把自己累死。",
        "advice": "建议你先苟着，别跟人争。转技术岗或后勤岗，避开管理和高压环境。把身体养好再说。",
        "topic": "事业"
    },
    {
        "chart": "丙午年 庚午月 丙子日 戊子时",
        "analysis": "失令(月支午火劫财耗身)、失地(子水克午火)，身弱。官杀旺(庚金戊土)，但有印星化解无力。",
        "pattern": "身弱官杀旺印星无力",
        "prescription": "你这**印星化不动官杀，压力扛不住**，累成狗还看不到希望。",
        "advice": "建议你提升能力，抱大腿发展。找个好领导跟着学，别一个人硬撑。",
        "topic": "事业"
    },
    
    # 身强印比成病类
    {
        "chart": "乙卯年 己卯月 乙亥日 丁亥时",
        "analysis": "得令(月支卯木比劫)、得地(年支卯木、日时支亥水印星)、得助(双乙透干)，身极强。但命里没财星，印比太旺成病。",
        "pattern": "身强印比成病无财",
        "prescription": "你这叫**思想上的巨人，行动上的矮子**。完全被懒和旧观念困住不动手，想法一堆计划挺大，就是脚不动弹。",
        "advice": "建议你**制印生财**——独立理财、自己管钱，别依赖父母或平台。逼自己动起来才有出路。",
        "topic": "财运"
    },
    
    # 身弱食伤泄重类
    {
        "chart": "甲子年 丙子月 甲寅日 丙申时",
        "analysis": "得地(日支寅木有根)，但失令(月支子水泄气)，身弱。食伤旺(双丙透干、子水伤官)，泄身太重。",
        "pattern": "身弱食伤泄重",
        "prescription": "你这**食伤泄身太狠**——想法多、话也多，但身子扛不住，越说越累。",
        "advice": "建议你**印星止泄**——少说多做，找个有文化氛围的单位（学校、培训机构），考公考编最合适。有靠山才能稳。",
        "topic": "事业"
    },
]

# 用户场景 - 更加真实和多样化
DEEP_SCENARIOS = {
    "财运": [
        "大师救命！我开了个小店半年了，天天起早贪黑但就是赚不到钱，房租都快交不起了。我是不是八字财运差？",
        "您好大师，我投资股票亏了20万，现在不敢告诉家里人。我这个命是不是不适合做投资？",
        "大师，我朋友都发财了就我还月光，每个月工资刚发就没了。我是不是命里缺财？",
        "大师您看看，我做生意三年了一直不温不火，想扩张又怕亏，想收手又不甘心。我到底该怎么办？",
        "您好，我在公司干了5年工资还是那点死钱，看着外面的人都买车买房了。我要不要辞职出去闯？",
        "大师，我老是存不住钱，刚发工资就被朋友借走了，有时候还得自己垫钱。我是不是财运被克？",
        "您好大师，我想创业但家里人都反对，说我没做生意的命。我到底有没有发财的机会？",
        "大师救命！我被人骗了30万，现在还欠着银行贷款。我这辈子还能翻身吗？",
        "大师，我开餐馆三个月了，每天营业额还不够成本。是不是选错行业了？",
        "您好大师，我做微商一年了赚的还不如打工。我该继续还是放弃？",
    ],
    "事业": [
        "大师，我在公司就是个小透明。开会从来没人听我说话，提建议也没人理。是我性格问题还是八字问题？",
        "您好大师，我毕业三年换了五份工作，每次都干不长。我到底适合做什么？",
        "大师帮帮我！我每天加班到半夜，领导还说我效率低。我是不是不适合这行？",
        "您好，我35岁了公司开始裁员，我怕下一个就是我。还有没有出路？",
        "大师，我在体制内干了10年，看着外面的朋友都发财了。我该不该辞职？",
        "您好大师，我考公务员三战都没上岸。是不是我命里没有铁饭碗？",
        "大师救命！我创业失败欠了20万，现在既回不去也不知道该干啥。",
        "您好，我跟同事关系很差，天天被排挤。是不是我八字犯小人？",
        "大师，我技术很好但就是升不上去。是不是我没当领导的命？",
        "您好大师，我跳槽三次了工资还是没涨。我该继续跳还是安心待着？",
    ]
}

def generate_deep_conversation(pattern_data, user_scenario):
    """生成带有药方感的深度对话"""
    
    conversation = {
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"我的八字是: {pattern_data['chart']}\n\n{user_scenario}"},
            {"role": "assistant", "content": f"{pattern_data['analysis']}\n\n{pattern_data['prescription']}\n\n{pattern_data['advice']}"}
        ]
    }
    
    return conversation

def main():
    """生成30条深度训练对话"""
    
    output_dir = Path("e:/SD/bazi/sanbanfu/biao")
    output_file = output_dir / "深度实战对话_training_data.jsonl"
    
    conversations = []
    used_combinations = set()
    
    # 生成30条对话
    target_count = 30
    attempt_count = 0
    max_attempts = 100
    
    while len(conversations) < target_count and attempt_count < max_attempts:
        attempt_count += 1
        
        # 随机选择一个pattern
        pattern = random.choice(DETAILED_BAZI_PATTERNS)
        
        # 根据topic选择对应的scenario
        topic = pattern["topic"]
        if topic in DEEP_SCENARIOS:
            scenario = random.choice(DEEP_SCENARIOS[topic])
            
            # 确保不重复（chart + scenario 组合）
            combo_key = (pattern["chart"], scenario)
            if combo_key not in used_combinations:
                used_combinations.add(combo_key)
                conv = generate_deep_conversation(pattern, scenario)
                conversations.append(conv)
    
    # 保存为JSONL
    with open(output_file, 'w', encoding='utf-8') as f:
        for conv in conversations:
            f.write(json.dumps(conv, ensure_ascii=False) + '\n')
    
    print(f"\n✅ 生成深度训练数据: {len(conversations)} 条")
    print(f"文件保存在: {output_file}")
    print(f"\n示例对话:")
    print(f"用户: {conversations[0]['messages'][1]['content'][:100]}...")
    print(f"助手: {conversations[0]['messages'][2]['content'][:150]}...")

if __name__ == "__main__":
    main()
