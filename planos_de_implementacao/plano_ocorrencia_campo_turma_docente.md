# PLANO DE IMPLEMENTAÇÃO: PILAR 1 - OCORRÊNCIAS DE CAMPO ATRIBUÍDAS À TURMA E SELEÇÃO DE DOCENTE

> **DIRETRIZ OBRIGATÓRIA DE EXECUÇÃO (ETAPA 2):**  
> O assistente executor (Etapa 2) deve **obrigatoriamente ler e seguir as diretrizes dos arquivos `WORKFLOW_MACOS.md`, `AGENTS.md` e `GEMINI.md`** localizados na raiz do repositório antes de aplicar qualquer modificação no código. Nenhuma modificação deve ser realizada sem conformidade estrita com o workflow, incluindo:  
> 1. Execução prévia de sincronização com o repositório remoto (`git pull origin main`).  
> 2. Preservação integral das regras de negócio existentes, sem regressões nos fluxos de rubricas, cronograma, histórico ou acompanhamento da formadora.  
> 3. Verificação de integridade pós-edição com dupla checagem de leitura em cada trecho modificado.  
> 4. Salvamento obrigatório do backup intermediário na pasta `intermediárias/` sob o nome `aplicativo_v90_ocorrencias_campo_turma_docente.html` (e espelho interno se aplicável).  
> 5. Gestão dupla de Changelog no arquivo `CHANGELOG.md` e no modal `#modalChangelog` do `index.html`, atualizando para a **Versão 0.90 (v7.69)**.  
> 6. Sincronização idêntica entre o arquivo principal `index.html` da raiz, `gestor supervisao_patos/index.html` e `gestor supervisao_patos/firebase_deploy/public/index.html`.  
> 7. Checagem pré-push (`git fetch origin main`), commit semântico (`feat: atribuir ocorrencia de campo a turma com selecao de docente no pilar 1`), push para `origin main` (deploy automático no GitHub Pages).  
> 8. Execução mandatória do motor de auditoria pós-deploy: `python3 audit_platform.py --silent-on-success`. Comunicação restrita exclusivamente a problemas.

---

## 1. Diagnóstico e Contexto

### 1.1 O Desafio Pedagógico e Sistêmico
Na estruturação original do sistema, a unidade de registro das **Ocorrências de Campo (Registros Qualitativos / Self-Reminders)** era o indivíduo isolado: a coordenadora pedagógica abria o formulário `#modalQualitativeNote`, escolhia a escola e, diretamente em um seletor único de profissionais (`#noteTeacher`), apontava a docente observada.

Com a consolidação do **Pilar 1 (Inversão da Unidade de Análise para a TURMA)** deliberada pela equipe SerTão Criança (*Carolina Machado, Diogo Dias Furtado, Bruno Pereira da Silva e Julia Cordoba*):
1. **A Unidade Que Aprende é a Turma:** Na Educação Infantil de Patos/PB, o processo de acompanhamento da rotina, dos espaços e das interações incide primordialmente sobre a **TURMA**.
2. **Realidade da Regência Docente em Patos/PB:**
   - Não existe a figura de "professor auxiliar";
   - As turmas de período parcial contam com **duplas de professores titulares regentes**, ou **docente único titular** em arranjos específicos (ex: Berçários ou turmas isoladas);
   - As turmas de período integral contam com quartetos ou equipes revezadas de titulares.
3. **Incoerência Remanescente no Registro Qualitativo:**
   - Ao lançar uma ocorrência de campo (seja na observação ativa ou na aba geral de ocorrências), o formulário ainda solicitava a docente isolada sem vincular a **TURMA**;
   - Quando a ocorrência ocorria durante a rotina pedagógica de uma turma com **2 docentes**, o sistema não permitia discernir com exatidão qual das duas profissionais protagonizou a intervenção ou situação formativa observada;
   - Quando a turma possuía **apenas 1 docente titular**, a coordenadora ainda era forçada a procurar e selecionar manualmente o nome da professora, em vez do sistema reconhecer a regência unívoca e travar automaticamente a atribuição.

