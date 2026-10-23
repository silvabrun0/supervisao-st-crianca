# PLANO DE IMPLEMENTAÇÃO: SIMPLIFICAÇÃO RADICAL DO CADASTRO DE DOCENTES, HIGIENIZAÇÃO DE JORNADA E ORDENAÇÃO CANÔNICA DE ABAS

> **Diretriz de Execução Obrigatória:** O executor desta intervenção DEVE ler integralmente os arquivos [WORKFLOW_MACOS.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md), [AGENTS.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/AGENTS.md) e a skill `.agents/skills/execucao-operario/SKILL.md` antes de efetuar qualquer alteração. Este plano é a especificação exata a ser seguida na Etapa 2.

---

## 1. Diagnóstico e Contexto

A plataforma **SerTão Criança** baseia-se na supervisão formativa e contínua da Educação Infantil. No fluxo de negócio estabelecido:
1. **Perfil Docente:** Os professores e professoras de Educação Infantil **não acessam o sistema**, não realizam login nem preenchem avaliações. Eles são unicamente sujeitos pedagógicos avaliados pelas Coordenadoras Pedagógicas. Portanto, atribuir e-mail, senha, exigir seleção de cargo ("Função / Cargo"), seleção de escola ("Unidade Escolar") ou seleção de superior ("Coordenadora Pedagógica Vinculada (Automática)") no momento em que a coordenadora cadastra um docente é redundante e burocrático, gerando fricção desnecessária.
2. **Higienização de Rótulos Residuais:**
   - A identificação técnica residual `"📍 Polo Regional 1 (Norte) · Gestão Autônoma sob SSOT Única (Pilar 14)"` (anteriormente presente em cards contextuais) não possui valor decisório para a coordenadora pedagógica escolar e deve ser sumariamente erradicada.
   - O sufixo burocrático `"(Padrão MEC)"` em `"JORNADA ESCOLAR (PADRÃO MEC)"` deve ser higienizado para a nomenclatura direta e limpa `"Jornada Escolar"`.
   - A frase técnica `"Gestão descentralizada de turmas, jornada MEC e alocação nominal de docentes da sua escola."` exibida no subtítulo da gestão de turmas (`#classesViewSubtitle`) e referências contextuais correlatas devem ser eliminadas.
3. **Hierarquia e Ordenação Canônica de Abas:**
   - A aba **"Início"** (`#deskTabHome`) deve ser categoricamente o primeiro elemento da navegação, seguida pela aba contextual **"Minha Escola"** (`#deskTabOpManagement`) em 2º lugar, cronograma em 3º e painel de indicadores em 4º. O usuário não deve, sob hipótese alguma, visualizar "Minha Escola" antes de "Início".

---

## 2. Arquitetura e Pontos de Impacto

Os arquivos impactados são:
- `index.html` (e suas cópias espelhadas em `gestor supervisao_patos/index.html` e `gestor supervisao_patos/firebase_deploy/public/index.html`):
  - **Cabeçalho Desktop (`.desktop-nav`):** Ordem estrita `#deskTabHome` (1ª) e `#deskTabOpManagement` (2ª).
  - **Modal de Cadastro de Membro (`#modalAddMember`):** Ocultação condicional estrita de login (`#groupNewMemberEmail`), senha (`#groupNewMemberPassword`), cargo (`#groupNewMemberRole`), unidade (`#groupNewMemberSchool`) e coordenadora vinculada (`#groupNewMemberSupervisor`) para a sessão de Coordenadora, mantendo apenas **Nome Completo**.
  - **Modal de Edição de Membro (`#modalEditMember`):** Ocultação dos mesmos campos redundantes para a Coordenadora, exibindo apenas Nome Completo e ação de exclusão.
  - **Lógica de Persistência (`saveNewTeamMember`):** Atribuição automática de `roleKey = 'professora'`, `school = user.school`, `supervisor = user.name`, `email = ''`, `password = ''`, sem registrar no banco de autenticação `USERS_DB` / `customUsers`.
  - **Card de Gestão na Home (`#homeOpManagementSubtitle`):** Higienização de `jornada MEC` para `jornada escolar`.
  - **Subtítulo de Turmas (`#classesViewSubtitle`):** Supressão definitiva da frase `"Gestão descentralizada de turmas, jornada MEC e alocação nominal de docentes da sua escola."`.
  - **Suíte de Testes da Plataforma (`catalogo_dados` e `navegacao_layout`):** Asserções determinísticas das novas regras ergonômicas.
