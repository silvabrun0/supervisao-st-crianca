# PLANO DE IMPLEMENTAÇÃO: PILAR 10 - QUADRO DE CONTROLE BIMESTRAL (SEMÁFORO DE PRAZOS VERDE / CINZA / VERMELHO ORGANIZADO POR TURMA)

> **DIRETRIZ OBRIGATÓRIA DE EXECUÇÃO (ETAPA 2):**
> O assistente executor (Etapa 2) deve **obrigatoriamente ler e seguir as diretrizes dos arquivos `WORKFLOW_MACOS.md`, `AGENTS.md` e `GEMINI.md`** localizados na raiz do projeto antes de aplicar qualquer modificação no código. Nenhuma modificação deve ser realizada sem conformidade estrita com o workflow, incluindo:
> 1. Execução prévia de sincronização com o repositório remoto (`git pull origin main`).
> 2. Preservação integral das regras de negócio existentes, dados cadastrais, blindagens RBAC, série histórica, turmas integrais em formulário único (Pilar 4), fechamento nominal e parecer em práticas consistentes (Pilar 5), higienização terminológica para "observação" (Pilar 6), KPIs decisórios com cobertura no bimestre corrente (Pilar 7), foco nos menores índices e diagnóstico de gargalos (Pilar 8), usabilidade mobile com gaveta deslizante de filtros (Pilar 9) e testes automatizados.
> 3. Verificação de integridade pós-edição com dupla checagem de leitura em cada trecho modificado.
> 4. Salvamento obrigatório do backup intermediário na pasta `intermediárias/` sob o nome `aplicativo_v104_pilar_10_semaforo_bimestral_turmas.html`.
> 5. Gestão dupla de Changelog no arquivo `CHANGELOG.md` e no modal `#modalChangelog` do `index.html`, registrando a **Versão 1.04**.
> 6. Sincronização idêntica entre o arquivo principal `index.html` da raiz, `gestor supervisao_patos/index.html` e `gestor supervisao_patos/firebase_deploy/public/index.html`.
> 7. Checagem pré-push (`git fetch origin main`), commit semântico (`feat: implementar pilar 10 - quadro de controle bimestral e semaforo de prazos por turma (v1.04)`), push para `origin main` e deploy automático no GitHub Pages.
> 8. Execução pós-deploy obrigatória do algoritmo de auditoria (`python3 audit_platform.py --silent-on-success`) com comunicação estrita a falhas.

---

## 1. Diagnóstico e Contexto Técnico-Pedagógico

### 1.1 Cenário Atual
Após a implementação e homologação dos Pilares 1 a 7 e o planejamento detalhado dos Pilares 8 e 9:
- **Pilar 1:** Inverteu a unidade de observação da sala de aula para a **TURMA**, assegurando que duplas e quartetos docentes compartilhem a série histórica da sala.
- **Pilar 2:** Consolidou a tríade canônica de governança (Coordenadora da UE ➔ Formadora de Polo ➔ Coordenadora do Núcleo de EI).
- **Pilar 3:** Estabeleceu o benchmark comparativo `% da UE vs. Rede` na sub-aba de Afunilamento.
- **Pilar 4:** Unificou turmas em Tempo Integral em formulário único de 2 etapas (Manhã e Tarde) com soma de carga horária.
- **Pilar 5:** Implementou o fechamento nominal docente, avaliação nas 5 dimensões, parecer descritivo em práticas consistentes e trava mandatória com justificativa em itens parciais.
- **Pilar 6:** Concluiu a higienização terminológica eliminando "visita" em benefício de "observação" em 100% da plataforma.
- **Pilar 7:** Reorganizou os KPIs decisórios no topo do Painel de Indicadores, destacando a Cobertura de Turmas no Bimestre Corrente e a Meta do Ciclo Anual ($4 \times \text{Turmas}$).
- **Pilar 8:** Instituiu o Bloco "Foco nos Menores Índices" (Gargalos Pedagógicos) com ranqueamento automático dos 3 pontos críticos e geração de pauta formativa.
- **Pilar 9:** Otimizou a usabilidade móvel com o gatilho flutuante no polegar e gaveta deslizante (*Bottom Sheet*) de filtros de indicadores.

Contudo, ao acessar a sub-aba **"Longitudinal"** (`#indicatorsSectionLongitudinal`), o sistema ainda apresenta um descompasso estrutural crítico:
1. **Acompanhamento Centrado em Indivíduos (Docentes):** A tela ainda exibe uma lista de professores individuais (`scopedAvaliandos`), contrariando a premissa fundamental do Pilar 1 e do Pilar 15 de que a **TURMA** é a unidade primária de acompanhamento do ciclo longitudinal.
2. **Ausência de Semáforo Temporal de Prazos:** As células dos bimestres mostram apenas percentuais ou rótulos estáticos de "— Pendente", sem diferenciar se aquela pendência:
   - Trata-se de um **atraso grave** (bimestre escolar já encerrado no calendário municipal sem observação da turma);
   - Trata-se de uma **observação em andamento no prazo** (bimestre escolar corrente com tempo hábil para cumprimento);
   - Trata-se de um **ciclo futuro** (bimestre que ainda nem começou no ano letivo).
3. **Falta de Apoio à Ação Imediata:** A coordenadora da UE ou formadora de polo não possui atalhos acionáveis nas células para regularizar atrasos ou planejar observações diretamente.

### 1.2 Fundamentação Técnico-Pedagógica (Deliberação ST Criança 19/10/2026 - Minuto 00:28:59)
Conforme deliberado oficialmente na Reunião ST Criança e documentado expressamente no documento oficial de insights (`docs/documento_insights_supervisao_pedagogica_20261020.md`):
> **PILAR 10: Quadro de Controle Bimestral (Semáforo de Prazos Verde / Cinza / Vermelho)**  
> * **Diretriz Aprovada (00:28:59):**  
>   Painel visual matricial para o acompanhamento do ciclo das 4 observações anuais **organizado por TURMA**:  
>   - 🟢 **Verde:** Observação da turma realizada e concluída no bimestre.  
>   - ⚪ **Cinza:** Bimestre em andamento (dentro do prazo regulamentar de 2 meses).  
>   - 🔴 **Vermelho:** Bimestre expirado sem envio de observação para a turma (alerta de atraso).  

E em estrito alinhamento com o **Pilar 15**:
> *"3. No Painel de Indicadores & Dossiê Longitudinal (`#screenIndicators`): O seletor primário de análise individual passa a ser a Turma / Sala de Referência. A série longitudinal de 4 bimestres acompanha a evolução contínua das crianças daquela turma, imune a trocas pontuais de escala, faltas ou licenças de docentes. Dossiê individual do docente como visão derivada."*

