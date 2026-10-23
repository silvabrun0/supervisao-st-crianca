# PLANO DE IMPLEMENTAÇÃO: REMOÇÃO DO BOTÃO "NOVA OCORRÊNCIA" DO MÓDULO DE REGISTROS FORMATIVOS

> **Diretriz de Execução Obrigatória:** O executor desta intervenção DEVE ler integralmente os arquivos [WORKFLOW_MACOS.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md), [AGENTS.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/AGENTS.md) e a skill `.agents/skills/execucao-operario/SKILL.md` antes de efetuar qualquer alteração. Este plano é a especificação exata a ser seguida na Etapa 2.

---

## 1. Diagnóstico e Contexto

No sistema de supervisão e acompanhamento pedagógico **SerTão Criança**, a gestão qualitativa de campo é regida pelas diretrizes dos **Pilares 1 e 13**:

1. **Vinculação Estrita à Observação Pedagógica em Andamento:**
   - As ocorrências de campo não são notas avulsas descontextualizadas. Elas nascem exclusivamente vinculadas a uma observação pedagógica ativa (`appState.currentObs`), herdando com precisão a Unidade Escolar, a Turma observada, o Bimestre letivo e a regência (com opção primária de *Toda a Turma / Coletiva* ou conduta individual de docente).
   - O canal oficial de registro de uma ocorrência de campo é o menu flutuante (FAB) disponível durante a sessão de avaliação ativa em sala de aula (`handleFabNote()` -> `openQualitativeNoteModal()`).

2. **Incoerência e Fricção na Tela de Registros Formativos (`#screenNotes`):**
   - A tela de Registros Formativos (`screenNotes`), acessível pelo menu superior/lateral, é um painel de **gestão, consulta, filtragem, acompanhamento do diálogo formativo ("Marcar como Conversado"), arquivamento e exportação** de ocorrências preexistentes.
   - No topo desta tela, havia um botão primário com o rótulo `+ Nova Ocorrência de Campo` (`#btnNewQualitativeNote`), chamando `openQualitativeNoteModal()`.
   - Ao clicar nesse botão a partir da tela de registros, o guardião de integridade lógica do sistema imediatamente bloqueia a ação e exibe o toast de alerta:
     > *"Para registrar uma ocorrência de campo, inicie ou continue uma observação pedagógica."*
   - Uma vez que a criação avulsa é impossível (e proibida pela própria modelagem do negócio para evitar registros órfãos sem contexto de turma/visita), a presença deste botão gera falsas expectativas, poluição visual e frustração ergonômica. Se a funcionalidade não pode (e não deve) existir neste local, o botão não tem nenhuma razão para permanecer na interface.

3. **Objetivo:**
   - Eliminar definitivamente o botão `#btnNewQualitativeNote` da tela `#screenNotes`.
   - Higienizar as chamadas residuais em `applyUserRoleUI()` no JavaScript.
   - Preservar 100% da integridade da abertura do modal de ocorrências a partir do menu FAB da observação pedagógica em andamento.
   - Adicionar asserção automatizada de supressão no módulo de testes `travas_seguranca` da plataforma e atualizar a versão do sistema para v1.22.

---

## 2. Arquitetura e Pontos de Impacto

Os arquivos impactados são:
- `index.html` (e suas réplicas obrigatórias em `gestor supervisao_patos/index.html` e `gestor supervisao_patos/firebase_deploy/public/index.html`):
  - **Markup HTML da Seção 8 (`#screenNotes`):** Remoção da tag `<button class="btn btn-primary btn-add-note" id="btnNewQualitativeNote" onclick="openQualitativeNoteModal()">+ Nova Ocorrência de Campo</button>` mantendo a estrutura de título e subtítulo limpos e padronizados.
  - **Lógica de Interface por Perfil (`applyUserRoleUI`):** Supressão da constante `btnNewQualitativeNote` e das manipulações de visibilidade associadas (`style.display`).
  - **Módulo de Testes Canônicos (`runPlatformAudit` -> `travas_seguranca`):** Inclusão de asserção garantindo que `document.getElementById('btnNewQualitativeNote') === null`.
  - **Módulo de Testes Canônicos (`runPlatformAudit` -> `navegacao_layout`):** Atualização da validação de integridade para a **Versão 1.22**.
  - **Cabeçalho Desktop e Modal de Changelog (`#btnChangelog`, `#modalChangelog`):** Atualização do badge para Versão 1.22 e inserção do card de release notes da versão.
