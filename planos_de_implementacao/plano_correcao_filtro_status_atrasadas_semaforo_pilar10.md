# PLANO DE IMPLEMENTAÇÃO: CORREÇÃO DO FILTRO DE STATUS ATRASADAS NO SEMÁFORO (PILAR 10)

> **DIRETRIZ OBRIGATÓRIA DE EXECUÇÃO (ETAPA 2):**
> O assistente executor (Etapa 2) deve **obrigatoriamente ler e seguir as diretrizes dos arquivos `WORKFLOW_MACOS.md`, `AGENTS.md` e a skill `execucao-operario`** localizados na raiz do projeto antes de aplicar qualquer modificação no código. Nenhuma modificação deve ser realizada sem conformidade estrita com o workflow, incluindo:
> 1. Execução prévia de sincronização com o repositório remoto (`git pull origin main`).
> 2. Preservação integral das regras de negócio existentes, dados cadastrais, blindagens RBAC, série histórica, ciclo longitudinal, turmas integrais (Pilar 4), fechamento nominal e parecer em práticas consistentes (Pilar 5), higienização terminológica para "observação" (Pilar 6), KPIs decisórios com cobertura no bimestre corrente (Pilar 7), bloco de menores índices (Pilar 8), gaveta móvel de filtros (Pilar 9), semáforo bimestral de turmas e docentes (Pilar 10), gestão descentralizada (Pilar 14) e testes automatizados.
> 3. Verificação de integridade sintática obrigatória com JavaScriptCore (`python3 audit_platform.py --check-syntax`) antes de qualquer commit.
> 4. Verificação de integridade pós-edição com dupla checagem de leitura em cada trecho modificado.
> 5. Salvamento obrigatório do backup intermediário na pasta `intermediárias/` sob o nome `aplicativo_v127_correcao_filtro_status_atrasadas_pilar10.html`.
> 6. Gestão dupla de Changelog no arquivo `CHANGELOG.md` e no modal `#modalChangelog` / botão `.btn-changelog` do `index.html`, registrando a **Versão 1.27 (v8.1.2)**.
> 7. Checagem pré-push (`git fetch origin main`), verificação de commits concorrentes, commit semântico (`fix(indicators): assegurar modo turmas no filtro semaforico e isolar teste do pilar 10 (v1.27)`), push para `origin main` e deploy automático no GitHub Pages.
> 8. Execução pós-deploy obrigatória do algoritmo de auditoria (`python3 audit_platform.py --silent-on-success`) com comunicação estrita a falhas.

---

## 1. Diagnóstico e Causa Raiz do Erro

### 1.1 O Erro Apresentado
Ao executar o diagnóstico interno da plataforma, a suíte modular de testes reportou a seguinte falha:
```
[Log] ❌ FAIL | [indicadores_decisao] Erro de execução no módulo indicadores_decisao -> Falha Pilar 10: Filtro de status atrasadas não refletiu no DOM (supervisao-st-crianca, line 25365 / line 22916 em produção).
```

### 1.2 Mecânica e Análise da Causa Raiz
Ao inspecionar minuciosamente o código do módulo de auditoria e a função de renderização do Quadro de Controle Bimestral (Semáforo do Pilar 10) no `index.html`, identificou-se o desencadeamento exato do problema:

1. **Dualidade de Visões no Semáforo do Pilar 10:**
   O Quadro de Controle Bimestral (`#bimesterSemaphoreSection`) possui duas visões mutuamente exclusivas controladas por `appState.longitudinalViewMode`:
   - **Visão de Turmas (`viewMode === 'classes'`):** Exibe a matriz de turmas e a barra de filtros rápidos correspondente, cujo botão de atraso é renderizado como:
     ```html
     <button type="button" class="sem-filter-chip chip-red ..." onclick="filterSemaphoreByStatus('overdue')">
       🔴 Atrasadas (${semOverdueClassesCount})
     </button>
     ```
   - **Visão de Docentes Regentes (`viewMode === 'teachers'`):** Exibe a matriz de professores regentes titulares e sua respectiva barra de filtros rápidos, cujo botão de atraso é renderizado como:
     ```html
     <button type="button" class="sem-filter-chip chip-red ..." onclick="filterTeacherSemaphoreByStatus('overdue')">
       🔴 Com Atraso (${semOverdueTeachersCount})
     </button>
     ```

