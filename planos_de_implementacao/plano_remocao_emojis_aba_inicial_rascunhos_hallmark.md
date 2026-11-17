# PLANO DE IMPLEMENTAÇÃO · VERSÃO 1.75
## Erradicação de Emojis na Aba Inicial (Home), Higienização de Rascunhos em Andamento e Harmonização Hallmark para Coordenadora e Formadora

> **DIRETRIZ DE EXECUÇÃO OBRIGATÓRIA (LEITURA PRELIMINAR):**
> Antes de executar qualquer ação técnica desta intervenção, o assistente executor (Operário - Etapa 2) **DEVE OBRIGATORIAMENTE** ler o arquivo [`WORKFLOW_MACOS.md`](../WORKFLOW_MACOS.md) e seguir rigorosamente as instruções da skill `.agents/skills/execucao-operario/SKILL.md`. É terminantemente proibido abrir o Google Chrome gráfico (`open -a "Google Chrome"` ou `/browser`), cometer alterações parciais fora do escopo ou ignorar o teste pré-voo de integridade sintática JavaScriptCore (`python3 audit_platform.py --check-syntax`).

---

## 1. Diagnóstico e Contexto

A tela inicial (`#screenHome`) é a porta de entrada diária das **Coordenadoras Pedagógicas** (ex: Mariana Ferreira) e das **Formadoras Pedagógicas** (ex: Clarice Barbosa) no ecossistema SerTão Criança de Patos/PB.

Ao autenticar na plataforma nesses perfis, a visualização padrão (`#homeStandardView`) exibe:
1. **Hero Banner de Saudação:** Saudação nominal, cargo, unidade/polo e botão de ação primária (`#btnNewObsHero`).
2. **Seção de Rascunhos em Andamento (`#homeDraftsSection`):** Lista vertical de cards de rascunhos pendentes (`#homeDraftsContainer`) do próprio autor para retomada rápida de preenchimento.
3. **Seção de Próximas Observações Agendadas (`#homeScheduledSection`):** Quadro com as observações do cronograma longitudinal que estão no horizonte imediato (`#homeScheduledCardsList`).
4. **Card de Acesso Operacional Descentralizado (`#homeOpManagementCard`):** Atalho para "Gestão da Minha Escola" ou "Gestão do Polo Regional".

### Problemas Identificados (Violações ao Padrão Hallmark UI Standard):
1. **Uso Indevido de Emojis como Iconografia (Violação do Hallmark Floor 11):**
   - No título do rascunho: `📚 Turma: [Nome]` ou `📋 Coordenadora: [Nome]`.
   - Na linha de metadados da regência: `👩‍🏫 Regência: [Docentes]`.
   - Nos badges de turmas em tempo integral: `🌤️ Aguardando Tarde (Etapa 2/2)` e `☀️ Etapa 1: Manhã`.
   - Nos badges de agendamentos previstos na home: `🗓️ Prevista`.
   - No aviso de atraso de agendamentos: glifo unicode bruto `⚠ Em Atraso`.
   - No aviso de histórico letivo anterior: `⚠️ Atenção: Você está visualizando o histórico...`.
2. **Uso de Marcador Decorativo Solto (Violação do Hallmark Floor 10):**
   - No badge de agendamento do dia: `● Hoje` (dot decorativo solto em vez de tipografia tabular sóbria).
3. **Caixa Alta Forçada em Rótulos e Ações (Violação do Hallmark Floor 9):**
   - Ao aplicar os perfis em `js/core/rbac.js`, o texto do botão principal do hero banner é sobreposto por `NOVA OBSERVAÇÃO` (para coordenadora) e `AVALIAR COORDENAÇÃO` (para formadora), violando a diretriz de *sentence case* desprovida de all-caps forçado.
4. **Discrepância na Aba de Histórico:**
   - Na listagem histórica (`renderHistoryScreen` em `js/features/history_notes.js`), quando o usuário alterna para a sub-aba "Meus Rascunhos", os cards de rascunho renderizam os mesmos emojis legados (`📚`, `📋`, `👩‍🏫`, `🌤️`, `☀️`), gerando dissonância estética caso não sejam sincronizados.

