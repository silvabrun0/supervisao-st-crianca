# PLANO DE IMPLEMENTAÇÃO: PILAR 2 - TRÍADE DE GOVERNANÇA EM 3 NÍVEIS & NÚCLEO DE EDUCAÇÃO INFANTIL

> **DIRETRIZ OBRIGATÓRIA DE EXECUÇÃO (ETAPA 2):**
> O assistente executor (Etapa 2) deve **obrigatoriamente ler e seguir as diretrizes dos arquivos `WORKFLOW_MACOS.md` e `AGENTS.md`** localizados na raiz do projeto antes de aplicar qualquer modificação no código. Nenhuma modificação deve ser realizada sem conformidade estrita com o workflow, incluindo:
> 1. Execução prévia de sincronização com o repositório remoto (`git pull origin main`).
> 2. Preservação integral das regras de negócio existentes, dados cadastrais e blindagens de segurança.
> 3. Verificação de integridade pós-edição com dupla checagem de leitura em cada trecho modificado.
> 4. Salvamento obrigatório do backup intermediário na pasta `intermediárias/` sob o nome `aplicativo_v91_pilar_2_triade_governanca_e_nucleo_ei.html` (e espelho em subpastas caso aplicável).
> 5. Gestão dupla de Changelog no arquivo `CHANGELOG.md` e no modal `#modalChangelog` do `index.html`, registrando a **Versão 0.91**.
> 6. Sincronização idêntica entre o arquivo principal `index.html` da raiz, `gestor supervisao_patos/index.html` e `gestor supervisao_patos/firebase_deploy/public/index.html`.
> 7. Checagem pré-push (`git fetch origin main`), commit semântico (`feat: implementar pilar 2 - triade de governanca em 3 niveis e nucleo de ei`), push para `origin main` e deploy automático no GitHub Pages.
> 8. Execução pós-deploy obrigatória do algoritmo de auditoria (`python3 audit_platform.py --silent-on-success`) com comunicação estrita a falhas.

---

## 1. Diagnóstico e Contexto

### 1.1 Cenário Atual
Atualmente, a governança de perfis na plataforma SerTão Criança apresenta resquícios terminológicos e estruturais da fase inicial do projeto:
- O perfil de gestão central da rede ainda é denominado **"Equipe Técnica"** (`user.roleKey === 'tecnico'`), rótulo burocrático e genérico que não reflete a autoridade pedagógica e institucional da **Coordenadora do Núcleo de Educação Infantil** (responsável direta por toda a rede infantil do município de Patos/PB).
- Nos modais de troca de perfil (`#modalRole` / `#roleBoxTecnico`), o título exibe *"Equipe Técnica & Coordenação da EI (Rodrigo / Helena)"*, com conta padrão atribuída a Rodrigo em vez de Helena Martins (Coordenadora do Núcleo de EI).
- Nos formulários de cadastro e edição de servidores (`#newMemberRole`, `#editMemberRole`), a opção ainda consta como `"Equipe Técnica (Acesso Total)"`.
- Na base de usuários canônica (`USERS_DB`), os usuários de gestão central (`helena`, `rodrigo`, `bruno`) utilizam `roleKey: 'tecnico'`, gerando potenciais fragilidades de acoplamento caso uma migração para `nucleo_ei` não preserve retrocompatibilidade total com contas legadas já persistidas no `localStorage`.
- As regras de escopo e permissão dos 3 níveis (Coordenadora da UE ➔ Formadora do Polo ➔ Coordenadora do Núcleo de EI) precisam ser consolidadas e blindadas de ponta a ponta, garantindo o princípio de autonomia cadastral descentralizada sem quebra da Single Source of Truth (SSOT).

