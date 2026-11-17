# PLANO DE IMPLEMENTAÇÃO: PILAR 18 - PADRONIZAÇÃO RIGOROSA DAS FAIXAS ETÁRIAS DA EDUCAÇÃO INFANTIL REGULAR E TURMAS MULTIETAPA

> **DIRETRIZ OBRIGATÓRIA DE EXECUÇÃO (ETAPA 2):**
> O assistente executor (Etapa 2) deve **obrigatoriamente ler e seguir as diretrizes dos arquivos `WORKFLOW_MACOS.md`, `AGENTS.md` e a skill `execucao-operario`** antes de aplicar qualquer modificação no código. Nenhuma modificação deve ser realizada sem conformidade estrita com o workflow, incluindo:
> 1. Execução prévia de sincronização com o repositório remoto (`git pull origin main`).
> 2. Preservação integral das regras de negócio existentes, dados cadastrais, blindagens RBAC, série histórica e suíte de testes.
> 3. Conformidade estrita ao **Hallmark UI Standard**: uso exclusivo de CSS variables/tokens (`01_variables.css`), tipografia em sentence case desprovida de all-caps forçado, alvos de toque ergonômicos de no mínimo 44x44px, contenção em camada única sem cards aninhados, zero `transition: all` e zero emojis soltos como ícones.
> 4. Verificação de integridade pós-edição com dupla checagem de leitura em cada trecho modificado.
> 5. Validação sintática obrigatória com JavaScriptCore via `python3 audit_platform.py --check-syntax`.
> 6. Salvamento obrigatório do backup intermediário na pasta `intermediárias/` sob o nome `aplicativo_v1.74_pilar_18_padronizacao_faixas_etarias_infantil.html`.
> 7. Gestão dupla de Changelog no arquivo `CHANGELOG.md` e no modal `#modalChangelog` / botão `.btn-changelog` do `index.html`, registrando a **Versão 1.74**.
> 8. Sincronização idêntica entre o arquivo principal `index.html` da raiz e `gestor supervisao_patos/firebase_deploy/public/index.html`.
> 9. Checagem pré-push (`git fetch origin main`), rebase caso necessário, commit semântico (`feat: implementar pilar 18 - padronizacao rigorosa de faixas etarias e turmas multietapa`), push para `origin main` e deploy automático no GitHub Pages.
> 10. Execução pós-deploy obrigatória da suíte de auditoria (`python3 audit_platform.py --silent-on-success`) com comunicação estrita a falhas.

---

## 1. Diagnóstico e Contexto

### 1.1 Cenário Atual
Atualmente, no sistema de supervisão pedagógica SerTão Criança:
- No modal de cadastro e edição de turmas (`#modalClassEditor`), o seletor `#classEditorStage` apresenta opções desatualizadas e genéricas:
  ```html
  <select id="classEditorStage" class="form-select">
    <option value="Berçário I">Berçário I (0 a 1 ano)</option>
    <option value="Berçário II">Berçário II (1 a 2 anos)</option>
    <option value="Maternal I">Maternal I (2 a 3 anos)</option>
    <option value="Maternal II">Maternal II (3 a 4 anos)</option>
    <option value="Infantil I">Infantil I (4 a 5 anos)</option>
    <option value="Infantil II">Infantil II (5 a 6 anos)</option>
  </select>
  ```
- Essa taxonomia apresenta graves inconsistências em relação às Diretrizes Curriculares Nacionais para a Educação Infantil (DCNEI / Resolução CNE/CEB nº 5/2009) e ao vocabulário oficial regulamentado pela Secretaria Municipal de Educação de Patos/PB:
  1. A delimitação das faixas etárias não expressa a contagem de meses oficial do corte etário de 31 de março (`0 a 1 ano e 11 meses`, `1 ano a 1 ano e 11 meses`, `2 anos a 2 anos e 11 meses`, `3 anos a 3 anos e 11 meses`, `4 anos a 4 anos e 11 meses`, `5 anos a 5 anos e 11 meses`).
  2. Não contempla a realidade de **Turmas Multietapa (Multiadas)**, frequentes em unidades escolares polo, núcleos do campo ou salas integradas da rede, onde docentes atendem crianças de múltiplas faixas na mesma sala física.
  3. Não existe um campo aberto ou seletor de faixas abrangidas quando uma turma é multietapa, obrigando coordenadoras a improvisar rótulos no nome da turma.
  4. Na tela de setup da observação móvel (`#screenSetup`), nos cards de observação ativa (`#screenActiveObs`), na caracterização das Unidades Escolares (`#screenManagement`) e no Quadro de Controle Bimestral (`#screenIndicators`), a etapa é exibida de forma fragmentada ou omitida, dificultando diagnósticos pedagógicos comparativos por agrupamento etário real.

### 1.2 Fundamentação Técnico-Pedagógica (Reunião 03/11/2026 - Bruno Pereira da Silva e Carolina Machado, 00:59:59 - 01:01:12)
Conforme alinhamento executivo registrado na ata e transcrição técnica:
1. **Padronização Oficial das Faixas Etárias Regulares da Rede Municipal de Patos/PB:**
   - As turmas regulares devem obrigatoriamente refletir a taxonomia canônica:
     * `0 a 1 ano e 11 meses (Berçário / Creche I)`
     * `1 ano a 1 ano e 11 meses (Creche II)`
     * `2 anos a 2 anos e 11 meses (Creche III)`
     * `3 anos a 3 anos e 11 meses (Creche IV / Pré-escola Inicial)`
     * `4 anos a 4 anos e 11 meses (Pré-escola 1)`
     * `5 anos a 5 anos e 11 meses (Pré-escola 2)`