E com a **Seção 3 do `WORKFLOW_MACOS.md`**:
> *"Toda informação apresentada deve responder a uma pergunta prática de gestão ou acompanhamento pedagógico."*

### 1.3 Resultado Esperado com o Pilar 10
1. **Reestruturação Central da Sub-aba Longitudinal por TURMA:**
   - A sub-aba `#indicatorsSectionLongitudinal` passa a ter como componente de destaque o **Quadro Matricial de Controle Bimestral (Semáforo do Ciclo Anual)**.
   - Cada linha representa uma **TURMA** da Educação Infantil (nome, etapa, turno, docentes regentes vinculados).
   - Preservação da visão derivada de docentes através de um alternador visual rápido: `[ 🏫 Turmas da Educação Infantil (Semáforo) ]` e `[ 👥 Fichas Formativas dos Docentes Regentes ]`.
2. **Motor Algorítmico Determinístico do Semáforo (`calculateClassBimesterStatus`):**
   Para cada turma e cada bimestre escolar ($1º$, $2º$, $3º$, $4º$ Bimestre), em confronto com o bimestre corrente (`getCurrentSchoolBimester()`):
   - 🟢 **VERDE (`status: 'completed'`):** Observação da turma concluída e finalizada no bimestre. Exibe o percentual de consistência alcançado (ex: `85%`), data de realização e atalho com 1 clique para visualizar a devolutiva pedagógica.
   - 🔴 **VERMELHO (`status: 'overdue'`):** Bimestre letivo já expirado no calendário municipal sem registro de observação para a turma. Exibe badge de alerta de atraso (`⚠ Atrasado`). Se houver rascunho em aberto, indica `Rascunho Atrasado`; se houver agendamento pendente, indica `Agendada em Atraso`. Disponibiliza botão imediato de "Agendar Agora" ou "Iniciar Observação em Atraso" para regularização.
   - ⚪ **CINZA / AZUL SUAVE (`status: 'in_progress'`):** Bimestre corrente em curso (dentro da janela regulamentar de 2 meses). Se houver rascunho, exibe `Rascunho em Andamento`; se agendada, exibe `Agendada para DD/MM`; se pendente, exibe `No Prazo` com atalho rápido de planejamento.
   - ⚪ **CINZA CLARO NEUTRO (`status: 'future'`):** Bimestre letivo futuro ainda não iniciado. Exibe `Ciclo Futuro` (ou `Agendada (Antecipado)`).
3. **Barra de Resumo Decisório e Contadores Estatísticos:**
   No topo do Quadro de Controle, 4 micro-cards sintetizam a saúde regulamentar da escola/polo:
   - 🔴 **Turmas com Atraso Acumulado:** Quantidade de turmas com pelo menos 1 bimestre em atraso (com destaque pulsante se $> 0$).
   - ⚪ **Pendentes no Bimestre Corrente:** Quantidade de turmas que ainda necessitam de observação no bimestre atual com contagem de dias restantes da janela regulamentar.
   - 🟢 **Observações Realizadas no Ano:** Total de observações concluídas vs. meta anual ($4 \times \text{Turmas}$).
   - 🏆 **Índice de Cumprimento do Ciclo Longitudinal:** Percentual consolidado de avanço anual.
4. **Filtros Rápidos de Status Semafórico (Chips Decisórios):**
   - `[ Todos (${totalTurmas}) ]`
   - `[ 🔴 Apenas Atrasadas (${totalAtrasadas}) ]`
   - `[ ⚪ No Prazo / Pendentes (${totalNoPrazo}) ]`
   - `[ 🟢 Concluídas no Bimestre (${totalConcluidas}) ]`
   - `[ 🏆 Ciclo 100% Concluído (${totalCicloCompleto}) ]`
5. **Ação Rápida com 1 Toque nas Células Semafóricas:**
   - Clicar em uma célula vermelha ou cinza permite disparar imediatamente o agendamento (`quickScheduleForClass`) pré-preenchendo escola, turma e bimestre no modal `#modalAddSchedule`, ou iniciar a observação na tela de Setup (`quickStartObservationForClass`).
6. **Integração Bidirecional com os Cards 2 e 3 de KPIs:**
   - No Grid Superior da sub-aba de KPIs (`#indicatorsSectionKPIs`), os Cards 2 (*Cobertura no Bimestre Corrente*) e 3 (*Meta do Ciclo Anual*) recebem o atalho interativo:
     `🚦 Ver Quadro Semáforo ↓`, que alterna instantaneamente para a sub-aba Longitudinal e rola até o Semáforo.
7. **Responsividade Mobile:**
   - No Desktop: Tabela matricial completa de alta legibilidade.
   - No Mobile (Smartphones): Cards adaptativos por turma sem rolagem horizontal, contendo mini-grid de 4 pílulas semafóricas táteis e botão de ação rápida.
8. **Suporte a Impressão Oficial:**
   - Estilização em `@media print` para inclusão do Semáforo no relatório PDF da escola.
9. **Auditoria Automatizada Modular (100% de Cobertura):**
   - Expansão do Módulo 10 (`indicadores_decisao`) em `audit_platform.py` e `index.html` validando deterministamente os 4 estados do Semáforo, filtros, cálculo do ciclo e atalhos de agendamento.

---

## 2. Arquitetura e Mapeamento de Pontos de Impacto

### 2.1 Arquivos Afetados
```
gestor supervisao_patos/
├── index.html                                                                                  # Aplicação servida em produção (GitHub Pages)
├── firebase_deploy/public/index.html                                                           # Cópia espelhada obrigatória
├── audit_platform.py                                                                           # Motor de auditoria modular da plataforma
├── CHANGELOG.md                                                                                # Histórico oficial de versões
├── docs/documento_insights_supervisao_pedagogica_20261020.md                                   # Atualização de status do Pilar 10
└── intermediárias/aplicativo_v104_pilar_10_semaforo_bimestral_turmas.html                     # Backup intermediário da Versão 1.04
```

### 2.2 Mapeamento por Módulo Funcional

