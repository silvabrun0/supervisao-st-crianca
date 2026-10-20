# PLANO DE IMPLEMENTAÇÃO: PILAR 4 - TURMAS EM TEMPO INTEGRAL EM FORMULÁRIO ÚNICO (2 ETAPAS: MANHÃ E TARDE)

> **DIRETRIZ OBRIGATÓRIA DE EXECUÇÃO (ETAPA 2):**
> O assistente executor (Etapa 2) deve **obrigatoriamente ler e seguir as diretrizes dos arquivos `WORKFLOW_MACOS.md` e `AGENTS.md`** localizados na raiz do projeto antes de aplicar qualquer modificação no código. Nenhuma modificação deve ser realizada sem conformidade estrita com o workflow, incluindo:
> 1. Execução prévia de sincronização com o repositório remoto (`git pull origin main`).
> 2. Preservação integral das regras de negócio existentes, dados cadastrais, blindagens RBAC, série histórica e testes automatizados.
> 3. Verificação de integridade pós-edição com dupla checagem de leitura em cada trecho modificado.
> 4. Salvamento obrigatório do backup intermediário na pasta `intermediárias/` sob o nome `aplicativo_v94_pilar_4_turmas_integrais_formulario_unico.html` (e espelho em subpastas caso aplicável).
> 5. Gestão dupla de Changelog no arquivo `CHANGELOG.md` e no modal `#modalChangelog` do `index.html`, registrando a **Versão 0.94**.
> 6. Sincronização idêntica entre o arquivo principal `index.html` da raiz, `gestor supervisao_patos/index.html` e `gestor supervisao_patos/firebase_deploy/public/index.html`.
> 7. Checagem pré-push (`git fetch origin main`), commit semântico (`feat: implementar pilar 4 - turmas integrais em formulario unico de duas etapas`), push para `origin main` e deploy automático no GitHub Pages.
> 8. Execução pós-deploy obrigatória do algoritmo de auditoria (`python3 audit_platform.py --silent-on-success`) com comunicação estrita a falhas.

---

## 1. Diagnóstico e Contexto

### 1.1 Cenário Atual
Atualmente, após a implementação bem-sucedida do Pilar 1 (Inversão da Unidade de Análise para a Turma), do Pilar 2 (Tríade Canônica de Governança em 3 Níveis) e do Pilar 3 (Benchmark comparativo UE vs. Rede no Afunilamento):
- As turmas cadastradas em `INITIAL_CLASSES` e `appState.classes` possuem o metadado `shift` (`Parcial Matutino`, `Parcial Vespertino` ou `Integral`).
- No entanto, o fluxo de observação ativa (`#screenActiveObs`), o cálculo temporal de horários e a síntese de finalização (`#screenSynthesis`) foram concebidos sob a premissa de uma observação de turno único (composta por um único par de horários: `startTime` e `endTime`).
- Para uma **Turma em Tempo Integral**, na qual a criança vivencia uma jornada educativa completa de 7 a 9 horas diárias (abrangendo acolhida matutina, café, atividades em cantos, mediação pedagógica, almoço, repouso, higiene, lanche vespertino e experiências externas da tarde), a aplicação de uma observação restrita a um único turno fragmenta o diagnóstico da rotina infantil e desconsidera o planejamento coletivo dos 4 professores regentes titulares.
- Caso a coordenadora tentasse criar duas observações separadas (uma para a manhã e outra para a tarde), o sistema dispararia o bloqueio de duplo lançamento do Pilar 1 (*"Ação bloqueada: Já existe uma observação para esta turma no bimestre"*).
- Por outro lado, se a coordenadora realiza a observação da manhã, ela não possui um mecanismo nativo para suspender o preenchimento, salvar os horários da manhã e retomar no turno vespertino com sinalização visual clara e registro segregado dos dois turnos.

