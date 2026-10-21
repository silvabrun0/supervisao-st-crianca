# PLANO DE IMPLEMENTAÇÃO: SIMPLIFICAÇÃO DO MODAL DE OCORRÊNCIAS DE CAMPO E VINCULAÇÃO ESTRITA À OBSERVAÇÃO ATIVA

> **DIRETRIZ OBRIGATÓRIA DE EXECUÇÃO (ETAPA 2):**  
> O assistente executor (Etapa 2) deve **obrigatoriamente ler e seguir as diretrizes dos arquivos `WORKFLOW_MACOS.md`, `AGENTS.md` e `GEMINI.md`** antes de aplicar qualquer modificação no código. Nenhuma modificação deve ser realizada sem conformidade estrita com o workflow, incluindo:  
> 1. Execução prévia de sincronização com o repositório remoto (`git pull origin main`).  
> 2. Preservação integral das regras de negócio existentes, sem regressões nos fluxos de rubricas, cronograma, histórico ou acompanhamento da formadora.  
> 3. Verificação de integridade pós-edição com dupla checagem de leitura em cada trecho modificado.  
> 4. Salvamento obrigatório do backup intermediário na pasta `intermediárias/` sob o nome `aplicativo_v97_simplificacao_modal_ocorrencias.html`.  
> 5. Gestão dupla de Changelog no arquivo `CHANGELOG.md` e no modal `#modalChangelog` do `index.html`, atualizando para a **Versão 0.97 (v7.76)**.  
> 6. Sincronização idêntica entre o arquivo principal `index.html` da raiz, `gestor supervisao_patos/index.html` e `gestor supervisao_patos/firebase_deploy/public/index.html`.  
> 7. Checagem pré-push (`git fetch origin main`), commit semântico (`feat: simplificar modal de ocorrencias de campo e vincular estritamente a turma em avaliacao (v0.97)`), push para `origin main` (deploy automático no GitHub Pages).  
> 8. Execução mandatória do motor de auditoria pós-deploy: `python3 audit_platform.py --silent-on-success`. Comunicação restrita exclusivamente a problemas.

---

## 1. Diagnóstico e Contexto

### 1.1 Cenário Atual
Ao abrir o modal de registro de ocorrência de campo (`#modalQualitativeNote`) durante o acompanhamento presencial em sala de aula, o usuário é confrontado com elementos redundantes, desnecessários e que geram sobrecarga cognitiva:
1. **Alerta Contextual Extenso (`#noteObsContextAlert`):**  
   Exibe um quadro azul com o texto:  
   `"🔒 Observação em andamento: Este registro será vinculado exclusivamente à visita da turma [Turma] na unidade [Escola]."`
2. **Seletores Redundantes de Unidade Escolar e Turma:**  
   Campos `<select id="noteSchool">` ("Unidade Escolar / Polo") e `<select id="noteClass">` ("Turma da Educação Infantil").  
   Como a observação pedagógica já possui uma Unidade e uma Turma ativas e imutáveis durante a visita, a presença desses seletores é redundante, cria atrito e abre brecha para inconsistências.
3. **Seletor de Dimensão / Tópico Observado (`#noteTopic`):**  
   Exige que a coordenadora enquadre a anotação prévia em categorias rígidas ("Estratégias Didáticas", "Gestão do Espaço e Materiais", etc.), quando o objetivo primordial da ocorrência de campo é o registro qualitativo ágil e circunstanciado de fatos da rotina para subsidiar o diálogo formativo posterior.

### 1.2 Resultado Esperado (Versão 0.97)
1. **Remoção de Campos e Avisos Redundantes:**
   - Supressão definitiva do quadro de alerta contextual `#noteObsContextAlert` (`🔒 Observação em andamento...`).
   - Remoção do seletor de Unidade Escolar / Polo (`#noteSchool`).
   - Remoção do seletor de Turma da Educação Infantil (`#noteClass`).
   - Remoção do seletor de Dimensão / Tópico Observado (`#noteTopic`).
   - Remoção do alerta inativo `#noteNoEvaluatedAlert`.
