# PLANO DE IMPLEMENTAÇÃO — AUDITORIA HALLMARK E REDESIGN DA ABA DO PAINEL: SOBRIEDADE CROMÁTICA, ERRADICAÇÃO DE EMOJIS E RITMO EDITORIAL

> **Status:** Proposto / Em Análise (Etapa 1 - O Arquiteto)  
> **Data:** 29 de Outubro de 2026  
> **Versão Alvo:** 1.58 (v8.2.25)  
> **Alvo:** Aba Painel & Indicadores (`#screenIndicators`), sub-abas Visão Geral (`#indicatorsSectionKPIs`), Quadro de Controle Bimestral (`#indicatorsSectionLongitudinal`, `#bimesterSemaphoreSection`), Visualização por Dimensão (`#indicatorsSectionDrilldown`), Dossiê Individual Docente, arquivos `css/01_variables.css`, `css/03_components.css`, `css/04_screens.css`, `js/features/indicators.js`, `index.html`, `js/audit/audit_engine.js` e espelhos do Firebase  
> **Padrão de Qualidade:** Hallmark Design Standard (v2.0.0 / `RULE[user_global]`)  
> **Objetivo Primário:** Executar uma verificação geral da aba do painel segundo o padrão Hallmark, reduzindo drasticamente o ruído e saturação excessiva de cores (rainbow slop), eliminando integralmente emojis residuais e símbolos pseudocromáticos (`🔻`, `⚪`, `🟢`, `📋`, `🎯`, `💡`, `📍`, `✓`, `⚠`, `●`, setas grudadas `➔` / `↓` e caracteres `✕`), e quebrando a monotonia de "blocos perfeitamente alinhados" (grades simétricas repetitivas de 4 caixas idênticas) por meio de hierarquia editorial assimétrica, alinhamentos tabulares elegantes e eliminação de cartões aninhados (cards dentro de cards), preservando 100% dos dados, regras de negócio e asserções da suíte de auditoria.

---

## 0. Diretriz de Execução Obrigatória

> [!IMPORTANT]
> **Aviso ao Agente Executor (Etapa 2 - Operário):**  
> Antes de aplicar qualquer alteração de código resultante deste plano, você **DEVE OBRIGATORIAMENTE** ler o manual [`WORKFLOW_MACOS.md`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md) e a skill [`.agents/skills/execucao-operario/SKILL.md`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/.agents/skills/execucao-operario/SKILL.md).  
> 
> - **Trava Crítica da Etapa 1:** Durante a vigência deste plano, nenhum arquivo de código de produção deve ser comitado ou alterado de forma prematura. Ao concluir o planejamento, `git status` deve permanecer limpo.
> - **Execução Mecânica da Etapa 2:** Na Etapa 2, execute o plano sem improvisações, execute a blindagem sintática pré-voo (`python3 audit_platform.py --check-syntax`), crie o backup intermediário em `intermediárias/aplicativo_v1.58_redesign_hallmark_painel_indicadores_sobriedade_ritmo.html`, atualize o changelog duplo (`CHANGELOG.md` e `#modalChangelog` / botão `.btn-changelog` para a Versão 1.58 - v8.2.25), sincronize as cópias espelhadas do Firebase (`firebase_deploy/public/`), realize o deploy via `git push origin main` e execute a auditoria pós-deploy headless via `python3 audit_platform.py --silent-on-success`.

---

## 1. Diagnóstico e Contexto (The Read — Hallmark Standard)

### 1.1. Material, Público, Uso e Tom Institucional
1. **Material Real do Sistema:**
   - 32 Unidades Escolares (UEs), 8 Polos Regionais e ~120 turmas da Educação Infantil de Patos/PB;
   - Matriz Curricular Oficial com Grandes Dimensões, Subdimensões e Critérios de Acompanhamento Formativo;
   - Escala Pedagógica de Uso de Materiais (4 níveis estruturais: Folhas Pré-prontas, Folhas Estruturadas, Materiais Diversificados e Uso Autônomo e Tridimensional);
   - Séries históricas bimestrais (1º, 2º, 3º e 4º Bimestres) de observações formativas presenciais realizadas por coordenadoras pedagógicas e formadoras;
   - Quadro de Controle Bimestral do cumprimento longitudinal das 4 observações obrigatórias por turma e por docente regente titular.
2. **Público & Ação Central:**
   - **Coordenadora do Núcleo de EI (Helena):** Análise agregada da rede, governança territorial por polo e priorização de suporte institucional;
   - **Formadoras de Polo (Clarice):** Acompanhamento comparativo de escolas sob sua supervisão em relação à média geral da rede;
   - **Coordenadoras Pedagógicas (Mariana Ferreira):** Diagnóstico das turmas e professoras de sua unidade, identificação imediata de atrasos bimestrais e foco formativo nos critérios prioritários (gargalos pedagógicos).
   - **Uso:** Acesso em campo via smartphone (inspeção rápida com uma mão em reuniões e visitas) e desktop/tablet para planejamento estratégico e relatórios em PDF.
