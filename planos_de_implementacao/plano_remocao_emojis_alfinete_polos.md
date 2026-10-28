# Plano de Implementação: Remoção dos Emojis 📍 de Junto dos Polos e Higienização Visual Institucional

---

## 0. Diretriz de Execução (Obrigatória para o Operário - Etapa 2)

> [!IMPORTANT]
> **Leitura Prévia Obrigatória:** Antes de executar qualquer ação deste plano, o assistente na **Etapa 2 (O Operário)** DEVE consultar e seguir rigorosamente:
> 1. [WORKFLOW_MACOS.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md)
> 2. [WORKFLOW_GITHUB.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_GITHUB.md)
> 3. [.agents/skills/execucao-operario/SKILL.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/.agents/skills/execucao-operario/SKILL.md)
> 4. [.agents/skills/auditoria-plataforma/SKILL.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/.agents/skills/auditoria-plataforma/SKILL.md)
>
> **Trava de Fidelidade e Estabilidade:** Este plano contempla estritamente a erradicação dos emojis `📍` (alfinete de mapa) exibidos junto aos nomes dos Polos Regionais nas tabelas e modais da plataforma.
> Nenhuma regra de governança territorial (SSOT), associação entre Unidades Escolares e Polos, permissões de formadoras e coordenadoras ou filtros reativos deve ser alterada.

---

## 1. Diagnóstico e Contexto

### 1.1 Contexto Institucional e Visual
Na governança da Educação Infantil da rede municipal de Patos/PB (*SerTão Criança*), o conceito de **Polo Regional** organiza territorialmente as Unidades Escolares (UEs), as Coordenadoras Pedagógicas e as Formadoras responsáveis pelo acompanhamento pedagógico.

Atualmente, resquícios do emoji de alfinete vermelho/colorido (`📍`) são concatenados aos nomes dos polos dentro de badges de status (`.status-badge`), especificamente:
1. **Tabela de Unidades Escolares Cadastradas (`#unitsTableBody`):** Na coluna "Polo Regional Vinculado", cada unidade exibe um badge verde contendo `📍 [Nome do Polo]`.
2. **Modal de Visualização de Turmas e Regências da UE (`#viewUnitModalPolo`):** No cabeçalho de caracterização da UE acessado ao clicar em uma escola, o badge exibe `📍 [Nome do Polo]`.
3. **Tabela do Quadro de Equipes & Servidores (`#teamTableBody`):** Na coluna "Polo Vinculado", cada servidor exibe um badge cinza contendo `📍 [Nome do Polo]`.

### 1.2 Por que a remoção é mandatória
1. **Desalinhamento Estético e "Coisa Tosca":** Emojis de sistema operacional (Unicode) variam grotescamente de aparência dependendo da plataforma (macOS, Windows, Android, Linux). O alfinete 3D colorido quebra o padrão visual sóbrio e profissional de um software de gestão pública municipal.
2. **Conformidade com a Diretriz Hallmark Standard do Projeto:** A diretriz global estabelece: *"Never use emojis as iconography; use proper SVGs or icon sets"*. O uso de emojis dentro de pílulas de dados textuais compromete a tipografia institucional.
3. **Harmonização com a Erradicação de Emojis Iniciada na Versão 1.50:** A plataforma já substituiu cabeçalhos e botões por pictogramas vetoriais SVG monocromáticos padronizados (*Feather / Lucide*). A remoção nos badges dos polos conclui a higienização da camada de governança da rede.

### 1.3 Mapeamento Detalhado dos Locais Afetados
Após varredura completa no repositório, foram identificados exatamente os pontos de injeção dinâmica do emoji `📍` nos polos:

| # | Arquivo | Linha Aprox. | Função / Escopo | Trecho Atual |
|---|---------|--------------|-----------------|--------------|
| **1** | `js/features/management.js` | L189 | `renderUnitsScreen()` | `<td><span class="status-badge" style="background:#DCFCE7; color:#166534; font-weight:700; font-size:11px;">📍 ${u.polo}</span></td>` |
| **2** | `js/features/management.js` | L220 | `openViewUnitClassesModal()` | `if (poloEl) poloEl.innerText = \`📍 ${unit.polo \|\| 'Polo Regional'}\`;` |
| **3** | `js/features/management.js` | L1406 | `renderTeamScreen()` | `<td><span class="status-badge" style="background:#F1F5F9; color:#475569; font-size:11px;">📍 ${poloName}</span></td>` |

