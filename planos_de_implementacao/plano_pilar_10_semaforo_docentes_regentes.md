# PLANO DE IMPLEMENTAÇÃO: SEMÁFORO DO CICLO ANUAL PARA DOCENTES REGENTES (PILAR 10)

> **DIRETRIZ DE EXECUÇÃO OBRIGATÓRIA (LEITURA MANDATÓRIA):**
> O assistente executor (Etapa 2 - "O Operário") deve **obrigatoriamente ler e seguir as diretrizes do arquivo [WORKFLOW_MACOS.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md)** antes de realizar qualquer alteração nos arquivos de produção. A execução deve ser estrita, literal e fiel às seções deste plano, sem refatorações não solicitadas, com verificação de concorrência Git no início e no final, backup intermediário em `intermediárias/` e execução do algoritmo de auditoria pós-deploy (`python3 audit_platform.py --silent-on-success`) comunicando **exclusivamente eventuais problemas**.

---

## 1. Diagnóstico e Contexto

### 1.1 Cenário Atual
No **Quadro de Controle Bimestral (Semáforo do Ciclo Anual)** (pertencente ao Pilar 10, na Sub-aba 3 de Indicadores), foi disponibilizado um alternador de visão:
- `🏫 Turmas (N)`
- `👥 Docentes Regentes (N)`

Quando o usuário alterna para **Docentes Regentes**, depara-se com um cenário empobrecido e disfuncional:
1. **Frase Confusa e Descontextualizada:** O topo exibe apenas a frase solta: `"Fichas formativas individuais dos 3 docentes regentes titulares vinculados às turmas:"`.
2. **Desaparecimento de Elementos Decisórios:**
   - Os 4 Micro-cards de Resumo Decisório (Turmas/Docentes em Atraso, Pendentes no Bimestre, Cobertos no Bimestre, Avanço do Ciclo Anual) **desaparecem por completo**, pois foram encapsulados exclusivamente no bloco `if (viewMode === 'classes')`.
   - A Barra de Filtros Rápidos de Status (🔴 Atrasadas, ⚪ No Prazo, 🟢 Concluídas, 🏆 Ciclo 100%) **também desaparece**.
3. **Células "Em Branco" (Travessões `—` generalizados):**
   - **Causa Raiz A (Esterilização por Filtro de Bimestre):** No início da função `renderIndicatorsScreen()`, a coleção `scopedObs` é filtrada pelo bimestre selecionado na barra de filtros global (`activeBimesterFilter`). Se o usuário tiver um bimestre selecionado (ex: "1º Bimestre"), todas as observações dos 2º, 3º e 4º bimestres são expurgadas da memória local da função. Ao tentar renderizar as colunas dos outros bimestres, a busca falha e imprime `—`.
   - **Causa Raiz B (Ausência de Motor Temporal Semafórico Docente):** Para as turmas, existe a função `calculateClassBimesterStatus`, que busca nas observações globais (`appState.observations`) e calcula deterministamente se a turma está `completed` (🟢), `in_progress` (⚪ no prazo), `overdue` (🔴 atrasada) ou `future` (○ prevista). Para os docentes, **não existia nenhum motor semafórico**: o código apenas checava se havia nota calculada e, na ausência dela, despejava um mero `—`, sem semáforo, sem cálculo de prazos e sem indicar se o docente estava pendente ou em atraso.
   - **Causa Raiz C (Desconexão da Lógica Turma-Docente):** Como a observação na Educação Infantil é centrada na **TURMA** (Pilares 1, 4 e 15), as observações registram turmas e elencos de regência (`o.className`, `o.teachers`, `o.teacherSynthesis`). A busca restrita por `o.teacherName === member.name` ignorava os vínculos do docente às suas turmas cadastradas no catálogo canônico (`appState.classes`) ou em `member.classAssigned`.

---

### 1.2 Resultado Esperado (O que DEVERIA TER na visão de Docentes Regentes)
A visão de **Docentes Regentes** do Semáforo (Pilar 10) deve fornecer a mesma profundidade, ergonomia visual e instrumentalização para a tomada de decisão da equipe pedagógica que a visão de turmas:
1. **Subtítulo Claro e Explicativo:** Esclarecer que a matriz acompanha o cumprimento das 4 observações anuais obrigatórias sob a perspectiva dos **Docentes Regentes Titulares** vinculados às turmas.
2. **4 Micro-cards de Resumo Decisório para Docentes:**
   - ⚠ **Docentes em Atraso:** Quantos docentes possuem observações pendentes em bimestres já encerrados (requer intervenção da gestão).
   - ⏳ **Pendentes no [Bimestre]:** Quantos docentes estão aguardando observação no bimestre letivo corrente (dentro do prazo regulamentar).
   - 🟢 **Cobertos no [Bimestre]:** Total e percentual de cobertura docente no bimestre letivo corrente.
   - 🏆 **Avanço do Ciclo Anual:** Percentual global de cumprimento das metas anuais docentes (ex: 7 de 12 observações · 58%).
3. **Barra de Filtros Rápidos de Status Docente:** Filtros por chips com 1 toque: *Todos*, *🔴 Com Atraso*, *⚪ No Prazo*, *🟢 Concluídos*, *🏆 Ciclo 100%*.
4. **Motor Algorítmico Canônico `calculateTeacherBimesterStatus`:**
   - Busca no banco global de observações (`appState.observations`) sem depender da filtragem de sub-aba.
   - Vincula por nome direto, array de regentes da turma (`teachers`), síntese nominal individual (`teacherSynthesis`) ou turma de lotação do docente.
   - Retorna os 4 status semafóricos canônicos:
     * 🟢 **Verde (`completed`):** Observação concluída com nota de consistência pedagógica e data.
     * ⚪ **Azul/Cinza (`in_progress`):** No prazo regulamentar no bimestre corrente, rascunho em aberto ou visita já agendada no cronograma.
     * 🔴 **Vermelho (`overdue`):** Bimestre encerrado sem observação na turma do docente.
     * ○ **Cinza (`future`):** Bimestre futuro do ciclo anual.
