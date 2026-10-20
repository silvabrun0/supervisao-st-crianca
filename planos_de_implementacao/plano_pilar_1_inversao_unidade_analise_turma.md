# PLANO DE IMPLEMENTAÇÃO: PILAR 1 - INVERSÃO DA UNIDADE DE ANÁLISE PARA A TURMA

> **DIRETRIZ OBRIGATÓRIA DE EXECUÇÃO (ETAPA 2):**
> O assistente executor (Etapa 2) deve **obrigatoriamente ler e seguir as diretrizes dos arquivos `WORKFLOW_MACOS.md` e `AGENTS.md`** localizados na raiz do projeto antes de aplicar qualquer modificação no código. Nenhuma modificação deve ser realizada sem conformidade estrita com o workflow, incluindo:
> 1. Execução prévia de sincronização com o repositório remoto (`git pull origin main`).
> 2. Preservação integral das regras de negócio existentes e blindagens de segurança.
> 3. Verificação de integridade pós-edição com dupla checagem de leitura em cada trecho modificado.
> 4. Salvamento obrigatório do backup intermediário na pasta `intermediárias/` sob o nome `aplicativo_v85_pilar_1_inversao_unidade_analise_turma.html` (e espelho na subpasta de intermediárias).
> 5. Gestão dupla de Changelog no arquivo `CHANGELOG.md` e no modal `#modalChangelog` do `index.html`, atualizando para a **Versão 0.85 (v7.64)**.
> 6. Sincronização idêntica entre o arquivo principal `index.html` da raiz, `gestor supervisao_patos/index.html` e `gestor supervisao_patos/firebase_deploy/public/index.html`.
> 7. Checagem pré-push (`git fetch origin main`), commit semântico (`feat: implementar pilar 1 - inversao da unidade de analise para a turma`), push para `origin main` e deploy automático no Firebase Hosting (`firebase deploy`).

---

## 1. Diagnóstico e Contexto

### 1.1 Cenário Atual
Atualmente, o Sistema de Supervisão Pedagógica está centrado no profissional individual (docente isolado). Ao iniciar uma observação na tela `#screenSetup`, a Coordenadora Pedagógica é obrigada a selecionar uma professora nominal específica (`#setupTargetPerson`), sendo o campo de turma (`#setupClass`) um mero metadado secundário estático (com 6 opções pré-fixadas de Berçário a Infantil II).

Além disso:
- A trava de duplo lançamento (`existingObs`) e a trava de sequência longitudinal dos bimestres (`getNextEligibleBimester` e `BIMESTERS_SEQUENCE`) são construídas estritamente sobre a chave nominal da professora (`o.teacherName`).
- No Cronograma (`#screenSchedule`), no Histórico (`#screenHistory`), nos Rascunhos da Home (`#screenHome`) e na barra superior da Observação Ativa (`#screenActiveObs`), o título e o sujeito principal da ação são a professora individual.
- Na aba de Indicadores (`#screenIndicators`), a métrica de cobertura avalia apenas docentes isoladas, desconsiderando a cobertura de turmas atendidas na unidade escolar.

### 1.2 Fundamentação Técnico-Pedagógica (Documento de Insights / Reunião de 19/10/2026)
Conforme deliberado na reunião oficial da equipe SerTão Criança (*Carolina Machado, Diogo Dias Furtado, Bruno Pereira da Silva e Julia Cordoba*):
- **Realidade das Creches e Pré-escolas de Patos:** Unidades de grande porte (como a Creche Cremilde/Rossvânia, com 38 professores) tornam inviável e pedagógica e operacionalmente contraproducente a aplicação de formulários individuais completos por professor.
- **Inexistência de Professor Auxiliar:** Em Patos/PB, **não existe professor auxiliar**. As turmas são conduzidas por **duplas de professores regentes titulares** no período parcial e **quartetos de professores titulares** no período integral.
- **Foco na Aprendizagem e na Experiência da Criança:** O objetivo primordial da supervisão pedagógica é diagnosticar o que a criança está vivenciando na rotina escolar (mediação de leitura, interações, autonomia, arranjo espacial e materiais). A unidade que vivencia essa rotina de forma contínua é a **TURMA**.
- **Continuidade Pedagógica:** Mesmo em eventuais faltas, licenças ou substituições pontuais de docentes no dia da visita, a série histórica longitudinal deve acompanhar a evolução da **TURMA** ao longo do 1º, 2º, 3º e 4º Bimestres.

### 1.3 Resultado Esperado com o Pilar 1
1. **Turma como Unidade Primária de Observação:**
   - Para a Coordenadora Pedagógica, o formulário de observação passa a ser aberto para a **TURMA**.
   - O sistema puxa automaticamente as turmas cadastradas na unidade escolar (`appState.classes` / `INITIAL_CLASSES`) com suas características (nome, etapa, turno e equipe de regência titular).
2. **Exibição Clara da Equipe Regente Titular:**
   - Ao selecionar a turma na tela de configuração (`#screenSetup`), o sistema exibe um card/painel visual com as **Docentes Regentes Titulares** vinculadas à turma, valorizando o planejamento coletivo.
3. **Reestruturação das Travas de Negócio por TURMA:**
   - **Duplo Lançamento:** O sistema impede que a mesma turma receba mais de uma observação no mesmo bimestre na unidade escolar.
   - **Ciclo Longitudinal:** O avanço bimestral (1º ➔ 2º ➔ 3º ➔ 4º Bimestre) passa a ser controlado e validado por **TURMA**.
4. **Alinhamento da Interface e da Série Histórica:**
   - Header da observação ativa, síntese final, cartões de rascunho na tela inicial e registros do histórico passam a identificar a **TURMA** em primeiro plano tipográfico, mantendo a listagem das professoras regentes no subtítulo.
5. **Cobertura de Turmas na Aba de Indicadores:**
   - Na linha de KPIs decisórios, a métrica de cobertura passa a calcular a **Cobertura de Turmas** (% de turmas da escola com observação finalizada no bimestre).
6. **Total Retrocompatibilidade (Zero Breaking Changes):**
   - Para Formadoras acompanhando Coordenadoras Pedagógicas, o fluxo permanece inalterado (`evaluatedType: 'coordenador'`).
   - Observações legadas já existentes no `localStorage` continuarão funcionando normalmente através de camadas transparentes de fallback.

---

## 2. Arquitetura e Pontos de Impacto

