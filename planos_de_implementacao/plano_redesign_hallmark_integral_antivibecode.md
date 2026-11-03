# PLANO DE IMPLEMENTAÇÃO — REDESIGN HALLMARK INTEGRAL DA PLATAFORMA: ERRADICAÇÃO DO VISUAL VIBECODE, SOBRIEDADE INSTITUCIONAL E REFINAMENTO DE CORES, ITENS, BOTÕES E CAIXAS

> **Status:** Proposto / Em Análise (Etapa 1 - O Arquiteto)  
> **Data:** 03 de Novembro de 2026  
> **Versão Alvo:** 1.63 (v8.2.27)  
> **Alvo:** Todo o ecossistema visual da plataforma SerTão Criança (`index.html`, `css/01_variables.css`, `css/02_layout.css`, `css/03_components.css`, `css/04_screens.css`, `css/05_modals.css`, `js/core/navigation.js`, `js/features/schedule.js`, `js/features/observation.js`, `js/features/history_notes.js`, cópias espelhadas do Firebase e suíte `audit_platform.py`)  
> **Padrão de Qualidade:** Hallmark Design Standard (v2.0.0 / `RULE[user_global]`)  
> **Objetivo Primário:** Executar uma revisão e um redesenho visual holístico de ponta a ponta na plataforma, expurgando todos os vícios característicos de "vibecode" (protótipo genérico gerado por IA com gradientes neon, cartões dentro de cartões, rótulos forçados em caixa alta com tracking, sombras com brilho colorido, emojis servindo de iconografia, múltiplos raios de borda desconexos e transições globais `transition: all`), estabelecendo uma estética editorial e institucional sóbria, límpida, de alta autoridade técnica governamental e conforto ergonômico para coordenadoras pedagógicas, formadoras e gestoras da Educação Infantil de Patos/PB, preservando rigorosamente (100%) toda a fiação funcional (wiring), nós de dados SSOT, integridade de roteamento e asserções da suíte de auditoria automatizada.

---

## 0. Diretriz de Execução Obrigatória

> [!IMPORTANT]
> **Aviso ao Agente Executor (Etapa 2 - Operário):**  
> Antes de aplicar qualquer alteração de código resultante deste plano, você **DEVE OBRIGATORIAMENTE** ler o manual [`WORKFLOW_MACOS.md`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md) e a skill [`.agents/skills/execucao-operario/SKILL.md`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/.agents/skills/execucao-operario/SKILL.md).  
> 
> - **Trava Crítica da Etapa 1:** Durante a vigência deste plano, nenhum arquivo de código de produção deve ser comitado ou alterado de forma prematura. Ao concluir o planejamento, a árvore de trabalho do Git (`git status`) deve permanecer estritamente limpa em relação a arquivos de código.
> - **Execução Mecânica da Etapa 2:** Na Etapa 2, execute o plano sem improvisações, valide a sintaxe via JSC nativo (`python3 audit_platform.py --check-syntax`), gere o backup intermediário em `intermediárias/aplicativo_v1.63_redesign_hallmark_integral_antivibecode.html`, atualize o changelog duplo (`CHANGELOG.md` e `#modalChangelog` / botão `.btn-changelog` para a Versão 1.63), sincronize as cópias espelhadas do Firebase (`firebase_deploy/public/`), realize o deploy via `git push origin main` e execute a auditoria pós-deploy headless via `python3 audit_platform.py --silent-on-success`.

---

## 1. Diagnóstico e Contexto (The Read — Hallmark Standard)

### 1.1. Material, Público, Uso e Tom Institucional
1. **Material Real do Sistema SerTão Criança:**
   - Instrumentos longitudinais de supervisão pedagógica baseados na Matriz Oficial de Educação Infantil de Patos/PB (Campos de Experiências, Direitos de Aprendizagem, Dimensões de Organização do Espaço, Rotina, Planejamento e Interações);
   - Gestão operacional de creches e pré-escolas (Unidades Escolares), polos territoriais, turmas regulares e de tempo integral, equipes de regência titular e coordenação pedagógica;
   - Indicadores de cobertura bimestral, prioridades pedagógicas, distribuição da escala de materiais e semáforos diagnósticos de apoio à tomada de decisão;
   - Histórico oficial de observações, registros formativos de campo e relatórios em PDF para impressão.
2. **Público & Ação Central:**
   - **Coordenadoras Pedagógicas e Formadoras do Núcleo de Educação Infantil:** Profissionais técnicas que utilizam a ferramenta tanto em mesas de trabalho (computadores na secretaria escolar) quanto ativamente em circulação e acompanhamento direto das salas de aula e creches (smartphones e tablets).
   - **Uso Central:** Registrar observações pedagógicas com agilidade, acompanhar o cumprimento do cronograma bimestral e tomar decisões de intervenção formativa com dados claros e confiáveis.
