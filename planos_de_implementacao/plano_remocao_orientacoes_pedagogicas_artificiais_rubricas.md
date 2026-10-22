# PLANO DE IMPLEMENTAÇÃO: REMOÇÃO INTEGRAL DE ORIENTAÇÕES PEDAGÓGICAS ARTIFICIAIS E SOBERANIA DA MATRIZ CURRICULAR OFICIAL

> **DIRETRIZ DE EXECUÇÃO OBRIGATÓRIA (LEIA ANTES DE EXECUTAR):**  
> O agente executor (Etapa 2) **DEVE OBRIGATORIAMENTE** seguir todas as regras contidas no documento [`WORKFLOW_MACOS.md`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md) e [`AGENTS.md`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/AGENTS.md).  
> Nenhuma decisão técnico-pedagógica pode ser inventada ou simulada. O aplicativo deve preservar com fidelidade absoluta os enunciados oficiais aprovados pela rede municipal de Patos.

---

## 1. Diagnóstico e Contexto

### 1.1 Cenário Atual
Na versão 1.11, foi introduzido um conjunto de recursos denominado "Pilar 11", incluindo:
1. Criação de um repositório canônico simulado/inventado (`RUBRIC_GUIDANCE_DB`) com textos de "O que observar na prática", "Exemplos concretos de evidências" e "Régua de gradação formativa" para cada item da matriz curricular.
2. Criação de uma Bottom Sheet / Modal deslizante (`#modalRubricGuidance`) para exibir tais orientações inventadas.
3. Injeção de botões `.btn-rubric-guidance-trigger` com ícone `ℹ️` em cada card de critério na observação ativa (`#screenActiveObs`), e `.btn-rubric-drilldown-trigger` na sub-aba de Afunilamento de Indicadores (`#indicatorsDrilldownView`).
4. Truncamento com regex de títulos longos em ambiente móvel através da função `formatCriterionMobileTitle()`, adicionando link `(mais...)` para forçar a abertura do modal inventado.

### 1.2 Problema Apontado pelo Usuário
O usuário sinalizou expressamente:
> *"ℹ️ Gatilho Informativo Tátil e Acessível: Inclusão do botão de apoio pedagógico .btn-rubric-guidance-trigger com ícone ℹ️ no cabeçalho de cada critério na observação ativa e na sub-aba de Afunilamento de Indicadores.: isso seria em alguns lugares que têm muito texto. voce não pode, de maneira alguma, inventar questões que envolvam a própri alógica técnico-peda'gocica. remova isso"*

A rede municipal e a supervisão pedagógica de Patos possuem matrizes e critérios normativos próprios. O assistente de IA não tem permissão para inventar ou criar interpretações pedagógicas, gradações arbitrárias, orientações de chão de sala ou pautas artificiais. Qualquer recurso que tente inventar lógica pedagógica deve ser **completamente removido**.

### 1.3 Resultado Esperado
- Remoção total e definitiva de `RUBRIC_GUIDANCE_DB`.
- Remoção total e definitiva do modal `#modalRubricGuidance` do DOM.
- Remoção total das funções `openRubricGuidanceModal()`, `closeRubricGuidanceModal()`, `getCriterionGuidance()` e `formatCriterionMobileTitle()`.
- Remoção dos botões `.btn-rubric-guidance-trigger` e `.btn-rubric-drilldown-trigger`.
- Restauração da renderização canônica e fidedigna de cada critério na observação ativa:
  ```html
  <div class="crit-top">
    <div class="crit-text">${crit.text}</div>
    <div class="crit-tag">Item ${crit.id}</div>
  </div>
  ```
- Restauração no Afunilamento de Indicadores (drilldown):
  ```html
  <strong>[${crit.id}]</strong> ${crit.text}
  ```
- Remoção dos estilos CSS órfãos (`.btn-rubric-guidance-trigger`, `.btn-rubric-drilldown-trigger`, `.guidance-card`, `.crit-text-desktop`, `.crit-text-mobile`, `.crit-more-hint`, etc.).
- Atualização do Módulo 4 da auditoria para verificar a pureza da matriz e a ausência de artefatos pedagógicos artificiais.
- Incremento para **Versão 1.13 (v7.91)** com registro duplo no Changelog (`CHANGELOG.md` e modal `#modalChangelog`).
- Sincronização entre `index.html` e `firebase_deploy/public/index.html`.

