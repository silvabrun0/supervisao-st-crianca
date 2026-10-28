# PLANO DE IMPLEMENTAÇÃO: CORREÇÃO E RESTAURAÇÃO PLENA DO DESTAQUE DA PRÓXIMA OBSERVAÇÃO NO CRONOGRAMA

> **DIRETRIZ OBRIGATÓRIA DE EXECUÇÃO (ETAPA 2):**
> O executor deste plano deve **obrigatoriamente ler e seguir as diretrizes dos arquivos `AGENTS.md`, `WORKFLOW_MACOS.md` e a skill `execucao-operario`** antes de realizar qualquer modificação de código.
> **TRAVA CRÍTICA:** Nenhuma alteração em arquivos de código (`index.html`, `css/`, `js/`) deve ser realizada até a aprovação formal do usuário. Durante a execução, todas as etapas de segurança devem ser cumpridas: validação sintática pré-voo (`python3 audit_platform.py --check-syntax`), geração de backup intermediário em `intermediárias/aplicativo_v[N]_destaque_proxima_observacao.html`, atualização do duplo Changelog (`CHANGELOG.md` e `#modalChangelog`), sincronização dos espelhos e auditoria silenciosa pós-deploy (`python3 audit_platform.py --silent-on-success`). Proibição categórica de abrir o Google Chrome gráfico.

---

## 1. Diagnóstico e Contexto

### 1.1 Cenário Atual e Anomalias Identificadas
Ao inspecionar a tela de **Cronograma de Acompanhamento** (`#screenSchedule`), a rotina JavaScript responsável por renderizar a grade (`renderScheduleScreen()` em `js/features/schedule.js`) e os fluxos associados de pendência apresentam 4 falhas críticas estruturais que anulam ou quebram o destaque da próxima observação:

1. **Ausência do Container Dinâmico no DOM (`#nextScheduleHighlightContainer`):**
   - No arquivo `index.html` (dentro de `#screenSchedule`), o container `<div id="nextScheduleHighlightContainer"></div>` foi suprimido acidentalmente durante refatorações anteriores.
   - Como consequência, a chamada `document.getElementById('nextScheduleHighlightContainer')` retorna `null`, fazendo com que a lógica de injeção do **Hero Card da Próxima Observação** (`.next-visit-hero-card`) seja totalmente ignorada em tempo de execução. O card superior de destaque **nunca é renderizado**.

2. **Classes CSS Inexistentes no Projeto:**
   - As classes de estilo projetadas para o Hero Card (`.next-visit-hero-card`, `.next-visit-hero-header`, `.next-visit-title-badge`, `.next-visit-timing-badge`, `.next-visit-hero-body`, `.next-visit-target-name`, `.next-visit-target-sub`, `.next-visit-school-row`, `.next-visit-meta-card`, `.next-visit-date-highlight`, `.next-visit-weekday-label`, `.next-visit-actions-bar`) e para o marcador inline da tabela/cards (`.badge-next-inline`) **não constam em nenhum arquivo CSS** (`css/04_screens.css`, etc.) nem na tag `<style>` do HTML.
   - Caso o container fosse injetado, o bloco apareceria completamente desformatado, sem bordas temáticas, sem contraste visual e quebrando a identidade visual do sistema.

3. **Incompatibilidade de Resolução em `getActionablePendingSchedules()` (Pilar 1 - Turma vs. Docente):**
   - Em `js/core/navigation.js`, a rotina `getActionablePendingSchedules()` filtra os agendamentos da Coordenadora Pedagógica buscando correspondência nominal estrita em `appState.teamMembers`:
     ```javascript
     const tm = (appState.teamMembers || []).find(m => m.name === s.targetName);
     return tm && tm.roleKey === 'professora' && s.schoolName === user.school;
     ```
   - No entanto, com a implementação do Pilar 1, as observações escolares são atribuídas e agendadas diretamente para **TURMAS** (`s.targetType === 'turma'`, `s.targetName = 'Infantil I - Turma A'`). O nome da turma nunca existe na lista de profissionais de `appState.teamMembers`.
   - Essa incompatibilidade faz com que `getActionablePendingSchedules()` retorne um array vazio `[]` para a Coordenadora, afetando em cascata:
     - O Hero Card e cálculo de próxima observação no Cronograma;
     - A seção dinâmica de próximas observações na Tela Inicial (`#homeScheduledSection`), que passa a exibir incorretamente *"Você não possui nenhuma observação agendada pendente"*;
     - O diálogo seletor de agendamentos no botão `+ Nova Observação` (`handleNewObsButtonClick()`), que ignora os agendamentos existentes da unidade.

