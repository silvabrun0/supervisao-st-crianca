# Plano de Implementação: Remoção de Emojis e Padronização de Pictogramas no Painel & Indicadores e Quadro Longitudinal

---

## 0. Diretriz de Execução (Obrigatória para o Operário - Etapa 2)
> [!IMPORTANT]
> **Leitura Prévia Obrigatória:** Antes de executar qualquer ação deste plano, o assistente na **Etapa 2 (O Operário)** DEVE consultar e seguir rigorosamente:
> 1. [WORKFLOW_MACOS.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md)
> 2. [WORKFLOW_GITHUB.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_GITHUB.md)
> 3. [.agents/skills/execucao-operario/SKILL.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/.agents/skills/execucao-operario/SKILL.md)
> 4. [.agents/skills/auditoria-plataforma/SKILL.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/.agents/skills/auditoria-plataforma/SKILL.md)
>
> **Trava de Fidelidade, Estabilidade e Não Regressão:** Este plano realiza a higienização visual completa da tela de **Painel & Indicadores** (`#screenIndicators`), com foco prioritário no **Quadro de Acompanhamento Longitudinal / Semáforo Bimestral do Ciclo Anual** (`#bimesterSemaphoreSection`), substituindo todos os emojis e caracteres soltos (`⚠`, `⏳`, `○`, `🏆`, `🟢`, `🔴`, `⚪`, etc.) por pictogramas vetoriais padronizados (SVGs inline e classes CSS semânticas).
> Todos os IDs de elementos, funções de cálculo matemático, rotas de navegação, travas pedagógicas e eventos interativos (`onclick`) DEVEM ser rigorosamente preservados.

---

## 1. Diagnóstico e Contexto

### 1.1 Contexto e Justificativa Pedagógica
Na plataforma *SerTão Criança*, a tela **Painel & Indicadores** (`#screenIndicators`) consolida os principais instrumentos de governança pedagógica da Secretaria Municipal de Educação de Patos/PB:
- **Sub-aba 1:** Visão Geral & Prioridades Formativas (KPIs Decisórios, Tabela Executiva de UEs, Escala de Materiais e Diagnóstico de Gargalos Pedagógicos);
- **Sub-aba 2:** Visualização por Dimensão (Afunilamento Curricular e Referencial da Rede Municipal);
- **Sub-aba 3:** Prazos & Turmas / Semáforo Bimestral (Acompanhamento Longitudinal de Turmas e Docentes Regentes).

Ao longo do desenvolvimento inicial do Pilar 10 (Semáforo Bimestral) e de melhorias nos indicadores, foram utilizados emojis e glifos do sistema operacional para representar estados temporais e status de observação:
- `⚠`: Atraso / Alerta / Pendência;
- `⏳`: Bimestre em andamento / Pendente no prazo;
- `○`: Ciclo futuro / Não iniciado;
- `🏆`: Ciclo anual 100% cumprido / Avanço anual;
- `🟢`, `🔴`, `⚪`, `🟡`: Indicadores de status e faixas percentuais de consistência;
- Emojis contextuais em cabeçalhos e botões: `🚦`, `🏫`, `👥`, `📅`, `🔍`, `🏛️`, `💡`, `🎯`, `📉`, `🔻`, `⭐`, `📋`.

### 1.2 Problemas da Abordagem Anterior
1. **Heterogeneidade de Glifos entre Sistemas:** No macOS/iOS, emojis são renderizados com sombreamento tridimensional colorido; no Windows, aparecem com contornos caricatos; no Android, com outra geometria. Isso quebra a identidade sóbria de um sistema institucional de avaliação formativa.
2. **Prejuízo na Impressão e Relatórios:** Em impressoras térmicas, relatórios PDF ou telas em escala de cinza, emojis coloridos do Unicode frequentemente sofrem degradação, distorção ou falha de renderização de glifo (caracteres `□` "tofu").
3. **Incoerência com o Design System:** O restante da plataforma (cabeçalho, barra inferior, menu mobile e botões da versão 1.31) já foi padronizado no padrão *Feather / Lucide* com SVGs vetoriais limpos (`stroke="currentColor"` ou cores semânticas controladas). O Quadro Longitudinal e os Indicadores permaneceram com emojis residuais.

### 1.3 Princípios da Solução por Pictogramas
- **Pictogramas Vetoriais em SVG Inline:** Ícones vetoriais matematicamente precisos, nítidos em qualquer resolução de tela (Retina/Mobile) e consistentes em qualquer navegador;
- **Herança de Cores e Semiótica Semafórica:** Os pictogramas de status utilizam as cores já consagradas no semáforo:
  - **Verde (`#16A34A` / `var(--green)`):** Concluída / Consolidada (ícone de checkmark em círculo ou traço nítido);
  - **Vermelho (`#DC2626` / `var(--red)`):** Atrasada / Fragilidade (ícone de triângulo de alerta ou aviso com exclamação);
  - **Azul / Neutro (`#1E40AF` / `#475569`):** No Prazo / Em andamento (ícone de relógio ou ampulheta com ponteiros);
  - **Cinza Suave (`#94A3B8`):** Ciclo Futuro / Aguardando período (círculo tracejado ou indicador de aguardo);
