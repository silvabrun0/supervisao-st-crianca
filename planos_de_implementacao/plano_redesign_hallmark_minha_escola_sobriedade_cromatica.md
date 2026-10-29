# PLANO DE IMPLEMENTAÇÃO — REDESIGN HALLMARK DA ABA "MINHA ESCOLA": SOBRIEDADE CROMÁTICA, ELIMINAÇÃO DE CARDS ANINHADOS E DESCLUTTERING VISUAL

> **Status:** Proposto / Em Análise (Etapa 1 - O Arquiteto)  
> **Data:** 29 de Outubro de 2026  
> **Versão Alvo:** 1.59 (v8.2.26)  
> **Alvo:** Aba "Minha Escola" (`#deskTabOpManagement` no perfil Coordenador, `#homeGestaoView`, sub-abas `#pedagViewUnits`, `#pedagViewClasses`, `#pedagViewTeam`, contêiner `#coordinatorUnitCardContainer`, painel `#characterizationFilterPanel`, tabela de turmas `#classesTableBody`, arquivos `css/01_variables.css`, `css/03_components.css`, `css/04_screens.css`, `js/features/management.js`, `index.html`, `js/audit/audit_engine.js` e espelhos do Firebase)  
> **Padrão de Qualidade:** Hallmark Design Standard (v2.0.0 / `RULE[user_global]`)  
> **Objetivo Primário:** Redesenhar integralmente a interface da aba "Minha Escola" (Gestão da Unidade Escolar acessada pela Coordenação Pedagógica), reduzindo drasticamente a sobrecarga e saturação de cores (eliminação do "rainbow dashboard" de números e pílulas multicoloridas), aplanando estruturas de cartões aninhados (card inside card), substituindo controles pesados por componentes segmentados refinados e instituindo sobriedade institucional, máxima autoridade técnica e legibilidade para tomada de decisão escolar, com preservação absoluta (100%) dos dados SSOT, wiring de eventos e asserções da suíte de auditoria da plataforma.

---

## 0. Diretriz de Execução Obrigatória

> [!IMPORTANT]
> **Aviso ao Agente Executor (Etapa 2 - Operário):**  
> Antes de aplicar qualquer alteração de código resultante deste plano, você **DEVE OBRIGATORIAMENTE** ler o manual [`WORKFLOW_MACOS.md`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md) e a skill [`.agents/skills/execucao-operario/SKILL.md`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/.agents/skills/execucao-operario/SKILL.md).  
> 
> - **Trava Crítica da Etapa 1:** Durante a vigência deste plano, nenhum arquivo de código de produção deve ser comitado ou alterado de forma prematura. Ao concluir o planejamento, a árvore de trabalho do Git (`git status`) deve permanecer estritamente limpa em relação a alterações não autorizadas.
> - **Execução Mecânica da Etapa 2:** Na Etapa 2, execute o plano sem improvisações, valide a sintaxe via JSC nativo (`python3 audit_platform.py --check-syntax`), gere o backup intermediário em `intermediárias/aplicativo_v1.59_redesign_hallmark_minha_escola_sobriedade_cromatica.html`, atualize o changelog duplo (`CHANGELOG.md` e `#modalChangelog` / botão `.btn-changelog` para a Versão 1.59 - v8.2.26), sincronize as cópias espelhadas do Firebase (`firebase_deploy/public/`), realize o deploy via `git push origin main` e execute a auditoria pós-deploy headless via `python3 audit_platform.py --silent-on-success`.

---

## 1. Diagnóstico e Contexto (The Read — Hallmark Standard)

### 1.1. Material, Público, Uso e Tom Institucional
1. **Material Real do Sistema na Aba "Minha Escola":**
   - Dados cadastrais e territoriais da Unidade Escolar (UE), endereço/bairro e polo regional vinculado;
   - Caracterização demográfica e quantitativa da escola: somatório real de alunos matriculados, crianças atendidas pela Educação Inclusiva (AEE), total de turmas em atividade e quantidade de docentes regentes titulares lotadas;
   - Catálogo de turmas da escola: etapas pedagógicas (Infantil I, Infantil II, Creche), jornadas (Tempo Parcial vs. Tempo Integral), turnos (Matutino, Vespertino, Manhã + Tarde) e distribuição nominal de professoras titulares;
   - Quadro docente da unidade: listagem de professoras e vínculos formativos com a coordenação pedagógica.