4. **Desacoplamento entre o Filtro de Bimestre e a Resolução da Próxima Observação:**
   - Na função `renderScheduleScreen()`, `getNextActionableSchedule()` é executada sem levar em conta o filtro de bimestre ativo (`#scheduleFilterBimester`).
   - Se a usuária filtrar por "2º Bimestre", mas a próxima observação pendente global for do "1º Bimestre", a linha correspondente sequer é exibida na tabela filtrada. Isso resulta em uma tabela sem nenhum destaque inline (`.badge-next-inline`) ou num card superior mostrando um bimestre divergente do filtro selecionado na tela.

---

## 2. Arquitetura e Pontos de Impacto

### Arquivos Afetados:
- `index.html`: Inserção do elemento `<div id="nextScheduleHighlightContainer"></div>` na estrutura de `#screenSchedule`.
- `css/04_screens.css`: Declaração dos estilos completos de `.next-visit-hero-card`, subelementos, badges temporais e etiqueta inline `.badge-next-inline`, incluindo media queries responsivas móveis.
- `js/core/navigation.js`: Ajuste resiliente em `getActionablePendingSchedules()` para suportar agendamentos com `targetType === 'turma'` e turmas da unidade escolar da Coordenadora, bem como coordenações do polo da Formadora.
- `js/features/schedule.js`: Ajuste de `getNextActionableSchedule(filterBimester)` para respeitar o filtro de bimestre ativo e garantir sincronismo entre o Hero Card e a tabela/cards.
- `js/audit/audit_engine.js`: Expansão das asserções no módulo `agenda_cronograma` para cobrir o container de destaque, injeção do Hero Card e marcação inline na tabela.
- `gestor supervisao_patos/index.html` e `gestor supervisao_patos/firebase_deploy/public/index.html`: Sincronização idêntica de espelhos.
- `CHANGELOG.md` e `#modalChangelog`: Registro sequencial da correção e melhoria de UX.

---

## 3. Especificação Passo a Passo de Código (Snippets Exatos)

### Passo 1: Inserir `#nextScheduleHighlightContainer` em `index.html`

**Localização:** Em `index.html`, dentro de `<section id="screenSchedule" class="app-screen">`, logo após o fechamento da div `.schedule-header-row` (aproximadamente linha 572) e antes de `<div class="card">`:

```html
<<<< TARGET (index.html ~L567-575)
    <section id="screenSchedule" class="app-screen">
      <div class="page-title-row schedule-header-row">
        <div class="page-title">Cronograma de Acompanhamento</div>
        <button class="btn btn-primary btn-add-schedule" onclick="openAddScheduleModal()">
          + Agendar Nova Observação
        </button>
      </div>

      <div class="card">
==== REPLACEMENT
    <section id="screenSchedule" class="app-screen">
      <div class="page-title-row schedule-header-row">
        <div class="page-title">Cronograma de Acompanhamento</div>
        <button class="btn btn-primary btn-add-schedule" onclick="openAddScheduleModal()">
          + Agendar Nova Observação
        </button>
      </div>

      <!-- Container Dinâmico da Próxima Observação (Hero Card de Destaque Imediato) -->
      <div id="nextScheduleHighlightContainer"></div>

      <div class="card">
>>>>
```

---

### Passo 2: Adicionar as Regras de Estilo em `css/04_screens.css`

**Localização:** Em `css/04_screens.css`, logo após a seção do Cronograma (após `.schedule-archive-btn`, aproximadamente linha 849):

