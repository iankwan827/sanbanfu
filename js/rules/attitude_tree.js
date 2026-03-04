(function () {
    const E = window.DecisionEngine;
    if (!E) return;

    const { createNode, createResult } = E;

    // --- Attitude Result Nodes ---
    const res_Attitude = (id, title, desc) => createResult('att_' + id, title, { desc: desc });

    // Root
    const root = createNode('attitude_root', '处事态度分析');

    // Branches based on Monthly Focus (Grid)
    const node_Month_Focus = createNode('att_node_Month', '月令格局分析');

    // 1. Seal Focus
    const node_Seal_Grid = createNode('att_node_Seal', '印星格?');
    const res_Seal_Yong = res_Attitude('Seal_Yong', '温文尔雅', '待人接物很有礼貌，处事稳重，比较传统保守，看重名誉。');
    const res_Seal_Ji = res_Attitude('Seal_Ji', '优柔寡断', '心思过重，容易把简单的事情想复杂，行动力稍欠，有些守旧。');

    // 2. Official Focus
    const node_Off_Grid = createNode('att_node_Off', '官杀格?');
    const res_Off_Yong = res_Attitude('Off_Yong', '严谨负责', '处事非常有原则，纪律性强，对自己要求很高，给人一种正气凛然的感觉。');
    const res_Off_Ji = res_Attitude('Off_Ji', '谨小慎微', '容易自我施压，处事过于小心，有时显得有些刻板或胆小。');

    // 3. Wealth Focus
    const node_Wealth_Grid = createNode('att_node_Wealth', '财星格?');
    const res_Wealth_Yong = res_Attitude('Wealth_Yong', '务实高效', '非常看重实际效率，为人爽快，能够兼顾各方利益，很有商业头脑。');
    const res_Wealth_Ji = res_Attitude('Wealth_Ji', '计较得失', '处事过于看重利益，有时显得不够大方，容易在细节和得失上纠结。');

    // 4. Output Focus
    const node_Output_Grid = createNode('att_node_Output', '食伤格?');
    const res_Output_Yong = res_Attitude('Output_Yong', '热情随性', '处事富有创意，待人热情，喜欢表达，不拘小节。');
    const res_Output_Ji = res_Attitude('Output_Ji', '恃才傲物', '说话直接容易得罪人，内心比较清高，对不认同的事物表现得比较抵触。');

    // 5. BiJie Focus
    const node_BiJie_Grid = createNode('att_node_BiJie', '比劫格?');
    const res_BiJie_Yong = res_Attitude('BiJie_Yong', '自信担当', '性格独立自主，处事果断，重情重义，愿意为他人遮风挡雨。');
    const res_BiJie_Ji = res_Attitude('BiJie_Ji', '固执己见', '比较以自我为中心，不容易听取他人建议，有时显得冷漠。');

    const res_Default = res_Attitude('Default', '平和稳健', '处事态度比较平和，没有极端的倾向，能够适应各种环境。');

    // Wiring
    root.setCondition(() => true).yes(node_Month_Focus);
    node_Month_Focus.yes(node_Seal_Grid);

    node_Seal_Grid.setCondition(ctx => ctx.monthBranchCategory === '印星').yes(
        createNode('att_seal_s', '印星喜忌?').setCondition(ctx => ctx.monthBranchGodYongStatus === '用').yes(res_Seal_Yong).no(res_Seal_Ji)
    ).no(node_Off_Grid);

    node_Off_Grid.setCondition(ctx => ctx.monthBranchCategory === '官杀').yes(
        createNode('att_off_s', '官杀喜忌?').setCondition(ctx => ctx.monthBranchGodYongStatus === '用').yes(res_Off_Yong).no(res_Off_Ji)
    ).no(node_Wealth_Grid);

    node_Wealth_Grid.setCondition(ctx => ctx.monthBranchCategory === '财星').yes(
        createNode('att_wealth_s', '财星喜忌?').setCondition(ctx => ctx.monthBranchGodYongStatus === '用').yes(res_Wealth_Yong).no(res_Wealth_Ji)
    ).no(node_Output_Grid);

    node_Output_Grid.setCondition(ctx => ctx.monthBranchCategory === '食伤').yes(
        createNode('att_output_s', '食伤喜忌?').setCondition(ctx => ctx.monthBranchGodYongStatus === '用').yes(res_Output_Yong).no(res_Output_Ji)
    ).no(node_BiJie_Grid);

    node_BiJie_Grid.setCondition(ctx => ctx.monthBranchCategory === '比劫').yes(
        createNode('att_bijie_s', '比劫喜忌?').setCondition(ctx => ctx.monthBranchGodYongStatus === '用').yes(res_BiJie_Yong).no(res_BiJie_Ji)
    ).no(res_Default);


    E.Engine.registerTree('attitude', root);
})();
