# PLANO DE IMPLEMENTAÇÃO — REDESIGN HALLMARK DA ABA PAINEL E INDICADORES (SOBRIEDADE VISUAL & ACESSIBILIDADE MOBILE)

> **Status:** Proposto / Em Análise (Etapa 1 - O Arquiteto)  
> **Data:** 29 de Outubro de 2026  
> **Alvo:** Aba Painel e Indicadores (`#screenIndicators`, sub-abas `#indicatorsSectionKPIs`, `#indicatorsSectionDrilldown`, `#indicatorsSectionLongitudinal`, barra de filtros `#indicatorsFilterToolbar`, semáforo `#bimesterSemaphoreSection`, arquivos `css/01_variables.css`, `css/03_components.css`, `css/04_screens.css`, `js/features/indicators.js`, `index.html`)  
> **Padrão de Qualidade:** Hallmark Design Standard (v2.0.0 / `RULE[user_global]`)  
> **Objetivo Primário:** Reduzir drasticamente a saturação e o ruído cromático (eliminar arco-íris de badges e bordas saturadas), instituir sobriedade estética governamental profissional e modernizar a acessibilidade mobile em smartphones e tablets (touch targets mínimos de 44px, eliminação de rótulos invisíveis em telas pequenas, tipografia sem capitais forçadas e eliminação de emojis residuais), preservando 100% dos dados, regras de negócio e asserções de auditoria.

---

## 0. Diretriz de Execução Obrigatória

> [!IMPORTANT]
> **Aviso ao Agente Executor (Etapa 2 - Operário):**  
> Antes de aplicar qualquer alteração de código resultante deste plano, você **DEVE OBRIGATORIAMENTE** ler o manual [`WORKFLOW_MACOS.md`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md) e a skill [`.agents/skills/execucao-operario/SKILL.md`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/.agents/skills/execucao-operario/SKILL.md).  
> É terminantemente proibido modificar código na Etapa 1. Na Etapa 2, execute as etapas mecanicamente, valide a integridade léxica via `python3 audit_platform.py --check-syntax`, faça backup intermediário em `intermediárias/`, atualize o changelog duplo (`CHANGELOG.md` e `#modalChangelog`), sincronize as cópias espelhadas do projeto e execute a auditoria pós-deploy headless via `python3 audit_platform.py --silent-on-success`.

---

## 1. Diagnóstico e Contexto (The Read — Hallmark Standard)

### 1.1. Material, Público, Uso e Tom
1. **Material Real do Sistema:**
   - 32 Unidades Escolares (UEs) e 8 Polos Regionais da Educação Infantil de Patos/PB;
   - Matriz Curricular Oficial com Grandes Dimensões, Subdimensões e Critérios de Acompanhamento Formativo;
   - Escala de Uso de Materiais Pedagógicos com 4 níveis estruturais (Folhas Pré-prontas, Folhas Estruturadas, Materiais Diversificados e Uso Rico e Autônomo);
   - Séries históricas bimestrais (1º, 2º, 3º e 4º Bimestres) de observações formativas presenciais realizadas por coordenadoras pedagógicas e formadoras;
   - Quadro de Controle Bimestral Semafórico do cumprimento longitudinal das 4 observações obrigatórias por turma e por docente regente titular.
2. **Público & Ação Central:**
   - **Coordenadora do Núcleo de EI (Helena):** Análise estratégica agregada da rede municipal, monitoramento de disparidades entre polos regionais e identificação dos gargalos curriculares coletivos para nortear as pautas das formações continuadas;
   - **Formadoras de Polo (Clarice):** Acompanhamento comparativo das unidades escolares sob sua supervisão em relação à média geral da rede municipal;
   - **Coordenadoras Pedagógicas de Unidade (Mariana Ferreira):** Diagnóstico das turmas e professoras de sua creche/escola, identificação imediata de atrasos no cronograma bimestral e priorização formativa dos critérios de menor consistência;
   - **Uso:** Acesso em campo pelo smartphone durante visitas técnicas às salas de aula e reuniões pedagógicas (necessidade de agilidade com uma mão, sem frustração de toques perdidos), ou no desktop/tablet para reuniões de planejamento e exportação de relatórios em PDF.
