# PLANO DE IMPLEMENTAÇÃO: PILAR 8 - DIAGNÓSTICO DE PRIORIDADES FORMATIVAS: BLOCO "FOCO NOS MENORES ÍNDICES" (GARGALOS PEDAGÓGICOS)

> **DIRETRIZ OBRIGATÓRIA DE EXECUÇÃO (ETAPA 2):**
> O assistente executor (Etapa 2) deve **obrigatoriamente ler e seguir as diretrizes dos arquivos `WORKFLOW_MACOS.md` e `AGENTS.md`** localizados na raiz do projeto antes de aplicar qualquer modificação no código. Nenhuma modificação deve ser realizada sem conformidade estrita com o workflow, incluindo:
> 1. Execução prévia de sincronização com o repositório remoto (`git pull origin main`).
> 2. Preservação integral das regras de negócio existentes, dados cadastrais, blindagens RBAC, série histórica, ciclo longitudinal, turmas integrais (Pilar 4), fechamento nominal e parecer em práticas consistentes (Pilar 5), higienização terminológica para "observação" (Pilar 6), novos KPIs decisórios com cobertura no bimestre corrente (Pilar 7) e testes automatizados.
> 3. Verificação de integridade pós-edição com dupla checagem de leitura em cada trecho modificado.
> 4. Salvamento obrigatório do backup intermediário na pasta `intermediárias/` sob o nome `aplicativo_v102_pilar_8_foco_menores_indices_gargalos.html`.
> 5. Gestão dupla de Changelog no arquivo `CHANGELOG.md` e no modal `#modalChangelog` do `index.html`, registrando a **Versão 1.02 (ou 0.102)**.
> 6. Sincronização idêntica entre o arquivo principal `index.html` da raiz, `gestor supervisao_patos/index.html` e `gestor supervisao_patos/firebase_deploy/public/index.html`.
> 7. Checagem pré-push (`git fetch origin main`), commit semântico (`feat: implementar pilar 8 - bloco foco nos menores indices e diagnostico de gargalos pedagogicos (v1.02)`), push para `origin main` e deploy automático no GitHub Pages.
> 8. Execução pós-deploy obrigatória do algoritmo de auditoria (`python3 audit_platform.py --silent-on-success`) com comunicação estrita a falhas.

---

## 1. Diagnóstico e Contexto Técnico-Pedagógico

### 1.1 Cenário Atual
Após a implementação e homologação dos Pilares 1 a 7 do Sistema de Supervisão Pedagógica **SerTão Criança**:
- **Pilar 1:** Inverteu a unidade de observação da sala de aula para a **TURMA**, garantindo série histórica contínua de duplas e quartetos docentes.
- **Pilar 2:** Consolidou a tríade canônica de governança (Coordenadora da UE ➔ Formadora de Polo ➔ Coordenadora do Núcleo de EI).
- **Pilar 3:** Estabeleceu o benchmark comparativo `% da UE vs. Rede` item a item na sub-aba de Afunilamento por Dimensão.
- **Pilar 4:** Unificou o instrumento para turmas em Tempo Integral em formulário único de 2 etapas (Manhã e Tarde) com soma de tempos.
- **Pilar 5:** Implementou o fechamento nominal docente, avaliação nas 5 dimensões, parecer aberto em práticas consistentes e trava mandatória com justificativa em itens parciais.
- **Pilar 6:** Concluiu a higienização terminológica de *"visita"* para **"observação"** em 100% da plataforma.
- **Pilar 7:** Extinguiu as métricas cartoriais ("Observações Auditadas" e "Itens Válidos / N.A.") e reorganizou o Grid Superior em 4 KPIs decisórios: Consistência Geral, Cobertura no Bimestre Corrente (destaque), Meta do Ciclo Anual e Dimensão Prioritária (Gargalo macro).

Contudo, na sub-aba **"Índices Gerais & KPIs"** (`#indicatorsSectionKPIs`), após a visualização dos 4 cards superiores, a tela encerrava sua apresentação sem oferecer aos gestores a resposta operacional mais urgente:
- O Card 4 informa qual é a **Grande Dimensão macro** prioritária (ex: *1. Estratégias Didáticas - 62%*), mas **não explicita quais são os 3 critérios específicos da sala de aula** onde a fragilidade mais se concentra.
- Para identificar esses gargalos, a coordenadora ou formadora precisava abrir a sub-aba de Afunilamento e inspecionar manualmente 46 critérios um a um, gerando sobrecarga cognitiva e atrasando o planejamento das intervenções.
- As reuniões de formação interna e alinhamento pedagógico na escola (HTPC / planejamento coletivo) demandam uma pauta objetiva, baseada em evidências observadas no chão da escola, pronta para direcionar os combinados com as professoras regentes.

### 1.2 Fundamentação Técnico-Pedagógica (Documento de Insights / Deliberação ST Criança 19/10/2026)
Conforme estabelecido expressamente no Documento Oficial de Referência de Produto, Governança e Arquitetura (`documento_insights_supervisao_pedagogica_20261020.md`):
> **PILAR 8: Diagnóstico de Prioridades: Bloco "Foco nos Menores Índices" (Gargalos)**
> - Apresentação automática dos **3 menores critérios da unidade ou polo** (os pontos mais frágeis ou com maior desvio negativo em relação à rede).
> - Serve como pauta prioritária imediata para as reuniões de alinhamento e formação interna na escola.

