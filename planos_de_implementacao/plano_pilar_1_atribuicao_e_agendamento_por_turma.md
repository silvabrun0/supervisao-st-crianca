# PLANO DE IMPLEMENTAÇÃO: PILAR 1 - ATRIBUIÇÃO, AGENDAMENTO E INÍCIO DE OBSERVAÇÃO POR TURMA

> **DIRETRIZ OBRIGATÓRIA DE EXECUÇÃO (ETAPA 2):**  
> O assistente executor (Etapa 2) deve **obrigatoriamente ler e seguir as diretrizes dos arquivos `WORKFLOW_MACOS.md`, `AGENTS.md` e `GEMINI.md`** localizados na raiz do projeto antes de aplicar qualquer modificação no código. Nenhuma modificação deve ser realizada sem conformidade estrita com o workflow, incluindo:  
> 1. Execução prévia de sincronização com o repositório remoto (`git pull origin main`).  
> 2. Preservação integral das regras de negócio existentes e blindagens de segurança.  
> 3. Verificação de integridade pós-edição com dupla checagem de leitura em cada trecho modificado.  
> 4. Salvamento obrigatório do backup intermediário na pasta `intermediárias/` sob o nome `aplicativo_v87_pilar_1_atribuicao_e_agendamento_por_turma.html` (e espelho na pasta interna de intermediárias).  
> 5. Gestão dupla de Changelog no arquivo `CHANGELOG.md` e no modal `#modalChangelog` do `index.html`, atualizando para a **Versão 0.87 (v7.66)**.  
> 6. Sincronização idêntica entre o arquivo principal `index.html` da raiz, `gestor supervisao_patos/index.html` e `gestor supervisao_patos/firebase_deploy/public/index.html`.  
> 7. Checagem pré-push (`git fetch origin main`), commit semântico (`feat: migrar atribuicao agendamento e inicio de observacao para turma no pilar 1`), push para `origin main` (deploy automático no GitHub Pages).  

---

## 1. Diagnóstico e Contexto

### 1.1 O Erro Identificado
No ciclo inicial de implementação do **Pilar 1 (Versão 0.85)**, a inversão da unidade de análise para a **TURMA** foi implementada com êxito na tela de configuração manual da observação (`#screenSetup`), nos cabeçalhos da observação ativa (`#screenActiveObs`), na síntese avaliativa (`#screenSynthesis`), no histórico (`#screenHistory`) e na métrica de cobertura da aba de Indicadores (`#screenIndicators`).

Contudo, permaneceu uma incoerência crítica nos fluxos de **Atribuição, Agendamento e Início vinculado ao Cronograma**:
1. **Modal de Agendamento (`#modalAddSchedule`):** O campo para Coordenadoras Pedagógicas continuou configurado como *"Profissional a ser Acompanhado(a)"* (`#scheduleTarget`), filtrando e exibindo uma lista de **professoras nominais**. A coordenadora era forçada a selecionar uma docente específica, em vez de selecionar a **TURMA**.
2. **Cálculo de Próximo Bimestre Longitudinal na Agenda:** Ao selecionar a docente no agendamento, o sistema disparava `autoSelectNextEligibleBimester(teacherName)`, calculando a elegibilidade do bimestre sobre o histórico individual da docente e não da **TURMA**.
3. **Persistência do Agendamento (`saveNewSchedule`):** O registro era salvo com `targetName = "Nome da Professora"`, relegando a turma ao papel de metadado secundário estático extraído do cadastro do membro.
4. **Hero Card de "PRÓXIMA VISITA" e Cronograma Geral (`renderScheduleScreen`):** O título em destaque de 20px no topo da tela do cronograma exibia o nome da professora (`nextVisit.targetName`), e não a **TURMA**. A tabela desktop e os cards mobile reproduziam esse erro, colocando o docente como sujeito da ação.
5. **Modal de Seleção de Visita Agendada (`openSelectScheduledObsModal`):** Ao clicar em "Nova Observação Pedagógica" com agendamentos pendentes, o card exibia o nome da professora em destaque tipográfico de 14px 800, e não a **TURMA**.
6. **Seletor Rápido na Tela de Setup (`#setupLinkedSchedule`):** O select vinculava a observação exibindo o nome da professora ao lado do bimestre.
7. **Filtros de Permissão e Blindagem de Cargo (`getActionablePendingSchedules` e `openSetupScreen`):** A verificação de permissão exigia que o agendamento pertencesse a um membro com `roleKey === 'professora'`, gerando potenciais bloqueios ou comportamentos anômalos caso a visita fosse agendada diretamente para a turma.

### 1.2 Fundamentação Técnico-Pedagógica
Conforme deliberado na reunião oficial da equipe SerTão Criança (*Carolina Machado, Diogo Dias Furtado, Bruno Pereira da Silva e Julia Cordoba*):
- **Patos/PB Não Possui Professor Auxiliar:** As salas de Educação Infantil contam com duplas de professores regentes titulares (período parcial) ou quartetos de regentes titulares (período integral).
- **A Unidade Que Aprende é a Turma:** A supervisão pedagógica analisa a ambiência, a rotina, o arranjo dos materiais e as interações coletivas vivenciadas pelas crianças naquela **TURMA**.
- **Coerência da Atribuição:** A Coordenadora Pedagógica não "atribui uma observação à professora Maria"; ela **planeja, agenda e atribui a observação à TURMA** no 1º, 2º, 3º ou 4º Bimestre. A equipe de regência titular vinculada àquela turma é exibida como sujeito coletivo corresponsável, garantindo que o cronograma reflita com exatidão a rotina pedagógica real da escola.

