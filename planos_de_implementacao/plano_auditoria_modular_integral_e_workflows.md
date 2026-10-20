# PLANO DE IMPLEMENTAÇÃO: ARQUITETURA MODULAR DE AUDITORIA INTEGRAL E ATUALIZAÇÃO DOS WORKFLOWS

> **DIRETRIZ OBRIGATÓRIA DE EXECUÇÃO (ETAPA 1 & ETAPA 2 - WORKFLOW_MACOS.md / AGENTS.md):**
> 1. O assistente executor (Etapa 2) DEVE obrigatoriamente ler e seguir as diretrizes deste plano e do `WORKFLOW_MACOS.md` antes de aplicar qualquer alteração.
> 2. Sincronização prévia obrigatória (`git pull origin main`).
> 3. Reformulação da suíte de auditoria (`index.html`) e do motor CLI (`audit_platform.py`) em **12 Módulos Independentes e Integrados (Execução Modo-a-Modo)**, cobrindo 100% das áreas do sistema.
> 4. Atualização das normas e regras mestras do repositório (`WORKFLOW_MACOS.md`, `WORKFLOW.md`, `AGENTS.md`, `GEMINI.md`, `.agents/rules/workflow.md`), instituindo a obrigatoriedade da seção final sobre auditoria em planos e a execução silenciosa pós-deploy na Etapa 2.
> 5. Salvamento obrigatório de backup intermediário: `intermediárias/aplicativo_v87_auditoria_modular_integral_e_workflows.html`.
> 6. Gestão dupla de Changelog no arquivo `CHANGELOG.md` e no modal `#modalChangelog` do `index.html`, atualizando para a **Versão 0.87 (v7.66)**.
> 7. Sincronização idêntica entre `index.html` da raiz, `gestor supervisao_patos/index.html` e `gestor supervisao_patos/firebase_deploy/public/index.html`.
> 8. Checagem pré-push (`git fetch origin main`), commit semântico (`feat: arquitetura modular de auditoria integral e atualizacao dos workflows`), push para `origin main` e deploy automático via **GitHub Pages**.
> 9. Execução pós-deploy do algoritmo de auditoria (`python3 audit_platform.py --silent-on-success`), reportando ao usuário **somente se houverem problemas**.

---

## 1. Diagnóstico e Contexto

### 1.1 Cenário Atual
A plataforma contava com uma suíte preliminar de 10 baterias de verificação determinísticas agregadas em uma única função corrida (`window.runFullPlatformAudit`). O script `audit_platform.py` executava um teste cego ponta a ponta sem granularidade modular, sem possibilidade de rodar subsistemas específicos de forma isolada ("modo-a-modo") e sem modos de saída silenciosa para integração ao ciclo pós-deploy da Etapa 2.

Além disso, os documentos de workflow (`WORKFLOW_MACOS.md`, `AGENTS.md`, `GEMINI.md`, `.agents/rules/workflow.md`) não continham a formalização da exigência de atualização contínua do algoritmo de auditoria a cada novo plano criado (Etapa 1), nem o protocolo estrito de execução do algoritmo pós-deploy reportando apenas ocorrências de problemas (Etapa 2).

### 1.2 Resultado Esperado
1. **Auditoria Modular Modo-a-Modo (12 Módulos):**
   - Permitir a execução granular de qualquer módulo individual (`--module <modulo>`) ou de todos em cadeia sequencial (`--module all`).
   - Cobertura de 100% da plataforma, incluindo autenticação/RBAC, catálogos canônicos, setup longitudinal por turma (Pilar 1), rubricas e pendências, síntese e dimensão material, travas de duplo lançamento, fluxo da formadora, agenda/próxima visita, histórico/governança, indicadores pedagógicos de apoio à decisão, backup/exportação JSON e layout/navegação/changelog.
2. **Atualização Normativa dos Workflows e Regras:**
   - Inclusão da regra mandatória para a **Etapa 1**: todo plano de implementação deve conter, ao final, a seção explícita de alterações/adições/exclusões no algoritmo de auditoria.
   - Inclusão da regra mandatória para a **Etapa 2**: após o deploy no GitHub Pages, o assistente roda o algoritmo e informa **somente se houveram problemas**.
   - Atualização de todos os arquivos de governança do projeto.

---

## 2. Arquitetura e Módulos da Suíte de Auditoria (100% de Cobertura)

A suíte passa a ser decomposta em 12 módulos canônicos:

| ID do Módulo | Nome / Escopo | Áreas e Funções Cobertas no Código |
| :--- | :--- | :--- |
| `auth_rbac` | Autenticação, Usuários e RBAC | `USERS_DB`, `getCurrentUser()`, `switchUserRole()`, `applyUserRoleUI()`, isolamento de papéis |
| `catalogo_dados` | Catálogo Canônico e Estado Global | `INITIAL_CLASSES`, `INITIAL_UNITS`, `INITIAL_TEAM`, `getClassesForSchool`, `saveState()`, `appState` |
| `setup_longitudinal` | Setup de Observação e Pilar 1 | `openSetupScreen()`, seleção de turma, duplas de docentes, `getNextEligibleBimesterForClass` |
| `rubricas_observacao` | Observação Ativa e Rubricas | `startNewObservation()`, `getActiveSections()`, rubricas por critério, `getObservationPendencies()` |
| `sintese_finalizacao` | Síntese e Finalização | Dimensão material (1 a 4), organização predominante, `finalizeObservation()`, duração temporal |
| `travas_seguranca` | Travas e Integridade Longitudinal | Bloqueio de duplicidade turma/bimestre, avanço longitudinal sequencial, prevenção de autoavaliação |
| `formadora_coordenacao` | Fluxo da Formadora | Isolamento de turmas na formadora, Matriz da Coordenação, devolutiva para coordenadora |
| `agenda_cronograma` | Cronograma e Próxima Visita | Inclusão de agendamento, destaque da próxima visita agendada, baixa automática para `realizado` |
| `historico_governanca` | Histórico e Filtros | `renderHistoryScreen()`, filtros por escola, turma, bimestre, espelho e exclusão segura |
| `indicadores_decisao` | Indicadores de Apoio à Decisão | `renderIndicatorsScreen()`, taxa de consistência, KPI Cobertura de Turmas (Pilar 1), segmented tabs |
| `backup_exportacao` | Backup, Exportação e Relatórios | Exportação e restauração de backup JSON (`appState`), resiliência de parsing, espelho de impressão |
| `navegacao_layout` | Navegação, Mobile e Changelog | `navigateToTab()`, menu mobile overlay, modal de Changelog (`#modalChangelog`), botão `.btn-changelog` |

---

## 3. Especificação Passo a Passo de Implementação

### 3.1 Atualização de `audit_platform.py`
- Adicionar parsing robusto de argumentos via `argparse`:
  - `--module` (`-m`): Módulo a executar (`all` ou qualquer um dos 12 IDs).
  - `--list-modules` (`-l`): Lista todos os módulos disponíveis com resumo do escopo e finaliza.
  - `--silent-on-success` (`-s`): Se aprovado 100%, emite apenas mensagem sucinta ou silêncio (exit 0). Em falhas, emite relatório detalhado e encerra com exit 1.
  - `--port` (`-p`): Porta HTTP local (padrão 8089).
  - `--timeout`: Tempo limite para recepção do relatório (padrão 25s).
- Encaminhar parâmetro na URL para o Chrome Headless:
  `http://127.0.0.1:{PORT}/index.html?autoAudit=1&module={target_module}`
- Formatação clara por módulo ("modo-a-modo") na saída do terminal.

### 3.2 Atualização da Engine de Testes em `index.html`
- Em `window.runFullPlatformAudit(options)`:
  - Obter `targetModule = options.module || 'all'`.
  - Estruturar os testes dentro de um mapa ou lista de executores modulares: `AUDIT_MODULES = [ ... ]`.
  - Executar os módulos selecionados preservando o estado via `stateBackup` e restaurando com `saveState()` e `applyUserRoleUI()`.
  - Retornar o relatório estruturado contendo a lista de módulos executados, asserções de cada um, tempo e resumo.
  - Enviar POST para `/__test_report__` quando acionado por `autoAudit=1`.

### 3.3 Atualização dos Documentos de Governança e Regras
- Atualizar:
  - `AGENTS.md`
  - `GEMINI.md`
  - `.agents/rules/workflow.md`
  - `WORKFLOW_MACOS.md` (raiz e subpastas)
  - `WORKFLOW.md` (raiz e subpastas)
- Incluir as duas novas regras canônicas:
  1. **Seção Obrigatória de Auditoria na Etapa 1:**
     Todo plano de implementação deve conter a seção de alterações/adições/exclusões para o algoritmo de auditoria.
  2. **Execução Silenciosa Pós-Deploy na Etapa 2:**
     Após o deploy (`git push origin main`), o executor roda `python3 audit_platform.py --silent-on-success` e reporta SOMENTE se houveram problemas.