### 1.2 Regra de Negócio Deliberada para o Pilar 1
1. **Atribuição Primária à TURMA:** Ao abrir o registro de ocorrência de campo, o observador vincula o evento à **TURMA** da Educação Infantil.
2. **Caso de Docente Único (`teachers.length === 1`):**
   - O sistema detecta que a turma possui um único docente titular;
   - O campo de docente é automaticamente preenchido com o nome desse profissional;
   - O campo de docente é **TRAVADO** (`disabled = true`), acompanhado de crachá visual informativo (`🔒 Docente único regente da turma`).
3. **Caso de Dois Docentes (`teachers.length >= 2`):**
   - O sistema detecta regência compartilhada;
   - O campo de docente permanece **HABILITADO** (`disabled = false`), listando especificamente os docentes daquela turma (Professor A e Professor B);
   - O observador escolhe com qual docente o fato ocorreu para subsidiar a devolutiva formativa individualizada ou coletiva.
4. **Vínculo com Observação Ativa (`currentObs`):**
   - Se a ocorrência for aberta via botão de atalho ou FAB Menu durante uma visita em andamento, a Escola e a Turma já vêm preenchidas e travadas a partir da observação ativa. A regra de 1 docente (travado) vs 2 docentes (escolha) aplica-se imediatamente aos docentes daquela observação.

---

## 2. Mapeamento Arquitetural de Impacto

| Componente | Comportamento Anterior | Novo Comportamento (Pilar 1 - Versão 0.90) |
| :--- | :--- | :--- |
| **Modal de Ocorrência (`#modalQualitativeNote`)** | Seleção apenas de Unidade e "Profissional em Foco". Sem campo de turma. | Introdução do seletor **Turma da Educação Infantil (`#noteClass`)** logo após a unidade escolar. |
| **Reatividade ao Mudar Turma (`onNoteClassChange`)** | Inexistente. | Ao selecionar a turma, busca os docentes regentes (`targetClass.teachers`): se 1 docente, preenche e **trava**; se 2 docentes, exibe opções para o observador **escolher**. |
| **Alerta Contextual de Visita Ativa (`#noteObsContextAlert`)** | Mencionava apenas "visita de [docente]". | Informa que o registro está vinculado à visita da turma **[Turma]** na unidade **[Escola]**. |
| **Objeto de Ocorrência (`newNote`)** | Continha apenas `schoolName` e `teacherName`. | Armazena `className`, `classId`, `targetType: 'turma'`, `teacherName` (docente específico), e `teachers` (equipe da turma). |
| **Card de Ocorrência na Screen 8 (`renderNotesScreen`)** | Exibia apenas o nome do docente e unidade. | Exibe em destaque tipográfico a **📚 Turma** e o **👩‍🏫 Docente**, mantendo clareza da regência. |
| **Síntese Pedagógica (`importNotesIntoSynthesis`)** | Filtrava apenas por `teacherName === obs.teacherName`. | Importa ocorrências daquela **Turma** (`n.className === obs.className` ou vinculadas via `obsId`). |
| **Exportação CSV (`exportNotesFilteredCSV`)** | Colunas: `ID, Data, Unidade, Docente...`. | Colunas atualizadas: `ID, Data, Unidade, Turma, Docente, Registrado_Por, Topico, Conteudo, Resolvido`. |
| **Catálogo Canônico (`INITIAL_NOTES`)** | Notas de exemplo sem metadados de turma. | Atualizado com `className`, `classId` e `targetType: 'turma'`, compatíveis com `INITIAL_CLASSES`. |
| **Motor de Auditoria (`audit_platform.py` & `index.html`)** | Sem testes dedicados de alternância 1 docente vs 2 docentes no modal de notas. | Adição de testes determinísticos modo-a-modo no módulo de auditoria com 100% de cobertura. |

---

## 3. Especificação Passo a Passo de Código (Etapa 2)

### Passo 3.1: Atualização do Modal HTML (`#modalQualitativeNote`)

**Arquivo:** `index.html` (e cópias espelhadas)  
**Localização:** Linhas ~5293 a 5350.

#### Alteração no HTML do Modal:
Inserir o contêiner e o select de Turma (`#noteClass`) e o container de feedback visual dinâmico para a regência docente:

```html
      <!-- Alerta Contextual de Observação Ativa -->
      <div id="noteObsContextAlert" style="display:none; background:#EFF6FF; border:1px solid #BFDBFE; color:#1E40AF; padding:10px 12px; border-radius:8px; font-size:12px; margin-bottom:14px; line-height:1.4;">
        🔒 <strong>Observação em andamento:</strong> Este registro será vinculado exclusivamente à visita da turma <strong id="noteObsContextClassName"></strong> na unidade <strong id="noteObsContextSchoolName"></strong>.
      </div>

      <div id="noteNoEvaluatedAlert" style="display:none; background:#FEF2F2; border:1px solid #FECACA; color:#991B1B; padding:10px 12px; border-radius:8px; font-size:12px; margin-bottom:14px; line-height:1.4;">
        🚫 <strong>Sem turmas avaliadas:</strong> Ocorrências avulsas exigem ao menos uma observação pedagógica finalizada na unidade ou visita ativa em andamento.
      </div>

      <!-- Unidade Escolar -->
      <div class="form-group">
        <label class="form-label">Unidade Escolar / Polo</label>
        <select id="noteSchool" class="form-select" onchange="onNoteSchoolChange()">
          <!-- Populated -->
        </select>
      </div>

      <!-- TURMA DA EDUCAÇÃO INFANTIL (PILAR 1) -->
      <div class="form-group" id="groupNoteClass">
        <label class="form-label">Turma da Educação Infantil <span style="color:var(--red);">*</span></label>
        <select id="noteClass" class="form-select" onchange="onNoteClassChange()">
          <!-- Populated dinamicamente via getClassesForSchool -->
        </select>
      </div>

      <!-- PROFISSIONAL / DOCENTE EM FOCO -->
      <div class="form-group" id="groupNoteTeacher">
        <label class="form-label" id="labelNoteTeacher">
          Docente em Foco da Ocorrência
          <span style="font-size:11px; font-weight:normal; color:var(--text-secondary); margin-left:4px;" id="subLabelNoteTeacher"></span>
        </label>
        <select id="noteTeacher" class="form-select">
          <!-- Populated conforme docentes da turma selecionada -->
        </select>
        <div id="noteTeacherHint" style="font-size:11px; margin-top:4px; line-height:1.3;"></div>
      </div>
```

---

### Passo 3.2: Reengenharia de `openQualitativeNoteModal()` e `onNoteSchoolChange()`

**Arquivo:** `index.html` (e cópias espelhadas)  
**Localização:** Linhas ~10935 a 11065.

#### Lógica de Inicialização:
1. Ao abrir o modal, se houver observação ativa (`appState.currentObs`):
   - Fixa `noteSchool` na escola da visita e desabilita;
   - Fixa `noteClass` na turma da visita (`currentObs.className`) e desabilita;
   - Atualiza o alerta `#noteObsContextAlert` com o nome da turma e da escola;
   - Dispara a configuração dos docentes para essa turma.
2. Se for abertura avulsa:
   - Se coordenadora, fixa na escola do usuário; se técnico/formador, habilita escolha;
   - Popula o seletor `#noteClass` com as turmas da escola através de `getClassesForSchool(schoolName)`;
   - Seleciona a primeira turma disponível e dispara `onNoteClassChange()`.

---

### Passo 3.3: Criação da Rotina Reativa `onNoteClassChange()`

**Arquivo:** `index.html` (e cópias espelhadas)

