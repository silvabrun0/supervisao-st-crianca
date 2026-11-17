# PLANO DE IMPLEMENTAÇÃO: PILAR 19 - ARQUITETURA DE CARGA EM MASSA VIA PLANILHA GERAL SSOT E EDIÇÕES PONTUAIS DESCENTRALIZADAS

> **DIRETRIZ OBRIGATÓRIA DE EXECUÇÃO (ETAPA 2):**
> O assistente executor (Etapa 2) deve **obrigatoriamente ler e seguir as diretrizes dos arquivos `WORKFLOW_MACOS.md`, `AGENTS.md` e a skill `execucao-operario`** antes de aplicar qualquer modificação no código. Nenhuma modificação deve ser realizada sem conformidade estrita com o workflow, incluindo:
> 1. Execução prévia de sincronização com o repositório remoto (`git pull origin main`).
> 2. Preservação integral das regras de negócio existentes, dados cadastrais, blindagens RBAC, série histórica e suíte de testes.
> 3. Conformidade estrita ao **Hallmark UI Standard**: uso exclusivo de CSS variables/tokens (`01_variables.css`), tipografia em sentence case desprovida de all-caps forçado, alvos de toque ergonômicos de no mínimo 44x44px, contenção em camada única sem cards aninhados, zero `transition: all` e zero emojis soltos como ícones (adoção estrita de pictogramas vetoriais SVG).
> 4. Verificação de integridade pós-edição com dupla checagem de leitura em cada trecho modificado.
> 5. Validação sintática obrigatória com JavaScriptCore via `python3 audit_platform.py --check-syntax`.
> 6. Salvamento obrigatório do backup intermediário na pasta `intermediárias/` sob o nome `aplicativo_v1.76_pilar_19_carga_massa_planilha_ssot.html`.
> 7. Gestão dupla de Changelog no arquivo `CHANGELOG.md` e no modal `#modalChangelog` / botão `.btn-changelog` do `index.html`, registrando a **Versão 1.76**.
> 8. Sincronização idêntica entre o arquivo principal `index.html` da raiz e `gestor supervisao_patos/firebase_deploy/public/index.html`.
> 9. Checagem pré-push (`git fetch origin main`), rebase caso necessário, commit semântico (`feat: implementar pilar 19 - carga em massa via planilha geral ssot e edicoes descentralizadas`), push para `origin main` e deploy automático no GitHub Pages.
> 10. Execução pós-deploy obrigatória da suíte de auditoria (`python3 audit_platform.py --silent-on-success`) com comunicação estrita a falhas.

---

## 1. Diagnóstico e Contexto

### 1.1 Cenário Atual
Atualmente, no sistema SerTão Criança:
1. **Fragmentação de Importações em CSV:**
   - Existem mecanismos isolados e incompletos de importação em CSV:
     - Na aba de Unidades Escolares (`#pedagViewUnits`), há os botões `downloadUnitsCsvTemplate()` e `triggerUnitsCsvImport()`, que apenas leem um CSV simples de 3 colunas (`Nome_Unidade, Polo_Regional, Endereco`), preenchendo métricas fictícias de turmas e alunos sem criar vínculo real com turmas ou professores.
     - Na aba de Equipes (`#pedagViewTeam`), há os botões `downloadTeamCsvTemplate()` e `triggerTeamCsvImport()`, que importam profissionais (`Nome, Cargo, Unidade, Supervisor, Turma, Email`), mas criam apenas registros de equipe isolados, sem gerar as turmas ou amarrar o modelo relacional de forma consistente.
     - Na aba de Turmas (`#pedagViewClasses`), não existe atualmente nenhum mecanismo de carga em massa ou exportação tabular unificada.
2. **Risco de Quebra Relacional e Poluição Cadastral:**
   - Se a coordenação de cada uma das 32 unidades escolares precisasse preencher e importar planilhas isoladas, ocorreriam divergências ortográficas (ex: *"CEI Profa Maria de Lourdes"* vs *"CEI Maria de Lourdes"*), quebra de integridade dos Polos Regionais, criação de duplicidades de servidores e fragmentação da Single Source of Truth (SSOT).
3. **Exposição Inadequada de Controles para Coordenadoras:**
   - Na visão da Coordenadora da UE (`coordenador`), os botões de importação de CSV de servidores continuam visíveis na aba de equipes, o que pode induzir a coordenadora a tentar subir planilhas que desconfiguram a lotação de pessoal ou conflitam com a base central.
4. **Ausência de Exportação Geral Consolidada da Rede:**
   - A Secretaria de Educação (SEMED) e o Núcleo de EI não dispõem de uma ferramenta para exportar ou importar em uma única planilha tabular legível toda a malha escolar ativa: Polos, UEs, Coordenadoras, Formadoras, Turmas, Faixas Etárias, Turnos/Jornadas, Alunos e Docentes Titulares.

### 1.2 Fundamentação Técnico-Pedagógica (Reunião 03/11/2026 - Diogo Dias Furtado, Carolina Machado, Julia Elena Cordoba Vieira e Bruno Pereira da Silva, 01:03:43 - 01:21:37)
Conforme deliberado na reunião técnica executiva:
- **Diogo Dias Furtado (01:03:43):**
  > *"Como esses dados virão por planilha, crie uma **planilha modelo geral unificada**. Mesmo que dividida logicamente entre professores e turmas, coloque tudo em uma única planilha. Se a gente importar só a lista de professores ou só a lista de turmas sem o vínculo relacional, vai gerar conflito e quebrar o sistema."*
- **Carolina Machado e Diogo Dias Furtado (01:08:34 - 01:14:20):**
  > *"Se for para cada coordenadora preencher uma planilha e subir, é mais fácil ela digitar direto nos botões do sistema. O fluxo mais produtivo e seguro é: a equipe do Núcleo (Juliana/técnicas) pega a relação geral da rede (escolas, coordenadores, formadores, turmas e professores) e importa a base inteira de uma vez via planilha unificada. Depois disso, as coordenadoras nas unidades apenas fazem alterações e edições pontuais (ex: adicionar um professor substituto, ajustar um horário)."*
- **Julia Elena Cordoba Vieira (00:55:22):**
  > *"Bruno, já anota aí para você colocar um modelo de planilha para elas baixarem! Em CSV ou formato de planilha compatível."*
- **Bruno Pereira da Silva (01:21:37):**
  > *"O sistema terá: 1. Para o Núcleo: importação da planilha unificada completa de abertura do ciclo. 2. Para a Coordenadora da UE: botões de edição e adição pontual na própria interface, sem necessidade de manipular planilhas complexas."*

