import http.server
import socketserver
import json
import base64
import os
import webbrowser
import socket
import sys

# Define active image slots
SLOTS = [
    {
        "id": "candour_logo",
        "name": "Brand Logo (SVG)",
        "filename": "candour svg.svg",
        "section": "Closing / Navigation",
        "recommend": "Clean SVG file (transparent background)",
        "desc": "Main brand logo loaded dynamically at the bottom of the page and navigation."
    },
    {
        "id": "hero_banner",
        "name": "Hero Banner Image",
        "filename": "hero-banner.jpg",
        "section": "1. Hero Section",
        "recommend": "1200 x 900px (16:9 ratio)",
        "desc": "Fallback image for the top hero banner background if video background is not used."
    },
    {
        "id": "shift_1",
        "name": "Shift Card 1",
        "filename": "shift-1.jpg",
        "section": "2. The Shift Slider",
        "recommend": "600 x 600px (Square JPG)",
        "desc": "First card image in the scroll-driven perspective slider."
    },
    {
        "id": "shift_2",
        "name": "Shift Card 2",
        "filename": "shift-2.jpg",
        "section": "2. The Shift Slider",
        "recommend": "600 x 600px (Square JPG)",
        "desc": "Second card image in the scroll-driven perspective slider."
    },
    {
        "id": "shift_3",
        "name": "Shift Card 3",
        "filename": "shift-3.jpg",
        "section": "2. The Shift Slider",
        "recommend": "600 x 600px (Square JPG)",
        "desc": "Third card image in the scroll-driven perspective slider."
    },
    {
        "id": "memory_archive",
        "name": "Memory Archive Graphic",
        "filename": "memory-archive.jpg",
        "section": "3. Creative Memory",
        "recommend": "800 x 600px (JPG)",
        "desc": "Image displayed next to the interactive network node in the Memory Archive section."
    },
    {
        "id": "shift_example_1",
        "name": "Design Facelift Preview",
        "filename": "shift-example-1.jpg",
        "section": "4. Action: Design Facelift",
        "recommend": "800 x 600px (JPG)",
        "desc": "Preview card image for the Design Facelift expandable case study."
    },
    {
        "id": "facelift_before",
        "name": "Design Facelift: Before",
        "filename": "facelift-before.jpg",
        "section": "4. Action: Design Facelift",
        "recommend": "800 x 600px (JPG)",
        "desc": "Legacy layout view shown in the Before/After comparison panel."
    },
    {
        "id": "facelift_after",
        "name": "Design Facelift: After",
        "filename": "facelift-after.jpg",
        "section": "4. Action: Design Facelift",
        "recommend": "800 x 600px (JPG)",
        "desc": "Modernized layout view shown in the Before/After comparison panel."
    },
    {
        "id": "shift_example_2",
        "name": "Generation Shift Preview",
        "filename": "shift-example-2.jpg",
        "section": "4. Action: Gen Shift",
        "recommend": "800 x 600px (JPG)",
        "desc": "Preview card image for the Generation Shift expandable case study."
    },
    {
        "id": "shift_before",
        "name": "Generation Shift: Before",
        "filename": "shift-before.jpg",
        "section": "4. Action: Gen Shift",
        "recommend": "800 x 600px (JPG)",
        "desc": "Gen 0 legacy workspace view shown in the Before/After comparison panel."
    },
    {
        "id": "shift_after",
        "name": "Generation Shift: After",
        "filename": "shift-after.jpg",
        "section": "4. Action: Gen Shift",
        "recommend": "800 x 600px (JPG)",
        "desc": "Gen V2 modern workspace view shown in the Before/After comparison panel."
    },
    {
        "id": "culture_studio",
        "name": "Culture Studio Image",
        "filename": "culture-studio.jpg",
        "section": "5. Creative Culture",
        "recommend": "800 x 900px (Vertical Ratio)",
        "desc": "Large visual block displaying the studio culture workspace layout."
    }
]

# Protected non-placeholder files inside assets/ folder
PROTECTED_ASSETS = {
    "README.md",
    "creative_engine.png",
    "creative_studio.png",
    "digital_network.png"
}

