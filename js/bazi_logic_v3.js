// import { Solar, Lunar } from 'lunar-javascript';
// import { YEAR_MAP } from './year_map.js';

// === Constants (1:1 from Python) ===
/*
const GAN = ["\u7532", "\u4e59", "\u4e19", "\u4e01", "\u620a", "\u5df1", "\u5e9a", "\u8f9b", "\u58ec", "\u7678"];
const ZHI = ["\u5b50", "\u4e11", "\u5bc5", "\u536f", "\u8fb0", "\u5df3", "\u5348", "\u672a", "\u7533", "\u9149", "\u620c", "\u4ea5"];

const GAN_WX = {
    '\u7532': '\u6728', '\u4e59': '\u6728', '\u4e19': '\u706b', '\u4e01': '\u706b', '\u620a': '\u571f',
    '\u5df1': '\u571f', '\u5e9a': '\u91d1', '\u8f9b': '\u91d1', '\u58ec': '\u6c34', '\u7678': '\u6c34'
};

const ZHI_WX = {
    '\u5b50': '\u6c34', '\u4e11': '\u571f', '\u5bc5': '\u6728', '\u536f': '\u6728', '\u8fb0': '\u571f', '\u5df3': '\u706b',
    '\u5348': '\u706b', '\u672a': '\u571f', '\u7533': '\u91d1', '\u9149': '\u91d1', '\u620c': '\u571f', '\u4ea5': '\u6c34'
};
*/

/*
const HIDDEN_STEMS_MAP = {
    '\u5b50': ['\u7678'],
    '\u4e11': ['\u5df1', '\u7678', '\u8f9b'],
    '\u5bc5': ['\u7532', '\u4e19', '\u620a'],
    '\u536f': ['\u4e59'],
    '\u8fb0': ['\u620a', '\u4e59', '\u7678'],
    '\u5df3': ['\u4e19', '\u5e9a', '\u620a'],
    '\u5348': ['\u4e01', '\u5df1'],
    '\u672a': ['\u5df1', '\u4e01', '\u4e59'],
    '\u7533': ['\u5e9a', '\u58ec', '\u620a'],
    '\u9149': ['\u8f9b'],
    '\u620c': ['\u620a', '\u8f9b', '\u4e01'],
    '\u4ea5': ['\u58ec', '\u7532']
};
*/

/*
const NAYIN = {
    '\u7532\u5b50': '\u6d77\u4e2d\u91d1', '\u4e59\u4e11': '\u6d77\u4e2d\u91d1', '\u4e19\u5bc5': '\u7089\u4e2d\u706b', '\u4e01\u536f': '\u7089\u4e2d\u706b',
    '\u620a\u8fb0': '\u5927\u6797\u6728', '\u5df1\u5df3': '\u5927\u6797\u6728', '\u5e9a\u5348': '\u8def\u65c1\u571f', '\u8f9b\u672a': '\u8def\u65c1\u571f',
    '\u58ec\u7533': '\u5251\u950b\u91d1', '\u7678\u9149': '\u5251\u950b\u91d1', '\u7532\u620c': '\u5c71\u5934\u706b', '\u4e59\u4ea5': '\u5c71\u5934\u706b',
    '\u4e19\u5b50': '\u6da7\u4e0b\u6c34', '\u4e01\u4e11': '\u6da7\u4e0b\u6c34', '\u620a\u5bc5': '\u57ce\u5934\u571f', '\u5df1\u536f': '\u57ce\u5934\u571f',
    '\u5e9a\u8fb0': '\u767d\u8721\u91d1', '\u8f9b\u5df3': '\u767d\u8721\u91d1', '\u58ec\u5348': '\u6768\u67f3\u6728', '\u7678\u672a': '\u6768\u67f3\u6728',
    '\u7532\u7533': '\u6cc9\u4e2d\u6c34', '\u4e59\u9149': '\u6cc9\u4e2d\u6c34', '\u4e19\u620c': '\u5c4b\u4e0a\u571f', '\u4e01\u4ea5': '\u5c4b\u4e0a\u571f',
    '\u620a\u5b50': '\u9739\u96f3\u706b', '\u5df1\u4e11': '\u9739\u96f3\u706b', '\u5e9a\u5bc5': '\u677e\u67cf\u6728', '\u8f9b\u536f': '\u677e\u67cf\u6728',
    '\u58ec\u8fb0': '\u957f\u6d41\u6c34', '\u7678\u5df3': '\u957f\u6d41\u6c34', '\u7532\u5348': '\u7802\u4e2d\u91d1', '\u4e59\u672a': '\u7802\u4e2d\u91d1',
    '\u4e19\u7533': '\u5c71\u4e0b\u706b', '\u4e01\u9149': '\u5c71\u4e0b\u706b', '\u620a\u620c': '\u5e73\u5730\u6728', '\u5df1\u4ea5': '\u5e73\u5730\u6728',
    '\u5e9a\u5b50': '\u58c1\u4e0a\u571f', '\u8f9b\u4e11': '\u58c1\u4e0a\u571f', '\u58ec\u5bc5': '\u91d1\u7b94\u91d1', '\u7678\u536f': '\u91d1\u7b94\u91d1',
    '\u7532\u8fb0': '\u8986\u706f\u706b', '\u4e59\u5df3': '\u8986\u706f\u706b', '\u4e19\u5348': '\u5929\u6cb3\u6c34', '\u4e01\u672a': '\u5929\u6cb3\u6c34',
    '\u620a\u7533': '\u5927\u9a7f\u571f', '\u5df1\u9149': '\u5927\u9a7f\u571f', '\u5e9a\u620c': '\u9497\u948f\u91d1', '\u8f9b\u4ea5': '\u9497\u948f\u91d1',
    '\u58ec\u5b50': '\u6851\u67d8\u6728', '\u7678\u4e11': '\u6851\u67d8\u6851', '\u7532\u5bc5': '\u5927\u6eaa\u6c34', '\u4e59\u536f': '\u5927\u6eaa\u6c34',
    '\u4e19\u8fb0': '\u6c99\u4e2d\u571f', '\u4e01\u5df3': '\u6c99\u4e2d\u571f', '\u620a\u5348': '\u5929\u4e0a\u706b', '\u5df1\u672a': '\u5929\u4e0a\u706b',
    '\u5e9a\u7533': '\u77f3\u69b4\u6728', '\u8f9b\u9149': '\u77f3\u69b4\u6728', '\u58ec\u620c': '\u5927\u6d77\u6c34', '\u7678\u4ea5': '\u5927\u6d77\u6c34'
};
*/

/*
const CHANG_SHENG = {
    '\u6728': { '\u4ea5': '\u957f\u751f', '\u5b50': '\u6c91\u6d74', '\u4e11': '\u51a0\u5e26', '\u5bc5': '\u4e34\u5b98', '\u536f': '\u5e1d\u65fa', '\u8fb0': '\u8870', '\u5df3': '\u75c5', '\u5348': '\u6b7b', '\u672a': '\u5e93', '\u7533': '\u7edd', '\u9149': '\u80ce', '\u620c': '\u517b' },
    '\u706b': { '\u5bc5': '\u957f\u751f', '\u536f': '\u6c91\u6d74', '\u8fb0': '\u51a0\u5e26', '\u5df3': '\u4e34\u5b98', '\u5348': '\u5e1d\u65fa', '\u672a': '\u8870', '\u7533': '\u75c5', '\u9149': '\u6b7b', '\u620c': '\u5e93', '\u4ea5': '\u7edd', '\u5b50': '\u80ce', '\u4e11': '\u517b' },
    '\u571f': { '\u5bc5': '\u957f\u751f', '\u536f': '\u6c91\u6d74', '\u8fb0': '\u51a0\u5e26', '\u5df3': '\u4e34\u5b98', '\u5348': '\u5e1d\u65fa', '\u672a': '\u8870', '\u7533': '\u75c5', '\u9149': '\u6b7b', '\u620c': '\u5e93', '\u4ea5': '\u7edd', '\u5b50': '\u80ce', '\u4e11': '\u517b' },
    '\u91d1': { '\u5df3': '\u957f\u751f', '\u5348': '\u6c91\u6d74', '\u672a': '\u51a0\u5e26', '\u7533': '\u4e34\u5b98', '\u9149': '\u5e1d\u65fa', '\u620c': '\u8870', '\u4ea5': '\u75c5', '\u5b50': '\u6b7b', '\u4e11': '\u5e93', '\u5bc5': '\u7edd', '\u536f': '\u80ce', '\u8fb0': '\u517b' },
    '\u6c34': { '\u7533': '\u957f\u751f', '\u9149': '\u6c91\u6d74', '\u620c': '\u51a0\u5e26', '\u4ea5': '\u4e34\u5b98', '\u5b50': '\u5e1d\u65fa', '\u4e11': '\u8870', '\u5bc5': '\u75c5', '\u536f': '\u6b7b', '\u8fb0': '\u5e93', '\u5df3': '\u7edd', '\u5348': '\u80ce', '\u672a': '\u517b' }
};
*/

/*
const TEN_GODS = {
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
*/

/*
const CRASH_MAP = {
    '子': '午', '午': '子', '丑': '未', '未': '丑',
    '寅': '申', '申': '寅', '卯': '酉', '酉': '卯',
    '辰': '戌', '戌': '辰', '巳': '亥', '亥': '巳'
};

const GAN_HE = {
    '甲': '己', '己': '甲', '乙': '庚', '庚': '乙',
    '丙': '辛', '辛': '丙', '丁': '壬', '壬': '丁',
    '戊': '癸', '癸': '戊'
};
*/

