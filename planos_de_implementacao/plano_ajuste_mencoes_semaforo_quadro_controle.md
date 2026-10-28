# Plano de Implementação: Atualização de Rótulos de "Semáforo" para "Quadro de Controle Bimestral" na Aba de Diagnóstico / Painel

## 1. Contexto e Motivação
O quadro de acompanhamento longitudinal do ciclo anual foi oficialmente renomeado para **"Quadro de Controle Bimestral"** (em substituição à denominação informal e coloquial de "Semáforo"). No entanto, na tela de Índices para Diagnóstico (`#screenIndicators`), ainda remanescem botões, sub-abas e tooltips fazendo menção expressa a "Semáforo" (ex.: pílula de navegação `#pillIndLongitudinal`, botão de deep-link no Card 2 de cobertura e botão de deep-link no Card 3 da meta do ciclo anual).
O objetivo deste plano é uniformizar os textos visíveis, atributos de acessibilidade (`aria-label`) e tooltips (`title`), adotando terminologias claras e institucionais como "Quadro de Controle", "Quadro Bimestral" ou "Quadro de Controle Bimestral", mantendo a integridade funcional do motor e os testes de auditoria 100% aprovados.

---

## 2. Diagnóstico dos Pontos de Alteração

### 2.1. Navegação por Sub-abas em `index.html` (linha ~1100 a 1103)
**Atual:**
```html
<button type="button" class="indicators-icon-tab-btn indicators-subtab-pill" id="pillIndLongitudinal" onclick="switchIndicatorsSubTab('longitudinal')" title="Prazos & Turmas (Semáforo Bimestral)" aria-label="Prazos e Semáforo">
  <svg class="tab-icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
  <span class="tab-text" id="pillIndLongitudinalLabel">Prazos & Turmas (Semáforo)</span>
</button>
```
**Proposta:**
- `title`: `"Prazos & Turmas (Quadro de Controle Bimestral)"`
- `aria-label`: `"Prazos e Quadro de Controle"`
- `<span id="pillIndLongitudinalLabel">`: `"Prazos & Turmas (Quadro de Controle)"`

### 2.2. Botões de Deep-Link nos Cards de Indicadores em `js/features/indicators.js`
1. **Card 2 (Cobertura no Bimestre Corrente, linha ~2881):**
   - **Atual:**
     ```html
     <button type="button" class="btn-link" ... onclick="scrollToBimesterSemaphore()" title="Abrir o Quadro de Controle Bimestral de Turmas" ...>
       <svg ...>...</svg>
       <span>Semáforo ↓</span>
     </button>
     ```
   - **Proposta:**
     Substituir o rótulo `<span>Semáforo ↓</span>` por `<span>Quadro de Controle ↓</span>`.
2. **Card 3 (Meta do Ciclo Anual, linha ~2918):**
   - **Atual:**
     ```html
     <button type="button" class="btn-link" ... onclick="scrollToBimesterSemaphore()" title="Visualizar avanço do ciclo longitudinal das 4 observações anuais" ...>
       <svg ...>...</svg>
       <span>Ver Semáforo do Ciclo ↓</span>
     </button>
     ```
   - **Proposta:**
     Substituir o rótulo `<span>Ver Semáforo do Ciclo ↓</span>` por `<span>Ver Quadro de Controle ↓</span>`.

---

## 3. Preservação Arquitetural e Não-Regressão
- Os identificadores de funções internas (`scrollToBimesterSemaphore`, `filterSemaphoreByStatus`, `filterTeacherSemaphoreByStatus`, `renderSemaphorePillIconSvg`), seletores de DOM (`#bimesterSemaphoreSection`, classes `.sem-stat-card`, `.sem-pill-icon`) e propriedades de estado (`appState.activeSemaphoreStatusFilter`) serão mantidos inalterados para evitar quebras em integrações e preservar o contrato com a suíte de auditoria.
- A sincronização dinâmica de rótulo em `js/features/indicators.js` (onde `pillLongitudinalLabel.innerText = 'Acompanhamento Longitudinal'` ou `'Acompanhamento Geral'`) permanece funcionando em harmonia.

---

## 4. Alterações / Adições / Exclusões no Algoritmo de Auditoria (`audit_platform.py` / `audit_engine.js`)
- **Impacto na Suíte:** Nenhuma asserção de teste em `audit_engine.js` busca o texto exato `"Semáforo ↓"` ou `"Prazos & Turmas (Semáforo)"`. O Módulo 10 já valida:
  ```javascript
  if (!semTitleElem || semTitleElem.textContent.trim() !== 'Quadro de Controle Bimestral') { ... }
  ```
- **Ajustes necessários no motor de auditoria:** Nenhum. A conformidade do Módulo 10 já exige "Quadro de Controle Bimestral" como título de seção, de modo que a alteração dos botões e pílula na interface aumenta a coerência sem gerar atrito com os testes automatizados.
- **Validação pós-deploy:** Executar `python3 audit_platform.py --silent-on-success` para garantir 100% de aprovação nos 12 módulos.

---

## 5. Checklist de Execução Operacional (Etapa 2)
1. Modificar `index.html`: atualizar `title`, `aria-label` e o texto do `span#pillIndLongitudinalLabel`.
2. Modificar `js/features/indicators.js`: atualizar os textos dos botões de atalho nos cards de KPI (`Quadro de Controle ↓` e `Ver Quadro de Controle ↓`).
3. Sincronizar o espelho `firebase_deploy/public/index.html`.
4. Atualizar o `CHANGELOG.md` e o `#modalChangelog` em `index.html` (e espelho).
5. Criar backup em `intermediárias/aplicativo_v[N]_[descrição].html`.
6. Validar a sintaxe do JS com `python3 audit_platform.py --check-syntax`.
7. Checagem de concorrência Git e deploy via `git push origin main`.
8. Executar auditoria headless pós-deploy `python3 audit_platform.py --silent-on-success`.