### 1.2 Fundamentação Técnico-Pedagógica (Documento de Insights / Reunião ST Criança 20/10/2026)
Conforme deliberado nas diretrizes oficiais do programa SerTão Criança:
1. **Tríade Canônica de Governança:**
   - **Nível 1 - Coordenador(a) Pedagógico(a) da UE:** Atuação circunscrita estritamente à sua própria Unidade Escolar (`user.school`). Responsável direta por cadastrar, editar e acompanhar turmas e professoras da sua escola.
   - **Nível 2 - Formador(a) Pedagógico(a):** Atuação circunscrita aos coordenadores pedagógicos e unidades escolares do seu **Polo Regional atribuído**. Realiza a tutoria e avaliação formativa das coordenadoras do seu polo, sem visualização ou interferência cruzada em polos alheios.
   - **Nível 3 - Coordenadora do Núcleo de Educação Infantil (EI):** Autoridade pedagógica máxima e gestora central da rede. Possui **acesso onisciente e irrestrito a todas as 32 UEs, polos e servidores**. É quem cadastra e atribui polos aos formadores, libera contas pendentes e gerencia as matrizes de rubricas da rede municipal de Patos. Não realiza avaliações diretas em sala, pois sua função é a governança macro e formulação de políticas formativas com base nos indicadores consolidados.
2. **Renomeação Obrigatória:**
   - O termo *"Equipe Técnica"* deve ser 100% substituído na interface, modais, mensagens de escopo, avisos do sistema e seletores por **"Coordenadora do Núcleo de Educação Infantil"** (ou forma resumida **"Núcleo de EI"**).
3. **Resiliência e Retrocompatibilidade Absoluta (Zero Breaking Changes):**
   - Para não corromper registros no `localStorage` de usuários em produção que já possuam `roleKey: 'tecnico'`, a engine deve implementar a função auxiliar canônica `isNucleoEI(user)` que reconhece transparentemente tanto o novo identificador `'nucleo_ei'` quanto o legado `'tecnico'`.

### 1.3 Resultado Esperado com o Pilar 2
1. **Renomeação Institucional Completa:**
   - Rótulos visuais atualizados no cabeçalho, perfil do usuário, modal `#modalRole` (`#roleBoxTecnico`), modal `#modalAddMember`, modal `#modalEditMember` e na tela de login (`#screenLogin`).
   - `#roleBoxTecnico` agora referencia como titular principal a Coordenadora do Núcleo de EI (**Helena Martins**).
2. **Camada de Compatibilidade Canônica `isNucleoEI(user)`:**
   - Criação de função helper global `isNucleoEI(user)` capaz de receber tanto objetos de usuário quanto strings de chave de perfil, retornando `true` para `'nucleo_ei'` e `'tecnico'`.
   - Normalização em `normalizeRoleData(rawRole)` para reconhecer termos como "núcleo", "nucleo", "ei", "secretaria" e direcionar para `nucleo_ei`.
3. **Blindagem Rigorosa dos 3 Níveis de Escopo (RBAC):**
   - **Coordenadora:** Isolada estritamente em sua UE (`user.school`).
   - **Formadora:** Isolada estritamente em seu Polo Regional (`user.school`).
   - **Coordenadora do Núcleo de EI:** Acesso pleno e universal à totalidade dos dados da rede municipal (32 UEs).
4. **Atualização da Suíte de Auditoria Modular (`audit_platform.py` e `index.html`):**
   - Módulo 1 (`auth_rbac`): Teste formal de login e resolução de perfis dos 3 níveis com Mariana (Coordenadora), Clarice (Formadora), Helena (Coordenadora do Núcleo de EI) e Rodrigo (Núcleo de EI - Governança & Dados), validando `isNucleoEI()`, labels e permissões.
   - Módulo 7 (`formadora_coordenacao`): Verificação de blindagem de polo entre formadoras e confirmação de acesso global do Núcleo de EI.
   - Preservação da meta inegociável de **100% dos testes aprovados (42+/42+)**.

---

## 2. Arquitetura e Pontos de Impacto

### 2.1 Arquivos Afetados
- `index.html` (Arquivo mestre de produção servido pelo GitHub Pages)
- `gestor supervisao_patos/index.html` (Espelho local)
- `gestor supervisao_patos/firebase_deploy/public/index.html` (Espelho Firebase)
- `gestor supervisao_patos/CHANGELOG.md` (Registro da Versão 0.91)
- `docs/documento_insights_supervisao_pedagogica_20261020.md` (Documento de diretrizes e produto)
- `intermediárias/aplicativo_v91_pilar_2_triade_governanca_e_nucleo_ei.html` (Backup intermediário obrigatório)
- `audit_platform.py` (Atualização de metadados de versão e catálogo se necessário)

