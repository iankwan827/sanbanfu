// === Year Map (for Date searching) ===
var YEAR_MAP = {
    "庚子": [1900, 1960, 2020, 2080], "辛丑": [1901, 1961, 2021, 2081], "壬寅": [1902, 1962, 2022, 2082], "癸卯": [1903, 1963, 2023, 2083], "甲辰": [1904, 1964, 2024, 2084], "乙巳": [1905, 1965, 2025, 2085], "丙午": [1906, 1966, 2026, 2086], "丁未": [1907, 1967, 2027, 2087], "戊申": [1908, 1968, 2028, 2088], "己酉": [1909, 1969, 2029, 2089], "庚戌": [1910, 1970, 2030, 2090], "辛亥": [1911, 1971, 2031, 2091], "壬子": [1912, 1972, 2032, 2092], "癸丑": [1913, 1973, 2033, 2093], "甲寅": [1914, 1974, 2034, 2094], "乙卯": [1915, 1975, 2035, 2095], "丙辰": [1916, 1976, 2036, 2096], "丁巳": [1917, 1977, 2037, 2097], "戊午": [1918, 1978, 2038, 2098], "己未": [1919, 1979, 2039, 2099], "庚申": [1920, 1980, 2040, 2100], "辛酉": [1921, 1981, 2041], "壬戌": [1922, 1982, 2042], "癸亥": [1923, 1983, 2043], "甲子": [1924, 1984, 2044], "乙丑": [1925, 1985, 2045], "丙寅": [1926, 1986, 2046], "丁卯": [1927, 1987, 2047], "戊辰": [1928, 1988, 2048], "己巳": [1929, 1989, 2049], "庚午": [1930, 1990, 2050], "辛未": [1931, 1991, 2051], "壬申": [1932, 1992, 2052], "癸酉": [1933, 1993, 2053], "甲戌": [1934, 1994, 2054], "乙亥": [1935, 1995, 2055], "丙子": [1936, 1996, 2056], "丁丑": [1937, 1997, 2057], "戊寅": [1938, 1998, 2058], "己卯": [1939, 1999, 2059], "庚辰": [1940, 2000, 2060], "辛巳": [1941, 2001, 2061], "壬午": [1942, 2002, 2062], "癸未": [1943, 2003, 2063], "甲申": [1944, 2004, 2064], "乙酉": [1945, 2005, 2065], "丙戌": [1946, 2006, 2066], "丁亥": [1947, 2007, 2067], "戊子": [1948, 2008, 2068], "己丑": [1949, 2009, 2069], "庚寅": [1950, 2010, 2070], "辛卯": [1951, 2011, 2071], "壬辰": [1952, 2012, 2072], "癸巳": [1953, 2013, 2073], "甲午": [1954, 2014, 2074], "乙未": [1955, 2015, 2075], "丙申": [1956, 2016, 2076], "丁酉": [1957, 2017, 2077], "戊戌": [1958, 2018, 2078], "己亥": [1959, 2019, 2079]
};

// === Constants ===
var GAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
var ZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

var GAN_WX = {
    '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
    '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水'
};

var ZHI_WX = {
    '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火',
    '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水'
};

var HIDDEN_STEMS_MAP = {
    '子': ['癸'],
    '丑': ['己', '癸', '辛'],
    '寅': ['甲', '丙', '戊'],
    '卯': ['乙'],
    '辰': ['戊', '乙', '癸'],
    '巳': ['丙', '庚', '戊'],
    '午': ['丁', '己'],
    '未': ['己', '丁', '乙'],
    '申': ['庚', '壬', '戊'],
    '酉': ['辛'],
    '戌': ['戊', '辛', '丁'],
    '亥': ['壬', '甲']
};

var NAYIN = {
    '甲子': '海中金', '乙丑': '海中金', '丙寅': '炉中火', '丁卯': '炉中火',
    '戊辰': '大林木', '己巳': '大林木', '庚午': '路旁土', '辛未': '路旁土',
    '壬申': '剑锋金', '癸酉': '剑锋金', '甲戌': '山头火', '乙亥': '山头火',
    '丙子': '涧下水', '丁丑': '涧下水', '戊寅': '城头土', '己卯': '城头土',
    '庚辰': '白蜡金', '辛巳': '白蜡金', '壬午': '杨柳木', '癸未': '杨柳木',
    '甲申': '泉中水', '乙酉': '泉中水', '丙戌': '屋上土', '丁亥': '屋上土',
    '戊子': '霹雳火', '己丑': '霹雳火', '庚寅': '松柏木', '辛卯': '松柏木',
    '壬辰': '长流水', '癸巳': '长流水', '甲午': '砂中金', '乙未': '砂中金',
    '丙申': '山下火', '丁酉': '山下火', '戊戌': '平地木', '己亥': '平地木',
    '庚子': '壁上土', '辛丑': '壁上土', '壬寅': '金箔金', '癸卯': '金箔金',
    '甲辰': '覆灯火', '乙巳': '覆灯火', '丙午': '天河水', '丁未': '天河水',
    '戊申': '大驿土', '己酉': '大驿土', '庚戌': '钗钏金', '辛亥': '钗钏金',
    '壬子': '桑柘木', '癸丑': '桑柘木', '甲寅': '大溪水', '乙卯': '大溪水',
    '丙辰': '沙中土', '丁巳': '沙中土', '戊午': '天上火', '己未': '天上火',
    '庚申': '石榴木', '辛酉': '石榴木', '壬戌': '大海水', '癸亥': '大海水'
};

var CHANG_SHENG = {
    '木': { '亥': '长生', '子': '沐浴', '丑': '冠带', '寅': '临官', '卯': '帝旺', '辰': '衰', '巳': '病', '午': '死', '未': '库', '申': '绝', '酉': '胎', '戌': '养' },
    '火': { '寅': '长生', '卯': '沐浴', '辰': '冠带', '巳': '临官', '午': '帝旺', '未': '衰', '申': '病', '酉': '死', '戌': '库', '亥': '绝', '子': '胎', '丑': '养' },
    '土': { '寅': '长生', '卯': '沐浴', '辰': '冠带', '巳': '临官', '午': '帝旺', '未': '衰', '申': '病', '酉': '死', '戌': '库', '亥': '绝', '子': '胎', '丑': '养' },
    '金': { '巳': '长生', '午': '沐浴', '未': '冠带', '申': '临官', '酉': '帝旺', '戌': '衰', '亥': '病', '子': '死', '丑': '库', '寅': '绝', '卯': '胎', '辰': '养' },
    '水': { '申': '长生', '酉': '沐浴', '戌': '冠带', '亥': '临官', '子': '帝旺', '丑': '衰', '寅': '病', '卯': '死', '辰': '库', '巳': '绝', '午': '胎', '未': '养' }
};

var WANG_XIANG = {
    "木": { "旺": "木", "相": "火", "休": "水", "囚": "金", "死": "土" },
    "火": { "旺": "火", "相": "土", "休": "木", "囚": "水", "死": "金" },
    "金": { "旺": "金", "相": "水", "休": "土", "囚": "火", "死": "木" },
    "水": { "旺": "水", "相": "木", "休": "金", "囚": "土", "死": "火" },
    "土": { "旺": "土", "相": "金", "休": "火", "囚": "木", "死": "水" }
};

var TEN_GODS = {
    '甲甲': ['比肩', '比'], '甲乙': ['劫财', '劫'], '甲丙': ['食神', '食'], '甲丁': ['伤官', '伤'],
    '甲戊': ['偏财', '财'], '甲己': ['正财', '财'], '甲庚': ['七杀', '杀'], '甲辛': ['正官', '官'],
    '甲壬': ['偏印', '枭'], '甲癸': ['正印', '印'],
    '乙甲': ['劫财', '劫'], '乙乙': ['比肩', '比'], '乙丙': ['伤官', '伤'], '乙丁': ['食神', '食'],
    '乙戊': ['正财', '财'], '乙己': ['偏财', '财'], '乙庚': ['正官', '官'], '乙辛': ['七杀', '杀'],
    '乙壬': ['正印', '印'], '乙癸': ['偏印', '枭'],
    '丙甲': ['偏印', '枭'], '丙乙': ['正印', '印'], '丙丙': ['比肩', '比'], '丙丁': ['劫财', '劫'],
    '丙戊': ['食神', '食'], '丙己': ['伤官', '伤'], '丙庚': ['偏财', '财'], '丙辛': ['正财', '财'],
    '丙壬': ['七杀', '杀'], '丙癸': ['正官', '官'],
    '丁甲': ['正印', '印'], '丁乙': ['偏印', '枭'], '丁丙': ['劫财', '劫'], '丁丁': ['比肩', '比'],
    '丁戊': ['伤官', '伤'], '丁己': ['食神', '食'], '丁庚': ['正财', '财'], '丁辛': ['偏财', '财'],
    '丁壬': ['正官', '官'], '丁癸': ['七杀', '杀'],
    '戊甲': ['七杀', '杀'], '戊乙': ['正官', '官'], '戊丙': ['偏印', '枭'], '戊丁': ['正印', '印'],
    '戊戊': ['比肩', '比'], '戊己': ['劫财', '劫'], '戊庚': ['食神', '食'], '戊辛': ['伤官', '伤'],
    '戊壬': ['偏财', '财'], '戊癸': ['正财', '财'],
    '己甲': ['正官', '官'], '己乙': ['七杀', '杀'], '己丙': ['正印', '印'], '己丁': ['偏印', '枭'],
    '己戊': ['劫财', '劫'], '己己': ['比肩', '比'], '己庚': ['伤官', '伤'], '己辛': ['食神', '食'],
    '己壬': ['正财', '财'], '己癸': ['偏财', '财'],
    '庚甲': ['偏财', '财'], '庚乙': ['正财', '财'], '庚丙': ['七杀', '杀'], '庚丁': ['正官', '官'],
    '庚戊': ['偏印', '枭'], '庚己': ['正印', '印'], '庚庚': ['比肩', '比'], '庚辛': ['劫财', '劫'],
    '庚壬': ['食神', '食'], '庚癸': ['伤官', '伤'],
    '辛甲': ['正财', '财'], '辛乙': ['偏财', '财'], '辛丙': ['正官', '官'], '辛丁': ['七杀', '杀'],
    '辛戊': ['正印', '印'], '辛己': ['偏印', '枭'], '辛庚': ['劫财', '劫'], '辛辛': ['比肩', '比'],
    '辛壬': ['伤官', '伤'], '辛癸': ['食神', '食'],
    '壬甲': ['食神', '食'], '壬乙': ['伤官', '伤'], '壬丙': ['偏财', '财'], '壬丁': ['正财', '财'],
    '壬戊': ['七杀', '杀'], '壬己': ['正官', '官'], '壬庚': ['偏印', '枭'], '壬辛': ['正印', '印'],
    '壬壬': ['比肩', '比'], '壬癸': ['劫财', '劫'],
    '癸甲': ['伤官', '伤'], '癸乙': ['食神', '食'], '癸丙': ['正财', '财'], '癸丁': ['偏财', '财'],
    '癸戊': ['正官', '官'], '癸己': ['七杀', '杀'], '癸庚': ['正印', '印'], '癸辛': ['偏印', '枭'],
    '癸壬': ['劫财', '劫'], '癸癸': ['比肩', '比']
};

var CRASH_MAP = {
    '子': '午', '午': '子', '丑': '未', '未': '丑',
    '寅': '申', '申': '寅', '卯': '酉', '酉': '卯',
    '辰': '戌', '戌': '辰', '巳': '亥', '亥': '巳'
};

var GAN_HE = {
    '甲己': '土', '己甲': '土', '乙庚': '金', '庚乙': '金',
    '丙辛': '水', '辛丙': '水', '丁壬': '木', '壬丁': '木',
    '戊癸': '火', '癸戊': '火'
};

/**
 * 辅助：根据十神名归类 (官/杀 -> 官杀)
 */
function getCat(god) {
    if (!god) return null;
    const s = String(god);
    if (s.includes('官') || s.includes('杀')) return '官杀';
    if (s.includes('食') || s.includes('伤')) return '食伤';
    if (s.includes('比') || s.includes('劫')) return '比劫';
    if (s.includes('印') || s.includes('枭')) return '印星';
    if (s.includes('财') || s.includes('才')) return '财星';
    return null;
}

var GAN_HE_HE = {
    '甲': '己', '己': '甲', '乙': '庚', '庚': '乙',
    '丙': '辛', '辛': '丙', '丁': '壬', '壬': '丁',
    '戊': '癸', '癸': '戊'
};

