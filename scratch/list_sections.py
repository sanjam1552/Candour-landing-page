import re

def main():
    with open("index.html", "r", encoding="utf-8") as f:
        lines = f.readlines()
        
    pattern = re.compile(r'(<!--\s*SECTION\s+[^>]+-->|<div class="section-label">[^<]+</div>|id="section-)')
    for idx, line in enumerate(lines):
        line_num = idx + 1
        matches = pattern.findall(line)
        if matches:
            print(f"Line {line_num:4d}: {line.strip()}")

if __name__ == "__main__":
    main()