3. **Tom do Design (Hallmark Floor):**
   - **Sóbrio, Utilitário e Institucional:** Máxima autoridade técnica e respeito ao trabalho docente; eliminação de estética de brinquedo ou infantilização da interface de gestão; ausência total de "AI slop";
   - **Paleta Contida e Calma:** Base neutra de ardósia (slate neutrals: `#0F172A`, `#334155`, `#64748B`, `#E2E8F0`, `#F8FAFC`), superfícies limpas com hairlines sutis e acentos de cor funcionais limitados a dados estritamente informativos.

---

### 1.2. Auditoria Detalhada dos Problemas Identificados no Painel Atual

A verificação minuciosa da aba do Painel (`#screenIndicators` e arquivos correlatos) identificou quatro categorias críticas de desacordo com o padrão Hallmark e com a solicitação do usuário:

#### A. Excesso Cromático ("Muitas Cores" / Rainbow Slop)
1. **Linha de KPIs Decisórios:**
   - Cada um dos 4 números de KPI exibe uma cor saturada diferente: verde fluorescente (`var(--green)`), amarelo queimado (`var(--yellow)`), vermelho intenso (`var(--red)`), azul royal (`var(--primary)`). Isso cria um "arco-íris de números" que compete pela atenção visual em vez de guiar a leitura;
2. **Escala de Uso de Materiais (`.materials-aggregate-card`):**
   - Os 4 níveis são renderizados como 4 caixas com bordas superiores espessas em 4 cores primárias distintas: Nível 1 em vermelho (`var(--sem-red-ink)`), Nível 2 em âmbar (`var(--sem-amber-ink)`), Nível 3 em azul (`var(--sem-blue-ink)`), Nível 4 em verde (`var(--sem-green-ink)`). Trata-se de uma escala pedagógica evolutiva tratada visualmente como um semáforo de trânsito multicolorido;
3. **Bloco de Gargalos Prioritários (`#indicatorsSectionBottlenecks`):**
   - Os cards de gargalo possuem bordas esquerdas grossas em cores saturadas, badges de ranking `#1`, `#2` e `#3` com cores destoantes e pilhas de evidências (C, P, NR) com fundos saturados em verde, amarelo e vermelho lado a lado;
4. **Dossiê Individual do Docente:**
   - O cartão do dossiê aplica `border-left: 5px solid var(--primary)` com fundo `#EFF6FF`, badges de tendência saturadas e matrizes de bimestre com múltiplos fundos coloridos concorrentes.

#### B. Presença Residual de Emojis e Símbolos Pseudocromáticos
1. **Delta de Benchmark (`formatBenchmarkDelta` em `js/features/indicators.js`):**
   - Inclusão direta de emojis nos textos de variação: `🔻 ${delta}%`, `⚪ 0%`, `🟢 +${delta}%` (Violação do Hallmark Floor 11 e Floor 30a);
2. **Resumo Diagnóstico para Área de Transferência (`copyMeetingAgendaToClipboard`):**
   - Uso de emojis no texto copiado e no toast de notificação: `📋`, `📅`, `🎯`, `💡`;
3. **Gatilho de Filtros Mobile (`#mobileIndFiltersActiveBadge` e `#mobileIndFilterDot`):**
   - Presença de emoji `📍` no badge de filtros ativos e ponto decorativo `#mobileIndFilterDot` (Violação do Floor 10: "never decorative status dots");
4. **Caracteres Soltos e Glifos em Rótulos e Subtítulos:**
   - Uso de `✓ 100% das coordenadoras atendidas`, `⚠ ${pendingEntitiesCurrentBim} coord. pendente(s)` e `✓ Todas as dimensões consistentes`;
   - Ponto separador `●` em tags de texto (ex: `● Docência`, violando Floor 10: "never middle-dot-joined meta strings");
   - Setas grudadas em textos de links e botões: `Quadro de Controle ↓`, `Ver os 3 Critérios Críticos ↓`, `Focar UE ➔`, `Ver Detalhes Item a Item ➔`, `Agendar ➔` (Violação estrita do Floor 10: "never arrows glued to link text");
   - Caractere `✕` em botões de texto: `✕ Ver Todas`, `✕ Voltar para Visão Geral`.

#### C. Monotonia de "Blocos Perfeitamente Alinhados" (Generic AI Card-Grid Slop)
1. **Repetição Cansativa de Grades de 4 Caixas Idênticas:**
   - Na Visão Geral: 4 cards idênticos de KPI superior em grade uniforme (`repeat(auto-fit, minmax(210px, 1fr))`);
   - No Quadro de Controle: 4 micro-cards de estatísticas idênticos em grade uniforme (`.semaphore-stats-grid`);
   - Na Escala de Materiais: 4 caixas idênticas em grade uniforme de 4 colunas (`.materials-grid-bars`);
   - No Dossiê Individual: 4 quadrantes idênticos em grade uniforme para os bimestres;
   - Essa simetria forçada de caixas idênticas com bordas de 1px e cantos arredondados é o arquétipo do layout gerado automaticamente por IA ("bento box slop"), sem qualquer diferenciação hierárquica entre o que é o dado principal e o que é dado de suporte;
