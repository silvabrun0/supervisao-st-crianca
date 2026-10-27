# Plano de Implementação: Resolução Definitiva da Tela Branca Inicial e Blindagem de Ciclos Avaliativos

> **Diretriz de Execução (Obrigatório):**  
> O assistente executor da **Etapa 2 (Operário)** DEVE OBRIGATORIAMENTE ler e seguir integralmente as diretrizes do arquivo [WORKFLOW_MACOS.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md), do [WORKFLOW_GITHUB.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_GITHUB.md) e da skill [execucao-operario](file:///Users/bruno/Desktop/gestor%20supervisao_patos/.agents/skills/execucao-operario/SKILL.md) antes de aplicar quaisquer modificações no código-fonte. A execução deve ser estrita, cirúrgica, atenta à dupla checagem, validação pré-voo JSC (`python3 audit_platform.py --check-syntax`), versionamento sequencial duplo (`CHANGELOG.md` e `#modalChangelog`), criação de cópia intermediária em `intermediárias/`, push para `main` e execução da auditoria modular pós-deploy.

---

> **Status:** 🚀 Execução Concluída (Etapa 2 - Operário)  
> **Data:** 27/10/2026  
> **Versão Alvo:** `1.37` (`v8.2.4`)  
> **Arquivo de Backup Intermediário:** `intermediárias/aplicativo_v137_resolucao_tela_branca_inicial_e_blindagem_ciclos.html`  
> **Arquivos Principais Afetados:**  
> - `index.html` (raiz da aplicação)  
> - `firebase_deploy/public/index.html` (cópia espelho de produção)  
> - `audit_platform.py` (validações sintáticas e pós-deploy)  
> - `CHANGELOG.md` (registro histórico unificado)  

---

## 1. Diagnóstico do Problema e Análise Forense da Causa-Raiz

### 1.1 Sintoma Relatado
Ao abrir ou recarregar a plataforma SerTão Criança, o usuário se depara com a **tela inicial inteiramente em branco**, sem a apresentação dos cards de rascunhos, cronograma, banners ou gestão. Contudo, ao clicar em qualquer outra aba de navegação (como *"Cronograma"* ou *"Painel & Indicadores"*) e em seguida clicar de volta na primeira aba (*"Início"* / *"Gestão Pedagógica"*), a tela inicial passa a renderizar perfeitamente todo o seu conteúdo.

---

### 1.2 Mapa Forense de Causa-Raiz (Diagnóstico Sistêmico)

A investigação do fluxo de inicialização via motor JavaScriptCore e análise estática identificou **três causas raízes encadeadas** que culminam nesse bug:

```
[Carregamento Inicial da Página no Navegador]
       │
       ▼ Evento 'DOMContentLoaded' dispara no boot
[loadState()]
       │
       ├─► checkAndAutoArchive(true)
       │
       ├─► applyUserRoleUI()
       │     │
       │     └─► Invocação de renderGlobalAcademicYearSelector() (Linha 10674)
       │           │
       │           ▼
       │     💥 CAUSA RAIZ 1: Variáveis Globais Órfãs / Inexistentes (Linhas 24148 e 24151)
       │           ├─► if (!appState.academicYears ...) appState.academicYears = [...DEFAULT_ACADEMIC_YEARS];
       │           ├─► if (!appState.selectedAcademicYear ...) appState.selectedAcademicYear = DEFAULT_SELECTED_ACADEMIC_YEAR;
       │           └─► 💥 ReferenceError: Can't find variable: DEFAULT_ACADEMIC_YEARS
       │
       ├─► 💥 CAUSA RAIZ 2: Interrupção Crítica do Pipeline de Inicialização
       │     ├─► O ReferenceError não tratado estoura e aborta applyUserRoleUI() e loadState().
       │     ├─► A linha 9621: navigateToTab('home') NUNCA É ALCANÇADA!
       │     ├─► A linha 24482: renderHomeScreen() NUNCA É ALCANÇADA!
       │     └─► #screenHome permanece com altura 0 / despopulado (drafts vazios, scheduled display:none).
       │           └─► RESULTADO: Tela inicial fica completamente em branco (WSOD parcial).
       │
       ├─► 💥 CAUSA RAIZ 3: Ciclo de Vida Frágil (window.addEventListener vs document.readyState)
       │     └─► Linha 24480: window.addEventListener('DOMContentLoaded', ...) sem verificação de
       │         document.readyState ('interactive'/'complete') e sem escuta direta em document.
       │
       ▼ Usuário clica em outra aba ("Cronograma" ou "Painel & Indicadores")
[navigateToTab('schedule')]
       │
       ├─► Executa renderScheduleScreen() sem acionar renderGlobalAcademicYearSelector(). Funciona!
       │
       ▼ Usuário clica de volta em "Início" / "Gestão Pedagógica"
[navigateToTab('home')]
       │
       ├─► Executa renderHomeScreen() diretamente, sem passar por applyUserRoleUI().
       ├─► Popula rascunhos, cronograma pendente e unidades.
       └─► A tela inicial é renderizada com sucesso!
```

### 1.3 Detalhamento Forense das Falhas

1. **Ausência das Constantes Canônicas de Ciclo:**
   - Na implementação do Pilar 15 (Ciclos Avaliativos & Calendário), as funções `renderGlobalAcademicYearSelector()`, `loadBimesterPeriodsForModalYear()`, `resetBimesterPeriodsToDefault()` e `handleCreateNewAcademicYearSubmit()` referenciaram:
     - `DEFAULT_ACADEMIC_YEARS` (Linha 24148)
     - `DEFAULT_SELECTED_ACADEMIC_YEAR` (Linha 24151)
     - `DEFAULT_BIMESTER_PERIODS_BY_YEAR` (Linhas 24239, 24250, 24322, 24392)
   - Nenhuma dessas três constantes foi declarada no topo do script com `const`, gerando `ReferenceError` fatal imediato quando `appState.academicYears` não existe no `localStorage`.
2. **Falta de Inicialização Padrão em `appState`:**
   - Na linha 9449 (`let appState = { ... }`), as propriedades `academicYears: ['2026', '2025']` e `selectedAcademicYear: '2026'` não foram incluídas no estado inicial padrão, deixando-as como `undefined` em novos acessos ou sessões limpas.
3. **Ausência de Isolamento Defensivo (`try/catch`) no Seletor de Ano Letivo:**
   - A chamada `renderGlobalAcademicYearSelector()` dentro de `applyUserRoleUI()` não possuía encapsulamento defensivo. Qualquer inconsistência no seletor abortava a ativação de papéis e travava a navegação inicial para `home`.
4. **Ciclo de Vida de Inicialização Frágil:**
   - Na linha 24480, `window.addEventListener('DOMContentLoaded', ...)` não valida se o documento já está em estado `interactive` ou `complete` (típico de navegação rápida, recarregamento por cache e WebViews), podendo ignorar o disparo inicial.

---

## 2. Arquitetura da Solução Técnica

A solução é desenhada sobre 5 blindagens interligadas:

1. **Declaração Canônica das Constantes do Pilar 15 (SSOT de Ciclos):**
   - Declarar no bloco canônico do Pilar 15:
     ```javascript
     const DEFAULT_ACADEMIC_YEARS = ['2026', '2025'];
     const DEFAULT_SELECTED_ACADEMIC_YEAR = '2026';
     const DEFAULT_BIMESTER_PERIODS_BY_YEAR = {
       '2026': DEFAULT_BIMESTER_PERIODS,
       '2025': DEFAULT_BIMESTER_PERIODS
     };
     ```
2. **Definição Explícita no `appState` Base:**
   - Inicializar `academicYears: ['2026', '2025']` e `selectedAcademicYear: '2026'` diretamente no objeto literal `appState` (linha 9449).
3. **Autocura Defensiva em `loadState()`:**
   - Assegurar que, mesmo que o `localStorage` contenha um estado sem essas chaves, `loadState()` saneie e garanta arrays válidos com fallback.
4. **Blindagem com Fallback no `renderGlobalAcademicYearSelector()` e `applyUserRoleUI()`:**
   - Envolver a renderização do seletor em bloco `try/catch` defensivo e utilizar coalescência nula/arrays seguros.
5. **Padronização Universal do Ciclo de Vida da Aplicação (`initializeAppLifecycle`):**
   - Criar a rotina unificada `initializeAppLifecycle()` com checagem de `document.readyState` e fallback para `document.addEventListener('DOMContentLoaded')` e `window.addEventListener('load')`.

---

## 3. Especificação de Implementação Passo a Passo (Snippets Exatos)

### Passo 1: Inicialização Canônica de Constantes do Pilar 15
**Arquivo:** `index.html` (e espelho `firebase_deploy/public/index.html`)  
**Localização:** Logo após `const DEFAULT_BIMESTER_PERIODS = { ... };` (por volta da linha 9446).

```javascript
// <<<< ANTES:
    // --- PILAR 15: PERÍODOS OFICIAIS DOS CICLOS AVALIATIVOS (SSOT) ---
    const DEFAULT_BIMESTER_PERIODS = {
      '1º Bimestre': { startDate: '2026-02-02', endDate: '2026-04-30', label: '1º Bimestre' },
      '2º Bimestre': { startDate: '2026-05-04', endDate: '2026-07-31', label: '2º Bimestre' },
      '3º Bimestre': { startDate: '2026-08-03', endDate: '2026-10-31', label: '3º Bimestre' },
      '4º Bimestre': { startDate: '2026-11-03', endDate: '2027-01-29', label: '4º Bimestre' }
    };

    // --- 2. GLOBAL STATE ---
    let appState = {
// ==== DEPOIS:
    // --- PILAR 15: PERÍODOS OFICIAIS DOS CICLOS AVALIATIVOS (SSOT) ---
    const DEFAULT_BIMESTER_PERIODS = {
      '1º Bimestre': { startDate: '2026-02-02', endDate: '2026-04-30', label: '1º Bimestre' },
      '2º Bimestre': { startDate: '2026-05-04', endDate: '2026-07-31', label: '2º Bimestre' },
      '3º Bimestre': { startDate: '2026-08-03', endDate: '2026-10-31', label: '3º Bimestre' },
      '4º Bimestre': { startDate: '2026-11-03', endDate: '2027-01-29', label: '4º Bimestre' }
    };
    const DEFAULT_ACADEMIC_YEARS = ['2026', '2025'];
    const DEFAULT_SELECTED_ACADEMIC_YEAR = '2026';
    const DEFAULT_BIMESTER_PERIODS_BY_YEAR = {
      '2026': DEFAULT_BIMESTER_PERIODS,
      '2025': DEFAULT_BIMESTER_PERIODS
    };

    // --- 2. GLOBAL STATE ---
    let appState = {
```

---

### Passo 2: Inclusão das Propriedades de Ano Letivo no `appState`
**Arquivo:** `index.html` (e espelho)  
**Localização:** Bloco de definição de `appState` (linhas 9449-9469).

```javascript
// <<<< ANTES:
      bimesterPeriods: JSON.parse(JSON.stringify(DEFAULT_BIMESTER_PERIODS)), // <-- PILAR 15: SSOT CICLOS
      teamMembers: JSON.parse(JSON.stringify(INITIAL_TEAM)),
// ==== DEPOIS:
      bimesterPeriods: JSON.parse(JSON.stringify(DEFAULT_BIMESTER_PERIODS)), // <-- PILAR 15: SSOT CICLOS
      academicYears: [...DEFAULT_ACADEMIC_YEARS],
      selectedAcademicYear: DEFAULT_SELECTED_ACADEMIC_YEAR,
      currentPedagSubTab: 'units',
      teamMembers: JSON.parse(JSON.stringify(INITIAL_TEAM)),
```

---

### Passo 3: Saneamento e Autocura de Ciclos em `loadState()`
**Arquivo:** `index.html` (e espelho)  
**Localização:** Dentro de `loadState()` (por volta da linha 9512).

```javascript
// <<<< ANTES:
            ['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre'].forEach(bName => {
              if (!appState.bimesterPeriods[bName] || !appState.bimesterPeriods[bName].startDate || !appState.bimesterPeriods[bName].endDate) {
                appState.bimesterPeriods[bName] = JSON.parse(JSON.stringify(DEFAULT_BIMESTER_PERIODS[bName]));
              }
            });
          }
          if (!appState.teamMembers || appState.teamMembers.length === 0) appState.teamMembers = JSON.parse(JSON.stringify(INITIAL_TEAM));
// ==== DEPOIS:
            ['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre'].forEach(bName => {
              if (!appState.bimesterPeriods[bName] || !appState.bimesterPeriods[bName].startDate || !appState.bimesterPeriods[bName].endDate) {
                appState.bimesterPeriods[bName] = JSON.parse(JSON.stringify(DEFAULT_BIMESTER_PERIODS[bName]));
              }
            });
          }
          if (!appState.academicYears || !Array.isArray(appState.academicYears) || appState.academicYears.length === 0) {
            appState.academicYears = [...DEFAULT_ACADEMIC_YEARS];
          }
          if (!appState.selectedAcademicYear) {
            appState.selectedAcademicYear = DEFAULT_SELECTED_ACADEMIC_YEAR;
          }
          if (!appState.currentPedagSubTab) {
            appState.currentPedagSubTab = 'units';
          }
          if (!appState.teamMembers || appState.teamMembers.length === 0) appState.teamMembers = JSON.parse(JSON.stringify(INITIAL_TEAM));
```

---

### Passo 4: Blindagem Defensiva na Chamada do Seletor em `applyUserRoleUI()`
**Arquivo:** `index.html` (e espelho)  
**Localização:** Final de `applyUserRoleUI()` (por volta da linha 10674).

```javascript
// <<<< ANTES:
      renderGlobalAcademicYearSelector();
    }

    // --- 5. NAVIGATION ---
// ==== DEPOIS:
      try {
        renderGlobalAcademicYearSelector();
      } catch (errYearSel) {
        console.warn('Proteção de inicialização: renderGlobalAcademicYearSelector ignorado defensivamente:', errYearSel);
      }
    }

    // --- 5. NAVIGATION ---
```

---

### Passo 5: Blindagem com Coalescência em `renderGlobalAcademicYearSelector()`
**Arquivo:** `index.html` (e espelho)  
**Localização:** Linhas 24142-24170.

```javascript
// <<<< ANTES:
    function renderGlobalAcademicYearSelector() {
      const select = document.getElementById('headerAcademicYearSelect');
      const wrapper = document.getElementById('headerAcademicYearWrapper');
      if (!select) return;

      if (!appState.academicYears || !Array.isArray(appState.academicYears) || appState.academicYears.length === 0) {
        appState.academicYears = [...DEFAULT_ACADEMIC_YEARS];
      }
      if (!appState.selectedAcademicYear) {
        appState.selectedAcademicYear = DEFAULT_SELECTED_ACADEMIC_YEAR;
      }
// ==== DEPOIS:
    function renderGlobalAcademicYearSelector() {
      const select = document.getElementById('headerAcademicYearSelect');
      const wrapper = document.getElementById('headerAcademicYearWrapper');
      if (!select) return;

      try {
        const defaultYears = (typeof DEFAULT_ACADEMIC_YEARS !== 'undefined' && Array.isArray(DEFAULT_ACADEMIC_YEARS)) ? DEFAULT_ACADEMIC_YEARS : ['2026', '2025'];
        const defaultSelected = (typeof DEFAULT_SELECTED_ACADEMIC_YEAR !== 'undefined') ? DEFAULT_SELECTED_ACADEMIC_YEAR : '2026';

        if (!appState.academicYears || !Array.isArray(appState.academicYears) || appState.academicYears.length === 0) {
          appState.academicYears = [...defaultYears];
        }
        if (!appState.selectedAcademicYear) {
          appState.selectedAcademicYear = defaultSelected;
        }
```

---

### Passo 6: Padronização Universal do Ciclo de Vida da Aplicação
**Arquivo:** `index.html` (e espelho)  
**Localização:** Final de inicialização da aplicação (linhas 24479-24491).

```javascript
// <<<< ANTES:
    // App Initialization
    window.addEventListener('DOMContentLoaded', () => {
      loadState();
      renderHomeScreen();
      ['indicatorsTargetTypeFilter', 'indicatorsUnitFilter', 'indicatorsMemberFilter'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.addEventListener('change', syncIndicatorsFilterUI);
          el.addEventListener('input', syncIndicatorsFilterUI);
        }
      });
    });
// ==== DEPOIS:
    // App Initialization (Universal Multi-State Lifecycle Guard)
    function initializeAppLifecycle() {
      try {
        loadState();
        renderHomeScreen();
      } catch (errInit) {
        console.error('Falha na inicialização do ciclo de vida da aplicação:', errInit);
        navigateToTab('home');
      }

      ['indicatorsTargetTypeFilter', 'indicatorsUnitFilter', 'indicatorsMemberFilter'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.addEventListener('change', syncIndicatorsFilterUI);
          el.addEventListener('input', syncIndicatorsFilterUI);
        }
      });
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      initializeAppLifecycle();
    } else {
      document.addEventListener('DOMContentLoaded', initializeAppLifecycle);
      window.addEventListener('load', initializeAppLifecycle);
    }
```

---

### Passo 7: Atualização do Rótulo de Versão e Modal de Changelog
**Arquivo:** `index.html` (e espelho) e `CHANGELOG.md`  
- Atualizar botão `.btn-changelog`: `Versão 1.36 (v8.2.3)`
- Inserir card descritivo da Versão 1.36 no topo de `#modalChangelog`
- Inserir entrada completa no `CHANGELOG.md`

---

## 4. Critérios de Aceite e Roteiro de Teste

1. **Ausência de Erros de Runtime no Boot:**
   - Abrir a aplicação em uma sessão limpa (`localStorage` vazio ou sem `academicYears`).
   - Nenhuma exceção `ReferenceError` deve ser disparada no console.
2. **Renderização Imediata da Tela Inicial sem Navegação Intermediária:**
   - Ao carregar a página inicial, `#screenHome` deve exibir imediatamente os cards de rascunhos, cronograma de observações agendadas e/ou governança de UEs, com altura computada `> 0px`.
   - O usuário **NÃO** deve precisar alternar de aba para visualizar o conteúdo da tela inicial.
3. **Persistência e Alternância de Abas:**
   - Alternar entre "Cronograma", "Painel & Indicadores", "Histórico" e retornar para "Início": a tela inicial deve permanecer estável, sem piscar e sem perder dados.
4. **Resiliência do Modal de Ciclos Avaliativos:**
   - Abrir o modal *"Ciclos Avaliativos & Calendário"* (`#modalBimesterPeriods`): os bimestres e anos letivos devem carregar perfeitamente sem falhas de `DEFAULT_BIMESTER_PERIODS_BY_YEAR`.

---

## 5. Seção Obrigatória de Auditoria (`audit_platform.py` e Suíte In-App)

### 5.1 Adições ao Módulo 12 (`navegacao_layout`) em `index.html`
Adicionar testes determinísticos no Módulo 12 cobrindo:
1. **Validação de Constantes Canônicas de Ciclo:**
   - Assegurar que `typeof DEFAULT_ACADEMIC_YEARS !== 'undefined'` e que é um Array com pelo menos 1 ano letivo.
   - Assegurar que `typeof DEFAULT_SELECTED_ACADEMIC_YEAR !== 'undefined'`.
   - Assegurar que `typeof DEFAULT_BIMESTER_PERIODS_BY_YEAR !== 'undefined'` e possui mapeamento para `'2026'`.
2. **Asserção de Boot Limpo sem White Screen (Zero-Click Visibility):**
   - Simular um ciclo de inicialização com estado sem anos letivos (`delete appState.academicYears`).
   - Chamar `applyUserRoleUI()` e `renderHomeScreen()`.
   - Assegurar que nenhuma exceção é lançada e que `#screenHome` possui altura `> 0px` e conteúdo válido.
3. **Atualização da Asserção de Versão:**
   - Validar rótulo `Versão 1.36` no botão `.btn-changelog` e no `#modalChangelog`.

### 5.2 Validações Pré e Pós-Deploy Obrigatórias
1. **Pré-voo Sintático JSC (Obrigatório antes do commit):**
   ```bash
   python3 audit_platform.py --check-syntax
   ```
2. **Deploy Automático via GitHub Pages:**
   ```bash
   git push origin main
   ```
3. **Auditoria Modular Headless Pós-Deploy:**
   ```bash
   python3 audit_platform.py --silent-on-success
   ```
   Confirmar 100% de sucesso nos 12 módulos canônicos.
