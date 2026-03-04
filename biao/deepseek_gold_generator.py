import os
import json
import requests
import random
import time
from pathlib import Path

# ============ CONFIGURATION ============
DEEPSEEK_API_KEY = 'sk-f07b277588f64850a9f8c799ef89ab91'
API_URL = "https://api.deepseek.com/v1/chat/completions"
OUTPUT_PATH = Path("e:/SD/bazi/ai/LLaMA-Factory/data/master_closer_gold_distilled.jsonl")

# Bazi Patterns to variety
BAZI_PATTERNS = [
    {"pillars": "甲寅 丙寅 甲子 甲子", "traits": "身强, 木旺, 仁慈但固执"},
    {"pillars": "戊戌 甲寅 戊午 壬子", "traits": "身强, 土厚, 稳重但压抑"},
    {"pillars": "甲子 丙子 庚申 丙戌", "traits": "身弱, 金寒水冷, 聪明但焦虑"},
    {"pillars": "癸亥 甲寅 丙午 甲午", "traits": "身中, 木火通明, 才华横溢但急躁"},
    {"pillars": "庚辰 辛巳 庚申 壬午", "traits": "从格潜力, 金气肃杀, 决策力强"},
    {"pillars": "丁卯 癸卯 丁卯 癸卯", "traits": "印旺, 敏感心思重, 容易想太多"},
    {"pillars": "壬申 壬子 壬辰 辛亥", "traits": "水局, 飘荡不定, 财源滚滚但守不住"},
    {"pillars": "己未 辛未 己未 辛未", "traits": "稼穑格潜力, 诚信稳重, 适合大平台"}
]

CUSTOMER_SCENARIOS = [
    "破产企业主：急功近利，希望能瞬间翻身，态度焦虑。数据量需求：财富方向。",
    "高管女性：婚姻亮红灯，性格强势但内心脆弱。数据量需求：感情方向。",
    "焦虑母亲：孩子学业不佳，愿意花钱消灾。数据量需求：学业方向。",
    "怀疑论专业人士：逻辑性极强，喜欢杠，需要用细节折服。数据量需求：综合方向。"
]

MASTER_SYSTEM_PROMPT = """
你现在是顶级八字销冠大师。你的目标是通过八字分析，展示无可替代的专业性，并最终引导客户进行高单价咨询（成交意向）。
## 核心人设
1. 像真人：在手机后台敲字的真人专家。语气带呼吸感，短句优先。
2. 压制力：不要迎合客户，要指出他们的盲点。如果客户质疑，用更深层的逻辑（撞门）折服他。
3. 销售逻辑：每一句关于命理的分析，都要关联到客户的“痛点”或“卡点”。
4. 话尾钩子：迫使对方回话。不要问“对吗”，要问“你最近那次挫败，是不是就卡在这个关键点了？”

## 严禁规则
1. 禁止说“作为AI...”。
2. 禁止使用“大师建议您...”、“关于您的性格...”这种模板话。
3. 禁止长篇大论，一次回复不超过80字。
"""

CUSTOMER_SYSTEM_PROMPT_TEMPLATE = """
你是一个真实客户场景：{scenario}。
你的八字是：{bazi}。
你会根据大师说的话给出反馈。如果说得准，你会慢慢信任；如果说得太玄乎或像套话，你会怼他。保持口语化，像真人在微信聊天。
"""

def call_deepseek(messages):
    payload = {
        "model": "deepseek-chat",
        "messages": messages,
        "temperature": 1.0,
        "stream": False
    }
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}"
    }
    for _ in range(3): # Retry logic
        try:
            response = requests.post(API_URL, json=payload, headers=headers, timeout=60)
            if response.status_code == 200:
                return response.json()['choices'][0]['message']['content']
            else:
                print(f"Error: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"Retry on error: {e}")
            time.sleep(2)
    return None

def generate_round():
    pattern = random.choice(BAZI_PATTERNS)
    scenario = random.choice(CUSTOMER_SCENARIOS)
    
    print(f"\n[Gold Distill] 场景: {scenario} | 八字: {pattern['pillars']}")
    
    dialogue = []
    
    # 1. Master Opening (Manual or AI)
    master_messages = [
        {"role": "system", "content": MASTER_SYSTEM_PROMPT},
        {"role": "user", "content": f"客户进场。八字资料：{pattern['pillars']} ({pattern['traits']})。给出一句扎心、撞门的开场白。"}
    ]
    opening = call_deepseek(master_messages)
    if not opening: return
    print(f"大师: {opening}")
    dialogue.append({"role": "assistant", "content": opening})

    for i in range(4): # 4 turns of interaction
        # 2. Customer Reacts
        customer_messages = [
            {"role": "system", "content": CUSTOMER_SYSTEM_PROMPT_TEMPLATE.format(scenario=scenario, bazi=pattern['pillars'])},
            {"role": "user", "content": dialogue[-1]['content']}
        ]
        # Include context
        if len(dialogue) > 1:
            customer_messages.insert(1, {"role": "assistant", "content": dialogue[-2]['content']})

        customer_reply = call_deepseek(customer_messages)
        if not customer_reply: break
        print(f"客户: {customer_reply}")
        dialogue.append({"role": "user", "content": customer_reply})

        # 3. Master Responds
        master_messages = [
            {"role": "system", "content": MASTER_SYSTEM_PROMPT},
            {"role": "user", "content": f"客户反馈：{customer_reply}。基于八字 {pattern['pillars']} 和当前对话，给出下一步压制性或引导性的回复。"}
        ]
        # Include history implicitly
        history_text = "\n".join([f"{d['role']}: {d['content']}" for d in dialogue[-3:-1]])
        master_messages[1]['content'] = f"历史对话：\n{history_text}\n\n客户最新反馈：{customer_reply}。\n当前八字背景：{pattern['pillars']}。\n请给出销冠大师的一句回复（不要废话，直接扎心）："

        master_reply = call_deepseek(master_messages)
        if not master_reply: break
        print(f"大师: {master_reply}")
        dialogue.append({"role": "assistant", "content": master_reply})

    # Save to ShareGPT format
    entry = {
        "conversations": dialogue
    }
    with open(OUTPUT_PATH, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    print(f"[Done] 记录了一轮对话。")

if __name__ == "__main__":
    # 随便跑10轮测试一下质量
    for i in range(10):
        print(f"\n--- Round {i+1} ---")
        generate_round()
        time.sleep(1)