2. **Suporte a Turmas Multietapa (Multiadas):**
   - Criação da categoria canônica `Turma Multietapa (Multiada)`.
   - Ao selecionar essa categoria no editor de turmas, o sistema deve exibir de forma reativa um bloco de checkboxes com as 6 faixas oficiais, permitindo que a coordenação pedagógica assinale exatamente quais faixas compõem o grupamento daquela sala (ex: *4 anos a 4 anos e 11 meses* + *5 anos a 5 anos e 11 meses*).
3. **Resiliência e Retrocompatibilidade Absoluta com Dados Históricos e Testes:**
   - O sistema deve incorporar um helper inteligente de normalização (`normalizeStageName`) capaz de reconhecer valores legados (`Berçário I`, `Berçário II`, `Maternal I`, `Maternal II`, `Infantil I`, `Infantil II`) e mapeá-los de forma transparente para a nova nomenclatura sem corromper turmas existentes, observações antigas ou quebrar testes pré-existentes da auditoria.

### 1.3 Resultado Esperado com o Pilar 18
1. **Modal de Turma (`#modalClassEditor`):** Seletor `#classEditorStage` atualizado com as 7 categorias padronizadas e container condicional `#groupClassMultiStageDetails` para marcação das faixas em turmas multietapa.
2. **Setup de Observação (`#screenSetup`):** Exibição do badge institucional de etapa padronizada `#setupClassStageBadge` ao lado do badge de turno ao selecionar a turma.
3. **Observação Ativa Mobile (`#screenActiveObs`):** Cabeçalho de identificação `#activeObsMeta` exibindo a turma e sua etapa/faixa etária oficial.
4. **Quadro de Controle Bimestral (`#screenIndicators`):** Identificação clara da faixa etária/etapa logo abaixo do nome da turma na tabela desktop e nos cards mobile.
5. **Visão da UE e Turmas (`#screenManagement`):** Badges padronizados `.badge-hallmark-neutral` exibindo a etapa oficial e faixas multietapa atendidas.
6. **Exportação / Backup SSOT (`js/services/export_backup.js`):** Suporte completo à exportação e importação de turmas com as novas colunas e normalização automática.
7. **Auditoria Modular 100% Conforme:** Asserções nos Módulos 2, 3, 9 e 10 cobrindo a validação léxica, seleção aberta em multietapa, normalização de legados e integridade de exibição.

---

## 2. Arquitetura e Pontos de Impacto

### 2.1 Arquivos Afetados
- `index.html` (Estrutura do modal `#modalClassEditor`, seletor `#classEditorStage`, container `#groupClassMultiStageDetails`, badge `#setupClassStageBadge`, filtros de turmas)
- `js/config/catalog.js` (Definição de `CANONICAL_STAGES`, `INITIAL_CLASSES`, helpers `normalizeStageName`, `getStageDetails`, `formatClassStageBadge`)
- `js/features/management.js` (`openAddClassModal`, `openEditClassModal`, `onClassStageChange`, `saveClassEditor`, renderização de turmas da escola)
- `js/core/navigation.js` (`onSetupClassChange` atualizando `#setupClassStageBadge`)
- `js/features/observation.js` (`startNewObservation` persistindo `classStage` e `classMultiStages`, `renderActiveObservationUI` exibindo a etapa no cabeçalho)
- `js/features/indicators.js` (Exibição da etapa no Quadro de Controle Bimestral desktop e mobile)
- `js/features/history_notes.js` (`populateHistoryClassFilter` com as opções oficiais)
- `js/services/export_backup.js` (Exportação/importação de turmas resiliente com normalização de faixas)
- `js/audit/audit_engine.js` (Novas asserções do Pilar 18 nos Módulos 2, 3, 9 e 10)
- `CHANGELOG.md` e `#modalChangelog` (Registro da Versão 1.74)
- `intermediárias/aplicativo_v1.74_pilar_18_padronizacao_faixas_etarias_infantil.html` (Backup intermediário obrigatório)
- `gestor supervisao_patos/firebase_deploy/public/index.html` (Espelho de produção)

### 2.2 Estruturas de Dados Envolvidas

