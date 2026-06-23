import os
import re

target_dir = "/Users/arnabsenapati/ulmind.com/src/admin"

for root, _, files in os.walk(target_dir):
    for f in files:
        if f.endswith(".tsx") or f.endswith(".ts"):
            path = os.path.join(root, f)
            with open(path, "r", encoding="utf-8") as file:
                content = file.read()
            
            # Replace `$${` with `₹${`
            new_content = content.replace("`$$", "`₹$")
            
            # Replace `"$"` with `"₹"`
            new_content = new_content.replace('"$0"', '"₹0"')
            new_content = new_content.replace('>$0<', '>₹0<')
            
            # Replace `$ ` with `₹ `
            new_content = new_content.replace(" $", " ₹")
            
            # Additional fixes
            new_content = re.sub(r'>\$(.*?)<', r'>₹\1<', new_content)
            
            if new_content != content:
                with open(path, "w", encoding="utf-8") as file:
                    file.write(new_content)
                print(f"Updated {path}")
