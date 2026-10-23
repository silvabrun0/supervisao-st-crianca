# PLANO DE IMPLEMENTAÇÃO: DEFINIÇÃO AUTÔNOMA DOS PERÍODOS DE CICLOS AVALIATIVOS PELA COORDENADORA DA EI SOB A SSOT ÚNICA

> **Diretriz de Execução Obrigatória:** O executor desta intervenção DEVE ler integralmente os arquivos [WORKFLOW_MACOS.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md), [AGENTS.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/AGENTS.md) e a skill `.agents/skills/execucao-operario/SKILL.md` antes de efetuar qualquer alteração. Este plano é a especificação exata e vinculante a ser seguida fielmente na Etapa 2.

---

## 1. Diagnóstico e Contexto

No ecossistema **SerTão Criança**, o acompanhamento pedagógico longitudinal apoia-se no cumprimento das 4 observações anuais obrigatórias (1º, 2º, 3º e 4º Bimestres). Durante a auditoria do código, identificou-se a presença de estimativas arbitrárias e prazos estáticos hardcoded:

1. **Rótulos Estimados no Acompanhamento Longitudinal (Quadro de Controle Bimestral / Semáforo):**
   - No cabeçalho da tabela de **Turmas** (Desktop, linhas ~20383-20386):
     ```html
     <th class="col-bim">1º Bimestre<br><span style="font-size:10px; font-weight:normal; opacity:0.8;">Fev - Abr</span></th>
     <th class="col-bim">2º Bimestre<br><span style="font-size:10px; font-weight:normal; opacity:0.8;">Mai - Jul</span></th>
     <th class="col-bim">3º Bimestre<br><span style="font-size:10px; font-weight:normal; opacity:0.8;">Ago - Out</span></th>
     <th class="col-bim">4º Bimestre<br><span style="font-size:10px; font-weight:normal; opacity:0.8;">Nov - Jan</span></th>
     ```
   - No cabeçalho da tabela de **Docentes Regentes** (Desktop, linhas ~20582-20585):
     Idênticos rótulos estáticos e aproximados (`Fev - Abr`, `Mai - Jul`, `Ago - Out`, `Nov - Jan`).
2. **Estimativa Textual nos Status do Semáforo:**
   - Na função `calculateClassBimesterStatus()` (linha ~18415), no caso de bimestre em andamento:
     ```javascript
     let sub = 'Janela de 2 meses em aberto';
     ```
     Trata-se de uma aproximação arbitrária que não reflete a realidade da rede escolar.
3. **Motor Determinístico Baseado em Meses Hardcoded (`getCurrentSchoolBimester`):**
   - Nas linhas ~10394-10406:
     ```javascript
     function getCurrentSchoolBimester(referenceDate = new Date()) {
       const d = (referenceDate instanceof Date && !isNaN(referenceDate)) ? referenceDate : new Date(referenceDate);
       const month = d.getMonth() + 1; // 1 a 12
       if (month >= 2 && month <= 4) return '1º Bimestre';
       if (month >= 5 && month <= 7) return '2º Bimestre';
       if (month >= 8 && month <= 10) return '3º Bimestre';
       return '4º Bimestre';
     }
     ```
     Este motor presume que o ano letivo segue estritamente os meses civis 2 a 4, 5 a 7, 8 a 10 e 11 a 1. Na prática pedagógica de Patos/PB, o calendário oficial é definido pela Secretaria de Educação e pelo Núcleo de Educação Infantil, com datas exatas de início e encerramento para cada período de avaliação formativa.

### Diretriz Pedagógica e Governança SSOT
- **Soberania do Núcleo de Educação Infantil:** A Coordenadora do Núcleo de EI (**Helena Martins**, perfil `nucleo_ei`), na qualidade de autoridade gestora municipal, deve poder cadastrar e retificar os períodos exatos (data inicial e final) de cada um dos 4 bimestres letivos diretamente no sistema.
- **Single Source of Truth (SSOT):** Os períodos cadastrados devem compor o estado global do aplicativo (`appState.bimesterPeriods`), persistir no `localStorage`, constar nas rotinas de exportação e restauração completa de backup JSON e ser propagados instantaneamente para todos os usuários da rede (Coordenadoras Escolares, Formadoras e Gestão Geral), atualizando automaticamente os cabeçalhos das tabelas, os prazos vigentes e a identificação do bimestre corrente.

---

