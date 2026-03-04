import requests
import json
import time

# ！！！注意测试前必须确保 gui_bridge_server.js 正在 8080 端口运行 ！！！
SERVER_URL = "http://127.0.0.1:8081/api/analyze"
RESET_URL = "http://127.0.0.1:8081/api/reset"

# 模拟三个极端命局
CASES = [
    {
        "name": "极燥旺局 (身强克财)",
        "date": "1966-06-06T12:00:00",
        "gender": "男"
    },
    {
        "name": "极弱局 (财多身弱)",
        "date": "1983-12-05T12:00:00",
        "gender": "女"
    }
]

# 模拟真实的【大师控场】流程
DIAL_FLOW = [
    "你好，师父。", # Round 1: 触发开场白
    "理解，您请讲。", # Round 2: 确认规则，触发第一件事 (性格)
    "是滴，我确实是这种性子。", # Round 3: 认可性格，触发第二件事 (细节/执行力)
    "太准了，那您看我接下来的财运和事业到底该怎么走？", # Round 4: 信任感建立，进入【痛点诊断】
    "大师所言极是，确实是这根弦断了。求指点迷津。" # Round 5: 进入【大师指路】
]

def run_production_test(case):
    print(f"\n{'#'*60}")
    print(f" 开始【生产级】对抗测试: {case['name']}")
    print(f" 参数: {case['date']} | 性别: {case['gender']}")
    print(f"{'#'*60}")

    # 重置对话状态
    try:
        requests.post(RESET_URL)
    except:
        pass

    results = []
    
    for i, user_input in enumerate(DIAL_FLOW):
        print(f"\n[Round {i+1}] 客户输入: {user_input}")
        
        payload = {
            "date": case['date'],
            "gender": case['gender'],
            "isLunar": False, # 默认公历
            "feedback": user_input
        }
        
        try:
            start_time = time.time()
            response = requests.post(SERVER_URL, json=payload, timeout=60)
            res_json = response.json()
            elapsed = time.time() - start_time
            
            content = res_json.get('content', 'EMPTY RESPONSE')
            step = res_json.get('next_step', 'unknown')
            topics = res_json.get('updated_state', {}).get('discussedTopics', [])
            
            print(f"--- AI 回复 (耗时 {int(elapsed)}s | 阶段: {step} | 已谈话题: {topics}) ---")
            print(content)
            
            # --- 自动质量评估 ---
            issues = []
            if len(content) < 100: issues.append("字数不足!")
            if i > 0:
                # 检查是否复读了上一轮的某些关键句（简单启发式）
                if len(results) > 0:
                    prev_content = results[-1]['content']
                    common_phrases = ["我懂了", "你说得对", "就是这个道理", "这种局"]
                    for p in common_phrases:
                        if p in content and p in prev_content:
                            issues.append(f"检测到高频废话复读: '{p}'")
            
            if issues:
                print(f"⚠️ 质量预警: {', '.join(issues)}")
            
            results.append({
                "round": i+1,
                "input": user_input,
                "content": content,
                "issues": issues
            })

        except Exception as e:
            print(f"❌ 请求失败: {str(e)}")
            break
            
        time.sleep(1) # 模拟真人停顿

    # 保存测试日志
    log_name = f"test_log_{case['name'].replace(' ', '_')}.txt"
    with open(log_name, "w", encoding="utf-8") as f:
        f.write(f"Test Name: {case['name']}\n")
        for r in results:
            f.write(f"\n--- Round {r['round']} ---\nUser: {r['input']}\nAI: {r['content']}\nIssues: {r['issues']}\n")
    
    print(f"\n{case['name']} 对抗验收完毕。完整日志已保存至: {log_name}")

if __name__ == "__main__":
    for c in CASES:
        run_production_test(c)
