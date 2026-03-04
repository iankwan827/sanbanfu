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

const solar = context.Solar.fromYmdHms(1987, 9, 12, 6, 0, 0);
const lunar = solar.getLunar();
const eightChar = lunar.getEightChar();

console.log(`Solar: ${solar.toFullString()}`);
console.log(`Year: ${eightChar.getYearGan()}${eightChar.getYearZhi()}`);
console.log(`Month: ${eightChar.getMonthGan()}${eightChar.getMonthZhi()}`);
console.log(`Day: ${eightChar.getDayGan()}${eightChar.getDayZhi()}`);
console.log(`Time: ${eightChar.getTimeGan()}${eightChar.getTimeZhi()}`);

const dm = eightChar.getDayGan();
const mz = eightChar.getMonthZhi();
const dz = eightChar.getDayZhi();

console.log(`\nDM: ${dm}`);
console.log(`Month Branch: ${mz}`);
console.log(`Day Branch: ${dz}`);