var WX_RELATION = {
    '木': { '木': '同', '火': '生', '土': '克', '金': '被克', '水': '被生' },
    '火': { '火': '同', '土': '生', '金': '克', '水': '被克', '木': '被生' },
    '土': { '土': '同', '金': '生', '水': '克', '木': '被克', '火': '被生' },
    '金': { '金': '同', '水': '生', '木': '克', '火': '被克', '土': '被生' },
    '水': { '水': '同', '木': '生', '火': '克', '土': '被克', '金': '被生' }
};

// === Rules (Expanded Shen Sha) ===
var SHEN_SHA_RULES = {
    // 1. Noble Stars
    '天乙贵人': (info) =>
        (['甲', '戊', '庚'].includes(info.yearGan) && ['丑', '未'].includes(info.zhi)) ||
        (['甲', '戊', '庚'].includes(info.dayGan) && ['丑', '未'].includes(info.zhi)) ||
        (['乙', '己'].includes(info.yearGan) && ['子', '申'].includes(info.zhi)) ||
        (['乙', '己'].includes(info.dayGan) && ['子', '申'].includes(info.zhi)) ||
        (['丙', '丁'].includes(info.yearGan) && ['亥', '酉'].includes(info.zhi)) ||
        (['丙', '丁'].includes(info.dayGan) && ['亥', '酉'].includes(info.zhi)) ||
        (['壬', '癸'].includes(info.yearGan) && ['卯', '巳'].includes(info.zhi)) ||
        (['壬', '癸'].includes(info.dayGan) && ['卯', '巳'].includes(info.zhi)) ||
        (info.yearGan === '辛' && ['寅', '午'].includes(info.zhi)) ||
        (info.dayGan === '辛' && ['寅', '午'].includes(info.zhi)),

    '天德贵人': (info) =>
        (info.monthZhi === '寅' && info.stem === '丁') ||
        (info.monthZhi === '卯' && info.zhi === '申') ||
        (info.monthZhi === '辰' && info.stem === '壬') ||
        (info.monthZhi === '巳' && info.stem === '辛') ||
        (info.monthZhi === '午' && info.zhi === '亥') ||
        (info.monthZhi === '未' && info.stem === '甲') ||
        (info.monthZhi === '申' && info.stem === '癸') ||
        (info.monthZhi === '酉' && info.zhi === '寅') ||
        (info.monthZhi === '戌' && info.stem === '丙') ||
        (info.monthZhi === '亥' && info.stem === '乙') ||
        (info.monthZhi === '子' && info.zhi === '巳') ||
        (info.monthZhi === '丑' && info.stem === '庚'),

    '月德贵人': (info) =>
        (['寅', '午', '戌'].includes(info.monthZhi) && info.stem === '丙') ||
        (['申', '子', '辰'].includes(info.monthZhi) && info.stem === '壬') ||
        (['亥', '卯', '未'].includes(info.monthZhi) && info.stem === '甲') ||
        (['巳', '酉', '丑'].includes(info.monthZhi) && info.stem === '庚'),

    '太极贵人': (info) =>
        (['甲', '乙'].includes(info.dayGan) && ['子', '午'].includes(info.zhi)) ||
        (['甲', '乙'].includes(info.yearGan) && ['子', '午'].includes(info.zhi)) ||
        (['丙', '丁'].includes(info.dayGan) && ['酉', '卯'].includes(info.zhi)) ||
        (['丙', '丁'].includes(info.yearGan) && ['酉', '卯'].includes(info.zhi)) ||
        (['戊', '己'].includes(info.dayGan) && ['辰', '戌', '丑', '未'].includes(info.zhi)) ||
        (['戊', '己'].includes(info.yearGan) && ['辰', '戌', '丑', '未'].includes(info.zhi)) ||
        (['庚', '辛'].includes(info.dayGan) && ['寅', '亥'].includes(info.zhi)) ||
        (['庚', '辛'].includes(info.yearGan) && ['寅', '亥'].includes(info.zhi)) ||
        (['壬', '癸'].includes(info.dayGan) && ['巳', '申'].includes(info.zhi)) ||
        (['壬', '癸'].includes(info.yearGan) && ['巳', '申'].includes(info.zhi)),

    '福星贵人': (info) =>
        (info.dayGan === '甲' && ['寅', '子'].includes(info.zhi)) ||
        (info.yearGan === '甲' && ['寅', '子'].includes(info.zhi)) ||
        (info.dayGan === '乙' && ['丑', '卯'].includes(info.zhi)) ||
        (info.yearGan === '乙' && ['丑', '卯'].includes(info.zhi)) ||
        (info.dayGan === '丙' && info.zhi === '子') ||
        (info.yearGan === '丙' && info.zhi === '子') ||
        (info.dayGan === '丁' && info.zhi === '酉') ||
        (info.yearGan === '丁' && info.zhi === '酉') ||
        (info.dayGan === '戊' && info.zhi === '申') ||
        (info.yearGan === '戊' && info.zhi === '申') ||
        (info.dayGan === '己' && info.zhi === '未') ||
        (info.yearGan === '己' && info.zhi === '未') ||
        (info.dayGan === '庚' && ['午', '巳'].includes(info.zhi)) ||
        (info.yearGan === '庚' && ['午', '巳'].includes(info.zhi)) ||
        (info.dayGan === '辛' && info.zhi === '巳') ||
        (info.yearGan === '辛' && info.zhi === '巳') ||
        (info.dayGan === '壬' && info.zhi === '辰') ||
        (info.yearGan === '壬' && info.zhi === '辰') ||
        (info.dayGan === '癸' && ['卯', '丑'].includes(info.zhi)) ||
        (info.yearGan === '癸' && ['卯', '丑'].includes(info.zhi)),

    // 2. Academic
    '文昌贵人': (info) =>
        (info.dayGan === '甲' && info.zhi === '巳') ||
        (info.dayGan === '乙' && info.zhi === '午') ||
        (['丙', '戊'].includes(info.dayGan) && info.zhi === '申') ||
        (['丁', '己'].includes(info.dayGan) && info.zhi === '酉') ||
        (info.dayGan === '庚' && info.zhi === '亥') ||
        (info.dayGan === '辛' && info.zhi === '子') ||
        (info.dayGan === '壬' && info.zhi === '寅') ||
        (info.dayGan === '癸' && info.zhi === '卯') ||
        (info.yearGan === '甲' && info.zhi === '巳') ||
        (info.yearGan === '乙' && info.zhi === '午') ||
        (['丙', '戊'].includes(info.yearGan) && info.zhi === '申') ||
        (['丁', '己'].includes(info.yearGan) && info.zhi === '酉') ||
        (info.yearGan === '庚' && info.zhi === '亥') ||
        (info.yearGan === '辛' && info.zhi === '子') ||
        (info.yearGan === '壬' && info.zhi === '寅') ||
        (info.yearGan === '癸' && info.zhi === '卯'),

    '学堂': (info) =>
        (info.yearNaYin && info.yearNaYin.includes('金') && info.zhi === '巳') ||
        (info.yearNaYin && info.yearNaYin.includes('木') && info.zhi === '亥') ||
        (info.yearNaYin && info.yearNaYin.includes('水') && info.zhi === '申') ||
        (info.yearNaYin && info.yearNaYin.includes('火') && info.zhi === '寅') ||
        (info.yearNaYin && info.yearNaYin.includes('土') && info.zhi === '申'),

    '词馆': (info) =>
        (info.yearNaYin && info.yearNaYin.includes('金') && info.zhi === '申') ||
        (info.yearNaYin && info.yearNaYin.includes('木') && info.zhi === '寅') ||
        (info.yearNaYin && info.yearNaYin.includes('水') && info.zhi === '亥') ||
        (info.yearNaYin && info.yearNaYin.includes('火') && info.zhi === '巳') ||
        (info.yearNaYin && info.yearNaYin.includes('土') && info.zhi === '寅'),

    // 3. Wealth/Career
    '禄神': (info) =>
        (info.dayGan === '甲' && info.zhi === '寅') ||
        (info.dayGan === '乙' && info.zhi === '卯') ||
        (['丙', '戊'].includes(info.dayGan) && info.zhi === '巳') ||
        (['丁', '己'].includes(info.dayGan) && info.zhi === '午') ||
        (info.dayGan === '庚' && info.zhi === '申') ||
        (info.dayGan === '辛' && info.zhi === '酉') ||
        (info.dayGan === '壬' && info.zhi === '亥') ||
        (info.dayGan === '癸' && info.zhi === '子') ||
        (info.yearGan === '甲' && info.zhi === '寅') ||
        (info.yearGan === '乙' && info.zhi === '卯') ||
        (['丙', '戊'].includes(info.yearGan) && info.zhi === '巳') ||
        (['丁', '己'].includes(info.yearGan) && info.zhi === '午') ||
        (info.yearGan === '庚' && info.zhi === '申') ||
        (info.yearGan === '辛' && info.zhi === '酉') ||
        (info.yearGan === '壬' && info.zhi === '亥') ||
        (info.yearGan === '癸' && info.zhi === '子'),

    '金舆': (info) =>
        (info.dayGan === '甲' && info.zhi === '辰') ||
        (info.dayGan === '乙' && info.zhi === '巳') ||
        (['丙', '戊'].includes(info.dayGan) && info.zhi === '未') ||
        (['丁', '己'].includes(info.dayGan) && info.zhi === '申') ||
        (info.dayGan === '庚' && info.zhi === '戌') ||
        (info.dayGan === '辛' && info.zhi === '亥') ||
        (info.dayGan === '壬' && info.zhi === '丑') ||
        (info.dayGan === '癸' && info.zhi === '寅'),

    '驿马': (info) =>
        (['申', '子', '辰'].includes(info.yearZhi) && info.zhi === '寅') ||
        (['申', '子', '辰'].includes(info.dayZhi) && info.zhi === '寅') ||
        (['寅', '午', '戌'].includes(info.yearZhi) && info.zhi === '申') ||
        (['寅', '午', '戌'].includes(info.dayZhi) && info.zhi === '申') ||
        (['亥', '卯', '未'].includes(info.yearZhi) && info.zhi === '巳') ||
        (['亥', '卯', '未'].includes(info.dayZhi) && info.zhi === '巳') ||
        (['巳', '酉', '丑'].includes(info.yearZhi) && info.zhi === '亥') ||
        (['巳', '酉', '丑'].includes(info.dayZhi) && info.zhi === '亥'),

    '将星': (info) =>
        (['寅', '午', '戌'].includes(info.yearZhi) && info.zhi === '午') ||
        (['寅', '午', '戌'].includes(info.dayZhi) && info.zhi === '午') ||
        (['申', '子', '辰'].includes(info.yearZhi) && info.zhi === '子') ||
        (['申', '子', '辰'].includes(info.dayZhi) && info.zhi === '子') ||
        (['巳', '酉', '丑'].includes(info.yearZhi) && info.zhi === '酉') ||
        (['巳', '酉', '丑'].includes(info.dayZhi) && info.zhi === '酉') ||
        (['亥', '卯', '未'].includes(info.yearZhi) && info.zhi === '卯') ||
        (['亥', '卯', '未'].includes(info.dayZhi) && info.zhi === '卯'),

    // 4. Marriage/Health
    '天医': (info) =>
        (info.monthZhi === '寅' && info.zhi === '丑') ||
        (info.monthZhi === '卯' && info.zhi === '寅') ||
        (info.monthZhi === '辰' && info.zhi === '卯') ||
        (info.monthZhi === '巳' && info.zhi === '辰') ||
        (info.monthZhi === '午' && info.zhi === '巳') ||
        (info.monthZhi === '未' && info.zhi === '午') ||
        (info.monthZhi === '申' && info.zhi === '未') ||
        (info.monthZhi === '酉' && info.zhi === '申') ||
        (info.monthZhi === '戌' && info.zhi === '酉') ||
        (info.monthZhi === '亥' && info.zhi === '戌') ||
        (info.monthZhi === '子' && info.zhi === '亥') ||
        (info.monthZhi === '丑' && info.zhi === '子'),

    '红鸾': (info) =>
        (info.yearZhi === '子' && info.zhi === '卯') ||
        (info.yearZhi === '丑' && info.zhi === '寅') ||
        (info.yearZhi === '寅' && info.zhi === '丑') ||
        (info.yearZhi === '卯' && info.zhi === '子') ||
        (info.yearZhi === '辰' && info.zhi === '亥') ||
        (info.yearZhi === '巳' && info.zhi === '戌') ||
        (info.yearZhi === '午' && info.zhi === '酉') ||
        (info.yearZhi === '未' && info.zhi === '申') ||
        (info.yearZhi === '申' && info.zhi === '未') ||
        (info.yearZhi === '酉' && info.zhi === '午') ||
        (info.yearZhi === '戌' && info.zhi === '巳') ||
        (info.yearZhi === '亥' && info.zhi === '辰'),

    '天喜': (info) =>
        (info.yearZhi === '子' && info.zhi === '酉') ||
        (info.yearZhi === '丑' && info.zhi === '申') ||
        (info.yearZhi === '寅' && info.zhi === '未') ||
        (info.yearZhi === '卯' && info.zhi === '午') ||
        (info.yearZhi === '辰' && info.zhi === '巳') ||
        (info.yearZhi === '巳' && info.zhi === '辰') ||
        (info.yearZhi === '午' && info.zhi === '卯') ||
        (info.yearZhi === '未' && info.zhi === '寅') ||
        (info.yearZhi === '申' && info.zhi === '丑') ||
        (info.yearZhi === '酉' && info.zhi === '子') ||
        (info.yearZhi === '戌' && info.zhi === '亥') ||
        (info.yearZhi === '亥' && info.zhi === '戌'),

    // 5. Malignant Stars/Special
    '羊刃': (info) =>
        (info.dayGan === '甲' && info.zhi === '卯') ||
        (info.dayGan === '乙' && info.zhi === '寅') ||
        (info.dayGan === '丙' && info.zhi === '午') ||
        (info.dayGan === '丁' && info.zhi === '巳') ||
        (info.dayGan === '戊' && info.zhi === '午') ||
        (info.dayGan === '己' && info.zhi === '巳') ||
        (info.dayGan === '庚' && info.zhi === '酉') ||
        (info.dayGan === '辛' && info.zhi === '申') ||
        (info.dayGan === '壬' && info.zhi === '子') ||
        (info.dayGan === '癸' && info.zhi === '亥'),

    '劫煞': (info) =>
        (['申', '子', '辰'].includes(info.yearZhi) && info.zhi === '巳') ||
        (['申', '子', '辰'].includes(info.dayZhi) && info.zhi === '巳') ||
        (['寅', '午', '戌'].includes(info.yearZhi) && info.zhi === '亥') ||
        (['寅', '午', '戌'].includes(info.dayZhi) && info.zhi === '亥') ||
        (['亥', '卯', '未'].includes(info.yearZhi) && info.zhi === '申') ||
        (['亥', '卯', '未'].includes(info.dayZhi) && info.zhi === '申') ||
        (['巳', '酉', '丑'].includes(info.yearZhi) && info.zhi === '寅') ||
        (['巳', '酉', '丑'].includes(info.dayZhi) && info.zhi === '寅'),

    '咸池': (info) =>
        (['申', '子', '辰'].includes(info.yearZhi) && info.zhi === '酉') ||
        (['申', '子', '辰'].includes(info.dayZhi) && info.zhi === '酉') ||
        (['寅', '午', '戌'].includes(info.yearZhi) && info.zhi === '卯') ||
        (['寅', '午', '戌'].includes(info.dayZhi) && info.zhi === '卯') ||
        (['亥', '卯', '未'].includes(info.yearZhi) && info.zhi === '子') ||
        (['亥', '卯', '未'].includes(info.dayZhi) && info.zhi === '子') ||
        (['巳', '酉', '丑'].includes(info.yearZhi) && info.zhi === '午') ||
        (['巳', '酉', '丑'].includes(info.dayZhi) && info.zhi === '午'),

    '华盖': (info) =>
        (['寅', '午', '戌'].includes(info.yearZhi) && info.zhi === '戌') ||
        (['寅', '午', '戌'].includes(info.dayZhi) && info.zhi === '戌') ||
        (['申', '子', '辰'].includes(info.yearZhi) && info.zhi === '辰') ||
        (['申', '子', '辰'].includes(info.dayZhi) && info.zhi === '辰') ||
        (['巳', '酉', '丑'].includes(info.yearZhi) && info.zhi === '丑') ||
        (['巳', '酉', '丑'].includes(info.dayZhi) && info.zhi === '丑') ||
        (['亥', '卯', '未'].includes(info.yearZhi) && info.zhi === '未') ||
        (['亥', '卯', '未'].includes(info.dayZhi) && info.zhi === '未'),

    '童子煞': (info) =>
        ((['寅', '卯', '辰'].includes(info.monthZhi) && ['寅', '子'].includes(info.zhi))) || // Spring
        ((['申', '酉', '戌'].includes(info.monthZhi) && ['寅', '子'].includes(info.zhi))) || // Autumn
        ((['巳', '午', '未'].includes(info.monthZhi) && ['卯', '未', '辰'].includes(info.zhi))) || // Summer
        ((['亥', '子', '丑'].includes(info.monthZhi) && ['卯', '未', '辰'].includes(info.zhi))) || // Winter
        (info.yearNaYin && info.yearNaYin.includes('土') && ['辰', '巳'].includes(info.zhi)) ||
        (info.yearNaYin && (info.yearNaYin.includes('金') || info.yearNaYin.includes('木')) && ['午', '卯'].includes(info.zhi)) ||
        (info.yearNaYin && (info.yearNaYin.includes('水') || info.yearNaYin.includes('火')) && ['酉', '戌'].includes(info.zhi)),

    '勾绞煞': (info) =>
        (['寅', '申'].includes(info.yearZhi) && ['巳', '亥'].includes(info.zhi)) ||
        (['卯', '酉'].includes(info.yearZhi) && ['子', '午'].includes(info.zhi)) ||
        (['辰', '戌'].includes(info.yearZhi) && ['丑', '未'].includes(info.zhi)) ||
        (['巳', '亥'].includes(info.yearZhi) && ['寅', '申'].includes(info.zhi)),

    '孤辰': (info) =>
        (['寅', '卯', '辰'].includes(info.yearZhi) && info.zhi === '巳') ||
        (['巳', '午', '未'].includes(info.yearZhi) && info.zhi === '申') ||
        (['申', '酉', '戌'].includes(info.yearZhi) && info.zhi === '亥') ||
        (['亥', '子', '丑'].includes(info.yearZhi) && info.zhi === '寅'),

    '寡宿': (info) =>
        (['寅', '卯', '辰'].includes(info.yearZhi) && info.zhi === '丑') ||
        (['巳', '午', '未'].includes(info.yearZhi) && info.zhi === '辰') ||
        (['申', '酉', '戌'].includes(info.yearZhi) && info.zhi === '未') ||
        (['亥', '子', '丑'].includes(info.yearZhi) && info.zhi === '戌'),

    '披麻': (info) =>
        (['寅', '午', '戌'].includes(info.yearZhi) && info.zhi === '酉') ||
        (['申', '子', '辰'].includes(info.yearZhi) && info.zhi === '卯') ||
        (['亥', '卯', '未'].includes(info.yearZhi) && info.zhi === '子') ||
        (['巳', '酉', '丑'].includes(info.yearZhi) && info.zhi === '午'),

    '吊客': (info) =>
        (['寅', '午', '戌'].includes(info.yearZhi) && info.zhi === '子') ||
        (['申', '子', '辰'].includes(info.yearZhi) && info.zhi === '午') ||
        (['亥', '卯', '未'].includes(info.yearZhi) && info.zhi === '酉') ||
        (['巳', '酉', '丑'].includes(info.yearZhi) && info.zhi === '卯'),

    '丧门': (info) =>
        (['寅', '午', '戌'].includes(info.yearZhi) && info.zhi === '辰') ||
        (['申', '子', '辰'].includes(info.yearZhi) && info.zhi === '戌') ||
        (['亥', '卯', '未'].includes(info.yearZhi) && info.zhi === '丑') ||
        (['巳', '酉', '丑'].includes(info.yearZhi) && info.zhi === '未'),
};

