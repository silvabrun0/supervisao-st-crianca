# PLANO DE IMPLEMENTAÇÃO — REMOÇÃO DA ABA "HISTÓRICO" DO PERFIL DA COORDENADORA DO NÚCLEO DE EI

> **Status:** 📐 Proposto / Em Análise (Etapa 1 - O Arquiteto)  
> **Data:** 29 de Outubro de 2026  
> **Versão Alvo:** `1.59` (`v8.2.26`)  
> **Arquivo de Backup Intermediário:** `intermediárias/aplicativo_v1.59_remocao_aba_historico_coord_ei.html`  
> **Arquivos Principais Afetados:**  
> - `js/core/rbac.js` (Governança RBAC e visibilidade condicional de abas e menus)  
> - `js/core/navigation.js` (Guarda de rota defensiva em `navigateToTab`)  
> - `js/audit/audit_engine.js` (Asserções estritas no Módulo 1 `auth_rbac`)  
> - `index.html` (Changelog modal `#modalChangelog` e botão `.btn-changelog`)  
> - `firebase_deploy/public/` (Sincronização estrita das cópias espelhadas)  
> - `CHANGELOG.md` (Registro histórico sequencial v1.59)  

---

## 0. Diretriz de Execução Obrigatória (Etapa 2 - Operário)

> [!IMPORTANT]
> **Aviso ao Assistente Executor (Etapa 2 - Operário):**  
> Antes de aplicar qualquer alteração resultante deste plano, você **DEVE OBRIGATORIAMENTE** ler o manual [`WORKFLOW_MACOS.md`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md), o [`WORKFLOW_GITHUB.md`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_GITHUB.md) e a skill [`.agents/skills/execucao-operario/SKILL.md`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/.agents/skills/execucao-operario/SKILL.md).  
> 
> - **Trava Crítica da Etapa 1:** Durante a vigência deste planejamento, nenhum arquivo de código de produção deve ser modificado, comitado ou enviado ao repositório remoto.  
> - **Execução Mecânica da Etapa 2:** Na Etapa 2, execute o plano sem improvisações, execute a blindagem sintática pré-voo (`python3 audit_platform.py --check-syntax`), crie o backup intermediário em `intermediárias/aplicativo_v1.59_remocao_aba_historico_coord_ei.html`, atualize o changelog duplo (`CHANGELOG.md` e `#modalChangelog` / `.btn-changelog`), sincronize as cópias espelhadas do Firebase (`firebase_deploy/public/`), realize o deploy via `git push origin main` e execute a auditoria pós-deploy via `python3 audit_platform.py --silent-on-success`.

---

## 1. Diagnóstico do Problema e Contexto Pedagógico / RBAC

### 1.1 Contexto e Justificativa Pedagógica
Na arquitetura do ecossistema pedagógico **SerTão Criança**, a governança da supervisão é estruturada em uma tríade de acompanhamento formativo direto:
1. **Docente / Professora Regente (`roleKey: 'professora'`):** Recebe acompanhamento formativo e devolutivas pedagógicas em sala.
2. **Coordenação Pedagógica da Escola (`roleKey: 'coordenador'`, ex: Mariana Ferreira):** Realiza a observação formativa direta das professoras de sua Unidade Escolar (`user.school`), gera rascunhos, finaliza avaliações e necessita do **Histórico de Observações** (`screenHistory`) para consultar, filtrar e analisar a evolução de seus registros.
3. **Formadora Pedagógica Regional (`roleKey: 'formador'`, ex: Clarice Barbosa):** Realiza a supervisão e acompanhamento formativo das Coordenadoras Pedagógicas do seu Polo Regional, necessitando também de acesso ao histórico.
4. **Coordenadora do Núcleo de Educação Infantil (`roleKey: 'nucleo_ei'` / `isNucleoEI(user)`, ex: Helena Martins):** Atua no nível estratégico e normativo da rede municipal (Secretaria Municipal de Educação). Sua missão é a **governança global da rede**, gestão de polos regionais, parametrização de calendários e ciclos avaliativos (`#modalBimesterPeriods`), matrizes curriculares e análise de macroindicadores educacionais.

### 1.2 O Problema Identificado
- **O perfil da Coordenadora de EI NÃO realiza observações de campo:**
  - O botão de ação hero (`#btnNewObsHero` - "NOVA OBSERVAÇÃO") já é explicitamente ocultado em `applyUserRoleUI()` (`heroBtn.style.display = 'none'`).
  - A aba de Cronograma de Acompanhamento (`#deskTabSchedule` e `#mobTabSchedule`) já é bloqueada e ocultada (`scheduleNavTab.style.display = 'none'`).
  - O perfil não gera nem gerencia rascunhos de avaliação (`homeDraftsHeader.style.display = 'none'`).