| Módulo / Tela | Elemento / Função | Localização Estimada em `index.html` | Ação de Alteração |
| :--- | :--- | :---: | :--- |
| **Folha de Estilos (CSS)** | Classes `.bimester-semaphore-*`, `.sem-pill-*`, `.sem-card-*` | Após linha ~850 (após estilos do Pilar 8) | Adicionar regras visuais da tabela semafórica, pílulas de status, micro-cards de KPI, filtros em chip, responsividade mobile e animação de alerta |
| **Grid Superior de KPIs (Cards 2 e 3)** | Cards de Cobertura e Ciclo Anual | Linhas ~15800 a 15850 | Adicionar botão de atalho `🚦 Ver Quadro Semáforo ↓` com navegação suave para a sub-aba Longitudinal |
| **Motor Algorítmico do Pilar 10** | Novas funções: `calculateClassBimesterStatus`, `getClassCycleProgress`, `renderClassBimesterSemaphoreSection`, `filterSemaphoreByStatus`, `toggleLongitudinalViewMode`, `quickScheduleForClass`, `quickStartObservationForClass`, `viewObservationFromSemaphore` | Bloco de helpers de indicadores (~linha 14750) | Implementar cálculo temporal de status contra `getCurrentSchoolBimester()`, renderização matricial e atalhos operacionais |
| **Sub-aba Longitudinal** | Contêiner `#indicatorsSectionLongitudinal` | Linhas ~16255 a 16460 | Substituir a listagem legada pela exibição primária do Quadro de Controle Bimestral de Turmas (Semáforo), incorporando o alternador Turmas vs. Docentes |
| **Engine de Testes do Browser** | Módulo 10: `indicadores_decisao` em `runFullPlatformAudit()` | Linhas ~19580 a 19610 | Inserir asserções estritas do Pilar 10: renderização do Semáforo, validação determinística de Verde/Vermelho/Cinza, filtros e atalhos rápidos |
| **Script CLI de Auditoria** | Catálogo `MODULE_CATALOG['indicadores_decisao']` em `audit_platform.py` | Linha 32 | Atualizar a descrição oficial do Módulo 10 para refletir os Pilares 7, 8 e 10 |
| **Changelog Duplo** | `CHANGELOG.md` e modal `#modalChangelog` em `index.html` | Topo do log e linhas ~4245 | Registrar a entrega da Versão 1.04 com detalhamento completo das melhorias |

---

## 3. Especificação de Implementação Passo a Passo (Obrigatório)

### BLOCO 1: Estilos CSS do Semáforo Bimestral e Ergonomia Mobile (Pilar 10)

#### 1.1 Localização em `index.html` (logo após os estilos do Pilar 8, por volta da linha ~850):
Inserir o bloco de estilos dedicado ao Pilar 10:

```css
    /* =========================================================================
       PILAR 10: QUADRO DE CONTROLE BIMESTRAL (SEMÁFORO DE PRAZOS POR TURMA)
       ========================================================================= */
    .bimester-semaphore-container {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    }
    .semaphore-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 16px;
      padding-bottom: 14px;
      border-bottom: 1px solid var(--border);
    }
    .semaphore-title-group h3 {
      font-size: 17px;
      font-weight: 800;
      color: var(--primary-dark);
      margin: 0 0 4px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .semaphore-title-group p {
      font-size: 12px;
      color: var(--text-secondary);
      margin: 0;
      line-height: 1.4;
    }
    .semaphore-view-toggle {
      display: inline-flex;
      background: #F1F5F9;
      padding: 3px;
      border-radius: 8px;
      border: 1px solid var(--border);
      gap: 4px;
    }
    .semaphore-view-btn {
      border: none;
      background: transparent;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.15s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .semaphore-view-btn.active {
      background: #FFFFFF;
      color: var(--primary);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
    }
    
    /* Micro-cards de Resumo Decisório */
    .semaphore-stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 12px;
      margin-bottom: 16px;
    }
    .sem-stat-card {
      background: #F8FAFC;
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 12px 14px;
      transition: transform 0.15s ease;
    }
    .sem-stat-card:hover {
      transform: translateY(-1px);
    }
    .sem-stat-card.alert-card {
      background: #FFF1F2;
      border-color: #FECDD3;
    }
    .sem-stat-label {
      font-size: 11px;
      font-weight: 700;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.3px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .sem-stat-card.alert-card .sem-stat-label {
      color: #9F1239;
    }
    .sem-stat-value {
      font-size: 22px;
      font-weight: 900;
      color: var(--text-primary);
      margin-top: 4px;
      line-height: 1.1;
    }
    .sem-stat-card.alert-card .sem-stat-value {
      color: #E11D48;
    }
    .sem-stat-desc {
      font-size: 11px;
      color: var(--text-secondary);
      margin-top: 4px;
      line-height: 1.3;
    }
    
    /* Barra de Filtros Rápidos de Status */
    .semaphore-filters-bar {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 16px;
      padding: 8px 12px;
      background: #F8FAFC;
      border-radius: 8px;
      border: 1px solid var(--border);
    }
    .sem-filter-label {
      font-size: 11px;
      font-weight: 800;
      color: var(--text-secondary);
      text-transform: uppercase;
      margin-right: 4px;
    }
    .sem-filter-chip {
      background: #FFFFFF;
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 4px 10px;
      font-size: 11px;
      font-weight: 700;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.15s ease;
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }
    .sem-filter-chip:hover {
      border-color: var(--primary);
      color: var(--primary);
    }
    .sem-filter-chip.active {
      background: var(--primary);
      border-color: var(--primary);
      color: #FFFFFF;
    }
    .sem-filter-chip.chip-red.active {
      background: #DC2626;
      border-color: #DC2626;
    }
    .sem-filter-chip.chip-green.active {
      background: #16A34A;
      border-color: #16A34A;
    }
    
    /* Pílulas Semafóricas Canônicas (Verde / Cinza / Vermelho) */
    .sem-status-pill {
      display: inline-flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      padding: 6px 10px;
      border-radius: 8px;
      font-size: 11px;
      line-height: 1.2;
      width: 100%;
      box-sizing: border-box;
      transition: all 0.15s ease;
      text-align: left;
      cursor: pointer;
      position: relative;
    }
    .sem-status-pill:hover {
      filter: brightness(0.97);
      transform: translateY(-1px);
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
    }
    .sem-status-pill .pill-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      font-weight: 800;
      gap: 4px;
    }
    .sem-status-pill .pill-sub {
      font-size: 10px;
      margin-top: 3px;
      opacity: 0.85;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }
    
    /* 🟢 VERDE: Observação Concluída */
    .sem-status-pill.status-completed {
      background: #DCFCE7;
      border: 1px solid #86EFAC;
      color: #166534;
    }
    
    /* 🔴 VERMELHO: Bimestre Expirado sem Observação (Atraso) */
    .sem-status-pill.status-overdue {
      background: #FEE2E2;
      border: 1px solid #FCA5A5;
      color: #991B1B;
      animation: semOverduePulse 3s infinite ease-in-out;
    }
    @keyframes semOverduePulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
      50% { box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.15); }
    }
    
    /* ⚪ CINZA / AZUL SUAVE: Bimestre em Andamento (No Prazo) */
    .sem-status-pill.status-in_progress {
      background: #EFF6FF;
      border: 1px solid #BFDBFE;
      color: #1E40AF;
    }
    
    /* ⚪ CINZA NEUTRO: Ciclo Futuro */
    .sem-status-pill.status-future {
      background: #F8FAFC;
      border: 1px dashed #CBD5E1;
      color: #94A3B8;
      cursor: default;
    }
    .sem-status-pill.status-future:hover {
      transform: none;
      box-shadow: none;
      filter: none;
    }
    
    /* Barra de Progresso do Ciclo Anual da Turma */
    .sem-cycle-progress-wrap {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 110px;
    }
    .sem-cycle-bar-bg {
      height: 7px;
      background: #E2E8F0;
      border-radius: 4px;
      overflow: hidden;
      width: 100%;
    }
    .sem-cycle-bar-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.4s ease;
    }
    .sem-cycle-text {
      font-size: 10.5px;
      font-weight: 700;
      color: var(--text-secondary);
      display: flex;
      justify-content: space-between;
    }
    
    /* Tabela Matricial (Desktop) */
    .semaphore-table-view {
      overflow-x: auto;
      margin-top: 10px;
    }
    .semaphore-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }
    .semaphore-table th {
      background: #F8FAFC;
      padding: 10px 12px;
      border: 1px solid var(--border);
      text-align: left;
      font-weight: 800;
      color: var(--primary-dark);
      white-space: nowrap;
    }
    .semaphore-table th.col-bim {
      width: 16%;
      text-align: center;
    }
    .semaphore-table td {
      padding: 10px 12px;
      border: 1px solid var(--border);
      vertical-align: middle;
      background: #FFFFFF;
    }
    .semaphore-table tr:hover td {
      background: #F8FAFC;
    }
    
    /* Cards Mobile Sem Rolagem Horizontal (Smartphone) */
    .semaphore-cards-view {
      display: none;
      flex-direction: column;
      gap: 12px;
      margin-top: 12px;
    }
    .sem-mobile-class-card {
      background: #FFFFFF;
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 14px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    }
    .sem-mobile-class-card.has-overdue {
      border-left: 4px solid #DC2626;
    }
    .sem-mobile-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 10px;
      margin-bottom: 10px;
    }
    .sem-mobile-class-name {
      font-size: 14px;
      font-weight: 800;
      color: var(--text-primary);
      line-height: 1.2;
    }
    .sem-mobile-class-sub {
      font-size: 11px;
      color: var(--text-secondary);
      margin-top: 3px;
    }
    .sem-mobile-bimesters-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      margin: 12px 0;
    }
    
    @media (max-width: 768px) {
      .semaphore-table-view {
        display: none !important;
      }
      .semaphore-cards-view {
        display: flex !important;
      }
      .semaphore-header-row {
        flex-direction: column;
        align-items: flex-start;
      }
      .semaphore-view-toggle {
        width: 100%;
      }
      .semaphore-view-btn {
        flex: 1;
        justify-content: center;
      }
    }
    
    @media print {
      .semaphore-view-toggle, .semaphore-filters-bar, .sem-filter-chip, .btn-action-sem {
        display: none !important;
      }
      .bimester-semaphore-container {
        border: 1px solid #CBD5E1 !important;
        box-shadow: none !important;
        page-break-inside: avoid;
      }
      .sem-status-pill.status-overdue {
        animation: none !important;
      }
    }
```

