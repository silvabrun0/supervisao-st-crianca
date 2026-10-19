# PLANO DE IMPLEMENTAÇÃO: DESTAQUE E SEGREGAÇÃO DA PRÓXIMA VISITA NA AGENDA

> **DIRETRIZ OBRIGATÓRIA DE EXECUÇÃO (ETAPA 2):**
> O assistente que for executar este plano deve **obrigatoriamente ler e seguir as diretrizes do arquivo `WORKFLOW.md`** localizado na raiz do projeto antes de iniciar qualquer modificação no código. Nenhuma modificação deve ser realizada sem conformidade estrita com o workflow (incluindo a preservação integral das regras existentes, verificação de integridade pós-edição com dupla checagem de leitura, backup intermediário na pasta `intermediárias/` sob o nome `aplicativo_v81_destaque_proxima_visita_agenda.html`, dupla documentação de Changelog no arquivo `CHANGELOG.md` e no modal `#modalChangelog`, sincronização idêntica entre `firebase_deploy/public/index.html` e `index.html` da raiz, e deploy final via terminal no Firebase Hosting).

---

## 1. Diagnóstico e Contexto

### 1.1 Cenário Atual
Atualmente, ao acessar a aba **Agenda** no celular (`#mobTabSchedule`) ou **Cronograma** no desktop (`#deskTabSchedule` -> `#screenSchedule`), a tela apresenta diretamente uma barra de filtros e uma listagem única de todas as visitas (em tabela no computador ou em cards verticais no smartphone).

Todas as visitas ativas — sejam elas para hoje, para a semana que vem, para o final do bimestre ou concluídas/em atraso — aparecem no mesmo bloco com peso visual idêntico. 

**Problema Identificado:**
A aplicadora de campo (Coordenadora Pedagógica avaliando professoras da escola, ou Formadora Pedagógica acompanhando coordenadoras do seu polo) precisa fazer esforço de leitura e rolagem para descobrir:
1. *Qual é a próxima visita que deve realizar?*
2. *Quando (dia da semana, data e horário) essa visita vai acontecer?*

### 1.2 Regra de Negócio e Solução Solicitada
O usuário solicitou uma melhoria direta, prática e sem complexidade desnecessária:
> *"Vamos melhorar essa agenda, faça com que seja separado a próxima visita, do restante.*  
> *Pode ser apenas um indicador simples, nada elaborado, mas só para a aplicadora bater o olho e já saber qual e quando será a próxima visita."*

### 1.3 Design da Solução
1. **Container Hero Destacado ("⭐ PRÓXIMA VISITA"):**
   - Inserido no topo da tela da Agenda (`#screenSchedule`), imediatamente abaixo do título e do botão de agendamento, antes do card de filtros e listagem geral.
   - Fundo com gradiente suave azul/branco, borda de destaque e sombra limpa.
   - Apresenta com destaque imediato:
     - **Pílula de Alerta Temporal:** `● HOJE`, `⚡ AMANHÃ`, `🗓️ EM X DIAS` ou `⚠️ EM ATRASO`.
     - **Nome do(a) Profissional:** Tipografia ampliada e em negrito.
     - **Turma / Função e Unidade Escolar:** Informação imediata de local e público-alvo.
     - **Data, Dia da Semana e Horário:** Ex: `🗓️ Quinta-feira, 15/10/2026 às 08:30 · 4º Bimestre`.
     - **Botões de Ação Imediata:** Botão de destaque `Iniciar Visita →` (1 clique para abrir o instrumento) e botão de edição `Editar`.
2. **Segregação do Bloco das Demais Visitas:**
   - O bloco inferior passa a ter o título contextualizado: `Demais Visitas do Cronograma` (ou `Cronograma Geral de Visitas`).
   - Se o filtro de status for alterado para "Visitas Arquivadas", o destaque da próxima visita oculta-se harmoniosamente para priorizar o histórico.