- `CHANGELOG.md`:
  - Registro cronológico e sumário executivo da **Versão 1.22**.
- `audit_platform.py`:
  - Nenhuma alteração sintática necessária no runner Python, pois a validação é automaticamente herdada através do módulo `travas_seguranca` no Chrome Headless e checada via JSC nativo.

---

## 3. Especificação Passo a Passo (Snippets Exatos)

### Passo 1: Remoção do Botão no HTML de `#screenNotes`

No arquivo `index.html` (linha ~4390 a 4400):

```html
<!-- ANTES -->
    <!-- ================= SCREEN 8: REGISTROS QUALITATIVOS (OCORRÊNCIAS DE CAMPO) ================= -->
    <section id="screenNotes" class="app-screen">
      <div class="page-title-row notes-header-row">
        <div>
          <div class="page-title">Ocorrências de Campo</div>
          <div class="page-subtitle">Anotações qualitativas para subsidiar a devolutiva final e intervenções pedagógicas</div>
        </div>
        <button class="btn btn-primary btn-add-note" id="btnNewQualitativeNote" onclick="openQualitativeNoteModal()">
          + Nova Ocorrência de Campo
        </button>
      </div>

<!-- DEPOIS -->
    <!-- ================= SCREEN 8: REGISTROS QUALITATIVOS (OCORRÊNCIAS DE CAMPO) ================= -->
    <section id="screenNotes" class="app-screen">
      <div class="page-title-row notes-header-row">
        <div>
          <div class="page-title">Ocorrências de Campo</div>
          <div class="page-subtitle">Anotações qualitativas para subsidiar a devolutiva final e intervenções pedagógicas</div>
        </div>
      </div>
```

---

### Passo 2: Higienização das Referências em `applyUserRoleUI()`

No arquivo `index.html` (linha ~9465 a 9590):

1. **Remover a declaração da constante (linha ~9465):**
```javascript
// ANTES
      const homeDraftsContainer = document.getElementById('homeDraftsContainer');
      const btnNewQualitativeNote = document.getElementById('btnNewQualitativeNote');
      const homeScheduleBanner = document.getElementById('homeScheduleBanner');

// DEPOIS
      const homeDraftsContainer = document.getElementById('homeDraftsContainer');
      const homeScheduleBanner = document.getElementById('homeScheduleBanner');
```

2. **Remover o reset padrão de visibilidade (linha ~9491):**
```javascript
// ANTES
      if (homeDraftsContainer) {
        homeDraftsContainer.style.display = 'flex';
        homeDraftsContainer.style.flexDirection = 'column';
      }
      if (btnNewQualitativeNote) btnNewQualitativeNote.style.display = 'inline-flex';

// DEPOIS
      if (homeDraftsContainer) {
        homeDraftsContainer.style.display = 'flex';
        homeDraftsContainer.style.flexDirection = 'column';
      }
```

3. **Remover a ocultação no perfil Coordenadora do Núcleo de EI (linha ~9549):**
```javascript
// ANTES
        if (homeDraftsContainer) homeDraftsContainer.style.display = 'none';
        if (btnNewQualitativeNote) btnNewQualitativeNote.style.display = 'none';
      } else if (user.roleKey === 'pendente') {

// DEPOIS
        if (homeDraftsContainer) homeDraftsContainer.style.display = 'none';
      } else if (user.roleKey === 'pendente') {
```

4. **Remover a ocultação no perfil Pendente (linha ~9566):**
```javascript
// ANTES
        if (homeDraftsContainer) homeDraftsContainer.style.display = 'none';
        if (btnNewQualitativeNote) btnNewQualitativeNote.style.display = 'none';
      } else if (user.roleKey === 'professora') {

// DEPOIS
        if (homeDraftsContainer) homeDraftsContainer.style.display = 'none';
      } else if (user.roleKey === 'professora') {
```

5. **Remover a ocultação no perfil Professora (linha ~9590):**
```javascript
// ANTES
        if (homeDraftsContainer) homeDraftsContainer.style.display = 'none';
        if (btnNewQualitativeNote) btnNewQualitativeNote.style.display = 'none';
      }

// DEPOIS
        if (homeDraftsContainer) homeDraftsContainer.style.display = 'none';
      }
```

---

### Passo 3: Inclusão da Asserção no Módulo `travas_seguranca` da Auditoria

No arquivo `index.html` (linha ~23525):

