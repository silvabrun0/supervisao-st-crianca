# PLANO DE IMPLEMENTAÇÃO: PILAR 16 - RESOLUÇÃO DO PARADOXO DA REGÊNCIA DUPLA (OBSERVAÇÃO DOCENTE INDIVIDUALIZADA EM PRÁTICAS CONSISTENTES)

> **DIRETRIZ OBRIGATÓRIA DE EXECUÇÃO (ETAPA 2):**  
> O assistente executor (Etapa 2 - O Operário) deve **obrigatoriamente ler e seguir as diretrizes dos arquivos `WORKFLOW_MACOS.md`, `AGENTS.md` e a skill `execucao-operario`** antes de aplicar qualquer modificação no código. Nenhuma modificação deve ser realizada sem conformidade estrita com o workflow, incluindo:  
> 1. Execução prévia de sincronização com o repositório remoto (`git pull origin main`).  
> 2. Preservação integral das regras de negócio existentes, dados cadastrais SSOT, blindagens RBAC, série histórica, ciclo longitudinal, formulário único integral (Pilar 4) e testes automatizados.  
> 3. Verificação de integridade pós-edição com dupla checagem de leitura em cada trecho modificado.  
> 4. Validação sintática pré-voo obrigatória via JSC (`python3 audit_platform.py --check-syntax`).  
> 5. Salvamento obrigatório do backup intermediário na pasta `intermediárias/` sob o nome `aplicativo_v1.72_pilar_16_paradoxo_regencia_dupla.html`.  
> 6. Gestão dupla de Changelog no arquivo `CHANGELOG.md` e no modal `#modalChangelog` / botão `.btn-changelog` do `index.html`, registrando a **Versão 1.72**.  
> 7. Sincronização idêntica entre o arquivo principal `index.html` da raiz, `gestor supervisao_patos/index.html` e `gestor supervisao_patos/firebase_deploy/public/index.html`.  
> 8. Checagem pré-push (`git fetch origin main`), commit semântico (`feat: implementar pilar 16 - observacao docente individual em praticas consistentes e resolucao da regencia dupla`), push para `origin main` e deploy automático no GitHub Pages.  
> 9. Execução pós-deploy obrigatória do algoritmo de auditoria (`python3 audit_platform.py --silent-on-success`) com comunicação estrita a falhas.

---

## 1. Diagnóstico e Contexto Técnico-Pedagógico

### 1.1 Cenário Atual e a Tensão Metodológica da Regência Dupla
Na rede municipal de Educação Infantil de Patos/PB, a organização das turmas regulares (tanto de Creche quanto de Pré-Escola) e de tempo integral apoia-se predominantemente na **regência compartilhada** (duplas de professores simultâneos em cada turno regular, totalizando até quatro professores em turmas integrais).

Com a consolidação do **Pilar 1**, o sistema fixou acertadamente a **TURMA** como a unidade canônica de observação e avaliação pedagógica: o foco é aquilo que a criança vivencia no cotidiano da sala de aula. Paralelamente, o **Pilar 5** instituiu a atribuição mandatória em itens avaliados como `"Parcial"`, exigindo a vinculação de qual docente respondeu pela fragilidade observada e a respectiva justificativa.

Entretanto, as reuniões de alinhamento com a liderança pedagógica do programa SerTão Criança evidenciaram um impasse estrutural na coleta em sala:
* **O Paradoxo da Regência Dupla (Julia Elena Cordoba Vieira, 01:29:30 - 01:31:31):**  
  Em uma turma com dois professores regentes simultâneos, se uma professora conduz uma contação de histórias rica, expressiva e envolvente, a experiência das crianças foi de altíssima qualidade pedagógica. Portanto, o critério da turma **deve ser classificado legitimamente como `Consistente`**.  
  Contudo, se a segunda professora regente esteve alheia, passiva, dispersa ou sem interagir com os pequenos, a coordenadora pedagógica se depara com um dilema no formulário atual:
  - **Se rebaixar a turma para `Parcial`:** comete uma injustiça metodológica contra a experiência das crianças e pune o trabalho de excelência da professora protagonista.
  - **Se marcar `Consistente`:** o sistema atual não oferece nenhum mecanismo para registrar a assimetria observada na regência, privando a coordenadora de documentar o apontamento individual para a reunião de feedback formativo com a professora que necessita de mediação.