#### Implementação da Regra de Regência (1 Docente Travado vs 2 Docentes Escolha):
```javascript
function onNoteClassChange() {
  const schoolName = document.getElementById('noteSchool').value;
  const className = document.getElementById('noteClass').value;
  const teacherSelect = document.getElementById('noteTeacher');
  const teacherHint = document.getElementById('noteTeacherHint');
  const subLabel = document.getElementById('subLabelNoteTeacher');
  const btnSave = document.getElementById('btnSaveQualitativeNote');
  
  teacherSelect.innerHTML = '';
  teacherHint.innerHTML = '';
  teacherHint.style.display = 'none';

  if (!className) {
    const opt = document.createElement('option');
    opt.value = '';
    opt.text = 'Selecione uma turma primeiro';
    teacherSelect.appendChild(opt);
    teacherSelect.disabled = true;
    if (btnSave) btnSave.disabled = true;
    return;
  }

  // 1. Localiza a turma no catálogo canônico da escola
  const schoolClasses = getClassesForSchool(schoolName);
  const targetClass = schoolClasses.find(c => c.name === className);
  let teachers = (targetClass && Array.isArray(targetClass.teachers)) ? [...targetClass.teachers] : [];

  // Fallback caso a turma não possua docentes explicitamente no array
  if (teachers.length === 0) {
    const fallbackTeachers = (appState.teamMembers || [])
      .filter(m => m.school === schoolName && m.roleKey === 'professora')
      .map(m => m.name);
    teachers = fallbackTeachers;
  }

  // 2. CASO 1: DOCENTE ÚNICO (Regência Unívoca) ➔ TRAVAMENTO AUTOMÁTICO
  if (teachers.length === 1) {
    const singleTeacher = teachers[0];
    const opt = document.createElement('option');
    opt.value = singleTeacher;
    opt.text = `${singleTeacher} (Docente Único Regente)`;
    opt.selected = true;
    teacherSelect.appendChild(opt);
    teacherSelect.disabled = true; // TRAVA MANDATÓRIA

    if (subLabel) subLabel.textContent = '(Docente único travado)';
    if (teacherHint) {
      teacherHint.style.display = 'block';
      teacherHint.style.color = 'var(--text-secondary)';
      teacherHint.innerHTML = `🔒 <strong>Docente único titular:</strong> Ocorrência vinculada automaticamente a <strong>${singleTeacher}</strong>.`;
    }
    if (btnSave) {
      btnSave.disabled = false;
      btnSave.style.opacity = '1';
      btnSave.style.cursor = 'pointer';
    }
  }
  // 3. CASO 2: DOIS (OU MAIS) DOCENTES ➔ ESCOLHA PELO OBSERVADOR
  else if (teachers.length >= 2) {
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.text = 'Selecione com qual docente ocorreu o fato...';
    placeholder.disabled = true;
    placeholder.selected = true;
    teacherSelect.appendChild(placeholder);

    teachers.forEach((tName, idx) => {
      const opt = document.createElement('option');
      opt.value = tName;
      opt.text = `${tName} (Docente Regente ${String.fromCharCode(65 + idx)})`;
      teacherSelect.appendChild(opt);
    });

    teacherSelect.disabled = false; // HABILITADO PARA ESCOLHA

    if (subLabel) subLabel.textContent = '(Selecione Professor A ou B)';
    if (teacherHint) {
      teacherHint.style.display = 'block';
      teacherHint.style.color = '#1D4ED8';
      teacherHint.innerHTML = `👥 <strong>Regência Compartilhada:</strong> Indique se o fato ocorreu junto ao(à) <strong>${teachers[0]}</strong> ou <strong>${teachers[1]}</strong>.`;
    }
    if (btnSave) {
      btnSave.disabled = false;
      btnSave.style.opacity = '1';
      btnSave.style.cursor = 'pointer';
    }
  }
  // 4. CASO 3: NENHUM DOCENTE ENCONTRADO
  else {
    const opt = document.createElement('option');
    opt.value = '';
    opt.text = 'Nenhum docente vinculado a esta turma';
    teacherSelect.appendChild(opt);
    teacherSelect.disabled = true;
    if (btnSave) {
      btnSave.disabled = true;
      btnSave.style.opacity = '0.5';
      btnSave.style.cursor = 'not-allowed';
    }
  }
}
```

---

### Passo 3.4: Atualização de `saveQualitativeNote()`

**Arquivo:** `index.html` (e cópias espelhadas)  
**Localização:** Linhas ~11067 a 11140.

#### Validação e Persistência da Turma e Docente:
1. Leitura de `schoolName`, `className`, `teacherName`, `topic` e `content`.
2. Como o campo `#noteTeacher` pode estar com atributo `disabled = true` quando há docente único, a leitura do valor deve ser garantida:
   `const teacherName = teacherSelect.value;` (funciona nativamente no DOM).