### 1.3 Resultado Esperado com o Pilar 19
1. **Centralização Estratégica no Núcleo de Educação Infantil (RBAC):**
   - Disponibilização na Central de Extrações e Base Unificada (`#pedagViewExports`), com acesso exclusivo ao perfil `nucleo_ei` (Helena Martins / Rodrigo Toledo / Administradores), da seção nobre **"Planilha Geral Unificada da Rede Municipal (SSOT)"**.
2. **Download do Modelo Padronizado da Rede (`.csv` com BOM UTF-8):**
   - Botão proeminente para baixar o arquivo `modelo_geral_rede_sertao_crianca.csv`, estruturado com 18 colunas canônicas relacionais e linhas de exemplo realistas da rede de Patos/PB.
3. **Exportação Geral Consolidada da Rede:**
   - Botão `Exportar Rede Atual (.CSV)` que gera em tempo real uma planilha idêntica ao modelo, preenchida com todas as turmas, UEs, polos, coordenadoras, formadoras e docentes cadastrados no sistema.
4. **Parser Inteligente com Autocura e Resiliência Relacional:**
   - Leitor com detecção automática de delimitador (`;` ou `,`), sanitização de aspas, tolerância a maiúsculas/minúsculas e integração com a taxonomia do Pilar 18 (`normalizeStageName`).
   - Atualização atômica e criação sem duplicação de: Polos, Unidades Escolares, Formadoras, Coordenadoras (com sincronização para login em `customUsers`), Docentes Titulares (com suporte a dupla regência do Pilar 16 e dobras do Pilar 17) e Turmas.
5. **Autonomia Descentralizada da Coordenadora da UE:**
   - Na visão da Coordenadora, a manutenção permanece 100% direta e visual via botões ergonômicos (`+ Nova Turma`, `Editar Turma`, `+ Novo Professor`, `Substituir Docente`).
   - Supressão/bloqueio de botões de importação em massa de CSV na visão de Coordenadora (`#pedagViewTeam` e `#pedagViewUnits`), eliminando o risco de sobreposição acidental da base.
6. **Agregação Dinâmica e Automática da Caracterização da Escola:**
   - O cálculo de total de alunos matriculados, turmas ativas e crianças público-alvo da educação inclusiva/AEE é 100% derivado e recalculado em tempo real pelo sistema a partir do somatório das turmas ativas (`getSchoolClassesAggregates`), sem duplicidade ou incoerência de dados manuais.
7. **Conformidade Estrita ao Hallmark UI Standard:**
   - Design sóbrio institucional, superfícies brancas com tokens CSS `:root`, pictogramas vetoriais SVG, sem all-caps, touch targets de 44x44px e anel de foco `:focus-visible`.

---

## 2. Arquitetura e Pontos de Impacto

### 2.1 Arquivos Afetados
- `index.html` (Inserção da seção e botões da Planilha Geral SSOT em `#pedagViewExports`, IDs para controle RBAC de botões legados em `#pedagViewTeam`, input de arquivo unificado)
- `js/services/export_backup.js` (Funções de exportação `downloadGeneralNetworkTemplateCSV`, `exportGeneralNetworkCSV`, parser e importador `handleGeneralNetworkCsvUpload`, `parseGeneralNetworkCSV`, relatório pós-carga)
- `js/core/rbac.js` (Refinamento em `applyUserRoleUI` garantindo ocultação de botões de importação em massa de CSV para o perfil `coordenador` e exibição estrita da carga unificada para `nucleo_ei`)
- `js/features/management.js` (Garantia de atualização reativa das telas e re-agregação automática da caracterização das unidades escolares após importação)
- `js/audit/audit_engine.js` (Novas asserções de teste no Módulo 2 `catalogo_dados`, Módulo 11 `backup_exportacao` e Módulo 1 `auth_rbac`)
- `CHANGELOG.md` e `#modalChangelog` (Registro da Versão 1.76)
- `intermediárias/aplicativo_v1.76_pilar_19_carga_massa_planilha_ssot.html` (Backup intermediário obrigatório)
- `gestor supervisao_patos/firebase_deploy/public/index.html` (Espelho de produção)

### 2.2 Estrutura Canônica da Planilha Geral Unificada SSOT (18 Colunas Oficiais)

| Nº | Coluna no CSV | Descrição Técnica | Exemplo Canônico |
| :---: | :--- | :--- | :--- |
| **1** | `Polo_Regional` | Nome do Polo Territorial da Rede | `Polo Regional 1 (Norte)` |
| **2** | `Unidade_Escolar` | Nome canônico da Unidade Escolar | `CEI Professora Maria de Lourdes` |
| **3** | `Endereco_Unidade` | Endereço ou Bairro da Escola | `Bairro Alto das Flores, Rua das Acácias, 120` |
| **4** | `Formadora_Responsavel` | Nome da formadora supervisora do polo | `Clarice Barbosa` |
| **5** | `Email_Formadora` | E-mail institucional da formadora | `clarice.barbosa@patos.pb.gov.br` |
| **6** | `Coordenadora_Pedagogica` | Nome da coordenadora pedagógica da UE | `Mariana Ferreira` |
| **7** | `Email_Coordenadora` | E-mail de login da coordenadora | `mariana.ferreira@patos.pb.gov.br` |
| **8** | `Nome_Turma` | Denominação oficial da turma na escola | `Infantil I - Turma A` |
| **9** | `Etapa_Faixa_Etaria` | Faixa etária canônica ou Multietapa (Pilar 18) | `4 anos a 4 anos e 11 meses (Pré-escola 1)` |
| **10** | `Faixas_Multietapa` | Faixas atendidas em turmas multiadas (Pilar 18) | `4 anos a 4 anos e 11 meses \| 5 anos a 5 anos e 11 meses` |
| **11** | `Jornada_Escolar` | Tipo da jornada (`Tempo Parcial` ou `Tempo Integral`) | `Tempo Parcial` |
| **12** | `Turno` | Turno de funcionamento | `Matutino` |
| **13** | `Total_Alunos` | Quantidade total de crianças matriculadas | `22` |
| **14** | `Alunos_AEE_Inclusao` | Crianças público-alvo da educação inclusiva | `1` |
| **15** | `Docente_1_Nome` | Nome completo da 1ª docente regente | `Ana Carolina Silva` |
| **16** | `Docente_1_Email` | E-mail institucional / identificador | `ana.silva@patos.pb.gov.br` |
| **17** | `Docente_2_Nome` | 2ª docente regente (Dupla Regência / Integral) | `Juliana Roberta Rocha` *(opcional)* |
| **18** | `Docente_2_Email` | E-mail da 2ª docente regente | `juliana.rocha@patos.pb.gov.br` *(opcional)* |

---

## 3. Especificação de Implementação Passo a Passo (Snippets Exatos)