---

## 2. Arquitetura e Pontos de Impacto

```
gestor supervisao_patos/
├── css/
│   ├── 01_base_tokens.css            # Declaração de tokens calm de badges e estados de rascunho
│   └── 02_layout.css                 # Refinamento de .draft-card, badges semânticos e SVG icons
├── js/
│   ├── core/
│   │   └── rbac.js                   # Ajuste de heroBtnText.innerText para sentence case ('Nova observação' / 'Avaliar coordenação')
│   ├── features/
│   │   └── history_notes.js          # Erradicação de emojis em renderHomeScreen() e renderHistoryScreen()
│   └── audit/
│       └── audit_engine.js           # Nova asserção de ausência absoluta de emojis na aba inicial (Módulo 12)
├── index.html                        # Substituição do emoji ⚠️ no #historicalYearWarningBanner por SVG vetorial
├── firebase_deploy/public/index.html # Cópia espelhada obrigatória de produção
└── CHANGELOG.md                      # Registro formal da Versão 1.75 (v8.2.41)
```

### Regras de Negócio e Invariantes Preservadas:
- **Zero impacto na lógica funcional:** As variáveis de estado `d.evaluatedType`, `d.isIntegral`, `d.integralStage`, `d.id` e `d.status` continuam operando de forma idêntica.
- **Rascunhos Privados (RBAC):** Continua sendo garantido que cada usuária visualize apenas os seus próprios rascunhos em andamento (`o.status === 'draft' && o.evaluatedBy === user.name`).
- **Nenhum `transition: all`:** Transições estritamente restritas a propriedades de opacidade, cor de borda e cor de fundo.
- **Acessibilidade WCAG AAA:** Contraste mínimo de 4.5:1 em todos os badges de status e tamanhos de clique ergonômicos (mínimo de 44px).

---

## 3. Especificação de Implementação Passo a Passo (Snippets Exatos)

### Passo 3.1: Ajuste de Rótulos em Sentence Case no RBAC (`js/core/rbac.js`)

**Localização:** Linhas ~565 e ~585 de `js/core/rbac.js`.

**Substituição 1 (Coordenadora):**
```javascript
// ANTES:
heroBtn.style.display = 'inline-flex';
heroBtnText.innerText = 'NOVA OBSERVAÇÃO';

// DEPOIS:
heroBtn.style.display = 'inline-flex';
heroBtnText.innerText = 'Nova observação';
```

**Substituição 2 (Formadora):**
```javascript
// ANTES:
heroBtn.style.display = 'inline-flex';
heroBtnText.innerText = 'AVALIAR COORDENAÇÃO';

// DEPOIS:
heroBtn.style.display = 'inline-flex';
heroBtnText.innerText = 'Avaliar coordenação';
```

---

### Passo 3.2: Estilos Hallmark e Pictogramas Vetoriais em `css/02_layout.css`

Adicionar ao final da seção de rascunhos em `css/02_layout.css`:

```css
/* ==========================================================================
   HALLMARK UI STANDARD: RASCUNHOS EM ANDAMENTO E BADGES DA TELA INICIAL
   ========================================================================== */
.draft-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 4px solid var(--primary);
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  box-sizing: border-box;
  flex-wrap: wrap;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.draft-card:hover {
  border-color: var(--primary-light);
  border-left-color: var(--primary-dark);
}

.draft-type-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
}

.draft-type-icon {
  display: inline-flex;
  align-items: center;
  color: var(--primary);
}

.draft-meta-line {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 3px;
  line-height: 1.4;
}

/* Badges Sóbrios de Etapas de Turmas Integrais (Substituição de ☀️ e 🌤️) */
.badge-stage-vespertino {
  font-size: 11px;
  font-weight: 600;
  background: #FFFBEB;
  color: #92400E;
  border: 1px solid #FDE68A;
  padding: 2px 8px;
  border-radius: 6px;
  margin-left: 6px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.badge-stage-matutino {
  font-size: 11px;
  font-weight: 600;
  background: #FAF5FF;
  color: #6B21A8;
  border: 1px solid #E9D5FF;
  padding: 2px 8px;
  border-radius: 6px;
  margin-left: 6px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* Badges Sóbrios de Agendamentos na Tela Inicial (Substituição de 🗓️, ⚠ e ●) */
.badge-status-today {
  font-size: 11px;
  font-weight: 600;
  background: #DCFCE7;
  color: #166534;
  border: 1px solid #BBF7D0;
  padding: 2px 8px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
}

.badge-status-overdue {
  font-size: 11px;
  font-weight: 600;
  background: #FEE2E2;
  color: #991B1B;
  border: 1px solid #FECACA;
  padding: 2px 8px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.badge-status-planned {
  font-size: 11px;
  font-weight: 600;
  background: #EFF6FF;
  color: #1E40AF;
  border: 1px solid #BFDBFE;
  padding: 2px 8px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
```

---

### Passo 3.3: Higienização de `renderHomeScreen()` em `js/features/history_notes.js`

**Localização:** Linhas ~89 a ~170 de `js/features/history_notes.js`.

#### Bloco 1: Próximas Observações Agendadas na Home (`#homeScheduledCardsList`):
```javascript
// ANTES:
if (s.plannedDate === todayStr) {
  badgeHtml = `<span style="font-size:10px; font-weight:700; background:#DCFCE7; color:#166534; padding:2px 6px; border-radius:10px;">● Hoje</span>`;
} else if (s.plannedDate < todayStr) {
  badgeHtml = `<span style="font-size:10px; font-weight:700; background:#FEE2E2; color:#991B1B; padding:2px 6px; border-radius:10px;">⚠ Em Atraso</span>`;
} else {
  badgeHtml = `<span style="font-size:10px; font-weight:700; background:#EFF6FF; color:#1E40AF; padding:2px 6px; border-radius:10px;">🗓️ Prevista</span>`;
}

// DEPOIS (Hallmark Standard):
if (s.plannedDate === todayStr) {
  badgeHtml = `<span class="badge-status-today">Hoje</span>`;
} else if (s.plannedDate < todayStr) {
  badgeHtml = `<span class="badge-status-overdue"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>Em atraso</span>`;
} else {
  badgeHtml = `<span class="badge-status-planned"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>Prevista</span>`;
}
```

