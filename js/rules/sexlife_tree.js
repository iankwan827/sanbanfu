/**
 * sexlife_tree.js
 * Decision Tree for Sexual Health/Life (性生活)
 */

(function () {
    const E = window.DecisionEngine;
    const { createNode, createResult } = E;

    // =========================================================================
    // 1. ALL NODE & RESULT DECLARATIONS
    // =========================================================================

    const root = createNode('Sexlife_Root', '分析性生活原局');

    // --- Section: Day Branch (Spouse Palace) ---
    const node_DayBranch_Start = createNode('Sexlife_DB_Start', '日支状态分析');
    const node_DB_MuYu = createNode('Sexlife_DB_MuYu', '日支坐沐浴?');
    const node_DB_MuYu_Yong = createNode('Sexlife_DB_MuYu_Yong', '沐浴为用?');

    const node_DB_FourFixed = createNode('Sexlife_DB_FourFixed', '日支坐四正位 (子午卯酉)?');
    const node_DB_FourFixed_Yong = createNode('Sexlife_DB_FourFixed_Yong', '为用?');

    const node_DB_Void = createNode('Sexlife_DB_Void', '日支空亡?');
    const node_DB_Void_Strong = createNode('Sexlife_DB_Void_Strong', '身强空亡?');

    const node_DB_Clash = createNode('Sexlife_DB_Clash', '日支逢冲?');
    const node_DB_Combine = createNode('Sexlife_DB_Combine', '日支逢合?');

    // --- Section: Ten Gods ---
    const node_Gods_Start = createNode('Sexlife_Gods_Start', '十神组合分析');
    const node_Food_Strong = createNode('Sexlife_Food_Strong', '食伤旺?');
    const node_Food_Yong = createNode('Sexlife_Food_Yong', '食伤为用透干?');
    const node_Food_GenWealth = createNode('Sexlife_Food_GenWealth', '食伤有力生财?');

    const node_WealthOfficer_Balance = createNode('Sexlife_WO_Balance', '财官平衡?');
    const node_WO_Strong = createNode('Sexlife_WO_Strong', '身强平衡?');

    const node_Xiao_夺食 = createNode('Sexlife_Xiao_Eat', '枭神夺食?');
    const node_Xiao_Restrained = createNode('Sexlife_Xiao_Restrained', '有财制枭?');

    const node_BiJie_Strong = createNode('Sexlife_BiJie_Strong', '比劫旺无制?');
    const node_BiJie_Yong = createNode('Sexlife_BiJie_Yong', '比劫为用?');

    // --- RESULTS ---
    const res_Enjoy = createResult('res_Sex_Enjoy', '乐享其中', {
        desc: '你把亲密关系看作一种生活的艺术，而不仅仅是生理需求。你的命盘显示你对“情调”二字有着天然的悟性，懂得在平淡的生活中制造浪漫。这种发自内心的投入和享受，会让你的伴侣感到被深深珍视，两人世界往往充满情趣。',
        tags: ['享受', '热情']
    });
    const res_Lustful = createResult('res_Sex_Lustful', '需求旺盛', {
        desc: '你体内似乎燃烧着一团火，对激情和新鲜感有着强烈的渴望。平淡无奇的互动很难满足你，你喜欢探索、追求刺激。这种旺盛的生命力是你魅力的来源，但也要注意过犹不及，别让欲望掌控了你的理智，伤身又伤心。',
        tags: ['刺激', '精力']
    });
    const res_Frustrated = createResult('res_Sex_Frustrated', '有劲使不上', {
        desc: '你可能经常感觉到一种莫名的压抑，就像河流被大坝截断，想流却流不畅。这往往不是身体机能的问题，而是心理层面的“隔阂”。或许是生活压力太大，或者是过于在意对方的看法，导致你在关键时刻总是放不开，难以全情投入。',
        tags: ['隔阂', '迟钝']
    });
    const res_Weak = createResult('res_Sex_Weak', '力不从心', {
        desc: '你的身体底子稍显薄弱，最近可能更是透支得厉害。并不是你没有想法，而是身体跟不上脑子，“心有余而力不足”。这是身体在向你发出求救信号，提醒你需要停下来休养生息了，切记强行透支，毕竟健康才是快乐的本钱。',
        tags: ['肾水不足', '虚弱']
    });
    const res_Harmonious = createResult('res_Sex_Harmonious', '水乳交融', {
        desc: '你和伴侣的契合度极高，这种默契就像是“琴瑟和鸣”。你不仅懂得如何取悦对方，更懂得在精神层面与对方共鸣。这种身心合一的深度交流，是维系你们感情最牢固的纽带，让你们的关系随着时间推移越发醇厚。',
        tags: ['和谐', '高手']
    });
    const res_Balanced = createResult('res_Sex_Balanced', '平衡适度', {
        desc: '你对亲密关系的态度非常健康且务实。既不因为过度沉迷而荒废正事，也不会因为冷淡而疏远伴侣。这种“不多不少、恰到好处”的节奏，让你在享受生活的同时，也能保持内心的平静。这种细水长流的状态，其实是最难得的福气。',
        tags: ['平衡']
    });
    const res_Restrained = createResult('res_Sex_Restrained', '压抑冷淡', {
        desc: '你似乎把自己的欲望关在了一个严密的笼子里。或许是因为传统观念的束缚，或者是由于长期的焦虑，让你对亲密行为产生了一种本能的抗拒或冷漠。就像穿着紧身衣跳舞，始终无法舒展。试着卸下心理包袱，你值得拥有快乐。',
        tags: ['压抑', '冷淡']
    });
    const res_Dominant = createResult('res_Sex_Dominant', '强势自我', {
        desc: '在亲密关系中，你习惯了掌握主动权，甚至显得有些霸道。你可能过于关注自己的感受，而忽略了毕竟这是两个人的舞蹈。这种强势虽然能带来短暂的征服感，但长此以往会让对方感到窒息。学会温柔和体贴，会让你的魅力加倍。',
        tags: ['强势', '自我']
    });

    // =========================================================================
    // 2. WIRING
    // =========================================================================

    root.setCondition(() => true).yes(node_DayBranch_Start);

    // Day Branch Logic
    node_DayBranch_Start.setCondition(() => true).yes(node_DB_MuYu);
    node_DB_MuYu.setCondition(ctx => ctx.isDayBranchMuYu).yes(node_DB_MuYu_Yong).no(node_DB_FourFixed);
    node_DB_MuYu_Yong.setCondition(ctx => ctx.dayBranchNode?.isYong).yes(res_Enjoy).no(node_DB_FourFixed);

    node_DB_FourFixed.setCondition(ctx => ['子', '午', '卯', '酉'].includes(ctx.dayBranchNode?.char)).yes(node_DB_FourFixed_Yong).no(node_DB_Void);
    node_DB_FourFixed_Yong.setCondition(ctx => ctx.dayBranchNode?.isYong).yes(res_Lustful).no(node_DB_Void);

    node_DB_Void.setCondition(ctx => ctx.dayBranchNode?.isKongWang).yes(node_DB_Void_Strong).no(node_DB_Clash);

    node_DB_Void_Strong.setCondition(ctx => ctx.isSelfStrong).yes(res_Frustrated).no(res_Weak);

    node_DB_Clash.setCondition(ctx => ctx.isDayBranchClashed).yes(res_Frustrated).no(node_DB_Combine);
    node_DB_Combine.setCondition(ctx => ctx.isDayBranchCombined).yes(res_Balanced).no(node_Gods_Start);

    // Ten Gods Logic
    node_Gods_Start.setCondition(() => true).yes(node_Food_Strong);
    node_Food_Strong.setCondition(ctx => ctx.isOutputStrong).yes(node_Food_Yong).no(node_WealthOfficer_Balance);
    node_Food_Yong.setCondition(ctx => ctx.getGodMeta('食伤').isYong && ctx.getGodMeta('食伤').nodes.some(n => n.isStem)).yes(node_Food_GenWealth).no(node_WealthOfficer_Balance);
    node_Food_GenWealth.setCondition(ctx => ctx.isFoodGenWealth).yes(res_Harmonious).no(node_WealthOfficer_Balance);

    node_WealthOfficer_Balance.setCondition(ctx => ctx.isWOBalanced).yes(node_WO_Strong).no(node_Xiao_夺食);
    node_WO_Strong.setCondition(ctx => ctx.isSelfStrong).yes(res_Balanced).no(res_Weak);

    node_Xiao_夺食.setCondition(ctx => ctx.isXiaoEatingFood).yes(node_Xiao_Restrained).no(node_BiJie_Strong);
    node_Xiao_Restrained.setCondition(ctx => ctx.isXiaoRestrained).yes(res_Enjoy).no(res_Restrained);

    node_BiJie_Strong.setCondition(ctx => ctx.isBiJieStrong).yes(node_BiJie_Yong).no(res_Balanced);
    node_BiJie_Yong.setCondition(ctx => ctx.getGodMeta('比劫').isYong).yes(res_Enjoy).no(res_Dominant);


    // =========================================================================
    // 3. REGISTRATION
    // =========================================================================
    if (window.DecisionEngine) {
        window.DecisionEngine.Engine.registerTree('sexlife', root);
    }

})();
