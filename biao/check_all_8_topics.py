# -*- coding: utf-8 -*-
"""
快速检查所有8个主题的逻辑一致性
"""

import json
from pathlib import Path

def check_topic(topic_file):
    """检查单个主题"""
    
    strong_count = 0
    weak_count = 0
    contradictions = []
    
    with open(topic_file, 'r', encoding='utf-8') as f:
        for line_num, line in enumerate(f, 1):
            if not line.strip():
                continue
            
            try:
                conv = json.loads(line)
                content = conv['messages'][2]['content']
                
                # 判断身强身弱
                is_strong = '身强' in content or '身极强' in content
                is_weak = ('身弱' in content or '身极弱' in content) and not is_strong
                
                if is_strong:
                    strong_count += 1
                    # 检查是否有身弱职业建议
                    if '财务管理' in content or '会计出纳' in content or '银行柜员' in content:
                        contradictions.append(f"第{line_num}行: 身强但建议财务/会计")
                    if '借力不丢人' in content or '找大平台、找靠山' in content:
                        contradictions.append(f"第{line_num}行: 身强但说要借力/找靠山")
                
                elif is_weak:
                    weak_count += 1
                    # 检查是否有身强职业建议
                    if '科技创业' in content or '连锁餐饮' in content or '投资理财' in content:
                        contradictions.append(f"第{line_num}行: 身弱但建议创业/投资")
                    if '越折腾越旺' in content or '最怕安稳' in content:
                        contradictions.append(f"第{line_num}行: 身弱但说要折腾")
            
            except Exception as e:
                pass
    
    return {
        'strong': strong_count,
        'weak': weak_count,
        'contradictions': contradictions
    }

def main():
    biao_dir = Path("e:/SD/bazi/sanbanfu/biao")
    
    topics = ['财运', '事业', '婚姻', '学业', '子女', '官非', '夫妻性生活', '身强身弱用神']
    
    print("=" * 70)
    print("检查所有8个主题的逻辑一致性")
    print("=" * 70)
    
    total_contradictions = 0
    
    for topic in topics:
        topic_file = biao_dir / f"{topic}_优化完整对话.jsonl"
        
        if not topic_file.exists():
            print(f"\n❌ {topic}: 文件不存在")
            continue
        
        result = check_topic(topic_file)
        
        print(f"\n📋 {topic}:")
        print(f"   身强: {result['strong']}条")
        print(f"   身弱: {result['weak']}条")
        
        if result['contradictions']:
            print(f"   ❌ 逻辑矛盾: {len(result['contradictions'])}条")
            for c in result['contradictions'][:3]:
                print(f"      • {c}")
            total_contradictions += len(result['contradictions'])
        else:
            print(f"   ✅ 逻辑一致")
    
    print("\n" + "=" * 70)
    if total_contradictions == 0:
        print("🎉 所有8个主题逻辑一致，无矛盾！")
    else:
        print(f"⚠️ 总共发现 {total_contradictions} 个逻辑矛盾")
    print("=" * 70)

if __name__ == "__main__":
    main()
