/**
 * marriage_tree.js
 * Strictly reconstructed marriage logic based on user reference charts.
 * 1. 结婚时间.png (Early, Late, None) -> Consolidated into MARRIAGE_TIME
 * 2. 婚姻关系.png (Happy, Divorce, Affair) -> MARRIAGE_RELATION
 * 3. 配偶.png (Character, Appearance) -> MARRIAGE_TRAIT, MARRIAGE_APPEARANCE
 */

(function () {
    const E = window.DecisionEngine;
    const { createNode, createResult } = E;

    // =========================================================================
    // 1. RESULT DEFINITIONS
    // =========================================================================

    // --- TIME ---
    const res_Time_Early_A = createResult('res_Time_Early_A', '近水楼台', {
        desc: '你属于那种“早早遇到对的人”，且家里支持、自己也想定。24岁左右如果不领证，自己都觉得亏了。',
        tags: ['早婚']
    });
    const res_Time_Early_B = createResult('res_Time_Early_B', '遗憾磨合', {
        desc: '你这种盘很可惜，你明明在最年轻的时候遇到了最对的人，甚至连家里亲戚都过了，但老天爷偏偏不给你临门一脚（大运）。你会经历极长的时间磨合，最后往往不是因为不爱了，而是因为等不起了。这种感觉就像是所有的硬件都挺好的，但是没通电，你只能眼睁睁的看着这段感情在等中消耗殆尽。',
        tags: ['早婚', '可惜']
    });
    const res_Time_Early_F = createResult('res_Time_Early_F', '公开修行 (早婚多波折)', {
        desc: '你二十出头那次热恋，谈得很认真也想过结婚，但那时你还不懂什么是真正的生活（天干透出），心还不在家里（地支没根），最终几个人合在一起就像是一个一堆像烧焦废墟堆地（宫位刑冲），越是想从那里面找到安慰，你门面只要稍微有点破绽，那就对你来说不是一段缘分，而是一场公开的修行，最后往往是以一种惨烈或无奈的方式收场。',
        tags: ['早婚', '苦恋']
    });

    const res_Time_Late_A = createResult('res_Time_Late_A', '压轴出场', {
        desc: '你的正官是个“压轴出场”的角色。早年的感情生活就像是彩排，看着挺热闹且很难走到最后。直到成熟了（日时代表晚年/晚期），那个真正和你领证的人才会出现（在时干透出），在这之前，你的每一段恋爱都只是在帮你修满恋爱学分。',
        tags: ['晚婚']
    });
    const res_Time_Late_B = createResult('res_Time_Late_B', '心理屏障', {
        desc: '你属于那种心里有事，眼里没人的。早年并不是没遇到过喜欢的，但你总是担心心态不够稳，或者对方只是你平淡生活中的陌路人。外人看你单身，其实你心里草长得比谁都旺，只不过没有我这份地下情或者孤笔，挣不脱一张细绳索。非要到三十五左右，这份婚姻才真正见完天地。',
        tags: ['晚婚']
    });
    const res_Time_Late_Tomb = createResult('res_Time_Late_Tomb', '锁闭空间 (缘分待冲)', {
        desc: '你的感情世界像是被锁钉住了。你觉得你自己遇不到好的人，或者好不容易遇到一个，对方也总是因为各种因素（性格内向、家境特殊等）无法进入阳光。这种陷入僵局、意味着你的另一半能量被封存了。如果不等到大运流年冲开这个“库”，你可能一直处于一种不看红红火火的待机状态。',
        tags: ['晚婚']
    });
    const res_Time_Late_Weak = createResult('res_Time_Late_Weak', '缘分缺角', {
        desc: '你对另一半的要求其实不高，但奇怪的是，你遇到的缘分总是差那么一点。你遇到的要么是很欠缺，要么是很纠结想太久让你停了。这让你觉得婚姻对于你来说像是一个填补上了看好的人，你的命局决定了，这种养成式的强硬缘分，在早年根本搞不定。',
        tags: ['晚婚']
    });

    const res_Time_None_A = createResult('res_Time_None_A', '生命孤岛', {
        desc: '你的生命里好像天生就少了一个叫“婚姻”的板块。别人在为情所困、为房奔波时，你往往处于一种精神寂静的状态。你不是没人追，也不是没想过谈，而是你对听到的所谓“正常的生说方式”看都不想看一眼。你的世界里，事业、爱好甚至发呆都比谈恋爱有意思。你这种单机人生，如果要强行拉入两个人航行，只会因生活细节被打乱。因为你的灵魂深处，早已习惯了那种“无牵无挂、自由至极”的高级感。',
        tags: ['不婚']
    });

    // --- RELATION ---
    const res_Rel_Happy = createResult('res_Rel_Happy', '婚姻美满', {
        desc: '夫妻宫坐喜用且不被冲。这就像家里地基稳，另一半对你帮助大，两人感情深。',
        tags: ['美满']
    });
    const res_Rel_Divorce = createResult('res_Rel_Divorce', '劳燕分飞 (离异风险)', {
        desc: '家里坐了个跟自己一样强硬的劫财（比劫），或者是一把伤人的刀（羊刃）。这不仅是吵架的问题，而是两个人都想当家作主，谁也不服谁。这种“硬碰硬”的格局，往往是大运流年一引动，就容易分道扬镳。',
        tags: ['离异', '比劫']
    });

    const res_Rel_BiJie = createResult('res_Rel_BiJie', '争夺与克制 (日坐比劫)', {
        desc: '日支坐比劫，代表夫妻宫里住了一个“竞争者”。你们的关系往往充满了互不相让的火药味。两个人都太自我，遇到矛盾第一反应是捍卫自己的立场，而不是理解对方。这种“硬碰硬”的相处模式，很容易把感情吵散。',
        tags: ['争夺', '比劫']
    });
    const res_Rel_Xing = createResult('res_Rel_Xing', '互相折磨 (日支相刑)', {
        desc: '日支相刑，代表夫妻宫里有一种“别扭”的磁场。你们明明不想吵架，但一说话就带刺；明明想对对方好，做出来的事却总让对方难受。这种“互相折磨”的内耗，比大吵大闹更伤感情，像鞋子里进了沙子，走一步疼一步。',
        tags: ['刑伤', '内耗']
    });
    const res_Rel_YangRen_M = createResult('res_Rel_YangRen_M', '克妻 (男命羊刃)', {
        desc: '男命日坐羊刃，是典型的“克妻”标志。这里的“克”不一定是生离死别，更多的是指你性格中的暴躁和极端，会让妻子感到极大的压力和伤害。你的爱往往带着很强的控制欲和破坏力，让对方想逃。',
        tags: ['羊刃', '刚烈']
    });
    const res_Rel_YangRen_F = createResult('res_Rel_YangRen_F', '暴躁 (女命羊刃)', {
        desc: '女命日坐羊刃，代表你性格刚烈，不输男儿。在婚姻里，你很难做一个温顺的小女人，往往会因为太强势、太急躁而把老公“吓跑”。你的刀子嘴往往是婚姻最大的杀手。',
        tags: ['羊刃', '强势']
    });

    const res_Rel_Affair = createResult('res_Rel_Affair', '墙外桃花 (外情风险)', {
        desc: '这种格局异性缘太旺，婚后也难断。如果不刻意保持距离，很容易陷入三人行的尴尬。',
        tags: ['外情']
    });

    // --- TRAITS & APP ---
    const res_Trait_Strong = createResult('res_Trait_Strong', '针尖麦芒', {
        desc: '另一半个性极强，如同针尖对麦芒。TA能力出众但脾气较硬，在相处中容易因为谁说了算而产生摩擦。这种伴侣能带你飞，但前提是你得受得住TA的锋芒。',
        tags: ['强势']
    });
    const res_Trait_Enjoy = createResult('res_Trait_Enjoy', '温顺有福', {
        desc: '另一半体态丰盈，天生一副富贵相。TA性格温和，最懂享受生活，和TA在一起，你的生活质量会直线提升，日子过得有滋有味，是典型的有福之人。',
        tags: ['有福']
    });
    const res_Trait_Smart = createResult('res_Trait_Smart', '才子佳人', {
        desc: '另一半聪明过人，才华横溢，带点艺术家的傲气。TA的脑子转得比你快，讲究精神共鸣。虽然有时候会显得清高或不切实际，但在才情这一块绝对拿捏得死死的。',
        tags: ['聪慧']
    });
    const res_Trait_Reliable = createResult('res_Trait_Reliable', '踏实顾家', {
        desc: '另一半是个实在人，不说花言巧语但最重承诺。TA理财是一把好手，把家里打理得井井有条。这种人可能不懂浪漫，但绝对是你最坚实的后盾。',
        tags: ['顾家']
    });
    const res_Trait_Playful = createResult('res_Trait_Playful', '风流洒脱', {
        desc: '另一半格局大、会赚钱，但也爱社交。TA风流洒脱，朋友遍天下，带出去极其有面子。但你要做好心理准备，TA的心很难完全拴在家里，你得有足够的自信和手腕。',
        tags: ['豪爽']
    });
    const res_Trait_Right = createResult('res_Trait_Right', '正气凛然', {
        desc: '另一半端庄、自律，生活像时钟一样规矩。TA身上有一种老干部的正气，做事一板一眼，虽然可能缺乏一些浪漫情调，但绝对是那种在大是大非面前站得住脚、能给你极强安全感的人。',
        tags: ['正气']
    });
    const res_Trait_Power = createResult('res_Trait_Power', '霸道总裁', {
        desc: '另一半性格果敢，带有一种天然的威严感。在家里，TA往往是拿主意的那一个，说话做事说一不二。这种性格在事业上是极大的优势（能扛事），但在亲密关系中，你可能会感到一种无形的压迫感。你找的不是一个保姆，而是一个能与你并肩作战甚至需要你仰视的“王”。',
        tags: ['威严']
    });
    const res_Trait_Care = createResult('res_Trait_Care', '慈母关怀', {
        desc: '另一半有着春天般温暖的包容心，像长辈一样照顾你。在TA面前，你可以卸下所有防备当个孩子。虽然有时会显得有点爱操心，但这份无微不至的关怀是你最温暖的港湾。',
        tags: ['包容']
    });
    const res_Trait_Deep = createResult('res_Trait_Deep', '心思深沉', {
        desc: '另一半是个思想深邃的怪才，内心世界极丰富但很难被看透。TA不喜欢随波逐流，这让你觉得TA很酷，但有时那种孤僻和距离感也会让你觉得难以走进TA的心里。',
        tags: ['深沉']
    });

    const res_Trait_Husband_ZG_Good = createResult('res_Trait_Husband_ZG_Good', '优质伴侣 (正官喜用)', {
        desc: '你寻找的不是一个‘保镖’，而是一个‘合伙人’。日坐正官为喜用，意味着你最终嫁的是一位优质男。他不仅外表英俊、谈吐得体，更重要的是，他在事业上的成功是厚积薄发的。能给你带来一种婚姻关系的底色是‘尊重’与‘契约’，让你通过婚姻获得超越的安全感。',
        tags: ['优质', '尊重']
    });
    const res_Trait_Husband_QS_Good = createResult('res_Trait_Husband_QS_Good', '乱世英雄 (七杀有制)', {
        desc: '你命里的另一半，注定是一位‘乱世英雄’。七杀虽为偏星，但若有根且透出为喜用，代表你的丈夫是一位非常有魄力、有手段的强者。他可能脾气不好，甚至有点霸道，但在关键时刻，他绝对是那个能为你撑起一片天的人。这种婚姻，是一场‘强者对强者’的欣赏。',
        tags: ['魄力', '强者']
    });
    const res_Trait_Wife_ZC_Good = createResult('res_Trait_Wife_ZC_Good', '顶层贤助 (正财喜用)', {
        desc: '你娶的不是一个‘保姆’，而是一位‘顶层设计师’。日坐正财为喜用，意味着你的另一半是你生命里最好的‘贤内助’。她不仅长相得体，更有一种将琐碎生活经营出高级感的能力。她对钱的概念不是简单的省钱，而是能精准地打理你的财富。你在外面冲锋陷阵时，永远不用担心后院起火。',
        tags: ['贤内助', '理财']
    });
    const res_Trait_Wife_PC_Good = createResult('res_Trait_Wife_PC_Good', '带刺玫瑰 (偏财得位)', {
        desc: '你的另一半，注定是一朵‘带刺的玫瑰’。偏财得位且为喜用，代表你娶到的是一位非常有能力、有见识的女性。她可能不屑于做家务，但她在事业上、社交上的光芒，会让你非常有面子。这种婚姻，不是找个老婆过日子，而是找个战友打天下。',
        tags: ['能力', '面子']
    });

    const res_App_Good = createResult('res_App_Good', '颜值担当', {
        desc: '另一半是妥妥的颜值担当，带出去绝对让人眼前一亮。气质优雅，长相出众，满足了你对所谓“郎才女貌”的所有幻想。当然，养眼的同时也容易招来别人的觊觎。',
        tags: ['漂亮']
    });
    const res_App_Ordinary = createResult('res_App_Ordinary', '端庄朴实', {
        desc: '另一半不是那种第一眼就惊艳全场的类型，但绝对是耐看型。TA自带一种端庄大气的正室范儿，长相朴实无华但极其周正。这种面相往往意味着性格实在、靠谱，是长辈眼中最标准的“好媳妇/好女婿”人选，越相处越觉得踏实。',
        tags: ['实在']
    });

    // --- New Hidden Results ---
    const res_Time_Hidden_Good = createResult('res_Time_Hidden_Good', '地下恋成典范 (暗处转明)', {
        desc: '你的感情能量都在‘地下’（地支藏干）。你不是没桃花，而是你的桃花都是‘潜伏’着的。要么是办公室恋情，要么是朋友圈里的知根知底。虽然早年看着风平浪静，但只要大运一冲动，这份‘地下的能量’就会瞬间喷发，成就一段让人意想不到的姻缘。',
        tags: ['潜伏', '大器晚成']
    });
    const res_Time_Hidden_Bad = createResult('res_Time_Hidden_Bad', '隐秘的苦衷 (缘分难显)', {
        desc: '你的感情里总带着一些‘不足为外人道’的苦衷。你想找的人可能一直都在，但因为现实压力的封锁，让这段关系很难见光。你在等待一个契机，但在这契机到来之前，你只能在心里默默守护那份没结果的期待。',
        tags: ['苦衷', '纠结']
    });
    const res_Time_Hidden_Clash = createResult('res_Time_Hidden_Clash', '隐秘被震碎 (家庭阻碍)', {
        desc: '你本想安稳地守着自己的小幸福，但命里的‘刑冲’却像是一把重锤，打碎了这份隐秘的平静。这往往代表你的婚姻会受到来自家庭、长辈的外部强力干扰，让一段本该美满的感情在震荡中支离破碎。',
        tags: ['阻碍', '震荡']
    });

    // --- Affair & Complex Relation Results ---
    const res_Rel_Combine_M = createResult('res_Rel_Combine_M', '众星捧月 (夺妻风险)', {
        desc: '男命配偶星被合，代表你的另一半魅力太大，婚后仍有追求者。如果比劫太旺，更要警惕被人‘挖墙脚’。',
        tags: ['夺妻', '危机']
    });
    const res_Rel_Combine_F = createResult('res_Rel_Combine_F', '情丝难断 (夺夫风险)', {
        desc: '女命配偶星被合，代表你的先生容易被外面的花草吸引，或者这原本就是一段竞争激烈的感情。',
        tags: ['夺夫', '危机']
    });
    const res_Rel_SanHe = createResult('res_Rel_SanHe', '桃花泛滥 (三合局)', {
        desc: '地支见三合，人际关系极好，但感情也容易因‘合’而乱。',
        tags: ['多情']
    });
    const res_Rel_LiuHe = createResult('res_Rel_LiuHe', '如胶似漆 (六合)', {
        desc: '地支六合代表感情粘性大，分不开。但也容易因为太在意而产生控制欲。',
        tags: ['粘性']
    });
    const res_Rel_AnHe = createResult('res_Rel_AnHe', '暗通款曲 (暗合)', {
        desc: '暗合代表有一些不为人知的地下情分，或者心理上总挂念着一个不可能的人。',
        tags: ['地下']
    });
    const res_Rel_Peach_Month = createResult('res_Rel_Peach_Month', '墙内桃花', {
        desc: '红杏出墙不是你想，而是命中带。早年情史丰富，婚后若不收心，难免惹火烧身。',
        tags: ['诱惑']
    });
    const res_Rel_Peach_Hour = createResult('res_Rel_Peach_Hour', '墙外桃花', {
        desc: '这种桃花开在晚年，代表老当益壮或者婚后依然魅力不减。但这往往也是家庭稳定的隐患。',
        tags: ['危机']
    });
    const res_Rel_Robbed = createResult('res_Rel_Robbed', '比劫夺财/官', {
        desc: '明确的‘情敌’信号。你的每一段感情似乎都伴随着竞争。',
        tags: ['情敌']
    });

    // --- Happy Variants ---
    const res_Rel_Bond = createResult('res_Rel_Bond', '天作之合 (合入日主)', {
        desc: '另一半就像是为你量身定做的，两人磁场极度契合。',
        tags: ['契合']
    });
    const res_Rel_Happy_Iron = createResult('res_Rel_Happy_Iron', '铁桶江山 (财官印俱全)', {
        desc: '你的婚姻稳如泰山，无论外界如何风云变幻，你们的家庭结构都极度稳固。',
        tags: ['稳固']
    });
    const res_Rel_Happy_CFO = createResult('res_Rel_Happy_CFO', '珠联璧合 (中和纯正)', {
        desc: '感情纯真，没有杂质。你们的关系就像一杯温润的茶，越品越有味道。',
        tags: ['纯正']
    });
    const res_Rel_Happy_Old = createResult('res_Rel_Happy_Old', '老夫老妻 (日坐配偶)', {
        desc: '这种缘分深厚且持久，两人像前世就认识一样，有一种天然的默契感。',
        tags: ['默契']
    });
    const res_Rel_Happy_Mutual = createResult('res_Rel_Happy_Mutual', '相敬如宾 (日坐喜用)', {
        desc: '虽然没有烈火烹油的热烈，但有一种细水长流的尊重。',
        tags: ['尊重']
    });

    // =========================================================================
    // 2. TREE LOGIC: MARRIAGE_TIME
    // =========================================================================

    const rootTime = createNode('Time_Root_Presence', '命中无星?');
    const node_Gender = createNode('Time_Gender', '性别判定?');

    // Female
    const node_F_YM = createNode('Time_F_YM', '女命: 官杀在年月?');
    const node_F_Palace = createNode('Time_F_Palace', '夫妻宫刑冲?');
    const node_F_YM_Zheng = createNode('Time_F_YM_Zheng', '年月见正官?');
    const node_F_YM_Exposed = createNode('Time_F_YM_Exposed', '天干透出?');
    const node_F_YM_Luck = createNode('Time_F_YM_Luck', '早年大运给力?');
    const node_F_DH = createNode('Time_F_DH', '女命: 官杀在日/时?');
    const node_F_DH_Stem = createNode('Time_F_DH_Stem', '天干透出?');
    const node_F_Tomb = createNode('Time_F_Tomb', '入墓库?');

    // Male
    const node_M_YM = createNode('Time_M_YM', '男命: 财星在年月?');
    const node_M_Palace = createNode('Time_M_Palace', '夫妻宫刑冲?');
    const node_M_YM_Zheng = createNode('Time_M_YM_Zheng', '年月见正财?');
    const node_M_YM_Exposed = createNode('Time_M_YM_Exposed', '天干透出?');
    const node_M_DH = createNode('Time_M_DH', '男命: 财星在日/时?');
    const node_M_DH_Stem = createNode('Time_M_DH_Stem', '天干透出?');
    const node_M_Tomb = createNode('Time_M_Tomb', '入墓库?');

    rootTime.setCondition(ctx => !ctx.getGodMeta(ctx.isMale ? '财星' : '官杀').exists).yes(res_Time_None_A).no(node_Gender);
    node_Gender.setCondition(ctx => !ctx.isMale).yes(node_F_YM).no(node_M_YM);

    // Female Logic - Reordered
    const node_F_Exposed_Palace = createNode('Time_F_Exposed_Palace', '夫妻宫刑冲?');
    const node_F_NotExposed_Palace = createNode('Time_F_NotExposed_Palace', '夫妻宫刑冲?');
    const node_F_NotExposed_Luck = createNode('Time_F_NotExposed_Luck', '早年大运给力?');

    node_F_YM.setCondition(ctx => ctx.getGodMeta('官杀').nodes.some(n => n.pillarIndex < 2)).yes(node_F_YM_Exposed).no(node_F_DH);
    node_F_YM_Exposed.setCondition(ctx => ctx.getGodMeta('官杀').nodes.some(n => n.isStem && n.pillarIndex < 2)).yes(node_F_YM_Luck).no(node_F_NotExposed_Palace);
    node_F_YM_Luck.setCondition(ctx => ctx.hasMarriageLuckPrime).yes(node_F_Exposed_Palace).no(res_Time_Early_B);
    node_F_Exposed_Palace.setCondition(ctx => ctx.isPalaceClashed || ctx.isPalacePunished).yes(res_Time_Early_F).no(res_Time_Early_A);

    node_F_NotExposed_Palace.setCondition(ctx => ctx.isPalaceClashed || ctx.isPalacePunished).yes(res_Time_Hidden_Clash).no(node_F_NotExposed_Luck);
    node_F_NotExposed_Luck.setCondition(ctx => ctx.hasMarriageLuckPrime).yes(res_Time_Hidden_Good).no(res_Time_Hidden_Bad);

    node_F_DH.setCondition(ctx => ctx.getGodMeta('官杀').nodes.some(n => n.pillarIndex >= 2)).yes(node_F_DH_Stem).no(res_Time_None_A);
    node_F_DH_Stem.setCondition(ctx => ctx.getGodMeta('官杀').nodes.some(n => n.isStem && n.pillarIndex >= 2)).yes(res_Time_Late_A).no(node_F_Tomb);
    node_F_Tomb.setCondition(ctx => ctx.getGodMeta('官杀').nodes.some(n => n.char === '辰' || n.char === '戌' || n.char === '丑' || n.char === '未')).yes(res_Time_Late_Tomb).no(res_Time_Late_Weak);

    // Male Logic
    const node_M_YM_Luck = createNode('Time_M_YM_Luck', '早年大运给力?');
    const node_M_Exposed_Palace = createNode('Time_M_Exposed_Palace', '夫妻宫刑冲?');
    const node_M_NotExposed_Palace = createNode('Time_M_NotExposed_Palace', '夫妻宫刑冲?');
    const node_M_NotExposed_Luck = createNode('Time_M_NotExposed_Luck', '早年大运给力?');

    node_M_YM.setCondition(ctx => ctx.getGodMeta('财星').nodes.some(n => n.pillarIndex < 2)).yes(node_M_YM_Exposed).no(node_M_DH);
    node_M_YM_Exposed.setCondition(ctx => ctx.getGodMeta('财星').nodes.some(n => n.isStem && n.pillarIndex < 2)).yes(node_M_YM_Luck).no(node_M_NotExposed_Palace);
    node_M_YM_Luck.setCondition(ctx => ctx.hasMarriageLuckPrime).yes(node_M_Exposed_Palace).no(res_Time_Early_B);
    node_M_Exposed_Palace.setCondition(ctx => ctx.isPalaceClashed || ctx.isPalacePunished).yes(res_Time_Early_F).no(res_Time_Early_A);

    node_M_NotExposed_Palace.setCondition(ctx => ctx.isPalaceClashed || ctx.isPalacePunished).yes(res_Time_Hidden_Clash).no(node_M_NotExposed_Luck);
    node_M_NotExposed_Luck.setCondition(ctx => ctx.hasMarriageLuckPrime).yes(res_Time_Hidden_Good).no(res_Time_Hidden_Bad);

    node_M_DH.setCondition(ctx => ctx.getGodMeta('财星').nodes.some(n => n.pillarIndex >= 2)).yes(node_M_DH_Stem).no(res_Time_None_A);
    node_M_DH_Stem.setCondition(ctx => ctx.getGodMeta('财星').nodes.some(n => n.isStem && n.pillarIndex >= 2)).yes(res_Time_Late_A).no(node_M_Tomb);
    node_M_Tomb.setCondition(ctx => ctx.getGodMeta('财星').nodes.some(n => n.char === '辰' || n.char === '戌' || n.char === '丑' || n.char === '未')).yes(res_Time_Late_Tomb).no(res_Time_Late_Weak);

    // =========================================================================
    // 3. TREE LOGIC: MARRIAGE_RELATION
    // =========================================================================

    const rootRelHappy = createNode('Rel_Happy_Root', '是否婚姻美满?');
    const node_Happy_Bond = createNode('Happy_Bond', '日主合配偶星?');
    const node_Happy_ThreeGods = createNode('Happy_ThreeGods', '财官印俱全喜用?');
    const node_Happy_Pure = createNode('Happy_Pure', '配偶星纯正?');
    const node_Happy_DayStar = createNode('Happy_DayStar', '日支为配偶星?');
    const node_Happy_DayUseful = createNode('Happy_DayUseful', '日支为喜用神?');

    rootRelHappy.setCondition(ctx => true).yes(node_Happy_Bond);
    node_Happy_Bond.setCondition(ctx => ctx.isSpouseStemCombinedWithDM).yes(res_Rel_Bond).no(node_Happy_ThreeGods);
    node_Happy_ThreeGods.setCondition(ctx => ctx.getGodMeta('财星').isYong && ctx.getGodMeta('官杀').isYong && ctx.getGodMeta('印星').isYong).yes(res_Rel_Happy_Iron).no(node_Happy_Pure);
    node_Happy_Pure.setCondition(ctx => ctx.isPureZheng).yes(res_Rel_Happy_CFO).no(node_Happy_DayStar);
    node_Happy_DayStar.setCondition(ctx => ctx.isDayBranchSpouseStar && ctx.dayBranchNode?.isYong).yes(res_Rel_Happy_Old).no(node_Happy_DayUseful);

    node_Happy_DayUseful.setCondition(ctx => ctx.dayBranchNode?.isYong).yes(res_Rel_Happy_Mutual);


    const rootRelDivorce = createNode('Rel_Divorce_Root', '是否离异风险?');
    const node_Divorce_BiJie = createNode('Divorce_BiJie', '日坐比劫?');
    const node_Divorce_Xing = createNode('Divorce_Xing', '日支相刑?');
    const node_Divorce_YangRen = createNode('Divorce_YangRen', '羊刃旺?');
    const node_Divorce_YangRen_Gender = createNode('Divorce_YangRen_Gender', '羊刃性别判定?');

    rootRelDivorce.setCondition(ctx => true).yes(node_Divorce_BiJie);
    node_Divorce_BiJie.setCondition(ctx => ctx.dayBranchNode?.category === '比劫').yes(res_Rel_BiJie).no(node_Divorce_Xing);

    node_Divorce_Xing.setCondition(ctx => ctx.isDayBranchXing).yes(res_Rel_Xing).no(node_Divorce_YangRen);
    node_Divorce_YangRen.setCondition(ctx => ctx.getGodMeta('比劫').isStrong && ctx.isYangRenStrong).yes(node_Divorce_YangRen_Gender);
    node_Divorce_YangRen_Gender.setCondition(ctx => ctx.isMale).yes(res_Rel_YangRen_M).no(res_Rel_YangRen_F);

    const rootAffair = createNode('Affair_Root', '是否出轨风险?');
    const node_Affair_Robbed = createNode('Affair_Robbed', '比劫夺财?');
    const node_Affair_Stem = createNode('Affair_Stem', '配偶星干合(他人)?');
    const node_Affair_Stem_Real_Gender = createNode('Affair_Stem_Real_Gender', '性别判定?');
    const node_Affair_SanHe = createNode('Affair_SanHe', '三合局?');
    const node_Affair_LiuHe = createNode('Affair_LiuHe', '六合?');
    const node_Affair_AnHe = createNode('Affair_AnHe', '暗合?');
    const node_Affair_Peach = createNode('Affair_Peach', '咸池桃花?');
    const node_Affair_Peach_Loc = createNode('Affair_Peach_Loc', '桃花位置?');

    rootAffair.setCondition(ctx => true).yes(node_Affair_Robbed);
    node_Affair_Robbed.setCondition(ctx => ctx.isAnyWealthRobbed).yes(res_Rel_Robbed).no(node_Affair_Stem);
    node_Affair_Stem.setCondition(ctx => ctx.isSpouseStemCombinedWithOther && !ctx.isCompetingHe).yes(node_Affair_Stem_Real_Gender).no(node_Affair_SanHe);
    node_Affair_Stem_Real_Gender.setCondition(ctx => ctx.isMale).yes(res_Rel_Combine_M).no(res_Rel_Combine_F);
    node_Affair_SanHe.setCondition(ctx => ctx.hasSanHe).yes(res_Rel_SanHe).no(node_Affair_LiuHe);
    node_Affair_LiuHe.setCondition(ctx => ctx.hasLiuHe).yes(res_Rel_LiuHe).no(node_Affair_AnHe);
    node_Affair_AnHe.setCondition(ctx => ctx.hasAnHe).yes(res_Rel_AnHe).no(node_Affair_Peach);
    node_Affair_Peach.setCondition(ctx => ctx.hasPeachShaHourRevealed || ctx.hasPeachShaMonthRevealed).yes(node_Affair_Peach_Loc);
    node_Affair_Peach_Loc.setCondition(ctx => ctx.hasPeachShaHourRevealed).yes(res_Rel_Peach_Hour).no(res_Rel_Peach_Month);

    // =========================================================================
    // 4. TREE LOGIC: MARRIAGE_SPOUSE
    // =========================================================================

    const rootTrait = createNode('Trait_Root', '判定另一半性格?');
    const node_Trait_Generic = createNode('Trait_Generic', '日支通用判定?');
    node_Trait_Generic.setCondition(ctx => true).yes(
        createNode('Trait_Check', '日坐比劫?')
            .setCondition(ctx => ctx.dayBranchNode?.category === '比劫').yes(res_Trait_Strong)
            .no(createNode('Trait_EG', '日坐食神?')
                .setCondition(ctx => ctx.dayBranchNode?.godName === '食神').yes(res_Trait_Enjoy)
                .no(createNode('Trait_SG', '日坐伤官?').setCondition(ctx => ctx.dayBranchNode?.godName === '伤官').yes(res_Trait_Smart)
                    .no(createNode('Trait_W', '日坐正财?').setCondition(ctx => ctx.dayBranchNode?.godName === '正财').yes(res_Trait_Reliable)
                        .no(createNode('Trait_PW', '日坐偏财?').setCondition(ctx => ctx.dayBranchNode?.godName === '偏财').yes(res_Trait_Playful)
                            .no(createNode('Trait_O', '日坐正官?').setCondition(ctx => ctx.dayBranchNode?.godName === '正官').yes(res_Trait_Right)
                                .no(createNode('Trait_K', '日坐七杀?').setCondition(ctx => ctx.dayBranchNode?.godName === '七杀' || ctx.dayBranchNode?.godName === '杀').yes(res_Trait_Power)
                                    .no(createNode('Trait_I', '日坐正印?').setCondition(ctx => ctx.dayBranchNode?.godName === '正印').yes(res_Trait_Care)
                                        .no(res_Trait_Deep)
                                    ))))))));


    const node_Trait_Gender = createNode('Trait_Gender', '性别判定?');
    const node_Trait_M_ZhengCai = createNode('Trait_M_ZhengCai', '日坐正财且喜用?');
    const node_Trait_M_PianCai = createNode('Trait_M_PianCai', '偏财格局?');
    const node_Trait_F_ZhengGuan = createNode('Trait_F_ZhengGuan', '日坐正官且喜用?');
    const node_Trait_F_QiSha = createNode('Trait_F_QiSha', '七杀格局?');

    rootTrait.setCondition(ctx => true).yes(node_Trait_Gender);
    node_Trait_Gender.setCondition(ctx => ctx.isMale).yes(node_Trait_M_ZhengCai).no(node_Trait_F_ZhengGuan);

    node_Trait_M_ZhengCai.setCondition(ctx => ctx.dayBranchNode?.godName === '正财' && ctx.dayBranchNode?.isYong).yes(res_Trait_Wife_ZC_Good).no(node_Trait_M_PianCai);

    node_Trait_M_PianCai.setCondition(ctx => ctx.getGodMeta('财星').isStrong && ctx.getGodMeta('财星').nodes.some(n => n.godName === '偏财')).yes(res_Trait_Wife_PC_Good).no(node_Trait_Generic);

    node_Trait_F_ZhengGuan.setCondition(ctx => ctx.dayBranchNode?.godName === '正官' && ctx.dayBranchNode?.isYong).yes(res_Trait_Husband_ZG_Good).no(node_Trait_F_QiSha);

    node_Trait_F_QiSha.setCondition(ctx => ctx.getGodMeta('官杀').isStrong && ctx.getGodMeta('官杀').nodes.some(n => n.godName === '七杀' || n.godName === '杀')).yes(res_Trait_Husband_QS_Good).no(node_Trait_Generic);

    const rootApp = createNode('App_Root', '判定另一半颜值?');
    rootApp.setCondition(ctx => ctx.isPeachDay).yes(res_App_Good).no(res_App_Ordinary);


    // =========================================================================
    // 5. REGISTRATION
    // =========================================================================
    if (window.DecisionEngine) {
        window.DecisionEngine.Engine.registerTree('MARRIAGE_TIME', rootTime);
        window.DecisionEngine.Engine.registerTree('MARRIAGE_REL_HAPPY', rootRelHappy);
        window.DecisionEngine.Engine.registerTree('MARRIAGE_REL_DIVORCE', rootRelDivorce);
        // Consolidated Affair Tree
        window.DecisionEngine.Engine.registerTree('MARRIAGE_REL_AFFAIR', rootAffair);

        window.DecisionEngine.Engine.registerTree('MARRIAGE_TRAIT', rootTrait);
        window.DecisionEngine.Engine.registerTree('MARRIAGE_APPEARANCE', rootApp);
    }
})();
