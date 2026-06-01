import re

def extract_section_range(html, section_id):
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
            
    return start_pos, pos

def main():
    # Read index.html
    with open("index.html", "r", encoding="utf-8") as f:
        html = f.read()
        
    # 1. Remove section-shift
    bounds = extract_section_range(html, "section-shift")
    if bounds:
        start_pos, end_pos = bounds
        # We also want to strip any extra white space before the section
        while start_pos > 0 and html[start_pos - 1].isspace():
            start_pos -= 1
            
        section_content = html[start_pos:end_pos]
        html = html[:start_pos] + html[end_pos:]
        print(f"Removed section-shift block (length: {len(section_content)} chars).")
    else:
        print("Error: Could not locate section-shift bounds.")
        
    # 2. Update navigation links (remove The Shift)
    old_nav = """        <div class="nav-links">
            <a href="#section-question" class="nav-link" data-section="section-question">Vision</a>
            <a href="#section-shift" class="nav-link" data-section="section-shift">The Shift</a>
            <a href="#section-challenge" class="nav-link" data-section="section-challenge">Challenges</a>
            <a href="#section-engine" class="nav-link" data-section="section-engine">Big Idea</a>
            <a href="#section-memory" class="nav-link" data-section="section-memory">Fuel</a>
            <a href="#section-scaling" class="nav-link" data-section="section-scaling">Engine</a>
            <a href="#section-culture" class="nav-link" data-section="section-culture">Culture</a>
            <a href="#section-labs" class="nav-link" data-section="section-labs">Workshop</a>
            <a href="#section-destination" class="nav-link" data-section="section-destination">Goal</a>
            <a href="#section-closing" class="nav-link" data-section="section-closing">2030</a>
        </div>"""
        
    new_nav = """        <div class="nav-links">
            <a href="#section-question" class="nav-link" data-section="section-question">Vision</a>
            <a href="#section-challenge" class="nav-link" data-section="section-challenge">Challenges</a>
            <a href="#section-engine" class="nav-link" data-section="section-engine">Big Idea</a>
            <a href="#section-memory" class="nav-link" data-section="section-memory">Fuel</a>
            <a href="#section-scaling" class="nav-link" data-section="section-scaling">Engine</a>
            <a href="#section-culture" class="nav-link" data-section="section-culture">Culture</a>
            <a href="#section-labs" class="nav-link" data-section="section-labs">Workshop</a>
            <a href="#section-destination" class="nav-link" data-section="section-destination">Goal</a>
            <a href="#section-closing" class="nav-link" data-section="section-closing">2030</a>
        </div>"""
        
    if old_nav in html:
        html = html.replace(old_nav, new_nav)
        print("Updated top navigation bar links.")
    else:
        print("Warning: Top navigation links block not matched. Doing generic regex replacement...")
        # Fallback regex replace for the nav link
        html = re.sub(r'\s*<a href="#section-shift"[^>]*>The Shift</a>', '', html)
        
    # 3. Perform string replacements to renumber sections and comments
    replacements = [
        # Challenge Section (was 3 -> becomes 2)
        ("        <!-- SECTION 4 — THE CHALLENGE -->", "        <!-- SECTION 2 — THE CHALLENGE -->"),
        ('<div class="section-label">3. The Friction Crisis</div>', '<div class="section-label">2. The Friction Crisis</div>'),
        
        # Big Idea Section (was 4 -> becomes 3)
        ("        <!-- SECTION 5 — THE BIG IDEA -->", "        <!-- SECTION 3 — THE BIG IDEA -->"),
        ('<div class="section-label">4. The Big Idea</div>', '<div class="section-label">3. The Big Idea</div>'),
        
        # Methodology Section (was 4.5 -> becomes 3.5)
        ('<div class="section-label">4.5. Methodology</div>', '<div class="section-label">3.5. Methodology</div>'),
        
        # Fuel Section (was 5 -> becomes 4)
        ("        <!-- SECTION 7 — FUEL (CREATIVE MEMORY) -->", "        <!-- SECTION 4 — FUEL (CREATIVE MEMORY) -->"),
        ('<div class="section-label">5. Compounding Knowledge</div>', '<div class="section-label">4. Compounding Knowledge</div>'),
        
        # Engine Section (was 6 -> becomes 5)
        ("        <!-- SECTION 8 — ENGINE -->", "        <!-- SECTION 5 — ENGINE -->"),
        ('<div class="section-label">6. Scaling Quality</div>', '<div class="section-label">5. Scaling Quality</div>'),
        
        # Transformation Section (was 6.5 -> becomes 5.5)
        ('<div class="section-label">6.5. Transformation</div>', '<div class="section-label">5.5. Transformation</div>'),
        
        # Human Intelligence Section (was 6.6 -> becomes 5.6)
        ("        <!-- SECTION 10 — HUMAN INTELLIGENCE (NEW COMPARISON TABLE SECTION) -->", "        <!-- SECTION 6 — HUMAN INTELLIGENCE (NEW COMPARISON TABLE SECTION) -->"),
        ('<div class="section-label">6.6. Intelligence</div>', '<div class="section-label">5.6. Intelligence</div>'),
        
        # Culture Section (was 7 -> becomes 6)
        ("        <!-- SECTION 11 — DRIVER (CULTURE) -->", "        <!-- SECTION 7 — DRIVER (CULTURE) -->"),
        ('<div class="section-label">7. Creative Culture</div>', '<div class="section-label">6. Creative Culture</div>'),
        
        # Workshop Section (was 8 -> becomes 7)
        ("        <!-- SECTION 12 — THE WORKSHOP (CANDOUR INNOVATION LAB) -->", "        <!-- SECTION 8 — THE WORKSHOP (CANDOUR INNOVATION LAB) -->"),
        ('<div class="section-label">8. Experimentation</div>', '<div class="section-label">7. Experimentation</div>'),
        
        # Opportunity Section (was 9 -> becomes 8)
        ("        <!-- SECTION 13 — THE FUTURE IS IN OUR HANDS -->", "        <!-- SECTION 9 — THE FUTURE IS IN OUR HANDS -->"),
        ('<div class="section-label">9. The Opportunity</div>', '<div class="section-label">8. The Opportunity</div>'),
        
        # Goal Section (was 10 -> becomes 9)
        ("        <!-- SECTION 14 — BECOMING THE AGENCY CLIENTS SEEK OUT -->", "        <!-- SECTION 10 — BECOMING THE AGENCY CLIENTS SEEK OUT -->"),
        ('<div class="section-label">10. Goal</div>', '<div class="section-label">9. Goal</div>'),
        
        # Closing Section (was 11 -> becomes 10)
        ("        <!-- SECTION 15 — CLOSING -->", "        <!-- SECTION 11 — CLOSING -->"),
        ('<div class="section-label">11. Closing</div>', '<div class="section-label">10. Closing</div>'),
    ]
    
    for old_str, new_str in replacements:
        if old_str in html:
            html = html.replace(old_str, new_str)
            print(f"Replaced: {old_str.strip()} -> {new_str.strip()}")
        else:
            print(f"Warning: Match not found for: {old_str.strip()}")
            
    # Write the modified content back to index.html
    with open("index.html", "w", encoding="utf-8") as f:
        f.write(html)
    print("Successfully wrote changes to index.html.")

if __name__ == "__main__":
    main()
