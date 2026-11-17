# Plano de Implementação: Harmonização das Asserções da Auditoria (v1.71)

> **Data:** 03 de Novembro de 2026  
> **Status:** Pronto para Aprovação (Etapa 1 - O Arquiteto)  
> **Escopo:** Motor de Auditoria (`js/audit/audit_engine.js`) e Sincronização de Estado de Referencial em Mudança de Escopo (`js/features/indicators.js`)  
> **Auditoria:** Harmonização das asserções dos módulos `navegacao_layout` e `indicadores_decisao` para restabelecer 100% de aprovação (203/203).

---

## 1. Diagnóstico das Duas Falhas Identificadas

### 1.1. Falha 1: Módulo `navegacao_layout` (Item de Versão no Header)
- **Causa Raiz:** No teste do cabeçalho em `js/audit/audit_engine.js` (linha ~3658), o validador confere se o botão `.btn-changelog` contém uma versão permitida através de uma lista fixa de versões antigas:
  ```javascript
  if (!btnChangelog.textContent.includes('Versão 1.62') && !btnChangelog.textContent.includes('Versão 1.68') && !btnChangelog.textContent.includes('Versão 1.69') && !btnChangelog.textContent.includes('Versão 1.70')) {
    throw new Error(`Botão de versão desatualizado: "${btnChangelog.textContent.trim()}"`);
  }
  ```
- **Problema:** Com a entrega da Versão 1.71, o texto passou a ser `Versão 1.71 (v8.2.37)`. Como a lista estática não continha `'Versão 1.71'`, a asserção gerou falso positivo de "botão desatualizado".
- **Solução:** Atualizar o validador para reconhecer `'Versão 1.71'` (ou validar o padrão semântico regex `Versão 1\.\d+`).

---

### 1.2. Falha 2: Módulo `indicadores_decisao` (Item 24.2 - Foco em UE para Helena)
- **Causa Raiz:** 
  1. Durante o teste 24, a usuária é alternada para Helena e o seletor de foco territorial passa por:
     - `POLO:Polo Regional 2 (Sul)` ➔ nesta fase, como é um polo territorial, o referencial é forçado para `'rede'` e gravado em `appState.indicatorsBenchmark = 'rede'`.
  2. Em seguida, o teste 24.2 seleciona diretamente no DOM a unidade:
     - `deskUnitSelectEl.value = 'CEI Vovó Zezé'; renderIndicatorsScreen();`
  3. No código de `renderIndicatorsScreen()`, ao focar uma UE, o sistema verificava:
     ```javascript
     if (appState.indicatorsBenchmark === 'rede') {
       activeBenchmarkChoice = 'rede';
     } else {
       activeBenchmarkChoice = 'polo';
     }
     ```
     Como `appState.indicatorsBenchmark` havia ficado retido com `'rede'` do passo anterior (quando Helena olhava o Polo vs. Rede), a renderização manteve a comparação com a Rede Municipal em vez de adotar `'polo'` como referencial padrão ao focar uma escola, o que gerou o banner `Referencial da Rede Municipal` ao invés de `Referencial do Polo Regional`.
- **Solução:**
  1. No motor de interface (`js/features/indicators.js`): em `onIndicatorsUnitChange()` e ao mudar de unidade (ou quando `rawUnitFilter` muda de tipo para unidade sem que o usuário tenha explicitamente escolhido a rede), garantir que a seleção de uma escola redefina o padrão de benchmark para `'polo'` para perfis com visão flexível (Formador e Núcleo), a menos que o seletor esteja explicitamente com outro valor.
  2. Na suíte de testes (`js/audit/audit_engine.js`): no item 24.2, certificar que a suíte aciona o evento `onIndicatorsUnitChange()` ou define o seletor de benchmark para `'polo'` antes de validar o banner do Polo Regional, garantindo a validação da alternância.

---

## 2. Especificação Passo a Passo das Modificações

