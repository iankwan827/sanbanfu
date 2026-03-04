const fs = require('fs');
const vm = require('vm');

function loadScript(path) {
    const code = fs.readFileSync(path, 'utf8');
    vm.runInThisContext(code, { filename: path });
}

// Mock browser environment
global.window = global;
global.document = {
    createElement: () => ({ appendChild: () => { }, head: {} }),
    head: { appendChild: () => { } }
};

// Load dependencies
loadScript('e:/SD/bazi/sanbanfu/js/biao/sanbanfu2/js/lunar.js');
loadScript('e:/SD/bazi/sanbanfu/js/biao/sanbanfu2/js/year_map.js');
loadScript('e:/SD/bazi/sanbanfu/js/biao/sanbanfu2/js/analysis_engine.js');
loadScript('e:/SD/bazi/sanbanfu/js/biao/sanbanfu2/js/bazi_core.js');

// Date with 'Wei' branch (1994-08-27 14:00 gives Xin day, Yi Wei hour)
const dateObj = new Date(1994, 7, 27, 14, 0); // 1994-08-27 14:00
const gender = '1';

const result = calculateBazi(dateObj, gender);
const ctx = result.ctx;

// Run the strength engine
const strengths = window.AnalysisEngine.getPillarStrengthDetails(ctx);

// Find the Hour Branch
const hourBranch = strengths.find(s => s.label === '时支');
console.log("=== Hour Branch ('时支') ===");
console.log(`Branch Node: ${hourBranch.char} (Status: ${hourBranch.status}, Reason: ${hourBranch.reasons.join(', ')})`);

hourBranch.gods.forEach(g => {
    console.log(`  - [${g.type}] ${g.god} [${g.char}]: ${g.status} (${g.reason})`);
});