E em perfeita harmonia com a Seção 3 do `WORKFLOW_MACOS.md`:
> *"O assistente deve sempre trabalhar na lógica de dados e indicadores como apoiadores para a tomada de decisão, com foco e atenção redobrada na aba de Indicadores. Dados, gráficos, médias, distribuições e métricas não devem existir como meros elementos visuais, informativos ou burocráticos. Toda informação apresentada deve responder a uma pergunta prática de gestão ou acompanhamento pedagógico."*

### 1.3 Resultado Esperado com o Pilar 8
1. **Criação do Bloco de Diagnóstico "Foco nos Menores Índices (Gargalos Pedagógicos)":**
   - Inserido de forma proeminente logo abaixo do Grid de 4 Cards em `#indicatorsSectionKPIs`.
   - Apresenta automaticamente os **3 critérios mais críticos** calculados a partir das observações formativas finalizadas no escopo selecionado (UE, Polo ou Rede).
2. **Dupla Perspectiva Algorítmica de Ordenação com Alternador Rápido:**
   - **Perspectiva 1: `📉 Menor Consistência Absoluta` (Padrão):** Ranqueia os 3 critérios com menor índice de consistência na escola/polo (pontuação percentual mais baixa), utilizando como desempate a maior defasagem negativa ($\Delta$) em relação à Rede de Patos.
   - **Perspectiva 2: `🔻 Maior Defasagem vs. Rede Municipal`:** Ranqueia os 3 critérios em que a escola/polo apresenta o maior desvio negativo em relação à média geral municipal ($\Delta \pm\%$).
3. **Card Pedagógico Rico e Acionável para Cada Gargalo:**
   - Identificação precisa: Código do Critério (`[1.1.2]`), Enunciado Oficial da Matriz, Dimensão e Subdimensão pertencentes.
   - Régua comparativa em destaque: `% Consistência na UE`, `% Média da Rede Municipal de Patos` e badge semântico de $\Delta \pm\%$ (Atenção Crítica / Abaixo da Média).
   - Distribuição de evidências: contadores numéricos de respostas observadas (`Consistente`, `Parcial`, `Não Realizado`).
   - **Pauta Sugerida para Reunião de Alinhamento:** Diretriz formativa contextualizada e prática que orienta a reflexão coletiva com as professoras regentes da turma.
   - **Atalho Interativo de Deep-Linking (`🔍 Ver no Afunilamento`):** Alterna diretamente para a sub-aba de Afunilamento, expande a Dimensão e a Subdimensão correspondentes, rola a tela até o critério e aciona animação de pulso/destaque visual.
4. **Recurso Operacional de Exportação de Pauta (`📋 Copiar Pauta da Reunião`):**
   - Botão para copiar instantaneamente para a área de transferência a pauta formativa estruturada em texto/Markdown, pronta para envio no grupo pedagógico ou inclusão na ata de reunião.
5. **Integração no Card 4 do Grid Superior:**
   - Inclusão de atalho rápido no Card 4 (*Dimensão Prioritária*) para rolar diretamente até o Bloco de Gargalos.
6. **Suporte a Impressão e Responsividade Mobile:**
   - Diagramação limpa para relatórios em PDF (`@media print`) e visualização sem quebra em celulares.
7. **Auditoria Automatizada Modular (100% de Cobertura):**
   - Atualização do Módulo 10 (`indicadores_decisao`) em `audit_platform.py` e `index.html` validando a precisão algorítmica e a interatividade do Pilar 8.

---

## 2. Arquitetura e Mapeamento de Pontos de Impacto

### 2.1 Arquivos Afetados
```
gestor supervisao_patos/
├── index.html                                                                                  # Aplicação servida em produção (GitHub Pages)
├── firebase_deploy/public/index.html                                                           # Cópia espelhada obrigatória
├── audit_platform.py                                                                           # Motor de auditoria modular da plataforma
├── CHANGELOG.md                                                                                # Histórico oficial de versões
├── docs/documento_insights_supervisao_pedagogica_20261020.md                                   # Atualização de status do Pilar 8
└── intermediárias/aplicativo_v102_pilar_8_foco_menores_indices_gargalos.html                   # Backup intermediário da Versão 1.02
```

### 2.2 Mapeamento por Módulo Funcional

