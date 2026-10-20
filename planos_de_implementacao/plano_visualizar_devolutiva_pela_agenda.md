# PLANO DE IMPLEMENTAÇÃO: VISUALIZAÇÃO DE DEVOLUTIVA DA OBSERVAÇÃO PELA ABA DE AGENDA

> **DIRETRIZ OBRIGATÓRIA DE EXECUÇÃO (ETAPA 1 & ETAPA 2 - WORKFLOW_MACOS.md / AGENTS.md / GEMINI.md):**
> 1. O assistente executor (Etapa 2) DEVE obrigatoriamente ler e seguir as diretrizes deste plano e do `WORKFLOW_MACOS.md` antes de aplicar qualquer modificação.
> 2. Sincronização prévia obrigatória: executar `git pull origin main` antes de iniciar a edição.
> 3. Aplicar estritamente as alterações de interface, lógica de navegação e resolução relacional especificadas neste documento, implementando o botão "📋 Devolutiva" / "📋 Ver Devolutiva" na visualização desktop e mobile da aba de Agenda para visitas que possuem observação realizada/concluída.
> 4. Dupla checagem obrigatória: reler as linhas modificadas no `index.html` para certificar-se da correta persistência.
> 5. Salvamento de backup intermediário: salvar cópia idêntica em `intermediárias/aplicativo_v89_visualizar_devolutiva_agenda.html`.
> 6. Gestão dupla de Changelog no arquivo `CHANGELOG.md` e no modal `#modalChangelog` do `index.html`, elevando a versão oficial para **Versão 0.89 (v7.68)**.
> 7. Sincronização espelhada obrigatória entre `index.html` (raiz), `gestor supervisao_patos/index.html` e `gestor supervisao_patos/firebase_deploy/public/index.html`.
> 8. Checagem pré-push (`git fetch origin main`), rebase se necessário, commit semântico (`feat: botao para visualizacao de devolutiva da observacao diretamente pela agenda`) e envio para `origin main` com deploy automático no **GitHub Pages**.
> 9. Execução pós-deploy do algoritmo de auditoria (`python3 audit_platform.py --silent-on-success`), reportando ao usuário **somente se houverem problemas**.

---

## 1. Diagnóstico e Contexto

### 1.1 Cenário Atual
Atualmente, no módulo de Cronograma / Agenda (`#screenSchedule`), quando uma visita agendada atinge o status `realizado` (seja por baixa automática na finalização da observação ou por alteração cadastral):
1. **Interface Desktop (`#scheduleTableBody`):** A coluna de ações renderiza apenas um selo textual `<span style="color:var(--green)">Concluída</span>` e o botão `<button class="btn btn-secondary">Arquivar</button>` (ou "Desarquivar" caso a visita esteja arquivada).
2. **Interface Mobile (`#scheduleCardsContainer`):** A barra de ações inferior (`.schedule-card-actions`) renderiza o selo "Concluída" e o botão "Arquivar" (ou "Desarquivar").
3. **Desconexão do Fluxo Pedagógico:** Não existe na Agenda nenhum mecanismo direto para consultar o instrumento de observação ou parecer devolutivo gerado a partir daquela visita. Caso a Coordenadora Pedagógica, Formadora ou Técnica deseje consultar o que foi observado, as rubricas pontuadas, os comentários ou a devolutiva formativa acordada com o docente/turma naquela visita, o usuário é obrigado a:
   - Sair da Agenda;
   - Navegar até a aba "Histórico";
   - Filtrar ou rolar a lista de observações concluídas procurando a escola, turma, bimestre e data equivalentes;
   - Clicar em "Ver Devolutiva →".
4. **Isolamento de Visitas Arquivadas:** Quando a visita realizada é arquivada (manualmente ou pela rotina de arquivamento), essa desconexão é ainda mais crítica, pois o usuário na Agenda vê apenas o botão "Desarquivar", sem nenhum atalho para a devolutiva que gerou a conclusão da visita.

### 1.2 Resultado Esperado
1. **Botão de Visualização da Devolutiva na Agenda:**
   - Adicionar o botão **"📋 Devolutiva"** na tabela Desktop (ao lado de "Arquivar" ou "Desarquivar").
   - Adicionar o botão **"📋 Ver Devolutiva"** nos cards Mobile (com layout simétrico e ergonômico ao lado de "Arquivar" ou "Desarquivar").
2. **Exibição Inteligente e Contextual:**
   - O botão deve ser renderizado para qualquer agendamento com status `realizado` ou que possua observação finalizada vinculada (tanto no filtro de visitas ativas quanto arquivadas).
   - Visitas não realizadas (planejadas / pendentes) continuam exibindo seus botões de ação normais ("Iniciar Visita →" e "Editar").
