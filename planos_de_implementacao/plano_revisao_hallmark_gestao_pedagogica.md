# PLANO DE IMPLEMENTAÇÃO — REVISÃO E ADEQUAÇÃO HALLMARK DA ABA DE GESTÃO PEDAGÓGICA

> **Status:** Proposto / Em Análise (Etapa 1 - Arquiteto)  
> **Data:** 28 de Outubro de 2026  
> **Alvo:** Aba de Gestão Pedagógica / Gestão da Rede / Gestão Operacional (`#homeGestaoView`, sub-abas `#pedagViewUnits`, `#pedagViewClasses`, `#pedagViewTeam`, `#pedagViewExports` e scripts correlatos em `js/features/management.js`, `js/core/navigation.js`, `js/core/rbac.js`, `css/`)  
> **Padrão de Qualidade:** Hallmark Design Standard (v2.0.0 / `RULE[user_global]`)  
> **Nível de Profundidade Proposto:** Full App Screen Redesign (Preservando 100% dos dados SSOT, wiring de eventos, modais e regras de negócio)

---

## 1. The Read (Diagnóstico em Quatro Linhas — Hallmark Standard)

1. **Para que serve a tela (Público & Ação Principal):** É a central operacional e estratégica de governança da educação infantil de Patos-PB, utilizada pela Coordenadora do Núcleo de EI (visão de Rede), Formadoras (visão de Polo Regional) e Coordenadoras Pedagógicas (visão da Unidade Escolar) para gerenciar o catálogo territorial de UEs, alocação de servidores, enturmação de crianças (regular e AEE) e extração unificada de dados (SSOT).
2. **O que funciona e DEVE ser preservado:** A integridade matemática e reativa do motor SSOT (`getSchoolClassesAggregates`, `getPoloClassesAggregates`, `getNetworkClassesAggregates`), os modais de cadastro e edição (`openAddUnitModal`, `openEditUnitModal`, `openAddClassModal`, `openEditClassModal`, `openAddTeacherModal`, `openAddUserModal`), os fluxos de sincronização de credenciais (`syncUserToAuthDb`), os downloads em CSV/JSON e todos os IDs e ganchos de auditoria automatizada.
3. **O que soa gerado / Slop de IA (Tells identificados pelos Gates):** 
   - Proliferação massiva de cores hexadecimais literais fora do bloco de tokens (`#0284C7`, `#059669`, `#DC2626`, `#166534`, `#1E40AF`, `#6D28D9`, etc.) gerando "arco-íris semântico" arbitrário;
   - Aninhamento repetitivo de cards em até 3 níveis (`card` dentro de `card` dentro de painel com borda);
   - Emojis residuais atuando como ícones nos botões e tabelas (`🏢`, `✏️`, `👁️`, `✉️`, `🏫`, `🗺️`, `🏛️`);
   - Rótulos de métricas em caixa alta forçada (`text-transform: uppercase`), violando o Gate 67;
   - Pontuação de template (`Acessar Gestão da Escola →`, bullets e setas coladas ao texto);
   - Transições genéricas proibidas (`transition: all`) e ausência total de `:focus-visible` e media query `prefers-reduced-motion`.
4. **O que está desorganizado ou fragilizado:** Redundância acentuada nas ações de exportação (botões repetidos na barra de títulos da gestão, dentro da sub-aba de UEs, dentro da sub-aba de Servidores e multiplicados na sub-aba de Extrações SSOT); ausência de classes canônicas declaradas nos arquivos CSS para a barra de sub-abas `.pedag-subtab-btn`.

---

## 2. Inventário de Violações dos Gates Hallmark (Matriz de Auditoria)

### 2.1. Nível Floor (Não Negociável — Bloqueante)