```css
    /* ================= DESTAQUE DA PRÓXIMA OBSERVAÇÃO (HERO CARD & BADGES) ================= */
    .next-visit-hero-card {
      background: linear-gradient(135deg, #FFFFFF 0%, #F0F7FF 100%);
      border: 1px solid #BFDBFE;
      border-left: 6px solid #2563EB;
      border-radius: 14px;
      padding: 18px 20px;
      margin-bottom: 20px;
      box-shadow: 0 4px 14px rgba(37, 99, 235, 0.08);
      position: relative;
    }
    .next-visit-hero-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      flex-wrap: wrap;
      gap: 8px;
    }
    .next-visit-title-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.8px;
      color: #1D4ED8;
      background: #DBEAFE;
      padding: 4px 10px;
      border-radius: 20px;
      text-transform: uppercase;
    }
    .next-visit-timing-badge {
      font-size: 11px;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 20px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .next-visit-timing-badge.today {
      background: #DCFCE7;
      color: #15803D;
      border: 1px solid #86EFAC;
    }
    .next-visit-timing-badge.tomorrow {
      background: #FEF3C7;
      color: #B45309;
      border: 1px solid #FDE68A;
    }
    .next-visit-timing-badge.upcoming {
      background: #EFF6FF;
      color: #1E40AF;
      border: 1px solid #BFDBFE;
    }
    .next-visit-timing-badge.overdue {
      background: #FEE2E2;
      color: #991B1B;
      border: 1px solid #FCA5A5;
    }
    .next-visit-hero-body {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 16px;
      align-items: center;
    }
    .next-visit-target-name {
      font-size: 18px;
      font-weight: 800;
      color: #0F172A;
      margin: 0 0 4px 0;
      line-height: 1.3;
    }
    .next-visit-target-sub {
      font-size: 13px;
      color: #475569;
      font-weight: 500;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
    }
    .next-visit-school-row {
      font-size: 12px;
      color: #64748B;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .next-visit-meta-card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 10px;
      padding: 10px 14px;
      text-align: right;
      min-width: 170px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    }
    .next-visit-date-highlight {
      font-size: 14px;
      font-weight: 800;
      color: #1E3A8A;
      margin-bottom: 2px;
    }
    .next-visit-weekday-label {
      font-size: 11px;
      color: #64748B;
      font-weight: 600;
    }
    .next-visit-actions-bar {
      margin-top: 14px;
      padding-top: 12px;
      border-top: 1px dashed #BFDBFE;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      flex-wrap: wrap;
    }
    .badge-next-inline {
      display: inline-block;
      font-size: 10px;
      font-weight: 800;
      background: #DBEAFE;
      color: #1E40AF;
      border: 1px solid #93C5FD;
      padding: 2px 7px;
      border-radius: 4px;
      margin-left: 6px;
      vertical-align: middle;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }
    @media (max-width: 640px) {
      .next-visit-hero-body {
        grid-template-columns: 1fr;
        gap: 12px;
      }
      .next-visit-meta-card {
        text-align: left;
        width: 100%;
        background: #F8FAFC;
      }
      .next-visit-actions-bar {
        justify-content: stretch;
      }
      .next-visit-actions-bar .btn {
        flex: 1;
      }
    }
```

---

### Passo 3: Corrigir `getActionablePendingSchedules()` em `js/core/navigation.js`

**Localização:** Em `js/core/navigation.js`, linhas 134-153:

```javascript
<<<< TARGET
    // Retorna exclusivamente observações pendentes que o usuário ativo tem permissão para iniciar/observar
    function getActionablePendingSchedules() {
      const user = getCurrentUser();
      const scopedSchedules = getScopedSchedules();
      const pending = scopedSchedules.filter(s => s.status !== 'realizado' && !s.archived);

      if (user.roleKey === 'formador') {
        // Formadora observa unicamente Coordenadoras
        return pending.filter(s => {
          const tm = (appState.teamMembers || []).find(m => m.name === s.targetName);
          return tm && tm.roleKey === 'coordenador';
        });
      } else if (user.roleKey === 'coordenador') {
        // Coordenadora observa unicamente Professoras da sua unidade
        return pending.filter(s => {
          const tm = (appState.teamMembers || []).find(m => m.name === s.targetName);
          return tm && tm.roleKey === 'professora' && s.schoolName === user.school;
        });
      }
      return [];
    }
==== REPLACEMENT
    // Retorna exclusivamente observações pendentes que o usuário ativo tem permissão para iniciar/observar
    function getActionablePendingSchedules() {
      const user = getCurrentUser();
      const scopedSchedules = getScopedSchedules();
      const pending = scopedSchedules.filter(s => {
        if (s.archived || s.status === 'realizado') return false;
        // Blindagem resiliente: se já houver observação finalizada vinculada, desconsidera
        if (typeof findObservationForSchedule === 'function') {
          const obs = findObservationForSchedule(s);
          if (obs && (obs.status === 'finalized' || obs.status === 'concluida')) return false;
        }
        return true;
      });

      if (user.roleKey === 'formador') {
        // Formadora observa unicamente Coordenadoras do seu polo
        return pending.filter(s => {
          const isCoordTarget = s.targetType === 'coordenador' || (s.className && s.className.toLowerCase().includes('coord'));
          const tm = (appState.teamMembers || []).find(m => 
            m.name === s.targetName || 
            (typeof resolveCanonicalUserName === 'function' && resolveCanonicalUserName(m.name) === resolveCanonicalUserName(s.targetName))
          );
          return isCoordTarget || (tm && tm.roleKey === 'coordenador');
        });
      } else if (user.roleKey === 'coordenador') {
        // Coordenadora observa Turmas e Docentes da sua unidade escolar (Pilar 1)
        return pending.filter(s => {
          if (s.schoolName !== user.school) return false;
          // Exclui observações de coordenação pedagógica (que cabem à formadora)
          if (s.targetType === 'coordenador' || (s.className && s.className.toLowerCase().includes('coord'))) return false;
          return true;
        });
      }
      return [];
    }
>>>>
```

