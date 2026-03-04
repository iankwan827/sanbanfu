# -*- coding: utf-8 -*-
"""快速验证所有主题的逻辑一致性"""
import json
from pathlib import Path

topics = ['财运', '事业', '婚姻', '学业', '子女', '官非', '夫妻性生活', '身强身弱用神']

print("=" * 70)
print("逻辑一致性验证报告")
print("=" * 70)

for topic in topics:
    file_path = Path(f"e:/SD/bazi/sanbanfu/biao/{topic}_优化完整对话.jsonl")
    if not file_path.exists():
        continue
    
    lines = open(file_path, encoding='utf-8').readlines()
    
    strong_count = 0
    weak_count = 0
    strong_with_accounting = 0
    weak_with_startup = 0
    
    for line in lines:
        content = json.loads(line)['messages'][2]['content']
        
        is_strong = '身强' in content or '身极强' in content
        is_weak = ('身弱' in content or '身极弱' in content) and not is_strong
        
        if is_strong:
            strong_count += 1
            # 检查身强是否错误地推荐了财务/会计类职业
            if '财务管理' in content or '会计出纳' in content or '银行柜员' in content:
                strong_with_accounting += 1
        
        if is_weak:
            weak_count += 1
            # 检查身弱是否错误地推荐了创业类职业
            if '科技创业' in content or '连锁餐饮' in content or '越折腾越旺' in content:
                weak_with_startup += 1
    
    status = '✅' if (strong_with_accounting == 0 and weak_with_startup == 0) else '❌'
    
    print(f"\n{status} {topic}:")
    print(f"   身强: {strong_count}条  身弱: {weak_count}条")
    
    if strong_with_accounting > 0:
        print(f"   ❌ {strong_with_accounting}条身强推荐了财务/会计")
    else:
        print(f"   ✅ 身强职业正确（创业/投资类）")
    
    if weak_with_startup > 0:
        print(f"   ❌ {weak_with_startup}条身弱推荐了创业")
    else:
        print(f"   ✅ 身弱职业正确（平台/稳定类）")

print("\n" + "=" * 70)
print("验证完成！")
print("=" * 70)