## 2. Arquitetura e Pontos de Impacto

Os arquivos impactados são:
- `index.html` (e suas cópias espelhadas em `gestor supervisao_patos/index.html` e `gestor supervisao_patos/firebase_deploy/public/index.html`):
  1. **Modelo de Dados Global (`appState.bimesterPeriods`):**
     Criação da constante canônica `DEFAULT_BIMESTER_PERIODS` e inclusão da chave `bimesterPeriods` no `appState`, com persistência e autocura em `loadState()`.
  2. **Backup & Governança SSOT (`exportFullBaseJSON` / `importFullBaseJSON`):**
     Inclusão de `bimesterPeriods` no pacote de exportação e importação integral da base.
  3. **Motor Canônico de Resolução do Bimestre Corrente (`getCurrentSchoolBimester`):**
     Substituição da lógica estática de meses por cálculo dinâmico baseado nos intervalos de datas (`startDate` a `endDate`) cadastrados no SSOT.
  4. **Renderização Dinâmica dos Cabeçalhos do Semáforo (`getBimesterPeriodDisplay`):**
     Criação de helper para formatar os períodos (ex: `02/02 a 30/04`) e eliminação definitiva de todos os rótulos estáticos (`Fev - Abr`, `Mai - Jul`, `Ago - Out`, `Nov - Jan`).
  5. **Textos Contextuais de Prazos (`calculateClassBimesterStatus` / `calculateTeacherBimesterStatus`):**
     Eliminação do texto `"Janela de 2 meses em aberto"` e adoção de data final precisa (ex: `"Vigente até DD/MM"` ou `"Prazo encerrado em DD/MM"`).
  6. **Interface Gerencial da Coordenadora da EI (`#modalBimesterPeriods`):**
     - Botão de acesso exclusivo para perfil `nucleo_ei` na barra de ações da Gestão Central (`#homeGestaoActionsCentral`).
     - Modal com formulário para parametrização das datas de início e término dos 4 bimestres, validação de integridade e persistência na SSOT.
  7. **Sincronização Reativa em Tempo Real:**
     Listener global para o evento `storage`, garantindo atualização imediata entre abas/janelas concorrentes.
  8. **Auditoria Modular da Plataforma (`catalogo_dados` e `indicadores_decisao`):**
     Novas asserções e testes automatizados para verificar a presença de `bimesterPeriods` na SSOT, a ausência de rótulos estimados no DOM e a integridade de cálculo da Coordenadora da EI.
- `CHANGELOG.md` e `#modalChangelog`:
  Registro formal da versão **v1.23**.

---

## 3. Especificação de Implementação Passo a Passo (Snippets Exatos)

### Passo 1: Definição do Modelo Canônico na SSOT e Inicialização do Estado

No arquivo `index.html`, antes da declaração de `let appState = ...` (por volta da linha ~8534):

```javascript
    // --- PILAR 15: PERÍODOS OFICIAIS DOS CICLOS AVALIATIVOS (SSOT) ---
    const DEFAULT_BIMESTER_PERIODS = {
      '1º Bimestre': { startDate: '2026-02-02', endDate: '2026-04-30', label: '1º Bimestre' },
      '2º Bimestre': { startDate: '2026-05-04', endDate: '2026-07-31', label: '2º Bimestre' },
      '3º Bimestre': { startDate: '2026-08-03', endDate: '2026-10-31', label: '3º Bimestre' },
      '4º Bimestre': { startDate: '2026-11-03', endDate: '2027-01-29', label: '4º Bimestre' }
    };
```

E no objeto `let appState = { ... }`:

```javascript
    let appState = {
      currentUserKey: 'mariana',
      activeSectionsTeacher: JSON.parse(JSON.stringify(DEFAULT_SECTIONS_TEACHER)), activeSectionsCoordinator: JSON.parse(JSON.stringify(DEFAULT_SECTIONS_COORDINATOR)),
      units: JSON.parse(JSON.stringify(INITIAL_UNITS)),
      classes: JSON.parse(JSON.stringify(INITIAL_CLASSES)), // <-- PILAR 1: CATÁLOGO DE TURMAS
      deletedClassIds: [], // <-- PILAR 14: SSOT EXCLUSÕES
      bimesterPeriods: JSON.parse(JSON.stringify(DEFAULT_BIMESTER_PERIODS)), // <-- PILAR 15: SSOT CICLOS
      teamMembers: JSON.parse(JSON.stringify(INITIAL_TEAM)),
      // ... demais campos existentes
```

