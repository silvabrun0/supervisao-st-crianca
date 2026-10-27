# Plano de Implementação: Governança de Polos pelo Núcleo de EI, Supressão da Tela de Turmas da Rede e Acesso Somente Leitura às Turmas por UE

> **Diretriz de Execução (Obrigatório):**  
> O assistente executor da **Etapa 2 (Operário)** DEVE OBRIGATORIAMENTE ler e seguir integralmente as diretrizes do arquivo [WORKFLOW_MACOS.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md), do [WORKFLOW_GITHUB.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_GITHUB.md) e a skill `.agents/skills/execucao-operario/SKILL.md` antes de aplicar quaisquer modificações no código-fonte.  
> A execução deve ser estrita, cirúrgica, atenta à dupla checagem, versionamento sequencial duplo (`CHANGELOG.md` e `#modalChangelog`), criação de cópia intermediária em `intermediárias/` e execução do algoritmo de auditoria modular pós-deploy (`python3 audit_platform.py --silent-on-success`).

---

> **Status:** 📐 Planejamento Concluído (Etapa 1 - Arquiteto)  
> **Data:** 27/10/2026  
> **Versão Alvo:** `1.43` (`v8.2.10`)  
> **Arquivo de Backup Intermediário:** `intermediárias/aplicativo_v143_gestao_polos_e_visualizacao_turmas_ue_nucleo_ei.html`  
> **Arquivos Principais Afetados:**  
> - `index.html` (raiz da aplicação)  
> - `firebase_deploy/public/index.html` (cópia espelho de deploy)  
> - `CHANGELOG.md` (registro histórico unificado)  
> - `audit_platform.py` (motor automatizado de auditoria)  

---

## 1. Diagnóstico do Problema e Contexto Pedagógico / RBAC

### 1.1 Contexto e Justificativa Pedagógica
Na arquitetura do ecossistema pedagógico **SerTão Criança**, a governança da Educação Infantil segue o princípio de descentralização e autonomia escolar com inteligência de rede:
1. **Coordenação Pedagógica da Unidade Escolar (CP da UE - `roleKey: 'coordenador'`):** É a autoridade pedagógica e administrativa imediata no chão da escola. É de sua competência exclusiva conhecer a dinâmica local, definir as turmas, enturmar as professoras regentes titulares nos turnos matutino e vespertino (ou em tempo integral compartilhado), acompanhar o quantitativo de crianças matriculadas e o público-alvo da educação especial (AEE).
2. **Coordenadora do Núcleo de Educação Infantil (Secretaria Municipal de Educação - `roleKey: 'nucleo_ei'`):** Atua no nível macroestratégico, normativo e territorial. Sua responsabilidade de gestão operacional centra-se nos **Polos Regionais** (distribuição territorial da rede, lotação de formadoras responsáveis por polo, vinculação e cobertura de UEs nos polos), gestão de ciclos avaliativos e diretrizes curriculares.

### 1.2 O Problema Identificado
- **Inconsistência de Papéis e Violação de Autonomia:**  
  Atualmente, ao acessar a Gestão da Rede (`homeGestaoView`), a Coordenadora do Núcleo de EI tem visível a sub-aba *"Turmas da Rede Municipal"* (`#pedagTabClasses`). Nessa tela, a Coordenadora do Núcleo tem acesso aos botões de criar novas turmas (`+ Cadastrar Nova Turma`), editar e excluir turmas de qualquer uma das 32 unidades escolares.
- **Risco de Conflitos e Ruptura da Realidade Escolar:**  
  Não há justificativa pedagógica nem técnica para que a Coordenadora do Núcleo de EI interfira na composição das turmas de uma escola individual. A intervenção centralizada pode gerar conflitos de enturmação, duplicidade com o Censo Escolar e desrespeitar o planejamento pedagógico feito pela Coordenação Pedagógica da escola.
