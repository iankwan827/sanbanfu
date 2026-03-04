# -*- coding: utf-8 -*-
"""
最终版：基于树形逻辑的三板斧八字训练数据生成器
Sanbanfu Tree-Logic Bazi Training Data Generator
"""

import json
import random
from pathlib import Path

# =====================================================================
# Bazi Analyzer Engine
# =====================================================================

class BaziAnalyzer:
    TIANGAN_WUXING = {'甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土', '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水'}
    DIZHI_WUXING = {'子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火', '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水'}
    
    SHEN_RELATION = {
        '木': {'木': '比劫', '火': '食伤', '土': '财星', '金': '官杀', '水': '印星'},
        '火': {'火': '比劫', '土': '食伤', '金': '财星', '水': '官杀', '木': '印星'},
        '土': {'土': '比劫', '金': '食伤', '水': '财星', '木': '官杀', '火': '印星'},
        '金': {'金': '比劫', '水': '食伤', '木': '财星', '火': '官杀', '土': '印星'},
        '水': {'水': '比劫', '木': '食伤', '火': '财星', '土': '官杀', '金': '印星'},
    }

    def __init__(self, bazi_string):
        self.bazi_string = bazi_string
        parts = bazi_string.strip().split()
        if len(parts) < 4:
            self.nian, self.yue, self.ri, self.shi = "甲子", "丙寅", "戊辰", "庚申"
        else:
            self.nian, self.yue, self.ri, self.shi = parts[0][:2], parts[1][:2], parts[2][:2], parts[3][:2]
        self.riyuan = self.ri[0]
        self.yuezhi = self.yue[1]
        self.rizhi = self.ri[1]
        self.riyuan_wuxing = self.TIANGAN_WUXING.get(self.riyuan, '土')
        
        relations = self.SHEN_RELATION.get(self.riyuan_wuxing, {})
        self.god_wuxing = {god: wx for wx, god in relations.items()}
        self.cai_wx = self.god_wuxing.get('财星')
        self.guan_wx = self.god_wuxing.get('官杀')
        self.shishang_wx = self.god_wuxing.get('食伤')
        self.yin_wx = self.god_wuxing.get('印星')
        self.bijie_wx = self.god_wuxing.get('比劫')

    def analyze(self):
        dizhi = [self.nian[1], self.yue[1], self.ri[1], self.shi[1]]
        tiangan = [self.nian[0], self.yue[0], self.shi[0]]
        all_chars_wx = [self.TIANGAN_WUXING.get(g) for g in tiangan] + [self.DIZHI_WUXING.get(z) for z in dizhi]
        
        # 1. 三要素判定
        deling_wx = self.DIZHI_WUXING.get(self.yuezhi)
        deling = deling_wx in [self.bijie_wx, self.yin_wx]
        
        other_dizhi = [self.nian[1], self.ri[1], self.shi[1]]
        dedi = any(self.DIZHI_WUXING.get(z) in [self.bijie_wx, self.yin_wx] for z in other_dizhi)
        
        dezhu = any(self.TIANGAN_WUXING.get(g) in [self.bijie_wx, self.yin_wx] for g in tiangan)
        
        count = sum([deling, dedi, dezhu])
        is_strong = count >= 2
        
        is_guan_yin_sheng_pattern = (deling_wx == self.guan_wx and self.DIZHI_WUXING.get(self.rizhi) == self.yin_wx)
        if is_guan_yin_sheng_pattern:
            is_strong = True
            strength = "身强(官印相生)"
        else:
            strength = ["身极弱", "身弱", "身强", "身极强"][count]

        god_counts = {
            '财星': all_chars_wx.count(self.cai_wx),
            '官杀': all_chars_wx.count(self.guan_wx),
            '食伤': all_chars_wx.count(self.shishang_wx),
            '印星': all_chars_wx.count(self.yin_wx),
            '比劫': all_chars_wx.count(self.bijie_wx)
        }
        
        def is_god_strong(wx):
            if not wx: return False
            s_count = sum(1 for g in tiangan if self.TIANGAN_WUXING.get(g) == wx)
            b_count = sum(1 for z in dizhi if self.DIZHI_WUXING.get(z) == wx)
            eling = (self.DIZHI_WUXING.get(self.yuezhi) == wx)
            if eling and (s_count + b_count) >= 1: return True
            if s_count >= 1 and b_count >= 1: return True
            if b_count >= 2: return True
            return False

        cai_strong = is_god_strong(self.cai_wx)
        guan_strong = is_god_strong(self.guan_wx)
        shishang_strong = is_god_strong(self.shishang_wx)
        yin_strong = is_god_strong(self.yin_wx)

        tiaohou_needed = None
        yongshen, xishen, jishen = "通用", "通用", "通用"
        if self.yuezhi in ['巳', '午', '未'] and god_counts['财星'] == 0:
            tiaohou_needed = "夏生用水"
            yongshen, xishen, jishen = "水(财/官)", "金(印/比)", "火(比/食)"
        elif self.yuezhi in ['亥', '子', '丑'] and god_counts['比劫'] == 0:
            if self.riyuan_wuxing != '火':
                tiaohou_needed = "冬生用火"
                yongshen, xishen, jishen = "火", "木", "水"

        if not tiaohou_needed:
            if is_strong:
                if cai_strong: yongshen, xishen, jishen = "财星", "食伤", "比劫"
                elif guan_strong: yongshen, xishen, jishen = "官杀", "财星", "伤官"
                elif shishang_strong: yongshen, xishen, jishen = "食伤", "财星", "印星"
                else: yongshen, xishen, jishen = "食伤", "财星", "印比"
            else:
                if count == 0:
                    yongshen, xishen, jishen = "财官", "食伤", "印比"
                    strength = "从弱格"
                elif yin_strong: yongshen, xishen, jishen = "印星", "官杀", "财星"
                else: yongshen, xishen, jishen = "印星", "比劫", "官杀"

        return {
            "strength": strength, "is_strong": is_strong, "deling": deling, "dedi": dedi, "dezhu": dezhu,
            "count": count, "tiaohou": tiaohou_needed, "yongshen": yongshen, "xishen": xishen, "jishen": jishen,
            "cai_strong": cai_strong, "guan_strong": guan_strong, "shishang_present": god_counts['食伤'] > 0,
            "shishang_strong": shishang_strong, "yin_present": god_counts['印星'] > 0, "yin_strong": yin_strong,
            "bijie_strong": is_god_strong(self.bijie_wx),
            "has_shishang_sheng_cai": (god_counts['食伤'] > 0 and god_counts['财星'] > 0),
            "has_guan_yin_sheng": (god_counts['官杀'] > 0 and god_counts['印星'] > 0),
            "has_shishang_zhi_sha": (god_counts['食伤'] > 0 and god_counts['官杀'] > 0),
            "has_cai_sheng_guan": (god_counts['财星'] > 0 and god_counts['官杀'] > 0),
            "bi_jie_duo_cai": (god_counts['比劫'] >= 2 and god_counts['财星'] > 0),
            "spouse_god": self.SHEN_RELATION.get(self.riyuan_wuxing, {}).get(self.DIZHI_WUXING.get(self.rizhi), '未知'),
            "god_counts": god_counts
        }

