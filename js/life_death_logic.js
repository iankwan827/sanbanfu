
// === Mappings (1:1 from Py) ===
// === Mappings (1:1 from Py) ===
// GAN_WX, ZHI_WX provided by bazi_logic.js
// const GAN_WX = { ... };
// const ZHI_WX = { ... };

const YANG_REN_MAP = {
    '甲': '卯', '乙': '寅', '丙': '午', '丁': '巳', '戊': '午',
    '己': '巳', '庚': '酉', '辛': '申', '壬': '子', '癸': '亥'
};

const CHONG_MAP = {
    '子': '午', '午': '子', '丑': '未', '未': '丑', '寅': '申', '申': '寅',
    '卯': '酉', '酉': '卯', '辰': '戌', '戌': '辰', '巳': '亥', '亥': '巳'
};

const STEM_ORDER = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

const ganHeMap = {
    '甲': '己', '乙': '庚', '丙': '辛', '丁': '壬', '戊': '癸',
    '己': '甲', '庚': '乙', '辛': '丙', '壬': '丁', '癸': '戊'
};

// === Helpers ===

function normalizePairs(pairList) {
    // Returns Set of string keys "AB" where A <= B
    return new Set(pairList.map(pair => [...pair].sort().join('')));
}

const CHONG_PAIRS_SET = normalizePairs([
    ['子', '午'], ['丑', '未'], ['寅', '申'],
    ['卯', '酉'], ['辰', '戌'], ['巳', '亥']
]);
const XING_PAIRS_SET = normalizePairs([
    ['寅', '巳'], ['巳', '申'], ['寅', '申'],
    ['丑', '戌'], ['戌', '未'], ['丑', '未']
]);
const HAI_PAIRS_SET = normalizePairs([
    ['子', '未'], ['丑', '午'], ['寅', '巳'],
    ['卯', '辰'], ['申', '亥'], ['酉', '戌']
]);
const PO_PAIRS_SET = normalizePairs([
    ['子', '酉'], ['丑', '辰'], ['寅', '亥'],
    ['卯', '午'], ['巳', '申'], ['未', '戌']
]);
const HE_PAIRS_SET = normalizePairs([
    ['子', '丑'], ['寅', '亥'], ['卯', '戌'],
    ['辰', '酉'], ['巳', '申'], ['午', '未']
]);
const AN_HE_PAIRS_SET = normalizePairs([
    ['寅', '丑'], ['午', '亥'], ['卯', '申'], ['子', '巳']
]);

function getBranchRelationship(b1, b2) {
    if (!b1 || !b2) return null;
    const key = [b1, b2].sort().join('');

    if (CHONG_PAIRS_SET.has(key)) return '冲';

    // Xing (Special Cases + San Xing)
    if (key === '子卯') return '刑'; // Zi-Mao
    if (b1 === b2 && ['辰', '午', '酉', '亥'].includes(b1)) return '刑'; // Self
    if (XING_PAIRS_SET.has(key)) return '刑';

    if (HAI_PAIRS_SET.has(key)) return '害';
    if (PO_PAIRS_SET.has(key)) return '破';
    if (HE_PAIRS_SET.has(key)) return '六合';
    if (AN_HE_PAIRS_SET.has(key)) return '暗合';

    return null;
}

function isTianKe(s1, s2) {
    if (!s1 || !s2) return false;
    const i1 = STEM_ORDER.indexOf(s1);
    const i2 = STEM_ORDER.indexOf(s2);
    if (i1 < 0 || i2 < 0) return false;
    const diff = Math.abs(i1 - i2);
    return diff === 6 || diff === 4;
}

function isDiChong(b1, b2) {
    if (!b1 || !b2) return false;
    const key = [b1, b2].sort().join('');
    return CHONG_PAIRS_SET.has(key);
}

function getNaYinElement(naYinStr) {
    if (!naYinStr) return null;
    if (naYinStr.includes("木")) return "木";
    if (naYinStr.includes("火")) return "火";
    if (naYinStr.includes("土")) return "土";
    if (naYinStr.includes("金")) return "金";
    if (naYinStr.includes("水")) return "水";
    return null;
}

function isElementCountering(e1, e2) {
    // Does e1 counter e2?
    const rules = {
        "木": "土",
        "土": "水",
        "水": "火",
        "火": "金",
        "金": "木"
    };
    return rules[e1] === e2;
}

// === Main Check Logic ===

function checkSuiYunBingLin(pillars) {
    // 4: DY, 5: LN
    if (pillars.length < 6) return [];
    const dy = pillars[4];
    const ln = pillars[5];
    if (dy.gan === ln.gan && dy.zhi === ln.zhi) {
        return [{
            title: "岁运并临",
            description: `流年与大运干支相同(${dy.gan}${dy.zhi})。断语：不死自己死亲人。`,
            probability: "极高",
            category: 'RISK'
        }];
    }
    return [];
}

function checkFanYinFuYin(pillars) {
    if (pillars.length < 6) return [];
    const day = pillars[2];
    const dy = pillars[4];
    const ln = pillars[5];

    function getInteractionType(sourceP) {
        if (sourceP.gan === day.gan && sourceP.zhi === day.zhi) return "伏吟";
        if (isTianKe(sourceP.gan, day.gan) && isDiChong(sourceP.zhi, day.zhi)) return "反吟";
        return null;
    }

    const dyType = getInteractionType(dy);
    const lnType = getInteractionType(ln);

    if (dyType && lnType) {
        let desc = [];
        desc.push(`大运${dyType}日柱(${dy.gan}${dy.zhi} vs ${day.gan}${day.zhi})`);
        desc.push(`流年${lnType}日柱(${ln.gan}${ln.zhi} vs ${day.gan}${day.zhi})`);
        return [{
            title: `${dyType} / ${lnType} (岁运同时引动)`,
            description: desc.join('，') + "。断语：反吟伏吟，不死也脱层皮。",
            probability: "极高",
            category: 'RISK'
        }];
    }
    return [];
}

function checkThreeClashOne(pillars) {
    if (pillars.length < 6) return [];
    const dy = pillars[4];
    const ln = pillars[5];

    // DY and LN must match on Zhi strictly
    if (dy.zhi !== ln.zhi) return [];
    const sourceBranch = dy.zhi;

    // Check Original (0-3) presence
    const orgBranches = pillars.slice(0, 4).map(p => p.zhi);
    if (!orgBranches.includes(sourceBranch)) return [];

    // Target to clash
    const target = CHONG_MAP[sourceBranch];
    if (!target) return [];

    if (orgBranches.includes(target)) {
        const orgCount = orgBranches.filter(b => b === sourceBranch).length;
        // Total count = orgCount + 2 (dy+ln)
        return [{
            title: "三冲一 (必有生死灾)",
            description: `岁运地支相同(${sourceBranch})与原局${orgCount}个${sourceBranch}共聚，三冲一(冲原局${target})。断语：三冲一，必有生死灾。`,
            probability: "极高",
            category: 'RISK'
        }];
    }
    return [];
}

