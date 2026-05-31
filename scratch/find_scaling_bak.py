import re

with open('index.html.bak', 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'id=["\']section-scaling["\'].*?(</section>)', content, re.DOTALL)
if match:
    print(match.group(0))
else:
    print("Section-scaling not found in index.html.bak")