3. **Tom do Design (Hallmark Floor):**
   - **Institucional, Utilitário e Sóbrio:** Ausência de firulas visuais, efeitos infantis ou estética de brinquedo. Um instrumento público e pedagógico sério precisa transmitir confiabilidade, precisão e tranquilidade.
   - **Editorial & Restrained:** Hierarquia tipográfica marcante, contrastes precisos em tons neutros de ardósia (slate), superfícies brancas com separadores sutis em hairline, e um único tom de acento azul institucional restrito a menos de 5% da área visual útil.

---

### 1.2. O Inventário das 6 Patologias do "Vibecode" Encontradas no Código

A auditoria visual minuciosa em `index.html`, `css/` e `js/` evidenciou 6 padrões recorrentes que caracterizam a estética de código gerado por IA sem curadoria artesanal ("vibecode / AI slop"):

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        MAPA DAS 6 PATOLOGIAS DO VIBECODE NO PROJETO                    │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. Gradientes Neon & Sombras Glow: Fundo 135deg azul elétrico e sombras com cor        │
│ 2. Síndrome da "Caixa dentro de Caixa": Contêiner card > sub-card > caixa com borda    │
│ 3. Anarquia Geométrica: border-radius de 4px, 6px, 8px, 9px, 10px, 12px, 14px, 20px    │
│ 4. Rótulos em Caixa Alta Rastreada: .form-label e <th> forçados em UPPERCASE com track │
│ 5. Iconografia por Emojis & Setas Coladas: 📝, 🗓️, ⚠️, 💡, 🖨️ e botões com "Texto →"  │
│ 6. `transition: all` & Inconsistência de Botões: Janks de layout e falta de :focus-vis │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Patologia 1: Gradientes Neon Genéricos e Sombras Coloridas com Glow
- **Onde ocorre:**
  - `.hero-banner` em `02_layout.css:113`: `background: linear-gradient(135deg, #0066CC 0%, #004C99 100%)`.
  - `.brand-logo` em `01_variables.css:201`: `background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)` com sombra neon `box-shadow: 0 2px 5px rgba(0,102,204,0.3)`.
  - `.next-visit-hero-card` em `04_screens.css:915`: `background: linear-gradient(135deg, #FFFFFF 0%, #F0F7FF 100%)` com sombra `box-shadow: 0 4px 14px rgba(37, 99, 235, 0.08)`.
  - `#homeOpManagementCard .card` em `index.html:187`: `background: linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)`.
- **Por que é vibecode:** É a assinatura clássica de templates de IA (2023-2024). Em softwares profissionais modernos de gestão (como Linear, Stripe, Gov.br), cards utilizam superfícies puras (`#FFFFFF` ou tons ligeiramente neutros), bordas sutis e sombras neutras de oclusão de ambiente (`rgba(15, 23, 42, 0.04)`), nunca gradientes diagonais de saturação artificial.
- **Violação Hallmark:** Floor 11 ("Never a purple-to-blue gradient"), Gate 2a, Gate 29 ("glow shadows").

#### Patologia 2: Síndrome da "Caixa dentro de Caixa" (Card Inside Card)
- **Onde ocorre:**
  - Tela Inicial (`screenHome`): Contêineres de rascunhos e observações agendadas renderizam `.card` dentro de seções que já possuem bordas e fundos.
  - Tela de Observação Ativa (`screenActiveObs`): `.crit-card` abriga o grupo de botões de escala `.scale-4col-group`, contêiner de comentários pontilhados e barra de fotos, cada um com borda e raio próprio.
  - Tela de Indicadores (`screenIndicators`): Acordeões de drill-down (`.drilldown-group` > `.drilldown-subgroup` > `.drilldown-sub-item`) aninham 3 níveis de caixas com bordas cinzas e fundos intercalados (`#FFFFFF`, `#F8FAFC`, `#EDF2F7`, `#E2E8F0`).
- **Por que é vibecode:** O assistente de IA, ao organizar informações, cria reflexivamente uma nova caixa com borda para cada sub-item. Isso fragmenta a página e gera "ruído de bordas" (border noise).
- **Violação Hallmark:** Floor 11 ("Never a card inside a card"), Gate 4, Gate 9 (Surface ladder).

