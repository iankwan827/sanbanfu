const fs = require('fs');
const vm = require('vm');

const context = {
    global: {},
    window: {},
    console: console,
    setTimeout: setTimeout,
    Promise: Promise
};
context.window = context;
context.global = context;

function loadScript(path) {
    const code = fs.readFileSync(path, 'utf8');
    vm.runInContext(code, vm.createContext(context), { filename: path });
}

// Manual load to share context correctly
const codeDE = fs.readFileSync('e:/SD/bazi/sanbanfu/js/biao/sanbanfu2/js/decision_engine.js', 'utf8');
const codePT = fs.readFileSync('e:/SD/bazi/sanbanfu/js/biao/sanbanfu2/js/rules/personality_tree.js', 'utf8');

const vmContext = vm.createContext(context);
vm.runInContext(codeDE, vmContext);
vm.runInContext(codePT, vmContext);

// Mock a context that triggers multiple results
const mockCtx = {
    hasOfficial: true,
    isOfficerPositive: true,
    hasSeal: true,
    isSealPositive: true,
    hasWealth: true,
    isWealthPositive: true,
    hasOutput: false,
    hasBiJie: false
};

console.log("Simulating Personality Tree with real logic context...");
const result = context.window.DecisionEngine.execute('personality_tree', mockCtx);

console.log("Trace:", result.trace.map(s => s.text).join(' -> '));
console.log("Results count:", result.results.length);
result.results.forEach((r, i) => {
    console.log(`Result ${i + 1}: ${r.title}`);
});