### 2.2 Estruturas de Dados Envolvidas
1. **Coleção de Autenticação Canônica (`USERS_DB`):**
   - Atualização do registro `helena`:
     ```javascript
     helena: {
       id: 'helena',
       email: 'helena@teste.com',
       password: '123456',
       name: 'Helena Martins',
       roleKey: 'nucleo_ei', // Retrocompatível com checagens via isNucleoEI
       roleTitle: 'Coordenadora do Núcleo de EI',
       avatarText: 'NE',
       school: 'Secretaria Municipal de Educação',
       supervisor: 'Secretário de Educação'
     }
     ```
   - Atualização do registro `rodrigo`:
     ```javascript
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
     ```
   - Atualização do registro `bruno`:
     ```javascript
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
     }
     ```

2. **Equipe Canônica Inicial (`INITIAL_TEAM`):**
   - Atualização da supervisão institucional de formadoras para:
     `Clarice Barbosa` com `supervisor: 'Helena Martins'`.

3. **Helper Canônico Global `isNucleoEI(user)`:**
   ```javascript
   function isNucleoEI(user) {
     if (!user) return false;
     const role = typeof user === 'string' ? user : (user.roleKey || '');
     return role === 'nucleo_ei' || role === 'tecnico';
   }
   ```

### 2.3 Funções e Módulos JavaScript Impactados
| Função / Módulo | Linha Aproximada | Alteração no Pilar 2 |
| :--- | :---: | :--- |
| `USERS_DB` | ~6155-6211 | Atualiza registros de Helena, Rodrigo e Bruno para `roleKey: 'nucleo_ei'` e novos `roleTitle`. |
| `isNucleoEI(user)` | ~6882 (Novo) | Função utilitária canônica para checagem transparente de `nucleo_ei` ou `tecnico`. |
| `getScopedAvaliandos()` | ~6884-6937 | Substitui checagem `user.roleKey === 'tecnico'` por `isNucleoEI(user)`. |
| `getScopedObservations()` | ~6940-7003 | Substitui `user.roleKey === 'tecnico'` por `isNucleoEI(user)` garantindo visão onisciente. |
| `getScopedNotes()` | ~7006-7027 | Substitui `user.roleKey === 'tecnico'` por `isNucleoEI(user)`. |
| `getScopedSchedules()` | ~7029-7062 | Substitui `user.roleKey === 'tecnico'` por `isNucleoEI(user)`. |
| `openRoleModal()` | ~7064-7075 | Ajusta seleção de `#roleBoxTecnico` para `isNucleoEI(u)`. |
| `applyUserRoleUI()` | ~7310-7480 | Atualiza rótulo oficial para `'Coordenadora do Núcleo de EI:'`, ajusta descrição e restrições. |
| `navigateToTab()` | ~7485-7510 | Substitui checagem `user.roleKey === 'tecnico'` por `isNucleoEI(user)`. |
| `startNewObservation()` | ~7585-7600 | Mensagem de bloqueio: *"A Coordenadora do Núcleo de EI não aplica avaliações diretas."* |
| `onNewMemberRoleChange()` | ~11849-11935 | Trata `nucleo_ei` e `tecnico`, atualiza opções de supervisão institucional para Helena Martins. |
| `saveNewTeamMember()` | ~11937-12000 | Normaliza `roleTitle = 'Coordenadora do Núcleo de EI'` para `nucleo_ei` e `tecnico`. |
| `onEditMemberRoleChange()` | ~12050-12120 | Idem em edição de membro. |
| `saveEditedTeamMember()` | ~12125-12200 | Idem no salvamento de edição. |
| `normalizeRoleData()` | ~12438-12455 | Reconhece strings como 'nucleo', 'ei', 'secretaria' atribuindo `roleKey: 'nucleo_ei'`. |
| `renderIndicatorsScreen()` | ~12722-12800 | Substitui `user.roleKey === 'tecnico'` por `isNucleoEI(user)`. |
| `AUDIT_MODULES` (`auth_rbac`) | ~15627-15658 | Atualiza testes para validar Mariana (Coord), Clarice (Formadora), Helena (Núcleo EI) e Rodrigo. |

