// test_ai_sales.js - 模拟客户测试 AI 销冠
const http = require('http');

const TEST_PARAMS = {
    date: '1994-03-03 12:00',  // 测试日期
    gender: '男',
    isLunar: false
};

let state = { step: 'calibration', trust: 0, wealth: 'unknown' };

function callAPI(feedback) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            ...TEST_PARAMS,
            feedback: feedback,
            state: state
        });

        const req = http.request('http://127.0.0.1:8080/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    resolve(result);
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

async function runTest() {
    console.log('=========================================');
    console.log('   AI 销冠测试 - 模拟客户对话');
    console.log('=========================================');
    console.log(`测试八字: ${TEST_PARAMS.date} ${TEST_PARAMS.gender}`);
    console.log('=========================================\n');

    // 第一轮：AI 主动开场
    console.log('【AI开场 - 首次对话】');
    const r1 = await callAPI('你好，我想算命');
    console.log(r1.content);
    state = r1.updated_state;
    console.log(`\n[状态] 阶段: ${state.step}, 信任度: ${state.trust}, 财富: ${state.wealth}\n`);

    // 第二轮：客户回应（正面）
    console.log('-----------------------------------');
    console.log('【客户】: 对，你说得挺准的\n');
    const r2 = await callAPI('对，你说得挺准的');
    console.log('【AI】:', r2.content);
    state = r2.updated_state;
    console.log(`\n[状态] 阶段: ${state.step}, 信任度: ${state.trust}, 财富: ${state.wealth}\n`);

    // 第三轮：客户回应（更深层）
    console.log('-----------------------------------');
    console.log('【客户】: 我最近确实在工作上有点迷茫\n');
    const r3 = await callAPI('我最近确实在工作上有点迷茫');
    console.log('【AI】:', r3.content);
    state = r3.updated_state;
    console.log(`\n[状态] 阶段: ${state.step}, 信任度: ${state.trust}, 财富: ${state.wealth}\n`);

    // 第四轮：客户暴露财富
    console.log('-----------------------------------');
    console.log('【客户】: 我家里有厂，生意还行吧\n');
    const r4 = await callAPI('我家里有厂，生意还行吧');
    console.log('【AI】:', r4.content);
    state = r4.updated_state;
    console.log(`\n[状态] 阶段: ${state.step}, 信任度: ${state.trust}, 财富: ${state.wealth}\n`);

    console.log('=========================================');
    console.log('   测试结束');
    console.log('=========================================');
}

runTest().catch(console.error);
