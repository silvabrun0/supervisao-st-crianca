#!/usr/bin/env python3
"""
SerTão Criança · Motor Automatizado de Auditoria Modular da Plataforma
Executa a suíte determinística de testes ponta a ponta (12 Módulos Canônicos)
via Google Chrome Headless, permitindo execução modo-a-modo ou integral de 100% do sistema.
"""

import http.server
import socketserver
import threading
import subprocess
import argparse
import tempfile
import json
import time
import sys
import os

DEFAULT_PORT = 8092
CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

MODULE_CATALOG = {
    'auth_rbac': 'Autenticação, Usuários, Perfis e RBAC',
    'catalogo_dados': 'Catálogo Canônico, Escolas, Turmas, Governança Descentralizada SSOT (Pilar 14) e Estado Global',
    'setup_longitudinal': 'Setup de Observação, Seleção de Turmas e Ciclo Longitudinal (Pilar 1)',
    'rubricas_observacao': 'Observação Ativa, Matrizes Curriculares, Rubricas e Pendências',
    'sintese_finalizacao': 'Síntese Pedagógica, Escala de Materiais, Finalização e Cálculo de Tempo',
    'travas_seguranca': 'Travas de Duplo Lançamento, Gestão de Ocorrências (Pilar 13) e Segurança',
    'formadora_coordenacao': 'Acompanhamento da Formadora, Matriz de Coordenação e Isolamento de Perfis',
    'agenda_cronograma': 'Cronograma de Observações, Destaque da Próxima Observação e Baixa Automática',
    'historico_governanca': 'Histórico de Observações, Filtros Multidimensionais, Visualização e Exclusão',
    'indicadores_decisao': 'Indicadores Pedagógicos, Cobertura Bimestral (Pilar 7), Prioridades Balanceadas, Escala de Materiais, Busca na Matriz e Semáforo (Pilar 10)',
    'backup_exportacao': 'Persistência Local, Backup JSON, Restauração e Relatório para Impressão',
    'navegacao_layout': 'Sistema de Rotas/Tabs, Menu Mobile Overlay, Acessibilidade e Changelog'
}

REPO_DIR = os.path.dirname(os.path.abspath(__file__))

test_result = None
last_progress_time = None
server_running = True

class AuditHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=REPO_DIR, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_POST(self):
        global test_result, last_progress_time
        if self.path == '/__test_report__':
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8')
            test_result = json.loads(body)
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(b'{"status":"ok"}')
        elif self.path == '/__test_progress__':
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8')
            data = json.loads(body)
            last_progress_time = time.time()
            if not getattr(self, 'silent_mode', False) and not getattr(AuditHandler, 'global_silent_mode', False):
                idx = data.get('index', 0)
                total_mods = data.get('totalModules', 12)
                m_id = data.get('module', '')
                m_passed = data.get('passed', 0)
                m_total = data.get('total', 0)
                m_success = data.get('success', False)
                dur = data.get('durationMs', 0)
                tag = "\033[92m✔ PASS\033[0m" if m_success else "\033[91m✖ FAIL\033[0m"
                print(f"   [{idx:02d}/{total_mods:02d}] 📦 {m_id:<22} ({m_passed}/{m_total} testes em {dur}ms) {tag}")
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(b'{"status":"ok"}')
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        # Silencia logs comuns do servidor para manter a saída limpa
        pass

def find_available_port(preferred_port):
    import socket
    for p in range(preferred_port, preferred_port + 50):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
                s.bind(('127.0.0.1', p))
                return p
            except OSError:
                continue
    return preferred_port

httpd_instance = None

