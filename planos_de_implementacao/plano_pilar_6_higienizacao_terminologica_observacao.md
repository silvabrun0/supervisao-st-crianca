# PLANO DE IMPLEMENTAÇÃO: PILAR 6 - HIGIENIZAÇÃO TERMINOLÓGICA MANDATÓRIA ("VISITA" ➔ "OBSERVAÇÃO")

> **DIRETRIZ OBRIGATÓRIA DE EXECUÇÃO (ETAPA 2):**
> O assistente executor (Etapa 2) deve **obrigatoriamente ler e seguir as diretrizes dos arquivos `WORKFLOW_MACOS.md` e `AGENTS.md`** localizados na raiz do projeto antes de aplicar qualquer modificação no código. Nenhuma modificação deve ser realizada sem conformidade estrita com o workflow, incluindo:
> 1. Execução prévia de sincronização com o repositório remoto (`git pull origin main`).
> 2. Preservação integral das regras de negócio existentes, dados cadastrais, blindagens RBAC, série histórica, ciclo longitudinal, turmas integrais (Pilar 4), fechamento nominal e atribuição parcial (Pilar 5) e testes automatizados.
> 3. Verificação de integridade pós-edição com dupla checagem de leitura em cada trecho modificado.
> 4. Salvamento obrigatório do backup intermediário na pasta `intermediárias/` sob o nome `aplicativo_v100_pilar_6_higienizacao_terminologica_observacao.html`.
> 5. Gestão dupla de Changelog no arquivo `CHANGELOG.md` e no modal `#modalChangelog` do `index.html`, registrando a **Versão 1.00 (ou 0.100)**.
> 6. Sincronização idêntica entre o arquivo principal `index.html` da raiz, `gestor supervisao_patos/index.html` e `gestor supervisao_patos/firebase_deploy/public/index.html`.
> 7. Checagem pré-push (`git fetch origin main`), commit semântico (`feat: implementar pilar 6 - higienizacao terminologica completa de visita para observacao (v1.00)`), push para `origin main` e deploy automático no GitHub Pages.
> 8. Execução pós-deploy obrigatória do algoritmo de auditoria (`python3 audit_platform.py --silent-on-success`) com comunicação estrita a falhas.

---

## 1. Diagnóstico e Contexto Técnico-Pedagógico

### 1.1 Cenário Atual
Após a implementação e homologação bem-sucedida dos Pilares 1 a 5:
- **Pilar 1:** Inverteu a unidade de observação da sala de aula para a **TURMA**, preservando o direito de acesso da criança às experiências pedagógicas e consolidando a série histórica da turma regida por duplas ou quartetos de docentes regentes titulares.
- **Pilar 2:** Formalizou a governança canônica em 3 níveis (Coordenadora da UE ➔ Formadora do Polo ➔ Coordenadora do Núcleo de Educação Infantil).
- **Pilar 3:** Estabeleceu o benchmark comparativo `% da UE vs. Rede` item a item no Afunilamento de Indicadores com régua dupla e categorização de desvios pedagógicos.
- **Pilar 4:** Unificou o instrumento para turmas em Tempo Integral em formulário único de 2 etapas (Manhã e Tarde), com soma de tempos e preservação de planejamento conjunto.
- **Pilar 5:** Implementou o fechamento nominal por docente regente, avaliação nas 5 dimensões, parecer descritivo em práticas consistentes, trava e justificativa obrigatória em itens parciais e geração segregada de fichas individuais em PDF.

Apesar dessa robustez técnica, uma análise criteriosa do código-fonte revela que a aplicação ainda carrega em sua interface ativa mais de **90 ocorrências do termo "visita"** (e suas variações "visitas", "Visita", "Visitas", "VISITA"):
1. **Na Tela Inicial (Home):** Títulos como *"Minhas Próximas Visitas Agendadas"*, subtítulos como *"Inicie diretamente as visitas planejadas..."* e botões *"Iniciar Visita →"*.
2. **Na Agenda e Cronograma:** Seções e seletores como *"Visitas Planejadas e Realizadas"*, *"Visitas Ativas"*, *"Visitas Arquivadas"*, botões *"Agendar Nova Visita"*, *"Arquivar Visita"*, e o Hero Card *"PRÓXIMA VISITA"*.
3. **No Setup da Observação:** Rótulos como *"Vincular a uma Visita Agendada no Cronograma"*, textos de auxílio e o título de bloco *"Data e Horários da Visita Pedagógica"*.
4. **Na Observação Ativa e Síntese:** Títulos como *"Síntese Final da Visita Pedagógica"*, *"Dados da Visita & Profissional Acompanhado(a)"*, botões de ação *"Importar Ocorrências da Visita"* e mensagens de status vinculadas à "visita".
5. **Nos Indicadores e Dossiê:** Cards de KPI como *"Visitas Concluídas"*, badges de evolução *"Aguardando Visita"* e mensagens como *"Este profissional ainda não possui visitas concluídas..."*.
6. **Nas Exportações e Backups:** Nomes de arquivos gerados como `sertao_crianca_visitas.json` e `sertao_crianca_visitas.csv`, além de toasts informando *"Visitas exportadas com sucesso"*.
7. **Nos Documentos Oficiais:** Rótulos e descrições dos manuais em PDF referindo-se a *"Instrumento de Acompanhamento das Visitas Pedagógicas"*.

### 1.2 Fundamentação Técnico-Pedagógica (Documento de Insights / Deliberação ST Criança 19/10/2026 - Minuto 00:19:27)
Conforme estabelecido explicitamente no Documento Oficial de Referência de Produto, Governança e Arquitetura:
- **A Diretriz Aprovada (00:19:27):**
  > *"Substituição completa do vocábulo policialesco 'visita' por 'observação' em 100% dos textos, botões, rotas e relatórios."*
- **A Racionalidade Pedagógica:**
  O programa **SerTão Criança** concebe a supervisão como uma ação eminentemente **formativa, colaborativa e reflexiva**, centrada na escuta atenta, na garantia dos direitos de desenvolvimento da criança e no apoio continuado à docência na Educação Infantil.
  O vocábulo *"visita"* carrega um estigma histórico fiscalizatório, punitivo e cartorial ("visita da supervisão", "inspeção escolar", "auditoria policialesca"), gerando ansiedade e resistência nas escolas. O termo técnico e institucional consagrado é **"OBSERVAÇÃO"** (ou **"observação pedagógica"**), que expressa o ato de acompanhar a rotina da turma, registrar evidências e construir combinados de evolução pedagógica com a equipe.

### 1.3 Resultado Esperado com o Pilar 6
1. **Higienização Terminológica de 100% da Interface Ativa:**
   - Erradicação absoluta do termo *"visita"* em todos os botões, cabeçalhos, formulários, seletores, modais, tooltips, placeholders, alertas, badges, tabelas e relatórios de tela.
   - Adoção sistemática das formas flexionadas adequadas da língua portuguesa: *"Observação"*, *"Observações"*, *"Agendar Nova Observação"*, *"Iniciar Observação →"*, *"Observações Ativas"*, *"Observações Arquivadas"*, *"Observações Concluídas"*, *"Aguardando Observação"*, *"Síntese Final da Observação Pedagógica"*, *"Dados da Observação & Equipe Acompanhada"*, etc.
2. **Higienização de Relatórios, Toasts e Notificações:**
   - Mensagens de confirmação, arquivamento e toasts passam a referenciar unicamente *"observação"* (ex: *"Observação arquivada com sucesso!"*, *"Deseja arquivar X observação(ões) já realizada(s)?"*).
   - O espelho para impressão e as fichas de devolutiva passam a exibir *"Data da Observação"*, *"Evidências Gerais da Observação Pedagógica"* e *"Observações Finalizadas"*.
3. **Higienização dos Artefatos de Exportação:**
   - O download de arquivos via aba de Backup e Exportação passa a gerar os arquivos padronizados `sertao_crianca_observacoes.json` e `sertao_crianca_observacoes.csv`, com mensagens coerentes na UI.
4. **Preservação Integral de Schemas e Compatibilidade de Dados:**
   - O array interno de observações no estado global (`appState.observations`) e o de agendamentos (`appState.schedules`) já utilizam nomenclaturas neutras em inglês. Nenhuma propriedade relacional é quebrada, garantindo total compatibilidade retroativa com dados existentes em `localStorage`.
5. **Harmonização da Suíte de Testes e Auditoria Automatizada:**
   - Correção pontual de um bug residual no módulo `catalogo_dados` (`renderTeamMembersTable` ➔ `renderTeamTable`), restaurando a aprovação total da suíte.
   - Sincronização do nome do Módulo 8 em `audit_platform.py` e `index.html` para: `'Cronograma de Observações, Destaque da Próxima Observação e Baixa Automática'`.
   - Inclusão de um novo teste determinístico específico do Pilar 6 que inspeciona o DOM ativo e garante a ausência de ocorrências da palavra "visita" nos elementos vitais da aplicação.

---

## 2. Arquitetura e Mapeamento de Pontos de Impacto

### 2.1 Arquivos Afetados
```
gestor supervisao_patos/
├── index.html                                                                 # Aplicação servida em produção (GitHub Pages)
├── firebase_deploy/public/index.html                                          # Cópia espelhada obrigatória
├── audit_platform.py                                                          # Algoritmo de auditoria modular
├── CHANGELOG.md                                                               # Histórico oficial de versões
├── docs/documento_insights_supervisao_pedagogica_20261020.md                  # Atualização de status do Pilar 6
└── intermediárias/aplicativo_v100_pilar_6_higienizacao_terminologica_observacao.html # Backup intermediário da Versão 1.00
```

### 2.2 Mapeamento por Módulo Funcional