def get_unused_assets():
    allowed_filenames = {slot['filename'] for slot in SLOTS}
    if not os.path.exists('assets'):
        return []
    
    all_files = os.listdir('assets')
    unused = []
    for file in all_files:
        if file not in allowed_filenames and file not in PROTECTED_ASSETS:
            # Only count images/svgs
            ext = os.path.splitext(file)[1].lower()
            if ext in {'.jpg', '.jpeg', '.png', '.svg', '.webp', '.gif'}:
                unused.append(file)
    return unused

class AssetManagerHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        # Silence default terminal logs for clean visual output
        pass

    def do_GET(self):
        # Route index to dashboard
        if self.path == '/' or self.path == '/dashboard':
            self.path = '/dashboard.html'
            return super().do_GET()
            
        # API: Get active slots and presence on disk
        if self.path == '/api/slots':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
            self.end_headers()
            
            data = []
            for slot in SLOTS:
                exists = os.path.exists(os.path.join('assets', slot['filename']))
                data.append({**slot, 'exists': exists})
                
            self.wfile.write(json.dumps(data).encode('utf-8'))
            return
            
        # API: Get unused assets list
        if self.path == '/api/unused':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
            self.end_headers()
            
            unused = get_unused_assets()
            self.wfile.write(json.dumps(unused).encode('utf-8'))
            return
            
        return super().do_GET()

    def do_POST(self):
        # API: Upload replacement base64 image
        if self.path == '/api/upload':
            try:
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                payload = json.loads(post_data.decode('utf-8'))
                
                filename = payload.get('filename')
                file_data = payload.get('data')
                
                # Validation check
                allowed_filenames = [slot['filename'] for slot in SLOTS]
                if filename not in allowed_filenames:
                    self.send_response(400)
                    self.end_headers()
                    self.wfile.write(b"Invalid destination filename")
                    return
                
                # Split header from dataurl (e.g. "data:image/jpeg;base64,")
                if ',' in file_data:
                    _, base64_str = file_data.split(',', 1)
                else:
                    base64_str = file_data
                
                decoded = base64.b64decode(base64_str)
                
                # Save asset
                os.makedirs('assets', exist_ok=True)
                target_path = os.path.join('assets', filename)
                with open(target_path, 'wb') as f:
                    f.write(decoded)
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": True}).encode('utf-8'))
                
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(str(e).encode('utf-8'))
            return

        # API: Delete unused files in assets/
        if self.path == '/api/cleanup':
            try:
                unused = get_unused_assets()
                deleted = []
                for file in unused:
                    try:
                        os.remove(os.path.join('assets', file))
                        deleted.append(file)
                    except Exception as err:
                        print(f"Error deleting file {file}: {err}")
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "deleted": deleted}).encode('utf-8'))
                
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(str(e).encode('utf-8'))
            return

def find_free_port(start_port):
    port = start_port
    while port < 65535:
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('', port))
                return port
        except OSError:
            port += 1
    return start_port

def main():
    # Force working directory to the directory where this script sits
    script_dir = os.path.dirname(os.path.abspath(__file__))
    if script_dir:
        os.chdir(script_dir)

    start_port = 8080
    port = find_free_port(start_port)
    
    server_address = ('', port)
    
    # Enable address reuse
    socketserver.TCPServer.allow_reuse_address = True
    
    try:
        with socketserver.ThreadingTCPServer(server_address, AssetManagerHandler) as httpd:
            print("==================================================================")
            print("   CANDOUR 2030 — LOCAL PRESENTATION ASSETS MANAGER STARTED")
            print("==================================================================")
            print(f"Server is running locally at: http://localhost:{port}")
            print("To stop the dashboard manager, close this terminal window (Ctrl+C).")
            print("------------------------------------------------------------------")
            
            # Open browser
            webbrowser.open(f'http://localhost:{port}')
            
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\nServer shutting down. Goodbye!")
        sys.exit(0)

if __name__ == '__main__':
    main()