### 2.4 Elementos HTML Impactados no `index.html`
1. **Modal de Troca de Perfis (`#modalRole`):**
   - Linha ~3654-3657: Bloco `#roleBoxTecnico` atualizado com título, descrição e acionamento padrão para Helena Martins (`selectUserAccount('helena')`).
2. **Seletores de Cargo (`#newMemberRole` e `#editMemberRole`):**
   - Linhas ~5643 e ~5698: Opção atualizada de `<option value="tecnico">Equipe Técnica (Acesso Total)</option>` para `<option value="nucleo_ei">Coordenadora do Núcleo de EI (Acesso Global)</option>`.
3. **Filtro da Aba de Servidores (`#teamRoleFilter`):**
   - Linha ~2620: Opção atualizada de `<option value="tecnico">Equipe Técnica</option>` para `<option value="nucleo_ei">Núcleo de Educação Infantil</option>`.
4. **Instruções de Login (`#screenLogin`):**
   - Linha ~5786: Atualizado de `• rodrigo@teste.com (Equipe Técnica)` para `• helena@teste.com (Coordenadora do Núcleo de EI) / rodrigo@teste.com`.

---

## 3. Especificação de Implementação Passo a Passo (Etapa 2)

### Passo 1: Atualização dos Elementos HTML de Interface

#### 1.1 Atualizar o Modal de Troca de Perfil (`#modalRole`)
Localizar o bloco `#roleBoxTecnico` (aproximadamente linha 3654):

**Código Antigo:**
```html
      <div id="roleBoxTecnico" class="level-box" onclick="selectUserAccount('rodrigo')">
        <div class="level-box-title">Equipe Técnica & Coordenação da EI (Rodrigo / Helena)</div>
        <div class="level-box-desc">Acompanhamento global da rede, indicadores consolidados, gestão de UEs, polos, equipe e rubricas (perfil sem aplicação de avaliações diretas).</div>
      </div>
```

**Código Novo de Substituição:**
```html
      <div id="roleBoxTecnico" class="level-box" onclick="selectUserAccount('helena')">
        <div class="level-box-title">Coordenadora do Núcleo de Educação Infantil (Helena Martins / Rodrigo)</div>
        <div class="level-box-desc">Governança central e acesso irrestrito a toda a rede municipal (32 UEs e Polos), consolidados, gestão de formadores, alocação de polos e rubricas.</div>
      </div>
```

#### 1.2 Atualizar o Filtro de Cargos na Gestão de Servidores (`#teamRoleFilter`)
Localizar a linha ~2620:

**Código Antigo:**
```html
                <option value="tecnico">Equipe Técnica</option>
```

**Código Novo de Substituição:**
```html
                <option value="nucleo_ei">Coordenadora do Núcleo de EI</option>
```

#### 1.3 Atualizar os Seletores de Cargo nos Modais de Cadastro e Edição de Membros
Localizar nas linhas ~5643 e ~5698:

**Código Antigo:**
```html
          <option value="tecnico">Equipe Técnica (Acesso Total)</option>
```

**Código Novo de Substituição:**
```html
          <option value="nucleo_ei">Coordenadora do Núcleo de EI (Acesso Global)</option>
```

#### 1.4 Atualizar Dicas de Credenciais na Tela de Login (`#screenLogin`)
Localizar na linha ~5786:

**Código Antigo:**
```html
        <span style="display:inline-block; margin-top:4px;">• rodrigo@teste.com (Equipe Técnica)</span><br>
```

**Código Novo de Substituição:**
```html
        <span style="display:inline-block; margin-top:4px;">• helena@teste.com (Coordenadora do Núcleo de EI) / rodrigo@teste.com</span><br>
```

---

### Passo 2: Atualização da Base Canônica `USERS_DB` e Helper `isNucleoEI`