3. **Tom do Design (Hallmark Floor):**
   - **Sóbrio, Utilitário e Institucional:** Máxima autoridade técnica e respeito ao trabalho docente; ausência total de "estética de brinquedo" ou infantilização da interface de gestão; eliminação de gradientes genéricos de IA (AI-slop);
   - **Paleta Contida e Calma:** Base neutra de ardósia (slate neutrals: `#0F172A`, `#334155`, `#64748B`, `#E2E8F0`, `#F8FAFC`), superfícies limpas e brancas com hairlines sutis, e acentos de cor funcionais limitados a dados informativos (verde, âmbar e vermelho contidos e elegantes no semáforo, e azul institucional SerTão Criança `--primary` apenas para elementos ativos e foco).

### 1.2. Principais Dores Identificadas no Diagnóstico da Tela Atual

1. **Excesso de Cores Arbitrárias e "Rainbow Slop":**
   - Barra de filtros `#indicatorsFilterToolbar` contém estilo inline com bordas e sombras soltas, além do `#indicatorsTargetTypeBadge` com azul saturado solto (`#EFF6FF`, `#1D4ED8`, `#BFDBFE`);
   - Na linha de KPIs decisórios superiores, convivem simultaneamente bordas e textos em verde saturado (`#16A34A`, `#166534`), laranja (`#D97706`, `#92400E`), azul (`#1E40AF`, `#1D4ED8`) e vermelho (`#DC2626`, `#E11D48`), competindo visualmente pela atenção do usuário em vez de orientar a decisão pedagógica;
   - Na Escala de Materiais, 4 blocos com cores de saturação alta geram excesso de ruído na visualização geral.
2. **Violações Graves do Hallmark Floor:**
   - **Floor 2 (Transições Ilegais):** Presença de `transition: all 0.15s ease;` em múltiplos componentes: `.indicators-icon-tab-btn` (`css/04_screens.css:710`), `.semaphore-view-btn` (`css/03_components.css:311`), `.sem-filter-chip` (`css/03_components.css:401`), `.sem-status-pill` (`css/03_components.css:436`);
   - **Floor 9 (Labels em Caixa Alta / Eyebrows):** Presença reiterada de `text-transform: uppercase; letter-spacing: 0.5px;` em rótulos de filtros no toolbar, títulos de cards e cabeçalhos de seções;
   - **Floor 10 (Dots Decorativos):** Presença de pontos decorativos (`#mobileIndFilterDot`, bolinhas `●` no texto dos cartões);
   - **Floor 11 (Emojis Residuais):** Botão de exportação exibe emoji solto `📄 PDF` no `#btnExportIndicatorsView`; no gatilho mobile há `📍 Carregando filtros...`; no banner da rede há emojis de monumento `🏛️` e lâmpada `💡`; no campo de busca há `🔍`.
3. **Gargalos Críticos de Ergonomia e Acessibilidade Mobile:**
   - **Sub-abas Ocultadas no Mobile:** A regra `@media (max-width: 640px)` em `css/04_screens.css:749` aplica `.indicators-icon-tab-btn .tab-text { display: none !important; }`. O usuário no celular vê apenas 3 ícones sem rótulo textual nenhum, sendo forçado a adivinhar qual botão leva à Visão Geral, ao Quadro de Controle ou à Visualização por Dimensão;
   - **Alvos de Toque Insuficientes:** No smartphone, as pílulas semafóricas e os botões de ação na tabela possuem áreas de clique inferiores a 44px de altura, dificultando a interação rápida com o polegar;
   - **Seletores e Prevenção de Auto-Zoom no iOS:** No celular, seletores com tamanho de fonte abaixo de 16px sem regras de viewport adequadas podem disparar zoom indesejado no Safari WebKit do iPhone.

---

## 2. Arquitetura e Pontos de Impacto