#### 1. Constante Canônica `CANONICAL_STAGES` (`js/config/catalog.js`):
```javascript
const CANONICAL_STAGES = [
  {
    id: 'creche_1',
    name: 'Berçário / Creche I',
    ageRange: '0 a 1 ano e 11 meses',
    fullLabel: '0 a 1 ano e 11 meses (Berçário / Creche I)',
    legacyAliases: ['berçário i', 'berçário 1', 'berçário', '0 a 1 ano', '0 a 1']
  },
  {
    id: 'creche_2',
    name: 'Creche II',
    ageRange: '1 ano a 1 ano e 11 meses',
    fullLabel: '1 ano a 1 ano e 11 meses (Creche II)',
    legacyAliases: ['berçário ii', 'berçário 2', 'creche ii', 'creche 2', '1 a 2 anos', '1 a 2']
  },
  {
    id: 'creche_3',
    name: 'Creche III',
    ageRange: '2 anos a 2 anos e 11 meses',
    fullLabel: '2 anos a 2 anos e 11 meses (Creche III)',
    legacyAliases: ['maternal i', 'maternal 1', 'creche iii', 'creche 3', '2 a 3 anos', '2 a 3']
  },
  {
    id: 'creche_4',
    name: 'Creche IV / Pré-escola Inicial',
    ageRange: '3 anos a 3 anos e 11 meses',
    fullLabel: '3 anos a 3 anos e 11 meses (Creche IV / Pré-escola Inicial)',
    legacyAliases: ['maternal ii', 'maternal 2', 'creche iv', 'creche 4', '3 a 4 anos', '3 a 4']
  },
  {
    id: 'pre_1',
    name: 'Pré-escola 1',
    ageRange: '4 anos a 4 anos e 11 meses',
    fullLabel: '4 anos a 4 anos e 11 meses (Pré-escola 1)',
    legacyAliases: ['infantil i', 'infantil 1', 'pré-escola 1', 'pre-escola 1', 'pré 1', 'pre 1', '4 a 5 anos', '4 a 5']
  },
  {
    id: 'pre_2',
    name: 'Pré-escola 2',
    ageRange: '5 anos a 5 anos e 11 meses',
    fullLabel: '5 anos a 5 anos e 11 meses (Pré-escola 2)',
    legacyAliases: ['infantil ii', 'infantil 2', 'pré-escola 2', 'pre-escola 2', 'pré 2', 'pre 2', '5 a 6 anos', '5 a 6']
  },
  {
    id: 'multietapa',
    name: 'Turma Multietapa (Multiada)',
    ageRange: 'Multietapa (Faixas Múltiplas)',
    fullLabel: 'Turma Multietapa (Multiada)',
    isMultiStage: true,
    legacyAliases: ['multietapa', 'multiada', 'multisseriada', 'turma mista']
  }
];
```

#### 2. Campos Expandidos no Objeto Turma (`appState.classes`):
```javascript
{
  id: 'cls-pml-01',
  name: 'Infantil I - Turma A',
  school: 'CEI Professora Maria de Lourdes',
  stage: '4 anos a 4 anos e 11 meses (Pré-escola 1)', // Valor canônico normalizado
  multiStages: [], // Preenchido com array de faixas caso stage === 'Turma Multietapa (Multiada)'
  shift: 'Tempo Parcial (Matutino)',
  teachers: ['Ana Carolina Silva'],
  totalStudents: 25,
  inclusiveStudents: 1
}
```

#### 3. Campos no Objeto de Observação (`newObs`):
```javascript
{
  // Metadados existentes...
  className: 'Infantil I - Turma A',
  classShift: 'Tempo Parcial (Matutino)',
  classStage: '4 anos a 4 anos e 11 meses (Pré-escola 1)',
  classMultiStages: []
}
```

---

## 3. Especificação de Implementação Passo a Passo (Snippets Exatos)

### Passo 1: Definição da Taxonomia Canônica e Helpers em `js/config/catalog.js`
Inserir `CANONICAL_STAGES`, o helper `normalizeStageName(stageStr)` e utilitários de formatação logo após `formatMECShift`:

```javascript
    // --- 1.1b TAXONOMIA CANÔNICA DE FAIXAS ETÁRIAS DA EDUCAÇÃO INFANTIL (PILAR 18) ---
    const CANONICAL_STAGES = [
      {
        id: 'creche_1',
        name: 'Berçário / Creche I',
        ageRange: '0 a 1 ano e 11 meses',
        fullLabel: '0 a 1 ano e 11 meses (Berçário / Creche I)',
        legacyAliases: ['berçário i', 'berçário 1', 'berçário', '0 a 1 ano', '0 a 1']
      },
      {
        id: 'creche_2',
        name: 'Creche II',
        ageRange: '1 ano a 1 ano e 11 meses',
        fullLabel: '1 ano a 1 ano e 11 meses (Creche II)',
        legacyAliases: ['berçário ii', 'berçário 2', 'creche ii', 'creche 2', '1 a 2 anos', '1 a 2']
      },
      {
        id: 'creche_3',
        name: 'Creche III',
        ageRange: '2 anos a 2 anos e 11 meses',
        fullLabel: '2 anos a 2 anos e 11 meses (Creche III)',
        legacyAliases: ['maternal i', 'maternal 1', 'creche iii', 'creche 3', '2 a 3 anos', '2 a 3']
      },
      {
        id: 'creche_4',
        name: 'Creche IV / Pré-escola Inicial',
        ageRange: '3 anos a 3 anos e 11 meses',
        fullLabel: '3 anos a 3 anos e 11 meses (Creche IV / Pré-escola Inicial)',
        legacyAliases: ['maternal ii', 'maternal 2', 'creche iv', 'creche 4', '3 a 4 anos', '3 a 4']
      },
      {
        id: 'pre_1',
        name: 'Pré-escola 1',
        ageRange: '4 anos a 4 anos e 11 meses',
        fullLabel: '4 anos a 4 anos e 11 meses (Pré-escola 1)',
        legacyAliases: ['infantil i', 'infantil 1', 'pré-escola 1', 'pre-escola 1', 'pré 1', 'pre 1', '4 a 5 anos', '4 a 5']
      },
      {
        id: 'pre_2',
        name: 'Pré-escola 2',
        ageRange: '5 anos a 5 anos e 11 meses',
        fullLabel: '5 anos a 5 anos e 11 meses (Pré-escola 2)',
        legacyAliases: ['infantil ii', 'infantil 2', 'pré-escola 2', 'pre-escola 2', 'pré 2', 'pre 2', '5 a 6 anos', '5 a 6']
      },
      {
        id: 'multietapa',
        name: 'Turma Multietapa (Multiada)',
        ageRange: 'Multietapa (Faixas Múltiplas)',
        fullLabel: 'Turma Multietapa (Multiada)',
        isMultiStage: true,
        legacyAliases: ['multietapa', 'multiada', 'multisseriada', 'turma mista']
      }
    ];

    /**
     * Normaliza termos legados ou parciais para a etiqueta canônica oficial de Patos/PB
     * @param {string} stageStr - Nome ou alias da etapa
     * @returns {string} Rótulo canônico oficial completo
     */
    function normalizeStageName(stageStr) {
      if (!stageStr || typeof stageStr !== 'string') {
        return '4 anos a 4 anos e 11 meses (Pré-escola 1)';
      }
      const raw = stageStr.trim();
      const lower = raw.toLowerCase();

      // Casamento exato com fullLabel ou name
      const exactMatch = CANONICAL_STAGES.find(s => s.fullLabel.toLowerCase() === lower || s.name.toLowerCase() === lower);
      if (exactMatch) return exactMatch.fullLabel;

      // Casamento com legacyAliases
      for (const st of CANONICAL_STAGES) {
        if (st.legacyAliases && st.legacyAliases.some(alias => lower.includes(alias))) {
          return st.fullLabel;
        }
      }

      // Regras de inferência por faixa etária numérica
      if (lower.includes('0 a 1') || lower.includes('berçário i') || lower === 'berçário') {
        return '0 a 1 ano e 11 meses (Berçário / Creche I)';
      }
      if (lower.includes('1 ano a 1') || lower.includes('1 a 2') || lower.includes('berçário ii')) {
        return '1 ano a 1 ano e 11 meses (Creche II)';
      }
      if (lower.includes('2 anos a 2') || lower.includes('2 a 3') || lower.includes('maternal i')) {
        return '2 anos a 2 anos e 11 meses (Creche III)';
      }
      if (lower.includes('3 anos a 3') || lower.includes('3 a 4') || lower.includes('maternal ii')) {
        return '3 anos a 3 anos e 11 meses (Creche IV / Pré-escola Inicial)';
      }
      if (lower.includes('4 anos a 4') || lower.includes('4 a 5') || lower.includes('infantil i')) {
        return '4 anos a 4 anos e 11 meses (Pré-escola 1)';
      }
      if (lower.includes('5 anos a 5') || lower.includes('5 a 6') || lower.includes('infantil ii')) {
        return '5 anos a 5 anos e 11 meses (Pré-escola 2)';
      }
      if (lower.includes('multi')) {
        return 'Turma Multietapa (Multiada)';
      }

      return raw;
    }

    /**
     * Retorna o badge HTML Hallmark da etapa padronizada com suporte a multietapa
     * @param {Object|string} classOrStage - Objeto turma ou string de etapa
     * @returns {string} HTML com o badge sóbrio formatado
     */
    function formatStageBadge(classOrStage) {
      const stageStr = typeof classOrStage === 'string' ? classOrStage : (classOrStage?.stage || '');
      const multiStages = (typeof classOrStage === 'object' && Array.isArray(classOrStage?.multiStages)) ? classOrStage.multiStages : [];
      const normalized = normalizeStageName(stageStr);

      if (normalized === 'Turma Multietapa (Multiada)') {
        const subText = multiStages.length > 0 ? ` (${multiStages.length} faixas)` : '';
        return `<span class="badge-hallmark-neutral" title="Turma Multietapa: ${multiStages.join(', ') || 'Faixas integradas'}">Multietapa${subText}</span>`;
      }
      return `<span class="badge-hallmark-neutral">${normalized}</span>`;
    }
```

Atualizar `INITIAL_CLASSES` em `js/config/catalog.js` para utilizar a nova taxonomia canônica:
```javascript
    const INITIAL_CLASSES = [
      {
        id: 'cls-pml-01',
        name: 'Infantil I - Turma A',
        school: 'CEI Professora Maria de Lourdes',
        stage: '4 anos a 4 anos e 11 meses (Pré-escola 1)',
        shift: 'Tempo Parcial (Matutino)',
        teachers: ['Ana Carolina Silva'],
        totalStudents: 25,
        inclusiveStudents: 1
      },
      {
        id: 'cls-pml-02',
        name: 'Berçário II - Turma Única',
        school: 'CEI Professora Maria de Lourdes',
        stage: '1 ano a 1 ano e 11 meses (Creche II)',
        shift: 'Tempo Parcial (Matutino)',
        teachers: ['Carla Beatriz Mendes'],
        totalStudents: 15,
        inclusiveStudents: 0
      },
      {
        id: 'cls-pml-03',
        name: 'Infantil II - Turma B',
        school: 'CEI Professora Maria de Lourdes',
        stage: '5 anos a 5 anos e 11 meses (Pré-escola 2)',
        shift: 'Tempo Parcial (Vespertino)',
        teachers: ['Juliana Roberta Rocha'],
        totalStudents: 24,
        inclusiveStudents: 2
      },
      {
        id: 'cls-pml-04',
        name: 'Maternal II - Turma Integral',
        school: 'CEI Professora Maria de Lourdes',
        stage: '3 anos a 3 anos e 11 meses (Creche IV / Pré-escola Inicial)',
        shift: 'Tempo Integral',
        teachersMorning: ['Mariana Santos', 'Roberta Dias'],
        teachersAfternoon: ['Patricia Souza', 'Camila Vasconcelos'],
        teachers: ['Mariana Santos', 'Roberta Dias', 'Patricia Souza', 'Camila Vasconcelos'],
        totalStudents: 20,
        inclusiveStudents: 1
      },
      {
        id: 'cls-pp-01',
        name: 'Maternal I - Turma A',
        school: 'EMEI Pequeno Príncipe',
        stage: '2 anos a 2 anos e 11 meses (Creche III)',
        shift: 'Tempo Parcial (Matutino)',
        teachers: ['Fernanda Lima'],
        totalStudents: 22,
        inclusiveStudents: 1
      },
      {
        id: 'cls-pp-02',
        name: 'Infantil I - Turma B',
        school: 'EMEI Pequeno Príncipe',
        stage: '4 anos a 4 anos e 11 meses (Pré-escola 1)',
        shift: 'Tempo Parcial (Vespertino)',
        teachers: ['Luciana Ramos'],
        totalStudents: 26,
        inclusiveStudents: 0
      },
      {
        id: 'cls-vz-01',
        name: 'Maternal II - Turma Única',
        school: 'CEI Vovó Zezé',
        stage: '3 anos a 3 anos e 11 meses (Creche IV / Pré-escola Inicial)',
        shift: 'Tempo Integral',
        teachersMorning: [],
        teachersAfternoon: [],
        teachers: [],
        totalStudents: 18,
        inclusiveStudents: 1
      }
    ];
```