Localizar a definição de `USERS_DB` (aproximadamente linha 6155 a 6211) e atualizar os registros de `bruno`, `helena` e `rodrigo`:

**Código Novo de Substituição:**
```javascript
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
```

---

### Passo 3: Atualização das Regras de Escopo (RBAC)

#### 3.1 Atualizar `getScopedAvaliandos()`
Substituir a verificação de perfil técnico:

```javascript
      if (isNucleoEI(user)) {
        return appState.teamMembers.filter(m => m.roleKey === type);
      } else if (user.roleKey === 'formador') {
```

#### 3.2 Atualizar `getScopedObservations()`
Substituir as verificações para garantir visão onisciente para a Coordenadora do Núcleo de EI:

```javascript
        // Se a observação for da TURMA (Pilar 1), valida se a escola e turma pertencem ao escopo
        if (obs.evaluatedType === 'turma') {
          if (obs.status === 'draft') {
            return obs.evaluatedBy === user.name;
          }
          if (isNucleoEI(user)) {
            return true;
          } else if (user.roleKey === 'formador') {
```
E mais abaixo:
```javascript
        if (obs.status === 'draft') {
          return obs.evaluatedBy === user.name;
        }

        if (isNucleoEI(user)) {
          return true;
        } else if (user.roleKey === 'formador') {
```

#### 3.3 Atualizar `getScopedNotes()` e `getScopedSchedules()`
```javascript
    function getScopedNotes() {
      const user = getCurrentUser();
      if (isNucleoEI(user)) {
        return appState.notes;
      } else if (user.roleKey === 'formador') {
```
E em `getScopedSchedules()`:
```javascript
    function getScopedSchedules() {
      const user = getCurrentUser();
      if (isNucleoEI(user)) {
        return appState.schedules;
      } else if (user.roleKey === 'formador') {
```

#### 3.4 Atualizar `openRoleModal()`
```javascript
      const u = getCurrentUser();
      if (u.roleKey === 'coordenador') document.getElementById('roleBoxCoord').classList.add('selected');
      if (u.roleKey === 'formador') document.getElementById('roleBoxFormador').classList.add('selected');
      if (isNucleoEI(u)) document.getElementById('roleBoxTecnico').classList.add('selected');
```

---

### Passo 4: Atualização de `applyUserRoleUI()`, `navigateToTab()` e Ações Diretas

#### 4.1 Atualizar `applyUserRoleUI()`
Localizar o bloco `else if (user.roleKey === 'tecnico')` (linha ~7397):

**Código de Substituição:**
```javascript
      } else if (isNucleoEI(user)) {
        if (scopeTitle) scopeTitle.innerText = 'Coordenadora do Núcleo de EI:';
        if (scopeDesc) scopeDesc.innerText = `Governança global da rede municipal SerTão Criança. Acesso onisciente a todas as 32 UEs, consolidados municipais, gestão de polos, atribuição de formadores e rubricas.`;
        if (deskTabHomeLabel) deskTabHomeLabel.innerText = "Gestão Pedagógica";
        if (unitsNavTab) unitsNavTab.style.display = 'none';
        if (teamNavTab) teamNavTab.style.display = 'none';
        if (adminNavTab) adminNavTab.style.display = 'flex';

        roleFilterGroup.style.display = 'block';
        if (indicatorsTargetFilter) indicatorsTargetFilter.style.display = 'inline-block';
        if (indicatorsTargetBadge) indicatorsTargetBadge.style.display = 'none';
        heroBtn.style.display = 'none';
        
        if (scheduleNavTab) scheduleNavTab.style.display = 'none';
        if (homeScheduleBanner) homeScheduleBanner.style.display = 'none';
        if (homeDraftsHeader) homeDraftsHeader.style.display = 'none';
        if (homeDraftsContainer) homeDraftsContainer.style.display = 'none';
        if (btnNewQualitativeNote) btnNewQualitativeNote.style.display = 'none';
      } else if (user.roleKey === 'pendente') {
        if (scopeTitle) scopeTitle.innerText = 'Acesso Pendente:';
        if (scopeDesc) scopeDesc.innerText = 'Sua conta foi criada e está aguardando liberação de acesso pela Coordenadora do Núcleo de EI.';
```

