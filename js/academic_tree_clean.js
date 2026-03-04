/**
 * academic_tree_clean.js
 */

(function () {
    const E = window.DecisionEngine;
    const { createNode, createResult } = E;

    // 1. RESULTS
    const res_Elite = createResult('res_Elite', '天之骄子 (贵气型学霸)', {});
    const res_Foundation = createResult('res_Foundation', '底蕴深厚 (扎实功夫)', {});
    const res_HighAchieverRebellion = createResult('res_HighAchieverRebellion', '杀枭有制 (高阶)', { tags: ['杀枭有制'] });
    const res_DropoutRisk = createResult('res_DropoutRisk', '极度叛逆 (辍学风险)', { tags: ['辍学风险'] });
    const res_RebelliousGenius = createResult('res_RebelliousGenius', '奇才变通 (杀枭相生)', { tags: ['杀枭相生'] });
    const res_SealGeneral = createResult('res_SealGeneral', '印星一般 (按部就班)', {});
    const res_SealUseful = createResult('res_SealUseful', '印星得用 (稳扎稳打)', {});
    const res_SealTaboo = createResult('res_SealTaboo', '印旺为忌 (思维重负)', {});
    const res_SealTaboo_WealthBreak = createResult('res_SealTaboo_WealthBreak', '财星破印 (务实致用)', {});

    // 2. NODES
    const root = createNode('Academic_Root', '开启学业诊断');
    const node_ControlCheck = createNode('Academic_ControlCheck', '杀星是否受制');
    const node_SealOverloadCheck = createNode('node_SealOverloadCheck', '枭印是否过旺');
    const node_Academic_DropoutCheck = createNode('Academic_DropoutCheck', '是否身弱且杀重');
    const node_A_HasOfficial = createNode('A_HasOfficial', '地支官星?');
    const node_A_HasSeal = createNode('A_HasSeal', '地支印星?');
    const node_SealSystemCheck = createNode('node_SealSystemCheck', '印星喜忌?');

    function getDetailedGodScore(ctx, category) {
        if (!ctx || !ctx.gods) return 0;
        const branchWeights = { 0: 10, 1: 45, 2: 20, 3: 15 };
        let score = 0;
        ctx.gods.forEach(g => {
            if (!g || g.isSecondary || g.pillarIndex >= 4) return;
            if (g.category === category || (category === '官杀' && (g.godName === '七杀' || g.godName === '官杀' || g.godName === '杀'))) {
                let w = g.isStem ? 10 : (branchWeights[g.pillarIndex] || 0);
                score += w;
            }
        });
        return score;
    }

    // 3. WIRING
    root.setCondition(ctx => {
        const killScore = getDetailedGodScore(ctx, '官杀');
        const sealScore = getDetailedGodScore(ctx, '印星');
        const foodScore = getDetailedGodScore(ctx, '食伤');
        return (killScore >= 10 && (sealScore >= 5 || foodScore >= 5));
    }).yes(node_ControlCheck).no(node_A_HasOfficial);

    node_ControlCheck.setCondition(ctx => {
        const killScore = getDetailedGodScore(ctx, '官杀');
        const foodScore = getDetailedGodScore(ctx, '食伤');
        const sealScore = getDetailedGodScore(ctx, '印星');
        const passed = (killScore > 0) && ((foodScore >= killScore * 0.4) || (sealScore >= killScore * 0.4));
        if (window.logDebug) console.log(`[Academic ControlCheck] Kill:${killScore}, Seal:${sealScore} -> Result:${passed}`);
        return passed;
    }).yes(res_HighAchieverRebellion).no(node_SealOverloadCheck);

    node_SealOverloadCheck.setCondition(ctx => ctx.isSealOverloaded).yes(res_SealTaboo).no(node_Academic_DropoutCheck);

    node_Academic_DropoutCheck.setCondition(ctx => {
        const killScore = getDetailedGodScore(ctx, '官杀');
        const sealScore = getDetailedGodScore(ctx, '印星');
        const foodScore = getDetailedGodScore(ctx, '食伤');
        const isSelfWeak = !ctx.isSelfStrong;
        let passed = false;
        if (killScore >= 40 && isSelfWeak) {
            if (sealScore + foodScore < killScore * 0.25) passed = true;
        }
        if (window.logDebug) console.log(`[Academic DropoutCheck] Kill:${killScore}, Seal:${sealScore}, Weak:${isSelfWeak} -> Result:${passed}`);
        return passed;
    }).yes(res_DropoutRisk).no(res_RebelliousGenius);

    node_A_HasOfficial.setCondition(ctx => ctx.hasOfficerBranch).yes(node_A_HasSeal).no(res_SealGeneral);
    node_A_HasSeal.setCondition(ctx => ctx.hasSealBranch).yes(node_SealSystemCheck).no(res_SealGeneral);
    node_SealSystemCheck.setCondition(ctx => ctx.isSealTaboo).yes(res_SealTaboo_WealthBreak).no(res_SealUseful);

    if (window.DecisionEngine) {
        window.DecisionEngine.Engine.registerTree('academic', root);
    }
})();