2. **Poluição de Estado Global (`appState.longitudinalViewMode`):**
   - Quando o usuário navega na plataforma e clica no botão "👥 Docentes Regentes" no Semáforo, a função `toggleLongitudinalViewMode('teachers')` é invocada, gravando `appState.longitudinalViewMode = 'teachers'` na memória e persistindo no `localStorage`.
   - Se o usuário aciona o diagnóstico interno da plataforma enquanto está nessa visão (ou se uma execução anterior de auditoria encerrou com erro enquanto testava docentes), o estado global `appState.longitudinalViewMode` permanece como `'teachers'`.

3. **Ausência de Reset Hermético e Acoplamento no Módulo de Teste:**
   - No início do módulo de teste `indicadores_decisao` (`AUDIT_MODULES`), o código executa `appState.currentUserKey = 'mariana';`, navega para a aba de indicadores e aciona `renderIndicatorsScreen()`. Contudo, **ele não redefine `appState.longitudinalViewMode` para `'classes'`**.
   - No Passo 12 do módulo `indicadores_decisao`, o teste executa:
     ```javascript
     // 12. PILAR 10: VALIDAÇÃO DOS FILTROS RÁPIDOS E ALTERNADOR DE VISÃO
     filterSemaphoreByStatus('overdue');
     const overdueSec = document.getElementById('bimesterSemaphoreSection');
     if (!overdueSec || !overdueSec.innerHTML.includes('🔴 Atrasadas')) {
       throw new Error('Falha Pilar 10: Filtro de status atrasadas não refletiu no DOM');
     }
     ```
   - A função `filterSemaphoreByStatus(statusKey)` apenas atualiza `appState.activeSemaphoreStatusFilter = statusKey` e dispara `renderIndicatorsScreen()`. **Ela não garantia que a visão ativa fosse `'classes'`**.
   - Como `appState.longitudinalViewMode` estava como `'teachers'`, `renderIndicatorsScreen()` gerou o HTML da **Visão de Docentes**. Nesse DOM, o botão gerado continha o texto `'🔴 Com Atraso'` e **não** `'🔴 Atrasadas'`.
   - A verificação `!overdueSec.innerHTML.includes('🔴 Atrasadas')` avaliou como falsa, lançando a exceção que reprovou o módulo.

4. **Falta de Idempotência nas Funções de Filtro Rápido:**
   - Chamar `filterSemaphoreByStatus` (que é o filtro do Semáforo de Turmas) sem estar na visão de turmas é uma incongruência de estado: a função deve forçar a alternância para a visão de Turmas (`appState.longitudinalViewMode = 'classes'`).
   - Simetricamente, `filterTeacherSemaphoreByStatus` (filtro do Semáforo de Docentes) deve assegurar que a visão ativa seja `'teachers'`.

---

## 2. Arquitetura e Mapeamento de Pontos de Impacto

Os pontos de impacto estão estritamente circunscritos a controladores de estado do Semáforo e ao isolamento de teste no `index.html`:

| Componente / Função | Localização no `index.html` | Papel e Correção Necessária |
| :--- | :--- | :--- |
| `function filterSemaphoreByStatus(statusKey)` | ~Linha 19450 | Garantir explicitamente `appState.longitudinalViewMode = 'classes'` antes de re-renderizar a tela. |
| `function filterTeacherSemaphoreByStatus(statusKey)` | ~Linha 19755 | Garantir explicitamente `appState.longitudinalViewMode = 'teachers'` antes de re-renderizar a tela. |
| `AUDIT_MODULES` (`id: 'indicadores_decisao'`) | ~Linha 25110 (Início) | Inicialização hermética do estado: redefinir `appState.longitudinalViewMode = 'classes'`, `activeSemaphoreStatusFilter = 'all'` e `activeSemaphoreTeacherStatusFilter = 'all'`. |
| `AUDIT_MODULES` (`id: 'indicadores_decisao'`) | ~Linha 25360 (Passo 12) | Blindagem explícita chamando `toggleLongitudinalViewMode('classes')` imediatamente antes de testar `filterSemaphoreByStatus('overdue')`. |
| `AUDIT_MODULES` (`id: 'indicadores_decisao'`) | ~Linha 25535 (`finally`) | Restauração mandatória de `appState.longitudinalViewMode = 'classes'`, `activeSemaphoreStatusFilter = 'all'` e `activeSemaphoreTeacherStatusFilter = 'all'`. |
| Changelog Duplo | `CHANGELOG.md` e `index.html` | Atualização sequencial para **Versão 1.27 (v8.1.2)** documentando a resolução do bug. |

