#!/usr/bin/env python3
"""
SerTão Criança · Motor Automatizado de Auditoria da Plataforma
Executa a suíte de testes determinísticos ponta a ponta (10 baterias)
via Chrome Headless e valida a integridade funcional de todos os módulos.
"""

import http.server
import socketserver
import threading
import subprocess
import json
import time
import sys
import os

PORT = 8089
CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

test_result = None
server_running = True

class AuditHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_POST(self):
        global test_result
        if self.path == '/__test_report__':
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8')
            test_result = json.loads(body)
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(b'{"status":"ok"}')
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        # Silencia logs normais de requests para saída limpa
        pass

def run_server():
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(('127.0.0.1', PORT), AuditHandler) as httpd:
        while server_running:
            httpd.handle_request()

def main():
    global server_running
    print("=" * 75)
    print("🔬 ALGORITMO DE AUDITORIA E VERIFICAÇÃO INTEGRAL DA PLATAFORMA")
    print("   Projeto: SerTão Criança · Gestor Supervisão Patos (PB)")
    print("   Alvo: index.html (Versão 0.86 · v7.65)")
    print("=" * 75)

    if not os.path.exists(CHROME_PATH):
        print(f"❌ Google Chrome não encontrado em {CHROME_PATH}")
        sys.exit(1)

    # Inicia servidor HTTP em background
    server_thread = threading.Thread(target=run_server, daemon=True)
    server_thread.start()
    time.sleep(0.5)

    target_url = f"http://127.0.0.1:{PORT}/index.html?autoAudit=1"
    print(f"\n🚀 Inicializando motor headless do Google Chrome...")
    print(f"   URL de teste: {target_url}\n")

    cmd = [
        CHROME_PATH,
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        target_url
    ]

    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    # Aguarda relatório com timeout de 20 segundos
    timeout = 20
    start = time.time()
    while test_result is None and (time.time() - start) < timeout:
        time.sleep(0.3)

    server_running = False
    try:
        proc.terminate()
        proc.wait(timeout=2)
    except Exception:
        proc.kill()

    if test_result is None:
        print("❌ TIMEOUT: O relatório de testes não foi recebido dentro de 20 segundos.")
        sys.exit(1)

    print("-" * 75)
    print("📋 RELATÓRIO DETALHADO POR BATERIA:")
    print("-" * 75)

    for item in test_result.get('results', []):
        bat = item.get('battery', '')
        name = item.get('name', '')
        passed = item.get('passed', False)
        details = item.get('details', '')

        status_tag = "\033[92m[PASS]\033[0m" if passed else "\033[91m[FAIL]\033[0m"
        detail_str = f" ({details})" if details else ""
        print(f" {status_tag} {bat} ➔ {name}{detail_str}")

    print("-" * 75)
    total = test_result.get('total', 0)
    passed = test_result.get('passed', 0)
    failed = test_result.get('failed', 0)
    duration = test_result.get('durationMs', 0)
    success = test_result.get('success', False)

    if success:
        print(f"\033[92m🎉 RESULTADO FINAL: 100% DE SUCESSO! ({passed}/{total} baterias aprovadas em {duration}ms)\033[0m")
        print("   Todas as regras de negócio, fluxos de login, observações de turmas,")
        print("   travas longitudinais e indicadores operam sem nenhuma falha.")
        print("=" * 75)
        sys.exit(0)
    else:
        print(f"\033[91m⚠️ RESULTADO FINAL: {failed} FALHA(S) ENCONTRADA(S) ({passed}/{total} aprovadas)\033[0m")
        print("=" * 75)
        sys.exit(1)

if __name__ == '__main__':
    main()
