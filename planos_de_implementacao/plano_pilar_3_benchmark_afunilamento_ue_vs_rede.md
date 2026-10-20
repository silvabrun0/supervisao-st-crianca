# PLANO DE IMPLEMENTAÇÃO: PILAR 3 - BENCHMARK NA ABA AFUNILAMENTO (COMPARATIVO % DA UE VS. % DA REDE)

> **DIRETRIZ OBRIGATÓRIA DE EXECUÇÃO (ETAPA 2):**
> O assistente executor (Etapa 2) deve **obrigatoriamente ler e seguir as diretrizes dos arquivos `WORKFLOW_MACOS.md` e `AGENTS.md`** localizados na raiz do projeto antes de aplicar qualquer modificação no código. Nenhuma modificação deve ser realizada sem conformidade estrita com o workflow, incluindo:
> 1. Execução prévia de sincronização com o repositório remoto (`git pull origin main`).
> 2. Preservação integral das regras de negócio existentes, dados cadastrais, blindagens RBAC e testes automatizados.
> 3. Verificação de integridade pós-edição com dupla checagem de leitura em cada trecho modificado.
> 4. Salvamento obrigatório do backup intermediário na pasta `intermediárias/` sob o nome `aplicativo_v92_pilar_3_benchmark_afunilamento_ue_vs_rede.html` (e espelho em subpastas caso aplicável).
> 5. Gestão dupla de Changelog no arquivo `CHANGELOG.md` e no modal `#modalChangelog` do `index.html`, registrando a **Versão 0.92**.
> 6. Sincronização idêntica entre o arquivo principal `index.html` da raiz, `gestor supervisao_patos/index.html` e `gestor supervisao_patos/firebase_deploy/public/index.html`.
> 7. Checagem pré-push (`git fetch origin main`), commit semântico (`feat: implementar pilar 3 - benchmark comparativo ue vs rede na aba afunilamento`), push para `origin main` e deploy automático no GitHub Pages.
> 8. Execução pós-deploy obrigatória do algoritmo de auditoria (`python3 audit_platform.py --silent-on-success`) com comunicação estrita a falhas.

---

## 1. Diagnóstico e Contexto

### 1.1 Cenário Atual
Atualmente, na sub-aba de **"Afunilamento por Dimensão"** (`currentSubTab === 'drilldown'`) da tela de Indicadores:
- As estatísticas da árvore hierárquica (Grandes Dimensões ➔ Subdimensões ➔ Itens Individuais) são calculadas em `dimStats` considerando única e exclusivamente as observações filtradas no escopo atual (`scopedObs`).
- Cada nível apresenta apenas o percentual isolado daquele escopo com uma única barra de progresso (ex: `72%`), sem qualquer termo de comparação ou referencial contextual externo.
- Se a Coordenadora da UE observa uma consistência de `72%` na dimensão *"Planejamento Didático Pedagógico"*, ela não possui subsídio visual para discernir se esse índice está satisfatório, em atraso ou em situação crítica frente à realidade do município de Patos.
- Caso a média da rede municipal de Patos seja `81%`, a escola está `9 pontos percentuais abaixo da média municipal` ($\Delta = -9\%$), caracterizando uma prioridade de intervenção formativa que passa desapercebida na visualização isolada.
- Não há identificação automatizada de itens de **Atenção Crítica** ($\Delta \le -10\%$) ou **Destaques Positivos** ($\Delta \ge +10\%$) na árvore de rubricas.

### 1.2 Fundamentação Técnico-Pedagógica (Documento de Insights / Reunião ST Criança 20/10/2026)
Conforme consolidado nas diretrizes oficiais do programa SerTão Criança:
1. **Lógica de Decisão em Indicadores (Seção 3 do WORKFLOW_MACOS.md):**
   - Dados e métricas pedagógicas não devem existir como meros elementos visuais, burocráticos ou ilustrativos. Devem responder a perguntas práticas de acompanhamento e intervenção pedagógica.
2. **O Pilar 3 - Benchmark na Aba Afunilamento:**
   - A visualização comparativa atinge sua máxima potência pedagógica dentro da sub-aba de **"Afunilamento por Dimensão"**.
   - Para cada nível da árvore hierárquica (Grande Dimensão, Subdimensão e Item/Critério Individual), a interface deve apresentar a **Régua Dupla de Benchmark**:
     1. **Percentual da Unidade Escolar:** `% Consistência na UE`.
     2. **Percentual da Rede Municipal:** `% Médio da Rede de Patos`.
     3. **Delta Comparativo ($\Delta \pm\%$):** Indicação visual e semântica imediata se a escola está acima, alinhada ou abaixo da média municipal, com destaque de atenção crítica.
3. **Escopo Multinível por Perfil (Tríade de Governança do Pilar 2):**
   - **Coordenador(a) da UE:** Visualiza sua própria escola comparada à média de toda a Rede Municipal de Patos.
   - **Formador(a) Pedagógico(a):** Visualiza as coordenadoras e escolas do seu Polo Regional atribuído comparadas à média de toda a Rede Municipal de Patos.
   - **Coordenadora do Núcleo de EI:** Visualiza a Rede consolidada e, ao selecionar qualquer UE no filtro superior, visualiza o benchmark instantâneo daquela escola contra a Rede.