# =====================================================================
# Diversity Data Pool
# =====================================================================

BAZI_SAMPLES = [
    "甲寅年 丙寅月 甲寅日 甲子时", "乙卯年 己卯月 乙亥日 丁亥时", "壬子年 壬子月 壬寅日 庚戌时", "庚申年 戊申月 庚午日 丙子时",
    "丙午年 甲午月 丙寅日 戊戌时", "己卯年 丙寅月 己亥日 甲子时", "辛巳年 癸巳月 辛丑日 己丑时", "癸亥年 甲寅月 癸未日 壬子时",
    "丁未年 壬子月 丁巳日 庚戌时", "戊戌年 甲寅月 戊午日 癸丑时", "辛酉年 丁酉月 辛酉日 壬辰时", "甲子年 丙子月 甲子日 戊辰时",
    "乙丑年 己丑月 乙丑日 丁丑时", "丙寅年 庚寅月 丙寅日 己亥时", "丁卯年 辛卯月 丁卯日 庚子时", "戊辰年 壬辰月 戊辰日 辛亥时",
    "己巳年 癸巳月 己巳日 壬申时", "庚午年 甲午月 庚午日 癸卯时", "辛未年 乙未月 辛未日 甲子时", "壬申年 丙申月 壬申日 乙巳时"
]