- **A Demanda do Usuário:**  
  - A coordenadora do Núcleo de EI **NÃO deve ser capaz de editar turmas das UEs**, mas sim **somente os polos**.
  - **Retirar a tela de turmas da rede municipal** do escopo do Núcleo de EI.
  - A coordenadora do Núcleo de EI **deve ter acesso às turmas quando apertar na unidade escolar**, porém **somente visualizará** os professores atribuídos e as turmas da referida unidade em modo de consulta (somente leitura).
  - Todos os dados continuam **100% conectados à SSOT (Single Source of Truth)** em tempo real (`appState.classes`, `appState.teamMembers`, `getClassesForSchool`), sem que haja permissão ou necessidade de alteração por parte dela.

---

## 2. Arquitetura da Solução e Pontos de Impacto

```mermaid
flowchart TD
    A["Coordenadora do Núcleo de EI (isNucleoEI / Helena Martins)"] --> B["Gestão da Rede Municipal (homeGestaoView)"]
    
    B --> C["1. Sub-aba 'Turmas da Rede Municipal' (#pedagTabClasses)"]
    C -->|applyUserRoleUI| C1["⛔ Ocultada estritamente (display: none)"]
    C -->|switchPedagSubTab('classes')| C2["🛡️ Redirecionamento defensivo para 'units'"]

    B --> D["2. Matriz de Polos Regionais (#networkCoverageCard)"]
    D -->|Permissão Total Mantida| D1["✅ Cadastrar Novo Polo (#btnAddPoloMain)"]
    D -->|Permissão Total Mantida| D2["✅ Editar Polo e UEs Vinculadas (#modalEditPolo)"]
    D -->|Permissão Total Mantida| D3["✅ Excluir Polo sem UEs (removePolo)"]

    B --> E["3. Unidades Escolares Cadastradas (#unitsDetailedCard) e Matriz de Polos"]
    E -->|Aperta na Unidade Escolar| F["🏢 Disparo de openViewUnitClassesModal(unitId)"]
    
    F --> G["Modal de Detalhes da UE: #modalViewUnitClasses"]
    G --> G1["📋 Metadados da UE: Nome, Polo, Endereço e CP Titular"]
    G --> G2["📊 KPIs Rápidos: Total de Turmas, Docentes e Alunos"]
    G --> G3["📑 Tabela Reativa SSOT: Turmas & Docentes Atribuídos"]
    G --> G4["🔒 Modo Somente Leitura Absoluto (Sem botões de Adicionar/Editar/Excluir)"]
    G --> G5["🔄 Dados 100% Sincronizados com a SSOT via getClassesForSchool()"]

    A --> H["4. Blindagem em Ações de Turmas"]
    H -->|openAddClassModal / openEditClassModal / deleteClass / saveClassEditor| H1["⛔ Bloqueio com Toast Educativo: Gestão exclusiva da CP da UE"]
```

### 2.1 Mapeamento dos Componentes Afetados
1. **Menu de Sub-abas da Gestão Operacional (`#pedagTabClasses`):**
   - Em `applyUserRoleUI()`, quando `isNucleoEI(user)` for verdadeiro, ocultar estritamente o botão da aba: `pedagTabClasses.style.display = 'none'`.
   - Para outros perfis (`coordenador` e `formador`), garantir que a visibilidade permaneça ativa (`style.display = 'inline-flex'`).
2. **Desvio Defensivo de Navegação (`switchPedagSubTab`):**
   - Se `isNucleoEI(user) && tabName === 'classes'`, desviar automaticamente para `'units'`, impedindo abertura da sub-view órfã.
3. **Travas RBAC no Ciclo de Vida de Turmas:**
   - Em `openAddClassModal()`, `openEditClassModal(classId)`, `deleteClass(classId)` e `saveClassEditor()`, incluir barreira explícita bloqueando chamadas de `isNucleoEI(user)` com toast explicativo sobre a descentralização na Coordenação Pedagógica da escola.
4. **Novo Modal Especializado de Consulta: `#modalViewUnitClasses`:**
   - Inserido no DOM de `index.html`.
   - Apresenta cabeçalho da Unidade Escolar (nome, polo vinculado, endereço e coordenadora responsável).
   - Renderiza a lista completa de turmas da unidade obtida diretamente da SSOT via `getClassesForSchool(unit.name)`.
   - Para cada turma, apresenta: nome da turma, etapa da Educação Infantil, jornada (Tempo Parcial vs Tempo Integral), turno de funcionamento e docentes titulares atribuídos (com discriminação clara de Manhã e Tarde em turmas integrais).
   - Ausência absoluta de campos de edição ou botões mutatórios, com badge e rodapé de sobriedade institucional confirmando o modo de consulta SSOT.