- **Tamanho Padronizado:** Classes utilitárias `.sem-pill-icon` (12x12px), `.sem-stat-icon` (18x18px), `.sem-filter-icon` (14x14px), `.score-chip-dot` (8x8px) e `.trend-icon-svg` (13x13px).

---

## 2. Arquitetura e Mapeamento de Pontos de Impacto

Os arquivos afetados no repositório são:
- [index.html](file:///Users/bruno/Desktop/gestor%20supervisao_patos/index.html)
- [firebase_deploy/public/index.html](file:///Users/bruno/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html) (cópia espelhada obrigatória)
- [CHANGELOG.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/CHANGELOG.md)

### 2.1 Especificação das Classes CSS de Pictogramas do Semáforo e Indicadores
Inserir na seção de estilos de `index.html` (junto aos estilos do Semáforo / Indicadores):

```css
/* =========================================================================
   ESTILOS DE PICTOGRAMAS VETORIAIS (SEMÁFORO E INDICADORES)
   ========================================================================= */
.sem-pill-icon {
  width: 12px;
  height: 12px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 4px;
  margin-top: -2px;
  flex-shrink: 0;
}

.sem-stat-icon {
  width: 18px;
  height: 18px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 6px;
  flex-shrink: 0;
}

.sem-filter-icon {
  width: 13px;
  height: 13px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 5px;
  margin-top: -1px;
  flex-shrink: 0;
}

.trend-icon-svg {
  width: 13px;
  height: 13px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 4px;
  margin-top: -2px;
  flex-shrink: 0;
}

.score-chip-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
  flex-shrink: 0;
}
.score-chip-dot.dot-red { background: #EF4444; }
.score-chip-dot.dot-yellow { background: #F59E0B; }
.score-chip-dot.dot-green { background: #10B981; }

.picto-status-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 4px;
  vertical-align: middle;
}
.picto-status-dot.dot-completed { background: #16A34A; }
.picto-status-dot.dot-inprogress { background: #1E40AF; }
.picto-status-dot.dot-overdue { background: #DC2626; }
```

### 2.2 Catálogo de Funções Utilitárias JavaScript para Renderização de SVGs
Para manter o código limpo, determinístico e sem repetição de marcação SVG extensa dentro das concatenações de template, implementar duas funções auxiliares puras:

1. `renderSemaphorePillIconSvg(status)`: Retorna o SVG exato correspondente ao status da pílula bimestral:
   - `'completed'`: Checkmark nítido (`<polyline points="20 6 9 17 4 12"/>`);
   - `'overdue'`: Alerta triangular (`<path d="M10.29 3.86L1.82 18..."/>`);
   - `'in_progress'`: Relógio/Ampulheta (`<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>`);
   - `'future'`: Círculo discreto com contorno tracejado (`<circle cx="12" cy="12" r="8" stroke-dasharray="2 3"/>`).

2. `renderCriterionTrendIconSvg(trendClass)`: Retorna o SVG de tendência para a análise individual:
   - `'badge-trend-up'`: Seta ascendente (`<polyline points="18 15 12 9 6 15"/>`);
   - `'badge-trend-stable'`: Checkmark de consolidação (`<polyline points="20 6 9 17 4 12"/>`);
   - `'badge-trend-alert'`: Alerta triangular (`<path d="M10.29 3.86L1.82 18..."/>`);
   - `'badge-trend-down'`: Seta descendente (`<polyline points="6 9 12 15 18 9"/>`);
   - `'badge-trend-diag'`: Ponto/Traço diagnóstico.

---

## 3. Especificação de Implementação Passo a Passo (Snippets Exatos)

### Passo 1: Inclusão do CSS de Pictogramas em `index.html`
**Localização:** Na tag `<style>`, logo após os estilos do Semáforo (`.sem-status-pill`).
Adicionar as regras descritas no item 2.1.

---

### Passo 2: Criação dos Helpers Utilitários JavaScript
**Localização:** No `<script>` de `index.html`, antes de `renderIndicatorsScreen()` (~linha 20465).

```javascript
/**
 * Helper: Retorna o pictograma vetorial SVG para as pílulas de bimestre do Semáforo
 * Substitui os glifos antigos (✓, ⚠, ⏳, ○) por SVGs inline nítidos e padronizados
 */
function renderSemaphorePillIconSvg(status) {
  if (status === 'completed') {
    return `<svg class="sem-pill-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
  }
  if (status === 'overdue') {
    return `<svg class="sem-pill-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
  }
  if (status === 'in_progress') {
    return `<svg class="sem-pill-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
  }
  return `<svg class="sem-pill-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8" stroke-dasharray="2 3"/></svg>`;
}

/**
 * Helper: Retorna o pictograma vetorial SVG para as tendências de critérios
 */
function renderTrendIconSvg(cssClass) {
  if (cssClass === 'badge-trend-up') {
    return `<svg class="trend-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>`;
  }
  if (cssClass === 'badge-trend-stable') {
    return `<svg class="trend-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
  }
  if (cssClass === 'badge-trend-alert') {
    return `<svg class="trend-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
  }
  if (cssClass === 'badge-trend-down') {
    return `<svg class="trend-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`;
  }
  return `<svg class="trend-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>`;
}
```

---

### Passo 3: Atualização de `calculateCriterionTrend` (Eliminação de Emojis de Retorno)
**Localização:** Na função `calculateCriterionTrend(responsesByBimester)` (~linha 19254).

*Antes:*
```javascript
if (validBims.length === 0) {
  const hasNA = bimesters.some(bim => responsesByBimester[bim] === 'na');
  if (hasNA) return { text: 'Não se Aplica', cssClass: 'badge-trend-diag', icon: '⚪' };
  return { text: 'Sem Avaliação', cssClass: 'badge-trend-diag', icon: '—' };
}