3. **Resolução Relacional Bidirecional e Resiliente (`findObservationForSchedule`):**
   - Resolução determinística da observação associada:
     1. Vínculo por `sched.observationId` gravado diretamente no agendamento;
     2. Vínculo por `obs.scheduleId` gravado na observação finalizada;
     3. Heurística resiliente por metadados (`schoolName`, `bimester`, `className` / `teacherName` ou equipe de regência de turma).
   - Ao finalizar uma observação em `finalizeObservation()`, gravar explicitamente `sched.observationId = obs.id;` no objeto de agendamento correspondente, garantindo integridade imediata.
4. **Navegação Fluida e Retorno Contextual:**
   - Ao clicar no botão, disparar `viewFeedbackFromSchedule(scheduleId)`, que memoriza a rota de origem (`appState.returnTab = 'schedule'`) e abre a visualização oficial da observação finalizada em modo somente leitura (`resumeObservation(obs.id, true)`).
   - Na tela de observação em modo somente leitura (`screenActiveObs`) e na Síntese Final (`screenSynthesis`), prover botão de retorno direto: "← Voltar à Agenda" (ou "Voltar à Agenda"), permitindo ao usuário regressar diretamente à tela da Agenda de onde partiu, sem atrito cognitivo.

---

## 2. Arquitetura e Pontos de Impacto