MONTHS_DESC = {
    '寅': ["早春初生之气，木气稚嫩却生机盎然。你这类人天生有一股不服输的劲头，像破土而出的幼苗。虽然理想抱负宏大，但如果不注意根基的扎实，容易在事业中期感到后劲不足。为人清高宽厚，待人真诚，是朋友眼中的阳光之源。", "孟春之木当权，为人处世自带一种威严与慈悲并存的气质。你做事讲求章法，不喜欢被打乱节奏。但要注意，春季木旺多思，容易陷入‘想得多、做得少’的怪圈。在关键决策上，需要一点‘快刀斩乱麻’的果敢。"],
    '卯': ["春满人间，木性最纯。你的思维敏捷得像春雨后的柳枝，擅长察言观色，社交能力极强。在团队中，你往往是那个粘合剂。但纯木之人容易感性过头，遇到挫折容易自怨自艾，需要多接触一些务实、刚强的能量来中和。", "仲春之木，枝繁叶茂。你具备极高的艺术天赋或策划能力，审美水平不落俗套。生活中你追求完美，对细节近乎苛刻。这种性格让你在专业领域能出类拔萃，但也容易让你在人际关系中显得有些孤芳自赏，难以合群。"],
    '辰': ["暮春土旺，包容力极强。你性格稳重如山，是身边人的‘定海神针’。辰土为水库，意味着你内心深处藏着极大的智慧 and 城府，只是平时不显山露水。这种格局最适合厚积薄发，哪怕早年平平，中年后必有大作为。", "辰土为龙，藏干丰富，预示着你的人生充满变数与机遇。你这人适应能力极强，像水一样随方就圆。这种‘变色龙’般的智慧让你在复杂的职场中游刃有余。要注意的是，不要因为追求面面俱到 而迷失了自己的本心。"],
    '巳': ["夏火初生，热情如火但容易急躁。做事讲究效率，最讨厌拖泥带水。你的行动力是别人羡慕不来的，往往别人还在讨论，你已经把事情做完一半了。这种冲击力让你适合做开拓性的工作，但也要注意防范‘三分钟热度’，学会深耕细作。", "初夏阳气上升，你为人光明磊落，眼中容不得沙子。你的一生都在追求极致的公平与真相。这种刚正不阿的性格让你深得下属信任，但也容易在无意中得罪上位者。学会委婉的艺术，会让你的仕途或商路更加平坦。"],
    '午': ["仲夏火烈，精力旺盛到了极致。你有强烈的英雄主义情结，渴望在舞台中央发光发热。你的这种自信能感染周围的人，但也会让你在合作中显得过于强权。如果能学会倾听弱者的声音，你的号召力将呈几何倍数增长。", "午火当令，你是天然的意见领袖。不管是生活中还是工作里，大家总喜欢听你的主意。要注意盛极而衰的自然法则，在顺境时多留一手，不要把资源耗尽。晚年更适合退居幕后，做一些文化或顾问类的工作。"],
    '未': ["夏末土燥，蕴含着收获前的巨大压抑。你的人生成长往往伴随着一系列的磨难，但每一次磨难都是一次蜕变。你不仅耐力惊人，更有极强的危机处理能力。这种‘抗压型’人格让你在动荡的环境中反而能逆势而上。", "未土带火，你性格刚毅，脊梁骨非常有韧性。不管境遇多差，你绝不会轻易向命运低头。你这种人往往有某种偏执的爱好或专长，只要钻研透了，就是该行业的泰斗级人物。要注意健康，不要长期积压情绪。"],
    '申': ["初秋金旺，冷静果断是你的代名词。你是个彻头彻尾的现实主义者，能在大环境迷茫时瞬间看清局势。这种‘清醒’让你在投资和决策上极少犯错。要注意的是，过于理性的眼光有时会显得冷漠，让亲近的人感到寒心。", "金气萧杀，赋予了你极强的纪律感和执行力。你对自己的要求极高，对自己带的团队也极其严格。这种‘铁面无私’让你在法律、军事或大型企业管理中大放异彩。学会适度放松，不要把自己紧绷成一根箭，容易折断。"],
    '酉': ["仲秋金纯，精致且追求完美到了极致。你有一双发现美的眼睛，生活品质从不将就。在事业上，你往往是那个定标准、抓质量的人。这种严谨的态度让你在金银珠宝、高端财税或精密制造行业极具竞争力。", "金秋时节是收获的季节。你命带富贵之气，不管出身如何，总能通过自己的奋斗过上体面生活。防范那种‘宁折不弯’的脾气，在社交场合多一些曲线救国的智慧，会让你少走很多弯路。你是典型的‘刀子嘴豆腐心’。"],
    '戌': ["秋末土厚，信仰感极强。你为人忠诚可靠，只要是答应的事，豁出命去也要完成。这种信誉是你一生最大的财富。你内心深处有某种孤独感，这种孤独让你更倾向于研究哲学、宗教或深度技术，是个典型的思想者。", "戌土为火库，意味着你外冷内热，肚子里藏着千军万马。你这辈子贵人缘不错，尤其是那种老实持重的长辈。你赚钱不显山露水，属于闷声发大财的类型。中年后要注意心态开朗些。"],
    '亥': ["初冬水旺，智慧深邃如大海。你脑子里的想法像波浪一样层出不穷，是个天生的谋略家和策划师。你适合从事那些不直接出面、但在后方控场的工作。要注意这种‘多智’容易导致失眠和焦虑，要学会给大脑放假。", "冬天水进气，阴柔之气较重，这意味着你具备极强的直觉和第六感。在复杂的人事斗争中，你往往能预判风险，全身而退。这种格局最怕‘聪明被聪明误’，在大事上要多借力刚强之人，实现柔中带刚的跨越。"],
    '子': ["仲冬水寒，冷静异常。你这人像一潭深不可测的湖水，外人很难看透你在想什么。这种神秘感让你在谈判桌上有天然的优势。你的一生都在不断地自我进化，这种深层次的自我更新是你成功的源动力。要注意防范忧郁情绪。", "子水纯智，你的灵感往往在深夜爆发。你适合那种需要高度创造力和逻辑推理的工作，比如科研、编程或玄学研究。你的感情世界比较细腻，容易受伤害，需要一个火热性格的伴侣来温暖你寒凉的内心。"],
    '丑': ["冬末土寒，蕴藏着待发的磅礴生机。你现在的低迷只是暂时的蛰伏。你具备极强的责任感，往往是一个家庭或单位的脊梁骨。这种‘苦哈哈’的勤奋会换来晚年的极度尊崇和富贵。你是那种最值得信赖的合作伙伴。", "丑土藏金水，根基极其深厚。你这命格属于‘富贵潜龙’，只要遇到火运或流年点燃，必将一飞冲天。在成功之前，你需要做的就是不停地学习积累。中年后名望大噪，属于德艺双馨、德财双全的优质命盘。"]
}

