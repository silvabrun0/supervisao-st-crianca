# PLANO DE IMPLEMENTAÇÃO: QUALIFICAÇÃO DE DOCENTES POR TURNO (MANHÃ/TARDE) EM TURMAS INTEGRAIS E HIGIENIZAÇÃO DA BASE DE DADOS

> **DIRETRIZ OBRIGATÓRIA DE EXECUÇÃO (ETAPA 2):**
> O assistente executor (Etapa 2) deve **obrigatoriamente ler e seguir as diretrizes dos arquivos `WORKFLOW_MACOS.md`, `WORKFLOW_GITHUB.md` e `AGENTS.md`** localizados na raiz do projeto antes de aplicar qualquer modificação no código. Nenhuma modificação deve ser realizada sem conformidade estrita com o workflow, incluindo:
> 1. Execução prévia de sincronização com o repositório remoto (`git pull origin main`).
> 2. Preservação integral das regras de negócio existentes, dados cadastrais, blindagens RBAC, série histórica e testes automatizados.
> 3. Verificação de integridade pós-edição com dupla checagem de leitura em cada trecho modificado.
> 4. Salvamento obrigatório do backup intermediário na pasta `intermediárias/` sob o nome `aplicativo_v112_qualificacao_docentes_turnos_turmas_integrais.html` (e espelho em subpastas caso aplicável).
> 5. Gestão dupla de Changelog no arquivo `CHANGELOG.md` e no modal `#modalChangelog` do `index.html`, registrando a **Versão 1.12**.
> 6. Sincronização idêntica entre o arquivo principal `index.html` da raiz, `gestor supervisao_patos/index.html` e `gestor supervisao_patos/firebase_deploy/public/index.html`.
> 7. Checagem pré-push (`git fetch origin main`), commit semântico (`feat: qualificacao de docentes por turno manha tarde em turmas integrais e higienizacao da base (v1.12)`), push para `origin main` e deploy automático no GitHub Pages.
> 8. Execução pós-deploy obrigatória do algoritmo de auditoria (`python3 audit_platform.py --silent-on-success`) com comunicação estrita a falhas.

---

## 1. Diagnóstico e Contexto

### 1.1 Cenário Atual
Atualmente, após a consolidação dos Pilares 1 a 11 do instrumento **SerTão Criança**:
1. **Inconsistência Cadastral na Base de Dados Inicial (`INITIAL_CLASSES` e `INITIAL_TEAM`):**
   - Docentes acumulam indevidamente turmas em turnos matutino e vespertino na mesma unidade, ou sobrepõem turmas parciais e integrais:
     - `Juliana Roberta Rocha` está alocada simultaneamente no *Infantil I - Turma A* (Matutino), no *Infantil II - Turma B* (Vespertino) e no quarteto do *Maternal II - Turma Integral*.
     - `Fernanda Lima` em EMEI Pequeno Príncipe está alocada no *Maternal I - Turma A* (Matutino) e no *Infantil I - Turma B* (Vespertino).
     - O *Maternal II - Turma Integral* no CEI Maria de Lourdes reutiliza todas as professoras das turmas de tempo parcial (`Ana Carolina Silva`, `Juliana Roberta Rocha`, `Carla Beatriz Mendes` e `Patricia Souza`), sem distinção de quem atua pela manhã ou pela tarde.
   - Na realidade da rede municipal de Patos/PB, cada docente regente titular atua com dedicação exclusiva em uma única turma/turno (ou turmas parciais de seu contrato), e turmas integrais possuem quartetos com turnos delimitados (2 de manhã e 2 de tarde).

2. **Ausência de Qualificação de Turno no Setup de Turmas Integrais:**
   - Na tela de Setup (`#screenSetup`), ao selecionar uma turma de Tempo Integral (`isClassIntegral`), o sistema exibe os 4 docentes em uma lista única e plana (`#setupClassTeachersList`), sem qualificar quem rege no turno matutino e quem rege no turno vespertino.
   - O observador não dispõe de mecanismo para definir ou remanejar a alocação dos 4 docentes entre a manhã e a tarde antes de iniciar a observação.