def check_javascript_syntax(html_path):
    """Valida a integridade sintática dos scripts inline e externos (.js) via JSC nativo do macOS antes do Chrome Headless."""
    jsc_path = "/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc"
    if not os.path.exists(jsc_path) or not os.path.exists(html_path):
        return True # Fallback seguro se não for macOS

    import re
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Mocks básicos do ambiente browser para o motor headless JSC
    mock_env = (
        "var window = { addEventListener: function() {}, location: { search: '' } };\n"
        "var document = { addEventListener: function() {}, querySelector: function() { return null; }, querySelectorAll: function() { return []; }, getElementById: function() { return null; } };\n"
        "var localStorage = { getItem: function() { return null; }, setItem: function() {} };\n"
    )

    # 1. Validação de arquivos externos <script src="...">
    script_srcs = re.findall(r'<script\s+src=["\']([^"\']+)["\']\s*></script>', content)
    base_dir = os.path.dirname(os.path.abspath(html_path))

    for src in script_srcs:
        src_path = os.path.normpath(os.path.join(base_dir, src))
        if not os.path.exists(src_path):
            print(f"❌ ERRO: Arquivo referenciado no index.html não encontrado: {src}")
            return False

        with open(src_path, 'r', encoding='utf-8') as sf:
            script_code = sf.read()

        with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as tf:
            tf.write(mock_env)
            tf.write(script_code)
            tf_path = tf.name

        try:
            res = subprocess.run([jsc_path, tf_path], capture_output=True, text=True)
            if res.returncode != 0 and 'SyntaxError' in res.stderr:
                print("=" * 80)
                print(f"❌ ERRO FATAL DE SINTAXE JS DETECTADO NO ARQUIVO: {src}")
                for line in res.stderr.strip().splitlines():
                    if 'SyntaxError' in line or 'at ' in line:
                        print(f"   {line}")
                print("=" * 80)
                return False
        finally:
            if os.path.exists(tf_path):
                os.remove(tf_path)

    # 2. Validação de blocos inline remanescentes
    inline_scripts = re.findall(r'<script(?![^>]*\bsrc\b)[^>]*>(.*?)</script>', content, re.DOTALL)
    for i, script in enumerate(inline_scripts):
        if not script.strip():
            continue
        with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as tf:
            tf.write(mock_env)
            tf.write(script)
            tf_path = tf.name

        try:
            res = subprocess.run([jsc_path, tf_path], capture_output=True, text=True)
            if res.returncode != 0 and 'SyntaxError' in res.stderr:
                print("=" * 80)
                print(f"❌ ERRO FATAL DE SINTAXE JS DETECTADO NO BLOCO INLINE #{i+1}")
                for line in res.stderr.strip().splitlines():
                    if 'SyntaxError' in line or 'at ' in line:
                        print(f"   {line}")
                print("=" * 80)
                return False
        finally:
            if os.path.exists(tf_path):
                os.remove(tf_path)

    return True

def run_server(port):
    global httpd_instance
    socketserver.TCPServer.allow_reuse_address = True
    try:
        httpd_instance = socketserver.TCPServer(('127.0.0.1', port), AuditHandler)
        httpd_instance.serve_forever()
    except Exception as e:
        if server_running:
            print(f"❌ Erro no servidor HTTP: {e}")

