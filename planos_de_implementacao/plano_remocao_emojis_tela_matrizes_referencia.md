# Plano de Implementação: Remoção de Emojis e Padronização Visual na Tela de Matrizes de Referência

---

## 0. Diretriz de Execução (Obrigatória para o Operário - Etapa 2)
> [!IMPORTANT]
> **Leitura Prévia Obrigatória:** Antes de executar qualquer ação deste plano, o assistente na **Etapa 2 (O Operário)** DEVE consultar e seguir rigorosamente:
> 1. [WORKFLOW_MACOS.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md)
> 2. [WORKFLOW_GITHUB.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_GITHUB.md)
> 3. [.agents/skills/execucao-operario/SKILL.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/.agents/skills/execucao-operario/SKILL.md)
> 4. [.agents/skills/auditoria-plataforma/SKILL.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/.agents/skills/auditoria-plataforma/SKILL.md)
>
> **Trava de Fidelidade, Estabilidade e Não Regressão:** Este plano contempla a higienização visual completa da tela de **Matrizes de Referência Oficiais** (`#screenRefDocs`, acessada pela aba desktop `#deskTabRefDocs` e pelo menu mobile), eliminando todos os emojis e caracteres gráficos residuais (`📑`, `👩‍🏫`, `👔`, `🟢`, `👁️`, `↗️`, `📥`, `📤`, `↺`, `📖`, `🔄`) e substituindo-os por pictogramas vetoriais padronizados (*Feather / Lucide* em SVGs inline com classe `.btn-icon`, `.btn-icon-sm` e `stroke="currentColor"`).
> Todos os IDs de elementos, funções de manipulação de PDF (`openOrDownloadPDF`, `previewPDFInTab`, `togglePreviewDocument`, `closePDFPreviewInTab`, `triggerPDFUploadTab`, `restoreDefaultPDF`), lógica de persistência local (`PDFStorage`) e rotas de estado DEVEM ser rigorosamente preservados.

---

## 1. Diagnóstico e Contexto

### 1.1 Contexto e Justificativa Institucional
Na plataforma *SerTão Criança*, a tela **Matrizes de Referência** (`#screenRefDocs`) disponibiliza para consulta direta no painel e download em PDF os dois instrumentos norteadores do acompanhamento formativo da Educação Infantil do município de Patos/PB:
1. **Matriz de Observação da Prática Docente (Seção III):** Instrumento de acompanhamento dos docentes regentes nas dimensões didáticas, repertório, brincadeira, gestão e mediação;
2. **Instrumento de Acompanhamento das Observações Pedagógicas:** Instrumento da formadora para supervisão do planejamento, prática docente, formações continuadas e articulação formativa com a coordenação pedagógica;
3. **Visualizador Integrado no Painel:** Área com iframe para leitura imersiva dos documentos sem necessidade de download ou abertura externa.

Ao longo do desenvolvimento inicial da aplicação, botões, títulos, badges e textos dinâmicos dessa tela receberam emojis Unicode coloridos do sistema operacional:
- `📑` no banner institucional de diretrizes;
- `👩‍🏫` e `👔` nos badges de identificação de público-alvo (Professores e Coordenadores);
- `🟢` nos badges de documento atualizado pelo município (`#pdfTeacherMetaBadgeTab` e `#pdfCoordinatorMetaBadgeTab`);
- `👁️`, `↗️`, `📥`, `📤`, `↺` nos botões de ação e upload de arquivos;
- `📖`, `🔄` no cabeçalho e controles do visualizador integrado;
- Emojis injetados dinamicamente via JavaScript na função `previewPDFInTab()` (`👔` e `👩‍🏫`) e em `updateRefDocsUI()` (`🟢`).