VIVID_CONTENT = {
    "财运": {
        "strong": [("身强财旺，这是典型的‘大水冲了龙王庙’后的丰收格。你具备极强的财富收割能力，不管是主业还是偏业，只要你肯下功夫，钱财就如同潮水般涌来。你的格局够大，能撑得起跨行业的扩张，是天生的商界巨子。", "你的一生不会缺钱，缺的是承载财富的心境。身强之人最怕因财失义，建议在财富积累到一定程度后，多做布施回馈社会。你的财运具有极强的‘长线爆发力’。")],
        "weak": [("身弱财旺，这叫‘小财不出，大财不入’。你对钱财的掌控力较弱，容易产生‘过路财神’的焦虑感。建议你采取‘借力使力’策略，挂靠大型平台或与贵人合作，分红远比自己独自承担风险要稳妥。", "不要去赌博或参与高杠杆投资，那种虚浮的财富会压垮你的身心。学会‘化整为零’，将大的财务目标分解，每年稳步递增才是你的发财正道。")]
    },
    "学业": {
        "strong": [("这是百年难遇的‘文昌透干’学霸配置。身强能承载繁重的学业压力，官星给目标感，印星给扎实的理解力。你不仅成绩好，更具备极强的领导力和组织天赋，能轻松应对保研、名校面试等高阶挑战。", "你的天赋不仅仅在于死记硬背，而在于对知识体系的全局掌控。适合考取含金量极高的综合管理类、战略研究类专业。求学路上多遇恩师提携，建议冲刺名校。")],
        "weak": [("学习上容易感到心有余而力不足，或常因琐碎杂事分心，导致成绩起伏较大。印星受制时记忆力会阶段性下降，需要比别人付出两倍的汗水才能换来同样的成果。这不是你不聪明，而是能量分散了。", "勤能补拙是良训。你适合选择那些老成持重、讲求经验积累的专业，如财会、设计或传统工艺。在安静、封闭的环境下学习效率最高，远离纷杂的社交。")]
    },
    "事业": {
        "strong": [("事业版图宏大，你天生就是指挥千军万马的帅才。那种‘虽千万人吾往矣’的决策魄力，让你在职场中具备不可替代的核心地位。无论是身居高位还是自主创业，你都能在时代的浪潮中划出自己的印记。", "你的事业运极具‘侵略性’，总能在别人看不见的荒漠中开辟出绿洲。建议在中后期加强团队的‘文化凝聚力’，而不仅仅依靠奖惩。你的权柄将随着年龄的增长而愈发厚重。")],
        "weak": [("事业上适合走‘智囊团’或‘技术专家’路线。你不需要冲到第一线去拼杀，你的价值在于那点石成金的谋略和精益求精的专业细节。选对一个强势的领导者进行辅佐，你将获得超越大部分身强者的回报。", "不要频繁跨行，你的事业成功依赖于‘深根式’的积累。在一个垂直领域钻研十年，你就是那个行业的定海神针。晚年更是适合做高端顾问或传承类工作。")]
    },
    "婚姻": {
        "strong": [("情场上的主导者，你的伴侣往往会对你产生一种敬畏与依赖并存的情感。这种格局能让家庭稳如磐石，但也容易导致对方的‘自我消减’。建议多给伴侣表达空间，婚姻不是管理下属，而是灵魂的共振。", "典型的‘干柴烈火’配置，性格上的互补在于身体上的同步。在亲密关系中，你敢于表达需求，浪漫且富有激情。建议适度增加心灵沟通。")],
        "weak": [("在感情中你非常敏感且容易妥协，甚至有些卑微。你的一生都在为爱付出，但要防范伴侣的‘得寸进尺’。学会建立自己的心理边界，只有独立的灵魂才能换来长久的尊重。你的缘分多带有一些‘守护’色彩。", "容易在感情中受委屈，但你的韧性也是婚姻的保障。寻找一个性格温厚、能理解你细腻心思的伴侣，你将获得极大的情感慰藉。")]
    },
    "身强身弱用神": {
        "strong": [("身强用财官！你属于典型的‘有米有桶’。身强能克泄财官，用神应在克泄你的五行上。补充对应五行的颜色、方位，别太固执。", "身强补印比是忌讳，要勇于面对压力。用神在克泄之神上，压力是你发财的养料。")],
        "weak": [("身弱补印比！你现在底气不足，用神在生助你的五行上。如饥饿的人需面包。寻找贵人（印星），多和朋友聚聚增加能量场。", "身弱不担财官，需要印星化杀生身。寻找生命中的印星，多在东、南方等充满生机的方位活动。")]
    }
}