- `CHANGELOG.md` e `#modalChangelog`: Registro sequencial da versão (v1.22).

---

## 3. Especificação Passo a Passo (Snippets Exatos)

### Passo 1: Higienização do Subtítulo de Turmas e Card da Home

No arquivo `index.html`:

1. No subtítulo de turmas (linha ~3526):
```html
<!-- ANTES -->
<p style="font-size:12px; color:var(--text-secondary);" id="classesViewSubtitle">Gestão descentralizada de turmas, jornada MEC e alocação nominal de docentes regentes</p>

<!-- DEPOIS -->
<p style="font-size:12px; color:var(--text-secondary); display:none;" id="classesViewSubtitle"></p>
```

2. Na função `renderClassesScreen()` (linha ~15960):
```javascript
// ANTES
if (subtitle) subtitle.innerText = `Gestão descentralizada de turmas, jornada MEC e alocação nominal de docentes da sua escola.`;

// DEPOIS
if (subtitle) {
  subtitle.innerText = '';
  subtitle.style.display = 'none';
}
```

3. No card da Home `#homeOpManagementCard` (linha ~3392):
```html
<!-- ANTES -->
<p style="font-size:12px; color:var(--text-secondary); margin:2px 0 0 0;" id="homeOpManagementSubtitle">Gerencie as turmas, jornada MEC, docentes regentes titulares e caracterização da sua escola.</p>

<!-- DEPOIS -->
<p style="font-size:12px; color:var(--text-secondary); margin:2px 0 0 0;" id="homeOpManagementSubtitle">Gerencie as turmas, docentes regentes titulares e caracterização da sua escola.</p>
```

4. Na função `applyUserRoleUI()` (linha ~9622):
```javascript
// ANTES
if (homeOpSubtitle) homeOpSubtitle.innerText = `Gerencie as turmas, jornada MEC, docentes regentes titulares e caracterização de ${user.school}.`;

// DEPOIS
if (homeOpSubtitle) homeOpSubtitle.innerText = `Gerencie as turmas, docentes regentes titulares e caracterização de ${user.school}.`;
```

---

### Passo 2: Remoção Definitiva de Qualquer Resquício de Polo/SSOT Residual

1. Na função `renderUnitsScreen()`:
Garantir que no bloco de Coordenadora (`coordContainer.innerHTML`), nenhuma linha de texto contenha `📍 ${myUnit.polo} · Gestão Autônoma sob SSOT Única (Pilar 14)`. O cabeçalho do card da UE deve exibir exclusivamente o ícone, o nome da escola e o botão de salvar:
```javascript
coordContainer.innerHTML = `
  <div class="card" style="border-left: 4px solid var(--primary); padding: 20px;">
    <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
      <div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:24px;">🏢</span>
          <h3 style="font-size:18px; font-weight:800; color:var(--primary-dark); margin:0;">${myUnit.name}</h3>
        </div>
      </div>
      <button class="btn btn-primary" onclick="saveSchoolCharacterization()" style="font-size:12px; padding:8px 14px;">
        💾 Salvar Caracterização da UE
      </button>
    </div>
    ...
`;
```

---

### Passo 3: Remoção do Sufixo "(Padrão MEC)" em Jornada Escolar

1. No cabeçalho da tabela `#pedagViewClasses` (linha ~3550):
```html
<th>Jornada Escolar</th>
```

2. No modal `#modalClassEditor` (linha ~7528):
```html
<label class="form-label">Jornada Escolar</label>
```

---

### Passo 4: Simplificação Radical do Cadastro de Docentes (Docentes sem Login)

1. **Identificadores nos Grupos do Modal `#modalAddMember`:**
Garantir os seguintes IDs nos contêineres dos campos:
- `#groupNewMemberEmail` (E-mail / Login)
- `#groupNewMemberPassword` (Senha)
- `#groupNewMemberRole` (Função / Cargo)
- `#groupNewMemberSchool` (Unidade Escolar)
- `#groupNewMemberSupervisor` (Coordenadora Pedagógica Vinculada / Superior)