| Módulo / Tela | Elemento / Função | Linhas Estimadas em `index.html` | Ação de Alteração |
| :--- | :--- | :---: | :--- |
| **Folha de Estilos (CSS)** | Classes `.bottlenecks-*` e animações de highlight | Após linha 800 | Inserir estilos visuais dos cards de gargalo, ranking, alternador de modo e efeito pulse |
| **Motor Algorítmico do Pilar 8** | Funções `calculateTopBottlenecks`, `getPedagogicalActionPrompt`, `renderBottlenecksPrioritySection`, `toggleBottlenecksSortMode`, `locateBottleneckCriterionInDrilldown`, `copyMeetingAgendaToClipboard` | Após linha 14432 (junto aos helpers de indicadores) | Adicionar lógica determinística de extração, ranqueamento, pauta formativa e deep-linking |
| **Grid Superior de KPIs (Card 4)** | Card da Dimensão Prioritária | ~15450 | Adicionar atalho interativo com scroll suave para o Bloco de Gargalos |
| **Sub-aba "Índices Gerais & KPIs"** | Fechamento do contêiner `#indicatorsSectionKPIs` | ~15457 | Inserir a renderização dinâmica do Bloco do Pilar 8 logo abaixo de `.kpi-row` |
| **Sub-aba "Afunilamento por Dimensão"** | Itens individuais de critérios no DOM | ~15640 | Adicionar `id="drilldownCrit_${crit.id.replace(/\./g, '_')}"` em cada `.drilldown-sub-item` |
| **Engine de Testes do Browser** | Módulo 10: `indicadores_decisao` em `runFullPlatformAudit()` | ~18520 a 18570 | Adicionar asserções estritas de cálculo dos 3 gargalos, alternância de ordenação e deep-linking |
| **Script CLI de Auditoria** | Catálogo `MODULE_CATALOG['indicadores_decisao']` em `audit_platform.py` | Linha 32 | Atualizar descrição oficial do Módulo 10 para refletir os Pilares 7 e 8 |
| **Changelog Duplo** | `CHANGELOG.md` e modal `#modalChangelog` em `index.html` | Topo do log e linhas ~4250 | Registrar a entrega da Versão 1.02 (ou 0.102) com detalhamento completo |

---

## 3. Especificação de Implementação Passo a Passo (Obrigatório)

### BLOCO 1: Estilos CSS do Bloco de Gargalos e Animações (Pilar 8)

#### 1.1 Localização em `index.html` (logo após a linha ~800, ao final dos estilos do Pilar 3):
Inserir o bloco de estilos dedicado ao Pilar 8:

```css
    /* =========================================================================
       PILAR 8: DIAGNÓSTICO DE PRIORIDADES - MENORES ÍNDICES (GARGALOS PEDAGÓGICOS)
       ========================================================================= */
    .bottlenecks-priority-block {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    }
    .bottlenecks-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 16px;
      padding-bottom: 14px;
      border-bottom: 1px solid var(--border);
    }
    .bottlenecks-title-group h3 {
      font-size: 16px;
      font-weight: 800;
      color: var(--primary-dark);
      margin: 0 0 4px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .bottlenecks-title-group p {
      font-size: 12px;
      color: var(--text-secondary);
      margin: 0;
      line-height: 1.4;
    }
    .bottlenecks-controls-group {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .bottlenecks-toggle-pill {
      display: inline-flex;
      background: #F1F5F9;
      border: 1px solid #CBD5E1;
      border-radius: 8px;
      padding: 2px;
      font-size: 11px;
      font-weight: 700;
    }
    .bottlenecks-toggle-btn {
      border: none;
      background: transparent;
      padding: 5px 10px;
      border-radius: 6px;
      color: var(--text-secondary);
      cursor: pointer;
      font-size: 11px;
      font-weight: 700;
      transition: all 0.2s ease;
    }
    .bottlenecks-toggle-btn.active {
      background: #FFFFFF;
      color: var(--primary-dark);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
    }
    .bottlenecks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
      gap: 16px;
    }
    .bottleneck-card {
      background: #FFFFFF;
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .bottleneck-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    }
    .bottleneck-card-critical {
      border-left: 5px solid var(--red);
    }
    .bottleneck-card-warning {
      border-left: 5px solid var(--yellow);
    }
    .bottleneck-card-stable {
      border-left: 5px solid var(--green);
    }
    .bottleneck-badge-rank {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 3px 8px;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .bottleneck-rank-1 {
      background: #FEE2E2;
      color: #991B1B;
      border: 1px solid #FECACA;
    }
    .bottleneck-rank-2 {
      background: #FEF3C7;
      color: #92400E;
      border: 1px solid #FDE68A;
    }
    .bottleneck-rank-3 {
      background: #EFF6FF;
      color: #1E40AF;
      border: 1px solid #BFDBFE;
    }
    .bottleneck-metric-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 8px;
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 10px;
      margin: 12px 0;
      text-align: center;
    }
    .bottleneck-prompt-box {
      background: #FFFBEB;
      border: 1px dashed #FCD34D;
      border-radius: 8px;
      padding: 10px 12px;
      font-size: 11px;
      color: #78350F;
      line-height: 1.4;
      margin-bottom: 12px;
    }
    .bottleneck-actions-row {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 8px;
      padding-top: 10px;
      border-top: 1px solid #F1F5F9;
    }
    @keyframes bottleneckHighlightPulse {
      0% { background-color: #FEF08A; transform: scale(1.01); }
      50% { background-color: #FDE047; }
      100% { background-color: transparent; transform: scale(1); }
    }
    .highlight-bottleneck-pulse {
      animation: bottleneckHighlightPulse 2.5s ease-out;
      border-radius: 6px;
    }
    @media print {
      .bottlenecks-priority-block {
        break-inside: avoid;
        box-shadow: none;
        border: 1px solid #94A3B8;
      }
      .bottlenecks-controls-group, .bottleneck-actions-row {
        display: none !important;
      }
    }
```

---

### BLOCO 2: Lógica Algorítmica e Helpers do Pilar 8

#### 2.1 Localização em `index.html` (logo após a função `formatBenchmarkDelta`, por volta da linha 14432):
Inserir o conjunto canônico de funções de negócio do Pilar 8:

```javascript
    // =========================================================================
    // PILAR 8: DIAGNÓSTICO DE PRIORIDADES - FOCO NOS MENORES ÍNDICES (GARGALOS)
    // =========================================================================

    /**
     * Mapeamento de pautas formativas recomendadas por subdimensão/tópico para subsidiar
     * o alinhamento pedagógico e formação interna na Unidade Escolar.
     */
    function getPedagogicalActionPrompt(critId, subId, targetType) {
      if (targetType === 'coordenador') {
        return 'Pauta de Tutoria da Coordenação: Revisar a rotina de acompanhamento pedagógico formativo em sala, o feedback sistemático e o suporte direto ao planejamento docente.';
      }
      const sId = String(subId || '').trim();
      const prompts = {
        '1.1': 'Pauta para Alinhamento: Intensificar o uso de perguntas abertas, rodas dialógicas e mediação na contação de histórias, conectando vivências ao cotidiano das crianças.',
        '1.2': 'Pauta para Alinhamento: Planejar intencionalmente tempos, materiais não-estruturados e cantos para brincadeira livre e mediada, evitando interrupções diretivas.',
        '1.3': 'Pauta para Alinhamento: Diversificar experiências expressivas entre comunicação oral, autoria gráfica, hipóteses de contagem e situações de cooperação infantil.',
        '2.1': 'Pauta para Alinhamento: Reorganizar cantos temáticos e dispor materiais acessíveis ao alcance das mãos e olhos das crianças, incentivando autonomia de escolha.',
        '2.2': 'Pauta para Alinhamento: Tornar transições de rotina previsíveis, acolhedoras e lúdicas, reduzindo esperas ociosas e mantendo quadro visual da rotina partilhado.',
        '3.1': 'Pauta para Alinhamento: Qualificar a escuta sensível do docente, a nomeação de sentimentos e a mediação pacífica de conflitos entre as crianças.',
        '3.2': 'Pauta para Alinhamento: Ampliar momentos em que a criança seja protagonista ativa de suas ideias, produções e escolhas nas decisões da rotina diária.',
        '4.1': 'Pauta para Alinhamento: Garantir acessibilidade curricular, materiais diversificados para múltiplos ritmos e valorização das identidades culturais e inclusão.',
        '5.1': 'Pauta para Alinhamento: Aprimorar o registro reflexivo em diários de bordo e portfólios, utilizando as anotações para replanejar vivências pedagógicas.'
      };
      return prompts[sId] || 'Pauta para Alinhamento: Analisar conjuntamente com as professoras regentes os desafios práticos observados neste critério e definir combinados de apoio formativo.';
    }

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
          // Maior defasagem negativa em relação à rede (delta menor primeiro: ex: -30% antes de -10%)
          if (a.delta !== null && b.delta !== null) {
            if (a.delta !== b.delta) return a.delta - b.delta;
            return a.score - b.score;
          }
          if (a.delta !== null) return -1;
          if (b.delta !== null) return 1;
          return a.score - b.score;
        } else {
          // Menor consistência absoluta (padrão): menor score primeiro
          if (a.score !== b.score) return a.score - b.score;
          // Desempate: menor delta em relação à rede
          if (a.delta !== null && b.delta !== null) return a.delta - b.delta;
          // Segundo desempate: maior quantidade de respostas 'not_done' e 'partial'
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
            showToast(`Critério [${critId}] expandido no Afunilamento.`);
          }
        }
      }, 100);
    }

    /**
     * Gera e copia para o clipboard uma pauta executiva estruturada para reuniões pedagógicas.
     */
    function copyMeetingAgendaToClipboard(scopeLabelText, targetType) {
      const user = getCurrentUser();
      const activeUnit = document.getElementById('indicatorsUnitFilter')?.value || 'ALL';
      const targetTypeName = targetType === 'coordenador' ? 'Coordenação Pedagógica' : 'Prática Docente Infantil';
      const bottlenecks = appState._lastComputedBottlenecks || [];

      if (bottlenecks.length === 0) {
        if (typeof showToast === 'function') showToast('Nenhum gargalo identificado para compor a pauta.', 'warning');
        return;
      }

      const today = new Date().toLocaleDateString('pt-BR');
      let text = `📋 PAUTA FORMATIVA DE ALINHAMENTO PEDAGÓGICO · SERTÃO CRIANÇA\n`;
      text += `📅 Data: ${today} | Escopo: ${scopeLabelText} | Segmento: ${targetTypeName}\n`;
      text += `------------------------------------------------------------\n`;
      text += `🎯 OS 3 CRITÉRIOS PRIORITÁRIOS PARA INTERVENÇÃO PEDAGÓGICA (GARGALOS):\n\n`;

      bottlenecks.forEach((b, idx) => {
        const rank = idx + 1;
        const deltaText = b.delta !== null ? `${b.delta > 0 ? '+' : ''}${b.delta}% vs. Rede Patos` : 'Sem benchmark';
        text += `${rank}. [${b.critId}] ${b.critText}\n`;
        text += `   • Localização: ${b.dimTitle} · ${b.subTitle}\n`;
        text += `   • Consistência na UE: ${b.score}% (Rede Municipal: ${b.redeScore !== null ? b.redeScore + '%' : '—'} · Δ: ${deltaText})\n`;
        text += `   • Evidências Observadas: C: ${b.consistent} | P: ${b.partial} | NR: ${b.notDone}\n`;
        text += `   • Diretriz Formativa: ${getPedagogicalActionPrompt(b.critId, b.subId, targetType)}\n\n`;
      });

      text += `💡 QUESTÕES NORTEADORAS PARA A EQUIPE:\n`;
      text += `1. Quais desafios e potências as docentes vivenciaram na rotina desses 3 critérios?\n`;
      text += `2. Que combinados e apoios pedagógicos coletivos pactuaremos para apoiar as salas neste ciclo?\n`;
      text += `------------------------------------------------------------\n`;
      text += `Sistema de Supervisão SerTão Criança · Patos/PB`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          if (typeof showToast === 'function') {
            showToast('Pauta da reunião copiada para a área de transferência! 📋');
          } else {
            alert('Pauta copiada com sucesso!');
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
      const bottlenecks = calculateTopBottlenecks(scopeHierarchy, redeHierarchy, sortMode, 3);
      appState._lastComputedBottlenecks = bottlenecks;

      const isCoord = targetType === 'coordenador';
      const audienceName = isCoord ? 'da Coordenação Pedagógica' : 'da Prática Docente';

      let cardsHtml = '';

      if (bottlenecks.length === 0) {
        cardsHtml = `
          <div style="background:#F8FAFC; border:1px dashed #CBD5E1; border-radius:10px; padding:28px 16px; text-align:center; grid-column: 1 / -1;">
            <div style="font-size:24px; margin-bottom:8px;">🎯</div>
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
              <span>🟢</span>
              <span><strong>Excelente Desempenho:</strong> Todos os critérios avaliados apresentam Consistência Forte ($\ge 80\%$). Os 3 pontos abaixo representam marcas para manutenção do padrão pedagógico.</span>
            </div>
          `;
        }

        bottlenecks.forEach((b, idx) => {
          const rank = idx + 1;
          const rankClass = rank === 1 ? 'bottleneck-rank-1' : (rank === 2 ? 'bottleneck-rank-2' : 'bottleneck-rank-3');
          const borderClass = b.severity === 'critical' ? 'bottleneck-card-critical' : (b.severity === 'warning' ? 'bottleneck-card-warning' : 'bottleneck-card-stable');
          const scoreColor = b.score >= 80 ? 'var(--green)' : (b.score >= 60 ? 'var(--yellow)' : 'var(--red)');
          const promptText = getPedagogicalActionPrompt(b.critId, b.subId, targetType);

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

                <!-- PAUTA DE ALINHAMENTO FORMATIVO -->
                <div class="bottleneck-prompt-box">
                  <strong style="display:block; margin-bottom:3px; color:#92400E;">💡 Pauta Formativa para Alinhamento:</strong>
                  ${promptText}
                </div>
              </div>

              <!-- BOTÃO DE AÇÃO: LOCALIZAR NO AFUNILAMENTO -->
              <div class="bottleneck-actions-row">
                <button type="button" class="btn btn-secondary" style="font-size:11px; padding:5px 10px; display:inline-flex; align-items:center; gap:4px; font-weight:700;" onclick="locateBottleneckCriterionInDrilldown('${b.critId}', ${b.dimIndex}, '${b.subKey}')" title="Abrir este critério na árvore completa de Afunilamento com régua dupla">
                  🔍 Ver no Afunilamento
                </button>
              </div>
            </div>
          `;
        });
      }

      return `
        <div class="bottlenecks-priority-block" id="indicatorsSectionBottlenecks">
          <div class="bottlenecks-header-row">
            <div class="bottlenecks-title-group">
              <h3>
                <span>🎯</span> Foco nos Menores Índices (Gargalos Pedagógicos)
              </h3>
              <p>
                Identificação algorítmica dos 3 critérios mais frágeis ${audienceName} em <strong>${scopeLabelText}</strong> para subsidiar a pauta de alinhamento da escola.
              </p>
            </div>

            <div class="bottlenecks-controls-group">
              <!-- ALTERNADOR DE MODO DE ORDENAÇÃO -->
              <div class="bottlenecks-toggle-pill">
                <button type="button" class="bottlenecks-toggle-btn ${sortMode === 'absolute' ? 'active' : ''}" onclick="toggleBottlenecksSortMode('absolute')" title="Ordenar pelos menores índices absolutos de consistência na escola">
                  📉 Menor Consistência
                </button>
                <button type="button" class="bottlenecks-toggle-btn ${sortMode === 'delta' ? 'active' : ''}" onclick="toggleBottlenecksSortMode('delta')" title="Ordenar pela maior defasagem negativa em relação à Rede de Patos">
                  🔻 Maior Desvio vs. Rede
                </button>
              </div>

              <!-- BOTÃO DE COPIAR PAUTA -->
              <button type="button" class="btn btn-secondary" onclick="copyMeetingAgendaToClipboard('${scopeLabelText}', '${targetType}')" style="font-size:11px; padding:5px 10px; font-weight:700; display:inline-flex; align-items:center; gap:4px;" title="Copiar pauta estruturada para reunião pedagógica">
                📋 Copiar Pauta
              </button>
            </div>
          </div>

          <!-- GRID DOS 3 CARDS DE GARGALO -->
          <div class="bottlenecks-grid">
            ${cardsHtml}
          </div>
        </div>
      `;
    }
