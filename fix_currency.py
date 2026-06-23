import os
import re

target_dir = "/Users/arnabsenapati/ulmind.com/src/admin"

# Match $ not followed by {
# Also ignore jQuery-like $ usage if any, though React shouldn't have much.
# Let's use a regex: \$([^\{]) -> ₹\1
# But we need to be careful about end of string: \$(\n|\r|$) -> ₹\1
# So: \$(?!\{)

pattern = re.compile(r'\$(?!\{)')

changed_files = 0
for root, _, files in os.walk(target_dir):
    for f in files:
        if f.endswith(".tsx") or f.endswith(".ts"):
            path = os.path.join(root, f)
            with open(path, "r", encoding="utf-8") as file:
                content = file.read()
            
            new_content, count = pattern.subn('₹', content)
            
            if count > 0:
                with open(path, "w", encoding="utf-8") as file:
                    file.write(new_content)
                changed_files += 1
                # print(f"Fixed {count} instances in {f}")

print(f"Total files updated: {changed_files}")