### 2.1 Arquivos Afetados
- `index.html` (Arquivo principal na raiz)
- `gestor supervisao_patos/index.html` (Espelho de desenvolvimento)
- `gestor supervisao_patos/firebase_deploy/public/index.html` (Arquivo de produção Firebase)
- `gestor supervisao_patos/CHANGELOG.md` (Registro da Versão 0.85 / v7.64)
- `intermediárias/aplicativo_v85_pilar_1_inversao_unidade_analise_turma.html` (Backup intermediário obrigatório)

### 2.2 Estruturas de Dados Envolvidas
1. **Nova Coleção Canônica `INITIAL_CLASSES` e `appState.classes`:**
   ```javascript
   {
     id: 'cls-001',
     name: 'Infantil I - Turma A',
     school: 'CEI Professora Maria de Lourdes',
     stage: 'Infantil I',
     shift: 'Parcial Matutino', // 'Parcial Matutino', 'Parcial Vespertino', 'Integral'
     teachers: ['Ana Carolina Silva', 'Juliana Roberta Rocha'] // Docentes regentes titulares
   }
   ```
2. **Objeto de Observação (`newObs` / `appState.currentObs`):**
   - Inclusão dos campos:
     - `evaluatedType: 'turma'` (quando coordenadora avalia) ou `'coordenador'` (quando formadora avalia).
     - `classId`: ID único da turma observada.
     - `className`: Nome canônico da turma (ex: `Infantil I - Turma A`).
     - `classShift`: Jornada da turma (`Parcial Matutino`, `Parcial Vespertino` ou `Integral`).
     - `teachers`: Array contendo os nomes das professoras regentes titulares vinculadas.
     - `teacherName`: String concatenada com os nomes das docentes (ex: `Ana Carolina Silva e Juliana Roberta Rocha`) para compatibilidade com rotinas legadas de busca, exportação e impressão.

### 2.3 Funções e Módulos JavaScript Impactados
| Módulo / Função | Responsabilidade Atual | Nova Responsabilidade no Pilar 1 |
| :--- | :--- | :--- |
| `INITIAL_CLASSES` / `loadState()` | Inexistente (turmas eram strings isoladas). | Define catálogo canônico de turmas, migração resiliente e persistência no `localStorage`. |
| `getClassesForSchool(schoolName)` | Inexistente. | Retorna a lista de turmas da escola com auto-criação a partir de docentes cadastradas. |
| `openSetupScreen(prefilledSchedule)` | Carrega escolas e lista de professoras nominais. | Se coordenadora, prioriza a seleção de **TURMA** da unidade e popula o card de docentes regentes. |
| `onSetupClassChange()` | Inexistente (mudança de turma era passiva). | Atualiza o painel de docentes titulares e calcula o próximo bimestre longitudinal da **TURMA**. |
| `getNextEligibleBimesterForClass()` | Inexistente (só havia para docente individual). | Calcula o próximo bimestre pendente na sequência longitudinal da **TURMA**. |
| `startNewObservation()` | Valida professor e bloqueia duplo lançamento por professor. | Valida a turma, bloqueia duplo lançamento por **TURMA** e registra regência coletiva. |
| `renderActiveObsScreen()` | Exibe nome da professora no título principal. | Exibe a **TURMA** no título e as docentes regentes titulares no subtítulo. |
| `renderSynthesisScreen()` | Exibe dados nominais da professora. | Exibe badge de Turma e dados consolidados da regência titular. |
| `getScopedObservations()` | Filtrava apenas por `obs.teacherName === member.name`. | Suporta observações com `evaluatedType === 'turma'`, validando escopo pela escola/polo. |
| `renderHomeScreen()` & `renderHistoryScreen()` | Cards exibiam professora em destaque. | Cards exibem a **TURMA** em destaque com subtítulo de professoras regentes titulares. |
| `renderScheduleScreen()` / `openAddScheduleModal()` | Agendamento nominal de professora. | Coordenadora agenda observação da **TURMA** com equipe regente vinculada. |
| `renderIndicatorsScreen()` | Calcula cobertura de docentes individuais. | Calcula **Cobertura de Turmas** no escopo e permite afunilamento por Turma. |

---

## 3. Especificação Passo a Passo de Código

### Passo 3.1: Definição do Catálogo Canônico de Turmas e Inicialização de Estado

**Arquivo:** `index.html` (e espelhos)  
**Localização:** Imediatamente antes de `const INITIAL_UNITS` (por volta da linha 6045).

