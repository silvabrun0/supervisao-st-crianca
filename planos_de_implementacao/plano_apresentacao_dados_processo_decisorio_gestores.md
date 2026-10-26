# PLANO DE IMPLEMENTAÇÃO: APRESENTAÇÃO DE DADOS ORIENTADA AO PROCESSO DECISÓRIO DOS GESTORES (NÚCLEO DE EI, FORMADORES E COORDENADORES)

> **DIRETRIZ OBRIGATÓRIA DE EXECUÇÃO (ETAPA 2):**
> O assistente executor (Etapa 2) deve **obrigatoriamente ler e seguir as diretrizes dos arquivos `WORKFLOW_MACOS.md`, `AGENTS.md` e a skill `execucao-operario`** localizados na raiz do projeto antes de aplicar qualquer modificação no código. Nenhuma modificação deve ser realizada sem conformidade estrita com o workflow, incluindo:
> 1. Execução prévia de sincronização com o repositório remoto (`git pull origin main`).
> 2. Preservação integral das regras de negócio existentes, dados cadastrais, blindagens RBAC, série histórica, ciclo longitudinal, turmas integrais (Pilar 4), fechamento nominal e parecer em práticas consistentes (Pilar 5), higienização terminológica para "observação" (Pilar 6), KPIs decisórios com cobertura no bimestre corrente (Pilar 7), bloco de menores índices (Pilar 8), gaveta móvel de filtros (Pilar 9), semáforo bimestral de turmas e docentes (Pilar 10), gestão descentralizada (Pilar 14) e testes automatizados.
> 3. Verificação de integridade sintática obrigatória com JavaScriptCore (`python3 audit_platform.py --check-syntax`) antes de qualquer commit.
> 4. Verificação de integridade pós-edição com dupla checagem de leitura em cada trecho modificado.
> 5. Salvamento obrigatório do backup intermediário na pasta `intermediárias/` sob o nome `aplicativo_v126_apresentacao_dados_decisao_gestores.html`.
> 6. Gestão dupla de Changelog no arquivo `CHANGELOG.md` e no modal `#modalChangelog` / botão `.btn-changelog` do `index.html`, registrando a **Versão 1.26 (v8.2.0)**.
> 7. Sincronização idêntica entre o arquivo principal `index.html` da raiz, `gestor supervisao_patos/index.html` e `gestor supervisao_patos/firebase_deploy/public/index.html`.
> 8. Checagem pré-push (`git fetch origin main`), verificação de commits concorrentes, commit semântico (`feat: otimizar apresentacao de dados para apoio a decisao de gestores (v1.26)`), push para `origin main` e deploy automático no GitHub Pages.
> 9. Execução pós-deploy obrigatória do algoritmo de auditoria (`python3 audit_platform.py --silent-on-success`) com comunicação estrita a falhas.

---

## 1. Diagnóstico e Contexto Técnico-Pedagógico

### 1.1 Cenário Atual da Tela de Dados (`#screenIndicators`)
A tela de **Painel & Indicadores** (`#screenIndicators`) concentra os dados gerenciais e formativos do sistema de supervisão **SerTão Criança**. Atualmente, ela é organizada em três sub-abas:
- **Sub-aba 1: Índices Gerais & KPIs (`#pillIndKpis`):** Exibe 4 cards superiores (Consistência Geral, Cobertura no Bimestre Corrente, Meta do Ciclo Anual, Dimensão Prioritária) e o bloco dos 3 menores critérios (Gargalos Pedagógicos).
- **Sub-aba 2: Afunilamento por Dimensão (`#pillIndDrilldown`):** Apresenta a árvore hierárquica completa em acordeão (Dimensões ➔ Subdimensões ➔ Variáveis Avaliativas) com réguas de benchmark da Unidade Escolar versus Média da Rede Municipal de Patos.
- **Sub-aba 3: Acompanhamento Longitudinal (`#pillIndLongitudinal`):** Exibe o Quadro de Controle Semafórico de cumprimento das 4 observações anuais obrigatórias, alternável entre Turmas e Docentes Regentes Titulares.

### 1.2 Gargalos de Usabilidade e Fricção Decisória Identificados
Apesar da riqueza dos dados coletados nas observações, a forma atual como esses dados são apresentados impõe atritos cognitivos e lentidão para os três níveis de gestão da rede municipal:

1. **Para o Núcleo de Educação Infantil (SME Patos / Governança Geral):**
   - **Ausência de Agrupamento Territorial por Polo no Filtro de UEs:** O Núcleo administra 32 unidades distribuídas em polos territoriais. O seletor de Unidades Escolares é uma lista plana alfabética. Não há como filtrar ou agrupar escolas por Polo na tela de dados, dificultando a análise regionalizada.
   - **Falta de uma Visão Executiva Comparativa entre as Escolas da Rede:** Quando "Todas as Unidades do Escopo" está selecionado, o Núcleo vê apenas uma média aritmética consolidada. O Núcleo não consegue identificar de relance quais unidades escolares estão com atraso de cobertura no bimestre e quais já concluíram seus ciclos, sendo obrigado a selecionar escola por escola no dropdown para diagnosticar a rede.

2. **Para as Formadoras (Nível de Polo Regional):**
   - **Dificuldade de Priorização de Visitas de Mentoria:** A formadora precisa saber imediatamente quais coordenadoras e escolas do seu polo demandam apoio urgente no cumprimento do cronograma de observações. A ausência de uma tabela comparativa direta das escolas do polo retarda essa decisão de agendamento.
   - **Invisibilidade das Dimensões Estruturantes no Polo:** Para saber qual dimensão pedagógica está mais frágil no conjunto do polo, a formadora precisa navegar até o Afunilamento e abrir manualmente múltiplos acordeões.

3. **Para as Coordenadoras Pedagógicas (Nível da Unidade Escolar):**
   - **Desconexão entre o Card de Cobertura e a Lista de Turmas Pendentes:** No Card 2 ("Cobertura no Bimestre Corrente"), a coordenadora vê o resumo numérico (ex: *3 de 8 turmas - 37%*), mas para saber **quais turmas faltam observar**, ela precisa navegar até a sub-aba 3 ("Longitudinal").
   - **Nomenclatura Técnica e Jargões das Sub-abas:** Nomes como "Afunilamento" e "Longitudinal" não comunicam diretamente o valor prático imediato para a rotina escolar ("Prazos e Semáforo de Turmas" e "Matriz de Critérios Item a Item").
   - **Desaparecimento da Escala de Materiais na Visão Geral:** A síntese do uso de materiais (Nível 1 - folhas xerocadas até Nível 4 - materiais tridimensionais autônomos) é um dos pilares centrais da Educação Infantil de Patos, mas só é visível quando um docente individual é selecionado. Na visão geral da escola, esse dado crucial inexiste.
   - **Visão Unilateral de Critérios (Apenas os Piores):** O bloco de prioridades exibe apenas os 3 piores critérios. Para uma reunião pedagógica produtiva, a coordenadora precisa de uma visão balanceada: conhecer os pontos de atenção (para apoiar) e os pontos consolidados/fortes (para valorizar e compartilhar entre os pares).
   - **Dificuldade de Busca no Afunilamento:** Navegar por 46 critérios em acordeões sem busca textual ou botões de expandir/recolher consome tempo excessivo.

### 1.3 Princípio Orientador Mandatório: Apresentação Pura sem Interpretações Artificiais
Conforme instrução expressa da gestão:
> *"não se esqueça que você não deve, deliberadamente, adicionar interpretações sobre os dados apresentados, mas sim pensar em como apresentá-los da maneira mais fácil possível."*

O sistema **não deve emitir juízos de valor subjetivos, opiniões opinativas ou diagnósticos textuais especulativos** sobre professores ou escolas. A missão da engenharia de software neste plano é **apresentar os dados puros, matemáticos, tabulares e visuais de forma limpa, direta, ordenada e contrastada**, permitindo que o próprio gestor humano bata o olho e tome sua decisão de forma rápida e segura.

---

## 2. Arquitetura e Mapeamento de Pontos de Impacto

### 2.1 Eixos de Transformação da Apresentação de Dados
1. **Eixo 1 (Filtro e Territorialidade):** Agrupamento por Polo Regional no seletor de unidades escolares e seletor rápido de Polo para Núcleo de EI.
2. **Eixo 2 (Visão Executiva Comparativa de UEs):** Tabela compacta e ordenável de cobertura e consistência por Unidade Escolar quando visualizado escopo ampliado (Núcleo de EI e Formadores).
3. **Eixo 3 (Nomenclatura e Acesso aos Prazos):** Renomeação humanizada das sub-abas e gaveta retrátil instantânea de turmas pendentes direto no Card 2 de Cobertura Bimestral.
4. **Eixo 4 (Visão Síntese Balanceada):**
   - Mini-régua horizontal das Grandes Dimensões da Matriz com benchmark versus Rede Patos no topo da visão geral.
   - Distribuição agregada da Escala de Materiais (Níveis 1 a 4) na visão geral da escola/polo/rede.
   - Alternador no Bloco de Critérios: `⚠️ Menor Consistência (Prioridades de Apoio)` versus `✅ Maior Consistência (Práticas Consolidadas)`.