2. **Vinculação Estrita e Automática à Turma/Unidade em Avaliação:**
   - O registro de ocorrência de campo passa a ser estritamente vinculado à observação em andamento (`appState.currentObs`).
   - Caso o usuário tente abrir o modal sem que haja uma observação pedagógica ativa (ex: clicando em "+ Nova Ocorrência de Campo" na tela de Ocorrências), o sistema emite um Toast impeditivo e orientador:  
     `"Para registrar uma ocorrência de campo, inicie ou continue uma observação pedagógica."`
3. **Preservação Inteligente da Regência Docente (Pilar 1):**
   - Para turmas com **docente único titular**: o seletor `#noteTeacher` é pré-preenchido e travado automaticamente (`disabled = true`), indicando a titularidade unívoca.
   - Para turmas com **regência compartilhada (2 docentes)**: o seletor `#noteTeacher` é habilitado para que o observador aponte se o fato observado ocorreu com o Docente A ou Docente B.
4. **Simplificação Visual e Foco Total no Registro:**
   O modal passa a conter exclusivamente:
   - Título e descrição orientadora enxuta.
   - Seletor de Docente em Foco (`#noteTeacher`).
   - Textarea circunstanciado de fatos (`#noteContent`).
   - Botões "Cancelar" e "Salvar Ocorrência".

---

## 2. Arquitetura e Mapeamento de Impacto

### 2.1 Componentes HTML e JS Afetados

| Componente / Função | Localização (`index.html`) | Impacto / Modificação |
| :--- | :--- | :--- |
| **Modal HTML (`#modalQualitativeNote`)** | Linhas ~5616 - 5685 | Remoção dos elementos `#noteObsContextAlert`, `#noteNoEvaluatedAlert`, `div.form-group` com `#noteSchool`, `div#groupNoteClass` com `#noteClass` e `div.form-group` com `#noteTopic`. |
| **Função `openQualitativeNoteModal()`** | Linhas ~11866 - 11910 | Bloqueio sumário caso `!appState.currentObs`. Obtenção direta de `schoolName`, `className` e `teachers` a partir de `appState.currentObs`. Configuração direta do seletor `#noteTeacher`. |
| **Funções Auxiliares `onNoteSchoolChange()` e `onNoteClassChange()`** | Linhas ~11916 - 12057 | Substituição por função focada ou remoção dos gatilhos de `change` nos seletores excluídos. |
| **Função `saveQualitativeNote()`** | Linhas ~12059 - 12132 | Leitura de `schoolName`, `className` e `classId` diretamente de `appState.currentObs`. Atribuição padrão unificada `topic: 'Ocorrência de Campo'`. Vínculo imediato em `appState.currentObs.linkedNotes`. |
| **Auditoria Interna (`travas_seguranca`)** | Linhas ~17085 - 17120 | Reestruturação dos testes comportamentais do modal para simular uma observação ativa real (`appState.currentObs`), checar a ausência física dos elementos removidos e validar a persistência. |
| **Documentação e Changelogs** | `CHANGELOG.md` e `#modalChangelog` | Registro formal das exclusões e inclusões da versão **0.97**. |

---

## 3. Especificação Passo a Passo de Código (Etapa 2)

### Passo 3.1: Atualização do Modal HTML (`#modalQualitativeNote`)
**Arquivo:** `index.html` (e cópias espelhadas)  
**Localização aproximada:** Linhas 5616 a 5685.

