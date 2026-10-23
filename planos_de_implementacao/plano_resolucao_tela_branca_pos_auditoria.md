# Plano de Implementação: Resolução Definitiva da Tela Branca Pós-Auditoria da Plataforma

> **Diretriz de Execução (Obrigatório):**  
> O assistente executor da **Etapa 2 (Operário)** DEVE OBRIGATORIAMENTE ler e seguir integralmente as diretrizes do arquivo [WORKFLOW_MACOS.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md) e do [WORKFLOW_GITHUB.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_GITHUB.md) antes de aplicar quaisquer modificações no código-fonte. A execução deve ser estrita, cirúrgica e atenta à dupla checagem, versionamento sequencial duplo (`CHANGELOG.md` e `#modalChangelog`), criação de cópia intermediária em `intermediárias/` e execução do algoritmo de auditoria pós-deploy.

---

> **Status:** 📐 Planejamento Concluído (Etapa 1 - Arquiteto)  
> **Data:** 22/10/2026  
> **Versão Alvo:** `1.18` (`v7.96`)  
> **Arquivo de Backup Intermediário:** `intermediárias/aplicativo_v118_resolucao_tela_branca_pos_auditoria.html`  
> **Arquivos Principais Afetados:**  
> - `index.html` (raiz da aplicação)  
> - `firebase_deploy/public/index.html` (cópia espelho de produção)  
> - `audit_platform.py` (algoritmo automatizado de testes)  
> - `CHANGELOG.md` (registro histórico unificado)  

---

## 1. Diagnóstico do Problema e Análise Forense da Causa-Raiz

### 1.1 Sintoma Relatado
Ao executar o diagnóstico de verificação automatizada diretamente pela interface web da plataforma (acionado através do menu do perfil do usuário `#headerAvatarBtn` ➔ botão *"🔬 Executar Diagnóstico da Plataforma"* / `triggerPlatformAuditUI()`), a aplicação entra em estado de **tela inteiramente branca** (White Screen of Death - WSOD). O usuário perde toda a navegação, cards, tabelas e botões do sistema, sendo obrigado a recarregar manualmente a página do navegador (`F5` / `Cmd+R`) para voltar a operar a ferramenta.

---

### 1.2 Mapa Forense de Causa-Raiz (Diagnóstico Sistêmico)

A investigação do motor de execução, do ciclo de vida das rotas e do pipeline de renderização do navegador identificou **cinco causas raízes encadeadas** que provocam esse comportamento:

```
[Usuário na tela "Indicadores", "Histórico" ou "Home"]
       │
       ▼ Clica em "🔬 Executar Diagnóstico da Plataforma" (#modalProfile)
[triggerPlatformAuditUI()]
       │
       ├─► 💥 CAUSA RAIZ 1: Ausência da flag __autoAuditTriggered = true na UI
       │     └─► Módulo 12 lança erro por falta da trava anti-reentrância e falha.
       │
       ├─► Execução síncrona pesada de 12 módulos com mutações massivas de DOM.
       │
       ├─► Bloco finally de [runFullPlatformAudit]:
       │     ├─► Restaura appState = stateBackup
       │     ├─► 💥 CAUSA RAIZ 2: Invocação de funções inexistentes na restauração:
       │     │     ├─► screenSetup tenta openObservationSetupScreen() [Inexistente -> correto é openSetupScreen()]
       │     │     ├─► screenActiveObs tenta renderActiveObsScreen() [Inexistente -> correto é renderActiveObservation()]
       │     │     └─► screenSynthesis passa stateBackup.currentObs para renderSynthesisScreen [Assinatura incorreta]
       │     │     └─► Lança TypeError -> cai no catch e tenta navigateToTab('home')
       │     │
       │     └─► 💥 CAUSA RAIZ 3: Falha Estrutural do navigateToTab:
       │           ├─► Executa: document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));
       │           │     └─► TODAS as telas recebem display: none !important.
       │           ├─► Executa renderHomeScreen() ANTES de adicionar .active na tela!
       │           ├─► Se renderHomeScreen lançar QUALQUER exceção (ex: resquício de mock da auditoria):
       │           │     └─► screenHome.classList.add('active') NUNCA é executado!
       │           └─► NENHUMA tela ganha a classe .active -> A TELA FICA 100% BRANCA!
       │
       ├─► Retorno a triggerPlatformAuditUI:
       │     └─► 💥 CAUSA RAIZ 4: Disparo de alert() nativo síncrono imediatamente após mutação
       │           ├─► alert() suspende a fila de macrotasks e congela o compositor do browser (Blink/WebKit).
       │           └─► O ciclo de repaint é descartado com a tela em branco/geometria de 0px.
       │
       └─► 💥 CAUSA RAIZ 5: Classes residuais no <body> (ex: printing-teacher-devolutiva)
             └─► Se o timer assíncrono do Módulo 11 colidir, as regras de @media print
                 escondem o layout da aplicação.
```