Os seguintes blocos de código e funções serão modificados no `index.html`:

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. ABA DE AGENDA / CRONOGRAMA (#screenSchedule)                                         │
│    - renderScheduleScreen() [~linha 10249]                                              │
│      - actionHtml (Tabela Desktop): Inclusão do botão "📋 Devolutiva"                   │
│      - cardActionHtml (Cards Mobile): Inclusão do botão "📋 Ver Devolutiva"             │
└───────────────────────────────────────────┬─────────────────────────────────────────────┘
                                            │
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ 2. FUNÇÕES RELACIONAIS E DE CONTROLE NA AGENDA                                          │
│    - findObservationForSchedule(sched) [Nova função helper reutilizável]                │
│    - viewFeedbackFromSchedule(scheduleId) [Nova função disparadora]                     │
│    - exitReadOnlyMode() [Nova função de retorno contextual]                             │
└───────────────────────────────────────────┬─────────────────────────────────────────────┘
                                            │
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ 3. SINCRONIZAÇÃO NA FINALIZAÇÃO DA OBSERVAÇÃO                                           │
│    - finalizeObservation() [~linha 9720]                                                │
│      - Gravação explícita de sched.observationId = obs.id                               │
└───────────────────────────────────────────┬─────────────────────────────────────────────┘
                                            │
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ 4. TELA DE OBSERVAÇÃO ATIVA E SÍNTESE FINAL (MODO DEVOLUTIVA)                           │
│    - Barra #readOnlyWarning [~linha 2411]: Botão contextual "← Voltar"                  │
│    - renderSynthesisScreen() [~linha 9283]: Rótulo e rota dinâmica ("Voltar à Agenda") │
└───────────────────────────────────────────┬─────────────────────────────────────────────┘
                                            │
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ 5. SUÍTE DE AUDITORIA MODULAR                                                           │
│    - audit_platform.py & index.html (Módulo agenda_cronograma)                          │
│      - Teste determinístico de renderização do botão de devolutiva na Agenda            │
│      - Teste da ação viewFeedbackFromSchedule() e abertura em Read-Only                 │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Especificação Passo a Passo de Implementação

### 3.1 Atualização de `finalizeObservation()`: Vínculo Bidirecional Explícito
No arquivo `index.html`, localizar a função `finalizeObservation()` (aproximadamente linha 9708 a 9724):

```javascript
      // Atualiza o status do agendamento correspondente para 'realizado' (Pilar 1 e individual)
      let sched = null;
      if (obs.scheduleId) {
        sched = appState.schedules.find(s => s.id === obs.scheduleId);
      }
      if (!sched) {
        sched = appState.schedules.find(s => 
          ((s.targetName && (s.targetName === obs.teacherName || (obs.teachers && obs.teachers.includes(s.targetName)))) ||
           (s.className && s.className === obs.className) ||
           (s.schoolName === obs.schoolName && obs.teachers && obs.teachers.includes(s.targetName))) &&
          s.bimester === obs.bimester && !s.archived
        );
      }
      if (sched) {
        sched.status = 'realizado';
      }
```

**Substituir exatamente por:**
```javascript
      // Atualiza o status do agendamento correspondente para 'realizado' (Pilar 1 e individual) e vincula observationId
      let sched = null;
      if (obs.scheduleId) {
        sched = appState.schedules.find(s => s.id === obs.scheduleId);
      }
      if (!sched) {
        sched = appState.schedules.find(s => 
          ((s.targetName && (s.targetName === obs.teacherName || (obs.teachers && obs.teachers.includes(s.targetName)))) ||
           (s.className && s.className === obs.className) ||
           (s.schoolName === obs.schoolName && obs.teachers && obs.teachers.includes(s.targetName))) &&
          s.bimester === obs.bimester && !s.archived
        );
      }
      if (sched) {
        sched.status = 'realizado';
        sched.observationId = obs.id;
      }
```

---

### 3.2 Criação das Funções `findObservationForSchedule()`, `viewFeedbackFromSchedule()` e `exitReadOnlyMode()`
No arquivo `index.html`, logo acima de `function renderScheduleScreen()` (aproximadamente linha 10248), inserir os novos métodos canônicos:

```javascript
    // --- HELPER: LOCALIZAÇÃO DETERMINÍSTICA E RESILIENTE DA OBSERVAÇÃO DE UM AGENDAMENTO ---
    function findObservationForSchedule(sched) {
      if (!sched || !appState.observations || appState.observations.length === 0) return null;

      // 1. Busca direta por observationId gravado no próprio agendamento
      if (sched.observationId) {
        const obsDirect = appState.observations.find(o => o.id === sched.observationId);
        if (obsDirect) return obsDirect;
      }

      // 2. Busca direta por scheduleId gravado na observação (priorizando finalizadas)
      const obsBySchedId = appState.observations.find(o => o.scheduleId === sched.id && (o.status === 'finalized' || o.status === 'concluida'));
      if (obsBySchedId) return obsBySchedId;

      // 3. Busca heurística resiliente por metadados da visita em observações finalizadas
      const obsByMeta = appState.observations.find(o => {
        if (o.status !== 'finalized' && o.status !== 'concluida') return false;
        if (sched.schoolName && o.schoolName !== sched.schoolName) return false;
        if (sched.bimester && o.bimester !== sched.bimester) return false;

        const classMatch = !!(sched.className && o.className && sched.className === o.className);
        const targetMatch = !!(sched.targetName && (
          o.teacherName === sched.targetName ||
          (Array.isArray(o.teachers) && o.teachers.includes(sched.targetName)) ||
          (typeof resolveCanonicalUserName === 'function' && resolveCanonicalUserName(o.teacherName) === resolveCanonicalUserName(sched.targetName))
        ));

        return classMatch || targetMatch;
      });
      if (obsByMeta) return obsByMeta;

      // 4. Fallback final: qualquer observação vinculada ao scheduleId (mesmo rascunho)
      return appState.observations.find(o => o.scheduleId === sched.id) || null;
    }

    // --- AÇÃO: VISUALIZAR DEVOLUTIVA DA OBSERVAÇÃO A PARTIR DA AGENDA ---
    function viewFeedbackFromSchedule(scheduleId) {
      const sched = (appState.schedules || []).find(s => s.id === scheduleId);
      if (!sched) {
        showToast('Agendamento não localizado.');
        return;
      }

      const obs = findObservationForSchedule(sched);
      if (!obs) {
        showToast('Nenhuma observação finalizada foi localizada para esta visita.');
        return;
      }

      // Registra a tela de origem para retorno contextual
      appState.returnTab = 'schedule';

      // Abre a observação finalizada em modo somente leitura (Devolutiva Oficial)
      resumeObservation(obs.id, true);
    }

    // --- AÇÃO: RETORNO CONTEXTUAL DO MODO SOMENTE LEITURA ---
    function exitReadOnlyMode() {
      const targetTab = appState.returnTab || 'schedule';
      navigateToTab(targetTab);
    }
```

---

### 3.3 Atualização de `renderScheduleScreen()`: Botões de Devolutiva na Tabela e nos Cards
No arquivo `index.html`, localizar em `renderScheduleScreen()` o bloco de geração de `actionHtml` e `cardActionHtml` (aproximadamente linhas 10383 a 10413):

```javascript
        if (s.archived) {
          actionHtml = `
            <div style="display:flex; gap:6px; justify-content:center; align-items:center;">
              <span style="font-size:11px; color:var(--text-secondary); font-weight:600;">Arquivada</span>
              <button class="btn btn-secondary" style="padding:4px 8px; font-size:11px;" onclick="unarchiveSchedule('${s.id}')" title="Desarquivar visita">
                Desarquivar
              </button>
            </div>
          `;
          cardActionHtml = `
            <span style="font-size:11px; color:var(--text-secondary); font-weight:600; margin-right:auto;">Visita Arquivada</span>
            <button class="btn btn-secondary" style="padding:7px 12px; font-size:12px;" onclick="unarchiveSchedule('${s.id}')">
              Desarquivar
            </button>
          `;
        } else if (s.status === 'realizado') {
          actionHtml = `
            <div style="display:flex; gap:6px; justify-content:center; align-items:center;">
              <span style="font-size:11px; color:var(--green); font-weight:700;">Concluída</span>
              <button class="btn btn-secondary" style="padding:4px 8px; font-size:11px;" onclick="archiveSchedule('${s.id}')" title="Arquivar esta visita realizada">
                Arquivar
              </button>
            </div>
          `;
          cardActionHtml = `
            <span style="font-size:11px; color:var(--green); font-weight:700; margin-right:auto;">Concluída</span>
            <button class="btn btn-secondary" style="padding:7px 12px; font-size:12px;" onclick="archiveSchedule('${s.id}')">
              Arquivar
            </button>
          `;
        } else {
```

**Substituir exatamente por:**
```javascript
        const linkedObs = findObservationForSchedule(s);
        const hasFeedback = !!linkedObs;

        if (s.archived) {
          actionHtml = `
            <div style="display:flex; gap:6px; justify-content:center; align-items:center; flex-wrap:wrap;">
              ${hasFeedback ? `
                <button class="btn btn-primary" style="padding:4px 8px; font-size:11px; display:inline-flex; align-items:center; gap:4px;" onclick="viewFeedbackFromSchedule('${s.id}')" title="Visualizar Devolutiva Pedagógica da Observação">
                  📋 Devolutiva
                </button>
              ` : ''}
              <button class="btn btn-secondary" style="padding:4px 8px; font-size:11px;" onclick="unarchiveSchedule('${s.id}')" title="Desarquivar visita">
                Desarquivar
              </button>
            </div>
          `;
          cardActionHtml = `
            <div style="display:flex; gap:8px; width:100%; align-items:center; flex-wrap:wrap;">
              <span style="font-size:11px; color:var(--text-secondary); font-weight:600; margin-right:auto;">Visita Arquivada</span>
              <button class="btn btn-secondary" style="padding:7px 12px; font-size:12px; flex:1;" onclick="unarchiveSchedule('${s.id}')">
                Desarquivar
              </button>
              ${hasFeedback ? `
                <button class="btn btn-primary" style="padding:7px 12px; font-size:12px; font-weight:700; flex:1.4; display:inline-flex; align-items:center; justify-content:center; gap:5px;" onclick="viewFeedbackFromSchedule('${s.id}')">
                  📋 Ver Devolutiva
                </button>
              ` : ''}
            </div>
          `;
        } else if (s.status === 'realizado') {
          actionHtml = `
            <div style="display:flex; gap:6px; justify-content:center; align-items:center; flex-wrap:wrap;">
              <button class="btn btn-primary" style="padding:4px 8px; font-size:11px; display:inline-flex; align-items:center; gap:4px;" onclick="viewFeedbackFromSchedule('${s.id}')" title="Visualizar Devolutiva Pedagógica da Observação">
                📋 Devolutiva
              </button>
              <button class="btn btn-secondary" style="padding:4px 8px; font-size:11px;" onclick="archiveSchedule('${s.id}')" title="Arquivar esta visita realizada">
                Arquivar
              </button>
            </div>
          `;
          cardActionHtml = `
            <div style="display:flex; gap:8px; width:100%; align-items:center; flex-wrap:wrap;">
              <button class="btn btn-secondary" style="padding:7px 12px; font-size:12px; flex:1;" onclick="archiveSchedule('${s.id}')">
                Arquivar
              </button>
              <button class="btn btn-primary" style="padding:7px 12px; font-size:12px; font-weight:700; flex:1.4; display:inline-flex; align-items:center; justify-content:center; gap:5px;" onclick="viewFeedbackFromSchedule('${s.id}')">
                📋 Ver Devolutiva
              </button>
            </div>
          `;
        } else {
```

---

### 3.4 Barra de Modo Somente Leitura com Botão de Retorno Rápido (`#readOnlyWarning`)
No arquivo `index.html`, localizar o elemento `#readOnlyWarning` (aproximadamente linha 2411):

```html
  <!-- Read-Only Banner -->
  <div id="readOnlyWarning" class="readonly-bar">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/></svg>
    Instrumento Finalizado · Modo Somente Leitura (Integridade de Dados Assegurada)
  </div>
```

**Substituir exatamente por:**
```html
  <!-- Read-Only Banner com Ação de Retorno Contextual -->
  <div id="readOnlyWarning" class="readonly-bar" style="display:none; justify-content:space-between; align-items:center; padding:8px 16px;">
    <div style="display:flex; align-items:center; gap:8px; font-weight:600;">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/></svg>
      <span>Instrumento Finalizado · Modo Somente Leitura (Integridade de Dados Assegurada)</span>
    </div>
    <button class="btn btn-secondary" style="padding:4px 10px; font-size:11px; font-weight:700; background:#FFFFFF; color:var(--text-primary); border:1px solid #CBD5E1; border-radius:6px;" onclick="exitReadOnlyMode()">
      ← Voltar
    </button>
  </div>
```

---

### 3.5 Atualização da Ação de Retorno na Síntese Final (`renderSynthesisScreen()`)
No arquivo `index.html`, na função `renderSynthesisScreen()`, localizar o bloco de ações em modo somente leitura (aproximadamente linha 9283 a 9289):

```javascript
      // Actions Footer
      const actions = document.getElementById('synthesisActionButtons');
      const isReadOnlyOrFinalized = !!(obs && (obs.status === 'finalized' || obs.status === 'concluida')) || appState.isReadOnly;
      if (isReadOnlyOrFinalized) {
        actions.innerHTML = `
          <button class="btn btn-secondary" onclick="exportSynthesisToPdf()">🖨️ Exportar em PDF</button>
          <button class="btn btn-primary" onclick="navigateToTab('history')">Voltar ao Histórico</button>
        `;
      } else {
```

**Substituir exatamente por:**
```javascript
      // Actions Footer
      const actions = document.getElementById('synthesisActionButtons');
      const isReadOnlyOrFinalized = !!(obs && (obs.status === 'finalized' || obs.status === 'concluida')) || appState.isReadOnly;
      if (isReadOnlyOrFinalized) {
        const returnTab = appState.returnTab || 'history';
        const returnLabel = returnTab === 'schedule' ? 'Voltar à Agenda' : 'Voltar ao Histórico';
        actions.innerHTML = `
          <button class="btn btn-secondary" onclick="exportSynthesisToPdf()">🖨️ Exportar em PDF</button>
          <button class="btn btn-primary" onclick="navigateToTab('${returnTab}')">${returnLabel}</button>
        `;
      } else {
```

---

### 3.6 Atualização da Identificação de Versão e Changelog Duplo

#### 3.6.1 Cabeçalho Superior (`index.html`)
Localizar aproximadamente na linha 2397:
```html
        <button class="btn-changelog" onclick="openChangelogModal()" title="Histórico Integral de Modificações e Diretrizes">
          Versão 0.88 (v7.67)
        </button>
```
**Substituir por:**
```html
        <button class="btn-changelog" onclick="openChangelogModal()" title="Histórico Integral de Modificações e Diretrizes">
          Versão 0.89 (v7.68)
        </button>
```

#### 3.6.2 Modal `#modalChangelog` (`index.html`)
Inserir no topo da listagem de versões do modal `#modalChangelog` (logo acima da Versão 0.88):
```html
      <!-- VERSÃO 0.89 - VISUALIZAÇÃO DE DEVOLUTIVA DA OBSERVAÇÃO PELA ABA DE AGENDA -->
      <div style="margin-bottom:20px; border-left:3px solid var(--primary); padding-left:14px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:14px; font-weight:800; color:var(--primary-dark);">Versão 0.89 · v7.68</span>
          <span style="font-size:11px; background:#EFF6FF; color:var(--primary); padding:2px 8px; border-radius:12px; font-weight:700;">20/10/2026</span>
        </div>
        <div style="font-size:12px; color:var(--text-secondary); margin-top:4px;">
          Visualização Direta da Devolutiva de Observação a Partir da Aba de Agenda:
        </div>
        <ul style="font-size:12px; color:var(--text-primary); margin-top:8px; line-height:1.6; padding-left:16px;">
          <li>📋 <strong>Botão de Devolutiva na Agenda:</strong> Disponibilização do botão "📋 Devolutiva" na tabela desktop e "📋 Ver Devolutiva" nos cards mobile para visitas com observação realizada/concluída.</li>
          <li>🔗 <strong>Vínculo Relacional Resiliente:</strong> Resolução precisa da observação vinculada através da função canônica <code>findObservationForSchedule()</code> (por observationId, scheduleId e metadados contextuais).</li>
          <li>🔄 <strong>Navegação e Retorno Contextual:</strong> Abertura imediata do instrumento em modo somente leitura (<code>resumeObservation</code>) e memorização da rota de origem, com botões dedicados de retorno à Agenda no cabeçalho e na Síntese Final.</li>
          <li>📦 <strong>Cobertura em Visitas Arquivadas:</strong> Acesso à devolutiva também para visitas realizadas que foram posteriormente arquivadas.</li>
          <li>🔬 <strong>Auditoria Modular Aprimorada:</strong> Módulo <code>agenda_cronograma</code> expandido com testes automatizados de identificação de devolutiva e navegação segura.</li>
        </ul>
      </div>
```

#### 3.6.3 `CHANGELOG.md`
1. Adicionar linha no topo do Sumário Executivo:
```markdown
| **0.89** | 20/10/2026 15:30 | `intermediárias/aplicativo_v89_visualizar_devolutiva_agenda.html` | Solicitação direta / Melhoria de Acesso Pedagógico na Agenda | Botão para visualização direta da devolutiva de observação a partir da aba de Agenda (desktop e mobile), vínculo resiliente findObservationForSchedule e retorno contextual 📋 |
```
2. Adicionar seção detalhada correspondente:
```markdown
### [Versão 0.89] - Visualização da Devolutiva da Observação pela Aba de Agenda
* **Data e Horário:** 20 de Outubro de 2026 – 15:30:00
* **Arquivo em Produção:** `index.html`
* **Arquivo Intermediário:** `intermediárias/aplicativo_v89_visualizar_devolutiva_agenda.html`
* **Identificador no App:** 📌 Versão 0.89 (v7.68)
* **Hosting Oficial:** https://silvabrun0.github.io/supervisao-st-crianca/

#### 🚀 Inclusões e Funcionalidades
- **Botão de Visualização de Devolutiva na Agenda:** Introdução do botão "📋 Devolutiva" na tabela desktop e "📋 Ver Devolutiva" nos cards mobile para visitas com status realizado ou com observação finalizada vinculada.
- **Função Relacional `findObservationForSchedule()`:** Resolução determinística e tolerante a falhas que localiza a observação pelo `observationId`, `scheduleId` ou por metadados equivalentes (escola, bimestre, turma/docente).
- **Vínculo Imediato em `finalizeObservation()`:** Registro explícito de `sched.observationId = obs.id` na finalização de novas observações.
- **Retorno Contextual Dinâmico:** Botão "← Voltar" na barra `#readOnlyWarning` e botão dinâmico "Voltar à Agenda" no rodapé da Síntese Final (`#screenSynthesis`).
- **Suporte a Visitas Arquivadas:** Exibição do botão de devolutiva mesmo para visitas concluídas que estejam arquivadas.
```

---

## 4. Critérios de Aceite e Roteiro de Teste/Validação

### 4.1 Critérios de Aceite
1. **Presença do Botão na Tabela Desktop:** Em tela desktop (largura > 768px), ao acessar a aba Agenda, qualquer visita concluída (`status === 'realizado'`) deve exibir o botão azul `📋 Devolutiva` ao lado do botão `Arquivar`.
2. **Presença do Botão nos Cards Mobile:** Em tela mobile (largura <= 768px), os cards de visitas concluídas devem exibir o botão `📋 Ver Devolutiva` com largura proporcional adequada e destaque visual.
3. **Visitas Arquivadas Realizadas:** Ao selecionar o filtro "Visitas Arquivadas", qualquer agendamento arquivado que possua observação correspondente deve exibir o botão `📋 Devolutiva` / `📋 Ver Devolutiva` ao lado de `Desarquivar`.
4. **Visitas Não Realizadas:** Visitas pendentes/planejadas NÃO devem exibir o botão de devolutiva, mantendo os botões de "Iniciar Visita →" e "Editar".
5. **Abertura Fiel em Read-Only:** Ao clicar em `📋 Devolutiva`, o sistema abre imediatamente a tela da observação (`screenActiveObs`) em modo somente leitura com a barra amarela `#readOnlyWarning` ativa.
6. **Retorno Contextual:** Ao clicar no botão `← Voltar` da barra de leitura ou ao avançar para a Síntese Final e clicar em `Voltar à Agenda`, o aplicativo deve retornar exatamente para a tela da Agenda.
7. **Persistência de Novos Vínculos:** Ao planejar uma visita e finalizá-la, a visita é marcada como realizada e recebe o `observationId` da observação concluída.

### 4.2 Roteiro Manual de Validação
1. Efetuar login com perfil de Coordenadora (`Mariana Ferreira` ou `Ana Lúcia`).
2. Acessar a aba **Agenda** (`screenSchedule`).
3. Localizar uma visita concluída: verificar se o botão `📋 Devolutiva` está visível e clicável.
4. Clicar no botão: constatar que a tela da observação abre exibindo as respostas registradas e os comentários qualitativos.
5. Clicar em `← Voltar`: constatar que a aplicação volta para a aba Agenda sem perda de filtros.
6. Acessar novamente a devolutiva, rolar até o rodapé e avançar para a Síntese: constatar que o botão azul indica `Voltar à Agenda`.
7. Alternar o filtro de status da Agenda para "Visitas Arquivadas": constatar que visitas arquivadas que possuem observação concluída exibem o botão de devolutiva.

---

## 5. Seção Obrigatória de Auditoria: Alterações, Adições e Exclusões no Algoritmo de Auditoria (`audit_platform.py` e engine de testes do `index.html`)

Conforme determinado pelo `WORKFLOW_MACOS.md`, o algoritmo de auditoria modular cobre determinística e sequencialmente **100% da plataforma** através de 12 módulos canônicos.

### 5.1 Mapeamento Modo-a-Modo de Impactos e Alterações

| ID do Módulo | Nome Oficial do Módulo | Tipo de Impacto | Descrição das Modificações |
| :--- | :--- | :---: | :--- |
| `auth_rbac` | Autenticação, Usuários, Perfis e RBAC | Neutro | Sem alterações. |
| `catalogo_dados` | Catálogo Canônico, Escolas, Turmas e Professores | Neutro | Sem alterações. |
| `setup_longitudinal` | Setup de Observação, Turmas e Ciclo Longitudinal | Neutro | Sem alterações. |
| `rubricas_observacao` | Observação Ativa, Matrizes Curriculares e Rubricas | Neutro | Sem alterações. |
| `sintese_finalizacao` | Síntese Pedagógica, Escala de Materiais e Horários | Neutro | Sem alterações (preserva validações de horários e finalização). |
| `travas_seguranca` | Travas de Duplo Lançamento e Imutabilidade | Neutro | Sem alterações. |
| `formadora_coordenacao` | Acompanhamento da Formadora e Matriz de Coordenação | Neutro | Sem alterações. |
| **`agenda_cronograma`** | **Cronograma de Visitas, Destaque e Baixa Automática** | **ADIÇÃO & EXPANSÃO** | **Adicionar testes determinísticos para validação do vínculo relacional `findObservationForSchedule()`, renderização do botão de Devolutiva na Agenda e disparo de `viewFeedbackFromSchedule()` com retorno contextual.** |
| `historico_governanca` | Histórico de Observações, Filtros e Exclusão | Neutro | Sem alterações. |
| `indicadores_decisao` | Indicadores Pedagógicos, KPIs e Apoio à Decisão | Neutro | Sem alterações. |
| `backup_exportacao` | Persistência Local, Backup JSON e Restauração | Neutro | Sem alterações. |
| `navegacao_layout` | Sistema de Rotas/Tabs, Menu Mobile e Changelog | Neutro | Sem alterações (valida atualização do botão e modal de changelog). |

---

### 5.2 Especificação Exata das Modificações no Módulo `agenda_cronograma` (`index.html`)

No arquivo `index.html`, localizar no array `AUDIT_MODULES` o bloco correspondente ao módulo `agenda_cronograma` (aproximadamente linha 15670 a 15726):

```javascript
        // --- MÓDULO 8: Cronograma de Visitas, Destaque da Próxima Visita e Baixa Automática ---
        {
          id: 'agenda_cronograma',
          name: 'Cronograma de Visitas, Destaque da Próxima Visita e Baixa Automática',
          run: function(logger) {
            try {
              appState.currentUserKey = 'mariana';
              const newSched = {
                id: 'sched-test-' + Date.now(),
                schoolName: 'CEI Professora Maria de Lourdes',
                targetName: 'Ana Carolina Silva',
                className: 'Infantil I - Turma A',
                bimester: '3º Bimestre',
                plannedDate: getTodayDateString(),
                plannedTime: '09:00',
                status: 'planejado'
              };
              appState.schedules = appState.schedules || [];
              appState.schedules.push(newSched);
              logger.log('Inclusão de visita agendada no cronograma longitudinal', true);

              const simObs = {
                id: 'obs-sim-' + Date.now(),
                scheduleId: newSched.id,
                evaluatedType: 'turma',
                className: 'Infantil I - Turma A',
                teachers: ['Ana Carolina Silva', 'Juliana Roberta Rocha'],
                teacherName: 'Ana Carolina Silva, Juliana Roberta Rocha',
                schoolName: 'CEI Professora Maria de Lourdes',
                bimester: '3º Bimestre',
                evaluatedBy: 'Mariana Ferreira',
                status: 'draft',
                synthesisMaterialDimension: 3,
                synthesisPredominant: 'Livros e materiais',
                synthesisOrg: 'Cantos de atividades',
                responses: {}
              };
              const simSections = getActiveSections(simObs);
              simSections.forEach(sec => {
                (sec.subSections || []).forEach(sub => {
                  (sub.criteria || []).forEach(crit => {
                    simObs.responses[crit.id] = 'consistent';
                  });
                });
              });
              appState.currentObs = simObs;
              finalizeObservation();

              const updatedSched = appState.schedules.find(s => s.id === newSched.id);
              if (!updatedSched || updatedSched.status !== 'realizado') {
                throw new Error('Agendamento não atualizado para realizado após finalização');
              }
              logger.log('Baixa automática no cronograma de visitas para status realizado', true);
            } catch (e) {
              logger.log('Erro de execução no módulo agenda_cronograma', false, e.message);
            }
          }
        },
```

**Substituir exatamente por:**
```javascript
        // --- MÓDULO 8: Cronograma de Visitas, Destaque da Próxima Visita, Baixa Automática e Devolutiva ---
        {
          id: 'agenda_cronograma',
          name: 'Cronograma de Visitas, Destaque da Próxima Visita e Baixa Automática',
          run: function(logger) {
            try {
              appState.currentUserKey = 'mariana';
              const newSched = {
                id: 'sched-test-' + Date.now(),
                schoolName: 'CEI Professora Maria de Lourdes',
                targetName: 'Ana Carolina Silva',
                className: 'Infantil I - Turma A',
                bimester: '3º Bimestre',
                plannedDate: getTodayDateString(),
                plannedTime: '09:00',
                status: 'planejado'
              };
              appState.schedules = appState.schedules || [];
              appState.schedules.push(newSched);
              logger.log('Inclusão de visita agendada no cronograma longitudinal', true);

              const simObs = {
                id: 'obs-sim-' + Date.now(),
                scheduleId: newSched.id,
                evaluatedType: 'turma',
                className: 'Infantil I - Turma A',
                teachers: ['Ana Carolina Silva', 'Juliana Roberta Rocha'],
                teacherName: 'Ana Carolina Silva, Juliana Roberta Rocha',
                schoolName: 'CEI Professora Maria de Lourdes',
                bimester: '3º Bimestre',
                evaluatedBy: 'Mariana Ferreira',
                status: 'draft',
                synthesisMaterialDimension: 3,
                synthesisPredominant: 'Livros e materiais',
                synthesisOrg: 'Cantos de atividades',
                responses: {}
              };
              const simSections = getActiveSections(simObs);
              simSections.forEach(sec => {
                (sec.subSections || []).forEach(sub => {
                  (sub.criteria || []).forEach(crit => {
                    simObs.responses[crit.id] = 'consistent';
                  });
                });
              });
              appState.currentObs = simObs;
              finalizeObservation();

              const updatedSched = appState.schedules.find(s => s.id === newSched.id);
              if (!updatedSched || updatedSched.status !== 'realizado') {
                throw new Error('Agendamento não atualizado para realizado após finalização');
              }
              logger.log('Baixa automática no cronograma de visitas para status realizado', true);

              // TESTE ADICIONAL: Resolução de observação vinculada e botão de Devolutiva na Agenda
              const foundObs = findObservationForSchedule(updatedSched);
              if (!foundObs || foundObs.id !== simObs.id) {
                throw new Error('findObservationForSchedule não localizou a observação finalizada correspondente');
              }
              logger.log('Resolução relacional resiliente de observação vinculada à visita na agenda', true);

              // Renderiza a tela de agenda e valida a presença do botão de devolutiva
              navigateToTab('schedule');
              renderScheduleScreen();

              const tbody = document.getElementById('scheduleTableBody');
              const hasFeedbackBtn = tbody && (tbody.innerHTML.includes('viewFeedbackFromSchedule') || tbody.innerHTML.includes('Devolutiva'));
              if (!hasFeedbackBtn) {
                throw new Error('Botão de Devolutiva não foi renderizado na tabela da Agenda para visita realizada');
              }
              logger.log('Renderização do botão de devolutiva na tabela da aba de Agenda', true);

              // Executa a abertura da devolutiva a partir da agenda
              viewFeedbackFromSchedule(updatedSched.id);
              if (!appState.isReadOnly || !appState.currentObs || appState.currentObs.id !== simObs.id) {
                throw new Error('viewFeedbackFromSchedule falhou em abrir a observação em modo somente leitura');
              }
              if (appState.returnTab !== 'schedule') {
                throw new Error('appState.returnTab não configurado para schedule');
              }
              logger.log('Disparo e abertura da devolutiva em modo somente leitura a partir da Agenda com rota de retorno', true);

              // Valida retorno para a Agenda
              exitReadOnlyMode();
              const scheduleActive = document.getElementById('screenSchedule') && document.getElementById('screenSchedule').classList.contains('active');
              if (!scheduleActive) {
                throw new Error('exitReadOnlyMode não retornou para screenSchedule');
              }
              logger.log('Retorno contextual à aba Agenda com integridade de navegação', true);

            } catch (e) {
              logger.log('Erro de execução no módulo agenda_cronograma', false, e.message);
            }
          }
        },
```

---

### 5.3 Execução Pós-Deploy Obrigatória
Após a aplicação das alterações na Etapa 2, o assistente executor executará:
```bash
python3 audit_platform.py --silent-on-success
```
- Se aprovado com 100%: finalizar sem poluir o chat com logs redundantes.
- Se houver falha: relatar pontualmente as divergências para correção.