---

## 2. Arquitetura e Pontos de Impacto

### 2.1 Mapeamento Comparativo de Comportamento

| Ponto de Impacto | Comportamento Atual (Com Erro) | Novo Comportamento (Pilar 1 Corrigido) |
| :--- | :--- | :--- |
| **Modal Agendamento (`#modalAddSchedule`)** | Rótulo fixo "Profissional a ser Acompanhado(a)"; lista professoras nominais para a Coordenadora. | Rótulo dinâmico **"Turma da Educação Infantil"**; lista as turmas da escola (`getClassesForSchool`); exibe badge de turno e painel com as Docentes Regentes Titulares. |
| **Cálculo Bimestral no Agendamento** | Executa `autoSelectNextEligibleBimester(teacherName)` avaliando o professor. | Executa `autoSelectNextEligibleBimesterForClass(className, schoolName)` avaliando o ciclo longitudinal da **TURMA**. |
| **Objeto Agendamento (`appState.schedules`)** | `targetName: 'Ana Carolina Silva'`, `className: 'Infantil I'`. | `targetType: 'turma'`, `targetName: 'Infantil I - Turma A'`, `className: 'Infantil I - Turma A'`, `classId: 'cls-...'`, `teachers: ['Ana...', 'Juliana...']`. |
| **Hero Card "PRÓXIMA VISITA"** | Título principal: Nome da Professora. Subtítulo: Turma. | Título principal: **📚 Nome da Turma** (`nextVisit.className`). Subtítulo: **👩‍🏫 Regência Titular: Docentes da Turma** · Bimestre · Escola. |
| **Tabela & Cards do Cronograma** | Coluna "Profissional" exibe o nome da docente em destaque. | Exibe a **TURMA** em destaque visual (com ícone e badge de turno) e as docentes regentes titulares em subtítulo. |
| **Cards de Visitas na Tela Inicial (`#homeScheduledCardsList`)** | Exibe nome da professora em `<strong>${s.targetName}</strong>`. | Exibe a **TURMA** em destaque (`📚 ${s.className}`) e as docentes regentes em subtítulo. |
| **Modal "Iniciar Visita Agendada" (`#modalSelectScheduledObs`)** | Card destaca o nome da professora individual em negrito. | Card destaca a **TURMA** em negrito (`📚 ${s.className}`), com tags informativas das docentes titulares. |
| **Seletor de Vínculo na Tela de Setup (`#setupLinkedSchedule`)** | Opções mostram: `${s.targetName} (${s.bimester}...)`. | Opções mostram: `📚 ${s.className} (${s.bimester} · ${data} · ${escola})`. |
| **Blindagem de Cargo em `openSetupScreen`** | Bloqueia se `targetMember.roleKey !== 'professora'`. | Reconhece visitas com `targetType === 'turma'`, validando a escola e carregando a turma diretamente no seletor `#setupClass`. |
| **Mock Inicial (`INITIAL_SCHEDULES`) & `loadState()`** | Agendamentos padrão vinculados nominalmente a professoras. | Agendamentos padrão vinculados às **TURMAS** canônicas, com migração transparente em `loadState()` para o `localStorage`. |
| **Acompanhamento da Formadora (Pilar 2)** | Acompanha Coordenadoras Pedagógicas. | **Preservado 100% inalterado** (`targetType: 'coordenador'`, seleção nominal da coordenadora). |

---

## 3. Especificação Passo a Passo de Código

### Passo 3.1: Atualização do Catálogo Canônico de Agendamentos (`INITIAL_SCHEDULES`) e Migração em `loadState()`

**Arquivo:** `index.html` (e espelhos)  
**Localização:** Por volta das linhas 6282-6375.

#### Código de `INITIAL_SCHEDULES`:
Substituir os registros padrão de agendamento para que reflitam a unidade canônica **TURMA**:

```javascript
    // --- 1.4 CRONOGRAMA INICIAL DE VISITAS (CANÔNICO - PILAR 1) ---
    const INITIAL_SCHEDULES = [
      {
        id: 'sch-001',
        schoolName: 'CEI Professora Maria de Lourdes',
        targetType: 'turma',
        targetName: 'Infantil I - Turma A',
        className: 'Infantil I - Turma A',
        classId: 'cls-pml-01',
        teachers: ['Ana Carolina Silva', 'Juliana Roberta Rocha'],
        bimester: '1º Bimestre',
        plannedDate: '2026-10-21',
        plannedTime: '08:00',
        supervisor: 'Mariana Ferreira',
        status: 'planejado' // 'planejado', 'realizado', 'atrasado'
      },
      {
        id: 'sch-002',
        schoolName: 'CEI Professora Maria de Lourdes',
        targetType: 'turma',
        targetName: 'Berçário II - Turma Única',
        className: 'Berçário II - Turma Única',
        classId: 'cls-pml-02',
        teachers: ['Carla Beatriz Mendes'],
        bimester: '1º Bimestre',
        plannedDate: '2026-10-23',
        plannedTime: '09:00',
        supervisor: 'Mariana Ferreira',
        status: 'planejado'
      },
      {
        id: 'sch-003',
        schoolName: 'CEI Professora Maria de Lourdes',
        targetType: 'turma',
        targetName: 'Infantil II - Turma B',
        className: 'Infantil II - Turma B',
        classId: 'cls-pml-03',
        teachers: ['Juliana Roberta Rocha'],
        bimester: '1º Bimestre',
        plannedDate: '2026-10-27',
        plannedTime: '08:30',
        supervisor: 'Mariana Ferreira',
        status: 'planejado'
      },
      {
        id: 'sch-004',
        schoolName: 'CEI Professora Maria de Lourdes',
        targetType: 'coordenador',
        targetName: 'Mariana Ferreira',
        className: 'Coordenação Pedagógica',
        teachers: [],
        bimester: '4º Bimestre',
        plannedDate: '2026-10-28',
        plannedTime: '14:00',
        supervisor: 'Professora Formadora (SME)',
        status: 'planejado'
      }
    ];
```