---

### Passo 2: Atualização do Modal de Turma em `index.html`
Substituir o grupo de seleção da etapa (`#classEditorStage`) e inserir o bloco condicional de faixas multietapa (`#groupClassMultiStageDetails`) em `#modalClassEditor`:

```html
      <div class="form-group">
        <label class="form-label" for="classEditorStage">Etapa e Faixa Etária Oficial (MEC / Patos-PB)</label>
        <select id="classEditorStage" class="form-select" onchange="onClassStageChange()">
          <option value="0 a 1 ano e 11 meses (Berçário / Creche I)">0 a 1 ano e 11 meses (Berçário / Creche I)</option>
          <option value="1 ano a 1 ano e 11 meses (Creche II)">1 ano a 1 ano e 11 meses (Creche II)</option>
          <option value="2 anos a 2 anos e 11 meses (Creche III)">2 anos a 2 anos e 11 meses (Creche III)</option>
          <option value="3 anos a 3 anos e 11 meses (Creche IV / Pré-escola Inicial)">3 anos a 3 anos e 11 meses (Creche IV / Pré-escola Inicial)</option>
          <option value="4 anos a 4 anos e 11 meses (Pré-escola 1)" selected>4 anos a 4 anos e 11 meses (Pré-escola 1)</option>
          <option value="5 anos a 5 anos e 11 meses (Pré-escola 2)">5 anos a 5 anos e 11 meses (Pré-escola 2)</option>
          <option value="Turma Multietapa (Multiada)">Turma Multietapa (Multiada)</option>
        </select>
      </div>

      <!-- PILAR 18: SELEÇÃO ABERTA DE FAIXAS ABRANGIDAS EM TURMA MULTIETAPA -->
      <div class="form-group" id="groupClassMultiStageDetails" style="display:none; background:#F8FAFC; border:1px solid var(--border-subtle); border-radius:8px; padding:12px; margin-top:-4px; margin-bottom:14px;">
        <label class="form-label" style="font-size:12px; font-weight:700; color:var(--text-primary); margin-bottom:4px;">
          Faixas Etárias Atendidas nesta Turma Multietapa:
        </label>
        <p style="font-size:11px; color:var(--text-secondary); margin-top:0; margin-bottom:8px;">
          Selecione todas as faixas que compartilham a mesma regência e espaço nesta sala:
        </p>
        <div style="display:grid; grid-template-columns:1fr; gap:6px;" id="classEditorMultiStageCheckboxes">
          <label style="display:flex; align-items:center; gap:8px; font-size:12px; cursor:pointer; min-height:44px; padding:4px 0;">
            <input type="checkbox" name="classMultiStage" value="0 a 1 ano e 11 meses (Berçário / Creche I)">
            <span>0 a 1 ano e 11 meses (Berçário / Creche I)</span>
          </label>
          <label style="display:flex; align-items:center; gap:8px; font-size:12px; cursor:pointer; min-height:44px; padding:4px 0;">
            <input type="checkbox" name="classMultiStage" value="1 ano a 1 ano e 11 meses (Creche II)">
            <span>1 ano a 1 ano e 11 meses (Creche II)</span>
          </label>
          <label style="display:flex; align-items:center; gap:8px; font-size:12px; cursor:pointer; min-height:44px; padding:4px 0;">
            <input type="checkbox" name="classMultiStage" value="2 anos a 2 anos e 11 meses (Creche III)">
            <span>2 anos a 2 anos e 11 meses (Creche III)</span>
          </label>
          <label style="display:flex; align-items:center; gap:8px; font-size:12px; cursor:pointer; min-height:44px; padding:4px 0;">
            <input type="checkbox" name="classMultiStage" value="3 anos a 3 anos e 11 meses (Creche IV / Pré-escola Inicial)">
            <span>3 anos a 3 anos e 11 meses (Creche IV / Pré-escola Inicial)</span>
          </label>
          <label style="display:flex; align-items:center; gap:8px; font-size:12px; cursor:pointer; min-height:44px; padding:4px 0;">
            <input type="checkbox" name="classMultiStage" value="4 anos a 4 anos e 11 meses (Pré-escola 1)">
            <span>4 anos a 4 anos e 11 meses (Pré-escola 1)</span>
          </label>
          <label style="display:flex; align-items:center; gap:8px; font-size:12px; cursor:pointer; min-height:44px; padding:4px 0;">
            <input type="checkbox" name="classMultiStage" value="5 anos a 5 anos e 11 meses (Pré-escola 2)">
            <span>5 anos a 5 anos e 11 meses (Pré-escola 2)</span>
          </label>
        </div>
      </div>
```