- **Inconsistência de Interface (RBAC):**  
  Apesar de não efetuar observações diretas de campo, a aba **"Histórico"** (`#deskTabHist` no desktop e o botão "Acessar Histórico" no menu gaveta mobile `#mobMenuHistBtn`) permanece indevidamente visível para a Coordenadora de EI.  
  A tela de Histórico (`screenHistory`) é orientada ao ciclo de vida de fichas de observação aplicadas pelo próprio usuário (filtros de rascunhos próprios, auto-arquivamento, etc.). A sua presença no menu da Coordenadora de EI polui a interface, gera sobrecarga cognitiva e contradiz o princípio de que esse perfil não aplica observações.

---

## 2. Arquitetura da Solução e Pontos de Impacto

```mermaid
flowchart TD
    A["Alternância de Perfil / Login (applyUserRoleUI)"] --> B{"Perfil Ativo: isNucleoEI(user)?"}
    
    B -->|Sim: nucleo_ei (Helena Martins)| C["Coordenadora do Núcleo de EI"]
    C --> C1["#deskTabHist.style.display = 'none' (Oculta Aba Desktop)"]
    C --> C2["#mobMenuHistBtn.style.display = 'none' (Oculta Botão Mobile Drawer)"]
    C --> C3["Guarda em navigateToTab('history'): Emite Toast de restrição e aborta rota"]
    C --> C4["Fail-Safe: Se screenHistory estiver ativa ao trocar para Helena, redireciona para 'home'"]

    B -->|Não: coordenador (Mariana Ferreira)| D["Coordenação Pedagógica da UE"]
    D --> D1["#deskTabHist.style.display = 'flex' (Aba Histórico Visível)"]
    D --> D2["#mobMenuHistBtn.style.display = 'flex' (Botão Histórico Visível)"]
    D --> D3["Acesso pleno a rascunhos e observações finalizadas da UE"]

    B -->|Não: formador (Clarice Barbosa)| E["Formadora Pedagógica"]
    E --> E1["#deskTabHist.style.display = 'flex' (Aba Visível)"]
    E --> E2["#mobMenuHistBtn.style.display = 'flex' (Botão Visível)"]
```

### 2.1 Mapeamento dos Componentes Afetados
1. **Módulo de Permissões e Perfis (`js/core/rbac.js`):**
   - Na função `applyUserRoleUI()`:
     - No bloco `else if (isNucleoEI(user))`, ocultar `#deskTabHist` e `#mobMenuHistBtn` (`style.display = 'none'`).
     - Caso a tela `#screenHistory` esteja ativa no DOM no momento da alternância para a Coordenadora de EI, redirecionar defensivamente para a tela `'home'`.
     - No bloco `else if (user.roleKey === 'pendente')`, manter também ocultos `#deskTabHist` e `#mobMenuHistBtn`.
     - No reset inicial de `applyUserRoleUI()`, garantir que `#deskTabHist` e `#mobMenuHistBtn` sejam restabelecidos como `display = 'flex'` para perfis com permissão (Coordenação de UE e Formadoras).
2. **Módulo de Roteamento e Navegação (`js/core/navigation.js`):**
   - Na função `navigateToTab(tabName, subFilter)`:
     - Adicionar verificação de guarda: se `tabName === 'history'` e `isNucleoEI(user)` for verdadeiro, exibir toast informativo (`"Acesso ao histórico restrito: a Coordenadora do Núcleo de EI não realiza observações."`) e retornar imediatamente.
3. **Módulo de Auditoria Automatizada (`js/audit/audit_engine.js`):**
   - No Módulo 1 (`auth_rbac`), adicionar asserção determinística comprovando:
     - Ocultação de `#deskTabHist` e `#mobMenuHistBtn` quando autenticado como Helena Martins (`nucleo_ei`).
     - Bloqueio de rota em `navigateToTab('history')` para Helena Martins.
     - Preservação da visibilidade e funcionalidade de `#deskTabHist` e `#mobMenuHistBtn` para Mariana Ferreira (`coordenador`).
4. **Espelhos do Firebase (`firebase_deploy/public/`):**
   - Sincronização exata dos módulos `js/core/rbac.js`, `js/core/navigation.js`, `js/audit/audit_engine.js` e `index.html`.
5. **Changelog Duplo:**
   - Registro sequencial da versão **1.59 (v8.2.26)** em `CHANGELOG.md` e em `index.html` (`.btn-changelog` e `#modalChangelog`).

---