### 2.1. Arquivos Envolvidos
1. `css/01_variables.css`: Adição e unificação de tokens de design semânticos e paleta sóbria específica para indicadores (`--ind-ground`, `--ind-surface`, `--ind-border`, `--ind-border-subtle`, `--ind-text-strong`, `--ind-text-body`, `--ind-text-muted`, tokens de badges semafóricos e estados);
2. `css/03_components.css`: Refatoração dos componentes de indicadores: `.indicators-subtabs-nav`, `.indicators-icon-tab-btn`, `.kpi-card-hallmark`, `.bimester-semaphore-container`, `.sem-stat-card`, `.sem-filter-chip`, `.sem-status-pill`, remoção integral de `transition: all` e adoção de propriedades específicas (`background-color`, `border-color`, `color`, `opacity`, `transform`);
3. `css/04_screens.css`: Aperfeiçoamento da responsividade mobile (`@media (max-width: 768px)` e `@media (max-width: 640px)`): restauração dos rótulos de texto das sub-abas com versão concisa para telas pequenas (`.tab-text-full` e `.tab-text-mobile`), empilhamento harmonioso de filtros, touch targets mínimos de 44px (`--touch-target-min`) e prevenção de zoom no Safari iOS;
4. `index.html`: Descluttering da barra de filtros `#indicatorsFilterToolbar`, erradicação de estilos inline literais, eliminação de `text-transform: uppercase` nos labels, substituição do emoji `📄 PDF` por pictograma SVG vetorial em `#btnExportIndicatorsView` e eliminação de pontos decorativos;
5. `js/features/indicators.js`: Harmonização da renderização dinâmica de `renderIndicatorsScreen`:
   - Geração de stat-boxes e cards de KPI decisórios com classes sóbrias estruturadas;
   - Erradicação de emojis residuais (`🏛️`, `💡`, `🔍`, `✕`) substituídos por pictogramas SVG monocromáticos;
   - Inserção de markup responsivo com `.tab-text-full` e `.tab-text-mobile` nas sub-abas;
   - Preservação estrita de todos os IDs de containers, seletores e classes testados pela auditoria (`#indicatorsSectionKPIs`, `#indicatorsSectionDrilldown`, `#indicatorsSectionBottlenecks`, `#indicatorsSectionLongitudinal`, `#bimesterSemaphoreSection`, `.sem-status-pill`, `.sem-pill-icon`, etc.);
6. `js/audit/audit_engine.js`: Preservação e enriquecimento de asserções da tela de Indicadores.

---

## 3. Especificação de Implementação Passo a Passo (Snippets Exatos)

### 3.1. Passo 1 — Tokens Semânticos e Paleta Sóbria em `css/01_variables.css`
Inserir tokens institucionais contidos e calmos para a tela de indicadores, em estrita conformidade com o **Hallmark Floor 1**:

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

  /* Alvo de Toque e Ergonomia Mobile */
  --touch-target-min: 44px;
}
```

---

### 3.2. Passo 2 — Sub-abas, Cards de KPI e Componentes Semafóricos em `css/03_components.css`

1. **Remoção de `transition: all` e adoção de propriedades específicas:**
Substituir todas as ocorrências de `transition: all` por transições pontuais de `background-color`, `border-color`, `color`, `opacity` e `transform`.

2. **Estilização Sóbria dos Componentes Semafóricos e Cards:**

```css
/* Hallmark Quadro de Controle Semafórico */
.bimester-semaphore-container {
  background: var(--ind-surface);
  border: 1px solid var(--ind-border);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: var(--shadow-sm);
}

.semaphore-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--ind-border);
}

.semaphore-title-group h3 {
  font-size: 17px;
  font-weight: 800;
  color: var(--ind-text-strong);
  margin: 0 0 4px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.semaphore-title-group p {
  font-size: 13px;
  color: var(--ind-text-muted);
  margin: 0;
  line-height: 1.4;
}

/* Alternador Turmas vs. Docentes */
.semaphore-view-toggle {
  display: inline-flex;
  background: var(--ind-ground);
  padding: 3px;
  border-radius: 8px;
  border: 1px solid var(--ind-border);
  gap: 4px;
}

.semaphore-view-btn {
  border: none;
  background: transparent;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--ind-text-muted);
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 36px;
}

