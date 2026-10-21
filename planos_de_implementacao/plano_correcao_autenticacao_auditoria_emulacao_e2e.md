# PLANO DE IMPLEMENTAÇÃO EXECUTIVO (ETAPA 1)
## Correção da Autenticação na Auditoria Interativa, Blindagem contra Falsos Positivos e Fortalecimento da Emulação E2E

---

### 1. Diagnóstico do Problema e Causa Raiz
* **Erro reportado pelo usuário:**
  `[Log] ❌ FAIL | [auth_rbac] Erro de execução no módulo auth_rbac -> Falha na autenticação via formulário de login para Mariana (supervisao-st-crianca, line 17575)`
* **Causa Raiz Identificada:**
  1. No módulo de teste `auth_rbac` em `index.html`, o formulário de login simulado digitava `'mariana@patos.pb.gov.br'`.
  2. No entanto, no catálogo de autenticação `USERS_DB`, o e-mail cadastrado de Mariana é `'mariana@teste.com'`.
  3. A função de login `handleLoginSubmit()` pesquisava o e-mail no `USERS_DB`, não o encontrava e rejeitava o acesso exibindo o `#loginError`.
  4. No navegador real do usuário, onde a sessão já estava ativa com outro perfil (ex.: Bruno Silva ou deslogado), o `appState.currentUserKey` permaneceu diferente de `'mariana'`, disparando a exceção do teste.
  5. No ambiente headless limpo, o teste passava anteriormente por um **falso positivo**, pois o `appState` é inicializado por padrão com `currentUserKey: 'mariana'`. Como a falha no formulário não alterava a chave de usuário, o teste checava se `appState.currentUserKey !== 'mariana'`, encontrando falsamente o valor esperado sem que a autenticação tivesse realmente ocorrido.

---

### 2. Análise da Capacidade de Emulação da Plataforma
* **O que o algoritmo emula com perfeição:**
  - Renderização real em motor Google Chrome (V8 + DOM + LocalStorage).
  - Simulação de eventos de teclado e mouse (`input`, `change`, `click`, `submit`).
  - Reatividade e retenção de seletores `<select>` e formulários modais.
  - Validação de regras de negócio complexas, cálculos de indicadores, deltas comparativos $\Delta$, progressão longitudinal de bimestres e travas RBAC.
* **O que o algoritmo ainda não emula (e limitações estruturais):**
  - **Física de cliques e coordenadas:** O `dispatchEvent` aciona o manipulador JavaScript diretamente sem testar obstrução visual de layout (ex.: elementos com `opacity: 0`, `pointer-events: none` ou sobrepostos por modais z-index fantasmas).
  - **Ciclo completo de digitação:** Disparo simplificado de `input` e `change`, sem eventos de `keydown`, `keypress`, `keyup` e `blur`.
  - **Isolamento de sessão:** O estado global compartilhado pode gerar acoplamento entre testes se o estado de autenticação anterior não for resetado explicitamente.
  - **Interação integral em rubricas:** O preenchimento das 46 rubricas da observação e pareceres utiliza atribuição direta ao invés de 46 cliques individuais na interface.

---

### 3. Ações de Correção e Reforço
1. **Resolução Canônica de Credenciais:**
   - Obter o e-mail de Mariana diretamente de `USERS_DB['mariana'].email` (`'mariana@teste.com'`).
2. **Blindagem contra Falsos Positivos:**
   - Antes de submeter o formulário de login, resetar explicitamente `appState.currentUserKey = null;`.
   - Garantir que a rejeição de credenciais incorretas mantém `appState.currentUserKey === null` e exibe `#loginError`.
   - Garantir que o login com credenciais canônicas altera com sucesso `appState.currentUserKey` para `'mariana'` e oculta `#loginError`.
3. **Reforço do Helper `UI`:**
   - Incluir foco explícito (`el.focus()`) antes de digitações e seleções para acionar manipuladores de foco.
4. **Sincronização de Arquivos e Deploy:**
   - Criar arquivo intermediário em `intermediárias/aplicativo_v102_correcao_autenticacao_auditoria_emulacao_e2e.html`.
   - Atualizar changelog duplo (`CHANGELOG.md` e `#modalChangelog`).
   - Sincronizar `firebase_deploy/public/index.html`.
   - Realizar commit semântico e deploy no GitHub Pages.

---

### 4. Seção Obrigatória de Auditoria: Alterações no Algoritmo de Testes
Em estrito cumprimento às diretrizes de `AGENTS.md` e `WORKFLOW_MACOS.md`, detalham-se as alterações na suíte de testes:

#### Módulo 1: `auth_rbac` (Autenticação, Usuários, Perfis e RBAC)
* **Alterações:**
  - Substituição da string hardcoded `'mariana@patos.pb.gov.br'` pela consulta canônica `USERS_DB['mariana'].email`.
  - Inserção de reset preventivo de sessão: `appState.currentUserKey = null;` antes da submissão do login.
  - Inclusão de asserção para confirmar que `#loginError` está oculto após o login bem-sucedido.
* **Adições:**
  - Validação de que a tentativa de login incorreto não altera o `currentUserKey` (mantém `null`).
* **Exclusões:**
  - Remoção de qualquer pressuposto de que o usuário logado padrão seja preservado durante o teste de formulário.

#### Módulo 10: `indicadores_decisao` (Indicadores Pedagógicos, Cobertura e Gargalos)
* **Consolidação:**
  - Garantir que a execução isolada (`--module indicadores_decisao`) possua mock mínimo de observações caso `appState.observations` esteja vazio, assegurando independência de execução modo-a-modo.
