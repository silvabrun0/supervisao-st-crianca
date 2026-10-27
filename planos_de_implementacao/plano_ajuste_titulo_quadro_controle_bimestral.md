# PLANO DE IMPLEMENTAÇÃO: AJUSTE DO TÍTULO DO QUADRO DE CONTROLE BIMESTRAL

> **Diretriz de Execução Obrigatória:** O executor desta intervenção DEVE ler integralmente os arquivos [WORKFLOW_MACOS.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md), [AGENTS.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/AGENTS.md) e a skill `.agents/skills/execucao-operario/SKILL.md` antes de efetuar qualquer alteração. Este plano é a especificação exata, detalhada e vinculante a ser seguida fielmente na Etapa 2. É expressamente proibido improvisar ou alterar arquivos de código fora do roteiro aprovado.

---

## 1. Diagnóstico e Contexto

No sistema de supervisão pedagógica **SerTão Criança**, a sub-aba de Acompanhamento Longitudinal (disponível no Painel de Indicadores Pedagógicos) apresenta o mapa matricial de cumprimento das 4 observações anuais por turma e por docente regente titular.

Atualmente, o título desta seção é renderizado no arquivo `index.html` (linhas 22218-22221) da seguinte maneira:

```html
<div class="semaphore-title-group">
  <h3>
    <span>🚦</span> Quadro de Controle Bimestral (Semáforo do Ciclo Anual)
  </h3>
  <p>
    Acompanhamento matricial do cumprimento das 4 observações obrigatórias organizado por <strong>${viewMode === 'classes' ? 'TURMA' : 'DOCENTE REGENTE TITULAR'}</strong>: 
    <strong style="color:#16A34A;">🟢 Concluída</strong> · 
    <strong style="color:#1E40AF;">⚪ No Prazo</strong> · 
    <strong style="color:#DC2626;">🔴 Atrasada</strong>.
  </p>
</div>
```

### Análise de Usabilidade e Comunicação Visual
1. **Redundância Cognitiva:**
   - A expressão `(Semáforo do Ciclo Anual)` entre parênteses é um subtítulo explicativo redundante, visto que o parágrafo logo abaixo (`<p>`) já descreve com precisão pedagógica o semáforo de prazos canônico (Verde, No Prazo e Atrasada).
2. **Harmonização e Sobriedade Institucional:**
   - O projeto vem passando por uma padronização estética de eliminação progressiva de emojis decorativos na interface (vide Versões 1.26, 1.31, 1.38 e 1.39), consolidando uma linguagem visual sóbria, institucional e focada no processo decisório dos gestores.
   - O emoji `🚦` no título cria poluição visual e distrai a atenção do conteúdo da matriz.
3. **Demanda Exata:**
   - Transformar o título `"🚦Quadro de Controle Bimestral (Semáforo do Ciclo Anual)"` em `"Quadro de Controle Bimestral"`.

---

## 2. Arquitetura e Pontos de Impacto

Os arquivos envolvidos na intervenção são:

1. **`index.html` (Raiz):**
   - Linha ~22220: Ajuste do conteúdo textual interno da tag `<h3>`, removendo `<span>🚦</span>` e `(Semáforo do Ciclo Anual)`.
   - Linhas 26774-26778: Atualização do bloco de teste do Pilar 10 em `runFullPlatformAuditAsync`, adicionando asserção estrita para validação do novo texto limpo do título.
   - Linha 3597: Incremento da versão no botão `.btn-changelog` para `Versão 1.40 (v8.2.7)`.
   - Linha ~5254: Inserção do card de notas de lançamento no modal `#modalChangelog`.
2. **Cópias Espelhadas Obrigatórias:**
   - `gestor supervisao_patos/index.html`
   - `gestor supervisao_patos/firebase_deploy/public/index.html`
3. **Auditoria (`audit_platform.py`):**
   - Linha 247: Atualização da menção de versão alvo de `Versão 1.38 - v8.2.5` para `Versão 1.40 (v8.2.7)`.
4. **Histórico e Governança:**
   - `CHANGELOG.md`: Adição da entrada referente à Versão 1.40 no sumário e notas de versão.
   - `intermediárias/aplicativo_v140_ajuste_titulo_quadro_controle_bimestral.html`: Criação do backup intermediário fiel.

---

## 3. Especificação de Implementação Passo a Passo (Snippets Exatos)

### Passo 1: Modificação do Título em `index.html`