---

## 3. Especificação de Implementação Passo a Passo (Snippets Exatos)

### Passo 1: Idempotência em `filterSemaphoreByStatus`
Localizar `function filterSemaphoreByStatus` em `index.html` (~Linha 19450):

**Antes:**
```javascript
    /**
     * Filtro rápido de status no Semáforo
     */
    function filterSemaphoreByStatus(statusKey) {
      appState.activeSemaphoreStatusFilter = statusKey; // 'all', 'overdue', 'in_progress', 'completed_cur', 'completed_all'
      renderIndicatorsScreen();
    }
```

**Depois:**
```javascript
    /**
     * Filtro rápido de status no Semáforo de Turmas (Pilar 10)
     */
    function filterSemaphoreByStatus(statusKey) {
      appState.activeSemaphoreStatusFilter = statusKey; // 'all', 'overdue', 'in_progress', 'completed_cur', 'completed_all'
      appState.longitudinalViewMode = 'classes'; // Garante determinismo na exibição do semáforo de turmas
      renderIndicatorsScreen();
    }
```

---

### Passo 2: Idempotência em `filterTeacherSemaphoreByStatus`
Localizar `function filterTeacherSemaphoreByStatus` em `index.html` (~Linha 19755):

**Antes:**
```javascript
    /**
     * Alternador de filtro rápido no Semáforo de Docentes
     */
    function filterTeacherSemaphoreByStatus(statusKey) {
      appState.activeSemaphoreTeacherStatusFilter = statusKey; // 'all', 'overdue', 'in_progress', 'completed_cur', 'completed_all'
      renderIndicatorsScreen();
    }
```

**Depois:**
```javascript
    /**
     * Alternador de filtro rápido no Semáforo de Docentes (Pilar 10)
     */
    function filterTeacherSemaphoreByStatus(statusKey) {
      appState.activeSemaphoreTeacherStatusFilter = statusKey; // 'all', 'overdue', 'in_progress', 'completed_cur', 'completed_all'
      appState.longitudinalViewMode = 'teachers'; // Garante determinismo na exibição do semáforo de docentes
      renderIndicatorsScreen();
    }
```

---

### Passo 3: Inicialização Hermética no Módulo `indicadores_decisao`
Localizar o início da função `run` do módulo `indicadores_decisao` em `AUDIT_MODULES` (~Linha 25110):

**Antes:**
```javascript
        // --- MÓDULO 10: Indicadores Pedagógicos, Cobertura no Bimestre Corrente (Pilar 7), KPIs Decisórios, Semáforo de Turmas (Pilar 10) e Apoio à Decisão ---
        {
          id: 'indicadores_decisao',
          name: 'Indicadores Pedagógicos, Cobertura no Bimestre Corrente (Pilar 7), KPIs Decisórios, Semáforo de Turmas (Pilar 10) e Apoio à Decisão',
          run: function(logger) {
            try {
              appState.currentUserKey = 'mariana';
              navigateToTab('indicators');
              renderIndicatorsScreen();
```