#### Patologia 3: Anarquia Geométrica e Dispersão de Raios de Borda (`border-radius`)
- **Onde ocorre:**
  - Há nada menos que **9 raios de borda concorrentes** no CSS:
    - 4px (`.subdim-accordion-header`), 6px (`.crit-tag`, `.photo-thumb-wrapper`), 7px (`.history-toggle-btn`), 8px (`.nav-link`, `.btn-changelog`, `.form-control`, `.scale-4col-group`), 9px (`.btn`, `.brand-logo`), 10px (`.draft-card`, `.dim-tab-btn`, `.pedag-subtab-btn`), 12px (`--radius`, `.kpi-anchor-card`, `.crit-card`), 14px (`.next-visit-hero-card`), 16px (`.modal-panel`, `.fab-menu-panel`), 20px (`.role-badge-btn`, `.next-visit-title-badge`).
- **Por que é vibecode:** Falta de um sistema de design coeso (Design System tokens). O código foi construído incrementalmente com palpites ad-hoc de raio.
- **Violação Hallmark:** Floor 15 ("One radius per nesting level, concentric radii").

#### Patologia 4: Rótulos e Títulos em Caixa Alta Forçada com Tracking (All-Caps Labels)
- **Onde ocorre:**
  - `04_screens.css:278`: `.form-label { text-transform: uppercase; letter-spacing: 0.3px; }`
  - `04_screens.css:32`: `.ue-executive-table th { text-transform: uppercase; letter-spacing: 0.4px; }`
  - `04_screens.css:943`: `.next-visit-title-badge { text-transform: uppercase; letter-spacing: 0.8px; }`
  - `01_variables.css:221`: `.brand-text span { text-transform: uppercase; letter-spacing: 0.4px; }`
  - `index.html:155`: `<span id="btnNewObsText">NOVA OBSERVAÇÃO</span>`
  - `index.html:791`: `INICIAR INSTRUMENTO DE OBSERVAÇÃO →`
- **Por que é vibecode:** Rótulos em caixa alta com espaçamento de letras ("tracked caps") são a tentativa genérica da IA de fazer uma interface parecer "técnica" ou "moderna", mas criam fadiga de leitura e aspecto datado.
- **Violação Hallmark:** Floor 9 ("Never an eyebrow, and never a label in tracked capitals or small caps: labels, captions, table heads, tags and nav links are the body face, a step smaller, sentence or lower case, untracked"), Gate 54, Gate 67.

#### Patologia 5: Iconografia Primária por Emojis e Setas Coladas no Texto
- **Onde ocorre:**
  - `index.html:162`: `📝 Meus Rascunhos em Andamento (0)`
  - `index.html:173`: `🗓️ Minhas Próximas Observações Agendadas`
  - `index.html:700`: `💡 Selecionar uma observação preenche automaticamente...`
  - `index.html:725`: `👩‍🏫 Equipe de Regência Titular da Turma`
  - `index.html:739`: `🌟 Turma em Tempo Integral`
  - `index.html:846`: `🖨️ Exportar em PDF`
  - `index.html:180`: `Ver Cronograma Completo →` (seta colada)
  - `index.html:856`: `Ir para o Primeiro Item Pendente →` (seta colada)
  - `js/core/navigation.js:221-225`: `● Prevista para Hoje` (ponto decorativo de status), `⚠ Em Atraso`, `🗓️ Prevista`
- **Por que é vibecode:** Emojis renderizam de forma completamente diferente entre Windows, Android, macOS e Linux, quebrando a seriedade de um sistema de gestão educacional.
- **Violação Hallmark:** Floor 10 ("Never middle-dot-joined meta strings, arrows glued to link text, or decorative status dots"), Floor 11 ("Never an emoji as an icon").

#### Patologia 6: `transition: all` e Inconsistência nos Botões e Foco Acessível
- **Onde ocorre:**
  - 10 ocorrências de `transition: all` espalhadas em `02_layout.css` (linhas 35, 208, 304), `04_screens.css` (linhas 206, 629, 645, 676, 1104) e `05_modals.css` (linhas 121, 167).
  - Botões com alturas, preenchimentos e pesos díspares sem hierarquia padronizada.
  - `:focus-visible` restrito a poucos seletores, deixando dezenas de botões e links sem retorno de foco por teclado.
- **Por que é vibecode:** `transition: all` causa repaints custosos e jank visual ao animar propriedades de layout.
- **Violação Hallmark:** Floor 2 ("Never transition: all"), Floor 6 ("Every interactive element has :focus-visible, appearing instantly").

---

## 2. A Nova Arquitetura Visual Hallmark (Antivibecode System)

### 2.1. O Novo Sistema de Tokens Globais (`:root` em `01_variables.css`)

Substituição da mistura caótica de cores hexadecimais soltas por uma escala de tokens semânticos concisos:

```css
/* =========================================================================
   HALLMARK DESIGN TOKENS — SERTÃO CRIANÇA (INSTITUCIONAL & ANTIVIBECODE)
   ========================================================================= */
:root {
  /* 1. Superfícies & Fundos (Paper Layer) */
  --bg-ground: #F8FAFC;             /* Fundo geral da página (slate 50) */
  --bg-surface: #FFFFFF;            /* Cartões e painéis primários */
  --bg-surface-subtle: #F1F5F9;     /* Bandas neutras e cabeçalhos de tabela (slate 100) */
  --bg-surface-hover: #EDF2F7;      /* Hover sutil de linhas e itens de menu */
  
  /* 2. Tintas & Tipografia de Alta Densidade (Ink Layer) */
  --ink-primary: #0F172A;           /* Texto principal de títulos e números (slate 900) */
  --ink-body: #334155;              /* Corpo de texto e descrições (slate 700) */
  --ink-muted: #64748B;             /* Rótulos, metadados e legendas (slate 500) */
  --ink-subtle: #94A3B8;            /* Placeholders e elementos inativos (slate 400) */

  /* 3. Hairlines & Divisores Estruturais (Rule Layer) */
  --border-rule: #E2E8F0;           /* Bordas de cartões e inputs (slate 200) */
  --border-subtle: #F1F5F9;         /* Divisores internos entre itens de lista */
  --border-focus: #0066CC;          /* Anel de foco acessível instantâneo */

  /* 4. Acento Institucional SerTão Criança (< 5% Footprint) */
  --brand-primary: #0066CC;         /* Azul institucional sóbrio */
  --brand-primary-hover: #004C99;   /* Hover do botão primário */
  --brand-primary-ink: #FFFFFF;     /* Texto do botão primário */
  --brand-accent-tint: #EFF6FF;     /* Fundo de seleção ativa suave (blue 50) */
  --brand-accent-ink: #1D4ED8;      /* Texto de item ativo selecionado */

  /* 5. Semáforo Pedagógico Calmo (Quiet Badges & Rating Scale) */
  --sem-green-bg: #F0FDF4;          /* Consistente / Concluído (Fundo) */
  --sem-green-rule: #DCFCE7;        /* Consistente / Concluído (Borda) */
  --sem-green-ink: #166534;         /* Consistente / Concluído (Texto) */

  --sem-amber-bg: #FEF9C3;          /* Parcial / Em Atenção (Fundo) */
  --sem-amber-rule: #FEF08A;        /* Parcial / Em Atenção (Borda) */
  --sem-amber-ink: #854D0E;         /* Parcial / Em Atenção (Texto) */

  --sem-red-bg: #FEF2F2;            /* Não Realizado / Em Atraso (Fundo) */
  --sem-red-rule: #FEE2E2;          /* Não Realizado / Em Atraso (Borda) */
  --sem-red-ink: #991B1B;           /* Não Realizado / Em Atraso (Texto) */

  --sem-neutral-bg: #F8FAFC;        /* Não Se Aplica (NA) / Futuro (Fundo) */
  --sem-neutral-rule: #E2E8F0;      /* Não Se Aplica (NA) / Futuro (Borda) */
  --sem-neutral-ink: #475569;       /* Não Se Aplica (NA) / Futuro (Texto) */

  /* 6. Escala Modular de Raios Concêntricos (Concentric Radii System) */
  --radius-sm: 6px;                 /* Micro-badges, tags e inputs menores */
  --radius-md: 8px;                 /* Botões, inputs, cards internos e dropdowns */
  --radius-lg: 12px;                /* Cartões primários, painéis e modais */
  --radius-full: 9999px;            /* Badges circulares calmos exclusivos */

  /* 7. Elevação Sutil & Sombras de Oclusão Ambiente Neutras (Zero Glow) */
  --shadow-flat: none;
  --shadow-hairline: 0 1px 2px rgba(15, 23, 42, 0.04);
  --shadow-panel: 0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04);
  --shadow-modal: 0 12px 28px -4px rgba(15, 23, 42, 0.12), 0 4px 8px -2px rgba(15, 23, 42, 0.04);

  /* 8. Ergonomia e Acessibilidade (Touch Targets & Timings) */
  --touch-target: 44px;
  --dur-fast: 0.12s;
  --dur-base: 0.18s;
  --ease-standard: cubic-bezier(0.16, 1, 0.3, 1);
}
```

---

### 2.2. O Novo Padrão Estrutural por Componente

#### A. Barra Superior e Identidade da Marca (`.navbar` & `.navbar-brand`)
- **Antes:** `.brand-logo` com gradiente diagonal forte `#0066CC` a `#004C99`, sombra neon azul e texto com caixa alta forçada (`SUPERVISÃO PEDAGÓGICA`).
- **Depois:** Logo limpo, tipografia institucional elegante em sentence case (`Supervisão pedagógica`), botões de navegação com altura proporcional, `:focus-visible` nítido de 2px e hover suave exclusivamente em `background-color` e `color`.

