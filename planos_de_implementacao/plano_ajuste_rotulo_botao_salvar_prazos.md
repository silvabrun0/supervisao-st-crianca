# PLANO DE IMPLEMENTAÇÃO: AJUSTE DO RÓTULO DO BOTÃO DE SALVAR PRAZOS DOS CICLOS AVALIATIVOS

> **Diretriz de Execução Obrigatória:** O executor desta intervenção DEVE ler integralmente os arquivos [WORKFLOW_MACOS.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md), [AGENTS.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/AGENTS.md) e a skill `.agents/skills/execucao-operario/SKILL.md` antes de efetuar qualquer alteração. Este plano é a especificação exata, detalhada e vinculante a ser seguida fielmente na Etapa 2.

---

## 1. Diagnóstico e Contexto

No sistema de supervisão e acompanhamento pedagógico **SerTão Criança**, a gestão dos períodos dos bimestres letivos é realizada no modal de Ciclos Avaliativos (`#modalBimesterPeriods`).

Atualmente, o botão primário responsável por persistir as datas oficiais dos 4 bimestres letivos possui o seguinte markup na linha ~8262 de `index.html`:
```html
<button type="button" class="btn btn-primary" onclick="saveBimesterPeriodsSettings()">💾 Salvar Prazos na SSOT</button>
```

### Análise de Usabilidade e Comunicação com o Usuário
1. **Presença de Jargão Técnico Interno ("SSOT"):**
   - O termo *SSOT* (Single Source of Truth) é um conceito de arquitetura de software e governança de dados voltado para desenvolvedores e arquitetos.
   - Para a equipe pedagógica e gestoras da Educação Infantil (usuárias do sistema), termos técnicos geram ruído visual e reduzem a clareza da interface.
2. **Uso de Emojis em Botões Primários:**
   - Seguindo o padrão de higienização visual aplicado nas versões recentes (como a remoção de setas e simplificação de botões), a retirada do emoji `💾` favorece uma interface mais limpa, profissional e direta.
3. **Demanda do Usuário:**
   - Trocar o texto `"💾 Salvar Prazos na SSOT"` por `"salvar prazos"`.

---

## 2. Arquitetura e Pontos de Impacto

Os arquivos envolvidos na intervenção são:
1. **`index.html` (Raiz):**
   - Linha ~8262: Modificação do texto interno da tag `<button>` dentro do container `#modalBimesterPeriods`.
   - Nenhuma alteração de atributos (`class="btn btn-primary"`, `type="button"`, `onclick="saveBimesterPeriodsSettings()"`), preservando 100% o comportamento funcional da persistência via `saveState()` e recálculo dos indicadores.
   - Atualização do cabeçalho da versão no botão `.btn-changelog` e no `#modalChangelog`.
2. **Cópias Espelhadas Obrigatórias:**
   - `gestor supervisao_patos/index.html`
   - `gestor supervisao_patos/firebase_deploy/public/index.html`
3. **Histórico e Governança:**
   - `CHANGELOG.md`: Registro da nova versão com a modificação realizada.
   - `intermediárias/aplicativo_v128_ajuste_rotulo_salvar_prazos.html`: Backup estático da versão gerada.
4. **Algoritmo de Auditoria e Testes:**
   - `audit_platform.py` e suite modular in-app: Nenhuma quebra funcional, pois nenhum teste automatizado acopla a asserção à string legada `"💾 Salvar Prazos na SSOT"`. Adição de asserção de conformidade no teste de catálogo/navegação.

---

## 3. Especificação Passo a Passo (Snippets Exatos)

### Passo 1: Atualização do Rótulo no Modal de Prazos Bimestrais (`#modalBimesterPeriods`)

No arquivo `index.html` (linha ~8260 a 8265):