---

### Passo 3: Badge de Etapa no Setup de Observação em `index.html`
Em `#screenSetup`, dentro de `#groupSetupTeachersCard`, adicionar o badge `#setupClassStageBadge` ao lado de `#setupClassShiftBadge`:

```html
          <!-- Card Dinâmico com a Equipe de Docentes Regentes Titulares da Turma (Pilar 1) -->
          <div id="groupSetupTeachersCard" style="display:none; background:#F0F7FF; border:1px solid #BFDBFE; border-left:5px solid #2563EB; border-radius:10px; padding:14px; margin-bottom:18px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
              <span style="font-size:11px; font-weight:800; text-transform:uppercase; color:#1D4ED8; letter-spacing:0.5px;">
                Equipe de regência titular da turma
              </span>
              <div style="display:flex; align-items:center; gap:6px;">
                <span id="setupClassStageBadge" class="badge-hallmark-neutral" style="font-size:10px; display:none;">
                  <!-- Etapa padronizada -->
                </span>
                <span id="setupClassShiftBadge" style="font-size:10px; font-weight:700; background:#DBEAFE; color:#1E40AF; padding:2px 8px; border-radius:12px;">
                  Parcial Matutino
                </span>
              </div>
            </div>
            <div id="setupClassTeachersList" style="display:flex; flex-wrap:wrap; gap:8px; margin-top:8px;">
              <!-- Badges dinâmicos das docentes -->
            </div>
          </div>
```

---

### Passo 4: Atualização de `js/features/management.js`
1. **Adicionar função `onClassStageChange()`:**
```javascript
    function onClassStageChange() {
      const stageSelect = document.getElementById('classEditorStage');
      const multiGroup = document.getElementById('groupClassMultiStageDetails');
      if (!stageSelect || !multiGroup) return;

      const isMulti = stageSelect.value === 'Turma Multietapa (Multiada)';
      multiGroup.style.display = isMulti ? 'block' : 'none';
    }
```

2. **Ajustar `openAddClassModal()`:**
```javascript
    function openAddClassModal() {
      // ... verificações de RBAC existentes ...
      document.getElementById('modalClassEditorTitle').innerText = 'Cadastrar Nova Turma';
      document.getElementById('editClassId').value = '';
      document.getElementById('classEditorName').value = '';
      document.getElementById('classEditorStage').value = '4 anos a 4 anos e 11 meses (Pré-escola 1)';
      
      // Limpa checkboxes de multietapa
      document.querySelectorAll('input[name="classMultiStage"]').forEach(cb => cb.checked = false);
      onClassStageChange();

      document.getElementById('classEditorShiftType').value = 'parcial';
      document.getElementById('classEditorShiftPeriod').value = 'Tempo Parcial (Matutino)';
      // ... restante da função preservado ...
```

3. **Ajustar `openEditClassModal(classId)`:**
```javascript
    function openEditClassModal(classId) {
      // ... verificações existentes ...
      document.getElementById('modalClassEditorTitle').innerText = `Editar Turma: ${cls.name}`;
      document.getElementById('editClassId').value = cls.id;
      document.getElementById('classEditorName').value = cls.name;

      // Normalização e atribuição da etapa canônica
      const normalizedStage = normalizeStageName(cls.stage);
      document.getElementById('classEditorStage').value = normalizedStage;

      // Preenchimento de checkboxes multietapa
      const isMulti = normalizedStage === 'Turma Multietapa (Multiada)';
      const multiStages = Array.isArray(cls.multiStages) ? cls.multiStages : [];
      document.querySelectorAll('input[name="classMultiStage"]').forEach(cb => {
        cb.checked = isMulti && multiStages.includes(cb.value);
      });
      onClassStageChange();
      // ... restante da função preservado ...
```

4. **Ajustar `saveClassEditor()`:**
```javascript
    function saveClassEditor() {
      // ... verificações existentes ...
      const stage = document.getElementById('classEditorStage').value;
      const isMultiStage = stage === 'Turma Multietapa (Multiada)';
      let finalMultiStages = [];

      if (isMultiStage) {
        document.querySelectorAll('input[name="classMultiStage"]:checked').forEach(cb => {
          finalMultiStages.push(cb.value);
        });
        if (finalMultiStages.length === 0) {
          showToast('Atenção: Para turmas multietapa, selecione ao menos uma faixa etária atendida.');
          return;
        }
      }

      // ... montagem de finalShift e validação anti-colisão do Pilar 17 ...

      if (id) {
        // Edição
        appState.classes[idx] = {
          ...appState.classes[idx],
          name,
          school,
          stage,
          multiStages: finalMultiStages,
          shift: finalShift,
          teachers: finalTeachers,
          teachersMorning: finalMorning,
          teachersAfternoon: finalAfternoon,
          totalStudents,
          inclusiveStudents
        };
      } else {
        // Nova turma
        const newClass = {
          id: 'cls-' + Date.now(),
          name,
          school,
          academicYear: appState.selectedAcademicYear || '2026',
          stage,
          multiStages: finalMultiStages,
          shift: finalShift,
          teachers: finalTeachers,
          teachersMorning: finalMorning,
          teachersAfternoon: finalAfternoon,
          totalStudents,
          inclusiveStudents
        };
        appState.classes.push(newClass);
      }
      saveState();
      // ... fechamento e toasts existentes ...
```

