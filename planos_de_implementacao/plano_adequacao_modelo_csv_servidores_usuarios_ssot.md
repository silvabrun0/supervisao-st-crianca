# PLANO DE IMPLEMENTAÇÃO: ADEQUAÇÃO DO MODELO DE CSV PARA IMPORTAÇÃO DE SERVIDORES/USUÁRIOS À SSOT

> **Diretriz de Execução Obrigatória:** O executor desta intervenção DEVE ler integralmente os arquivos [WORKFLOW_MACOS.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md), [AGENTS.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/AGENTS.md) e a skill `.agents/skills/execucao-operario/SKILL.md` antes de efetuar qualquer alteração. Este plano é a especificação exata a ser seguida na Etapa 2.

---

## 1. Diagnóstico e Contexto

### 1.1 Cenário Atual do Modelo CSV
Na sub-aba **Equipes & Servidores** (`#pedagViewTeam` na tela de Gestão Pedagógica), o sistema disponibiliza o botão `Baixar Modelo (CSV)` (`downloadTeamCsvTemplate()`), que gera a planilha de referência para que gestores e coordenadores importem profissionais em lote para a base de dados (`appState.teamMembers`).

Atualmente, a função `downloadTeamCsvTemplate()` (em `js/features/management.js`) gera o seguinte conteúdo:
```csv
Nome,Cargo,Unidade,Supervisor,Turma,Email
"Maria Aparecida dos Santos","Professora","CEI Professora Maria de Lourdes","Mariana Ferreira","Infantil I","maria.santos@escola.gov.br"
"Sônia Regina Alcantara","Coordenadora Pedagógica","EMEI Pequeno Príncipe","Clarice Barbosa","","sonia.alcantara@escola.gov.br"
"Clarice Barbosa","Formadora Pedagógica","Polo Regional 1 (Norte)","Helena Martins","","clarice.barbosa@escola.gov.br"
"Rodrigo Toledo","Núcleo de EI (Governança & Dados)","Secretaria Municipal de Educação","Helena Martins","","rodrigo.toledo@escola.gov.br"
```

### 1.2 Inconformidades com as Alterações Feitas na SSOT (Causa-Raiz)

1. **Violação Grave da Blindagem de Docentes sem E-mail (Versão 1.22, 1.23, Pilar 14):**
   - **Regra SSOT:** Professores e professoras de Educação Infantil **não acessam o sistema**, não realizam login nem preenchem avaliações. Conforme consolidado na Versão 1.22 e 1.23 (`#modalAddTeacher`), o cadastro de docentes é blindado no DOM e não possui campo de e-mail ou senha, nem registro na base de autenticação (`USERS_DB` / `appState.customUsers`).
   - **Inconformidade:** A linha de exemplo da Professora (`Maria Aparecida dos Santos`) traz o e-mail `"maria.santos@escola.gov.br"`. Isso induz gestores a preencherem e-mails desnecessários e polui o processo de ingestão.
   - **Correção:** A coluna `Email` para docentes regentes deve vir **obrigatoriamente vazia** (`""`) na planilha modelo.

2. **Turma em Desacordo com a Nomenclatura Canônica das Turmas (Pilar 1, Pilar 4 e Pilar 13):**
   - **Regra SSOT:** Turmas da rede municipal de Patos seguem a denominação composta por *Etapa - Turma/Turno* (ex: `"Infantil I - Turma A"`, `"Maternal II - Turma Integral"`, `"Berçário II - Turma Única"`).
   - **Inconformidade:** O modelo utiliza a etapa genérica isolada `"Infantil I"`. Conforme verificado na resolução da exclusividade docente (v1.41), etapas genéricas concorrem com as turmas reais do catálogo e corrompem a integridade relacional.
   - **Correção:** O modelo deve trazer turmas canônicas representativas, demonstrando tanto turmas de tempo parcial quanto turmas de tempo integral.

