import json
import re
import os

input_files = [
    "e:/SD/bazi/ai/sanbanfu/biao/gold_standard_data.jsonl",
    "e:/SD/bazi/ai/sanbanfu/biao/adversarial_arena_results.jsonl"
]
output_file = "e:/SD/bazi/ai/LLaMA-Factory/data/master_closer_gold_v2.jsonl"

def clean_and_normalize():
    count = 0
    with open(output_file, "w", encoding="utf-8") as out:
        for input_file in input_files:
            if not os.path.exists(input_file): continue
            with open(input_file, "r", encoding="utf-8") as f:
                content = f.read()
        
        # Split by potential JSON objects if they are not line-delimited
        # The distiller might have written multi-line JSON or concatenated ones
        # We look for {"messages": ...}
        matches = re.finditer(r'\{"messages":\s*\[.*?\]\}', content, re.DOTALL)
        
        for match in matches:
            try:
                data = json.loads(match.group())
                # Normalize system prompt if needed, or keep as is
                # Ensure no leading/trailing whitespace in content
                for msg in data['messages']:
                    msg['content'] = msg['content'].strip()
                
                out.write(json.dumps(data, ensure_ascii=False) + "\n")
                count += 1
            except Exception as e:
                print(f"Error parsing match: {e}")
                
    print(f"✅ Normalized {count} samples to {output_file}")

if __name__ == "__main__":
    clean_and_normalize()