3. **Síntese Pedagógica Desorganizada e Atribuição Indiscriminada em Turmas Integrais:**
   - Na tela de Síntese (`#screenSynthesis`), o bloco de devoluvas e pareceres individuais dos docentes (`#synthesisTeachersSection`) lista todos os 4 professores em uma sequência contínua, sem agrupar por turno.
   - Durante a Etapa 1 (Turno Matutino), ao marcar um critério com nota parcial (`partial`), o seletor de atribuição do Pilar 5 exibe todos os 4 docentes da turma, permitindo erroneamente atribuir fragilidades da rotina da manhã a docentes que só assumem o grupo no período vespertino.

### 1.2 Deliberação do Usuário e Requisitos de Negócio
Conforme definido expressamente na deliberação interativa com o usuário:
1. **Higienização da Base Inicial (Opção 3):**
   - Nenhum docente deve atuar em duas unidades escolares distintas nem em turnos acumulados indevidos.
   - Cada turma parcial terá sua docente/dupla estrita (ex: `Ana Carolina` no Infantil I Matutino, `Carla Beatriz` no Berçário II Matutino, `Juliana Roberta` no Infantil II Vespertino, `Fernanda Lima` no Maternal I Matutino da EMEI Pequeno Príncipe e nova docente exclusiva `Luciana Ramos` no Infantil I Vespertino).
   - A turma integral modelo terá seu quarteto próprio e exclusivo: dupla matutina e dupla vespertina.
2. **Definição de Turnos no Início da Observação (Setup):**
   - Ao iniciar a observação de turma integral, o usuário poderá definir e qualificar quais docentes dos 4 integrais serão avaliados na manhã e quais serão avaliados na tarde.
   - A turma já traz uma qualificação canônica cadastrada (dupla matutina e dupla vespertina), mas o observador possui autonomia para remanejar no momento do setup através de interface amigável.
3. **Sequenciamento Estrito na Síntese Pedagógica (Manhã ➔ Tarde):**
   - Na Síntese, os apontamentos, ocorrências, avaliação das 5 dimensões e pareceres formativos serão apresentados e realizados primeiramente para cada docente do **Turno Matutino (Manhã)**, e em seguida para cada docente do **Turno Vespertino (Tarde)**.
4. **Atribuição Seletiva de Critérios Parciais por Etapa:**
   - Na observação da **Manhã** (Etapa 1), itens parciais só poderão ser atribuídos às duas docentes avaliadas na manhã.
   - Na observação da **Tarde** (Etapa 2), itens parciais poderão ser atribuídos aos 4 docentes da turma.

---

## 2. Arquitetura e Estruturas de Dados

### 2.1 Atualização de `INITIAL_CLASSES` e `INITIAL_TEAM`

