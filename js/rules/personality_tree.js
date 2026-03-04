(function () {
    const E = window.DecisionEngine;
    if (!E) return;

    const { createNode, createResult } = E;

    // --- Personality Result Nodes ---
    // (We could create many results, but to keep it simple and dynamic, we'll use a generic approach 
    // or just registered results if needed for some specific outcomes)

    const res_Standard = (title, desc) => createResult('pers_' + title, title, { desc: desc });
    const res_Neutral = (title, desc) => createResult('pers_' + title + '_Neu', title, { desc: desc, tags: ['中性'] });

    // Root
    const root = createNode('personality_root', '性格诊断');

    // 1. Official
    const node_Official = createNode('pers_node_Official', '官杀 (压力/自律)');
    const res_Off_Pos = res_Standard('官杀旺相', '刚直不阿、责任心强、锐意进取、具有君子之风');
    const res_Off_Trans = res_Standard('有印化', '官杀见印化，转祸为福，化煞为权，稳重且有智慧');
    const res_Off_Control = res_Standard('有食伤制', '勇猛果敢，胆大心细，能开创事业，不畏权贵');
    const res_Off_Neg = res_Standard('无印化', '行为不轨、不思进取、顶撞领导、当为小人');
    const res_Off_Neu = res_Neutral('官杀弱', '气质中平、能力一般、胆略尚可、平庸之流');

    // 2. Seal
    const node_Seal = createNode('pers_node_Seal', '印星 (仁慈/修养)');
    const res_Seal_Pos = res_Standard('印星旺相', '仁慈善良、文采出众、处事大方、举止儒雅');
    const res_Seal_Constrained = res_Standard('有财制', '务实灵活、聪明机智、理财有道、不再迂腐');
    const res_Seal_Neg = res_Standard('无财制', '心胸狭窄、性格多疑、感情用事、目光短浅');
    const res_Seal_Neu = res_Neutral('印星弱', '温和沉稳、注重实际、不过分感性');

    // 3. Wealth
    const node_Wealth = createNode('pers_node_Wealth', '财星 (勤勉/务实)');
    const res_Wealth_Pos = res_Standard('财星旺相', '勤勉能干、性格温和、古道热肠、仗义疏财');
    const res_Wealth_Constrained = res_Standard('有比劫制', '仗义疏财、人缘极佳、善于交际、富中取贵');
    const res_Wealth_Neg = res_Standard('无比劫制', '懒惰、小气吝啬、头脑僵化、喜信谗言');
    const res_Wealth_Neu = res_Neutral('财星弱', '精打细算、务实稳健、财运平平');

    // 4. Output
    const node_Output = createNode('pers_node_Output', '食伤 (才华/表达)');
    const res_Output_Pos = res_Standard('食伤旺相', '才华横溢、能言善道、举止优雅、极具创意');
    const res_Output_Constrained = res_Standard('有印制', '文采斐然、名声大噪、收放自如、贵气所聚');
    const res_Output_Neg = res_Standard('无印制', '自命不凡、郁郁寡欢、喜欢空想、行为诡秘');
    const res_Output_Neu = res_Neutral('食伤弱', '资质一般、言语乏味、缺乏灵气');

    // 5. BiJie
    const node_BiJie = createNode('pers_node_BiJie', '比劫 (意志/义气)');
    const res_BiJie_Pos = res_Standard('比劫旺相', '性格刚毅、意志坚定、广结善缘、白手起家');
    const res_BiJie_Constrained = res_Standard('有官杀制', '遵纪守法、严于律己、威望高筑、有领导力');
    const res_BiJie_Neg = res_Standard('无官杀制', '刻板固执、自以为是、一生操劳、好勇斗狠');
    const res_BiJie_Neu = res_Neutral('比劫弱', '社交面窄、缺乏自信、随波逐流');

    // Wiring
    root.setCondition(() => true).yes(node_Official);

    // Official
    node_Official.setCondition(ctx => ctx.hasOfficer).yes(
        createNode('off_logic', '判定官杀状态').setCondition(ctx => ctx.isOfficerPositive).yes(
            createNode('off_trans', '是否有化?').setCondition(ctx => ctx.hasSealTrans).yes(res_Off_Trans.yes(node_Seal)).no(res_Off_Pos.yes(node_Seal))
        ).no(
            createNode('off_ctrl', '是否有制?').setCondition(ctx => ctx.isKillControlled).yes(res_Off_Control.yes(node_Seal)).no(res_Off_Neg.yes(node_Seal))
        )
    ).no(node_Seal);

    // Seal
    node_Seal.setCondition(ctx => ctx.hasSeal).yes(
        createNode('seal_logic', '判定印星状态').setCondition(ctx => ctx.isSealPositive).yes(res_Seal_Pos.yes(node_Wealth)).no(
            createNode('seal_broke', '是否有制?').setCondition(ctx => ctx.isSealRestricted).yes(res_Seal_Constrained.yes(node_Wealth)).no(res_Seal_Neg.yes(node_Wealth))
        )
    ).no(node_Wealth);

    // Wealth
    node_Wealth.setCondition(ctx => ctx.hasWealth).yes(
        createNode('wealth_logic', '判定财星状态').setCondition(ctx => ctx.isWealthPositive).yes(res_Wealth_Pos.yes(node_Output)).no(
            createNode('wealth_rob', '是否有制?').setCondition(ctx => ctx.isWealthRestricted).yes(res_Wealth_Constrained.yes(node_Output)).no(res_Wealth_Neg.yes(node_Output))
        )
    ).no(node_Output);

    // Output
    node_Output.setCondition(ctx => ctx.hasOutput).yes(
        createNode('output_logic', '判定食伤状态').setCondition(ctx => ctx.isOutputPositive).yes(res_Output_Pos.yes(node_BiJie)).no(
            createNode('output_配印', '是否有制?').setCondition(ctx => ctx.isOutputRestricted).yes(res_Output_Constrained.yes(node_BiJie)).no(res_Output_Neg.yes(node_BiJie))
        )
    ).no(node_BiJie);

    // BiJie
    node_BiJie.setCondition(ctx => ctx.hasBiJie).yes(
        createNode('bijie_logic', '判定比劫状态').setCondition(ctx => ctx.isBiJiePositive).yes(res_BiJie_Pos).no(
            createNode('bijie_制', '是否有制?').setCondition(ctx => ctx.isBiJieRestricted).yes(res_BiJie_Constrained).no(res_BiJie_Neg)
        )
    ).no(null);


    E.Engine.registerTree('personality_tree', root);
})();
