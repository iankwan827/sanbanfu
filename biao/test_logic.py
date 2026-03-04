from rebuild_topic_aware_generator import BaziAnalyzer, TreeNavigator

def test_specific_case():
    bazi = "丁亥年 辛亥月 丁亥日 庚子时"
    print(f"Testing Bazi: {bazi}")
    analyzer = BaziAnalyzer(bazi)
    analysis = analyzer.analyze()
    
    print(f"Strength: {analysis['strength']}")
    print(f"Cai Strong (is_god_strong): {analysis['cai_strong']}")
    print(f"Guan Strong (is_god_strong): {analysis['guan_strong']}")
    
    path_desc, conclusion, advice = TreeNavigator.get_caiyun_logic(analysis)
    print(f"Caiyun Path: {path_desc}")
    print(f"Conclusion: {conclusion}")

if __name__ == "__main__":
    test_specific_case()