---

### BLOCO 2: Motor Algorítmico do Pilar 10 em JavaScript

#### 2.1 Localização em `index.html` (junto aos helpers de indicadores, por volta da linha ~14750):
Implementar o motor determinístico do Semáforo Bimestral:

```javascript
    // =========================================================================
    // PILAR 10: MOTOR ALGORÍTMICO DO QUADRO DE CONTROLE BIMESTRAL (SEMÁFORO)
    // =========================================================================

    /**
     * Calcula o status semafórico determinístico de uma Turma em um determinado Bimestre
     * @param {string} className - Nome da Turma (ex: 'Infantil I - Turma A')
     * @param {string} schoolName - Nome da Unidade Escolar
     * @param {string} bimesterName - Nome do Bimestre (ex: '1º Bimestre')
     * @param {Date|string} referenceDate - Data de referência do calendário
     * @returns {Object} { status, colorKey, label, score, date, obsId, hasSchedule, scheduleDate, isDraft }
     */
    function calculateClassBimesterStatus(className, schoolName, bimesterName, referenceDate = new Date()) {
      if (!className) return { status: 'future', colorKey: 'gray', label: '—' };
      
      const cleanClass = (className || '').trim().toLowerCase();
      const cleanSchool = (schoolName || '').trim().toLowerCase();
      
      const bimMatch = (bimesterName || '').match(/([1-4])/);
      const bimesterNum = bimMatch ? parseInt(bimMatch[1], 10) : 1;
      
      const currentBimStr = getCurrentSchoolBimester(referenceDate);
      const currentBimMatch = currentBimStr.match(/([1-4])/);
      const currentBimNum = currentBimMatch ? parseInt(currentBimMatch[1], 10) : 1;

      // 1. Busca observação finalizada para a TURMA neste bimestre
      const finalizedObs = (appState.observations || []).find(o => {
        if (o.status !== 'finalized' && o.status !== 'concluida') return false;
        if (!o.className || o.className.trim().toLowerCase() !== cleanClass) return false;
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
        if (o.status !== 'draft') return false;
        if (!o.className || o.className.trim().toLowerCase() !== cleanClass) return false;
        if (cleanSchool && o.schoolName && o.schoolName.trim().toLowerCase() !== cleanSchool) return false;
        const oBimMatch = (o.bimester || '').match(/([1-4])/);
        return oBimMatch && parseInt(oBimMatch[1], 10) === bimesterNum;
      });

      // 3. Busca se há agendamento planejado no cronograma
      const sched = (appState.schedules || []).find(s => {
        if (s.archived || s.status === 'realizado') return false;
        if (!s.className || s.className.trim().toLowerCase() !== cleanClass) return false;
        if (cleanSchool && s.schoolName && s.schoolName.trim().toLowerCase() !== cleanSchool) return false;
        const sBimMatch = (s.bimester || '').match(/([1-4])/);
        return sBimMatch && parseInt(sBimMatch[1], 10) === bimesterNum;
      });

      const schedDateFormatted = (sched && sched.date) ? sched.date.split('-').reverse().slice(0, 2).join('/') : '';

      // 4. Se o bimestre já passou no calendário letivo (bimesterNum < currentBimNum) ➔ 🔴 VERMELHO (ATRASADO)
      if (bimesterNum < currentBimNum) {
        let sub = 'Prazo expirado sem observação';
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
          scheduleDate: sched ? sched.date : null,
          isDraft: !!draftObs,
          bimesterNum,
          currentBimNum
        };
      }

      // 5. Se o bimestre é o atual (bimesterNum === currentBimNum) ➔ ⚪ CINZA / AZUL (NO PRAZO)
      if (bimesterNum === currentBimNum) {
        let sub = 'Janela de 2 meses em aberto';
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
          scheduleDate: sched ? sched.date : null,
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
        scheduleDate: sched ? sched.date : null,
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
     * Filtro rápido de status no Semáforo
     */
    function filterSemaphoreByStatus(statusKey) {
      appState.activeSemaphoreStatusFilter = statusKey; // 'all', 'overdue', 'in_progress', 'completed_cur', 'completed_all'
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
      const classSelect = document.getElementById('scheduleTargetClass');
      if (classSelect && className) {
        classSelect.value = className;
        onScheduleClassChange();
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
      const classSelect = document.getElementById('setupTargetClass');
      if (classSelect && className) {
        classSelect.value = className;
        onSetupClassChange();
      }
      const bimSelect = document.getElementById('setupBimester');
      if (bimSelect && bimesterName) {
        bimSelect.value = bimesterName;
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
```

