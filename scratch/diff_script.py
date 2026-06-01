import subprocess

def get_git_file(commit, filepath):
    return subprocess.run(
        ["git", "show", f"{commit}:{filepath}"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        encoding="utf-8"
    ).stdout

def main():
    old_js = get_git_file("0687315", "script.js")
    with open("script.js", "r", encoding="utf-8") as f:
        current_js = f.read()
        
    # Let's see what functions are in the old script but not in the current script
    import re
    # Match functions, e.g. function initXYZ() {
    old_funcs = re.findall(r"function\s+(\w+)\s*\(", old_js)
    cur_funcs = re.findall(r"function\s+(\w+)\s*\(", current_js)
    
    print("Functions in 0687315:script.js:")
    print(old_funcs)
    print("\nFunctions in current script.js:")
    print(cur_funcs)
    
    missing = [f for f in old_funcs if f not in cur_funcs]
    print("\nMissing functions in current script.js:")
    print(missing)

if __name__ == "__main__":
    main()