#### B. Tela Inicial (`screenHome`): O Fim do Banner AI e Listas Rasas
- **Hero Banner:**
  - Substituir o gradiente saturado por um **bloco editorial institucional sóbrio**: fundo branco com borda sólida elegante (`border: 1px solid var(--border-rule)`) ou fundo de alto contraste slate profundo (`#0F172A`), com tipografia nítida.
  - Botão de ação: texto em *sentence case* `Nova observação` (abandonando o gritante `NOVA OBSERVAÇÃO`), com ícone vetorial SVG integrado.
- **Rascunhos em Andamento (`#homeDraftsSection`):**
  - Remover emoji `📝` do cabeçalho.
  - Transformar a lista de rascunhos em uma **tabela/lista rasa com separadores hairline** (single-layer containment), eliminando cartões arredondados flutuantes com sombras dentro de cartões.
- **Próximas Observações Agendadas (`#homeScheduledSection`):**
  - Remover emoji `🗓️` e a seta colada `Ver Cronograma Completo →` (usar ícone SVG alinhado).
  - Cards de agendamento convertidos para estilo institucional com pílulas de status calmas (`Prevista para hoje`, `Em atraso`), sem pontos decorativos `●` ou emojis de exclamação `⚠️`.

#### C. Tela de Observação Ativa (`screenActiveObs`): O Instrumento Técnico
- **Cartões de Critérios (`.crit-card`):**
  - Eliminar o aspecto de "bloco grosso colorido". O cartão passa a ser uma folha técnica de preenchimento com borda hairline suave.
  - Botões de Escala (`.scale-4col-group` e `.scale-opt`): Em vez de colorir os botões ativos com verde, amarelo e vermelho berrantes e texto em preto/branco com alto contraste estridente, aplicar o semáforo calmo (`var(--sem-green-bg)`, `var(--sem-green-ink)`, `var(--sem-green-rule)`). O resultado visual transforma um "painel de brinquedo" em um formulário técnico rigoroso de avaliação.
  - Remover emojis residuais (`ℹ️`, `☀️`).

#### D. Controles de Formulário e Entradas de Dados (`.form-control`, `.form-label`)
- **Rótulos (`.form-label`):** Extinção do `text-transform: uppercase; letter-spacing: 0.3px;`. Os rótulos passam a ter peso 600, tamanho 13px, cor `var(--ink-body)`, em *sentence case*.
- **Campos de Texto e Seletores:** Altura ergonômica consistente de 40px/42px, `border-radius: var(--radius-md)` (8px), padding-left de 14px, anel de foco acessível instantâneo sem atraso de animação.

#### E. Modais e Janelas Suspensas (`.modal-panel`)
- Padronização dos mais de 25 modais para uma anatomia uniforme:
  - Painel com raio de 12px/16px, sombra neutra suave de oclusão (`var(--shadow-modal)`), fundo branco puro.
  - Cabeçalho estruturado com título em 16px negrito, subtítulo explicativo quando necessário e botão fechar discreto.
  - Erradicação de `style="background:#0F172A;"` cru em modais de login e substituição por classes semânticas.

---

## 3. Especificação de Implementação Passo a Passo (Snippets Exatos)

### 3.1. Arquivo `css/01_variables.css`: Blindagem do Floor e Tokens Universais

```css
/* =========================================================================
   HALLMARK FLOOR & DESIGN TOKENS (v2.0.0 — NON-NEGOTIABLE CORE)
   ========================================================================= */

/* Hallmark Floor 4: overflow-x: clip no html e body (proibido hidden e 100vw) */
html {
  width: 100%;
  overflow-x: clip;
  overscroll-behavior-x: none;
  touch-action: pan-y;
  -webkit-text-size-adjust: 100%;
}

body {
  background: var(--bg-ground);
  color: var(--ink-primary);
  min-height: 100vh;
  width: 100%;
  overflow-x: clip;
  overscroll-behavior-x: none;
  touch-action: pan-y;
  display: flex;
  flex-direction: column;
  position: relative;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-feature-settings: "cv02", "cv03", "cv04", "cv11";
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

/* Hallmark Floor 6: Foco Acessível Instantâneo Universal */
:focus-visible {
  outline: 2px solid var(--border-focus) !important;
  outline-offset: 2px !important;
  transition: none !important;
}

/* Hallmark Floor 7: Redução de Movimento Acessível */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

### 3.2. Arquivo `css/02_layout.css`: Erradicação de `transition: all`, Hero Banner Sóbrio e Escala

#### 1. Extinção de `transition: all` no `.btn` e Botões
```css
/* ANTES (Vibecode):
.btn {
  ...
  transition: all 0.15s ease;
}
*/

