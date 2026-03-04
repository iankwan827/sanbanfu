
import re
import json
import os
import traceback

# --- 1. CONFIGURATION & DATA ---

ACADEMIC_TREE_JS_PATH = r'e:\SD\bazi\sanbanfu\js\rules\academic_tree.js'
OUTPUT_TREE_JSON_PATH = r'e:\SD\bazi\sanbanfu\js\academic_tree_structure.json'
OUTPUT_PATTERNS_JS_PATH = r'e:\SD\bazi\sanbanfu\js\formulas\academic_patterns.js'

# ID MAP from bazi_narrative_new.js (Manually extracted for reliability)
ID_MAP = {
    'Wealth_Root': { 'Y': '身强', 'N': '身弱' },
    'Academic_Root': { 'Y': '开启学业诊断' },
    'A_HasWealth': { 'Y': '地支有财星', 'N': '地支无财星' },
    'A_W_HasOfficial': { 'Y': '地支见官星', 'N': '地支没官星' },
    'A_W_O_HasSeal': { 'Y': '地支见印星', 'N': '地支没印星' },
    'A_W_O_S_AdjCheck': { 'Y': '财印不战', 'N': '财印相邻' },
    'A_W_O_NoS_SkySeal': { 'Y': '时月透印星', 'N': '时月无印星' },
    'A_W_O_S_SkyO': { 'Y': '天干透官星', 'N': '天干无官星' },
    'A_W_O_S_SkyW': { 'Y': '天干透财星', 'N': '天干无财星' },
    'A_W_O_S_SkyAdj': { 'Y': '财官印相生', 'N': '财官印相邻' },
    'A_W_O_NoS_Clash': { 'Y': '官星受制', 'N': '官星有用' },
    'A_W_NoO_S_Adj': { 'Y': '财印不战', 'N': '地支财印相邻' },
    'A_NoW_HasSeal': { 'Y': '原局', 'N': '原局' },
    'A_NoW_S_SkyS': { 'Y': '枭神', 'N': '印星' },
    'A_NoW_S_S_SkyO': { 'Y': '偏印当权', 'N': '印星受制' },
    'RebelliousCheck_A': { 'Y': '杀枭并见', 'N': '格局纯正' },
    'RebelliousCheck_B': { 'Y': '杀枭并见', 'N': '格局纯正' },
    'RebelliousCheck_M': { 'Y': '杀枭并见', 'N': '格局纯正' },
    'RebelliousCheck_BH': { 'Y': '杀枭并见', 'N': '格局纯正' },
    'Academic_ControlCheck': { 'Y': '杀星受制', 'N': '无制化' },
    'Academic_DropoutCheck': { 'Y': '辍学风险', 'N': '常规格局' },
    'S_Elite_OutputCheck': { 'Y': '才华加持', 'N': '无才华' },
    'S_Manager_OutputCheck': { 'Y': '策谋加持', 'N': '无策谋' },
    'S_BlackHorse_OutputCheck': { 'Y': '灵性加持', 'N': '无灵性' },
    'S_Foundation_OutputCheck': { 'Y': '定力加持', 'N': '无定力' },
    'node_NoSeal_OutputCheck': { 'Y': '食伤无制', 'N': '学业起伏' },
    'node_OutputPeiYinCheck': { 'Y': '食伤配印', 'N': '食伤无制' },
    'node_Manager_OutputCheck_Final': { 'Y': '策谋博学', 'N': '管理者模型' },
    'node_BlackHorse_OutputCheck_Final': { 'Y': '才华横溢', 'N': '半路杀出' },
    'node_SealOverloadCheck': { 'Y': '枭印过旺', 'N': '辍学风险' },
    'node_SealRestraintCheck': { 'Y': '杀枭有制', 'N': '辍学风险' },
    'node_D_BranchSealCheck': { 'Y': '地支有印星', 'N': '地支无印星' },
    'node_D_BlackHorseAdj': { 'Y': '地支财印不战', 'N': '地支财印相邻' },
    'node_D_SkyNoW': { 'Y': '天干无财', 'N': '天干有财' },
    'node_D_SkyOfficialCheck': { 'Y': '天干见正官', 'N': '天干无正官' },
    'node_D_SkySealCheck': { 'Y': '天干透印', 'N': '天干无印' },
    'node_D_VoidNeutralization': { 'Y': '空亡解救', 'N': '贪财坏印' },
    'node_D_NatalRescue': { 'Y': '原局救护', 'N': '无救护' },
    'node_D_LuckRescue': { 'Y': '大运救护', 'N': '无救护' },
    'node_D_SkyShaCheck': { 'Y': '天干透七杀', 'N': '无七杀' },
    'node_NoProperty_Seal': { 'Y': '地支印星', 'N': '地支无印' },
    'node_NoProperty_SkyO': { 'Y': '天干官星', 'N': '无官星' },
    'node_NoW_NoS_SkyOW': { 'Y': '财官旺相', 'N': '身弱孤立' },
    'node_NoProperty_SkySeal': { 'Y': '天干印星', 'N': '无印星' },
    'node_A_NoW_SkyO_Full': { 'Y': '天干官星', 'N': '无官星' },
    'node_OutputPeiYinCheck': { 'Y': '食伤配印', 'N': '食伤无制' },
    'node_NoW_NoS_OutputCheck': { 'Y': '食伤泄秀', 'N': '无依无靠' },
    'S_Elite_VoidGuard': { 'Y': '根基空亡', 'N': '根基稳固' },
    'S_Manager_VoidGuard': { 'Y': '根基空亡', 'N': '根基稳固' },
    'S_BlackHorse_VoidGuard': { 'Y': '根基空亡', 'N': '根基稳固' },
    'S_Foundation_VoidGuard': { 'Y': '根基空亡', 'N': '根基稳固' },
    'S_Wisdom_VoidGuard': { 'Y': '根基空亡', 'N': '根基稳固' },
    'node_ControlCheck': { 'Y': '杀枭有制', 'N': '无制化' }
}