```html
<!-- ANTES -->
      <div style="display:flex; justify-content:space-between; align-items:center; gap:10px;">
        <button type="button" class="btn btn-secondary" onclick="restoreDefaultBimesterPeriodsPrompt()" style="font-size:12px; color:#DC2626; border-color:#FECACA;">
          ↺ Restaurar Padrões
        </button>
        <div style="display:flex; gap:8px;">
          <button type="button" class="btn btn-secondary" onclick="closeBimesterPeriodsModal()">Cancelar</button>
          <button type="button" class="btn btn-primary" onclick="saveBimesterPeriodsSettings()">💾 Salvar Prazos na SSOT</button>
        </div>
      </div>

<!-- DEPOIS (Opção A - Conforme solicitação literal exata: "salvar prazos") -->
      <div style="display:flex; justify-content:space-between; align-items:center; gap:10px;">
        <button type="button" class="btn btn-secondary" onclick="restoreDefaultBimesterPeriodsPrompt()" style="font-size:12px; color:#DC2626; border-color:#FECACA;">
          ↺ Restaurar Padrões
        </button>
        <div style="display:flex; gap:8px;">
          <button type="button" class="btn btn-secondary" onclick="closeBimesterPeriodsModal()">Cancelar</button>
          <button type="button" class="btn btn-primary" onclick="saveBimesterPeriodsSettings()">salvar prazos</button>
        </div>
      </div>

<!-- NOTA: Se for preferida a capitalização canônica padrão dos botões da interface ("Salvar Prazos"): -->
<!-- <button type="button" class="btn btn-primary" onclick="saveBimesterPeriodsSettings()">Salvar Prazos</button> -->
```

---

### Passo 2: Atualização do Changelog Duplo e Versão

1. **`index.html`:**
   - Incrementar versão no botão `.btn-changelog` para `Versão 1.28 (v8.1.3)`:
     ```html
     <!-- ANTES -->
             <button class="btn-changelog" onclick="openChangelogModal()" title="Histórico Integral de Modificações e Diretrizes">
               📌 Versão 1.27 (v8.1.2)
             </button>

     <!-- DEPOIS -->
             <button class="btn-changelog" onclick="openChangelogModal()" title="Histórico Integral de Modificações e Diretrizes">
               📌 Versão 1.28 (v8.1.3)
             </button>
     ```
   - Inserir card de release notes no topo da lista dentro do `#modalChangelog`.
   - Atualizar a asserção no teste in-app `navegacao_layout` para refletir `Versão 1.28 (v8.1.3)`.

2. **`CHANGELOG.md`:**
   - Registrar no topo do sumário executivo a Versão 1.28:
     - **Modificações:** Higienização de rótulo no modal de Ciclos Avaliativos: substituição de `"💾 Salvar Prazos na SSOT"` por `"salvar prazos"`, eliminando termo técnico e simplificando a interface.

---

### Passo 3: Sincronização das Cópias Espelhadas e Backup Intermediário

- Copiar `index.html` para:
  - `gestor supervisao_patos/index.html`
  - `gestor supervisao_patos/firebase_deploy/public/index.html`
  - `intermediárias/aplicativo_v128_ajuste_rotulo_salvar_prazos.html`

---

## 4. Critérios de Aceite e Roteiro de Teste

1. **Inspeção Visual e DOM:**
   - Abrir o modal `#modalBimesterPeriods` via botão "📅 Ciclos Avaliativos & Calendário" no painel da Coordenadora da EI.
   - Verificar que o botão de salvar exibe o texto atualizado `"salvar prazos"` (sem o emoji `💾` e sem o jargão `"na SSOT"`).
2. **Validação Funcional:**
   - Alterar uma data e clicar no botão.
   - Confirmar o disparo da função `saveBimesterPeriodsSettings()`, exibição do toast de confirmação e salvamento correto em `appState.bimesterPeriods`.
3. **Validação Sintática Obrigatória Pré-Voo:**
   - Executar `python3 audit_platform.py --check-syntax` e confirmar 100% de sucesso no JSC nativo.

---

## 5. Alterações / Adições / Exclusões no Algoritmo de Auditoria (`audit_platform.py`)

1. **Alterações / Exclusões:**
   - Nenhuma exclusão necessária, pois nenhum teste dependia do rótulo antigo `"💾 Salvar Prazos na SSOT"`.
2. **Adições:**
   - No módulo in-app `navegacao_layout`, atualizar a verificação de versão para esperar `1.28` em vez de `1.27`.
   - No módulo in-app `catalogo_dados`, adicionar checagem de integridade garantindo que o botão primário dentro de `#modalBimesterPeriods` chama `saveBimesterPeriodsSettings` e contém o texto atualizado.
3. **Auditoria Pós-Deploy:**
   - Executar `python3 audit_platform.py --silent-on-success` após o push e confirmar aprovação integral de todos os módulos.