```

---

### BLOCO 3: Ajuste no Card 4 do Grid de KPIs e Inserção do Bloco do Pilar 8

#### 3.1 Em `index.html` (Card 4 do grid superior, por volta das linhas ~15451 a ~15456):
**Localizar no Card 4:**
```html
              <div style="font-size:12px; color:${lowestDimDelta !== null && lowestDimDelta < 0 ? 'var(--red)' : 'var(--text-secondary)'}; font-weight:600; line-height:1.3;">
                ● ${lowestDimSubtitle}
              </div>
            </div>

          </div>
        </div>
```

**Substituir por:**
```html
              <div style="font-size:12px; color:${lowestDimDelta !== null && lowestDimDelta < 0 ? 'var(--red)' : 'var(--text-secondary)'}; font-weight:600; line-height:1.3;">
                ● ${lowestDimSubtitle}
              </div>
              <div style="margin-top:8px;">
                <a href="javascript:void(0)" onclick="scrollToBottlenecksBlock()" style="font-size:11px; font-weight:700; color:var(--primary); text-decoration:none; display:inline-flex; align-items:center; gap:4px;" title="Rolar para os 3 critérios prioritários de intervenção">
                  🎯 Ver os 3 Critérios Críticos ↓
                </a>
              </div>
            </div>

          </div>

          <!-- PILAR 8: BLOCO DE DIAGNÓSTICO DE PRIORIDADES FORMATIVAS: FOCO NOS MENORES ÍNDICES (GARGALOS) -->
          ${renderBottlenecksPrioritySection(scopeHierarchy, redeHierarchy, scopeLabelText, targetType)}

        </div>