2. **Público & Ação Central:**
   - **Coordenadora Pedagógica da Escola (ex: Mariana Ferreira no CEI Maria de Lourdes):** É a usuária prioritária desta visão. Sua ação principal é inspecionar e atualizar a caracterização da sua escola, gerenciar a enturmação dos alunos e docentes regentes e garantir a consistência das turmas antes de iniciar os ciclos bimestrais de observação formativa.
   - **Uso:** Acesso ágil tanto em desktop na secretaria escolar quanto em smartphone na circulação pelas salas de aula.
3. **Tom do Design (Hallmark Floor):**
   - **Sóbrio, Utilitário e Institucional:** Eliminação da infantilização visual e do excesso de artifícios cromáticos;
   - **Neutral-First & Monocromático:** Base neutra de ardósia (slate neutrals: `#0F172A`, `#334155`, `#64748B`, `#E2E8F0`, `#F8FAFC`), superfícies brancas puras (`#FFFFFF`), hairlines sutis e um único acento cromático institucional (azul SerTão Criança `#0066CC`).

---

### 1.2. Inventário de Violações e "Tells" Identificados na Aba "Minha Escola"

A investigação do código atual de `js/features/management.js`, `index.html` e folhas de estilo revelou que a aba "Minha Escola" acumula vícios visuais críticos que geram a percepção de poluição visual e "excesso de cores":

#### A. O "Rainbow Dashboard" (Sobrecarga e Anarquia Cromática)
1. **Grade de Métricas da UE (`#coordinatorUnitCardContainer`):**
   - A linha de métricas agrega 4 caixas lado a lado, onde cada número exibe uma cor primária saturada diferente:
     - Total de Alunos: Azul royal saturado (`.stat-value-hallmark.accent` `#1D4ED8`);
     - Educação Inclusiva / AEE: Verde floresta saturado (`.stat-value-hallmark.active` `#166534`);
     - Turmas em Atividade: Roxo intenso (`.stat-value-hallmark.purple` `#6D28D9`);
     - Docentes na UE: Laranja/Âmbar queimado (`style="color:#D97706;"`).
   - **Problema de Design:** O número de turmas ou professoras de uma escola não é um estado de alerta, de erro ou de celebração. Tratar dados demográficos estruturais como um semáforo de quatro cores cria ruído cognitivo severo e passa uma impressão amadora de gerador automático de dashboards ("AI slop").
2. **Tabela de Turmas da Escola (`#classesTableBody`):**
   - Cada linha da tabela é um carnaval de pílulas coloridas competindo entre si:
     - Total de alunos: texto em azul negrito (`color:var(--badge-accent-ink)`);
     - Alunos com AEE: pílula verde saturada (`.badge-hallmark-active` com fundo `#DCFCE7`);
     - Jornada Escolar: pílula roxa saturada para Tempo Integral (`.badge-hallmark-purple` com fundo `#EDE9FE`) e pílula azul para Tempo Parcial (`.badge-hallmark-accent`);
     - Turno: pílula verde saturada para "Manhã + Tarde" e cinza para outros turnos;
     - Botão Excluir: texto vermelho chamativo inline (`color:var(--red)`).
   - Multiplicando por 8 a 12 turmas de uma escola média, a tela exibe mais de 50 pílulas coloridas simultâneas, destruindo a hierarquia de leitura.

#### B. Cartões Aninhados em Múltiplos Níveis (Violação do Hallmark Floor 11 / Gate 4)
1. **No Contêiner da Escola (`#coordinatorUnitCardContainer`):**
   - O elemento raiz é um cartão (`.card`) com borda de topo espessa (`border-top: 3px solid var(--primary)`).
   - Ao selecionar o modo "Especificar por Turma", renderiza-se um sub-cartão interno com fundo `#F8FAFC`, borda e raio próprio (`border: 1px solid var(--border); border-radius: 10px; padding: 16px;`).
   - Dentro desse sub-cartão, renderizam-se outras 4 caixas de estatísticas com bordas próprias (`.stat-box-hallmark`).
   - **Resultado:** Três camadas de bordas e cartões aninhados (caixa dentro de caixa dentro de caixa).
2. **Na Sub-aba de Turmas (`#pedagViewClasses`):**
   - O painel analítico `#characterizationFilterPanel` é um `.card` com fundo `#F8FAFC`, que fica empilhado imediatamente acima do `.card` da tabela de turmas, gerando fragmentação visual desnecessária.

#### C. Controles Pesados e Pontuação de Template (Hallmark Floor 9, 10 e 11)
1. **Seletor de Modo ("Consolidado da Escola" vs. "Especificar por Turma"):**
   - Implementado como botões com preenchimento azul pesado (`background: var(--primary); color: #FFF;`) e cantos rígidos, que pesam no topo da tela.