#### Substituir o bloco atual:
```html
  <!-- ================= MODAL: OCORRÊNCIA DE CAMPO ================= -->
  <div id="modalQualitativeNote" class="modal-backdrop" onclick="closeQualitativeNoteModal()">
    <div class="modal-panel" onclick="event.stopPropagation()">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <div style="font-size:17px; font-weight:800; color:var(--primary-dark);">Registro de Ocorrência de Campo</div>
        <button class="btn btn-secondary" style="padding:6px 10px;" onclick="closeQualitativeNoteModal()">✕</button>
      </div>
      <p style="font-size:12px; color:var(--text-secondary); margin-bottom:16px;">
        Utilize para registrar aspectos qualitativos pontuais observados na rotina pedagógica que necessitem de diálogo formativo e encaminhamentos.
      </p>

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

      <div class="form-group">
        <label class="form-label">Dimensão / Tópico Observado</label>
        <select id="noteTopic" class="form-select">
          <option value="Estratégias Didáticas">Estratégias Didáticas e Ampliação de Repertório</option>
          <option value="Gestão do Espaço e Materiais">Gestão do Espaço e Acesso a Materiais</option>
          <option value="Interações e Clima Relacional">Interações, Escuta e Clima Relacional</option>
          <option value="Organização da Rotina">Organização da Rotina e Tempos de Espera</option>
          <option value="Outro Ponto Formativo">Outro Ponto Específico para Devolutiva</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Descrição Circunstanciada dos Fatos</label>
        <textarea id="noteContent" class="form-textarea" style="height:90px;" placeholder="Descreva os fatos observados e pontos para a conversa formativa..."></textarea>
      </div>

      <div style="display:flex; gap:10px; justify-content:flex-end;">
        <button class="btn btn-secondary" onclick="closeQualitativeNoteModal()">Cancelar</button>
        <button class="btn btn-primary" id="btnSaveQualitativeNote" onclick="saveQualitativeNote()">Salvar Ocorrência</button>
      </div>
    </div>
  </div>
```

#### Pelo bloco otimizado e simplificado:
```html
  <!-- ================= MODAL: OCORRÊNCIA DE CAMPO ================= -->
  <div id="modalQualitativeNote" class="modal-backdrop" onclick="closeQualitativeNoteModal()">
    <div class="modal-panel" onclick="event.stopPropagation()">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <div style="font-size:17px; font-weight:800; color:var(--primary-dark);">Registro de Ocorrência de Campo</div>
        <button class="btn btn-secondary" style="padding:6px 10px;" onclick="closeQualitativeNoteModal()">✕</button>
      </div>
      <p style="font-size:12px; color:var(--text-secondary); margin-bottom:16px;">
        Utilize para registrar aspectos qualitativos pontuais observados na rotina pedagógica que necessitem de diálogo formativo e encaminhamentos.
      </p>

      <!-- PROFISSIONAL / DOCENTE EM FOCO -->
      <div class="form-group" id="groupNoteTeacher">
        <label class="form-label" id="labelNoteTeacher">
          Docente em Foco da Ocorrência
          <span style="font-size:11px; font-weight:normal; color:var(--text-secondary); margin-left:4px;" id="subLabelNoteTeacher"></span>
        </label>
        <select id="noteTeacher" class="form-select">
          <!-- Populated dinamicamente com base na turma da observação ativa -->
        </select>
        <div id="noteTeacherHint" style="font-size:11px; margin-top:4px; line-height:1.3;"></div>
      </div>

      <div class="form-group">
        <label class="form-label">Descrição Circunstanciada dos Fatos <span style="color:var(--red);">*</span></label>
        <textarea id="noteContent" class="form-textarea" style="height:110px;" placeholder="Descreva os fatos observados e pontos para a conversa formativa..."></textarea>
      </div>

      <div style="display:flex; gap:10px; justify-content:flex-end;">
        <button class="btn btn-secondary" onclick="closeQualitativeNoteModal()">Cancelar</button>
        <button class="btn btn-primary" id="btnSaveQualitativeNote" onclick="saveQualitativeNote()">Salvar Ocorrência</button>
      </div>
    </div>
  </div>
```

---

### Passo 3.2: Refatoração de `openQualitativeNoteModal()`, Funções Auxiliares e `saveQualitativeNote()`
**Arquivo:** `index.html` (e cópias espelhadas)  
**Localização aproximada:** Linhas 11866 a 12132.