/* DEPOIS (Hallmark Standard): */
.btn {
  padding: 8px 16px;
  min-height: 38px;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
  box-sizing: border-box;
  transition: background-color var(--dur-fast) var(--ease-standard), 
              border-color var(--dur-fast) var(--ease-standard), 
              color var(--dur-fast) var(--ease-standard), 
              box-shadow var(--dur-fast) var(--ease-standard);
}
.btn-primary { 
  background: var(--brand-primary); 
  color: var(--brand-primary-ink); 
  border-color: var(--brand-primary); 
}
.btn-primary:hover { 
  background: var(--brand-primary-hover); 
  border-color: var(--brand-primary-hover); 
}
.btn-secondary { 
  background: var(--bg-surface); 
  color: var(--ink-body); 
  border-color: var(--border-rule); 
}
.btn-secondary:hover { 
  background: var(--bg-surface-subtle); 
  color: var(--ink-primary);
  border-color: #CBD5E1; 
}
```

#### 2. Hero Banner Sóbrio e Institucional
```css
/* ANTES (Vibecode):
.hero-banner {
  background: linear-gradient(135deg, #0066CC 0%, #004C99 100%);
  color: #fff;
  border-radius: var(--radius);
  padding: 24px;
  ...
}
*/

/* DEPOIS (Hallmark Editorial Institucional): */
.hero-banner {
  background: #0F172A; /* Slate 900 profundo e autoritário */
  color: #FFFFFF;
  border: 1px solid #1E293B;
  border-radius: var(--radius-lg);
  padding: 22px 24px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: var(--shadow-panel);
}
@media (min-width: 640px) {
  .hero-banner {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
.hero-text h2 { 
  font-size: 19px; 
  font-weight: 700; 
  letter-spacing: -0.02em;
  color: #F8FAFC; 
}
.hero-text p { 
  font-size: 13px; 
  color: #94A3B8; 
  margin-top: 4px; 
  font-weight: 400; 
}
.hero-btn { 
  background: #FFFFFF; 
  color: #0F172A; 
  font-weight: 600; 
  border: 1px solid #FFFFFF; 
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); 
}
.hero-btn:hover { 
  background: #F1F5F9; 
  color: #0F172A; 
}
```

#### 3. Critérios de Avaliação e Botões de Escala Semáforo Calmo
```css
/* Cartão de Critério Limpo */
.crit-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-rule);
  border-radius: var(--radius-lg);
  padding: 18px 20px;
  margin-bottom: 14px;
  box-shadow: var(--shadow-hairline);
  transition: border-color var(--dur-fast) var(--ease-standard);
}
.crit-card.unanswered {
  border-left: 3px solid var(--sem-amber-ink);
}

/* Escala 4 Colunas Calma e Técnica */
.scale-4col-group {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--border-rule);
  max-width: 640px;
  width: 100%;
}
.scale-opt {
  padding: 9px 8px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--ink-muted);
  background: var(--bg-surface);
  border: none;
  border-right: 1px solid var(--border-rule);
  cursor: pointer;
  transition: background-color var(--dur-fast) var(--ease-standard), 
              color var(--dur-fast) var(--ease-standard);
}
.scale-opt:last-child { border-right: none; }
.scale-opt:hover { background: var(--bg-surface-subtle); color: var(--ink-primary); }

/* Estados Ativos com Semáforo Calmo */
.scale-opt.active-consistent { 
  background: var(--sem-green-bg); 
  color: var(--sem-green-ink); 
  font-weight: 700;
  box-shadow: inset 0 0 0 1px var(--sem-green-rule);
}
.scale-opt.active-partial { 
  background: var(--sem-amber-bg); 
  color: var(--sem-amber-ink); 
  font-weight: 700;
  box-shadow: inset 0 0 0 1px var(--sem-amber-rule);
}
.scale-opt.active-notdone { 
  background: var(--sem-red-bg); 
  color: var(--sem-red-ink); 
  font-weight: 700;
  box-shadow: inset 0 0 0 1px var(--sem-red-rule);
}
.scale-opt.active-na { 
  background: var(--sem-neutral-bg); 
  color: var(--sem-neutral-ink); 
  font-weight: 700;
  box-shadow: inset 0 0 0 1px var(--sem-neutral-rule);
}
```

---

### 3.3. Arquivo `css/04_screens.css`: Extinção de All-Caps em Rótulos e Tabelas

```css
/* Rótulos de Formulário: Sentence Case, Untracked (Hallmark Floor 9) */
.form-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  text-transform: none !important; /* Erradicado uppercase */
  letter-spacing: normal !important; /* Erradicado tracking */
  color: var(--ink-body);
  margin-bottom: 6px;
}

