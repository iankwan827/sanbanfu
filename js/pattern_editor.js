/**
 * pattern_editor.js
 * Logic for browsing and editing Bazi Engine patterns.
 */

const FACT_DICTIONARY = {
    //通用/身强弱
    isSelfStrong: "身强", isSelfWeak: "身弱", isMale: "男命", isFemale: "女命",
    // 财富相关
    hasWealth: "命中带财", isWealthStrong: "财星强旺", isWealthWeak: "财星气弱",
    wealthRooted: "财星有根", hasFood: "命中带食伤", hasOfficer: "命中带官杀",
    isOfficerStrong: "官杀强旺", isOfficerWeak: "官杀气弱", hasSeal: "命中带印星",
    hasBiJie: "命中带比劫", isSealTaboo: "印为忌神", isWealthBreaksSeal: "财星破印",
    isBiJieRobbing: "比劫夺财", isWealthDamaged: "财星受损", isWealthGenOfficer: "财生官",
    isBiJieSamePillar: "比劫坐财", isDyWealthStem: "大运透财", branchHasWealth: "大运支藏财",
    isDaYunTomb: "大运走墓库", isDaYunFood: "大运走食伤", isDaYunOfficer: "大运走官杀",
    isLiuNianClashTomb: "流年冲墓", isLiuNianWealth: "流年透财", isLiuNianWealthStrong: "流年财旺",
    isDaYunWealthCorroborated: "大运干支同财", isDaYunSeal: "大运走印运", isLiuNianSeal: "流年透印",
    // 婚姻相关
    hasSpouseStar: "命中带配偶星", isBranchPresent: "地支有配偶星", isSpouseStarStrong: "配偶星强旺",
    isSpouseStarHidden: "配偶星藏而不现", isPeachDay: "日坐桃花", hasMarriageLuckPrime: "早年走婚运(18-26岁)",
    isDayBranchSpouseStar: "日支为配偶星", isDayBranchUseful: "夫妻宫为喜用", isWealthUseful: "财星为喜用",
    isOfficerUseful: "官杀为喜用", isSealUseful: "印星为喜用", hasShangGuanPeiYin: "伤官配印",
    isPureZheng: "配偶星纯正(无混杂)", isYearExposed: "年干透星", isMonthExposed: "月干透星",
    isStemExposed: "天干透星", isStarInTomb: "配偶星入墓", isPalaceClashed: "夫妻宫逢冲",
    isPalacePunished: "夫妻宫逢刑", hasMixedExposed: "官杀/财才混杂透干", isDayBranchBiJie: "日坐比劫",
    isDayBranchXing: "日支逢刑", isYangRenStrong: "羊刃强旺", isDayBranchSevenKilling: "日坐七杀",
    hasLiuHe: "地支六合", hasAnHe: "地支暗合", hasSanHe: "地支三合", isSpouseStemCombined: "配偶星被合",
    hasPeachSha: "咸池桃花", hasPeachShaMonth: "月柱带桃花", hasPeachShaHour: "时柱带桃花",
    // 学业相关
    hasWealthBranch: "地支有财", hasOfficerBranch: "地支有官", hasSealBranch: "地支有印",
    isWealthSealBranchNotAdjacent: "财印不相邻", hasSealStem: "天干透印", hasOfficialStem: "天干透官",
    hasWealthStem: "天干透财", isWealthSealStemNotAdjacent: "财印不相邻(天干)", isOfficerClashed: "官杀逢冲",
    hasOutputStem: "天干透食伤", hasOutputBranch: "地支有食伤", isDaYunFoodPeiYin: "大运食伤配印",
    isDaYunGuanYin: "大运官印相生", hasSealStemMonthHour: "月时透印"
};

let currentCategory = 'marriage';
let currentPatternId = null;
let localPatterns = [];

document.addEventListener('DOMContentLoaded', () => {
    // Initial Load
    switchCategory('marriage');
});

function switchCategory(cat) {
    currentCategory = cat;
    currentPatternId = null;

    // Update Tab UI
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.includes(getCatName(cat)));
    });

    renderList();
    document.getElementById('editor-container').style.display = 'none';
    document.getElementById('welcome-screen').style.display = 'flex';
}

function getCatName(cat) {
    if (cat === 'marriage') return '婚姻';
    if (cat === 'academic') return '学业';
    if (cat === 'wealth') return '财富';
    return cat;
}