## 3. Especificação de Implementação Passo a Passo (Snippets Exatos)

### Passo 1: Ocultação da Aba e do Botão Mobile em `js/core/rbac.js`

No arquivo [`js/core/rbac.js`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/js/core/rbac.js), dentro da função `applyUserRoleUI()`:

1. **No bloco `else if (isNucleoEI(user))` (em torno da linha 586):**
```javascript
      } else if (isNucleoEI(user)) {
        if (scopeTitle) scopeTitle.innerText = 'Coordenadora do Núcleo de EI:';
        if (scopeDesc) scopeDesc.innerText = `Governança global da rede municipal SerTão Criança. Acesso onisciente a todas as 32 UEs, consolidados municipais, gestão de polos, atribuição de formadores e rubricas.`;
        if (deskTabHomeLabel) deskTabHomeLabel.innerText = "Gestão Pedagógica";
        if (unitsNavTab) unitsNavTab.style.display = 'none';
        if (teamNavTab) teamNavTab.style.display = 'none';
        if (adminNavTab) adminNavTab.style.display = 'flex';

        // Ocultação da aba Histórico no cabeçalho desktop e no menu drawer mobile
        if (histNavTab) histNavTab.style.display = 'none';
        if (mobMenuHistBtn) mobMenuHistBtn.style.display = 'none';

        roleFilterGroup.style.display = 'block';
        if (indicatorsTargetFilter) indicatorsTargetFilter.style.display = 'inline-block';
        if (indicatorsTargetBadge) indicatorsTargetBadge.style.display = 'none';
        heroBtn.style.display = 'none';
        
        if (scheduleNavTab) scheduleNavTab.style.display = 'none';
        if (homeScheduleBanner) homeScheduleBanner.style.display = 'none';
        if (homeDraftsHeader) homeDraftsHeader.style.display = 'none';
        if (homeDraftsContainer) homeDraftsContainer.style.display = 'none';

        // Redirecionamento defensivo caso o usuário estivesse na tela de Histórico
        if (document.getElementById('screenHistory')?.classList.contains('active')) {
          navigateToTab('home');
        }
```

2. **No bloco `else if (user.roleKey === 'pendente')` (em torno da linha 603):**
```javascript
      } else if (user.roleKey === 'pendente') {
        if (scopeTitle) scopeTitle.innerText = 'Acesso Pendente:';
        if (scopeDesc) scopeDesc.innerText = 'Sua conta foi criada e está aguardando liberação de acesso pela Coordenadora do Núcleo de EI.';
        if (deskTabHomeLabel) deskTabHomeLabel.innerText = "Início";
        if (unitsNavTab) unitsNavTab.style.display = 'none';
        if (teamNavTab) teamNavTab.style.display = 'none';
        if (adminNavTab) adminNavTab.style.display = 'none';
        if (histNavTab) histNavTab.style.display = 'none';
        if (mobMenuHistBtn) mobMenuHistBtn.style.display = 'none';
        roleFilterGroup.style.display = 'none';
        if (indicatorsTargetFilter) indicatorsTargetFilter.style.display = 'none';
        if (indicatorsTargetBadge) indicatorsTargetBadge.style.display = 'none';
        heroBtn.style.display = 'none';
```

---

### Passo 2: Guarda de Rota Defensiva em `js/core/navigation.js`

No arquivo [`js/core/navigation.js`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/js/core/navigation.js), dentro da função `navigateToTab(tabName, subFilter = null)`:

```javascript
    function navigateToTab(tabName, subFilter = null) {
      const user = getCurrentUser();

      if (tabName === 'schedule' && (isNucleoEI(user) || user.roleKey === 'pendente' || user.roleKey === 'professora')) {
        showToast('Acesso ao cronograma restrito.');
        return;
      }
      if (tabName === 'history' && (isNucleoEI(user) || user.roleKey === 'pendente')) {
        showToast('Acesso ao histórico restrito: a Coordenadora do Núcleo de EI não realiza observações.');
        return;
      }
      if ((tabName === 'opManagement' || tabName === 'units' || tabName === 'rubricsAdmin' || tabName === 'admin' || tabName === 'team') && (user.roleKey === 'pendente' || user.roleKey === 'professora')) {
        showToast('Acesso restrito ao perfil docente.');
        return;
      }
```

---

### Passo 3: Asserções Estritas na Auditoria em `js/audit/audit_engine.js`

No arquivo [`js/audit/audit_engine.js`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/js/audit/audit_engine.js), dentro do **Módulo 1 (`auth_rbac`)**, logo após o teste de reatividade de `#deskTabHomeLabel` (em torno da linha 344):