5. **Gatilhos de Interação ("Apertar na Unidade"):**
   - **Tabela Detalhada de Unidades (`unitsTableBody`):**
     - O nome da escola (`u.name`) torna-se clicável com estilo semântico (`cursor:pointer`, cor de destaque primária e sublinhado sutil ao passar o mouse).
     - Na coluna de Ações, inclusão de botão visual com pictograma vetorial/ícone: `<button class="btn btn-secondary" onclick="openViewUnitClassesModal('${u.id}')">👁️ Ver Turmas</button>`.
   - **Matriz de Distribuição e Cobertura por Polo Regional (`networkCoverageTableBody`):**
     - Cada unidade listada no polo (`unitsInPolo.map(...)`) ganha evento de clique para acionar diretamente `openViewUnitClassesModal('${u.id}')`.

---

## 3. Especificação de Implementação Passo a Passo (Snippets Exatos)

### Passo 1: Inserção do Modal `#modalViewUnitClasses` no HTML (`index.html`)
Localizar a seção de modais estruturais (logo após `#modalEditUnit`, antes de `#modalClassEditor`, por volta da linha 8344) e inserir o modal de consulta:

```html
  <!-- ================= MODAL: VISUALIZAR TURMAS & DOCENTES DA UE (NÚCLEO DE EI - SOMENTE LEITURA) ================= -->
  <div id="modalViewUnitClasses" class="modal-backdrop" onclick="closeViewUnitClassesModal()">
    <div class="modal-panel" onclick="event.stopPropagation()" style="max-width:750px; max-height:90vh; display:flex; flex-direction:column;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px; border-bottom:1px solid var(--border); padding-bottom:12px;">
        <div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:22px;">🏢</span>
            <h3 style="font-size:17px; font-weight:800; color:var(--primary-dark); margin:0;" id="viewUnitModalTitle">Unidade Escolar</h3>
          </div>
          <div style="display:flex; gap:8px; align-items:center; margin-top:6px; flex-wrap:wrap;">
            <span class="status-badge" style="background:#DCFCE7; color:#166534; font-weight:700; font-size:11px;" id="viewUnitModalPolo">Polo Regional</span>
            <span style="font-size:12px; color:var(--text-secondary);" id="viewUnitModalAddress">Endereço da Unidade</span>
          </div>
        </div>
        <button class="btn btn-secondary" style="padding:6px 10px;" onclick="closeViewUnitClassesModal()">✕</button>
      </div>

      <!-- Resumo Rápido da Unidade Escolar -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(160px, 1fr)); gap:10px; margin-bottom:16px;">
        <div style="background:#F8FAFC; border:1px solid var(--border); border-radius:8px; padding:10px;">
          <div style="font-size:10px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Coordenação da UE</div>
          <div style="font-size:12px; font-weight:700; color:var(--text-primary); margin-top:4px;" id="viewUnitModalCoord">A definir</div>
        </div>
        <div style="background:#F8FAFC; border:1px solid var(--border); border-radius:8px; padding:10px;">
          <div style="font-size:10px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Turmas em Atividade</div>
          <div style="font-size:15px; font-weight:800; color:#6D28D9; margin-top:2px;" id="viewUnitModalClassesCount">0</div>
        </div>
        <div style="background:#F8FAFC; border:1px solid var(--border); border-radius:8px; padding:10px;">
          <div style="font-size:10px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Docentes Lotação</div>
          <div style="font-size:15px; font-weight:800; color:#1E40AF; margin-top:2px;" id="viewUnitModalTeachersCount">0</div>
        </div>
        <div style="background:#F8FAFC; border:1px solid var(--border); border-radius:8px; padding:10px;">
          <div style="font-size:10px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Alunos / Inclusão</div>
          <div style="font-size:13px; font-weight:700; color:#059669; margin-top:3px;" id="viewUnitModalStudents">120 (5 AEE)</div>
        </div>
      </div>

      <!-- Container Rolável das Turmas e Docentes Atribuídos -->
      <div style="flex:1; overflow-y:auto; margin-bottom:14px; border:1px solid var(--border); border-radius:8px; background:#FFFFFF;">
        <table class="data-table" style="margin:0;">
          <thead>
            <tr>
              <th>Turma & Etapa</th>
              <th>Jornada Escolar</th>
              <th>Turno</th>
              <th>Professores Regentes Atribuídos</th>
            </tr>
          </thead>
          <tbody id="viewUnitClassesTableBody">
            <!-- Populado dinamicamente via openViewUnitClassesModal -->
          </tbody>
        </table>
      </div>

      <!-- Rodapé com Badge de Governança Institucional e Botão de Fechar -->
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; border-top:1px solid var(--border); padding-top:12px;">
        <div style="font-size:11px; color:var(--text-secondary); max-width:540px; line-height:1.4;">
          🔒 <strong>Modo de Consulta SSOT:</strong> Visualização centralizada de turmas e regências conectadas em tempo real. A enturmação e gestão de turmas são de autonomia exclusiva da Coordenação Pedagógica da escola.
        </div>
        <button class="btn btn-secondary" onclick="closeViewUnitClassesModal()">Fechar Visualização</button>
      </div>
    </div>
  </div>
```