3. **Indicador Visual na Tabela e nos Cards:**
   - Na listagem geral (tabela desktop ou cards mobile), a visita identificada como a próxima recebe um selo discreto `<span class="badge-next-inline">⭐ Próxima</span>`, facilitando o reconhecimento em qualquer modo de visualização.
4. **Resiliência e Identificação da Próxima Visita:**
   - Prioriza visitas ativas pendentes (`status !== 'realizado' && !s.archived`) sob competência da usuária ativa (`getActionablePendingSchedules()` ou `getScopedSchedules()`).
   - Busca em ordem cronológica de data e horário a visita para hoje ou a mais próxima no futuro (`plannedDate >= todayStr`). Caso não haja visitas futuras mas existam visitas pendentes em atraso, exibe a mais recente atrasada com badge `⚠️ EM ATRASO`.

---

## 2. Arquitetura e Pontos de Impacto

### Arquivos Afetados:
- `gestor supervisao_patos/firebase_deploy/public/index.html` (Arquivo principal de produção)
- `gestor supervisao_patos/CHANGELOG.md` (Sumário e histórico detalhado)
- `gestor supervisao_patos/intermediárias/aplicativo_v81_destaque_proxima_visita_agenda.html` (Backup obrigatório)
- `gestor supervisao_patos/index.html` (Espelho sincronizado)
- `index.html` (Espelho sincronizado na raiz)

### Componentes Afetados no HTML / CSS / JS:
1. **CSS (Estilos da Próxima Visita e Tags):**
   - `.next-visit-hero-card`: Card com fundo linear suave, borda esquerda `5px solid #2563EB`, cantos arredondados `14px`, padding responsivo.
   - `.next-visit-header`: Cabeçalho flexível com título `⭐ PRÓXIMA VISITA` e badge de contagem de dias/urgência.
   - `.next-visit-badge-tag`: Tags temáticas (`.today`, `.tomorrow`, `.upcoming`, `.overdue`).
   - `.next-visit-meta-box`: Caixa com data legível por extenso (incluindo dia da semana).
   - `.badge-next-inline`: Badge compacto para exibição na tabela e cards móveis.
2. **HTML em `#screenSchedule`:**
   - Inclusão do container dinâmico `<div id="nextScheduleHighlightContainer"></div>` logo acima do card da toolbar de filtros.
   - Ajuste do título da toolbar de filtros de `Visitas Planejadas e Realizadas` para `Demais Visitas do Cronograma`.
3. **JS em `renderScheduleScreen()` e Funções Auxiliares:**
   - Criação da função auxiliar `getDayOfWeekName(dateStr)` e `getVisitTimingBadge(dateStr)`.
   - Criação da função de resolução `getNextActionableSchedule()`.
   - Atualização de `renderScheduleScreen()` para popular `#nextScheduleHighlightContainer` e injetar a tag `⭐ Próxima` na tabela desktop e nos cards mobile.
4. **Governança de Versão:**
   - Elevação para **Versão 0.81 (v7.60)**.
   - Atualização do botão `.btn-changelog` no header.
   - Inserção do card no modal `#modalChangelog`.
   - Atualização completa do `CHANGELOG.md`.

---

## 3. Especificação Passo a Passo de Código

### 3.1 Estilos CSS em `firebase_deploy/public/index.html`

**Localização:** Inserir antes da media query `@media (max-width: 768px)` (por volta da linha 1438).

```css
    /* --- DESTAQUE DA PRÓXIMA VISITA (HERO CARD NA AGENDA) --- */
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
      padding: 1px 6px;
      border-radius: 4px;
      margin-left: 6px;
      vertical-align: middle;
      text-transform: uppercase;
      letter-spacing: 0.3px;
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

### 3.2 Estrutura HTML em `#screenSchedule`

**Localização:** Linhas 2715 a 2730 em `firebase_deploy/public/index.html`.