### 1.2 Fundamentação Técnico-Pedagógica (Documento de Insights / Reunião ST Criança 19/10/2026 - Bruno Pereira da Silva, 01:21:35)
Conforme deliberado nas diretrizes oficiais do programa SerTão Criança:
1. **Unidade Pedagógica da Turma de Tempo Integral:**
   - A divisão em formulários isolados prejudicaria a avaliação do **planejamento conjunto** dos 4 professores regentes que atuam na turma de tempo integral. A escola em tempo integral precisa manter unidade pedagógica orgânica.
2. **Arquitetura em Duas Etapas com Formulário Único:**
   - **Etapa 1 (Turno Matutino):** A Coordenadora Pedagógica inicia o acompanhamento da turma pela manhã, observa as práticas da rotina matutina e realiza o salvamento como rascunho da etapa matutina, com registro fidedigno dos horários de início e término da manhã.
   - **Etapa 2 (Turno Vespertino):** No turno da tarde, a coordenadora retoma o mesmo formulário único (identificado com badge contextual de Etapa 2), complementa os critérios, anexa novas evidências/fotos e registra os horários de início e término da tarde.
   - **Balanço Global Ponderado e Envio Definitivo:** O envio definitivo só pode ser realizado após a conclusão dos dois turnos, permitindo que a coordenação pondere o balanço global da experiência da criança naquele bimestre e calcule o tempo total acumulado de observação.

### 1.3 Resultado Esperado com o Pilar 4
1. **Identificação e Tratamento Diferenciado de Turmas Integrais:**
   - Reconhecimento automático de turmas integrais através do helper `isClassIntegral(target)`.
   - Cadastro canônico de turma modelo de Tempo Integral no CEI Professora Maria de Lourdes (`cls-pml-04`: *Maternal II - Turma Integral*, regida por quarteto docente titular).
2. **Fluxo em 2 Etapas no Formulário Único:**
   - **Etapa 1 (Turno Matutino):** Banner indicativo `☀️ ETAPA 1/2: TURNO MATUTINO` no topo da observação ativa. Bloqueio pedagógico de finalização antes da tarde, com botão primário na síntese: **"Salvar Turno Matutino e Aguardar Tarde 🌤️"**.
   - **Transição de Rascunho para Etapa 2:** O rascunho é persistido com `integralStage: 'vespertino'` e `morningObs: { date, startTime, endTime, durationMinutes, completed: true }`.
   - **Retomada no Turno Vespertino:** Na Home e no Histórico, o card do rascunho destaca: `🌤️ Aguardando Turno Vespertino (Etapa 2/2)` com botão **"Retomar no Turno da Tarde →"**.
   - **Etapa 2 (Turno Vespertino):** Banner indicativo `🌅 ETAPA 2/2: TURNO VESPERTINO`. Permite complementar critérios e registrar horários da tarde (`afternoonObs: { date, startTime, endTime, durationMinutes, completed: true }`).
3. **Síntese Final com Registro de Período Duplo:**
   - Exibição de dois blocos de horários (Manhã e Tarde) e cálculo automático da soma total da carga horária observada (`totalIntegralDurationMinutes`).
   - Botão de envio definitivo habilitado: **"FINALIZAR OBSERVAÇÃO INTEGRAL COMPLETA (MANHÃ + TARDE) ✓"**.
4. **Histórico, Devolutiva e Relatório PDF:**
   - Visualização consolidada dos horários dos dois turnos no card do histórico e no espelho de impressão em PDF (`Manhã: 08:00 - 11:30 | Tarde: 13:30 - 16:30 | Total: 6h 30m`).
5. **Cobertura de 100% no Algoritmo de Auditoria (`audit_platform.py` e `index.html`):**
   - Criação de asserções no Módulo 3 (`setup_longitudinal`), Módulo 4 (`rubricas_observacao`) e Módulo 5 (`sintese_finalizacao`) validando o ciclo completo das 2 etapas da Turma Integral.

---

## 2. Arquitetura e Pontos de Impacto