---

### Passo 2: Ocultação da Sub-aba no Perfil do Núcleo de EI em `applyUserRoleUI()` (`index.html`)
Na função `applyUserRoleUI()` (por volta da linha 10787), atualizar a seção de `isNucleoEI(user)` para ocultar `#pedagTabClasses`:

```javascript
// ANTES
      } else if (isNucleoEI(user)) {
        if (opNavTab) opNavTab.style.display = 'none';
        if (homeOpCard) homeOpCard.style.display = 'none';
        if (mobMenuOpBtn) {
          mobMenuOpBtn.style.display = 'flex';
          if (mobMenuOpText) mobMenuOpText.innerText = '🏛️ Gestão da Rede Municipal';
        }
        if (pedagUnitsLabel) pedagUnitsLabel.innerText = 'Unidades Escolares & Polos';
        if (pedagClassesLabel) pedagClassesLabel.innerText = 'Turmas da Rede Municipal';
        if (pedagTeamLabel) pedagTeamLabel.innerText = 'Equipes & Servidores da Rede';
        if (pedagExportsTab) pedagExportsTab.style.display = 'block';
        if (homeGestaoActionsCentral) homeGestaoActionsCentral.style.display = 'flex';
        if (homeGestaoTitle) homeGestaoTitle.innerText = 'Gestão da Rede';
        if (homeGestaoSubtitle) {
          homeGestaoSubtitle.innerText = '';
          homeGestaoSubtitle.style.display = 'none';
        }
      }

// DEPOIS
      } else if (isNucleoEI(user)) {
        if (opNavTab) opNavTab.style.display = 'none';
        if (homeOpCard) homeOpCard.style.display = 'none';
        if (mobMenuOpBtn) {
          mobMenuOpBtn.style.display = 'flex';
          if (mobMenuOpText) mobMenuOpText.innerText = '🏛️ Gestão da Rede Municipal';
        }
        if (pedagUnitsLabel) pedagUnitsLabel.innerText = 'Unidades Escolares & Polos';
        // A Coordenadora do Núcleo de EI gerencia somente os polos; a tela de turmas da rede é retirada
        const pedagTabClassesEl = document.getElementById('pedagTabClasses');
        if (pedagTabClassesEl) pedagTabClassesEl.style.display = 'none';
        if (pedagClassesLabel) pedagClassesLabel.innerText = '';
        if (pedagTeamLabel) pedagTeamLabel.innerText = 'Equipes & Servidores da Rede';
        if (pedagExportsTab) pedagExportsTab.style.display = 'block';
        if (homeGestaoActionsCentral) homeGestaoActionsCentral.style.display = 'flex';
        if (homeGestaoTitle) homeGestaoTitle.innerText = 'Gestão da Rede';
        if (homeGestaoSubtitle) {
          homeGestaoSubtitle.innerText = '';
          homeGestaoSubtitle.style.display = 'none';
        }
      }
```

