const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// ============ CONFIGURATION ============
const DEEPSEEK_API_KEY = 'sk-f07b277588f64850a9f8c799ef89ab91';
const AI_ENGINE_URL = 'http://127.0.0.1:8000/v1/chat/completions'; // Our 3B AI API
const BIAO_DIR = __dirname;
const ARENA_LOG_PATH = path.join(__dirname, 'adversarial_arena_results.jsonl');

// Load Sanbanfu Bridge
const bridge = require('../bazi_ai_bridge');

/**
 * DeepSeek API Helper (The Intelligent Customer / Critic)
 */
function callDeepSeek(messages) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            model: "deepseek-chat",
            messages: messages,
            temperature: 1.0
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
                } catch (e) { reject(new Error('DeepSeek Fail: ' + data)); }
            });
        });

        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

/**
 * Our Local 3B AI API Helper (The Trainee Master)
 */
function callTraineeAI(prompt, history = []) {
    return new Promise((resolve, reject) => {
        const messages = [...history, { role: "user", content: prompt }];
        const postData = JSON.stringify({
            model: "qwen2-7b-instruct", // This is the 3B model being served
            messages: messages,
            temperature: 0.8
        });

        const req = http.request(AI_ENGINE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    if (result.choices && result.choices[0]) {
                        resolve(result.choices[0].message.content);
                    } else {
                        reject(new Error('AI API 返回格式错误: ' + data));
                    }
                } catch (e) { reject(new Error('Trainee AI Fail: ' + data)); }
            });
        });

        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

/**
 * Adversarial Round
 */
async function runAdversarialRound() {
    // 1. Generate a random identity
    const year = 1975 + Math.floor(Math.random() * 30);
    const month = 1 + Math.floor(Math.random() * 12);
    const day = 1 + Math.floor(Math.random() * 28);
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} 12:00:00`;
    const gender = Math.random() > 0.5 ? '男' : '女';

    console.log(`\n[Adversarial] 开启上帝视角对练 - 设定: ${dateStr} | ${gender}`);

    // 2. GET TRUTH: Get the ground truth from Sanbanfu Engine
    let baziData;
    try {
        baziData = bridge.BaziCore.calculateBazi(new Date(dateStr), gender === '男' ? 'M' : 'F');
    } catch (e) {
        console.error("Bazi Calculation Failed:", e);
        return;
    }

    // 🔥 上帝视角报告 (注入三板斧核心推导数据)
    const dm = baziData.pillars[2].gan;
    const tenGod = baziData.pillars[1].tenGod;
    const getSafe = (obj, key) => (obj && obj[key]) ? obj[key] : "暂无精准断语";

    const masterReport = `
【八字原局】${baziData.pillars.map(p => p.gan + p.zhi).join(' ')}
【性格剖析】${getSafe(bridge.BaziNarrative.data.dm, dm)}
【内心底色】${getSafe(bridge.BaziNarrative.data.inner, dm)}
【身强身弱】${baziData.bodyStrength.level}
【核心十神】${tenGod || "无"}: ${getSafe(bridge.BaziNarrative.data.gods, tenGod)}
    `;

    let dialogue = [];

    // 3. DeepSeek (The Customer) starts
    const customerInitialPrompt = [
        {
            role: "system", content: `你现在扮演一个找大师算命的客户。
你的背景正是刚才这份三板斧报告描述的这个人（包括性格、内心、身强身弱）：
${masterReport}

你的任务：
1. 这是一个微信场景。你表现得符合你的性格（比如倔你就倔，焦虑你就焦虑）。
2. 你很挑剔，只提供出生日期：${dateStr} (${gender})。
3. 如果大师说得不准、说套话，你就嘲讽他。
4. 如果大师能基于你的八字精准击中你的性格细节、内心阴影或卡点，你要给出惊讶反馈，并逐渐被他折服。
请给出你的第一句话（简短，像微信聊天）：` }
    ];

    let currentInput = await callDeepSeek(customerInitialPrompt);
    console.log(`客户 (DeepSeek): ${currentInput}`);
    dialogue.push({ role: 'user', content: currentInput });

    // 4. Arena Loop
    for (let i = 0; i < 4; i++) {
        // AI Trainee (3B Model) sees the "God Tool"
        const aiPrompt = `你现在是顶级八字大师。你拥有【上帝视角报告】提供的底牌。
你的任务：利用这些“冷数据”去取信客户，用扎心、带掌控感的话术套出他最近发生的真实事情。不要复读报告，要演得像一眼看穿。

【上帝视角报告】
${masterReport}

【历史对话】
${dialogue.map(d => `${d.role === 'user' ? '客户' : '大师'}: ${d.content}`).join('\n')}

大师回复（直接扎心，不要开场白，带钩子提问）：`;

        const traineeReply = await callTraineeAI(aiPrompt, []);
        console.log(`大师 (3B AI): ${traineeReply}`);
        dialogue.push({ role: 'assistant', content: traineeReply });

        // DeepSeek reacts
        const criticPrompt = [
            ...customerInitialPrompt,
            ...dialogue.map(d => ({ role: d.role === 'assistant' ? 'user' : 'assistant', content: d.content })),
            { role: "user", content: "根据大师刚才的话给出你的反馈（如果他精准击中了细节，请给出真实的惊讶反馈）：" }
        ];
        currentInput = await callDeepSeek(criticPrompt);
        console.log(`客户 (DeepSeek): ${currentInput}`);
        dialogue.push({ role: 'user', content: currentInput });

        if (currentInput.includes("服了") || currentInput.includes("准") || i === 3) break;
    }

    // 5. Evaluation & Save
    const evalPrompt = [
        { role: "system", content: "你是一个专业的对话质量评估官。" },
        { role: "user", content: `请评估这段实战数据：\n${dialogue.map(d => `${d.role}: ${d.content}`).join('\n')}\n\n大师是否成功利用数据完成了“取信”并最终让客户“折服”？如果是高质量数据（无废话、逻辑准、有销冠气场）请回答 PASS，否则 FAIL。` }
    ];
    const isQuality = await callDeepSeek(evalPrompt);

    if (isQuality.trim().toUpperCase() === 'PASS') {
        fs.appendFileSync(ARENA_LOG_PATH, JSON.stringify({ messages: dialogue }) + '\n');
        console.log("[Arena] 🏆 发现高质量对抗数据，已存档！");
    } else {
        console.log("[Arena] ❌ 对话质量一般，未存档。");
    }
}

async function main() {
    console.log("🚀 开启‘销冠大师-杠精客户’上帝视角对抗系统...");
    for (let i = 0; i < 8; i++) {
        try {
            await runAdversarialRound();
        } catch (e) {
            console.error(`[Error] 竞技场环节报错: ${e.message}`);
        }
        // Small cooldown
        await new Promise(r => setTimeout(r, 2000));
    }
}

main();