### Passo 1: Atualização da Interface HTML (`index.html`)

#### 1.1 Inclusão do Card Nobre da Planilha Geral SSOT em `#pedagViewExports`
Localizar o contêiner `#pedagViewExports` (por volta da linha 488 de `index.html`), logo acima do card de Backup JSON, e inserir o bloco da Planilha Geral Unificada:

```html
        <!-- CARD NOBRE PILAR 19: CARGA GERAL DA REDE & PLANILHA UNIFICADA SSOT -->
        <div class="card export-backup-card" id="cardGeneralNetworkSSOT" style="border-left: 4px solid var(--primary); margin-bottom: 20px;">
          <div class="export-backup-container">
            <div class="export-backup-info">
              <div class="export-backup-title">
                <span>Planilha Geral Unificada da Rede Municipal (SSOT)</span>
                <button type="button" class="btn-platform-info" onclick="openPlatformInfoModal('Planilha Geral SSOT', 'Carga inicial centralizada de toda a malha escolar pelo Núcleo de Educação Infantil: Polos, Unidades Escolares, Coordenadoras, Formadoras, Turmas e Docentes Titulares.')" aria-label="Informações sobre Planilha Geral SSOT">
                  <svg class="info-pictogram" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                </button>
              </div>
              <div class="platform-info-text export-backup-desc">
                Carga em massa centralizada para abertura do ano letivo. Consolida a malha relacional completa em planilha única (.CSV / Excel), eliminando inconsistências e duplicações.
              </div>
            </div>
            <div class="export-backup-actions">
              <button class="btn btn-secondary export-backup-btn" onclick="downloadGeneralNetworkTemplateCSV()" title="Baixar modelo padronizado com cabeçalho oficial e exemplos da rede">
                <svg class="btn-icon" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="12" x2="12" y2="18"/><polyline points="9 15 12 18 15 15"/></svg>
                <span>Baixar Modelo Geral (.CSV)</span>
              </button>
              <button class="btn btn-secondary export-backup-btn" onclick="exportGeneralNetworkCSV()" title="Exportar a malha escolar completa atualmente cadastrada no sistema">
                <svg class="btn-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="12" x2="12" y2="15"/></svg>
                <span>Exportar Rede Atual (.CSV)</span>
              </button>
              <button class="btn btn-primary export-backup-btn" onclick="triggerGeneralNetworkImport()" title="Importar e consolidar a planilha geral unificada no sistema">
                <svg class="btn-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                <span>Importar Planilha Geral</span>
              </button>
              <input type="file" id="generalNetworkCsvFileInput" accept=".csv,text/csv" style="display:none;" onchange="handleGeneralNetworkCsvUpload(event)" />
            </div>
          </div>
        </div>
```

#### 1.2 Identificadores para Blindagem RBAC dos Botões em `#pedagViewTeam` e `#pedagViewUnits`
Em `index.html`:
- No contêiner de botões de `#pedagViewTeam` (por volta da linha 407):
  Atribuir IDs aos botões de modelo e importação de servidores para viabilizar controle refinado:
  ```html
  <button class="btn btn-secondary" id="btnDownloadTeamCsv" onclick="downloadTeamCsvTemplate()">...</button>
  <button class="btn btn-secondary" id="btnImportTeamCsv" onclick="triggerTeamCsvImport()">...</button>
  ```
- No contêiner de botões de `#pedagViewUnits` (por volta da linha 256):
  Atribuir IDs correspondentes:
  ```html
  <button class="btn btn-secondary" id="btnDownloadUnitsCsv" onclick="downloadUnitsCsvTemplate()">...</button>
  <button class="btn btn-secondary" id="btnImportUnitsCsv" onclick="triggerUnitsCsvImport()">...</button>
  ```

---

### Passo 2: Implementação dos Serviços de Carga em Massa e Exportação Geral (`js/services/export_backup.js`)

Adicionar ao arquivo `js/services/export_backup.js` as funções canônicas do Pilar 19:

```javascript
    // =========================================================================
    // PILAR 19: ARQUITETURA DE CARGA EM MASSA VIA PLANILHA GERAL SSOT
    // =========================================================================

    // Cabeçalho Oficial Canônico da Planilha Geral Unificada (18 Colunas)
    const GENERAL_NETWORK_CSV_HEADERS = [
      "Polo_Regional",
      "Unidade_Escolar",
      "Endereco_Unidade",
      "Formadora_Responsavel",
      "Email_Formadora",
      "Coordenadora_Pedagogica",
      "Email_Coordenadora",
      "Nome_Turma",
      "Etapa_Faixa_Etaria",
      "Faixas_Multietapa",
      "Jornada_Escolar",
      "Turno",
      "Total_Alunos",
      "Alunos_AEE_Inclusao",
      "Docente_1_Nome",
      "Docente_1_Email",
      "Docente_2_Nome",
      "Docente_2_Email"
    ];

    // Download do Modelo Padronizado da Rede (.CSV compatível com Excel e UTF-8 com BOM)
    function downloadGeneralNetworkTemplateCSV() {
      const user = getCurrentUser();
      if (!isNucleoEI(user)) {
        showToast('Acesso restrito ao Núcleo de Educação Infantil.');
        return;
      }

      const sampleRows = [
        [
          "Polo Regional 1 (Norte)",
          "CEI Professora Maria de Lourdes",
          "Bairro Alto das Flores, Rua das Acácias, 120",
          "Clarice Barbosa",
          "clarice.barbosa@patos.pb.gov.br",
          "Mariana Ferreira",
          "mariana.ferreira@patos.pb.gov.br",
          "Infantil I - Turma A",
          "4 anos a 4 anos e 11 meses (Pré-escola 1)",
          "",
          "Tempo Parcial",
          "Matutino",
          "22",
          "1",
          "Ana Carolina Silva",
          "ana.silva@patos.pb.gov.br",
          "",
          ""
        ],
        [
          "Polo Regional 1 (Norte)",
          "CEI Professora Maria de Lourdes",
          "Bairro Alto das Flores, Rua das Acácias, 120",
          "Clarice Barbosa",
          "clarice.barbosa@patos.pb.gov.br",
          "Mariana Ferreira",
          "mariana.ferreira@patos.pb.gov.br",
          "Berçário II - Turma Única",
          "1 ano a 1 ano e 11 meses (Creche II)",
          "",
          "Tempo Parcial",
          "Matutino",
          "18",
          "0",
          "Carla Beatriz Mendes",
          "carla.mendes@patos.pb.gov.br",
          "",
          ""
        ],
        [
          "Polo Regional 1 (Norte)",
          "CEI Professora Maria de Lourdes",
          "Bairro Alto das Flores, Rua das Acácias, 120",
          "Clarice Barbosa",
          "clarice.barbosa@patos.pb.gov.br",
          "Mariana Ferreira",
          "mariana.ferreira@patos.pb.gov.br",
          "Maternal II - Turma Integral",
          "3 anos a 3 anos e 11 meses (Creche IV / Pré-escola Inicial)",
          "",
          "Tempo Integral",
          "Manhã + Tarde",
          "25",
          "2",
          "Mariana Santos",
          "mariana.santos@patos.pb.gov.br",
          "Roberta Dias",
          "roberta.dias@patos.pb.gov.br"
        ],
        [
          "Polo Regional 1 (Norte)",
          "EMEI Pequeno Príncipe",
          "Vila Esperança, Rua Projetada B",
          "Clarice Barbosa",
          "clarice.barbosa@patos.pb.gov.br",
          "Sônia Regina Alcantara",
          "sonia.alcantara@patos.pb.gov.br",
          "Maternal I - Turma A",
          "2 anos a 2 anos e 11 meses (Creche III)",
          "",
          "Tempo Parcial",
          "Matutino",
          "20",
          "1",
          "Fernanda Lima",
          "fernanda.lima@patos.pb.gov.br",
          "",
          ""
        ],
        [
          "Polo Regional 2 (Sul)",
          "CEI Vovó Zezé",
          "Jardim do Sertão, Travessa das Flores, 45",
          "Clarice Barbosa",
          "clarice.barbosa@patos.pb.gov.br",
          "Helena Martins",
          "helena.martins@patos.pb.gov.br",
          "Turma Multietapa - Campo",
          "Turma Multietapa (Multiada)",
          "3 anos a 3 anos e 11 meses | 4 anos a 4 anos e 11 meses",
          "Tempo Parcial",
          "Matutino",
          "16",
          "2",
          "Luciana Ramos",
          "luciana.ramos@patos.pb.gov.br",
          "",
          ""
        ]
      ];

      // Geração de CSV com delimitação por ponto e vírgula e aspas seguras para Excel brasileiro
      const csvLines = [
        GENERAL_NETWORK_CSV_HEADERS.join(';'),
        ...sampleRows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(';'))
      ];

      const csvContent = "\uFEFF" + csvLines.join('\r\n');
      downloadFile(csvContent, 'modelo_geral_rede_sertao_crianca.csv', 'text/csv;charset=utf-8;');
      showToast('Planilha modelo geral da rede (SSOT) baixada com sucesso!');
    }

    // Exportação da Malha Atual Completa em Planilha Geral Tabular (.CSV)
    function exportGeneralNetworkCSV() {
      const user = getCurrentUser();
      if (!isNucleoEI(user)) {
        showToast('Acesso restrito ao Núcleo de Educação Infantil.');
        return;
      }

      const rows = [];
      const units = appState.units || [];
      const allClasses = appState.classes || [];
      const members = appState.teamMembers || [];

      // Itera por todas as unidades para garantir cobertura completa mesmo se houver UE sem turmas cadastradas
      units.forEach(u => {
        const uClasses = allClasses.filter(c => c.school === u.name && !((appState.deletedClassIds || []).includes(c.id)));
        const poloName = u.polo || 'Polo Regional 1 (Norte)';
        
        // Formadora do Polo
        const formadora = members.find(m => m.roleKey === 'formador' && (m.school === poloName || m.school === u.name));
        const formadoraName = formadora ? formadora.name : '';
        const formadoraEmail = formadora ? (formadora.email || '') : '';

        // Coordenadora da UE
        const coord = members.find(m => m.roleKey === 'coordenador' && m.school === u.name);
        const coordName = coord ? coord.name : '';
        const coordEmail = coord ? (coord.email || '') : '';

        if (uClasses.length === 0) {
          // Linha sentinela da UE sem turma ainda
          rows.push([
            poloName,
            u.name,
            u.address || '',
            formadoraName,
            formadoraEmail,
            coordName,
            coordEmail,
            "", "", "", "Tempo Parcial", "Matutino", "0", "0", "", "", "", ""
          ]);
        } else {
          uClasses.forEach(c => {
            const isIntegral = (c.shift || '').toLowerCase().includes('integral');
            const jornada = isIntegral ? 'Tempo Integral' : 'Tempo Parcial';
            const turno = c.shift || (isIntegral ? 'Manhã + Tarde' : 'Matutino');
            const totAlunos = typeof c.totalStudents === 'number' ? c.totalStudents : 20;
            const aeeAlunos = typeof c.inclusiveStudents === 'number' ? c.inclusiveStudents : 0;
            
            // Docentes
            const teachers = Array.isArray(c.teachers) ? c.teachers : [];
            const doc1Name = teachers[0] || '';
            const doc2Name = teachers[1] || '';
            const doc1 = members.find(m => m.name === doc1Name && m.school === u.name);
            const doc2 = members.find(m => m.name === doc2Name && m.school === u.name);
            const doc1Email = doc1 ? (doc1.email || '') : '';
            const doc2Email = doc2 ? (doc2.email || '') : '';

            const multiStagesStr = Array.isArray(c.multiStages) ? c.multiStages.join(' | ') : '';

            rows.push([
              poloName,
              u.name,
              u.address || '',
              formadoraName,
              formadoraEmail,
              coordName,
              coordEmail,
              c.name,
              c.stage || 'Infantil I',
              multiStagesStr,
              jornada,
              turno,
              String(totAlunos),
              String(aeeAlunos),
              doc1Name,
              doc1Email,
              doc2Name,
              doc2Email
            ]);
          });
        }
      });

      const csvLines = [
        GENERAL_NETWORK_CSV_HEADERS.join(';'),
        ...rows.map(row => row.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(';'))
      ];

      const csvContent = "\uFEFF" + csvLines.join('\r\n');
      downloadFile(csvContent, 'sertao_crianca_rede_unificada_completa.csv', 'text/csv;charset=utf-8;');
      showToast('Rede municipal completa exportada com sucesso (CSV)!');
    }

    // Disparador de Seleção do Arquivo de Carga Geral
    function triggerGeneralNetworkImport() {
      const user = getCurrentUser();
      if (!isNucleoEI(user)) {
        showToast('Acesso restrito ao Núcleo de Educação Infantil.');
        return;
      }
      const inp = document.getElementById('generalNetworkCsvFileInput');
      if (inp) inp.click();
    }

    // Processamento e Parser da Planilha Geral Unificada (Carga SSOT)
    function handleGeneralNetworkCsvUpload(e) {
      const file = e.target.files[0];
      if (!file) return;

      const user = getCurrentUser();
      if (!isNucleoEI(user)) {
        showToast('Apenas a Coordenação do Núcleo de EI pode efetuar carga da planilha geral.');
        e.target.value = '';
        return;
      }

      if (!confirm(`ATENÇÃO - CARGA EM MASSA DA REDE (SSOT):\n\nA importação do arquivo "${file.name}" consolidará Polos, Unidades Escolares, Coordenadoras, Formadoras, Turmas e Docentes da rede.\n\nRegistros existentes serão enriquecidos e novas entidades serão cadastradas atomicamente. Deseja prosseguir com a carga?`)) {
        e.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = function(evt) {
        try {
          const text = evt.target.result;
          const stats = parseAndApplyGeneralNetworkCSV(text);
          saveState();

          // Sincroniza e re-renderiza todas as telas afetadas
          if (typeof syncUnitCharacterizationFromClasses === 'function') {
            syncUnitCharacterizationFromClasses();
          }
          if (typeof renderUnitsScreen === 'function') renderUnitsScreen();
          if (typeof renderClassesScreen === 'function') renderClassesScreen();
          if (typeof renderTeamScreen === 'function') renderTeamScreen();
          if (typeof renderIndicatorsScreen === 'function') renderIndicatorsScreen();
          if (typeof renderHomeScreen === 'function') renderHomeScreen();

          showToast(`Carga concluída com sucesso! ${stats.unitsCount} UEs, ${stats.classesCount} turmas e ${stats.teachersCount} docentes processados.`);
        } catch (err) {
          console.error('Falha na importação da Planilha Geral SSOT:', err);
          alert('Erro ao processar a planilha geral: ' + err.message);
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    }

    // Motor de Parser e Resolução Relacional da Planilha Geral
    function parseAndApplyGeneralNetworkCSV(csvText) {
      if (!csvText || !csvText.trim()) {
        throw new Error('O arquivo CSV selecionado está vazio.');
      }

      const rawLines = csvText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
      if (rawLines.length < 2) {
        throw new Error('A planilha deve conter o cabeçalho e pelo menos uma linha de dados.');
      }

      const firstLine = rawLines[0];
      const delimiter = (firstLine.indexOf(';') !== -1 && firstLine.split(';').length >= firstLine.split(',').length) ? ';' : ',';
      
      const headerCols = parseCsvLineCustom(firstLine, delimiter).map(h => 
        h.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '')
      );

      // Índices dinâmicos por similaridade léxica
      const findIdx = (candidates) => headerCols.findIndex(h => candidates.some(c => h.includes(c)));
      
      const idxPolo = findIdx(['poloregional', 'polo', 'regiao']);
      const idxUE = findIdx(['unidadeescolar', 'unidade', 'escola', 'ue']);
      const idxEnd = findIdx(['enderecounidade', 'endereco', 'bairro']);
      const idxForm = findIdx(['formadoraresponsavel', 'formadora', 'supervisora']);
      const idxFormEmail = findIdx(['emailformadora']);
      const idxCoord = findIdx(['coordenadorapedagogica', 'coordenadora', 'coordenador', 'cp']);
      const idxCoordEmail = findIdx(['emailcoordenadora']);
      const idxTurma = findIdx(['nometurma', 'turma', 'sala']);
      const idxEtapa = findIdx(['etapafaixaetaria', 'etapa', 'faixaetaria', 'faixa']);
      const idxMulti = findIdx(['faixasmultietapa', 'multietapa']);
      const idxJornada = findIdx(['jornadaescolar', 'jornada']);
      const idxTurno = findIdx(['turno']);
      const idxTotAlunos = findIdx(['totalalunos', 'totalmatriculados', 'alunos']);
      const idxAeeAlunos = findIdx(['alunosaeeinclusao', 'alunosaee', 'aee', 'inclusao', 'necessidadesespeciais']);
      const idxDoc1Nome = findIdx(['docente1nome', 'docente1', 'professora1', 'professor1', 'docente']);
      const idxDoc1Email = findIdx(['docente1email']);
      const idxDoc2Nome = findIdx(['docente2nome', 'docente2', 'professora2', 'professor2']);
      const idxDoc2Email = findIdx(['docente2email']);

      if (idxUE === -1) {
        throw new Error('Coluna de Unidade Escolar obrigatória não identificada no cabeçalho.');
      }

      // Inicialização defensiva das coleções de estado
      if (!Array.isArray(appState.units)) appState.units = [];
      if (!Array.isArray(appState.classes)) appState.classes = [];
      if (!Array.isArray(appState.teamMembers)) appState.teamMembers = [];
      if (!Array.isArray(appState.polos)) appState.polos = [];
      if (!appState.customUsers) appState.customUsers = {};

      let unitsCount = 0;
      let classesCount = 0;
      let teachersCount = 0;
      const seenUnits = new Set();
      const seenClasses = new Set();

      for (let i = 1; i < rawLines.length; i++) {
        const parts = parseCsvLineCustom(rawLines[i], delimiter);
        if (parts.length === 0 || !parts[idxUE]) continue;

        const ueName = (parts[idxUE] || '').trim();
        if (!ueName) continue;

        const poloName = (idxPolo !== -1 && parts[idxPolo]) ? parts[idxPolo].trim() : 'Polo Regional 1 (Norte)';
        const address = (idxEnd !== -1 && parts[idxEnd]) ? parts[idxEnd].trim() : '';
        const formadoraName = (idxForm !== -1 && parts[idxForm]) ? parts[idxForm].trim() : '';
        const formadoraEmail = (idxFormEmail !== -1 && parts[idxFormEmail]) ? parts[idxFormEmail].trim() : '';
        const coordName = (idxCoord !== -1 && parts[idxCoord]) ? parts[idxCoord].trim() : '';
        const coordEmail = (idxCoordEmail !== -1 && parts[idxCoordEmail]) ? parts[idxCoordEmail].trim() : '';

        // 1. Polo Regional
        let poloObj = appState.polos.find(p => p.name.toLowerCase() === poloName.toLowerCase());
        if (!poloObj && poloName) {
          poloObj = {
            id: 'polo-auto-' + Date.now() + '-' + i,
            name: poloName,
            region: poloName
          };
          appState.polos.push(poloObj);
        }

        // 2. Unidade Escolar (UE)
        let ueObj = appState.units.find(u => u.name.toLowerCase() === ueName.toLowerCase());
        if (!ueObj) {
          ueObj = {
            id: 'ue-auto-' + Date.now() + '-' + i,
            name: ueName,
            polo: poloName,
            address: address || 'Endereço não informado',
            totalStudents: 0,
            inclusiveStudents: 0,
            totalClasses: 0
          };
          appState.units.push(ueObj);
          unitsCount++;
        } else {
          if (poloName) ueObj.polo = poloName;
          if (address) ueObj.address = address;
        }
        seenUnits.add(ueName);

        // 3. Formadora Pedagógica
        if (formadoraName) {
          let formMember = appState.teamMembers.find(m => m.name.toLowerCase() === formadoraName.toLowerCase() && m.roleKey === 'formador');
          if (!formMember) {
            formMember = {
              id: 'usr-form-' + Date.now() + '-' + i,
              name: formadoraName,
              roleKey: 'formador',
              roleTitle: 'Formadora Pedagógica',
              school: poloName,
              supervisor: 'Helena Martins',
              email: formadoraEmail || `${formadoraName.toLowerCase().replace(/\s+/g, '.')}@patos.pb.gov.br`
            };
            appState.teamMembers.push(formMember);
          } else {
            if (formadoraEmail) formMember.email = formadoraEmail;
            formMember.school = poloName;
          }
          syncUserToAuthDb(formMember);
        }

        // 4. Coordenadora Pedagógica
        if (coordName) {
          let coordMember = appState.teamMembers.find(m => m.name.toLowerCase() === coordName.toLowerCase() && m.roleKey === 'coordenador');
          if (!coordMember) {
            coordMember = {
              id: 'usr-coord-' + Date.now() + '-' + i,
              name: coordName,
              roleKey: 'coordenador',
              roleTitle: 'Coordenadora Pedagógica',
              school: ueName,
              supervisor: formadoraName || 'Clarice Barbosa',
              email: coordEmail || `${coordName.toLowerCase().replace(/\s+/g, '.')}@patos.pb.gov.br`
            };
            appState.teamMembers.push(coordMember);
          } else {
            coordMember.school = ueName;
            if (formadoraName) coordMember.supervisor = formadoraName;
            if (coordEmail) coordMember.email = coordEmail;
          }
          syncUserToAuthDb(coordMember);
        }

        // 5. Turma e Docentes Regentes
        const className = (idxTurma !== -1 && parts[idxTurma]) ? parts[idxTurma].trim() : '';
        if (className) {
          const rawStage = (idxEtapa !== -1 && parts[idxEtapa]) ? parts[idxEtapa].trim() : 'Infantil I';
          const normalizedStage = typeof normalizeStageName === 'function' ? normalizeStageName(rawStage) : rawStage;
          
          const rawMulti = (idxMulti !== -1 && parts[idxMulti]) ? parts[idxMulti].trim() : '';
          const multiStages = rawMulti ? rawMulti.split(/[|,;]/).map(s => s.trim()).filter(Boolean) : [];

          const rawJornada = (idxJornada !== -1 && parts[idxJornada]) ? parts[idxJornada].trim() : '';
          const rawTurno = (idxTurno !== -1 && parts[idxTurno]) ? parts[idxTurno].trim() : '';
          const isIntegral = rawJornada.toLowerCase().includes('integral') || rawTurno.toLowerCase().includes('integral') || rawTurno.toLowerCase().includes('manh');
          
          let shift = 'Tempo Parcial (Matutino)';
          if (isIntegral) {
            shift = 'Tempo Integral (Manhã + Tarde)';
          } else if (rawTurno.toLowerCase().includes('vesp')) {
            shift = 'Tempo Parcial (Vespertino)';
          }

          const totAlunos = parseInt(idxTotAlunos !== -1 ? parts[idxTotAlunos] : '20', 10) || 20;
          const aeeAlunos = parseInt(idxAeeAlunos !== -1 ? parts[idxAeeAlunos] : '0', 10) || 0;

          const doc1Name = (idxDoc1Nome !== -1 && parts[idxDoc1Nome]) ? parts[idxDoc1Nome].trim() : '';
          const doc1Email = (idxDoc1Email !== -1 && parts[idxDoc1Email]) ? parts[idxDoc1Email].trim() : '';
          const doc2Name = (idxDoc2Nome !== -1 && parts[idxDoc2Nome]) ? parts[idxDoc2Nome].trim() : '';
          const doc2Email = (idxDoc2Email !== -1 && parts[idxDoc2Email]) ? parts[idxDoc2Email].trim() : '';

          const teachers = [doc1Name, doc2Name].filter(Boolean);

          // Cadastro / Atualização de Docente 1
          if (doc1Name) {
            let t1 = appState.teamMembers.find(m => m.name.toLowerCase() === doc1Name.toLowerCase() && m.roleKey === 'professora' && m.school === ueName);
            if (!t1) {
              t1 = {
                id: 'usr-prof-' + Date.now() + '-' + i + '-1',
                name: doc1Name,
                roleKey: 'professora',
                roleTitle: 'Professora',
                school: ueName,
                supervisor: coordName || 'Mariana Ferreira',
                classAssigned: className,
                email: doc1Email || `${doc1Name.toLowerCase().replace(/\s+/g, '.')}@patos.pb.gov.br`
              };
              appState.teamMembers.push(t1);
              teachersCount++;
            } else {
              t1.classAssigned = className;
              if (doc1Email) t1.email = doc1Email;
            }
          }

          // Cadastro / Atualização de Docente 2
          if (doc2Name) {
            let t2 = appState.teamMembers.find(m => m.name.toLowerCase() === doc2Name.toLowerCase() && m.roleKey === 'professora' && m.school === ueName);
            if (!t2) {
              t2 = {
                id: 'usr-prof-' + Date.now() + '-' + i + '-2',
                name: doc2Name,
                roleKey: 'professora',
                roleTitle: 'Professora',
                school: ueName,
                supervisor: coordName || 'Mariana Ferreira',
                classAssigned: className,
                email: doc2Email || `${doc2Name.toLowerCase().replace(/\s+/g, '.')}@patos.pb.gov.br`
              };
              appState.teamMembers.push(t2);
              teachersCount++;
            } else {
              t2.classAssigned = className;
              if (doc2Email) t2.email = doc2Email;
            }
          }

          // Localiza ou Cria a Turma
          let clsObj = appState.classes.find(c => c.school.toLowerCase() === ueName.toLowerCase() && c.name.toLowerCase() === className.toLowerCase());
          if (!clsObj) {
            clsObj = {
              id: 'cls-auto-' + Date.now() + '-' + i,
              name: className,
              school: ueName,
              stage: normalizedStage,
              multiStages: multiStages,
              shift: shift,
              totalStudents: totAlunos,
              inclusiveStudents: aeeAlunos,
              teachers: teachers,
              teachersMorning: isIntegral ? (doc1Name ? [doc1Name] : []) : teachers,
              teachersAfternoon: isIntegral ? (doc2Name ? [doc2Name] : [doc1Name]) : []
            };
            appState.classes.push(clsObj);
            classesCount++;
          } else {
            clsObj.stage = normalizedStage;
            if (multiStages.length > 0) clsObj.multiStages = multiStages;
            clsObj.shift = shift;
            clsObj.totalStudents = totAlunos;
            clsObj.inclusiveStudents = aeeAlunos;
            clsObj.teachers = teachers;
            if (isIntegral) {
              clsObj.teachersMorning = doc1Name ? [doc1Name] : [];
              clsObj.teachersAfternoon = doc2Name ? [doc2Name] : [doc1Name];
            }
          }
          seenClasses.add(`${ueName}|${className}`);
        }
      }

      return {
        unitsCount: seenUnits.size,
        classesCount: seenClasses.size,
        teachersCount
      };
    }
```