---

### 1.3 Detalhamento das Causas Raízes

#### Causa Raiz 1: Ausência de Ativação de `__autoAuditTriggered` no Disparo via Interface
Na linha 24133 de `index.html`, o Módulo 12 da auditoria valida rigorosamente:
```javascript
if (typeof __autoAuditTriggered === 'undefined' || !__autoAuditTriggered) {
  throw new Error('Motor de auditoria deve declarar e acionar trava booleana anti-reentrância __autoAuditTriggered');
}
```
Contudo, `__autoAuditTriggered` só era alterado para `true` dentro de `triggerAutoAudit()` (acionado exclusivamente quando a URL possuía `?autoAudit=1`). Na interface gráfica (`triggerPlatformAuditUI`), a trava permanecia `false`. Ao rodar via interface, o Módulo 12 lançava exceção e abortava a validação visual do layout.

#### Causa Raiz 2: Chamada de Funções Inexistentes no Bloco `finally` de Restauração de Rota
No bloco `finally` de `window.runFullPlatformAudit` (linhas 24128 a 24139 de `index.html`):
- Para `screenSetup`: tenta invocar `openObservationSetupScreen()`. Essa função **NÃO existe** no codebase (a função canônica declarada no escopo global é `openSetupScreen()`).
- Para `screenActiveObs`: tenta invocar `renderActiveObsScreen()`. Essa função **NÃO existe** (a função canônica é `renderActiveObservation()`).
- Para `screenSynthesis`: invoca `renderSynthesisScreen(stateBackup.currentObs)`. A assinatura oficial de `renderSynthesisScreen` é `renderSynthesisScreen(preserveScroll = false)`, lendo o estado diretamente de `appState.currentObs`.
Essas chamadas lançavam `TypeError`, abortando a restauração original da tela e caindo no bloco `catch(errRestore)`.

#### Causa Raiz 3: Inversão na Aplicação de Classes Ativas em `navigateToTab` (Causa Primária da Tela Branca)
Em `navigateToTab(tabName)`:
```javascript
document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));
document.querySelectorAll('.nav-link, .tabbar-item').forEach(t => t.classList.remove('active'));

if (tabName === 'home') {
  document.getElementById('deskTabHome')?.classList.add('active');
  document.getElementById('mobTabHome')?.classList.add('active');
  renderHomeScreen(); // <--- SE ESTA FUNÇÃO FALHAR, A PRÓXIMA LINHA NUNCA RODA!
  document.getElementById('screenHome').classList.add('active');
}
```
Como o CSS declara:
```css
.app-screen { display: none; }
.app-screen.active { display: block; }
```
Se qualquer erro ocorrer durante a execução de `renderHomeScreen()`, `renderIndicatorsScreen()` ou `renderScheduleScreen()`, a linha `screen.classList.add('active')` é pulada. Como **todas** as telas tiveram `.active` removido na primeira linha, **todas as telas ficam com `display: none`**. O contêiner principal `<main>` fica com 0px de altura e a janela fica totalmente em branco!