```javascript
// ANTES
              // TESTE PILAR 1 REESTRUTURADO (VERSÃO 0.97): Validação Estrita do Modal de Ocorrências
              // 1. Teste de Ausência Física dos Elementos Removidos no DOM
              if (document.getElementById('noteSchool') !== null ||
                  document.getElementById('noteClass') !== null ||
                  document.getElementById('noteTopic') !== null ||
                  document.getElementById('noteObsContextAlert') !== null) {
                throw new Error('Elementos suprimidos do modal de ocorrência continuam presentes no DOM');
              }
              logger.log('Supressão confirmada de campos redundantes no modal de ocorrência', true, 'noteSchool, noteClass, noteTopic e noteObsContextAlert removidos');

// DEPOIS
              // TESTE PILAR 1 REESTRUTURADO: Validação Estrita do Modal e Gestão de Ocorrências
              // 1. Teste de Ausência Física dos Elementos Removidos no DOM
              if (document.getElementById('noteSchool') !== null ||
                  document.getElementById('noteClass') !== null ||
                  document.getElementById('noteTopic') !== null ||
                  document.getElementById('noteObsContextAlert') !== null) {
                throw new Error('Elementos suprimidos do modal de ocorrência continuam presentes no DOM');
              }
              // Validação da Supressão do Botão de Nova Ocorrência na Tela de Registros Formativos (v1.22)
              if (document.getElementById('btnNewQualitativeNote') !== null) {
                throw new Error('Botão de nova ocorrência (#btnNewQualitativeNote) continua indevidamente presente no DOM da tela de registros formativos');
              }
              logger.log('Supressão confirmada de campos redundantes e do botão #btnNewQualitativeNote em registros formativos', true);
```

---

### Passo 4: Atualização da Versão para 1.22 no Cabeçalho e Teste de Navegação

1. **No botão do Changelog (`#btnChangelog`, linha ~3298):**
```html
<!-- ANTES -->
          📌 Versão 1.21 (v7.99)

<!-- DEPOIS -->
          📌 Versão 1.22 (v8.00)
```

2. **No `#modalChangelog` (linha ~4874):**
Inserir no topo dos cards de release:
```html
      <!-- VERSÃO 1.22 - REMOÇÃO DO BOTÃO INCONSISTENTE DE NOVA OCORRÊNCIA EM REGISTROS FORMATIVOS -->
      <div class="card" style="margin-bottom:16px; border-left:4px solid #0066CC;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span style="font-size:14px; font-weight:800; color:#0066CC;">Versão 1.22 · v8.00 (Oficial)</span>
          <span style="font-size:11px; background:#EFF6FF; color:#1E40AF; padding:2px 8px; border-radius:12px; font-weight:700;">23/10/2026</span>
        </div>
        <div style="font-size:12px; font-weight:700; color:var(--text-primary); margin-bottom:6px;">
          Remoção do Botão de Nova Ocorrência da Tela de Registros Formativos e Alinhamento Estrito aos Pilares 1 e 13:
        </div>
        <ul style="font-size:12px; color:var(--text-secondary); margin:0; padding-left:18px; line-height:1.5;">
          <li>🚫 <strong>Eliminação de Ponto Cego e Bloqueio Enganoso:</strong> Remoção física do botão <code>+ Nova Ocorrência de Campo</code> (<code>#btnNewQualitativeNote</code>) do módulo de Registros Formativos (<code>screenNotes</code>), que disparava bloqueio orientador por não haver observação em andamento.</li>
          <li>🎯 <strong>Aderência Estrita à Regra de Negócio Canônica (Pilares 1 e 13):</strong> Ocorrências de campo são geradas com contexto integral (escola, turma e regentes) exclusivamente durante a observação pedagógica ativa via menu de opções flutuante (FAB). A tela de registros preserva com integridade seu papel de consulta, acompanhamento de diálogos ("Marcar como Conversado"), arquivamento e exportação.</li>
          <li>🛡️ <strong>Higienização de Código e Asserção Automatizada:</strong> Limpeza completa das referências em <code>applyUserRoleUI()</code> e inclusão de verificação no módulo <code>travas_seguranca</code> da auditoria da plataforma.</li>
        </ul>
      </div>
```