### 2.1 Arquivos Afetados
- `index.html` (Arquivo mestre de produção servido pelo GitHub Pages)
- `gestor supervisao_patos/index.html` (Espelho local)
- `gestor supervisao_patos/firebase_deploy/public/index.html` (Espelho Firebase)
- `gestor supervisao_patos/CHANGELOG.md` (Registro da Versão 0.94)
- `intermediárias/aplicativo_v94_pilar_4_turmas_integrais_formulario_unico.html` (Backup intermediário obrigatório)
- `audit_platform.py` (Suíte de auditoria modular da plataforma)

### 2.2 Estruturas de Dados Envolvidas

#### 1. Inclusão de Turma Modelo Integral em `INITIAL_CLASSES`:
```javascript
{
  id: 'cls-pml-04',
  name: 'Maternal II - Turma Integral',
  school: 'CEI Professora Maria de Lourdes',
  stage: 'Maternal II',
  shift: 'Integral',
  teachers: ['Ana Carolina Silva', 'Juliana Roberta Rocha', 'Carla Beatriz Mendes', 'Patricia Souza']
}
```

#### 2. Campos do Objeto de Observação (`newObs` / `appState.currentObs`):
```javascript
{
  // Metadados existentes...
  classShift: 'Integral', // 'Integral', 'Parcial Matutino', 'Parcial Vespertino'
  isIntegral: true,
  integralStage: 'matutino', // 'matutino' ➔ 'vespertino' ➔ 'concluido'
  morningObs: {
    date: '2026-10-21',
    startTime: '08:00',
    endTime: '11:30',
    durationMinutes: 210,
    completed: false,
    completedAt: null
  },
  afternoonObs: {
    date: '2026-10-21',
    startTime: '13:30',
    endTime: '16:30',
    durationMinutes: 180,
    completed: false,
    completedAt: null
  },
  totalIntegralDurationMinutes: 390
}
```

### 2.3 Funções e Módulos JavaScript Impactados

| Função / Módulo | Linha Aprox. | Impacto e Nova Responsabilidade no Pilar 4 |
| :--- | :---: | :--- |
| `isClassIntegral(target)` | Nova (Global) | Helper utilitário que identifica se uma turma ou string de turno representa Tempo Integral. |
| `INITIAL_CLASSES` | ~6380 | Adição canônica da turma `Maternal II - Turma Integral` no CEI Maria de Lourdes. |
| `onSetupClassChange()` | ~8095 | Detecta se a turma selecionada é Integral e atualiza o badge e hint para `Tempo Integral (2 Turnos: Manhã + Tarde)`. |
| `startNewObservation()` | ~8490 | Inicializa os sub-objetos `morningObs`, `afternoonObs`, `integralStage: 'matutino'` e `isIntegral: true` quando a turma for Integral. |
| `renderActiveObservation()` | ~8810 | Renderiza o banner contextual de etapa no topo (`☀️ ETAPA 1/2: TURNO MATUTINO` ou `🌅 ETAPA 2/2: TURNO VESPERTINO`). |
| `saveMorningStageAndExit()` | Nova | Valida horários da manhã, marca `morningObs.completed = true`, avança `integralStage = 'vespertino'`, persiste rascunho e navega para a Home com Toast orientador. |
| `resumeObservation()` | ~8528 | Ao retomar rascunho integral com manhã concluída, ativa automaticamente a Etapa 2 (Vespertino) para complementação das práticas da tarde. |
| `renderSynthesisScreen()` | ~9244 | Renderiza os dois blocos de horário para Turmas Integrais (Turno Matutino e Turno Vespertino), calcula a duração somada e condiciona o botão de ação principal. |
| `recalculateSynthesisDuration()` | ~9759 | Suporta cálculo somado de `morningObs.durationMinutes + afternoonObs.durationMinutes` para turmas integrais. |
| `finalizeObservation()` | ~9856 | Adiciona guarda mandatória impedindo a finalização de turma integral se o turno vespertino não tiver sido cumprido. |
| `renderHomeScreen()` | ~10079 | Exibe badge e botão contextual específico nos cards de rascunhos de turmas integrais (`🌤️ Aguardando Turno Vespertino (Etapa 2/2)` ➔ `Retomar no Turno da Tarde →`). |
| `renderHistoryScreen()` | ~10200 | Exibe badge de Tempo Integral com os dois turnos discriminados no histórico de observações concluídas e rascunhos. |