E na função `loadState()` (por volta da linha ~8570):

```javascript
          if (!appState.bimesterPeriods || typeof appState.bimesterPeriods !== 'object') {
            appState.bimesterPeriods = JSON.parse(JSON.stringify(DEFAULT_BIMESTER_PERIODS));
          } else {
            // Garante presença e integridade dos 4 bimestres canônicos
            ['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre'].forEach(bName => {
              if (!appState.bimesterPeriods[bName] || !appState.bimesterPeriods[bName].startDate || !appState.bimesterPeriods[bName].endDate) {
                appState.bimesterPeriods[bName] = JSON.parse(JSON.stringify(DEFAULT_BIMESTER_PERIODS[bName]));
              }
            });
          }
```

---

### Passo 2: Refatoração do Motor `getCurrentSchoolBimester()`

No arquivo `index.html`, substituir a função `getCurrentSchoolBimester` (linhas ~10394-10406):

```javascript
    // =========================================================================
    // PILAR 7 & 15: Resolução do Bimestre Corrente do Ano Letivo via SSOT (Patos/PB)
    // =========================================================================
    function getCurrentSchoolBimester(referenceDate = new Date()) {
      const d = (referenceDate instanceof Date && !isNaN(referenceDate)) ? referenceDate : new Date(referenceDate);
      const periods = (appState && appState.bimesterPeriods) ? appState.bimesterPeriods : DEFAULT_BIMESTER_PERIODS;
      const BIMESTERS_CANONICAL = ['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre'];

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const refDateStr = `${year}-${month}-${day}`;

      // 1. Procura se a data coincide diretamente com a janela de algum dos 4 bimestres
      for (const bName of BIMESTERS_CANONICAL) {
        const p = periods[bName];
        if (p && p.startDate && p.endDate) {
          if (refDateStr >= p.startDate && refDateStr <= p.endDate) {
            return bName;
          }
        }
      }

      // 2. Se a data de referência for anterior ao 1º Bimestre oficial:
      const firstBim = periods['1º Bimestre'];
      if (firstBim && firstBim.startDate && refDateStr < firstBim.startDate) {
        return '1º Bimestre';
      }

      // 3. Se a data estiver em janela de recesso/transição entre bimestres, aponta para o próximo
      for (let i = 0; i < BIMESTERS_CANONICAL.length - 1; i++) {
        const curBim = periods[BIMESTERS_CANONICAL[i]];
        const nextBim = periods[BIMESTERS_CANONICAL[i + 1]];
        if (curBim && nextBim && curBim.endDate && nextBim.startDate) {
          if (refDateStr > curBim.endDate && refDateStr < nextBim.startDate) {
            return BIMESTERS_CANONICAL[i + 1];
          }
        }
      }

      // 4. Se for posterior ao encerramento do ano letivo oficial:
      return '4º Bimestre';
    }
```

---

### Passo 3: Criação do Helper `getBimesterPeriodDisplay()` e Atualização dos Cabeçalhos do Semáforo

No arquivo `index.html`, adicionar o helper de formatação de datas:

```javascript
    /**
     * Retorna o período oficial formatado de um bimestre para exibição em tabelas (ex: "02/02 a 30/04")
     */
    function getBimesterPeriodDisplay(bName) {
      const periods = (appState && appState.bimesterPeriods) ? appState.bimesterPeriods : DEFAULT_BIMESTER_PERIODS;
      const p = periods[bName];
      if (!p || !p.startDate || !p.endDate) return '';

      const fmt = (isoStr) => {
        if (!isoStr || isoStr.length < 10) return '';
        const parts = isoStr.split('-');
        return `${parts[2]}/${parts[1]}`;
      };

      const s = fmt(p.startDate);
      const e = fmt(p.endDate);
      return (s && e) ? `${s} a ${e}` : '';
    }
```

E atualizar o cabeçalho da tabela de **Turmas** (linhas ~20380-20390):