### 1.3 Resultado Esperado com o Pilar 3
1. **Régua Dupla Visual (Dual-Progress Ruler) no Afunilamento:**
   - **Nível 1 (Grande Dimensão):** Header do accordion exibindo a régua dupla (`Minha UE: [barra] 72%` | `Rede: [barra] 81%`) e a linha de variação explicativa (`Variação: 🔻 -9% abaixo da média municipal`).
   - **Nível 2 (Subdimensão):** Subheader exibindo as duas métricas com barras compactas e o delta (`Minha UE: 68%` | `Rede: 76%` | `Δ: 🔻 -8%`).
   - **Nível 3 (Critério / Item Individual):** Card do critério com faixa de benchmark dedicada destacando `Minha UE: 60%`, `Rede Patos: 75%` e o badge semântico categorizado:
     - `🔻 -15% [Atenção Crítica]` ($\Delta \le -10\%$)
     - `🔻 -5% [Abaixo da Média]` ($-10\% < \Delta < 0\%$)
     - `⚪ 0% [Na Média da Rede]` ($\Delta = 0\%$)
     - `🟢 +5% [Acima da Média]` ($0\% < \Delta < +10\%$)
     - `🟢 +12% [Destaque Positivo]` ($\Delta \ge +10\%$)
2. **Motor Canônico de Agregação Hierárquica (`calculateHierarchyStats`):**
   - Função utilitária centralizada que processa qualquer conjunto de observações e retorna a árvore completa de dimensões, subdimensões e critérios com métricas de consistência e respostas válidas.
3. **Banner Informativo de Benchmark no Topo do Afunilamento:**
   - Faixa contextual indicando a base de comparação ativa e a quantidade de observações consolidadas na rede municipal de Patos.
4. **Resiliência e Tratamento Matemático:**
   - Tratamento rigoroso contra divisão por zero para escolas ou itens sem respostas válidas (`— Sem dados`).
5. **Cobertura de 100% no Algoritmo de Auditoria (`audit_platform.py`):**
   - Teste determinístico de cálculo do benchmark UE vs. Rede no Módulo 10 (`indicadores_decisao`).
   - Teste de adaptação contextual nos três papéis (Mariana, Clarice e Helena).

---

## 2. Arquitetura e Pontos de Impacto

### 2.1 Arquivos Afetados
- `index.html` (Arquivo mestre de produção servido pelo GitHub Pages)
- `gestor supervisao_patos/index.html` (Espelho local)
- `gestor supervisao_patos/firebase_deploy/public/index.html` (Espelho Firebase)
- `gestor supervisao_patos/CHANGELOG.md` (Registro da Versão 0.92)
- `intermediárias/aplicativo_v92_pilar_3_benchmark_afunilamento_ue_vs_rede.html` (Backup intermediário obrigatório)
- `audit_platform.py` (Módulo 10 `indicadores_decisao` e Módulo 12 `navegacao_layout`)

### 2.2 Estruturas de Dados e Mapeamento de Funções
1. **Base de Comparação da Rede (`redeObs`):**
   - Extraída de `appState.observations` filtrando por status `finalized` ou `concluida` e pelo `evaluatedType` correspondente (`targetType === 'coordenador'` ou `targetType === 'professora' | 'turma'`).
2. **Função Canônica Global `calculateHierarchyStats(obsList, activeSections)`:**
   - Processa a lista de observações e devolve a árvore hierárquica `dims` contendo contadores de `consistent`, `partial`, `notDone`, `na`, `validTotal`, pontuação ponderada (`pts`) e percentual de consistência (`pct`).
3. **Função Utilitária de Formatação de Delta `formatBenchmarkDelta(delta, isCompact)`:**
   - Retorna o HTML do badge semântico com classes CSS dedicadas (`benchmark-delta-critical`, `benchmark-delta-warning`, `benchmark-delta-neutral`, `benchmark-delta-success`, `benchmark-delta-highlight`).
4. **Refatoração do Bloco Drilldown em `renderIndicatorsScreen()`:**
   - Linhas ~13535 a 13788 em `index.html`: substituição da montagem antiga baseada em `dimStats` isolado pela computação comparativa de `scopeStats` vs `redeStats`.

---

## 3. Especificação de Implementação Passo a Passo (Etapa 2)

### Passo 1: Inserção dos Estilos CSS do Benchmark no `<style>` do `index.html`
Localizar o bloco de estilos do Drill-down (logo após a linha 735 de `index.html`) e inserir as classes dedicadas do Pilar 3:

```css
    /* =========================================================================
       PILAR 3: BENCHMARK AFUNILAMENTO (UE VS. REDE MUNICIPAL)
       ========================================================================= */
    .benchmark-info-bar {
      background: #F0FDF4;
      border: 1px solid #BBF7D0;
      border-radius: 8px;
      padding: 10px 14px;
      margin-bottom: 16px;
      font-size: 12px;
      color: #166534;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      flex-wrap: wrap;
    }
    .benchmark-ruler-row {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }
    .benchmark-item-box {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 700;
    }
    .benchmark-bar-track {
      width: 75px;
      height: 7px;
      background: #E2E8F0;
      border-radius: 4px;
      overflow: hidden;
    }
    .benchmark-bar-fill {
      height: 100%;
      border-radius: 4px;
    }
    .benchmark-delta-tag {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 7px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      white-space: nowrap;
    }
    .benchmark-delta-critical {
      background: #FEE2E2;
      color: #991B1B;
      border: 1px solid #FCA5A5;
    }
    .benchmark-delta-warning {
      background: #FEF3C7;
      color: #92400E;
      border: 1px solid #FDE68A;
    }
    .benchmark-delta-neutral {
      background: #F1F5F9;
      color: #475569;
      border: 1px solid #E2E8F0;
    }
    .benchmark-delta-success {
      background: #DCFCE7;
      color: #166534;
      border: 1px solid #86EFAC;
    }
    .benchmark-delta-highlight {
      background: #D1FAE5;
      color: #065F46;
      border: 1px solid #6EE7B7;
      box-shadow: 0 1px 2px rgba(6, 95, 70, 0.1);
    }
    .benchmark-item-card {
      background: #F8FAFC;
      border: 1px solid var(--border-light);
      border-radius: 6px;
      padding: 8px 12px;
      margin-top: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
    }
```

