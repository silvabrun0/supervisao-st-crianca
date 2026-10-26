# Plano de Implementação: Modificação Estrita de "Afunilamento por Dimensão" para "Visualização por Dimensão"

---

## 0. Diretriz de Execução (Obrigatória para o Operário - Etapa 2)
> [!IMPORTANT]
> **Leitura Prévia Obrigatória:** Antes de executar qualquer ação deste plano, o assistente na **Etapa 2 (O Operário)** DEVE consultar e seguir rigorosamente:
> 1. [WORKFLOW_MACOS.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md)
> 2. [WORKFLOW_GITHUB.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_GITHUB.md)
> 3. [.agents/skills/execucao-operario/SKILL.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/.agents/skills/execucao-operario/SKILL.md)
> 4. [.agents/skills/auditoria-plataforma/SKILL.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/.agents/skills/auditoria-plataforma/SKILL.md)
>
> **Trava de Escopo Fechado:** Este plano restringe-se **exclusivamente** à substituição terminológica de "Afunilamento por Dimensão" (e termos associados no fluxo de navegação e exibição) por "Visualização por Dimensão". Nenhuma outra funcionalidade, refatoração estrutural ou estilização alheia deve ser adicionada.

---

## 1. Diagnóstico e Contexto

### 1.1 Contexto e Justificativa Pedagógica
Na aba de **Indicadores** da plataforma *SerTão Criança*, a terceira sub-aba de navegação segmentada (`#pillIndDrilldown`) apresenta a visualização hierárquica completa da matriz pedagógica (Dimensões ➔ Subdimensões ➔ Variáveis Avaliativas) acompanhada da régua de benchmark comparativo com a Rede Municipal de Patos (Pilar 3).

Historicamente, essa sub-aba recebia a denominação técnica de **"Afunilamento por Dimensão"** (alusão ao conceito estatístico de *drill-down*). Contudo, no diálogo pedagógico formativo com coordenadoras, formadoras e gestores do Núcleo de Educação Infantil, a terminologia "afunilamento" soa artificial e técnica. O termo **"Visualização por Dimensão"** descreve de forma direta, clara e intuitiva o propósito exato da ferramenta: permitir a visualização discriminada dos resultados pedagógicos dimensão por dimensão.

### 1.2 Delimitação Estrita do Escopo
A solicitação do usuário determina categoricamente:
> *"crie um plano que **somente** modifique 'afunilamento por dimensão' para 'visualização por dimensão'"*

Portanto, o plano não altera regras de cálculo, não introduz novas tabelas ou filtros adicionais, e preserva integralmente o comportamento individualizado (quando um docente específico é selecionado, a sub-aba mantém contextualmente o rótulo "Raio-X Item a Item").

---

## 2. Arquitetura e Mapeamento de Pontos de Impacto