### 1.2 Diretriz Aprovada (Pilar 16)
1. **Unidade Turma Preservada:** A nota da turma no critério permanece **`Consistente`**, garantindo a legitimidade do indicador de qualidade da sala de aula e da dimensão pedagógica.
2. **Gatilho Descritivo Opcional em Práticas Consistentes:** Ao selecionar `Consistente`, o sistema disponibiliza um botão/gatilho discreto, sem atrito:  
   `[ 📝 Registrar Observação Individual por Docente (Opcional) ]`.
3. **Seleção Nominal do(a) Docente:** Ao acionar o campo, a coordenadora pode marcar nominalmente qual(is) dos professores regentes é o alvo da anotação qualitativa (ex: destacar a condução excelente de uma docente e indicar o ponto de intervenção formativa da outra).
4. **Alimentação da Síntese e Devolutiva Individual (PDF Segregado):** As anotações individuais em critérios consistentes são consolidadas no card individual de cada docente na tela de Síntese (`#screenSynthesis`) e incorporadas na Ficha Individual de Devolutiva Pedagógica (impressão/PDF), fornecendo subsídio documental preciso para a reunião de tutoria.
5. **Diferenciação Estrita de Status:**
   - **`Consistente`:** Atribuição nominal **estritamente opcional** (nunca gera pendência impeditiva no motor de validação).
   - **`Parcial`:** Atribuição nominal e justificativa **mandatórias** (regra do Pilar 5).
   - **`Não Realizado` / `Não se Aplica`:** Não abrem atribuição individual.

---

## 2. Arquitetura e Padrão Visual Hallmark

### 2.1 Padrão Hallmark UI (Design Sobriedade e Acessibilidade)
O design deste novo componente respeitará integralmente os pilares do **Hallmark Standard**:
* **Tokens First:** Uso exclusivo das variáveis CSS corporativas (`var(--primary)`, `var(--primary-dark)`, `var(--surface)`, `var(--surface-subtle)`, `var(--border)`, `var(--text-primary)`, `var(--text-secondary)`, `var(--success)`). Zero cores literais hexadecimais soltas em seletores.
* **Erradicação de Emojis como Ícones:** Substituição completa de emojis (como `📝` ou `✨`) por pictogramas vetoriais SVG monocromáticos limpos (ícone Feather/Lucide).
* **Tipografia e Rótulos:** Rótulos em *sentence case*, sem *all-caps* agressivo, fontes sem tracking artificial.
* **Transições Específicas:** Proibição de `transition: all`. Animações restritas a `background-color 0.15s ease, border-color 0.15s ease`.
* **Acessibilidade & Foco:** `:focus-visible` nítido em todos os botões e áreas de texto, alvos de toque ergonômicos de no mínimo 44px em telas sensíveis ao toque.
* **Single-Surface Containment:** A caixa de observação consistente é renderizada em camada única plana, sem cartões aninhados (`card inside a card`).

### 2.2 Modelagem de Dados no Objeto de Observação (`obs`)
O objeto de observação ativa (`appState.currentObs`) passa a conter a chave `consistentAttributions`:

```javascript
{
  id: 'obs-1729524000000',
  evaluatedType: 'turma',
  teachers: ['Ana Carolina Silva', 'Juliana Roberta Rocha'],
  responses: {
    '1.1.1': 'consistent'
  },
  // PILAR 16: Anotações Nominais Opcionais em Práticas Consistentes
  consistentAttributions: {
    '1.1.1': {
      teachers: ['Juliana Roberta Rocha'],
      note: 'Professora Ana conduziu com protagonismo exemplar a roda de leitura; Professora Juliana permaneceu em silêncio no fundo da sala sem mediar conflitos pontuais.'
    }
  },
  // PILAR 5: Itens Parciais Mandatórios
  partialAttributions: { ... }
}
```