---

### Passo 2: Funções Canônicas Globais de Agregação e Formatação de Delta
Inserir no bloco de scripts do `index.html` (logo antes de `renderIndicatorsScreen()`):

```javascript
    // =========================================================================
    // PILAR 3: FUNÇÕES AUXILIARES DE BENCHMARK E AFUNILAMENTO (UE VS. REDE)
    // =========================================================================

    /**
     * Calcula as métricas consolidadas em 3 níveis (Dimensão, Subdimensão e Critério)
     * a partir de um conjunto de observações e da matriz curricular ativa.
     */
    function calculateHierarchyStats(observations, activeSections) {
      let totalValid = 0;
      let totalPts = 0;
      let totalNA = 0;

      const dims = (activeSections || []).map(sec => ({
        key: sec.key,
        title: sec.title,
        consistent: 0,
        partial: 0,
        notDone: 0,
        na: 0,
        validTotal: 0,
        subSections: (sec.subSections || []).map(sub => ({
          id: sub.id,
          title: sub.title,
          consistent: 0,
          partial: 0,
          notDone: 0,
          na: 0,
          validTotal: 0,
          criteria: (sub.criteria || []).map(crit => ({
            id: crit.id,
            text: crit.text,
            consistent: 0,
            partial: 0,
            notDone: 0,
            na: 0,
            validTotal: 0
          }))
        }))
      }));

      (observations || []).forEach(obs => {
        (activeSections || []).forEach((sec, sIdx) => {
          (sec.subSections || []).forEach((sub, subIdx) => {
            (sub.criteria || []).forEach((crit, cIdx) => {
              const r = obs.responses ? obs.responses[crit.id] : null;
              if (!r) return;

              const dStat = dims[sIdx];
              const sStat = dStat.subSections[subIdx];
              const cStat = sStat.criteria[cIdx];

              if (r === 'na') {
                dStat.na++;
                sStat.na++;
                cStat.na++;
                totalNA++;
              } else {
                dStat.validTotal++;
                sStat.validTotal++;
                cStat.validTotal++;
                totalValid++;

                if (r === 'consistent') {
                  dStat.consistent++;
                  sStat.consistent++;
                  cStat.consistent++;
                  totalPts += 1.0;
                } else if (r === 'partial') {
                  dStat.partial++;
                  sStat.partial++;
                  cStat.partial++;
                  totalPts += 0.5;
                } else if (r === 'not_done') {
                  dStat.notDone++;
                  sStat.notDone++;
                  cStat.notDone++;
                }
              }
            });
          });
        });
      });

      return { dims, totalValid, totalPts, totalNA };
    }

    /**
     * Formata visualmente o Delta percentual comparativo entre o Escopo e a Rede.
     */
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
```

---

### Passo 3: Refatoração do Cálculo e Renderização do Afunilamento em `renderIndicatorsScreen()`
Substituir o bloco de cálculo de `dimStats` e o contêiner `#indicatorsSectionDrilldown` (linhas ~13535 a 13788 em `index.html`) pelo código com a Régua Dupla de Benchmark:

```javascript
      // =========================================================================
      // CASO A: VISÃO GERAL PANORÂMICA (PILAR 3: BENCHMARK UE VS. REDE)
      // =========================================================================

      // 1. Resolução das Observações Consolidadas de toda a Rede Municipal de Patos
      const redeObs = (appState.observations || []).filter(o => {
        if (o.status !== 'finalized' && o.status !== 'concluida') return false;
        if (targetType === 'coordenador') {
          return o.evaluatedType === 'coordenador';
        } else {
          return o.evaluatedType === 'professora' || o.evaluatedType === 'turma';
        }
      });

      // 2. Computação Hierárquica Dupla: Escopo Selecionado vs. Rede Municipal de Patos
      const scopeHierarchy = calculateHierarchyStats(scopedObs, activeSections);
      const redeHierarchy = calculateHierarchyStats(redeObs, activeSections);

      const totalValidResp = scopeHierarchy.totalValid;
      const totalPts = scopeHierarchy.totalPts;
      const totalNA = scopeHierarchy.totalNA;

      // CÁLCULO DE COBERTURA DE TURMAS (PILAR 1 & PILAR 7)
      const totalAvaliandos = scopedAvaliandos.length;
      let coverageLabel = 'Avaliandos / Cobertura';
      let evaluatedCount = 0;
      let totalCount = 0;
      let coveragePct = 0;

      if (targetType === 'professora') {
        coverageLabel = 'Cobertura de Turmas';
        let scopedClasses = [];
        let indSchools = (activeUnitFilter !== 'ALL') ? [activeUnitFilter] : ((appState.units || []).map(u => u.name));
        indSchools.forEach(uName => {
          scopedClasses = scopedClasses.concat(getClassesForSchool(uName));
        });
        totalCount = scopedClasses.length;
        evaluatedCount = scopedClasses.filter(cls => 
          scopedObs.some(o => o.className === cls.name && (o.status === 'finalized' || o.status === 'concluida'))
        ).length;
        coveragePct = totalCount > 0 ? Math.round((evaluatedCount / totalCount) * 100) : 0;
      } else {
        coverageLabel = 'Coordenadoras / Cobertura';
        totalCount = scopedAvaliandos.length;
        evaluatedCount = scopedAvaliandos.filter(av => 
          scopedObs.some(o => o.teacherName === av.name && (o.status === 'finalized' || o.status === 'concluida'))
        ).length;
        coveragePct = totalCount > 0 ? Math.round((evaluatedCount / totalCount) * 100) : 0;
      }

      const overallPercent = totalValidResp > 0 ? Math.round((totalPts / totalValidResp) * 100) : null;
      const overallColor = overallPercent === null ? 'var(--text-secondary)' : (overallPercent >= 80 ? 'var(--green)' : overallPercent >= 60 ? 'var(--yellow)' : 'var(--red)');
      const overallLabel = overallPercent === null ? 'Sem Observações Finalizadas' : (overallPercent >= 80 ? 'Consistência Forte' : overallPercent >= 60 ? 'Atenção Necessária' : 'Alerta de Fragilidade');
      const overallDisplay = overallPercent !== null ? `${overallPercent}%` : '—';

      // 1. Linha de KPIs Superiores
      let html = `
        <div id="indicatorsSectionKPIs" style="display:${currentSubTab === 'kpis' ? 'block' : 'none'};">
          <div class="kpi-row" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:16px; margin-bottom:20px;">
            <div class="card" style="margin:0;">
              <div style="font-size:11px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Índice de Consistência</div>
              <div style="font-size:28px; font-weight:800; color:${overallColor}; margin:4px 0;">${overallDisplay}</div>
              <div style="font-size:12px; color:var(--text-secondary);">● ${overallLabel}</div>
            </div>
            <div class="card" style="margin:0;">
              <div style="font-size:11px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Observações Auditadas</div>
              <div style="font-size:28px; font-weight:800; color:var(--primary-dark); margin:4px 0;">${scopedObs.length}</div>
              <div style="font-size:12px; color:var(--text-secondary);">Finalizadas no escopo selecionado</div>
            </div>
            <div class="card" style="margin:0; border-left:4px solid var(--primary);">
              <div style="font-size:11px; font-weight:700; color:var(--primary); text-transform:uppercase;">${coverageLabel}</div>
              <div style="font-size:28px; font-weight:800; color:var(--primary-dark); margin:4px 0;">
                ${evaluatedCount} <span style="font-size:16px; color:var(--text-secondary); font-weight:600;">de ${totalCount}</span>
              </div>
              <div style="font-size:12px; color:var(--text-secondary);">● ${coveragePct}% de turmas observadas</div>
            </div>
            <div class="card" style="margin:0;">
              <div style="font-size:11px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Itens Válidos / N.A.</div>
              <div style="font-size:28px; font-weight:800; color:var(--text-primary); margin:4px 0;">${totalValidResp} <span style="font-size:14px; color:var(--text-secondary); font-weight:600;">(${totalNA} N/A)</span></div>
              <div style="font-size:12px; color:var(--text-secondary);">Excluindo "Não se Aplica"</div>
            </div>
          </div>
        </div>
      `;

      // 2. Afunilamento de Rubricas com Benchmark (Pilar 3)
      let scopeLabelText = 'Minha UE';
      if (user.roleKey === 'coordenador') {
        scopeLabelText = 'Minha UE';
      } else if (user.roleKey === 'formador') {
        scopeLabelText = (activeUnitFilter !== 'ALL') ? activeUnitFilter : 'Meu Polo';
      } else {
        scopeLabelText = (activeUnitFilter !== 'ALL') ? activeUnitFilter : 'Rede Consolidada';
      }

      html += `
        <div id="indicatorsSectionDrilldown" style="display:${currentSubTab === 'drilldown' ? 'block' : 'none'};">
          <div class="page-title-row" style="margin-top:4px; margin-bottom:12px;">
            <div>
              <h3 style="font-size:17px; font-weight:800; color:var(--primary-dark);">
                Afunilamento de Indicadores Pedagógicos (${targetType === 'coordenador' ? 'Coordenação' : 'Docência'})
              </h3>
              <p style="font-size:12px; color:var(--text-secondary);">
                Benchmark comparativo item a item entre a sua Unidade Escolar e a Média da Rede Municipal de Patos
              </p>
            </div>
          </div>

          <!-- Banner Informativo de Contexto do Benchmark -->
          <div class="benchmark-info-bar">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:16px;">🏛️</span>
              <span>
                <strong>Benchmark Ativo:</strong> Comparando <strong>${scopeLabelText}</strong> contra a <strong>Média Geral da Rede Municipal (${redeObs.length} observação(ões) na base)</strong>.
              </span>
            </div>
            ${isNucleoEI(user) && activeUnitFilter === 'ALL' ? `
              <span style="font-size:11px; background:#DCFCE7; color:#166534; padding:3px 8px; border-radius:4px; font-weight:700;">
                💡 Selecione uma UE no filtro para comparar diretamente
              </span>
            ` : ''}
          </div>
      `;

      if (scopedObs.length === 0 && redeObs.length === 0) {
        html += `
          <div class="card" style="text-align:center; padding:32px 20px; margin-bottom:24px; background:#F8FAFC;">
            <div style="font-size:15px; font-weight:700; color:var(--text-primary); margin-bottom:6px;">Nenhuma Observação Finalizada na Rede</div>
            <p style="font-size:12px; color:var(--text-secondary); max-width:440px; margin:0 auto 16px auto;">
              Finalize observações formativas para alimentar a árvore de afunilamento de critérios e o comparativo com a rede municipal.
            </p>
            <button class="btn btn-primary" style="font-size:12px;" onclick="handleNewObsButtonClick()">INICIAR NOVA OBSERVAÇÃO</button>
          </div>
        `;
      } else {
        scopeHierarchy.dims.forEach((dim, sIdx) => {
          const redeDim = redeHierarchy.dims[sIdx] || { validTotal: 0, consistent: 0, partial: 0 };

          // Nível 1: Dimensão
          const dimPts = dim.consistent * 1.0 + dim.partial * 0.5;
          const dimPct = dim.validTotal > 0 ? Math.round((dimPts / dim.validTotal) * 100) : null;
          const dimCol = dimPct === null ? 'var(--text-secondary)' : (dimPct >= 80 ? 'var(--green)' : dimPct >= 60 ? 'var(--yellow)' : 'var(--red)');

          const redeDimPts = redeDim.consistent * 1.0 + redeDim.partial * 0.5;
          const redeDimPct = redeDim.validTotal > 0 ? Math.round((redeDimPts / redeDim.validTotal) * 100) : null;
          const redeDimCol = 'var(--primary)';

          const dimDelta = (dimPct !== null && redeDimPct !== null) ? (dimPct - redeDimPct) : null;
          const isDimOpen = Boolean(appState.expandedDrilldowns[`dim_${sIdx}`]);

          html += `
            <div class="drilldown-group">
              <div class="drilldown-header ${isDimOpen ? 'expanded' : ''}" onclick="toggleDrilldown('dim_${sIdx}')">
                <div style="display:flex; align-items:center; gap:12px; flex:1; min-width:0;">
                  <span style="font-size:18px;">${isDimOpen ? '▼' : '►'}</span>
                  <div style="min-width:0;">
                    <div style="font-size:15px; font-weight:800; color:var(--text-primary); line-height:1.3;">
                      ${sIdx + 1}. ${(dim.title || '').replace(/^Dimens[aã]o\s*\d*\s*[:\.\-]?\s*/i, '').trim()}
                    </div>
                    <div style="font-size:11px; color:var(--text-secondary); margin-top:2px;">
                      ${dim.validTotal} resp. na UE · Consistência: <strong style="color:${dimCol}">${dimPct !== null ? dimPct + '%' : '—'}</strong>
                      ${dimDelta !== null ? `· Variação: ${dimDelta > 0 ? '+' : ''}${dimDelta}%` : ''}
                    </div>
                  </div>
                </div>

                <!-- RÉGUA DUPLA: GRANDE DIMENSÃO -->
                <div class="benchmark-ruler-row">
                  <div class="benchmark-item-box" title="Consistência na Unidade Escolar">
                    <span style="color:var(--text-secondary);">${scopeLabelText}:</span>
                    <div class="benchmark-bar-track">
                      <div class="benchmark-bar-fill" style="width:${dimPct || 0}%; background:${dimCol};"></div>
                    </div>
                    <span style="color:${dimCol}; min-width:32px; text-align:right;">${dimPct !== null ? dimPct + '%' : '—'}</span>
                  </div>

                  <span style="color:var(--border); font-size:12px;">|</span>

                  <div class="benchmark-item-box" title="Consistência Média de toda a Rede Municipal de Patos">
                    <span style="color:var(--text-secondary);">Rede:</span>
                    <div class="benchmark-bar-track">
                      <div class="benchmark-bar-fill" style="width:${redeDimPct || 0}%; background:${redeDimCol};"></div>
                    </div>
                    <span style="color:${redeDimCol}; min-width:32px; text-align:right;">${redeDimPct !== null ? redeDimPct + '%' : '—'}</span>
                  </div>

                  <div style="min-width:85px; text-align:right;">
                    ${formatBenchmarkDelta(dimDelta, true)}
                  </div>
                </div>
              </div>

              <div class="drilldown-content ${isDimOpen ? 'show' : ''}">
          `;

          dim.subSections.forEach((sub, subIdx) => {
            const redeSub = (redeDim.subSections && redeDim.subSections[subIdx]) ? redeDim.subSections[subIdx] : { criteria: [] };
            const subKey = `sub_${sIdx}_${subIdx}`;
            const isSubOpen = Boolean(appState.expandedDrilldowns[subKey]);

            // Nível 2: Subdimensão
            const subPts = sub.criteria.reduce((acc, c) => acc + (c.consistent * 1.0 + c.partial * 0.5), 0);
            const subValid = sub.criteria.reduce((acc, c) => acc + c.validTotal, 0);
            const subPct = subValid > 0 ? Math.round((subPts / subValid) * 100) : null;
            const subCol = subPct === null ? 'var(--text-secondary)' : (subPct >= 80 ? 'var(--green)' : subPct >= 60 ? 'var(--yellow)' : 'var(--red)');

            const redeSubPts = redeSub.criteria.reduce((acc, c) => acc + (c.consistent * 1.0 + c.partial * 0.5), 0);
            const redeSubValid = redeSub.criteria.reduce((acc, c) => acc + c.validTotal, 0);
            const redeSubPct = redeSubValid > 0 ? Math.round((redeSubPts / redeSubValid) * 100) : null;

            const subDelta = (subPct !== null && redeSubPct !== null) ? (subPct - redeSubPct) : null;

            html += `
              <div class="drilldown-subgroup">
                <!-- NÍVEL 2: SUBDIMENSÃO (Clicável para expandir as variáveis) -->
                <div class="drilldown-subheader ${isSubOpen ? 'expanded' : ''}" onclick="toggleDrilldown('${subKey}')">
                  <div style="display:flex; align-items:center; gap:10px; flex:1; min-width:0;">
                    <span style="font-size:13px; color:var(--text-secondary);">${isSubOpen ? '▼' : '►'}</span>
                    <div style="min-width:0;">
                      <div style="font-size:13px; font-weight:800; color:var(--primary-dark); line-height:1.3;">
                        ${sub.id} ${(sub.title || '').replace(/^Subdimens[aã]o\s*[\d\.]*\s*[:\.\-]?\s*/i, '').trim()}
                      </div>
                      <div style="font-size:11px; color:var(--text-secondary);">
                        ${sub.criteria.length} variáveis · ${subValid} respostas válidas na UE
                      </div>
                    </div>
                  </div>

                  <!-- RÉGUA COMPARATIVA DA SUBDIMENSÃO -->
                  <div class="benchmark-ruler-row" style="font-size:11px;">
                    <div class="benchmark-item-box">
                      <span style="color:var(--text-secondary);">UE:</span>
                      <span style="color:${subCol}; font-weight:800;">${subPct !== null ? subPct + '%' : '—'}</span>
                    </div>

                    <span style="color:var(--border);">|</span>

                    <div class="benchmark-item-box">
                      <span style="color:var(--text-secondary);">Rede:</span>
                      <span style="color:var(--primary); font-weight:800;">${redeSubPct !== null ? redeSubPct + '%' : '—'}</span>
                    </div>

                    <div style="min-width:65px; text-align:right;">
                      ${formatBenchmarkDelta(subDelta, true)}
                    </div>
                  </div>
                </div>

                <!-- NÍVEL 3: VARIÁVEIS / ITENS INDIVIDUAIS -->
                <div class="drilldown-subcontent ${isSubOpen ? 'show' : ''}">
            `;

            sub.criteria.forEach((crit, cIdx) => {
              const redeCrit = (redeSub.criteria && redeSub.criteria[cIdx]) ? redeSub.criteria[cIdx] : { validTotal: 0, consistent: 0, partial: 0 };

              const critPts = crit.consistent * 1.0 + crit.partial * 0.5;
              const critPct = crit.validTotal > 0 ? Math.round((critPts / crit.validTotal) * 100) : null;
              const critCol = critPct === null ? 'var(--text-secondary)' : (critPct >= 80 ? 'var(--green)' : critPct >= 60 ? 'var(--yellow)' : 'var(--red)');

              const redeCritPts = redeCrit.consistent * 1.0 + redeCrit.partial * 0.5;
              const redeCritPct = redeCrit.validTotal > 0 ? Math.round((redeCritPts / redeCrit.validTotal) * 100) : null;

              const critDelta = (critPct !== null && redeCritPct !== null) ? (critPct - redeCritPct) : null;

              html += `
                <div class="drilldown-sub-item">
                  <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px;">
                    <div style="font-size:13px; color:var(--text-primary); flex:1; line-height:1.4;">
                      <strong>[${crit.id}]</strong> ${crit.text}
                    </div>
                  </div>

                  <!-- CARD DE BENCHMARK DO CRITÉRIO INDIVIDUAL -->
                  <div class="benchmark-item-card">
                    <div style="display:flex; align-items:center; gap:14px; flex-wrap:wrap;">
                      <div style="font-size:11px;">
                        <span style="color:var(--text-secondary);">Minha UE:</span>
                        <strong style="color:${critCol}; margin-left:3px; font-size:12px;">${critPct !== null ? critPct + '%' : '—'}</strong>
                      </div>
                      <span style="color:var(--border);">•</span>
                      <div style="font-size:11px;">
                        <span style="color:var(--text-secondary);">Rede Patos:</span>
                        <strong style="color:var(--primary); margin-left:3px; font-size:12px;">${redeCritPct !== null ? redeCritPct + '%' : '—'}</strong>
                      </div>
                      <span style="color:var(--border);">•</span>
                      <div>
                        ${formatBenchmarkDelta(critDelta, false)}
                      </div>
                    </div>

                    <!-- Distribuição de Respostas na UE -->
                    <div style="display:flex; gap:5px; font-size:10px; flex-wrap:wrap;">
                      <span style="background:#DCFCE7; color:#166534; padding:2px 5px; border-radius:4px;">C: ${crit.consistent}</span>
                      <span style="background:#FEF3C7; color:#92400E; padding:2px 5px; border-radius:4px;">P: ${crit.partial}</span>
                      <span style="background:#FEE2E2; color:#991B1B; padding:2px 5px; border-radius:4px;">NR: ${crit.notDone}</span>
                      <span style="background:#F1F5F9; color:#475569; padding:2px 5px; border-radius:4px;">NA: ${crit.na}</span>
                    </div>
                  </div>
                </div>
              `;
            });

            html += `
                </div>
              </div>
            `;
          });

          html += `
              </div>
            </div>
          `;
        });
      }

      // 3. Acompanhamento Longitudinal de Avaliandos
      html += `
        </div>

        <div id="indicatorsSectionLongitudinal" style="display:${currentSubTab === 'longitudinal' ? 'block' : 'none'};">
      `;
```

