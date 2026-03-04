/**
 * 喜用忌判定核心引擎 (Standalone Logic Module) - V2
 * 强制遵循“喜神生扶用神”原则 (Xi supports Yong)
 */

const YongXiJiEngine = (function () {
    const GAN_WX = { '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土', '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水' };
    const M_WX = { '木': 0, '火': 1, '土': 2, '金': 3, '水': 4 };
    const REV_WX = ['木', '火', '土', '金', '水'];

    const isClash = (w1, w2) => {
        const id1 = M_WX[w1], id2 = M_WX[w2];
        return (id1 + 2) % 5 === id2 || (id2 + 2) % 5 === id1;
    };

    const getBridge = (w1, w2) => {
        const id1 = M_WX[w1], id2 = M_WX[w2];
        return (id1 + 2) % 5 === id2 ? REV_WX[(id1 + 1) % 5] : ((id2 + 2) % 5 === id1 ? REV_WX[(id2 + 1) % 5] : null);
    };

    function calculate(pillars, bsResult) {
        if (!pillars || !bsResult) return null;

        const dm = pillars[2].gan;
        const same = GAN_WX[dm];
        const m = M_WX[same];
        const output = REV_WX[(m + 1) % 5];
        const wealth = REV_WX[(m + 2) % 5];
        const official = REV_WX[(m + 3) % 5];
        const seal = REV_WX[(m + 4) % 5];

        const profile = bsResult.profile || [];
        const getTag = (wx) => {
            const p = profile.find(item => item.element === wx);
            return p ? p.isStrong : false;
        };

        const sorted = [...profile].sort((a, b) => b.score - a.score);
        const top1 = sorted[0]?.element, top2 = sorted[1]?.element;
        const bothStrong = (top1 && top2) ? (getTag(top1) && getTag(top2)) : false;

        // 1. 调候分析 (Climate)
        const mz = pillars[1].zhi;
        const waterScore = (profile.find(p => p.element === '水') || { score: 0 }).score;
        const fireScore = (profile.find(p => p.element === '火') || { score: 0 }).score;

        if (['巳', '午', '未'].includes(mz) && waterScore < 30) {
            return { mode: '调候', yong: '水', xi: '金', ji: '火', reason: '夏生调候取水，金生水为喜' };
        }
        if (['亥', '子', '丑'].includes(mz) && fireScore < 30) {
            return { mode: '调候', yong: '火', xi: '木', ji: '水', reason: '冬生调候取火，木生火为喜' };
        }

        // 2. 基础扶抑 (Baseline Strength/Weakness)
        let finalRes = null;
        const level = bsResult.level;

        if (level.includes('身强')) {
            // 身强：喜用应是 财/食。由于“喜生用”，如果取财(wealth)为用，则食(output)为喜。
            finalRes = { mode: '扶抑', yong: wealth, xi: output, ji: seal, reason: '身强取财星为用，喜食伤生财' };
        } else if (level.includes('身弱')) {
            // 身弱：喜用应是 印/官。由于“喜生用”，如果取印(seal)为用，则官(official)为喜。
            finalRes = { mode: '扶抑', yong: seal, xi: official, ji: wealth, reason: '身弱优先取印绶，喜官杀生印' };
        } else {
            finalRes = { mode: '扶抑', yong: wealth, xi: output, ji: seal, reason: '[平和]常规取财，喜食伤生助' };
        }

        // 3. 通关/修补 (Bridging/Repair)
        if (bothStrong && top1 && top2) {
            if (isClash(top1, top2)) {
                const bridge = getBridge(top1, top2);
                if (bridge) {
                    const id1 = M_WX[top1], id2 = M_WX[top2];
                    const destination = (id1 + 2) % 5 === id2 ? top2 : top1;
                    if ((M_WX[destination] + 2) % 5 === m && !getTag(same)) {
                        finalRes = {
                            mode: '通关转印',
                            yong: seal,
                            xi: official,
                            ji: wealth,
                            reason: `[修补-通关] 通关后${destination}克弱主，改取印${seal}，官${official}生印为喜`
                        };
                    } else {
                        finalRes = {
                            mode: '通关',
                            yong: destination,
                            xi: bridge,
                            ji: REV_WX[(M_WX[bridge] + 2) % 5],
                            reason: `[修补-通关] ${top1}${top2}交战，取${bridge}通关，${bridge}生${destination}，故${destination}为用`
                        };
                    }
                }
            } else {
                // 病药逻辑
                const id1 = M_WX[top1], id2 = M_WX[top2];
                let product = null;
                if ((id1 + 1) % 5 === id2) product = top2;
                else if ((id2 + 1) % 5 === id1) product = top1;

                // 如果生身过重（印旺或比劫旺），取财星为病药
                const isExcessive = (product === seal || product === same || getTag(seal));
                if (isExcessive) {
                    finalRes = {
                        mode: '特殊病药',
                        yong: wealth,
                        xi: output,
                        ji: seal,
                        reason: `[修补-病药] 生身过重(印/比旺)，取财星${wealth}为用，喜食伤${output}生财`
                    };
                }
            }
        }

        return finalRes;
    }

    return { calculate };
})();

if (typeof module !== 'undefined') module.exports = YongXiJiEngine;
if (typeof window !== 'undefined') window.YongXiJiEngine = YongXiJiEngine;