#### Código de Saneamento Transparente em `loadState()`:
Garantir que agendamentos legados presentes no `localStorage` sejam automaticamente migrados para a unidade Turma:

```javascript
          // Saneamento transparente de agendamentos legados (Pilar 1: Turma)
          if (Array.isArray(appState.schedules)) {
            appState.schedules.forEach(s => {
              if (!s.targetType) {
                const targetCoord = (appState.teamMembers || []).find(m => m.name === s.targetName && m.roleKey === 'coordenador');
                if (targetCoord || (s.className && s.className.toLowerCase().includes('coord'))) {
                  s.targetType = 'coordenador';
                } else {
                  s.targetType = 'turma';
                  // Se targetName era o nome de uma professora, ajusta para o nome da turma
                  const teacherMember = (appState.teamMembers || []).find(m => m.name === s.targetName && m.roleKey === 'professora');
                  if (teacherMember) {
                    s.className = teacherMember.classAssigned || s.className || 'Infantil I - Turma A';
                    s.targetName = s.className;
                    s.teachers = [teacherMember.name];
                  } else if (s.className) {
                    s.targetName = s.className;
                  }
                }
              }
            });
          }
```

---

### Passo 3.2: Reestruturação Visual e Funcional do Modal de Agendamento (`#modalAddSchedule`)

**Arquivo:** `index.html` (e espelhos)  
**Localização:** Bloco HTML do `#modalAddSchedule` (por volta da linha 5362-5410).

#### Novo HTML do Modal:
Substituir o grupo estático de profissional por um bloco dinâmico e contextual:

```html
  <!-- ================= MODAL: AGENDAR NOVA VISITA (CRONOGRAMA) ================= -->
  <div id="modalAddSchedule" class="modal-backdrop" onclick="closeAddScheduleModal()">
    <div class="modal-panel" onclick="event.stopPropagation()">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
        <div id="scheduleModalTitle" style="font-size:17px; font-weight:800; color:var(--primary-dark);">Planejar Visita no Cronograma</div>
        <button class="btn btn-secondary" style="padding:6px 10px;" onclick="closeAddScheduleModal()">✕</button>
      </div>

      <div class="form-group">
        <label class="form-label">Unidade Escolar</label>
        <select id="scheduleSchool" class="form-select" onchange="onScheduleSchoolChange()">
          <!-- Populated -->
        </select>
      </div>

      <div class="form-group">
        <label id="scheduleTargetLabel" class="form-label">Turma a ser Observada</label>
        <select id="scheduleTarget" class="form-select" onchange="onScheduleTargetChange()">
          <!-- Populated dinamicamente com Turmas (Coordenadora) ou Coordenadoras (Formadora) -->
        </select>
      </div>

      <!-- Card Contextual de Docentes Regentes da Turma (Exibido para Coordenadoras) -->
      <div id="scheduleClassTeachersCard" style="display:none; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:10px; padding:12px; margin-bottom:14px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <span style="font-size:11px; font-weight:800; text-transform:uppercase; color:var(--primary); letter-spacing:0.5px;">Equipe de Regência Titular</span>
          <span id="scheduleClassShiftBadge" class="badge" style="font-size:10px; background:#EFF6FF; color:#1E40AF;">Parcial</span>
        </div>
        <div id="scheduleClassTeachersList" style="display:flex; flex-wrap:wrap; gap:6px;">
          <!-- Preenchido via onScheduleTargetChange -->
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Bimestre de Acompanhamento</label>
        <select id="scheduleBimester" class="form-select">
          <option value="1º Bimestre" selected>1º Bimestre</option>
          <option value="2º Bimestre">2º Bimestre</option>
          <option value="3º Bimestre">3º Bimestre</option>
          <option value="4º Bimestre">4º Bimestre</option>
        </select>
      </div>

      <div class="grid-2col" style="gap:12px;">
        <div class="form-group">
          <label class="form-label">Data Prevista</label>
          <input type="date" id="scheduleDate" class="form-input">
        </div>
        <div class="form-group">
          <label class="form-label">Horário Planejado</label>
          <input type="time" id="scheduleTime" class="form-input" value="08:00">
        </div>
      </div>

      <div style="display:flex; gap:10px; justify-content:flex-end; margin-top:14px;">
        <button class="btn btn-secondary" onclick="closeAddScheduleModal()">Cancelar</button>
        <button class="btn btn-primary" onclick="saveNewSchedule()">Salvar no Cronograma</button>
      </div>
    </div>
  </div>
```

---

### Passo 3.3: Lógica JS do Modal de Agendamento (`openAddScheduleModal`, `onScheduleSchoolChange`, `onScheduleTargetChange`, `saveNewSchedule`)

**Arquivo:** `index.html` (e espelhos)  
**Localização:** Por volta das linhas 10294-10455.