5. **Eixo 5 (Navegação na Matriz de Critérios):** Campo de busca textual instantânea por palavra-chave/código e botões "Expandir Todas" / "Recolher Todas".
6. **Eixo 6 (Contexto do Dossiê Individual):** Banner claro com botão de retorno proeminente quando um profissional específico estiver sendo analisado.

### 2.2 Arquivos Afetados
```
gestor supervisao_patos/
├── index.html                                                                 # Aplicação servida em produção
├── firebase_deploy/public/index.html                                          # Cópia espelhada obrigatória
├── audit_platform.py                                                          # Motor de auditoria modular
├── CHANGELOG.md                                                               # Histórico oficial de versões
└── intermediárias/aplicativo_v126_apresentacao_dados_decisao_gestores.html    # Backup intermediário da Versão 1.26
```

---

## 3. Especificação de Implementação Passo a Passo

### BLOCO 1: Estilos CSS Modernos e Otimizados para Tomada de Decisão
Localização: `<style>` de `index.html` (logo após a linha 1150).

```css
    /* =========================================================================
       APRESENTAÇÃO DE DADOS DECISÓRIOS (V1.26)
       ========================================================================= */
    /* 1. Tabela Executiva de Cobertura por UE (Núcleo de EI & Formadores) */
    .ue-executive-table-wrap {
      background: #FFFFFF;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    }
    .ue-executive-table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 14px;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--border);
    }
    .ue-executive-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }
    .ue-executive-table th {
      background: #F8FAFC;
      color: var(--text-secondary);
      font-weight: 800;
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 0.4px;
      padding: 10px 12px;
      border-bottom: 2px solid var(--border);
      text-align: left;
    }
    .ue-executive-table td {
      padding: 10px 12px;
      border-bottom: 1px solid var(--border-light);
      color: var(--text-primary);
    }
    .ue-executive-table tr:hover {
      background: #F8FAFC;
    }

    /* 2. Régua Horizontal das Grandes Dimensões */
    .dimensions-summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 12px;
      margin-bottom: 20px;
    }
    .dim-summary-card {
      background: #FFFFFF;
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 14px 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .dim-summary-card:hover {
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      transform: translateY(-1px);
    }
    .dim-summary-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
    }
    .dim-summary-title {
      font-size: 12px;
      font-weight: 800;
      color: var(--primary-dark);
      line-height: 1.3;
    }
    .dim-summary-score {
      font-size: 18px;
      font-weight: 900;
      line-height: 1;
    }
    .dim-summary-track {
      height: 6px;
      background: #F1F5F9;
      border-radius: 3px;
      overflow: hidden;
      margin: 8px 0 6px 0;
      display: flex;
    }
    .dim-summary-fill {
      height: 100%;
      border-radius: 3px;
      transition: width 0.3s ease;
    }
    .dim-summary-meta {
      font-size: 11px;
      color: var(--text-secondary);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    /* 3. Distribuição Agregada da Escala de Materiais */
    .materials-aggregate-card {
      background: #FFFFFF;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px 20px;
      margin-bottom: 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    }
    .materials-grid-bars {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-top: 12px;
    }
    @media (max-width: 768px) {
      .materials-grid-bars {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    .mat-bar-box {
      background: #F8FAFC;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .mat-bar-level {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      margin-bottom: 4px;
    }
    .mat-bar-desc {
      font-size: 11px;
      color: var(--text-secondary);
      line-height: 1.25;
      margin-bottom: 8px;
      min-height: 28px;
    }
    .mat-bar-stat {
      font-size: 18px;
      font-weight: 900;
      display: flex;
      align-items: baseline;
      gap: 4px;
    }

    /* 4. Barra de Ação Imediata: Turmas Pendentes no Bimestre Corrente */
    .pending-classes-drawer {
      background: #FFFBEB;
      border: 1px solid #FDE68A;
      border-radius: 8px;
      padding: 12px 14px;
      margin-top: 10px;
      font-size: 12px;
    }
    .pending-classes-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-top: 8px;
      max-height: 220px;
      overflow-y: auto;
    }
    .pending-class-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #FFFFFF;
      border: 1px solid #FEF3C7;
      border-radius: 6px;
      padding: 6px 10px;
    }

    /* 5. Barra de Contexto do Dossiê Individual */
    .individual-context-banner {
      background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
      border: 1px solid #BFDBFE;
      border-radius: 10px;
      padding: 12px 16px;
      margin-bottom: 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
    }
```

