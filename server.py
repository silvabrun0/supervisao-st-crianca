import http.server
import socketserver
import os
import sys
import socket

PORT = 8080

class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return '127.0.0.1'

if __name__ == '__main__':
    web_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(web_dir)
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(('0.0.0.0', PORT), NoCacheHTTPRequestHandler) as httpd:
        local_ip = get_local_ip()
        print(f"🚀 Servidor ativo na rede local:")
        print(f"   👉 Computador local: http://localhost:{PORT}")
        print(f"   👉 Rede Local (Wi-Fi/LAN): http://{local_ip}:{PORT}")
        sys.stdout.flush()
        httpd.serve_forever()
