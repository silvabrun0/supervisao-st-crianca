# Plano de Implementação: Resolução Definitiva da Exclusividade Docente no Módulo Catálogo de Dados

> **Diretriz de Execução (Obrigatório):**  
> O assistente executor da **Etapa 2 (Operário)** DEVE OBRIGATORIAMENTE ler e seguir integralmente as diretrizes do arquivo [WORKFLOW_MACOS.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md), do [WORKFLOW_GITHUB.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_GITHUB.md) e da skill [execucao-operario](file:///Users/bruno/Desktop/gestor%20supervisao_patos/.agents/skills/execucao-operario/SKILL.md) antes de aplicar quaisquer modificações no código-fonte. A execução deve ser estrita, cirúrgica, atenta à dupla checagem, validação pré-voo JSC (`python3 audit_platform.py --check-syntax`), versionamento sequencial duplo (`CHANGELOG.md` e `#modalChangelog`), criação de cópia intermediária em `intermediárias/`, sincronização espelhada com `firebase_deploy/public/index.html` e `gestor supervisao_patos/index.html`, push para `main` e execução da auditoria modular pós-deploy (`python3 audit_platform.py --silent-on-success`).

---

> **Status:** 📋 Aguardando Aprovação (Etapa 1 - O Arquiteto)  
> **Data:** 27/10/2026  
> **Versão Alvo:** `1.41` (`v8.2.8`)  
> **Arquivo de Backup Intermediário:** `intermediárias/aplicativo_v141_resolucao_exclusividade_docente_catalogo_dados.html`  
> **Arquivos Principais Afetados:**  
> - `index.html` (raiz da aplicação)  
> - `gestor supervisao_patos/index.html` (cópia espelho local)  
> - `gestor supervisao_patos/firebase_deploy/public/index.html` (cópia espelho de deploy)  
> - `audit_platform.py` (validações sintáticas e pós-deploy)  
> - `CHANGELOG.md` (registro histórico unificado)  

---

## 1. Diagnóstico do Problema e Análise Forense da Causa-Raiz

### 1.1 Sintoma Relatado
Durante a execução da suíte determinística de testes ou acionamento da auditoria in-app, o Módulo 2 (`catalogo_dados`) é reprovado com o erro:
```text
❌ FAIL | [catalogo_dados] Erro de execução no módulo catalogo_dados -> Ana Carolina Silva não possui alocação exclusiva em Infantil I - Turma A
```

### 1.2 Mapa Forense de Causa-Raiz (Diagnóstico Sistêmico)

```
[Invocação do Módulo 2: catalogo_dados]
       │
       ▼ Executa rotina de testes do Catálogo Canônico
[catalogo_dados.run(logger)]
       │
       ├─► Linha 25117: const anaClasses = (appState.classes || []).filter(c => (c.teachers || []).includes('Ana Carolina Silva'));
       │
       ├─► Linha 25118: if (anaClasses.length !== 1 || anaClasses[0].name !== 'Infantil I - Turma A')
       │                throw new Error('Ana Carolina Silva não possui alocação exclusiva em Infantil I - Turma A');
       │
       💥 CAUSA-RAIZ 1: Falta de Escopo Temporal/Ano Letivo no Filtro de Turmas
             ├─► Quando um novo ciclo letivo é iniciado (ex: 2027) via confirmCreateNewAcademicYear() com 'clone',
             │   as turmas do ano anterior são clonadas e inseridas em appState.classes com academicYear: '2027'.
             ├─► appState.classes passa a conter 2 turmas com 'Ana Carolina Silva': uma de 2026 e uma de 2027.
             ├─► O filtro não restringe por (c.academicYear || '2026') === currentYear.
             └─► anaClasses.length resulta em 2 (ou mais), estourando o throw imediatamente.
       │
       💥 CAUSA-RAIZ 2: Divergência Canônica entre INITIAL_TEAM e INITIAL_CLASSES
             ├─► Em INITIAL_TEAM (Linha 9347):
             │   usr-1 (Ana Carolina Silva) possui classAssigned: 'Infantil I' (etapa genérica legada).
             ├─► Em INITIAL_CLASSES (Linha 9175):
             │   cls-pml-01 possui name: 'Infantil I - Turma A'.
             └─► Se getClassesForSchool() precisar criar turmas automáticas resilientes (cls-auto),
                 ele agrupa por t.classAssigned ('Infantil I'), gerando uma turma fantasma 'Infantil I'
                 que passa a concorrer com 'Infantil I - Turma A', quebrando a exclusividade na escola.
       │
       💥 CAUSA-RAIZ 3: Omissão de Turmas em seedSampleData()
             ├─► A função seedSampleData() restaura polos, unidades, servidores, notas e agendamentos,
             │   mas NÃO restaura appState.classes = INITIAL_CLASSES nem reseta appState.deletedClassIds = [].
             └─► Turmas residuais acumuladas em sessões de teste no localStorage sobrevivem à reinicialização.
       │
       💥 CAUSA-RAIZ 4: Ausência de Trava de Exclusividade no Modal de Turmas (saveClassEditor)
             ├─► Ao criar ou editar turmas em tempo parcial, o formulário permite selecionar qualquer docente,
             │   sem validar se a professora já possui regência em outra turma no mesmo ano/turno.
       │
       💥 CAUSA-RAIZ 5: Asserção Frágil e Diagnóstico Oculto
             ├─► A asserção atual compara anaClasses.length !== 1 sem inspecionar a base canônica primária
                 INITIAL_CLASSES nem detalhar na mensagem de erro quais turmas foram retornadas.
```

---

## 2. Arquitetura da Solução Técnica

A solução implementa cinco blindagens integradas sob o **Pilar 1 (Turma como Unidade Primária)**, **Pilar 13 (Governança e Jornadas MEC)**, **Pilar 14 (SSOT Única Descentralizada)** e **Pilar 15 (Arquitetura Plurianual)**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   ARQUITETURA DA SOLUÇÃO (SerTão Criança)              │
└────────────────────────────────────────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┼───────────────────────────────┐
    ▼                               ▼                               ▼
[BLINDAGEM 1]                  [BLINDAGEM 2]                  [BLINDAGEM 3]
Alinhamento Canônico           Autocura & Reset              Trava de Negócio
INITIAL_TEAM                   seedSampleData()               saveClassEditor()
classAssigned =                & loadState()                  Impede alocação
'Infantil I - Turma A'         classes = INITIAL_CLASSES      dupla em tempo
(Semântica SSOT unificada)     deletedClassIds = []           parcial no mesmo ano
    │                               │                               │
    └───────────────────────────────┼───────────────────────────────┘
                                    │
                                    ▼
                              [BLINDAGEM 4]
                     Motor de Auditoria (catalogo_dados)
                     1. Validação canônica em INITIAL_CLASSES
                     2. Validação escopada por selectedAcademicYear
                     3. Mensagem rica com nomes e IDs conflitantes
```

---

## 3. Especificação de Implementação Passo a Passo (Snippets Exatos)

### Passo 1: Alinhamento Canônico em `INITIAL_TEAM`
**Arquivo:** `index.html` (e cópias espelhadas)  
**Localização:** Bloco de definição de `INITIAL_TEAM` (~Linhas 9345-9360).  
**Objetivo:** Substituir designações genéricas de etapa (`Infantil I`, `Berçário II`) pelas turmas canônicas oficiais de `INITIAL_CLASSES`:

```javascript
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
```

---

### Passo 2: Saneamento e Reset de Turmas em `seedSampleData()` e `loadState()`
**Arquivo:** `index.html`  
**Localização:** Funções `seedSampleData()` (~Linha 9860) e `loadState()` (~Linha 9540).  
**Objetivo:** Garantir que o catálogo canônico de turmas seja reinicializado no reset e deduplicado no boot:

```javascript
    function seedSampleData() {
      if (!appState.customUsers) appState.customUsers = {};
      Object.assign(USERS_DB, appState.customUsers);
      appState.activeSectionsTeacher = JSON.parse(JSON.stringify(DEFAULT_SECTIONS_TEACHER)); 
      appState.activeSectionsCoordinator = JSON.parse(JSON.stringify(DEFAULT_SECTIONS_COORDINATOR));
      appState.polos = JSON.parse(JSON.stringify(INITIAL_POLOS));
      appState.units = JSON.parse(JSON.stringify(INITIAL_UNITS));
      appState.teamMembers = JSON.parse(JSON.stringify(INITIAL_TEAM));
      appState.classes = JSON.parse(JSON.stringify(INITIAL_CLASSES)); // <-- PILAR 1 / 14: SSOT CANÔNICA DE TURMAS
      appState.deletedClassIds = []; // <-- LIMPEZA DE EXCLUSÕES
      appState.notes = JSON.parse(JSON.stringify(INITIAL_NOTES));
      appState.schedules = JSON.parse(JSON.stringify(INITIAL_SCHEDULES));
      appState.observations = [ ... ];
```

E em `loadState()`:
```javascript
          if (!appState.classes || !Array.isArray(appState.classes) || appState.classes.length === 0) {
            appState.classes = JSON.parse(JSON.stringify(INITIAL_CLASSES));
          } else {
            // Saneamento e deduplicação resiliente contra turmas orfãs com mesmo ID
            const seenClassIds = new Set();
            appState.classes = appState.classes.filter(c => {
              if (!c || !c.id) return false;
              if (seenClassIds.has(c.id)) return false;
              seenClassIds.add(c.id);
              return true;
            });
          }
```

---

### Passo 3: Prevenção Anti-Sombra em `getClassesForSchool()`
**Arquivo:** `index.html`  
**Localização:** Função `getClassesForSchool(schoolName)` (~Linhas 9240-9285).  
**Objetivo:** Evitar que a geração automática de turmas (`cls-auto`) crie turmas para docentes que já estejam vinculados a turmas canônicas de `INITIAL_CLASSES`:

```javascript
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
            teachers: groups[grpName]
          };
          appState.classes.push(autoCls);
          schoolClasses.push(autoCls);
        });
      }
