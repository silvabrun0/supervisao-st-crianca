# Plano de Implementação: Centralização da Função "Iniciar Novo Ciclo Avaliativo" na Tela de Ciclos Avaliativos & Calendário

---

## 0. Diretriz de Execução Obrigatória (Etapa 2)
> [!IMPORTANT]
> **Atenção Executor / Operário:** Antes de aplicar qualquer modificação em código, leia obrigatoriamente o manual [`WORKFLOW_MACOS.md`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md) e a skill do Antigravity [`.agents/skills/execucao-operario/SKILL.md`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/.agents/skills/execucao-operario/SKILL.md).
> Siga estritamente este plano sem improvisações, mantendo a integridade sintática via JSC (`python3 audit_platform.py --check-syntax`), gerando a versão intermediária de backup `intermediárias/aplicativo_v135_iniciar_novo_ciclo_tela_ciclos_e_calendario.html`, atualizando o changelog duplo para a versão **1.35** e rodando a auditoria modular silenciosa pós-deploy (`python3 audit_platform.py --silent-on-success`).

---

## 1. Diagnóstico e Contexto

### 1.1. O Cenário Atual
Na versão 1.28 (`plano_arquitetura_plurianual_ciclos_letivos.md`), foi implementada a arquitetura multi-ano da plataforma SerTão Criança. Como parte daquela entrega, o gatilho para iniciar um novo ano letivo foi disponibilizado de forma redundante em dois locais:
1. **Na barra superior de ações da tela "Gestão da Rede" (`#homeGestaoActionsCentral`, linhas 3720-3738 de `index.html`):**
   ```html
   <div style="display:flex; gap:8px; flex-wrap:wrap;" id="homeGestaoActionsCentral">
     <button class="btn btn-secondary" onclick="openCreateNewAcademicYearModal()" style="color:#0284C7; font-weight:700; background:#F0F9FF; border-color:#BAE6FD;" title="Iniciar um novo ano letivo na rede municipal">
       <svg class="btn-icon" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
       Iniciar Novo Ano Letivo
     </button>
     <button class="btn btn-secondary" onclick="openBimesterPeriodsModal()" style="color:#0284C7; font-weight:700;" title="Definir os períodos e prazos dos 4 bimestres letivos">
       <svg class="btn-icon" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
       Ciclos Avaliativos & Calendário
     </button>
     <button class="btn btn-secondary" onclick="exportFullBaseJSON()" ...>Exportar Base Completa (JSON)</button>
     <button class="btn btn-secondary" onclick="triggerImportFullBase()" ...>Importar Base Completa (JSON)</button>
   </div>
   ```
2. **Dentro do modal de "Ciclos Avaliativos & Calendário" (`#modalBimesterPeriods`, linhas 8492-8504 de `index.html`):**
   ```html
   <div style="display:flex; justify-content:space-between; align-items:center; background:#F8FAFC; border:1px solid var(--border); border-radius:8px; padding:12px; margin-bottom:16px;">
     <div>
       <label style="font-size:12px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Ano Letivo em Configuração:</label>
       <div style="display:flex; align-items:center; gap:8px; margin-top:4px;">
         <select id="modalBimesterPeriodYearSelect" class="form-select" onchange="onModalBimesterYearChange(this.value)" style="font-weight:700; font-size:14px; padding:4px 10px; border-radius:6px;">
         </select>
       </div>
     </div>
     <button type="button" class="btn btn-secondary" onclick="openCreateNewAcademicYearModal()" style="color:#0284C7; font-weight:700; border-color:#BAE6FD; background:#F0F9FF;">
       ➕ Novo Ano Letivo
     </button>
   </div>
   ```

### 1.2. O Problema Reportado e Justificativa de UX Pedagógica
O usuário solicitou:
> *"a função de iniciar novo ciclo avaliativo deve estar na tela de "ciclos avaliativos e calendário". crie um plano para tanto"*