---

### Passo 3: Refinamento RBAC em `js/core/rbac.js` (`applyUserRoleUI`)

Assegurar que botões de importação em massa de CSV sejam blindados por perfil:
1. Para a **Coordenadora da UE** (`roleKey === 'coordenador'`):
   - Ocultar `#btnDownloadTeamCsv` e `#btnImportTeamCsv`.
   - Ocultar botões legados de CSV em UEs (`#btnDownloadUnitsCsv` e `#btnImportUnitsCsv`).
   - A Coordenadora gerencia seu corpo docente unicamente via `+ Novo Professor` (`#btnNewTeacher`), edição inline e modal de turmas (`+ Cadastrar Nova Turma`).
2. Para a **Formadora Pedagógica** (`roleKey === 'formador'`):
   - Acesso de consulta territorial ao polo. Sem acesso a carga destrutiva da rede.
3. Para a **Coordenação do Núcleo de EI** (`isNucleoEI(user)`):
   - Acesso pleno à Central de Extrações e Base Unificada (`#pedagViewExports`).
   - `#cardGeneralNetworkSSOT` exibido com destaque no topo de `#pedagViewExports`.

Snippet para inclusão em `applyUserRoleUI`:
```javascript
      // Governança RBAC da Planilha Geral SSOT e Bloqueio de Importação Descentralizada
      const cardSSOT = document.getElementById('cardGeneralNetworkSSOT');
      const btnDownloadTeamCsv = document.getElementById('btnDownloadTeamCsv');
      const btnImportTeamCsv = document.getElementById('btnImportTeamCsv');
      const btnDownloadUnitsCsv = document.getElementById('btnDownloadUnitsCsv');
      const btnImportUnitsCsv = document.getElementById('btnImportUnitsCsv');

      if (user.roleKey === 'coordenador') {
        if (cardSSOT) cardSSOT.style.display = 'none';
        if (btnDownloadTeamCsv) btnDownloadTeamCsv.style.display = 'none';
        if (btnImportTeamCsv) btnImportTeamCsv.style.display = 'none';
        if (btnDownloadUnitsCsv) btnDownloadUnitsCsv.style.display = 'none';
        if (btnImportUnitsCsv) btnImportUnitsCsv.style.display = 'none';
      } else if (isNucleoEI(user)) {
        if (cardSSOT) cardSSOT.style.display = 'block';
        if (btnDownloadTeamCsv) btnDownloadTeamCsv.style.display = 'inline-flex';
        if (btnImportTeamCsv) btnImportTeamCsv.style.display = 'inline-flex';
        if (btnDownloadUnitsCsv) btnDownloadUnitsCsv.style.display = 'inline-flex';
        if (btnImportUnitsCsv) btnImportUnitsCsv.style.display = 'inline-flex';
      } else {
        if (cardSSOT) cardSSOT.style.display = 'none';
      }
```