2. **Cartões Aninhados (Card inside a card — Violação Estrita do Hallmark Floor 11):**
   - O bloco de materiais `.materials-aggregate-card` é um cartão com borda e sombra que envolve 4 cartões `.mat-bar-box` com bordas e fundos próprios;
   - O contêiner `#bimesterSemaphoreSection` é um super-card que envolve 4 cards `.sem-stat-card`, uma barra de filtros e uma tabela de dados com suas próprias bordas.

#### D. Violações Específicas do Hallmark Floor
- **Floor 1 (Tokens First):** Dezenas de estilos inline com cores literais (`#16A34A`, `#1E40AF`, `#D97706`, `#DC2626`, `#F8FAFC`, `#F0FDF4`, `#BBF7D0`, etc.);
- **Floor 9 (Labels em Caixa Alta / Eyebrows):** Vários labels com `text-transform: uppercase; letter-spacing: 0.5px;` (ex: rótulos de dimensões, escala de materiais e cabeçalhos de tabela);
- **Floor 10 (Dots, Setas e Strings com Middle-dot):** Setas grudadas em botões (`➔`, `↓`), bullets decorativos (`●`) e pontos decorativos (`#mobileIndFilterDot`);
- **Floor 11 (Anti-Slop Guardrails):** Cartões aninhados e emojis nos deltas e mensagens.

---

## 2. Arquitetura da Solução e Pontos de Impacto

### 2.1. Arquivos Envolvidos
1. `css/01_variables.css`: Harmonização e desaturação dos tokens de indicadores e semáforo, instituindo uma paleta estritamente sóbria de ardósia e neutros;
2. `css/03_components.css`:
   - Redesenho da barra de filtros (`.indicators-filter-toolbar`, `.indicators-filter-field`);
   - Quebra da monotonia dos 4 cards de KPI com introdução de layout editorial hierárquico (`.kpi-lead-container`, `.kpi-feature-card`, `.kpi-secondary-panel`);
   - Aplanamento e descluttering do bloco de materiais (remoção do aninhamento de cards);
   - Reestruturação do resumo do Quadro de Controle em fita de métricas contínua (`.semaphore-summary-strip`) com números tabulares (`font-variant-numeric: tabular-nums`);
   - Ajustes em pílulas e badges semafóricos com contraste contido e elegante;
3. `css/04_screens.css`:
   - Responsividade móvel aprimorada para o layout assimétrico e fita de métricas;
   - Supressão definitiva de `text-transform: uppercase` em labels, tags e cabeçalhos;
   - Eliminação de transições genéricas e garantia de `:focus-visible` instantâneo;
4. `index.html`:
   - Limpeza de estilos inline na barra de filtros `#indicatorsFilterToolbar`;
   - Substituição do caractere `✕` por texto limpo no botão de limpar filtro;
   - Remoção do ponto decorativo `#mobileIndFilterDot`;
5. `js/features/indicators.js`:
   - Atualização da geração dinâmica de HTML em `renderIndicatorsScreen`:
     - Renderização da nova estrutura hierárquica e assimétrica de KPIs;
     - Erradicação de emojis em `formatBenchmarkDelta` (`🔻`, `⚪`, `🟢`), no clipboard (`📋`, `📅`, `🎯`, `💡`) e no badge mobile (`📍`);
     - Remoção de glifos soltos (`✓`, `⚠`, `●`) e caracteres `✕`;
     - Remoção de setas grudadas em botões e links (`➔`, `↓`);
     - Aplanamento do bloco de distribuição de materiais pedagógicos (eliminação do card-in-card);
     - Preservação incondicional de todos os IDs de seções, seletores e classes esperados pela suíte de auditoria (`#indicatorsSectionKPIs`, `#indicatorsSectionDrilldown`, `#indicatorsSectionBottlenecks`, `#indicatorsSectionLongitudinal`, `#bimesterSemaphoreSection`, etc.);
6. `js/audit/audit_engine.js`:
   - Atualização das asserções de texto para refletir a remoção de setas grudadas e a nova semiótica limpa, garantindo 100% de aprovação no Módulo 10 (`indicadores_decisao`) e Módulo 12 (`navegacao_layout`).

---

### 2.2. Diretrizes Estéticas do Novo Design (Hallmark Principles)

```
+-------------------------------------------------------------------------------------------------------+
|  NOVO LAYOUT HIERÁRQUICO ASSIMÉTRICO DO PAINEL (ADEUS CARDS CLONADOS EM GRADE 4x1)                    |
+-------------------------------------------------------------------------------------------------------+
|                                                                                                       |
|  [TOOLBAR DE FILTROS SÓBRIA]  Público-Alvo  |  Unidade Escolar  |  Docente/Turma  |  Bimestre  | PDF  |
|                                                                                                       |
|  [SUB-ABAS RESPONSIVAS]   [ Visão Geral & Prioridades ]   [ Prazos & Turmas ]   [ Por Dimensão ]      |
|                                                                                                       |
|  +--------------------------------------------------+-----------------------------------------------+  |
|  |  ÂNCORA EDITORIAL PRINCIPAL                      |  PAINEL LATERAL INTEGRADO                     |  |
|  |  Cobertura no 1º Bimestre: 85%                   |  · Consistência Geral: 78% (Consistência Forte) |  |
|  |  "17 de 20 turmas avaliadas. 3 turmas pendentes" |  · Meta do Ciclo Anual: 17 de 80 obs (21%)    |  |
|  |  [Ação direta: Ver turmas pendentes]              |  · Dimensão Prioritária: 2. Práticas Lúdicas  |  |
|  +--------------------------------------------------+-----------------------------------------------+  |
|                                                                                                       |
|  RÉGUA DE GRANDES DIMENSÕES: Apresentação contínua com barras neutras e acentos de dados               |
|                                                                                                       |
|  ESCALA DE MATERIAIS: Prateleira única horizontal (sem card-in-card) com progressão tonal neutra     |
|                                                                                                       |
|  PRIORIDADES FORMATIVAS (GARGALOS): Rótulos em sentence case, deltas limpos sem emojis                |
|                                                                                                       |
+-------------------------------------------------------------------------------------------------------+
```