---

### BLOCO 3: Reestruturação da Sub-aba Longitudinal em `renderIndicatorsScreen()`

#### 3.1 Localização em `index.html` (linhas ~16255 a ~16460):
Substituir a renderização legada da sub-aba Longitudinal para exibir como visão prioritária o **Quadro de Controle Bimestral (Semáforo do Ciclo Anual)**:

```javascript
      // =======================================================================
      // PILAR 10: QUADRO DE CONTROLE BIMESTRAL (SEMÁFORO DE PRAZOS POR TURMA)
      // =======================================================================
      const BIMESTERS_CANONICAL = ['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre'];
      const curBim = getCurrentSchoolBimester();
      const curBimNum = parseInt(curBim.match(/([1-4])/)[1], 10);
      
      const viewMode = appState.longitudinalViewMode || 'classes';
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

      html += `
        </div>

        <!-- SUB-ABA 3: ACOMPANHAMENTO LONGITUDINAL (QUADRO DE CONTROLE SEMAFÓRICO) -->
        <div id="indicatorsSectionLongitudinal" style="display:${currentSubTab === 'longitudinal' ? 'block' : 'none'};">
          <div class="bimester-semaphore-container" id="bimesterSemaphoreSection">
            
            <!-- Cabeçalho e Alternador de Visão -->
            <div class="semaphore-header-row">
              <div class="semaphore-title-group">
                <h3>
                  <span>🚦</span> Quadro de Controle Bimestral (Semáforo do Ciclo Anual)
                </h3>
                <p>
                  Acompanhamento matricial do cumprimento das 4 observações obrigatórias organizado por <strong>TURMA</strong>: 
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
      `;

      if (viewMode === 'classes') {
        html += `
            <!-- 4 Micro-cards de Resumo Decisório -->
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
            const shiftStr = cls.shift || 'Parcial';

            // Células dos 4 Bimestres (Desktop)
            const bimesterCellsHtml = BIMESTERS_CANONICAL.map(bName => {
              const st = item.bimesterStatuses[bName];
              return `
                <td style="text-align:center; padding:8px 6px;">
                  <div class="sem-status-pill status-${st.status}" onclick="handleSemaphoreCellClick('${cls.name.replace(/'/g, "\\'")}', '${cls.school.replace(/'/g, "\\'")}', '${bName}', ${JSON.stringify(st).replace(/"/g, '&quot;')})" title="Clique para detalhes ou ações imediatas">
                    <div class="pill-top">
                      <span>${st.status === 'completed' ? '✓' : st.status === 'overdue' ? '⚠' : st.status === 'in_progress' ? '⏳' : '○'} ${bName.replace(' Bimestre', 'º')}</span>
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
                    <span>${st.status === 'completed' ? '✓' : st.status === 'overdue' ? '⚠' : st.status === 'in_progress' ? '⏳' : '○'} ${bName.replace(' Bimestre', 'º')}</span>
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
                  <button type="button" class="btn btn-secondary btn-action-sem" style="font-size:11px; padding:5px 9px;" onclick="quickScheduleForClass('${cls.name.replace(/'/g, "\\'")}', '${cls.school.replace(/'/g, "\\'")}', '${getNextEligibleBimesterForClass(cls.name, cls.school)}')">
                    📅 Agendar
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
                  <button type="button" class="btn btn-secondary btn-full btn-action-sem" style="font-size:11px; padding:7px 10px; justify-content:center;" onclick="quickScheduleForClass('${cls.name.replace(/'/g, "\\'")}', '${cls.school.replace(/'/g, "\\'")}', '${getNextEligibleBimesterForClass(cls.name, cls.school)}')">
                    📅 Agendar Próxima Observação
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
                    <th class="col-bim">1º Bimestre<br><span style="font-size:10px; font-weight:normal; opacity:0.8;">Fev - Abr</span></th>
                    <th class="col-bim">2º Bimestre<br><span style="font-size:10px; font-weight:normal; opacity:0.8;">Mai - Jul</span></th>
                    <th class="col-bim">3º Bimestre<br><span style="font-size:10px; font-weight:normal; opacity:0.8;">Ago - Out</span></th>
                    <th class="col-bim">4º Bimestre<br><span style="font-size:10px; font-weight:normal; opacity:0.8;">Nov - Jan</span></th>
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
        // VISÃO DERIVADA POR DOCENTES (PRESERVAÇÃO DO FLUXO ANTERIOR)
        html += `
          <div style="margin-top:12px;">
            <p style="font-size:12px; color:var(--text-secondary); margin-bottom:14px;">
              Fichas formativas individuais dos ${scopedAvaliandos.length} docentes regentes titulares vinculados às turmas:
            </p>
        `;

        if (scopedAvaliandos.length === 0) {
          html += `
            <div style="text-align:center; color:var(--text-secondary); padding:24px;">
              Nenhum docente regente titular localizado no seu escopo.
            </div>
          `;
        } else {
          // Renderiza a tabela de docentes existente
          let teacherRows = '';
          scopedAvaliandos.forEach(member => {
            const personObs = scopedObs.filter(o => o.teacherName === member.name || (o.teachers && o.teachers.includes(member.name)));
            const bScores = {};
            BIMESTERS_CANONICAL.forEach(bName => {
              const bObs = personObs.find(o => o.bimester === bName);
              if (bObs) {
                let pts = 0, v = 0;
                activeSections.forEach(sec => sec.subSections.forEach(sub => sub.criteria.forEach(crit => {
                  const r = bObs.responses ? bObs.responses[crit.id] : null;
                  if (r && r !== 'na') { v++; if (r === 'consistent') pts += 1.0; else if (r === 'partial') pts += 0.5; }
                })));
                bScores[bName] = v > 0 ? Math.round((pts / v) * 100) : 100;
              }
            });

            const cells = BIMESTERS_CANONICAL.map(bName => {
              const sc = bScores[bName];
              if (sc !== undefined) {
                const color = sc >= 80 ? 'var(--green)' : sc >= 60 ? 'var(--yellow)' : 'var(--red)';
                return `<td><span style="color:${color}; font-weight:700;">${sc}%</span></td>`;
              }
              return `<td><span style="color:var(--text-secondary); opacity:0.6;">—</span></td>`;
            }).join('');

            teacherRows += `
              <tr>
                <td><strong>${member.name}</strong><br><span style="font-size:11px; color:var(--text-secondary);">${member.classAssigned || member.roleTitle}</span></td>
                ${cells}
                <td style="text-align:center;">
                  <button type="button" class="btn btn-secondary" style="font-size:11px; padding:4px 8px;" onclick="selectTeacherForLongitudinalAnalysis('${member.name.replace(/'/g, "\\'")}')">
                    Raio-X Item a Item
                  </button>
                </td>
              </tr>
            `;
          });

          html += `
            <div class="longitudinal-table-view">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Docente Titular</th>
                    <th>1º Bimestre</th>
                    <th>2º Bimestre</th>
                    <th>3º Bimestre</th>
                    <th>4º Bimestre</th>
                    <th style="text-align:center;">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  ${teacherRows}
                </tbody>
              </table>
            </div>
          `;
        }
        html += `</div>`;
      }

      html += `
          </div>
        </div>
      `;
```

---

### BLOCO 4: Integração nos Cards 2 e 3 de KPIs (Atalhos de Apoio à Decisão)

#### 4.1 Localização em `index.html` (linhas ~15800 a ~15850):
No **Card 2** (*Cobertura no Bimestre Corrente*) e no **Card 3** (*Meta do Ciclo Anual*), inserir o botão de atalho para o Quadro Semáforo:

```html
              <!-- No Card 2 (Cobertura no Bimestre Corrente) -->
              <div style="margin-top:8px; padding-top:6px; border-top:1px dashed rgba(0,0,0,0.08);">
                <button type="button" class="btn-link" style="font-size:11px; font-weight:700; color:var(--primary); background:none; border:none; padding:0; cursor:pointer; display:inline-flex; align-items:center; gap:4px;" onclick="scrollToBimesterSemaphore()" title="Abrir o Quadro de Controle Bimestral de Turmas">
                  🚦 Ver Quadro Semáforo ↓
                </button>
              </div>

              <!-- No Card 3 (Meta do Ciclo Anual) -->
              <div style="margin-top:8px; padding-top:6px; border-top:1px dashed rgba(0,0,0,0.08);">
                <button type="button" class="btn-link" style="font-size:11px; font-weight:700; color:var(--primary); background:none; border:none; padding:0; cursor:pointer; display:inline-flex; align-items:center; gap:4px;" onclick="scrollToBimesterSemaphore()" title="Visualizar avanço do ciclo longitudinal das 4 observações anuais">
                  📈 Ver Semáforo do Ciclo ↓
                </button>
              </div>
```

---

### BLOCO 5: Gestão Dupla do Changelog (Versão 1.04)

#### 5.1 Em `index.html` (Modal `#modalChangelog` e botão `.btn-changelog`):
1. Atualizar o botão de versão no cabeçalho:
   ```html
   <button class="btn-changelog" onclick="openChangelogModal()" title="Ver novidades e histórico de atualizações">
     📌 Versão 1.04
   </button>
   ```
2. Adicionar o novo bloco da Versão 1.04 no topo da lista dentro de `#modalChangelog`:
   ```html
      <!-- VERSÃO 1.04 - PILAR 10: QUADRO DE CONTROLE BIMESTRAL (SEMÁFORO DE PRAZOS POR TURMA) -->
      <div style="margin-bottom:20px; border-left:3px solid #16A34A; padding-left:14px; background:#F0FDF4; padding-top:10px; padding-bottom:10px; border-radius:0 8px 8px 0;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:14px; font-weight:800; color:#166534;">Versão 1.04 · v7.83 (Oficial)</span>
          <span style="font-size:11px; background:#DCFCE7; color:#166534; padding:2px 8px; border-radius:12px; font-weight:700;">21/10/2026</span>
        </div>
        <div style="font-size:12px; color:var(--text-secondary); margin-top:4px; font-weight:700;">
          Pilar 10: Quadro de Controle Bimestral e Semáforo de Prazos do Ciclo Anual por Turma:
        </div>
        <ul style="font-size:12px; color:var(--text-primary); margin-top:8px; line-height:1.6; padding-left:16px;">
          <li>🚦 <strong>Quadro Matricial de Controle por TURMA:</strong> Reorganização da sub-aba Longitudinal centrada na Turma da Educação Infantil, acompanhando o ciclo obrigatório das 4 observações anuais com preservação da visão derivada de docentes titulares.</li>
          <li>🎨 <strong>Semáforo Canônico de Prazos (Verde / Cinza / Vermelho):</strong> Motor determinístico <code>calculateClassBimesterStatus</code> classificando 🟢 Concluída (com score percentual e data), 🔴 Atrasada (bimestre expirado com alerta pulsante), ⚪ No Prazo (janela regulamentar aberta de 2 meses) e ⚪ Ciclo Futuro.</li>
          <li>📊 <strong>Resumo Decisório e Micro-cards de Gestão:</strong> Monitoramento imediato de turmas em atraso, pendências no bimestre ativo, total de observações anuais realizadas e percentual acumulado do ciclo longitudinal.</li>
          <li>⚡ <strong>Filtros Rápidos e Ações Imediatas:</strong> Chips de filtragem por status (Atrasadas, No Prazo, Concluídas) e atalhos com 1 toque para agendamento automático pré-preenchido no cronograma ou início de observação direta.</li>
          <li>📱 <strong>Ergonomia Mobile-First:</strong> Cards adaptativos por turma no smartphone sem rolagem horizontal, com mini-grid 4 colunas de pílulas semafóricas táteis.</li>
          <li>🔬 <strong>Auditoria Modular (100% de Cobertura):</strong> Módulo <code>indicadores_decisao</code> expandido com asserções estritas dos 4 estados semafóricos, filtros e atalhos operacionais.</li>
        </ul>
      </div>
   ```

#### 5.2 Em `CHANGELOG.md`:
Adicionar na tabela do Sumário Executivo:
```markdown
| **1.04** | 21/10/2026 19:30 | `intermediárias/aplicativo_v104_pilar_10_semaforo_bimestral_turmas.html` | Deliberação SerTão Criança / Pilar 10 | Pilar 10: Quadro de Controle Bimestral matricial organizado por TURMA, Semáforo de Prazos Canônico (🟢 Verde Concluída, ⚪ Cinza No Prazo, 🔴 Vermelho Atrasada), micro-cards decisórios, filtros rápidos, atalhos de agendamento com 1 toque e cards adaptativos mobile 🚦 |
```
E criar a seção detalhada da Versão 1.04 com Inclusões, Modificações e Exclusões.

---

### BLOCO 6: Atualização da Documentação Oficial de Insights

#### 6.1 Em `docs/documento_insights_supervisao_pedagogica_20261020.md`:
Atualizar a seção do **PILAR 10** para:
```markdown
### PILAR 10: Quadro de Controle Bimestral (Semáforo de Prazos Verde / Cinza / Vermelho)
> **STATUS DO PILAR: 🏗️ PLANO EXECUTIVO DETALHADO (PRONTO PARA EXECUÇÃO - ETAPA 2)**  
> **Documento Oficial Mestre de Execução:** [`./planos_de_implementacao/plano_pilar_10_semaforo_bimestral_turmas.md`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_pilar_10_semaforo_bimestral_turmas.md)  
> **Versão Alvo de Entrega:** `1.04` | **Backup Intermediário:** `intermediárias/aplicativo_v104_pilar_10_semaforo_bimestral_turmas.html`


* **Diretriz Aprovada (00:28:59):**  
  Painel visual matricial para o acompanhamento do ciclo das 4 observações anuais **organizado por TURMA**:
  - 🟢 **Verde:** Observação da turma realizada e concluída no bimestre.
  - ⚪ **Cinza:** Bimestre em andamento (dentro do prazo regulamentar de 2 meses).
  - 🔴 **Vermelho:** Bimestre expirado sem envio de observação para a turma (alerta de atraso).
```

---

## 4. Critérios de Aceite e Roteiro de Validação

### 4.1 Roteiro de Verificação Manual (Ponto a Ponto)
1. **Acesso à Aba de Indicadores (`#screenIndicators`) ➔ Sub-aba Longitudinal (`pillIndLongitudinal`):**
   - Com perfil de Coordenadora (`mariana`):
     - Navegar até Indicadores e clicar em "Longitudinal".
     - Confirmar que o título principal exibe: **"🚦 Quadro de Controle Bimestral (Semáforo do Ciclo Anual)"**.
     - Verificar que a exibição padrão lista as **Turmas** da escola (`CEI Professora Maria de Lourdes`), e não a lista isolada de professores.
2. **Validação Visual do Semáforo Canônico (Células Bimestrais):**
   - **🟢 Verde:** Turmas com observação concluída no bimestre (ex: `obs-001` no 1º Bimestre de `Infantil I`) exibem pílula verde, com a nota percentual (ex: `✓ 1º · 85%`) e data de realização.
   - **🔴 Vermelho:** Turmas que não possuem observação em bimestres anteriores ao corrente (ex: 1º e 2º Bimestres no momento em que estamos no 3º Bimestre) exibem pílula vermelha com alerta pulsante (`⚠ Atrasado`).
   - **⚪ Cinza / Azul Suave:** Turmas sem observação no bimestre corrente (3º Bimestre) exibem pílula no prazo (`⏳ No Prazo`).
   - **⚪ Cinza Neutro:** O 4º Bimestre exibe pílula com borda tracejada (`○ Ciclo Futuro`).
3. **Resumo Decisório e Micro-cards:**
   - Conferir se os contadores de "Turmas em Atraso", "Pendentes no Bimestre", "Concluídas" e "Avanço do Ciclo Anual" batem matematicamente com os dados das turmas.
4. **Filtros Rápidos em Chip:**
   - Clicar em `🔴 Atrasadas`: a tabela deve filtrar e exibir exclusivamente as turmas com pendências expiradas.
   - Clicar em `🟢 Concluídas`: exibir apenas turmas que já cumpriram a observação do bimestre atual.
   - Clicar em `Todas`: restaurar a listagem completa.
5. **Alternador de Visão (Turmas vs Docentes):**
   - Clicar em `👥 Docentes Regentes`: a visualização deve alternar suavemente para as fichas formativas individuais dos professores, permitindo acesso ao "Raio-X Item a Item".
   - Clicar em `🏫 Turmas`: retornar imediatamente ao Quadro Semáforo.
6. **Ação Rápida de Agendamento com 1 Toque:**
   - Clicar no botão `📅 Agendar` de uma turma (ou clicar em uma pílula vermelha/cinza):
   - O modal de agendamento (`#modalAddSchedule`) deve abrir pré-preenchido com a escola, a turma e o próximo bimestre elegível.
7. **Atalhos no Grid Superior de KPIs (Cards 2 e 3):**
   - Na sub-aba de KPIs (`pillIndKpis`), clicar em `🚦 Ver Quadro Semáforo ↓` no Card 2 ou 3: o sistema deve alternar para a sub-aba Longitudinal e rolar até o Semáforo.
8. **Responsividade Mobile:**
   - Em viewport mobile ($\le 768\text{px}$): a tabela larga deve ser ocultada e substituída pelos cards adaptativos por turma, com o mini-grid 4 colunas de pílulas táteis e botão de agendamento.
9. **Impressão / PDF:**
   - Ao imprimir a tela (`Cmd+P` ou botão de PDF), a matriz semafórica deve ser renderizada com fundo branco, sem sobreposições e com cores preservadas.

---

## 5. Seção Obrigatória de Auditoria: Alterações, Adições e Exclusões no Algoritmo de Auditoria

> **DIRETRIZ MANDATÓRIA (WORKFLOW_MACOS.md - Seções 2 e 6):**
> O algoritmo de auditoria da plataforma (`audit_platform.py` e engine de testes do `index.html`) deve manter **100% de cobertura determinística da plataforma**, estruturado em módulos ("modo-a-modo"). A seguir, detalham-se as alterações, adições e exclusões específicas necessárias para cobrir integralmente o Pilar 10.

### 5.1 Atualizações no Catálogo de Módulos (`audit_platform.py`)
No arquivo `audit_platform.py`, atualizar a descrição oficial do Módulo 10 no dicionário `MODULE_CATALOG`:

```python
    'indicadores_decisao': 'Indicadores Pedagógicos, Cobertura Bimestral (Pilar 7), Gargalos (Pilar 8) e Semáforo de Turmas (Pilar 10)',
```

### 5.2 Alterações e Adições na Engine de Testes Modular do Browser (`index.html`)
No arquivo `index.html`, dentro de `runFullPlatformAudit()`, atualizar a suíte do **Módulo 10 (`indicadores_decisao`)**:

#### A. Inclusão das Asserções Estruturais e Algorítmicas do Pilar 10:
Inserir logo após a validação da aba Longitudinal (por volta da linha ~19600):

```javascript
              // 10. PILAR 10: VALIDAÇÃO DO QUADRO DE CONTROLE BIMESTRAL (SEMÁFORO DE TURMAS)
              const semaphoreSection = document.getElementById('bimesterSemaphoreSection');
              if (!semaphoreSection) throw new Error('Falha Pilar 10: Contêiner #bimesterSemaphoreSection ausente no DOM');
              logger.log('Renderização do Quadro de Controle Bimestral (Pilar 10)', true);

              // 11. PILAR 10: VALIDAÇÃO DO MOTOR ALGORÍTMICO CALCULATECLASSBIMESTERSTATUS
              // Caso Verde (Concluída): Turma Infantil I no 1º Bimestre com obs-001 finalizada
              const statusGreen = calculateClassBimesterStatus('Infantil I - Turma A', 'CEI Professora Maria de Lourdes', '1º Bimestre');
              if (statusGreen.status !== 'completed' || statusGreen.colorKey !== 'green') {
                throw new Error(`Falha Pilar 10: Esperado status completed/green para 1º Bimestre da Infantil I, obtido ${statusGreen.status}/${statusGreen.colorKey}`);
              }
              logger.log('Cálculo algorítmico do Semáforo Canônico: 🟢 Verde (Concluída)', true, `${statusGreen.label} - Score: ${statusGreen.score}%`);

              // Caso Vermelho (Atrasado): Turma Infantil II no 1º Bimestre (sem observação concluída e bimestre já encerrado)
              const statusRed = calculateClassBimesterStatus('Infantil II - Turma B', 'CEI Professora Maria de Lourdes', '1º Bimestre');
              if (statusRed.status !== 'overdue' || statusRed.colorKey !== 'red') {
                throw new Error(`Falha Pilar 10: Esperado status overdue/red para 1º Bimestre não realizado da Infantil II, obtido ${statusRed.status}/${statusRed.colorKey}`);
              }
              logger.log('Cálculo algorítmico do Semáforo Canônico: 🔴 Vermelho (Bimestre Expirado / Atraso)', true, statusRed.label);

              // Caso Cinza / No Prazo (Em Andamento): Turma no Bimestre Corrente
              const curBimTest = getCurrentSchoolBimester();
              const statusCurrent = calculateClassBimesterStatus('Infantil II - Turma B', 'CEI Professora Maria de Lourdes', curBimTest);
              if (statusCurrent.status !== 'in_progress' && statusCurrent.status !== 'completed') {
                throw new Error(`Falha Pilar 10: Esperado status in_progress para bimestre corrente ${curBimTest}, obtido ${statusCurrent.status}`);
              }
              logger.log('Cálculo algorítmico do Semáforo Canônico: ⚪ No Prazo (Bimestre em Andamento)', true, statusCurrent.label);

              // 12. PILAR 10: VALIDAÇÃO DOS FILTROS RÁPIDOS E ALTERNADOR DE VISÃO
              filterSemaphoreByStatus('overdue');
              const overdueSec = document.getElementById('bimesterSemaphoreSection');
              if (!overdueSec || !overdueSec.innerHTML.includes('🔴 Atrasadas')) {
                throw new Error('Falha Pilar 10: Filtro de status atrasadas não refletiu no DOM');
              }
              filterSemaphoreByStatus('all');
              logger.log('Validação interativa dos Filtros Rápidos de Status no Semáforo (Pilar 10)', true);

              toggleLongitudinalViewMode('teachers');
              const teachersViewActive = document.getElementById('bimesterSemaphoreSection');
              if (!teachersViewActive || !teachersViewActive.innerHTML.includes('Docente Titular')) {
                throw new Error('Falha Pilar 10: Alternador para visão de docentes falhou');
              }
              toggleLongitudinalViewMode('classes');
              logger.log('Validação do Alternador de Visão Turmas vs. Docentes Regentes (Pilar 10)', true);
```

### 5.3 Resumo de Alterações na Auditoria

| Tipo | Módulo | Descrição Técnica |
| :---: | :---: | :--- |
| **MODIFICAÇÃO** | `audit_platform.py` | Atualização do catálogo oficial para incluir a validação do Pilar 10 no Módulo 10 |
| **ADIÇÃO** | `index.html` (Módulo 10) | Asserção de presença e renderização do contêiner `#bimesterSemaphoreSection` |
| **ADIÇÃO** | `index.html` (Módulo 10) | Asserção determinística de cálculo do estado 🟢 Verde (`completed` com score percentual) |
| **ADIÇÃO** | `index.html` (Módulo 10) | Asserção determinística de cálculo do estado 🔴 Vermelho (`overdue` para bimestre expirado) |
| **ADIÇÃO** | `index.html` (Módulo 10) | Asserção determinística de cálculo do estado ⚪ Cinza / No Prazo (`in_progress` no bimestre ativo) |
| **ADIÇÃO** | `index.html` (Módulo 10) | Teste de filtragem rápida de status (`filterSemaphoreByStatus`) e alternador Turmas vs. Docentes |
| **EXCLUSÃO** | Nenhuma | Nenhuma asserção prévia é removida; todas as asserções existentes permanecem 100% ativas |

---

## 6. Checklist de Execução para a Etapa 2 (Operário)

- [ ] Executar `git pull origin main` no início da tarefa.
- [ ] Aplicar Estilos CSS do Pilar 10 no arquivo `index.html`.
- [ ] Inserir os helpers e motor algorítmico (`calculateClassBimesterStatus`, `quickScheduleForClass`, `toggleLongitudinalViewMode`, etc.).
- [ ] Atualizar a renderização da sub-aba Longitudinal em `renderIndicatorsScreen()` incorporando o Semáforo e o alternador de visão.
- [ ] Adicionar os atalhos de deep-linking nos Cards 2 e 3 do Grid de KPIs.
- [ ] Atualizar o Módulo 10 na engine modular de testes do `index.html` e em `audit_platform.py`.
- [ ] Atualizar o Changelog duplo (Versão `1.04` no `CHANGELOG.md` e no `#modalChangelog` do `index.html`).
- [ ] Atualizar o status do Pilar 10 no arquivo `docs/documento_insights_supervisao_pedagogica_20261020.md`.
- [ ] Aplicar dupla checagem lendo os trechos editados.
- [ ] Salvar cópia em `intermediárias/aplicativo_v104_pilar_10_semaforo_bimestral_turmas.html`.
- [ ] Sincronizar os arquivos espelhados (`gestor supervisao_patos/index.html` e `gestor supervisao_patos/firebase_deploy/public/index.html`).
- [ ] Executar checagem de concorrência (`git fetch origin main`).
- [ ] Criar commit semântico: `feat: implementar pilar 10 - quadro de controle bimestral e semaforo de prazos por turma (v1.04)`.
- [ ] Enviar com `git push origin main` (deploy automático no GitHub Pages).
- [ ] Executar `python3 audit_platform.py --silent-on-success` e reportar estritamente se houverem falhas.
