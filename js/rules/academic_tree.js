/**
 * academic_tree.js
 * 
 * Optimized Academic Tree using Object-Oriented properties.
 * Focuses on "Owl-Killing Interaction" (杀枭相生) vs "Mental Deviation" (枭神无制).
 */

(function () {
    const E = window.DecisionEngine;
    const { createNode, createResult } = E;

    // 1. RESULTS
    const res_HighAchieverRebellion = createResult('res_HighAchieverRebellion', '杀枭有制 (高阶)', {
        id: 'res_HighAchieverRebellion',
        title: '杀枭有制 (高阶)',
        desc: '命局中七杀与偏印（枭神）并见，且得到了有效的制衡。这是一种典型的“奇才”配置。容易在学术研究或高精尖专业领域获得极高成就。',
        tags: ['杀枭有制', '高学历', '奇才']
    });

    // Alias for compatibility if needed
    res_HighAchieverRebellion.data.title_alias = '杀枭有制 (高阶学霸)';

    const res_DropoutRisk = createResult('res_DropoutRisk', '极度叛逆 (辍学风险)', {
        id: 'res_DropoutRisk',
        title: '极度叛逆 (辍学风险)',
        desc: '命局中七杀过重且压力巨大，催动枭神但偏印（枭神）旺而无制，极易产生强烈叛逆。需加强引导。',
        tags: ['枭神无制', '杀重压身', '辍学风险']
    });

    const res_RebelliousGenius = createResult('res_RebelliousGenius', '奇才变通 (杀枭相生)', {
        id: 'res_RebelliousGenius',
        title: '奇才变通 (杀枭相生)',
        desc: '典型的“杀枭相生”配置。思维敏捷，不喜欢传统教育。一学就会，一考就过。',
        tags: ['杀枭相生', '偏才']
    });

    const res_SealUseful = createResult('res_SealUseful', '印星为用', { desc: '印星为喜用，学业稳扎稳打。' });
    const res_SealTaboo = createResult('res_SealTaboo', '身弱印旺', { desc: '身弱印旺为忌，学习变成负担，越学越累。' });
    const res_SealGeneral = createResult('res_SealGeneral', '学业中平', { desc: '学业运势平稳，按部就班。' });

    // 2. NODES
    const root = createNode('Academic_Root', '开启学业诊断');
    const node_OwlKillingCheck = createNode('node_OwlKillingCheck', '枭神受制检测');
    const node_A_HasOfficial = createNode('A_HasOfficial', '常规官印模型');

    // 3. WIRING
    root.setCondition(ctx => {
        // Use OO getters from context
        const killMeta = ctx.getGodMeta('官杀');
        const sealMeta = ctx.getGodMeta('印星');
        const outputMeta = ctx.getGodMeta('食伤');

        // Match both single characters and full names
        const hasSevenKillings = killMeta.nodes.some(n => (n.godName.includes('杀') || n.godName.includes('官')) && n.isWang());
        const hasStrongOwl = sealMeta.nodes.some(n => (n.godName.includes('枭') || n.godName.includes('印')) && n.isWang());

        // Entry to specialized Kill-Owl logic
        return hasSevenKillings && (hasStrongOwl || outputMeta.isStrong);
    }).yes(node_OwlKillingCheck).no(node_A_HasOfficial);

    node_OwlKillingCheck.setCondition(ctx => {
        const owlNodes = ctx.getGodMeta('印星').nodes.filter(n => (n.godName.includes('枭') || n.godName.includes('偏印')) && n.isWang());
        const hasStrongOutput = ctx.getGodMeta('食伤').isStrong;

        // If any strong Owl is unrestricted
        if (owlNodes.some(n => n.isWang() && !n.isRestricted)) {
            // Case 1994: Uncontrolled Owl + Strong Food = "枭印夺食" (Dropout Risk)
            if (hasStrongOutput) {
                // This path leads to Dropout Risk
                return true;
            }
            // Case 1987: Uncontrolled Owl + No/Weak Food = "化杀为权" (High Achiever)
            // This path leads to High Achiever, so return false for the .yes(DropoutRisk) branch
            return false;
        }

        // If restricted, the Owl is controlled, usually a good sign for academic stability
        // This path leads to High Achiever, so return false for the .yes(DropoutRisk) branch
        return false;
    }).yes(res_DropoutRisk).no(res_HighAchieverRebellion);

    const node_SealUsefulCheck = createNode('node_SealUsefulCheck', '印星喜忌?');
    node_A_HasOfficial.setCondition(ctx => ctx.hasOfficerBranch && ctx.hasSealBranch).yes(node_SealUsefulCheck).no(res_SealGeneral);
    node_SealUsefulCheck.setCondition(ctx => ctx.isSealTaboo).yes(res_SealTaboo).no(res_SealUseful);

    if (window.DecisionEngine) {
        window.DecisionEngine.Engine.registerTree('academic', root);
    }
})();