#### Código de `openAddScheduleModal`:
Ajustar títulos, rótulos e visibilidade de acordo com o perfil:

```javascript
    function openAddScheduleModal() {
      editingScheduleId = null;
      document.getElementById('scheduleModalTitle').innerText = 'Planejar Visita no Cronograma';
      const user = getCurrentUser();
      const schoolSelect = document.getElementById('scheduleSchool');
      schoolSelect.innerHTML = '';

      let allowedUnits = appState.units;
      if (user.roleKey === 'formador') {
        allowedUnits = appState.units.filter(u => u.polo === user.school || u.name === user.school);
      }

      allowedUnits.forEach(u => {
        const opt = document.createElement('option');
        opt.value = u.name;
        opt.text = u.name;
        schoolSelect.appendChild(opt);
      });

      if (user.roleKey === 'coordenador') {
        schoolSelect.value = user.school;
        schoolSelect.disabled = true;
      } else {
        schoolSelect.disabled = false;
      }

      const targetLabel = document.getElementById('scheduleTargetLabel');
      if (targetLabel) {
        targetLabel.innerText = user.roleKey === 'formador' 
          ? 'Coordenadora Pedagógica a ser Acompanhada' 
          : 'Turma da Educação Infantil a ser Observada';
      }

      onScheduleSchoolChange();
      document.getElementById('scheduleDate').value = getTodayDateString();
      document.getElementById('scheduleTime').value = '08:00';
      document.getElementById('modalAddSchedule').classList.add('active');
    }
```

#### Código de `openEditScheduleModal`:
Carregar corretamente turmas para coordenadoras e coordenadoras para formadoras:

```javascript
    function openEditScheduleModal(scheduleId) {
      editingScheduleId = scheduleId;
      const sched = appState.schedules.find(s => s.id === scheduleId);
      if (!sched) return;

      document.getElementById('scheduleModalTitle').innerText = 'Editar Visita no Cronograma';
      
      const user = getCurrentUser();
      const schoolSelect = document.getElementById('scheduleSchool');
      schoolSelect.innerHTML = '';
      
      let allowedUnits = appState.units;
      if (user.roleKey === 'formador') {
        allowedUnits = appState.units.filter(u => u.polo === user.school || u.name === user.school);
      }

      allowedUnits.forEach(u => {
        const opt = document.createElement('option');
        opt.value = u.name;
        opt.text = u.name;
        schoolSelect.appendChild(opt);
      });

      if (user.roleKey === 'coordenador') {
        schoolSelect.value = user.school;
        schoolSelect.disabled = true;
      } else {
        schoolSelect.disabled = false;
        schoolSelect.value = sched.schoolName;
      }

      const targetLabel = document.getElementById('scheduleTargetLabel');
      if (targetLabel) {
        targetLabel.innerText = user.roleKey === 'formador' 
          ? 'Coordenadora Pedagógica a ser Acompanhada' 
          : 'Turma da Educação Infantil a ser Observada';
      }

      onScheduleSchoolChange();
      
      const targetSelect = document.getElementById('scheduleTarget');
      if (targetSelect) {
        targetSelect.value = sched.className || sched.targetName;
      }
      onScheduleTargetChange();

      document.getElementById('scheduleBimester').value = sched.bimester;
      document.getElementById('scheduleDate').value = sched.plannedDate;
      document.getElementById('scheduleTime').value = sched.plannedTime || '08:00';

      document.getElementById('modalAddSchedule').classList.add('active');
    }
```

#### Código de `onScheduleSchoolChange`:
Popula com **TURMAS** para Coordenadoras (`getClassesForSchool`) e Coordenadoras para Formadoras:

```javascript
    function onScheduleSchoolChange() {
      const user = getCurrentUser();
      const school = document.getElementById('scheduleSchool').value;
      const targetSelect = document.getElementById('scheduleTarget');
      const teachersCard = document.getElementById('scheduleClassTeachersCard');
      targetSelect.innerHTML = '';

      if (user.roleKey === 'coordenador') {
        // PILAR 1: Coordenadora agenda observações da TURMA
        if (teachersCard) teachersCard.style.display = 'block';

        const schoolClasses = getClassesForSchool(school);
        if (schoolClasses.length === 0) {
          const opt = document.createElement('option');
          opt.value = '';
          opt.text = 'Nenhuma turma cadastrada nesta unidade escolar';
          targetSelect.appendChild(opt);
          if (teachersCard) teachersCard.style.display = 'none';
          return;
        }

        schoolClasses.forEach(cls => {
          const opt = document.createElement('option');
          opt.value = cls.name;
          const count = cls.teachers ? cls.teachers.length : 0;
          const regText = count > 0 ? ` (${count} regente${count > 1 ? 's' : ''})` : ' (Sem regente atribuída)';
          opt.text = `${cls.name} · ${cls.shift || 'Parcial'}${regText}`;
          targetSelect.appendChild(opt);
        });

      } else {
        // FORMADORA OU EQUIPE TÉCNICA: Acompanhamento de Coordenadoras Pedagógicas
        if (teachersCard) teachersCard.style.display = 'none';

        let candidates = appState.teamMembers.filter(m => m.school === school && m.roleKey === 'coordenador');
        candidates = candidates.filter(m => m.name !== user.name); // Bloqueio de autoagendamento

        if (candidates.length === 0) {
          const opt = document.createElement('option');
          opt.value = '';
          opt.text = 'Nenhum(a) coordenador(a) cadastrado(a) nesta unidade';
          targetSelect.appendChild(opt);
          return;
        }

        candidates.forEach(c => {
          const opt = document.createElement('option');
          opt.value = c.name;
          opt.text = `${c.name} (${c.roleTitle || 'Coordenadora Pedagógica'})`;
          targetSelect.appendChild(opt);
        });
      }

      onScheduleTargetChange();
    }
```