1. **Descentralização Indesejada na Barra Principal:**
   - Iniciar um novo ciclo avaliativo (ano letivo) é uma ação deliberativa de governança pedagógica realizada periodicamente (uma vez ao ano), e **não** uma operação corriqueira de rotina semanal.
   - Deixar o botão solto no topo da Gestão da Rede polui a barra de ações rápidas, cria concorrência visual com "Ciclos Avaliativos & Calendário" e gera risco de disparo acidental.
2. **Coerência da Arquitetura de Informação:**
   - A tela de **"Ciclos Avaliativos & Calendário"** (`#modalBimesterPeriods`) é o ambiente natural e SSOT onde a Coordenadora do Núcleo de Educação Infantil parametriza os anos letivos, seleciona o ano em configuração e define as janelas temporais dos bimestres.
   - Portanto, a função de **Iniciar Novo Ciclo Avaliativo** deve pertencer exclusivamente a esse contexto gerencial.
3. **Harmonização Terminológica e Visual:**
   - Substituição do rótulo reduzido `➕ Novo Ano Letivo` dentro do modal pelo termo canônico formal: **`Iniciar Novo Ciclo Avaliativo`**.
   - Eliminação de emojis remanescentes (`➕`, `🌟`) no botão e no cabeçalho do assistente (`#modalCreateAcademicYear`), substituindo-os por pictogramas vetoriais inline (`.btn-icon`), em total alinhamento com a diretriz institucional da versão 1.31.

---

## 2. Arquitetura e Pontos de Impacto

```mermaid
flowchart TD
    A["Gestão da Rede (#homeGestaoActionsCentral)"] -->|Remover botão redundante| B["Ações Restantes: Ciclos Avaliativos & Calendário + Exportar/Importar"]
    B -->|Clique| C["Modal Ciclos Avaliativos & Calendário (#modalBimesterPeriods)"]
    C -->|Local Canônico Exclusivo| D["Botão: Iniciar Novo Ciclo Avaliativo (com SVG)"]
    D -->|onclick='openCreateNewAcademicYearModal()'| E["Modal Assistente: Iniciar Novo Ciclo Avaliativo (#modalCreateAcademicYear)"]
    E -->|Clonagem de Turmas / Matriz Limpa| F["SSOT: appState.academicYears + appState.bimesterPeriods"]
```

Os seguintes pontos do projeto serão modificados:
1. **`index.html` (e espelho `firebase_deploy/public/index.html`):**
   - **Barra de Ações da Gestão da Rede (`#homeGestaoActionsCentral`):**
     - Remoção completa do botão `<button class="btn btn-secondary" onclick="openCreateNewAcademicYearModal()">... Iniciar Novo Ano Letivo</button>`.
   - **Modal de Ciclos Avaliativos & Prazos Oficiais (`#modalBimesterPeriods`):**
     - Substituição do botão `➕ Novo Ano Letivo` por botão estilizado com SVG vetorial e texto oficial:
       `Iniciar Novo Ciclo Avaliativo`.
   - **Modal de Criação de Novo Ano Letivo (`#modalCreateAcademicYear`):**
     - Higienização do cabeçalho: remoção de `<span>🌟</span>` em favor de pictograma vetorial SVG institucional.
     - Ajuste do título para `Iniciar Novo Ciclo Avaliativo (Ano Letivo)`.
   - **Lógica e Feedbacks em JavaScript:**
     - Ajuste das mensagens em `openCreateNewAcademicYearModal()` e `confirmCreateNewAcademicYear()` para manter conformidade terminológica (`Apenas a Coordenadora do Núcleo de EI pode iniciar um novo ciclo avaliativo.`).
   - **Changelog Duplo:**
     - Atualização do `#modalChangelog`, botão `.btn-changelog` e arquivo `CHANGELOG.md` para a **Versão 1.35**.