#### Causa Raiz 4: Congelamento do Compositor de Renderização por `alert()` Nativo
Em `triggerPlatformAuditUI()`:
```javascript
const audit = window.runFullPlatformAudit({ module: 'all' });
if (audit.success) {
  alert(`✅ Diagnóstico da Plataforma Concluído com Sucesso!...`);
}
```
A suíte executa centenas de manipulações de DOM no thread principal. Imediatamente após isso, sem conceder um frame de animação (`requestAnimationFrame`) para o navegador recalcular a árvore de renderização (Layout/Reflow e Paint), o código invoca `alert()` síncrono. No macOS (Safari e Chrome), a chamada ao `alert()` suspende a renderização. Se o DOM estiver transitoriamente desocupado ou em transição de classes, o navegador congela o buffer de tela em branco. Ao fechar o alert, a engine não força a invalidação de geometria, mantendo a tela vazia.

#### Causa Raiz 5: Resíduos de Classes de Impressão e Elementos Fantasma no `body`
Durante a execução do Módulo 11 (`backup_exportacao`), o método `printIndividualTeacherDevolutiva` injeta nós temporários em `#teacherIndividualDevolutivaPrintSection` e adiciona `body.classList.add('printing-teacher-devolutiva')`. Se o encadeamento de timers sofrer atraso de microtasks enquanto a auditoria termina, as regras `@media print` deixam os elementos da aplicação com `display: none !important`.

---

## 2. Arquitetura da Solução Técnica (Os 5 Pilares de Correção)

```
┌────────────────────────────────────────────────────────────────────────┐
│                      ARQUITETURA DA SOLUÇÃO (v1.18)                    │
├────────────────────────────────────────────────────────────────────────┤
│ 1. MODAL IN-APP NÃO-BLOQUEANTE (#modalAuditReport)                     │
│    - Extinção total de window.alert() na UI de diagnóstico.            │
│    - Renderização de painel nativo rico, acessível e responsivo.       │
│    - Desacoplamento via double requestAnimationFrame (zero congelamento)│
├────────────────────────────────────────────────────────────────────────┤
│ 2. RESTAURAÇÃO CANÔNICA DE ROTAS NO FINALLY                            │
│    - openSetupScreen() (corrigido).                                    │
│    - renderActiveObservation() com restauração prévia de currentObs.    │
│    - renderSynthesisScreen() aderente à assinatura oficial.            │
├────────────────────────────────────────────────────────────────────────┤
│ 3. BLINDAGEM FAIL-SAFE DE NAVEGAÇÃO (Error Boundary em navigateToTab)  │
│    - Aplicação IMEDIATA de .active na tela alvo ANTES do render.       │
│    - Encapsulamento try/catch defensivo nos renderizadores de tela.    │
│    - Fallback visual amigável caso ocorra erro (impossível tela branca)│
├────────────────────────────────────────────────────────────────────────┤
│ 4. SINCRONIZAÇÃO DA TRAVA ANTI-REENTRÂNCIA (__autoAuditTriggered)       │
│    - Inicialização correta no disparo via UI e via URL.                │
│    - Cooldown de liberação controlada para reexecuções seguras.        │
├────────────────────────────────────────────────────────────────────────┤
│ 5. HIGIENIZAÇÃO INTEGRAL DO DOM E BODY PÓS-AUDITORIA                   │
│    - Remoção mandatória de classes de impressão no body.               │
│    - Limpeza de containers temporários e reflow forçado limpo.         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Plano Detalhado de Implementação (Passo a Passo)

### Passo 1: Construção do Modal In-App de Relatório de Diagnóstico (`#modalAuditReport`)
No arquivo `index.html`, criar o modal nativo seguindo o padrão visual do SerTão Criança:
- ID: `modalAuditReport`.
- Estrutura:
  - Fundo translúcido com `modal-backdrop`.
  - Painel central com bordas arredondadas (`border-radius: 16px`), sombra suave e largura máxima de 650px.
  - Cabeçalho com ícone `🔬`, título *"Diagnóstico da Plataforma"*, tempo total de execução (`X ms`) e badge de status (`🟢 12/12 Módulos Operacionais` ou `🟡 Alertas Identificados`).
  - Lista de módulos com badges coloridos (verde para sucesso, vermelho para falha), quantidade de asserções executadas e detalhes de eventuais falhas.
  - Botão de ação *"Concluir e Voltar à Plataforma"* com fechamento imediato via `closeAuditReportModal()`.