---

## 3. Especificação Passo a Passo de Código

### Passo 1: Helper Canônico `isClassIntegral(target)` e Catálogo de Turmas
Declarar o helper global reutilizável:
```javascript
function isClassIntegral(target) {
  if (!target) return false;
  if (typeof target === 'string') {
    return target.toLowerCase().includes('integral');
  }
  const shift = target.classShift || target.shift || '';
  return shift.toLowerCase().includes('integral');
}
```
Adicionar em `INITIAL_CLASSES` a turma `Maternal II - Turma Integral` na escola de modelo `CEI Professora Maria de Lourdes`.

### Passo 2: Atualização na Tela de Setup (`#screenSetup`)
1. No HTML do card de regência (`#groupSetupTeachersCard`), atualizar estilização do badge `#setupClassShiftBadge` quando a turma for integral.
2. Em `onSetupClassChange()`, ao selecionar uma turma integral:
   - Exibir badge destacado: `🌟 Tempo Integral (2 Turnos: Manhã + Tarde)`.
   - Adicionar hint explicativo: *"Esta turma é de Tempo Integral. O formulário único é executado em duas etapas: Manhã (Etapa 1) e Tarde (Etapa 2), consolidando a unidade pedagógica dos 4 professores regentes."*
   - O botão principal exibe: `"INICIAR OBSERVAÇÃO · ETAPA 1 (TURNO MATUTINO) →"`.

### Passo 3: Inicialização em `startNewObservation()`
Ao criar `newObs` para turma integral:
```javascript
const isIntegral = isClassIntegral(targetClassObj?.shift || 'Parcial Matutino');
newObs.isIntegral = isIntegral;
newObs.classShift = targetClassObj?.shift || (isIntegral ? 'Integral' : 'Parcial Matutino');
newObs.integralStage = isIntegral ? 'matutino' : 'concluido';
newObs.morningObs = isIntegral ? {
  date: chosenDate,
  startTime: chosenStart || '08:00',
  endTime: chosenEnd || '11:30',
  durationMinutes: chosenEnd ? calculateObservationDuration({ startDate: chosenDate, endDate: chosenDate, startTime: chosenStart || '08:00', endTime: chosenEnd }) : null,
  completed: false,
  completedAt: null
} : null;
newObs.afternoonObs = isIntegral ? {
  date: chosenDate,
  startTime: '13:30',
  endTime: '16:30',
  durationMinutes: null,
  completed: false,
  completedAt: null
} : null;
newObs.totalIntegralDurationMinutes = null;
```

### Passo 4: Banner Visual da Etapa na Observação Ativa (`#screenActiveObs`)
Inserir banner dinâmico `#activeObsIntegralBanner` acima do índice de pendências:
- Se `obs.isIntegral && obs.integralStage === 'matutino'`:
  - `☀️ ETAPA 1/2: TURNO MATUTINO (MANHÃ)`
  - Subtexto: *"Observando a rotina da manhã. Ao encerrar o período matutino, salve o rascunho da manhã para retomar à tarde."*
- Se `obs.isIntegral && obs.integralStage === 'vespertino'`:
  - `🌅 ETAPA 2/2: TURNO VESPERTINO (TARDE)`
  - Subtexto: *"Complementando a observação da turma com as práticas da tarde. A etapa matutina já foi registrada com sucesso."*

### Passo 5: Adaptação da Síntese Pedagógica (`#screenSynthesis`)
1. No bloco de horários de `#screenSynthesis`:
   - Para turmas integrais, renderizar o grid duplo:
     - Bloco 1: **Turno Matutino (Manhã)**: Data, Início Manhã, Término Manhã, Duração Manhã.
     - Bloco 2: **Turno Vespertino (Tarde)**: Data, Início Tarde, Término Tarde, Duração Tarde.
     - Bloco 3: **Duração Total Consolidada** (Soma Manhã + Tarde).