.semaphore-view-btn:hover {
  color: var(--ind-text-strong);
  background: rgba(255, 255, 255, 0.6);
}

.semaphore-view-btn.active {
  background: var(--ind-surface);
  color: var(--primary);
  box-shadow: var(--shadow-sm);
  font-weight: 700;
}

/* Micro-cards de Resumo Decisório (Sóbrios) */
.semaphore-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.sem-stat-card {
  background: var(--ind-surface);
  border: 1px solid var(--ind-border);
  border-radius: 10px;
  padding: 12px 14px;
}

.sem-stat-card.alert-card {
  background: var(--sem-red-bg);
  border-color: var(--sem-red-border);
}

.sem-stat-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--ind-text-muted);
  text-transform: none; /* Proibido caixa alta forçada */
  display: flex;
  align-items: center;
  gap: 6px;
}

.sem-stat-card.alert-card .sem-stat-label {
  color: var(--sem-red-ink);
}

.sem-stat-value {
  font-size: 24px;
  font-weight: 800;
  color: var(--ind-text-strong);
  margin-top: 4px;
  line-height: 1.1;
}

.sem-stat-card.alert-card .sem-stat-value {
  color: var(--sem-red-ink);
}

.sem-stat-desc {
  font-size: 11px;
  color: var(--ind-text-muted);
  margin-top: 4px;
  line-height: 1.3;
}

/* Barra de Filtros Rápidos de Status */
.semaphore-filters-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
  padding: 8px 12px;
  background: var(--ind-ground);
  border-radius: 8px;
  border: 1px solid var(--ind-border);
}

.sem-filter-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--ind-text-muted);
  text-transform: none;
  margin-right: 4px;
}

.sem-filter-chip {
  background: var(--ind-surface);
  border: 1px solid var(--ind-border);
  border-radius: 16px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  color: var(--ind-text-body);
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  min-height: 32px;
}

.sem-filter-chip:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.sem-filter-chip.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #FFFFFF;
  font-weight: 700;
}

.sem-filter-chip.chip-red.active {
  background: var(--sem-red-ink);
  border-color: var(--sem-red-ink);
}

.sem-filter-chip.chip-green.active {
  background: var(--sem-green-ink);
  border-color: var(--sem-green-ink);
}

/* Pílulas Semafóricas Sóbrias */
.sem-status-pill {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 11px;
  line-height: 1.2;
  width: 100%;
  box-sizing: border-box;
  transition: background-color 0.15s ease, border-color 0.15s ease;
  text-align: left;
  cursor: pointer;
  min-height: 48px;
}

.sem-status-pill.status-completed {
  background: var(--sem-green-bg);
  border: 1px solid var(--sem-green-border);
  color: var(--sem-green-ink);
}

.sem-status-pill.status-overdue {
  background: var(--sem-red-bg);
  border: 1px solid var(--sem-red-border);
  color: var(--sem-red-ink);
}

.sem-status-pill.status-in_progress {
  background: var(--sem-blue-bg);
  border: 1px solid var(--sem-blue-border);
  color: var(--sem-blue-ink);
}

.sem-status-pill.status-future {
  background: var(--sem-future-bg);
  border: 1px dashed var(--sem-future-border);
  color: var(--sem-future-ink);
  cursor: default;
}
```

---

### 3.3. Passo 3 — Responsividade Mobile e Ergonomia em `css/04_screens.css`

1. **Sub-abas do Painel de Indicadores com Rótulos Responsivos:**
Eliminar a ocultação cega de texto no mobile e garantir legibilidade em qualquer largura de viewport:

```css
/* Sub-abas e Segmented Control do Painel de Indicadores */
.indicators-subtabs-nav {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 6px;
  margin-bottom: 20px;
  background: var(--ind-ground);
  padding: 4px;
  border-radius: 10px;
  border: 1px solid var(--ind-border);
  width: 100%;
  box-sizing: border-box;
}

.indicators-icon-tab-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: var(--touch-target-min);
  background: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
  color: var(--ind-text-muted);
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  white-space: nowrap;
  user-select: none;
  width: 100%;
  box-sizing: border-box;
}