```html
<!-- MODAL DE DIAGNÓSTICO E AUDITORIA DA PLATAFORMA (SerTão Criança) -->
<div id="modalAuditReport" class="modal-backdrop" style="display:none; z-index: 10000;" onclick="closeAuditReportModal()">
  <div class="modal-panel" style="max-width: 680px; width: 95%; max-height: 90vh; display: flex; flex-direction: column;" onclick="event.stopPropagation()">
    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 16px; margin-bottom: 16px;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 24px;">🔬</span>
        <div>
          <h3 style="margin: 0; font-size: 18px; font-weight: 800; color: var(--primary-dark);">Diagnóstico de Integridade da Plataforma</h3>
          <p style="margin: 0; font-size: 12px; color: var(--text-muted);" id="auditReportSubtitle">Verificação contínua dos 12 subsistemas</p>
        </div>
      </div>
      <button class="btn btn-secondary" onclick="closeAuditReportModal()" style="padding: 6px 12px; font-size: 13px;">✕</button>
    </div>

    <!-- Body com Resumo e Lista de Módulos -->
    <div style="flex: 1; overflow-y: auto; padding-right: 4px;" id="auditReportBody">
      <!-- Injetado dinamicamente via renderAuditReportContent(audit) -->
    </div>

    <!-- Footer -->
    <div style="border-top: 1px solid var(--border-color); padding-top: 14px; margin-top: 16px; display: flex; justify-content: flex-end;">
      <button class="btn btn-primary" onclick="closeAuditReportModal()" style="font-weight: 700;">
        Concluir e Voltar à Plataforma
      </button>
    </div>
  </div>
</div>
```

---

### Passo 2: Refatoração de `triggerPlatformAuditUI()` com Desacoplamento Assíncrono
Substituir o `alert()` nativo por `openAuditReportModal(audit)` e utilizar o pipeline de dois frames (`double requestAnimationFrame`) para garantir que o navegador complete a recomposição do layout antes de apresentar o modal:

```javascript
function triggerPlatformAuditUI() {
  if (typeof closeProfileModal === 'function') closeProfileModal();
  if (window.__isPlatformAuditRunning) {
    showToast('Auditoria já em andamento. Aguarde a finalização...');
    return;
  }

  // Ativação canônica da trava de auditoria
  __autoAuditTriggered = true;
  window.__autoAuditTriggered = true;

  showToast('Iniciando diagnóstico automatizado da plataforma (12 módulos)...');

  // Aguarda 100ms para fechamento do modal de perfil e repaint
  setTimeout(() => {
    try {
      const audit = window.runFullPlatformAudit({ module: 'all' });
      
      // Desacoplamento assíncrono via double rAF para garantir repaint completo da UI
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          openAuditReportModal(audit);
        });
      });
    } catch (errAudit) {
      console.error('Falha crítica na execução da auditoria:', errAudit);
      showToast('Ocorreu uma falha no diagnóstico. Verifique o console.');
      navigateToTab('home');
    }
  }, 100);
}
```

---

### Passo 3: Correção Cirúrgica das Funções de Rota no Bloco `finally` de `runFullPlatformAudit`
No arquivo `index.html`, substituir as chamadas para as funções reais:
1. `openObservationSetupScreen` ➔ `openSetupScreen()`.
2. `renderActiveObsScreen` ➔ `appState.currentObs = stateBackup.currentObs; renderActiveObservation();`.
3. `renderSynthesisScreen(stateBackup.currentObs)` ➔ `appState.currentObs = stateBackup.currentObs; renderSynthesisScreen();`.

