import os

assets_dir = 'assets'
if os.path.exists(assets_dir):
    files = os.listdir(assets_dir)
    for f in files:
        if 'shift' in f.lower() or 'facelift' in f.lower():
            path = os.path.join(assets_dir, f)
            print(f"{f}: {os.path.getsize(path)} bytes")
else:
    print("assets directory not found")
