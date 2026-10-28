# Plano de Implementação: Remoção dos Textos de Tamanho/Origem do PDF na Aba de Matrizes de Referência

## 1. Contexto e Motivação
Na aba permanente de Matrizes de Referência (`#screenRefDocs`), os cards dos documentos oficiais da Matriz de Professores e da Matriz de Coordenadores exibiam textos informativos estáticos complementares nos elementos `<span id="pdfTeacherInfoTab">PDF de Fábrica · 925 KB</span>` e `<span id="pdfCoordinatorInfoTab">PDF de Fábrica · 170 KB</span>`.
O usuário solicitou uma alteração rápida e pontual para retirar esses textos informativos da interface.

## 2. Diagnóstico Técnico
1. **Markup HTML (`index.html`)**:
   - Linha 1321: `<span id="pdfTeacherInfoTab" style="font-size:11px; color:#64748B; font-weight:600;">PDF de Fábrica · 925 KB</span>`
   - Linha 1372: `<span id="pdfCoordinatorInfoTab" style="font-size:11px; color:#64748B; font-weight:600;">PDF de Fábrica · 170 KB</span>`
2. **Atualização Dinâmica de Interface (`js/features/indicators.js`)**:
   - Na função `updateRefDocsUI()`, os IDs `pdfTeacherInfoTab` e `pdfCoordinatorInfoTab` recebiam `el.innerText = 'PDF de Fábrica · 925 KB'` e `el.innerText = 'PDF de Fábrica · 170 KB'` quando o documento não era personalizado.
   - Ajustar para que para os elementos da aba permanente (`pdfTeacherInfoTab` e `pdfCoordinatorInfoTab`), o texto permaneça vazio (`''`) quando for o PDF padrão de fábrica.
3. **Auditoria da Plataforma (`audit_platform.py` e `js/audit/audit_engine.js`)**:
   - Em `js/audit/audit_engine.js`, sincronizar a asserção da versão no Módulo 12 (`navegacao_layout`) para a versão 1.47, garantindo aprovação total.

## 3. Plano de Ação Passo a Passo (Etapa 2)
1. **Limpeza no `index.html`**:
   - Esvaziar o texto dos spans `#pdfTeacherInfoTab` e `#pdfCoordinatorInfoTab`.
2. **Ajuste em `js/features/indicators.js`**:
   - Na função `updateRefDocsUI()`, definir `el.innerText = ''` para os elementos com sufixo `Tab` quando não houver documento personalizado.
3. **Changelog & Versão**:
   - Atualizar `CHANGELOG.md` e o botão/modal de changelog no `index.html` para a Versão 1.47.
   - Atualizar asserção da versão no Módulo 12 de `js/audit/audit_engine.js`.
4. **Backup Intermediário**:
   - Salvar backup em `intermediárias/aplicativo_v147_remocao_textos_pdf_fabrica_matrizes.html`.
5. **Espelhamento**:
   - Copiar/sincronizar atualizações na pasta espelho `gestor supervisao_patos/` conforme normativo.
6. **Validação Pré-Voo & Deploy**:
   - Validar sintaxe com `python3 audit_platform.py -c`.
   - Executar `git fetch origin main` e `git push origin main`.
   - Rodar `python3 audit_platform.py --silent-on-success`.

## 4. Alterações / Adições / Exclusões no Algoritmo de Auditoria (`audit_platform.py`)
- Em `js/audit/audit_engine.js` (Módulo 12 - `navegacao_layout`), sincronizar a verificação do rótulo do botão `.btn-changelog` e do card no `#modalChangelog` com a nova versão gerada (Versão 1.47).