---

### BLOCO 2: Atualização dos Rótulos das Sub-abas na Interface (`index.html`)
Linhas ~4260 a 4273 em `index.html`:
Substituir a navegação por rótulos amigáveis e funcionais:

```html
      <!-- Segmented Navigation (Sub-abas Humanizadas do Painel de Indicadores) -->
      <div class="indicators-subtabs-nav" id="indicatorsSubTabsNav">
        <button type="button" class="indicators-icon-tab-btn indicators-subtab-pill active" id="pillIndKpis" onclick="switchIndicatorsSubTab('kpis')" title="Visão Geral & Prioridades Formativas" aria-label="Visão Geral">
          <span class="tab-icon">📊</span>
          <span class="tab-text" id="pillIndKpisLabel">Visão Geral & Prioridades</span>
        </button>
        <button type="button" class="indicators-icon-tab-btn indicators-subtab-pill" id="pillIndLongitudinal" onclick="switchIndicatorsSubTab('longitudinal')" title="Prazos & Turmas (Semáforo Bimestral)" aria-label="Prazos e Semáforo">
          <span class="tab-icon">🚦</span>
          <span class="tab-text" id="pillIndLongitudinalLabel">Prazos & Turmas (Semáforo)</span>
        </button>
        <button type="button" class="indicators-icon-tab-btn indicators-subtab-pill" id="pillIndDrilldown" onclick="switchIndicatorsSubTab('drilldown')" title="Matriz de Critérios Item a Item" aria-label="Matriz de Critérios">
          <span class="tab-icon">🔍</span>
          <span class="tab-text" id="pillIndDrilldownLabel">Matriz de Critérios</span>
        </button>
      </div>
```

---

### BLOCO 3: Agrupamento Territorial por Polo no Filtro de Unidades Escolares
Na função `renderIndicatorsScreen()` (linhas ~19593 a 19635):
Substituir a montagem plana de opções por agrupamento semântico `<optgroup>` por Polo Regional quando o usuário for do Núcleo de EI:

```javascript
        let unitOptionsHtml = '';
        if (user.roleKey !== 'coordenador') {
          unitOptionsHtml += `<option value="ALL">Todas as Unidades do Escopo (${availableUnits.length})</option>`;
        }

        // Agrupamento por Polo para o Núcleo de Educação Infantil
        if (isNucleoEI(user)) {
          const unitsByPolo = {};
          (appState.units || []).forEach(u => {
            const pName = u.polo || 'Sem Polo Definido';
            if (!unitsByPolo[pName]) unitsByPolo[pName] = [];
            unitsByPolo[pName].push(u.name);
          });

          const sortedPolos = Object.keys(unitsByPolo).sort();
          sortedPolos.forEach(pName => {
            unitOptionsHtml += `<optgroup label="📍 ${pName}">`;
            unitsByPolo[pName].sort().forEach(uName => {
              unitOptionsHtml += `<option value="${uName}">${uName}</option>`;
            });
            unitOptionsHtml += `</optgroup>`;
          });
        } else {
          availableUnits.forEach(uName => {
            unitOptionsHtml += `<option value="${uName}">${uName}</option>`;
          });
        }

        unitSelect.innerHTML = unitOptionsHtml;
```

---

### BLOCO 4: Visão Executiva Comparativa de UEs (Para Núcleo de EI e Formadores)
Quando o escopo visualizado for consolidado (`activeUnitFilter === 'ALL'` e usuário `nucleo_ei` ou `formador`), inserir no topo da Visão Geral a tabela executiva:

```javascript
      // Renderiza Tabela Executiva de UEs quando escopo consolidado para Núcleo ou Formadora
      let executiveUETableHtml = '';
      if (activeUnitFilter === 'ALL' && (isNucleoEI(user) || user.roleKey === 'formador')) {
        const uesList = (user.roleKey === 'formador')
          ? availableUnits
          : (appState.units || []).map(u => u.name);

        const currentBim = getCurrentSchoolBimester();
        const currentBimNum = parseInt((currentBim.match(/([1-4])/) || [null, '1'])[1], 10);

        let rowsHtml = '';
        uesList.forEach(uName => {
          const uClasses = getClassesForSchool(uName);
          const uObs = (appState.observations || []).filter(o => 
            (o.status === 'finalized' || o.status === 'concluida') && o.schoolName === uName
          );

          // Turmas avaliadas no bimestre corrente
          const evalCurrentBim = uClasses.filter(cls => {
            const cleanClassName = (cls.name || '').trim().toLowerCase();
            return uObs.some(o => {
              if (!o.className || o.className.trim().toLowerCase() !== cleanClassName) return false;
              const bMatch = (o.bimester || '').match(/([1-4])/);
              return bMatch && parseInt(bMatch[1], 10) === currentBimNum;
            });
          }).length;

          const covPct = uClasses.length > 0 ? Math.round((evalCurrentBim / uClasses.length) * 100) : 0;
          const covColor = covPct >= 80 ? 'var(--green)' : (covPct >= 50 ? 'var(--yellow)' : 'var(--red)');

          // Consistência da UE
          const uHierarchy = calculateHierarchyStats(uObs, activeSections);
          const uScore = uHierarchy.totalValid > 0 ? Math.round((uHierarchy.totalPts / uHierarchy.totalValid) * 100) : null;
          const uScoreColor = uScore === null ? 'var(--text-secondary)' : (uScore >= 80 ? 'var(--green)' : uScore >= 60 ? 'var(--yellow)' : 'var(--red)');

          const uObj = (appState.units || []).find(u => u.name === uName);
          const uPolo = uObj?.polo || '—';

          rowsHtml += `
            <tr>
              <td>
                <strong style="color:var(--primary-dark); font-size:13px;">${uName}</strong>
                <div style="font-size:11px; color:var(--text-secondary);">Polo: ${uPolo}</div>
              </td>
              <td>${uClasses.length} turmas</td>
              <td>
                <div style="display:flex; align-items:center; gap:8px;">
                  <strong style="color:${covColor}; font-size:13px;">${evalCurrentBim} de ${uClasses.length} (${covPct}%)</strong>
                  <div style="width:50px; height:6px; background:#F1F5F9; border-radius:3px; overflow:hidden;">
                    <div style="width:${covPct}%; height:100%; background:${covColor};"></div>
                  </div>
                </div>
              </td>
              <td>
                <strong style="color:${uScoreColor}; font-size:13px;">${uScore !== null ? uScore + '%' : '—'}</strong>
                <span style="font-size:11px; color:var(--text-secondary);">(${uObs.length} obs.)</span>
              </td>
              <td style="text-align:right;">
                <button type="button" class="btn btn-secondary" style="font-size:11px; padding:4px 8px; font-weight:700;" onclick="focusUnitFilter('${uName.replace(/'/g, "\\'")}')">
                  Focar UE ➔
                </button>
              </td>
            </tr>
          `;
        });

        executiveUETableHtml = `
          <div class="ue-executive-table-wrap">
            <div class="ue-executive-table-header">
              <div>
                <h4 style="font-size:15px; font-weight:800; color:var(--primary-dark); margin:0;">
                  🏫 Cobertura e Consistência por Unidade Escolar · ${currentBim}
                </h4>
                <p style="font-size:12px; color:var(--text-secondary); margin:2px 0 0 0;">
                  Acompanhamento consolidado para priorização de suporte e visitas de campo
                </p>
              </div>
            </div>
            <div style="overflow-x:auto;">
              <table class="ue-executive-table">
                <thead>
                  <tr>
                    <th>Unidade Escolar</th>
                    <th>Turmas</th>
                    <th>Cobertura no Bimestre</th>
                    <th>Consistência Geral</th>
                    <th style="text-align:right;">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  ${rowsHtml}
                </tbody>
              </table>
            </div>
          </div>
        `;
      }
```

---

### BLOCO 5: Mini-Painel das Grandes Dimensões da Matriz Pedagógica
Logo abaixo dos 4 cards superiores de KPIs, renderizar a régua com as Grandes Dimensões da Matriz:

```javascript
      // Montagem do Painel Síntese das Dimensões
      let dimensionsSummaryHtml = '';
      if (scopeHierarchy.dims && scopeHierarchy.dims.length > 0) {
        let dimCardsHtml = '';
        scopeHierarchy.dims.forEach((d, idx) => {
          const dPts = d.consistent * 1.0 + d.partial * 0.5;
          const dScore = d.validTotal > 0 ? Math.round((dPts / d.validTotal) * 100) : null;
          const dColor = dScore === null ? 'var(--text-secondary)' : (dScore >= 80 ? 'var(--green)' : dScore >= 60 ? 'var(--yellow)' : 'var(--red)');

          const redeD = (redeHierarchy.dims && redeHierarchy.dims[idx]) ? redeHierarchy.dims[idx] : null;
          const redePts = redeD ? (redeD.consistent * 1.0 + redeD.partial * 0.5) : 0;
          const redeScore = (redeD && redeD.validTotal > 0) ? Math.round((redePts / redeD.validTotal) * 100) : null;
          const delta = (dScore !== null && redeScore !== null) ? (dScore - redeScore) : null;

          const cleanTitle = (d.title || '').replace(/^Dimens[aã]o\s*\d*\s*[:\.\-]?\s*/i, '').trim();

          dimCardsHtml += `
            <div class="dim-summary-card">
              <div>
                <div class="dim-summary-header">
                  <span class="dim-summary-title">${idx + 1}. ${cleanTitle}</span>
                  <span class="dim-summary-score" style="color:${dColor};">${dScore !== null ? dScore + '%' : '—'}</span>
                </div>
                <div class="dim-summary-track">
                  <div class="dim-summary-fill" style="width:${dScore || 0}%; background:${dColor};"></div>
                </div>
              </div>
              <div class="dim-summary-meta">
                <span>${d.validTotal} respostas</span>
                <span>${delta !== null ? formatBenchmarkDelta(delta, false) : ''}</span>
              </div>
            </div>
          `;
        });

        dimensionsSummaryHtml = `
          <div style="margin-bottom:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
              <span style="font-size:12px; font-weight:800; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.5px;">
                Desempenho por Dimensão da Matriz
              </span>
              <button type="button" class="btn-link" style="font-size:11px; font-weight:700; color:var(--primary); background:none; border:none; padding:0; cursor:pointer;" onclick="switchIndicatorsSubTab('drilldown')">
                Ver Detalhes Item a Item ➔
              </button>
            </div>
            <div class="dimensions-summary-grid">
              ${dimCardsHtml}
            </div>
          </div>
        `;
      }
```

---

### BLOCO 6: Distribuição da Escala de Materiais na Visão Geral
Adicionar o bloco da Escala de Materiais consolidada quando `activeMemberFilter === 'ALL'`:

```javascript
      // Computação dos 4 Níveis da Escala de Materiais no escopo ativo
      let materialsDistributionHtml = '';
      if (targetType === 'professora') {
        const matCounts = { 1: 0, 2: 0, 3: 0, 4: 0 };
        let matTotal = 0;

        scopedObs.forEach(o => {
          if (o.synthesisMaterialDimension && matCounts[o.synthesisMaterialDimension] !== undefined) {
            matCounts[o.synthesisMaterialDimension]++;
            matTotal++;
          }
        });

        const matConfigs = [
          { level: 1, title: 'Nível 1 · Pré-prontas', desc: 'Folhas xerox / apostiladas estruturadas', color: 'var(--red)', bg: '#FEF2F2' },
          { level: 2, title: 'Nível 2 · Folhas Estruturadas', desc: 'Predomínio de folhas com raras livres', color: 'var(--yellow)', bg: '#FFFBEB' },
          { level: 3, title: 'Nível 3 · Diversificados', desc: 'Acesso regular a papéis, tintas e colagens', color: '#0284C7', bg: '#F0F9FF' },
          { level: 4, title: 'Nível 4 · Autônomo e Tridimensional', desc: 'Argila, madeira, elementos naturais', color: 'var(--green)', bg: '#F0FDF4' }
        ];

        let matBarsHtml = '';
        matConfigs.forEach(cfg => {
          const count = matCounts[cfg.level];
          const pct = matTotal > 0 ? Math.round((count / matTotal) * 100) : 0;

          matBarsHtml += `
            <div class="mat-bar-box" style="border-top:3px solid ${cfg.color};">
              <div>
                <div class="mat-bar-level" style="color:${cfg.color};">${cfg.title}</div>
                <div class="mat-bar-desc">${cfg.desc}</div>
              </div>
              <div class="mat-bar-stat" style="color:${cfg.color};">
                <span>${pct}%</span>
                <span style="font-size:12px; font-weight:600; color:var(--text-secondary);">(${count} obs)</span>
              </div>
            </div>
          `;
        });

        materialsDistributionHtml = `
          <div class="materials-aggregate-card">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
              <div>
                <h4 style="font-size:14px; font-weight:800; color:var(--primary-dark); margin:0;">
                  🎨 Distribuição do Uso de Materiais (Síntese Pedagógica)
                </h4>
                <p style="font-size:12px; color:var(--text-secondary); margin:2px 0 0 0;">
                  Proporção de observações registradas em cada nível de materiais na Educação Infantil (${matTotal} registros com escala)
                </p>
              </div>
            </div>
            <div class="materials-grid-bars">
              ${matBarsHtml}
            </div>
          </div>
        `;
      }
```