if (validBims.length === 1) {
  const single = validBims[0];
  if (single.val === 2) return { text: 'Diagnóstico Consistente', cssClass: 'badge-trend-stable', icon: '🟢' };
  if (single.val === 1) return { text: 'Diagnóstico Parcial', cssClass: 'badge-trend-alert', icon: '🟡' };
  return { text: 'Diagnóstico Não Realizado', cssClass: 'badge-trend-down', icon: '🔴' };
}

const first = validBims[0].val;
const last = validBims[validBims.length - 1].val;
const diff = last - first;

if (diff > 0) {
  return { text: 'Progrediu (+)', cssClass: 'badge-trend-up', icon: '▲' };
} else if (diff === 0) {
  if (last === 2) {
    return { text: 'Consolidado (100%)', cssClass: 'badge-trend-stable', icon: '✓' };
  } else if (last === 1) {
    return { text: 'Estável em Parcial', cssClass: 'badge-trend-alert', icon: '⚠️' };
  } else {
    return { text: 'Estável em Alerta', cssClass: 'badge-trend-down', icon: '⚠' };
  }
} else {
  return { text: 'Fragilização (-)', cssClass: 'badge-trend-down', icon: '▼' };
}
```

*Depois:*
```javascript
if (validBims.length === 0) {
  const hasNA = bimesters.some(bim => responsesByBimester[bim] === 'na');
  if (hasNA) return { text: 'Não se Aplica', cssClass: 'badge-trend-diag', icon: renderTrendIconSvg('badge-trend-diag') };
  return { text: 'Sem Avaliação', cssClass: 'badge-trend-diag', icon: '—' };
}

if (validBims.length === 1) {
  const single = validBims[0];
  if (single.val === 2) return { text: 'Diagnóstico Consistente', cssClass: 'badge-trend-stable', icon: renderTrendIconSvg('badge-trend-stable') };
  if (single.val === 1) return { text: 'Diagnóstico Parcial', cssClass: 'badge-trend-alert', icon: renderTrendIconSvg('badge-trend-alert') };
  return { text: 'Diagnóstico Não Realizado', cssClass: 'badge-trend-down', icon: renderTrendIconSvg('badge-trend-down') };
}

const first = validBims[0].val;
const last = validBims[validBims.length - 1].val;
const diff = last - first;

if (diff > 0) {
  return { text: 'Progrediu (+)', cssClass: 'badge-trend-up', icon: renderTrendIconSvg('badge-trend-up') };
} else if (diff === 0) {
  if (last === 2) {
    return { text: 'Consolidado (100%)', cssClass: 'badge-trend-stable', icon: renderTrendIconSvg('badge-trend-stable') };
  } else if (last === 1) {
    return { text: 'Estável em Parcial', cssClass: 'badge-trend-alert', icon: renderTrendIconSvg('badge-trend-alert') };
  } else {
    return { text: 'Estável em Alerta', cssClass: 'badge-trend-down', icon: renderTrendIconSvg('badge-trend-down') };
  }
} else {
  return { text: 'Fragilização (-)', cssClass: 'badge-trend-down', icon: renderTrendIconSvg('badge-trend-down') };
}
```

---

### Passo 4: Quadro de Acompanhamento Longitudinal (Cabeçalho, Legenda e Alternadores)
**Localização:** Em `renderIndicatorsScreen()` (~linha 22201).

*Antes:*
```html
<div class="semaphore-header-row">
  <div class="semaphore-title-group">
    <h3>
      <span>🚦</span> Quadro de Controle Bimestral (Semáforo do Ciclo Anual)
    </h3>
    <p>
      Acompanhamento matricial do cumprimento das 4 observações obrigatórias organizado por <strong>${viewMode === 'classes' ? 'TURMA' : 'DOCENTE REGENTE TITULAR'}</strong>: 
      <strong style="color:#16A34A;">🟢 Concluída</strong> · 
      <strong style="color:#1E40AF;">⚪ No Prazo</strong> · 
      <strong style="color:#DC2626;">🔴 Atrasada</strong>.
    </p>
  </div>

  <!-- Alternador Turmas vs Docentes -->
  <div class="semaphore-view-toggle">
    <button type="button" class="semaphore-view-btn ${viewMode === 'classes' ? 'active' : ''}" onclick="toggleLongitudinalViewMode('classes')">
      🏫 Turmas (${scopedClasses.length})
    </button>
    <button type="button" class="semaphore-view-btn ${viewMode === 'teachers' ? 'active' : ''}" onclick="toggleLongitudinalViewMode('teachers')">
      👥 Docentes Regentes (${scopedAvaliandos.length})
    </button>
  </div>
