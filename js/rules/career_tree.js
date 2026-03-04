/**
 * career_tree.js
 * Decision Tree for Career (事业)
 */

(function () {
    const E = window.DecisionEngine;
    const { createNode, createResult } = E;

    // =========================================================================
    // 1. ALL NODE & RESULT DECLARATIONS
    // =========================================================================

    const root = createNode('Career_Root', '分析事业原局');

    // --- Section: Self Strong ---
    const node_Strong_Start = createNode('Career_Strong_Start', '身强：官杀为用?');
    const node_Strong_Seal = createNode('Career_Strong_Seal', '有印化官?');
    const node_Strong_Food = createNode('Career_Strong_Food', '有食伤生财?');
    const node_Strong_NoSeal_Kill = createNode('Career_Strong_NoSeal_Kill', '有食伤制杀?');
    const node_Strong_BiJie = createNode('Career_Strong_BiJie', '比劫帮身?');
    const node_Strong_BiJieRob = createNode('Career_Strong_BiJieRob', '比劫夺财?');
    const node_Strong_WealthOff = createNode('Career_Strong_WealthOff', '有财生官?');
    const node_Strong_PureOff = createNode('Career_Strong_PureOff', '官杀纯正?');

    // --- Section: Self Weak ---
    const node_Weak_Start = createNode('Career_Weak_Start', '身弱：官杀为用?');
    const node_Weak_Seal = createNode('Career_Weak_Seal', '有印化官?');
    const node_Weak_SealPower = createNode('Career_Weak_SealPower', '印星有力?');
    const node_Weak_NoSeal_Kill = createNode('Career_Weak_NoSeal_Kill', '有食伤制杀?');
    const node_Weak_BiJie = createNode('Career_Weak_BiJie', '需比劫帮?');
    const node_Weak_WealthOff = createNode('Career_Weak_WealthOff', '有财生官?');
    const node_Weak_WealthStrong = createNode('Career_Weak_WealthStrong', '身弱财旺?');

    // --- Section: No Officer Star ---
    const node_NoOff_Start = createNode('Career_NoOff_Start', '无官杀星：有财星?');
    const node_NoOff_WealthOff = createNode('Career_NoOff_WealthOff', '财星生官?');
    const node_NoOff_WealthStrong = createNode('Career_NoOff_WealthStrong', '身旺财旺?');
    const node_NoOff_Seal = createNode('Career_NoOff_Seal', '无财看印：印星为用?');
    const node_NoOff_Food = createNode('Career_NoOff_Food', '无财看食伤：食伤泄秀?');
    const node_NoOff_FoodWealth = createNode('Career_NoOff_FoodWealth', '食伤生财?');
    const node_NoOff_BiJie = createNode('Career_NoOff_BiJie', '有比劫：比劫帮身?');

    // --- RESULTS ---
    const res_Elite = createResult('res_Career_Elite', '事业腾达 (官印相生+财)', {
        desc: '你的事业格局非常开阔，这就好比“顺水行舟”，既有贵人提携，又有实权在手。官星得财星滋养，意味着你的职位和收入能同步提升。最适合在体制内或大平台发展，往往能平步青云，成为手握重权的实权人物。',
        tags: ['仕途', '贵人']
    });
    const res_Stable = createResult('res_Career_Stable', '安稳有余 (官印相生)', {
        desc: '你的事业运势主打一个“稳”字，像是一块基石，虽然不起眼但不可或缺。官印相生护身，让你在职场中总能逢凶化吉，但也因为缺了财星生助，晋升速度可能稍慢。最适合追求铁饭碗或极其稳定的后台岗位，细水长流才是你的福气。',
        tags: ['教师', '公职']
    });
    const res_Manager = createResult('res_Career_Manager', '化杀为权 (食伤制杀)', {
        desc: '你天生就是解决麻烦的高手，骨子里有股不服输的劲头。七杀代表压力和挑战，却被你的智慧（食神）完美驾驭，这叫做“险中求贵”。越是混乱、高压的环境，越能激发你的领导潜能，你注定是要在风浪中掌舵的开拓者。',
        tags: ['企业管理', '创业者']
    });
    const res_Stuck = createResult('res_Career_Stuck', '事业卡壳 (官杀无制)', {
        desc: '你现在的状态可能有点像“负重登山”，压力（官杀）巨大却无人分担。工作中容易遇到苛刻的领导或极不合理的目标，让你感到身心俱疲且孤立无援。这时候硬抗不是办法，学会示弱或寻找技能上的突破口（食伤），才是打破僵局的关键。',
        tags: ['打工']
    });
    const res_Entrepreneur = createResult('res_Career_Ent', '顶级创业者 (比劫夺财)', {
        desc: '你有着狼一样的野心和嗅觉，但不适合跟人分食猎物。比劫夺财意味着你的竞争对手多，或者容易因合伙而破财。你的财富必须靠自己“杀”出来，适合独立创业或做那种“一竿子插到底”的垄断性生意，切记财不外露，防人之心不可无。',
        tags: ['创业者']
    });
    const res_Wealthy = createResult('res_Career_Wealthy', '财官双美', {
        desc: '这是非常令人羡慕的格局，可谓“名利双收”。财能生官，官能护财，你的社会地位和经济实力是相辅相成的。你不仅能赚到钱，还能获得与之匹配的社会声望。适合在商界担任高管，或者经营那种需要政商关系的高端企业。',
        tags: ['企业高管']
    });
    const res_Pure = createResult('res_Career_Pure', '清贵之命', {
        desc: '你注重名声大过利益，骨子里有股清高的文人气质。官杀虽旺但无财生，说明你有地位、有名气，但未必是大富大贵。适合从事学术研究、咨询顾问或公益事业，用你的专业和品德去赢得世人的尊重，这比金钱更让你满足。',
        tags: ['学术', '咨询']
    });
    const res_Confused = createResult('res_Career_Confused', '官杀混杂', {
        desc: '你可能经常感到迷茫，不知道自己到底适合干什么。就像站在十字路口，东边也想去，西边也想去，结果在原地打转。官杀混杂意味着机会多但杂乱，建议你大刀阔斧地做减法，认准一个领域死磕到底，切忌这山望着那山高。',
        tags: ['徘徊']
    });
    const res_Tech = createResult('res_Career_Tech', '技术路线 (食伤生财)', {
        desc: '你不需要去玩那些复杂的职场政治，你的才华就是你的印钞机。食伤生财代表靠技术、创意或口才直接变现。你越是专注于打磨自己的手艺，财富来得越快。与其去钻营关系，不如把自己变成某个细分领域不可替代的专家。',
        tags: ['技术', '创意']
    });
    const res_Solo = createResult('res_Career_Solo', '自由职业 (身旺财旺)', {
        desc: '你天生就不是给人打工的料，受不得半点委屈和束缚。身旺财旺意味着你精力充沛且财运亨通，完全有能力独当一面。自由职业、个体经营或投资理财最适合你，你的收入天花板取决于你勤奋的程度，而不是老板的脸色。',
        tags: ['自由职业']
    });

    // =========================================================================
    // 2. WIRING
    // =========================================================================

    root.setCondition(ctx => ctx.hasOfficer).yes(node_Strong_Start).no(node_NoOff_Start);

    // Strong Path
    node_Strong_Start.setCondition(ctx => ctx.isSelfStrong);
    node_Strong_Start.yes(node_Strong_Seal).no(node_Weak_Start);

    node_Strong_Seal.setCondition(ctx => ctx.isSealStrong).yes(node_Strong_Food).no(node_Strong_NoSeal_Kill);
    node_Strong_Food.setCondition(ctx => ctx.isOutputStrong).yes(res_Elite).no(res_Stable);

    node_Strong_NoSeal_Kill.setCondition(ctx => ctx.isOutputStrong).yes(res_Manager).no(node_Strong_BiJie);
    node_Strong_BiJie.setCondition(ctx => ctx.hasRob).yes(node_Strong_BiJieRob).no(node_Strong_WealthOff);
    node_Strong_BiJieRob.setCondition(ctx => ctx.isBiJieRobbing).yes(res_Entrepreneur).no(node_Strong_WealthOff);

    node_Strong_WealthOff.setCondition(ctx => ctx.isWealthGenOfficer).yes(res_Wealthy).no(node_Strong_PureOff);
    node_Strong_PureOff.setCondition(ctx => ctx.isOfficerPure).yes(res_Pure).no(res_Confused);

    // Weak Path
    node_Weak_Start.setCondition(ctx => ctx.hasOfficer); // Redundant but for structure
    node_Weak_Start.yes(node_Weak_Seal).no(node_NoOff_Start);

    node_Weak_Seal.setCondition(ctx => ctx.hasSeal).yes(node_Weak_SealPower).no(node_Weak_NoSeal_Kill);
    node_Weak_SealPower.setCondition(ctx => ctx.isSealStrong).yes(res_Stable).no(res_Stuck);

    node_Weak_NoSeal_Kill.setCondition(ctx => ctx.isOutputStrong).yes(res_Tech).no(node_Weak_BiJie);
    node_Weak_BiJie.setCondition(ctx => ctx.hasRob).yes(res_Stable).no(node_Weak_WealthOff);

    node_Weak_WealthOff.setCondition(ctx => ctx.isWealthGenOfficer).yes(node_Weak_WealthStrong).no(res_Stuck);
    node_Weak_WealthStrong.setCondition(ctx => ctx.isWealthStrong).yes(res_Stuck).no(res_Wealthy);

    // No Officer Path
    node_NoOff_Start.setCondition(ctx => ctx.hasWealth).yes(node_NoOff_WealthOff).no(node_NoOff_Seal);
    node_NoOff_WealthOff.setCondition(ctx => ctx.isWealthGenOfficer).yes(res_Pure).no(node_NoOff_WealthStrong);
    node_NoOff_WealthStrong.setCondition(ctx => ctx.isWealthStrong).yes(res_Solo).no(node_NoOff_Seal);

    node_NoOff_Seal.setCondition(ctx => ctx.hasSeal).yes(res_Stable).no(node_NoOff_Food);
    node_NoOff_Food.setCondition(ctx => ctx.hasFood).yes(node_NoOff_FoodWealth).no(node_NoOff_BiJie);
    node_NoOff_FoodWealth.setCondition(ctx => ctx.isFoodGenWealth).yes(res_Tech).no(res_Tech);

    node_NoOff_BiJie.setCondition(ctx => ctx.hasRob).yes(res_Stable).no(res_Stuck);


    // =========================================================================
    // 3. REGISTRATION
    // =========================================================================
    if (window.DecisionEngine) {
        window.DecisionEngine.Engine.registerTree('career', root);
    }

})();