2. **Rótulos e Padrões de Texto:**
   - Textos contendo pontuação de template e separadores redundantes (`Educação Infantil · Parcial`, `Manhã + Tarde`).
   - Rótulos com caixas desiguais e microtextos com contraste marginal.

---

## 2. Matriz de Auditoria dos Gates Hallmark

| Gate | Localização no Código | Situação Atual (Violação / Tell) | Solução Hallmark Proposta (Novo Padrão) |
| :--- | :--- | :--- | :--- |
| **Floor 1 & Gate 48** | `js/features/management.js:181-225`<br>`js/features/management.js:1147-1188` | Cores literais inline (`#D97706`, `#6D28D9`, `#DC2626`) e classes `.accent`, `.active`, `.purple` gerando rainbow dashboard. | Criar e consumir tokens semânticos neutros (`--escola-text-strong`, `--badge-sober-*`). Centralizar os números no tom neutro de alta densidade (`#0F172A`). |
| **Floor 11 & Gate 4** | `js/features/management.js:167, 232`<br>`index.html:242, 346-371` | Cartões aninhados em até 3 níveis (`.card` contendo `div` com borda cinza contendo `.stat-box-hallmark`). | Aplanar a estrutura para contenção em camada única (*single-layer containment*). Eliminar sub-cards e unificar dados em bandas limpas com divisores hairlines. |
| **Floor 9 & Gate 67** | `css/03_components.css:853`<br>`js/features/management.js:180-224` | Rótulos de métricas com pesos desiguais e inconsistência de caixa alta em cabeçalhos. | Padronizar todos os rótulos em *sentence case*, peso 500/600, tamanho 12px, tom slate neutro (`#64748B`), sem tracking excessivo. |
| **Floor 10 & Gate 63** | `js/features/management.js:171, 1580-1605` | Separadores com middle-dot e poluição de pílulas saturadas em cada célula da tabela de turmas. | Substituir pílulas coloridas por texto tipográfico estruturado e badges calmos desaturados (*quiet badges* com borda sutil). |
| **Gate 74** | `js/features/management.js:1561-1573` | Badges de jornada e turno com cores prontas saturadas (verde, roxo, azul). | Unificar as jornadas em badges neutros institucionais (`.badge-sober-neutral`) e manter AEE em realce suave apenas quando > 0. |
| **Gate 26a & 15** | Controles da Coordenação (`#coordinatorUnitCardContainer`) | Botões e seletores sem anel de foco instantâneo padronizado. | Implementar `:focus-visible` de 2px instantâneo com `--btn-focus-ring` (`#0066CC`). |
| **Gate 10a** | Transições de cartões e botões | Uso residual de `transition: all`. | Declarar transições pontuais (`background-color 0.15s ease, border-color 0.15s ease`). Proibição categórica de `all`. |

---

## 3. A Nova Arquitetura Visual Hallmark da Aba "Minha Escola"

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Gestão da Unidade Escolar · CEI Professora Maria de Lourdes                  │
│  Administração autônoma de turmas, docentes e caracterização da escola       │
├──────────────────────────────────────────────────────────────────────────────┤
│  [ Minha Escola (Ativa) ]   [ Turmas & Regência ]   [ Docentes da UE ]       │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─ SINGLE-LAYER SURFACE (Superfície Única de Gestão da Escola) ───────────┐  │
│  │                                                                         │  │
│  │  CEI Professora Maria de Lourdes                                        │  │
│  │  Polo Regional 1 · Caracterização baseada no somatório canônico de turmas│  │
│  │                                                                         │  │
│  │  [ Segmented: (●) Consolidado da Escola   ( ) Especificar por Turma ]   │  │
│  │                                                                         │  │
│  │  ─────────────────────────────────────────────────────────────────────  │  │
│  │  MÉTRICAS DA UNIDADE (Tipografia Tabular Neutra — Zero Rainbow Slop)    │  │
│  │                                                                         │  │
│  │   Alunos matriculados    Educação inclusiva (AEE)  Turmas em atividade  │  │
│  │   248                    12 (4.8%)                 10                   │  │
│  │   Total da unidade       Crianças com suporte      Infantil I, II e Cre │  │
│  │                                                                         │  │
│  │   Docentes na escola     Endereço cadastrado                            │  │
│  │   14                     Rua das Acácias, nº 120 · Bairro Alto          │  │
│  │   Regentes titulares     [ Editar Endereço ]                            │  │
│  │                                                                         │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 3.1. Princípios de Redesign Cromático (Chromatic Discipline)
1. **Números em Preto/Ardósia Alta Densidade (`#0F172A`):**
   - Todos os indicadores numéricos primários (248 alunos, 10 turmas, 14 docentes) são renderizados na cor canônica de texto forte, eliminando os tons de verde, roxo, azul e laranja concorrentes;
   - A hierarquia visual é alcançada pela escala tipográfica (tamanho 24px, peso 700 e números tabulares `font-variant-numeric: tabular-nums`), e não por cores berrantes;