```html
<!-- ANTES -->
<th class="col-bim">1º Bimestre<br><span style="font-size:10px; font-weight:normal; opacity:0.8;">Fev - Abr</span></th>
<th class="col-bim">2º Bimestre<br><span style="font-size:10px; font-weight:normal; opacity:0.8;">Mai - Jul</span></th>
<th class="col-bim">3º Bimestre<br><span style="font-size:10px; font-weight:normal; opacity:0.8;">Ago - Out</span></th>
<th class="col-bim">4º Bimestre<br><span style="font-size:10px; font-weight:normal; opacity:0.8;">Nov - Jan</span></th>

<!-- DEPOIS -->
<th class="col-bim">1º Bimestre<br><span class="sem-bim-dates" style="font-size:10px; font-weight:normal; opacity:0.8;">${getBimesterPeriodDisplay('1º Bimestre')}</span></th>
<th class="col-bim">2º Bimestre<br><span class="sem-bim-dates" style="font-size:10px; font-weight:normal; opacity:0.8;">${getBimesterPeriodDisplay('2º Bimestre')}</span></th>
<th class="col-bim">3º Bimestre<br><span class="sem-bim-dates" style="font-size:10px; font-weight:normal; opacity:0.8;">${getBimesterPeriodDisplay('3º Bimestre')}</span></th>
<th class="col-bim">4º Bimestre<br><span class="sem-bim-dates" style="font-size:10px; font-weight:normal; opacity:0.8;">${getBimesterPeriodDisplay('4º Bimestre')}</span></th>
```

E atualizar o cabeçalho da tabela de **Docentes Regentes** (linhas ~20580-20590):

```html
<!-- ANTES -->
<th class="col-bim">1º Bimestre<br><span style="font-size:10px; font-weight:normal; opacity:0.8;">Fev - Abr</span></th>
<th class="col-bim">2º Bimestre<br><span style="font-size:10px; font-weight:normal; opacity:0.8;">Mai - Jul</span></th>
<th class="col-bim">3º Bimestre<br><span style="font-size:10px; font-weight:normal; opacity:0.8;">Ago - Out</span></th>
<th class="col-bim">4º Bimestre<br><span style="font-size:10px; font-weight:normal; opacity:0.8;">Nov - Jan</span></th>

<!-- DEPOIS -->
<th class="col-bim">1º Bimestre<br><span class="sem-bim-dates" style="font-size:10px; font-weight:normal; opacity:0.8;">${getBimesterPeriodDisplay('1º Bimestre')}</span></th>
<th class="col-bim">2º Bimestre<br><span class="sem-bim-dates" style="font-size:10px; font-weight:normal; opacity:0.8;">${getBimesterPeriodDisplay('2º Bimestre')}</span></th>
<th class="col-bim">3º Bimestre<br><span class="sem-bim-dates" style="font-size:10px; font-weight:normal; opacity:0.8;">${getBimesterPeriodDisplay('3º Bimestre')}</span></th>
<th class="col-bim">4º Bimestre<br><span class="sem-bim-dates" style="font-size:10px; font-weight:normal; opacity:0.8;">${getBimesterPeriodDisplay('4º Bimestre')}</span></th>
```

---

### Passo 4: Eliminação de Textos Arbitrários nos Status Semafóricos

Na função `calculateClassBimesterStatus()` (linha ~18415):

```javascript
// ANTES
if (bimesterNum === currentBimNum) {
  let sub = 'Janela de 2 meses em aberto';
  if (draftObs) sub = 'Rascunho iniciado em andamento';
  else if (sched) sub = `Agendada para ${schedDateFormatted}`;
  // ...

// DEPOIS
if (bimesterNum === currentBimNum) {
  const bimPeriod = ((appState && appState.bimesterPeriods) ? appState.bimesterPeriods : DEFAULT_BIMESTER_PERIODS)[bimesterName];
  const deadlineStr = bimPeriod && bimPeriod.endDate ? bimPeriod.endDate.split('-').reverse().slice(0, 2).join('/') : '';
  let sub = deadlineStr ? `Prazo vigente até ${deadlineStr}` : 'Período letivo em aberto';
  if (draftObs) sub = 'Rascunho iniciado em andamento';
  else if (sched) sub = `Agendada para ${schedDateFormatted}`;
  // ...
```

E no caso de atraso (`bimesterNum < currentBimNum`, linha ~18392):

