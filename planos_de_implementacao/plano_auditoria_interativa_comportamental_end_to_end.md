# PLANO DE IMPLEMENTAÇÃO: AUDITORIA INTERATIVA COMPORTAMENTAL END-TO-END (SIMULAÇÃO REAL DE AÇÕES DO USUÁRIO)

> **DIRETRIZ OBRIGATÓRIA DE EXECUÇÃO (ETAPA 2):**
> O assistente executor (Etapa 2) deve **obrigatoriamente ler e seguir as diretrizes dos arquivos `WORKFLOW_MACOS.md` e `AGENTS.md`** antes de aplicar qualquer alteração.
> 1. Preservar rigorosamente as regras de negócio existentes, dados cadastrais e blindagens de segurança.
> 2. Salvar cópia intermediária em `intermediárias/aplicativo_v94_auditoria_interativa_comportamental_end_to_end.html`.
> 3. Atualizar Changelog duplo (versão **0.94** no `CHANGELOG.md` e no `#modalChangelog` do `index.html`).
> 4. Sincronizar os arquivos espelhos `gestor supervisao_patos/index.html` e `gestor supervisao_patos/firebase_deploy/public/index.html`.
> 5. Checagem pré-push (`git fetch origin main`), commit semântico (`feat: reestruturar auditoria para simulacao comportamental real de acoes do usuario (v0.94)`), push para `origin main` e deploy automático no GitHub Pages.
> 6. Execução pós-deploy obrigatória do algoritmo de auditoria (`python3 audit_platform.py --silent-on-success`) com comunicação estrita a falhas.

---

## 1. Diagnóstico do Problema e Motivação

### 1.1 Por que falhas de interface (como a seleção de unidades) passaram despercebidas?
A auditoria anterior possuía 12 módulos cobrindo 100% dos subsistemas conceituais, mas operava majoritariamente em **nível de estado e funções isoladas de lógica**:
- As asserções invocavam funções diretamente passando parâmetros (`onSetupSchoolChange()`, `finalizeObservation()`, `calculateHierarchyStats()`) ou alteravam objetos em memória (`appState.currentUserKey = 'clarice'`, `appState.observations.push(...)`).
- Não havia simulação de **ciclo interativo humano real** (disparo de eventos de clique em botões do DOM, digitação em `<input>`, alternância de `<select>` com verificação de persistência de valor e reatividade cruzada de formulários).
- Quando o usuário tentava adicionar um novo profissional à rede, ao selecionar outra escola no `<select id="newMemberSchool">`, o evento nativo `change` reconstruía o HTML interno sem preservar o valor, revertendo imediatamente para a 1ª opção. Nenhuma asserção anterior realizava a ação completa: abrir o modal via clique/chamada UI, escolher uma opção diferente, disparar `change`, inspecionar o valor retido e submeter o formulário pelo botão de salvar.

### 1.2 Objetivo desta Refatoração da Auditoria
Transformar o motor de testes da plataforma SerTão Criança (`audit_platform.py` e a suíte inline em `index.html`) em uma **Auditoria Comportamental Interativa de Ponta a Ponta (End-to-End Simulation)**, onde cada módulo simula fielmente as ações físicas do usuário no DOM, desde a tela de login até a exportação e governança:
1. **Helper Canônico de Simulação de Eventos do Usuário:**
   - Criação de utilitários no logger/ambiente de teste:
     - `simulateInput(element, value)`: altera valor, dispara `input` e `change`.
     - `simulateSelect(selectElement, targetValue)`: seleciona o valor, dispara `change` e valida se o valor permaneceu selecionado após qualquer manipulação reativa de DOM.
     - `simulateClick(element)`: dispara `click` respeitando `event.stopPropagation()`.
