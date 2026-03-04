const fs = require('fs');
const vm = require('vm');

function loadScript(path) {
    const code = fs.readFileSync(path, 'utf8');
    vm.runInThisContext(code, { filename: path });
}

// Mock environment
global.window = global;

loadScript('e:/SD/bazi/sanbanfu/js/biao/sanbanfu2/js/decision_engine.js');

const { createNode, createResult, Engine } = window.DecisionEngine;

// Create a simple chained tree: Result1 -> Condition -> Result2
const res1 = createResult('res1', 'Conclusion 1');
const res2 = createResult('res2', 'Conclusion 2');
const cond = createNode('cond', 'Check something').setCondition(ctx => ctx.ok).yes(res2);

const root = createNode('root', 'Root Step').setCondition(() => true).yes(res1);
res1.yes(cond);

window.DecisionEngine.registerTree('test_tree', root);

console.log("Executing test tree with ok=true...");
const result = window.DecisionEngine.execute('test_tree', { ok: true });

console.log("Trace:", result.trace.map(s => s.text).join(' -> '));
console.log("Results count:", result.results.length);
result.results.forEach((r, i) => {
    console.log(`Result ${i + 1}: ${r.title}`);
});
