    // --- 1. REPOSITORY OF RUBRICS AND DIMENSIONS ---
    const DEFAULT_SECTIONS_TEACHER = [
  {
    key: 'estrategias',
    title: 'Estratégias Didáticas',
    subSections: [
      {
        id: '1.1',
        title: 'Ampliação de Repertório',
        criteria: [
          { id: '1.1.1', text: 'Realiza leitura ou contação de histórias.' },
          { id: '1.1.2', text: 'Faz uso de perguntas abertas para instigar a curiosidade, o pensamento, o diálogo, e a formulação de hipóteses pelas crianças?' },
          { id: '1.1.3', text: 'Utiliza materiais adequados ao tema e/ou à faixa etária.' },
          { id: '1.1.4', text: 'Utiliza abordagem lúdica (brincadeiras, jogos, cantigas) promovendo aprendizagens.' },
          { id: '1.1.5', text: 'Busca envolver todas ou a maior parte das crianças, citando nomes, chamando para participar, incluindo-as nas decisões.' },
          { id: '1.1.6', text: 'Apresenta conteúdos novos conectando com o cotidiano/ realidade de vida das crianças fora da Unidade Escolar.' }
        ]
      },
      {
        id: '1.2',
        title: 'Brincadeira',
        criteria: [
          { id: '1.2.1', text: 'Brincadeira livre: organiza previamente materiais, tempos e espaços destinados a essa vivência.' },
          { id: '1.2.2', text: 'Brincadeira livre: observa e acompanha as escolhas das crianças, intervindo com mediações sutis para ampliar a aprendizagem, realizando escuta ativa das crianças' },
          { id: '1.2.3', text: 'Brincadeira dirigida e jogos: professor organiza as brincadeiras mediando as ações com clareza permitindo a interação entre as crianças favorecendo o alcance dos objetivos propostos, realizando escuta ativa das crianças' }
        ]
      },
      {
        id: '1.3',
        title: 'Tipos de Práticas Pedagógicas',
        criteria: [
          { id: '1.3.1', text: 'Práticas que promovem expressão e comunicação (práticas relacionadas à oralidade, leitura, registros gráficos - desenhos, garatujas, letras, palavras, nome, textos coletivos, etc.)' },
          { id: '1.3.2', text: 'Práticas que promovem autonomia, autocuidado, autoconfiança' },
          { id: '1.3.3', text: 'Práticas que promovem imaginação, investigação, transformações e criação (práticas relacionadas à contagem oral, relações de quantidade, levantamento de hipóteses, registros numéricos, etc.)' },
          { id: '1.3.4', text: 'Práticas que promovem socialização: empatia, cooperação e autorregulação' }
        ]
      }
    ]
  },
  {
    key: 'gestao_grupo',
    title: 'Gestão do Grupo',
    subSections: [
      {
        id: '2.1',
        title: 'Tempo e Rotina',
        criteria: [
          { id: '2.1.1', text: 'A rotina diária do professor (impressa ou afixada) contempla a prática da leitura e/ou contação de história.' },
          { id: '2.1.2', text: 'Alterna entre momentos coletivos e individuais com fluidez.' },
          { id: '2.1.3', text: 'Garante tempo de qualidade para interações entre crianças.' },
          { id: '2.1.4', text: 'Evita tempos de espera; propõe atividades paralelas durante atendimentos individuais.' },
          { id: '2.1.5', text: 'Durante a rotina, o ritmo das crianças é respeitado — evita acelerar, interromper ou conter.' },
          { id: '2.1.6', text: 'A área externa é utilizada pelo menos por 30 minutos. (Aqui fazer observação das UE que contém apenas uma área externa)' },
          { id: '2.1.7', text: 'As crianças não são deixadas sozinhas por mais de 5 minutos.' }
        ]
      },
      {
        id: '2.2',
        title: 'Espaço',
        criteria: [
          { id: '2.2.1', text: 'Organizar agrupamentos variados (duplas, trios, grandes grupos)' },
          { id: '2.2.2', text: 'Propõe atividades na área externa com organização e segurança para exploração ativa e segura e por pelo menos 30 minutos' }
        ]
      },
      {
        id: '2.3',
        title: 'Materiais',
        criteria: [
          { id: '2.3.1', text: 'Permite acesso livre aos materiais para criação e brincadeira.' },
          { id: '2.3.2', text: 'Seleciona os materiais de acordo com a proposta e faixa etária — a maioria das crianças consegue usar com autonomia.' },
          { id: '2.3.3', text: 'Há cartazes/painéis na parede na altura das crianças com intenção de retomar rotinas, registros e combinados feitos com elas. (Rotina, Calendário, Chamadinha, Palavras do Cotidiano, Alfabetos, Números)' },
          { id: '2.3.4', text: 'Os materiais estão acessíveis às crianças e são utilizados com intenção pedagógica (riscadores, pinceis, tintas, materiais não estruturados, brinquedos, blocos lógicos, alfabetos e números móveis), de forma variada, e favorecem a criação por parte das crianças.' }
        ]
      }
    ]
  },
  {
    key: 'mediacao_individual',
    title: 'Mediação Individual',
    subSections: [
      {
        id: '3',
        title: 'Mediação Individual',
        criteria: [
          { id: '3.1', text: 'Propõe estratégias para apoiar a criança que não consegue realizar a atividade.' },
          { id: '3.2', text: 'Estimula a autoconfiança e autonomia para realizar a atividade sem antecipar soluções.' },
          { id: '3.3', text: 'Atende com sensibilidade crianças com deficiência.' },
          { id: '3.4', text: 'Usa cantinhos ou pequenos grupos para mediação individualizada.' },
          { id: '3.5', text: 'Dar feedback para as produções individuais das crianças estimulando a autoconfiança e a autonomia.' }
        ]
      }
    ]
  },
  {
    key: 'respeito_integridade',
    title: 'Respeito e Proteção à Integridade',
    subSections: [
      {
        id: '4.1',
        title: 'Interações Verbais e Físicas',
        criteria: [
          { id: '4.1.1', text: 'Realiza interações verbais negativas.' },
          { id: '4.1.2', text: 'Utiliza interações físicas inadequadas.' }
        ]
      },
      {
        id: '4.2',
        title: 'Questões Étnico-raciais e de Gênero',
        criteria: [
          { id: '4.2.1', text: 'Respeita a diversidade étnico-racial: Não faz estigmatização ou ofensas.' },
          { id: '4.2.2', text: 'Respeita a diversidade de gênero: Não faz estigmatização ou ofensas.' },
          { id: '4.2.3', text: 'Respeita pessoas com deficiência: Não faz estigmatização ou ofensas.' },
          { id: '4.2.4', text: 'Promove discussões e reflexões que fortalecem o respeito às diferenças, a empatia e o pensamento crítico, reconduzindo de forma educativa e acolhedora comportamentos discriminatórios e incentivando atitudes respeitosas' }
        ]
      },
      {
        id: '4.3',
        title: 'Gestão de Conflitos',
        criteria: [
          { id: '4.3.1', text: 'Percebe conflitos e escuta com empatia (abaixa na altura da criança, chama pelo nome, olha nos olhos).' },
          { id: '4.3.2', text: 'Nomeia sentimentos e busca compreender as necessidades das crianças.' },
          { id: '4.3.3', text: 'Oferece mediações respeitosas e construtivas.' }
        ]
      },
      {
        id: '4.4',
        title: 'Segurança Física da Criança',
        criteria: [
          { id: '4.4.1', text: 'Verifica o espaço antes da chegada das crianças, retirando ou (re)posicionando objetos perigosos ou inadequados. (Tapetes, cadeiras e brinquedos de forma a evitar tropeços e escorregões.)' },
          { id: '4.4.2', text: 'Interrompe prontamente situações de risco físico, como empurrões, quedas ou uso indevido de brinquedos.' },
          { id: '4.4.3', text: 'Oferece ajuda durante a alimentação e troca, com cuidado e atenção individualizada.' }
        ]
      }
    ]
  },
  {
    key: 'gestao_cuidados',
    title: 'Gestão dos Cuidados e Promoção da Autonomia',
    subSections: [
      {
        id: '5',
        title: 'Gestão dos Cuidados',
        criteria: [
          { id: '5.1', text: 'Há acompanhamento adulto nos momentos de cuidado e transição entre espaços e ações.' },
          { id: '5.2', text: 'Incentiva práticas de higiene com apoio e orientação (ex: lavar as mãos antes das refeições).' },
          { id: '5.3', text: 'Estimula que as crianças organizem pertences, limpem-se e sirvam-se quando possível.' }
        ]
      }
    ]
  }
];