// === Master Project Utilities ===

function getSpecificBaziYear(dateObj) {
    if (!dateObj) return new Date().getFullYear();
    const year = dateObj.getFullYear();
    try {
        const solar = Solar.fromYmd(year, 2, 4);
        const l = solar.getLunar();
        const jq = l.getJieQiTable();
        const liChun = jq['立春'];
        if (liChun) {
            const lcDate = new Date(liChun.getYear(), liChun.getMonth() - 1, liChun.getDay(), liChun.getHour(), liChun.getMinute(), liChun.getSecond());
            return (dateObj < lcDate) ? year - 1 : year;
        }
    } catch (e) { console.error("Li Chun error", e); }
    return (dateObj.getMonth() < 1 || (dateObj.getMonth() === 1 && dateObj.getDate() < 4)) ? year - 1 : year;
}

function validatePillars(gzArray) {
    if (!gzArray || gzArray.length !== 8) return { valid: false, error: "参数不完整" };
    const [yGan, yZhi, mGan, mZhi, dGan, dZhi, hGan, hZhi] = gzArray;
    const yGanIdx = GAN.indexOf(yGan);
    let startMonthGanIdx = ((yGanIdx % 5) * 2 + 2) % 10;
    const stepsM = (ZHI.indexOf(mZhi) - 2 + 12) % 12;
    const expectedMGan = GAN[(startMonthGanIdx + stepsM) % 10];
    if (mGan !== expectedMGan) return { valid: false, error: `月柱不合法：【${yGan}】年不可能出现【${mGan}${mZhi}】月。\n根据年上起月法，【${mZhi}】月的天干应为【${expectedMGan}】。` };
    if (hGan && hZhi) {
        let startHourGanIdx = (GAN.indexOf(dGan) % 5) * 2;
        const expectedHGan = GAN[(startHourGanIdx + ZHI.indexOf(hZhi)) % 10];
        if (hGan !== expectedHGan) return { valid: false, error: `时柱不合法：【${dGan}】日不可能出现【${hGan}${hZhi}】时。\n根据日上起时法，【${hZhi}】时的天干应为【${expectedHGan}】。` };
    }
    return { valid: true };
}

function findDateFromBazi(yearGan, yearZhi, monthGan, monthZhi, dayGan, dayZhi, timeGan, timeZhi, refYear) {
    const targetYearGZ = yearGan + yearZhi;
    let candidates = (YEAR_MAP[targetYearGZ] || []).filter(y => y >= 1900 && y <= 2100);
    candidates.sort((a, b) => Math.abs(a - refYear) - Math.abs(b - refYear));
    const results = [];
    for (const y of candidates) {
        for (let d = new Date(y, 0, 1); d <= new Date(y + 1, 1, 20); d.setDate(d.getDate() + 1)) {
            const solarCheck = Solar.fromDate(d), bazi = solarCheck.getLunar().getEightChar();
            if (bazi.getYearGan() === yearGan && bazi.getYearZhi() === yearZhi && bazi.getMonthGan() === monthGan && bazi.getMonthZhi() === monthZhi && bazi.getDayGan() === dayGan) {
                let hourTry = timeZhi ? ZHI.indexOf(timeZhi) * 2 : 12;
                if (timeZhi === '子') hourTry = 0;
                const sFinal = Solar.fromYmdHms(d.getFullYear(), d.getMonth() + 1, d.getDate(), hourTry, 0, 0);
                const bFinal = sFinal.getLunar().getEightChar();
                if (bFinal.getDayGan() === dayGan && bFinal.getDayZhi() === dayZhi) {
                    if (!timeZhi || (bFinal.getTimeGan() === timeGan && bFinal.getTimeZhi() === timeZhi)) {
                        results.push({ year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate(), hour: hourTry });
                        break;
                    }
                }
            }
        }
    }
    return results;
}

function getAllEarthStatuses(pillars) {
    const res = {};
    const allZhis = pillars.filter(p => p && p.zhi).map(p => p.zhi);
    [0, 1, 2, 3].forEach(idx => {
        if (!pillars[idx] || !pillars[idx].zhi) return;
        const zhi = pillars[idx].zhi;
        if (['辰', '戌', '丑', '未'].includes(zhi)) {
            const wx = ZHI_WX[zhi];
            const scores = calculateGlobalScores ? calculateGlobalScores(pillars) : {};
            const score = scores[wx] || 0;
            const clashed = allZhis.some(z => {
                if (z === zhi) return false;
                const pair = [zhi, z].sort().join('');
                return ['丑未', '辰戌'].includes(pair);
            });
            const type = (score > 30 || clashed) ? 'Warehouse' : 'Tomb';
            const desc = (type === 'Warehouse' ? '库' : '墓') + (clashed ? '(冲开)' : '');
            res[idx] = { zhi, type, score, clashed, desc }; // Indexed by pillar
        }
    });
    return res;
}