### 2.3 Pontos de Impacto no Código
```
gestor supervisao_patos/
├── js/features/observation.js     # Renderização do gatilho e caixa opcional no card do critério; manipulação de estado reativo
├── js/features/synthesis.js       # Rastreabilidade dos apontamentos consistentes no card individual de cada docente e PDF
├── css/screens.css                # Estilos Hallmark para o botão gatilho, caixa expansível e chips de professores
├── index.html                     # Registro da Versão 1.72 no changelog e sincronização
├── js/audit/audit_engine.js       # Novas asserções de teste automatizado (Módulos 4 e 5)
├── CHANGELOG.md                   # Documentação da evolução v1.72
└── intermediárias/                # Backup preventivo v1.72
```

---

## 3. Especificação Passo a Passo da Implementação

### 3.1 Estilos CSS Hallmark (`css/screens.css` ou bloco de estilos do `index.html`)

Adicionar as classes para o gatilho discreto, caixa expansível e chips no padrão Hallmark:

```css
/* ==========================================================================
   PILAR 16: REGÊNCIA DUPLA - OBSERVAÇÃO INDIVIDUAL EM PRÁTICAS CONSISTENTES
   Padrão Hallmark: Tokens corporativos, sem all-caps, sem transition: all
   ========================================================================== */

.btn-consistent-attribution-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: 1px dashed var(--primary);
  color: var(--primary);
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  min-height: 36px;
}

.btn-consistent-attribution-toggle:hover {
  background: var(--surface-subtle);
  border-color: var(--primary-dark);
  color: var(--primary-dark);
}

.btn-consistent-attribution-toggle:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

.btn-consistent-attribution-toggle.has-data {
  background: #F0FDF4;
  border: 1px solid #86EFAC;
  color: #166534;
}

.consistent-attribution-box {
  background: #F8FAFC;
  border: 1px solid var(--border);
  border-left: 3px solid var(--primary);
  border-radius: 6px;
  padding: 12px 14px;
  margin-top: 10px;
}

.consistent-attribution-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
}

.consistent-attribution-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: var(--text-primary);
}

.consistent-attribution-desc {
  font-size: 11px;
  color: var(--text-secondary);
  line-height: 1.4;
  margin-bottom: 10px;
}

.teacher-chip-select-consistent {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 11px;
  color: var(--text-primary);
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.teacher-chip-select-consistent:hover {
  border-color: var(--primary);
}

.teacher-chip-select-consistent.selected {
  background: #EFF6FF;
  border-color: #93C5FD;
  color: #1E40AF;
  font-weight: 600;
}
```

---

### 3.2 Modificação no Card do Critério (`js/features/observation.js`)

Na função `renderCriterionCard(crit, obsInstance)`:
1. Quando a pontuação for `consistent` e o tipo avaliado for `turma`, exibir o selo de evidência Hallmark (vetorial SVG) e o gatilho discreto `btn-consistent-attribution-toggle`.
2. Se houver anotação salva em `obsInstance.consistentAttributions[crit.id]` ou se o usuário tiver aberto o bloco, renderizar a caixa `consistent-attribution-box`:

```javascript
// Trecho em renderCriterionCard dentro de js/features/observation.js:

${(resp === 'consistent' && obsInstance.evaluatedType === 'turma') ? `
  <div style="margin-top:8px;">
    <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
      <span class="badge-good-practice" style="display:inline-flex; align-items:center; gap:6px;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
        <span>Prática consistente na turma</span>
      </span>
      ${!appState.isReadOnly ? `
        <button type="button" 
                class="btn-consistent-attribution-toggle ${((obsInstance.consistentAttributions && obsInstance.consistentAttributions[crit.id] && obsInstance.consistentAttributions[crit.id].note) ? 'has-data' : '')}"
                onclick="toggleCriterionConsistentBox('${crit.id}')"
                title="Registrar apontamento nominal de docente em regência dupla sem alterar a pontuação da turma">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          <span>${(obsInstance.consistentAttributions && obsInstance.consistentAttributions[crit.id] && obsInstance.consistentAttributions[crit.id].note) ? 'Editar apontamento nominal' : 'Observação individual por docente (opcional)'}</span>
        </button>
      ` : ''}
    </div>

    ${((appState.openConsistentBoxes && appState.openConsistentBoxes[crit.id]) || (obsInstance.consistentAttributions && obsInstance.consistentAttributions[crit.id] && (obsInstance.consistentAttributions[crit.id].note || (obsInstance.consistentAttributions[crit.id].teachers && obsInstance.consistentAttributions[crit.id].teachers.length > 0)))) ? `
      <!-- PILAR 16: CAIXA DESCRITIVA OPCIONAL EM PRÁTICAS CONSISTENTES -->
      <div id="consistent-attribution-box-${crit.id}" class="consistent-attribution-box">
        <div class="consistent-attribution-header">
          <div class="consistent-attribution-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <span>Apontamento nominal da regência compartilhada (Pilar 16)</span>
          </div>
          <span style="font-size:10px; font-weight:700; color:var(--text-secondary); background:var(--surface); border:1px solid var(--border); border-radius:4px; padding:1px 6px;">
            Opcional · Mantém nota consistente na turma
          </span>
        </div>
        <p class="consistent-attribution-desc">
          Utilize para registrar discrepâncias de atuação entre os professores regentes ou destacar uma condução exemplar, documentando o subsídio formativo sem rebaixar a avaliação da turma.
        </p>

        <div style="margin-bottom:10px;">
          <label style="font-size:11px; font-weight:700; color:var(--text-primary); display:block; margin-bottom:6px;">
            Docente(s) alvo deste apontamento formativo:
          </label>
          <div style="display:flex; flex-wrap:wrap; gap:8px;">
            ${(() => {
              let teachers = (obsInstance.teachers && obsInstance.teachers.length > 0)
                ? obsInstance.teachers
                : (obsInstance.teacherName ? [obsInstance.teacherName] : []);

              if (obsInstance.isIntegral) {
                if (obsInstance.integralStage === 'matutino') {
                  teachers = (obsInstance.teachersMorning && obsInstance.teachersMorning.length > 0)
                    ? obsInstance.teachersMorning
                    : teachers.slice(0, 2);
                } else {
                  teachers = obsInstance.teachers;
                }
              }

              const currentConsistent = (obsInstance.consistentAttributions && obsInstance.consistentAttributions[crit.id]) || { teachers: [], note: '' };
              const selectedTeachers = currentConsistent.teachers || [];

              return teachers.map(tName => {
                const isChecked = selectedTeachers.includes(tName);
                return `
                  <label class="teacher-chip-select-consistent ${isChecked ? 'selected' : ''}">
                    <input type="checkbox" 
                           value="${tName}" 
                           ${isChecked ? 'checked' : ''} 
                           ${appState.isReadOnly ? 'disabled' : ''}
                           onchange="setCriterionConsistentTeacher('${crit.id}', '${tName}', this.checked)"
                           style="cursor:pointer;">
                    <span>${tName}</span>
                  </label>
                `;
              }).join('');
            })()}
          </div>
        </div>

        <div>
          <label style="font-size:11px; font-weight:700; color:var(--text-primary); display:block; margin-bottom:4px;">
            Anotação qualitativa sobre a mediação do(a) docente:
          </label>
          <textarea class="form-textarea" 
                    style="min-height:56px; font-size:12px; background:var(--surface);"
                    placeholder="${appState.isReadOnly ? 'Sem anotações registradas.' : 'Descreva a atuação específica (ex: professora responsável conduziu com autonomia; segunda docente esteve passiva na rotina)...'}"
                    oninput="setCriterionConsistentNote('${crit.id}', this.value)"
                    ${appState.isReadOnly ? 'disabled' : ''}>${((obsInstance.consistentAttributions && obsInstance.consistentAttributions[crit.id] && obsInstance.consistentAttributions[crit.id].note) || '')}</textarea>
        </div>
      </div>
    ` : ''}
  </div>
` : ''}
```

---

### 3.3 Funções Reativas de Manipulação de Estado (`js/features/observation.js`)

Implementar as funções controladoras reativas:

```javascript
// PILAR 16: Alternância da visibilidade da caixa de apontamento consistente
function toggleCriterionConsistentBox(critId) {
  if (!appState.openConsistentBoxes) appState.openConsistentBoxes = {};
  appState.openConsistentBoxes[critId] = !appState.openConsistentBoxes[critId];
  renderActiveObservation(true);
}

// PILAR 16: Seleção reativa de docente(s) para apontamento consistente
function setCriterionConsistentTeacher(critId, teacherName, isChecked) {
  if (appState.isReadOnly || !appState.currentObs) return;
  if (!appState.currentObs.consistentAttributions) appState.currentObs.consistentAttributions = {};
  if (!appState.currentObs.consistentAttributions[critId]) {
    appState.currentObs.consistentAttributions[critId] = { teachers: [], note: '' };
  }

  let teachers = appState.currentObs.consistentAttributions[critId].teachers || [];
  if (isChecked) {
    if (!teachers.includes(teacherName)) teachers.push(teacherName);
  } else {
    teachers = teachers.filter(t => t !== teacherName);
  }
  appState.currentObs.consistentAttributions[critId].teachers = teachers;
  saveState();
}

// PILAR 16: Anotação descritiva reativa em prática consistente
function setCriterionConsistentNote(critId, text) {
  if (appState.isReadOnly || !appState.currentObs) return;
  if (!appState.currentObs.consistentAttributions) appState.currentObs.consistentAttributions = {};
  if (!appState.currentObs.consistentAttributions[critId]) {
    appState.currentObs.consistentAttributions[critId] = { teachers: [], note: '' };
  }
  appState.currentObs.consistentAttributions[critId].note = text;
  saveState();
}
```

E em `setResponse(critId, val)`:
```javascript
// Limpeza defensiva quando a nota for alterada para status incompatível:
if (val !== 'consistent') {
  if (appState.currentObs.consistentAttributions) {
    delete appState.currentObs.consistentAttributions[critId];
  }
  if (appState.openConsistentBoxes) {
    delete appState.openConsistentBoxes[critId];
  }
}
```

---

### 3.4 Garantia de Não-Obrigatoriedade no Validador (`getObservationPendencies`)

A função `getObservationPendencies(obs)` deve **permanecer inalterada quanto a consistentes**, garantindo expressamente que o preenchimento de `consistentAttributions` é **estritamente opcional**:
* Se o avaliador preencher ou deixar em branco a observação individual em um item consistente, a observação é **válida e finalizável normalmente**, sem gerar pendências no banner de validação ou no encerramento.

---

### 3.5 Integração no Card Individual de Cada Docente (`js/features/synthesis.js`)

Na função `renderTeacherSynthesisCards`, consolidar e exibir os itens consistentes atribuídos nominalmente à docente:

```javascript
// Mapeia critérios com nota consistente com apontamento individual atribuídos a esta docente (PILAR 16)
const assignedConsistentItems = [];
const consistentAttrs = obs.consistentAttributions || {};

Object.keys(responses).forEach(critId => {
  if (responses[critId] === 'consistent') {
    const cAttr = consistentAttrs[critId];
    if (cAttr && Array.isArray(cAttr.teachers) && cAttr.teachers.includes(tName) && cAttr.note && cAttr.note.trim()) {
      let critObj = null;
      sections.forEach(s => s.subSections.forEach(sub => sub.criteria.forEach(c => {
        if (c.id === critId) critObj = c;
      })));
      assignedConsistentItems.push({
        id: critId,
        text: critObj ? critObj.text : `Critério ${critId}`,
        note: cAttr.note.trim()
      });
    }
  }
});
```

E na renderização do card:
```javascript
<!-- PILAR 16: RASTREABILIDADE DE APONTAMENTOS INDIVIDUAIS EM PRÁTICAS CONSISTENTES -->
<div style="margin-bottom:16px;">
  <div style="font-size:12px; font-weight:700; color:var(--text-primary); margin-bottom:6px; display:flex; align-items:center; gap:6px;">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
    <span>Apontamentos individuais em práticas consistentes (${assignedConsistentItems.length}):</span>
  </div>
  ${assignedConsistentItems.length === 0 ? `
    <div style="font-size:11px; color:var(--text-secondary); background:var(--surface-subtle); border:1px solid var(--border); border-radius:6px; padding:8px 12px;">
      Nenhuma anotação individual de regência atribuída a esta docente nos critérios consistentes.
    </div>
  ` : `
    <div style="display:flex; flex-direction:column; gap:6px;">
      ${assignedConsistentItems.map(item => `
        <div style="background:var(--surface); border:1px solid var(--border); border-left:3px solid var(--primary); border-radius:6px; padding:8px 12px; font-size:11px;">
          <div style="font-weight:700; color:var(--text-primary); margin-bottom:2px;">Item ${item.id} — ${item.text}</div>
          <div style="color:var(--text-secondary); line-height:1.4;">${item.note}</div>
        </div>
      `).join('')}
    </div>
  `}
</div>
```