#### Bloco 2: Rascunhos em Andamento na Home (`#homeDraftsContainer`):
```javascript
// ANTES:
drafts.slice(0, 3).forEach(d => {
  const item = document.createElement('div');
  item.className = 'draft-card';
  let title = d.evaluatedType === 'turma' ? `📚 Turma: ${d.className}` : (d.evaluatedType === 'coordenador' ? `📋 Coordenadora: ${d.teacherName}` : d.teacherName);
  let stageBadge = '';
  let actionBtnText = 'Continuar';
  let actionBtnStyle = 'padding:8px 14px;';

  if (d.isIntegral) {
    if (d.integralStage === 'vespertino') {
      stageBadge = `<span style="font-size:10px; font-weight:700; background:#FFFBEB; color:#B45309; border:1px solid #FDE68A; padding:2px 8px; border-radius:10px; margin-left:6px;">🌤️ Aguardando Tarde (Etapa 2/2)</span>`;
      actionBtnText = 'Retomar à Tarde →';
      actionBtnStyle = 'padding:8px 14px; background:#7C3AED; border-color:#6D28D9; font-weight:700;';
    } else {
      stageBadge = `<span style="font-size:10px; font-weight:700; background:#FAF5FF; color:#7C3AED; border:1px solid #E9D5FF; padding:2px 8px; border-radius:10px; margin-left:6px;">☀️ Etapa 1: Manhã</span>`;
    }
  }

  let meta = d.evaluatedType === 'turma'
    ? `👩‍🏫 Regência: ${d.teachers && d.teachers.length > 0 ? d.teachers.join(', ') : d.teacherName} · ${d.bimester || 'Bimestre'} · ${formatObservationDateRange(d) || d.date}`
    : `Turma: ${d.className} · ${d.bimester || 'Bimestre'} · ${formatObservationDateRange(d) || d.date}`;

  if (d.isIntegral && d.morningObs && d.morningObs.completed) {
    meta += ` · <span style="color:#1D4ED8; font-weight:700;">Manhã: ${d.morningObs.startTime || '08:00'}-${d.morningObs.endTime || '11:30'} (${d.morningObs.durationMinutes || '--'}m)</span>`;
  }

  item.innerHTML = `
    <div>
      <div class="draft-teacher" style="display:flex; align-items:center; flex-wrap:wrap; gap:4px;">
        <span>${title}</span>
        ${stageBadge}
      </div>
      <div class="draft-meta">${meta}</div>
    </div>
    <div style="display:flex; gap:8px;">
      <button class="btn btn-secondary" style="color:var(--red); padding:8px 12px;" onclick="confirmDeleteObservation('${d.id}')">Excluir</button>
      <button class="btn btn-primary" style="${actionBtnStyle}" onclick="resumeObservation('${d.id}', false)">${actionBtnText}</button>
    </div>
  `;
  container.appendChild(item);
});

// DEPOIS (Hallmark Standard):
drafts.slice(0, 3).forEach(d => {
  const item = document.createElement('div');
  item.className = 'draft-card';
  
  let typeIcon = '';
  let titleText = '';
  if (d.evaluatedType === 'turma') {
    typeIcon = `<svg class="btn-icon-sm" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
    titleText = `Turma: ${d.className}`;
  } else if (d.evaluatedType === 'coordenador') {
    typeIcon = `<svg class="btn-icon-sm" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>`;
    titleText = `Coordenadora: ${d.teacherName}`;
  } else {
    typeIcon = `<svg class="btn-icon-sm" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="7" r="4"/><path d="M5.5 21v-2a6.5 6.5 0 0 1 13 0v2"/></svg>`;
    titleText = d.teacherName;
  }

  let stageBadge = '';
  let actionBtnText = 'Continuar';
  let actionBtnStyle = 'padding:8px 14px;';

  if (d.isIntegral) {
    if (d.integralStage === 'vespertino') {
      stageBadge = `<span class="badge-stage-vespertino"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>Aguardando tarde · Etapa 2/2</span>`;
      actionBtnText = 'Retomar à tarde →';
      actionBtnStyle = 'padding:8px 14px; background:#7C3AED; border-color:#6D28D9; font-weight:700;';
    } else {
      stageBadge = `<span class="badge-stage-matutino"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>Etapa 1 · Matutino</span>`;
    }
  }

  let meta = d.evaluatedType === 'turma'
    ? `Regência: ${d.teachers && d.teachers.length > 0 ? d.teachers.join(', ') : d.teacherName} · ${d.bimester || 'Bimestre'} · ${formatObservationDateRange(d) || d.date}`
    : `Turma: ${d.className} · ${d.bimester || 'Bimestre'} · ${formatObservationDateRange(d) || d.date}`;

  if (d.isIntegral && d.morningObs && d.morningObs.completed) {
    meta += ` · <span style="color:#1D4ED8; font-weight:700;">Manhã: ${d.morningObs.startTime || '08:00'}-${d.morningObs.endTime || '11:30'} (${d.morningObs.durationMinutes || '--'}m)</span>`;
  }

  item.innerHTML = `
    <div>
      <div class="draft-teacher" style="display:flex; align-items:center; flex-wrap:wrap; gap:6px;">
        <span class="draft-type-tag">
          <span class="draft-type-icon">${typeIcon}</span>
          <span>${titleText}</span>
        </span>
        ${stageBadge}
      </div>
      <div class="draft-meta draft-meta-line">${meta}</div>
    </div>
    <div style="display:flex; gap:8px;">
      <button class="btn btn-secondary" style="color:var(--red); padding:8px 12px;" onclick="confirmDeleteObservation('${d.id}')">Excluir</button>
      <button class="btn btn-primary" style="${actionBtnStyle}" onclick="resumeObservation('${d.id}', false)">${actionBtnText}</button>
    </div>
  `;
  container.appendChild(item);
});
```

---

### Passo 3.4: Higienização de `renderHistoryScreen()` para Rascunhos em `js/features/history_notes.js`

**Localização:** Linhas ~330 e ~369 a ~386 de `js/features/history_notes.js`.

Erradicar os mesmos emojis (`📚`, `📋`, `👩‍🏫`, `🌤️`, `☀️`) nos cards de rascunho da aba de Histórico, substituindo por:
1. `cardTitle`: `Turma: ${item.className}` ou `Coordenadora: ${item.teacherName}` (acompanhado de pictograma SVG vetorial).
2. `cardMeta`: `Regência: ${...}` (sem emoji `👩‍🏫`).
3. `draftBadgeHtml` (integral):
   - Vespertino: `<span class="badge-stage-vespertino"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>Aguardando tarde · Etapa 2/2</span>`
   - Matutino: `<span class="badge-stage-matutino"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>Etapa 1 · Matutino</span>`

---

### Passo 3.5: Higienização do Banner de Ano Histórico em `index.html`

**Localização:** Linhas ~98-105 de `index.html`.

**Substituição:**
```html
<!-- ANTES: -->
<div id="historicalYearWarningBanner" style="display:none; background:#FFFBEB; border-bottom:1px solid #FDE68A; padding:8px 20px; font-size:12px; font-weight:600; color:#92400E; justify-content:space-between; align-items:center;">
  <div style="display:flex; align-items:center; gap:8px;">
    <span>⚠️ <strong>Atenção:</strong> Você está visualizando o histórico do <strong>Ano Letivo <span id="historicalYearBannerLabel">2025</span></strong>. Novos lançamentos devem ser efetuados preferencialmente no ano letivo vigente.</span>
  </div>
  ...