E mais abaixo nas travas de interface:
```javascript
      const mobRubricsBtn = document.getElementById('mobMenuRubricsBtn');
      if (mobRubricsBtn) mobRubricsBtn.style.display = isNucleoEI(user) ? 'flex' : 'none';

      const mobTabSchedule = document.getElementById('mobTabSchedule');
      if (mobTabSchedule) {
        mobTabSchedule.style.display = (isNucleoEI(user) || user.roleKey === 'pendente' || user.roleKey === 'professora') ? 'none' : 'flex';
      }

      const notes = getScopedNotes();
      const activeNotes = notes.filter(n => !n.archived);
      const navNotesEl = document.getElementById('navNotesCount');
      if (navNotesEl) navNotesEl.innerText = activeNotes.length;

      // Gestão de Matrizes: botões de upload e restauração restritos estritamente à Coordenadora do Núcleo de EI
      const isTecnico = isNucleoEI(user);
```

#### 4.2 Atualizar `navigateToTab()`
```javascript
      if (tabName === 'schedule' && (isNucleoEI(user) || user.roleKey === 'pendente' || user.roleKey === 'professora')) {
        showToast('Acesso não permitido para este perfil.');
        return;
      }
```

#### 4.3 Atualizar `startNewObservation()`
```javascript
      if (isNucleoEI(user)) {
        showToast('A Coordenadora do Núcleo de EI não aplica avaliações diretas.');
        return;
      }
```

---

### Passo 5: Atualização dos Formulários de Cadastro de Membros e Normalização

#### 5.1 Atualizar `onNewMemberRoleChange()` e `saveNewTeamMember()`
Em `onNewMemberRoleChange()`:
```javascript
      } else if (role === 'formador') {
        schoolGroup.style.display = 'block';
        if(schoolLabel) schoolLabel.innerText = 'Polo Regional / Vinculação';
        supLabel.innerText = 'Supervisão Institucional';
        supSelect.disabled = false;
        if (ruleNote) ruleNote.style.display = 'none';
        supSelect.innerHTML = `
          <option value="Helena Martins">Helena Martins (Coordenadora do Núcleo de EI / Secretaria)</option>
        `;
      } else if (isNucleoEI(role)) {
        schoolGroup.style.display = 'none';
        supLabel.innerText = 'Supervisão Institucional';
        supSelect.disabled = true;
        if (ruleNote) ruleNote.style.display = 'none';
        supSelect.innerHTML = `
          <option value="Sede / Gestão Geral">Sede / Gestão Geral</option>
        `;
      }
```

Em `saveNewTeamMember()`:
```javascript
      if (roleKey === 'coordenador') roleTitle = 'Coordenadora Pedagógica';
      if (roleKey === 'formador') roleTitle = 'Formadora Pedagógica';
      if (isNucleoEI(roleKey)) roleTitle = 'Coordenadora do Núcleo de EI';
      if (roleKey === 'pendente') roleTitle = 'Acesso Pendente';
      if (roleKey === 'professora') {
```
E no tratamento de `schoolVal`:
```javascript
      const schoolVal = (isNucleoEI(roleKey) ? 'Sede / Gestão Geral' : ((roleKey === 'pendente') ? 'Aguardando Definição' : school));
      const supVal = (roleKey === 'pendente') ? 'Aguardando Definição' : (supervisor || 'Helena Martins');
```

#### 5.2 Atualizar `onEditMemberRoleChange()` e `saveEditedTeamMember()`
Aplicar exatamente o mesmo tratamento com `isNucleoEI(role)` e `roleTitle = 'Coordenadora do Núcleo de EI'`.

#### 5.3 Atualizar `normalizeRoleData()`
Localizar `function normalizeRoleData(rawRole)` (linha ~12438):

