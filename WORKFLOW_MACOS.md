# WORKFLOW PADRÃO DO PROJETO (ANTIGRAVITY - MACOS)

Este documento define as diretrizes obrigatórias de desenvolvimento e entrega para este projeto no ambiente **macOS**, preservando integralmente o fluxo em duas etapas e adaptando os comandos de terminal e deploy.

---

## 1. Dados do Projeto e URLs Oficiais
- **Firebase Project ID:** `supervisao-st-crianca`
- **Project Console:** [https://console.firebase.google.com/project/supervisao-st-crianca/overview](https://console.firebase.google.com/project/supervisao-st-crianca/overview)
- **Hosting URL (Ambiente Online/Produção):** [https://supervisao-st-crianca.web.app](https://supervisao-st-crianca.web.app)

---

## 2. Estrutura do Workflow em Duas Etapas (Modelo Assimétrico)

**A Racionalidade do Modelo:**
Este workflow baseia-se na assimetria de capacidade de processamento. A **Etapa 1 (Planejamento)** pressupõe o uso de alta capacidade cognitiva, grande janela de contexto e raciocínio profundo para investigar o código, debugar e prever impactos. A **Etapa 2 (Execução)** pressupõe um modelo de capacidade reduzida ou operação restrita, que atua como um "operário mecânico", lendo as instruções e aplicando diretamente no arquivo final.

O plano gerado na Etapa 1 deve ser exato e à prova de falhas para que a Etapa 2 ocorra de forma rápida e segura.

### Etapa 1: Planejamento Profundo e Sistematização (Alta Capacidade / "O Arquiteto")
- O usuário apresenta as necessidades, novos requisitos, regras de negócio ou ajustes de layout/UX.
- O assistente **NÃO** aplica mudanças no código imediatamente.
- **Princípio Central:** O assistente deve utilizar sua máxima capacidade analítica (vasculhar o código via comandos de terminal, grep, ler arquivos) para dissecar o problema.
- **Lógica de Decisão em Indicadores:** Ao planejar qualquer alteração ou novo recurso (especialmente na aba de indicadores), conceber a solução estritamente sob a ótica de que dados e indicadores são ferramentas de apoio à tomada de decisão da gestão e equipe pedagógica.
- O documento final deve conter código "mastigado", identificando não apenas "o que" mudar, mas as linhas, o arquivo e o bloco exato de substituição.
- **O Plano deve conter:**
  0. **Diretriz de Execução (Obrigatório):** O plano deve *obrigatoriamente* iniciar com uma instrução explícita ao assistente executor (Etapa 2), mandando-o **ler e seguir as diretrizes deste `WORKFLOW_MACOS.md`** (ou `WORKFLOW.md` caso em Windows) antes de aplicar as mudanças.
  1. **Diagnóstico e Contexto:** Cenário atual vs. resultado esperado.
  2. **Arquitetura e Pontos de Impacto:** Mapeamento exato de quais funções JS, variáveis e blocos HTML serão afetados.
  3. **Especificação de Implementação Passo a Passo (Obrigatório):** Snippets **exatos** de código de substituição, nomes exatos de IDs e lógicas condicionais detalhadas.
  4. **Critérios de Aceite e Roteiro de Teste/Validação:** Lista explícita de checagem.
- Salvar o documento em:
  `./planos_de_implementacao/plano_[nome_da_feature_ou_data].md`

### Etapa 2: Execução Direta e Fiel ao Plano (Baixa Capacidade / "O Operário")
- Em uma nova sessão/chat (ou utilizando um modelo mais rápido/simples), o usuário solicita a execução referenciando o plano correspondente.
- O assistente assume o plano como verdade absoluta e parte diretamente para a modificação dos arquivos, sem hesitação e sem refatorações não solicitadas.
- Aplica as alterações no código de produção (`firebase_deploy/public/index.html`).
- **Obrigatório - Garantia de Efetividade (Dupla Checagem):** Após disparar a substituição de código, o assistente DEVE reler a porção do arquivo alterada para se certificar de que a mudança está efetivamente salva.
- **Obrigatório - Backup Intermediário:** Sempre, após gerar uma nova versão funcional, salvar uma cópia do arquivo HTML resultante na pasta `intermediárias/` (ex: `aplicativo_vX.html` ou nome descritivo).
- **Obrigatório - Gestão Dupla do Changelog (Texto e Site):** Sempre, após concluir as modificações de uma nova versão (ex: `0.n`), atualizar o registro em ambas as frentes:
  1. **Changelog em Texto (`CHANGELOG.md`):**
     - Adicionar nova linha na tabela do *Sumário Executivo de Versões*.
     - Criar nova seção detalhada com numeração sequencial unificada (`0.n`), data/hora, insumos, e a listagem explícita de **Inclusões**, **Modificações** e **Exclusões**.
  2. **Log Interno do Site (Modal `#modalChangelog` em `firebase_deploy/public/index.html`):**
     - Atualizar o texto do botão de versão no topo (`.btn-changelog`), refletindo a nova versão oficial (ex: `📌 Versão 0.n`).
     - Inserir o novo bloco de versão no topo da lista dentro do modal `#modalChangelog`.
- Valida o resultado contra o roteiro de teste do plano.
- **Deploy Automático no macOS:** O assistente está **expressamente autorizado** a realizar o deploy no Firebase via terminal automaticamente, executando os comandos descritos na Seção 5, sem precisar pedir permissão adicional.

---

## 3. Diretriz Fundamental: Dados e Indicadores como Apoio à Tomada de Decisão

O assistente deve **sempre trabalhar na lógica de dados e indicadores como apoiadores para a tomada de decisão**, com foco e atenção redobrada na **aba de Indicadores**:
- **Finalidade Decisória:** Dados, gráficos, médias, distribuições e métricas não devem existir como meros elementos visuais, informativos ou burocráticos. Toda informação apresentada deve responder a uma pergunta prática de gestão ou acompanhamento pedagógico.
- **Diagnóstico e Clareza:** As visualizações e relatórios (especialmente na aba de Indicadores) devem permitir a identificação ágil de gargalos, padrões, evoluções e pontos de intervenção prioritária.
- **Instrumentalização dos Usuários:** Ao conceber ou implementar novos filtros, agregações temporais/longitudinais, cartões informativos ou exportações, a prioridade deve ser capacitar gestores, formadores e equipe técnica a tomar decisões embasadas, rápidas e orientadas a resultados concretos.

---

## 4. Estrutura de Arquivos e Deploy
- **Arquivo principal em produção (Deploy):**
  `firebase_deploy/public/index.html`
- **Configurações do Firebase:**
  `firebase_deploy/firebase.json`
- **Histórico/Versões intermediárias:**
  `intermediárias/`
- **Planos de Implementação:**
  `planos_de_implementacao/`

---

## 5. Comandos de Deploy (macOS / Terminal Unix)

Após a conclusão da Etapa 2 (execução, validação, backup em `intermediárias/` e atualização do changelog), o assistente executa a publicação diretamente pelo terminal:

```bash
cd "firebase_deploy"
firebase deploy
```

> **Nota para o Assistente (Fallback / Resolução de PATH no macOS):**
> Caso o comando `firebase` direto informe `command not found`, utilize o caminho absoluto do binário instalado no sistema ou execute via `npx`:
> ```bash
> # Se instalado globalmente via npm:
> /usr/local/bin/firebase deploy
> # Ou via Homebrew (Apple Silicon / Intel):
> /opt/homebrew/bin/firebase deploy
> # Ou diretamente via npx (sem necessidade de CLI global instalada):
> npx firebase-tools deploy
> ```