TRAIT_VARIATIONS = {
    "strong": [
        "**命局特征**：身旺能抗大任，你天生就是吃‘管理饭’或‘创业饭’的料。那种即便天塌下来也要先支撑住家室的责任感，是你最迷人的气质。这种格局必是商界或中高层管理决策的灵魂人物。",
        "**命局特征**：标准的富贵格雏形。你不仅具备极强的赚钱本领，更能通过财富转化为深厚的社会声望。这种‘名利双收’的潜力源于你坚韧不拔的意志。",
        "**命局特征**：典型的猛虎下山格。你的能量场极其强大，进入任何场合都能瞬间成为焦点，甚至改变周围人的情绪风向。要注意这种气场可能造成隐形压力。"
    ],
    "weak": [
        "**命局特征**：属于典型的‘先苦后甜’积累型命格。早年的坎坷是为了磨练你深邃的洞察力。你的成功不在于爆发力的掠夺，而在于通过十年如一日的专业深耕。",
        "**命局特征**：极其优质的辅助型人才，是任何顶级团队都渴望得到的‘幕僚长’。你脑子灵活，心思细腻，能看到常人察觉不到的风险。",
        "**命局特征**：命理学上典型的‘富贵在险中求’。虽然身弱，但你福报深厚，总能在关键时刻逢凶化吉。这种人缘红利让你即便在低谷也有人愿意拉你一把。"
    ]
}

