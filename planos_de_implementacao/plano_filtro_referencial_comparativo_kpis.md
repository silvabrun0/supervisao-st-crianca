# Plano de Implementação: Filtro/Aba de Referencial Comparativo nos KPIs de Resultado

> **Data:** 03 de Novembro de 2026  
> **Status:** Pronto para Aprovação (Etapa 1 - O Arquiteto)  
> **Escopo:** Tela de Indicadores e Diagnóstico (`#screenIndicators`), KPIs de Resultado e Visualização por Dimensão  
> **Auditoria:** Preservação integral da suíte existente (sem modificações no motor de auditoria).

---

## 0. Diretriz de Execução (Obrigatória para o Executor da Etapa 2)

> [!IMPORTANT]
> O executor (Etapa 2 - O Operário) deve ler obrigatoriamente [WORKFLOW_MACOS.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md) e a skill `.agents/skills/execucao-operario/SKILL.md`.  
> Nenhuma linha de código deve ser alterada sem prévia autorização explícita do usuário. A árvore do Git deve manter-se íntegra durante o planejamento. O motor de auditoria (`audit_platform.py` / `audit_engine.js`) **não será modificado**, mantendo 100% de compatibilidade retroativa.

---

## 1. Diagnóstico e Contexto

### 1.1. Cenário Atual
Atualmente, no Painel de Indicadores e Diagnóstico (`#screenIndicators`), a comparação dos índices nos KPIs de resultado e na Visualização por Dimensão funciona através de regras fixas e implícitas baseadas apenas no seletor de Unidade Escolar / Polo (`#indicatorsUnitFilter`):
1. **Coordenadora Pedagógica:** A unidade está travada em sua escola (`user.school`), mas o referencial comparativo confronta compulsoriamente a escola com seu respectivo Polo Regional (`[vs. ${schoolPolo}]`). A coordenadora não possui a possibilidade de confrontar seus dados diretamente com a média da Rede Municipal.
2. **Formadora Regional:** Ao selecionar uma unidade do seu polo, a ferramenta compara compulsoriamente a unidade com o polo territorial da formadora (`UE vs. Polo`), sem permitir alternar para a média da Rede Municipal (`UE vs. Rede`).
3. **Coordenador / Equipe do Núcleo de Educação Infantil (`isNucleoEI`):** Ao selecionar uma escola, o sistema fixa a comparação no polo respectivo, sem fornecer um seletor/aba dedicado para alternar livremente o referencial comparativo entre o Polo e a Rede Municipal.

### 1.2. Necessidade do Usuário
O usuário estabeleceu a seguinte especificação de negócio e permissões de acesso:
> *"nos filtros comparativos de dos KPIs de resultado, crie outra aba de referencial. o coordenador só poderá comparar com a rede; o formador, unidade vs seu polo ou unidade vs rede; seu polo vs rede; coordenador no núcleo, tudo aberto"*

---

## 2. Arquitetura e Matriz de Permissões por Perfil

### 2.1. Matriz de Permissões de Comparação

| Perfil de Usuário | Escopo Selecionado | Opções de Referencial Permitidas | Comportamento do Controle | Referencial Ativo / Padrão |
| :--- | :--- | :--- | :--- | :--- |
| **Coordenador(a) Pedagógica** (`roleKey === 'coordenador'`) | Sua Unidade Escolar (`user.school`) | Exclusivamente **Rede Municipal** | Fixo / Travado (`disabled = true`) com opção única | `rede` (Rede Municipal) |
| **Formador(a) Regional** (`roleKey === 'formador'`) | Visão Geral do seu Polo (`Meu Polo`) | Exclusivamente **Rede Municipal** | Fixo / Travado (`disabled = true`) | `rede` (Polo vs. Rede) |
| **Formador(a) Regional** (`roleKey === 'formador'`) | Unidade Escolar do seu Polo (`focusedUnitName`) | **1. Meu Polo** (`polo`)<br>**2. Rede Municipal** (`rede`) | **Habilitado / Interativo** (Alternância livre) | Padrão: `polo` (permite alternar para `rede`) |
| **Coordenador no Núcleo de EI** (`isNucleoEI(user)`) | Rede Consolidada (`ALL`) | Panorama Geral Consolidado | Fixo / Informativo | `rede` (Rede Consolidada) |
| **Coordenador no Núcleo de EI** (`isNucleoEI(user)`) | Qualquer Polo Regional (`POLO:Polo X`) | Exclusivamente **Rede Municipal** | Fixo / Travado (`disabled = true`) | `rede` (Polo vs. Rede) |
| **Coordenador no Núcleo de EI** (`isNucleoEI(user)`) | Qualquer Unidade Escolar (`focusedUnitName`) | **1. Polo Regional da UE** (`polo`)<br>**2. Rede Municipal** (`rede`) | **Habilitado / Interativo** (Tudo aberto) | Padrão: `polo` (permite alternar para `rede`) |