**Código Novo:**
```javascript
    function normalizeRoleData(rawRole) {
      const r = (rawRole || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (r.includes('coord')) {
        return { roleKey: 'coordenador', roleTitle: 'Coordenadora Pedagógica' };
      } else if (r.includes('formad')) {
        return { roleKey: 'formador', roleTitle: 'Formadora Pedagógica' };
      } else if (r.includes('nucleo') || r.includes('tecnic') || r.includes('admin') || r.includes('gestao') || r.includes('secretaria')) {
        return { roleKey: 'nucleo_ei', roleTitle: 'Coordenadora do Núcleo de EI' };
      } else if (r.includes('pendent') || r.includes('aguard')) {
        return { roleKey: 'pendente', roleTitle: 'Acesso Pendente' };
      } else {
        return { roleKey: 'professora', roleTitle: 'Professora' };
      }
    }
```

#### 5.4 Atualizar `renderIndicatorsScreen()`
Localizar a seleção de unidades disponíveis no escopo (linha ~12765):

**Código Novo:**
```javascript
        if (isNucleoEI(user)) {
          availableUnits = (appState.units || []).map(u => u.name);
        } else if (user.roleKey === 'formador') {
```

---

## 4. Critérios de Aceite e Roteiro de Teste/Validação

### 4.1 Roteiro de Validação Manual
- [ ] **Alternância de Perfis no `#modalRole`:**
  - Clicar no avatar de perfil e abrir o modal de seleção.
  - Verificar se a terceira opção exibe:
    - Título: **Coordenadora do Núcleo de Educação Infantil (Helena Martins / Rodrigo)**
    - Descrição: Governança central e acesso irrestrito a toda a rede municipal (32 UEs e Polos)...
  - Ao selecionar a opção, o usuário logado deve ser **Helena Martins** com cargo **Coordenadora do Núcleo de EI**.
- [ ] **Visão Onisciente da Coordenadora do Núcleo de EI:**
  - Na aba de Indicadores, o seletor de Unidades Escolares deve listar todas as unidades cadastradas na rede.
  - No menu lateral/desktop, o botão "Gestão Pedagógica" deve abrir a área operacional (`#screenManagement`) com abas de UEs, Servidores e Rubricas Curriculares ativas.
  - Tentativa de iniciar nova observação direta deve emitir o toast *"A Coordenadora do Núcleo de EI não aplica avaliações diretas."*
- [ ] **Isolamento de Escopo da Formadora:**
  - Alternar para `Clarice Barbosa` (Formadora).
  - Verificar que visualiza apenas Coordenadoras e UEs vinculadas ao seu Polo Regional.
- [ ] **Isolamento de Escopo da Coordenadora da UE:**
  - Alternar para `Mariana Ferreira` (Coordenadora).
  - Verificar que o seletor de UE está travado estritamente em sua escola (`CEI Professora Maria de Lourdes`) e que não há acesso a instrumentos de outros polos.
- [ ] **Gestão de Servidores:**
  - Ao abrir o modal de cadastro de novo servidor, a opção de cargo exibe `"Coordenadora do Núcleo de EI (Acesso Global)"`.
  - Ao cadastrar um Formador, a supervisão institucional aponta para `"Helena Martins (Coordenadora do Núcleo de EI / Secretaria)"`.

---

## 5. Seção Obrigatória de Alterações / Adições / Exclusões no Algoritmo de Auditoria (`audit_platform.py` e `index.html`)

A suíte determinística de testes ponta a ponta (12 Módulos Canônicos) deve ser atualizada para assegurar 100% de cobertura do Pilar 2 sem qualquer regressão.

### 5.1 Alterações no Módulo 1: `auth_rbac` (Autenticação, Usuários, Perfis e RBAC)
- **Modificações:**
  - Expandir a lista `usersToTest` para incluir formalmente os 4 usuários da tríade canônica: `['mariana', 'clarice', 'helena', 'rodrigo']`.
  - Validar a integridade de credenciais no `USERS_DB`, assegurando que `helena` e `rodrigo` possuam `roleKey: 'nucleo_ei'` e títulos alinhados ao Núcleo de EI.
  - Testar a alternância para `helena` via `selectUserAccount('helena')`, verificando que `isNucleoEI(getCurrentUser()) === true` e que o título é `'Coordenadora do Núcleo de EI'`.
  - Testar a retrocompatibilidade de `isNucleoEI()` com objetos simulados contendo chave legada `'tecnico'`.
  - Testar a aplicação de regras de interface (`applyUserRoleUI()`) para Helena, confirmando que o cabeçalho exibe o cargo correto e que as abas administrativas são renderizadas.