---

### Passo 4: Atualizar `getNextActionableSchedule()` e `renderScheduleScreen()` em `js/features/schedule.js`

**Localização:** Em `js/features/schedule.js`, atualizar `getNextActionableSchedule` para aceitar `filterBimester` opcional e garantir sintonia com o filtro visual:

```javascript
<<<< TARGET (js/features/schedule.js ~L35-62)
    function getNextActionableSchedule() {
      const user = getCurrentUser();
      let candidates = [];
      
      if (typeof getActionablePendingSchedules === 'function') {
        candidates = getActionablePendingSchedules();
      }
      
      if (!candidates || candidates.length === 0) {
        const scoped = typeof getScopedSchedules === 'function' ? getScopedSchedules() : [];
        candidates = scoped.filter(s => s.status !== 'realizado' && !s.archived);
      }

      if (!candidates || candidates.length === 0) return null;

      const todayStr = getTodayDateString();

      const sorted = [...candidates].sort((a, b) => {
        const dtA = (a.plannedDate || '9999-99-99') + ' ' + (a.plannedTime || '00:00');
        const dtB = (b.plannedDate || '9999-99-99') + ' ' + (b.plannedTime || '00:00');
        return dtA.localeCompare(dtB);
      });

      const upcoming = sorted.filter(s => (s.plannedDate || '') >= todayStr);
      if (upcoming.length > 0) return upcoming[0];

      return sorted[0];
    }
==== REPLACEMENT
    function getNextActionableSchedule(filterBimester) {
      const user = getCurrentUser();
      let candidates = [];
      
      if (typeof getActionablePendingSchedules === 'function') {
        candidates = getActionablePendingSchedules();
      }
      
      if (!candidates || candidates.length === 0) {
        const scoped = typeof getScopedSchedules === 'function' ? getScopedSchedules() : [];
        candidates = scoped.filter(s => {
          if (s.archived || s.status === 'realizado') return false;
          if (typeof findObservationForSchedule === 'function') {
            const obs = findObservationForSchedule(s);
            if (obs && (obs.status === 'finalized' || obs.status === 'concluida')) return false;
          }
          return true;
        });
      }

      // Aplica filtro contextual de bimestre caso especificado
      if (filterBimester && filterBimester !== 'ALL') {
        candidates = candidates.filter(s => s.bimester === filterBimester);
      }

      if (!candidates || candidates.length === 0) return null;

      const todayStr = getTodayDateString();

      const sorted = [...candidates].sort((a, b) => {
        const dtA = (a.plannedDate || '9999-99-99') + ' ' + (a.plannedTime || '00:00');
        const dtB = (b.plannedDate || '9999-99-99') + ' ' + (b.plannedTime || '00:00');
        return dtA.localeCompare(dtB);
      });

      const upcoming = sorted.filter(s => (s.plannedDate || '') >= todayStr);
      if (upcoming.length > 0) return upcoming[0];

      return sorted[0];
    }
>>>>
```

E em `renderScheduleScreen()` (linha 138 de `js/features/schedule.js`):
```javascript
<<<< TARGET
      // 1. Identificação e Renderização do Card de Próxima Observação
      const nextVisit = getNextActionableSchedule();
==== REPLACEMENT
      // 1. Identificação e Renderização do Card de Próxima Observação (em sintonia com o filtro de bimestre)
      const nextVisit = getNextActionableSchedule(filterBim);
>>>>
```

