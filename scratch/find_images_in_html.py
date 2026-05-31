import re
import os

def find_images_in_html():
    print("--- SCANNING INDEX.HTML FOR IMAGES ---")
    html_path = 'index.html'
    if not os.path.exists(html_path):
        print(f"Error: {html_path} not found")
        return
        
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()
        
    # Find all <img> tags src attributes
    img_srcs = re.findall(r'<img\s+[^>]*src=["\']([^"\']+)["\']', html, re.IGNORECASE)
    for src in img_srcs:
        print(f"HTML <img>: {src}")
        
    # Find any source in picture tags / source elements
    src_set = re.findall(r'<source\s+[^>]*srcset=["\']([^"\']+)["\']', html, re.IGNORECASE)
    for src in src_set:
        print(f"HTML <source srcset>: {src}")

    # Check for other places where jpg/png/svg filenames might be hardcoded in HTML
    # (e.g. inside scripts or data attributes)
    files = re.findall(r'[\w\-]+\.(?:jpg|jpeg|png|svg|webp|gif|mp4)', html, re.IGNORECASE)
    for file in set(files):
        # ignore inline svg attributes / xmlns values
        if 'svg' in file and 'w3.org' in file:
            continue
        print(f"HTML text matches image-like filename: {file}")

def find_images_in_css():
    print("\n--- SCANNING STYLE.CSS FOR IMAGES ---")
    css_path = 'style.css'
    if not os.path.exists(css_path):
        print(f"Error: {css_path} not found")
        return
        
    with open(css_path, 'r', encoding='utf-8') as f:
        css = f.read()
        
    urls = re.findall(r'url\s*\(\s*["\']?([^"\'\)]+)["\']?\s*\)', css, re.IGNORECASE)
    for url in urls:
        print(f"CSS url(): {url}")

def find_images_in_js():
    print("\n--- SCANNING SCRIPT.JS FOR IMAGES ---")
    js_path = 'script.js'
    if not os.path.exists(js_path):
        print(f"Error: {js_path} not found")
        return
        
    with open(js_path, 'r', encoding='utf-8') as f:
        js = f.read()
        
    # Search for files with image extensions
    files = re.findall(r'["\']([^"\'\s]+\.(?:jpg|jpeg|png|svg|webp|gif|mp4))["\']', js, re.IGNORECASE)
    for file in set(files):
        print(f"JS string match: {file}")

if __name__ == '__main__':
    find_images_in_html()
    find_images_in_css()
    find_images_in_js()