### 1.2 Problemas da Abordagem Anterior
1. **Inconsistência Visual Entre Plataformas:** Glifos Unicode possuem aparências díspares entre sistemas operacionais (estilo 3D com brilho no macOS/iOS, traços planos/cartunescos no Windows e geometria distinta no Android), quebrando a padronização visual da rede municipal.
2. **Sobriedade Institucional:** Um ambiente oficial de gestão pedagógica exige sobriedade gráfica, alinhada aos formulários oficiais do MEC e às diretrizes da Secretaria de Educação.
3. **Desalinhamento com o Design System:** O restante da plataforma (*Header*, *BottomBar*, botões de ação da versão 1.31, sub-abas da versão 1.38, pictogramas de exportação/importação da versão 1.39 e semáforo da versão 1.40) já adotou pictogramas vetoriais SVG monocromáticos limpos. A tela de Matrizes de Referência ainda apresentava esses emojis residuais.

### 1.3 Escopo Detalhado da Intervenção
A intervenção abrange:
1. **Tela Principal de Matrizes de Referência (`#screenRefDocs`):**
   - Banner superior informativo da rede;
   - Card 1 (Matriz de Professores);
   - Card 2 (Matriz de Coordenadores);
   - Controles e títulos do Visualizador Integrado (`#refDocsPreviewContainer`).
2. **JavaScript Dinâmico em `index.html`:**
   - Função `previewPDFInTab()`: remoção dos emojis `👔` e `👩‍🏫` injetados dinamicamente no título `#refDocsPreviewTitle`;
   - Função `updateRefDocsUI()`: substituição do emoji `🟢` por texto limpo ou pictograma vetorial SVG institucional nos badges `#pdfTeacherMetaBadgeTab`, `#pdfTeacherMetaBadge`, `#pdfCoordinatorMetaBadgeTab` e `#pdfCoordinatorMetaBadge`.
3. **Modal Auxiliar Espelhado (`#modalRefDocs`):**
   - Remoção de emojis dos cabeçalhos, botões e badges para garantir alinhamento caso o modal venha a ser invocado.
4. **Seletor de Matriz da Tela de Rubricas (`#screenRubricsAdmin` - escopo preventivo):**
   - Remoção dos emojis `👩‍🏫` e `👔` nas tags `<option>` do `<select id="rubricsAdminMatrixSelect">`.

---

## 2. Arquitetura e Mapeamento de Pontos de Impacto

