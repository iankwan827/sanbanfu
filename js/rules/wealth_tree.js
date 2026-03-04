/**
 * wealth_tree.js
 * "Waterfall" Decision Tree for Wealth (财)
 * 
 * Architecture:
 * 1. Declarations (Nodes & Results)
 * 2. Wiring (Conditionals & Chaining)
 * 3. Root Registration
 */

(function () {
    const E = window.DecisionEngine;
    const { createNode, createResult } = E;

    // Helper: Link result node to Next Block
    const linkToNext = (node, nextNode) => {
        if (node && nextNode) node.yes(nextNode);
        return node;
    };

    // =========================================================================
    // 1. ALL NODE & RESULT DECLARATIONS (Hoisted for safe wiring)
    // =========================================================================

    // --- Roots & Chain Entry Points ---
    const root = createNode('Wealth_Root', '能否身强身弱?');
    const node_A1_Start = createNode('A1_start', '检查财星逻辑?');
    const node_A2_Start = createNode('A2_start', '检查官杀逻辑?');
    const node_A3_Start = createNode('A3_start', '检查忌神印 (思想包袱)?');
    const node_B_Start = createNode('B_start', '检查身弱财运逻辑?');
    const node_C_Start = createNode('C_start', '检查大运逻辑?');
    const node_D_Start = createNode('D_start', '检查流年逻辑?');

    // --- Section A: Self Strong (Path Isolated) ---
    const node_A1_HasW = createNode('A1_hasW', '是否有财?');
    const node_A1_StrongW = createNode('A1_strongW', '分析财力强弱');

    // A1-S: Strong Wealth Sub-Path
    const node_A1_S_Food = createNode('A1_S_Food', '有食伤?');
    const node_A1_S_Seal = createNode('A1_S_Seal', '忌神印?');
    const node_A1_S_Break = createNode('A1_S_Break', '财克印?');
    const node_A1_S_Officer = createNode('A1_S_Officer', '官杀弱?');
    const node_A1_S_GenOff = createNode('A1_S_GenOff', '财生官?');

    // A1-W: Weak Wealth Sub-Path
    const node_A1_W_Food = createNode('A1_W_Food', '分析财源 (食伤)');
    const node_A1_W_Rob = createNode('A1_W_Rob', '比劫夺财?');
    const node_A1_W_Seal = createNode('A1_W_Seal', '忌神印?');
    const node_A1_W_NoRoot = createNode('A1_W_NoRoot', '财星透干没根?');
    const node_A1_W_Officer = createNode('A1_W_Officer', '官杀旺?');
    const node_A1_W_Damaged = createNode('A1_W_Damaged', '财星受损?');

    const node_A1_NoW_Food = createNode('A1_now_food', '有无食伤通关?');
    const node_A1_NoW_WithFood = createNode('A1_now_with_food', '有食伤');
    const node_A1_NoW_NoFood = createNode('A1_now_no_food', '无食伤');

    // --- Section B: Self Weak (Additive) ---
    const node_B_Check_Volume = createNode('B_check_vol', '财星是否过旺?');
    const node_B_Check_Help = createNode('B_check_help', '印星为用?');
    const node_B_Check_Official = createNode('B_check_off', '官杀旺且财滋杀?');
    const node_B_Check_Robber = createNode('B_check_rob', '同柱比劫夺财?');
    const node_B_Fallback = createNode('B_fallback', '是否由于孤立?');

    // --- Section C: Da Yun (Tiered & Lowercase Fix) ---
    const node_C_pattern_DoubleW = createNode('C_pattern_DoubleW', '是否干支双财?');
    const node_C_pattern_DoubleF = createNode('C_pattern_DoubleF', '是否干支双食?');
    const node_C_pattern_DoubleO = createNode('C_pattern_DoubleO', '是否干支双官?');
    const node_C_split_branch = createNode('C_split_branch', '分析大运地支');
    const node_C_split_stem = createNode('C_split_stem', '分析大运天干');

    const node_C_w_branch = createNode('C_w_branch', '地支财?');
    const node_C_t_branch = createNode('C_t_branch', '地支库?');
    const node_C_f_branch = createNode('C_f_branch', '地支食伤?');
    const node_C_o_branch = createNode('C_o_branch', '地支官杀?');

    const node_C_w_stem = createNode('C_w_stem', '天干财?');
    const node_C_f_stem = createNode('C_f_stem', '天干食伤?');
    const node_C_o_stem = createNode('C_o_stem', '天干官杀?');

    // --- Section D: Liu Nian ---
    const node_D_ClashTomb = createNode('D_clashTomb', '流年冲财库?');
    const node_D_WealthStrong = createNode('D_wealthStrong', '流年财星旺?');
    const node_D_WealthNoOrder = createNode('D_wNoOrder', '财不得令?');
    const node_D_WealthOrder = createNode('D_wOrder', '财得令?');
    const node_D_W_Food = createNode('D_w_food', '有食伤生财?');
    const node_D_Food = createNode('D_food', '流年食伤生财?');
    const node_D_WO = createNode('D_WO', '流年财官双显?');

    // --- RESULTS ---
    const res_A1_Entrepreneur = createResult('res_A1_Ent', '顶级创业者 (食伤生财)', {
        desc: '你不仅身体棒、有干劲，而且脑子灵光（食伤生财），刚好外面还满地是黄金。这种配置是顶级创业者的典型，属于能够持续创造并守住巨额财富的类型。',
        tags: ['顶级创业']
    });
    const res_A1_LabS = createResult('res_A1_LabS', '蛮力劳碌 (财强无食)', {
        desc: '精力极其旺盛，但命局里既没目标也没路子。虽然勤快，但总是抓不住重点，赚的都是辛苦汗水钱。稍微赚到一点钱，很快就会因为各种开销、突发状况或者自己的决策失误而花掉。这种能量无处排解，往往导致性格固执、孤傲。',
        tags: ['劳碌']
    });
    const res_A1_LabW = createResult('res_A1_LabW', '蛮力劳碌 (财弱无食)', {
        desc: '精力极其旺盛，但命局里既没目标也没路子。虽然勤快，但总是抓不住重点，赚的都是辛苦汗水钱。稍微赚到一点钱，很快就会因为各种开销、突发状况或者自己的决策失误而花掉。这种能量无处排解，往往导致性格固执、孤傲。',
        tags: ['劳碌']
    });
    const res_A1_StoneGold = createResult('res_A1_Sto', '点石成金 (技术专长)', {
        desc: '这种人可能不是一夜暴富，但他有“点石成金”的技术或专长。因为财富是靠才华源源不断创造出来的，所以这种富贵非常稳固，细水长流。',
        tags: ['技术专长']
    });
    const res_A1_Robbed = createResult('res_A1_Rob', '存不住钱 (比劫夺财)', {
        desc: '钱刚到手，就有各种亲戚朋友、突发状况来把钱分走。这种人看着在赚钱，实际上存不住钱，总是处在一种“刚够花”甚至要倒贴的状态。',
        tags: ['比劫夺财']
    });
    const res_A1_TalentNoRoad = createResult('res_A1_Tal', '怀才不遇 (才华无变现)', {
        desc: '脑子极好，想法极多，但缺乏变现渠道或商业意识。这种人能写出好代码 or 做出好产品，但不懂怎么卖钱，常年处于“清贫”状态。',
        tags: ['怀才不遇']
    });
    const res_A1_LaborNoW = createResult('res_A1_Lab2', '蛮力劳碌 (无财无食)', {
        desc: '虽然勤快，但总是抓不住重点，赚的都是辛苦汗水钱。手里有点小钱但没后续，因为身旺克财狠，这钱很快就花光。精力极其旺盛，但命局里既没目标也没路子。这种能量无处排解，往往导致性格固执、孤傲。在古代常被看作僧道之命，在现代则是典型的社会闲散人员，无财可求。',
        tags: ['劳碌']
    });

    const res_A2_RichNoble = createResult('res_A2_RichNoble', '由富入贵 (财生官)', {
        desc: '这就是典型的“由富入贵”。通过财富积累提升了社会地位，或者在职场上通过出色的业绩获得了权力和名望。既有钱又有社会影响力。',
        tags: ['富贵']
    });
    const res_A2_EmptyFame = createResult('res_A2_EmptyFame', '虚名清贫 (官弱无财)', {
        desc: '有职位、有名声，但因为没有经济基础支撑，只是个空架子，极其清贫，这种人虽然有责任感、有地位，但往往“穷得叮当响”。手里没有资源、没有经费。',
        tags: ['虚名']
    });
    const res_A2_HonorPoor = createResult('res_A2_HonorPoor', '压力致贫 (有名无实)', {
        desc: '事业压力大、责任重，但没有对应的财富回报，一辈子都在为名声 and 责任“倒贴”。这种人在现实中可能是个官，或者是个小领导，但他极其清贫。',
        tags: ['压力']
    });
    const res_A2_Disaster = createResult('res_A2_Disaster', '因财招灾 (财星受损)', {
        desc: '这种人性格极刚，容易因为事业上的争端、官司、或者为了维护名誉而大破其财。事业越成功，赔的钱可能越多。',
        tags: ['因财招灾']
    });

    const res_A3_Break = createResult('res_A3_Break', '破局求财 (财克印)', {
        desc: '这叫“破局”。代表你敢于打破常规，摆脱思想束袱去求财。这种财富往往带有投机性、突发性，比如拆迁、股市暴涨或意外之财，但因为是“克”出来的，过程会比较刺激',
        tags: ['破局']
    });
    const res_A3_Dreamer = createResult('res_A3_Dreamer', '纸上谈兵 (忌印无财)', {
        desc: '完全被思想、懒惰或旧观念困住，一点务实行动都没有。这种人往往“眼高手低”，想得非常多，但行动力极差。',
        tags: ['空想']
    });
    const res_A3_Burden = createResult('res_A3_Burden', '力不从心 (旧习难改)', {
        desc: '他可能会去尝试做生意，或者尝试改变生活，但由于旧的思维习惯（印）太深，或者家庭/名声的负担太重，导致财富还没赚到，就被这些负担给拖垮了。',
        tags: ['负担']
    });

    const res_B_Weak_Alone = createResult('res_B_Alone', '身弱无助 (求财艰难)', {
        desc: '身弱且无印比帮身，求财非常吃力。往往是“富屋贫人”，看着机会多但抓不住，或者是为了赚钱透支身体健康。',
        tags: ['身弱无助']
    });
    const res_B_Backing = createResult('res_B_Backing', '背靠大树 (印比帮身)', {
        desc: '这种人是“背靠大树好乘凉”。你虽然个人能力不算最顶尖，但你特别能借力，有贵人帮、有平台靠。只要你不因为贪财而坏了名声或得罪贵人，你就能过上很富足的生活',
        tags: ['印比帮身']
    });
    const res_B_Debt = createResult('res_B_Debt', '因财招灾 (财生杀旺)', {
        desc: '本就压力大，还要为了赚钱去举债或冒险，结果财富变成了催命符，导致债务或官司。典型的“因财招灾”或“举债创业”。',
        tags: ['财生杀']
    });
    const res_B_Share = createResult('res_B_Share', '比劫夺财 (合作分利)', {
        desc: '虽有帮身，但因为“劫财坐财”（同柱），代表帮你的贵人同时也在惦记着你的钱。适合合作求财，但必须接受“分利”，甚至要防备合作伙伴反水。',
        tags: ['同柱夺财']
    });
    const res_B_RichPoor = createResult('res_B_RichPoor', '身弱财多 (富屋贫人)', {
        desc: '这种人往往经手之钱千千万，最后没几个剩兜里，常年为钱奔波却难以留财，就像一个小孩在闹市里扛着一袋金子，不仅拿不动，还可能把自己压垮。',
        tags: ['身弱财多']
    });

    const res_C_Boom = createResult('res_C_Boom', '财富爆发 (干支双显)', {
        desc: '十年内财富增长快，既有赚钱的门道，又能守得住大财，事业规模扩张极快，适合投资和创业',
        tags: ['干支双显']
    });
    const res_C_DoubleFood = createResult('res_C_FameHigh', '典型的“才华变现”', {
        desc: '典型的“才华变现”。你的想法能迅速落地成产品或服务，且市场认可度极高。这种组合最适合创业或从事自由职业。',
        tags: ['干支食伤']
    });
    const res_C_DoubleOff = createResult('res_C_Risk', '机遇与压力 (干支官杀)', {
        desc: '这种运势压力与机遇并存。如果身强能担，则是贵不可言，能在高层社交圈中获利；如果身弱，则要提防因财生灾或压力过大',
        tags: ['干支官杀']
    });
    const res_C_Stem_W = createResult('res_C_Exposed', '大运走财地 (大运天干财)', {
        desc: '代表“财露”。这十年赚钱的机会很多，社交广泛，大家都觉得你很有钱（名声在外）。但如果地支没有根基，这种财往往是虚火，容易财来财去。',
        tags: ['大运天干财']
    });
    const res_C_Stem_F = createResult('res_C_Fame', '大运走食伤 (大运天干食伤)', {
        desc: '代表“想法和名气”。你会有很多新奇的创意、投资的冲动，或者在表达、设计、演艺方面获得关注。这是“名大于利”的阶段。',
        tags: ['大运天干食']
    });
    const res_C_Stem_O = createResult('res_C_Rank', '大运走官杀 (大运天干官杀)', {
        desc: '主“职务和名誉”。容易获得职位晋升、遇到显贵的合作伙伴，或者社会地位提高。此时的“财生官”表现为花钱买名声、买地位。',
        tags: ['大运天干官']
    });
    const res_C_Branch_W = createResult('res_C_Hidden', '大运走财地 (大运地支财)', {
        desc: '代表“财藏”。这是实实在在的财富积累。即使你表面很低调，但私下资产丰厚、现金流稳健。地支的财才是真正的“发财”根基',
        tags: ['大运地支财']
    });
    const res_C_Branch_F = createResult('res_C_Skill', '大运走食伤 (大运地支食)', {
        desc: '代表“技术和财源”。你拥有过人的专业技能或生产能力，能默默地通过技术或细分领域赚到钱。地支食伤是财的“源头”。',
        tags: ['大运地支食']
    });
    const res_C_Branch_O = createResult('res_C_Power', '大运走官杀 (大运地支官杀)', {
        desc: '主“权力和管理”。代表你手握实权，管理的企业或部门运营稳健。此时的“官护财”表现为你的事业有强大的后台或制度保障。',
        tags: ['大运地支官']
    });
    const res_C_Branch_T = createResult('res_C_TombStore', '大运见财库 (地支遇库)', {
        desc: '地支见库。代表“财藏”。这是实实在在的财富积累。即使你表面很低调，但私下资产丰厚、现金流稳健。地支的财才是真正的“发财”根基',
        tags: ['大运财库']
    });

    const res_D_Windfall = createResult('res_D_Windfall', '意外之财 (冲财库)', {
        desc: '当年财富爆发，容易获得意外之财。',
        tags: ['冲财库']
    });
    const res_D_EasyMoney = createResult('res_D_Easy', '赚钱容易 (流年财旺)', {
        desc: '当年财运好，赚钱容易，适合积极求财。',
        tags: ['流年财旺']
    });
    const res_D_FakeMoney = createResult('res_D_Fake', '财来财去 (流年财弱)', {
        desc: '看着有钱，实则亏损或被劫财。',
        tags: ['流年财弱']
    });
    const res_D_HardMoney = createResult('res_D_Hard', '辛苦钱 (流年食伤生财)', {
        desc: '赚钱较辛苦，但最终能拿到手，有贵人帮。',
        tags: ['食伤生财']
    });
    const res_D_Explode = createResult('res_D_Exp', '爆发式增长 (流年财得令)', {
        desc: '赚钱极其容易，爆发式增长。',
        tags: ['流年财得令']
    });
    const res_D_Talent = createResult('res_D_Talent', '才华赚钱 (流年食伤)', {
        desc: '当年靠才华赚钱，适合开展新项目。',
        tags: ['流年食伤']
    });
    const res_D_Career = createResult('res_D_Career', '名利双收 (流年财官双显)', {
        desc: '当年既有财富又有地位，事业财运双丰收。',
        tags: ['流年财官']
    });

    // =========================================================================
    // 2. WIRING (Logic Flow)
    // =========================================================================

    // --- ROOT ---
    root.setCondition(ctx => ctx.isSelfStrong).yes(node_A1_Start).no(node_B_Start);

    // --- Section A: Body Strong ---
    node_A1_Start.yes(node_A1_HasW).setCondition(() => true);
    node_A1_HasW.setCondition(ctx => ctx.hasWealth).yes(node_A1_StrongW).no(node_A1_NoW_Food);

    // Decision: Strong vs Weak Wealth
    node_A1_StrongW.setCondition(ctx => ctx.isWealthStrong).yes(node_A1_S_Food).no(node_A1_W_Food);

    // -- Strong Wealth (S) Branch --
    node_A1_S_Food.setCondition(ctx => ctx.isOutputStrong).yes(res_A1_Entrepreneur).no(res_A1_LabS);
    linkToNext(res_A1_Entrepreneur, node_A1_S_Seal);
    linkToNext(res_A1_LabS, node_A1_S_Seal);

    node_A1_S_Seal.setCondition(ctx => ctx.isSealTaboo).yes(node_A1_S_Break).no(node_A1_S_Officer);
    node_A1_S_Break.setCondition(ctx => ctx.isWealthBreaksSeal).yes(res_A3_Break).no(node_A1_S_Officer);
    linkToNext(res_A3_Break, node_A1_S_Officer);

    node_A1_S_Officer.setCondition(ctx => ctx.hasOfficer && !ctx.isOfficerStrong).yes(node_A1_S_GenOff).no(node_C_Start);
    node_A1_S_GenOff.setCondition(ctx => ctx.isWealthGenOfficer).yes(res_A2_RichNoble).no(node_C_Start);
    linkToNext(res_A2_RichNoble, node_C_Start);

    // -- Weak Wealth (W) Branch --
    node_A1_W_Food.setCondition(ctx => ctx.isOutputStrong).yes(res_A1_StoneGold).no(res_A1_LabW);
    linkToNext(res_A1_StoneGold, node_A1_W_Rob);
    linkToNext(res_A1_LabW, node_A1_W_Rob);

    node_A1_W_Rob.setCondition(ctx => ctx.isBiJieRobbing).yes(res_A1_Robbed).no(node_A1_W_Seal);
    linkToNext(res_A1_Robbed, node_A1_W_Seal);

    node_A1_W_Seal.setCondition(ctx => ctx.isSealTaboo).yes(node_A1_W_NoRoot).no(node_A1_W_Officer);
    node_A1_W_NoRoot.setCondition(ctx => !ctx.wealthRooted).yes(res_A3_Burden).no(node_A1_W_Officer);
    linkToNext(res_A3_Burden, node_A1_W_Officer);

    node_A1_W_Officer.setCondition(ctx => ctx.isOfficerStrong).yes(node_A1_W_Damaged).no(node_C_Start);
    node_A1_W_Damaged.setCondition(ctx => ctx.isWealthDamaged).yes(res_A2_Disaster).no(node_C_Start);

    linkToNext(res_A2_Disaster, node_C_Start);

    // -- No Wealth Branch --
    node_A1_NoW_Food.setCondition(ctx => ctx.hasFood).yes(node_A1_NoW_WithFood).no(node_A1_NoW_NoFood);
    node_A1_NoW_WithFood.yes(res_A1_TalentNoRoad).setCondition(() => true);
    node_A1_NoW_NoFood.yes(res_A1_LaborNoW).setCondition(() => true);
    linkToNext(res_A1_TalentNoRoad, node_C_Start);
    linkToNext(res_A1_LaborNoW, node_C_Start);

    // --- Section B: Self Weak ---
    node_B_Start.yes(node_B_Check_Volume).setCondition(() => true);
    node_B_Check_Volume.setCondition(ctx => ctx.isWealthStrong).yes(res_B_RichPoor).no(node_B_Check_Help);
    linkToNext(res_B_RichPoor, node_B_Check_Help);
    node_B_Check_Help.setCondition(ctx => ctx.hasSeal || ctx.hasRob).yes(res_B_Backing).no(node_B_Check_Official);
    linkToNext(res_B_Backing, node_B_Check_Official);
    node_B_Check_Official.setCondition(ctx => ctx.isOfficerStrong && ctx.isWealthGenOfficer && !ctx.hasSeal).yes(res_B_Debt).no(node_B_Check_Robber);
    linkToNext(res_B_Debt, node_B_Check_Robber);
    node_B_Check_Robber.setCondition(ctx => ctx.isBiJieSamePillar).yes(res_B_Share).no(node_B_Fallback);
    linkToNext(res_B_Share, node_C_Start);
    node_B_Fallback.setCondition(ctx => !ctx.hasSeal && !ctx.hasRob && !ctx.isWealthStrong && !ctx.isOfficerStrong && !ctx.isBiJieSamePillar).yes(res_B_Weak_Alone).no(node_C_Start);
    linkToNext(res_B_Weak_Alone, node_C_Start);


    // --- Section C: Da Yun ---
    node_C_Start.yes(node_C_pattern_DoubleW).setCondition(() => true);
    node_C_pattern_DoubleW.setCondition(ctx => ctx.isDaYunWealthCorroborated).yes(res_C_Boom).no(node_C_pattern_DoubleF);
    linkToNext(res_C_Boom, node_D_Start);
    node_C_pattern_DoubleF.setCondition(ctx => ctx.isDyFoodStem && ctx.getGods('食伤').some(g => !g.isStem && g.pillarIndex === 4)).yes(res_C_DoubleFood).no(node_C_pattern_DoubleO);
    linkToNext(res_C_DoubleFood, node_D_Start);
    node_C_pattern_DoubleO.setCondition(ctx => ctx.isDyOfficerStem && ctx.getGods('官杀').some(g => !g.isStem && g.pillarIndex === 4)).yes(res_C_DoubleOff).no(node_C_split_branch);
    linkToNext(res_C_DoubleOff, node_D_Start);

    node_C_split_branch.yes(node_C_w_branch).setCondition(() => true);
    node_C_w_branch.setCondition(ctx => ctx.getGods('财星').some(g => !g.isStem && g.pillarIndex === 4)).yes(res_C_Branch_W).no(node_C_t_branch);
    linkToNext(res_C_Branch_W, node_C_f_branch);
    node_C_t_branch.setCondition(ctx => ctx.isDaYunTomb).yes(res_C_Branch_T).no(node_C_f_branch);
    linkToNext(res_C_Branch_T, node_C_f_branch);
    node_C_f_branch.setCondition(ctx => ctx.getGods('食伤').some(g => !g.isStem && g.pillarIndex === 4)).yes(res_C_Branch_F).no(node_C_o_branch);
    linkToNext(res_C_Branch_F, node_C_o_branch);
    node_C_o_branch.setCondition(ctx => ctx.getGods('官杀').some(g => !g.isStem && g.pillarIndex === 4)).yes(res_C_Branch_O).no(node_C_split_stem);
    linkToNext(res_C_Branch_O, node_C_split_stem);

    node_C_split_stem.yes(node_C_w_stem).setCondition(() => true);
    node_C_w_stem.setCondition(ctx => ctx.isDyWealthStem).yes(res_C_Stem_W).no(node_C_f_stem);
    linkToNext(res_C_Stem_W, node_D_Start);
    node_C_f_stem.setCondition(ctx => ctx.isDyFoodStem).yes(res_C_Stem_F).no(node_C_o_stem);
    linkToNext(res_C_Stem_F, node_D_Start);
    node_C_o_stem.setCondition(ctx => ctx.isDyOfficerStem).yes(res_C_Stem_O).no(node_D_Start);
    linkToNext(res_C_Stem_O, node_D_Start);

    // --- Section D: Liu Nian ---
    node_D_Start.yes(node_D_ClashTomb).setCondition(() => true);
    node_D_ClashTomb.setCondition(ctx => ctx.isLiuNianClashTomb).yes(res_D_Windfall).no(node_D_WealthStrong);
    linkToNext(res_D_Windfall, node_D_WealthStrong);
    node_D_WealthStrong.setCondition(ctx => ctx.isLiuNianWealth).yes(res_D_EasyMoney).no(node_D_Food);
    res_D_EasyMoney.yes(node_D_WealthNoOrder);
    node_D_WealthNoOrder.setCondition(ctx => ctx.isLiuNianWealthWeak).yes(res_D_FakeMoney).no(node_D_WealthOrder);
    linkToNext(res_D_FakeMoney, node_D_Food);
    node_D_WealthOrder.setCondition(ctx => ctx.isLiuNianWealthStrong).yes(res_D_Explode).no(node_D_W_Food);
    linkToNext(res_D_Explode, node_D_Food);
    node_D_W_Food.setCondition(ctx => ctx.hasFood || ctx.isLiuNianFood).yes(res_D_HardMoney).no(node_D_Food);
    linkToNext(res_D_HardMoney, node_D_Food);
    node_D_Food.setCondition(ctx => ctx.isLiuNianFood).yes(res_D_Talent).no(node_D_WO);
    linkToNext(res_D_Talent, node_D_WO);

    node_D_WO.setCondition(ctx => ctx.isLiuNianGenOfficer).yes(res_D_Career).no(null);

    // =========================================================================
    // 3. REGISTRATION
    // =========================================================================
    E.Engine.registerTree('wealth', root);

})();
