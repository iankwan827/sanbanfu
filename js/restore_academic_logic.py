import re
import json
import os

# Paths
MD_PATH = r"e:\SD\bazi\sanbanfu\biao\学业_树形结构图.md"
TREE_JS_PATH = r"e:\SD\bazi\sanbanfu\js\tree_data_static.js"
PATTERNS_JS_PATH = r"e:\SD\bazi\sanbanfu\js\formulas\academic_patterns.js"
NARRATIVE_JS_PATH = r"e:\SD\bazi\sanbanfu\js\bazi_narrative.js"

def parse_markdown(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    root = {"title": "学业", "children": []}
    stack = [(0, root)] # (level, node)
    
    # Map for result ID generation
    result_counter = 1

    current_content = []
    
    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue
            
        # Parse headers
        if stripped.startswith('#'):
            # Flush content to previous node if any
            if current_content and stack:
                last_node = stack[-1][1]
                # Join content, remove bold markdown
                text = '\n'.join(current_content).strip()
                # text = text.replace('**', '') 
                last_node['content'] = text
                current_content = []

            # Determine level
            level = 0
            while stripped[level] == '#':
                level += 1
            
            title = stripped[level:].strip()
            
            # Create new node
            new_node = {"title": title, "children": []}
            
            # Find parent
            while stack and stack[-1][0] >= level:
                stack.pop()
            
            parent = stack[-1][1]
            parent.setdefault("children", []).append(new_node)
            stack.append((level, new_node))
            
        elif stripped.startswith('-') or stripped.startswith('* ') or not stripped.startswith('#'):
             # Content lines
             current_content.append(stripped)

    # Flush final content
    if current_content and stack:
        last_node = stack[-1][1]
        text = '\n'.join(current_content).strip()
        last_node['content'] = text

    return root

def generate_patterns(node, path_titles, patterns_list):
    current_path = path_titles + [node['title']]
    
    if 'children' not in node or not node['children']:
        # Leaf node
        if 'content' in node:
            # Generate ID
            # pattern_id = f"A_P_{len(patterns_list) + 1:03d}"
            # Use a deterministic ID based on title hash or simple increment
            pattern_id = f"res_Academic_{len(patterns_list) + 1:03d}"
            
            # Assign result to node for JSON
            node['result'] = pattern_id
            
            # Create pattern object
            pattern = {
                "id": pattern_id,
                "title": node['title'],
                "tags": [t for t in current_path if t != "学业"], # Use path as tags
                "conditions": [], # Logic mapping will be tricky, leave empty or auto-map?
                # Actually, we rely on path matching in TreeViewer, but for consistency lets output path string
                "path": " -> ".join(current_path),
                "narrative": node['content'].replace("**", "")
            }
            patterns_list.append(pattern)
    else:
        for child in node['children']:
            generate_patterns(child, current_path, patterns_list)

def main():
    root = parse_markdown(MD_PATH)
    
    # The root from MD is "学业", which corresponds to the top level category in tree_data_static
    # We want the children of "学业" to be inserted.
    
    academic_tree_data = root
    
    patterns = []
    # Start recursion from root's children to avoid "学业 -> 学业"
    # Actually root title is "学业", so path starts with "学业"
    pass 
    
    # Recursively generate patterns and inject result IDs
    # But wait, tree_data_static usually starts with "开启学业诊断"?
    # The MD starts with "原局".
    # Let's adjust root if needed. 
    # Current tree_data_static has "title": "学业", "children": [ { "title": "开启学业诊断" ... } ]
    # MD has "# 学业" -> "## 原局"
    # So "原局" is a child of "学业". 
    # We will use "学业" as logical root for path generation.
    
    # Traverse
    patterns_list = []
    if 'children' in root:
        for child in root['children']:
             generate_patterns(child, ["学业"], patterns_list)
             
    # Output 1: Patterns JS
    # Mapping logic: We can't easily auto-generate "conditions" (e.g. hasOfficial) from "官星为用".
    # But the User just wants the Tree and Narrative to Sync.
    # If we set specific IDs, we can update bazi_narrative.
    
    js_patterns_content = """/**
 * academic_patterns.js
 * Auto-generated from 学业_树形结构图.md
 */

(function () {
    const E = window.BaziEngine || (window.BaziEngine = {});

    const patterns = [
"""
    
    for p in patterns_list:
        js_patterns_content += "        {\n"
        js_patterns_content += f'            id: "{p["id"]}",\n'
        js_patterns_content += f'            title: "{p["title"]}",\n'
        js_patterns_content += f'            tags: {json.dumps(p["tags"], ensure_ascii=False)},\n'
        # Dummy conditions, as the strict tree viewer might not use them if we use lookup
        js_patterns_content += f'            conditions: [],\n' 
        js_patterns_content += f'            path: "{p["path"]}",\n'
        js_patterns_content += f'            narrative: `{p["narrative"]}`\n'
        js_patterns_content += "        },\n"

    js_patterns_content += """    ];

    E.PatternEngine.registerPatterns('academic', patterns);
})();
"""

    with open(PATTERNS_JS_PATH, 'w', encoding='utf-8') as f:
        f.write(js_patterns_content)
        
    print(f"Generated {len(patterns_list)} patterns in {PATTERNS_JS_PATH}")

    # Output 2: Tree Data JSON Fragment
    # We need to insert this into tree_data_static.js
    # We will read the file, find the "学业" block, and replace it.
    
    with open(TREE_JS_PATH, 'r', encoding='utf-8') as f:
        tree_js = f.read()
        
    # Regex to find "学业" block
    # It usually looks like: { "title": "学业", "children": [ ... ] }
    # We will construct the new JSON string for the Academic block
    
    # Clean root for JSON dump (remove circular ref or complex objects if any? No, dicts are fine)
    
    # Convert to JSON string with indentation
    # root is {"title": "学业", "children":Node List}
    # We need to format it to match the file style roughly
    
    # Remove "content" from non-leaf nodes? 
    # iterate and clean
    def clean_nodes(n):
        if 'children' in n and n['children']:
            if 'content' in n: del n['content'] # Only leaf has content in viewer logic usually
            for c in n['children']:
                clean_nodes(c)
        else:
            # Leaf
            pass
            
    clean_nodes(root)
    
    # We only want the OBJECT inside the list, or the whole object?
    # In tree_data_static: [ { "title": "财", ... }, { "title": "学业", ... } ]
    # So we replace the object that has "title": "学业"
    
    # Use replacement by marker if regex is hard
    # OR assume "title": "学业" is unique top level
    
    # Let's verify structure by printing logic 
    # print(json.dumps(root, indent=2, ensure_ascii=False))
    
    # We will write the json fragment to a temp file for the AI to insert via replace_file_content
    # because doing safe regex replace in python without ruining other parts is risky
    
    with open('academic_tree_fragment.json', 'w', encoding='utf-8') as f:
        json.dump(root, f, indent=2, ensure_ascii=False)
        
    print("Generated academic_tree_fragment.json")

    # Output 3: ID_MAP updates for bazi_narrative.js
    # We need to generate the mapping lines
    map_lines = []
    for p in patterns_list:
        map_lines.append(f"            '{p['id']}': {{ Y: '{p['title']}' }},")
        
    with open('id_map_fragment.txt', 'w', encoding='utf-8') as f:
        f.write('\n'.join(map_lines))
        
    print("Generated id_map_fragment.txt")


if __name__ == '__main__':
    main()