---

### Passo 4: Automação e Agregação Dinâmica em Tempo Real da UE (`js/features/management.js`)

Garantir que a função `syncUnitCharacterizationFromClasses()` seja disparada sempre que:
1. A carga unificada da planilha geral for concluída (`handleGeneralNetworkCsvUpload`);
2. Uma nova turma for criada ou editada (`saveClassEditor`);
3. Uma turma for excluída (`deleteClass`).

Desta forma, os totais de alunos (`totalStudents`), educação inclusiva (`inclusiveStudents`) e turmas ativas (`totalClasses`) de cada unidade escolar são estritamente derivados do somatório real das turmas cadastradas, extinguindo inconsistências numéricas entre o cadastro de salas e o card institucional da escola.

---

### Passo 5: Atualização do Changelog Duplo e Registro de Versão

#### 5.1 Atualização em `CHANGELOG.md`
Inserir no topo da tabela e no detalhamento a **Versão 1.76**:
```markdown
| **1.76** | 17/11/2026 17:40 | `intermediárias/aplicativo_v1.76_pilar_19_carga_massa_planilha_ssot.html` | Solicitação direta / `planos_de_implementacao/plano_pilar_19_carga_massa_planilha_ssot.md` | Pilar 19 · Arquitetura de Carga em Massa via Planilha Geral SSOT & Edições Pontuais Descentralizadas: planilha modelo oficial unificada da rede de 18 colunas (Polos, UEs, Formadoras, Coordenadoras, Turmas, Faixas Etárias MEC, Jornadas, Turnos e Docentes Titulares), parser inteligente com detecção de delimitador e UTF-8 com BOM, exportação da rede completa em CSV, blindagem de importação na Coordenadora e agregação em tempo real da caracterização escolar 📊🏛️🛡️✨ |
```

