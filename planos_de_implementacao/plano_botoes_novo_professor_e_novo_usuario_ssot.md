# PLANO DE IMPLEMENTAÇÃO: BOTÕES "+ NOVO PROFESSOR" E "+ NOVO USUÁRIO" NA GESTÃO PEDAGÓGICA (SSOT E BLINDAGEM CONTRA COLETA DE E-MAIL DOCENTE)

> **Diretriz de Execução Obrigatória:** O executor desta intervenção DEVE ler integralmente os arquivos [WORKFLOW_MACOS.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md), [AGENTS.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/AGENTS.md) e a skill `.agents/skills/execucao-operario/SKILL.md` antes de efetuar qualquer alteração. Este plano é a especificação exata a ser seguida na Etapa 2.

---

## 1. Diagnóstico e Contexto

A plataforma **SerTão Criança** baseia-se na supervisão formativa e contínua da Educação Infantil. No modelo de dados e de governança do sistema:
1. **Papel Pedagógico dos Docentes (Versão 1.22):**
   - Os professores e professoras de Educação Infantil **não acessam o sistema**, não realizam login nem preenchem avaliações. São unicamente sujeitos pedagógicos acompanhados pelas Coordenadoras Pedagógicas.
   - Na Versão 1.22, o cadastro realizado pela Coordenadora Pedagógica foi radicalmente simplificado para exigir apenas o *Nome Completo*.
2. **Gargalo / Ponto de Fricção Atual:**
   - Na aba de Gestão Pedagógica (`#pedagViewTeam` na tela `#screenPedagManagement`), a interface apresentava um botão único e genérico: `+ Novo Profissional` (`openAddMemberModal`).
   - Quando acionado por perfis com governança ampla (Helena Martins / Coordenadora do Núcleo de EI ou Formadoras), esse modal exibia campos para inserção de e-mail e senha. Caso o operador selecionasse o cargo de professora, ainda havia coleta e exibição de campos de login e senha, gerando risco de cadastros inconsistentes e poluindo a base com dados desnecessários.
   - Da mesma forma, faltava uma distinção clara entre **criar um sujeito pedagógico (Professor)** e **criar um operador do sistema (Usuário com credenciais)**.
3. **Objetivo da Intervenção:**
   - Substituir o botão `+ Novo Profissional` por dois botões especializados:
     - `+ Novo Professor` (`#btnNewTeacher`)
     - `+ Novo Usuário` (`#btnNewUser`)
   - **Blindagem Absoluta contra Coleta de E-mail de Professores:** O fluxo de cadastro de professores não contém campos de e-mail ou senha em hipótese alguma (inviabilidade estrutural no DOM).
   - **Escrita Rigorosa na SSOT (`appState`):** Ambas as criações são gravadas na SSOT (`appState.teamMembers`), porém com a distinção de que Usuários são sincronizados com a base de autenticação (`USERS_DB` e `appState.customUsers`) e Professores permanecem exclusivamente no escopo pedagógico sem credenciais de login.
   - **Governança RBAC:** O botão `+ Novo Usuário` fica oculto para a Coordenadora Pedagógica escolar (que gerencia exclusivamente docentes da sua UE) e acessível para Formadoras e Núcleo de EI.

---

## 2. Arquitetura e Pontos de Impacto