2. **Suíte de Auditoria (`index.html` e `audit_platform.py`):**
   - Inclusão de testes de validação determinística no módulo `catalogo_dados` ou `navegacao_layout`:
     - Asserção de que o botão foi removido de `#homeGestaoActionsCentral`.
     - Asserção de que o botão existe dentro de `#modalBimesterPeriods` com o rótulo canônico `Iniciar Novo Ciclo Avaliativo`.
     - Teste de abertura interativa do modal `#modalCreateAcademicYear` a partir de `#modalBimesterPeriods` com perfil da Coordenadora da EI (`helena`).
     - Teste negativo de RBAC para perfis sem autorização.

---

## 3. Especificação de Implementação Passo a Passo (Snippets Exatos)

### Passo 1: Limpeza da Barra de Ações da Gestão da Rede (`#homeGestaoActionsCentral`)
Localizar as linhas 3720-3738 de `index.html`:

```html
<!-- ANTES -->
        <div style="display:flex; gap:8px; flex-wrap:wrap;" id="homeGestaoActionsCentral">
          <button class="btn btn-secondary" onclick="openCreateNewAcademicYearModal()" style="color:#0284C7; font-weight:700; background:#F0F9FF; border-color:#BAE6FD;" title="Iniciar um novo ano letivo na rede municipal">
            <svg class="btn-icon" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            Iniciar Novo Ano Letivo
          </button>
          <button class="btn btn-secondary" onclick="openBimesterPeriodsModal()" style="color:#0284C7; font-weight:700;" title="Definir os períodos e prazos dos 4 bimestres letivos">
            <svg class="btn-icon" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Ciclos Avaliativos & Calendário
          </button>
          <button class="btn btn-secondary" onclick="exportFullBaseJSON()" style="color:#059669; font-weight:700;">
            <svg class="btn-icon" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Exportar Base Completa (JSON)
          </button>
          <button class="btn btn-secondary" onclick="triggerImportFullBase()" style="color:#DC2626; font-weight:700;">
            <svg class="btn-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Importar Base Completa (JSON)
          </button>
          <input type="file" id="importFullBaseFileInput" accept=".json" style="display:none;" onchange="importFullBaseJSON(event)" />
        </div>
```

Substituir por:

```html
<!-- DEPOIS -->
        <div style="display:flex; gap:8px; flex-wrap:wrap;" id="homeGestaoActionsCentral">
          <button class="btn btn-secondary" onclick="openBimesterPeriodsModal()" style="color:#0284C7; font-weight:700; background:#F0F9FF; border-color:#BAE6FD;" title="Definir os períodos, prazos e iniciar novos ciclos avaliativos">
            <svg class="btn-icon" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Ciclos Avaliativos & Calendário
          </button>
          <button class="btn btn-secondary" onclick="exportFullBaseJSON()" style="color:#059669; font-weight:700;">
            <svg class="btn-icon" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Exportar Base Completa (JSON)
          </button>
          <button class="btn btn-secondary" onclick="triggerImportFullBase()" style="color:#DC2626; font-weight:700;">
            <svg class="btn-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Importar Base Completa (JSON)
          </button>
          <input type="file" id="importFullBaseFileInput" accept=".json" style="display:none;" onchange="importFullBaseJSON(event)" />
        </div>
```

---

### Passo 2: Centralização e Destacamento no Modal "Ciclos Avaliativos & Calendário" (`#modalBimesterPeriods`)
Localizar as linhas 8491-8504 de `index.html`:

```html
<!-- ANTES -->
      <!-- Seletor de Ano Letivo para Configuração SSOT -->
      <div style="display:flex; justify-content:space-between; align-items:center; background:#F8FAFC; border:1px solid var(--border); border-radius:8px; padding:12px; margin-bottom:16px;">
        <div>
          <label style="font-size:12px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Ano Letivo em Configuração:</label>
          <div style="display:flex; align-items:center; gap:8px; margin-top:4px;">
            <select id="modalBimesterPeriodYearSelect" class="form-select" onchange="onModalBimesterYearChange(this.value)" style="font-weight:700; font-size:14px; padding:4px 10px; border-radius:6px;">
              <!-- Preenchido dinamicamente com appState.academicYears -->
            </select>
          </div>
        </div>
        <button type="button" class="btn btn-secondary" onclick="openCreateNewAcademicYearModal()" style="color:#0284C7; font-weight:700; border-color:#BAE6FD; background:#F0F9FF;">
          ➕ Novo Ano Letivo
        </button>
      </div>
```