2. **Badges Calmos (*Quiet Badges*):**
   - Pílulas informativas passam a ter fundo neutro suave (`#F8FAFC` ou `#F1F5F9`), borda sutil de 1px (`#E2E8F0`) e texto ardósia (`#334155`);
   - O indicador de Educação Inclusiva (AEE) recebe um destaque contido e elegante (fundo `#F0FDF4`, borda `#DCFCE7`, texto `#166534`), apenas quando houver crianças com AEE na turma. Se for zero, exibe-se um travessão suave `—` ou número neutro;
3. **Controle Segmentado Moderno (*Modern Segmented Control*):**
   - Em substituição aos blocos azuis maciços, adota-se o padrão institucional Hallmark: contêiner cinza suave (`#F1F5F9`) com botões em formato de pastilha; a opção selecionada ganha superfície branca elevada (`#FFFFFF`), texto escuro nítido e sombra sutil (`--shadow-sm`).

---

## 4. Especificação de Implementação Passo a Passo (Snippets Exatos)

### Passo 1: Tokens e Classes Semânticas em `css/01_variables.css`
Acrescentar ao `:root` os tokens específicos da experiência Hallmark da Escola:

```css
/* Hallmark UI Tokens — Gestão da Escola (Sobriedade Cromática) */
:root {
  --escola-ground: #F8FAFC;
  --escola-surface: #FFFFFF;
  --escola-border: #E2E8F0;
  --escola-border-subtle: #F1F5F9;
  --escola-text-strong: #0F172A;
  --escola-text-body: #334155;
  --escola-text-muted: #64748B;

  /* Badges Calmos Institucionais */
  --badge-sober-bg: #F1F5F9;
  --badge-sober-ink: #334155;
  --badge-sober-border: #E2E8F0;

  --badge-sober-aee-bg: #F0FDF4;
  --badge-sober-aee-ink: #166534;
  --badge-sober-aee-border: #DCFCE7;

  --segmented-bg: #F1F5F9;
  --segmented-active-bg: #FFFFFF;
  --segmented-active-ink: #0F172A;
  --segmented-inactive-ink: #64748B;
}
```

---

### Passo 2: Componentes Hallmark em `css/03_components.css`
Ajustar e consolidar os componentes da escola, eliminando estilos inline e garantindo contenção de camada única:

```css
/* =========================================================================
   HALLMARK STANDARD: COMPONENTES DA GESTÃO DA ESCOLA (MINHA ESCOLA)
   ========================================================================= */

/* Contêiner de Camada Única da Escola */
.school-single-surface {
  background: var(--escola-surface);
  border: 1px solid var(--escola-border);
  border-radius: var(--radius);
  padding: 24px;
  box-shadow: var(--shadow-sm);
}

/* Controle Segmentado Institucional */
.hallmark-segmented-control {
  display: inline-flex;
  align-items: center;
  background: var(--segmented-bg);
  padding: 3px;
  border-radius: 8px;
  border: 1px solid var(--escola-border);
  gap: 2px;
}

.hallmark-segmented-btn {
  background: transparent;
  border: none;
  border-radius: 6px;
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 500;
  color: var(--segmented-inactive-ink);
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
  white-space: nowrap;
}

.hallmark-segmented-btn:hover {
  color: var(--escola-text-strong);
}

.hallmark-segmented-btn.active {
  background: var(--segmented-active-bg);
  color: var(--segmented-active-ink);
  font-weight: 600;
  box-shadow: var(--shadow-sm);
}

.hallmark-segmented-btn:focus-visible {
  outline: 2px solid var(--btn-focus-ring);
  outline-offset: 1px;
}

/* Fita de Métricas Sóbrias da Escola (Single-layer, sem sub-cards) */
.school-metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  gap: 16px;
  margin-top: 20px;
  margin-bottom: 20px;
}

.school-metric-item {
  background: var(--escola-ground);
  border: 1px solid var(--escola-border);
  border-radius: 8px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
}

.school-metric-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--escola-text-muted);
  margin-bottom: 6px;
  line-height: 1.3;
}

.school-metric-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--escola-text-strong);
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
}

.school-metric-subtext {
  font-size: 11px;
  color: var(--escola-text-muted);
  margin-top: 6px;
}

/* Badges Calmos de Tabela */
.badge-school-neutral {
  display: inline-flex;
  align-items: center;
  background: var(--badge-sober-bg);
  color: var(--badge-sober-ink);
  border: 1px solid var(--badge-sober-border);
  border-radius: 6px;
  padding: 3px 8px;
  font-size: 11px;
  font-weight: 500;
  line-height: 1.2;
}

.badge-school-aee {
  display: inline-flex;
  align-items: center;
  background: var(--badge-sober-aee-bg);
  color: var(--badge-sober-aee-ink);
  border: 1px solid var(--badge-sober-aee-border);
  border-radius: 6px;
  padding: 3px 8px;
  font-size: 11px;
  font-weight: 600;
  line-height: 1.2;
}

/* Botão de Exclusão Sóbrio (Perigo sob demanda) */
.btn-action-delete {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 11px;
  transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}

.btn-action-delete:hover {
  background: var(--badge-danger-bg);
  color: var(--badge-danger-ink);
  border-color: #FECACA;
}
```