RISK_VARIATIONS = {
    "财运": {
        "strong": ["**风险预警**：身旺最怕‘比劫夺财’，切记财不露白。今年若有大宗借贷或担保，哪怕是亲兄弟也要明算账。防止由于一时的义气而导致多年积蓄付诸东流。", "**风险预警**：劫财旺相，莫要把鸡蛋放进一个篮子里。在投资上你容易冲动，守成比扩张更重要。"],
        "weak": ["**风险预警**：身弱财旺，这叫‘富屋贫人’。切莫贪婪于高杠杆、虚拟货币等虚浮之财。那种财你拿不住，反而会压坏身体。稳扎稳打是发财的捷径。", "**风险预警**：财星太重耗身过早。切莫为了赚钱而透支健康。注意劳累过度导致的身体异常。"]
    },
    "事业": {
        "strong": ["**风险预警**：命中带伤官见官之象，在职场中要防范‘祸从口出’。即便你有理，也不要顶撞上司。交接关键合同时，必须留存所有沟通记录。", "**风险预警**：官杀过重反而束缚手脚。建议‘高筑墙、广积粮、缓称王’。过度的竞争会让你的职场寿命缩短。"],
        "weak": ["**风险预警**：身弱抗官难。晋升期间易有小人作梗或身体预警。要注意看似机会实则陷阱的任务。今年不宜频繁跳槽。", "**风险预警**：印星受挫时，职业地位岌岌可危。切莫参与任何职场派系斗争，老实做业务是唯一的自保之道。"]
    },
    "婚姻": {
        "strong": ["**风险预警**：感情宫位受冲，聚少离多或性格拉锯。不要试图去改变伴侣。学会给爱留白，给空间留气。", "**风险预警**：身强易忽视伴侣的声音。你的霸道可能换来伴侣长期的沉默。建议多花时间在家庭陪伴上。"],
        "weak": ["**风险预警**：身弱遇财官重。感情生活中你容易成为牺牲者。这种单方面的付出一旦断裂将无法修补。学会爱自己。", "**风险预警**：容易受异性诱惑而产生心理失衡。你需要多与长辈沟通，寻找定力。"]
    },
    "通用": {
        "strong": ["**风险预警**：流年若遇岁运并临，以静制动。身强之人最怕自信过度导致的‘翻车’。涉及大事需三思。", "**风险预警**：命中带有孤寡星，防孤芳自赏导致的资源断裂。多参与集体活动，增加人气。"],
        "weak": ["**风险预警**：身弱遇流年冲击，最忌‘雪上加霜’。守好底线，不要参与不熟悉领域。多晒太阳增加阳气。", "**风险预警**：防范‘耳根子软’导致的决策失误。寻找一个贵人作为咨询对象，将大大降低风险。"]
    }
}

