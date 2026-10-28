    // --- 3. SEED SAMPLE OBSERVATION DATA ---
    function seedSampleData() {
      if (!appState.customUsers) appState.customUsers = {};
      Object.assign(USERS_DB, appState.customUsers);
      appState.activeSectionsTeacher = JSON.parse(JSON.stringify(DEFAULT_SECTIONS_TEACHER)); appState.activeSectionsCoordinator = JSON.parse(JSON.stringify(DEFAULT_SECTIONS_COORDINATOR));
      appState.polos = JSON.parse(JSON.stringify(INITIAL_POLOS));
      appState.units = JSON.parse(JSON.stringify(INITIAL_UNITS));
      appState.teamMembers = JSON.parse(JSON.stringify(INITIAL_TEAM));
      appState.classes = JSON.parse(JSON.stringify(INITIAL_CLASSES));
      appState.deletedClassIds = [];
      appState.notes = JSON.parse(JSON.stringify(INITIAL_NOTES));
      appState.schedules = JSON.parse(JSON.stringify(INITIAL_SCHEDULES));
      appState.observations = [
        {
          id: 'obs-001',
          evaluatedType: 'professora',
          teacherName: 'Ana Carolina Silva',
          className: 'Infantil I - Turma A',
          schoolName: 'CEI Professora Maria de Lourdes',
          evaluatedBy: 'Mariana Ferreira',
          bimester: '1º Bimestre',
          academicYear: '2026',
          date: '2026-03-12',
          startTime: '08:00',
          endTime: '09:45',
          durationMinutes: 105,
          status: 'finalized',
          synthesisMaterialDimension: 2,
          synthesisPredominant: 'Folhas pré-prontas (xerox e apostilados)',
          synthesisOrg: 'Atividades padronizadas para todos simultaneamente',
          comments: 'Diagnóstico inicial do 1º Bimestre: professora acolhedora, com necessidade de ampliar materiais concretos.',
          responses: {
            '1.1.1': 'partial', '1.1.2': 'not_done', '1.1.3': 'partial', '1.1.4': 'consistent', '1.1.5': 'partial',
            '1.2.1': 'partial', '1.2.2': 'not_done', '1.3.1': 'partial', '1.3.2': 'partial',
            '2.1.1': 'consistent', '2.1.2': 'partial', '2.1.4': 'not_done', '2.2.1': 'not_done', '2.3.1': 'na',
            '3.1': 'partial', '3.2': 'not_done', '3.3': 'consistent', '3.4': 'not_done',
            '4.1.1': 'consistent', '4.1.2': 'consistent', '4.2.1': 'consistent', '4.2.4': 'partial', '4.3.1': 'partial', '4.4.1': 'consistent',
            '5.1': 'consistent', '5.2': 'consistent', '5.3': 'partial'
          },
          criterionComments: {
            '1.1.2': 'Poucas perguntas abertas no momento da roda.',
            '2.3.1': 'Materiais guardados no armário neste dia.'
          },
          photos: {},
          linkedNotes: []
        },
        {
          id: 'obs-002',
          evaluatedType: 'professora',
          teacherName: 'Ana Carolina Silva',
          className: 'Infantil I',
          schoolName: 'CEI Professora Maria de Lourdes',
          evaluatedBy: 'Mariana Ferreira',
          bimester: '2º Bimestre',
          date: '2026-05-20',
          startTime: '08:15',
          endTime: '10:00',
          durationMinutes: 105,
          status: 'finalized',
          synthesisMaterialDimension: 3,
          synthesisPredominant: 'Materiais bidimensionais (papel, lápis, giz, tintas)',
          synthesisOrg: 'Pequenos grupos com atividades diversificadas e cantos',
          comments: 'Avanço nítido: incorporou cantos de leitura e tintas naturais.',
          responses: {
            '1.1.1': 'consistent', '1.1.2': 'partial', '1.1.3': 'consistent', '1.1.4': 'consistent', '1.1.5': 'consistent',
            '1.2.1': 'consistent', '1.2.2': 'partial', '1.3.1': 'consistent', '1.3.2': 'consistent',
            '2.1.1': 'consistent', '2.1.2': 'consistent', '2.1.4': 'partial', '2.2.1': 'consistent', '2.3.1': 'consistent',
            '3.1': 'consistent', '3.2': 'partial', '3.3': 'consistent', '3.4': 'partial',
            '4.1.1': 'consistent', '4.1.2': 'consistent', '4.2.1': 'consistent', '4.2.4': 'consistent', '4.3.1': 'consistent', '4.4.1': 'consistent',
            '5.1': 'consistent', '5.2': 'consistent', '5.3': 'consistent'
          },
          criterionComments: {},
          photos: {},
          linkedNotes: ['Ajuste da transição entre atividades acolheu as crianças mais agitadas.']
        },
        {
          id: 'obs-003',
          evaluatedType: 'professora',
          teacherName: 'Juliana Roberta Rocha',
          className: 'Infantil II',
          schoolName: 'CEI Professora Maria de Lourdes',
          evaluatedBy: 'Mariana Ferreira',
          bimester: '4º Bimestre',
          date: '2026-10-06',
          startTime: '08:00',
          endTime: '09:30',
          durationMinutes: 90,
          status: 'draft',
          synthesisMaterialDimension: null,
          synthesisPredominant: null,
          synthesisOrg: null,
          comments: '',
          responses: {
            '1.1.1': 'consistent', '1.1.2': 'partial', '1.1.3': 'consistent'
          },
          criterionComments: {},
          photos: {},
          linkedNotes: []
        },
        {
          id: 'obs-004',
          evaluatedType: 'professora',
          teacherName: 'Fernanda Lima',
          className: 'Maternal I - Turma A',
          schoolName: 'EMEI Pequeno Príncipe',
          evaluatedBy: 'Sônia Regina Alcantara',
          bimester: '1º Bimestre',
          date: '2026-03-18',
          startTime: '08:00',
          endTime: '09:40',
          durationMinutes: 100,
          status: 'finalized',
          synthesisMaterialDimension: 3,
          synthesisPredominant: 'Materiais tridimensionais e estruturados',
          synthesisOrg: 'Grandes grupos com atividades coletivas',
          comments: 'Prática expressiva e acolhedora em linguagem e contação; rotinas e cantos em estruturação.',
          responses: {
            '1.1.1': 'consistent', '1.1.2': 'consistent', '1.1.3': 'consistent', '1.1.4': 'consistent', '1.1.5': 'consistent',
            '1.2.1': 'consistent', '1.2.2': 'consistent', '1.3.1': 'consistent', '1.3.2': 'consistent',
            '2.1.1': 'partial', '2.1.2': 'not_done', '2.1.4': 'not_done', '2.2.1': 'not_done', '2.3.1': 'partial',
            '3.1': 'consistent', '3.2': 'not_done', '3.3': 'consistent', '3.4': 'not_done',
            '4.1.1': 'consistent', '4.1.2': 'consistent', '4.2.1': 'consistent', '4.2.4': 'consistent', '4.3.1': 'consistent', '4.4.1': 'consistent',
            '5.1': 'consistent', '5.2': 'consistent', '5.3': 'consistent'
          },
          criterionComments: {
            '2.1.2': 'Cantos com materiais inacessíveis.',
            '2.2.1': 'Transição sem aviso prévio gerou agitação.'
          },
          photos: {},
          linkedNotes: []
        },
        {
          id: 'obs-005',
          evaluatedType: 'professora',
          teacherName: 'Fernanda Lima',
          className: 'Maternal I - Turma A',
          schoolName: 'EMEI Pequeno Príncipe',
          evaluatedBy: 'Sônia Regina Alcantara',
          bimester: '2º Bimestre',
          date: '2026-05-25',
          startTime: '08:00',
          endTime: '09:45',
          durationMinutes: 105,
          status: 'finalized',
          synthesisMaterialDimension: 3,
          synthesisPredominant: 'Materiais concretos e cantos de leitura',
          synthesisOrg: 'Pequenos grupos e cantos temáticos',
          comments: 'Evolução significativa na organização dos cantos e mediação.',
          responses: {
            '1.1.1': 'consistent', '1.1.2': 'consistent', '1.1.3': 'consistent', '1.1.4': 'consistent', '1.1.5': 'consistent',
            '1.2.1': 'consistent', '1.2.2': 'consistent', '1.3.1': 'consistent', '1.3.2': 'consistent',
            '2.1.1': 'consistent', '2.1.2': 'partial', '2.1.4': 'not_done', '2.2.1': 'partial', '2.3.1': 'consistent',
            '3.1': 'consistent', '3.2': 'not_done', '3.3': 'consistent', '3.4': 'not_done',
            '4.1.1': 'consistent', '4.1.2': 'consistent', '4.2.1': 'consistent', '4.2.4': 'consistent', '4.3.1': 'consistent', '4.4.1': 'consistent',
            '5.1': 'consistent', '5.2': 'consistent', '5.3': 'consistent'
          },
          criterionComments: {},
          photos: {},
          linkedNotes: ['Avanço na autonomia das crianças na hora da roda.']
        }
      ];
      saveState();
      renderHomeScreen();
      showToast('Dados do SerTão Criança recarregados!');
    }

    function resetDataPrompt() {
      appState.observations = [];
      appState.currentObs = null;
      appState.notes = [];
      saveState();
      renderHomeScreen();
      showToast('Banco de dados local reinicializado.');
    }