5. **Tabela Matricial Semafórica de Docentes (Desktop) e Cards Mobile:**
   - Pílulas semafóricas idênticas às de turmas (`sem-status-pill`), com pontuação, ícone e label.
   - Barra de progresso visual do ciclo anual individual (ex: 2 de 4 · 50%).
   - Botão **📅 Agendar Turma**: Com 1 clique, abre o modal de agendamento já pré-selecionando a escola, a turma de atuação do docente e o próximo bimestre elegível.
   - Botão **🔍 Raio-X**: Acesso instantâneo ao Dossiê Longitudinal / Raio-X Item a Item do docente.
6. **Interatividade na Célula Semafórica (`handleTeacherSemaphoreCellClick`):**
   - Clicar na pílula verde redireciona à observação concluída no Histórico.
   - Clicar na pílula de rascunho abre a observação para continuar.
   - Clicar na pílula de atrasada/no prazo abre o agendamento rápido da turma do docente.

---

## 2. Arquitetura e Pontos de Impacto

| Componente / Função | Localização Aproximada | Natureza da Alteração |
|---|---|---|
| **Motor Algorítmico `calculateTeacherBimesterStatus`** | `index.html` (~linha 15990) | **NOVA FUNÇÃO**: Algoritmo canônico temporal para cálculo semafórico individual do docente regente. |
| **Helper de Interação `handleTeacherSemaphoreCellClick`** | `index.html` (~linha 16120) | **NOVA FUNÇÃO**: Manipulador de clique das pílulas semafóricas de docentes regentes. |
| **Helper `getNextEligibleBimesterForTeacher`** | `index.html` (~linha 16040) | **NOVA FUNÇÃO**: Determina o primeiro bimestre pendente/atrasado do docente para agendamento rápido em 1 toque. |
| **Coleta Estatística e Filtro em `renderIndicatorsScreen`** | `index.html` (~linhas 17425 a 17475) | **MODIFICAÇÃO**: Adicionar apuração de KPIs e filtros rápidos para a coleção de docentes regentes (`scopedAvaliandos`). |
| **Renderização do Bloco de Docentes (`else` do Semáforo)** | `index.html` (~linhas 17698 a 17775) | **SUBSTITUIÇÃO COMPLETA**: Remover tabela estática legada "em branco" e renderizar micro-cards, filtros, matriz semafórica e cards mobile adaptativos para docentes. |
| **Engine de Testes do Browser (`window.runFullPlatformAudit`)** | `index.html` (~linhas 20586 a 20630) | **ATUALIZAÇÃO DE TESTES**: Adicionar asserções estritas no Módulo 10 cobrindo `calculateTeacherBimesterStatus`, pílulas e filtros de docentes. |
| **Catálogo de Módulos da Auditoria** | `audit_platform.py` (~linha 32) | **ATUALIZAÇÃO**: Refletir cobertura do Semáforo Docente do Pilar 10 no Módulo 10. |
| **Gestão Dupla de Changelog** | `CHANGELOG.md` e `#modalChangelog` em `index.html` | **ATUALIZAÇÃO OBRIGATÓRIA**: Registrar a versão `1.09`. |

---

## 3. Especificação de Implementação Passo a Passo

### PASSO 1: Inclusão do Motor Algorítmico do Docente Regente em `index.html`

Localizar no `index.html` a função `calculateClassBimesterStatus` (~linha 15894) e inserir, logo após o seu fechamento e dos helpers de agendamento de turma, as funções `calculateTeacherBimesterStatus` e `getNextEligibleBimesterForTeacher`:

```javascript
    /**
     * PILAR 10: Calcula o status semafórico temporal de um DOCENTE REGENTE no ciclo bimestral.
     * Considera observações diretas do professor, observações da turma onde atua e agendamentos no cronograma.
     * Retorna objeto canônico: { status, colorKey, label, score, obsId, obsDate, className, scheduleId, bimesterNum, currentBimNum }
     */
    function calculateTeacherBimesterStatus(teacherName, schoolName, bimesterName, referenceDate = new Date()) {
      if (!teacherName) return { status: 'future', colorKey: 'gray', label: '—', score: null };

      const cleanTeacher = (teacherName || '').trim().toLowerCase();
      const cleanSchool = (schoolName || '').trim().toLowerCase();

      const bimMatch = (bimesterName || '').match(/([1-4])/);
      const bimesterNum = bimMatch ? parseInt(bimMatch[1], 10) : 1;

      const currentBimStr = getCurrentSchoolBimester(referenceDate);
      const currentBimMatch = currentBimStr.match(/([1-4])/);
      const currentBimNum = currentBimMatch ? parseInt(currentBimMatch[1], 10) : 1;

      // Localiza o membro na equipe para obter turma vinculada
      const member = (appState.teamMembers || []).find(m => (m.name || '').trim().toLowerCase() === cleanTeacher);
      const assignedClassClean = (member?.classAssigned || '').trim().toLowerCase();

      // Localiza as turmas que possuem este docente no catálogo canônico
      const teacherClassNames = (appState.classes || []).filter(c => {
        if (cleanSchool && c.school && c.school.trim().toLowerCase() !== cleanSchool) return false;
        return Array.isArray(c.teachers) && c.teachers.some(t => (t || '').trim().toLowerCase() === cleanTeacher);
      }).map(c => (c.name || '').trim().toLowerCase());

      if (assignedClassClean && !teacherClassNames.includes(assignedClassClean)) {
        teacherClassNames.push(assignedClassClean);
      }

      const defaultClassName = member?.classAssigned || (teacherClassNames.length > 0 ? teacherClassNames[0] : 'Educação Infantil');

      // 1. Busca observação finalizada correspondente ao docente neste bimestre
      const finalizedObs = (appState.observations || []).find(o => {
        if (o.status !== 'finalized' && o.status !== 'concluida') return false;
        if (cleanSchool && o.schoolName && o.schoolName.trim().toLowerCase() !== cleanSchool) return false;

        const oBimMatch = (o.bimester || '').match(/([1-4])/);
        if (!oBimMatch || parseInt(oBimMatch[1], 10) !== bimesterNum) return false;

        // Correspondência nominal direta
        if (o.teacherName && o.teacherName.trim().toLowerCase().includes(cleanTeacher)) return true;
        if (Array.isArray(o.teachers) && o.teachers.some(t => (t || '').trim().toLowerCase() === cleanTeacher)) return true;
        if (o.teacherSynthesis && Object.keys(o.teacherSynthesis).some(k => (k || '').trim().toLowerCase() === cleanTeacher)) return true;

        // Correspondência através da turma vinculada ao docente
        if (o.className) {
          const oClsClean = o.className.trim().toLowerCase();
          if (teacherClassNames.some(tCls => tCls === oClsClean || tCls.includes(oClsClean) || oClsClean.includes(tCls))) {
            return true;
          }
        }
        return false;
      });

      if (finalizedObs) {
        let pts = 0;
        let valid = 0;
        const resp = finalizedObs.responses || {};
        Object.keys(resp).forEach(k => {
          const r = resp[k];
          if (r && r !== 'na') {
            valid++;
            if (r === 'consistent') pts += 1.0;
            else if (r === 'partial') pts += 0.5;
          }
        });
        const score = valid > 0 ? Math.round((pts / valid) * 100) : 100;
        const dateStr = formatDateBR(finalizedObs.date || finalizedObs.startDate || '');
        return {
          status: 'completed',
          colorKey: 'green',
          label: dateStr ? `Concluída (${dateStr})` : 'Concluída',
          score: score,
          obsId: finalizedObs.id,
          obsDate: finalizedObs.date,
          className: finalizedObs.className || defaultClassName,
          bimesterNum,
          currentBimNum
        };
      }

      // 2. Busca rascunho em andamento
      const draftObs = (appState.observations || []).find(o => {
        if (o.status !== 'draft') return false;
        if (cleanSchool && o.schoolName && o.schoolName.trim().toLowerCase() !== cleanSchool) return false;
        const oBimMatch = (o.bimester || '').match(/([1-4])/);
        if (!oBimMatch || parseInt(oBimMatch[1], 10) !== bimesterNum) return false;

        if (o.teacherName && o.teacherName.trim().toLowerCase().includes(cleanTeacher)) return true;
        if (Array.isArray(o.teachers) && o.teachers.some(t => (t || '').trim().toLowerCase() === cleanTeacher)) return true;
        if (o.className) {
          const oClsClean = o.className.trim().toLowerCase();
          return teacherClassNames.some(tCls => tCls === oClsClean || tCls.includes(oClsClean) || oClsClean.includes(tCls));
        }
        return false;
      });

      if (draftObs) {
        return {
          status: 'in_progress',
          colorKey: 'blue',
          label: 'Rascunho Aberto',
          score: null,
          obsId: draftObs.id,
          className: draftObs.className || defaultClassName,
          isDraft: true,
          bimesterNum,
          currentBimNum
        };
      }

      // 3. Busca agendamento previsto no cronograma
      const sched = (appState.schedules || []).find(s => {
        if (s.status === 'cancelado' || s.status === 'realizado') return false;
        if (cleanSchool && s.schoolName && s.schoolName.trim().toLowerCase() !== cleanSchool) return false;
        const sBimMatch = (s.bimester || '').match(/([1-4])/);
        if (!sBimMatch || parseInt(sBimMatch[1], 10) !== bimesterNum) return false;

        if (s.targetName && s.targetName.trim().toLowerCase().includes(cleanTeacher)) return true;
        if (Array.isArray(s.teachers) && s.teachers.some(t => (t || '').trim().toLowerCase() === cleanTeacher)) return true;
        if (s.className) {
          const sClsClean = s.className.trim().toLowerCase();
          return teacherClassNames.some(tCls => tCls === sClsClean || tCls.includes(sClsClean) || sClsClean.includes(tCls));
        }
        return false;
      });

      if (sched) {
        const schedDate = formatDateBR(sched.date || '');
        return {
          status: 'in_progress',
          colorKey: 'blue',
          label: schedDate ? `Agendada (${schedDate})` : 'Agendada',
          score: null,
          scheduleId: sched.id,
          scheduleDate: sched.date,
          className: sched.className || defaultClassName,
          isDraft: false,
          bimesterNum,
          currentBimNum
        };
      }

      // 4. Regra temporal do Semáforo contra o bimestre letivo de referência
      if (bimesterNum < currentBimNum) {
        return {
          status: 'overdue',
          colorKey: 'red',
          label: 'Atrasada (Expirado)',
          score: null,
          className: defaultClassName,
          bimesterNum,
          currentBimNum
        };
      }

      if (bimesterNum === currentBimNum) {
        return {
          status: 'in_progress',
          colorKey: 'blue',
          label: 'No Prazo (Pendente)',
          score: null,
          className: defaultClassName,
          bimesterNum,
          currentBimNum
        };
      }

      return {
        status: 'future',
        colorKey: 'gray',
        label: 'Ciclo Futuro',
        score: null,
        className: defaultClassName,
        bimesterNum,
        currentBimNum
      };
    }

    /**
     * Determina o próximo bimestre elegível para agendamento rápido de um docente
     */
    function getNextEligibleBimesterForTeacher(teacherName, schoolName) {
      const BIMESTERS_CANONICAL = ['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre'];
      for (const bName of BIMESTERS_CANONICAL) {
        const st = calculateTeacherBimesterStatus(teacherName, schoolName, bName);
        if (st.status === 'overdue' || (st.status === 'in_progress' && !st.obsId && !st.scheduleId)) {
          return bName;
        }
      }
      return getCurrentSchoolBimester();
    }
```

