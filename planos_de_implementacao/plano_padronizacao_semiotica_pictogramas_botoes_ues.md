# Plano de Implementação: Padronização Semiótica dos Pictogramas dos Botões de Unidades Escolares (CSV/JSON/Modelo)

---

## 0. Diretriz de Execução (Obrigatória para o Operário - Etapa 2)
> [!IMPORTANT]
> **Leitura Prévia Obrigatória:** Antes de executar qualquer ação deste plano, o assistente na **Etapa 2 (O Operário)** DEVE consultar e seguir rigorosamente:
> 1. [WORKFLOW_MACOS.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md)
> 2. [WORKFLOW_GITHUB.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_GITHUB.md)
> 3. [.agents/skills/execucao-operario/SKILL.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/.agents/skills/execucao-operario/SKILL.md)
> 4. [.agents/skills/auditoria-plataforma/SKILL.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/.agents/skills/auditoria-plataforma/SKILL.md)
>
> **Trava de Fidelidade e Estabilidade:** Este plano contempla exclusivamente a padronização semiótica e visual dos pictogramas vetoriais (SVGs) dos botões de ação de Unidades Escolares (e extensivamente de Servidores) na plataforma *SerTão Criança*, harmonizando-os com as convenções consolidadas na **Versão 1.39 (v8.2.6)**.
> Todas as chamadas funcionais JavaScript (`exportUnitsCSV()`, `exportUnitsJSON()`, `downloadUnitsCsvTemplate()`, `triggerUnitsCsvImport()`), atributos de acessibilidade, classes CSS e regras de negócio da SSOT DEVEM ser mantidas 100% intactas.

---

## 1. Diagnóstico e Contexto

### 1.1 Contexto e Justificativa Semiótica e de Usabilidade
Na sub-aba **Unidades Escolares & Polos** (`#pedagViewUnits`), na barra de ações `#unitsActionsButtons` (linhas 3768–3786 de `index.html`), o sistema disponibiliza quatro ferramentas fundamentais para a equipe gestora:
1. `Exportar UEs (CSV)`: extração tabular dos cadastros de escolas e polos.
2. `Exportar UEs (JSON)`: extração estruturada para integração e interoperabilidade.
3. `Baixar Modelo (CSV)`: download de arquivo modelo de planilha preenchível para novos cadastros.
4. `Importar CSV`: leitura e ingestão em lote de escolas no estado da aplicação.

Na **Versão 1.39 (v8.2.6)**, a plataforma corrigiu a dissonância cognitiva dos botões de backup e restauração (`exportFullBaseJSON` e `triggerImportFullBase`), estabelecendo a seguinte regra semiótica oficial:
- **EXPORTAR (Extração para fora):** Bandeja receptáculo com **seta apontando para CIMA** (`polyline points="17 8 12 3 7 8"` e `line x1="12" y1="3" x2="12" y2="15"`).
- **IMPORTAR (Ingestão para dentro):** Mesma bandeja receptáculo com **seta apontando para BAIXO** (`polyline points="7 10 12 15 17 10"` e `line x1="12" y1="15" x2="12" y2="3"`).

### 1.2 O Problema Identificado e a Demanda do Usuário
Ao examinar os pictogramas dos quatro botões na barra de Unidades Escolares, constata-se uma completa incongruência e inversão de papéis:

1. **`Exportar UEs (CSV)`:**
   - *Código Atual:* Possui a bandeja com a **seta para BAIXO** (`polyline points="7 10 12 15 17 10"`).
   - *Problema:* O pictograma é de **importação/download**, gerando a falsa impressão de que o botão irá puxar dados ou carregar arquivos, quando na realidade está **exportando** dados da rede para fora.
2. **`Exportar UEs (JSON)`:**
   - *Código Atual:* Possui o pictograma de documento de texto (`path d="M14 2H6..."` com linhas de texto `line x1="16" y1="13"...`).
   - *Problema:* É um ícone genérico de documento/arquivo que destoa completamente dos demais botões de exportação do sistema (que utilizam a bandeja com seta para cima), rompendo a paridade visual entre CSV e JSON.