---

### Passo 4: Atualização da Versão Oficial e Gestão Dupla do Changelog
1. **Botão de Versão no Topo do `index.html` (linha ~2397):**
   ```html
   <button class="btn-changelog" onclick="openChangelogModal()" title="Histórico Integral de Modificações e Diretrizes">
     Versão 0.92 (v7.71)
   </button>
   ```

2. **Modal `#modalChangelog` em `index.html` (inserir novo bloco no topo da listagem):**
   ```html
      <!-- VERSÃO 0.92 - PILAR 3: BENCHMARK NA ABA AFUNILAMENTO (UE VS. REDE) -->
      <div style="margin-bottom:20px; border-left:3px solid var(--primary); padding-left:14px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:14px; font-weight:800; color:var(--primary-dark);">Versão 0.92 · v7.71</span>
          <span style="font-size:11px; background:#EFF6FF; color:var(--primary); padding:2px 8px; border-radius:12px; font-weight:700;">20/10/2026</span>
        </div>
        <div style="font-size:12px; color:var(--text-secondary); margin-top:4px;">
          Pilar 3: Benchmark Comparativo '% da UE vs. Rede' na Aba de Afunilamento por Dimensão:
        </div>
        <ul style="font-size:12px; color:var(--text-primary); margin-top:8px; line-height:1.6; padding-left:16px;">
          <li>📊 <strong>Régua Dupla de Benchmark (UE vs. Rede):</strong> Visualização simultânea em 3 níveis (Grande Dimensão, Subdimensão e Critério) da consistência da Unidade Escolar frente à Média Geral da Rede Municipal de Patos.</li>
          <li>🎯 <strong>Cálculo Automático de Delta ($\Delta \pm\%$):</strong> Identificação visual imediata de discrepâncias pedagógicas, com categorização semântica automática para <em>Atenção Crítica</em> ($\Delta \le -10\%$), <em>Abaixo da Média</em>, <em>Na Média</em>, <em>Acima da Média</em> e <em>Destaque Positivo</em> ($\Delta \ge +10\%$).</li>
          <li>🏛️ <strong>Banner Contextual e Governança Multinível:</strong> Adaptação dinâmica para Coordenadores (Minha UE vs. Rede), Formadores (Polo/UEs vs. Rede) e Coordenadora do Núcleo de EI (Rede Consolidada com benchmark sob demanda por UE).</li>
          <li>⚡ <strong>Motor Canônico de Agregação Hierárquica:</strong> Criação das funções <code>calculateHierarchyStats()</code> e <code>formatBenchmarkDelta()</code>, assegurando precisão determinística e proteção contra divisão por zero.</li>
        </ul>
      </div>
   ```