/*
const SHEN_SHA_RULES = {
    // 1. \u8d35\u4eba\u7cfb\u5217 (Noble Stars)
    '\u5929\u4e59\u8d35\u4eba': (info) =>
        (['\u7532', '\u620a', '\u5e9a'].includes(info.yearGan) && ['\u4e11', '\u672a'].includes(info.zhi)) ||
        (['\u7532', '\u620a', '\u5e9a'].includes(info.dayGan) && ['\u4e11', '\u672a'].includes(info.zhi)) ||
        (['\u4e59', '\u5df1'].includes(info.yearGan) && ['\u5b50', '\u7533'].includes(info.zhi)) ||
        (['\u4e59', '\u5df1'].includes(info.dayGan) && ['\u5b50', '\u7533'].includes(info.zhi)) ||
        (['\u4e19', '\u4e01'].includes(info.yearGan) && ['\u4ea5', '\u9149'].includes(info.zhi)) ||
        (['\u4e19', '\u4e01'].includes(info.dayGan) && ['\u4ea5', '\u9149'].includes(info.zhi)) ||
        (['\u58ec', '\u7678'].includes(info.yearGan) && ['\u536f', '\u5df3'].includes(info.zhi)) ||
        (['\u58ec', '\u7678'].includes(info.dayGan) && ['\u536f', '\u5df3'].includes(info.zhi)) ||
        (info.yearGan === '\u8f9b' && ['\u5bc5', '\u5348'].includes(info.zhi)) ||
        (info.dayGan === '\u8f9b' && ['\u5bc5', '\u5348'].includes(info.zhi)),

    '\u5929\u5fb7\u8d35\u4eba': (info) =>
        (info.monthZhi === '\u5bc5' && info.stem === '\u4e01') ||
        (info.monthZhi === '\u536f' && info.zhi === '\u7533') ||
        (info.monthZhi === '\u8fb0' && info.stem === '\u58ec') ||
        (info.monthZhi === '\u5df3' && info.stem === '\u8f9b') ||
        (info.monthZhi === '\u5348' && info.zhi === '\u4ea5') ||
        (info.monthZhi === '\u672a' && info.stem === '\u7532') ||
        (info.monthZhi === '\u7533' && info.stem === '\u7678') ||
        (info.monthZhi === '\u9149' && info.zhi === '\u5bc5') ||
        (info.monthZhi === '\u620c' && info.stem === '\u4e19') ||
        (info.monthZhi === '\u4ea5' && info.stem === '\u4e59') ||
        (info.monthZhi === '\u5b50' && info.zhi === '\u5df3') ||
        (info.monthZhi === '\u4e11' && info.stem === '\u5e9a'),

    '\u6708\u5fb7\u8d35\u4eba': (info) =>
        (['\u5bc5', '\u5348', '\u620c'].includes(info.monthZhi) && info.stem === '\u4e19') ||
        (['\u7533', '\u5b50', '\u8fb0'].includes(info.monthZhi) && info.stem === '\u58ec') ||
        (['\u4ea5', '\u536f', '\u672a'].includes(info.monthZhi) && info.stem === '\u7532') ||
        (['\u5df3', '\u9149', '\u4e11'].includes(info.monthZhi) && info.stem === '\u5e9a'),

    '\u592a\u6781\u8d35\u4eba': (info) =>
        (['\u7532', '\u4e59'].includes(info.dayGan) && ['\u5b50', '\u5348'].includes(info.zhi)) ||
        (['\u7532', '\u4e59'].includes(info.yearGan) && ['\u5b50', '\u5348'].includes(info.zhi)) ||
        (['\u4e19', '\u4e01'].includes(info.dayGan) && ['\u9149', '\u536f'].includes(info.zhi)) ||
        (['\u4e19', '\u4e01'].includes(info.yearGan) && ['\u9149', '\u536f'].includes(info.zhi)) ||
        (['\u620a', '\u5df1'].includes(info.dayGan) && ['\u8fb0', '\u620c', '\u4e11', '\u672a'].includes(info.zhi)) ||
        (['\u620a', '\u5df1'].includes(info.yearGan) && ['\u8fb0', '\u620c', '\u4e11', '\u672a'].includes(info.zhi)) ||
        (['\u5e9a', '\u8f9b'].includes(info.dayGan) && ['\u5bc5', '\u4ea5'].includes(info.zhi)) ||
        (['\u5e9a', '\u8f9b'].includes(info.yearGan) && ['\u5bc5', '\u4ea5'].includes(info.zhi)) ||
        (['\u58ec', '\u7678'].includes(info.dayGan) && ['\u5df3', '\u7533'].includes(info.zhi)) ||
        (['\u58ec', '\u7678'].includes(info.yearGan) && ['\u5df3', '\u7533'].includes(info.zhi)),

        '\u798f\u661f\u8d35\u4eba': (info) =>
            (info.dayGan === '\u7532' && ['\u5bc5', '\u5b50'].includes(info.zhi)) ||
            (info.yearGan === '\u7532' && ['\u5bc5', '\u5b50'].includes(info.zhi)) ||
            (info.dayGan === '\u4e59' && ['\u4e11', '\u536f'].includes(info.zhi)) ||
            (info.yearGan === '\u4e59' && ['\u4e11', '\u536f'].includes(info.zhi)) ||
            (info.dayGan === '\u4e19' && info.zhi === '\u5b50') ||
            (info.yearGan === '\u4e19' && info.zhi === '\u5b50') ||
            (info.dayGan === '\u4e01' && info.zhi === '\u9149') ||
            (info.yearGan === '\u4e01' && info.zhi === '\u9149') ||
            (info.dayGan === '\u620a' && info.zhi === '\u7533') ||
            (info.yearGan === '\u620a' && info.zhi === '\u7533') ||
            (info.dayGan === '\u5df1' && info.zhi === '\u672a') ||
            (info.yearGan === '\u5df1' && info.zhi === '\u672a') ||
            (info.dayGan === '\u5e9a' && ['\u5348', '\u5df3'].includes(info.zhi)) ||
            (info.yearGan === '\u5e9a' && ['\u5348', '\u5df3'].includes(info.zhi)) ||
            (info.dayGan === '\u8f9b' && info.zhi === '\u5df3') ||
            (info.yearGan === '\u8f9b' && info.zhi === '\u5df3') ||
            (info.dayGan === '\u58ec' && info.zhi === '\u8fb0') ||
            (info.yearGan === '\u58ec' && info.zhi === '\u8fb0') ||
            (info.dayGan === '\u7678' && ['\u536f', '\u4e11'].includes(info.zhi)) ||
            (info.yearGan === '\u7678' && ['\u536f', '\u4e11'].includes(info.zhi)),

            '\u798f\u5fb7\u8d35\u4eba': (info) =>
                (['\u7532', '\u4e59'].includes(info.dayGan) && ['\u5df3', '\u5348'].includes(info.zhi)) ||
                (['\u4e19', '\u620a'].includes(info.dayGan) && info.zhi === '\u7533') ||
                (['\u4e01', '\u5df1'].includes(info.dayGan) && ['\u4ea5', '\u9149'].includes(info.zhi)) ||
                (['\u5e9a', '\u8f9b'].includes(info.dayGan) && info.zhi === '\u5bc5') ||
                (['\u58ec', '\u7678'].includes(info.dayGan) && info.zhi === '\u536f'),

                // 2. \u5b66\u4e1a\u667a\u6167 (Academic)
                '\u6587\u660c\u8d35\u4eba': (info) =>
                    (info.dayGan === '\u7532' && info.zhi === '\u5df3') ||
                    (info.dayGan === '\u4e59' && info.zhi === '\u5348') ||
                    (['\u4e19', '\u620a'].includes(info.dayGan) && info.zhi === '\u7533') ||
                    (['\u4e01', '\u5df1'].includes(info.dayGan) && info.zhi === '\u9149') ||
                    (info.dayGan === '\u5e9a' && info.zhi === '\u4ea5') ||
                    (info.dayGan === '\u8f9b' && info.zhi === '\u5b50') ||
                    (info.dayGan === '\u58ec' && info.zhi === '\u5bc5') ||
                    (info.dayGan === '\u7678' && info.zhi === '\u536f') ||
                    (info.yearGan === '\u7532' && info.zhi === '\u5df3') ||
                    (info.yearGan === '\u4e59' && info.zhi === '\u5348') ||
                    (['\u4e19', '\u620a'].includes(info.yearGan) && info.zhi === '\u7533') ||
                    (['\u4e01', '\u5df1'].includes(info.yearGan) && info.zhi === '\u9149') ||
                    (info.yearGan === '\u5e9a' && info.zhi === '\u4ea5') ||
                    (info.yearGan === '\u8f9b' && info.zhi === '\u5b50') ||
                    (info.yearGan === '\u58ec' && info.zhi === '\u5bc5') ||
                    (info.yearGan === '\u7678' && info.zhi === '\u536f'),

                    '\u5b66\u5802': (info) =>
                        (info.yearNaYin && info.yearNaYin.includes('\u91d1') && info.zhi === '\u5df3') ||
                        (info.yearNaYin && info.yearNaYin.includes('\u6728') && info.zhi === '\u4ea5') ||
                        (info.yearNaYin && info.yearNaYin.includes('\u6c34') && info.zhi === '\u7533') ||
                        (info.yearNaYin && info.yearNaYin.includes('\u706b') && info.zhi === '\u5bc5') ||
                        (info.yearNaYin && info.yearNaYin.includes('\u571f') && info.zhi === '\u7533'),

                        '\u8bcd\u9986': (info) =>
                            (info.yearNaYin && info.yearNaYin.includes('\u91d1') && info.zhi === '\u7533') ||
                            (info.yearNaYin && info.yearNaYin.includes('\u6728') && info.zhi === '\u5bc5') ||
                            (info.yearNaYin && info.yearNaYin.includes('\u6c34') && info.zhi === '\u4ea5') ||
                            (info.yearNaYin && info.yearNaYin.includes('\u706b') && info.zhi === '\u5df3') ||
                            (info.yearNaYin && info.yearNaYin.includes('\u571f') && info.zhi === '\u5bc5'),

                            // 3. \u8d22\u8fd0\u4e8b\u4e1a
                            '\u7984\u795e': (info) =>
                                (info.dayGan === '\u7532' && info.zhi === '\u5bc5') ||
                                (info.dayGan === '\u4e59' && info.zhi === '\u536f') ||
                                (['\u4e19', '\u620a'].includes(info.dayGan) && info.zhi === '\u5df3') ||
                                (['\u4e01', '\u5df1'].includes(info.dayGan) && info.zhi === '\u5348') ||
                                (info.dayGan === '\u5e9a' && info.zhi === '\u7533') ||
                                (info.dayGan === '\u8f9b' && info.zhi === '\u9149') ||
                                (info.dayGan === '\u58ec' && info.zhi === '\u4ea5') ||
                                (info.dayGan === '\u7678' && info.zhi === '\u5b50') ||
                                (info.yearGan === '\u7532' && info.zhi === '\u5bc5') ||
                                (info.yearGan === '\u4e59' && info.zhi === '\u536f') ||
                                (['\u4e19', '\u620a'].includes(info.yearGan) && info.zhi === '\u5df3') ||
                                (['\u4e01', '\u5df1'].includes(info.yearGan) && info.zhi === '\u5348') ||
                                (info.yearGan === '\u5e9a' && info.zhi === '\u7533') ||
                                (info.yearGan === '\u8f9b' && info.zhi === '\u9149') ||
                                (info.yearGan === '\u58ec' && info.zhi === '\u4ea5') ||
                                (info.yearGan === '\u7678' && info.zhi === '\u5b50'),

                                '\u91d1\u8206': (info) =>
                                    (info.dayGan === '\u7532' && info.zhi === '\u8fb0') ||
                                    (info.dayGan === '\u4e59' && info.zhi === '\u5df3') ||
                                    (['\u4e19', '\u620a'].includes(info.dayGan) && info.zhi === '\u672a') ||
                                    (['\u4e01', '\u5df1'].includes(info.dayGan) && info.zhi === '\u7533') ||
                                    (info.dayGan === '\u5e9a' && info.zhi === '\u620c') ||
                                    (info.dayGan === '\u8f9b' && info.zhi === '\u4ea5') ||
                                    (info.dayGan === '\u58ec' && info.zhi === '\u4e11') ||
                                    (info.dayGan === '\u7678' && info.zhi === '\u5bc5') ||
                                    (info.yearGan === '\u7532' && info.zhi === '\u8fb0') ||
                                    (info.yearGan === '\u4e59' && info.zhi === '\u5df3') ||
                                    (['\u4e19', '\u620a'].includes(info.yearGan) && info.zhi === '\u672a') ||
                                    (['\u4e01', '\u5df1'].includes(info.yearGan) && info.zhi === '\u7533') ||
                                    (info.yearGan === '\u5e9a' && info.zhi === '\u620c') ||
                                    (info.yearGan === '\u8f9b' && info.zhi === '\u4ea5') ||
                                    (info.yearGan === '\u58ec' && info.zhi === '\u4e11') ||
                                    (info.yearGan === '\u7678' && info.zhi === '\u5bc5'),

                                    '\u9a7f\u9a6c': (info) =>
                                        (['\u7533', '\u5b50', '\u8fb0'].includes(info.yearZhi) && info.zhi === '\u5bc5') ||
                                        (['\u7533', '\u5b50', '\u8fb0'].includes(info.dayZhi) && info.zhi === '\u5bc5') ||
                                        (['\u5bc5', '\u5348', '\u620c'].includes(info.yearZhi) && info.zhi === '\u7533') ||
                                        (['\u5bc5', '\u5348', '\u620c'].includes(info.dayZhi) && info.zhi === '\u7533') ||
                                        (['\u4ea5', '\u536f', '\u672a'].includes(info.yearZhi) && info.zhi === '\u5df3') ||
                                        (['\u4ea5', '\u536f', '\u672a'].includes(info.dayZhi) && info.zhi === '\u5df3') ||
                                        (['\u5df3', '\u9149', '\u4e11'].includes(info.yearZhi) && info.zhi === '\u4ea5') ||
                                        (['\u5df3', '\u9149', '\u4e11'].includes(info.dayZhi) && info.zhi === '\u4ea5'),

                                        '\u5c06\u661f': (info) =>
                                            (['\u5bc5', '\u5348', '\u620c'].includes(info.yearZhi) && info.zhi === '\u5348') ||
                                            (['\u5bc5', '\u5348', '\u620c'].includes(info.dayZhi) && info.zhi === '\u5348') ||
                                            (['\u7533', '\u5b50', '\u8fb0'].includes(info.yearZhi) && info.zhi === '\u5b50') ||
                                            (['\u7533', '\u5b50', '\u8fb0'].includes(info.dayZhi) && info.zhi === '\u5b50') ||
                                            (['\u4ea5', '\u536f', '\u672a'].includes(info.yearZhi) && info.zhi === '\u536f') ||
                                            (['\u4ea5', '\u536f', '\u672a'].includes(info.dayZhi) && info.zhi === '\u536f') ||
                                            (['\u5df3', '\u9149', '\u4e11'].includes(info.yearZhi) && info.zhi === '\u9149') ||
                                            (['\u5df3', '\u9149', '\u4e11'].includes(info.dayZhi) && info.zhi === '\u9149'),

                                            // 4. \u5065\u5eb7\u5a5a\u59fb
                                            '\u5929\u533b': (info) =>
                                                (info.monthZhi === '\u5bc5' && info.zhi === '\u4e11') ||
                                                (info.monthZhi === '\u536f' && info.zhi === '\u5bc5') ||
                                                (info.monthZhi === '\u8fb0' && info.zhi === '\u536f') ||
                                                (info.monthZhi === '\u5df3' && info.zhi === '\u8fb0') ||
                                                (info.monthZhi === '\u5348' && info.zhi === '\u5df3') ||
                                                (info.monthZhi === '\u672a' && info.zhi === '\u5348') ||
                                                (info.monthZhi === '\u7533' && info.zhi === '\u672a') ||
                                                (info.monthZhi === '\u9149' && info.zhi === '\u7533') ||
                                                (info.monthZhi === '\u620c' && info.zhi === '\u9149') ||
                                                (info.monthZhi === '\u4ea5' && info.zhi === '\u620c') ||
                                                (info.monthZhi === '\u5b50' && info.zhi === '\u4ea5') ||
                                                (info.monthZhi === '\u4e11' && info.zhi === '\u5b50'),

                                                '\u5929\u559c': (info) =>
                                                    (info.yearZhi === '\u5b50' && info.zhi === '\u9149') ||
                                                    (info.yearZhi === '\u4e11' && info.zhi === '\u7533') ||
                                                    (info.yearZhi === '\u5bc5' && info.zhi === '\u672a') ||
                                                    (info.yearZhi === '\u536f' && info.zhi === '\u5348') ||
                                                    (info.yearZhi === '\u8fb0' && info.zhi === '\u5df3') ||
                                                    (info.yearZhi === '\u5df3' && info.zhi === '\u8fb0') ||
                                                    (info.yearZhi === '\u5348' && info.zhi === '\u536f') ||
                                                    (info.yearZhi === '\u672a' && info.zhi === '\u5bc5') ||
                                                    (info.yearZhi === '\u7533' && info.zhi === '\u4e11') ||
                                                    (info.yearZhi === '\u9149' && info.zhi === '\u5b50') ||
                                                    (info.yearZhi === '\u620c' && info.zhi === '\u4ea5') ||
                                                    (info.yearZhi === '\u4ea5' && info.zhi === '\u620c'),

                                                    '\u7ea2\u9e3e': (info) =>
                                                        (info.yearZhi === '\u5b50' && info.zhi === '\u536f') ||
                                                        (info.yearZhi === '\u4e11' && info.zhi === '\u5bc5') ||
                                                        (info.yearZhi === '\u5bc5' && info.zhi === '\u4e11') ||
                                                        (info.yearZhi === '\u536f' && info.zhi === '\u5b50') ||
                                                        (info.yearZhi === '\u8fb0' && info.zhi === '\u4ea5') ||
                                                        (info.yearZhi === '\u5df3' && info.zhi === '\u620c') ||
                                                        (info.yearZhi === '\u5348' && info.zhi === '\u9149') ||
                                                        (info.yearZhi === '\u672a' && info.zhi === '\u7533') ||
                                                        (info.yearZhi === '\u7533' && info.zhi === '\u672a') ||
                                                        (info.yearZhi === '\u9149' && info.zhi === '\u5348') ||
                                                        (info.yearZhi === '\u620c' && info.zhi === '\u5df3') ||
                                                        (info.yearZhi === '\u4ea5' && info.zhi === '\u8fb0'),

                                                        // 5. \u51f6\u715e
                                                        '\u7f8a\u5203': (info) =>
                                                            (info.dayGan === '\u7532' && info.zhi === '\u536f') ||
                                                            (info.dayGan === '\u4e59' && info.zhi === '\u5bc5') ||
                                                            (info.dayGan === '\u4e19' && info.zhi === '\u5348') ||
                                                            (info.dayGan === '\u4e01' && info.zhi === '\u5df3') ||
                                                            (info.dayGan === '\u620a' && info.zhi === '\u5348') ||
                                                            (info.dayGan === '\u5df1' && info.zhi === '\u5df3') ||
                                                            (info.dayGan === '\u5e9a' && info.zhi === '\u9149') ||
                                                            (info.dayGan === '\u8f9b' && info.zhi === '\u7533') ||
                                                            (info.dayGan === '\u58ec' && info.zhi === '\u5b50') ||
                                                            (info.dayGan === '\u7678' && info.zhi === '\u4ea5'),

                                                            '\u52ab\u715e': (info) =>
                                                                (['\u7533', '\u5b50', '\u8fb0'].includes(info.yearZhi) && info.zhi === '\u5df3') ||
                                                                (['\u7533', '\u5b50', '\u8fb0'].includes(info.dayZhi) && info.zhi === '\u5df3') ||
                                                                (['\u5bc5', '\u5348', '\u620c'].includes(info.yearZhi) && info.zhi === '\u4ea5') ||
                                                                (['\u5bc5', '\u5348', '\u620c'].includes(info.dayZhi) && info.zhi === '\u4ea5') ||
                                                                (['\u4ea5', '\u536f', '\u672a'].includes(info.yearZhi) && info.zhi === '\u7533') ||
                                                                (['\u4ea5', '\u536f', '\u672a'].includes(info.dayZhi) && info.zhi === '\u7533') ||
                                                                (['\u5df3', '\u9149', '\u4e11'].includes(info.yearZhi) && info.zhi === '\u5bc5') ||
                                                                (['\u5df3', '\u9149', '\u4e11'].includes(info.dayZhi) && info.zhi === '\u5bc5'),

                                                                '\u707e\u715e': (info) =>
                                                                    (['\u7533', '\u5b50', '\u8fb0'].includes(info.yearZhi) && info.zhi === '\u5348') ||
                                                                    (['\u7533', '\u5b50', '\u8fb0'].includes(info.dayZhi) && info.zhi === '\u5348') ||
                                                                    (['\u5bc5', '\u5348', '\u620c'].includes(info.yearZhi) && info.zhi === '\u5b50') ||
                                                                    (['\u5bc5', '\u5348', '\u620c'].includes(info.dayZhi) && info.zhi === '\u5b50') ||
                                                                    (['\u4ea5', '\u536f', '\u672a'].includes(info.yearZhi) && info.zhi === '\u9149') ||
                                                                    (['\u4ea5', '\u536f', '\u672a'].includes(info.dayZhi) && info.zhi === '\u9149') ||
                                                                    (['\u5df3', '\u9149', '\u4e11'].includes(info.yearZhi) && info.zhi === '\u536f') ||
                                                                    (['\u5df3', '\u9149', '\u4e11'].includes(info.dayZhi) && info.zhi === '\u536f'),

                                                                    '\u8840\u5203': (info) =>
                                                                        (['\u5bc5', '\u5348', '\u620c'].includes(info.yearZhi) && info.zhi === '\u5348') ||
                                                                        (['\u5bc5', '\u5348', '\u620c'].includes(info.dayZhi) && info.zhi === '\u5348') ||
                                                                        (['\u7533', '\u5b50', '\u8fb0'].includes(info.yearZhi) && info.zhi === '\u5b50') ||
                                                                        (['\u7533', '\u5b50', '\u8fb0'].includes(info.dayZhi) && info.zhi === '\u5b50') ||
                                                                        (['\u4ea5', '\u536f', '\u672a'].includes(info.yearZhi) && info.zhi === '\u536f') ||
                                                                        (['\u4ea5', '\u536f', '\u672a'].includes(info.dayZhi) && info.zhi === '\u536f') ||
                                                                        (['\u5df3', '\u9149', '\u4e11'].includes(info.yearZhi) && info.zhi === '\u9149') ||
                                                                        (['\u5df3', '\u9149', '\u4e11'].includes(info.dayZhi) && info.zhi === '\u9149'),

                                                                        '\u54b8\u6c60': (info) =>
                                                                            (['\u7533', '\u5b50', '\u8fb0'].includes(info.yearZhi) && info.zhi === '\u9149') ||
                                                                            (['\u7533', '\u5b50', '\u8fb0'].includes(info.dayZhi) && info.zhi === '\u9149') ||
                                                                            (['\u5bc5', '\u5348', '\u620c'].includes(info.yearZhi) && info.zhi === '\u536f') ||
                                                                            (['\u5bc5', '\u5348', '\u620c'].includes(info.dayZhi) && info.zhi === '\u536f') ||
                                                                            (['\u4ea5', '\u536f', '\u672a'].includes(info.yearZhi) && info.zhi === '\u5b50') ||
                                                                            (['\u4ea5', '\u536f', '\u672a'].includes(info.dayZhi) && info.zhi === '\u5b50') ||
                                                                            (['\u5df3', '\u9149', '\u4e11'].includes(info.yearZhi) && info.zhi === '\u5348') ||
                                                                            (['\u5df3', '\u9149', '\u4e11'].includes(info.dayZhi) && info.zhi === '\u5348'),

                                                                            '\u534e\u76d6': (info) =>
                                                                                (['\u5bc5', '\u5348', '\u620c'].includes(info.yearZhi) && info.zhi === '\u620c') ||
                                                                                (['\u5bc5', '\u5348', '\u620c'].includes(info.dayZhi) && info.zhi === '\u620c') ||
                                                                                (['\u7533', '\u5b50', '\u8fb0'].includes(info.yearZhi) && info.zhi === '\u8fb0') ||
                                                                                (['\u7533', '\u5b50', '\u8fb0'].includes(info.dayZhi) && info.zhi === '\u8fb0') ||
                                                                                (['\u4ea5', '\u536f', '\u672a'].includes(info.yearZhi) && info.zhi === '\u672a') ||
                                                                                (['\u4ea5', '\u536f', '\u672a'].includes(info.dayZhi) && info.zhi === '\u672a') ||
                                                                                (['\u5df3', '\u9149', '\u4e11'].includes(info.yearZhi) && info.zhi === '\u4e11') ||
                                                                                (['\u5df3', '\u9149', '\u4e11'].includes(info.dayZhi) && info.zhi === '\u4e11'),

                                                                                '\u5b64\u8fb0': (info) =>
                                                                                    (['\u5bc5', '\u536f', '\u8fb0'].includes(info.yearZhi) && info.zhi === '\u5df3') ||
                                                                                    (['\u5df3', '\u5348', '\u672a'].includes(info.yearZhi) && info.zhi === '\u7533') ||
                                                                                    (['\u7533', '\u9149', '\u620c'].includes(info.yearZhi) && info.zhi === '\u4ea5') ||
                                                                                    (['\u4ea5', '\u5b50', '\u4e11'].includes(info.yearZhi) && info.zhi === '\u5bc5'),

                                                                                    '\u5be1\u5bbf': (info) =>
                                                                                        (['\u5bc5', '\u536f', '\u8fb0'].includes(info.yearZhi) && info.zhi === '\u4e11') ||
                                                                                        (['\u5df3', '\u5348', '\u672a'].includes(info.yearZhi) && info.zhi === '\u8fb0') ||
                                                                                        (['\u7533', '\u9149', '\u620c'].includes(info.yearZhi) && info.zhi === '\u672a') ||
                                                                                        (['\u4ea5', '\u5b50', '\u4e11'].includes(info.yearZhi) && info.zhi === '\u620c'),

                                                                                        '\u4ea1\u795e': (info) =>
                                                                                            (['\u7533', '\u5b50', '\u8fb0'].includes(info.yearZhi) && info.zhi === '\u4ea5') ||
                                                                                            (['\u5bc5', '\u5348', '\u620c'].includes(info.yearZhi) && info.zhi === '\u5df3') ||
                                                                                            (['\u4ea5', '\u536f', '\u672a'].includes(info.yearZhi) && info.zhi === '\u5bc5') ||
                                                                                            (['\u5df3', '\u9149', '\u4e11'].includes(info.yearZhi) && info.zhi === '\u7533'),

                                                                                            '\u52fe\u7ede\u715e': (info) =>
                                                                                                (['\u5bc5', '\u7533'].includes(info.yearZhi) && ['\u5df3', '\u4ea5'].includes(info.zhi)) ||
                                                                                                (['\u536f', '\u9149'].includes(info.yearZhi) && ['\u5b50', '\u5348'].includes(info.zhi)) ||
                                                                                                (['\u8fb0', '\u620c'].includes(info.yearZhi) && ['\u4e11', '\u672a'].includes(info.zhi)) ||
                                                                                                (['\u5df3', '\u4ea5'].includes(info.yearZhi) && ['\u5bc5', '\u7533'].includes(info.zhi)) ||
                                                                                                (['\u5bc5', '\u7533'].includes(info.dayZhi) && ['\u5df3', '\u4ea5'].includes(info.zhi)) ||
                                                                                                (['\u536f', '\u9149'].includes(info.dayZhi) && ['\u5b50', '\u5348'].includes(info.zhi)) ||
                                                                                                (['\u8fb0', '\u620c'].includes(info.dayZhi) && ['\u4e11', '\u672a'].includes(info.zhi)) ||
                                                                                                (['\u5df3', '\u4ea5'].includes(info.dayZhi) && ['\u5bc5', '\u7533'].includes(info.zhi)),

                                                                                                '\u62ab\u9ebb': (info) =>
                                                                                                    (['\u5bc5', '\u5348', '\u620c'].includes(info.yearZhi) && info.zhi === '\u9149') ||
                                                                                                    (['\u7533', '\u5b50', '\u8fb0'].includes(info.yearZhi) && info.zhi === '\u536f') ||
                                                                                                    (['\u4ea5', '\u536f', '\u672a'].includes(info.yearZhi) && info.zhi === '\u5b50') ||
                                                                                                    (['\u5df3', '\u9149', '\u4e11'].includes(info.yearZhi) && info.zhi === '\u5348'),

                                                                                                    '\u4e27\u95e8': (info) =>
                                                                                                        (['\u5bc5', '\u5348', '\u620c'].includes(info.yearZhi) && info.zhi === '\u8fb0') ||
                                                                                                        (['\u7533', '\u5b50', '\u8fb0'].includes(info.yearZhi) && info.zhi === '\u620c') ||
                                                                                                        (['\u4ea5', '\u536f', '\u672a'].includes(info.yearZhi) && info.zhi === '\u672a') ||
                                                                                                        (['\u5df3', '\u9149', '\u4e11'].includes(info.yearZhi) && info.zhi === '\u4e11'),

                                                                                                        '\u540a\u5ba2': (info) =>
                                                                                                            (['\u5bc5', '\u5348', '\u620c'].includes(info.yearZhi) && info.zhi === '\u4e11') ||
                                                                                                            (['\u7533', '\u5b50', '\u8fb0'].includes(info.yearZhi) && info.zhi === '\u672a') ||
                                                                                                            (['\u4ea5', '\u536f', '\u672a'].includes(info.yearZhi) && info.zhi === '\u620c') ||
                                                                                                            (['\u5df3', '\u9149', '\u4e11'].includes(info.yearZhi) && info.zhi === '\u8fb0'),

                                                                                                            '\u7ea2\u8273\u715e': (info) =>
                                                                                                                (info.dayGan === '\u7532' && info.zhi === '\u5348') ||
                                                                                                                (info.dayGan === '\u4e59' && info.zhi === '\u7533') ||
                                                                                                                (info.dayGan === '\u4e19' && info.zhi === '\u5bc5') ||
                                                                                                                (info.dayGan === '\u4e01' && info.zhi === '\u672a') ||
                                                                                                                (info.dayGan === '\u620a' && info.zhi === '\u8fb0') ||
                                                                                                                (info.dayGan === '\u5df1' && info.zhi === '\u8fb0') ||
                                                                                                                (info.dayGan === '\u5e9a' && info.zhi === '\u620c') ||
                                                                                                                (info.dayGan === '\u8f9b' && info.zhi === '\u9149') ||
                                                                                                                (info.dayGan === '\u58ec' && info.zhi === '\u5b50') ||
                                                                                                                (info.dayGan === '\u7678' && info.zhi === '\u7533') ||
                                                                                                                (info.yearGan === '\u7532' && info.zhi === '\u5348') ||
                                                                                                                (info.yearGan === '\u4e59' && info.zhi === '\u7533') ||
                                                                                                                (info.yearGan === '\u4e19' && info.zhi === '\u5bc5') ||
                                                                                                                (info.yearGan === '\u4e01' && info.zhi === '\u672a') ||
                                                                                                                (info.yearGan === '\u620a' && info.zhi === '\u8fb0') ||
                                                                                                                (info.yearGan === '\u5df1' && info.zhi === '\u8fb0') ||
                                                                                                                (info.yearGan === '\u5e9a' && info.zhi === '\u620c') ||
                                                                                                                (info.yearGan === '\u8f9b' && info.zhi === '\u9149') ||
                                                                                                                (info.yearGan === '\u58ec' && info.zhi === '\u5b50') ||
                                                                                                                (info.yearGan === '\u7678' && info.zhi === '\u7533'),

                                                                                                                '\u516b\u4e13\u65e5': (info) =>
                                                                                                                    (info.stem === info.dayGan && info.zhi === info.dayZhi) && ['\u7532\u5bc5', '\u4e59\u536f', '\u4e01\u672a', '\u620a\u620c', '\u5df1\u672a', '\u5e9a\u7533', '\u8f9b\u9149', '\u7678\u4e11'].includes(info.stem + info.zhi),

                                                                                                                    '\u4e5d\u4e11\u65e5': (info) =>
                                                                                                                        (info.stem === info.dayGan && info.zhi === info.dayZhi) && ['\u58ec\u5b50', '\u58ec\u5348', '\u620a\u5b50', '\u620a\u5348', '\u5df1\u9149', '\u5df1\u536f', '\u4e59\u9149', '\u8f9b\u536f', '\u4e01\u9149'].includes(info.stem + info.zhi),

                                                                                                                        '\u6c90\u6d74': (info) =>
                                                                                                                            (info.dayGan === '\u7532' && info.zhi === '\u5b50') ||
                                                                                                                            (info.dayGan === '\u4e59' && info.zhi === '\u5df3') ||
                                                                                                                            (info.dayGan === '\u4e19' && info.zhi === '\u536f') ||
                                                                                                                            (info.dayGan === '\u620a' && info.zhi === '\u536f') ||
                                                                                                                            (info.dayGan === '\u4e01' && info.zhi === '\u7533') ||
                                                                                                                            (info.dayGan === '\u5df1' && info.zhi === '\u7533') ||
                                                                                                                            (info.dayGan === '\u5e9a' && info.zhi === '\u5348') ||
                                                                                                                            (info.dayGan === '\u8f9b' && info.zhi === '\u4ea5') ||
                                                                                                                            (info.dayGan === '\u58ec' && info.zhi === '\u9149') ||
                                                                                                                            (info.dayGan === '\u7678' && info.zhi === '\u5bc5'),

                                                                                                                            '\u5b64\u9e3e\u715e': (info) =>
                                                                                                                                (info.stem === info.dayGan && info.zhi === info.dayZhi) && ['\u4e59\u5df3', '\u4e01\u5df3', '\u8f9b\u4ea5', '\u620a\u7533', '\u58ec\u5b50'].includes(info.stem + info.zhi),

                                                                                                                                '\u7ae5\u5b50\u715e': (info) =>
                                                                                                                                    // 1. Season Check (Month Zhi)
                                                                                                                                    (['\u5bc5', '\u536f', '\u8fb0'].includes(info.monthZhi) && ['\u5bc5', '\u5b50'].includes(info.zhi)) || // Spring
                                                                                                                                    (['\u7533', '\u9149', '\u620c'].includes(info.monthZhi) && ['\u5bc5', '\u5b50'].includes(info.zhi)) || // Autumn
                                                                                                                                    (['\u5df3', '\u5348', '\u672a'].includes(info.monthZhi) && ['\u536f', '\u672a', '\u8fb0'].includes(info.zhi)) || // Summer
                                                                                                                                    (['\u4ea5', '\u5b50', '\u4e11'].includes(info.monthZhi) && ['\u536f', '\u672a', '\u8fb0'].includes(info.zhi)) || // Winter
                                                                                                                                    // 2. Na Yin Check (Year Na Yin)
                                                                                                                                    (info.yearNaYin && info.yearNaYin.includes('\u571f') && ['\u8fb0', '\u5df3'].includes(info.zhi)) ||
                                                                                                                                    (info.yearNaYin && (info.yearNaYin.includes('\u91d1') || info.yearNaYin.includes('\u6728')) && ['\u5348', '\u536f'].includes(info.zhi)) ||
                                                                                                                                    (info.yearNaYin && (info.yearNaYin.includes('\u6c34') || info.yearNaYin.includes('\u706b')) && ['\u9149', '\u620c'].includes(info.zhi)),
};
*/

function getColor(char) {
    if (!char) return '#333';
    let wx = GAN_WX[char] || ZHI_WX[char];
    if (wx === '\u6728') return '#27ae60';
    if (wx === '\u706b') return '#c0392b';
    if (wx === '\u571f') return '#a1887f';
    if (wx === '\u91d1') return '#b8860b';
    if (wx === '\u6c34') return '#2980b9';
    return '#333';
}

function getTenGod(dayMaster, stem) {
    if (!stem) return '';
    const key = dayMaster + stem;
    if (!TEN_GODS || !TEN_GODS[key]) return '';
    return TEN_GODS[key][0];
}
window.getTenGod = getTenGod;

function getKongWang(stem, zhi) {
    if (!GAN.includes(stem) || !ZHI.includes(zhi)) return "";
    const idxG = GAN.indexOf(stem);
    const idxZ = ZHI.indexOf(zhi);

    // (Zhi - Gan) % 12
    const diff = (idxZ - idxG + 12) % 12;
    const mapping = {
        0: ['\u620c', '\u4ea5'],
        2: ['\u5b50', '\u4e11'],
        4: ['\u5bc5', '\u536f'],
        6: ['\u8fb0', '\u5df3'],
        8: ['\u5348', '\u672a'],
        10: ['\u7533', '\u9149']
    };
    const arr = mapping[diff] || [];
    return arr.join('');
}

function getShenSha(yearGan, yearZhi, monthZhi, dayGan, dayZhi, stem, zhi, yearNaYin, dayNaYin, idx = -1, fullPillars = null) {
    const res = [];
    const info = {
        yearGan, yearZhi, monthZhi, dayGan, dayZhi, stem, zhi, yearNaYin, dayNaYin
    };

    for (const name in SHEN_SHA_RULES) {
        if (SHEN_SHA_RULES[name](info)) {
            if (!res.includes(name)) res.push(name);
        }
    }

    // Special: Yin Yang Cha Cuo
    if (dayGan === stem && dayZhi === zhi) {
        const gz = stem + zhi;
        if (['\u4e19\u5b50', '\u4e01\u4e11', '\u620a\u5bc5', '\u8f9b\u536f', '\u58ec\u8fb0', '\u7678\u5df3', '\u4e19\u5348', '\u4e01\u672a', '\u620a\u7533', '\u8f9b\u9149', '\u58ec\u620c', '\u7678\u4ea5'].includes(gz)) {
            res.push('\u9634\u5dee\u9633\u9519');
        }
    }

    // Special: Kui Gang
    if (dayGan === stem && dayZhi === zhi) {
        const gz = stem + zhi;
        if (['\u58ec\u8fb0', '\u5e9a\u620c', '\u5e9a\u8fb0', '\u620a\u620c'].includes(gz)) {
            res.push('\u9b41\u7f61');
        }
    }

    // Special: Jin Shen
    const gz = stem + zhi;
    if (['\u7532\u5b50', '\u7532\u5348', '\u5df1\u536f', '\u5df1\u9149', '\u620a\u5bc5', '\u620a\u7533', '\u7678\u5df3', '\u7678\u4ea5'].includes(gz)) {
        res.push('\u8fdb\u795e');
    }

    // Special: Tui Shen
    if (['\u7532\u620c', '\u7532\u8fb0', '\u4e59\u4e11', '\u4e59\u672a', '\u4e19\u7533', '\u4e01\u9149', '\u4e01\u4ea5', '\u4e01\u4e11'].includes(gz)) {
        res.push('\u9000\u795e');
    }

    // Month Po / Year Po
    const CHONG_MAP = {
        '\u5b50': '\u5348', '\u4e11': '\u672a', '\u5bc5': '\u7533', '\u536f': '\u9149', '\u8fb0': '\u620c', '\u5df3': '\u4ea5',
        '\u5348': '\u5b50', '\u672a': '\u4e11', '\u7533': '\u5bc5', '\u9149': '\u536f', '\u620c': '\u8fb0', '\u4ea5': '\u5df3'
    };
    if (CHONG_MAP[monthZhi] === zhi) res.push('\u6708\u7834');
    if (CHONG_MAP[yearZhi] === zhi) res.push('\u5c81\u7834');

    // Kong Wang (Centralized Logic)
    if (zhi) {
        if (fullPillars && idx !== -1) {
            if (isPillarVoid(idx, fullPillars, zhi)) res.push('\u7a7a\u4ea1');
        } else {
            // Fallback for legacy calls or missing context
            const isDayPillar = (dayGan === stem && dayZhi === zhi);
            if (isDayPillar) {
                if (getKongWang(yearGan, yearZhi).includes(zhi)) res.push('\u7a7a\u4ea1');
            } else {
                if (getKongWang(dayGan, dayZhi).includes(zhi)) res.push('\u7a7a\u4ea1');
            }
        }
    }

    return res;
}