function getStemInteractionsMap(pillars) {
    const stems = pillars.map(p => p.gan);
    const mzWx = pillars[1] ? ZHI_WX[pillars[1].zhi] : null;
    const mods = {};
    const ganHeResult = { '甲己': '土', '乙庚': '金', '丙辛': '水', '丁壬': '木', '戊癸': '火' };

    for (let i = 0; i < stems.length; i++) {
        for (let j = i + 1; j < stems.length; j++) {
            const s1 = stems[i], s2 = stems[j];
            if (GAN_HE[s1] === s2 && (Math.abs(i - j) === 1 || i >= 4 || j >= 4)) {
                const pair = [s1, s2].sort((a, b) => GAN.indexOf(a) - GAN.indexOf(b)).join('');
                const targetWx = ganHeResult[pair];
                if (mzWx === targetWx) {
                    mods[i] = { status: 'he_hua', targetWx, multiplier: 1.0 };
                    mods[j] = { status: 'he_hua', targetWx, multiplier: 1.0 };
                } else {
                    mods[i] = { status: 'he_ban', targetWx: null, multiplier: 0.6 };
                    mods[j] = { status: 'he_ban', targetWx: null, multiplier: 0.6 };
                }
            }
        }
    }
    return mods;
}

// === Foundational Logic ===

function getColor(char) {
    if (!char) return '#333';
    let wx = GAN_WX[char] || ZHI_WX[char];
    if (wx === '木') return '#27ae60';
    if (wx === '火') return '#c0392b';
    if (wx === '土') return '#a1887f';
    if (wx === '金') return '#b8860b';
    if (wx === '水') return '#2980b9';
    return '#333';
}

function getTenGod(dayMaster, stem) {
    if (!stem) return '';
    const key = dayMaster + stem;
    return TEN_GODS[key] ? TEN_GODS[key][0] : '';
}

function getKongWang(stem, zhi) {
    if (!GAN.includes(stem) || !ZHI.includes(zhi)) return "";
    const idxG = GAN.indexOf(stem);
    const idxZ = ZHI.indexOf(zhi);
    const diff = (idxZ - idxG + 12) % 12;
    const mapping = { 0: ['戌', '亥'], 2: ['子', '丑'], 4: ['寅', '卯'], 6: ['辰', '巳'], 8: ['午', '未'], 10: ['申', '酉'] };
    return (mapping[diff] || []).join('');
}

function isPillarVoid(idx, pillars, manualZhi = null) {
    if (!pillars || pillars.length < 3) return false;
    const zhi = manualZhi || (pillars[idx] ? pillars[idx].zhi : null);
    if (!zhi) return false;
    if (idx === 2) {
        const yKW = getKongWang(pillars[0].gan, pillars[0].zhi);
        const mKW = pillars[1] ? getKongWang(pillars[1].gan, pillars[1].zhi) : "";
        const hKW = (pillars[3] && !pillars[3].isUnknown) ? getKongWang(pillars[3].gan, pillars[3].zhi) : "";
        return (yKW + mKW + hKW).includes(zhi);
    } else {
        const dKW = getKongWang(pillars[2].gan, pillars[2].zhi);
        return dKW.includes(zhi);
    }
}

// === Strength & Balance Engine ===

function calculateGlobalScores(pillars) {
    const scores = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };
    const weights = { stem: 10, zhi: [10, 45, 20, 15] }; // Y, M, D, H

    pillars.forEach((p, i) => {
        if (!p || !p.zhi) return;
        const isVoid = isPillarVoid(i, pillars);
        const voidMult = isVoid ? 0.3 : 1.0;
        if (p.gan && GAN_WX[p.gan]) scores[GAN_WX[p.gan]] += weights.stem * voidMult;
        if (weights.zhi[i]) scores[ZHI_WX[p.zhi]] += weights.zhi[i] * voidMult;
    });

    // Seasonal Pulse
    if (pillars.length > 1 && pillars[1]) {
        const mWx = ZHI_WX[pillars[1].zhi];
        const m = { '木': 0, '火': 1, '土': 2, '金': 3, '水': 4 };
        const baseIdx = m[mWx];
        Object.keys(scores).forEach(wx => {
            if (scores[wx] <= 0) return;
            const dist = (m[wx] - baseIdx + 5) % 5;
            if (dist === 1) scores[wx] += 5;
            else if (dist === 4) scores[wx] -= 2;
            else if (dist === 3) scores[wx] -= 5;
            else if (dist === 2) scores[wx] -= 8;
            if (scores[wx] < 0) scores[wx] = 0;
        });
    }

    // Chang Sheng Bonus
    pillars.forEach((p) => {
        if (!p) return;
        const zhi = p.zhi;
        Object.keys(scores).forEach(wx => {
            if (scores[wx] <= 0) return;
            const phase = CHANG_SHENG[wx] ? CHANG_SHENG[wx][zhi] : null;
            if (phase) {
                if (phase === '长生') scores[wx] += 6;
                else if (phase === '沐浴') scores[wx] += 4;
                else if (phase === '冠带') scores[wx] += 5;
                else if (phase === '临官') scores[wx] += 7;
                else if (phase === '帝旺') scores[wx] += 8;
            }
        });
    });
    return scores;
}

function getFiveElementProfile(pillars) {
    const scores = calculateGlobalScores(pillars);
    if (!pillars || pillars.length < 3) return [];
    const dm = pillars[2].gan;
    const dmWx = GAN_WX[dm];
    const elements = ['木', '火', '土', '金', '水'];
    const relToGod = { '同': '比劫', '生': '食伤', '克': '财星', '被克': '官杀', '被生': '印星' };
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    const threshold = totalScore * 0.22;

    return elements.map(el => {
        const score = scores[el] || 0;
        const rel = WX_RELATION[dmWx][el];
        return { element: el, tenGod: relToGod[rel] || '', score: score, isStrong: score >= threshold };
    });
}


function getAllEarthStatuses(pillars, scores) {
    const res = {};
    if (!pillars) return res;

    // Filter out explicitly "unknown" hour pillars to avoid empty string processing
    const validPillars = pillars.filter(p => p && p.zhi && (!p.isUnknown));
    const allBranches = validPillars.map(p => p.zhi);

    // Tomb vs Warehouse check
    const checkEarth = (zhi, elemScore, clashes) => {
        let isClashed = false;
        clashes.forEach(pair => {
            if (allBranches.includes(pair[0]) && allBranches.includes(pair[1])) {
                isClashed = true;
            }
        });
        // Simplistic rule: Score > 30 OR clashed -> Warehouse (active), else Tomb (dormant)
        const type = (elemScore > 30 || isClashed) ? 'Warehouse' : 'Tomb';
        res[zhi] = {
            type: type,
            score: Math.round(elemScore * 10) / 10,
            clashed: isClashed,
            desc: type === 'Warehouse' ? '库' + (isClashed ? '(冲开)' : '') : '墓'
        };
    };

    if (allBranches.includes('辰')) checkEarth('辰', scores['水'] || 0, [['辰', '戌'], ['卯', '辰']]);
    if (allBranches.includes('戌')) checkEarth('戌', Math.max(scores['火'] || 0, scores['土'] || 0), [['辰', '戌'], ['酉', '戌']]);
    if (allBranches.includes('丑')) checkEarth('丑', scores['金'] || 0, [['丑', '未'], ['子', '丑']]);
    if (allBranches.includes('未')) checkEarth('未', scores['木'] || 0, [['丑', '未'], ['午', '未']]);

    return res;
}


function getInteractions(pillars) {
    const stems = pillars.map(p => p.gan);
    const branches = pillars.map(p => p.zhi);
    const res = { stems: [], branches: [], judgments: [] };
    const ganHeResult = { '甲己': '合土', '乙庚': '合金', '丙辛': '合水', '丁壬': '合木', '戊癸': '合火' };
    const ganChongPairs = [['甲', '庚'], ['乙', '辛'], ['丙', '壬'], ['丁', '癸']];

    for (let i = 0; i < stems.length; i++) {
        for (let j = i + 1; j < stems.length; j++) {
            const s1 = stems[i], s2 = stems[j];
            const p1 = GAN.indexOf(s1) < GAN.indexOf(s2) ? s1 : s2;
            const p2 = s1 === p1 ? s2 : s1;
            const pairKey = p1 + p2;
            if (GAN_HE[p1] === p2) {
                const desc = ganHeResult[pairKey] || '';
                const mzWx = ZHI_WX[pillars[1].zhi];
                const targetWx = desc.substring(desc.length - 1);
                if (mzWx === targetWx) {
                    res.stems.push(pairKey + desc);
                    res.judgments.push(`${pairKey}${desc}成功：${p1}与${p2}均按${targetWx}五行论断。`);
                } else {
                    res.stems.push(pairKey + desc + "(不化)");
                    res.judgments.push(`${pairKey}合绊：${p1}与${p2}相互牵制，暂不生助克制其他天干。`);
                }
            }
            for (const cp of ganChongPairs) {
                if ((cp[0] === s1 && cp[1] === s2) || (cp[0] === s2 && cp[1] === s1)) res.stems.push(p1 + p2 + "冲");
            }
        }
    }

    const liuChongPairs = [['子', '午'], ['丑', '未'], ['寅', '申'], ['卯', '酉'], ['辰', '戌'], ['巳', '亥']];
    const liuHePairs = { '子丑': '化土', '丑子': '化土', '寅亥': '化木', '亥寅': '化木', '卯戌': '化火', '戌卯': '化火', '辰酉': '化金', '酉辰': '化金', '巳申': '化水', '申巳': '化水', '午未': '化土', '未午': '化土' };
    const liuHaiPairs = [['子', '未'], ['丑', '午'], ['寅', '巳'], ['卯', '辰'], ['申', '亥'], ['酉', '戌']];

    for (let i = 0; i < branches.length; i++) {
        for (let j = i + 1; j < branches.length; j++) {
            const b1 = branches[i], b2 = branches[j];
            const sortedPair = [b1, b2].sort((x, y) => ZHI.indexOf(x) - ZHI.indexOf(y)).join('');
            for (const cp of liuChongPairs) { if ((cp[0] === b1 && cp[1] === b2) || (cp[0] === b2 && cp[1] === b1)) res.branches.push(sortedPair + "冲"); }
            if (liuHePairs[b1 + b2]) res.branches.push(sortedPair + "六合" + liuHePairs[b1 + b2]);
            for (const hp of liuHaiPairs) { if ((hp[0] === b1 && hp[1] === b2) || (hp[0] === b2 && hp[1] === b1)) res.branches.push(sortedPair + "相害"); }
            if ((b1 === '子' && b2 === '卯') || (b1 === '卯' && b2 === '子')) res.branches.push("子卯相刑");
            if (b1 === b2 && ['辰', '午', '酉', '亥'].includes(b1)) res.branches.push(b1 + b2 + "自刑");
            const bw = [b1, b2].sort().join('');
            if (['寅巳', '巳申', '寅申'].includes(bw)) res.branches.push(bw + '相刑');
            if (['丑戌', '未戌', '丑未'].includes(bw)) res.branches.push(bw + '相刑');
        }
    }

    const bSet = new Set(branches);
    const sanHe = [{ grp: ['申', '子', '辰'], desc: '申子辰三合水局' }, { grp: ['亥', '卯', '未'], desc: '亥卯未三合木局' }, { grp: ['寅', '午', '戌'], desc: '寅午戌三合火局' }, { grp: ['巳', '酉', '丑'], desc: '巳酉丑三合金局' }];
    sanHe.forEach(sh => { if (sh.grp.every(x => bSet.has(x))) res.branches.push(sh.desc); });
    const sanHui = [{ grp: ['寅', '卯', '辰'], desc: '寅卯辰三会木方' }, { grp: ['巳', '午', '未'], desc: '巳午未三会火方' }, { grp: ['申', '酉', '戌'], desc: '申酉戌三会金方' }, { grp: ['亥', '子', '丑'], desc: '亥子丑三会水方' }];
    sanHui.forEach(sh => { if (sh.grp.every(x => bSet.has(x))) res.branches.push(sh.desc); });

    res.stems = [...new Set(res.stems)]; res.branches = [...new Set(res.branches)]; res.judgments = [...new Set(res.judgments)];
    return res;
}

function getShenSha(yearGan, yearZhi, monthZhi, dayGan, dayZhi, stem, zhi, yearNaYin, dayNaYin, idx = -1, fullPillars = null) {
    const res = [];
    const info = { yearGan, yearZhi, monthZhi, dayGan, dayZhi, stem, zhi, yearNaYin, dayNaYin };
    for (const name in SHEN_SHA_RULES) {
        if (SHEN_SHA_RULES[name](info)) res.push(name);
    }
    // Special dynamic stars
    const gz = stem + zhi;
    if (dayGan === stem && dayZhi === zhi) {
        if (['丙子', '丁丑', '戊寅', '辛卯', '壬辰', '癸巳', '丙午', '丁未', '戊申', '辛酉', '壬戌', '癸亥'].includes(gz)) res.push('阴差阳错');
        if (['壬辰', '庚戌', '庚辰', '戊戌'].includes(gz)) res.push('魁罡');
    }
    const CHONG_MAP = { '子': '午', '丑': '未', '寅': '申', '卯': '酉', '辰': '戌', '巳': '亥', '午': '子', '未': '丑', '申': '寅', '酉': '卯', '戌': '辰', '亥': '巳' };
    if (CHONG_MAP[monthZhi] === zhi) res.push('月破');
    if (CHONG_MAP[yearZhi] === zhi) res.push('岁破');
    if (isPillarVoid(idx, fullPillars, zhi)) res.push('空亡');
    return res;
}