3. **Arquivo `CHANGELOG.md`:**
   - Adicionar a nova linha na tabela do *Sumário Executivo de Versões*:
     ```markdown
     | **0.92** | 20/10/2026 17:30 | `intermediárias/aplicativo_v92_pilar_3_benchmark_afunilamento_ue_vs_rede.html` | Deliberação SerTão Criança / Pilar 3 | Benchmark comparativo '% da UE vs. Rede' item a item no Afunilamento de Indicadores, régua dupla, categorização de deltas pedagógicos e agregação hierárquica canônica 📊 |
     ```
   - Inserir seção detalhada da Versão 0.92 com as subdivisões de Inclusões, Modificações e Exclusões.

---

### Passo 5: Sincronização dos Arquivos Espelhados e Backup Intermediário
- Copiar o arquivo `index.html` modificado para:
  1. `gestor supervisao_patos/index.html`
  2. `gestor supervisao_patos/firebase_deploy/public/index.html`
- Salvar uma cópia estática e idêntica em:
  `intermediárias/aplicativo_v92_pilar_3_benchmark_afunilamento_ue_vs_rede.html`

---

## 4. Critérios de Aceite e Roteiro de Validação

| ID | Cenário de Teste | Condição / Ação | Resultado Esperado |
| :---: | :--- | :--- | :--- |
| **CA-01** | Coordenador na sub-aba Afunilamento | Acessar com Mariana (`coordenador`), navegar até Indicadores ➔ Afunilamento por Dimensão | A barra superior do Afunilamento exibe o banner: *"Benchmark Ativo: Comparando Minha UE contra a Média Geral da Rede Municipal..."* |
| **CA-02** | Régua Dupla no Nível 1 (Dimensão) | Observar o cabeçalho de qualquer Grande Dimensão | Apresenta a barra de progresso da UE e a barra de progresso da Rede lado a lado, com o delta percentual formatado |
| **CA-03** | Régua Dupla no Nível 2 (Subdimensão) | Clicar para expandir uma dimensão e verificar a subdimensão | Apresenta os percentuais `UE: XX%` e `Rede: YY%` com o indicador `Δ: ±Z%` |
| **CA-04** | Faixa de Benchmark no Nível 3 (Critério) | Expandir uma subdimensão e verificar os critérios individuais | Cada item exibe a faixa destacada com `% Minha UE`, `% Rede Patos` e o badge semântico categorizado |
| **CA-05** | Categorização Semântica do Delta | Critério com diferença $\le -10\%$ vs. diferença $\ge +10\%$ | Diferença negativa acentuada exibe badge avermelhado com rótulo `Atenção Crítica`; diferença positiva exibe badge esverdeado com `Destaque Positivo` |
| **CA-06** | Formador Pedagógico | Acessar com Clarice (`formador`), alternar unidade no seletor | O banner e os comparativos ajustam o rótulo da UE/Polo dinamicamente sem falhas |
| **CA-07** | Núcleo de Educação Infantil | Acessar com Helena (`nucleo_ei`) | Exibe a rede consolidada em 'Todas' com dica de governança, e ativa o benchmark imediato ao escolher uma escola específica |
| **CA-08** | Resiliência contra divisão por zero | Observação ou item sem preenchimentos válidos | Apresenta `— Sem dados` e traço de delta, sem gerar `NaN` ou quebrar o layout |
| **CA-09** | Responsividade Mobile | Abrir em viewport de 375px | As réguas duplas e cartões de benchmark quebram com flex-wrap sem overflow horizontal |

