# Plano de Implementação: Modificação dos Pictogramas dos Botões de Exportar e Importar Base Completa em JSON

---

## 0. Diretriz de Execução (Obrigatória para o Operário - Etapa 2)
> [!IMPORTANT]
> **Leitura Prévia Obrigatória:** Antes de executar qualquer ação deste plano, o assistente na **Etapa 2 (O Operário)** DEVE consultar e seguir rigorosamente:
> 1. [WORKFLOW_MACOS.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md)
> 2. [WORKFLOW_GITHUB.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_GITHUB.md)
> 3. [.agents/skills/execucao-operario/SKILL.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/.agents/skills/execucao-operario/SKILL.md)
> 4. [.agents/skills/auditoria-plataforma/SKILL.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/.agents/skills/auditoria-plataforma/SKILL.md)
>
> **Trava de Fidelidade e Estabilidade:** Este plano contempla exclusivamente a atualização semiótica dos pictogramas vetoriais (SVGs) dos botões de **Exportação** e **Importação** da base completa em formato JSON na plataforma *SerTão Criança*. Todas as chamadas funcionais (`exportFullBaseJSON()`, `triggerImportFullBase()`, `importFullBaseJSON()`), atributos de acessibilidade, classes CSS e rotas de estado DEVEM ser mantidos 100% intactos.

---

## 1. Diagnóstico e Contexto

### 1.1 Contexto e Justificativa Semiótica e de Usabilidade
A plataforma *SerTão Criança* oferece recursos vitais de backup e restauração integral da base relacional do Núcleo de Educação Infantil em formato JSON (`exportFullBaseJSON()` e `triggerImportFullBase()`). Esses botões estão disponíveis em dois pontos nodais da interface:
1. **Barra Superior de Ações da Gestão da Rede** (`#homeGestaoActionsCentral`), permitindo que a coordenação e equipe técnica realizem backups rápidos antes de transições de ciclo ou manutenções.
2. **Card Executivo de Backup & Restauração** na tela de Exportação Geral de Dados (`#exportView`).

Atualmente, a interface apresenta a seguinte configuração gráfica nesses botões:
- **Botão "Exportar Base Completa (JSON)":** Utiliza o pictograma clássico de disquete (`save`), com caminho SVG `path d="M19 21H5a2 2 0 0 1-2-2V5..."`.
- **Botão "Importar Base Completa (JSON)":** Utiliza um pictograma de bandeja com **seta apontando para cima** (`upload`), com caminhos `polyline points="17 8 12 3 7 8"` e `line x1="12" y1="3" x2="12" y2="15"`.

### 1.2 O Problema Identificado e a Demanda do Usuário
A metáfora visual adotada gerava uma dissonância cognitiva para os usuários gestores:
1. O botão de **Exportar** utilizava a imagem de um disquete (metáfora arcaica de salvamento local interno), enquanto a ação real consiste em **extrair e gerar um arquivo para fora do sistema**.
2. O botão de **Importar** utilizava o ícone com a seta para cima, que na metáfora de receptáculo/bandeja sugere "retirar da bandeja para fora", quando na realidade a ação de importar consiste em **despejar/inserir os dados para dentro do sistema**.

**Diretriz Solicitada pelo Usuário:**
> *"ao exportar a base, pode ser o pictograma de importar; para importar, o mesmo pictograma, mas com a seta para baixo"*

Portanto, a solução estabelece um par semiótico perfeitamente harmônico e intuitivo:
- **Exportar Base Completa (JSON):** Recebe o pictograma com a bandeja e a **seta apontando para cima** (extrair os dados da bandeja/sistema para fora).
- **Importar Base Completa (JSON):** Recebe o mesmo pictograma com a bandeja, porém com a **seta apontando para baixo** (despejar os dados de fora para dentro da bandeja/sistema).

---

## 2. Arquitetura e Mapeamento de Pontos de Impacto

