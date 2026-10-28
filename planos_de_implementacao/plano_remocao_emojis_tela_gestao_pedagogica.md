# Plano de Implementação: Remoção de Emojis e Padronização Visual na Tela de Gestão Pedagógica

---

## 0. Diretriz de Execução (Obrigatória para o Operário - Etapa 2)
> [!IMPORTANT]
> **Leitura Prévia Obrigatória:** Antes de executar qualquer ação deste plano, o assistente na **Etapa 2 (O Operário)** DEVE consultar e seguir rigorosamente:
> 1. [WORKFLOW_MACOS.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md)
> 2. [WORKFLOW_GITHUB.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_GITHUB.md)
> 3. [.agents/skills/execucao-operario/SKILL.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/.agents/skills/execucao-operario/SKILL.md)
> 4. [.agents/skills/auditoria-plataforma/SKILL.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/.agents/skills/auditoria-plataforma/SKILL.md)
>
> **Trava de Fidelidade, Estabilidade e Não Regressão:** Este plano contempla a higienização visual e semiótica da tela de **Gestão Pedagógica / Gestão da Rede / Gestão Operacional** (`#homeGestaoView`, ativada na rota `'opManagement'`, `'units'`, `'team'` e na aba inicial da Coordenadora do Núcleo de EI), bem como de seus modais e cards correlatos.
> Devem ser eliminados todos os emojis Unicode coloridos residuais (`🏫`, `🗺️`, `🏢`, `💾`, `✏️`, `📍`, `👁️`, `✉️`, `☀️`, `🌤️`, `🗑️`, `⚠️`, `📅`, `🛡️`, `🏛️`), substituindo-os por pictogramas vetoriais padronizados (*Feather / Lucide* em SVGs inline monocromáticos com classe `.btn-icon` e `stroke="currentColor"`) ou por tipografia limpa.
> Todas as regras de negócio de governança territorial (SSOT), RBAC, atribuição de turmas, edição de polos, cadastros e filtros DEVEM permanecer 100% intactas.

---

## 1. Diagnóstico e Contexto

### 1.1 Contexto e Justificativa Institucional
Na plataforma *SerTão Criança*, o módulo de **Gestão Pedagógica** (`#homeGestaoView`) é o centro de controle territorial e operacional da rede municipal de ensino de Patos/PB. Ele atende de forma descentralizada a três perfis fundamentais:
1. **Coordenadora do Núcleo de EI (Helena):** Governança global da rede municipal (Polos Regionais, Unidades Escolares, Equipes/Servidores e Extrações SSOT);
2. **Formadora Pedagógica (Clarice):** Supervisão territorial dos Polos Regionais, coordenações e UEs vinculadas;
3. **Coordenação Pedagógica de UE (Mariana Ferreira):** Administração autônoma da Unidade Escolar (caracterização da escola, turmas ativas e regência titular).

Historicamente, nas primeiras versões da plataforma, foram inseridos emojis Unicode coloridos em títulos, botões de ação rápida, tabelas e modais. Embora a versão 1.38 tenha iniciado a padronização das sub-abas superiores (`#pedagTabUnits`, `#pedagTabClasses`, etc.) e dos cards de exportação SSOT, restaram emojis residuais no corpo das tabelas, no card de acesso da tela inicial, nos botões de edição/visualização e nos modais de gestão.

### 1.2 Problemas da Abordagem Anterior
1. **Inconsistência Semiótica Multiplataforma:** Emojis renderizam de forma discrepante entre Apple (macOS/iOS), Microsoft (Windows) e Google (Android/ChromeOS), prejudicando a sobriedade institucional da Secretaria de Educação.
2. **Poluição Visual em Telas Densas:** Ícones com preenchimentos coloridos chamativos competem com as badges analíticas de status pedagógico (`status-badge`).
3. **Harmonia com o Design System:** Todas as demais telas modernizadas do sistema (Header, Barra de Navegação, Indicadores, Rubricas e Extrações) já utilizam pictogramas vetoriais SVG monocromáticos limpos.

