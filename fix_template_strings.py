import os

target_dir = "/Users/arnabsenapati/ulmind.com/src/admin"

for root, _, files in os.walk(target_dir):
    for f in files:
        if f.endswith(".tsx") or f.endswith(".ts"):
            path = os.path.join(root, f)
            with open(path, "r", encoding="utf-8") as file:
                content = file.read()
            
            # Replace ₹{ back to ${
            new_content = content.replace("₹{", "${")
            
            if new_content != content:
                with open(path, "w", encoding="utf-8") as file:
                    file.write(new_content)
                print(f"Fixed {path}")