```

---

### Passo 4: Trava de Negócio de Exclusividade Docente no Modal de Turmas (`saveClassEditor`)
**Arquivo:** `index.html`  
**Localização:** Função `saveClassEditor()` (~Linhas 17740-17750).  
**Objetivo:** Impedir que o usuário aloque uma mesma professora em mais de uma turma de tempo parcial no mesmo ano letivo:

```javascript
      if (finalShift !== 'Tempo Integral') {
        const currentYear = appState.selectedAcademicYear || '2026';
        const otherClasses = (appState.classes || []).filter(c => 
          c.id !== id && 
          (c.academicYear || '2026') === currentYear &&
          c.school === school &&
          c.shift !== 'Tempo Integral'
        );
        for (const tName of finalTeachers) {
          const conflictingCls = otherClasses.find(c => (c.teachers || []).includes(tName));
          if (conflictingCls) {
            showToast(`A docente "${tName}" já possui alocação na turma "${conflictingCls.name}". Não é permitida alocação dupla em turmas de tempo parcial.`);
            return;
          }
        }
      }
```

---

### Passo 5: Atualização da Asserção de Auditoria no Módulo `catalogo_dados`
**Arquivo:** `index.html`  
**Localização:** Bloco de validação de exclusividade docente no Módulo 2 (~Linhas 25083-25089).  
**Objetivo:** Escopar a validação ao ano letivo ativo e auditar a integridade de `INITIAL_CLASSES` com diagnóstico explicativo:

```javascript
              // 7.3 Validação de exclusividade docente (nenhuma docente de turma parcial atuando em turnos acumulados indevidos)
              // A. Integridade na base canônica primária (INITIAL_CLASSES)
              const anaInitialClasses = INITIAL_CLASSES.filter(c => (c.teachers || []).includes('Ana Carolina Silva'));
              if (anaInitialClasses.length !== 1 || anaInitialClasses[0].name !== 'Infantil I - Turma A') {
                throw new Error(`Base canônica corrompida: Ana Carolina Silva possui ${anaInitialClasses.length} alocações em INITIAL_CLASSES (esperado: 1 em Infantil I - Turma A)`);
              }

              // B. Integridade no estado de trabalho (appState.classes) escopado ao ano letivo ativo
              const currentYearScope = appState.selectedAcademicYear || '2026';
              const anaClasses = (appState.classes || []).filter(c => 
                (c.academicYear || '2026') === currentYearScope && 
                (c.teachers || []).includes('Ana Carolina Silva')
              );
              if (anaClasses.length !== 1 || anaClasses[0].name !== 'Infantil I - Turma A') {
                const classDetails = anaClasses.map(c => `"${c.name}" [id: ${c.id}, ano: ${c.academicYear || '2026'}]`).join(', ');
                throw new Error(`Ana Carolina Silva não possui alocação exclusiva em Infantil I - Turma A no ano letivo ${currentYearScope}. Turmas localizadas (${anaClasses.length}): ${classDetails || 'Nenhuma'}`);
              }
              logger.log('Exclusividade docente e integridade de alocação por turno', true, `Infantil I - Turma A (${currentYearScope})`);