**Snippet do Teste Atualizado em `index.html`:**
```javascript
        // --- MÓDULO 1: Autenticação, Usuários, Perfis e RBAC ---
        {
          id: 'auth_rbac',
          name: 'Autenticação, Usuários, Perfis e RBAC',
          run: function(logger) {
            try {
              const usersToTest = ['mariana', 'clarice', 'helena', 'rodrigo'];
              usersToTest.forEach(key => {
                const u = USERS_DB[key];
                if (!u || !u.email || !u.roleKey) throw new Error(`Usuário ${key} ausente ou incompleto no USERS_DB`);
              });
              logger.log('Integridade das credenciais no USERS_DB', true, 'mariana, clarice, helena, rodrigo validados');

              appState.currentUserKey = 'mariana';
              const curUser = getCurrentUser();
              if (curUser.roleKey !== 'coordenador') throw new Error('getCurrentUser() com mariana não retornou coordenador');
              logger.log('Resolução de perfil ativo (mariana ➔ coordenador)', true);

              appState.currentUserKey = 'clarice';
              const clariceUser = getCurrentUser();
              if (clariceUser.roleKey !== 'formador') throw new Error('getCurrentUser() com clarice não retornou formador');
              logger.log('Alternância para perfil Formadora (clarice ➔ formadora)', true);

              appState.currentUserKey = 'helena';
              const helenaUser = getCurrentUser();
              if (!isNucleoEI(helenaUser)) throw new Error('isNucleoEI(helena) retornou false');
              if (helenaUser.roleTitle !== 'Coordenadora do Núcleo de EI') throw new Error('roleTitle de Helena não é Coordenadora do Núcleo de EI');
              logger.log('Alternância e resolução de perfil Coordenadora do Núcleo de EI (helena)', true, helenaUser.roleTitle);

              // Validação de Retrocompatibilidade da função canônica isNucleoEI
              const legacyUser = { roleKey: 'tecnico' };
              const modernUser = { roleKey: 'nucleo_ei' };
              if (!isNucleoEI(legacyUser) || !isNucleoEI(modernUser)) throw new Error('isNucleoEI falhou na dupla compatibilidade (nucleo_ei / tecnico)');
              logger.log('Resiliência e dupla compatibilidade da engine isNucleoEI (nucleo_ei & tecnico)', true);

              applyUserRoleUI();
              const profileBtn = document.getElementById('headerAvatarBtn');
              if (!profileBtn) throw new Error('Botão de perfil ausente no cabeçalho');
              logger.log('Aplicação de regras de interface RBAC (applyUserRoleUI)', true);
            } catch (e) {
              logger.log('Erro de execução no módulo auth_rbac', false, e.message);
            }
          }
        },
```

### 5.2 Adições no Módulo 7: `formadora_coordenacao` (Acompanhamento da Formadora e Isolamento de Perfis)
- **Adições:**
  - Adicionar asserção validando o escopo onisciente de unidades para o Núcleo de EI: ao simular sessão de Helena, `getScopedObservations()` e a listagem de unidades abrangem 100% da rede.
  - Validar bloqueio de avaliação direta para o Núcleo de EI: ao invocar `startNewObservation()`, a ação é vetada sem corrupção de estado.

### 5.3 Exclusões no Algoritmo de Auditoria
- **Exclusões:**
  - Eliminar asserções legadas que esperavam o rótulo rígido `"Equipe Técnica"` como único valor aceito para usuários centrais, substituindo pela verificação flexível e canônica via `isNucleoEI()`.

### 5.4 Validação Pós-Deploy Obrigatória
Após o deploy em produção no GitHub Pages:
```bash
python3 audit_platform.py --silent-on-success
```
- **Critério de Aprovação:** Retorno `0` silencioso, com todos os módulos aprovados (42+/42+ asserções determinísticas). Em caso de qualquer falha, o assistente relatará o log detalhado pontualmente.
