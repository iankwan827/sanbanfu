(function () {
    const containerId = 'treeDisplay';
    let allTreeData = window.treeData || {};
    let activeTopic = "财";

    // Assign stable unique IDs based on title and hierarchy to avoid random IDs causing loops
    function assignIds(node, prefix = 'n', parentTitles = []) {
        node.id = prefix + '_' + node.title;
        node._parentTitles = parentTitles;
        if (node.children) {
            node.children.forEach((child, i) => assignIds(child, node.id + '_' + i, [...parentTitles, node.title]));
        }
    }

    function init() {
        allTreeData = window.treeData || {};
        Object.keys(allTreeData).forEach(topic => {
            allTreeData[topic].forEach((root, i) => assignIds(root, topic + '_' + i, [topic]));
        });

        const topicBar = document.getElementById('treeTabBar');
        if (!topicBar) return;
        topicBar.innerHTML = '';

        // Create Select instead of Buttons
        const select = document.createElement('select');
        select.id = 'topicSelector';
        select.style.cssText = `
            background: #2a2a2a;
            color: #ccc;
            border: 1px solid #444;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 15px;
            width: 100%;
            margin-bottom: 10px;
            outline: none;
            appearance: none;
            -webkit-appearance: none;
            cursor: pointer;
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 10px center;
            background-size: 16px;
        `;

        const topics = ["财", "婚姻", "婚期", "子女", "官非", "事业", "学业", "偏科", "态度", "性生活", "性格"];
        topics.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t;
            opt.innerText = t;
            if (t === activeTopic) opt.selected = true;
            select.appendChild(opt);
        });

        select.onchange = (e) => selectTopic(e.target.value);
        topicBar.appendChild(select);

        resetTopic();
    }

    function selectTopic(t) {
        activeTopic = t;
        const select = document.getElementById('topicSelector');
        if (select) select.value = t;

        resetTopic();
        // Trigger automation after a short delay to allow UI to settle
        setTimeout(() => {
            autoSelectNodes(t);
        }, 150);
    }

    function findNodeById(root, id) {
        if (!root) return null;
        if (root.id === id) return root;
        if (root.children) {
            for (const child of root.children) {
                const n = findNodeById(child, id);
                if (n) return n;
            }
        }
        return null;
    }

    function renderLevel(level, nodes) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let displayNodes = nodes;
        if (activeTopic === "官非" && level === 1) {
            displayNodes = nodes.filter(n => n.title !== "官非化解");
        }

        // Check if this level already exists and has the SAME content to avoid flashing
        const existingLevel = document.getElementById(`tree-level-${level}`);
        if (existingLevel) {
            const existingIds = Array.from(existingLevel.querySelectorAll('.tree-node-card')).map(c => c.dataset.id).sort().join(',');
            const newIds = displayNodes.map(n => n.id).sort().join(',');
            if (existingIds === newIds) return; // Same content, don't re-render
        }

        // Clear all levels >= current level
        const containers = container.querySelectorAll('.tree-level-container');
        containers.forEach((el, idx) => {
            if (idx >= level) el.remove();
        });

        if (level === 0) {
            const advice = container.querySelector('.tree-advice-box');
            if (advice) advice.remove();
        }

        if (displayNodes.length === 0) {
            // No nodes to display
            return;
        }
        const levelDiv = document.createElement('div');
        levelDiv.className = 'tree-level-container';
        levelDiv.id = `tree-level-${level}`;

        const rowDiv = document.createElement('div');
        rowDiv.className = 'tree-nodes-row';

        displayNodes.forEach((node) => {
            const card = document.createElement('div');
            card.className = 'tree-node-card';
            card.dataset.id = node.id;
            if (node._parentTitles) card.dataset.parents = node._parentTitles.join(',');

            const isLeaf = !node.children || node.children.length === 0;
            const hasContent = node.content || node.result;
            // NEVER show content in card if it is a leaf node. 
            // ALSO hide content if it has a 'result' (conclusion), as results should only show in the advice box.
            const showContentInCard = node.content && !isLeaf && !node.result;

            card.innerHTML = `
                <div class="tree-node-title">${node.title}</div>
                ${showContentInCard ? `<div class="tree-node-desc">${parseRichText(node.content)}</div>` : ''}
            `;
            card.onclick = () => onNodeToggle(level, node, card);
            rowDiv.appendChild(card);
        });

        levelDiv.appendChild(rowDiv);
        container.appendChild(levelDiv);

        setTimeout(() => {
            levelDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }

    function onNodeToggle(level, node, cardEl) {
        const title = cardEl.querySelector('.tree-node-title')?.innerText?.trim();
        const isActive = cardEl.classList.contains('active');

        // Toggle the clicked card
        cardEl.classList.toggle('active');

        // Synchronize other nodes with the SAME title (e.g. duplicate "Day Branch Void")
        if (title) {
            const container = document.getElementById(containerId);
            const allCards = container.querySelectorAll('.tree-node-card');

            // Extract the relative level from the ID (part count)
            const clickedIdParts = cardEl.dataset.id.split('_');
            const clickedLevelNum = clickedIdParts.length;

            allCards.forEach(c => {
                if (c === cardEl) return; // Skip self
                const t = c.querySelector('.tree-node-title')?.innerText?.trim();
                const cardIdParts = c.dataset.id.split('_');
                const cardLevelNum = cardIdParts.length;

                // Sync logic:
                // 1. Title must match.
                // 2. Levels must be comparable.
                // 3. For Ten God paths in luck, we restrict sync if they belong to different higher branches (Stem/Branch)
                if (t === title && Math.abs(cardLevelNum - clickedLevelNum) <= 1) {
                    // Prevent Stem/Branch cross-sync for Ten Gods
                    const isLuckPath = cardEl.dataset.id.includes('大运') || cardEl.dataset.id.includes('流年');
                    const parentsMatch = cardEl.dataset.id.split('_').slice(0, -1).join('_') === c.dataset.id.split('_').slice(0, -1).join('_');

                    if (isLuckPath && !parentsMatch) return;

                    if (isActive) c.classList.remove('active');
                    else c.classList.add('active');
                }
            });
        }

        refreshFromLevel(level);
    }

    function refreshFromLevel(currentLevel) {
        processLevelsFrom(0);
    }

    function processLevelsFrom(startLevel) {
        const container = document.getElementById(containerId);

        if (startLevel === 0) {
            window._remedyButtonShown = false;
            const adviceBox = container.querySelector('.tree-advice-box');
            if (adviceBox) {
                adviceBox.style.display = 'none';
                const content = adviceBox.querySelector('.tree-advice-content');
                if (content) content.innerHTML = '';
            }
        }

        let level = startLevel;

        while (true) {
            const levelDiv = document.getElementById(`tree-level-${level}`);
            if (!levelDiv) break;

            const activeCards = levelDiv.querySelectorAll('.tree-node-card.active');

            if (activeCards.length === 0) {
                const existingLevels = container.querySelectorAll('.tree-level-container');
                existingLevels.forEach((el, idx) => {
                    if (idx > level) el.remove();
                });
                break;
            }

            const mergedChildren = [];
            let shouldAddRemedyHeader = false;
            let lastDiagnosticNodeId = "";

            activeCards.forEach(card => {
                const nodeId = card.dataset.id;
                let nodeObj = null;

                if (nodeId.startsWith('remedy-header-')) {
                    const roots = (allTreeData && allTreeData["官非"]) || [];
                    const remedyRoot = roots.find(r => r.title === "官非" || r.title === "官非化解");
                    let foundRemedy = null;
                    if (remedyRoot) {
                        if (remedyRoot.title === "官非化解") foundRemedy = remedyRoot;
                        else if (remedyRoot.children) foundRemedy = remedyRoot.children.find(c => c.title === "官非化解");
                    }
                    if (foundRemedy) {
                        nodeObj = { id: nodeId, title: "🔎 点击展开化解方案", content: "根据以上结论为您匹配的化解方案：", result: "", children: foundRemedy.children };
                    }
                } else {
                    for (const root of (allTreeData[activeTopic] || [])) {
                        nodeObj = findNodeById(root, nodeId);
                        if (nodeObj) break;
                    }
                }

                if (nodeObj) {
                    const parentsAttr = card.dataset.parents || "";
                    const storedPath = parentsAttr ? parentsAttr.split(',').map(p => p.trim()) : [];
                    nodeObj = { ...nodeObj, _parentTitles: storedPath };

                    let nodeChildren = nodeObj.children || [];
                    const remedyKeywords = ['化解', '法', '遵纪', '防范', '帮助', '维权', '环境', '物品', '方位'];
                    if (activeTopic === "官非" && nodeChildren.length === 0 && nodeObj.result && !remedyKeywords.some(k => nodeObj.title.includes(k))) {
                        if (!window._remedyButtonShown) {
                            shouldAddRemedyHeader = true;
                            lastDiagnosticNodeId = nodeObj.id;
                        }
                    }

                    if (nodeChildren.length > 0) {
                        const parentTitle = card.querySelector('.tree-node-title')?.innerText?.trim();
                        const currentPath = nodeObj._parentTitles || [];
                        const newPath = parentTitle ? [...currentPath, parentTitle] : currentPath;

                        nodeChildren.forEach(c => {
                            const existing = mergedChildren.find(m => m.id === c.id);
                            if (!existing) {
                                const cloned = { ...c, _parentTitles: [...newPath] };
                                mergedChildren.push(cloned);
                            } else {
                                newPath.forEach(p => { if (!existing._parentTitles.includes(p)) existing._parentTitles.push(p); });
                            }
                        });
                    }

                    const isLeaf = !nodeChildren || nodeChildren.length === 0;
                    const isLegalDiagnosticNode = nodeId.startsWith('remedy-header-');
                    if (level > 0 && (isLeaf || isLegalDiagnosticNode || nodeObj.result) && (nodeObj.result || nodeObj.content)) {
                        let combinedText = "";
                        const content = (nodeObj.content || "").trim(), result = (nodeObj.result || "").trim();
                        if (content && result && content !== result) {
                            combinedText = content.includes(result) ? content : content + "\n→ **结果**：" + result;
                        } else combinedText = result || content;
                        showAdvice(combinedText);
                    }
                }
            });

            if (shouldAddRemedyHeader && !window._remedyButtonShown) {
                const roots = (allTreeData && allTreeData["官非"]) || [];
                const remedyRoot = roots.find(r => r.title === "官非" || r.title === "官非化解");
                let foundRemedy = null;
                if (remedyRoot) {
                    if (remedyRoot.title === "官非化解") foundRemedy = remedyRoot;
                    else if (remedyRoot.children) foundRemedy = remedyRoot.children.find(c => c.title === "官非化解");
                }
                if (foundRemedy) {
                    const remedyHeader = { id: 'remedy-header-' + lastDiagnosticNodeId, title: "🔎 点击展开化解方案", content: "根据以上结论为您匹配的化解方案：", result: "", children: foundRemedy.children };
                    if (!mergedChildren.some(m => m.title === remedyHeader.title)) {
                        mergedChildren.push(remedyHeader);
                        window._remedyButtonShown = true;
                    }
                }
            }

            if (mergedChildren.length > 0) {
                renderLevel(level + 1, mergedChildren);
                level++;
            } else {
                const existingLevels = container.querySelectorAll('.tree-level-container');
                existingLevels.forEach((el, idx) => { if (idx > level) el.remove(); });
                break;
            }
        }
        // Reposition advice box to the end
        const adviceBox = container.querySelector('.tree-advice-box');
        if (adviceBox) container.appendChild(adviceBox);
    }

    function getChartContext(data = window.currentData) {
        if (!data) return null;
        const ctx = {};

        // 1. Core Helpers
        ctx.getStem = (obj) => {
            if (!obj) return "";
            if (typeof obj === 'string') return obj.charAt(0);
            return obj.gan || obj.stem || "";
        };
        ctx.getZhi = (obj) => {
            if (!obj) return "";
            if (typeof obj === 'string') return obj.charAt(1) || "";
            return obj.zhi || obj.branch || "";
        };
        ctx.isMale = () => data.gender === 1 || data.gender === '男';
        ctx.genderText = (data.gender === '女' || data.gender === '0' || data.gender === 0) ? "女命" : "男命";

        const getGods = (godNames) => {
            const res = [];
            if (!data.pillars) return res;
            const mainPillars = data.pillars.slice(0, 4);
            mainPillars.forEach((p, idx) => {
                const stemGod = (p.tenGod || '').trim();
                if (godNames.includes(stemGod)) res.push({ god: stemGod, place: 'stem', pillarIdx: idx });

                // [FIX] Check ALL hidden qi (main, mid, residual) for presence
                if (p.hidden) {
                    p.hidden.forEach((h, hIdx) => {
                        if (godNames.includes(h.god)) {
                            res.push({ god: h.god, place: 'branch', pillarIdx: idx, hIdx: hIdx });
                        }
                    });
                }
            });
            return res;
        };

        const godsMap = {
            wealth: ['正财', '偏财', '财', '才'],
            officer: ['正官', '七杀', '官', '杀', '偏官'],
            seal: ['正印', '偏印', '印', '枭'],
            food: ['食神', '伤官', '食', '伤'],
            rob: ['比肩', '劫财', '比', '劫']
        };

        const checkPresence = (category) => {
            const list = getGods(godsMap[category]);
            return {
                any: list.length > 0,
                stem: list.some(g => g.place === 'stem'),
                branch: list.some(g => g.place === 'branch'),
                list: list
            };
        };

        ctx.wealth = checkPresence('wealth');
        ctx.officer = checkPresence('officer');
        ctx.seal = checkPresence('seal');
        ctx.food = checkPresence('food');
        ctx.rob = checkPresence('rob');

        // 2. Body Strength
        ctx.isBodyStrong = () => {
            let bs = data.bodyStrength;
            if (!bs && window.calculateBodyStrength && data.pillars) {
                bs = window.calculateBodyStrength(data.pillars.slice(0, 4));
            }
            if (!bs || !bs.level) return false;
            return bs.level.includes('身强') || bs.level.includes('身旺');
        };
        ctx.isSelfStrong = ctx.isBodyStrong();
        ctx.isSealTaboo = !ctx.isSelfStrong;

        ctx.isFavorable = (cat) => {
            const strong = ctx.isSelfStrong;
            if (cat === 'wealth' || cat === '财') return strong;
            if (cat === 'officer' || cat === '官') return strong;
            if (cat === 'seal' || cat === '印') return !strong;
            if (cat === 'food' || cat === '食') return strong;
            if (cat === 'rob' || cat === '比') return !strong;
            return false;
        };

        // 3. Flags for Engine
        const checkFlag = (cat) => {
            if (window.AnalysisEngine && window.AnalysisEngine.checkGod) {
                const natalRevealed = data.pillars ? data.pillars.slice(0, 4).map(p => p.tenGod || '') : [];
                // [FIX] Scan ALL hidden gods for flag detection
                const natalAllHidden = [];
                if (data.pillars) {
                    data.pillars.slice(0, 4).forEach(p => {
                        if (p.hidden) p.hidden.forEach(h => natalAllHidden.push(h.god));
                    });
                }
                return natalAllHidden.some(g => window.AnalysisEngine.checkGod(g, cat)) ||
                    natalRevealed.some(g => window.AnalysisEngine.checkGod(g, cat));
            }
            switch (cat) {
                case '财星': return ctx.wealth.any;
                case '官杀': return ctx.officer.any;
                case '印星': return ctx.seal.any;
                case '食伤': return ctx.food.any;
                case '比劫': return ctx.rob.any;
                default: return false;
            }
        };

        ctx.hasWealth = checkFlag('财星');
        ctx.hasOfficial = checkFlag('官杀');
        ctx.hasSeal = checkFlag('印星');
        ctx.hasFood = checkFlag('食伤');
        ctx.hasBiJie = checkFlag('比劫');

        ctx.hasWealthStem = ctx.wealth.stem;
        ctx.hasOfficialStem = ctx.officer.stem;
        ctx.hasSealStem = ctx.seal.stem;
        ctx.hasOutputStem = ctx.food.stem;

        ctx.hasWealthBranch = ctx.wealth.branch;
        ctx.hasOfficerBranch = ctx.officer.branch;
        ctx.hasSealBranch = ctx.seal.branch;
        ctx.hasOutputBranch = ctx.food.branch;

        // 4. Pillars & SuiYun (Enhanced for Master Synthesis)
        const dayPillar = (data.pillars && data.pillars[2]) ? data.pillars[2] : null;
        ctx.dayGan = ctx.getStem(dayPillar) || data.dayMaster || "";
        ctx.dayZhi = ctx.getZhi(dayPillar) || "";
        ctx.dayBranchTenGod = (dayPillar && dayPillar.hidden && dayPillar.hidden[0]) ? dayPillar.hidden[0].god : ctx.safeGetTenGod(ctx.dayGan, ctx.dayZhi);

        ctx.dayun = data.currentDaYun || data.dayun || window.currentDaYun ||
            (data.daYunList && data.currentDaYunIdx !== undefined && data.daYunList[data.currentDaYunIdx]) || null;
        ctx.liunian = data.selectedLiuNian || data.liunian || window.selectedLiuNian || null;

        ctx.safeGetTenGod = (dm, s) => (window.getTenGod ? window.getTenGod(dm, s) : "");
        ctx.dyGGod = ctx.dayun ? (ctx.dayun.tenGod || ctx.safeGetTenGod(ctx.dayGan, ctx.getStem(ctx.dayun))) : "";
        ctx.dyZGod = ctx.dayun ? (ctx.dayun.zhiTenGod || (ctx.dayun.hidden && ctx.dayun.hidden[0] ? ctx.dayun.hidden[0].god : ctx.safeGetTenGod(ctx.dayGan, ctx.getZhi(ctx.dayun)))) : "";
        ctx.lnGGod = ctx.liunian ? (ctx.liunian.tenGod || ctx.safeGetTenGod(ctx.dayGan, ctx.getStem(ctx.liunian))) : "";
        ctx.lnZGod = ctx.liunian ? (ctx.liunian.zhiTenGod || (ctx.liunian.hidden && ctx.liunian.hidden[0] ? ctx.liunian.hidden[0].god : ctx.safeGetTenGod(ctx.dayGan, ctx.getZhi(ctx.liunian)))) : "";

        ctx.isDayunUniform = () => {
            if (!ctx.dayun) return false;
            const WU_XING = { "甲": "木", "乙": "木", "丙": "火", "丁": "火", "戊": "土", "己": "土", "庚": "金", "辛": "金", "壬": "水", "癸": "水", "寅": "木", "卯": "木", "巳": "火", "午": "火", "申": "金", "酉": "金", "亥": "水", "子": "水", "辰": "土", "戌": "土", "丑": "土", "未": "土" };
            const g = ctx.getStem(ctx.dayun);
            const z = ctx.getZhi(ctx.dayun);
            if (!g || !z) return false;
            return WU_XING[g] === WU_XING[z];
        };

        // 5. Context Integration
        if (data.wealthContext) Object.assign(ctx, data.wealthContext);
        if (data.academicContext) Object.assign(ctx, data.academicContext);
        if (data.marriageContext) Object.assign(ctx, data.marriageContext);
        if (data.flags) Object.assign(ctx, data.flags);

        // [Sync Fix] Capture God Strength Details for Personality Highlighting
        // Strictly use the pre-calculated expert results to ensure consistency with the UI
        ctx.strengthDetails = data.godStrengthDetails || (data.expertData && data.expertData.godStrengthDetails) || [];

        // 5. Marriage context flags (Sync with bazi_logic.js)
        const allStems = data.pillars.slice(0, 4).map(p => p.gan);
        const dm = ctx.dayGan;
        const ganHe = { '甲': '己', '己': '甲', '乙': '庚', '庚': '乙', '丙': '辛', '辛': '丙', '丁': '壬', '壬': '丁', '戊': '癸', '癸': '戊' };

        ctx.isSpouseStemCombinedWithOther = false;
        ctx.isSpouseStemCombinedWithDM = false;

        const isMale = (typeof ctx.isMale === 'function') ? ctx.isMale() : ctx.isMale;
        const spouseStars_list = isMale ? ctx.wealth.list : ctx.officer.list;

        // Spouse star combination refined (Stem & Branch)
        const allBranches = data.pillars.slice(0, 4).map(p => p.zhi);
        const zhiHe = { '子': '丑', '丑': '子', '寅': '亥', '亥': '寅', '卯': '戌', '戌': '卯', '辰': '酉', '酉': '辰', '巳': '申', '申': '巳', '午': '未', '未': '午' };
        const sanHeGrps = [['申', '子', '辰'], ['亥', '卯', '未'], ['寅', '午', '戌'], ['巳', '酉', '丑']];

        spouseStars_list.forEach(w => {
            if (w.place === 'stem') {
                const starStem = allStems[w.pillarIdx];
                const targetHe = ganHe[starStem];
                const combinedIndices = allStems.reduce((acc, stem, idx) => {
                    if (stem === targetHe && idx !== w.pillarIdx) acc.push(idx);
                    return acc;
                }, []);
                if (combinedIndices.includes(2)) ctx.isSpouseStemCombinedWithDM = true;
                if (combinedIndices.some(idx => idx !== 2)) ctx.isSpouseStemCombinedWithOther = true;
            } else if (w.place === 'branch') {
                const starZhi = allBranches[w.pillarIdx];
                // Liu He
                const targetZhiHe = zhiHe[starZhi];
                const heIndices = allBranches.reduce((acc, z, idx) => {
                    if (idx !== w.pillarIdx && z === targetZhiHe) acc.push(idx);
                    return acc;
                }, []);
                if (heIndices.includes(2)) ctx.isSpouseStemCombinedWithDM = true;
                if (heIndices.some(idx => idx !== 2)) ctx.isSpouseStemCombinedWithOther = true;

                // San He / Ban He
                sanHeGrps.forEach(grp => {
                    if (grp.includes(starZhi)) {
                        allBranches.forEach((z, idx) => {
                            if (idx !== w.pillarIdx && grp.includes(z)) {
                                if (idx === 2) ctx.isSpouseStemCombinedWithDM = true;
                                else ctx.isSpouseStemCombinedWithOther = true;
                            }
                        });
                    }
                });
            }
        });
        ctx.isAnyWealthRobbed = false;
        if (isMale) {
            ctx.isAnyWealthRobbed = ctx.wealth.list.filter(g => g.place === 'stem').some(w => {
                const wIdx = w.pillarIdx;
                const starGan = allStems[wIdx];
                // Protection check
                const isCombinedWithDM = (allStems[2] === ganHe[starGan]);
                const isCombinedWithOther = allStems.some((gan, idx) => idx !== wIdx && idx !== 2 && gan === ganHe[starGan]);
                if (isCombinedWithDM && !isCombinedWithOther) return false;

                // Proximity check: Adjacent stems
                const hasAdjacentRobber = data.pillars.slice(0, 4).some((p, idx) =>
                    idx !== wIdx &&
                    ['比肩', '劫财'].includes(p.tenGod) &&
                    Math.abs(idx - wIdx) === 1
                );
                // Proximity check: Same pillar branch
                const hiddenG = (data.pillars[wIdx] && data.pillars[wIdx].hidden) ? data.pillars[wIdx].hidden : [];
                const hasSamePillarRobber = hiddenG.some(h => ['比肩', '劫财'].includes(h.god));

                return hasAdjacentRobber || hasSamePillarRobber;
            });
        }

        ctx.isMale = (typeof ctx.isMale === 'function') ? ctx.isMale() : ctx.isMale;

        // [CRITICAL FIX] Map the REAL strength details and luck data to context
        // Case "性格" expects the nested structure from getPillarStrengthDetails
        if (window.AnalysisEngine && window.AnalysisEngine.getPillarStrengthDetails) {
            ctx.strengthDetails = window.AnalysisEngine.getPillarStrengthDetails(data);
        } else {
            ctx.strengthDetails = [];
        }

        ctx.dayun = data.dayun || data.currentDaYun || null;
        ctx.liunian = data.liunian || data.selectedLiuNian || null;

        // Map luck Ten Gods for logic checks
        if (ctx.dayun) {
            ctx.dyGGod = ctx.dayun.tenGodGan || "";
            ctx.dyZGod = ctx.dayun.tenGodZhi || "";
        }

        return ctx;
    }

    function getAllLogicTargets(ctx) {
        if (!ctx) return [];
        const allResults = [];
        let hasMainResult = false;

        if (window.DecisionEngine && window.DecisionEngine.execute) {
            ['academic', 'wealth', 'marriage_timing', 'marriage_rel', 'marriage_trait', 'marriage_app', 'career', 'sexlife', 'children', 'legal'].forEach(t => {
                const res = window.DecisionEngine.execute(t, ctx);
                if (window.logDebug && t === 'academic') window.logDebug(`[Tree Sync] DecisionEngine.execute('${t}') results:`, res);
                if (res && res.results && res.results.length > 0) {
                    allResults.push(...res.results);
                    if (t === 'academic') hasMainResult = true;
                }
            });
        }
        if (window.DecisionEngine && window.DecisionEngine.lookupAcademicResult) {
            const lookup = window.DecisionEngine.lookupAcademicResult(ctx);
            if (window.logDebug) window.logDebug(`[Tree Sync] lookupAcademicResult result:`, lookup);
            if (lookup) {
                allResults.push({ id: 'res_LogicSync_Academic', category: 'academic', title: '学业结论', text: lookup.text, desc: lookup.text, tags: lookup.tags, stepId_main: 'Academic' });
                hasMainResult = true;
            }
        }

        // BRIDGE LOGIC: REMOVED by request to match 1994 logic style
        if (false) {
            const suiGods = ((ctx.dyGGod || "") + (ctx.dyZGod || "") + (ctx.lnGGod || "") + (ctx.lnZGod || ""));
            const isSealUseful = (ctx.usefulGod || []).some(g => g.includes('印'));
            const isSealTaboo = (ctx.tabooGod || []).some(g => g.includes('印'));

            // 1. Seal SuiYun
            if (suiGods.match(/印|枭/)) {
                // Determine nuances based on Useful/Taboo logic (if available in ctx)
                // If we don't know (ctx missing usefulGod), defaulting to standard "Study Luck" but neutral.
                // However, since we saw "Seal is Taboo" in user screenshot, ctx MUST have it.

                let sealTitle = '学业大运：印星护航';
                let sealText = "【学业大运：印星护航】当前大运正值印星旺地，印星代表定力、钻研与长辈提携。在此运程中，你的心境会变得稳重，能够沉下心来攻克学术难关。对于备考或长线深造的朋友来说，这是极为有利的基础建设期。";
                let sealTags = ['印星大运', '考运稳健'];

                if (isSealTaboo || (hasMainResult && allResults.some(r => r.text.includes('忌神') || r.text.includes('压力')))) {
                    // If Seal is Taboo OR Main Result is negative about Seal, switch to Warning
                    sealTitle = '学业大运：印星压力';
                    sealText = "【学业大运：印旺为忌】当前大运印星过旺，虽主文书，但更多体现为学业压力与思想包袱。你可能感到思维受阻，或被繁重的课业压得喘不过气。建议适当减压，避免死记硬背，寻找灵活的学习切入点。";
                    sealTags = ['印星为忌', '压力重重'];
                }

                if ((ctx.dyGGod || "").match(/印|枭/) || (ctx.dyZGod || "").match(/印|枭/)) {
                    // Only add if NOT already covered by main tree to avoid redundancy?
                    // Or add as "SuiYun Supplement".
                    // For now, let's allow it but ensuring text is correct.
                    allResults.push({
                        id: isSealTaboo ? 'res_Academic_Luck_Seal_Bad' : 'res_Academic_Luck_Seal',
                        category: 'academic',
                        title: sealTitle,
                        text: sealText,
                        tags: sealTags,
                        isLuck: true,
                        stepId_main: 'Academic'
                    });
                }

                if ((ctx.lnGGod || "").match(/印|枭/) || (ctx.lnZGod || "").match(/印|枭/)) {
                    let yearTitle = '流年感应：文昌照临';
                    let yearText = "【流年感应：文昌照临】今年流年逢印星感应，思维清晰度与考试发挥有望处于高位。对于需要通过证书、职称或重大升学考试的你来说，今年是典型的“灵感爆发年”。";

                    if (isSealTaboo) {
                        yearTitle = '流年感应：文书压力';
                        yearText = "【流年感应：文书压力】流年逢印星为忌，需注意文书细节错误或考试焦虑。可能会面临较大的竞争压力或规则束缚，建议放平心态，稳扎稳打。";
                    }

                    allResults.push({
                        id: isSealTaboo ? 'res_Academic_Year_Seal_Bad' : 'res_Academic_Year_Seal',
                        category: 'academic',
                        title: yearTitle,
                        text: yearText,
                        tags: isSealTaboo ? ['流年压力', '文书小心'] : ['流年遇印', '考运亨通'],
                        isLuck: true,
                        stepId_main: 'Academic'
                    });
                }
            }

            // 2. Output Star SuiYun (Inspiration/Expression)
            if (suiGods.match(/食|伤/)) {
                allResults.push({
                    id: 'res_Academic_Sui_Output',
                    category: 'academic',
                    title: '才华流露：溢才智博',
                    text: "【才华流露：溢才智博】岁运感应到食神/伤官之气。这代表你在学业上不再是死读书，而是充满了创造力与表达欲。非常适合参加辩论、艺术创作或需要高频次展示自我的学术环节。此时你的大脑异常敏捷，对新知识的吸收极快。",
                    tags: ['食伤泄秀', '灵感爆棚'],
                    stepId_main: 'Academic'
                });
            }

            // 3. Officer SuiYun (Official Entrance/Title)
            if (suiGods.match(/官|杀/)) {
                allResults.push({
                    id: 'res_Academic_Sui_Officer',
                    category: 'academic',
                    title: '功名在望：官星入局',
                    text: "【功名在望：官星入局】岁运逢官杀，代表名气与层级的提升。在学业范畴内，这预示着你能获得正式的录取通知书、学位授予或官方荣誉。虽然压力相较往年有所增大，但这正是你实现学术阶层跃迁的关键窗口。建议保持克制与自律，必能金榜题名。",
                    tags: ['官印相生', '名气提升'],
                    stepId_main: 'Academic'
                });
            }
        }
        return allResults;
    }

    function autoSelectNodes(topic = activeTopic) {
        if (!window.currentData) return;
        const data = window.currentData;
        const container = document.getElementById(containerId);
        if (!container) return;

        const log = (msg, data) => {
            console.log(`[TreeAutoSelect] ${msg}`, data || '');
        };

        const ctx = getChartContext(data);
        const targets = [];
        const bodyText = ctx.isBodyStrong() ? "身强" : "身弱";
        const ZHI_HE = { "子": "丑", "丑": "子", "寅": "亥", "亥": "寅", "卯": "戌", "戌": "卯", "辰": "酉", "酉": "辰", "巳": "申", "申": "巳", "午": "未", "未": "午" };
        const ZHI_CHONG = { "子": "午", "午": "子", "丑": "未", "未": "丑", "寅": "申", "申": "寅", "卯": "酉", "酉": "卯", "辰": "戌", "戌": "辰", "巳": "亥", "亥": "巳" };
        const MUYU_MAP = { "甲": "子", "乙": "巳", "丙": "卯", "丁": "申", "戊": "卯", "己": "申", "庚": "午", "辛": "亥", "壬": "酉", "癸": "寅" };

        switch (topic) {
            case "财":
                targets.push("财运", "原局", bodyText, "大运", "流年");
                if (ctx.wealth.any) {
                    if (ctx.isBodyStrong()) {
                        if (ctx.isAnyWealthRobbed) {
                            targets.push("财弱", "比劫夺财");
                        } else {
                            targets.push("财强");
                            if (ctx.food.any) targets.push("有食伤生财"); else targets.push("无食伤");
                        }
                    } else {
                        targets.push("身弱");
                        // [FIX] Use exact flag from Logic Engine
                        if (ctx.isAnyWealthRobbed) {
                            targets.push("比劫夺财");
                        } else if (ctx.seal.any) {
                            targets.push("印为用", "财不破印", "印星为用");
                        } else {
                            targets.push("无印", "财旺");
                        }
                    }
                } else {
                    targets.push("没财", "无财星");
                }

                if (ctx.dayun || ctx.liunian) {
                    if (ctx.dayun) {
                        const isSame = ctx.isDayunUniform();
                        targets.push(isSame ? "天干地支相同" : "天干地支不同");

                        const dyGGod = ctx.dyGGod.substring(0, 2);
                        const dyZGod = ctx.dyZGod.substring(0, 2);
                        const dyZ = ctx.getZhi(ctx.dayun);

                        if (isSame) {
                            const god = dyGGod;
                            if (god.includes("财") || god.includes("才")) targets.push("大运:财星运", "财星运");
                            if (god.includes("食") || god.includes("伤")) targets.push("大运:食伤运", "食伤运");
                            if (god.includes("官") || god.includes("杀")) targets.push("大运:官杀运", "官杀运");
                            if (god.includes("印") || god.includes("枭")) targets.push("大运:印星运", "印星运");
                            if (god.includes("比") || god.includes("劫")) targets.push("大运:比劫运", "比劫运");
                        } else {
                            targets.push("天干", "地支", "天干地支不同");
                            if (dyGGod.includes("财") || dyGGod.includes("才")) { targets.push("大运:天干:财", "大运:天干:正财", "大运:天干:偏财", "大运:天干:财星"); }
                            if (dyGGod.includes("食") || dyGGod.includes("伤")) { targets.push("大运:天干:食伤", "大运:天干:食神", "大运:天干:伤官"); }
                            if (dyGGod.includes("官") || dyGGod.includes("杀")) { targets.push("大运:天干:官杀", "大运:天干:正官", "大运:天干:七杀"); }
                            if (dyGGod.includes("印") || dyGGod.includes("枭")) { targets.push("大运:天干:印星", "大运:天干:正印", "大运:天干:偏印"); }
                            if (dyGGod.includes("比") || dyGGod.includes("劫")) { targets.push("大运:天干:比劫", "大运:天干:比肩", "大运:天干:劫财", "大运:天干:比劫"); }

                            if (dyZGod.includes("财") || dyZGod.includes("才")) { targets.push("大运:地支:财", "大运:地支:正财", "大运:地支:偏财", "大运:地支:财星"); }
                            if (dyZGod.includes("食") || dyZGod.includes("伤")) { targets.push("大运:地支:食伤", "大运:地支:食神", "大运:地支:伤官"); }
                            if (dyZGod.includes("官") || dyZGod.includes("杀")) { targets.push("大运:地支:官杀", "大运:地支:正官", "大运:地支:七杀"); }
                            if (dyZGod.includes("印") || dyZGod.includes("枭")) { targets.push("大运:地支:印星", "大运:地支:正印", "大运:地支:偏印"); }
                            if (dyZGod.includes("比") || dyZGod.includes("劫")) { targets.push("大运:地支:比劫", "大运:地支:比肩", "大运:地支:劫财", "大运:地支:比劫"); }

                            if (["辰", "戌", "丑", "未"].includes(dyZ)) targets.push("大运:地支:财库", "财库");
                        }
                    }

                    if (ctx.liunian) {
                        const lnZ = ctx.getZhi(ctx.liunian);
                        const lnGGod = ctx.lnGGod.substring(0, 2);
                        const lnZGod = ctx.lnZGod.substring(0, 2);

                        const lnHasWealth = (lnGGod.includes('财') || lnGGod.includes('才') || lnZGod.includes('财') || lnZGod.includes('才'));
                        if (lnHasWealth) targets.push("流年:流年财星旺", "流年财星旺");

                        targets.push("天干", "地支");

                        // Apply multi-level scoped matching for LiuNian children
                        [lnGGod, lnZGod].forEach((god, idx) => {
                            const pillar = idx === 0 ? "天干" : "地支";
                            const prefix = "流年:" + pillar + ":";
                            if (god.includes("财") || god.includes("才")) { targets.push(prefix + "财", prefix + "正财", prefix + "偏财", prefix + "财星"); }
                            if (god.includes("食") || god.includes("伤")) { targets.push(prefix + "食伤", prefix + "食神", prefix + "伤官", prefix + "食伤"); }
                            if (god.includes("官") || god.includes("杀")) { targets.push(prefix + "官杀", prefix + "正官", prefix + "七杀", prefix + "官杀"); }
                            if (god.includes("印") || god.includes("枭")) { targets.push(prefix + "印星", prefix + "正印", prefix + "偏印", prefix + "印星"); }
                            if (god.includes("比") || god.includes("劫")) { targets.push(prefix + "比劫", prefix + "比肩", prefix + "劫财", prefix + "比劫"); }
                        });

                        if ((lnGGod.includes('财') || lnGGod.includes('官')) && (lnZGod.includes('财') || lnZGod.includes('官'))) targets.push("流年:流年财官双透", "流年财官双透");
                        if ((lnGGod.includes('食') || lnGGod.includes('伤')) && (lnZGod.includes('财') || lnZGod.includes('才'))) targets.push("流年:流年食伤生财", "流年食伤生财");
                        if (["辰", "戌", "丑", "未"].includes(lnZ)) targets.push("流年:财库", "流年:流年冲财库", "流年冲财库");
                    }
                }
                break;
            case "婚姻":
                targets.push("婚姻", "原局", ctx.genderText, "配偶宫（日支）", "星宫关系", "星宫同旺", "星宫相克", "日坐十神", "日支状态", "大运", "流年");
                const isMale = ctx.isMale;
                const stars = isMale ? ctx.wealth : ctx.officer;
                if (stars.any) {
                    const isFavorable = ctx.isFavorable(isMale ? 'wealth' : 'officer');
                    targets.push(isMale ? "有财星" : "有官杀星", isMale ? "财星状态" : "官杀状态");

                    const starList = isMale ? ["正财", "偏财"] : ["正官", "七杀"];
                    starList.forEach(sName => {
                        const starCategory = stars.list.filter(s => s.god === sName);
                        if (starCategory.length > 0) {
                            targets.push(sName);
                            const isStrong = starCategory.length >= 2 || (starCategory.some(s => s.place === 'stem') && starCategory.some(s => s.place === 'branch'));
                            targets.push(sName + (isStrong ? "旺" : "弱"));
                            targets.push(sName + (isFavorable ? "为用" : "为忌"));
                        }
                    });

                    // Mixed check
                    if (isMale && stars.list.some(s => s.god === '正财') && stars.list.some(s => s.god === '偏财')) {
                        targets.push("正偏财混杂");
                    }
                    if (!isMale && stars.list.some(s => s.god === '正官') && stars.list.some(s => s.god === '七杀')) {
                        targets.push("官杀混杂");
                    }

                    if (isMale && ctx.isAnyWealthRobbed) targets.push("财星被比劫夺", "比劫特质", "比劫克财（男）");
                    if (isMale && (ctx.isSpouseStemCombinedWithOther || ctx.isSpouseStemCombinedWithDM)) targets.push("财星被合");
                    if (!isMale && ctx.food.any) targets.push("官星被食伤克", "食伤特质", "食伤克官（女）");
                    if (!isMale && (ctx.isSpouseStemCombinedWithOther || ctx.isSpouseStemCombinedWithDM)) targets.push("官杀被合");
                } else targets.push(isMale ? "无财星" : "无官杀星", "看婚姻宫");

                // [FIX] Use the directly read Ten God from context
                const palaceGod = ctx.dayBranchTenGod;
                // const palaceGod = window.getTenGod ? window.getTenGod(ctx.dayGan, ctx.dayZhi) : "";
                if (palaceGod) targets.push("日坐" + palaceGod.substring(0, 2));

                const isDPV = ctx.isFavorable('palace');
                targets.push(isDPV ? "日支为喜用" : "日支为忌");
                if (isDPV) {
                    targets.push("日坐禄星", "日支生身", "日支合日干", "喜用在宫", "星宫同旺", "星宫相生");
                } else {
                    // [FIX] Conditional checks instead of blind push
                    const pGod = ctx.dayBranchTenGod || "";
                    if (pGod.includes("比") || pGod.includes("劫")) targets.push("日坐比劫");

                    const yangRenMap = { '甲': '卯', '庚': '酉', '丙': '午', '戊': '午', '壬': '子' };
                    if (yangRenMap[ctx.dayGan] === ctx.dayZhi) targets.push("日坐羊刃");

                    // Check for Day Branch Clashing Day Master (Zhi Ke Gan)
                    // Simple Element Check
                    const GAN_WX = { '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土', '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水' };
                    const ZHI_WX = { '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火', '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水' };
                    const WX_KE = { '木': '土', '土': '水', '水': '火', '火': '金', '金': '木' };

                    const dmWx = GAN_WX[ctx.dayGan];
                    const dzWx = ZHI_WX[ctx.dayZhi];
                    if (dmWx && dzWx && WX_KE[dzWx] === dmWx) {
                        targets.push("日支克日主", "星宫相克");
                    } else if (!isDPV) {
                        // If not helping (because isDPV is false) and not clashing, maybe just general unfavorable
                        targets.push("星宫相克"); // Fallback if implies mismatch
                    }
                }

                if (ctx.dayun) {
                    const dyGod = ctx.dyGGod;
                    const dyZGod = ctx.dyZGod;
                    if (dyGod.includes('财') || dyGod.includes('官') || dyGod.includes('杀')) targets.push("大运:大运遇财官", "大运遇财官");
                }
                if (ctx.liunian) {
                    const lZ = ctx.getZhi(ctx.liunian);
                    const lnG = ctx.lnGGod;
                    const lnZ = ctx.lnZGod;
                    if (ZHI_HE[lZ] === ctx.dayZhi || ZHI_CHONG[lZ] === ctx.dayZhi || lZ === ctx.dayZhi) {
                        targets.push("流年:流年合婚宫", "流年合婚宫");
                    }
                    if (lnG.match(/财|官|杀/) || lnZ.match(/财|官|杀/)) {
                        targets.push("流年:流年遇财官", "流年:流年遇财官");
                    }
                }
                break;
            case "子女":
                targets.push("子女", "原局", ctx.genderText, "子女宫（时柱）", "综合判断", "胎次研判（老大与老二）", "老大（时干分析）", "老二（时支分析）", "时坐十神", "时柱状态");
                const childS = ctx.isMale ? ctx.officer : ctx.food;
                if (childS.any) {
                    targets.push(ctx.isMale ? "有官杀星" : "有食伤星");
                    const isF = ctx.isFavorable(ctx.isMale ? 'officer' : 'food');
                    targets.push(isF ? "子女优秀型" : "子女困难型");
                    targets.push(ctx.isMale ? "官杀为用" : (isF ? "食伤为用" : "食伤为忌"));
                    targets.push(ctx.isMale ? "官杀旺相" : (childS.list.some(s => s.god === '食神') ? "食神旺相" : "伤官旺相"));
                    if (isF) {
                        const star = ctx.isMale ? ctx.officer : ctx.food;
                        if (star.stem) targets.push(ctx.isMale ? "官杀透干" : "食伤透干");
                        if (star.branch) targets.push(ctx.isMale ? "官杀藏支" : "食伤藏支");

                        if (ctx.isMale) { if (ctx.seal.any) targets.push("官印相生（男）", "有印化官"); }
                        else { if (ctx.wealth.any) targets.push("食神生财（女）"); }
                        if (ctx.food.any && ctx.seal.any) {
                            // [FIX] Strict Owl Check
                            const hasRealOwl = ctx.seal.list.some(s => s.god === '偏印' || s.god === '枭神');
                            if (hasRealOwl) targets.push("枭神旺而夺食", "枭神夺食");

                            const hasZhengYin = ctx.seal.list.some(s => s.god === '正印');
                            if (hasZhengYin && !ctx.isFavorable('seal')) targets.push("印旺克食");
                        }
                    } else {
                        // [FIX] Gender separation for Taboo case
                        if (ctx.isMale) {
                            if (!ctx.food.any) targets.push("无食伤制杀");
                            if (!ctx.seal.any) targets.push("无印化官");
                            if (childS.list.length > 1) targets.push("官杀无制");
                        } else {
                            // Female: Food Taboo
                            if (ctx.seal.any) targets.push("伤官配印");
                            else targets.push("无印制约");
                        }
                    }
                } else targets.push("无官杀星", "无食伤星", "看时柱");

                // [FIX] Children Palace (Time Pillar) Analysis
                // Ensure data.pillars exists and has the Hour Pillar (index 3)
                if (data.pillars && data.pillars[3]) {
                    const hPillar = data.pillars[3];
                    const hStemGod = hPillar.stemGod || ""; // e.g. "正印"
                    const hBranchGod = hPillar.branchGod || ""; // e.g. "食神"
                    // const hBranch = hPillar.branch; // e.g. "午"

                    // Helper to determine favorability based on ctx.isFavorable(godCode)
                    // We need to map the Chinese God name back to code: 'officer', 'wealth', 'seal', 'food', 'rob'
                    const getGodCode = (gName) => {
                        if (!gName) return null;
                        if (['正官', '七杀', '偏官'].includes(gName)) return 'officer';
                        if (['正财', '偏财'].includes(gName)) return 'wealth';
                        if (['正印', '偏印', '枭神'].includes(gName)) return 'seal';
                        if (['食神', '伤官'].includes(gName)) return 'food';
                        if (['比肩', '劫财'].includes(gName)) return 'rob';
                        return null;
                    };

                    const stemCode = getGodCode(hStemGod);
                    const branchCode = getGodCode(hBranchGod);

                    const isStemFav = stemCode ? ctx.isFavorable(stemCode) : false;
                    const isBranchFav = branchCode ? ctx.isFavorable(branchCode) : false;

                    // 1. Time Stem Analysis (The Eldest)
                    if (isStemFav) targets.push("时干为喜用");
                    else targets.push("时干为忌神");

                    // 2. Time Branch Analysis (The Second)
                    if (isBranchFav) targets.push("时支为喜用");
                    else targets.push("时支为忌神");

                    // 3. Time Pillar General Status (Combined for "时柱为喜用" node)
                    // Heuristic: If Branch is favorable (Root) or both are favorable
                    if (isBranchFav) targets.push("时柱为喜用"); // Branch is the "Home"
                    else if (!isBranchFav && !isStemFav) targets.push("时柱为忌");

                    // 4. Branch State (ChangSheng, DiWang, etc.)
                    // This requires calculating the Phase of Day Master to Hour Branch? 
                    // Or Stem to Branch? Usually Day Master to Hour Branch for Children *Health*?
                    // But for "Children Tree", it often refers to the Children Star's phase.
                    // Let's check if there's existing data for this. 
                    // ctx.strengthDetails might have it, or we skip specific phase tags if data is missing.
                    // "时支长生", "时支帝旺" are specific tags in static data.
                    // For now, focusing on the User's specific request about Stem/Branch favorable/unfavorable.
                }

                break;
            case "性生活":
                targets.push("夫妻性生活", "原局", "日支（夫妻宫）", "十神组合", "神煞", "身强弱", "健康注意事项", bodyText);
                if (MUYU_MAP[ctx.dayGan] === ctx.dayZhi) {
                    targets.push("日支坐沐浴");
                    targets.push(ctx.isFavorable('palace') ? "沐浴为用" : "沐浴为忌");
                }
                if (["子", "午", "卯", "酉"].includes(ctx.dayZhi)) {
                    targets.push("日支坐四正位");
                    targets.push(ctx.isFavorable('palace') ? "四正为用" : "四正为忌");
                }
                const pillars = data.pillars || [];
                const dyZhi = ctx.dayZhi;
                let isHe = false; let isChong = false;
                for (let i = 0; i < 4; i++) {
                    if (i === 2) continue;
                    const b = pillars[i] ? pillars[i].branch : "";
                    if (ZHI_HE[dyZhi] === b) isHe = true;
                    if (ZHI_CHONG[dyZhi] === b) isChong = true;
                }
                if (isHe) targets.push("日支逢合", "日支被合");
                if (isChong) targets.push("日支逢冲");
                if (ctx.food.any) {
                    targets.push("食神伤官旺");
                    if (ctx.isFavorable('food')) targets.push("食伤为用透干", "食伤有力生财");
                    else targets.push("食伤为忌");
                }
                if (ctx.officer.any || ctx.wealth.any) {
                    targets.push("财官平衡");
                    if (ctx.isBodyStrong()) {
                        targets.push("身强财官平衡");
                    } else {
                        targets.push("身弱财官旺");
                        if (ctx.wealth.list.length > ctx.officer.list.length) targets.push("财多身弱");
                    }
                }
                if (ctx.seal.any && ctx.food.any) {
                    const hasRealOwl = ctx.seal.list.some(s => s.god === '偏印' || s.god === '枭神');
                    if (hasRealOwl) {
                        targets.push("枭神夺食");
                        if (!ctx.isFavorable('seal')) targets.push("枭神旺而夺食");
                        if (ctx.wealth.any) targets.push("有财制枭");
                    } else {
                        // Correct Seal (Zheng Yin)
                        if (!ctx.isFavorable('seal')) targets.push("印旺克食");
                    }
                    if (ctx.rob.any) targets.push("有比劫护食");
                }
                if (ctx.rob.any && !ctx.officer.any) {
                    targets.push("比劫旺而无制");
                    targets.push(ctx.isBodyStrong() ? "比劫为忌" : "比劫助身法");
                }
                const ssha = (data.shenSha || []).map(s => s.name);
                if (ssha.includes('桃花') || ssha.includes('咸池')) {
                    targets.push("命带桃花", "咸池桃花");
                    if (!ctx.isFavorable('wealth') && !ctx.isFavorable('officer')) targets.push("桃花为忌");
                }
                if (ssha.includes('红鸾') || ssha.includes('天喜')) targets.push("命带红鸾天喜", "红鸾天喜");
                if (ssha.some(s => s.includes('孤鸾'))) targets.push("命带孤鸾煞", "孤鸾煞");
                if (ssha.some(s => s.includes('九丑'))) targets.push("命带九丑煞");

                if (ctx.isBodyStrong()) {
                    if (ctx.food.any) targets.push("身强有食伤");
                    if (ctx.officer.any) targets.push("身强官杀旺");
                } else {
                    targets.push("身弱");
                    if (ctx.seal.any) targets.push("身弱有印");
                    else targets.push("身弱无印");
                    if (ctx.officer.any) targets.push("身弱官杀旺");
                }
                break;
            case "官非":
                targets.push("官非", "原局", bodyText, "官非类型", "神煞凶兆");
                const isOffFav = ctx.isFavorable('officer');

                // [FIX] Explicitly push Officer Favorable/Unfavorable tags to trigger child nodes
                if (ctx.officer.any) {
                    targets.push(isOffFav ? "官杀为用" : "官杀为忌");

                    // [FIX] Add sub-level logic for Officer details
                    const hasGuan = ctx.officer.list.some(g => g.god === '正官' || g.god === '官');
                    const hasSha = ctx.officer.list.some(g => g.god === '七杀' || g.god === '杀' || g.god === '偏官');
                    const isMixed = hasGuan && hasSha;

                    if (isMixed) targets.push("官杀混杂");
                    else targets.push("官杀纯正");

                    if (ctx.seal.any) targets.push("有印化官");
                    if (ctx.food.any) targets.push("有食伤制杀");
                } else {
                    targets.push("无官杀星");
                }

                const hasHarmfulShenSha = (data.shenSha || []).some(s => ['元辰', '大耗', '天罗', '地网', '灾煞', '劫煞'].includes(s.name));

                // BOTTOM-UP CONDITION DETECTION (Strictly Categorized)
                const triggers = [];

                const isHeavy1 = ctx.officer.any && !isOffFav && !ctx.seal.any && !ctx.food.any;
                const isHeavy2 = ctx.officer.list.some(g => (g.god || '').match(/杀|偏官/) && g.place === 'stem') && !ctx.seal.any;
                const isHeavy3 = ctx.food.any && ctx.officer.any && !ctx.seal.any;

                const isMed1 = ctx.officer.any && !isOffFav && (ctx.seal.any || ctx.food.any);
                const isMed2 = ctx.food.any && ctx.officer.any;
                const isMed3 = ctx.wealth.any && ctx.officer.any;

                const isLight1 = !hasHarmfulShenSha;

                if (isHeavy1 || isHeavy2 || isHeavy3) {
                    if (isHeavy1) triggers.push({ severity: "重度官非", reason: "官杀为忌旺而无制" });
                    if (isHeavy2) triggers.push({ severity: "重度官非", reason: "七杀透干无印化" });
                    if (isHeavy3) triggers.push({ severity: "重度官非", reason: "伤官见官" });
                } else if (isMed1 || isMed2 || isMed3) {
                    if (isMed1) triggers.push({ severity: "中度官非", reason: "官杀为忌旺而有制" });
                    if (isMed2) triggers.push({ severity: "中度官非", reason: "伤官见官" });
                    if (isMed3) triggers.push({ severity: "中度官非", reason: "财官相战" });
                } else if (isLight1) {
                    triggers.push({ severity: "轻微官非", reason: "无重大神煞" });
                }

                // Mutual Exclusion Selection (Strict Waterfall)
                let chosenSev = "";
                const hasHeavy = triggers.some(t => t.severity === "重度官非");
                const hasMed = triggers.some(t => t.severity === "中度官非");
                const hasLight = triggers.some(t => t.severity === "轻微官非");

                if (hasHeavy) {
                    chosenSev = "重度官非";
                } else if (hasMed) {
                    chosenSev = "中度官非";
                } else if (hasLight) {
                    chosenSev = "轻微官非";
                }

                if (chosenSev) {
                    // Only push targets for the SELECTED severity level
                    const matchedTriggers = triggers.filter(t => t.severity === chosenSev);
                    if (matchedTriggers.length > 0) {
                        const primaryTrigger = matchedTriggers[0];
                        targets.push("官非类型"); // Ensure parent opens
                        targets.push(primaryTrigger.reason); // Target the specific reason node (e.g. "官杀旺无制")
                        targets.push(chosenSev); // Target the severity node (e.g. "重度官非")

                        // [FIX] Add aliases matching the User's Screenshot (Shortened titles)
                        if (primaryTrigger.reason === "官杀为忌旺而无制") targets.push("官杀旺无制");
                        if (primaryTrigger.reason === "七杀透干无印化") targets.push("七杀透干");
                        if (primaryTrigger.reason === "财官相战") targets.push("财生官杀");

                        // Keep strict scoped target just in case, but rely on above for broad matching
                        targets.push("官非类型:" + primaryTrigger.reason);
                    }
                }

                if (ctx.dayun) {
                    const isSame = ctx.isDayunUniform();
                    targets.push("大运", isSame ? "天干地支相同" : "天干地支不同");
                    const dyGGod = ctx.dyGGod.substring(0, 2);
                    const dyZGod = ctx.dyZGod.substring(0, 2);
                    const dyZ = ctx.getZhi(ctx.dayun);

                    if (isSame) {
                        const prefix = "大运:天干地支相同:";
                        if (dyGGod.match(/官|杀/)) targets.push(prefix + "官杀运");
                        if (dyGGod.match(/食|伤/)) targets.push(prefix + "伤官运");
                        if (dyGGod.match(/财|才/)) targets.push(prefix + "财星运");
                        if (dyGGod.match(/印|枭/)) targets.push(prefix + "印星运");
                        if (dyGGod.match(/比|劫/)) targets.push(prefix + "比劫运");
                    } else {
                        targets.push("大运:天干地支不同:天干", "大运:天干地支不同:地支");
                        const getTenGodTargets = (godStr) => {
                            if (godStr.match(/官|杀|七/)) return ["官杀", "正官", "七杀"];
                            if (godStr.includes("伤")) return ["伤官", "食伤"];
                            if (godStr.includes("食")) return ["食神", "食伤"];
                            if (godStr.match(/财|才/)) return ["财星", "正财", "偏财"];
                            if (godStr.match(/印|枭/)) return ["印星", "正印", "偏印"];
                            if (godStr.match(/比|劫/)) return ["比劫", "比肩", "劫财"];
                            return [];
                        };

                        getTenGodTargets(dyGGod).forEach(t => targets.push("大运:天干地支不同:天干:" + t));
                        getTenGodTargets(dyZGod).forEach(t => targets.push("大运:天干地支不同:地支:" + t));
                    }
                    if (ZHI_CHONG[dyZ] === ctx.dayZhi) targets.push("大运:大运六冲", "大运六冲");
                }

                if (ctx.liunian) {
                    targets.push("流年", "天干", "地支");
                    const lnZ = ctx.getZhi(ctx.liunian);
                    const lnGGod = ctx.lnGGod.substring(0, 2);
                    const lnZGod = ctx.lnZGod.substring(0, 2);

                    const getLnTargets = (godStr) => {
                        const results = [];
                        if (godStr.match(/官|杀|七/)) results.push("流年官杀旺", "正官", "七杀");
                        if (godStr.includes("伤")) results.push("伤官", "食伤");
                        if (godStr.includes("食")) results.push("食神", "食伤");
                        if (godStr.match(/财|才/)) results.push("财星", "正财", "偏财");
                        if (godStr.match(/印|枭/)) results.push("印星", "正印", "偏印");
                        if (godStr.match(/比|劫/)) results.push("比劫", "比肩", "劫财");
                        return results;
                    };

                    getLnTargets(lnGGod).forEach(t => targets.push("流年:天干:" + t));
                    getLnTargets(lnZGod).forEach(t => targets.push("流年:地支:" + t));

                    if (ZHI_CHONG[lnZ] === ctx.dayZhi) targets.push("流年:流年六冲");
                    const offBs = ctx.officer.list.filter(g => g.place === 'branch').map(g => data.pillars[g.pillarIdx] ? data.pillars[g.pillarIdx].branch : "");
                    if (offBs.some(b => b && ZHI_CHONG[lnZ] === b)) targets.push("流年:流年冲官杀");
                    if (lnGGod.includes('伤') && ctx.officer.any) targets.push("流年:流年伤官见官");
                }

                const sShaNames = (data.shenSha || []).map(s => s.name);
                if (sShaNames.some(s => ['元辰', '大耗', '天罗', '地网', '灾煞', '劫煞'].includes(s))) targets.push("神煞凶兆", "有官非神煞");
                break;
            case "事业":
                targets.push("事业", "原局", bodyText, "大运", "流年");

                // [DEBUG] Spy on Strength Data
                try {
                    const debugEl = document.getElementById('debug-console');
                    if (debugEl && window.currentData && window.currentData.godStrength) {
                        debugEl.innerHTML += `<div>--- Career Strength Debug ---</div>`;
                        debugEl.innerHTML += `<div>Keys: ${Object.keys(window.currentData.godStrength).join(',')}</div>`;
                        ['正财', '偏财'].forEach(k => {
                            if (window.currentData.godStrength[k])
                                debugEl.innerHTML += `<div>${k}: ${JSON.stringify(window.currentData.godStrength[k])}</div>`;
                        });
                    }
                } catch (e) { }

                // [FIX] Use REAL Ten God Strength data from data.godStrength
                const getGodStrength = (gods) => {
                    // gods: array of strings ['正财', '偏财']
                    if (!data.godStrength) return false;
                    return gods.some(g => {
                        const info = data.godStrength[g];
                        return info && (info.level === '旺' || info.isStrong === true);
                    });
                };

                const isWealthStrong = getGodStrength(['正财', '偏财']);
                const isBodyStrong = ctx.isBodyStrong();

                // Wealth & Food Logic
                if (ctx.wealth.any) {
                    if (ctx.food.any) targets.push("有食伤生财");
                    else targets.push("无食伤生财");

                    if (ctx.officer.any) targets.push("财官相生");
                } else {
                    targets.push("无财星");
                }

                // Body/Wealth Combinations
                if (isBodyStrong) {
                    targets.push(isWealthStrong ? "身旺财旺" : "身旺财弱");
                } else {
                    targets.push(isWealthStrong ? "身弱财旺" : "身弱财弱");
                }

                // Officer Logic
                if (ctx.officer.any) {
                    const isV = ctx.isFavorable('officer');

                    // [DEBUG] Officer Logic Variables
                    try {
                        const dEl = document.getElementById('debug-console');
                        if (dEl) {
                            dEl.innerHTML += `<div>--- Career Officer Debug ---</div>`;
                            dEl.innerHTML += `<div>OfficerAny: ${ctx.officer.any}, IsFav: ${isV}</div>`;
                            dEl.innerHTML += `<div>WealthAny: ${ctx.wealth.any}, SealAny: ${ctx.seal.any}, FoodAny: ${ctx.food.any}</div>`;
                        }
                    } catch (e) { }

                    targets.push(isV ? "官杀为用" : "官杀为忌");

                    if (isV) {
                        if (ctx.seal.any) targets.push("有印化官", "官印相生");
                        // [FIX] Restore missing "有财生官"
                        if (ctx.wealth.any) targets.push("有财生官", "财官相生");
                        if (ctx.food.any) targets.push("有食伤制杀", "食伤制杀");
                    } else {
                        // Unfavorable
                        if (ctx.seal.any) targets.push("有印化官", "官印相生");
                        if (ctx.food.any) targets.push("有食伤制杀", "食伤制杀");
                        if (ctx.wealth.any) targets.push("财星破印", "财生官杀"); // Wealth generating unhelpful officer
                        targets.push("比劫抗官");
                    }
                } else {
                    targets.push("无官杀星");
                }



                if (ctx.dayun) {
                    const isSame = ctx.isDayunUniform();
                    targets.push(isSame ? "天干地支相同" : "天干地支不同");

                    const dyGGod = ctx.dyGGod.substring(0, 2);
                    const dyZGod = ctx.dyZGod.substring(0, 2);
                    const dyZ = ctx.getZhi(ctx.dayun);

                    if (isSame) {
                        const prefix = "大运:";
                        if (dyGGod.match(/官|杀/)) { targets.push(prefix + "官杀", prefix + "正官", prefix + "七杀"); }
                        if (dyGGod.match(/印|枭/)) { targets.push(prefix + "印星", prefix + "正印", prefix + "偏印"); }
                        if (dyGGod.match(/财|才/)) { targets.push(prefix + "财星", prefix + "正财", prefix + "偏财"); }
                        if (dyGGod.match(/食|伤/)) { targets.push(prefix + "食伤", prefix + "食神", prefix + "伤官"); }
                        if (dyGGod.match(/比|劫/)) { targets.push(prefix + "比劫", prefix + "比肩", prefix + "劫财"); }
                    } else {
                        targets.push("天干", "地支", "天干地支不同");

                        // Heavenly Stem path
                        if (dyGGod) {
                            const prefix = "大运:天干:";
                            if (dyGGod.match(/官|杀/)) { targets.push(prefix + "官杀", prefix + "正官", prefix + "七杀"); }
                            if (dyGGod.match(/印|枭/)) { targets.push(prefix + "印星", prefix + "正印", prefix + "偏印"); }
                            if (dyGGod.match(/财|才/)) { targets.push(prefix + "财星", prefix + "正财", prefix + "偏财"); }
                            if (dyGGod.match(/食|伤/)) { targets.push(prefix + "食伤", prefix + "食神", prefix + "伤官"); }
                            if (dyGGod.match(/比|劫/)) { targets.push(prefix + "比劫", prefix + "比肩", prefix + "劫财"); }
                        }

                        // Earthly Branch path
                        if (dyZGod) {
                            const prefix = "大运:地支:";
                            if (dyZGod.match(/官|杀/)) { targets.push(prefix + "官杀", prefix + "正官", prefix + "七杀"); }
                            if (dyZGod.match(/印|枭/)) { targets.push(prefix + "印星", prefix + "正印", prefix + "偏印"); }
                            if (dyZGod.match(/财|才/)) { targets.push(prefix + "财星", prefix + "正财", prefix + "偏财"); }
                            if (dyZGod.match(/食|伤/)) { targets.push(prefix + "食伤", prefix + "食神", prefix + "伤官"); }
                            if (dyZGod.match(/比|劫/)) { targets.push(prefix + "比劫", prefix + "比肩", prefix + "劫财"); }

                            if (["辰", "戌", "丑", "未"].includes(dyZ)) targets.push(prefix + "财库", "财库");
                        }
                    }
                }
                if (ctx.liunian) {
                    const lnZ = ctx.getZhi(ctx.liunian);
                    const lnGGod = ctx.lnGGod.substring(0, 2);
                    const lnZGod = ctx.lnZGod.substring(0, 2);

                    targets.push("流年:天干", "流年:地支");
                    [lnGGod, lnZGod].forEach((god, idx) => {
                        const pillar = idx === 0 ? "天干" : "地支";
                        const prefix = "流年:" + pillar + ":";
                        if (god.match(/官|杀/)) { targets.push(prefix + "官杀", prefix + "正官", prefix + "七杀"); }
                        if (god.match(/印|枭/)) { targets.push(prefix + "印星", prefix + "正印", prefix + "偏印"); }
                        if (god.match(/财|才/)) { targets.push(prefix + "财星", prefix + "正财", prefix + "偏财"); }
                        if (god.match(/食|伤/)) { targets.push(prefix + "食伤", prefix + "食神", prefix + "伤官"); }
                        if (god.match(/比|劫/)) { targets.push(prefix + "比劫", prefix + "比肩", prefix + "劫财"); }
                    });

                    const offBs = ctx.officer.list.filter(g => g.place === 'branch').map(g => data.pillars[g.pillarIdx] ? data.pillars[g.pillarIdx].branch : "");
                    if (offBs.some(b => b && ZHI_CHONG[lnZ] === b)) {
                        targets.push("流年:流年冲官杀", "流年冲官杀");
                        targets.push("流年:流年冲官杀:" + (ctx.isFavorable('officer') ? "官杀为用" : "官杀为忌"));
                    }
                    if (lnGGod.includes('官') || lnGGod.includes('杀')) {
                        targets.push("流年:流年官杀旺", "流年官杀旺");
                        const isStrong = lnZGod.match(/官|杀|财|才/);
                        targets.push("流年:流年官杀旺:" + (isStrong ? "官杀得令" : "官杀不得令"));
                    }
                    if (lnGGod.includes('财')) {
                        targets.push("流年:流年财生官", "流年财生官");
                        targets.push("流年:流年财生官:" + (ctx.isBodyStrong() ? "身旺能担" : "身弱不担"));
                    }
                    if (lnGGod.includes('食') || lnGGod.includes('伤')) {
                        targets.push("流年:流年食伤制官", "流年食伤制官");
                        targets.push("流年:流年食伤制官:" + (ctx.isBodyStrong() ? "身强" : "身弱"));
                    }
                    if (lnGGod.includes('印')) {
                        targets.push("流年:流年印化官", "流年印化官");

                        // New Logic: Check if ANY branch main Qi is Seal
                        const allMainQiGods = [];
                        if (data.pillars) {
                            data.pillars.slice(0, 4).forEach(p => {
                                if (p.hidden && p.hidden[0]) allMainQiGods.push(p.hidden[0].god || "");
                            });
                        }
                        if (ctx.dyZGod) allMainQiGods.push(ctx.dyZGod);
                        if (ctx.lnZGod) allMainQiGods.push(ctx.lnZGod);

                        const hasRootedSeal = allMainQiGods.some(g => g.match(/印|枭/));
                        targets.push("流年:流年印化官:" + (hasRootedSeal ? "印星有力" : "印星无力"));
                    }
                }

                break;
            case "学业":
            case "偏科":
            case "态度":
                // 1. Try to use strict path from DecisionEngine first
                if (window.DecisionEngine && window.DecisionEngine.lookupAcademicResult) {
                    const lookup = window.DecisionEngine.lookupAcademicResult(ctx);
                    if (lookup && lookup.path) {
                        const pathParts = lookup.path.split(' > ');
                        targets.push(...pathParts);
                    }
                }

                targets.push("学业", "偏科", "原局", "大运", "流年", bodyText, "态度", "学习态度", "因素分析");

                const dyG = ctx.dyGGod || "";
                const dyZ = ctx.dyZGod || "";
                if (dyG.match(/印|枭/) || dyZ.match(/印|枭/)) targets.push("印星大运");

                const lnG = ctx.lnGGod || "";
                const lnZ = ctx.lnZGod || "";
                if (lnG.match(/印|枭/) || lnZ.match(/印|枭/)) targets.push("流年遇印星");
                if (ctx.seal.any) {
                    const owlKeywords = ['枭', '偏印', '枭神'];
                    const hasOwl = ctx.seal.list.some(s => owlKeywords.some(k => s.god.includes(k)));

                    // Ensure Visual Tree matches Academic Tree logic
                    if (hasOwl) {
                        targets.push("枭神", "偏印当权", "杀枭并见");
                        if (ctx.officer.list.some(s => (s.god || '').includes('杀') || s.god === '七杀')) {
                            targets.push("杀枭并见");
                            if (ctx.isFavorable('officer')) targets.push("杀枭有制 (高阶)");
                            else {
                                if (ctx.isBodyStrong()) targets.push("奇才变通 (杀枭相生)");
                                else targets.push("极度叛逆 (辍学风险)");
                            }
                        }
                        // [FIX] Don't push generic Seal tags if Owl is dominant
                    } else {
                        if (ctx.isFavorable('seal')) {
                            targets.push("正印为用");
                            if (ctx.officer.any) targets.push("官印相生");
                            if (ctx.wealth.any) {
                                targets.push("财官印俱全");
                                if (ctx.isWealthSealBranchNotAdjacent && !ctx.isBranchClashed) {
                                    targets.push("财不破印");
                                } else {
                                    targets.push("财来破印");
                                }
                            }
                        } else {
                            targets.push("印星为忌");
                            if (ctx.wealth.any) targets.push("财星破印");
                            if (ctx.officer.any) targets.push("官印相生");
                        }
                        // [FIX] Add Food Venting logic here
                        if (ctx.food.any) targets.push("有食伤泄秀");
                    }
                } else {
                    targets.push("没印星");
                    if (ctx.officer.any && ctx.wealth.any) targets.push("只有财官");
                    else if (ctx.officer.any) targets.push("只有官杀");
                    else if (ctx.wealth.any) targets.push("只有财星");
                    if (ctx.food.any) targets.push("只有食伤", "食伤泄秀");
                    if (ctx.rob.any) targets.push("只有比劫");
                }

                if (['甲', '乙'].includes(ctx.dayGan)) targets.push("木火通明");
                if (['庚', '辛'].includes(ctx.dayGan)) targets.push("金水伤官");
                if (ctx.food.any && ctx.seal.any) targets.push("伤官配印");

                if (ctx.isFavorable('seal')) targets.push("印星为用");
                if (ctx.isFavorable('officer')) targets.push("官星为用");
                if (ctx.wealth.any && !ctx.isFavorable('wealth')) targets.push("财星为忌");
                if (ctx.rob.any && !ctx.isFavorable('rob')) targets.push("比劫为忌");
                if (!ctx.isBodyStrong() && ctx.isFavorable('seal')) targets.push("日主弱，印星为用");
                break;
            case "婚期":
                targets.push("婚期判断", "因素分析");
                const sPos = (ctx.isMale ? ctx.wealth : ctx.officer).list;
                if (sPos.some(s => s.pillarIdx < 2)) targets.push("年月透财官", "早婚信号（男≤26岁，女≤24岁）");
                if (sPos.some(s => s.pillarIdx > 1)) targets.push("日时藏财官", "晚婚信号（男≥30岁，女≥28岁）");
                if (sPos.length === 0) targets.push(ctx.isMale ? "男命无财星" : "女命无官杀", "不婚/难婚信号");
                break;
            case "性格":
                targets.push("性格特征");
                ['officer', 'seal', 'wealth', 'food', 'rob'].forEach(k => {
                    if (ctx[k].any) {
                        const labelMap = { officer: "官杀", seal: "印星", wealth: "财星", food: "食伤", rob: "比劫" };
                        const label = labelMap[k];
                        const isF = ctx.isFavorable(k);
                        const favorStr = (isF ? "用神" : "忌神") + label;
                        const prefix = "性格特征:" + label + ":" + favorStr;
                        targets.push("性格特征:" + label, prefix);

                        // Calculate Strength & Restriction from Engine Data (Vercel Sync)
                        let isWang = false;
                        let isWeak = false;
                        let isRestricted = false;

                        if (ctx.strengthDetails && ctx.strengthDetails.length > 0) {
                            ctx.strengthDetails.forEach(pData => {
                                if (pData.gods) {
                                    pData.gods.forEach(g => {
                                        const gn = (g.god || "").trim();
                                        const godMap = {
                                            officer: ['正官', '七杀', '偏官', '官', '杀'],
                                            seal: ['正印', '偏印', '枭神', '枭印', '印', '枭', '枭印'],
                                            wealth: ['正财', '偏财', '财', '才'],
                                            food: ['食神', '伤官', '食', '伤'],
                                            rob: ['比肩', '劫财', '比', '劫']
                                        };
                                        if (godMap[k].indexOf(gn) !== -1) {
                                            const s = g.status || "";
                                            const isR = pData.isRestricted || (pData.restrictionDetails && pData.restrictionDetails.length > 0);

                                            if (s.includes('衰') || s.includes('囚') || s.includes('死') || s.includes('废') || s.includes('虚浮') || s.includes('弱')) isWeak = true;
                                            else if (s.includes('旺') || s.includes('相')) isWang = true;

                                            if (isR) isRestricted = true;
                                        }
                                    });
                                }
                            });
                        }

                        if (isWang) { targets.push(prefix + ":" + label + "旺相"); }
                        if (isRestricted) { targets.push(prefix + ":" + label + "受制"); }
                        if (isWeak) { targets.push(prefix + ":" + label + "弱"); }

                        // Sub-Conditions (Production Sync)
                        if (!isF && isWang) {
                            const sub = prefix + ":" + label + "旺相:";
                            if (k === 'officer') {
                                if (ctx.seal.any) targets.push(sub + "有印化");
                                if (ctx.food.any) targets.push(sub + "有食伤制");
                                if (!ctx.seal.any && !ctx.food.any) targets.push(sub + "无印化");
                            } else if (k === 'seal') {
                                if (ctx.wealth.any) targets.push(sub + "有财制");
                                else targets.push(sub + "无财制");
                            } else if (k === 'wealth') {
                                if (ctx.rob.any) targets.push(sub + "有比劫制");
                                else targets.push(sub + "无比劫制");
                            } else if (k === 'food') {
                                if (ctx.seal.any) targets.push(sub + "有印制");
                                else targets.push(sub + "无印制");
                            } else if (k === 'rob') {
                                if (ctx.officer.any) targets.push(sub + "有官杀制");
                                else targets.push(sub + "无官杀制");
                            }
                        }
                    }
                });
                break;
        }

        const uniqueTargets = [...new Set(targets)];
        log("Targets", uniqueTargets);

        const clickedIds = new Set();
        let pass = 0;
        while (pass < 50) {
            pass++;
            let clickedInThisPass = false;
            const levels = container.querySelectorAll('.tree-level-container');

            // Iterate levels to find available cards
            for (let i = 0; i < levels.length; i++) {
                const cards = levels[i].querySelectorAll('.tree-node-card:not(.active)');
                for (const card of cards) {
                    const nodeId = card.dataset.id;
                    if (clickedIds.has(nodeId)) continue;

                    const title = card.querySelector('.tree-node-title')?.innerText?.trim();
                    if (!title) continue;

                    const parentsAttr = card.dataset.parents || "";
                    const parentList = parentsAttr ? parentsAttr.split(',').map(p => p.trim()) : [];

                    const match = uniqueTargets.some(t => {
                        let targetTitle = t;
                        let scopes = [];
                        if (t.includes(':')) {
                            const parts = t.split(':');
                            targetTitle = parts.pop().trim();
                            scopes = parts.map(s => s.trim());
                        }

                        // Nodes and Instructions that demand exact matching to prevent keyword bleeding
                        const exactMatchTerms = [
                            "官非", "婚姻", "事业", "子女", "学业", "性生活", "财", "无重大神煞",
                            "大运", "流年", "天干", "地支", "原局", "天干地支相同", "天干地支不同", "身强", "身弱", "男命", "女命",
                            "有财", "没财", "无财", "有官", "无官", "性格特征", "官杀", "印星", "财星", "食伤", "比劫",
                            "伤官", "食神", "正财", "偏财", "正官", "七杀", "正印", "偏印", "比肩", "劫财",
                            "用神官杀", "忌神官杀", "用神印星", "忌神印星", "用神财星", "忌神财星", "用神食伤", "忌神食伤", "用神比劫", "忌神比劫",
                            "官杀弱", "印星弱", "财星弱", "食伤弱", "比劫弱", "官杀旺相", "印星旺相", "财星旺相", "食伤旺相", "比劫旺相",
                            "轻微官非", "中度官非", "重度官非", "官非类型",
                            "官杀为忌旺而有制", "伤官见官", "官杀为忌旺而无制", "七杀透干无印化", "财官相战",
                            // [FIX] Aliases for Legal View
                            "官杀旺无制", "七杀透干", "财生官杀", "点击展开化解方案"
                        ];

                        const isExactTerm = exactMatchTerms.includes(title) || exactMatchTerms.includes(targetTitle);

                        let titleMatches = false;
                        if (isExactTerm) {
                            titleMatches = (targetTitle === title);
                        } else {
                            // General fuzzy matching for descriptive content nodes
                            titleMatches = (targetTitle === title || (title.includes(targetTitle) && targetTitle.length >= 2) || (targetTitle.includes(title) && title.length >= 2));
                        }

                        if (!titleMatches) return false;

                        // Check scopes if provided (e.g. "大运:食伤" matches if both '大运' and '食伤' (as a category) are in path)
                        // With ancestry fixed, we use 'every' for strict path isolation.
                        if (scopes.length > 0) {
                            // STRICT SCOPE MATCHING:
                            // Verify that the immediate parent of the card matches the last scope item.
                            // This prevents highlighting multiple branches (e.g. both 'Use God' and 'Taboo God')
                            // that share descriptive ancestor names.
                            const lastScope = scopes[scopes.length - 1];
                            const lastParent = parentList[parentList.length - 1];

                            if (lastScope !== lastParent) return false;

                            return scopes.every(s => parentList.includes(s));
                        }

                        // If no scope provided, non-structural nodes are isolated from Luck/Year zones
                        if (!isExactTerm) {
                            const isolationZones = ["大运", "流年"];
                            if (isolationZones.some(zone => parentList.includes(zone))) return false;
                        }
                        return true;
                    });

                    if (match) {
                        log(`Clicking: ${title} (Parents: ${parentList.join(' > ')})`);
                        clickedIds.add(nodeId);
                        card.click();
                        clickedInThisPass = true;
                        break;
                    }
                }
                if (clickedInThisPass) break;
            }
            if (!clickedInThisPass) break;
        }
    }

    function resetTopic() {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';
        const data = window.currentData;
        if (data) {
            const header = document.createElement('div');
            header.style.cssText = 'color:#aaa; font-size:14px; margin-bottom:10px; border-bottom:1px solid #333; padding-bottom:10px; width:100%;';
            header.textContent = `${data.solarDate} (${data.lunarDate.split(' ')[1]} | ${data.lunarDate.split(' ')[0]})`;
            container.appendChild(header);
        }
        const rootNodes = allTreeData[activeTopic] || [];
        if (rootNodes.length > 0) renderLevel(0, rootNodes);
    }

    function parseRichText(text) {
        if (!text) return '';
        let safe = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        safe = safe.replace(/\*\*(.*?)\*\*/g, '<span style="color:#e67e22; font-weight:bold;">$1</span>');
        safe = safe.replace(/\n/g, '<br>');
        return safe;
    }

    function showAdvice(text) {
        if (!text) return;
        const container = document.getElementById(containerId);
        let box = container.querySelector('.tree-advice-box');
        if (!box) {
            box = document.createElement('div');
            box.className = 'tree-advice-box';
            container.appendChild(box);
        }
        box.style.display = 'block';
        const newHtml = parseRichText(text);
        const strip = (html) => html.replace(/<[^>]*>?/gm, '').replace(/\s+/g, '').trim();
        const contentArea = box.querySelector('.tree-advice-content');
        const currentContent = contentArea ? contentArea.innerHTML : '';
        if (strip(currentContent).includes(strip(newHtml))) return;

        // Visual Diagnostic Panel (Hidden by default, shown when data exists)
        let diagHtml = "";
        if (window.currentData) {
            const d = window.currentData;
            const context = {
                DM: d.dayMaster || (d.pillars && d.pillars[2] ? (d.pillars[2].gan || d.pillars[2].stem) : "?"),
                Luck: d.currentDaYun ? (d.currentDaYun.gan || d.currentDaYun.stem || "?") + (d.currentDaYun.zhi || d.currentDaYun.branch || "?") : "无",
                Year: d.selectedLiuNian ? (d.selectedLiuNian.gan || d.selectedLiuNian.stem || "?") + (d.selectedLiuNian.zhi || d.selectedLiuNian.branch || "?") : "无"
            };
            diagHtml = `<div style="margin-top:10px; padding-top:10px; border-top:1px dashed #444; font-size:11px; color:#666;">
                🔍 系统探测数据：日主[${context.DM}] | 大运[${context.Luck}] | 流年[${context.Year}]
            </div>`;
        }

        box.innerHTML = `
            <div class="tree-advice-header">
                <div class="tree-advice-title"><span>✨</span> 推演结论</div>
                <button class="tree-copy-btn" onclick="window.TreeViewer.copyAdvice(this, 'ALL')">复制</button>
            </div>
            <div class="tree-advice-content">${currentContent ? currentContent + '<hr style="border:0; border-top:1px solid #333; margin:10px 0;">' : ''}${newHtml}</div>
            ${diagHtml}
        `;
        setTimeout(() => box.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    }

    function copyAdvice(btn, text) {
        let finalOutput = text;
        if (text === 'ALL') {
            const content = document.querySelector('.tree-advice-content');
            finalOutput = content ? content.innerText : '';
        }
        if (navigator.clipboard) {
            navigator.clipboard.writeText(finalOutput).then(() => {
                const originalContent = btn.innerHTML;
                btn.innerHTML = `已复制`;
                setTimeout(() => { btn.innerHTML = originalContent; }, 2000);
            });
        }
    }


    window.TreeViewer = { init, selectTopic, autoSelectNodes, copyAdvice, reset: resetTopic, getAllLogicTargets, getChartContext };
})();