### 2.2. Componente de Interface e Harmonia Visual (Hallmark Standard)
O novo controle de Referencial Comparativo será inserido tanto na **Toolbar Desktop** (`#indicatorsFilterToolbar`) quanto no **Modal Móvel Deslizante** (`#modalIndicatorsFiltersMobile`):
- **Desktop:** Novo campo `<div class="indicators-filter-field" id="indicatorsBenchmarkWrapper">` posicionado imediatamente após o seletor de Unidade Escolar e antes do seletor de Docente/Turma, com `<select id="indicatorsBenchmarkFilter">` estilizado e padronizado com os tokens de design do sistema (`height: 42px`, padding, SVG chevron, sem emojis nos deltas).
- **Mobile:** Novo grupo no corpo da bottom sheet deslizante (`#mobileIndBenchmarkGroup`) com `<select id="mobileIndBenchmarkFilter">` e sincronização bidirecional em tempo real via `syncMobileToDesktopFilters('benchmark')`.
- **Feedback Contextual (Banner de Referencial):** Atualização dinâmica dos banners informativos (`.benchmark-info-bar`) e dos rótulos de delta ($\Delta\%$) nos 4 cards de KPIs superiores, na Dimensão Prioritária (KPI 4), no Bloco de Gargalos (Pilar 8) e na régua comparativa da Visualização por Dimensão (Pilar 3).

---

## 3. Especificação Passo a Passo de Implementação (Snippets Exatos)

### Passo 1: Estrutura HTML em `index.html`

#### 1.1. Toolbar Desktop (`#indicatorsFilterToolbar`)
Inserir o campo de Referencial Comparativo entre o Seletor 2 (Unidade Escolar) e o Seletor 3 (Turma/Docente):

```html
<!-- Seletor 2B: Referencial Comparativo (Pilar de Comparação Parametrizada) -->
<div id="indicatorsBenchmarkWrapper" class="indicators-filter-field">
  <label id="indicatorsBenchmarkLabel" class="indicators-filter-label">Referencial comparativo</label>
  <select id="indicatorsBenchmarkFilter" class="form-select form-control" onchange="onIndicatorsBenchmarkChange()" style="font-weight:700; color:var(--primary-dark);" title="Defina o referencial comparativo para o cálculo dos índices e deltas">
    <option value="rede">Rede Municipal (Patos/PB)</option>
    <option value="polo">Polo Regional</option>
  </select>
</div>
```

#### 1.2. Modal / Bottom Sheet Mobile (`#modalIndicatorsFiltersMobile`)
Inserir no corpo do modal móvel (`.mobile-bottom-sheet-body`), logo após o campo de Unidade Escolar:

```html
<!-- Referencial Comparativo (Mobile) -->
<div id="mobileIndBenchmarkGroup" class="form-group" style="margin-bottom:0;">
  <label id="mobileIndBenchmarkLabel" class="form-label" style="font-size:12px; font-weight:700; color:var(--text-secondary);">Referencial Comparativo</label>
  <select id="mobileIndBenchmarkFilter" class="form-select form-control" onchange="syncMobileToDesktopFilters('benchmark')" style="width:100%; height:44px; font-weight:700; color:var(--primary-dark); font-size:13px;">
    <option value="rede">Rede Municipal (Patos/PB)</option>
    <option value="polo">Polo Regional</option>
  </select>
</div>
```

