# WORKFLOW PADRÃO DO PROJETO (ANTIGRAVITY - MACOS)

Este documento define as diretrizes obrigatórias de desenvolvimento e entrega para este projeto no ambiente **macOS**, preservando integralmente o fluxo em duas etapas e adaptando os comandos de terminal, auditoria automatizada e deploy.

---

## 1. Dados do Projeto e URLs Oficiais
- **Repositório GitHub:** [https://github.com/silvabrun0/supervisao-st-crianca](https://github.com/silvabrun0/supervisao-st-crianca)
- **Hosting URL Oficial (GitHub Pages):** [https://silvabrun0.github.io/supervisao-st-crianca/](https://silvabrun0.github.io/supervisao-st-crianca/)
- **Deploy Automático:** O deploy de produção é acionado automaticamente a cada `git push origin main`, servindo o arquivo `index.html` da raiz.

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
  0. **Diretriz de Execução (Obrigatório):** O plano deve *obrigatoriamente* iniciar com uma instrução explícita ao assistente executor (Etapa 2), mandando-o **ler e seguir as diretrizes deste `WORKFLOW_MACOS.md`** antes de aplicar as mudanças.
  1. **Diagnóstico e Contexto:** Cenário atual vs. resultado esperado.
  2. **Arquitetura e Pontos de Impacto:** Mapeamento exato de quais funções JS, variáveis e blocos HTML serão afetados.
  3. **Especificação de Implementação Passo a Passo (Obrigatório):** Snippets **exatos** de código de substituição, nomes exatos de IDs e lógicas condicionais detalhadas.
  4. **Critérios de Aceite e Roteiro de Teste/Validação:** Lista explícita de checagem.
  5. **Seção Obrigatória: Alterações / Adições / Exclusões no Algoritmo de Auditoria (Mandatório):**
     Ao final de qualquer plano, o assistente DEVE obrigatoriamente especificar quais alterações, adições e exclusões devem ser implementadas no algoritmo de auditoria (`audit_platform.py` e testes modulares em `index.html`), estruturado em módulos independentes ("modo-a-modo"), a fim de garantir que 100% da plataforma permaneça coberta e testada deterministamente após a aplicação das modificações.
- Salvar o documento em:
  `./planos_de_implementacao/plano_[nome_da_feature_ou_data].md`

### Etapa 2: Execução Direta e Fiel ao Plano (Baixa Capacidade / "O Operário")
- Em uma nova sessão/chat (ou utilizando um modelo mais rápido/simples), o usuário solicita a execução referenciando o plano correspondente.
- O assistente assume o plano como verdade absoluta e parte diretamente para a modificação dos arquivos, sem hesitação e sem refatorações não solicitadas.
- Aplica as alterações no código de produção (`index.html` da raiz).
- **Obrigatório - Garantia de Efetividade (Dupla Checagem):** Após disparar a substituição de código, o assistente DEVE reler a porção do arquivo alterada para se certificar de que a mudança está efetivamente salva.
- **Obrigatório - Sincronização de Cópias Espelhadas:** Manter sincronizados os arquivos idênticos `gestor supervisao_patos/index.html` e `gestor supervisao_patos/firebase_deploy/public/index.html`.
- **Obrigatório - Backup Intermediário:** Sempre, após gerar uma nova versão funcional, salvar uma cópia do arquivo HTML resultante na pasta `intermediárias/` (ex: `intermediárias/aplicativo_v[N]_[descricao].html`).
- **Obrigatório - Gestão Dupla do Changelog (Texto e Site):** Sempre, após concluir as modificações de uma nova versão (ex: `0.n`), atualizar o registro em ambas as frentes:
  1. **Changelog em Texto (`CHANGELOG.md`):**
     - Adicionar nova linha na tabela do *Sumário Executivo de Versões*.
     - Criar nova seção detalhada com numeração sequencial unificada (`0.n`), data/hora, insumos, e a listagem explícita de **Inclusões**, **Modificações** e **Exclusões**.
  2. **Log Interno do Site (Modal `#modalChangelog` em `index.html`):**
     - Atualizar o texto do botão de versão no topo (`.btn-changelog`), refletindo a nova versão oficial (ex: `📌 Versão 0.n`).
     - Inserir o novo bloco de versão no topo da lista dentro do modal `#modalChangelog`.
- Valida o resultado contra o roteiro de teste do plano.
- **Obrigatório - Checagem Prévia e Pré-Push no GitHub:**
  1. No início da execução, rodar `git pull origin main` para garantir que o código base está atualizado.
  2. Antes de subir as alterações, rodar `git fetch origin main` e verificar se há novos commits no remoto (`git log HEAD..origin/main --oneline`). Em caso positivo, integrar via `git pull --rebase origin main`.
  3. Realizar o commit semântico (`git add .` e `git commit -m "feat/fix: ..."`) e enviar para o repositório remoto via `git push origin main`.
- **Obrigatório - Execução do Algoritmo de Auditoria Modular Pós-Deploy:**
  Imediatamente após concluir o deploy (`git push origin main`), o assistente DEVE executar o algoritmo de auditoria:
  ```bash
  python3 audit_platform.py --silent-on-success
  ```
- **Obrigatório - Comunicação Exclusiva de Problemas:**
  O assistente deve **informar SOMENTE se houveram problemas/falhas**:
  - Se houverem falhas: relatar pontualmente os erros e testes reprovados para que o usuário determine que sejam solucionados pelo engenheiro.
  - Se todos os testes passarem (100% OK): manter a resposta estritamente limpa e sucinta, confirmando apenas o deploy e a aprovação integral da auditoria, sem poluir o chat com logs redundantes.

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
git add index.html CHANGELOG.md audit_platform.py "intermediárias/..." ...
git commit -m "feat: sua mensagem semantica"
git push origin main
```

> **Hosting Oficial Ativo:**
> Ao enviar as alterações para a branch `main`, o **GitHub Pages** atualiza automaticamente a aplicação em produção no endereço:
> [https://silvabrun0.github.io/supervisao-st-crianca/](https://silvabrun0.github.io/supervisao-st-crianca/)

---

## 6. Arquitetura Modular do Algoritmo de Auditoria (`audit_platform.py`)

O algoritmo de auditoria da plataforma SerTão Criança foi projetado para abarcar **100% da plataforma** de maneira modular e determinística ("modo-a-modo"):

### Catálogo de Módulos Oficiais
1. `auth_rbac`: Autenticação, Usuários, Perfis e RBAC.
2. `catalogo_dados`: Catálogo Canônico, Escolas, Turmas, Professores e Estado Global.
3. `setup_longitudinal`: Setup de Observação, Seleção de Turmas e Ciclo Longitudinal (Pilar 1).
4. `rubricas_observacao`: Observação Ativa, Matrizes Curriculares, Rubricas e Contador de Pendências.
5. `sintese_finalizacao`: Síntese Pedagógica, Escala de Materiais, Finalização e Cálculo Temporal.
6. `travas_seguranca`: Travas de Duplo Lançamento, Imutabilidade Longitudinal e Validações Preventivas.
7. `formadora_coordenacao`: Acompanhamento da Formadora, Matriz de Coordenação e Isolamento de Perfis.
8. `agenda_cronograma`: Cronograma de Visitas, Destaque da Próxima Visita e Baixa Automática.
9. `historico_governanca`: Histórico de Observações, Filtros Multidimensionais, Visualização e Exclusão.
10. `indicadores_decisao`: Indicadores Pedagógicos, Cobertura de Turmas (Pilar 1), KPIs e Apoio à Decisão.
11. `backup_exportacao`: Persistência Local, Backup JSON, Restauração e Espelho de Impressão.
12. `navegacao_layout`: Sistema de Rotas/Tabs, Menu Mobile Overlay, Acessibilidade e Modal de Changelog.

### Modos de Execução CLI
- **Execução Integral (Modo-a-Modo sequencial de todos os 12 módulos):**
  ```bash
  python3 audit_platform.py
  ```
- **Execução de Módulo Específico:**
  ```bash
  python3 audit_platform.py --module auth_rbac
  python3 audit_platform.py --module setup_longitudinal
  ```
- **Listar Módulos Disponíveis:**
  ```bash
  python3 audit_platform.py --list-modules
  ```
- **Execução Silenciosa para Pós-Deploy (Etapa 2):**
  ```bash
  python3 audit_platform.py --silent-on-success
  ```
  *(Retorna código 0 e saída silenciosa em caso de aprovação integral; emite relatório detalhado e código 1 somente caso ocorram falhas).*