```javascript
// ANTES
if (bimesterNum < currentBimNum) {
  let sub = 'Prazo expirado sem observação';
  if (draftObs) sub = 'Rascunho não finalizado (Expirado)';
  else if (sched) sub = `Agendamento pendente (${schedDateFormatted})`;

// DEPOIS
if (bimesterNum < currentBimNum) {
  const bimPeriod = ((appState && appState.bimesterPeriods) ? appState.bimesterPeriods : DEFAULT_BIMESTER_PERIODS)[bimesterName];
  const deadlineStr = bimPeriod && bimPeriod.endDate ? bimPeriod.endDate.split('-').reverse().slice(0, 2).join('/') : '';
  let sub = deadlineStr ? `Prazo expirado em ${deadlineStr}` : 'Prazo expirado sem observação';
  if (draftObs) sub = 'Rascunho não finalizado (Expirado)';
  else if (sched) sub = `Agendamento pendente (${schedDateFormatted})`;
```

---

### Passo 5: Interface de Configuração Exclusiva para a Coordenadora da EI (`nucleo_ei`)

1. No cabeçalho da Gestão Central (`#homeGestaoActionsCentral`, linhas ~3411-3420), adicionar o botão:

```html
<div style="display:flex; gap:8px; flex-wrap:wrap;" id="homeGestaoActionsCentral">
  <button class="btn btn-secondary" onclick="openBimesterPeriodsModal()" style="color:#0284C7; font-weight:700;" title="Definir os períodos e prazos dos 4 bimestres letivos">
    📅 Ciclos Avaliativos & Calendário
  </button>
  <button class="btn btn-secondary" onclick="exportFullBaseJSON()" style="color:#059669; font-weight:700;">
    💾 Exportar Base Completa (JSON)
  </button>
  <button class="btn btn-secondary" onclick="triggerImportFullBase()" style="color:#DC2626; font-weight:700;">
    📂 Importar Base Completa (JSON)
  </button>
  <input type="file" id="importFullBaseFileInput" accept=".json" style="display:none;" onchange="importFullBaseJSON(event)" />
</div>
```

2. Adicionar o HTML do modal `#modalBimesterPeriods` (ao final do body, próximo aos demais modais):

