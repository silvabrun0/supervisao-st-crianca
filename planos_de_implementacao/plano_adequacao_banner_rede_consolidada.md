# Plano de Implementação: Adequação Contextual do Banner da Visualização por Dimensão em Rede Consolidada

---

## 0. Diretriz de Execução (Obrigatória para o Operário - Etapa 2)
> [!IMPORTANT]
> **Leitura Prévia Obrigatória:** Antes de executar qualquer ação deste plano, o assistente na **Etapa 2 (O Operário)** DEVE consultar e seguir rigorosamente:
> 1. [WORKFLOW_MACOS.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md)
> 2. [WORKFLOW_GITHUB.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_GITHUB.md)
> 3. [.agents/skills/execucao-operario/SKILL.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/.agents/skills/execucao-operario/SKILL.md)
> 4. [.agents/skills/auditoria-plataforma/SKILL.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/.agents/skills/auditoria-plataforma/SKILL.md)
>
> **Trava de Escopo Fechado:** Este plano restringe-se **estritamente** à adequação textual e semântica do banner informativo (`.benchmark-info-bar`) na sub-aba **Visualização por Dimensão** (`#indicatorsSectionDrilldown`), diferenciando pedagogicamente a visualização em **Rede Consolidada** (onde o escopo coincide com a própria rede municipal, eliminando a redundância "comparando rede com rede") da visualização em **Escopo Focal** (Unidade Escolar ou Polo Regional), sem alterar o layout das réguas duplas, o cálculo dos índices, as fórmulas do Delta ($\Delta \pm\%$) ou os dados analíticos.

---

## 1. Diagnóstico e Contexto

### 1.1 Contexto e Justificativa Pedagógica
Na sub-aba **"Visualização por Dimensão"** (`#indicatorsSectionDrilldown`), o banner superior informativo (`.benchmark-info-bar`) exibe atualmente a seguinte mensagem estática quando o usuário está no nível de governança do Núcleo de Educação Infantil ou seleciona `Unidade: Todas`:
> 🏛️ **Referencial da Rede Municipal:** Comparando **Rede Consolidada** com a **Média Geral da Rede Municipal (4 observação(ões) na base)**.

Essa redação gera estranheza conceitual e confusão imediata para a gestão pedagógica, pois "Rede Consolidada" e "Média Geral da Rede Municipal" são a mesma entidade estatística ($\Delta = 0\%$). Não há um segundo ente comparativo nessa visão.

### 1.2 Delimitação do Escopo
1. **Diferenciação Condicional no Banner (`renderIndicatorsScreen`):**
   - **Quando for Rede Consolidada (`scopeLabelText === 'Rede Consolidada'` ou `activeUnitFilter === 'ALL'` com escopo amplo):**
     Exibir uma redação clara, precisa e orientadora:
     > 🏛️ **Panorama Geral da Rede Municipal:** Exibindo a **Média Consolidada de Patos (${redeObs.length} observação(ões) na base)**. Para comparar uma escola com o referencial municipal, selecione uma Unidade Escolar no filtro superior.
   - **Quando for Escopo Específico (Unidade Escolar ou Polo):**
     Manter a redação comparativa ativa:
     > 🏛️ **Referencial da Rede Municipal:** Comparando **${scopeLabelText}** com a **Média Geral da Rede Municipal (${redeObs.length} observação(ões) na base)**.
2. **Atualização da Auditoria In-App (Módulo 10: `indicadores_decisao`):**
   - Adequar o teste in-app para cobrir e validar tanto o texto do escopo específico quanto o banner de panorama consolidado da rede municipal.
3. **Gestão de Versão (Versão 1.31):**
   - Atualizar `CHANGELOG.md`, `#modalChangelog` e `.btn-changelog`.

---

## 2. Arquitetura e Mapeamento de Pontos de Impacto