---

## 2. Arquitetura e Pontos de Impacto

| Componente | Arquivo | Localização Estimada | Ação |
| :--- | :--- | :--- | :--- |
| **Estilos CSS** | `index.html` | Linhas ~531 a 605 | Remover seletores `.crit-text-desktop`, `.crit-text-mobile`, `.crit-more-hint`, `.crit-top-actions`, `.btn-rubric-guidance-trigger`, `.btn-rubric-drilldown-trigger`, `.guidance-card` |
| **Estilos Mobile CSS** | `index.html` | Linhas ~3206 a 3220 | Remover regras de override mobile de `.crit-text-desktop`, `.crit-text-mobile` e `.btn-rubric-guidance-trigger` |
| **Versão no Topo** | `index.html` | Linha ~3289 | Atualizar texto para `📌 Versão 1.13 (v7.91)` |
| **Changelog Modal** | `index.html` | Linha ~4790 | Adicionar entrada da Versão 1.13 no topo de `#modalChangelog` |
| **Estrutura HTML do Modal** | `index.html` | Linhas ~6865 a 6980 | Remover completamente o elemento `<div id="modalRubricGuidance" ...>...</div>` |
| **Banco Pedagógico Artificial** | `index.html` | Linhas ~7701 a 8375 | Remover completamente `RUBRIC_GUIDANCE_DB`, `getCriterionGuidance()` e `formatCriterionMobileTitle()` |
| **Renderização de Card** | `index.html` | Linhas ~11420 a 11443 | Reverter `renderCriterionCard()` para estrutura pura sem wrappers adicionais |
| **Controladores JS do Modal** | `index.html` | Linhas ~17043 a 17122 | Remover funções `openRubricGuidanceModal()` e `closeRubricGuidanceModal()` |
| **Afunilamento de Indicadores** | `index.html` | Linhas ~18600 a 18610 | Remover `<button class="btn-rubric-drilldown-trigger">` |
| **Suíte de Testes (Módulo 4)** | `index.html` | Linhas ~21515 a 21655 | Substituir asserções de teste do Pilar 11 por validação de integridade canônica |
| **Catálogo CLI Auditoria** | `audit_platform.py` | Linha ~26 | Restaurar descrição oficial do Módulo 4 |
| **Histórico Changelog** | `CHANGELOG.md` | Topo do documento | Inserir Versão 1.13 no Sumário Executivo e no detalhamento |
| **Cópia Espelhada** | `firebase_deploy/public/index.html` | Arquivo completo | Espelhar exatamente o `index.html` da raiz |
| **Cópia de Backup** | `intermediárias/` | Nova cópia | Salvar `aplicativo_v113_remocao_orientacoes_artificiais_rubricas.html` |

---

## 3. Especificação de Implementação Passo a Passo

### 3.1 Remoção dos Estilos CSS
Localizar no bloco `<style>` de `index.html`:
```css
    .crit-text-desktop {
      display: inline;
    }
    .crit-text-mobile {
      display: none;
    }
    .crit-more-hint {
      color: var(--primary);
      font-weight: 700;
      cursor: pointer;
      text-decoration: underline;
      margin-left: 4px;
      white-space: nowrap;
    }
    .crit-top-actions {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
    }
    .btn-rubric-guidance-trigger {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: #EFF6FF;
      border: 1px solid #BFDBFE;
      color: #1D4ED8;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 8px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s ease-in-out;
      line-height: 1;
      user-select: none;
    }
    .btn-rubric-guidance-trigger:hover {
      background: #DBEAFE;
      border-color: #93C5FD;
      color: #1E40AF;
      transform: translateY(-1px);
    }
    .btn-rubric-guidance-trigger .info-icon {
      font-size: 12px;
    }
    .btn-rubric-drilldown-trigger {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #EFF6FF;
      border: 1px solid #BFDBFE;
      color: #1D4ED8;
      font-size: 11px;
      padding: 1px 4px;
      border-radius: 4px;
      cursor: pointer;
      line-height: 1;
      vertical-align: middle;
      margin-left: 4px;
      transition: all 0.15s ease;
    }
    .btn-rubric-drilldown-trigger:hover {
      background: #DBEAFE;
      border-color: #93C5FD;
    }
    .guidance-card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 10px 12px;
    }
```
**Substituir por:** (deletar os seletores acima, mantendo a regra `.crit-tag` logo abaixo de `.crit-text`).

