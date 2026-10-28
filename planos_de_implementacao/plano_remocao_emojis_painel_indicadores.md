# Plano de Implementação: Remoção Definitiva de Emojis e Padronização de Pictogramas na Aba Painel & Indicadores

---

## 0. Diretriz de Execução (Obrigatória para o Operário - Etapa 2)
> [!IMPORTANT]
> **Leitura Prévia Obrigatória:** Antes de executar qualquer ação deste plano, o assistente na **Etapa 2 (O Operário)** DEVE consultar e seguir rigorosamente:
> 1. [WORKFLOW_MACOS.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md)
> 2. [WORKFLOW_GITHUB.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_GITHUB.md)
> 3. [.agents/skills/execucao-operario/SKILL.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/.agents/skills/execucao-operario/SKILL.md)
> 4. [.agents/skills/auditoria-plataforma/SKILL.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/.agents/skills/auditoria-plataforma/SKILL.md)
>
> **Trava de Fidelidade, Estabilidade e Não Regressão:** Este plano contempla a higienização visual completa da tela de **Painel & Indicadores** (`#screenIndicators`), incluindo sua barra de filtros superior, botões de relatório, modal móvel de filtros, tags comparativas de benchmark, textos diagnósticos para atas/reuniões, KPIs executivos, acordeões da matriz pedagógica e banner territorial da Rede Municipal.
> Devem ser eliminados todos os emojis Unicode coloridos residuais (`📄`, `📍`, `🔻`, `⚪`, `🟢`, `📋`, `📅`, `🎯`, `💡`, `⚠`, `🏛️`, `🔍`), bem como caracteres geométricos/glifos soltos (`✓`, `▼`, `►`), substituindo-os por pictogramas vetoriais padronizados (*Feather / Lucide* em SVGs inline monocromáticos com classes utilitárias e `stroke="currentColor"`) ou tipografia institucional sóbria.
> Todas as regras de negócio de cálculo estatístico de consistência, cálculo de deltas percentuais, filtros reativos (Unidade, Turma/Docente, Bimestre, Público-Alvo), ordenação de gargalos (Pilar 8), semáforo bimestral (Pilar 10) e RBAC DEVEM permanecer 100% intactas.

---

## 1. Diagnóstico e Contexto

### 1.1 Contexto Institucional e Pedagógico
Na plataforma *SerTão Criança*, a tela **Painel & Indicadores** (`#screenIndicators`) é o instrumento nuclear de apoio à decisão pedagógica da Secretaria Municipal de Educação de Patos/PB. Ela organiza os dados observacionais da Educação Infantil em três perspectivas operacionais:
1. **Visão Geral & Prioridades:** Cards analíticos de consistência pedagógica, cobertura bimestral e meta anual do ciclo letivo, ranking de maiores desvios/gargalos (Pilar 8) e tabela executiva das Unidades Escolares;
2. **Visualização por Dimensão:** Matriz hierárquica completa (Dimensões, Subdimensões e Critérios individuais), com comparação direta entre o desempenho da Unidade/Docente e o Referencial da Rede Municipal de Patos;
3. **Prazos & Turmas (Semáforo Bimestral):** Acompanhamento longitudinal dos 4 bimestres letivos por turma e por docente regente (Pilar 10).

Historicamente, durante os primeiros ciclos de desenvolvimento da plataforma, foram introduzidos emojis do sistema operacional e caracteres gráficos em botões de ação (`📄 PDF`), no badge invisível de acessibilidade (`📍 Carregando filtros...`), nas tags de delta comparativo (`🔻`, `⚪`, `🟢`), nas mensagens de cópia de pauta diagnóstica (`📋`, `📅`, `🎯`, `💡`), nos subtítulos dos KPIs (`⚠`, `✓`), no banner territorial (`🏛️`, `💡`), no campo de busca (`🔍`) e nos controles expansíveis da matriz (`▼`, `►`).

Embora o Semáforo Bimestral já tenha tido suas pílulas convertidas para SVGs vetoriais (`.sem-pill-icon`), a aba de Indicadores manteve esses resíduos nas demais camadas de visualização e interação.