Substituir por:

```html
<!-- DEPOIS -->
      <!-- Seletor de Ano Letivo para Configuração SSOT e Gatilho do Novo Ciclo -->
      <div style="display:flex; justify-content:space-between; align-items:center; background:#F8FAFC; border:1px solid var(--border); border-radius:8px; padding:12px; margin-bottom:16px; gap:12px; flex-wrap:wrap;">
        <div>
          <label style="font-size:12px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Ano Letivo em Configuração:</label>
          <div style="display:flex; align-items:center; gap:8px; margin-top:4px;">
            <select id="modalBimesterPeriodYearSelect" class="form-select" onchange="onModalBimesterYearChange(this.value)" style="font-weight:700; font-size:14px; padding:4px 10px; border-radius:6px;">
              <!-- Preenchido dinamicamente com appState.academicYears -->
            </select>
          </div>
        </div>
        <button type="button" class="btn btn-secondary" id="btnModalStartNewAcademicCycle" onclick="openCreateNewAcademicYearModal()" style="color:#0284C7; font-weight:700; border-color:#BAE6FD; background:#F0F9FF; display:flex; align-items:center; gap:6px; padding:8px 14px;" title="Iniciar um novo ciclo avaliativo e transição de ano letivo na rede municipal">
          <svg class="btn-icon" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          Iniciar Novo Ciclo Avaliativo
        </button>
      </div>
```

---

### Passo 3: Higienização e Modernização do Modal de Criação (`#modalCreateAcademicYear`)
Localizar as linhas 8580-8588 de `index.html`:

```html
<!-- ANTES -->
  <!-- ================= MODAL: CRIAR NOVO ANO LETIVO (TRANSIÇÃO DE CICLO) ================= -->
  <div id="modalCreateAcademicYear" class="modal-backdrop" onclick="if(event.target===this)closeCreateNewAcademicYearModal()">
    <div class="modal-panel" style="max-width:480px;" onclick="event.stopPropagation()">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
        <div style="font-size:17px; font-weight:800; color:var(--primary-dark); display:flex; align-items:center; gap:8px;">
          <span>🌟</span> Iniciar Novo Ano Letivo
        </div>
        <button class="btn btn-secondary" style="padding:4px 8px;" onclick="closeCreateNewAcademicYearModal()">✕</button>
      </div>
```

Substituir por:

```html
<!-- DEPOIS -->
  <!-- ================= MODAL: CRIAR NOVO ANO LETIVO (TRANSIÇÃO DE CICLO) ================= -->
  <div id="modalCreateAcademicYear" class="modal-backdrop" onclick="if(event.target===this)closeCreateNewAcademicYearModal()">
    <div class="modal-panel" style="max-width:480px;" onclick="event.stopPropagation()">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
        <div style="font-size:17px; font-weight:800; color:var(--primary-dark); display:flex; align-items:center; gap:8px;" id="modalCreateAcademicYearTitle">
          <svg class="btn-icon" style="color:#0284C7;" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          Iniciar Novo Ciclo Avaliativo (Ano Letivo)
        </div>
        <button class="btn btn-secondary" style="padding:4px 8px;" onclick="closeCreateNewAcademicYearModal()">✕</button>
      </div>
```

E no botão de confirmação (linha 8616):
```html
<!-- ANTES -->
        <button class="btn btn-primary" onclick="confirmCreateNewAcademicYear()">Confirmar e Abrir Ano</button>
```
Substituir por:
```html
<!-- DEPOIS -->
        <button class="btn btn-primary" onclick="confirmCreateNewAcademicYear()">Confirmar e Iniciar Ciclo</button>
```