#### Substituir o bloco das funções relacionadas:
```javascript
    function openQualitativeNoteModal() {
      const user = getCurrentUser();
      if (isNucleoEI(user)) {
        showToast('A Coordenadora do Núcleo de EI não realiza lançamento de ocorrências de campo.');
        return;
      }

      // VINCULAÇÃO ESTRITA: Ocorrências exigem observação pedagógica em andamento
      if (!appState.currentObs) {
        showToast('Para registrar uma ocorrência de campo, inicie ou continue uma observação pedagógica.');
        return;
      }

      const obs = appState.currentObs;
      const schoolName = obs.schoolName;
      const className = obs.className;
      const teacherSelect = document.getElementById('noteTeacher');
      const teacherHint = document.getElementById('noteTeacherHint');
      const subLabel = document.getElementById('subLabelNoteTeacher');
      const btnSave = document.getElementById('btnSaveQualitativeNote');

      teacherSelect.innerHTML = '';
      if (teacherHint) {
        teacherHint.innerHTML = '';
        teacherHint.style.display = 'none';
      }

      // 1. Identifica os docentes da turma sendo avaliada
      let teachers = (Array.isArray(obs.teachers) && obs.teachers.length > 0) ? [...obs.teachers] : [];
      if (teachers.length === 0) {
        const schoolClasses = getClassesForSchool(schoolName);
        const targetClass = schoolClasses.find(c => c.name === className);
        if (targetClass && Array.isArray(targetClass.teachers) && targetClass.teachers.length > 0) {
          teachers = [...targetClass.teachers];
        } else if (obs.teacherName) {
          teachers = [obs.teacherName];
        }
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

      document.getElementById('noteContent').value = '';
      document.getElementById('modalQualitativeNote').classList.add('active');
    }

    function closeQualitativeNoteModal() {
      document.getElementById('modalQualitativeNote').classList.remove('active');
    }

    function saveQualitativeNote() {
      const user = getCurrentUser();

      if (!appState.currentObs) {
        showToast('Nenhuma observação pedagógica em andamento para vincular a ocorrência.');
        return;
      }

      const obs = appState.currentObs;
      const schoolName = obs.schoolName;
      const className = obs.className;
      const classId = obs.classId || null;

      const teacherSelect = document.getElementById('noteTeacher');
      const teacherName = teacherSelect ? teacherSelect.value : (obs.teacherName || '');
      const content = document.getElementById('noteContent').value.trim();

      if (!teacherName) {
        showToast('Por favor, indique o docente referente à ocorrência.');
        return;
      }

      if (!content) {
        showToast('Por favor, informe a anotação formativa.');
        return;
      }

      const targetClassObj = getClassesForSchool(schoolName).find(c => c.name === className);

      const newNote = {
        id: 'not-' + Date.now(),
        date: new Date().toISOString().split('T')[0],
        schoolName: schoolName,
        className: className,
        classId: classId || targetClassObj?.id || null,
        targetType: 'turma',
        teacherName: teacherName,
        teachers: (Array.isArray(obs.teachers) && obs.teachers.length > 0)
          ? obs.teachers
          : ((targetClassObj && targetClassObj.teachers) ? targetClassObj.teachers : [teacherName]),
        reportedBy: user.name,
        topic: 'Ocorrência de Campo',
        content: content,
        resolved: false,
        archived: false,
        obsId: obs.id,
        isSample: false
      };

      appState.notes.unshift(newNote);

      // Vinculação mandatória e imediata à observação ativa
      if (!obs.linkedNotes) {
        obs.linkedNotes = [];
      }
      const textToLink = `[${newNote.teacherName}] ${newNote.content}`;
      if (!obs.linkedNotes.includes(textToLink)) {
        obs.linkedNotes.push(textToLink);
      }

      saveState();
      closeQualitativeNoteModal();
      applyUserRoleUI();

      if (document.getElementById('screenNotes').classList.contains('active')) {
        renderNotesScreen();
      }
      
      if (document.getElementById('screenSynthesis').classList.contains('active')) {
        renderSynthesisScreen();
      }
      
      showToast('Ocorrência de campo registrada com sucesso!');
    }
```

> [!NOTE]  
> As funções obsoletas `onNoteSchoolChange()` e `onNoteClassChange()` são eliminadas com segurança, uma vez que nenhum outro componente do sistema realiza chamadas a elas.

---

### Passo 3.3: Atualização do Changelog Duplo

