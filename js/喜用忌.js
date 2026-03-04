/**
 * 喜用忌判定核心引擎 (Standalone Logic Module)
 * 提供标准化输入接口，基于身强弱结果计算喜神、用神和忌神。
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

    /**
     * 计算喜用忌核心函数
     * @param {Object} pillars 四柱数据
     * @param {Object} bsResult 身强弱计算结果 (需包含 level 和 profile)
     */
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
            return { mode: '调候', yong: '水', xi: '金', ji: '火', reason: '夏生调候取水' };
        }
        if (['亥', '子', '丑'].includes(mz) && fireScore < 30) {
            return { mode: '调候', yong: '火', xi: '木', ji: '水', reason: '冬生调候取火' };
        }

        // 2. 扶抑分析 (Strength/Weakness)
        let finalRes = null;
        const level = bsResult.level;

        if (level.includes('身强')) {
            finalRes = { mode: '扶抑', yong: output, xi: same, ji: seal, reason: '身强取食伤泄秀，喜比劫生助食伤' };
        } else if (level.includes('身弱')) {
            finalRes = { mode: '扶抑', yong: seal, xi: official, ji: wealth, reason: '身弱优先取印绶，喜官杀以生印' };
        } else {
            finalRes = { mode: '扶抑', yong: output, xi: same, ji: seal, reason: '[平和]常规取泄秀，喜比劫生扶' };
        }

        // 3. 通关/修补分析 (Bridging/Repair)
        if (bothStrong && top1 && top2) {
            // [通关修补]: 两强相克 -> 取桥梁
            if (isClash(top1, top2)) {
                const bridge = getBridge(top1, top2);
                if (bridge) {
                    const id1 = M_WX[top1], id2 = M_WX[top2];
                    const destination = (id1 + 2) % 5 === id2 ? top2 : top1;

                    // 如果通关后的五行克制弱势日主且日主弱，则改取印星
                    if ((M_WX[destination] + 2) % 5 === m && !getTag(same)) {
                        finalRes = {
                            mode: '通关转印',
                            yong: seal,
                            xi: official,
                            ji: wealth,
                            reason: `[修补-通关] 通关后五行(${destination})克日主且日主偏弱，改取印星(${seal})护身，喜官杀生印`
                        };
                    } else {
                        finalRes = {
                            mode: '通关',
                            yong: bridge,
                            xi: destination,
                            ji: (M_WX[bridge] + 2) % 5 === M_WX[destination] ? REV_WX[(M_WX[bridge] + 4) % 5] : REV_WX[(M_WX[destination] + 2) % 5],
                            reason: `[修补-通关] ${top1}与${top2}均强且交战，取${bridge}通关`
                        };
                    }
                }
            }
            // [病药修补]: 两强相生且生身过重 -> 取财制印
            else {
                const id1 = M_WX[top1], id2 = M_WX[top2];
                let product = null;
                if ((id1 + 1) % 5 === id2) product = top2;
                else if ((id2 + 1) % 5 === id1) product = top1;

                const isExcessiveSeal = (product === seal || (REV_WX[(M_WX[product] + 1) % 5] === same)) && getTag(seal);
                if ((product === same || isExcessiveSeal) && (getTag(same) || level.includes('身弱'))) {
                    finalRes = {
                        mode: '特殊病药',
                        yong: wealth,
                        xi: output,
                        ji: seal,
                        reason: `[修补-病药] ${top1}与${top2}均强且${isExcessiveSeal ? '生身过重/印星过旺' : '生身过重'}，取财星去病`
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