---

### PASSO 2: Inclusão do Helper de Interação Semafórica do Docente em `index.html`

Logo após a função `handleSemaphoreCellClick` (~linha 16110), inserir:

```javascript
    /**
     * Interação com a célula semafórica do Docente Regente (Pilar 10)
     */
    function handleTeacherSemaphoreCellClick(teacherName, schoolName, bimesterName, statusObj) {
      if (!statusObj) return;

      const member = (appState.teamMembers || []).find(m => m.name === teacherName);
      const targetClass = statusObj.className || member?.classAssigned || 'Infantil I - Turma A';

      if (statusObj.status === 'completed' && statusObj.obsId) {
        // Redireciona para o Histórico focando na observação finalizada
        appState.activeTabIndex = 3;
        appState.historyFilter = 'finalized';
        renderHistoryScreen();
        switchTab(3);
        setTimeout(() => {
          const card = document.getElementById(`obs-card-${statusObj.obsId}`);
          if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            card.style.outline = '3px solid var(--primary)';
            setTimeout(() => { card.style.outline = ''; }, 3000);
          }
        }, 150);
      } else if (statusObj.status === 'in_progress' && statusObj.obsId && statusObj.isDraft) {
        resumeObservation(statusObj.obsId, false);
      } else if (statusObj.status === 'overdue' || statusObj.status === 'in_progress') {
        quickScheduleForClass(targetClass, schoolName, bimesterName);
      }
    }

    /**
     * Alternador de filtro rápido no Semáforo de Docentes
     */
    function filterTeacherSemaphoreByStatus(statusKey) {
      appState.activeSemaphoreTeacherStatusFilter = statusKey; // 'all', 'overdue', 'in_progress', 'completed_cur', 'completed_all'
      renderIndicatorsScreen();
    }
```

---

### PASSO 3: Cálculo Estatístico e Renderização Semafórica de Docentes em `renderIndicatorsScreen()`

No bloco do **PILAR 10** em `renderIndicatorsScreen()` (~linha 17420):
1. **Adicionar o cálculo estatístico para Docentes Regentes:**
Logo após o cálculo de `classesStatusData` (~linha 17464), calcular `teachersStatusData`:

```javascript
      // 1.2 Coleta estatística de DOCENTES REGENTES no escopo
      let semOverdueTeachersCount = 0;
      let semInProgressPendingTeachersCount = 0;
      let semCompletedCurrentBimTeachersCount = 0;
      let semCycleCompletedTeachersCount = 0;
      let totalCompletedTeacherObsInCycle = 0;

      const teachersStatusData = scopedAvaliandos.map(member => {
        const bimesterStatuses = {};
        let completedCount = 0;
        let hasOverdue = false;
        let hasCurrentPending = false;

        BIMESTERS_CANONICAL.forEach(bName => {
          const st = calculateTeacherBimesterStatus(member.name, member.school, bName);
          bimesterStatuses[bName] = st;
          if (st.status === 'completed') completedCount++;
          if (st.status === 'overdue') hasOverdue = true;
          if (st.status === 'in_progress' && st.bimesterNum === curBimNum) hasCurrentPending = true;
        });

        if (hasOverdue) semOverdueTeachersCount++;
        if (hasCurrentPending) semInProgressPendingTeachersCount++;
        if (bimesterStatuses[curBim]?.status === 'completed') semCompletedCurrentBimTeachersCount++;
        if (completedCount === 4) semCycleCompletedTeachersCount++;
        totalCompletedTeacherObsInCycle += completedCount;

        const cyclePct = Math.round((completedCount / 4) * 100);

        return {
          member,
          bimesterStatuses,
          completedCount,
          cyclePct,
          hasOverdue,
          hasCurrentPending,
          isCompletedCurrent: bimesterStatuses[curBim]?.status === 'completed',
          isCycleCompleted: completedCount === 4
        };
      });

      const teacherStatusFilter = appState.activeSemaphoreTeacherStatusFilter || 'all';
      const filteredTeachersStatusData = teachersStatusData.filter(item => {
        if (teacherStatusFilter === 'overdue') return item.hasOverdue;
        if (teacherStatusFilter === 'in_progress') return item.hasCurrentPending;
        if (teacherStatusFilter === 'completed_cur') return item.isCompletedCurrent;
        if (teacherStatusFilter === 'completed_all') return item.isCycleCompleted;
        return true;
      });

      const totalTeacherAnnualTarget = scopedAvaliandos.length * 4;
      const overallTeacherCyclePct = totalTeacherAnnualTarget > 0 ? Math.round((totalCompletedTeacherObsInCycle / totalTeacherAnnualTarget) * 100) : 0;
```

2. **Ajustar a descrição do cabeçalho conforme a visão ativa:**
Substituir o parágrafo explicativo do cabeçalho do Semáforo (~linhas 17491-17496) para refletir se a visão é por Turma ou Docente:

```javascript
                <p>
                  Acompanhamento matricial do cumprimento das 4 observações obrigatórias organizado por <strong>${viewMode === 'classes' ? 'TURMA' : 'DOCENTE REGENTE TITULAR'}</strong>: 
                  <strong style="color:#16A34A;">🟢 Concluída</strong> · 
                  <strong style="color:#1E40AF;">⚪ No Prazo</strong> · 
                  <strong style="color:#DC2626;">🔴 Atrasada</strong>.
                </p>
```

3. **Substituição Completa do Bloco `else` (Visão de Docentes):**
Substituir todo o trecho antigo (~linhas 17698 a 17774) pelo bloco semafórico completo com 4 micro-cards, barra de filtros rápidos, tabela matricial de pílulas e cards mobile:

```javascript
      } else {
        // =======================================================================
        // PILAR 10: VISÃO DERIVADA POR DOCENTES REGENTES (SEMÁFORO CANÔNICO)
        // =======================================================================
        html += `
          <!-- 4 Micro-cards de Resumo Decisório para Docentes -->
          <div class="semaphore-stats-grid">
            <div class="sem-stat-card ${semOverdueTeachersCount > 0 ? 'alert-card' : ''}">
              <div class="sem-stat-label">
                <span>${semOverdueTeachersCount > 0 ? '⚠' : '🛡️'}</span> Docentes em Atraso
              </div>
              <div class="sem-stat-value">${semOverdueTeachersCount}</div>
              <div class="sem-stat-desc">${semOverdueTeachersCount === 0 ? 'Nenhum atraso acumulado' : 'Requer intervenção imediata'}</div>
            </div>

            <div class="sem-stat-card">
              <div class="sem-stat-label">
                <span>⏳</span> Pendentes no ${curBim}
              </div>
              <div class="sem-stat-value">${semInProgressPendingTeachersCount}</div>
              <div class="sem-stat-desc">Dentro do prazo regulamentar</div>
            </div>

            <div class="sem-stat-card">
              <div class="sem-stat-label">
                <span>🟢</span> Cobertos no ${curBim}
              </div>
              <div class="sem-stat-value">${semCompletedCurrentBimTeachersCount} <span style="font-size:14px; font-weight:700; color:var(--text-secondary);">/ ${scopedAvaliandos.length}</span></div>
              <div class="sem-stat-desc">${scopedAvaliandos.length > 0 ? Math.round((semCompletedCurrentBimTeachersCount / scopedAvaliandos.length) * 100) : 0}% de cobertura docente</div>
            </div>

            <div class="sem-stat-card">
              <div class="sem-stat-label">
                <span>🏆</span> Avanço do Ciclo Docente
              </div>
              <div class="sem-stat-value">${overallTeacherCyclePct}%</div>
              <div class="sem-stat-desc">${totalCompletedTeacherObsInCycle} de ${totalTeacherAnnualTarget} observações anuais</div>
            </div>
          </div>

          <!-- Barra de Filtros Rápidos de Status Docente -->
          <div class="semaphore-filters-bar">
            <span class="sem-filter-label">Filtrar:</span>
            <button type="button" class="sem-filter-chip ${teacherStatusFilter === 'all' ? 'active' : ''}" onclick="filterTeacherSemaphoreByStatus('all')">
              Todos (${scopedAvaliandos.length})
            </button>
            <button type="button" class="sem-filter-chip chip-red ${teacherStatusFilter === 'overdue' ? 'active' : ''}" onclick="filterTeacherSemaphoreByStatus('overdue')">
              🔴 Com Atraso (${semOverdueTeachersCount})
            </button>
            <button type="button" class="sem-filter-chip ${teacherStatusFilter === 'in_progress' ? 'active' : ''}" onclick="filterTeacherSemaphoreByStatus('in_progress')">
              ⚪ No Prazo (${semInProgressPendingTeachersCount})
            </button>
            <button type="button" class="sem-filter-chip chip-green ${teacherStatusFilter === 'completed_cur' ? 'active' : ''}" onclick="filterTeacherSemaphoreByStatus('completed_cur')">
              🟢 Cobertos (${semCompletedCurrentBimTeachersCount})
            </button>
            <button type="button" class="sem-filter-chip ${teacherStatusFilter === 'completed_all' ? 'active' : ''}" onclick="filterTeacherSemaphoreByStatus('completed_all')">
              🏆 Ciclo 100% (${semCycleCompletedTeachersCount})
            </button>
          </div>
        `;

        if (filteredTeachersStatusData.length === 0) {
          html += `
            <div style="text-align:center; padding:32px 16px; color:var(--text-secondary); background:#F8FAFC; border-radius:8px;">
              Nenhum docente regente titular localizado para o filtro selecionado.
            </div>
          `;
        } else {
          // Renderização da Tabela Matricial Semafórica de Docentes (Desktop)
          let teacherTableRows = '';
          let teacherMobileCards = '';

          filteredTeachersStatusData.forEach(item => {
            const member = item.member;
            const targetClass = member.classAssigned || 'Turma Regente';
            const memberSchool = member.school || 'Unidade Escolar';
            const nextBim = getNextEligibleBimesterForTeacher(member.name, memberSchool);

            // Células dos 4 Bimestres (Desktop)
            const bimesterCellsHtml = BIMESTERS_CANONICAL.map(bName => {
              const st = item.bimesterStatuses[bName];
              return `
                <td style="text-align:center; padding:8px 6px;">
                  <div class="sem-status-pill status-${st.status}" onclick="handleTeacherSemaphoreCellClick('${member.name.replace(/'/g, "\\'")}', '${memberSchool.replace(/'/g, "\\'")}', '${bName}', ${JSON.stringify(st).replace(/"/g, '&quot;')})" title="Clique para detalhes ou ações imediatas">
                    <div class="pill-top">
                      <span>${st.status === 'completed' ? '✓' : st.status === 'overdue' ? '⚠' : st.status === 'in_progress' ? '⏳' : '○'} ${bName.replace(' Bimestre', 'º')}</span>
                      ${st.score !== null ? `<span style="font-weight:900;">${st.score}%</span>` : ''}
                    </div>
                    <div class="pill-sub">${st.label}</div>
                  </div>
                </td>
              `;
            }).join('');

            // Pílulas para Cards Mobile
            const mobileBimGridHtml = BIMESTERS_CANONICAL.map(bName => {
              const st = item.bimesterStatuses[bName];
              return `
                <div class="sem-status-pill status-${st.status}" onclick="handleTeacherSemaphoreCellClick('${member.name.replace(/'/g, "\\'")}', '${memberSchool.replace(/'/g, "\\'")}', '${bName}', ${JSON.stringify(st).replace(/"/g, '&quot;')})">
                  <div class="pill-top">
                    <span>${st.status === 'completed' ? '✓' : st.status === 'overdue' ? '⚠' : st.status === 'in_progress' ? '⏳' : '○'} ${bName.replace(' Bimestre', 'º')}</span>
                    ${st.score !== null ? `<span>${st.score}%</span>` : ''}
                  </div>
                  <div class="pill-sub">${st.label}</div>
                </div>
              `;
            }).join('');

            // Barra de Progresso do Ciclo
            const cycleProgressHtml = `
              <div class="sem-cycle-progress-wrap">
                <div class="sem-cycle-text">
                  <span>${item.completedCount} de 4</span>
                  <span>${item.cyclePct}%</span>
                </div>
                <div class="sem-cycle-bar-bg">
                  <div class="sem-cycle-bar-fill" style="width:${item.cyclePct}%; background:${item.cyclePct === 100 ? '#16A34A' : item.cyclePct >= 50 ? 'var(--primary)' : '#EAB308'};"></div>
                </div>
              </div>
            `;

            // Linha da Tabela Desktop
            teacherTableRows += `
              <tr>
                <td>
                  <strong style="color:var(--text-primary); font-size:13px;">${member.name}</strong>
                  <div style="font-size:11px; color:var(--text-secondary); margin-top:2px;">
                    <span style="font-weight:700; color:var(--primary);">${targetClass}</span> · ${memberSchool}
                  </div>
                </td>
                ${bimesterCellsHtml}
                <td>${cycleProgressHtml}</td>
                <td style="text-align:center; white-space:nowrap;">
                  <div style="display:flex; gap:6px; justify-content:center;">
                    <button type="button" class="btn btn-secondary btn-action-sem" style="font-size:11px; padding:5px 9px;" onclick="quickScheduleForClass('${targetClass.replace(/'/g, "\\'")}', '${memberSchool.replace(/'/g, "\\'")}', '${nextBim}')" title="Agendar observação para a turma desta docente">
                      📅 Agendar
                    </button>
                    <button type="button" class="btn btn-secondary btn-action-sem" style="font-size:11px; padding:5px 9px;" onclick="selectTeacherForLongitudinalAnalysis('${member.name.replace(/'/g, "\\'")}')" title="Abrir Raio-X individual da docente">
                      🔍 Raio-X
                    </button>
                  </div>
                </td>
              </tr>
            `;

            // Card Mobile
            teacherMobileCards += `
              <div class="sem-mobile-class-card ${item.hasOverdue ? 'has-overdue' : ''}">
                <div class="sem-mobile-card-header">
                  <div>
                    <div class="sem-mobile-class-name">${member.name}</div>
                    <div class="sem-mobile-class-sub"><span style="font-weight:700; color:var(--primary);">${targetClass}</span> · ${memberSchool}</div>
                  </div>
                  <div>${cycleProgressHtml}</div>
                </div>

                <div class="sem-mobile-bimesters-grid">
                  ${mobileBimGridHtml}
                </div>

                <div style="display:flex; gap:8px; margin-top:8px;">
                  <button type="button" class="btn btn-secondary btn-full btn-action-sem" style="font-size:11px; padding:7px 10px; justify-content:center;" onclick="quickScheduleForClass('${targetClass.replace(/'/g, "\\'")}', '${memberSchool.replace(/'/g, "\\'")}', '${nextBim}')">
                    📅 Agendar Turma
                  </button>
                  <button type="button" class="btn btn-secondary btn-full btn-action-sem" style="font-size:11px; padding:7px 10px; justify-content:center;" onclick="selectTeacherForLongitudinalAnalysis('${member.name.replace(/'/g, "\\'")}')">
                    🔍 Raio-X Item a Item
                  </button>
                </div>
              </div>
            `;
          });

          html += `
            <!-- Visão Tabela Desktop para Docentes -->
            <div class="semaphore-table-view">
              <table class="semaphore-table">
                <thead>
                  <tr>
                    <th>Docente Regente Titular</th>
                    <th class="col-bim">1º Bimestre<br><span style="font-size:10px; font-weight:normal; opacity:0.8;">Fev - Abr</span></th>
                    <th class="col-bim">2º Bimestre<br><span style="font-size:10px; font-weight:normal; opacity:0.8;">Mai - Jul</span></th>
                    <th class="col-bim">3º Bimestre<br><span style="font-size:10px; font-weight:normal; opacity:0.8;">Ago - Out</span></th>
                    <th class="col-bim">4º Bimestre<br><span style="font-size:10px; font-weight:normal; opacity:0.8;">Nov - Jan</span></th>
                    <th style="width:130px;">Ciclo Anual</th>
                    <th style="width:140px; text-align:center;">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  ${teacherTableRows}
                </tbody>
              </table>
            </div>

            <!-- Visão Cards Mobile para Docentes -->
            <div class="semaphore-cards-view">
              ${teacherMobileCards}
            </div>
          `;
        }
      }
```