5. **Exibição dos badges na listagem de turmas da escola (`renderSchoolClassesTable` e cards):**
Substituir `${cls.stage || 'Educação Infantil'}` pelo helper formatador:
```javascript
formatStageBadge(cls)
```

---

### Passo 5: Atualização de `js/core/navigation.js`
Em `onSetupClassChange()`, atualizar a visibilidade e o texto do badge `#setupClassStageBadge`:

```javascript
      const stageBadge = document.getElementById('setupClassStageBadge');
      if (targetClass) {
        if (stageBadge) {
          const normStage = normalizeStageName(targetClass.stage);
          if (normStage === 'Turma Multietapa (Multiada)') {
            const mCount = Array.isArray(targetClass.multiStages) && targetClass.multiStages.length > 0 ? ` (${targetClass.multiStages.length} faixas)` : '';
            stageBadge.innerText = `Multietapa${mCount}`;
          } else {
            stageBadge.innerText = normStage;
          }
          stageBadge.style.display = 'inline-flex';
        }
        // ... restante de shiftBadge e validações ...
```

---

### Passo 6: Atualização de `js/features/observation.js`
1. Em `startNewObservation()`, incluir os campos de etapa no objeto `newObs`:
```javascript
        classId: targetClassObj?.id || null,
        className: className,
        classShift: targetClassObj?.shift || (isIntegral ? 'Integral' : 'Parcial Matutino'),
        classStage: targetClassObj?.stage ? normalizeStageName(targetClassObj.stage) : null,
        classMultiStages: Array.isArray(targetClassObj?.multiStages) ? [...targetClassObj.multiStages] : [],
        isIntegral: isIntegral,
```

2. Em `renderActiveObservationUI()`, exibir a etapa no cabeçalho mobile `#activeObsMeta`:
```javascript
      if (obs.evaluatedType === 'turma') {
        document.getElementById('activeObsTeacher').innerText = `Turma: ${obs.className} (${obs.bimester || 'Acompanhamento'})`;
        const teachersDisplay = obs.teachers && obs.teachers.length > 0 ? obs.teachers.join(', ') : obs.teacherName;
        const stageDisplay = obs.classStage ? ` · ${obs.classStage}` : '';
        document.getElementById('activeObsMeta').innerText = `Docentes Regentes: ${teachersDisplay} · Escola: ${obs.schoolName}${stageDisplay} · Supervisor(a): ${obs.evaluatedBy} · Data: ${dateDisplay} · Início: ${obs.startTime || '08:00'}`;
      }
```

---

### Passo 7: Atualização de `js/features/indicators.js`
No Quadro de Controle Bimestral (`renderBimesterSemaphoreSection`), incluir a etiqueta da etapa formatada abaixo do nome da turma:

1. **Na linha da tabela desktop:**
```javascript
            // Linha da Tabela Desktop
            const stageLabelHtml = cls.stage ? `<div style="font-size:11px; color:var(--text-secondary); margin-top:1px;">${normalizeStageName(cls.stage)}</div>` : '';
            tableRows += `
              <tr>
                <td>
                  <strong style="color:var(--text-primary); font-size:13px;">${cls.name}</strong>
                  ${stageLabelHtml}
                  <div style="font-size:11px; color:var(--text-secondary); margin-top:2px;">
                    <span style="font-weight:700; color:var(--primary);">${shiftStr}</span> · ${teachersStr}
                  </div>
                </td>
                ${bimesterCellsHtml}
                <td>${cycleProgressHtml}</td>
                // ...
```

2. **No card mobile:**
```javascript
            // Card Mobile
            mobileCards += `
              <div class="sem-mobile-class-card ${item.hasOverdue ? 'has-overdue' : ''}">
                <div class="sem-mobile-card-header">
                  <div>
                    <div class="sem-mobile-class-name">${cls.name}</div>
                    ${stageLabelHtml}
                    <div class="sem-mobile-class-sub"><span style="font-weight:700; color:var(--primary);">${shiftStr}</span> · ${teachersStr}</div>
                  </div>
                  <div>${cycleProgressHtml}</div>
                </div>
```

---

### Passo 8: Atualização de `js/services/export_backup.js`
Garantir que a clonagem de turmas para novo ciclo avaliativo preserve `stage` e `multiStages`:
```javascript
          const clonedClass = {
            id: 'cls-' + yearVal + '-' + Date.now() + '-' + idx,
            name: prevC.name,
            school: prevC.school,
            academicYear: yearVal,
            stage: normalizeStageName(prevC.stage),
            multiStages: Array.isArray(prevC.multiStages) ? [...prevC.multiStages] : [],
            shift: prevC.shift,
            teachers: [...(prevC.teachers || [])],
            teachersMorning: [...(prevC.teachersMorning || [])],
            teachersAfternoon: [...(prevC.teachersAfternoon || [])],
            totalStudents: prevC.totalStudents,
            inclusiveStudents: prevC.inclusiveStudents
          };
```

---

## 4. Critérios de Aceite e Roteiro de Teste

