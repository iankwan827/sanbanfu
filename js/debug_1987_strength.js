const GAN_WX = { '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土', '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水' };
const ZHI_WX = { '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火', '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水' };
const CHANG_SHENG = {
    '木': { '亥': '长生', '子': '沐浴', '丑': '冠带', '寅': '临官', '卯': '帝旺' },
    '火': { '寅': '长生', '卯': '沐浴', '辰': '冠带', '巳': '临官', '午': '帝旺' },
    '金': { '巳': '长生', '午': '沐浴', '未': '冠带', '申': '临官', '酉': '帝旺' },
    '水': { '申': '长生', '酉': '沐浴', '戌': '冠带', '亥': '临官', '子': '帝旺' },
    '土': { '寅': '长生', '卯': '沐浴', '辰': '冠带', '巳': '临官', '午': '帝旺' }
};


function isPillarVoid(idx, pillars) {
    // Simplified for diagnosis
    return false;
}

function calculateGlobalScores(pillars) {
    const scores = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };
    const weights = { stem: 10, zhi: [10, 45, 20, 15] }; // Y, M, D, H

    console.log("--- Step 1: Base Weights ---");
    pillars.forEach((p, i) => {
        if (!p || !p.zhi) return;
        if (p.gan && GAN_WX[p.gan]) {
            scores[GAN_WX[p.gan]] += weights.stem;
            console.log(`Pillar ${i} Stem ${p.gan} (${GAN_WX[p.gan]}): +${weights.stem}`);
        }
        if (weights.zhi[i]) {
            scores[ZHI_WX[p.zhi]] += weights.zhi[i];
            console.log(`Pillar ${i} Branch ${p.zhi} (${ZHI_WX[p.zhi]}): +${weights.zhi[i]}`);
        }
    });

    console.log("Scores after base:", JSON.stringify(scores));

    // Seasonal Pulse
    console.log("\n--- Step 2: Seasonal Pulse ---");
    if (pillars.length > 1 && pillars[1]) {
        const mWx = ZHI_WX[pillars[1].zhi];
        const m = { '木': 0, '火': 1, '土': 2, '金': 3, '水': 4 };
        const baseIdx = m[mWx];
        console.log(`Month Branch WX: ${mWx}`);
        Object.keys(scores).forEach(wx => {
            if (scores[wx] <= 0) return;
            const dist = (m[wx] - baseIdx + 5) % 5;
            let mod = 0;
            if (dist === 0) mod = 0; // Same as month
            else if (dist === 1) mod = 5;
            else if (dist === 4) mod = -2;
            else if (dist === 3) mod = -5;
            else if (dist === 2) mod = -8;
            scores[wx] += mod;
            console.log(`${wx} (dist ${dist}): ${mod}`);
        });
    }
    console.log("Scores after Seasonal:", JSON.stringify(scores));

    // Chang Sheng Bonus
    console.log("\n--- Step 3: Chang Sheng Bonus ---");
    pillars.forEach((p, i) => {
        if (!p) return;
        const zhi = p.zhi;
        Object.keys(scores).forEach(wx => {
            if (scores[wx] <= 0) return;
            const phase = CHANG_SHENG[wx] ? CHANG_SHENG[wx][zhi] : null;
            if (phase) {
                let bonus = 0;
                if (phase === '长生') bonus = 6;
                else if (phase === '沐浴') bonus = 4;
                else if (phase === '冠带') bonus = 5;
                else if (phase === '临官') bonus = 7;
                else if (phase === '帝旺') bonus = 8;
                scores[wx] += bonus;
                if (bonus > 0) console.log(`${wx} at Pillar ${i} Branch ${zhi}: ${phase} +${bonus}`);
            }
        });
    });
    console.log("Final Scores:", JSON.stringify(scores));
    return scores;
}

// 1987-09-19 10:00 (丁卯, 己酉, 庚午, 辛巳)
const pillars = [
    { gan: '丁', zhi: '卯' }, // Year
    { gan: '己', zhi: '酉' }, // Month
    { gan: '庚', zhi: '午' }, // Day
    { gan: '辛', zhi: '巳' }  // Hour
];

const scores = calculateGlobalScores(pillars);
const dmWx = '金';
const selfScore = scores['金'] + scores['土'];
const total = Object.values(scores).reduce((a, b) => a + b, 0);
const pct = (selfScore / total) * 100;

console.log(`\nDay Master: 庚 (${dmWx})`);
console.log(`Self Score (Metal + Earth): ${selfScore}`);
console.log(`Total Score: ${total}`);
console.log(`Pecentage: ${pct.toFixed(2)}%`);

let status = "中和";
if (pct >= 55) status = "身强";
else if (pct <= 45) status = "身弱";
console.log(`Status (Threshold 55/45): ${status}`);
