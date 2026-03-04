/**
 * pattern_extractor.js
 * Scans Bazi pillars and luck cycles to produce a flat fact object.
 */

(function () {
    const E = window.BaziEngine || (window.BaziEngine = {});

    const GAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
    const ZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

    /**
     * E.extractFacts
     * Instead of "judging", this function simply gathers (maps) pre-calculated 
     * data from the core engines into a flat facts object for the Pattern Engine.
     */
    E.extractFacts = function (pillars, dy, ln, bs, context = {}) {
        const { wCtx, mCtx, academicCtx, metadata } = context;

        // Pre-calculate flags to avoid TDZ errors
        const isMale = (metadata && metadata.gender === '男') || (wCtx && wCtx.isMale) || (mCtx && mCtx.isMale);
        const isFemale = (metadata && metadata.gender === '女') || (wCtx && wCtx.isFemale) || (mCtx && mCtx.isFemale);

        // Take data directly from the already-calculated contexts (Source of Truth)
        // Initialize facts with defaults first, then spread contexts to avoid overwriting specific flags
        const facts = {
            isMale,
            isFemale,
            selectedLnGod: ln ? ln.tenGod : '',
            selectedLnZhiGod: (ln && ln.hidden && ln.hidden.length > 0) ? ln.hidden[0].god : '',
            selectedLuckEnergy: '',
            isSelectedYearWealth: false,
            isSelectedYearOfficer: false,
            isSelectedYearSeal: false,
            isSelectedYearOutput: false,
            isSelectedYearCompanion: false,
            isSelectedYearSpouse: false,
            isSelectedYearAnalysis: '',
            isAnyYearSelected: false,
            ...(wCtx || {}),
            ...(mCtx || {}),
            ...(academicCtx || {})
        };

        // Populate Selected Luck Energy & Flags
        if (ln) {
            const god = facts.selectedLnGod;
            const zhiGod = facts.selectedLnZhiGod;

            // Reconstruct selection details for narrative interpolation
            facts.selectedLuckDetails = (dy && ln) ? `${ln.year}年(${ln.gan}${ln.zhi})流年，正值${dy.gan}${dy.zhi}大运` : (ln ? `${ln.year}年(${ln.gan}${ln.zhi})流年` : '');

            // Robust category checker within the extractor scope
            const check = (g, target) => {
                if (!g) return false;
                const gs = String(g);
                if (gs.includes(target)) return true;
                if (target === '官杀') return gs.includes('官') || gs.includes('杀');
                if (target === '财星') return gs.includes('财');
                if (target === '食伤') return gs.includes('食') || gs.includes('伤');
                if (target === '印星') return gs.includes('印') || gs.includes('枭');
                if (target === '比劫') return gs.includes('比') || gs.includes('劫');
                return false;
            };

            if (check(god, '财星') || check(zhiGod, '财星')) {
                facts.selectedLuckEnergy = '财富机遇';
                facts.isSelectedYearWealth = true;
            }
            if (check(god, '官杀') || check(zhiGod, '官杀')) {
                facts.selectedLuckEnergy = '事业落实';
                facts.isSelectedYearOfficer = true;
            }
            if (check(god, '印星') || check(zhiGod, '印星')) {
                facts.selectedLuckEnergy = '计划与稳健';
                facts.isSelectedYearSeal = true;
            }
            if (check(god, '食伤') || check(zhiGod, '食伤')) {
                facts.selectedLuckEnergy = '创意与社交';
                facts.isSelectedYearOutput = true;
            }
            if (check(god, '比劫') || check(zhiGod, '比劫')) {
                facts.selectedLuckEnergy = '社交与竞争';
                facts.isSelectedYearCompanion = true;
            }

            // Marriage Specific: Check if the year involves the spouse star
            const spouseStarCat = isMale ? '财星' : '官杀';
            if (check(god, spouseStarCat) || check(zhiGod, spouseStarCat)) {
                facts.isSelectedYearSpouse = true;
            }

            // Palace Activation: Check if the selection (LN) combines with the marriage palace (Day Branch)
            const dayZhi = (pillars && pillars[2]) ? pillars[2].zhi : '';
            const lnZhi = ln.zhi || '';
            const rel = (window.getBranchRelation && dayZhi && lnZhi) ? window.getBranchRelation(lnZhi, dayZhi) : '';
            facts.isSelectionPalaceCombined = (rel || '').includes('合');

            // Build a fallback summary
            const tags = [];
            if (facts.isSelectedYearWealth) tags.push('财富');
            if (facts.isSelectedYearOfficer) tags.push('官运');
            if (facts.isSelectedYearSeal) tags.push('印星');
            if (facts.isSelectedYearOutput) tags.push('才华');
            if (facts.isSelectedYearCompanion) tags.push('同辈');
            facts.isSelectedYearAnalysis = tags.length > 0 ? tags.join('与') : '气场波动';

            facts.isAnyYearSelected = true;
        }

        // Standardize key boolean flags if missing (safety fallback)
        facts.isSelfStrong = !!facts.isSelfStrong;
        facts.isSelfWeak = facts.hasOwnProperty('isSelfWeak') ? !!facts.isSelfWeak : !facts.isSelfStrong;
        facts.isSelfWeak = !!facts.isSelfWeak;

        // Enhanced Facts for new categories - ensure consistency across synonyms
        facts.hasOfficer = !!facts.hasOfficer || !!facts.hasOfficial || !!facts.hasOfficialStem || !!facts.hasOfficerBranch;
        facts.hasOfficial = facts.hasOfficer;
        facts.hasOfficialStem = !!facts.hasOfficialStem || (pillars && pillars.some((p, idx) => idx !== 2 && p.tenGod && (p.tenGod.includes('官') || p.tenGod.includes('杀'))));

        facts.hasSeal = !!facts.hasSeal || !!facts.hasSealStem || !!facts.hasSealBranch || !!facts.hasNatalSealStem;
        facts.hasSealStar = facts.hasSeal;
        facts.hasSealStem = !!facts.hasSealStem || (pillars && pillars.some((p, idx) => idx !== 2 && p.tenGod && (p.tenGod.includes('印') || p.tenGod.includes('枭'))));
        facts.hasSealBranch = !!facts.hasSealBranch || (pillars && pillars.some((p, idx) => p.hidden && p.hidden.some(h => h.god && (h.god.includes('印') || h.god.includes('枭')))));

        facts.hasFood = !!facts.hasFood || !!facts.hasOutput || !!facts.hasOutputStem || !!facts.hasOutputBranch;
        facts.hasOutput = facts.hasFood;
        facts.hasFoodStar = facts.hasFood;
        facts.hasOutputStem = !!facts.hasOutputStem || (pillars && pillars.some((p, idx) => idx !== 2 && p.tenGod && (p.tenGod.includes('食') || p.tenGod.includes('伤'))));

        facts.hasWealth = !!facts.hasWealth || !!facts.hasWealthStem || !!facts.hasWealthBranch;
        facts.hasWealthStar = facts.hasWealth;
        facts.hasWealthStem = !!facts.hasWealthStem || (pillars && pillars.some((p, idx) => idx !== 2 && p.tenGod && (p.tenGod.includes('财') || p.tenGod.includes('才'))));
        facts.hasWealthBranch = !!facts.hasWealthBranch || (pillars && pillars.some((p, idx) => p.hidden && p.hidden.some(h => h.god && (h.god.includes('财') || h.god.includes('才')))));

        facts.hasBiJie = !!facts.hasBiJie;
        facts.hasCompanion = facts.hasBiJie;

        // Relationship specific facts
        if (mCtx) {
            facts.isDayBranchCombined = !!mCtx.hasLiuHe || !!mCtx.hasAnHe || !!mCtx.hasSanHe;
            facts.isDayBranchClashed = !!mCtx.isPalaceClashed;
            facts.hasPeachSha = !!mCtx.hasPeachSha;
        }

        // --- NEW: Sex Life & Children Specific Fact Extraction ---
        const dm = pillars[2].gan;
        const db = pillars[2].zhi;
        const dmWX = { '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土', '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水' }[dm];

        // 1. isDayBranchMuYu (Bathing state)
        if (window.CHANG_SHENG && dmWX) {
            facts.isDayBranchMuYu = window.CHANG_SHENG[dmWX][db] === '沐浴' || window.CHANG_SHENG[dmWX][db] === '沐浴';
        } else if (dmWX) {
            // Fallback if CHANG_SHENG is not global (it's defined in bazi_logic.js)
            const changSheng = {
                '木': { '子': '沐浴' }, '火': { '卯': '沐浴' }, '土': { '卯': '沐浴' }, '金': { '午': '沐浴' }, '水': { '酉': '沐浴' }
            };
            facts.isDayBranchMuYu = changSheng[dmWX] && changSheng[dmWX][db] === '沐浴';
        }

        // 2. isXiaoShenDuoShi (Xiao Shen robbing Food)
        const natalGods = pillars.flatMap(p => [p.tenGod, ...(p.hidden || []).map(h => h.god)]);
        const allGods = natalGods.join(',');
        facts.isXiaoShenDuoShi = allGods.includes('枭') && allGods.includes('食');

        // 3. isDayBranchVoid (Marriage Palace Empty)
        facts.isDayBranchVoid = !!facts.isDayBranchVoid || !!(mCtx && mCtx.isDayBranchVoid);

        // Add positional/adjacency flags if they aren't in the contexts yet
        if (!facts.hasOwnProperty('isWealthSealBranchNotAdjacent')) {
            const hasW = (idx) => pillars[idx].hidden && pillars[idx].hidden.length > 0 && String(pillars[idx].hidden[0].god).includes('财');
            const hasS = (idx) => pillars[idx].hidden && pillars[idx].hidden.length > 0 && String(pillars[idx].hidden[0].god).includes('印');
            const wBranches = [0, 1, 2, 3].map(hasW);
            const sBranches = [0, 1, 2, 3].map(hasS);

            const isAdj = (arr1, arr2) => {
                for (let i = 0; i < 3; i++) {
                    if ((arr1[i] && arr2[i + 1]) || (arr1[i + 1] && arr2[i])) return true;
                }
                return false;
            };
            facts.isWealthSealBranchNotAdjacent = !isAdj(wBranches, sBranches);
        }

        // --- NEW: Expert Logic Flags ---
        // 1. isKillingControlled (Seven Killings controlled by Output)
        if (!facts.hasOwnProperty('isKillingControlled')) {
            const hasKilling = allGods.includes('杀');
            const hasOutput = facts.hasOutput;
            // Simplified check: if Seven Killing is present and Output is present, assume potential control
            facts.isKillingControlled = hasKilling && hasOutput;
        }

        // 2. isBranchClashed (Any major branch clash in natal chart)
        if (!facts.hasOwnProperty('isBranchClashed')) {
            const zhis = pillars.map(p => p.zhi);
            const ZHI_CHONG = { "子": "午", "午": "子", "丑": "未", "未": "丑", "寅": "申", "申": "寅", "卯": "酉", "酉": "卯", "辰": "戌", "戌": "辰", "巳": "亥", "亥": "巳" };
            let clashed = false;
            for (let i = 0; i < 3; i++) {
                if (ZHI_CHONG[zhis[i]] === zhis[i + 1]) { clashed = true; break; }
            }
            facts.isBranchClashed = clashed;
        }

        // --- NEW: Detailed Luck Cycle Fact Processing ---
        if (context.luckAcademic && context.luckAcademic.length > 0) {
            facts.hasAcademicLuck = true;
            facts.academicLuckDetails = context.luckAcademic.map(l => `${l.age}岁(${l.gan}${l.zhi}): ${l.god}运`).join('、');
        }

        if (context.luckMarriage && context.luckMarriage.length > 0) {
            facts.hasMarriageLuck = true;
            facts.marriageLuckDetails = context.luckMarriage.map(l => `${l.age}岁(${l.gan}${l.zhi}): ${l.god}运`).join('、');
        }

        if (context.luckCareer && context.luckCareer.length > 0) {
            facts.hasCareerLuckHistory = true;
            // Filter: Success-related gods for "High Performance" periods
            const successGods = ['财', '官', '杀', '食', '伤'];
            const successPeriods = context.luckCareer.filter(l => successGods.some(g => l.god.includes(g) || l.zhiGod.includes(g)));
            if (successPeriods.length > 0) {
                facts.careerLuckDetails = successPeriods.map(l => `${l.age}岁(${l.gan}${l.zhi})${l.god}运`).join('、');
                facts.hasSuccessCareerLuck = true;
            }
        }

        if (context.luckLegal && context.luckLegal.length > 0) {
            const dangerGods = ['杀', '枭', '劫', '伤'];
            facts.hasRecentLegalRisk = context.luckLegal.some(l => dangerGods.some(g => l.god.includes(g)));
            facts.legalLuckDetails = context.luckLegal.map(l => `${l.age}岁(${l.gan}${l.zhi})`).join('、');
        }

        if (context.luckChildren && context.luckChildren.length > 0) {
            facts.hasLuckChildrenStar = true;
            facts.childrenLuckDetails = context.luckChildren.map(l => `${l.age}岁左右(${l.gan}${l.zhi})`).join('、');
        }

        return facts;
    };
})();
