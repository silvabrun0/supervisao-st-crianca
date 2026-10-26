# Plano de Implementação: Substituição do Termo "Benchmark" por "Referencial da Rede Municipal"

---

## 0. Diretriz de Execução (Obrigatória para o Operário - Etapa 2)
> [!IMPORTANT]
> **Leitura Prévia Obrigatória:** Antes de executar qualquer ação deste plano, o assistente na **Etapa 2 (O Operário)** DEVE consultar e seguir rigorosamente:
> 1. [WORKFLOW_MACOS.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md)
> 2. [WORKFLOW_GITHUB.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_GITHUB.md)
> 3. [.agents/skills/execucao-operario/SKILL.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/.agents/skills/execucao-operario/SKILL.md)
> 4. [.agents/skills/auditoria-plataforma/SKILL.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/.agents/skills/auditoria-plataforma/SKILL.md)
>
> **Trava de Escopo Fechado:** Este plano restringe-se **estritamente** à higienização terminológica do jargão corporativo "Benchmark", substituindo-o por expressões canônicas pedagógicas ("Referencial da Rede Municipal" e "Referencial comparativo"), sem alterar a lógica estatística, as fórmulas do Delta ($\Delta \pm\%$), as cores de criticidade ou a integridade dos dados cadastrais e avaliativos.

---

## 1. Diagnóstico e Contexto

### 1.1 Contexto e Justificativa Pedagógica
Na plataforma *SerTão Criança*, a sub-aba de navegação segmentada **"Visualização por Dimensão"** (`#indicatorsSectionDrilldown`) apresenta a árvore hierárquica das rubricas pedagógicas acompanhada de réguas comparativas entre a unidade/polo e a média geral apurada na rede municipal de Patos.

Historicamente, essa funcionalidade herdou a nomenclatura corporativa/empresarial de **"Benchmark"** (ex: *"Benchmark Ativo"*, *"Benchmark comparativo item a item"*, *"Sem benchmark"*). No ambiente formativo da Educação Infantil municipal de Patos/PB, o termo em inglês soa distante da linguagem pedagógica de coordenadoras, formadoras e professoras.

A substituição de *"Benchmark"* por **"Referencial da Rede Municipal"** preserva integralmente a rica comparação estatística de apoio à decisão (permitindo identificar onde a escola precisa de maior suporte formativo), ao mesmo tempo em que humaniza e contextualiza a ferramenta sob uma perspectiva dialógica e pedagógica.

### 1.2 Delimitação do Escopo
1. Substituir no subtítulo da seção `#indicatorsSectionDrilldown` o texto *"Benchmark comparativo..."* por *"Referencial comparativo..."*.
2. Substituir no banner informativo superior (`.benchmark-info-bar`) a menção *"Benchmark Ativo:"* por *"Referencial da Rede Municipal:"*.
3. Substituir no gerador de texto para área de transferência (`copyMeetingAgendaToClipboard`) o fallback `'Sem benchmark'` por `'Sem referencial municipal'`.
4. Preservar as classes CSS (ex: `.benchmark-info-bar`, `.benchmark-ruler-row`) para garantir compatibilidade de estilização e impedir efeitos colaterais de layout.
5. Atualizar os testes automatizados in-app (Módulo 10: `indicadores_decisao`) com asserção negativa contra a presença residual do termo "Benchmark" e asserção positiva da presença de "Referencial da Rede Municipal".

---

## 2. Arquitetura e Mapeamento de Pontos de Impacto