E na media query `@media (max-width: 768px)`:
```css
      /* PILAR 11: Responsividade Mobile dos Cards de Critério */
      .crit-text-desktop {
        display: none !important;
      }
      .crit-text-mobile {
        display: inline !important;
      }
      .btn-rubric-guidance-trigger {
        padding: 5px 8px;
        font-size: 11px;
      }
      .rubric-guidance-panel {
        max-height: 85vh;
      }
```
**Substituir por:** (deletar completamente esse bloco).

---

### 3.2 Remoção da Estrutura HTML do Modal `#modalRubricGuidance`
Localizar e remover completamente o bloco:
```html
  <!-- =========================================================================
       PILAR 11: MODAL / BOTTOM SHEET DE ORIENTAÇÕES FORMATIVAS DE RUBRICAS
  ========================================================================== -->
  <div id="modalRubricGuidance" class="modal-backdrop mobile-bottom-sheet-backdrop" onclick="closeRubricGuidanceModal(event)">
    ...
  </div>
```

---

### 3.3 Remoção de `RUBRIC_GUIDANCE_DB`, `getCriterionGuidance()` e `formatCriterionMobileTitle()`
Remover completamente o bloco iniciando em:
```javascript
const RUBRIC_GUIDANCE_DB = {
...
};

function getCriterionGuidance(critId, evaluatedType = 'turma') {
...
}

function formatCriterionMobileTitle(crit) {
...
}
```
Garantindo que `SYNTHESIS_LEVELS` e `SYNTHESIS_MATERIALS` permaneçam intactos imediatamente abaixo.

---

### 3.4 Restauração de `renderCriterionCard()`
Na função `renderCriterionCard(crit, obsInstance)`:
```javascript
        const mobileText = formatCriterionMobileTitle(crit);

        let html = `
          <div class="crit-top">
            <div class="crit-text">
              <span class="crit-text-desktop">${crit.text}</span>
              <span class="crit-text-mobile">${mobileText}</span>
            </div>
            <div class="crit-top-actions">
              <button type="button" 
                      class="btn-rubric-guidance-trigger" 
                      onclick="openRubricGuidanceModal('${crit.id}', '${obsInstance.evaluatedType || 'turma'}'); event.stopPropagation();" 
                      title="Ver orientações pedagógicas, evidências e régua de gradação deste item"
                      aria-label="Orientações do Item ${crit.id}">
                <span class="info-icon">ℹ️</span>
                <span class="guidance-btn-text">Orientações</span>
              </button>
              <div class="crit-tag">Item ${crit.id}</div>
            </div>
          </div>
```
**Substituir por:**
```javascript
        let html = `
          <div class="crit-top">
            <div class="crit-text">${crit.text}</div>
            <div class="crit-tag">Item ${crit.id}</div>
          </div>
```

---

### 3.5 Remoção das Funções JS `openRubricGuidanceModal()` e `closeRubricGuidanceModal()`
Localizar e remover completamente as funções:
```javascript
    function openRubricGuidanceModal(critId, evaluatedType = 'turma') {
      ...
    }

    function closeRubricGuidanceModal(e) {
      ...
    }
```

---

### 3.6 Restauração no Afunilamento de Indicadores
Na sub-aba `drilldown` de `renderIndicatorsScreen()`:
```javascript
<div style="font-size:13px; color:var(--text-primary); flex:1; line-height:1.4;">
  <strong>[${crit.id}]</strong> ${crit.text}
  <button type="button" class="btn-rubric-drilldown-trigger" onclick="openRubricGuidanceModal('${crit.id}', '${targetType || 'professora'}'); event.stopPropagation();" title="Ver orientações formativas deste item">ℹ️ Apoio</button>
</div>
```
**Substituir por:**
```javascript
<div style="font-size:13px; color:var(--text-primary); flex:1; line-height:1.4;">
  <strong>[${crit.id}]</strong> ${crit.text}
</div>
```