2. **Cobertura Comportamental Modo-a-Modo (12 Módulos):**
   - **Módulo 1 (Auth, Login e Perfis):** Simular submissão do formulário de login (`#loginEmail`, `#loginPassword`, clique em Entrar), simular erro de credencial, login bem-sucedido, troca interativa de perfil via modal de perfis e verificação de adaptação do layout.
   - **Módulo 2 (Catálogo e Gestão de Pessoal/Unidades no DOM):** Simular abertura do modal de Novo Profissional (`#modalAddMember`), preenchimento de inputs, seleção reativa de cargo (`#newMemberRole`), seleção de escola (`#newMemberSchool`), clique em salvar cadastro (`saveNewTeamMember`), checagem do novo card/linha na tabela e posterior edição no modal de edição (`#modalEditMember`).
   - **Módulo 3 (Setup e Ciclo Longitudinal):** Simular clique em "NOVA OBSERVAÇÃO", seleção de escola, seleção de turma via evento `change`, verificação da vinculação de docentes, cálculo do bimestre e clique no botão primário `#btnStartObservation`.
   - **Módulo 4 (Observação Ativa e Interação com Rubricas):** Simular clique nos botões/radios de critérios pedagógicos (`consistent`, `partial`, `not_done`, `na`), preenchimento de justificativa/comentário e validação do sumiço da tarja de pendências (`#activeObsValidationBanner`).
   - **Módulo 5 (Síntese Pedagógica e Registro de Tempo):** Simular preenchimento interativo dos horários (`synthesisStartTime`, `synthesisEndTime`), clique nos seletores visuais de Uso de Materiais (Níveis 1 a 4), tipo predominante e organização, clique em finalizar observação e validação de bloqueios determinísticos.
   - **Módulo 6 (Travas, Duplo Lançamento e Ocorrências):** Simular tentativa de nova observação para turma já observada no bimestre (bloqueio), simular registro interativo de ocorrência de campo com abertura do modal `#modalQualitativeNote`, seleção de escola/turma/docente, digitação de texto e salvamento via clique.
   - **Módulo 7 (Acompanhamento da Formadora e Núcleo de EI):** Simular login como Formadora, setup com foco em Coordenadora Pedagógica, visualização de Matriz de Coordenação (7 dimensões), alternância para Núcleo de EI com visão onisciente e bloqueio de criação direta de avaliação.
   - **Módulo 8 (Agenda e Cronograma):** Simular abertura do modal de agendamento (`#modalAddSchedule`), seleção de escola/turma/data/horário, salvamento, verificação da linha na agenda e clique no botão de visualização de devolutiva com retorno contextual.
   - **Módulo 9 (Histórico e Filtros Interativos):** Simular digitação no campo de busca de histórico, alternância de filtros de turma e bimestre com disparo de eventos e validação da filtragem dinâmica dos cards.
   - **Módulo 10 (Painel de Indicadores e Benchmark):** Simular navegação nas abas 'kpis', 'drilldown' e 'longitudinal', interação com o seletor de Benchmark (UE vs. Rede), clique no atalho de "Raio-X Item a Item" de docente e limpeza de filtro.
   - **Módulo 11 (Backup, Exportação e Relatório de Impressão):** Simular acionamento do espelho de impressão, validação do payload JSON e testes de integridade estrutural.
   - **Módulo 12 (Navegação Global e Layout):** Simular cliques na barra de abas superior (`navigateToTab`), acionamento do menu mobile overlay e abertura/fechamento do modal de Changelog.

---

## 2. Detalhamento Arquitetural das Modificações

### 2.1 Utilitários de Simulação Interativa (Test Helpers)
Inserir na inicialização da suite de testes:
```javascript
const UI = {
  click: (el) => {
    if (!el) throw new Error('Elemento não encontrado para clique');
    el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  },
  select: (selectEl, value) => {
    if (!selectEl) throw new Error('Select não encontrado');
    selectEl.value = value;
    selectEl.dispatchEvent(new Event('change', { bubbles: true }));
    if (selectEl.value !== value) {
      throw new Error(`Falha de persistência interativa no select #${selectEl.id}: esperado "${value}", obtido "${selectEl.value}"`);
    }
  },
  type: (inputEl, text) => {
    if (!inputEl) throw new Error('Input não encontrado para digitação');
    inputEl.value = text;
    inputEl.dispatchEvent(new Event('input', { bubbles: true }));
    inputEl.dispatchEvent(new Event('change', { bubbles: true }));
  }
};
```

---

## 3. Seção Obrigatória de Auditoria: Alterações nos 12 Módulos

### Módulo 1: `auth_rbac`
- **Adição:** Simulação real do formulário de login (`handleLoginSubmit`) com credencial inválida (teste de rejeição) e credencial válida (`mariana@patos.pb.gov.br` / `123456`).
- **Adição:** Simulação interativa de troca de perfil pelo modal `#modalProfile` e `#modalRoleSelect`.