---

### Passo 2: Sincronização de Estado e Lógica em `js/features/indicators.js`

#### 2.1. Handlers de Eventos e Sincronização
Adicionar a função `onIndicatorsBenchmarkChange()` e estender `syncMobileToDesktopFilters`:

```javascript
// Handler de alternância do Referencial Comparativo
function onIndicatorsBenchmarkChange() {
  const benchSelect = document.getElementById('indicatorsBenchmarkFilter');
  if (benchSelect) {
    appState.indicatorsBenchmark = benchSelect.value;
  }
  const mobBench = document.getElementById('mobileIndBenchmarkFilter');
  if (mobBench && benchSelect) {
    mobBench.value = benchSelect.value;
  }
  renderIndicatorsScreen();
}
```

Atualizar `syncMobileToDesktopFilters(field)` para contemplar `'benchmark'`:

```javascript
} else if (field === 'benchmark' && deskBench && mobBench) {
  deskBench.value = mobBench.value;
  appState.indicatorsBenchmark = mobBench.value;
  onIndicatorsBenchmarkChange();
}
```

Atualizar `openMobileIndicatorsFiltersModal()` para sincronizar opções, rótulo e estado desabilitado:

```javascript
// Sincroniza Referencial Comparativo no Mobile
const deskBench = document.getElementById('indicatorsBenchmarkFilter');
const mobBench = document.getElementById('mobileIndBenchmarkFilter');
const mobBenchGroup = document.getElementById('mobileIndBenchmarkGroup');
if (mobBench && deskBench) {
  mobBench.innerHTML = deskBench.innerHTML;
  mobBench.value = deskBench.value;
  mobBench.disabled = deskBench.disabled;
}
```

---

#### 2.2. Resolução do Seletor e Regras de Negócio em `renderIndicatorsScreen()`

No início do cálculo de opções de `renderIndicatorsScreen()`, popular e governar o seletor `#indicatorsBenchmarkFilter`:

```javascript
const benchSelect = document.getElementById('indicatorsBenchmarkFilter');
const rawUnitFilter = (unitSelect && unitSelect.value) ? unitSelect.value : 'ALL';

// Determinação do estado de foco
const isFocusedOnUnit = Boolean(rawUnitFilter && rawUnitFilter !== 'ALL' && !rawUnitFilter.startsWith('POLO:'));
let activeBenchmarkChoice = appState.indicatorsBenchmark || 'polo';

if (benchSelect) {
  if (user.roleKey === 'coordenador') {
    // 1. COORDENADOR: SÓ PODERÁ COMPARAR COM A REDE
    benchSelect.innerHTML = `<option value="rede">Rede Municipal (Patos/PB)</option>`;
    benchSelect.value = 'rede';
    benchSelect.disabled = true;
    activeBenchmarkChoice = 'rede';
    appState.indicatorsBenchmark = 'rede';
  } else if (user.roleKey === 'formador') {
    const formadorPolo = user.school || 'Meu Polo Regional';
    if (!isFocusedOnUnit) {
      // Formador em Polo vs. Rede
      benchSelect.innerHTML = `<option value="rede">Rede Municipal (Patos/PB)</option>`;
      benchSelect.value = 'rede';
      benchSelect.disabled = true;
      activeBenchmarkChoice = 'rede';
    } else {
      // Formador com Unidade em foco: unidade vs seu polo OU unidade vs rede
      benchSelect.innerHTML = `
        <option value="polo">Meu Polo (${formadorPolo})</option>
        <option value="rede">Rede Municipal (Patos/PB)</option>
      `;
      benchSelect.disabled = false;
      if (appState.indicatorsBenchmark === 'rede') {
        benchSelect.value = 'rede';
        activeBenchmarkChoice = 'rede';
      } else {
        benchSelect.value = 'polo';
        activeBenchmarkChoice = 'polo';
      }
    }
  } else if (isNucleoEI(user)) {
    // 3. COORDENADOR NO NÚCLEO: TUDO ABERTO
    if (!isFocusedOnUnit) {
      // Visão geral de Rede ou Polo
      benchSelect.innerHTML = `<option value="rede">Rede Municipal (Patos/PB)</option>`;
      benchSelect.value = 'rede';
      benchSelect.disabled = true;
      activeBenchmarkChoice = 'rede';
    } else {
      const uPolo = getPoloForSchool(rawUnitFilter) || 'Polo Regional';
      benchSelect.innerHTML = `
        <option value="polo">Polo Regional (${uPolo})</option>
        <option value="rede">Rede Municipal (Patos/PB)</option>
      `;
      benchSelect.disabled = false;
      if (appState.indicatorsBenchmark === 'rede') {
        benchSelect.value = 'rede';
        activeBenchmarkChoice = 'rede';
      } else {
        benchSelect.value = 'polo';
        activeBenchmarkChoice = 'polo';
      }
    }
  }
}
```