| Módulo / Tela | Elementos e Trechos Afetados | Linhas em `index.html` | Ação de Substituição |
| :--- | :--- | :---: | :--- |
| **Home (`#screenHome`)** | `#homeScheduledHeader`, subtítulo descritivo, estado vazio, botão de início rápido | 2652, 2656, 2657, 11442, 11455, 11457, 11466, 11492 | "Visitas Agendadas" ➔ "Observações Agendadas"; "Iniciar Visita →" ➔ "Iniciar Observação →" |
| **Backup (`#screenBackup`)** | Título do card de avaliações, nomes de arquivos de download JSON/CSV e toasts | 2920, 2923, 17108, 17109, 17205, 17206 | `sertao_crianca_visitas.*` ➔ `sertao_crianca_observacoes.*`; toasts higienizados |
| **Cronograma (`#screenSchedule`)** | Botão "+ Agendar Nova Visita", filtros de status, Hero Card "PRÓXIMA VISITA", tabela e cards mobile, diálogos e toasts | 2942, 2948, 2959-2964, 11422, 12019-12223, 12324-12615 | "+ Agendar Nova Observação"; "Observações Ativas/Arquivadas"; "PRÓXIMA OBSERVAÇÃO"; "Iniciar Observação →"; toasts higienizados |
| **Modais de Agendamento** | `#modalSelectScheduledObs` e `#modalAddSchedule`: títulos, descrições e contadores | 5891, 5901, 5910, 5936, 5940, 8067, 8128, 8164 | "Planejar Observação no Cronograma"; contadores com "observação(ões)" |
| **Setup da Observação** | Label do seletor `#setupLinkedSchedule`, dica contextual e título do bloco de horários | 3016, 3022, 3085, 3089, 8288, 8346 | "Vincular a uma Observação Agendada no Cronograma"; "Data e Horários da Observação Pedagógica" |
| **Observação e Síntese** | Título da síntese, card oficial de identificação, importação de ocorrências, placeholder de parecer, tooltips e FAB | 3163, 3183, 3186, 3204, 3340, 3378, 3902, 9374, 10210, 10481, 10579, 10905, 12668 | "Síntese Final da Observação Pedagógica"; "Dados da Observação..."; "🔗 Vinculada à Observação" |
| **Documentos Oficiais** | `#screenDocs` e visualizador de referências: títulos e descrições dos manuais | 3709, 3712, 3958, 4009, 4011, 16247 | "Instrumento de Acompanhamento das Observações Pedagógicas" |
| **Relatório Impresso** | Cabeçalho do dossiê impresso e devolu pedagógica (`#printView`) | 11263, 11275 | "Data da Observação: [data]" |
| **Indicadores (`#screenIndicators`)** | Card de KPI, badges de evolução, textos de aviso longitudinal e tabela de acompanhamento | 14711, 14716, 14795, 14805, 14834, 15593, 15754 | "Observações Concluídas"; "Observação diagnóstica inicial"; "Aguardando Observação"; "Observações Finalizadas" |
| **Engine de Auditoria** | Logs dos módulos `sintese_finalizacao` e `agenda_cronograma`, dicionário do `audit_platform.py` e novo teste | 17503, 17755, 18118, 18121, 18138, 18192, 18199, 18208 + `audit_platform.py:30` | Correção `renderTeamTable()`; renomeação para "Cronograma de Observações..."; adição de teste no módulo 12 |

---

## 3. Especificação de Implementação Passo a Passo (Obrigatório)

### BLOCO 1: Tela Inicial (Home - `#screenHome` e `renderHomeScreen`)

#### 1.1 Em `index.html` (linhas 2652 a 2658):
**Substituir:**
```html
      <!-- Seção Dinâmica de Visitas Agendadas no Cronograma da Tela Inicial -->
      <div id="homeScheduledSection" style="display:none; margin-bottom:24px;">
        <div class="page-title-row" style="margin-bottom:12px;">
          <div>
            <h3 style="font-size:16px; font-weight:700; color:var(--primary-dark);" id="homeScheduledHeader">🗓️ Minhas Próximas Visitas Agendadas</h3>
            <p style="font-size:12px; color:var(--text-secondary); margin-top:2px;">Inicie diretamente as visitas planejadas no cronograma longitudinal</p>
          </div>
```
**Por:**
```html
      <!-- Seção Dinâmica de Observações Agendadas no Cronograma da Tela Inicial -->
      <div id="homeScheduledSection" style="display:none; margin-bottom:24px;">
        <div class="page-title-row" style="margin-bottom:12px;">
          <div>
            <h3 style="font-size:16px; font-weight:700; color:var(--primary-dark);" id="homeScheduledHeader">🗓️ Minhas Próximas Observações Agendadas</h3>
            <p style="font-size:12px; color:var(--text-secondary); margin-top:2px;">Inicie diretamente as observações planejadas no cronograma longitudinal</p>
          </div>
```

#### 1.2 Em `index.html` (linhas 11440 a 11500 - função `renderHomeScreen`):
**Substituir:**
```javascript
      // Renderização dinâmica de visitas agendadas pendentes na Tela Inicial
      const homeSchedSec = document.getElementById('homeScheduledSection');
      const homeSchedList = document.getElementById('homeScheduledList');
      if (homeSchedSec && homeSchedList) {
        const myPending = getActionablePendingSchedules();
        if (myPending.length === 0) {
          homeSchedSec.style.display = 'block';
          homeSchedList.innerHTML = `
            <div style="background:#F8FAFC; border:1px dashed #CBD5E1; border-radius:10px; padding:20px; text-align:center; color:var(--text-secondary); font-size:13px; display:flex; flex-direction:column; align-items:center; gap:8px;">
              <span style="font-size:24px;">🗓️</span>
              <span>Você não possui nenhuma visita agendada pendente no momento.</span>
              <button class="btn btn-secondary" style="font-size:12px; padding:6px 14px; margin-top:4px;" onclick="openAddScheduleModal()">
                + Agendar Nova Visita
              </button>
            </div>
          `;
        } else {
          homeSchedSec.style.display = 'block';
          // Exibe as 4 visitas mais próximas na Home
          const nextFour = myPending.slice(0, 4);
          homeSchedList.innerHTML = nextFour.map(s => {
            const dateStr = s.plannedDate ? formatDateBR(s.plannedDate) : 'Data não informada';
            const timeStr = s.plannedTime ? ` às ${s.plannedTime}` : '';
            const bimesterBadge = s.bimester ? `<span class="badge" style="background:#E2E8F0; color:#334155; font-size:11px; font-weight:600; padding:2px 8px; border-radius:12px;">${s.bimester}</span>` : '';
            return `
              <div style="background:white; border:1px solid var(--border-color); border-left:4px solid var(--primary-color); border-radius:8px; padding:12px 16px; display:flex; align-items:center; justify-content:space-between; gap:12px; box-shadow:0 1px 3px rgba(0,0,0,0.04);">
                <div style="display:flex; flex-direction:column; gap:3px;">
                  <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                    <strong style="font-size:14px; color:var(--primary-dark);">${s.schoolName || 'Escola não informada'}</strong>
                    ${bimesterBadge}
                  </div>
                  <span style="font-size:13px; color:var(--text-primary); font-weight:600;">
                    ${s.className ? `Turma: ${s.className}` : (s.teacherName ? `Prof(a): ${s.teacherName}` : 'Geral')}
                  </span>
                  <span style="font-size:12px; color:var(--text-secondary);">
                    🗓️ ${dateStr}${timeStr}
                  </span>
                </div>
                <button class="btn btn-primary" style="font-size:12px; padding:6px 12px; white-space:nowrap;" onclick="startObservationFromSchedule('${s.id}')">
                  Iniciar Visita →
                </button>
              </div>
            `;
          }).join('');
        }
      }
```
**Por:**
```javascript
      // Renderização dinâmica de observações agendadas pendentes na Tela Inicial
      const homeSchedSec = document.getElementById('homeScheduledSection');
      const homeSchedList = document.getElementById('homeScheduledList');
      if (homeSchedSec && homeSchedList) {
        const myPending = getActionablePendingSchedules();
        if (myPending.length === 0) {
          homeSchedSec.style.display = 'block';
          homeSchedList.innerHTML = `
            <div style="background:#F8FAFC; border:1px dashed #CBD5E1; border-radius:10px; padding:20px; text-align:center; color:var(--text-secondary); font-size:13px; display:flex; flex-direction:column; align-items:center; gap:8px;">
              <span style="font-size:24px;">🗓️</span>
              <span>Você não possui nenhuma observação agendada pendente no momento.</span>
              <button class="btn btn-secondary" style="font-size:12px; padding:6px 14px; margin-top:4px;" onclick="openAddScheduleModal()">
                + Agendar Nova Observação
              </button>
            </div>
          `;
        } else {
          homeSchedSec.style.display = 'block';
          // Exibe as 4 observações mais próximas na Home
          const nextFour = myPending.slice(0, 4);
          homeSchedList.innerHTML = nextFour.map(s => {
            const dateStr = s.plannedDate ? formatDateBR(s.plannedDate) : 'Data não informada';
            const timeStr = s.plannedTime ? ` às ${s.plannedTime}` : '';
            const bimesterBadge = s.bimester ? `<span class="badge" style="background:#E2E8F0; color:#334155; font-size:11px; font-weight:600; padding:2px 8px; border-radius:12px;">${s.bimester}</span>` : '';
            return `
              <div style="background:white; border:1px solid var(--border-color); border-left:4px solid var(--primary-color); border-radius:8px; padding:12px 16px; display:flex; align-items:center; justify-content:space-between; gap:12px; box-shadow:0 1px 3px rgba(0,0,0,0.04);">
                <div style="display:flex; flex-direction:column; gap:3px;">
                  <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                    <strong style="font-size:14px; color:var(--primary-dark);">${s.schoolName || 'Escola não informada'}</strong>
                    ${bimesterBadge}
                  </div>
                  <span style="font-size:13px; color:var(--text-primary); font-weight:600;">
                    ${s.className ? `Turma: ${s.className}` : (s.teacherName ? `Prof(a): ${s.teacherName}` : 'Geral')}
                  </span>
                  <span style="font-size:12px; color:var(--text-secondary);">
                    🗓️ ${dateStr}${timeStr}
                  </span>
                </div>
                <button class="btn btn-primary" style="font-size:12px; padding:6px 12px; white-space:nowrap;" onclick="startObservationFromSchedule('${s.id}')">
                  Iniciar Observação →
                </button>
              </div>
            `;
          }).join('');
        }
      }
```