3. Validação de preenchimento obrigatório:
   - Se `!className`: Toast `"Por favor, selecione a turma da Educação Infantil."`
   - Se `!teacherName`: Toast `"Por favor, indique o docente referente à ocorrência."`
   - Se `!content`: Toast `"Por favor, informe a anotação formativa."`
4. Associação da Turma ao Objeto:
   ```javascript
   const isObsLinked = !!(appState.currentObs && 
                          appState.currentObs.schoolName === schoolName && 
                          appState.currentObs.className === className);

   const targetClassObj = getClassesForSchool(schoolName).find(c => c.name === className);

   const newNote = {
     id: 'not-' + Date.now(),
     date: new Date().toISOString().split('T')[0],
     schoolName: schoolName,
     className: className,
     classId: targetClassObj?.id || null,
     targetType: 'turma',
     teacherName: teacherName,
     teachers: targetClassObj?.teachers || [teacherName],
     reportedBy: user.name,
     topic: topic,
     content: content,
     resolved: false,
     archived: false,
     obsId: isObsLinked ? appState.currentObs.id : null,
     isSample: false
   };
   ```
5. Anexação ao `linkedNotes` da observação ativa:
   `const textToLink = `[${newNote.topic} · ${newNote.teacherName}] ${newNote.content}`;`

---

### Passo 3.5: Atualização da Exibição dos Cards na Screen 8 (`renderNotesScreen`)

**Arquivo:** `index.html` (e cópias espelhadas)  
**Localização:** Linhas ~10870 a 10930.

#### Exibição Elegante de Turma e Docente:
No cabeçalho do card da ocorrência:
```javascript
card.innerHTML = `
  <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px; flex-wrap:wrap; gap:8px;">
    <div>
      <div style="font-size:15px; font-weight:800; color:var(--primary-dark);">${not.topic}</div>
      <div style="font-size:12px; color:var(--text-secondary); margin-top:2px;">
        ${not.className ? `<span style="font-weight:700; color:var(--primary);">📚 ${not.className}</span> · ` : ''}
        Docente: <strong>${not.teacherName}</strong> · Unidade: <strong>${not.schoolName}</strong> · Registrado em <strong>${not.date}</strong> por <strong>${not.reportedBy}</strong>
      </div>
    </div>
    ${badgeHtml}
  </div>
  ...
`;
```

---

### Passo 3.6: Atualização de `importNotesIntoSynthesis()`

**Arquivo:** `index.html` (e cópias espelhadas)  
**Localização:** Linhas ~9613 a 9645.

#### Vinculação Integrada por Turma:
Ao buscar ocorrências para anexar à síntese pedagógica da observação ativa:
```javascript
const matchingNotes = appState.notes.filter(n => 
  !n.isSample && 
  n.schoolName === obs.schoolName && 
  (
    (n.className && obs.className && n.className === obs.className) ||
    (n.obsId && n.obsId === obs.id) ||
    (n.teacherName && obs.teacherName && (n.teacherName === obs.teacherName || obs.teacherName.includes(n.teacherName)))
  )
);
```

---

### Passo 3.7: Atualização da Exportação CSV (`exportNotesFilteredCSV`)

**Arquivo:** `index.html` (e cópias espelhadas)  
**Localização:** Linha ~15393.