---

### Passo 4: Harmonização de Mensagens em JavaScript
Localizar a função `openCreateNewAcademicYearModal()` na linha 24320 de `index.html`:

```javascript
// ANTES
    function openCreateNewAcademicYearModal() {
      const user = getCurrentUser();
      if (!isNucleoEI(user)) {
        showToast('Apenas a Coordenadora do Núcleo de EI pode iniciar um novo ano letivo.');
        return;
      }
```

Substituir por:

```javascript
// DEPOIS
    function openCreateNewAcademicYearModal() {
      const user = getCurrentUser();
      if (!isNucleoEI(user)) {
        showToast('Apenas a Coordenadora do Núcleo de EI pode iniciar um novo ciclo avaliativo.');
        return;
      }
```

E na função `confirmCreateNewAcademicYear()` na linha 24433:

```javascript
// ANTES
      showToast(`Ano Letivo ${yearVal} iniciado com sucesso! Todas as UEs e Servidores foram mantidos.`);
```

Substituir por:

```javascript
// DEPOIS
      showToast(`Novo Ciclo Avaliativo (${yearVal}) iniciado com sucesso! Todas as UEs e Servidores foram mantidos.`);
```

---

### Passo 5: Atualização do Changelog Duplo e Versão 1.35
1. No cabeçalho (linha ~3550):
   - Atualizar botão `.btn-changelog`: `<span>Versão 1.35 (v8.2.2)</span>`
2. No `#modalChangelog`:
   - Adicionar o card oficial da **Versão 1.35**:
     ```html
     <!-- VERSÃO 1.35 - CENTRALIZAÇÃO DO NOVO CICLO AVALIATIVO EM CICLOS & CALENDÁRIO -->
     <div class="card" style="padding:16px; margin-bottom:14px; border-left:4px solid #0284C7; background:#F8FAFC;">
       <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
         <span style="font-weight:800; font-size:14px; color:var(--primary-dark);">Versão 1.35 (v8.2.2)</span>
         <span style="font-size:11px; color:var(--text-secondary); font-weight:600;">27/10/2026</span>
       </div>
       <div style="font-size:12px; color:var(--text-primary); line-height:1.5;">
         <strong>Centralização da Função Iniciar Novo Ciclo Avaliativo na Tela de Ciclos Avaliativos & Calendário:</strong>
         <ul style="margin:6px 0 0 16px; padding:0;">
           <li>📅 <strong>Centralização de UX e Arquitetura de Informação:</strong> Remoção do botão de início de ano letivo solto na barra de ações principais de Gestão da Rede (<code>#homeGestaoActionsCentral</code>), alocando a ação exclusivamente dentro da tela de governança <em>"Ciclos Avaliativos & Calendário"</em> (<code>#modalBimesterPeriods</code>).</li>
           <li>🏷️ <strong>Padronização Terminológica Canônica:</strong> Substituição do rótulo <code>➕ Novo Ano Letivo</code> por <code>Iniciar Novo Ciclo Avaliativo</code>, com pictograma vetorial SVG institucional (eliminação de emojis residuais).</li>
           <li>🌟 <strong>Higienização do Assistente de Transição (<code>#modalCreateAcademicYear</code>):</strong> Título harmonizado para <em>"Iniciar Novo Ciclo Avaliativo (Ano Letivo)"</em> com ícone vetorial e confirmação contextual preservando todo o patrimônio de UEs, turmas e servidores.</li>
           <li>🔬 <strong>Auditoria Contínua com 100% de Aprovação:</strong> Novos testes no Módulo 2 validando a ausência do botão solto na barra central, a presença no modal de ciclos e a integridade de acionamento do fluxo via Coordenadora do Núcleo de EI.</li>
         </ul>
       </div>
     </div>
     ```
