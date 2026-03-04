(function () {
    const E = window.DecisionEngine;
    if (!E) return;

    const { createNode, createResult } = E;

    // --- Strength Result Nodes ---
    const res_Strength = (id, title, desc) => createResult('str_' + id, title, { desc: desc });

    // Root
    const root = createNode('strength_root', '能量强弱推导');

    // Basic Logic
    const node_Self_Strong = createNode('str_node_Strong', '日主得令或多印比?');
    const node_Self_Weak = createNode('str_node_Weak', '日主失令且多克泄?');

    const res_Strong = res_Strength('Strong', '身旺身强', '日主能量充沛，能量厚实。');
    const res_Weak = res_Strength('Weak', '身弱能量', '日主能量偏低，需要补益。');

    // Wiring
    // Wiring
    root.setCondition(() => true).yes(node_Self_Strong);

    node_Self_Strong.setCondition(ctx => ctx.isSelfStrong).yes(res_Strong).no(node_Self_Weak);
    node_Self_Weak.setCondition(ctx => !ctx.isSelfStrong).yes(res_Weak).no(null);

    E.Engine.registerTree('strength_logic', root);
})();
