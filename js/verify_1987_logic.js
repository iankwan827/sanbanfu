
const GAN_WX = { '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土', '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水' };
const ZHI_WX = { '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火', '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水' };
const WX_RELATION = {
    '木': { '木': '同', '火': '生', '土': '克', '金': '被克', '水': '被生' },
    '火': { '火': '同', '土': '生', '金': '克', '水': '被克', '木': '被生' },
    '土': { '土': '同', '金': '生', '水': '克', '木': '被克', '火': '被生' },
    '金': { '金': '同', '水': '生', '木': '克', '火': '被克', '土': '被生' },
    '水': { '水': '同', '木': '生', '火': '克', '土': '被克', '金': '被生' }
};

function calculate(pillars) {
    const dm = pillars[2].gan;
    const dmWx = GAN_WX[dm];
    const weights = { stem: 10, monthZhi: 45, dayZhi: 20, hourZhi: 15, yearZhi: 10 };

    let totalScore = 0, maxPossibleScore = 0;
    const isSameParty = (wx) => ['同', '被生'].includes(WX_RELATION[dmWx][wx]);

    console.log(`Day Master: ${dm} (${dmWx})`);

    // 天干得分
    [0, 1, 3].forEach(idx => {
        if (!pillars[idx]) return;
        const wx = GAN_WX[pillars[idx].gan];
        const isSame = isSameParty(wx);
        maxPossibleScore += weights.stem;
        if (isSame) {
            totalScore += weights.stem;
            console.log(`Pillar ${idx} Stem ${pillars[idx].gan} (${wx}): +10 (Same Party)`);
        } else {
            console.log(`Pillar ${idx} Stem ${pillars[idx].gan} (${wx}): +0`);
        }
    });

    // 地支得分
    const zhiWeights = [weights.yearZhi, weights.monthZhi, weights.dayZhi, weights.hourZhi];
    pillars.forEach((p, i) => {
        if (!p) return;
        const zhi = p.zhi;
        const zhiWx = ZHI_WX[zhi];
        const isSame = isSameParty(zhiWx);
        const baseW = zhiWeights[i];
        maxPossibleScore += baseW;

        if (isSame) {
            totalScore += baseW;
            console.log(`Pillar ${i} Branch ${zhi} (${zhiWx}): +${baseW} (Same Party)`);
            if (i === 1) { // Month Branch Double Count
                totalScore += weights.monthZhi;
                console.log(`Pillar ${i} Branch ${zhi} (Month): +${weights.monthZhi} (Double Count)`);
                // Note: maxPossibleScore does NOT increase in 身强弱.js
            }
        } else {
            console.log(`Pillar ${i} Branch ${zhi} (${zhiWx}): +0`);
        }
    });

    const pct = (totalScore / maxPossibleScore) * 100;
    console.log(`\nTotal Score: ${totalScore.toFixed(1)}`);
    console.log(`Max Possible: ${maxPossibleScore.toFixed(1)}`);
    console.log(`Percentage: ${pct.toFixed(1)}%`);

    let level = pct > 51.5 ? '身强' : (pct < 48.5 ? '身弱' : '中和');
    console.log(`Level: ${level}`);
}

// 1987-09-19 14:00 (丁卯, 己酉, 辛未, 乙未)
const pillars = [
    { gan: '丁', zhi: '卯' }, // Year
    { gan: '己', zhi: '酉' }, // Month
    { gan: '辛', zhi: '未' }, // Day
    { gan: '乙', zhi: '未' }  // Hour
];

calculate(pillars);