Os arquivos impactados são:
- `index.html` (e suas cópias espelhadas em `gestor supervisao_patos/index.html` e `gestor supervisao_patos/firebase_deploy/public/index.html`):
  - **Barra de Ações da Gestão Pedagógica (`#pedagViewTeam`):**
    - Remoção do botão único `+ Novo Profissional`.
    - Inserção dos botões `+ Novo Professor` (`#btnNewTeacher`) e `+ Novo Usuário` (`#btnNewUser`).
  - **Estrutura de Modais HTML:**
    - Criação de `#modalAddTeacher` (específico para Docentes: apenas Nome Completo, Unidade Escolar contextual e Vinculação de Coordenadora).
    - Criação de `#modalAddUser` (específico para Usuários da plataforma: Nome Completo, E-mail, Senha Provisória, Cargo/Perfil sem opção de docente, Unidade/Polo e Superior).
  - **Lógica JavaScript em `index.html`:**
    - Implementação de `openAddTeacherModal()`, `closeAddTeacherModal()`, `onNewTeacherSchoolChange()`, `saveNewTeacher()`.
    - Implementação de `openAddUserModal()`, `closeAddUserModal()`, `onNewUserRoleChange()`, `onNewUserSchoolChange()`, `saveNewUser()`.
    - Aliases de compatibilidade para funções legadas (`openAddMemberModal`, `closeAddMemberModal`, `saveNewTeamMember`).
    - Atualização de `applyUserRoleUI()`: controle estrito de visibilidade do botão `#btnNewUser` (oculto para Coordenadora, visível para Formadora e Núcleo).
    - Atualização de `renderTeamScreen()`: rotulagem clara na tabela de servidores para indicar que o docente não possui nem necessita de e-mail (`Docente Regente · Sem acesso`).
    - Blindagem em `handleTeamCsvUpload()`: garantia de que professores importados via CSV não recebam e-mail nem credenciais em `USERS_DB`.
  - **Suíte de Testes da Plataforma (`catalogo_dados` em `index.html`):**
    - Validação interativa dos novos botões `#btnNewTeacher` e `#btnNewUser`.
    - Verificação de ausência de e-mail para professores cadastrados e presença para usuários.
    - Asserção de isolamento de escopo RBAC (ocultação de `#btnNewUser` para Coordenadora).
- `CHANGELOG.md` e `#modalChangelog`: Registro sequencial da versão (v1.23).

---

## 3. Especificação Passo a Passo (Snippets Exatos)

### Passo 1: Substituição do Botão na Aba de Gestão Pedagógica

No arquivo `index.html`, localizar a sub-view `#pedagViewTeam` (linha ~3574):

```html
<!-- ANTES -->
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button class="btn btn-secondary" onclick="exportTeamMembersCSV()">💾 Exportar Servidores (CSV)</button>
            <button class="btn btn-secondary" onclick="exportTeamMembersJSON()">📄 Exportar Servidores (JSON)</button>
            <button class="btn btn-secondary" onclick="downloadTeamCsvTemplate()">📥 Baixar Modelo (CSV)</button>
            <button class="btn btn-secondary" onclick="triggerTeamCsvImport()">📤 Importar CSV</button>
            <button class="btn btn-primary" onclick="openAddMemberModal()">+ Novo Profissional</button>
          </div>

<!-- DEPOIS -->
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button class="btn btn-secondary" onclick="exportTeamMembersCSV()">💾 Exportar Servidores (CSV)</button>
            <button class="btn btn-secondary" onclick="exportTeamMembersJSON()">📄 Exportar Servidores (JSON)</button>
            <button class="btn btn-secondary" onclick="downloadTeamCsvTemplate()">📥 Baixar Modelo (CSV)</button>
            <button class="btn btn-secondary" onclick="triggerTeamCsvImport()">📤 Importar CSV</button>
            <button class="btn btn-primary" id="btnNewTeacher" onclick="openAddTeacherModal()">+ Novo Professor</button>
            <button class="btn btn-secondary" id="btnNewUser" onclick="openAddUserModal()">+ Novo Usuário</button>
          </div>
```

---

### Passo 2: Estrutura HTML dos Modais Dedicados

No arquivo `index.html`, substituir o `#modalAddMember` (linha ~7608) pelos dois modais especializados:

```html
<!-- ANTES: #modalAddMember genérico -->

<!-- DEPOIS: #modalAddTeacher e #modalAddUser -->

  <!-- ================= MODAL: CADASTRAR NOVO PROFESSOR ================= -->
  <div id="modalAddTeacher" class="modal-backdrop" onclick="closeAddTeacherModal()">
    <div class="modal-panel" onclick="event.stopPropagation()">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
        <div style="font-size:17px; font-weight:800; color:var(--primary-dark);" id="modalAddTeacherTitle">Cadastrar Novo Professor</div>
        <button class="btn btn-secondary" style="padding:6px 10px;" onclick="closeAddTeacherModal()">✕</button>
      </div>

      <div class="form-group">
        <label class="form-label">Nome Completo</label>
        <input type="text" id="newTeacherName" class="form-input" placeholder="Ex: Patrícia Alves">
      </div>

      <div class="form-group" id="groupNewTeacherSchool">
        <label class="form-label">Unidade Escolar</label>
        <select id="newTeacherSchool" class="form-select" onchange="onNewTeacherSchoolChange()">
          <!-- Populated dynamically -->
        </select>
      </div>

      <div class="form-group" id="groupNewTeacherSupervisor">
        <label class="form-label">Coordenadora Pedagógica Vinculada</label>
        <input type="text" id="newTeacherSupervisorDisplay" class="form-input" readonly style="background:#F8FAFC; color:#64748B;">
      </div>

      <div style="display:flex; gap:10px; justify-content:flex-end; margin-top:18px;">
        <button class="btn btn-secondary" onclick="closeAddTeacherModal()">Cancelar</button>
        <button class="btn btn-primary" id="btnSaveTeacher" onclick="saveNewTeacher()">Salvar Professor</button>
      </div>
    </div>
  </div>

  <!-- ================= MODAL: CADASTRAR NOVO USUÁRIO ================= -->
  <div id="modalAddUser" class="modal-backdrop" onclick="closeAddUserModal()">
    <div class="modal-panel" onclick="event.stopPropagation()">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
        <div style="font-size:17px; font-weight:800; color:var(--primary-dark);" id="modalAddUserTitle">Cadastrar Novo Usuário da Plataforma</div>
        <button class="btn btn-secondary" style="padding:6px 10px;" onclick="closeAddUserModal()">✕</button>
      </div>

      <div class="form-group">
        <label class="form-label">Nome Completo</label>
        <input type="text" id="newUserName" class="form-input" placeholder="Ex: Maria das Graças">
      </div>

      <div class="form-group" id="groupNewUserEmail">
        <label class="form-label">E-mail (Login Institucional)</label>
        <input type="email" id="newUserEmail" class="form-input" placeholder="exemplo@patos.pb.gov.br">
      </div>

      <div class="form-group" id="groupNewUserPassword">
        <label class="form-label">Senha Provisória</label>
        <input type="text" id="newUserPassword" class="form-input" placeholder="Senha provisória de primeiro acesso">
      </div>

      <div class="form-group" id="groupNewUserRole">
        <label class="form-label">Função / Perfil de Acesso</label>
        <select id="newUserRole" class="form-select" onchange="onNewUserRoleChange()">
          <option value="coordenador">Coordenador(a) Pedagógico(a)</option>
          <option value="formador">Formador(a) Pedagógico(a)</option>
          <option value="nucleo_ei">Coordenadora do Núcleo de EI (Acesso Global)</option>
          <option value="pendente">Acesso Pendente</option>
        </select>
      </div>

      <div class="form-group" id="groupNewUserSchool">
        <label class="form-label" id="newUserSchoolLabel">Unidade Escolar</label>
        <select id="newUserSchool" class="form-select" onchange="onNewUserSchoolChange()">
          <!-- Populated dynamically -->
        </select>
      </div>

      <div class="form-group" id="groupNewUserSupervisor">
        <label class="form-label" id="newUserSupervisorLabel">Superior Imediato / Vinculação</label>
        <select id="newUserSupervisor" class="form-select">
          <!-- Populated dynamically -->
        </select>
      </div>

      <div style="display:flex; gap:10px; justify-content:flex-end; margin-top:18px;">
        <button class="btn btn-secondary" onclick="closeAddUserModal()">Cancelar</button>
        <button class="btn btn-primary" id="btnSaveUser" onclick="saveNewUser()">Salvar Usuário</button>
      </div>
    </div>
  </div>
```

---

### Passo 3: Funções JavaScript do Fluxo de Cadastro de Professores

Substituir a implementação de `openAddMemberModal`, `onNewMemberRoleChange` e `saveNewTeamMember` (linhas ~16783 a ~17020) pelas rotinas dedicadas:

```javascript
    // =========================================================================
    // GESTÃO DE PROFESSORES (SEM LOGIN, SEM COLETA DE E-MAIL, ESCRITA NA SSOT)
    // =========================================================================
    function openAddTeacherModal() {
      const user = getCurrentUser();
      const modalTitle = document.getElementById('modalAddTeacherTitle');
      const grpSchool = document.getElementById('groupNewTeacherSchool');
      const schoolSelect = document.getElementById('newTeacherSchool');
      const grpSup = document.getElementById('groupNewTeacherSupervisor');
      const btnSave = document.getElementById('btnSaveTeacher');

      document.getElementById('newTeacherName').value = '';
      schoolSelect.innerHTML = '';

      if (user.roleKey === 'coordenador') {
        if (modalTitle) modalTitle.innerText = `Cadastrar Docente · ${user.school}`;
        if (btnSave) btnSave.innerText = 'Salvar Docente';
        schoolSelect.innerHTML = `<option value="${user.school}">${user.school}</option>`;
        schoolSelect.value = user.school;
        schoolSelect.disabled = true;
        if (grpSchool) grpSchool.style.display = 'none';
        if (grpSup) grpSup.style.display = 'none';
      } else if (user.roleKey === 'formador') {
        if (modalTitle) modalTitle.innerText = 'Cadastrar Novo Professor no Polo';
        if (btnSave) btnSave.innerText = 'Salvar Professor';
        const formadorUnits = (appState.units || []).filter(u => u.polo === user.school || u.name === user.school);
        formadorUnits.forEach(u => {
          const opt = document.createElement('option');
          opt.value = u.name;
          opt.text = u.name;
          schoolSelect.appendChild(opt);
        });
        schoolSelect.disabled = false;
        if (grpSchool) grpSchool.style.display = 'block';
        if (grpSup) grpSup.style.display = 'block';
        onNewTeacherSchoolChange();
      } else {
        // Helena / Núcleo de EI / Admin
        if (modalTitle) modalTitle.innerText = 'Cadastrar Novo Professor na Rede';
        if (btnSave) btnSave.innerText = 'Salvar Professor';
        (appState.units || []).forEach(u => {
          const opt = document.createElement('option');
          opt.value = u.name;
          opt.text = u.name;
          schoolSelect.appendChild(opt);
        });
        schoolSelect.disabled = false;
        if (grpSchool) grpSchool.style.display = 'block';
        if (grpSup) grpSup.style.display = 'block';
        onNewTeacherSchoolChange();
      }

      document.getElementById('modalAddTeacher').classList.add('active');
    }

    function closeAddTeacherModal() {
      const modal = document.getElementById('modalAddTeacher');
      if (modal) modal.classList.remove('active');
    }

    function onNewTeacherSchoolChange() {
      const schoolSelect = document.getElementById('newTeacherSchool');
      const supDisplay = document.getElementById('newTeacherSupervisorDisplay');
      if (!schoolSelect || !supDisplay) return;

      const selSchool = schoolSelect.value;
      const cp = (appState.teamMembers || []).find(m => m.roleKey === 'coordenador' && m.school === selSchool);
      supDisplay.value = cp ? `${cp.name} (Coordenação Pedagógica da Unidade)` : 'Coordenação Pedagógica da Unidade';
    }

    function saveNewTeacher() {
      const user = getCurrentUser();
      const nameInput = document.getElementById('newTeacherName');
      const name = (nameInput ? nameInput.value : '').trim();
      const schoolSelect = document.getElementById('newTeacherSchool');
      
      if (!name) {
        showToast('Por favor, informe o nome completo do professor.');
        return;
      }

      const school = (user.roleKey === 'coordenador') ? user.school : (schoolSelect ? schoolSelect.value : '');
      if (!school) {
        showToast('Por favor, selecione a Unidade Escolar do docente.');
        return;
      }

      let supervisor = '';
      if (user.roleKey === 'coordenador') {
        supervisor = user.name;
      } else {
        const cp = (appState.teamMembers || []).find(m => m.roleKey === 'coordenador' && m.school === school);
        supervisor = cp ? cp.name : 'Coordenação Pedagógica da Unidade';
      }

      const newId = 'usr-' + Date.now();
      const newTeacher = {
        id: newId,
        name: name,
        roleKey: 'professora',
        roleTitle: 'Professora',
        school: school,
        supervisor: supervisor,
        email: '',
        password: '',
        avatarText: name.substring(0, 2).toUpperCase(),
        mustChangePassword: false
      };

      if (!Array.isArray(appState.teamMembers)) appState.teamMembers = [];
      appState.teamMembers.push(newTeacher);

      // Docentes não acessam o sistema: não sincronizar em USERS_DB nem em customUsers
      saveState();
      closeAddTeacherModal();
      renderTeamScreen();
      showToast(user.roleKey === 'coordenador' ? 'Docente cadastrada com sucesso!' : 'Professor cadastrado com sucesso!');
    }
```

