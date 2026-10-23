# PLANO DE IMPLEMENTAÇÃO: REFINAMENTO DO CADASTRO DE DOCENTES E HIGIENIZAÇÃO VISUAL DE TÍTULOS

## 1. Visão Geral e Objetivos
Atender à solicitação direta de refinamento ergonômico e simplificação operacional:
1. **Remoção de Subtítulo Técnico Residual:**
   - Retirar a linha textual residual `"📍 Polo Regional 1 (Norte) · Gestão Autônoma sob SSOT Única (Pilar 14)"` exibida no card de caracterização da Unidade Escolar (`#coordinatorUnitCardContainer`) na tela de Unidades Escolares.
2. **Higienização Terminológica de Jornada:**
   - Remover o sufixo `"(Padrão MEC)"` de `"JORNADA ESCOLAR (PADRÃO MEC)"` no modal de criação/edição de turmas (`#modalClassEditor`) e na tabela de turmas (`#pedagViewClasses`), mantendo a rotulagem limpa `"Jornada Escolar"`.
3. **Ergonomia e Simplificação Radical no Cadastro e Edição de Docentes pela Coordenadora:**
   - Reconhecimento da premissa arquitetural do SerTão Criança: **professores não acessam o sistema**, sendo avaliados pelas coordenadoras pedagógicas.
   - Logo, ao cadastrar ou editar um(a) docente, a Coordenadora Pedagógica não deve definir e-mail de login nem senha.
   - Ocultar no modal de cadastro (`#modalAddMember`) e edição (`#modalEditMember`) para a Coordenadora:
     - E-mail e Senha de acesso (`#groupNewMemberEmail`, `#groupNewMemberPassword`, `#groupEditMemberEmail`).
     - "Função / Cargo" (`#groupNewMemberRole`, `#groupEditMemberRole`), pois no escopo da coordenadora é sempre Docente de Educação Infantil.
     - "Unidade Escolar" (`#groupNewMemberSchool`, `#groupEditMemberSchool`), pois é sempre a unidade da própria coordenadora (`user.school`).
     - "Coordenadora Pedagógica Vinculada (Automática)" (`#groupNewMemberSupervisor`, `#groupEditMemberSupervisor`), pois a vinculação é automática à própria coordenadora.
   - O formulário para a Coordenadora conterá exclusivamente o campo essencial: **Nome Completo** (além das ações de Cancelar e Salvar / Excluir).
   - Ao salvar (`saveNewTeamMember`), caso `user.roleKey === 'coordenador'`, define automaticamente `roleKey = 'professora'`, `school = user.school`, `supervisor = user.name`, `email = ''`, `password = ''`, e não polui o banco de credenciais de login (`USERS_DB` / `customUsers`).

---

## 2. Detalhamento das Alterações

### 2.1 Higienização do Card de Caracterização da UE
- Arquivo: `index.html` (dentro de `renderUnitsScreen()`):
- Remover a linha `📍 ${myUnit.polo} · Gestão Autônoma sob SSOT Única (Pilar 14)`.

### 2.2 Remoção do Sufixo "(Padrão MEC)"
- No cabeçalho da tabela `#pedagViewClasses`:
  - De: `<th>Jornada (Padrão MEC)</th>`
  - Para: `<th>Jornada Escolar</th>`
- No label do campo em `#modalClassEditor`:
  - De: `<label class="form-label">Jornada Escolar (Padrão MEC)</label>`
  - Para: `<label class="form-label">Jornada Escolar</label>`

### 2.3 Simplificação do Modal de Adicionar Membro (`#modalAddMember`)
- Adicionar IDs para encapsular os campos de credenciais e cargo:
  - `<div class="form-group" id="groupNewMemberEmail">`
  - `<div class="form-group" id="groupNewMemberPassword">`
  - `<div class="form-group" id="groupNewMemberRole">`
- Em `openAddMemberModal()`:
  - Se `user.roleKey === 'coordenador'`:
    - Atualizar título do modal para: `Cadastrar Docente · ${user.school}`.
    - Ocultar: `#groupNewMemberEmail`, `#groupNewMemberPassword`, `#groupNewMemberRole`, `#groupNewMemberSchool`, `#groupNewMemberSupervisor`.
    - Manter visível apenas: `Nome Completo`.
  - Se outro perfil (Formadora ou Núcleo de EI):
    - Exibir os campos pertinentes ao seu respectivo nível de gestão.
- Em `saveNewTeamMember()`:
  - Se `user.roleKey === 'coordenador'` ou `roleKey === 'professora'`:
    - Definir `email = ''`, `password = ''`.
    - Não registrar em `USERS_DB` ou `appState.customUsers` (docentes não realizam login).
    - Preservar inclusão em `appState.teamMembers`.

### 2.4 Simplificação do Modal de Editar Membro (`#modalEditMember`)
- Adicionar IDs nos grupos:
  - `<div class="form-group" id="groupEditMemberEmail">`
  - `<div class="form-group" id="groupEditMemberRole">`
- Em `openEditMemberModal(id)`:
  - Se `user.roleKey === 'coordenador'` (ou `member.roleKey === 'professora'`):
    - Título: `Editar Docente · ${member.school}`
    - Ocultar: `#groupEditMemberEmail`, `#groupEditMemberRole`, `#groupEditMemberSchool`, `#groupEditMemberSupervisor`.
    - Manter visível apenas `Nome Completo` e o botão de exclusão de docente.
  - Se outro perfil:
    - Exibir conforme escopo RBAC.

---

## 3. Seção Obrigatória de Auditoria
### 3.1 Alterações no Engine de Testes (`index.html`) e `audit_platform.py`
- **Módulo 2 (`catalogo_dados`):**
  1. Validar que para Coordenadora (`mariana`), a chamada a `openAddMemberModal()` oculta os grupos `#groupNewMemberEmail`, `#groupNewMemberPassword`, `#groupNewMemberRole`, `#groupNewMemberSchool` e `#groupNewMemberSupervisor`, mantendo apenas o campo de Nome Completo.
  2. Validar que `openEditMemberModal()` para Coordenadora oculta os campos desnecessários de credenciais, cargo, unidade e supervisor.
  3. Validar que na tabela de turmas e no modal de edição de turmas, o rótulo é estritamente `"Jornada Escolar"`, sem menção ao sufixo `"(Padrão MEC)"`.
  4. Manter 100% de aprovação (138+ asserções) em todos os 12 módulos canônicos.