function getInteractions(pillars) {

    const stems = pillars.map(p => p.gan);

    const branches = pillars.map(p => p.zhi);



    const res = { stems: [], branches: [], judgments: [] };



    // --- Stems ---

    const ganHeMap = {

        '\u7532': '\u5df1', '\u5df1': '\u7532',

        '\u4e59': '\u5e9a', '\u5e9a': '\u4e59',

        '\u4e19': '\u8f9b', '\u8f9b': '\u4e19',

        '\u4e01': '\u58ec', '\u58ec': '\u4e01',

        '\u620a': '\u7678', '\u7678': '\u620a'

    };

    const ganHeResult = {

        '\u7532\u5df1': '\u5408\u571f', '\u4e59\u5e9a': '\u5408\u91d1', '\u4e19\u8f9b': '\u5408\u6c34', '\u4e01\u58ec': '\u5408\u6728', '\u620a\u7678': '\u5408\u706b'

    };



    const ganChongPairs = [

        ['\u7532', '\u5e9a'], ['\u4e59', '\u8f9b'], ['\u4e19', '\u58ec'], ['\u4e01', '\u7678']

    ];



    for (let i = 0; i < stems.length; i++) {

        for (let j = i + 1; j < stems.length; j++) {

            const s1 = stems[i];

            const s2 = stems[j];



            const ganOrder = GAN;
            let p1 = s1, p2 = s2;
            if (ganOrder.indexOf(s1) > ganOrder.indexOf(s2)) {
                p1 = s2; p2 = s1;
            }
            const pairKey = p1 + p2;



            // He

            if (ganHeMap[p1] === p2) {

                const desc = ganHeResult[pairKey] || '';

                if (desc) {

                    // Strict He Hua Check: Month Zhi Element must match Result Element

                    const mz = pillars[1].zhi;

                    const mzWx = ZHI_WX[mz];

                    const targetWx = desc.substring(desc.length - 1); // "\u5408\u571f" -> "\u571f"



                    if (mzWx === targetWx) {

                        res.stems.push(pairKey + desc);

                        res.judgments.push(`${pairKey}${desc}\u6210\u529f\uff1a${p1}\u4e0e${p2}\u5747\u6309${targetWx}\u4e94\u884c\u8bba\u65ad\u3002`);

                    } else {

                        res.stems.push(pairKey + desc + "(\u4e0d\u5316)");

                        res.judgments.push(`${pairKey}\u5408\u7eca\uff1a${p1}\u4e0e${p2}\u76f8\u4e92\u7275\u5236\uff0c\u6682\u4e0d\u751f\u52a9\u514b\u5236\u5176\u4ed6\u5929\u5e72\u3002`);

                    }

                }

            }



            // Chong
            for (const cp of ganChongPairs) {
                if ((cp[0] === s1 && cp[1] === s2) || (cp[0] === s2 && cp[1] === s1)) {
                    res.stems.push(p1 + p2 + "\u51b2");
                }
            }

        }

    }



    // --- Branches ---

    const liuChongPairs = [

        ['\u5b50', '\u5348'], ['\u4e11', '\u672a'], ['\u5bc5', '\u7533'],

        ['\u536f', '\u9149'], ['\u8fb0', '\u620c'], ['\u5df3', '\u4ea5']

    ];

    const liuHePairs = {

        '\u5b50\u4e11': '\u5316\u571f', '\u4e11\u5b50': '\u5316\u571f',

        '\u5bc5\u4ea5': '\u5316\u6728', '\u4ea5\u5bc5': '\u5316\u6728',

        '\u536f\u620c': '\u5316\u706b', '\u620c\u536f': '\u5316\u706b',

        '\u8fb0\u9149': '\u5316\u91d1', '\u9149\u8fb0': '\u5316\u91d1',

        '\u5df3\u7533': '\u5316\u6c34', '\u7533\u5df3': '\u5316\u6c34',

        '\u5348\u672a': '\u5316\u571f', '\u672a\u5348': '\u5316\u571f'

    };

    const liuHaiPairs = [

        ['\u5b50', '\u672a'], ['\u4e11', '\u5348'], ['\u5bc5', '\u5df3'],

        ['\u536f', '\u8fb0'], ['\u7533', '\u4ea5'], ['\u9149', '\u620c']

    ];



    for (let i = 0; i < branches.length; i++) {

        for (let j = i + 1; j < branches.length; j++) {
            const b1 = branches[i];
            const b2 = branches[j];
            const sortedPair = [b1, b2].sort((x, y) => ZHI.indexOf(x) - ZHI.indexOf(y)).join('');
            const p1 = sortedPair[0];
            const p2 = sortedPair[1];



            // Chong
            for (const cp of liuChongPairs) {
                if ((cp[0] === b1 && cp[1] === b2) || (cp[0] === b2 && cp[1] === b1)) {
                    res.branches.push(sortedPair + "\u51b2");
                }
            }



            // He
            const heDesc = liuHePairs[b1 + b2];
            if (heDesc) {
                res.branches.push(sortedPair + "\u516d\u5408" + heDesc);
            }



            // Hai
            for (const hp of liuHaiPairs) {
                if ((hp[0] === b1 && hp[1] === b2) || (hp[0] === b2 && hp[1] === b1)) {
                    res.branches.push(sortedPair + "\u76f8\u5bb3");
                }
            }



            // Xing

            if ((b1 === '\u5b50' && b2 === '\u536f') || (b1 === '\u536f' && b2 === '\u5b50')) {

                res.branches.push("\u5b50\u536f\u76f8\u5211");

            }

            if (b1 === b2 && ['\u8fb0', '\u5348', '\u9149', '\u4ea5'].includes(b1)) {

                res.branches.push(b1 + b2 + "\u81ea\u5211");

            }

            const bw = [b1, b2].sort().join('');

            if (bw === '\u5bc5\u5df3') res.branches.push('\u5bc5\u5df3\u76f8\u5211');

            if (bw === '\u5df3\u7533') res.branches.push('\u5df3\u7533\u76f8\u5211');

            if (bw === '\u5bc5\u7533') res.branches.push('\u5bc5\u7533\u76f8\u5211');

            if (bw === '\u4e11\u620c') res.branches.push('\u4e11\u620c\u76f8\u5211');

            if (bw === '\u672a\u620c') res.branches.push('\u620c\u672a\u76f8\u5211');

            if (bw === '\u4e11\u672a') res.branches.push('\u4e11\u672a\u76f8\u5211');



            // An He

            if (bw === '\u5b50\u5df3') res.branches.push('\u5b50\u5df3\u6697\u5408');

            if (bw === '\u4e11\u5bc5') res.branches.push('\u5bc5\u4e11\u6697\u5408');

            if (bw === '\u4ea5\u5348') res.branches.push('\u5348\u4ea5\u6697\u5408');

            if (bw === '\u536f\u7533') res.branches.push('\u536f\u7533\u6697\u5408');

        }

    }



    // San He

    const bSet = new Set(branches);

    const sanHe = [

        { grp: ['\u7533', '\u5b50', '\u8fb0'], desc: '\u7533\u5b50\u8fb0\u4e09\u5408\u6c34\u5c40' },

        { grp: ['\u4ea5', '\u536f', '\u672a'], desc: '\u4ea5\u536f\u672a\u4e09\u5408\u6728\u5c40' },

        { grp: ['\u5bc5', '\u5348', '\u620c'], desc: '\u5bc5\u5348\u620c\u4e09\u5408\u706b\u5c40' },

        { grp: ['\u5df3', '\u9149', '\u4e11'], desc: '\u5df3\u9149\u4e11\u4e09\u5408\u91d1\u5c40' }

    ];

    for (const sh of sanHe) {

        if (sh.grp.every(x => bSet.has(x))) {

            res.branches.push(sh.desc);

        }

    }



    // San Hui (Three Meetings)

    const sanHui = [

        { grp: ['\u5bc5', '\u536f', '\u8fb0'], desc: '\u5bc5\u536f\u8fb0\u4e09\u4f1a\u6728\u65b9' },

        { grp: ['\u5df3', '\u5348', '\u672a'], desc: '\u5df3\u5348\u672a\u4e09\u4f1a\u706b\u65b9' },

        { grp: ['\u7533', '\u9149', '\u620c'], desc: '\u7533\u9149\u620c\u4e09\u4f1a\u91d1\u65b9' },

        { grp: ['\u4ea5', '\u5b50', '\u4e11'], desc: '\u4ea5\u5b50\u4e11\u4e09\u4f1a\u6c34\u65b9' }

    ];

    for (const sh of sanHui) {

        if (sh.grp.every(x => bSet.has(x))) {

            res.branches.push(sh.desc);

        }

    }



    // Ban He (Half Combinations)

    // Note: JS Set doesn't support value equality for sets/arrays directly like Python, so we use string keys or manual checks.

    // Iterating pairs manually again might be safer or using the existing loop?

    // The existing loop goes pairwise. Let's add them there or here?

    // Adding here requires re-iterating. Let's add them to the PAIRWISE loop above (lines 607-652) via a separate replacement

    // OR just add a new pairwise loop here for clarity and minimal diff interaction with the big loop.

    // Given the constraints, a new small pairwise loop is safer than replacing the huge existing loop.



    const banHeMap = {

        '\u7533\u5b50': '\u7533\u5b50\u534a\u5408(\u6c34\u5c40)', '\u5b50\u7533': '\u7533\u5b50\u534a\u5408(\u6c34\u5c40)',

        '\u5b50\u8fb0': '\u5b50\u8fb0\u534a\u5408(\u6c34\u5c40)', '\u8fb0\u5b50': '\u5b50\u8fb0\u534a\u5408(\u6c34\u5c40)',

        '\u4ea5\u536f': '\u4ea5\u536f\u534a\u5408(\u6728\u5c40)', '\u536f\u4ea5': '\u4ea5\u536f\u534a\u5408(\u6728\u5c40)',

        '\u536f\u672a': '\u536f\u672a\u534a\u5408(\u6728\u5c40)', '\u672a\u536f': '\u536f\u672a\u534a\u5408(\u6728\u5c40)',

        '\u5bc5\u5348': '\u5bc5\u5348\u534a\u5408(\u706b\u5c40)', '\u5348\u5bc5': '\u5bc5\u5348\u534a\u5408(\u706b\u5c40)',

        '\u5348\u620c': '\u5348\u620c\u534a\u5408(\u706b\u5c40)', '\u620c\u5348': '\u5348\u620c\u534a\u5408(\u706b\u5c40)',

        '\u5df3\u9149': '\u5df3\u9149\u534a\u5408(\u91d1\u5c40)', '\u9149\u5df3': '\u5df3\u9149\u534a\u5408(\u91d1\u5c40)',

        '\u9149\u4e11': '\u9149\u4e11\u534a\u5408(\u91d1\u5c40)', '\u4e11\u9149': '\u9149\u4e11\u534a\u5408(\u91d1\u5c40)'

    };



    // An He Missing

    // Zi-Si, Yin-Wei



    for (let i = 0; i < branches.length; i++) {

        for (let j = i + 1; j < branches.length; j++) {

            const b1 = branches[i];

            const b2 = branches[j];

            // Sort Branches for consistent key (Avoid MaoYou vs YouMao dups)

            const branchesOrder = ZHI;

            const bList = [b1, b2].sort((x, y) => branchesOrder.indexOf(x) - branchesOrder.indexOf(y));

            const sortedB1 = bList[0];

            const sortedB2 = bList[1];



            // Use sorted pair for Key generation

            // But we must preserve original b1/b2 logic for some directional checks if any?

            // Actually, for Interaction names like "Mao You Chong", typically order doesn't matter or is fixed.

            // Using sorted branches helps unify.



            const pair = sortedB1 + sortedB2;

            const revWith = sortedB2 + sortedB1; // Redundant if sorted, but kept for logic safety if map uses specific order



            // Ban He

            if (banHeMap[pair]) res.branches.push(banHeMap[pair]);

            else if (banHeMap[revWith]) res.branches.push(banHeMap[revWith]);



            // An He logic moved to static block above to avoid non-standard pairs

        }

    }



    // San Xing

    if (bSet.has('\u5bc5') && bSet.has('\u5df3') && bSet.has('\u7533')) res.branches.push('\u5bc5\u5df3\u7533\u4e09\u5211');

    if (bSet.has('\u4e11') && bSet.has('\u620c') && bSet.has('\u672a')) res.branches.push('\u4e11\u672a\u620c\u4e09\u5211');



    // Unique

    res.stems = [...new Set(res.stems)];

    res.branches = [...new Set(res.branches)];



    // --- Judgments (Double Clash) ---

    const judgments = [];



    const checkDoubleChong = (idx1, idx2) => {

        if (idx1 >= pillars.length || idx2 >= pillars.length) return false;

        const p1 = pillars[idx1];

        const p2 = pillars[idx2];

        const s1 = p1.gan;

        const s2 = p2.gan;

        const b1 = p1.zhi;

        const b2 = p2.zhi;



        // Check Stem Chong

        let isStemChong = false;

        for (const cp of ganChongPairs) {

            if ((cp[0] === s1 && cp[1] === s2) || (cp[0] === s2 && cp[1] === s1)) {

                isStemChong = true;

                break;

            }

        }



        // Check Branch Chong

        let isBranchChong = false;

        // Using manual array check to be safe or reuse logic

        // liuChongPairs is array of arrays/sets.

        const pairKey = [b1, b2].sort().join('');

        for (const cp of liuChongPairs) {

            if ([...cp].sort().join('') === pairKey) {

                isBranchChong = true;

                break;

            }

        }

        return isStemChong && isBranchChong;

    };



    // 0:Year, 1:Month, 2:Day, 3:Hour

    if (pillars.length >= 4) {

        if (checkDoubleChong(2, 1)) judgments.push("\u65e5\u3001\u6708\u5e72\u652f\u53cc\u51b2\uff0c\u4e8b\u4e1a\u8270\u96be\u3002");

        if (checkDoubleChong(0, 2)) judgments.push("\u5e74\u3001\u65e5\u5e72\u652f\u53cc\u51b2\uff0c\u4e3b\u672c\u4e0d\u548c\uff0c\u7eb5\u5bcc\u8d35\u4e5f\u4e0d\u4e45\u3002");

        if (checkDoubleChong(0, 3)) judgments.push("\u5e74\u3001\u65f6\u5e72\u652f\u53cc\u51b2\uff0c\u4e43\u522b\u7acb\u6839\u57fa\u4e4b\u4eba\u3002");

        if (checkDoubleChong(1, 3)) judgments.push("\u6708\u3001\u65f6\u5e72\u652f\u53cc\u51b2\uff0c\u6050\u6709\u591a\u6b21\u8d77\u5012\u4e4b\u9047\u3002");

    }



    res.judgments.push(...judgments);

    // --- Filtering Redundancy ---
    // Rule: If a full "San He" (Three Harmony) or "San Hui" (Three Meeting) exists,
    // remove the corresponding "Ban He" (Half Harmony).

    const existingGroups = new Set();
    res.branches.forEach(b => {
        if (b.includes('三合') || b.includes('三会')) {
            if (b.includes('水')) existingGroups.add('水');
            if (b.includes('木')) existingGroups.add('木');
            if (b.includes('火')) existingGroups.add('火');
            if (b.includes('金')) existingGroups.add('金');
        }
    });

    if (existingGroups.size > 0) {
        res.branches = res.branches.filter(b => {
            if (b.includes('半合')) {
                if (b.includes('水局') && existingGroups.has('水')) return false;
                if (b.includes('木局') && existingGroups.has('木')) return false;
                if (b.includes('火局') && existingGroups.has('火')) return false;
                if (b.includes('金局') && existingGroups.has('金')) return false;
            }
            return true;
        });
    }

    res.branches = [...new Set(res.branches)];
    res.stems = [...new Set(res.stems)];
    res.judgments = [...new Set(res.judgments)];

    return res;
}

function getSpecificBaziYear(dateObj) {
    /**
     * Returns the Bazi year (Gregorian integer) for the given date.
     * If date is before Li Chun, returns year - 1.
     * Uses Solar -> Lunar -> JieQi.
     */
    const year = dateObj.getFullYear();
    try {
        const solar = Solar.fromYmd(year, 2, 4);
        const lunar = solar.getLunar();
        const jq = lunar.getJieQiTable();
        const liChun = jq['\u7acb\u6625'];

        if (liChun) {
            const lcDate = new Date(liChun.getYear(), liChun.getMonth() - 1, liChun.getDay(), liChun.getHour(), liChun.getMinute(), liChun.getSecond());
            if (dateObj < lcDate) {
                return year - 1;
            }
            return year;
        }
    } catch (e) {
        console.error("Li Chun error", e);
    }
    // Fallback
    if (dateObj.getMonth() < 1 || (dateObj.getMonth() === 1 && dateObj.getDate() < 4)) return year - 1;
    return year;
}

function calculateBazi(dateObj, gender, manualGZ = null, unknownHour = false) {
    // dateObj: standard JS Date or NULL if manual
    // gender: 'M' or 'F' or '1'/'0'
    // manualGZ: [yg, yz, mg, mz, dg, dz, tg, tz] if dateObj is null
    // unknownHour: boolean, if true, ignore time

    let pillarObjs = [];
    let solarDateStr = '';
    let lunarDateStr = '';
    const isMale = (gender === 'M' || gender === '1' || gender === '\u7537');

    // Attempt to resolve date from Manual Input if provided
    let derivedDate = dateObj;
    let isDerived = false;

    if (!derivedDate && manualGZ && manualGZ.length >= 8) {
        // [yg, yz, mg, mz, dg, dz, tg, tz]
        const found = findDateFromBazi(
            manualGZ[0], manualGZ[1],
            manualGZ[2], manualGZ[3],
            manualGZ[4], manualGZ[5],
            manualGZ[6], manualGZ[7],
            2000 // Reference Year for proximity (Matches Python)
        );
        if (found && found.length > 0) {
            const best = found[0];
            derivedDate = new Date(best.year, best.month - 1, best.day, best.hour, 0);
            isDerived = true;
        }
    }

    if (derivedDate) {
        // Normal Mode (Real Date or Derived)
        const solar = Solar.fromYmdHms(
            derivedDate.getFullYear(),
            derivedDate.getMonth() + 1, // JS month is 0-11
            derivedDate.getDate(),
            derivedDate.getHours(),
            derivedDate.getMinutes(),
            derivedDate.getSeconds()
        );
        const lunar = solar.getLunar();
        const bazi = lunar.getEightChar();

        let hourGan = bazi.getTimeGan();
        let hourZhi = bazi.getTimeZhi();
        let hourNaYin = bazi.getTimeNaYin();
        let isUnknown = false;

        if (unknownHour) {
            hourGan = '';
            hourZhi = '';
            hourNaYin = '';
            isUnknown = true;
        }

        pillarObjs = [
            { gan: bazi.getYearGan(), zhi: bazi.getYearZhi(), nayin: bazi.getYearNaYin() },
            { gan: bazi.getMonthGan(), zhi: bazi.getMonthZhi(), nayin: bazi.getMonthNaYin() },
            { gan: bazi.getDayGan(), zhi: bazi.getDayZhi(), nayin: bazi.getDayNaYin() },
            { gan: hourGan, zhi: hourZhi, nayin: hourNaYin, isUnknown: isUnknown }
        ];

        solarDateStr = `${solar.getYear()}-${solar.getMonth()}-${solar.getDay()} ${unknownHour ? '(时辰未知)' : solar.getHour() + ':00:00'} (\u516c\u5386)`;
        lunarDateStr = `${lunar.getYearInGanZhi()}\u5e74${lunar.getMonthInChinese()}\u6708${lunar.getDayInChinese()} (\u519c\u5386)`;

        if (isDerived) {
            solarDateStr += " [\u53cd\u63a8\u5339\u914d]";
            lunarDateStr += " [\u53cd\u63a8\u5339\u914d]";
        }
    } else if (manualGZ && manualGZ.length >= 8) {
        // Manual Mode (Symbolic - No matching date found)
        const yg = manualGZ[0], yz = manualGZ[1];
        const mg = manualGZ[2], mz = manualGZ[3];
        const dg = manualGZ[4], dz = manualGZ[5];
        const tg = manualGZ[6], tz = manualGZ[7];

        pillarObjs = [
            { gan: yg, zhi: yz, nayin: NAYIN[yg + yz] || '' },
            { gan: mg, zhi: mz, nayin: NAYIN[mg + mz] || '' },
            { gan: dg, zhi: dz, nayin: NAYIN[dg + dz] || '' },
            { gan: tg, zhi: tz, nayin: NAYIN[tg + tz] || '' }
        ];

        solarDateStr = '\u26a0\ufe0f \u53cd\u63a8\u6a21\u5f0f (\u65e0\u5339\u914d\u65e5\u671f)';
        lunarDateStr = '\u4ec5\u4f5c\u7ed3\u6784\u6392\u76d8\u5c55\u793a';
    } else {
        return null; // Error
    }

    const yearGan = pillarObjs[0].gan;
    const yearZhi = pillarObjs[0].zhi;
    const monthZhi = pillarObjs[1].zhi;
    const dayGan = pillarObjs[2].gan;
    const dayZhi = pillarObjs[2].zhi;

    const processedPillars = [];

    pillarObjs.forEach((p, idx) => {
        const gan = p.gan;
        const zhi = p.zhi;

        let tenGod = '';
        if (idx === 2) {
            tenGod = isMale ? '\u5143\u7537' : '\u5143\u5973';
        } else {
            tenGod = getTenGod(dayGan, gan);
        }

        const hidden = [];
        const hStems = HIDDEN_STEMS_MAP[zhi] || [];
        hStems.forEach((h, idx) => {
            hidden.push({
                stem: h,
                god: getTenGod(dayGan, h),
                type: idx === 0 ? 'Main' : 'Hidden'
            });
        });

        const shenSha = getShenSha(yearGan, yearZhi, monthZhi, dayGan, dayZhi, gan, zhi, pillarObjs[0].nayin, pillarObjs[2].nayin, idx, pillarObjs);
        let kongWang = [];
        if (!p.isUnknown) {
            kongWang = getKongWang(gan, zhi);
        }

        processedPillars.push({
            gan: gan,
            zhi: zhi,
            isUnknown: p.isUnknown,
            ganColor: getColor(gan),
            zhiColor: getColor(zhi),
            naYin: p.nayin,
            tenGod: tenGod,
            hidden: hidden,
            shenSha: shenSha,
            kongWang: kongWang
        });
    });

    // Da Yun Logic
    let daYunList = [];
    let currentDy = null;

    if (derivedDate) {
        // Normal Da Yun calculation
        const solar = Solar.fromYmdHms(
            derivedDate.getFullYear(),
            derivedDate.getMonth() + 1,
            derivedDate.getDate(),
            derivedDate.getHours(),
            derivedDate.getMinutes(),
            derivedDate.getSeconds()
        );
        const bazi = solar.getLunar().getEightChar();
        const yun = bazi.getYun(isMale ? 1 : 0);
        const daYunArrInfo = yun.getDaYun();
        // Filter out placeholder DaYun (empty GanZhi) that Lunar library sometimes returns for pre-start age
        const daYunArr = daYunArrInfo.filter(dy => dy.getGanZhi() && dy.getGanZhi().length > 0);

        for (const dy of daYunArr) {
            const startAge = dy.getStartAge();
            const endAge = dy.getEndAge();
            const startYear = dy.getStartYear();
            const ganZhi = dy.getGanZhi();
            const dyGan = ganZhi.substring(0, 1);
            const dyZhi = ganZhi.substring(1, 2);
            const dyNayin = NAYIN[ganZhi] || '';
            const dyTenGod = getTenGod(dayGan, dyGan);

            const dyHidden = [];
            if (HIDDEN_STEMS_MAP[dyZhi]) {
                HIDDEN_STEMS_MAP[dyZhi].forEach((h, idx) => {
                    dyHidden.push({ stem: h, god: getTenGod(dayGan, h), type: idx === 0 ? 'Main' : 'Hidden' });
                });
            }

            const dyShenSha = getShenSha(yearGan, yearZhi, monthZhi, dayGan, dayZhi, dyGan, dyZhi, pillarObjs[0].nayin, pillarObjs[2].nayin, 4, pillarObjs);
            const dyKongWang = getKongWang(dyGan, dyZhi);

            const liuNianList = [];
            const lnArr = dy.getLiuNian();
            const expectedStart = dy.getStartYear();
            const expectedEnd = expectedStart + 9;
            const lnArrFiltered = lnArr.filter(ln => ln.getYear() >= expectedStart && ln.getYear() <= expectedEnd);
            const lnArrFinal = lnArrFiltered.slice(0, 10);

            for (const ln of lnArrFinal) {
                const lnYear = ln.getYear();
                const lnAge = ln.getAge();
                const lnGz = ln.getGanZhi();
                const lnGan = lnGz.substring(0, 1);
                const lnZhi = lnGz.substring(1, 2);
                const lnNayin = NAYIN[lnGz] || '';
                const lnTenGod = getTenGod(dayGan, lnGan);

                const lnHidden = [];
                if (HIDDEN_STEMS_MAP[lnZhi]) {
                    HIDDEN_STEMS_MAP[lnZhi].forEach((h, idx) => {
                        lnHidden.push({ stem: h, god: getTenGod(dayGan, h), type: idx === 0 ? 'Main' : 'Hidden' });
                    });
                }

                const lnShenSha = getShenSha(yearGan, yearZhi, monthZhi, dayGan, dayZhi, lnGan, lnZhi, pillarObjs[0].nayin, pillarObjs[2].nayin, 5, pillarObjs);
                const lnKongWang = getKongWang(lnGan, lnZhi);

                liuNianList.push({
                    year: lnYear, age: lnAge, ganZhi: lnGz, gan: lnGan, zhi: lnZhi,
                    ganColor: getColor(lnGan), zhiColor: getColor(lnZhi),
                    naYin: lnNayin, tenGod: lnTenGod, hidden: lnHidden,
                    shenSha: lnShenSha, kongWang: lnKongWang
                });
            }

            daYunList.push({
                ganZhi: ganZhi, gan: dyGan, zhi: dyZhi,
                ganColor: getColor(dyGan), zhiColor: getColor(dyZhi),
                naYin: dyNayin, tenGod: dyTenGod, hidden: dyHidden,
                shenSha: dyShenSha, kongWang: dyKongWang,
                startAge: startAge, endAge: endAge, startYear: startYear,
                liuNian: liuNianList
            });
        }

        // Current Da Yun
        const nowYear = getSpecificBaziYear(new Date());
        for (const dy of daYunList) {
            if (nowYear >= dy.startYear && nowYear < dy.startYear + 10) {
                currentDy = dy;
                break;
            }
        }
    } else {
        // Manual Mode: Generate Da Yun based on Month Pillar
        // Needs proper sequence (Forward/Backward)
        // Yang Gan: \u75320, \u4e192, \u620a4, \u5e9a6, \u58ec8 -> Index Even
        const yGanIdx = GAN.indexOf(yearGan);
        const isYearGanYang = (yGanIdx % 2 === 0);

        // Male(isMale=true): Yang->Fwd(1), Yin->Bwd(-1)
        // Female(isMale=false): Yang->Bwd(-1), Yin->Fwd(1)
        let direction = 1;
        if (isMale) {
            direction = isYearGanYang ? 1 : -1;
        } else {
            direction = isYearGanYang ? -1 : 1;
        }

        let currGanIdx = GAN.indexOf(processedPillars[1].gan);
        let currZhiIdx = ZHI.indexOf(processedPillars[1].zhi);

        for (let i = 0; i < 8; i++) {
            currGanIdx = (currGanIdx + direction + 10) % 10;
            currZhiIdx = (currZhiIdx + direction + 12) % 12;

            const dGan = GAN[currGanIdx];
            const dZhi = ZHI[currZhiIdx];
            const dGZ = dGan + dZhi;
            const dNayin = NAYIN[dGZ] || '';
            const dTenGod = getTenGod(dayGan, dGan);

            const dyShenSha = getShenSha(yearGan, yearZhi, monthZhi, dayGan, dayZhi, dGan, dZhi, processedPillars[0].naYin, processedPillars[2].naYin, 4, processedPillars);
            const dyKongWang = getKongWang(dGan, dZhi);

            const dyHidden = [];
            if (HIDDEN_STEMS_MAP[dZhi]) {
                HIDDEN_STEMS_MAP[dZhi].forEach(h => {
                    dyHidden.push({ stem: h, god: getTenGod(dayGan, h) });
                });
            }

            daYunList.push({
                ganZhi: dGZ, gan: dGan, zhi: dZhi,
                ganColor: getColor(dGan), zhiColor: getColor(dZhi),
                naYin: dNayin, tenGod: dTenGod, hidden: dyHidden,
                shenSha: dyShenSha, kongWang: dyKongWang,
                startAge: (i + 1) * 10, // Symbolic age
                endAge: (i + 2) * 10,
                startYear: 0, // Unknown
                liuNian: [] // Cannot determine without start year
            });
        }
        // Set first Da Yun by default for Symbolic Mode so UI isn't blank
        if (daYunList.length > 0) currentDy = daYunList[0];
    }

    const interactions = getInteractions(processedPillars);

    return {
        pillars: processedPillars,
        daYunList: daYunList,
        currentDaYun: currentDy,
        interactions: interactions,
        solarDate: solarDateStr,
        lunarDate: lunarDateStr,
        gender: isMale ? '\u7537' : '\u5973',
        bodyStrength: calculateBodyStrength(processedPillars)
    };
}