// === Object-Oriented Foundation (The "Mover") ===

class BaziNode {
    constructor(info, context) {
        this.context = context; // Link back for lookups
        this.char = info.char; // 字符 (甲/戌)
        this.wx = info.wx;     // 五行 (木/土)
        this.pillarIndex = info.pillarIndex; // 0:年, 1:月, 2:日, 3:时, 4:大运, 5:流年
        this.isStem = !!info.isStem;
        this.pillarName = ['年', '月', '日', '时', '大运', '流年'][info.pillarIndex];
        this.isLuck = info.pillarIndex >= 4;
        this.color = info.color || getColor(info.char);
        this.yueLing = info.yueLing || null;
        this.restrictionDetails = info.restrictionDetails || [];
    }
    getPositionLabel() { return this.pillarName + (this.isStem ? '干' : '支'); }

    isBroken() {
        return !!(this.isRestricted || this.isKongWang || (this.restrictionDetails && this.restrictionDetails.length > 0));
    }
    isWang() {
        return this.strength === '旺' || this.strength === '相' || this.yueLing === '旺' || this.yueLing === '相';
    }

    // 获取同柱的另外一个节点 (Stem get Branch, Branch get Stem)
    getSamePillarOther() {
        return this.context.gods.find(g => g && g.pillarIndex === this.pillarIndex && g.isStem !== this.isStem);
    }


    // 获取同柱的天干 (如果是地支则返回对岸，如果是天干则返回自身)
    getStem() {
        return this.isStem ? this : this.getSamePillarOther();
    }

    // 获取同柱的地支
    getBranch() {
        return !this.isStem ? this : this.getSamePillarOther();
    }

    // 获取相邻柱的同属性节点 (Stem get adjacent Stems, Branch get adjacent Branches)
    getNeighbors() {
        const results = [];
        // findGodByPos 内部会严格校验 isStem，防止出现“年支与月干相邻”的误判
        if (this.pillarIndex > 0) results.push(this.context.findGodByPos(this.pillarIndex - 1, this.isStem));
        if (this.pillarIndex < 3) results.push(this.context.findGodByPos(this.pillarIndex + 1, this.isStem));
        return results.filter(Boolean);
    }

    isAdjacentTo(other) {
        if (!other) return false;
        // 核心安全检查：必须同为天干或同为地支
        if (other.isStem !== this.isStem) return false;

        // 岁运逻辑：大运或流年对原局四柱均视为紧贴 (临柱)
        if ((this.isLuck && other.pillarIndex < 4) || (other.isLuck && this.pillarIndex < 4)) {
            return true;
        }

        // 原局内部判断：柱索引相差1
        return Math.abs(other.pillarIndex - this.pillarIndex) === 1;
    }

    isSamePillarAs(other) {
        if (!other) return false;
        return other.pillarIndex === this.pillarIndex && other.isStem !== this.isStem;
    }
}

class TenGod extends BaziNode {
    constructor(info, context) {
        super(info, context);
        this.godName = info.godName;
        this.category = info.category;
        this.isSecondary = !!info.isSecondary;
        // OO Strength: Use provided strength OR calculate it from context
        this.strength = info.strength || this._calculateStrength();
        this.isRestricted = !!info.isRestricted;
        this.isYong = !!info.isYong;
        this.isJi = !!info.isJi;
        this.shenSha = info.shenSha || []; // 神煞数组
        this.isKongWang = !!info.isKongWang; // 是否空亡
    }

    _calculateStrength() {
        if (this.pillarIndex >= 4) return '旺'; // 大运流年
        const pillars = this.context?.raw?.pillars;
        if (!pillars || !pillars[1]) return '衰';

        // Branch Nodes (representing the branch itself) are always '旺' per standard UI
        if (!this.isStem && ZHI_WX[this.char]) return '旺';

        const monthZhi = pillars[1].zhi;
        const monthWX = ZHI_WX[monthZhi];
        if (!monthWX || !WANG_XIANG[monthWX]) return '衰';

        const myWX = this.wx;
        const rel = Object.keys(WANG_XIANG[monthWX]).find(k => WANG_XIANG[monthWX][k] === myWX);
        const isYueLingWang = (rel === '旺' || rel === '相');

        // Count roots
        let mainRoots = 0;
        let midRoots = 0;
        pillars.forEach((p) => {
            if (p && p.hidden) {
                p.hidden.forEach((h, idx) => {
                    if (h.stem === this.char) {
                        if (idx === 0) mainRoots++;
                        else if (idx === 1) midRoots++;
                    }
                });
            }
        });

        if (this.isStem) {
            if (isYueLingWang) return '旺';
            const myPillar = pillars[this.pillarIndex];
            const isSamePillarRoot = myPillar && myPillar.hidden && myPillar.hidden.some(h => h.stem === this.char);
            if (isSamePillarRoot) return '旺';
            if (mainRoots >= 1) return '旺';
            if (midRoots >= 2) return '旺';
            return '衰';
        } else {
            // Hidden Stem logic
            const myPillar = pillars[this.pillarIndex];
            let hIdx = -1;
            if (myPillar && myPillar.hidden) {
                hIdx = myPillar.hidden.findIndex(h => h.stem === this.char);
            }
            if (this.isSecondary) {
                if (isYueLingWang) {
                    const TOMBS = { '金': '丑', '木': '未', '水': '辰', '火': '戌', '土': '辰' };
                    const isTombPillar = myPillar?.zhi === TOMBS[myWX];
                    if (hIdx === 2 && isTombPillar) return '衰'; // 坐墓库(余气不旺)
                    return '旺';
                }
                if (hIdx === 1 && midRoots >= 2) return '旺';
                return '衰';
            } else {
                return '旺'; // 主气
            }
        }
    }
    isWang() { return this.strength === '旺'; }
    isBroken() { return this.isRestricted; }
    isFavorable() { return this.isYong; }

    // 是否帮身 (印星/比劫，且未受损、未空亡)
    isProtective() {
        return (this.category === '印星' || this.category === '比劫') && !this.isBroken() && !this.isKongWang;
    }

    // 是否紧贴日主
    isAdjacentToDM() {
        const dm = this.context.dayMasterNode;
        if (!dm) return false;
        // 1. 同柱的日支
        if (this.isSamePillarAs(dm)) return true;
        // 2. 临干 (月干/时干)
        if (this.isAdjacentTo(dm)) return true;
        return false;
    }


    // 是否得位 (比如印居月柱，财居日支等 - 简化判断)
    isHome() {
        if (this.category === '印星' && this.pillarIndex === 1) return true;
        if (this.category === '财星' && this.pillarIndex === 2 && !this.isStem) return true;
        if (this.category === '官杀' && this.pillarIndex === 3) return true;
        return false;
    }
}

class BaziContext {
    constructor(data) {
        this.raw = data;
        const pillars = [...(data.pillars || [])];
        if (data.currentDaYun) pillars[4] = data.currentDaYun;
        if (data.selectedLiuNian) pillars[5] = data.selectedLiuNian;
        this.pillars = pillars; // Corrected: include all 6 pillars for getExpertReport
        const wsSummary = data.wangShuaiSummary || {};
        // Initialize gods array with placeholders for fixed indices (0-11)
        // 0-7: Natal Pillars (Stem/Branch x 4)
        // 8-9: DaYun (Stem/Branch)
        // 10-11: LiuNian (Stem/Branch)
        this.gods = new Array(12).fill(null);

        const yElements = new Set(data.yongXiJi?.yong || []);
        const jElements = new Set(data.yongXiJi?.ji || []);

        const isYongByCat = (cat) => wsSummary[cat]?.isYong || false;
        const isJiByCat = (cat) => wsSummary[cat]?.isJi || false;
        const isYongByStem = (stem) => yElements.has(GAN_WX[stem]);
        const isJiByStem = (stem) => jElements.has(GAN_WX[stem]);

        // 1. Process Natal Pillars (indices 0-7)
        pillars.slice(0, 4).forEach((p, i) => {
            if (!p) return;
            const pShenSha = p.shenSha || [];
            const isKW = isPillarVoid(i, pillars);

            // Stem (Index: 0, 2, 4, 6)
            const sWS = p.stem?.wangShuai || {};
            const sGodName = p.stem?.god || p.tenGod || '';
            this.gods[i * 2] = new TenGod({
                char: p.gan, wx: GAN_WX[p.gan] || '', pillarIndex: i, isStem: true,
                godName: sGodName, category: getCat(sGodName),
                isRestricted: !!sWS.isRestricted,
                isYong: !!sWS.isYongShen || isYongByStem(p.gan) || isYongByCat(getCat(sGodName)),
                isJi: !!sWS.isJiShen || isJiByStem(p.gan) || isJiByCat(getCat(sGodName)),
                shenSha: pShenSha, isKongWang: false
            }, this);

            // Main Branch Qi (Index: 1, 3, 5, 7)
            const bWS = p.branch?.wangShuai || {};
            const bGodName = p.branch?.god || (p.hidden && p.hidden.length > 0 ? p.hidden[0].god : '');
            this.gods[i * 2 + 1] = new TenGod({
                char: p.zhi, wx: ZHI_WX[p.zhi] || '', pillarIndex: i, isStem: false,
                godName: bGodName, category: getCat(bGodName),
                isRestricted: !!bWS.isRestricted,
                isYong: !!bWS.isYongShen || isYongByStem(p.zhi) || isYongByCat(getCat(bGodName)),
                isJi: !!bWS.isJiShen || isJiByStem(p.zhi) || isJiByCat(getCat(bGodName)),
                shenSha: pShenSha, isKongWang: isKW
            }, this);

            // 2. Add Hidden Stems (Push to 12+)
            if (p.hidden && p.hidden.length > 0) {
                const wsDetail = p.branch?.wangShuai;
                p.hidden.forEach((h, hIdx) => {
                    const hws = wsDetail?.gods?.find(g => g.char === h.stem);
                    this.gods.push(new TenGod({
                        char: h.stem, wx: GAN_WX[h.stem], pillarIndex: i, isStem: false,
                        godName: h.god, category: getCat(h.god),
                        isRestricted: !!hws?.isRestricted,
                        isYong: hws?.isYongShen || wsSummary[getCat(h.god)]?.isYong || false,
                        isJi: hws?.isJiShen || wsSummary[getCat(h.god)]?.isJi || false,
                        isSecondary: hIdx > 0
                    }, this));
                });
            }
        });

        // 3. Add DaYun (indices 8-9)
        if (data.currentDaYun) {
            const dy = data.currentDaYun;
            const dyGod = dy.tenGod;
            this.gods[8] = new TenGod({
                char: dy.gan, wx: GAN_WX[dy.gan], pillarIndex: 4, isStem: true,
                godName: dyGod, category: getCat(dyGod),
                strength: '旺',
                isYong: wsSummary[getCat(dyGod)]?.isYong || false,
                isJi: wsSummary[getCat(dyGod)]?.isJi || false
            }, this);
            this.gods[9] = new TenGod({
                char: dy.zhi, wx: ZHI_WX[dy.zhi], pillarIndex: 4, isStem: false,
                godName: '', category: '', strength: '旺'
            }, this);
        }

        // 4. Add LiuNian (indices 10-11)
        if (data.selectedLiuNian) {
            const ln = data.selectedLiuNian;
            const lnGod = ln.tenGod;
            this.gods[10] = new TenGod({
                char: ln.gan, wx: GAN_WX[ln.gan], pillarIndex: 5, isStem: true,
                godName: lnGod, category: getCat(lnGod),
                strength: '旺',
                isYong: wsSummary[getCat(lnGod)]?.isYong || false,
                isJi: wsSummary[getCat(lnGod)]?.isJi || false
            }, this);
            this.gods[11] = new TenGod({
                char: ln.zhi, wx: ZHI_WX[ln.zhi], pillarIndex: 5, isStem: false,
                godName: '', category: '', strength: '旺'
            }, this);
        }
        this.dayMaster = {
            char: data.pillars?.[2]?.gan || '',
            element: data.pillars?.[2]?.ganWx || '',
            strength: data.bodyStrength?.status || '中和'
        };
    }

    getGodByIndex(idx) { return this.gods[idx]; }
    getGods(query) {
        return this.gods.filter(g => g && (g.category === query || g.godName === query));
    }

