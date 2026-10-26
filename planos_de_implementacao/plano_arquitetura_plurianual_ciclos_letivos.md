# PLANO DE IMPLEMENTAÇÃO: ARQUITETURA PLURIANUAL E GESTÃO DE CICLOS LETIVOS (MULTI-ANO SSOT)

> **Diretriz de Execução Obrigatória:** O executor desta intervenção DEVE ler integralmente os arquivos [WORKFLOW_MACOS.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md), [AGENTS.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/AGENTS.md) e a skill `.agents/skills/execucao-operario/SKILL.md` antes de efetuar qualquer alteração. Este plano é a especificação exata, detalhada e vinculante a ser seguida fielmente na Etapa 2.

---

## 1. Diagnóstico e Contexto

No ecossistema **SerTão Criança**, a supervisão e o acompanhamento pedagógico formativo da Educação Infantil de Patos/PB foram concebidos com foco no **Ciclo Longitudinal Anual**, estruturado em 4 bimestres obrigatórios (1º a 4º Bimestres).

Entretanto, uma análise arquitetural aprofundada revelou que a plataforma opera como um **sistema mono-ano**:
1. **Ausência da Dimensão `anoLetivo` (ou `academicYear`):**
   - As observações (`appState.observations`) registram apenas a data pontual (`date: '2026-03-12'`) e o bimestre canônico (`bimester: '1º Bimestre'`), sem vínculo com um ano letivo estruturado.
   - As turmas (`appState.classes`) são uma lista estática e única, sem marcação de ano letivo.