function checkYangRenChong(pillars) {
    if (pillars.length < 6) return [];

    // Identify Pillars with "Yang Ren" Shen Sha (Only Original 4 Pillars)
    const yangRenIndices = [];
    pillars.slice(0, 4).forEach((p, i) => {
        const ss = p.shenSha || [];
        if (ss.includes('羊刃')) {
            yangRenIndices.push(i);
        }
    });

    if (yangRenIndices.length === 0) return [];

    const results = [];
    const source = "(岁运引动)";

    // Check Triggers from DY (4) and LN (5)
    // We check if External Pillar (4 or 5) clashes/harms ANY of the Yang Ren Pillars
    const triggers = [];
    let hasDyTrigger = false;
    let hasLnTrigger = false;
    const externalIndices = [4, 5];

    externalIndices.forEach(extIdx => {
        const bExt = pillars[extIdx].zhi;
        yangRenIndices.forEach(orgIdx => {
            const bOrg = pillars[orgIdx].zhi;
            const rel = getBranchRelationship(bExt, bOrg);
            // Yang Ren fears Chong (Clash) and Xing (Punishment)
            if (['冲', '刑'].includes(rel)) {
                triggers.push({ rel, zhiExt: bExt, zhiOrg: bOrg, idx: extIdx });
                if (extIdx === 4) hasDyTrigger = true;
                if (extIdx === 5) hasLnTrigger = true;
            }
        });
    });

    if (triggers.length === 0) return [];

    let foundDieDie = false;

    // A. Yang Ren Die Die (Stacked)
    // If we have 2 or more Yang Ren pillars (regardless of source) AND a trigger
    if (yangRenIndices.length >= 2) {
        const t = triggers[0];
        const tDesc = `${t.zhiExt}与${t.zhiOrg}发生${t.rel}`;

        let tType = (hasDyTrigger && !hasLnTrigger) ? "DY" : ((!hasDyTrigger && hasLnTrigger) ? "LN" : "BOTH");
        const dyName = pillars[4].gan + pillars[4].zhi;

        // Pick one Yang Ren Branch for display if they are the same, otherwise list them?
        // Usually "Die Die" implies multiple.
        // We use the first triggered one for description.

        results.push({
            title: `羊刃叠叠逢刑冲 ${source}`,
            description: `原局出现${yangRenIndices.length}个羊刃，且岁运引发刑冲(${tDesc})。断语：羊刃叠叠，必主血光之灾，死于非命。`,
            probability: "高",
            trigger_type: tType,
            dy_name: dyName,
            category: 'RISK'
        });
        foundDieDie = true;
    }

    if (!foundDieDie) {
        const chongTriggers = triggers.filter(t => t.rel === '冲');
        if (chongTriggers.length > 0) {
            const t = chongTriggers[0];
            const clashDesc = `${t.zhiExt}与${t.zhiOrg}相冲`;
            let tType = (hasDyTrigger && !hasLnTrigger) ? "DY" : ((!hasDyTrigger && hasLnTrigger) ? "LN" : "BOTH");
            const dyName = pillars[4].gan + pillars[4].zhi;

            // Check Qi Sha Rooted
            let hasRootedQiSha = false;
            // Helper for Root check
            const isRooted = (gan) => {
                let wx = GAN_WX[gan];
                if (!wx) return false;
                for (let p of pillars) {
                    if (p.hidden) {
                        for (let h of p.hidden) {
                            if (h.stem && GAN_WX[h.stem] === wx) return true;
                        }
                    }
                }
                return false;
            };

            for (let p of pillars) {
                if (p.tenGod && p.tenGod.includes('杀')) {
                    if (isRooted(p.gan)) {
                        hasRootedQiSha = true;
                        break;
                    }
                }
            }

            if (hasRootedQiSha) {
                results.push({
                    title: `羊刃逢冲加七杀 ${source}`,
                    description: `原局羊刃(${t.zhiOrg})逢冲(${clashDesc})，且杀刃相见(七杀有根)。断语：羊刃逢冲加七杀，必死无疑。`,
                    probability: "极高",
                    trigger_type: tType,
                    dy_name: dyName,
                    category: 'RISK'
                });
            } else {
                results.push({
                    title: `羊刃逢冲 ${source}`,
                    description: `原局羊刃(${t.zhiOrg})逢冲(${clashDesc})。断语：羊刃逢冲，不死也疯。`,
                    probability: "高",
                    trigger_type: tType,
                    dy_name: dyName,
                    category: 'RISK'
                });
            }
        }
    }

    // Dedupe
    const seen = new Set();
    return results.filter(r => {
        if (seen.has(r.title)) return false;
        seen.add(r.title);
        return true;
    });
}