```javascript
              // Restaura perfil de Helena (Governança Global) para os testes subsequentes do catálogo
              appState.currentUserKey = 'helena';
              applyUserRoleUI();
              logger.log('Alternância cíclica de perfis e reatividade canônica de #deskTabHomeLabel (Início vs Gestão Pedagógica)', true);

              // 9. Validação de RBAC: Ocultação da aba Histórico para Coordenadora da EI (Helena)
              const deskHistHelena = document.getElementById('deskTabHist');
              const mobHistHelena = document.getElementById('mobMenuHistBtn');
              if (deskHistHelena && deskHistHelena.style.display !== 'none') {
                throw new Error('Aba #deskTabHist deve estar estritamente oculta (display: none) para a Coordenadora da EI');
              }
              if (mobHistHelena && mobHistHelena.style.display !== 'none') {
                throw new Error('Botão #mobMenuHistBtn deve estar estritamente oculto (display: none) para a Coordenadora da EI');
              }

              // Asserção de bloqueio preventivo em navigateToTab('history') para Coordenadora da EI
              navigateToTab('history');
              const histScreenActive = document.getElementById('screenHistory')?.classList.contains('active');
              if (histScreenActive) {
                throw new Error('Coordenadora da EI não deve conseguir acessar #screenHistory via navigateToTab');
              }

              // Teste de restauração e visibilidade da aba Histórico para Coordenação Pedagógica da UE (Mariana)
              appState.currentUserKey = 'mariana';
              applyUserRoleUI();
              if (deskHistHelena && deskHistHelena.style.display === 'none') {
                throw new Error('Aba #deskTabHist deve estar visível para a Coordenação Pedagógica (Mariana)');
              }
              if (mobHistHelena && mobHistHelena.style.display === 'none') {
                throw new Error('Botão #mobMenuHistBtn deve estar visível para a Coordenação Pedagógica (Mariana)');
              }

              // Restaura perfil padrão de Helena para os módulos subsequentes
              appState.currentUserKey = 'helena';
              applyUserRoleUI();
              logger.log('Validação de RBAC: ocultação e bloqueio estrito da aba Histórico para Coordenadora da EI', true);
```

---

### Passo 4: Sincronização Obrigatória com as Cópias Espelhadas

Replicar os arquivos atualizados na estrutura do Firebase:
- `gestor supervisao_patos/js/core/rbac.js` ➔ `gestor supervisao_patos/firebase_deploy/public/js/core/rbac.js`
- `gestor supervisao_patos/js/core/navigation.js` ➔ `gestor supervisao_patos/firebase_deploy/public/js/core/navigation.js`
- `gestor supervisao_patos/js/audit/audit_engine.js` ➔ `gestor supervisao_patos/firebase_deploy/public/js/audit/audit_engine.js`
- `gestor supervisao_patos/index.html` ➔ `gestor supervisao_patos/firebase_deploy/public/index.html`

---

### Passo 5: Atualização Sequencial do Changelog Duplo

1. **Em `index.html` e `firebase_deploy/public/index.html`:**
   - Atualizar rótulo do botão `.btn-changelog`:
     ```html
     <span>Versão 1.59 (v8.2.26)</span>
     ```
   - Inserir card no topo do modal `#modalChangelog`:
     ```html
     <!-- VERSÃO 1.59 - REMOÇÃO DA ABA HISTÓRICO DO PERFIL DA COORDENADORA DE EI -->
     <div style="margin-bottom:20px; border-left:3px solid var(--primary); padding-left:14px;">
       <div style="display:flex; align-items:center; gap:8px;">
         <span style="font-size:14px; font-weight:800; color:var(--primary-dark);">Versão 1.59 · v8.2.26</span>
         <span style="font-size:11px; background:#EFF6FF; color:var(--primary); padding:2px 8px; border-radius:12px; font-weight:700;">29/10/2026</span>
       </div>
       <div style="font-size:12px; color:var(--text-secondary); margin-top:4px;">
         Remoção da Aba "Histórico" do Perfil da Coordenadora de EI (Núcleo de EI):
       </div>
       <ul style="font-size:12px; color:var(--text-primary); margin-top:8px; line-height:1.6; padding-left:16px;">
         <li>🧹 <strong>Higienização Visual e Otimização RBAC:</strong> Ocultação da aba desktop <code>#deskTabHist</code> e do botão mobile <code>#mobMenuHistBtn</code> ("Acessar Histórico") para o perfil da Coordenadora do Núcleo de EI (Helena Martins / <code>nucleo_ei</code>), alinhando a navegação ao fato de que esse perfil de gestão não realiza observações de campo.</li>
         <li>🛡️ <strong>Blindagem no Roteador e Redirecionamento Defensivo:</strong> Bloqueio preventivo na função <code>navigateToTab('history')</code> com aviso contextual em toast e redirecionamento automático para a tela inicial caso o usuário troque de perfil enquanto estiver visualizando o histórico.</li>
         <li>🔄 <strong>Preservação Integral para Coordenação Escolar e Formadoras:</strong> Coordenadoras Pedagógicas de Unidades Escolares (Mariana Ferreira) e Formadoras Regionais (Clarice Barbosa) mantêm acesso total ao histórico, rascunhos e devolutivas finalizadas.</li>
         <li>🔬 <strong>Asserções Automatizadas no Módulo 1 (auth_rbac):</strong> Verificação estrita na suíte de testes garantindo que a aba esteja oculta para Helena, bloqueada na navegação e visível para Mariana.</li>
       </ul>
     </div>
     ```

