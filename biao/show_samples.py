#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""展示训练数据样本"""

import json
import sys
import random
from pathlib import Path

if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')


def show_samples():
    """展示各个文件的样本"""
    script_dir = Path(__file__).parent
    jsonl_files = sorted(script_dir.glob("*_training_data.jsonl"))
    
    print("="*70)
    print("🎯 高质量训练数据 - 样本展示")
    print("="*70)
    
    # 统计
    print(f"\n📊 文件统计:")
    for file in jsonl_files:
        with open(file, 'r', encoding='utf-8') as f:
            count = len(f.readlines())
        print(f"  {file.name:<40} {count:3d} 条")
    
    # 随机抽取3个文件展示样本
    print(f"\n\n{'='*70}")
    print("📝 样本展示 (随机抽取3个文件)")
    print("="*70)
    
    sample_files = random.sample(jsonl_files, min(3, len(jsonl_files)))
    
    for file in sample_files:
        with open(file, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        # 随机选一个样本
        sample_line = random.choice(lines)
        sample = json.loads(sample_line)
        
        print(f"\n📄 文件: {file.name}")
        print("-"*70)
        print(f"👤 用户: {sample['messages'][1]['content']}")
        print(f"\n🤖 AI: {sample['messages'][2]['content']}")
        print("-"*70)


if __name__ == "__main__":
    show_samples()
