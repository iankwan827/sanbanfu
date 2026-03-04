
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
loadScript('e:/SD/bazi/sanbanfu/js/biao/sanbanfu2/js/analysis_engine.js');
loadScript('e:/SD/bazi/sanbanfu/js/biao/sanbanfu2/js/bazi_core.js');

// 1994-08-27 case
// 1994-08-27 02:00 (Yin hour)
// Pillars: 甲戌 壬申 甲戌 乙丑 (if 2am is Chou?) 
// No, 2am is Chou (01-03).
const dateObj = new Date(1994, 7, 27, 2, 0);
const gender = '1';

const result = calculateBazi(dateObj, gender);
console.log("Date:", result.solarDate);
console.log("Body Strength:", result.bodyStrength.level);
console.log("Yong elements:", JSON.stringify(result.yongXiJi));

const ctx = result.ctx;
console.log("Context Gods Count:", ctx.gods.length);

const categories = ["官杀", "印星", "财星", "食伤", "比劫"];
categories.forEach(cat => {
    const status = ctx.getTraitStatus(cat);
    const meta = ctx.getGodMeta(cat);
    console.log(`Category: ${cat}`);
    console.log(`  - Status: ${status}`);
    console.log(`  - meta.isYong: ${meta.isYong}`);
    console.log(`  - meta.isJi: ${meta.isJi}`);
    console.log(`  - meta.isStrong: ${meta.isStrong}`);

    const nodes = ctx.getGods(cat).filter(n => n.pillarIndex < 4);
    nodes.forEach(n => {
        console.log(`    * [P${n.pillarIndex}${n.isStem ? 'G' : 'Z'}] ${n.godName} isYong=${n.isYong} isJi=${n.isJi} strength=${n.strength} res=${n.isRestricted}`);
    });
});
