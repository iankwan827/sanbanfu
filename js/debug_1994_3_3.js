
const fs = require('fs');
const path = require('path');

// Mock browser environment
global.window = {};
global.document = {
    createElement: () => ({ setAttribute: () => { }, innerHTML: '', style: {} }),
    querySelectorAll: () => [],
    querySelector: () => null
};
global.navigator = { userAgent: 'node' };

// Load required scripts in order
const scriptPaths = [
    'e:/SD/bazi/sanbanfu/js/decision_engine.js',
    'e:/SD/bazi/sanbanfu/js/bazi_logic.js',
    'e:/SD/bazi/sanbanfu/js/analysis_engine.js',
    'e:/SD/bazi/sanbanfu/js/rules/wealth_tree.js',
    'e:/SD/bazi/sanbanfu/js/rules/marriage_tree.js',
    'e:/SD/bazi/sanbanfu/js/rules/academic_tree.js'
];

scriptPaths.forEach(p => {
    const content = fs.readFileSync(p, 'utf8');
    // Some scripts might use (function(){...})() but DecisionEngine registers itself on window
    eval(content);
});

// Setup input: 1994-03-03 04:00:00 (Male)
const date = new Date('1994-03-03T04:00:00');
const gender = '男';

// Mock Lunar support (since we don't have the full library in node easily, we override the pillars)
// But wait, calculateBazi usually calls Lunar.fromYmdHms
// I will mock Solar and Lunar from lunar-javascript
global.Solar = {
    fromYmdHms: (y, m, d, h, min, s) => ({
        getYear: () => y, getMonth: () => m, getDay: () => d, getHour: () => h,
        getLunar: () => ({
            getEightChar: () => ({
                getYearGan: () => '甲', getYearZhi: () => '戌',
                getMonthGan: () => '丙', getMonthZhi: () => '寅',
                getDayGan: () => '戊', getDayZhi: () => '寅',
                getTimeGan: () => '甲', getTimeZhi: () => '寅',
                getYear: () => '甲戌', getMonth: () => '丙寅', getDay: () => '戊寅', getTime: () => '甲寅',
                getYun: () => ({ getDaYun: () => [] })
            }),
            getYearInGanZhi: () => '甲戌', getMonthInGanZhi: () => '丙寅', getDayInGanZhi: () => '戊寅',
            getMonthInGanZhiExact: () => '丙寅', getDayInGanZhiExact: () => '戊寅',
            getMonthInChinese: () => '正月', getDayInChinese: () => '廿二'
        })
    })
};

const baziData = window.calculateBazi(date, 1);

console.log("=== Bazi Data Pillars ===");
baziData.pillars.slice(0, 4).forEach(p => console.log(`${p.gan}${p.zhi} (${p.tenGod})`));

console.log("\n=== Executing Wealth Analysis ===");
const wealthReport = window.AnalysisEngine.getExpertReport("财", baziData);
console.log("Trace:", JSON.stringify(wealthReport.decisionResult.trace, null, 2));

console.log("\n=== Executing Academic Analysis ===");
const academicReport = window.AnalysisEngine.getExpertReport("学业", baziData);
console.log("Trace:", JSON.stringify(academicReport.decisionResult.trace, null, 2));

console.log("\n=== Checking Wealth Context (simulated) ===");
// Since we found wCtx is private in getExpertReport, we can't easily dump it without changing the file.
// But we can check the profile.
console.log("Body Strength:", baziData.bodyStrength.level);
console.log("Profile:", JSON.stringify(baziData.bodyStrength.profile, null, 2));
