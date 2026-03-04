
import re
import json
import os
import traceback

# --- CONFIGURATION ---
MARKDOWN_PATH = r'e:\SD\bazi\sanbanfu\biao\学业_树形结构图.md'
TREE_DATA_PATH = r'e:\SD\bazi\sanbanfu\js\tree_data_static.js'

# Manually defined Owl God Branch Structure (from User Screenshot & Logic Results)
OWL_GOD_BRANCH = {
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

def parse_markdown_to_tree(filepath):
    """
    Parses a markdown file with # headers into a recursive tree structure.
    Returns: { 'title': 'Root', 'children': [...] }
    """
    print(f"Parsing {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    root = {'title': 'Root', 'children': [], 'level': 0}
    stack = [root]
    
    current_content = []
    
    # Simple result mapping (reverse map title to Logic ID if possible, but for static view content suffices)
    # We will assume content blocks are descriptions.
    
    # Pre-scan for result lines like "result: res_xxx" if they existed? No.
    # We parse content.
    
    last_node = None

    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue
            
        # Check Header
        match = re.match(r'^(#+)\s+(.*)', line)
        if match:
            # If we had accumulated content for the previous node, attach it
            if last_node and current_content:
                last_node['content'] = "\n".join(current_content).strip()
                current_content = []

            level = len(match.group(1))
            title = match.group(2).strip()
            
            new_node = {
                'title': title, 
                'children': [], 
                'level': level
            }
            
            # Find parent in stack
            # Stack: [Root(0), H1(1), H2(2)...]
            # If new level is 3, parent is H2(2).
            # Pop stack until top level < new level
            while stack[-1]['level'] >= level:
                stack.pop()
                
            parent = stack[-1]
            parent['children'].append(new_node)
            stack.append(new_node)
            last_node = new_node
        else:
            # Content line
            # Check for specific formatting like "result: ..." or table
            current_content.append(line.rstrip())

    # Attach final content
    if last_node and current_content:
        last_node['content'] = "\n".join(current_content).strip()

    return root['children'][0] # Return the H1 node (e.g., '学业')

def inject_owl_god(tree_root):
    """
    Finds '原局' -> '身弱' and injects '枭神' branch.
    """
    print("Injecting Owl God logic...")
    
    # Find '原局'
    natal_node = next((c for c in tree_root['children'] if c['title'] == '原局'), None)
    if not natal_node:
        print("ERROR: Could not find '原局' node.")
        return False
        
    # Find '身弱'
    weak_node = next((c for c in natal_node['children'] if c['title'] == '身弱'), None)
    if not weak_node:
        print("ERROR: Could not find '身弱' node.")
        return False
        
    print("Found '身弱' node. Current children: " + str([c['title'] for c in weak_node['children']]))
    
    # Check if '枭神' already exists (to avoid double entry)
    existing_owl = next((c for c in weak_node['children'] if c['title'] == '枭神'), None)
    if existing_owl:
        print("Owl God node already exists. Replacing/Updating...")
        weak_node['children'].remove(existing_owl)
        
    # Insert Owl God branch
    # Where does user want it? Before '没印星'? Or after '印星为忌'?
    # Screenshot order: '印星为用', '印星为忌', '印星一般', '枭神', '没印星'.
    
    # List of desired order keys
    desired_order = ['印星为用', '印星为忌', '印星一般', '枭神', '没印星']
    
    # Simple append for now, then sort?
    weak_node['children'].append(OWL_GOD_BRANCH)
    
    # Reorder
    def sort_key(node):
        try:
            return desired_order.index(node['title'])
        except ValueError:
            return 999 
            
    weak_node['children'].sort(key=sort_key)
    print("Injection complete. New children order: " + str([c['title'] for c in weak_node['children']]))
    return True

def restore_result_ids(node):
    """
    The markdown does not contain "result": "res_xxx".
    We need to map leaf nodes to known IDs if possible, or leave as content.
    For the Owl God branch, we hardcoded the results.
    For the others, we might need a mapping table or heuristic.
    
    However, the Static Tree in Encyclopedia mode often just shows content.
    The Logic Mode uses the IDs to dynamic load.
    Wait, the user wants the "Master Synthesis" (Narrative) to sync.
    Narrative uses ID_MAP to find content based on Tree Result.
    
    If the Static Tree leaf has `result` field, the UI might use it.
    The existing markdown nodes (e.g., "学霸中的顶级配置") need result IDs?
    In previous steps, `academic_patterns.js` was generated with IDs like `res_Elder`, `res_Academic_001` etc.
    
    Restoring strict mapping for ALL 48 nodes is complex without a map file.
    But for the "Owl God" branch, we have explicit IDs.
    For the Standard Tree, we can try to guess or just leave them as Content-Only nodes 
    (which displays text in the box but maybe no "Result ID" for narrative matching).
    
    Actually, the User's main complaint is the STRUCTURE.
    The narrative matching is secondary but important.
    
    Let's check `academic_patterns.js`. It has 180 patterns.
    Some clearly map to standard nodes: "学霸中的顶级配置" -> res_Academic_001 (seen in step 1968 view).
    
    I will add a heuristic: map title/content keywords to `academic_patterns.js` entries?
    Or just hardcode a few key mappings if I can find them.
    Step 1968 showed exactly this mapping! 
    "有食伤泄秀" -> res_Academic_001.
    
    I should try to PRESERVE the existing mappings if possible.
    But I don't have the "Old" `tree_data_static.js` anymore (I overwrote it).
    
    Wait, the `restore_academic_logic.py` might have had the map.
    Let's peek at `restore_academic_logic.py`? 
    """
    
    # Simple check for titles matching pattern titles?
    pass

def main():
    try:
        # 1. Parse Markdown
        tree_root = parse_markdown_to_tree(MARKDOWN_PATH)
        
        # 2. Inject Owl God
        if not inject_owl_god(tree_root):
            print("Injection failed. Aborting.")
            return

        # 3. Write to tree_data_static.js
        print(f"Reading {TREE_DATA_PATH}...")
        with open(TREE_DATA_PATH, 'r', encoding='utf-8') as f:
            tree_content = f.read()
            
        start_marker = '"学业": ['
        end_marker = '"婚期": ['
        
        start_idx = tree_content.find(start_marker)
        end_idx = tree_content.find(end_marker)
        
        if start_idx != -1 and end_idx != -1:
            print(f"Found '学业' section at {start_idx}, '婚期' at {end_idx}.")
            
            # Wrap in list
            new_section_json = json.dumps([tree_root], ensure_ascii=False, indent=4)
            replacement = f'"学业": {new_section_json},\n  '
            new_content = tree_content[:start_idx] + replacement + tree_content[end_idx:]
            
            print("Writing updated tree_data_static.js...")
            with open(TREE_DATA_PATH, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print("Injection successful.")
        else:
            print("ERROR: Could not find markers in tree_data_static.js")
            
    except Exception as e:
        print(f"ERROR: {e}")
        traceback.print_exc()

if __name__ == '__main__':
    main()
