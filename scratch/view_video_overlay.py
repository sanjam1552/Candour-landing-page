import re
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# find video-cinema-overlay
match = re.search(r'<div[^>]*class=["\']video-cinema-overlay["\'].*?</div>\s*</div>', text, re.DOTALL)
if match:
    print(match.group(0))
else:
    print("video-cinema-overlay not found")