**Substituição:**
```html
    <!-- ================= SCREEN 2: CRONOGRAMA LONGITUDINAL ================= -->
    <section id="screenSchedule" class="app-screen">
      <div class="page-title-row schedule-header-row">
        <div class="page-title">Cronograma de Acompanhamento</div>
        <button class="btn btn-primary btn-add-schedule" onclick="openAddScheduleModal()">
          + Agendar Nova Visita
        </button>
      </div>

      <!-- Container Dinâmico da Próxima Visita (Destaque Imediato) -->
      <div id="nextScheduleHighlightContainer"></div>

      <div class="card">
        <div class="schedule-filters-toolbar">
          <div class="schedule-filters-title">Demais Visitas do Cronograma</div>
          <div class="schedule-filters-controls">
            <div class="schedule-filters-selects">
              <select id="scheduleFilterBimester" class="form-select schedule-filter-select" onchange="renderScheduleScreen()">
                <option value="ALL">Todos os Bimestres</option>
                <option value="1º Bimestre">1º Bimestre</option>
                <option value="2º Bimestre">2º Bimestre</option>
                <option value="3º Bimestre">3º Bimestre</option>
                <option value="4º Bimestre">4º Bimestre</option>
              </select>
              <select id="scheduleFilterStatus" class="form-select schedule-filter-select" onchange="renderScheduleScreen()">
                <option value="active">Visitas Ativas</option>
                <option value="archived">Visitas Arquivadas</option>
                <option value="all">Todas as Visitas</option>
              </select>
            </div>
            <button class="btn btn-secondary schedule-archive-btn" onclick="archiveAllCompletedSchedules()" title="Arquivar todas as visitas já realizadas deste escopo">
              Arquivar Realizadas
            </button>
          </div>
        </div>
```

---

### 3.3 Funções JavaScript Auxiliares e Lógica da Próxima Visita

**Localização:** Imediatamente antes de `renderScheduleScreen()` (por volta da linha 9054).

```javascript
    // --- Funções Auxiliares de Datas para a Agenda ---
    function getDayOfWeekName(dateStr) {
      if (!dateStr) return '';
      const parts = dateStr.split('-');
      if (parts.length !== 3) return '';
      const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
      return days[d.getDay()] || '';
    }

    function getVisitTimingBadgeHtml(dateStr) {
      const todayStr = getTodayDateString();
      if (!dateStr) return '';
      if (dateStr === todayStr) {
        return `<span class="next-visit-timing-badge today">● HOJE</span>`;
      }
      const partsT = todayStr.split('-').map(Number);
      const partsD = dateStr.split('-').map(Number);
      const dtToday = new Date(partsT[0], partsT[1] - 1, partsT[2]);
      const dtVisit = new Date(partsD[0], partsD[1] - 1, partsD[2]);
      const diffDays = Math.round((dtVisit - dtToday) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        return `<span class="next-visit-timing-badge tomorrow">⚡ AMANHÃ</span>`;
      } else if (diffDays > 1) {
        return `<span class="next-visit-timing-badge upcoming">🗓️ EM ${diffDays} DIAS</span>`;
      } else {
        return `<span class="next-visit-timing-badge overdue">⚠️ EM ATRASO</span>`;
      }
    }

    function getNextActionableSchedule() {
      const user = getCurrentUser();
      let candidates = [];
      
      if (typeof getActionablePendingSchedules === 'function') {
        candidates = getActionablePendingSchedules();
      }
      
      // Fallback para perfis gerais
      if (!candidates || candidates.length === 0) {
        const scoped = typeof getScopedSchedules === 'function' ? getScopedSchedules() : [];
        candidates = scoped.filter(s => s.status !== 'realizado' && !s.archived);
      }

      if (!candidates || candidates.length === 0) return null;

      const todayStr = getTodayDateString();

      // Ordena por data e hora cronológica
      const sorted = [...candidates].sort((a, b) => {
        const dtA = (a.plannedDate || '9999-99-99') + ' ' + (a.plannedTime || '00:00');
        const dtB = (b.plannedDate || '9999-99-99') + ' ' + (b.plannedTime || '00:00');
        return dtA.localeCompare(dtB);
      });

      // Prioriza a primeira visita a partir de hoje (hoje ou futura)
      const upcoming = sorted.filter(s => (s.plannedDate || '') >= todayStr);
      if (upcoming.length > 0) return upcoming[0];

      // Se todas forem anteriores a hoje, retorna a primeira em atraso para regularização
      return sorted[0];
    }
```

