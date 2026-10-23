# REGRAS DO PROJETO E DIRETRIZES DE EXECUÇÃO OBRIGATÓRIAS (ANTIGRAVITY)

Você está atuando no projeto **Gestor Supervisão Patos** (`supervisao-st-crianca`).
Qualquer agente de IA que atue neste repositório **DEVE OBRIGATORIAMENTE** seguir este protocolo sem desvios, sem exceções e sem atalhos.

---

## 1. Cláusulas de Proteção Absoluta (Tolerância Zero a Erros de Processo)

### ⛔ PROIBIÇÃO CATEGÓRICA: NUNCA RODAR OU ABRIR O GOOGLE CHROME INTERATIVO
- **É expressamente proibido** abrir o Google Chrome gráfico (`open -a "Google Chrome"`, abrir abas de navegador na máquina do usuário, usar `/browser` ou acionar subagentes interativos de navegação).
- O assistente **NÃO** deve tentar fazer testes manuais abrindo o navegador.
- O Google Chrome headless é acionado **EXCLUSIVAMENTE** através do script automatizado `python3 audit_platform.py --silent-on-success`, **apenas como etapa final pós-deploy** (`git push origin main`). Qualquer tentativa de invocar Chrome interativo ou fora desse passo é violação direta de protocolo.

### ⛔ SEPARAÇÃO ESTRITA: NUNCA CONFUNDIR OS PROCESSOS (ETAPA 1 vs ETAPA 2)
- **Etapa 1 (Arquiteto / Planejamento Profundo):**
  - **O que faz:** Investigação profunda do código (leitura de arquivos, grep, inspeção analítica) e elaboração do plano detalhado em `./planos_de_implementacao/plano_[nome].md`.
  - **TRAVA CRÍTICA:** Na Etapa 1, é **TERMINANTEMENTE PROIBIDO** modificar código de produção (`index.html`), alterar changelog, criar backups intermediários ou commitar/push. Ao terminar a Etapa 1, a árvore de trabalho do Git (`git status`) deve estar **completamente limpa**, sem modificações pendentes em arquivos de código.
- **Etapa 2 (Operário / Execução Mecânica Fiel):**
  - **O que faz:** Aplicar as modificações **única e exclusivamente** quando o usuário autorizar/solicitar a execução de um plano existente.
  - **TRAVA CRÍTICA:** O assistente executa o plano como verdade absoluta, sem improvisações, sem refatorações não solicitadas e cumprindo todo o checklist operacional até o deploy e a auditoria pós-deploy.

### 🛡️ BLINDAGEM SINTÁTICA PRÉ-VOO OBRIGATÓRIA (JSC / JAVASCRIPTCORE)
- Qualquer erro sintático no JavaScript inline do `index.html` (como chaves órfãs `}` ou variáveis fora de escopo) destrói a interface e bloqueia todos os botões da plataforma.
- **Antes de qualquer commit ou deploy**, o assistente DEVE validar a integridade sintática do script via engine nativa do macOS:
  ```bash
  python3 audit_platform.py --check-syntax
  ```
  *(Ou validando via `/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc`).*
- Se a validação acusar qualquer erro, o commit/push é **bloqueado imediatamente** até que o código esteja sintaticamente perfeito.

---

## 2. Documentos Oficiais e Skills Normativas

Antes de executar qualquer tarefa, consulte os normativos oficiais:
1. **[WORKFLOW_MACOS.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md):** Manual completo do workflow em duas etapas adaptado ao ecossistema macOS.
2. **[WORKFLOW_GITHUB.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_GITHUB.md):** Regras de concorrência e colaboração simultânea no GitHub.
3. **Workspace Skills do Antigravity (`.agents/skills/`):**
   - `.agents/skills/planejamento-arquiteto/SKILL.md`: Guia de elaboração de planos da Etapa 1.
   - `.agents/skills/execucao-operario/SKILL.md`: Checklist de execução fiel da Etapa 2.
   - `.agents/skills/auditoria-plataforma/SKILL.md`: Protocolo de validação sintática e auditoria silenciosa.
   - `.agents/skills/git-colaboracao/SKILL.md`: Protocolo de pull, checagem pré-push e rebase.

---

## 3. Checklist Operacional Obrigatório

### Início de qualquer tarefa:
- [ ] Rodar `git pull origin main` para sincronizar o repositório local com atualizações de outros desenvolvedores.

### Durante a elaboração de planos (Etapa 1 - Arquiteto):
- [ ] Investigar a fundo o código sem aplicar alterações prematuras no `index.html`.
- [ ] Salvar o plano em `./planos_de_implementacao/plano_[nome].md`.
- [ ] Garantir que o plano inclua a seção obrigatória: **Alterações / Adições / Exclusões no Algoritmo de Auditoria (`audit_platform.py`)**.
- [ ] Deixar a árvore de trabalho do git limpa (não comitar alterações no código durante o planejamento).

### Durante a execução (Etapa 2 - Operário):
- [ ] Seguir estritamente o plano de implementação aprovado.
- [ ] Aplicar dupla checagem: reler os arquivos alterados após modificação.
- [ ] **Validar a sintaxe do JavaScript:** executar `python3 audit_platform.py --check-syntax` e confirmar 100% de sucesso léxico/sintático.
- [ ] Manter integridade absoluta dos dados e regras de negócio de apoio à decisão pedagógica.
- [ ] Salvar backup em `intermediárias/aplicativo_v[N]_[descrição].html`.
- [ ] Atualizar o Changelog duplo: versão sequencial no `CHANGELOG.md` e no `#modalChangelog` / botão `.btn-changelog` de `index.html`.
- [ ] Sincronizar simultaneamente as cópias espelhadas do projeto:
  - `gestor supervisao_patos/index.html`
  - `gestor supervisao_patos/firebase_deploy/public/index.html`

### Ao finalizar a tarefa e efetuar o Deploy:
- [ ] **Checagem de Concorrência Pré-Push:** Executar `git fetch origin main` e verificar se há novos commits remotos (`git log HEAD..origin/main --oneline`).
- [ ] Se houver commits novos do colega, integrar com `git pull --rebase origin main`.
- [ ] Criar commit com mensagem semântica clara (`feat:`, `fix:`, `docs:`, etc.).
- [ ] Enviar as alterações com `git push origin main` (deploy automático no GitHub Pages: `https://silvabrun0.github.io/supervisao-st-crianca/`).

### Imediatamente após o deploy (Pós-Deploy Obrigatório):
- [ ] **Rodar a Auditoria Modular:** Executar `python3 audit_platform.py --silent-on-success`.
- [ ] **Comunicação Restrita a Problemas:**
  - Se houver falha: relatar pontualmente o módulo e teste reprovado para resolução imediata.
  - Se 100% aprovada: confirmar a conclusão com sucesso de forma limpa e sucinta, sem poluir o chat com saídas desnecessárias.