1. **No arquivo `CHANGELOG.md`:**  
   Adicionar linha na tabela do *Sumário Executivo de Versões*:
   ```markdown
   | **0.97** | 21/10/2026 14:30 | `intermediárias/aplicativo_v97_simplificacao_modal_ocorrencias.html` | Solicitação direta / Pilar 1 | Simplificação radical do modal de ocorrências: eliminação de UE/Polo, Turma, Dimensão/Tópico e alerta azul redundante, com vinculação estrita à observação ativa 📝 |
   ```
   E criar a seção detalhada de versão:
   ```markdown
   ---

   ### Versão 0.97 · v7.76 (21/10/2026 14:30)
   **Origem / Insumos:** Solicitação direta de simplificação de UX e alinhamento do Pilar 1.  
   **Arquivo de Referência:** `intermediárias/aplicativo_v97_simplificacao_modal_ocorrencias.html`  
   **Foco Central:** Otimização cirúrgica do fluxo de registro de Ocorrências de Campo em sala de aula.

   #### Modificações e Inclusões:
   - 🔒 **Vinculação Estrita à Observação em Andamento:** Ocorrências de campo passam a ser obrigatoriamente vinculadas à observação ativa (`appState.currentObs`). Tentativas de abertura sem observação em andamento recebem Toast orientador claro.
   - ⚡ **Agilidade e Redução de Atrito Cognitivo:** Abertura do modal prepara instantaneamente o seletor de docentes da turma avaliada, mantendo a trava inteligente para turmas de docente único titular e a escolha simples para duplas regentes.
   - 🎯 **Padronização do Tópico Formativo:** O campo `topic` passa a adotar o valor unificado `'Ocorrência de Campo'`, preservando a compatibilidade integral com a exportação CSV, Síntese Final e tela de histórico.

   #### Exclusões:
   - 🗑️ **Supressão do Alerta Azul Redundante:** Remoção completa do elemento `#noteObsContextAlert` (*"🔒 Observação em andamento: Este registro será vinculado exclusivamente à visita da turma..."*).
   - 🗑️ **Remoção de UE/Polo e Turma no Formulário:** Exclusão dos seletores `#noteSchool` e `#noteClass` e seus contêineres, pois a unidade e a turma são herdadas estritamente da avaliação ativa.
   - 🗑️ **Remoção de Dimensão/Tópico:** Supressão do dropdown `#noteTopic`, eliminando a necessidade de categorização burocrática prematura.
   ```

2. **No modal `#modalChangelog` do `index.html`:**  
   - Atualizar o botão de versão no cabeçalho desktop e mobile:
     `📌 Versão 0.97 · v7.76`
   - Inserir o bloco de versão 0.97 logo no topo da lista interna do `#modalChangelog`.

---

## 4. Critérios de Aceite e Roteiro de Teste / Validação

### Roteiro de Teste Manual:
1. **Tentativa de Abertura sem Observação Ativa:**
   - Estando na tela inicial ou na aba Ocorrências sem nenhuma observação aberta, clicar em `+ Nova Ocorrência de Campo`.
   - **Resultado Esperado:** Modal NÃO abre; Toast informa: *"Para registrar uma ocorrência de campo, inicie ou continue uma observação pedagógica."*
2. **Abertura Durante Observação com Docente Único:**
   - Iniciar ou retomar observação de uma turma de docente único (ex: *Berçário II - Turma Única* da *CEI Professora Maria de Lourdes*).
   - Clicar no botão do FAB menu para registrar Ocorrência de Campo.
   - **Resultado Esperado:**
     - Alerta azul não existe.
     - Campos de Escola e Turma não existem.
     - Campo de Tópico não existe.
     - Campo de Docente exibe *"Carla Beatriz Mendes (Docente Único Regente)"* travado (`disabled`).
     - Botão Salvar está habilitado.
3. **Abertura Durante Observação com Regência Compartilhada (2 Docentes):**
   - Iniciar observação de turma com dois docentes (ex: *Infantil I - Turma A*).
   - Abrir o modal de ocorrência.
   - **Resultado Esperado:**
     - Campo de Docente permite selecionar entre *Ana Carolina Silva* e *Juliana Roberta Rocha*.