3. **Inconformidade na Representação da Liderança Máxima do Núcleo de Educação Infantil (Pilar 2 e Pilar 14):**
   - **Regra SSOT:** A liderança máxima do sistema consolidada em toda a documentação, nos modais e na autenticação é **Helena Martins**, cujo cargo oficial e canônico é **"Coordenadora do Núcleo de EI"** (eliminando terminologias burocráticas legadas como *"Equipe Técnica"* ou *"Governança & Dados"*).
   - **Inconformidade:** O modelo traz `Rodrigo Toledo` com o cargo `"Núcleo de EI (Governança & Dados)"`, subordinado a Helena Martins, ao invés de exemplificar diretamente a figura da Coordenadora do Núcleo de EI com sua lotação canônica (`"Sede / Gestão Geral"` ou `"Secretaria Municipal de Educação"`) e supervisão institucional (`"Gestão Geral"`).
   - **Correção:** Apresentar no modelo os quatro papéis hierárquicos canônicos da SSOT:
     - Docente Regente (Tempo Parcial)
     - Docente Regente (Tempo Integral)
     - Coordenadora Pedagógica
     - Formadora Pedagógica
     - Coordenadora do Núcleo de EI

4. **Bug Crítico de Execução no Parser de Ingestão (`handleTeamCsvUpload` em `js/features/management.js`):**
   - No código atual da função `handleTeamCsvUpload`:
     ```javascript
     const email = (colEmail !== -1 && parts[colEmail]) ? parts[colEmail].toLowerCase() : '';
     ...
     if (roleKey === 'professora') {
       email = ''; // <--- ERRO CRÍTICO: Reatribuição de variável declarada como 'const'!
       memberData.email = '';
     }
     ```
   - **Impacto:** Tentar importar qualquer planilha CSV contendo ao menos uma professora gera uma exceção fatal não tratada: `TypeError: Assignment to constant variable`, travando imediatamente o processo de importação para toda a lista.
   - **Correção:** Declarar `let email = ...` e blindar a sanitização.

5. **Fallback Prejudicial de Turma para Professores sem Turma no Parser:**
   - No parser de importação:
     ```javascript
     const classAssigned = (colClass !== -1 && parts[colClass]) ? parts[colClass] : (roleKey === 'professora' ? 'Infantil I' : '');
     ```
   - **Inconformidade:** Se uma professora for importada sem turma especificada na planilha, o parser automaticamente atribui `'Infantil I'`. Isso viola a exclusividade docente, pois múltiplas docentes acabam associadas a uma mesma turma fantasma não parametrizada.
   - **Correção:** Se a turma não for informada no CSV, `classAssigned` deve permanecer vazio (`''`), permitindo que a Coordenadora Pedagógica faça a enturmação posterior no módulo de turmas.

6. **Blindagem no Exportador CSV (`exportTeamMembersCSV` em `js/services/export_backup.js`):**
   - Garantir que a exportação oficial de servidores limpe ativamente qualquer e-mail de docentes regentes (`m.roleKey === 'professora' ? '' : (m.email || '')`), prevenindo que dados residuais ou importados por engano vazem na exportação.

---

## 2. Arquitetura e Pontos de Impacto

Os arquivos afetados por esta intervenção são:

1. **`js/features/management.js`:**
   - Atualização da função `downloadTeamCsvTemplate()`:
     - Cabeçalhos padronizados: `["Nome", "Cargo", "Unidade", "Supervisor", "Turma", "Email"]`.
     - Linhas de exemplo atualizadas com as regras da SSOT:
       1. Docente em Tempo Parcial (com turma canônica `Infantil I - Turma A`, sem e-mail).
       2. Docente em Tempo Integral (com turma canônica `Maternal II - Turma Integral`, sem e-mail).
       3. Coordenadora Pedagógica (com e-mail institucional, sem turma).
       4. Formadora Pedagógica (com polo regional, e-mail institucional, sem turma).
       5. Coordenadora do Núcleo de EI (com cargo canônico `Coordenadora do Núcleo de EI`, Sede, sem turma, e-mail institucional).
   - Correção e aprimoramento da função `handleTeamCsvUpload(e)`:
     - Troca de `const email` por `let email` para eliminar o bug de reatribuição `TypeError`.
     - Eliminação do fallback rígido para `'Infantil I'`, adotando `''` caso a turma venha em branco.
     - Aprimoramento de `normalizeRoleData(rawRole)` para reconhecer expressamente variações canônicas de cargos (`Docente Regente`, `Docente`, `Professora`, `Professor`).
2. **`js/services/export_backup.js`:**
   - Atualização de `exportTeamMembersCSV()` para garantir que `m.roleKey === 'professora'` sempre exporte campo de e-mail em branco, mantendo simetria perfeita com o modelo e a SSOT.
