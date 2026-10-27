# Plano de Implementação: Resolução Definitiva da Execução do Motor de Auditoria da Plataforma (CLI e Web UI)

> **Diretriz de Execução (Obrigatório):**  
> O assistente executor da **Etapa 2 (Operário)** DEVE OBRIGATORIAMENTE ler e seguir integralmente as diretrizes do arquivo [WORKFLOW_MACOS.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md), do [WORKFLOW_GITHUB.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_GITHUB.md) e a skill [execucao-operario](file:///Users/bruno/Desktop/gestor%20supervisao_patos/.agents/skills/execucao-operario/SKILL.md) antes de aplicar quaisquer modificações no código-fonte. A execução deve ser estrita, cirúrgica, atenta à dupla checagem, versionamento sequencial duplo (`CHANGELOG.md` e `#modalChangelog`), sincronização das cópias espelhadas, criação de backup intermediário em `intermediárias/` e execução da auditoria pré e pós-deploy.

---

> **Status:** 📐 Planejamento Concluído (Etapa 1 - Arquiteto)  
> **Data:** 27/10/2026  
> **Versão Alvo:** `1.36` (`v8.2.3`)  
> **Arquivo de Backup Intermediário:** `intermediárias/aplicativo_v136_resolucao_execucao_auditoria_plataforma.html`  
> **Arquivos Principais Afetados:**  
> - `audit_platform.py` (motor automatizado CLI de auditoria e servidor de telemetria)  
> - `index.html` (raiz da aplicação - motor in-app de auditoria e modais)  
> - `gestor supervisao_patos/firebase_deploy/public/index.html` (cópia espelho de produção)  
> - `CHANGELOG.md` (registro histórico unificado de modificações)  

---

## 1. Diagnóstico do Problema e Análise Forense da Causa-Raiz

### 1.1 Sintoma Relatado
O usuário relata: *"quando eu vou fazer uma auditoria, eu não consigo. ele roda e não faz nada."*

A investigação analítica do código revelou que essa falha afeta **ambos os contextos de uso da auditoria**:
1. **No Terminal (CLI via `python3 audit_platform.py`):** Ao iniciar o script, ele imprime apenas duas linhas de cabeçalho (`Inicializando motor headless do Google Chrome...`) e entra em um loop cego de espera de até 35 segundos. O terminal congela sem qualquer indicador de progresso, sem logs, sem resposta e, em caso de erro, termina com `❌ TIMEOUT: O relatório de testes não foi recebido dentro do tempo limite.`, sem apontar a causa do problema.
2. **Na Interface Web (In-App via botão *"🔬 Executar Diagnóstico da Plataforma"*):** Ao clicar no botão, a interface do navegador congela completamente por vários segundos devido à execução 100% síncrona dos 12 módulos no thread principal de renderização. Se qualquer asserção ou módulo lançar erro, um toast genérico de 3 segundos aparece e a aplicação redireciona o usuário para a Home sem abrir o modal de diagnóstico (`#modalAuditReport`), dando a nítida sensação de que o processo "rodou e não fez nada".

---

### 1.2 Mapa Forense de Causas-Raízes

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        DIAGNÓSTICO INTEGRAL DAS CAUSAS-RAÍZES                          │
└────────────────────────────────────────────────────────────────────────────────────────┘

[CONTEXTO 1: TERMINAL CLI - python3 audit_platform.py]
  │
  ├─► 💥 CAUSA RAIZ 1: Supressão Total de Saída do Chrome (stdout/stderr = DEVNULL)
  │     └─► Chrome roda sem logging. Erros de JS, crashes ou falhas de rede são engolidos.
  │
  ├─► 💥 CAUSA RAIZ 2: Ausência de Ancoragem de Diretório no Servidor HTTP (SimpleHTTPRequestHandler)
  │     └─► O servidor serve de os.getcwd(). Se executado fora da raiz, dá 404 em index.html.
  │
  ├─► 💥 CAUSA RAIZ 3: Flags Incompletas do Chrome Headless no macOS
  │     └─► Ausência de --disable-background-timer-throttling e --window-size=1440,900
  │         faz com que o Chrome no macOS congele timers (setTimeout) e falhe asserções de layout.
  │
  ├─► 💥 CAUSA RAIZ 4: Ausência de Telemetria de Progresso em Tempo Real (Heartbeat / Streaming)
  │     └─► O loop 'while test_result is None' fica até 35s sem imprimir um único ponto ou módulo.
  │
  └─► 💥 CAUSA RAIZ 5: Cabeçalho com Versão Desatualizada (Hardcoded v1.21 vs Atual v1.35)

[CONTEXTO 2: WEB UI - Botão "Executar Diagnóstico da Plataforma" / ?autoAudit=1]
  │
  ├─► 💥 CAUSA RAIZ 6: Execução Monolítica 100% Síncrona Bloqueando a UI
  │     └─► 12 módulos rodam em sequência contínua travando o DOM e o loop de renderização.
  │
  ├─► 💥 CAUSA RAIZ 7: Mascaramento de Falhas e Omissão do Modal #modalAuditReport
  │     └─► O bloco catch de triggerPlatformAuditUI() apenas faz showToast e volta à Home,
  │         ocultando o erro e impedindo a abertura do modal de diagnóstico.
  │
  └─► 💥 CAUSA RAIZ 8: autoAudit=1 em Navegador Não Abre o Modal de Relatório
        └─► triggerAutoAudit() só roda o motor e faz POST; nunca abre o modal para o usuário.
```

---

## 2. Arquitetura da Solução e Pontos de Impacto

### 2.1 Pilares da Solução no `audit_platform.py`
1. **Ancoragem Hermética de Diretório de Trabalho:**  
   Garantir que a classe `AuditHandler` sirva expressamente a partir do diretório onde o arquivo `audit_platform.py` reside (`os.path.dirname(os.path.abspath(__file__))`), permitindo execução a partir de qualquer pasta no terminal.
2. **Flags de Robustez do Chrome Headless no macOS:**  
   Acrescentar flags obrigatórias para o engine Blink em macOS:
   - `--disable-background-timer-throttling`
   - `--disable-backgrounding-occluded-windows`
   - `--disable-renderer-backgrounding`
   - `--window-size=1440,900`
   - `--remote-debugging-port=0`
   - `--enable-logging=stderr --v=1` com captura de logs em buffer para diagnóstico.
3. **Endpoint de Telemetria e Progresso em Tempo Real (`/__test_progress__`):**  
   Implementar suporte no servidor HTTP local a `POST /__test_progress__` e requisições OPTIONS CORS. Conforme cada módulo é iniciado ou concluído em `index.html`, o script CLI imprime instantaneamente no terminal:
   ```
   [01/12] 📦 auth_rbac: 8/8 asserções validadas (14ms) ✔ PASS
   [02/12] 📦 catalogo_dados: 18/18 asserções validadas (38ms) ✔ PASS
   ...
   ```
   Elimina instantaneamente o "ele roda e não faz nada".
4. **Relatório Forense em Caso de Timeout:**  
   Se ocorrer timeout (35s), o script não deve apenas falhar: deve listar se a requisição a `/index.html` foi recebida, qual foi o último módulo notificado e as últimas linhas de log capturadas do processo Chrome.
5. **Atualização Dinâmica de Versão:**  
   Extrair a versão atual dinamicamente de `index.html` ou atualizar para a Versão `1.36` (`v8.2.3`).

### 2.2 Pilares da Solução no `index.html`
1. **Feedback Visual Imediato no Modal In-App (`#modalAuditReport`):**  
   Ao clicar em *"Executar Diagnóstico da Plataforma"*, o modal `#modalAuditReport` abre **imediatamente** exibindo um painel de progresso ativo com barra percentual e indicação do módulo corrente.
2. **Desacoplamento Assíncrono com Pausas de Renderização (`async/await` com micro-pausa):**  
   O loop dos 12 módulos é executado de forma assíncrona, cedendo o controle brevemente (`await new Promise(r => setTimeout(r, 0))`) a cada módulo para que o navegador renderize o avanço da barra de progresso.
3. **Telemetria de Módulo (`fetch('/__test_progress__')`):**  
   Ao finalizar cada módulo, se `autoAudit=1` estiver ativo, envia telemetria assíncrona não bloqueante ao servidor HTTP do Python.
4. **Exibição Obrigatória do Relatório Mesmo em Caso de Exceção Crítica:**  
   Qualquer exceção não tratada captura o erro, formata no padrão semafórico e exibe no modal `#modalAuditReport`, garantindo que o usuário visualize detalhadamente o diagnóstico.
5. **Abertura do Modal de Relatório para Execuções com `?autoAudit=1` em Navegador com UI:**  
   Se o usuário abrir `index.html?autoAudit=1` interativamente (não-headless), o modal abre automaticamente ao final.

---

## 3. Especificação de Implementação Passo a Passo (Snippets Exatos)

### Passo 1: Modernização e Blindagem do Motor CLI em `audit_platform.py`

#### 1.1 Ancoragem de Diretório e Tratamento CORS / OPTIONS no Servidor HTTP
Substituir a definição da classe `AuditHandler` e `run_server`:

```python
REPO_DIR = os.path.dirname(os.path.abspath(__file__))

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
            if not getattr(self, 'silent_mode', False):
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
        pass
```

#### 1.2 Atualização das Flags do Chrome e Buffer de Diagnóstico
Substituir o bloco de inicialização do processo Chrome em `main()` de `audit_platform.py`:

```python
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
```

#### 1.3 Diagnóstico Forense Detalhado em Caso de Timeout
Substituir a checagem pós-timeout em `main()` de `audit_platform.py`:

```python
    if test_result is None:
        chrome_log_file.close()
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
```

---

### Passo 2: Aprimoramento da UX e Motor Assíncrono em `index.html`

#### 2.1 Implementação de Estado de Carregamento Ativo no Modal `#modalAuditReport`
Adicionar layout de carregamento reativo em `triggerPlatformAuditUI()` e no corpo do modal:

```javascript
    function triggerPlatformAuditUI() {
      if (typeof closeProfileModal === 'function') closeProfileModal();
      if (window.__isPlatformAuditRunning) {
        showToast('Auditoria já em andamento. Aguarde a finalização...');
        return;
      }

      __autoAuditTriggered = true;
      window.__autoAuditTriggered = true;

      // Exibe imediatamente o modal de diagnóstico com indicador de progresso ativo
      openAuditProgressModal();

      setTimeout(async () => {
        try {
          const audit = await window.runFullPlatformAuditAsync({ module: 'all' });
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              openAuditReportModal(audit);
            });
          });
        } catch (errAudit) {
          console.error('Falha crítica na execução da auditoria:', errAudit);
          openAuditFailureModal(errAudit);
        }
      }, 50);
    }
```

#### 2.2 Criação das Funções `openAuditProgressModal()` e `openAuditFailureModal()`
Inserir logo antes de `openAuditReportModal(audit)` em `index.html`:

```javascript
    function openAuditProgressModal() {
      const modal = document.getElementById('modalAuditReport');
      if (!modal) return;

      const subEl = document.getElementById('auditReportSubtitle');
      if (subEl) subEl.textContent = 'Executando verificação em tempo real dos 12 subsistemas...';

      const bodyEl = document.getElementById('auditReportBody');
      if (bodyEl) {
        bodyEl.innerHTML = `
          <div style="padding: 24px 16px; text-align: center;">
            <div style="font-size: 36px; margin-bottom: 12px; animation: pulse 1.5s infinite;">🔬</div>
            <div style="font-weight: 800; font-size: 16px; color: var(--primary-dark); margin-bottom: 6px;" id="auditProgressTitle">
              Iniciando Diagnóstico da Plataforma...
            </div>
            <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 20px;" id="auditProgressSub">
              Preparando ambiente isolado e capturando contexto de rotas...
            </div>
            <div style="background: #E2E8F0; border-radius: 10px; height: 10px; overflow: hidden; width: 100%; max-width: 400px; margin: 0 auto 12px auto;">
              <div id="auditProgressBar" style="background: var(--primary); height: 100%; width: 5%; transition: width 0.3s ease;"></div>
            </div>
            <div style="font-size: 11px; font-weight: 700; color: var(--text-secondary);" id="auditProgressCounter">
              Módulo 0 de 12
            </div>
          </div>
        `;
      }

      modal.style.display = 'flex';
      modal.classList.add('active');
    }

    function openAuditFailureModal(error) {
      const modal = document.getElementById('modalAuditReport');
      if (!modal) return;

      const subEl = document.getElementById('auditReportSubtitle');
      if (subEl) subEl.textContent = 'Diagnóstico interrompido por exceção não tratada';

      const bodyEl = document.getElementById('auditReportBody');
      if (bodyEl) {
        bodyEl.innerHTML = `
          <div style="background: #FEF2F2; border: 1px solid #FECACA; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
              <span style="font-size: 24px;">⚠️</span>
              <div style="font-weight: 800; font-size: 14px; color: #991B1B;">
                Falha Crítica no Mecanismo de Diagnóstico
              </div>
            </div>
            <div style="font-size: 12px; color: #B91C1C; margin-bottom: 10px;">
              A auditoria não pôde ser concluída devido a um erro inesperado:
            </div>
            <pre style="background: #FFF; border: 1px solid #FCA5A5; border-radius: 6px; padding: 10px; font-size: 11px; color: #7F1D1D; white-space: pre-wrap; overflow-x: auto;">${error && error.stack ? error.stack : (error && error.message ? error.message : String(error))}</pre>
          </div>
        `;
      }

      modal.style.display = 'flex';
      modal.classList.add('active');
    }
```

#### 2.3 Motor Assíncrono com Telemetria em Tempo Real (`runFullPlatformAuditAsync`)
Implementar o motor de execução assíncrono que substitui a execução bloqueante e reporta telemetria tanto para a UI quanto para o servidor HTTP CLI:

```javascript
    window.runFullPlatformAuditAsync = async function(options) {
      options = options || {};
      const targetModule = (options.module || 'all').toLowerCase().trim();
      const startTime = performance.now();
      const stateBackup = JSON.parse(JSON.stringify(appState));
      const modulesOutput = [];
      const allResults = [];

      // 1. CAPTURA DO CONTEXTO DE ROTA E TELA ATIVA
      const activeScreenEl = document.querySelector('.app-screen.active');
      const initialScreenId = activeScreenEl ? activeScreenEl.id : 'screenHome';
      const initialIndicatorsSubTab = appState.activeIndicatorsSubTab || 'kpis';
      const initialPedagSubTab = appState.currentPedagSubTab || 'units';
      const initialHistoryFilter = appState.historyFilter || 'drafts';
      const wasGestaoView = document.getElementById('homeGestaoView')?.style.display === 'block';

      // 2. GUARDIÃO GLOBAL DEFENSIVO CONTRA DISPARO DE IMPRESSÃO
      window.__isPlatformAuditRunning = true;
      window.__auditPrintInterceptionCount = 0;
      const originalWindowPrint = window.print;
      window.print = function() {
        window.__auditPrintInterceptionCount = (window.__auditPrintInterceptionCount || 0) + 1;
        console.warn('🔇 [Auditoria SerTão Criança] Chamada a window.print() interceptada e suprimida com sucesso para preservar a UX.');
      };

      // Utilitários Canônicos UI...
      // (Mantém os utilitários UI.click, UI.type, UI.select existentes)

      function createModuleLogger(moduleId, moduleName) {
        const modResults = [];
        return {
          log: function(name, passed, details = '') {
            const item = { battery: moduleName, moduleId, name, passed, details };
            modResults.push(item);
            allResults.push(item);
            const symbol = passed ? '✅ PASS' : '❌ FAIL';
            console.log(`${symbol} | [${moduleId}] ${name} ${details ? '-> ' + details : ''}`);
          },
          getResults: function() { return modResults; }
        };
      }

      // AUDIT_MODULES permanece com a especificação canônica integral dos 12 módulos...

      try {
        console.group('🔬 INICIANDO AUDITORIA MODULAR DA PLATAFORMA (SerTão Criança)');

        const filteredModules = AUDIT_MODULES.filter(m => targetModule === 'all' || m.id === targetModule);
        const totalFilterCount = filteredModules.length;

        for (let i = 0; i < totalFilterCount; i++) {
          const mod = filteredModules[i];
          const modStartTime = performance.now();

          // Atualiza progresso visual na interface se o modal de progresso estiver aberto
          const progTitle = document.getElementById('auditProgressTitle');
          const progSub = document.getElementById('auditProgressSub');
          const progBar = document.getElementById('auditProgressBar');
          const progCounter = document.getElementById('auditProgressCounter');

          if (progTitle) progTitle.textContent = `Executando: ${mod.name}`;
          if (progSub) progSub.textContent = `Módulo ${i + 1} de ${totalFilterCount}`;
          if (progBar) progBar.style.width = `${Math.round(((i + 1) / totalFilterCount) * 100)}%`;
          if (progCounter) progCounter.textContent = `Módulo ${i + 1} de ${totalFilterCount}`;

          // Micro-pausa assíncrona para permitir repaint no compositor do navegador
          await new Promise(r => setTimeout(r, 10));

          const modLogger = createModuleLogger(mod.id, mod.name);
          try {
            mod.run(modLogger);
          } catch(e) {
            modLogger.log(`Falha crítica não tratada no módulo ${mod.id}`, false, e.message);
          }

          const results = modLogger.getResults();
          const passed = results.filter(r => r.passed).length;
          const failed = results.filter(r => !r.passed).length;
          const modDur = Math.round(performance.now() - modStartTime);
          const isModSuccess = failed === 0 && results.length > 0;

          modulesOutput.push({
            id: mod.id,
            name: mod.name,
            total: results.length,
            passed,
            failed,
            success: isModSuccess,
            results
          });

          // Telemetria em tempo real para o servidor Python CLI
          if (window.location.search && window.location.search.includes('autoAudit=1')) {
            try {
              fetch('/__test_progress__', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  index: i + 1,
                  totalModules: totalFilterCount,
                  module: mod.id,
                  passed,
                  total: results.length,
                  success: isModSuccess,
                  durationMs: modDur
                })
              }).catch(() => {});
            } catch(e) {}
          }
        }

        console.groupEnd();
      } finally {
        // Restauração Fiel e Higienização do Estado e Rotas...
        // (Mantém toda a restauração canônica de appState, saveState, applyUserRoleUI e rota de origem)
      }

      const duration = Math.round(performance.now() - startTime);
      const passedCount = allResults.filter(r => r.passed).length;
      const failedCount = allResults.filter(r => !r.passed).length;
      const allPassed = failedCount === 0 && allResults.length > 0;

      const summary = {
        timestamp: new Date().toISOString(),
        durationMs: duration,
        targetModule,
        modulesCount: modulesOutput.length,
        total: allResults.length,
        passed: passedCount,
        failed: failedCount,
        success: allPassed,
        modules: modulesOutput,
        results: allResults
      };

      window.__AUDIT_RESULTS__ = summary;

      // Envio do Relatório Final para o Servidor Python CLI com Fallback Multi-Canal
      if (window.location.search && window.location.search.includes('autoAudit=1')) {
        try {
          fetch('/__test_report__', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(summary)
          }).catch(() => {
            if (navigator.sendBeacon) {
              navigator.sendBeacon('/__test_report__', JSON.stringify(summary));
            }
          });
        } catch(e) {
          if (navigator.sendBeacon) {
            navigator.sendBeacon('/__test_report__', JSON.stringify(summary));
          }
        }
      }

      console.log(`\n🏁 AUDITORIA CONCLUÍDA: ${passedCount}/${allResults.length} asserções aprovadas em ${duration}ms (${allPassed ? '✅ 100% OK' : '⚠️ COM FALHAS'})\n`);
      return summary;
    };

    // Mantém compatibilidade síncrona com window.runFullPlatformAudit
    window.runFullPlatformAudit = function(options) {
      return window.runFullPlatformAuditAsync(options);
    };
```

#### 2.4 Atualização de `triggerAutoAudit()` para Usuários Interativos com URL
Garantir que usuários que abram a URL com `?autoAudit=1` em navegadores interativos vejam o modal de diagnóstico ao término:

```javascript
    async function triggerAutoAudit() {
      if (__autoAuditTriggered) return;
      __autoAuditTriggered = true;
      const urlParams = new URLSearchParams(window.location.search);
      const mod = urlParams.get('module') || 'all';
      setTimeout(async () => {
        const audit = await window.runFullPlatformAuditAsync({ module: mod });
        // Se estiver em navegador interativo (não-headless), abre o modal de relatório
        if (typeof openAuditReportModal === 'function') {
          openAuditReportModal(audit);
        }
      }, 150);
    }
```

---

## 4. Critérios de Aceite e Roteiro de Teste/Validação

### 4.1 Validação Sintática Pré-Voo (JSC)
- [ ] Executar `python3 audit_platform.py --check-syntax` e obter:
  `✅ Sintaxe do JavaScript em 'index.html' validada com sucesso via JavaScriptCore (macOS).`

### 4.2 Validação da Execução CLI com Telemetria em Tempo Real
- [ ] Executar `python3 audit_platform.py`:
  - Verificar que o terminal imprime a progressão de cada um dos 12 módulos de forma progressiva e em tempo real:
    `[01/12] 📦 auth_rbac... ✔ PASS`
    `[02/12] 📦 catalogo_dados... ✔ PASS`
    `...`
    `[12/12] 📦 navegacao_layout... ✔ PASS`
  - Confirmar ausência de longos silêncios ou travamentos ("roda e não faz nada").
  - Confirmar aprovação integral de 100% dos testes determinísticos.
- [ ] Executar `python3 audit_platform.py --module auth_rbac`:
  - Confirmar execução ultrarrápida do módulo isolado com telemetria ativa.

### 4.3 Validação de Ancoragem de Diretório
- [ ] Executar a partir de outro diretório (ex: `cd /tmp && python3 /Users/bruno/Desktop/gestor\ supervisao_patos/audit_platform.py`):
  - Confirmar que o servidor local serve corretamente o `index.html` a partir da raiz do repositório, sem 404 e sem timeout.

### 4.4 Validação In-App (Interface Web)
- [ ] Na aplicação, clicar no avatar do perfil (`#headerAvatarBtn`) e acionar *"🔬 Executar Diagnóstico da Plataforma"*:
  - Confirmar que o modal `#modalAuditReport` abre de imediato no estado de progresso com animação e barra de avanço.
  - Confirmar que os 12 módulos avançam de forma visível e fluida.
  - Confirmar que, ao final, o painel do semáforo com os 12 módulos aprovados é renderizado com o botão *"Concluir e Voltar à Plataforma"*.
  - Confirmar ausência de redirecionamento involuntário para a Home ou congelamento da página.

### 4.5 Sincronização e Changelog Duplo
- [ ] Sincronizar simultaneamente:
  - `index.html` (raiz)
  - `firebase_deploy/public/index.html`
- [ ] Atualizar `CHANGELOG.md` com a **Versão 1.36 (v8.2.3)**.
- [ ] Atualizar o botão `.btn-changelog` (`Versão 1.36 (v8.2.3)`) e o modal `#modalChangelog` em `index.html`.

---

## 5. Seção Obrigatória: Alterações / Adições / Exclusões no Algoritmo de Auditoria (`audit_platform.py`)

Em rigoroso cumprimento ao item 5 do `WORKFLOW_MACOS.md`, esta seção detalha o mapeamento estrito das intervenções na suíte de testes:

### 5.1 Adições no Algoritmo de Auditoria
1. **Endpoint `POST /__test_progress__` no Servidor HTTP:**  
   Adição de rota dedicada para telemetria em tempo real dos 12 módulos com atualização instantânea na CLI.
2. **Suporte a Requisições OPTIONS (CORS Preflight):**  
   Adição do método `do_OPTIONS` para garantir compatibilidade universal de headers `Content-Type: application/json`.
3. **Módulo de Diagnóstico Pós-Timeout com Leitura de Buffer do Chrome:**  
   Captura de `stdout` e `stderr` do Chrome em arquivo de depuração temporário para despejo forense detalhado em caso de timeout.
4. **Ancoragem Canônica `directory=REPO_DIR`:**  
   Adição explícita do caminho do repositório na instanciação de `AuditHandler`.

### 5.2 Alterações nas Asserções Existentes (Módulo 12 - `navegacao_layout`)
1. **Validação do Motor Assíncrono e Telemetria:**  
   Adicionar asserção no Módulo 12 verificando a existência das funções `window.runFullPlatformAuditAsync`, `openAuditProgressModal` e `openAuditFailureModal`.
2. **Asserção de Integridade do Cabeçalho e Registro da Versão 1.36:**  
   Atualizar a verificação do botão `.btn-changelog` e do card `#modalChangelog` para `Versão 1.36 (v8.2.3)`.

### 5.3 Exclusões
1. **Exclusão do Redirecionamento Cego em Falha:**  
   Remover o comportamento de apenas emitir toast e redirecionar para a Home no bloco `catch` de `triggerPlatformAuditUI`, substituindo pela renderização transparente do erro no modal `#modalAuditReport`.
2. **Exclusão de `subprocess.DEVNULL` nos descritores do Chrome:**  
   Substituir descarte de logs por arquivo de buffer rotativo para diagnóstico forense.