---

### PASSO 4: Atualização da Gestão Dupla do Changelog (Texto e Site)

Atualizar para a versão **1.09**:
1. No arquivo `CHANGELOG.md`:
   - Adicionar nova linha no Sumário Executivo:
     `| **1.09** | 22/10/2026 14:00 | intermediárias/aplicativo_v109_pilar_10_semaforo_docentes_regentes.html | Pilar 10: Semáforo Anual para Docentes Regentes | Resolução completa da visão semafórica de Docentes Regentes no Pilar 10, eliminação de células em branco, micro-cards decisórios docentes, filtros rápidos e integração com agendamento 🚦 |`
   - Adicionar detalhamento com Inclusões, Modificações e Exclusões.
2. No arquivo `index.html`:
   - Atualizar o botão `.btn-changelog` para `📌 Versão 1.09`.
   - Adicionar o bloco de versão no topo da lista no `#modalChangelog`.
3. Sincronizar cópias espelhadas em:
   - `gestor supervisao_patos/index.html`
   - `gestor supervisao_patos/firebase_deploy/public/index.html`
   - Salvar backup em `intermediárias/aplicativo_v109_pilar_10_semaforo_docentes_regentes.html`.

---

## 4. Critérios de Aceite e Roteiro de Teste/Validação

### 4.1 Critérios de Aceite
- [ ] Ao acessar o Semáforo do Ciclo Anual (Sub-aba 3 de Indicadores) e alternar para `[ 👥 Docentes Regentes ]`, os 4 Micro-cards de Resumo Decisório de Docentes permanecem visíveis, calculando corretamente:
  * Docentes em Atraso;
  * Docentes Pendentes no Bimestre Corrente;
  * Docentes Cobertos no Bimestre Corrente (com percentual de cobertura);
  * Avanço do Ciclo Docente.