function checkOwlDevoursEatingGod(pillars) {
    const eatingKws = ['食', '食神'];
    const owlKws = ['枭', '偏印'];

    let hasEating = false;
    let hasOwl = false;

    // Check All pillars for presence
    for (let p of pillars) {
        if (eatingKws.some(k => p.tenGod && p.tenGod.includes(k))) hasEating = true;
        if (owlKws.some(k => p.tenGod && p.tenGod.includes(k))) hasOwl = true;
        if (p.hidden) {
            for (let h of p.hidden) {
                if (eatingKws.some(k => h.god.includes(k))) hasEating = true;
                if (owlKws.some(k => h.god.includes(k))) hasOwl = true;
            }
        }
    }

    const intraResults = [];
    // Intra-pillar check
    pillars.forEach((p, idx) => {
        let bHasEating = false;
        let bHasOwl = false;
        if (p.hidden) {
            for (let h of p.hidden) {
                if (eatingKws.some(k => h.god.includes(k))) bHasEating = true;
                if (owlKws.some(k => h.god.includes(k))) bHasOwl = true;
            }
        }
        if (bHasEating && bHasOwl) {
            const source = idx < 4 ? "(原局)" : "(岁运)";
            let tType = idx === 4 ? "DY" : (idx === 5 ? "LN" : "ORIGINAL");
            intraResults.push({
                title: `枭神夺食 (同宫) ${source}`,
                description: `${p.zhi}支藏干中同时包含食神与枭神(偏印)。`,
                probability: "高",
                trigger_type: tType,
                dy_name: pillars[4] ? (pillars[4].gan + pillars[4].zhi) : '',
                category: 'RISK'
            });
        }
    });

    const hits = [];

    // Helper Root Check
    const isRootedIdx = (idx) => {
        if (idx >= pillars.length) return false;
        let sVal = pillars[idx].gan;
        let wx = GAN_WX[sVal];
        if (!wx) return false;
        for (let p of pillars) {
            if (p.hidden) {
                for (let h of p.hidden) {
                    if (h.stem && GAN_WX[h.stem] === wx) return true;
                }
            }
        }
        return false;
    };

    // Rule 1: Stem Interaction
    const eatingIndices = [];
    const owlIndices = [];
    pillars.forEach((p, i) => {
        if (eatingKws.some(k => p.tenGod && p.tenGod.includes(k))) eatingIndices.push(i);
        if (owlKws.some(k => p.tenGod && p.tenGod.includes(k))) owlIndices.push(i);
    });

    const eatingRooted = eatingIndices.some(i => isRootedIdx(i));
    const owlRooted = owlIndices.some(i => isRootedIdx(i));

    if (eatingRooted && owlRooted) {
        let r1Found = false;
        let r1Indices = [];
        for (let eIdx of eatingIndices) {
            for (let oIdx of owlIndices) {
                let isOriginal = (eIdx < 4 && oIdx < 4);
                let isAdjacent = Math.abs(eIdx - oIdx) === 1;
                if (!isOriginal || isAdjacent) {
                    r1Found = true;
                    r1Indices = [eIdx, oIdx];
                    break;
                }
            }
            if (r1Found) break;
        }

        if (r1Found) {
            // Check Wealth (Cai) Guard
            let caiIndices = [];
            pillars.forEach((p, i) => {
                if (p.tenGod && p.tenGod.includes('财')) caiIndices.push(i);
            });
            let caiRooted = caiIndices.some(i => isRootedIdx(i));
            if (!caiRooted) {
                hits.push({
                    desc: "天干食神与枭神相见(且有根)，无财星护卫",
                    indices: r1Indices,
                    rule: '天干'
                });
            }
        }
    }

    // Rule 2: Same Pillar (Tong Zhu) - Already checked?
    // The Python logic checks "Owl on Stem, Eating on Branch" specifically or vice versa?
    // Python says: "Stem has Owl keywords... then check hidden for Eating keywords"
    pillars.forEach((p, idx) => {
        if (owlKws.some(k => p.tenGod && p.tenGod.includes(k))) {
            if (p.hidden && p.hidden.some(h => eatingKws.some(kw => h.god.includes(kw)))) {
                hits.push({
                    desc: `${p.gan}${p.zhi}同柱：枭神盖头克食神`,
                    indices: [idx],
                    rule: '同柱'
                });
            }
        }
    });

    // Rule 5: Owl Bureau
    const branches = pillars.map(p => p.zhi);
    const dmStem = pillars[2].gan;
    const dmWx = GAN_WX[dmStem];
    const resourceMap = { '木': '水', '火': '木', '土': '火', '金': '土', '水': '金' };
    const resourceWx = resourceMap[dmWx];

    const bureaus = [
        { grp: ['申', '子', '辰'], wx: '水' }, { grp: ['亥', '卯', '未'], wx: '木' },
        { grp: ['寅', '午', '戌'], wx: '火' }, { grp: ['巳', '酉', '丑'], wx: '金' },
        { grp: ['亥', '子', '丑'], wx: '水' }, { grp: ['寅', '卯', '辰'], wx: '木' },
        { grp: ['巳', '午', '未'], wx: '火' }, { grp: ['申', '酉', '戌'], wx: '金' }
    ];

    const bSet = new Set(branches);

    bureaus.forEach(bObj => {
        if (bObj.wx === resourceWx) {
            const hasGroup = bObj.grp.every(x => bSet.has(x));
            if (hasGroup && hasEating) {
                const bIndices = branches.map((b, i) => bObj.grp.includes(b) ? i : -1).filter(i => i !== -1);
                hits.push({
                    desc: `地支成${bObj.wx}局(印/枭局)，且命局有食神。`,
                    indices: bIndices,
                    rule: '三合/三会'
                });
            }
        }
    });

    const results = [...intraResults];

    // Split hits into Static / Dynamic
    const staticHits = hits.filter(h => !h.indices.some(i => i >= 4));
    const dynamicHits = hits.filter(h => h.indices.some(i => i >= 4));

    if (staticHits.length > 0) {
        let desc = staticHits.map(h => h.desc).join('；') + "。断语：食神逢枭，十有九死伤；食神遇枭，尸逢道路旁。";
        results.push({
            title: "枭神夺食 (原局)",
            description: desc,
            probability: "高",
            trigger_type: "ORIGINAL",
            dy_name: pillars[4] ? (pillars[4].gan + pillars[4].zhi) : '',
            category: 'RISK'
        });
    }

    if (dynamicHits.length > 0) {
        let desc = dynamicHits.map(h => h.desc).join('；') + "。断语：食神逢枭，十有九死伤；食神遇枭，尸逢道路旁。";
        let allIndices = [];
        dynamicHits.forEach(h => allIndices.push(...h.indices));
        let hasDy = allIndices.includes(4);
        let hasLn = allIndices.includes(5);
        let tType = (hasDy && !hasLn) ? "DY" : ((!hasDy && hasLn) ? "LN" : "BOTH");

        results.push({
            title: "枭神夺食 (岁运引动)",
            description: desc,
            probability: "高",
            trigger_type: tType,
            dy_name: pillars[4] ? (pillars[4].gan + pillars[4].zhi) : '',
            category: 'RISK'
        });
    }

    // Dedupe
    const finalRes = [];
    const seen = new Set();
    results.forEach(r => {
        const key = r.title + r.trigger_type;
        if (!seen.has(key)) {
            seen.add(key);
            finalRes.push(r);
        }
    });
    return finalRes;
}