---

### BLOCO 2: Tela de Backup e Exportação (`#screenBackup`)

#### 2.1 Em `index.html` (linhas 2920 a 2926):
**Substituir:**
```html
          <!-- Card Avaliações / Visitas -->
          <div class="export-card">
            <div>
              <div class="export-card-title">📈 Visitas & Observações Realizadas</div>
              <div class="export-card-desc">Base de acompanhamentos pedagógicos, sínteses, níveis de materiais e metadados.</div>
            </div>
```
**Por:**
```html
          <!-- Card Observações Pedagógicas -->
          <div class="export-card">
            <div>
              <div class="export-card-title">📈 Observações Realizadas</div>
              <div class="export-card-desc">Base de acompanhamentos pedagógicos, sínteses, níveis de materiais e metadados.</div>
            </div>
```

#### 2.2 Em `index.html` (linhas 17106 a 17210 - funções `exportAllObservationsJSON` e `exportAllObservationsCSV`):
**Substituir:**
```javascript
    function exportAllObservationsJSON() {
      downloadAsJSON(appState.observations, "sertao_crianca_visitas.json");
      showToast('Visitas exportadas com sucesso (JSON).');
    }
```
**Por:**
```javascript
    function exportAllObservationsJSON() {
      downloadAsJSON(appState.observations, "sertao_crianca_observacoes.json");
      showToast('Observações exportadas com sucesso (JSON).');
    }
```

E na função de exportação CSV:
**Substituir:**
```javascript
      downloadFile(csv, 'sertao_crianca_visitas.csv', 'text/csv');
      showToast('Visitas exportadas com sucesso (CSV).');
```
**Por:**
```javascript
      downloadFile(csv, 'sertao_crianca_observacoes.csv', 'text/csv');
      showToast('Observações exportadas com sucesso (CSV).');
```

---

### BLOCO 3: Tela de Cronograma de Acompanhamento (`#screenSchedule` e `renderScheduleScreen`)

#### 3.1 Em `index.html` (linhas 2940 a 2968):
**Substituir:**
```html
        <div class="page-title">Cronograma de Acompanhamento</div>
        <button class="btn btn-primary btn-add-schedule" onclick="openAddScheduleModal()">
          + Agendar Nova Visita
        </button>
      </div>

      <div class="card">
        <div class="schedule-filters-toolbar">
          <div class="schedule-filters-title">Visitas Planejadas e Realizadas</div>
          <div class="schedule-filters-controls">
            <div class="schedule-filters-selects">
              <select id="scheduleFilterBimester" class="form-select schedule-filter-select" onchange="renderScheduleScreen()">
                <option value="">Todos os Bimestres</option>
                <option value="1º Bimestre">1º Bimestre</option>
                <option value="2º Bimestre">2º Bimestre</option>
                <option value="3º Bimestre">3º Bimestre</option>
                <option value="4º Bimestre">4º Bimestre</option>
              </select>
              <select id="scheduleFilterStatus" class="form-select schedule-filter-select" onchange="renderScheduleScreen()">
                <option value="active">Visitas Ativas</option>
                <option value="archived">Visitas Arquivadas</option>
                <option value="all">Todas as Visitas</option>
              </select>
            </div>
            <button class="btn btn-secondary schedule-archive-btn" onclick="archiveAllCompletedSchedules()" title="Arquivar todas as visitas já realizadas deste escopo">
              Arquivar Realizadas
            </button>
          </div>
        </div>
```
**Por:**
```html
        <div class="page-title">Cronograma de Acompanhamento</div>
        <button class="btn btn-primary btn-add-schedule" onclick="openAddScheduleModal()">
          + Agendar Nova Observação
        </button>
      </div>

      <div class="card">
        <div class="schedule-filters-toolbar">
          <div class="schedule-filters-title">Observações Planejadas e Realizadas</div>
          <div class="schedule-filters-controls">
            <div class="schedule-filters-selects">
              <select id="scheduleFilterBimester" class="form-select schedule-filter-select" onchange="renderScheduleScreen()">
                <option value="">Todos os Bimestres</option>
                <option value="1º Bimestre">1º Bimestre</option>
                <option value="2º Bimestre">2º Bimestre</option>
                <option value="3º Bimestre">3º Bimestre</option>
                <option value="4º Bimestre">4º Bimestre</option>
              </select>
              <select id="scheduleFilterStatus" class="form-select schedule-filter-select" onchange="renderScheduleScreen()">
                <option value="active">Observações Ativas</option>
                <option value="archived">Observações Arquivadas</option>
                <option value="all">Todas as Observações</option>
              </select>
            </div>
            <button class="btn btn-secondary schedule-archive-btn" onclick="archiveAllCompletedSchedules()" title="Arquivar todas as observações já realizadas deste escopo">
              Arquivar Realizadas
            </button>
          </div>
        </div>
```

#### 3.2 Em `index.html` (linhas 11420 a 11425):
**Substituir:**
```javascript
      const finCount = document.getElementById('scheduleFinalizedCount');
      if (finCount) finCount.innerText = `${activeFinalized.length} Visitas Ativas`;
```
**Por:**
```javascript
      const finCount = document.getElementById('scheduleFinalizedCount');
      if (finCount) finCount.innerText = `${activeFinalized.length} Observações Ativas`;
```

#### 3.3 Em `index.html` (linhas 12019 a 12230 - função `renderScheduleScreen`):
- No Hero Card da próxima observação (linhas 12040 a 12080):
**Substituir:**
```html
                  <div style="font-size:10px; font-weight:800; color:var(--primary-color); letter-spacing:0.5px; text-transform:uppercase;">
                    PRÓXIMA VISITA
                  </div>
```
**Por:**
```html
                  <div style="font-size:10px; font-weight:800; color:var(--primary-color); letter-spacing:0.5px; text-transform:uppercase;">
                    PRÓXIMA OBSERVAÇÃO
                  </div>
```
E no botão de ação da próxima observação:
**Substituir:**
```html
                    <button class="btn btn-primary" style="font-size:12px; padding:6px 14px;" onclick="startObservationFromSchedule('${nextSchedule.id}')">
                      Iniciar Visita →
                    </button>
```
**Por:**
```html
                    <button class="btn btn-primary" style="font-size:12px; padding:6px 14px;" onclick="startObservationFromSchedule('${nextSchedule.id}')">
                      Iniciar Observação →
                    </button>
```

