const readline = require('readline');
const bridge = require('./bazi_ai_bridge');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let currentState = {
    step: 'calibration',
    trust: 0,
    wealth: 'unknown'
};

let userParams = {
    date: '1985-05-20 10:00', // 默认测试日期
    gender: '男',
    isLunar: false
};

console.log("=========================================");
console.log("   八字大师 AI 交互式测试终端 (REPL)");
console.log("=========================================");
console.log("说明：您可以扮演‘客户’直接输入回复。");
console.log("输入 'quit' 退出，输入 'reset' 重置对话。");
console.log(`当前测试账号：1985年5月20日 10:00 (公历 男)`);
console.log("=========================================\n");

function ask() {
    const result = bridge.runAiAnalysis({
        ...userParams,
        state: currentState
    });

    console.log(`\n[大师内部状态: 阶段=${result.updated_state.step}, 信任度=${result.updated_state.trust}, 财富识别=${result.updated_state.wealth}]`);
    console.log(`\n大师说：“${result.content}”`);

    if (result.updated_state.step === 'complete') {
        console.log("\n[!!!] 信任构建完成，深度断语已卖出。测试结束。");
        rl.close();
        return;
    }

    rl.question('\n您的回复 (模拟客户): ', (input) => {
        if (input.toLowerCase() === 'quit') {
            rl.close();
            return;
        }
        if (input.toLowerCase() === 'reset') {
            currentState = { step: 'calibration', trust: 0, wealth: 'unknown' };
            console.log("\n--- 对话已重置 ---");
            ask();
            return;
        }

        // 更新反馈并进入下一轮
        currentState = result.updated_state;
        const nextTurn = bridge.runAiAnalysis({
            ...userParams,
            feedback: input,
            state: currentState
        });

        currentState = nextTurn.updated_state;
        ask();
    });
}

ask();