</div>
```

*Depois:*
```html
<div class="semaphore-header-row">
  <div class="semaphore-title-group">
    <div style="display:flex; align-items:center; gap:8px;">
      <svg class="btn-icon-lg" style="color:var(--primary);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
      <h3 style="margin:0;">
        Quadro de Controle Bimestral (Semáforo do Ciclo Anual)
      </h3>
    </div>
    <p style="margin-top:4px;">
      Acompanhamento matricial do cumprimento das 4 observações obrigatórias organizado por <strong>${viewMode === 'classes' ? 'TURMA' : 'DOCENTE REGENTE TITULAR'}</strong>: 
      <strong style="color:#16A34A; display:inline-flex; align-items:center;"><span class="picto-status-dot dot-completed"></span> Concluída</strong> · 
      <strong style="color:#1E40AF; display:inline-flex; align-items:center;"><span class="picto-status-dot dot-inprogress"></span> No Prazo</strong> · 
      <strong style="color:#DC2626; display:inline-flex; align-items:center;"><span class="picto-status-dot dot-overdue"></span> Atrasada</strong>.
    </p>
  </div>

  <!-- Alternador Turmas vs Docentes -->
  <div class="semaphore-view-toggle">
    <button type="button" class="semaphore-view-btn ${viewMode === 'classes' ? 'active' : ''}" onclick="toggleLongitudinalViewMode('classes')">
      <svg class="btn-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"></rect>
        <line x1="3" y1="9" x2="21" y2="9"></line>
        <line x1="9" y1="21" x2="9" y2="9"></line>
      </svg>
      <span>Turmas (${scopedClasses.length})</span>
    </button>
    <button type="button" class="semaphore-view-btn ${viewMode === 'teachers' ? 'active' : ''}" onclick="toggleLongitudinalViewMode('teachers')">
      <svg class="btn-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
      <span>Docentes Regentes (${scopedAvaliandos.length})</span>
    </button>
  </div>
</div>
```

---

### Passo 5: Micro-cards de Resumo Decisório e Filtros Rápidos (Turmas e Docentes)
**Localização:** Na visão Turmas (~linha 22230) e na visão Docentes (~linha 22420).

*Antes (Visão Turmas):*
```html
<div class="semaphore-stats-grid">
  <div class="sem-stat-card ${semOverdueClassesCount > 0 ? 'alert-card' : ''}">
    <div class="sem-stat-label">
      <span>${semOverdueClassesCount > 0 ? '⚠' : '🛡️'}</span> Turmas em Atraso
    </div>
    <div class="sem-stat-value">${semOverdueClassesCount}</div>
    <div class="sem-stat-desc">${semOverdueClassesCount === 0 ? 'Nenhum atraso acumulado' : 'Requer intervenção imediata'}</div>
  </div>

  <div class="sem-stat-card">
    <div class="sem-stat-label">
      <span>⏳</span> Pendentes no ${curBim}
    </div>
    <div class="sem-stat-value">${semInProgressPendingCount}</div>
    <div class="sem-stat-desc">Dentro do prazo regulamentar</div>
  </div>

  <div class="sem-stat-card">
    <div class="sem-stat-label">
      <span>🟢</span> Concluídas no ${curBim}
    </div>
    <div class="sem-stat-value">${semCompletedCurrentBimCount} <span style="font-size:14px; font-weight:700; color:var(--text-secondary);">/ ${scopedClasses.length}</span></div>
    <div class="sem-stat-desc">${scopedClasses.length > 0 ? Math.round((semCompletedCurrentBimCount / scopedClasses.length) * 100) : 0}% de cobertura bimestral</div>
  </div>

  <div class="sem-stat-card">
    <div class="sem-stat-label">
      <span>🏆</span> Avanço do Ciclo Anual
    </div>
    <div class="sem-stat-value">${overallCyclePct}%</div>
    <div class="sem-stat-desc">${totalCompletedObsInCycle} de ${totalAnnualTarget} observações anuais</div>
  </div>
</div>

<!-- Barra de Filtros Rápidos de Status -->
<div class="semaphore-filters-bar">
  <span class="sem-filter-label">Filtrar:</span>
  <button type="button" class="sem-filter-chip ${statusFilter === 'all' ? 'active' : ''}" onclick="filterSemaphoreByStatus('all')">
    Todas (${scopedClasses.length})
  </button>
  <button type="button" class="sem-filter-chip chip-red ${statusFilter === 'overdue' ? 'active' : ''}" onclick="filterSemaphoreByStatus('overdue')">
    🔴 Atrasadas (${semOverdueClassesCount})
  </button>
  <button type="button" class="sem-filter-chip ${statusFilter === 'in_progress' ? 'active' : ''}" onclick="filterSemaphoreByStatus('in_progress')">
    ⚪ No Prazo (${semInProgressPendingCount})
  </button>
  <button type="button" class="sem-filter-chip chip-green ${statusFilter === 'completed_cur' ? 'active' : ''}" onclick="filterSemaphoreByStatus('completed_cur')">
    🟢 Concluídas (${semCompletedCurrentBimCount})
  </button>
  <button type="button" class="sem-filter-chip ${statusFilter === 'completed_all' ? 'active' : ''}" onclick="filterSemaphoreByStatus('completed_all')">
    🏆 Ciclo 100% (${semCycleCompletedClassesCount})
  </button>