E assegurar que para `coordenador` e `formador` o botão `#pedagTabClasses` volte a ter exibição ativa:
```javascript
      // No bloco de coordenador:
      const pedagTabClassesEl = document.getElementById('pedagTabClasses');
      if (pedagTabClassesEl) pedagTabClassesEl.style.display = 'inline-flex';

      // No bloco de formador:
      if (pedagTabClassesEl) pedagTabClassesEl.style.display = 'inline-flex';
```

---

### Passo 3: Proteção Defensiva em `switchPedagSubTab` e `navigateToTab` (`index.html`)
Na função `switchPedagSubTab(tabName)` (por volta da linha 14752):

```javascript
// ANTES
    function switchPedagSubTab(tabName) {
      // Se for referenciada sub-aba legada 'rubrics', direciona para 'units'
      if (tabName === 'rubrics') tabName = 'units';
      appState.currentPedagSubTab = tabName;

// DEPOIS
    function switchPedagSubTab(tabName) {
      const user = getCurrentUser();
      // Se for referenciada sub-aba legada 'rubrics', direciona para 'units'
      if (tabName === 'rubrics') tabName = 'units';
      // Núcleo de EI não possui a tela de turmas da rede municipal: direciona suavemente para 'units'
      if (isNucleoEI(user) && tabName === 'classes') {
        tabName = 'units';
      }
      appState.currentPedagSubTab = tabName;
```

---

### Passo 4: Implementação das Funções do Modal de Consulta da UE (`index.html`)
Inserir as funções controladoras de abertura e fechamento do modal `#modalViewUnitClasses`:

```javascript
    // --- VISUALIZAÇÃO DE TURMAS E DOCENTES DA UE (SOMENTE LEITURA SSOT) ---
    function openViewUnitClassesModal(unitId) {
      const unit = (appState.units || []).find(u => u.id === unitId || u.name === unitId);
      if (!unit) {
        showToast('Unidade Escolar não localizada.');
        return;
      }

      // Preenchimento de Metadados
      const titleEl = document.getElementById('viewUnitModalTitle');
      const poloEl = document.getElementById('viewUnitModalPolo');
      const addrEl = document.getElementById('viewUnitModalAddress');
      const coordEl = document.getElementById('viewUnitModalCoord');
      const classesCountEl = document.getElementById('viewUnitModalClassesCount');
      const teachersCountEl = document.getElementById('viewUnitModalTeachersCount');
      const studentsEl = document.getElementById('viewUnitModalStudents');

      if (titleEl) titleEl.innerText = unit.name;
      if (poloEl) poloEl.innerText = `📍 ${unit.polo || 'Polo Regional'}`;
      if (addrEl) addrEl.innerText = unit.address || 'Endereço não informado';

      const cp = (appState.teamMembers || []).find(m => m.roleKey === 'coordenador' && m.school === unit.name);
      if (coordEl) coordEl.innerText = cp ? cp.name : 'A definir / Sem CP';

      const unitClasses = getClassesForSchool(unit.name);
      const unitTeachers = (appState.teamMembers || []).filter(m => m.school === unit.name && m.roleKey === 'professora');

      if (classesCountEl) classesCountEl.innerText = `${unitClasses.length} turma(s)`;
      if (teachersCountEl) teachersCountEl.innerText = `${unitTeachers.length} docente(s)`;
      if (studentsEl) {
        const tot = unit.totalStudents !== undefined ? unit.totalStudents : 120;
        const inc = unit.inclusiveStudents !== undefined ? unit.inclusiveStudents : 5;
        studentsEl.innerText = `${tot} (${inc} AEE)`;
      }

      // Renderização da Tabela de Turmas & Docentes Atribuídos
      const tbody = document.getElementById('viewUnitClassesTableBody');
      if (tbody) {
        tbody.innerHTML = '';

        if (unitClasses.length === 0) {
          tbody.innerHTML = `
            <tr>
              <td colspan="4" style="text-align:center; padding:24px; color:var(--text-secondary); font-style:italic;">
                Nenhuma turma cadastrada no momento pela Coordenação Pedagógica desta Unidade Escolar.
              </td>
            </tr>
          `;
        } else {
          unitClasses.forEach(cls => {
            const isIntegral = (cls.shift || '').toLowerCase().includes('integral');
            const jornadaBadge = isIntegral 
              ? `<span class="status-badge" style="background:#EDE9FE; color:#6D28D9; font-weight:700;">Tempo Integral</span>`
              : `<span class="status-badge" style="background:#EFF6FF; color:#1E40AF; font-weight:700;">Tempo Parcial</span>`;

            let turnoBadge = `<span class="status-badge" style="background:#FEF3C7; color:#92400E; font-size:11px;">${cls.shift || 'Parcial'}</span>`;
            if (isIntegral) {
              turnoBadge = `<span class="status-badge" style="background:#DCFCE7; color:#166534; font-size:11px;">Manhã + Tarde</span>`;
            }

            let teachersDisplay = '';
            if (isIntegral && (cls.teachersMorning || cls.teachersAfternoon)) {
              const mList = (Array.isArray(cls.teachersMorning) && cls.teachersMorning.length > 0) ? cls.teachersMorning.join(', ') : 'A definir';
              const aList = (Array.isArray(cls.teachersAfternoon) && cls.teachersAfternoon.length > 0) ? cls.teachersAfternoon.join(', ') : 'A definir';
              teachersDisplay = `
                <div style="font-size:11px; line-height:1.4;">
                  <div><strong style="color:#B45309;">Manhã:</strong> ${mList}</div>
                  <div><strong style="color:#4338CA;">Tarde:</strong> ${aList}</div>
                </div>
              `;
            } else {
              const tList = (Array.isArray(cls.teachers) && cls.teachers.length > 0) ? cls.teachers.join(', ') : '<span style="color:var(--text-secondary); font-style:italic;">Aguardando atribuição de regente</span>';
              teachersDisplay = `<div style="font-size:12px; font-weight:600; color:#1E293B;">${tList}</div>`;
            }

            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>
                <strong style="color:var(--primary-dark); font-size:13px;">${cls.name}</strong><br>
                <span class="status-badge" style="background:#F1F5F9; color:#475569; font-size:10px;">${cls.stage || 'Educação Infantil'}</span>
              </td>
              <td>${jornadaBadge}</td>
              <td>${turnoBadge}</td>
              <td>${teachersDisplay}</td>
            `;
            tbody.appendChild(tr);
          });
        }
      }

      document.getElementById('modalViewUnitClasses').classList.add('active');
    }

    function closeViewUnitClassesModal() {
      const modal = document.getElementById('modalViewUnitClasses');
      if (modal) modal.classList.remove('active');
    }