#### Código de `onScheduleTargetChange`:
Atualiza card de docentes regentes e calcula o próximo bimestre longitudinal da **TURMA**:

```javascript
    function onScheduleTargetChange() {
      const user = getCurrentUser();
      const schoolName = document.getElementById('scheduleSchool').value;
      const targetSelect = document.getElementById('scheduleTarget');
      if (!targetSelect) return;
      const targetVal = targetSelect.value;

      if (user.roleKey === 'coordenador') {
        const teachersCard = document.getElementById('scheduleClassTeachersCard');
        const shiftBadge = document.getElementById('scheduleClassShiftBadge');
        const listEl = document.getElementById('scheduleClassTeachersList');

        const schoolClasses = getClassesForSchool(schoolName);
        const targetClass = schoolClasses.find(c => c.name === targetVal);

        if (targetClass && listEl && teachersCard) {
          teachersCard.style.display = 'block';
          if (shiftBadge) shiftBadge.innerText = targetClass.shift || 'Parcial Matutino';
          listEl.innerHTML = '';

          const teachers = targetClass.teachers || [];
          if (teachers.length === 0) {
            listEl.innerHTML = '<span style="font-size:12px; color:#DC2626; font-style:italic;">⚠️ Nenhuma professora regente vinculada nesta turma.</span>';
          } else {
            teachers.forEach(tName => {
              const pill = document.createElement('div');
              pill.style.cssText = 'background:#FFFFFF; border:1px solid #BFDBFE; border-radius:20px; padding:3px 10px; font-size:11px; font-weight:700; color:#1E40AF; display:inline-flex; align-items:center; gap:5px;';
              pill.innerHTML = `<span>👩‍🏫</span> <span>${tName}</span>`;
              listEl.appendChild(pill);
            });
          }
        }

        // Sugere automaticamente o próximo bimestre longitudinal da TURMA
        autoSelectNextEligibleBimesterForClass(targetVal, schoolName, 'scheduleBimester');

      } else {
        // Sugere o próximo bimestre longitudinal da Coordenadora
        autoSelectNextEligibleBimester(targetVal, 'scheduleBimester');
      }
    }
```

#### Código de `saveNewSchedule`:
Grava a entidade **TURMA** como sujeito do agendamento quando criado por Coordenadora:

```javascript
    function saveNewSchedule() {
      const user = getCurrentUser();
      const schoolName = document.getElementById('scheduleSchool').value;
      const targetVal = document.getElementById('scheduleTarget').value;
      const bimester = document.getElementById('scheduleBimester').value;
      const plannedDate = document.getElementById('scheduleDate').value;
      const plannedTime = document.getElementById('scheduleTime').value || '08:00';

      if (!targetVal) {
        showToast(user.roleKey === 'coordenador' ? 'Selecione a turma para o agendamento.' : 'Selecione o profissional para o agendamento.');
        return;
      }

      let targetType = 'turma';
      let className = targetVal;
      let targetName = targetVal;
      let classId = null;
      let teachersList = [];

      if (user.roleKey === 'coordenador') {
        targetType = 'turma';
        const schoolClasses = getClassesForSchool(schoolName);
        const targetClass = schoolClasses.find(c => c.name === targetVal);
        classId = targetClass?.id || null;
        className = targetClass?.name || targetVal;
        targetName = targetClass?.name || targetVal;
        teachersList = targetClass?.teachers || [];
      } else {
        targetType = 'coordenador';
        className = 'Coordenação Pedagógica';
        targetName = targetVal;
      }
      
      if (editingScheduleId) {
        const schedIndex = appState.schedules.findIndex(s => s.id === editingScheduleId);
        if (schedIndex !== -1) {
          appState.schedules[schedIndex].schoolName = schoolName;
          appState.schedules[schedIndex].targetType = targetType;
          appState.schedules[schedIndex].targetName = targetName;
          appState.schedules[schedIndex].className = className;
          appState.schedules[schedIndex].classId = classId;
          appState.schedules[schedIndex].teachers = teachersList;
          appState.schedules[schedIndex].bimester = bimester;
          appState.schedules[schedIndex].plannedDate = plannedDate;
          appState.schedules[schedIndex].plannedTime = plannedTime;
        }
        showToast('Visita atualizada com sucesso!');
      } else {
        const newSched = {
          id: 'sch-' + Date.now(),
          schoolName,
          targetType,
          targetName,
          className,
          classId,
          teachers: teachersList,
          bimester,
          plannedDate,
          plannedTime,
          supervisor: user.name,
          status: 'planejado'
        };
        appState.schedules.unshift(newSched);
        showToast('Visita planejada adicionada ao cronograma!');
      }

      saveState();
      closeAddScheduleModal();
      renderScheduleScreen();
      if (typeof renderHomeScreen === 'function') renderHomeScreen();
    }
```

---

### Passo 3.4: Reestruturação dos Escopos e Resolução de Visitas Pendentes (`getScopedSchedules` e `getActionablePendingSchedules`)

**Arquivo:** `index.html` (e espelhos)  
**Localização:** Por volta das linhas 6851-6885 e 7393-7412.

