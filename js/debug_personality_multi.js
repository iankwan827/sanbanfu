const fs = require('fs');
const vm = require('vm');

function loadScript(path) {
    const code = fs.readFileSync(path, 'utf8');
    vm.runInThisContext(code, { filename: path });
}

// Mock environment
global.window = global;
global.document = {
    createElement: () => ({ appendChild: () => { }, head: {} }),
    head: { appendChild: () => { } }
};

loadScript('e:/SD/bazi/sanbanfu/js/biao/sanbanfu2/js/lunar.js');
loadScript('e:/SD/bazi/sanbanfu/js/biao/sanbanfu2/js/year_map.js');
loadScript('e:/SD/bazi/sanbanfu/js/biao/sanbanfu2/js/bazi_core.js');
loadScript('e:/SD/bazi/sanbanfu/js/biao/sanbanfu2/js/decision_engine.js');
loadScript('e:/SD/bazi/sanbanfu/js/biao/sanbanfu2/js/rules/personality_tree.js');

// Mock a context that triggers both Official and Seal results
const mockCtx = {
    hasOfficial: true,
    isOfficerPositive: true,
    hasSeal: true,
    isSealPositive: true,
    hasWealth: false,
    hasOutput: false,
    hasBiJie: false
};

console.log("Simulating Personality Tree with multiple results...");
const result = window.DecisionEngine.execute('personality_tree', mockCtx);

console.log("Trace:", result.trace.map(s => s.text).join(' -> '));
console.log("Results count:", result.results.length);
result.results.forEach((r, i) => {
    console.log(`Result ${i + 1}: ${r.title}`);
});