3. **`Baixar Modelo (CSV)`:**
   - *Código Atual:* Possui a bandeja com **seta para BAIXO** (`polyline points="7 10 12 15 17 10"`).
   - *Problema:* Era idêntico ao botão 1 (`Exportar UEs CSV`), e caso o botão `Importar CSV` passe a usar a seta para baixo (conforme padrão v1.39), `Baixar Modelo` e `Importar CSV` ficariam com o mesmo pictograma lado a lado, apesar de realizarem funções opostas (um baixa o gabarito vazio; o outro ingere registros no sistema).
   - *Solução Semiótica:* Trata-se de um download de modelo/template oficial. O pictograma padrão da família Lucide para arquivos baixados é o **`file-down`** (documento com orelha dobrada contendo seta apontando para baixo: `path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"`, `polyline points="14 2 14 8 20 8"`, `line x1="12" y1="12" x2="12" y2="18"` e `polyline points="9 15 12 18 15 15"`). Este ícone expressa imediatamente: *"este botão entrega um documento/modelo para o seu computador"*.
4. **`Importar CSV`:**
   - *Código Atual:* Possui a bandeja com **seta para CIMA** (`polyline points="17 8 12 3 7 8"`).
   - *Problema:* Símbolo de upload/exportação invertido para uma ação que ingere registros para dentro da base.

> [!NOTE]
> **Extensão Harmônica:** A sub-aba **Equipes & Servidores** (`#pedagViewTeam`, linhas 3909–3924 de `index.html`) espelha rigorosamente os mesmos 4 botões (`exportTeamMembersCSV()`, `exportTeamMembersJSON()`, `downloadTeamCsvTemplate()`, `triggerTeamCsvImport()`) com exatamente a mesma divergência. A intervenção padronizará ambos os blocos, garantindo 100% de uniformidade na Gestão da Rede.

---

## 2. Arquitetura e Mapeamento de Pontos de Impacto

