# PLANO DE IMPLEMENTAÇÃO — REDESIGN HALLMARK DA ABA DE GESTÃO PEDAGÓGICA (SOBRIEDADE VISUAL & ACESSIBILIDADE MOBILE)

> **Status:** Proposto / Em Análise (Etapa 1 - O Arquiteto)  
> **Data:** 29 de Outubro de 2026  
> **Alvo:** Aba de Gestão Pedagógica / Gestão da Rede (`#homeGestaoView`, sub-abas `#pedagViewUnits`, `#pedagViewClasses`, `#pedagViewTeam`, `#pedagViewExports`, arquivos `css/01_variables.css`, `css/03_components.css`, `css/04_screens.css`, `js/features/management.js`, `index.html`)  
> **Padrão de Qualidade:** Hallmark Design Standard (v2.0.0 / `RULE[user_global]`)  
> **Objetivo Primário:** Reduzir a saturação de cores, instituir sobriedade estética profissional e revolucionar a usabilidade e ergonomia em dispositivos móveis (smartphones e tablets), preservando 100% dos dados, regras de negócio e asserções de auditoria.

---

## 0. Diretriz de Execução Obrigatória
> [!IMPORTANT]
> **Aviso ao Agente Executor (Etapa 2 - Operário):**  
> Antes de aplicar qualquer alteração de código resultante deste plano, você **DEVE OBRIGATORIAMENTE** ler o manual [`WORKFLOW_MACOS.md`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md) e a skill [`.agents/skills/execucao-operario/SKILL.md`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/.agents/skills/execucao-operario/SKILL.md).  
> É proibido modificar código na Etapa 1. Na Etapa 2, execute as etapas mecanicamente, valide a integridade léxica via `python3 audit_platform.py --check-syntax`, faça backup intermediário, atualize o changelog duplo, sincronize o Firebase e execute a auditoria pós-deploy.

---

## 1. Diagnóstico e Contexto (The Read — Hallmark Standard)

### 1.1. Material, Público, Uso e Tom
1. **Material Real do Sistema:**
   - Catálogo de 32 Unidades Escolares (UEs) e seus respectivos Polos Regionais (Polo I a Polo VIII);
   - Matriz de Alocação de Docentes Titulares, Coordenadoras Pedagógicas e Formadoras;
   - Caracterização de Turmas da Educação Infantil (creche, pré-escola, jornada parcial e integral, alunos matriculados e público-alvo da Educação Especial / AEE);
   - Governança de Ciclos Avaliativos Bimestrais e Base Unificada de Dados (SSOT).
2. **Público & Ação Central:**
   - **Coordenadora do Núcleo de EI (Helena):** Governança estratégica de toda a rede municipal, monitoramento de cobertura territorial dos polos, abertura de ciclos e extração SSOT;
   - **Formadoras de Polo (Clarice):** Acompanhamento das UEs e Coordenadoras Pedagógicas sob sua jurisdição territorial;
   - **Coordenadoras Pedagógicas (Mariana Ferreira):** Gestão operacional direta de sua unidade escolar, turmas, lotação de professoras regentes e atualização cadastral.
   - **Uso:** Acessar pelo celular no chão da escola ou em visitas técnicas aos polos para consultar rapidamente turmas, docentes e cobertura, ou no desktop para gestão estrutural.
3. **Tom do Design (Hallmark Floor):**
   - **Sóbrio, Utilitário e Institucional:** Máxima autoridade visual, dignidade governamental, sem elementos infantis artificiais, sem arco-íris de cores e sem estética genérica de IA (AI-slop);
   - **Paleta Contida e Calma:** Base neutra de ardósia (slate neutrals), branco puro de superfície com linhas finas (hairlines), e uso cirúrgico do azul institucional SerTão Criança (`#0066CC`) restrito a ações e estados ativos.
