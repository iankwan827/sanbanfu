const fs = require('fs');
const path = require('path');
const https = require('https');

// ============ CONFIGURATION ============
const DEEPSEEK_API_KEY = 'sk-f07b277588f64850a9f8c799ef89ab91';
const BIAO_DIR = __dirname;
const OUTPUT_PATH = path.join(__dirname, 'gold_standard_data.jsonl');

// Load Sanbanfu Bridge
const bridge = require('../bazi_ai_bridge');

/**
 * DeepSeek API Helper
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
 * Knowledge Loader: Parses Markdown Logic Trees
 */
function loadLogicTrees() {
    const trees = {};
    const files = fs.readdirSync(BIAO_DIR).filter(f => f.endsWith('_树形结构图.md'));

    files.forEach(file => {
        const topic = file.replace('_树形结构图.md', '');
        const content = fs.readFileSync(path.join(BIAO_DIR, file), 'utf8');
        // Extract bullet points with specific markers or bold text
        const entries = content.split('\n')
            .filter(line => line.length > 20 && !line.startsWith('#'))
            .map(line => line.trim());
        trees[topic] = entries;
    });
    return trees;
}

const LOGIC_TREES = loadLogicTrees();

/**
 * Sample Generator
 */
async function generateGoldSample() {
    // 1. Pick a random date/time
    const year = 1970 + Math.floor(Math.random() * 40);
    const month = 1 + Math.floor(Math.random() * 12);
    const day = 1 + Math.floor(Math.random() * 28);
    const hour = Math.floor(Math.random() * 24);
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:00`;
    const gender = Math.random() > 0.5 ? '男' : '女';

    console.log(`\n[Gold Distill] 生日: ${dateStr} | 性别: ${gender}`);

    // 2. Calculate Bazi using Sanbanfu Engine
    const baziData = bridge.BaziCore.calculateBazi(new Date(dateStr), gender === '男' ? 'M' : 'F');
    const baziSummary = {
        pillars: baziData.pillars.map(p => p.gan + p.zhi).join(' '),
        dm: baziData.pillars[2].gan,
        strength: baziData.bodyStrength.level,
        keyGod: baziData.pillars[1].tenGod // Focus on Month Pillar Ten God as hook
    };

    // 3. Select Relevant Logic context (Randomly pick 2-3 matching topic snippets)
    const topic = (Math.random() > 0.5) ? '财' : '婚姻';
    const logicSnippets = LOGIC_TREES[topic] || [];
    const chosenLogic = logicSnippets.length > 0 ? logicSnippets[Math.floor(Math.random() * logicSnippets.length)] : "无特定逻辑";

    console.log(`[Logic Source] Topic: ${topic} | Snippet: ${chosenLogic.slice(0, 50)}...`);

    // 4. Prompt DeepSeek to generate a Gold-Standard Dialogue
    const masterPrompt = `
你现在扮演两个角色：【顶级八字销冠大师】和【一个真实的求测客户】。
我们要为一个轻量级 3B 模型生成“黄金教案”。

## 事实背景（必须严格遵守）
- 客户八字：${baziSummary.pillars} (日主：${baziSummary.dm}，${baziSummary.strength})
- 核心参考逻辑：${chosenLogic}

## 大师人设
1. 像真人：短句、带语气词、有压制力。
2. 撞门式开场：直接说中性格或现状痛点。
3. 引导成交：对话末尾要带“钩子”提问。

## 请生成一段 3-4 轮的完整微信式对话（JSONL 格式）：
{"messages": [
  {"role": "system", "content": "你是八字销冠大师..."},
  {"role": "assistant", "content": "开场白..."},
  {"role": "user", "content": "客户反馈..."},
  {"role": "assistant", "content": "大师进阶分析..."},
  ...
]}
只返回 JSON 代码块。
`;

    try {
        const rawResponse = await callDeepSeek([
            { role: "system", content: "你是一个专业的数据生成引擎，擅长模拟高质量的销冠对话。" },
            { role: "user", content: masterPrompt }
        ]);

        const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const sample = jsonMatch[0];
            fs.appendFileSync(OUTPUT_PATH, sample + '\n', 'utf8');
            console.log(`[Success] 已存入 1 组黄金对话数据。`);
        } else {
            console.warn(`[Warn] DeepSeek 返回非 JSON 格式: ${rawResponse.slice(0, 100)}...`);
        }
    } catch (e) {
        console.error(`[Error] 样本生成环节崩溃: ${e.stack || e.message}`);
    }
}

// Global Rejection Handler
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Generate 10 samples
async function main() {
    console.log("🚀 开始生成黄金微调数据...");
    if (!fs.existsSync(OUTPUT_PATH)) {
        fs.writeFileSync(OUTPUT_PATH, '', 'utf8');
    }

    for (let i = 0; i < 20; i++) {
        try {
            await generateGoldSample();
        } catch (err) {
            console.error(`[Fatal] 第 ${i + 1} 轮主循环报错:`, err);
        }
        await new Promise(r => setTimeout(r, 2000));
    }
    console.log("\n✅ 生成任务结束，请检查: " + OUTPUT_PATH);
}

main();