#### Código de `getScopedSchedules`:
Eliminar a checagem que exigia que o `s.targetName` fosse uma docente individual em `teamMembers`:

```javascript
    function getScopedSchedules() {
      const user = getCurrentUser();
      if (user.roleKey === 'tecnico') {
        return appState.schedules;
      } else if (user.roleKey === 'formador') {
        // Extrai todas as escolas que pertencem ao polo da formadora
        const supervisedSchools = appState.units
          .filter(u => u.polo === user.school)
          .map(u => u.name);
        supervisedSchools.push(user.school);

        return appState.schedules.filter(s => {
          if (!supervisedSchools.includes(s.schoolName)) return false;
          // O Formador acompanha e agenda EXCLUSIVAMENTE Coordenadoras Pedagógicas
          if (s.targetType === 'coordenador') return true;
          const target = (appState.teamMembers || []).find(m => 
            m.name === s.targetName || 
            resolveCanonicalUserName(m.name) === resolveCanonicalUserName(s.targetName)
          );
          return target ? target.roleKey === 'coordenador' : (s.className && s.className.toLowerCase().includes('coord'));
        });
      } else if (user.roleKey === 'coordenador') {
        // A Coordenadora acompanha e agenda EXCLUSIVAMENTE Turmas da sua unidade escolar
        return appState.schedules.filter(s => {
          if (s.schoolName !== user.school) return false;
          // Não exibe agendamentos destinados a coordenadoras
          if (s.targetType === 'coordenador') return false;
          if (s.className && s.className.toLowerCase().includes('coord')) return false;
          return true;
        });
      } else {
        return [];
      }
    }
```

#### Código de `getActionablePendingSchedules`:
As visitas acionáveis da coordenadora são as observações de **TURMAS** da sua escola:

```javascript
    // Retorna exclusivamente visitas pendentes que o usuário ativo tem permissão para iniciar/observar
    function getActionablePendingSchedules() {
      const user = getCurrentUser();
      const scopedSchedules = getScopedSchedules();
      const pending = scopedSchedules.filter(s => s.status !== 'realizado' && !s.archived);

      if (user.roleKey === 'formador') {
        // Formadora observa unicamente Coordenadoras
        return pending.filter(s => {
          if (s.targetType === 'coordenador') return true;
          const tm = (appState.teamMembers || []).find(m => m.name === s.targetName);
          return tm && tm.roleKey === 'coordenador';
        });
      } else if (user.roleKey === 'coordenador') {
        // Coordenadora observa unicamente Turmas da sua unidade
        return pending.filter(s => {
          if (s.schoolName !== user.school) return false;
          if (s.targetType === 'coordenador') return false;
          if (s.className && s.className.toLowerCase().includes('coord')) return false;
          return true;
        });
      }
      return [];
    }
```

---

### Passo 3.5: Redesenho da Exibição do Cronograma e Próxima Visita (`renderScheduleScreen`)

**Arquivo:** `index.html` (e espelhos)  
**Localização:** Por volta das linhas 9964-10255.

#### Hero Card da "PRÓXIMA VISITA":
Exibir a **TURMA** em destaque de 20px com subtítulo da regência titular:

```javascript
          const isClassObs = nextVisit.targetType === 'turma' || (user.roleKey === 'coordenador');
          const heroTitle = isClassObs ? `📚 Turma: ${nextVisit.className || nextVisit.targetName}` : nextVisit.targetName;
          
          let heroSub = '';
          if (isClassObs) {
            const regDisplay = (nextVisit.teachers && nextVisit.teachers.length > 0)
              ? nextVisit.teachers.join(', ')
              : 'Professoras da Turma';
            heroSub = `<span style="font-weight:700; color:var(--primary);">👩‍🏫 Regência Titular:</span> <span>${regDisplay}</span> · <span class="schedule-bimester-tag">${nextVisit.bimester}</span>`;
          } else {
            heroSub = `<span style="font-weight:700; color:var(--primary);">${nextVisit.className || 'Coordenação Pedagógica'}</span> · <span class="schedule-bimester-tag">${nextVisit.bimester}</span>`;
          }

          const canStartVisit = (user.roleKey === 'coordenador' && isClassObs && nextVisit.schoolName === user.school) ||
                                (user.roleKey === 'formador' && !isClassObs);

          const canEditSchedule = (user.roleKey === 'coordenador' && isClassObs && nextVisit.schoolName === user.school) ||
                                  (user.roleKey === 'formador' && !isClassObs) ||
                                  (user.roleKey === 'tecnico');

          highlightContainer.innerHTML = `
            <div class="next-visit-hero-card">
              <div class="next-visit-hero-header">
                <div class="next-visit-title-badge">
                  PRÓXIMA VISITA
                </div>
                <div>${timingBadge}</div>
              </div>

              <div class="next-visit-hero-body">
                <div>
                  <h3 class="next-visit-target-name">${heroTitle}</h3>
                  <div class="next-visit-target-sub">
                    ${heroSub}
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
                    Iniciar Visita da Turma →
                  </button>
                ` : ''}
              </div>
            </div>
          `;
