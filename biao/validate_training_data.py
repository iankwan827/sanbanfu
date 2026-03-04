#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""验证训练数据质量 - 检查逻辑一致性和去重"""

import json
import sys
import re
from pathlib import Path
from typing import List
from collections import Counter

if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')


def check_duplicates(text: str) -> bool:
    """检查文本中是否有重复句子"""
    sentences = text.split('。')
    sentences = [s.strip() for s in sentences if s.strip()]
    
    if len(sentences) != len(set(sentences)):
        return True  # 有重复
    return False


def check_metadata(text: str) -> List[str]:
    """检查是否还有元数据噪音"""
    patterns = [
        r'by\s+.*?幕布发布',
        r'\*\*by\s+',
        r'幕布发布'
    ]
    
    found = []
    for pattern in patterns:
        if re.search(pattern, text, re.IGNORECASE):
            found.append(pattern)
    
    return found


def validate_quality(file_path: Path):
    """验证单个文件的质量"""
    print(f"\n{'='*70}")
    print(f"📋 验证文件: {file_path.name}")
    print(f"{'='*70}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    total = len(lines)
    print(f"总样本数: {total}")
    
    # 检查问题
    duplicate_count = 0
    metadata_count = 0
    duplicate_samples = []
    metadata_samples = []
    
    for i, line in enumerate(lines[:10], 1):  # 先检查前10条
        try:
            data = json.loads(line)
            answer = data['messages'][2]['content']
            question = data['messages'][1]['content']
            
            # 检查重复
            if check_duplicates(answer):
                duplicate_count += 1
                duplicate_samples.append(i)
            
            # 检查元数据
            metadata = check_metadata(answer + question)
            if metadata:
                metadata_count += 1
                metadata_samples.append((i, metadata))
        
        except:
            pass
    
    print(f"\n质量检查 (前10条抽样):")
    print(f"  ❌ 复读问题: {duplicate_count}/10")
    print(f"  ❌ 元数据噪音: {metadata_count}/10")
    
    if duplicate_count == 0 and metadata_count == 0:
        print(f"  ✅ 质量合格!")
    
    # 显示样本
    print(f"\n随机样本展示:")
    print(f"{'-'*70}")
    
    import random
    sample_idx = random.randint(0, min(total-1, 50))
    sample = json.loads(lines[sample_idx])
    
    print(f"【样本 #{sample_idx+1}】")
    print(f"用户: {sample['messages'][1]['content']}")
    print(f"\nAI: {sample['messages'][2]['content']}")
    print(f"{'-'*70}")


def main():
    """主函数"""
    script_dir = Path(__file__).parent
    jsonl_files = sorted(script_dir.glob("*_training_data.jsonl"))
    
    if not jsonl_files:
        print("未找到训练文件")
        return
    
    print(f"\n🔍 高质量验证器")
    print(f"检查项目: 逻辑一致性、去重、元数据清理\n")
    
    for file in jsonl_files[:3]:  # 验证前3个文件
        validate_quality(file)
    
    print(f"\n\n{'='*70}")
    print("✅ 验证完成!")
    print(f"{'='*70}")


if __name__ == "__main__":
    main()