function findDateFromBazi(yearGan, yearZhi, monthGan, monthZhi, dayGan, dayZhi, timeGan, timeZhi, refYear) {
    const targetYearGZ = yearGan + yearZhi;
    let candidates = [];
    let results = [];


    // Explicit range 1900-2100
    const MIN_YEAR = 1900;
    const MAX_YEAR = 2100;

    // Use Optimized Map if available
    if (YEAR_MAP && YEAR_MAP[targetYearGZ]) {
        const potential = YEAR_MAP[targetYearGZ];
        potential.forEach(y => {
            if (y >= MIN_YEAR && y <= MAX_YEAR) {
                candidates.push(y);
            }
        });
    } else {
        // Fallback
        // 1. Find Year Candidates
        for (let y = MIN_YEAR; y <= MAX_YEAR; y++) {
            // Quick check using mid-year
            const lunar = Solar.fromYmd(y, 6, 15).getLunar();
            if (lunar.getYearInGanZhi() === targetYearGZ) {
                candidates.push(y);
            }
        }
    }

    // Sort by proximity
    candidates.sort((a, b) => Math.abs(a - refYear) - Math.abs(b - refYear));

    if (candidates.length === 0) return null;

    // 2. Search Days
    for (const y of candidates) {
        // Search approx Jan 1 of Y to Feb 20 of Y+1
        const startDate = new Date(y, 0, 1); // Jan is 0
        // end date: Y+1, Feb 20.
        const endDate = new Date(y + 1, 1, 20); // Feb is 1

        // Loop by day
        for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
            const curY = d.getFullYear();
            const curM = d.getMonth() + 1; // Lunar uses 1-based
            const curD = d.getDate();

            // Check Pillar Matches with default Solar (12:00)?
            // Just fromYmd implies 00:00?
            const solarCheck = Solar.fromYmd(curY, curM, curD);
            const lunarCheck = solarCheck.getLunar();
            const bazi = lunarCheck.getEightChar();

            if (bazi.getYearGan() !== yearGan || bazi.getYearZhi() !== yearZhi) continue;
            if (bazi.getMonthGan() !== monthGan || bazi.getMonthZhi() !== monthZhi) continue;
            if (bazi.getDayGan() !== dayGan || bazi.getDayZhi() !== dayZhi) continue;

            // Match Time
            let hourTry = 12;
            let checkTime = true;

            if (!timeZhi) {
                checkTime = false;
                hourTry = 12; // Default to noon for Day Pillar stability
            } else {
                const timeZhiIdx = ZHI.indexOf(timeZhi);
                if (timeZhiIdx === -1) continue; // Invalid Zhi
                hourTry = timeZhiIdx * 2;
                if (timeZhi === '\u5b50') hourTry = 0;
            }

            const solarFinal = Solar.fromYmdHms(curY, curM, curD, hourTry, 0, 0);
            const baziFinal = solarFinal.getLunar().getEightChar();

            if (baziFinal.getDayGan() !== dayGan || baziFinal.getDayZhi() !== dayZhi) continue;

            if (checkTime) {
                if (baziFinal.getTimeGan() !== timeGan || baziFinal.getTimeZhi() !== timeZhi) continue;
            }
            // Return JS Date object? Or Solar object?
            // Returning simple object or Date is better for UI consumption.
            // Let's return { year, month, day, hour }
            results.push({
                year: curY,
                month: curM,
                day: curD,
                hour: hourTry
            });
            // Continue searching for other years/matches?
            // Usually one year has only one match for same Bazi (unless Leap Month ambiguity?)
            // But we definitely want to check ALL candidate years.
            // So we break the inner loop (day loop) for this year, but continue the outer loop (year loop)?
            // Actually, duplicate Bazi within same year is rare/impossible for same solar day?
            // Just break inner loop to skip rest of year.
            break;
        }
    }
    return results;
}

/**
 * Strict Validation for Pillars
 * Checks "Five Tiger Hunt" (Year->Month) and "Five Rat Hunt" (Day->Hour) logic.
 * @returns { valid: boolean, error: string }
 */
function validatePillars(gzArray) {
    if (!gzArray || gzArray.length !== 8) return { valid: false, error: "\u53c2\u6570\u4e0d\u5b8c\u6574" };

    const yGan = gzArray[0]; const yZhi = gzArray[1];
    const mGan = gzArray[2]; const mZhi = gzArray[3];
    const dGan = gzArray[4]; const dZhi = gzArray[5];
    const hGan = gzArray[6]; const hZhi = gzArray[7];

    // 1. Check Parity (Basic)
    const GAN = ["\u7532", "\u4e59", "\u4e19", "\u4e01", "\u620a", "\u5df1", "\u5e9a", "\u8f9b", "\u58ec", "\u7678"];
    const ZHI = ["\u5b50", "\u4e11", "\u5bc5", "\u536f", "\u8fb0", "\u5df3", "\u5348", "\u672a", "\u7533", "\u9149", "\u620c", "\u4ea5"];

    // 2. Check Month (Five Tiger Hunt)
    // Year Gan determines Start Month Gan (for Yin Month/Tiger)
    // \u7532\u5df1\u4e4b\u5e74\u4e19\u4f5c\u9996 (Jia/Ji -> Bing)
    // \u4e59\u5e9a\u4e4b\u5c81\u620a\u4e3a\u5934 (Yi/Geng -> Wu)
    // \u4e19\u8f9b\u4e4b\u5c81\u5bfb\u5e9a\u4e0a (Bing/Xin -> Geng)
    // \u4e01\u58ec\u58ec\u5bc5\u987a\u6c34\u6d41 (Ding/Ren -> Ren)
    // \u620a\u7678\u4e4b\u5e74\u7532\u5bc5\u6c42 (Wu/Gui -> Jia)
    const stems = ["\u7532", "\u4e59", "\u4e19", "\u4e01", "\u620a", "\u5df1", "\u5e9a", "\u8f9b", "\u58ec", "\u7678"];
    const yGanIdx = stems.indexOf(yGan);
    let startMonthGanIdx = -1;
    // Map: (YearGanIdx % 5) => StartMonthGanIdx (relative to Yin month)
    // 0(Jia)/5(Ji) -> 2(Bing)
    // 1(Yi)/6(Geng) -> 4(Wu)
    // 2(Bing)/7(Xin) -> 6(Geng)
    // 3(Ding)/8(Ren) -> 8(Ren)
    // 4(Wu)/9(Gui) -> 0(Jia)
    // Formula: (Index % 5) * 2 + 2. Wait.
    // 0->2, 1->4, 2->6, 3->8, 4->10(0). Yes.
    startMonthGanIdx = ((yGanIdx % 5) * 2 + 2) % 10;

    // Month Zhi Index (Yin is start standard, but ZHI array starts at Zi)
    // ZHI array: Zi(0), Chou(1), Yin(2)...
    // So Yin is index 2.
    const mZhiIdx = ZHI.indexOf(mZhi);
    // Offset from Yin (2)
    // Note: Month must be valid month Zhi (usually?)
    // Actually lunar month always associated with fixed Zhi? Not exactly, depending on solar term.
    // But conceptually, Month Gan must match the Tiger rule relative to its Zhi position from Yin.
    // Let's deduce expected Month Gan for the given Month Zhi.
    // Steps from Yin: (mZhiIdx - 2 + 12) % 12.
    const steps = (mZhiIdx - 2 + 12) % 12;
    const expectedMGan = stems[(startMonthGanIdx + steps) % 10];

    if (mGan !== expectedMGan) {
        return { valid: false, error: `\u6708\u67f1\u4e0d\u5408\u6cd5\uff1a\u3010${yGan}\u3011\u5e74\u4e0d\u53ef\u80fd\u51fa\u73b0\u3010${mGan}${mZhi}\u3011\u6708\u3002\n\u6839\u636e\u5e74\u4e0a\u8d77\u6708\u6cd5\uff0c\u3010${mZhi}\u3011\u6708\u7684\u5929\u5e72\u5e94\u4e3a\u3010${expectedMGan}\u3011\u3002` };
    }

    // 3. Check Hour (Five Rat Hunt)
    if (hGan && hZhi) {
        // Day Gan determines Zi Hour Gan
        // \u7532\u5df1\u8fd8\u52a0\u7532 (Jia/Ji -> Jia)
        // \u4e59\u5e9a\u4e19\u4f5c\u521d (Yi/Geng -> Bing)
        // \u4e19\u8f9b\u4ece\u620a\u8d77 (Bing/Xin -> Wu)
        // \u4e01\u58ec\u5e9a\u5b50\u5c45 (Ding/Ren -> Geng)
        // \u620a\u7678\u4f55\u65b9\u53d1\uff0c\u58ec\u5b50\u662f\u771f\u9014 (Wu/Gui -> Ren)
        const dGanIdx = stems.indexOf(dGan);
        let startHourGanIdx = -1;
        // 0/5 -> 0 (Jia)
        // 1/6 -> 2 (Bing)
        // 2/7 -> 4 (Wu)
        // 3/8 -> 6 (Geng)
        // 4/9 -> 8 (Ren)
        // Formula: (Index % 5) * 2.
        startHourGanIdx = (dGanIdx % 5) * 2;

        const hZhiIdx = ZHI.indexOf(hZhi);
        // Zi is 0. Steps from Zi = hZhiIdx.
        const expectedHGan = stems[(startHourGanIdx + hZhiIdx) % 10];

        if (hGan !== expectedHGan) {
            return { valid: false, error: `\u65f6\u67f1\u4e0d\u5408\u6cd5\uff1a\u3010${dGan}\u3011\u65e5\u4e0d\u53ef\u80fd\u51fa\u73b0\u3010${hGan}${hZhi}\u3011\u65f6\u3002\n\u6839\u636e\u65e5\u4e0a\u8d77\u65f6\u6cd5\uff0c\u3010${hZhi}\u3011\u65f6\u7684\u5929\u5e72\u5e94\u4e3a\u3010${expectedHGan}\u3011\u3002` };
        }
    }

    return { valid: true }; // All good
}


function getStemInteractionsMap(pillars) {
    const stems = pillars.map(p => p.gan);
    const ganHeMap = { '\u7532': '\u5df1', '\u5df1': '\u7532', '\u4e59': '\u5e9a', '\u5e9a': '\u4e59', '\u4e19': '\u8f9b', '\u8f9b': '\u4e19', '\u4e01': '\u58ec', '\u58ec': '\u4e01', '\u620a': '\u7678', '\u7678': '\u620a' };
    const ganHeResult = { '\u7532\u5df1': '\u571f', '\u4e59\u5e9a': '\u91d1', '\u4e19\u8f9b': '\u6c34', '\u4e01\u58ec': '\u6728', '\u620a\u7678': '\u706b' };
    const GAN = ["\u7532", "\u4e59", "\u4e19", "\u4e01", "\u620a", "\u5df1", "\u5e9a", "\u8f9b", "\u58ec", "\u7678"];

    const mz = pillars.length > 1 ? pillars[1].zhi : null;
    const mzWx = mz ? ZHI_WX[mz] : null;

    const mods = {}; // idx -> { status, targetWx, multiplier }

    for (let i = 0; i < stems.length; i++) {
        for (let j = i + 1; j < stems.length; j++) {
            const s1 = stems[i];
            const s2 = stems[j];

            let isValidDist = false;
            if (i >= 4 || j >= 4) isValidDist = true;
            else if (Math.abs(i - j) === 1) isValidDist = true;

            if (isValidDist && ganHeMap[s1] === s2) {
                const pairKey = [s1, s2].sort((a, b) => GAN.indexOf(a) - GAN.indexOf(b)).join('');
                const targetWx = ganHeResult[pairKey];

                if (mz !== null && mzWx === targetWx) {
                    if (!mods[i]) mods[i] = { status: 'he_hua', targetWx, multiplier: 1.0 };
                    if (!mods[j]) mods[j] = { status: 'he_hua', targetWx, multiplier: 1.0 };
                } else {
                    if (!mods[i]) mods[i] = { status: 'he_ban', targetWx: null, multiplier: 0.6 };
                    if (!mods[j]) mods[j] = { status: 'he_ban', targetWx: null, multiplier: 0.6 };
                }
            }
        }
    }
    return mods;
}

// ... existing codes ...




// === Missing Essentials for Strength & Balance ===
/*
const WX_RELATION = {
    '\u6728': { '\u6728': '\u540c', '\u706b': '\u751f', '\u571f': '\u514b', '\u91d1': '\u88ab\u514b', '\u6c34': '\u88ab\u751f' },
    '\u706b': { '\u706b': '\u540c', '\u571f': '\u751f', '\u91d1': '\u514b', '\u6c34': '\u88ab\u514b', '\u6728': '\u88ab\u751f' },
    '\u571f': { '\u571f': '\u540c', '\u91d1': '\u751f', '\u6c34': '\u514b', '\u6728': '\u88ab\u514b', '\u706b': '\u88ab\u751f' },
    '\u91d1': { '\u91d1': '\u540c', '\u6c34': '\u751f', '\u6728': '\u514b', '\u706b': '\u88ab\u514b', '\u571f': '\u88ab\u751f' },
    '\u6c34': { '\u6c34': '\u540c', '\u6728': '\u751f', '\u706b': '\u514b', '\u571f': '\u88ab\u514b', '\u91d1': '\u88ab\u751f' }
};
*/

function getAllEarthStatuses(pillars, ref_year) {
    // 4 Earths: Chen, Xu, Chou, Wei
    // 4 Earths: Chen, Xu, Chou, Wei
    const res = {};
    const allZhis = pillars.filter(p => p && p.zhi).map(p => p.zhi);
    [0, 1, 2, 3].forEach(idx => {
        if (!pillars[idx] || !pillars[idx].zhi) return; // Skip unknown
        const zhi = pillars[idx].zhi;
        if (['\u8fb0', '\u620c', '\u4e11', '\u672a'].includes(zhi)) {
            const wx = ZHI_WX[zhi];
            const scores = calculateGlobalScores(pillars);
            const score = scores[wx] || 0;
            const clashed = allZhis.some(z => {
                if (z === zhi) return false;
                const pair = [zhi, z].sort().join('');
                return ['\u5b50\u5348', '\u4e11\u672a', '\u5bc5\u7533', '\u536f\u9149', '\u8fb0\u620c', '\u5df3\u4ea5'].includes(pair);
            });
            const type = (score > 30 || clashed) ? 'Warehouse' : 'Tomb';
            const desc = (type === 'Warehouse' ? '\u5e93' : '\u5893') + (clashed ? '(\u51b2\u5f00)' : '');
            res[zhi] = { type, score, clashed, desc };
        }
    });
    return res;
}

function getTombWarehouseStatus(zhi, pillars) {
    const stats = getAllEarthStatuses(pillars, null);
    return stats[zhi] || { type: 'Tomb', score: 0 };
}

function getFiveElementProfile(pillars) {
    const scores = calculateGlobalScores(pillars);
    if (!pillars || pillars.length < 3) return [];
    const dm = pillars[2].gan;
    const dmWx = GAN_WX[dm];
    const elements = ['\u6728', '\u706b', '\u571f', '\u91d1', '\u6c34'];

    const relToGod = {
        '\u540c': '\u6bd4\u52ab',
        '\u751f': '\u98df\u4f24',
        '\u514b': '\u8d22\u661f',
        '\u88ab\u514b': '\u5b98\u6740',
        '\u88ab\u751f': '\u5370\u661f'
    };

    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    const threshold = totalScore * 0.22; // Dynamic threshold based on total volume

    return elements.map(el => {
        const score = scores[el] || 0;
        const rel = WX_RELATION[dmWx][el];
        return {
            element: el,
            tenGod: relToGod[rel] || '',
            score: score,
            isStrong: score >= threshold
        };
    });
}

function getTombWarehouseDesc(zhi, pillars) {
    const stats = getAllEarthStatuses(pillars, null);
    const s = stats[zhi];
    if (!s) return "";
    return `${zhi}${s.type === 'Warehouse' ? '\u5e93' : '\u5893'}${s.clashed ? '(\u51b2\u5f00)' : ''}`;
}




function getGongJiaRelations(pillars) {
    const res = { adjacent: [], separated: [] };
    if (!pillars || pillars.length < 2) return res;

    const zhis = pillars.map(p => p ? p.zhi : null);
    const ZHI_ORDER = ['\u5b50', '\u4e11', '\u5bc5', '\u536f', '\u8fb0', '\u5df3', '\u5348', '\u672a', '\u7533', '\u9149', '\u620c', '\u4ea5'];

    function getVirtual(z1, z2) {
        if (!z1 || !z2) return null;
        const i1 = ZHI_ORDER.indexOf(z1);
        const i2 = ZHI_ORDER.indexOf(z2);
        const diff = Math.abs(i1 - i2);

        // \u5939 (Jia): Gap of 1
        if (diff === 2) {
            const mid = ZHI_ORDER[(Math.min(i1, i2) + 1) % 12];
            return { type: '\u5939', char: mid };
        }
        // \u62f1 (Gong): San He pairs
        const sanHe = [
            ['\u7533', '\u5b50', '\u8fb0'], ['\u4ea5', '\u536f', '\u672a'],
            ['\u5bc5', '\u5348', '\u620c'], ['\u5df3', '\u9149', '\u4e11']
        ];
        for (const group of sanHe) {
            if (group.includes(z1) && group.includes(z2)) {
                const missing = group.find(z => z !== z1 && z !== z2);
                return { type: '\u62f1', char: missing };
            }
        }
        // \u5012\u5939 (Inverse Jia): Circular gap of 1
        if (diff === 10) {
            const mid = ZHI_ORDER[(Math.max(i1, i2) + 1) % 12];
            return { type: '\u5012\u5939', char: mid };
        }
        return null;
    }

    // Adjacent checks (Year-Month, Month-Day, Day-Hour)
    for (let i = 0; i < 3; i++) {
        const v = getVirtual(zhis[i], zhis[i + 1]);
        if (v) {
            res.adjacent.push({ p1: i, p2: i + 1, relations: [v] });
        }
    }

    // Separated checks (Year-Day, Month-Hour)
    const sepPairs = [[0, 2], [1, 3]];
    for (const [i, j] of sepPairs) {
        const v = getVirtual(zhis[i], zhis[j]);
        if (v) {
            res.separated.push({ p1: i, p2: j, relations: [v] });
        }
    }

    return res;
}





function isPillarVoid(idx, pillars, manualZhi = null) {
    if (!pillars || pillars.length < 3) return false;
    const zhi = manualZhi || (pillars[idx] ? pillars[idx].zhi : null);
    if (!zhi) return false;
    if (idx === 2) { // Day Pillar
        const yKW = getKongWang(pillars[0].gan, pillars[0].zhi);
        const mKW = pillars[1] ? getKongWang(pillars[1].gan, pillars[1].zhi) : "";
        const hKW = (pillars[3] && !pillars[3].isUnknown) ? getKongWang(pillars[3].gan, pillars[3].zhi) : "";
        return (yKW + mKW + hKW).includes(zhi);
    } else {
        const dKW = getKongWang(pillars[2].gan, pillars[2].zhi);
        return dKW.includes(zhi);
    }
}

function calculateBodyStrength(pillars) {
    const dm = pillars[2].gan;
    const dmWxOrig = GAN_WX[dm];
    let dmWx = dmWxOrig;
    const weights = { stem: 10, monthZhi: 45, dayZhi: 20, hourZhi: 15, yearZhi: 10, dyZhi: 20, lnZhi: 30 };
    const getRelOrig = (w) => WX_RELATION[dmWxOrig][w];
    let totalScore = 0, maxPossibleScore = 0, logs = [], isGuanYin = false;
    const stemMods = getStemInteractionsMap(pillars);

    if (stemMods[2] && stemMods[2].status === 'he_hua') {
        dmWx = stemMods[2].targetWx;
        logs.push(`\u65e5\u4e3b${dm}\u5316\u4e3a${dmWx}`);
    }

    const getRel = (w) => WX_RELATION[dmWx][w];
    const isSameParty = (w) => ['\u540c', '\u88ab\u751f'].includes(getRel(w));

    // Stems
    [0, 1, 3, 4, 5].forEach(idx => {
        if (idx >= pillars.length || !pillars[idx]) return;
        // Skip unknown pillar
        if (pillars[idx].isUnknown) return;

        const isVoid = isPillarVoid(idx, pillars);
        const voidMult = isVoid ? 0.3 : 1.0;

        maxPossibleScore += weights.stem * voidMult; // Reduce denominator for Void Stems
        const gan = pillars[idx].gan, mod = stemMods[idx];
        let effectiveWx = GAN_WX[gan], multiplier = 1.0;
        if (mod) {
            if (mod.status === 'he_hua') effectiveWx = mod.targetWx;
            else multiplier = 0.6;
        }
        if (isSameParty(effectiveWx)) {
            let s = weights.stem * multiplier;
            // [User Request] Proximity Help: Stems adjacent to Day Master (Month/Hour) have stronger impact
            // Balanced: 10% bonus instead of 20% to prevent global volatility
            if (idx === 1 || idx === 3) s *= 1.1;

            // [New] Void Transparency: Month being Void allows Year to provide Proximity Support (Year is idx 0)
            if (idx === 0 && isPillarVoid(1, pillars)) {
                s *= 1.1; // Year Stem (Xin) now helps Day Master directly through Void Month
                logs.push("年干因月柱空亡而贴身生助 (空亡置换/透出)");
            }

            // [New] Multi-Pillar Void Check: Reduce support if stem is in a Void pillar
            if (isVoid) {
                s *= 0.3; // 70% reduction for Void Stems
            }

            if (mod && mod.status === 'he_ban' && getRel(effectiveWx) === '\u751f') s = 0;
            if (s > 0 && (WX_RELATION[effectiveWx][ZHI_WX[pillars[idx].zhi]] === '\u514b' || WX_RELATION[ZHI_WX[pillars[idx].zhi]][effectiveWx] === '\u514b')) s *= 0.4;
            totalScore += s;
        }
    });

    const earthStatuses = getAllEarthStatuses(pillars, null);
    const allZhis = pillars.filter(p => p).map(p => p.zhi);

    function applyBranchScore(idx, baseWeight, isMonth = false) {
        if (idx >= pillars.length || !pillars[idx]) return 0;
        const isDayBr = idx === 2;
        const zhi = pillars[idx].zhi, zhiWx = ZHI_WX[zhi];
        let score = baseWeight;

        const identity = (earthStatuses[zhi] || { type: 'Tomb' }).type;
        const clashed = allZhis.some(z => {
            if (z === zhi) return false;
            const pair = [zhi, z].sort().join('');
            return ['子午', '丑未', '寅申', '卯酉', '辰戌', '巳亥'].includes(pair);
        });

        if (['辰', '戌', '丑', '未'].includes(zhi)) {
            score *= clashed ? (identity === 'Warehouse' ? 1.5 : 0.2) : 1.0;
        }

        // [New] Universal Void Logic for all branches (not just Earth)
        if (isPillarVoid(idx, pillars)) {
            score *= 0.3; // 70% reduction for Void Branches
        }
        if (isMonth) {
            const mRel = getRelOrig(zhiWx);
            const dRel = getRelOrig(ZHI_WX[pillars[2].zhi]);

            // [User Fix] Strict Guan Yin Ju: Only Month=Official/Kill AND Day=Seal
            if (mRel === '被克' && dRel === '被生') {
                isGuanYin = true;
            }
        }
        if (isDayBr) {
            // Day branch logic does not trigger Guan Yin Ju anymore
        }

        if (isSameParty(zhiWx)) return score;
        return 0;
    }

    totalScore += applyBranchScore(1, weights.monthZhi, true);
    maxPossibleScore += weights.monthZhi * (isPillarVoid(1, pillars) ? 0.3 : 1.0);

    // [User Request] Month Branch Double Count:
    // ...
    if (isSameParty(ZHI_WX[pillars[1].zhi])) {
        totalScore += weights.monthZhi * (isPillarVoid(1, pillars) ? 0.3 : 1.0);
    }

    totalScore += applyBranchScore(2, weights.dayZhi);
    maxPossibleScore += weights.dayZhi; // Day Pillar usually not Void relative to self

    // Check for Unknown Hour
    if (pillars[3] && !pillars[3].isUnknown && pillars[3].zhi) {
        totalScore += applyBranchScore(3, weights.hourZhi);
        maxPossibleScore += weights.hourZhi * (isPillarVoid(3, pillars) ? 0.3 : 1.0);
    } else {
        // Unknown Hour: Use 3-pillar mode (Reduced Denominator)
        // Do NOT add weights.hourZhi to maxPossibleScore
    }

    totalScore += applyBranchScore(0, weights.yearZhi);
    maxPossibleScore += weights.yearZhi * (isPillarVoid(0, pillars) ? 0.3 : 1.0);

    if (pillars.length > 4) { totalScore += applyBranchScore(4, weights.dyZhi); maxPossibleScore += weights.dyZhi; }
    if (pillars.length > 5) { totalScore += applyBranchScore(5, weights.lnZhi); maxPossibleScore += weights.lnZhi; }

    // [User Request] Consistency Check: Enforce Natural Strength
    // Balanced "Neutral" range (48.5% - 51.5%) for stability
    const isNaturalWeakOrNeutral = totalScore < maxPossibleScore * 0.515;

    // [User Refinement] GuanYin / YinSha pattern bonus adjusted to a stable 16%
    if (isGuanYin) totalScore += maxPossibleScore * 0.16;

    const level = totalScore > maxPossibleScore * 0.515 ? '\u8eab\u5f3a' : (totalScore < maxPossibleScore * 0.485 ? '\u8eab\u5f31' : '\u4e2d\u548c');
    const finalLevel = isGuanYin ? `${level} (\u5b98\u5370\u5c40)` : level;

    // Sync Five Element tags
    const profile = getFiveElementProfile(pillars);

    // Only force "Weak" if the FINAL result is actually Body Weak
    if (level.includes('\u8eab\u5f31') && pillars.length <= 4) {
        const dmElem = profile.find(p => p.element === GAN_WX[dm]);
        if (dmElem) dmElem.isStrong = false;
    }

    return { totalScore, maxPossibleScore, percentage: Math.min(100, Math.round(totalScore / maxPossibleScore * 1000) / 10), level: finalLevel, logs, alerts: logs, isGuanYin, profile };
}


function calculateGlobalScores(pillars) {
    const scores = { '\u6728': 0, '\u706b': 0, '\u571f': 0, '\u91d1': 0, '\u6c34': 0 };
    const weights = { stem: 10, zhi: [10, 45, 20, 15, 20, 30] }; // Y, M, D, H, DayYun, YearYun

    pillars.forEach((p, i) => {
        if (!p || !p.zhi) return; // Skip if no branch (e.g. unknown hour)

        const isVoid = isPillarVoid(i, pillars);
        const voidMult = isVoid ? 0.3 : 1.0;

        // Stem
        if (p.gan && GAN_WX[p.gan]) scores[GAN_WX[p.gan]] += weights.stem * voidMult;

        // Zhi
        if (weights.zhi[i]) scores[ZHI_WX[p.zhi]] += weights.zhi[i] * voidMult;
    });

    // Apply Seasonal Pulse (\u65fa\u76f8\u4f11\u56da\u6b7b)
    if (pillars.length > 1 && pillars[1]) {
        const mWx = ZHI_WX[pillars[1].zhi];
        const m = { '\u6728': 0, '\u706b': 1, '\u571f': 2, '\u91d1': 3, '\u6c34': 4 };
        const baseIdx = m[mWx];
        Object.keys(scores).forEach(wx => {
            if (scores[wx] <= 0) return;
            const currentIdx = m[wx];
            const dist = (currentIdx - baseIdx + 5) % 5;
            if (dist === 1) scores[wx] += 5;
            else if (dist === 4) scores[wx] -= 2;
            else if (dist === 3) scores[wx] -= 5;
            else if (dist === 2) scores[wx] -= 8;
            if (scores[wx] < 0) scores[wx] = 0;
        });
    }

    // Apply 12 Chang Sheng Bonus
    pillars.forEach((p, i) => {
        if (!p) return;
        const zhi = p.zhi;
        Object.keys(scores).forEach(wx => {
            if (scores[wx] <= 0) return; // Fix: Only apply bonus if element exists
            const phase = CHANG_SHENG[wx] ? CHANG_SHENG[wx][zhi] : null;
            if (phase) {
                // Growth phases add points (Gradual & Balanced)
                if (phase === '\u957f\u751f') scores[wx] += 6;
                else if (phase === '\u6c91\u6d74') scores[wx] += 4;
                else if (phase === '\u51a0\u5e26') scores[wx] += 5;
                else if (phase === '\u4e34\u5b98') scores[wx] += 7;
                else if (phase === '\u5e1d\u65fa') scores[wx] += 8;
                // Decline phases: Do not subtract
            }
            if (scores[wx] < 0) scores[wx] = 0;
        });
    });

    return scores;
}