| Gate | Linha / Arquivo | Descrição do Tell Identificado | Correção Obrigatória (Floor) |
| :--- | :--- | :--- | :--- |
| **Gate 48 & 7a** | `index.html:212, 216, 220, 487-504`<br>`js/features/management.js:167-224, 325, 451, 1118-1150` | Mais de 25 ocorrências de cores hexadecimais literais inline (`#0284C7`, `#059669`, `#DC2626`, `#1E40AF`, `#6D28D9`, `#F0F9FF`, `#F0FDF4`, etc.) e `#fff` fora do bloco de tokens. | Declarar tokens semânticos no `:root` de `css/01_variables.css` (`--gestao-accent`, `--badge-active-bg`, `--badge-active-ink`, etc.) e consumir 100% via CSS classes. |
| **Gate 4** | `index.html:281, 319, 370, 380, 487, 508`<br>`js/features/management.js:167, 178, 232` | Aninhamento de cards dentro de cards (`.card` contendo sub-boxes com bordas, sombras e raios de canto independentes, em até 3 camadas). | Aplanar a estrutura: uma única camada de contenção por seção. Substituir sub-cards por tabelas limpas, divisores de linha sutis (hairlines) ou elevação por ground/surface. |
| **Gate 30a** | `js/features/management.js:174, 320, 328, 391, 2063`<br>`js/core/rbac.js:678, 703, 720` | Emojis utilizados como ícones (`🏢`, `✏️`, `👁️`, `✉️`, `🏫`, `🗺️`, `🏛️`). | Erradicação total dos emojis; substituição por pictogramas vetoriais SVG monocromáticos limpos (Feather/Lucide style) ou tipografia direta. |
| **Gate 67** | `js/features/management.js:205, 211, 217, 223, 1120, 1125, 1130, 1135` | Labels de métricas e cabeçalhos de dados em caixa alta forçada via `text-transform: uppercase` (`ALUNOS MATRICULADOS`, `EDUCAÇÃO INCLUSIVA / AEE`, etc.). | Remover `text-transform: uppercase`. Adotar rótulos em sentence case, peso médio/semi-bold, um ponto menor que o corpo, destravados e elegantes. |
| **Gate 63** | `index.html:196`<br>`js/core/rbac.js:674, 699` | Pontuação de template e setas coladas a botões e links (`Acessar Gestão da Escola →`, `Acessar Gestão do Polo →`). | Utilizar verbos diretos no infinitivo (`Acessar Gestão da Escola`) e pictogramas SVG estruturados quando houver indicador direcional. |
| **Gate 10a** | `css/01_variables.css`, `css/02_layout.css`, `css/03_components.css`, `css/04_screens.css` | Uso frequente de `transition: all 0.15s ease`. | Especificar expressamente as propriedades de transição (`transition: background-color 0.15s ease, border-color 0.15s ease, transform 0.15s ease`). Nunca usar `all`. |
| **Gate 26a & 15** | `css/01_variables.css`, `css/03_components.css` | Ausência de `:focus-visible` nos botões da gestão e sub-abas (`.pedag-subtab-btn`, `.btn`). Anel de foco ausente ou dependente do browser. | Adicionar regras instantâneas de `:focus-visible` com anel de alto contraste (mínimo 3:1) sem transição de fade. |
| **Gate 27** | `css/01_variables.css`, `css/04_screens.css` | Ausência de fallback para `prefers-reduced-motion: reduce`. | Incluir bloco `@media (prefers-reduced-motion: reduce)` anulando transições e transformações. |
| **Gate 50** | `index.html:508`, `css/04_screens.css:762`<br>`js/features/management.js:177, 203, 1118` | Trilhas de grid utilizando `1fr` sem proteção (`repeat(auto-fit, minmax(280px, 1fr))`). | Substituir obrigatoriamente por `minmax(0, 1fr)` em todas as definições de grid da gestão. |

---

### 2.2. Nível Reflex (Padrões de Máquina & Sobriedade Visual)

| Gate | Linha / Arquivo | Descrição do Tell Identificado | Correção Recomendada |
| :--- | :--- | :--- | :--- |
| **Gate 3** | `index.html:281`<br>`js/features/management.js:232` | "Card tells": faixa lateral grossa colorida (`border-left: 4px solid var(--primary)`). | Substituir o border-left pesado por uma linha de topo sutil (1px), distinção de background com contraste calmo ou cabeçalho tipográfico hierarquizado. |
| **Gate 19** | `index.html:482, 492`<br>`js/core/rbac.js:588` | Jargões burocráticos e prolixos ("Acesso onisciente a todas as 32 UEs", "Acesso gerencial exclusivo para exportação de dados brutos consolidados da rede e backup da base"). | Reescrever a cópia para português institucional direto, claro e centrado no apoio à decisão pedagógica. |
| **Gate 74** | `index.html:212, 487-504` | Uso de paletas prontas do Tailwind (sky-50, emerald-800, etc.) aplicadas de forma descoordenada. | Harmonizar com a paleta oficial da identidade institucional do SerTão Criança (`#0066CC` institucional, slate neutrals, e semáforos pedagógicos suaves). |
| **Gate 85 & Arquitetura** | `index.html:211-225, 260-275, 411-426, 487-574` | Fragmentação e redundância de ações: botões de exportação CSV/JSON repetidos 3 vezes na mesma tela. | Centralizar exportações e modelos na sub-aba "Extrações & Relatórios SSOT", mantendo nas telas de UEs e Servidores apenas as ações primárias de cadastro e visualização. |