</div>
```

*Depois (Visão Turmas):*
```html
<div class="semaphore-stats-grid">
  <div class="sem-stat-card ${semOverdueClassesCount > 0 ? 'alert-card' : ''}">
    <div class="sem-stat-label">
      ${semOverdueClassesCount > 0 ? `
        <svg class="sem-stat-icon" style="color:var(--red);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      ` : `
        <svg class="sem-stat-icon" style="color:var(--green);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      `}
      <span>Turmas em Atraso</span>
    </div>
    <div class="sem-stat-value">${semOverdueClassesCount}</div>
    <div class="sem-stat-desc">${semOverdueClassesCount === 0 ? 'Nenhum atraso acumulado' : 'Requer intervenção imediata'}</div>
  </div>

  <div class="sem-stat-card">
    <div class="sem-stat-label">
      <svg class="sem-stat-icon" style="color:#1E40AF;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
      <span>Pendentes no ${curBim}</span>
    </div>
    <div class="sem-stat-value">${semInProgressPendingCount}</div>
    <div class="sem-stat-desc">Dentro do prazo regulamentar</div>
  </div>

  <div class="sem-stat-card">
    <div class="sem-stat-label">
      <svg class="sem-stat-icon" style="color:var(--green);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>Concluídas no ${curBim}</span>
    </div>
    <div class="sem-stat-value">${semCompletedCurrentBimCount} <span style="font-size:14px; font-weight:700; color:var(--text-secondary);">/ ${scopedClasses.length}</span></div>
    <div class="sem-stat-desc">${scopedClasses.length > 0 ? Math.round((semCompletedCurrentBimCount / scopedClasses.length) * 100) : 0}% de cobertura bimestral</div>
  </div>

  <div class="sem-stat-card">
    <div class="sem-stat-label">
      <svg class="sem-stat-icon" style="color:#D97706;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2"></path>
        <path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2"></path>
        <path d="M4 22h16"></path>
        <path d="M10 14.66V17c0 .55-.45 1-1 1H7v2h10v-2h-2c-.55 0-1-.45-1-1v-2.34c3.27-.79 5-3.32 5-6.66V3H4v8c0 3.34 1.73 5.87 5 6.66z"></path>
      </svg>
      <span>Avanço do Ciclo Anual</span>
    </div>
    <div class="sem-stat-value">${overallCyclePct}%</div>
    <div class="sem-stat-desc">${totalCompletedObsInCycle} de ${totalAnnualTarget} observações anuais</div>
  </div>
</div>

<!-- Barra de Filtros Rápidos de Status -->
<div class="semaphore-filters-bar">
  <span class="sem-filter-label">Filtrar:</span>
  <button type="button" class="sem-filter-chip ${statusFilter === 'all' ? 'active' : ''}" onclick="filterSemaphoreByStatus('all')">
    Todas (${scopedClasses.length})
  </button>
  <button type="button" class="sem-filter-chip chip-red ${statusFilter === 'overdue' ? 'active' : ''}" onclick="filterSemaphoreByStatus('overdue')">
    <svg class="sem-filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
      <line x1="12" y1="9" x2="12" y2="13"></line>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
    <span>Atrasadas (${semOverdueClassesCount})</span>
  </button>
  <button type="button" class="sem-filter-chip ${statusFilter === 'in_progress' ? 'active' : ''}" onclick="filterSemaphoreByStatus('in_progress')">
    <svg class="sem-filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
    <span>No Prazo (${semInProgressPendingCount})</span>
  </button>
  <button type="button" class="sem-filter-chip chip-green ${statusFilter === 'completed_cur' ? 'active' : ''}" onclick="filterSemaphoreByStatus('completed_cur')">
    <svg class="sem-filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>Concluídas (${semCompletedCurrentBimCount})</span>
  </button>
  <button type="button" class="sem-filter-chip ${statusFilter === 'completed_all' ? 'active' : ''}" onclick="filterSemaphoreByStatus('completed_all')">
    <svg class="sem-filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2"></path>
      <path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2"></path>
      <path d="M4 22h16"></path>
      <path d="M10 14.66V17c0 .55-.45 1-1 1H7v2h10v-2h-2c-.55 0-1-.45-1-1v-2.34c3.27-.79 5-3.32 5-6.66V3H4v8c0 3.34 1.73 5.87 5 6.66z"></path>
    </svg>
    <span>Ciclo 100% (${semCycleCompletedClassesCount})</span>
  </button>
</div>
```

*(Aplicar a mesma substituição estrutural e idêntica na visão Docentes Regentes, ajustando os rótulos correspondentes para `Docentes em Atraso`, `Com Atraso (${semOverdueTeachersCount})`, `Cobertos (${semCompletedCurrentBimTeachersCount})` e `Avanço do Ciclo Docente`).*

---

### Passo 6: Pílulas Semafóricas Bimestrais (`sem-status-pill`) Desktop e Mobile
**Localização:** Na visão Turmas (~linhas 22307 e 22322) e na visão Docentes (~linhas 22498 e 22513).

*Antes:*
```javascript
<span>${st.status === 'completed' ? '✓' : st.status === 'overdue' ? '⚠' : st.status === 'in_progress' ? '⏳' : '○'} ${bName.replace(' Bimestre', 'º')}</span>
```

*Depois:*
```javascript
<span style="display:inline-flex; align-items:center;">
  ${renderSemaphorePillIconSvg(st.status)}
  <span>${bName.replace(' Bimestre', 'º')}</span>
