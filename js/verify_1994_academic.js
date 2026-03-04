const fs = require('fs');
const vm = require('vm');

const context = {
    global: {},
    window: {},
    console: console,
};
context.window = context;

function loadScript(path) {
    const code = fs.readFileSync(path, 'utf8');
    vm.runInContext(code, vm.createContext(context));
}

// Load dependencies
loadScript('e:/SD/bazi/sanbanfu/js/biao/sanbanfu2/js/lunar.js');
loadScript('e:/SD/bazi/sanbanfu/js/biao/sanbanfu2/js/bazi_core.js');
loadScript('e:/SD/bazi/sanbanfu/js/biao/sanbanfu2/js/analysis_engine.js');
loadScript('e:/SD/bazi/sanbanfu/js/biao/sanbanfu2/js/decision_engine.js');
loadScript('e:/SD/bazi/sanbanfu/js/biao/sanbanfu2/js/rules/academic_tree.js');

const manualGZ = ['甲', '戌', '丙', '寅', '戊', '辰', '甲', '寅'];
const baziRes = context.calculateBazi(null, '男', manualGZ);
const ctx = baziRes.ctx;

console.log("\n--- Debugging 1994 Nodes ---");
const killing = ctx.getGodMeta('官杀');
const seal = ctx.getGodMeta('印星');

console.log("Killing Nodes:");
killing.nodes.forEach(n => console.log(`  - ${n.char} (${n.isStem ? 'Stem' : 'Branch'}, Index: ${n.pillarIndex}, God: ${n.godName})`));

console.log("Seal Nodes:");
seal.nodes.forEach(n => console.log(`  - ${n.char} (${n.isStem ? 'Stem' : 'Branch'}, Index: ${n.pillarIndex}, God: ${n.godName})`));

const weights = { 0: 10, 1: 10, 2: 10, 3: 45, 4: 10, 5: 20, 6: 10, 7: 15 };
const killScore = killing.nodes.reduce((sum, n) => {
    const w = n.isStem ? 10 : weights[n.pillarIndex * 2 + 1];
    return sum + w;
}, 0);
const sealScore = seal.nodes.reduce((sum, n) => {
    const w = n.isStem ? 10 : weights[n.pillarIndex * 2 + 1];
    return sum + w;
}, 0);

console.log(`\nCorrected Kill Score: ${killScore}`);
console.log(`Corrected Seal Score: ${sealScore}`);
console.log(`Ratio: ${(sealScore / killScore).toFixed(3)}`);

const result = context.DecisionEngine.execute('academic', ctx);
console.log("\nFinal Result: " + result.results.map(r => r.title).join(', '));
if (result.results.some(r => r.title.includes('辍学'))) {
    console.log("SUCCESS");
} else {
    console.log("FAILURE");
}
