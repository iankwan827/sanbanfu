# -*- coding: utf-8 -*-
"""验证生成的训练数据"""

import json
from pathlib import Path

def validate_training_data():
    """验证所有生成的训练数据文件"""
    
    biao_dir = Path("e:/SD/bazi/sanbanfu/biao")
    files = list(biao_dir.glob("*_实战对话_training_data.jsonl"))
    
    total_conversations = 0
    results = []
    
    for file in sorted(files):
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
            # Count conversations by counting opening braces at line start (after split by newline)
            lines = [line.strip() for line in content.split('\n') if line.strip()]
            conversations = [line for line in lines if line.startswith('{')]
            count = len(conversations)
            
            total_conversations += count
            results.append((file.name, count))
            
            # Validate first conversation structure
            if count > 0:
                try:
                    first_conv = json.loads(conversations[0])
                    assert "messages" in first_conv
                    assert len(first_conv["messages"]) == 3
                    assert first_conv["messages"][0]["role"] == "system"
                    assert first_conv["messages"][1]["role"] == "user"
                    assert first_conv["messages"][2]["role"] == "assistant"
                    print(f"✅ {file.name}: {count} conversations (validated)")
                except Exception as e:
                    print(f"❌ {file.name}: {count} conversations (validation failed: {e})")
            else:
                print(f"⚠️  {file.name}: {count} conversations")
    
    print(f"\n{'='*60}")
    print(f"总计: {total_conversations} 条训练对话")
    print(f"文件数: {len(results)}")
    print(f"{'='*60}")
    
    return total_conversations, results

if __name__ == "__main__":
    validate_training_data()