class TreeNavigator:
    @staticmethod
    def get_caiyun_logic(a):
        is_strong = a['is_strong']
        cai_strong = a['cai_strong']
        if is_strong:
            if cai_strong:
                if a['has_shishang_sheng_cai']: return "身强财旺-食伤生财型", "你不仅底气足，脑子也灵。遍地金银且能靠智慧持续变现。", "建议放手博大，寻找长期赛道。"
                if a['guan_strong']: return "身强财旺-财官双美型", "名利双收。懂赚钱，懂权力，大企业高管之象。", "深耕核心主业，利用平台资源。"
                return "身强财旺-爆发型", "具备极强的横财运。财富增长是跳跃式的。", "注意积累，防范大起大落。"
            return "身强财弱-实干型", "身强力壮但财星不显。适合靠硬派技术或管理立身。", "深钻专业，用技能换财富。"
        else:
            if cai_strong:
                if a['yin_strong']: return "身弱财旺-印星护身型", "虽然财重压身，但有长辈或平台背书。分红稳当。", "多听长辈建议，不要轻易离职创业。"
                return "身弱财旺-求稳务实型", "典型的身弱不担财。赚小钱稳，赚大钱伤身。", "小富即安是福。远离杠杆操作。"
            return "身弱财弱-积累辅助型", "目前运势待助。重点不在于赚钱，而在积攒人脉和价值。", "先做贵人的左右手，借势起航。"

    @staticmethod
    def get_shiye_logic(a):
        if a['is_strong']:
            if a['guan_strong']: return "身强官旺-领军统帅型", "领导才能卓越。能带出虎狼之师，职场说了算。", "冲刺中高层管理岗。"
            if a['shishang_present']: return "身强-食神制杀型", "刚中带柔，不畏强权。危机时刻的猛将。", "发挥原则性，在复杂关系中站稳。"
            return "身强-自由开创型", "向往自由。事业往往在不断折腾和跨界中找到真谛。", "适合独立经营或做自由顾问。"
        else:
            if a['has_guan_yin_sheng']: return "身弱-官印相生型", "体面人。勤勉踏实，深受上司信任。位置稳固。", "利用信誉背书，走长青树路线。"
            if a['shishang_present']: return "身弱-伤官见官型", "常感怀才不遇。易因言获罪。选对地方价值极高。", "闭口深藏舌，学会职场圆滑术。"
            return "身弱-稳健辅助型", "适合成熟体系里的插件。只要不瞎搞，一生衣食无忧。", "选大厂，选老店，选稳定的饭票。"

    @staticmethod
    def get_hunyin_logic(a):
        if a['is_strong']:
            if a['bi_jie_duo_cai']: return "身强-比劫夺情冲突型", "竞争对手强。性格太硬易把人推远。最怕‘共枕不同心’。", "少点控制欲。推荐性格互补的伴侣。"
            return "身强-主导型", "情场主导者。防范伴侣的‘沉默式叛逆’导致感情裂缝。", "多听对方心声，浪漫不可少。"
        else:
            if a['guan_strong'] or a['cai_strong']: return "身弱-财官压制型", "感情压抑。付出常得不到对等尊重。容易被另一半拖累。", "挺起脊梁，学会拒绝。独立是最好的保鲜剂。"
            return "身弱-情感滋养型", "极其敏感。委曲求全换不来长久。婚姻需要独立人格。", "多关心身心健康。推荐找情绪价值高的伴侣。"

    @staticmethod
    def get_yongshen_logic(a):
        strength = a['strength']
        if a['tiaohou']: return f"调候先行-{a['tiaohou']}", f"**调候为大**：命局处于{a['tiaohou'].split('用')[0]}环境。气候失调，富贵也是虚火。", f"用神：{a['yongshen']}，喜神：{a['xishen']}"
        if a['is_strong']: return f"{strength}-克泄取用型", f"**身强取用**：日主能量过剩。遵循‘有财用财，无财用食’原则，方成大器。", f"用神：{a['yongshen']}，喜神：{a['xishen']}"
        return f"{strength}-生扶取用型", f"**身弱取用**：日主如弱苗。选取‘有印用印，无印用比’路线，抗住财官之压。", f"用神：{a['yongshen']}，喜神：{a['xishen']}"

SYSTEM_PROMPT = "你是一位精通三板斧命理体系的算命大师,风格专业准确且接地气。你擅长从八字推断身强身弱,并结合现实情况给出中肯建议。"