4. **Persistência e Vinculação:**
   - Digitar o texto no campo de descrição e clicar em "Salvar Ocorrência".
   - **Resultado Esperado:**
     - Modal fecha; Toast confirma o sucesso.
     - Na aba de Ocorrências (`#screenNotes`), o novo card aparece com a turma e a docente corretas.
     - Na observação ativa, a ocorrência aparece vinculada na Síntese Pedagógica (`obs.linkedNotes`).

---

## 5. Seção Obrigatória de Auditoria: Alterações, Adições e Exclusões nos Algoritmos de Teste

Para garantir a preservação de **100% de cobertura determinística** e compatibilidade com o motor `audit_platform.py` e o painel de diagnóstico in-browser (`#modalAudit`), as seguintes alterações devem ser realizadas:

### 5.1 Alterações no Módulo 6: `travas_seguranca` (`index.html`)

**Localização:** Linhas ~17085 a 17120 de `index.html`.

#### Bloco Anterior no Teste de Ocorrências:
```javascript
// TESTE ADICIONAL PILAR 1: Interações Reais no Modal de Ocorrências
openQualitativeNoteModal();
UI.select(document.getElementById('noteSchool'), 'CEI Professora Maria de Lourdes');

// 1. Caso Docente Único: Berçário II - Turma Única (Carla Beatriz Mendes travada)
UI.select(document.getElementById('noteClass'), 'Berçário II - Turma Única');
const teacherSelect = document.getElementById('noteTeacher');
if (!teacherSelect.disabled || teacherSelect.value !== 'Carla Beatriz Mendes') {
  throw new Error('Falha na trava mandatória de docente único regente (esperado Carla Beatriz Mendes travada)');
}
logger.log('Bloqueio automático e trava mandatória para turma com docente único', true, 'Carla Beatriz Mendes (travado)');

// 2. Caso Dois Docentes: Infantil I - Turma A (Ana Carolina e Juliana)
UI.select(document.getElementById('noteClass'), 'Infantil I - Turma A');
if (teacherSelect.disabled) {
  throw new Error('Seletor de docente bloqueado para turma com dois docentes');
}
const optValues = Array.from(teacherSelect.options).map(o => o.value);
if (!optValues.includes('Ana Carolina Silva') || !optValues.includes('Juliana Roberta Rocha')) {
  throw new Error('Seletor de docentes da turma compartilhada não lista a dupla regente');
}
logger.log('Disponibilização de escolha entre Professor A ou B para turma com dois docentes', true, '2 opções habilitadas');

// 3. Persistência de Ocorrência Atribuída à Turma com Docente Escolhido
UI.select(teacherSelect, 'Juliana Roberta Rocha');
UI.select(document.getElementById('noteTopic'), 'Estratégias Didáticas');
UI.type(document.getElementById('noteContent'), 'Teste determinístico e comportamental de ocorrência.');
saveQualitativeNote();

const createdNote = appState.notes.find(n => n.content && n.content.includes('Teste determinístico e comportamental'));
if (!createdNote || createdNote.className !== 'Infantil I - Turma A' || createdNote.teacherName !== 'Juliana Roberta Rocha') {
  throw new Error('Ocorrência salva não registrou className ou teacherName corretamente');
}
logger.log('Persistência de ocorrência vinculada à turma e ao docente escolhido', true, 'Infantil I - Turma A / Juliana');
closeQualitativeNoteModal();
```