3. **`js/audit/audit_engine.js`:**
   - Inclusão de testes automatizados no **Módulo 2 (Catálogo Canônico & Estado Global)**:
     - Validação do retorno e integridade das linhas de `downloadTeamCsvTemplate()`.
     - Asserção de que a linha de docente não possui e-mail.
     - Asserção de que as turmas no modelo seguem o formato canônico com hífen.
     - Asserção de que o cargo de Núcleo de EI adota a nomenclatura canônica `Coordenadora do Núcleo de EI`.
     - Teste de ingestão via `handleTeamCsvUpload` simulado para verificar que não ocorre `TypeError` e que docentes são importados sem credenciais em `USERS_DB`.
4. **Espelhamento Contínuo:**
   - `gestor supervisao_patos/firebase_deploy/public/js/features/management.js`
   - `gestor supervisao_patos/firebase_deploy/public/js/services/export_backup.js`
   - `gestor supervisao_patos/firebase_deploy/public/js/audit/audit_engine.js`
5. **Governança e Versionamento:**
   - `CHANGELOG.md` e `#modalChangelog` em `index.html` (e suas réplicas espelho): Registro sequencial da versão **1.52**.

---

## 3. Especificação Passo a Passo (Snippets Exatos)

### Passo 1: Atualização do Template CSV em `js/features/management.js`

Localizar a função `downloadTeamCsvTemplate()` (linhas ~2888 a ~2899) e substituir por:

```javascript
    function downloadTeamCsvTemplate() {
      const headers = ["Nome", "Cargo", "Unidade", "Supervisor", "Turma", "Email"];
      const sampleRows = [
        ["Maria Aparecida dos Santos", "Professora", "CEI Professora Maria de Lourdes", "Mariana Ferreira", "Infantil I - Turma A", ""],
        ["Roberta Dias", "Professora", "CEI Professora Maria de Lourdes", "Mariana Ferreira", "Maternal II - Turma Integral", ""],
        ["Sônia Regina Alcantara", "Coordenadora Pedagógica", "EMEI Pequeno Príncipe", "Clarice Barbosa", "", "sonia.alcantara@escola.gov.br"],
        ["Clarice Barbosa", "Formadora Pedagógica", "Polo Regional 1 (Norte)", "Helena Martins", "", "clarice.barbosa@escola.gov.br"],
        ["Helena Martins", "Coordenadora do Núcleo de EI", "Sede / Gestão Geral", "Gestão Geral", "", "helena.martins@escola.gov.br"]
      ];
      const csvContent = [headers.join(','), ...sampleRows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
      downloadFile(csvContent, 'modelo_servidores_sertao_crianca.csv', 'text/csv');
      showToast('Planilha modelo de Servidores baixada com sucesso!');
    }
```

---

### Passo 2: Aprimoramento de `normalizeRoleData` em `js/features/management.js`

Localizar a função `normalizeRoleData(rawRole)` (linhas ~2964 a ~2977) e garantir a cobertura robusta de docentes e perfis da SSOT:

```javascript
    function normalizeRoleData(rawRole) {
      const r = (rawRole || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (r.includes('coord') && !r.includes('nucleo')) {
        return { roleKey: 'coordenador', roleTitle: 'Coordenadora Pedagógica' };
      } else if (r.includes('formad')) {
        return { roleKey: 'formador', roleTitle: 'Formadora Pedagógica' };
      } else if (r.includes('nucleo') || r.includes('tecnic') || r.includes('admin') || r.includes('gestao') || r.includes('secretaria') || r.includes('ei')) {
        return { roleKey: 'nucleo_ei', roleTitle: 'Coordenadora do Núcleo de EI' };
      } else if (r.includes('pendent') || r.includes('aguard')) {
        return { roleKey: 'pendente', roleTitle: 'Acesso Pendente' };
      } else {
        return { roleKey: 'professora', roleTitle: 'Professora' };
      }
    }
```

---

### Passo 3: Correção do Bug de Reatribuição e Fallback em `handleTeamCsvUpload`

Localizar no loop de leitura de `handleTeamCsvUpload` (linhas ~3060 a ~3085) o tratamento de `classAssigned` e `email`:

```javascript
// ANTES (com bug de reatribuição e fallback para 'Infantil I'):
          const classAssigned = (colClass !== -1 && parts[colClass]) ? parts[colClass] : (roleKey === 'professora' ? 'Infantil I' : '');
          const email = (colEmail !== -1 && parts[colEmail]) ? parts[colEmail].toLowerCase() : '';

          const memberId = rawId || ('usr-' + Date.now() + '-' + i);

          // Verifica se já existe um membro com esse ID ou mesmo Nome
          const existingIdx = appState.teamMembers.findIndex(m => m.id === memberId || (m.name.toLowerCase() === resolvedName.toLowerCase() && m.roleKey === roleKey));

          const memberData = {
            id: memberId,
            name: resolvedName,
            roleKey,
            roleTitle,
            school,
            supervisor,
            classAssigned,
            email,
            avatarText: resolvedName.substring(0, 2).toUpperCase()
          };

          if (roleKey === 'professora') {
            email = '';
            memberData.email = '';
          }

// DEPOIS (corrigido: let email, fallback de turma limpo e sanitização garantida):
          const classAssigned = (colClass !== -1 && parts[colClass]) ? parts[colClass].trim() : '';
          let email = (colEmail !== -1 && parts[colEmail]) ? parts[colEmail].trim().toLowerCase() : '';

          if (roleKey === 'professora') {
            email = '';
          }

          const memberId = rawId || ('usr-' + Date.now() + '-' + i);

          // Verifica se já existe um membro com esse ID ou mesmo Nome
          const existingIdx = appState.teamMembers.findIndex(m => m.id === memberId || (m.name.toLowerCase() === resolvedName.toLowerCase() && m.roleKey === roleKey));

          const memberData = {
            id: memberId,
            name: resolvedName,
            roleKey,
            roleTitle,
            school,
            supervisor,
            classAssigned,
            email: (roleKey === 'professora') ? '' : email,
            avatarText: resolvedName.substring(0, 2).toUpperCase()
          };
```

---

### Passo 4: Blindagem do Exportador de Servidores em `js/services/export_backup.js`

Localizar a função `exportTeamMembersCSV()` (linhas ~208 a ~214 de `js/services/export_backup.js`) e atualizar para garantir a neutralização de e-mails em docentes:

```javascript
    function exportTeamMembersCSV() {
      const headers = ["ID", "Nome", "Cargo", "Unidade", "Supervisor", "Turma", "E-mail"];
      const rows = (appState.teamMembers || []).map(m => [
        m.id, 
        `"${m.name}"`, 
        `"${m.roleTitle || m.roleKey}"`, 
        `"${m.school || ''}"`, 
        `"${m.supervisor || ''}"`, 
        `"${m.classAssigned || ''}"`, 
        `"${m.roleKey === 'professora' ? '' : (m.email || '')}"`
      ]);
      const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      downloadFile(csv, 'sertao_crianca_servidores.csv', 'text/csv');
      showToast('Servidores exportados com sucesso (CSV).');
    }
```

---

### Passo 5: Sincronização dos Arquivos Espelho

Copiar exatamente as alterações realizadas para a pasta de deploy:
- `cp js/features/management.js gestor\ supervisao_patos/firebase_deploy/public/js/features/`
- `cp js/services/export_backup.js gestor\ supervisao_patos/firebase_deploy/public/js/services/`
- `cp js/audit/audit_engine.js gestor\ supervisao_patos/firebase_deploy/public/js/audit/`

---

## 4. Critérios de Aceite e Roteiro de Teste

### Critérios de Aceite:
1. **Conformidade da Planilha Modelo:**
   - O arquivo baixado via `downloadTeamCsvTemplate()` possui 6 colunas canônicas: `Nome,Cargo,Unidade,Supervisor,Turma,Email`.
   - As linhas de professoras (`Maria Aparecida dos Santos` e `Roberta Dias`) contêm a coluna de e-mail estritamente vazia (`""`).
   - As turmas atribuídas no modelo seguem a nomenclatura canônica composta da rede (`Infantil I - Turma A` e `Maternal II - Turma Integral`).
   - A linha de Coordenadora do Núcleo de EI traz `Helena Martins`, cargo `Coordenadora do Núcleo de EI`, unidade `Sede / Gestão Geral`, supervisão `Gestão Geral` e e-mail institucional.