</span>
```

---

### Passo 7: Botões de Ação na Tabela e nos Cards do Semáforo
**Localização:** Nas linhas da tabela e nos cards mobile (~linhas 22356, 22379, 22548, 22551, 22575, 22577).

*Antes:*
```html
<button class="btn btn-secondary btn-action-sem" ...>📅 Agendar</button>
...
<button class="btn btn-secondary btn-action-sem" ...>🔍 Raio-X</button>
```

*Depois:*
```html
<button class="btn btn-secondary btn-action-sem" style="font-size:11px; padding:5px 9px; display:inline-flex; align-items:center; gap:4px;" ...>
  <svg class="btn-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
  <span>Agendar</span>
</button>
...
<button class="btn btn-secondary btn-action-sem" style="font-size:11px; padding:5px 9px; display:inline-flex; align-items:center; gap:4px;" ...>
  <svg class="btn-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
  <span>Raio-X</span>
</button>
```

---

### Passo 8: Sub-aba 1 (Visão Geral & Prioridades Formativas)
1. **Cards Superiores Decisórios:**
   - No Card 2 (~linha 21384): substituir `'✓ 100% das turmas concluídas'` por `'100% das turmas concluídas'` e `'⚠ ...'` por `'... turma(s) pendente(s)'` (adicionando o SVG correspondente no card).
   - Botões de atalho nos cards (~linhas 21756, 21760, 21784, 21805):
     - Substituir `🚦 Semáforo ↓` por SVG de Cronograma/Tabela + `Semáforo ↓`.
     - Substituir `📋 Ver Pendentes` por SVG de Prancheta + `Ver Pendentes`.
     - Substituir `📈 Ver Semáforo do Ciclo ↓` por SVG de Gráfico + `Ver Semáforo do Ciclo ↓`.
     - Substituir `🎯 Ver os 3 Critérios Críticos ↓` por SVG de Alvo + `Ver os 3 Critérios Críticos ↓`.
2. **Tabela Executiva de UEs e Materiais:**
   - Na linha 21564: substituir `🏫 Cobertura e Consistência...` por SVG de Prédio Escolar + `Cobertura e Consistência...`.
   - Na linha 21687: substituir `🎨 Distribuição do Uso de Materiais...` por SVG de Camadas Artísticas + `Distribuição do Uso de Materiais...`.
3. **Bloco de Gargalos Pedagógicos (`renderBottlenecksPrioritySection`):**
   - Na linha 19730: substituir `<span>🎯</span> Foco nos Menores Índices` por SVG de Alvo + `Foco nos Menores Índices`.
   - Na linha 19624: substituir `🎯` por SVG de Alvo.
   - Na linha 19639: substituir `🟢` por SVG de CheckCircle verde.
   - Na linha 19719: substituir `💡` por SVG de Lâmpada/Info.
   - Nos botões de alternância (~linhas 19741, 19744, 19747):
     - `📉 Menor Consistência`: SVG de Tendência Decrescente + `Menor Consistência`
     - `🔻 Maior Desvio vs. Rede`: SVG de Delta/Divergência + `Maior Desvio vs. Rede`
     - `⭐ Maior Consistência`: SVG de Estrela + `Maior Consistência`
   - Na linha 19753: substituir `📋 Copiar Diagnóstico` por SVG de Clipboard + `Copiar Diagnóstico`.
   - Na linha 19704: substituir `🔍 Ver na Visualização por Dimensão` por SVG de Lupa + `Ver na Visualização por Dimensão`.
4. **Banner de Referencial da Rede:**
   - Nas linhas 21843 e 21854: substituir `<span>🏛️</span>` por SVG de Prédio Institucional (`Landmark`).
   - Na linha 21849: substituir `💡` por SVG de Lâmpada/Info (`Lightbulb`).

---

### Passo 9: Sub-aba 2 (Visualização por Dimensão - Drilldown)
1. **Filtro de Consistência (~linhas 21872-21874):**
   *Antes:*
   ```html
   <button type="button" class="btn btn-secondary drilldown-chip-btn" data-range="low" onclick="filterDrilldownByScore('low')">🔴 &lt; 60%</button>
   <button type="button" class="btn btn-secondary drilldown-chip-btn" data-range="med" onclick="filterDrilldownByScore('med')">🟡 60-79%</button>
   <button type="button" class="btn btn-secondary drilldown-chip-btn" data-range="high" onclick="filterDrilldownByScore('high')">🟢 ≥ 80%</button>
   ```
   *Depois:*
   ```html
   <button type="button" class="btn btn-secondary drilldown-chip-btn" data-range="low" onclick="filterDrilldownByScore('low')" style="font-size:11px; padding:4px 8px; font-weight:700; color:var(--red); display:inline-flex; align-items:center;">
     <span class="score-chip-dot dot-red"></span> &lt; 60%
   </button>
   <button type="button" class="btn btn-secondary drilldown-chip-btn" data-range="med" onclick="filterDrilldownByScore('med')" style="font-size:11px; padding:4px 8px; font-weight:700; color:var(--yellow); display:inline-flex; align-items:center;">
     <span class="score-chip-dot dot-yellow"></span> 60-79%
   </button>
   <button type="button" class="btn btn-secondary drilldown-chip-btn" data-range="high" onclick="filterDrilldownByScore('high')" style="font-size:11px; padding:4px 8px; font-weight:700; color:var(--green); display:inline-flex; align-items:center;">
     <span class="score-chip-dot dot-green"></span> ≥ 80%
   </button>
   ```
2. **Campo de Busca (~linha 21865):**
   Substituir placeholder `'🔍 Buscar critério por código ou texto...'` por `'Buscar critério por código ou texto...'`.

---

### Passo 10: Sub-aba 3 (Visão Individual / Dossiê do Avaliando)
1. **Banner de Contexto Individual (~linha 20812):**
   Substituir `<span>👤</span>` por SVG de Usuário (`User`).
2. **Balanço de Critérios (~linhas 20877-20879):**
   Substituir `▲ ${countUp} Progrediram`, `✓ ${countStable} Consolidados`, `⚠ ${countAlert} Atenção` por marcação vetorial com `renderTrendIconSvg()`.
3. **Comentários de Critérios (~linhas 21134 e 21216):**
   Substituir `💬` por SVG de Mensagem/Diálogo (`MessageSquare`).
4. **Ficha Individual para Impressão PDF (`exportTeacherLongitudinalPDF`, ~linha 22783):**
   Garantir que `${trend.icon} ${trend.text}` renderize perfeitamente com os SVGs vetoriais gerados pelo helper.

---

### Passo 11: Cabeçalho de Filtros e Modal Mobile
1. **Seletor de Público-Alvo (`#indicatorsTargetTypeFilter`, linhas 4552-4553 e modal mobile linhas 7851-7852):**
   - Substituir `👩‍🏫 Professores(as)` por `Professores(as)`.
   - Substituir `👤 Coordenadores(as)` por `Coordenadores(as)`.