2. **Em `CHANGELOG.md`:**
   - Adicionar entrada no Sumário Executivo:
     ```markdown
     | **1.59** | 29/10/2026 17:35 | `intermediárias/aplicativo_v1.59_remocao_aba_historico_coord_ei.html` | Solicitação direta / `planos_de_implementacao/plano_remocao_aba_historico_coord_ei.md` | Remoção da aba "Histórico" do perfil da Coordenadora de EI (Núcleo de EI), ocultação desktop (`#deskTabHist`) e mobile (`#mobMenuHistBtn`), guarda de rota defensiva em `navigateToTab`, asserções estritas no Módulo 1 da auditoria e preservação integral do histórico para Coordenação Pedagógica da escola e Formadoras 🧹🛡️🏛️ |
     ```
   - Adicionar seção detalhada correspondente em `Detalhamento Integral das Versões`.

---

## 4. Critérios de Aceite e Roteiro de Teste

### 4.1 Critérios de Aceite
- [ ] **Coordenadora do Núcleo de EI (Helena Martins):**
  - A aba "Histórico" (`#deskTabHist`) **não aparece** na barra de navegação desktop (`style.display === 'none'`).
  - No menu mobile "Mais" (`#mobileMenuOverlay`), o botão "Acessar Histórico" (`#mobMenuHistBtn`) **não aparece** (`style.display === 'none'`).
  - Tentar invocar `navigateToTab('history')` via console ou link não ativa `#screenHistory` e emite toast explicativo.
  - Se Helena fizer login ou alternar para seu perfil enquanto na tela `#screenHistory`, é redirecionada automaticamente para a tela `home`.
- [ ] **Coordenação Pedagógica da Escola (Mariana Ferreira):**
  - A aba "Histórico" (`#deskTabHist`) permanece perfeitamente visível e clicável no desktop.
  - O botão "Acessar Histórico" (`#mobMenuHistBtn`) permanece visível e funcional no menu drawer mobile.
  - Clicar em "Histórico" navega normalmente para `#screenHistory` e renderiza os rascunhos e observações da UE.
- [ ] **Formadora Pedagógica (Clarice Barbosa):**
  - A aba "Histórico" e o botão mobile permanecem visíveis e funcionais.
- [ ] **Integridade Sintática do JavaScript:**
  - `python3 audit_platform.py --check-syntax` valida 100% dos scripts sem erros de léxico/sintaxe via JSC.
- [ ] **Suíte Automatizada Modular:**
  - `python3 audit_platform.py --silent-on-success` aprova 100% dos 12 módulos determinísticos no Chrome headless.

---

## 5. Seção Obrigatória de Auditoria (`audit_platform.py` e Suíte In-App)

### 5.1 Alterações no Algoritmo de Auditoria
- Não são necessárias alterações na infraestrutura CLI do `audit_platform.py`, que continuará orquestrando o Chrome headless na porta local e testando todos os 12 módulos canônicos.

### 5.2 Adições na Suíte de Testes (`js/audit/audit_engine.js`)
- **Módulo 1 (`auth_rbac`):** Adição de bloco de teste garantindo:
  1. `deskTabHist.style.display === 'none'` e `mobMenuHistBtn.style.display === 'none'` para Helena Martins (`nucleo_ei`).
  2. Chamada `navigateToTab('history')` não ativa `#screenHistory` para Helena.
  3. Ao alternar para Mariana Ferreira (`coordenador`), `deskTabHist.style.display !== 'none'` e `mobMenuHistBtn.style.display !== 'none'`.

### 5.3 Exclusões
- Nenhuma exclusão de módulos ou asserções preexistentes. O Módulo 9 (`historico_governanca`) continua rodando sob o perfil de `mariana`, preservando 100% de compatibilidade e cobertura.