#### Código a Inserir:
```javascript
    // --- 1.2 CATÁLOGO CANÔNICO DE TURMAS DA REDE MUNICIPAL (PILAR 1) ---
    const INITIAL_CLASSES = [
      {
        id: 'cls-pml-01',
        name: 'Infantil I - Turma A',
        school: 'CEI Professora Maria de Lourdes',
        stage: 'Infantil I',
        shift: 'Parcial Matutino',
        teachers: ['Ana Carolina Silva', 'Juliana Roberta Rocha']
      },
      {
        id: 'cls-pml-02',
        name: 'Berçário II - Turma Única',
        school: 'CEI Professora Maria de Lourdes',
        stage: 'Berçário II',
        shift: 'Parcial Matutino',
        teachers: ['Carla Beatriz Mendes']
      },
      {
        id: 'cls-pml-03',
        name: 'Infantil II - Turma B',
        school: 'CEI Professora Maria de Lourdes',
        stage: 'Infantil II',
        shift: 'Parcial Vespertino',
        teachers: ['Juliana Roberta Rocha']
      },
      {
        id: 'cls-pp-01',
        name: 'Maternal I - Turma A',
        school: 'EMEI Pequeno Príncipe',
        stage: 'Maternal I',
        shift: 'Parcial Matutino',
        teachers: ['Fernanda Lima']
      },
      {
        id: 'cls-pp-02',
        name: 'Infantil I - Turma B',
        school: 'EMEI Pequeno Príncipe',
        stage: 'Infantil I',
        shift: 'Parcial Vespertino',
        teachers: ['Fernanda Lima']
      },
      {
        id: 'cls-vz-01',
        name: 'Maternal II - Turma Única',
        school: 'CEI Vovó Zezé',
        stage: 'Maternal II',
        shift: 'Integral',
        teachers: []
      }
    ];

    // Helper de Resolução e Resiliência de Turmas por Unidade Escolar
    function getClassesForSchool(schoolName) {
      if (!appState.classes || !Array.isArray(appState.classes)) {
        appState.classes = JSON.parse(JSON.stringify(INITIAL_CLASSES));
      }
      let schoolClasses = appState.classes.filter(c => c.school === schoolName);

      // Resiliência transparente: se a escola não possuir turmas cadastradas explicitamente,
      // gera agrupamentos a partir das professoras vinculadas à unidade em teamMembers
      if (schoolClasses.length === 0) {
        const teachersInSchool = (appState.teamMembers || []).filter(m => m.school === schoolName && m.roleKey === 'professora');
        const groups = {};
        teachersInSchool.forEach(t => {
          const groupName = t.classAssigned || 'Infantil I - Turma A';
          if (!groups[groupName]) groups[groupName] = [];
          groups[groupName].push(t.name);
        });

        Object.keys(groups).forEach((grpName, idx) => {
          const autoCls = {
            id: 'cls-auto-' + Date.now() + '-' + idx,
            name: grpName,
            school: schoolName,
            stage: grpName.includes('Berçário') ? 'Berçário' : grpName.includes('Maternal') ? 'Maternal' : 'Infantil I',
            shift: 'Parcial Matutino',
            teachers: groups[grpName]
          };
          appState.classes.push(autoCls);
          schoolClasses.push(autoCls);
        });
      }

      // Se ainda assim não houver turmas (escola vazia), fornece agrupamentos padrão da Educação Infantil
      if (schoolClasses.length === 0) {
        const defaultStages = [
          { name: 'Infantil I - Turma A', stage: 'Infantil I' },
          { name: 'Infantil II - Turma A', stage: 'Infantil II' },
          { name: 'Maternal I - Turma A', stage: 'Maternal I' },
          { name: 'Berçário II - Turma Única', stage: 'Berçário II' }
        ];
        defaultStages.forEach((st, idx) => {
          const autoCls = {
            id: 'cls-def-' + Date.now() + '-' + idx,
            name: st.name,
            school: schoolName,
            stage: st.stage,
            shift: 'Parcial Matutino',
            teachers: []
          };
          appState.classes.push(autoCls);
          schoolClasses.push(autoCls);
        });
      }

      return schoolClasses;
    }
```

---

### Passo 3.2: Integração de `appState.classes` no Estado Global e no `loadState()`

**Arquivo:** `index.html`  
**Localização:** Na inicialização de `let appState` (por volta da linha 6155) e dentro de `loadState()`.

#### Substituição em `let appState`:
```javascript
    let appState = {
      currentUserKey: 'mariana',
      activeSectionsTeacher: JSON.parse(JSON.stringify(DEFAULT_SECTIONS_TEACHER)),
      activeSectionsCoordinator: JSON.parse(JSON.stringify(DEFAULT_SECTIONS_COORDINATOR)),
      units: JSON.parse(JSON.stringify(INITIAL_UNITS)),
      classes: JSON.parse(JSON.stringify(INITIAL_CLASSES)), // <-- PILAR 1: CATÁLOGO DE TURMAS
      teamMembers: JSON.parse(JSON.stringify(INITIAL_TEAM)),
      notes: JSON.parse(JSON.stringify(INITIAL_NOTES)),
      schedules: JSON.parse(JSON.stringify(INITIAL_SCHEDULES)),
      observations: [],
      currentObs: null,
      activeTabIndex: 0,
      isReadOnly: false,
      historyFilter: 'drafts',
      uploadTargetCritId: null,
      expandedDrilldowns: {}
    };
```

#### Inclusão dentro de `loadState()` (logo após `if (!appState.units ...)`):
```javascript
          if (!appState.classes || appState.classes.length === 0) {
            appState.classes = JSON.parse(JSON.stringify(INITIAL_CLASSES));
          }
```

---

### Passo 3.3: Reestruturação Visual da Tela de Configuração (`#screenSetup`)

**Arquivo:** `index.html`  
**Localização:** Dentro de `<section id="screenSetup" class="app-screen">` (por volta da linha 2845 a 2865).

#### Substituir o bloco dos campos `#groupSetupTargetPerson` e `#groupSetupClass` por:

```html
          <!-- Bloco do Alvo da Observação Pedagógica (Turma vs Coordenadora) -->
          <div class="form-group" id="groupSetupClass">
            <label class="form-label" style="font-weight:700; color:var(--primary-dark);">
              Turma / Agrupamento de Educação Infantil Observada
            </label>
            <select id="setupClass" class="form-select" onchange="onSetupClassChange()" style="font-weight:600; font-size:14px; border-color:var(--primary);">
              <!-- Preenchido dinamicamente com as turmas da Unidade Escolar -->
            </select>
          </div>

          <!-- Card Dinâmico com a Equipe de Docentes Regentes Titulares da Turma (Pilar 1) -->
          <div id="groupSetupTeachersCard" style="display:none; background:#F0F7FF; border:1px solid #BFDBFE; border-left:5px solid #2563EB; border-radius:10px; padding:14px; margin-bottom:18px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <span style="font-size:11px; font-weight:800; text-transform:uppercase; color:#1D4ED8; letter-spacing:0.5px;">
                👩‍🏫 Equipe de Regência Titular da Turma
              </span>
              <span id="setupClassShiftBadge" style="font-size:10px; font-weight:700; background:#DBEAFE; color:#1E40AF; padding:2px 8px; border-radius:12px;">
                Parcial Matutino
              </span>
            </div>
            <div id="setupClassTeachersList" style="display:flex; flex-wrap:wrap; gap:8px; margin-top:8px;">
              <!-- Badges dinâmicos das docentes -->
            </div>
            <div style="font-size:11px; color:#475569; margin-top:10px; line-height:1.4;">
              💡 <em>Em Patos, as turmas contam com duplas ou quartetos de professoras regentes titulares. A supervisão pedagógica analisa a rotina, o ambiente educativo e as oportunidades de aprendizagem recebidas pelas crianças na turma.</em>
            </div>
          </div>

          <!-- Seletor Exclusivo de Coordenadora Avaliada (Utilizado apenas por Formadoras) -->
          <div class="form-group" id="groupSetupTargetPerson" style="display:none;">
            <label class="form-label" id="setupTargetPersonLabel">Coordenadora Pedagógica Acompanhada</label>
            <select id="setupTargetPerson" class="form-select" onchange="onSetupTeacherChange()">
              <!-- Dynamic options -->
            </select>
          </div>
```