Os pontos de impacto estão localizados no arquivo principal [index.html](file:///Users/bruno/Desktop/gestor%20supervisao_patos/index.html) e devem ser espelhados em [firebase_deploy/public/index.html](file:///Users/bruno/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html):

| # | Ponto de Impacto | Localização / Seletor | Situação Atual | Situação Pretendida |
|---|-------------------|------------------------|----------------|---------------------|
| 1 | Pílula da Sub-aba no DOM estático | `#pillIndDrilldown` (~linha 4467) | `title="Matriz de Critérios Item a Item"` ou `"Afunilamento por Dimensão"` | `title="Visualização por Dimensão"` `aria-label="Visualização por Dimensão"` |
| 2 | Rótulo de texto da Pílula estática | `#pillIndDrilldownLabel` (~linha 4469) | `Matriz de Critérios` ou `Afunilamento` | `Visualização por Dimensão` |
| 3 | Sincronização dinâmica no Escopo Geral (`ALL`) | `renderIndicatorsScreen` (~linha 19964) | `pillDrilldownLabel.innerText = 'Afunilamento por Dimensão'` | `pillDrilldownLabel.innerText = 'Visualização por Dimensão'` |
| 4 | Título principal da Seção Drilldown | `#indicatorsSectionDrilldown h3` (~linha 20840) | `Afunilamento de Indicadores Pedagógicos (...)` | `Visualização por Dimensão dos Indicadores Pedagógicos (...)` |
| 5 | Texto informativo no modal de filtros mobile | `#modalMobileIndicatorsFilters p` (~linha 7440) | `...recalcular instantaneamente os índices e o afunilamento.` | `...recalcular instantaneamente os índices e a visualização por dimensão.` |
| 6 | Ação de Deep-Linking (Botão no Card de Gargalo) | `bottleneck-actions-row` (~linha 19012-19014) | `title="...na árvore completa de Afunilamento..."` e `🔍 Ver no Afunilamento` | `title="...na árvore completa de Visualização por Dimensão..."` e `🔍 Ver na Visualização por Dimensão` |
| 7 | Notificação Toast de Deep-Linking | `locateBottleneckCriterionInDrilldown` (~linha 18865) | `showToast('Critério [...] expandido no Afunilamento.')` | `showToast('Critério [...] expandido na Visualização por Dimensão.')` |
| 8 | Testes Automatizados In-App | Módulo `indicadores_decisao` (~linha 25199 e 25235) | Mensagens de erro e asserções mencionando "Afunilamento" | Atualização léxica para "Visualização por Dimensão" e asserção explícita do rótulo |

---

## 3. Especificação de Implementação Passo a Passo

### Passo 1: Atualização da Pílula HTML da Sub-aba (`#pillIndDrilldown`)
Em `index.html` (~linhas 4467-4470):

**Antes:**
```html
        <button type="button" class="indicators-icon-tab-btn indicators-subtab-pill" id="pillIndDrilldown" onclick="switchIndicatorsSubTab('drilldown')" title="Matriz de Critérios Item a Item" aria-label="Matriz de Critérios">
          <span class="tab-icon">🔍</span>
          <span class="tab-text" id="pillIndDrilldownLabel">Matriz de Critérios</span>
        </button>
```

**Depois:**
```html
        <button type="button" class="indicators-icon-tab-btn indicators-subtab-pill" id="pillIndDrilldown" onclick="switchIndicatorsSubTab('drilldown')" title="Visualização por Dimensão" aria-label="Visualização por Dimensão">
          <span class="tab-icon">🔍</span>
          <span class="tab-text" id="pillIndDrilldownLabel">Visualização por Dimensão</span>
        </button>
```

---

### Passo 2: Atualização da Sincronização Dinâmica em `renderIndicatorsScreen`
Em `index.html` (~linhas 19962-19966):

**Antes:**
```javascript
      } else {
        if (pillKpisLabel) pillKpisLabel.innerText = 'Índices Gerais & KPIs';
        if (pillDrilldownLabel) pillDrilldownLabel.innerText = 'Afunilamento por Dimensão';
        if (pillLongitudinalLabel) pillLongitudinalLabel.innerText = 'Acompanhamento Longitudinal';
      }
```

**Depois:**
```javascript
      } else {
        if (pillKpisLabel) pillKpisLabel.innerText = 'Índices Gerais & KPIs';
        if (pillDrilldownLabel) pillDrilldownLabel.innerText = 'Visualização por Dimensão';
        if (pillLongitudinalLabel) pillLongitudinalLabel.innerText = 'Acompanhamento Longitudinal';
      }
```

*(Nota: O ramo `if (activeMemberFilter !== 'ALL')` permanece intocado com `'Raio-X Item a Item'`)*.

---

### Passo 3: Atualização do Cabeçalho da Seção `#indicatorsSectionDrilldown`
Em `index.html` (~linhas 20839-20842):

**Antes:**
```javascript
              <h3 style="font-size:17px; font-weight:800; color:var(--primary-dark);">
                Afunilamento de Indicadores Pedagógicos (${targetType === 'coordenador' ? 'Coordenação' : 'Docência'})
              </h3>
```

**Depois:**
```javascript
              <h3 style="font-size:17px; font-weight:800; color:var(--primary-dark);">
                Visualização por Dimensão dos Indicadores Pedagógicos (${targetType === 'coordenador' ? 'Coordenação' : 'Docência'})
              </h3>
```

---

### Passo 4: Atualização do Texto de Apoio no Modal de Filtros Mobile
Em `index.html` (~linha 7440):

**Antes:**
```html
      <p style="margin:0 0 16px 0; font-size:12px; color:var(--text-secondary);">
        Defina a unidade, turma ou docente e o bimestre para recalcular instantaneamente os índices e o afunilamento.
      </p>
```

**Depois:**
```html
      <p style="margin:0 0 16px 0; font-size:12px; color:var(--text-secondary);">
        Defina a unidade, turma ou docente e o bimestre para recalcular instantaneamente os índices e a visualização por dimensão.
      </p>
```

---

### Passo 5: Atualização do Botão de Deep-Linking e Toast de Notificação
Em `index.html` (~linhas 18864-18866 e 19011-19015):

**Em `locateBottleneckCriterionInDrilldown`:**
**Antes:**
```javascript
          if (typeof showToast === 'function') {
            showToast(`Critério [${critId}] expandido no Afunilamento.`);
          }
```
**Depois:**
```javascript
          if (typeof showToast === 'function') {
            showToast(`Critério [${critId}] expandido na Visualização por Dimensão.`);
          }
```

**No Card de Gargalos Pedagógicos (Pilar 8):**
**Antes:**
```html
                <button type="button" class="btn btn-secondary" style="font-size:11px; padding:5px 10px; display:inline-flex; align-items:center; gap:4px; font-weight:700;" onclick="locateBottleneckCriterionInDrilldown('${b.critId}', ${b.dimIndex}, '${b.subKey}')" title="Abrir este critério na árvore completa de Afunilamento com régua dupla">
                  🔍 Ver no Afunilamento
                </button>
```
**Depois:**
```html
                <button type="button" class="btn btn-secondary" style="font-size:11px; padding:5px 10px; display:inline-flex; align-items:center; gap:4px; font-weight:700;" onclick="locateBottleneckCriterionInDrilldown('${b.critId}', ${b.dimIndex}, '${b.subKey}')" title="Abrir este critério na árvore completa de Visualização por Dimensão com régua dupla">
                  🔍 Ver na Visualização por Dimensão
                </button>
```

---

### Passo 6: Atualização da Asserção no Módulo In-App de Auditoria (`indicadores_decisao`)
Em `index.html` (~linhas 25255-25265):

**Antes:**
```javascript
              // Alternância interativa de sub-abas
              switchIndicatorsSubTab('kpis');
              switchIndicatorsSubTab('drilldown');
              const drillSection = document.getElementById('indicatorsSectionDrilldown');
              if (!drillSection || drillSection.style.display !== 'block') {
                throw new Error('Sub-aba de Afunilamento não ativada corretamente');
              }

              const infoBar = drillSection.querySelector('.benchmark-info-bar');
              if (!infoBar) throw new Error('.benchmark-info-bar ausente na sub-aba Afunilamento');
              logger.log('Renderização da Régua Dupla e Banner de Benchmark no DOM (Pilar 3)', true);
```

**Depois:**
```javascript
              // Alternância interativa de sub-abas e validação da nova nomenclatura
              switchIndicatorsSubTab('kpis');
              switchIndicatorsSubTab('drilldown');
              const drillSection = document.getElementById('indicatorsSectionDrilldown');
              if (!drillSection || drillSection.style.display !== 'block') {
                throw new Error('Sub-aba de Visualização por Dimensão não ativada corretamente');
              }

              const pillLabel = document.getElementById('pillIndDrilldownLabel');
              if (!pillLabel || pillLabel.innerText !== 'Visualização por Dimensão') {
                throw new Error(`Rótulo da sub-aba divergente: esperado 'Visualização por Dimensão', obtido '${pillLabel ? pillLabel.innerText : 'null'}'`);
              }
              logger.log("Asserção de Nomenclatura da Sub-aba: 'Visualização por Dimensão' (#pillIndDrilldownLabel)", true);

              const infoBar = drillSection.querySelector('.benchmark-info-bar');
              if (!infoBar) throw new Error('.benchmark-info-bar ausente na sub-aba Visualização por Dimensão');
              logger.log('Renderização da Régua Dupla e Banner de Benchmark no DOM (Pilar 3)', true);
```

---

### Passo 7: Sincronização Obrigatória do Arquivo Espelhado
Copiar fielmente as alterações de:
`gestor supervisao_patos/index.html`
para:
`gestor supervisao_patos/firebase_deploy/public/index.html`

---

## 4. Critérios de Aceite e Roteiro de Teste

### 4.1 Critérios de Aceite
1. **Rótulo Visível da Sub-aba:** Na aba Indicadores, sob o escopo geral (`activeMemberFilter === 'ALL'`), o terceiro botão exibe exatamente o texto **"Visualização por Dimensão"**.
2. **Preservação de Contexto Individual:** Ao filtrar por um professor específico, o rótulo do terceiro botão torna-se contextualmente **"Raio-X Item a Item"** (sem quebras de layout).
3. **Cabeçalho Interno:** Ao selecionar a sub-aba, o título do bloco `#indicatorsSectionDrilldown` exibe **"Visualização por Dimensão dos Indicadores Pedagógicos (Docência)"** (ou Coordenação).
4. **Deep-Linking e Ações:** O botão no card de gargalos exibe **"🔍 Ver na Visualização por Dimensão"** e ao ser clicado expande o critério exibindo o toast correto.
5. **Validação Sintática JSC (macOS):** `python3 audit_platform.py --check-syntax` executado com 100% de aprovação.
6. **Auditoria Automatizada Headless (Pós-Deploy):** `python3 audit_platform.py --silent-on-success` executado com aprovação integral (12/12 módulos verdes).

### 4.2 Roteiro de Teste Mecânico Pré-Deploy
1. Rodar `python3 audit_platform.py --check-syntax` e verificar saída `✅ Sintaxe do JavaScript em 'index.html' validada com sucesso via JavaScriptCore (macOS)`.
2. Verificar diff estrito: `git diff index.html` deve conter unicamente as alterações de texto especificadas, sem alterações colaterais.

---

## 5. Seção Obrigatória de Auditoria (`audit_platform.py` e Testes In-App)

### 5.1 Alterações / Adições / Exclusões no Algoritmo de Auditoria (`audit_platform.py`)
- **No arquivo Python (`audit_platform.py`):**
  - *Nenhuma alteração necessária*: O script atua como orquestrador HTTP headless dos testes e não possui strings acopladas a "afunilamento".
- **No Módulo In-App de Testes (`indicadores_decisao` em `index.html`):**
  - **Adição:** Inclusão de asserção estrita checando `document.getElementById('pillIndDrilldownLabel').innerText === 'Visualização por Dimensão'`.
  - **Alteração:** Atualização das mensagens descritivas de falha (`throw new Error`) e dos logs do `logger.log` de "Sub-aba de Afunilamento" para "Sub-aba de Visualização por Dimensão".
  - **Exclusão:** Nenhuma asserção pedagógica foi removida; toda a validação de cálculo de benchmark, deltas, réguas duplas e deep-linking permanece 100% ativa.
