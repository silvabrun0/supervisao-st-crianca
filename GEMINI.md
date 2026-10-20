# REGRAS DO PROJETO E DIRETRIZES DE EXECUÇÃO OBRIGATÓRIAS

Você está atuando no projeto **Gestor Supervisão Patos** (`supervisao-st-crianca`).
Qualquer agente de IA que atue neste repositório **DEVE OBRIGATORIAMENTE** seguir os fluxos documentados antes de planejar, codificar ou enviar código.

---

## 1. Documentos Oficiais Obrigatórios
Antes de executar qualquer tarefa, consulte os arquivos normativos:
1. **[WORKFLOW_MACOS.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md):** 
   - Define o modelo em duas etapas: **Etapa 1 (Arquiteto / Planejamento Profundo em `./planos_de_implementacao/`)** e **Etapa 2 (Operário / Execução Fiel e Direta)**.
   - Define a diretriz de **Dados e Indicadores para Tomada de Decisão** (com foco na aba de Indicadores).
   - Define a obrigatoriedade da **Gestão Dupla do Changelog** (`CHANGELOG.md` e modal `#modalChangelog` no `index.html`).
2. **[WORKFLOW_GITHUB.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_GITHUB.md):**
   - Define o fluxo colaborativo no GitHub e sincronização entre múltiplos desenvolvedores.

---

## 2. Protocolo de Ação do Agente (Checklist Obrigatório)

### Início de qualquer tarefa:
- [ ] Rodar `git pull origin main` para puxar eventuais atualizações feitas por outros desenvolvedores.

### Durante a execução:
- [ ] Seguir estritamente o plano de implementação ou requisitos da tarefa.
- [ ] Aplicar dupla checagem (reler arquivos alterados após modificação).
- [ ] Manter integridade dos dados e regras de negócio de apoio à decisão pedagógica.
- [ ] Atualizar o Changelog duplo (versão `0.n` no `CHANGELOG.md` e no `#modalChangelog` do `index.html`).

### Ao finalizar a tarefa:
- [ ] **Checagem de Concorrência Pré-Push:** Executar `git fetch origin main` e verificar se há novos commits no remoto (`git log HEAD..origin/main --oneline`).
- [ ] Se houver commits novos do colega, integrar com `git pull --rebase origin main`.
- [ ] Criar commit com mensagem semântica clara (`feat:`, `fix:`, `docs:`, etc.).
- [ ] Enviar as alterações com `git push origin main`.
- [ ] O deploy de produção é realizado automaticamente via **GitHub Pages** (ao efetuar o `git push origin main` com o arquivo raiz `index.html`). O hosting oficial do projeto é: `https://silvabrun0.github.io/supervisao-st-crianca/`.