```html
<!-- ================= MODAL: CALENDÁRIO DE CICLOS AVALIATIVOS (SSOT) ================= -->
<div id="modalBimesterPeriods" class="modal-backdrop" onclick="closeBimesterPeriodsModal()">
  <div class="modal-panel" style="max-width:580px;" onclick="event.stopPropagation()">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
      <div>
        <div style="font-size:17px; font-weight:800; color:var(--primary-dark); display:flex; align-items:center; gap:8px;">
          <span>📅</span> Ciclos Avaliativos & Prazos Oficiais (SSOT)
        </div>
        <div style="font-size:12px; color:var(--text-secondary); margin-top:2px;">
          Defina as datas exatas dos 4 bimestres letivos para toda a rede municipal da Educação Infantil.
        </div>
      </div>
      <button class="btn btn-secondary" style="padding:6px 10px;" onclick="closeBimesterPeriodsModal()">✕</button>
    </div>

    <div style="background:#EFF6FF; border:1px solid #BFDBFE; border-radius:8px; padding:10px 14px; margin-bottom:16px; font-size:12px; color:#1E40AF; line-height:1.4;">
      🏛️ <strong>Autoridade Municipal da Coordenadora da EI:</strong> Todas as alterações salvas aqui persistem na SSOT unificada e refletem imediatamente para todas as unidades escolares, semáforos e cronogramas.
    </div>

    <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:18px;">
      <!-- 1º Bimestre -->
      <div class="card" style="padding:12px; margin-bottom:0; background:#F8FAFC; border:1px solid #E2E8F0;">
        <div style="font-size:13px; font-weight:800; color:var(--primary-dark); margin-bottom:8px;">1º Bimestre (Diagnóstico Inicial)</div>
        <div class="grid-2col" style="gap:10px;">
          <div>
            <label class="form-label" style="font-size:11px;">Data Inicial</label>
            <input type="date" id="bimPeriodStart_1" class="form-input" style="font-size:12px; padding:6px 10px;">
          </div>
          <div>
            <label class="form-label" style="font-size:11px;">Data Final (Prazo Limite)</label>
            <input type="date" id="bimPeriodEnd_1" class="form-input" style="font-size:12px; padding:6px 10px;">
          </div>
        </div>
      </div>

      <!-- 2º Bimestre -->
      <div class="card" style="padding:12px; margin-bottom:0; background:#F8FAFC; border:1px solid #E2E8F0;">
        <div style="font-size:13px; font-weight:800; color:var(--primary-dark); margin-bottom:8px;">2º Bimestre</div>
        <div class="grid-2col" style="gap:10px;">
          <div>
            <label class="form-label" style="font-size:11px;">Data Inicial</label>
            <input type="date" id="bimPeriodStart_2" class="form-input" style="font-size:12px; padding:6px 10px;">
          </div>
          <div>
            <label class="form-label" style="font-size:11px;">Data Final (Prazo Limite)</label>
            <input type="date" id="bimPeriodEnd_2" class="form-input" style="font-size:12px; padding:6px 10px;">
          </div>
        </div>
      </div>

      <!-- 3º Bimestre -->
      <div class="card" style="padding:12px; margin-bottom:0; background:#F8FAFC; border:1px solid #E2E8F0;">
        <div style="font-size:13px; font-weight:800; color:var(--primary-dark); margin-bottom:8px;">3º Bimestre</div>
        <div class="grid-2col" style="gap:10px;">
          <div>
            <label class="form-label" style="font-size:11px;">Data Inicial</label>
            <input type="date" id="bimPeriodStart_3" class="form-input" style="font-size:12px; padding:6px 10px;">
          </div>
          <div>
            <label class="form-label" style="font-size:11px;">Data Final (Prazo Limite)</label>
            <input type="date" id="bimPeriodEnd_3" class="form-input" style="font-size:12px; padding:6px 10px;">
          </div>
        </div>
      </div>

      <!-- 4º Bimestre -->
      <div class="card" style="padding:12px; margin-bottom:0; background:#F8FAFC; border:1px solid #E2E8F0;">
        <div style="font-size:13px; font-weight:800; color:var(--primary-dark); margin-bottom:8px;">4º Bimestre (Consolidação Anual)</div>
        <div class="grid-2col" style="gap:10px;">
          <div>
            <label class="form-label" style="font-size:11px;">Data Inicial</label>
            <input type="date" id="bimPeriodStart_4" class="form-input" style="font-size:12px; padding:6px 10px;">
          </div>
          <div>
            <label class="form-label" style="font-size:11px;">Data Final (Prazo Limite)</label>
            <input type="date" id="bimPeriodEnd_4" class="form-input" style="font-size:12px; padding:6px 10px;">
          </div>
        </div>
      </div>
    </div>

    <div style="display:flex; justify-content:space-between; align-items:center; gap:10px;">
      <button type="button" class="btn btn-secondary" onclick="restoreDefaultBimesterPeriodsPrompt()" style="font-size:12px; color:#DC2626; border-color:#FECACA;">
        ↺ Restaurar Padrões
      </button>
      <div style="display:flex; gap:8px;">
        <button type="button" class="btn btn-secondary" onclick="closeBimesterPeriodsModal()">Cancelar</button>
        <button type="button" class="btn btn-primary" onclick="saveBimesterPeriodsSettings()">💾 Salvar Prazos na SSOT</button>
      </div>
    </div>
  </div>
</div>
```

3. Funções controladoras no JavaScript:

```javascript
    function openBimesterPeriodsModal() {
      const user = getCurrentUser();
      if (!isNucleoEI(user)) {
        showToast('Acesso restrito à Coordenadora do Núcleo de EI.');
        return;
      }
      const periods = (appState && appState.bimesterPeriods) ? appState.bimesterPeriods : DEFAULT_BIMESTER_PERIODS;
      
      const bimMap = {
        1: '1º Bimestre',
        2: '2º Bimestre',
        3: '3º Bimestre',
        4: '4º Bimestre'
      };

      for (let i = 1; i <= 4; i++) {
        const bName = bimMap[i];
        const p = periods[bName] || DEFAULT_BIMESTER_PERIODS[bName];
        const startInput = document.getElementById(`bimPeriodStart_${i}`);
        const endInput = document.getElementById(`bimPeriodEnd_${i}`);
        if (startInput) startInput.value = p.startDate || '';
        if (endInput) endInput.value = p.endDate || '';
      }

      const modal = document.getElementById('modalBimesterPeriods');
      if (modal) modal.classList.add('show');
    }

    function closeBimesterPeriodsModal() {
      const modal = document.getElementById('modalBimesterPeriods');
      if (modal) modal.classList.remove('show');
    }

    function saveBimesterPeriodsSettings() {
      const user = getCurrentUser();
      if (!isNucleoEI(user)) {
        showToast('Acesso restrito à Coordenadora do Núcleo de EI.');
        return;
      }

      const bimMap = {
        1: '1º Bimestre',
        2: '2º Bimestre',
        3: '3º Bimestre',
        4: '4º Bimestre'
      };

      const newPeriods = {};

      for (let i = 1; i <= 4; i++) {
        const bName = bimMap[i];
        const startInput = document.getElementById(`bimPeriodStart_${i}`);
        const endInput = document.getElementById(`bimPeriodEnd_${i}`);
        const startVal = startInput ? startInput.value : '';
        const endVal = endInput ? endInput.value : '';

        if (!startVal || !endVal) {
          alert(`Por favor, preencha as datas de início e fim do ${bName}.`);
          return;
        }

        if (startVal > endVal) {
          alert(`A data inicial do ${bName} não pode ser posterior à data final.`);
          return;
        }

        newPeriods[bName] = {
          startDate: startVal,
          endDate: endVal,
          label: bName
        };
      }

      appState.bimesterPeriods = newPeriods;
      saveState();
      closeBimesterPeriodsModal();
      showToast('Períodos oficiais dos ciclos avaliativos atualizados com sucesso na SSOT!');

      // Re-renderiza indicadores se a tela estiver aberta
      const screenInd = document.getElementById('screenIndicators');
      if (screenInd && screenInd.classList.contains('active')) {
        renderIndicatorsScreen();
      }
    }

    function restoreDefaultBimesterPeriodsPrompt() {
      if (!confirm('Deseja restaurar os períodos oficiais padrão do município para os 4 bimestres?')) {
        return;
      }
      appState.bimesterPeriods = JSON.parse(JSON.stringify(DEFAULT_BIMESTER_PERIODS));
      saveState();
      openBimesterPeriodsModal(); // Recarrega os inputs no modal
      showToast('Padrões municipais restaurados com sucesso na SSOT!');
      const screenInd = document.getElementById('screenIndicators');
      if (screenInd && screenInd.classList.contains('active')) {
        renderIndicatorsScreen();
      }
    }
```

---

### Passo 6: Propagação Reativa em Rede SSOT Inter-Abas

Adicionar o listener global em `index.html`:

```javascript
    // Sincronização reativa e imediata de dados da SSOT entre abas abertas no navegador
    window.addEventListener('storage', (e) => {
      if (e.key === 'SERTAO_CRIANCA_APP_STATE_V6') {
        try {
          const updated = JSON.parse(e.newValue);
          if (updated && updated.bimesterPeriods) {
            appState.bimesterPeriods = updated.bimesterPeriods;
            const screenInd = document.getElementById('screenIndicators');
            if (screenInd && screenInd.classList.contains('active')) {
              renderIndicatorsScreen();
            }
          }
        } catch (err) {
          console.warn('Sincronização SSOT inter-abas ignorada:', err);
        }
      }
    });
```

---

## 4. Critérios de Aceite e Roteiro de Teste

1. **Ausência Categórica de Rótulos Estimados:**
   - Na visualização do Semáforo Longitudinal de Turmas (Desktop), o cabeçalho das colunas não deve conter as strings `'Fev - Abr'`, `'Mai - Jul'`, `'Ago - Out'`, nem `'Nov - Jan'`. Deve exibir o intervalo oficial (ex: `02/02 a 30/04` ou o cadastrado pela gestão).
   - Na visualização do Semáforo de Docentes Regentes (Desktop), a mesma ausência estrita deve ser verificada.
   - Nas pílulas de status do Semáforo, a string `'Janela de 2 meses em aberto'` não deve existir em nenhum ponto do DOM.
2. **Autoridade RBAC da Coordenadora da EI:**
   - Ao logar como **Helena Martins** (`helena`, perfil `nucleo_ei`), o botão `📅 Ciclos Avaliativos & Calendário` deve estar visível e funcional na Gestão Pedagógica Central.
   - Ao clicar, o modal `#modalBimesterPeriods` deve abrir pré-populado com os períodos atuais.
   - Ao alterar as datas (ex: 1º Bimestre de `2026-02-01` a `2026-04-15`) e salvar, as alterações devem persistir imediatamente no `localStorage` e refletir no Semáforo.
   - Ao logar como **Mariana Ferreira** (`mariana`, perfil `coordenador`), o modal de edição não deve ser acessível, mas a Coordenadora Escolar deve enxergar exatamente as datas oficiais estabelecidas pela Coordenadora da EI.