.indicators-icon-tab-btn:hover {
  color: var(--ind-text-strong);
  background: rgba(255, 255, 255, 0.6);
}

.indicators-icon-tab-btn.active {
  background: var(--ind-surface);
  color: var(--primary);
  border-color: #CBD5E1;
  box-shadow: var(--shadow-sm);
  font-weight: 700;
}

.indicators-icon-tab-btn:focus-visible,
.sem-filter-chip:focus-visible,
.semaphore-view-btn:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

/* Rótulos Responsivos Duplos: Desktop vs Mobile */
.tab-text-full { display: inline; }
.tab-text-mobile { display: none; }

@media (max-width: 640px) {
  .indicators-subtabs-nav {
    gap: 4px;
    padding: 3px;
  }
  .indicators-icon-tab-btn {
    min-height: 44px;
    padding: 6px 8px;
    gap: 6px;
    font-size: 12px;
  }
  /* Mostra rótulo conciso no celular em vez de ocultar todo o texto */
  .tab-text-full { display: none !important; }
  .tab-text-mobile { display: inline !important; font-weight: 700; }

  /* Barra de Filtros Mobile */
  #indicatorsFilterToolbar {
    padding: 12px;
  }
  #indicatorsFilterToolbar .form-select,
  #indicatorsFilterToolbar .form-control {
    font-size: 14px !important; /* Previne auto-zoom no Safari iOS */
    min-height: var(--touch-target-min);
  }

  /* Quadro de Controle no Mobile */
  .semaphore-header-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  .semaphore-view-toggle {
    width: 100%;
  }
  .semaphore-view-btn {
    flex: 1;
    justify-content: center;
    min-height: var(--touch-target-min);
  }
  .semaphore-filters-bar {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    flex-wrap: nowrap;
    padding-bottom: 10px;
  }
  .sem-filter-chip {
    flex-shrink: 0;
    min-height: var(--touch-target-min);
  }

  /* Grid de Cards Decisórios Superiores em 2 Colunas */
  #indicatorsSectionKPIs .kpi-row {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    gap: 10px !important;
  }
}
```

---

### 3.4. Passo 4 — Higienização Estrutural e Remoção de Emojis em `index.html`

1. **Higienização de `#screenIndicators` e `#indicatorsFilterToolbar`:**
   - Remoção de estilos inline literais;
   - Adequação dos rótulos de filtros para sentence case normal:
     - `Público-Alvo` (mantido sem all-caps);
     - `Unidade Escolar` (mantido sem all-caps);
     - `Professora / Docente` (mantido sem all-caps);
     - `Bimestre` (mantido sem all-caps);
     - `Relatório` (mantido sem all-caps);
   - Substituição do botão `#btnExportIndicatorsView`:
     - Troca de `📄 PDF` por:
       ```html
       <button class="btn btn-secondary indicators-filter-btn" id="btnExportIndicatorsView" onclick="exportCurrentIndicatorsView()" title="Exportar Relatório em PDF" style="width:100%; height:42px; font-size:13px; font-weight:700; justify-content:center; display:inline-flex; align-items:center; gap:8px;">
         <svg class="btn-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
           <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
           <polyline points="14 2 14 8 20 8"></polyline>
           <line x1="16" y1="13" x2="8" y2="13"></line>
           <line x1="16" y1="17" x2="8" y2="17"></line>
           <polyline points="10 9 9 9 8 9"></polyline>
         </svg>
         <span>Exportar PDF</span>
       </button>
       ```
2. **Sub-abas com Rótulos Responsivos Duplos:**
   - `#pillIndKpis`:
     ```html
     <span class="tab-text" id="pillIndKpisLabel">
       <span class="tab-text-full">Visão Geral & Prioridades</span>
       <span class="tab-text-mobile">Geral</span>
     </span>
     ```
   - `#pillIndLongitudinal`:
     ```html
     <span class="tab-text" id="pillIndLongitudinalLabel">
       <span class="tab-text-full">Prazos & Turmas (Quadro de Controle)</span>
       <span class="tab-text-mobile">Quadro</span>
     </span>
     ```
   - `#pillIndDrilldown`:
     ```html
     <span class="tab-text" id="pillIndDrilldownLabel">
       <span class="tab-text-full">Visualização por Dimensão</span>
       <span class="tab-text-mobile">Dimensões</span>
     </span>
     ```