2. **Badge de Público-Alvo (`#indicatorsTargetTypeBadge`, linha 4556):**
   Substituir `👩‍🏫 Indicadores Docentes` por SVG de Usuários + `Indicadores Docentes`.
3. **Agrupamento Territorial de Polos no Seletor de UEs (~linha 20545):**
   Substituir `<optgroup label="📍 ${pName}">` por `<optgroup label="Polo: ${pName}">`.
4. **Cabeçalho do Modal Mobile (`#modalIndicatorsFiltersMobile`, linha 7836):**
   Substituir `<span>⚙️</span>` por SVG de Filtros/Sliders (`Sliders`).

---

## 4. Critérios de Aceite e Roteiro de Teste

### 4.1 Critérios de Aceite
1. **Erradicação Completa de Emojis em `#screenIndicators`:**
   - Ausência absoluta de emojis (`⚠`, `⏳`, `○`, `🏆`, `🟢`, `🔴`, `⚪`, `🚦`, `🏫`, `👥`, `📅`, `🔍`, etc.) em botões, pílulas de status, cards decisórios, filtros rápidos e cabeçalhos da tela de Painel & Indicadores;
2. **Harmonia Semiótica e Fidelidade Visual:**
   - As pílulas semafóricas exibem ícones SVG nítidos com dimensões proporcionais (12x12px);
   - Os 4 micro-cards mantêm contraste impecável e feedback instantâneo de alerta (vermelho quando houver turmas/docentes em atraso e escudo verde quando não houver atrasos);
   - A barra de filtros rápidos (`Atrasadas`, `No Prazo`, `Concluídas`, `Ciclo 100%`) mantém sua funcionalidade interativa e reativa no clique;
3. **Validação Léxico-Sintática Pré-Voo (JSC):**
   - O comando `python3 audit_platform.py --check-syntax` DEVE retornar 100% de sucesso sem nenhum erro léxico ou sintático;
4. **Integridade da Suíte de Auditoria Modular:**
   - O Módulo 10 (`indicadores_decisao`) e todos os demais 11 módulos DEVEM ser executados com sucesso total via `python3 audit_platform.py --silent-on-success`;
5. **Sincronização de Cópias e Backup:**
   - `gestor supervisao_patos/index.html` e `firebase_deploy/public/index.html` 100% espelhados;
   - Arquivo de backup salvo em `intermediárias/aplicativo_v140_remocao_emojis_painel_indicadores_pictogramas.html`;
   - Versão 1.40 registrada no `CHANGELOG.md` e em `index.html`.

---

## 5. Seção Obrigatória de Auditoria: Alterações / Adições / Exclusões no Algoritmo de Auditoria (`audit_platform.py` e testes do `index.html`)

> [!IMPORTANT]
> **Conformidade com a Cláusula Normativa da Etapa 1:**
> O módulo 10 da auditoria (`indicadores_decisao`, em `index.html`) possui asserções específicas que checam o conteúdo de texto da tela de indicadores. As alterações detalhadas abaixo são **mandatórias** para prevenir falsos negativos durante o teste automatizado.

### 5.1 Alterações nas Asserções Existentes do Módulo 10 (`indicadores_decisao` em `index.html`)

#### 1. Asserção do Filtro Rápido de Status Atrasadas (Turmas)
- **Localização:** Linha 26829 do `index.html`.
- **Condição Atual:**
  ```javascript
  filterSemaphoreByStatus('overdue');
  const overdueSec = document.getElementById('bimesterSemaphoreSection');
  if (!overdueSec || !overdueSec.innerHTML.includes('🔴 Atrasadas')) {
    throw new Error('Falha Pilar 10: Filtro de status atrasadas não refletiu no DOM');
  }
  ```
