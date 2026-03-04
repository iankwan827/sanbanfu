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

// Load core and lunar
loadScript('e:/SD/bazi/sanbanfu/js/biao/sanbanfu2/js/lunar.js');
loadScript('e:/SD/bazi/sanbanfu/js/biao/sanbanfu2/js/bazi_core.js');

const solar = context.Solar.fromYmdHms(1987, 9, 19, 14, 0, 0);
const lunar = solar.getLunar();
const eightChar = lunar.getEightChar();

console.log(`Solar: ${solar.toFullString()}`);
const pillars_str = [
    eightChar.getYearGan() + eightChar.getYearZhi(),
    eightChar.getMonthGan() + eightChar.getMonthZhi(),
    eightChar.getDayGan() + eightChar.getDayZhi(),
    eightChar.getTimeGan() + eightChar.getTimeZhi()
];
console.log(`Bazi: ${pillars_str.join(' ')}`);

const dm = eightChar.getDayGan();
console.log(`DM: ${dm}`);

// Mock calculation to see ten gods
const manualGZ = [eightChar.getYearGan(), eightChar.getYearZhi(), eightChar.getMonthGan(), eightChar.getMonthZhi(), eightChar.getDayGan(), eightChar.getDayZhi(), eightChar.getTimeGan(), eightChar.getTimeZhi()];
const res = context.calculateBazi(null, '女', manualGZ);

console.log("\nTen Gods (Natal):");
res.pillars.slice(0, 4).forEach((p, i) => {
    console.log(`${['年', '月', '日', '时'][i]}柱: ${p.gan}${p.zhi} -> 干: ${p.tenGod}, 支本气: ${p.hidden[0].god}`);
});