function calculateYongXiJi(pillars, bsResult) {
    if (typeof YongXiJiEngine !== 'undefined' && YongXiJiEngine.calculate) {
        console.log("Using centralized YongXiJiEngine V2 for calculation.");
        return YongXiJiEngine.calculate(pillars, bsResult);
    }

    // Original logic as fallback if engine fails to load
    const m = { '木': 0, '火': 1, '土': 2, '金': 3, '水': 4 }, rev = Object.keys(m);
    const dm = pillars[2].gan;
    const same = GAN_WX[dm], output = rev[(m[same] + 1) % 5];
    return { mode: '扶抑', yong: output, xi: rev[(m[same] + 2) % 5], ji: rev[(m[same] + 4) % 5], reason: 'Fallback logic' };
}

function applyOverStrongSafeguard(res, scores) { return res; }

function calculateAcademicStatus(data, earlyLucks = [], dynamicLuck = null, expertData = null) {
    try {
        if (!data || !data.pillars || !data.bodyStrength) return null;
        const p = data.pillars, dm = p[2].gan, dz = p[2].zhi, bs = data.bodyStrength, acS = bs.level;
        const profile = data.profile || getFiveElementProfile(p);
        // Fix: Aggregate Shen Sha from pillars manually
        const ss = [];
        if (p) {
            p.forEach(pillar => {
                if (pillar.shenSha && Array.isArray(pillar.shenSha)) {
                    ss.push(...pillar.shenSha);
                }
            });
        }

        // 1. \u5168\u91cf\u5341\u795e\u63a2\u6d4b\u5668 (\u5929\u5e72+\u5730\u652f\u85cf\u5e72)
        const getFullGods = () => {
            const results = [];
            p.forEach((柱, i) => {
                // \u5929\u5e72\u5341\u795e
                results.push({ i, god: 柱.tenGod, gan: 柱.gan, isT: true, wx: GAN_WX[柱.gan] });
                // \u5730\u652f\u85cf\u5e72\u5341\u795e
                const hidden = HIDDEN_STEMS_MAP[柱.zhi] || [];
                hidden.forEach(h => {
                    const godInfo = TEN_GODS[dm + h];
                    if (godInfo) {
                        results.push({ i, god: godInfo[0], gan: h, isT: false, wx: GAN_WX[h], zhi: 柱.zhi });
                    }
                });
            });
            return results;
        };

        const allG = getFullGods();
        const filterG = (names) => allG.filter(x => names.includes(x.god));
        const isWStrong = (wx) => (profile.find(x => x.element === wx) || {}).isStrong;

        const seals = filterG(['正印', '偏印', '枭神', '枭']), foods = filterG(['食神', '伤官']),
            officers = filterG(['正官', '七杀', '偏官', '杀']), wealths = filterG(['正财', '偏财', '财星']),
            bibei = filterG(['比肩', '劫财', '比']);

        const isSealT = seals.some(s => s.isT);
        const isOfficerT = officers.some(o => o.isT);
        const isFoodT = foods.some(f => f.isT);

        const matchTerms = [];

        // --- 五、考试运判断逻辑 (Section 5) ---
        if (dynamicLuck) {
            const { daYun, liuNian } = dynamicLuck;
            const dyG = daYun ? daYun.gan : null, dyZ = daYun ? daYun.zhi : null;
            const lnG = liuNian ? liuNian.gan : null, lnZ = liuNian ? liuNian.zhi : null;
            const getGod = (g) => g ? TEN_GODS[dm + g]?.[0] : null;
            const dyGod = getGod(dyG), lnGod = getGod(lnG);

            // 考试运好
            const wcMap = { '甲': '巳', '乙': '午', '丙': '申', '丁': '酉', '戊': '申', '己': '酉', '庚': '亥', '辛': '子', '壬': '寅', '癸': '卯' };
            if (dyZ === wcMap[dm] || lnZ === wcMap[dm]) {
                matchTerms.push({ title: '文昌星动', desc: '文曲星高照！大运或流年遇文昌，这时候脑子特别灵光，考试就像开了挂一样。你有没有觉得这段时间背书特快，一学就会？(是不是感觉如有神助？)', rate: 95 });
            }
            if ((['正官', '七杀'].includes(dyGod) && ['正印', '偏印'].includes(lnGod)) || (['正官', '七杀'].includes(lnGod) && ['正印', '偏印'].includes(dyGod))) {
                matchTerms.push({ title: '岁运官印相生', desc: '这叫“顺水推舟”。岁运帮你铺平了路，官气生印，考试升学特别顺，少有波折。你是不是觉得这段时间运气特别稳，想考哪儿都能中？', rate: 90 });
            }
            if ((['食神', '伤官'].includes(dyGod) && ['正印', '偏印'].includes(lnGod)) || (['食神', '伤官'].includes(lnGod) && ['正印', '偏印'].includes(dyGod))) {
                matchTerms.push({ title: '岁运伤官配印', desc: '这叫“才华落地”。以前可能光有想法没成绩，这段时间突然开窍了，能把聪明才智变成卷子上的高分。是不是感觉发挥特别稳，甚至超常发挥？', rate: 90 });
            }
            if (lnZ && (lnZ === CRASH_MAP[dz] || dz === CRASH_MAP[lnZ])) {
                matchTerms.push({ title: '流年合日支', desc: '人逢喜事精神爽。流年合住日支，身心状态极佳，考试时也就心态放松，自然能考出好成绩。你考试时是不是一点都不紧张？', rate: 85 });
            }
            const cupboardMap = { '辰': '戌', '戌': '辰', '丑': '未', '未': '丑' };
            if (seals.some(s => Object.keys(cupboardMap).includes(s.zhi) && !s.isT)) {
                const z = seals.find(s => Object.keys(cupboardMap).includes(s.zhi)).zhi;
                if (lnZ === cupboardMap[z]) matchTerms.push({ title: '印星入库逢冲', desc: '这叫“厚积薄发”。平常积累的知识就像关在仓库里，一到考试这个特定时间点，仓库门被撞开，才华挡都挡不住。你是不是觉得关键时候总能灵光一现？', rate: 85 });
            }
            if (lnG && (lnG === dm || GAN_HE[lnG] === dm) && ['正印', '偏印'].includes(lnGod)) {
                matchTerms.push({ title: '考试必成功', desc: '这叫“铁板钉钉”。流年印星透出还来合你，证书、录取通知书就像长了腿一样往你怀里跑。那年考试是不是特别特别顺？', rate: 90 });
            }
            if (lnGod === '正官' && seals.some(s => s.isT)) {
                matchTerms.push({ title: '升学考试必过', desc: '金榜题名之象！官星透干来生印，名气和证书都到手。这通常代表能考上重点或理想学校，是不是那年家里人都为你放鞭炮？', rate: 90 });
            }
        }

        // --- 岁运引动 (New: Luck Cycles for age 7-27) ---
        let luckBonus = 0;
        let hasGoodLuck = false;
        if (earlyLucks.length > 0) {
            const luckGods = earlyLucks.map(l => {
                const g = TEN_GODS[dm + l.gan];
                return g ? g[0] : null;
            });

            if (luckGods.includes('正印') || luckGods.includes('偏印')) {
                matchTerms.push({ title: '学龄大运见印', desc: '这是“脑洞大开”的时候。早年走到印星大运，就像海绵吸水一样求知若渴。读书这段时间，老师讲一遍你就能懂，是不是觉得学习很轻松？', rate: 90 });
                luckBonus += 1;
                hasGoodLuck = true;
            }
            if (luckGods.includes('正官') || luckGods.includes('七杀')) {
                matchTerms.push({ title: '学龄大运见官', desc: '早年岁运引动约束力，虽然有一定课业压力，但能自律上进。', rate: 88 });
                luckBonus += 0.5;
                hasGoodLuck = true;
            }

            if (!hasGoodLuck) {
                matchTerms.push({ title: '学龄岁运无助', desc: '这相当于“逆水行舟”。求学关键期少了把推力，全靠自己硬扛。是不是常觉得明明努力了，成绩却总是起起伏伏不太稳定？需要付出双倍努力才行。', rate: 85 });
                luckBonus -= 1;
            }
        }

        // --- \u4e09\u3001\u5370\u661f\u72b6\u6001\u5206\u6790 (Section 3) ---
        if (seals.length > 0) {
            const hasT = seals.some(s => s.isT);

            // [Engine Check] Seal Support
            let engineSealFact = null;
            if (expertData && expertData.summary) {
                const matches = expertData.summary.match(/得.*(印|生助).*/);
                if (matches) engineSealFact = matches[0];
            }

            if (hasT && seals.some(s => !s.isT)) {
                let desc = '你这命局，印星透干且地支有根，就好比脑袋里装了个“超级数据库”。读书对你来说不是苦差事，是像呼吸一样自然。你是不是觉得记忆力特别好，看书过目不忘？';
                if (engineSealFact) desc += ` (引擎验证：${engineSealFact}，根基深厚)`;
                matchTerms.push({ title: '印星透干有根', desc: desc, rate: 90 });
            }
            else if (hasT) matchTerms.push({ title: '印星透干', desc: '学习能力外露，聪明好学，易得师长认可。但这股劲儿有时候浮在面上，要沉下心来才能成大器。你觉得呢？', rate: 85 });
            else matchTerms.push({ title: '印星深藏', desc: '具备内秀，学习上有后劲，属于潜心钻研型。', rate: 80 });

            if (acS === '身弱') matchTerms.push({ title: '印星为用', desc: '这叫“枯木逢春”。印星是你命里的贵人，越读书命越好。知识真的是力量，能帮你彻底改变命运。你是不是觉得只有在书本里才最踏实？', rate: 95 });
            else if (acS === '身强') matchTerms.push({ title: '印星为忌', desc: '书呆子陷阱。书读了不少，但容易钻牛角尖，或者太依赖老师家长的安排，反而没了主见。你是不是有时候觉得脑子转不过弯来？', rate: 90 });

            const tWealths = wealths.filter(w => w.isT);
            const proxBroken = tWealths.some(w => seals.some(s => s.isT && Math.abs(w.i - s.i) === 1));
            if (proxBroken) matchTerms.push({ title: '财星破印', desc: '财星贴身克印，上课易分心走神，关注贪玩或外界诱惑。', rate: 90 });
        } else {
            matchTerms.push({ title: acS === '身强' ? '身旺无印' : '日主弱无印', desc: '这叫“野马脱缰”。命里少了文星管束，坐冷板凳读书对你来说太煎熬了。是不是觉得比常人更难静下心来？需要极大的毅力去克制。', rate: 85 });
        }

        // --- \u56db\u3001\u98df\u4f24\u914d\u5408\u5206\u6790 (Section 4) ---
        if (foods.length > 0) {
            if (isWStrong(foods[0].wx)) matchTerms.push({ title: '食伤旺相', desc: '才华横溢，思维敏锐，领悟力极强，聪明过人。', rate: 90 });

            if (seals.length > 0) {
                if (foods.some(f => f.god === '伤官')) {
                    const hoStem = foods.some(f => f.god === '伤官' && f.isT);
                    const hoBranch = foods.some(f => f.god === '伤官' && !f.isT);
                    const sealStem = seals.some(s => s.isT);
                    const sealBranch = seals.some(s => !s.isT);

                    if ((hoStem || hoBranch) && (sealStem || sealBranch)) {
                        if (!hoStem && !sealStem) {
                            matchTerms.push({ title: '伤官配印 (隐藏)', desc: '这是“潜龙在渊”。你很有才华，也很守规矩，但这些优点都藏得比较深。虽然名气可能没那么大，但在专业圈子里大家都很服你。属于那种默默耕耘的实力派。', rate: 85 });
                        } else {
                            matchTerms.push({ title: '伤官配印 (成格)', desc: '这是“顶级学霸”的配置。聪明劲儿用对了地方，既有天才的脑子，又有学者的定力。这种格局最容易出教授、专家。你读书时是不是那种既能玩又能考第一的人？', rate: 95 });
                        }
                    } else if (isSealT && isFoodT) {
                        // Fallback for mixed cases (e.g. Stem HO + Stem Seal but missing root, or mixed) - Keep existing or lower?
                        // User said "Then allow half". Let's keep a generic one for other cases? 
                        // Or just stick to the two user defined ones?
                        // User implies these IS the definition. 
                        // Let's add a generic one for "Interaction" if not meeting the strict ones.
                        matchTerms.push({ title: '伤官配印 (一般)', desc: '这叫“刚柔并济”。聪明劲儿有，定力也有，只要稍微努努力，把这两股劲儿捏合在一起，成绩绝对差不了。你是不是需要找个好老师点拨一下？', rate: 88 });
                    }
                } else {
                    if (isSealT) {
                        matchTerms.push({ title: '食伤泄秀配印 (透干)', desc: '才华横溢之象。脑子转得快，逻辑又严密，在学校里绝对是风云人物。这种聪明是藏不住的，大家都公认你聪明，对吗？', rate: 90 });
                    } else {
                        matchTerms.push({ title: '食伤泄秀配印 (藏支)', desc: '这叫“内功深厚”。你的见解很独到，虽然平时不爱显摆，但一跟人聊深了，大家都会佩服你的底蕴。属于那种底子特别扎实的学生。', rate: 85 });
                    }
                }
            } else if (acS === '身强') {
                matchTerms.push({ title: '身旺食伤泄秀', desc: '才华得到充分外溢，聪明绝顶，各科成绩常名列前茅。', rate: 90 });
            }

            if (seals.some(s => s.god === '偏印') && foods.some(f => f.god === '食神') && officers.length === 0) {
                matchTerms.push({ title: '枭神夺食', desc: '这叫“关键时刻掉链子”。平时看着挺好，一到大考就容易因为情绪紧张、或者身体不舒服而失利。你有过这种“可惜”的经历吗？', rate: 85 });
            }
        }

        // --- \u4e94\u3001\u5b98\u6740\u4f5c\u7528\u5206\u6790 (Section 5) ---
        if (officers.length > 0) {
            if (seals.length > 0) {
                if (officers.some(o => o.god === '正官')) {
                    if (isSealT && isOfficerT) {
                        matchTerms.push({ title: '官印相生 (透干)', desc: '状元之才。高度自律加上高智商，求学升迁之路就像开了绿灯。这种格局考试基本没失手过，是不是？', rate: 95 });
                    } else {
                        matchTerms.push({ title: '官印相生 (藏支)', desc: '这是“实干家”的命。很有水平，但运气稍微欠点火候，或者你的才华只被小圈子认可。是不是常觉得怀才不遇，需要更广阔的平台？', rate: 85 });
                    }
                } else {
                    if (isSealT) {
                        matchTerms.push({ title: '七杀化印 (透干)', desc: '寒门贵子之象。也是“逼出来”的学霸。可能是家里管得严，或者是自己好胜心强，把压力全变成了动力。早年是不是吃过不少苦才出来的？', rate: 90 });
                    } else {
                        matchTerms.push({ title: '七杀化印 (藏支)', desc: '这叫“卧薪尝胆”。平时默默无闻，其实心里憋着一股劲。承压能力极强，一旦机会成熟，爆发力惊人。属于大器晚成的类型。', rate: 85 });
                    }
                }
            }
            if (officers.some(o => o.god === '正官' && acS === '身弱')) matchTerms.push({ title: '官星为用', desc: '这叫“守规矩得利”。你学习态度极其端正，老师怎么说你就怎么做。只要按部就班，成绩绝对稳步上升。是不是特别听话？', rate: 90 });
            if (officers.some(o => o.god === '正官') && officers.some(o => o.god === '七杀') && seals.length === 0) {
                matchTerms.push({ title: '官杀混杂', desc: '心里容易“打架”。一会儿想往东，一会儿想往西，自我要求标准不统一。学业状态也因此忽高忽低。是不是经常纠结？', rate: 85 });
            }
        }

        // --- 六、高低学历断语 (Section 6) ---
        // [Refined Logic] Wealth-Officer-Seal Strict Check
        const allStems = p.map(pi => pi.gan);
        const allZhis = p.map(pi => pi.zhi);
        // Helper to check if a character's TenGod is in target set
        const checkGod = (g, z, targets) => {
            const gods = [];
            if (g) gods.push(getTenGod(dm, g)); // Stem God
            // For branch, we check its main energy (usually mapped via Hidden Stems logic or just TenGod of the branch relative to DM)
            // Here we use the pre-calculated `allG` which includes hidden stems. 
            // But for "Pure" check, we usually look at the Main Qi or just if the *element* relation matches.
            // Simpler: Check if the element relation matches Wealth/Officer/Seal.
            const dmWx = GAN_WX[dm];
            const itemWx = g ? GAN_WX[g] : ZHI_WX[z];
            const rel = WX_RELATION[dmWx][itemWx];
            // Wealth: 克, Officer: 被克, Seal: 被生
            return targets.includes(rel);
        };

        const targetRels = ['克', '被克', '被生']; // Wealth, Officer, Seal
        // Pure Check: Do all 7 chars (excluding DM) belong to these types?
        let isPure = true;
        for (let i = 0; i < 4; i++) {
            if (!p[i]) continue;
            const g = p[i].gan;
            const z = p[i].zhi;
            // Skip DM Stem
            if (i !== 2 && !targetRels.includes(WX_RELATION[GAN_WX[dm]][GAN_WX[g]])) isPure = false;
            if (!targetRels.includes(WX_RELATION[GAN_WX[dm]][ZHI_WX[z]])) isPure = false;
        }

        // Basic Check: Officer & Seal in BOTH Stem AND Branch
        const hasStemOfficer = officers.some(o => o.isT);
        const hasStemSeal = seals.some(s => s.isT);
        const hasBranchOfficer = officers.some(o => !o.isT);
        const hasBranchSeal = seals.some(s => !s.isT);

        if (isPure) {
            matchTerms.push({ title: '财官印纯粹 (顶级)', desc: '满盘财官印，天干地支皆全，学业登峰造极。', rate: 98 });
        } else if (hasStemOfficer && hasStemSeal && hasBranchOfficer && hasBranchSeal && wealths.length > 0) {
            matchTerms.push({ title: '财官印俱全 (标准)', desc: '这是“全能型选手”。天干地支官印皆全，五行流通无阻，最利登科成名。这种人读书、做官、赚钱样样都行，是不是让人很羡慕？', rate: 95 });
        }

        // --- 七、学术成就判断 (Section 7) ---
        const hasW = wealths.length > 0, hasO = officers.length > 0, hasS = seals.length > 0;
        if (hasW && hasO && hasS) {
            const isFlow = seals.some(s => s.isT);
            matchTerms.push({ title: isFlow ? '三奇顺生 (外显)' : '三奇顺生 (内藏)', desc: '这是“学术泰斗”的苗子。五行流通无阻，不仅学历高，还能在某个领域成为权威。你是不是从小就是那种“别人家的孩子”？', rate: isFlow ? 95 : 88 });
        }
        if (foods.some(f => f.god === '伤官') && officers.some(o => o.god === '七杀')) {
            matchTerms.push({ title: '伤官合杀', desc: '这叫“降龙伏虎”。你有本事解决别人解决不了的难题。能在学术上搞定硬骨头，发表震动业界的成果。是不是特喜欢挑战高难度？', rate: 90 });
        }

        // --- NEW: Shang Guan Jian Guan (Hurt Officer Clashing Officer) ---
        // Check if Hurt Officer and Direct Officer appear in Stems and are adjacent or just present
        // Simplified: If both appear in Stems.
        const stemHO = foods.filter(f => f.god === '伤官' && f.isT);
        const stemDO = officers.filter(o => o.god === '正官' && o.isT);
        let hasSGJG = false;
        if (stemHO.length > 0 && stemDO.length > 0) {
            hasSGJG = true;
            matchTerms.push({ title: '伤官见官', desc: '这叫“恃才傲物”。你聪明是真聪明，但就是不服管。容易跟老师或者学校制度对着干，导致学业波折。能不能收收那个倔脾气？', rate: 85, type: 'bad' });
        }

        // [Refined Logic] Wood-Fire Brightness (Strict)
        // Month is Yin/Mao/Chen, Stems reveal Bing/Ding, DM is Wood & Strong
        const mz = p[1].zhi;
        const hasFireStem = allStems.some(g => ['丙', '丁'].includes(g));
        if (GAN_WX[dm] === '木' && ['寅', '卯', '辰'].includes(mz) && hasFireStem && acS === '身强') {
            matchTerms.push({ title: '木火通明', desc: '这就是“文学巨星”。文采出众，思维敏捷，顶尖文科或创作学霸。你写文章是不是特别有灵气，下笔如有神？', rate: 90 });
        }
        if (GAN_WX[dm] === '金' && isWStrong('水') && acS === '身强') matchTerms.push({ title: '金水伤官', desc: '这是“逻辑天才”。也就是理工科的顶尖学霸。逻辑极其严密，思维极其敏捷，数学物理是不是对你来说特简单？', rate: 90 });

        // --- \u6210\u7ee9\u4e0e\u795e\u715e (Section 7/8/9) ---
        if (ss.includes('文昌贵人')) matchTerms.push({ title: '文昌入命', desc: '自带文昌星，这就是“天赋异禀”。别人苦读三年，你悟道三天。这种灵气是骨子里带的，常有神来之笔。', rate: 85 });
        if (ss.includes('学堂')) matchTerms.push({ title: '学堂入命', desc: '基础深厚，求学路径正统，利于学术深造。', rate: 85 });
        if (bibei.length >= 2 && foods.length > 0) {
            matchTerms.push({ title: '比劫夺食', desc: '这叫“僧多粥少”。学习资源容易被抢占，或者分心的事儿太多。本来属于你的机会，容易被别人截胡。是不是常觉得竞争压力特别大？', rate: 85 });
        }
        if (bibei.length > 1 && acS === '身强') matchTerms.push({ title: '比劫夺财', desc: '这叫“呼朋唤友”。社交活动太多了，朋友一叫就出去玩，怎么能静心读书？要想成绩好，得先学会拒绝。', rate: 85 });

        // --- NEW: Integrate Academic Decision Tree Results ---
        if (expertData && expertData.decisionResult && expertData.decisionResult.results) {
            expertData.decisionResult.results.forEach(res => {
                const isAcademic = res.category === 'academic' || (res.id && res.id.toLowerCase().includes('academic')) || (res._specificTrace && res._specificTrace.some(t => t.category === 'academic'));
                if (isAcademic && !matchTerms.some(t => t.title === res.title)) {
                    matchTerms.push({
                        title: res.title,
                        desc: res.text || res.desc,
                        rate: 90
                    });
                }
            });
        }

        const hasNatalIndirectSeal = seals.some(s => s.god === '偏印');
        const hasNatalSevenKillings = officers.some(o => o.god === '七杀');
        const isPatternRebellious = hasNatalIndirectSeal && hasNatalSevenKillings;

        const isRebellious = isPatternRebellious || matchTerms.some(t => {
            const tt = t.title || "";
            return tt.includes('杀枭相生') || tt.includes('奇才');
        });

        const isKillControlled = expertData && expertData.academicContext && expertData.academicContext.isKillingControlled;
        const isSealControlled = expertData && expertData.academicContext && expertData.academicContext.isSealControlled;
        const isControlGood = isKillControlled || isSealControlled;

        // [New] Rebellion Stability Check (Special handling for 1994-3-3 case)
        // If Killings are too heavy (>=3) and DM is weak, "Genius" turns into "Dropout"
        // EXCEPT if they are well controlled (1987-9-19 case)
        const killingCount = officers.filter(o => o.god === '七杀').length;
        const isRebellionHeavy = isRebellious && killingCount >= 3 && acS.includes('身弱') && !isControlGood;

        if (isRebellionHeavy) {
            matchTerms.push({
                title: '极度叛逆 (中途辍学风险)',
                desc: '虽然你极具奇才潜质，但命局中七杀过重且自身偏弱，这种“克制”带来的叛逆心远超由于印星带来的定力。你很容易在初高中阶段因为厌恶传统的说教、规则或巨大的同辈压力而选择“逃离”校园。属于“天才的陨落”，如果不加强定力教育，极易早早辍学。',
                rate: 90
            });
        }

        if (isRebellious && isControlGood) {
            matchTerms.push({
                title: '杀枭有制 (奇才大成)',
                desc: '你的命局呈现出一种极高阶的“奇才”配置。七杀与偏印在命中得到了有效的制衡与修剪。这代表你具备极强的自我控制力，能够将这种破坏性的能量转化为开创性的学术研究或极其高深的专业技能。',
                rate: 95
            });
        }

        // --- \u504f\u79d1\u9884\u6d4b ---
        let pBias = '全科均衡发展';
        const isW = ss.includes('文昌贵人');
        const isWF = (GAN_WX[dm] === '木' && isWStrong('火'));
        const isMS = (GAN_WX[dm] === '金' && isWStrong('水'));

        if (isRebellious) pBias = '偏门领域/奇才异能';
        else if (isWF || seals.some(s => s.god === '正印' && s.isT) || isW) pBias = '文史研究/艺术见长';
        else if (isMS || seals.some(s => s.god === '偏印' && s.isT) || officers.some(o => o.god === '七杀')) pBias = '理工逻辑/数理卓越';
        else if (foods.length > 0 && seals.length > 0) pBias = '艺术/技术综合天赋';

        // --- 学业态度 ---
        let attitude = '一般稳定';

        if (isRebellionHeavy) attitude = '极度叛逆 (甚至产生辍学念头)';
        else if (isRebellious && isControlGood) attitude = '奇才大成 (自我控制力强)';
        else if (isRebellious) attitude = '不是学不会，而是不想学 (奇才叛逆)';
        else if (seals.some(s => s.god === '正印') && (acS === '身弱' || acS === '极弱')) attitude = '极其刻苦奋斗'; // Preferred for Zheng Yin
        else if (seals.length > 0 && (acS === '身弱' || acS === '极弱')) attitude = '极其刻苦奋斗';
        else if (officers.some(o => o.god === '正官') && acS === '身弱') attitude = '自律性极强';
        else if (acS === '身强' && seals.length > 0) attitude = '厌学贪玩'; // 印旺为忌
        else if (wealths.length > 0 && acS === '身强') attitude = '贪玩厌学倾向';
        else if (acS === '身强' && seals.length === 0) attitude = '散漫懈怠';

        // --- 学历层级评定 (Section 8) ---
        let gL = '专科/高中';
        const elite = [
            '财官印俱全 (顶级)', '财官印俱全 (标准)', '三奇顺生 (外显)', '官印相生', '伤官配印', '木火通明', '金水伤官',
            '岁运官印相生', '岁运伤官配印', '文昌星动', '学龄大运见印', '学龄大运见官', '奇才变通 (杀枭相生)'
        ];
        const rates = matchTerms.map(t => t.rate);
        const eliteCount = matchTerms.filter(t => elite.includes(t.title) || t.title.includes('杀枭相生')).length;

        // 刑冲克破检测 (此处化用为财破印、枭夺食等损伤信号)
        let hasDamage = matchTerms.some(t => ['财星破印', '枭神夺食', '学龄岁运无助'].includes(t.title));

        // [Expert-Driven Sync] Check for star quality signals
        if (expertData && expertData.results) {
            const killings = expertData.results.find(r => r.god === '七杀');
            const seal = expertData.results.find(r => r.god === '正印' || r.god === '偏印');

            if (killings && killings.starQuality === '无制') {
                hasDamage = true;
                if (!matchTerms.some(t => t.title === '七杀无制')) {
                    matchTerms.push({ title: '七杀无制', desc: '七杀旺而无制，这种压力或叛逆心会演变成学业的阻碍。', rate: 90 });
                }
            }
            if (seal && seal.starQuality === '受损') {
                hasDamage = true;
                if (!matchTerms.some(t => t.title === '用神受损')) {
                    matchTerms.push({ title: '用神受损', desc: '原本利于学业的印星被克制，导致关键时刻发挥失常或学业中断。', rate: 90 });
                }
            }
        }

        if (eliteCount >= 2 || (eliteCount >= 1 && (rates.some(r => r >= 95) || luckBonus >= 1))) {
            // 如果有强力岁运支持（luckBonus >= 1）且有精英格局，评为顶级
            if (hasGoodLuck || luckBonus >= 1) gL = '博士/硕士 (顶尖)';
            else if (!isSealT || hasDamage) gL = '本科及以上 (优异)';
            else gL = '博士/硕士 (顶尖)';
        }
        else if (eliteCount >= 1 || rates.filter(r => r >= 90).length >= 2 || matchTerms.some(t => t.title.includes('隐藏')) || luckBonus >= 1) {
            gL = '本科及以上 (优异)';
        }
        else if (hasDamage) {
            gL = '高中及以下 (待补)';
        }

        // Downgrade for Shang Guan Jian Guan or Heavy Rebellion
        if (hasSGJG || isRebellionHeavy) {
            gL = '高中及以下 (波折)';
            if (isRebellionHeavy) gL = '高中及以下 (极度叛逆)';
        }

        return {
            dm: GAN_WX[dm], acStrength: acS, gradeLevel: gL, matchTerms, pBias, attitude, basicInfo: {
                seal: [...new Set(seals.map(x => x.gan))].join(' ') || '无',
                food: [...new Set(foods.map(x => x.gan))].join(' ') || '无'
            }
        };
    } catch (e) {
        console.error("Error in calculateAcademicStatus", e);
        return null;
    }
}