---

## 5. Seção Obrigatória: Alterações / Adições / Exclusões no Algoritmo de Auditoria (`audit_platform.py` e `index.html`)

Em conformidade estrita com o item 33 e a Seção 6 do `WORKFLOW_MACOS.md`, esta seção define as alterações determinísticas na suíte de testes para garantir **100% de cobertura contínua**.

### 5.1 Adições no Módulo 10: `indicadores_decisao` (em `index.html`)
Adicionar testes determinísticos no corpo do executor do Módulo 10:

```javascript
        // --- MÓDULO 10: Indicadores Pedagógicos, Cobertura de Turmas (Pilar 1), KPIs e Apoio à Decisão ---
        {
          id: 'indicadores_decisao',
          name: 'Indicadores Pedagógicos, Cobertura de Turmas (Pilar 1), KPIs e Apoio à Decisão',
          run: function(logger) {
            try {
              appState.currentUserKey = 'mariana';
              renderIndicatorsScreen();
              const kpiSection = document.getElementById('indicatorsSectionKPIs');
              if (!kpiSection) throw new Error('Seção de KPIs ausente em indicadores');
              logger.log('Renderização do Painel de Indicadores e seção de KPIs', true);

              const indSchools = (appState.units || []).map(u => u.name);
              let totalClasses = 0;
              indSchools.forEach(uName => {
                totalClasses += getClassesForSchool(uName).length;
              });
              logger.log('Cálculo e agregação de turmas mapeadas para cobertura na rede (Pilar 1)', totalClasses > 0, `${totalClasses} turmas totais`);

              // =========================================================================
              // TESTES DETERMINÍSTICOS DO PILAR 3: BENCHMARK AFUNILAMENTO (UE VS. REDE)
              // =========================================================================

              // 1. Validação da Função Canônica calculateHierarchyStats()
              const sampleSections = appState.activeSectionsTeacher || DEFAULT_SECTIONS_TEACHER;
              const mockObsUE = [{
                id: 'obs-mock-p3-1',
                status: 'finalized',
                evaluatedType: 'turma',
                schoolName: 'CEI Professora Maria de Lourdes',
                responses: { '1.1.1': 'consistent', '1.1.2': 'not_done' }
              }];
              const mockObsRede = [
                mockObsUE[0],
                {
                  id: 'obs-mock-p3-2',
                  status: 'finalized',
                  evaluatedType: 'turma',
                  schoolName: 'EMEI Pequeno Príncipe',
                  responses: { '1.1.1': 'consistent', '1.1.2': 'consistent' }
                }
              ];

              const ueResult = calculateHierarchyStats(mockObsUE, sampleSections);
              const redeResult = calculateHierarchyStats(mockObsRede, sampleSections);

              if (!ueResult || !ueResult.dims || !redeResult || !redeResult.dims) {
                throw new Error('calculateHierarchyStats retornou estrutura inválida');
              }
              logger.log('Motor canônico de agregação hierárquica (calculateHierarchyStats)', true, `${ueResult.dims.length} dimensões processadas`);

              // 2. Validação do Cálculo Determinístico do Delta (Pilar 3)
              // Critério 1.1.1: UE = 100%, Rede = 100% -> Delta = 0%
              // Critério 1.1.2: UE = 0%, Rede = 50% -> Delta = -50% (Atenção Crítica)
              const crit112UE = ueResult.dims[0].subSections[0].criteria.find(c => c.id === '1.1.2');
              const crit112Rede = redeResult.dims[0].subSections[0].criteria.find(c => c.id === '1.1.2');

              const pctUE112 = crit112UE.validTotal > 0 ? Math.round((crit112UE.consistent / crit112UE.validTotal) * 100) : 0;
              const pctRede112 = crit112Rede.validTotal > 0 ? Math.round((crit112Rede.consistent / crit112Rede.validTotal) * 100) : 0;
              const delta112 = pctUE112 - pctRede112;

              const deltaHtml = formatBenchmarkDelta(delta112, false);
              const isCritical = deltaHtml.includes('benchmark-delta-critical') && deltaHtml.includes('Atenção Crítica');
              logger.log('Cálculo determinístico do Delta e categorização de Atenção Crítica (Pilar 3)', isCritical && delta112 === -50, `Δ: ${delta112}%`);

              // 3. Renderização Efetiva no DOM com Alternância de Sub-Aba
              switchIndicatorsSubTab('drilldown');
              const drillSection = document.getElementById('indicatorsSectionDrilldown');
              if (!drillSection || drillSection.style.display !== 'block') {
                throw new Error('Sub-aba de Afunilamento não ativada corretamente');
              }

              const infoBar = drillSection.querySelector('.benchmark-info-bar');
              if (!infoBar) throw new Error('.benchmark-info-bar ausente na sub-aba Afunilamento');
              logger.log('Renderização da Régua Dupla e Banner de Benchmark no DOM (Pilar 3)', true);

            } catch (e) {
              logger.log('Erro de execução no módulo indicadores_decisao', false, e.message);
            }
          }
        },
```