/* Cabeçalhos de Tabelas: Sentence Case, Neutros e Límpidos */
.ue-executive-table th,
.data-table th,
.semaphore-table th {
  background: var(--bg-surface-subtle);
  color: var(--ink-muted);
  font-weight: 600;
  text-transform: none !important; /* Erradicado uppercase */
  letter-spacing: normal !important;
  font-size: 12px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border-rule);
  text-align: left;
}

/* Próxima Observação no Cronograma: Fim do Gradiente e Glow */
.next-visit-hero-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-rule);
  border-left: 4px solid var(--brand-primary);
  border-radius: var(--radius-lg);
  padding: 18px 20px;
  margin-bottom: 20px;
  box-shadow: var(--shadow-hairline);
}
.next-visit-title-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: normal;
  text-transform: none; /* Sentence case */
  color: var(--brand-accent-ink);
  background: var(--brand-accent-tint);
  padding: 3px 10px;
  border-radius: var(--radius-full);
}
```

---

### 3.4. Higienização no `index.html`: Erradicação de Emojis e Setas Coladas

| Linha Original em `index.html` | Conteúdo Anterior (Vibecode) | Novo Conteúdo Hallmark (Institucional) |
| :--- | :--- | :--- |
| **Linha 155** | `<span id="btnNewObsText">NOVA OBSERVAÇÃO</span>` | `<span id="btnNewObsText">Nova observação</span>` |
| **Linha 162** | `<h3 ... id="homeDraftsHeader">📝 Meus Rascunhos em Andamento (0)</h3>` | `<h3 ... id="homeDraftsHeader">Meus rascunhos em andamento (0)</h3>` |
| **Linha 173** | `<span>🗓️ Minhas Próximas Observações Agendadas</span>` | `<span>Minhas próximas observações agendadas</span>` |
| **Linha 180** | `<button ...>Ver Cronograma Completo →</button>` | `<button ...>Ver cronograma completo</button>` |
| **Linha 700** | `💡 Selecionar uma observação preenche automaticamente...` | `Selecionar uma observação preenche automaticamente...` |
| **Linha 725** | `👩‍🏫 Equipe de Regência Titular da Turma` | `Equipe de regência titular da turma` |
| **Linha 739** | `<span>🌟</span> <span>Turma em Tempo Integral...</span>` | `<span>Turma em tempo integral...</span>` |
| **Linha 791** | `INICIAR INSTRUMENTO DE OBSERVAÇÃO →` | `Iniciar instrumento de observação` |
| **Linha 809** | `<div id="activeObsIntegralIcon">☀️</div>` | *(Substituído por ícone SVG solar monocromático)* |
| **Linha 846** | `<button ...>🖨️ Exportar em PDF</button>` | `<button ...><svg class="btn-icon">...</svg> Exportar em PDF</button>` |
| **Linha 856** | `<button ...>Ir para o Primeiro Item Pendente →</button>` | `<button ...>Ir para o primeiro item pendente</button>` |

---

### 3.5. Higienização Dinâmica em `js/core/navigation.js` e `js/features/`

Atualização das funções que geram strings HTML dinâmicas com emojis ou pontos decorativos:
```javascript
// js/core/navigation.js: Linhas 221-225
// ANTES (Vibecode):
badgeHtml = `<span style="... background:#DCFCE7; ...">● Prevista para Hoje</span>`;
badgeHtml = `<span style="... background:#FEE2E2; ...">⚠ Em Atraso (${formatDateBR(s.plannedDate)})</span>`;
badgeHtml = `<span style="... background:#EFF6FF; ...">🗓️ Prevista (${formatDateBR(s.plannedDate)})</span>`;