---

### 2.3. Nível Finish (Detalhes de Refinamento e Artesanato UI)

| Gate | Alvo | Oportunidade de Melhoria |
| :--- | :--- | :--- |
| **F1 / F2** | Placeholders de busca em UEs, Turmas e Servidores | Substituição de reticências comuns `...` pelo caractere tipográfico de elipse `…` (`Buscar UE por nome…`). |
| **F3** | Títulos de tela (`#homeGestaoTitle`, etc.) | Adição de `text-wrap: balance` nos cabeçalhos de gestão para equilíbrio de linha tipográfica. |
| **F4 & F15** | Botões e Controles da Gestão | Uniformização das alturas de botões operacionais (36px consistente no desktop) e eliminação de variações arbitrárias de `padding`. |
| **F16** | Superfícies do Navegador | Adição de `::selection` estilizado com o tom institucional do SerTão Criança. |

---

## 3. Proposta de Design Hallmark (A Nova Arquitetura Visual)

### 3.1. Tokens Semânticos Declarados (`css/01_variables.css`)
```css
/* Hallmark UI Tokens — Gestão Pedagógica */
:root {
  --gestao-surface: var(--surface);
  --gestao-ground: var(--bg);
  --gestao-border: var(--border);
  --gestao-border-subtle: #EDF2F7;
  
  /* Status Semânticos Calmos (OKLCH alinhado) */
  --badge-active-bg: #DCFCE7;
  --badge-active-ink: #166534;
  --badge-neutral-bg: #F1F5F9;
  --badge-neutral-ink: #334155;
  --badge-accent-bg: #EFF6FF;
  --badge-accent-ink: #1D4ED8;
  --badge-warning-bg: #FEF3C7;
  --badge-warning-ink: #92400E;
  
  /* Botões e Ações */
  --btn-focus-ring: #0066CC;
}
```

### 3.2. Sub-abas Operacionais Reestilizadas (`.pedag-subtab-btn`)
Em vez de um contêiner cinza genérico com botões desalinhados:
- Segmented control moderno com fundo neutro claro (`--gestao-ground`), raio de canto contido (8px), estado ativo com fundo branco (`--surface`), sombra sutil (`--shadow-sm`) e `:focus-visible` imediato.
- Pictogramas vetoriais integrados perfeitamente alinhados ao texto em sentence case.

### 3.3. Eliminação da Redundância de Ações (Descluttering)
- **Barra de Título da Gestão Pedagógica:**
  - Mantém o título da tela (`Gestão da Rede` / `Gestão da Unidade Escolar · [Nome]` / `Gestão do Polo Regional · [Nome]`);
  - Botão de destaque limpo: `Ciclos Avaliativos & Calendário` (com SVG de calendário);
  - As ações de backup geral (JSON) ficam centralizadas exclusivamente na sub-aba de Extrações SSOT, despoluindo o topo.
- **Telas de UEs e Servidores:**
  - Foco nas ações operacionais principais (`+ Cadastrar Nova UE`, `+ Cadastrar Novo Polo`, `+ Novo Professor`, `+ Novo Usuário`);
  - Acesso a modelos e downloads unificado e limpo, sem poluir a barra com 4 botões secundários idênticos.

### 3.4. Tabelas e Exibição de Dados (Single-Layer Containment)
- Eliminar o efeito "caixa dentro de caixa";
- A tabela de Unidades Escolares e a Matriz de Cobertura passam a residir em cartões de superfície única, com cabeçalhos de tabela leves, tipografia clara (corpo de 13px) e espaçamentos simétricos (`padding: 12px 16px`).

---

## 4. Alterações / Adições / Exclusões no Algoritmo de Auditoria (`audit_platform.py` / `js/audit/audit_engine.js`)

> **Seção Obrigatória conforme AGENTS.md e GEMINI.md.**

