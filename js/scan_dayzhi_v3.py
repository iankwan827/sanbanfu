
import os
import re

def scan_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        matches = list(re.finditer(r'\bdayZhi\b', content))
        if not matches:
            return

        lines = content.splitlines()
        
        for match in matches:
            start, end = match.span()
            
            # 1. Check preceding char for property access
            if start > 0 and content[start-1] == '.':
                continue
                
            # 2. Check preceding context for declaration
            pre_context = content[max(0, start-50):start]
            if re.search(r'\b(var|let|const|function)\s+$', pre_context): continue
            if re.search(r'\b(var|let|const|function)\s+[a-zA-Z0-9_$]+\s*,\s*$', pre_context): continue
                
            # 3. Check for object key
            post_context = content[end:min(len(content), end+50)]
            if post_context.lstrip().startswith(':'): continue
            
            # 4. Check for Object shorthand { dayZhi }
            # If preceded by { or , AND followed by } or ,
            # This is tricky. 
            # If we decide to print everything that might be shorthand, we will see it.
            
            # Get line number
            line_num = content[:start].count('\n') + 1
            line = lines[line_num-1]
            
            # Exclude known safe patterns if any (e.g. comments?)
            if '//' in line and line.index('//') < line.index('dayZhi'): continue
            
            print(f"FOUND: {filepath}:{line_num}")
            print(f"CODE: {line.strip()}")
            print("-" * 40)

    except Exception as e:
        print(f"Error reading {filepath}: {e}")

root_dir = r'e:\SD\bazi\sanbanfu\js'
for root, dirs, files in os.walk(root_dir):
    for file in files:
        if file.endswith('.js'):
            scan_file(os.path.join(root, file))
