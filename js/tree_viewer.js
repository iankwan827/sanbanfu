(function () {
    const containerId = 'treeDisplay';
    let activeTopic = "财";
    let currentDeductionId = 0;

    // Matrix/Terminal Styles
    const terminalStyles = `
        #treeDisplay {
            background: #000 !important;
            color: #00FF00 !important;
            font-family: 'Courier New', Courier, monospace !important;
            padding: 20px !important;
            border-radius: 8px;
            min-height: 400px;
            max-height: 600px;
            overflow-y: auto;
            border: 1px solid #004400;
            box-shadow: inset 0 0 10px #002200;
            font-size: 14px;
            line-height: 1.5;
            text-shadow: 0 0 5px #00FF00;
        }
        .term-category { color: #00FFFF; font-weight: bold; margin-top: 15px; border-bottom: 1px solid #004444; }
        .term-path { color: #FFFF00; font-style: italic; padding-left: 10px; margin: 5px 0; }
        .term-result { color: #FF00FF; font-weight: bold; padding-left: 10px; margin-bottom: 15px; }
        .term-cursor { display: inline-block; width: 8px; height: 15px; background: #00FF00; animation: blink 1s infinite; vertical-align: middle; }
        @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
    `;

    function init() {
        // Inject styles
        const styleSheet = document.createElement("style");
        styleSheet.innerText = terminalStyles;
        document.head.appendChild(styleSheet);

        const topicBar = document.getElementById('treeTabBar');
        if (!topicBar) return;
        topicBar.innerHTML = '';

        const select = document.createElement('select');
        select.id = 'topicSelector';
        select.className = 'tree-select'; // Use existing style from paipan.html

        const topics = {
            "财": "wealth",
            "婚姻": "marriage_timing",
            "学业": "academic",
            "官非": "legal",
            "事业": "career",
            "性格": "personality_tree",
            "子女": "children",
            "态度": "attitude",
            "性生活": "sexlife",
            "能量": "strength_logic"
        };

        Object.keys(topics).forEach(t => {
            const opt = document.createElement('option');
            opt.value = t;
            opt.innerText = t;
            if (t === activeTopic) opt.selected = true;
            select.appendChild(opt);
        });

        select.onchange = (e) => selectTopic(e.target.value);
        topicBar.appendChild(select);

        resetTerminal();
    }

    function selectTopic(t) {
        activeTopic = t;
        resetTerminal();
        renderHackerLog(t);
    }

    function resetTerminal() {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '<div>[SYSTEM] INITIALIZING_DEDUCTION_ENGINE...</div>';
            container.innerHTML += '<div class="term-cursor"></div>';
        }
    }

    async function typeLine(container, text, className) {
        const cursor = container.querySelector('.term-cursor');
        const line = document.createElement('div');
        line.className = className;
        container.insertBefore(line, cursor);

        for (let i = 0; i < text.length; i++) {
            line.textContent += text[i];
            await new Promise(r => setTimeout(r, 10));
            container.scrollTop = container.scrollHeight;
        }
    }

    async function renderHackerLog(topic) {
        const myId = ++currentDeductionId;
        const container = document.getElementById(containerId);
        if (!container) return;

        // Clear initial msg
        container.innerHTML = '<span class="term-cursor"></span>';

        const data = window.currentData;
        if (!data || !data.ctx) {
            await typeLine(container, ">> ERROR: BAZI_CONTEXT_NOT_FOUND. PLEASE_EXECUTE_CALCULATION_FIRST.", "term-category");
            return;
        }

        const ctx = data.ctx;
        const topicMap = {
            "财": "wealth",
            "婚姻": ["MARRIAGE_TIME", "MARRIAGE_REL_HAPPY", "MARRIAGE_REL_DIVORCE", "MARRIAGE_REL_AFFAIR", "MARRIAGE_TRAIT", "MARRIAGE_APPEARANCE"],
            "学业": "academic",
            "官非": "legal",
            "事业": "career",
            "性格": "personality_tree",
            "子女": "children",
            "态度": "attitude",
            "性生活": "sexlife",
            "能量": "strength_logic"
        };

        const mapped = topicMap[topic];
        const engineTopics = Array.isArray(mapped) ? mapped : [mapped];

        await typeLine(container, `[${topic}运逻辑推演序列]`, "term-category");

        for (const tKey of engineTopics) {
            if (myId !== currentDeductionId) return; // Cancelled
            if (!window.DecisionEngine || !window.DecisionEngine.execute) continue;

            console.log(`[TreeViewer] Executing tree: ${tKey}`, ctx);
            const result = window.DecisionEngine.execute(tKey, ctx);
            console.log(`[TreeViewer] Result for ${tKey}:`, result);

            if (result && result.results && result.results.length > 0) {
                // Only show path and results if there are actual results
                if (result.trace && result.trace.length > 0) {
                    const pathStr = "- 逻辑溯源: " + result.trace.map(step => step.text || step.id).join(" -> ");
                    await typeLine(container, pathStr, "term-path");
                }

                for (const r of result.results) {
                    if (myId !== currentDeductionId) return; // Cancelled
                    await typeLine(container, `* 达成判定: ${r.title || r.text}`, "term-result");
                }
            }
        }

        await typeLine(container, ">> DEDUCTION_COMPLETE. STATUS: SUCCESS.", "term-category dim");
    }

    function autoSelectNodes() {
        // Redefined for Hacker Mode: Trigger log for current active topic
        renderHackerLog(activeTopic);
    }

    function reset() {
        activeTopic = "财";
        init();
    }

    window.TreeViewer = {
        init,
        selectTopic,
        autoSelectNodes,
        reset
    };

    // Export to global for sync
    window.renderHackerLog = renderHackerLog;

})();