Localizar no arquivo `index.html` o cabeçalho do Semáforo Bimestral dentro da sub-aba Longitudinal:

```html
<!-- ANTES (linhas ~22218 a 22221) -->
              <div class="semaphore-title-group">
                <h3>
                  <span>🚦</span> Quadro de Controle Bimestral (Semáforo do Ciclo Anual)
                </h3>
                <p>

<!-- DEPOIS -->
              <div class="semaphore-title-group">
                <h3>
                  Quadro de Controle Bimestral
                </h3>
                <p>
```

*(Nota de Estilo: A classe CSS `.semaphore-title-group h3` já possui as regras tipográficas completas aplicadas, preservando o alinhamento, tamanho da fonte e cores sem qualquer necessidade de ajuste em folhas de estilo).*

---

### Passo 2: Atualização do Teste no Motor de Auditoria In-App em `index.html`

No bloco de teste do Pilar 10 na função assíncrona `runFullPlatformAuditAsync` (~linhas 26774 a 26778):

```javascript
// ANTES
              // 10. PILAR 10: VALIDAÇÃO DO QUADRO DE CONTROLE BIMESTRAL (SEMÁFORO DE TURMAS)
              const semaphoreSection = document.getElementById('bimesterSemaphoreSection');
              if (!semaphoreSection) throw new Error('Falha Pilar 10: Contêiner #bimesterSemaphoreSection ausente no DOM');
              logger.log('Renderização do Quadro de Controle Bimestral (Pilar 10)', true);

// DEPOIS
              // 10. PILAR 10: VALIDAÇÃO DO QUADRO DE CONTROLE BIMESTRAL (SEMÁFORO DE TURMAS)
              const semaphoreSection = document.getElementById('bimesterSemaphoreSection');
              if (!semaphoreSection) throw new Error('Falha Pilar 10: Contêiner #bimesterSemaphoreSection ausente no DOM');
              const semTitleElem = semaphoreSection.querySelector('.semaphore-title-group h3');
              if (!semTitleElem || semTitleElem.textContent.trim() !== 'Quadro de Controle Bimestral') {
                throw new Error(`Falha Pilar 10: Título esperado "Quadro de Controle Bimestral", obtido "${semTitleElem ? semTitleElem.textContent.trim() : 'ausente'}"`);
              }
              logger.log('Renderização e conformidade do título do Quadro de Controle Bimestral (Pilar 10)', true);
```

---

### Passo 3: Atualização do Rótulo de Versão no `audit_platform.py`

No arquivo `audit_platform.py` (linha 247):

```python
# ANTES
        print(f"   Alvo: index.html (Versão 1.38 - v8.2.5)")

# DEPOIS
        print(f"   Alvo: index.html (Versão 1.40 - v8.2.7)")
```

---

### Passo 4: Atualização da Versão e Release Notes no `index.html`

1. **Botão `.btn-changelog` (linha 3597):**
```html
<!-- ANTES -->
          <span>Versão 1.39 (v8.2.6)</span>

<!-- DEPOIS -->
          <span>Versão 1.40 (v8.2.7)</span>
```

2. **Modal `#modalChangelog` (logo após a linha 5253):**
```html
      <!-- VERSÃO 1.40 - AJUSTE DO TÍTULO DO QUADRO DE CONTROLE BIMESTRAL -->
      <div class="card" style="margin-bottom:16px; border-left:4px solid #0284C7; background:#F8FAFC;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span style="font-weight:800; font-size:14px; color:var(--text-primary);">📌 Versão 1.40 (v8.2.7)</span>
          <span style="font-size:11px; color:var(--text-secondary); background:#F1F5F9; padding:2px 8px; border-radius:12px;">27/10/2026</span>
        </div>
        <div style="font-size:12px; font-weight:700; color:var(--text-primary); margin-bottom:6px;">
          Higienização Visual do Título do Quadro de Controle Bimestral:
        </div>
        <ul style="font-size:12px; color:var(--text-secondary); margin:0; padding-left:18px; line-height:1.5;">
          <li>🧹 <strong>Título Direto e Sobriedade Institucional:</strong> Simplificação do cabeçalho da sub-aba de Acompanhamento Longitudinal para <code>Quadro de Controle Bimestral</code>, eliminando o emoji <code>🚦</code> e os parênteses redundantes <code>(Semáforo do Ciclo Anual)</code>.</li>
          <li>🎯 <strong>Foco Pedagógico Decisório:</strong> Preservação integral do parágrafo de legenda e do semáforo canônico de prazos (🟢 Concluída, ⚪ No Prazo, 🔴 Atrasada).</li>
          <li>🔬 <strong>Auditoria Integrada com Asserção Estrita:</strong> Inclusão de asserção automatizada no teste do Pilar 10 para garantia de preservação textual perene.</li>
        </ul>
      </div>
```