Incluir a coluna `"Turma"` no cabeçalho e na montagem das linhas do CSV exportado:
```javascript
const headers = ["ID", "Data", "Unidade", "Turma", "Docente", "Registrado_Por", "Topico", "Conteudo", "Resolvido"];
const rows = items.map(n => [
  n.id,
  n.date,
  `"${n.schoolName}"`,
  `"${n.className || 'Geral'}"`,
  `"${n.teacherName}"`,
  `"${n.reportedBy}"`,
  `"${n.topic}"`,
  `"${(n.content || '').replace(/"/g, '""')}"`,
  n.resolved ? 'Sim' : 'Nao'
]);
```

---

### Passo 3.8: Atualização dos Dados Iniciais Canônicos (`INITIAL_NOTES`)

**Arquivo:** `index.html` (e cópias espelhadas)  
**Localização:** Linhas ~6334 a 6358.

Atualizar os mocks com metadados de turma coerentes com `INITIAL_CLASSES`:
- `not-001`: `schoolName: 'CEI Professora Maria de Lourdes'`, `className: 'Infantil I - Turma A'`, `classId: 'cls-pml-01'`, `teacherName: 'Ana Carolina Silva'`, `targetType: 'turma'`.
- `not-002`: `schoolName: 'EMEI Pequeno Príncipe'`, `className: 'Maternal I - Turma A'`, `classId: 'cls-pp-01'`, `teacherName: 'Fernanda Lima'`, `targetType: 'turma'`.

---

## 4. Seção Obrigatória de Auditoria: Alterações no Algoritmo Modular

> **CONFORMIDADE COM O WORKFLOW:**  
> Esta seção detalha as alterações, adições e exclusões no algoritmo de auditoria (`audit_platform.py` e engine de testes do `index.html`), garantindo cobertura efetiva de 100% da plataforma com as novas regras de negócio implementadas.

### 4.1 Visão Geral dos 12 Módulos da Suíte de Auditoria

| Módulo ID | Nome do Módulo | Ação no Módulo | Justificativa |
| :--- | :--- | :---: | :--- |
| `auth_rbac` | Autenticação, Usuários, Perfis e RBAC | Preservado | Permanece 100% íntegro. |
| `catalogo_dados` | Catálogo Canônico, Escolas, Turmas, Professores e Estado Global | Preservado | Validação de `INITIAL_CLASSES` e turmas canônicas. |
| `setup_longitudinal` | Setup de Observação, Seleção de Turmas e Ciclo Longitudinal | Preservado | Validação do fluxo de agendamento e início por turma. |
| `rubricas_observacao` | Observação Ativa, Matrizes Curriculares, Rubricas e Pendências | **Enriquecido** | **Adição:** Teste de abertura de ocorrência durante visita ativa com herança da turma. |
| `sintese_finalizacao` | Síntese Pedagógica, Escala de Materiais, Finalização e Horários | **Enriquecido** | **Adição:** Importação de notas vinculadas à turma na síntese (`importNotesIntoSynthesis`). |
| `travas_seguranca` | Travas de Duplo Lançamento, Imutabilidade Longitudinal e Segurança | **Enriquecido** | **Adição:** Validação da regra de 1 docente travado vs 2 docentes com escolha no modal. |
| `formadora_coordenacao` | Acompanhamento da Formadora, Matriz de Coordenação e Perfis | Preservado | Preservação do Pilar 2 sem regressão. |
| `agenda_cronograma` | Cronograma de Visitas, Destaque da Próxima Visita e Baixa Automática | Preservado | Agenda por turma mantida íntegra. |
| `historico_governanca` | Histórico de Observações, Filtros Multidimensionais e Exclusão | Preservado | Cards do histórico íntegros. |
| `indicadores_decisao` | Indicadores Pedagógicos, Cobertura de Turmas (Pilar 1) e Decisão | Preservado | Agregações de turmas mantidas. |
| `backup_exportacao` | Persistência Local, Backup JSON, Restauração e Relatório | **Enriquecido** | **Adição:** Validação do cabeçalho de exportação CSV contendo coluna Turma. |
| `navegacao_layout` | Sistema de Rotas/Tabs, Menu Mobile Overlay e Changelog | **Atualizado** | Validação da nova versão **0.90 (v7.69)** no cabeçalho e modal de changelog. |

---

### 4.2 Detalhamento das Asserções Adicionadas ao Motor de Auditoria

#### A. No Módulo `travas_seguranca` (Engine de Testes em `index.html`):
Adicionar a verificação determinística da nova regra de negócio do modal de ocorrência:
1. **Teste 1 - Turma com Docente Único (`cls-pml-02` - Berçário II):**
   - Executa `openQualitativeNoteModal()`;
   - Define `#noteSchool` para `'CEI Professora Maria de Lourdes'`;
   - Define `#noteClass` para `'Berçário II - Turma Única'`;
   - Dispara `onNoteClassChange()`;
   - **Asserção:** `#noteTeacher.disabled === true` E `#noteTeacher.value === 'Carla Beatriz Mendes'`;
   - Logger: `logger.log('Bloqueio automático e trava mandatória para turma com docente único', true, 'Carla Beatriz Mendes (travado)');`
