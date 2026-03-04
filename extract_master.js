const fs = require('fs');
const path = require('path');
const bridge = require('./bazi_ai_bridge.js');

async function extract() {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.log("用法: node extract_master.js <日期时间> <性别男/女>");
        console.log("示例: node extract_master.js \"1990-01-01 12:00\" \"男\"");
        process.exit(1);
    }

    const inputDate = args[0];
    const gender = args[1];

    console.log(`\n[系统] 正在提取: ${inputDate} | 性别: ${gender}`);
    console.log("------------------------------------------");

    try {
        const baziData = bridge.BaziCore.calculateBazi(new Date(inputDate), gender === '男' ? 'M' : 'F');
        if (!baziData) throw new Error("排盘失败，请检查日期格式。");

        // 模拟 UI 报告结构
        const report = {
            bazi: baziData,
            pillars: baziData.pillars,
            bodyStrength: baziData.bodyStrength
        };

        const library = bridge.BaziNarrative.generateScriptLibrary(report);

        if (!library) {
            console.log("错误: 无法生成综断内容。");
            return;
        }

        // 生成文件名 (YYYYMMDD性别.md)
        const dateObj = new Date(inputDate);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const genderStr = gender === '男' ? '男命' : '女命';
        const filename = `${year}${month}${day}${genderStr}.md`;

        // 构建 Markdown 内容
        let mdContent = `# 八字综断报告\n\n`;
        mdContent += `**出生日期**: ${inputDate}\n`;
        mdContent += `**性别**: ${gender}\n\n`;
        mdContent += `---\n\n`;

        const sections = [
            { key: 'opening', label: '内心性格' },
            { key: 'impact', label: '能量互动' },
            { key: 'wealth', label: '财富分析' },
            { key: 'marriage', label: '婚姻分析' },
            { key: 'academic', label: '学业分析' },
            { key: 'career', label: '事业分析' },
            { key: 'sexlife', label: '性生活' },
            { key: 'children', label: '子女分析' },
            { key: 'legal', label: '官非风险' },
            { key: 'fengshui', label: '风水建议' }
        ];

        sections.forEach(sec => {
            const items = library[sec.key];
            if (items && items.length > 0) {
                mdContent += `## ${sec.label}\n\n`;
                items.forEach(item => {
                    mdContent += `### ${item.title}\n\n`;
                    mdContent += `${item.content}\n\n`;
                });
            }
        });

        // 保存到根目录
        const outputPath = path.join(__dirname, '..', filename);
        fs.writeFileSync(outputPath, mdContent, 'utf8');
        console.log(`\n[系统] 已保存到: ${outputPath}`);

        // 同时输出到控制台
        console.log(`\n=== 综断内容预览 ===\n`);
        sections.forEach(sec => {
            const items = library[sec.key];
            if (items && items.length > 0) {
                console.log(`\n=== ${sec.label} ===`);
                items.forEach(item => {
                    console.log(`\n【${item.title}】`);
                    console.log(item.content);
                });
            }
        });

        console.log("\n------------------------------------------");
        console.log("[系统] 提取完成。");

    } catch (e) {
        console.error("提取过程中出错:", e.message);
    }
}

extract();