2. **Na função `openAddMemberModal()`:**
```javascript
function openAddMemberModal() {
  const user = getCurrentUser();
  const modalTitle = document.getElementById('modalAddMemberTitle');
  const grpEmail = document.getElementById('groupNewMemberEmail');
  const grpPass = document.getElementById('groupNewMemberPassword');
  const grpRole = document.getElementById('groupNewMemberRole');
  const grpSchool = document.getElementById('groupNewMemberSchool');
  const grpSup = document.getElementById('groupNewMemberSupervisor');
  const btnSave = document.getElementById('btnSaveNewMember');

  document.getElementById('newMemberName').value = '';
  if(document.getElementById('newMemberEmail')) document.getElementById('newMemberEmail').value = '';
  if(document.getElementById('newMemberPassword')) document.getElementById('newMemberPassword').value = '';

  const roleSelect = document.getElementById('newMemberRole');
  if (user.roleKey === 'coordenador') {
    if (modalTitle) modalTitle.innerText = `Cadastrar Docente · ${user.school}`;
    if (btnSave) btnSave.innerText = 'Salvar Docente';
    roleSelect.value = 'professora';
    roleSelect.disabled = true;
    
    // Docentes não acessam a plataforma: oculta login, senha, função/cargo, unidade escolar e coordenadora vinculada
    if (grpEmail) grpEmail.style.display = 'none';
    if (grpPass) grpPass.style.display = 'none';
    if (grpRole) grpRole.style.display = 'none';
    if (grpSchool) grpSchool.style.display = 'none';
    if (grpSup) grpSup.style.display = 'none';
  } else if (user.roleKey === 'formador') {
    if (modalTitle) modalTitle.innerText = 'Cadastrar Coordenadora Pedagógica';
    if (btnSave) btnSave.innerText = 'Salvar Cadastro';
    roleSelect.value = 'coordenador';
    roleSelect.disabled = true;
    if (grpEmail) grpEmail.style.display = 'block';
    if (grpPass) grpPass.style.display = 'block';
    if (grpRole) grpRole.style.display = 'block';
    if (grpSchool) grpSchool.style.display = 'block';
    if (grpSup) grpSup.style.display = 'block';
  } else {
    if (modalTitle) modalTitle.innerText = 'Cadastrar Novo Profissional na Rede';
    if (btnSave) btnSave.innerText = 'Salvar Cadastro';
    roleSelect.disabled = false;
    roleSelect.value = 'pendente';
    if (grpEmail) grpEmail.style.display = 'block';
    if (grpPass) grpPass.style.display = 'block';
    if (grpRole) grpRole.style.display = 'block';
    if (grpSchool) grpSchool.style.display = 'block';
    if (grpSup) grpSup.style.display = 'block';
  }

  onNewMemberRoleChange();
  document.getElementById('modalAddMember').classList.add('active');
}
```

3. **Na função `onNewMemberRoleChange()`:**
Reforçar a ocultação estrita quando `user.roleKey === 'coordenador'`:
```javascript
  if (user.roleKey === 'coordenador') {
    schoolSelect.innerHTML = `<option value="${user.school}">${user.school}</option>`;
    schoolSelect.value = user.school;
    schoolSelect.disabled = true;
    if (schoolGroup) schoolGroup.style.display = 'none';
    if (document.getElementById('groupNewMemberRole')) document.getElementById('groupNewMemberRole').style.display = 'none';
    if (document.getElementById('groupNewMemberEmail')) document.getElementById('groupNewMemberEmail').style.display = 'none';
    if (document.getElementById('groupNewMemberPassword')) document.getElementById('groupNewMemberPassword').style.display = 'none';
    if (document.getElementById('groupNewMemberSupervisor')) document.getElementById('groupNewMemberSupervisor').style.display = 'none';
  }
```

4. **Na função `saveNewTeamMember()`:**
```javascript
  if (user.roleKey === 'coordenador' || roleKey === 'professora') {
    email = '';
    password = '';
  }

  const newMember = {
    id: newId,
    name,
    roleKey,
    roleTitle,
    school: schoolVal,
    supervisor: supVal,
    email: email || '',
    password: password || '',
    avatarText: name.substring(0, 2).toUpperCase(),
    mustChangePassword: roleKey !== 'professora'
  };

  appState.teamMembers.push(newMember);

  // Docentes não realizam login: sincronizar USERS_DB e customUsers apenas para perfis avaliadores/gestores
  if (roleKey !== 'professora' && (email || password)) {
    if (!appState.customUsers) appState.customUsers = {};
    appState.customUsers[newId] = newMember;
    USERS_DB[newId] = newMember;
  }
```