---

### Passo 3.4: Reestruturação da Lógica JS de Abertura do Setup (`openSetupScreen` e `onSetupClassChange`)

**Arquivo:** `index.html`  
**Localização:** Substituir as funções `openSetupScreen` e `onSetupSchoolChange` e criar `onSetupClassChange` (por volta da linha 7325 a 7520).

#### Código a Implementar:
```javascript
    function openSetupScreen(prefilledSchedule = null) {
      const user = getCurrentUser();

      // BLINDAGEM CANÔNICA DE CARGO
      if (prefilledSchedule) {
        const targetMember = (appState.teamMembers || []).find(m => m.name === prefilledSchedule.targetName);
        if (user.roleKey === 'formador' && targetMember && targetMember.roleKey === 'professora') {
          showToast('Ação bloqueada: Formadoras acompanham coordenadoras e não realizam observação direta de professoras.');
          navigateToTab('home');
          return;
        }
        if (user.roleKey === 'coordenador' && targetMember && targetMember.roleKey !== 'professora') {
          showToast('Ação bloqueada: Coordenadoras avaliam exclusivamente turmas e professoras da unidade escolar.');
          navigateToTab('home');
          return;
        }
      }

      document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));
      document.getElementById('screenSetup').classList.add('active');

      const roWarning = document.getElementById('readOnlyWarning');
      if (roWarning) roWarning.style.display = 'none';
      appState.isReadOnly = false;

      appState.currentSetupScheduleId = prefilledSchedule ? prefilledSchedule.id : null;

      const titleEl = document.getElementById('setupScreenTitle');
      const hintEl = document.getElementById('setupRoleHint');
      const schoolSelect = document.getElementById('setupSchool');
      const classGroup = document.getElementById('groupSetupClass');
      const teachersCard = document.getElementById('groupSetupTeachersCard');
      const targetGroup = document.getElementById('groupSetupTargetPerson');
      const targetLabel = document.getElementById('setupTargetPersonLabel');

      schoolSelect.innerHTML = '';

      if (user.roleKey === 'coordenador') {
        titleEl.innerText = 'Nova Observação Pedagógica da Turma';
        if (hintEl) {
          hintEl.style.display = 'block';
          hintEl.innerHTML = `<strong>Unidade de Análise: TURMA</strong> · Você está avaliando a rotina pedagógica na unidade <strong>${user.school}</strong>. O instrumento analisa as experiências das crianças e a atuação articulada das professoras regentes.`;
        }
        classGroup.style.display = 'block';
        teachersCard.style.display = 'block';
        targetGroup.style.display = 'none';

        const opt = document.createElement('option');
        opt.value = user.school;
        opt.text = user.school;
        schoolSelect.appendChild(opt);
        schoolSelect.disabled = true;

      } else if (user.roleKey === 'formador') {
        titleEl.innerText = 'Acompanhamento Formativo da Coordenação';
        if (hintEl) {
          hintEl.innerText = '';
          hintEl.style.display = 'none';
        }
        classGroup.style.display = 'none';
        teachersCard.style.display = 'none';
        targetGroup.style.display = 'block';
        targetLabel.innerText = 'Coordenadora Pedagógica Avaliada';
        schoolSelect.disabled = false;

        const poloUnits = (appState.units || []).filter(u => u.polo === user.school).map(u => u.name);
        const supervisedCoords = (appState.teamMembers || []).filter(m => m.roleKey === 'coordenador' && (m.supervisor === user.name || poloUnits.includes(m.school)));
        const availableSchools = Array.from(new Set([...poloUnits, ...supervisedCoords.map(c => c.school)])).filter(Boolean);

        if (availableSchools.length === 0) {
          (appState.units || []).forEach(u => availableSchools.push(u.name));
        }

        availableSchools.forEach(s => {
          const opt = document.createElement('option');
          opt.value = s;
          opt.text = s;
          schoolSelect.appendChild(opt);
        });
      }

      onSetupSchoolChange();

      const todayStr = getTodayDateString();
      const setupDateEl = document.getElementById('setupDate');
      if (setupDateEl) {
        setupDateEl.max = todayStr;
        setupDateEl.value = todayStr;
      }

      // Se houver visita do cronograma vinculada
      if (prefilledSchedule) {
        if (prefilledSchedule.schoolName) schoolSelect.value = prefilledSchedule.schoolName;
        onSetupSchoolChange();

        if (user.roleKey === 'coordenador') {
          const classSelect = document.getElementById('setupClass');
          if (classSelect && prefilledSchedule.className) {
            classSelect.value = prefilledSchedule.className;
            onSetupClassChange();
          }
        } else {
          const targetSelect = document.getElementById('setupTargetPerson');
          if (targetSelect && prefilledSchedule.targetName) {
            targetSelect.value = prefilledSchedule.targetName;
            onSetupTeacherChange();
          }
        }

        if (prefilledSchedule.bimester) {
          const bimSelect = document.getElementById('setupBimester');
          if (bimSelect) bimSelect.value = prefilledSchedule.bimester;
        }
      }

      validateSetupDateUI();
      updateSetupBimesterValidationUI();
    }

    function onSetupSchoolChange() {
      const user = getCurrentUser();
      const schoolName = document.getElementById('setupSchool').value;

      if (user.roleKey === 'coordenador') {
        // Popula o seletor de TURMAS da Unidade Escolar
        const classSelect = document.getElementById('setupClass');
        classSelect.innerHTML = '';

        const schoolClasses = getClassesForSchool(schoolName);
        schoolClasses.forEach(cls => {
          const opt = document.createElement('option');
          opt.value = cls.name;
          const teacherCount = cls.teachers ? cls.teachers.length : 0;
          const teacherText = teacherCount > 0 ? ` (${teacherCount} regente${teacherCount > 1 ? 's' : ''})` : ' (Sem regente atribuída)';
          opt.text = `${cls.name} · ${cls.shift || 'Parcial'}${teacherText}`;
          classSelect.appendChild(opt);
        });

        onSetupClassChange();

      } else if (user.roleKey === 'formador') {
        const targetSelect = document.getElementById('setupTargetPerson');
        targetSelect.innerHTML = '';

        let candidates = appState.teamMembers.filter(m => m.roleKey === 'coordenador' && m.school === schoolName);
        candidates = candidates.filter(m => m.name !== user.name);

        if (candidates.length === 0) {
          const opt = document.createElement('option');
          opt.value = '';
          opt.text = 'Nenhuma coordenadora disponível nesta unidade';
          targetSelect.appendChild(opt);
          return;
        }

        candidates.forEach(t => {
          const opt = document.createElement('option');
          opt.value = t.name;
          opt.text = `${t.name} (${t.roleTitle || 'Coordenadora Pedagógica'})`;
          targetSelect.appendChild(opt);
        });

        onSetupTeacherChange();
      }
    }

    function onSetupClassChange() {
      const user = getCurrentUser();
      const schoolName = document.getElementById('setupSchool').value;
      const classSelect = document.getElementById('setupClass');
      if (!classSelect) return;
      const className = classSelect.value;

      const schoolClasses = getClassesForSchool(schoolName);
      const targetClass = schoolClasses.find(c => c.name === className);

      const shiftBadge = document.getElementById('setupClassShiftBadge');
      const teachersListEl = document.getElementById('setupClassTeachersList');

      if (targetClass) {
        if (shiftBadge) shiftBadge.innerText = targetClass.shift || 'Tempo Parcial';
        if (teachersListEl) {
          teachersListEl.innerHTML = '';
          const teachers = targetClass.teachers || [];
          if (teachers.length === 0) {
            teachersListEl.innerHTML = '<span style="font-size:12px; color:#DC2626; font-style:italic;">⚠️ Nenhuma professora regente vinculada no cadastro desta turma.</span>';
          } else {
            teachers.forEach(tName => {
              const pill = document.createElement('div');
              pill.style.cssText = 'background:#FFFFFF; border:1px solid #BFDBFE; border-radius:20px; padding:4px 12px; font-size:12px; font-weight:700; color:#1E40AF; display:inline-flex; align-items:center; gap:6px; box-shadow:0 1px 2px rgba(0,0,0,0.05);';
              pill.innerHTML = `<span>👩‍🏫</span> <span>${tName}</span> <span style="font-size:10px; background:#EFF6FF; color:#2563EB; padding:1px 6px; border-radius:10px;">Regente Titular</span>`;
              teachersListEl.appendChild(pill);
            });
          }
        }
      }

      // Sugere automaticamente o próximo bimestre longitudinal da TURMA
      autoSelectNextEligibleBimesterForClass(className, schoolName);
      updateSetupBimesterValidationUI();
    }
```