function renderList() {
    const container = document.getElementById('list-container');
    container.innerHTML = '';

    // Extract patterns from BaziEngine global registry
    const allPatterns = window.BaziEngine.PatternEngine.patterns;
    const filtered = allPatterns.filter(p => p.category === currentCategory);

    filtered.forEach(p => {
        const div = document.createElement('div');
        div.className = `pattern-item ${p.id === currentPatternId ? 'active' : ''}`;
        div.onclick = () => selectPattern(p.id);
        div.innerHTML = `
            <div class="id">${p.id}</div>
            <div class="title">${p.title}</div>
        `;
        container.appendChild(div);
    });
}

function selectPattern(id) {
    currentPatternId = id;
    const p = window.BaziEngine.PatternEngine.patterns.find(p => p.id === id);
    if (!p) return;

    renderList(); // Refresh highlighting

    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('editor-container').style.display = 'flex';

    document.getElementById('edit-title-display').innerText = `编辑: ${p.title}`;
    document.getElementById('p-id').value = p.id;
    document.getElementById('p-title').value = p.title;

    // Conditions: Array to CSV string
    const conditionInput = document.getElementById('p-conditions');
    conditionInput.value = Array.isArray(p.conditions) ? p.conditions.join(', ') : 'Function (Not Editable)';

    // Render Helper
    renderConditionHelper();

    document.getElementById('p-narrative').value = p.narrative || p.desc || '';
}

function renderConditionHelper() {
    const helper = document.getElementById('condition-helper');
    if (!helper) return;
    helper.innerHTML = '';

    // Group keys by relevance to category
    Object.keys(FACT_DICTIONARY).forEach(key => {
        const span = document.createElement('span');
        span.className = 'cond-chip';
        span.innerText = `+ ${FACT_DICTIONARY[key]} (${key})`;
        span.onclick = () => addCondition(key);
        helper.appendChild(span);
    });
}

function addCondition(key) {
    const input = document.getElementById('p-conditions');
    if (input.value === 'Function (Not Editable)') return;

    const current = input.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
    if (!current.includes(key)) {
        current.push(key);
        input.value = current.join(', ');
    }
}

function generateCode() {
    const id = document.getElementById('p-id').value;
    const title = document.getElementById('p-title').value;
    const condStr = document.getElementById('p-conditions').value;
    const narrative = document.getElementById('p-narrative').value;

    // Update global object
    const p = window.BaziEngine.PatternEngine.patterns.find(p => p.id === id);
    if (p) {
        p.title = title;
        p.narrative = narrative;
        if (condStr !== 'Function (Not Editable)') {
            p.conditions = condStr.split(',').map(s => s.trim()).filter(s => s.length > 0);
        }
    }

    // Prepare full file content for the current category
    const catPatterns = window.BaziEngine.PatternEngine.patterns.filter(p => p.category === currentCategory);

    let code = `/**\n * ${currentCategory}_patterns.js\n * Auto-generated by Pattern Editor\n */\n\n`;
    code += `(function () {\n    const E = window.BaziEngine || (window.BaziEngine = {});\n\n`;
    code += `    const patterns = [\n`;

    catPatterns.forEach((cp, idx) => {
        const condJson = JSON.stringify(cp.conditions);
        code += `        {\n`;
        code += `            id: "${cp.id}",\n`;
        code += `            title: "${cp.title}",\n`;
        code += `            tags: ${JSON.stringify(cp.tags || [])},\n`;
        code += `            conditions: ${condJson},\n`;
        code += `            path: "${cp.path || ''}",\n`;
        code += `            narrative: \`${cp.narrative || cp.desc || ''}\`\n`;
        code += `        }${idx === catPatterns.length - 1 ? '' : ','}\n`;
    });

    code += `    ];\n\n`;
    code += `    E.PatternEngine.registerPatterns('${currentCategory}', patterns);\n})();\n`;

    // Download / Save
    const blob = new Blob([code], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentCategory}_patterns.js`;
    a.click();

    document.getElementById('save-status').innerHTML = `<span style="color:var(--success)">✅ 已生成 JS 文件！请将其保存/替换到 e:\\SD\\bazi\\sanbanfu\\js\\formulas\\ 目录下。</span>`;
}
