
import os

filepath = r'e:\SD\bazi\sanbanfu\js\tree_viewer.js'

try:
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
    
    for i, line in enumerate(lines):
        if 'dayZhi' in line:
            # Check for specific patterns
            if 'dayZhi)' in line or ', dayZhi' in line or ' dayZhi' in line:
                # exclude safe ones
                if 'ctx.dayZhi' in line or 'var dayZhi' in line or 'let dayZhi' in line or 'const dayZhi' in line:
                    continue
                if 'weights.dayZhi' in line or 'info.dayZhi' in line or 'data.dayZhi' in line:
                    continue
                if 'dayZhi:' in line: # object key
                    continue
                
                print(f"{i+1}: {line.strip()}")
                # Print context
                if i > 0: print(f"  {i}: {lines[i-1].strip()}")
                if i < len(lines)-1: print(f"  {i+2}: {lines[i+1].strip()}")
                print("-" * 20)

except Exception as e:
    print(f"Error: {e}")