```

---

### BLOCO 4: Adição de Identificador DOM para Deep-Linking nos Critérios do Afunilamento

#### 4.1 Em `index.html` (dentro da sub-aba Afunilamento, por volta da linha ~15640):
**Localizar:**
```html
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
```

**Substituir por:**
```html
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
                <div class="drilldown-sub-item" id="${critDomId}">
```

---

### BLOCO 5: Gestão Dupla de Changelog (Versão 1.02)

#### 5.1 No modal `#modalChangelog` em `index.html` (linhas ~4240 a ~4260):
1. Atualizar o botão de versão no cabeçalho do aplicativo para `📌 Versão 1.02`.
2. Adicionar o novo bloco de versão no topo da lista interna do modal `#modalChangelog`:

```html
        <!-- VERSÃO 1.02 -->
        <div class="changelog-version-card" style="border-left: 4px solid var(--primary); padding: 12px 16px; margin-bottom: 14px; background: #FFFFFF; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <span style="font-weight:800; font-size:13px; color:var(--primary-dark);">Versão 1.02</span>
            <span style="font-size:11px; color:var(--text-secondary);">21/10/2026</span>
          </div>
          <div style="font-size:12px; font-weight:700; color:var(--text-primary); margin-bottom:4px;">
            🎯 Pilar 8: Diagnóstico de Prioridades Formativas - Bloco "Foco nos Menores Índices" (Gargalos)
          </div>
          <div style="font-size:11px; color:var(--text-secondary); line-height:1.4;">
            Implementação da apresentação automática dos 3 menores critérios pedagógicos da unidade/polo para pauta imediata de alinhamento, com dupla perspectiva algorítmica (Menor Consistência vs. Maior Defasagem vs. Rede), pautas formativas sugeridas, deep-linking direto para o Afunilamento e exportação de pauta para reuniões.
          </div>
        </div>
```

#### 5.2 Em `CHANGELOG.md`:
Adicionar na tabela do Sumário Executivo:
```markdown
| **1.02** | 21/10/2026 18:00 | `intermediárias/aplicativo_v102_pilar_8_foco_menores_indices_gargalos.html` | Deliberação SerTão Criança / Pilar 8 | Pilar 8: Diagnóstico de Prioridades Formativas, Bloco "Foco nos Menores Índices" (Gargalos), identificação automática dos 3 pontos críticos, alternador de ordenação (Consistência vs. Desvio Rede), pautas sugeridas, deep-linking para Afunilamento e cópia de pauta 🎯 |
```
E criar a seção detalhada da Versão 1.02 com Inclusões, Modificações e Exclusões.

---

### BLOCO 6: Atualização da Documentação Oficial de Insights

#### 6.1 Em `docs/documento_insights_supervisao_pedagogica_20261020.md`:
Atualizar a seção do **PILAR 8** para:
```markdown
### PILAR 8: Diagnóstico de Prioridades: Bloco "Foco nos Menores Índices" (Gargalos)
> **STATUS DO PILAR: 🏗️ PLANO EXECUTIVO DETALHADO (PRONTO PARA EXECUÇÃO - ETAPA 2)**  
> **Documento Oficial Mestre de Execução:** [`./planos_de_implementacao/plano_pilar_8_foco_menores_indices_gargalos.md`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_pilar_8_foco_menores_indices_gargalos.md)  
> **Versão Alvo de Entrega:** `1.02` | **Backup Intermediário:** `intermediárias/aplicativo_v102_pilar_8_foco_menores_indices_gargalos.html`

* **Diretriz Aprovada:**  
  - Apresentação automática dos **3 menores critérios da unidade ou polo** (os pontos mais frágeis ou com maior desvio negativo em relação à rede).
  - Serve como pauta prioritária imediata para as reuniões de alinhamento e formação interna na escola.
  - Dupla perspectiva algorítmica: Menor Consistência Absoluta e Maior Desvio em Relação à Média da Rede Municipal de Patos.
  - Conexão direta com a sub-aba de Afunilamento por Dimensão (deep-linking com destaque visual).
  - Geração e cópia de pauta executiva estruturada para reuniões formativas.
```