Código exato a ser aplicado no `finally`:
```javascript
// Restauração Fiel da Tela e Sub-aba de Origem do Usuário
try {
  if (initialScreenId === 'screenHome') {
    if (wasGestaoView) {
      navigateToTab(initialPedagSubTab === 'team' ? 'team' : 'units');
    } else {
      navigateToTab('home');
    }
  } else if (initialScreenId === 'screenSchedule') {
    navigateToTab('schedule');
  } else if (initialScreenId === 'screenIndicators') {
    navigateToTab('indicators');
    if (typeof switchIndicatorsSubTab === 'function') {
      switchIndicatorsSubTab(initialIndicatorsSubTab);
    }
  } else if (initialScreenId === 'screenHistory') {
    navigateToTab('history', initialHistoryFilter);
  } else if (initialScreenId === 'screenNotes') {
    navigateToTab('notes');
  } else if (initialScreenId === 'screenRefDocs') {
    navigateToTab('refDocs');
  } else if (initialScreenId === 'screenRubricsAdmin') {
    navigateToTab('rubrics');
  } else if (initialScreenId === 'screenSetup') {
    if (typeof openSetupScreen === 'function') {
      openSetupScreen();
    } else {
      navigateToTab('home');
    }
  } else if (initialScreenId === 'screenActiveObs') {
    if (stateBackup.currentObs && typeof renderActiveObservation === 'function') {
      appState.currentObs = stateBackup.currentObs;
      renderActiveObservation();
    } else {
      navigateToTab('home');
    }
  } else if (initialScreenId === 'screenSynthesis') {
    if (stateBackup.currentObs && typeof renderSynthesisScreen === 'function') {
      appState.currentObs = stateBackup.currentObs;
      renderSynthesisScreen();
    } else {
      navigateToTab('home');
    }
  } else {
    navigateToTab('home');
  }
} catch(errRestore) {
  console.warn('Aviso na restauração de rota pós-auditoria:', errRestore);
  navigateToTab('home');
}
```

---

### Passo 4: Blindagem Fail-Safe em `navigateToTab` (Error Boundary & Ativação Prévia)
Refatorar `navigateToTab(tabName, subFilter)` para:
1. Mapear o elemento de destino (`targetScreenEl`) logo no início;
2. Marcar a tela com `.active` imediatamente;
3. Executar o `render...Screen()` dentro de um bloco protegido `try/catch`. Caso a renderização falhe, a tela **NUNCA** fica em branco: exibe-se um card de recuperação limpo com botão para tentar novamente.

Exemplo de arquitetura defensiva para `navigateToTab`:
```javascript
// Garantia absoluta de visibilidade prévia da tela alvo
const screenMap = {
  'home': 'screenHome',
  'opManagement': 'screenHome',
  'units': 'screenHome',
  'team': 'screenHome',
  'schedule': 'screenSchedule',
  'indicators': 'screenIndicators',
  'history': 'screenHistory',
  'notes': 'screenNotes',
  'refDocs': 'screenRefDocs',
  'rubrics': 'screenRubricsAdmin'
};

const targetId = screenMap[tabName] || 'screenHome';
const targetEl = document.getElementById(targetId);

// Remove active das demais telas
document.querySelectorAll('.app-screen').forEach(s => {
  if (s.id !== targetId) s.classList.remove('active');
});

// Garante que a tela alvo SEMPRE receba a classe active
if (targetEl) {
  targetEl.classList.add('active');
}

// Renderização segura encapsulada
try {
  if (tabName === 'home') {
    renderHomeScreen();
  } else if (tabName === 'indicators') {
    renderIndicatorsScreen();
  } else if (tabName === 'schedule') {
    renderScheduleScreen();
  } else if (tabName === 'history') {
    if (subFilter) appState.historyFilter = subFilter;
    renderHistoryScreen();
  } else if (tabName === 'notes') {
    renderNotesScreen();
  } else if (tabName === 'refDocs') {
    renderRefDocsScreen();
  }
} catch (errRender) {
  console.error(`Erro de renderização ao navegar para [${tabName}]:`, errRender);
  if (targetEl && !targetEl.innerHTML.trim()) {
    targetEl.innerHTML = `
      <div class="card" style="margin: 20px; text-align: center; padding: 30px;">
        <h3 style="color: var(--primary);">Recuperação Automática de Interface</h3>
        <p style="color: var(--text-muted); margin: 12px 0;">Ocorreu uma instabilidade pontual ao carregar esta tela.</p>
        <button class="btn btn-primary" onclick="navigateToTab('home')">Voltar ao Início</button>
      </div>
    `;
  }
}
```