---

### Passo 3: Refatoração de `renderUnitsScreen()` em `js/features/management.js`
Substituição dos números arco-íris e sub-cards por componentes limpos, mantendo estritamente os textos `'Consolidado da Escola'` e `'Especificar por Turma'` e o seletor `#coordCharClassSelect` para não quebrar a auditoria:

```javascript
// Substituição do bloco if (user.roleKey === 'coordenador') dentro de renderUnitsScreen():
if (user.roleKey === 'coordenador') {
  if (coordContainer) {
    coordContainer.style.display = 'block';
    const myUnit = (appState.units || []).find(u => u.name === user.school) || {
      name: user.school,
      polo: 'Polo Municipal',
      address: ''
    };
    const agg = getSchoolClassesAggregates(user.school);
    const schoolClasses = agg.classes;

    const activeViewMode = coordContainer.dataset.viewMode || 'aggregated';
    const selectedClassId = coordContainer.dataset.selectedClassId || (schoolClasses[0] ? schoolClasses[0].id : '');
    const currentClass = schoolClasses.find(c => c.id === selectedClassId) || schoolClasses[0];

    let detailHtml = '';
    if (activeViewMode === 'class' && currentClass) {
      const clsTot = typeof currentClass.totalStudents === 'number' ? currentClass.totalStudents : 20;
      const clsInc = typeof currentClass.inclusiveStudents === 'number' ? currentClass.inclusiveStudents : 0;
      const clsReg = Math.max(0, clsTot - clsInc);
      const clsTeachers = Array.isArray(currentClass.teachers) && currentClass.teachers.length > 0 ? currentClass.teachers.join(', ') : 'Aguardando atribuição';

      detailHtml = `
        <div style="border-top: 1px solid var(--escola-border); padding-top: 16px; margin-top: 16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:14px;">
            <div>
              <span style="font-size:15px; font-weight:700; color:var(--escola-text-strong);">${currentClass.name}</span>
              <span style="font-size:12px; color:var(--escola-text-muted); margin-left:8px;">${currentClass.stage || 'Educação Infantil'} · ${currentClass.shift || 'Parcial'}</span>
            </div>
            <button class="btn btn-secondary" style="font-size:11px; padding:5px 10px;" onclick="openEditClassModal('${currentClass.id}')">
              <svg class="btn-icon-sm" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block; vertical-align:middle; margin-right:4px;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Editar Turma
            </button>
          </div>
          <div class="school-metrics-grid" style="margin-top:0;">
            <div class="school-metric-item">
              <div class="school-metric-label">Total de alunos</div>
              <div class="school-metric-value">${clsTot}</div>
              <div class="school-metric-subtext">Crianças matriculadas</div>
            </div>
            <div class="school-metric-item">
              <div class="school-metric-label">Necessidades especiais</div>
              <div class="school-metric-value">${clsInc}</div>
              <div class="school-metric-subtext">${clsInc > 0 ? 'Público AEE nesta turma' : 'Nenhum aluno AEE'}</div>
            </div>
            <div class="school-metric-item">
              <div class="school-metric-label">Alunos regulares</div>
              <div class="school-metric-value">${clsReg}</div>
              <div class="school-metric-subtext">Sem necessidade especial</div>
            </div>
            <div class="school-metric-item">
              <div class="school-metric-label">Docentes regentes</div>
              <div style="font-size:13px; font-weight:600; color:var(--escola-text-strong); margin-top:4px; line-height:1.3;">${clsTeachers}</div>
            </div>
          </div>
        </div>
      `;
    } else {
      detailHtml = `
        <div class="school-metrics-grid">
          <div class="school-metric-item">
            <div class="school-metric-label">Alunos matriculados</div>
            <div class="school-metric-value">${agg.totalStudents}</div>
            <div class="school-metric-subtext">Somatório de ${agg.totalClasses} turmas</div>
          </div>
          <div class="school-metric-item">
            <div class="school-metric-label">Educação inclusiva (AEE)</div>
            <div class="school-metric-value">${agg.inclusiveStudents} <span style="font-size:13px; font-weight:500; color:var(--escola-text-muted);">(${agg.inclusionRate}%)</span></div>
            <div class="school-metric-subtext">Crianças com necessidades especiais</div>
          </div>
          <div class="school-metric-item">
            <div class="school-metric-label">Turmas em atividade</div>
            <div class="school-metric-value">${agg.totalClasses}</div>
            <div class="school-metric-subtext">Turmas sob gestão</div>
          </div>
          <div class="school-metric-item">
            <div class="school-metric-label">Docentes na unidade</div>
            <div class="school-metric-value">${agg.teachersCount}</div>
            <div class="school-metric-subtext">Professoras titulares</div>
          </div>
        </div>
      `;
    }

    coordContainer.innerHTML = `
      <div class="school-single-surface">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <svg class="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--primary);"><path d="M3 21h18M3 7l9-4 9 4v14M9 21V9h6v12"/></svg>
              <h3 style="font-size:18px; font-weight:700; color:var(--escola-text-strong); margin:0;">${myUnit.name}</h3>
            </div>
            <p style="font-size:12px; color:var(--escola-text-muted); margin:4px 0 0 0;">Caracterização calculada a partir do somatório canônico de turmas da unidade escolar.</p>
          </div>
          
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <div class="hallmark-segmented-control">
              <button class="hallmark-segmented-btn ${activeViewMode === 'aggregated' ? 'active' : ''}" onclick="setCoordinatorCharView('aggregated')">
                Consolidado da Escola
              </button>
              <button class="hallmark-segmented-btn ${activeViewMode === 'class' ? 'active' : ''}" onclick="setCoordinatorCharView('class')">
                Especificar por Turma
              </button>
            </div>
            ${activeViewMode === 'class' ? `
              <select id="coordCharClassSelect" class="form-select" style="font-size:12px; padding:5px 10px; width:auto;" onchange="setCoordinatorCharClass(this.value)">
                ${schoolClasses.map(c => `<option value="${c.id}" ${c.id === (currentClass ? currentClass.id : '') ? 'selected' : ''}>${c.name}</option>`).join('')}
              </select>
            ` : ''}
          </div>
        </div>

        ${detailHtml}

        <div style="border-top:1px solid var(--escola-border-subtle); padding-top:16px; margin-top:16px;">
          <label class="form-label" style="font-size:12px; font-weight:500; color:var(--escola-text-muted);">Endereço da Unidade Escolar</label>
          <div style="display:flex; gap:10px; align-items:center;">
            <input type="text" id="coordUnitAddress" class="form-input" value="${myUnit.address || ''}" placeholder="Ex: Bairro Alto das Flores, Rua das Acácias, nº 120" style="font-size:13px;">
            <button class="btn btn-secondary" onclick="saveSchoolAddressOnly()" style="font-size:12px; padding:7px 14px; white-space:nowrap; font-weight:600;">
              Salvar Endereço
            </button>
          </div>
        </div>
      </div>
    `;
  }
  if (unitsMgmtContainer) unitsMgmtContainer.style.display = 'none';
  return;
}
```