---

### BLOCO 7: Alternador Balanceado no Bloco de Prioridades (Menor vs Maior Consistência)
Atualizar a função `calculateTopBottlenecks` e `renderBottlenecksPrioritySection` para suportar ordenação tanto por Menor Consistência (Fragilidades) quanto por Maior Consistência (Pontos Consolidados/Fortes):

```javascript
    function calculateTopCriteria(scopeHierarchy, redeHierarchy, mode, count) {
      // mode: 'lowest' (antigo absolute), 'delta' (maior desvio negativo), 'highest' (práticas consolidadas)
      const allCriteria = [];
      if (!scopeHierarchy || !scopeHierarchy.dims) return [];

      scopeHierarchy.dims.forEach((dim, dIdx) => {
        const dimTitle = (dim.title || '').replace(/^Dimens[aã]o\s*\d*\s*[:\.\-]?\s*/i, '').trim();
        (dim.subSections || []).forEach((sub, sIdx) => {
          const subTitle = (sub.title || '').replace(/^Subdimens[aã]o\s*[\d\.]*\s*[:\.\-]?\s*/i, '').trim();
          const subKey = `sub_${dIdx}_${sIdx}`;
          (sub.criteria || []).forEach((crit, cIdx) => {
            if (crit.validTotal > 0) {
              const pts = crit.consistent * 1.0 + crit.partial * 0.5;
              const score = Math.round((pts / crit.validTotal) * 100);

              let redeScore = null;
              if (redeHierarchy && redeHierarchy.dims && redeHierarchy.dims[dIdx]) {
                const rDim = redeHierarchy.dims[dIdx];
                if (rDim.subSections && rDim.subSections[sIdx] && rDim.subSections[sIdx].criteria && rDim.subSections[sIdx].criteria[cIdx]) {
                  const rCrit = rDim.subSections[sIdx].criteria[cIdx];
                  if (rCrit.validTotal > 0) {
                    redeScore = Math.round(((rCrit.consistent * 1.0 + rCrit.partial * 0.5) / rCrit.validTotal) * 100);
                  }
                }
              }

              const delta = (redeScore !== null) ? (score - redeScore) : 0;

              allCriteria.push({
                critId: crit.id,
                critText: crit.text,
                dimIndex: dIdx,
                dimTitle: `${dIdx + 1}. ${dimTitle}`,
                subKey: subKey,
                subTitle: `${sub.id} ${subTitle}`,
                score: score,
                redeScore: redeScore,
                delta: delta,
                consistent: crit.consistent,
                partial: crit.partial,
                notDone: crit.notDone,
                validTotal: crit.validTotal,
                severity: score < 60 ? 'critical' : (score < 80 ? 'warning' : 'stable')
              });
            }
          });
        });
      });

      if (mode === 'highest') {
        // Ordena pelos maiores scores (decrescente)
        allCriteria.sort((a, b) => b.score - a.score || b.validTotal - a.validTotal);
      } else if (mode === 'delta') {
        // Ordena pela maior defasagem negativa em relação à rede
        allCriteria.sort((a, b) => a.delta - b.delta || a.score - b.score);
      } else {
        // mode === 'lowest' (padrão)
        allCriteria.sort((a, b) => a.score - b.score || a.delta - b.delta);
      }

      return allCriteria.slice(0, count || 3);
    }
```

E no cabeçalho do bloco, renderizar três botões de visualização pura:
- `📉 Menor Consistência (Prioridades)`
- `🔻 Maior Desvio vs. Rede`
- `⭐ Maior Consistência (Pontos Fortes)`

---

### BLOCO 8: Busca Instantânea e Controles Globais na Matriz de Critérios
Na sub-aba da Matriz de Critérios (`indicatorsSectionDrilldown`), incluir no topo:
1. Campo de busca: `<input type="search" id="drilldownSearchInput" placeholder="🔍 Buscar critério por código ou texto..." oninput="onDrilldownSearch(this.value)">`
2. Botões de expansão:
   - `<button type="button" class="btn btn-secondary" onclick="expandAllDrilldown()">+ Expandir Tudo</button>`
   - `<button type="button" class="btn btn-secondary" onclick="collapseAllDrilldown()">- Recolher Tudo</button>`