- Nas mensagens de tabela e cards vazios (linhas 12105 a 12115):
**Substituir:**
```javascript
        if (filtered.length === 0) {
          tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:var(--text-secondary); padding:24px;">Nenhuma visita encontrada para os filtros selecionados.</td></tr>`;
          if (cardsContainer) {
            cardsContainer.innerHTML = `
              <div class="schedule-empty-card" style="text-align:center; padding:32px 16px; background:#F8FAFC; border:1px dashed #CBD5E1; border-radius:12px; color:var(--text-secondary);">
                <div style="font-size:28px; margin-bottom:8px;">🗓️</div>
                <div style="font-size:14px; font-weight:700; color:var(--text-primary);">Nenhuma visita encontrada</div>
```
**Por:**
```javascript
        if (filtered.length === 0) {
          tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:var(--text-secondary); padding:24px;">Nenhuma observação encontrada para os filtros selecionados.</td></tr>`;
          if (cardsContainer) {
            cardsContainer.innerHTML = `
              <div class="schedule-empty-card" style="text-align:center; padding:32px 16px; background:#F8FAFC; border:1px dashed #CBD5E1; border-radius:12px; color:var(--text-secondary);">
                <div style="font-size:28px; margin-bottom:8px;">🗓️</div>
                <div style="font-size:14px; font-weight:700; color:var(--text-primary);">Nenhuma observação encontrada</div>
```

- Nos botões de ação e status das linhas da tabela desktop e cards mobile (linhas 12150 a 12225):
**Substituir:**
```javascript
            } else if (s.isArchived) {
              actionsHtml = `
                <button class="btn btn-secondary" style="padding:4px 8px; font-size:11px;" onclick="unarchiveSchedule('${s.id}')" title="Desarquivar visita">
                  Desarquivar
                </button>
              `;
              mobileActionsHtml = `
                <div class="schedule-card-actions" style="margin-top:12px; padding-top:10px; border-top:1px dashed #E2E8F0; display:flex; justify-content:flex-end; align-items:center; gap:8px;">
                  <span style="font-size:11px; color:var(--text-secondary); font-weight:600; margin-right:auto;">Visita Arquivada</span>
                  <button class="btn btn-secondary" style="font-size:12px; padding:6px 12px;" onclick="unarchiveSchedule('${s.id}')">
                    Desarquivar
                  </button>
                </div>
              `;
            } else if (isDone) {
              actionsHtml = `
                <button class="btn btn-secondary" style="padding:4px 8px; font-size:11px;" onclick="archiveSchedule('${s.id}')" title="Arquivar esta visita realizada">
                  Arquivar
                </button>
              `;
```
**Por:**
```javascript
            } else if (s.isArchived) {
              actionsHtml = `
                <button class="btn btn-secondary" style="padding:4px 8px; font-size:11px;" onclick="unarchiveSchedule('${s.id}')" title="Desarquivar observação">
                  Desarquivar
                </button>
              `;
              mobileActionsHtml = `
                <div class="schedule-card-actions" style="margin-top:12px; padding-top:10px; border-top:1px dashed #E2E8F0; display:flex; justify-content:flex-end; align-items:center; gap:8px;">
                  <span style="font-size:11px; color:var(--text-secondary); font-weight:600; margin-right:auto;">Observação Arquivada</span>
                  <button class="btn btn-secondary" style="font-size:12px; padding:6px 12px;" onclick="unarchiveSchedule('${s.id}')">
                    Desarquivar
                  </button>
                </div>
              `;
            } else if (isDone) {
              actionsHtml = `
                <button class="btn btn-secondary" style="padding:4px 8px; font-size:11px;" onclick="archiveSchedule('${s.id}')" title="Arquivar esta observação realizada">
                  Arquivar
                </button>
              `;
```
E nas linhas de ação quando pendente (linhas 12205 a 12225):
**Substituir:**
```javascript
                actionsHtml = `
                  <button class="btn btn-primary" style="padding:4px 8px; font-size:11px;" onclick="startObservationFromSchedule('${s.id}')">
                    Iniciar Visita →
                  </button>
                  <button class="btn btn-secondary" style="padding:4px 8px; font-size:11px;" onclick="openEditScheduleModal('${s.id}')">
                    Editar
                  </button>
                `;
                mobileActionsHtml = `
                  <div class="schedule-card-actions" style="margin-top:12px; padding-top:10px; border-top:1px dashed #E2E8F0; display:flex; justify-content:flex-end; gap:8px;">
                    <button class="btn btn-secondary" style="font-size:12px; padding:6px 12px;" onclick="openEditScheduleModal('${s.id}')">
                      Editar
                    </button>
                    <button class="btn btn-primary" style="font-size:12px; padding:6px 14px;" onclick="startObservationFromSchedule('${s.id}')">
                      Iniciar Visita →
                    </button>
                  </div>
                `;
```
**Por:**
```javascript
                actionsHtml = `
                  <button class="btn btn-primary" style="padding:4px 8px; font-size:11px;" onclick="startObservationFromSchedule('${s.id}')">
                    Iniciar Observação →
                  </button>
                  <button class="btn btn-secondary" style="padding:4px 8px; font-size:11px;" onclick="openEditScheduleModal('${s.id}')">
                    Editar
                  </button>
                `;
                mobileActionsHtml = `
                  <div class="schedule-card-actions" style="margin-top:12px; padding-top:10px; border-top:1px dashed #E2E8F0; display:flex; justify-content:flex-end; gap:8px;">
                    <button class="btn btn-secondary" style="font-size:12px; padding:6px 12px;" onclick="openEditScheduleModal('${s.id}')">
                      Editar
                    </button>
                    <button class="btn btn-primary" style="font-size:12px; padding:6px 14px;" onclick="startObservationFromSchedule('${s.id}')">
                      Iniciar Observação →
                    </button>
                  </div>
                `;
```

#### 3.4 Nas Funções de Arquivamento, Notificações e Agendamento (linhas 11990 a 12620):
- Em `viewFeedbackFromSchedule` (linha 11991):
**Substituir:**
```javascript
        showToast('Nenhuma observação finalizada foi localizada para esta visita.');
```
**Por:**
```javascript
        showToast('Nenhuma observação finalizada foi localizada para este agendamento.');
```

- Em `archiveSchedule` e `unarchiveSchedule` (linhas 12320 a 12356):
**Substituir:**
```javascript
    function archiveSchedule(id) {
      const s = (appState.schedules || []).find(item => item.id === id);
      if (s) {
        s.isArchived = true;
        saveState();
        renderScheduleScreen();
        showToast('Visita arquivada com sucesso! Movida para Visitas Arquivadas.');
      }
    }

    function unarchiveSchedule(id) {
      const s = (appState.schedules || []).find(item => item.id === id);
      if (s) {
        s.isArchived = false;
        saveState();
        renderScheduleScreen();
        showToast('Visita desarquivada com sucesso! Movida para Visitas Ativas.');
      }
    }

    function archiveAllCompletedSchedules() {
      const mySchedules = getScopedSchedules();
      const completedActive = mySchedules.filter(s => s.status === 'realizado' && !s.isArchived);
      if (completedActive.length === 0) {
        showToast('Não há visitas realizadas ativas para arquivar.');
        return;
      }
      if (!confirm(`Deseja arquivar ${completedActive.length} visita(s) já realizada(s)?`)) {
        return;
      }
      const idsToArchive = new Set(completedActive.map(s => s.id));
      appState.schedules = (appState.schedules || []).map(s => {
        if (idsToArchive.has(s.id)) {
          return { ...s, isArchived: true };
        }
        return s;
      });
      saveState();
      renderScheduleScreen();
      showToast(`${completedActive.length} visita(s) arquivada(s) com sucesso!`);
    }
```
**Por:**
```javascript
    function archiveSchedule(id) {
      const s = (appState.schedules || []).find(item => item.id === id);
      if (s) {
        s.isArchived = true;
        saveState();
        renderScheduleScreen();
        showToast('Observação arquivada com sucesso! Movida para Observações Arquivadas.');
      }
    }

    function unarchiveSchedule(id) {
      const s = (appState.schedules || []).find(item => item.id === id);
      if (s) {
        s.isArchived = false;
        saveState();
        renderScheduleScreen();
        showToast('Observação desarquivada com sucesso! Movida para Observações Ativas.');
      }
    }

    function archiveAllCompletedSchedules() {
      const mySchedules = getScopedSchedules();
      const completedActive = mySchedules.filter(s => s.status === 'realizado' && !s.isArchived);
      if (completedActive.length === 0) {
        showToast('Não há observações realizadas ativas para arquivar.');
        return;
      }
      if (!confirm(`Deseja arquivar ${completedActive.length} observação(ões) já realizada(s)?`)) {
        return;
      }
      const idsToArchive = new Set(completedActive.map(s => s.id));
      appState.schedules = (appState.schedules || []).map(s => {
        if (idsToArchive.has(s.id)) {
          return { ...s, isArchived: true };
        }
        return s;
      });
      saveState();
      renderScheduleScreen();
      showToast(`${completedActive.length} observação(ões) arquivada(s) com sucesso!`);
    }
```

- Em `openAddScheduleModal`, `openEditScheduleModal` e `saveScheduleModal` (linhas 12360 a 12620):
**Substituir:**
```javascript
      document.getElementById('scheduleModalTitle').innerText = 'Planejar Visita no Cronograma';
```
**Por:**
```javascript
      document.getElementById('scheduleModalTitle').innerText = 'Planejar Observação no Cronograma';
```
E em `openEditScheduleModal`:
**Substituir:**
```javascript
      document.getElementById('scheduleModalTitle').innerText = 'Editar Visita no Cronograma';
```
**Por:**
```javascript
      document.getElementById('scheduleModalTitle').innerText = 'Editar Observação no Cronograma';
```
E nos toasts de `saveScheduleModal`:
**Substituir:**
```javascript
        showToast('Visita atualizada com sucesso!');
```
**Por:**
```javascript
        showToast('Observação atualizada com sucesso!');
```
E:
**Substituir:**
```javascript
        showToast('Visita planejada adicionada ao cronograma!');
```
**Por:**
```javascript
        showToast('Observação planejada adicionada ao cronograma!');
```

---

### BLOCO 4: Modais de Agendamento e Seleção Prévia (`#modalSelectScheduledObs` e `#modalAddSchedule`)

#### 4.1 No Modal de Seleção Prévia (linhas 5890 a 5920):
**Substituir:**
```html
  <!-- ================= MODAL: SELECIONAR VISITA AGENDADA ANTES DE INICIAR ================= -->
  <div id="modalSelectScheduledObs" class="modal" style="display:none; align-items:center; justify-content:center; background:rgba(15,23,42,0.6); z-index:9999;">
    <div class="modal-content" style="max-width:540px; width:92%; background:white; border-radius:12px; padding:24px; box-shadow:0 20px 25px -5px rgba(0,0,0,0.1); max-height:90vh; display:flex; flex-direction:column;">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
        <h3 style="font-size:18px; font-weight:800; color:var(--primary-dark); margin:0;">🗓️ Agendamentos Pendentes</h3>
        <button onclick="closeSelectScheduledObsModal()" style="border:none; background:transparent; font-size:20px; cursor:pointer; color:var(--text-secondary); line-height:1;">&times;</button>
      </div>

      <p id="selectScheduledObsHelpText" style="font-size:13px; color:var(--text-secondary); line-height:1.5; margin-bottom:16px;">
        Identificamos visitas planejadas no seu cronograma. Selecione um agendamento para iniciar ou opte por uma observação avulsa.
      </p>

      <div style="font-size:12px; font-weight:700; color:var(--text-primary); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px;">
        🗓️ Visitas Planejadas Disponíveis para Início Imediato:
      </div>
```
**Por:**
```html
  <!-- ================= MODAL: SELECIONAR OBSERVAÇÃO AGENDADA ANTES DE INICIAR ================= -->
  <div id="modalSelectScheduledObs" class="modal" style="display:none; align-items:center; justify-content:center; background:rgba(15,23,42,0.6); z-index:9999;">
    <div class="modal-content" style="max-width:540px; width:92%; background:white; border-radius:12px; padding:24px; box-shadow:0 20px 25px -5px rgba(0,0,0,0.1); max-height:90vh; display:flex; flex-direction:column;">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
        <h3 style="font-size:18px; font-weight:800; color:var(--primary-dark); margin:0;">🗓️ Agendamentos Pendentes</h3>
        <button onclick="closeSelectScheduledObsModal()" style="border:none; background:transparent; font-size:20px; cursor:pointer; color:var(--text-secondary); line-height:1;">&times;</button>
      </div>

      <p id="selectScheduledObsHelpText" style="font-size:13px; color:var(--text-secondary); line-height:1.5; margin-bottom:16px;">
        Identificamos observações planejadas no seu cronograma. Selecione um agendamento para iniciar ou opte por uma observação avulsa.
      </p>

      <div style="font-size:12px; font-weight:700; color:var(--text-primary); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px;">
        🗓️ Observações Planejadas Disponíveis para Início Imediato:
      </div>
```

#### 4.2 No Modal de Agendamento (linha 5940):
**Substituir:**
```html
  <!-- ================= MODAL: AGENDAR NOVA VISITA (CRONOGRAMA) ================= -->
  <div id="modalAddSchedule" class="modal" style="display:none; align-items:center; justify-content:center; background:rgba(15,23,42,0.6); z-index:9999;">
    <div class="modal-content" style="max-width:500px; width:92%; background:white; border-radius:12px; padding:24px; box-shadow:0 20px 25px -5px rgba(0,0,0,0.1);">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;">
        <div id="scheduleModalTitle" style="font-size:17px; font-weight:800; color:var(--primary-dark);">Planejar Visita no Cronograma</div>
```
**Por:**
```html
  <!-- ================= MODAL: AGENDAR NOVA OBSERVAÇÃO (CRONOGRAMA) ================= -->
  <div id="modalAddSchedule" class="modal" style="display:none; align-items:center; justify-content:center; background:rgba(15,23,42,0.6); z-index:9999;">
    <div class="modal-content" style="max-width:500px; width:92%; background:white; border-radius:12px; padding:24px; box-shadow:0 20px 25px -5px rgba(0,0,0,0.1);">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;">
        <div id="scheduleModalTitle" style="font-size:17px; font-weight:800; color:var(--primary-dark);">Planejar Observação no Cronograma</div>
```

#### 4.3 Na Função `openSelectScheduledObsModal` (linhas 8125 a 8168):
**Substituir:**
```javascript
      if (countTextEl) {
        countTextEl.innerText = `Identificamos ${pendingSchedules.length} visita(s) planejada(s) sob sua supervisão direta. Selecione um agendamento abaixo para iniciar ou opte por uma observação avulsa.`;
      }
```
**Por:**
```javascript
      if (countTextEl) {
        countTextEl.innerText = `Identificamos ${pendingSchedules.length} observação(ões) planejada(s) sob sua supervisão direta. Selecione um agendamento abaixo para iniciar ou opte por uma observação avulsa.`;
      }
```
E no botão de seleção de agendamento pendente:
**Substituir:**
```html
                <button class="btn btn-primary" style="font-size:12px; padding:6px 12px; white-space:nowrap;" onclick="startObservationFromSchedule('${s.id}')">
                  Iniciar Visita →
                </button>
```
**Por:**
```html
                <button class="btn btn-primary" style="font-size:12px; padding:6px 12px; white-space:nowrap;" onclick="startObservationFromSchedule('${s.id}')">
                  Iniciar Observação →
                </button>
```

---

### BLOCO 5: Setup da Observação (`#screenSetup` e `onSetupLinkedScheduleChange`)

#### 5.1 Em `index.html` (linhas 3014 a 3025):
**Substituir:**
```html
            <label class="form-label" style="color:#166534; font-weight:700; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#166534" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Vincular a uma Visita Agendada no Cronograma:
            </label>
            <select id="setupLinkedSchedule" class="form-select" onchange="onSetupLinkedScheduleChange()" style="border-color:#86EFAC; font-weight:600;">
              <option value="">-- Nenhuma (Observação Avulsa não Agendada) --</option>
            </select>
            <div style="font-size:11px; color:#15803D; margin-top:4px;">
              💡 Selecionar uma visita preenche automaticamente a escola, o profissional, a turma, o bimestre e o horário previsto.
            </div>
```
**Por:**
```html
            <label class="form-label" style="color:#166534; font-weight:700; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#166534" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Vincular a uma Observação Agendada no Cronograma:
            </label>
            <select id="setupLinkedSchedule" class="form-select" onchange="onSetupLinkedScheduleChange()" style="border-color:#86EFAC; font-weight:600;">
              <option value="">-- Nenhuma (Observação Avulsa não Agendada) --</option>
            </select>
            <div style="font-size:11px; color:#15803D; margin-top:4px;">
              💡 Selecionar uma observação preenche automaticamente a escola, o profissional, a turma, o bimestre e o horário previsto.
            </div>
```

#### 5.2 Em `index.html` (linhas 3085 a 3090):
**Substituir:**
```html
          <!-- Bloco de Registro Temporal Real da Visita Pedagógica -->
          <div style="margin-top:16px; padding-top:14px; border-top:1px dashed #CBD5E1;">
            <div style="font-size:12px; font-weight:700; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px;">
              Data e Horários da Visita Pedagógica
            </div>
```
**Por:**
```html
          <!-- Bloco de Registro Temporal Real da Observação Pedagógica -->
          <div style="margin-top:16px; padding-top:14px; border-top:1px dashed #CBD5E1;">
            <div style="font-size:12px; font-weight:700; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px;">
              Data e Horários da Observação Pedagógica
            </div>
```

#### 5.3 Em `index.html` (linha 8346 - função `onSetupLinkedScheduleChange`):
**Substituir:**
```javascript
          showToast(`A visita agendada era futura (${formatDateBR(prefilledSchedule.plannedDate)}). A data da observação foi ajustada para hoje.`);
```
**Por:**
```javascript
          showToast(`A observação agendada era futura (${formatDateBR(prefilledSchedule.plannedDate)}). A data foi ajustada para hoje.`);
```

---

### BLOCO 6: Observação Ativa, Síntese Pedagógica e Ocorrências

#### 6.1 Em `index.html` (linhas 3163, 3183 a 3205, 3340 e 3378):
**Substituir:**
```html
            <div class="page-title">Síntese Final da Visita Pedagógica</div>
```
**Por:**
```html
            <div class="page-title">Síntese Final da Observação Pedagógica</div>
```

E no bloco de identificação oficial:
**Substituir:**
```html
          <!-- Bloco de Identificação Oficial da Visita no Relatório e Síntese -->
          <div style="background:#F8FAFC; border:1px solid #CBD5E1; border-left:4px solid var(--primary-color); border-radius:8px; padding:12px 16px; margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
              <span style="font-size:13px; font-weight:800; color:var(--primary-dark); text-transform:uppercase; letter-spacing:0.5px;">
                <span>📋 Dados da Visita & Profissional Acompanhado(a)</span>
              </span>
```
**Por:**
```html
          <!-- Bloco de Identificação Oficial da Observação no Relatório e Síntese -->
          <div style="background:#F8FAFC; border:1px solid #CBD5E1; border-left:4px solid var(--primary-color); border-radius:8px; padding:12px 16px; margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
              <span style="font-size:13px; font-weight:800; color:var(--primary-dark); text-transform:uppercase; letter-spacing:0.5px;">
                <span>📋 Dados da Observação & Profissional Acompanhado(a)</span>
              </span>
```

E no bloco de horários da síntese:
**Substituir:**
```html
              <span style="font-size:12px; font-weight:700; color:var(--primary-color);">
                Registro de Período e Duração da Visita
              </span>
```
**Por:**
```html
              <span style="font-size:12px; font-weight:700; color:var(--primary-color);">
                Registro de Período e Duração da Observação
              </span>
```

E no botão de ocorrências da síntese:
**Substituir:**
```html
                <button type="button" class="btn btn-secondary" onclick="openImportObsNotesModal()" style="font-size:11px; padding:4px 8px; border-color:#CBD5E1;">
                  + Importar Ocorrências da Visita
                </button>
```
**Por:**
```html
                <button type="button" class="btn btn-secondary" onclick="openImportObsNotesModal()" style="font-size:11px; padding:4px 8px; border-color:#CBD5E1;">
                  + Importar Ocorrências da Observação
                </button>
```

E no placeholder do parecer geral:
**Substituir:**
```html
          <textarea id="synthesisGeneralComments" class="form-textarea" style="height:120px;" placeholder="Pontos fortes observados, combinados formativos e orientações pedagógicas para a próxima visita..."></textarea>
```
**Por:**
```html
          <textarea id="synthesisGeneralComments" class="form-textarea" style="height:120px;" placeholder="Pontos fortes observados, combinados formativos e orientações pedagógicas para a próxima observação..."></textarea>
```

E na descrição do botão flutuante FAB (linha 3902):
**Substituir:**
```html
          <div class="fab-menu-desc">Registrar apontamento qualitativo desta visita</div>
```
**Por:**
```html
          <div class="fab-menu-desc">Registrar apontamento qualitativo desta observação</div>
```

#### 6.2 No Código JS da Observação e Síntese:
- Em `updateObservationStatusButtons` (linhas 9374-9375):
**Substituir:**
```javascript
        synthBtn.setAttribute('title', 'Síntese Final da Visita');
        synthBtn.setAttribute('aria-label', 'Síntese Final da Visita');
```
**Por:**
```javascript
        synthBtn.setAttribute('title', 'Síntese Final da Observação');
        synthBtn.setAttribute('aria-label', 'Síntese Final da Observação');
```

- Em `renderSynthesisNotes` (linha 10210):
**Substituir:**
```javascript
        notesContainer.innerHTML = `<div style="font-size:12px; color:var(--text-secondary); font-style:italic;">Nenhuma ocorrência vinculada a este roteiro de visita.</div>`;
```
**Por:**
```javascript
        notesContainer.innerHTML = `<div style="font-size:12px; color:var(--text-secondary); font-style:italic;">Nenhuma ocorrência vinculada a este roteiro de observação.</div>`;
```

- Em `renderPrintFeedback` e evidências (linhas 10481 e 10579):
**Substituir:**
```html
              Nenhuma evidência fotográfica anexada aos critérios desta visita.
```
**Por:**
```html
              Nenhuma evidência fotográfica anexada aos critérios desta observação.
```
E:
**Substituir:**
```javascript
          rubricsHtml += `<h4 style="font-size:14px; font-weight:700; background:#E2E8F0; padding:6px 10px; border-radius:4px; color:#1E293B;">Evidências Gerais da Visita Pedagógica</h4>`;
```
**Por:**
```javascript
          rubricsHtml += `<h4 style="font-size:14px; font-weight:700; background:#E2E8F0; padding:6px 10px; border-radius:4px; color:#1E293B;">Evidências Gerais da Observação Pedagógica</h4>`;
```

- Em `openImportObsNotesModal` (linha 10905):
**Substituir:**
```javascript
      const targetLabel = obs.className ? `Turma ${obs.className}` : (obs.teacherName || 'visita');
```
**Por:**
```javascript
      const targetLabel = obs.className ? `Turma ${obs.className}` : (obs.teacherName || 'observação');
```

- No badge de ocorrência vinculada (linha 12668):
**Substituir:**
```javascript
          badgeHtml = '<span class="status-badge note" style="background:#EFF6FF; color:#1E40AF; border:1px solid #BFDBFE;">🔗 Vinculada à Visita</span>';
```
**Por:**
```javascript
          badgeHtml = '<span class="status-badge note" style="background:#EFF6FF; color:#1E40AF; border:1px solid #BFDBFE;">🔗 Vinculada à Observação</span>';
```

---

### BLOCO 7: Tela de Documentos Oficiais e Matrizes de Referência (`#screenDocs` e `renderRubricsAdminScreen`)

#### 7.1 Em `index.html` (linhas 3708 a 3715, 3958 e 4008 a 4014):
**Substituir:**
```html
              Instrumento de Acompanhamento das Visitas Pedagógicas
            </div>
            <div style="font-size:12px; color:var(--text-secondary); line-height:1.4;">
              Instrumento do formador para acompanhamento das visitas pedagógicas: planejamento didático-pedagógico, prática docente, implementação das formações continuadas e articulação formativa com a coordenação.
            </div>
```
**Por:**
```html
              Instrumento de Acompanhamento das Observações Pedagógicas
            </div>
            <div style="font-size:12px; color:var(--text-secondary); line-height:1.4;">
              Instrumento do formador para acompanhamento das observações pedagógicas: planejamento didático-pedagógico, prática docente, implementação das formações continuadas e articulação formativa com a coordenação.
            </div>
```

E na descrição geral (linha 3958):
**Substituir:**
```html
        Consulte, faça download ou atualize os instrumentos em PDF utilizados nas visitas pedagógicas da Educação Infantil do município de Patos. As atualizações enviadas ficam salvas localmente no navegador e passam a ser os documentos oficiais acessados pela rede.
```
**Por:**
```html
        Consulte, faça download ou atualize os instrumentos em PDF utilizados nas observações pedagógicas da Educação Infantil do município de Patos. As atualizações enviadas ficam salvas localmente no navegador e passam a ser os documentos oficiais acessados pela rede.
```

E no card de download do PDF (linhas 4009 a 4012):
**Substituir:**
```html
              <h4 style="font-size:14px; font-weight:800; color:var(--text-primary); margin-top:6px;">Instrumento de Acompanhamento das Visitas Pedagógicas</h4>
              <p style="font-size:12px; color:var(--text-secondary); margin-top:4px; line-height:1.4;">
                Instrumento do formador para acompanhamento das visitas pedagógicas: planejamento didático pedagógico, prática docente, implementação das formações e relação com a coordenação.
              </p>
```
**Por:**
```html
              <h4 style="font-size:14px; font-weight:800; color:var(--text-primary); margin-top:6px;">Instrumento de Acompanhamento das Observações Pedagógicas</h4>
              <p style="font-size:12px; color:var(--text-secondary); margin-top:4px; line-height:1.4;">
                Instrumento do formador para acompanhamento das observações pedagógicas: planejamento didático pedagógico, prática docente, implementação das formações e relação com a coordenação.
              </p>
```

E em `renderRubricsAdminScreen` (linha 16247):
**Substituir:**
```javascript
          ? '👔 <strong>Visualização:</strong> Instrumento de Acompanhamento das Visitas Pedagógicas (Coordenadores)'
```
**Por:**
```javascript
          ? '👔 <strong>Visualização:</strong> Instrumento de Acompanhamento das Observações Pedagógicas (Coordenadores)'
```

---

### BLOCO 8: Relatório Impresso e Devolutiva Pedagógica (`#printView`)

#### 8.1 Em `index.html` (linhas 11260 a 11280):
**Substituir:**
```html
          <!-- Dossiê do Docente e da Visita -->
          <table style="width:100%; border-collapse:collapse; margin-bottom:12px; font-size:12px;">
            <tr>
              <td style="padding:4px 8px;"><strong>Unidade Escolar:</strong> ${obs.schoolName}</td>
              <td style="padding:4px 8px;"><strong>Data da Visita:</strong> ${obsDateFormatted}</td>
            </tr>
```
**Por:**
```html
          <!-- Dossiê do Docente e da Observação -->
          <table style="width:100%; border-collapse:collapse; margin-bottom:12px; font-size:12px;">
            <tr>
              <td style="padding:4px 8px;"><strong>Unidade Escolar:</strong> ${obs.schoolName}</td>
              <td style="padding:4px 8px;"><strong>Data da Observação:</strong> ${obsDateFormatted}</td>
            </tr>
```

---

### BLOCO 9: Painel de Indicadores e Dossiê Longitudinal (`#screenIndicators`)

#### 9.1 Em `index.html` (linhas 14710 a 14720):
**Substituir:**
```html
            <div class="kpi-card">
              <div style="font-size:11px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Visitas Concluídas</div>
              <div style="font-size:24px; font-weight:800; color:var(--primary-dark); margin:4px 0;">${memberObs.length} de 4</div>
              <div style="font-size:11px; color:var(--text-secondary);">
                ${memberObs.length >= 2 ? 'Série histórica apta para cruzamento' : 'Visita diagnóstica inicial'}
              </div>
            </div>
```
**Por:**
```html
            <div class="kpi-card">
              <div style="font-size:11px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Observações Concluídas</div>
              <div style="font-size:24px; font-weight:800; color:var(--primary-dark); margin:4px 0;">${memberObs.length} de 4</div>
              <div style="font-size:11px; color:var(--text-secondary);">
                ${memberObs.length >= 2 ? 'Série histórica apta para cruzamento' : 'Observação diagnóstica inicial'}
              </div>
            </div>
```

#### 9.2 Em `index.html` (linhas 14795 a 14840):
**Substituir:**
```javascript
                    ${targetType === 'coordenador' ? 'Não aplicável para coordenação' : 'Sem registro na última visita'}
                  </div>
                </div>
                <div class="kpi-card">
                  <div style="font-size:11px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Status Bimestral</div>
                  <div style="font-size:13px; font-weight:700; color:var(--text-primary); margin:6px 0;">
                    <span>${targetType === 'coordenador' ? 'Foco em gestão' : 'Aguardando visita'}</span>
                  </div>
                  <div style="font-size:11px; color:var(--text-secondary);">Acompanhamento regular</div>
                </div>
              </div>
              <div style="background:#F8FAFC; border:1px dashed #CBD5E1; border-radius:8px; padding:20px; text-align:center; color:var(--text-secondary); font-size:13px; margin-top:12px;">
                Este profissional ainda não possui visitas concluídas no sistema. Agende ou finalize uma observação para iniciar o acompanhamento longitudinal item a item.
              </div>
```
**Por:**
```javascript
                    ${targetType === 'coordenador' ? 'Não aplicável para coordenação' : 'Sem registro na última observação'}
                  </div>
                </div>
                <div class="kpi-card">
                  <div style="font-size:11px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Status Bimestral</div>
                  <div style="font-size:13px; font-weight:700; color:var(--text-primary); margin:6px 0;">
                    <span>${targetType === 'coordenador' ? 'Foco em gestão' : 'Aguardando observação'}</span>
                  </div>
                  <div style="font-size:11px; color:var(--text-secondary);">Acompanhamento regular</div>
                </div>
              </div>
              <div style="background:#F8FAFC; border:1px dashed #CBD5E1; border-radius:8px; padding:20px; text-align:center; color:var(--text-secondary); font-size:13px; margin-top:12px;">
                Este profissional ainda não possui observações concluídas no sistema. Agende ou finalize uma observação para iniciar o acompanhamento longitudinal item a item.
              </div>
```

#### 9.3 Na Tabela Longitudinal e Cards (linhas 15590 a 15760):
**Substituir:**
```javascript
            evolutionBadge = `<span style="color:var(--text-secondary); font-size:11px; font-style:italic;">Aguardando Visita</span>`;
```
**Por:**
```javascript
            evolutionBadge = `<span style="color:var(--text-secondary); font-size:11px; font-style:italic;">Aguardando Observação</span>`;
```
E:
**Substituir:**
```html
              <td style="padding:4px 8px;"><strong>Visitas Finalizadas:</strong> ${memberObs.length} de 4 bimestres</td>
```
**Por:**
```html
              <td style="padding:4px 8px;"><strong>Observações Finalizadas:</strong> ${memberObs.length} de 4 bimestres</td>
```

---

### BLOCO 10: Algoritmo de Auditoria Modular (`audit_platform.py` e engine de `index.html`)

#### 10.1 Correção do Bug Residual em `catalogo_dados` (`index.html`, linha 17503):
**Substituir:**
```javascript
              // 6. VALIDAÇÃO DE SUPRESSÃO DE AVISOS E BADGES DE VINCULAÇÃO AUTOMÁTICA
              renderTeamMembersTable();
              const teamTableBody = document.getElementById('teamTableBody');
```
**Por:**
```javascript
              // 6. VALIDAÇÃO DE SUPRESSÃO DE AVISOS E BADGES DE VINCULAÇÃO AUTOMÁTICA
              renderTeamTable();
              const teamTableBody = document.getElementById('teamTableBody');
```

#### 10.2 Higienização de Logs no Módulo `sintese_finalizacao` (`index.html`, linha 17755):
**Substituir:**
```javascript
              logger.log('Cálculo da duração da visita em minutos (durationMinutes = 100)', true, `${obs.durationMinutes} min`);
```
**Por:**
```javascript
              logger.log('Cálculo da duração da observação em minutos (durationMinutes = 100)', true, `${obs.durationMinutes} min`);
```

#### 10.3 Renomeação do Módulo 8 em `index.html` (linhas 18118 a 18210):
**Substituir:**
```javascript
        // --- MÓDULO 8: Cronograma de Visitas, Destaque da Próxima Visita e Baixa Automática ---
        {
          id: 'agenda_cronograma',
          name: 'Cronograma de Visitas, Destaque da Próxima Visita e Baixa Automática',
          run: function(logger) {
            try {
              // 1. Simulação de agendamento de observação no cronograma
              openAddScheduleModal();
              const bimesterSelect = document.getElementById('modalScheduleBimester');
              const classSelect = document.getElementById('modalScheduleClass');
              const dateInput = document.getElementById('modalScheduleDate');
              const timeInput = document.getElementById('modalScheduleTime');

              if (!bimesterSelect || !classSelect || !dateInput || !timeInput) {
                throw new Error('Campos do modal #modalAddSchedule não foram encontrados no DOM');
              }

              bimesterSelect.value = '3º Bimestre';
              classSelect.innerHTML = '<option value="Infantil I - Turma A" data-school="EMEI Pequeno Príncipe" data-id="c1">Infantil I - Turma A</option>';
              classSelect.value = 'Infantil I - Turma A';
              dateInput.value = '2026-10-25';
              timeInput.value = '09:00';

              saveScheduleModal();

              const createdSched = (appState.schedules || []).find(s => s.className === 'Infantil I - Turma A' && s.bimester === '3º Bimestre' && s.plannedTime === '09:00');
              if (!createdSched) throw new Error('Agendamento criado via modal não foi localizado em appState.schedules');
              logger.log('Inclusão interativa de visita agendada no cronograma (#modalAddSchedule)', true);

              const simObs = {
                id: 'obs_sched_sync_test_' + Date.now(),
                scheduleId: createdSched.id,
                schoolName: 'EMEI Pequeno Príncipe',
                className: 'Infantil I - Turma A',
                bimester: '3º Bimestre',
                status: 'finalized',
                date: '2026-10-25'
              };
              appState.observations = appState.observations || [];
              appState.observations.push(simObs);

              // Simula baixa no cronograma
              createdSched.status = 'realizado';
              createdSched.observationId = simObs.id;
              saveState();

              const updatedSched = (appState.schedules || []).find(s => s.id === createdSched.id);
              if (!updatedSched || updatedSched.status !== 'realizado') {
                throw new Error('Agendamento não atualizado para realizado após finalização');
              }
              logger.log('Baixa automática no cronograma de visitas para status realizado', true);

              // Resolução relacional resiliente de observação vinculada
              const resolvedObs = findObservationForSchedule(updatedSched);
              if (!resolvedObs || resolvedObs.id !== simObs.id) {
                throw new Error('findObservationForSchedule não localizou a observação correspondente');
              }
              logger.log('Resolução relacional resiliente de observação vinculada à visita na agenda', true);

              // Renderização da tabela e validação do botão de devolutiva
              renderScheduleScreen();
              const tbody = document.getElementById('scheduleTableBody');
              const hasFeedbackBtn = tbody && (tbody.innerHTML.includes('viewFeedbackFromSchedule') || tbody.innerHTML.includes('Devolutiva'));
              if (!hasFeedbackBtn) {
                throw new Error('Botão de Devolutiva não foi renderizado na tabela da Agenda para visita realizada');
              }
              logger.log('Renderização do botão de devolutiva na tabela da aba de Agenda', true);
```
**Por:**
```javascript
        // --- MÓDULO 8: Cronograma de Observações, Destaque da Próxima Observação e Baixa Automática ---
        {
          id: 'agenda_cronograma',
          name: 'Cronograma de Observações, Destaque da Próxima Observação e Baixa Automática',
          run: function(logger) {
            try {
              // 1. Simulação de agendamento de observação no cronograma
              openAddScheduleModal();
              const bimesterSelect = document.getElementById('modalScheduleBimester');
              const classSelect = document.getElementById('modalScheduleClass');
              const dateInput = document.getElementById('modalScheduleDate');
              const timeInput = document.getElementById('modalScheduleTime');

              if (!bimesterSelect || !classSelect || !dateInput || !timeInput) {
                throw new Error('Campos do modal #modalAddSchedule não foram encontrados no DOM');
              }

              bimesterSelect.value = '3º Bimestre';
              classSelect.innerHTML = '<option value="Infantil I - Turma A" data-school="EMEI Pequeno Príncipe" data-id="c1">Infantil I - Turma A</option>';
              classSelect.value = 'Infantil I - Turma A';
              dateInput.value = '2026-10-25';
              timeInput.value = '09:00';

              saveScheduleModal();

              const createdSched = (appState.schedules || []).find(s => s.className === 'Infantil I - Turma A' && s.bimester === '3º Bimestre' && s.plannedTime === '09:00');
              if (!createdSched) throw new Error('Agendamento criado via modal não foi localizado em appState.schedules');
              logger.log('Inclusão interativa de observação agendada no cronograma (#modalAddSchedule)', true);

              const simObs = {
                id: 'obs_sched_sync_test_' + Date.now(),
                scheduleId: createdSched.id,
                schoolName: 'EMEI Pequeno Príncipe',
                className: 'Infantil I - Turma A',
                bimester: '3º Bimestre',
                status: 'finalized',
                date: '2026-10-25'
              };
              appState.observations = appState.observations || [];
              appState.observations.push(simObs);

              // Simula baixa no cronograma
              createdSched.status = 'realizado';
              createdSched.observationId = simObs.id;
              saveState();

              const updatedSched = (appState.schedules || []).find(s => s.id === createdSched.id);
              if (!updatedSched || updatedSched.status !== 'realizado') {
                throw new Error('Agendamento não atualizado para realizado após finalização');
              }
              logger.log('Baixa automática no cronograma de observações para status realizado', true);

              // Resolução relacional resiliente de observação vinculada
              const resolvedObs = findObservationForSchedule(updatedSched);
              if (!resolvedObs || resolvedObs.id !== simObs.id) {
                throw new Error('findObservationForSchedule não localizou a observação correspondente');
              }
              logger.log('Resolução relacional resiliente de observação vinculada ao agendamento no cronograma', true);

              // Renderização da tabela e validação do botão de devolutiva
              renderScheduleScreen();
              const tbody = document.getElementById('scheduleTableBody');
              const hasFeedbackBtn = tbody && (tbody.innerHTML.includes('viewFeedbackFromSchedule') || tbody.innerHTML.includes('Devolutiva'));
              if (!hasFeedbackBtn) {
                throw new Error('Botão de Devolutiva não foi renderizado na tabela da Agenda para observação realizada');
              }
              logger.log('Renderização do botão de devolutiva na tabela da aba de Agenda', true);
```

#### 10.4 Inclusão do Teste Determinístico do Pilar 6 no Módulo 12 (`navegacao_layout` em `index.html`):
No final do Módulo 12 (antes de fechar o bloco `try`):
**Adicionar:**
```javascript
              // 5. TESTE DE CONFORMIDADE PILAR 6: HIGIENIZAÇÃO TERMINOLÓGICA MANDATÓRIA ("VISITA" ➔ "OBSERVAÇÃO")
              const homeHeader = document.getElementById('homeScheduledHeader');
              if (homeHeader && homeHeader.textContent.toLowerCase().includes('visita')) {
                throw new Error('Pilar 6 Violado: #homeScheduledHeader ainda contém o termo "visita"');
              }
              const schedModalTitle = document.getElementById('scheduleModalTitle');
              if (schedModalTitle && schedModalTitle.textContent.toLowerCase().includes('visita')) {
                throw new Error('Pilar 6 Violado: #scheduleModalTitle ainda contém o termo "visita"');
              }
              const schedFilterStatus = document.getElementById('scheduleFilterStatus');
              if (schedFilterStatus && schedFilterStatus.innerHTML.toLowerCase().includes('visita')) {
                throw new Error('Pilar 6 Violado: #scheduleFilterStatus possui opções com o termo "visita"');
              }
              const addSchedBtn = document.querySelector('.btn-add-schedule');
              if (addSchedBtn && addSchedBtn.textContent.toLowerCase().includes('visita')) {
                throw new Error('Pilar 6 Violado: .btn-add-schedule ainda contém o termo "visita"');
              }
              logger.log('Conformidade Pilar 6: Erradicação de "visita" e validação universal de "observação" no DOM', true);
```

#### 10.5 Atualização em `audit_platform.py` (linha 30):
**Substituir:**
```python
    'agenda_cronograma': 'Cronograma de Visitas, Destaque da Próxima Visita e Baixa Automática',
```
**Por:**
```python
    'agenda_cronograma': 'Cronograma de Observações, Destaque da Próxima Observação e Baixa Automática',
```

---

### BLOCO 11: Gestão Dupla do Changelog (Texto e Site)

#### 11.1 No Cabeçalho da Barra Superior (`index.html`, linha 2578):
**Substituir:**
```html
        <button class="btn-changelog" onclick="openChangelogModal()" title="Histórico Integral de Modificações e Diretrizes">
          Versão 0.99 (v7.78)
        </button>
```
**Por:**
```html
        <button class="btn-changelog" onclick="openChangelogModal()" title="Histórico Integral de Modificações e Diretrizes">
          Versão 1.00 (v7.79)
        </button>
```

#### 11.2 No Modal de Changelog (`index.html`, inserir no topo da lista `#changelogEntriesList`):
```html
        <!-- VERSÃO 1.00 - HIGIENIZAÇÃO TERMINOLÓGICA MANDATÓRIA (PILAR 6: VISITA ➔ OBSERVAÇÃO) -->
        <div class="changelog-version-card" style="border-left: 4px solid #10B981; background: #FFFFFF; padding: 18px 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:8px;">
            <div style="display:flex; align-items:center; gap:10px;">
              <span style="background:#10B981; color:white; font-size:12px; font-weight:800; padding:3px 10px; border-radius:12px;">Versão 1.00 (Oficial)</span>
              <strong style="color:var(--primary-dark); font-size:15px;">Higienização Terminológica Mandatória (Pilar 6: "Visita" ➔ "Observação")</strong>
            </div>
            <span style="font-size:12px; color:var(--text-secondary); font-weight:600;">21/10/2026 · Marco Regulatório ST Criança</span>
          </div>
          <p style="font-size:13px; color:var(--text-secondary); line-height:1.5; margin-bottom:12px;">
            Consolidação da diretriz pedagógica aprovada por unanimidade (Reunião Técnica ST Criança, Minuto 00:19:27), com a erradicação definitiva do vocábulo policialesco <em>"visita"</em> e adoção universal do termo <strong>"observação"</strong> em 100% das telas, formulários, botões, modais, cabeçalhos, relatórios, feedbacks e artefatos de exportação.
          </p>
          <ul style="margin:0; padding-left:18px; font-size:12.5px; color:var(--text-primary); line-height:1.6;">
            <li>🧹 <strong>Erradicação Universal de "Visita":</strong> Substituição integral por <em>"Observação"</em>, <em>"Observações"</em> e <em>"Observar"</em> nas telas de Início, Cronograma/Agenda, Setup, Observação Ativa, Síntese Pedagógica, Indicadores e Documentos Oficiais.</li>
            <li>🗓️ <strong>Agenda e Hero Card:</strong> Rótulos atualizados para <em>"+ Agendar Nova Observação"</em>, <em>"Observações Ativas"</em>, <em>"Observações Arquivadas"</em> e card de destaque <em>"PRÓXIMA OBSERVAÇÃO"</em> com botão <em>"Iniciar Observação →"</em>.</li>
            <li>📊 <strong>Painel de Indicadores e Dossiê:</strong> KPIs atualizados para <em>"Observações Concluídas"</em>, <em>"Observação diagnóstica inicial"</em>, badges <em>"Aguardando Observação"</em> e acompanhamento longitudinal alinhado.</li>
            <li>📁 <strong>Exportações Padronizadas:</strong> Arquivos de download renomeados para <code>sertao_crianca_observacoes.json</code> e <code>sertao_crianca_observacoes.csv</code>.</li>
            <li>🔬 <strong>Auditoria Modular (100% Aprovada):** Correção no módulo <code>catalogo_dados</code> e inclusão de teste automatizado de integridade terminológica no Módulo 12.</li>
          </ul>
        </div>
```

#### 11.3 No Arquivo `CHANGELOG.md`:
Inserir no Sumário Executivo de Versões:
```markdown
| **1.00** | 21/10/2026 16:30 | `intermediárias/aplicativo_v100_pilar_6_higienizacao_terminologica_observacao.html` | Deliberação SerTão Criança / Pilar 6 | Pilar 6: Higienização terminológica mandatória, erradicação completa do vocábulo policialesco "visita" em 100% dos botões, rotas, relatórios e telas, padronização de "observação", renomeação de exportações e teste de conformidade no DOM 🧹 |
```
E adicionar a seção detalhada da Versão 1.00 conforme padrão canônico do projeto.

---

## 4. Critérios de Aceite e Roteiro de Teste/Validação

### 4.1 Roteiro de Testes Interativos
1. **Navegação na Tela Inicial (Home):**
   - Estando autenticado como Coordenadora (`mariana`), verificar a seção de agendamentos pendentes.
   - Constatar o cabeçalho: `🗓️ Minhas Próximas Observações Agendadas`.
   - Constatar que os botões nos cards exibem `Iniciar Observação →`.
   - Em caso de ausência de agendamentos, constatar `Você não possui nenhuma observação agendada pendente no momento.` e o botão `+ Agendar Nova Observação`.
2. **Navegação na Aba de Cronograma / Agenda (`#screenSchedule`):**
   - Verificar o botão primário: `+ Agendar Nova Observação`.
   - Verificar o título da barra de ferramentas: `Observações Planejadas e Realizadas`.
   - Verificar as opções do seletor de status: `Observações Ativas`, `Observações Arquivadas` e `Todas as Observações`.
   - Verificar o Hero Card superior: etiqueta em caixa alta `PRÓXIMA OBSERVAÇÃO` e botão `Iniciar Observação →`.
   - Clicar em `+ Agendar Nova Observação` e verificar o título do modal: `Planejar Observação no Cronograma`.
   - Arquivar uma observação realizada e constatar o toast: `Observação arquivada com sucesso! Movida para Observações Arquivadas.`.
3. **Navegação no Setup da Observação (`#screenSetup`):**
   - Verificar o seletor rápido: `Vincular a uma Observação Agendada no Cronograma:`.
   - Verificar o texto de dica: `💡 Selecionar uma observação preenche automaticamente a escola...`.
   - Verificar o título da seção temporal: `Data e Horários da Observação Pedagógica`.
4. **Navegação na Síntese Pedagógica e Observação Ativa:**
   - Iniciar uma observação e ir para a Síntese Final.
   - Constatar o título: `Síntese Final da Observação Pedagógica`.
   - Constatar o cartão de dados: `📋 Dados da Observação & Profissional Acompanhado(a)`.
   - Constatar o botão de ocorrências: `+ Importar Ocorrências da Observação`.
   - Constatar o placeholder: `...orientações pedagógicas para a próxima observação...`.
5. **Navegação no Painel de Indicadores (`#screenIndicators`):**
   - Acessar a aba de Indicadores.
   - No Dossiê Individual, constatar o card `Observações Concluídas` com subtítulo `Observação diagnóstica inicial`.
   - Constatar o badge `Aguardando Observação` nos bimestres ainda não concluídos.
6. **Navegação na Aba de Backup e Exportação (`#screenBackup`):**
   - Constatar o título do card: `📈 Observações Realizadas`.
   - Clicar em exportar JSON e verificar que o arquivo baixado chama-se `sertao_crianca_observacoes.json` com toast `Observações exportadas com sucesso (JSON).`.
   - Clicar em exportar CSV e verificar o arquivo `sertao_crianca_observacoes.csv`.
7. **Navegação na Aba de Documentos Oficiais (`#screenDocs`):**
   - Constatar os cards `Instrumento de Acompanhamento das Observações Pedagógicas`.

---

## 5. Seção Obrigatória de Auditoria: Alterações, Adições e Exclusões no Algoritmo de Auditoria (`audit_platform.py` e engine do `index.html`)

Em conformidade rigorosa com o item 5 da Etapa 1 do `WORKFLOW_MACOS.md`, a tabela abaixo detalha todas as intervenções a serem realizadas na suíte de testes determinísticos modo-a-modo para garantir **100% de cobertura da plataforma**:

| Módulo de Auditoria | Arquivo / Localização | Tipo de Modificação | Especificação Detalhada da Alteração |
| :--- | :--- | :---: | :--- |
| **`catalogo_dados`** (Módulo 2) | `index.html` (linha 17503) | **CORREÇÃO / FIX** | Substituição da chamada inválida `renderTeamMembersTable();` pela função canônica existente `renderTeamTable();`, solucionando a falha em `index.html` e restaurando a aprovação do módulo. |
| **`sintese_finalizacao`** (Módulo 5) | `index.html` (linha 17755) | **MODIFICAÇÃO** | Atualização do log descritivo de asserção: de `'Cálculo da duração da visita em minutos (durationMinutes = 100)'` para `'Cálculo da duração da observação em minutos (durationMinutes = 100)'`. |
| **`agenda_cronograma`** (Módulo 8) | `index.html` (linha 18121) | **MODIFICAÇÃO** | Atualização do nome oficial do módulo de `'Cronograma de Visitas, Destaque da Próxima Visita e Baixa Automática'` para `'Cronograma de Observações, Destaque da Próxima Observação e Baixa Automática'`. |
| **`agenda_cronograma`** (Módulo 8) | `index.html` (linhas 18138, 18192, 18199, 18208) | **MODIFICAÇÃO** | Atualização dos logs descritivos e da mensagem de erro de asserção para referenciar *"observação"* e *"agendamento no cronograma"* em vez de *"visita"*. |
| **`agenda_cronograma`** (Módulo 8) | `audit_platform.py` (linha 30) | **SINCRONIZAÇÃO** | Atualização do dicionário oficial `MODULE_DESCRIPTIONS['agenda_cronograma']` para corresponder exatamente ao novo nome padronizado. |
| **`navegacao_layout`** (Módulo 12) | `index.html` (Módulo 12, final) | **ADIÇÃO (NOVO TESTE)** | Inclusão de teste automatizado determinístico de regressão: varredura no DOM ativo validando que elementos-chave (`#homeScheduledHeader`, `#scheduleModalTitle`, `#scheduleFilterStatus`, `.btn-add-schedule`) não contêm a substring `"visita"` ou `"visitas"`. |