#### 5.2 Atualização no Modal `#modalChangelog` e Botão `.btn-changelog` em `index.html`
- Atualizar o texto do botão no rodapé / cabeçalho: `v1.76`.
- Adicionar o card da Versão 1.76 no `#modalChangelogBody`.

---

## 4. Critérios de Aceite e Roteiro de Teste

### 4.1 Critérios de Aceite
1. **Download do Modelo Geral (.CSV):**
   - Ao clicar em `Baixar Modelo Geral (.CSV)` com perfil do Núcleo de EI (Helena Martins), o navegador faz o download de `modelo_geral_rede_sertao_crianca.csv`.
   - O arquivo possui delimitador `;`, codificação UTF-8 com BOM, cabeçalho exato de 18 colunas e 5 linhas de exemplo ricas com dados de Creche, Pré-escola, Integral e Multietapa.
2. **Exportação da Rede Atual (.CSV):**
   - Ao clicar em `Exportar Rede Atual (.CSV)`, o arquivo `sertao_crianca_rede_unificada_completa.csv` é gerado refletindo todas as turmas, UEs, polos e docentes ativos no `appState`.
3. **Importação e Carga em Massa com Parser Tolerante:**
   - Ao importar um CSV com novas turmas e escolas, o sistema processa sem travar, cria polos ausentes, cria UEs, cadastra coordenadoras e formadoras em `teamMembers` e `customUsers`, cadastra os docentes e cria as turmas.
   - O sistema recalcula automaticamente a caracterização da escola via `syncUnitCharacterizationFromClasses()`.