---

### 3.4 Refatoração de `renderScheduleScreen()`

**Localização:** Linhas 9054 a 9256 em `firebase_deploy/public/index.html`.

**Novo Código:**
```javascript
    function renderScheduleScreen() {
      const user = getCurrentUser();
      const tbody = document.getElementById('scheduleTableBody');
      const cardsContainer = document.getElementById('scheduleCardsContainer');
      const highlightContainer = document.getElementById('nextScheduleHighlightContainer');
      const filterBim = document.getElementById('scheduleFilterBimester') ? document.getElementById('scheduleFilterBimester').value : 'ALL';
      const filterStatus = document.getElementById('scheduleFilterStatus') ? document.getElementById('scheduleFilterStatus').value : 'active';
      
      if (tbody) tbody.innerHTML = '';
      if (cardsContainer) cardsContainer.innerHTML = '';

      // 1. Identificação e Renderização do Card de Próxima Visita
      const nextVisit = getNextActionableSchedule();

      if (highlightContainer) {
        if (nextVisit && filterStatus !== 'archived') {
          const timingBadge = getVisitTimingBadgeHtml(nextVisit.plannedDate);
          const weekday = getDayOfWeekName(nextVisit.plannedDate);
          const formattedDate = typeof formatDateBR === 'function' ? formatDateBR(nextVisit.plannedDate) : nextVisit.plannedDate;
          
          const targetMember = (appState.teamMembers || []).find(m => m.name === nextVisit.targetName || resolveCanonicalUserName(m.name) === resolveCanonicalUserName(nextVisit.targetName));
          const isTargetTeacher = targetMember ? (targetMember.roleKey === 'professora') : true;

          const canStartVisit = (user.roleKey === 'coordenador' && isTargetTeacher && nextVisit.schoolName === user.school) ||
                                (user.roleKey === 'formador' && !isTargetTeacher);

          const canEditSchedule = (user.roleKey === 'coordenador' && isTargetTeacher && nextVisit.schoolName === user.school) ||
                                  (user.roleKey === 'formador' && !isTargetTeacher) ||
                                  (user.roleKey === 'tecnico');

          highlightContainer.innerHTML = `
            <div class="next-visit-hero-card">
              <div class="next-visit-hero-header">
                <div class="next-visit-title-badge">
                  ⭐ PRÓXIMA VISITA
                </div>
                <div>${timingBadge}</div>
              </div>

              <div class="next-visit-hero-body">
                <div>
                  <h3 class="next-visit-target-name">${nextVisit.targetName}</h3>
                  <div class="next-visit-target-sub">
                    <span style="font-weight:700; color:var(--primary);">${nextVisit.className || 'Coordenação Pedagógica'}</span>
                    <span>·</span>
                    <span class="schedule-bimester-tag">${nextVisit.bimester}</span>
                  </div>
                  <div class="next-visit-school-row">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M3 7v14M21 7v14M6 7l6-4 6 4M10 11v2M14 11v2M10 16v2M14 16v2"/></svg>
                    <span>${nextVisit.schoolName}</span>
                  </div>
                </div>

                <div class="next-visit-meta-card">
                  <div class="next-visit-date-highlight">${formattedDate} às ${nextVisit.plannedTime || '08:00'}</div>
                  <div class="next-visit-weekday-label">${weekday || 'Data planejada'}</div>
                </div>
              </div>

              <div class="next-visit-actions-bar">
                ${canEditSchedule ? `
                  <button class="btn btn-secondary" style="padding:8px 14px; font-size:12px;" onclick="openEditScheduleModal('${nextVisit.id}')">
                    Editar Agendamento
                  </button>
                ` : ''}
                ${canStartVisit ? `
                  <button class="btn btn-primary" style="padding:8px 18px; font-size:13px; font-weight:700;" onclick="openSetupScreenFromSchedule('${nextVisit.id}')">
                    Iniciar Visita →
                  </button>
                ` : ''}
              </div>
            </div>
          `;
        } else {
          highlightContainer.innerHTML = '';
        }
      }

      // 2. Filtragem e Ordenação da Listagem Geral
      let schedules = getScopedSchedules();
      if (filterBim !== 'ALL') {
        schedules = schedules.filter(s => s.bimester === filterBim);
      }

      if (filterStatus === 'active') {
        schedules = schedules.filter(s => !s.archived);
      } else if (filterStatus === 'archived') {
        schedules = schedules.filter(s => s.archived === true);
      }

      // Ordenação cronológica por data e hora
      schedules.sort((a, b) => {
        const dtA = (a.plannedDate || '9999-99-99') + ' ' + (a.plannedTime || '00:00');
        const dtB = (b.plannedDate || '9999-99-99') + ' ' + (b.plannedTime || '00:00');
        return dtA.localeCompare(dtB);
      });

      if (schedules.length === 0) {
        if (tbody) {
          tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:var(--text-secondary); padding:24px;">Nenhuma visita encontrada para os filtros selecionados.</td></tr>`;
        }
        if (cardsContainer) {
          cardsContainer.innerHTML = `
            <div class="schedule-empty-state">
              <div style="font-size:14px; font-weight:700; color:var(--text-primary);">Nenhuma visita encontrada</div>
              <div style="font-size:12px; color:var(--text-secondary); margin-top:4px;">Ajuste os filtros de bimestre ou status para visualizar os agendamentos.</div>
            </div>`;
        }
        return;
      }

      schedules.forEach(s => {
        const isThisNextVisit = nextVisit && s.id === nextVisit.id && !s.archived && s.status !== 'realizado';
        let badgeClass = 'planned';
        let badgeText = 'Planejada';
        let borderClass = 'status-border-planned';

        if (s.archived) {
          badgeClass = 'archived';
          badgeText = 'Arquivada';
          borderClass = 'status-border-archived';
        } else if (s.status === 'realizado') {
          badgeClass = 'concluded';
          badgeText = 'Realizada';
          borderClass = 'status-border-concluded';
        } else if (s.status === 'atrasado') {
          badgeClass = 'delayed';
          badgeText = 'Em Atraso';
          borderClass = 'status-border-delayed';
        }

        let actionHtml = '';
        let cardActionHtml = '';

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
          const targetMember = (appState.teamMembers || []).find(m => m.name === s.targetName || resolveCanonicalUserName(m.name) === resolveCanonicalUserName(s.targetName));
          const isTargetTeacher = targetMember ? (targetMember.roleKey === 'professora') : true;

          const canStartVisit = (user.roleKey === 'coordenador' && isTargetTeacher && s.schoolName === user.school) ||
                                (user.roleKey === 'formador' && !isTargetTeacher);

          const canEditSchedule = (user.roleKey === 'coordenador' && isTargetTeacher && s.schoolName === user.school) ||
                                  (user.roleKey === 'formador' && !isTargetTeacher) ||
                                  (user.roleKey === 'tecnico');

          if (canStartVisit) {
            actionHtml = `
              <div style="display:flex; gap:6px; justify-content:center; align-items:center;">
                <button class="btn btn-primary" style="padding:5px 10px; font-size:11px;" onclick="openSetupScreenFromSchedule('${s.id}')">
                  Iniciar Visita →
                </button>
                ${canEditSchedule ? `
                  <button class="btn btn-secondary" style="padding:5px 10px; font-size:11px;" onclick="openEditScheduleModal('${s.id}')" title="Editar Agendamento">
                    Editar
                  </button>
                ` : ''}
              </div>
            `;
            cardActionHtml = `
              ${canEditSchedule ? `
                <button class="btn btn-secondary" style="padding:8px 12px; font-size:12px; flex:1;" onclick="openEditScheduleModal('${s.id}')">
                  Editar
                </button>
              ` : ''}
              <button class="btn btn-primary" style="padding:8px 14px; font-size:12px; font-weight:700; flex:1.4;" onclick="openSetupScreenFromSchedule('${s.id}')">
                Iniciar Visita →
              </button>
            `;
          } else {
            actionHtml = `
              <div style="display:flex; gap:6px; justify-content:center; align-items:center;">
                <span style="font-size:11px; color:var(--text-secondary); font-style:italic;" title="Observação de competência da coordenação local">Acompanhamento</span>
                ${canEditSchedule ? `
                  <button class="btn btn-secondary" style="padding:5px 10px; font-size:11px;" onclick="openEditScheduleModal('${s.id}')" title="Editar Agendamento">
                    Editar
                  </button>
                ` : ''}
              </div>
            `;
            cardActionHtml = `
              <span style="font-size:11px; color:var(--text-secondary); font-style:italic; margin-right:auto;">Acompanhamento pedagógico em cascata</span>
              ${canEditSchedule ? `
                <button class="btn btn-secondary" style="padding:7px 12px; font-size:12px;" onclick="openEditScheduleModal('${s.id}')">
                  Editar
                </button>
              ` : ''}
            `;
          }
        }

        const nextTagHtml = isThisNextVisit ? `<span class="badge-next-inline">⭐ Próxima</span>` : '';

        // 1. Tabela Desktop
        if (tbody) {
          const tr = document.createElement('tr');
          if (isThisNextVisit) tr.style.backgroundColor = '#F0FDF4';
          tr.innerHTML = `
            <td>
              <strong>${s.targetName}</strong> ${nextTagHtml}<br>
              <span style="font-size:11px; color:var(--text-secondary);">${s.className}</span>
            </td>
            <td>${s.schoolName}</td>
            <td><span style="font-weight:700; color:var(--primary);">${s.bimester}</span></td>
            <td>${formatDateBR(s.plannedDate)}</td>
            <td>${s.plannedTime}</td>
            <td><span class="status-badge ${badgeClass}">${badgeText}</span></td>
            <td style="text-align:center;">
              ${actionHtml}
            </td>
          `;
          tbody.appendChild(tr);
        }

        // 2. Cards Mobile
        if (cardsContainer) {
          const card = document.createElement('div');
          card.className = `schedule-mobile-card ${borderClass}`;
          if (isThisNextVisit) {
            card.style.border = '2px solid #3B82F6';
            card.style.boxShadow = '0 3px 10px rgba(59, 130, 246, 0.15)';
          }
          const formattedDate = typeof formatDateBR === 'function' ? formatDateBR(s.plannedDate) : s.plannedDate;

          card.innerHTML = `
            <div class="schedule-card-header">
              <div>
                <div class="schedule-card-target">
                  ${s.targetName}
                  ${nextTagHtml}
                </div>
                <div class="schedule-card-class">${s.className || 'Sem turma especificada'}</div>
              </div>
              <span class="status-badge ${badgeClass}" style="flex-shrink:0;">${badgeText}</span>
            </div>

            <div class="schedule-card-meta">
              <div class="schedule-card-meta-row">
                <span class="schedule-meta-label">Escola:</span>
                <span class="schedule-meta-val">${s.schoolName}</span>
              </div>
              <div class="schedule-card-meta-row" style="justify-content:space-between; flex-wrap:wrap; gap:6px;">
                <div style="display:flex; align-items:center; gap:6px;">
                  <span class="schedule-meta-label">Data:</span>
                  <span class="schedule-meta-val">${formattedDate} às ${s.plannedTime || '08:00'}</span>
                </div>
                <span class="schedule-bimester-tag">
                  ${s.bimester}
                </span>
              </div>
            </div>

            <div class="schedule-card-actions">
              ${cardActionHtml}
            </div>
          `;
          cardsContainer.appendChild(card);
        }
      });
    }
