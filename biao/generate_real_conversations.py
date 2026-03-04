#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
生成实战对话训练数据
用户提供八字+现实困境,AI自己推理判断
"""

import json
import random
from pathlib import Path

# 示例八字库(用于生成真实案例)
SAMPLE_BAZIS = [
    # 身强案例
    {
        "bazi": "甲寅年 丙寅月 甲子日 甲子时",
        "analysis": "身强",
        "reason": "得令(月支寅木)、得地(年支寅木、日支子水生木)、得助(三甲透干)",
        "elements": {"木": "旺", "火": "有", "水": "有", "金": "缺", "土": "缺"}
    },
    {
        "bazi": "戊戌年 甲寅月 戊午日 壬子时",
        "analysis": "身强",
        "reason": "得地(年支戌土、日支午火生土)、得助(两戊透干)",
        "elements": {"土": "旺", "木": "有", "火": "有", "水": "有", "金": "缺"}
    },
    # 身弱案例
    {
        "bazi": "甲子年 丙子月 庚申日 丙戌时",
        "analysis": "身弱",
        "reason": "失令(月支子水克金)、地支无根、天干火克金",
        "elements": {"金": "弱", "水": "旺", "火": "有", "土": "有", "木": "有"}
    },
    {
        "bazi": "癸亥年 甲寅月 丙午日 甲午时",
        "analysis": "身弱",
        "reason": "失令(月支寅木泄火)、虽日支午火帮身但水克火",
        "elements": {"火": "中", "木": "旺", "水": "有", "金": "缺", "土": "缺"}
    },
]

# 真实困境模板库
CAREER_PROBLEMS = [
    "大师您好,我现在特别迷茫。30岁了,在一家国企混了5年,天天摸鱼但工资不高。最近家里催我出去闯,朋友也劝我创业,但我又怕失败。您帮我看看,我到底适合稳定的还是出去拼?",
    "大师救命!我去年辞职创业,开了个工作室,结果半年就亏了20多万。现在既回不去原来的公司,又不知道该不该继续撑。每天焦虑到睡不着,您帮我看看是不是我八字不适合创业?",
    "您好大师,我在互联网公司做了3年程序员,技术还行但就是升不上去。看着同期进来的都当主管了,我还在写代码。领导说我不够主动,我也想往上爬,但不知道咋办。您看我有没有当领导的命?",
    "大师您看看,我这个人就是太老实了。在公司埋头苦干,活都是我干的,奖金都是别人拿的。我也想反抗,但又怕得罪人丢工作。家里还有房贷要还,您说我该怎么办?",
    "大师帮帮我,我今年刚毕业,在一家小公司实习。每天都被老板骂,说我这也不行那也不行。我开始怀疑自己是不是真的不适合工作,但又不知道能干啥。您帮我看看我适合什么行业?",
    "您好大师,我在体制内干了10年,现在40岁了。最近看着外面的朋友都发财了,我每个月就那点死工资,心里不平衡。但要是辞职出去,又怕没了铁饭碗。我这个年纪还能折腾吗?",
    "大师救命啊,我做销售的,以前业绩挺好,去年开始就一直掉。客户也谈不下来,团队也带不动。老板都暗示我了,我现在压力特别大。您帮我看看是不是运势不好,还是我不适合这行?",
    "您好大师,我开了家小店,生意一直半死不活的。房租人工一个月3万,勉强保本。我媳妇让我关了算了,但我又不甘心。投了这么多钱,就这么放弃了?您看我能不能翻身?",
    "大师您好,我在公司就是个小透明。开会从来没人听我说话,提建议也没人理。我也想表现,但就是不知道怎么让领导注意到我。是我性格问题还是八字问题?",
    "您好大师,我是做技术的,现在35岁了。公司开始裁员,我怕下一个就是我。想转管理但没机会,想跳槽但年纪大了。感觉前途一片黑暗,您帮我看看还有没有出路?"
]

# 大师回答模板(根据不同组合)
MASTER_RESPONSES = {
    "身强_有官杀_有印化官": {
        "insight": "看你这八字,{reason},算是身强的命。关键是你有官印相生的格局",
        "advice": "你这种命格最适合体制内发展。别听什么创业的忽悠,你的优势就在于能扛责任、有贵人提携。{recommendation}你现在觉得憋屈,那是因为还没熬到位置。再忍两年,肯定有晋升机会。",
        "jobs": "推荐你继续在国企、事业单位或者考公务员,这才是你的康庄大道"
    },
    "身强_无官杀_有食伤": {
        "insight": "你这八字{reason},属于身强的命。我看你是食伤泄秀的格局",
        "advice": "你天生就不是给人打工的料!你适合靠技术、靠脑子吃饭,打工只会把你的才华埋没。{recommendation}别怕失败,你这种命格最怕的就是被束缚。早点出来自己干,越早越好。",
        "jobs": "适合做程序员、设计师、自媒体或者技术创业,发挥你的专长"
    },
    "身强_财旺": {
        "insight": "看你的八字,{reason},这是身强财旺的富格",
        "advice": "哥们,你这是富贵命啊!身强能担财,你就是天生的生意人。现在这点困难算什么?{recommendation}别在那小打小闹,该投资就投资,该扩张就扩张。你的问题不是能不能成,而是胆子够不够大。",
        "jobs": "创业、做生意、投资都可以,别浪费你这个赚钱的命"
    },
    "身弱_官杀为忌": {
        "insight": "我看你这八字,{reason},典型的身弱官杀为害",
        "advice": "难怪你压力这么大!你这命格就是扛不住责任,越往上爬越累。{recommendation}别硬刚了,先降低期望,找个清闲点的岗位养精蓄锐。等运势好了再说,现在硬撑只会把身体搞垮。",
        "jobs": "建议转技术岗或者后勤岗,避开管理和高压环境"
    },
    "身弱_有印星": {
        "insight": "看你这八字,{reason},好在有印星帮身",
        "advice": "你现在的困境是暂时的。你命里有贵人运,关键是要找对靠山。{recommendation}别瞎折腾,找个有实力的平台或者跟对一个好领导,借力发展才是正道。你这种命格最怕单打独斗。",
        "jobs": "适合大平台、大企业,或者有导师带的环境,靠平台和人脉发展"
    },
    "身弱_无印比": {
        "insight": "你这八字{reason},是身极弱的命格,缺少帮扶",
        "advice": "说实话,你现在的状态确实不太适合硬拼。你最大的问题是找不到支撑点。{recommendation}现在别想着大展宏图,先找个稳定的工作把基础打牢。等积累够了,运势转了再说。心急吃不了热豆腐。",
        "jobs": "先找稳定工作,积累人脉和资源,不宜冒险创业"
    }
}

def generate_real_conversation(bazi_info, problem, path_key):
    """生成一组真实对话"""
    template = MASTER_RESPONSES.get(path_key, MASTER_RESPONSES["身强_有官杀_有印化官"])
    
    # 构建AI回答
    insight = template["insight"].format(reason=bazi_info["reason"])
    advice = template["advice"].format(recommendation="")
    jobs = template["jobs"]
    
    full_answer = f"{insight},而且{advice}\n\n{jobs}。"
    
    # 构建用户问题(包含八字信息)
    user_question = f"我的八字是: {bazi_info['bazi']}\n\n{problem}"
    
    return {
        "messages": [
            {
                "role": "system",
                "content": "你是一位精通三板斧命理体系的算命大师,风格专业准确且接地气。你擅长从八字推断身强身弱,并结合现实情况给出中肯建议。"
            },
            {
                "role": "user",
                "content": user_question
            },
            {
                "role": "assistant",
                "content": full_answer
            }
        ]
    }

def generate_20_samples():
    """生成20组实战对话"""
    conversations = []
    
    path_keys = list(MASTER_RESPONSES.keys())
    
    for i in range(20):
        # 随机选择八字和问题
        bazi_info = random.choice(SAMPLE_BAZIS)
        problem = random.choice(CAREER_PROBLEMS)
        
        # 根据身强身弱选择合适的路径
        if "身强" in bazi_info["analysis"]:
            path_key = random.choice([k for k in path_keys if k.startswith("身强")])
        else:
            path_key = random.choice([k for k in path_keys if k.startswith("身弱")])
        
        conv = generate_real_conversation(bazi_info, problem, path_key)
        conversations.append(conv)
    
    return conversations

def main():
    """主函数"""
    print("🎯 生成实战对话训练数据...")
    
    conversations = generate_20_samples()
    
    output_file = Path(__file__).parent / "事业_实战对话_training_data.jsonl"
    
    with open(output_file, 'w', encoding='utf-8') as f:
        for conv in conversations:
            json_line = json.dumps(conv, ensure_ascii=False)
            f.write(json_line + '\n')
    
    print(f"✅ 完成! 生成 {len(conversations)} 组实战对话")
    print(f"📁 输出文件: {output_file}")
    
    # 展示前2个样本
    print(f"\n{'='*70}")
    print("📝 样本展示:")
    print(f"{'='*70}\n")
    
    for i, conv in enumerate(conversations[:2], 1):
        print(f"【样本 {i}】")
        print(f"用户:\n{conv['messages'][1]['content']}\n")
        print(f"大师:\n{conv['messages'][2]['content']}\n")
        print(f"{'-'*70}\n")

if __name__ == "__main__":
    main()