### 3.4 Sincronização, Changelog e Deploy
- Incrementar versão oficial para **0.87 (v7.66)** no topo de `index.html`, no botão `.btn-changelog` e no modal `#modalChangelog`.
- Adicionar entrada detalhada na tabela e no corpo de `CHANGELOG.md`.
- Salvar cópia fiel em `intermediárias/aplicativo_v87_auditoria_modular_integral_e_workflows.html`.
- Sincronizar cópias em `gestor supervisao_patos/index.html` e `gestor supervisao_patos/firebase_deploy/public/index.html`.
- Executar pré-push, commit, push e validação pós-deploy.

---

## 4. Critérios de Aceite e Roteiro de Teste/Validação

1. `python3 audit_platform.py --list-modules` deve listar os 12 módulos cadastrados com suas descrições.
2. `python3 audit_platform.py --module auth_rbac` deve executar exclusivamente o módulo de autenticação e RBAC com 100% de sucesso.
3. `python3 audit_platform.py` (ou `--module all`) deve executar todos os 12 módulos modo-a-modo, testando integralmente os subsistemas da plataforma com taxa de aprovação de 100%.
4. `python3 audit_platform.py --silent-on-success` deve retornar código 0 com saída limpa quando não houver falhas.
5. Os arquivos `AGENTS.md`, `GEMINI.md`, `.agents/rules/workflow.md`, `WORKFLOW_MACOS.md` e `WORKFLOW.md` devem conter as novas diretrizes formalizadas.
6. O deploy deve estar ativo no GitHub Pages.

---

## Seção Obrigatória: Alterações / Adições / Exclusões no Algoritmo de Auditoria

A fim de que o algoritmo de auditoria passe a abranger 100% da plataforma de forma modular e contemple todas as modificações já realizadas, as seguintes alterações, adições e exclusões foram definidas:

### 1. Adições no Algoritmo de Auditoria:
- **Módulo 11 (`backup_exportacao`):** Adicionada validação determinística de exportação do estado global (`appState`) serializável em JSON, integridade dos esquemas de dados e visualização do espelho para impressão de relatórios.
- **Módulo 12 (`navegacao_layout`):** Adicionada validação de roteamento entre todas as abas do sistema via `navigateToTab()`, acionamento e fechamento do overlay móvel "Mais Opções" (`#mobileMenuOverlay`), abertura e integridade das badges do `#modalChangelog` e proteção contra `null-reference` em nós de texto do DOM.
- **Suporte a Parâmetros de Linha de Comando no CLI (`audit_platform.py`):**
  - `--module / -m`: Permite execução isolada de qualquer um dos 12 módulos.
  - `--list-modules / -l`: Exibição do catálogo de módulos e escopo de cada um.
  - `--silent-on-success / -s`: Execução focada na Etapa 2 pós-deploy, silenciando saídas verbosas em caso de sucesso e destacando erros apenas se houverem falhas.

### 2. Modificações no Algoritmo de Auditoria:
- **Refatoração Estrutural de Monolítico para Modular:** A rotina monolítica de testes em `index.html` foi reorganizada em uma matriz de módulos autônomos (`AUDIT_MODULES`), permitindo execução seletiva ou em cadeia.
- **Parametrização via URL Search Params:** Inclusão do parâmetro `&module=` na URL consumida pelo Chrome Headless (`http://127.0.0.1:{PORT}/index.html?autoAudit=1&module=...`), desacoplando a orquestração do navegador.
- **Estrutura de Retorno JSON (`/__test_report__`):** O objeto retornado agora agrupa resultados por módulo (`modules: [ { id, name, passed, failed, results: [...] } ]`), além dos totais globais (`total`, `passed`, `failed`, `durationMs`, `success`).

### 3. Exclusões no Algoritmo de Auditoria:
- **Exclusão de Execuções Rígidas Não Parametrizadas:** Eliminada a execução acoplada que impedia a verificação de áreas pontuais durante manutenções específicas de subsistemas.
- **Exclusão de Dependência de Índices Rígidos de Elementos DOM:** Eliminadas asserções frágeis que dependiam de posições ordinais de nós no cabeçalho ou nas abas, substituindo-as por verificações canônicas de ID e classes utilitárias.
