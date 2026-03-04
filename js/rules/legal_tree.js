/**
 * legal_tree.js
 * Decision Tree for Legal Issues (官非)
 */

(function () {
    const E = window.DecisionEngine;
    const { createNode, createResult } = E;

    // =========================================================================
    // 1. ALL NODE & RESULT DECLARATIONS
    // =========================================================================

    const root = createNode('Legal_Root', '分析官非原局');

    // --- Section: Officer Role ---
    const node_Off_Role = createNode('Legal_Off_Role', '官杀性质判定');
    const node_Off_Yong = createNode('Legal_Off_Yong', '官杀为用?');
    const node_Off_Mixed = createNode('Legal_Off_Mixed', '官杀混杂?');
    const node_Off_Ji = createNode('Legal_Off_Ji', '官杀为忌?');

    // --- Section: Control & Transformation ---
    const node_Seal_Trans = createNode('Legal_Seal_Trans', '有印化官?');
    const node_Food_Cont = createNode('Legal_Food_Cont', '有食伤制杀?');

    // --- Section: Risk Triggers ---
    const node_Risk_Start = createNode('Legal_Risk_Start', '风险触发点分析');
    const node_Risk_FoodKill = createNode('Legal_Risk_FoodKill', '伤官见官?');
    const node_Risk_BiJie = createNode('Legal_Risk_BiJie', '比劫抗官?');
    const node_Risk_WealthGen = createNode('Legal_Risk_WealthGen', '财生官杀 (为钱惹事)?');

    // --- Section: Shen Sha (Special) ---
    const node_ShenSha_Start = createNode('Legal_ShenSha_Start', '神煞与刑冲分析');
    const node_ShenSha_LuoWang = createNode('Legal_LuoWang', '命带罗网?');
    const node_ShenSha_SanXing = createNode('Legal_SanXing', '触发三刑?');
    const node_ShenSha_Clash = createNode('Legal_Clash', '官杀逢冲?');

    // --- RESULTS ---
    const res_Safe = createResult('res_Legal_Safe', '奉公守法', {
        desc: '你是一个非常爱惜羽毛的人，骨子里透着正气。官杀在你的命局中起到了规范而非压迫的作用，这意味着你做事讲原则、守规矩。这种严谨的性格就是你最好的护身符，让你在生活和职场中都能远离是非，甚至能在体制内如鱼得水。',
        tags: ['平安', '正派']
    });
    const res_Resolved = createResult('res_Legal_Resolved', '逢凶化吉', {
        desc: '你的命局中最妙的就是这个“化”字。虽然难免会遇到压力或小人刁难，但总能遇到贵人（印星）或靠自己的智慧（食伤）化解。就像著名的太极推手，四两拨千斤。那些看似凶险的官非危机，最后反而往往成了成就你名声的垫脚石。',
        tags: ['化解', '贵人']
    });
    const res_Dispute = createResult('res_Legal_Dispute', '官非缠身', {
        desc: '你可能经常感到“人在家中坐，锅从天上来”。生活中容易充满了各种扯皮的事，要么是合同陷阱，要么是口舌之争。这往往是因为官杀混杂导致气场不纯，容易招惹烂人烂事。建议凡事留个心眼，白纸黑字写清楚，少逞口舌之快。',
        tags: ['纠纷', '口舌']
    });
    const res_Severe = createResult('res_Legal_Severe', '牢狱之灾', {
        desc: '这是一个必须高度警惕的信号。官杀攻身太过，意味着来自官方或法律的铁拳可能会重重落下。在这种运势下，千万不要试图去挑战规则或钻法律空子，因为代价可能是你无法承受的自由。低调做人，遵纪守法，是你唯一的避险之道。',
        tags: ['严峻', '风险']
    });
    const res_Economic = createResult('res_Legal_Economic', '经济犯罪/纠纷', {
        desc: '你的官非风险主要集中在“钱”字上。财生官杀（为忌），意味着金钱欲望可能会把你推向危险的边缘。容易因为债务纠纷、贪腐或者经济合同问题惹上官司。切记“君子爱财，取之有道”，别让贪念成为了给你戴上镣铐的推手。',
        tags: ['金钱纠纷']
    });

    // =========================================================================
    // 2. WIRING
    // =========================================================================

    root.setCondition(() => true).yes(node_Off_Role);

    // Logic Tree
    node_Off_Role.setCondition(() => true).yes(node_Off_Yong);
    node_Off_Yong.setCondition(ctx => ctx.getGodMeta('官杀').isYong).yes(node_Off_Mixed).no(node_Off_Ji);

    node_Off_Mixed.setCondition(ctx => ctx.isOfficerMixed).yes(res_Dispute).no(res_Safe);

    node_Off_Ji.setCondition(ctx => ctx.getGodMeta('官杀').isJi).yes(node_Seal_Trans).no(node_Risk_Start);
    node_Seal_Trans.setCondition(ctx => ctx.hasSealTrans).yes(res_Resolved).no(node_Food_Cont);
    node_Food_Cont.setCondition(ctx => ctx.isKillControlled).yes(res_Resolved).no(node_Risk_Start);

    node_Risk_Start.setCondition(() => true).yes(node_Risk_FoodKill);
    node_Risk_FoodKill.setCondition(ctx => ctx.isFoodKill).yes(res_Dispute).no(node_Risk_BiJie);
    node_Risk_BiJie.setCondition(ctx => ctx.isBiJieStrong).yes(res_Dispute).no(node_Risk_WealthGen);
    node_Risk_WealthGen.setCondition(ctx => ctx.isWealthGenOfficer).yes(res_Economic).no(node_ShenSha_Start);

    node_ShenSha_Start.setCondition(() => true).yes(node_ShenSha_LuoWang);
    node_ShenSha_LuoWang.setCondition(ctx => ctx.hasLuoWang).yes(res_Severe).no(node_ShenSha_SanXing);
    node_ShenSha_SanXing.setCondition(ctx => ctx.hasSanXing).yes(res_Severe).no(node_ShenSha_Clash);
    node_ShenSha_Clash.setCondition(ctx => ctx.isOfficerClashed).yes(res_Dispute).no(res_Safe);


    // =========================================================================
    // 3. REGISTRATION
    // =========================================================================
    if (window.DecisionEngine) {
        window.DecisionEngine.Engine.registerTree('legal', root);
    }

})();
