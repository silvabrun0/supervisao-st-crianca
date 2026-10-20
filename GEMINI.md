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
   - Define a obrigatoriedade da **Seção de Auditoria em Planos** e **Execução Pós-Deploy com Comunicação Exclusiva de Problemas**.
2. **[WORKFLOW_GITHUB.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_GITHUB.md):**
   - Define o fluxo colaborativo no GitHub e sincronização entre múltiplos desenvolvedores.

---

## 2. Protocolo de Ação do Agente (Checklist Obrigatório)

### Início de qualquer tarefa:
- [ ] Rodar `git pull origin main` para puxar eventuais atualizações feitas por outros desenvolvedores.

### Durante a elaboração de planos (Etapa 1 - Arquiteto):
- [ ] Investigar a fundo o código sem aplicar alterações precipitadas.
- [ ] Salvar o plano em `./planos_de_implementacao/plano_[nome].md`.
- [ ] **Seção Obrigatória de Auditoria:** Incluir OBRIGATORIAMENTE ao final do plano uma seção com as **alterações, adições e exclusões** a serem realizadas no algoritmo de auditoria (`audit_platform.py` e engine de testes do `index.html`), estruturado em módulos ("modo-a-modo"), garantindo cobertura efetiva de 100% da plataforma com as alterações propostas.

### Durante a execução (Etapa 2 - Operário):
- [ ] Seguir estritamente o plano de implementação ou requisitos da tarefa.
- [ ] Aplicar dupla checagem (reler arquivos alterados após modificação).
- [ ] Salvar cópia em `intermediárias/aplicativo_v[N]_[descrição].html`.
- [ ] Manter integridade dos dados e regras de negócio de apoio à decisão pedagógica.
- [ ] Atualizar o Changelog duplo (versão `0.n` no `CHANGELOG.md` e no `#modalChangelog` do `index.html`).
- [ ] Manter sincronizadas as cópias espelhadas do projeto (`gestor supervisao_patos/index.html` e `gestor supervisao_patos/firebase_deploy/public/index.html`).

### Ao finalizar a tarefa e efetuar o Deploy:
- [ ] **Checagem de Concorrência Pré-Push:** Executar `git fetch origin main` e verificar se há novos commits no remoto (`git log HEAD..origin/main --oneline`).
- [ ] Se houver commits novos do colega, integrar com `git pull --rebase origin main`.
- [ ] Criar commit com mensagem semântica clara (`feat:`, `fix:`, `docs:`, etc.).
- [ ] Enviar as alterações com `git push origin main`. O deploy de produção é realizado automaticamente via **GitHub Pages**: `https://silvabrun0.github.io/supervisao-st-crianca/`.

### Imediatamente após o deploy (Pós-Deploy Obrigatório):
- [ ] **Rodar o Algoritmo de Auditoria:** Executar `python3 audit_platform.py --silent-on-success` (ou `python3 audit_platform.py`).
- [ ] **Comunicação Restrita a Problemas:** O assistente deve **informar SOMENTE se houveram problemas/falhas**.
  - Se houverem falhas: reportar os erros pontualmente para que o usuário determine que sejam solucionados pelo engenheiro.
  - Se a auditoria for 100% aprovada: confirmar a conclusão com sucesso de forma limpa e sucinta, sem despejar saídas desnecessárias.