Os pontos de impacto estão localizados no arquivo principal [index.html](file:///Users/bruno/Desktop/gestor%20supervisao_patos/index.html) e espelhados em `gestor supervisao_patos/index.html`:

| # | Ponto de Impacto | Localização / Função | Situação Atual | Situação Pretendida |
|---|-------------------|----------------------|----------------|---------------------|
| 1 | Renderização do Banner Informativo | `renderIndicatorsScreen` (~linhas 21166-21178) | Mensagem única que diz *"Comparando Rede Consolidada com a Média Geral da Rede..."* | Renderização condicional: se for visão de rede ampla, exibe *"Panorama Geral da Rede Municipal: Exibindo a Média Consolidada de Patos... Para comparar uma escola..."* |
| 2 | Asserção do Banner na Auditoria In-App | `runPlatformSelfAudit` (`indicadores_decisao`, ~linhas 25744-25752) | Testa se contém "Referencial da Rede Municipal" na renderização padrão do teste | Adequar o teste para validar tanto o banner específico de Unidade quanto o de Panorama da Rede |
| 3 | Changelog Duplo e Botão de Versão | `CHANGELOG.md` e `#modalChangelog` / `.btn-changelog` | Versão 1.30 | Atualização para Versão 1.31 |

---

## 3. Especificação de Implementação Passo a Passo (Etapa 2)

### Passo 1: Renderização Condicional do Banner em `index.html`
Na função `renderIndicatorsScreen` (aproximadamente linha 21165):

**Antes:**
```html
          <!-- Banner Informativo de Contexto do Referencial da Rede Municipal -->
          <div class="benchmark-info-bar">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:16px;">🏛️</span>
              <span>
                <strong>Referencial da Rede Municipal:</strong> Comparando <strong>${scopeLabelText}</strong> com a <strong>Média Geral da Rede Municipal (${redeObs.length} observação(ões) na base)</strong>.
              </span>
            </div>
            ${isNucleoEI(user) && activeUnitFilter === 'ALL' ? `
              <span style="font-size:11px; background:#DCFCE7; color:#166534; padding:3px 8px; border-radius:4px; font-weight:700;">
                💡 Selecione uma UE no filtro para comparar diretamente
              </span>
            ` : ''}
          </div>
```

**Depois:**
```javascript
          <!-- Banner Informativo de Contexto do Referencial da Rede Municipal -->
          <div class="benchmark-info-bar">
            ${(scopeLabelText === 'Rede Consolidada' || (activeUnitFilter === 'ALL' && !user.schoolKey && user.roleKey !== 'coordenador')) ? `
              <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; width:100%;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-size:16px;">🏛️</span>
                  <span>
                    <strong>Panorama Geral da Rede Municipal:</strong> Exibindo a média consolidada de Patos/PB (${redeObs.length} observação(ões) na base).
                  </span>
                </div>
                <span style="font-size:11px; background:#DCFCE7; color:#166534; padding:3px 8px; border-radius:4px; font-weight:700;">
                  💡 Selecione uma Escola no filtro para comparar com a Rede
                </span>
              </div>
            ` : `
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:16px;">🏛️</span>
                <span>
                  <strong>Referencial da Rede Municipal:</strong> Comparando <strong>${scopeLabelText}</strong> com a <strong>Média Geral da Rede Municipal (${redeObs.length} observação(ões) na base)</strong>.
                </span>
              </div>
            `}
          </div>
```

---

### Passo 2: Atualização da Auditoria In-App no Módulo `indicadores_decisao`
Em `runPlatformSelfAudit()` sob o bloco `indicadores_decisao` (aproximadamente linha 25744):

**Antes:**
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

**Depois:**
```javascript
              const infoBar = drillSection.querySelector('.benchmark-info-bar');
              if (!infoBar) throw new Error('.benchmark-info-bar ausente na sub-aba Visualização por Dimensão');
              if (infoBar.innerText.includes('Benchmark')) {
                throw new Error("Termo residual 'Benchmark' ainda presente no banner informativo da Visualização por Dimensão");
              }
              const hasValidBannerText = infoBar.innerText.includes('Referencial da Rede Municipal') || infoBar.innerText.includes('Panorama Geral da Rede Municipal');
              if (!hasValidBannerText) {
                throw new Error("Rótulo pedagógico válido ('Referencial da Rede Municipal' ou 'Panorama Geral da Rede Municipal') não encontrado no banner");
              }
              logger.log("Higienização e Renderização Contextual do Banner de Referencial/Panorama no DOM (Pilar 3)", true);
```

---

### Passo 3: Versão 1.31 e Registro de Changelog Duplo
1. Atualizar botão `.btn-changelog`: `📌 Versão 1.31 (v8.1.7)`.
2. Adicionar card no `#modalChangelog`:
```html
      <!-- VERSÃO 1.31 - ADEQUAÇÃO CONTEXTUAL DO BANNER DA REDE CONSOLIDADA -->
      <div class="card" style="margin-bottom:16px; border-left:4px solid #10B981;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span style="font-weight:800; font-size:14px; color:var(--text-primary);">📌 Versão 1.31</span>
          <span style="font-size:11px; color:var(--text-secondary); background:#F1F5F9; padding:2px 8px; border-radius:12px;">26/10/2026</span>
        </div>
        <div style="font-size:12px; font-weight:700; color:var(--text-primary); margin-bottom:6px;">
          Adequação Contextual do Banner na Visualização por Dimensão:
        </div>
        <ul style="font-size:12px; color:var(--text-secondary); margin:0; padding-left:18px; line-height:1.5;">
          <li>🏛️ <strong>Eliminação da Redundância "Rede vs. Rede":</strong> Na visão de Rede Consolidada, o banner agora exibe com clareza <code>Panorama Geral da Rede Municipal: Exibindo a média consolidada de Patos/PB</code> com badge orientador para seleção de escola, eliminando a mensagem confusa de comparação de uma rede com ela mesma.</li>
          <li>🎯 <strong>Preservação da Comparação Ativa por Escola/Polo:</strong> Mantida a redação <code>Referencial da Rede Municipal: Comparando [Escola] com a Média Geral...</code> quando há uma unidade ou polo em foco.</li>
          <li>🔬 <strong>Auditoria Contínua com 100% de Aprovação:</strong> Atualização das asserções in-app em <code>indicadores_decisao</code> e <code>navegacao_layout</code>.</li>
        </ul>
      </div>
```
3. Atualizar `CHANGELOG.md` com a entrada no sumário e detalhamento.

---

## 4. Critérios de Aceite
- [ ] Quando o escopo for `Rede Consolidada`, o banner exibe: `Panorama Geral da Rede Municipal: Exibindo a média consolidada de Patos/PB ([N] observação(ões) na base).` acompanhado de `💡 Selecione uma Escola no filtro para comparar com a Rede`.
- [ ] Quando o escopo for uma UE específica (ex: *EMEI Pequeno Príncipe*) ou Polo, o banner exibe: `Referencial da Rede Municipal: Comparando [Escopo] com a Média Geral da Rede Municipal ([N] observação(ões) na base).`.
- [ ] `python3 audit_platform.py --check-syntax` validado com 100% de sucesso.
- [ ] `python3 audit_platform.py --silent-on-success` executado com 154/154 testes aprovados.

---

## 5. Seção Obrigatória de Auditoria (`audit_platform.py` e Testes do `index.html`)

### 5.1 Alterações no Algoritmo In-App (`index.html`)
- **Módulo 10 (`indicadores_decisao`):** O teste passa a aceitar de forma resiliente tanto a rotulagem de escopo focado (`Referencial da Rede Municipal`) quanto a rotulagem de escopo amplo (`Panorama Geral da Rede Municipal`), mantendo a asserção negativa contra o termo residual `Benchmark`.
- **Módulo 12 (`navegacao_layout`):** Atualizada asserção para `Versão 1.31`.

### 5.2 Alterações em `audit_platform.py`
- Nenhuma alteração de código necessária em `audit_platform.py`, que valida automaticamente os resultados do motor in-app via Chrome headless.
