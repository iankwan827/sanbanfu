import os
import re
import json
import base64

# Configuration
SOURCE_DIR = "."
DIST_DIR = "dist"
FILES_TO_PROTECT = [
    "js/ui_render_global.js",
    "js/bazi_logic.js",
    "js/analysis_engine.js"
]
DATA_FILES = ["tree_data.json"]

def obfuscate_simple(content):
    """
    A prototype obfuscator that base64 encodes the script body 
    to demonstrate the concept of making code unreadable.
    """
    encoded = base64.b64encode(content.encode('utf-8')).decode('utf-8')
    return f"eval(decodeURIComponent(escape(window.atob('{encoded}'))));"

def protect_data(data_str):
    """
    Prototype data encryption (base64 + simple reverse).
    """
    return base64.b64encode(data_str.encode('utf-8')[::-1]).decode('utf-8')

def main():
    print("Starting Code Protection Prototype...")
    
    if not os.path.exists(DIST_DIR):
        os.makedirs(DIST_DIR)
        
    # Copy all files to dist first
    # (In a real scenario, we would use a proper build tool)
    
    print("\n[1/3] Protecting Data Files...")
    for f in DATA_FILES:
        path = os.path.join(SOURCE_DIR, f)
        if os.path.exists(path):
            with open(path, 'r', encoding='utf-8') as src:
                data = src.read()
                protected = protect_data(data)
                # Save to dist
                dest_dir = os.path.join(DIST_DIR, os.path.dirname(f))
                if dest_dir and not os.path.exists(dest_dir): os.makedirs(dest_dir)
                with open(os.path.join(DIST_DIR, f), 'w', encoding='utf-8') as out:
                    out.write(protected)
            print(f" - Protected: {f}")

    print("\n[2/3] Obfuscating JS Files...")
    for f in FILES_TO_PROTECT:
        path = os.path.join(SOURCE_DIR, f)
        if os.path.exists(path):
            with open(path, 'r', encoding='utf-8') as src:
                content = src.read()
                obfuscated = obfuscate_simple(content)
                # Save to dist
                dest_dir = os.path.join(DIST_DIR, os.path.dirname(f))
                if dest_dir and not os.path.exists(dest_dir): os.makedirs(dest_dir)
                with open(os.path.join(DIST_DIR, f), 'w', encoding='utf-8') as out:
                    out.write(obfuscated)
            print(f" - Obfuscated: {f}")

    print("\n[3/3] Handling HTML redirects...")
    # Update paipan.html in DIST to use the protected loaders if necessary
    # For now, just copy it.
    
    print("\nSuccess! Prototype files are in 'dist/' directory.")
    print("WARNING: This is a simple prototype for demonstration.")

if __name__ == "__main__":
    main()