5. **Na função `openEditMemberModal(id)`:**
Ocultar os mesmos grupos redundantes quando for docente ou sessão de coordenadora:
```javascript
  if (user.roleKey === 'coordenador' || member.roleKey === 'professora') {
    if (modalTitle) modalTitle.innerText = `Editar Docente · ${member.school}`;
    if (delBtn) delBtn.innerText = 'Excluir Docente';
    if (grpEmail) grpEmail.style.display = 'none';
    if (grpRole) grpRole.style.display = 'none';
    if (grpSchool) grpSchool.style.display = 'none';
    if (grpSup) grpSup.style.display = 'none';
    roleSelect.disabled = true;
  }
```

---

### Passo 5: Ordenação Canônica de Abas ("Início" em 1º lugar e "Minha Escola" em 2º lugar)

1. **Na estrutura estática do cabeçalho desktop (`.desktop-nav`):**
```html
<nav class="desktop-nav">
  <button class="nav-link active" id="deskTabHome" onclick="navigateToTab('home')">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    <span id="deskTabHomeLabel">Início</span>
  </button>
  <button class="nav-link" id="deskTabOpManagement" onclick="navigateToTab('opManagement')" style="display:none;">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
    <span id="deskTabOpManagementLabel">Minha Escola</span>
  </button>
  <button class="nav-link" id="deskTabSchedule" onclick="navigateToTab('schedule')">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
    Cronograma
  </button>
  <button class="nav-link" id="deskTabDiag" onclick="navigateToTab('indicators')">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
    Painel de Indicadores
  </button>
</nav>
```

2. **Na função `applyUserRoleUI()`:**
Garantir que a reatividade de `#deskTabHomeLabel` mantenha "Início" categoricamente quando a usuária for Coordenadora Pedagógica, Formadora ou Docente, e que `#deskTabOpManagementLabel` receba "Minha Escola" para a Coordenadora, sem jamais inverter a posição dos botões no DOM:
```javascript
  if (user.roleKey === 'coordenador') {
    if (deskTabHomeLabel) deskTabHomeLabel.innerText = 'Início';
    if (opNavTab) {
      opNavTab.style.display = 'flex';
      if (opNavLabel) opNavLabel.innerText = 'Minha Escola';
    }
  }
```

3. **Garantia de Destino Inicial:**
Na inicialização do aplicativo (`initApp()`) e na alternância de perfil (`selectUserAccount()`), o direcionamento obrigatório inicial é `navigateToTab('home')`, garantindo que o usuário visualize a tela inicial antes de qualquer outra.

---

## 4. Critérios de Aceite e Roteiro de Teste/Validação

1. **Critério 1: Cadastro de Docente Mínimo e Focado:**
   - Logar como Mariana Ferreira (`coordenador`).
   - Clicar em "+ Novo Profissional" / "+ Cadastrar Docente".
   - Confirmar visualmente que o modal exibe **única e exclusivamente** o campo "Nome Completo" e os botões "Cancelar" e "Salvar Docente".
   - Confirmar a ausência absoluta de campos para E-mail, Senha, Função/Cargo, Unidade Escolar e Coordenadora Vinculada.
   - Cadastrar uma nova docente ("Docente Teste Aceite") e confirmar salvamento com sucesso, sem geração de credenciais em `USERS_DB`.

2. **Critério 2: Edição de Docente Simplificada:**
   - Clicar em "Editar" em qualquer docente listada na escola da Coordenadora.
   - Confirmar que o modal de edição exibe apenas "Nome Completo", "Excluir Docente" e "Salvar Alterações", sem campos de e-mail, cargo, escola ou supervisor.