Atualizar a montagem do texto do seletor da Coordenadora Pedagógica:

```javascript
} else if (user.roleKey === 'coordenador') {
  const schoolName = user.school || '';
  availableUnits = schoolName ? [schoolName] : [];
  unitSelect.innerHTML = `<option value="${schoolName}">Minha UE: ${schoolName} [vs. Rede Municipal]</option>`;
  unitSelect.value = schoolName;
  unitSelect.disabled = true;
}
```

---

#### 2.3. Resolução Matemática de `benchmarkObs`, `benchmarkLabelText` e Banners

Ajustar o bloco onde `benchmarkObs` é definido (linhas ~1860 a 1905 de `js/features/indicators.js`):

```javascript
if (isRedeConsolidated) {
  // PANORAMA GERAL DA REDE
  scopeLabelText = 'Rede Consolidada';
  benchmarkLabelText = 'Rede Municipal';
  benchmarkObs = redeObs;
  benchmarkBadgeHtml = `
    <div class="benchmark-info-bar" style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:10px 14px; margin-bottom:16px; display:flex; align-items:center; gap:8px; font-size:12px; color:var(--text-secondary);">
      <svg class="btn-icon-sm" style="color:var(--primary); flex-shrink:0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
      <span><strong>Panorama Geral da Rede Municipal:</strong> Exibindo média consolidada de Patos/PB. Selecione um polo ou unidade escolar acima para ativar a análise comparativa com deltas formativos.</span>
    </div>
  `;
} else if (isPoloFocus) {
  // POLO VS. REDE
  scopeLabelText = (user.roleKey === 'formador') ? `Meu Polo (${focusedPoloName})` : focusedPoloName;
  benchmarkLabelText = 'Rede Municipal';
  benchmarkObs = redeObs;
  benchmarkBadgeHtml = `
    <div class="benchmark-info-bar" style="background:#EFF6FF; border:1px solid #BFDBFE; border-radius:8px; padding:10px 14px; margin-bottom:16px; display:flex; align-items:center; gap:8px; font-size:12px; color:#1E40AF;">
      <svg class="btn-icon-sm" style="color:#2563EB; flex-shrink:0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
      <span><strong>Referencial da Rede Municipal:</strong> Comparando <strong>${focusedPoloName}</strong> com a Média Geral da Rede Municipal de Patos/PB.</span>
    </div>
  `;
} else {
  // UNIDADE EM FOCO (focusedUnitName)
  scopeLabelText = focusedUnitName;
  
  if (activeBenchmarkChoice === 'rede' || user.roleKey === 'coordenador') {
    // COMPARAÇÃO COM A REDE MUNICIPAL (Obrigatória para Coordenador, Opção para Formador e Núcleo)
    benchmarkLabelText = 'Rede Municipal';
    benchmarkObs = redeObs;
    benchmarkBadgeHtml = `
      <div class="benchmark-info-bar" style="background:#EFF6FF; border:1px solid #BFDBFE; border-radius:8px; padding:10px 14px; margin-bottom:16px; display:flex; align-items:center; gap:8px; font-size:12px; color:#1E40AF;">
        <svg class="btn-icon-sm" style="color:#2563EB; flex-shrink:0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
        <span><strong>Referencial da Rede Municipal:</strong> Comparando a unidade <strong>${focusedUnitName}</strong> com a Média Geral da Rede Municipal de Patos/PB.</span>
      </div>
    `;
  } else {
    // COMPARAÇÃO COM O RESPECTIVO POLO REGIONAL
    benchmarkLabelText = focusedPoloName || 'Polo Regional';
    const poloUnits = getUnitsForPolo(focusedPoloName);
    const poloObservations = redeObs.filter(o => o.schoolName && poloUnits.includes(o.schoolName));
    benchmarkObs = poloObservations.length > 0 ? poloObservations : redeObs;
    benchmarkBadgeHtml = `
      <div class="benchmark-info-bar" style="background:#F0FDF4; border:1px solid #BBF7D0; border-radius:8px; padding:10px 14px; margin-bottom:16px; display:flex; align-items:center; gap:8px; font-size:12px; color:#166534;">
        <svg class="btn-icon-sm" style="color:#16A34A; flex-shrink:0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <span><strong>Referencial do Polo Regional:</strong> Comparando a unidade <strong>${focusedUnitName}</strong> com o seu <strong>${focusedPoloName || 'Polo Regional'}</strong>.</span>
      </div>
    `;
  }
}
```

