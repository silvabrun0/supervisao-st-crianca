    // --- 1.1 PADRONIZAÇÃO MEC DE JORNADAS E TURNOS (PILAR 13) ---
    function formatMECShift(shift) {
      if (!shift) return 'Tempo Parcial (Matutino)';
      const s = String(shift).trim().toLowerCase();
      if (s.includes('integral')) return 'Tempo Integral';
      if (s.includes('vesp')) return 'Tempo Parcial (Vespertino)';
      if (s.includes('mat')) return 'Tempo Parcial (Matutino)';
      if (s.includes('parcial')) return 'Tempo Parcial (Matutino)';
      return 'Tempo Parcial (Matutino)';
    }

    function getMECShiftBadgeHtml(shift) {
      const formatted = formatMECShift(shift);
      if (formatted === 'Tempo Integral') {
        return '<span class="status-badge" style="background:#FAF5FF; color:#7C3AED; border:1px solid #DDD6FE; font-weight:700;">🌟 Tempo Integral</span>';
      } else if (formatted === 'Tempo Parcial (Vespertino)') {
        return '<span class="status-badge" style="background:#EFF6FF; color:#1E40AF; border:1px solid #BFDBFE; font-weight:700;">⛅ Tempo Parcial (Vespertino)</span>';
      } else {
        return '<span class="status-badge" style="background:#EFF6FF; color:#1E40AF; border:1px solid #BFDBFE; font-weight:700;">☀️ Tempo Parcial (Matutino)</span>';
      }
    }

    // --- 1.2 CATÁLOGO CANÔNICO DE TURMAS DA REDE MUNICIPAL (PILAR 1, PILAR 4 & PILAR 13) ---
    const INITIAL_CLASSES = [
      {
        id: 'cls-pml-01',
        name: 'Infantil I - Turma A',
        school: 'CEI Professora Maria de Lourdes',
        stage: 'Infantil I',
        shift: 'Tempo Parcial (Matutino)',
        teachers: ['Ana Carolina Silva'],
        totalStudents: 25,
        inclusiveStudents: 1
      },
      {
        id: 'cls-pml-02',
        name: 'Berçário II - Turma Única',
        school: 'CEI Professora Maria de Lourdes',
        stage: 'Berçário II',
        shift: 'Tempo Parcial (Matutino)',
        teachers: ['Carla Beatriz Mendes'],
        totalStudents: 15,
        inclusiveStudents: 0
      },
      {
        id: 'cls-pml-03',
        name: 'Infantil II - Turma B',
        school: 'CEI Professora Maria de Lourdes',
        stage: 'Infantil II',
        shift: 'Tempo Parcial (Vespertino)',
        teachers: ['Juliana Roberta Rocha'],
        totalStudents: 24,
        inclusiveStudents: 2
      },
      {
        id: 'cls-pml-04',
        name: 'Maternal II - Turma Integral',
        school: 'CEI Professora Maria de Lourdes',
        stage: 'Maternal II',
        shift: 'Tempo Integral',
        teachersMorning: ['Mariana Santos', 'Roberta Dias'],
        teachersAfternoon: ['Patricia Souza', 'Camila Vasconcelos'],
        teachers: ['Mariana Santos', 'Roberta Dias', 'Patricia Souza', 'Camila Vasconcelos'],
        totalStudents: 20,
        inclusiveStudents: 1
      },
      {
        id: 'cls-pp-01',
        name: 'Maternal I - Turma A',
        school: 'EMEI Pequeno Príncipe',
        stage: 'Maternal I',
        shift: 'Tempo Parcial (Matutino)',
        teachers: ['Fernanda Lima'],
        totalStudents: 22,
        inclusiveStudents: 1
      },
      {
        id: 'cls-pp-02',
        name: 'Infantil I - Turma B',
        school: 'EMEI Pequeno Príncipe',
        stage: 'Infantil I',
        shift: 'Tempo Parcial (Vespertino)',
        teachers: ['Luciana Ramos'],
        totalStudents: 26,
        inclusiveStudents: 0
      },
      {
        id: 'cls-vz-01',
        name: 'Maternal II - Turma Única',
        school: 'CEI Vovó Zezé',
        stage: 'Maternal II',
        shift: 'Tempo Integral',
        teachersMorning: [],
        teachersAfternoon: [],
        teachers: [],
        totalStudents: 18,
        inclusiveStudents: 1
      }
    ];

    // Helper de Resolução e Resiliência de Turmas por Unidade Escolar
    function getClassesForSchool(schoolName) {
      if (!appState.classes || !Array.isArray(appState.classes) || appState.classes.length === 0) {
        appState.classes = JSON.parse(JSON.stringify(INITIAL_CLASSES));
      }
      if (!appState.deletedClassIds) appState.deletedClassIds = [];
      const deletedIds = appState.deletedClassIds;

      // Blindagem resiliente: assegura que turmas canônicas de INITIAL_CLASSES constem no estado (a menos que deletadas)
      INITIAL_CLASSES.forEach(initC => {
        if (deletedIds.includes(initC.id)) return;
        const found = appState.classes.find(c => c.id === initC.id);
        if (!found) {
          appState.classes.push(JSON.parse(JSON.stringify(initC)));
        } else {
          // Atualiza / preserva atributos específicos de turnos se presentes no canônico
          if (initC.teachersMorning && (!found.teachersMorning || found.teachersMorning.length === 0)) {
            found.teachersMorning = [...initC.teachersMorning];
          }
          if (initC.teachersAfternoon && (!found.teachersAfternoon || found.teachersAfternoon.length === 0)) {
            found.teachersAfternoon = [...initC.teachersAfternoon];
          }
        }
      });
      let schoolClasses = appState.classes.filter(c => c.school === schoolName && !deletedIds.includes(c.id));

      // Resiliência transparente: se a escola não possuir turmas cadastradas explicitamente,
      // gera agrupamentos a partir das professoras vinculadas à unidade em teamMembers
      if (schoolClasses.length === 0) {
        // Docentes já alocadas em turmas existentes não devem gerar novas turmas
        const allocatedTeachers = new Set();
        (appState.classes || []).forEach(c => {
          (c.teachers || []).forEach(t => allocatedTeachers.add(t));
        });

        const teachersInSchool = (appState.teamMembers || []).filter(m => 
          m.school === schoolName && 
          m.roleKey === 'professora' &&
          !allocatedTeachers.has(m.name)
        );

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
            shift: 'Tempo Parcial (Matutino)',
            teachers: groups[grpName],
            totalStudents: 22,
            inclusiveStudents: 1
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
            shift: 'Tempo Parcial (Matutino)',
            teachers: [],
            totalStudents: 20,
            inclusiveStudents: 1
          };
          appState.classes.push(autoCls);
          schoolClasses.push(autoCls);
        });
      }

      return schoolClasses;
    }

    // Initial Polos Regionais (SSOT Territorial)
    const INITIAL_POLOS = [
      { id: 'polo-1', name: 'Polo Regional 1 (Norte)', region: 'Região Norte / Bairros Urbanos' },
      { id: 'polo-2', name: 'Polo Regional 2 (Sul)', region: 'Região Sul / Zona Rural' },
      { id: 'polo-3', name: 'Polo Regional 3 (Leste)', region: 'Região Leste' },
      { id: 'polo-4', name: 'Sede Central', region: 'Sede Central da Educação Infantil' }
    ];

    // Initial School Units (UEs) & Polos
    const INITIAL_UNITS = [
      { id: 'ue-1', name: 'CEI Professora Maria de Lourdes', polo: 'Polo Regional 1 (Norte)', address: 'Bairro Alto das Flores', totalStudents: 120, inclusiveStudents: 6, totalClasses: 4 },
      { id: 'ue-2', name: 'EMEI Pequeno Príncipe', polo: 'Polo Regional 1 (Norte)', address: 'Vila Esperança', totalStudents: 95, inclusiveStudents: 4, totalClasses: 3 },
      { id: 'ue-3', name: 'CEI Vovó Zezé', polo: 'Polo Regional 2 (Sul)', address: 'Jardim do Sertão', totalStudents: 60, inclusiveStudents: 2, totalClasses: 2 }
    ];

    // Initial Team Members
    const INITIAL_TEAM = [
      { id: 'usr-1', name: 'Ana Carolina Silva', roleKey: 'professora', roleTitle: 'Professora', school: 'CEI Professora Maria de Lourdes', supervisor: 'Mariana Ferreira', classAssigned: 'Infantil I - Turma A' },
      { id: 'usr-2', name: 'Carla Beatriz Mendes', roleKey: 'professora', roleTitle: 'Professora', school: 'CEI Professora Maria de Lourdes', supervisor: 'Mariana Ferreira', classAssigned: 'Berçário II - Turma Única' },
      { id: 'usr-3', name: 'Juliana Roberta Rocha', roleKey: 'professora', roleTitle: 'Professora', school: 'CEI Professora Maria de Lourdes', supervisor: 'Mariana Ferreira', classAssigned: 'Infantil II - Turma B' },
      { id: 'usr-4', name: 'Fernanda Lima', roleKey: 'professora', roleTitle: 'Professora', school: 'EMEI Pequeno Príncipe', supervisor: 'Sônia Regina Alcantara', classAssigned: 'Maternal I - Turma A' },
      { id: 'usr-5', name: 'Mariana Ferreira', roleKey: 'coordenador', roleTitle: 'Coordenadora Pedagógica', school: 'CEI Professora Maria de Lourdes', supervisor: 'Clarice Barbosa' },
      { id: 'usr-6', name: 'Sônia Regina Alcantara', roleKey: 'coordenador', roleTitle: 'Coordenadora Pedagógica', school: 'EMEI Pequeno Príncipe', supervisor: 'Clarice Barbosa' },
      { id: 'usr-7', name: 'Clarice Barbosa', roleKey: 'formador', roleTitle: 'Formadora Pedagógica', school: 'Polo Regional 1 (Norte)', supervisor: 'Helena Martins' },
      { id: 'usr-8', name: 'Luciana Ramos', roleKey: 'professora', roleTitle: 'Professora', school: 'EMEI Pequeno Príncipe', supervisor: 'Sônia Regina Alcantara', classAssigned: 'Infantil I - Turma B' },
      { id: 'usr-9', name: 'Mariana Santos', roleKey: 'professora', roleTitle: 'Professora', school: 'CEI Professora Maria de Lourdes', supervisor: 'Mariana Ferreira', classAssigned: 'Maternal II - Turma Integral' },
      { id: 'usr-10', name: 'Roberta Dias', roleKey: 'professora', roleTitle: 'Professora', school: 'CEI Professora Maria de Lourdes', supervisor: 'Mariana Ferreira', classAssigned: 'Maternal II - Turma Integral' },
      { id: 'usr-11', name: 'Patricia Souza', roleKey: 'professora', roleTitle: 'Professora', school: 'CEI Professora Maria de Lourdes', supervisor: 'Mariana Ferreira', classAssigned: 'Maternal II - Turma Integral' },
      { id: 'usr-12', name: 'Camila Vasconcelos', roleKey: 'professora', roleTitle: 'Professora', school: 'CEI Professora Maria de Lourdes', supervisor: 'Mariana Ferreira', classAssigned: 'Maternal II - Turma Integral' }
    ];

    // Mapa de Resolução Canônica de Nomes (Hard Users & Padrões)
    const KNOWN_USERS_MAP = {
      'bruno': 'Bruno Silva',
      'mariana': 'Mariana Ferreira',
      'clarice': 'Clarice Barbosa',
      'helena': 'Helena Martins',
      'rodrigo': 'Rodrigo Toledo',
      'usr-1': 'Ana Carolina Silva',
      'usr-2': 'Carla Beatriz Mendes',
      'usr-3': 'Juliana Roberta Rocha',
      'usr-4': 'Fernanda Lima',
      'usr-5': 'Mariana Ferreira',
      'usr-6': 'Sônia Regina Alcantara',
      'usr-7': 'Clarice Barbosa',
      'usr-8': 'Luciana Ramos',
      'usr-9': 'Mariana Santos',
      'usr-10': 'Roberta Dias',
      'usr-11': 'Patricia Souza',
      'usr-12': 'Camila Vasconcelos',
      'luciana ramos': 'Luciana Ramos',
      'mariana santos': 'Mariana Santos',
      'roberta dias': 'Roberta Dias',
      'patricia souza': 'Patricia Souza',
      'camila vasconcelos': 'Camila Vasconcelos'
    };

    function resolveCanonicalUserName(nameOrId) {
      if (!nameOrId) return '';
      const raw = String(nameOrId).trim().replace(/^"|"$/g, '');
      const key = raw.toLowerCase();
      if (KNOWN_USERS_MAP[key]) return KNOWN_USERS_MAP[key];
      if (KNOWN_USERS_MAP[raw]) return KNOWN_USERS_MAP[raw];
      if (typeof USERS_DB !== 'undefined' && USERS_DB[key] && USERS_DB[key].name) {
        return USERS_DB[key].name;
      }
      return raw;
    }

    // Initial Qualitative Formative Notes (Self-reminders)
    const INITIAL_NOTES = [
      {
        id: 'not-001',
        date: '2026-09-28',
        schoolName: 'CEI Professora Maria de Lourdes',
        className: 'Infantil I - Turma A',
        classId: 'cls-pml-01',
        targetType: 'turma',
        teacherName: 'Ana Carolina Silva',
        teachers: ['Ana Carolina Silva', 'Juliana Roberta Rocha'],
        reportedBy: 'Mariana Ferreira',
        topic: 'Organização da Rotina',
        content: 'Observou-se necessidade de ajustar o tempo de transição do refeitório; criar roda de cantiga enquanto os pequenos lavam as mãos.',
        resolved: false,
        isSample: true
      },
      {
        id: 'not-002',
        date: '2026-10-02',
        schoolName: 'EMEI Pequeno Príncipe',
        className: 'Maternal I - Turma A',
        classId: 'cls-pp-01',
        targetType: 'turma',
        teacherName: 'Fernanda Lima',
        teachers: ['Fernanda Lima'],
        reportedBy: 'Sônia Regina Alcantara',
        topic: 'Gestão do Espaço e Materiais',
        content: 'Cantos de leitura com pouca variedade de livros táteis para os bebês; articular reposição com a coordenação.',
        resolved: true,
        isSample: true
      }
    ];

    // Initial Schedules
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
        supervisor: 'Clarice Barbosa',
        status: 'planejado'
      }
    ];

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