```

---

### Passo 5: Atualização das Tabelas para Tornar a UE Clicável e com Botão de Visualização (`index.html`)
Na função `renderUnitsScreen()`:

1. **Na Matriz de Distribuição e Cobertura por Polo Regional (`networkCoverageTableBody`, por volta da linha 16893):**
```javascript
// ANTES
            <td>
              ${unitsInPolo.map(u => `<div>🏢 ${u.name}</div>`).join('') || '<span style="color:var(--text-secondary); font-style:italic;">Nenhuma UE alocada</span>'}
            </td>

// DEPOIS
            <td>
              ${unitsInPolo.map(u => `
                <div style="cursor:pointer; color:var(--primary); font-weight:600; margin-bottom:3px; display:inline-block;" onclick="openViewUnitClassesModal('${u.id}')" title="Clique para visualizar turmas e docentes atribuídos em ${u.name}">
                  🏢 ${u.name}
                </div>
              `).join('<br>') || '<span style="color:var(--text-secondary); font-style:italic;">Nenhuma UE alocada</span>'}
            </td>
```

2. **Na Tabela Detalhada de Unidades Escolares Cadastradas (`unitsTableBody`, por volta da linha 16952):**
```javascript
// ANTES
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${u.name}</strong></td>
          <td><span class="status-badge" style="background:#DCFCE7; color:#166534; font-weight:700; font-size:11px;">📍 ${u.polo}</span></td>
          <td>${u.address || 'Não informado'}</td>
          <td><span class="status-badge" style="background:#EFF6FF; color:#1E40AF;">${teachersCount} Profissionais</span></td>
          <td style="text-align:center; white-space:nowrap;">
            <button class="btn btn-secondary" style="padding:4px 8px; font-size:11px; margin-right:4px;" onclick="openEditUnitModal('${u.id}')">Editar</button>
            ${canDelete ? `<button class="btn btn-secondary" style="padding:4px 8px; font-size:11px; color:var(--red);" onclick="removeUnit('${u.id}')">Excluir</button>` : ''}
          </td>
        `;

// DEPOIS
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>
            <span style="cursor:pointer; color:var(--primary); font-weight:700;" onclick="openViewUnitClassesModal('${u.id}')" title="Clique para visualizar turmas e docentes atribuídos">
              ${u.name}
            </span>
          </td>
          <td><span class="status-badge" style="background:#DCFCE7; color:#166534; font-weight:700; font-size:11px;">📍 ${u.polo}</span></td>
          <td>${u.address || 'Não informado'}</td>
          <td><span class="status-badge" style="background:#EFF6FF; color:#1E40AF;">${teachersCount} Profissionais</span></td>
          <td style="text-align:center; white-space:nowrap;">
            <button class="btn btn-secondary" style="padding:4px 8px; font-size:11px; margin-right:4px;" onclick="openViewUnitClassesModal('${u.id}')" title="Visualizar turmas e regentes titulares desta UE">👁️ Ver Turmas</button>
            <button class="btn btn-secondary" style="padding:4px 8px; font-size:11px; margin-right:4px;" onclick="openEditUnitModal('${u.id}')">Editar</button>
            ${canDelete ? `<button class="btn btn-secondary" style="padding:4px 8px; font-size:11px; color:var(--red);" onclick="removeUnit('${u.id}')">Excluir</button>` : ''}
          </td>
        `;
