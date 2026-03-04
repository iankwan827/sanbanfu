/**
 * children_tree.js
 * Decision Tree for Children (子女缘分)
 */

(function () {
    const E = window.DecisionEngine;
    const { createNode, createResult } = E;

    // =========================================================================
    // 1. ALL NODE & RESULT DECLARATIONS
    // =========================================================================

    const root = createNode('Children_Root', '分析子女缘分');

    // --- Gender Split ---
    const node_Gender = createNode('Children_Gender', '性别判定');

    // --- Male Path (Officer as Children) ---
    const node_Male_HasOff = createNode('Children_M_HasOff', '男命：有官杀星?');
    const node_M_Off_Yong = createNode('Children_M_Off_Yong', '官杀为用?');
    const node_M_Off_Strong = createNode('Children_M_Off_Strong', '官杀旺相?');
    const node_M_Off_FoodCont = createNode('Children_M_Off_FoodCont', '有食伤制杀?');
    const node_M_Off_SealTrans = createNode('Children_M_Off_SealTrans', '有印化官?');

    const node_Male_NoOff = createNode('Children_M_NoOff', '男命：无官杀看财');
    const node_M_Wealth_Strong = createNode('Children_M_Wealth_Strong', '财星有力?');

    // --- Female Path (Output as Children) ---
    const node_Female_HasFood = createNode('Children_F_HasFood', '女命：有食伤星?');
    const node_F_Food_Yong = createNode('Children_F_Food_Yong', '食伤为用?');
    const node_F_Food_Strong = createNode('Children_F_Food_Strong', '食伤旺相?');
    const node_F_Food_PeiYin = createNode('Children_F_Food_PeiYin', '伤官配印?');
    const node_F_Food_Xiao = createNode('Children_F_Food_Xiao', '枭神夺食?');

    const node_Female_NoFood = createNode('Children_F_NoFood', '女命：无食伤看财');
    const node_F_Wealth_Strong = createNode('Children_F_Wealth_Strong', '财星有力?');

    // --- Palace Check (Hour Pillar) ---
    const node_Palace_Start = createNode('Children_Palace_Start', '子女宫分析');
    const node_Palace_Yong = createNode('Children_Palace_Yong', '时柱为用?');
    const node_Palace_Void = createNode('Children_Palace_Void', '时柱空亡?');

    // --- RESULTS ---
    const res_Prosperous = createResult('res_Child_Prosperous', '子女兴旺', {
        desc: '你与子女的缘分非常深厚，就像是精心呵护的花园终于迎来了盛放。你的孩子不仅身体健康、生命力顽强，而且将来极有出息，能成为你晚年最大的依靠。这种天伦之乐是你命中注定的福报，家里总是充满了欢声笑语和生机勃勃的气息。',
        tags: ['兴旺', '孝顺']
    });
    const res_GoodEdu = createResult('res_Child_GoodEdu', '才俊子女', {
        desc: '你的孩子天生带有“书卷气”，聪明懂事，甚至有点早熟。他们是那类在学校里让老师省心、在家里让父母骄傲的“别人家的孩子”。比起物质享受，他们更注重精神层面的追求。未来他们极有可能通过读书或专业技能出人头地，光耀门楣。',
        tags: ['才俊', '有教养']
    });
    const res_Stubborn = createResult('res_Child_Stubborn', '顽劣难管', {
        desc: '养孩子对你来说可能是一场修行，因为你的孩子个性极强，甚至有点叛逆。他们就像一匹难以驯服的野马，软硬不吃，经常挑战你的底线。但是别灰心，这种倔强转化好了就是难得的韧性和领导力。教育他们需要更多的智慧和耐心，切忌硬碰硬。',
        tags: ['顽劣', '费心']
    });
    const res_Delayed = createResult('res_Child_Delayed', '缘分稍晚', {
        desc: '命中注定你的子女缘分来得比较晚，或者要经历一些波折才能圆满。这就像“好饭不怕晚”，上天想让你先完善自己，再迎接新生命的到来。不要因为周围人的催促而焦虑，你的福气在后头，中年得子或晚年享儿孙福是你的写照。',
        tags: ['晚育']
    });
    const res_Weak缘 = createResult('res_Child_Weak缘', '缘分薄弱', {
        desc: '你和孩子之间似乎总隔着一层看不见的纱，可能是聚少离多，也可能是沟通不畅。这种缘分的淡薄并不是因为缺乏爱，而是相处模式需要调整。建议你多关注彼此的情感链接，不要把自己的意愿强加给孩子，学会放手也是一种深沉的爱。',
        tags: ['缘薄']
    });

    // =========================================================================
    // 2. WIRING
    // =========================================================================

    root.setCondition(() => true).yes(node_Gender);
    node_Gender.setCondition(ctx => ctx.isMale).yes(node_Male_HasOff).no(node_Female_HasFood);

    // Male Path
    node_Male_HasOff.setCondition(ctx => ctx.hasOfficer).yes(node_M_Off_Yong).no(node_Male_NoOff);
    node_M_Off_Yong.setCondition(ctx => ctx.getGodMeta('官杀').isYong).yes(node_M_Off_Strong).no(node_M_Off_FoodCont);
    node_M_Off_Strong.setCondition(ctx => ctx.isOfficerStrong).yes(res_Prosperous).no(node_M_Off_SealTrans);
    node_M_Off_SealTrans.setCondition(ctx => ctx.hasSealTrans).yes(res_GoodEdu).no(res_Prosperous);

    node_M_Off_FoodCont.setCondition(ctx => ctx.isKillControlled).yes(res_GoodEdu).no(res_Stubborn);

    node_Male_NoOff.setCondition(ctx => ctx.hasWealth).yes(node_M_Wealth_Strong).no(node_Palace_Start);
    node_M_Wealth_Strong.setCondition(ctx => ctx.isWealthStrong).yes(res_Delayed).no(node_Palace_Start);

    // Female Path
    node_Female_HasFood.setCondition(ctx => ctx.hasFood).yes(node_F_Food_Yong).no(node_Female_NoFood);
    node_F_Food_Yong.setCondition(ctx => ctx.getGodMeta('食伤').isYong).yes(node_F_Food_Strong).no(node_F_Food_Xiao);
    node_F_Food_Strong.setCondition(ctx => ctx.isOutputStrong).yes(res_Prosperous).no(node_F_Food_PeiYin);
    node_F_Food_PeiYin.setCondition(ctx => ctx.isFoodPeiYin).yes(res_GoodEdu).no(res_Prosperous);

    node_F_Food_Xiao.setCondition(ctx => ctx.isXiaoEatingFood).yes(res_Weak缘).no(res_Stubborn);

    node_Female_NoFood.setCondition(ctx => ctx.hasWealth).yes(node_F_Wealth_Strong).no(node_Palace_Start);
    node_F_Wealth_Strong.setCondition(ctx => ctx.isWealthStrong).yes(res_Delayed).no(node_Palace_Start);

    // Common Palace Check
    node_Palace_Start.setCondition(() => true).yes(node_Palace_Yong);
    node_Palace_Yong.setCondition(ctx => ctx.isPalaceYong).yes(res_Prosperous).no(node_Palace_Void);
    node_Palace_Void.setCondition(ctx => ctx.isPalaceVoid).yes(res_Weak缘).no(res_Delayed);


    // =========================================================================
    // 3. REGISTRATION
    // =========================================================================
    if (window.DecisionEngine) {
        window.DecisionEngine.Engine.registerTree('children', root);
    }

})();