---

### Passo 4: Funções JavaScript do Fluxo de Cadastro de Usuários

```javascript
    // =========================================================================
    // GESTÃO DE USUÁRIOS DA PLATAFORMA (COM LOGIN, SENHA E BASE DE AUTENTICAÇÃO)
    // =========================================================================
    function openAddUserModal() {
      const user = getCurrentUser();
      const modalTitle = document.getElementById('modalAddUserTitle');
      const roleSelect = document.getElementById('newUserRole');

      document.getElementById('newUserName').value = '';
      document.getElementById('newUserEmail').value = '';
      document.getElementById('newUserPassword').value = '';

      if (user.roleKey === 'formador') {
        if (modalTitle) modalTitle.innerText = `Cadastrar Coordenadora · ${user.school}`;
        roleSelect.value = 'coordenador';
        roleSelect.disabled = true;
      } else {
        if (modalTitle) modalTitle.innerText = 'Cadastrar Novo Usuário da Plataforma';
        roleSelect.disabled = false;
        roleSelect.value = 'coordenador';
      }

      onNewUserRoleChange();
      document.getElementById('modalAddUser').classList.add('active');
    }

    function closeAddUserModal() {
      const modal = document.getElementById('modalAddUser');
      if (modal) modal.classList.remove('active');
    }

    function onNewUserRoleChange() {
      const user = getCurrentUser();
      const role = document.getElementById('newUserRole').value;
      const schoolGroup = document.getElementById('groupNewUserSchool');
      const schoolSelect = document.getElementById('newUserSchool');
      const schoolLabel = document.getElementById('newUserSchoolLabel');
      const supLabel = document.getElementById('newUserSupervisorLabel');
      const supSelect = document.getElementById('newUserSupervisor');

      supSelect.innerHTML = '';
      schoolSelect.innerHTML = '';

      if (role === 'coordenador') {
        if (schoolGroup) schoolGroup.style.display = 'block';
        if (schoolLabel) schoolLabel.innerText = 'Unidade Escolar';
        if (supLabel) supLabel.innerText = 'Formadora Responsável';
        supSelect.disabled = false;

        if (user.roleKey === 'formador') {
          const formadorUnits = (appState.units || []).filter(u => u.polo === user.school || u.name === user.school);
          formadorUnits.forEach(u => {
            const opt = document.createElement('option');
            opt.value = u.name; opt.text = u.name;
            schoolSelect.appendChild(opt);
          });
          supSelect.innerHTML = `<option value="${user.name}">${user.name} (Formadora do Polo)</option>`;
          supSelect.disabled = true;
        } else {
          (appState.units || []).forEach(u => {
            const opt = document.createElement('option');
            opt.value = u.name; opt.text = u.name;
            schoolSelect.appendChild(opt);
          });
          const formadores = (appState.teamMembers || []).filter(m => m.roleKey === 'formador');
          if (formadores.length > 0) {
            formadores.forEach(f => {
              const opt = document.createElement('option');
              opt.value = f.name; opt.text = `${f.name} (${f.school})`;
              supSelect.appendChild(opt);
            });
          } else {
            supSelect.innerHTML = `<option value="Helena Martins">Helena Martins (Núcleo de EI)</option>`;
          }
        }
      } else if (role === 'formador') {
        if (schoolGroup) schoolGroup.style.display = 'block';
        if (schoolLabel) schoolLabel.innerText = 'Polo Regional / Vinculação';
        if (supLabel) supLabel.innerText = 'Supervisão Institucional';
        supSelect.disabled = true;
        supSelect.innerHTML = `<option value="Helena Martins">Helena Martins (Coordenadora do Núcleo de EI)</option>`;

        const polos = [...new Set((appState.units || []).map(u => u.polo))];
        polos.forEach(p => {
          const opt = document.createElement('option');
          opt.value = p; opt.text = p;
          schoolSelect.appendChild(opt);
        });
      } else if (isNucleoEI(role)) {
        if (schoolGroup) schoolGroup.style.display = 'none';
        if (supLabel) supLabel.innerText = 'Supervisão Institucional';
        supSelect.disabled = true;
        supSelect.innerHTML = `<option value="Sede / Gestão Geral">Sede / Gestão Geral</option>`;
      } else if (role === 'pendente') {
        if (schoolGroup) schoolGroup.style.display = 'none';
        if (supLabel) supLabel.innerText = 'Supervisão Institucional';
        supSelect.disabled = true;
        supSelect.innerHTML = `<option value="Aguardando Definição">Aguardando Definição</option>`;
      }
    }

    function onNewUserSchoolChange() {
      const role = document.getElementById('newUserRole').value;
      if (role === 'coordenador') {
        const schoolVal = document.getElementById('newUserSchool').value;
        const unitObj = (appState.units || []).find(u => u.name === schoolVal);
        if (unitObj) {
          const formadora = (appState.teamMembers || []).find(m => m.roleKey === 'formador' && m.school === unitObj.polo);
          const supSelect = document.getElementById('newUserSupervisor');
          if (formadora && supSelect && !supSelect.disabled) {
            supSelect.value = formadora.name;
          }
        }
      }
    }

    function saveNewUser() {
      const user = getCurrentUser();
      const name = (document.getElementById('newUserName')?.value || '').trim();
      const email = (document.getElementById('newUserEmail')?.value || '').trim().toLowerCase();
      const password = document.getElementById('newUserPassword')?.value || '';
      const roleKey = document.getElementById('newUserRole').value;
      const school = document.getElementById('newUserSchool')?.value || '';
      const supervisor = document.getElementById('newUserSupervisor')?.value || '';

      if (!name) {
        showToast('Por favor, informe o nome completo do usuário.');
        return;
      }
      if (!email || !email.includes('@')) {
        showToast('Por favor, informe um e-mail válido para login.');
        return;
      }
      if (!password) {
        showToast('Por favor, informe uma senha provisória.');
        return;
      }

      let roleTitle = 'Coordenadora Pedagógica';
      if (roleKey === 'formador') roleTitle = 'Formadora Pedagógica';
      if (isNucleoEI(roleKey)) roleTitle = 'Coordenadora do Núcleo de EI';
      if (roleKey === 'pendente') roleTitle = 'Acesso Pendente';

      const schoolVal = isNucleoEI(roleKey) ? 'Sede / Gestão Geral' : ((roleKey === 'pendente') ? 'Aguardando Definição' : school);
      const supVal = (roleKey === 'pendente') ? 'Aguardando Definição' : (supervisor || 'Helena Martins');

      const newId = 'usr-' + Date.now();
      const newUser = {
        id: newId,
        name,
        roleKey,
        roleTitle,
        school: schoolVal,
        supervisor: supVal,
        email,
        password,
        avatarText: name.substring(0, 2).toUpperCase(),
        mustChangePassword: true
      };

      if (!Array.isArray(appState.teamMembers)) appState.teamMembers = [];
      appState.teamMembers.push(newUser);

      // Sincronização na base de autenticação (SSOT)
      if (!appState.customUsers) appState.customUsers = {};
      appState.customUsers[newId] = newUser;
      USERS_DB[newId] = newUser;

      saveState();
      closeAddUserModal();
      renderTeamScreen();
      showToast('Usuário cadastrado com sucesso!');
    }

    // Aliases para retrocompatibilidade
    function openAddMemberModal() { openAddTeacherModal(); }
    function closeAddMemberModal() { closeAddTeacherModal(); closeAddUserModal(); }
    function saveNewTeamMember() { saveNewTeacher(); }
```