---

### 3.6 Integração na Ficha Individual de Devolutiva Pedagógica (PDF / Impressão)

Na função de exportação individual (`exportTeacherIndividualPdf` ou trecho correspondente em `js/features/synthesis.js`), incluir uma tabela complementar após a avaliação das 5 dimensões e dos itens parciais:
* Se `assignedConsistentItems.length > 0`, renderizar bloco intitulado:  
  **"Apontamentos Nominais da Regência Compartilhada em Práticas Consistentes (Pilar 16)"** com as colunas *Item*, *Critério da Matriz* e *Observação Pedagógica / Evidência Formativa*.

---

## 4. Critérios de Aceite e Roteiro de Teste

1. **Ativação Não-Intrusiva em Práticas Consistentes:**
   - Ao marcar um critério como `Consistente` em observação de turma, o sistema deve exibir o botão `[ Observação individual por docente (opcional) ]` no padrão Hallmark.
2. **Seleção de Docentes Regentes:**
   - Ao abrir a caixa, devem ser listados os professores regentes da turma (ou do turno correspondente no tempo integral).
   - A seleção via checkbox de um ou mais docentes e o preenchimento do campo de texto devem ser persistidos reativamente em `appState.currentObs.consistentAttributions[critId]`.
3. **Não-Bloqueio de Finalização (Trava Opcional):**
   - Um formulário contendo respostas consistentes com ou sem anotações nominais deve ser 100% finalizável. Não pode ser gerada pendência impeditiva.
4. **Resiliência na Mudança de Nota:**
   - Se o usuário alterar a nota de `Consistente` para `Parcial`, o nó consistente deve ser limpo e o box do Pilar 5 deve ser ativado.
   - Se alterar para `Não Realizado` ou `Não se Aplica`, qualquer anotação anterior deve ser removida de forma segura.
5. **Visibilidade na Síntese:**
   - Na tela de Síntese, o card de cada docente vinculado ao apontamento deve exibir os itens consistentes atribuídos com a respectiva anotação descritiva.
6. **Harmonização Visual Hallmark:**
   - Ausência total de emojis na interface do novo componente; uso estrito de ícones vetoriais SVG monocromáticos; conformidade com tokens CSS e touch targets de 44px.

---

## 5. Seção Obrigatória de Auditoria (`audit_platform.py` / `js/audit/audit_engine.js`)

### 5.1 Novas Asserções no Motor de Testes Automatizado
Adicionar no **Módulo 4 (`rubricas_observacao`)** ou **Módulo 5 (`sintese_finalizacao`)** em `js/audit/audit_engine.js`:

1. **Teste 4.X - Pilar 16: Validação de Apontamento Opcional em Regência Dupla:**
   - Configura uma observação de teste em turma com duas docentes regentes.
   - Pontua um critério (ex: `1.1.1`) como `consistent`.
   - Verifica que `getObservationPendencies` **NÃO** inclui pendência para `1.1.1`.
   - Executa `setCriterionConsistentTeacher('1.1.1', 'Juliana Roberta Rocha', true)` e `setCriterionConsistentNote('1.1.1', 'Observação formativa de teste')`.
   - Valida que `appState.currentObs.consistentAttributions['1.1.1']` contém os dados salvos com integridade.
   - Verifica novamente que a observação continua sem pendências.
2. **Teste 5.X - Pilar 16: Rastreabilidade no Card Nominal de Síntese da Docente:**
   - Renderiza a tela de Síntese (`renderSynthesisScreen`).
   - Verifica que o card nominal da professora Juliana exibe a anotação formativa associada ao Item `1.1.1`.
3. **Teste 4.Y - Pilar 16: Limpeza Segura ao Mudar de Status:**
   - Altera a nota de `1.1.1` para `not_done`.
   - Valida que `appState.currentObs.consistentAttributions['1.1.1']` foi devidamente deletado, prevenindo dados órfãos.

### 5.2 Validação Sintática Pré-Voo (JSC)
Antes de qualquer commit na Etapa 2, o executor deve rodar:
```bash
python3 audit_platform.py --check-syntax
```
Garantindo 100% de integridade sintática e léxica do JavaScript.