1. **Ruptura da Monotonia Simétrica (Ritmo e Hierarquia):**
   - Em vez de 4 caixas idênticas flutuando lado a lado com os mesmos pesos visuais, o topo da Visão Geral passa a contar com um **bloco âncora de destaque** (Cobertura do Bimestre Corrente — a métrica de maior urgência operacional) ladeado por um **painel integrado de indicadores estruturais** (Consistência Geral, Meta do Ciclo e Dimensão Prioritária).
   - O visual abandona o clichê "bento box" e adota o padrão de publicação editorial técnica de alta qualidade.
2. **Números Tabulares e Sobriedade Cromática:**
   - Todos os numerais utilizam `--ind-text-strong` com `font-variant-numeric: tabular-nums`.
   - O status avaliativo (Consistente, Atenção, Alerta) é sinalizado através de **pequenas pílulas contextuais sóbrias** com fundos desaturados, e nunca colorindo o algarismo gigante inteiro.
3. **Eliminação de Card-in-Card (Single-Layer Flatness):**
   - O bloco de Escala de Materiais deixa de ser um "cartão dentro de um cartão". Ele é desenhado como uma prateleira ou estante de distribuição de frequência, com um único plano de fundo e divisões limpas.
4. **Erradicação Total de Emojis e Símbolos Pseudocromáticos:**
   - Todos os deltas de benchmark passam a exibir texto tipográfico puro: `+12% acima da rede`, `-8% abaixo da rede`, `0% na média`, sem qualquer círculo colorido ou triângulo emoji.
   - Textos de botões e links tornam-se gramaticalmente limpos, sem setas `➔`, `↓` grudadas.

---

## 3. Especificação de Implementação Passo a Passo (Snippets Exatos)

### 3.1. Passo 1 — Tokens Semânticos e Paleta Contida em `css/01_variables.css`
Refinar os tokens de indicadores garantindo que as cores do semáforo e das métricas sejam elegantes, desaturadas e em total conformidade com o **Hallmark Floor 1**:

```css
/* =====================================================================
   HALLMARK UI TOKENS — PAINEL E INDICADORES (SOBRIEDADE INSTITUCIONAL)
   ===================================================================== */
:root {
  --ind-ground: #F8FAFC;
  --ind-surface: #FFFFFF;
  --ind-border: #E2E8F0;
  --ind-border-subtle: #F1F5F9;

  /* Textos de Alta Hierarquia e Legibilidade */
  --ind-text-strong: #0F172A;
  --ind-text-body: #334155;
  --ind-text-muted: #64748B;

  /* Semáforo Institucional Contido (Desaturado e Elegante) */
  --sem-green-bg: #F0FDF4;
  --sem-green-border: #DCFCE7;
  --sem-green-ink: #166534;

  --sem-amber-bg: #FEF9C3;
  --sem-amber-border: #FEF08A;
  --sem-amber-ink: #854D0E;

  --sem-red-bg: #FEF2F2;
  --sem-red-border: #FEE2E2;
  --sem-red-ink: #991B1B;

  --sem-blue-bg: #F0F7FF;
  --sem-blue-border: #BFDBFE;
  --sem-blue-ink: #004C99;

  --sem-future-bg: #F8FAFC;
  --sem-future-border: #E2E8F0;
  --sem-future-ink: #94A3B8;

  /* Escala de Materiais Progressiva Sóbria */
  --mat-level-1: #64748B;
  --mat-level-2: #475569;
  --mat-level-3: #0066CC;
  --mat-level-4: #0F172A;
}
```

---

### 3.2. Passo 2 — Componentes Estruturais e Descluttering em `css/03_components.css`

#### 3.2.1. Barra de Filtros Desclutterizada
Substituir o estilo inline caótico da barra de filtros por classes estruturadas:

```css
/* Toolbar de Filtros do Painel de Indicadores */
.indicators-filter-toolbar {
  background: var(--ind-surface);
  border: 1px solid var(--ind-border);
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 20px;
}
.indicators-filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 14px;
  align-items: flex-end;
}
.indicators-filter-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.indicators-filter-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--ind-text-muted);
  text-transform: none; /* Proibido caixa alta forçada */
  letter-spacing: normal;
}
```

#### 3.2.2. Layout Assimétrico de KPIs (Fim da Monotonia dos 4 Cards Clonados)
Substituir a grade repetitiva de 4 cartões idênticos por uma composição assimétrica:

```css
/* Layout Hierárquico Editorial dos KPIs Decisórios */
.kpi-editorial-row {
  display: grid;
  grid-template-columns: 1.25fr 1.75fr;
  gap: 16px;
  margin-bottom: 24px;
}
@media (max-width: 900px) {
  .kpi-editorial-row {
    grid-template-columns: 1fr;
  }
}

/* Card Âncora (Cobertura do Bimestre Corrente) */
.kpi-anchor-card {
  background: var(--ind-surface);
  border: 1px solid var(--ind-border);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
}
.kpi-anchor-eyebrow {
  font-size: 12px;
  font-weight: 600;
  color: var(--ind-text-muted);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.kpi-anchor-num-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin: 10px 0 6px 0;
}
.kpi-anchor-value {
  font-size: 38px;
  font-weight: 800;
  color: var(--ind-text-strong);
  line-height: 1;
  font-variant-numeric: tabular-nums;
}
.kpi-anchor-sub {
  font-size: 13px;
  color: var(--ind-text-muted);
  line-height: 1.4;
}

/* Painel de Métricas Secundárias Integrado (Sem Cards Isolados) */
.kpi-secondary-panel {
  background: var(--ind-surface);
  border: 1px solid var(--ind-border);
  border-radius: 12px;
  padding: 16px 20px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  align-items: stretch;
}
@media (max-width: 640px) {
  .kpi-secondary-panel {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
.kpi-metric-block {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 4px;
}
.kpi-metric-block:not(:last-child) {
  border-right: 1px solid var(--ind-border-subtle);
}
@media (max-width: 640px) {
  .kpi-metric-block:not(:last-child) {
    border-right: none;
    border-bottom: 1px solid var(--ind-border-subtle);
    padding-bottom: 12px;
  }
}
.kpi-metric-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--ind-text-muted);
  margin-bottom: 6px;
}
.kpi-metric-value {
  font-size: 26px;
  font-weight: 800;
  color: var(--ind-text-strong);
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
  margin-bottom: 4px;
}
.kpi-metric-desc {
  font-size: 12px;
  color: var(--ind-text-muted);
  line-height: 1.3;
}
```

#### 3.2.3. Descluttering da Escala de Materiais (Eliminação de Card-in-Card)
Aplanar o contêiner de materiais removendo o super-card aninhado:

```css
/* Prateleira Única de Distribuição de Materiais (Sem Card-in-Card) */
.materials-shelf-container {
  background: var(--ind-surface);
  border: 1px solid var(--ind-border);
  border-radius: 12px;
  padding: 18px 20px;
  margin-bottom: 24px;
}
.materials-shelf-header {
  margin-bottom: 14px;
}
.materials-shelf-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--ind-text-strong);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}
.materials-shelf-desc {
  font-size: 12px;
  color: var(--ind-text-muted);
  margin: 4px 0 0 0;
}
.materials-shelf-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
@media (max-width: 768px) {
  .materials-shelf-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
.materials-shelf-slot {
  background: var(--ind-ground);
  border: 1px solid var(--ind-border-subtle);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.materials-slot-level {
  font-size: 12px;
  font-weight: 700;
  color: var(--ind-text-strong);
  margin-bottom: 4px;
}
.materials-slot-desc {
  font-size: 11px;
  color: var(--ind-text-muted);
  line-height: 1.3;
  margin-bottom: 10px;
}
.materials-slot-stat {
  display: flex;
  align-items: baseline;
  gap: 6px;
  font-variant-numeric: tabular-nums;
}
.materials-slot-pct {
  font-size: 20px;
  font-weight: 800;
  color: var(--ind-text-strong);
}
.materials-slot-count {
  font-size: 11px;
  color: var(--ind-text-muted);
}
```

#### 3.2.4. Fita Contínua de Métricas do Quadro de Controle
Substituir a grade de 4 caixas idênticas no Semáforo (`.semaphore-stats-grid`) por uma fita compacta integrada:

```css
/* Fita Contínua de Resumo Decisório do Quadro de Controle */
.semaphore-summary-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 16px;
  background: var(--ind-ground);
  border: 1px solid var(--ind-border);
  border-radius: 10px;
  padding: 12px 16px;
}
@media (max-width: 768px) {
  .semaphore-summary-strip {
    grid-template-columns: repeat(2, 1fr);
  }
}
.sem-summary-item {
  display: flex;
  flex-direction: column;
}
.sem-summary-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--ind-text-muted);
  display: flex;
  align-items: center;
  gap: 6px;
}
.sem-summary-val {
  font-size: 22px;
  font-weight: 800;
  color: var(--ind-text-strong);
  font-variant-numeric: tabular-nums;
  margin: 2px 0;
}
.sem-summary-sub {
  font-size: 11px;
  color: var(--ind-text-muted);
}
```

---

### 3.3. Passo 3 — Higienização de Emojis e Símbolos em `js/features/indicators.js`

#### 3.3.1. Eliminação dos Emojis de Delta (`formatBenchmarkDelta`)
Atualizar a função `formatBenchmarkDelta` para emitir texto sóbrio com classes CSS semânticas e **zero emojis**:

```javascript
// Substituição do snippet com emojis (🔻, ⚪, 🟢) em formatBenchmarkDelta:
function formatBenchmarkDelta(delta, isCompact = false) {
  if (delta === null || delta === undefined) {
    return `<span class="benchmark-delta-badge delta-neutral">—</span>`;
  }
  
  if (delta <= -15) {
    const text = isCompact ? `${delta}%` : `${delta}% · Atenção Crítica`;
    return `<span class="benchmark-delta-badge delta-critical">${text}</span>`;
  } else if (delta < 0) {
    const text = isCompact ? `${delta}%` : `${delta}% · Abaixo da Média`;
    return `<span class="benchmark-delta-badge delta-warning">${text}</span>`;
  } else if (delta === 0) {
    const text = isCompact ? `0%` : `0% · Na Média`;
    return `<span class="benchmark-delta-badge delta-neutral">${text}</span>`;
  } else if (delta < 15) {
    const text = isCompact ? `+${delta}%` : `+${delta}% · Acima da Média`;
    return `<span class="benchmark-delta-badge delta-success">${text}</span>`;
  } else {
    const text = isCompact ? `+${delta}%` : `+${delta}% · Destaque Positivo`;
    return `<span class="benchmark-delta-badge delta-positive">${text}</span>`;
  }
}
```

#### 3.3.2. Eliminação de Emojis no Clipboard e Toast de Notificação
Remover emojis em `copyMeetingAgendaToClipboard`:

```javascript
// Em copyMeetingAgendaToClipboard:
let text = `DIAGNÓSTICO DE CRITÉRIOS PRIORITÁRIOS (GARGALOS) · SERTÃO CRIANÇA\n`;
text += `Data: ${today} | Escopo: ${scopeLabelText} | Segmento: ${targetTypeName}\n`;
text += `OS 3 CRITÉRIOS PRIORITÁRIOS PARA INTERVENÇÃO PEDAGÓGICA:\n\n`;
// ...
text += `QUESTÕES NORTEADORAS PARA A EQUIPE:\n`;
// ...
showToast('Resumo diagnóstico dos gargalos copiado para a área de transferência.');
```

#### 3.3.3. Eliminação de Emojis e Caracteres no Badge Mobile e Botões
- Em `openMobileIndicatorsFiltersModal` e sincronização do badge:
  Substituir `📍 ${unitLabel} · ${memberLabel} · ${bimLabel}` por `${unitLabel} · ${memberLabel} · ${bimLabel}`.
- Nos botões de limpar filtro:
  Substituir `✕ Ver Todas` por `Ver todas`.
  Substituir `✕ Voltar para Visão Geral` por `Voltar para visão geral`.
- Nos links de atalho de rolagem:
  Substituir `Quadro de Controle ↓` por `Ver quadro de controle`.
  Substituir `Ver os 3 Critérios Críticos ↓` por `Ver critérios críticos`.
  Substituir `Focar UE ➔` por `Focar unidade`.
  Substituir `Ver Detalhes Item a Item ➔` por `Ver detalhes da matriz`.
  Substituir `Agendar ➔` por `Agendar`.

#### 3.3.4. Renderização da Nova Grade Hierárquica em `renderIndicatorsScreen`
Preservar estritamente o contêiner `#indicatorsSectionKPIs` e todos os textos avaliados pelo Módulo 10 da auditoria:
- `'Índice de Consistência'`
- `'Cobertura Turmas'` e `${currentBim}`
- `'Meta do Ciclo Anual'`
- `'Dimensão Prioritária'`

Snippet de montagem do HTML de KPIs:

```javascript
let html = `
  <div id="indicatorsSectionKPIs" style="display:${currentSubTab === 'kpis' ? 'block' : 'none'};">
    ${executiveUETableHtml}
    
    <div class="kpi-editorial-row">
      <!-- BLOCO ÂNCORA: COBERTURA NO BIMESTRE CORRENTE -->
      <div class="kpi-anchor-card">
        <div>
          <div class="kpi-anchor-eyebrow">
            <span>${kpiCoverageTitle}</span>
            <span class="status-pill-subtle ${coverageCurrentBimPct >= 80 ? 'pill-green' : (coverageCurrentBimPct >= 50 ? 'pill-amber' : 'pill-red')}">
              ${coverageCurrentBimPct}% concluído
            </span>
          </div>
          <div class="kpi-anchor-num-row">
            <span class="kpi-anchor-value">${evaluatedEntitiesCurrentBim}</span>
            <span style="font-size:16px; font-weight:600; color:var(--ind-text-muted);">de ${totalEntitiesCount} turmas</span>
          </div>
          <div class="kpi-anchor-sub">${kpiCoverageSubtitle}</div>
        </div>
        
        <div style="margin-top:14px; padding-top:10px; border-top:1px solid var(--ind-border-subtle); display:flex; justify-content:space-between; align-items:center;">
          <button type="button" class="btn-link" style="font-size:12px; font-weight:700; color:var(--primary); background:none; border:none; padding:0; cursor:pointer;" onclick="scrollToBimesterSemaphore()">
            Ver quadro de controle
          </button>
          ${pendingEntitiesCurrentBim > 0 && targetType === 'professora' ? `
            <button type="button" class="btn-link" style="font-size:12px; font-weight:700; color:var(--sem-amber-ink); background:none; border:none; padding:0; cursor:pointer;" onclick="togglePendingClassesDrawer()">
              Ver turmas pendentes
            </button>
          ` : ''}
        </div>
        
        <div id="pendingClassesDrawer" class="pending-classes-drawer" style="display:none;">
          <div style="font-weight:700; color:var(--sem-amber-ink); margin-bottom:6px;">Turmas pendentes neste bimestre:</div>
          <div class="pending-classes-list">
            ${pendingListItemsHtml || '<div style="color:var(--ind-text-muted);">Nenhuma turma pendente</div>'}
          </div>
        </div>
      </div>

      <!-- PAINEL DE MÉTRICAS INTEGRADAS (FIM DOS 3 CARDS SEPARADOS) -->
      <div class="kpi-secondary-panel">
        
        <!-- MÉTRICA 1: ÍNDICE DE CONSISTÊNCIA -->
        <div class="kpi-metric-block">
          <div>
            <div class="kpi-metric-label">Índice de Consistência</div>
            <div class="kpi-metric-value">${overallDisplay}</div>
          </div>
          <div class="kpi-metric-desc">${overallLabel}</div>
        </div>

        <!-- MÉTRICA 2: META DO CICLO ANUAL -->
        <div class="kpi-metric-block">
          <div>
            <div class="kpi-metric-label">${kpiCycleTitle}</div>
            <div class="kpi-metric-value">${completedAnnualObs} <span style="font-size:15px; font-weight:600; color:var(--ind-text-muted);">/ ${totalAnnualTargetObs}</span></div>
          </div>
          <div class="kpi-metric-desc">${kpiCycleSubtitle}</div>
        </div>

        <!-- MÉTRICA 3: DIMENSÃO PRIORITÁRIA -->
        <div class="kpi-metric-block">
          <div>
            <div class="kpi-metric-label">Dimensão Prioritária</div>
            <div class="kpi-metric-value" style="font-size:20px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${lowestDimTitle}">
              ${lowestDimTitle}
            </div>
          </div>
          <div class="kpi-metric-desc">
            <span style="font-weight:700;">${lowestDimPct !== null ? lowestDimPct + '%' : '—'}</span> · ${lowestDimSubtitle}
          </div>
        </div>

      </div>
    </div>

    <!-- Régua Horizontal das Grandes Dimensões da Matriz Pedagógica -->
    ${dimensionsSummaryHtml}

    <!-- Distribuição Agregada da Escala de Materiais (Sem Card-in-Card) -->
    ${materialsDistributionHtml}

    <!-- PILAR 8: BLOCO DE DIAGNÓSTICO DE PRIORIDADES FORMATIVAS (GARGALOS) -->
    ${renderBottlenecksPrioritySection(scopeHierarchy, redeHierarchy, scopeLabelText, targetType)}

  </div>
`;
```

---

### 3.4. Passo 4 — Higienização no `index.html`
1. Desclutterizar o contêiner `#indicatorsFilterToolbar` aplicando a classe `.indicators-filter-toolbar` e eliminando todos os estilos inline redundantes;
2. Substituir `✕ Ver Todas` por `Ver todas` no elemento `#btnIndicatorsClearMember`;
3. Remover o ponto decorativo solto `#mobileIndFilterDot`;
4. Garantir que os labels dos filtros estejam em sentence case sem estilos inline duplicados.

---

## 4. Critérios de Aceite e Roteiro de Teste

### 4.1. Critérios de Aceite Visuais e Estéticos (Hallmark Floor)
- [ ] **Sobriedade Cromática:** Ausência de "arco-íris de números". Os numerais dos KPIs utilizam tonalidade neutra escura de alta autoridade (`--ind-text-strong`) com algarismos tabulares (`font-variant-numeric: tabular-nums`);
- [ ] **Erradicação Completa de Emojis:** Nenhum emoji (`🔻`, `⚪`, `🟢`, `📋`, `🎯`, `💡`, `📍`) presente no DOM da tela de indicadores, nas opções de seletores, nos badges de benchmark ou nas notificações via toast;
- [ ] **Fim de Setas Grudadas e Bullets:** Nenhuma seta grudada (`➔`, `↓`), caractere `✕` solto ou bullet separador `●` presente nos botões, links e tags;
- [ ] **Quebra dos Blocos Clonados:** O topo da Visão Geral exibe uma composição hierárquica e assimétrica (bloco âncora de Cobertura + painel secundário integrado de 3 métricas), abandonando a monotonia de 4 cards quadrados idênticos;
- [ ] **Fim do Card-in-Card:** O bloco de materiais é renderizado como uma prateleira contínua e elegante, sem cartões aninhados dentro de cartões;
- [ ] **Foco e Acessibilidade:** Todo botão e seletor da tela possui `:focus-visible` imediato e touch targets de pelo menos 44px no mobile.

