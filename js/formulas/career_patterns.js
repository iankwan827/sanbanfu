/**
 * career_patterns.js
 * Professional career logic with scenario-based narratives and real-life examples.
 */

(function () {
    const E = window.BaziEngine || (window.BaziEngine = {});

    const patterns = [
        {
            id: "C_P_Official_Seal_Wealth",
            title: "财官印全 (富贵双全)",
            tags: ["仕途", "成功"],
            conditions: ["isSelfStrong", "hasOfficer", "hasSeal", "hasWealth"],
            path: "开启事业诊断 -> 能量饱满 -> 财官印俱全 -> 循环无阻 -> 资源护航 -> 富贵双全",
            narrative: "你这类命格在职场上可谓是‘顺风顺水’。你有天生的领导气质，且背后总有大背景或贵人撑腰。就像那种在大厂或体制内，还没开口提需求，领导就已经帮你把资源铺好的人。你适合走稳健的仕途或管理路线，贵人扎堆，只要你自己不掉链子，事业上限极高。比如在单位竞聘中，你往往是那个背景最硬、履历最漂亮且最被看好的候选人。"
        },
        {
            id: "C_P_Sha_Yin",
            title: "杀印相生 (威权之命)",
            tags: ["威权", "管理"],
            conditions: ["isSelfStrong", "hasOfficer", "hasSeal", "!hasWealth"],
            path: "开启事业诊断 -> 能量饱满 -> 见天干官杀 -> 见印星通关 -> 杀印相生 -> 威权制衡",
            narrative: "你非常擅长将‘压力’转化为‘动力’。在你的事业生涯中，往往能遇到对自己非常严厉但也非常有帮助的长辈或领导。你就像那种在极高压环境下依然能保持冷静、并最终获得团队高度认可的‘定海神针’。你适合在法律、监察、大型企业管理等需要严谨作风的岗位工作。比如在大家都束手无策的公关危机面前，你通过过硬的专业素养和决策力，一举扭转乾坤，这种‘化危为机’的能力是你事业成功的关键。"
        },
        {
            id: "C_P_Wealth_Gen_Official",
            title: "财生官旺 (商界精英)",
            tags: ["商业", "管理"],
            conditions: ["isSelfStrong", "hasOfficer", "hasWealth", "isWealthStrong", "!hasSeal"],
            path: "开启事业诊断 -> 能量饱满 -> 地支见财官 (厚实) -> 财星生官 -> 资源变现 -> 商界精英",
            narrative: "你的事业与财务是紧密绑定的。你不仅懂得如何赚钱，更懂得如何通过财富去杠杆更大的‘资源’和‘地位’。你就像那种在商场上游刃有余的操盘手，不仅能把项目做大，还能让合作伙伴心甘情愿地为你背书。说白了，你是那种能用钱生钱、又能用权护钱的聪明人。比如在一次跨国并购或者是大宗贸易中，你表现出的那种宏观视野和对金钱分配的艺术，会让竞争对手都感到心服口服。"
        },
        {
            id: "C_P_Official_Seal_NoWealth",
            title: "安稳体制 (铁饭碗)",
            tags: ["安稳", "体制"],
            conditions: ["isSelfStrong", "hasOfficer", "hasSeal", "!hasWealth"],
            path: "开启事业诊断 -> 能量饱满 -> 见天干官印 -> 排除克制 -> 稳健长青 -> 铁饭碗",
            narrative: "你的人生就是‘稳’字的代名词。虽然可能没有那种一夜暴富的冲击力，但你的职业路径非常平滑，属于典型的铁饭碗命格。说真的，你就是那种在朋友聚会中，大家伙都在吐槽裁员降薪，而你依然能气定神闲喝茶看报的人。你适合教师、医生或事业单位，名声大于实际财富，但胜在没有任何风浪。比如大家都在为房贷发愁时，你可能已经分到了单位房或者有极高的额外公积金保障。"
        },
        {
            id: "C_P_Killer_Food",
            title: "化杀为权 (开疆拓土)",
            tags: ["创业", "果决"],
            conditions: ["isSelfStrong", "hasOfficer", "!hasSeal", "hasFood"],
            path: "开启事业诊断 -> 能量饱满 -> 见官杀压制 -> 发现食伤抗压 -> 七杀有制 -> 化杀为权",
            narrative: "你属于那种‘在腥风血雨中拼杀’出来的狠角色。你眼里揉不得沙子，执行力强到让人头皮发麻。你就像那种公司初创期，一个人能顶一个团队的‘战神’，适合去搞那些高难度、高回报的项目。说白了，你天生就是带兵打仗的将军命。比如在项目卡死的时候，所有人都在推诿，你直接上去暴力破局，这种气魄让你能迅速在圈内建立威信。"
        },
        {
            id: "C_P_Alone_Warrior",
            title: "独行侠 (个体单干)",
            tags: ["单干", "自由"],
            conditions: ["isSelfStrong", "hasOfficer", "!hasSeal", "!hasFood", "hasBiJie"],
            path: "开启事业诊断 -> 能量饱满 -> 比劫众盛 -> 见官杀管控力弱 -> 无化制 -> 独行侠",
            narrative: "你这性格，坐办公室真的太委屈你了。你身上有股子不服管的劲头，特别是在那种层级森重的环境下，你很容易感觉压抑。你适合自己单干或者带个小团队，做那种‘小而美’的事业。就像那种资深的自由撰稿人或独立设计师，虽然累点，但胜在自在。比如在甲方提出无理要求时，你可能直接就回个‘不干了’，这种性格只有作为核心决策者才能发挥最大价值。"
        },
        {
            id: "C_P_Technical_Expert",
            title: "技术先锋 (脑力变现)",
            tags: ["技术", "专家"],
            conditions: ["isSelfStrong", "!hasOfficer", "hasFood"],
            path: "开启事业诊断 -> 能量饱满 -> 天干地支无官杀 -> 发现食伤泄秀 -> 灵气变现 -> 技术先锋",
            narrative: "你这就是典型的‘靠脑子吃饭’。在这个互联网或高新科技时代，你这类人最吃香。你对逻辑、创意或某些精密技术有种天生的直觉。在别人还在死记硬背的时候，你已经能看到背后的‘底层规则’了。你适合做架构师、高级研发或创意总监。比如在处理一个复杂的技术故障时，大家都在抓瞎，你几行代码或者一个点子就能解决问题，这种不可替代性就是你最大的事业护城河。"
        },
        {
            id: "C_P_Steady_Weak",
            title: "借力打力 (平稳过渡)",
            tags: ["借力", "稳健"],
            conditions: ["isSelfWeak", "hasOfficer", "hasSeal"],
            path: "开启事业诊断 -> 能量不足 (身弱) -> 见官杀克制 -> 确认印星护身 -> 官印相生 -> 平稳过渡",
            narrative: "你属于那种‘背靠大树好乘凉’的聪明人。虽然个人能量不算顶尖，但你特别能借力。你有一种‘化尴尬为机遇’的本事，领导越是给你压力，你反而能借着压力得到更多的资源。适合大厂后勤、行政或那种有强大背书的平台。比如你遇到个作风极其凌厉的领导，别人都被骂走了，你却能一边挨骂一边把领导的私人资源变成自己的职业筹码。"
        },
        {
            id: "C_P_Strong_General",
            title: "身强竞先 (自强不息)",
            tags: ["奋斗", "自强"],
            conditions: ["isSelfStrong"],
            path: "身强 -> 能量充沛",
            narrative: "你是个极其有干劲、性格也非常豪爽的人。在事业上，你不需要别人催促，自己就能像满格电的马达一样飞快运转。即便目前还没有遇到特别大红大紫的机遇，但你这种‘打不死、熬得住’的韧性，已经超越了大部分同龄人。说真的，你就是在等一个风口，风一旦来了，你就是那个能飞得最高的人。比如在大家都在抱怨行情不好的时候，你却能默默打磨职业技能，这种自信和自律是你未来翻盘的底气。"
        },
        {
            id: "C_P_Weak_General",
            title: "稳中求进 (厚积薄发)",
            tags: ["稳健", "修养"],
            conditions: ["isSelfWeak"],
            path: "身弱 -> 稳扎稳打",
            narrative: "你在事业上非常有‘灵气’且懂得避重就轻。虽然可能有时候会觉得体力和精力跟不上野心，但这恰恰提醒你要学会‘巧干’而不是‘苦干’。你适合做那些门槛高、专业性强的细分领域，通过长期积累的复利来取胜。就像那种即便不经常在社交场合露面，但圈子里一提到某项业务就必然会想起你的人。比如在面临巨大的职场变动时，你总能敏锐地察觉到风向，并提前做好自我保护和过渡，这种智慧比蛮力更重要。"
        },
        {
            id: "C_P_Luck_History",
            title: "事业春秋 (阶段回顾与展望)",
            tags: ["阶段", "里程碑"],
            conditions: ["hasSuccessCareerLuck"],
            path: "生涯岁运流转 -> 事业里程碑",
            narrative: "回顾或展望你的职业生涯，岁运的起伏点起到了至关重要的‘节拍器’作用。特别是在这些关键阶段（${careerLuckDetails}），是你事业能量最为聚合、也最容易出成果的时期。就像马拉松选手的冲刺阶段，这些年份是你提升职业段位、积累行业声望的黄金窗口。如果你正处于这些阶段，应当顺势而为，积攒能量；如果已经过去，这些经历也为你沉淀了宝贵的‘江湖经验’。"
        },
        {
            id: "C_P_Selection_Officer_Strong",
            title: "当前：权威落地 (事业晋升机缘)",
            tags: ["提升", "落实"],
            conditions: ["isSelectedYearOfficer", "isSelfStrong"],
            path: "流年透出官杀 -> 自身能量足以胜任 -> 权威着陆",
            narrative: "您当前选中的 ${selectedLuckDetails} 呈现出极其明确的‘权威落地’信号。岁运中透出的 **${selectedLnGod}** 正好能为您强旺的本气提供施展才华的‘着力点’。这不仅是名誉的提升，更是权责的实质性扩充。今年非常适合落实具体的管理计划、申请职位晋升或承接重任。这种能量的闭环，是您事业版图中一个高价值的增长极。"
        },
        {
            id: "C_P_Selection_Wealth_Strong",
            title: "当前：财富扩张 (业务增长红利)",
            tags: ["扩展", "红利"],
            conditions: ["isSelectedYearWealth", "isSelfStrong"],
            path: "流年透出财星 -> 自身能量足以克收 -> 财富扩张",
            narrative: "当前选中的 ${selectedLuckDetails} 为您带来了显著的‘财富红利期’。流年见的 **${selectedLnGod}** 就像是摆在面前的一块蛋糕。由于您原局气场饱满，完全有能力将这些机会转化为实质的财务收益。今年适合加大业务投入、开启新的商业项目或进行大宗资产配置。请留意，这种‘动能’在 ${selectedLnGod} 的加持下，转化率会远高于平时。"
        },
        {
            id: "C_P_Selection_Output_Strong",
            title: "当前：才华横溢 (创意变现季)",
            tags: ["创意", "变现"],
            conditions: ["isSelectedYearOutput", "isSelfStrong"],
            path: "流年透出食伤 -> 自身能量充沛输出 -> 华彩尽显",
            narrative: "在选中的 ${selectedLuckDetails} 中，您的‘磁场核心’转向了 **${selectedLuckEnergy}**。流年透出的 **${selectedLnGod}** 极大地引动了您的创造灵感。如果您从事的是创意、社交或教育行业，这绝对是一个‘高曝光、高回报’的年份。不要吝啬您的点子，此时正是将脑力转化为影响力和实利的绝佳窗口。您的能量输出正处于一种‘正向溢出’状态。"
        },
        {
            id: "C_P_Selection_Officer_Weak",
            title: "当前：高压洗礼 (职场减压预警)",
            tags: ["压力", "警示"],
            conditions: ["isSelectedYearOfficer", "isSelfWeak", "!hasSeal"],
            path: "流年透出官杀 -> 自身能量匮乏 -> 无印星通关 -> 高压洗礼",
            narrative: "注意了！在您选中的 ${selectedLuckDetails}，流年透出的 **${selectedLnGod}** 对您的能量形成了一次明显的‘刚性挤压’。在缺乏印星保护的情况下，这一年您可能会感到莫名的疲惫，或者是职场上的琐碎压力、合规要求让您喘不过气来。这不是横冲直撞的时候，建议您以‘守’为主，避开高强度的正面冲突，重点观察身体发出的疲劳信号。"
        },
        {
            id: "C_P_Selection_Seal_Weak",
            title: "当前：贵人加持 (补氧与沉淀)",
            tags: ["贵人", "提升"],
            conditions: ["isSelectedYearSeal", "isSelfWeak"],
            path: "流年透出印星 -> 为身弱原局补氧 -> 贵人加持",
            narrative: "恭喜！您选中的 ${selectedLuckDetails} 正是您事业上的‘能量加油站’。流年见的 **${selectedLnGod}** 为您带来了宝贵的印星支持。这意味着，在这个特定的时空节点下，您非常容易遇到能在关键环节拉您一把的‘贵人’，或者获得进修、考证、平台背书的大好机会。这也是一个非常适合调养身心、深度思考职业蓝图的年份。顺应这种‘接入’的能量，能让您在未来的竞争中走得更稳。"
        },
        {
            id: "C_P_Selection_Fallback",
            title: "当前事业磁场解析",
            tags: ["当下", "解析"],
            conditions: ["isAnyYearSelected", "!isSelectedYearOfficer"],
            path: "定位当前选择岁运 -> 事业基础解析",
            narrative: "您当前选中的是 ${selectedLuckDetails}。在这个特定的时空节点下，岁运的能量主要表现为‘${isSelectedYearAnalysis}’的交互过程。建议重点观察流年对事业宫（月支）及日元的引动情况，这是观察职场环境变迁与个人状态调整的最佳窗口。"
        }
    ];

    E.PatternEngine.registerPatterns('career', patterns);
})();