```

---

### Passo 6: Travas RBAC em Ações de Turmas contra Modificação pelo Núcleo de EI (`index.html`)

1. **Em `openAddClassModal()` (linha 17632):**
```javascript
    function openAddClassModal() {
      const user = getCurrentUser();
      if (isNucleoEI(user)) {
        showToast('Acesso restrito: A coordenadora do Núcleo de EI não gerencia turmas de UEs diretamente. A gestão de turmas é descentralizada na Coordenadora Pedagógica da unidade.');
        return;
      }
      ...
```

2. **Em `openEditClassModal(classId)` (linha 17652):**
```javascript
    function openEditClassModal(classId) {
      const user = getCurrentUser();
      if (isNucleoEI(user)) {
        showToast('Acesso restrito: A coordenadora do Núcleo de EI não gerencia turmas de UEs diretamente. A gestão de turmas é descentralizada na Coordenadora Pedagógica da unidade.');
        return;
      }
      ...
```

3. **Em `saveClassEditor()` (linha 17793):**
```javascript
    function saveClassEditor() {
      const user = getCurrentUser();
      if (isNucleoEI(user)) {
        showToast('Acesso restrito: Apenas a Coordenadora Pedagógica da Unidade Escolar pode cadastrar ou alterar turmas.');
        return;
      }
      ...
```

4. **Em `deleteClass(classId)` (linha 17906):**
```javascript
    function deleteClass(classId) {
      const user = getCurrentUser();
      if (isNucleoEI(user)) {
        showToast('Acesso restrito: Apenas a Coordenadora Pedagógica da Unidade Escolar pode excluir turmas.');
        return;
      }
      ...
```

---

### Passo 7: Atualização do Changelog Duplo e Versão para 1.43 (v8.2.10)
1. **No cabeçalho de `index.html`:**
   - Atualizar o botão `.btn-changelog`: `<span>Versão 1.43 (v8.2.10)</span>`.
2. **No `#modalChangelog` de `index.html`:**
   - Adicionar o card da versão `1.43` detalhando a governança de polos pelo Núcleo de EI, remoção da tela de turmas da rede e consulta somente leitura via clique na unidade.
3. **No `CHANGELOG.md`:**
   - Inserir a nova versão `1.43` com tabela sumária e detalhes executivos.

---

## 4. Critérios de Aceite e Roteiro de Teste

- [ ] **Critério 1 (Ocultação da Aba para o Núcleo de EI):** Ao selecionar o perfil da Coordenadora do Núcleo de EI (`helena`, `bruno` ou `rodrigo`), na tela de Gestão da Rede, a sub-aba *"Turmas da Rede Municipal"* (`#pedagTabClasses`) **NÃO** deve estar visível (`display === 'none'`).
- [ ] **Critério 2 (Desvio de Navegação):** Se for acionado `switchPedagSubTab('classes')` enquanto logado como Núcleo de EI, a visualização deve permanecer ou retornar suavemente para `'units'`.
- [ ] **Critério 3 (Preservação da Aba para Coordenadoras):** Ao selecionar o perfil de Coordenadora Pedagógica (`mariana`), a sub-aba *"Turmas & Regência"* (`#pedagTabClasses`) deve estar visível e funcional para gerenciar as turmas de sua escola.
- [ ] **Critério 4 (Governança Restrita a Polos pelo Núcleo de EI):** O Núcleo de EI mantém acesso e controle sobre os Polos Regionais (cadastro de novos polos, edição de polos e vinculação territorial de UEs). Se o Núcleo de EI tentar disparar `openAddClassModal()`, `openEditClassModal()`, `saveClassEditor()` ou `deleteClass()`, uma mensagem de bloqueio por toast deve ser emitida e nenhuma alteração em turmas deve ocorrer.
- [ ] **Critério 5 (Acesso às Turmas ao Clicar na Unidade):** Na tela de Gestão da Rede, ao clicar no nome de uma Unidade Escolar ou no botão *"👁️ Ver Turmas"*, abre-se o modal `#modalViewUnitClasses`.
- [ ] **Critério 6 (Fidelidade SSOT e Ausência de Ações de Edição):** O modal exibe com precisão as turmas e professoras regentes da UE selecionada (inclusive divisão Manhã/Tarde para turmas integrais), conectadas 100% à SSOT via `getClassesForSchool(unit.name)`. O modal não possui botões de cadastrar, editar ou excluir turmas.
- [ ] **Critério 7 (Fechamento Limpo):** O modal fecha perfeitamente ao clicar no botão "✕" ou "Fechar Visualização".

---

## 5. Seção Obrigatória de Auditoria: Mapeamento de Alterações em `audit_platform.py` e Testes In-App

### 5.1 Alterações no Módulo de Testes In-App (`catalogo_dados` / `auth_rbac` em `index.html`)
Adicionar testes determinísticos no Módulo 2 (`catalogo_dados`) validando:
1. **Asserção de Ocultação de `#pedagTabClasses` para Helena:**  
   Confirmar que `document.getElementById('pedagTabClasses').style.display === 'none'` quando o usuário for Helena Martins (`nucleo_ei`).
2. **Asserção de Bloqueio RBAC em `openAddClassModal` e `openEditClassModal`:**  
   Garantir que a tentativa de chamada por Helena emite bloqueio sem ativar `#modalClassEditor`.
3. **Asserção Positiva de Abertura do Modal `#modalViewUnitClasses`:**  
   Disparar `openViewUnitClassesModal('unit-01')` (ou ID correspondente de "CEI Professora Maria de Lourdes"), validar que o modal recebe a classe `active`, validar que a tabela de turmas possui as linhas renderizadas das turmas da escola com seus respectivos professores atribuídos, e validar que não há botões de edição de turmas dentro do modal.
4. **Asserção de Fechamento do Modal:**  
   Disparar `closeViewUnitClassesModal()` e verificar remoção da classe `active`.
5. **Asserção de Visibilidade Restaurada para Mariana:**  
   Ao alternar para Mariana (`coordenador`), validar que `#pedagTabClasses.style.display !== 'none'`.

### 5.2 Validação Sintática Pré-Voo e Execução da Auditoria Modular
- **Checagem de Sintaxe Obrigatória:**  
  ```bash
  python3 audit_platform.py --check-syntax
  ```
  *(Deve retornar 100% de sucesso sem warnings léxicos ou sintáticos).*
- **Auditoria Modular Pós-Deploy:**  
  ```bash
  python3 audit_platform.py --silent-on-success
  ```
  *(Deve validar todos os 12 módulos com aprovação total sem quebra de regressão).*