```

#### Tabela Desktop e Cards Mobile do Cronograma:
Garantir destaque da Turma e equipes regentes:

```javascript
        const isClassObs = s.targetType === 'turma' || (!s.className?.toLowerCase().includes('coord') && user.roleKey === 'coordenador');
        const displayTitle = isClassObs ? `📚 ${s.className || s.targetName}` : `📋 ${s.targetName}`;
        const displaySub = isClassObs 
          ? `👩‍🏫 Regência: ${s.teachers && s.teachers.length > 0 ? s.teachers.join(', ') : 'Equipe da Turma'}`
          : (s.className || 'Coordenação Pedagógica');

        // Na Tabela Desktop:
        tr.innerHTML = `
          <td>
            <strong>${displayTitle}</strong> ${nextTagHtml}<br>
            <span style="font-size:11px; color:var(--text-secondary);">${displaySub}</span>
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

        // No Card Mobile:
        card.innerHTML = `
          <div class="schedule-card-header">
            <div>
              <div class="schedule-card-target">
                ${displayTitle}
                ${nextTagHtml}
              </div>
              <div class="schedule-card-class">${displaySub}</div>
            </div>
            <span class="status-badge ${badgeClass}" style="flex-shrink:0;">${badgeText}</span>
          </div>
          ...
        `;
```

---

### Passo 3.6: Atualização dos Cards de Agendamento na Home e no Modal de Iniciar Visita

**Arquivo:** `index.html` (e espelhos)  
**Localização:** Por volta das linhas 7455-7495 (`openSelectScheduledObsModal`) e 9530-9560 (`renderHomeScreen`).

#### Em `openSelectScheduledObsModal`:
```javascript
      pendingSchedules.forEach(s => {
        const isClassObs = s.targetType === 'turma' || user.roleKey === 'coordenador';
        const cardTitle = isClassObs ? `📚 Turma: ${s.className || s.targetName}` : `📋 Coordenadora: ${s.targetName}`;
        const regDisplay = isClassObs 
          ? (s.teachers && s.teachers.length > 0 ? s.teachers.join(', ') : 'Equipe Regente')
          : (s.className || 'Coordenação Pedagógica');

        card.innerHTML = `
          <div style="flex:1;">
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px; flex-wrap:wrap;">
              <span style="font-size:14px; font-weight:800; color:var(--text-primary);">${cardTitle}</span>
              ${badgeHtml}
            </div>
            <div style="font-size:12px; color:var(--text-secondary); line-height:1.4;">
              <strong>Escola:</strong> ${s.schoolName}<br>
              <strong>Bimestre:</strong> <span style="font-weight:700; color:var(--primary);">${s.bimester}</span> · 
              <strong>${isClassObs ? 'Regência Titular' : 'Função'}:</strong> ${regDisplay} · 
              <strong>Horário:</strong> ${s.plannedTime || '08:00'}
            </div>
          </div>
          <div>
            <button class="btn btn-primary" style="white-space:nowrap; padding:7px 12px; font-size:12px; font-weight:700;" onclick="startObsFromScheduledModal('${s.id}')">
              Iniciar Visita →
            </button>
          </div>
        `;
        listContainer.appendChild(card);
      });
```

#### Em `renderHomeScreen`:
```javascript
            pendingSchedules.slice(0, 4).forEach(s => {
              const isClassObs = s.targetType === 'turma' || user.roleKey === 'coordenador';
              const cardTitle = isClassObs ? `📚 Turma: ${s.className || s.targetName}` : `📋 ${s.targetName}`;
              const regDisplay = isClassObs 
                ? (s.teachers && s.teachers.length > 0 ? s.teachers.join(', ') : 'Professoras da Turma')
                : (s.className || 'Coordenação');

              card.innerHTML = `
                <div>
                  <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px;">
                    <strong style="font-size:14px; color:var(--text-primary);">${cardTitle}</strong>
                    ${badgeHtml}
                  </div>
                  <div style="font-size:11px; color:var(--text-secondary); line-height:1.4; margin-bottom:10px;">
                    ${s.schoolName}<br>
                    <span style="font-weight:700; color:var(--primary);">${s.bimester}</span> · ${regDisplay} · ${formatDateBR(s.plannedDate)} às ${s.plannedTime || '08:00'}
                  </div>
                </div>
                <button class="btn btn-primary" style="padding:6px 12px; font-size:11px; font-weight:700; width:100%;" onclick="openSetupScreenFromSchedule('${s.id}')">
                  Iniciar Visita →
                </button>
              `;
              scheduledCardsList.appendChild(card);
            });
```

---

### Passo 3.7: Blindagem Canônica e Integração na Tela de Setup (`openSetupScreen` e `#setupLinkedSchedule`)

**Arquivo:** `index.html` (e espelhos)  
**Localização:** Por volta das linhas 7515-7650.

#### Blindagem de Cargo e Resolução de Vínculo:
```javascript
      // BLINDAGEM CANÔNICA DE CARGO
      if (prefilledSchedule) {
        if (user.roleKey === 'formador') {
          if (prefilledSchedule.targetType === 'turma') {
            showToast('Ação bloqueada: Formadoras acompanham coordenadoras e não realizam observação direta de turmas.');
            navigateToTab('home');
            return;
          }
        }
        if (user.roleKey === 'coordenador') {
          if (prefilledSchedule.targetType === 'coordenador' || prefilledSchedule.schoolName !== user.school) {
            showToast('Ação bloqueada: Coordenadoras avaliam exclusivamente turmas da sua própria unidade escolar.');
            navigateToTab('home');
            return;
          }
        }
      }
```

#### Seletor Rápido de Agendamento no Topo do Setup (`#setupLinkedSchedule`):
```javascript
          pendingSchedules.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.id;
            const isClassObs = s.targetType === 'turma' || user.roleKey === 'coordenador';
            const displayLabel = isClassObs ? `📚 Turma: ${s.className || s.targetName}` : `📋 ${s.targetName}`;
            opt.text = `${displayLabel} (${s.bimester} · ${formatDateBR(s.plannedDate)} · ${s.schoolName})`;
            scheduleSelect.appendChild(opt);
          });
```