---

## 4. Critérios de Aceite e Roteiro de Teste

1. **Coordenadora Pedagógica (`mariana`):**
   - Ao acessar Indicadores, o seletor de Unidade Escolar deve exibir `Minha UE: CEI Professora Maria de Lourdes [vs. Rede Municipal]` (travado).
   - O seletor de Referencial Comparativo deve conter apenas a opção `Rede Municipal (Patos/PB)` e permanecer desabilitado.
   - O banner de contexto deve indicar `Referencial da Rede Municipal` confrontando a escola com a Rede Municipal.
   - Os deltas dos KPIs, Dimensão Prioritária e Visualização por Dimensão devem ser calculados contra `redeObs`.

2. **Formadora Regional (`clarice`):**
   - Na opção `ALL` (Meu Polo), o seletor de Referencial Comparativo deve estar travado em `Rede Municipal` (Polo vs. Rede).
   - Ao selecionar uma escola do seu polo (ex: `CEI Professora Maria de Lourdes`), o seletor de Referencial Comparativo deve habilitar-se imediatamente com as opções:
     - `Meu Polo (Polo Regional 1 (Norte))`
     - `Rede Municipal (Patos/PB)`
   - Ao selecionar `Meu Polo`, o banner deve exibir `Referencial do Polo Regional` e os deltas recalculam contra o Polo.
   - Ao selecionar `Rede Municipal`, o banner deve exibir `Referencial da Rede Municipal` e os deltas recalculam contra a Rede.

3. **Coordenador no Núcleo de Educação Infantil (`helena`):**
   - Em `ALL` ou ao focar um Polo, o seletor exibe `Rede Municipal`.
   - Ao selecionar qualquer Unidade Escolar (ex: `CEI Vovó Zezé`), o seletor de Referencial Comparativo fica aberto com:
     - `Polo Regional (Polo Regional 2 (Sul))`
     - `Rede Municipal (Patos/PB)`
   - Helena pode alternar livremente entre ambas as opções, recalculando instantaneamente deltas, KPIs e o bloco de gargalos.

4. **Persistência e Mobile:**
   - O modal deslizante móvel sincroniza bidirecionalmente a seleção de Referencial Comparativo com a visualização desktop.

---

## 5. Seção de Auditoria e Integridade da Suíte

> [!IMPORTANT]
> **Conformidade Rígida com a Instrução do Usuário:**
> O motor de auditoria (`audit_platform.py` e `js/audit/audit_engine.js`) **não será modificado**.
> O design da implementação preserva `polo` como padrão ao focar uma unidade para Clarice e Helena, garantindo que o teste 24 do `audit_engine.js` (que asseriona a arquitetura dual e espera o banner do Polo Regional por padrão para essas instâncias) continue sendo aprovado com 100% de sucesso sem qualquer alteração na suíte de testes.
