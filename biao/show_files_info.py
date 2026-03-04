#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""显示生成的训练文件信息"""

import json
import sys
from pathlib import Path

# 设置输出编码
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

def show_files_info():
    """显示所有生成的训练文件信息"""
    script_dir = Path(__file__).parent
    jsonl_files = sorted(script_dir.glob("*_training_data.jsonl"))
    
    if not jsonl_files:
        print("未找到训练数据文件")
        return
    
    print(f"="*70)
    print(f"生成的训练文件列表 (共 {len(jsonl_files)} 个文件)")
    print(f"="*70)
    print(f"{'文件名':<35} {'样本数':>8} {'文件大小':>12}")
    print(f"-"*70)
    
    total_samples = 0
    total_size = 0
    
    for file in jsonl_files:
        with open(file, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        sample_count = len(lines)
        file_size = file.stat().st_size / 1024  # KB
        
        total_samples += sample_count
        total_size += file_size
        
        print(f"{file.name:<35} {sample_count:8d} {file_size:9.1f} KB")
    
    print(f"-"*70)
    print(f"{'总计':<35} {total_samples:8d} {total_size:9.1f} KB")
    print(f"="*70)
    
    # 随机抽取几个样本展示
    print(f"\n随机样本展示:\n")
    
    import random
    sample_file = random.choice(jsonl_files)
    
    with open(sample_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        sample = json.loads(lines[0])
    
    print(f"文件: {sample_file.name}")
    print(f"-"*70)
    print(f"用户问题: {sample['messages'][1]['content']}")
    print(f"\nAI回答: {sample['messages'][2]['content'][:200]}...")
    print(f"="*70)

if __name__ == "__main__":
    show_files_info()