```javascript
// Catálogo Canônico Higienizado de Turmas
const INITIAL_CLASSES = [
  {
    id: 'cls-pml-01',
    name: 'Infantil I - Turma A',
    school: 'CEI Professora Maria de Lourdes',
    stage: 'Infantil I',
    shift: 'Parcial Matutino',
    teachers: ['Ana Carolina Silva']
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
    id: 'cls-pml-04',
    name: 'Maternal II - Turma Integral',
    school: 'CEI Professora Maria de Lourdes',
    stage: 'Maternal II',
    shift: 'Integral',
    teachersMorning: ['Mariana Santos', 'Roberta Dias'],
    teachersAfternoon: ['Patricia Souza', 'Camila Vasconcelos'],
    teachers: ['Mariana Santos', 'Roberta Dias', 'Patricia Souza', 'Camila Vasconcelos']
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
    teachers: ['Luciana Ramos']
  },
  {
    id: 'cls-vz-01',
    name: 'Maternal II - Turma Única',
    school: 'CEI Vovó Zezé',
    stage: 'Maternal II',
    shift: 'Integral',
    teachersMorning: [],
    teachersAfternoon: [],
    teachers: []
  }
];

// Equipe Canônica de Profissionais
const INITIAL_TEAM = [
  { id: 'usr-1', name: 'Ana Carolina Silva', roleKey: 'professora', roleTitle: 'Professora', school: 'CEI Professora Maria de Lourdes', supervisor: 'Mariana Ferreira', classAssigned: 'Infantil I' },
  { id: 'usr-2', name: 'Carla Beatriz Mendes', roleKey: 'professora', roleTitle: 'Professora', school: 'CEI Professora Maria de Lourdes', supervisor: 'Mariana Ferreira', classAssigned: 'Berçário II' },
  { id: 'usr-3', name: 'Juliana Roberta Rocha', roleKey: 'professora', roleTitle: 'Professora', school: 'CEI Professora Maria de Lourdes', supervisor: 'Mariana Ferreira', classAssigned: 'Infantil II' },
  { id: 'usr-4', name: 'Fernanda Lima', roleKey: 'professora', roleTitle: 'Professora', school: 'EMEI Pequeno Príncipe', supervisor: 'Sônia Regina Alcantara', classAssigned: 'Maternal I' },
  { id: 'usr-5', name: 'Mariana Ferreira', roleKey: 'coordenador', roleTitle: 'Coordenadora Pedagógica', school: 'CEI Professora Maria de Lourdes', supervisor: 'Clarice Barbosa' },
  { id: 'usr-6', name: 'Sônia Regina Alcantara', roleKey: 'coordenador', roleTitle: 'Coordenadora Pedagógica', school: 'EMEI Pequeno Príncipe', supervisor: 'Clarice Barbosa' },
  { id: 'usr-7', name: 'Clarice Barbosa', roleKey: 'formador', roleTitle: 'Formadora Pedagógica', school: 'Polo Regional 1 (Norte)', supervisor: 'Helena Martins' },
  { id: 'usr-8', name: 'Luciana Ramos', roleKey: 'professora', roleTitle: 'Professora', school: 'EMEI Pequeno Príncipe', supervisor: 'Sônia Regina Alcantara', classAssigned: 'Infantil I' },
  { id: 'usr-9', name: 'Mariana Santos', roleKey: 'professora', roleTitle: 'Professora', school: 'CEI Professora Maria de Lourdes', supervisor: 'Mariana Ferreira', classAssigned: 'Maternal II' },
  { id: 'usr-10', name: 'Roberta Dias', roleKey: 'professora', roleTitle: 'Professora', school: 'CEI Professora Maria de Lourdes', supervisor: 'Mariana Ferreira', classAssigned: 'Maternal II' },
  { id: 'usr-11', name: 'Patricia Souza', roleKey: 'professora', roleTitle: 'Professora', school: 'CEI Professora Maria de Lourdes', supervisor: 'Mariana Ferreira', classAssigned: 'Maternal II' },
  { id: 'usr-12', name: 'Camila Vasconcelos', roleKey: 'professora', roleTitle: 'Professora', school: 'CEI Professora Maria de Lourdes', supervisor: 'Mariana Ferreira', classAssigned: 'Maternal II' }
];
```

### 2.2 Estrutura do Objeto de Observação (`appState.currentObs` / `newObs`)
```javascript
{
  id: 'obs-...',
  classId: 'cls-pml-04',
  className: 'Maternal II - Turma Integral',
  isIntegral: true,
  integralStage: 'matutino', // 'matutino' ➔ 'vespertino' ➔ 'concluido'
  // Alocação segregada de docentes por turno:
  teachersMorning: ['Mariana Santos', 'Roberta Dias'],
  teachersAfternoon: ['Patricia Souza', 'Camila Vasconcelos'],
  teachers: ['Mariana Santos', 'Roberta Dias', 'Patricia Souza', 'Camila Vasconcelos'],
  // ... demais campos existentes preservados ...
}
```

---

## 3. Especificação Passo a Passo das Modificações no Código

### Passo 1: Atualização da Base Canônica e Resiliência de Estado
- Atualizar `INITIAL_CLASSES` e `INITIAL_TEAM` no `index.html`.
- Em `KNOWN_USERS_MAP`, incluir chaves para as novas professoras (`usr-8`, `usr-9`, `usr-10`, `usr-11`, `usr-12` e nomes correspondentes).
- Atualizar a função de resiliência `getClassesForSchool(schoolName)` para carregar e preservar os atributos `teachersMorning` e `teachersAfternoon`.