3. **Higienização do Gatilho Mobile `#btnMobileIndicatorsFilters`:**
   - Remoção de bolinha decorativa `#mobileIndFilterDot` e texto de fallback sem emojis (`Carregando filtros...`).

---

### 3.5. Passo 5 — Refinamento Dinâmico em `js/features/indicators.js`

1. **Unificação Sóbria dos 4 Cards Superiores de KPI:**
   - Eliminar as bordas coloridas saturadas (`border-left: 4px solid ...`) e substituir por superfícies brancas com bordas sutis (`--ind-border`);
   - Manter os números em cor ardósia de alto contraste (`--ind-text-strong`), com os percentuais informativos em cores contidas e legíveis;
   - Substituição de bolinhas soltas decorativas (`●`) por tipografia hierárquica clara.
2. **Erradicação Definitiva de Emojis em Banners e Placeholders:**
   - Na barra `.benchmark-info-bar`: substituir `🏛️` por pictograma SVG vetorial de instituição e `💡` por SVG vetorial de lâmpada/aviso sutil;
   - No input de busca `#drilldownSearchInput`: placeholder atualizado para `"Buscar critério por código ou texto..."` (sem emoji `🔍` solto no input);
   - No botão de retorno: substituir `✕ Voltar para Visão Geral` por ícone vetorial de retorno.
3. **Harmonização da Escala de Materiais:**
   - Substituição das cores saturadas dos 4 níveis por cartões de superfície neutra (`background: var(--ind-surface); border: 1px solid var(--ind-border);`) com badges contidos que identificam o nível pedagógico sem poluir visualmente a tela.
4. **Preservação de Todas as Asserções da Auditoria:**
   - Manter o texto literal verificado pela auditoria:
     - `Índice de Consistência`
     - `Cobertura Turmas` e `${currentBim}`
     - `Meta do Ciclo Anual`
     - `Dimensão Prioritária`
     - `Quadro de Controle Bimestral`
     - `Visualização por Dimensão`
     - `Referencial da Rede Municipal` / `Panorama Geral da Rede Municipal`
     - Classes `.ue-executive-table`, `.dim-summary-card`, `.materials-aggregate-card`, `#indicatorsSectionBottlenecks`, `#bimesterSemaphoreSection`, `.sem-status-pill`, `.sem-pill-icon`.

---

## 4. Critérios de Aceite e Roteiro de Teste

### 4.1. Critérios de Aceite Estéticos (Hallmark Standard)
- [ ] **Sobriedade Cromática:** Zero cores hexadecimais arbitrárias inline na tela de indicadores; 100% dos estilos consumindo variáveis de tokens declaradas no `:root`;
- [ ] **Erradicação do Rainbow Slop:** Cards de KPI, semáforo e distribuição de materiais exibem números e dados em paleta contida, elegante e de fácil leitura analítica;
- [ ] **Zero Emojis:** Zero emojis Unicode em botões, banners, placeholders e tabelas; 100% de uso de pictogramas vetoriais SVG monocromáticos;
- [ ] **Tipografia Sóbria (Floor 9):** Ausência de rótulos em tracked capitals forçado (`text-transform: uppercase`);
- [ ] **Transições Restritas (Floor 2):** Nenhuma ocorrência de `transition: all` nos componentes de indicadores.

### 4.2. Critérios de Aceite Mobile (Ergonomia no Smartphone)
- [ ] **Sub-abas Legíveis no Celular:** Em telas <= 640px, os 3 botões da sub-aba exibem ícone e rótulo textual conciso ("Geral", "Quadro", "Dimensões"), sem ocultar o texto;
- [ ] **Alvos de Toque Confortáveis:** Todos os botões, chips de filtro e pílulas semafóricas possuem altura mínima de 44px no mobile;
- [ ] **Prevenção de Auto-Zoom no iOS:** Seletores de filtros com tamanho de fonte de 14px no mobile, evitando o zoom automático inconveniente do Safari iOS;
- [ ] **Grid Responsivo em 2 Colunas:** Os 4 cards decisórios de KPI se organizam em grid 2x2 harmonioso no smartphone, sem comprimir os valores numéricos.