4. **Principais Dores Identificadas no Diagnóstico:**
   - **Excesso de Cores Arbitrárias:** Cores hexadecimais inline soltas (`#0284C7`, `#059669`, `#DC2626`, `#D97706`, `#7C3AED`, `#166534`), badges multicoloridos competindo visualmente e painéis de KPI com 4 cores saturadas simultâneas (azul, verde, roxo e laranja);
   - **Gargalos Críticos de Acesso Mobile:**
     - Barra de sub-abas com rótulos longos que exigem rolagem horizontal cega no celular;
     - Barra de cabeçalho (`#homeGestaoActionsCentral`) com botões secundários pesados de backup que empurram o conteúdo para baixo da primeira dobra na tela do telefone;
     - Tabelas de 5 a 8 colunas forçando rolagem lateral desconfortável em telas pequenas, escondendo botões de ação (como "Editar" e "Visualizar") longe do alcance do polegar;
     - Menus de filtros com 4 seletores que se quebram em blocos desiguais no smartphone;
     - Alvos de toque (touch targets) inferiores a 44px de altura em botões operacionais nas tabelas.

---

## 2. Arquitetura e Pontos de Impacto

### 2.1. Arquivos Envolvidos
1. `css/01_variables.css`: Refinamento de tokens de superfícies e cores semânticas calmas;
2. `css/03_components.css`: Estilização modular de `.pedag-subtab-btn`, `.stat-box-hallmark`, botões de ação e estados `:focus-visible`;
3. `css/04_screens.css`: Regras responsivas mobile (`@media (max-width: 768px)`) para transformação de tabelas em cartões fluídos legíveis, alvos de toque de 44px e barra de sub-abas compacta;
4. `index.html`: Descluttering da barra de ações `#homeGestaoActionsCentral`, simplificação de containers, eliminação de estilos inline coloridos;
5. `js/features/management.js`: Harmonização de badges nas renderizações (`renderUnitsScreen`, `renderClassesScreen`, `renderTeamScreen`), eliminação de cores hexadecimais arbitrárias e garantia de atributos de acessibilidade mobile;
6. `js/audit/audit_engine.js`: Preservação e enriquecimento das asserções automatizadas da tela de Gestão.

---

## 3. Especificação de Implementação Passo a Passo (Snippets Exatos)

### 3.1. Passo 1 — Tokens Semânticos e Paleta Sóbria em `css/01_variables.css`
Substituir o arco-íris saturado por um sistema de tokens institucionais contidos, garantindo conformidade rigorosa com o **Hallmark Floor 1**:

```css
/* =====================================================================
   HALLMARK UI TOKENS — GESTÃO PEDAGÓGICA SÓBRIA & CONTIDA
   ===================================================================== */
:root {
  --gestao-ground: #F8FAFC;
  --gestao-surface: #FFFFFF;
  --gestao-border: #E2E8F0;
  --gestao-border-subtle: #F1F5F9;
  
  /* Textos de Alta Hierarquia e Legibilidade */
  --gestao-text-strong: #0F172A;
  --gestao-text-body: #334155;
  --gestao-text-muted: #64748B;
  
  /* Badges Sóbrios Institucionais (Desaturados e Calmos) */
  --badge-neutral-bg: #F1F5F9;
  --badge-neutral-ink: #334155;
  --badge-neutral-border: #E2E8F0;
  
  --badge-active-bg: #F0FDF4;
  --badge-active-ink: #166534;
  --badge-active-border: #DCFCE7;
  
  --badge-accent-bg: #F0F7FF;
  --badge-accent-ink: #004C99;
  --badge-accent-border: #BFDBFE;
  
  --badge-warning-bg: #FEF9C3;
  --badge-warning-ink: #854D0E;
  --badge-warning-border: #FEF08A;
  
  --badge-danger-bg: #FEF2F2;
  --badge-danger-ink: #991B1B;
  --badge-danger-border: #FEE2E2;
  
  /* Alvo de Toque e Ergonomia Mobile */
  --touch-target-min: 44px;
}
```

### 3.2. Passo 2 — Sub-abas e Controles Operacionais em `css/03_components.css`
Aperfeiçoar a navegação de sub-abas, stat-boxes unificados e foco acessível:

```css
/* Hallmark Navegação Segmentada da Gestão Pedagógica */
.pedag-subtabs-nav {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--gestao-border);
  padding-bottom: 12px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.pedag-subtabs-nav::-webkit-scrollbar {
  display: none;
}

.pedag-subtab-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 40px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  color: var(--gestao-text-muted);
  background: var(--gestao-ground);
  border: 1px solid var(--gestao-border);
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}
.pedag-subtab-btn:hover {
  background: var(--gestao-surface);
  color: var(--gestao-text-strong);
  border-color: #CBD5E1;
}
.pedag-subtab-btn.active {
  background: var(--gestao-surface);
  color: var(--primary);
  border-color: var(--primary);
  box-shadow: var(--shadow-sm);
  font-weight: 700;
}
.pedag-subtab-btn:focus-visible,
.btn:focus-visible,
.form-input:focus-visible,
.form-select:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

/* Stat Boxes Unificados (Sobriedade sem Rainbow Slop) */
.stat-box-hallmark {
  background: var(--gestao-surface);
  border: 1px solid var(--gestao-border);
  border-radius: 8px;
  padding: 14px 16px;
  text-align: left;
}
.stat-label-hallmark {
  font-size: 12px;
  font-weight: 600;
  color: var(--gestao-text-muted);
  line-height: 1.3;
  margin-bottom: 4px;
  text-transform: none; /* Proibido caixa alta forçada */
}
.stat-value-hallmark {
  font-size: 22px;
  font-weight: 800;
  color: var(--gestao-text-strong); /* Cor sóbria única e elegante */
  line-height: 1.2;
}
.stat-value-hallmark.accent,
.stat-value-hallmark.active,
.stat-value-hallmark.purple {
  color: var(--gestao-text-strong); /* Unificação com sobriedade */
}

/* Badges Semânticos Sóbrios */
.badge-hallmark-neutral {
  background: var(--badge-neutral-bg);
  color: var(--badge-neutral-ink);
  border: 1px solid var(--badge-neutral-border);
  font-weight: 600;
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.badge-hallmark-active {
  background: var(--badge-active-bg);
  color: var(--badge-active-ink);
  border: 1px solid var(--badge-active-border);
  font-weight: 600;
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.badge-hallmark-accent {
  background: var(--badge-accent-bg);
  color: var(--badge-accent-ink);
  border: 1px solid var(--badge-accent-border);
  font-weight: 600;
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
```

### 3.3. Passo 3 — Arquitetura de Acessibilidade Mobile em `css/04_screens.css`
Garantir usabilidade mobile fluída, touch targets confortáveis e eliminação de rolagem horizontal excessiva em tabelas no celular:

```css
/* =====================================================================
   HALLMARK RESPONSIVIDADE MOBILE — GESTÃO PEDAGÓGICA (Telas <= 768px)
   ===================================================================== */
@media (max-width: 768px) {
  /* 1. Header e Ações Principais no Celular */
  #homeGestaoView .page-title-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 16px;
  }
  #homeGestaoActionsCentral {
    width: 100%;
    flex-direction: column;
    gap: 8px;
  }
  #homeGestaoActionsCentral .btn {
    width: 100%;
    justify-content: center;
    min-height: var(--touch-target-min);
  }

  /* 2. Sub-abas Otimizadas para Celular (Pills com Rótulos Concetados) */
  .pedag-subtabs-nav {
    display: flex;
    overflow-x: auto;
    gap: 6px;
    padding-bottom: 8px;
    margin-bottom: 16px;
    scroll-snap-type: x mandatory;
  }
  .pedag-subtab-btn {
    min-height: var(--touch-target-min);
    padding: 8px 12px;
    font-size: 12px;
    scroll-snap-align: start;
    flex-shrink: 0;
  }
  /* Ocultação de termos redundantes no mobile mantendo significado */
  .pedag-tab-full-text { display: none; }
  .pedag-tab-mobile-text { display: inline; }

  /* 3. Filtros Empilhados com Largura Total no Celular */
  .gestao-filters-container {
    flex-direction: column;
    align-items: stretch !important;
    gap: 10px !important;
    width: 100%;
  }
  .gestao-filters-container .form-select,
  .gestao-filters-container .form-input {
    width: 100% !important;
    min-height: var(--touch-target-min);
    font-size: 14px !important; /* Previne zoom forçado no Safari iOS */
  }

  /* 4. Transformação Responsiva de Tabelas em Cartões Móveis (Table-to-Card) */
  .responsive-mobile-table thead {
    display: none; /* Oculta cabeçalho tabular em telas pequenas */
  }
  .responsive-mobile-table, 
  .responsive-mobile-table tbody, 
  .responsive-mobile-table tr, 
  .responsive-mobile-table td {
    display: block;
    width: 100%;
  }
  .responsive-mobile-table tr {
    margin-bottom: 14px;
    background: var(--gestao-surface);
    border: 1px solid var(--gestao-border);
    border-radius: 10px;
    padding: 14px;
    box-shadow: var(--shadow-sm);
  }
  .responsive-mobile-table td {
    padding: 6px 0;
    border-bottom: 1px solid var(--gestao-border-subtle);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    text-align: right;
  }
  .responsive-mobile-table td:last-child {
    border-bottom: none;
    padding-top: 10px;
    justify-content: flex-end;
  }
  .responsive-mobile-table td::before {
    content: attr(data-label);
    font-weight: 600;
    color: var(--gestao-text-muted);
    font-size: 12px;
    text-align: left;
    margin-right: 12px;
    flex-shrink: 0;
  }
  /* Primeira célula (Nome da Entidade) destacada no topo do cartão */
  .responsive-mobile-table td:first-child {
    font-size: 15px;
    font-weight: 700;
    color: var(--gestao-text-strong);
    border-bottom: 1px solid var(--gestao-border);
    padding-bottom: 8px;
    margin-bottom: 4px;
    display: block;
    text-align: left;
  }
  .responsive-mobile-table td:first-child::before {
    display: none;
  }
  
  /* Botões de Ação na Linha/Cartão Mobile */
  .responsive-mobile-table .btn {
    min-height: var(--touch-target-min);
    padding: 8px 16px;
    font-size: 13px;
    width: 100%;
  }

  /* 5. Grid de Stat-Boxes em 2 Colunas no Mobile */
  .stat-grid-hallmark {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    gap: 10px !important;
  }
}

@media (min-width: 769px) {
  .pedag-tab-full-text { display: inline; }
  .pedag-tab-mobile-text { display: none; }
  .stat-grid-hallmark {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
```