### 4.1 Critérios de Aceite
1. **Conformidade Léxica:** As 6 faixas oficiais e a opção `Turma Multietapa (Multiada)` estão presentes em `#classEditorStage` com a grafia oficial exata.
2. **Seleção Aberta Multietapa:** Ao selecionar `Turma Multietapa (Multiada)`, o bloco `#groupClassMultiStageDetails` torna-se visível com os 6 checkboxes. Se nenhuma faixa for assinalada ao salvar, o sistema bloqueia e emite toast de advertência. Ao assinalar faixas, elas são persistidas em `cls.multiStages`.
3. **Resiliência e Retrocompatibilidade:** Turmas antigas cadastradas com valores legados (`Infantil I`, `Berçário II`, `Maternal I`) são resolvidas sem erro através de `normalizeStageName` e exibem o rótulo canônico correspondente.
4. **Visibilidade no Setup e Observação Mobile:** Ao selecionar a turma no setup, o badge `#setupClassStageBadge` exibe a etapa e faixa etária. Na observação ativa, o cabeçalho `#activeObsMeta` apresenta a etapa formatada.
5. **Visibilidade no Quadro de Controle:** A tabela e os cards mobile do Quadro de Controle Bimestral exibem a etapa correspondente de cada turma.
6. **Hallmark UI Standard:** Cores gerenciadas por tokens CSS, tipografia em sentence case sem all-caps forçado, alvos de toque com altura mínima de 44px para checkboxes, zero `transition: all` e zero emojis soltos.
7. **Blindagem Sintática:** `python3 audit_platform.py --check-syntax` executa com 100% de sucesso via JavaScriptCore.

### 4.2 Roteiro de Teste Manual para Validação
1. Acessar a plataforma como Coordenadora Pedagógica Mariana Ferreira (`CEI Professora Maria de Lourdes`).
2. Abrir a aba **Minha Escola** ➔ **Turmas e Regência**.
3. Clicar em **+ Nova Turma** e verificar as opções do seletor de etapa: confirmar que estão ordenadas de `0 a 1 ano e 11 meses` até `5 anos a 5 anos e 11 meses` e `Turma Multietapa (Multiada)`.
4. Selecionar `Turma Multietapa (Multiada)`: confirmar a abertura imediata do container com os 6 checkboxes. Tentar salvar sem marcar nenhuma e verificar o toast impeditivo.
5. Marcar 2 faixas (ex: `4 anos a 4 anos e 11m` e `5 anos a 5 anos e 11m`), nomear a turma como `Multietapa Sala 1` e salvar. Confirmar a exibição do badge `Multietapa (2 faixas)` na tabela.
6. Acessar **Nova Observação**, selecionar a turma criada e constatar a renderização do badge no card dinâmico.
7. Iniciar a observação e constatar a menção à etapa padronizada no cabeçalho do instrumento.

---

## 5. Seção Obrigatória de Auditoria (`audit_platform.py` e `audit_engine.js`)

### 5.1 Alterações no Motor de Auditoria (`js/audit/audit_engine.js`)

#### 1. Inclusão no Módulo 2 (`catalogo_dados`):
- **Asserção 2.1 (Taxonomia Oficial das Faixas Etárias - Pilar 18):**
  * Validar a existência de `CANONICAL_STAGES` com exatamente 7 categorias.
  * Validar que as faixas contemplam: `0 a 1 ano e 11 meses (Berçário / Creche I)`, `1 ano a 1 ano e 11 meses (Creche II)`, `2 anos a 2 anos e 11 meses (Creche III)`, `3 anos a 3 anos e 11 meses (Creche IV / Pré-escola Inicial)`, `4 anos a 4 anos e 11 meses (Pré-escola 1)`, `5 anos a 5 anos e 11 meses (Pré-escola 2)` e `Turma Multietapa (Multiada)`.
- **Asserção 2.2 (Retrocompatibilidade do Helper `normalizeStageName`):**
  * Testar normalização de termos legados: `normalizeStageName('Infantil I')` deve retornar `'4 anos a 4 anos e 11 meses (Pré-escola 1)'`.
  * `normalizeStageName('Berçário II')` deve retornar `'1 ano a 1 ano e 11 meses (Creche II)'`.
  * `normalizeStageName('Maternal I')` deve retornar `'2 anos a 2 anos e 11 meses (Creche III)'`.

#### 2. Inclusão no Módulo 9 (`catalogo_dados` / Gestão Descentralizada de Turmas):
- **Asserção 9.3 (Criação e Persistência de Turma Multietapa com Seleção Aberta de Faixas):**
  * Criar turma de teste multietapa com `multiStages = ['4 anos a 4 anos e 11 meses (Pré-escola 1)', '5 anos a 5 anos e 11 meses (Pré-escola 2)']`.
  * Validar resolução via `getClassesForSchool` e persistência na SSOT.
  * Validar formatação do badge via `formatStageBadge`.

#### 3. Inclusão no Módulo 3 (`setup_longitudinal`):
- **Asserção 3.3 (Badge de Etapa Padronizada no Setup Mobile - Pilar 18):**
  * Selecionar turma em `#setupClass` e verificar que `#setupClassStageBadge` é preenchido com a etapa padronizada correspondente e possui `style.display !== 'none'`.

#### 4. Inclusão no Módulo 10 (`indicadores_decisao`):
- **Asserção 10.5 (Identificação de Faixa Etária no Quadro de Controle Bimestral):**
  * Verificar que a tabela do Quadro de Controle Bimestral contém a etapa normalizada na primeira coluna de cada turma.

### 5.2 Exclusões e Substituições
- Nenhuma asserção pré-existente será excluída. O teste `stage: 'Pré-Escola (4 a 5 anos)'` existente no item 9.2 continuará funcionando perfeitamente devido à autocura e normalização transparente do helper `normalizeStageName`.

---

## 6. Próximos Passos
O presente plano detalha a especificação integral do Pilar 18, em perfeita conformidade com as deliberações de governança do programa SerTão Criança e o padrão Hallmark UI.

Aguardando a aprovação do usuário para transição à **Etapa 2 (O Operário)**.