```

---

## 4. Governança de Versão

### 4.1 Identificador Oficial da Versão
- **Versão:** `0.81`
- **Subversão / Identificador no App:** `📌 Versão 0.81 (v7.60)`
- **Data/Hora:** `15 de Outubro de 2026`

### 4.2 Alterações em `index.html`:
1. Atualizar o texto do botão de versão na barra superior para:
   ```html
   📌 Versão 0.81 (v7.60)
   ```
2. Adicionar o card da Versão 0.81 no topo da lista dentro do `#modalChangelog`:
   ```html
   <div class="changelog-version-card">
     <div class="changelog-version-header">
       <div class="changelog-badge-primary">Versão 0.81 (v7.60)</div>
       <div class="changelog-date">15/10/2026</div>
     </div>
     <div class="changelog-summary-text">
       <strong>Destaque e Segregação da Próxima Visita na Agenda:</strong>
       <ul style="margin: 6px 0 0 16px; padding: 0; line-height: 1.5;">
         <li><strong>Card Hero da Próxima Visita:</strong> Destaque visual isolado no topo da Agenda com dia da semana, contagem/urgência temporal (Hoje, Amanhã, Em X dias) e atalho de 1 clique para iniciar.</li>
         <li><strong>Segregação das Demais Visitas:</strong> Reorganização da tela dividindo a próxima visita imediata do restante do cronograma.</li>
         <li><strong>Identificador Inline:</strong> Selo <code>⭐ Próxima</code> destacado nas linhas da tabela desktop e nos cards móveis.</li>
         <li><strong>Ordenação Cronológica:</strong> Listagem garantida por ordem cronológica crescente de data e horário.</li>
       </ul>
     </div>
   </div>
   ```