### 1.2 Problemas da Abordagem Anterior
1. **Inconsistência de Renderização Entre Dispositivos:** Emojis Unicode apresentam comportamentos visuais divergentes entre Apple (macOS/iOS com cores gradientes e 3D), Google (Android com traços planos) e Microsoft (Windows com contornos caricatos), quebrando a padronização e seriedade do software público.
2. **Degradação na Impressão e Relatórios:** Na geração de relatórios em PDF ou visualização monocromática em impressoras térmicas da Secretaria, emojis frequentemente sofrem artefatos gráficos, borrões ou aparecem como caracteres não reconhecidos (retângulos "tofu").
3. **Desalinhamento com o Design System Oficial:** Toda a plataforma (Header, Menu Lateral, Matrizes de Referência, Gestão Pedagógica, Síntese Final e Ocorrências) já migrou para o padrão vetorial *Feather / Lucide*. A aba de Indicadores precisa atingir o mesmo padrão profissional.

### 1.3 Mapeamento Detalhado dos Emojis e Símbolos Encontrados
Foram localizados 10 grupos de emojis e glifos soltos na aba de Painel & Indicadores:
1. **`index.html` (L1088):** Emoji `📄` no botão de exportação `#btnExportIndicatorsView` (`📄 PDF`);
2. **`index.html` (L1122):** Emoji `📍` no badge de acessibilidade `#mobileIndFiltersActiveBadge` (`📍 Carregando filtros...`);
3. **`index.html` (L4598):** Glifo `✓` no botão de confirmação `#modalIndicatorsFiltersMobile` (`<span>✓ Aplicar e Fechar</span>`);
4. **`js/features/indicators.js` (L450, L453, L456, L459, L462):** Emojis `🔻`, `⚪`, `🟢` nas tags de delta percentual da função `formatBenchmarkDelta()`;
5. **`js/features/indicators.js` (L628, L629, L631, L642, L651):** Emojis `📋`, `📅`, `🎯`, `💡`, `📋` no texto gerado para clipboard em `copyMeetingAgendaToClipboard()` e no toast de confirmação;
6. **`js/features/indicators.js` (L1031):** Emoji `📍` na montagem dinâmica do texto do badge móvel em `updateMobileIndicatorsActiveBadge()`;
7. **`js/features/indicators.js` (L2291):** Glifo `✓` na definição de `cardIcon` dos cards móveis de raio-x longitudinal individual;
8. **`js/features/indicators.js` (L2526, L2529, L2576):** Glifos `✓` e `⚠` nos subtítulos dos KPIs executivos (Cobertura de Coordenadoras e Dimensão Prioritária);
9. **`js/features/indicators.js` (L2982, L2988, L2993):** Emojis `🏛️` e `💡` no banner territorial `.benchmark-info-bar` da Visualização por Dimensão;
10. **`js/features/indicators.js` (L3004):** Emoji `🔍` no placeholder do input `#drilldownSearchInput`;
11. **`js/features/indicators.js` (L2116, L2173, L3060, L3123):** Caracteres `▼` e `►` usados como marcadores de expansão/colapso dos acordeões de dimensões e subdimensões.

---

## 2. Arquitetura e Pontos de Impacto