---

### Passo 4: Refatoração da Tabela de Turmas em `js/features/management.js` (`renderClassesScreen()`)
1. No painel de caracterização `#characterizationFilterPanel` da Coordenadora, adotar os mesmos tokens sóbrios e o controle segmentado Hallmark;
2. Na renderização das linhas de turma em `#classesTableBody`:
   - Substituir pílulas roxas e azuis por `.badge-school-neutral`;
   - Substituir pílulas verdes de turno por texto claro ou indicador neutro;
   - Substituir números azuis por texto escuro em alta densidade (`--escola-text-strong`);
   - Tratar AEE com `.badge-school-aee` suave quando > 0, ou traço neutro quando 0;
   - Substituir o botão vermelho inline `color:var(--red)` por `.btn-action-delete`.

```javascript
// Trecho de renderização das turmas em renderClassesScreen():
classesToRender.forEach(cls => {
  const isIntegral = (cls.shift || '').toLowerCase().includes('integral');
  const jornadaBadge = isIntegral 
    ? `<span class="badge-school-neutral" style="font-weight:600;">Tempo Integral</span>`
    : `<span class="badge-school-neutral">Tempo Parcial</span>`;

  let turnoText = cls.shift || 'Não definido';
  if (isIntegral) {
    turnoText = 'Manhã e Tarde';
  }

  const totStudents = typeof cls.totalStudents === 'number' ? cls.totalStudents : 20;
  const incStudents = typeof cls.inclusiveStudents === 'number' ? cls.inclusiveStudents : 0;
  const incBadge = incStudents > 0 
    ? `<span class="badge-school-aee">${incStudents} AEE</span>`
    : `<span style="color:var(--escola-text-muted); font-size:12px;">—</span>`;

  let teachersDisplay = '';
  if (isIntegral && (cls.teachersMorning || cls.teachersAfternoon)) {
    const mList = (cls.teachersMorning && cls.teachersMorning.length > 0) ? cls.teachersMorning.join(', ') : 'A definir';
    const aList = (cls.teachersAfternoon && cls.teachersAfternoon.length > 0) ? cls.teachersAfternoon.join(', ') : 'A definir';
    teachersDisplay = `
      <div style="font-size:12px; line-height:1.4;">
        <div><span style="color:var(--escola-text-muted);">Manhã:</span> <strong>${mList}</strong></div>
        <div><span style="color:var(--escola-text-muted);">Tarde:</span> <strong>${aList}</strong></div>
      </div>
    `;
  } else {
    const tList = (Array.isArray(cls.teachers) && cls.teachers.length > 0) ? cls.teachers.join(', ') : '<span style="color:var(--escola-text-muted); font-style:italic;">Aguardando regente</span>';
    teachersDisplay = `<div style="font-size:12px; font-weight:500; color:var(--escola-text-strong);">${tList}</div>`;
  }

  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td data-label="Turma / Etapa">
      <div style="font-weight:700; color:var(--escola-text-strong); font-size:13px;">${cls.name}</div>
      <span class="badge-school-neutral" style="margin-top:2px;">${cls.stage || 'Educação Infantil'}</span>
    </td>
    <td data-label="Unidade Escolar" style="font-size:12px; color:var(--escola-text-body);">${cls.school}</td>
    <td data-label="Alunos (Total)" style="font-size:13px; font-weight:700; color:var(--escola-text-strong);">${totStudents}</td>
    <td data-label="Necessidades Especiais">${incBadge}</td>
    <td data-label="Jornada Escolar">${jornadaBadge}</td>
    <td data-label="Turno" style="font-size:12px; color:var(--escola-text-body);">${turnoText}</td>
    <td data-label="Docentes Regentes">${teachersDisplay}</td>
    <td data-label="Ações" style="text-align:center; white-space:nowrap;">
      <button class="btn btn-secondary" style="padding:4px 8px; font-size:11px; margin-right:4px;" onclick="openEditClassModal('${cls.id}')">Editar</button>
      <button class="btn-action-delete" onclick="deleteClass('${cls.id}')">Excluir</button>
    </td>
  `;
  tbody.appendChild(tr);
});
```

---

## 5. Critérios de Aceite e Roteiro de Teste

### 5.1. Critérios de Aceite Estritos
1. **Erradicação do Rainbow Dashboard na Escola:**
   - 100% dos indicadores numéricos da escola (alunos, turmas, professoras) exibem a cor de texto neutro de alta densidade (`--escola-text-strong` `#0F172A`);
   - Nenhuma métrica exibe roxo, âmbar ou azul concorrentes lado a lado;