Os arquivos envolvidos na intervenção são:
- [index.html](file:///Users/bruno/Desktop/gestor%20supervisao_patos/index.html)
- [firebase_deploy/public/index.html](file:///Users/bruno/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html) (cópia espelho de produção)
- [CHANGELOG.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/CHANGELOG.md)
- `intermediárias/aplicativo_v142_padronizacao_semiotica_pictogramas_ues_servidores.html` (backup de versão)

### 2.1 Matriz Semiótica Comparativa

| Botão | Função JS | Pictograma Atual | Novo Pictograma (Padronizado v1.39) | Justificativa Semiótica |
| :--- | :--- | :--- | :--- | :--- |
| **Exportar UEs (CSV)** | `exportUnitsCSV()` | Bandeja Seta para Baixo ❌ | **Bandeja Seta para CIMA** (`polyline 17 8 12 3 7 8`) ✅ | Extração de registros para fora do sistema em formato CSV |
| **Exportar UEs (JSON)** | `exportUnitsJSON()` | Folha de Texto (`file-text`) ❌ | **Bandeja Seta para CIMA** (`polyline 17 8 12 3 7 8`) ✅ | Extração de registros para fora em JSON, alinhado a `exportFullBaseJSON()` |
| **Baixar Modelo (CSV)** | `downloadUnitsCsvTemplate()` | Bandeja Seta para Baixo ❌ | **Documento Modelo Baixado (`file-down`)** (`M14 2H6... line y1="12" y2="18"`) ✅ | Download de gabarito/modelo oficial de planilha, sem confundir com ingestão |
| **Importar CSV** | `triggerUnitsCsvImport()` | Bandeja Seta para Cima ❌ | **Bandeja Seta para BAIXO** (`polyline 7 10 12 15 17 10`) ✅ | Ingestão e despejo de dados de arquivo externo para dentro da plataforma |

*(A mesma matriz aplica-se aos botões correspondentes de Servidores na sub-aba `#pedagViewTeam`).*

---

## 3. Especificação de Implementação Passo a Passo (Snippets Exatos)

### Passo 1: Atualização dos Botões na Barra de Unidades Escolares (`#unitsActionsButtons`)

Localizar em `index.html` (~linhas 3768–3786):

**Código Atual:**
```html
            <div style="display:flex; gap:8px; flex-wrap:wrap;" id="unitsActionsButtons">
              <button class="btn btn-secondary" onclick="exportUnitsCSV()">
                <svg class="btn-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Exportar UEs (CSV)
              </button>
              <button class="btn btn-secondary" onclick="exportUnitsJSON()">
                <svg class="btn-icon" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                Exportar UEs (JSON)
              </button>
              <button class="btn btn-secondary" onclick="downloadUnitsCsvTemplate()">
                <svg class="btn-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Baixar Modelo (CSV)
              </button>
              <button class="btn btn-secondary" onclick="triggerUnitsCsvImport()">
                <svg class="btn-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Importar CSV
              </button>
              <button class="btn btn-primary" id="btnAddUnitMain" onclick="openAddUnitModal()">+ Cadastrar Nova UE</button>
            </div>
```

**Novo Código:**
```html
            <div style="display:flex; gap:8px; flex-wrap:wrap;" id="unitsActionsButtons">
              <button class="btn btn-secondary" onclick="exportUnitsCSV()">
                <svg class="btn-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Exportar UEs (CSV)
              </button>
              <button class="btn btn-secondary" onclick="exportUnitsJSON()">
                <svg class="btn-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Exportar UEs (JSON)
              </button>
              <button class="btn btn-secondary" onclick="downloadUnitsCsvTemplate()">
                <svg class="btn-icon" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="12" x2="12" y2="18"/><polyline points="9 15 12 18 15 15"/></svg>
                Baixar Modelo (CSV)
              </button>
              <button class="btn btn-secondary" onclick="triggerUnitsCsvImport()">
                <svg class="btn-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Importar CSV
              </button>
              <button class="btn btn-primary" id="btnAddUnitMain" onclick="openAddUnitModal()">+ Cadastrar Nova UE</button>
            </div>
```

---

### Passo 2: Atualização dos Botões na Barra de Equipes & Servidores (`#pedagViewTeam`)

Localizar em `index.html` (~linhas 3908–3927):

**Código Atual:**
```html
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button class="btn btn-secondary" onclick="exportTeamMembersCSV()">
              <svg class="btn-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Exportar Servidores (CSV)
            </button>
            <button class="btn btn-secondary" onclick="exportTeamMembersJSON()">
              <svg class="btn-icon" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              Exportar Servidores (JSON)
            </button>
            <button class="btn btn-secondary" onclick="downloadTeamCsvTemplate()">
              <svg class="btn-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Baixar Modelo (CSV)
            </button>
            <button class="btn btn-secondary" onclick="triggerTeamCsvImport()">
              <svg class="btn-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Importar CSV
            </button>
            <button class="btn btn-primary" id="btnNewTeacher" onclick="openAddTeacherModal()">+ Novo Professor</button>
            <button class="btn btn-secondary" id="btnNewUser" onclick="openAddUserModal()">+ Novo Usuário</button>
          </div>
```

**Novo Código:**
```html
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button class="btn btn-secondary" onclick="exportTeamMembersCSV()">
              <svg class="btn-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Exportar Servidores (CSV)
            </button>
            <button class="btn btn-secondary" onclick="exportTeamMembersJSON()">
              <svg class="btn-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Exportar Servidores (JSON)
            </button>
            <button class="btn btn-secondary" onclick="downloadTeamCsvTemplate()">
              <svg class="btn-icon" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="12" x2="12" y2="18"/><polyline points="9 15 12 18 15 15"/></svg>
              Baixar Modelo (CSV)
            </button>
            <button class="btn btn-secondary" onclick="triggerTeamCsvImport()">
              <svg class="btn-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Importar CSV
            </button>
            <button class="btn btn-primary" id="btnNewTeacher" onclick="openAddTeacherModal()">+ Novo Professor</button>
            <button class="btn btn-secondary" id="btnNewUser" onclick="openAddUserModal()">+ Novo Usuário</button>
          </div>
```

---

### Passo 3: Atualização de Versão e Changelog Duplo

1. **Atualizar Cabeçalho e Botão de Versão:**
   - Em `index.html` (~linha 3597):
     ```html
     <span>Versão 1.42 (v8.2.9)</span>
     ```
2. **Atualizar `#modalChangelog` em `index.html`:**
   Inserir o card da Versão 1.42 no topo da lista de histórico:
   ```html
         <!-- VERSÃO 1.42 - PADRONIZAÇÃO SEMIÓTICA DOS PICTOGRAMAS DE UES E SERVIDORES -->
         <div class="card" style="margin-bottom:16px; border-left:4px solid #10B981; background:#F8FAFC;">
           <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
             <span style="font-weight:800; font-size:14px; color:var(--text-primary);">📌 Versão 1.42 (v8.2.9)</span>
             <span style="font-size:11px; background:#D1FAE5; color:#065F46; padding:2px 8px; border-radius:12px; font-weight:700;">27/10/2026</span>
           </div>
           <div style="font-size:12px; font-weight:700; color:var(--text-primary); margin-bottom:6px;">
             Harmonização Semiótica dos Pictogramas de Gestão da Rede (Unidades e Servidores):
           </div>
           <ul style="font-size:12px; color:var(--text-secondary); margin:0; padding-left:18px; line-height:1.5;">
             <li>📤 <strong>Padronização de Exportação (Seta para Cima):</strong> Alinhamento dos botões de exportação CSV e JSON de Unidades Escolares e Servidores com o pictograma canônico da bandeja com seta vertical apontando para cima (extração de dados do sistema para arquivo externo), em consonância com a Versão 1.39.</li>
             <li>📥 <strong>Padronização de Importação (Seta para Baixo):</strong> Correção dos botões <code>Importar CSV</code> com a bandeja receptáculo exibindo a seta apontando para baixo (ingestão e despejo de dados de fora para dentro da plataforma).</li>
             <li>📄 <strong>Diferenciação de Template/Modelo (<code>file-down</code>):</strong> Aplicação do pictograma vetorial de documento modelo baixado nos botões <code>Baixar Modelo (CSV)</code>, eliminando conflito visual com o botão de importação.</li>
             <li>🛡️ <strong>Auditoria Integrada e Blindagem Léxica:</strong> Inclusão de asserções automatizadas no Módulo 2 da suíte de testes in-app, garantindo conformidade perene dos caminhos SVG no DOM.</li>
           </ul>
         </div>
   ```
3. **Atualizar `CHANGELOG.md`:**
   Adicionar no Sumário Executivo e no corpo detalhado o registro da versão 1.42 (v8.2.9).
4. **Sincronizar Espelho de Produção:**
   Copiar o `index.html` atualizado para `firebase_deploy/public/index.html`.

---

## 4. Critérios de Aceite e Roteiro de Teste

1. **Critério 1 (Exportar UEs CSV):** O botão `Exportar UEs (CSV)` exibe a bandeja com seta vertical apontando para CIMA (`polyline points="17 8 12 3 7 8"` e `line x1="12" y1="3" x2="12" y2="15"`).
2. **Critério 2 (Exportar UEs JSON):** O botão `Exportar UEs (JSON)` exibe rigorosamente o mesmo pictograma de bandeja com seta para CIMA, erradicando o ícone de folha de texto anterior.
3. **Critério 3 (Baixar Modelo CSV):** O botão `Baixar Modelo (CSV)` exibe o pictograma de documento com download (`file-down`), diferenciando-se com clareza dos botões de transferência de base.
4. **Critério 4 (Importar CSV):** O botão `Importar CSV` exibe a bandeja com seta vertical apontando para BAIXO (`polyline points="7 10 12 15 17 10"` e `line x1="12" y1="15" x2="12" y2="3"`).
5. **Critério 5 (Servidores Harmônico):** Os botões análogos em `#pedagViewTeam` exibem rigorosamente o mesmo conjunto padronizado de pictogramas.
6. **Critério 6 (Funcionalidades Preservadas):** Os cliques em todos os botões continuam acionando normalmente suas rotinas (`exportUnitsCSV`, `exportUnitsJSON`, `downloadUnitsCsvTemplate`, `triggerUnitsCsvImport`) sem qualquer regressão funcional ou sintática.
7. **Critério 7 (Suíte de Auditoria 100% Verde):** Todos os 12 módulos da suíte de testes in-app e `audit_platform.py --silent-on-success` passam sem nenhum erro.

---

## 5. Seção Obrigatória: Alterações / Adições / Exclusões no Algoritmo de Auditoria (`audit_platform.py` e Suíte In-App)

### 5.1 Adições na Suíte de Testes In-App (`index.html`)

No **Módulo 2 (`catalogo_dados`)** (~linha 25150 de `index.html`), incluir o bloco de validação semiótica estrutural dos botões de Unidades Escolares:

```javascript
              // Validação semiótica dos pictogramas dos botões de Unidades Escolares (Versão 1.42 / Padrão v1.39)
              const btnExportUnitsCSV = document.querySelector('button[onclick*="exportUnitsCSV()"]');
              const btnExportUnitsJSON = document.querySelector('button[onclick*="exportUnitsJSON()"]');
              const btnDownloadUnitsTemplate = document.querySelector('button[onclick*="downloadUnitsCsvTemplate()"]');
              const btnImportUnitsCSV = document.querySelector('button[onclick*="triggerUnitsCsvImport()"]');

              if (!btnExportUnitsCSV || !btnExportUnitsJSON || !btnDownloadUnitsTemplate || !btnImportUnitsCSV) {
                throw new Error('Botões de ação de Unidades Escolares ausentes no DOM');
              }

              // Exportação CSV deve ser bandeja com seta para cima
              const svgExpCSV = btnExportUnitsCSV.querySelector('svg')?.innerHTML || '';
              if (!svgExpCSV.includes('17 8 12 3 7 8') || !svgExpCSV.includes('y1="3"')) {
                throw new Error('Botão exportUnitsCSV deve possuir pictograma de bandeja com seta para cima');
              }

              // Exportação JSON deve ser bandeja com seta para cima (padrão v1.39)
              const svgExpJSON = btnExportUnitsJSON.querySelector('svg')?.innerHTML || '';
              if (!svgExpJSON.includes('17 8 12 3 7 8') || !svgExpJSON.includes('y1="3"')) {
                throw new Error('Botão exportUnitsJSON deve possuir pictograma de bandeja com seta para cima');
              }

              // Baixar Modelo deve possuir pictograma de modelo de documento baixado (file-down)
              const svgTpl = btnDownloadUnitsTemplate.querySelector('svg')?.innerHTML || '';
              if (!svgTpl.includes('M14 2H6') || !svgTpl.includes('9 15 12 18 15 15')) {
                throw new Error('Botão downloadUnitsCsvTemplate deve possuir pictograma de documento modelo baixado (file-down)');
              }

              // Importar CSV deve ser bandeja com seta para baixo (padrão v1.39)
              const svgImpCSV = btnImportUnitsCSV.querySelector('svg')?.innerHTML || '';
              if (!svgImpCSV.includes('7 10 12 15 17 10') || !svgImpCSV.includes('y1="15"')) {
                throw new Error('Botão triggerUnitsCsvImport deve possuir pictograma de bandeja com seta para baixo');
              }

              logger.log('Harmonização Semiótica dos Pictogramas de Unidades Escolares (Padrão Versão 1.39)', true, 'Exportar CSV/JSON (seta cima), Baixar Modelo (file-down) e Importar (seta baixo) validados');
```

### 5.2 Validação Sintática Pré-Voo e Execução do `audit_platform.py`
- Executar a checagem sintática via motor JSC antes de commitar:
  ```bash
  python3 audit_platform.py --check-syntax
  ```
- Executar a auditoria pós-deploy:
  ```bash
  python3 audit_platform.py --silent-on-success
  ```
- Nenhuma alteração de infraestrutura é necessária em `audit_platform.py`, pois a suíte in-app roda de forma reflexiva durante o teste modular headless.