### 1.3 Mapeamento Detalhado dos Emojis Encontrados
Foram localizados 15 pontos exatos com emojis vinculados à Gestão Pedagógica:
1. **`index.html` (L185):** Emoji `🏫` no card dinâmico `#homeOpManagementIcon` na tela inicial;
2. **`index.html` (L280):** Emoji `🗺️` no título da Matriz de Distribuição e Cobertura da Rede por Polo Regional;
3. **`js/features/management.js` (L27 & L32):** Emojis `🏢` (ícone da UE) e `💾` (botão `💾 Salvar Caracterização da UE`) no card de caracterização da escola do coordenador;
4. **`js/features/management.js` (L122):** Emoji `🏢` na lista de UEs vinculadas na tabela de Polos;
5. **`js/features/management.js` (L130):** Emoji `✏️` no botão `✏️ Editar` da tabela de Polos;
6. **`js/features/management.js` (L189):** Emoji `📍` na badge de Polo da tabela de Unidades Escolares (`📍 ${u.polo}`);
7. **`js/features/management.js` (L193):** Emoji `👁️` no botão `👁️ Ver Turmas` da tabela de Unidades Escolares;
8. **`js/features/management.js` (L220):** Emoji `📍` no subtítulo do modal `#modalViewUnitClasses` (`📍 ${unit.polo}`);
9. **`index.html` (L4994):** Emoji `🏢` no cabeçalho do modal `#modalViewUnitClasses`;
10. **`js/features/management.js` (L334):** Emoji `🏢` na lista de UEs do checklist no modal `#modalEditPolo`;
11. **`js/features/management.js` (L1385):** Emoji `✉️` no subtítulo de e-mail da tabela de Servidores (`✉️ ${memberEmail}`);
12. **`js/features/management.js` (L1393):** Emoji `📍` na badge de Polo da tabela de Servidores (`📍 ${poloName}`);
13. **`index.html` (L5109 & L5113):** Emojis `☀️` e `🌤️` nos rótulos de turnos do modal de cadastro de turmas (`#modalClassEditor`);
14. **`index.html` (L5274 & L5293):** Emojis `🗑️` e `⚠️` no modal de confirmação de exclusão (`#modalConfirmDelete`);
15. **`index.html` (L5314 & L5434), `js/services/export_backup.js` (L604), `js/core/rbac.js` (L629, L654, L671):** Emojis `📅` (modal ciclos), `🛡️` (patrimônio / bloqueio temporal) e `🏫`, `🗺️`, `🏛️` nos textos dinâmicos do drawer mobile (`mobMenuOpText`).

---

## 2. Arquitetura e Pontos de Impacto