// DEPOIS (Hallmark Quiet Badges):
badgeHtml = `<span class="status-pill-subtle pill-green">Prevista para hoje</span>`;
badgeHtml = `<span class="status-pill-subtle pill-red">Em atraso (${formatDateBR(s.plannedDate)})</span>`;
badgeHtml = `<span class="status-pill-subtle pill-neutral">Prevista (${formatDateBR(s.plannedDate)})</span>`;
```

---

## 4. Critérios de Aceite e Roteiro de Teste

### 4.1. Checklist de Conformidade com o Hallmark Floor
- [ ] **Floor 1 (Tokens First):** 100% das cores e fontes declaradas via variáveis CSS no `:root` de `01_variables.css`. Zero cores arbitrárias soltas em seletores chave.
- [ ] **Floor 2 (Transitions):** Nenhuma ocorrência de `transition: all` no CSS (0 encontradas). Animações de layout restritas estritamente a `transform` e `opacity`.
- [ ] **Floor 3 (Typography):** Nenhuma palavra em itálico isolada em títulos.
- [ ] **Floor 4 (Viewport):** `overflow-x: clip` aplicado em `html` e `body` (sem `hidden`, sem `100vw`).
- [ ] **Floor 6 (Foco Acessível):** `:focus-visible` aplicado e visível em todos os elementos interativos (`button`, `a`, `input`, `select`, `textarea`).
- [ ] **Floor 7 (Motion Fallback):** `@media (prefers-reduced-motion: reduce)` cobrindo todas as animações com duração zero.
- [ ] **Floor 9 (All-Caps Ban):** Zero rótulos, cabeçalhos de tabela ou botões em caixa alta forçada com tracking.
- [ ] **Floor 10 (Anti-Slop):** Zero pontos decorativos de status `●` e setas coladas em textos de botões.
- [ ] **Floor 11 (Anti-Slop):** Zero gradientes neon roxo/azul, zero cartões aninhados dentro de cartões e zero emojis utilizados como iconografia.

### 4.2. Roteiro de Teste Visual e Funcional
1. **Navegação Completa por Todas as Abas:**
   - Início (`home`), Cronograma (`schedule`), Painel & Indicadores (`indicators`), Histórico (`history`), Registros Formativos (`notes`), Matrizes de Referência (`refDocs`) e Gestão da Escola / Polo (`opManagement`).
   - Verificar ausência de quebras visuais, ausência de transbordamento horizontal e consistência na densidade da informação.
2. **Ciclo de Observação Ativa (`screenActiveObs`):**
   - Abrir uma observação em rascunho ou iniciar nova observação.
   - Alternar entre dimensões na barra superior/inferior.
   - Pressionar botões da escala (`Consistente`, `Parcial`, `Não Realizado`, `NA`) e atestar que a coloração semântica é calma, nítida e sem ofuscar a leitura dos critérios.
3. **Modais e Formulários:**
   - Abrir e fechar `#modalRole`, `#modalChangelog`, `#modalProfile`, `#modalAddSchedule`, `#modalAuditReport`.
   - Testar navegação por teclado (Tab e Shift+Tab) e confirmar anel de foco instantâneo de 2px.

---

## 5. Seção Obrigatória de Auditoria (`audit_platform.py` e `js/audit/audit_engine.js`)

> [!CRITICAL]
> **Preservação Absoluta das Asserções da Suíte de Testes:**  
> A suíte determinística de 12 módulos de teste em `js/audit/audit_engine.js` inspeciona o DOM em busca de identificadores, classes e nós específicos. Nenhuma alteração visual pode alterar ou remover esses contratos.

### 5.1. Mapeamento dos Contratos de Teste Preservados Intactos:
1. **Módulo 12 (`navegacao_layout`):**
   - `.btn-changelog`: Deve existir e exibir a versão ativa no texto.
   - `#deskTabHomeLabel`: Deve existir como nó de texto intacto.
   - Higienização terminológica do Pilar 6: Proibição estrita da palavra "visita" em `#homeScheduledHeader`, `#scheduleModalTitle`, `#scheduleFilterStatus` e `.btn-add-schedule` (todas as menções continuam utilizando "observação").
   - Ergonomia de Critérios: `.btn-crit-detail-trigger` deve possuir `min-height: 32px`.
   - Visibilidade de Mídia: Preservação obrigatória das regras `.crit-text-desktop` e `.crit-text-mobile` (inline no desktop, none no mobile e vice-versa sob `@media (max-width: 768px)`).
   - Padronização de `.form-control` e `.form-select`: `box-sizing: border-box`, `padding-left >= 12px`, `border-radius >= 6px`.
   - Asserção anti-tela branca (WSOD): Exatamente 1 `.app-screen.active` com altura positiva.
   - Preservação da ordem canônica de abas no desktop: `#deskTabHome` precedendo `#deskTabOpManagement`.
   - Reatividade de despacho de cliques: `#btnNewObsHero` deve acionar a abertura do setup/modal de agendamento e `#headerAvatarBtn` deve abrir `#modalProfile`.
2. **Módulo 1 (`auth_rbac`), Módulo 3 (`setup_longitudinal`), Módulo 4 (`rubricas_observacao`):**
   - Classes `.scale-opt`, `.active-consistent`, `.active-partial`, `.active-notdone`, `.active-na` rigorosamente mantidas.
   - Identificadores `#btnNewObsHero`, `#btnStartObsSubmit`, `#btnNewObsText` rigorosamente mantidos.

### 5.2. Pré-Voo Sintático e Pós-Deploy Headless:
- **Pré-Voo Obrigatório:** Execução de `python3 audit_platform.py --check-syntax` validando a integridade sintática do JavaScript antes de qualquer commit.
- **Pós-Deploy Obrigatório:** Execução de `python3 audit_platform.py --silent-on-success` após o push no GitHub Pages. Se a auditoria for 100% aprovada, reportar concisamente o sucesso da entrega sem loops desnecessários.
