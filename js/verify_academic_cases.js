const fs = require('fs');
const vm = require('vm');

const contextObj = {
    global: {},
    window: {},
    console: console,
};
contextObj.window = contextObj;
contextObj.global = contextObj;

const context = vm.createContext(contextObj);

function loadScript(path) {
    const code = fs.readFileSync(path, 'utf8');
    vm.runInContext(code, context);
}

contextObj.getCat = function (godName) {
    if (!godName) return '';
    if (godName.indexOf('印') !== -1 || godName.indexOf('枭') !== -1) return '印星';
    if (godName.indexOf('官') !== -1 || godName.indexOf('杀') !== -1) return '官杀';
    if (godName.indexOf('财') !== -1) return '财星';
    if (godName.indexOf('食') !== -1 || godName.indexOf('伤') !== -1) return '食伤';
    if (godName.indexOf('比') !== -1 || godName.indexOf('劫') !== -1) return '比劫';
    return '';
};

// Load dependencies
loadScript('e:/SD/bazi/sanbanfu/js/biao/sanbanfu2/js/lunar.js');
loadScript('e:/SD/bazi/sanbanfu/js/biao/sanbanfu2/js/bazi_core.js');
loadScript('e:/SD/bazi/sanbanfu/js/biao/sanbanfu2/js/analysis_engine.js');
loadScript('e:/SD/bazi/sanbanfu/js/biao/sanbanfu2/js/decision_engine.js');
loadScript('e:/SD/bazi/sanbanfu/js/biao/sanbanfu2/js/rules/academic_tree.js');

contextObj.logDebug = true;

function testCase(name, manualGZ, gender, expectedId) {
    console.log(`\n--- Testing Case: ${name} ---`);
    const res = context.calculateBazi(null, gender, manualGZ);
    const ctx = res.ctx || res;
    console.log(`DEBUG: ctx.gods length: ${ctx.gods ? ctx.gods.length : 'N/A'}`);

    const roots = context.DecisionEngine.Engine.roots;
    console.log("DEBUG: DecisionEngine roots:", Object.keys(roots));
    const rootNode = roots['academic'];
    if (rootNode) {
        console.log(`DEBUG: Root node found, id=${rootNode.id}, hasCond=${!!rootNode.conditionFn}`);
    } else {
        console.log("DEBUG: Root node NOT found for 'academic'");
    }

    const result = context.DecisionEngine.execute('academic', ctx);
    const ids = (result && result.results) ? result.results.map(r => r.id) : [];
    console.log("Result IDs:", JSON.stringify(ids));

    const success = ids.includes(expectedId);
    if (success) {
        console.log(`SUCCESS: Found expected result ID "${expectedId}"`);
    } else {
        console.log(`FAILURE: Expected result ID "${expectedId}" NOT found. Found: ${JSON.stringify(ids)}`);
    }
    return success;
}

// 1. 1994 Case
const success1 = testCase("1994 Dropout", ['甲', '戌', '丙', '寅', '戊', '寅', '甲', '寅'], "male", "res_DropoutRisk");

// 2. 1987 Case
const success2 = testCase("1987 Master", ['丁', '卯', '己', '酉', '庚', '午', '癸', '未'], "female", "res_HighAchieverRebellion");

console.log(`Final Check: success1=${success1}, success2=${success2}`);

if (success1 && success2) {
    console.log("\nALL TESTS PASSED!");
} else {
    console.log("\nSOME TESTS FAILED!");
    process.exit(1);
}