---

### Passo 3.5: Cálculo e Validação Longitudinal por TURMA

**Arquivo:** `index.html`  
**Localização:** Inserir após a função `onSetupClassChange()` (por volta da linha 7550).

#### Código a Implementar:
```javascript
    // PILAR 1: Retorna o próximo bimestre necessário no ciclo longitudinal da TURMA
    function getNextEligibleBimesterForClass(className, schoolName) {
      const BIMESTERS = ['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre'];
      if (!className) return '1º Bimestre';
      const cleanClass = className.trim().toLowerCase();
      const cleanSchool = (schoolName || '').trim().toLowerCase();

      for (let i = 0; i < BIMESTERS.length; i++) {
        const bim = BIMESTERS[i];
        const bimNum = bim.match(/([1-4])/)[1];

        // Verifica se a TURMA já possui observação avaliada (finalizada) neste bimestre
        const hasFinalized = (appState.observations || []).some(o => {
          if (!o.className || o.className.trim().toLowerCase() !== cleanClass) return false;
          if (cleanSchool && o.schoolName && o.schoolName.trim().toLowerCase() !== cleanSchool) return false;
          const obsBimNum = (o.bimester || '').match(/([1-4])/);
          if (!obsBimNum || obsBimNum[1] !== bimNum) return false;
          return o.status === 'finalized' || o.status === 'concluida';
        });

        // Se este bimestre ainda não foi concluído para esta turma, ele é o próximo necessário!
        if (!hasFinalized) {
          return bim;
        }
      }
      return '4º Bimestre';
    }

    function autoSelectNextEligibleBimesterForClass(className, schoolName, selectId = 'setupBimester') {
      const bimesterSelect = document.getElementById(selectId);
      if (!bimesterSelect) return;
      bimesterSelect.value = getNextEligibleBimesterForClass(className, schoolName);
    }
```

---

### Passo 3.6: Atualização da Inicialização da Observação (`startNewObservation`)

**Arquivo:** `index.html`  
**Localização:** Substituir o início de `startNewObservation()` (por volta da linha 7632 a 7746).