- [ ] A Barra de Filtros Rápidos de Status (Todos, Com Atraso, No Prazo, Cobertos, Ciclo 100%) funciona interativamente e filtra as linhas da tabela de docentes em tempo real.
- [ ] As células da tabela matricial de docentes não ficam mais "em branco" (`—` sem significado):
  * Docente com observação concluída exibe pílula verde com a nota de consistência ponderada e data.
  * Docente em atraso exibe pílula vermelha (`Atrasada`).
  * Docente dentro do prazo no bimestre atual exibe pílula azul (`No Prazo` ou `Agendada`).
  * Bimestres futuros exibem pílula neutra (`Ciclo Futuro`).
- [ ] O clique em qualquer pílula semafórica de docente dispara o modal correspondente ou redireciona adequadamente para o histórico / agendamento.
- [ ] O botão `📅 Agendar` na linha da docente abre o modal pré-preenchido com a turma de lotação e próximo bimestre pendente.
- [ ] O botão `🔍 Raio-X` seleciona a docente e transita diretamente para a sua análise longitudinal individual item a item.
- [ ] O layout mobile adapta-se perfeitamente com cards verticais ergonômicos e grade de pílulas.

---

## 5. Seção Obrigatória de Auditoria: Alterações, Adições e Exclusões no Algoritmo de Auditoria

> O algoritmo de auditoria da plataforma (`audit_platform.py` e engine de testes do `index.html`) deve manter **100% de cobertura determinística da plataforma**, estruturado em módulos independentes ("modo-a-modo"). A seguir, detalham-se as alterações, adições e exclusões específicas necessárias para cobrir integralmente a visão semafórica de Docentes Regentes no Pilar 10.

### 5.1 Atualizações no Catálogo Oficial de Módulos (`audit_platform.py` e `index.html`)
O Módulo 10 (`indicadores_decisao`) mantém sua chave e atualiza a descrição:
```python
MODULE_CATALOG = {
    ...
    'indicadores_decisao': 'Indicadores Pedagógicos, Cobertura Bimestral (Pilar 7), Gargalos (Pilar 8), Pop-up Mobile (Pilar 9) e Semáforo de Turmas e Docentes (Pilar 10)',
    ...
}
```

### 5.2 Alterações e Adições na Engine de Testes do Browser (`window.runFullPlatformAudit` em `index.html`)

No **MÓDULO 10** (`indicadores_decisao`), localizar o bloco do Pilar 10 (~linhas 20586 a 20630) e aplicar as seguintes modificações:

#### A. Inclusão das Asserções Algorítmicas de `calculateTeacherBimesterStatus`:
```javascript
              // PILAR 10: VALIDAÇÃO DO MOTOR ALGORÍTMICO CALCULATETEACHERBIMESTERSTATUS
              // Caso 1: Docente com observação concluída (Ana Carolina Silva no 1º Bimestre)
              const teacherStatusGreen = calculateTeacherBimesterStatus('Ana Carolina Silva', 'CEI Professora Maria de Lourdes', '1º Bimestre');
              if (teacherStatusGreen.status !== 'completed' || teacherStatusGreen.colorKey !== 'green') {
                throw new Error(`Falha Pilar 10 Docente: Esperado status completed/green para Ana Carolina no 1º Bimestre, obtido ${teacherStatusGreen.status}/${teacherStatusGreen.colorKey}`);
              }
              logger.log('Cálculo algorítmico do Semáforo Docente: 🟢 Verde (Concluída)', true, `${teacherStatusGreen.label} - Score: ${teacherStatusGreen.score}%`);

              // Caso 2: Docente com observação atrasada (Carla Beatriz Mendes no 1º Bimestre sem observação)
              const teacherStatusRed = calculateTeacherBimesterStatus('Carla Beatriz Mendes', 'CEI Professora Maria de Lourdes', '1º Bimestre');
              if (teacherStatusRed.status !== 'overdue' || teacherStatusRed.colorKey !== 'red') {
                throw new Error(`Falha Pilar 10 Docente: Esperado status overdue/red para Carla Beatriz no 1º Bimestre, obtido ${teacherStatusRed.status}/${teacherStatusRed.colorKey}`);
              }
              logger.log('Cálculo algorítmico do Semáforo Docente: 🔴 Vermelho (Atrasada / Bimestre Expirado)', true, teacherStatusRed.label);

              // Caso 3: Docente no bimestre corrente
              const curBimTeacherTest = getCurrentSchoolBimester();
              const teacherStatusCurrent = calculateTeacherBimesterStatus('Carla Beatriz Mendes', 'CEI Professora Maria de Lourdes', curBimTeacherTest);
              if (teacherStatusCurrent.status !== 'in_progress' && teacherStatusCurrent.status !== 'completed') {
                throw new Error(`Falha Pilar 10 Docente: Esperado status in_progress para Carla Beatriz no bimestre corrente, obtido ${teacherStatusCurrent.status}`);
              }
              logger.log('Cálculo algorítmico do Semáforo Docente: ⚪ No Prazo (Bimestre Corrente)', true, teacherStatusCurrent.label);
```

#### B. Inclusão das Asserções de Renderização e Filtros no DOM da Visão Docente:
Substituir o teste simples de alternador anterior (~linhas 20623 a 20629) por:
```javascript
              // PILAR 10: VALIDAÇÃO DO DOM DA VISÃO DE DOCENTES REGENTES NO SEMÁFORO
              toggleLongitudinalViewMode('teachers');
              const teachersViewActive = document.getElementById('bimesterSemaphoreSection');
              if (!teachersViewActive || !teachersViewActive.innerHTML.includes('Docente Regente Titular')) {
                throw new Error('Falha Pilar 10: Alternador para visão de docentes falhou na tabela');
              }
              if (!teachersViewActive.innerHTML.includes('Docentes em Atraso') || !teachersViewActive.innerHTML.includes('Avanço do Ciclo Docente')) {
                throw new Error('Falha Pilar 10: Micro-cards de resumo decisório de docentes ausentes no DOM');
              }
              if (!teachersViewActive.innerHTML.includes('sem-status-pill status-completed')) {
                throw new Error('Falha Pilar 10: Pílulas semafóricas não renderizadas na matriz de docentes');
              }
              logger.log('Renderização completa e semafórica da Visão de Docentes Regentes (Pilar 10)', true);

              // Validação do Filtro Rápido de Docentes
              filterTeacherSemaphoreByStatus('overdue');
              const overdueTeacherDom = document.getElementById('bimesterSemaphoreSection');
              if (!overdueTeacherDom || !overdueTeacherDom.innerHTML.includes('🔴 Com Atraso')) {
                throw new Error('Falha Pilar 10: Filtro rápido de docentes com atraso não refletiu no DOM');
              }
              filterTeacherSemaphoreByStatus('all');
              logger.log('Validação dos Filtros Rápidos de Status no Semáforo de Docentes (Pilar 10)', true);

              // Restaura a visão de turmas padrão
              toggleLongitudinalViewMode('classes');
```

### 5.3 Resumo das Modificações na Auditoria

| Tipo | Arquivo | Descrição |
|---|---|---|
| **ADIÇÃO** | `index.html` (Módulo 10 de Testes) | Teste determinístico de `calculateTeacherBimesterStatus` para os casos Verde, Vermelho e Azul/No Prazo |
| **ADIÇÃO** | `index.html` (Módulo 10 de Testes) | Teste de renderização no DOM dos 4 micro-cards de docentes, das pílulas semafóricas e da tabela matricial de docentes |
| **ADIÇÃO** | `index.html` (Módulo 10 de Testes) | Teste interativo de alternância de filtros rápidos no Semáforo de Docentes (`filterTeacherSemaphoreByStatus`) |
| **MODIFICAÇÃO** | `audit_platform.py` | Atualização da descrição do Módulo 10 no catálogo canônico |
| **EXCLUSÃO** | `index.html` | Exclusão do teste simplificado anterior que apenas checava a string estática legada |

---

## 6. Checklist de Execução para a Etapa 2 (Operário)

- [ ] Executar `git pull origin main` antes de iniciar.
- [ ] Implementar `calculateTeacherBimesterStatus` e `getNextEligibleBimesterForTeacher` em `index.html`.
- [ ] Implementar `handleTeacherSemaphoreCellClick` e `filterTeacherSemaphoreByStatus` em `index.html`.
- [ ] Atualizar `renderIndicatorsScreen()` com a apuração de estatísticas e a renderização completa da visão semafórica de Docentes Regentes.
- [ ] Atualizar a suíte de auditoria do Módulo 10 em `index.html` e o catálogo em `audit_platform.py`.
- [ ] Atualizar o Changelog Duplo (`CHANGELOG.md` e modal `#modalChangelog` no `index.html`) para a versão `1.09`.
- [ ] Salvar cópia em `intermediárias/aplicativo_v109_pilar_10_semaforo_docentes_regentes.html`.
- [ ] Sincronizar as cópias espelhadas em `gestor supervisao_patos/index.html` e `gestor supervisao_patos/firebase_deploy/public/index.html`.
- [ ] Realizar checagem pré-push (`git fetch origin main`), commit semântico e deploy (`git push origin main`).
- [ ] Executar `python3 audit_platform.py --silent-on-success` e comunicar **exclusivamente eventuais problemas**.