---

### Passo 5: Higienização Mandatória do DOM e Reflow Forçado no `finally` de `runFullPlatformAudit`
No final do bloco `finally` de `runFullPlatformAudit`:
1. Remover classes de impressão residuais do `document.body`:
   ```javascript
   document.body.classList.remove('printing-teacher-devolutiva', 'is-printing', 'print-preview');
   ```
2. Limpar o container de impressão:
   ```javascript
   const devPrint = document.getElementById('teacherIndividualDevolutivaPrintSection');
   if (devPrint) devPrint.innerHTML = '';
   ```
3. Forçar reflow visual limpo:
   ```javascript
   void document.body.offsetHeight;
   ```
4. Resetar scroll do topo da tela:
   ```javascript
   window.scrollTo(0, 0);
   ```

---

## 4. Gestão Dupla do Changelog (Versão 1.18)

Conforme a diretriz do [WORKFLOW_MACOS.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md), registrar a versão **1.18** de forma idêntica em:
1. `CHANGELOG.md`
2. Modal `#modalChangelog` no `index.html` e `firebase_deploy/public/index.html`.

**Texto de Registro:**
> **Versão 1.18 (22/10/2026):** Resolução definitiva da tela branca pós-auditoria da plataforma. Substituição do `window.alert()` nativo bloqueante pelo modal in-app acessível `#modalAuditReport` com desacoplamento via duplo `requestAnimationFrame`, correção das funções de restauração de tela (`openSetupScreen`, `renderActiveObservation`, `renderSynthesisScreen`), blindagem defensiva contra telas inativas em `navigateToTab`, compatibilização universal da trava anti-reentrância `__autoAuditTriggered` e higienização estrita de classes de impressão residuais no `body`.

---

## 5. Sincronização dos Ambientes Espelhados
Aplicar rigorosamente as mesmas modificações em:
1. `gestor supervisao_patos/index.html`
2. `gestor supervisao_patos/firebase_deploy/public/index.html`
3. Salvar cópia integral em:
   `intermediárias/aplicativo_v118_resolucao_tela_branca_pos_auditoria.html`

---

## 6. Seção Obrigatória de Auditoria (Modo-a-Modo)

Conforme estipulado no protocolo [WORKFLOW_MACOS.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md), apresenta-se a relação estruturada módulo-a-módulo de todas as alterações, adições e exclusões no algoritmo de auditoria da plataforma (`audit_platform.py` e engine interna do `index.html`), assegurando 100% de cobertura.

### 6.1 Alterações no Motor Interno de Testes (`index.html`)

