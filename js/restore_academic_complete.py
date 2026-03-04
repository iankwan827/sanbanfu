
import json
import os
import traceback

# --- CONFIGURATION ---
TREE_DATA_PATH = r'e:\SD\bazi\sanbanfu\js\tree_data_static.js'
PATTERNS_JS_PATH = r'e:\SD\bazi\sanbanfu\js\formulas\academic_patterns.js'

# --- MANUALLY DEFINED ACADEMIC TREE STRUCTURE ---
# Since the MD file is unreliable, we define the structure here to match the user's "Gold Standard".

def get_owl_god_branch():
    return {
        "title": "枭神",
        "children": [
            {
                "title": "偏印当权",
                "children": [
                    {
                        "title": "杀枭并见",
                        "children": [
                            {
                                "title": "杀枭有制 (高阶)",
                                "children": [],
                                "content": "你的命局呈现出一种极高阶的“奇才”配置。虽然带有“杀枭相生”的叛逆底色，但难得的是七杀与偏印在命中得到了有效的制衡与修剪。这代表你虽然骨子里对陈腐规则不屑一顾，但你具备极强的自我控制力，能够将这种破坏性的能量转化为开创性的学术研究或极其高深的专业技能。你不是随大流的学霸，而是那种在某个尖端领域能够打破规则、建立新标杆的领军人物。",
                                "result": "res_HighAchieverRebellion",
                                "tags": ["奇才大成", "高学历", "杀枭有制"]
                            },
                            {
                                "title": "极度叛逆 (辍学风险)",
                                "children": [],
                                "content": "虽然你极具奇才潜质，但命局中七杀过重且自身偏弱，这种“克制”带来的叛逆心远超由于印星带来的定力。你很容易在初高中阶段因为厌恶传统的说教、规则或巨大的同辈压力而选择“逃离”校园。属于“天才的陨落”，如果不加强定力教育，极易早早辍学。",
                                "result": "res_DropoutRisk",
                                "tags": ["极度叛逆", "辍学风险", "七杀过重"]
                            },
                            {
                                "title": "奇才变通 (杀枭相生)",
                                "children": [],
                                "content": "你的命局呈现典型的“杀枭相生”特质。这是一种极具张力的“奇才”配置。七杀代表你面临的巨大竞争压力或对规则的本能抵触，而偏印（枭神）则赋予了你极其敏锐、超前甚至有些偏门的洞察力。你非常聪明，但你的聪明不在于按部就班的积累，而在于对规则本质的“降维打击”。",
                                "result": "res_RebelliousGenius",
                                "tags": ["奇才", "叛逆", "杀枭相生"]
                            }
                        ]
                    }
                ]
            }
        ]
    }



def generate_patterns(node, path_titles, patterns_list):
    current_path = path_titles + [node['title']]
    if 'children' not in node or not node['children']:
        if 'content' in node:
            if 'result' in node:
                pattern_id = node['result']
            else:
                pattern_id = f"res_Academic_{len(patterns_list) + 1:03d}"
                node['result'] = pattern_id
            
            pattern = {
                "id": pattern_id,
                "title": node['title'],
                "tags": [t for t in current_path if t != "学业"], 
                "conditions": [], 
                "path": " -> ".join(current_path),
                "narrative": node['content'].replace("**", "")
            }
            patterns_list.append(pattern)
    else:
        for child in node['children']:
            generate_patterns(child, current_path, patterns_list)

def clean_for_json(node):
    if 'children' in node and node['children']:
        if 'content' in node: del node['content']
        for c in node['children']:
            clean_for_json(c)

def main():
    try:
        print("Constructing Correct Academic Tree...")
        academic_node = get_academic_tree()
        
        # Generate Patterns
        print("Generating Patterns...")
        patterns_list = []
        for child in academic_node['children']:
            generate_patterns(child, ["学业"], patterns_list)
            
        # Write academic_patterns.js
        print("Writing academic_patterns.js...")
        js_content = """/**
 * academic_patterns.js
 * Auto-generated - CORRECTED VERSION
 */

(function () {
    const E = window.BaziEngine || (window.BaziEngine = {});

    const patterns = [
"""
        for p in patterns_list:
            js_content += "        {\n"
            js_content += f'            id: "{p["id"]}",\n'
            js_content += f'            title: "{(p["title"])}",\n'
            js_content += f'            tags: {json.dumps(p["tags"], ensure_ascii=False)},\n'
            js_content += f'            conditions: [],\n' 
            js_content += f'            path: "{p["path"]}",\n'
            js_content += f'            narrative: `{p["narrative"]}`\n'
            js_content += "        },\n"
            
        js_content += """    ];

    E.PatternEngine.registerPatterns('academic', patterns);
})();
"""
        with open(PATTERNS_JS_PATH, 'w', encoding='utf-8') as f:
            f.write(js_content)
            
        # Update tree_data_static.js
        print("Updating tree_data_static.js...")
        clean_for_json(academic_node)
        new_json = json.dumps([academic_node], ensure_ascii=False, indent=4)
        
        with open(TREE_DATA_PATH, 'r', encoding='utf-8') as f:
            full_content = f.read()
            
        start_marker = '"学业": ['
        end_marker = '"婚期": ['
        
        s_idx = full_content.find(start_marker)
        e_idx = full_content.find(end_marker)
        
        if s_idx != -1 and e_idx != -1:
            replacement = f'"学业": {new_json},\n  '
            final_content = full_content[:s_idx] + replacement + full_content[e_idx:]
            
            with open(TREE_DATA_PATH, 'w', encoding='utf-8') as f:
                f.write(final_content)
            print("Tree data updated successfully.")
        else:
            print("ERROR: Could not find insertion markers.")

        print("DONE.")

    except Exception as e:
        print(f"ERROR: {e}")
        traceback.print_exc()

if __name__ == '__main__':
    main()