function analyzeRisks(pillars, info = {}) {
    // pillars: Array of 6 objects (Y,M,D,H, DY, LN)
    // Note: Caller must ensure pillars are strictly 6 for dynamic checks, 
    // or 4 for static checks (functions handle length checks)

    // Normalize Check
    // We assume pillars have consistency in structure.

    const all = [];



    const egmo = checkOwlDevoursEatingGod(pillars);
    all.push(...egmo);

    const yrc = checkYangRenChong(pillars);
    all.push(...yrc);

    // --- New Static Secrets ---

    // Secret 1: 年比月比偏财隐，父亲早逝
    if (pillars[0] && pillars[1]) {
        const p0Ten = pillars[0].tenGod || "";
        const p1Ten = pillars[1].tenGod || "";
        if (p0Ten.includes('比') && p1Ten.includes('比')) {
            const stemsTen = pillars.slice(0, 4).map(p => p.tenGod || "");
            const hasIndirectWealthOnStem = stemsTen.some(t => t.includes('才'));
            if (!hasIndirectWealthOnStem) {
                all.push({
                    title: "秘诀：比肩丛生父早逝",
                    description: "年比月比偏财隐，父亲早逝。断语：年干及月干均为比肩，且偏财星不在天干。",
                    probability: "高",
                    trigger_type: 'ORIGINAL',
                    category: 'RISK'
                });
            }
        }
    }

    // Secret 2: 年支月支皆正财，母缘浅薄或早殇
    if (pillars[0] && pillars[1]) {
        const yHidden = pillars[0].hidden || [];
        const mHidden = pillars[1].hidden || [];
        const yMainGod = yHidden[0] ? yHidden[0].god : "";
        const mMainGod = mHidden[0] ? mHidden[0].god : "";
        if (yMainGod.includes('财') && mMainGod.includes('财')) {
            // Note: '财' matches '正财' but not '才' (偏财). Perfect.
            all.push({
                title: "秘诀：正财重重母缘薄",
                description: "年支月支皆正财，母缘浅薄或早殇。断语：年支与月支的主气均为正财星。",
                probability: "高",
                trigger_type: 'ORIGINAL',
                category: 'RISK'
            });
        }
    }

    // Secret 3: 年伤月枭，父埋母病
    if (pillars[0] && pillars[1]) {
        const p0Ten = pillars[0].tenGod || "";
        const p1Ten = pillars[1].tenGod || "";
        const isOwl = p1Ten.includes('枭') || p1Ten.includes('偏印');
        if (p0Ten.includes('伤') && isOwl) {
            all.push({
                title: "秘诀：年伤月枭",
                description: "年伤月枭，父埋母病。断语：年干见伤官，月干见枭神（偏印）。",
                probability: "高",
                trigger_type: 'ORIGINAL',
                category: 'RISK'
            });
        }
    }

    // Secret 5: 刑冲破印母他乡
    // Logic: 
    // 1. Identify "Seal" (Zheng Yin > Pian Yin). Check if damaged (Star Damage).
    // 2. ALSO check Month Branch (Palace Damage).
    // 3. If both, it's a "Typical Case" (典型案例).

    let starIdx = -1;
    let starSource = '';

    const findBranchWithGod = (kws) => {
        for (let i = 0; i < 4; i++) {
            if (i >= pillars.length) break;
            const hidden = pillars[i].hidden || [];
            if (hidden.some(h => kws.some(kw => h.god.includes(kw)))) return i;
        }
        return -1;
    };

    // 1. Find Seal (Star)
    starIdx = findBranchWithGod(['正印', '印']);
    if (starIdx !== -1) {
        starSource = '正印';
    } else {
        starIdx = findBranchWithGod(['偏印', '枭']);
        if (starIdx !== -1) {
            starSource = '偏印';
        }
    }

    let isStarDamaged = false;
    let isPalaceDamaged = false;
    let starDamageInfo = '';
    let palaceDamageInfo = '';

    // Check Star Damage
    if (starIdx !== -1 && starIdx < pillars.length) {
        const targetZhi = pillars[starIdx].zhi;
        for (let i = 0; i < 4; i++) {
            if (i === starIdx || i >= pillars.length) continue;
            const otherZhi = pillars[i].zhi;
            const rel = getBranchRelationship(targetZhi, otherZhi);
            if (rel === '冲' || rel === '刑' || rel === '破') {
                isStarDamaged = true;
                starDamageInfo = `星(${starSource}${targetZhi})受${rel}`;
                break;
            }
        }
    }

    // Check Palace Damage (Month Branch - Index 1)
    if (pillars.length > 1) {
        const mZhi = pillars[1].zhi;
        for (let i = 0; i < 4; i++) {
            if (i === 1) continue;
            const otherZhi = pillars[i].zhi;
            const rel = getBranchRelationship(mZhi, otherZhi);
            if (rel === '冲' || rel === '刑' || rel === '破') {
                isPalaceDamaged = true;
                palaceDamageInfo = `宫(月支${mZhi})受${rel}`;
                break;
            }
        }
    }

    if (isStarDamaged || isPalaceDamaged) {
        let desc = "刑冲破印母他乡。断语：";
        if (isStarDamaged && isPalaceDamaged) {
            desc += `典型案例！${starDamageInfo}且${palaceDamageInfo}，印星与月令母宫同时受损，主母亲缘分极薄、多病或离散。`;
        } else if (isStarDamaged) {
            desc += `${starDamageInfo}，主母亲缘分薄、远走他乡或工作不稳定。`;
        } else {
            desc += `${palaceDamageInfo}，虽印星未损，但母宫受损，亦主母亲缘分薄或不安稳。`;
        }

        all.push({
            title: "秘诀：刑冲破印母他乡",
            description: desc,
            probability: "高",
            trigger_type: "ORIGINAL",
            category: 'RISK'
        });
    }

    // Secret 6: 二重亡神母先丧
    let wangShenCount = 0;
    pillars.slice(0, 4).forEach(p => {
        const ss = p.shenSha || [];
        if (ss.includes('亡神')) wangShenCount++;
    });

    if (wangShenCount >= 2) {
        all.push({
            title: "秘诀：二重亡神母先丧",
            description: "二重亡神母先丧。断语：命局中出现两个或以上亡神，主母亲身体不佳或先于父亲去世。",
            probability: "高",
            trigger_type: "ORIGINAL",
            category: 'RISK'
        });
    }

    // Secret 7: 时杀带花父先亡
    if (pillars.length >= 4) {
        const hPillar = pillars[3];
        const hTenGod = hPillar.tenGod || '';
        const hShenSha = hPillar.shenSha || [];

        // Check Seven Killings
        const isQiSha = hTenGod.includes('杀') || hTenGod.includes('七杀') || hTenGod.includes('偏官');

        // Check Flower (Xian Chi / Tao Hua)
        const hasFlower = hShenSha.includes('咸池') || hShenSha.includes('桃花');

        if (isQiSha && hasFlower) {
            all.push({
                title: "秘诀：时杀带花父先亡",
                description: "时杀带花父先亡。断语：时干为七杀，且时支临咸池或桃花，主父亲恐先于母亲去世。",
                probability: "高",
                trigger_type: "ORIGINAL",
                category: 'RISK'
            });
        }
    }

    // Secret 8: 日支羊刃他处见，配偶早丧 (Static)
    // Secret 9: 日坐羊刃逢冲，配偶血光早亡 (Dynamic, but static logic sets stage)
    // Check Day Yang Ren first by Shen Sha tag
    const dayPillar = pillars[2];
    const hasDayYangRen = (dayPillar.shenSha || []).includes('羊刃');

    // Only proceed if Day Branch IS Yang Ren (by Tag)
    if (hasDayYangRen) {
        // Condition 1: Check if this specific Yang Ren Branch appears elsewhere (Year, Month, Hour)
        const dayZhi = dayPillar.zhi;
        let otherYangRenCount = 0;

        [0, 1, 3].forEach(idx => {
            if (idx < pillars.length && pillars[idx].zhi === dayZhi) {
                otherYangRenCount++;
            }
        });

        if (otherYangRenCount > 0) {
            all.push({
                title: "秘诀：日支羊刃他处见",
                description: `日支羊刃他处见，配偶早丧。断语：日支为羊刃(${dayZhi})，且在年/月/时支再次出现(${otherYangRenCount}个)。`,
                probability: "高",
                trigger_type: "ORIGINAL",
                category: 'RISK'
            });
        }
    }

    // Secret 10: 日支被月时双冲，婚破偶病
    if (pillars.length >= 4) {
        const dZhi = pillars[2].zhi;
        const mZhi = pillars[1].zhi;
        const hZhi = pillars[3].zhi;

        const mRel = getBranchRelationship(dZhi, mZhi);
        const hRel = getBranchRelationship(dZhi, hZhi);

        if (mRel === '冲' && hRel === '冲') {
            all.push({
                title: "秘诀：日支被月时双冲",
                description: `日支被月时双冲，婚破偶病。断语：日支(${dZhi})同时被月支(${mZhi})与时支(${hZhi})相冲，主婚姻破裂或配偶多病灾。`,
                probability: "高",
                trigger_type: "ORIGINAL",
                category: 'RISK'
            });
        }
    }


    // Secret 11: 二官/财争合日
    // Logic: Identify Stem that combines with Day Master (GAN_HE_MAP matches).
    // If Count >= 2 in Year/Month/Hour:
    // Male (Yang DM): Combine Stem is Zheng Cai -> "二财争合，男多妻"
    // Female (Yin DM): Combine Stem is Zheng Guan -> "二官争合，女多嫁"
    const combineGan = ganHeMap[pillars[2].gan];
    if (combineGan) {
        let combineCount = 0;
        [0, 1, 3].forEach(idx => {
            if (idx < pillars.length && pillars[idx].gan === combineGan) {
                combineCount++;
            }
        });

        if (combineCount >= 2) {
            const isMale = (info.gender == 1 || info.gender == '1');
            const isYangDM = ["甲", "丙", "戊", "庚", "壬"].includes(pillars[2].gan);

            // Male + Yang DM (Combine with Cai)
            if (isMale && isYangDM) {
                all.push({
                    title: "秘诀：二财争合 (男命)",
                    description: `男命天干二财争合日主，三妻四妾。断语：日主(${pillars[2].gan})与天干(${combineGan})(正财)相合，且(${combineGan})出现${combineCount}次，主感情复杂，多妻多恋。`,
                    probability: "高",
                    trigger_type: "ORIGINAL",
                    category: 'RISK'
                });
            }
            // Female + Yin DM (Combine with Guan)
            else if (!isMale && !isYangDM) {
                all.push({
                    title: "秘诀：二官争合 (女命)",
                    description: `女命天干二官争合日主，多婚之象。断语：日主(${pillars[2].gan})与天干(${combineGan})(正官)相合，且(${combineGan})出现${combineCount}次，主婚姻多变，易多婚或出轨。`,
                    probability: "高",
                    trigger_type: "ORIGINAL",
                    category: 'RISK'
                });
            }
        }
    }


    // Secret 12: 日坐华盖合驿马 (同床异梦)
    const dZhi = pillars[2].zhi;
    const dShenSha = pillars[2].shenSha || [];
    if (dShenSha.includes('华盖')) {
        const yiMaSet = new Set(['寅', '申', '巳', '亥']);
        [0, 1, 3].forEach(idx => {
            if (idx < pillars.length) {
                const targetZhi = pillars[idx].zhi;
                if (yiMaSet.has(targetZhi)) {
                    const rel = getBranchRelationship(dZhi, targetZhi);
                    const key = [dZhi, targetZhi].sort().join('');
                    const isExtraCombo = ['寅戌', '巳丑', '申辰', '亥未', '寅辰', '亥丑', '巳未', '申戌'].includes(key);
                    if (rel === '六合' || isExtraCombo) {
                        all.push({
                            title: "秘诀：日坐华盖合驿马",
                            description: `日坐华盖合驿马，同床异梦。断语：日支(${dZhi})为华盖，且与原局驿马支(${targetZhi})相合，主夫妻间缺乏沟通，价值观不一。`,
                            probability: "中",
                            trigger_type: "ORIGINAL",
                            category: 'RISK'
                        });
                    }
                }
            }
        });
    }

    // Secret 13: 日时对冲，分道扬镳
    if (pillars.length >= 4) {
        const hZhi = pillars[3].zhi;
        if (getBranchRelationship(dZhi, hZhi) === '冲') {
            all.push({
                title: "秘诀：日时对冲",
                description: `日时对冲，分道扬镳。断语：日支(${dZhi})与时支(${hZhi})相冲，主夫妻间易产生剧烈矛盾，甚至离婚之象。`,
                probability: "中",
                trigger_type: "ORIGINAL",
                category: 'RISK'
            });
        }
    }

    // Secret 14: 女命时支正印多，克子
    const isFemale = (info.gender == 0 || info.gender == '0' || info.gender == '女');
    if (isFemale && pillars.length >= 4) {
        const hZhiHidden = pillars[3].hidden || [];
        const hHasZhengYin = hZhiHidden.some(h => h.name === '正印');

        if (hHasZhengYin) {
            let otherZhengYinCount = 0;
            [0, 1, 2].forEach(idx => {
                const hidden = pillars[idx].hidden || [];
                if (hidden.some(h => h.name === '正印')) {
                    otherZhengYinCount++;
                }
            });

            if (otherZhengYinCount >= 1) {
                all.push({
                    title: "秘诀：女命时支正印多",
                    description: `女命时支正印多，克子之象。断语：命主为女性，时支含有正印，且年/月/日支中亦有正印出现，主子缘较薄，或仅有女儿。`,
                    probability: "中",
                    trigger_type: "ORIGINAL",
                    category: 'RISK'
                });
            }
        }
    }

    // Secret 15: 时柱空亡，儿女缘浅
    if (pillars.length >= 4) {
        const dPillar = pillars[2];
        const hZhi = pillars[3].zhi;
        const dKongWang = dPillar.kongWang || "";

        if (dKongWang.includes(hZhi)) {
            all.push({
                title: "秘诀：时柱空亡",
                description: `时柱空亡，儿女缘浅。断语：时支(${hZhi})处于日柱(${dPillar.gan}${dPillar.zhi})的空亡位(${dKongWang})，主子孙缘分较薄，或容易有流产、损子之忧。`,
                probability: "中",
                trigger_type: "ORIGINAL",
                category: 'RISK'
            });
        }
    }

    // Secret 16: 年月刑冲父子离
    if (pillars.length >= 2) {
        const yZhi = pillars[0].zhi;
        const mZhi = pillars[1].zhi;
        const rel = getBranchRelationship(yZhi, mZhi);
        if (rel === '刑' || rel === '冲') {
            all.push({
                title: "秘诀：年月刑冲父子离",
                description: `年月刑冲父子离。断语：年支(${yZhi})与月支(${mZhi})相${rel}，主父亲常年在外工作，或命主与双亲缘分较薄，早年离家。`,
                probability: "中",
                trigger_type: "ORIGINAL",
                category: 'RISK'
            });
        }
    }

    // Secret 17: 戊甲重克头面疤
    if (pillars.length >= 4) {
        let countJia = 0;
        let countWu = 0;
        [0, 1, 3].forEach(idx => {
            if (pillars[idx].gan === '甲') countJia++;
            if (pillars[idx].gan === '戊') countWu++;
        });

        if ((countJia === 2 && countWu === 1) || (countJia === 1 && countWu === 2)) {
            all.push({
                title: "秘诀：戊甲重克头面疤",
                description: `戊甲重克头面疤。天干见两甲克一戊或一甲克两戊（不含日柱），主头面部易受伤留疤，或有明显胎记、瑕疵。`,
                probability: "中",
                trigger_type: "ORIGINAL",
                category: 'RISK'
            });
        }
    }

    // Secret 18 & 19: 酉亥与辰戌酉亥
    if (pillars.length >= 4) {
        const originalZhis = pillars.slice(0, 4).map(p => p.zhi);
        const hasYou = originalZhis.includes('酉');
        const hasHai = originalZhis.includes('亥');
        const hasChen = originalZhis.includes('辰');
        const hasXu = originalZhis.includes('戌');

        if (hasChen && hasXu && hasYou && hasHai) {
            all.push({
                title: "秘诀：地支辰戌酉亥全齐",
                description: `地支辰戌酉亥全齐。断语：地支集齐辰戌酉亥，性格极端火爆，易因冲动招惹官非，并需防范突发性短命之灾。`,
                probability: "高",
                trigger_type: "ORIGINAL",
                category: 'RISK'
            });
        } else if (hasYou && hasHai) {
            all.push({
                title: "秘诀：地支酉亥",
                description: `地支见酉和亥。断语：地支见酉和亥，主性格风流、纵欲，需防酒色过度伤害身体，影响寿元。`,
                probability: "中",
                trigger_type: "ORIGINAL",
                category: 'RISK'
            });
        }
    }

    // Secret 20: 地支一卯二卯，富贵到老
    if (pillars.length >= 4) {
        const maoCount = pillars.slice(0, 4).filter(p => p.zhi === '卯').length;
        if (maoCount === 1 || maoCount === 2) {
            all.push({
                title: "秘诀：地支一二卯",
                description: `地支见一二卯。断语：命局地支见一或两个卯木，主富贵到老，衣食无忧，晚年富贵。`,
                probability: "中",
                trigger_type: "ORIGINAL",
                category: 'GOOD'
            });
        }
    }

    // Secret 21: 禄多则贫
    if (pillars.length >= 4) {
        const luMap = {
            '甲': '寅', '乙': '卯', '丙': '巳', '丁': '午',
            '戊': '巳', '己': '午', '庚': '申', '辛': '酉',
            '壬': '亥', '癸': '子'
        };
        const dmGan = pillars[2].gan;
        const luZhi = luMap[dmGan];
        if (luZhi) {
            const luCount = pillars.slice(0, 4).filter(p => p.zhi === luZhi).length;
            if (luCount >= 3) {
                all.push({
                    title: "秘诀：禄多则贫",
                    description: `命局禄神过多。断语：禄神(${luZhi})多达三个及以上，主奔波劳心，求财辛苦，反主贫穷。`,
                    probability: "中",
                    trigger_type: "ORIGINAL",
                    category: 'RISK'
                });
            }
        }
    }

    // Secret 22: 驿马星多，身体多病
    if (pillars.length >= 4) {
        const yimaBranches = ['寅', '申', '巳', '亥'];
        const yimaCount = pillars.slice(0, 4).filter(p => yimaBranches.includes(p.zhi)).length;
        if (yimaCount >= 3) {
            all.push({
                title: "秘诀：驿马星多",
                description: `命局驿马星过多。断语：地支见三个及以上驿马星(寅申巳亥)，主身体素质较差，容易生病。`,
                probability: "中",
                trigger_type: "ORIGINAL",
                category: 'RISK'
            });
        }
    }

    // Secret 23: 两头挂
    if (pillars.length >= 4) {
        const getCategory = (god) => {
            if (['正印', '偏印'].includes(god)) return '印星';
            if (god === '伤官') return '伤官';
            if (god === '食神') return '食神';
            if (god === '七杀') return '七杀';
            if (['正财', '偏财'].includes(god)) return '财星';
            if (['比肩', '劫财'].includes(god)) return '比劫';
            if (god === '正官') return '正官';
            return null;
        };

        const yStemCat = getCategory(pillars[0].tenGod);
        const hStemCat = getCategory(pillars[3].tenGod);
        const yBranchCat = getCategory(pillars[0].hidden[0] ? pillars[0].hidden[0].god : '');
        const hBranchCat = getCategory(pillars[3].hidden[0] ? pillars[3].hidden[0].god : '');

        let matchCat = null;
        if (yStemCat && yStemCat === hStemCat) matchCat = yStemCat;
        else if (yBranchCat && yBranchCat === hBranchCat) matchCat = yBranchCat;

        if (matchCat) {
            const descs = {
                '印星': '心地善良，有爱心，易亲近宗教/玄学/艺术。风险提示：容易过于清高或孤僻。',
                '伤官': '六亲缘薄，与家人疏远；口才好但易伤人，爱抬杠；才华横溢但恃才傲物。风险提示：宜远走他乡发展，少言慎行。追加：腿部易受伤留疤，需防范长短腿或断腿风险。',
                '食神': '一生口福好，能吃百家饭（人缘好），技艺精湛；心态乐观，不愁吃喝。风险提示：注意发胖或过于安逸。',
                '七杀': '一生多灾多难，易招官非诉讼，事业起伏大；男命则子嗣缘分较迟或较薄。风险提示：风险极大，宜修身养性，利用七杀能量做武职或管理。追加：腿部易受伤留疤，需防范长短腿或断腿风险。',
                '财星': '出手大方，存不住钱（财露白）；多半会远离家乡发展。风险提示：宜置办固定资产强制储蓄。',
                '比劫': '易因朋友/合伙破财，招小人；性格固执，自尊心强；兄弟姐妹缘薄或竞争激烈。风险提示：避免合伙，财务独立。',
                '正官': '事业稳定，福禄长久，社会地位高；为人正派，循规蹈矩。风险提示：相对最稳的格局，但可能缺乏爆发力。'
            };
            all.push({
                title: `秘诀：${matchCat}两头挂`,
                description: `${matchCat}两头挂。断语：${descs[matchCat]}`,
                probability: "中",
                trigger_type: "ORIGINAL",
                category: 'RISK'
            });
        }
    }

    // Secret 24: 月支断痣
    if (pillars.length >= 4) {
        const mZhi = pillars[1].zhi; // Month Branch
        const moleMap = {
            '子': '胸部正中 / 锁骨下区域',
            '丑': '腹部下方 (肚脐下)',
            '寅': '私密处 / 腹股沟 / 发际线',
            '卯': '胸部两侧 / 乳房附近',
            '辰': '腹部上方 (肚脐上)',
            '巳': '私密器官 / 腹股沟 (易烫伤疤)',
            '午': '胸口正中 (膻中穴)',
            '未': '腹部下方 / 小腹',
            '申': '腹股沟 / 背部边缘',
            '酉': '胸部两侧 / 肋骨',
            '戌': '腹部上方 / 胃部',
            '亥': '私密器官 / 大腿根部'
        };

        if (moleMap[mZhi]) {
            all.push({
                title: "秘诀：月支断痣",
                description: `月支为${mZhi}。推断位置：${moleMap[mZhi]}。`,
                probability: "中",
                trigger_type: "ORIGINAL",
                category: 'INFO'
            });
        }
    }

    // Secret 25: 卧室风水 (床下物件) - Merged Card
    if (pillars.length >= 4) {
        const branchObjMap = {
            '子': '积水或杂乱电子线', '丑': '整齐收纳的旧物',
            '寅': '枯萎绿植或旧书', '卯': '干净折叠的衣物',
            '辰': '破损容器或积水', '巳': '常用电子设备',
            '午': '闲置电器或易燃物', '未': '存放整齐的食品',
            '申': '尖锐金属物品', '酉': '贵重首饰收纳盒',
            '戌': '杂乱无章的杂物', '亥': '常用电子设备'
        };

        const godObjMap = {
            '正官': '重要工作资料', '七杀': '合照、相框、照片、挂画、手办、悬挂小物品；玩偶摆件或带尖角的摆件(供奉)',
            '正财': '贵重物品收纳盒', '偏财': '杂物堆积，杂乱无章',
            '正印': '书籍或相册', '偏印': '跟翅膀和羽毛相关的物品',
            '食神': '零食或健身器材', '伤官': '艺术创作工具',
            '比肩': '他人遗留物品', '劫财': '实用工具'
        };

        const checkPillars = [
            { idx: 2, name: '日支' },
            { idx: 3, name: '时支' }
        ];

        let combinedDesc = [];

        checkPillars.forEach(item => {
            const p = pillars[item.idx];
            const zhi = p.zhi;
            // Get Main Qi (First Hidden Stem)
            const mainQiGod = (p.hidden && p.hidden.length > 0) ? p.hidden[0].god : '';

            let parts = [];
            // 1. Branch Map
            if (branchObjMap[zhi]) {
                parts.push(`【${zhi}】可能对应：${branchObjMap[zhi]}`);
            }
            // 2. Ten God Map (Main Qi)
            if (mainQiGod && godObjMap[mainQiGod]) {
                parts.push(`【${mainQiGod}】可能对应：${godObjMap[mainQiGod]}`);
            }

            if (parts.length > 0) {
                combinedDesc.push(`${item.name}：${zhi}(${mainQiGod || '无藏干'})。${parts.join('；')}。`);
            }
        });

        if (combinedDesc.length > 0) {
            all.push({
                title: `秘诀：卧室风水`,
                description: combinedDesc.join('<br/>'),
                probability: "中",
                trigger_type: "ORIGINAL",
                category: 'INFO'
            });
        }
    }

    const unique = [];
    const seen = new Set();
    all.forEach(r => {
        const k = r.title + r.description;
        if (!seen.has(k)) {
            seen.add(k);
            if (!r.category) r.category = 'RISK'; // Default fallback
            unique.push(r);
        }
    });

    // Sort by Category Priority
    const catOrder = { 'RISK': 1, 'GOOD': 2, 'INFO': 3 };
    unique.sort((a, b) => {
        const oa = catOrder[a.category] || 99;
        const ob = catOrder[b.category] || 99;
        return oa - ob;
    });

    return unique;
}