#### Novo Bloco Refatorado de Teste Comportamental:
```javascript
// TESTE PILAR 1 REESTRUTURADO (VERSÃO 0.97): Validação Estrita do Modal de Ocorrências
// 1. Teste de Ausência Física dos Elementos Removidos no DOM
if (document.getElementById('noteSchool') !== null ||
    document.getElementById('noteClass') !== null ||
    document.getElementById('noteTopic') !== null ||
    document.getElementById('noteObsContextAlert') !== null) {
  throw new Error('Elementos suprimidos do modal de ocorrência continuam presentes no DOM');
}
logger.log('Supressão confirmada de campos redundantes no modal de ocorrência', true, 'noteSchool, noteClass, noteTopic e noteObsContextAlert removidos');

// 2. Teste do Guardião: Bloqueio sem Observação Ativa
appState.currentObs = null;
let blockedWithoutObs = false;
const prevToast = window.showToast;
window.showToast = function(msg) {
  if (msg && msg.includes('observação pedagógica')) blockedWithoutObs = true;
};
openQualitativeNoteModal();
window.showToast = prevToast;

if (!blockedWithoutObs || document.getElementById('modalQualitativeNote').classList.contains('active')) {
  throw new Error('Abertura do modal de ocorrência permitida sem observação em andamento');
}
logger.log('Guardião estrito: bloqueio de ocorrência sem observação pedagógica ativa', true);

// 3. Caso Docente Único com Observação Ativa: Berçário II - Turma Única
appState.currentObs = {
  id: 'obs-test-audit-single',
  schoolName: 'CEI Professora Maria de Lourdes',
  className: 'Berçário II - Turma Única',
  teachers: ['Carla Beatriz Mendes'],
  teacherName: 'Carla Beatriz Mendes',
  linkedNotes: []
};
openQualitativeNoteModal();
const teacherSelect = document.getElementById('noteTeacher');
if (!teacherSelect.disabled || teacherSelect.value !== 'Carla Beatriz Mendes') {
  throw new Error('Falha na trava mandatória de docente único regente (esperado Carla Beatriz Mendes travada)');
}
logger.log('Bloqueio automático e trava mandatória para turma com docente único', true, 'Carla Beatriz Mendes (travado)');
closeQualitativeNoteModal();

// 4. Caso Dois Docentes com Observação Ativa: Infantil I - Turma A
appState.currentObs = {
  id: 'obs-test-audit-pair',
  schoolName: 'CEI Professora Maria de Lourdes',
  className: 'Infantil I - Turma A',
  teachers: ['Ana Carolina Silva', 'Juliana Roberta Rocha'],
  teacherName: 'Ana Carolina Silva',
  linkedNotes: []
};
openQualitativeNoteModal();
if (teacherSelect.disabled) {
  throw new Error('Seletor de docente bloqueado para turma com dois docentes');
}
const optValues = Array.from(teacherSelect.options).map(o => o.value);
if (!optValues.includes('Ana Carolina Silva') || !optValues.includes('Juliana Roberta Rocha')) {
  throw new Error('Seletor de docentes da turma compartilhada não lista a dupla regente');
}
logger.log('Disponibilização de escolha entre Professor A ou B para turma com dois docentes', true, '2 opções habilitadas');

// 5. Persistência de Ocorrência com Docente Escolhido e Vinculação Direta
UI.select(teacherSelect, 'Juliana Roberta Rocha');
UI.type(document.getElementById('noteContent'), 'Teste determinístico e comportamental v0.97.');
saveQualitativeNote();

const createdNote = appState.notes.find(n => n.content && n.content.includes('Teste determinístico e comportamental v0.97'));
if (!createdNote || 
    createdNote.schoolName !== 'CEI Professora Maria de Lourdes' || 
    createdNote.className !== 'Infantil I - Turma A' || 
    createdNote.teacherName !== 'Juliana Roberta Rocha' ||
    createdNote.obsId !== 'obs-test-audit-pair') {
  throw new Error('Ocorrência salva não vinculou corretamente à observação ativa ou ao docente');
}
if (!appState.currentObs.linkedNotes || appState.currentObs.linkedNotes.length === 0) {
  throw new Error('Ocorrência não foi anexada aos linkedNotes da observação ativa');
}
logger.log('Persistência e vinculação estrita de ocorrência à turma e docente', true, 'CEI Maria de Lourdes / Infantil I - Turma A');
closeQualitativeNoteModal();
appState.currentObs = null;
```

### 5.2 Validação nos Demais Módulos de Auditoria
- **Módulos 1 a 5 e 7 a 12:** Não realizam chamadas diretas a `#noteSchool` ou `#noteClass`. Permanecem com 100% de integridade e aprovação imediata.
- **Execução Pós-Deploy:** Executar `python3 audit_platform.py --silent-on-success` e reportar unicamente se houverem falhas.