def main():
    global server_running, test_result

    parser = argparse.ArgumentParser(
        description="SerTão Criança · Motor de Auditoria Modular da Plataforma (100% de Cobertura)"
    )
    parser.add_argument(
        '-c', '--check-syntax',
        action='store_true',
        help="Valida apenas a integridade sintática do JavaScript em index.html via JSC nativo (sem Chrome) e encerra"
    )
    parser.add_argument(
        '-m', '--module',
        default='all',
        help="Chave do módulo específico para execução modo-a-modo (ou 'all' para integral)"
    )
    parser.add_argument(
        '-l', '--list-modules',
        action='store_true',
        help="Lista todos os 12 módulos disponíveis com suas descrições e encerra"
    )
    parser.add_argument(
        '-s', '--silent-on-success',
        action='store_true',
        help="Execução silenciosa para pós-deploy: emite saída e falha SOMENTE se houver problemas"
    )
    parser.add_argument(
        '-p', '--port',
        type=int,
        default=DEFAULT_PORT,
        help=f"Porta HTTP local para o servidor de testes (padrão: {DEFAULT_PORT})"
    )
    parser.add_argument(
        '--timeout',
        type=int,
        default=60,
        help="Tempo limite em segundos para execução e resposta dos testes (padrão: 60s)"
    )

    args = parser.parse_args()

    if args.list_modules:
        print("=" * 80)
        print("📚 CATÁLOGO DE MÓDULOS DA SUÍTE DE AUDITORIA (SerTão Criança)")
        print("=" * 80)
        for idx, (m_id, m_desc) in enumerate(MODULE_CATALOG.items(), start=1):
            print(f"  {idx:02d}. [{m_id}] ➔ {m_desc}")
        print("=" * 80)
        print("💡 Para rodar um módulo isoladamente:")
        print("   python3 audit_platform.py --module <nome_do_modulo>")
        print("   Exemplo: python3 audit_platform.py --module auth_rbac\n")
        sys.exit(0)

    if args.check_syntax:
        ok = check_javascript_syntax("index.html")
        if ok:
            print("✅ Sintaxe do JavaScript em 'index.html' validada com sucesso via JavaScriptCore (macOS).")
            sys.exit(0)
        else:
            sys.exit(1)

    target_module = args.module.strip()
    if target_module != 'all' and target_module not in MODULE_CATALOG:
        print(f"❌ Módulo inválido: '{target_module}'.")
        print(f"   Use 'python3 audit_platform.py --list-modules' para ver os módulos disponíveis.")
        sys.exit(1)

    # 0. Verificação Pré-Voo de Sintaxe JavaScript
    if not check_javascript_syntax("index.html"):
        sys.exit(1)

    if not os.path.exists(CHROME_PATH):
        print(f"❌ Google Chrome não encontrado em {CHROME_PATH}")
        sys.exit(1)

    AuditHandler.global_silent_mode = args.silent_on_success

    # Determina porta livre dinamicamente
    actual_port = find_available_port(args.port)

    # Inicia servidor HTTP em background
    server_thread = threading.Thread(target=run_server, args=(actual_port,), daemon=True)
    server_thread.start()
    time.sleep(0.4)

    target_url = f"http://127.0.0.1:{actual_port}/index.html?autoAudit=1&module={target_module}"

    if not args.silent_on_success:
        print("=" * 80)
        print("🔬 ALGORITMO DE AUDITORIA MODULAR DA PLATAFORMA (SerTão Criança)")
        print(f"   Modo de Execução: {'Integral (12 Módulos modo-a-modo)' if target_module == 'all' else f'Módulo Isolado [{target_module}]'}")
        print(f"   Alvo: index.html (Versão 1.46 - v8.2.13)")
        print("=" * 80)
        print(f"🚀 Inicializando motor headless do Google Chrome...")
        print(f"   URL de teste: {target_url}\n")

    temp_profile = tempfile.mkdtemp(prefix='chrome_audit_')
    chrome_log_path = os.path.join(tempfile.gettempdir(), 'chrome_audit_debug.log')
    chrome_log_file = open(chrome_log_path, 'w', encoding='utf-8')

    cmd = [
        CHROME_PATH,
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding",
        "--window-size=1440,900",
        "--remote-debugging-port=0",
        "--enable-logging=stderr",
        "--v=1",
        f"--user-data-dir={temp_profile}",
        target_url
    ]

    proc = subprocess.Popen(cmd, stdout=chrome_log_file, stderr=chrome_log_file)

    start = time.time()
    while test_result is None and (time.time() - start) < args.timeout:
        time.sleep(0.2)

    server_running = False
    if httpd_instance:
        try:
            httpd_instance.shutdown()
        except Exception:
            pass
    try:
        proc.terminate()
        proc.wait(timeout=2)
    except Exception:
        proc.kill()

    chrome_log_file.close()

    if test_result is None:
        print("\n" + "=" * 80)
        print("❌ TIMEOUT: O relatório de testes não foi recebido dentro do tempo limite (35s).")
        print(f"   Porta utilizada: {actual_port}")
        print(f"   URL chamada: {target_url}")
        print(f"   Diretório servido: {REPO_DIR}")
        print("-" * 80)
        print("📋 DIAGNÓSTICO FORENSE (ÚLTIMAS LINHAS DO LOG DO CHROME):")
        try:
            if os.path.exists(chrome_log_path):
                with open(chrome_log_path, 'r', encoding='utf-8', errors='ignore') as lf:
                    lines = lf.readlines()
                    last_lines = lines[-25:] if len(lines) > 25 else lines
                    if last_lines:
                        for l in last_lines:
                            print(f"   {l.rstrip()}")
                    else:
                        print("   (Nenhum erro registrado no log do Chrome)")
        except Exception as eDiag:
            print(f"   Erro ao ler log do Chrome: {eDiag}")
        print("=" * 80)
        sys.exit(1)

    total = test_result.get('total', 0)
    passed = test_result.get('passed', 0)
    failed = test_result.get('failed', 0)
    duration = test_result.get('durationMs', 0)
    success = test_result.get('success', False)
    modules_report = test_result.get('modules', [])

    # Se --silent-on-success e obteve sucesso integral:
    if args.silent_on_success and success:
        print(f"✅ Auditoria pós-deploy 100% aprovada ({passed}/{total} testes em {duration}ms) sem nenhum problema.")
        sys.exit(0)

    # Caso falhe OU não seja modo silencioso, imprime relatório completo estruturado:
    print("-" * 80)
    print("📋 RELATÓRIO DE AUDITORIA MODULAR (MODO-A-MODO):")
    print("-" * 80)

    if modules_report:
        for mod in modules_report:
            m_id = mod.get('id', '')
            m_title = mod.get('name', m_id)
            m_passed = mod.get('passed', 0)
            m_total = mod.get('total', 0)
            m_success = mod.get('success', False)

            header_status = "\033[92m[OK]\033[0m" if m_success else "\033[91m[FALHA]\033[0m"
            print(f"\n📦 {header_status} MÓDULO: {m_title} ({m_passed}/{m_total} aprovados)")

            for t in mod.get('results', []):
                t_name = t.get('name', '')
                t_pass = t.get('passed', False)
                t_det = t.get('details', '')
                status_tag = "  \033[92m✔ PASS\033[0m" if t_pass else "  \033[91m✖ FAIL\033[0m"
                det_str = f" ➔ {t_det}" if t_det else ""
                print(f"{status_tag} | {t_name}{det_str}")
    else:
        # Fallback para resultados planos
        for item in test_result.get('results', []):
            bat = item.get('battery', '')
            name = item.get('name', '')
            t_pass = item.get('passed', False)
            details = item.get('details', '')
            status_tag = "\033[92m[PASS]\033[0m" if t_pass else "\033[91m[FAIL]\033[0m"
            detail_str = f" ({details})" if details else ""
            print(f" {status_tag} {bat} ➔ {name}{detail_str}")

    print("\n" + "=" * 80)
    if success:
        print(f"\033[92m🎉 RESULTADO FINAL: 100% DE SUCESSO! ({passed}/{total} asserções em {duration}ms)\033[0m")
        print("   Todos os 12 subsistemas da plataforma SerTão Criança operam em perfeita integridade.")
        print("=" * 80)
        sys.exit(0)
    else:
        print(f"\033[91m⚠️ RESULTADO FINAL: {failed} FALHA(S) ENCONTRADA(S) ({passed}/{total} aprovadas em {duration}ms)\033[0m")
        print("   Existem problemas que requerem intervenção do engenheiro.")
        print("=" * 80)
        sys.exit(1)

if __name__ == '__main__':
    main()