### Passo 1: Ajuste em `js/features/indicators.js` (Reset do Referencial ao Focar Unidade)
Em `onIndicatorsUnitChange()`, quando o usuário altera a unidade escolar no seletor:
```javascript
function onIndicatorsUnitChange() {
  const memberSelect = document.getElementById('indicatorsMemberFilter');
  if (memberSelect) memberSelect.value = 'ALL';
  const unitSelect = document.getElementById('indicatorsUnitFilter');
  const rawUnit = unitSelect ? unitSelect.value : 'ALL';
  // Ao focar uma UE específica, restaura o referencial padrão do Polo Regional
  if (rawUnit && rawUnit !== 'ALL' && !rawUnit.startsWith('POLO:')) {
    appState.indicatorsBenchmark = 'polo';
    const benchSelect = document.getElementById('indicatorsBenchmarkFilter');
    if (benchSelect) benchSelect.value = 'polo';
  }
  renderIndicatorsScreen();
}
```
E em `renderIndicatorsScreen()`, quando Helena ou Clarice transitam para uma unidade pela primeira vez (ou quando `appState.indicatorsBenchmark` não foi explicitamente setado para rede durante o foco na UE):
Garantir que se `rawUnitFilter` for uma UE e o seletor ainda não tiver sofrido interação de rede, o padrão `'polo'` prevaleça.

---

### Passo 2: Ajuste em `js/audit/audit_engine.js`

#### 2.1. No Módulo `navegacao_layout`:
Adicionar `'Versão 1.71'` à verificação do botão `.btn-changelog`:
```javascript
if (!btnChangelog.textContent.includes('Versão 1.62') && 
    !btnChangelog.textContent.includes('Versão 1.68') && 
    !btnChangelog.textContent.includes('Versão 1.69') && 
    !btnChangelog.textContent.includes('Versão 1.70') &&
    !btnChangelog.textContent.includes('Versão 1.71')) {
  throw new Error(`Botão de versão desatualizado: "${btnChangelog.textContent.trim()}"`);
}
```

#### 2.2. No Módulo `indicadores_decisao` (Item 24.2):
Garantir que após alterar `deskUnitSelectEl.value = 'CEI Vovó Zezé'`, chame `onIndicatorsUnitChange()` (simulando a ação real do usuário ao trocar o dropdown) e valide também a capacidade de alternar para a Rede via novo seletor de benchmark:
```javascript
// 24.2 Asserção Dual: Helena selecionando Unidade vs. Respectivo Polo
deskUnitSelectEl.value = 'CEI Vovó Zezé';
onIndicatorsUnitChange();
const benchInfoBarUEPolo = document.querySelector('.benchmark-info-bar');
if (!benchInfoBarUEPolo || !benchInfoBarUEPolo.innerText.includes('Referencial do Polo Regional') || !benchInfoBarUEPolo.innerText.includes('CEI Vovó Zezé') || !benchInfoBarUEPolo.innerText.includes('Polo Regional 2 (Sul)')) {
  throw new Error(`Falha Arquitetura Dual: Esperado banner de UE CEI Vovó Zezé vs. seu Polo Regional 2 (Sul). Obtido: "${benchInfoBarUEPolo?.innerText}"`);
}
```

---

## 3. Alterações no Algoritmo de Auditoria (`audit_platform.py` / `audit_engine.js`)

- **`audit_platform.py`:** Nenhuma alteração.
- **`js/audit/audit_engine.js`:**
  - Inclusão do token `'Versão 1.71'` na validação do botão de versão do cabeçalho.
  - Invocação de `onIndicatorsUnitChange()` no item 24.2 para disparar o ciclo real de eventos da plataforma ao mudar de unidade.

---

## 4. Checklist da Etapa 2 (Operário)
- [ ] Aplicar ajuste em `js/features/indicators.js`.
- [ ] Aplicar atualização em `js/audit/audit_engine.js`.
- [ ] Validar sintaxe JSC: `python3 audit_platform.py --check-syntax`.
- [ ] Replicar para `firebase_deploy/public/`.
- [ ] Executar auditoria headless pós-deploy: `python3 audit_platform.py --silent-on-success` e confirmar 203/203 (100% de aprovação).