| Módulo | Tipo de Alteração | Descrição Detalhada da Alteração |
| :--- | :---: | :--- |
| **Módulo 11 (`backup_exportacao`)** | **Alteração** | Assegurar que ao final do teste de impressão em lote e ficha individual, a suíte limpe imediatamente a classe `.printing-teacher-devolutiva` de `document.body` e o HTML de `#teacherIndividualDevolutivaPrintSection`, sem depender de temporizadores assíncronos que ultrapassem a conclusão da suíte. |
| **Módulo 12 (`navegacao_layout`)** | **Alteração** | Atualizar a asserção 11 de blindagem anti-reentrância: validar que a variável `__autoAuditTriggered` (ou `window.__autoAuditTriggered`) é reconhecida e respeitada tanto no disparo via URL quanto via interface (`triggerPlatformAuditUI()`), com reset defensivo após conclusão. |
| **Módulo 12 (`navegacao_layout`)** | **Adição** | **Asserção de Ausência de Tela Branca (WSOD):** Validar que, após a navegação por todas as abas, exatamente uma tela possui a classe `.active` e que a altura renderizada da tela ativa é superior a zero (`targetEl.getBoundingClientRect().height > 0`). |
| **Módulo 12 (`navegacao_layout`)** | **Adição** | **Validação do Modal In-App de Relatório:** Validar que o elemento `#modalAuditReport` existe no DOM, possui estrutura semântica (cabeçalho, corpo de resultados e botão de fechar) e que `openAuditReportModal` e `closeAuditReportModal` alternam sua visibilidade sem erros. |
| **Módulo 12 (`navegacao_layout`)** | **Exclusão** | Eliminação completa de asserções que dependiam ou toleravam `window.alert()` no fluxo de auditoria pela interface de usuário. |

### 6.2 Alterações no Algoritmo de Auditoria Automatizada (`audit_platform.py`)

| Módulo / Teste | Tipo | Descrição Detalhada da Alteração |
| :--- | :---: | :--- |
| **Bateria CLI Headless (`audit_platform.py`)** | **Alteração** | Manter a execução de 100% dos 12 módulos determinísticos via URL `?autoAudit=1`, verificando que o motor atinge 134+ asserções aprovadas com 0 falhas (`100% de sucesso`). |
| **Novo Teste E2E de Diagnóstico UI (`audit_platform.py`)** | **Adição** | Adicionar passo de emulação no script python via Chrome DevTools Protocol (CDP) que: <br>1. Inicia a plataforma na tela inicial sem `autoAudit=1`; <br>2. Abre o modal de perfil do usuário (`#headerAvatarBtn`); <br>3. Dispara a auditoria via clique em `triggerPlatformAuditUI()`; <br>4. Aguarda a finalização dos 12 módulos; <br>5. Verifica que o modal `#modalAuditReport` é exibido com sucesso; <br>6. Verifica que a tela de fundo **NÃO** está em branco (possui nós DOM visíveis com `display: block` e altura > 200px); <br>7. Simula o clique em "Concluir e Voltar" e atesta o retorno operacional completo do sistema. |
| **Critério de Saída Pós-Deploy** | **Manutenção** | Execução de `python3 audit_platform.py --silent-on-success` com comunicação restrita exclusivamente a problemas/falhas, conforme a norma mandatória do projeto. |

---

## 7. Critérios de Aceite e Verificação Final

1. **Eliminação Total da Tela Branca:** Ao clicar em *"🔬 Executar Diagnóstico da Plataforma"* em qualquer tela (Home, Indicadores, Cronograma, Histórico, Bloco de Notas ou Matrizes), o sistema deve executar todos os testes e exibir o modal in-app `#modalAuditReport` com a tela de fundo perfeitamente preservada e operável.
2. **Navegação Íntegra Pós-Diagnóstico:** Ao fechar o modal de diagnóstico, o usuário deve continuar exatamente na tela onde estava, com todos os filtros, abas e seleções mantidos.
3. **Ausência de Diálogos Nativos Bloqueantes:** Nenhuma chamada a `window.alert()` ou `window.print()` deve ser disparada durante a auditoria pela interface.
4. **100% de Aprovação no Algoritmo de Auditoria:** `python3 audit_platform.py` deve retornar 0 falhas e todas as asserções verdes.
5. **Comunicação Restrita a Falhas:** Após o deploy no GitHub Pages, reportar apenas a confirmação limpa e sucinta de sucesso.