    findGodByPos(pillarIndex, isStem) {
        return this.gods.find(g => g && g.pillarIndex === pillarIndex && g.isStem === isStem);
    }

    get dayMasterNode() { return this.findGodByPos(2, true); }
    get hourStemNode() { return this.findGodByPos(3, true); }
    get hourBranchNode() { return this.findGodByPos(3, false); }
    get dayBranchNode() { return this.findGodByPos(2, false); }


    // --- Semantic Getters (The Road) ---

    get isSelfStrong() { return this.dayMaster.strength.includes('强') || this.dayMaster.strength.includes('旺'); }
    get isSelfWeak() { return !this.isSelfStrong; }

    // 获取特定类型的十神统计 (exists, strong, yong)
    getGodMeta(category) {
        const matchingGods = this.gods.filter(g => g && (g.category === category || g.godName === category));
        const natalGods = matchingGods.filter(g => g.pillarIndex < 4);

        return {
            exists: matchingGods.length > 0,
            hasNatal: natalGods.length > 0,
            isStrong: matchingGods.some(g => g.isWang() && g.pillarIndex < 4),
            isYong: matchingGods.some(g => g.isYong),
            isJi: matchingGods.some(g => g.isJi),
            count: matchingGods.length,
            nodes: matchingGods
        };
    }

    get hasWealth() { return this.getGodMeta('财星').exists; }

    get hasOfficer() { return this.getGodMeta('官杀').exists; }
    get hasOfficial() { return this.hasOfficer; }
    get isBranchClashed() { return this.gods.some(g => g && !g.isStem && g.isRestricted && g.pillarIndex < 4); }
    get isOfficerClashed() { return this.getGods('官杀').some(g => g.isRestricted && !g.isStem && g.pillarIndex < 4); }
    get isSealBranchVoid() { return this.getGods('印星').some(g => g.isKongWang && !g.isStem && g.pillarIndex < 4); }
    get isWealthBranchVoid() { return this.getGods('财星').some(g => g.isKongWang && !g.isStem && g.pillarIndex < 4); }
    get isOfficerBranchVoid() { return this.getGods('官杀').some(g => g.isKongWang && !g.isStem && g.pillarIndex < 4); }

    get hasSevenKillings() { return this.gods.some(g => g && (g.godName === '七杀' || g.godName === '杀') && g.pillarIndex < 4); }
    get hasIndirectSeal() { return this.gods.some(g => g && (g.godName === '偏印' || g.godName === '枭') && g.pillarIndex < 4); }
    get hasOfficerBranch() { return this.getGods('官杀').some(g => !g.isStem && g.pillarIndex < 4); }
    get hasSealBranch() { return this.getGods('印星').some(g => !g.isStem && g.pillarIndex < 4); }

    get isSealStrong() { return this.getGodMeta('印星').isStrong; }
    get isOutputStrong() { return this.getGodMeta('食伤').isStrong; }
    get isBiJieStrong() { return this.getGodMeta('比劫').isStrong; }
    get isWealthStrong() { return this.getGodMeta('财星').isStrong; }
    get isOfficerStrong() { return this.getGodMeta('官杀').isStrong; }
    get isSealTaboo() { return (this.isSealStrong && !this.isDMWeak) || this.isSealOverloaded; }



    get isBodyStrong() { return this.isSelfStrong; }
    get isDMWeak() { return !this.isSelfStrong; }

    get hasNatalSealStem() { return this.getGods('印星').some(g => g.isStem && g.pillarIndex < 4); }
    get hasLuckSealStem() { return this.getGods('印星').some(g => g.isStem && g.pillarIndex === 4); }

    get isKillControlled() {
        // Detailed check for Killing controlled by Output or Seal via interaction
        const kill = this.getGods('官杀').filter(n => (n.godName === '七杀' || n.godName === '杀') && n.pillarIndex < 4);
        const output = this.getGods('食伤').filter(n => n.pillarIndex < 4);
        const seal = this.getGods('印星').filter(n => n.pillarIndex < 4);

        return kill.some(k =>
            output.some(o => o.isAdjacentTo(k) || o.isSamePillarAs(k)) ||
            seal.some(s => s.isAdjacentTo(k) || s.isSamePillarAs(k))
        );
    }

    get isSealOverloaded() {
        const seal = this.getGodMeta('印星');
        return seal.isStrong && this.isDMWeak;
    }
    get isSealRestrained() {
        return this.getGods('印星').some(s => this.getGods('财星').some(w => w.isAdjacentTo(s) || w.isSamePillarAs(s)));
    }

    // --- Personality & Attitude Specifics ---
    get isOfficerJi() { return this.isSelfStrong ? false : this.isOfficerStrong; } // Simplified: unfavorable if weak

    get hasWealthControlSeal() { return this.isSealRestrained; }

    get isWealthJi() { return this.isSelfStrong ? false : this.isWealthStrong; }
    get hasRobberControlWealth() { return this.getGods('财星').some(w => this.getGods('比劫').some(b => b.isAdjacentTo(w) || b.isSamePillarAs(w))); }

    get isOutputJi() { return this.isSelfStrong ? false : this.isOutputStrong; }
    get hasSealControlOutput() { return this.getGods('食伤').some(f => this.getGods('印星').some(s => s.isAdjacentTo(f) || s.isSamePillarAs(f))); }

    get isBiJieJi() { return this.isSelfStrong; }
    get hasOfficerControlBiJie() { return this.getGods('比劫').some(b => this.getGods('官杀').some(o => o.isAdjacentTo(b) || o.isSamePillarAs(b))); }


    get isBiJieSamePillar() {
        // Specifically for wealth logic: BiJie on top of Wealth or vice versa
        return this.gods.some((g, i) => {
            if (i >= 8 || !g || !g.category || !g.category.includes('财')) return false;
            const partnerIdx = i % 2 === 0 ? i + 1 : i - 1;
            const partner = this.gods[partnerIdx];
            return partner && partner.category && partner.category.includes('比');
        });
    }

    get monthBranchCategory() {
        const monthBranch = this.gods[3]; // Pillar 1, Branch 1 (Index 3)
        return monthBranch ? monthBranch.category : '';
    }

    get monthBranchGodYongStatus() {
        const monthBranch = this.gods[3];
        if (!monthBranch) return '平';
        if (monthBranch.isYong) return '用';
        if (monthBranch.isJi) return '忌';
        return '平';
    }


    // --- Expert Trait Logic (From 八字用神与性格特征.md) ---
    getTraitStatus(cat) {
        const gods = this.getGods(cat).filter(g => g.pillarIndex < 4);
        if (gods.length === 0) return 'neutral';

        const meta = this.getGodMeta(cat);
        const isYong = gods.some(g => g.isYong);
        const isJi = gods.some(g => g.isJi);
        const isStrong = meta.isStrong;
        const isRestricted = gods.some(g => g.isRestricted);

        console.log(`[getTraitStatus] Category: ${cat}`, {
            count: gods.length,
            isYong, isJi, isStrong, isRestricted,
            representativeNode: gods[0]
        });

        // Positive: (Yong && Strong) OR (Ji && Weak && Restricted)
        if ((isYong && isStrong) || (isJi && !isStrong && isRestricted)) return 'positive';

        // Negative: (Yong && Weak && Restricted) OR (Ji && Strong)
        if (cat === '官杀' && isJi && isStrong) {
            return this.hasSealTrans ? 'positive_transformed' : 'negative';
        }

        if ((isYong && !isStrong && isRestricted) || (isJi && isStrong)) return 'negative';

        return 'neutral';
    }

    get isOfficerPositive() { return this.getTraitStatus('官杀') === 'positive' || this.getTraitStatus('官杀') === 'positive_transformed'; }
    get isOfficerNegative() { return this.getTraitStatus('官杀') === 'negative'; }
    get isSealPositive() { return this.getTraitStatus('印星') === 'positive'; }
    get isSealNegative() { return this.getTraitStatus('印星') === 'negative'; }
    get isWealthPositive() { return this.getTraitStatus('财星') === 'positive'; }
    get isWealthNegative() { return this.getTraitStatus('财星') === 'negative'; }
    get isOutputPositive() { return this.getTraitStatus('食伤') === 'positive'; }
    get isOutputNegative() { return this.getTraitStatus('食伤') === 'negative'; }
    get isBiJiePositive() { return this.getTraitStatus('比劫') === 'positive'; }
    get isBiJieNegative() { return this.getTraitStatus('比劫') === 'negative'; }

    get isBiJieRobbing() { return this.hasRob && this.hasWealth && (this.getGodMeta('比劫').isStrong || !this.isWealthStrong); }

    get isWealthRoots() { return this.getGods('财星').some(g => g && !g.isStem && g.pillarIndex < 4); }
    get wealthRooted() { return this.isWealthRoots; }


    // 婚姻星宫信号
    getMarriageSignals(isMale) {
        const spouseCat = isMale ? '财星' : '官杀';
        const stars = this.getGodMeta(spouseCat);
        const dayBranch = this.dayBranchNode;
        return {
            isMale, isFemale: !isMale,
            hasSpouseStar: stars.exists,
            isSpouseStarStrong: stars.isStrong,
            isSpouseStarHidden: stars.hasNatal && stars.nodes.every(n => !n.isStem),
            dayBranchGod: dayBranch?.godName || '',
            isDayBranchVoid: dayBranch?.isKongWang || false,
            isDayBranchPeach: ['子', '午', '卯', '酉'].includes(dayBranch?.char),
            isMarriageLuckActive: this.isLuckInteractionWith(2) || stars.nodes.some(n => n.isLuck)
        };
    }

    // 学业信号
    getAcademicSignals() {
        const seal = this.getGodMeta('印星');
        const killing = this.getGodMeta('官杀');
        const food = this.getGodMeta('食伤');
        return {
            hasSeal: seal.exists,
            isSealStrong: seal.isStrong,
            hasSevenKillings: killing.nodes.some(n => n.godName === '七杀' || n.godName === '杀'),
            isKillControlled: killing.exists && (food.exists || seal.exists),
            isSealOverloaded: seal.isStrong && this.isDMWeak,
            hasOutput: food.exists,
            isLuckActive: this.gods.some(g => g && g.isLuck && (g.category === '印星' || g.category === '食伤'))
        };
    }

    // 交互辅助
    isLuckInteractionWith(pillarIndex) {
        const luckNodes = this.gods.filter(g => g && g.isLuck);
        const pillarNodes = this.gods.filter(g => g && g.pillarIndex === pillarIndex);
        return luckNodes.some(l => pillarNodes.some(p => l.isAdjacentTo(p)));
    }

    // --- Specialized House Contexts (The Houses Connect Here) ---

    get isMale() { return this.raw.isMale; }

    get hasMarriageLuckPrime() {
        // Condition: Early Luck (age 16-36) contains Spouse Star or interacts with Spouse Palace
        const spouseCat = this.isMale ? '财星' : '官杀';
        const dyList = this.raw.daYunList || [];
        return dyList.some(dy => {
            const age = dy.startAge;
            if (age >= 16 && age <= 36) {
                const hasStar = dy.tenGod && getCat(dy.tenGod) === spouseCat;
                const interacts = ['冲', '合', '刑'].some(op => this.dayBranchNode && window.checkInteraction?.(dy.zhi, this.dayBranchNode.char)?.includes(op));
                return hasStar || interacts;
            }
            return false;
        });
    }

    get isPalaceClashed() {
        const db = this.dayBranchNode;
        return db && (db.isRestricted || this.raw.interactions?.branches?.some(b => b.includes(db.char) && b.includes('冲')));
    }

    get isPalacePunished() {
        const db = this.dayBranchNode;
        return db && this.raw.interactions?.branches?.some(b => b.includes(db.char) && b.includes('刑'));
    }

    get isDayBranchXing() { return this.isPalacePunished; }

    get isSpouseStemCombinedWithDM() {
        const spouseCat = this.isMale ? '财星' : '官杀';
        const spouseNodes = this.getGods(spouseCat).filter(n => n.isStem && n.pillarIndex < 4);
        const dmChar = this.dayMaster.char;
        return spouseNodes.some(n => GAN_HE_HE[n.char] === dmChar);
    }

    get isSpouseStemCombinedWithOther() {
        const spouseCat = this.isMale ? '财星' : '官杀';
        const spouseNodes = this.getGods(spouseCat).filter(n => n.isStem && n.pillarIndex < 4);
        return spouseNodes.some(n => {
            const combinedWith = GAN_HE_HE[n.char];
            if (!combinedWith) return false;
            // Combined with someone else?
            return this.gods.some(other => other && other.isStem && other.pillarIndex < 4 && other.pillarIndex !== 2 && other.char === combinedWith);

        });
    }

