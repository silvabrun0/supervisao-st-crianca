    // --- 12. DRILL-DOWN DASHBOARD & INDICATORS ---
    
    /**
     * Ação Rápida: Focar filtro de Unidade Escolar a partir da Tabela Executiva
     */
    function focusUnitFilter(uName) {
      const unitSelect = document.getElementById('indicatorsUnitFilter');
      if (unitSelect) {
        unitSelect.value = uName;
        const memberSelect = document.getElementById('indicatorsMemberFilter');
        if (memberSelect) memberSelect.value = 'ALL';
        renderIndicatorsScreen();
        // Rola suavemente até o topo dos indicadores
        const toolbar = document.getElementById('indicatorsFilterToolbar');
        if (toolbar) toolbar.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    /**
     * Alterna a gaveta retrátil de turmas pendentes no Card 2 de Cobertura Bimestral
     */
    function togglePendingClassesDrawer() {
      const drawer = document.getElementById('pendingClassesDrawer');
      if (drawer) {
        drawer.style.display = (drawer.style.display === 'none' || drawer.style.display === '') ? 'block' : 'none';
      }
    }

    /**
     * Expande todos os nós (Dimensões e Subdimensões) na Matriz de Critérios
     */
    function expandAllDrilldown() {
      if (!appState.expandedDrilldowns) appState.expandedDrilldowns = {};
      const groups = document.querySelectorAll('.drilldown-group');
      groups.forEach((g, idx) => {
        appState.expandedDrilldowns[`dim_${idx}`] = true;
      });
      const subHeaders = document.querySelectorAll('.drilldown-subheader');
      subHeaders.forEach(sh => {
        const onclickAttr = sh.getAttribute('onclick') || '';
        const match = onclickAttr.match(/toggleDrilldown\('([^']+)'\)/);
        if (match && match[1]) {
          appState.expandedDrilldowns[match[1]] = true;
        }
      });
      renderIndicatorsScreen();
      switchIndicatorsSubTab('drilldown');
    }

    /**
     * Recolhe todos os nós na Matriz de Critérios
     */
    function collapseAllDrilldown() {
      appState.expandedDrilldowns = {};
      renderIndicatorsScreen();
      switchIndicatorsSubTab('drilldown');
    }

    /**
     * Busca instantânea por texto ou código de critério na Matriz de Critérios
     */
    function onDrilldownSearch(query) {
      appState._drilldownSearchQuery = (query || '').trim().toLowerCase();
      const q = appState._drilldownSearchQuery;
      const items = document.querySelectorAll('.drilldown-sub-item');
      let matchCount = 0;

      items.forEach(item => {
        const text = (item.innerText || '').toLowerCase();
        if (!q || text.includes(q)) {
          item.style.display = '';
          matchCount++;
          // Se estiver pesquisando termo ativo, expande os ancestrais automaticamente
          if (q) {
            const subgroup = item.closest('.drilldown-subgroup');
            if (subgroup) {
              const subContent = subgroup.querySelector('.drilldown-content');
              if (subContent) subContent.classList.add('show');
              const subHeader = subgroup.querySelector('.drilldown-subheader');
              if (subHeader) subHeader.classList.add('expanded');
            }
            const group = item.closest('.drilldown-group');
            if (group) {
              const groupContent = group.querySelector('.drilldown-content');
              if (groupContent) groupContent.classList.add('show');
              const groupHeader = group.querySelector('.drilldown-header');
              if (groupHeader) groupHeader.classList.add('expanded');
            }
          }
        } else {
          item.style.display = 'none';
        }
      });
    }

    /**
     * Filtro rápido por chips de faixa percentual de consistência na Matriz
     */
    function filterDrilldownByScore(range) {
      appState._drilldownScoreFilter = range; // 'all', 'low', 'med', 'high'
      const items = document.querySelectorAll('.drilldown-sub-item');
      items.forEach(item => {
        const scoreAttr = item.getAttribute('data-score');
        const score = scoreAttr !== null && scoreAttr !== '' ? parseInt(scoreAttr, 10) : null;
        if (range === 'all' || score === null) {
          item.style.display = '';
        } else if (range === 'low' && score < 60) {
          item.style.display = '';
        } else if (range === 'med' && score >= 60 && score < 80) {
          item.style.display = '';
        } else if (range === 'high' && score >= 80) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
      // Atualiza botões de chip
      document.querySelectorAll('.drilldown-chip-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-range') === range);
      });
    }

    /**
     * Motor Universal de Ranqueamento de Critérios (Fragilidades e Práticas Consolidadas)
     * @param {Object} scopeHierarchy Estatísticas da UE/Polo/Rede
     * @param {Object} redeHierarchy Estatísticas consolidadas da Rede de Patos
     * @param {String} mode 'lowest' (menor consistência), 'delta' (maior desvio vs rede), 'highest' (pontos fortes)
     * @param {Number} count Quantidade de registros a retornar (padrão: 3)
     */
    function calculateTopCriteria(scopeHierarchy, redeHierarchy, mode, count) {
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
                subId: sub.id,
                subTitle: `${sub.id} ${subTitle}`,
                score: score,
                redeScore: redeScore,
                delta: delta,
                consistent: crit.consistent,
                partial: crit.partial,
                notDone: crit.notDone,
                na: crit.na || 0,
                validTotal: crit.validTotal,
                severity: score < 60 ? 'critical' : (score < 80 ? 'warning' : 'stable')
              });
            }
          });
        });
      });

      if (allCriteria.length === 0) return [];

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

    function toggleDrilldown(key) {
      appState.expandedDrilldowns[key] = !appState.expandedDrilldowns[key];
      renderIndicatorsScreen();
    }

    // Disparadores Reativos para Mudança de Filtros no Painel
        function syncIndicatorsFilterUI() {
      // Sincronização e validação de estado visual dos seletores de indicadores
    }

    function onIndicatorsTargetTypeChange() {
      const targetSelect = document.getElementById('indicatorsTargetTypeFilter');
      if (targetSelect) {
        const user = getCurrentUser();
        if (user) targetSelect.dataset.userSelectedRole = user.email;
      }
      const memberSelect = document.getElementById('indicatorsMemberFilter');
      if (memberSelect) memberSelect.value = 'ALL';
      renderIndicatorsScreen();
    }

    function onIndicatorsUnitChange() {
      const memberSelect = document.getElementById('indicatorsMemberFilter');
      if (memberSelect) memberSelect.value = 'ALL';
      renderIndicatorsScreen();
    }

    function selectTeacherForLongitudinalAnalysis(teacherName) {
      const memberSelect = document.getElementById('indicatorsMemberFilter');
      if (memberSelect) {
        memberSelect.value = teacherName;
      }
      appState.activeIndicatorsSubTab = 'drilldown';
      renderIndicatorsScreen();
      // Scroll suave até o container
      const container = document.getElementById('indicatorsBodyContainer');
      if (container) {
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    function clearTeacherLongitudinalFilter() {
      const memberSelect = document.getElementById('indicatorsMemberFilter');
      if (memberSelect) {
        memberSelect.value = 'ALL';
      }
      appState.activeIndicatorsSubTab = 'longitudinal';
      renderIndicatorsScreen();
    }

    function switchIndicatorsSubTab(tabKey) {
      appState.activeIndicatorsSubTab = tabKey;

      const memberSelect = document.getElementById('indicatorsMemberFilter');
      if (tabKey === 'longitudinal' && memberSelect && memberSelect.value !== 'ALL') {
        memberSelect.value = 'ALL';
        renderIndicatorsScreen();
        return;
      }

      document.querySelectorAll('.indicators-subtab-pill').forEach(btn => btn.classList.remove('active'));
      const activeBtn = document.getElementById(
        tabKey === 'kpis' ? 'pillIndKpis' : 
        tabKey === 'drilldown' ? 'pillIndDrilldown' : 'pillIndLongitudinal'
      );
      if (activeBtn) activeBtn.classList.add('active');

      const secKpis = document.getElementById('indicatorsSectionKPIs');
      const secDrilldown = document.getElementById('indicatorsSectionDrilldown');
      const secLongitudinal = document.getElementById('indicatorsSectionLongitudinal');

      if (secKpis) secKpis.style.display = (tabKey === 'kpis') ? 'block' : 'none';
      if (secDrilldown) secDrilldown.style.display = (tabKey === 'drilldown') ? 'block' : 'none';
      if (secLongitudinal) secLongitudinal.style.display = (tabKey === 'longitudinal') ? 'block' : 'none';
    }

    // Cálculo da Tendência / Trajetória Pedagógica de um Critério Individual
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

    function calculateCriterionTrend(responsesByBimester) {
      // responsesByBimester: { '1º Bimestre': 'partial', '2º Bimestre': 'consistent', ... }
      const bimesters = ['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre'];
      const scoreMap = { 'consistent': 2, 'partial': 1, 'not_done': 0 };

      const validBims = [];
      bimesters.forEach(bim => {
        const r = responsesByBimester[bim];
        if (r && r !== 'na' && scoreMap[r] !== undefined) {
          validBims.push({ bimester: bim, val: scoreMap[r], raw: r });
        }
      });

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
    }

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

    // =========================================================================
    // PILAR 8: DIAGNÓSTICO DE PRIORIDADES - FOCO NOS MENORES ÍNDICES (GARGALOS)
    // =========================================================================

    /**
     * Extrai, cruza e ranqueia os critérios da matriz para identificar os menores índices (gargalos).
     * @param {Object} scopeHierarchy Estatísticas hierárquicas do escopo ativo (UE/Polo/Rede)
     * @param {Object} redeHierarchy Estatísticas hierárquicas consolidadas de toda a Rede
     * @param {String} sortMode 'absolute' (menor consistência na UE) ou 'delta' (maior defasagem vs. rede)
     * @param {Number} limit Quantidade de critérios a retornar (padrão: 3)
     */
    function calculateTopBottlenecks(scopeHierarchy, redeHierarchy, sortMode = 'absolute', limit = 3) {
      if (!scopeHierarchy || !scopeHierarchy.dims) return [];

      const list = [];

      scopeHierarchy.dims.forEach((dim, sIdx) => {
        const redeDim = (redeHierarchy && redeHierarchy.dims && redeHierarchy.dims[sIdx]) ? redeHierarchy.dims[sIdx] : null;
        
        (dim.subSections || []).forEach((sub, subIdx) => {
          const redeSub = (redeDim && redeDim.subSections && redeDim.subSections[subIdx]) ? redeDim.subSections[subIdx] : null;
          const subKey = `sub_${sIdx}_${subIdx}`;

          (sub.criteria || []).forEach((crit, cIdx) => {
            const redeCrit = (redeSub && redeSub.criteria && redeSub.criteria[cIdx]) ? redeSub.criteria[cIdx] : null;

            // Critérios elegíveis: apenas aqueles com pelo menos 1 resposta válida no escopo
            if (crit.validTotal > 0) {
              const pts = crit.consistent * 1.0 + crit.partial * 0.5;
              const score = Math.round((pts / crit.validTotal) * 100);

              let redeScore = null;
              let delta = null;
              if (redeCrit && redeCrit.validTotal > 0) {
                const redePts = redeCrit.consistent * 1.0 + redeCrit.partial * 0.5;
                redeScore = Math.round((redePts / redeCrit.validTotal) * 100);
                delta = score - redeScore;
              }

              const dimTitle = (dim.title || '').replace(/^Dimens[aã]o\s*\d*\s*[:\.\-]?\s*/i, '').trim();
              const subTitle = (sub.title || '').replace(/^Subdimens[aã]o\s*[\d\.]*\s*[:\.\-]?\s*/i, '').trim();

              list.push({
                critId: crit.id,
                critText: crit.text,
                dimIndex: sIdx,
                dimTitle: `${sIdx + 1}. ${dimTitle}`,
                subKey: subKey,
                subId: sub.id,
                subTitle: `${sub.id} ${subTitle}`,
                validTotal: crit.validTotal,
                consistent: crit.consistent,
                partial: crit.partial,
                notDone: crit.notDone,
                na: crit.na,
                score: score,
                redeScore: redeScore,
                delta: delta,
                severity: score < 60 ? 'critical' : (score < 80 ? 'warning' : 'stable')
              });
            }
          });
        });
      });

      if (list.length === 0) return [];

      // Ordenação conforme o modo ativo
      list.sort((a, b) => {
        if (sortMode === 'delta') {
          // Prioriza itens com desvio negativo mais acentuado (delta mais baixo: ex: -45% antes de -15%)
          if (a.delta !== null && b.delta !== null) {
            if (a.delta !== b.delta) return a.delta - b.delta;
            // Desempate 1: menor score absoluto na UE
            if (a.score !== b.score) return a.score - b.score;
            // Desempate 2: maior quantidade de fragilidades somadas
            return (b.notDone + b.partial) - (a.notDone + a.partial);
          }
          if (a.delta !== null) return -1;
          if (b.delta !== null) return 1;
          return a.score - b.score;
        } else {
          // Menor consistência absoluta (padrão): menor score primeiro
          if (a.score !== b.score) return a.score - b.score;
          // Desempate 1: menor delta em relação à rede
          if (a.delta !== null && b.delta !== null) return a.delta - b.delta;
          // Desempate 2: maior quantidade de respostas 'not_done' e 'partial'
          return (b.notDone + b.partial) - (a.notDone + a.partial);
        }
      });

      return list.slice(0, limit);
    }

    /**
     * Alterna o modo de ordenação do Bloco do Pilar 8 e re-renderiza o bloco
     */
    function toggleBottlenecksSortMode(newMode) {
      appState.bottlenecksSortMode = newMode;
      renderIndicatorsScreen();
    }

    /**
     * Rola suavemente até o Bloco de Diagnóstico de Gargalos
     */
    function scrollToBottlenecksBlock() {
      const el = document.getElementById('indicatorsSectionBottlenecks');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    /**
     * Alterna para a sub-aba de Afunilamento, expande a dimensão e subdimensão correspondentes
     * e rola até o critério destacando-o com animação de pulso visual.
     */
    function locateBottleneckCriterionInDrilldown(critId, dimIndex, subKey) {
      if (!critId) return;

      // 1. Muda para a sub-aba Afunilamento
      switchIndicatorsSubTab('drilldown');

      // 2. Garante a expansão no estado da aplicação
      appState.expandedDrilldowns[`dim_${dimIndex}`] = true;
      appState.expandedDrilldowns[subKey] = true;

      // 3. Re-renderiza a tela para garantir que o DOM reflita as seções expandidas
      renderIndicatorsScreen();
      switchIndicatorsSubTab('drilldown');

      // 4. Aguarda microtarefa de renderização para localizar e animar o elemento no DOM
      setTimeout(() => {
        const domId = `drilldownCrit_${critId.replace(/\./g, '_')}`;
        const targetEl = document.getElementById(domId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          targetEl.classList.remove('highlight-bottleneck-pulse');
          // Força reflow
          void targetEl.offsetWidth;
          targetEl.classList.add('highlight-bottleneck-pulse');
        } else {
          if (typeof showToast === 'function') {
            showToast(`Critério [${critId}] expandido na Visualização por Dimensão.`);
          }
        }
      }, 100);
    }

    /**
     * Gera e copia para o clipboard o resumo diagnóstico dos critérios prioritários (gargalos).
     */
    function copyMeetingAgendaToClipboard(scopeLabelText, targetType) {
      const targetTypeName = targetType === 'coordenador' ? 'Coordenação Pedagógica' : 'Prática Docente Infantil';
      const bottlenecks = appState._lastComputedBottlenecks || [];

      if (bottlenecks.length === 0) {
        if (typeof showToast === 'function') showToast('Nenhum gargalo identificado para compor o resumo.', 'warning');
        return;
      }

      const today = new Date().toLocaleDateString('pt-BR');
      let text = `📋 DIAGNÓSTICO DE CRITÉRIOS PRIORITÁRIOS (GARGALOS) · SERTÃO CRIANÇA\n`;
      text += `📅 Data: ${today} | Escopo: ${scopeLabelText} | Segmento: ${targetTypeName}\n`;
      text += `------------------------------------------------------------\n`;
      text += `🎯 OS 3 CRITÉRIOS PRIORITÁRIOS PARA INTERVENÇÃO PEDAGÓGICA:\n\n`;

      bottlenecks.forEach((b, idx) => {
        const rank = idx + 1;
        const deltaText = b.delta !== null ? `${b.delta > 0 ? '+' : ''}${b.delta}% vs. Rede Patos` : 'Sem referencial municipal';
        text += `${rank}. [${b.critId}] ${b.critText}\n`;
        text += `   • Localização: ${b.dimTitle} · ${b.subTitle}\n`;
        text += `   • Consistência na UE: ${b.score}% (Rede Municipal: ${b.redeScore !== null ? b.redeScore + '%' : '—'} · Δ: ${deltaText})\n`;
        text += `   • Evidências Observadas: C: ${b.consistent} | P: ${b.partial} | NR: ${b.notDone}\n\n`;
      });

      text += `💡 QUESTÕES NORTEADORAS PARA A EQUIPE:\n`;
      text += `1. Quais desafios e potências as docentes vivenciaram na rotina desses 3 critérios?\n`;
      text += `2. Que combinados e apoios pedagógicos coletivos pactuaremos para apoiar as salas neste ciclo?\n`;
      text += `------------------------------------------------------------\n`;
      text += `Sistema de Supervisão SerTão Criança · Patos/PB`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          if (typeof showToast === 'function') {
            showToast('Resumo diagnóstico dos gargalos copiado para a área de transferência! 📋');
          } else {
            alert('Diagnóstico copiado com sucesso!');
          }
        }).catch(err => {
          console.warn('Erro ao copiar clipboard:', err);
        });
      }
    }

    /**
     * Renderiza o HTML completo do Bloco do Pilar 8
     */
    function renderBottlenecksPrioritySection(scopeHierarchy, redeHierarchy, scopeLabelText, targetType) {
      const sortMode = appState.bottlenecksSortMode || 'absolute';
      const criteriaMode = sortMode === 'highest' ? 'highest' : (sortMode === 'delta' ? 'delta' : 'lowest');
      const bottlenecks = calculateTopCriteria(scopeHierarchy, redeHierarchy, criteriaMode, 3);
      appState._lastComputedBottlenecks = bottlenecks;

      const isCoord = targetType === 'coordenador';
      const audienceName = isCoord ? 'da Coordenação Pedagógica' : 'da Prática Docente';

      let cardsHtml = '';

      if (bottlenecks.length === 0) {
        cardsHtml = `
          <div style="background:#F8FAFC; border:1px dashed #CBD5E1; border-radius:10px; padding:28px 16px; text-align:center; grid-column: 1 / -1;">
            <div style="margin-bottom:8px;">
              <svg style="width:32px; height:32px; color:var(--primary);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="6" r="6"></circle>
                <circle cx="12" cy="2" r="2"></circle>
              </svg>
            </div>
            <div style="font-size:14px; font-weight:700; color:var(--text-primary); margin-bottom:4px;">
              Nenhum Critério Avaliado no Escopo
            </div>
            <p style="font-size:12px; color:var(--text-secondary); max-width:480px; margin:0 auto;">
              Finalize observações com preenchimento da matriz para que o sistema identifique automaticamente os 3 critérios prioritários para a formação da equipe.
            </p>
          </div>
        `;
      } else {
        const allConsistent = bottlenecks.every(b => b.score >= 80);

        if (allConsistent) {
          cardsHtml += `
            <div style="background:#F0FDF4; border:1px solid #BBF7D0; border-radius:8px; padding:10px 14px; margin-bottom:12px; grid-column: 1 / -1; display:flex; align-items:center; gap:8px; font-size:12px; color:#166534;">
              <svg class="btn-icon-sm" style="color:var(--green); flex-shrink:0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span><strong>Excelente Desempenho:</strong> Todos os critérios avaliados apresentam Consistência Forte (≥ 80%). Os 3 pontos abaixo representam marcas para manutenção do padrão pedagógico.</span>
            </div>
          `;
        }

        bottlenecks.forEach((b, idx) => {
          const rank = idx + 1;
          const rankClass = rank === 1 ? 'bottleneck-rank-1' : (rank === 2 ? 'bottleneck-rank-2' : 'bottleneck-rank-3');
          const borderClass = b.severity === 'critical' ? 'bottleneck-card-critical' : (b.severity === 'warning' ? 'bottleneck-card-warning' : 'bottleneck-card-stable');
          const scoreColor = b.score >= 80 ? 'var(--green)' : (b.score >= 60 ? 'var(--yellow)' : 'var(--red)');

          cardsHtml += `
            <div class="bottleneck-card ${borderClass}" id="cardBottleneckRank_${rank}">
              <div>
                <!-- CABEÇALHO DO CARD -->
                <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px; margin-bottom:8px;">
                  <span class="bottleneck-badge-rank ${rankClass}">
                    #${rank} ${b.score < 60 ? 'Gargalo Crítico' : (b.score < 80 ? 'Atenção Necessária' : 'Manutenção')}
                  </span>
                  <span style="font-size:11px; font-weight:700; color:var(--text-secondary); text-align:right;">
                    ${b.validTotal} resp.
                  </span>
                </div>

                <!-- DIMENSÃO E SUBDIMENSÃO -->
                <div style="font-size:11px; font-weight:700; color:var(--primary); margin-bottom:4px; text-transform:uppercase; letter-spacing:0.3px;">
                  ${b.dimTitle}
                </div>
                <div style="font-size:11px; color:var(--text-secondary); margin-bottom:8px; line-height:1.2;">
                  ${b.subTitle}
                </div>

                <!-- ENUNCIADO DO CRITÉRIO -->
                <div style="font-size:13px; font-weight:700; color:var(--text-primary); line-height:1.35; margin-bottom:10px;">
                  <strong>[${b.critId}]</strong> ${b.critText}
                </div>

                <!-- MINI GRID DE BENCHMARK -->
                <div class="bottleneck-metric-row">
                  <div>
                    <div style="font-size:10px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">${scopeLabelText}</div>
                    <div style="font-size:20px; font-weight:800; color:${scoreColor};">${b.score}%</div>
                  </div>
                  <div>
                    <div style="font-size:10px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Rede Patos</div>
                    <div style="font-size:20px; font-weight:800; color:var(--primary);">${b.redeScore !== null ? b.redeScore + '%' : '—'}</div>
                  </div>
                  <div>
                    <div style="font-size:10px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Variação (Δ)</div>
                    <div style="margin-top:2px;">${formatBenchmarkDelta(b.delta, true)}</div>
                  </div>
                </div>

                <!-- EVIDÊNCIAS DE RESPOSTA -->
                <div style="display:flex; justify-content:center; gap:6px; font-size:10px; font-weight:700; margin-bottom:12px;">
                  <span style="background:#DCFCE7; color:#166534; padding:2px 6px; border-radius:4px;">C: ${b.consistent}</span>
                  <span style="background:#FEF3C7; color:#92400E; padding:2px 6px; border-radius:4px;">P: ${b.partial}</span>
                  <span style="background:#FEE2E2; color:#991B1B; padding:2px 6px; border-radius:4px;">NR: ${b.notDone}</span>
                </div>
              </div>

              <!-- BOTÃO DE AÇÃO: LOCALIZAR NA VISUALIZAÇÃO POR DIMENSÃO -->
              <div class="bottleneck-actions-row">
                <button type="button" class="btn btn-secondary" style="font-size:11px; padding:5px 10px; display:inline-flex; align-items:center; gap:4px; font-weight:700;" onclick="locateBottleneckCriterionInDrilldown('${b.critId}', ${b.dimIndex}, '${b.subKey}')" title="Abrir este critério na árvore completa de Visualização por Dimensão com régua dupla">
                  <svg class="btn-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <span>Ver na Visualização por Dimensão</span>
                </button>
              </div>
            </div>
          `;
        });
      }

      let consolidatedNotice = '';
      const unitEl = document.getElementById('indicatorsUnitFilter');
      const currentUnitVal = unitEl ? unitEl.value : 'ALL';
      const isConsolidatedRede = (currentUnitVal === 'ALL' || (scopeLabelText && (scopeLabelText.includes('Toda a Rede') || scopeLabelText.includes('Rede Consolidada') || scopeLabelText.includes('Visão Geral')))) || (bottlenecks.length > 0 && bottlenecks.every(b => b.delta === 0));
      if (sortMode === 'delta' && isConsolidatedRede) {
        consolidatedNotice = `
          <div style="background:#F0F9FF; border:1px solid #BAE6FD; border-radius:8px; padding:10px 14px; margin-bottom:12px; grid-column: 1 / -1; display:flex; align-items:flex-start; gap:8px; font-size:12px; color:#0369A1; line-height:1.4;">
            <svg class="btn-icon-sm" style="color:#0369A1; flex-shrink:0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 18h6"></path>
              <path d="M10 22h4"></path>
              <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5"></path>
            </svg>
            <span><strong>Visão Consolidada da Rede de Patos:</strong> Neste escopo ampliado, a média avaliada coincide com a própria rede municipal (Δ = 0%). Para verificar quais critérios específicos apresentam maior defasagem comparativa, selecione uma Unidade Escolar específica no filtro superior.</span>
          </div>
        `;
      }

      return `
        <div class="bottlenecks-priority-block" id="indicatorsSectionBottlenecks">
          <div class="bottlenecks-header-row">
            <div class="bottlenecks-title-group">
              <div style="display:flex; align-items:center; gap:8px;">
                <svg class="btn-icon-lg" style="color:var(--primary);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="6" r="6"></circle>
                  <circle cx="12" cy="2" r="2"></circle>
                </svg>
                <h3 style="margin:0;">
                  Foco nos Menores Índices (Gargalos Pedagógicos)
                </h3>
              </div>
              <p>
                Identificação algorítmica dos 3 critérios mais frágeis ${audienceName} em <strong>${scopeLabelText}</strong> para subsidiar a reflexão pedagógica e o planejamento da equipe.
              </p>
            </div>

            <div class="bottlenecks-controls-group">
              <!-- ALTERNADOR DE MODO DE ORDENAÇÃO -->
              <div class="bottlenecks-toggle-pill">
                <button type="button" class="bottlenecks-toggle-btn ${sortMode === 'absolute' ? 'active' : ''}" onclick="toggleBottlenecksSortMode('absolute')" title="Ordenar pelos menores índices absolutos de consistência na escola" style="display:inline-flex; align-items:center; gap:4px;">
                  <svg class="btn-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                  <span>Menor Consistência</span>
                </button>
                <button type="button" class="bottlenecks-toggle-btn ${sortMode === 'delta' ? 'active' : ''}" onclick="toggleBottlenecksSortMode('delta')" title="Ordenar pela maior defasagem negativa em relação à Rede de Patos" style="display:inline-flex; align-items:center; gap:4px;">
                  <svg class="btn-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 22 22 2 22"></polygon>
                  </svg>
                  <span>Maior Desvio vs. Rede</span>
                </button>
                <button type="button" class="bottlenecks-toggle-btn ${sortMode === 'highest' ? 'active' : ''}" onclick="toggleBottlenecksSortMode('highest')" title="Ordenar pelas práticas com maior consistência consolidada na escola" style="display:inline-flex; align-items:center; gap:4px;">
                  <svg class="btn-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <span>Maior Consistência</span>
                </button>
              </div>

              <!-- BOTÃO DE COPIAR RESUMO DIAGNÓSTICO -->
              <button type="button" class="btn btn-secondary" onclick="copyMeetingAgendaToClipboard('${scopeLabelText}', '${targetType}')" style="font-size:11px; padding:5px 10px; font-weight:700; display:inline-flex; align-items:center; gap:4px;" title="Copiar resumo dos critérios prioritários">
                <svg class="btn-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                </svg>
                <span>Copiar Diagnóstico</span>
              </button>
            </div>
          </div>

          <!-- GRID DOS 3 CARDS DE GARGALO -->
          <div class="bottlenecks-grid">
            ${consolidatedNotice}
            ${cardsHtml}
          </div>
        </div>
      `;
    }

    // =========================================================================
    // PILAR 9: CONTROLADORES DA GAVETA DESLIZANTE E GATILHO FLUTUANTE MOBILE
    // =========================================================================

    function openMobileIndicatorsFiltersModal() {
      const modal = document.getElementById('modalIndicatorsFiltersMobile');
      if (!modal) return;

      const user = getCurrentUser();
      const deskTarget = document.getElementById('indicatorsTargetTypeFilter');
      const deskUnit = document.getElementById('indicatorsUnitFilter');
      const deskMember = document.getElementById('indicatorsMemberFilter');
      const deskBim = document.getElementById('indicatorsBimesterFilter');

      const mobTargetGroup = document.getElementById('mobileIndTargetTypeGroup');
      const mobTarget = document.getElementById('mobileIndTargetTypeFilter');
      const mobUnit = document.getElementById('mobileIndUnitFilter');
      const mobMember = document.getElementById('mobileIndMemberFilter');
      const mobMemberLabel = document.getElementById('mobileIndMemberLabel');
      const mobBim = document.getElementById('mobileIndBimesterFilter');
      const mobClearBtn = document.getElementById('btnMobileIndClearMember');

      // 1. Sincroniza visibilidade do seletor de Público-Alvo
      if (user.roleKey === 'coordenador' || user.roleKey === 'professora') {
        if (mobTargetGroup) mobTargetGroup.style.display = 'none';
      } else {
        if (mobTargetGroup) mobTargetGroup.style.display = 'block';
        if (mobTarget && deskTarget) mobTarget.value = deskTarget.value || 'professora';
      }

      // 2. Clona opções e sincroniza valor de Unidade Escolar
      if (mobUnit && deskUnit) {
        mobUnit.innerHTML = deskUnit.innerHTML;
        mobUnit.value = deskUnit.value;
        mobUnit.disabled = deskUnit.disabled;
      }

      // 3. Clona opções e sincroniza valor de Docente/Turma
      if (mobMember && deskMember) {
        mobMember.innerHTML = deskMember.innerHTML;
        mobMember.value = deskMember.value;
        const currentMember = mobMember.value;
        if (mobClearBtn) {
          mobClearBtn.style.display = (currentMember && currentMember !== 'ALL') ? 'inline' : 'none';
        }
      }
      if (mobMemberLabel && deskMember) {
        const targetType = (deskTarget && deskTarget.value) || 'professora';
        mobMemberLabel.innerText = targetType === 'coordenador' ? 'Coordenador(a)' : 'Professora / Docente';
      }

      // 4. Sincroniza valor de Bimestre
      if (mobBim && deskBim) {
        mobBim.value = deskBim.value || 'ALL';
      }

      modal.classList.add('active');
    }

    function closeMobileIndicatorsFiltersModal(e) {
      if (e && e.target && e.target.id !== 'modalIndicatorsFiltersMobile') return;
      const modal = document.getElementById('modalIndicatorsFiltersMobile');
      if (modal) modal.classList.remove('active');
    }

    function syncMobileToDesktopFilters(field) {
      const deskTarget = document.getElementById('indicatorsTargetTypeFilter');
      const deskUnit = document.getElementById('indicatorsUnitFilter');
      const deskMember = document.getElementById('indicatorsMemberFilter');
      const deskBim = document.getElementById('indicatorsBimesterFilter');

      const mobTarget = document.getElementById('mobileIndTargetTypeFilter');
      const mobUnit = document.getElementById('mobileIndUnitFilter');
      const mobMember = document.getElementById('mobileIndMemberFilter');
      const mobBim = document.getElementById('mobileIndBimesterFilter');
      const mobClearBtn = document.getElementById('btnMobileIndClearMember');

      if (field === 'targetType' && deskTarget && mobTarget) {
        deskTarget.value = mobTarget.value;
        onIndicatorsTargetTypeChange();
        // Repopula o seletor móvel de membros
        if (deskMember && mobMember) {
          mobMember.innerHTML = deskMember.innerHTML;
          mobMember.value = deskMember.value;
        }
      } else if (field === 'unit' && deskUnit && mobUnit) {
        deskUnit.value = mobUnit.value;
        onIndicatorsUnitChange();
        // Repopula o seletor móvel de membros após mudança de unidade
        if (deskMember && mobMember) {
          mobMember.innerHTML = deskMember.innerHTML;
          mobMember.value = deskMember.value;
        }
      } else if (field === 'member' && deskMember && mobMember) {
        deskMember.value = mobMember.value;
        if (mobClearBtn) {
          mobClearBtn.style.display = (mobMember.value !== 'ALL') ? 'inline' : 'none';
        }
      } else if (field === 'bimester' && deskBim && mobBim) {
        deskBim.value = mobBim.value;
      }
    }

    function clearMobileIndicatorsMemberFilter() {
      const mobMember = document.getElementById('mobileIndMemberFilter');
      const deskMember = document.getElementById('indicatorsMemberFilter');
      if (mobMember) mobMember.value = 'ALL';
      if (deskMember) deskMember.value = 'ALL';
      const mobClearBtn = document.getElementById('btnMobileIndClearMember');
      if (mobClearBtn) mobClearBtn.style.display = 'none';
    }

    function resetMobileIndicatorsFilters() {
      const user = getCurrentUser();
      const deskTarget = document.getElementById('indicatorsTargetTypeFilter');
      const deskUnit = document.getElementById('indicatorsUnitFilter');
      const deskMember = document.getElementById('indicatorsMemberFilter');
      const deskBim = document.getElementById('indicatorsBimesterFilter');

      if (deskTarget) deskTarget.value = 'professora';
      if (deskUnit) deskUnit.value = (user.roleKey === 'coordenador' && user.school) ? user.school : 'ALL';
      if (deskMember) deskMember.value = 'ALL';
      if (deskBim) deskBim.value = 'ALL';

      // Re-executa os handlers para repopular dependências
      if (typeof onIndicatorsUnitChange === 'function') onIndicatorsUnitChange();
      else renderIndicatorsScreen();

      // Atualiza os seletores móveis espelhados
      openMobileIndicatorsFiltersModal();
      showToast('Filtros restaurados para o padrão.');
    }

    function applyAndCloseMobileIndicatorsFilters() {
      const mobTarget = document.getElementById('mobileIndTargetTypeFilter');
      const mobUnit = document.getElementById('mobileIndUnitFilter');
      const mobMember = document.getElementById('mobileIndMemberFilter');
      const mobBim = document.getElementById('mobileIndBimesterFilter');

      const deskTarget = document.getElementById('indicatorsTargetTypeFilter');
      const deskUnit = document.getElementById('indicatorsUnitFilter');
      const deskMember = document.getElementById('indicatorsMemberFilter');
      const deskBim = document.getElementById('indicatorsBimesterFilter');

      if (deskTarget && mobTarget && mobTarget.value) deskTarget.value = mobTarget.value;
      if (deskUnit && mobUnit && mobUnit.value) deskUnit.value = mobUnit.value;
      if (deskMember && mobMember && mobMember.value) deskMember.value = mobMember.value;
      if (deskBim && mobBim && mobBim.value) deskBim.value = mobBim.value;

      renderIndicatorsScreen();

      const modal = document.getElementById('modalIndicatorsFiltersMobile');
      if (modal) modal.classList.remove('active');

      showToast('Filtros aplicados com sucesso!');
    }

    function updateMobileIndicatorsActiveBadge() {
      const badgeEl = document.getElementById('mobileIndFiltersActiveBadge');
      if (!badgeEl) return;

      const user = getCurrentUser();
      const unitSelect = document.getElementById('indicatorsUnitFilter');
      const memberSelect = document.getElementById('indicatorsMemberFilter');
      const bimesterSelect = document.getElementById('indicatorsBimesterFilter');

      const activeUnit = (unitSelect && unitSelect.value) ? unitSelect.value : (user.school || 'Todas UEs');
      const activeMember = (memberSelect && memberSelect.value) ? memberSelect.value : 'ALL';
      const activeBim = (bimesterSelect && bimesterSelect.value) ? bimesterSelect.value : 'ALL';

      let unitLabel = activeUnit === 'ALL' ? 'Todas UEs' : activeUnit.replace(/^(CEI|EMEI|CMEI)\s+/i, '');
      let memberLabel = activeMember === 'ALL' ? 'Visão Geral' : activeMember.split(' ')[0];
      let bimLabel = activeBim === 'ALL' ? 'Ano Todo' : activeBim.replace('º Bimestre', 'º Bim');

      badgeEl.innerText = `📍 ${unitLabel} · ${memberLabel} · ${bimLabel}`;
      badgeEl.title = `Unidade: ${activeUnit} | Avaliando: ${activeMember} | Período: ${activeBim}`;

      const triggerBtn = document.getElementById('btnMobileIndicatorsFilters');
      if (triggerBtn) {
        triggerBtn.title = `Filtrar Indicadores (${unitLabel} · ${memberLabel} · ${bimLabel})`;
      }

      const dotEl = document.getElementById('mobileIndFilterDot');
      if (dotEl) {
        const isFiltered = (activeUnit !== 'ALL' && activeUnit !== (user.school || '')) || activeMember !== 'ALL' || activeBim !== 'ALL';
        dotEl.style.display = isFiltered ? 'block' : 'none';
      }
    }

    // =========================================================================
    // PILAR 10: MOTOR ALGORÍTMICO DO QUADRO DE CONTROLE BIMESTRAL (SEMÁFORO)
    // =========================================================================

    /**
     * Calcula o status semafórico determinístico de uma Turma em um determinado Bimestre
     * @param {string} className - Nome da Turma (ex: 'Infantil I - Turma A')
     * @param {string} schoolName - Nome da Unidade Escolar
     * @param {string} bimesterName - Nome do Bimestre (ex: '1º Bimestre')
     * @param {Date|string} referenceDate - Data de referência do calendário
     * @returns {Object} { status, colorKey, label, subLabel, score, date, obsId, hasSchedule, scheduleDate, isDraft, bimesterNum, currentBimNum }
     */
    function calculateClassBimesterStatus(className, schoolName, bimesterName, referenceDate = new Date(), targetYear = null) {
      if (!className) return { status: 'future', colorKey: 'gray', label: '—' };
      const activeYear = targetYear || (appState && appState.selectedAcademicYear) || '2026';
      
      const cleanClass = (className || '').trim().toLowerCase();
      const cleanSchool = (schoolName || '').trim().toLowerCase();
      
      const bimMatch = (bimesterName || '').match(/([1-4])/);
      const bimesterNum = bimMatch ? parseInt(bimMatch[1], 10) : 1;
      
      const currentBimStr = getCurrentSchoolBimester(referenceDate, activeYear);
      const currentBimMatch = currentBimStr.match(/([1-4])/);
      const currentBimNum = currentBimMatch ? parseInt(currentBimMatch[1], 10) : 1;

      // 1. Busca observação finalizada para a TURMA neste bimestre e ano letivo
      const finalizedObs = (appState.observations || []).find(o => {
        if ((o.academicYear || '2026') !== activeYear) return false;
        if (o.status !== 'finalized' && o.status !== 'concluida') return false;
        if (!o.className) return false;
        const oCls = o.className.trim().toLowerCase();
        // Casamento preciso de turmas com proteção estrita de numerais romanos (evita falso positivo Infantil I vs Infantil II)
        let matchesClass = (cleanClass === oCls);
        if (!matchesClass) {
          const t1 = new Set(cleanClass.match(/[a-z0-9]+/g) || []);
          const t2 = new Set(oCls.match(/[a-z0-9]+/g) || []);
          const romans = ['i', 'ii', 'iii', 'iv', 'v'];
          const r1 = romans.filter(r => t1.has(r));
          const r2 = romans.filter(r => t2.has(r));
          const romanConflict = (r1.length > 0 && r2.length > 0 && r1[0] !== r2[0]);
          if (!romanConflict) {
            const isSub1 = [...t2].every(x => t1.has(x));
            const isSub2 = [...t1].every(x => t2.has(x));
            matchesClass = isSub1 || isSub2;
          }
        }
        if (!matchesClass) return false;
        if (cleanSchool && o.schoolName && o.schoolName.trim().toLowerCase() !== cleanSchool) return false;
        const oBimMatch = (o.bimester || '').match(/([1-4])/);
        return oBimMatch && parseInt(oBimMatch[1], 10) === bimesterNum;
      });

      if (finalizedObs) {
        // Calcula consistência da observação
        let pts = 0;
        let valid = 0;
        const resp = finalizedObs.responses || {};
        Object.keys(resp).forEach(k => {
          const r = resp[k];
          if (r && r !== 'na') {
            valid++;
            if (r === 'consistent') pts += 1.0;
            else if (r === 'partial') pts += 0.5;
          }
        });
        const score = valid > 0 ? Math.round((pts / valid) * 100) : 100;
        const dateFormatted = finalizedObs.date ? finalizedObs.date.split('-').reverse().slice(0, 2).join('/') : '';

        return {
          status: 'completed',
          colorKey: 'green',
          label: `Concluída (${score}%)`,
          subLabel: dateFormatted ? `Realizada em ${dateFormatted}` : 'Observação Finalizada',
          score: score,
          date: finalizedObs.date,
          obsId: finalizedObs.id,
          hasSchedule: false,
          scheduleDate: null,
          isDraft: false,
          bimesterNum,
          currentBimNum
        };
      }

      // 2. Busca se há observação em Rascunho (draft)
      const draftObs = (appState.observations || []).find(o => {
        if ((o.academicYear || '2026') !== activeYear) return false;
        if (o.status !== 'draft') return false;
        if (!o.className) return false;
        const oCls = o.className.trim().toLowerCase();
        // Casamento preciso de turmas evitando colisao de numerais romanos (ex: infantil i vs infantil ii)
        const normalizeClass = s => s.replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
        const normClean = normalizeClass(cleanClass);
        const normObs = normalizeClass(oCls);
        const matchesClass = normClean === normObs || 
          (normClean.length > 5 && normObs.length > 5 && (new RegExp('\\b' + normClean + '\\b').test(normObs) || new RegExp('\\b' + normObs + '\\b').test(normClean)));
        if (!matchesClass) return false;
        if (cleanSchool && o.schoolName && o.schoolName.trim().toLowerCase() !== cleanSchool) return false;
        const oBimMatch = (o.bimester || '').match(/([1-4])/);
        return oBimMatch && parseInt(oBimMatch[1], 10) === bimesterNum;
      });

      // 3. Busca se há agendamento planejado no cronograma
      const sched = (appState.schedules || []).find(s => {
        if ((s.academicYear || '2026') !== activeYear) return false;
        if (s.archived || s.status === 'realizado') return false;
        const sTarget = (s.className || s.targetName || '').trim().toLowerCase();
        if (!sTarget) return false;
        const matchesClass = sTarget === cleanClass || cleanClass.includes(sTarget) || sTarget.includes(cleanClass);
        if (!matchesClass) return false;
        if (cleanSchool && s.schoolName && s.schoolName.trim().toLowerCase() !== cleanSchool) return false;
        const sBimMatch = (s.bimester || '').match(/([1-4])/);
        return sBimMatch && parseInt(sBimMatch[1], 10) === bimesterNum;
      });

      const schedDateFormatted = (sched && (sched.date || sched.plannedDate)) ? (sched.date || sched.plannedDate).split('-').reverse().slice(0, 2).join('/') : '';

      // 4. Se o bimestre já passou no calendário letivo (bimesterNum < currentBimNum) ➔ 🔴 VERMELHO (ATRASADO)
      if (bimesterNum < currentBimNum) {
        const bimPeriod = ((appState && appState.bimesterPeriods) ? appState.bimesterPeriods : DEFAULT_BIMESTER_PERIODS)[bimesterName];
        const deadlineStr = bimPeriod && bimPeriod.endDate ? bimPeriod.endDate.split('-').reverse().slice(0, 2).join('/') : '';
        let sub = deadlineStr ? `Prazo expirado em ${deadlineStr}` : 'Prazo expirado sem observação';
        if (draftObs) sub = 'Rascunho não finalizado (Expirado)';
        else if (sched) sub = `Agendamento pendente (${schedDateFormatted})`;

        return {
          status: 'overdue',
          colorKey: 'red',
          label: draftObs ? 'Rascunho Atrasado' : sched ? 'Agend. Atrasada' : 'Atrasado',
          subLabel: sub,
          score: null,
          date: null,
          obsId: draftObs ? draftObs.id : null,
          hasSchedule: !!sched,
          scheduleDate: sched ? (sched.date || sched.plannedDate) : null,
          isDraft: !!draftObs,
          bimesterNum,
          currentBimNum
        };
      }

      // 5. Se o bimestre é o atual (bimesterNum === currentBimNum) ➔ ⚪ CINZA / AZUL (NO PRAZO)
      if (bimesterNum === currentBimNum) {
        const bimPeriod = ((appState && appState.bimesterPeriods) ? appState.bimesterPeriods : DEFAULT_BIMESTER_PERIODS)[bimesterName];
        const deadlineStr = bimPeriod && bimPeriod.endDate ? bimPeriod.endDate.split('-').reverse().slice(0, 2).join('/') : '';
        let sub = deadlineStr ? `Prazo vigente até ${deadlineStr}` : 'Período letivo em aberto';
        if (draftObs) sub = 'Rascunho iniciado em andamento';
        else if (sched) sub = `Agendada para ${schedDateFormatted}`;

        return {
          status: 'in_progress',
          colorKey: 'gray',
          label: draftObs ? 'Rascunho' : sched ? `Agendada (${schedDateFormatted})` : 'No Prazo',
          subLabel: sub,
          score: null,
          date: null,
          obsId: draftObs ? draftObs.id : null,
          hasSchedule: !!sched,
          scheduleDate: sched ? (sched.date || sched.plannedDate) : null,
          isDraft: !!draftObs,
          bimesterNum,
          currentBimNum
        };
      }

      // 6. Se o bimestre é futuro (bimesterNum > currentBimNum) ➔ ⚪ CINZA NEUTRO (CICLO FUTURO)
      return {
        status: 'future',
        colorKey: 'gray',
        label: sched ? `Agendada (${schedDateFormatted})` : 'Ciclo Futuro',
        subLabel: sched ? `Planejada antecipadamente` : 'Aguardando período letivo',
        score: null,
        date: null,
        obsId: null,
        hasSchedule: !!sched,
        scheduleDate: sched ? (sched.date || sched.plannedDate) : null,
        isDraft: false,
        bimesterNum,
        currentBimNum
      };
    }

    /**
     * Alternador de Visão no Acompanhamento Longitudinal: Turmas vs Docentes
     */
    function toggleLongitudinalViewMode(mode) {
      appState.longitudinalViewMode = mode; // 'classes' ou 'teachers'
      renderIndicatorsScreen();
    }

    /**
     * Filtro rápido de status no Semáforo de Turmas (Pilar 10)
     */
    function filterSemaphoreByStatus(statusKey) {
      appState.activeSemaphoreStatusFilter = statusKey; // 'all', 'overdue', 'in_progress', 'completed_cur', 'completed_all'
      appState.longitudinalViewMode = 'classes'; // Garante determinismo na exibição do semáforo de turmas
      renderIndicatorsScreen();
    }

    /**
     * Rola suavemente até o Quadro de Controle Bimestral (Semáforo)
     */
    function scrollToBimesterSemaphore() {
      switchIndicatorsSubTab('longitudinal');
      setTimeout(() => {
        const el = document.getElementById('bimesterSemaphoreSection');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }

    /**
     * Atalho rápido: Abre o modal de agendamento pré-configurado para a Turma e Bimestre
     */
    function quickScheduleForClass(className, schoolName, bimesterName) {
      openAddScheduleModal();
      const schoolSelect = document.getElementById('scheduleSchool');
      if (schoolSelect && schoolName) {
        schoolSelect.value = schoolName;
        onScheduleSchoolChange();
      }
      const classSelect = document.getElementById('scheduleTarget') || document.getElementById('scheduleTargetClass');
      if (classSelect && className) {
        classSelect.value = className;
        if (typeof onScheduleTargetChange === 'function') onScheduleTargetChange();
        else if (typeof onScheduleClassChange === 'function') onScheduleClassChange();
      }
      const bimSelect = document.getElementById('scheduleBimester');
      if (bimSelect && bimesterName) {
        bimSelect.value = bimesterName;
      }
    }

    /**
     * Atalho rápido: Inicia diretamente a observação no Setup para a Turma e Bimestre
     */
    function quickStartObservationForClass(className, schoolName, bimesterName) {
      navigateToTab('setup');
      const schoolSelect = document.getElementById('setupSchool');
      if (schoolSelect && schoolName) {
        schoolSelect.value = schoolName;
        onSetupSchoolChange();
      }
      const classSelect = document.getElementById('setupClass') || document.getElementById('setupTargetClass');
      if (classSelect && className) {
        classSelect.value = className;
        if (typeof onSetupClassChange === 'function') onSetupClassChange();
      }
      const bimSelect = document.getElementById('setupBimester');
      if (bimSelect && bimesterName) {
        bimSelect.value = bimesterName;
        if (typeof updateSetupBimesterValidationUI === 'function') updateSetupBimesterValidationUI();
      }
    }

    /**
     * Atalho rápido ao tocar em uma célula do Semáforo
     */
    function handleSemaphoreCellClick(className, schoolName, bimesterName, statusObj) {
      if (statusObj.status === 'completed' && statusObj.obsId) {
        openReadOnlyObsModal(statusObj.obsId, 'indicators');
      } else if (statusObj.isDraft && statusObj.obsId) {
        resumeObservation(statusObj.obsId);
      } else if (statusObj.status === 'overdue' || statusObj.status === 'in_progress') {
        quickScheduleForClass(className, schoolName, bimesterName);
      }
    }

    /**
     * PILAR 10: Calcula o status semafórico temporal de um DOCENTE REGENTE no ciclo bimestral.
     * Considera observações diretas do professor, observações da turma onde atua e agendamentos no cronograma.
     * Retorna objeto canônico: { status, colorKey, label, score, obsId, obsDate, className, scheduleId, bimesterNum, currentBimNum }
     */
    function calculateTeacherBimesterStatus(teacherName, schoolName, bimesterName, referenceDate = new Date(), targetYear = null) {
      if (!teacherName) return { status: 'future', colorKey: 'gray', label: '—', score: null };
      const activeYear = targetYear || (appState && appState.selectedAcademicYear) || '2026';

      const cleanTeacher = (teacherName || '').trim().toLowerCase();
      const cleanSchool = (schoolName || '').trim().toLowerCase();

      const bimMatch = (bimesterName || '').match(/([1-4])/);
      const bimesterNum = bimMatch ? parseInt(bimMatch[1], 10) : 1;

      const currentBimStr = getCurrentSchoolBimester(referenceDate, activeYear);
      const currentBimMatch = currentBimStr.match(/([1-4])/);
      const currentBimNum = currentBimMatch ? parseInt(currentBimMatch[1], 10) : 1;

      // Localiza o membro na equipe para obter turma vinculada
      const member = (appState.teamMembers || []).find(m => (m.name || '').trim().toLowerCase() === cleanTeacher);
      const assignedClassClean = (member?.classAssigned || '').trim().toLowerCase();

      // Localiza as turmas que possuem este docente no catálogo canônico do ano
      const teacherClassNames = (appState.classes || []).filter(c => {
        if ((c.academicYear || '2026') !== activeYear) return false;
        if (cleanSchool && c.school && c.school.trim().toLowerCase() !== cleanSchool) return false;
        return Array.isArray(c.teachers) && c.teachers.some(t => (t || '').trim().toLowerCase() === cleanTeacher);
      }).map(c => (c.name || '').trim().toLowerCase());

      if (assignedClassClean && !teacherClassNames.includes(assignedClassClean)) {
        teacherClassNames.push(assignedClassClean);
      }

      const defaultClassName = member?.classAssigned || (teacherClassNames.length > 0 ? teacherClassNames[0] : 'Educação Infantil');

      // 1. Busca observação finalizada correspondente ao docente neste bimestre e ano
      const finalizedObs = (appState.observations || []).find(o => {
        if ((o.academicYear || '2026') !== activeYear) return false;
        if (o.status !== 'finalized' && o.status !== 'concluida') return false;
        if (cleanSchool && o.schoolName && o.schoolName.trim().toLowerCase() !== cleanSchool) return false;

        const oBimMatch = (o.bimester || '').match(/([1-4])/);
        if (!oBimMatch || parseInt(oBimMatch[1], 10) !== bimesterNum) return false;

        // Correspondência nominal direta
        if (o.teacherName && o.teacherName.trim().toLowerCase().includes(cleanTeacher)) return true;
        if (Array.isArray(o.teachers) && o.teachers.some(t => (t || '').trim().toLowerCase() === cleanTeacher)) return true;
        if (o.teacherSynthesis && Object.keys(o.teacherSynthesis).some(k => (k || '').trim().toLowerCase() === cleanTeacher)) return true;

        // Correspondência através da turma vinculada ao docente
        if (o.className) {
          const oClsClean = o.className.trim().toLowerCase();
          if (teacherClassNames.some(tCls => tCls === oClsClean || tCls.includes(oClsClean) || oClsClean.includes(tCls))) {
            return true;
          }
        }
        return false;
      });

      if (finalizedObs) {
        let pts = 0;
        let valid = 0;
        const resp = finalizedObs.responses || {};
        Object.keys(resp).forEach(k => {
          const r = resp[k];
          if (r && r !== 'na') {
            valid++;
            if (r === 'consistent') pts += 1.0;
            else if (r === 'partial') pts += 0.5;
          }
        });
        const score = valid > 0 ? Math.round((pts / valid) * 100) : 100;
        const dateStr = formatDateBR(finalizedObs.date || finalizedObs.startDate || '');
        return {
          status: 'completed',
          colorKey: 'green',
          label: dateStr ? `Concluída (${dateStr})` : 'Concluída',
          score: score,
          obsId: finalizedObs.id,
          obsDate: finalizedObs.date,
          className: finalizedObs.className || defaultClassName,
          bimesterNum,
          currentBimNum
        };
      }

      // 2. Busca rascunho em andamento
      const draftObs = (appState.observations || []).find(o => {
        if ((o.academicYear || '2026') !== activeYear) return false;
        if (o.status !== 'draft') return false;
        if (cleanSchool && o.schoolName && o.schoolName.trim().toLowerCase() !== cleanSchool) return false;
        const oBimMatch = (o.bimester || '').match(/([1-4])/);
        if (!oBimMatch || parseInt(oBimMatch[1], 10) !== bimesterNum) return false;

        if (o.teacherName && o.teacherName.trim().toLowerCase().includes(cleanTeacher)) return true;
        if (Array.isArray(o.teachers) && o.teachers.some(t => (t || '').trim().toLowerCase() === cleanTeacher)) return true;
        if (o.className) {
          const oClsClean = o.className.trim().toLowerCase();
          return teacherClassNames.some(tCls => tCls === oClsClean || tCls.includes(oClsClean) || oClsClean.includes(tCls));
        }
        return false;
      });

      if (draftObs) {
        return {
          status: 'in_progress',
          colorKey: 'blue',
          label: 'Rascunho Aberto',
          score: null,
          obsId: draftObs.id,
          className: draftObs.className || defaultClassName,
          isDraft: true,
          bimesterNum,
          currentBimNum
        };
      }

      // 3. Busca agendamento previsto no cronograma
      const sched = (appState.schedules || []).find(s => {
        if ((s.academicYear || '2026') !== activeYear) return false;
        if (s.status === 'cancelado' || s.status === 'realizado') return false;
        if (cleanSchool && s.schoolName && s.schoolName.trim().toLowerCase() !== cleanSchool) return false;
        const sBimMatch = (s.bimester || '').match(/([1-4])/);
        if (!sBimMatch || parseInt(sBimMatch[1], 10) !== bimesterNum) return false;

        if (s.targetName && s.targetName.trim().toLowerCase().includes(cleanTeacher)) return true;
        if (Array.isArray(s.teachers) && s.teachers.some(t => (t || '').trim().toLowerCase() === cleanTeacher)) return true;
        if (s.className) {
          const sClsClean = s.className.trim().toLowerCase();
          return teacherClassNames.some(tCls => tCls === sClsClean || tCls.includes(sClsClean) || sClsClean.includes(tCls));
        }
        return false;
      });

      // 4. Regra temporal do Semáforo contra o bimestre letivo de referência
      if (bimesterNum < currentBimNum) {
        const schedDate = formatDateBR(sched ? (sched.date || sched.plannedDate || '') : '');
        return {
          status: 'overdue',
          colorKey: 'red',
          label: draftObs ? 'Rascunho Atrasado' : sched ? 'Agend. Atrasada' : 'Atrasada (Expirado)',
          score: null,
          obsId: draftObs ? draftObs.id : null,
          scheduleId: sched ? sched.id : null,
          scheduleDate: sched ? (sched.date || sched.plannedDate) : null,
          className: defaultClassName,
          bimesterNum,
          currentBimNum
        };
      }

      if (sched) {
        const schedDate = formatDateBR(sched.date || sched.plannedDate || '');
        return {
          status: 'in_progress',
          colorKey: 'blue',
          label: schedDate ? `Agendada (${schedDate})` : 'Agendada',
          score: null,
          scheduleId: sched.id,
          scheduleDate: sched.date || sched.plannedDate,
          className: sched.className || defaultClassName,
          isDraft: false,
          bimesterNum,
          currentBimNum
        };
      }

      if (bimesterNum === currentBimNum) {
        return {
          status: 'in_progress',
          colorKey: 'blue',
          label: 'No Prazo (Pendente)',
          score: null,
          className: defaultClassName,
          bimesterNum,
          currentBimNum
        };
      }

      return {
        status: 'future',
        colorKey: 'gray',
        label: 'Ciclo Futuro',
        score: null,
        className: defaultClassName,
        bimesterNum,
        currentBimNum
      };
    }

    /**
     * Determina o próximo bimestre elegível para agendamento rápido de um docente
     */
    function getNextEligibleBimesterForTeacher(teacherName, schoolName) {
      const BIMESTERS_CANONICAL = ['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre'];
      for (const bName of BIMESTERS_CANONICAL) {
        const st = calculateTeacherBimesterStatus(teacherName, schoolName, bName);
        if (st.status === 'overdue' || (st.status === 'in_progress' && !st.obsId && !st.scheduleId)) {
          return bName;
        }
      }
      return getCurrentSchoolBimester();
    }

    /**
     * Interação com a célula semafórica do Docente Regente (Pilar 10)
     */
    function handleTeacherSemaphoreCellClick(teacherName, schoolName, bimesterName, statusObj) {
      if (!statusObj) return;

      const member = (appState.teamMembers || []).find(m => m.name === teacherName);
      const targetClass = statusObj.className || member?.classAssigned || 'Infantil I - Turma A';

      if (statusObj.status === 'completed' && statusObj.obsId) {
        // Redireciona para o Histórico focando na observação finalizada
        appState.activeTabIndex = 3;
        appState.historyFilter = 'finalized';
        renderHistoryScreen();
        switchTab(3);
        setTimeout(() => {
          const card = document.getElementById(`obs-card-${statusObj.obsId}`);
          if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            card.style.outline = '3px solid var(--primary)';
            setTimeout(() => { card.style.outline = ''; }, 3000);
          }
        }, 150);
      } else if (statusObj.status === 'in_progress' && statusObj.obsId && statusObj.isDraft) {
        resumeObservation(statusObj.obsId, false);
      } else if (statusObj.status === 'overdue' || statusObj.status === 'in_progress') {
        quickScheduleForClass(targetClass, schoolName, bimesterName);
      }
    }

    /**
     * Alternador de filtro rápido no Semáforo de Docentes (Pilar 10)
     */
    function filterTeacherSemaphoreByStatus(statusKey) {
      appState.activeSemaphoreTeacherStatusFilter = statusKey; // 'all', 'overdue', 'in_progress', 'completed_cur', 'completed_all'
      appState.longitudinalViewMode = 'teachers'; // Garante determinismo na exibição do semáforo de docentes
      renderIndicatorsScreen();
    }

    function renderIndicatorsScreen() {
      const container = document.getElementById('indicatorsBodyContainer');
      if (!container) return;

      const user = getCurrentUser();
      const targetTypeSelect = document.getElementById('indicatorsTargetTypeFilter');
      const targetTypeBadge = document.getElementById('indicatorsTargetTypeBadge');
      const unitSelect = document.getElementById('indicatorsUnitFilter');
      const memberSelect = document.getElementById('indicatorsMemberFilter');

      const targetTypeWrapper = document.getElementById('indicatorsTargetTypeWrapper');

      // Blindagem estrita por perfil: Coordenadores e Docentes visualizam diretamente indicadores docentes (bloco de seletor oculto)
      let targetType = 'professora';
      if (user.roleKey === 'coordenador' || user.roleKey === 'professora') {
        targetType = 'professora';
        if (targetTypeWrapper) targetTypeWrapper.style.display = 'none';
        if (targetTypeSelect) {
          targetTypeSelect.value = 'professora';
          targetTypeSelect.style.display = 'none';
        }
        if (targetTypeBadge) {
          targetTypeBadge.style.display = 'none';
        }
      } else {
        if (targetTypeWrapper) targetTypeWrapper.style.display = 'flex';
        if (targetTypeSelect) {
          targetTypeSelect.style.display = 'inline-block';
          if (!targetTypeSelect.value) {
            targetTypeSelect.value = 'professora';
          }
          targetType = targetTypeSelect.value || 'professora';
        }
        if (targetTypeBadge) {
          targetTypeBadge.style.display = 'none';
        }
      }

      // 1. Popula ou sincroniza opções do Seletor de Unidades Escolares
      if (unitSelect) {
        const currentSelectedUnit = unitSelect.value || 'ALL';
        let availableUnits = [];

        if (isNucleoEI(user)) {
          availableUnits = (appState.units || []).map(u => u.name);
        } else if (user.roleKey === 'formador') {
          const userPolo = (user.school || '').trim().toLowerCase();
          const poloUnits = (appState.units || []).filter(u => {
            if (!u.polo) return false;
            const up = u.polo.trim().toLowerCase();
            return up === userPolo || up.includes(userPolo) || userPolo.includes(up);
          }).map(u => u.name);
          const supervisedCoords = (appState.teamMembers || []).filter(m => 
            m.roleKey === 'coordenador' && (m.supervisor === user.name || (m.school && poloUnits.includes(m.school)))
          );
          const formadorUnits = Array.from(new Set([...poloUnits, ...supervisedCoords.map(c => c.school)])).filter(Boolean);
          availableUnits = formadorUnits.length > 0 ? formadorUnits : (appState.units || []).map(u => u.name);
        } else if (user.roleKey === 'coordenador') {
          availableUnits = user.school ? [user.school] : [];
        }

        let unitOptionsHtml = '';
        if (user.roleKey !== 'coordenador') {
          unitOptionsHtml += `<option value="ALL">Todas as Unidades do Escopo (${availableUnits.length})</option>`;
        }

        // Agrupamento semântico por Polo para o Núcleo de Educação Infantil
        if (isNucleoEI(user)) {
          const unitsByPolo = {};
          (appState.units || []).forEach(u => {
            const pName = u.polo || 'Sem Polo Definido';
            if (!unitsByPolo[pName]) unitsByPolo[pName] = [];
            unitsByPolo[pName].push(u.name);
          });

          const sortedPolos = Object.keys(unitsByPolo).sort();
          sortedPolos.forEach(pName => {
            unitOptionsHtml += `<optgroup label="Polo: ${pName}">`;
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
        if (user.roleKey === 'coordenador') {
          unitSelect.value = user.school || '';
          unitSelect.disabled = true;
        } else {
          unitSelect.disabled = false;
          if (availableUnits.includes(currentSelectedUnit) || currentSelectedUnit === 'ALL') {
            unitSelect.value = currentSelectedUnit;
          } else {
            unitSelect.value = 'ALL';
          }
        }
      }

      const activeUnitFilter = (unitSelect && unitSelect.value) ? unitSelect.value : 'ALL';

      // PILAR 9: Resolução do Filtro de Bimestre de Referência
      const bimesterSelect = document.getElementById('indicatorsBimesterFilter');
      const activeBimesterFilter = (bimesterSelect && bimesterSelect.value) ? bimesterSelect.value : 'ALL';

      // 2. Resolução dos avaliandos e observações com respeito estrito à unidade e ao bimestre selecionados
      let scopedAvaliandos = getScopedAvaliandos(targetType);
      let scopedObs = getScopedObservations().filter(o => {
        if (o.status !== 'finalized' && o.status !== 'concluida') return false;
        if (targetType === 'coordenador') {
          return o.evaluatedType === 'coordenador';
        } else {
          return o.evaluatedType === 'professora' || o.evaluatedType === 'turma';
        }
      });

      if (activeUnitFilter !== 'ALL') {
        scopedAvaliandos = scopedAvaliandos.filter(m => m.school === activeUnitFilter);
        scopedObs = scopedObs.filter(o => o.schoolName === activeUnitFilter);
      }

      // Filtragem por Bimestre no escopo da UE/Polo
      if (activeBimesterFilter !== 'ALL') {
        scopedObs = scopedObs.filter(o => o.bimester === activeBimesterFilter);
      }

      // 3. Popula ou sincroniza opções do Seletor de Avaliando Específico
      if (memberSelect) {
        const currentSelectedMember = memberSelect.value || 'ALL';
        const memberRoleName = targetType === 'coordenador' ? 'Coordenadores(as)' : 'Professoras';
        let memberOptionsHtml = `<option value="ALL">${memberRoleName}: Todas (Visão Geral)</option>`;
        
        // Agrupa por unidade escolar se o escopo abranger mais de uma unidade e 'ALL' estiver ativo
        const bySchool = {};
        scopedAvaliandos.forEach(m => {
          const sch = m.school || 'Unidade Geral';
          if (!bySchool[sch]) bySchool[sch] = [];
          bySchool[sch].push(m);
        });

        const schoolList = Object.keys(bySchool).sort();
        if (schoolList.length > 1 && activeUnitFilter === 'ALL') {
          schoolList.forEach(sch => {
            memberOptionsHtml += `<optgroup label="${sch}">`;
            bySchool[sch].sort((a,b) => a.name.localeCompare(b.name)).forEach(m => {
              const roleInfo = m.classAssigned ? ` (${m.classAssigned})` : '';
              memberOptionsHtml += `<option value="${m.name}">${m.name}${roleInfo}</option>`;
            });
            memberOptionsHtml += `</optgroup>`;
          });
        } else {
          scopedAvaliandos.sort((a,b) => a.name.localeCompare(b.name)).forEach(m => {
            const roleInfo = m.classAssigned ? ` · ${m.classAssigned}` : '';
            memberOptionsHtml += `<option value="${m.name}">${m.name}${roleInfo}</option>`;
          });
        }
        memberSelect.innerHTML = memberOptionsHtml;

        const memberExists = scopedAvaliandos.some(m => m.name === currentSelectedMember);
        if (memberExists) {
          memberSelect.value = currentSelectedMember;
        } else {
          memberSelect.value = 'ALL';
        }
      }

      const activeMemberFilter = (memberSelect && memberSelect.value) ? memberSelect.value : 'ALL';

      // Atualiza o rótulo e botão de limpar do seletor
      const memberLabelEl = document.getElementById('indicatorsMemberLabel');
      if (memberLabelEl) {
        memberLabelEl.innerText = targetType === 'coordenador' ? 'Coordenador(a)' : 'Professora / Docente';
      }
      const btnClearMember = document.getElementById('btnIndicatorsClearMember');
      if (btnClearMember) {
        btnClearMember.style.display = (activeMemberFilter !== 'ALL') ? 'inline' : 'none';
        btnClearMember.innerText = targetType === 'coordenador' ? '✕ Ver Todos' : '✕ Ver Todas';
      }

      // Atualiza o botão de exportação do cabeçalho
      const btnExportHeader = document.getElementById('btnExportIndicatorsView');
      if (btnExportHeader) {
        btnExportHeader.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <span>Exportar PDF</span>
        `;
        btnExportHeader.className = 'btn btn-secondary indicators-filter-btn';
        btnExportHeader.title = activeMemberFilter !== 'ALL' ? 'Exportar Ficha Individual em PDF' : 'Exportar Relatório Geral em PDF';
      }

      const activeSections = targetType === 'coordenador' 
        ? (appState.activeSectionsCoordinator || DEFAULT_SECTIONS_COORDINATOR)
        : (appState.activeSectionsTeacher || DEFAULT_SECTIONS_TEACHER);

      const bimesters = ['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre'];

      const currentSubTab = appState.activeIndicatorsSubTab || 'kpis';
      appState.activeIndicatorsSubTab = currentSubTab;

      // Sincroniza rótulos das sub-abas conforme contexto geral vs individual
      const pillKpisLabel = document.getElementById('pillIndKpisLabel');
      const pillDrilldownLabel = document.getElementById('pillIndDrilldownLabel');
      const pillLongitudinalLabel = document.getElementById('pillIndLongitudinalLabel');

      if (activeMemberFilter !== 'ALL') {
        const shortName = activeMemberFilter.split(' ')[0];
        if (pillKpisLabel) pillKpisLabel.innerText = `Dossiê & KPIs (${shortName})`;
        if (pillDrilldownLabel) pillDrilldownLabel.innerText = 'Raio-X Item a Item';
        if (pillLongitudinalLabel) pillLongitudinalLabel.innerText = 'Acompanhamento Geral';
      } else {
        if (pillKpisLabel) pillKpisLabel.innerText = 'Índices Gerais & KPIs';
        if (pillDrilldownLabel) pillDrilldownLabel.innerText = 'Visualização por Dimensão';
        if (pillLongitudinalLabel) pillLongitudinalLabel.innerText = 'Acompanhamento Longitudinal';
      }

      document.querySelectorAll('.indicators-subtab-pill').forEach(btn => btn.classList.remove('active'));
      const activeBtn = document.getElementById(
        currentSubTab === 'kpis' ? 'pillIndKpis' : 
        currentSubTab === 'drilldown' ? 'pillIndDrilldown' : 'pillIndLongitudinal'
      );
      if (activeBtn) activeBtn.classList.add('active');

      // =========================================================================
      // CASO B: PROFESSOR ESPECÍFICO SELECIONADO (VISÃO LONGITUDINAL ITEM A ITEM)
      // =========================================================================
      if (activeMemberFilter !== 'ALL') {
        const selectedMember = scopedAvaliandos.find(m => m.name === activeMemberFilter) || 
                               (appState.teamMembers || []).find(m => m.name === activeMemberFilter);
        
        const memberObs = scopedObs.filter(o => o.teacherName === activeMemberFilter);
        memberObs.sort((a, b) => (a.date || '').localeCompare(b.date || ''));

        const memberSchool = selectedMember?.school || (memberObs[0]?.schoolName) || 'Não informada';
        const memberRole = selectedMember?.roleTitle || (targetType === 'coordenador' ? 'Coordenação Pedagógica' : 'Professor(a) de Educação Infantil');
        const memberClass = selectedMember?.classAssigned || (memberObs[0]?.className) || 'Educação Infantil';
        const memberSupervisor = selectedMember?.supervisor || (memberObs[0]?.evaluatedBy) || user.name;

        // Cálculos bimestrais do profissional
        const bimData = {};
        bimesters.forEach(bim => {
          const obs = memberObs.find(o => o.bimester === bim);
          if (obs) {
            let pts = 0;
            let valid = 0;
            activeSections.forEach(sec => {
              sec.subSections.forEach(sub => {
                sub.criteria.forEach(crit => {
                  const r = obs.responses ? obs.responses[crit.id] : null;
                  if (r && r !== 'na') {
                    valid++;
                    if (r === 'consistent') pts += 1.0;
                    else if (r === 'partial') pts += 0.5;
                  }
                });
              });
            });
            const pct = valid > 0 ? Math.round((pts / valid) * 100) : 0;
            bimData[bim] = {
              pct: pct,
              date: obs.date,
              materialDim: obs.synthesisMaterialDimension || null,
              materialText: obs.synthesisPredominant || 'Não informado',
              obsId: obs.id
            };
          }
        });

        // Balanço geral de critérios
        let countUp = 0;
        let countStable = 0;
        let countAlert = 0;
        let countTotalCriteria = 0;

        activeSections.forEach(sec => {
          sec.subSections.forEach(sub => {
            sub.criteria.forEach(crit => {
              countTotalCriteria++;
              const responsesByBim = {};
              bimesters.forEach(bim => {
                const obs = memberObs.find(o => o.bimester === bim);
                if (obs && obs.responses && obs.responses[crit.id]) {
                  responsesByBim[bim] = obs.responses[crit.id];
                }
              });
              const trend = calculateCriterionTrend(responsesByBim);
              if (trend.cssClass === 'badge-trend-up') countUp++;
              else if (trend.cssClass === 'badge-trend-stable') countStable++;
              else if (trend.cssClass === 'badge-trend-alert' || trend.cssClass === 'badge-trend-down') countAlert++;
            });
          });
        });

        // Dados da Escala de Materiais do Docente
        const lastObs = memberObs.length > 0 ? memberObs[memberObs.length - 1] : null;
        const matLevel = (lastObs && lastObs.synthesisMaterialDimension) ? Number(lastObs.synthesisMaterialDimension) : null;
        
        let matColor = 'var(--text-secondary)';
        let matBg = '#F8FAFC';
        let matBorder = '#E2E8F0';
        let matTag = 'Sem registro';
        
        if (matLevel === 4) {
          matColor = 'var(--green)';
          matBg = '#F0FDF4';
          matBorder = '#BBF7D0';
          matTag = 'Uso Rico e Autônomo';
        } else if (matLevel === 3) {
          matColor = '#0284C7';
          matBg = '#F0F9FF';
          matBorder = '#BAE6FD';
          matTag = 'Materiais Diversificados';
        } else if (matLevel === 2) {
          matColor = 'var(--yellow)';
          matBg = '#FFFBEB';
          matBorder = '#FDE68A';
          matTag = 'Folhas Estruturadas';
        } else if (matLevel === 1) {
          matColor = 'var(--red)';
          matBg = '#FEF2F2';
          matBorder = '#FECACA';
          matTag = 'Folhas Pré-prontas';
        }

        const levelObj = (typeof SYNTHESIS_LEVELS !== 'undefined') ? SYNTHESIS_LEVELS.find(l => l.level === matLevel) : null;
        const matText = (lastObs && lastObs.synthesisPredominant) 
          ? lastObs.synthesisPredominant 
          : (levelObj ? levelObj.title.replace(/^Nível \d+:\s*/i, '') : 'Nenhum registro de uso de materiais');
        const matFullDesc = levelObj ? `${levelObj.title}: ${levelObj.desc}` : matText;

        let indHtml = `
          <div id="indicatorsSectionKPIs" style="display:${currentSubTab === 'kpis' ? 'block' : 'none'};">
            <!-- Barra de Contexto do Dossiê Individual -->
            <div class="individual-context-banner">
              <div style="display:flex; align-items:center; gap:8px;">
                <svg class="btn-icon" style="color:#1E3A8A;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span style="font-size:13px; font-weight:700; color:#1E3A8A;">
                  Análise Individual do Profissional: <strong>${activeMemberFilter}</strong> (${memberSchool})
                </span>
              </div>
              <button type="button" class="btn btn-secondary" onclick="clearTeacherLongitudinalFilter()" style="font-size:11px; padding:4px 10px; font-weight:700; background:#FFFFFF;">
                ✕ Voltar para Visão Geral
              </button>
            </div>

            <!-- Dossiê do Profissional -->
          <div class="card" style="margin-top:4px; margin-bottom:20px; border-left:5px solid var(--primary); background:#FFFFFF; padding:16px 20px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:11px; font-weight:800; text-transform:uppercase; color:var(--primary); background:#EFF6FF; padding:3px 8px; border-radius:12px;">
                Dossiê Longitudinal
              </span>
              <span style="font-size:12px; color:var(--text-secondary);">● ${targetType === 'coordenador' ? 'Coordenação Pedagógica' : 'Docência'}</span>
            </div>
            <h2 style="font-size:22px; font-weight:800; color:var(--text-primary); margin:6px 0 4px 0;">
              ${activeMemberFilter}
            </h2>
            <div style="font-size:13px; color:var(--text-secondary); line-height:1.6;">
              <strong>Unidade:</strong> ${memberSchool} &nbsp;|&nbsp; 
              <strong>Turma/Atuação:</strong> ${memberClass} &nbsp;|&nbsp; 
              <strong>Supervisor(a):</strong> ${memberSupervisor}
            </div>
          </div>

          <!-- Cards de KPIs do Docente -->
          <div class="kpi-row" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(210px, 1fr)); gap:16px; margin-bottom:24px;">
            <div class="card" style="margin:0;">
              <div style="font-size:11px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Observações Concluídas</div>
              <div style="font-size:28px; font-weight:800; color:var(--primary-dark); margin:4px 0;">
                ${memberObs.length} <span style="font-size:15px; color:var(--text-secondary); font-weight:600;">de 4 bimestres</span>
              </div>
              <div style="font-size:12px; color:var(--text-secondary);">
                ${memberObs.length >= 2 ? 'Série histórica apta para cruzamento' : 'Observação diagnóstica inicial'}
              </div>
            </div>

            <div class="card" style="margin:0; display:flex; flex-direction:column; justify-content:space-between;">
              <div style="font-size:11px; font-weight:700; color:var(--text-secondary); text-transform:uppercase; margin-bottom:8px;">Evolução de Consistência</div>
              <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:6px; flex:1; align-items:stretch;">
                ${bimesters.map((bim, idx) => {
                  const bData = bimData[bim];
                  const hasData = Boolean(bData);
                  const pct = hasData ? bData.pct : null;
                  const color = !hasData ? 'var(--text-secondary)' : (pct >= 80 ? 'var(--green)' : pct >= 60 ? 'var(--yellow)' : 'var(--red)');
                  const bg = !hasData ? '#F8FAFC' : (pct >= 80 ? '#F0FDF4' : pct >= 60 ? '#FFFBEB' : '#FEF2F2');
                  const border = !hasData ? '1px solid #E2E8F0' : (pct >= 80 ? '1px solid #BBF7D0' : pct >= 60 ? '1px solid #FDE68A' : '1px solid #FECACA');
                  return `
                    <div style="background:${bg}; border:${border}; border-radius:8px; padding:8px 2px; min-width:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center;" title="${bim}: ${hasData ? pct + '%' : 'Sem registro'}">
                      <span style="font-size:11px; font-weight:700; color:var(--text-secondary); margin-bottom:3px;">${idx + 1}º</span>
                      <span style="font-size:clamp(17px, 1.8vw, 24px); font-weight:800; color:${color}; line-height:1.1; letter-spacing:-0.5px;">
                        ${hasData ? pct + '%' : '—'}
                      </span>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <div class="card" style="margin:0;">
              <div style="font-size:11px; font-weight:700; color:var(--text-secondary); text-transform:uppercase; margin-bottom:8px;">Balanço de Critérios</div>
              <div style="display:flex; flex-direction:column; gap:6px; margin-bottom:8px;">
                <span class="badge-trend-up" style="display:flex; align-items:center; justify-content:center; width:100%; padding:6px 10px; font-size:12px; font-weight:700; border-radius:6px; box-sizing:border-box;">
                  ${renderTrendIconSvg('badge-trend-up')}
                  <span>${countUp} Progrediram</span>
                </span>
                <span class="badge-trend-stable" style="display:flex; align-items:center; justify-content:center; width:100%; padding:6px 10px; font-size:12px; font-weight:700; border-radius:6px; box-sizing:border-box;">
                  ${renderTrendIconSvg('badge-trend-stable')}
                  <span>${countStable} Consolidados</span>
                </span>
                <span class="badge-trend-down" style="display:flex; align-items:center; justify-content:center; width:100%; padding:6px 10px; font-size:12px; font-weight:700; border-radius:6px; box-sizing:border-box;">
                  ${renderTrendIconSvg('badge-trend-alert')}
                  <span>${countAlert} Atenção</span>
                </span>
              </div>
              <div style="font-size:12px; color:var(--text-secondary); text-align:center;">${countTotalCriteria} critérios avaliados na matriz</div>
            </div>

            <div class="card" style="margin:0; display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                  <span style="font-size:11px; font-weight:700; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.5px;">Escala de Materiais</span>
                  ${matLevel ? `
                    <span style="font-size:10px; font-weight:700; color:${matColor}; background:${matBg}; border:1px solid ${matBorder}; padding:2px 8px; border-radius:12px; white-space:nowrap;">
                      ${matTag}
                    </span>
                  ` : ''}
                </div>

                ${matLevel ? `
                  <div style="display:flex; align-items:baseline; gap:6px; margin:4px 0 6px 0;">
                    <span style="font-size:28px; font-weight:800; color:${matColor}; line-height:1;">
                      Nível ${matLevel}
                    </span>
                    <span style="font-size:14px; font-weight:700; color:var(--text-secondary);">
                      de 4
                    </span>
                  </div>

                  <!-- Régua Visual Segmentada em 4 Níveis -->
                  <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:5px; margin:8px 0 10px 0;">
                    <div style="height:5px; border-radius:3px; background:${matLevel >= 1 ? matColor : '#E2E8F0'};" title="Nível 1: Uso exclusivo de folhas pré-prontas"></div>
                    <div style="height:5px; border-radius:3px; background:${matLevel >= 2 ? matColor : '#E2E8F0'};" title="Nível 2: Uso predominante de folhas estruturadas"></div>
                    <div style="height:5px; border-radius:3px; background:${matLevel >= 3 ? matColor : '#E2E8F0'};" title="Nível 3: Uso regular de materiais expressivos diversificados"></div>
                    <div style="height:5px; border-radius:3px; background:${matLevel >= 4 ? matColor : '#E2E8F0'};" title="Nível 4: Uso bi e tridimensional rico com intencionalidade"></div>
                  </div>

                  <div style="font-size:12px; font-weight:600; color:var(--text-primary); line-height:1.4; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;" title="${matFullDesc}">
                    ${matText}
                  </div>
                ` : `
                  <div style="display:flex; align-items:baseline; gap:6px; margin:4px 0 6px 0;">
                    <span style="font-size:28px; font-weight:800; color:var(--text-secondary); line-height:1;">—</span>
                  </div>
                  <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:5px; margin:8px 0 10px 0;">
                    <div style="height:5px; border-radius:3px; background:#E2E8F0;"></div>
                    <div style="height:5px; border-radius:3px; background:#E2E8F0;"></div>
                    <div style="height:5px; border-radius:3px; background:#E2E8F0;"></div>
                    <div style="height:5px; border-radius:3px; background:#E2E8F0;"></div>
                  </div>
                  <div style="font-size:12px; color:var(--text-secondary); line-height:1.4;">
                    ${targetType === 'coordenador' ? 'Não aplicável para coordenação' : 'Sem registro na última observação'}
                  </div>
                `}
              </div>

              <div style="font-size:11px; color:var(--text-secondary); margin-top:10px; padding-top:6px; border-top:1px solid #F1F5F9; display:flex; justify-content:space-between; align-items:center;">
                ${lastObs && matLevel ? `
                  <span>${lastObs.bimester || 'Última observação'}</span>
                  <span>${formatDateBR(lastObs.date)}</span>
                ` : `
                  <span>${targetType === 'coordenador' ? 'Foco em gestão' : 'Aguardando observação'}</span>
                  <span>—</span>
                `}
              </div>
            </div>
          </div>
        </div>

        <div id="indicatorsSectionDrilldown" style="display:${currentSubTab === 'drilldown' ? 'block' : 'none'};">
          <!-- Matriz Longitudinal Analítica Item a Item -->
          <div class="page-title-row" style="margin-top:4px; margin-bottom:14px;">
            <div>
              <h3 style="font-size:17px; font-weight:800; color:var(--primary-dark); margin:0;">
                Raio-X Longitudinal Item a Item · Matriz Pedagógica
              </h3>
              <p style="font-size:12px; color:var(--text-secondary); margin-top:2px;">
                Comparativo cronológico de cada critério avaliado entre o 1º, 2º, 3º e 4º Bimestres
              </p>
            </div>
          </div>
        `;

        if (memberObs.length === 0) {
          indHtml += `
            <div class="card" style="text-align:center; padding:36px 20px; background:#F8FAFC;">
              <div style="font-size:16px; font-weight:700; color:var(--text-primary); margin-bottom:6px;">
                Nenhuma Observação Finalizada para este(a) Profissional
              </div>
              <p style="font-size:13px; color:var(--text-secondary); max-width:480px; margin:0 auto 16px auto;">
                Este profissional ainda não possui observações concluídas no sistema. Agende ou finalize uma observação para iniciar o acompanhamento longitudinal item a item.
              </p>
              <button class="btn btn-primary" onclick="handleNewObsButtonClick()">Iniciar Nova Observação</button>
            </div>
          `;
        } else {
          // Cascata em 3 Níveis para o Raio-X Individual (Dimensão -> Subdimensão -> Variáveis)
          activeSections.forEach((sec, sIdx) => {
            const dimKey = `rx_dim_${sIdx}`;
            const isDimOpen = Boolean(appState.expandedDrilldowns[dimKey]);

            // Calcula índices da Dimensão nos 4 Bimestres para este profissional
            const dimBimScores = {};
            bimesters.forEach(bim => {
              const obs = memberObs.find(o => o.bimester === bim);
              if (!obs) return;
              let pts = 0;
              let valid = 0;
              sec.subSections.forEach(sub => {
                sub.criteria.forEach(crit => {
                  const r = obs.responses ? obs.responses[crit.id] : null;
                  if (r && r !== 'na') {
                    valid++;
                    if (r === 'consistent') pts += 1.0;
                    else if (r === 'partial') pts += 0.5;
                  }
                });
              });
              if (valid > 0) dimBimScores[bim] = Math.round((pts / valid) * 100);
            });

            // Régua de Bimestres no cabeçalho da Dimensão
            const dimBimPills = bimesters.map(b => {
              const shortName = b.replace(/º? Bimestre$/, 'º').replace(/ºº/g, 'º');
              const val = dimBimScores[b];
              if (val !== undefined) {
                const col = val >= 80 ? 'var(--green)' : val >= 60 ? 'var(--yellow)' : 'var(--red)';
                const bg = val >= 80 ? '#DCFCE7' : val >= 60 ? '#FEF3C7' : '#FEE2E2';
                return `<div style="background:${bg}; color:${col}; font-weight:800; padding:3px 4px; border-radius:4px; font-size:11px; text-align:center; white-space:nowrap;">${shortName}: ${val}%</div>`;
              }
              return `<div style="background:#F1F5F9; color:#94A3B8; padding:3px 4px; border-radius:4px; font-size:11px; text-align:center; white-space:nowrap;">${shortName}: —</div>`;
            }).join('');

            indHtml += `
              <div class="drilldown-group">
                <!-- NÍVEL 1: DIMENSÃO (Clicável para expandir as Subdimensões) -->
                <div class="drilldown-header ${isDimOpen ? 'expanded' : ''}" onclick="toggleDrilldown('${dimKey}')">
                  <div style="display:flex; align-items:center; gap:12px; flex:1; min-width:0;">
                    <span style="font-size:16px;">${isDimOpen ? '▼' : '►'}</span>
                    <div style="min-width:0;">
                      <div style="font-size:15px; font-weight:800; color:var(--text-primary); line-height:1.3;">
                        ${sIdx + 1}. ${(sec.title || '').replace(/^Dimens[aã]o\s*\d*\s*[:\.\-]?\s*/i, '').trim()}
                      </div>
                      <div style="font-size:11px; color:var(--text-secondary); margin-top:2px;">
                        ${sec.subSections.length} subdimensões
                      </div>
                    </div>
                  </div>
                  <div class="drilldown-bim-grid">
                    ${dimBimPills}
                  </div>
                </div>

                <div class="drilldown-content ${isDimOpen ? 'show' : ''}">
            `;

            sec.subSections.forEach((sub, subIdx) => {
              const subKey = `rx_sub_${sIdx}_${subIdx}`;
              const isSubOpen = Boolean(appState.expandedDrilldowns[subKey]);

              // Calcula índices da Subdimensão nos 4 Bimestres para este profissional
              const subBimScores = {};
              bimesters.forEach(bim => {
                const obs = memberObs.find(o => o.bimester === bim);
                if (!obs) return;
                let pts = 0;
                let valid = 0;
                sub.criteria.forEach(crit => {
                  const r = obs.responses ? obs.responses[crit.id] : null;
                  if (r && r !== 'na') {
                    valid++;
                    if (r === 'consistent') pts += 1.0;
                    else if (r === 'partial') pts += 0.5;
                  }
                });
                if (valid > 0) subBimScores[bim] = Math.round((pts / valid) * 100);
              });

              // Régua de Bimestres no cabeçalho da Subdimensão
              const subBimPills = bimesters.map(b => {
                const shortName = b.replace(/º? Bimestre$/, 'º').replace(/ºº/g, 'º');
                const val = subBimScores[b];
                if (val !== undefined) {
                  const col = val >= 80 ? 'var(--green)' : val >= 60 ? 'var(--yellow)' : 'var(--red)';
                  const bg = val >= 80 ? '#DCFCE7' : val >= 60 ? '#FEF3C7' : '#FEE2E2';
                  return `<div style="background:${bg}; color:${col}; font-weight:800; padding:3px 4px; border-radius:4px; font-size:11px; text-align:center; white-space:nowrap;">${shortName}: ${val}%</div>`;
                }
                return `<div style="background:#F1F5F9; color:#94A3B8; padding:3px 4px; border-radius:4px; font-size:11px; text-align:center; white-space:nowrap;">${shortName}: —</div>`;
              }).join('');

              indHtml += `
                <div class="drilldown-subgroup">
                  <!-- NÍVEL 2: SUBDIMENSÃO (Clicável para expandir as Variáveis) -->
                  <div class="drilldown-subheader ${isSubOpen ? 'expanded' : ''}" onclick="toggleDrilldown('${subKey}')">
                    <div style="display:flex; align-items:center; gap:10px; flex:1; min-width:0;">
                      <span style="font-size:13px; color:var(--text-secondary);">${isSubOpen ? '▼' : '►'}</span>
                      <div style="min-width:0;">
                        <div style="font-size:13px; font-weight:800; color:var(--primary-dark); line-height:1.3;">
                          ${sub.id} ${(sub.title || '').replace(/^Subdimens[aã]o\s*[\d\.]*\s*[:\.\-]?\s*/i, '').trim()}
                        </div>
                        <div style="font-size:11px; color:var(--text-secondary); margin-top:2px;">
                          ${sub.criteria.length} variáveis avaliativas
                        </div>
                      </div>
                    </div>
                    <div class="drilldown-bim-grid">
                      ${subBimPills}
                    </div>
                  </div>

                  <!-- NÍVEL 3: VARIÁVEIS / ITENS INDIVIDUAIS (Exibidos apenas ao clicar na subdimensão) -->
                  <div class="drilldown-subcontent ${isSubOpen ? 'show' : ''}">
              `;

              let tableRowsHtml = '';
              let mobileCardsHtml = '';

              sub.criteria.forEach((crit) => {
                const responsesByBim = {};
                const commentsByBim = [];

                bimesters.forEach(bim => {
                  const obs = memberObs.find(o => o.bimester === bim);
                  if (obs) {
                    const r = obs.responses ? obs.responses[crit.id] : null;
                    if (r) responsesByBim[bim] = r;

                    const cText = (obs.criterionComments && obs.criterionComments[crit.id]) || (obs.notes && obs.notes[crit.id]);
                    if (cText && cText.trim() !== '') {
                      commentsByBim.push({
                        bimester: bim,
                        date: obs.date,
                        comment: cText.trim()
                      });
                    }
                  }
                });

                const trend = calculateCriterionTrend(responsesByBim);

                // Helper para renderizar célula do bimestre na tabela desktop
                const renderBimCell = (bimName) => {
                  const r = responsesByBim[bimName];
                  if (!r) return `<td style="text-align:center; color:var(--text-secondary); opacity:0.4;">—</td>`;
                  if (r === 'consistent') return `<td style="text-align:center;"><span style="background:#DCFCE7; color:#166534; padding:3px 7px; border-radius:4px; font-weight:700; font-size:11px;">Consistente</span></td>`;
                  if (r === 'partial') return `<td style="text-align:center;"><span style="background:#FEF3C7; color:#92400E; padding:3px 7px; border-radius:4px; font-weight:700; font-size:11px;">Parcial</span></td>`;
                  if (r === 'not_done') return `<td style="text-align:center;"><span style="background:#FEE2E2; color:#991B1B; padding:3px 7px; border-radius:4px; font-weight:700; font-size:11px;">Não Realizado</span></td>`;
                  if (r === 'na') return `<td style="text-align:center;"><span style="background:#F1F5F9; color:#475569; padding:3px 7px; border-radius:4px; font-weight:700; font-size:11px;">N/A</span></td>`;
                  return `<td style="text-align:center;">—</td>`;
                };

                // Monta Linha Desktop
                tableRowsHtml += `
                  <tr>
                    <td style="line-height:1.4;">
                      <strong style="color:var(--primary-dark);">[${crit.id}]</strong> ${crit.text}
                      ${commentsByBim.length > 0 ? `
                        <div style="margin-top:6px; font-size:11px; background:#FFFBEB; border-left:3px solid #D97706; padding:4px 8px; border-radius:4px; color:#92400E;">
                          ${commentsByBim.map(cb => `<div style="display:flex; align-items:flex-start; gap:4px;"><svg class="btn-icon-sm" style="flex-shrink:0; margin-top:2px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg><span><strong>${cb.bimester} (${formatDateBR(cb.date)}):</strong> "${cb.comment}"</span></div>`).join('')}
                        </div>
                      ` : ''}
                    </td>
                    ${renderBimCell('1º Bimestre')}
                    ${renderBimCell('2º Bimestre')}
                    ${renderBimCell('3º Bimestre')}
                    ${renderBimCell('4º Bimestre')}
                    <td style="text-align:center;">
                      <span class="${trend.cssClass}">
                        ${trend.icon} ${trend.text}
                      </span>
                    </td>
                  </tr>
                `;

                // Monta Grid de 4 Bimestres para Card Mobile
                const mobileBimStrip = bimesters.map(bimName => {
                  const r = responsesByBim[bimName];
                  const shortName = bimName.replace(/º? Bimestre$/, 'º').replace(/ºº/g, 'º');
                  if (!r) {
                    return `
                      <div class="rx-bimester-cell">
                        <div style="font-size:10px; font-weight:700; color:var(--text-secondary); margin-bottom:2px;">${shortName}</div>
                        <div style="font-size:11px; color:#94A3B8;">—</div>
                      </div>
                    `;
                  }
                  let bg = '#F1F5F9';
                  let text = 'N/A';
                  let col = '#475569';
                  if (r === 'consistent') { bg = '#DCFCE7'; text = 'Consistente'; col = '#166534'; }
                  else if (r === 'partial') { bg = '#FEF3C7'; text = 'Parcial'; col = '#92400E'; }
                  else if (r === 'not_done') { bg = '#FEE2E2'; text = 'Não Realiz.'; col = '#991B1B'; }
                  return `
                    <div class="rx-bimester-cell" style="background:${bg}; border-color:transparent;">
                      <div style="font-size:10px; font-weight:700; color:${col}; margin-bottom:2px;">${shortName}</div>
                      <div style="font-size:10px; font-weight:800; color:${col};">${text}</div>
                    </div>
                  `;
                }).join('');

                let cardBg = '#FFFFFF';
                let cardBorder = 'var(--border)';
                let cardIcon = '';
                let cardIconColor = '#94A3B8';

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

                // Monta Card Mobile
                mobileCardsHtml += `
                  <div class="rx-criterion-card" style="background:${cardBg}; border:1px solid ${cardBorder}; position:relative; padding:12px 14px; border-radius:8px;">
                    ${cardIcon ? `
                      <span style="position:absolute; top:8px; right:10px; font-size:15px; font-weight:900; color:${cardIconColor}; line-height:1;" title="${trend.text}">
                        ${cardIcon}
                      </span>
                    ` : ''}
                    <div style="font-size:13px; font-weight:700; color:var(--text-primary); line-height:1.4; padding-right:24px;">
                      <span style="color:var(--primary); font-weight:800;">[${crit.id}]</span> ${crit.text}
                    </div>

                    <div class="rx-bimesters-grid" style="margin-top:8px;">
                      ${mobileBimStrip}
                    </div>

                    ${commentsByBim.length > 0 ? `
                      <div style="margin-top:6px; font-size:11px; background:#FFFBEB; border-left:3px solid #D97706; padding:6px 8px; border-radius:4px; color:#92400E; line-height:1.4;">
                        ${commentsByBim.map(cb => `<div style="display:flex; align-items:flex-start; gap:4px; margin-bottom:2px;"><svg class="btn-icon-sm" style="width:12px; height:12px; flex-shrink:0; margin-top:2px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> <span><strong>${cb.bimester} (${formatDateBR(cb.date)}):</strong> "${cb.comment}"</span></div>`).join('')}
                      </div>
                    ` : ''}
                  </div>
                `;
              });

              indHtml += `
                    <!-- Tabela Desktop -->
                    <div class="rx-table-view">
                      <div style="overflow-x:auto;">
                        <table class="data-table" style="font-size:12px; margin-bottom:8px;">
                          <thead>
                            <tr>
                              <th style="min-width:260px;">Critério Avaliativo</th>
                              <th style="text-align:center; width:110px;">1º Bimestre</th>
                              <th style="text-align:center; width:110px;">2º Bimestre</th>
                              <th style="text-align:center; width:110px;">3º Bimestre</th>
                              <th style="text-align:center; width:110px;">4º Bimestre</th>
                              <th style="text-align:center; width:140px;">Variação / Tendência</th>
                            </tr>
                          </thead>
                          <tbody>
                            ${tableRowsHtml}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <!-- Cards Mobile (Sem Rolagem Lateral) -->
                    <div class="rx-cards-view">
                      ${mobileCardsHtml}
                    </div>
                  </div>
                </div>
              `;
            });

            indHtml += `
                </div>
              </div>
            `;
          });
        }

        indHtml += `
          </div>

          <!-- Bloco Longitudinal: Retorno para visão panorâmica de todos os membros -->
          <div id="indicatorsSectionLongitudinal" style="display:${currentSubTab === 'longitudinal' ? 'block' : 'none'};">
            <div class="card" style="text-align:center; padding:32px 20px; background:#F8FAFC; margin-top:4px;">
              <div style="font-size:16px; font-weight:800; color:var(--primary-dark); margin-bottom:6px;">
                Acompanhamento Longitudinal Geral
              </div>
              <p style="font-size:13px; color:var(--text-secondary); max-width:480px; margin:0 auto 16px auto;">
                Você está analisando o raio-x individual de <strong>${activeMemberFilter}</strong>. Clique no botão abaixo para retornar à tabela comparativa de todos os profissionais.
              </p>
              <button class="btn btn-primary" onclick="clearTeacherLongitudinalFilter()">
                Voltar para Lista Longitudinal Geral
              </button>
            </div>
          </div>
        `;

        container.innerHTML = indHtml;
        updateMobileIndicatorsActiveBadge();
        return;
      }

      // =========================================================================
      // CASO A: VISÃO GERAL PANORÂMICA (PILAR 3: BENCHMARK UE VS. REDE)
      // =========================================================================

      // 1. Resolução das Observações Consolidadas de toda a Rede Municipal de Patos
      let redeObs = (appState.observations || []).filter(o => {
        if (o.status !== 'finalized' && o.status !== 'concluida') return false;
        if (targetType === 'coordenador') {
          return o.evaluatedType === 'coordenador';
        } else {
          return o.evaluatedType === 'professora' || o.evaluatedType === 'turma';
        }
      });

      // PILAR 9: Aplica a mesma filtragem de bimestre na média da Rede para benchmark matematicamente fidedigno
      if (activeBimesterFilter !== 'ALL') {
        redeObs = redeObs.filter(o => o.bimester === activeBimesterFilter);
      }

      // 2. Computação Hierárquica Dupla: Escopo Selecionado vs. Rede Municipal de Patos
      const scopeHierarchy = calculateHierarchyStats(scopedObs, activeSections);
      const redeHierarchy = calculateHierarchyStats(redeObs, activeSections);

      const totalValidResp = scopeHierarchy.totalValid;
      const totalPts = scopeHierarchy.totalPts;
      const totalNA = scopeHierarchy.totalNA;
      const totalAvaliandos = scopedAvaliandos.length;

      // =========================================================================
      // PILAR 7: CÁLCULO ESTRUTURADO DOS 4 KPIS DECISÓRIOS (EXTINÇÃO DE MÉTRICAS CARTORIAIS)
      // =========================================================================

      // 1. KPI 1: ÍNDICE DE CONSISTÊNCIA GERAL (Média Ponderada Formativa)
      const overallPercent = totalValidResp > 0 ? Math.round((totalPts / totalValidResp) * 100) : null;
      const overallColor = overallPercent === null ? 'var(--text-secondary)' : (overallPercent >= 80 ? 'var(--green)' : overallPercent >= 60 ? 'var(--yellow)' : 'var(--red)');
      const overallLabel = overallPercent === null ? 'Sem Observações Finalizadas' : (overallPercent >= 80 ? 'Consistência Forte' : overallPercent >= 60 ? 'Atenção Necessária' : 'Alerta de Fragilidade');
      const overallDisplay = overallPercent !== null ? `${overallPercent}%` : '—';

      // 2. KPI 2: COBERTURA NO BIMESTRE CORRENTE (DESTAQUE MÁXIMO DO PILAR 7)
      const currentBimester = getCurrentSchoolBimester();
      const currentBimNumMatch = currentBimester.match(/([1-4])/);
      const currentBimNum = currentBimNumMatch ? currentBimNumMatch[1] : '1';

      let totalEntitiesCount = 0;
      let evaluatedEntitiesCurrentBim = 0;
      let pendingEntitiesCurrentBim = 0;
      let coverageCurrentBimPct = 0;
      let kpiCoverageTitle = `Cobertura · ${currentBimester}`;
      let kpiCoverageSubtitle = '';
      let kpiCoverageBorderColor = 'var(--primary)';

      // 3. KPI 3: META DO CICLO ANUAL (Avanço Longitudinal: Meta 4 Observações por Turma)
      let totalAnnualTargetObs = 0;
      let completedAnnualObs = scopedObs.length;
      let annualCycleProgressPct = 0;
      let entitiesStartedCycleCount = 0;
      let kpiCycleTitle = 'Meta do Ciclo Anual';
      let kpiCycleSubtitle = '';

      let scopedClasses = [];
      let indSchools = (activeUnitFilter !== 'ALL') ? [activeUnitFilter] : ((appState.units || []).map(u => u.name));
      indSchools.forEach(uName => {
        scopedClasses = scopedClasses.concat(getClassesForSchool(uName));
      });

      if (targetType === 'professora') {
        totalEntitiesCount = scopedClasses.length;

        // Turmas com observação finalizada no bimestre corrente
        evaluatedEntitiesCurrentBim = scopedClasses.filter(cls => {
          const cleanClassName = (cls.name || '').trim().toLowerCase();
          return scopedObs.some(o => {
            if (o.status !== 'finalized' && o.status !== 'concluida') return false;
            if (!o.className || o.className.trim().toLowerCase() !== cleanClassName) return false;
            const obsBimMatch = (o.bimester || '').match(/([1-4])/);
            return obsBimMatch && obsBimMatch[1] === currentBimNum;
          });
        }).length;

        pendingEntitiesCurrentBim = Math.max(0, totalEntitiesCount - evaluatedEntitiesCurrentBim);
        coverageCurrentBimPct = totalEntitiesCount > 0 ? Math.round((evaluatedEntitiesCurrentBim / totalEntitiesCount) * 100) : 0;

        // Turmas que possuem pelo menos 1 observação no ano letivo (ciclo iniciado)
        entitiesStartedCycleCount = scopedClasses.filter(cls => {
          const cleanClassName = (cls.name || '').trim().toLowerCase();
          return scopedObs.some(o => {
            if (o.status !== 'finalized' && o.status !== 'concluida') return false;
            return o.className && o.className.trim().toLowerCase() !== cleanClassName;
          });
        }).length;

        totalAnnualTargetObs = totalEntitiesCount * 4; // 4 bimestres obrigatórios
        annualCycleProgressPct = totalAnnualTargetObs > 0 ? Math.round((completedAnnualObs / totalAnnualTargetObs) * 100) : 0;

        kpiCoverageTitle = `Cobertura Turmas · ${currentBimester}`;
        if (totalEntitiesCount === 0) {
          kpiCoverageSubtitle = 'Nenhuma turma mapeada';
          kpiCoverageBorderColor = 'var(--text-secondary)';
        } else if (pendingEntitiesCurrentBim === 0) {
          kpiCoverageSubtitle = '100% das turmas concluídas';
          kpiCoverageBorderColor = 'var(--green)';
        } else {
          kpiCoverageSubtitle = `${pendingEntitiesCurrentBim} turma(s) pendente(s)`;
          kpiCoverageBorderColor = coverageCurrentBimPct >= 50 ? 'var(--yellow)' : 'var(--red)';
        }

        kpiCycleSubtitle = `${entitiesStartedCycleCount} de ${totalEntitiesCount} turmas com ciclo iniciado`;
      } else {
        // Escopo de Coordenação Pedagógica (Formadores)
        totalEntitiesCount = scopedAvaliandos.length;
        evaluatedEntitiesCurrentBim = scopedAvaliandos.filter(av => {
          const cleanAvName = (av.name || '').trim().toLowerCase();
          return scopedObs.some(o => {
            if (o.status !== 'finalized' && o.status !== 'concluida') return false;
            if (!o.teacherName || o.teacherName.trim().toLowerCase() !== cleanAvName) return false;
            const obsBimMatch = (o.bimester || '').match(/([1-4])/);
            return obsBimMatch && obsBimMatch[1] === currentBimNum;
          });
        }).length;

        pendingEntitiesCurrentBim = Math.max(0, totalEntitiesCount - evaluatedEntitiesCurrentBim);
        coverageCurrentBimPct = totalEntitiesCount > 0 ? Math.round((evaluatedEntitiesCurrentBim / totalEntitiesCount) * 100) : 0;

        entitiesStartedCycleCount = scopedAvaliandos.filter(av => {
          const cleanAvName = (av.name || '').trim().toLowerCase();
          return scopedObs.some(o => {
            if (o.status !== 'finalized' && o.status !== 'concluida') return false;
            return o.teacherName && o.teacherName.trim().toLowerCase() === cleanAvName;
          });
        }).length;

        totalAnnualTargetObs = totalEntitiesCount * 4;
        annualCycleProgressPct = totalAnnualTargetObs > 0 ? Math.round((completedAnnualObs / totalAnnualTargetObs) * 100) : 0;

        kpiCoverageTitle = `Cobertura Coord. · ${currentBimester}`;
        if (totalEntitiesCount === 0) {
          kpiCoverageSubtitle = 'Nenhuma coordenação vinculada';
          kpiCoverageBorderColor = 'var(--text-secondary)';
        } else if (pendingEntitiesCurrentBim === 0) {
          kpiCoverageSubtitle = '✓ 100% das coordenadoras atendidas';
          kpiCoverageBorderColor = 'var(--green)';
        } else {
          kpiCoverageSubtitle = `⚠ ${pendingEntitiesCurrentBim} coord. pendente(s)`;
          kpiCoverageBorderColor = coverageCurrentBimPct >= 50 ? 'var(--yellow)' : 'var(--red)';
        }

        kpiCycleSubtitle = `${entitiesStartedCycleCount} de ${totalEntitiesCount} coord. com ciclo iniciado`;
      }

      // 4. KPI 4: DIMENSÃO PRIORITÁRIA DE INTERVENÇÃO (Gargalo Pedagógico da UE / Polo)
      let lowestDimTitle = '—';
      let lowestDimPct = null;
      let lowestDimDelta = null;
      let lowestDimColor = 'var(--text-secondary)';
      let lowestDimSubtitle = 'Sem dados suficientes';

      if (scopeHierarchy.dims && scopeHierarchy.dims.length > 0) {
        let minScore = 999;
        let candidateDim = null;
        let candidateIdx = -1;

        scopeHierarchy.dims.forEach((d, idx) => {
          if (d.validTotal > 0) {
            const score = Math.round(((d.consistent * 1.0 + d.partial * 0.5) / d.validTotal) * 100);
            if (score < minScore) {
              minScore = score;
              candidateDim = d;
              candidateIdx = idx;
            }
          }
        });

        if (candidateDim) {
          lowestDimPct = minScore;
          lowestDimColor = lowestDimPct >= 80 ? 'var(--green)' : (lowestDimPct >= 60 ? 'var(--yellow)' : 'var(--red)');
          
          const cleanDimTitle = (candidateDim.title || '')
            .replace(/^Dimens[aã]o\s*\d*\s*[:\.\-]?\s*/i, '')
            .trim();
          lowestDimTitle = `${candidateIdx + 1}. ${cleanDimTitle}`;

          // Delta em relação à média da Rede Municipal de Patos
          const redeCandidate = redeHierarchy.dims[candidateIdx];
          if (redeCandidate && redeCandidate.validTotal > 0) {
            const redeScore = Math.round(((redeCandidate.consistent * 1.0 + redeCandidate.partial * 0.5) / redeCandidate.validTotal) * 100);
            lowestDimDelta = lowestDimPct - redeScore;
          }

          if (lowestDimPct >= 80) {
            lowestDimSubtitle = '✓ Todas as dimensões consistentes';
          } else {
            lowestDimSubtitle = lowestDimDelta !== null 
              ? `${lowestDimDelta > 0 ? '+' : ''}${lowestDimDelta}% vs. Rede Municipal`
              : 'Pauta prioritária para formação';
          }
        }
      }

      // Definição do escopo ativo de visualização e rótulo de benchmark
      let scopeLabelText = 'Minha UE';
      if (user.roleKey === 'coordenador') {
        scopeLabelText = 'Minha UE';
      } else if (user.roleKey === 'formador') {
        scopeLabelText = (activeUnitFilter !== 'ALL') ? activeUnitFilter : 'Meu Polo';
      } else {
        scopeLabelText = (activeUnitFilter !== 'ALL') ? activeUnitFilter : 'Rede Consolidada';
      }

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
                <div style="display:flex; align-items:center; gap:6px;">
                  <svg class="btn-icon-sm" style="color:var(--primary);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 21h18"></path>
                    <path d="M5 21V7l8-4v18"></path>
                    <path d="M19 21V11l-6-4"></path>
                    <line x1="9" y1="9" x2="9" y2="9.01"></line>
                    <line x1="9" y1="13" x2="9" y2="13.01"></line>
                    <line x1="9" y1="17" x2="9" y2="17.01"></line>
                  </svg>
                  <h4 style="font-size:15px; font-weight:800; color:var(--primary-dark); margin:0;">
                    Cobertura e Consistência por Unidade Escolar · ${currentBim}
                  </h4>
                </div>
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
                <div style="display:flex; align-items:center; gap:6px;">
                  <svg class="btn-icon-sm" style="color:var(--primary);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                    <polyline points="2 17 12 22 22 17"></polyline>
                    <polyline points="2 12 12 17 22 12"></polyline>
                  </svg>
                  <h4 style="font-size:14px; font-weight:800; color:var(--primary-dark); margin:0;">
                    Distribuição do Uso de Materiais (Síntese Pedagógica)
                  </h4>
                </div>
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

      // Lista de turmas pendentes para a gaveta retrátil do Card 2
      let pendingListItemsHtml = '';
      if (targetType === 'professora') {
        const pendingClassesList = scopedClasses.filter(cls => {
          const cleanClassName = (cls.name || '').trim().toLowerCase();
          return !scopedObs.some(o => {
            if (o.status !== 'finalized' && o.status !== 'concluida') return false;
            if (!o.className || o.className.trim().toLowerCase() !== cleanClassName) return false;
            const obsBimMatch = (o.bimester || '').match(/([1-4])/);
            return obsBimMatch && obsBimMatch[1] === currentBimNum;
          });
        });

        pendingListItemsHtml = pendingClassesList.map(cls => `
          <div class="pending-class-item">
            <div>
              <strong>${cls.name}</strong>
              <span style="font-size:11px; color:var(--text-secondary); margin-left:6px;">(${cls.school || activeUnitFilter})</span>
            </div>
            <button type="button" class="btn btn-primary" style="font-size:11px; padding:3px 8px;" onclick="quickScheduleForClass('${cls.name.replace(/'/g, "\\'")}', '${(cls.school || activeUnitFilter).replace(/'/g, "\\'")}', '${currentBimester}')">
              Agendar ➔
            </button>
          </div>
        `).join('');
      }

      // 1. Linha de KPIs Superiores Decisórios (Grid de 4 Colunas do Pilar 7)
      let html = `
        <div id="indicatorsSectionKPIs" style="display:${currentSubTab === 'kpis' ? 'block' : 'none'};">
          ${executiveUETableHtml}
          <div class="kpi-row" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(210px, 1fr)); gap:16px; margin-bottom:20px;">
            
            <!-- CARD 1: QUALIDADE FORMATIVA (ÍNDICE DE CONSISTÊNCIA) -->
            <div class="card" style="margin:0; display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <div style="font-size:11px; font-weight:700; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.5px;">Índice de Consistência</div>
                <div style="font-size:28px; font-weight:800; color:${overallColor}; margin:4px 0;">${overallDisplay}</div>
              </div>
              <div style="font-size:12px; color:var(--text-secondary); line-height:1.3;">● ${overallLabel}</div>
            </div>

            <!-- CARD 2: COBERTURA NO BIMESTRE CORRENTE (DESTAQUE MÁXIMO DO PILAR 7) -->
            <div class="card" style="margin:0; border-left:4px solid ${kpiCoverageBorderColor}; display:flex; flex-direction:column; justify-content:space-between; background:#FFFFFF;">
              <div>
                <div style="font-size:11px; font-weight:700; color:var(--primary); text-transform:uppercase; letter-spacing:0.5px;">${kpiCoverageTitle}</div>
                <div style="font-size:28px; font-weight:800; color:var(--primary-dark); margin:4px 0;">
                  ${evaluatedEntitiesCurrentBim} <span style="font-size:15px; color:var(--text-secondary); font-weight:600;">de ${totalEntitiesCount}</span>
                  <span style="font-size:16px; font-weight:800; color:${coverageCurrentBimPct >= 80 ? 'var(--green)' : (coverageCurrentBimPct >= 50 ? 'var(--yellow)' : 'var(--red)')}; margin-left:6px;">(${coverageCurrentBimPct}%)</span>
                </div>
              </div>
              <div style="font-size:12px; font-weight:600; color:${pendingEntitiesCurrentBim === 0 && totalEntitiesCount > 0 ? 'var(--green)' : 'var(--text-secondary)'}; line-height:1.3;">
                ${kpiCoverageSubtitle}
              </div>
              <div style="margin-top:8px; padding-top:6px; border-top:1px dashed rgba(0,0,0,0.08); display:flex; justify-content:space-between; align-items:center;">
                <button type="button" class="btn-link" style="font-size:11px; font-weight:700; color:var(--primary); background:none; border:none; padding:0; cursor:pointer; display:inline-flex; align-items:center; gap:4px;" onclick="scrollToBimesterSemaphore()" title="Abrir o Quadro de Controle Bimestral de Turmas" style="display:inline-flex; align-items:center; gap:4px;">
                  <svg class="btn-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span>Semáforo ↓</span>
                </button>
                ${pendingEntitiesCurrentBim > 0 && targetType === 'professora' ? `
                  <button type="button" class="btn-link" style="font-size:11px; font-weight:700; color:#D97706; background:none; border:none; padding:0; cursor:pointer;" onclick="togglePendingClassesDrawer()" title="Exibir ou ocultar turmas pendentes no bimestre" style="display:inline-flex; align-items:center; gap:4px;">
                    <svg class="btn-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                    </svg>
                    <span>Ver Pendentes</span>
                  </button>
                ` : ''}
              </div>
              <div id="pendingClassesDrawer" class="pending-classes-drawer" style="display:none;">
                <div style="font-weight:800; color:#92400E; margin-bottom:4px;">Turmas Pendentes neste Bimestre:</div>
                <div class="pending-classes-list">
                  ${pendingListItemsHtml || '<div style="color:var(--text-secondary);">Nenhuma turma pendente</div>'}
                </div>
              </div>
            </div>

            <!-- CARD 3: META DO CICLO ANUAL (AVANÇO LONGITUDINAL DAS 4 OBSERVAÇÕES) -->
            <div class="card" style="margin:0; display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <div style="font-size:11px; font-weight:700; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.5px;">${kpiCycleTitle}</div>
                <div style="font-size:28px; font-weight:800; color:var(--primary-dark); margin:4px 0;">
                  ${completedAnnualObs} <span style="font-size:15px; color:var(--text-secondary); font-weight:600;">de ${totalAnnualTargetObs}</span>
                  <span style="font-size:16px; font-weight:800; color:var(--primary); margin-left:6px;">(${annualCycleProgressPct}%)</span>
                </div>
              </div>
              <div style="font-size:12px; color:var(--text-secondary); line-height:1.3;">● ${kpiCycleSubtitle}</div>
              <div style="margin-top:8px; padding-top:6px; border-top:1px dashed rgba(0,0,0,0.08);">
                <button type="button" class="btn-link" style="font-size:11px; font-weight:700; color:var(--primary); background:none; border:none; padding:0; cursor:pointer; display:inline-flex; align-items:center; gap:4px;" onclick="scrollToBimesterSemaphore()" title="Visualizar avanço do ciclo longitudinal das 4 observações anuais" style="display:inline-flex; align-items:center; gap:4px;">
                  <svg class="btn-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"></line>
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="14"></line>
                  </svg>
                  <span>Ver Semáforo do Ciclo ↓</span>
                </button>
              </div>
            </div>

            <!-- CARD 4: DIMENSÃO PRIORITÁRIA DE INTERVENÇÃO (GARGALO DA UE / POLO) -->
            <div class="card" style="margin:0; display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <div style="font-size:11px; font-weight:700; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.5px;">Dimensão Prioritária</div>
                <div style="font-size:15px; font-weight:800; color:var(--text-primary); margin:6px 0 2px 0; line-height:1.3; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${lowestDimTitle}">
                  ${lowestDimTitle}
                </div>
                <div style="font-size:18px; font-weight:800; color:${lowestDimColor}; margin-bottom:4px;">
                  ${lowestDimPct !== null ? lowestDimPct + '%' : '—'}
                </div>
              </div>
              <div style="font-size:12px; color:${lowestDimDelta !== null && lowestDimDelta < 0 ? 'var(--red)' : 'var(--text-secondary)'}; font-weight:600; line-height:1.3;">
                ● ${lowestDimSubtitle}
              </div>
              <div style="margin-top:8px;">
                <a href="javascript:void(0)" onclick="scrollToBottlenecksBlock()" style="font-size:11px; font-weight:700; color:var(--primary); text-decoration:none; display:inline-flex; align-items:center; gap:4px;" title="Rolar para os 3 critérios prioritários de intervenção">
                  <svg class="btn-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="12" cy="6" r="6"></circle>
                    <circle cx="12" cy="2" r="2"></circle>
                  </svg>
                  <span>Ver os 3 Critérios Críticos ↓</span>
                </a>
              </div>
            </div>

          </div>

          <!-- Régua Horizontal das Grandes Dimensões da Matriz Pedagógica -->
          ${dimensionsSummaryHtml}

          <!-- Distribuição Agregada da Escala de Materiais -->
          ${materialsDistributionHtml}

          <!-- PILAR 8: BLOCO DE DIAGNÓSTICO DE PRIORIDADES FORMATIVAS: FOCO NOS MENORES ÍNDICES (GARGALOS) -->
          ${renderBottlenecksPrioritySection(scopeHierarchy, redeHierarchy, scopeLabelText, targetType)}

        </div>
      `;

      // 2. Afunilamento de Rubricas com Benchmark (Pilar 3)
      html += `
        <div id="indicatorsSectionDrilldown" style="display:${currentSubTab === 'drilldown' ? 'block' : 'none'};">
          <div class="page-title-row" style="margin-top:4px; margin-bottom:12px;">
            <div>
              <h3 style="font-size:17px; font-weight:800; color:var(--primary-dark);">
                Visualização por Dimensão dos Indicadores Pedagógicos (${targetType === 'coordenador' ? 'Coordenação' : 'Docência'})
              </h3>
              <p style="font-size:12px; color:var(--text-secondary);">
                Referencial comparativo item a item entre a sua Unidade Escolar e a Média da Rede Municipal de Patos
              </p>
            </div>
          </div>

          <!-- Banner Informativo de Contexto do Referencial da Rede Municipal -->
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

                    <!-- Controles Rápidos: Busca Instantânea, Filtro de Consistência e Expansão Global -->
          <div style="background:#FFFFFF; border:1px solid var(--border); border-radius:10px; padding:12px 16px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
            <div style="display:flex; align-items:center; gap:8px; flex:1; min-width:240px;">
              <input type="search" id="drilldownSearchInput" class="form-control" placeholder="🔍 Buscar critério por código ou texto..." oninput="onDrilldownSearch(this.value)" style="height:38px; font-size:12px; width:100%; max-width:380px;">
            </div>

            <!-- Chips de Faixa de Consistência -->
            <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
              <span style="font-size:11px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Filtrar:</span>
              <button type="button" class="btn btn-secondary drilldown-chip-btn active" data-range="all" onclick="filterDrilldownByScore('all')" style="font-size:11px; padding:4px 8px; font-weight:700;">Todos</button>
              <button type="button" class="btn btn-secondary drilldown-chip-btn" data-range="low" onclick="filterDrilldownByScore('low')" style="font-size:11px; padding:4px 8px; font-weight:700; color:var(--red); display:inline-flex; align-items:center;">
                <span class="score-chip-dot dot-red"></span> &lt; 60%
              </button>
              <button type="button" class="btn btn-secondary drilldown-chip-btn" data-range="med" onclick="filterDrilldownByScore('med')" style="font-size:11px; padding:4px 8px; font-weight:700; color:var(--yellow); display:inline-flex; align-items:center;">
                <span class="score-chip-dot dot-yellow"></span> 60-79%
              </button>
              <button type="button" class="btn btn-secondary drilldown-chip-btn" data-range="high" onclick="filterDrilldownByScore('high')" style="font-size:11px; padding:4px 8px; font-weight:700; color:var(--green); display:inline-flex; align-items:center;">
                <span class="score-chip-dot dot-green"></span> ≥ 80%
              </button>
            </div>

            <!-- Botões Globais de Expansão -->
            <div style="display:flex; align-items:center; gap:6px;">
              <button type="button" class="btn btn-secondary" onclick="expandAllDrilldown()" style="font-size:11px; padding:5px 10px; font-weight:700;" title="Expandir todas as dimensões e subdimensões">+ Expandir Tudo</button>
              <button type="button" class="btn btn-secondary" onclick="collapseAllDrilldown()" style="font-size:11px; padding:5px 10px; font-weight:700;" title="Recolher todas as dimensões">- Recolher Tudo</button>
            </div>
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
              const critDomId = `drilldownCrit_${crit.id.replace(/\./g, '_')}`;

              html += `
                <div class="drilldown-sub-item" id="${critDomId}" data-score="${critPct !== null ? critPct : ''}">
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

      // =======================================================================
      // PILAR 10: QUADRO DE CONTROLE BIMESTRAL (SEMÁFORO DE PRAZOS POR TURMA)
      // =======================================================================
      const BIMESTERS_CANONICAL = ['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre'];
      const curBim = getCurrentSchoolBimester();
      const curBimNum = parseInt(curBim.match(/([1-4])/)[1], 10);
      
      const viewMode = appState.longitudinalViewMode || (targetType === 'coordenador' ? 'teachers' : 'classes');
      const statusFilter = appState.activeSemaphoreStatusFilter || 'all';

      // 1. Coleta estatística de turmas no escopo
      let semOverdueClassesCount = 0;
      let semInProgressPendingCount = 0;
      let semCompletedCurrentBimCount = 0;
      let semCycleCompletedClassesCount = 0;
      let totalCompletedObsInCycle = 0;

      const classesStatusData = scopedClasses.map(cls => {
        const bimesterStatuses = {};
        let completedCount = 0;
        let hasOverdue = false;
        let hasCurrentPending = false;

        BIMESTERS_CANONICAL.forEach(bName => {
          const st = calculateClassBimesterStatus(cls.name, cls.school, bName);
          bimesterStatuses[bName] = st;
          if (st.status === 'completed') completedCount++;
          if (st.status === 'overdue') hasOverdue = true;
          if (st.status === 'in_progress' && st.bimesterNum === curBimNum) hasCurrentPending = true;
        });

        if (hasOverdue) semOverdueClassesCount++;
        if (hasCurrentPending) semInProgressPendingCount++;
        if (bimesterStatuses[curBim]?.status === 'completed') semCompletedCurrentBimCount++;
        if (completedCount === 4) semCycleCompletedClassesCount++;
        totalCompletedObsInCycle += completedCount;

        const cyclePct = Math.round((completedCount / 4) * 100);

        return {
          classObj: cls,
          bimesterStatuses,
          completedCount,
          cyclePct,
          hasOverdue,
          hasCurrentPending,
          isCompletedCurrent: bimesterStatuses[curBim]?.status === 'completed',
          isCycleCompleted: completedCount === 4
        };
      });

      // Aplica o filtro rápido de status do Semáforo
      const filteredClassesStatusData = classesStatusData.filter(item => {
        if (statusFilter === 'overdue') return item.hasOverdue;
        if (statusFilter === 'in_progress') return item.hasCurrentPending;
        if (statusFilter === 'completed_cur') return item.isCompletedCurrent;
        if (statusFilter === 'completed_all') return item.isCycleCompleted;
        return true;
      });

      const totalAnnualTarget = scopedClasses.length * 4;
      const overallCyclePct = totalAnnualTarget > 0 ? Math.round((totalCompletedObsInCycle / totalAnnualTarget) * 100) : 0;

      // 1.2 Coleta estatística de DOCENTES REGENTES no escopo
      let semOverdueTeachersCount = 0;
      let semInProgressPendingTeachersCount = 0;
      let semCompletedCurrentBimTeachersCount = 0;
      let semCycleCompletedTeachersCount = 0;
      let totalCompletedTeacherObsInCycle = 0;

      const teachersStatusData = scopedAvaliandos.map(member => {
        const bimesterStatuses = {};
        let completedCount = 0;
        let hasOverdue = false;
        let hasCurrentPending = false;

        BIMESTERS_CANONICAL.forEach(bName => {
          const st = calculateTeacherBimesterStatus(member.name, member.school, bName);
          bimesterStatuses[bName] = st;
          if (st.status === 'completed') completedCount++;
          if (st.status === 'overdue') hasOverdue = true;
          if (st.status === 'in_progress' && st.bimesterNum === curBimNum) hasCurrentPending = true;
        });

        if (hasOverdue) semOverdueTeachersCount++;
        if (hasCurrentPending) semInProgressPendingTeachersCount++;
        if (bimesterStatuses[curBim]?.status === 'completed') semCompletedCurrentBimTeachersCount++;
        if (completedCount === 4) semCycleCompletedTeachersCount++;
        totalCompletedTeacherObsInCycle += completedCount;

        const cyclePct = Math.round((completedCount / 4) * 100);

        return {
          member,
          bimesterStatuses,
          completedCount,
          cyclePct,
          hasOverdue,
          hasCurrentPending,
          isCompletedCurrent: bimesterStatuses[curBim]?.status === 'completed',
          isCycleCompleted: completedCount === 4
        };
      });

      const teacherStatusFilter = appState.activeSemaphoreTeacherStatusFilter || 'all';
      const filteredTeachersStatusData = teachersStatusData.filter(item => {
        if (teacherStatusFilter === 'overdue') return item.hasOverdue;
        if (teacherStatusFilter === 'in_progress') return item.hasCurrentPending;
        if (teacherStatusFilter === 'completed_cur') return item.isCompletedCurrent;
        if (teacherStatusFilter === 'completed_all') return item.isCycleCompleted;
        return true;
      });

      const totalTeacherAnnualTarget = scopedAvaliandos.length * 4;
      const overallTeacherCyclePct = totalTeacherAnnualTarget > 0 ? Math.round((totalCompletedTeacherObsInCycle / totalTeacherAnnualTarget) * 100) : 0;

      html += `
        </div>

        <!-- SUB-ABA 3: ACOMPANHAMENTO LONGITUDINAL (QUADRO DE CONTROLE SEMAFÓRICO) -->
        <div id="indicatorsSectionLongitudinal" style="display:${currentSubTab === 'longitudinal' ? 'block' : 'none'};">
          <div class="bimester-semaphore-container" id="bimesterSemaphoreSection">
            
            <!-- Cabeçalho e Alternador de Visão -->
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
                    Quadro de Controle Bimestral
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
      `;

      if (viewMode === 'classes') {
        html += `
            <!-- 4 Micro-cards de Resumo Decisório -->
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
        `;

        if (filteredClassesStatusData.length === 0) {
          html += `
            <div style="text-align:center; padding:32px 16px; color:var(--text-secondary); background:#F8FAFC; border-radius:8px;">
              Nenhuma turma encontrada para o filtro selecionado.
            </div>
          `;
        } else {
          // Renderização da Tabela Matricial (Desktop)
          let tableRows = '';
          let mobileCards = '';

          filteredClassesStatusData.forEach(item => {
            const cls = item.classObj;
            const teachersStr = (cls.teachers && cls.teachers.length > 0) ? cls.teachers.join(', ') : 'Equipe Regente Titular';
            const shiftStr = formatMECShift(cls.shift);

            // Células dos 4 Bimestres (Desktop)
            const bimesterCellsHtml = BIMESTERS_CANONICAL.map(bName => {
              const st = item.bimesterStatuses[bName];
              return `
                <td style="text-align:center; padding:8px 6px;">
                  <div class="sem-status-pill status-${st.status}" onclick="handleSemaphoreCellClick('${cls.name.replace(/'/g, "\\'")}', '${cls.school.replace(/'/g, "\\'")}', '${bName}', ${JSON.stringify(st).replace(/"/g, '&quot;')})" title="Clique para detalhes ou ações imediatas">
                    <div class="pill-top">
                      <span style="display:inline-flex; align-items:center;">
                        ${renderSemaphorePillIconSvg(st.status)}
                        <span>${bName.replace(' Bimestre', 'º')}</span>
                      </span>
                      ${st.score !== null ? `<span style="font-weight:900;">${st.score}%</span>` : ''}
                    </div>
                    <div class="pill-sub">${st.label}</div>
                  </div>
                </td>
              `;
            }).join('');

            // Pílulas para Cards Mobile
            const mobileBimGridHtml = BIMESTERS_CANONICAL.map(bName => {
              const st = item.bimesterStatuses[bName];
              return `
                <div class="sem-status-pill status-${st.status}" onclick="handleSemaphoreCellClick('${cls.name.replace(/'/g, "\\'")}', '${cls.school.replace(/'/g, "\\'")}', '${bName}', ${JSON.stringify(st).replace(/"/g, '&quot;')})">
                  <div class="pill-top">
                    <span style="display:inline-flex; align-items:center;">
                        ${renderSemaphorePillIconSvg(st.status)}
                        <span>${bName.replace(' Bimestre', 'º')}</span>
                      </span>
                    ${st.score !== null ? `<span>${st.score}%</span>` : ''}
                  </div>
                  <div class="pill-sub">${st.label}</div>
                </div>
              `;
            }).join('');

            // Barra de Progresso do Ciclo
            const cycleProgressHtml = `
              <div class="sem-cycle-progress-wrap">
                <div class="sem-cycle-text">
                  <span>${item.completedCount} de 4</span>
                  <span>${item.cyclePct}%</span>
                </div>
                <div class="sem-cycle-bar-bg">
                  <div class="sem-cycle-bar-fill" style="width:${item.cyclePct}%; background:${item.cyclePct === 100 ? '#16A34A' : item.cyclePct >= 50 ? 'var(--primary)' : '#EAB308'};"></div>
                </div>
              </div>
            `;

            // Linha da Tabela Desktop
            tableRows += `
              <tr>
                <td>
                  <strong style="color:var(--text-primary); font-size:13px;">${cls.name}</strong>
                  <div style="font-size:11px; color:var(--text-secondary); margin-top:2px;">
                    <span style="font-weight:700; color:var(--primary);">${shiftStr}</span> · ${teachersStr}
                  </div>
                </td>
                ${bimesterCellsHtml}
                <td>${cycleProgressHtml}</td>
                <td style="text-align:center; white-space:nowrap;">
                  <button type="button" class="btn btn-secondary btn-action-sem" style="font-size:11px; padding:5px 9px; display:inline-flex; align-items:center; gap:4px;" onclick="quickScheduleForClass('${cls.name.replace(/'/g, "\\'")}', '${cls.school.replace(/'/g, "\\'")}', '${getNextEligibleBimesterForClass(cls.name, cls.school)}')">
                    <svg class="btn-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>Agendar</span>
                  </button>
                </td>
              </tr>
            `;

            // Card Mobile
            mobileCards += `
              <div class="sem-mobile-class-card ${item.hasOverdue ? 'has-overdue' : ''}">
                <div class="sem-mobile-card-header">
                  <div>
                    <div class="sem-mobile-class-name">${cls.name}</div>
                    <div class="sem-mobile-class-sub"><span style="font-weight:700; color:var(--primary);">${shiftStr}</span> · ${teachersStr}</div>
                  </div>
                  <div>${cycleProgressHtml}</div>
                </div>
                
                <div class="sem-mobile-bimesters-grid">
                  ${mobileBimGridHtml}
                </div>

                <div style="display:flex; gap:8px; margin-top:8px;">
                  <button type="button" class="btn btn-secondary btn-full btn-action-sem" style="font-size:11px; padding:7px 10px; justify-content:center; display:inline-flex; align-items:center; gap:4px;" onclick="quickScheduleForClass('${cls.name.replace(/'/g, "\\'")}', '${cls.school.replace(/'/g, "\\'")}', '${getNextEligibleBimesterForClass(cls.name, cls.school)}')">
                    <svg class="btn-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>Agendar Próxima Observação</span>
                  </button>
                </div>
              </div>
            `;
          });

          html += `
            <!-- Visão Tabela Desktop -->
            <div class="semaphore-table-view">
              <table class="semaphore-table">
                <thead>
                  <tr>
                    <th>Turma da Educação Infantil</th>
                    <th class="col-bim">1º Bimestre<br><span class="sem-bim-dates" style="font-size:10px; font-weight:normal; opacity:0.8;">${getBimesterPeriodDisplay('1º Bimestre')}</span></th>
                    <th class="col-bim">2º Bimestre<br><span class="sem-bim-dates" style="font-size:10px; font-weight:normal; opacity:0.8;">${getBimesterPeriodDisplay('2º Bimestre')}</span></th>
                    <th class="col-bim">3º Bimestre<br><span class="sem-bim-dates" style="font-size:10px; font-weight:normal; opacity:0.8;">${getBimesterPeriodDisplay('3º Bimestre')}</span></th>
                    <th class="col-bim">4º Bimestre<br><span class="sem-bim-dates" style="font-size:10px; font-weight:normal; opacity:0.8;">${getBimesterPeriodDisplay('4º Bimestre')}</span></th>
                    <th style="width:130px;">Ciclo Anual</th>
                    <th style="width:90px; text-align:center;">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  ${tableRows}
                </tbody>
              </table>
            </div>

            <!-- Visão Cards Mobile -->
            <div class="semaphore-cards-view">
              ${mobileCards}
            </div>
          `;
        }
      } else {
        // =======================================================================
        // PILAR 10: VISÃO DERIVADA POR DOCENTES REGENTES (SEMÁFORO CANÔNICO)
        // =======================================================================
        html += `
          <!-- 4 Micro-cards de Resumo Decisório para Docentes -->
          <div class="semaphore-stats-grid">
            <div class="sem-stat-card ${semOverdueTeachersCount > 0 ? 'alert-card' : ''}">
              <div class="sem-stat-label">
                ${semOverdueTeachersCount > 0 ? `
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
                <span>Docentes em Atraso</span>
              </div>
              <div class="sem-stat-value">${semOverdueTeachersCount}</div>
              <div class="sem-stat-desc">${semOverdueTeachersCount === 0 ? 'Nenhum atraso acumulado' : 'Requer intervenção imediata'}</div>
            </div>

            <div class="sem-stat-card">
              <div class="sem-stat-label">
                <svg class="sem-stat-icon" style="color:#1E40AF;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>Pendentes no ${curBim}</span>
              </div>
              <div class="sem-stat-value">${semInProgressPendingTeachersCount}</div>
              <div class="sem-stat-desc">Dentro do prazo regulamentar</div>
            </div>

            <div class="sem-stat-card">
              <div class="sem-stat-label">
                <svg class="sem-stat-icon" style="color:var(--green);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>Cobertos no ${curBim}</span>
              </div>
              <div class="sem-stat-value">${semCompletedCurrentBimTeachersCount} <span style="font-size:14px; font-weight:700; color:var(--text-secondary);">/ ${scopedAvaliandos.length}</span></div>
              <div class="sem-stat-desc">${scopedAvaliandos.length > 0 ? Math.round((semCompletedCurrentBimTeachersCount / scopedAvaliandos.length) * 100) : 0}% de cobertura docente</div>
            </div>

            <div class="sem-stat-card">
              <div class="sem-stat-label">
                <svg class="sem-stat-icon" style="color:#D97706;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2"></path>
                  <path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2"></path>
                  <path d="M4 22h16"></path>
                  <path d="M10 14.66V17c0 .55-.45 1-1 1H7v2h10v-2h-2c-.55 0-1-.45-1-1v-2.34c3.27-.79 5-3.32 5-6.66V3H4v8c0 3.34 1.73 5.87 5 6.66z"></path>
                </svg>
                <span>Avanço do Ciclo Docente</span>
              </div>
              <div class="sem-stat-value">${overallTeacherCyclePct}%</div>
              <div class="sem-stat-desc">${totalCompletedTeacherObsInCycle} de ${totalTeacherAnnualTarget} observações anuais</div>
            </div>
          </div>

          <!-- Barra de Filtros Rápidos de Status Docente -->
          <div class="semaphore-filters-bar">
            <span class="sem-filter-label">Filtrar:</span>
            <button type="button" class="sem-filter-chip ${teacherStatusFilter === 'all' ? 'active' : ''}" onclick="filterTeacherSemaphoreByStatus('all')">
              Todos (${scopedAvaliandos.length})
            </button>
            <button type="button" class="sem-filter-chip chip-red ${teacherStatusFilter === 'overdue' ? 'active' : ''}" onclick="filterTeacherSemaphoreByStatus('overdue')">
              <svg class="sem-filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span>Com Atraso (${semOverdueTeachersCount})</span>
            </button>
            <button type="button" class="sem-filter-chip ${teacherStatusFilter === 'in_progress' ? 'active' : ''}" onclick="filterTeacherSemaphoreByStatus('in_progress')">
              <svg class="sem-filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>No Prazo (${semInProgressPendingTeachersCount})</span>
            </button>
            <button type="button" class="sem-filter-chip chip-green ${teacherStatusFilter === 'completed_cur' ? 'active' : ''}" onclick="filterTeacherSemaphoreByStatus('completed_cur')">
              <svg class="sem-filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Cobertos (${semCompletedCurrentBimTeachersCount})</span>
            </button>
            <button type="button" class="sem-filter-chip ${teacherStatusFilter === 'completed_all' ? 'active' : ''}" onclick="filterTeacherSemaphoreByStatus('completed_all')">
              <svg class="sem-filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2"></path>
                <path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2"></path>
                <path d="M4 22h16"></path>
                <path d="M10 14.66V17c0 .55-.45 1-1 1H7v2h10v-2h-2c-.55 0-1-.45-1-1v-2.34c3.27-.79 5-3.32 5-6.66V3H4v8c0 3.34 1.73 5.87 5 6.66z"></path>
              </svg>
              <span>Ciclo 100% (${semCycleCompletedTeachersCount})</span>
            </button>
          </div>
        `;

        if (filteredTeachersStatusData.length === 0) {
          html += `
            <div style="text-align:center; padding:32px 16px; color:var(--text-secondary); background:#F8FAFC; border-radius:8px;">
              Nenhum docente regente titular localizado para o filtro selecionado.
            </div>
          `;
        } else {
          // Renderização da Tabela Matricial Semafórica de Docentes (Desktop)
          let teacherTableRows = '';
          let teacherMobileCards = '';

          filteredTeachersStatusData.forEach(item => {
            const member = item.member;
            const targetClass = member.classAssigned || 'Turma Regente';
            const memberSchool = member.school || 'Unidade Escolar';
            const nextBim = getNextEligibleBimesterForTeacher(member.name, memberSchool);

            // Células dos 4 Bimestres (Desktop)
            const bimesterCellsHtml = BIMESTERS_CANONICAL.map(bName => {
              const st = item.bimesterStatuses[bName];
              return `
                <td style="text-align:center; padding:8px 6px;">
                  <div class="sem-status-pill status-${st.status}" onclick="handleTeacherSemaphoreCellClick('${member.name.replace(/'/g, "\\'")}', '${memberSchool.replace(/'/g, "\\'")}', '${bName}', ${JSON.stringify(st).replace(/"/g, '&quot;')})" title="Clique para detalhes ou ações imediatas">
                    <div class="pill-top">
                      <span style="display:inline-flex; align-items:center;">
                        ${renderSemaphorePillIconSvg(st.status)}
                        <span>${bName.replace(' Bimestre', 'º')}</span>
                      </span>
                      ${st.score !== null ? `<span style="font-weight:900;">${st.score}%</span>` : ''}
                    </div>
                    <div class="pill-sub">${st.label}</div>
                  </div>
                </td>
              `;
            }).join('');

            // Pílulas para Cards Mobile
            const mobileBimGridHtml = BIMESTERS_CANONICAL.map(bName => {
              const st = item.bimesterStatuses[bName];
              return `
                <div class="sem-status-pill status-${st.status}" onclick="handleTeacherSemaphoreCellClick('${member.name.replace(/'/g, "\\'")}', '${memberSchool.replace(/'/g, "\\'")}', '${bName}', ${JSON.stringify(st).replace(/"/g, '&quot;')})">
                  <div class="pill-top">
                    <span style="display:inline-flex; align-items:center;">
                        ${renderSemaphorePillIconSvg(st.status)}
                        <span>${bName.replace(' Bimestre', 'º')}</span>
                      </span>
                    ${st.score !== null ? `<span>${st.score}%</span>` : ''}
                  </div>
                  <div class="pill-sub">${st.label}</div>
                </div>
              `;
            }).join('');

            // Barra de Progresso do Ciclo
            const cycleProgressHtml = `
              <div class="sem-cycle-progress-wrap">
                <div class="sem-cycle-text">
                  <span>${item.completedCount} de 4</span>
                  <span>${item.cyclePct}%</span>
                </div>
                <div class="sem-cycle-bar-bg">
                  <div class="sem-cycle-bar-fill" style="width:${item.cyclePct}%; background:${item.cyclePct === 100 ? '#16A34A' : item.cyclePct >= 50 ? 'var(--primary)' : '#EAB308'};"></div>
                </div>
              </div>
            `;

            // Linha da Tabela Desktop
            teacherTableRows += `
              <tr>
                <td>
                  <strong style="color:var(--text-primary); font-size:13px;">${member.name}</strong>
                  <div style="font-size:11px; color:var(--text-secondary); margin-top:2px;">
                    <span style="font-weight:700; color:var(--primary);">${targetClass}</span> · ${memberSchool}
                  </div>
                </td>
                ${bimesterCellsHtml}
                <td>${cycleProgressHtml}</td>
                <td style="text-align:center; white-space:nowrap;">
                  <div style="display:flex; gap:6px; justify-content:center;">
                    <button type="button" class="btn btn-secondary btn-action-sem" style="font-size:11px; padding:5px 9px; display:inline-flex; align-items:center; gap:4px;" onclick="quickScheduleForClass('${targetClass.replace(/'/g, "\\'")}', '${memberSchool.replace(/'/g, "\\'")}', '${nextBim}')" title="Agendar observação para a turma desta docente">
                      <svg class="btn-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      <span>Agendar</span>
                    </button>
                    <button type="button" class="btn btn-secondary btn-action-sem" style="font-size:11px; padding:5px 9px; display:inline-flex; align-items:center; gap:4px;" onclick="selectTeacherForLongitudinalAnalysis('${member.name.replace(/'/g, "\\'")}')" title="Abrir Raio-X individual da docente">
                      <svg class="btn-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                      <span>Raio-X</span>
                    </button>
                  </div>
                </td>
              </tr>
            `;

            // Card Mobile
            teacherMobileCards += `
              <div class="sem-mobile-class-card ${item.hasOverdue ? 'has-overdue' : ''}">
                <div class="sem-mobile-card-header">
                  <div>
                    <div class="sem-mobile-class-name">${member.name}</div>
                    <div class="sem-mobile-class-sub"><span style="font-weight:700; color:var(--primary);">${targetClass}</span> · ${memberSchool}</div>
                  </div>
                  <div>${cycleProgressHtml}</div>
                </div>

                <div class="sem-mobile-bimesters-grid">
                  ${mobileBimGridHtml}
                </div>

                <div style="display:flex; gap:8px; margin-top:8px;">
                  <button type="button" class="btn btn-secondary btn-full btn-action-sem" style="font-size:11px; padding:7px 10px; justify-content:center; display:inline-flex; align-items:center; gap:4px;" onclick="quickScheduleForClass('${targetClass.replace(/'/g, "\\'")}', '${memberSchool.replace(/'/g, "\\'")}', '${nextBim}')">
                    <svg class="btn-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>Agendar Turma</span>
                  </button>
                  <button type="button" class="btn btn-secondary btn-full btn-action-sem" style="font-size:11px; padding:7px 10px; justify-content:center; display:inline-flex; align-items:center; gap:4px;" onclick="selectTeacherForLongitudinalAnalysis('${member.name.replace(/'/g, "\\'")}')">
                    <svg class="btn-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <span>Raio-X Item a Item</span>
                  </button>
                </div>
              </div>
            `;
          });

          html += `
            <!-- Visão Tabela Desktop para Docentes -->
            <div class="semaphore-table-view">
              <table class="semaphore-table">
                <thead>
                  <tr>
                    <th>Docente Regente Titular</th>
                    <th class="col-bim">1º Bimestre<br><span class="sem-bim-dates" style="font-size:10px; font-weight:normal; opacity:0.8;">${getBimesterPeriodDisplay('1º Bimestre')}</span></th>
                    <th class="col-bim">2º Bimestre<br><span class="sem-bim-dates" style="font-size:10px; font-weight:normal; opacity:0.8;">${getBimesterPeriodDisplay('2º Bimestre')}</span></th>
                    <th class="col-bim">3º Bimestre<br><span class="sem-bim-dates" style="font-size:10px; font-weight:normal; opacity:0.8;">${getBimesterPeriodDisplay('3º Bimestre')}</span></th>
                    <th class="col-bim">4º Bimestre<br><span class="sem-bim-dates" style="font-size:10px; font-weight:normal; opacity:0.8;">${getBimesterPeriodDisplay('4º Bimestre')}</span></th>
                    <th style="width:130px;">Ciclo Anual</th>
                    <th style="width:140px; text-align:center;">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  ${teacherTableRows}
                </tbody>
              </table>
            </div>

            <!-- Visão Cards Mobile para Docentes -->
            <div class="semaphore-cards-view">
              ${teacherMobileCards}
            </div>
          `;
        }
      }

      html += `
          </div>
        </div>
      `;

      container.innerHTML = html;
      syncIndicatorsFilterUI();
      // PILAR 9: Atualiza o badge compacto do botão flutuante mobile
      updateMobileIndicatorsActiveBadge();
    }

    // =========================================================================
    // ROTINAS DE EXTRAÇÃO E EXPORTAÇÃO (PDF & CSV) DO PROFESSOR ESPECÍFICO
    // =========================================================================

    function exportCurrentIndicatorsView() {
      const memberSelect = document.getElementById('indicatorsMemberFilter');
      const activeMember = (memberSelect && memberSelect.value) ? memberSelect.value : 'ALL';

      if (activeMember !== 'ALL') {
        exportTeacherLongitudinalPDF(activeMember);
      } else {
        window.print();
      }
    }

    function exportTeacherLongitudinalPDF(teacherName) {
      const targetTypeSelect = document.getElementById('indicatorsTargetTypeFilter');
      const targetType = targetTypeSelect ? targetTypeSelect.value : 'professora';
      const user = getCurrentUser();

      const member = (appState.teamMembers || []).find(m => m.name === teacherName) || { name: teacherName };
      const memberObs = getScopedObservations().filter(o => {
        if (o.status !== 'finalized' && o.status !== 'concluida') return false;
        const matchesType = targetType === 'coordenador' 
          ? o.evaluatedType === 'coordenador' 
          : (o.evaluatedType === 'professora' || o.evaluatedType === 'turma');
        if (!matchesType) return false;
        return o.teacherName === teacherName || (o.teachers && o.teachers.includes(teacherName)) || (o.teacherName && o.teacherName.includes(teacherName));
      });
      memberObs.sort((a, b) => (a.date || '').localeCompare(b.date || ''));

      const memberSchool = member.school || (memberObs[0]?.schoolName) || 'Não informada';
      const memberRole = member.roleTitle || (targetType === 'coordenador' ? 'Coordenação Pedagógica' : 'Professor(a) de Educação Infantil');
      const memberClass = member.classAssigned || (memberObs[0]?.className) || 'Educação Infantil';
      const memberSupervisor = member.supervisor || (memberObs[0]?.evaluatedBy) || user.name;

      const activeSections = targetType === 'coordenador' 
        ? (appState.activeSectionsCoordinator || DEFAULT_SECTIONS_COORDINATOR)
        : (appState.activeSectionsTeacher || DEFAULT_SECTIONS_TEACHER);

      const bimesters = ['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre'];

      const printContainer = document.getElementById('teacherLongitudinalPrintSection');
      if (!printContainer) return;

      const todayStr = new Date().toLocaleDateString('pt-BR');

      let printHtml = `
        <div style="border-bottom: 2px solid #004C99; padding-bottom: 12px; margin-bottom: 20px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <h2 style="color:#004C99; font-size:18pt; font-weight:800; margin:0;">PROJETO SERTÃO CRIANÇA</h2>
              <p style="font-size:11pt; color:#334155; font-weight:600; margin:2px 0 0 0;">Supervisão e Acompanhamento Formativo em Educação Infantil</p>
            </div>
            <div style="text-align:right; font-size:9pt; color:#64748B;">
              <strong>Ficha de Acompanhamento Longitudinal Individual</strong><br>
              Emissão: ${todayStr}
            </div>
          </div>
        </div>

        <!-- Dossiê do Profissional -->
        <div style="border:1px solid #CBD5E1; border-radius:6px; padding:12px; margin-bottom:20px; background:#F8FAFC;">
          <table style="width:100%; font-size:10pt; border-collapse:collapse;">
            <tr>
              <td style="padding:4px 8px; width:50%;"><strong>Profissional:</strong> ${teacherName}</td>
              <td style="padding:4px 8px; width:50%;"><strong>Função / Cargo:</strong> ${memberRole}</td>
            </tr>
            <tr>
              <td style="padding:4px 8px;"><strong>Unidade Escolar:</strong> ${memberSchool}</td>
              <td style="padding:4px 8px;"><strong>Turma / Atuação:</strong> ${memberClass}</td>
            </tr>
            <tr>
              <td style="padding:4px 8px;"><strong>Supervisor(a) Formador(a):</strong> ${memberSupervisor}</td>
              <td style="padding:4px 8px;"><strong>Observações Finalizadas:</strong> ${memberObs.length} de 4 bimestres</td>
            </tr>
          </table>
        </div>

        <h3 style="font-size:13pt; font-weight:800; color:#1E293B; margin-bottom:10px; text-transform:uppercase;">
          Matriz de Evolução Pedagógica Item a Item
        </h3>
      `;

      activeSections.forEach((sec, sIdx) => {
        printHtml += `
          <div style="margin-bottom:18px; page-break-inside:avoid;">
            <div style="font-size:11pt; font-weight:800; color:#004C99; border-bottom:1.5px solid #CBD5E1; padding-bottom:4px; margin-bottom:8px;">
              ${sIdx + 1}. ${(sec.title || '').replace(/^Dimens[aã]o\s*\d*\s*[:\.\-]?\s*/i, '').trim()}
            </div>
        `;

        sec.subSections.forEach((sub) => {
          printHtml += `
            <div style="margin-bottom:12px; page-break-inside:avoid;">
              <div style="font-size:10pt; font-weight:700; color:#334155; margin-bottom:6px; background:#F1F5F9; padding:4px 8px;">
                ${sub.id} ${(sub.title || '').replace(/^Subdimens[aã]o\s*[\d\.]*\s*[:\.\-]?\s*/i, '').trim()}
              </div>

              <table class="teacher-print-table">
                <thead>
                  <tr>
                    <th style="width:45%;">Critério</th>
                    <th style="width:11%; text-align:center;">1º Bim</th>
                    <th style="width:11%; text-align:center;">2º Bim</th>
                    <th style="width:11%; text-align:center;">3º Bim</th>
                    <th style="width:11%; text-align:center;">4º Bim</th>
                    <th style="width:11%; text-align:center;">Tendência</th>
                  </tr>
                </thead>
                <tbody>
          `;

          sub.criteria.forEach((crit) => {
            const responsesByBim = {};
            const commentsByBim = [];

            bimesters.forEach(bim => {
              const obs = memberObs.find(o => o.bimester === bim);
              if (obs) {
                const r = obs.responses ? obs.responses[crit.id] : null;
                if (r) responsesByBim[bim] = r;

                const cText = (obs.criterionComments && obs.criterionComments[crit.id]) || (obs.notes && obs.notes[crit.id]);
                if (cText && cText.trim() !== '') {
                  commentsByBim.push({
                    bimester: bim,
                    comment: cText.trim()
                  });
                }
              }
            });

            const trend = calculateCriterionTrend(responsesByBim);

            const formatPrintStatus = (r) => {
              if (!r) return '—';
              if (r === 'consistent') return '<strong style="color:#166534;">Consistente</strong>';
              if (r === 'partial') return '<strong style="color:#B45309;">Parcial</strong>';
              if (r === 'not_done') return '<strong style="color:#991B1B;">Não Realiz.</strong>';
              if (r === 'na') return '<span style="color:#64748B;">N/A</span>';
              return '—';
            };

            printHtml += `
              <tr style="page-break-inside:avoid;">
                <td style="padding:5px 6px;">
                  <strong>[${crit.id}]</strong> ${crit.text}
                  ${commentsByBim.length > 0 ? `
                    <div style="font-size:8.5pt; color:#475569; font-style:italic; margin-top:3px;">
                      ${commentsByBim.map(cb => `● ${cb.bimester}: "${cb.comment}"`).join(' ')}
                    </div>
                  ` : ''}
                </td>
                <td style="text-align:center;">${formatPrintStatus(responsesByBim['1º Bimestre'])}</td>
                <td style="text-align:center;">${formatPrintStatus(responsesByBim['2º Bimestre'])}</td>
                <td style="text-align:center;">${formatPrintStatus(responsesByBim['3º Bimestre'])}</td>
                <td style="text-align:center;">${formatPrintStatus(responsesByBim['4º Bimestre'])}</td>
                <td style="text-align:center; font-weight:700; font-size:9pt;">${trend.icon} ${trend.text}</td>
              </tr>
            `;
          });

          printHtml += `
                </tbody>
              </table>
            </div>
          `;
        });

        printHtml += `</div>`;
      });

      // Assinaturas Formais
      printHtml += `
        <div class="print-signatures-box" style="margin-top:40px; page-break-inside:avoid;">
          <div class="print-signature-line">
            Assinatura do(a) Profissional Avaliado(a)<br>
            <span style="font-size:9pt; font-weight:normal; color:#475569;">${teacherName}</span>
          </div>
          <div class="print-signature-line">
            Assinatura do(a) Supervisor(a) Pedagógico(a)<br>
            <span style="font-size:9pt; font-weight:normal; color:#475569;">${memberSupervisor}</span>
          </div>
        </div>
      `;

      printContainer.innerHTML = printHtml;

      // Dispara Impressão Isolada
      document.body.classList.add('printing-teacher-longitudinal');
      setTimeout(() => {
        window.print();
        setTimeout(() => {
          document.body.classList.remove('printing-teacher-longitudinal');
        }, 1000);
      }, 150);
    }

    function exportTeacherLongitudinalCSV(teacherName) {
      const targetTypeSelect = document.getElementById('indicatorsTargetTypeFilter');
      const targetType = targetTypeSelect ? targetTypeSelect.value : 'professora';

      const memberObs = getScopedObservations().filter(o => {
        if (o.status !== 'finalized' && o.status !== 'concluida') return false;
        const matchesType = targetType === 'coordenador' 
          ? o.evaluatedType === 'coordenador' 
          : (o.evaluatedType === 'professora' || o.evaluatedType === 'turma');
        if (!matchesType) return false;
        return o.teacherName === teacherName || (o.teachers && o.teachers.includes(teacherName)) || (o.teacherName && o.teacherName.includes(teacherName));
      });
      memberObs.sort((a, b) => (a.date || '').localeCompare(b.date || ''));

      const activeSections = targetType === 'coordenador' 
        ? (appState.activeSectionsCoordinator || DEFAULT_SECTIONS_COORDINATOR)
        : (appState.activeSectionsTeacher || DEFAULT_SECTIONS_TEACHER);

      const bimesters = ['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre'];

      const headers = [
        "Dimensao",
        "Subdimensao",
        "Codigo_Item",
        "Descricao_Item",
        "1_Bimestre",
        "Data_Bim1",
        "2_Bimestre",
        "Data_Bim2",
        "3_Bimestre",
        "Data_Bim3",
        "4_Bimestre",
        "Data_Bim4",
        "Variacao_Tendencia",
        "Comentarios_Supervisao"
      ];

      const rows = [];

      activeSections.forEach(sec => {
        sec.subSections.forEach(sub => {
          sub.criteria.forEach(crit => {
            const responsesByBim = {};
            const datesByBim = {};
            const commentsList = [];

            bimesters.forEach(bim => {
              const obs = memberObs.find(o => o.bimester === bim);
              if (obs) {
                const r = obs.responses ? obs.responses[crit.id] : null;
                responsesByBim[bim] = r || 'Pendente';
                datesByBim[bim] = obs.date || '';

                const cText = (obs.criterionComments && obs.criterionComments[crit.id]) || (obs.notes && obs.notes[crit.id]);
                if (cText && cText.trim() !== '') {
                  commentsList.push(`[${bim}]: ${cText.trim().replace(/"/g, '""')}`);
                }
              } else {
                responsesByBim[bim] = 'Pendente';
                datesByBim[bim] = '';
              }
            });

            const trend = calculateCriterionTrend(responsesByBim);

            const translateStatus = (st) => {
              if (st === 'consistent') return 'Consistente';
              if (st === 'partial') return 'Parcial';
              if (st === 'not_done') return 'Nao Realizado';
              if (st === 'na') return 'Nao se Aplica';
              return 'Pendente';
            };

            rows.push([
              `"${sec.title.replace(/"/g, '""')}"`,
              `"${sub.title.replace(/"/g, '""')}"`,
              `"${crit.id}"`,
              `"${crit.text.replace(/"/g, '""')}"`,
              `"${translateStatus(responsesByBim['1º Bimestre'])}"`,
              `"${datesByBim['1º Bimestre']}"`,
              `"${translateStatus(responsesByBim['2º Bimestre'])}"`,
              `"${datesByBim['2º Bimestre']}"`,
              `"${translateStatus(responsesByBim['3º Bimestre'])}"`,
              `"${datesByBim['3º Bimestre']}"`,
              `"${translateStatus(responsesByBim['4º Bimestre'])}"`,
              `"${datesByBim['4º Bimestre']}"`,
              `"${trend.text}"`,
              `"${commentsList.join(' | ')}"`
            ]);
          });
        });
      });

      // UTF-8 BOM (\uFEFF) para garantir compatibilidade imediata com Microsoft Excel
      const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\r\n');
      const safeName = teacherName.toLowerCase().replace(/[^a-z0-9]/gi, '_');
      const fileName = `longitudinal_${safeName}_${getTodayDateString()}.csv`;

      downloadFile(csvContent, fileName, 'text/csv;charset=utf-8;');
      showToast(`Extração longitudinal de ${teacherName} gerada com sucesso!`);
    }

    // =========================================================================
    // ARMAZENAMENTO AUTÔNOMO DE DOCUMENTOS PDF EM INDEXEDDB (PDFStorage)
    // =========================================================================
    const PDFStorage = {
      dbName: 'SertaoCriancaDocsDB',
      storeName: 'customPdfs',
      _dbPromise: null,

      _open() {
        if (this._dbPromise) return this._dbPromise;
        this._dbPromise = new Promise((resolve, reject) => {
          if (!window.indexedDB) {
            console.warn("IndexedDB não suportado neste navegador.");
            return resolve(null);
          }
          const req = indexedDB.open(this.dbName, 1);
          req.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(this.storeName)) {
              db.createObjectStore(this.storeName, { keyPath: 'id' });
            }
          };
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => {
            console.error("Erro ao abrir IndexedDB:", req.error);
            resolve(null);
          };
        });
        return this._dbPromise;
      },

      async savePDF(id, file) {
        const db = await this._open();
        if (!db) throw new Error("Armazenamento IndexedDB não disponível.");
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const tx = db.transaction(this.storeName, 'readwrite');
              const store = tx.objectStore(this.storeName);
              const record = {
                id: id,
                fileName: file.name,
                fileSize: file.size,
                mimeType: file.type || 'application/pdf',
                updatedAt: new Date().toISOString(),
                data: reader.result // ArrayBuffer
              };
              store.put(record);
              tx.oncomplete = () => resolve(record);
              tx.onerror = () => reject(tx.error);
            } catch (err) {
              reject(err);
            }
          };
          reader.onerror = () => reject(reader.error);
          reader.readAsArrayBuffer(file);
        });
      },

      async getPDF(id) {
        const db = await this._open();
        if (!db) return null;
        return new Promise((resolve) => {
          try {
            const tx = db.transaction(this.storeName, 'readonly');
            const store = tx.objectStore(this.storeName);
            const req = store.get(id);
            req.onsuccess = () => resolve(req.result || null);
            req.onerror = () => resolve(null);
          } catch (err) {
            resolve(null);
          }
        });
      },

      async removePDF(id) {
        const db = await this._open();
        if (!db) return;
        return new Promise((resolve) => {
          try {
            const tx = db.transaction(this.storeName, 'readwrite');
            const store = tx.objectStore(this.storeName);
            const req = store.delete(id);
            req.onsuccess = () => resolve();
            req.onerror = () => resolve();
          } catch (err) {
            resolve();
          }
        });
      }
    };

    function triggerPDFUpload(matrixType) {
      if (!window.isRubricsEditMode) {
        if (!confirm("O Modo de Edição está desativado. Deseja habilitar o Modo de Edição para enviar um novo PDF da matriz?")) {
          return;
        }
        const chk = document.getElementById('toggleRubricsEditMode');
        if (chk) { chk.checked = true; toggleRubricsEditMode(true); }
      }
      const inputId = matrixType === 'coordinator' ? 'uploadPdfCoordinatorInput' : 'uploadPdfTeacherInput';
      const input = document.getElementById(inputId);
      if (input) input.click();
    }

    async function handlePDFUpload(matrixType, inputEl) {
      const file = inputEl.files && inputEl.files[0];
      if (!file) return;

      if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
        alert("Por favor, selecione exclusivamente um arquivo no formato PDF (.pdf).");
        inputEl.value = '';
        return;
      }

      const label = matrixType === 'coordinator' ? 'Matriz de Coordenadores' : 'Matriz de Professores';
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      
      const msg = `Tem certeza que deseja substituir o documento oficial da ${label} pelo arquivo:\n\n📄 "${file.name}" (${sizeMB} MB)?\n\nEste arquivo passará a ser servido a todos os usuários da rede.`;
      if (!confirm(msg)) {
        inputEl.value = '';
        return;
      }

      try {
        await PDFStorage.savePDF(matrixType, file);
        showToast(`PDF da ${label} atualizado com sucesso!`);
        await updateRefDocsUI();
      } catch (err) {
        console.error("Erro ao salvar PDF:", err);
        alert("Não foi possível salvar o arquivo PDF localmente: " + err.message);
      }
      inputEl.value = '';
    }

    async function restoreDefaultPDF(matrixType) {
      const label = matrixType === 'coordinator' ? 'Matriz de Coordenadores' : 'Matriz de Professores';
      if (!confirm(`Tem certeza que deseja remover a versão personalizada da ${label} e restaurar o PDF original de fábrica?`)) {
        return;
      }
      try {
        await PDFStorage.removePDF(matrixType);
        showToast(`PDF da ${label} restaurado para o original de fábrica.`);
        await updateRefDocsUI();
      } catch (err) {
        console.error("Erro ao remover PDF:", err);
      }
    }

    async function openOrDownloadPDF(matrixType, isDownload = false) {
      try {
        const custom = await PDFStorage.getPDF(matrixType);
        if (custom && custom.data) {
          const blob = new Blob([custom.data], { type: custom.mimeType || 'application/pdf' });
          const url = URL.createObjectURL(blob);
          if (isDownload) {
            const a = document.createElement('a');
            a.href = url;
            a.download = custom.fileName || `matriz_${matrixType}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 2000);
          } else {
            window.open(url, '_blank');
          }
          return;
        }
      } catch (err) {
        console.warn("Fallback para PDF original de fábrica:", err);
      }

      // Fallback para documentos estáticos originais
      const defaultPath = matrixType === 'coordinator' ? 'docs/matriz_coordenadores.pdf' : 'docs/matriz_professores.pdf';
      const defaultFileName = matrixType === 'coordinator' ? 'matriz_coordenadores.pdf' : 'matriz_professores.pdf';
      if (isDownload) {
        const a = document.createElement('a');
        a.href = defaultPath;
        a.download = defaultFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        window.open(defaultPath, '_blank');
      }
    }

    async function updateRefDocsUI() {
      try {
        // Teacher
        const teacherDoc = await PDFStorage.getPDF('teacher');
        ['pdfTeacherMetaBadge', 'pdfTeacherMetaBadgeTab'].forEach(id => {
          const el = document.getElementById(id);
          if (el) {
            el.style.display = teacherDoc ? 'inline-flex' : 'none';
            if (teacherDoc) el.innerHTML = '<svg class="btn-icon-sm" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Atualizado pelo Município';
          }
        });
        ['pdfTeacherInfo', 'pdfTeacherInfoTab'].forEach(id => {
          const el = document.getElementById(id);
          if (el) {
            if (teacherDoc) {
              const dt = formatDateBR(teacherDoc.updatedAt.substring(0, 10));
              const sz = (teacherDoc.fileSize / 1024).toFixed(0);
              el.innerText = `${teacherDoc.fileName} · ${sz} KB · Atualizado em ${dt}`;
            } else {
              el.innerText = 'PDF de Fábrica · 925 KB';
            }
          }
        });
        ['btnRestorePdfTeacher', 'btnRestorePdfTeacherTab'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.style.display = teacherDoc ? 'inline-block' : 'none';
        });

        // Coordinator
        const coordDoc = await PDFStorage.getPDF('coordinator');
        ['pdfCoordinatorMetaBadge', 'pdfCoordinatorMetaBadgeTab'].forEach(id => {
          const el = document.getElementById(id);
          if (el) {
            el.style.display = coordDoc ? 'inline-flex' : 'none';
            if (coordDoc) el.innerHTML = '<svg class="btn-icon-sm" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Atualizado pelo Município';
          }
        });
        ['pdfCoordinatorInfo', 'pdfCoordinatorInfoTab'].forEach(id => {
          const el = document.getElementById(id);
          if (el) {
            if (coordDoc) {
              const dt = formatDateBR(coordDoc.updatedAt.substring(0, 10));
              const sz = (coordDoc.fileSize / 1024).toFixed(0);
              el.innerText = `${coordDoc.fileName} · ${sz} KB · Atualizado em ${dt}`;
            } else {
              el.innerText = 'PDF de Fábrica · 170 KB';
            }
          }
        });
        ['btnRestorePdfCoordinator', 'btnRestorePdfCoordinatorTab'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.style.display = coordDoc ? 'inline-block' : 'none';
        });

        // Atualiza preview se ativo
        const previewContainer = document.getElementById('refDocsPreviewContainer');
        if (previewContainer && previewContainer.style.display !== 'none' && window.activePreviewMatrixType) {
          previewPDFInTab(window.activePreviewMatrixType, false);
        }
      } catch (err) {
        console.warn("Erro ao atualizar interface de documentos de referência:", err);
      }
    }

    // Controles e visualização da aba de Matrizes de Referência
    window.activePreviewMatrixType = 'teacher';

    async function previewPDFInTab(matrixType, autoScroll = true) {
      const container = document.getElementById('refDocsPreviewContainer');
      const frame = document.getElementById('refDocsViewerFrame');
      const title = document.getElementById('refDocsPreviewTitle');
      if (!container || !frame) return;

      window.activePreviewMatrixType = matrixType;
      container.style.display = 'block';

      if (title) {
        title.innerHTML = matrixType === 'coordinator' 
          ? '<strong>Visualização:</strong> Instrumento de Acompanhamento das Observações Pedagógicas (Coordenadores)'
          : '<strong>Visualização:</strong> Matriz de Observação da Prática Docente (Professores)';
      }

      try {
        const custom = await PDFStorage.getPDF(matrixType);
        if (custom && custom.data) {
          const blob = new Blob([custom.data], { type: custom.mimeType || 'application/pdf' });
          const url = URL.createObjectURL(blob);
          frame.src = url;
          if (autoScroll) {
            setTimeout(() => {
              container.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
          }
          return;
        }
      } catch (err) {
        console.warn("Fallback preview:", err);
      }

      const defaultPath = matrixType === 'coordinator' ? 'docs/matriz_coordenadores.pdf' : 'docs/matriz_professores.pdf';
      frame.src = defaultPath;
      if (autoScroll) {
        setTimeout(() => {
          container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }

    function togglePreviewDocument() {
      const nextType = window.activePreviewMatrixType === 'coordinator' ? 'teacher' : 'coordinator';
      previewPDFInTab(nextType);
    }

    function closePDFPreviewInTab() {
      const container = document.getElementById('refDocsPreviewContainer');
      const frame = document.getElementById('refDocsViewerFrame');
      if (container) container.style.display = 'none';
      if (frame) frame.src = 'about:blank';
    }

    function triggerPDFUploadTab(matrixType) {
      if (!window.isRubricsEditMode) {
        if (!confirm("O Modo de Edição está desativado. Deseja habilitar o Modo de Edição para enviar um novo PDF da matriz?")) {
          return;
        }
        const chk = document.getElementById('toggleRubricsEditMode');
        if (chk) { chk.checked = true; toggleRubricsEditMode(true); }
      }
      const inputId = matrixType === 'coordinator' ? 'uploadPdfCoordinatorInputTab' : 'uploadPdfTeacherInputTab';
      const input = document.getElementById(inputId) || document.getElementById(matrixType === 'coordinator' ? 'uploadPdfCoordinatorInput' : 'uploadPdfTeacherInput');
      if (input) input.click();
    }

    function renderRefDocsScreen() {
      if (typeof updateRefDocsUI === 'function') {
        updateRefDocsUI();
      }
    }

    // =========================================================================
    // GESTÃO AUTÔNOMA DE RUBRICAS (CRUD COMPLETO, TRAVA E PERSISTÊNCIA SSOT)
    // =========================================================================
    window.isRubricsEditMode = false;

    function toggleRubricsEditMode(checked) {
      window.isRubricsEditMode = checked;
      
      const banner = document.getElementById('rubricEditModeBanner');
      const title = document.getElementById('rubricModeStatusTitle');
      const desc = document.getElementById('rubricModeStatusDesc');
      const topBar = document.getElementById('rubricsEditTopBar');

      if (checked) {
        if (banner) {
          banner.className = 'rubric-mode-active';
        }
        if (title) {
          title.style.color = '#B45309';
          title.innerHTML = '⚠️ Modo de Edição Ativo: Gestão Estrutural Habilitada';
        }
        if (desc) {
          desc.innerHTML = 'Você pode <strong>adicionar ou excluir dimensões</strong>, <strong>editar títulos</strong> e <strong>incluir novos critérios</strong>. Todas as ações gravam no SSOT municipal após sua confirmação prévia.';
        }
        if (topBar) topBar.style.display = 'flex';
      } else {
        if (banner) {
          banner.className = 'rubric-mode-locked';
        }
        if (title) {
          title.style.color = '#334155';
          title.innerHTML = '🔒 Modo de Leitura Seguro: Alterações Estruturais Travadas';
        }
        if (desc) {
          desc.innerHTML = 'Para adicionar novos itens, incluir ou excluir dimensões, renomear títulos ou definir novos padrões oficiais, ative a chave ao lado. O sistema foi blindado para operação autônoma sem necessidade de suporte técnico, exigindo confirmações prévias de segurança.';
        }
        if (topBar) topBar.style.display = 'none';
      }

      renderRubricsAdminScreen();
    }

    function syncRubricMatrixSelect(val) {
      const s1 = document.getElementById('rubricMatrixSelect');
      const s2 = document.getElementById('rubricMatrixSelectExports');
      if (s1 && s1.value !== val) s1.value = val;
      if (s2 && s2.value !== val) s2.value = val;
      
      const lbl = document.getElementById('rubricsEditMatrixLabel');
      if (lbl) lbl.innerText = val === 'coordinator' ? 'Coordenadores' : 'Professores';

      if (document.getElementById('screenRubricsAdmin')?.classList.contains('active')) {
        renderRubricsAdminScreen();
      }
    }

    function getActiveMatrixSections(matrixType) {
      if (matrixType === 'coordinator') {
        if (!appState.activeSectionsCoordinator) {
          appState.activeSectionsCoordinator = appState.customDefaultCoordinator 
            ? JSON.parse(JSON.stringify(appState.customDefaultCoordinator)) 
            : JSON.parse(JSON.stringify(DEFAULT_SECTIONS_COORDINATOR));
        }
        return appState.activeSectionsCoordinator;
      } else {
        if (!appState.activeSectionsTeacher) {
          appState.activeSectionsTeacher = appState.customDefaultTeacher 
            ? JSON.parse(JSON.stringify(appState.customDefaultTeacher)) 
            : JSON.parse(JSON.stringify(DEFAULT_SECTIONS_TEACHER));
        }
        return appState.activeSectionsTeacher;
      }
    }

    function renderRubricsAdminScreen() {
      const container = document.getElementById('rubricsEditContainer') || document.getElementById('opRubricsContainer');
      if (!container) return;
      container.innerHTML = '';

      const matrixType = document.getElementById('rubricMatrixSelect') ? document.getElementById('rubricMatrixSelect').value : 'teacher';
      const sections = getActiveMatrixSections(matrixType);
      const isEdit = window.isRubricsEditMode;

      const lbl = document.getElementById('rubricsEditMatrixLabel');
      if (lbl) lbl.innerText = matrixType === 'coordinator' ? 'Coordenadores' : 'Professores';

      if (!sections || sections.length === 0) {
        container.innerHTML = `
          <div class="card" style="text-align:center; padding:30px; color:var(--text-secondary);">
            <div style="font-size:32px; margin-bottom:10px;">📋</div>
            <div style="font-weight:700; font-size:15px;">Nenhuma dimensão cadastrada nesta matriz.</div>
            ${isEdit ? `
              <button class="btn btn-primary" onclick="promptAddDimension()" style="margin-top:14px;">
                ➕ Criar Primeira Dimensão
              </button>
            ` : ''}
          </div>
        `;
        return;
      }

      sections.forEach((sec, sIdx) => {
        const secCard = document.createElement('div');
        secCard.className = 'card';
        secCard.style.marginBottom = '20px';

        let html = `
          <div class="rubric-dim-header">
            <div class="rubric-dim-title">
              <span>${sIdx + 1}. ${(sec.title || '').replace(/^Dimens[aã]o\s*\d*\s*[:\.\-]?\s*/i, '').trim()}</span>
            </div>
            ${isEdit ? `
              <div class="rubric-action-btn-group">
                <button class="btn btn-secondary" onclick="promptAddDimension(${sIdx})" style="padding:4px 8px; font-size:11px; background:#F8FAFC;" title="Inserir nova dimensão antes desta (à frente)">
                  ➕ Inserir Antes
                </button>
                <button class="btn btn-secondary" onclick="promptEditDimensionTitle('${matrixType}', ${sIdx})" style="padding:4px 8px; font-size:11px;" title="Editar título da dimensão">
                  ✏️ Renomear
                </button>
                <button class="btn btn-secondary" onclick="promptAddSubSection('${matrixType}', ${sIdx})" style="padding:4px 8px; font-size:11px;" title="Adicionar subseção ou grupo a esta dimensão">
                  ➕ Subdimensão
                </button>
                <button class="btn btn-secondary" onclick="promptAddCriterion('${matrixType}', ${sIdx}, 0)" style="padding:4px 8px; font-size:11px; background:#EFF6FF; color:var(--primary);" title="Adicionar novo item ao final desta dimensão">
                  ➕ Adicionar Item
                </button>
                <button class="btn btn-secondary" onclick="confirmDeleteDimension('${matrixType}', ${sIdx})" style="padding:4px 8px; font-size:11px; color:#DC2626;" title="Excluir esta dimensão da matriz">
                  🗑️ Excluir
                </button>
              </div>
            ` : ''}
          </div>
        `;

        if (!sec.subSections || sec.subSections.length === 0) {
          sec.subSections = [{ id: `${sIdx + 1}.1`, title: 'Geral', criteria: [] }];
        }

        sec.subSections.forEach((sub, subIdx) => {
          html += `
            <div class="rubric-sub-header">
              <div style="font-size:13px; font-weight:700; color:var(--text-secondary);">
                ${sub.id} ${(sub.title || '').replace(/^Subdimens[aã]o\s*[\d\.]*\s*[:\.\-]?\s*/i, '').trim()}
              </div>
              ${isEdit ? `
                <div class="rubric-action-btn-group">
                  <button class="btn btn-secondary" onclick="promptAddSubSection('${matrixType}', ${sIdx}, ${subIdx})" style="padding:2px 6px; font-size:10px; background:#F8FAFC;" title="Inserir subdimensão antes desta">
                    ➕ Inserir Antes
                  </button>
                  <button class="btn btn-secondary" onclick="promptEditSubSectionTitle('${matrixType}', ${sIdx}, ${subIdx})" style="padding:2px 6px; font-size:10px;" title="Renomear subdimensão">
                    ✏️ Renomear
                  </button>
                  <button class="btn btn-secondary" onclick="promptAddCriterion('${matrixType}', ${sIdx}, ${subIdx})" style="padding:2px 8px; font-size:10px; background:#EFF6FF; color:var(--primary);" title="Adicionar novo critério nesta subdimensão">
                    ➕ Novo Item
                  </button>
                  ${sec.subSections.length > 1 ? `
                    <button class="btn btn-secondary" onclick="confirmDeleteSubSection('${matrixType}', ${sIdx}, ${subIdx})" style="padding:2px 6px; font-size:10px; color:#DC2626;" title="Excluir subdimensão">
                      🗑️
                    </button>
                  ` : ''}
                </div>
              ` : ''}
            </div>
          `;

          if (!sub.criteria || sub.criteria.length === 0) {
            html += `
              <div style="padding:10px; font-size:12px; color:var(--text-secondary); font-style:italic; background:#F8FAFC; border-radius:6px; margin-bottom:10px;">
                Nenhum critério nesta subseção. ${isEdit ? `<a href="javascript:void(0)" onclick="promptAddCriterion('${matrixType}', ${sIdx}, ${subIdx})">+ Clique aqui para adicionar um item</a>` : ''}
              </div>
            `;
          }

          sub.criteria.forEach((crit, cIdx) => {
            const disabledAttr = isEdit ? '' : 'disabled';
            const bgStyle = isEdit ? '#FFFFFF' : '#F1F5F9';
            html += `
              <div class="rubric-crit-box">
                <div class="rubric-crit-header">
                  <div style="font-size:11px; font-weight:700; color:var(--primary);">Item ${crit.id}</div>
                  ${isEdit ? `
                    <div style="display:flex; gap:6px;">
                      <button class="btn btn-secondary" onclick="promptAddCriterion('${matrixType}', ${sIdx}, ${subIdx}, ${cIdx})" style="padding:2px 6px; font-size:10px; background:#F8FAFC; color:var(--primary);" title="Inserir novo item antes deste (à frente)">
                        ➕ Inserir Antes
                      </button>
                      <button class="btn btn-secondary" onclick="confirmDeleteCriterion('${matrixType}', ${sIdx}, ${subIdx}, ${cIdx})" style="padding:2px 6px; font-size:10px; color:#DC2626;" title="Excluir este item da matriz">
                        🗑️ Excluir Item
                      </button>
                    </div>
                  ` : ''}
                </div>
                <textarea class="form-textarea" style="min-height:55px; font-size:13px; background:${bgStyle}; width:100%; border-radius:6px;" ${disabledAttr}
                          placeholder="Texto descritivo do critério..."
                          onchange="updateCriterionText('${matrixType}', ${sIdx}, ${subIdx}, ${cIdx}, this.value)">${crit.text}</textarea>
              </div>
            `;
          });
        });

        secCard.innerHTML = html;
        container.appendChild(secCard);
      });
    }

    // =========================================================================
    // MOTOR DE REINDEXAÇÃO E MIGRAÇÃO RELACIONAL DE RUBRICAS (SSOT)
    // =========================================================================

    /**
     * Reindexa deterministicamente toda a matriz especificada ('teacher' ou 'coordinator'),
     * garantindo numeração sequencial contínua em dimensões, subdimensões e itens.
     * Retorna o mapa de migração de IDs { [oldId]: newId }.
     */
    function reindexRubricMatrix(matrixType, deletedIds = []) {
      const sections = getActiveMatrixSections(matrixType);
      if (!sections || sections.length === 0) return {};

      const idMigrationMap = {};
      const deletedIdsSet = new Set(deletedIds || []);

      sections.forEach((sec, sIdx) => {
        const dimNum = sIdx + 1;

        // Limpa prefixos redundantes tipo "Dimensão X:" no título da dimensão
        if (sec.title) {
          sec.title = sec.title.replace(/^Dimens[aã]o\s*\d+\s*:\s*/i, '').trim();
        }

        if (!sec.subSections || sec.subSections.length === 0) {
          sec.subSections = [{ id: `${dimNum}.1`, title: 'Geral', criteria: [] }];
        }

        const isCoord = matrixType === 'coordinator';
        const hasSingleSub = sec.subSections.length === 1;

        sec.subSections.forEach((sub, subIdx) => {
          const subNum = subIdx + 1;
          
          // Regra de ID de Subdimensão:
          // Se for matriz de coordenador ou dimensão com subseção única sem ponto no ID original, usa nível simples (ex: "1")
          // Caso contrário, usa nível composto (ex: "1.1", "1.2")
          let newSubId;
          const originalSubIdStr = String(sub.id || '');
          if (isCoord || (hasSingleSub && !originalSubIdStr.includes('.'))) {
            newSubId = String(dimNum);
          } else {
            newSubId = `${dimNum}.${subNum}`;
          }
          sub.id = newSubId;

          if (sub.criteria && Array.isArray(sub.criteria)) {
            sub.criteria.forEach((crit, cIdx) => {
              const critNum = cIdx + 1;
              const newCritId = `${newSubId}.${critNum}`;
              
              if (crit.id && crit.id !== 'temp' && crit.id !== 'temp_c' && crit.id !== newCritId) {
                idMigrationMap[crit.id] = newCritId;
              }
              crit.id = newCritId;
            });
          }
        });
      });

      // Migração de chaves em observações e rascunhos para preservar integridade
      if (Object.keys(idMigrationMap).length > 0 || deletedIdsSet.size > 0) {
        migrateObservationKeys(matrixType, idMigrationMap, deletedIdsSet);
      }

      saveState();
      return idMigrationMap;
    }

    /**
     * Atualiza as chaves dos objetos de observação (respostas, comentários e fotos)
     * quando itens da matriz de rubricas são renumerados ou excluídos.
     */
    function migrateObservationKeys(matrixType, idMigrationMap, deletedIdsSet) {
      const isCoord = matrixType === 'coordinator';
      
      const processObsRecord = (obs) => {
        if (!obs) return;
        const obsIsCoord = obs.evaluatedType === 'coordenador';
        if (obsIsCoord !== isCoord) return;

        // 1. Respostas
        if (obs.responses) {
          const newResponses = {};
          Object.keys(obs.responses).forEach(oldKey => {
            if (deletedIdsSet.has(oldKey)) return; // Excluído
            const targetKey = idMigrationMap[oldKey] || oldKey;
            newResponses[targetKey] = obs.responses[oldKey];
          });
          obs.responses = newResponses;
        }

        // 2. Comentários qualitativos de critérios
        if (obs.criterionComments) {
          const newComments = {};
          Object.keys(obs.criterionComments).forEach(oldKey => {
            if (deletedIdsSet.has(oldKey)) return;
            const targetKey = idMigrationMap[oldKey] || oldKey;
            newComments[targetKey] = obs.criterionComments[oldKey];
          });
          obs.criterionComments = newComments;
        }

        // 3. Fotos anexadas
        if (obs.photos) {
          const newPhotos = {};
          Object.keys(obs.photos).forEach(oldKey => {
            if (deletedIdsSet.has(oldKey)) return;
            const targetKey = idMigrationMap[oldKey] || oldKey;
            newPhotos[targetKey] = obs.photos[oldKey];
          });
          obs.photos = newPhotos;
        }
      };

      (appState.observations || []).forEach(processObsRecord);
      if (appState.currentObs) {
        processObsRecord(appState.currentObs);
      }
    }

    // =========================================================================
    // AÇÕES ESTRUTURAIS: DIMENSÕES
    // =========================================================================
    function promptAddDimension(targetSIdx = null) {
      if (!window.isRubricsEditMode) {
        alert("Habilite o 'Modo de Edição' antes de adicionar uma dimensão.");
        return;
      }
      const matrixType = document.getElementById('rubricMatrixSelect')?.value || 'teacher';
      const sections = getActiveMatrixSections(matrixType);
      const totalDims = sections.length;
      const matrixLabel = matrixType === 'coordinator' ? 'Coordenadores' : 'Professores';

      let insertIdx = totalDims;
      let promptTitleLabel = `Título da nova Dimensão:`;

      if (targetSIdx !== null && targetSIdx >= 0 && targetSIdx < totalDims) {
        insertIdx = targetSIdx;
        promptTitleLabel = `Título da nova Dimensão (será inserida ANTES da Dimensão ${targetSIdx + 1} "${sections[targetSIdx].title}"):`;
      } else {
        const posPrompt = prompt(`Posição da nova Dimensão na Matriz (1 a ${totalDims + 1}):\n\n• Digite 1 para inserir À FRENTE de todas (as demais avançarão +1 número)\n• Pressione Enter para adicionar ao final como Dimensão ${totalDims + 1}`, String(totalDims + 1));
        if (posPrompt === null) return;
        const parsedPos = parseInt(posPrompt, 10);
        if (!isNaN(parsedPos) && parsedPos >= 1 && parsedPos <= totalDims + 1) {
          insertIdx = parsedPos - 1;
        }
      }

      const title = prompt(promptTitleLabel, `Nova Dimensão`);
      if (!title || !title.trim()) return;

      const subTitle = prompt("Título da Subdimensão inicial (ou deixe 'Geral'):", "Geral") || "Geral";
      const critText = prompt("Texto descritivo do primeiro item desta dimensão:", "Observa e estimula o desenvolvimento integral com intencionalidade pedagógica.");
      if (!critText || !critText.trim()) return;

      if (!confirm(`Confirma a criação da nova Dimensão "${title.trim()}" na posição ${insertIdx + 1} da Matriz de ${matrixLabel}?`)) {
        return;
      }

      const newSec = {
        key: `dim_${Date.now()}`,
        title: title.trim().replace(/^Dimens[aã]o\s*\d+\s*:\s*/i, ''),
        subSections: [
          {
            id: `temp`,
            title: subTitle.trim(),
            criteria: [
              {
                id: `temp_c`,
                text: critText.trim()
              }
            ]
          }
        ]
      };

      sections.splice(insertIdx, 0, newSec);
      reindexRubricMatrix(matrixType);
      renderRubricsAdminScreen();
      showToast(`Dimensão "${title.trim()}" inserida na posição ${insertIdx + 1} com numeração atualizada!`);
    }

    function promptEditDimensionTitle(matrixType, sIdx) {
      if (!window.isRubricsEditMode) return;
      const sections = getActiveMatrixSections(matrixType);
      const sec = sections[sIdx];
      if (!sec) return;

      const currentTitle = (sec.title || '').replace(/^Dimens[aã]o\s*\d+\s*:\s*/i, '');
      const newTitle = prompt("Editar Título da Dimensão:", currentTitle);
      if (!newTitle || !newTitle.trim() || newTitle.trim() === currentTitle) return;

      if (!confirm(`Tem certeza que deseja renomear a Dimensão para "${newTitle.trim()}"?`)) {
        return;
      }

      sec.title = newTitle.trim().replace(/^Dimens[aã]o\s*\d+\s*:\s*/i, '');
      saveState();
      renderRubricsAdminScreen();
      showToast("Título da dimensão atualizado com sucesso!");
    }

    function confirmDeleteDimension(matrixType, sIdx) {
      if (!window.isRubricsEditMode) return;
      const sections = getActiveMatrixSections(matrixType);
      const sec = sections[sIdx];
      if (!sec) return;

      const msg = `⚠️ ATENÇÃO: Tem certeza que deseja EXCLUIR a Dimensão ${sIdx + 1} ("${sec.title}")?\n\nTodos os critérios pertencentes a ela serão removidos e as dimensões seguintes serão automaticamente reordenadas (-1 número).`;
      if (!confirm(msg)) return;

      // Coleta todos os critérios excluídos para limpeza relacional
      const deletedIds = [];
      (sec.subSections || []).forEach(sub => {
        (sub.criteria || []).forEach(c => {
          if (c.id) deletedIds.push(c.id);
        });
      });

      sections.splice(sIdx, 1);
      reindexRubricMatrix(matrixType, deletedIds);
      renderRubricsAdminScreen();
      showToast(`Dimensão removida e numeração das demais reordenada com sucesso!`);
    }

    // =========================================================================
    // AÇÕES ESTRUTURAIS: SUBDIMENSÕES
    // =========================================================================
    function promptAddSubSection(matrixType, sIdx, targetSubIdx = null) {
      if (!window.isRubricsEditMode) return;
      const sections = getActiveMatrixSections(matrixType);
      const sec = sections[sIdx];
      if (!sec) return;

      if (!sec.subSections) sec.subSections = [];
      const totalSubs = sec.subSections.length;

      let insertIdx = totalSubs;
      let promptTitleLabel = `Título da nova Subdimensão:`;

      if (targetSubIdx !== null && targetSubIdx >= 0 && targetSubIdx < totalSubs) {
        insertIdx = targetSubIdx;
        promptTitleLabel = `Título da nova Subdimensão (será inserida ANTES de "${sec.subSections[targetSubIdx].title}"):`;
      } else if (totalSubs > 0) {
        const posPrompt = prompt(`Posição da Subdimensão na Dimensão ${sIdx + 1} (1 a ${totalSubs + 1}):\n\n• Digite 1 para inserir À FRENTE de todas\n• Pressione Enter para adicionar ao final`, String(totalSubs + 1));
        if (posPrompt === null) return;
        const parsedPos = parseInt(posPrompt, 10);
        if (!isNaN(parsedPos) && parsedPos >= 1 && parsedPos <= totalSubs + 1) {
          insertIdx = parsedPos - 1;
        }
      }

      const subTitle = prompt(promptTitleLabel, "Novo Eixo Temático");
      if (!subTitle || !subTitle.trim()) return;

      const critText = prompt("Texto descritivo do primeiro item desta subdimensão:", "Realiza mediações pedagógicas com intencionalidade formativa.");
      if (!critText || !critText.trim()) return;

      if (!confirm(`Confirma a criação da Subdimensão "${subTitle.trim()}" na posição ${insertIdx + 1} da Dimensão ${sIdx + 1}?`)) return;

      sec.subSections.splice(insertIdx, 0, {
        id: `temp`,
        title: subTitle.trim(),
        criteria: [
          {
            id: `temp_c`,
            text: critText.trim()
          }
        ]
      });

      reindexRubricMatrix(matrixType);
      renderRubricsAdminScreen();
      showToast("Subdimensão inserida e numeração subsequente atualizada com sucesso!");
    }

    function promptEditSubSectionTitle(matrixType, sIdx, subIdx) {
      if (!window.isRubricsEditMode) return;
      const sections = getActiveMatrixSections(matrixType);
      const sub = sections[sIdx]?.subSections[subIdx];
      if (!sub) return;

      const newTitle = prompt("Novo título da Subdimensão:", sub.title);
      if (!newTitle || !newTitle.trim() || newTitle.trim() === sub.title) return;

      if (!confirm(`Renomear subdimensão para "${newTitle.trim()}"?`)) return;

      sub.title = newTitle.trim();
      saveState();
      renderRubricsAdminScreen();
      showToast("Subdimensão atualizada.");
    }

    function confirmDeleteSubSection(matrixType, sIdx, subIdx) {
      if (!window.isRubricsEditMode) return;
      const sections = getActiveMatrixSections(matrixType);
      const sec = sections[sIdx];
      const sub = sec?.subSections[subIdx];
      if (!sub) return;

      if (!confirm(`Tem certeza que deseja excluir a Subdimensão "${sub.title}" e todos os seus itens?\n\nAs subdimensões e critérios seguintes serão automaticamente renumerados.`)) return;

      // Coleta itens excluídos
      const deletedIds = (sub.criteria || []).map(c => c.id).filter(Boolean);

      sec.subSections.splice(subIdx, 1);
      reindexRubricMatrix(matrixType, deletedIds);
      renderRubricsAdminScreen();
      showToast("Subdimensão removida e numeração sequencial reordenada!");
    }

    // =========================================================================
    // AÇÕES ESTRUTURAIS: ITENS / CRITÉRIOS
    // =========================================================================
    function promptAddCriterion(matrixType, sIdx, subIdx = 0, targetCIdx = null) {
      if (!window.isRubricsEditMode) {
        alert("Habilite o 'Modo de Edição' antes de adicionar um item.");
        return;
      }
      const sections = getActiveMatrixSections(matrixType);
      const sec = sections[sIdx];
      if (!sec) return;

      if (!sec.subSections || sec.subSections.length === 0) {
        sec.subSections = [{ id: `${sIdx + 1}.1`, title: 'Geral', criteria: [] }];
      }
      const sub = sec.subSections[subIdx] || sec.subSections[0];
      if (!sub.criteria) sub.criteria = [];

      const totalCrits = sub.criteria.length;
      let insertIdx = totalCrits;
      let promptTextLabel = `Texto descritivo do novo Item:`;

      if (targetCIdx !== null && targetCIdx >= 0 && targetCIdx < totalCrits) {
        insertIdx = targetCIdx;
        const targetCrit = sub.criteria[targetCIdx];
        promptTextLabel = `Texto descritivo do novo Item (será inserido ANTES do Item ${targetCrit.id}):`;
      } else if (totalCrits > 0) {
        const posPrompt = prompt(`Posição do novo Item nesta seção (1 a ${totalCrits + 1}):\n\n• Digite 1 para inserir À FRENTE de todos (o atual item 1 avançará para o próximo número)\n• Pressione Enter para adicionar ao final (posição ${totalCrits + 1})`, String(totalCrits + 1));
        if (posPrompt === null) return;
        const parsedPos = parseInt(posPrompt, 10);
        if (!isNaN(parsedPos) && parsedPos >= 1 && parsedPos <= totalCrits + 1) {
          insertIdx = parsedPos - 1;
        }
      }

      const critText = prompt(promptTextLabel, "");
      if (!critText || !critText.trim()) return;

      if (!confirm(`Confirma a inserção do novo item na posição ${insertIdx + 1}? Os itens posteriores avançarão automaticamente +1 número.`)) {
        return;
      }

      sub.criteria.splice(insertIdx, 0, {
        id: `temp_c`,
        text: critText.trim()
      });

      reindexRubricMatrix(matrixType);
      renderRubricsAdminScreen();
      showToast(`Item inserido com sucesso na posição ${insertIdx + 1} e numeração subsequente atualizada (+1)!`);
    }

    function confirmDeleteCriterion(matrixType, sIdx, subIdx, cIdx) {
      if (!window.isRubricsEditMode) return;
      const sections = getActiveMatrixSections(matrixType);
      const crit = sections[sIdx]?.subSections[subIdx]?.criteria[cIdx];
      if (!crit) return;

      const msg = `⚠️ Confirma a exclusão do Item [${crit.id}]?\n\n"${crit.text.substring(0, 50)}..."\n\nAo excluir, todos os itens seguintes avançarão para cobrir a numeração (ex: ao excluir o item 1.1, o 1.2 passará a ser o 1.1).`;
      if (!confirm(msg)) {
        return;
      }

      const deletedId = crit.id;
      sections[sIdx].subSections[subIdx].criteria.splice(cIdx, 1);
      reindexRubricMatrix(matrixType, [deletedId]);
      renderRubricsAdminScreen();
      showToast(`Item [${deletedId}] excluído e numeração reordenada com sucesso!`);
    }

    function updateCriterionText(matrixType, sIdx, subIdx, cIdx, newText) {
      if (!newText.trim()) return;
      if (!window.isRubricsEditMode) {
        renderRubricsAdminScreen();
        return;
      }

      if (!confirm('Tem certeza que deseja alterar este descritor da matriz de rubricas no SSOT?')) {
        renderRubricsAdminScreen();
        return;
      }

      const sections = getActiveMatrixSections(matrixType);
      sections[sIdx].subSections[subIdx].criteria[cIdx].text = newText.trim();
      saveState();
      showToast('Descritor atualizado com sucesso no SSOT!');
    }

    // =========================================================================
    // GOVERNANÇA: DEFINIR NOVO PADRÃO, RESTAURAR E EXPORTAR/IMPORTAR
    // =========================================================================
    function setCustomDefaultRubricsPrompt() {
      if (!window.isRubricsEditMode) {
        alert("Para definir um novo padrão, habilite o 'Modo de Edição' na chave superior antes.");
        return;
      }
      
      const msg = "Tem certeza que deseja definir as rubricas atuais como o NOVO PADRÃO OFICIAL DO MUNICÍPIO?\n\nA partir de agora, qualquer restauração da rede utilizará esta matriz como referência oficial.\n\nAlém de salvar no SSOT, o sistema fará o download automático dos arquivos de backup (.json e .csv) para arquivamento pela secretaria.";
      if (!confirm(msg)) return;

      appState.customDefaultTeacher = JSON.parse(JSON.stringify(getActiveMatrixSections('teacher')));
      appState.customDefaultCoordinator = JSON.parse(JSON.stringify(getActiveMatrixSections('coordinator')));
      saveState();

      // Exportação imediata em .json e .csv dos novos padrões definidos
      exportRubricsJSON("sertao_crianca_rubricas_novo_padrao.json");
      setTimeout(() => {
        exportRubricsCSV("sertao_crianca_rubricas_novo_padrao.csv");
      }, 500);

      showToast('Novo padrão municipal definido e backups (.json e .csv) gerados com sucesso!');
    }

    function restoreDefaultRubricsPrompt() {
      if (!window.isRubricsEditMode) {
        alert("Para restaurar as rubricas, habilite o 'Modo de Edição' antes.");
        return;
      }

      const hasCustom = appState.customDefaultTeacher || appState.customDefaultCoordinator;
      if (hasCustom) {
        const opt = confirm("Deseja restaurar para o PADRÃO MUNICIPAL DEFINIDO (OK)?\n\n(Ou clique em Cancelar para restaurar para a Matriz de Fábrica Original do SerTão Criança)");
        if (opt) {
          appState.activeSectionsTeacher = JSON.parse(JSON.stringify(appState.customDefaultTeacher || DEFAULT_SECTIONS_TEACHER));
          appState.activeSectionsCoordinator = JSON.parse(JSON.stringify(appState.customDefaultCoordinator || DEFAULT_SECTIONS_COORDINATOR));
          saveState();
          renderRubricsAdminScreen();
          showToast('Rubricas restauradas para o padrão municipal da secretaria.');
          return;
        }
      }

      restoreFactoryDefaultRubricsPrompt();
    }

    function restoreFactoryDefaultRubricsPrompt() {
      if (!confirm("⚠️ ATENÇÃO: Tem certeza que deseja restaurar as rubricas para o PADRÃO ORIGINAL DE FÁBRICA (LEPES / SerTão Criança)?\n\nTodas as customizações e padrões municipais não exportados serão perdidos.")) {
        return;
      }
      appState.activeSectionsTeacher = JSON.parse(JSON.stringify(DEFAULT_SECTIONS_TEACHER));
      appState.activeSectionsCoordinator = JSON.parse(JSON.stringify(DEFAULT_SECTIONS_COORDINATOR));
      delete appState.customDefaultTeacher;
      delete appState.customDefaultCoordinator;
      saveState();
      renderRubricsAdminScreen();
      showToast('Rubricas restauradas para o padrão original de fábrica.');
    }