---

## 4. Seção Obrigatória de Auditoria: Alterações, Adições e Exclusões

Para manter 100% de cobertura nos 12 módulos da plataforma sem regressões, as seguintes adaptações serão realizadas:

### 4.1 Exclusões no Módulo 4 (`rubricas_observacao`)
- **Exclusão:** Remover asserções que checavam a presença do elemento `#modalRubricGuidance` e seus sub-elementos (`#rubricGuidanceBreadcrumb`, etc.).
- **Exclusão:** Remover asserção que checava a presença de `.btn-rubric-guidance-trigger` no card do critério 1.1.1.
- **Exclusão:** Remover teste comportamental de abertura e fechamento interativo de `#modalRubricGuidance`.
- **Exclusão:** Remover teste de integridade do dicionário canônico `RUBRIC_GUIDANCE_DB`.
- **Exclusão:** Remover teste da função `formatCriterionMobileTitle`.

### 4.2 Adições no Módulo 4 (`rubricas_observacao`)
- **Adição:** Adicionar asserção explícita de conformidade e integridade canônica:
  ```javascript
  // Validação de Soberania da Matriz Curricular: Enunciado canônico integral sem botões artificiais
  const critCard111 = document.getElementById('crit-card-1.1.1');
  if (!critCard111) throw new Error('Card do critério 1.1.1 não renderizado');
  const artificialTrigger = critCard111.querySelector('.btn-rubric-guidance-trigger');
  if (artificialTrigger) {
    throw new Error('Falha: Gatilho artificial .btn-rubric-guidance-trigger ainda presente no card de critério');
  }
  const modalGuidanceCheck = document.getElementById('modalRubricGuidance');
  if (modalGuidanceCheck) {
    throw new Error('Falha: Modal artificial #modalRubricGuidance ainda presente no DOM');
  }
  const critTextEl = critCard111.querySelector('.crit-text');
  if (!critTextEl || !critTextEl.innerText.includes('Realiza perguntas abertas')) {
    throw new Error('Enunciado canônico oficial do critério 1.1.1 adulterado ou incompleto');
  }
  logger.log('Soberania da Matriz Oficial e Ausência de Gatilhos Artificiais nos Critérios', true);
  ```

### 4.3 Alterações no Script CLI `audit_platform.py`
- Em `MODULE_CATALOG['rubricas_observacao']`:
  Restaurar a nomenclatura oficial concisa:
  ```python
  'rubricas_observacao': 'Observação Ativa, Matrizes Curriculares, Rubricas e Pendências',
  ```

---

## 5. Critérios de Aceite e Roteiro de Validação

1. **Ausência de Gatilhos Artificiais no DOM:**
   - Nenhum botão `.btn-rubric-guidance-trigger` ou `.btn-rubric-drilldown-trigger` deve existir em qualquer tela.
2. **Ausência do Modal `#modalRubricGuidance`:**
   - Elemento `#modalRubricGuidance` não existe no DOM.
3. **Ausência do Objeto `RUBRIC_GUIDANCE_DB`:**
   - `typeof RUBRIC_GUIDANCE_DB === 'undefined'` e `typeof getCriterionGuidance === 'undefined'`.
4. **Fidelidade da Matriz Oficial:**
   - Critérios na observação ativa renderizam texto completo oficial (`crit.text`) sem links `(mais...)` ou truncamento.
5. **Auditoria Modular 100% Aprovada:**
   - `python3 audit_platform.py --silent-on-success` conclui com código de saída 0 (120/120 asserções válidas).
6. **Sincronização Completa:**
   - `index.html` e `firebase_deploy/public/index.html` são idênticos.
7. **Changelog Duplo Atualizado:**
   - Versão 1.13 documentada em `CHANGELOG.md` e em `#modalChangelog`.