- **Nova Condição Atualizada:**
  ```javascript
  filterSemaphoreByStatus('overdue');
  const overdueSec = document.getElementById('bimesterSemaphoreSection');
  const activeChip = overdueSec ? overdueSec.querySelector('.sem-filter-chip.chip-red.active') : null;
  if (!overdueSec || !activeChip || !overdueSec.innerHTML.includes('Atrasadas')) {
    throw new Error('Falha Pilar 10: Filtro de status atrasadas não refletiu no DOM ou chip ativo ausente');
  }
  ```
- **Justificativa:** O emoji `🔴` foi removido do texto do botão, sendo substituído pelo pictograma SVG com a classe `.sem-filter-icon` e preservado o texto semântico `Atrasadas` dentro do chip estilizado `.chip-red`.

#### 2. Asserção do Filtro Rápido de Docentes com Atraso
- **Localização:** Linha 26852 do `index.html`.
- **Condição Atual:**
  ```javascript
  filterTeacherSemaphoreByStatus('overdue');
  const overdueTeacherDom = document.getElementById('bimesterSemaphoreSection');
  if (!overdueTeacherDom || !overdueTeacherDom.innerHTML.includes('🔴 Com Atraso')) {
    throw new Error('Falha Pilar 10: Filtro rápido de docentes com atraso não refletiu no DOM');
  }
  ```
- **Nova Condição Atualizada:**
  ```javascript
  filterTeacherSemaphoreByStatus('overdue');
  const overdueTeacherDom = document.getElementById('bimesterSemaphoreSection');
  const activeTeacherChip = overdueTeacherDom ? overdueTeacherDom.querySelector('.sem-filter-chip.chip-red.active') : null;
  if (!overdueTeacherDom || !activeTeacherChip || !overdueTeacherDom.innerHTML.includes('Com Atraso')) {
    throw new Error('Falha Pilar 10: Filtro rápido de docentes com atraso não refletiu no DOM ou chip ativo ausente');
  }
  ```
- **Justificativa:** Idêntica à anterior: eliminação do emoji `🔴` e validação do chip `.chip-red.active` com o texto semântico `Com Atraso`.

### 5.2 Novas Asserções a Serem Adicionadas ao Módulo 10 (`indicadores_decisao`)

Inserir no Módulo 10, logo após a validação do semáforo:
```javascript
// ASSERÇÃO DE PICTOGRAMAS VETORIAIS (SUBSTITUIÇÃO DE EMOJIS NO SEMÁFORO E INDICADORES)
const semContainerTest = document.getElementById('bimesterSemaphoreSection');
if (semContainerTest) {
  const semHtmlTest = semContainerTest.innerHTML;
  // 1. Asserção Positiva: Presença de pictogramas vetoriais nas pílulas semafóricas
  const semPillIcons = semContainerTest.querySelectorAll('.sem-pill-icon');
  if (!semPillIcons || semPillIcons.length === 0) {
    throw new Error('Falha Pictogramas: Pílulas semafóricas não contêm ícones vetoriais SVG (.sem-pill-icon)');
  }
  logger.log('Validação de Pictogramas Vetoriais nas Pílulas Semafóricas (.sem-pill-icon)', true, `${semPillIcons.length} pílulas vetoriais`);

  // 2. Asserção Negativa: Ausência de emojis soltos no cabeçalho e filtros do Semáforo
  const hasRawEmojis = /[⚠⏳○🏆🟢🔴⚪]/.test(semContainerTest.querySelector('.semaphore-filters-bar')?.innerHTML || '');
  if (hasRawEmojis) {
    throw new Error('Falha Pictogramas: Emojis soltos residuais detectados na barra de filtros do Semáforo');
  }
  logger.log('Erradicação confirmada de emojis nos controles do Quadro Longitudinal', true);
}
```

### 5.3 Alterações no Script Python `audit_platform.py`
Nenhuma alteração de código é necessária no arquivo `audit_platform.py`. O script continuará orquestrando a suite através dos endpoints HTTP com validação automática e silenciosa pós-deploy.

---

## 6. Checklist de Execução Operacional (Etapa 2)

- [ ] Ler e assimilar este plano e os normativos de execução (`WORKFLOW_MACOS.md` e skill `execucao-operario`);
- [ ] Aplicar as alterações de CSS e funções auxiliares SVG em `index.html`;
- [ ] Refatorar os blocos HTML/JS de `renderIndicatorsScreen()` e sub-abas (KPIs, Visualização por Dimensão, Quadro Longitudinal e Dossiê Individual);
- [ ] Atualizar as asserções do Módulo 10 da auditoria em `index.html`;
- [ ] Sincronizar simultaneamente a cópia espelhada em `firebase_deploy/public/index.html`;
- [ ] Salvar cópia de segurança em `intermediárias/aplicativo_v140_remocao_emojis_painel_indicadores_pictogramas.html`;
- [ ] Atualizar o Changelog no `CHANGELOG.md` e no `#modalChangelog` / `.btn-changelog` de `index.html`;
- [ ] Validar a integridade sintática: `python3 audit_platform.py --check-syntax`;
- [ ] Verificar concorrência remota: `git fetch origin main` e `git log HEAD..origin/main --oneline`;
- [ ] Comitar e efetuar push para a branch `main`: `git push origin main`;
- [ ] Executar a auditoria pós-deploy: `python3 audit_platform.py --silent-on-success`;
- [ ] Confirmar o sucesso ao usuário de forma limpa e concisa.
