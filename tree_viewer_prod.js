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

        // Clear advice box if starting from root, to rebuild advice based on current active nodes
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
                // Remove all subsequent levels if no active nodes in this level
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
                if (nodeId.startsWith('remedy-header-')) {
                    window._remedyButtonShown = true;
                }
                let nodeObj = null;
                if (nodeId.startsWith('remedy-header-')) {
                    // Recover dynamic node: find the static remedy root and use its children
                    const roots = (allTreeData && allTreeData["官非"]) || [];
                    const remedyRoot = roots.find(r => r.title === "官非" || r.title === "官非化解");
                    let foundRemedy = null;
                    if (remedyRoot) {
                        if (remedyRoot.title === "官非化解") foundRemedy = remedyRoot;
                        else if (remedyRoot.children) foundRemedy = remedyRoot.children.find(c => c.title === "官非化解");
                    }
                    if (foundRemedy) {
                        nodeObj = {
                            id: nodeId,
                            title: "🔎 点击展开化解方案",
                            content: "根据以上结论为您匹配的化解方案：",
                            result: "",
                            children: foundRemedy.children
                        };
                    }
                } else {
                    for (const root of (allTreeData[activeTopic] || [])) {
                        nodeObj = findNodeById(root, nodeId);
                        if (nodeObj) break;
                    }
                }

                if (nodeObj) {
                    // Recover full ancestry from DOM to node object to ensure correct propagation
                    const parentsAttr = card.dataset.parents || "";
                    const storedPath = parentsAttr ? parentsAttr.split(',').map(p => p.trim()) : [];
                    nodeObj = { ...nodeObj, _parentTitles: storedPath };

                    let nodeChildren = nodeObj.children || [];

                    // Check if this node is a diagnostic conclusion that should trigger a remedy
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
                            // Use ID for deduplication to allow parallel paths with same-titled children
                            const existing = mergedChildren.find(m => m.id === c.id);
                            if (!existing) {
                                // Clone node and store full ancestry path
                                const cloned = { ...c, _parentTitles: [...newPath] };
                                mergedChildren.push(cloned);
                            } else {
                                // Merge path info if this child is reached via a different path
                                newPath.forEach(p => {
                                    if (!existing._parentTitles.includes(p)) existing._parentTitles.push(p);
                                });
                            }
                        });
                    }

                    const isLeaf = !nodeChildren || nodeChildren.length === 0;
                    const isLegalDiagnosticNode = nodeId.startsWith('remedy-header-');

                    if (level > 0 && (isLeaf || isLegalDiagnosticNode || nodeObj.result) && (nodeObj.result || nodeObj.content)) {
                        let combinedText = "";
                        const content = (nodeObj.content || "").trim();
                        const result = (nodeObj.result || "").trim();
                        if (content && result && content !== result) {
                            if (content.includes(result)) combinedText = content;
                            else combinedText = content + "\n→ **结果**：" + result;
                        } else combinedText = result || content;
                        showAdvice(combinedText);
                    }
                }
            });

            // Consolidation: If ANY active node in this level was a diagnostic conclusion, add ONE remedy header
            if (shouldAddRemedyHeader && !window._remedyButtonShown) {
                const roots = (allTreeData && allTreeData["官非"]) || [];
                const remedyRoot = roots.find(r => r.title === "官非" || r.title === "官非化解");
                let foundRemedy = null;
                if (remedyRoot) {
                    if (remedyRoot.title === "官非化解") foundRemedy = remedyRoot;
                    else if (remedyRoot.children) foundRemedy = remedyRoot.children.find(c => c.title === "官非化解");
                }
                if (foundRemedy) {
                    const remedyHeader = {
                        id: 'remedy-header-' + lastDiagnosticNodeId,
                        title: "🔎 点击展开化解方案",
                        content: "根据以上结论为您匹配的化解方案：",
                        result: "",
                        children: foundRemedy.children
                    };
                    const alreadyExists = mergedChildren.some(m => m.title === remedyHeader.title);
                    if (!alreadyExists) {
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
                existingLevels.forEach((el, idx) => {
                    if (idx > level) el.remove();
                });
                break;
            }
        }
        const adviceBox = container.querySelector('.tree-advice-box');
        if (adviceBox) container.appendChild(adviceBox);
    }

    function autoSelectNodes(topic = activeTopic) {
        if (!window.currentData) return;
        const data = window.currentData;
        const container = document.getElementById(containerId);
        if (!container) return;

        // Diagnostic logger
        const log = (msg, data) => {
            console.log(`[TreeAutoSelect] ${msg}`, data || '');
        };

        const getChartContext = () => {
            const ctx = {};
            const getGods = (godNames) => {
                const res = [];
                if (!data.pillars) return res;
                const mainPillars = data.pillars.slice(0, 4);
                mainPillars.forEach((p, idx) => {
                    const stemGod = (p.tenGod || '').trim();
                    if (godNames.includes(stemGod)) res.push({ god: stemGod, place: 'stem', pillarIdx: idx });
                    if (p.hidden && p.hidden.length > 0) {
                        p.hidden.forEach(h => {
                            const hGod = (h.god || '').trim();
                            if (godNames.includes(hGod)) res.push({ god: hGod, place: 'branch', pillarIdx: idx });
                        });
                    }
                });
                return res;
            };
            ctx.isMale = () => data.gender === 1 || data.gender === '男';
            ctx.genderText = (data.gender === '女' || data.gender === '0' || data.gender === 0) ? "女命" : "男命";
            ctx.isBodyStrong = () => {
                let bs = data.bodyStrength;
                if (!bs && window.calculateBodyStrength && data.pillars) {
                    console.warn('[TreeViewer] data.bodyStrength missing, recalculating...');
                    bs = window.calculateBodyStrength(data.pillars.slice(0, 4));
                }
                if (!bs || !bs.level) {
                    console.warn('[TreeViewer] Body strength could not be determined, defaulting to False (Weak).', bs);
                    return false;
                }
                const isStrong = bs.level.includes('身强') || bs.level.includes('身旺');
                console.log(`[TreeViewer] Body Strength Check: ${bs.level} -> isStrong: ${isStrong}`);
                return isStrong;
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
                return { any: list.length > 0, stem: list.some(g => g.place === 'stem'), branch: list.some(g => g.place === 'branch'), list: list };
            };
            ctx.wealth = checkPresence('wealth');
            ctx.officer = checkPresence('officer');
            ctx.seal = checkPresence('seal');
            ctx.food = checkPresence('food');
            ctx.rob = checkPresence('rob');
            ctx.isFavorable = (category) => {
                const strong = ctx.isBodyStrong();
                if (category === 'wealth' || category === 'officer' || category === 'food') return strong;
                if (category === 'seal' || category === 'rob') return !strong;
                return false;
            };

            ctx.getStem = (obj) => obj ? (obj.gan || obj.stem || "") : "";
            ctx.getZhi = (obj) => obj ? (obj.zhi || obj.branch || "") : "";

            const dayPillar = (data.pillars && data.pillars[2]) ? data.pillars[2] : null;
            ctx.dayGan = ctx.getStem(dayPillar);
            ctx.dayZhi = ctx.getZhi(dayPillar);
            // Fallback for different data structures
            if (!ctx.dayGan && data.dayMaster) ctx.dayGan = data.dayMaster;

            ctx.dayun = data.currentDaYun || data.dayun || window.currentDaYun || (data.pillars && data.pillars[4] ? data.pillars[4] : null);
            ctx.liunian = data.selectedLiuNian || data.liunian || window.selectedLiuNian || (data.pillars && data.pillars[5] ? data.pillars[5] : null);

            // Extraction of pre-calculated Ten Gods from the original data
            // Priority: .tenGod/.zhiTenGod -> .hidden[0].god (Main Qi)
            ctx.dyGGod = ctx.dayun ? (ctx.dayun.tenGod || "") : "";
            ctx.dyZGod = ctx.dayun ? (ctx.dayun.zhiTenGod || (ctx.dayun.hidden && ctx.dayun.hidden[0] ? ctx.dayun.hidden[0].god : "")) : "";
            ctx.lnGGod = ctx.liunian ? (ctx.liunian.tenGod || "") : "";
            ctx.lnZGod = ctx.liunian ? (ctx.liunian.zhiTenGod || (ctx.liunian.hidden && ctx.liunian.hidden[0] ? ctx.liunian.hidden[0].god : "")) : "";

            // If pre-calculated values are missing, only then fallback to safeGetTenGod (preserving some robustness)
            ctx.safeGetTenGod = (dm, s) => {
                if (window.getTenGod) return window.getTenGod(dm, s);
                return "";
            };

            if (!ctx.dyGGod && ctx.dayun) ctx.dyGGod = ctx.safeGetTenGod(ctx.dayGan, ctx.getStem(ctx.dayun));
            if (!ctx.dyZGod && ctx.dayun) ctx.dyZGod = ctx.safeGetTenGod(ctx.dayGan, ctx.getZhi(ctx.dayun));
            if (!ctx.lnGGod && ctx.liunian) ctx.lnGGod = ctx.safeGetTenGod(ctx.dayGan, ctx.getStem(ctx.liunian));
            if (!ctx.lnZGod && ctx.liunian) ctx.lnZGod = ctx.safeGetTenGod(ctx.dayGan, ctx.getZhi(ctx.liunian));

            ctx.isDayunUniform = () => {
                if (!ctx.dayun) return false;
                const WU_XING = { "甲": "木", "乙": "木", "丙": "火", "丁": "火", "戊": "土", "己": "土", "庚": "金", "辛": "金", "壬": "水", "癸": "水", "寅": "木", "卯": "木", "巳": "火", "午": "火", "申": "金", "酉": "金", "亥": "水", "子": "水", "辰": "土", "戌": "土", "丑": "土", "未": "土" };
                const g = ctx.getStem(ctx.dayun);
                const z = ctx.getZhi(ctx.dayun);
                if (!g || !z) return false;
                return WU_XING[g] === WU_XING[z];
            };
            return ctx;
        };

        const ctx = getChartContext();
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
                        targets.push("财强");
                        if (ctx.food.any) targets.push("有食伤生财"); else targets.push("无食伤");
                    } else {
                        targets.push("身弱");
                        if (ctx.seal.any) targets.push("印为用", "财不破印", "印星为用"); else targets.push("无印", "财旺");
                    }
                } else targets.push("没财", "无财星");

                if (ctx.dayun || ctx.liunian) {
                    if (ctx.dayun) {
                        const isSame = ctx.isDayunUniform();
                        targets.push(isSame ? "天干地支相同" : "天干地支不同");

                        const dyG = ctx.getStem(ctx.dayun);
                        const dyZ = ctx.getZhi(ctx.dayun);
                        const dyGGod = ctx.dyGGod.substring(0, 2);
                        const dyZGod = ctx.dyZGod.substring(0, 2);

                        if (isSame) {
                            const god = dyGGod;
                            if (god.includes("财") || god.includes("才")) targets.push("大运:财星运", "财星运");
                            if (god.includes("食") || god.includes("伤")) targets.push("大运:食伤运", "食伤运");
                            if (god.includes("官") || god.includes("杀")) targets.push("大运:官杀运", "官杀运");
                            if (god.includes("印") || god.includes("枭")) targets.push("大运:印星运", "印星运");
                            if (god.includes("比") || god.includes("劫")) targets.push("大运:比劫运", "比劫运");
                        } else {
                            targets.push("天干", "地支", "天干地支不同");
                            // Use multi-level scoping for robustness
                            const stemGod = dyGGod;
                            if (stemGod.includes("财") || stemGod.includes("才")) { targets.push("大运:天干:财", "大运:天干:正财", "大运:天干:偏财", "大运:天干:财星"); }
                            if (stemGod.includes("食") || stemGod.includes("伤")) { targets.push("大运:天干:食伤", "大运:天干:食神", "大运:天干:伤官", "大运:天干:食伤"); }
                            if (stemGod.includes("官") || stemGod.includes("杀")) { targets.push("大运:天干:官杀", "大运:天干:正官", "大运:天干:七杀", "大运:天干:官杀"); }
                            if (stemGod.includes("印") || stemGod.includes("枭")) { targets.push("大运:天干:印星", "大运:天干:正印", "大运:天干:偏印", "大运:天干:印星"); }
                            if (stemGod.includes("比") || stemGod.includes("劫")) { targets.push("大运:天干:比劫", "大运:天干:比肩", "大运:天干:劫财", "大运:天干:比劫"); }

                            const branchGod = dyZGod;
                            if (branchGod.includes("财") || branchGod.includes("才")) { targets.push("大运:地支:财", "大运:地支:正财", "大运:地支:偏财", "大运:地支:财星"); }
                            if (branchGod.includes("食") || branchGod.includes("伤")) { targets.push("大运:地支:食伤", "大运:地支:食神", "大运:地支:伤官", "大运:地支:食伤"); }
                            if (branchGod.includes("官") || branchGod.includes("杀")) { targets.push("大运:地支:官杀", "大运:地支:正官", "大运:地支:七杀", "大运:地支:官杀"); }
                            if (branchGod.includes("印") || branchGod.includes("枭")) { targets.push("大运:地支:印星", "大运:地支:正印", "大运:地支:偏印", "大运:地支:印星"); }
                            if (branchGod.includes("比") || branchGod.includes("劫")) { targets.push("大运:地支:比劫", "大运:地支:比肩", "大运:地支:劫财", "大运:地支:比劫"); }

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
                const isMale = ctx.isMale();
                const stars = isMale ? ctx.wealth : ctx.officer;
                const starType = isMale ? (stars.list.some(s => s.god === '正财') ? "正财" : "偏财") : (stars.list.some(s => s.god === '正官') ? "正官" : "七杀");
                if (stars.any) {
                    const isFavorable = ctx.isFavorable(isMale ? 'wealth' : 'officer');
                    const isStrong = stars.list.length >= 2 || (stars.branch && stars.stem); // Simple heuristic for旺/弱

                    targets.push(isMale ? "有财星" : "有官杀星", "财星状态", "官星状态");
                    targets.push(starType + (isStrong ? "旺" : "弱"));
                    targets.push(starType + (isFavorable ? "为用" : "为忌"));

                    if (isMale && ctx.rob.any) targets.push("财星被比劫夺", "比劫特质", "比劫克财（男）");
                    if (!isMale && ctx.food.any) targets.push("官星被食伤克", "食伤特质", "食伤克官（女）");
                } else targets.push(isMale ? "无财星" : "无官杀星", "看婚姻宫");

                const palaceGod = window.getTenGod ? window.getTenGod(ctx.dayGan, ctx.dayZhi) : "";
                if (palaceGod) targets.push("日坐" + palaceGod.substring(0, 2));

                const isDPV = ctx.isFavorable('palace');
                targets.push(isDPV ? "日支为喜用" : "日支为忌");
                if (isDPV) targets.push("日坐禄星", "日支生身", "日支合日干", "喜用在宫", "星宫同旺", "星宫相生");
                else targets.push("日坐比劫", "日坐羊刃", "日支克日主", "星宫相克");

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
                const childS = ctx.isMale() ? ctx.officer : ctx.food;
                if (childS.any) {
                    targets.push(ctx.isMale() ? "有官杀星" : "有食伤星");
                    const isF = ctx.isFavorable(ctx.isMale() ? 'officer' : 'food');
                    targets.push(isF ? "子女优秀型" : "子女困难型");
                    targets.push(ctx.isMale() ? "官杀为用" : (isF ? "食伤为用" : "食伤为忌"));
                    targets.push(ctx.isMale() ? "官杀旺相" : (childS.list.some(s => s.god === '食神') ? "食神旺相" : "伤官旺相"));
                    if (isF) {
                        targets.push("官杀透干", "官杀藏支");
                        if (ctx.isMale()) { if (ctx.seal.any) targets.push("官印相生（男）", "有印化官"); }
                        else { if (ctx.wealth.any) targets.push("食神生财（女）"); }
                    } else {
                        if (!ctx.food.any) targets.push("无食伤制杀");
                        if (!ctx.seal.any) targets.push("无印化官");
                        if (childS.list.length > 1) targets.push("官杀无制");
                    }
                } else targets.push("无官杀星", "无食伤星", "看时柱");
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
                    targets.push("枭神夺食");
                    if (!ctx.isFavorable('seal')) targets.push("枭神旺而夺食");
                    if (ctx.wealth.any) targets.push("有财制枭");
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
                    const primaryTrigger = matchedTriggers[0];
                    if (primaryTrigger) {
                        targets.push("官非类型:" + primaryTrigger.reason);
                        targets.push("官非类型:" + primaryTrigger.reason + ":" + chosenSev);
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
                if (ctx.officer.any || ctx.seal.any) {
                    if (ctx.isBodyStrong()) {
                        targets.push("官杀为用");
                        if (ctx.seal.any) targets.push("有印化官"); else targets.push("无印化官");
                    } else {
                        targets.push("官杀为忌");
                        if (ctx.seal.any) targets.push("有印化官"); else targets.push("无印化官");
                    }
                } else targets.push("无官杀星");

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
                if (ctx.officer.any) {
                    const isV = ctx.isFavorable('officer');
                    targets.push(isV ? "官杀为用" : "官杀为忌");
                    if (isV) {
                        if (ctx.seal.any) targets.push("有印化官", "官印相生", "官印相生 (高阶)");
                        if (ctx.wealth.any) targets.push("有财生官", "财官相生");
                        if (ctx.food.any) targets.push("有食伤制杀", "食伤制杀");
                    } else {
                        if (ctx.seal.any) targets.push("有印化官", "官印相生");
                        if (ctx.food.any) targets.push("有食伤制杀", "食伤制杀");
                        if (ctx.wealth.any) targets.push("财星破印");
                        targets.push("比劫抗官");
                    }
                } else {
                    targets.push("无官杀星");
                    if (ctx.wealth.any) targets.push("有财星");
                    if (ctx.food.any) targets.push("有食伤");
                }
                break;
            case "学业":
            case "偏科":
            case "态度":
                targets.push("学业", "偏科", "原局", bodyText, "态度", "学习态度", "因素分析");
                if (ctx.seal.any) {
                    const owlKeywords = ['枭', '偏印', '枭神'];
                    const hasOwl = ctx.seal.list.some(s => owlKeywords.some(k => s.god.includes(k)));
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
                    } else targets.push(ctx.isFavorable('seal') ? "印星为用" : "印星为忌");
                    if (ctx.officer.any) targets.push("官杀生印", "官印相生", "杀印相生");
                    if (ctx.wealth.any) targets.push("财官印俱全", "财不破印", "财印相战");
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

                if (ctx.isBodyStrong()) {
                    targets.push("自律性强");
                    if (ctx.seal.any) targets.push("主动好学");
                } else {
                    targets.push("刻苦努力");
                    if (ctx.rob.any) targets.push("分心严重");
                }
                break;
            case "婚期":
                targets.push("婚期判断", "因素分析");
                const sPos = (ctx.isMale() ? ctx.wealth : ctx.officer).list;
                if (sPos.some(s => s.pillarIdx < 2)) targets.push("年月透财官", "早婚信号（男≤26岁，女≤24岁）");
                if (sPos.some(s => s.pillarIdx > 1)) targets.push("日时藏财官", "晚婚信号（男≥30岁，女≥28岁）");
                if (sPos.length === 0) targets.push(ctx.isMale() ? "男命无财星" : "女命无官杀", "不婚/难婚信号");
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
                        targets.push(prefix + ":" + label + "旺相"); // Placeholder for strength logic

                        if (!isF) {
                            const subPrefix = prefix + ":" + label + "旺相:";
                            if (k === 'officer') {
                                if (ctx.seal.any) targets.push(subPrefix + "有印化");
                                if (ctx.food.any) targets.push(subPrefix + "有食伤制");
                                if (!ctx.seal.any && !ctx.food.any) targets.push(subPrefix + "无印化");
                            } else if (k === 'seal') {
                                if (ctx.wealth.any) targets.push(subPrefix + "有财制");
                                else targets.push(subPrefix + "无财制");
                            } else if (k === 'wealth') {
                                if (ctx.rob.any) targets.push(subPrefix + "有比劫制");
                                else targets.push(subPrefix + "无比劫制");
                            } else if (k === 'food') {
                                if (ctx.seal.any) targets.push(subPrefix + "有印制");
                                else targets.push(subPrefix + "无印制");
                            } else if (k === 'rob') {
                                if (ctx.officer.any) targets.push(subPrefix + "有官杀制");
                                else targets.push(subPrefix + "无官杀制");
                            }
                        }
                    }
                });
                break;
            default: targets.push(topic);
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
                            "轻微官非", "中度官非", "重度官非", "官非类型", "官杀为忌旺而有制", "伤官见官", "官杀为忌旺而无制", "七杀透干无印化", "财官相战"
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

    window.TreeViewer = { init, selectTopic, autoSelectNodes, copyAdvice, reset: resetTopic };
})();