2. **Teste 2 - Turma com Dois Docentes (`cls-pml-01` - Infantil I - Turma A):**
   - Define `#noteClass` para `'Infantil I - Turma A'`;
   - Dispara `onNoteClassChange()`;
   - **Asserção:** `#noteTeacher.disabled === false` E `#noteTeacher.options.length >= 2` contendo tanto `'Ana Carolina Silva'` quanto `'Juliana Roberta Rocha'`;
   - Logger: `logger.log('Disponibilização de escolha entre Professor A ou B para turma com dois docentes', true, '2 opções habilitadas');`
3. **Teste 3 - Simulação de Registro e Persistência:**
   - Seleciona `'Juliana Roberta Rocha'`;
   - Preenche `#noteContent` com `'Teste determinístico de ocorrência atribuída à turma'`;
   - Executa `saveQualitativeNote()`;
   - **Asserção:** Última nota em `appState.notes` possui `className === 'Infantil I - Turma A'` E `teacherName === 'Juliana Roberta Rocha'`;
   - Logger: `logger.log('Persistência de ocorrência vinculada à turma e ao docente escolhido', true, 'Infantil I - Turma A / Juliana');`
   - Fecha o modal via `closeQualitativeNoteModal()`.

#### B. No Módulo `sintese_finalizacao`:
- Simular observação ativa da turma `'Infantil I - Turma A'`;
- Executar `importNotesIntoSynthesis()`;
- Verificar se a ocorrência registrada no teste anterior é importada com sucesso para `appState.currentObs.linkedNotes`;
- Logger: `logger.log('Importação de ocorrências por turma na síntese pedagógica', true);`

#### C. No Módulo `navegacao_layout`:
- Atualizar a asserção de versão no modal de changelog para validar a string:
  `Versão 0.90 (v7.69)`.

---

### 4.3 Procedimento de Verificação Pós-Deploy
Imediatamente após a conclusão do deploy na Etapa 2:
```bash
python3 audit_platform.py --silent-on-success
```
- **Se 100% aprovado:** O assistente emite confirmação sucinta e limpa.
- **Se houver qualquer falha:** Os detalhes do erro são reportados pontualmente para pronta resolução.

---

## 5. Checklist de Verificação da Etapa 2 (Operário)

- [ ] Executar `git pull origin main` no início da tarefa.
- [ ] Aplicar as alterações estruturais no modal `#modalQualitativeNote` em `index.html`.
- [ ] Implementar a rotina reativa `onNoteClassChange()` com a trava para 1 docente e escolha para 2 docentes.
- [ ] Atualizar `saveQualitativeNote()` para persistir `className`, `classId` e `teacherName`.
- [ ] Atualizar a renderização dos cards na Screen 8 (`renderNotesScreen`).
- [ ] Atualizar `importNotesIntoSynthesis()` e `exportNotesFilteredCSV()`.
- [ ] Atualizar `INITIAL_NOTES` com metadados de turma.
- [ ] Atualizar a suíte de testes em `index.html` (Módulos `travas_seguranca`, `sintese_finalizacao` e `navegacao_layout`).
- [ ] Salvar backup em `intermediárias/aplicativo_v90_ocorrencias_campo_turma_docente.html`.
- [ ] Atualizar `CHANGELOG.md` e o modal `#modalChangelog` no `index.html` (Versão 0.90).
- [ ] Sincronizar os 3 arquivos do projeto (`index.html`, `gestor supervisao_patos/index.html` e `firebase_deploy/public/index.html`).
- [ ] Verificar integridade (`git diff`) e realizar commit semântico.
- [ ] Fazer `git push origin main` (deploy automático no GitHub Pages).
- [ ] Executar `python3 audit_platform.py --silent-on-success` e reportar o resultado com comunicação restrita a problemas.
