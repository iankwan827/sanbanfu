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

// Load dependencies
loadScript('e:/SD/bazi/sanbanfu/js/biao/sanbanfu2/js/lunar.js');
loadScript('e:/SD/bazi/sanbanfu/js/biao/sanbanfu2/js/bazi_core.js');

const allResults = {};

function diagnose(name, manualGZ, gender) {
    console.log(`\n=== Diagnosing: ${name} ===`);
    const res = context.calculateBazi(null, gender, manualGZ);
    const ctx = res.ctx || res;

    const categories = ['官杀', '印星', '食伤', '比劫', '财星'];
    const results = {
        _contextFlags: {
            isSelfStrong: ctx.isSelfStrong,
            hasWealth: ctx.hasWealth,
            isWealthStrong: ctx.isWealthStrong,
            hasFood: ctx.hasFood,
            isSealTaboo: ctx.isSealTaboo
        }
    };

    categories.forEach(cat => {
        const meta = ctx.getGodMeta(cat);
        results[cat] = {
            isStrong: meta.isStrong,
            exists: meta.exists,
            nodes: meta.nodes.map(n => ({
                name: n.godName,
                strength: n.strength,
                isWang: n.isWang(),
                isRestricted: n.isRestricted,
                isBroken: n.isBroken()
            }))
        };
    });
    allResults[name] = results;
}

// Real 1994 Case (Dropout Risk)
diagnose("1994 Dropout", ['甲', '戌', '壬', '申', '庚', '申', '壬', '午'], "male");

// Real 1987 Case (High Achiever)
diagnose("1987 Master", ['丁', '卯', '壬', '寅', '丁', '亥', '丙', '午'], "male");

// The problematic 1987 Case
diagnose("1987 Sept 19", ['丁', '卯', '己', '酉', '辛', '酉', '甲', '午'], "male");

fs.writeFileSync('e:/SD/bazi/sanbanfu/js/biao/sanbanfu2/js/diagnose_results.json', JSON.stringify(allResults, null, 2));
console.log("\nResults written to diagnose_results.json");
