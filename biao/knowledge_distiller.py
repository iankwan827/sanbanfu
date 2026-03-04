import os
import json
import requests
import random
import time
import re
from pathlib import Path

# ============ CONFIGURATION ============
DEEPSEEK_API_KEY = 'sk-f07b277588f64850a9f8c799ef89ab91'
API_URL = "https://api.deepseek.com/v1/chat/completions"
BIAO_DIR = Path("e:/SD/bazi/ai/sanbanfu/biao")
OUTPUT_PATH = Path("e:/SD/bazi/ai/LLaMA-Factory/data/sanbanfu_knowledge_gold.jsonl")

# ============ KNOWLEDGE LOADER ============
def load_sanbanfu_knowledge():
    knowledge = {}
    pattern = re.compile(r'^#\s+(.*)')
    
    for md_file in BIAO_DIR.glob("*_树形结构图.md"):
        topic = md_file.stem.replace("_树形结构图", "")
        content = md_file.read_text(encoding='utf-8')
        
        # Simple parser to extract "Leaf Nodes" (Deepest logic branches)
        # We look for lines that contain bold text or specific recommendations
        branches = []
        lines = content.split('\n')
        current_context = []
        for line in lines:
            if line.startswith('##'):
                current_context = [line.strip('# ')]
            elif line.startswith('###'):
                current_context = current_context[:1] + [line.strip('# ')]
            elif line.startswith('####'):
                current_context = current_context[:2] + [line.strip('# ')]
            elif line.startswith('#####'):
                current_context = current_context[:3] + [line.strip('# ')]
            elif len(line.strip()) > 5 and not line.startswith('#'):
                # This is likely a logic entry
                branch_path = " > ".join(current_context)
                branches.append({
                    "path": branch_path,
                    "logic": line.strip()
                })
        
        knowledge[topic] = branches
    return knowledge

MASTER_SYSTEM_PROMPT = """
你现在是顶级八字销冠大师（三板斧体系）。你的每一个字都必须是能够**原封不动复制给客户**的。
## 核心法则
1. **知识驱动**：我会给你一段“三板斧”的底层断事逻辑。你的所有分析必须基于这段逻辑，不能胡编乱造。
2. **销冠人设**：语气带压制力，短语优先，要有“呼吸感”。像在手机后台敲字的真人专家。
3. **扎心撞门**：开场白要一针见血。不要打招呼，直接根据八字指出对方性格或现状的“痛点”。
4. **销售钩子**：每段话末尾都要带压制性的提问，迫使对方回话。

## 说话风格
- 多用“咱、你品一品、讲真、明白人、掐指一算”。
- 反对模板化：严禁说“关于您的财运如下...”，要说“我看你这财帛宫，那是真金白银被比劫夺得一干二净，兜里比脸还干净吧？”
"""

CUSTOMER_SYSTEM_PROMPT = """
你现在扮演一个真实客户。你的心理状态是：如果你觉得大师说得准，你会慢慢变得信任甚至崇拜；如果大师只会说废话或套话，你会怼他、质疑他。
保持口语化，像真人在微信聊天，会有语气词（哦、呃、真的吗、哎）。
"""

def call_deepseek(messages):
    payload = { "model": "deepseek-chat", "messages": messages, "temperature": 1.1, "stream": False }
    headers = { "Content-Type": "application/json", "Authorization": f"Bearer {DEEPSEEK_API_KEY}" }
    try:
        response = requests.post(API_URL, json=payload, headers=headers, timeout=60)
        return response.json()['choices'][0]['message']['content']
    except: return None

def generate_distilled_round(topic_name, branch):
    print(f"\n[Knowledge Distill] Topic: {topic_name} | Path: {branch['path']}")
    print(f"[Core Logic] {branch['logic']}")
    
    dialogue = []
    
    # 1. Master Opening
    prompt = f"核心逻辑：{branch['logic']}\n场景：客户刚进门，你基于这个逻辑给他来个‘下马威’。直接说中他的现状或性格，要扎心。回复内容："
    msg = [{"role": "system", "content": MASTER_SYSTEM_PROMPT}, {"role": "user", "content": prompt}]
    opening = call_deepseek(msg)
    if not opening: return
    print(f"大师: {opening}")
    dialogue.append({"role": "assistant", "content": opening})

    # 2. Customer Feedback
    prompt = f"大师刚才对你说：‘{opening}’\n你的背景：正处于这个逻辑描述的状态。给出一句真实的、带点情绪的口语回复。"
    msg = [{"role": "system", "content": CUSTOMER_SYSTEM_PROMPT}, {"role": "user", "content": prompt}]
    cust_reply = call_deepseek(msg)
    if not cust_reply: return
    print(f"客户: {cust_reply}")
    dialogue.append({"role": "user", "content": cust_reply})

    # 3. Master Deepening & Sales Hook
    prompt = f"历史对话：\n大师：{opening}\n客户：{cust_reply}\n核心逻辑：{branch['logic']}\n要求：乘胜追击，用更深的热点、痛点勾住他，引导他意识到这个问题的严重性并想找你解决。回复内容："
    msg = [{"role": "system", "content": MASTER_SYSTEM_PROMPT}, {"role": "user", "content": prompt}]
    closer_move = call_deepseek(msg)
    if not closer_move: return
    print(f"大师: {closer_move}")
    dialogue.append({"role": "assistant", "content": closer_move})

    # Save to file
    entry = { "conversations": dialogue }
    with open(OUTPUT_PATH, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")

if __name__ == "__main__":
    knowledge = load_sanbanfu_knowledge()
    topics = list(knowledge.keys())
    
    print(f"Loaded {len(topics)} topics from sanbanfu biao.")
    
    # Generate 20 high-quality samples across topics
    for i in range(20):
        topic = random.choice(topics)
        branch = random.choice(knowledge[topic])
        generate_distilled_round(topic, branch)
        time.sleep(1)

    print(f"\n✅ Distillation complete! Data saved to: {OUTPUT_PATH}")