2. **Confinamento em Camada Única (*Single-Layer Containment*):**
   - O contêiner `#coordinatorUnitCardContainer` não possui cartões ou caixas com bordas aninhadas em seu interior ao alternar entre "Consolidado" e "Especificar por Turma";
3. **Controles Segmentados Institucionais:**
   - A alternância entre "Consolidado da Escola" e "Especificar por Turma" utiliza pastilhas com fundo neutro suave e pastilha ativa branca com sombra leve;
4. **Preservação Integral de Funcionalidades e Seletores:**
   - O dropdown `#coordCharClassSelect` continua sendo acionado e populado fielmente ao clicar em "Especificar por Turma";
   - A edição e salvamento de endereço (`saveSchoolAddressOnly`) permanecem 100% funcionais;
   - Os modais de criação e edição de turmas e docentes funcionam sem qualquer desvio;
5. **Validação de Sintaxe Pré-Voo JSC:**
   - `python3 audit_platform.py --check-syntax` retorna 0 erros sintáticos.

---

## 6. Seção Obrigatória de Auditoria (`audit_platform.py` / `js/audit/audit_engine.js`)

> [!IMPORTANT]
> **Conforme AGENTS.md e GEMINI.md:**  
> Esta seção mapeia explicitamente as alterações, adições e preservações na suíte de testes automatizados da plataforma.