#### Código a Implementar:
```javascript
    function startNewObservation() {
      const user = getCurrentUser();
      const schoolSelect = document.getElementById('setupSchool');
      const schoolName = schoolSelect.value;
      const bimester = document.getElementById('setupBimester').value;
      const todayStr = getTodayDateString();
      const currentNowTime = getNowTimeString();

      const dateEl = document.getElementById('setupDate');
      const startEl = document.getElementById('setupStartTime');
      const endEl = document.getElementById('setupEndTime');

      if (dateEl) dateEl.value = todayStr;
      if (startEl) startEl.value = currentNowTime;
      if (endEl) endEl.value = '';

      let className = '';
      let targetClassObj = null;
      let teachersList = [];
      let teacherName = '';

      const bimNumMatch = bimester.match(/([1-4])/);
      const curBimNum = bimNumMatch ? bimNumMatch[1] : '1';
      const BIMESTERS_SEQUENCE = ['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre'];
      const bimIndex = BIMESTERS_SEQUENCE.findIndex(b => (b.match(/([1-4])/) || [])[1] === curBimNum);

      if (user.roleKey === 'coordenador') {
        const classSelect = document.getElementById('setupClass');
        className = classSelect ? classSelect.value : '';
        if (!className) {
          showToast('Selecione a turma da Educação Infantil a ser observada.');
          return;
        }

        const schoolClasses = getClassesForSchool(schoolName);
        targetClassObj = schoolClasses.find(c => c.name === className);
        teachersList = targetClassObj?.teachers || [];
        teacherName = teachersList.length > 0 ? teachersList.join(', ') : 'Professoras da Turma';

        // 1. Bloqueio rigoroso de duplo lançamento para a MESMA TURMA no mesmo bimestre
        const cleanClass = className.trim().toLowerCase();
        const existingObs = (appState.observations || []).find(o => {
          if (!o.className || o.className.trim().toLowerCase() !== cleanClass) return false;
          if (o.schoolName && o.schoolName.trim().toLowerCase() !== schoolName.trim().toLowerCase()) return false;
          const obsBimNum = (o.bimester || '').match(/([1-4])/);
          if (!obsBimNum || obsBimNum[1] !== curBimNum) return false;
          return o.status !== 'archived';
        });

        if (existingObs) {
          showToast(`Ação bloqueada: Já existe uma observação (rascunho ou finalizada) para a turma ${className} no ${bimester}.`);
          return;
        }

        // 2. Bloqueio rigoroso de sequência longitudinal dos bimestres para a TURMA
        if (bimIndex > 0) {
          const prevBim = BIMESTERS_SEQUENCE[bimIndex - 1];
          const prevBimNum = prevBim.match(/([1-4])/)[1];

          const hasPrevFinalized = (appState.observations || []).some(o => {
            if (!o.className || o.className.trim().toLowerCase() !== cleanClass) return false;
            if (o.schoolName && o.schoolName.trim().toLowerCase() !== schoolName.trim().toLowerCase()) return false;
            const obsBimNum = (o.bimester || '').match(/([1-4])/);
            if (!obsBimNum || obsBimNum[1] !== prevBimNum) return false;
            return o.status === 'finalized' || o.status === 'concluida';
          });

          if (!hasPrevFinalized) {
            const hasPrevDraft = (appState.observations || []).some(o => {
              if (!o.className || o.className.trim().toLowerCase() !== cleanClass) return false;
              if (o.schoolName && o.schoolName.trim().toLowerCase() !== schoolName.trim().toLowerCase()) return false;
              const obsBimNum = (o.bimester || '').match(/([1-4])/);
              if (!obsBimNum || obsBimNum[1] !== prevBimNum) return false;
              return o.status === 'draft';
            });

            if (hasPrevDraft) {
              showToast(`Ação bloqueada: A observação da turma ${className} no ${prevBim} ainda está em rascunho. Conclua-a antes de iniciar o ${bimester}.`);
            } else {
              showToast(`Ação bloqueada: A turma ${className} não possui observação concluída no ${prevBim}. O ciclo longitudinal exige que os bimestres ocorram em sequência.`);
            }
            return;
          }
        }

      } else {
        // FLUXO DE FORMADORA ACOMPANHANDO COORDENADORA
        teacherName = document.getElementById('setupTargetPerson').value;
        className = 'Coordenação Pedagógica';

        if (!teacherName) {
          showToast('Nenhuma coordenadora disponível para avaliação neste escopo.');
          return;
        }
        if (teacherName === user.name) {
          showToast('Não é permitido realizar autoavaliação.');
          return;
        }

        const cleanTarget = teacherName.trim().toLowerCase();
        const existingObs = (appState.observations || []).find(o => {
          if (!o.teacherName || o.teacherName.trim().toLowerCase() !== cleanTarget) return false;
          const obsBimNum = (o.bimester || '').match(/([1-4])/);
          if (!obsBimNum || obsBimNum[1] !== curBimNum) return false;
          return o.status !== 'archived';
        });
        if (existingObs) {
          showToast(`Ação bloqueada: Já existe um acompanhamento para ${teacherName} no ${bimester}.`);
          return;
        }
      }

      const newObs = {
        id: 'obs-' + Date.now(),
        scheduleId: appState.currentSetupScheduleId || null,
        evaluatedType: user.roleKey === 'coordenador' ? 'turma' : 'coordenador',
        unitOfAnalysis: user.roleKey === 'coordenador' ? 'turma' : 'coordenador',
        classId: targetClassObj?.id || null,
        className: className,
        classShift: targetClassObj?.shift || 'Parcial Matutino',
        teachers: teachersList,
        teacherName: teacherName, // Mantido para compatibilidade retroativa
        schoolName: schoolName,
        evaluatedBy: user.name,
        bimester: bimester,
        startDate: todayStr,
        endDate: null,
        date: todayStr,
        startTime: currentNowTime,
        endTime: null,
        durationMinutes: null,
        status: 'draft',
        synthesisMaterialDimension: null,
        synthesisPredominant: null,
        synthesisOrg: null,
        comments: '',
        responses: {},
        criterionComments: {},
        photos: {},
        linkedNotes: []
      };

      appState.observations.unshift(newObs);
      appState.currentObs = newObs;
      appState.activeTabIndex = 0;
```

---

### Passo 3.7: Atualização dos Cabeçalhos da Observação Ativa e da Síntese

**Arquivo:** `index.html`  
**Localização 1:** Em `renderActiveObsScreen()` (linhas 8043-8046).

#### Substituição:
```javascript
      const dateDisplay = formatObservationDateRange(obs) || formatDateBR(obs.startDate || obs.date || getTodayDateString());
      if (obs.evaluatedType === 'turma') {
        document.getElementById('activeObsTeacher').innerText = `Turma: ${obs.className} (${obs.bimester || 'Acompanhamento'})`;
        const teachersDisplay = obs.teachers && obs.teachers.length > 0 ? obs.teachers.join(', ') : obs.teacherName;
        document.getElementById('activeObsMeta').innerText = `Docentes Regentes: ${teachersDisplay} · Escola: ${obs.schoolName} · Supervisor(a): ${obs.evaluatedBy} · Data: ${dateDisplay} · Início: ${obs.startTime || '08:00'}`;
      } else {
        document.getElementById('activeObsTeacher').innerText = `${obs.teacherName} (${obs.bimester || 'Acompanhamento'})`;
        document.getElementById('activeObsMeta').innerText = `Agrupamento: ${obs.className} · Escola: ${obs.schoolName} · Supervisor(a): ${obs.evaluatedBy} · Data: ${dateDisplay} · Início: ${obs.startTime || '08:00'}`;
      }
```

**Localização 2:** Em `renderSynthesisScreen()` (por volta da linha 8510 a 8535).