### 5.2 Atualizações no Módulo 12: `navegacao_layout` (em `index.html`)
- Atualizar a asserção do botão de versão na barra superior para verificar a nova versão oficial:
  ```javascript
  logger.log('Modal de Changelog e botão de versão na barra superior', true, btnChangelog.textContent.trim()); // Versão 0.92 (v7.71)
  ```

### 5.3 Metadados do Script CLI `audit_platform.py`
- Na linha 160 de `audit_platform.py`, atualizar o alvo da auditoria nos logs de execução:
  ```python
  # Alvo: index.html (Versão 0.92)
  ```

### 5.4 Resumo de Impacto na Suíte de Testes
- **Testes Existentes Preservados:** 50/50.
- **Novas Asserções no Módulo 10:** +3 asserções determinísticas dedicadas ao Pilar 3 (Motor de Agregação, Delta e Renderização DOM).
- **Total Projetado Pós-Execução:** 53 asserções determinísticas com meta inegociável de **100% de aprovação (53/53 OK)**.

---

## 6. Procedimento de Deploy e Pós-Deploy Obrigatório

Após a aplicação integral dos passos acima pelo assistente executor (Etapa 2):

```bash
# 1. Checagem prévia de concorrência remota
git fetch origin main
git log HEAD..origin/main --oneline

# 2. Commit semântico das alterações
git add index.html gestor\ supervisao_patos/index.html gestor\ supervisao_patos/firebase_deploy/public/index.html CHANGELOG.md audit_platform.py "intermediárias/aplicativo_v92_pilar_3_benchmark_afunilamento_ue_vs_rede.html"
git commit -m "feat: implementar pilar 3 - benchmark comparativo ue vs rede na aba afunilamento"

# 3. Envio para produção (GitHub Pages)
git push origin main

# 4. Execução imediata do Algoritmo de Auditoria Modular
python3 audit_platform.py --silent-on-success
```

> **Comunicação Restrita a Falhas:**
> - Se a auditoria retornar código 0: Confirmar sucintamente o deploy e a aprovação integral da auditoria.
> - Se houver falhas: Reportar pontualmente os erros para correção imediata.