---

## 4. Critérios de Aceite e Roteiro de Validação

### 4.1 Roteiro de Verificação Manual (Ponto a Ponto)
1. **Acesso à Aba de Indicadores (`#screenIndicators`):**
   - Com o perfil de Coordenadora (`mariana`):
     - Navegar até Indicadores ➔ sub-aba "Índices Gerais & KPIs" (`pillIndKpis`).
     - Verificar a presença imediata do novo bloco: **"🎯 Foco nos Menores Índices (Gargalos Pedagógicos)"** logo abaixo dos 4 cards de KPIs.
     - Confirmar que o bloco lista exatamente 3 critérios com ranks `#1`, `#2` e `#3`.
2. **Validação das Métricas Comparativas:**
   - Conferir se cada card de gargalo exibe a pontuação de consistência da UE (`X%`), a média da Rede Municipal de Patos (`Y%`) e o badge formatado de variação ($\Delta \pm\%$).
   - Conferir se os contadores de respostas (`C`, `P`, `NR`) refletem a realidade dos dados no escopo.
3. **Alternador de Ordenação (`Menor Consistência` vs. `Maior Desvio vs. Rede`):**
   - Clicar no botão `📉 Menor Consistência`: os critérios devem ser ordenados pelo percentual absoluto mais baixo.
   - Clicar no botão `🔻 Maior Desvio vs. Rede`: os critérios devem se reorganizar priorizando aqueles com a maior defasagem negativa em relação à média de Patos.
4. **Pauta Formativa e Cópia para Clipboard:**
   - Conferir se cada card exibe o quadro amarelo com a diretriz pedagógica (`💡 Pauta Formativa para Alinhamento`).
   - Clicar no botão `📋 Copiar Pauta`: verificar a emissão do toast de sucesso e colar no editor de texto para conferir se o texto estruturado reflete fielmente os dados dos 3 gargalos.
5. **Deep-Linking e Localização no Afunilamento:**
   - Clicar no botão `🔍 Ver no Afunilamento` de um dos critérios (ex: `#1`).
   - O sistema deve alternar instantaneamente para a sub-aba de Afunilamento (`drilldown`), expandir a Dimensão e a Subdimensão pertinentes, rolar suavemente a tela até o item e acionar a animação de pulso amarelo (`highlight-bottleneck-pulse`).
6. **Atalho no Card 4 (Dimensão Prioritária):**
   - No Card 4 do grid superior, clicar em `🎯 Ver os 3 Critérios Críticos ↓`: a página deve rolar suavemente para o contêiner `#indicatorsSectionBottlenecks`.
7. **Responsividade Mobile:**
   - Reduzir a largura do navegador para tela de smartphone ($\le 480\text{px}$):
   - Os cards devem empilhar verticalmente em 1 coluna sem estouro horizontal.
   - O alternador e botões devem manter tamanho adequado para toque.
8. **Impressão / PDF:**
   - Clicar em `📄 PDF` na barra de ferramentas: verificar que o Bloco do Pilar 8 é impresso com legibilidade, sem cortes abruptos e ocultando botões interativos (`@media print`).

---

## 5. Seção Obrigatória de Auditoria: Alterações, Adições e Exclusões no Algoritmo de Auditoria

> **DIRETRIZ MANDATÓRIA (WORKFLOW_MACOS.md - Seção 2 e 6):**
> O algoritmo de auditoria da plataforma (`audit_platform.py` e testes modulares no `index.html`) deve manter **100% de cobertura determinística da plataforma**, estruturado em módulos ("modo-a-modo"). A seguir, detalham-se as alterações, adições e exclusões específicas necessárias para cobrir integralmente o Pilar 8.

### 5.1 Atualizações no Catálogo de Módulos (`audit_platform.py`)
No arquivo `audit_platform.py`, atualizar a descrição oficial do Módulo 10 no dicionário `MODULE_CATALOG`:

```python
    'indicadores_decisao': 'Indicadores Pedagógicos, Cobertura no Bimestre (Pilar 7), Foco nos Menores Índices (Pilar 8) e Decisão',
```

### 5.2 Alterações e Adições na Engine de Testes Modular do Browser (`index.html`)
No arquivo `index.html`, dentro de `runFullPlatformAudit()`, atualizar a suíte do **Módulo 10 (`indicadores_decisao`)**:

#### A. Inclusão das Asserções Estruturais e Algorítmicas do Pilar 8:
Inserir logo após a validação do Pilar 3 e alternância de sub-abas (por volta da linha ~18580):