2. Botões de ação em `#synthesisActionButtons`:
   - Se `obs.isIntegral && obs.integralStage === 'matutino'`:
     - Botão primário: **"SALVAR TURNO MATUTINO E AGUARDAR TARDE 🌤️"** (`saveMorningStageAndExit()`).
     - Bloqueio explícito com Toast caso tente finalizar sem o turno da tarde.
   - Se `obs.isIntegral && obs.integralStage === 'vespertino'`:
     - Botão primário: **"FINALIZAR OBSERVAÇÃO INTEGRAL COMPLETA (MANHÃ + TARDE) ✓"**.
3. Implementação da função `saveMorningStageAndExit()`:
   - Valida data e horários da manhã.
   - Define `obs.morningObs.completed = true` e `obs.integralStage = 'vespertino'`.
   - Salva o estado e navega para a Home com mensagem amigável: *"Turno matutino registrado com sucesso! O formulário foi salvo como rascunho. Retome no turno da tarde para registrar o turno vespertino e concluir a observação da turma."*

### Passo 6: Exibição Contextual nos Cards de Rascunho e Histórico
1. Em `renderHomeScreen()` e `renderHistoryScreen()`:
   - Se `item.isIntegral && item.integralStage === 'vespertino'`:
     - Exibir badge: `🌤️ Aguardando Turno Vespertino (Etapa 2/2)`.
     - Subtítulo com os horários da manhã: `Manhã: ${item.morningObs.startTime} às ${item.morningObs.endTime} (${item.morningObs.durationMinutes}m)`.
     - Botão de ação: **"Retomar no Turno da Tarde →"**.
   - No histórico de concluídas:
     - Badge: `✓ Concluída · Tempo Integral (2 Turnos)`.
     - Resumo: `⏱️ Manhã: ${mStart} às ${mEnd} | Tarde: ${aStart} às ${aEnd} (Total: ${total}m)`.

---

## 4. Seção Obrigatória de Auditoria Modular (100% de Cobertura)

Conforme a diretriz do **`WORKFLOW_MACOS.md`**, esta seção detalha as alterações, adições e exclusões nos testes automatizados e no algoritmo de auditoria (`audit_platform.py` e engine do `index.html`):

### 4.1 Módulos com Alterações e Adições

#### Módulo 3 (`setup_longitudinal`):
- **Adição:** Teste de inicialização de observação em Turma de Tempo Integral (`cls-pml-04`).
- **Verificação:** Validação de que a turma integral inicializa com `isIntegral === true`, `integralStage === 'matutino'` e estrutura `morningObs` populada.

#### Módulo 5 (`sintese_finalizacao`):
- **Adição:** Teste de salvamento da Etapa 1 (Turno Matutino) com `saveMorningStageAndExit()`.
- **Verificação:** Confirmação de que o rascunho transiciona para `integralStage === 'vespertino'` com `morningObs.completed === true`.
- **Adição:** Teste de tentativa de finalização na Etapa Matutina: validação de que a finalização direta é bloqueada com mensagem pedagógica.
- **Adição:** Teste de retomada na Etapa 2 (Turno Vespertino), preenchimento dos horários da tarde (`13:30 às 16:30`) e cálculo do tempo somado (`totalIntegralDurationMinutes = 210 + 180 = 390 min`).
- **Adição:** Teste de finalização da Turma Integral com status `finalized`.

#### Módulo 9 (`historico_governanca`):
- **Adição:** Verificação da renderização do badge de Tempo Integral (2 Turnos) e exibição dos horários segregados de ambos os turnos.

### 4.2 Exclusões e Regressões Zero
- **Nenhuma exclusão:** Todas as 54 asserções existentes permanecem intactas.
- **Meta Inegociável:** Cobertura de **100% de aprovação (58+/58+ testes)** na execução integral do `python3 audit_platform.py`.
