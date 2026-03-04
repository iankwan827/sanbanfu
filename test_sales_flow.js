const bridge = require('./bazi_ai_bridge');

/**
 * 模拟中介操作全流程 (Demo)
 */
async function simulateSalesFlow() {
    console.log("=== 阶段 1: 初次校准 (获取信任) ===");
    let state = { step: 'calibration', trust: 0, wealth: 'unknown' };
    const step1 = bridge.runAiAnalysis({ date: '1979-02-01 15:00', gender: '女', isLunar: true, state });
    console.log("AI 输出:", step1.content);

    console.log("\n=== 阶段 2: 客户承认，并暗示‘矿山’背景 ===");
    const clientReply = "老师算得真准，我家里确实是搞矿产开采的。";
    state = step1.updated_state; // 获取更新后的状态
    const step2 = bridge.runAiAnalysis({ date: '1979-02-01 15:00', gender: '女', isLunar: true, feedback: clientReply, state });
    console.log("AI 识别财富等级:", step2.updated_state.wealth);
    console.log("AI 输出 (进入深度诊断):", step2.content);

    console.log("\n=== 阶段 3: 深度断语输出 (销售“分析能力”，建立信任) ===");
    state = step2.updated_state;
    const step3 = bridge.runAiAnalysis({ date: '1979-02-01 15:00', gender: '女', isLunar: true, state });
    console.log("AI 最终大师断语 (让客户看得舒服):", step3.content);


}


simulateSalesFlow();