### 3.4. Passo 4 — Descluttering e Refatoração no `index.html`
1. **Higienização do `#homeGestaoActionsCentral`:**
   - Centralizar a exportação e importação JSON na sub-aba "Extrações & Relatórios SSOT" (`#pedagViewExports`), eliminando a poluição visual repetitiva da barra de título;
   - O botão principal no topo passa a ser exclusivamente: `Ciclos Avaliativos & Calendário` (com SVG de calendário e token semântico calmo);
2. **Sub-abas com Rótulos Responsivos:**
   - Rótulos amigáveis para mobile sem truncamento:
     - `pedagTabUnits`: `<span class="pedag-tab-full-text">Unidades Escolares & Polos</span><span class="pedag-tab-mobile-text">Escolas & Polos</span>`
     - `pedagTabClasses`: `<span class="pedag-tab-full-text">Turmas & Regência Titular</span><span class="pedag-tab-mobile-text">Turmas</span>`
     - `pedagTabTeam`: `<span class="pedag-tab-full-text">Equipes & Servidores da Rede</span><span class="pedag-tab-mobile-text">Servidores</span>`
     - `pedagTabExports`: `<span class="pedag-tab-full-text">Extrações & Relatórios SSOT</span><span class="pedag-tab-mobile-text">Relatórios SSOT</span>`
3. **Erradicação do Card Verde Saturado em `#pedagViewExports`:**
   - O card de backup em `index.html:487` possui estilo inline `background:var(--badge-active-bg);` com botões contrastantes agressivos. Substituir por um container de superfície neutra (`background:var(--gestao-surface); border:1px solid var(--gestao-border);`) com tipografia hierárquica e botões institucionais sóbrios.

### 3.5. Passo 5 — Refinamento Dinâmico em `js/features/management.js`
1. Adicionar os atributos `data-label` em cada célula `<td>` renderizada nas funções:
   - `renderUnitsScreen()`: `data-label="Polo"`, `data-label="Endereço"`, `data-label="Docentes"`, `data-label="Ações"`;
   - `renderClassesScreen()`: `data-label="Unidade"`, `data-label="Alunos"`, `data-label="AEE"`, `data-label="Jornada"`, `data-label="Turno"`, `data-label="Docentes"`, `data-label="Ações"`;
   - `renderTeamScreen()`: `data-label="Cargo"`, `data-label="Lotação"`, `data-label="Polo"`, `data-label="Superior"`, `data-label="Ações"`;
2. Aplicar a classe `.responsive-mobile-table` nas tabelas principais da gestão: `#networkCoverageCard table`, `#unitsDetailedCard table`, `#pedagViewClasses table`, `#pedagViewTeam table`;
3. Substituir a geração de stat-boxes coloridos por stat-boxes sóbrios padronizados e a classe `.stat-grid-hallmark`.