3. **Critério 3: Higienização de Títulos e Textos Burocráticos:**
   - Inspecionar a tela de turmas da Coordenadora: o cabeçalho exibe o título da tela e nenhum subtítulo com `"Gestão descentralizada de turmas, jornada MEC e alocação nominal de docentes da sua escola."`.
   - Inspecionar a tabela de turmas e o modal de turmas: a coluna e o campo exibem estritamente `"Jornada Escolar"`, sem qualquer menção a `(Padrão MEC)`.
   - Inspecionar o card de UE: nenhuma menção a `"📍 Polo Regional 1 (Norte) · Gestão Autônoma sob SSOT Única (Pilar 14)"`.

4. **Critério 4: Ordem Inviolável de Abas:**
   - No cabeçalho desktop, a 1ª aba é categoricamente **"Início"** (`#deskTabHome`) e a 2ª aba é **"Minha Escola"** (`#deskTabOpManagement`).
   - Ao carregar a página ou alternar usuários, a tela inicial ativa é "Início".

---

## 5. Seção Obrigatória: Alterações / Adições / Exclusões no Algoritmo de Auditoria (`audit_platform.py` e `index.html`)

### 5.1 Adições ao Módulo 2 (`catalogo_dados`) em `index.html`
1. **Teste Determinístico do Modal de Cadastro para Coordenadora:**
   - Abrir `#modalAddMember` com `appState.currentUserKey = 'mariana'`.
   - Validar que `#groupNewMemberEmail`, `#groupNewMemberPassword`, `#groupNewMemberRole`, `#groupNewMemberSchool` e `#groupNewMemberSupervisor` estão com `display === 'none'`.
   - Validar que o campo `#newMemberName` está visível.
2. **Teste Determinístico do Modal de Edição para Coordenadora:**
   - Abrir `#modalEditMember` para uma professora da unidade.
   - Validar que `#groupEditMemberEmail`, `#groupEditMemberRole`, `#groupEditMemberSchool` e `#groupEditMemberSupervisor` estão com `display === 'none'`.
3. **Teste de Higienização de Subtítulos e Rótulos:**
   - Validar que `#classesViewSubtitle` não contém `"Gestão descentralizada de turmas, jornada MEC e alocação nominal de docentes da sua escola."`.
   - Validar que nenhum elemento do card da UE contém `"📍 Polo Regional 1 (Norte) · Gestão Autônoma sob SSOT Única (Pilar 14)"`.
   - Validar que os cabeçalhos de turmas contêm `"Jornada Escolar"` e nenhum sufixo `"(Padrão MEC)"`.

### 5.2 Adições ao Módulo 14 (`navegacao_layout`) em `index.html`
1. **Validação da Ordem Canônica de Abas no Desktop:**
   - Inspecionar os elementos `.nav-link` dentro de `.desktop-nav`.
   - Garantir que `#deskTabHome` é estritamente o 1º elemento (`index === 0`).
   - Garantir que `#deskTabOpManagement` é estritamente o 2º elemento (`index === 1`).
   - Validar que `#deskTabHomeLabel.innerText === 'Início'` sob a sessão da Coordenadora Pedagógica.

### 5.3 Adaptação do Script `audit_platform.py`
- Preservar a execução silenciosa `python3 audit_platform.py --silent-on-success`.
- Garantir a checagem pré-voo `python3 audit_platform.py --check-syntax` com 100% de conformidade léxica/sintática no JSC nativo do macOS.

---

## 6. Checklist de Execução (Para a Etapa 2)

- [ ] Ler `WORKFLOW_MACOS.md` e a skill `execucao-operario`.
- [ ] Aplicar as alterações pontuais em `index.html`.
- [ ] Validar a integridade sintática via `python3 audit_platform.py --check-syntax`.
- [ ] Salvar backup em `intermediárias/aplicativo_v122_simplificacao_cadastro_docente_jornada_e_ordem_abas.html`.
- [ ] Atualizar `CHANGELOG.md` e `#modalChangelog` (Versão 1.22).
- [ ] Sincronizar simultaneamente as cópias espelhadas:
  - `gestor supervisao_patos/index.html`
  - `gestor supervisao_patos/firebase_deploy/public/index.html`
- [ ] Executar checagem de concorrência (`git fetch origin main` / `git log HEAD..origin/main`).
- [ ] Realizar commit semântico e efetuar `git push origin main`.
- [ ] Rodar a auditoria pós-deploy: `python3 audit_platform.py --silent-on-success`.
