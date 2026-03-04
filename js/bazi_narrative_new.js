/**
 * bazi_narrative.js
 * Implementation of the "Three-Section Layout" (Sanbanfu) Narrative Engine.
 * 1. Calibration (校准): Trust building via "Cold Reading" (Day Master / Ten God / Health).
 * 2. Diagnosis (诊断): Core problem identification (Wealth / Marriage / Academic).
 * 3. Divine Judgment (神断): Feng Shui inference based on the diagnosis.
 */

const BaziNarrative = {
    _version: "2026-02-17-Final-FengShui-Fix", // Version Tag for Debugging
    init: function () { console.log("✅ Bazi Narrative Engine Loaded (Version: " + this._version + ")"); },
    // --- Data Resources (Extracted from Markdown) ---
    data: {
        dm: {
            '甲': '性格耿直，就是那种路上看到不平之事一定要管的人。心软善良，看到可怜的人就想帮一把。骨子里有股傲气，不甘居人后，哪怕吃苦也不轻易低头。负面是有点死板，认死理，明明心里软嘴上却不饶人。不懂拒绝别人，有时候把自己搞得很累。',
            '乙': '性格柔软灵活，像柳条一样能伸能屈，到哪儿都能适应。举止优雅，态度谦和，容易相处。内心细腻敏感，别人的一个眼神一句话都可能在心里想很久。很有耐力，但遇到大事小事都忍不住想问问别人的意见。负面是太在意他人看法，有时显得没主见，像野草一样看似柔弱实则心里那股劲不容易放下。',
            '丙': '天生就是气氛组担当，到哪儿都热热闹闹的。心里藏不住事，开心时全世界都看得出来，生气时也全写在脸上。喜欢被表扬，被认可时会更有干劲。行动快脑子快，但三分钟热度也是真的。讲义气大方，但急起来嗓门也大，过后后悔又拉不下脸道歉。',
            '丁': '外表文文静静，内心戏特别多。外表看着柔和，对在乎的人可以付出很多很多。洞察力强，别人嘴上没说心里想什么，往往一眼就能看出来。但就是太敏感，容易想多，有时候自己跟自己较劲。心情阴晴不定，需要慢慢相处才能走进心里。',
            '戊': '就是朋友眼中最靠谱的那个人，答应的事一定办到。性格沉稳厚重，像山一样让人有安全感。包容力强，朋友的牢骚都听得下。负面是太固执，认准的事九头牛都拉不回来。好面子，明明吃力也不说，死撑。',
            '己': '性格随和好相处，像大地一样什么都能接纳。动手能力强，布置房间这些事难不倒。负面是耳根子软，别人说啥都觉得有道理，容易被人带跑。遇到选择就犯难，想太多反而定不下来。看起来好说话，但心里其实有自己的小算盘。',
            '庚': '说话直来直去，不会拐弯抹角，办事效率高说干就干。为人公正，看不惯的事就要说。朋友有难处一定会帮，哪怕自己吃点亏也无所谓。负面是太直接容易得罪人，有时候得理不饶人。好胜心强，什么都想争一争。',
            '辛': '气质温润有品位，穿衣打扮、生活细节都讲究。口才好，会说话，善于表达。乐于助人，帮起人来细致周到。但负面是太爱面子，打肿脸充胖子的事也干得出来。有时候有点玻璃心，被人说了会记很久。',
            '壬': '脑子活反应快，点子多，学东西上手快。胸襟开阔，不爱计较鸡毛蒜皮的小事。适应能力强，环境再变也能很快找到立足点。但负面是想法太多太跳跃，做事容易虎头蛇尾。开心时什么都敢干，任性起来劝都劝不住，太注重结果有时反而忽略过程。',
            '癸': '外表温柔平静，其实内心很有主意。擅长观察分析，不鸣则已一鸣惊人。耐心好，能沉下心来做幕后工作。适应力强，再难的处境也能找到生存之道。负面是太容易想太多，有时候自己吓自己。遇到事情魄力不足，想一百遍不如别人做一遍。偶尔有点多愁善感，心里装着事嘴上不说。'
        },
        // Mapped from Ten God Personality
        gods: {
            '偏印': '脑子里想法多，但执行起来就犯懒，拖延症晚期。花钱大手大脚，有时候自己都搞不清钱花哪儿了。为人豪爽，讲义气，面子工程做得好。喜欢来钱快的方式，正经工作反而提不起劲。对玄学神秘事物天生有感应第六感比较强。',
            '七杀': '对自己够狠，对别人也不手软。雷厉风行，执行力强，但有时候急得让人跟不上。富贵险中求，敢闯敢拼，但容易给自己挖坑。身上有股煞气，不怒自威，容易招小人惦记。',
            '正印': '心底善良，看不得别人受苦。心重名声，在外形象要注意，爱面子。喜欢读书学习，跟长辈老师投缘。但就是太依赖别人，独立能力差点。遇到事情不够灵活，认死理。',
            '伤官': '脑子活络，反应快，学东西不费劲。有一身才华挡都挡不住。我行我素。嘴上不饶人，带刺儿，容易得罪人。内心有点傲，觉得别人都不如自己。',
            '食神': '天生的乐天派，心大不记仇。喜欢美食美景，日子过得讲究。对朋友大方，不爱斤斤计较。表达方式温和含蓄，不喜欢跟人正面冲突。身上有点艺术细胞，对美有追求。',
            '正财': '每一分钱都花在刀刃上，不会乱花。踏实肯干，靠谱稳当。做事规规矩矩，风险意识强。但有时候显得太抠门，该花的钱也舍不得。魄力差了点，守成有余开拓不足。',
            '偏财': '钱来得快去得快，根本存不住。为了面子该花的钱一分不省。朋友多社交广，哪儿都有认识的人。喜欢研究投资博彩这些来钱快的门道。对金钱没什么执念，花钱图开心。',
            '正官': '骨子里正直，守规矩讲原则。责任感强，答应的事一定办到。做事光明磊落，不玩阴的。自我约束力强，适合在体制内发展。容易被人信任，在单位里口碑好。',
            '比肩': '自尊心强，输了面子比丢了钱还难受。认定的事九头牛都拉不回来。身边朋友多（尤其是同性），讲义气两肋插刀。但有时候太自我，习惯站在自己角度想问题，不太考虑别人感受。',
            '劫财': '外表看着热情似火，心里跟明镜似的冷静。冲动消费，看到喜欢的东西就忍不住。耳根子软，别人一忽悠就上钩。花钱没个数，经常后悔但下次还犯。'
        },
        godsExpanded: {
            '正官': {
                positive: '为人正直，做事循规蹈矩，极具责任感。在社会上有口皆碑，是一个光明磊落的君子。',
                negative: '行事不端，容易顶撞尊长，缺乏进取心，甚至常有违法乱纪的倾向，易招惹官非。'
            },
            '七杀': {
                positive: '雷厉风行，勇敢果断，不惧困难，勇于开拓进取。身上有股侠义之风，受人敬畏。',
                negative: '性格阴郁跋扈，手段残忍，疑心病重。不仅自己操劳，也容易引起周围人的反感。'
            },
            '正印': {
                positive: '仁慈博大，待人宽厚，智慧超群。学识渊博，文质彬彬，深受长辈及他人的爱戴。',
                negative: '心胸狭窄，做事狠毒。虽然有想法但往往目光短浅，性格多疑，容易感情用事。'
            },
            '偏印': {
                positive: '洞察力敏锐，艺术感官极强，常有异于常人的智慧。在专门技术或艺术领域造诣深厚。',
                negative: '孤僻离群，性格怪异。经常胡思乱想，办事没有常性，且为人刻薄，让人难以亲近。'
            },
            '正财': {
                positive: '勤劳致富，处事从容，责任心极强。待人真诚，能克勤克俭，是一个非常靠谱的实干家。',
                negative: '为人吝啬，金钱观念极其僵化。处事暴躁，容易听信馋言，生活过得比较局促。'
            },
            '偏财': {
                positive: '慷慨大方，豪爽耿直。极具商业大脑，应变能力强，是天生的社交高手和财富猎手。',
                negative: '风流浮华，做事没有定力。花钱大手大脚但多为虚荣，常因贪图享受而招致困顿。'
            },
            '食神': {
                positive: '气质高雅，思想脱俗。口才极佳且心地善良，是真正的谦谦君子，懂得享受生活。',
                negative: '自命不凡，清高孤傲。经常沉溺于空想中不务实，容易在感官享受中迷失方向。'
            },
            '伤官': {
                positive: '聪明过人，才华横溢。反应极快，极具艺术天赋和创造力，是某一领域的佼佼者。',
                negative: '性格偏激，肆无忌惮。喜欢挑战规则，说话容易伤人，恃才傲物，人际关系较差。'
            },
            '比肩': {
                positive: '意志坚定，独立自主。为人义气，与兄弟朋友肝胆相照，是值得托付的好伙伴。',
                negative: '顽固不化，自以为是。性格过于刚硬，容易与亲友产生矛盾，一生奔波操劳。'
            },
            '劫财': {
                positive: '适应力极强，极具竞争意识和爆发力。为人豪爽，能够在逆境中快速崛起。',
                negative: '冲动鲁莽，投机心重。性格双重且极端，容易因为钱财之事与人产生争执纠纷。'
            }
        },
        hanging: {
            '正官': '【正官两头挂】 正官两头挂，富贵又绵长。为人正派，眼里揉不得沙子，原则性强。工作稳定，细水长流，退休后也有保障。',
            '七杀': '【七杀两头挂】 七杀两头挂，灾祸官非来。身上有股狠劲，说话直来直去。这辈子不太平，事业大起大落，容易遇到官非口舌。',
            '正印': '【印绶两头挂】 印绶两头挂，必定慈善人。心地善良，看不得别人受苦。跟宗教、玄学、艺术特别有缘。长辈缘好，易遇贵人。',
            '偏印': '【印绶两头挂】 印绶两头挂，必定慈善人。心地善良但心思重，喜欢帮助别人。跟宗教、玄学、艺术有缘。常得到前辈指点。',
            '伤官': '【伤官两头挂】 伤官两头挂，亲情剩不下。聪明但傲，嘴上不饶人。六亲缘分淡，恃才傲物。容易因为言语伤人闹矛盾。',
            '食神': '【食神两头挂】 食神两头挂，吃喝走天下。天生乐天派，心大不记仇。口福好，朋友多，到哪儿都有朋友接待。心态好长寿。',
            '正财': '【财星两头挂】 财星两头挂，慷慨离家人。花钱大方讲义气，钱留不住。大多数离开家乡发展，出门遇贵人。',
            '偏财': '【财星两头挂】 财星两头挂，慷慨离家人。花钱大方讲义气，钱留不住。适合在外面闯荡，不适合守在家乡。',
            '比肩': '【比劫两头挂】 比劫两头挂，损财是非来。性格倔，认定的事十头牛都拉不回来。钱财方面容易栽跟头，防朋友合伙坑。',
            '劫财': '【比劫两头挂】 比劫两头挂，损财是非来。性格倔，认定的事十头牛都拉不回来。钱财方面容易栽跟头，防朋友合伙坑。'
        },
        // Mapped from Five Element Illness
        healthDetailed: {
            '木': {
                旺: '肝火旺，一点小事就容易上火。睡眠质量差，凌晨容易醒。压力大、焦虑时头两边胀痛。',
                弱: '肝血不足，眼睛干涩看东西模糊。整天疲惫乏力，指甲薄脆有竖纹，头发干枯。'
            },
            '火': {
                旺: '心火旺，嘴里发苦、口腔溃疡反复。血压偏高，性子急心跳快。怕热，易烦躁。',
                弱: '心血不足，心悸心慌。脸色苍白无血色，冬天手脚冰凉末梢循环差。容易疲劳。'
            },
            '土': {
                旺: '脾胃负担重，吃什么都吸收，容易发福。消化不良，嘴里有异味。湿气重，大便黏。',
                弱: '脾胃虚弱，吃不长肉，脸色蜡黄。肠胃敏感吃错就拉肚子。肌肉无力使不上劲。'
            },
            '金': {
                旺: '肺热咳嗽痰多。呼吸道敏感，大便干燥易便秘。皮肤粗糙毛孔大。',
                弱: '肺气虚，感冒抵抗力差。说话有气无力声音低。皮肤干燥过敏起疹子。'
            },
            '水': {
                旺: '肾水泛滥身体易水肿。尿频尿急夜尿多。女性容易有妇科炎症。整个人懒洋洋。',
                弱: '肾虚腰酸腰痛。耳鸣听力下降，记忆力减退丢三落四。精力不济容易疲劳。'
            }
        },
        healthInteractions: {
            '金克木': '注意肝胆问题（胆结石、囊肿）。长期熬夜加班、心情郁闷憋出火来负荷大。',
            '火克金': '注意肺部呼吸道（肺炎、结节）。尤其长期抽烟的人肺功能会差，咳嗽久了要重视。',
            '水克火': '注意心血管问题（冠心病、心绞痛）。年纪大要防血压血脂及突然胸闷。',
            '土克水': '注意泌尿系统（肾结石、膀胱结石）。排尿不畅要多喝水，千万少憋尿。',
            '木克土': '脾胃受损（胃炎、溃疡）。一生气就胃疼，紧张就拉肚子，消化功能紊乱。',
            '火泄木': '火旺泄木过度，预示肝病可能较重，要注意防范肝硬化等大问题。',
            '土泄火': '土旺耗火，气血严重不足，低血压头晕，整个人软绵绵没精神。',
            '金泄土': '金旺反耗土，脾胃虚寒，一吃生冷就胃痛拉肚子。需要温补脾胃。',
            '水泄金': '水旺泄金，易致肺肾两虚，呼吸和肾脏功能相互影响。',
            '木泄水': '木旺吸水过多，肾虚精力差。'
        },
        // --- ADDED FENG SHUI ENVIRONMENT DATA (South-on-Top) ---
        fengshuiEnv: {
            stems: {
                '甲': '大型立柜、落地灯或室内承重柱（直立木象）',
                '乙': '软装窗帘、藤蔓植物或艺术挂画（柔美木象）',
                '丙': '采光极佳的大窗户、电视或主灯具（明亮火象）',
                '丁': '氛围灯、香薰机或电子设备指示灯（微弱火象）',
                '戊': '厚实的墙体、玄关柜或大型陶瓷摆件（稳固土象）',
                '己': '地毯、低矮沙发或收纳箱（卑湿土象）',
                '庚': '冰箱、空调机或健身器材（大型金象）',
                '辛': '精致金属工艺品、钥匙盘或首饰盒（小型金象）',
                '壬': '入户通道、鱼缸或饮水机（流动水象）',
                '癸': '洗手间、加湿器或瓶装洗护用品（静止水象）'
            },
            branches: {
                '子': '洗手间区域或墨水、饮料存放处（正北）',
                '丑': '湿润的储物间、杂物角落或冰箱（东北偏北）',
                '寅': '高大的木质家具、书架或发财树（东北偏东）',
                '卯': '绿植花草盆栽、阳台门窗（正东）',
                '辰': '鱼缸、水管交汇处或潮湿区域（东南偏东）',
                '巳': '厨房灶台、充电器集中区或红色装饰（东南偏南）',
                '午': '客厅电视墙、落地窗或采光最强处（正南）',
                '未': '餐桌区域、暖色调装饰或干燥储物柜（西南偏南）',
                '申': '金属通道、楼梯口或金属材质家具（西南偏西）',
                '酉': '镜子、钟表或精密金属摆件（正西）',
                '戌': '神龛佛堂、干燥的高处或工具箱（西北偏西）',
                '亥': '洗衣机、浴室或盥洗台（西北偏北）'
            }
        },
        // Divine Judgments (Problem -> Feng Shui Inference)
        fengShui: {
            'wealth': [
                '家里西南角或正北是不是堆满了杂物？或者有那种长流水的声音（如鱼缸水流声、漏水）？',
                '厨房的灶台是不是正对着门或者窗户？这叫“财库外露”。',
                '入户门进来是不是一眼就能看到阳台？这叫“穿堂风”，财气留不住。'
            ],
            'career': [
                '家里西北角是不是缺角，或者放了红色的东西（如中国结、红画）？',
                '书桌或办公桌是不是背对着门？或者头顶上有横梁压着？',
                '家里是不是光线特别暗，尤其是客厅？这叫“明堂不明”。'
            ],
            'marriage': [
                '卧室门是不是常年关不严，或者正对着镜子？',
                '床头是不是靠着窗户，或者床底下塞满了杂物？',
                '家里是不是有些成双成对的摆件（如鸳鸯、娃娃）坏了一只或者落单了？'
            ],
            'academic': [
                '孩子的书桌是不是对着墙角，或者坐在横梁底下？',
                '家里正西方是不是有电视机或者音响，整天吵吵闹闹？',
                '文昌位（通常是东南方）是不是乱七八糟，堆满了旧书旧报纸？'
            ]
        }
    },

    /**
     * Generate the full Master Script.
     * @param {Object} report Current full report data (Result of calculateStatus)
     * @param {Object} inputs { wealth, academic, marriage, health, bazi }
     */
    /**
     * Generate the full Master Script as a single string.
     */
    generateScript: function (report) {
        const cards = this.generateCards(report);
        return cards.map(c => c.content).join("\n\n");
    },

    /**
     * Generate the Master Script as structured cards.
     * @returns {Array} [{title, content, type}]
     */
    /**
     * Remove technical Bazi brackets and polish text for a more natural feel.
     * e.g., "日主是【癸】" -> "日主" or just skip.
     */
    stripBaziJargon: function (text) {
        if (!text) return "";
        return text
            .replace(/【.*?】/g, '') // Remove square brackets and content
            .replace(/\(.*?\)/g, '') // Remove parentheses and content (technical jargon)
            .replace(/（.*?）/g, '') // Remove full-width parentheses
            .replace(/日主是/g, '命理五行属')
            .replace(/日主/g, '你')
            .replace(/日坐/g, '内心倾向于')
            .replace(/式的底色/g, '的性格底色')
            .replace(/\n\n/g, ' ') // Merge paragraphs for the essay feel
            .replace(/、/g, '，') // Softer punctuation
            .replace(/\s+/g, ' ') // Cleanup extra spaces
            .trim();
    },

    /**
     * Generate the Master Script as structured cards.
     * Refactored to return a single, unified narrative card for the "Zong Duan" tab.
     */
    generateCards: function (report) {
        if (!report || !report.bazi) return [{ title: "错误", content: "数据不足，无法生成综断。" }];

        const { bazi, wealth, academic, marriage } = report;
        const pillars = bazi.pillars || [];
        const dm = pillars[2].gan;
        const dayZhi = pillars[2].zhi;

        // 1. Core Calibration (Personality)
        let personalityText = this.data.dm[dm] || "";

        // 2. Inner Core (Day Branch)
        let dayBranchGod = null;
        if (dayZhi && window.HIDDEN_STEMS_MAP && window.HIDDEN_STEMS_MAP[dayZhi]) {
            const primaryStem = window.HIDDEN_STEMS_MAP[dayZhi][0];
            dayBranchGod = window.getTenGod ? window.getTenGod(dm, primaryStem) : null;
        }
        let innerCoreText = (dayBranchGod && this.data.gods[dayBranchGod]) ? this.data.gods[dayBranchGod] : "";

        // 3. Diagnosis (Problem)
        let diagnosisType = 'wealth';
        let problemDesc = "";

        const wBad = wealth?.matchTerms?.some(t => t.type === 'bad' || t.title.includes('无') || t.title.includes('破') || t.title.includes('劫'));
        const wScore = wealth?.totalScore || 0;
        const mBad = marriage?.matchTerms?.some(t => t.type === 'bad' || t.type === 'issue' || t.title.includes('冲') || t.title.includes('合'));

        if (wBad || wScore < 60) {
            diagnosisType = 'wealth';
            const issue = wealth.matchTerms.find(t => t.type === 'bad') || wealth.matchTerms[0];
            problemDesc = `在当下运势中，主要面临的是${issue.title}的问题。${issue.desc}`;
        } else if (mBad) {
            diagnosisType = 'marriage';
            const issue = marriage.matchTerms.find(t => t.type === 'bad' || t.type === 'issue') || marriage.matchTerms[0];
            problemDesc = `感情生活方面目前面临一些波折，主要体现在${issue.title}。${issue.desc}`;
        } else {
            diagnosisType = 'career';
            problemDesc = `事业上虽然整体步调比较稳，但目前缺了点爆发式的增长。按部就班是没问题，但想要在此刻实现大跨越，还需要耐心地等待更佳的时机。`;
        }

        // 4. Divine Judgment (Feng Shui)
        const fsOptions = this.data.fengShui[diagnosisType];
        const fsFact = fsOptions[Math.floor(Math.random() * fsOptions.length)];

        // 5. Synthesis into one cohesive essay
        const rawEssay = `仔细观察你的命局，你给人的初步印象是${personalityText} 这种性格是你骨子里带来的定调，平时可能会有所保留，但在某些特定时刻就会显露无遗。深入你的内心世界，其实还隐藏着更为细腻的一面，这是一种${innerCoreText} 的性格底色。

但是在运势的层面上，我们要关注到目前的卡点所在。从近期的排布来看，${problemDesc} 这就好比“开车忘了松手刹”，即便你再努力加速，阻力依然存在，导致进度不如预期。

更有趣的一点是，这种运势的起伏往往也会在你的居住环境中有微观的投射。不妨留意一下家里，${fsFact} 这类情况往往就是外在磁场的一种显现。不从根源上梳理这些小细节，单纯在外在奔忙可能会事倍功半。`;

        // Strip Jargon and polish
        const cookedEssay = this.stripBaziJargon(rawEssay);

        return [{
            title: "大师综合命局综断",
            content: cookedEssay,
            type: "synthesis"
        }];
    },

    /**
     * Generate structured script library for Tabbed UI.
     * STRICT RULE: Do NOT invent new Bazi judgments. Only use data from 'matchTerms'.
     */
    generateScriptLibrary: function (report) {
        if (!report) return null;

        // Ensure we have pillars (handle both raw 'data' and 'report' formats)
        const pillars = report.pillars || (report.bazi ? report.bazi.pillars : null);
        if (!pillars) return null;

        const dm = pillars[2].gan;

        // Auto-calculate missing pieces using existing global logic
        // We preserve existing results if passed (e.g. from UI) to avoid redundant work
        const bs = report.bodyStrength || (window.calculateBodyStrength ? window.calculateBodyStrength(pillars) : null);
        const prof = report.profile || (bs ? bs.profile : (window.getFiveElementProfile ? window.getFiveElementProfile(pillars) : null));

        const analysisData = { ...report, bodyStrength: bs, profile: prof };
        const dynLuck = (report.currentDaYun || report.selectedLiuNian) ? { daYun: report.currentDaYun, liuNian: report.selectedLiuNian } : null;

        const academic = report.academic || (window.calculateAcademicStatus ? window.calculateAcademicStatus(analysisData, [], dynLuck, report.expertData) : null);
        const wealth = report.wealth || (window.calculateWealthStatus ? window.calculateWealthStatus(analysisData, report.currentDaYun, report.expertData) : null);
        const marriage = report.marriage || (window.calculateMarriageStatus ? window.calculateMarriageStatus(analysisData, dynLuck, report.expertData) : null);

        const lib = {
            opening: [],
            impact: [],   // NEW: For Interactions
            wealth: [],
            marriage: [],
            academic: [],
            career: [],
            sexlife: [],
            children: [],
            legal: [],
            fengshui: []
        };

        const profile = prof; // For internal use in generateScriptLibrary functions

        // Map Node IDs to Readable Status (Moved to function scope for global access)
        const ID_MAP = {
            // Roots
            'Wealth_Root': { Y: '身强', N: '身弱' },
            'Academic_Root': { Y: '开启学业诊断' },

            // A: Self Strong (Isolated Paths)
            'A1_start': { Y: '进入身强求财逻辑' },
            'A1_hasW': { Y: '有财', N: '没财' },
            'A1_strongW': { Y: '财星旺相', N: '财星气弱' },
            'A1_S_Food': { Y: '食神生财', N: '财星无源头' },
            'A1_S_Seal': { Y: '印旺为忌' },
            'A1_S_Break': { Y: '财星坏印' },
            'A1_S_Officer': { Y: '官杀受制' },
            'A1_S_GenOff': { Y: '财旺生官' },
            'A1_W_Food': { Y: '财有源头', N: '财源枯竭' },
            'A1_W_Rob': { Y: '比劫夺财', N: '比劫无侵' },
            'A1_W_Seal': { Y: '忌神印' },
            'A1_W_NoRoot': { Y: '财星透干没根' },
            'A1_W_Officer': { Y: '官杀旺' },
            'A1_W_Damaged': { Y: '财星受损' },
            'A1_now_food': { Y: '查看食伤情况' },
            'A1_now_with_food': { Y: '有食伤' },
            'A1_now_no_food': { Y: '无食伤' },

            // B: Self Weak (Parallel Additive)
            'B_start': { Y: '进入身弱求财逻辑' },
            'B_check_vol': { Y: '财多身弱' },
            'B_check_help': { Y: '印比帮身' },
            'B_check_off': { Y: '官杀受压' },
            'B_check_rob': { Y: '同柱夺财' },
            'B_fallback': { Y: '孤立' },

            // C: Da Yun (Luck Cycles - New Tiered Logic)
            'C_start': { Y: '分析大运趋势' },
            'C_pattern_DoubleW': { Y: '干支双财', N: '非双财运' },
            'C_pattern_DoubleF': { Y: '干支双食', N: '非双食运' },
            'C_pattern_DoubleO': { Y: '干支双官', N: '非双官运' },
            'C_split_branch': { Y: '支神见喜' },
            'C_w_branch': { Y: '地支财运', N: '非财地' },
            'C_t_branch': { Y: '大运财库', N: '非库运' },
            'C_f_branch': { Y: '地支食伤', N: '非食伤地' },
            'C_o_branch': { Y: '地支官杀' },
            'C_w_stem': { Y: '天干财运', N: '非财干' },
            'C_f_stem': { Y: '天干食伤', N: '非食伤干' },
            'C_o_stem': { Y: '天干官杀' },

            // D: Liu Nian
            'D_start': { Y: '分析流年动态' },
            'D_clashTomb': { Y: '冲开财库', N: '未冲库' },
            'D_wealthStrong': { Y: '流年财旺', N: '财不旺' },
            'D_wNoOrder': { Y: '财不得令', N: '财得令' },
            'D_wOrder': { Y: '财气通门户' },
            'D_w_food': { Y: '食伤生财' },
            'D_food': { Y: '流年见食伤', N: '无食伤' },
            'D_WO': { Y: '财官两旺' },

            // --- MARRIAGE TIMING (Unified Tree) ---
            'Time_Root_Presence': { Y: '命中无星', N: '命中有星' },
            'Time_Gender': { Y: '性别判定' },

            'Time_F_YM': { Y: '女命：官杀在年月', N: '女命：官杀在日/时' },
            'Time_F_Palace': { Y: '夫妻宫刑冲', N: '夫妻宫稳固' },
            'Time_F_YM_Zheng': { Y: '年月见正官', N: '年月无正官' },
            'Time_F_YM_Exposed': { Y: '天干透出', N: '地支暗藏' },

            // --- New Hidden Logic Nodes (Female) ---
            'Time_F_Exposed_Palace': { Y: '夫妻宫动摇', N: '夫妻宫稳固' },
            'Time_F_NotExposed_Palace': { Y: '夫妻宫刑冲', N: '夫妻宫稳固' },
            'Time_F_NotExposed_Luck': { Y: '暗处转明', N: '消耗殆尽' },

            'Time_F_YM_Luck': { Y: '早年大运给力', N: '早年大运一般' },

            'Time_F_DH': { Y: '女命：官杀在日/时', N: '入墓库' },
            'Time_F_DH_Stem': { Y: '天干透出', N: '天干不透' },
            'Time_F_Tomb': { Y: '入墓库', N: '缘分势弱' },

            'Time_M_YM': { Y: '男命：财星在年月', N: '男命：财星在日/时' },
            'Time_M_Palace': { Y: '夫妻宫刑冲', N: '夫妻宫稳固' },
            'Time_M_YM_Zheng': { Y: '年月见正财', N: '年月无正财' },
            'Time_M_YM_Exposed': { Y: '天干透出', N: '地支暗藏' },

            // --- New Hidden Logic Nodes (Male) ---
            'Time_M_Exposed_Palace': { Y: '夫妻宫动摇', N: '夫妻宫稳固' },
            'Time_M_NotExposed_Palace': { Y: '夫妻宫刑冲', N: '夫妻宫稳固' },
            'Time_M_NotExposed_Luck': { Y: '暗处转明', N: '消耗殆尽' },

            'Time_M_YM_Luck': { Y: '早年大运给力', N: '早年大运一般' },

            'Time_M_DH': { Y: '男命：财星在日/时', N: '入墓库' },
            'Time_M_DH_Stem': { Y: '天干透出', N: '天干不透' },
            'Time_M_Tomb': { Y: '入墓库', N: '缘分势弱' },

            // --- MARRIAGE RELATION (Parallel - Strict Logic) ---
            'Rel_Happy_Root': { Y: '分析美满度' },
            'Happy_ThreeGods': { Y: '三宝全喜' },
            'Happy_Pure': { Y: '星神纯正' },
            'Happy_DayStar': { Y: '日坐配偶星' },
            'Happy_DayUseful': { Y: '日支喜用' },

            'Rel_Divorce_Root': { Y: '分析离异风险' },
            'Divorce_BiJie': { Y: '日坐比劫' },
            'Divorce_Xing': { Y: '日支相刑' },
            'Divorce_YangRen': { Y: '命带羊刃' },
            'Divorce_YangRen_Gender': { Y: '性别判定?' },

            // --- AFFAIR TREE (Consolidated) ---
            'Affair_Root': { Y: '分析外情风险' },
            'Affair_Stem': { Y: '配偶星干合', N: '天干无合' },
            'Affair_Stem_Gender': { Y: '性别判定?' },
            'Affair_SanHe': { Y: '地支三合', N: '无三合局' },
            'Affair_LiuHe': { Y: '地支六合', N: '无六合' },
            'Affair_AnHe': { Y: '地支暗合', N: '无暗合' },
            'Affair_Peach': { Y: '咸池桃花', N: '无桃花' },
            'Affair_Peach_Loc': { Y: '墙外桃花', N: '墙内桃花' },

            'Rel_Good': { Y: '喜用且稳定' }, // Potential legacy, keep safe
            'Rel_Bad': { Y: '刑冲且受损' },
            'Rel_Peach': { Y: '桃花且杂乱' },

            // --- MARRIAGE STRUCTURE (Quality/Pattern) ---
            'Struct_Root': { Y: '婚姻格局判断?' },
            'Struct_Gender': { Y: '性别?' },
            'Struct_M_Zheng': { Y: '男命：有正财?', N: '男命：无正财' },
            'Struct_M_Zheng_Stem': { Y: '正财透干?', N: '正财藏支' },
            'Struct_M_Pian': { Y: '男命：有偏财?', N: '男命：无偏财' },
            'Struct_M_Pian_Stem': { Y: '偏财透干?', N: '偏财藏支' },
            'Struct_F_Sha': { Y: '女命：有七杀?', N: '女命：无七杀' },
            'Struct_F_Sha_Stem': { Y: '七杀透干?', N: '七杀藏支' },
            'Struct_F_Guan': { Y: '女命：有正官?', N: '女命：无正官' },
            'Struct_F_Guan_Stem': { Y: '正官透干?', N: '正官藏支' },

            // --- TRAITS (New Logic) ---
            'Trait_Root': { Y: '判定性格?' },
            'Trait_Gender': { Y: '性别判定?' },
            'Trait_M_ZhengCai': { Y: '日坐正财且喜用?' },
            'Trait_M_PianCai': { Y: '偏财格局?' },
            'Trait_F_ZhengGuan': { Y: '日坐正官且喜用?' },
            'Trait_F_QiSha': { Y: '七杀格局?' },
            'Trait_Generic': { Y: '通用判定' },

            'Trait_Check': { Y: '日坐比劫?' },
            'Trait_EG': { Y: '日坐食神?' },
            'Trait_SG': { Y: '日坐伤官?' },
            'Trait_W': { Y: '日坐正财?' },
            'Trait_PW': { Y: '日坐偏财?' },
            'Trait_O': { Y: '日坐正官?' },
            'Trait_K': { Y: '日坐七杀?' },
            'Trait_I': { Y: '日坐正印?' },

            // --- SPOUSE CHART (配偶.png) ---
            'App_Root': { Y: '判定颜值?' },

            // --- ACADEMIC TREE (Strict Reconstruction from @[学业.png]) ---
            'Academic_Root': { Y: '开启学业诊断' },
            'A_HasWealth': { Y: '地支有财星', N: '地支无财星' },
            'A_W_HasOfficial': { Y: '地支见官星', N: '地支没官星' },
            'A_W_O_HasSeal': { Y: '地支见印星', N: '地支没印星' },
            'A_W_O_S_AdjCheck': { Y: '财印不战', N: '财印相邻' },
            'A_W_O_NoS_SkySeal': { Y: '时月透印星', N: '时月无印星' },
            'A_W_O_S_SkyO': { Y: '天干透官星', N: '天干无官星' },
            'A_W_O_S_SkyW': { Y: '天干透财星', N: '天干无财星' },
            'A_W_O_S_SkyAdj': { Y: '财官印相生', N: '财官印相邻' },
            'A_W_O_NoS_Clash': { Y: '官星受制', N: '官星有用' },
            'A_W_NoO_S_Adj': { Y: '财印不战', N: '地支财印相邻' },
            'A_NoW_HasSeal': { Y: '原局', N: '原局' },
            'A_NoW_S_SkyS': { Y: '枭神', N: '印星' },
            'A_NoW_S_S_SkyO': { Y: '偏印当权', N: '印星受制' },
            'RebelliousCheck_A': { Y: '杀枭并见', N: '格局纯正' },
            'Academic_ControlCheck': { Y: '杀星受制', N: '无制化' },
            'Academic_DropoutCheck': { Y: '辍学风险', N: '常规格局' },
            'S_Elite_OutputCheck': { Y: '才华加持' },
            'S_Manager_OutputCheck': { Y: '策谋加持' },
            'S_BlackHorse_OutputCheck': { Y: '灵性加持' },
            'S_Foundation_OutputCheck': { Y: '定力加持' },
            'S_Elite_VoidGuard': { Y: '根基空亡', N: '根基稳固' },
            'S_Manager_VoidGuard': { Y: '根基空亡', N: '根基稳固' },
            'S_BlackHorse_VoidGuard': { Y: '根基空亡', N: '根基稳固' },
            'S_Foundation_VoidGuard': { Y: '根基空亡', N: '根基稳固' },
            'S_Wisdom_VoidGuard': { Y: '根基空亡', N: '根基稳固' },
            'res_Elite': { Y: '天之骄子' },
            'res_Disciplined': { Y: '务实自律' },
            'res_BlackHorse': { Y: '半路杀出' },
            'res_CostEffective': { Y: '务实才干' },
            'res_Wisdom': { Y: '大智若愚' },
            'res_Manager': { Y: '管理者模型' },
            'res_Foundation': { Y: '底蕴深厚' },
            'res_Elite_PeiYin': { Y: '溢才智博' },
            'res_Manager_PeiYin': { Y: '策谋博学' },
            'res_BlackHorse_PeiYin': { Y: '才华横溢' },
            'res_Foundation_PeiYin': { Y: '博古通今' },
            'res_Unstable': { Y: '学业起伏' },
            'res_PeiYin': { Y: '食伤配印' },
            'res_PeiYinUnrestrained': { Y: '食伤无制' },
            'res_BrokenSeal': { Y: '贪财坏印' },
            'res_RebelliousGenius': { Y: '奇才变通' },
            'res_DropoutRisk': { Y: '辍学风险' },

            // --- CAREER TREE ---
            'Career_Root': { Y: '分析事业' },
            'Career_Strong_Start': { Y: '身强官杀为用' },
            'Career_Strong_Seal': { Y: '官印相生' },
            'Career_Strong_Food': { Y: '食伤生财' },
            'Career_Strong_NoSeal_Kill': { Y: '食伤制杀' },
            'Career_Strong_BiJie': { Y: '比劫帮身' },
            'Career_Strong_BiJieRob': { Y: '比劫夺财' },
            'Career_Strong_WealthOff': { Y: '财生官' },
            'Career_Strong_PureOff': { Y: '官杀纯正' },
            'Career_Weak_Start': { Y: '身弱官杀' },
            'Career_Weak_Seal': { Y: '印星化杀' },
            'Career_Weak_SealPower': { Y: '印星有力' },
            'Career_NoOff_Start': { Y: '分析无官格局' },
            'Career_NoOff_WealthOff': { Y: '财星生官' },
            'Career_NoOff_WealthStrong': { Y: '身旺财旺' },
            'Career_NoOff_Food': { Y: '食伤泄秀' },
            'Career_NoOff_FoodWealth': { Y: '食伤生财' },

            // --- SEXLIFE TREE ---
            'Sexlife_Root': { Y: '分析性生活' },
            'Sexlife_DB_Start': { Y: '分析日支' },
            'Sexlife_DB_MuYu': { Y: '坐沐浴' },
            'Sexlife_DB_FourFixed': { Y: '坐四正' },
            'Sexlife_DB_Void': { Y: '日支空亡' },
            'Sexlife_DB_Clash': { Y: '日支逢冲' },
            'Sexlife_DB_Combine': { Y: '日支逢合' },
            'Sexlife_Gods_Start': { Y: '分析十神' },
            'Sexlife_Food_Strong': { Y: '食伤旺' },
            'Sexlife_WO_Balance': { Y: '财官平衡' },
            'Sexlife_Xiao_Eat': { Y: '枭神夺食' },
            'Sexlife_BiJie_Strong': { Y: '比劫旺' },

            // --- CHILDREN TREE ---
            'Children_Root': { Y: '分析子女' },
            'Children_Gender': { Y: '性别判定' },
            'Children_M_HasOff': { Y: '男命见官杀' },
            'Children_M_Off_Yong': { Y: '官杀为用' },
            'Children_M_Off_Strong': { Y: '官杀旺相' },
            'Children_M_Off_FoodCont': { Y: '食伤制杀' },
            'Children_M_Off_SealTrans': { Y: '官印相生' },
            'Children_M_NoOff': { Y: '男命无官杀' },
            'Children_F_HasFood': { Y: '女命见食伤' },
            'Children_F_Food_Yong': { Y: '食伤为用' },
            'Children_F_Food_PeiYin': { Y: '伤官配印' },
            'Children_F_Food_Xiao': { Y: '枭神夺食' },
            'Children_F_NoFood': { Y: '女命无食伤' },
            'Children_Palace_Start': { Y: '分析子女宫' },
            'Children_Palace_Yong': { Y: '时柱为用' },
            'Children_Palace_Void': { Y: '子女宫空亡' },

            // --- LEGAL TREE ---
            'Legal_Root': { Y: '分析官非风险' },
            'Legal_Off_Role': { Y: '官杀性质' },
            'Legal_Off_Ji': { Y: '官杀为忌' },
            'Legal_Risk_Start': { Y: '风险判定' },
            'Legal_Risk_FoodKill': { Y: '伤官见官' },
            'Legal_Risk_WealthGen': { Y: '财生官杀' },
            'Legal_ShenSha_Start': { Y: '神煞刑冲' },
            'Legal_LuoWang': { Y: '命中罗网' },
            'Legal_SanXing': { Y: '触发三刑' },

            // --- CAREER TREE NODES ---
            'Career_Strong_Start': { Y: '身强官杀' },
            'Career_Strong_Seal': { Y: '官印相生' },
            'Career_Strong_Food': { Y: '食伤生财' },
            'Career_Strong_NoSeal_Kill': { Y: '食伤制杀' },
            'Career_Strong_BiJie': { Y: '比劫帮身' },
            'Career_Strong_BiJieRob': { Y: '比劫夺财' },
            'Career_Strong_WealthOff': { Y: '财官双美' },
            'Career_Strong_PureOff': { Y: '官星纯正' },
            'Career_Weak_Start': { Y: '身弱官杀' },
            'Career_Weak_Seal': { Y: '印星化杀' },
            'Career_Weak_SealPower': { Y: '印星有力' },
            'Career_Weak_NoSeal_Kill': { Y: '食伤制杀' },
            'Career_Weak_BiJie': { Y: '比劫帮身' },
            'Career_Weak_WealthOff': { Y: '财官相生' },
            'Career_Weak_WealthStrong': { Y: '身弱财旺' },
            'Career_NoOff_Start': { Y: '命中无官杀' },
            'Career_NoOff_WealthOff': { Y: '财星生官' },
            'Career_NoOff_WealthStrong': { Y: '身旺财旺' },
            'Career_NoOff_Seal': { Y: '印星为用' },
            'Career_NoOff_Food': { Y: '食伤泄秀' },
            'Career_NoOff_FoodWealth': { Y: '食伤生财' },

            // --- SEXLIFE TREE NODES ---
            'Sexlife_DB_Start': { Y: '日支状态' },
            'Sexlife_DB_MuYu': { Y: '坐沐浴' },
            'Sexlife_DB_MuYu_Yong': { Y: '沐浴为用' },
            'Sexlife_DB_FourFixed': { Y: '坐子午卯酉' },
            'Sexlife_DB_FourFixed_Yong': { Y: '四正喜用' },
            'Sexlife_DB_Void': { Y: '日支空亡' },
            'Sexlife_DB_Void_Strong': { Y: '身强空亡' },
            'Sexlife_DB_Clash': { Y: '日支逢冲' },
            'Sexlife_DB_Combine': { Y: '日支逢合' },
            'Sexlife_Gods_Start': { Y: '十神组合' },
            'Sexlife_Food_Strong': { Y: '食伤旺' },
            'Sexlife_Food_Yong': { Y: '食伤为用' },
            'Sexlife_Food_GenWealth': { Y: '食伤生财' },
            'Sexlife_WO_Balance': { Y: '财官平衡' },
            'Sexlife_WO_Strong': { Y: '身强平衡' },
            'Sexlife_Xiao_Eat': { Y: '枭神夺食' },
            'Sexlife_Xiao_Restrained': { Y: '有财制枭' },
            'Sexlife_BiJie_Strong': { Y: '比劫旺相' },
            'Sexlife_BiJie_Yong': { Y: '比劫为用' },

            // --- CHILDREN TREE NODES ---
            'Children_M_HasOff': { Y: '男命见官' },
            'Children_M_Off_Yong': { Y: '官杀为用' },
            'Children_M_Off_Strong': { Y: '官杀旺相' },
            'Children_M_Off_FoodCont': { Y: '食伤制杀' },
            'Children_M_Off_SealTrans': { Y: '官印相生' },
            'Children_M_NoOff': { Y: '无官杀' },
            'Children_M_Wealth_Strong': { Y: '财星有力' },
            'Children_F_HasFood': { Y: '女命见子' },
            'Children_F_Food_Yong': { Y: '食伤为用' },
            'Children_F_Food_Strong': { Y: '食伤旺相' },
            'Children_F_Food_PeiYin': { Y: '食伤配印' },
            'Children_F_Food_Xiao': { Y: '枭神夺食' },
            'Children_F_NoFood': { Y: '无食伤' },
            'Children_F_Wealth_Strong': { Y: '财星有力' },
            'Children_Palace_Start': { Y: '子女宫位' },
            'Children_Palace_Yong': { Y: '时柱喜用' },
            'Children_Palace_Void': { Y: '时柱空亡' },

            // --- LEGAL TREE NODES ---
            'Legal_Off_Role': { Y: '官杀性质' },
            'Legal_Off_Ji': { Y: '官杀为忌' },
            'Legal_Seal_Trans': { Y: '官印相生' },
            'Legal_Food_Cont': { Y: '食伤制杀' },
            'Legal_Risk_Start': { Y: '风险判定' },
            'Legal_Risk_FoodKill': { Y: '伤官见官' },
            'Legal_Risk_BiJie': { Y: '比劫抗官' },
            'Legal_Risk_WealthGen': { Y: '财生官杀' },
            'Legal_Risk_WealthGen': { Y: '财生官杀' },
            'Legal_ShenSha_Start': { Y: '神煞与刑冲' },
            'Legal_LuoWang': { Y: '带罗网' },
            'Legal_SanXing': { Y: '带三刑' },
            'Legal_Clash': { Y: '官杀逢冲' },

            // --- RESULT MAPPINGS (for Logic Trace clarity) ---
            'res_Sex_Enjoy': { Y: '乐享共鸣' },
            'res_Sex_Lustful': { Y: '激情旺盛' },
            'res_Sex_Frustrated': { Y: '能量卡点' },
            'res_Sex_Weak': { Y: '底子稍薄' },
            'res_Sex_Harmonious': { Y: '身心合一' },
            'res_Sex_Balanced': { Y: '节奏平稳' },
            'res_Sex_Restrained': { Y: '心态拘谨' },
            'res_Sex_Dominant': { Y: '掌控感强' },

            'res_Child_Prosperous': { Y: '子女缘深' },
            'res_Child_GoodEdu': { Y: '才俊后背' },
            'res_Child_Stubborn': { Y: '性格鲜明' },
            'res_Child_Delayed': { Y: '缘分稍晚' },
            'res_Child_Weak缘': { Y: '缘分淡薄' },

            'res_Legal_Safe': { Y: '奉公守法' },
            'res_Legal_Resolved': { Y: '逢凶化吉' },
            'res_Legal_Dispute': { Y: '口舌是非' },
            'res_Legal_Severe': { Y: '法理警示' },
            'res_Legal_Economic': { Y: '经济纠纷' }
        };

        // 1.1 Unified Personality Essay (The requested "Small Essay") - PRIORITIZED FIRST
        const dayZhi = pillars[2].zhi;
        const godStrengthDetails = (report.expertData && report.expertData.godStrengthDetails) ? report.expertData.godStrengthDetails : (window.AnalysisEngine ? window.AnalysisEngine.getGodStrengthDetails(analysisData) : []);
        const personalityTraces = (report.expertData && report.expertData.decisionResult && report.expertData.decisionResult.personality) ? report.expertData.decisionResult.personality : [];

        let essayContent = this.generateUnifiedPersonalityEssay(dm, dayZhi, godStrengthDetails, personalityTraces);
        essayContent = this.stripBaziJargon(essayContent);

        lib.opening.push({
            title: "大师综合性格剖析 (核心小作文)",
            content: essayContent,
            pureContent: essayContent
        });

        let dayBranchGod = null;
        if (dayZhi && HIDDEN_STEMS_MAP[dayZhi]) {
            const primaryStem = HIDDEN_STEMS_MAP[dayZhi][0];
            dayBranchGod = getTenGod(dm, primaryStem);
        }

        // 1.2 Summary moved to Impact to avoid breaking the personality narrative flow
        if (report.expertData && report.expertData.summary) {
            const cleanSummary = this.stripBaziJargon(report.expertData.summary);
            if (cleanSummary && cleanSummary !== '：。') {
                lib.impact.unshift({
                    title: "互动总论",
                    content: `从全局能量互动的角度来看：${cleanSummary}`,
                    pureContent: cleanSummary
                });
            }
        }

        // 1.3 Interactions (Interactions - extracted from natalParts/suiYunParts)
        if (report.expertData && report.expertData.natalParts) {
            report.expertData.natalParts.forEach(p => {
                const cleanP = this.stripBaziJargon(p);
                if (cleanP) {
                    lib.impact.push({
                        title: "先天局：磁场互动",
                        content: cleanP,
                        pureContent: cleanP
                    });
                }
            });
        }
        if (report.expertData && report.expertData.suiYunParts) {
            report.expertData.suiYunParts.forEach(p => {
                const cleanP = this.stripBaziJargon(p);
                if (cleanP) {
                    lib.impact.push({
                        title: "岁运：动态交互",
                        content: cleanP,
                        pureContent: cleanP
                    });
                }
            });
        }

        // 1.3 Inner Core (Day Branch Personality) - Simplified template
        if (dayBranchGod && this.data.gods[dayBranchGod]) {
            lib.opening.push({
                title: "内心潜意识底色",
                content: `深入来看，你的内心深处其实藏着更细腻的一面。在最真实的状态下，你展现出的是一种${this.stripBaziJargon(this.data.gods[dayBranchGod])}`,
                type: "cali"
            });
        }

        // 1.4 Day Master Personality - Simplified template
        if (this.data.dm[dm]) {
            lib.opening.push({
                title: `能量底色 (日元${dm})`,
                content: `我看你这张盘，天生的能量底子是${this.stripBaziJargon(this.data.dm[dm])}\n\n这种性格是你骨子里的东西，平时为了生活可能收敛着，但关键时刻就冒出来了。`
            });
        }


        const yearStem = pillars[0].gan;
        const hourStem = pillars[3].gan;
        const isUnknown = report.isUnknownHour || (report.bazi && report.bazi.isUnknownHour);
        if (yearStem && hourStem && yearStem === hourStem && !isUnknown) {
            const hGod = pillars[3].tenGod;
            if (hGod && this.data.hanging[hGod]) {
                lib.opening.push({
                    title: "特殊格局：两头挂",
                    content: `你这命局有个特殊的象，叫“两头挂”。\n${this.data.hanging[hGod]}\n这就是所谓的“年时同干”，对命局力量感应很大。`
                });
            }
        }

        // 1.4 Detailed Health/Diseases Analysis
        if (profile) {
            // Strong/Weak Elemental Health
            profile.forEach(p => {
                const status = (p.isStrong || p.score > 40) ? '旺' : (p.score < 10 ? '弱' : null);
                if (status && this.data.healthDetailed[p.element]) {
                    lib.opening.push({
                        title: `机能关注 (${p.element}${status})`,
                        content: `身体上要注意，${p.element}${status}成病。${this.data.healthDetailed[p.element][status]}`
                    });
                }
            });

            // Elemental Interactions (Clashes/Exhaustion)
            const scores = {};
            profile.forEach(p => scores[p.element] = p.score);

            const interactions = [
                { type: '金克木', s: '金', t: '木' },
                { type: '火克金', s: '火', t: '金' },
                { type: '水克火', s: '水', t: '火' },
                { type: '土克水', s: '土', t: '水' },
                { type: '木克土', s: '木', t: '土' },
                { type: '火泄木', s: '火', t: '木', ratio: 2.5 },
                { type: '土泄火', s: '土', t: '火', ratio: 2.5 },
                { type: '金泄土', s: '金', t: '土', ratio: 2.5 },
                { type: '水泄金', s: '水', t: '金', ratio: 2.5 },
                { type: '木泄水', s: '木', t: '水', ratio: 2.5 }
            ];

            interactions.forEach(inter => {
                const sScore = scores[inter.s] || 0;
                const tScore = scores[inter.t] || 0;
                let trigger = false;
                if (inter.ratio) {
                    if (sScore > 35 && tScore < 15 && sScore > tScore * inter.ratio) trigger = true;
                } else {
                    if (sScore > 35 && tScore < 15) trigger = true;
                }

                if (trigger && this.data.healthInteractions[inter.type]) {
                    lib.opening.push({
                        title: `健康警示：${inter.type}`,
                        content: `${this.data.healthInteractions[inter.type]}`
                    });
                }
            });
        }

        // --- 2. Wealth Scripts (Use matchTerms ONLY) ---
        // [User Request] Prioritize Decision Tree Result
        if (report.expertData && report.expertData.decisionResult) {
            const dtData = report.expertData.decisionResult;
            // Handle both new array format and potential legacy single object
            const results = dtData.results || (dtData.result ? [dtData.result] : []);

            // Parse Trace for Logic Path
            const trace = dtData.trace || [];

            // Build logical chain from Trace
            const baseChain = [];
            const luckChain = [];

            trace.forEach(step => {
                const map = ID_MAP[step.id];
                if (map) {
                    const label = step.decision ? map.Y : map.N;
                    if (label) {
                        // Classify as Base or Luck based on Node ID prefix
                        if (step.id.startsWith('C_') || step.id.startsWith('D_')) {
                            luckChain.push(label);
                        } else {
                            baseChain.push(label);
                        }
                    }
                }
            });

            // Remove duplicates
            const uniqueBase = [...new Set(baseChain)];
            const uniqueLuck = [...new Set(luckChain)];
            results.forEach((dtRes, idx) => {
                // Extract base title "背靠大树 (印比帮身)" -> "背靠大树"
                const rawTitle = dtRes.title || '';
                const baseTitle = rawTitle.includes(' (') ? rawTitle.split(' (')[0] : rawTitle;
                const tag = dtRes.tags && dtRes.tags.length > 0 ? dtRes.tags[0] : '';

                // Determine Branch Group from Result ID (e.g. 'res_A1_Ent' -> 'A1')
                const resId = dtRes.id || '';

                // --- MARRIAGE SEPARATION ---
                if (resId.startsWith('res_Trait_') || resId.startsWith('res_App_') || resId.startsWith('res_Time_') || resId.startsWith('res_Rel_')) {
                    // Extract tree prefix (Time_, Rel_, Trait_, or App_)
                    let treePrefix = '';
                    if (resId.startsWith('res_Time_')) treePrefix = 'Time_';
                    else if (resId.startsWith('res_Rel_')) treePrefix = 'Rel_';
                    else if (resId.startsWith('res_Trait_')) treePrefix = 'Trait_';
                    else if (resId.startsWith('res_App_')) treePrefix = 'App_';

                    // Build Marriage chain (Standard ID Mapping for 3 Trees)
                    const mChain = [];
                    trace.forEach(step => {
                        // Crucial: Only include nodes that belong to THIS logical tree
                        if (step.id.startsWith(treePrefix)) {
                            const map = ID_MAP[step.id];
                            if (map) {
                                const label = step.decision ? map.Y : map.N;
                                if (label) mChain.push(label);
                            } else if (step.text) {
                                // Fallback to literal text if no ID_MAP entry
                                mChain.push(step.text);
                            }
                        }
                    });
                    const mPathStr = [...new Set(mChain)].join(' -> ');
                    /*
                    lib.marriage.push({
                        title: `🔮 大师终极定论: ${dtRes.title}${mPathStr ? ` (${mPathStr})` : ''}`,
                        content: dtRes.desc,
                        pureContent: dtRes.desc
                    });
                    */
                    return; // Skip Wealth processing
                }

                // --- ACADEMIC SEPARATION ---
                if (dtRes._specificTrace && dtRes._specificTrace.some(t => t.category === 'academic')) {
                    // Handled in dedicated academic section later
                    return;
                }

                let group = '';
                if (resId.includes('_A1_')) group = 'A1';
                else if (resId.includes('_A2_')) group = 'A2';
                else if (resId.includes('_A3_')) group = 'A3';
                else if (resId.includes('_B')) group = 'B';
                else if (resId.includes('_C_')) group = 'C';
                else if (resId.includes('_D_')) group = 'D';

                // Robust Luck Detection: ID or Content
                const isLuckResult = (group === 'C' || group === 'D') ||
                    (dtRes.title.includes('大运') || dtRes.title.includes('流年') ||
                        (tag && (tag.includes('大运') || tag.includes('流年'))));

                let validIds = [];
                // Build Chain based on Group
                if (isLuckResult) {
                    // STRICT LUCK FILTER WITH SUB-GROUPS
                    // We need to determine WHICH C-branch this result belongs to.
                    // C1: Wealth (Exposed, Hidden, Boom)
                    // C2: Food (Fame, Skill, Cash)
                    // C3: Tomb (TombOpen, TombStore)
                    // C4: Officer (Rank, Power, Risk)

                    let luckType = 'generic';
                    if (resId.includes('_Boom') || resId.includes('_Exposed') || resId.includes('_Hidden')) luckType = 'wealth';
                    else if (resId.includes('_Fame') || resId.includes('_Skill') || resId.includes('_Cash')) luckType = 'food';
                    else if (resId.includes('_Tomb')) luckType = 'tomb';
                    else if (resId.includes('_Rank') || resId.includes('_Power') || resId.includes('_Risk')) luckType = 'officer';

                    validIds = trace.filter(s => {
                        const id = s.id.toUpperCase();
                        if (id.startsWith('D')) return true; // Keep Liu Nian for context
                        if (!id.startsWith('C')) return false; // Filter out A/B/Root

                        if (luckType === 'wealth') return id.startsWith('C_W') || id.includes('DOUBLEW');
                        if (luckType === 'food') return id.startsWith('C_F') || id.includes('DOUBLEF');
                        if (luckType === 'tomb') return id.startsWith('C_T');
                        if (luckType === 'officer') return id.startsWith('C_O') || id.includes('DOUBLEO');

                        return true;
                    }).map(s => s.id);

                    // Refined Filter: Allow D-prefix for all categories
                    if (luckType !== 'generic') {
                        validIds = validIds.filter(id => {
                            const uid = id.toUpperCase();
                            if (uid.startsWith('D')) return true;
                            if (luckType === 'wealth') return uid.startsWith('C_W') || uid.includes('DOUBLEW') || uid.includes('_W');
                            if (luckType === 'food') return uid.startsWith('C_F') || uid.includes('DOUBLEF') || uid.includes('_F');
                            if (luckType === 'tomb') return uid.startsWith('C_T') || uid.includes('_T');
                            if (luckType === 'officer') return uid.startsWith('C_O') || uid.includes('DOUBLEO') || uid.includes('_O');
                            return true;
                        });
                    }

                } else {
                    // For Base, strict filtering (Root + Group)
                    // For Base, show all relevant steps for the group (A or B)
                    validIds = trace.filter(s => {
                        if (s.id === 'Wealth_Root') return true;

                        // If it's an 'A' group result (A1, A2, or A3), show all 'A' related steps
                        if (['A1', 'A2', 'A3'].includes(group)) {
                            return s.id.startsWith('A');
                        }

                        // If it's a 'B' group result, show 'B' related steps
                        if (group === 'B') return s.id.startsWith('B');

                        // Fallback: If group is unknown for a Base Result, show all non-Luck steps
                        if (!group) return !s.id.startsWith('C') && !s.id.startsWith('D');

                        return s.id.startsWith(group);
                    }).map(s => s.id);
                }

                // Construct logical chain from filtered IDs
                const chain = [];
                trace.forEach(step => {
                    if (validIds.includes(step.id)) {
                        const map = ID_MAP[step.id];
                        if (map) {
                            const label = step.decision ? map.Y : map.N;
                            if (label) chain.push(label);
                        } else if (step.text) {
                            // Professional Fallback: Use literal text from tree node
                            chain.push(step.text);
                        }
                    }
                });

                const uniquePath = [...new Set(chain)];

                // Ensure tag is involved
                if (tag && !uniquePath.includes(tag)) uniquePath.push(tag);

                const pathStr = uniquePath.join(' -> ');
                let desc = dtRes.desc;
                if (pathStr) {
                    desc += `\n\n> [!NOTE]\n> **逻辑溯源**：${pathStr}`;
                }

                /*
                lib.wealth.push({
                    title: `🔮 大师终极定论${results.length > 1 ? (' ' + (idx + 1)) : ''}: ${baseTitle}`,
                    content: desc, // Verbatim copy for UI
                    pureContent: dtRes.desc // Pure assertion for copy
                });
                */
            });
        }

        // --- 2.5 Bridge: Logic Tree to Master Narrative ---
        // [User Request] Use the "Tree" for logic/path, but keep the "Master" (Pattern) for the conclusion (narrative).
        const pResults = (report.expertData && report.expertData.patternResults) || report.patternResults || [];

        // Mapping Decision Tree Result IDs to Master Pattern IDs
        const TREE_TO_PATTERN = {
            // Academic (A)
            'res_Elite': ['A_P_Elite_Stem', 'A_P_Elite_Output_Stem', 'A_P_Top_Tier'],
            'res_Disciplined': ['A_P_Foundation_Branch', 'A_P_Hardworking'],
            'res_BlackHorse': ['A_P_Luck_Boost'],
            'res_DropoutRisk': ['A_P_Dropout'],
            'res_HighAchieverRebellion': ['A_P_Smart', 'A_P_Elite_Output_Stem'],
            'res_BrokenSeal': ['A_P_Block', 'A_P_Pressure'],
            'res_PressureAcademic': ['A_P_Pressure'],
            'res_PeiYin': ['A_P_Smart', 'A_P_Speech'],
            'res_RebelliousGenius': ['A_P_Smart', 'A_P_Dropout'],
            'res_Elite_PeiYin': ['A_P_Elite_Stem', 'A_P_Smart'],
            'res_Manager_PeiYin': ['A_P_Official_Path', 'A_P_Smart'],
            'res_Unstable': ['A_P_Pressure'],

            // Wealth (W)
            'res_A1_Ent': ['W_P_Entrepreneur', 'W_P_Rich_Noble'],
            'res_A1_Rich_Noble': ['W_P_Rich_Noble'],
            'res_A1_Status': ['W_P_Status_Over_Wealth'],
            'res_A1_LabS': ['W_P_Labor_Hard'],
            'res_A1_LabW': ['W_P_Labor_Hard'],
            'res_A1_Sto': ['W_P_Skill_Wealth'],
            'res_A1_Rob': ['W_P_Moonlight'],
            'res_A1_Tal': ['W_P_No_Source'],
            'res_A1_Lab2': ['W_P_Labor_Hard'],
            'res_A2_Sup': ['W_P_Supporting'],
            'res_A3_Power': ['W_P_Borrow_Power'],
            'res_A3_Break': ['W_P_Breakthrough'],
            'res_A3_Burden': ['W_P_Burden'],
            'res_B_Rob': ['W_P_Moonlight', 'W_P_Same_Pillar_Rob'],
            'res_B_Moonlight': ['W_P_Moonlight'],
            'res_B_NoSource': ['W_P_No_Source'],
            'res_B_Burden': ['W_P_Burden'],
            'res_B_RichPoor': ['W_P_Rich_Poor'],
            'res_C_Boom': ['W_P_Rich_Noble', 'W_P_Entrepreneur'],
            'res_C_Hidden': ['W_P_Secret_Wealth'],
            'res_C_Exposed': ['W_P_Status_Over_Wealth'],

            // Marriage (Time: Time_, Relationship: Rel_, Trait: Trait_, Appearance: App_)
            'res_Time_Early_A': ['M_P_Early'],
            'res_Time_Early_B': ['M_P_Early', 'M_P_Unstable_Base'],
            'res_Time_Late_A': ['M_P_Late'],
            'res_Time_Late_Tomb': ['M_P_Late'],
            'res_Rel_Happy_Old': ['M_P_Happy_Old'],
            'res_Rel_Happy_Iron': ['M_P_Happy_Old', 'M_P_Helpful_Spouse'],
            'res_Rel_Happy_CFO': ['M_P_Helpful_Spouse'],
            'res_Rel_Divorce': ['M_P_Divorce_Risk'],
            'res_Rel_BiJie': ['M_P_Unstable_Base'],
            'res_Rel_YangRen_M': ['M_P_Strong_Spouse'],
            'res_Rel_YangRen_F': ['M_P_Strong_Spouse'],
            'res_Rel_Combine_M': ['M_P_Affair_Risk'],
            'res_Rel_Combine_F': ['M_P_Affair_Risk'],
            'res_Rel_AnHe': ['M_P_Affair_Risk'],
            'res_Rel_Peach_Hour': ['M_P_Affair_Risk'],
            'res_Trait_Husband_ZG_Good': ['M_P_Helpful_Spouse', 'M_T_Gentle'],
            'res_Trait_Wife_ZC_Good': ['M_P_Helpful_Spouse', 'M_T_Reliable'],
            'res_App_Good': ['M_A_Beauty'],
            'res_App_Ordinary': ['M_A_Solid'],

            // Career (Career_)
            'res_Career_Elite': ['A_P_Official_Path', 'A_P_Elite_Stem'],
            'res_Career_Stable': ['A_P_Foundation_Branch'],
            'res_Career_Manager': ['A_P_Top_Tier'],
            'res_Career_Stuck': ['A_P_Pressure'],
            'res_Career_Ent': ['W_P_Entrepreneur'],
            'res_Career_Wealthy': ['W_P_Rich_Noble'],
            'res_Career_Pure': ['W_P_Status_Over_Wealth'],
            'res_Career_Confused': ['A_P_Pressure'],
            'res_Career_Tech': ['A_P_Smart'],
            'res_Career_Solo': ['W_P_Entrepreneur', 'W_P_Rich_Noble'],

            // Sexlife (Sex_)
            'res_Sex_Enjoy': ['A_P_Smart'],
            'res_Sex_Lustful': ['A_P_Luck_Boost'],
            'res_Sex_Frustrated': ['A_P_Block'],
            'res_Sex_Weak': ['W_P_Labor_Hard'],
            'res_Sex_Harmonious': ['A_P_Top_Tier'],
            'res_Sex_Balanced': ['M_P_Happy_Old'],
            'res_Sex_Restrained': ['A_P_Pressure'],
            'res_Sex_Dominant': ['A_P_Official_Path'],

            // Children (Child_)
            'res_Child_Prosperous': ['M_P_Happy_Old'],
            'res_Child_GoodEdu': ['A_P_Elite_Stem'],
            'res_Child_Stubborn': ['A_P_Pressure'],
            'res_Child_Delayed': ['M_P_Late'],
            'res_Child_Weak缘': ['A_P_Pressure'],

            // Legal (Legal_)
            'res_Legal_Safe': ['M_P_Happy_Old'],
            'res_Legal_Resolved': ['A_P_Luck_Boost'],
            'res_Legal_Dispute': ['A_P_Pressure'],
            'res_Legal_Severe': ['A_P_Block', 'A_P_Pressure'],
            'res_Legal_Economic': ['W_P_Rich_Poor']
        };

        if (report.expertData && report.expertData.decisionResult) {
            const dtData = report.expertData.decisionResult;
            const results = dtData.results || [];
            const trace = dtData.trace || [];

            // Buffer for Partner Attributes
            const partnerAttributes = [];

            results.forEach((res) => {
                const resId = res.id;
                const idLower = resId.toLowerCase();
                const stepId_main = (res._specificTrace && res._specificTrace.length > 0) ? res._specificTrace[0].id : (trace.length > 0 ? trace[0].id : '');

                // 1. Identify Target Category
                let targetCat = 'wealth';
                if (resId.startsWith('res_Career') || idLower.includes('career') || (stepId_main.includes('Career') && !resId.startsWith('res_A'))) {
                    targetCat = 'career';
                } else if (resId.startsWith('res_Sex') || idLower.includes('sex') || stepId_main.includes('Sex')) {
                    targetCat = 'sexlife';
                } else if (resId.startsWith('res_Child') || idLower.includes('child') || stepId_main.includes('Children')) {
                    targetCat = 'children';
                } else if (resId.startsWith('res_Legal') || idLower.includes('legal') || stepId_main.includes('Legal')) {
                    targetCat = 'legal';
                } else if (resId.startsWith('res_Rel') || resId.startsWith('res_Time') || resId.startsWith('res_Trait') ||
                    resId.startsWith('res_App') || idLower.includes('marriage') || stepId_main.includes('Marriage')) {
                    targetCat = 'marriage';
                } else if (idLower.includes('academic') || idLower.includes('elite') || idLower.includes('disciplined') ||
                    idLower.includes('horse') || idLower.includes('wisdom') || idLower.includes('manager') ||
                    idLower.includes('foundation') || idLower.includes('pei') || idLower.includes('rebellious') ||
                    idLower.includes('rebellion') || idLower.includes('achiever') || idLower.includes('dropout') || stepId_main.includes('Academic')) {
                    targetCat = 'academic';
                } else if (resId.startsWith('res_A') || resId.startsWith('res_B') || resId.startsWith('res_C') || resId.startsWith('res_D') || idLower.includes('wealth')) {
                    targetCat = 'wealth';
                }

                // 2. Construct Logic Path Breadcrumbs from Tree Trace
                const chain = [];
                // Use specific category trace if available to avoid pollution from other trees
                const currentTrace = res._specificTrace || trace || [];

                currentTrace.forEach(step => {
                    const map = ID_MAP[step.id];
                    if (map) {
                        const label = step.decision ? map.Y : map.N;
                        if (label) {
                            let isRelevant = false;
                            const stepId = step.id;

                            // 1. TRUST SPECIFIC CATEGORY MARK (MODERN)
                            if (step.category && step.category === targetCat) {
                                isRelevant = true;
                            } else {
                                // 2. Category-based Trace Filtering (FALLBACK)
                                if (resId.startsWith('res_A') && (stepId.startsWith('A') || stepId === 'Academic_Root')) isRelevant = true;
                                else if (resId.startsWith('res_B') && (stepId.startsWith('B') || stepId === 'Wealth_Root')) isRelevant = true;
                                else if (resId.startsWith('res_C') && (stepId.startsWith('C') || stepId === 'Luck_Root')) isRelevant = true;
                                else if (resId.startsWith('res_D') && (stepId.startsWith('D') || stepId === 'LiuNian_Root')) isRelevant = true;
                                else if (resId.startsWith('res_Rel') && stepId.startsWith('Rel_')) isRelevant = true;
                                else if (resId.startsWith('res_Time') && stepId.startsWith('Time_')) isRelevant = true;
                                else if (resId.startsWith('res_Trait') && (stepId.startsWith('Trait_') || stepId === 'Trait_Root')) isRelevant = true;
                                else if (resId.startsWith('res_App') && stepId.startsWith('App_')) isRelevant = true;
                                else if (resId.startsWith('res_Career') && (stepId.startsWith('Career_') || stepId === 'Career_Root')) isRelevant = true;
                                else if (resId.startsWith('res_Sex') && (stepId.startsWith('Sexlife_') || stepId === 'Sexlife_Root')) isRelevant = true;
                                else if (resId.startsWith('res_Child') && (stepId.startsWith('Children_') || stepId === 'Children_Root')) isRelevant = true;
                                else if (resId.startsWith('res_Legal') && (stepId.startsWith('Legal_') || stepId === 'Legal_Root')) isRelevant = true;
                                else if (targetCat === 'academic') {
                                    if (stepId.startsWith('A') || stepId.includes('Academic') || stepId === 'Academic_Root' || stepId.includes('Elite') || stepId.includes('Rebellious') || stepId.startsWith('S_')) isRelevant = true;
                                }
                                else if (stepId.includes('Root') && stepId.toLowerCase().includes(targetCat)) isRelevant = true;
                            }

                            if (isRelevant) chain.push(label);
                        }
                    }
                });
                const pathStr = [...new Set(chain)].join(' -> ');

                // 3. Narrative Selection: Master's Narrative Preferred
                let finalNarrative = res.desc;
                const mappedPatternIds = TREE_TO_PATTERN[res.id] || [];
                const pattern = pResults.find(p => mappedPatternIds.includes(p.id));
                if (pattern) {
                    finalNarrative = pattern.narrative || pattern.desc;
                }

                // Intercept Trait/App for Merging
                if (resId.startsWith('res_Trait') || resId.startsWith('res_App')) {
                    partnerAttributes.push({
                        text: finalNarrative,
                        tags: res.tags || (pattern ? pattern.tags : []),
                        path: pathStr
                    });
                    return; // Skip standard addition
                }

                // Prepend Expert Summary if available (Master's synthesized logic)
                const expertSummary = (report.expertData && report.expertData.summary) || '';
                const isAcad = idLower.includes('academic') || idLower.includes('elite') || idLower.includes('disciplined') ||
                    idLower.includes('horse') || idLower.includes('wisdom') || idLower.includes('manager') ||
                    idLower.includes('foundation') || idLower.includes('pei') || idLower.includes('rebellious') ||
                    idLower.includes('dropout');
                const isWealth = res.id.startsWith('res_A') || res.id.startsWith('res_B') || res.id.startsWith('res_C') || res.id.startsWith('res_D') || idLower.includes('wealth');
                const isMarr = res.id.startsWith('res_Rel') || res.id.startsWith('res_Time') || res.id.startsWith('res_Trait') || idLower.includes('marriage');
                const isCareer = res.id.startsWith('res_Career') || idLower.includes('career');
                const isSex = res.id.startsWith('res_Sex') || idLower.includes('sex');
                const isChild = res.id.startsWith('res_Child') || idLower.includes('child');
                const isLegal = res.id.startsWith('res_Legal') || idLower.includes('legal');

                // Removed repetitive expertSummary injection logic


                // 4. Update Synthesis Library
                if (lib[targetCat]) {
                    const cleanNarrative = this.stripBaziJargon(finalNarrative);
                    const displayContent = `${cleanNarrative}\n\n> [!NOTE]\n> **逻辑溯源**：${pathStr || '综合判定'}`;
                    lib[targetCat].unshift({
                        title: `🔮 大师终极定论: ${res.title}`,
                        content: displayContent,
                        pureContent: cleanNarrative,
                        tags: res.tags || (pattern ? pattern.tags : [])
                    });
                }
            });

            // Post-process partner attributes (Merge Logic)
            if (partnerAttributes.length > 0) {
                const combinedText = partnerAttributes.map(p => p.text).join('\n\n');
                const combinedPaths = partnerAttributes.map(p => p.path).filter(p => p).join(' + ');
                const combinedTags = [...new Set(partnerAttributes.flatMap(p => p.tags))];

                lib.marriage.unshift({
                    title: "🔮 大师终极定论: 另一半画像 (综合)",
                    content: `${combinedText}\n\n> [!NOTE]\n> **定论溯源（逻辑路径）**：${combinedPaths || '综合判定'}`,
                    pureContent: combinedText,
                    tags: combinedTags
                });
            }
        }

        if (lib.wealth.length === 0) {
            lib.wealth.push({ title: "无明显财运断语", content: "暂无特定财运断语。" });
        }

        // --- 3. Marriage & Results (Handled in Bridge now, but keep extra tools) ---
        if (marriage && marriage.futureYears && marriage.futureYears.length > 0) {
            const timingList = marriage.futureYears.slice(0, 5).map(y => `- ${y.year}(${y.ganZhi}): ${y.reason}`).join('\n');
            lib.marriage.push({
                title: "近期红鸾/动婚机会",
                content: `我看了一下，近期在这些年份容易遇到心动的缘分或有动婚机会：\n${timingList}\n\n注意：这只是流年的机会点，具体还要看两人的合婚和您自己的把握程度。`
            });
        }

        if (lib.marriage.length === 0) {
            lib.marriage.push({ title: "无明显婚姻断语", content: "暂无特定婚姻断语。" });
        }

        if (lib.academic.length === 0) {
            lib.academic.push({ title: "无明显学业断语", content: "暂无特定学业断语。" });
        }

        if (lib.career.length === 0) {
            lib.career.push({
                title: "事业模块筹备中",
                content: "当前系统主要侧重基础分析。更深入的事业转型、职业规划模块正在持续开发中。"
            });
        }

        if (lib.sexlife.length === 0) {
            lib.sexlife.push({ title: "无明显感情断语", content: "暂无特定感情断语。" });
        }

        if (lib.children.length === 0) {
            lib.children.push({ title: "无明显子女断语", content: "暂无特定子女断语。" });
        }

        if (lib.legal.length === 0) {
            lib.legal.push({ title: "无明显官非断语", content: "暂无特定官非断语。" });
        }

        // --- 5. Feng Shui (Master Diagnosis Interpretation) ---
        // New Logic: Use specialized generateFengShuiAnalysis (South-on-Top)
        const fsEnvironment = this.generateFengShuiAnalysis(pillars);
        fsEnvironment.forEach(item => {
            lib.fengshui.push({ title: item.title, content: item.content, pureContent: item.content });
        });

        return lib;
    },

    /**
     * Woven Narrative: Combines individual snippets into a cohesive story.
     * @param {Object} lib The categorized narrative library.
     */
    generateHoroscopeNarrative(lib) {
        let story = "";

        // 1. Opening / Character
        if (lib.opening && lib.opening.length > 0) {
            story += "### 🌟 能量底色与性格剖析\n";
            story += lib.opening.map(i => i.pureContent || i.content).join("\n\n") + "\n\n";
        }

        // 2. Career & Wealth (The Material Journey)
        if ((lib.career && lib.career.length > 0) || (lib.wealth && lib.wealth.length > 0)) {
            story += "### 🚀 世俗征途：事业与财富的共振\n";
            if (lib.career && lib.career.length > 0) {
                story += "在职场与社会价值的探索中，" + lib.career.map(i => this.stripBaziJargon(i.pureContent || i.content)).join(" ") + "\n\n";
            }
            if (lib.wealth && lib.wealth.length > 0) {
                story += "这种职业状态也直接映射到了您的财富坐标上，" + lib.wealth.map(i => this.stripBaziJargon(i.pureContent || i.content)).join(" ") + "\n\n";
            }
        }

        // 3. Marriage & Sex Life (The Emotional Port)
        if ((lib.marriage && lib.marriage.length > 0) || (lib.sexlife && lib.sexlife.length > 0)) {
            story += "### 💑 情感归宿：亲密关系的律动\n";
            if (lib.marriage && lib.marriage.length > 0) {
                story += "回到私人领域，您的情感世界呈现出这样的细腻脉络：" + lib.marriage.map(i => this.stripBaziJargon(i.pureContent || i.content)).join(" ") + "\n\n";
            }
            if (lib.sexlife && lib.sexlife.length > 0) {
                story += "而在这份连接中，更深层的共鸣体现在：" + lib.sexlife.map(i => this.stripBaziJargon(i.pureContent || i.content)).join(" ") + "\n\n";
            }
        }

        if ((lib.academic && lib.academic.length > 0) || (lib.children && lib.children.length > 0)) {
            story += "### 🎓 生命延伸：智慧与下一代的连接\n";
            if (lib.academic && lib.academic.length > 0) {
                story += "在智慧的积累与学业的进阶路途，" + lib.academic.map(i => this.stripBaziJargon(i.pureContent || i.content)).join(" ") + "\n\n";
            }
            if (lib.children && lib.children.length > 0) {
                story += "关于下一代或者是您生命中能量的延续，" + lib.children.map(i => this.stripBaziJargon(i.pureContent || i.content)).join(" ") + "\n\n";
            }
        }

        // 4. Energy Impact (Interactions)
        if (lib.impact && lib.impact.length > 0) {
            story += "### ⚡ 能量交互：磁场的微妙动态\n";
            story += "在具体的能量互动层面，您的局中呈现出：" + lib.impact.map(i => this.stripBaziJargon(i.pureContent || i.content)).join(" ") + "。这些细微的能量牵引，往往会在不经意间影响您的决策与感知。\n\n";
        }

        // 5. Legal & Safety (The Boundary)
        if (lib.legal && lib.legal.length > 0) {
            story += "### ⚖️ 风险预警：法理与规则的边界\n";
            story += "最后，在与社会规则的互动中，建议您关注：" + lib.legal.map(i => this.stripBaziJargon(i.pureContent || i.content)).join(" ") + "\n\n";
        }

        // 6. Feng Shui & Advice
        if (lib.fengshui && lib.fengshui.length > 0) {
            story += "### 🔮 趋吉避凶：环境与能量的调和\n";
            story += lib.fengshui.map(i => this.stripBaziJargon(i.pureContent || i.content)).join("\n\n") + "\n\n";
        }

        if (!story) {
            story = "正在汇聚能量中，请确保已在决策树中选择相关判定节点。";
        }

        return story;
    },

    /**
     * Synthesize a cohesive personality essay.
     * Combines DM, Day Branch Base, and Ten God Dynamics (Positive/Negative).
     * Style: Professional "Master" narrative, avoiding dry technical labels.
     */
    generateUnifiedPersonalityEssay(dm, dayZhi, godStrengths, personalityTraces = []) {
        if (!godStrengths || godStrengths.length === 0) return "性格稳重，平衡中和。";

        const vividExamples = {
            '正官': {
                positive: "你是那种特别守规矩的人，比如在单位里，哪怕没人监督，你也会按部就班把活干完，是领导最放心的‘压舱石’。",
                negative: "有时候显得太死板了，认死理。比如朋友开个玩笑，你可能觉得不合体统而较真，让气氛稍微有点尴尬。"
            },
            '七杀': {
                positive: "做事雷厉风行，执行力极强。比如有个紧急项目，别人还在犹豫，你已经带头冲上去了，特别有那种‘富贵险中求’的胆气。",
                negative: "脾气上来的时候挺吓人的，容易跟人硬刚。有时候还会莫名其妙地焦虑，总觉得周围有人在针对自己。"
            },
            '正印': {
                positive: "特别慈悲心软，看到路边流浪猫狗都想帮一把。在家里或朋友圈里，你常扮演那个‘听众’和‘安慰者’的角色。",
                negative: "有时候太依赖别人的肯定了，缺乏点独立决断的魄力。遇到难事，第一反应往往是想找个信任的人靠一靠。"
            },
            '偏印': {
                positive: "脑子转得飞快，总能想到一些奇奇怪怪的点子。比如大家都在走老路，你一眼就能发现别人看不见的‘捷径’。",
                negative: "容易钻牛角尖，性格有点孤僻。有时候别人请你参加聚会，明明心里想去，嘴上却冷冰冰地拒绝，把自己搞得挺孤独。"
            },
            '正财': {
                positive: "过日子特别踏实，精打细算。比如买大件商品，你会货比三家，每一分钱都花在刀刃上，这种稳定感让家里人很安心。",
                negative: "有时候太注重眼前利益了，格局小了点。容易为了一点蝇头小利跟人计较，反而可能错失更大的机会。"
            },
            '偏财': {
                positive: "为人特别豪爽，朋友聚会抢着买单的往往是你。你有那种天生的商业嗅觉，总觉得处处都是赚钱的机会。",
                negative: "花钱大手大脚，存不住钱，就像水龙头关不紧。那种‘今朝有酒今朝醉’的心态，让你在运势波动时压力山大。"
            },
            '食神': {
                positive: "是个典型的乐天派，很懂生活趣味。比如周末会花心思钻研一道菜，或者找个安静的地方喝杯下午茶，特别优雅。",
                negative: "有时候容易因循守旧，甚至有点贪图享乐。遇到需要拼命的事，你可能更倾向于‘躺平’，追求那种安逸的舒适区。"
            },
            '伤官': {
                positive: "才华横溢，口才特别好。在人群中，你往往是那个口若悬河、极具感染力的灵魂人物，有很多创新的念头。",
                negative: "嘴硬心软，但偏偏那张嘴最容易得罪人。有时候明明是好心建议，说出来的话却带刺，无意中就给自己招了怨感。"
            },
            '比肩': {
                positive: "意志力非常坚定，自立自强。就像一棵松树，风吹雨打也不低头，跟好哥们、好闺蜜在一起特别讲义气。",
                negative: "太固执行了，简直是‘倔驴’脾气。认定的一件事，哪怕撞了南墙也不回头，甚至还想把墙给拆了再走。"
            },
            '劫财': {
                positive: "社交达人，跟谁都能聊得来，场面话学得特别快。在逆境中，你有一种‘打不死的小强’那种爆发力。",
                negative: "心态容易失衡，那种‘想一夜暴富’的投机心理比较重。这就导致你容易被一些看似高收益、实则有坑的项目吸引。"
            }
        };

        // Helper to find text in tree
        const findTreeResult = (path) => {
            if (!window.treeData || !path || path.length === 0) return "";
            const rootKey = path[0];
            let current = window.treeData[rootKey]; // Array
            if (!current) return "";

            // Traverse from index 1 (titles)
            for (let i = 1; i < path.length; i++) {
                const title = path[i];
                if (!current) return "";
                if (Array.isArray(current)) {
                    const found = current.find(n => n.title === title);
                    if (!found) return "";
                    current = found;
                } else if (current.children) {
                    const found = current.children.find(n => n.title === title);
                    if (!found) return "";
                    current = found;
                } else {
                    return ""; // Should be array or object with children
                }
            }
            return current.result || "";
        };

        const transitions = [
            "从社会生存的角度来看，",
            "有趣的是，在另一面，",
            "但在处理具体事务或人际关系时，",
            "此外，你骨子里还透着一种..."
        ];

        let wovenSegments = [];

        // STRATEGY: If traces exist, use them. Else fallback to godStrengths logic.
        if (personalityTraces && personalityTraces.length > 0) {
            personalityTraces.forEach((trace, idx) => {
                const resultText = findTreeResult(trace.path);
                if (resultText) {
                    const prefix = transitions[idx] || "同时，";
                    // Append vivid example
                    const category = trace.category; // 'officer', 'seal' etc.
                    // Map category code to Vivid Key (Ten God Name) if possible
                    // Need mapping from 'officer' to '正官'/'七杀'
                    // But 'officer' covers both.
                    // We can find the DOMINANT god for this category from godStrengths to get exact example.

                    // Simple mapping:
                    const catToGod = { 'officer': '正官', 'seal': '正印', 'wealth': '正财', 'food': '食神', 'rob': '比肩' };
                    // Refined mapping: search godStrengths for the strongest god in this category
                    let bestGod = catToGod[category];
                    const relevantGods = godStrengths.filter(g => {
                        if (category === 'officer') return g.god === '正官' || g.god === '七杀' || g.god === '偏官';
                        if (category === 'seal') return g.god === '正印' || g.god === '偏印' || g.god === '枭神';
                        if (category === 'wealth') return g.god === '正财' || g.god === '偏财';
                        if (category === 'food') return g.god === '食神' || g.god === '伤官';
                        if (category === 'rob') return g.god === '比肩' || g.god === '劫财';
                        return false;
                    });
                    if (relevantGods.length > 0) {
                        // Sort by strength? They are already sorted in godStrengths potentially?
                        // Just pick the first one which is usually the strongest revealed or main qi.
                        bestGod = relevantGods[0].god;
                        if (bestGod === '偏官') bestGod = '七杀';
                        if (bestGod === '枭神') bestGod = '偏印';
                    }

                    const exMap = vividExamples[bestGod];
                    const example = exMap ? (trace.isFavorable ? exMap.positive : exMap.negative) : "";

                    wovenSegments.push(`${prefix}${resultText}${example ? "。" + example : ""}`);
                }
            });
        } else {
            // Fallback to Calculated Logic (Pre-computation)
            // ... (Keep existing logic if needed, but for now we rely on traces if AnalysisEngine is updated)
            // If no traces (legacy/error), use the old code?
            // User wants "Lookup Table Optimization".

            // Re-using old logic variable 'influences' just to be safe if traces empty
            const influences = godStrengths
                .filter(g => g.status === '旺' || g.isYongShen || (g.impacts && g.impacts.some(i => i.isNegative)))
                .slice(0, 3);

            influences.forEach((g, idx) => {
                // ... Old Logic ...
                // Only run if wovenSegments is empty to avoid duplication?
                // Or just return early if traces worked?
            });

            // Actually, if traces are empty, we MUST use old logic.
            if (wovenSegments.length === 0) {
                const catMap = { '正官': '官杀', '七杀': '官杀', '偏官': '官杀', '正印': '印星', '偏印': '印星', '枭神': '印星', '正财': '财星', '偏财': '财星', '食神': '食伤', '伤官': '食伤', '比肩': '比劫', '劫财': '比劫' };
                influences.forEach((g, idx) => {
                    const category = catMap[g.god];
                    // ... (Rest of old logic) ...
                    // To save tokens, I will just call the old logic if needed.
                    // But replacing the WHOLE function body is cleaner.

                    // I will put the OLD logic here as fallback.
                    const isYong = g.isYongShen;
                    const isSuppressed = (g.impacts && g.impacts.some(i => i.isNegative));
                    const isRobust = isYong ? (g.status === '旺' || !isSuppressed) : (g.status === '旺' && !isSuppressed);
                    let hasSealTrans = false;
                    if (!isYong && category === '官杀') { const hasSeal = godStrengths.some(s => catMap[s.god] === '印星' && s.status === '旺'); if (hasSeal) hasSealTrans = true; }

                    let trait = "";
                    let isPositive = false;

                    if (category === '官杀') {
                        if (isYong) { isPositive = true; trait = "刚直不阿、责任心强、锐意进取。"; }
                        else { if (isSuppressed || hasSealTrans) { isPositive = true; trait = "遵纪守法、严于律己、具有威望。"; } else { isPositive = false; trait = "不思进取、顶撞领导、行为偏激。"; } }
                    } else if (category === '印星') {
                        if (isYong) { isPositive = true; trait = "仁慈宽厚、智慧超群、文才卓然。"; }
                        else { if (isSuppressed) { isPositive = true; trait = "务实灵活、聪明机智、随机应变。"; } else { isPositive = false; trait = "容易焦虑、性格孤僻、优柔寡断。"; } }
                    } else if (category === '财星') {
                        if (isYong) { isPositive = true; trait = "勤勉能干、性格温和、古道热肠。"; }
                        else { if (isSuppressed) { isPositive = true; trait = "理财有道、不再迁腐、务实稳健。"; } else { isPositive = false; trait = "客吝小气、性格暴躁、喜信谗言。"; } }
                    } else if (category === '食伤') {
                        if (isYong) { isPositive = true; trait = "才华横溢、口才极佳、富有创意。"; }
                        else { if (isSuppressed) { isPositive = true; trait = "含蓄内敛、谨言慎行、大智若愚。"; } else { isPositive = false; trait = "狂妄自大、口无遮拦、恃才傲物。"; } }
                    } else if (category === '比劫') {
                        if (isYong) { isPositive = true; trait = "自强不息、意志坚定、特别讲义气。"; }
                        else { if (isSuppressed) { isPositive = true; trait = "遵纪守法、严于律己、具有领导力。"; } else { isPositive = false; trait = "固执己见、倔驴脾气、意气用事。"; } }
                    }

                    if (trait) {
                        const prefix = transitions[idx] || "同时，";
                        wovenSegments.push(`${prefix}你表现出一种${trait}`);
                    }
                });
            }
        }

        // Day Master base trait
        const dmTraits = {
            '甲': "像参天大树，正直而有主见，但有时也显得有些固执。",
            '乙': "像柔美的花草，外柔内刚，富有同情心且适应力强。",
            '丙': "像灿烂的阳光，热情开朗，为人慷慨，但性子急、易冲动。",
            '丁': "像静谧的灯火，内心温和而敏锐，做事周到但容易多虑。",
            '戊': "像厚重的大地，诚实稳重，守信用，但变通力略显不足。",
            '己': "像肥沃的田土，包容心强，心地善良，做事循规蹈矩。",
            '庚': "像坚硬的钢铁，刚毅爽朗，重义气，但容易过硬则折。",
            '辛': "像闪耀的珠宝，细腻精致，追求完美，内心极有主见且自尊心强。",
            '壬': "像奔腾的大江，智慧博大，勇于进取，但有时也随兴而行。",
            '癸': "像润物的细雨，温柔细致，善于隐忍，很有灵气。"
        };

        const dmElements = {
            '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土', '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水'
        };

        const dmIntro = dmTraits[dm] || "性格独特，很有个人风格。";
        let essay = `作为${dm}${dmElements[dm] || ""}命的人，你${dmIntro}`;

        // Add Day Branch flavor (Day Branch is internal personality)
        const dayBranchFlavors = {
            '子': "外表冷静，内心却充满奔放的感情。",
            '午': "性格直爽热情，但内心偶尔也会感到孤独。",
            '卯': "心思细腻，对美学和艺术有独特的直觉。",
            '酉': "极具分辨能力，追求极致，原则性极强。",
            '戌': "为人厚道可靠，甚至有些一根筋，认定的事很难回头。",
            '亥': "性格豁达，不计琐屑，是个聪明但不显露的人。",
            '辰': "志向远大，心思缜密，但容易陷入自我矛盾。",
            '丑': "脚踏实地，韧性极强，哪怕环境艰苦也能默默坚持。",
            '未': "心地善良，看不得别人受苦，是个懂得照顾人、守信用的人。",
            '寅': "活力四射，喜欢挑战，内心藏着一股不服输的劲儿。",
            '申': "机敏好动，擅长变通，总能迅速适应各种环境。"
        };
        if (dayBranchFlavors[dayZhi]) {
            essay += `在日常相处中，${dayBranchFlavors[dayZhi]}`;
        }
        essay += "\n\n";

        if (wovenSegments.length > 0) {
            essay += wovenSegments.join(" ");
            essay += "\n\n这种多重性格的交织，构成了你复杂的生命状态。平时为了生活可能有所收敛，但在关键时刻和人生的重大转折点，这些特征就会像‘出厂设置’一样显露无遗。你会发现，这些性格点滴实际上也是在潜移默化地推着你的人生命运往前走。你仔细回想一下，是不是这样？";
        } else {
            console.warn('[Debug] Personality Fallback Triggered. wovenSegments is empty.');
            console.log('[Debug] godStrengths:', godStrengths);
            console.log('[Debug] personalityTraces:', personalityTraces);
            essay = "性格中和，表现稳定。既不张扬也不过分保守，在生活中显得游刃有余。";
        }

        console.log('[Debug] Final Personality Essay:', essay);
        return essay;
    },

    /**
     * Removes Bazi technical jargon, brackets, and parentheticals.
     * e.g., "【癸】" -> "", "年支[辰]" -> "年支", "(才华无变现)" -> ""
     */
    stripBaziJargon(text) {
        if (!text) return "";
        let clean = text;

        // 1. Remove bracketed elements like 【癸】 or 【七杀】
        clean = clean.replace(/【[^】]+】/g, '');

        // 2. Remove square brackets contents: [辰] -> ""
        clean = clean.replace(/\[[^\]]+\]/g, '');

        // 3. Remove parentheticals that look like technical explanations: (才华无变现), (根基动摇)
        // We target patterns like (xxx) where xxx is 2-8 characters often found in Bazi notes
        clean = clean.replace(/\([^)]+\)/g, '');

        // 4. Remove labels at start of lines or segments: "怀才不遇 (才华无变现): " -> ""
        // Matches "Some Chinese characters: "
        clean = clean.replace(/^[一-龥]{2,8}[:：]\s*/gm, '');
        clean = clean.replace(/\n[一-龥]{2,8}[:：]\s*/g, '\n');

        // 5. Clean up markers like "→ 结果："
        clean = clean.replace(/→\s*结果[：:]/g, '');

        // 6. Clean up double dots or spaces resulting from removals
        clean = clean.replace(/\s+/g, ' ');
        clean = clean.replace(/。+/g, '。');
        clean = clean.replace(/，+/g, '，');
        clean = clean.replace(/、+/g, '、');

        // Final trim of symbols
        clean = clean.replace(/^[，。、\s]+/, '');
        clean = clean.replace(/[，。、\s]+$/, '');

        return clean.trim();
    },

    /**
     * Generate Feng Shui environment analysis based on pillar spatial mapping.
     * Maps pillars to house directions (Traditional South-on-Top).
     * Includes logical housing conclusions based on Seal Stars (Zheng Yin / Pian Yin).
     */
    generateFengShuiAnalysis(pillars) {
        if (!pillars || pillars.length < 4) return [];
        const res = [];
        const fs = this.data.fengshuiEnv;
        if (!fs) return [];

        const dm = pillars[2].gan;
        let zhengYinCount = 0;
        let pianYinCount = 0;
        let zhengYinToured = false;

        // 1. Scan for Seal Stars
        pillars.forEach((p, idx) => {
            const gGod = window.getTenGod ? window.getTenGod(dm, p.gan) : null;
            if (gGod === '正印') { zhengYinCount++; zhengYinToured = true; }
            if (gGod === '偏印') { pianYinCount++; }
            if (window.HIDDEN_STEMS_MAP && window.HIDDEN_STEMS_MAP[p.zhi]) {
                window.HIDDEN_STEMS_MAP[p.zhi].forEach(s => {
                    const zGod = window.getTenGod ? window.getTenGod(dm, s) : null;
                    if (zGod === '正印') zhengYinCount++;
                    if (zGod === '偏印') pianYinCount++;
                });
            }
        });

        // 2. Draft Housing Conclusions
        let housingConclusion = "";
        if (zhengYinCount > 0 && pianYinCount > 0) {
            housingConclusion = "命中正偏印俱见，混杂交织。表示命主一生喜出门在外，走动较多，经常搬家。居住过的地方很多，且往往是因为工作或环境变化而频繁迁移。";
        } else if (zhengYinCount > 0 && pianYinCount === 0) {
            housingConclusion = zhengYinToured
                ? "命中带纯正印且天干透出，多主居住的是国家分配之官房、公房或单位福利房，自己拥有长期稳定的居住权。"
                : "命中带纯正印且藏于地支，主居住的是祖辈留下的产业或有稳固产权的房子，环境稳固扎实。";
        } else if (pianYinCount > 0 && zhengYinCount === 0) {
            housingConclusion = "命中无正印而只有偏印（以偏当正），主居住的通常不是祖辈之房。往往在父辈时就已经迁居，或者您本人也经常搬迁，属于典型的变动型居住规律。";
        }

        if (housingConclusion) {
            res.push({ title: "🔮 大师定论：居住与房产特征", content: housingConclusion });
        }

        // 3. Mapping (Traditional South-on-Top): Year->SW, Month->SE, Day->NW, Hour->NE
        // Modern Apartment Context: Day Pillar often maps to Master Bedroom, Hour Pillar to Children's Room/Secondary Bedroom.
        const directions = [
            '【西南方】 (坤位 · 对应年柱)',
            '【东南方】 (巽位 · 对应月柱)',
            '【西北方】 (乾位 · 对应日支/主卧)',
            '【东北方】 (艮位 · 对应时支/次卧)'
        ];

        pillars.forEach((p, i) => {
            const dir = directions[i];
            const gDetail = fs.stems[p.gan];
            const zDetail = fs.branches[p.zhi];
            const tenGod = window.getTenGod ? window.getTenGod(dm, p.gan) : null;

            if (gDetail || zDetail) {
                let content = `从房屋中心点看去，在${dir}：`;
                if (gDetail) content += `天干能量映射为“${gDetail}”；`;
                if (zDetail) content += `地物能量映射为“${zDetail}”。`;

                // --- 1. Seal Sector (Zheng Yin / Pian Yin) ---
                if (tenGod === '正印' || tenGod === '偏印' || tenGod === '枭神') {
                    content += `\n> **易有物品**：此处易有【**书籍、证书、长辈赠送的物品、护身符、佛像**】。`;
                    if (tenGod === '偏印' || tenGod === '枭神') {
                        content += `若是偏印，还可能对应【**有翅膀的、对称图案的、毛茸茸的物品**】（如飞机模型、蝴蝶标本、羽绒服、鸡毛掸子、鸟类图案）。`;
                    }
                }

                // --- 2. Officer/Killing Sector (Zheng Guan / Qi Sha) ---
                if (tenGod === '正官' || tenGod === '七杀' || tenGod === '偏官') {
                    content += `\n> **易有物品**：此处易有【**刀剑利器、剪刀、摆放整齐的威严物品（如奖杯、制服）、健身器材**】。`;
                    if (tenGod === '七杀' || tenGod === '偏官') {
                        content += `\n> ⚠️ **七杀警示**：若此处散乱堆放了【**人形玩偶、手办、娃娃、旧合照**】，易招小人（犯七杀）。**建议收纳进柜，不要外露**。`;
                    }
                }

                // --- 3. Rob Wealth Sector (Jie Cai) ---
                if (tenGod === '劫财') {
                    content += `\n> **易有物品**：此处易有【**他人赠送或者遗留的物品**】（如旧物、纪念品、借放的行李等）。`;
                }

                // --- 4. Eating God Sector (Shi Shen) ---
                if (tenGod === '食神') {
                    content += `\n> **易有物品**：此处易有【**健身器材、零食**】；或者【**孩子相关的物品**】（如玩具、画作、书包）。`;
                }

                res.push({ title: `房屋${dir} 气场特征`, content: content });
            }
        });

        res.push({
            title: "风水观测说明",
            content: "以上内容是根据您的命局空间分布反推的居住环境耦合点。方位映射遵循：年->西南，月->东南，日->西北，时->东北。"
        });

        return res;
    }
};

// Expose to window for global access
window.BaziNarrative = BaziNarrative;