---

### Passo 5: Atualização de Governança no `CHANGELOG.md`

1. **Inserção no Sumário Executivo (Tabela):**
```markdown
| **1.40** | 27/10/2026 15:58 | `intermediárias/aplicativo_v140_ajuste_titulo_quadro_controle_bimestral.html` | Solicitação direta / `planos_de_implementacao/plano_ajuste_titulo_quadro_controle_bimestral.md` | Higienização visual do título da sub-aba Longitudinal: simplificação para 'Quadro de Controle Bimestral', eliminação do emoji de semáforo e parênteses redundantes, com asserção estrita no Módulo 10 da auditoria 🧹📊 |
```

2. **Inserção do Detalhamento da Versão:**
```markdown
### [Versão 1.40] - Higienização Visual do Título do Quadro de Controle Bimestral
- **Data/Horário:** 27/10/2026 15:58
- **Arquivo de Referência:** `intermediárias/aplicativo_v140_ajuste_titulo_quadro_controle_bimestral.html`
- **Foco Central:** Simplificação textual e sobriedade visual no cabeçalho do Quadro de Controle Bimestral na aba de Indicadores.

#### Inclusões
- Asserção léxica rigorosa no teste in-app do Pilar 10 (`runFullPlatformAuditAsync`) assegurando a integridade e exatidão da string `'Quadro de Controle Bimestral'`.

#### Alterações
- Substituição de `<span>🚦</span> Quadro de Controle Bimestral (Semáforo do Ciclo Anual)` por `Quadro de Controle Bimestral` no cabeçalho de `#bimesterSemaphoreSection`.
- Atualização da versão do sistema para 1.40 (v8.2.7) no cabeçalho e modal de changelog.

#### Exclusões
- Remoção do emoji `🚦` e do subtítulo explicativo entre parênteses `(Semáforo do Ciclo Anual)`.
```

---

### Passo 6: Criação do Backup Intermediário e Espelhamento
1. Salvar cópia integral de `index.html` em:
   `intermediárias/aplicativo_v140_ajuste_titulo_quadro_controle_bimestral.html`
2. Copiar `index.html` para:
   `gestor supervisao_patos/firebase_deploy/public/index.html`

---

## 4. Critérios de Aceite e Roteiro de Teste

1. **Conformidade Sintática Pré-Voo (JSC):**
   - Executar: `python3 audit_platform.py --check-syntax`
   - O comando deve reportar 100% de sucesso léxico/sintático sem warnings ou erros.

2. **Critério Visual e Estrutural:**
   - Navegar até o Painel de Indicadores e alternar para a sub-aba "Acompanhamento Longitudinal" (`switchIndicatorsSubTab('longitudinal')`).
   - O elemento `<h3>` dentro de `.semaphore-title-group` deve exibir exatamente `"Quadro de Controle Bimestral"`.
   - O emoji `🚦` não deve estar presente.
   - O sufixo `(Semáforo do Ciclo Anual)` não deve estar presente.

3. **Auditoria Automatizada Headless (Pós-Deploy):**
   - Executar: `python3 audit_platform.py --silent-on-success`
   - Todos os 12 módulos devem passar com 100% de aprovação, incluindo o Módulo 10 (`indicadores_decisao`).

---

## 5. Seção Obrigatória de Auditoria (`audit_platform.py` e testes do `index.html`)

| Item | Tipo | Descrição |
| :--- | :---: | :--- |
| **`index.html` (`runFullPlatformAuditAsync`)** | **Adição** | Asserção estrita `semTitleElem.textContent.trim() === 'Quadro de Controle Bimestral'` dentro do bloco de validação do Pilar 10. |
| **`index.html` (`runFullPlatformAuditAsync`)** | **Alteração** | Log descritivo atualizado para `'Renderização e conformidade do título do Quadro de Controle Bimestral (Pilar 10)'`. |
| **`audit_platform.py`** | **Alteração** | Linha 247 atualizada para exibir o alvo `Versão 1.40 (v8.2.7)`. |
| **Exclusões** | **Exclusão** | Eliminação de dependência de qualquer teste no antigo texto com emojis ou parênteses. |