function getFutureRiskYears(data) {
    // data: Bazi Result Object (pillars[4], daYunList, etc.)
    // We need to iterate ALL DaYuns and their LiuNians
    // Construct 6-pillar sets and run checks.

    const basePillars = data.pillars.slice(0, 4);
    const forecast = [];

    const daYunList = data.daYunList || [];

    daYunList.forEach(dy => {
        // Prepare DY object
        // Needs gan, zhi, tenGod, hidden
        // In python we format on fly. Here data usually has structure.
        // But dy.liuNian is just list.
        // dy is object.

        const dyPillar = {
            gan: dy.gan, zhi: dy.zhi, tenGod: dy.tenGod, hidden: dy.hidden, ganZhi: dy.ganZhi
        };

        const lnList = dy.liuNian || [];
        lnList.forEach(ln => {
            const lnPillar = {
                gan: ln.gan, zhi: ln.zhi, tenGod: ln.tenGod, hidden: ln.hidden, ganZhi: ln.ganZhi, year: ln.year
            };

            const testPillars = [...basePillars, dyPillar, lnPillar];

            // Check SYBL
            const sybl = checkSuiYunBingLin(testPillars);
            sybl.forEach(r => {
                forecast.push({
                    year: ln.year, ganZhi: ln.ganZhi,
                    risk: r.title, desc: r.description,
                    trigger_type: 'LN', dy_name: dy.ganZhi
                });
            });

            // Check FYFY
            const fyfy = checkFanYinFuYin(testPillars);
            fyfy.forEach(r => {
                forecast.push({
                    year: ln.year, ganZhi: ln.ganZhi,
                    risk: r.title, desc: r.description,
                    trigger_type: 'LN', dy_name: dy.ganZhi
                });
            });

            // Check TCO
            const tco = checkThreeClashOne(testPillars);
            tco.forEach(r => {
                forecast.push({
                    year: ln.year, ganZhi: ln.ganZhi,
                    risk: r.title, desc: r.description,
                    trigger_type: 'LN', dy_name: dy.ganZhi
                });
            });

            // Check EGMO (Dynamic only)
            const egmo = checkOwlDevoursEatingGod(testPillars);
            egmo.forEach(r => {
                if (r.trigger_type !== 'ORIGINAL') {
                    let title = r.title.replace("食神逢枭", "枭神夺食");
                    forecast.push({
                        year: ln.year, ganZhi: ln.ganZhi,
                        risk: title, desc: r.description,
                        trigger_type: r.trigger_type, dy_name: dy.ganZhi
                    });
                }
            });

            // Check YRC (Dynamic)
            const yrc = checkYangRenChong(testPillars);
            yrc.forEach(r => {
                if (r.trigger_type !== 'ORIGINAL') {
                    forecast.push({
                        year: ln.year, ganZhi: ln.ganZhi,
                        risk: r.title, desc: r.description,
                        trigger_type: r.trigger_type, dy_name: dy.ganZhi
                    });
                }
            });

            // Secret 4: 年纳音被月克，岁运再克父必亡
            const yNYStr = data.pillars[0].naYin;
            const mNYStr = data.pillars[1].naYin;
            const yNY = getNaYinElement(yNYStr);
            const mNY = getNaYinElement(mNYStr);

            if (yNY && mNY && isElementCountering(mNY, yNY)) {
                // Static part met, check Sui/Yun
                const dyNY = getNaYinElement(dy.naYin);
                const lnNY = getNaYinElement(ln.naYin);

                if (isElementCountering(dyNY, yNY) || isElementCountering(lnNY, yNY)) {
                    forecast.push({
                        year: ln.year, ganZhi: ln.ganZhi,
                        risk: "秘诀：纳音克父",
                        desc: `年纳音被月克，岁运再克父必亡。原因：年柱纳音(${yNYStr})被月柱纳音(${mNYStr})所克，当前大运/流年纳音再次克年柱。`,
                        trigger_type: 'LN', dy_name: dy.ganZhi
                    });
                }
            }

            // Secret 9: 日坐羊刃逢冲，配偶血光早亡 (Dynamic)
            const dmGan = basePillars[2].gan;
            const dayZhi = basePillars[2].zhi;
            const sheepBladeZhi = YANG_REN_MAP[dmGan];

            if (dayZhi === sheepBladeZhi) {
                // Check if DY or LN clashes DAY BRANCH specifically
                let hasChong = false;
                let chongSource = '';
                let chongZhi = '';

                // Check DY
                const dyRel = getBranchRelationship(dayZhi, dyPillar.zhi);
                if (dyRel === '冲') {
                    hasChong = true;
                    chongSource += `大运(${dyPillar.zhi})`;
                    chongZhi = dyPillar.zhi;
                }

                // Check LN
                const lnRel = getBranchRelationship(dayZhi, lnPillar.zhi);
                if (lnRel === '冲') {
                    hasChong = true;
                    if (chongSource) chongSource += '与';
                    chongSource += `流年(${lnPillar.zhi})`;
                    chongZhi = lnPillar.zhi;
                }

                if (hasChong) {
                    forecast.push({
                        year: ln.year, ganZhi: ln.ganZhi,
                        risk: "秘诀：配偶血光",
                        desc: `日坐羊刃逢冲，配偶血光早亡。原因：日支羊刃(${dayZhi})逢${chongSource}相冲。`,
                        trigger_type: 'LN', dy_name: dy.ganZhi
                    });
                }
            }

            // Secret 12: 日坐华盖合驿马 (Dynamic)
            const dayShenSha = data.pillars[2].shenSha || [];
            if (dayShenSha.includes('华盖')) {
                const yiMaSet = new Set(['寅', '申', '巳', '亥']);
                const checkBranches = [
                    { zhi: dyPillar.zhi, type: '大运' },
                    { zhi: lnPillar.zhi, type: '流年' }
                ];

                checkBranches.forEach(item => {
                    if (yiMaSet.has(item.zhi)) {
                        const rel = getBranchRelationship(dayZhi, item.zhi);
                        const key = [dayZhi, item.zhi].sort().join('');
                        const isExtraCombo = ['寅戌', '巳丑', '申辰', '亥未', '寅辰', '亥丑', '巳未', '申戌'].includes(key);
                        if (rel === '六合' || isExtraCombo) {
                            forecast.push({
                                year: ln.year, ganZhi: ln.ganZhi,
                                risk: "秘诀：华盖合驿马 (同床异梦)",
                                desc: `该年/运支(${item.zhi})为驿马并与日支华盖(${dayZhi})相合，代表在该年/大运期间夫妻可能沟通不畅、价值观有分歧。`,
                                trigger_type: 'LN', dy_name: dy.ganZhi
                            });
                        }
                    }
                });
            }
        });
    });

    // Sort
    forecast.sort((a, b) => a.year - b.year);
    return forecast;
}

// Expose to window
window.analyzeRisks = analyzeRisks;
window.getFutureRiskYears = getFutureRiskYears;