**Depois:**
```javascript
        // --- MÓDULO 10: Indicadores Pedagógicos, Cobertura no Bimestre Corrente (Pilar 7), KPIs Decisórios, Semáforo de Turmas (Pilar 10) e Apoio à Decisão ---
        {
          id: 'indicadores_decisao',
          name: 'Indicadores Pedagógicos, Cobertura no Bimestre Corrente (Pilar 7), KPIs Decisórios, Semáforo de Turmas (Pilar 10) e Apoio à Decisão',
          run: function(logger) {
            try {
              appState.currentUserKey = 'mariana';
              appState.longitudinalViewMode = 'classes';
              appState.activeSemaphoreStatusFilter = 'all';
              appState.activeSemaphoreTeacherStatusFilter = 'all';
              const memSelPre = document.getElementById('indicatorsMemberFilter');
              if (memSelPre) memSelPre.value = 'ALL';
              navigateToTab('indicators');
              renderIndicatorsScreen();
```

---

### Passo 4: Blindagem Ativa no Passo 12 do Módulo `indicadores_decisao`
Localizar o bloco 12 dentro de `indicadores_decisao` (~Linhas 25360-25370):

**Antes:**
```javascript
              // 12. PILAR 10: VALIDAÇÃO DOS FILTROS RÁPIDOS E ALTERNADOR DE VISÃO
              filterSemaphoreByStatus('overdue');
              const overdueSec = document.getElementById('bimesterSemaphoreSection');
              if (!overdueSec || !overdueSec.innerHTML.includes('🔴 Atrasadas')) {
                throw new Error('Falha Pilar 10: Filtro de status atrasadas não refletiu no DOM');
              }
              filterSemaphoreByStatus('all');
              logger.log('Validação interativa dos Filtros Rápidos de Status no Semáforo (Pilar 10)', true);
```

**Depois:**
```javascript
              // 12. PILAR 10: VALIDAÇÃO DOS FILTROS RÁPIDOS E ALTERNADOR DE VISÃO
              toggleLongitudinalViewMode('classes');
              filterSemaphoreByStatus('overdue');
              const overdueSec = document.getElementById('bimesterSemaphoreSection');
              if (!overdueSec || !overdueSec.innerHTML.includes('🔴 Atrasadas')) {
                throw new Error('Falha Pilar 10: Filtro de status atrasadas não refletiu no DOM');
              }
              filterSemaphoreByStatus('all');
              logger.log('Validação interativa dos Filtros Rápidos de Status no Semáforo (Pilar 10)', true);
```

---

### Passo 5: Higienização no Bloco `finally` de `indicadores_decisao`
Localizar o bloco `finally` ao término de `indicadores_decisao` (~Linha 25530):

**Antes:**
```javascript
              } finally {
                // Restaura períodos canônicos e usuário após o teste
                appState.bimesterPeriods = JSON.parse(JSON.stringify(DEFAULT_BIMESTER_PERIODS));
                saveState();
                appState.currentUserKey = previousUserInd || 'mariana';
                renderIndicatorsScreen();
              }
```

**Depois:**
```javascript
              } finally {
                // Restaura períodos canônicos, modos semafóricos e usuário após o teste
                appState.bimesterPeriods = JSON.parse(JSON.stringify(DEFAULT_BIMESTER_PERIODS));
                appState.longitudinalViewMode = 'classes';
                appState.activeSemaphoreStatusFilter = 'all';
                appState.activeSemaphoreTeacherStatusFilter = 'all';
                saveState();
                appState.currentUserKey = previousUserInd || 'mariana';
                renderIndicatorsScreen();
              }
```

---

### Passo 6: Atualização de Versão e Changelog Duplo (v1.27 · v8.1.2)

1. **No botão `.btn-changelog` de `index.html`:**
   ```html
   <button class="btn-changelog" onclick="openChangelogModal()" title="Histórico Integral de Modificações e Diretrizes">
     📌 Versão 1.27 (v8.1.2)
   </button>
   ```

