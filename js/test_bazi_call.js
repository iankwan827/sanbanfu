const fs = require('fs');
const vm = require('vm');

const contextObj = {
    global: {},
    window: {},
    console: console,
};
contextObj.window = contextObj;
const context = vm.createContext(contextObj);

function loadScript(path) {
    const code = fs.readFileSync(path, 'utf8');
    vm.runInContext(code, context);
}

try {
    loadScript('e:/SD/bazi/sanbanfu/js/biao/sanbanfu2/js/lunar.js');
    loadScript('e:/SD/bazi/sanbanfu/js/biao/sanbanfu2/js/bazi_core.js');

    console.log("Calling calculateBazi...");
    const res = context.calculateBazi(null, "male", ['甲', '戌', '丙', '寅', '戊', '寅', '甲', '寅']);
    console.log("Result type:", typeof res);
    if (res) {
        console.log("Result keys:", Object.keys(res));
        console.log("ctx gods length:", res.ctx && res.ctx.gods ? res.ctx.gods.length : 'N/A');
    } else {
        console.log("Result is NULL");
    }
} catch (e) {
    console.error("CRASH:", e);
}