### Passo 2: Interface Reativa de Qualificação no Setup (`#screenSetup`)
1. Variáveis globais de controle temporário no Setup:
   ```javascript
   let currentSetupIntegralMorningTeachers = [];
   let currentSetupIntegralAfternoonTeachers = [];
   ```
2. Em `onSetupClassChange()`:
   - Se a turma for integral (`isIntegral`):
     - Inicializa `currentSetupIntegralMorningTeachers` e `currentSetupIntegralAfternoonTeachers` a partir de `targetClass.teachersMorning` e `targetClass.teachersAfternoon`. Caso estejam ausentes, distribui a lista de `teachers` (primeiros 2 para manhã, demais para tarde).
     - Renderiza `#setupClassTeachersList` em dois grupos verticais distintos:
       - ☀️ **Turno Matutino (Manhã · 2 Docentes)**
       - 🌅 **Turno Vespertino (Tarde · 2 Docentes)**
     - Cada docente recebe um chip com seu nome e um botão interativo de transferência de turno:
       - Para manhã: botão `⇄ Passar p/ Tarde` (`moveTeacherToShift(teacherName, 'afternoon')`).
       - Para tarde: botão `⇄ Passar p/ Manhã` (`moveTeacherToShift(teacherName, 'morning')`).
   - Se for turma parcial: renderiza os chips de regência titular padrão.
3. Função auxiliar `moveTeacherToShift(teacherName, targetShift)`:
   - Alterna a docente entre as listas `currentSetupIntegralMorningTeachers` e `currentSetupIntegralAfternoonTeachers`.
   - Re-renderiza o bloco visual do card de regentes no Setup sem recarregar a tela inteira.
4. Em `startNewObservation()`:
   - Ao instanciar `newObs`:
     ```javascript
     if (isIntegral) {
       newObs.teachersMorning = [...currentSetupIntegralMorningTeachers];
       newObs.teachersAfternoon = [...currentSetupIntegralAfternoonTeachers];
       newObs.teachers = [...newObs.teachersMorning, ...newObs.teachersAfternoon];
     }
     ```

### Passo 3: Atribuição Seletiva de Itens Parciais por Etapa no Pilar 5 (`#screenActiveObs`)
- Na função que renderiza as opções de atribuição mandatória de item parcial (`renderPartialAttributionSection` ou equivalente em `togglePartialAttribution`):
  - Verificar a etapa ativa da observação:
    ```javascript
    let eligibleTeachers = obs.teachers || [];
    if (obs.isIntegral) {
      if (obs.integralStage === 'matutino') {
        // Na manhã, restringe estritamente às docentes avaliadas na manhã
        eligibleTeachers = (obs.teachersMorning && obs.teachersMorning.length > 0)
          ? obs.teachersMorning
          : eligibleTeachers.slice(0, 2);
      } else {
        // Na tarde, permite atribuir aos 4 docentes da turma integral
        eligibleTeachers = obs.teachers || [];
      }
    }
    ```
  - Exibir subtítulo orientador contextual no cabeçalho da gaveta de atribuição:
    - Se `obs.isIntegral && obs.integralStage === 'matutino'`: `☀️ Etapa Matutina: Atribuição restrita aos regentes da manhã`
    - Se `obs.isIntegral && obs.integralStage === 'vespertino'`: `🌅 Etapa Vespertina: Atribuição disponível para a equipe completa da turma (4 regentes)`