</div>

<!-- DEPOIS (Hallmark Standard com SVG): -->
<div id="historicalYearWarningBanner" style="display:none; background:#FFFBEB; border-bottom:1px solid #FDE68A; padding:8px 20px; font-size:12px; font-weight:600; color:#92400E; justify-content:space-between; align-items:center;">
  <div style="display:flex; align-items:center; gap:8px;">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="2.5" style="flex-shrink:0;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
    <span><strong>Atenção:</strong> Você está visualizando o histórico do <strong>Ano Letivo <span id="historicalYearBannerLabel">2025</span></strong>. Novos lançamentos devem ser efetuados preferencialmente no ano letivo vigente.</span>
  </div>
  ...
</div>
```

---

## 4. Critérios de Aceite e Roteiro de Teste

### Critérios de Aceite:
1. **Zero Emojis na Seção de Rascunhos da Home:** `#homeDraftsContainer` não deve conter nenhum emoji (`📚`, `📋`, `👩‍🏫`, `🌤️`, `☀️`) sob qualquer condição (turma simples, coordenadora avaliada ou turma integral com etapas matutina/vespertina).
2. **Zero Emojis na Seção de Agendamentos da Home:** `#homeScheduledCardsList` não deve conter `🗓️`, `⚠` ou marcadores decorativos `●`, utilizando badges semânticos sóbrios (`.badge-status-today`, `.badge-status-overdue`, `.badge-status-planned`).
3. **Tipografia em Sentence Case:** O botão `#btnNewObsHero` deve renderizar "Nova observação" para Mariana (Coordenadora) e "Avaliar coordenação" para Clarice (Formadora).
4. **Coerência na Listagem de Rascunhos do Histórico:** Ao clicar no filtro "Meus Rascunhos" em Histórico, a visualização deve estar 100% livre dos mesmos emojis residuais.
5. **Preservação de Integridade e Ações:** Os botões "Continuar", "Retomar à tarde →" e "Excluir" devem permanecer 100% funcionais, acionando as rotinas corretas sem interrupção de fluxo.

