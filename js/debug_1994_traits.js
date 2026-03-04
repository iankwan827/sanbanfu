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

const baziData = window.calculateBazi(new Date(1994, 7, 27, 14, 0), '1');
const ctx = baziData.ctx;

console.log("Date: 1994-08-27 14:00");
console.log("Body Strength:", ctx.dayMaster.strength);
console.log("hasOfficial:", ctx.hasOfficial);
console.log("isOfficerPositive:", ctx.isOfficerPositive);
console.log("isOfficerNegative:", ctx.isOfficerNegative);
console.log("hasSeal:", ctx.hasSeal);
console.log("isSealPositive:", ctx.isSealPositive);
console.log("isSealNegative:", ctx.isSealNegative);
console.log("hasWealth:", ctx.hasWealth);
console.log("isWealthPositive:", ctx.isWealthPositive);
console.log("hasOutput:", ctx.hasOutput);
console.log("hasBiJie:", ctx.hasBiJie);

const outputNodes = ctx.getGods('食伤');
console.log("Output Nodes count:", outputNodes.length);
outputNodes.forEach(n => console.log(`  - ${n.char} (${n.isStem ? 'Stem' : 'Branch'}) Pillar: ${n.pillarIndex}`));