---

### Passo 5: Atualização de RBAC em `applyUserRoleUI()`

Na função `applyUserRoleUI()`, adicionar a configuração de visibilidade dos botões:

```javascript
      // Governança RBAC para criação de profissionais/usuários
      const btnNewTeacher = document.getElementById('btnNewTeacher');
      const btnNewUser = document.getElementById('btnNewUser');

      if (user.roleKey === 'coordenador') {
        if (btnNewTeacher) btnNewTeacher.style.display = 'inline-flex';
        if (btnNewUser) btnNewUser.style.display = 'none'; // Coordenadora gerencia unicamente o corpo docente da escola
      } else if (user.roleKey === 'formador') {
        if (btnNewTeacher) btnNewTeacher.style.display = 'inline-flex';
        if (btnNewUser) btnNewUser.style.display = 'inline-flex';
      } else {
        // Helena / Núcleo de EI / Administrador
        if (btnNewTeacher) btnNewTeacher.style.display = 'inline-flex';
        if (btnNewUser) btnNewUser.style.display = 'inline-flex';
      }
```

---

### Passo 6: Higienização da Tabela de Equipe em `renderTeamScreen()`

No loop de membros em `renderTeamScreen()`:

```javascript
        let memberEmail = m.email;
        if (!memberEmail && m.roleKey !== 'professora') {
          const dbKey = Object.keys(USERS_DB).find(k => k === m.id || USERS_DB[k].id === m.id || (USERS_DB[k].name && USERS_DB[k].name.toLowerCase() === m.name.toLowerCase()));
          if (dbKey && USERS_DB[dbKey] && USERS_DB[dbKey].email) {
            memberEmail = USERS_DB[dbKey].email;
            m.email = memberEmail;
          }
        }
        const emailDisplay = (m.roleKey === 'professora') 
          ? '<span style="font-size:11px; color:var(--text-secondary); font-style:italic;">Docente Regente (Sem acesso)</span>'
          : (memberEmail ? `✉️ ${memberEmail}` : 'Sem e-mail vinculado');
```