Os arquivos afetados pela intervenção no projeto são:
- [index.html](file:///Users/bruno/Desktop/gestor%20supervisao_patos/index.html)
- [firebase_deploy/public/index.html](file:///Users/bruno/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html) (espelho obrigatório)
- [CHANGELOG.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/CHANGELOG.md)

### 2.1 Mapeamento das Instâncias dos Botões no DOM

#### Instância 1: Barra de Ações Rápidas da Gestão da Rede (`#homeGestaoActionsCentral`)
- **Linha 3725:** Botão `<button class="btn btn-secondary" onclick="exportFullBaseJSON()" ...>`
- **Linha 3729:** Botão `<button class="btn btn-secondary" onclick="triggerImportFullBase()" ...>`

#### Instância 2: Card de Backup e Restauração em `#exportView`
- **Linha 3994:** Botão `<button class="btn" style="background:#166534; color:#fff;" onclick="exportFullBaseJSON()">`
- **Linha 3998:** Botão `<button class="btn" style="background:#DC2626; color:#fff;" onclick="triggerImportFullBase()">`

### 2.2 Especificação dos Pictogramas Vetoriais Padronizados

Ambos os botões utilizam a classe `.btn-icon` com `viewBox="0 0 24 24"`, herdando a cor tipográfica via `stroke: currentColor`:

| Ação | Rótulo do Botão | SVG Padronizado | Representação Semiótica |
| :--- | :--- | :--- | :--- |
| **Exportar** | `Exportar Base Completa (JSON)` | `<svg class="btn-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>` | Bandeja de dados com seta apontando para CIMA (extração para fora) |
| **Importar** | `Importar Base Completa (JSON)` / `Importar / Sobrescrever (.JSON)` | `<svg class="btn-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>` | Mesma bandeja de dados com seta apontando para BAIXO (inserção para dentro) |

---

## 3. Especificação de Implementação Passo a Passo (Snippets Exatos)

### Passo 1: Atualização dos Botões na Gestão da Rede (`index.html`)

Localizar o bloco no `#homeGestaoActionsCentral` (~linhas 3725-3732 de `index.html`):

**Código Atual:**
```html
          <button class="btn btn-secondary" onclick="exportFullBaseJSON()" style="color:#059669; font-weight:700;">
            <svg class="btn-icon" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Exportar Base Completa (JSON)
          </button>
          <button class="btn btn-secondary" onclick="triggerImportFullBase()" style="color:#DC2626; font-weight:700;">
            <svg class="btn-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Importar Base Completa (JSON)
          </button>
```

**Novo Código:**
```html
          <button class="btn btn-secondary" onclick="exportFullBaseJSON()" style="color:#059669; font-weight:700;">
            <svg class="btn-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Exportar Base Completa (JSON)
          </button>
          <button class="btn btn-secondary" onclick="triggerImportFullBase()" style="color:#DC2626; font-weight:700;">
            <svg class="btn-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Importar Base Completa (JSON)
          </button>
```

---

### Passo 2: Atualização dos Botões no Card de Backup em `#exportView` (`index.html`)

Localizar o bloco no card de Backup & Restauração (~linhas 3993-4002 de `index.html`):

**Código Atual:**
```html
            <div style="display:flex; gap:8px;">
              <button class="btn" style="background:#166534; color:#fff;" onclick="exportFullBaseJSON()">
                <svg class="btn-icon" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                Exportar Base Completa (.JSON)
              </button>
              <button class="btn" style="background:#DC2626; color:#fff;" onclick="triggerImportFullBase()">
                <svg class="btn-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Importar / Sobrescrever (.JSON)
              </button>
            </div>
```

**Novo Código:**
```html
            <div style="display:flex; gap:8px;">
              <button class="btn" style="background:#166534; color:#fff;" onclick="exportFullBaseJSON()">
                <svg class="btn-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Exportar Base Completa (.JSON)
              </button>
              <button class="btn" style="background:#DC2626; color:#fff;" onclick="triggerImportFullBase()">
                <svg class="btn-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Importar / Sobrescrever (.JSON)
              </button>
            </div>
```

---

### Passo 3: Inserção de Asserções Específicas na Suíte de Auditoria In-App (`index.html`)

No Módulo 11 da suíte de testes (`Persistência Local, Backup JSON, Restauração e Relatório para Impressão`, ~linha 27013 de `index.html`), adicionar a validação léxico-estrutural dos pictogramas nos botões:

```javascript
              // Validação semiótica dos pictogramas dos botões de exportação e importação da base completa JSON
              const exportFullBtns = document.querySelectorAll('button[onclick*="exportFullBaseJSON()"]');
              if (exportFullBtns.length === 0) throw new Error('Nenhum botão de exportFullBaseJSON encontrado no DOM');
              exportFullBtns.forEach(btn => {
                const svgContent = btn.querySelector('svg')?.innerHTML || '';
                if (!svgContent.includes('17 8 12 3 7 8') || !svgContent.includes('y1="3"')) {
                  throw new Error('Botão exportFullBaseJSON deve possuir pictograma de bandeja com seta para cima');
                }
              });

              const importFullBtns = document.querySelectorAll('button[onclick*="triggerImportFullBase()"]');
              if (importFullBtns.length === 0) throw new Error('Nenhum botão de triggerImportFullBase encontrado no DOM');
              importFullBtns.forEach(btn => {
                const svgContent = btn.querySelector('svg')?.innerHTML || '';
                if (!svgContent.includes('7 10 12 15 17 10') || !svgContent.includes('y1="15"')) {
                  throw new Error('Botão triggerImportFullBase deve possuir pictograma de bandeja com seta para baixo');
                }
              });
              logger.log('Pictogramas vetoriais de Exportação (seta para cima) e Importação da Base Completa JSON (seta para baixo)', true, `${exportFullBtns.length} de exportação e ${importFullBtns.length} de importação validados`);
```

---

### Passo 4: Sincronização Obrigatória no Arquivo Espelhado
Copiar integralmente as modificações do arquivo `gestor supervisao_patos/index.html` para `gestor supervisao_patos/firebase_deploy/public/index.html`.

---

### Passo 5: Atualização do Changelog Duplo e Incremento de Versão
- Incrementar a versão de **1.38 (v8.2.5)** para **1.39 (v8.2.6)**:
  - No botão `.btn-changelog` do cabeçalho de `index.html` (`<span>Versão 1.39 (v8.2.6)</span>`).
  - No modal `#modalChangelog` de `index.html`.
  - No arquivo `CHANGELOG.md` na tabela resumo e na seção de detalhes da versão 1.39.
- Salvar backup em `intermediárias/aplicativo_v139_modificacao_pictogramas_exportar_importar_json.html`.

---

## 4. Critérios de Aceite e Roteiro de Teste

### 4.1 Critérios de Aceite
1. **Conformidade do Botão Exportar:**
   - Em ambas as telas (`#homeGestaoActionsCentral` e `#exportView`), o botão "Exportar Base Completa (JSON)" exibe o pictograma vetorial de bandeja com **seta para cima**.
2. **Conformidade do Botão Importar:**
   - Em ambas as telas (`#homeGestaoActionsCentral` e `#exportView`), o botão "Importar Base Completa (JSON)" exibe o pictograma vetorial de bandeja com **seta para baixo**.
3. **Preservação Funcional:**
   - O clique no botão Exportar continua acionando o download do arquivo serializado `supervisao_patos_backup_completo_[DATA].json`.
   - O clique no botão Importar continua disparando o input oculto de arquivo (`#importFullBaseFileInput`) e o diálogo nativo do sistema operacional para seleção de arquivo `.json`.
4. **Blindagem Sintática:**
   - O comando `python3 audit_platform.py --check-syntax` retorna 100% de sucesso sem erros sintáticos.
5. **Auditoria Modular Aprovada:**
   - O comando `python3 audit_platform.py --silent-on-success` conclui com 100% dos módulos e testes aprovados, incluindo o Módulo 11 atualizado.

---

## 5. Seção Obrigatória de Auditoria: Alterações, Inclusões e Exclusões

### 5.1 No Algoritmo de Auditoria da CLI (`audit_platform.py`)
- **Modificações necessárias:** Nenhuma alteração de código é necessária em `audit_platform.py`. O script orquestrador CLI já carrega o ambiente headless e coleta todos os resultados gerados dinamicamente pela suíte in-app via endpoint `/__test_report__`.

### 5.2 Na Suíte de Testes In-App (`index.html`)
- **Módulo Afetado:** Módulo 11 (`id: 'backup_exportacao' / name: 'Persistência Local, Backup JSON, Restauração e Relatório para Impressão'`).
- **Inclusão:** Adição da verificação de querySelector em todos os botões com `onclick*="exportFullBaseJSON"` e `onclick*="triggerImportFullBase"` para validar os caminhos SVG (`polyline` e `line`) correspondentes a cada direção da seta.
- **Exclusão:** Nenhuma asserção existente será excluída.
- **Impacto em outros testes:** Nenhum impacto colateral nos 11 outros módulos da suíte.