Também aprimorar o destaque da linha da tabela desktop:
```javascript
<<<< TARGET (js/features/schedule.js ~L443-445)
          const tr = document.createElement('tr');
          if (isThisNextVisit) tr.style.backgroundColor = '#F0FDF4';
==== REPLACEMENT
          const tr = document.createElement('tr');
          if (isThisNextVisit) {
            tr.style.backgroundColor = '#F0FDF4';
            tr.style.boxShadow = 'inset 4px 0 0 #2563EB';
          }
>>>>
```

---

## 4. Critérios de Aceite e Roteiro de Teste

1. **Visibilidade Imediata do Hero Card:**
   - Ao acessar o Cronograma de Acompanhamento como Coordenadora (`mariana`), havendo observações pendentes, o card destacado superior ("PRÓXIMA OBSERVAÇÃO") é exibido com:
     - Badge temporal dinâmico (`HOJE`, `AMANHÃ`, `EM X DIAS` ou `EM ATRASO`);
     - Nome da Turma em negrito e subtítulo com a equipe regente titular;
     - Nome da escola e identificação do bimestre;
     - Botões operacionais contextuais (`Editar Agendamento` e `Iniciar Observação →`).

2. **Destaque Visual Consistente na Tabela e Mobile Cards:**
   - A linha da tabela correspondente à próxima observação recebe fundo verde suave (`#F0FDF4`), borda esquerda azul indicativa (`inset 4px 0 0 #2563EB`) e o selo `<span class="badge-next-inline">Próxima</span>`.
   - Nos cards móveis, o card correspondente exibe contorno azul reforçado, sombra sutil e a tag `Próxima`.

3. **Concordância com Filtros de Bimestre e Status:**
   - Ao alternar o filtro de bimestre para "2º Bimestre", se houver agendamentos para o 2º Bimestre, a próxima observação correspondente é identificada e destacada de forma alinhada.
   - Ao selecionar "Observações Arquivadas", o container de destaque se oculta suavemente (`innerHTML = ''`), priorizando a análise do arquivo histórico.

4. **Sincronismo com a Home e Ação Rápida:**
   - Na Tela Inicial (`#homeScheduledSection`), a lista de agendamentos pendentes da Coordenadora passa a renderizar corretamente as observações de turmas planejadas, com botões de disparo direto de 1 toque.

---

## 5. Seção Obrigatória de Auditoria (`audit_platform.py` / `js/audit/audit_engine.js`)

### Alterações, Inclusões e Exclusões na Suíte de Auditoria:
No arquivo `js/audit/audit_engine.js`, dentro do módulo 8 (`agenda_cronograma`):

1. **Adicionar asserção de existência do container DOM:**
   ```javascript
   const highlightContainer = document.getElementById('nextScheduleHighlightContainer');
   if (!highlightContainer) {
     throw new Error('Elemento obrigatório #nextScheduleHighlightContainer não foi localizado em screenSchedule');
   }
   logger.log('Presença estrutural do container de destaque #nextScheduleHighlightContainer no DOM', true);
   ```

2. **Adicionar asserção de renderização do Hero Card de próxima observação:**
   ```javascript
   renderScheduleScreen();
   const heroCard = highlightContainer.querySelector('.next-visit-hero-card');
   if (!heroCard) {
     throw new Error('O Hero Card de próxima observação (.next-visit-hero-card) não foi renderizado em #nextScheduleHighlightContainer');
   }
   const heroTimingBadge = highlightContainer.querySelector('.next-visit-timing-badge');
   if (!heroTimingBadge) {
     throw new Error('Badge de urgência temporal (.next-visit-timing-badge) ausente no Hero Card');
   }
   logger.log('Renderização com sucesso do Hero Card da Próxima Observação e badges temporais', true);
   ```

3. **Adicionar asserção de identificação inline na listagem:**
   ```javascript
   const inlineBadge = document.querySelector('.badge-next-inline');
   if (!inlineBadge) {
     throw new Error('Badge inline .badge-next-inline não foi localizado na tabela ou cards da Agenda');
   }
   logger.log('Identificação inline (.badge-next-inline) presente na linha da próxima observação', true);
   ```

4. **Execução Obrigatória Pré e Pós-Deploy:**
   - **Pré-Commit:** `python3 audit_platform.py --check-syntax` (validação sintática 100% JSC).
   - **Pós-Deploy:** `python3 audit_platform.py --silent-on-success` (auditoria headless ponta a ponta sem saída de ruído em caso de sucesso).