#### Substituição:
```javascript
      if (metaSchool) metaSchool.innerText = obs.schoolName || '--';
      if (metaBimester) metaBimester.innerText = obs.bimester || 'Acompanhamento';
      if (metaEvaluator) metaEvaluator.innerText = obs.evaluatedBy || '--';
      if (metaDate) metaDate.innerText = formatObservationDateRange(obs) || formatDateBR(obs.date || getTodayDateString());

      if (obs.evaluatedType === 'coordenador') {
        if (metaTarget) metaTarget.innerText = obs.teacherName || '--';
        if (roleBadge) {
          roleBadge.innerText = 'Coordenação Pedagógica';
          roleBadge.style.background = '#FEF3C7';
          roleBadge.style.color = '#92400E';
          roleBadge.style.borderColor = '#FDE68A';
        }
        if (metaClassBox) metaClassBox.style.display = 'none';
      } else {
        // PILAR 1: Síntese focada na TURMA e sua equipe de regência
        const regentsText = obs.teachers && obs.teachers.length > 0 ? obs.teachers.join(', ') : obs.teacherName;
        if (metaTarget) metaTarget.innerHTML = `<strong>Turma:</strong> ${obs.className} <br><span style="font-size:12px; font-weight:600; color:var(--text-secondary);">Regência Titular: ${regentsText}</span>`;
        if (roleBadge) {
          roleBadge.innerText = 'Observação da Turma (Educação Infantil)';
          roleBadge.style.background = '#EFF6FF';
          roleBadge.style.color = '#1E40AF';
          roleBadge.style.borderColor = '#BFDBFE';
        }
        if (metaClassBox) {
          metaClassBox.style.display = 'block';
          if (metaClass) metaClass.innerText = `${obs.className} (${obs.classShift || 'Parcial'})`;
        }
      }
```

---

### Passo 3.8: Blindagem de Escopo e Permissões (`getScopedObservations`)

**Arquivo:** `index.html`  
**Localização:** Em `getScopedObservations()` (linhas 6598-6635).

#### Substituição do filtro de escopo:
```javascript
      return appState.observations.filter(obs => {
        // Se a observação for da TURMA (Pilar 1), valida se a escola e turma pertencem ao escopo
        if (obs.evaluatedType === 'turma') {
          if (obs.status === 'draft') {
            return obs.evaluatedBy === user.name;
          }
          if (user.roleKey === 'tecnico') {
            return true;
          } else if (user.roleKey === 'formador') {
            const userPolo = (user.school || '').trim().toLowerCase();
            const poloUnits = (appState.units || []).filter(u => u.polo && u.polo.trim().toLowerCase() === userPolo).map(u => u.name);
            return poloUnits.includes(obs.schoolName);
          } else if (user.roleKey === 'coordenador') {
            return obs.schoolName === user.school;
          }
          return false;
        }

        // Para observações nominais legadas ou de coordenação pedagógica:
        const targetMemberExists = (appState.teamMembers || []).some(m => m.name === obs.teacherName);
        if (!targetMemberExists) return false;

        if (obs.status === 'draft') {
          return obs.evaluatedBy === user.name;
        }

        if (user.roleKey === 'tecnico') {
          return true;
        } else if (user.roleKey === 'formador') {
          const userPolo = (user.school || '').trim().toLowerCase();
          const poloUnits = (appState.units || []).filter(u => {
            if (!u.polo) return false;
            const up = u.polo.trim().toLowerCase();
            return up === userPolo || up.includes(userPolo) || userPolo.includes(up);
          }).map(u => u.name);
          const supervisedCoords = (appState.teamMembers || []).filter(m => 
            m.roleKey === 'coordenador' && (m.supervisor === user.name || (m.school && poloUnits.includes(m.school)))
          );
          const formadorUnits = Array.from(new Set([...poloUnits, ...supervisedCoords.map(c => c.school)])).filter(Boolean);
          const effectiveUnits = formadorUnits.length > 0 ? formadorUnits : (appState.units || []).map(u => u.name);

          const validTeachers = getScopedAvaliandos('professora').map(m => m.name);
          const validCoords = getScopedAvaliandos('coordenador').map(m => m.name);
          
          if (obs.evaluatedType === 'coordenador') {
            return validCoords.includes(obs.teacherName) && effectiveUnits.includes(obs.schoolName);
          } else {
            return validTeachers.includes(obs.teacherName) && effectiveUnits.includes(obs.schoolName);
          }
        } else if (user.roleKey === 'coordenador') {
          const validTeachers = getScopedAvaliandos('professora').map(m => m.name);
          return validTeachers.includes(obs.teacherName) && obs.schoolName === user.school;
        }
        return false;
      });
```

---

### Passo 3.9: Destaque da Turma no Histórico e nos Rascunhos da Home

**Arquivo:** `index.html`  
**Localização 1:** Em `renderHomeScreen()` (dentro da iteração de `drafts`, linhas 9146-9160).
**Localização 2:** Em `renderHistoryScreen()` (dentro da renderização de cards, linhas 9260-9305).

#### Ajuste no Histórico e Rascunho para Observações de Turma:
No cabeçalho do card:
- Se `item.evaluatedType === 'turma'`:
  - Linha principal em destaque: `📚 Turma: ${item.className}`
  - Subtítulo: `👩‍🏫 Regência: ${item.teachers && item.teachers.length > 0 ? item.teachers.join(', ') : item.teacherName} · ${item.bimester} · ${formatObservationDateRange(item) || item.date}`
- Se `item.evaluatedType === 'coordenador'`:
  - Mantém o padrão nominal: `📋 Coordenadora: ${item.teacherName}`

---

### Passo 3.10: Cobertura de Turmas na Aba de Indicadores

**Arquivo:** `index.html`  
**Localização:** Em `renderIndicatorsScreen()` (linhas 12513-12545).

#### Substituição do Cálculo de Cobertura:
```javascript
      // CÁLCULO DE COBERTURA DE TURMAS (PILAR 1 & PILAR 7)
      let coverageLabel = 'Avaliandos / Cobertura';
      let evaluatedCount = 0;
      let totalCount = 0;
      let coveragePct = 0;

      if (targetType === 'professora') {
        coverageLabel = 'Cobertura de Turmas';
        // Coleta todas as turmas das escolas do escopo
        let scopedClasses = [];
        availableUnits.forEach(uName => {
          if (uName !== 'ALL') {
            scopedClasses = scopedClasses.concat(getClassesForSchool(uName));
          }
        });
        totalCount = scopedClasses.length;
        evaluatedCount = scopedClasses.filter(cls => 
          scopedObs.some(o => o.className === cls.name && (o.status === 'finalized' || o.status === 'concluida'))
        ).length;
        coveragePct = totalCount > 0 ? Math.round((evaluatedCount / totalCount) * 100) : 0;
      } else {
        coverageLabel = 'Coordenadoras / Cobertura';
        totalCount = scopedAvaliandos.length;
        evaluatedCount = scopedAvaliandos.filter(av => 
          scopedObs.some(o => o.teacherName === av.name && (o.status === 'finalized' || o.status === 'concluida'))
        ).length;
        coveragePct = totalCount > 0 ? Math.round((evaluatedCount / totalCount) * 100) : 0;
      }
```