---

## 4. Critérios de Aceite e Roteiro de Teste

### 4.1. Critérios de Aceite Estéticos (Hallmark Standard)
- [ ] **Sobriedade Visual:** Zero ocorrências de cores hexadecimais literais arbitrárias no HTML e JS da gestão; 100% dos estilos consumindo variáveis de tokens declaradas no `:root`;
- [ ] **Fim do Arco-Íris:** Cards de caracterização exibem números em cor ardósia de alto contraste (`--gestao-text-strong`), com rótulos em sentence case destravados;
- [ ] **Alinhamento Hierárquico:** Ausência de cartões aninhados dentro de cartões (Single-Layer Containment);
- [ ] **Ausência de Emojis:** Zero emojis Unicode em botões, tabelas e cabeçalhos; 100% de uso de pictogramas SVG monocromáticos;
- [ ] **Transições Restritas:** Nenhuma ocorrência de `transition: all` nos componentes da gestão.

### 4.2. Critérios de Aceite Mobile (Ergonomia no Celular)
- [ ] **Visualização Móvel Fluída (375px e 414px):** Sub-abas visíveis e confortáveis ao toque, sem quebras de layout ou truncamento ilegível;
- [ ] **Fim da Rolagem Horizontal Cega em Tabelas:** No mobile (<= 768px), cada registro de Unidade, Turma e Servidor se formata como um cartão vertical legível, com todas as ações acessíveis sem necessidade de rolagem lateral;
- [ ] **Alvos de Toque:** Todos os botões interativos e campos de filtro possuem altura mínima de 44px no mobile, facilitando a navegação com uma só mão;
- [ ] **Prevenção de Zoom Acidental no iOS:** Seletores e inputs com `font-size: 14px` no mobile para evitar auto-zoom irritante do WebKit/Safari.

---

## 5. Seção Obrigatória de Auditoria (`audit_platform.py` / `js/audit/audit_engine.js`)

> [!IMPORTANT]
> **Preservação e Blindagem da Suíte de Testes (Tolerância Zero a Regressões):**

### 5.1. Preservação Estrita dos Testes Ativos
1. **Módulo 1 (`navegacao_layout`):**
   - Alternância canônica do `#deskTabHomeLabel` entre "Início" (Mariana Ferreira e Clarice) e "Gestão Pedagógica" (Helena). Mantido 100% intacto;
2. **Módulo 12 (`governanca_subabas`):**
   - Ocultação de `#pedagTabClasses` para Helena (Núcleo de EI) e visibilidade para Mariana;
   - Desvio automático de `switchPedagSubTab('classes')` para `units` no perfil Núcleo de EI. Mantido 100% intacto;
3. **Módulo 20 (`erradicacao_emojis_gestao`):**
   - Validação da ausência de emojis em `#networkCoverageCard`, `#unitsDetailedCard` e `#pedagViewTeam .card`. Mantido 100% intacto.

### 5.2. Novas Asserções Automatizadas Propostas
No `js/audit/audit_engine.js` (Módulo 20 ou Módulo 1):
1. **Asserção de Tokens Hallmark e Ausência de Cores Inline em `#homeGestaoView`:**
   - Validação de que `#homeGestaoView` não possui `background` inline com cores hexadecimais saturadas;
2. **Asserção de Responsividade dos Rótulos de Sub-abas:**
   - Verificação da presença de elementos `.pedag-tab-full-text` e `.pedag-tab-mobile-text` em `#pedagTabUnits` e `#pedagTabTeam`;
3. **Asserção de Alvos de Toque Mobile:**
   - Verificação computada da classe `.responsive-mobile-table` nas tabelas operacionais da gestão.

---

## 6. Parecer Arquitetural Sintético

A aba de Gestão Pedagógica é o coração de governança do SerTão Criança. Atualmente, a riqueza de dados e funcionalidades é prejudicada pelo excesso de cores simultâneas e pelo design focado puramente no desktop, o que gera grande atrito quando formadoras e coordenadoras precisam operá-la pelo celular durante o trabalho de campo nas creches e polos.

A implementação deste plano trará sobriedade institucional digna, reduzindo o ruído visual e transformando a experiência mobile em algo ágil, agradável e profissional.