3. **No módulo `navegacao_layout` da auditoria (linha ~24594):**
```javascript
// ANTES
              // Validação do rótulo atualizado do botão de changelog e card da versão 1.21
              if (!btnChangelog.textContent.includes('Versão 1.21')) {
                throw new Error('#btnChangelog não exibe a indicação da Versão 1.21');
              }
              if (!modalChg.innerHTML.includes('Versão 1.21')) {
                throw new Error('#modalChangelog não contém o card descritivo da Versão 1.21');
              }
              logger.log('Asserção de Integridade do Cabeçalho e Registro da Versão 1.21 (v7.99)', true);

// DEPOIS
              // Validação do rótulo atualizado do botão de changelog e card da versão 1.22
              if (!btnChangelog.textContent.includes('Versão 1.22')) {
                throw new Error('#btnChangelog não exibe a indicação da Versão 1.22');
              }
              if (!modalChg.innerHTML.includes('Versão 1.22')) {
                throw new Error('#modalChangelog não contém o card descritivo da Versão 1.22');
              }
              logger.log('Asserção de Integridade do Cabeçalho e Registro da Versão 1.22 (v8.00)', true);
```

---

### Passo 5: Atualização do `CHANGELOG.md`

Adicionar a entrada de versão 1.22 na tabela de sumário executivo e no corpo cronológico de `CHANGELOG.md`:

```markdown
| **1.22** | 23/10/2026 14:35 | `intermediárias/aplicativo_v122_remocao_botao_nova_ocorrencia_registros.html` | Solicitação direta / `plano_remocao_botao_nova_ocorrencia_registros.md` | Remoção do botão de nova ocorrência (#btnNewQualitativeNote) no módulo de Registros Formativos, alinhando a interface à regra canônica dos Pilares 1 e 13 (ocorrências vinculadas estritamente à observação ativa via menu FAB), higienização de referências no RBAC e asserção no módulo travas_seguranca 📝🚫 |
```

---

### Passo 6: Criação do Backup Intermediário

Salvar a cópia idêntica de pré-deploy em:
`intermediárias/aplicativo_v122_remocao_botao_nova_ocorrencia_registros.html`

---

### Passo 7: Sincronização Obrigatória das Cópias Espelhadas

Copiar o arquivo `index.html` modificado para:
1. `gestor supervisao_patos/index.html`
2. `gestor supervisao_patos/firebase_deploy/public/index.html`

---

## 4. Critérios de Aceite e Roteiro de Teste

1. **Ausência Física do Botão no DOM:**
   - O elemento `#btnNewQualitativeNote` deve retornar estritamente `null` na inspeção do DOM.
2. **Harmonia Visual do Cabeçalho:**
   - A tela de Registros Formativos (`screenNotes`) deve renderizar o título *"Ocorrências de Campo"* e o subtítulo explicativo de forma limpa, sem desalinhamentos em telas desktop ou mobile.
3. **Preservação Integral do Fluxo de Campo (FAB Menu):**
   - Durante uma observação em andamento (`appState.currentObs`), o acionamento de "Ocorrência de Campo" via menu flutuante FAB continua abrindo o modal `#modalQualitativeNote` normalmente com vinculação da turma e opções de regência coletiva ou conduta individual.
4. **Resguardo do Guardião Lógico:**
   - Chamadas programáticas de `openQualitativeNoteModal()` sem observação ativa continuam emitindo o toast de bloqueio protetor.
5. **Validação Sintática JSC Pré-Voo:**
   - O comando `python3 audit_platform.py --check-syntax` deve ser executado e retornar código de saída 0 sem nenhum erro sintático.
6. **Auditoria Headless 100% Aprovada:**
   - O comando `python3 audit_platform.py --silent-on-success` deve executar todos os 12 módulos canônicos (especialmente `travas_seguranca` e `navegacao_layout`) e ser concluído com êxito total.

---

## 5. Seção Obrigatória de Auditoria: Alterações no Algoritmo de Auditoria (`audit_platform.py` e `index.html`)

| Componente | Tipo de Modificação | Detalhamento Técnico |
| :--- | :---: | :--- |
| **`index.html` (`travas_seguranca`)** | **Adição** | Adicionada asserção determinística `if (document.getElementById('btnNewQualitativeNote') !== null) throw new Error(...)` para assegurar que o botão suprimido jamais seja reinserido acidentalmente. |
| **`index.html` (`navegacao_layout`)** | **Atualização** | Atualizada a validação do rótulo de versão no botão `#btnChangelog` e no `#modalChangelog` para a `Versão 1.22`. |
| **`audit_platform.py`** | **Nenhuma alteração de código necessária** | O orquestrador headless executa a suíte canônica de 12 módulos de forma transparente; a nova asserção é avaliada pelo módulo `travas_seguranca` e validada na engine headless com saída limpa em caso de sucesso (`--silent-on-success`). |
