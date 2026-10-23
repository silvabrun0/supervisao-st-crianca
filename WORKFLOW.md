# WORKFLOW PADRÃO DO PROJETO (ANTIGRAVITY)

Este documento define as diretrizes obrigatórias de desenvolvimento e entrega para este projeto, devendo ser seguido em qualquer sessão ou chat.

---

## 1. Dados do Projeto e URLs Oficiais
- **Repositório GitHub:** [https://github.com/silvabrun0/supervisao-st-crianca](https://github.com/silvabrun0/supervisao-st-crianca)
- **Hosting URL Oficial (GitHub Pages):** [https://silvabrun0.github.io/supervisao-st-crianca/](https://silvabrun0.github.io/supervisao-st-crianca/)
- **Deploy Automático:** O deploy de produção é acionado automaticamente a cada `git push origin main`, servindo o arquivo `index.html` da raiz.

---

## 2. Cláusulas de Proteção Absoluta

### ⛔ Proibição do Google Chrome Interativo
- Proibido abrir o Google Chrome de forma visual/gráfica (`open -a "Google Chrome"`, subagentes de browser ou `/browser`).
- O Chrome é acionado exclusivamente de forma headless pelo script automatizado `python3 audit_platform.py --silent-on-success` após o deploy.

### 🛡️ Blindagem Sintática Pré-Voo
- Antes de qualquer commit ou deploy, é obrigatório validar a integridade sintática dos scripts de `index.html`:
  ```bash
  python3 audit_platform.py --check-syntax
  ```
- Nenhum código com erro de parsing léxico ou chave duplicada deve ser comitado.

---

## 3. Estrutura do Workflow em Duas Etapas (Modelo Assimétrico)

**A Racionalidade do Modelo:**
Este workflow baseia-se na assimetria de capacidade de processamento. A **Etapa 1 (Planejamento)** pressupõe o uso de alta capacidade cognitiva, grande janela de contexto e raciocínio profundo para investigar o código, debugar e prever impactos. A **Etapa 2 (Execução)** pressupõe um modelo de capacidade reduzida ou operação restrita, que não deve gastar tokens ou tempo "pensando" na arquitetura, mas sim atuar como um "operário mecânico" que apenas lê as instruções e aplica no arquivo final.

O plano gerado na Etapa 1 deve ser tão exato e à prova de falhas que a Etapa 2 possa ser executada mecanicamente e com segurança.

### Etapa 1: Planejamento Profundo e Sistematização (Alta Capacidade / "O Arquiteto")
- O usuário apresenta as necessidades, novos requisitos, regras de negócio ou ajustes de layout/UX.
- O assistente **NÃO** aplica mudanças no código imediatamente.
- **Princípio Central:** O assistente deve utilizar sua máxima capacidade analítica (vasculhar o código via comandos de terminal, grep, ler arquivos) para dissecar o problema.
- **TRAVA RIGOROSA:** Na Etapa 1, o assistente **NUNCA modifica código de produção**, nunca altera `index.html`, nunca salva em `intermediárias/` e nunca commita ou dá push. A árvore de trabalho (`git status`) deve permanecer intacta.
- **Lógica de Decisão em Indicadores:** Ao planejar qualquer alteração ou novo recurso (especialmente na aba de indicadores), conceber a solução estritamente sob a ótica de que dados e indicadores são ferramentas de apoio à tomada de decisão da gestão e equipe pedagógica.
- O documento final deve conter código "mastigado", identificando não apenas "o que" mudar, mas as linhas, o arquivo e o bloco exato de substituição.
- **O Plano deve conter:**
  0. **Diretriz de Execução (Obrigatório):** O plano deve *obrigatoriamente* iniciar com uma instrução explícita ao assistente executor (Etapa 2), mandando-o **ler e seguir as diretrizes deste `WORKFLOW.md` e a skill `execucao-operario`** antes de começar a aplicar as mudanças.
  1. **Diagnóstico e Contexto:** Cenário atual vs. resultado esperado.
  2. **Arquitetura e Pontos de Impacto:** Mapeamento exato de quais funções JS, variáveis e blocos HTML serão afetados.
  3. **Especificação de Implementação Passo a Passo (Obrigatório):** Snippets **exatos** de código de substituição, nomes exatos de IDs e lógicas condicionais detalhadas. Nada deve ser deixado para a imaginação do executor.
  4. **Critérios de Aceite e Roteiro de Teste/Validação:** Lista explícita de checagem.
  5. **Seção Obrigatória: Alterações / Adições / Exclusões no Algoritmo de Auditoria (Mandatório):**
     Ao término do documento, o assistente DEVE listar expressamente as alterações, inclusões e exclusões necessárias no algoritmo de auditoria (`audit_platform.py` e rotinas modulares de `index.html`), projetado em módulos ("modo-a-modo"), garantindo que 100% da plataforma esteja permanentemente sob auditoria automatizada.
- Salvar o documento em:
  `./planos_de_implementacao/plano_[nome_da_feature_ou_data].md`

### Etapa 2: Execução Direta e Fiel ao Plano (Baixa Capacidade / "O Operário")
- Em uma nova sessão/chat (ou utilizando um agente mais rápido/simples), o usuário solicita a execução referenciando o plano correspondente.
- O assistente assume o plano como verdade absoluta e parte diretamente para a modificação dos arquivos, sem hesitação, sem tentar refatorar ou repensar o código.
- Inicia com `git pull origin main`.
- Aplica as alterações no código de produção (`index.html` da raiz).
- **Garantia de Efetividade (Dupla Checagem):** Releitura obrigatória da porção do arquivo alterada para certificar-se de que a mudança está efetivamente salva.
- **Validação Sintática Pré-Voo:** Executar `python3 audit_platform.py --check-syntax`.
- **Sincronização de Cópias Espelhadas:** Sincronizar simultaneamente as cópias `gestor supervisao_patos/index.html` e `gestor supervisao_patos/firebase_deploy/public/index.html`.
- **Backup Intermediário:** Salvar cópia do arquivo resultante na pasta `intermediárias/` (ex: `intermediárias/aplicativo_v[N]_[descricao].html`).
- **Gestão Dupla do Changelog (Texto e Site):**
  1. **Changelog em Texto (`CHANGELOG.md`):** Nova linha na tabela e seção detalhada da versão `0.n` com inclusões, modificações e exclusões.
  2. **Log Interno do Site (Modal `#modalChangelog` em `index.html`):** Atualizar texto do botão de versão (`.btn-changelog`) e inserir o novo bloco de versão no topo do modal.
- **Checagem de Concorrência Pré-Push no GitHub:**
  1. `git fetch origin main`
  2. `git log HEAD..origin/main --oneline` (se houver novidade, rodar `git pull --rebase origin main`).
  3. `git add .`, commit semântico e `git push origin main`.
- **Execução do Algoritmo de Auditoria Modular Pós-Deploy:**
  Imediatamente após o deploy, rodar:
  ```bash
  python3 audit_platform.py --silent-on-success
  ```
- **Comunicação Exclusiva de Problemas:**
  O assistente deve **informar SOMENTE se houveram problemas/falhas**:
  - Em falhas: listar as baterias/módulos reprovados e detalhes do erro para que o usuário determine a resolução pelo engenheiro.
  - Em 100% de sucesso: informar objetivamente o sucesso do deploy e da auditoria, sem poluir a resposta.

---

## 4. Diretriz Fundamental: Dados e Indicadores como Apoio à Tomada de Decisão

O assistente deve **sempre trabalhar na lógica de dados e indicadores como apoiadores para a tomada de decisão**, com foco e atenção redobrada na **aba de Indicadores**:
- **Finalidade Decisória:** Toda informação apresentada deve responder a uma pergunta prática de gestão ou acompanhamento pedagógico.
- **Diagnóstico e Clareza:** Permitir identificação ágil de gargalos, padrões, evoluções e pontos de intervenção prioritária.
- **Instrumentalização dos Usuários:** Capacitar gestores, formadores e equipe técnica a tomar decisões embasadas, rápidas e orientadas a resultados concretos.