function calculateWealthStatus(data, currentLuck = null, expertData = null) {
    if (!data || !data.pillars || !data.bodyStrength) return null;
    const p = data.pillars, dm = p[2].gan, bs = data.bodyStrength, acS = bs.level;
    const profile = data.profile || getFiveElementProfile(p);
    // Fix: Aggregate Shen Sha from pillars manually as it's not in root
    const ss = [];
    if (p) {
        p.forEach(pillar => {
            if (pillar.shenSha && Array.isArray(pillar.shenSha)) {
                ss.push(...pillar.shenSha);
            }
        });
    }

    // 1. 全量十神探测器 (天干+地支藏干)
    const getFullG = () => {
        const res = [];
        p.forEach((柱, i) => {
            res.push({ i, god: 柱.tenGod, gan: 柱.gan, isT: true, wx: GAN_WX[柱.gan] });
            const hidden = HIDDEN_STEMS_MAP[柱.zhi] || [];
            hidden.forEach(h => {
                const g = TEN_GODS[dm + h];
                if (g) res.push({ i, god: g[0], gan: h, isT: false, wx: GAN_WX[h], zhi: 柱.zhi });
            });
        });
        return res;
    };

    const allG = getFullG();
    const filterG = (names) => allG.filter(x => names.includes(x.god));
    const isWStrong = (wx) => (profile.find(x => x.element === wx) || {}).isStrong;

    const wealths = filterG(['正财', '偏财']), seals = filterG(['正印', '偏印']),
        foods = filterG(['食神', '伤官']), officers = filterG(['正官', '七杀']),
        bibei = filterG(['比肩', '劫财']);

    const matchTerms = [];
    const isWealthT = wealths.some(w => w.isT);
    const isWealthR = wealths.some(w => !w.isT);
    const isFoodT = foods.some(f => f.isT); // Added this line

    // --- 岁运引动 (New: Global Luck Cycle Integration) ---
    // Expert Check: If expert engine found specific luck patterns, prioritize them
    const expertLuckTerms = expertData && expertData.matchTerms ? expertData.matchTerms.filter(t => t.id && t.id.startsWith('res_C_')) : [];

    let luckScoreBonus = 0;
    if (currentLuck) {
        const lGod = TEN_GODS[dm + currentLuck.gan]?.[0];
        if (['正财', '偏财'].includes(lGod)) {
            if (expertLuckTerms.every(t => !t.title.includes('财'))) {
                matchTerms.push({ title: '大运走财地', desc: '当前处于财星大运，赚钱机会明显增多，是积累财富的黄金期。', rate: 95 });
            }
            luckScoreBonus += 40;
        } else if (['食神', '伤官'].includes(lGod)) {
            if (expertLuckTerms.every(t => !t.title.includes('食') && !t.title.includes('伤'))) {
                matchTerms.push({ title: '大运走食伤', desc: '当前处于食伤生财运，适合技术、创意、商业模式的变现。', rate: 90 });
            }
            luckScoreBonus += 30;
        } else if (['正印', '偏印'].includes(lGod) && acS === '身弱') {
            matchTerms.push({ title: '大运走印星', desc: '身弱逢印运，得贵人扶助，财运趋于稳定且有实质增长。', rate: 85 });
            luckScoreBonus += 20;
        }
    }

    // Add Expert Luck Terms (Highest Priority for Luck Cycles)
    if (expertLuckTerms.length > 0) {
        expertLuckTerms.forEach(t => matchTerms.push(t));
    }

    // --- 3. 财星状态判断 (Section 3) ---
    // [Expert Check] If expert engine has natal wealth insights, prioritize them
    const expertNatalTerms = expertData && expertData.matchTerms ? expertData.matchTerms.filter(t => t.id && (t.id.startsWith('res_A') || t.id.startsWith('res_B'))) : [];

    let isAnyWealthRobbed = false;

    if (wealths.length > 0) {
        // Only trigger generic logic if expert engine didn't provide a specific professional assertion
        if (expertNatalTerms.length === 0) {
            if (isWealthT && isWealthR) matchTerms.push({ title: '财星透干有根', desc: '我看你财星透出且有强根，说真的，这就像家里有深地基的仓库，装得满满当当。这些都是能实在落袋的真金白银。你赚钱是不是一直比较稳，很少有大起大落？(对不对？)', rate: 90 });
            else if (isWealthT) matchTerms.push({ title: '财星虚浮', desc: '这就是典型的“过路财神”。面子上光鲜亮丽，大家以为你很有钱，其实只有你自己知道，口袋里经常是紧巴巴的。钱刚到手还没捂热就出去了。你是不是总觉得财来财去一场空？(你想想是不是？)', rate: 85 });
            else if (isWealthR) matchTerms.push({ title: '财星深藏', desc: '这叫“财不露白”。你命里的财就像埋在土底下的金罐子，平时不显山露水，但最能守得住。你平常是不是特不喜欢张扬，喜欢闷声发大财？(这种心性对得上吗？)', rate: 85 });

            if (acS === '身强') {
                if (isWStrong(wealths[0].wx)) matchTerms.push({ title: '身强财旺', desc: '这简直就是“老天爷赏饭吃”。身强力壮挑金山，说真的，只要运势稍微推一把，你这财运挡都挡不住。你自己有没有觉得精力特别旺盛，总想折腾点大事？(能感觉到吗？)', rate: 95 });
                else matchTerms.push({ title: '身强能担财', desc: '这叫“铁肩担富”。你的底气很足，就像一辆大马力的货车，拉多少货都不嫌累。这种局，只要机会一到，就有实实在在的进项。现在的节奏你觉得对吗？', rate: 90 });
            } else if (acS === '身弱') {
                if (wealths.length >= 3) matchTerms.push({ title: '身弱财多', desc: '这象有点扎心，叫“富屋贫人”。满眼都是财，但身体太弱挑不动，就像小孩守着一桌满汉全席，想吃却消化不良。你是不是常觉得赚钱特累，或者钱多了反而身体不舒服？(有这种感觉吗？)', rate: 90 });
                else matchTerms.push({ title: '身弱财轻', desc: '这叫“力不从心”。财富虽有，但你现在的底气还差点火候。这种局不能单打独斗，得找人帮衬。你以前求财是不是总觉得差那么临门一脚？(你想想是不是？)', rate: 85 });
            }
        } else {
            // Push professional assertions from Expert Engine
            expertNatalTerms.forEach(t => matchTerms.push(t));
        }


        // 财星被合 (Section 3.3)
        const ganHe = { '甲': '己', '己': '甲', '乙': '庚', '庚': '乙', '丙': '辛', '辛': '丙', '丁': '壬', '壬': '丁', '戊': '癸', '癸': '戊' };

        // Check for ANY combination (DM or Other)
        let isCombinedWithDM = wealths.some(w => w.isT && p[2].gan === ganHe[w.gan]);
        let isCombinedWithOther = wealths.some(w => w.isT && p.some((柱, idx) => idx !== w.i && idx !== 2 && 柱.gan === ganHe[w.gan]));
        let isCompetingHe = isCombinedWithDM && isCombinedWithOther;

        if (isCompetingHe) {
            matchTerms.push({ title: '争合夺财', desc: '这个象叫“两男争一女”或“两女争一男”。你合着财，外界也有合神试图争夺。这就说明你的赚钱机会或者另一半，总是在多方博弈中，容易出现反复和竞争。你是不是常觉得属于你的东西，总有人在旁边等着分一杯羹？', rate: 95 });
        } else if (isCombinedWithOther) {
            matchTerms.push({ title: '财星被合', desc: '这就是“财被合走”。你辛苦种的果子，眼看熟了，却容易被外界合神顺手摘走。这种象往往代表赚钱路上有绊子，财源被外界牵绊住了。你是不是常遇到快到手的钱被截胡？', rate: 90 });
        } else if (isCombinedWithDM) {
            let desc = '这叫“财来就我”，财星主动投怀送抱。你天生就有这种吸金体质，赚钱不需要求爷爷告奶奶，机会往往会自己找上门。';
            // If there are robbers in branches, add a warning
            if (bibei.some(b => !b.isT)) {
                desc += ' 不过由于你八字里暗藏劫财，虽然财缘深厚，但仍需防范这种“深情被分心”的风险，对吧？';
            }
            matchTerms.push({ title: '财来就我', desc: desc, rate: 95 });
        }

        // 比劫夺财 (Section 3.2)
        const tWealths = wealths.filter(w => w.isT);
        const tBibei = bibei.filter(b => b.isT);

        // Refined Seizing Check: 
        // 1. Bi Jie must be adjacent to Wealth on Stems OR in the same pillar.
        // 2. Skip if Wealth is combined with DM (Protection).
        isAnyWealthRobbed = tWealths.some(w => {
            // Protection check
            // Protection check: DM combining with wealth star protects it unless competed for
            if (p[2].gan === ganHe[w.gan] && !isCompetingHe) return false;

            // Proximity check: Adjacent stems
            const hasAdjacentRobber = p.some((柱, idx) => idx !== w.i && ['比肩', '劫财'].includes(getTenGod(dm, 柱.gan)) && Math.abs(idx - w.i) === 1);
            // Proximity check: Same pillar branch
            const hiddenG = HIDDEN_STEMS_MAP[p[w.i].zhi] || [];
            const hasSamePillarRobber = hiddenG.some(h => ['比肩', '劫财'].includes(getTenGod(dm, h)));

            return hasAdjacentRobber || hasSamePillarRobber;
        });

        if (isAnyWealthRobbed) {
            if (officers.some(o => o.isT)) {
                matchTerms.push({ title: '官星护财', desc: '你这叫“御林军护驾”。虽然有人想分你的财，但好在你命里有官星镇着，就像门口站着带刀侍卫，财气反而更稳。这种象说明你这人很有原则，守得住底线，对吗？', rate: 95 });
            } else {
                let desc = '这个象比较明显，叫“比劫夺财”。说白了就是网兜破了个大洞，不管你往里装多少鱼，走两步就漏一条。你是不是常遇到借钱不还，或者莫名其妙就花冤枉钱？(这个漏财的洞你发现了吗？)';
                matchTerms.push({ title: '比劫夺财', desc: desc, rate: 95 });
            }
        }
    } else {
        if (foods.length > 0) matchTerms.push({ title: '无财有食伤', desc: '虽然没看到财星，但你有“食伤”这个印钞机。这叫“技术生财”。你靠的是脑子和手艺，这种财源比什么都稳。你现在是不是靠专业吃饭的？(明白这个象吗？)', rate: 90 });
        else matchTerms.push({ title: '无财无食伤', desc: '这叫“源头枯竭”。既没目标，又没门路，就像在沙漠里找水喝。这种格局最忌讳盲目投资，一定要稳扎稳打。你是不是总觉得有力使不出，找不到方向？(有这种迷茫感吗？)', rate: 90 });
    }

    // --- 3.1 核心实战断语 (Master Synthesis Layer) ---
    // 怀才不遇型 (Rule 19)
    if (acS.includes('强') && foods.length > 0 && wealths.length === 0) {
        matchTerms.push({
            title: '【怀才不遇型】',
            desc: `(AI 自动生成)：嗯，那就对上了。我看你局中食伤吐秀，身强且底气十足，才华是毋庸置疑的。但可惜财星不显，就像一台马力全开的引擎没接上转轴，只能在原地空转。你是不是总觉得自己满腹经纶、一身技术，却总找不到实实在在的变现舞合？(你有注意过吗？)`,
            rate: 95
        });
    }

    // --- 4. 财库与食伤 (Section 4) ---
    const tombMap = { '水': '辰', '火': '戌', '金': '丑', '木': '未' };
    const wealthWx = wealths.length > 0 ? wealths[0].wx : (foods.length > 0 ? GAN_WX[foods[0].gan] : null); // 没财看食伤
    const tombZhi = wealthWx ? tombMap[wealthWx] : null;
    let hasTomb = false, isTombOpen = false;

    if (tombZhi) {
        const tombs = allG.filter(g => g.zhi === tombZhi);
        if (tombs.length > 0) {
            hasTomb = true;
            matchTerms.push({ title: '财有库', desc: '命带财库，这就好比家里有个保险柜。赚钱是一回事，能存下才是真本事。你这辈子不仅能赚，最重要的是能“锁住”。你是不是平常挺喜欢存钱的？(这种“守”的能耐你有察觉吗？)', rate: 95 });
            if (tombs.some(t => t.i === 2)) matchTerms.push({ title: '日坐财库', desc: '日坐财库，那是“近水楼台”。财富缘分就在脚底下，甚至你的另一半就是你的大财星。只要不被冲坏，这辈子衣食无忧。你是不是觉得自己这方面运气挺好？(准不准？)', rate: 90 });
            if (tombs.length >= 2) matchTerms.push({ title: '财库重叠', desc: '财库连珠，这是“巨富”的苗子。说明你命里的仓库特别大，进财都是按“车”算的。只要运势一到，就能富甲一方。你有这个心理准备吗？', rate: 90 });

            // 冲开判定 (Section 4.1)
            const crashMap = { '辰': '戌', '戌': '辰', '丑': '未', '未': '丑' };
            if (allG.some(g => g.zhi === crashMap[tombZhi])) {
                if (acS === '身强') {
                    isTombOpen = true;
                    matchTerms.push({ title: '财库冲开', desc: '财库逢冲，这意味着“开闸放水”。一旦遇到冲的年份，仓库门被撞开，财气喷涌而出。你现在是不是正等待一个翻身的机会？(你想想是不是？)', rate: 95 });
                } else {
                    matchTerms.push({ title: '财库被破坏', desc: '财库被冲坏，这叫“破库伤财”。保险柜的门坏了，钱自然就守不住。这种象要防大起大落。你过往有没有那种“一夜回到解放前”的经历？(希望能引起你的警惕。)', rate: 85 });
                }
            }
        }
    }

    if (foods.length > 0 && wealths.length > 0) {
        const isFS = foods.some(f => f.god === '食神'), isSJ = foods.some(f => f.god === '伤官');

        if (isFS) {
            // [Engine Check] Output Generating Wealth
            let engineGenFact = null;
            if (expertData && expertData.summary) {
                const matches = expertData.summary.match(/得食伤[^，。]*生助/);
                if (matches) engineGenFact = matches[0];
            }

            if (isFoodT && isWealthT) {
                let desc = '富贵自天来。你这技艺是摆在台面上的，名利双收。说真的，这就是靠才华吃饭的顶级配置。你自己是不是在圈子里小有名气？(确认一下？)';
                if (engineGenFact) desc += ` (引擎验证：${engineGenFact}，源头稳固)`;
                matchTerms.push({ title: '食神生财 (透干)', desc: desc, rate: 95 });
            } else {
                let desc = '这叫“闷声发大财”。你靠稳健的手段默默积累，虽不张扬但家底厚实。你是不是特反感那种咋咋呼呼的赚钱方式？(对吗？)';
                if (engineGenFact) desc += ` (引擎验证：${engineGenFact}，暗中发力)`;
                matchTerms.push({ title: '食神生财 (藏支)', desc: desc, rate: 90 });
            }
        }

        if (isSJ) {
            if (isFoodT && isWealthT) {
                matchTerms.push({ title: '伤官生财 (透干)', desc: '富贵险中求。你的商业嗅觉太灵敏了，别人看不见的机会你能看见。这种爆发力极强，你自己有察觉到这种野心吗？', rate: 95 });
            } else {
                matchTerms.push({ title: '伤官生财 (藏支)', desc: '机智求财。你这人脑子活，手段灵，赚钱从来不走寻常路。你做生意是不是特喜欢用巧劲儿？(你想想是不是？)', rate: 90 });
            }
        }

        if (foods.some(f => f.isT)) matchTerms.push({ title: '食伤旺透', desc: '财源滚滚。赚钱机会多得像自来水，挡都挡不住。说真的，你这财运让人羡慕。', rate: 90 });

        // 枭神夺食 (Section 3.2)
        if (seals.some(s => s.god === '偏印') && isFS) {
            matchTerms.push({ title: '枭神夺食', desc: '这个象要注意，叫“枭神夺食”。这就好比吃饭的碗被人打翻了。容易因为情绪或突发意外导致财源中断。你以前是不是吃过这方面的亏？', rate: 90 });
        }
    }

    // --- 5/6. 特殊格局与综合评分 (Section 5/6) ---
    if (acS === '身强' && wealths.length > 0 && officers.length > 0) matchTerms.push({ title: '财官双美', desc: '富贵荣华。既有面子又有里子，这是名利双收的好局。你现在的社会地位是不是和你的财富挺匹配的？(你有注意过吗？)', rate: 90 });
    const pWealth = wealths.filter(w => w.god === '偏财');
    const zWealth = wealths.filter(w => w.god === '正财');
    if (pWealth.length > zWealth.length) matchTerms.push({ title: '偏财格', desc: '经商奇才。你这人天生就是做生意的料，有商业头脑，容易发横财。这就是“马无草不肥”，你是不是特喜欢折腾副业？', rate: 90 });
    if (acS.includes('停')) matchTerms.push({ title: '身财两停', desc: '一生富足。你的能力正好能驾驭你的财富，不多不少刚刚好。这叫“不贪不欠”，日子过得最舒心。对吗？', rate: 95 });

    // --- 财富层级评分 (Section 9) ---
    // [Expert-Driven Sync] Refine based on Star Quality (Damaged Yong Shen / Uncontrolled Ji Shen)
    if (expertData && expertData.results) {
        const seal = expertData.results.find(r => r.god === '正印' || r.god === '偏印');
        const killing = expertData.results.find(r => r.god === '七杀');
        const hurt = expertData.results.find(r => r.god === '伤官');
        const friend = expertData.results.find(r => r.god === '比肩' || r.god === '劫财');

        // User specific: 正印用神被制=不好 (Seal damaged)
        if (seal && seal.isYongShen && seal.starQuality === '受损') {
            matchTerms.push({
                title: '印星受损 (基础不稳)',
                desc: '你的护身符受到了克制。在财运上这表现为缺乏长辈助力、资源获取困难，甚至事业平台经常摇摆。',
                type: 'bad',
                rate: 90
            });
        }

        // User specific: 七杀旺而无制=不好 (Killings uncontrolled)
        if (killing && killing.isJiShen && killing.starQuality === '无制') {
            matchTerms.push({
                title: '七杀无制 (压力山大)',
                desc: '本就由于身弱难担财，偏偏七杀又旺而无制，这会带来极大的外部压力和意外损耗，容易招小人或者因压力而破财。',
                type: 'bad',
                rate: 90
            });
        }

        // User specific: 伤官受制=好 (Hurt officer controlled for weak DM)
        if (hurt && acS.includes('身弱') && hurt.starQuality === '有制') {
            matchTerms.push({
                title: '伤官受制 (生财有道)',
                desc: '虽然由于身弱，但伤官得到了适当的制约。这让你在赚钱的过程中能稳得住心神，不至于因为冲动而损财。',
                rate: 85
            });
        }
    }

    let level = '一般 (温饱)', source = '稳定薪资', habit = '平稳节制';
    let baseScore = (wealths.length * 20) + (hasTomb ? 30 : 0) + (isTombOpen ? 50 : 0) + (foods.length * 15) + luckScoreBonus;
    if (acS === '身强') baseScore += 30;
    if (acS === '身弱') baseScore *= 0.6;
    if (baseScore >= 150) level = '大富 (巨富)';
    else if (baseScore >= 100) level = '中富 (优异)';
    else if (baseScore >= 60) level = '小富 (小康)';
    else if (acS === '身弱' && wealths.length >= 3) level = '贫困 (富屋贫人)';

    // --- 致富门路与守财 (Section 4/8) ---
    if (foods.some(f => f.god === '伤官')) source = '技术创新/文化产业/自主创业';
    else if (foods.some(f => f.god === '食神')) source = '技艺服务/咨询行业/创意产业';
    else if (officers.length > 0 && wealths.length > 0) source = '公职升迁/管理咨询/官商协作';
    else if (pWealth.length > 0) source = '资本运作/外贸经商/风险投资';
    else if (zWealth.length > 0) source = '专业技术/固定资产/长期投资';

    if (hasTomb) habit = '财有库，发则能存，滴水不漏';
    else if (isWealthT && !isWealthR) habit = '财星虚浮，看重面子，开销大';
    else if (bibei.length > 2) habit = '比劫夺财，容易因为朋友合作散财';
    else habit = '理财习惯一般，随遇而安';

    return {
        level, source, habit, matchTerms, basicInfo: {
            wealth: [...new Set(wealths.map(x => x.gan))].join(' ') || '无',
            food: [...new Set(foods.map(x => x.gan))].join(' ') || '无'
        },
        flags: {
            isAnyWealthRobbed: isAnyWealthRobbed // Sync for Tree Viewer
        }
    };
}