#### Pré-preenchimento ao Abrir Setup com Visita Agendada:
```javascript
        if (user.roleKey === 'coordenador') {
          const classSelect = document.getElementById('setupClass');
          const targetClassName = prefilledSchedule.className || prefilledSchedule.targetName;
          if (classSelect && targetClassName) {
            const targetCls = Array.from(classSelect.options).find(opt => 
              opt.value === targetClassName || 
              opt.value.toLowerCase().includes(targetClassName.toLowerCase()) ||
              targetClassName.toLowerCase().includes(opt.value.toLowerCase())
            );
            if (targetCls) {
              classSelect.value = targetCls.value;
            } else {
              classSelect.value = targetClassName;
            }
            onSetupClassChange();
          }
        }
```

---

### Passo 3.8: Atualização do Algoritmo de Auditoria Automatizada (`audit_platform.py` e Interno)

**Arquivo:** `audit_platform.py` e `index.html` (Bateria 8)  
**Localização:** Asserção da Bateria 8 (Cronograma Longitudinal).

#### Ajuste da Asserção:
Atualizar a bateria para verificar que o planejamento de visita da Coordenadora é realizado com `targetType: 'turma'` e com o nome da turma no agendamento, validando que a baixa automática na finalização (`finalizeObservation`) fecha a visita da Turma.

---

### Passo 3.9: Gestão Dupla do Changelog (Versão 0.87 / v7.66) e Salvamento Intermediário

1. Criar cópia intermediária em:
   - `intermediárias/aplicativo_v87_pilar_1_atribuicao_e_agendamento_por_turma.html`
   - `gestor supervisao_patos/intermediárias/aplicativo_v87_pilar_1_atribuicao_e_agendamento_por_turma.html`
2. Atualizar o cabeçalho superior e rodapé de versão em `index.html` para: `📌 Versão 0.87 (v7.66)`.
3. Adicionar o bloco de histórico no modal `#modalChangelog` do `index.html`.
4. Registrar o histórico detalhado da **Versão 0.87** no topo do sumário e no detalhamento integral de `CHANGELOG.md`.

---

## 4. Plano de Verificação e Testes

### 4.1 Baterias de Testes Manuais e Automatizados

| ID | Cenário de Teste | Procedimento | Resultado Esperado |
| :---: | :--- | :--- | :--- |
| **T1** | Agendamento por Coordenadora | Logar como Coordenadora (Mariana) ➔ Acessar Cronograma ➔ Clicar em "+ Planejar Visita". | Rótulo exibe "Turma da Educação Infantil a ser Observada"; o select lista as turmas da unidade com badge de turno e painel com as professoras regentes titulares. |
| **T2** | Sugestão Automática de Bimestre na Turma | Selecionar uma turma no modal de agendamento (ex: "Infantil I - Turma A"). | O select `#scheduleBimester` sugere automaticamente o próximo bimestre longitudinal da **TURMA** via `autoSelectNextEligibleBimesterForClass`. |
| **T3** | Gravação no Cronograma | Preencher data/horário e salvar. | O agendamento é salvo com `targetType: 'turma'`, `className: 'Infantil I - Turma A'`, `targetName: 'Infantil I - Turma A'`, com as docentes regentes vinculadas. |
| **T4** | Hero Card de "Próxima Visita" | Abrir a aba Cronograma. | O Hero card exibe em destaque: `📚 Turma: Infantil I - Turma A`, com subtítulo `👩‍🏫 Regência Titular: Ana Carolina Silva, Juliana Roberta Rocha`. |
| **T5** | Iniciar Visita a partir do Hero Card | Clicar em "Iniciar Visita da Turma →" no Hero card. | Abre a tela `#screenSetup` com a turma pré-selecionada, card de regentes preenchido, bimestre vinculado e sem erros de blindagem. |
| **T6** | Modal de Seleção de Visitas Pendentes | Na Home, clicar em "Nova Observação Pedagógica". | O modal `#modalSelectScheduledObs` abre listando as visitas com a **TURMA** em destaque de 14px bold e equipe regente no subtítulo. |
| **T7** | Preservação do Fluxo de Formadora | Logar como Formadora ➔ Agendar visita. | Permanece inalterado: label indica "Coordenadora Pedagógica a ser Acompanhada", listando coordenadoras nominais. |
| **T8** | Auditoria Modular Completa | Executar `python3 audit_platform.py` no terminal. | 100% de aprovação em todas as baterias (10/10 PASS). |

---

## 5. Critérios de Sucesso e Não-Regressão

- [ ] Nenhuma menção a "Profissional" ou seleção de professora isolada no agendamento de Coordenadoras Pedagógicas.
- [ ] A **TURMA** é a entidade central e primária em: agendamento, hero card da próxima visita, tabela do cronograma, cards mobile, cards da tela inicial e modal de seleção prévia.
- [ ] O fluxo de Formadoras permanece 100% preservado (Pilar 2 intacto).
- [ ] Observações e agendamentos legados continuam operacionais através do saneador em `loadState()`.
- [ ] Sincronização uniforme dos 3 arquivos de entrada (`index.html`, `gestor supervisao_patos/index.html` e `firebase_deploy/public/index.html`).
- [ ] Deploy automático realizado com sucesso no GitHub Pages após o push.