---

## 5. Seção Obrigatória de Auditoria (`audit_platform.py` / `js/audit/audit_engine.js`)

> [!IMPORTANT]
> **Preservação e Blindagem da Suíte de Testes (Tolerância Zero a Regressões):**

### 5.1. Preservação Estrita dos Testes Ativos
1. **Módulo 1 (`navegacao_layout`):**
   - Ativação correta de `#screenIndicators` ao acionar `navigateToTab('indicators')` via `#deskTabDiag` ou `#mobTabDiag`. Mantido 100% intacto;
2. **Módulo 7 (`metricas_decisorias_kpis`):**
   - Validação da extinção das métricas burocráticas ("Auditadas", "Itens Válidos / N.A.");
   - Presença dos 4 cards decisórios: "Índice de Consistência", "Cobertura Turmas", "Meta do Ciclo Anual" e "Dimensão Prioritária". Mantido 100% intacto;
3. **Módulo 8 (`gargalos_prioridades_formativas`):**
   - Presença de `#indicatorsSectionBottlenecks`, alternância entre modos `absolute` e `delta`, e ausência de caixas de pautas pré-fabricadas. Mantido 100% intacto;
4. **Módulo 9 (`filtros_mobile_bottom_sheet`):**
   - Presença de `#btnMobileIndicatorsFilters`, `#indicatorsFilterToolbar`, `#modalIndicatorsFiltersMobile`, `#indicatorsUnitFilter` e `#indicatorsBimesterFilter`;
   - Padding e dimensões mínimas do seletor desktop (`padding-left >= 12px`, `padding-right >= 32px`, `box-sizing: border-box`, `text-overflow: ellipsis`);
   - Dimensões do seletor mobile (`height >= 40px`, `padding-left >= 12px`, `padding-right >= 32px`). Mantido 100% intacto;
5. **Módulo 10 (`semaforo_bimestral_turmas`):**
   - Presença de `#bimesterSemaphoreSection` com título exato "Quadro de Controle Bimestral";
   - Alternância de visão `classes` vs `teachers`;
   - Pílulas semafóricas com classes `.status-completed`, `.status-overdue`, `.status-in_progress` e ícones vetoriais SVG `.sem-pill-icon`;
   - Ausência de períodos estimados ("Fev - Abr", "Janela de 2 meses"). Mantido 100% intacto.

### 5.2. Novas Asserções Automatizadas Propostas
No `js/audit/audit_engine.js` (Módulo 7 ou Módulo 10):
1. **Asserção de Rótulos Responsivos nas Sub-abas de Indicadores:**
   - Verificação da presença de elementos `.tab-text-full` e `.tab-text-mobile` dentro de `#pillIndKpisLabel`, `#pillIndLongitudinalLabel` e `#pillIndDrilldownLabel`;
2. **Asserção de Erradicação de `transition: all`:**
   - Validação estática de que os seletores `.indicators-icon-tab-btn`, `.semaphore-view-btn`, `.sem-filter-chip` e `.sem-status-pill` não utilizam a diretiva `transition: all`;
3. **Asserção de Ausência de Emojis em Botões e Banners de Indicadores:**
   - Verificação de ausência de emojis soltos no `#btnExportIndicatorsView` e na barra de filtros.

---

## 6. Parecer Arquitetural Sintético

A aba Painel e Indicadores é a central de inteligência de dados da rede municipal de Patos. Ela congrega dados complexos de 32 escolas, 8 polos, centenas de turmas e milhares de respostas de observação.

Atualmente, o excesso de cores soltas e a perda de contexto no celular (com textos sumindo nas sub-abas) geram fadiga visual e dificultam o uso da plataforma em campo por coordenadoras e formadoras. A aplicação deste plano confere sobriedade institucional de padrão executivo governamental, alinha o módulo ao Hallmark Standard e transforma a experiência mobile em algo ágil, acessível e agradável ao toque.