const DEFAULT_SECTIONS_COORDINATOR = [
  {
    key: 'planejamento',
    title: 'Acompanhamento do Planejamento Didático Pedagógico',
    subSections: [
      {
        id: '1',
        title: 'Gestão do Planejamento',
        criteria: [
          { id: '1.1', text: 'Realiza acompanhamento da construção dos planos de aula dos professores?' },
          { id: '1.2', text: 'Realiza feedbacks pedagógicos sobre os planos de aula?' },
          { id: '1.3', text: 'Acompanha a execução das propostas previstas nos planos de aula?' },
          { id: '1.4', text: 'Identifica avanços na prática docente a partir das feedbacks realizadas?' }
        ]
      }
    ]
  },
  {
    key: 'pratica_docente',
    title: 'Acompanhamento da Prática Docente',
    subSections: [
      {
        id: '2',
        title: 'Acompanhamento',
        criteria: [
          { id: '2.1', text: 'Consegue acompanhar a maioria das turmas por mês?' },
          { id: '2.2', text: 'Realiza devolutivas individuais aos professores?' },
          { id: '2.3', text: 'Propõe estratégias para o fortalecimento da prática pedagógica diante das dificuldades identificadas' },
          { id: '2.4', text: 'Utiliza estratégias para apoiar professores com maiores dificuldades?' }
        ]
      }
    ]
  },
  {
    key: 'formacoes',
    title: 'Implementação das Formações',
    subSections: [
      {
        id: '3',
        title: 'Formações',
        criteria: [
          { id: '3.1', text: 'Identifica no acompanhamento do trabalho docente a implementação das orientações formativas desenvolvidas?' },
          { id: '3.2', text: 'Incentiva a socialização de boas práticas?' }
        ]
      }
    ]
  },
  {
    key: 'qualificacao',
    title: 'Qualificação das Práticas',
    subSections: [
      {
        id: '4',
        title: 'Orientações',
        criteria: [
          { id: '4.1', text: 'Orientação quanto à organização da rotina' },
          { id: '4.2', text: 'Orientação quanto às brincadeiras e interações' },
          { id: '4.3', text: 'Orientação quanto à documentação pedagógica' }
        ]
      }
    ]
  },
  {
    key: 'acolhimento',
    title: 'Acolhimento e bem-estar das crianças',
    subSections: [
      {
        id: '5',
        title: 'Bem-estar',
        criteria: [
          { id: '5.1', text: 'Há planejamento e organização intencional para a chegada e a recepção das crianças e de suas famílias?' },
          { id: '5.2', text: 'É observado relações afetivas e respeitosas entre adultos e crianças?' }
        ]
      }
    ]
  },
  {
    key: 'ambientes_externos',
    title: 'Observação dos ambientes externos',
    subSections: [
      {
        id: '6',
        title: 'Ambientes',
        criteria: [
          { id: '6.1', text: 'Produções feitas pelas crianças estão expostas em diversos espaços das UEs?' },
          { id: '6.2', text: 'Cardápio disponível a altura da criança?' },
          { id: '6.3', text: 'Existem condições materiais seguras (sem colocar a criança em risco)?' }
        ]
      }
    ]
  },
  {
    key: 'relacao',
    title: 'Relação coordenação/professores',
    subSections: [
      {
        id: '7',
        title: 'Relação',
        criteria: [
          { id: '7.1', text: 'Disponibilidade para apoiar os professores' },
          { id: '7.2', text: 'Escuta ativa' },
          { id: '7.3', text: 'Postura colaborativa' },
          { id: '7.4', text: 'Clareza nas orientações' },
          { id: '7.5', text: 'Incentivo à autonomia docente' }
        ]
      }
    ]
  }
];
function getActiveSections(obs) {
  if (!obs) return appState.activeSectionsTeacher || DEFAULT_SECTIONS_TEACHER;
  return obs.evaluatedType === "coordenador" ? (appState.activeSectionsCoordinator || DEFAULT_SECTIONS_COORDINATOR) : (appState.activeSectionsTeacher || DEFAULT_SECTIONS_TEACHER);
}

    const SYNTHESIS_LEVELS = [
      { level: 1, title: 'Nível 1: Uso exclusivo de folhas pré-prontas (xerox)', desc: 'Atividades totalmente estruturadas (ligue, pinte, complete) sem variação ou escolha de materiais pelas crianças.' },
      { level: 2, title: 'Nível 2: Uso predominante de folhas estruturadas', desc: 'A maior parte do tempo em folhas estruturadas, com poucas e breves produções expressivas livres.' },
      { level: 3, title: 'Nível 3: Uso regular de materiais expressivos diversificados', desc: 'A criança tem acesso e seleciona materiais como papéis de diferentes texturas, lápis de cor, tintas e colagens.' },
      { level: 4, title: 'Nível 4: Uso bi e tridimensional rico com intencionalidade', desc: 'Acesso amplo e autônomo a argila, massinha, madeira, tecidos, tintas naturais e elementos da natureza.' }
    ];

    const SYNTHESIS_MATERIALS = [
      'Folhas pré-prontas (xerox e apostilados)',
      'Materiais bidimensionais (papel, lápis, giz, tintas)',
      'Materiais tridimensionais (argila, massinha, blocos de madeira, sucatas)',
      'Combinação equilibrada de diferentes suportes e materiais naturais'
    ];

    const SYNTHESIS_ORGANIZATION = [
      'Atividades padronizadas para todos simultaneamente',
      'Pequenos grupos com atividades diversificadas e cantos',
      'Propostas de livre escolha e pesquisa pelas crianças',
      'Rodas de conversa e interação dialógica coletiva'
    ];

    // Base Única de Usuários (Autenticação + Perfil)
    let USERS_DB = {
      bruno: {
        id: 'bruno',
        email: 'bruno.silva@lepes.org',
        password: '123456',
        name: 'Bruno Silva',
        roleKey: 'nucleo_ei',
        roleTitle: 'Administrador do Sistema (Núcleo de EI)',
        avatarText: 'BS',
        school: 'Geral',
        supervisor: 'Nenhum'
      },
      mariana: {
        id: 'mariana',
        email: 'mariana@teste.com',
        password: '123456',
        name: 'Mariana Ferreira',
        roleKey: 'coordenador',
        roleTitle: 'Coordenação Pedagógica',
        avatarText: 'CP',
        school: 'CEI Professora Maria de Lourdes',
        supervisor: 'Clarice Barbosa'
      },
      clarice: {
        id: 'clarice',
        email: 'clarice@teste.com',
        password: '123456',
        name: 'Clarice Barbosa',
        roleKey: 'formador',
        roleTitle: 'Formadora Pedagógica',
        avatarText: 'FP',
        school: 'Polo Regional 1 (Norte)',
        supervisor: 'Helena Martins'
      },
      helena: {
        id: 'helena',
        email: 'helena@teste.com',
        password: '123456',
        name: 'Helena Martins',
        roleKey: 'nucleo_ei',
        roleTitle: 'Coordenadora do Núcleo de EI',
        avatarText: 'NE',
        school: 'Secretaria Municipal de Educação',
        supervisor: 'Secretário de Educação'
      },
      rodrigo: {
        id: 'rodrigo',
        email: 'rodrigo@teste.com',
        password: '123456',
        name: 'Rodrigo Toledo',
        roleKey: 'nucleo_ei',
        roleTitle: 'Núcleo de EI (Governança & Dados)',
        avatarText: 'NE',
        school: 'Núcleo de Educação Infantil',
        supervisor: 'Helena Martins'
      }
    };

    // Helper canônico global de resolução de perfil do Núcleo de Educação Infantil (Retrocompatível com 'tecnico')
    function isNucleoEI(user) {
      if (!user) return false;
      const key = typeof user === 'string' ? user : (user.roleKey || '');
      return key === 'nucleo_ei' || key === 'tecnico';
    }

    // Helper canônico global para identificação de turmas em Tempo Integral (Pilar 4)
    function isClassIntegral(target) {
      if (!target) return false;
      if (typeof target === 'string') {
        return target.toLowerCase().includes('integral');
      }
      const shiftStr = target.classShift || target.shift || target.name || '';
      return shiftStr.toLowerCase().includes('integral');
    }