### 2.1 Arquivos Afetados
- [index.html](file:///Users/bruno/Desktop/gestor%20supervisao_patos/index.html) (Seção `#screenIndicators` e modal `#modalIndicatorsFiltersMobile`)
- [js/features/indicators.js](file:///Users/bruno/Desktop/gestor%20supervisao_patos/js/features/indicators.js) (Módulo de Indicadores)
- [js/audit/audit_engine.js](file:///Users/bruno/Desktop/gestor%20supervisao_patos/js/audit/audit_engine.js) (Módulo 10: `indicadores_decisao` com novas asserções estritas)
- [CHANGELOG.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/CHANGELOG.md) (Registro sequencial da versão)
- [gestor supervisao_patos/firebase_deploy/public/index.html](file:///Users/bruno/Desktop/gestor%20supervisao_patos/gestor%20supervisao_patos/firebase_deploy/public/index.html) (Cópia espelhada obrigatória)
- [gestor supervisao_patos/firebase_deploy/public/js/features/indicators.js](file:///Users/bruno/Desktop/gestor%20supervisao_patos/gestor%20supervisao_patos/firebase_deploy/public/js/features/indicators.js) (Cópia espelhada obrigatória)

### 2.2 Especificação dos Pictogramas Vetoriais (Design System)
Todos os novos ícones adotam as especificações do Design System *Feather / Lucide*:
- `fill="none"`
- `stroke="currentColor"`
- `stroke-width="2"` (ou `2.5` em ícones pequenos)
- `stroke-linecap="round"`
- `stroke-linejoin="round"`
- Classes utilitárias: `.btn-icon-sm` (16x16px), `.trend-icon-svg` (13x13px) ou estilos inline contextuais.

---

## 3. Especificação de Implementação Passo a Passo (Snippets Exatos)

### Passo 1: Higienização do Botão de Exportação PDF (`index.html`)
Local: Linha ~1088 de `index.html`.
Substituir o emoji `📄` por SVG vetorial padronizado de documento:

```html
<!-- ANTES -->
<button class="btn btn-secondary" id="btnExportIndicatorsView" onclick="exportCurrentIndicatorsView()" title="Exportar Relatório em PDF" style="width:100%; height:42px; font-size:13px; font-weight:700; justify-content:center; display:inline-flex; align-items:center; gap:8px;">
  📄 PDF
</button>

<!-- DEPOIS -->
<button class="btn btn-secondary" id="btnExportIndicatorsView" onclick="exportCurrentIndicatorsView()" title="Exportar Relatório em PDF" style="width:100%; height:42px; font-size:13px; font-weight:700; justify-content:center; display:inline-flex; align-items:center; gap:8px;">
  <svg class="btn-icon-sm" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
  <span>PDF</span>
</button>
```

---

### Passo 2: Higienização do Badge de Acessibilidade Mobile (`index.html`)
Local: Linha ~1122 de `index.html`.
Remover o emoji `📍`:

```html
<!-- ANTES -->
<span id="mobileIndFiltersActiveBadge" style="position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0;">📍 Carregando filtros...</span>

<!-- DEPOIS -->
<span id="mobileIndFiltersActiveBadge" style="position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0;">Carregando filtros...</span>
```

---

### Passo 3: Higienização do Botão de Aplicação no Modal de Filtros Mobile (`index.html`)
Local: Linha ~4598 de `index.html`.
Substituir o glifo `✓` por SVG vetorial padronizado:

```html
<!-- ANTES -->
<button type="button" class="btn btn-primary" onclick="applyAndCloseMobileIndicatorsFilters()" style="flex:2; height:46px; font-weight:800; font-size:13px; display:flex; align-items:center; justify-content:center; gap:6px;">
  <span>✓ Aplicar e Fechar</span>
</button>

<!-- DEPOIS -->
<button type="button" class="btn btn-primary" onclick="applyAndCloseMobileIndicatorsFilters()" style="flex:2; height:46px; font-weight:800; font-size:13px; display:flex; align-items:center; justify-content:center; gap:6px;">
  <svg class="btn-icon-sm" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
  <span>Aplicar e Fechar</span>
</button>
```

---

### Passo 4: Higienização das Tags de Delta Percentual de Benchmark (`js/features/indicators.js`)
Local: Linhas ~449-465 de `js/features/indicators.js` (função `formatBenchmarkDelta`).
Substituir os emojis `🔻`, `⚪` e `🟢` por ícones vetoriais SVG inline reutilizando a classe `.trend-icon-svg`:

```javascript
// ANTES
function formatBenchmarkDelta(delta, isCompact) {
  if (delta === null || delta === undefined) {
    return `<span class="benchmark-delta-tag benchmark-delta-neutral">— Sem dados</span>`;
  }

  if (delta <= -10) {
    const text = isCompact ? `🔻 ${delta}%` : `🔻 ${delta}% · Atenção Crítica`;
    return `<span class="benchmark-delta-tag benchmark-delta-critical">${text}</span>`;
  } else if (delta < 0) {
    const text = isCompact ? `🔻 ${delta}%` : `🔻 ${delta}% · Abaixo da Média`;
    return `<span class="benchmark-delta-tag benchmark-delta-warning">${text}</span>`;
  } else if (delta === 0) {
    const text = isCompact ? `⚪ 0%` : `⚪ 0% · Na Média`;
    return `<span class="benchmark-delta-tag benchmark-delta-neutral">${text}</span>`;
  } else if (delta < 10) {
    const text = isCompact ? `🟢 +${delta}%` : `🟢 +${delta}% · Acima da Média`;
    return `<span class="benchmark-delta-tag benchmark-delta-success">${text}</span>`;
  } else {
    const text = isCompact ? `🟢 +${delta}%` : `🟢 +${delta}% · Destaque Positivo`;
    return `<span class="benchmark-delta-tag benchmark-delta-highlight">${text}</span>`;
  }
}

// DEPOIS
function formatBenchmarkDelta(delta, isCompact) {
  if (delta === null || delta === undefined) {
    return `<span class="benchmark-delta-tag benchmark-delta-neutral">— Sem dados</span>`;
  }

  const iconDown = `<svg class="trend-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`;
  const iconStable = `<svg class="trend-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>`;
  const iconUp = `<svg class="trend-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>`;

  if (delta <= -10) {
    const text = isCompact ? `${delta}%` : `${delta}% · Atenção Crítica`;
    return `<span class="benchmark-delta-tag benchmark-delta-critical" style="display:inline-flex; align-items:center; gap:4px;">${iconDown}<span>${text}</span></span>`;
  } else if (delta < 0) {
    const text = isCompact ? `${delta}%` : `${delta}% · Abaixo da Média`;
    return `<span class="benchmark-delta-tag benchmark-delta-warning" style="display:inline-flex; align-items:center; gap:4px;">${iconDown}<span>${text}</span></span>`;
  } else if (delta === 0) {
    const text = isCompact ? `0%` : `0% · Na Média`;
    return `<span class="benchmark-delta-tag benchmark-delta-neutral" style="display:inline-flex; align-items:center; gap:4px;">${iconStable}<span>${text}</span></span>`;
  } else if (delta < 10) {
    const text = isCompact ? `+${delta}%` : `+${delta}% · Acima da Média`;
    return `<span class="benchmark-delta-tag benchmark-delta-success" style="display:inline-flex; align-items:center; gap:4px;">${iconUp}<span>${text}</span></span>`;
  } else {
    const text = isCompact ? `+${delta}%` : `+${delta}% · Destaque Positivo`;
    return `<span class="benchmark-delta-tag benchmark-delta-highlight" style="display:inline-flex; align-items:center; gap:4px;">${iconUp}<span>${text}</span></span>`;
  }
}
```

---

### Passo 5: Higienização do Resumo Diagnóstico para Reuniões (`js/features/indicators.js`)
Local: Linhas ~628-651 de `js/features/indicators.js` (função `copyMeetingAgendaToClipboard`).
Eliminar emojis `📋`, `📅`, `🎯`, `💡` do texto de ata e do toast:

```javascript
// ANTES
let text = `📋 DIAGNÓSTICO DE CRITÉRIOS PRIORITÁRIOS (GARGALOS) · SERTÃO CRIANÇA\n`;
text += `📅 Data: ${today} | Escopo: ${scopeLabelText} | Segmento: ${targetTypeName}\n`;
text += `------------------------------------------------------------\n`;
text += `🎯 OS 3 CRITÉRIOS PRIORITÁRIOS PARA INTERVENÇÃO PEDAGÓGICA:\n\n`;
...
text += `💡 QUESTÕES NORTEADORAS PARA A EQUIPE:\n`;
...
if (typeof showToast === 'function') {
  showToast('Resumo diagnóstico dos gargalos copiado para a área de transferência! 📋');
}

// DEPOIS
let text = `DIAGNÓSTICO DE CRITÉRIOS PRIORITÁRIOS (GARGALOS) · SERTÃO CRIANÇA\n`;
text += `Data: ${today} | Escopo: ${scopeLabelText} | Segmento: ${targetTypeName}\n`;
text += `------------------------------------------------------------\n`;
text += `OS 3 CRITÉRIOS PRIORITÁRIOS PARA INTERVENÇÃO PEDAGÓGICA:\n\n`;
...
text += `QUESTÕES NORTEADORAS PARA A EQUIPE:\n`;
...
if (typeof showToast === 'function') {
  showToast('Resumo diagnóstico dos gargalos copiado para a área de transferência!');
}
```

---

### Passo 6: Higienização do Texto Dinâmico do Badge Mobile (`js/features/indicators.js`)
Local: Linha ~1031 de `js/features/indicators.js` (função `updateMobileIndicatorsActiveBadge`).
Remover o prefixo `📍 `:

```javascript
// ANTES
badgeEl.innerText = `📍 ${unitLabel} · ${memberLabel} · ${bimLabel}`;

// DEPOIS
badgeEl.innerText = `${unitLabel} · ${memberLabel} · ${bimLabel}`;
```

---

### Passo 7: Higienização dos Cards Mobile de Raio-X Individual (`js/features/indicators.js`)
Local: Linhas ~2280-2307 de `js/features/indicators.js`.
Substituir o caractere `✓` por renderização de SVG vetorial:

```javascript
// ANTES
if (trend.cssClass === 'badge-trend-up') {
  cardBg = '#F0FDF4';
  cardBorder = '#BBF7D0';
  cardIcon = '+';
  cardIconColor = '#16A34A';
} else if (trend.cssClass === 'badge-trend-stable') {
  cardBg = '#F8FAFC';
  cardBorder = '#CBD5E1';
  cardIcon = '✓';
  cardIconColor = '#475569';
} else if (trend.cssClass === 'badge-trend-alert' || trend.cssClass === 'badge-trend-down') {
  cardBg = '#FEF2F2';
  cardBorder = '#FECACA';
  cardIcon = '−';
  cardIconColor = '#DC2626';
}

// DEPOIS
const trendSvg = renderTrendIconSvg(trend.cssClass);
if (trend.cssClass === 'badge-trend-up') {
  cardBg = '#F0FDF4';
  cardBorder = '#BBF7D0';
  cardIconColor = '#16A34A';
} else if (trend.cssClass === 'badge-trend-stable') {
  cardBg = '#F8FAFC';
  cardBorder = '#CBD5E1';
  cardIconColor = '#475569';
} else if (trend.cssClass === 'badge-trend-alert' || trend.cssClass === 'badge-trend-down') {
  cardBg = '#FEF2F2';
  cardBorder = '#FECACA';
  cardIconColor = '#DC2626';
}
```
E na montagem do HTML do card (linha ~2303):
```javascript
// ANTES
${cardIcon ? `
  <span style="position:absolute; top:8px; right:10px; font-size:15px; font-weight:900; color:${cardIconColor}; line-height:1;" title="${trend.text}">
    ${cardIcon}
  </span>
` : ''}

// DEPOIS
<span style="position:absolute; top:8px; right:10px; color:${cardIconColor}; display:flex; align-items:center;" title="${trend.text}">
  ${trendSvg}
</span>
```

---

### Passo 8: Higienização dos Subtítulos de KPIs Decisórios (`js/features/indicators.js`)
Local: Linhas ~2526, 2529 e 2576 de `js/features/indicators.js`.
Remover os glifos `✓` e `⚠` dos textos de subtítulo:

```javascript
// ANTES
kpiCoverageSubtitle = '✓ 100% das coordenadoras atendidas';
...
kpiCoverageSubtitle = `⚠ ${pendingEntitiesCurrentBim} coord. pendente(s)`;
...
lowestDimSubtitle = '✓ Todas as dimensões consistentes';

// DEPOIS
kpiCoverageSubtitle = '100% das coordenadoras atendidas';
...
kpiCoverageSubtitle = `${pendingEntitiesCurrentBim} coord. pendente(s)`;
...
lowestDimSubtitle = 'Todas as dimensões consistentes';
```

---

### Passo 9: Higienização do Banner Territorial da Rede (`js/features/indicators.js`)
Local: Linhas ~2980-2998 de `js/features/indicators.js` (banner `.benchmark-info-bar`).
Substituir os emojis `🏛️` e `💡` por SVG vetorial de instituição e informação:

```javascript
// ANTES
<div class="benchmark-info-bar">
  ${(scopeLabelText === 'Rede Consolidada' || (activeUnitFilter === 'ALL' && !user.schoolKey && user.roleKey !== 'coordenador')) ? `
    <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; width:100%;">
      <div style="display:flex; align-items:center; gap:8px;">
        <span style="font-size:16px;">🏛️</span>
        <span>
          <strong>Panorama Geral da Rede Municipal:</strong> Exibindo a média consolidada de Patos/PB (${redeObs.length} observação(ões) na base).
        </span>
      </div>
      <span style="font-size:11px; background:#DCFCE7; color:#166534; padding:3px 8px; border-radius:4px; font-weight:700;">
        💡 Selecione uma Escola no filtro para comparar com a Rede
      </span>
    </div>
  ` : `
    <div style="display:flex; align-items:center; gap:8px;">
      <span style="font-size:16px;">🏛️</span>
      <span>
        <strong>Referencial da Rede Municipal:</strong> Comparando <strong>${scopeLabelText}</strong> com a <strong>Média Geral da Rede Municipal (${redeObs.length} observação(ões) na base)</strong>.
      </span>
    </div>
  `}
</div>

// DEPOIS
const institutionIconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><line x1="3" y1="21" x2="21" y2="21"></line><line x1="3" y1="10" x2="21" y2="10"></line><polyline points="3 10 12 3 21 10"></polyline><line x1="6" y1="21" x2="6" y2="10"></line><line x1="10" y1="21" x2="10" y2="10"></line><line x1="14" y1="21" x2="14" y2="10"></line><line x1="18" y1="21" x2="18" y2="10"></line></svg>`;

const infoTipIconSvg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;

<div class="benchmark-info-bar">
  ${(scopeLabelText === 'Rede Consolidada' || (activeUnitFilter === 'ALL' && !user.schoolKey && user.roleKey !== 'coordenador')) ? `
    <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; width:100%;">
      <div style="display:flex; align-items:center; gap:8px;">
        <span style="color:var(--primary); display:flex; align-items:center;">${institutionIconSvg}</span>
        <span>
          <strong>Panorama Geral da Rede Municipal:</strong> Exibindo a média consolidada de Patos/PB (${redeObs.length} observação(ões) na base).
        </span>
      </div>
      <span style="font-size:11px; background:#DCFCE7; color:#166534; padding:4px 10px; border-radius:6px; font-weight:700; display:inline-flex; align-items:center; gap:5px;">
        ${infoTipIconSvg}
        <span>Selecione uma Escola no filtro para comparar com a Rede</span>
      </span>
    </div>
  ` : `
    <div style="display:flex; align-items:center; gap:8px;">
      <span style="color:var(--primary); display:flex; align-items:center;">${institutionIconSvg}</span>
      <span>
        <strong>Referencial da Rede Municipal:</strong> Comparando <strong>${scopeLabelText}</strong> com a <strong>Média Geral da Rede Municipal (${redeObs.length} observação(ões) na base)</strong>.
      </span>
    </div>
  `}
</div>
```

---

### Passo 10: Higienização do Campo de Busca na Matriz de Critérios (`js/features/indicators.js`)
Local: Linha ~3004 de `js/features/indicators.js`.
Remover o emoji `🔍` do placeholder:

```html
<!-- ANTES -->
<input type="search" id="drilldownSearchInput" class="form-control" placeholder="🔍 Buscar critério por código ou texto..." oninput="onDrilldownSearch(this.value)" style="height:38px; font-size:12px; width:100%; max-width:380px;">

<!-- DEPOIS -->
<input type="search" id="drilldownSearchInput" class="form-control" placeholder="Buscar critério por código ou texto..." oninput="onDrilldownSearch(this.value)" style="height:38px; font-size:12px; width:100%; max-width:380px;">
```

---

### Passo 11: Padronização dos Chevrons nos Acordeões da Matriz Pedagógica (`js/features/indicators.js`)
Local: Linhas 2116, 2173, 3060, 3123 de `js/features/indicators.js`.
Substituir os caracteres `▼` e `►` por chevrons vetoriais SVG inline:

```javascript
// Helper auxiliar ou inline SVG
const chevronSvg = (isOpen, size = 16) => `
  <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0; transition:transform 0.2s ease; transform:rotate(${isOpen ? '90deg' : '0deg'});">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
`;
```
Substituindo nos 4 locais:
- L2116: `<span style="display:flex; align-items:center;">${chevronSvg(isDimOpen, 16)}</span>`
- L2173: `<span style="display:flex; align-items:center; color:var(--text-secondary);">${chevronSvg(isSubOpen, 13)}</span>`
- L3060: `<span style="display:flex; align-items:center;">${chevronSvg(isDimOpen, 18)}</span>`
- L3123: `<span style="display:flex; align-items:center; color:var(--text-secondary);">${chevronSvg(isSubOpen, 13)}</span>`

---

## 4. Critérios de Aceite e Roteiro de Teste

### 4.1 Critérios de Aceite
1. **Ausência Completa de Emojis:** Nenhum caractere emoji Unicode (`📄`, `📍`, `🔻`, `⚪`, `🟢`, `📋`, `📅`, `🎯`, `💡`, `⚠`, `🏛️`, `🔍`) deve ser renderizado no DOM do `#screenIndicators` ou no modal `#modalIndicatorsFiltersMobile`.
2. **Qualidade Vetorial:** Todos os novos pictogramas devem utilizar SVGs com `fill="none"`, `stroke="currentColor"` e dimensões proporcionais às classes utilitárias do sistema.
3. **Preservação de Integridade Operacional:**
   - O botão `#btnExportIndicatorsView` continua disparando `exportCurrentIndicatorsView()` e imprimindo o relatório em PDF normalmente;
   - O campo de busca `#drilldownSearchInput` continua filtrando a árvore de critérios em tempo real via `onDrilldownSearch()`;
   - O botão `copyMeetingAgendaToClipboard()` continua copiando para a área de transferência a síntese dos gargalos de forma legível e sem erros;
   - A sincronização e aplicação de filtros móveis pelo modal `#modalIndicatorsFiltersMobile` continua 100% funcional;
   - Os cálculos matemáticos de consistência e os deltas de benchmark permanecem inalterados.
4. **Validação Sintática JSC Pré-Voo:** `python3 audit_platform.py --check-syntax` deve retornar 100% de sucesso sem warnings ou erros de parse.
5. **Auditoria Modular Completa:** A suíte de 12 módulos canônicos via `python3 audit_platform.py --silent-on-success` deve executar com aprovação de 100%.

### 4.2 Roteiro de Teste Manual e Headless
1. Executar a checagem sintática léxica:
   ```bash
   python3 audit_platform.py --check-syntax
   ```
2. Executar a auditoria headless com foco no Módulo 10:
   ```bash
   python3 audit_platform.py -m indicadores_decisao
   ```
3. Executar a auditoria completa de ponta a ponta:
   ```bash
   python3 audit_platform.py --silent-on-success
   ```

---

## 5. Seção Obrigatória de Auditoria (`audit_platform.py` e `js/audit/audit_engine.js`)

### 5.1 Alterações no `audit_platform.py`
- Nenhuma alteração de infraestrutura é necessária no script Python orquestrador. Ele continuará sendo executado com `--check-syntax` no pré-commit e `--silent-on-success` pós-deploy.

### 5.2 Adições e Refinamentos no `js/audit/audit_engine.js` (Módulo 10: `indicadores_decisao`)
No Módulo 10 (`indicadores_decisao`), após a validação do Semáforo Bimestral (linha ~2500):
1. **Adicionar asserção estrita de ausência de emojis em toda a tela `#screenIndicators`:**
   ```javascript
   // ASSERÇÃO DE HIGIENIZAÇÃO VISUAL: AUSÊNCIA DE EMOJIS NO PAINEL & INDICADORES
   const indScreen = document.getElementById('screenIndicators');
   const indRawEmojisRegex = /[📄📍🏛💡🔍🔻⚪🟢⚠📋📅🎯]/;
   if (indScreen && indRawEmojisRegex.test(indScreen.innerHTML)) {
     throw new Error('Falha Pictogramas: Emojis residuais detectados no DOM do Painel & Indicadores');
   }
   logger.log('Erradicação completa de emojis na aba Painel & Indicadores confirmada', true);
   ```
2. **Validar a presença do pictograma SVG no botão de PDF:**
   ```javascript
   const btnPdf = document.getElementById('btnExportIndicatorsView');
   if (!btnPdf || !btnPdf.querySelector('svg')) {
     throw new Error('Botão de exportação PDF (#btnExportIndicatorsView) deve conter pictograma SVG');
   }
   logger.log('Validação de pictograma vetorial no botão de exportação PDF', true);
   ```
3. **Validar a presença do SVG institucional no banner do Referencial da Rede:**
   ```javascript
   const benchmarkBar = indScreen.querySelector('.benchmark-info-bar');
   if (benchmarkBar && !benchmarkBar.querySelector('svg')) {
     throw new Error('Banner do Referencial da Rede (.benchmark-info-bar) deve conter pictograma SVG de instituição');
   }
   logger.log('Validação de pictograma institucional na barra de benchmark da Rede', true);
   ```

### 5.3 Exclusões na Suíte de Testes
- Nenhuma exclusão de asserções existentes é necessária. A asserção do Pilar 9 que checa `mobileActiveBadge.innerText.includes('1º Bim')` é preservada, pois o texto mantido continuará contendo `'1º Bim'`.
