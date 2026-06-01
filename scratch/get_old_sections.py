import subprocess
import re

def get_git_file_content(commit, filepath):
    result = subprocess.run(
        ["git", "show", f"{commit}:{filepath}"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        encoding="utf-8"
    )
    if result.returncode != 0:
        # Try with default system encoding if utf-8 fails
        result = subprocess.run(
            ["git", "show", f"{commit}:{filepath}"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
    return result.stdout

def extract_section(html, section_id):
    # Match <section id="section_id" ... </section>
    # Note: Sections can contain other nested tags but we need the outer section.
    # A simple way is to find the index of id="section_id" and then count open/close section tags.
    id_pattern = f'id="{section_id}"'
    match = re.search(id_pattern, html)
    if not match:
        print(f"Could not find section with ID: {section_id}")
        return None
    
    # Trace back to the opening <section tag
    start_pos = html.rfind("<section", 0, match.start())
    if start_pos == -1:
        print(f"Could not find opening section tag for: {section_id}")
        return None
        
    # Walk forward and count nested section tags to find matching closing </section>
    pos = start_pos + 8
    open_tags = 1
    
    while open_tags > 0 and pos < len(html):
        next_open = html.find("<section", pos)
        next_close = html.find("</section>", pos)
        
        if next_close == -1:
            break
            
        if next_open != -1 and next_open < next_close:
            open_tags += 1
            pos = next_open + 8
        else:
            open_tags -= 1
            pos = next_close + 10
            
    return html[start_pos:pos]

def main():
    commit = "0687315"
    filepath = "index.html"
    print(f"Reading {filepath} from commit {commit}...")
    html = get_git_file_content(commit, filepath)
    
    for section_id in ["section-shift", "section-generation-shift"]:
        print(f"Extracting {section_id}...")
        section_html = extract_section(html, section_id)
        if section_html:
            out_file = f"scratch/{section_id}.html"
            with open(out_file, "w", encoding="utf-8") as f:
                f.write(section_html)
            print(f"Saved to {out_file} (length: {len(section_html)} chars)")
        else:
            print(f"Failed to extract {section_id}")

if __name__ == "__main__":
    main()