### Módulo 2: `catalogo_dados`
- **Adição:** Ciclo de vida completo do cadastro de novo profissional no DOM via `#modalAddMember`:
  - `UI.type(document.getElementById('newMemberName'), 'Professora Teste Auditoria')`
  - `UI.type(document.getElementById('newMemberEmail'), 'prof.teste@patos.pb.gov.br')`
  - `UI.select(document.getElementById('newMemberRole'), 'professora')`
  - `UI.select(document.getElementById('newMemberSchool'), 'EMEI Pequeno Príncipe')` (garantindo retenção)
  - `UI.click(document.querySelector('#modalAddMember button.btn-primary'))`
  - Verificação se o membro foi adicionado à equipe e se a Coordenadora da unidade foi vinculada automaticamente.
- **Adição:** Abertura e teste do `#modalEditMember` com simulação de alteração.

### Módulo 3: `setup_longitudinal`
- **Alteração:** Execução do fluxo de setup simulando cliques e seleções no DOM:
  - Navegar para setup (`handleNewObsButtonClick()`)
  - Selecionar escola via `UI.select(document.getElementById('setupSchool'), 'CEI Professora Maria de Lourdes')`
  - Selecionar turma via `UI.select(document.getElementById('setupClass'), classId)`
  - Verificar renderização automática das regentes no `#setupClassTeachersList`
  - Clicar no botão `#btnStartObservation` para disparar a observação.

### Módulo 4: `rubricas_observacao`
- **Alteração:** Simulação de resposta aos critérios clicando nos elementos interativos de avaliação (`.rubric-btn` ou radio correspondente) e digitando comentários pedagógicos em textareas.
- **Validação:** Verificação em tempo real do decrescimento de pendências e do fechamento da tarja `#activeObsValidationBanner`.

### Módulo 5: `sintese_finalizacao`
- **Alteração:** Preenchimento interativo dos horários via `UI.type`, clique nos botões de nível de uso de materiais (1, 2, 3 ou 4), clique em salvar rascunho e clique em finalizar observação.
- **Adição:** Validação da retenção dos valores visuais na síntese.

### Módulo 6: `travas_seguranca`
- **Adição:** Simulação interativa de tentativa de novo setup para a mesma turma (checagem do bloqueio modal/toast).
- **Adição:** Abertura e preenchimento real do modal de ocorrências (`#modalQualitativeNote`) com `UI.select` de escola, turma e docente, digitação de texto e clique em salvar.

### Módulo 7: `formadora_coordenacao`
- **Alteração:** Alternância para Formadora, navegação no setup com verificação de exibição do `#groupSetupTargetPerson` e ocultação do seletor de turmas.

### Módulo 8: `agenda_cronograma`
- **Alteração:** Abertura do `#modalAddSchedule`, preenchimento via `UI.select` de escola, docente/turma, `UI.type` de data/horário e clique em salvar.
- **Validação:** Verificação da renderização da linha na tabela de agendamento e acionamento do botão de devolutiva via `UI.click`.

### Módulo 9: `historico_governanca`
- **Alteração:** Digitação no filtro de busca do histórico (`#histFilterName`), alteração do select `#histFilterBimester` e verificação da reatividade instantânea dos cards.

### Módulo 10: `indicadores_decisao`
- **Alteração:** Clique nas sub-abas de Indicadores (`switchIndicatorsSubTab`), seleção de unidade no filtro de benchmark e acionamento interativo do comparativo longitudinal.

### Módulo 11: `backup_exportacao`
- **Validação:** Validação da serialização completa e fidelidade dos componentes visuais de impressão.

### Módulo 12: `navegacao_layout`
- **Alteração:** Cliques sequenciais nas abas da barra superior (`home`, `schedule`, `indicators`, `history`, `notes`), abertura do menu mobile e abertura/fechamento do modal de Changelog via clique no botão `✕`.