2. **Colisão no Motor Determinístico e Semáforo Longitudinal:**
   - Em [`calculateClassBimesterStatus()`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/index.html#L18534) e [`getNextEligibleBimesterForClass()`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/index.html#L10579), a checagem de conclusão busca por qualquer observação finalizada com o mesmo nome de turma e número de bimestre (`appState.observations.some(...)`). Ao virar o ano letivo (ex: de 2026 para 2027), as turmas homônimas herdariam as avaliações de 2026, travando o 1º Bimestre de 2027 como "já concluído".
3. **SSOT de Prazos Bimestrais (`bimesterPeriods`) Plano e Inflexível:**
   - O objeto de períodos armazena unicamente 4 intervalos de datas fixos (1º ao 4º Bimestre). Ao configurar prazos para um novo ano, os prazos do ano anterior seriam irremediavelmente sobrescritos.
4. **Agregação Indiscriminada nos Indicadores:**
   - A opção *"Ano Completo (Todos)"* na aba de Indicadores processa todo o array de observações sem recorte de ano letivo. Caso coexistissem múltiplos anos, métricas de cobertura, gargalos e benchmarks agregariam séries temporais incompatíveis.

### Diretriz Inviolável de Preservação Cadastral (Patrimônio da Rede)
Na transição para a arquitetura plurianual, as seguintes entidades mestras constituem patrimônio permanente da rede municipal e **DEVEM SER 100% PRESERVADAS E COMPARTILHADAS ENTRE TODOS OS ANOS**:
- 🏫 **Unidades Escolares (`appState.units`):** As creches e escolas de EI (CEIs, EMEIs) são fixas no município. Seus cadastros, códigos e capacidades persistem intactos.
- 👥 **Profissionais e Usuários (`appState.teamMembers` e `USERS_DB` / `appState.customUsers`):** Professores, coordenadores pedagógicos, formadoras e técnicos do Núcleo de Educação Infantil continuam ativos no quadro de servidores da rede.
- 📍 **Polos Regionais:** O agrupamento territorial das escolas por polos (Polo I, Polo II, etc.) que fundamenta a atuação das Formadoras é contínuo e compartilhado.

As entidades que sofrem ciclo de vida anual e particionamento são:
- 📅 **Períodos Bimestrais SSOT:** Parametrizados ano a ano.
- 🏫 **Catálogo de Turmas:** Cada turma é vinculada ao seu respectivo ano letivo (ex: `Infantil I - Turma A [2026]` vs `Infantil I - Turma A [2027]`), preservando as matrículas e atribuições docentes históricas. Na virada de ano, a gestão pode optar por **clonar a matriz de turmas do ano anterior** ou cadastrar novas turmas, mantendo intactos os docentes associados.
- 📝 **Observações, Agendamentos e Ocorrências:** Particionados por `academicYear`, garantindo integridade e histórico perene.

---

## 2. Arquitetura e Pontos de Impacto

Os arquivos impactados são:
- `index.html` (e cópia espelhada em `firebase_deploy/public/index.html`):
  1. **Modelo de Dados Global (`appState`):**
     - Adição de `appState.academicYears`: Array ordenado de anos letivos configurados (ex: `['2025', '2026', '2027']`).
     - Adição de `appState.selectedAcademicYear`: Ano letivo ativo no contexto do usuário (padrão inicial `'2026'`).
     - Reestruturação de `appState.bimesterPeriods`: Dicionário indexado por ano letivo:
       ```javascript
       {
         '2026': {
           '1º Bimestre': { startDate: '2026-02-02', endDate: '2026-04-30', label: '1º Bimestre' },
           '2º Bimestre': { startDate: '2026-05-04', endDate: '2026-07-31', label: '2º Bimestre' },
           '3º Bimestre': { startDate: '2026-08-03', endDate: '2026-10-31', label: '3º Bimestre' },
           '4º Bimestre': { startDate: '2026-11-03', endDate: '2027-01-29', label: '4º Bimestre' }
         },
         '2027': { ... }
       }
       ```
     - Autocura transparente em `loadState()`: Migração sem perda de dados para bases existentes que utilizavam a estrutura plana de `bimesterPeriods`.
     - Vinculação de `academicYear` em `classes`, `observations`, `schedules` e `notes`.
  2. **Seletor Global de Ano Letivo no Topo da Aplicação (`headerAcademicYearSelect`):**
     - Posicionado estrategicamente na barra de navegação (`.navbar-actions`), ao lado do seletor de perfil/cargo.
     - Permite alternância instantânea entre os anos configurados.
     - Exibição de banner contextual em modo consulta quando o usuário estiver visualizando um ano letivo anterior ao mais recente.
  3. **Motores de Decisão e Semáforos com Escopo Temporal Estrito:**
     - `getCurrentSchoolBimester(referenceDate, targetYear)`: Consulta as datas do ano correspondente.
     - `calculateClassBimesterStatus(className, schoolName, bimesterName, referenceDate, targetYear)`: Avalia apenas observações e agendamentos do ano letivo sob análise.
     - `getNextEligibleBimesterForClass(className, schoolName, targetYear)`: Sequenciamento isolado por ano.
     - `calculateTeacherBimesterStatus()`: Semáforo docente com isolamento por ano.
     - `getScopedObservations(targetYear)`: Escopo restrito ao ano letivo ativo.
  4. **Matriz Longitudinal e Catálogo de Turmas:**
     - Filtro reativo para exibir apenas turmas e semáforos correspondentes ao ano letivo selecionado.
     - Na tela de configuração de nova observação, apenas turmas do ano letivo ativo ficam disponíveis para seleção.
  5. **Painel & Indicadores Decisórios:**
     - Gráficos de radar, semáforos de metas e cobertura passam a calcular com base estrita no `appState.selectedAcademicYear`.
     - Inclusão do indicador do ano de referência no cabeçalho dos relatórios exportados em PDF.
  6. **Modal SSOT de Ciclos Avaliativos & Calendário (`#modalBimesterPeriods`):**
     - Seletor de Ano Letivo para parametrização dos prazos bimestrais de cada ano.
     - Botão exclusivo para a Coordenadora da EI (`nucleo_ei`): **➕ Criar Novo Ano Letivo**.
     - Assistente de Novo Ciclo com opção de **clonagem da estrutura de turmas e atribuições docentes do ano anterior**, assegurando continuidade pedagógica sem retrabalho.
  7. **Preservação Absoluta de UEs, Profissionais e Polos:**
     - Rotinas de autocura e validação garantem que `units`, `teamMembers` e `USERS_DB` permaneçam inalterados na criação ou troca de ano letivo.
  8. **Backup & Governança SSOT (`exportFullBaseJSON` / `importFullBaseJSON`):**
     - O pacote JSON exportado contempla a árvore plurianual completa com todos os anos configurados.
- `audit_platform.py` e testes integrados no `index.html`:
  - Testes do módulo `catalogo_dados` e `indicadores_decisao` validando a persistência multi-ano, isolamento do semáforo por ano e permanência das UEs/profissionais/polos.
- `CHANGELOG.md` e `#modalChangelog`:
  - Registro formal da versão **v1.25 (v8.1.0)**.

---

## 3. Especificação de Implementação Passo a Passo (Snippets Exatos)

### Passo 1: Definição das Estruturas Canônicas Plurianuais na SSOT

No arquivo `index.html`, nas imediações da linha ~8646 (onde se define `DEFAULT_BIMESTER_PERIODS`):

```javascript
    // --- PILAR 15: PERÍODOS OFICIAIS DOS CICLOS AVALIATIVOS (SSOT) ---
    const DEFAULT_ACADEMIC_YEARS = ['2026'];
    const DEFAULT_SELECTED_ACADEMIC_YEAR = '2026';

    const DEFAULT_BIMESTER_PERIODS_BY_YEAR = {
      '2026': {
        '1º Bimestre': { startDate: '2026-02-02', endDate: '2026-04-30', label: '1º Bimestre' },
        '2º Bimestre': { startDate: '2026-05-04', endDate: '2026-07-31', label: '2º Bimestre' },
        '3º Bimestre': { startDate: '2026-08-03', endDate: '2026-10-31', label: '3º Bimestre' },
        '4º Bimestre': { startDate: '2026-11-03', endDate: '2027-01-29', label: '4º Bimestre' }
      }
    };

    // Mantido para compatibilidade retroativa imediata
    const DEFAULT_BIMESTER_PERIODS = DEFAULT_BIMESTER_PERIODS_BY_YEAR['2026'];
```

E no objeto `let appState = { ... }` (linha ~8655):

```javascript
    let appState = {
      currentUserKey: 'mariana',
      activeSectionsTeacher: JSON.parse(JSON.stringify(DEFAULT_SECTIONS_TEACHER)),
      activeSectionsCoordinator: JSON.parse(JSON.stringify(DEFAULT_SECTIONS_COORDINATOR)),
      units: JSON.parse(JSON.stringify(INITIAL_UNITS)), // <-- UEs PRESERVADAS (PERENES)
      classes: JSON.parse(JSON.stringify(INITIAL_CLASSES)), // <-- CATÁLOGO DE TURMAS VINCULADO AO ANO
      deletedClassIds: [],
      academicYears: [...DEFAULT_ACADEMIC_YEARS], // <-- LISTA DE ANOS CONFIGURADOS
      selectedAcademicYear: DEFAULT_SELECTED_ACADEMIC_YEAR, // <-- ANO ATIVO NO CONTEXTO
      bimesterPeriods: JSON.parse(JSON.stringify(DEFAULT_BIMESTER_PERIODS_BY_YEAR)), // <-- SSOT MULTI-ANO
      teamMembers: JSON.parse(JSON.stringify(INITIAL_TEAM)), // <-- PROFISSIONAIS PRESERVADOS (PERENES)
      notes: JSON.parse(JSON.stringify(INITIAL_NOTES)),
      schedules: JSON.parse(JSON.stringify(INITIAL_SCHEDULES)),
      observations: [],
      currentObs: null,
      bottlenecksSortMode: 'absolute',
      activeTabIndex: 0,
      isReadOnly: false,
      historyFilter: 'drafts',
      uploadTargetCritId: null,
      expandedDrilldowns: {}
    };
```

---

### Passo 2: Autocura e Migração Transparente em `loadState()`

Em `loadState()` (linhas ~8675-8710), implementar a migração defensiva que detecta bases antigas (com estrutura plana de bimestres ou sem `academicYear` em turmas/observações) e converte para o formato plurianual sem perder dados:

```javascript
          // 1. Autocura da lista de anos letivos e ano ativo
          if (!Array.isArray(appState.academicYears) || appState.academicYears.length === 0) {
            appState.academicYears = ['2026'];
          }
          if (!appState.selectedAcademicYear || !appState.academicYears.includes(appState.selectedAcademicYear)) {
            appState.selectedAcademicYear = appState.academicYears[appState.academicYears.length - 1] || '2026';
          }

          // 2. Autocura do bimesterPeriods (converte estrutura plana de 4 bimestres para dicionário por ano)
          if (!appState.bimesterPeriods || typeof appState.bimesterPeriods !== 'object') {
            appState.bimesterPeriods = JSON.parse(JSON.stringify(DEFAULT_BIMESTER_PERIODS_BY_YEAR));
          } else if (appState.bimesterPeriods['1º Bimestre'] && appState.bimesterPeriods['1º Bimestre'].startDate) {
            // Base legada plana: encapsula sob o ano de 2026
            const legacyPeriods = { ...appState.bimesterPeriods };
            appState.bimesterPeriods = {
              '2026': legacyPeriods
            };
          }

          // Assegura integridade dos 4 bimestres para cada ano cadastrado
          appState.academicYears.forEach(y => {
            if (!appState.bimesterPeriods[y]) {
              appState.bimesterPeriods[y] = JSON.parse(JSON.stringify(DEFAULT_BIMESTER_PERIODS_BY_YEAR['2026']));
            }
            ['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre'].forEach(bName => {
              if (!appState.bimesterPeriods[y][bName] || !appState.bimesterPeriods[y][bName].startDate || !appState.bimesterPeriods[y][bName].endDate) {
                const defaultRef = (DEFAULT_BIMESTER_PERIODS_BY_YEAR[y] && DEFAULT_BIMESTER_PERIODS_BY_YEAR[y][bName]) 
                  ? DEFAULT_BIMESTER_PERIODS_BY_YEAR[y][bName] 
                  : DEFAULT_BIMESTER_PERIODS_BY_YEAR['2026'][bName];
                appState.bimesterPeriods[y][bName] = JSON.parse(JSON.stringify(defaultRef));
              }
            });
          });

          // 3. Autocura de turmas: atribui academicYear caso ausente
          if (Array.isArray(appState.classes)) {
            appState.classes.forEach(c => {
              if (!c.academicYear) {
                c.academicYear = '2026';
              }
            });
          }

          // 4. Autocura de observações: infere academicYear a partir da data de registro ou atribui o padrão
          if (Array.isArray(appState.observations)) {
            appState.observations.forEach(o => {
              if (!o.academicYear) {
                const dateStr = o.date || o.startDate || o.endDate;
                if (dateStr && dateStr.length >= 4) {
                  const inferredYear = dateStr.slice(0, 4);
                  o.academicYear = appState.academicYears.includes(inferredYear) ? inferredYear : '2026';
                } else {
                  o.academicYear = '2026';
                }
              }
            });
          }

          // 5. Autocura de agendamentos e ocorrências
          if (Array.isArray(appState.schedules)) {
            appState.schedules.forEach(s => {
              if (!s.academicYear) {
                const sDate = s.date || s.plannedDate;
                s.academicYear = (sDate && sDate.length >= 4) ? sDate.slice(0, 4) : '2026';
              }
            });
          }
          if (Array.isArray(appState.notes)) {
            appState.notes.forEach(n => {
              if (!n.academicYear) {
                n.academicYear = (n.date && n.date.length >= 4) ? n.date.slice(0, 4) : '2026';
              }
            });
          }

          // 6. GARANTIA ABSOLUTA DE PRESERVAÇÃO DE UEs, PROFISSIONAIS E POLOS
          if (!appState.units || appState.units.length === 0) appState.units = JSON.parse(JSON.stringify(INITIAL_UNITS));
          if (!appState.teamMembers || appState.teamMembers.length === 0) appState.teamMembers = JSON.parse(JSON.stringify(INITIAL_TEAM));
```

---

### Passo 3: Seletor Global de Ano Letivo no Topo da Aplicação

1. No HTML da barra de navegação superior (`.navbar-actions`, linhas ~3286-3308), inserir o seletor antes do `#headerRoleBadge`:

```html
        <!-- Seletor Global de Ano Letivo (SSOT Multi-Ano) -->
        <div class="academic-year-selector-wrapper" id="headerAcademicYearWrapper" style="display:flex; align-items:center; background:var(--bg); border:1px solid var(--border); border-radius:8px; padding:2px 8px; gap:6px;">
          <span style="font-size:12px;" title="Ano Letivo Ativo">📅</span>
          <select id="headerAcademicYearSelect" class="form-select" onchange="onGlobalAcademicYearChange(this.value)" style="border:none; background:transparent; font-size:12px; font-weight:800; color:var(--text-primary); cursor:pointer; padding:2px 4px; outline:none;" title="Alternar Ano Letivo em Visualização">
            <!-- Populado dinamicamente via renderGlobalAcademicYearSelector() -->
          </select>
        </div>
```

2. No início da área de conteúdo (após o cabeçalho), criar o banner de alerta para modo consulta de anos anteriores:

```html
  <!-- Banner Informativo de Ano Letivo Anterior (Modo Consulta Histórica) -->
  <div id="historicalYearWarningBanner" style="display:none; background:#FFFBEB; border-bottom:1px solid #FDE68A; padding:8px 20px; font-size:12px; font-weight:600; color:#92400E; justify-content:space-between; align-items:center;">
    <div style="display:flex; align-items:center; gap:8px;">
      <span>⚠️ <strong>Atenção:</strong> Você está visualizando o histórico do <strong>Ano Letivo <span id="historicalYearBannerLabel">2025</span></strong>. Novos lançamentos devem ser efetuados preferencialmente no ano letivo vigente.</span>
    </div>
    <button class="btn btn-secondary" style="padding:2px 8px; font-size:11px; font-weight:700; background:#FFFFFF; border:1px solid #D97706; color:#92400E;" onclick="returnToCurrentAcademicYear()">
      Voltar ao Ano Vigente
    </button>
  </div>
```

3. Funções JavaScript correspondentes para renderização e controle de alternância:

```javascript
    function renderGlobalAcademicYearSelector() {
      const select = document.getElementById('headerAcademicYearSelect');
      if (!select) return;

      const years = appState.academicYears || ['2026'];
      const activeYear = appState.selectedAcademicYear || '2026';
      const maxYear = years.reduce((max, y) => parseInt(y, 10) > parseInt(max, 10) ? y : max, years[0]);

      let html = '';
      years.forEach(y => {
        const isLatest = (y === maxYear);
        const tag = isLatest ? ' (Vigente)' : ' (Histórico)';
        html += `<option value="${y}" ${y === activeYear ? 'selected' : ''}>${y}${tag}</option>`;
      });

      select.innerHTML = html;

      // Controle do Banner de Ano Anterior
      const banner = document.getElementById('historicalYearWarningBanner');
      const label = document.getElementById('historicalYearBannerLabel');
      if (banner && label) {
        if (activeYear !== maxYear) {
          label.innerText = activeYear;
          banner.style.display = 'flex';
        } else {
          banner.style.display = 'none';
        }
      }
    }

    function onGlobalAcademicYearChange(newYear) {
      if (!newYear || !appState.academicYears.includes(newYear)) return;
      appState.selectedAcademicYear = newYear;
      saveState();
      renderGlobalAcademicYearSelector();

      // Atualiza a tela corrente com o novo contexto temporal
      refreshCurrentActiveTab();
      showToast(`Contexto alterado para o Ano Letivo ${newYear}`);
    }

    function returnToCurrentAcademicYear() {
      const years = appState.academicYears || ['2026'];
      const maxYear = years.reduce((max, y) => parseInt(y, 10) > parseInt(max, 10) ? y : max, years[0]);
      onGlobalAcademicYearChange(maxYear);
    }
```

---

### Passo 4: Adaptação dos Motores de Resolução e Semáforos

1. **`getCurrentSchoolBimester(referenceDate, targetYear)`:**
   Adaptar para buscar no dicionário do ano específico:

```javascript
    function getCurrentSchoolBimester(referenceDate = new Date(), targetYear = null) {
      const d = (referenceDate instanceof Date && !isNaN(referenceDate)) ? referenceDate : new Date(referenceDate);
      const activeYear = targetYear || appState.selectedAcademicYear || '2026';
      
      const allPeriods = (appState && appState.bimesterPeriods) ? appState.bimesterPeriods : DEFAULT_BIMESTER_PERIODS_BY_YEAR;
      const periods = allPeriods[activeYear] || allPeriods['2026'] || DEFAULT_BIMESTER_PERIODS;
      const BIMESTERS_CANONICAL = ['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre'];

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const refDateStr = `${year}-${month}-${day}`;

      for (const bName of BIMESTERS_CANONICAL) {
        const p = periods[bName];
        if (p && p.startDate && p.endDate) {
          if (refDateStr >= p.startDate && refDateStr <= p.endDate) {
            return bName;
          }
        }
      }

      const firstBim = periods['1º Bimestre'];
      if (firstBim && firstBim.startDate && refDateStr < firstBim.startDate) {
        return '1º Bimestre';
      }

      for (let i = 0; i < BIMESTERS_CANONICAL.length - 1; i++) {
        const curBim = periods[BIMESTERS_CANONICAL[i]];
        const nextBim = periods[BIMESTERS_CANONICAL[i + 1]];
        if (curBim && nextBim && curBim.endDate && nextBim.startDate) {
          if (refDateStr > curBim.endDate && refDateStr < nextBim.startDate) {
            return BIMESTERS_CANONICAL[i + 1];
          }
        }
      }

      return '4º Bimestre';
    }
```

2. **`getNextEligibleBimesterForClass(className, schoolName, targetYear)`:**
   Isolar a consulta às observações finalizadas pelo ano correspondente:

```javascript
    function getNextEligibleBimesterForClass(className, schoolName, targetYear = null) {
      const activeYear = targetYear || appState.selectedAcademicYear || '2026';
      const BIMESTERS = ['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre'];
      if (!className) return '1º Bimestre';
      const cleanClass = className.trim().toLowerCase();
      const cleanSchool = (schoolName || '').trim().toLowerCase();

      for (let i = 0; i < BIMESTERS.length; i++) {
        const bim = BIMESTERS[i];
        const bimNum = bim.match(/([1-4])/)[1];

        // FILTRO COM ESCOPO DE ANO LETIVO (Impede colisão entre 2026 e 2027)
        const hasFinalized = (appState.observations || []).some(o => {
          const obsYear = o.academicYear || (o.date ? o.date.slice(0, 4) : '2026');
          if (obsYear !== activeYear) return false;
          if (!o.className || o.className.trim().toLowerCase() !== cleanClass) return false;
          if (cleanSchool && o.schoolName && o.schoolName.trim().toLowerCase() !== cleanSchool) return false;
          const obsBimNum = (o.bimester || '').match(/([1-4])/);
          if (!obsBimNum || obsBimNum[1] !== bimNum) return false;
          return o.status === 'finalized' || o.status === 'concluida';
        });

        if (!hasFinalized) {
          return bim;
        }
      }
      return '4º Bimestre';
    }
```

3. **`calculateClassBimesterStatus()`:**
   Filtrar observações, rascunhos e agendamentos pelo `targetYear`:

```javascript
    function calculateClassBimesterStatus(className, schoolName, bimesterName, referenceDate = new Date(), targetYear = null) {
      const activeYear = targetYear || appState.selectedAcademicYear || '2026';
      if (!className) return { status: 'future', colorKey: 'gray', label: '—' };
      
      const cleanClass = (className || '').trim().toLowerCase();
      const cleanSchool = (schoolName || '').trim().toLowerCase();
      
      const bimMatch = (bimesterName || '').match(/([1-4])/);
      const bimesterNum = bimMatch ? parseInt(bimMatch[1], 10) : 1;
      
      const currentBimStr = getCurrentSchoolBimester(referenceDate, activeYear);
      const currentBimMatch = currentBimStr.match(/([1-4])/);
      const currentBimNum = currentBimMatch ? parseInt(currentBimMatch[1], 10) : 1;

      // 1. Busca observação finalizada para a TURMA no ANO LETIVO ATIVO
      const finalizedObs = (appState.observations || []).find(o => {
        const obsYear = o.academicYear || (o.date ? o.date.slice(0, 4) : '2026');
        if (obsYear !== activeYear) return false;
        if (o.status !== 'finalized' && o.status !== 'concluida') return false;
        if (!o.className) return false;
        const oCls = o.className.trim().toLowerCase();
        let matchesClass = (cleanClass === oCls);
        if (!matchesClass) {
          const t1 = new Set(cleanClass.match(/[a-z0-9]+/g) || []);
          const t2 = new Set(oCls.match(/[a-z0-9]+/g) || []);
          const romans = ['i', 'ii', 'iii', 'iv', 'v'];
          const r1 = romans.filter(r => t1.has(r));
          const r2 = romans.filter(r => t2.has(r));
          const romanConflict = (r1.length > 0 && r2.length > 0 && r1[0] !== r2[0]);
          if (!romanConflict) {
            const isSub1 = [...t2].every(x => t1.has(x));
            const isSub2 = [...t1].every(x => t2.has(x));
            matchesClass = isSub1 || isSub2;
          }
        }
        if (!matchesClass) return false;
        if (cleanSchool && o.schoolName && o.schoolName.trim().toLowerCase() !== cleanSchool) return false;
        const oBimMatch = (o.bimester || '').match(/([1-4])/);
        return oBimMatch && parseInt(oBimMatch[1], 10) === bimesterNum;
      });

      // ... idêntica proteção de cálculo de score ...
      // 2. Rascunhos e 3. Agendamentos: filtrar estritamente por activeYear:
      // schedYear === activeYear && draftYear === activeYear
```

4. **`getScopedObservations(targetYear)`:**
   Filtrar por padrão as observações do ano ativo:

```javascript
    function getScopedObservations(targetYear = null) {
      const activeYear = targetYear || appState.selectedAcademicYear || '2026';
      const user = getCurrentUser();
      if (!appState.observations) return [];

      return appState.observations.filter(obs => {
        const obsYear = obs.academicYear || (obs.date ? obs.date.slice(0, 4) : '2026');
        if (obsYear !== activeYear) return false;

        // Regras existentes de papel (nucleo_ei, formador, coordenador, professora)...
        if (obs.evaluatedType === 'turma') {
          if (obs.status === 'draft') return obs.evaluatedBy === user.name;
          if (isNucleoEI(user)) return true;
          if (user.roleKey === 'formador') {
            const userPolo = (user.school || '').trim().toLowerCase();
            const poloUnits = (appState.units || []).filter(u => u.polo && u.polo.trim().toLowerCase() === userPolo).map(u => u.name);
            return poloUnits.includes(obs.schoolName);
          }
          if (user.roleKey === 'coordenador') return obs.schoolName === user.school;
          if (user.roleKey === 'professora') {
            return (obs.status === 'finalized' || obs.status === 'concluida') &&
                   obs.schoolName === user.school &&
                   ((obs.teachers && obs.teachers.includes(user.name)) || obs.className === user.classAssigned);
          }
          return false;
        }
        // ...
      });
    }
```

---

### Passo 5: Assistente de Transição de Ciclo e Parametrizador SSOT

No modal de Ciclos Avaliativos (`#modalBimesterPeriods`):

1. **Adicionar Seletor de Ano Letivo para Configuração de Prazos:**
   A Coordenadora do Núcleo de EI pode alternar qual ano está configurando ou criar um novo ano.

```html
        <div style="display:flex; justify-content:space-between; align-items:center; background:#F8FAFC; border:1px solid var(--border); border-radius:8px; padding:12px; margin-bottom:16px;">
          <div>
            <label style="font-size:12px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Ano Letivo em Configuração:</label>
            <div style="display:flex; align-items:center; gap:8px; margin-top:4px;">
              <select id="modalBimesterPeriodYearSelect" class="form-select" onchange="onModalBimesterYearChange(this.value)" style="font-weight:700; font-size:14px; padding:4px 10px; border-radius:6px;">
                <!-- Preenchido dinamicamente com appState.academicYears -->
              </select>
            </div>
          </div>
          <button class="btn btn-secondary" onclick="openCreateNewAcademicYearModal()" style="color:#0284C7; font-weight:700; border-color:#BAE6FD; background:#F0F9FF;">
            ➕ Novo Ano Letivo
          </button>
        </div>
```

2. **Modal Secundário de Criação de Novo Ano Letivo (`#modalCreateAcademicYear`):**
   Permite que a gestão informe o próximo ano (ex: `2027`) e escolha se deseja clonar o catálogo de turmas com docentes:

```html
  <!-- Modal: Criar Novo Ano Letivo (Transição de Ciclo) -->
  <div id="modalCreateAcademicYear" class="modal-overlay" style="display:none;" onclick="if(event.target===this)closeCreateNewAcademicYearModal()">
    <div class="modal-card" style="max-width:480px;">
      <div class="modal-header">
        <div class="modal-title">🌟 Iniciar Novo Ano Letivo</div>
        <button class="btn btn-secondary" style="padding:4px 8px;" onclick="closeCreateNewAcademicYearModal()">✕</button>
      </div>
      <div class="modal-body" style="padding:16px;">
        <div class="form-group" style="margin-bottom:14px;">
          <label class="form-label" style="font-weight:700;">Ano Letivo:</label>
          <input type="number" id="inputNewAcademicYear" class="form-control" style="font-size:16px; font-weight:700;" min="2024" max="2035" placeholder="Ex: 2027" />
        </div>
        
        <div style="background:#F0FDF4; border:1px solid #BBF7D0; border-radius:8px; padding:12px; margin-bottom:14px;">
          <div style="font-size:12px; font-weight:700; color:#166534; margin-bottom:4px;">🛡️ Patrimônio Municipal Preservado:</div>
          <div style="font-size:11px; color:#15803D; line-height:1.4;">
            As <strong>Unidades Escolares</strong>, a <strong>Equipe de Servidores (Professores e Usuários)</strong> e os <strong>Polos Regionais</strong> são integralmente mantidos e continuam disponíveis.
          </div>
        </div>

        <div class="form-group" style="margin-bottom:16px;">
          <label style="font-size:12px; font-weight:700; color:var(--text-primary); display:block; margin-bottom:6px;">Matriz de Turmas e Atribuições:</label>
          <label style="display:flex; align-items:center; gap:8px; font-size:13px; cursor:pointer; margin-bottom:6px;">
            <input type="radio" name="newYearClassesOption" value="clone" checked />
            <span><strong>Clonar turmas do ano anterior</strong> (Reaproveita turmas, turnos e docentes atribuídos como ponto de partida)</span>
          </label>
          <label style="display:flex; align-items:center; gap:8px; font-size:13px; cursor:pointer;">
            <input type="radio" name="newYearClassesOption" value="clean" />
            <span><strong>Iniciar sem turmas</strong> (Cadastrar ou importar nova enturmação do zero)</span>
          </label>
        </div>
      </div>
      <div class="modal-footer" style="display:flex; justify-content:flex-end; gap:8px;">
        <button class="btn btn-secondary" onclick="closeCreateNewAcademicYearModal()">Cancelar</button>
        <button class="btn btn-primary" onclick="confirmCreateNewAcademicYear()">Confirmar e Abrir Ano</button>
      </div>
    </div>
  </div>
```

3. **Lógica de Criação e Clonagem de Ano Letivo:**

```javascript
    function confirmCreateNewAcademicYear() {
      const inputYear = document.getElementById('inputNewAcademicYear');
      const yearVal = inputYear ? inputYear.value.trim() : '';

      if (!yearVal || !/^\d{4}$/.test(yearVal)) {
        alert('Por favor, informe um ano válido de 4 dígitos (ex: 2027).');
        return;
      }

      if (appState.academicYears.includes(yearVal)) {
        alert(`O Ano Letivo ${yearVal} já está cadastrado no sistema.`);
        return;
      }

      const cloneOption = document.querySelector('input[name="newYearClassesOption"]:checked')?.value || 'clone';
      const prevYear = appState.selectedAcademicYear || '2026';

      // 1. Cadastra o novo ano e define períodos padrão baseados no ano informado
      appState.academicYears.push(yearVal);
      appState.academicYears.sort();

      const yNum = parseInt(yearVal, 10);
      appState.bimesterPeriods[yearVal] = {
        '1º Bimestre': { startDate: `${yNum}-02-01`, endDate: `${yNum}-04-30`, label: '1º Bimestre' },
        '2º Bimestre': { startDate: `${yNum}-05-02`, endDate: `${yNum}-07-31`, label: '2º Bimestre' },
        '3º Bimestre': { startDate: `${yNum}-08-01`, endDate: `${yNum}-10-31`, label: '3º Bimestre' },
        '4º Bimestre': { startDate: `${yNum}-11-03`, endDate: `${yNum + 1}-01-29`, label: '4º Bimestre' }
      };

      // 2. Clonagem de turmas com preservação dos docentes se selecionado
      if (cloneOption === 'clone') {
        const prevClasses = (appState.classes || []).filter(c => (c.academicYear || '2026') === prevYear);
        prevClasses.forEach(pc => {
          const newClass = JSON.parse(JSON.stringify(pc));
          newClass.id = 'cls-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
          newClass.academicYear = yearVal;
          appState.classes.push(newClass);
        });
      }

      // 3. Define como ano ativo e salva estado
      appState.selectedAcademicYear = yearVal;
      saveState();

      closeCreateNewAcademicYearModal();
      closeBimesterPeriodsModal();
      renderGlobalAcademicYearSelector();
      refreshCurrentActiveTab();

      showToast(`Ano Letivo ${yearVal} criado e ativado com sucesso! UEs e profissionais preservados.`);
    }
```

---

### Passo 6: Catálogo de Turmas e Seletores de Nova Observação

1. **Filtro de Turmas na Gestão Operacional / Lista de Turmas:**
   Apenas turmas onde `(c.academicYear || '2026') === appState.selectedAcademicYear` são renderizadas nas tabelas e no Semáforo Longitudinal.
2. **Nova Turma Cadastrada:**
   Ao criar turma em `#modalAddClass`, a turma é gravada com `academicYear: appState.selectedAcademicYear`.
3. **Formulário de Início de Observação (`#setupClass`):**
   Ao selecionar a Unidade Escolar, o dropdown de turmas é populado estritamente com as turmas ativas do ano letivo selecionado (`appState.selectedAcademicYear`).

---

## 4. Critérios de Aceite e Roteiro de Teste

### Critérios de Aceite
1. **Preservação Cadastral Irrestrita:**
   - As Unidades Escolares (`units`), os Servidores/Usuários (`teamMembers` e `USERS_DB`) e os Polos Regionais permanecem exatamente iguais após a troca de ano letivo ou criação de um novo ano.
2. **Isolamento de Semáforo e Pré-requisitos:**
   - Uma turma com 1º Bimestre concluído em 2026 NÃO apresenta 1º Bimestre concluído em 2027.
   - O semáforo exibe os prazos vigentes relativos ao ano letivo selecionado.
3. **Seletor de Ano Letivo no Header:**
   - Presente e responsivo na barra superior (`.navbar-actions`).
   - Ao alternar entre anos, o estado de visualização de Indicadores, Cronograma e Turmas se atualiza reativamente.
   - Exibição clara de banner avisando quando o usuário está em modo histórico (ano passado).
4. **Governança do Núcleo de EI:**
   - Apenas o perfil `nucleo_ei` tem acesso à criação de novos anos letivos e parametrização dos prazos SSOT de cada ano.
5. **Autocura e Retrocompatibilidade:**
   - Bases com o formato legado (v1.23/v1.24) abrem perfeitamente sem erros de console, sendo migradas de forma transparente para `2026` sem qualquer perda de dados.
6. **Validação Sintática Absoluta:**
   - Execução bem-sucedida de `python3 audit_platform.py --check-syntax` com 0 erros léxicos/sintáticos.

---

## 5. Alterações / Adições / Exclusões no Algoritmo de Auditoria (`audit_platform.py`)

A suíte automatizada de testes DEVE ser estendida para garantir a estabilidade do ecossistema plurianual:

### 1. Adição no Módulo `catalogo_dados`:
- **Verificação do Estado Multi-Ano:**
  - Checar se `appState.academicYears` é um array com ao menos 1 ano cadastrado (`'2026'`).
  - Checar se `appState.selectedAcademicYear` coincide com um ano válido.
  - Checar se `appState.bimesterPeriods` possui a chave correspondente ao ano ativo.
- **Teste de Preservação Cadastral:**
  - Simular a alternância para um ano fictício ou novo (`2027`) e validar que `appState.units.length` e `appState.teamMembers.length` mantêm-se rigorosamente idênticos.
- **Teste de Isolamento de Semáforo:**
  - Criar uma observação de teste finalizada para o 1º Bimestre de uma turma em 2026.
  - Chamar `calculateClassBimesterStatus(turma, escola, '1º Bimestre', new Date(), '2026')` e validar retorno `status === 'completed'`.
  - Chamar `calculateClassBimesterStatus(turma, escola, '1º Bimestre', new Date(), '2027')` e validar que o retorno **NÃO é completed** (permanece `overdue` ou `current`, sem herança espúria).

### 2. Adição no Módulo `indicadores_decisao`:
- Validar se o seletor `#headerAcademicYearSelect` existe no DOM e reflete as opções do estado global.
- Validar se a alternância de ano atualiza os KPIs superiores de cobertura.

### 3. Exclusões / Ajustes:
- Substituir chamadas a `appState.bimesterPeriods['1º Bimestre']` nos testes por `(appState.bimesterPeriods[appState.selectedAcademicYear] || appState.bimesterPeriods['2026'])['1º Bimestre']` para suportar a nova estrutura aninhada com tolerância a retrocompatibilidade.
