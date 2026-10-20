# WORKFLOW PADRÃO DO PROJETO (ANTIGRAVITY)

Este documento define as diretrizes obrigatórias de desenvolvimento e entrega para este projeto, devendo ser seguido em qualquer sessão ou chat.

---

## 1. Dados do Projeto e URLs Oficiais
- **Repositório GitHub:** [https://github.com/silvabrun0/supervisao-st-crianca](https://github.com/silvabrun0/supervisao-st-crianca)
- **Hosting URL Oficial (GitHub Pages):** [https://silvabrun0.github.io/supervisao-st-crianca/](https://silvabrun0.github.io/supervisao-st-crianca/)
- **Deploy Automático:** O deploy de produção é acionado automaticamente a cada `git push origin main`, servindo o arquivo `index.html` da raiz.

---

## 2. Estrutura do Workflow em Duas Etapas (Modelo Assimétrico)

**A Racionalidade do Modelo:**
Este workflow baseia-se na assimetria de capacidade de processamento. A **Etapa 1 (Planejamento)** pressupõe o uso de alta capacidade cognitiva, grande janela de contexto e raciocínio profundo para investigar o código, debugar e prever impactos. A **Etapa 2 (Execução)** pressupõe um modelo de capacidade reduzida ou operação restrita, que não deve gastar tokens ou tempo "pensando" na arquitetura, mas sim atuar como um "operário mecânico" que apenas lê as instruções e aplica no arquivo final. 

Portanto, o plano de implementação gerado na Etapa 1 deve ser tão exato e à prova de falhas que a Etapa 2 possa ser executada quase de "olhos fechados".

### Etapa 1: Planejamento Profundo e Sistematização (Alta Capacidade / "O Arquiteto")
- O usuário apresenta as necessidades, novos requisitos, regras de negócio ou ajustes de layout/UX.
- O assistente **NÃO** aplica mudanças no código imediatamente.
- **Princípio Central:** O assistente deve utilizar sua máxima capacidade analítica (vasculhar o código via comandos de terminal, grep, ler arquivos) para dissecar o problema.
- **Lógica de Decisão em Indicadores:** Ao planejar qualquer alteração ou novo recurso (especialmente na aba de indicadores), conceber a solução estritamente sob a ótica de que dados e indicadores são ferramentas de apoio à tomada de decisão da gestão e equipe pedagógica.
- O documento final deve conter código "mastigado", identificando não apenas "o que" mudar, mas as linhas, o arquivo e o bloco exato de substituição.
- **O Plano deve conter:**
  0. **Diretriz de Execução (Obrigatório):** O plano deve *obrigatoriamente* iniciar com uma instrução explícita ao assistente que irá executá-lo (Etapa 2), mandando ele **ler e seguir as diretrizes deste `WORKFLOW.md` (ou `WORKFLOW_MACOS.md`)** antes de começar a aplicar as mudanças.
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
- Aplica as alterações no código de produção (`index.html` da raiz).
- **Obrigatório - Garantia de Efetividade (Dupla Checagem):** É estritamente proibido reportar que "as alterações foram feitas" sem de fato validar. Após disparar a substituição de código, o assistente DEVE reler a porção do arquivo alterada para se certificar de que a mudança está efetivamente salva.
- **Obrigatório - Sincronização de Cópias Espelhadas:** Sincronizar simultaneamente as cópias `gestor supervisao_patos/index.html` e `gestor supervisao_patos/firebase_deploy/public/index.html`.
- **Obrigatório - Backup Intermediário:** Sempre, após gerar uma nova versão funcional, salvar uma cópia do arquivo HTML resultante na pasta `intermediárias/` (ex: `intermediárias/aplicativo_v[N]_[descricao].html`).
- **Obrigatório - Gestão Dupla do Changelog (Texto e Site):** Sempre, após concluir as modificações de uma nova versão (ex: `0.n`), o assistente deve atualizar o registro histórico em **ambas as frentes**:
  1. **Changelog em Texto (`CHANGELOG.md`):**
     - Adicionar uma nova linha na tabela do *Sumário Executivo de Versões*.
     - Criar uma nova seção detalhada com numeração sequencial unificada (`0.n`), data/hora, insumos, e a listagem explícita de **Inclusões**, **Modificações** e **Exclusões**.
  2. **Log Interno do Site (Modal `#modalChangelog` em `index.html`):**
     - Atualizar o texto do botão de versão na barra de navegação/topo (`.btn-changelog`), refletindo a nova versão oficial (ex: `📌 Versão 0.n`).
     - Inserir o novo bloco de versão no topo da lista dentro do modal `#modalChangelog`.
- Valida o resultado contra o roteiro de teste do plano.
- **Obrigatório - Checagem Prévia e Pré-Push no GitHub:**
  1. Iniciar com `git pull origin main`.
  2. Antes de subir, rodar `git fetch origin main` e verificar `git log HEAD..origin/main --oneline`. Integrar com rebase se necessário.
  3. Realizar o commit semântico e enviar com `git push origin main`.
- **Obrigatório - Execução do Algoritmo de Auditoria Modular Pós-Deploy:**
  Imediatamente após o deploy, rodar:
  ```bash
  python3 audit_platform.py --silent-on-success
  ```
- **Obrigatório - Comunicação Exclusiva de Problemas:**
  O assistente deve **informar SOMENTE se houveram problemas/falhas**:
  - Em falhas: listar as baterias/módulos reprovados e detalhes do erro para que o usuário determine a resolução pelo engenheiro.
  - Em 100% de sucesso: informar objetivamente o sucesso do deploy e da auditoria, sem poluir a resposta.

---

## 3. Diretriz Fundamental: Dados e Indicadores como Apoio à Tomada de Decisão

O assistente deve **sempre trabalhar na lógica de dados e indicadores como apoiadores para a tomada de decisão**, com foco e atenção redobrada na **aba de Indicadores**:
- **Finalidade Decisória:** Dados, gráficos, médias, distribuições e métricas não devem existir como meros elementos visuais, informativos ou burocráticos. Toda informação apresentada deve responder a uma pergunta prática de gestão ou acompanhamento pedagógico.
- **Diagnóstico e Clareza:** As visualizações e relatórios (especialmente na aba de Indicadores) devem permitir a identificação ágil de gargalos, padrões, evoluções e pontos de intervenção prioritária.
- **Instrumentalização dos Usuários:** Ao conceber ou implementar novos filtros, agregações temporais/longitudinais, cartões informativos ou exportações, a prioridade deve ser capacitar gestores, formadores e equipe técnica a tomar decisões embasadas, rápidas e orientadas a resultados concretos.

---

## 4. Estrutura de Arquivos e Deploy
- **Arquivo principal em produção (Deploy via GitHub Pages):**
  `index.html` (servido na raiz)
- **Cópias espelhadas de backup/deploy alternativo:**
  `gestor supervisao_patos/index.html`
  `gestor supervisao_patos/firebase_deploy/public/index.html`
- **Histórico/Versões intermediárias:**
  `intermediárias/`
- **Planos de Implementação:**
  `planos_de_implementacao/`
- **Motor Automatizado de Auditoria Modular:**
  `audit_platform.py`

---

## 5. Fluxo de Deploy e Publicação (GitHub Pages)

Após a conclusão da Etapa 2 (execução, validação, backup em `intermediárias/` e atualização do changelog duplo), o deploy em produção é realizado de forma automática através do envio dos commits para o repositório no GitHub:

```bash
# 1. Checagem pré-push de concorrência
git fetch origin main
git log HEAD..origin/main --oneline

# 2. Commit e envio das alterações
git add index.html CHANGELOG.md audit_platform.py "intermediárias/..."
git commit -m "feat: sua mensagem semantica"
git push origin main
```