---

### Passo 7: Blindagem de Importação CSV em `handleTeamCsvUpload()`

Garantir que, se o registro importado for professora, `email` seja forçado para vazio e não seja criado usuário em `USERS_DB`:

```javascript
          if (roleKey === 'professora') {
            email = '';
            memberData.email = '';
          }

          if (existingIdx >= 0) {
            appState.teamMembers[existingIdx] = { ...appState.teamMembers[existingIdx], ...memberData };
          } else {
            appState.teamMembers.push(memberData);
          }

          // Sincroniza com USERS_DB e customUsers apenas se NÃO for docente
          if (roleKey !== 'professora' && (email || memberId.startsWith('usr-') || USERS_DB[memberId])) {
            const authRecord = {
              id: memberId,
              name: resolvedName,
              email: email || `${resolvedName.toLowerCase().replace(/\s+/g, '.')}@sertao.edu`,
              password: '123456',
              roleKey,
              roleTitle,
              school,
              supervisor,
              avatarText: resolvedName.substring(0, 2).toUpperCase(),
              mustChangePassword: true
            };
            if (!appState.customUsers) appState.customUsers = {};
            appState.customUsers[memberId] = authRecord;
            USERS_DB[memberId] = authRecord;
          }
```

---

## 4. Critérios de Aceite e Roteiro de Teste

1. **Critério 1: Presença dos Dois Botões e Substituição Integral**
   - Na aba de Gestão Pedagógica (`#pedagViewTeam`), o botão `+ Novo Profissional` não deve mais existir no DOM.
   - Devem existir `#btnNewTeacher` (rotulado "+ Novo Professor") e `#btnNewUser` (rotulado "+ Novo Usuário").

2. **Critério 2: Blindagem Absoluta contra Coleta de E-mail de Professores**
   - Ao abrir `#modalAddTeacher`, deve haver **apenas** o campo de Nome Completo (e campos contextuais de escola/supervisora para Formadora/Núcleo).
   - O modal `#modalAddTeacher` NÃO deve possuir campos de e-mail ou senha em seu formulário.
   - O registro persistido em `appState.teamMembers` deve possuir `roleKey: 'professora'` e `email: ''`.
   - O professor cadastrado NÃO deve ser incluído em `USERS_DB` nem em `appState.customUsers`.

