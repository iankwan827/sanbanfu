const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// ============ CONFIGURATION ============
const DEEPSEEK_API_KEY = 'sk-f07b277588f64850a9f8c799ef89ab91';
const OLLAMA_URL = 'http://127.0.0.1:11434/api/generate';
const TRAINING_DATA_PATH = path.join(__dirname, 'biao', 'sales_training_data.jsonl');

/**
 * Call DeepSeek API (The Actor/Customer)
 */
function callDeepSeek(messages) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            model: "deepseek-chat",
            messages: messages,
            temperature: 1.2 // 增加创造性，模拟多种性格
        });

        const req = https.request('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    resolve(result.choices[0].message.content);
                } catch (e) {
                    reject(new Error('DeepSeek 解析失败: ' + data));
                }
            });
        });

        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

/**
 * Call Ollama (The Trainee/Closer)
 */
function callOllama(prompt) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            model: 'qwen2.5:7b',
            prompt: prompt,
            stream: false
        });

        const req = http.request(OLLAMA_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    resolve(result.response);
                } catch (e) {
                    reject(new Error('Ollama 解析失败'));
                }
            });
        });

        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

/**
 * The Arena Loop
 */
async function runArenaRound(persona, baziData) {
    console.log(`\n[Arena] 开启对练模式 - 场景: ${persona.name}`);

    let dialogue = [];
    let ollamaContext = persona.systemPrompt + "\n报告摘要: " + JSON.stringify(baziData);

    // Initial Pitch from Master
    let masterSay = `我看你这张盘，${persona.initialPoint}。你品一品，我断的可还算准？`;
    console.log(`大师: ${masterSay}`);
    dialogue.push({ role: 'assistant', content: masterSay });

    for (let i = 0; i < 5; i++) {
        // 1. DeepSeek (Customer) Reacts
        const customerPrompt = [
            { role: "system", content: `你现在扮演一个真实客户。你的背景是：${persona.background}。你对手头这个命盘的心理预期是：${persona.expectation}。如果对面说得准，你会慢慢信任；如果对面只会说废话，你会怼他、质疑他。保持口语化，像真人在微信聊天。` },
            ...dialogue.map(d => ({ role: d.role === 'assistant' ? 'user' : 'assistant', content: d.content }))
        ];
        const customerSay = await callDeepSeek(customerPrompt);
        console.log(`客户 (${persona.name}): ${customerSay}`);
        dialogue.push({ role: 'user', content: customerSay });

        // 2. Ollama (Closer) Responds
        const ollamaPrompt = `${ollamaContext}\n\n既往对话:\n${dialogue.map(d => `${d.role}: ${d.content}`).join('\n')}\n\n大师回复:`;
        masterSay = await callOllama(ollamaPrompt);
        console.log(`大师: ${masterSay}`);
        dialogue.push({ role: 'assistant', content: masterSay });
    }

    // 3. Save to fine-tuning data
    const trainingEntry = {
        messages: [
            { role: "system", content: "你是八字销冠大师，语调要有掌控感，能够把命理转化为销售动能。" },
            ...dialogue
        ]
    };
    fs.appendFileSync(TRAINING_DATA_PATH, JSON.stringify(trainingEntry) + "\n");
    console.log(`[Arena] 已将本轮对练数据存入训练集。`);
}

// 模拟几个测试场景
const personas = [
    { name: "破产企业主", background: "以前很有钱，去年亏损严重，心情烦躁，对命理半信半疑。", initialPoint: "这几年事业变动极大，财富守不住", expectation: "希望看到转机，但讨厌被套路" },
    { name: "家里有矿的富二代", background: "家里有背景，不缺钱，但婚姻不顺，性格傲慢。", initialPoint: "感情生活一团乱，甚至有官非纠缠", expectation: "渴望被理解，但极其排斥说教" },
    { name: "焦虑的母亲", background: "孩子面临高考，非常焦虑，迷信各种玄学，容易被引导。", initialPoint: "孩子学业压力大，最近状态很不稳", expectation: "寻找心理安慰和明确的指导方向" },
    { name: "怀疑论专业人士", background: "高学历，逻辑性极强，认为命理是统计学或心理暗示，喜欢扣细节。", initialPoint: "命局中的逻辑卡点（如某个五行缺失）如何量化解释", expectation: "通过逻辑反驳大师，除非大师能说出极其私密且准确的信息" }
];

async function start() {
    if (DEEPSEEK_API_KEY === 'YOUR_API_KEY_HERE') {
        console.error("请先填入您的 DeepSeek API Key！");
        return;
    }
    for (const p of personas) {
        await runArenaRound(p, { pillars: ["甲子", "乙亥", "丙午", "丁未"], dm: "甲" });
    }
}

start();