function calculateMarriageStatus(data, dynamicLuck = null, expertData = null) {
    try {
        if (!data || !data.pillars) return null;
        const p = data.pillars, dm = p[2].gan, dz = p[2].zhi;

        const isMale = (data.gender === '男' || data.gender === '1' || data.gender === 1);
        const profile = data.profile || getFiveElementProfile(p);
        const bs = data.bodyStrength;
        const acS = bs ? bs.level : '中和';
        const matchTerms = [];
        let grade = '普通';
        let timingSummary = '暂无明确婚期信号 (需综合大运流年)';

        // Helpers
        const getTenGod = (g) => g ? TEN_GODS[dm + g]?.[0] : null;

        // Flatten all gods for quick access
        const gods = [];
        p.forEach(pi => {
            const sg = getTenGod(pi.gan);
            if (sg) gods.push(sg);
            const hid = HIDDEN_STEMS_MAP[pi.zhi] || [];
            hid.forEach(h => {
                const hg = getTenGod(h);
                if (hg) gods.push(hg);
            });
        });
        const getWx = (c) => GAN_WX[c] || ZHI_WX[c];

        // Helper: Identify all Ten Gods (Stems and Hidden)
        const getFullG = () => {
            const res = [];
            p.forEach((pillar, i) => {
                res.push({ i, god: getTenGod(pillar.gan), gan: pillar.gan, isT: true, wx: GAN_WX[pillar.gan] });
                const hidden = HIDDEN_STEMS_MAP[pillar.zhi] || [];
                hidden.forEach(h => {
                    const g = getTenGod(h);
                    if (g) res.push({ i, god: g, gan: h, isT: false, wx: GAN_WX[h], zhi: pillar.zhi });
                });
            });
            return res;
        };
        const allG = getFullG();
        const filterG = (names) => allG.filter(x => names.includes(x.god));
        const foods = filterG(['食神', '伤官']);
        const wealths = filterG(['正财', '偏财']);

        // 1. Identify Spouse Star & interactions
        const targetGods = isMale ? ['正财', '偏财'] : ['正官', '七杀'];
        const spouseStars = [];
        let hasZheng = false, hasPian = false;
        let hasChong = false, hasXing = false;

        // Interactions (Fixed: Define at function scope to avoid ReferenceError at line 2995)
        var interactions = data.interactions || (data.bazi && data.bazi.interactions) || { stems: [], branches: [] };

        p.forEach((pillar, i) => {
            // Stem
            const gGod = getTenGod(dm, pillar.gan);
            if (targetGods.includes(gGod)) {
                spouseStars.push({ i, pos: 'gan', god: gGod, val: pillar.gan, wx: GAN_WX[pillar.gan], score: 10 });
                if (gGod === targetGods[0]) hasZheng = true;
                if (gGod === targetGods[1]) hasPian = true;
            }
            // Branch
            const hidden = HIDDEN_STEMS_MAP[pillar.zhi] || [];
            hidden.forEach((h, hIdx) => {
                const hGod = getTenGod(dm, h);
                if (targetGods.includes(hGod)) {
                    spouseStars.push({ i, pos: 'zhi', god: hGod, val: h, wx: GAN_WX[h], score: (hIdx === 0 ? 8 : 4), branch: pillar.zhi });
                    if (hGod === targetGods[0]) hasZheng = true;
                    if (hGod === targetGods[1]) hasPian = true;
                }
            });

            if (interactions && interactions.branches) {
                interactions.branches.forEach(intr => {
                    if (intr.includes(dz)) {
                        if (intr.includes('冲')) hasChong = true;
                        if (intr.includes('刑')) hasXing = true;
                    }
                });
            }
        });

        const sWx = spouseStars.length > 0 ? spouseStars[0].wx : null;
        let isStarInTomb = false;
        if (sWx) {
            const tombZhi = { '木': '未', '火': '戌', '土': '辰', '金': '丑', '水': '辰' }[sWx];
            isStarInTomb = p.some(pillar => pillar.zhi === tombZhi);
        }

        // Specific Flags for Happy/Divorce/Affair
        const isStrongDM = acS.includes('强');
        const dzMainQiStem = HIDDEN_STEMS_MAP[dz]?.[0] || dz;
        const dzGod = getTenGod(dm, dzMainQiStem);
        const isUsefulPalace = (isStrongDM && ['正官', '七杀', '正财', '偏财', '食神', '伤官'].includes(dzGod)) ||
            (!isStrongDM && ['正印', '偏印', '比肩', '劫财'].includes(dzGod));

        // Core Flags for Marriage Logic
        const isDayBranchBiJie = ['比肩', '劫财'].includes(dzGod);
        const isDayBranchXing = hasXing;
        const YANG_REN_MAP = { '甲': '卯', '乙': '寅', '丙': '午', '丁': '巳', '戊': '午', '己': '巳', '庚': '酉', '辛': '申', '壬': '子', '癸': '亥' };
        const isYangRenStrong = p.some(pillar => pillar.zhi === YANG_REN_MAP[dm]);

        // Star Clashes
        let isStarClashed = false;
        if (interactions && interactions.branches) {
            isStarClashed = spouseStars.some(s => {
                if (s.pos === 'zhi') {
                    return interactions.branches.some(intr => intr.includes(s.val) && intr.includes('冲'));
                }
                return false;
            });
        }

        const ZhengStar = targetGods[0];
        const PianStar = targetGods[1];
        hasZheng = spouseStars.some(s => s.god === ZhengStar); // Re-evaluate after full spouseStars array is built
        hasPian = spouseStars.some(s => s.god === PianStar); // Re-evaluate after full spouseStars array is built

        const usePianAsZheng = !hasZheng && hasPian;

        // Luck Checking (Prime Marriage Age: 18-26)
        let hasMarriageLuckPrime = false;
        const dyList = data.daYunList || [];
        if (dyList.length > 0) {
            const primeCycles = dyList.filter(l => {
                const start = l.startAge;
                if (start === undefined) return false;
                const end = start + 10;
                return (start < 30 && end > 16); // Slightly broader for "Prime" luck
            });
            hasMarriageLuckPrime = primeCycles.some(l => {
                const lGod = getTenGod(l.gan) || (l.hidden && l.hidden.length > 0 && getTenGod(l.hidden[0].stem));
                return targetGods.includes(lGod);
            });
        }

        // --- Traditional Marriage Rules (Restored) ---
        // 2. Spouse Palace Analysis (Day Branch)
        const dzHidden = HIDDEN_STEMS_MAP[dz] || [];
        const dzMainGod = dzHidden[0] ? getTenGod(dm, dzHidden[0]) : '';

        // --- New Rule: Star-Palace Mutual Harm (Marriage Crisis) ---
        const chuanMap = { '子': '未', '未': '子', '丑': '午', '午': '丑', '寅': '巳', '巳': '寅', '卯': '辰', '辰': '卯', '申': '亥', '亥': '申', '酉': '戌', '戌': '酉' };
        let hasStarPalaceHarm = false;
        let harmingBranch = '';

        spouseStars.forEach(s => {
            if (s.pos === 'zhi' && s.i !== 2) { // Spouse Star in other branches
                if (chuanMap[dz] === s.branch) {
                    hasStarPalaceHarm = true;
                    harmingBranch = s.branch;
                }
            }
        });

        if (hasStarPalaceHarm) {
            // Rescue Check (Liu He)
            const lhMap2 = { '子': '丑', '丑': '子', '寅': '亥', '亥': '寅', '卯': '戌', '戌': '卯', '辰': '酉', '酉': '辰', '巳': '申', '申': '巳', '午': '未', '未': '午' };
            const allZhis = p.map(pi => pi.zhi);
            const dayCombined = allZhis.some((z, i) => i !== 2 && z === lhMap2[dz]);
            const harmPartner = lhMap2[harmingBranch];
            const isHarmRescued = allZhis.includes(harmPartner);

            if (!dayCombined && !isHarmRescued) {
                matchTerms.push({ type: 'issue', title: '星宫互穿 (婚姻危机)', desc: '婚姻宫与财/官星发生了穿害（' + dz + harmingBranch + '相穿），且原局无救应。说明家里容不下配偶，易导致离婚或配偶身体大问题。', rate: 90 });
            }
        }

        const dzMap = {
            '比肩': { title: '配偶性格强势', desc: '与自己能力相当，易有争执，竞争感强。' },
            '劫财': { title: '婚姻易由于第三者', desc: '配偶感情易变节，或自身易为配偶破财。' },
            '食神': { title: '配偶温顺善良', desc: '家境尚可，夫妻和睦，有口福。' },
            '伤官': { title: '配偶外向强势', desc: isMale ? '配偶能干但强势，易有矛盾。' : '婚姻多波折，配偶不服管。' },
            '正财': { title: isMale ? '得贤妻' : '配偶务实', desc: isMale ? '夫妻相辅相成。' : '配偶务实顾家，婚姻稳定。' },
            '偏财': { title: isMale ? '风流多情' : '配偶财运起伏', desc: isMale ? '不缺异性缘，婚姻易有外情。' : '配偶慷慨大方，但财运起伏大。' },
            '正官': { title: isMale ? '配偶端庄' : '得良夫', desc: isMale ? '配偶重视规矩，端庄得体。' : '配偶自律有原则，责任感强。' },
            '七杀': { title: isMale ? '配偶果断' : '配偶性刚', desc: isMale ? '配偶能干有事业心。' : '配偶性情刚强，婚姻易有摩擦。' },
            '正印': { title: '配偶仁慈善良', desc: '有包容心，能照顾自己，偏向长辈型伴侣。' },
            '偏印': { title: '配偶心思重', desc: '性格孤僻或想法怪异，沟通较少，三观易不合。' }
        };

        if (dzMap[dzMainGod]) {
            matchTerms.push({ type: 'character', ...dzMap[dzMainGod], rate: 85 });
        }

        // Spouse Appearance
        const appMap = {
            '正财': '妻子贤惠漂亮，擅长持家',
            '正官': '丈夫英俊且事业有成',
            '偏财': '妻子外貌出众，有魅力，社交能力强',
            '七杀': '丈夫有魄力，能力强，事业有成'
        };
        if (appMap[dzMainGod]) matchTerms.push({ type: 'appearance', title: '配偶外貌', desc: appMap[dzMainGod], rate: 80 });

        // Timing / Marriage Fate (Early/Late/None)
        let earlyTerms = [], lateTerms = [], noneTerms = [];

        // Early Marriage Rules
        if (spouseStars.some(s => s.i <= 1 && s.pos === 'gan')) earlyTerms.push('配偶星在年月透干');
        const lh = { '子': '丑', '丑': '子', '寅': '亥', '亥': '寅', '卯': '戌', '戌': '卯', '辰': '酉', '酉': '辰', '巳': '申', '申': '巳', '午': '未', '未': '午' };
        const isDayCombined = [p[0].zhi, p[1].zhi, p[3].zhi].some(z => lh[dz] === z);
        if (isDayCombined) earlyTerms.push('夫妻宫被合');
        if (spouseStars.some(s => s.score > 25 && s.pos === 'gan')) earlyTerms.push('配偶星旺而透干');

        // Late Marriage Rules
        const allHidden = spouseStars.length > 0 && spouseStars.every(s => s.pos === 'zhi');
        if (allHidden) lateTerms.push(isMale ? '财星藏而不透' : '官杀星藏而不透');

        if (spouseStars.length > 0 && spouseStars.every(s => s.i >= 2)) lateTerms.push('配偶星在日时');

        const tombBranches = { '木': '未', '火': '戌', '金': '丑', '水': '辰', '土': '辰' };
        const isInTomb = spouseStars.some(s => p.some(pillar => pillar.zhi === tombBranches[s.wx]));
        if (isInTomb) lateTerms.push('配偶星入墓');

        // Clashing Rules (Bi Jie clashing Wife / Food-Hurt clashing Husband)
        if (isMale) {
            const jieScore = allG.filter(g => g.god === '劫财').length * 15;
            const starScore = spouseStars.reduce((acc, s) => acc + s.score, 0);
            if (jieScore > starScore * 1.5 && jieScore > 20) {
                matchTerms.push({ type: 'issue', title: '比劫克妻太过', desc: '比劫旺而克妻，婚姻难成，必晚婚。', rate: 85 });
            }
        } else {
            const foodHurtScore = foods.length * 15;
            const starScore = spouseStars.reduce((acc, s) => acc + s.score, 0);
            if (foodHurtScore > starScore * 1.5 && foodHurtScore > 20) {
                matchTerms.push({ type: 'issue', title: '食伤制杀太过', desc: '食伤过旺克制夫星，在此情况下缘分极难落地，必晚婚。', rate: 85 });
            }
        }
        if (isStrongDM && spouseStars.length === 0) noneTerms.push('身旺无妻/夫星');
        if (spouseStars.length > 0 && spouseStars.every(s => s.score < 10)) lateTerms.push('配偶星衰弱');

        if (!isMale) {
            const allHidden = spouseStars.every(s => s.pos === 'zhi');
            if (allHidden) lateTerms.push('夫星藏而不透');
        } else {
            const allHidden = spouseStars.every(s => s.pos === 'zhi');
            if (allHidden) lateTerms.push('财星藏而不透');
        }

        if (noneTerms.length > 0) {
            timingSummary = '晚婚/难婚倾向';
            matchTerms.push({ type: 'timing', title: noneTerms.join('、'), desc: '异性缘分淡薄，需后天主动经营，否则易晚婚或难婚。', rate: 90 });
        } else if (lateTerms.length > 0) {
            timingSummary = '晚婚倾向';
            matchTerms.push({ type: 'timing', title: lateTerms.join('、'), desc: '缘分来得较晚，属于自然晚婚类型，早婚易变。', rate: 85 });
        } else if (earlyTerms.length > 0) {
            timingSummary = '早婚倾向';
            matchTerms.push({ type: 'timing', title: earlyTerms.join('、'), desc: '缘分来得较早，有机会早婚（22-26岁前）。', rate: 85 });
        }

        if (GAN_WX[dm] === ZHI_WX[dz]) matchTerms.push({ type: 'issue', title: '上下同五行', desc: '日柱干支五行相同，夫妻互不相让，极易导致离婚。', rate: 90 });

        // [Expert-Driven Sync] Marriage Refinement
        if (expertData && expertData.results) {
            const killing = expertData.results.find(r => r.god === '七杀');
            const seal = expertData.results.find(r => r.god === '正印' || r.god === '偏印');

            // 七杀旺而无制 = 感情压力大，易有争执或暴力倾向
            if (killing && killing.starQuality === '无制') {
                matchTerms.push({
                    type: 'issue',
                    title: '杀重无制 (感情高压)',
                    desc: '局中七杀旺而无制，在感情里容易感到压抑，或者遇到性格暴躁的对象，婚姻稳定性极差。',
                    rate: 90
                });
            }
            // 正印用神受制 = 婚姻缺乏稳定性支持
            if (seal && seal.isYongShen && seal.starQuality === '受损') {
                matchTerms.push({
                    type: 'issue',
                    title: '印星受损 (家宅不宁)',
                    desc: '护身的印星受损，意味着婚姻缺乏长辈认可或家庭基础薄弱，容易因为外在干扰导致感情动摇。',
                    rate: 90
                });
            }
        }

        // Extraction for Decision Tree Context
        // Interaction Maps for Affair Logic
        const LIU_HE = { '子': '丑', '丑': '子', '寅': '亥', '亥': '寅', '卯': '戌', '戌': '卯', '辰': '酉', '酉': '辰', '巳': '申', '申': '巳', '午': '未', '未': '午' };
        // An He (Secret Combines) - simplified for core interactions
        const AN_HE = {
            '寅': ['丑', '未'], // Yin-Chou (An), Yin-Wei (An) ? Standard An He: Yin-Chou, Wu-Hai, Mao-Shen
            '午': ['亥'],
            '卯': ['申'],
            '子': ['巳'], // Zi-Si An He
            '巳': ['子', '酉'],
            '申': ['卯'],
            '亥': ['午'],
            '丑': ['寅'],
            '未': ['寅'] // Loose mapping, sticking to standard: Yin-Chou, Wu-Hai, Mao-Shen.
        };
        // Correct Standard An He (Earthly Branch Secret Combines):
        // Zi-Si, Hai-Wu, Mao-Shen, Yin-Chou, Wu-Wei (Not An He),  - Common ones: Yin-Chou, Wu-Hai, Mao-Shen.
        // Let's use a standard list: 
        // Yin-Chou, Wu-Hai, Mao-Shen. (Zi-Si is sometimes considered).
        // User's image: "Spouse Star -> An He". implies the Star itself forms An He with something in the chart?
        // Or "Spouse Palace" An He?
        // Logic from image says "Spouse Star -> An He". Context: "Affair".
        // Likely means the Spouse Star in the chart is Secretly Combining with another branch (often Day Branch or others).
        // Let's implement check: Is any Spouse Star interacting via An He with Day Branch?
        // Or Day Branch interacting via An He with other branches?
        // "Affair" usually relates to Day Branch (Spouse Palace) or Spouse Star.
        // Image path 1: Earthly Branch -> Liu He. (Likely Day Branch Liu He with others -> Affair).
        // Image path 2: Spouse Star -> An He. (Spouse Star An He with others -> Affair).

        // 1. Liu He Check (Day Branch with any other Branch)
        let hasLiuHe = false;
        p.forEach((pillar, idx) => {
            if (idx !== 2) { // Not day pillar itself
                if (LIU_HE[dz] === pillar.zhi) hasLiuHe = true;
            }
        });

        // 2. An He Check (Spouse Star with Day Branch? Or Spouse Star with ANY branch?)
        // If Spouse Star is An He with Day Branch -> "Secret lover in marriage"?
        // If Spouse Star is An He with other branches -> "Spouse has secret lover"?
        // User text: "Besides heaven and earth knowing...". Implies secret relationship.
        // Let's check: Spouse Star An He with Day Branch OR Day Branch An He with any other branch.
        // Simplified Logic: Day Branch An He with others = Self affair risk? Spouse Star An He with others = Spouse affair risk?
        // Image branches from "Affair" (Outcome).
        // Path A: Earthly Branch (Day?) -> Liu He -> "Physical..."
        // Path B: Spouse Star -> An He -> "Secret..."

        // Let's calculate: 
        // isLiuHe: Day Branch matches Liu He in Year/Month/Hour.
        // isAnHe: Spouse Star (if exists) An He with Day Branch? Or Spouse Star matches An He with Map?
        // Let's strictly check: Spouse Star's Branch (if it sits on one) An He with Day Branch.

        let hasAnHe = false;
        // Standard An He Map (Zi-Si, Hai-Wu, Mao-Shen, Yin-Chou)
        const AN_HE_MAP = {
            '子': ['巳'], '巳': ['子'],
            '亥': ['午'], '午': ['亥'],
            '卯': ['申'], '申': ['卯'],
            '寅': ['丑'], '丑': ['寅']
        };

        if (spouseStars.length > 0) {
            spouseStars.forEach(star => {
                if (star.pos === 'zhi') {
                    // If star is a branch, check if it An He with Day Branch (if star is not Day Branch)
                    // Or if star An He with OTHER branches?
                    // "Spouse Star -> An He" usually means Spouse Star An He with Day Master's Body (Earthly Branch).
                    // Let's check interaction between Star Branch and Day Branch.
                    if (AN_HE_MAP[star.val]?.includes(dz)) hasAnHe = true;
                }
            });
        }
        // Also check Day Branch An He with others (common affair sign)
        let isDayAnHe = false;
        p.forEach((pillar, idx) => {
            if (idx !== 2) {
                if (AN_HE_MAP[dz]?.includes(pillar.zhi)) isDayAnHe = true; // Day Branch An He with others
            }
        });
        // User image path: "Spouse Star -> An He". So we use `hasAnHe` (Star An He Day).
        // Wait, if Star is elsewhere, An He with Day is "Secret connection to spouse".
        // If Star is An He with Other? "Spouse cheating".
        // Let's set the flag broadly for now: Star An He with Day OR Day An He with Others.
        if (isDayAnHe) hasAnHe = true;


        // 3.0 San He Check (Three Harmony) - For Affair "Assimilation"
        // Check if chart contains any full San He combination
        const SAN_HE_GROUPS = [
            ['申', '子', '辰'], ['巳', '酉', '丑'], ['寅', '午', '戌'], ['亥', '卯', '未']
        ];
        // Collect all branches in chart
        const chartZhis = p.map(pi => pi.zhi);
        const hasSanHe = SAN_HE_GROUPS.some(group => {
            // Check if all 3 branches in the group exist in the chart
            return group.every(b => chartZhis.includes(b));
        });

        // 3.5 Xian Chi Peach Blossom Check (For Affair "Shen Sha")
        // Rule: Year/Day Branch -> Target Peach Branch
        // Shen/Zi/Chen -> You; Hai/Mao/Wei -> Zi; Yin/Wu/Xu -> Mao; Si/You/Chou -> Wu.
        const PEACH_MAP = {
            '申': '酉', '子': '酉', '辰': '酉',
            '亥': '子', '卯': '子', '未': '子',
            '寅': '卯', '午': '卯', '戌': '卯',
            '巳': '午', '酉': '午', '丑': '午'
        };
        // Check Year Branch and Day Branch for Peach Targets
        const yz = p[0].zhi;
        const dzBranch = p[2].zhi;
        const targetPeachY = PEACH_MAP[yz];
        const targetPeachD = PEACH_MAP[dzBranch];

        let hasPeachSha = false;
        let hasPeachShaMonth = false;
        let hasPeachShaHour = false;
        let hasPeachShaMonthRevealed = false;
        let hasPeachShaHourRevealed = false;

        p.forEach((pi, idx) => {
            // Check if this branch is a Peach Blossom (based on Year or Day)
            if (pi.zhi === targetPeachY || pi.zhi === targetPeachD) {
                hasPeachSha = true;

                // Track location of the branch itself for metadata (optional, kept for legacy)
                if (idx === 1) hasPeachShaMonth = true;
                if (idx === 3) hasPeachShaHour = true;

                // [UPDATED LOGIC]: Cross-Pillar Revelation
                // "As long as ANY branch is Peach, check if Month/Hour Stem reveals properly."
                // Get Main Qi of this Peach Branch
                const mainQi = HIDDEN_STEMS_MAP[pi.zhi]?.[0];

                // Check if Revealed in Month Stem
                if (p[1] && p[1].gan === mainQi) {
                    hasPeachShaMonthRevealed = true;
                }
                // Check if Revealed in Hour Stem
                if (p[3] && p[3].gan === mainQi) {
                    hasPeachShaHourRevealed = true;
                }
            }
        });

        if (isDayAnHe) hasAnHe = true;

        // 3.6 Stem Combine Check (He Hua/Bu Hua) - For Affair "Pulling Away"
        // Check if ANY Exposed Spouse Star's Stem combines with another Stem in the chart
        const GAN_HE = {
            '甲': '己', '己': '甲', '乙': '庚', '庚': '乙',
            '丙': '辛', '辛': '丙', '丁': '壬', '壬': '丁',
            '戊': '癸', '癸': '戊'
        };
        const allStems = p.map(pi => pi.gan);
        let isSpouseStemCombinedWithOther = false;
        let isSpouseStemCombinedWithDM = false;

        spouseStars.forEach(s => {
            if (s.pos === 'gan') {
                const starStem = allStems[s.i];
                const targetHe = GAN_HE[starStem];
                const combinedIndices = allStems.reduce((acc, stem, idx) => {
                    if (stem === targetHe && idx !== s.i) acc.push(idx);
                    return acc;
                }, []);

                if (combinedIndices.includes(2)) {
                    isSpouseStemCombinedWithDM = true;
                }
                if (combinedIndices.some(idx => idx !== 2)) {
                    isSpouseStemCombinedWithOther = true;
                }
            }
        });

        const isCompetingHe = isSpouseStemCombinedWithDM && isSpouseStemCombinedWithOther;
        const isSpouseStemCombined = isSpouseStemCombinedWithOther; // Keep for backward compatibility if needed

        // 3.7 Bi Jie Seizing Wealth Check (Refined)
        let isAnyWealthRobbed = false;
        if (isMale) {
            const tWealths = spouseStars.filter(s => s.pos === 'gan');
            isAnyWealthRobbed = tWealths.some(w => {
                // Protection check: DM combining with wealth star protects it unless competed for
                const isCombinedWithDM = (p[2].gan === GAN_HE[p[w.i].gan]);
                const isCombinedWithOther = p.some((pillar, idx) => idx !== w.i && idx !== 2 && pillar.gan === GAN_HE[p[w.i].gan]);
                if (isCombinedWithDM && !isCombinedWithOther) return false;

                // Proximity check: Adjacent stems
                const hasAdjacentRobber = p.some((pillar, idx) => idx !== w.i && ['比肩', '劫财'].includes(TEN_GODS[dm + pillar.gan]?.[0]) && Math.abs(idx - w.i) === 1);
                // Proximity check: Same pillar branch
                const hiddenG = HIDDEN_STEMS_MAP[p[w.i].zhi] || [];
                const hasSamePillarRobber = hiddenG.some(h => ['比肩', '劫财'].includes(TEN_GODS[dm + h]?.[0]));

                return hasAdjacentRobber || hasSamePillarRobber;
            });
        }

        // 3.5 Xian Chi Peach Blossom Check (For Affair "Shen Sha")
        // Rule: Year/Day Branch -> Target Peach Branch
        // Shen/Zi/Chen -> You; Hai/Mao/Wei -> Zi; Yin/Wu/Xu -> Mao; Si/You/Chou -> Wu.
        // 3.5 Xian Chi Peach Blossom Check (For Affair "Shen Sha")
        // (Logic already executed above at 3.5)

        // --- NEW FLAGS FOR COMPLEX LOGIC (Happy/Divorce) ---
        // 1. Day Branch = Spouse Star?
        // Note: dzGod is Ten God of Day Branch. targetGods contains Spouse Star Gods.
        const isDayBranchSpouseStar = targetGods.includes(dzGod);

        // 2. Useful Gods Check
        // Need to know if Wealth, Officer, Seal are Useful.
        // Simplified: if isStrongDM, Wealth/Officer/ShangGuan are Useful. If WeakDM, Seal/BiJie are Useful.
        // We need explicit flags.
        const usefulGods = isStrongDM ? ['正财', '偏财', '正官', '七杀', '食神', '伤官'] : ['正印', '偏印', '比肩', '劫财'];
        const isWealthUseful = usefulGods.includes('正财') || usefulGods.includes('偏财');
        const isOfficerUseful = usefulGods.includes('正官') || usefulGods.includes('七杀');
        const isSealUseful = usefulGods.includes('正印') || usefulGods.includes('偏印');

        // 3. Shang Guan Pei Yin Check (Shang Guan in Branch/Stem, Seal in Stem/Branch)
        const hasShangGuan = p.some(pillar => getTenGod(pillar.gan) === '伤官' || getTenGod(HIDDEN_STEMS_MAP[pillar.zhi]?.[0]) === '伤官');
        const hasSeal = p.some(pillar => ['正印', '偏印'].includes(getTenGod(pillar.gan)) || ['正印', '偏印'].includes(getTenGod(HIDDEN_STEMS_MAP[pillar.zhi]?.[0])));
        const hasShangGuanPeiYin = hasShangGuan && hasSeal; // Logical simplification

        // 4. Mixed Exposed Check
        // 4. Mixed Exposed Check
        // Male: Zheng & Pian Exposed? Female: Guan & Sha Exposed?
        const exposedGods = p.map(pillar => getTenGod(pillar.gan));
        const hasMixedExposed = (hasZheng && hasPian && exposedGods.includes(ZhengStar) && exposedGods.includes(PianStar));

        // 5. Day Branch Bi Jie (Already calculated)
        // 6. Day Branch Xing (Already calculated)
        // 7. Yang Ren (Already calculated)


        // 8. Pure Zheng Focus (For Happy Marriage "CFO" Logic)
        const zhengCount = spouseStars.filter(s => s.god === ZhengStar).length;
        const pianCount = spouseStars.filter(s => s.god === PianStar).length;
        const isPureZheng = hasZheng && !hasPian && zhengCount === 1;

        const treeContext = {
            isMale,
            hasSpouseStar: spouseStars.length > 0,
            hasZheng: hasZheng,
            hasPian: hasPian,
            isYearMonthStar: spouseStars.some(s => s.i <= 1),
            isDayHourStar: spouseStars.some(s => s.i >= 2),

            // New Flags for Complex Logic
            usePianAsZheng, // Yi Pian Dai Zheng
            isDayBranchSpouseStar,
            isDayBranchUseful: isUsefulPalace, // Renamed for Tree match
            isWealthUseful,
            isOfficerUseful,
            isSealUseful,
            hasShangGuanPeiYin,
            isPureZheng, // Added for CFO check

            // Late/Early Checks
            isYearExposed: spouseStars.some(s => s.i === 0 && s.pos === 'gan'),
            isMonthExposed: spouseStars.some(s => s.i === 1 && s.pos === 'gan'),
            isStemExposed: spouseStars.some(s => s.pos === 'gan'),
            isStarInTomb,
            hasMarriageLuckPrime,

            // Relation Checks
            isPalaceClashed: hasChong, // Re-mapped for tree
            isPalacePunished: hasXing, // Re-mapped for tree
            hasMixedExposed,
            isDayBranchBiJie,
            isDayBranchXing,
            isYangRenStrong,
            isDayBranchSevenKilling: ['七杀'].includes(dzGod), // Added for Divorce 4

            // Affair Checks
            hasLiuHe, // Earthly Branch Liu He
            hasAnHe,   // Spouse Star An He
            hasSanHe: hasSanHe, // Need to ensure hasSanHe is calculated above or here
            isSpouseStemCombined: isSpouseStemCombined, // backward compatibility (外合)
            isSpouseStemCombinedWithOther,
            isSpouseStemCombinedWithDM,
            isCompetingHe,
            isAnyWealthRobbed,
            hasPeachSha: hasPeachSha, // Need to ensure hasPeachSha is calculated above or here
            hasPeachShaMonth,
            hasPeachShaHour,
            hasPeachShaMonthRevealed, // [NEW]
            hasPeachShaHourRevealed,  // [NEW]

            // Additional Context
            dm: dm,
            isWeakDM: !isStrongDM,

            // --- Advanced Spouse Quality Flags (For Personality Tree) ---
            isZhengCaiUseful: usefulGods.includes('正财'),
            isPianCaiUseful: usefulGods.includes('偏财'),
            isZhengGuanUseful: usefulGods.includes('正官'),
            isQiShaUseful: usefulGods.includes('七杀'),

            hasZhengCaiRoot: spouseStars.some(s => s.god === '正财' && s.pos === 'zhi'),
            hasPianCaiRoot: spouseStars.some(s => s.god === '偏财' && s.pos === 'zhi'),
            hasZhengGuanRoot: spouseStars.some(s => s.god === '正官' && s.pos === 'zhi'),
            hasQiShaRoot: spouseStars.some(s => s.god === '七杀' && s.pos === 'zhi'),

            hasZhengCaiExposed: spouseStars.some(s => s.god === '正财' && s.pos === 'gan'),
            hasPianCaiExposed: spouseStars.some(s => s.god === '偏财' && s.pos === 'gan'),
            hasZhengGuanExposed: spouseStars.some(s => s.god === '正官' && s.pos === 'gan'),
            hasQiShaExposed: spouseStars.some(s => s.god === '七杀' && s.pos === 'gan'),

            isDayBranchZhengCai: dzGod === '正财',
            isDayBranchPianCai: dzGod === '偏财',
            isDayBranchZhengGuan: dzGod === '正官',
            isDayBranchQiSha: dzGod === '七杀',

            // Original flags...
            isStrongDM,
            dayBranchGod: dzGod,
            isPeachDay: ['子', '午', '卯', '酉'].includes(dz),
            isPalaceClashed: hasChong,
            isPalacePunished: hasXing,
            isUsefulPalace,
            isStarClashed,
            isMultipleStars: spouseStars.length > 1,
            isMixedStars: hasZheng && hasPian,
            isPureZheng: hasZheng && !hasPian,
            isPurePian: !hasZheng && hasPian,
            spouseStarCount: spouseStars.length,
            hasLiuHe,
            hasAnHe,
            usePianAsZheng,
            isDayBranchSpouseStar,
            isWealthUseful,
            isOfficerUseful,
            isSealUseful,
            hasShangGuanPeiYin,
            hasMixedExposed,
            isDayBranchBiJie,
            isDayBranchXing,
            isYangRenStrong
        };

        // --- Process Expert Data Matches ---
        const good = [];
        const issues = [];
        const timing = [];
        const spouseCharacter = [];
        const appearance = [];
        const premarital = [];
        let futureYears = [];

        if (expertData && expertData.results) {
            const formatTitle = (res) => {
                let t = res.title;
                if (res._specificTrace && res._specificTrace.length > 0) {
                    const traceStr = res._specificTrace.map(n => n.node).join('→');
                    t += ` <span style='font-size:0.85em; opacity:0.7; font-weight:normal; margin-left:6px;'>(${traceStr})</span>`;
                }
                return t;
            };

            expertData.results.forEach(res => {
                const id = res.id || '';
                if (id.startsWith('res_Rel_') || id.startsWith('res_Time_') || id.startsWith('res_Trait_') || id.startsWith('res_App_')) {
                    const item = { ...res, title: formatTitle(res) };

                    if (id.startsWith('res_Rel_Happy')) good.push(item);
                    else if (id.startsWith('res_Rel_Divorce') || id.startsWith('res_Rel_Affair')) issues.push(item);
                    else if (id.startsWith('res_Time_')) {
                        timing.push(item);
                        if (res.futureYears) futureYears = res.futureYears;
                        if (res.timingSummary) {
                            if (timingSummary.includes('暂无')) timingSummary = res.timingSummary;
                            else timingSummary += ' | (逻辑树: ' + res.timingSummary + ')';
                        }
                    }
                    else if (id.startsWith('res_Trait_')) spouseCharacter.push(item);
                    else if (id.startsWith('res_App_')) appearance.push(item);
                }
            });
        }

        // --- Merge Traditional Terms ---
        matchTerms.forEach(t => {
            if (t.type === 'character') spouseCharacter.push(t);
            else if (t.type === 'appearance') appearance.push(t);
            else if (t.type === 'timing') timing.push(t);
            else if (t.type === 'good') good.push(t);
            else if (t.type === 'issue') issues.push(t);
        });

        // --- Active Future Years Scan ---
        if (data.solarDate) {
            const birthYear = parseInt(data.solarDate.split('-')[0]);
            const startY = birthYear + 18;
            const endY = Math.min(birthYear + 65, 2045); // Standard scan range

            for (let y = startY; y <= endY; y++) {
                if (futureYears.length >= 12) break;

                // Use Solar/Lunar if available (Browser context)
                if (typeof Solar !== 'undefined') {
                    const l = Solar.fromYmd(y, 6, 15).getLunar();
                    const yGZ = l.getYearInGanZhi();
                    const yGan = yGZ[0], yZhi = yGZ[1];

                    const yGanGod = getTenGod(yGan);
                    const yZhiHidden = HIDDEN_STEMS_MAP[yZhi] || [];
                    const yZhiGod = yZhiHidden[0] ? getTenGod(yZhiHidden[0]) : '';

                    const hasStar = targetGods.includes(yGanGod);
                    const hasStarInZhi = targetGods.includes(yZhiGod);

                    const lhMap = { '子': '丑', '丑': '子', '寅': '亥', '亥': '寅', '卯': '戌', '戌': '卯', '辰': '酉', '酉': '辰', '巳': '申', '申': '巳', '午': '未', '未': '午' };
                    const chongMap = { '子': '午', '午': '子', '丑': '未', '未': '丑', '寅': '申', '申': '寅', '卯': '酉', '酉': '卯', '辰': '戌', '戌': '辰', '巳': '亥', '亥': '巳' };

                    const isHe = (lhMap[dz] === yZhi);
                    const isChong = (chongMap[dz] === yZhi);

                    let score = 0;
                    let reason = [];

                    if (hasStar) { score += 40; reason.push('配偶星透干'); }
                    if (isHe) { score += 40; reason.push('流年合夫妻宫'); }
                    if (isChong) { score += 30; reason.push('流年冲夫妻宫(动婚)'); }
                    if (hasStarInZhi) { score += 20; reason.push('配偶星地支显现'); }

                    if (score >= 40 || (hasStar && isHe)) {
                        let finalReason = reason.join(' + ');
                        if (hasStar && isHe) finalReason = '星宫同动(大吉)';
                        futureYears.push({ year: y, ganZhi: yGZ, reason: finalReason, score: score });
                    }
                }
            }
        }

        // --- ALL 198 San Ban Fu Logic (Fixed for Scope) ---
        const sbf = {
            wealth: [],
            health: [],
            marriage: [],
            character: [],
            family: [],
            other: []
        };

        const allZhis = p.map(pi => pi.zhi);
        const allGans = p.map(pi => pi.gan);
        const countZhi = (z) => allZhis.filter(x => x === z).length;
        const countGan = (g) => allGans.filter(x => x === g).length;
        const hasZhi = (z) => allZhis.includes(z);
        const hasGan = (g) => allGans.includes(g);
        const dayPillarSBF = dm + dz;

        // Recalculate Ten Gods for the WHOLE chart (4 pillars) for precise mantra matching
        const allGods = [];
        p.forEach(pillar => {
            if (pillar.xml && pillar.xml.tenGod) allGods.push(pillar.xml.tenGod);
            if (pillar.xml && pillar.xml.hiddenGods) allGods.push(...pillar.xml.hiddenGods);
        });
        const hasGodSBF = (g) => allGods.includes(g);
        const countGodSBF = (g) => allGods.filter(x => x === g).length;

        const bibeiCount = countGodSBF('比肩') + countGodSBF('劫财');
        const sbfOfficerCount = countGodSBF('正官') + countGodSBF('七杀');
        const sbfFoodCount = countGodSBF('食神') + countGodSBF('伤官');
        const sbfSealCount = countGodSBF('正印') + countGodSBF('偏印');

        // Utility: Check for hidden stems anywhere
        const hasHiddenSBF = (g) => {
            return p.some(pi => (HIDDEN_STEMS_MAP[pi.zhi] || []).includes(g));
        };

        // 1. Wealth & Career
        if ((dm === '甲' || dm === '癸') && hasGodSBF('偏财') && (hasGan('正财') || hasGan('偏财'))) {
            sbf.wealth.push({ title: '发大财', desc: '甲癸日主，正偏财混杂且偏财透干，易发大财。' });
        }
        if (hasZhi('寅') && hasZhi('巳') && hasZhi('申')) {
            sbf.wealth.push({ title: '寅巳申三刑', desc: '地支见寅巳申，主官司是非、口舌，防被人谋害。' });
        }
        if (hasGodSBF('偏财') && hasGodSBF('偏印') && (hasGan('偏财') || hasGan('偏印'))) {
            sbf.wealth.push({ title: '偏财偏印', desc: '偏财偏印发他乡，慷慨风流性最强。' });
        }

        // 2. Health & Accidents
        const exposedOfficerSBF = p.some(pi => pi.xml && ['正官', '七杀'].includes(pi.xml.tenGod));
        if (exposedOfficerSBF) {
            sbf.health.push({ title: '皮外伤/伤痕', desc: '官杀在天干，身上容易有刀疤、伤疤或痕迹。' });
        }
        const ziXingSBF = ['辰', '午', '酉', '亥'].filter(z => countZhi(z) >= 2);
        if (ziXingSBF.length > 0) {
            sbf.health.push({ title: '自刑煞', desc: '自刑者（辰午酉亥），身上有不好治愈暗疾、血光或官司。' });
        }
        const repeatedStemSBF = allGans.some(g => countGan(g) >= 2);
        if (repeatedStemSBF) {
            sbf.health.push({ title: '干见同字', desc: '天干重复出现相同的字，容易有慢性病。' });
        }
        if (['辰', '酉', '戌', '亥'].includes(dz)) {
            sbf.health.push({ title: '日坐病因', desc: '日坐辰酉戌亥，身体素质稍弱，易得慢性病。' });
        }
        if (!isMale && (countZhi('子') > 0 && countZhi('卯') > 0 && countZhi('酉') > 0)) {
            sbf.health.push({ title: '生产安全', desc: '女见子卯酉，必有小产堕胎风险，注意生育。' });
        }
        if (hasHiddenSBF('辛')) {
            sbf.health.push({ title: '痔疮预警', desc: '地支藏辛金者，易有痔疮之疾。' });
        }
        if (allGans.filter(g => g === '壬' || g === '癸').length >= 3) {
            sbf.health.push({ title: '耳部呵护', desc: '壬癸水多或水过旺，容易有耳朵方面的疾病。' });
        }
        if (hasGan('丁')) sbf.health.push({ title: '眼部保养', desc: '丁火代表眼睛，防神劳眼疾。' });
        if (countGan('丁') >= 3) sbf.health.push({ title: '火灾隐患', desc: '三丁四丁伤本身，防残疾或火烧房屋风险。' });

        // 3. Character
        // Find earth/water scores from profile array
        const getElementScore = (elem) => {
            const entry = profile.find(pr => pr.element === elem);
            return entry ? entry.score : 0;
        };
        const sbfEarthScore = getElementScore('土');
        if (sbfEarthScore > 40 || sbfSealCount >= 3) {
            sbf.character.push({ title: '诚实守信', desc: '土旺或印旺之人诚实守信，责任心强。' });
        } else if (sbfEarthScore > 0 && sbfEarthScore < 10) {
            sbf.character.push({ title: '言行一致', desc: '土气过少，防言行不一，注意信用积累。' });
        }
        if (countGodSBF('正官') >= 2 && countGodSBF('正印') >= 2) {
            sbf.character.push({ title: '责任至上', desc: '正官正印多旺者，责任心极强，办事牢靠。' });
        }
        const sbfWaterScore = getElementScore('水');
        if (sbfWaterScore > 40) {
            sbf.character.push({ title: '聪明睿智', desc: '水多足智多谋，应变能力极佳。' });
        }
        if (hasGan('偏财')) {
            sbf.character.push({ title: '慷慨大方', desc: '干上有偏财，性格大方不吝啬。' });
        }
        if (bibeiCount > 0 && hasGan('偏财')) {
            sbf.character.push({ title: '享乐倾向', desc: '干上见比劫或偏财，有时会有懒散、爱享受的情绪。' });
        }

        // 4. Marriage
        if (hasZhi('卯') && hasZhi('酉')) {
            sbf.marriage.push({ title: '卯酉相冲', desc: '无论男女见卯酉：同居早或未婚先孕。' });
        }
        // totalHeCount is defined earlier in calculateMarriageStatus scope? 
        // Let's re-calculate it to be safe.
        const sbfHeCount = (data.interactions && data.interactions.branches ? data.interactions.branches.filter(x => x.includes('合')).length : 0) +
            (data.interactions && data.interactions.stems ? data.interactions.stems.filter(x => x.includes('合')).length : 0);
        if (sbfHeCount >= 3) {
            sbf.marriage.push({ title: '合多情乱', desc: '八字合多，交际广，感情世界丰富多变。' });
        }
        if (isMale && (countGodSBF('正财') + countGodSBF('偏财')) >= 3) {
            sbf.marriage.push({ title: '男命财多', desc: '男人财多交际家，异性缘极旺。' });
        }
        if (!isMale && sbfHeCount >= 3) {
            sbf.marriage.push({ title: '女命合多', desc: '女人合多交际花，魅力大，易受诱惑。' });
        }
        if (!isMale && (sbfOfficerCount + sbfFoodCount + sbfSealCount) >= 6) {
            sbf.marriage.push({ title: '婚情感扰', desc: '女命官杀食伤枭混杂，婚姻易感多波折。' });
        }
        if (!isMale && hasGodSBF('伤官')) {
            sbf.marriage.push({ title: '女命伤官', desc: '女命伤官定克夫：性格硬，眼里容不得沙子。' });
        }
        if (sbfSealCount >= 3) {
            sbf.marriage.push({ title: '印旺忧家', desc: '印旺克子害婚姻：操心多，精神压力大，不利子女。' });
        }
        if (countZhi('亥') >= 3) {
            sbf.marriage.push({ title: '三亥克偶', desc: isMale ? '男有三亥：克妻。' : '女有三亥：克夫。' });
        }
        if (countZhi('丑') >= 3) {
            sbf.marriage.push({ title: '婚姻自定', desc: '三丑婚姻：婚姻自己谈，不需要媒妁之言。' });
        }
        const sbfKuiGangDays = ['庚辰', '庚戌', '乙卯', '乙未', '戊戌', '壬辰'];
        if (sbfKuiGangDays.includes(dayPillarSBF)) {
            sbf.marriage.push({ title: '魁罡/特殊日', desc: '男主三妻，女主三夫：感情关系复杂，易经历变动。' });
        }
        if (!isMale && countZhi('未') >= 2) {
            sbf.marriage.push({ title: '双羊利刃', desc: '女命双羊：克夫克子，对家中长辈不利。' });
        }

        // 5. Family
        if ((hasGan('壬') && hasGan('丙')) || (hasHiddenSBF('丙') && hasGan('壬'))) {
            sbf.family.push({ title: '手足伤损', desc: '天干见壬丙，兄弟姐妹恐有损伤或失。' });
        }
        if (countGan('甲') >= 2) sbf.family.push({ title: '亏欠父母', desc: '一甲二甲亏父母。' });
        if (countGan('甲') >= 3) sbf.family.push({ title: '克妻伤偶', desc: '三甲四甲克妻子。' });
        if (countGan('庚') >= 3) sbf.family.push({ title: '三庚克妻', desc: '三庚四庚妻无禄。' });
        if (countZhi('午') >= 3) sbf.family.push({ title: '难留家房', desc: '三马哭少房，老婆不死（指婚姻动荡）。' });
        if (bibeiCount >= 3 && (data.interactions && data.interactions.branches && data.interactions.branches.some(x => x.includes('冲')))) {
            sbf.family.push({ title: '祖坟迁动', desc: '年月比劫多且见冲，主祖坟迁动或动土。' });
        }

        // 6. Fortune/General
        const sbfTombZhis = ['辰', '戌', '丑', '未'];
        const sbfInteractions = data.interactions && data.interactions.branches ? data.interactions.branches : [];
        const isSbfTombClashed = sbfInteractions.some(c => c.includes('冲') && sbfTombZhis.some(t => c.includes(t)));
        if (isSbfTombClashed) {
            sbf.other.push({ title: '墓库逢冲', desc: '墓库逢冲，十有九凶，防突发重大变动。' });
        }
        if (bibeiCount >= 4) sbf.other.push({ title: '比劫克友', desc: '比劫重重之人克偶，也容易因财失友。' });

        return {
            treeContext,
            spouseStarDetails: spouseStars.length > 0 ? spouseStars[0] : null,
            good,
            issues,
            timing,
            spouseCharacter,
            appearance,
            premarital,
            sanbanfu: sbf, // Grouped by category
            timingSummary,
            futureYears
        };
    } catch (e) {
        console.error("Marriage Calc Error:", e);
        return { treeContext: {}, spouseStarDetails: null };
    }
}