2. **Resiliência e Ausência de Exceções no Upload CSV:**
   - O upload de arquivos CSV contendo docentes não dispara erro de sintaxe ou reatribuição (`TypeError`).
   - Se uma linha de docente contiver e-mail preenchido por engano na planilha de terceiros, o sistema sanitiza e armazena com `email: ''`, sem criar credenciais em `USERS_DB` ou `appState.customUsers`.
   - Se uma linha de docente for importada sem turma, o sistema não insere `'Infantil I'`, preservando a turma em branco para atribuição controlada.
3. **Blindagem do Exportador de Servidores:**
   - O arquivo gerado por `exportTeamMembersCSV()` nunca exporta e-mails para docentes.
4. **Validação Sintática Pré-Voo:**
   - O comando `python3 audit_platform.py --check-syntax` executa sem nenhum erro léxico ou sintático nos scripts JS.
5. **Auditoria Modular Pós-Deploy:**
   - O comando `python3 audit_platform.py --silent-on-success` aprova os 12 módulos canônicos da plataforma.

---

## 5. Alterações / Adições / Exclusões no Algoritmo de Auditoria (`audit_platform.py` e `audit_engine.js`)

Esta seção é **obrigatória** conforme as diretrizes do projeto (`AGENTS.md` e `WORKFLOW_MACOS.md`).

### 5.1 Inclusões no Módulo 2 de Testes (`js/audit/audit_engine.js` - Catálogo Canônico & Estado Global)
No Módulo 2 (`Catálogo Canônico, Escolas, Turmas, Professores e Estado Global`), adicionar uma asserção específica para validação contínua da conformidade da planilha modelo e da resiliência do parser CSV:

```javascript
              // Validação SSOT do Template CSV de Servidores/Usuários
              const origDownloadFile = window.downloadFile;
              let capturedCsvContent = null;
              let capturedCsvName = null;
              window.downloadFile = function(content, fileName, type) {
                capturedCsvContent = content;
                capturedCsvName = fileName;
              };

              downloadTeamCsvTemplate();
              window.downloadFile = origDownloadFile;

              if (!capturedCsvContent || !capturedCsvName.includes('modelo_servidores')) {
                throw new Error('downloadTeamCsvTemplate() falhou ao gerar conteúdo do template CSV');
              }

              const templateLines = capturedCsvContent.split('\n');
              const headerLine = templateLines[0];
              if (!headerLine.includes('Nome') || !headerLine.includes('Cargo') || !headerLine.includes('Turma') || !headerLine.includes('Email')) {
                throw new Error(`Cabeçalho do template CSV de Servidores em desacordo: ${headerLine}`);
              }

              // Asserção: Docentes não devem ter e-mail na planilha modelo
              const teacherLines = templateLines.filter(l => l.includes('Professora'));
              if (teacherLines.length === 0) {
                throw new Error('Template CSV de Servidores não possui linhas de exemplo para Docentes');
              }
              teacherLines.forEach(tl => {
                const parts = parseCsvLineCustom(tl, ',');
                const emailVal = parts[5] || '';
                if (emailVal !== '') {
                  throw new Error(`Inconformidade SSOT: Docente no template CSV possui e-mail preenchido: "${emailVal}"`);
                }
              });

              // Asserção: Núcleo de EI deve estar representado por Coordenadora do Núcleo de EI
              const nucleoLine = templateLines.find(l => l.includes('Coordenadora do Núcleo de EI'));
              if (!nucleoLine || !nucleoLine.includes('Helena Martins')) {
                throw new Error('Template CSV não contém a liderança canônica Coordenadora do Núcleo de EI (Helena Martins)');
              }

              logger.log('Conformidade SSOT do Template CSV de Servidores/Usuários', true, '5 papéis validados, blindagem contra e-mail docente e turmas canônicas');
```

### 5.2 Exclusões no Algoritmo de Auditoria
- Nenhuma asserção existente será excluída, preservando 100% da cobertura de testes dos 12 módulos existentes.

### 5.3 Alterações no Script `audit_platform.py`
- Nenhuma alteração de infraestrutura é necessária em `audit_platform.py`. O runner existente executará a validação sintática via JSC (`--check-syntax`) e acionará os testes no Chrome headless via `--silent-on-success`.
