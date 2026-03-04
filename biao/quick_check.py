# -*- coding: utf-8 -*-
import json
from pathlib import Path

topics = ['财运', '事业', '婚姻', '学业', '子女', '官非', '夫妻性生活', '身强身弱用神']
biao_dir = Path("e:/SD/bazi/sanbanfu/biao")

print("检查结果:\n")
for topic in topics:
    file = biao_dir / f"{topic}_优化完整对话.jsonl"
    if not file.exists():
        print(f"{topic}: ❌ 文件不存在")
        continue
    
    lines = open(file, 'r', encoding='utf-8').readlines()
    strong = sum(1 for l in lines if '身强' in json.loads(l)['messages'][2]['content'] or '身极强' in json.loads(l)['messages'][2]['content'])
    weak = len(lines) - strong
    
    # 检查矛盾
    issues = 0
    for l in lines:
        content = json.loads(l)['messages'][2]['content']
        is_strong = '身强' in content or '身极强' in content
        
        if is_strong and ('财务管理' in content or '会计出纳' in content):
            issues += 1
        elif not is_strong and ('身强' not in content) and ('科技创业' in content or '投资理财' in content):
            issues += 1
    
    status = "✅" if issues == 0 else f"❌ {issues}个矛盾"
    print(f"{topic:12} - 身强:{strong:2}条, 身弱:{weak:2}条, {status}")

print("\n完成！")