2. **No `#modalChangelog` de `index.html`:**
   Inserir no topo dos registros:
   ```html
   <!-- VERSÃO 1.27 - CORREÇÃO DO FILTRO DE STATUS ATRASADAS NO SEMÁFORO (PILAR 10) -->
   <div class="card" style="margin-bottom:16px; border-left:4px solid #10B981;">
     <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
       <span style="font-size:14px; font-weight:800; color:#10B981;">Versão 1.27 · v8.1.2 (Oficial)</span>
       <span style="font-size:11px; background:#ECFDF5; color:#065F46; padding:2px 8px; border-radius:12px; font-weight:700;">26/10/2026</span>
     </div>
     <div style="font-size:12px; font-weight:700; color:var(--text-primary); margin-bottom:6px;">
       Correção do Filtro de Status Atrasadas e Idempotência Semafórica (Pilar 10):
     </div>
     <ul style="font-size:12px; color:var(--text-secondary); margin:0; padding-left:18px; line-height:1.5;">
       <li>🚦 <strong>Idempotência na Filtragem Rápida:</strong> A função <code>filterSemaphoreByStatus()</code> agora assegura a alternância determinística para a visão de Turmas (<code>appState.longitudinalViewMode = 'classes'</code>), enquanto <code>filterTeacherSemaphoreByStatus()</code> assegura o modo Docentes, impedindo descompassos de DOM.</li>
       <li>🛡️ <strong>Isolamento Hermético no Diagnóstico da Plataforma:</strong> Inicialização e finalização rigorosas das variáveis de visão no módulo de auditoria <code>indicadores_decisao</code>, blindando o teste contra estados residuais em <code>localStorage</code>.</li>
     </ul>
   </div>
   ```

3. **No `CHANGELOG.md`:**
   Inserir linha correspondente no Sumário Executivo e a seção descritiva da Versão 1.27.

4. **No módulo `navegacao_layout` de `AUDIT_MODULES`:**
   Atualizar a asserção de versão para `Versão 1.27`.

---

## 4. Critérios de Aceite e Roteiro de Teste

### 4.1 Critérios de Aceite
1. O filtro rápido `filterSemaphoreByStatus('overdue')` deve invariavelmente refletir o texto `🔴 Atrasadas` no DOM de `#bimesterSemaphoreSection`, independentemente de qual aba ou visão estava ativa anteriormente.
2. O filtro rápido `filterTeacherSemaphoreByStatus('overdue')` deve invariavelmente refletir o texto `🔴 Com Atraso` no DOM de `#bimesterSemaphoreSection`.
3. Ao alternar entre Turmas e Docentes na interface, nenhum botão ou card deve apresentar erro sintático ou exceção no console.
4. O diagnóstico interno da plataforma (`indicadores_decisao` e todos os outros 11 módulos) deve atingir **100% de aprovação (0 falhas)**, tanto se acionado com a visão de turmas ativa quanto se acionado com a visão de docentes ativa.

### 4.2 Roteiro de Teste
1. **Validação Sintática Pré-Voo (JSC):**
   ```bash
   python3 audit_platform.py --check-syntax
   ```
   Deve retornar sucesso absoluto sem SyntaxError.
2. **Execução Pós-Deploy do Módulo Específico:**
   ```bash
   python3 audit_platform.py --module indicadores_decisao --silent-on-success
   ```
   Deve executar silenciosamente com sucesso (código de saída 0).
3. **Execução Integral de Todos os Módulos:**
   ```bash
   python3 audit_platform.py --silent-on-success
   ```
   Deve executar os 12 módulos sem nenhuma falha reportada.

---

## 5. Seção Obrigatória de Auditoria (`audit_platform.py` e `index.html`)

- **Alterações em Testes Existentes:**
  - No módulo 10 (`indicadores_decisao`) de `index.html`: inclusão da redefinição de estado inicial (`appState.longitudinalViewMode = 'classes'`), chamada explícita `toggleLongitudinalViewMode('classes')` antes do teste de filtro de turmas, e higienização no `finally`.
  - No módulo 12 (`navegacao_layout`) de `index.html`: atualização da string de validação da versão do changelog para `Versão 1.27`.
- **Adições de Testes:**
  - Nenhuma nova dependência externa necessária; o teste existente ganha isolamento estrito contra poluição de estado.
- **Exclusões de Testes:**
  - Nenhuma asserção pedagógica ou estrutural foi excluída.
- **Impacto em `audit_platform.py`:**
  - Não requer alteração lógica no script python de auditoria, apenas execução via `--check-syntax` e `--silent-on-success`.