3. **Critério 3: Criação de Usuário com Login e Escrita na SSOT**
   - Ao abrir `#modalAddUser`, os campos de E-mail e Senha Provisória são obrigatórios.
   - A opção `professora` NÃO deve constar no dropdown `#newUserRole`.
   - Ao salvar, o novo usuário deve ser gravado simultaneamente em `appState.teamMembers`, `USERS_DB` e `appState.customUsers`, permitindo login imediato.

4. **Critério 4: Escopo RBAC da Coordenadora Pedagógica**
   - Ao logar como Coordenadora (`mariana`), o botão `#btnNewUser` deve estar estritamente oculto (`display: none`).
   - O botão `#btnNewTeacher` permanece visível, abrindo o modal com Unidade e Supervisora travadas/ocultas e foco unicamente em Nome Completo.

5. **Critério 5: Retrocompatibilidade e Estabilidade Sintática**
   - Nenhuma chamada legada a `openAddMemberModal()` ou `closeAddMemberModal()` deve gerar exceções.
   - Pré-voo sintático `python3 audit_platform.py --check-syntax` aprovado com 100% de integridade.

---

## 5. Seção Obrigatória: Alterações / Adições / Exclusões no Algoritmo de Auditoria (`audit_platform.py` e `index.html`)

### 5.1 Atualizações no Módulo 2 (`catalogo_dados`) em `index.html`

No teste de catálogo de dados de `index.html` (linhas ~22810 a ~22840), atualizar a validação interativa:

1. **Exclusões:**
   - Remover a asserção legada que tentava digitar e-mail e senha ao cadastrar professora via `openAddMemberModal()`.
2. **Adições:**
   - **Teste Interativo de `#btnNewTeacher`:**
     - Chamar `openAddTeacherModal()`.
     - Confirmar que `#modalAddTeacher` não contém inputs de email (`#newTeacherEmail` não existe no DOM).
     - Preencher `#newTeacherName` com `'Docente Teste Auditoria EndToEnd'` e `#newTeacherSchool` com `'EMEI Pequeno Príncipe'`.
     - Chamar `saveNewTeacher()`.
     - Asserir que o docente foi persistido em `appState.teamMembers` com `roleKey === 'professora'` e `email === ''`, e certificar que **NÃO** existe em `USERS_DB` nem em `customUsers`.
   - **Teste Interativo de `#btnNewUser`:**
     - Chamar `openAddUserModal()`.
     - Confirmar que `#newUserRole` NÃO contém a opção `'professora'`.
     - Preencher `#newUserName` com `'Coordenador Teste Auditoria EndToEnd'`, `#newUserEmail` com `'coord.audit.e2e@patos.pb.gov.br'`, `#newUserPassword` com `'123456'`, role com `'coordenador'` e escola com `'EMEI Pequeno Príncipe'`.
     - Chamar `saveNewUser()`.
     - Asserir que o usuário foi persistido em `appState.teamMembers` E sincronizado em `USERS_DB` e `appState.customUsers`.
   - **Teste de RBAC da Coordenadora:**
     - Sob sessão da Coordenadora (`mariana`):
     - Asserir que `document.getElementById('btnNewUser').style.display === 'none'`.
     - Asserir que `document.getElementById('btnNewTeacher').style.display !== 'none'`.
     - Abrir `#modalAddTeacher` e asserir que `#groupNewTeacherSchool` e `#groupNewTeacherSupervisor` estão ocultos (`style.display === 'none'`).

### 5.2 Validação Sintática e Auditoria Pós-Deploy (`audit_platform.py`)
- **Pré-Voo:** Executar `python3 audit_platform.py --check-syntax` para garantir ausência de erros léxicos e sintáticos de JavaScript inline.
- **Pós-Deploy:** Executar `python3 audit_platform.py --silent-on-success` após o commit/push na branch `main`.