```

---

### Passo 6: Atualização da Versão e Registro no Changelog
**Versão Alvo:** `1.41` (`v8.2.8`)  
1. **No Botão Superior de Changelog (`index.html`):**
   ```html
   <button class="btn-changelog" onclick="openChangelogModal()" title="Histórico Integral de Modificações e Diretrizes">
     <svg class="btn-icon-sm" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
     <span>Versão 1.41 (v8.2.8)</span>
   </button>
   ```
2. **No `#modalChangelog` (`index.html`):**
   Inserir o card descritivo da Versão 1.41 no topo da lista.
3. **No Módulo 12 da Auditoria (`navegacao_layout` em `index.html`):**
   Atualizar as asserções de verificação de versão para esperar `'Versão 1.41'` e `v8.2.8`.
4. **No `CHANGELOG.md`:**
   Adicionar a entrada oficial no topo do sumário e detalhamento completo da Versão 1.41.
5. **Sincronização:**
   Espelhar as alterações em:
   - `gestor supervisao_patos/index.html`
   - `gestor supervisao_patos/firebase_deploy/public/index.html`

---

## 4. Critérios de Aceite e Roteiro de Teste

| ID | Cenário de Teste | Ação Executada | Resultado Esperado |
| :---: | :--- | :--- | :--- |
| **CA-01** | **Exclusividade Canônica em `INITIAL_CLASSES`** | Inspecionar a lista canônica `INITIAL_CLASSES` para `Ana Carolina Silva`. | Exatamente 1 turma retornada: `Infantil I - Turma A` (`cls-pml-01`). |
| **CA-02** | **Exclusividade em `appState.classes` no Ano Ativo** | Filtrar `appState.classes` por `academicYear: '2026'` e docente `Ana Carolina Silva`. | Exatamente 1 turma retornada: `Infantil I - Turma A`. |
| **CA-03** | **Convivência com Novos Anos Letivos (Multi-Ano)** | Simular início de ano 2027 com clonagem de turmas. | Turma de 2027 não interfere na asserção de exclusividade do ano 2026. |
| **CA-04** | **Trava no Modal de Turmas (`#modalClassEditor`)** | Tentar alocar `Ana Carolina Silva` em outra turma de tempo parcial no mesmo ano. | Bloqueio imediato com `showToast` impeditivo informando a duplicidade. |
| **CA-05** | **Validação Sintática JSC Pré-Voo** | Executar `python3 audit_platform.py --check-syntax`. | Retorno `0` com 100% de integridade léxica/sintática em `index.html`. |
| **CA-06** | **Auditoria Modular Completa Pós-Deploy** | Executar `python3 audit_platform.py --silent-on-success`. | Módulo `catalogo_dados` e todos os 12 módulos canônicos 100% aprovados (`PASS`). |

---

## 5. Alterações / Adições / Exclusões no Algoritmo de Auditoria (`audit_platform.py` e `index.html`)

### 5.1 No script `audit_platform.py`:
- Nenhuma modificação estrutural necessária na arquitetura do servidor headless, telemetria ou portas. O script permanecerá pronto para execução via `--check-syntax` e `--silent-on-success`.

### 5.2 No arquivo `index.html` (Suíte Interna `AUDIT_MODULES`):
- **Alterações no Módulo 2 (`catalogo_dados`):**
  - Reforço da asserção de exclusividade docente para:
    1. Validar `INITIAL_CLASSES` (SSOT primária de catálogo).
    2. Validar `appState.classes` escopado ao `selectedAcademicYear || '2026'`.
    3. Exibir na mensagem de falha a relação detalhada de turmas localizadas caso haja duplicidade.
- **Alterações no Módulo 12 (`navegacao_layout`):**
  - Atualização dos testes de cabeçalho e changelog para validar a versão `1.40` (`v8.2.7`).
- **Nenhum teste existente será removido**, mantendo a suíte determinística com 100% de cobertura nos 12 módulos canônicos.