    get isCompetingHe() {
        // Multi-DM or Multi-Spouse competing for he
        const spouseCat = this.isMale ? '财星' : '官杀';
        const spouseNodes = this.getGods(spouseCat).filter(n => n.isStem && n.pillarIndex < 4);
        if (spouseNodes.length > 1) {
            const dmHe = GAN_HE_HE[this.dayMaster.char];
            return spouseNodes.filter(n => n.char === dmHe).length > 1;
        }
        return false;
    }

    get isDayBranchSpouseStar() {
        const spouseCat = this.isMale ? '财星' : '官杀';
        return this.dayBranchNode?.category === spouseCat;
    }

    get isPureZheng() {
        const spouseCat = this.isMale ? '财星' : '官杀';
        const zheng = this.isMale ? '正财' : '正官';
        const nodes = this.getGodMeta(spouseCat).nodes.filter(n => n.pillarIndex < 4);
        if (nodes.length === 0) return false;
        return nodes.every(n => n.godName === zheng || n.godName === zheng.substring(1));
    }

    get isYangRenStrong() {
        return this.gods.some(g => g && g.pillarIndex < 4 && g.shenSha?.includes('羊刃') && g.isWang());
    }

    get isAnyWealthRobbed() {
        const wealth = this.getGods('财星').filter(n => n.pillarIndex < 4);
        const bijie = this.getGods('比劫').filter(n => n.pillarIndex < 4);
        return wealth.some(w => bijie.some(b => b.isAdjacentTo(w) || b.isSamePillarAs(w)));
    }

    get hasSanHe() { return this.raw.interactions?.branches?.some(b => b.includes('三合')); }
    get hasLiuHe() { return this.raw.interactions?.branches?.some(b => b.includes('六合')); }
    get hasAnHe() { return this.raw.interactions?.branches?.some(b => b.includes('暗合')); }

    get hasPeachShaHourRevealed() {
        return this.findGodByPos(3, false)?.shenSha?.includes('咸池') || this.findGodByPos(3, true)?.shenSha?.includes('咸池');
    }
    get hasPeachShaMonthRevealed() {
        return this.findGodByPos(1, false)?.shenSha?.includes('咸池') || this.findGodByPos(1, true)?.shenSha?.includes('咸池');
    }
    get isPeachDay() {
        return this.dayBranchNode?.shenSha?.includes('咸池');
    }

    // --- Wealth Domain Properties ---
    get isWealthBreaksSeal() {
        const wealth = this.getGods('财星');
        const seal = this.getGods('印星');
        return wealth.some(w => w.isYong && seal.some(s => s.isJi && (w.isAdjacentTo(s) || w.isSamePillarAs(s))));
    }
    get isWealthGenOfficer() {
        const wealth = this.getGods('财星');
        const officer = this.getGods('官杀');
        return wealth.some(w => w.isYong && officer.some(o => o.isYong && (w.isAdjacentTo(o) || w.isSamePillarAs(o))));
    }
    get isWealthDamaged() {
        return this.getGods('财星').some(g => g.isRestricted && g.pillarIndex < 4);
    }
    get isDaYunWealthCorroborated() {
        const dy = this.pillars[4];
        if (!dy) return false;
        const stemW = getCat(dy.tenGod) === '财星';
        const branchW = dy.hidden?.some(h => h.god && getCat(h.god) === '财星');
        return stemW && branchW;
    }
    get isDaYunTomb() {
        const dy = this.pillars[4];
        return dy && ['辰', '戌', '丑', '未'].includes(dy.zhi);
    }
    get isDyWealthStem() { return this.pillars[4] && getCat(this.pillars[4].tenGod) === '财星'; }
    get isDyFoodStem() { return this.pillars[4] && getCat(this.pillars[4].tenGod) === '食伤'; }
    get isDyOfficerStem() { return this.pillars[4] && getCat(this.pillars[4].tenGod) === '官杀'; }

    get isLiuNianClashTomb() {
        const ln = this.pillars[5];
        if (!ln) return false;
        // Check if annual branch clashes a natal/luck tomb branch
        const tombs = this.pillars.slice(0, 5).filter(p => p && ['辰', '戌', '丑', '未'].includes(p.zhi));
        return tombs.some(t => window.checkInteraction?.(ln.zhi, t.zhi)?.includes('冲'));
    }
    get isLiuNianWealth() { return this.pillars[5] && (getCat(this.pillars[5].tenGod) === '财星' || this.pillars[5].hidden?.some(h => getCat(h.god) === '财星')); }
    get isLiuNianWealthWeak() {
        const ln = this.pillars[5];
        if (!ln || getCat(ln.tenGod) !== '财星') return false;
        // Search for the node in gods list to check its strength
        const node = this.gods.find(g => g && g.pillarIndex === 5 && g.isStem);
        return node && !node.isWang();
    }
    get isLiuNianWealthStrong() {
        const ln = this.pillars[5];
        if (!ln || getCat(ln.tenGod) !== '财星') return false;
        const node = this.gods.find(g => g && g.pillarIndex === 5 && g.isStem);
        return node && node.isWang();
    }
    get isLiuNianFood() { return this.pillars[5] && (getCat(this.pillars[5].tenGod) === '食伤' || this.pillars[5].hidden?.some(h => getCat(h.god) === '食伤')); }
    get isLiuNianGenOfficer() {
        const ln = this.pillars[5];
        if (!ln) return false;
        const lnW = getCat(ln.tenGod) === '财星';
        const hasO = this.getGodMeta('官杀').exists;
        return lnW && hasO;
    }

    // --- Career Domain Properties ---
    get isOfficerPure() {
        const g = this.getGodMeta('官杀').nodes.filter(n => n.pillarIndex < 4);
        if (g.length === 0) return true;
        const first = g[0].godName;
        return g.every(n => n.godName === first);
    }
    get isOfficerMixed() { return !this.isOfficerPure; }
    get isFoodGenWealth() {
        const food = this.getGods('食伤');
        const wealth = this.getGods('财星');
        // A direct production relationship (adjacent or same pillar) is enough to consider it GenWealth
        return food.some(f => wealth.some(w => f.isAdjacentTo(w) || f.isSamePillarAs(w)));
    }


    // --- Legal Domain Properties ---
    get isFoodKill() {
        // "Shang Guan Jian Guan" (傷官見官)
        const output = this.getGods('食伤').filter(n => n.godName === '伤官');
        const officer = this.getGods('官杀').filter(n => n.godName === '正官' || n.godName === '官');
        return output.some(o => officer.some(off => o.isAdjacentTo(off) || o.isSamePillarAs(off)));
    }
    get hasSealTrans() {
        const seal = this.getGods('印星');
        const officer = this.getGods('官杀');
        const dm = this.dayMaster;
        // Officer -> Seal -> DM
        return officer.some(o => seal.some(s => o.isAdjacentTo(s) || o.isSamePillarAs(s))) &&
            seal.some(s => s.isAdjacentTo(dm) || s.isSamePillarAs(dm));
    }

    get isSealRestricted() { return this.getGods('印星').some(n => n.isRestricted && n.pillarIndex < 4); }
    get isWealthRestricted() { return this.getGods('财星').some(n => n.isRestricted && n.pillarIndex < 4); }
    get isOutputRestricted() { return this.getGods('食伤').some(n => n.isRestricted && n.pillarIndex < 4); }
    get isBiJieRestricted() { return this.getGods('比劫').some(n => n.isRestricted && n.pillarIndex < 4); }
    get isKillControlled() {
        const kill = this.getGods('官杀').filter(n => (n.godName === '七杀' || n.godName === '杀') && n.pillarIndex < 4);
        const output = this.getGods('食伤').filter(n => n.pillarIndex < 4);
        return kill.some(k => output.some(o => o.isAdjacentTo(k) || o.isSamePillarAs(k)));
    }

    get hasLuoWang() { return this.gods.some(g => g && g.shenSha?.includes('天罗地网')); }
    get hasSanXing() { return this.raw.interactions?.branches?.some(b => b.includes('三刑')); }
    get isOfficerClashed() {
        const officer = this.getGods('官杀').filter(n => !n.isStem && n.pillarIndex < 4);
        return officer.some(o => this.raw.interactions?.branches?.some(i => i.includes(o.char) && i.includes('冲')));
    }

    // --- Children Domain Properties ---
    get isFoodPeiYin() {
        const food = this.getGods('食伤');
        const seal = this.getGods('印星');
        return food.some(f => seal.some(s => s.isAdjacentTo(f) || s.isSamePillarAs(f)));
    }
    get isXiaoEatingFood() {
        const food = this.getGods('食伤');
        const xiao = this.getGods('印星').filter(n => n.godName === '偏印' || n.godName === '枭');
        return xiao.some(x => x.isJi && food.some(f => f.isRestricted && (x.isAdjacentTo(f) || x.isSamePillarAs(f))));
    }
    get isPalaceYong() {
        return this.hourStemNode?.isYong || this.hourBranchNode?.isYong;
    }
    get isPalaceVoid() {
        return this.hourBranchNode?.isKongWang || false;
    }


    // --- Sexlife Domain Properties ---
    get isDayBranchMuYu() {
        return this.dayBranchNode?.stage12 === '沐浴';
    }
    get isDayBranchClashed() {
        const db = this.dayBranchNode;
        return db && this.raw.interactions?.branches?.some(i => i.includes(db.char) && i.includes('冲'));
    }
    get isDayBranchCombined() {
        const db = this.dayBranchNode;
        return db && this.raw.interactions?.branches?.some(i => i.includes(db.char) && (i.includes('合') || i.includes('会')));
    }
    get isWOBalanced() {
        const w = this.getGodMeta('财星');
        const o = this.getGodMeta('官杀');
        return w.exists && o.exists && Math.abs(w.strength - o.strength) < 20; // Example heuristic
    }
    get isXiaoRestrained() {
        const xiao = this.getGods('印星').filter(n => n.godName === '偏印' || n.godName === '枭');
        const wealth = this.getGods('财星');
        return xiao.some(x => wealth.some(w => w.isAdjacentTo(x) || w.isSamePillarAs(x)));
    }

    get luckListRaw() { return this.raw.daYunList || []; }

    get wealthContext() {
        const w = this.getGodMeta('财星');
        const dy = this.gods.filter(g => g && g.pillarIndex === 4);
        const ln = this.gods.filter(g => g && g.pillarIndex === 5);
        return {
            isSelfStrong: this.isSelfStrong, isSelfWeak: this.isSelfWeak,
            hasWealth: this.hasWealth, isWealthStrong: this.isWealthStrong, isWealthWeak: !this.isWealthStrong,
            wealthRooted: this.isWealthRoots, hasFood: this.hasFood, hasOfficer: this.hasOfficer,
            isOfficerStrong: this.isOfficerStrong, isOfficerWeak: !this.isOfficerStrong,
            hasSeal: this.hasSeal, hasBiJie: this.hasRob, isBiJieRobbing: this.isBiJieRobbing,
            isDyWealthStem: dy.some(n => n.isStem && n.category === '财星'),
            isLiuNianWealth: ln.some(n => n.isStem && n.category === '财星'),
            isDaYunTomb: dy.some(n => !n.isStem && ['辰', '戌', '丑', '未'].includes(n.char)),
            luckAcademic: this.getLuckList('academic'), luckMarriage: this.getLuckList('marriage')
        };
    }

    get marriageContext() {
        return this.getMarriageSignals(this.raw.isMale);
    }

    get academicContext() {
        return this.getAcademicSignals();
    }

    // 获取大运流年分类列表 (学业、婚姻、事业等)
    getLuckList(type) {
        const res = [];
        const dyList = this.raw.daYunList || [];
        const dm = this.dayMaster.char;
        dyList.forEach(l => {
            const start = l.startAge;
            const end = start + 10;
            const god = l.tenGod;
            const luckObj = { age: `${start}-${end}`, gan: l.gan, zhi: l.zhi, god: l.tenGod, isCurrent: l.isCurrent };
            if (type === 'academic' && start < 25 && end > 5 && (god && (god.includes('印') || god.includes('伤') || god.includes('食')))) res.push(luckObj);
            if (type === 'marriage' && end > 16) res.push(luckObj);
        });
        return res;
    }
}

const BaziProcessor = { createContext: (data) => new BaziContext(data) };

// === Main Entry Point ===