### Passo 4: Reorganização Sequencial da Síntese Pedagógica (`#screenSynthesis`)
- Na função `renderSynthesisScreen()`:
  - Localizar a seção 4 (`#synthesisTeachersSection` e `#synthesisTeacherCardsContainer`).
  - Se `obs.isIntegral`:
    - Criar dois contêineres sequenciais com cabeçalhos distintos:
      1. **Subseção 4.1 · ☀️ Turno Matutino (Docentes da Manhã):**
         - Título: `☀️ 1. Avaliação e Devolutiva dos Docentes da Manhã (Turno Matutino)`
         - Subtítulo: `Práticas pedagógicas, rotinas e mediações observadas no período matutino`
         - Renderiza exclusivamente os cards dos docentes listados em `obs.teachersMorning`.
         - Apresenta apontamentos de itens parciais vinculados a estas docentes.
         - Avaliação das 5 dimensões e Parecer Formativo individual da manhã.
      2. **Subseção 4.2 · 🌅 Turno Vespertino (Docentes da Tarde):**
         - Título: `🌅 2. Avaliação e Devolutiva dos Docentes da Tarde (Turno Vespertino)`
         - Subtítulo: `Práticas pedagógicas, rotinas e mediações observadas no período vespertino`
         - Se a observação estiver na Etapa 1 (`obs.integralStage === 'matutino'`), exibe aviso sutil informando que a devolutiva da tarde será preenchida na Etapa 2.
         - Renderiza os cards dos docentes listados em `obs.teachersAfternoon`.
         - Apresenta apontamentos de itens parciais vinculados a estas docentes.
         - Avaliação das 5 dimensões e Parecer Formativo individual da tarde.
  - Se for turma parcial regular:
    - Mantém a renderização dos cards das docentes da turma em lista única.

---

## 4. Seção Obrigatória de Auditoria (Modo-a-Modo)

Conforme estabelecido pelas diretrizes normativas do projeto (`WORKFLOW_MACOS.md` e `AGENTS.md`), as alterações propostas devem ser acompanhadas de cobertura efetiva de 100% no algoritmo de auditoria (`audit_platform.py` e engine de testes do `index.html`), estruturado modo-a-modo:

### 📦 Módulo 2: Catálogo Canônico, Escolas, Turmas, Professores e Estado Global
- **Adições:**
  - Validação da segregação de turnos em `INITIAL_CLASSES`: confirmação de que `cls-pml-04` possui `teachersMorning` e `teachersAfternoon` populados com 2 docentes cada.
  - Validação de exclusividade docente: asserção de que nenhuma docente está alocada em duas escolas distintas e de que as docentes de turmas parciais atuam estritamente em um turno.
  - Validação da presença dos novos membros em `INITIAL_TEAM` (`Luciana Ramos`, `Mariana Santos`, `Roberta Dias`, `Camila Vasconcelos`).

### 📦 Módulo 3: Setup de Observação, Seleção de Turmas e Ciclo Longitudinal (Pilar 1 & 4)
- **Alterações:**
  - No teste de Turma Integral (`Maternal II - Turma Integral`):
    - Validar que a seleção da turma renderiza os dois blocos de turno no card de regência (`☀️ Turno Matutino` e `🌅 Turno Vespertino`).
    - Simulação interativa de remanejamento/qualificação de docente entre os turnos via clique no botão `moveTeacherToShift`.
    - Asserção de que a inicialização da observação (`startNewObservation()`) grava com precisão `teachersMorning` e `teachersAfternoon` no objeto gerado em `appState.currentObs`.

### 📦 Módulo 4: Observação Ativa, Matrizes Curriculares, Rubricas e Pendências (Pilar 5)
- **Adições:**
  - Teste de Atribuição Parcial Seletiva na Etapa 1 (Matutino):
    - Com observação integral ativa na Etapa Matutina, marcação de um critério como `partial`.
    - Verificação de que as opções de docentes disponíveis para atribuição contêm estritamente as 2 docentes da manhã (`teachersMorning`), impedindo atribuição prematura às docentes da tarde.
  - Teste de Atribuição Parcial Seletiva na Etapa 2 (Vespertino):
    - Com a observação avançada para a Etapa Vespertina, marcação de outro critério como `partial`.
    - Verificação de que todas as 4 docentes da turma integral estão disponíveis para atribuição.

### 📦 Módulo 5: Síntese Pedagógica, Escala de Materiais, Finalização e Cálculo de Tempo
- **Alterações / Adições:**
  - Teste de Renderização Sequencial por Turno na Síntese Integral:
    - Verificação no DOM da existência dos dois blocos segregados de avaliação nominal: Bloco Matutino (Manhã) posicionado primeiro, seguido pelo Bloco Vespertino (Tarde).
    - Validação de que os cards de docentes da manhã aparecem no Bloco 4.1 e os da tarde no Bloco 4.2.
    - Persistência e integridade das notas das 5 dimensões e dos feedbacks individuais atribuídos a cada docente de cada turno.