*(Nota de Contexto: O badge `#viewUnitModalPolo` no arquivo estático `index.html` [L5061] já é limpo com o texto `Polo Regional`. O emoji `📍` vinha sendo adicionado puramente via injeção JavaScript em `management.js:220`)*.

---

## 2. Arquitetura e Pontos de Impacto

### 2.1 Arquivos Afetados
1. [js/features/management.js](file:///Users/bruno/Desktop/gestor%20supervisao_patos/js/features/management.js) — Módulo central de gestão de polos, unidades e equipes da rede.
2. [js/audit/audit_engine.js](file:///Users/bruno/Desktop/gestor%20supervisao_patos/js/audit/audit_engine.js) — Módulo de testes (Módulo 12 e Módulo 14) com asserções estritas de ausência de emojis nos badges de polo.
3. [index.html](file:///Users/bruno/Desktop/gestor%20supervisao_patos/index.html) — Atualização do número de versão no botão `.btn-changelog` e registro do card no `#modalChangelog` (Versão 1.52).
4. [CHANGELOG.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/CHANGELOG.md) — Documentação da Versão 1.52 no sumário e histórico completo.
5. **Cópias Espelhadas Obrigatórias:**
   - [gestor supervisao_patos/index.html](file:///Users/bruno/Desktop/gestor%20supervisao_patos/gestor%20supervisao_patos/index.html)
   - [gestor supervisao_patos/firebase_deploy/public/index.html](file:///Users/bruno/Desktop/gestor%20supervisao_patos/gestor%20supervisao_patos/firebase_deploy/public/index.html)

---

## 3. Especificação de Implementação Passo a Passo (Snippets Exatos)

### Passo 1: Remoção do emoji `📍` na Tabela de Unidades Escolares (`js/features/management.js`)
**Localização:** Função `renderUnitsScreen()`, linha ~189 de `js/features/management.js`.

```javascript
// ==================== ANTES ====================
          <td>
            <span style="cursor:pointer; color:var(--primary); font-weight:700;" onclick="openViewUnitClassesModal('${u.id}')" title="Clique para visualizar turmas e docentes atribuídos">
              ${u.name}
            </span>
          </td>
          <td><span class="status-badge" style="background:#DCFCE7; color:#166534; font-weight:700; font-size:11px;">📍 ${u.polo}</span></td>
          <td>${u.address || 'Não informado'}</td>

// ==================== DEPOIS ====================
          <td>
            <span style="cursor:pointer; color:var(--primary); font-weight:700;" onclick="openViewUnitClassesModal('${u.id}')" title="Clique para visualizar turmas e docentes atribuídos">
              ${u.name}
            </span>
          </td>
          <td><span class="status-badge" style="background:#DCFCE7; color:#166534; font-weight:700; font-size:11px;">${u.polo}</span></td>
          <td>${u.address || 'Não informado'}</td>
```

---

### Passo 2: Remoção do emoji `📍` no Modal de Detalhes da UE (`js/features/management.js`)
**Localização:** Função `openViewUnitClassesModal(unitId)`, linha ~220 de `js/features/management.js`.

```javascript
// ==================== ANTES ====================
      if (titleEl) titleEl.innerText = unit.name;
      if (poloEl) poloEl.innerText = `📍 ${unit.polo || 'Polo Regional'}`;
      if (addrEl) addrEl.innerText = unit.address || 'Endereço não informado';

// ==================== DEPOIS ====================
      if (titleEl) titleEl.innerText = unit.name;
      if (poloEl) poloEl.innerText = unit.polo || 'Polo Regional';
      if (addrEl) addrEl.innerText = unit.address || 'Endereço não informado';
```

---

### Passo 3: Remoção do emoji `📍` no Quadro de Equipes & Servidores (`js/features/management.js`)
**Localização:** Função `renderTeamScreen()`, linha ~1406 de `js/features/management.js`.

```javascript
// ==================== ANTES ====================
        tr.innerHTML = `
          <td>
            <strong>${m.name}</strong>${emailSubtitle}
          </td>
          <td><span style="font-size:12px; font-weight:700; color:var(--primary);">${m.roleTitle}</span></td>
          <td>${m.school || 'Rede Municipal'}</td>
          <td><span class="status-badge" style="background:#F1F5F9; color:#475569; font-size:11px;">📍 ${poloName}</span></td>
          <td>${supervisorDisplay}</td>

// ==================== DEPOIS ====================
        tr.innerHTML = `
          <td>
            <strong>${m.name}</strong>${emailSubtitle}
          </td>
          <td><span style="font-size:12px; font-weight:700; color:var(--primary);">${m.roleTitle}</span></td>
          <td>${m.school || 'Rede Municipal'}</td>
          <td><span class="status-badge" style="background:#F1F5F9; color:#475569; font-size:11px;">${poloName}</span></td>
          <td>${supervisorDisplay}</td>
```

---

### Passo 4: Atualização de Versão e Changelog Duplo (`index.html` e `CHANGELOG.md`)

#### 4.1 Botão `.btn-changelog` em `index.html` (L84)
Atualizar de:
```html
<span>Versão 1.51 (v8.2.18)</span>
```
Para:
```html
<span>Versão 1.52 (v8.2.19)</span>
```

#### 4.2 Card no `#modalChangelog` em `index.html` (L1759)
Inserir no topo dos registros:
```html
      <!-- VERSÃO 1.52 - REMOÇÃO DE EMOJIS DOS POLOS REGIONAIS E HIGIENIZAÇÃO VISUAL -->
      <div class="card" style="margin-bottom:16px; border-left:4px solid var(--primary); background:#F8FAFC;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span style="font-weight:800; font-size:14px; color:var(--text-primary);">📌 Versão 1.52 (v8.2.19)</span>
          <span style="font-size:11px; background:#EFF6FF; color:var(--primary); padding:2px 8px; border-radius:12px; font-weight:700;">28/10/2026</span>
        </div>
        <div style="font-size:12px; font-weight:700; color:var(--text-primary); margin-bottom:6px;">
          Higienização Visual Institucional e Remoção dos Emojis de Junto dos Polos:
        </div>
        <ul style="font-size:12px; color:var(--text-secondary); margin:0; padding-left:18px; line-height:1.5;">
          <li>🧹 <strong>Erradicação do Emoji de Alfinete (📍):</strong> Supressão definitiva do caractere nos badges de status dos Polos Regionais vinculados na Tabela de Unidades Escolares (<code>#unitsTableBody</code>), no Quadro de Equipes &amp; Servidores (<code>#teamTableBody</code>) e no Modal de Consulta da UE (<code>#viewUnitModalPolo</code>).</li>
          <li>🏛️ <strong>Alinhamento ao Padrão Hallmark:</strong> Substituição da estética informal de emojis de sistema operacional por tipografia limpa em badges monocromáticos padronizados.</li>
          <li>🛡️ <strong>Preservação Integral da Governança SSOT:</strong> Manutenção rigorosa de todos os relacionamentos de dados territoriais, vínculos de formadoras e filtros por polo.</li>
        </ul>
      </div>
```

#### 4.3 `CHANGELOG.md`
Adicionar a entrada da Versão 1.52 na tabela executiva e na seção detalhada de versões.

---

### Passo 5: Sincronização das Cópias Espelhadas
Garantir o espelhamento idêntico de `index.html`:
- Copiar `index.html` para `gestor supervisao_patos/index.html`.
- Copiar `index.html` para `gestor supervisao_patos/firebase_deploy/public/index.html`.

---

## 4. Critérios de Aceite e Roteiro de Teste

### 4.1 Critérios de Aceite
1. **Tabela de UEs:** A coluna "Polo Regional Vinculado" exibe o nome limpo do polo (ex: `Polo Regional 1 (Norte)`) dentro do badge verde sem qualquer emoji `📍`.
2. **Modal de Detalhes da UE:** Ao clicar em qualquer Unidade Escolar (ex: CEI Professora Maria de Lourdes), o badge de polo no cabeçalho exibe o nome limpo sem `📍`.
3. **Quadro de Servidores:** A coluna "Polo Vinculado" exibe o nome limpo do polo no badge cinza sem `📍`.
4. **Sintaxe JavaScript:** Validação sem erros via engine nativa do macOS (`python3 audit_platform.py --check-syntax`).
5. **Auditoria Geral:** Suíte automatizada (`python3 audit_platform.py --silent-on-success`) executada pós-deploy com aprovação plena.

### 4.2 Roteiro de Teste
1. Acessar a aba Gestão Pedagógica / Rede (como Núcleo de EI ou Formadora).
2. Na sub-aba "Unidades Escolares & Polos", inspecionar a coluna de Polo das escolas e confirmar a ausência do emoji `📍`.
3. Clicar em uma escola para abrir o modal `#modalViewUnitClasses` e inspecionar o badge superior direito `#viewUnitModalPolo`.
4. Ir para a sub-aba "Equipes & Servidores da Rede" e confirmar a ausência do emoji `📍` na coluna "Polo Vinculado".

---

## 5. Alterações / Adições / Exclusões no Algoritmo de Auditoria (`audit_platform.py` / `audit_engine.js`)

Esta seção é **obrigatória** conforme as normas do projeto:

### 5.1 No motor `js/audit/audit_engine.js`:

#### A. Atualização da Asserção de Versão (Módulo `navegacao_layout`)
Em torno da linha ~3228:
```javascript
// Validação do rótulo atualizado do botão de changelog e card da versão 1.52
if (!btnChangelog.textContent.includes('Versão 1.52')) {
  throw new Error(`Botão de versão desatualizado: "${btnChangelog.textContent.trim()}"`);
}
if (!modalChg.innerHTML.includes('Versão 1.52')) {
  throw new Error('#modalChangelog não contém o card descritivo da Versão 1.52');
}
logger.log('Asserção de Integridade do Cabeçalho e Registro da Versão 1.52 (v8.2.19)', true);
```

#### B. Nova Asserção Específica de Ausência de Emojis em Polos (Módulo `gestao_ue_docentes`)
Em torno da linha ~950 (dentro do teste de visualização da UE e tabela de gestão):
```javascript
// Validação da Ausência Estrita de Emojis nos Badges de Polos Regionais
const viewUnitPolo = document.getElementById('viewUnitModalPolo')?.innerText;
if (viewUnitPolo && viewUnitPolo.includes('📍')) {
  throw new Error(`Badge de Polo no modal de visualização ainda contém emoji: "${viewUnitPolo}"`);
}

// Renderiza a tela de unidades e de servidores para validar os badges gerados
if (typeof renderUnitsScreen === 'function') renderUnitsScreen();
const unitPoloBadges = document.querySelectorAll('#unitsTableBody tr td:nth-child(2) .status-badge');
unitPoloBadges.forEach(b => {
  if (b.innerText.includes('📍')) {
    throw new Error(`Badge de Polo na tabela de UEs contém emoji residual: "${b.innerText}"`);
  }
});

if (typeof renderTeamScreen === 'function') renderTeamScreen();
const teamPoloBadges = document.querySelectorAll('#teamTableBody tr td:nth-child(4) .status-badge');
teamPoloBadges.forEach(b => {
  if (b.innerText.includes('📍')) {
    throw new Error(`Badge de Polo no quadro de servidores contém emoji residual: "${b.innerText}"`);
  }
});

logger.log('Erradicação completa do emoji 📍 nos badges de Polos Regionais (UEs, Equipes e Modal)', true);
```

### 5.2 Em `audit_platform.py`:
- Nenhuma alteração estrutural no script Python é necessária, pois a validação sintática via JavaScriptCore (`--check-syntax`) e o executor headless capturam e validam automaticamente o código JavaScript e a suíte do `audit_engine.js`.