def main():
    print("Starting script...")
    try:
        nodes_var_to_id = {}
        nodes_id_to_title = {}
        results = {}
        edges_var = {}
        
        # 1. READ FILE
        print(f"Reading {ACADEMIC_TREE_JS_PATH}...")
        with open(ACADEMIC_TREE_JS_PATH, 'r', encoding='utf-8') as f:
            content = f.read()
        print(f"Read {len(content)} bytes.")
            
        # 2. Extract Nodes (Var -> ID)
        count = 0
        for match in re.finditer(r"const\s+(\w+)\s*=\s*createNode\s*\(\s*'([^']+)'\s*,\s*'([^']+)'\s*\)", content):
            var_name = match.group(1)
            internal_id = match.group(2)
            title = match.group(3)
            nodes_var_to_id[var_name] = internal_id
            nodes_id_to_title[internal_id] = title
            count += 1
        print(f"Extracted {count} nodes.")
            
        # 3. Extract Results
        count = 0
        for match in re.finditer(r"const\s+(\w+)\s*=\s*createResult\s*\(\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*(\{[\s\S]*?\})\s*\);", content):
            var_name = match.group(1)
            res_id = match.group(2)
            res_title = match.group(3)
            res_obj = match.group(4)
            
            desc = ""
            desc_match = re.search(r"desc:\s*`([^`]+)`", res_obj) or re.search(r"desc:\s*'([^']+)'", res_obj) or re.search(r'desc:\s*"([^"]+)"', res_obj)
            if desc_match:
                desc = desc_match.group(1)
                
            tags = []
            tags_match = re.search(r"tags:\s*\[(.*?)\]", res_obj, re.DOTALL)
            if tags_match:
                tags_str = tags_match.group(1)
                tags = [t.strip().strip("'").strip('"') for t in tags_str.split(',') if t.strip()]

            results[var_name] = {
                'id': res_id,
                'title': res_title,
                'desc': desc.replace('\\n', '\n'), # Handle newlines
                'tags': tags
            }
            count += 1
        print(f"Extracted {count} results.")
            
        # 4. Extract Wiring
        count = 0
        for match in re.finditer(r"(\w+)\.setCondition\s*\(.*?\)\.yes\s*\(([^)]+)\)\.no\s*\(([^)]+)\);", content):
            node_var = match.group(1)
            yes_target = match.group(2).strip()
            no_target = match.group(3).strip()
            edges_var[node_var] = {'Y': yes_target, 'N': no_target}
            count += 1
        print(f"Extracted {count} edges.")

        # 5. Build Recursive
        def build(current_var, depth=0):
            if depth > 20: return {'title': 'Depth Limit', 'children': []}
            
            # Is Result?
            if current_var in results:
                res = results[current_var]
                return {
                    'title': res['title'],
                    'children': [],
                    'content': res['desc'],
                    'result': res['id'],
                    'tags': res['tags']
                }
                
            # Is Ternary?
            if '?' in current_var:
                 parts = current_var.split('?')
                 return {
                     'title': '检查补充条件', # General title for ternary check
                     'children': [
                         {'title': '符合条件', 'children': [build(parts[1].split(':')[0].strip(), depth+1)]},
                         {'title': '不符条件', 'children': [build(parts[1].split(':')[1].strip(), depth+1)]}
                     ]
                 }

            # Is Node?
            if current_var in edges_var:
                internal_id = nodes_var_to_id.get(current_var, current_var)
                
                # Get Edge Titles from ID_MAP
                map_entry = ID_MAP.get(internal_id, {})
                yes_title = map_entry.get('Y', 'Yes')
                no_title = map_entry.get('N', 'No')
                
                edge = edges_var[current_var]
                
                yes_node = build(edge['Y'], depth+1)
                no_node = build(edge['N'], depth+1)
                
                yes_wrapper = {
                    'title': yes_title,
                    'children': [yes_node]
                }
                no_wrapper = {
                    'title': no_title,
                    'children': [no_node]
                }
                
                return {
                    'title': nodes_id_to_title.get(internal_id, internal_id),
                    'children': [yes_wrapper, no_wrapper],
                    'is_logic_node': True 
                }
                
            return {'title': f"Unknown: {current_var}", 'children': []}

        # Root
        print("Building tree...")
        tree_struct = build('root') # Assuming root var is 'root', verified assumption?
        if 'root' not in  nodes_var_to_id and 'Academic_Root' in  nodes_var_to_id:
             # Wait, in JS it is: const root = createNode('Academic_Root', ...)
             # Variable name is 'root'.
             pass
        print("Tree built.")
        
        # 6. Clean up Logic Nodes for Static View
        def flatten_logic_nodes(node):
            if not node: return node
            
            new_children = []
            if 'children' in node:
                for child in node['children']: # Option Wrappers
                    if not child.get('children'):
                        continue
                        
                    next_question_node = child['children'][0]
                    
                    if 'result' in next_question_node:
                        child['children'] = [next_question_node]
                    else:
                        child['children'] = flatten_logic_nodes(next_question_node)
                    
                    new_children.append(child)
                    
            return new_children

        print("Flattening structure...")
        final_tree_children = flatten_logic_nodes(tree_struct)
        
        final_json = {
            'title': '学业',
            'children': final_tree_children
        }
        
        # 7. Generate Patterns JS
        patterns_list = []
        for k, v in results.items():
             patterns_list.append(v)
             
        patterns_js = "/** Auto-generated from academic_tree.js logic */\n"
        patterns_js += "(function () {\n"
        patterns_js += "    const E = window.BaziEngine || (window.BaziEngine = {});\n"
        patterns_js += "    const patterns = " + json.dumps(patterns_list, ensure_ascii=False, indent=4) + ";\n"
        patterns_js += "    E.PatternEngine.registerPatterns('academic', patterns);\n"
        patterns_js += "})();"
        
        # 8. Output Files
        print(f"Writing to {OUTPUT_TREE_JSON_PATH}...")
        with open(OUTPUT_TREE_JSON_PATH, 'w', encoding='utf-8') as f:
            json.dump(final_json, f, ensure_ascii=False, indent=2)
            
        print(f"Writing to {OUTPUT_PATTERNS_JS_PATH}...")
        with open(OUTPUT_PATTERNS_JS_PATH, 'w', encoding='utf-8') as f:
            f.write(patterns_js)

        # 9. INJECT INTO tree_data_static.js
        TREE_DATA_PATH = r'e:\SD\bazi\sanbanfu\js\tree_data_static.js'
        print(f"Reading {TREE_DATA_PATH}...")
        with open(TREE_DATA_PATH, 'r', encoding='utf-8') as f:
            tree_content = f.read()
            
        start_marker = '"学业": ['
        end_marker = '"婚期": ['
        
        start_idx = tree_content.find(start_marker)
        end_idx = tree_content.find(end_marker)
        
        if start_idx != -1 and end_idx != -1:
            print(f"Found '学业' section at {start_idx}, '婚期' at {end_idx}.")
            
            # tree_data requires "学业": [ { ... } ]
            new_section_json = json.dumps([final_json], ensure_ascii=False, indent=4)
            replacement = f'"学业": {new_section_json},\n  '
            new_content = tree_content[:start_idx] + replacement + tree_content[end_idx:]
            
            print("Writing updated tree_data_static.js...")
            with open(TREE_DATA_PATH, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print("Injection successful.")
        else:
            print("ERROR: Could not find markers in tree_data_static.js")
            
        print("DONE.")
    except Exception as e:
        print(f"ERROR: {e}")
        traceback.print_exc()

if __name__ == '__main__':
    main()