```javascript
              // 6. PILAR 8: VALIDAÇÃO DO BLOCO DE DIAGNÓSTICO DE PRIORIDADES (GARGALOS PEDAGÓGICOS)
              switchIndicatorsSubTab('kpis');
              const bottlenecksSection = document.getElementById('indicatorsSectionBottlenecks');
              if (!bottlenecksSection) throw new Error('Falha Pilar 8: Bloco #indicatorsSectionBottlenecks ausente no DOM');
              logger.log('Renderização do Bloco de Diagnóstico de Gargalos (Pilar 8)', true);

              // 7. PILAR 8: CÁLCULO E RANQUEAMENTO DOS 3 MENORES CRITÉRIOS (MODO ABSOLUTO)
              const sampleTopBottlenecks = calculateTopBottlenecks(ueResult, redeResult, 'absolute', 3);
              if (!sampleTopBottlenecks || sampleTopBottlenecks.length === 0) {
                throw new Error('Falha Pilar 8: calculateTopBottlenecks retornou conjunto vazio');
              }
              const firstBottleneck = sampleTopBottlenecks[0];
              if (firstBottleneck.critId !== '1.1.2') {
                throw new Error(`Falha Pilar 8: Esperado critério 1.1.2 como gargalo #1, obtido ${firstBottleneck.critId}`);
              }
              logger.log('Cálculo algorítmico do Menor Índice Absoluto (#1 Gargalo: 1.1.2 - 0% na UE)', true, `Score: ${firstBottleneck.score}%`);

              // 8. PILAR 8: CÁLCULO DO DESVIO EM RELAÇÃO À REDE (MODO DELTA)
              const sampleDeltaBottlenecks = calculateTopBottlenecks(ueResult, redeResult, 'delta', 3);
              const firstDeltaBottleneck = sampleDeltaBottlenecks[0];
              if (firstDeltaBottleneck.delta !== -50) {
                throw new Error(`Falha Pilar 8: Esperado delta de -50% para o maior desvio, obtido ${firstDeltaBottleneck.delta}%`);
              }
              logger.log('Cálculo determinístico do Maior Desvio vs. Rede Municipal (Pilar 8)', true, `Δ: ${firstDeltaBottleneck.delta}%`);

              // 9. PILAR 8: DEEP-LINKING E LOCALIZAÇÃO NO AFUNILAMENTO
              locateBottleneckCriterionInDrilldown('1.1.2', 0, 'sub_0_0');
              const drillSecActive = document.getElementById('indicatorsSectionDrilldown');
              if (!drillSecActive || drillSecActive.style.display !== 'block') {
                throw new Error('Falha Pilar 8: locateBottleneckCriterionInDrilldown não ativou a sub-aba de Afunilamento');
              }
              const targetCritEl = document.getElementById('drilldownCrit_1_1_2');
              if (!targetCritEl) {
                throw new Error('Falha Pilar 8: Elemento #drilldownCrit_1_1_2 ausente no DOM do Afunilamento');
              }
              logger.log('Validação de Deep-Linking e expansão automática de nó no Afunilamento (Pilar 8)', true);
```

### 5.3 Resumo de Alterações na Auditoria

| Tipo | Módulo | Descrição Técnica |
| :---: | :---: | :--- |
| **MODIFICAÇÃO** | `audit_platform.py` | Atualização do catálogo oficial para incluir a validação do Pilar 8 no Módulo 10 |
| **ADIÇÃO** | `index.html` (Módulo 10) | Asserção de presença e integridade do contêiner `#indicatorsSectionBottlenecks` |
| **ADIÇÃO** | `index.html` (Módulo 10) | Asserção matemática de cálculo e ranqueamento do menor índice absoluto (`score ASC`) |
| **ADIÇÃO** | `index.html` (Módulo 10) | Asserção matemática do maior desvio negativo em relação à Rede de Patos (`delta ASC`) |
| **ADIÇÃO** | `index.html` (Módulo 10) | Teste comportamental de deep-linking com alternância de sub-aba e presença de `#drilldownCrit_1_1_2` |
| **EXCLUSÃO** | Nenhuma | Nenhuma asserção prévia é removida; todas as 80 asserções existentes permanecem ativas e passam a ser 84 asserções |

---

## 6. Checklist de Execução para a Etapa 2 (Operário)

- [ ] Executar `git pull origin main` no início da tarefa.
- [ ] Aplicar Estilos CSS do Pilar 8 no arquivo `index.html`.
- [ ] Inserir os helpers e lógica de negócio (`calculateTopBottlenecks`, `renderBottlenecksPrioritySection`, etc.).
- [ ] Inserir a chamada de renderização do bloco logo abaixo de `.kpi-row` em `#indicatorsSectionKPIs`.
- [ ] Adicionar o atalho no Card 4 (*Dimensão Prioritária*).
- [ ] Inserir `id="drilldownCrit_${crit.id.replace(/\./g, '_')}"` nos itens do Afunilamento.
- [ ] Atualizar o Módulo 10 na engine modular de testes do `index.html` e em `audit_platform.py`.
- [ ] Atualizar o Changelog duplo (Versão `1.02` no `CHANGELOG.md` e no `#modalChangelog` do `index.html`).
- [ ] Atualizar o status do Pilar 8 no arquivo `docs/documento_insights_supervisao_pedagogica_20261020.md`.
- [ ] Aplicar dupla checagem lendo os trechos editados.
- [ ] Salvar cópia em `intermediárias/aplicativo_v102_pilar_8_foco_menores_indices_gargalos.html`.
- [ ] Sincronizar os arquivos espelhados (`gestor supervisao_patos/index.html` e `gestor supervisao_patos/firebase_deploy/public/index.html`).
- [ ] Executar checagem de concorrência (`git fetch origin main`).
- [ ] Criar commit semântico: `feat: implementar pilar 8 - bloco foco nos menores indices e diagnostico de gargalos pedagogicos (v1.02)`.
- [ ] Enviar com `git push origin main` (deploy automático no GitHub Pages).
- [ ] Executar `python3 audit_platform.py --silent-on-success` e reportar estritamente se houverem falhas.