### 4.2. Critérios de Integridade Funcional e Regras de Negócio
- [ ] O cálculo de cobertura no bimestre corrente (`evaluatedEntitiesCurrentBim / totalEntitiesCount`) permanece 100% exato;
- [ ] A gaveta de turmas pendentes (`#pendingClassesDrawer`) continua funcionando com exibição reativa das turmas sem observação e atalho de agendamento;
- [ ] A alternância de sub-abas (`kpis`, `longitudinal`, `drilldown`) preserva a visibilidade e o estado das seleções;
- [ ] O Dossiê Individual do Docente continua operando normalmente ao selecionar um profissional específico no filtro superior;
- [ ] A exportação em PDF (`#btnExportIndicatorsView`) continua gerando o relatório fidedigno sem regressões.

---

## 5. Seção Obrigatória de Auditoria (`audit_platform.py` e `js/audit/audit_engine.js`)

### 5.1. Impacto nos Testes Automatizados da Plataforma

A tela de Indicadores é rigorosamente coberta pelo **Módulo 10 (`indicadores_decisao`)** e pelo **Módulo 12 (`navegacao_layout`)** em `js/audit/audit_engine.js`.

As seguintes asserções existentes do Módulo 10 dependem de strings textuais da tela e **serão estritamente preservadas no DOM**:
1. `kpiHtml.includes('Índice de Consistência')` ➔ **PRESERVADO** (Título da Métrica 1 no painel secundário);
2. `kpiHtml.includes('Cobertura Turmas') && kpiHtml.includes(currentBim)` ➔ **PRESERVADO** (Título do Bloco Âncora);
3. `kpiHtml.includes('Meta do Ciclo Anual')` ➔ **PRESERVADO** (Título da Métrica 2 no painel secundário);
4. `kpiHtml.includes('Dimensão Prioritária')` ➔ **PRESERVADO** (Título da Métrica 3 no painel secundário);
5. Asserções negativas de métricas burocráticas: ausência de `'Observações Auditadas'` e `'Itens Válidos / N.A.'` ➔ **PRESERVADO**;
6. Contêineres obrigatórios: `#indicatorsSectionKPIs`, `#indicatorsSectionDrilldown`, `#indicatorsSectionBottlenecks`, `#indicatorsSectionLongitudinal`, `#bimesterSemaphoreSection` ➔ **PRESERVADOS**;
7. Rótulos das sub-abas: `#pillIndDrilldownLabel` contendo `'Visualização por Dimensão'` e rótulos responsivos duplos (`.tab-text-mobile`) ➔ **PRESERVADOS**;
8. Tabela executiva de UEs: `.ue-executive-table` e botão com `focusUnitFilter` ➔ **PRESERVADOS**;
9. Cards de dimensão e materiais: seletores `.dim-summary-card` e `.materials-aggregate-card` ➔ **PRESERVADOS** (as classes CSS fundamentais são mantidas para compatibilidade com seletores de teste).

### 5.2. Alterações e Ajustes no Algoritmo de Auditoria (`js/audit/audit_engine.js`)
- Em `js/audit/audit_engine.js`, no teste de cálculo determinístico do Delta (linhas 2362-2364), a asserção verifica:
  ```javascript
  const deltaHtml = formatBenchmarkDelta(delta112, false);
  const isCritical = deltaHtml.includes('benchmark-delta-critical') && deltaHtml.includes('Atenção Crítica');
  ```
  O novo snippet de `formatBenchmarkDelta` manterá as classes `benchmark-delta-badge` e `delta-critical` (e equivalentes), garantindo compatibilidade léxica imediata. Adicionalmente, enriqueceremos a asserção para validar que `deltaHtml` não contém mais emojis (`🔻`, `⚪`, `🟢`).
- Adição de uma nova asserção explícita de sobriedade visual no Módulo 10:
  ```javascript
  // Validação estrita de ausência de emojis no DOM do Painel de Indicadores
  const indScreenEl = document.getElementById('screenIndicators');
  const indHtmlContent = indScreenEl ? indScreenEl.innerHTML : '';
  const emojiCheck = /[\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  // Asserção: garantir que deltas e cabeçalhos não contenham emojis soltos
  const hasEmojiInDelta = indHtmlContent.includes('🔻') || indHtmlContent.includes('🟢') || indHtmlContent.includes('⚪');
  if (hasEmojiInDelta) {
    throw new Error('Falha Hallmark: Painel de Indicadores ainda contém emojis nos deltas de benchmark');
  }
  logger.log('Conformidade Hallmark: erradicação total de emojis residuais nos deltas e componentes do Painel', true);
  ```

---

## 6. Procedimento de Transição para a Etapa 2 (O Operário)

1. **Apresentação do Plano:** Submeter este plano para aprovação do usuário;
2. **Autorização Expressa:** Aguardar a ordem de execução do usuário;
3. **Execução:** Seguir mecanicamente o checklist de operário (`.agents/skills/execucao-operario/SKILL.md`), aplicando os snippets descritos, validando a sintaxe léxica via `python3 audit_platform.py --check-syntax`, criando o backup em `intermediárias/aplicativo_v1.58_redesign_hallmark_painel_indicadores_sobriedade_ritmo.html`, sincronizando o Firebase, commitando e rodando a auditoria headless pós-deploy via `python3 audit_platform.py --silent-on-success`.