Os pontos de impacto estão localizados no arquivo principal [index.html](file:///Users/bruno/Desktop/gestor%20supervisao_patos/index.html) e devem ser espelhados em [firebase_deploy/public/index.html](file:///Users/bruno/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html):

| # | Ponto de Impacto | Localização / Função | Situação Atual | Situação Pretendida |
|---|-------------------|----------------------|----------------|---------------------|
| 1 | Subtítulo da Visualização por Dimensão | `renderIndicatorsScreen` (~linha 20920) | `Benchmark comparativo item a item entre a sua Unidade Escolar e a Média da Rede Municipal de Patos` | `Referencial comparativo item a item entre a sua Unidade Escolar e a Média da Rede Municipal de Patos` |
| 2 | Banner Informativo de Contexto | `renderIndicatorsScreen` (~linha 20930) | `<strong>Benchmark Ativo:</strong> Comparando <strong>${scopeLabelText}</strong> contra a <strong>Média Geral da Rede Municipal...</strong>` | `<strong>Referencial da Rede Municipal:</strong> Comparando <strong>${scopeLabelText}</strong> com a <strong>Média Geral da Rede Municipal...</strong>` |
| 3 | Fallback no Texto da Pauta de Reunião | `copyMeetingAgendaToClipboard` (~linha 18957) | `b.delta !== null ? ... : 'Sem benchmark'` | `b.delta !== null ? ... : 'Sem referencial municipal'` |
| 4 | Asserção e Validação no Diagnóstico In-App | `runPlatformSelfAudit` (`indicadores_decisao`, ~linhas 25514-25517) | `logger.log('Renderização da Régua Dupla e Banner de Benchmark no DOM (Pilar 3)', true);` | Asserção negativa para ausência de "Benchmark" no banner + asserção positiva para presença de "Referencial da Rede Municipal" |
| 5 | Changelog Duplo e Botão de Versão | `CHANGELOG.md` e `#modalChangelog` / `.btn-changelog` | Versão 1.29 | Atualização para Versão 1.30 |

---

## 3. Especificação de Implementação Passo a Passo (Etapa 2)

### Passo 1: Atualização do Subtítulo e Banner na Sub-aba "Visualização por Dimensão"
Em `index.html` (aproximadamente linhas 20919 a 20932):

**Antes:**
```html
              <p style="font-size:12px; color:var(--text-secondary);">
                Benchmark comparativo item a item entre a sua Unidade Escolar e a Média da Rede Municipal de Patos
              </p>
            </div>
          </div>

          <!-- Banner Informativo de Contexto do Benchmark -->
          <div class="benchmark-info-bar">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:16px;">🏛️</span>
              <span>
                <strong>Benchmark Ativo:</strong> Comparando <strong>${scopeLabelText}</strong> contra a <strong>Média Geral da Rede Municipal (${redeObs.length} observação(ões) na base)</strong>.
              </span>
            </div>
```

**Depois:**
```html
              <p style="font-size:12px; color:var(--text-secondary);">
                Referencial comparativo item a item entre a sua Unidade Escolar e a Média da Rede Municipal de Patos
              </p>
            </div>
          </div>

          <!-- Banner Informativo de Contexto do Referencial da Rede Municipal -->
          <div class="benchmark-info-bar">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:16px;">🏛️</span>
              <span>
                <strong>Referencial da Rede Municipal:</strong> Comparando <strong>${scopeLabelText}</strong> com a <strong>Média Geral da Rede Municipal (${redeObs.length} observação(ões) na base)</strong>.
              </span>
            </div>
```

---

### Passo 2: Atualização do Fallback na Cópia da Pauta de Reunião
Em `index.html` na função `copyMeetingAgendaToClipboard` (aproximadamente linha 18957):

**Antes:**
```javascript
      bottlenecks.forEach((b, idx) => {
        const rank = idx + 1;
        const deltaText = b.delta !== null ? `${b.delta > 0 ? '+' : ''}${b.delta}% vs. Rede Patos` : 'Sem benchmark';
        text += `${rank}. [${b.critId}] ${b.critText}\n`;
```

**Depois:**
```javascript
      bottlenecks.forEach((b, idx) => {
        const rank = idx + 1;
        const deltaText = b.delta !== null ? `${b.delta > 0 ? '+' : ''}${b.delta}% vs. Rede Patos` : 'Sem referencial municipal';
        text += `${rank}. [${b.critId}] ${b.critText}\n`;
```

---

### Passo 3: Atualização dos Testes Automatizados no Módulo `indicadores_decisao`
Em `index.html` na função `runPlatformSelfAudit()`, sob o módulo `indicadores_decisao` (aproximadamente linhas 25514 a 25517):

**Antes:**
```javascript
              const infoBar = drillSection.querySelector('.benchmark-info-bar');
              if (!infoBar) throw new Error('.benchmark-info-bar ausente na sub-aba Visualização por Dimensão');
              logger.log('Renderização da Régua Dupla e Banner de Benchmark no DOM (Pilar 3)', true);
```

**Depois:**
```javascript
              const infoBar = drillSection.querySelector('.benchmark-info-bar');
              if (!infoBar) throw new Error('.benchmark-info-bar ausente na sub-aba Visualização por Dimensão');
              if (infoBar.innerText.includes('Benchmark')) {
                throw new Error("Termo residual 'Benchmark' ainda presente no banner informativo da Visualização por Dimensão");
              }
              if (!infoBar.innerText.includes('Referencial da Rede Municipal')) {
                throw new Error("Rótulo pedagógico 'Referencial da Rede Municipal' não encontrado no banner informativo");
              }
              logger.log("Higienização e Renderização do Banner 'Referencial da Rede Municipal' no DOM (Pilar 3)", true);
```

---

### Passo 4: Atualização da Versão e Registro de Changelog Duplo (Versão 1.30)
1. **No topo do `index.html` (botão `.btn-changelog`):**
   - Atualizar o rótulo para: `📌 Versão 1.30`.

2. **No modal `#modalChangelog` em `index.html`:**
   - Inserir no topo da listagem de versões:
```html
      <!-- VERSÃO 1.30 - HIGIENIZAÇÃO TERMINOLÓGICA: SUBSTITUIÇÃO DE BENCHMARK POR REFERENCIAL DA REDE MUNICIPAL -->
      <div class="card" style="margin-bottom:16px; border-left:4px solid #10B981;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span style="font-weight:800; font-size:14px; color:var(--text-primary);">📌 Versão 1.30</span>
          <span style="font-size:11px; color:var(--text-secondary); background:#F1F5F9; padding:2px 8px; border-radius:12px;">26/10/2026</span>
        </div>
        <div style="font-size:12px; font-weight:700; color:var(--text-primary); margin-bottom:6px;">
          Higienização Terminológica Pedagógica na Visualização por Dimensão:
        </div>
        <ul style="font-size:12px; color:var(--text-secondary); margin:0; padding-left:18px; line-height:1.5;">
          <li>🏛️ <strong>Substituição do Termo Corporativo "Benchmark":</strong> Eliminação definitiva da expressão empresarial em inglês no topo da sub-aba Visualização por Dimensão e na pauta diagnóstica, substituindo-a pelos termos canônicos <code>Referencial da Rede Municipal</code> e <code>Referencial comparativo</code>.</li>
          <li>🎯 <strong>Preservação Integral da Potência Estatística e Decisória:</strong> Manutenção inalterada de todos os cálculos matemáticos do Delta ($\Delta \pm\%$), das réguas comparativas por nível hierárquico e da identificação de prioridades formativas da equipe.</li>
          <li>🔬 <strong>Auditoria Contínua com 100% de Aprovação:</strong> Fortalecimento do módulo <code>indicadores_decisao</code> com asserção negativa contra o termo residual "Benchmark" e validação estrita da nova rotulagem pedagógica.</li>
        </ul>
      </div>
```

3. **No arquivo `CHANGELOG.md`:**
   - Adicionar a nova linha na tabela do *Sumário Executivo de Versões*:
```markdown
| **1.30** | 26/10/2026 17:30 | `intermediárias/aplicativo_v130_substituicao_benchmark_por_referencial_rede.html` | Solicitação direta / `planos_de_implementacao/plano_substituicao_benchmark_por_referencial_rede.md` | Higienização terminológica pedagógica na Visualização por Dimensão, substituindo o termo corporativo 'Benchmark' por 'Referencial da Rede Municipal' no banner contextual, subtítulo e pauta diagnóstica, preservando fórmulas de Delta e auditoria com asserções estritas 🏛️🧹 |
```
   - Adicionar o detalhamento correspondente na seção de versões.

---

### Passo 5: Sincronização de Cópias Espelhadas
Sincronizar integralmente as alterações entre:
- `index.html` (raiz)
- `gestor supervisao_patos/index.html`
- `gestor supervisao_patos/firebase_deploy/public/index.html`

---

## 4. Critérios de Aceite e Roteiro de Teste

### Checklist de Aceite
- [ ] O subtítulo em `#indicatorsSectionDrilldown` exibe exatamente: `Referencial comparativo item a item entre a sua Unidade Escolar e a Média da Rede Municipal de Patos`.
- [ ] O banner superior verde (`.benchmark-info-bar`) exibe exatamente: `Referencial da Rede Municipal: Comparando [Escopo] com a Média Geral da Rede Municipal...`.
- [ ] Nenhuma ocorrência visível do termo "Benchmark" permanece na interface do usuário.
- [ ] Ao copiar o diagnóstico de gargalos (`copyMeetingAgendaToClipboard`), itens sem dados exibem `Sem referencial municipal`.
- [ ] A formatação das réguas duplas, barras coloridas e badges de delta ($\Delta \pm\%$) continuam funcionando perfeitamente sem qualquer quebra de CSS.
- [ ] A checagem de sintaxe JSC (`python3 audit_platform.py --check-syntax`) é concluída com 100% de sucesso.
- [ ] A suíte de auditoria pós-deploy (`python3 audit_platform.py --silent-on-success`) é executada e aprovada com zero falhas.

---

## 5. Seção Obrigatória de Auditoria (`audit_platform.py` e Testes do `index.html`)

### 5.1 Alterações no Algoritmo de Auditoria In-App (`index.html`)
- **Módulo 10 (`indicadores_decisao`):**
  - **Inclusão de Asserção Negativa:** Validação de que `.benchmark-info-bar.innerText` NÃO contém a substring `'Benchmark'`. Caso contenha, o teste lança erro imediato: `"Termo residual 'Benchmark' ainda presente no banner informativo da Visualização por Dimensão"`.
  - **Inclusão de Asserção Positiva:** Validação de que `.benchmark-info-bar.innerText` contém a substring `'Referencial da Rede Municipal'`. Caso não contenha, o teste lança erro: `"Rótulo pedagógico 'Referencial da Rede Municipal' não encontrado no banner informativo"`.
  - **Atualização do Log de Sucesso:** Mensagem atualizada para `"Higienização e Renderização do Banner 'Referencial da Rede Municipal' no DOM (Pilar 3)"`.

### 5.2 Alterações em `audit_platform.py`
- Nenhuma alteração estrutural necessária no script CLI `audit_platform.py`, uma vez que ele consome os relatórios emitidos dinamicamente por `runPlatformSelfAudit()`.
- O script validará automaticamente a nova asserção sintática e o teste modular em modo headless via:
  ```bash
  python3 audit_platform.py --check-syntax
  python3 audit_platform.py --silent-on-success
  ```
