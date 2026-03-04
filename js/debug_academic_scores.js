const fs = require('fs');
const vm = require('vm');

const context = vm.createContext({
    global: {}, window: {}, console: console,
});
context.window = context;

function load(p) { eval(fs.readFileSync(p, 'utf8')); }
load('e:/SD/bazi/sanbanfu/js/biao/sanbanfu2/js/lunar.js');
load('e:/SD/bazi/sanbanfu/js/biao/sanbanfu2/js/bazi_core.js');
load('e:/SD/bazi/sanbanfu/js/biao/sanbanfu2/js/analysis_engine.js');
load('e:/SD/bazi/sanbanfu/js/biao/sanbanfu2/js/decision_engine.js');
load('e:/SD/bazi/sanbanfu/js/biao/sanbanfu2/js/rules/academic_tree.js');

function test(name, gz) {
    console.log(`\n=== ${name} ===`);
    const res = context.calculateBazi(new Date(), '男', gz);
    if (!res || !res.ctx) { console.log("Error: Bazi calculation failed"); return; }
    const ctx = res.ctx;

    console.log("Gods Info:");
    ctx.gods.forEach((g, i) => {
        if (g.pillarIndex >= 4) return;
        console.log(`  ${i}: ${g.char} (P${g.pillarIndex} ${g.isStem ? 'S' : 'B'}) God: ${g.godName}, Cat: ${g.category}, Sec: ${g.isSecondary}`);
    });

    context.window.logDebug = true;
    const dec = context.DecisionEngine.execute('academic', ctx);
    console.log("Result:", dec.results.map(r => r.title));
}

// 1994 Case
test("1994 Dropout", ['甲', '戌', '丙', '寅', '戊', '寅', '甲', '寅']);
// 1987 Case
test("1987 Master", ['丁', '卯', '己', '酉', '庚', '午', '癸', '未']);