### 4.1. Preservação de Testes Existentes
As seguintes asserções do `js/audit/audit_engine.js` continuarão 100% ativas e rigorosamente satisfeitas:
1. **Módulo 12 (Governança & Sub-abas):**
   - Validação da ocultação de `#pedagTabClasses` para a Coordenadora do Núcleo de EI;
   - Desvio automático de `switchPedagSubTab('classes')` para `units`;
   - Visibilidade correta de turmas para Coordenadora da UE.
2. **Módulo 20 (Erradicação de Emojis na Gestão Pedagógica):**
   - Asserção regex `/[🏫🗺🏢💾✏📍👁✉☀️🌤🗑⚠️📅🛡🏛]/` em `#networkCoverageCard`, `#unitsDetailedCard` e `#pedagViewTeam`. A higienização dos emojis remanescentes em `js/features/management.js` consolidará essa aprovação de forma definitiva.

### 4.2. Novas Asserções Automatizadas Propostas
No Módulo 20 (ou novo Módulo de Conformidade Visual Hallmark):
- **Asserção de Ausência de Cores Literais Inline em `#homeGestaoView`:**
  - Garantir que elementos nativos do `#homeGestaoView` não contenham estilos inline com `#0284C7`, `#059669`, `#DC2626` ou `#fff`.
- **Asserção de Proibição de `text-transform: uppercase` em Cards de Métricas da Gestão:**
  - Verificar que os labels dos painéis de caracterização de turmas e UEs utilizem tipografia mista (sentence case).
- **Asserção de Integridade dos Botões de Navegação Segmentada:**
  - Verificar que todos os 4 botões `.pedag-subtab-btn` possuem estado de foco e atributos de acessibilidade válidos.

---

## 5. Roteiro de Execução Mecânica (Para a Etapa 2 - Operário)

Quando o usuário autorizar a execução deste plano, os passos mecânicos serão:

1. **Backup Intermediário:**
   - Salvar cópia integral em `intermediárias/aplicativo_v1.53_revisao_hallmark_gestao_pedagogica.html`.
2. **Definição de Tokens em `css/01_variables.css`:**
   - Adicionar os tokens semânticos Hallmark da gestão e classes auxiliares.
   - Adicionar o bloco `@media (prefers-reduced-motion: reduce)`.
3. **Criação de Classes Componentizadas em `css/03_components.css` / `css/04_screens.css`:**
   - Criar `.pedag-subtab-btn`, `.pedag-subview`, `.gestao-header-actions`, eliminando CSS inline.
   - Substituir `transition: all` por transições específicas nos componentes da gestão.
4. **Refatoração do HTML em `index.html`:**
   - Higienizar o contêiner `#homeGestaoView` e suas 4 sub-visões.
   - Remover estilos inline e cores literais.
   - Remover setas e pontuações de template (`→`).
5. **Higienização de Emojis e Caixa Alta em `js/features/management.js`:**
   - Substituir `✏️`, `🏢`, `👁️`, `✉️` por SVGs limpos ou botões tipográficos limpos.
   - Remover `text-transform:uppercase` dos templates dinâmicos de caracterização.
   - Substituir trilhas de grid `1fr` por `minmax(0, 1fr)`.
6. **Sincronização com Firebase Deploy:**
   - Replicar `index.html` para `firebase_deploy/public/index.html`.
7. **Validação Sintática JSC Pré-Voo:**
   - Executar `python3 audit_platform.py --check-syntax`.
8. **Atualização do Changelog Duplo:**
   - Atualizar `CHANGELOG.md` e o `#modalChangelog` / botão `.btn-changelog` para a Versão 1.53 (v8.2.20).
9. **Deploy & Auditoria Pós-Deploy:**
   - Executar checagem de concorrência Git e `git push origin main`.
   - Executar `python3 audit_platform.py --silent-on-success`.

---

## 6. Parecer Técnico Sintético

A aba de Gestão Pedagógica possui uma sólida base algorítmica e funcional, com excelente aderência às regras de negócio da Educação Infantil de Patos. No entanto, sua apresentação visual acumulou os "tells" clássicos de interfaces geradas por IA (cores arbitrárias inline, múltiplos cards aninhados, emojis como substitutos de ícones, caixa alta desmedida e redundância de botões). 

A aplicação do **Padrão Hallmark** elevará a tela ao patamar de software institucional profissional de alto nível, com estética limpa, sobriedade, máxima acessibilidade e elegância funcional.