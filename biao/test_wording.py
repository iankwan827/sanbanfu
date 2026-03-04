from rebuild_topic_aware_generator import BaziAnalyzer, generate_full_response_v2

def test_floating_case():
    bazi = "甲午年 戊午月 甲午日 丁酉时"
    print(f"Testing Bazi: {bazi}")
    response = generate_full_response_v2("财运", bazi, "什么时候发财？")
    print("\nFull Generated Response:")
    print(response)

if __name__ == "__main__":
    test_floating_case()