3. **Cálculo Determinístico de Bimestre Corrente e Atraso:**
   - `getCurrentSchoolBimester(new Date('2026-03-10'))` deve resolver determinística e infalivelmente para `'1º Bimestre'` baseado na janela cadastrada.
   - Teste de borda: data fora da janela oficial resolve o bimestre correspondente de acordo com as regras de recesso/início.
4. **Exportação & Backup JSON Integral:**
   - `exportFullBaseJSON()` deve incluir `bimesterPeriods` na raiz do JSON exportado.
   - `importFullBaseJSON()` deve restaurar fidedignamente os períodos customizados.

---

## 5. Seção Obrigatória de Auditoria: Alterações e Adições no Algoritmo de Auditoria (`audit_platform.py` e testes do `index.html`)

### 5.1 No arquivo `audit_platform.py`:
- Nenhuma modificação destrutiva necessária na infraestrutura do runner Python. O runner invoca headless os testes JavaScript no `index.html`.

### 5.2 No Módulo `catalogo_dados` (em `index.html`):
- Adicionar verificação de integridade da SSOT:
  ```javascript
  if (!appState.bimesterPeriods || !appState.bimesterPeriods['1º Bimestre'] || !appState.bimesterPeriods['4º Bimestre']) {
    throw new Error('Falha SSOT: appState.bimesterPeriods ausente ou incompleto no catálogo');
  }
  logger.log('Presença e integridade relacional de bimesterPeriods na SSOT unificada', true);
  ```

### 5.3 No Módulo `indicadores_decisao` (em `index.html`):
- Adicionar verificação de asserção negativa estrita e teste dinâmico da Coordenadora da EI:
  ```javascript
  // 15. PILAR 15: ASSERÇÃO NEGATIVA ESTRITA CONTRA RÓTULOS ESTIMADOS NO SEMÁFORO
  const semTable = document.getElementById('bimesterSemaphoreSection');
  if (semTable) {
    const semHtml = semTable.innerHTML;
    if (semHtml.includes('Fev - Abr') || semHtml.includes('Mai - Jul') || semHtml.includes('Ago - Out') || semHtml.includes('Nov - Jan')) {
      throw new Error('Falha Pilar 15: Períodos estimados ("Fev - Abr", etc.) ainda presentes no cabeçalho do Semáforo');
    }
    if (semHtml.includes('Janela de 2 meses')) {
      throw new Error('Falha Pilar 15: Estimativa arbitrária "Janela de 2 meses" ainda presente no Semáforo');
    }
    logger.log('Extinção confirmada de períodos estimados ("Fev - Abr" e "Janela de 2 meses") no DOM', true);
  }

  // 16. PILAR 15: TESTE DE PARAMETRIZAÇÃO AUTÔNOMA PELA COORDENADORA DA EI (SSOT)
  appState.currentUserKey = 'helena';
  const testPeriods = JSON.parse(JSON.stringify(appState.bimesterPeriods));
  testPeriods['1º Bimestre'].startDate = '2026-02-10';
  testPeriods['1º Bimestre'].endDate = '2026-04-20';
  appState.bimesterPeriods = testPeriods;
  saveState();
  renderIndicatorsScreen();

  const periodHeader = getBimesterPeriodDisplay('1º Bimestre');
  if (periodHeader !== '10/02 a 20/04') {
    throw new Error(`Falha Pilar 15: Esperado período "10/02 a 20/04", obtido "${periodHeader}"`);
  }
  logger.log('Parametrização autônoma de períodos de ciclos pela Coordenadora da EI e reflexo imediato no Semáforo', true, periodHeader);

  // Restaura períodos canônicos após o teste
  appState.bimesterPeriods = JSON.parse(JSON.stringify(DEFAULT_BIMESTER_PERIODS));
  saveState();
  appState.currentUserKey = 'mariana';
  renderIndicatorsScreen();
  ```

---

## 6. Registro de Versão e Documentação

- Atualizar o `CHANGELOG.md` adicionando a versão **v1.23**.
- Atualizar o `#modalChangelog` em `index.html` com o card correspondente à versão **v1.23**.
- Sincronizar simultaneamente as cópias espelhadas do projeto:
  - `gestor supervisao_patos/index.html`
  - `gestor supervisao_patos/firebase_deploy/public/index.html`
- Salvar backup em `intermediárias/aplicativo_v123_definicao_autonoma_periodos_ciclos_ssot.html`.
