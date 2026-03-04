
import json
import os

path = r'e:\SD\bazi\sanbanfu\js\tree_data_static.js'

try:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract JSON part (remove "window.treeData = " etc if present)
    # The file usually starts with "window.treeData = {..." or just "{..."
    # My previous view showed it starts with `var treeData = {` or similar?
    # No, step 3940 showed `"title": "学业"`.
    # I need to see the start of the file to parse it correctly.
    # But I can just look for the "学业" block with regex or string find.
    
    start_marker = '"学业": ['
    idx = content.find(start_marker)
    if idx == -1:
        print("Error: '学业' not found.")
    else:
        # Find matching closing bracket is hard with string.
        # Let's try to parse the whole file if it is valid JS/JSON.
        
        # We can try to load it as JSON if we strip the var declaration
        # Assuming format is `window.treeData = { ... }`
        json_str = content
        if '=' in content[:100]:
            json_str = content.split('=', 1)[1].strip()
            if json_str.endswith(';'):
                json_str = json_str[:-1]
        
        try:
            data = json.loads(json_str)
            academic = data.get("学业", [])
            print(f"Academic Root Count: {len(academic)}")
            for root in academic:
                print(f"Root Title: {root.get('title')}")
                print("Children:")
                for child in root.get('children', []):
                    print(f"  - {child.get('title')}")
        except json.JSONDecodeError as je:
            print(f"JSON Parse Error: {je}")
            # Fallback extraction
            print("Attempting manual extraction...")
            # We found start_marker.
            # We can print the next 500 characters to see logical children titles
            snippet = content[idx:idx+1000]
            print(snippet)

except Exception as e:
    print(f"Error: {e}")