4. **Governança e Blindagem RBAC:**
   - A Coordenadora Pedagógica (Mariana Ferreira) **não tem acesso** ao `#cardGeneralNetworkSSOT` e os botões de importação em lote de CSV na visão de equipes estão ocultados.
   - A Coordenadora opera exclusivamente via interface visual: `+ Nova Turma`, `Editar Turma`, `+ Novo Professor`.
5. **Agregação em Tempo Real:**
   - O card da unidade escolar da coordenadora reflete imediatamente o somatório exato de alunos matriculados e alunos AEE com base nas turmas cadastradas.
6. **Conformidade Estrita ao Hallmark UI:**
   - Uso de tokens CSS do `:root`, sem all-caps forçado, alvos de toque de 44x44px, foco instantâneo com `:focus-visible` e zero emojis em botões.

### 4.2 Roteiro de Teste Manual (Simulação Operacional)
1. **Acesso como Núcleo de EI (`helena`):**
   - Navegar para `Início` ➔ sub-aba `Extrações & Relatórios SSOT`.
   - Verificar a presença e o destaque do card `#cardGeneralNetworkSSOT`.
   - Clicar em `Baixar Modelo Geral (.CSV)` e inspecionar a formatação do arquivo baixado.
   - Clicar em `Exportar Rede Atual (.CSV)` e confirmar que as 4 turmas do CEI Maria de Lourdes aparecem com suas professoras.
2. **Teste de Carga via Planilha:**
   - Subir um arquivo de teste contendo uma nova unidade escolar ("CEI Raio de Sol", Polo 2, Coordenadora "Juliana Rocha", Turma "Infantil II - Turma Única", 24 alunos, 2 AEE, Professora "Marta Silva").
   - Confirmar o toast de sucesso e verificar a presença de "CEI Raio de Sol" na lista de UEs, com 1 turma e 24 alunos matriculados.
3. **Alternância para Coordenadora (`mariana`):**
   - Trocar de usuário para Mariana Ferreira.
   - Constatar que a sub-aba `Extrações & Relatórios SSOT` está oculta (RBAC).
   - Acessar `Equipes & Servidores`: verificar que os botões de importação de CSV estão ocultos e o botão `+ Novo Professor` permanece ativo.
   - Acessar `Turmas & Regência`: editar uma turma alterando o número de alunos de 22 para 25 e verificar que a caracterização da escola atualiza para o novo somatório instantaneamente.

---

## 5. Alterações / Adições / Exclusões no Algoritmo de Auditoria (`audit_platform.py` e `js/audit/audit_engine.js`)

### 5.1 Adições ao Módulo 2 (`catalogo_dados`) em `js/audit/audit_engine.js`
Adicionar asserções dedicadas ao Pilar 19:
1. **Validação das Funções da Planilha Geral SSOT:**
   - Verificar que `typeof downloadGeneralNetworkTemplateCSV === 'function'`.
   - Verificar que `typeof exportGeneralNetworkCSV === 'function'`.
   - Verificar que `typeof handleGeneralNetworkCsvUpload === 'function'`.
   - Verificar que `typeof parseAndApplyGeneralNetworkCSV === 'function'`.
2. **Simulação Programática de Parse e Carga em Massa:**
   - Executar `parseAndApplyGeneralNetworkCSV` com payload CSV sintético de teste contendo 1 Polo, 1 UE inédita ("EMEI Teste Carga SSOT"), 1 Coordenadora, 1 Turma e 1 Professora.
   - Verificar que a UE foi criada em `appState.units`.
   - Verificar que a turma foi criada em `appState.classes` com etapa normalizada.
   - Verificar que a professora foi criada em `appState.teamMembers`.
   - Validar que `getSchoolClassesAggregates('EMEI Teste Carga SSOT')` retorna os totais exatos informados no CSV.
   - Limpar o registro de teste do estado para não poluir os demais testes.

### 5.2 Adições ao Módulo 11 (`backup_exportacao`) em `js/audit/audit_engine.js`
1. **Validação do DOM do Card Nobre da Planilha Geral:**
   - Verificar que `#cardGeneralNetworkSSOT` existe no DOM.
   - Verificar que contém os 3 botões com classes Hallmark (`.export-backup-btn` e pictogramas SVG correspondentes).
   - Verificar que possui o input de arquivo oculto `#generalNetworkCsvFileInput`.

### 5.3 Adições ao Módulo 1 (`auth_rbac`) em `js/audit/audit_engine.js`
1. **Validação da Blindagem de Acesso da Coordenadora:**
   - Autenticar como `mariana` (`coordenador`).
   - Disparar `applyUserRoleUI()`.
   - Verificar que `#cardGeneralNetworkSSOT` está com `display === 'none'`.
   - Verificar que `#btnImportTeamCsv` está com `display === 'none'`.
   - Autenticar como `helena` (`nucleo_ei`).
   - Disparar `applyUserRoleUI()`.
   - Verificar que `#cardGeneralNetworkSSOT` está visível (`display === 'block'`).

### 5.4 Atualização do Script Headless `audit_platform.py`
- Nenhuma alteração de infraestrutura é necessária em `audit_platform.py`. O script nativo continuará executando `audit_engine.js` em Chrome headless com `--silent-on-success` e a checagem sintática JSC via `--check-syntax`.

---

## 6. Checklist de Execução para a Etapa 2 (O Operário)

- [ ] 1. Executar `git pull origin main`.
- [ ] 2. Criar backup intermediário: `cp index.html intermediárias/aplicativo_v1.76_pilar_19_carga_massa_planilha_ssot.html`.
- [ ] 3. Aplicar inserções HTML em `index.html` (Card `#cardGeneralNetworkSSOT`, inputs e botões).
- [ ] 4. Implementar funções canônicas do Pilar 19 em `js/services/export_backup.js`.
- [ ] 5. Implementar blindagem RBAC em `js/core/rbac.js`.
- [ ] 6. Conectar disparo de `syncUnitCharacterizationFromClasses()` em `js/features/management.js`.
- [ ] 7. Adicionar asserções de teste nos Módulos 1, 2 e 11 de `js/audit/audit_engine.js`.
- [ ] 8. Atualizar versão para `v1.76` no `CHANGELOG.md` e em `#modalChangelog` / botão `.btn-changelog` de `index.html`.
- [ ] 9. Replicar alterações para `firebase_deploy/public/index.html` e arquivos espelho.
- [ ] 10. Validar sintaxe com `python3 audit_platform.py --check-syntax`.
- [ ] 11. Checagem pré-push (`git fetch origin main`), commit semântico e push para `origin main`.
- [ ] 12. Execução pós-deploy da auditoria: `python3 audit_platform.py --silent-on-success`.