function getInteractions(pillars) {
    const stems = pillars.map(p => p.gan);
    const branches = pillars.map(p => p.zhi);
    const res = { stems: [], branches: [], judgments: [] };
    const ganHeMap = { '甲': '己', '己': '甲', '乙': '庚', '庚': '乙', '丙': '辛', '辛': '丙', '丁': '壬', '壬': '丁', '戊': '癸', '癸': '戊' };
    const ganHeResult = { '甲己': '合土', '乙庚': '合金', '丙辛': '合水', '丁壬': '合木', '戊癸': '合火' };
    const ganChongPairs = [['甲', '庚'], ['乙', '辛'], ['丙', '壬'], ['丁', '癸']];

    for (let i = 0; i < stems.length; i++) {
        for (let j = i + 1; j < stems.length; j++) {
            const s1 = stems[i], s2 = stems[j];
            const p1 = GAN.indexOf(s1) < GAN.indexOf(s2) ? s1 : s2;
            const p2 = s1 === p1 ? s2 : s1;
            const pairKey = p1 + p2;
            if (ganHeMap[p1] === p2) {
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
            if (bw === '寅巳') res.branches.push('寅巳相刑');
            if (bw === '巳申') res.branches.push('巳申相刑');
            if (bw === '寅申') res.branches.push('寅申相刑');
            if (bw === '丑戌') res.branches.push('丑戌相刑');
            if (bw === '未戌') res.branches.push('戌未相刑');
            if (bw === '丑未') res.branches.push('丑未相刑');
            if (bw === '子巳') res.branches.push('子巳暗合');
            if (bw === '丑寅') res.branches.push('寅丑暗合');
            if (bw === '亥午') res.branches.push('午亥暗合');
            if (bw === '卯申') res.branches.push('卯申暗合');
        }
    }

    const bSet = new Set(branches);
    const sanHe = [{ grp: ['申', '子', '辰'], desc: '申子辰三合水局' }, { grp: ['亥', '卯', '未'], desc: '亥卯未三合木局' }, { grp: ['寅', '午', '戌'], desc: '寅午戌三合火局' }, { grp: ['巳', '酉', '丑'], desc: '巳酉丑三合金局' }];
    sanHe.forEach(sh => { if (sh.grp.every(x => bSet.has(x))) res.branches.push(sh.desc); });
    const sanHui = [{ grp: ['寅', '卯', '辰'], desc: '寅卯辰三会木方' }, { grp: ['巳', '午', '未'], desc: '巳午未三会火方' }, { grp: ['申', '酉', '戌'], desc: '申酉戌三会金方' }, { grp: ['亥', '子', '丑'], desc: '亥子丑三会水方' }];
    sanHui.forEach(sh => { if (sh.grp.every(x => bSet.has(x))) res.branches.push(sh.desc); });

    const banHeMap = { '申子': '申子半合(水局)', '子申': '申子半合(水局)', '子辰': '子辰半合(水局)', '辰子': '子辰半合(水局)', '亥卯': '亥卯半合(木局)', '卯亥': '亥卯半合(木局)', '卯未': '卯未半合(木局)', '未卯': '卯未半合(木局)', '寅午': '寅午半合(火局)', '午寅': '寅午半合(火局)', '午戌': '午戌半合(火局)', '戌午': '午戌半合(火局)', '巳酉': '巳酉半合(金局)', '酉巳': '巳酉半合(金局)', '酉丑': '酉丑半合(金局)', '丑酉': '酉丑半合(金局)' };
    for (let i = 0; i < branches.length; i++) {
        for (let j = i + 1; j < branches.length; j++) {
            const pair = [branches[i], branches[j]].sort((x, y) => ZHI.indexOf(x) - ZHI.indexOf(y)).join('');
            if (banHeMap[pair]) res.branches.push(banHeMap[pair]);
        }
    }

    if (bSet.has('寅') && bSet.has('巳') && bSet.has('申')) res.branches.push('寅巳申三刑');
    if (bSet.has('丑') && bSet.has('戌') && bSet.has('未')) res.branches.push('丑未戌三刑');

    const checkDoubleChong = (idx1, idx2) => {
        if (idx1 >= pillars.length || idx2 >= pillars.length) return false;
        const p1 = pillars[idx1], p2 = pillars[idx2];
        const s1 = p1.gan, s2 = p2.gan, b1 = p1.zhi, b2 = p2.zhi;
        let isStemChong = ganChongPairs.some(cp => (cp[0] === s1 && cp[1] === s2) || (cp[0] === s2 && cp[1] === s1));
        let isBranchChong = liuChongPairs.some(cp => (cp[0] === b1 && cp[1] === b2) || (cp[0] === b2 && cp[1] === b1));
        return isStemChong && isBranchChong;
    };

    if (pillars.length >= 4) {
        if (checkDoubleChong(2, 1)) res.judgments.push("日、月干支双冲，事业艰难。");
        if (checkDoubleChong(0, 2)) res.judgments.push("年、日干支双冲，主本不和，纵富贵也不久。");
        if (checkDoubleChong(0, 3)) res.judgments.push("年、时干支双冲，乃别立根基之人。");
        if (checkDoubleChong(1, 3)) res.judgments.push("月、时干支双冲，恐有多次起倒之遇。");
    }

    const existingGroups = new Set();
    res.branches.forEach(b => { if (b.includes('三合') || b.includes('三会')) { if (b.includes('水')) existingGroups.add('水'); if (b.includes('木')) existingGroups.add('木'); if (b.includes('火')) existingGroups.add('火'); if (b.includes('金')) existingGroups.add('金'); } });
    if (existingGroups.size > 0) { res.branches = res.branches.filter(b => { if (b.includes('半合')) { if (b.includes('水局') && existingGroups.has('水')) return false; if (b.includes('木局') && existingGroups.has('木')) return false; if (b.includes('火局') && existingGroups.has('火')) return false; if (b.includes('金局') && existingGroups.has('金')) return false; } return true; }); }

    res.stems = [...new Set(res.stems)]; res.branches = [...new Set(res.branches)]; res.judgments = [...new Set(res.judgments)];
    return res;
}

function getDynamicInteractions(pillars, targetIndices) {
    const res = { stems: [], branches: [] };
    if (!pillars || !targetIndices) return res;

    const ganHeMap = { '甲': '己', '己': '甲', '乙': '庚', '庚': '乙', '丙': '辛', '辛': '丙', '丁': '壬', '壬': '丁', '戊': '癸', '癸': '戊' };
    const ganHeResult = { '甲己': '合土', '乙庚': '合金', '丙辛': '合水', '丁壬': '合木', '戊癸': '合火' };
    const ganChongPairs = [['甲', '庚'], ['乙', '辛'], ['丙', '壬'], ['丁', '癸']];

    const liuChongPairs = [['子', '午'], ['丑', '未'], ['寅', '申'], ['卯', '酉'], ['辰', '戌'], ['巳', '亥']];
    const liuHePairs = { '子丑': '化土', '丑子': '化土', '寅亥': '化木', '亥寅': '化木', '卯戌': '化火', '戌卯': '化火', '辰酉': '化金', '酉辰': '化金', '巳申': '化水', '申巳': '化水', '午未': '化土', '未午': '化土' };
    const liuHaiPairs = [['子', '未'], ['丑', '午'], ['寅', '巳'], ['卯', '辰'], ['申', '亥'], ['酉', '戌']];

    const push = (arr, str) => { if (!arr.includes(str)) arr.push(str); };
    const checkedPairs = new Set();

    targetIndices.forEach(tIdx => {
        if (tIdx >= pillars.length) return;
        const p1 = pillars[tIdx];
        if (!p1) return;

        pillars.forEach((p2, oIdx) => {
            if (tIdx === oIdx || !p2) return;

            const pairId = [tIdx, oIdx].sort((a, b) => a - b).join('-');
            if (checkedPairs.has(pairId)) return;
            checkedPairs.add(pairId);

            const s1 = p1.gan, s2 = p2.gan;
            if (s1 && s2) {
                const sp1 = GAN.indexOf(s1) < GAN.indexOf(s2) ? s1 : s2;
                const sp2 = s1 === sp1 ? s2 : s1;
                const sKey = sp1 + sp2;

                if (ganHeMap[sp1] === sp2) {
                    push(res.stems, sKey + (ganHeResult[sKey] || ''));
                }
                ganChongPairs.forEach(cp => {
                    if ((cp[0] === s1 && cp[1] === s2) || (cp[0] === s2 && cp[1] === s1)) push(res.stems, sKey + "冲");
                });
            }

            const b1 = p1.zhi, b2 = p2.zhi;
            if (b1 && b2) {
                const bp1 = ZHI.indexOf(b1) < ZHI.indexOf(b2) ? b1 : b2;
                const bp2 = b1 === bp1 ? b2 : b1;
                const bKey = bp1 + bp2;

                liuChongPairs.forEach(cp => { if ((cp[0] === b1 && cp[1] === b2) || (cp[0] === b2 && cp[1] === b1)) push(res.branches, bKey + "冲"); });
                if (liuHePairs[b1 + b2]) push(res.branches, bKey + "六合");
                liuHaiPairs.forEach(hp => { if ((hp[0] === b1 && hp[1] === b2) || (hp[0] === b2 && hp[1] === b1)) push(res.branches, bKey + "害"); });

                if ((b1 === '子' && b2 === '卯') || (b1 === '卯' && b2 === '子')) push(res.branches, "子卯刑");
                const bw = [b1, b2].sort().join('');
                if (['寅巳', '巳申', '寅申'].includes(bw)) push(res.branches, bw + "相刑");
                if (['丑戌', '戌未', '丑未'].includes(bw)) push(res.branches, bw + "相刑");
                if (b1 === b2 && ['辰', '午', '酉', '亥'].includes(b1)) push(res.branches, b1 + b1 + "自刑");
            }
        });
    });

    return res;
}

// Expose functions to window for browser usage
window.calculateBazi = calculateBazi;
window.calculateBodyStrength = calculateBodyStrength;
window.calculateYongXiJi = calculateYongXiJi;
window.findDateFromBazi = findDateFromBazi;
window.getInteractions = getInteractions;
window.getDynamicInteractions = getDynamicInteractions;
window.getSpecificBaziYear = getSpecificBaziYear;
window.getGongJiaRelations = getGongJiaRelations;
window.getFiveElementProfile = getFiveElementProfile;
window.validatePillars = validatePillars;
window.getTombWarehouseStatus = getTombWarehouseStatus;
window.calculateGlobalScores = calculateGlobalScores;
window.getAllEarthStatuses = getAllEarthStatuses;
window.calculateAcademicStatus = calculateAcademicStatus;
window.calculateWealthStatus = calculateWealthStatus;
window.calculateMarriageStatus = calculateMarriageStatus;
window.GAN = GAN;
window.ZHI = ZHI;
window.GAN_WX = GAN_WX;
window.ZHI_WX = ZHI_WX;
window.HIDDEN_STEMS_MAP = HIDDEN_STEMS_MAP;
window.NAYIN = NAYIN;
window.CHANG_SHENG = CHANG_SHENG;
window.TEN_GODS = TEN_GODS;