def generate_full_response_v2(topic, bazi_str, user_q):
    analyzer = BaziAnalyzer(bazi_str)
    a = analyzer.analyze()
    header = f"**八字解析**：您提供的是 {bazi_str}。日元【{analyzer.riyuan}】生于【{analyzer.yuezhi}】月。\n\n"
    diag = f"**诊断步骤**：\n1. **判定三要素**：①{'得令' if a['deling'] else '失令'} ②{'得地' if a['dedi'] else '失地'} ③{'得助' if a['dezhu'] else '失助'}。\n"
    diag += f"综合判定：当前格局为 **{a['strength']}**。"
    
    if topic == '财运':
        path, conc, adv = TreeNavigator.get_caiyun_logic(a)
        extra = f"2. **财星能量**：{'有力' if a['cai_strong'] else '虚浮' if a['god_counts']['财星']>0 else '不显'}。3. **路径匹配**：锁定【{path}】分支。"
    elif topic == '事业':
        path, conc, adv = TreeNavigator.get_shiye_logic(a)
        extra = f"2. **官杀能量**：{'得位' if a['guan_strong'] else '虚浮' if a['god_counts']['官杀']>0 else '不显'}。3. **路径匹配**：匹配【{path}】路径。"
    elif topic == '婚姻':
        path, conc, adv = TreeNavigator.get_hunyin_logic(a)
        extra = f"2. **宫星配置**：日坐{a['spouse_god']}。3. **路径匹配**：锁定【{path}】逻辑。"
    elif topic == '身强身弱用神':
        path, conc, adv = TreeNavigator.get_yongshen_logic(a)
        extra = f"2. **调候判定**：{a['tiaohou'] if a['tiaohou'] else '调候已足'}。3. **取用路线**：遵循【{path}】。"
    else:
        path, conc, adv = "专题研判", "目前处于积累期。", "稳扎稳打。"
        extra = f"2. **深度诊断**：锁定【{topic}】分析领域。"

    month_txt = random.choice(MONTHS_DESC.get(analyzer.yuezhi, ["月令玄妙。"]))
    trait = random.choice(TRAIT_VARIATIONS["strong" if a['is_strong'] else "weak"])
    risk_pool = RISK_VARIATIONS.get(topic, RISK_VARIATIONS["通用"])
    risk_tip = random.choice(risk_pool["strong" if a['is_strong'] else "weak"])
    vivid = VIVID_CONTENT.get(topic, {}).get("strong" if a['is_strong'] else "weak", [("常规逻辑", "期待转机")])
    detail, t_adv = random.choice(vivid)

    res = header + diag + extra + "\n\n"
    if topic == '身强身弱用神':
        res += f"**【用神精论】**：{conc}\n\n**【大师建议】**：{adv}\n\n**【格局详解】**：{trait}\n\n"
    else:
        res += f"**【{topic}研判】**：{conc}\n\n**【深度解析】**：{detail}\n\n{risk_tip}\n\n{trait}\n\n"
    res += f"**【生于{analyzer.yuezhi}月】**：{month_txt}\n\n**【最终建议】**：{adv} {t_adv}"
    return res

SCENARIOS = {
    "财运": ["手头紧，什么时候发财？", "做生意亏了，翻身难吗？", "打工命还是老板命？"],
    "事业": ["想考编，你看我行吗？", "领导刁难我，辞不辞？", "创业拿个主意。"],
    "婚姻": ["缘分在哪？", "对象素质怎么样？", "老吵架怎么办？"],
    "学业": ["孩子不爱学，天天玩。", "考研能上岸吗？", "选什么专业好？"],
    "子女": ["后代有出息吗？", "备孕没动静。", "孩子太倔怎么管？"],
    "官非风险": ["官司能赢吗？", "合伙人反水怎么办？", "总招小人。"],
    "夫妻生活": ["感情平淡冷清。", "两人不和谐。", "追求性致损财运吗？"],
    "身强身弱用神": ["大师看我这八字贵不贵？", "用神是什么？详细断。"]
}

def batch_generate_v2():
    biao_dir = Path("e:/SD/bazi/sanbanfu/biao")
    for topic in SCENARIOS:
        filename = biao_dir / f"{topic}_优化重建版.jsonl"
        print(f"Generating {topic}...")
        results = []
        seen = set()
        while len(results) < 50:
            bazi = random.choice(BAZI_SAMPLES)
            q = random.choice(SCENARIOS[topic])
            ans = generate_full_response_v2(topic, bazi, q)
            if (bazi + topic + q) not in seen:
                results.append({"messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": f"八字: {bazi}\n{q}"},
                    {"role": "assistant", "content": ans}
                ]})
                seen.add(bazi + topic + q)
        with open(filename, 'w', encoding='utf-8') as f:
            for item in results: f.write(json.dumps(item, ensure_ascii=False) + "\n")

if __name__ == "__main__":
    batch_generate_v2()
