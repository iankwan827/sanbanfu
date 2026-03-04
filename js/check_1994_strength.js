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

const manualGZ = ['甲', '戌', '丙', '寅', '戊', '辰', '甲', '寅'];
const baziData = {
    pillars: [
        { gan: '甲', zhi: '戌' },
        { gan: '丙', zhi: '寅' },
        { gan: '戊', zhi: '辰' },
        { gan: '甲', zhi: '寅' }
    ],
    gender: '男'
};

const processedPillars = context.calculateBazi(null, '男', manualGZ).pillars;
const ctx = context.BaziProcessor.createContext({ pillars: processedPillars });
const bs = context.AnalysisEngine.calculateOOBodyStrength(ctx);

console.log("\n--- Strength Calculation for 1994 ---");
console.log(`DM: 戊 (土)`);
console.log(`Score: ${bs.score.toFixed(1)} / ${bs.max}`);
console.log(`Percentage: ${bs.percentage}%`);
console.log(`Level: ${bs.level}`);
console.log(`Status: ${bs.status}`);
console.log("Logs:");
bs.logs.forEach(l => console.log(`  - ${l}`));

console.log("\nElement Profile:");
bs.profile.forEach(p => {
    console.log(`  ${p.element} (${p.tenGod}): ${p.score}`);
});