3. No arquivo `CHANGELOG.md`:
   - Registrar no topo a linha da tabela sumária e a seção descritiva correspondente.

---

## 4. Critérios de Aceite e Roteiro de Teste

### Critérios de Aceite:
1. **Limpeza da Barra de Ações:** O botão "Iniciar Novo Ano Letivo" não existe mais em `#homeGestaoActionsCentral`. A barra exibe apenas: "Ciclos Avaliativos & Calendário", "Exportar Base Completa (JSON)" e "Importar Base Completa (JSON)".
2. **Presença Canônica no Modal:** Ao abrir "Ciclos Avaliativos & Calendário" (`#modalBimesterPeriods`), o card superior do ano letivo contém o botão `Iniciar Novo Ciclo Avaliativo` com ícone SVG vetorial e ID `#btnModalStartNewAcademicCycle`.
3. **Disparo do Assistente:** Ao clicar no botão, o modal `#modalCreateAcademicYear` é aberto exibindo o título atualizado *"Iniciar Novo Ciclo Avaliativo (Ano Letivo)"*.
4. **Preservação de RBAC:** Apenas a Coordenadora do Núcleo de EI (Helena Martins) consegue abrir o assistente e iniciar o ciclo. Usuários com outros papéis recebem toast orientador.
5. **Preservação de Dados:** Ao criar novo ano letivo (ex: 2027), a clonagem de turmas, docentes e integridade dos dados anteriores é mantida com 100% de precisão na SSOT.
6. **Integridade Sintática (JSC):** `python3 audit_platform.py --check-syntax` retorna 0 erros.
7. **Auditoria Modular (Headless):** `python3 audit_platform.py --silent-on-success` é 100% aprovada.

---

## 5. Seção Obrigatória de Auditoria: Alterações no Algoritmo de Auditoria (`audit_platform.py` e Suíte de Testes)

### 5.1. Testes a Adicionar no Módulo 2 (`catalogo_dados`) em `index.html`:
No arquivo `index.html`, dentro do bloco de testes do módulo `catalogo_dados` (linha ~25120), inserir o seguinte teste determinístico ponta a ponta:

```javascript
              // 11. VALIDAÇÃO DA CENTRALIZAÇÃO DE INÍCIO DE CICLO AVALIATIVO (VERSÃO 1.35)
              // 11.1 Asserção Negativa: Botão NÃO deve existir na barra de ações rápidas de Gestão da Rede
              const homeActions = document.getElementById('homeGestaoActionsCentral');
              if (homeActions) {
                const orphanYearBtn = Array.from(homeActions.querySelectorAll('button')).find(b => {
                  const clickAttr = b.getAttribute('onclick') || '';
                  const text = (b.textContent || '').toLowerCase();
                  return clickAttr.includes('openCreateNewAcademicYearModal') || text.includes('iniciar novo ano letivo');
                });
                if (orphanYearBtn) {
                  throw new Error('Falha de UX: Botão de iniciar novo ano letivo/ciclo ainda existe solto em #homeGestaoActionsCentral');
                }
              }
              logger.log('Asserção Negativa: Remoção do botão de início de ciclo da barra de ações gerais (#homeGestaoActionsCentral)', true);

              // 11.2 Asserção Positiva: Botão DEVE existir com destaque dentro de #modalBimesterPeriods
              openBimesterPeriodsModal();
              const bimModalEl = document.getElementById('modalBimesterPeriods');
              if (!bimModalEl || !bimModalEl.classList.contains('active')) {
                throw new Error('Falha ao abrir #modalBimesterPeriods como Coordenadora da EI');
              }

              const startCycleBtn = document.getElementById('btnModalStartNewAcademicCycle') || bimModalEl.querySelector('button[onclick*="openCreateNewAcademicYearModal"]');
              if (!startCycleBtn) {
                throw new Error('Botão de iniciar novo ciclo avaliativo não localizado em #modalBimesterPeriods');
              }

              const btnText = startCycleBtn.textContent.trim();
              if (!btnText.includes('Iniciar Novo Ciclo Avaliativo')) {
                throw new Error(`Rótulo incorreto no botão de ciclo avaliativo: esperado conter "Iniciar Novo Ciclo Avaliativo", obtido "${btnText}"`);
              }

              if (startCycleBtn.querySelector('svg.btn-icon') === null) {
                throw new Error('Botão de iniciar novo ciclo avaliativo deve conter pictograma vetorial SVG (.btn-icon)');
              }
              logger.log('Presença canônica e rotulagem oficial do botão "Iniciar Novo Ciclo Avaliativo" em #modalBimesterPeriods', true);

              // 11.3 Teste de Disparo do Assistente de Transição (#modalCreateAcademicYear)
              startCycleBtn.click();
              const createYearModal = document.getElementById('modalCreateAcademicYear');
              if (!createYearModal || !createYearModal.classList.contains('active')) {
                throw new Error('Clique no botão em #modalBimesterPeriods não abriu o assistente #modalCreateAcademicYear');
              }

              const createYearTitle = document.getElementById('modalCreateAcademicYearTitle') || createYearModal.querySelector('.modal-panel > div:first-child');
              if (!createYearTitle || !createYearTitle.textContent.includes('Iniciar Novo Ciclo Avaliativo')) {
                throw new Error('Título do assistente #modalCreateAcademicYear deve conter "Iniciar Novo Ciclo Avaliativo"');
              }

              // Fecha os modais e garante restauração do estado
              closeCreateNewAcademicYearModal();
              closeBimesterPeriodsModal();
              logger.log('Fluxo interativo completo de abertura do assistente de novo ciclo a partir de #modalBimesterPeriods', true);
```