### 2.1 Arquivos Afetados
- [index.html](file:///Users/bruno/Desktop/gestor%20supervisao_patos/index.html)
- [firebase_deploy/public/index.html](file:///Users/bruno/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html) (cópia espelhada obrigatória)
- [CHANGELOG.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/CHANGELOG.md)

### 2.2 Especificação dos Pictogramas Vetoriais Padronizados (SVGs)

Os botões da aplicação já possuem estilização via `.btn` (`gap: 8px; display: inline-flex; align-items: center; justify-content: center;`) e classes utilitárias `.btn-icon` (16x16px) e `.btn-icon-sm` (13x13px / 14x14px). Todos os novos pictogramas devem seguir rigorosamente o padrão *Feather / Lucide*:
- `stroke="currentColor"` (para herdar a cor do botão ou texto);
- `stroke-width="2"`;
- `stroke-linecap="round"` e `stroke-linejoin="round"`;
- `fill="none"`.

#### Catálogo de Pictogramas:
1. **Documento / Diretrizes Oficiais (Banner e Modal):**
   ```html
   <svg class="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--primary);"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
   ```
2. **Visualizar / Ver no Painel (`previewPDFInTab`):**
   ```html
   <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
   ```
3. **Nova Aba / Abertura Externa (`openOrDownloadPDF`):**
   ```html
   <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
   ```
4. **Baixar PDF (`openOrDownloadPDF` com download=true):**
   ```html
   <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
   ```
5. **Atualizar PDF / Upload (`triggerPDFUploadTab`):**
   ```html
   <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
   ```
6. **Restaurar Original (`restoreDefaultPDF`):**
   ```html
   <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
   ```
7. **Alternar Documento no Preview (`togglePreviewDocument`):**
   ```html
   <svg class="btn-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
   ```
8. **Visualizador Integrado (Título do Preview):**
   ```html
   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--primary);"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
   ```
9. **Badge Atualizado pelo Município (Checkmark Suave):**
   ```html
   <svg class="btn-icon-sm" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
   ```

---

## 3. Especificação Passo a Passo com Snippets Exatos

### 3.1 Alterações na Tela Principal `#screenRefDocs` (linhas ~4806 a 4945)

#### 1. Banner Informativo da Rede:
**Antes:**
```html
      <!-- Banner Informativo da Rede -->
      <div class="card" style="background:#F8FAFC; border:1px solid #E2E8F0; margin-bottom:20px; border-left:4px solid var(--primary);">
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:6px;">
          <span style="font-size:20px;">📑</span>
          <div style="font-size:14px; font-weight:800; color:var(--primary-dark);">Diretrizes e Instrumentos Oficiais da Rede Municipal</div>
        </div>
```
**Depois:**
```html
      <!-- Banner Informativo da Rede -->
      <div class="card" style="background:#F8FAFC; border:1px solid #E2E8F0; margin-bottom:20px; border-left:4px solid var(--primary);">
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:6px;">
          <svg class="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--primary);"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          <div style="font-size:14px; font-weight:800; color:var(--primary-dark);">Diretrizes e Instrumentos Oficiais da Rede Municipal</div>
        </div>
```

---

#### 2. Card da Matriz de Professores:
**Antes:**
```html
        <!-- Documento 1: Matriz de Professores -->
        <div class="card" style="margin:0; padding:20px; border:1px solid #CBD5E1; background:#FFFFFF; display:flex; flex-direction:column; justify-content:space-between; gap:16px; border-radius:12px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          <div>
            <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin-bottom:10px;">
              <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                <span style="font-size:11px; background:#EFF6FF; color:var(--primary); padding:3px 10px; border-radius:12px; font-weight:700;">👩‍🏫 Professores</span>
                <span id="pdfTeacherMetaBadgeTab" class="pdf-meta-badge" style="display:none;">🟢 Atualizado pelo Município</span>
              </div>
              <span id="pdfTeacherInfoTab" style="font-size:11px; color:#64748B; font-weight:600;">PDF de Fábrica · 925 KB</span>
            </div>
```
**Depois:**
```html
        <!-- Documento 1: Matriz de Professores -->
        <div class="card" style="margin:0; padding:20px; border:1px solid #CBD5E1; background:#FFFFFF; display:flex; flex-direction:column; justify-content:space-between; gap:16px; border-radius:12px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          <div>
            <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin-bottom:10px;">
              <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                <span style="font-size:11px; background:#EFF6FF; color:var(--primary); padding:3px 10px; border-radius:12px; font-weight:700;">Professores</span>
                <span id="pdfTeacherMetaBadgeTab" class="pdf-meta-badge" style="display:none;"><svg class="btn-icon-sm" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Atualizado pelo Município</span>
              </div>
              <span id="pdfTeacherInfoTab" style="font-size:11px; color:#64748B; font-weight:600;">PDF de Fábrica · 925 KB</span>
            </div>
```

**Ações do Card de Professores:**
**Antes:**
```html
          <div class="ref-doc-actions-container" style="border-top:1px solid #F1F5F9; padding-top:14px;">
            <div class="ref-doc-primary-actions">
              <button class="btn btn-secondary ref-doc-btn" onclick="previewPDFInTab('teacher')" title="Visualizar documento integrado no painel">
                👁️ Ver no Painel
              </button>
              <button class="btn btn-secondary ref-doc-btn" onclick="openOrDownloadPDF('teacher', false)" title="Abrir PDF em nova aba">
                ↗️ Nova Aba
              </button>
              <button class="btn btn-primary ref-doc-btn" onclick="openOrDownloadPDF('teacher', true)" title="Baixar arquivo PDF completo">
                📥 Baixar PDF
              </button>
            </div>
            <div class="ref-doc-admin-actions">
              <input type="file" id="uploadPdfTeacherInputTab" accept="application/pdf" style="display:none;" onchange="handlePDFUpload('teacher', this)">
              <button class="btn btn-secondary ref-doc-btn-admin" onclick="triggerPDFUploadTab('teacher')" title="Fazer upload de nova versão oficial do PDF">
                📤 Atualizar PDF
              </button>
              <button id="btnRestorePdfTeacherTab" class="btn btn-secondary ref-doc-btn-admin" onclick="restoreDefaultPDF('teacher')" style="display:none;" title="Voltar ao PDF original de fábrica">
                ↺ Restaurar Original
              </button>
            </div>
          </div>
```
**Depois:**
```html
          <div class="ref-doc-actions-container" style="border-top:1px solid #F1F5F9; padding-top:14px;">
            <div class="ref-doc-primary-actions">
              <button class="btn btn-secondary ref-doc-btn" onclick="previewPDFInTab('teacher')" title="Visualizar documento integrado no painel">
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> Ver no Painel
              </button>
              <button class="btn btn-secondary ref-doc-btn" onclick="openOrDownloadPDF('teacher', false)" title="Abrir PDF em nova aba">
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg> Nova Aba
              </button>
              <button class="btn btn-primary ref-doc-btn" onclick="openOrDownloadPDF('teacher', true)" title="Baixar arquivo PDF completo">
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Baixar PDF
              </button>
            </div>
            <div class="ref-doc-admin-actions">
              <input type="file" id="uploadPdfTeacherInputTab" accept="application/pdf" style="display:none;" onchange="handlePDFUpload('teacher', this)">
              <button class="btn btn-secondary ref-doc-btn-admin" onclick="triggerPDFUploadTab('teacher')" title="Fazer upload de nova versão oficial do PDF">
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg> Atualizar PDF
              </button>
              <button id="btnRestorePdfTeacherTab" class="btn btn-secondary ref-doc-btn-admin" onclick="restoreDefaultPDF('teacher')" style="display:none;" title="Voltar ao PDF original de fábrica">
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg> Restaurar Original
              </button>
            </div>
          </div>
```

---

#### 3. Card da Matriz de Coordenadores:
**Antes:**
```html
        <!-- Documento 2: Matriz de Coordenadores -->
        <div class="card" style="margin:0; padding:20px; border:1px solid #CBD5E1; background:#FFFFFF; display:flex; flex-direction:column; justify-content:space-between; gap:16px; border-radius:12px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          <div>
            <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin-bottom:10px;">
              <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                <span style="font-size:11px; background:#F5F3FF; color:var(--purple); padding:3px 10px; border-radius:12px; font-weight:700;">👔 Coordenadores</span>
                <span id="pdfCoordinatorMetaBadgeTab" class="pdf-meta-badge" style="display:none;">🟢 Atualizado pelo Município</span>
              </div>
              <span id="pdfCoordinatorInfoTab" style="font-size:11px; color:#64748B; font-weight:600;">PDF de Fábrica · 170 KB</span>
            </div>
```
**Depois:**
```html
        <!-- Documento 2: Matriz de Coordenadores -->
        <div class="card" style="margin:0; padding:20px; border:1px solid #CBD5E1; background:#FFFFFF; display:flex; flex-direction:column; justify-content:space-between; gap:16px; border-radius:12px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          <div>
            <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin-bottom:10px;">
              <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                <span style="font-size:11px; background:#F5F3FF; color:var(--purple); padding:3px 10px; border-radius:12px; font-weight:700;">Coordenadores</span>
                <span id="pdfCoordinatorMetaBadgeTab" class="pdf-meta-badge" style="display:none;"><svg class="btn-icon-sm" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Atualizado pelo Município</span>
              </div>
              <span id="pdfCoordinatorInfoTab" style="font-size:11px; color:#64748B; font-weight:600;">PDF de Fábrica · 170 KB</span>
            </div>
```

**Ações do Card de Coordenadores:**
**Antes:**
```html
          <div class="ref-doc-actions-container" style="border-top:1px solid #F1F5F9; padding-top:14px;">
            <div class="ref-doc-primary-actions">
              <button class="btn btn-secondary ref-doc-btn" onclick="previewPDFInTab('coordinator')" title="Visualizar documento integrado no painel">
                👁️ Ver no Painel
              </button>
              <button class="btn btn-secondary ref-doc-btn" onclick="openOrDownloadPDF('coordinator', false)" title="Abrir PDF em nova aba">
                ↗️ Nova Aba
              </button>
              <button class="btn btn-primary ref-doc-btn" onclick="openOrDownloadPDF('coordinator', true)" title="Baixar arquivo PDF completo">
                📥 Baixar PDF
              </button>
            </div>
            <div class="ref-doc-admin-actions">
              <input type="file" id="uploadPdfCoordinatorInputTab" accept="application/pdf" style="display:none;" onchange="handlePDFUpload('coordinator', this)">
              <button class="btn btn-secondary ref-doc-btn-admin" onclick="triggerPDFUploadTab('coordinator')" title="Fazer upload de nova versão oficial do PDF">
                📤 Atualizar PDF
              </button>
              <button id="btnRestorePdfCoordinatorTab" class="btn btn-secondary ref-doc-btn-admin" onclick="restoreDefaultPDF('coordinator')" style="display:none;" title="Voltar ao PDF original de fábrica">
                ↺ Restaurar Original
              </button>
            </div>
          </div>
```
**Depois:**
```html
          <div class="ref-doc-actions-container" style="border-top:1px solid #F1F5F9; padding-top:14px;">
            <div class="ref-doc-primary-actions">
              <button class="btn btn-secondary ref-doc-btn" onclick="previewPDFInTab('coordinator')" title="Visualizar documento integrado no painel">
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> Ver no Painel
              </button>
              <button class="btn btn-secondary ref-doc-btn" onclick="openOrDownloadPDF('coordinator', false)" title="Abrir PDF em nova aba">
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg> Nova Aba
              </button>
              <button class="btn btn-primary ref-doc-btn" onclick="openOrDownloadPDF('coordinator', true)" title="Baixar arquivo PDF completo">
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Baixar PDF
              </button>
            </div>
            <div class="ref-doc-admin-actions">
              <input type="file" id="uploadPdfCoordinatorInputTab" accept="application/pdf" style="display:none;" onchange="handlePDFUpload('coordinator', this)">
              <button class="btn btn-secondary ref-doc-btn-admin" onclick="triggerPDFUploadTab('coordinator')" title="Fazer upload de nova versão oficial do PDF">
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg> Atualizar PDF
              </button>
              <button id="btnRestorePdfCoordinatorTab" class="btn btn-secondary ref-doc-btn-admin" onclick="restoreDefaultPDF('coordinator')" style="display:none;" title="Voltar ao PDF original de fábrica">
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg> Restaurar Original
              </button>
            </div>
          </div>
```

---

#### 4. Visualizador Integrado no Painel:
**Antes:**
```html
      <!-- Visualizador Integrado no Painel (Iframe / Preview) -->
      <div id="refDocsPreviewContainer" class="card" style="display:none; margin-top:20px; padding:16px; background:#FFFFFF; border:1px solid #CBD5E1; border-radius:12px; box-shadow:0 2px 6px rgba(0,0,0,0.06);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:10px; border-bottom:1px solid #E2E8F0; padding-bottom:10px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:18px;">📖</span>
            <div id="refDocsPreviewTitle" style="font-size:14px; font-weight:800; color:var(--primary-dark);">Visualizador Integrado</div>
          </div>
          <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
            <button class="btn btn-secondary" style="font-size:11px; padding:5px 10px;" onclick="togglePreviewDocument()" title="Alternar entre Matriz de Professores e Coordenadores">
              🔄 Alternar Documento
            </button>
            <button class="btn btn-secondary" style="font-size:11px; padding:5px 10px;" onclick="openOrDownloadPDF(window.activePreviewMatrixType || 'teacher', false)" title="Abrir em tela cheia / nova aba">
              ↗️ Nova Aba
            </button>
            <button class="btn btn-primary" style="font-size:11px; padding:5px 10px;" onclick="openOrDownloadPDF(window.activePreviewMatrixType || 'teacher', true)" title="Baixar este PDF">
              📥 Baixar
            </button>
            <button class="btn btn-secondary" style="font-size:11px; padding:5px 10px; color:#64748B;" onclick="closePDFPreviewInTab()" title="Fechar visualizador">
              ✕ Fechar
            </button>
          </div>
        </div>
```
**Depois:**
```html
      <!-- Visualizador Integrado no Painel (Iframe / Preview) -->
      <div id="refDocsPreviewContainer" class="card" style="display:none; margin-top:20px; padding:16px; background:#FFFFFF; border:1px solid #CBD5E1; border-radius:12px; box-shadow:0 2px 6px rgba(0,0,0,0.06);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:10px; border-bottom:1px solid #E2E8F0; padding-bottom:10px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--primary);"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
            <div id="refDocsPreviewTitle" style="font-size:14px; font-weight:800; color:var(--primary-dark);">Visualizador Integrado</div>
          </div>
          <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
            <button class="btn btn-secondary" style="font-size:11px; padding:5px 10px;" onclick="togglePreviewDocument()" title="Alternar entre Matriz de Professores e Coordenadores">
              <svg class="btn-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg> Alternar Documento
            </button>
            <button class="btn btn-secondary" style="font-size:11px; padding:5px 10px;" onclick="openOrDownloadPDF(window.activePreviewMatrixType || 'teacher', false)" title="Abrir em tela cheia / nova aba">
              <svg class="btn-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg> Nova Aba
            </button>
            <button class="btn btn-primary" style="font-size:11px; padding:5px 10px;" onclick="openOrDownloadPDF(window.activePreviewMatrixType || 'teacher', true)" title="Baixar este PDF">
              <svg class="btn-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Baixar
            </button>
            <button class="btn btn-secondary" style="font-size:11px; padding:5px 10px; color:#64748B;" onclick="closePDFPreviewInTab()" title="Fechar visualizador">
              <svg class="btn-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> Fechar
            </button>
          </div>
        </div>
```

---

### 3.2 Alterações no JavaScript Dinâmico (`index.html`)

#### 1. Função `updateRefDocsUI()` (linhas ~23130 a 23180):
**Antes:**
```javascript
        // Teacher
        const teacherDoc = await PDFStorage.getPDF('teacher');
        ['pdfTeacherMetaBadge', 'pdfTeacherMetaBadgeTab'].forEach(id => {
          const el = document.getElementById(id);
          if (el) {
            el.style.display = teacherDoc ? 'inline-flex' : 'none';
            if (teacherDoc) el.innerText = '🟢 Atualizado pelo Município';
          }
        });
...
        // Coordinator
        const coordDoc = await PDFStorage.getPDF('coordinator');
        ['pdfCoordinatorMetaBadge', 'pdfCoordinatorMetaBadgeTab'].forEach(id => {
          const el = document.getElementById(id);
          if (el) {
            el.style.display = coordDoc ? 'inline-flex' : 'none';
            if (coordDoc) el.innerText = '🟢 Atualizado pelo Município';
          }
        });
```
**Depois:**
```javascript
        // Teacher
        const teacherDoc = await PDFStorage.getPDF('teacher');
        ['pdfTeacherMetaBadge', 'pdfTeacherMetaBadgeTab'].forEach(id => {
          const el = document.getElementById(id);
          if (el) {
            el.style.display = teacherDoc ? 'inline-flex' : 'none';
            if (teacherDoc) el.innerHTML = '<svg class="btn-icon-sm" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Atualizado pelo Município';
          }
        });
...
        // Coordinator
        const coordDoc = await PDFStorage.getPDF('coordinator');
        ['pdfCoordinatorMetaBadge', 'pdfCoordinatorMetaBadgeTab'].forEach(id => {
          const el = document.getElementById(id);
          if (el) {
            el.style.display = coordDoc ? 'inline-flex' : 'none';
            if (coordDoc) el.innerHTML = '<svg class="btn-icon-sm" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Atualizado pelo Município';
          }
        });
```

#### 2. Função `previewPDFInTab()` (linhas ~23205 a 23215):
**Antes:**
```javascript
      if (title) {
        title.innerHTML = matrixType === 'coordinator' 
          ? '👔 <strong>Visualização:</strong> Instrumento de Acompanhamento das Observações Pedagógicas (Coordenadores)'
          : '👩‍🏫 <strong>Visualização:</strong> Matriz de Observação da Prática Docente (Professores)';
      }
```
**Depois:**
```javascript
      if (title) {
        title.innerHTML = matrixType === 'coordinator' 
          ? '<strong>Visualização:</strong> Instrumento de Acompanhamento das Observações Pedagógicas (Coordenadores)'
          : '<strong>Visualização:</strong> Matriz de Observação da Prática Docente (Professores)';
      }
```

---

### 3.3 Alterações no Modal Auxiliar Espelhado `#modalRefDocs` (linhas ~5140 a 5240)

Higienização completa dos elementos correspondentes no `#modalRefDocs`:
1. Ícone do cabeçalho do modal: substituir `<div ...>📑</div>` por `<svg class="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`;
2. Badges estáticos `#pdfTeacherMetaBadge` e `#pdfCoordinatorMetaBadge`: remover `🟢` e incluir o SVG checkmark;
3. Botões `.ref-doc-btn` de `teacher` e `coordinator`:
   - `👁️ Visualizar` ➔ `<svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> Visualizar`
   - `📥 PDF` ➔ `<svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> PDF`
   - `📤 Atualizar PDF` ➔ `<svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg> Atualizar PDF`
   - `↺ Restaurar Original` ➔ `<svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg> Restaurar Original`

---

### 3.4 Higienização Preventiva no Seletor de Matrizes de `#screenRubricsAdmin` (linha ~4969)

No `<select id="rubricsAdminMatrixSelect">`:
**Antes:**
```html
<select id="rubricsAdminMatrixSelect" class="form-control" style="max-width:280px; font-weight:700;" onchange="switchRubricsAdminMatrix(this.value)">
  <option value="teacher">👩‍🏫 Matriz de Professores</option>
  <option value="coordinator">👔 Matriz de Coordenadores</option>
</select>
```
**Depois:**
```html
<select id="rubricsAdminMatrixSelect" class="form-control" style="max-width:280px; font-weight:700;" onchange="switchRubricsAdminMatrix(this.value)">
  <option value="teacher">Matriz de Professores</option>
  <option value="coordinator">Matriz de Coordenadores</option>
</select>
```

---

## 4. Critérios de Aceite e Roteiro de Teste

### 4.1 Critérios de Aceite
1. **Ausência Total de Emojis:** Nenhum caractere gráfico ou emoji Unicode (`📑`, `👩‍🏫`, `👔`, `🟢`, `👁️`, `↗️`, `📥`, `📤`, `↺`, `📖`, `🔄`) deve estar presente no DOM estático ou ser gerado dinamicamente via JS na tela `#screenRefDocs`.
2. **Harmonização Visual dos Pictogramas:** Todos os botões devem renderizar ícones SVG nítidos com `.btn-icon` ou `.btn-icon-sm`, perfeitamente alinhados ao texto e respeitando as cores semânticas (`stroke="currentColor"`).
3. **Preservação Funcional Absoluta:**
   - O clique em "Ver no Painel" deve abrir o visualizador integrado (`#refDocsPreviewContainer`) sem erros no console;
   - O título dinâmico da pré-visualização deve exibir o nome do instrumento sem emojis;
   - O botão "Alternar Documento" deve comutar entre os PDFs de Professores e Coordenadores com funcionamento íntegro;
   - O botão "Nova Aba" e "Baixar PDF" devem manter seus comportamentos via `openOrDownloadPDF()`;
   - O botão "Atualizar PDF" e "Restaurar Original" devem manter o upload e a restauração do PDF de fábrica intactos.
4. **Sintaxe JavaScript Intacta:** `python3 audit_platform.py --check-syntax` deve retornar 100% de sucesso sem erros de sintaxe no JavaScriptCore.

### 4.2 Roteiro de Testes
1. Acessar a tela `#screenRefDocs` via `navigateToTab('refDocs')`.
2. Inspecionar o texto de todos os botões e títulos em busca de emojis.
3. Clicar em "Ver no Painel" na Matriz de Professores e verificar o título exibido.
4. Clicar em "Alternar Documento" e verificar a comutação para a Matriz de Coordenadores e seu título.
5. Fechar o visualizador via botão "Fechar".
6. Executar a suíte de auditoria completa pós-deploy: `python3 audit_platform.py --silent-on-success`.

---

## 5. Seção Obrigatória de Auditoria (`audit_platform.py` e Suíte In-App)

### 5.1 Alterações / Adições / Exclusões no Algoritmo de Auditoria (`audit_platform.py`)
- O script de auditoria `audit_platform.py` orquestra a execução da suíte in-app via Chrome headless e valida a sintaxe pré-voo via engine JSC nativa do macOS (`--check-syntax`).
- Nenhuma alteração de infraestrutura é necessária em `audit_platform.py`.

### 5.2 Adições na Suíte In-App (`index.html` - Módulo 12: `navegacao_layout`)
No Módulo 12 da suíte de testes in-app de `index.html` (linhas ~27130 a 27145), adicionar uma asserção estrita que navega para a aba `refDocs` e valida a ausência de emojis e a presença dos pictogramas SVG na tela `#screenRefDocs`:

```javascript
// Validação da higienização visual na tela de Matrizes de Referência Oficiais
navigateToTab('refDocs');
const screenRefDocsEl = document.getElementById('screenRefDocs');
if (!screenRefDocsEl) throw new Error('Tela screenRefDocs não encontrada no DOM');

// Regex para detecção de emojis comuns na tela
const emojiRegex = /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

const refButtons = screenRefDocsEl.querySelectorAll('.ref-doc-btn, .ref-doc-btn-admin, .page-title, #refDocsPreviewTitle, #refDocsPreviewContainer button');
refButtons.forEach(el => {
  if (emojiRegex.test(el.innerText)) {
    throw new Error(`Emoji residual detectado no elemento de Matrizes de Referência: "${el.innerText.trim()}"`);
  }
});

// Validação de presença dos pictogramas SVG nos botões principais
const previewBtn = screenRefDocsEl.querySelector("button[onclick*=\"previewPDFInTab('teacher')\"]");
if (!previewBtn || !previewBtn.querySelector('svg')) {
  throw new Error('Botão Ver no Painel da Matriz Docente deve conter pictograma SVG');
}
logger.log('Higienização visual de Matrizes de Referência (ausência de emojis e presença de SVGs vetoriais)', true, 'Tela screenRefDocs 100% higienizada');
```

---

## 6. Checklist de Execução para a Etapa 2 (Operário)
- [ ] Executar `git pull origin main` no início da Etapa 2.
- [ ] Criar arquivo de backup intermediário: `intermediárias/aplicativo_v141_remocao_emojis_matrizes_referencia.html`.
- [ ] Aplicar as alterações visuais em `index.html` (banners, cards, visualizador, funções JS e modal espelhado).
- [ ] Adicionar a nova asserção de teste no Módulo 12 da suíte in-app de `index.html`.
- [ ] Espelhar fielmente todas as alterações em `firebase_deploy/public/index.html`.
- [ ] Validar a integridade sintática do JavaScript:
  ```bash
  python3 audit_platform.py --check-syntax
  ```
- [ ] Atualizar o `CHANGELOG.md` e o `#modalChangelog` / botão `.btn-changelog` no `index.html` para a versão **1.41 (v8.2.8)**.
- [ ] Realizar a checagem pré-push de concorrência (`git fetch origin main` e `git log HEAD..origin/main --oneline`).
- [ ] Commitar com mensagem semântica: `feat: remocao de emojis e padronizacao visual na tela de matrizes de referencia`.
- [ ] Enviar as alterações com `git push origin main`.
- [ ] Executar a auditoria headless pós-deploy:
  ```bash
  python3 audit_platform.py --silent-on-success
  ```