### 6.1. Preservação Absoluta dos Testes Existentes
As seguintes asserções do `js/audit/audit_engine.js` continuarão plenamente operacionais e rigorosamente satisfeitas:
1. **Módulo 9 (`catalogo_dados` / Pilar 14):**
   - Asserção 14.3:
     ```javascript
     selectUserAccount('mariana');
     renderUnitsScreen();
     const coordCharViewBtns = document.querySelectorAll('#coordinatorUnitCardContainer button');
     const hasCharButtons = Array.from(coordCharViewBtns).some(b => b.textContent.includes('Consolidado da Escola') || b.textContent.includes('Especificar por Turma'));
     if (!hasCharButtons) throw new Error('Seletores "Consolidado da Escola" e "Especificar por Turma" não encontrados no card da UE da Coordenadora');
     setCoordinatorCharView('class');
     const classSelect = document.getElementById('coordCharClassSelect');
     if (!classSelect) throw new Error('Dropdown #coordCharClassSelect não foi exibido no modo "Especificar por Turma" da Coordenadora');
     ```
     *Os textos `'Consolidado da Escola'` e `'Especificar por Turma'` e o seletor `#coordCharClassSelect` são mantidos exatamente iguais no HTML gerado.*
2. **Módulo 12 (`governanca_subabas`):**
   - Validação da visibilidade de `#pedagTabClasses` para a Coordenadora e desvio automático de abas;
3. **Módulo 20 (`limpeza_emojis_gestao_pedagogica`):**
   - Validação da ausência de emojis em `#unitsDetailedCard` e `#coordinatorUnitCardContainer`.

### 6.2. Novas Asserções Automatizadas Propostas
No Módulo 20 ou no Módulo 22 (`navegacao_layout`), adicionar as seguintes verificações automatizadas de conformidade Hallmark:
1. **Asserção de Sobriedade Cromática em `#coordinatorUnitCardContainer`:**
   - Verificar via `getComputedStyle` ou regex do innerHTML que nenhum elemento dentro de `#coordinatorUnitCardContainer` possui estilos inline com `#D97706`, `#6D28D9` ou classes `stat-value-hallmark.purple` / `stat-value-hallmark.accent`;
2. **Asserção do Padrão de Controle Segmentado:**
   - Verificar a presença da classe `.hallmark-segmented-control` e `.hallmark-segmented-btn` no seletor de visualização da Coordenadora;
3. **Asserção de Conformidade do Botão de Changelog:**
   - Atualizar a asserção da versão no teste final para verificar `Versão 1.59 (v8.2.26)`.

---

## 7. Roteiro Mecânico de Execução (Etapa 2 - Operário)

Quando o usuário autorizar a execução (Etapa 2), o assistente seguirá fielmente a sequência mecânica:

1. **Sincronização Prévia:**
   - `git pull origin main`
2. **Criação do Backup Intermediário:**
   - Salvar o arquivo atual em `intermediárias/aplicativo_v1.59_redesign_hallmark_minha_escola_sobriedade_cromatica.html`;
3. **Aplicação dos Tokens e Classes:**
   - Inserir tokens `--escola-*` em `css/01_variables.css`;
   - Inserir componentes `.school-single-surface`, `.hallmark-segmented-*`, `.school-metric-*`, `.badge-school-*` em `css/03_components.css`;
4. **Aplicação do Redesign em `js/features/management.js`:**
   - Atualizar `renderUnitsScreen()` para perfil coordenador;
   - Atualizar `renderClassesScreen()` e renderização de linhas de `#classesTableBody`;
5. **Sincronização com Firebase:**
   - Replicar as alterações para `firebase_deploy/public/index.html` e folhas de estilo correspondentes;
6. **Blindagem Sintática Pré-Voo (JSC):**
   - Executar `python3 audit_platform.py --check-syntax` e garantir 100% de integridade;
7. **Atualização do Changelog Duplo:**
   - Registrar a Versão 1.59 no `CHANGELOG.md` e no `#modalChangelog` / botão `.btn-changelog` de `index.html`;
8. **Deploy Seguro e Checagem de Concorrência:**
   - Executar `git fetch origin main`, `git log HEAD..origin/main --oneline`;
   - Commitar (`feat: redesign hallmark da aba minha escola com sobriedade cromatica v1.59`);
   - Executar `git push origin main`;
9. **Auditoria Pós-Deploy Obrigatória:**
   - Executar `python3 audit_platform.py --silent-on-success`.
