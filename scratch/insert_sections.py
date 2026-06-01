def main():
    # Read the current index.html
    with open("index.html", "r", encoding="utf-8") as f:
        html = f.read()
        
    # Read the sections to insert
    with open("scratch/section-shift.html", "r", encoding="utf-8") as f:
        section_shift = f.read()
        
    with open("scratch/section-generation-shift.html", "r", encoding="utf-8") as f:
        section_generation_shift = f.read()
        
    # 1. Update the navigation bar links
    old_nav = """        <div class="nav-links">
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
        
    new_nav = """        <div class="nav-links">
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
        
    if old_nav in html:
        html = html.replace(old_nav, new_nav)
        print("Updated navigation bar links.")
    else:
        # Try finding with different spacing or single quotes just in case
        print("Warning: Navigation bar links not matched directly. Checking alternative match...")
        
    # 2. Insert section-shift before <!-- SECTION 2 — THE CHALLENGE -->
    # We will replace '        <!-- SECTION 2 — THE CHALLENGE -->' (or equivalent comment)
    # with the section_shift + '        <!-- SECTION 4 — THE CHALLENGE -->'
    # Let's search for the exact comment
    old_challenge_comment = "        <!-- SECTION 2 — THE CHALLENGE -->"
    new_challenge_comment = "        <!-- SECTION 4 — THE CHALLENGE -->"
    
    # We also need to update the section-label inside section-challenge:
    # <div class="section-label">2. The Friction Crisis</div> -> <div class="section-label">3. The Friction Crisis</div>
    # Let's perform these updates
    if old_challenge_comment in html:
        # We replace the comment with section-shift + new challenge comment
        # Note: we need to ensure proper spacing
        replacement = section_shift + "\n\n" + new_challenge_comment
        html = html.replace(old_challenge_comment, replacement)
        print("Inserted section-shift and updated challenge section comment.")
    else:
        print("Error: Could not find challenge comment.")
        
    # Update challenge section-label
    old_challenge_label = '<div class="section-label">2. The Friction Crisis</div>'
    new_challenge_label = '<div class="section-label">3. The Friction Crisis</div>'
    if old_challenge_label in html:
        html = html.replace(old_challenge_label, new_challenge_label)
        print("Updated challenge section label.")
    else:
        print("Warning: Challenge section label not found.")
        
    # 3. Update Big Idea
    html = html.replace("        <!-- SECTION 4 — THE BIG IDEA -->", "        <!-- SECTION 5 — THE BIG IDEA -->")
    html = html.replace('<div class="section-label">3. The Big Idea</div>', '<div class="section-label">4. The Big Idea</div>')
    
    # 4. Update Methodology
    # The comment is: '        <!-- SECTION 6 — WORK SMARTER (NEW VIDEO SECTION) -->' (remains same)
    html = html.replace('<div class="section-label">3.5. Methodology</div>', '<div class="section-label">4.5. Methodology</div>')
    
    # 5. Update Fuel
    html = html.replace("        <!-- SECTION 3 — FUEL (CREATIVE MEMORY) -->", "        <!-- SECTION 7 — FUEL (CREATIVE MEMORY) -->")
    html = html.replace('<div class="section-label">3. Compounding Knowledge</div>', '<div class="section-label">5. Compounding Knowledge</div>')
    
    # 6. Update Engine
    html = html.replace("        <!-- SECTION 4 — ENGINE -->", "        <!-- SECTION 8 — ENGINE -->")
    html = html.replace('<div class="section-label">4. Scaling Quality</div>', '<div class="section-label">6. Scaling Quality</div>')
    
    # 7. Insert section-generation-shift before <!-- SECTION 5 — HUMAN INTELLIGENCE (NEW COMPARISON TABLE SECTION) -->
    old_intelligence_comment = "        <!-- SECTION 5 — HUMAN INTELLIGENCE (NEW COMPARISON TABLE SECTION) -->"
    new_intelligence_comment = "        <!-- SECTION 10 — HUMAN INTELLIGENCE (NEW COMPARISON TABLE SECTION) -->"
    
    if old_intelligence_comment in html:
        replacement = section_generation_shift + "\n\n" + new_intelligence_comment
        html = html.replace(old_intelligence_comment, replacement)
        print("Inserted section-generation-shift and updated intelligence section comment.")
    else:
        print("Error: Could not find intelligence comment.")
        
    # Update intelligence section label
    html = html.replace('<div class="section-label">5. Intelligence</div>', '<div class="section-label">6.6. Intelligence</div>')
    
    # 8. Update Driver
    html = html.replace("        <!-- SECTION 6 — DRIVER (CULTURE) -->", "        <!-- SECTION 11 — DRIVER (CULTURE) -->")
    html = html.replace('<div class="section-label">6. Creative Culture</div>', '<div class="section-label">7. Creative Culture</div>')
    
    # 9. Update Workshop
    html = html.replace("        <!-- SECTION 7 — THE WORKSHOP (CANDOUR INNOVATION LAB) -->", "        <!-- SECTION 12 — THE WORKSHOP (CANDOUR INNOVATION LAB) -->")
    html = html.replace('<div class="section-label">7. Experimentation</div>', '<div class="section-label">8. Experimentation</div>')
    
    # 10. Update Opportunity, Goal, Closing comments and labels
    # Labeled: 8. The Opportunity -> 9. The Opportunity
    html = html.replace('<div class="section-label">8. The Opportunity</div>', '<div class="section-label">9. The Opportunity</div>')
    # Labeled: 9. Goal -> 10. Goal
    html = html.replace('<div class="section-label">9. Goal</div>', '<div class="section-label">10. Goal</div>')
    # Labeled: 10. Closing -> 11. Closing
    html = html.replace('<div class="section-label">10. Closing</div>', '<div class="section-label">11. Closing</div>')
    
    # Write the modified index.html
    with open("index.html", "w", encoding="utf-8") as f:
        f.write(html)
    print("Done writing modifications to index.html.")

if __name__ == "__main__":
    main()