function calculateBazi(dateObj, gender, manualGZ = null, unknownHour = false) {
    if (!dateObj && (!manualGZ || manualGZ.length < 8)) return null;
    const isMale = (gender === 'M' || gender === '1' || gender === '男' || gender === 'male');
    let pillars = [];
    let solarStr = '', lunarStr = '';

    if (dateObj) {
        const s = Solar.fromDate(dateObj), l = s.getLunar(), b = l.getEightChar();
        pillars = [
            { gan: b.getYearGan(), zhi: b.getYearZhi(), naYin: b.getYearNaYin() },
            { gan: b.getMonthGan(), zhi: b.getMonthZhi(), naYin: b.getMonthNaYin() },
            { gan: b.getDayGan(), zhi: b.getDayZhi(), naYin: b.getDayNaYin() },
            { gan: unknownHour ? '' : b.getTimeGan(), zhi: unknownHour ? '' : b.getTimeZhi(), naYin: unknownHour ? '' : b.getTimeNaYin(), isUnknown: unknownHour }
        ];
        solarStr = `${s.getYear()}-${s.getMonth()}-${s.getDay()} ${unknownHour ? '(时辰未知)' : s.getHour() + ':00:00'} (公历)`;
        lunarStr = `${l.getYearInGanZhi()}年${l.getMonthInChinese()}月${l.getDayInChinese()} (农历)`;
    } else {
        pillars = [
            { gan: manualGZ[0], zhi: manualGZ[1], naYin: NAYIN[manualGZ[0] + manualGZ[1]] || '' },
            { gan: manualGZ[2], zhi: manualGZ[3], naYin: NAYIN[manualGZ[2] + manualGZ[3]] || '' },
            { gan: manualGZ[4], zhi: manualGZ[5], naYin: NAYIN[manualGZ[4] + manualGZ[5]] || '' },
            { gan: manualGZ[6], zhi: manualGZ[7], naYin: NAYIN[manualGZ[6] + manualGZ[7]] || '' }
        ];
        solarStr = '反推模式 (无日期)';
        lunarStr = '仅作结构排盘';
    }

    const dayGan = pillars[2].gan;
    const processed = pillars.map((p, i) => {
        const stemGod = (i === 2 ? (isMale ? '元男' : '元女') : getTenGod(dayGan, p.gan));
        const hidden = (HIDDEN_STEMS_MAP[p.zhi] || []).map((h, hIdx) => ({
            stem: h,
            god: getTenGod(dayGan, h),
            type: hIdx === 0 ? 'Main' : 'Hidden'
        }));
        const branchGod = hidden.length > 0 ? hidden[0].god : "";

        return {
            ...p,
            stem: { char: p.gan, god: stemGod, color: getColor(p.gan) },
            branch: { char: p.zhi, god: branchGod, color: getColor(p.zhi) },
            gan: p.gan,
            ganColor: getColor(p.gan),
            zhi: p.zhi,
            zhiColor: getColor(p.zhi),
            tenGod: stemGod,
            hidden: hidden,
            naYin: p.naYin || '',
            shenSha: getShenSha(pillars[0].gan, pillars[0].zhi, pillars[1].zhi, dayGan, pillars[2].zhi, p.gan, p.zhi, pillars[0].naYin, pillars[2].naYin, i, pillars),
            kongWang: p.isUnknown ? '' : getKongWang(p.gan, p.zhi)
        };
    });

    const interactions = getInteractions(processed);

    // === Expert Evaluation (Object-Oriented Bridge) ===
    let wangShuaiResult = { detail: [], summary: {} };

    // 1. Create Baseline OO Context (Inherits basic strengths from month branch, without specific Yong/Ji yet)
    const ctx = BaziProcessor.createContext({
        pillars: processed,
        interactions: interactions
    });

    let bs = { level: '中和', percentage: 50, score: 50, max: 100, profile: [], isGuanYin: false, logs: [] };
    let yxj = { mode: '扶抑', yong: '木', xi: '火', ji: '金', reason: '默认' };

    // 2. Compute Native OO Body Strength and YongXiJi using instances
    if (typeof window.AnalysisEngine !== 'undefined' && window.AnalysisEngine.calculateOOBodyStrength) {
        bs = window.AnalysisEngine.calculateOOBodyStrength(ctx);
        yxj = window.AnalysisEngine.calculateOOYongXiJi(ctx, bs);
    }

    // 3. Inject new OO findings back into the context nodes to drive downstream logic
    ctx.dayMaster.strength = bs.level;
    ctx.raw.bodyStrength = bs;
    ctx.raw.yongXiJi = yxj;

    // Use proper WX mappings for elements
    const yElements = new Set(yxj.yong ? [yxj.yong] : []);
    const jElements = new Set(yxj.ji ? [yxj.ji] : []);

    // Refresh node flags based on native OO calculation
    ctx.gods.forEach(g => {
        if (g) {
            // Note: g.wx is already the element ('木', '火', etc.)
            if (yElements.has(g.wx)) g.isYong = true;
            if (jElements.has(g.wx)) g.isJi = true;
        }
    });

    // 4. Call AnalysisEngine Details with the populated Context
    if (typeof window.AnalysisEngine !== 'undefined') {
        // Guard for getPillarStrengthDetails, assuming it's part of AnalysisEngine
        // This guard should ideally be inside the getPillarStrengthDetails function itself in analysis_engine.js
        // For now, we'll assume the external function is robust or that the context is always valid here.
        // The instruction implies adding this guard *within* the definition of getPillarStrengthDetails,
        // which is not in this file.
        // If the intention was to add a guard *before* calling it, it would look like this:
        // if (!ctx || !ctx.gods || ctx.gods.length === 0) { /* handle error or return empty */ }
        const details = window.AnalysisEngine.getPillarStrengthDetails(ctx);

        if (details && details.length > 0) {
            wangShuaiResult.detail = details;

            // 3. Map Results back to summary for legacy consumers
            details.forEach(item => {
                const cat = getCat(item.mainGod);
                if (cat) {
                    if (!wangShuaiResult.summary[cat]) wangShuaiResult.summary[cat] = { isYong: false, isJi: false };
                    if (item.isYongShen) wangShuaiResult.summary[cat].isYong = true;
                    if (item.isJiShen) wangShuaiResult.summary[cat].isJi = true;
                }

                // Categorical check for all gods in this position
                (item.gods || []).forEach(g => {
                    const gCat = getCat(g.god);
                    if (gCat) {
                        if (!wangShuaiResult.summary[gCat]) wangShuaiResult.summary[gCat] = { isYong: false, isJi: false };
                        if (g.isYongShen) wangShuaiResult.summary[gCat].isYong = true;
                        if (g.isJiShen) wangShuaiResult.summary[gCat].isJi = true;
                    }
                });
            });

            // Sync the context with the final summary
            ctx.raw.wangShuaiSummary = wangShuaiResult.summary;

            // NEW: Back-sync rich details to OO nodes for internal consistency
            details.forEach(item => {
                const nodeIdx = (item.pIdx * 2) + (item.label.includes('干') ? 0 : 1);
                const mainNode = ctx.getGodByIndex(nodeIdx);
                if (mainNode) {
                    mainNode.strength = item.status;
                    mainNode.yueLing = item.yueLing;
                    mainNode.restrictionDetails = item.restrictionDetails;
                    mainNode.isRestricted = item.isRestricted;
                }
                // Also sync hidden stems for branches
                if (item.label.includes('支')) {
                    item.gods.forEach((gData, idx) => {
                        if (idx > 0) { // Secondary hidden stems
                            const hNode = ctx.gods.find(n => n && !n.isStem && n.pillarIndex === item.pIdx && n.char === gData.char && n.isSecondary);
                            if (hNode) {
                                hNode.strength = gData.status;
                                hNode.yueLing = item.yueLing; // Hidden stems share branch yueLing status
                                hNode.restrictionDetails = item.restrictionDetails;
                            }
                        }
                    });
                }
            });
        }
    }

    // 4. Attach detailed status back to raw objects for UI compatibility
    processed.forEach((p, i) => {
        const labelMap = { 0: '年', 1: '月', 2: '日', 3: '时' };
        const sData = wangShuaiResult.detail.find(d => d.label === labelMap[i] + '干');
        const bData = wangShuaiResult.detail.find(d => d.label === labelMap[i] + '支');

        p.stem.wangShuai = sData || { status: (i === 2 ? '旺' : '衰'), isRestricted: false };
        p.branch.wangShuai = bData || { status: '旺', isRestricted: false };
    });

    const baziData = {
        dateStr: solarStr,
        lunarStr: lunarStr,
        isMale: isMale,
        pillars: processed,
        bodyStrength: bs,
        yongXiJi: yxj,
        interactions: interactions,
        wangShuaiSummary: wangShuaiResult.summary,
        ctx: ctx // Attach the context
    };

    // Dynamic Luck Cycles
    let daYunList = [];
    let currentDy = null;
    const nowYear = new Date().getFullYear();

    if (dateObj) {
        const s = Solar.fromDate(dateObj), b = s.getLunar().getEightChar();
        const yun = b.getYun(isMale ? 1 : 0);
        daYunList = yun.getDaYun().filter(dy => dy.getGanZhi()).map(dy => {
            const gz = dy.getGanZhi();
            const dyGan = gz[0], dyZhi = gz[1];
            const dyNaYin = NAYIN[dyGan + dyZhi] || '';

            const lns = dy.getLiuNian().slice(0, 10).map(ln => {
                const lnGz = ln.getGanZhi();
                const lnGan = lnGz[0], lnZhi = lnGz[1];
                const lnNaYin = NAYIN[lnGan + lnZhi] || '';
                const lnGod = getTenGod(dayGan, lnGan);

                // For Shen Sha, use 4 natal pillars + self
                const lnHidden = (HIDDEN_STEMS_MAP[lnZhi] || []).map(h => ({ stem: h, god: getTenGod(dayGan, h) }));

                return {
                    year: ln.getYear(), age: ln.getAge(), ganZhi: lnGz,
                    gan: lnGan, zhi: lnZhi,
                    ganColor: getColor(lnGan), zhiColor: getColor(lnZhi),
                    tenGod: lnGod,
                    naYin: lnNaYin,
                    hidden: lnHidden,
                    shenSha: getShenSha(pillars[0].gan, pillars[0].zhi, pillars[1].zhi, dayGan, pillars[2].zhi, lnGan, lnZhi, pillars[0].naYin, pillars[2].naYin, 5, pillars),
                    kongWang: getKongWang(lnGan, lnZhi)
                };
            });

            const dyGod = getTenGod(dayGan, dyGan);
            const dyHidden = (HIDDEN_STEMS_MAP[dyZhi] || []).map(h => ({ stem: h, god: getTenGod(dayGan, h) }));

            return {
                ganZhi: gz, gan: dyGan, zhi: dyZhi,
                ganColor: getColor(dyGan), zhiColor: getColor(dyZhi),
                startAge: dy.getStartAge(), startYear: dy.getStartYear(),
                tenGod: dyGod,
                naYin: dyNaYin,
                hidden: dyHidden,
                liuNian: lns,
                shenSha: getShenSha(pillars[0].gan, pillars[0].zhi, pillars[1].zhi, dayGan, pillars[2].zhi, dyGan, dyZhi, pillars[0].naYin, pillars[2].naYin, 4, pillars),
                kongWang: getKongWang(dyGan, dyZhi)
            };
        });
        currentDy = daYunList.find(dy => nowYear >= dy.startYear && nowYear < dy.startYear + 10) || daYunList[0];
    }

    // 5. Update Context with final data (including Luck Cycles)
    ctx.raw.daYunList = daYunList;
    ctx.raw.currentDaYun = currentDy;
    ctx.raw.selectedLiuNian = currentDy?.liuNian?.find(ln => ln.year === nowYear) || null;

    // Sync context pillars for expert report compatibility
    if (ctx.pillars) {
        if (currentDy) ctx.pillars[4] = currentDy;
        if (ctx.raw.selectedLiuNian) ctx.pillars[5] = ctx.raw.selectedLiuNian;
    }

    const finalResult = {
        ...baziData,
        daYunList: daYunList,
        currentDaYun: currentDy,
        selectedLiuNian: ctx.raw.selectedLiuNian,
        solarDate: solarStr,
        lunarDate: lunarStr,
        intDate: dateObj ? dateObj.getTime() : Date.now(),
        gender: isMale ? '男' : '女'
    };

    return finalResult;
}

// === Exports ===
window.getCat = getCat;
window.calculateBazi = calculateBazi;
window.getColor = getColor;
window.getInteractions = getInteractions;
window.getTenGod = getTenGod;
window.BaziProcessor = BaziProcessor;
window.BaziContext = BaziContext;
window.calculateGlobalScores = calculateGlobalScores;
window.getAllEarthStatuses = getAllEarthStatuses;
window.getFiveElementProfile = getFiveElementProfile;
window.GAN = GAN;
window.ZHI = ZHI;
window.GAN_WX = GAN_WX;
window.ZHI_WX = ZHI_WX;
window.NAYIN = NAYIN;
window.TEN_GODS = TEN_GODS;