E no Card 3 dos KPIs Superiores:
```html
            <div class="card" style="margin:0; border-left:4px solid var(--primary);">
              <div style="font-size:11px; font-weight:700; color:var(--primary); text-transform:uppercase;">${coverageLabel}</div>
              <div style="font-size:28px; font-weight:800; color:var(--primary-dark); margin:4px 0;">
                ${evaluatedCount} <span style="font-size:16px; color:var(--text-secondary); font-weight:600;">de ${totalCount}</span>
              </div>
              <div style="font-size:12px; color:var(--text-secondary);">● ${coveragePct}% de turmas observadas</div>
            </div>
```

---

## 4. Critérios de Aceite e Roteiro de Teste/Validação

### 4.1 Critérios de Aceite Obrigatórios
- [ ] **Abertura Centrada na Turma:** Ao logar como Coordenadora Pedagógica (ex: Mariana Ferreira) e clicar em "Nova Observação", o seletor primário exibe as turmas da unidade escolar (`CEI Professora Maria de Lourdes`), e o seletor nominal de professoras isoladas é substituído pelo card informativo de professoras regentes titulares.
- [ ] **Exibição Dinâmica das Regentes Titulares:** Ao alternar entre diferentes turmas (ex: `Infantil I - Turma A` vs `Berçário II - Turma Única`), o card atualiza instantaneamente a lista com as docentes vinculadas àquela turma.
- [ ] **Bloqueio de Duplo Lançamento por Turma:** O sistema impede iniciar uma segunda observação no mesmo bimestre para uma turma que já possui rascunho ou observação finalizada.
- [ ] **Sequência Longitudinal por Turma:** Para iniciar o 2º Bimestre de uma turma, o sistema exige que o 1º Bimestre daquela turma esteja finalizado.
- [ ] **Preservação de Escopo da Formadora:** Ao logar como Formadora Pedagógica (Clarice Barbosa), o fluxo mantém o acompanhamento direto de Coordenadoras Pedagógicas, sem poluição de turmas.
- [ ] **Integridade Visual do Header e da Síntese:** O cabeçalho da observação ativa e a síntese final exibem o nome da Turma com destaque tipográfico e a listagem das professoras regentes no subtítulo.
- [ ] **Cobertura de Turmas em Indicadores:** Na aba de Indicadores com perfil docente, o Card 3 exibe explicitamente `COBERTURA DE TURMAS` e calcula a proporção de turmas observadas no escopo.
- [ ] **Governança de Versão e Changelog:** O cabeçalho superior e o modal `#modalChangelog` indicam `Versão 0.85 (v7.64)`, e o `CHANGELOG.md` documenta a entrega com fidelidade.

### 4.2 Roteiro de Teste Passo a Passo
1. **Teste 1 - Perfil Coordenadora:**
   - Logar com Mariana Ferreira (`mariana@teste.com` / `123456`).
   - Clicar em `+ INICIAR NOVA OBSERVAÇÃO`.
   - Verificar se o título indica *"Nova Observação Pedagógica da Turma"*.
   - Verificar se as turmas de `CEI Professora Maria de Lourdes` aparecem no dropdown.
   - Selecionar `Infantil I - Turma A`. Confirmar que o card exibe `Ana Carolina Silva` e `Juliana Roberta Rocha` como regentes titulares.
   - Clicar em `INICIAR INSTRUMENTO DE OBSERVAÇÃO →`.
   - Verificar se a tela `#screenActiveObs` exibe `Turma: Infantil I - Turma A` no título.
2. **Teste 2 - Trava de Duplo Lançamento da Turma:**
   - Salvar a observação como rascunho e voltar para a tela inicial.
   - Tentar abrir nova observação para `Infantil I - Turma A` no `1º Bimestre`.
   - Confirmar o disparo do toast de bloqueio informando que já existe observação em andamento para a turma no 1º Bimestre.
3. **Teste 3 - Trava de Sequência Longitudinal da Turma:**
   - Na tela de setup, selecionar `Infantil I - Turma A` e alterar manualmente o bimestre para `2º Bimestre`.
   - Confirmar que o sistema dispara o toast bloqueando o avanço sem o 1º Bimestre finalizado.
4. **Teste 4 - Histórico e Devolutiva:**
   - Acessar a aba de Histórico (`#screenHistory`).
   - Confirmar que o card exibe `📚 Turma: Infantil I - Turma A` em destaque.
   - Clicar em `Continuar Preenchimento →`, avançar até a Síntese Final e validar a exibição da Turma e da equipe regente titular.
5. **Teste 5 - Painel de Indicadores:**
   - Navegar até a aba de Indicadores (`#screenIndicators`).
   - Verificar se o terceiro card exibe `COBERTURA DE TURMAS` e a porcentagem dinâmica correta em relação ao total de turmas da escola.
6. **Teste 6 - Perfil Formadora:**
   - Trocar para o perfil de Clarice Barbosa (`clarice@teste.com`).
   - Iniciar observação e certificar-se de que o fluxo continua direcionado ao acompanhamento nominal de Coordenadoras Pedagógicas.

---

## 5. Checklist do Assistente Executor (Etapa 2)
- [ ] Rodar `git pull origin main` no terminal.
- [ ] Aplicar as alterações nos 3 arquivos (`index.html`, `gestor supervisao_patos/index.html` e `firebase_deploy/public/index.html`).
- [ ] Efetuar a dupla checagem de leitura em cada bloco editado.
- [ ] Salvar cópia em `intermediárias/aplicativo_v85_pilar_1_inversao_unidade_analise_turma.html`.
- [ ] Atualizar `CHANGELOG.md` e o modal `#modalChangelog` para a Versão 0.85 (v7.64).
- [ ] Executar `git fetch origin main` e verificar se não há divergência.
- [ ] Commitar: `git commit -m "feat: implementar pilar 1 - inversao da unidade de analise para a turma"`.
- [ ] Enviar com `git push origin main`.
- [ ] Executar o deploy no Firebase Hosting: `cd firebase_deploy && firebase deploy`.