3. Filtro por chips de consistência:
   - `Todos` | `🔴 < 60%` | `🟡 60-79%` | `🟢 ≥ 80%`

---

## 4. Critérios de Aceite e Roteiro de Teste

### 4.1 Critérios de Aceite
1. **Governança Territorial:** O seletor de Unidades Escolares apresenta agrupamento semântico por Polo Regional (`<optgroup>`) para o usuário Núcleo de EI (`helena`).
2. **Visão Executiva de UEs:** Ao selecionar "Todas as Unidades do Escopo" com perfil de Núcleo de EI ou Formadora, a tabela executiva de cobertura e consistência é renderizada perfeitamente, com botão direto para "Focar UE".
3. **Prazos e Turmas:** O Card 2 de Cobertura Bimestral permite alternar diretamente para o Semáforo e visualizar pendências.
4. **Visão das Dimensões:** A régua com as Grandes Dimensões é exibida na visão geral com barra percentual e delta vs Rede Municipal.
5. **Escala de Materiais:** A distribuição agregada dos 4 níveis de materiais é exibida na visão geral de professores.
6. **Alternador Balanceado de Critérios:** O bloco de prioridades permite alternar entre Menor Consistência, Desvio vs Rede e Maior Consistência (Pontos Fortes).
7. **Busca na Matriz:** A busca instantânea na Matriz de Critérios filtra dinamicamente os critérios e exibe os nós correspondentes.
8. **Integridade de Sintaxe:** Validação estrita sem erros via `python3 audit_platform.py --check-syntax`.

### 4.2 Roteiro de Teste Manual Guiado
1. Logar como Mariana (Coordenadora):
   - Acessar aba "Painel & Indicadores".
   - Verificar as três sub-abas: "Visão Geral & Prioridades", "Prazos & Turmas (Semáforo)", "Matriz de Critérios".
   - Verificar a presença da régua das Grandes Dimensões e da distribuição da Escala de Materiais.
   - Alternar para "⭐ Maior Consistência" no bloco de critérios e constatar a listagem dos pontos fortes da escola.
2. Logar como Helena (Núcleo de EI):
   - Acessar aba "Painel & Indicadores".
   - Constatar o agrupamento por Polo no seletor de Unidade Escolar.
   - Constatar a presença da Tabela Executiva de Cobertura das UEs.
   - Clicar em "Focar UE" em uma escola e confirmar que a tela sincroniza automaticamente o filtro para aquela unidade.

---

## 5. Seção Obrigatória de Auditoria (`audit_platform.py` e `index.html`)

### 5.1 Atualizações no Catálogo de Módulos (`audit_platform.py`)
Atualizar a descrição oficial do Módulo 10:
- **Linha 32 em `audit_platform.py`:**
```python
    'indicadores_decisao': 'Indicadores Pedagógicos, Cobertura Bimestral (Pilar 7), Prioridades Balanceadas, Escala de Materiais, Busca na Matriz e Semáforo (Pilar 10)',
```

### 5.2 Adições e Asserções de Teste no Módulo 10 (`index.html`)
Adicionar testes automatizados no bloco do Módulo 10 (após linha ~24950):
1. **Teste de Agrupamento por Polo no Seletor:** Verificar se elementos `<optgroup>` existem no `#indicatorsUnitFilter` sob a perspectiva do Núcleo de EI.
2. **Teste da Tabela Executiva de UEs:** Verificar renderização da classe `.ue-executive-table` sob escopo `ALL` com perfil do Núcleo.
3. **Teste da Régua de Grandes Dimensões:** Verificar existência de elementos `.dim-summary-card`.
4. **Teste da Distribuição da Escala de Materiais:** Verificar existência de `.materials-aggregate-card` na visão geral de professores.
5. **Teste da Alternância para Pontos Fortes:** Executar `calculateTopCriteria(..., 'highest', 3)` e validar que os scores retornados estão ordenados de forma decrescente.
6. **Teste de Busca e Expansão na Matriz:** Invocar `expandAllDrilldown()` e verificar classe `expanded` nos nós.

---

## 6. Próximo Passo
Aguardar autorização expressa do usuário para iniciar a **Etapa 2 (Operário / Execução Mecânica Fiel)**, mantendo a árvore do Git limpa até o recebimento da ordem.
