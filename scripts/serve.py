#!/usr/bin/env python3
"""Preview the site locally and on your phone (same Wi-Fi).  python scripts/serve.py [dir] [port]"""
import http.server, os, socket, sys, functools
d = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'site')
port = int(sys.argv[2]) if len(sys.argv) > 2 else 8080
try:
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM); s.connect(('8.8.8.8', 80)); ip = s.getsockname()[0]; s.close()
except Exception: ip = 'your-pc-ip'
print(f'Desktop: http://localhost:{port}/\nPhone (same Wi-Fi): http://{ip}:{port}/\nDebug: ?scene=orb  ?u=0.5  ?m=1  ?level=500\nCtrl+C to stop')
http.server.ThreadingHTTPServer(('0.0.0.0', port), functools.partial(http.server.SimpleHTTPRequestHandler, directory=d)).serve_forever()