### 5.2. Atualização no Módulo 12 (`navegacao_layout`) em `index.html`:
Atualizar a verificação do card de changelog da versão:
```javascript
// Atualizar asserção de versão para 1.35
if (!btnChangelog.textContent.includes('Versão 1.35')) {
  throw new Error(`Botão de versão desatualizado: "${btnChangelog.textContent.trim()}"`);
}
if (!modalChg.innerHTML.includes('Versão 1.35')) {
  throw new Error('#modalChangelog não contém o card descritivo da Versão 1.35');
}
logger.log('Asserção de Integridade do Cabeçalho e Registro da Versão 1.35 (v8.2.2)', true);
```

### 5.3. Alterações no Script Python `audit_platform.py`:
- Nenhuma alteração sintática necessária no runner de `audit_platform.py`, pois a suíte consome dinamicamente os 12 módulos de teste expostos pelo `index.html`.
- O comando `python3 audit_platform.py --silent-on-success` executará e validará automaticamente o Módulo 2 e o Módulo 12 pós-deploy.

---

## 6. Checklist de Execução para a Etapa 2 (Operário)
- [ ] Ler `WORKFLOW_MACOS.md` e a skill `execucao-operario`.
- [ ] Criar o backup intermediário `intermediárias/aplicativo_v135_iniciar_novo_ciclo_tela_ciclos_e_calendario.html`.
- [ ] Aplicar as alterações nos Snippets dos Passos 1 a 5 em `gestor supervisao_patos/index.html`.
- [ ] Espelhar em `gestor supervisao_patos/firebase_deploy/public/index.html`.
- [ ] Atualizar o `CHANGELOG.md` para a Versão 1.35.
- [ ] Validar integridade léxica/sintática: `python3 audit_platform.py --check-syntax`.
- [ ] Verificar concorrência remota: `git fetch origin main` e `git log HEAD..origin/main --oneline`.
- [ ] Criar commit semântico: `feat(ui): centralizar funcao de iniciar novo ciclo avaliativo na tela de ciclos e calendario (v1.35)`.
- [ ] Enviar com `git push origin main`.
- [ ] Executar pós-deploy: `python3 audit_platform.py --silent-on-success`.