### 2.1 Arquivos Afetados
- [index.html](file:///Users/bruno/Desktop/gestor%20supervisao_patos/index.html)
- [js/features/management.js](file:///Users/bruno/Desktop/gestor%20supervisao_patos/js/features/management.js)
- [js/core/rbac.js](file:///Users/bruno/Desktop/gestor%20supervisao_patos/js/core/rbac.js)
- [js/services/export_backup.js](file:///Users/bruno/Desktop/gestor%20supervisao_patos/js/services/export_backup.js)
- [js/audit/audit_engine.js](file:///Users/bruno/Desktop/gestor%20supervisao_patos/js/audit/audit_engine.js) (Inclusão de asserções estritas de ausência de emojis no Módulo 11/12)
- [CHANGELOG.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/CHANGELOG.md)
- [gestor supervisao_patos/firebase_deploy/public/index.html](file:///Users/bruno/Desktop/gestor%20supervisao_patos/gestor%20supervisao_patos/firebase_deploy/public/index.html) (Cópia espelhada obrigatória)
- [gestor supervisao_patos/firebase_deploy/public/js/](file:///Users/bruno/Desktop/gestor%20supervisao_patos/gestor%20supervisao_patos/firebase_deploy/public/js/) (Cópia espelhada dos módulos JS)

### 2.2 Especificação dos Pictogramas Vetoriais (Design System)
Todos os novos ícones devem adotar o padrão *Feather / Lucide*:
- `fill="none"`
- `stroke="currentColor"`
- `stroke-width="2"`
- `stroke-linecap="round"`
- `stroke-linejoin="round"`
- Classes utilitárias `.btn-icon` (16x16px) ou estilização inline contextual.

---

## 3. Especificação de Implementação Passo a Passo (Snippets Exatos)

### Passo 1: Higienização do Card de Acesso na Tela Inicial (`index.html`)
Local: Linha ~185 de `index.html`.
Substituir o emoji `🏫` por pictograma vetorial institucional:

```html
<!-- ANTES -->
<div style="font-size:28px;" id="homeOpManagementIcon">🏫</div>

<!-- DEPOIS -->
<div id="homeOpManagementIcon" style="display:flex; align-items:center; justify-content:center; width:44px; height:44px; border-radius:10px; background:#EFF6FF; color:var(--primary); flex-shrink:0;">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 21h18M3 7l9-4 9 4v14M9 21V9h6v12"/>
  </svg>
</div>
```

---

### Passo 2: Higienização do Título da Matriz de Distribuição (`index.html`)
Local: Linha ~280 de `index.html`.
Substituir o emoji `🗺️` por pictograma vetorial de mapa/território:

```html
<!-- ANTES -->
<div style="font-size:15px; font-weight:800; color:var(--primary-dark);">
  🗺️ Matriz de Distribuição e Cobertura da Rede por Polo Regional
</div>

<!-- DEPOIS -->
<div style="font-size:15px; font-weight:800; color:var(--primary-dark); display:flex; align-items:center; gap:8px;">
  <svg class="btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--primary);">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
    <line x1="8" y1="2" x2="8" y2="18"/>
    <line x1="16" y1="6" x2="16" y2="22"/>
  </svg>
  <span>Matriz de Distribuição e Cobertura da Rede por Polo Regional</span>
</div>
```

---

### Passo 3: Higienização da Caracterização da UE em `js/features/management.js`
Local: Linhas ~27 e ~32 de `js/features/management.js`.
Remover `🏢` e `💾`, integrando pictograma de salvar:

```javascript
// ANTES
<div style="display:flex; align-items:center; gap:8px;">
  <span style="font-size:24px;">🏢</span>
  <h3 style="font-size:18px; font-weight:800; color:var(--primary-dark); margin:0;">${myUnit.name}</h3>
</div>
...
<button class="btn btn-primary" onclick="saveSchoolCharacterization()" style="font-size:12px; padding:8px 14px;">
  💾 Salvar Caracterização da UE
</button>

// DEPOIS
<div style="display:flex; align-items:center; gap:8px;">
  <svg class="btn-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--primary);"><path d="M3 21h18M3 7l9-4 9 4v14M9 21V9h6v12"/></svg>
  <h3 style="font-size:18px; font-weight:800; color:var(--primary-dark); margin:0;">${myUnit.name}</h3>
</div>
...
<button class="btn btn-primary" onclick="saveSchoolCharacterization()" style="font-size:12px; padding:8px 14px;">
  <svg class="btn-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
  Salvar Caracterização da UE
</button>
```

---

### Passo 4: Higienização da Tabela de Cobertura por Polo em `js/features/management.js`
Local: Linhas ~122 e ~130 de `js/features/management.js`.
Remover `🏢` dos nomes de UEs e `✏️` do botão de edição:

```javascript
// ANTES
<div style="cursor:pointer; color:var(--primary); font-weight:600; margin-bottom:3px; display:inline-block;" onclick="openViewUnitClassesModal('${u.id}')" title="Clique para visualizar turmas e docentes atribuídos em ${u.name}">
  🏢 ${u.name}
</div>
...
${canEditPolo ? `<button class="btn btn-secondary" style="padding:4px 8px; font-size:11px; margin-right:4px;" onclick="openEditPoloModal('${encodeURIComponent(poloName)}')">✏️ Editar</button>` : '<span style="color:var(--text-secondary); font-size:11px;">Somente Leitura</span>'}

// DEPOIS
<div style="cursor:pointer; color:var(--primary); font-weight:600; margin-bottom:3px; display:inline-flex; align-items:center; gap:4px;" onclick="openViewUnitClassesModal('${u.id}')" title="Clique para visualizar turmas e docentes atribuídos em ${u.name}">
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M3 7l9-4 9 4v14M9 21V9h6v12"/></svg>
  <span>${u.name}</span>
</div>
...
${canEditPolo ? `<button class="btn btn-secondary" style="padding:4px 8px; font-size:11px; margin-right:4px;" onclick="openEditPoloModal('${encodeURIComponent(poloName)}')"><svg class="btn-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Editar</button>` : '<span style="color:var(--text-secondary); font-size:11px;">Somente Leitura</span>'}
```

---

### Passo 5: Higienização da Tabela de Unidades Escolares em `js/features/management.js`
Local: Linhas ~189 e ~193 de `js/features/management.js`.
Remover `📍` da badge de Polo e `👁️` do botão de turmas:

```javascript
// ANTES
<td><span class="status-badge" style="background:#DCFCE7; color:#166534; font-weight:700; font-size:11px;">📍 ${u.polo}</span></td>
<td>${u.address || 'Não informado'}</td>
<td><span class="status-badge" style="background:#EFF6FF; color:#1E40AF;">${teachersCount} Profissionais</span></td>
<td style="text-align:center; white-space:nowrap;">
  <button class="btn btn-secondary" style="padding:4px 8px; font-size:11px; margin-right:4px;" onclick="openViewUnitClassesModal('${u.id}')" title="Visualizar turmas e regentes titulares desta UE">👁️ Ver Turmas</button>
  <button class="btn btn-secondary" style="padding:4px 8px; font-size:11px; margin-right:4px;" onclick="openEditUnitModal('${u.id}')">Editar</button>
  ${canDelete ? `<button class="btn btn-secondary" style="padding:4px 8px; font-size:11px; color:var(--red);" onclick="removeUnit('${u.id}')">Excluir</button>` : ''}
</td>

// DEPOIS
<td><span class="status-badge" style="background:#DCFCE7; color:#166534; font-weight:700; font-size:11px;">${u.polo}</span></td>
<td>${u.address || 'Não informado'}</td>
<td><span class="status-badge" style="background:#EFF6FF; color:#1E40AF;">${teachersCount} Profissionais</span></td>
<td style="text-align:center; white-space:nowrap;">
  <button class="btn btn-secondary" style="padding:4px 8px; font-size:11px; margin-right:4px;" onclick="openViewUnitClassesModal('${u.id}')" title="Visualizar turmas e regentes titulares desta UE"><svg class="btn-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>Ver Turmas</button>
  <button class="btn btn-secondary" style="padding:4px 8px; font-size:11px; margin-right:4px;" onclick="openEditUnitModal('${u.id}')">Editar</button>
  ${canDelete ? `<button class="btn btn-secondary" style="padding:4px 8px; font-size:11px; color:var(--red);" onclick="removeUnit('${u.id}')">Excluir</button>` : ''}
</td>
```

---

### Passo 6: Higienização dos Modais de Visualização e Edição de Polos
Local: `index.html` (L4994) e `js/features/management.js` (L220 e L334).

1. No cabeçalho do `#modalViewUnitClasses` (`index.html` L4994):
```html
<!-- ANTES -->
<span style="font-size:22px;">🏢</span>

<!-- DEPOIS -->
<svg class="btn-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--primary);"><path d="M3 21h18M3 7l9-4 9 4v14M9 21V9h6v12"/></svg>
```

2. No preenchimento dinâmico de `poloEl` em `openViewUnitClassesModal` (`management.js` L220):
```javascript
// ANTES
if (poloEl) poloEl.innerText = `📍 ${unit.polo || 'Polo Regional'}`;

// DEPOIS
if (poloEl) poloEl.innerText = unit.polo || 'Polo Regional';
```

3. Na lista de UEs do `#modalEditPolo` (`management.js` L334):
```javascript
// ANTES
<label for="chkPoloUnit_${u.id}" style="cursor:pointer; color:var(--text-primary); margin:0;">
  🏢 <strong>${u.name}</strong> ${!isBelonging && u.polo ? `<span style="color:var(--text-secondary); font-size:11px;">(${u.polo})</span>` : ''}
</label>

// DEPOIS
<label for="chkPoloUnit_${u.id}" style="cursor:pointer; color:var(--text-primary); margin:0; display:inline-flex; align-items:center; gap:5px;">
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--primary);"><path d="M3 21h18M3 7l9-4 9 4v14M9 21V9h6v12"/></svg>
  <span><strong>${u.name}</strong> ${!isBelonging && u.polo ? `<span style="color:var(--text-secondary); font-size:11px;">(${u.polo})</span>` : ''}</span>
</label>
```

---

### Passo 7: Higienização da Tabela de Equipes & Servidores em `js/features/management.js`
Local: Linhas ~1385 e ~1393 de `js/features/management.js`.
Remover `✉️` do e-mail e `📍` da badge de Polo:

```javascript
// ANTES
const emailSubtitle = (m.roleKey === 'professora')
  ? ''
  : `<br><span style="font-size:11px; color:var(--text-secondary);">${memberEmail ? `✉️ ${memberEmail}` : 'Sem e-mail vinculado'}</span>`;

tr.innerHTML = `
  <td>
    <strong>${m.name}</strong>${emailSubtitle}
  </td>
  <td><span style="font-size:12px; font-weight:700; color:var(--primary);">${m.roleTitle}</span></td>
  <td>${m.school || 'Rede Municipal'}</td>
  <td><span class="status-badge" style="background:#F1F5F9; color:#475569; font-size:11px;">📍 ${poloName}</span></td>

// DEPOIS
const emailSubtitle = (m.roleKey === 'professora')
  ? ''
  : `<br><span style="font-size:11px; color:var(--text-secondary); display:inline-flex; align-items:center; gap:4px;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>${memberEmail ? memberEmail : 'Sem e-mail vinculado'}</span>`;

tr.innerHTML = `
  <td>
    <strong>${m.name}</strong>${emailSubtitle}
  </td>
  <td><span style="font-size:12px; font-weight:700; color:var(--primary);">${m.roleTitle}</span></td>
  <td>${m.school || 'Rede Municipal'}</td>
  <td><span class="status-badge" style="background:#F1F5F9; color:#475569; font-size:11px;">${poloName}</span></td>
```

---

### Passo 8: Higienização dos Demais Modais Conectados à Gestão (`index.html`)
1. **Modal de Turmas (`#modalClassEditor`, L5109 & L5113):**
```html
<!-- ANTES -->
<label class="form-label">☀️ Docentes Regentes - Turno Matutino</label>
...
<label class="form-label">🌤️ Docentes Regentes - Turno Vespertino</label>

<!-- DEPOIS -->
<label class="form-label">Docentes Regentes - Turno Matutino</label>
...
<label class="form-label">Docentes Regentes - Turno Vespertino</label>
```

2. **Modal de Confirmação de Exclusão (`#modalConfirmDelete`, L5274 & L5293):**
```html
<!-- ANTES -->
<span style="font-size:22px;">🗑️</span>
...
<span style="font-size:15px; line-height:1;">⚠️</span>

<!-- DEPOIS -->
<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
...
<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B45309" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
```

3. **Modal de Ciclos & Calendário (`#modalBimesterPeriods`, L5314):**
```html
<!-- ANTES -->
<span>📅</span> Ciclos Avaliativos & Prazos Oficiais (SSOT)

<!-- DEPOIS -->
<svg class="btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--primary);"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
<span>Ciclos Avaliativos & Prazos Oficiais (SSOT)</span>
```

4. **Patrimônio Preservado e Bloqueio Temporal (`#modalCreateAcademicYear` e `js/services/export_backup.js` L604):**
```html
<!-- ANTES -->
<div style="font-size:12px; font-weight:700; color:#166534; margin-bottom:4px;">🛡️ Patrimônio Municipal Preservado</div>

<!-- DEPOIS -->
<div style="font-size:12px; font-weight:700; color:#166534; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  <span>Patrimônio Municipal Preservado</span>
</div>
```
E em `js/services/export_backup.js` (L604):
```javascript
// ANTES
<div style="font-size:12px; font-weight:700; color:#991B1B; margin-bottom:4px;">🛡️ Bloqueio de Conformidade Temporal:</div>

// DEPOIS
<div style="font-size:12px; font-weight:700; color:#991B1B; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  <span>Bloqueio de Conformidade Temporal:</span>
</div>
```

---

### Passo 9: Higienização dos Textos do Menu Drawer Mobile em `js/core/rbac.js`
Local: Linhas 629, 654 e 671 de `js/core/rbac.js`.
Remover emojis prefixados no texto dinâmico `mobMenuOpText`:

```javascript
// ANTES
if (mobMenuOpText) mobMenuOpText.innerText = '🏫 Gestão da Minha Escola';
...
if (mobMenuOpText) mobMenuOpText.innerText = '🗺️ Gestão do Polo Regional';
...
if (mobMenuOpText) mobMenuOpText.innerText = '🏛️ Gestão da Rede Municipal';

// DEPOIS
if (mobMenuOpText) mobMenuOpText.innerText = 'Gestão da Minha Escola';
...
if (mobMenuOpText) mobMenuOpText.innerText = 'Gestão do Polo Regional';
...
if (mobMenuOpText) mobMenuOpText.innerText = 'Gestão da Rede Municipal';
```

---

## 4. Critérios de Aceite e Roteiro de Teste

### 4.1 Critérios de Aceite
1. **Ausência Absoluta de Emojis:** A tela de Gestão Pedagógica (`#homeGestaoView`), suas 4 sub-abas e seus modais não exibem nenhum emoji Unicode colorido residual (`🏫`, `🗺️`, `🏢`, `💾`, `✏️`, `📍`, `👁️`, `✉️`, `☀️`, `🌤️`, `🗑️`, `⚠️`, `📅`, `🛡️`, `🏛️`).
2. **Preservação Funcional das Rotas e Ações:**
   - Troca de sub-abas (`units`, `classes`, `team`, `exports`) continua funcionando perfeitamente;
   - Clique em "Ver Turmas" abre o modal `#modalViewUnitClasses` com dados preenchidos;
   - Edição de polos e UEs mantém 100% de persistência no `appState`;
   - Cadastro e filtragem de servidores mantém funcionamento íntegro;
   - Acesso móvel via drawer drawer preserva o roteamento correto.
3. **Validação Sintática JSC Pré-Voo:** Execução de `python3 audit_platform.py --check-syntax` sem erros léxicos ou sintáticos.
4. **Sincronização Espelhada:** Sincronização exata dos arquivos em `gestor supervisao_patos/firebase_deploy/public/`.

---

## 5. Alterações / Adições / Exclusões no Algoritmo de Auditoria (`audit_platform.py` / `audit_engine.js`)

### 5.1 Adições no Motor de Auditoria (`js/audit/audit_engine.js`)
No **Módulo 12** (`navegacao_layout`) ou **Módulo 11** (`backup_exportacao`), adicionar verificação automatizada determinística:
- Navegar para `opManagement` (`homeGestaoView`).
- Renderizar as sub-telas de Gestão (`renderUnitsScreen()`, `renderTeamScreen()`).
- Executar asserção regex em `#homeGestaoView`:
  ```javascript
  // Validação semiótica de erradicação de emojis na Gestão Pedagógica
  const gestaoEl = document.getElementById('homeGestaoView');
  if (gestaoEl) {
    const rawEmojisRegex = /[🏫🗺🏢💾✏📍👁✉☀️🌤🗑⚠️📅🛡🏛]/;
    const networkCoverage = document.getElementById('networkCoverageCard');
    const unitsDetailed = document.getElementById('unitsDetailedCard');
    const teamCard = document.querySelector('#pedagViewTeam .card');
    
    if (networkCoverage && rawEmojisRegex.test(networkCoverage.innerText)) {
      throw new Error('Matriz de Cobertura da Rede ainda contém emojis residuais');
    }
    if (unitsDetailed && rawEmojisRegex.test(unitsDetailed.innerText)) {
      throw new Error('Tabela de Unidades Escolares ainda contém emojis residuais');
    }
    if (teamCard && rawEmojisRegex.test(teamCard.innerText)) {
      throw new Error('Quadro de Servidores ainda contém emojis residuais');
    }
    logger.log('Erradicação completa de emojis na tela de Gestão Pedagógica e adoção de pictogramas SVG', true);
  }
  ```

### 5.2 Exclusões ou Ajustes de Asserções Pré-existentes
Nenhum teste existente em `audit_platform.py` ou `audit_engine.js` depende da presença de emojis nos botões ou textos da Gestão Pedagógica, garantindo risco zero de regressão nos 12 módulos canônicos.

---

## 6. Checklist de Execução para a Etapa 2 (O Operário)

- [ ] 1. Sincronizar repositório: `git pull origin main`.
- [ ] 2. Aplicar as alterações em `index.html`.
- [ ] 3. Aplicar as alterações em `js/features/management.js`.
- [ ] 4. Aplicar as alterações em `js/core/rbac.js`.
- [ ] 5. Aplicar as alterações em `js/services/export_backup.js`.
- [ ] 6. Adicionar os novos testes no Módulo 12 de `js/audit/audit_engine.js`.
- [ ] 7. Executar a blindagem sintática: `python3 audit_platform.py --check-syntax`.
- [ ] 8. Salvar arquivo de backup sequencial em `intermediárias/aplicativo_v52_remocao_emojis_gestao_pedagogica.html`.
- [ ] 9. Atualizar o Changelog duplo (versão sequencial 1.49 / v8.2.16) em `CHANGELOG.md` e `#modalChangelog` / `.btn-changelog` de `index.html`.
- [ ] 10. Sincronizar cópias em `gestor supervisao_patos/firebase_deploy/public/`.
- [ ] 11. Checagem pré-push (`git fetch origin main`), commit semântico (`fix: remocao de emojis da tela de gestao pedagogica e padronizacao svg`) e deploy (`git push origin main`).
- [ ] 12. Executar a auditoria headless pós-deploy: `python3 audit_platform.py --silent-on-success`.
