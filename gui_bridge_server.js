const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const getAssetPath = (...segments) => {
    let cand = path.join(__dirname, ...segments);
    if (fs.existsSync(cand)) return cand;
    if (typeof process.pkg !== 'undefined') {
        cand = path.join(path.dirname(process.execPath), 'sanbanfu', ...segments);
        if (fs.existsSync(cand)) return cand;
    }
    return cand;
};

const SYSTEM_PROMPT = fs.readFileSync(getAssetPath('ai_system_prompt.md'), 'utf8');
const bridge = eval('require')(getAssetPath('bazi_ai_bridge.js'));
const PORT = 8081;

let conversationHistory = [];
let currentState = { step: 'calibration', subStep: 0, trust: 0 };

function callOllama(prompt) {
    return new Promise((resolve) => {
        const postData = JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.85,
            max_tokens: 600
        });
        const req = http.request('http://127.0.0.1:8000/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            timeout: 60000
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    resolve(result.choices[0].message.content || '');
                } catch (e) { resolve(''); }
            });
        });
        req.on('error', () => resolve(''));
        req.write(postData);
        req.end();
    });
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    if (req.method === 'POST' && parsedUrl.pathname === '/api/analyze') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', async () => {
            const params = JSON.parse(body);
            const baziData = bridge.BaziCore.calculateBazi(new Date(params.date), params.gender === '男' ? 'M' : 'F');
            const struct = bridge.BaziNarrative.generateStructuredReport({ bazi: baziData });

            // 1. 状态推进逻辑
            if (conversationHistory.length > 0 && params.feedback) {
                const isPos = /对|是|准|确|没?错|符合|理解|好/.test(params.feedback) && !/你好/.test(params.feedback);
                if (isPos) {
                    if (currentState.step === 'calibration') {
                        currentState.subStep++;
                        if (currentState.subStep > 2) currentState.step = 'diagnosis';
                    } else if (currentState.step === 'diagnosis') {
                        currentState.trust += 30;
                        if (currentState.trust >= 60) currentState.step = 'master_guidance';
                    }
                }
            }

            let content = "";

            // 2. 混合动力策略
            if (currentState.subStep === 0) {
                // 【开场模式】：强制模板
                content = "你好，我是给你推算八字的师父。请问你现在是有时间文字沟通的是吧？在正式开始给你推算之前，我会先给你推算几件小事，来校准你的时辰，你只需要回答对或者不对即可。能理解吗？";
            } else {
                // 【业务模式】：AI + 事实 + 强制引导
                let mission = "", prefix = "", fact = "";
                if (currentState.step === 'calibration') {
                    if (currentState.subStep === 1) {
                        mission = "第一件校准：深刻侧写性格基调。";
                        prefix = "好，先来看你校准时辰的第一件事。";
                        fact = struct.character;
                    } else {
                        mission = "第二件校准：描述日常行为或细节。";
                        prefix = "好的，继续来看校准你时辰的第二件事。";
                        fact = struct.behavior;
                    }
                } else if (currentState.step === 'diagnosis') {
                    mission = "痛点诊断：凌厉地指出命运卡点（如财运、感情）。";
                    prefix = "既然前面都对了，那我们直奔主题。";
                    fact = struct.painPoint;
                } else {
                    mission = "方案指引：温和地给出破局方法。";
                    prefix = "现在的局，破局的关键就在于...";
                    fact = struct.solution;
                }

                const prompt = `${SYSTEM_PROMPT}\n【事实证据】：${fact}\n【当前任务】：${mission}\n【强制要求】：必须用细腻的长篇描写来润色这段事实。字数超过200字。严禁废话。回复：`;
                const aiRaw = await callOllama(prompt);

                // 质量熔断：如果AI坍塌或太短，直接使用原始事实并强行扩充
                if (aiRaw.length < 50 || aiRaw.includes("命里带的")) {
                    content = `${prefix}${fact}。你想想是不是这样？`;
                } else {
                    content = `${prefix}${aiRaw}${aiRaw.includes('吗') || aiRaw.includes('？') ? '' : '\n\n你想想是不是这样？'}`;
                }
            }

            conversationHistory.push({ role: 'user', content: params.feedback || '你好' });
            conversationHistory.push({ role: 'assistant', content });

            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ status: 'success', content, next_step: currentState.step, updated_state: currentState }));
        });
        return;
    }
    if (req.method === 'POST' && parsedUrl.pathname === '/api/reset') {
        conversationHistory = [];
        currentState = { step: 'calibration', subStep: 0, trust: 0 };
        res.end(JSON.stringify({ status: 'reset_ok' }));
        return;
    }
});

server.listen(PORT, () => console.log('Hybrid Master Server on 8081'));