### Roteiro de Teste Mecânico:
1. **Validação Pré-Voo JSC:**
   ```bash
   python3 audit_platform.py --check-syntax
   ```
   Deve retornar 100% de sucesso léxico/sintático em todos os scripts.
2. **Simulação de Perfis:**
   - Efetuar login ou alternar para Mariana Ferreira (`mariana`).
   - Verificar `#homeDraftsContainer`: confirmar que o card de rascunho de Mariana (`obs-003`) exibe pictograma vetorial SVG, "Turma: [Nome]" ou "Regência: [Docente]" sem nenhum caractere emoji.
   - Alternar para Clarice Barbosa (`clarice`).
   - Verificar a home de Clarice: confirmar que o botão do hero exibe "Avaliar coordenação" e a seção de rascunhos está limpa.

---

## 5. Seção Obrigatória de Auditoria (`audit_platform.py` / `js/audit/audit_engine.js`)

### Alterações, Inclusões e Exclusões no Algoritmo de Auditoria:

#### Nova Asserção Mandatória no Módulo 12 (`navegacao_layout`) de `js/audit/audit_engine.js`:
Adicionar ao final da suíte do Módulo 12 o teste específico da Versão 1.75:

```javascript
// =========================================================================
// 23. VALIDAÇÃO DA ERRADICAÇÃO DE EMOJIS NA ABA INICIAL E RASCUNHOS (VERSÃO 1.75)
// =========================================================================
selectUserAccount('mariana');
navigateToTab('home');

const homeDraftsContainer = document.getElementById('homeDraftsContainer');
const homeScheduledCardsList = document.getElementById('homeScheduledCardsList');
const heroBtnText = document.getElementById('btnNewObsText');

// Regex de emojis e glifos brutos proibidos na Home
const bannedHomeEmojis = /[📚📋👩‍🏫☀️🌤️🗓️⚠️●]/;

if (homeDraftsContainer && homeDraftsContainer.children.length > 0) {
  if (bannedHomeEmojis.test(homeDraftsContainer.innerHTML)) {
    throw new Error('A seção #homeDraftsContainer ainda contém emojis residuais na visualização de rascunhos');
  }
}

if (homeScheduledCardsList && homeScheduledCardsList.children.length > 0) {
  if (bannedHomeEmojis.test(homeScheduledCardsList.innerHTML)) {
    throw new Error('A seção #homeScheduledCardsList ainda contém emojis ou marcadores brutos');
  }
}

if (heroBtnText && heroBtnText.innerText !== 'Nova observação') {
  throw new Error(`Texto do botão Hero para Coordenadora deve estar em sentence case ('Nova observação'), obtido: '${heroBtnText.innerText}'`);
}

// Teste para Perfil Formadora
selectUserAccount('clarice');
if (heroBtnText && heroBtnText.innerText !== 'Avaliar coordenação') {
  throw new Error(`Texto do botão Hero para Formadora deve estar em sentence case ('Avaliar coordenação'), obtido: '${heroBtnText.innerText}'`);
}

logger.log('Erradicação completa de emojis na aba inicial (Rascunhos e Agendamentos) e conformidade Hallmark (Versão 1.75)', true);
```

---

## 6. Sincronização e Checklist de Entrega

1. Salvar backup em `intermediárias/aplicativo_v1.75_remocao_emojis_aba_inicial_rascunhos_hallmark.html`.
2. Registrar a Versão 1.75 no topo de `CHANGELOG.md` e no `#modalChangelog` / botão `.btn-changelog` de `index.html`.
3. Sincronizar simultaneamente:
   - `gestor supervisao_patos/index.html`
   - `gestor supervisao_patos/firebase_deploy/public/index.html`
4. Executar checagem sintática: `python3 audit_platform.py --check-syntax`.
5. Executar checagem de concorrência pré-push (`git fetch origin main`), commitar e enviar (`git push origin main`).
6. Executar auditoria automatizada pós-deploy: `python3 audit_platform.py --silent-on-success`.
