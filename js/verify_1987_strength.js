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

// 1987-09-12 06:00 (丁卯, 己酉, 甲子, 丁卯)
const manualGZ = ['丁', '卯', '己', '酉', '甲', '子', '丁', '卯'];

// To get the 'processed' pillars like calculateBazi does, we can actually just call calculateBazi
// But calculateBazi calls AnalysisEngine.calculateOOBodyStrength INTERNALLY.
// We can capture the context by mocking calculateOOBodyStrength temporarily!

let capturedCtx = null;
const originalCalc = context.AnalysisEngine.calculateOOBodyStrength;
context.AnalysisEngine.calculateOOBodyStrength = function (ctx) {
    capturedCtx = ctx;
    return originalCalc.call(context.AnalysisEngine, ctx);
};

// This will trigger the calculation and capture the context
context.calculateBazi(null, '男', manualGZ);

if (!capturedCtx) {
    console.error("Failed to capture context from calculateBazi");
    process.exit(1);
}

const result = context.AnalysisEngine.calculateOOBodyStrength(capturedCtx);

console.log("\n--- Strength Calculation Result ---");
const monthZhiNode = capturedCtx.getGodByIndex(3);
const dayZhiNode = capturedCtx.getGodByIndex(5);

console.log(`DM: ${capturedCtx.dayMasterNode.char} (${capturedCtx.dayMasterNode.wx}) -> ${capturedCtx.dayMasterNode.godName}`);
console.log(`Month Branch: ${monthZhiNode.char} (${monthZhiNode.godName}) [Category: ${monthZhiNode.category}]`);
console.log(`Day Branch: ${dayZhiNode.char} (${dayZhiNode.godName}) [Category: ${dayZhiNode.category}]`);

console.log(`\nScore: ${result.score.toFixed(1)} / ${result.max}`);
console.log(`Percentage: ${result.percentage}%`);
console.log(`Level: ${result.level}`);
console.log(`Is GuanYin: ${result.isGuanYin}`);

console.log("\nLogs:");
result.logs.forEach(l => console.log(`  - ${l}`));

console.log("\nElement Profile:");
result.profile.forEach(p => {
    console.log(`  ${p.element} (${p.tenGod}): ${p.score}`);
});

if (result.isGuanYin) {
    console.log("\nSuccess: Official-Seal Interaction triggered!");
} else {
    console.log("\nFailure: Official-Seal Interaction NOT triggered.");
    process.exit(1);
}