### 4.3 Atualização de `CHANGELOG.md`:
1. Inserir linha na tabela do *Sumário Executivo de Versões*:
   `| **0.81** | 15/10/2026 17:15 | 'firebase_deploy/public/index.html' | Solicitação direta | Destaque e segregação visual da próxima visita na Agenda com identificador rápido e card hero✅ |`
2. Criar a seção correspondente `### [Versão 0.81] - Destaque e Segregação da Próxima Visita na Agenda`.

---

## 5. Critérios de Aceite e Roteiro de Teste

### Roteiro de Teste (Validação Obrigatória):
1. **Visualização Inicial (Mariana - Coordenadora):**
   - Abrir o app logado como Mariana.
   - Acessar a aba "Agenda" (mobile) ou "Cronograma" (desktop).
   - **Resultado Esperado:** No topo, exibição imediata do card hero "⭐ PRÓXIMA VISITA" apontando para `Ana Carolina Silva`, `Infantil I`, `CEI Professora Maria de Lourdes`, com a tag `● HOJE` e data/horário formatados.
2. **Ação Direta de Iniciar Visita:**
   - Clicar no botão `Iniciar Visita →` no card hero da próxima visita.
   - **Resultado Esperado:** O instrumento de observação é aberto já com os dados pré-carregados da visita.
3. **Conclusão e Avanço Dinâmico:**
   - Realizar ou finalizar a visita.
   - Retornar à Agenda.
   - **Resultado Esperado:** O card de Próxima Visita avança automaticamente para a próxima visita pendente (`Carla Beatriz Mendes`), com a respectiva contagem de dias (`🗓️ EM 3 DIAS`).
4. **Filtro de Arquivadas:**
   - No seletor de status, mudar para "Visitas Arquivadas".
   - **Resultado Esperado:** O card hero de próxima visita é ocultado, exibindo apenas as visitas arquivadas.
5. **Responsividade Mobile:**
   - Reduzir a largura da tela para smartphone (≤ 640px).
   - **Resultado Esperado:** O card da próxima visita e os botões se ajustam fluidamente à largura total, sem estouro horizontal ou rolagem lateral.
6. **Deploy no Firebase:**
   - Executar `firebase.cmd deploy` e confirmar que a aplicação foi publicada no Firebase Hosting com sucesso.
