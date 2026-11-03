# Plano de Implementação: Harmonização da Trava de Visualização (Hallmark Standard vs. Asserção de Auditoria)

---

## 0. Diretriz de Execução (Obrigatória para Etapa 2)
> [!IMPORTANT]
> **Atenção:** Qualquer agente ou desenvolvedor que for executar este plano **DEVE LER OBRIGATORIAMENTE** o arquivo [WORKFLOW_MACOS.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md) e a skill [execucao-operario](file:///Users/bruno/Desktop/gestor%20supervisao_patos/.agents/skills/execucao-operario/SKILL.md) antes de iniciar.
> É expressamente proibido improvisar, alterar escopos não descritos ou pular etapas do checklist operacional (criação de backup intermediário, validação sintática via `python3 audit_platform.py --check-syntax`, changelog duplo, sincronização espelhada com `firebase_deploy/public/` e auditoria pós-deploy).

---

## 1. Diagnóstico e Contexto

### 1.1 O Problema Identificado
Durante a execução pós-deploy da auditoria automatizada (`python3 audit_platform.py --silent-on-success`), o Módulo 12 (`navegacao_layout`) acusou reprovação no Item 16:
```text
✖ FAIL | Erro de execução no módulo navegacao_layout ➔ Trava de visualização violada: html e body devem conter overflow-x: hidden (html: clip, body: clip)
```

### 1.2 Análise Forense da Causa-Raiz
1. **Regra de Ouro do Hallmark Standard (Cláusula 4 Floor):**
   - *"Apply `overflow-x: clip` (not `hidden`, never `100vw`) on `html` and `body`."*
   - O uso de `overflow-x: clip` é superior a `hidden` em engines modernas (WebKit/Blink/Gecko) porque previne completamente o transbordo horizontal indesejado **sem quebrar o contexto de rolagem vertical nem desligar a aceleração de hardware de `position: sticky`**, além de impedir que o navegador crie um scroll container interno invisível e desnecessário.
   - Em `css/01_variables.css` (linhas 174 a 193), o CSS foi corretamente atualizado conforme o Hallmark Floor:
     ```css
     /* Hallmark Floor 4: overflow-x: clip no html e body (proibido hidden e 100vw) */
     html {
       width: 100%;
       overflow-x: clip;
       overscroll-behavior-x: none;
       touch-action: pan-y;
       -webkit-text-size-adjust: 100%;
     }

     body {
       ...
       width: 100%;
       overflow-x: clip;
       overscroll-behavior-x: none;
       touch-action: pan-y;
       ...
     }
     ```

2. **Asserção Legada no Motor de Testes (`js/audit/audit_engine.js` - Item 16):**
   - O teste automatizado no Módulo 12 foi concebido na Versão 1.34 quando o padrão anterior adotava `overflow-x: hidden`:
     ```javascript
     // 16. BLINDAGEM E TRAVA DE VISUALIZAÇÃO DESKTOP (ELIMINAÇÃO DE SCROLL LATERAL E ZOOM INDESEJADO)
     const docEl = document.documentElement;
     const htmlStyle = window.getComputedStyle(docEl);
     const bodyStyle = window.getComputedStyle(document.body);

     if (htmlStyle.overflowX !== 'hidden' && bodyStyle.overflowX !== 'hidden') {
       throw new Error(`Trava de visualização violada: html e body devem conter overflow-x: hidden (html: ${htmlStyle.overflowX}, body: ${bodyStyle.overflowX})`);
     }
     ```
   - O teste realiza checagem rígida por igualdade estrita com `'hidden'`, desconsiderando o padrão canônico `'clip'`.

3. **Validação de Transbordo Real:**
   - O teste já possui a verificação física mais importante:
     ```javascript
     if (window.innerWidth >= 860 && docEl.scrollWidth > window.innerWidth + 2) {
       throw new Error(`Transbordo horizontal detectado no computador: scrollWidth (${docEl.scrollWidth}px) > innerWidth (${window.innerWidth}px)`);
     }
     ```
   - Com `overflow-x: clip`, o transbordo real é 0px (aprovado).

---

## 2. Arquitetura da Solução e Pontos de Impacto

### Arquivos Envolvidos
1. `js/audit/audit_engine.js`:
   - Atualizar a asserção do Item 16 para aceitar os dois valores canônicos de contenção de viewport: `'clip'` (Hallmark Standard recomendado) e `'hidden'` (fallback compatível).
2. Sincronização em `firebase_deploy/public/js/audit/audit_engine.js`:
   - Manter espelhamento síncrono.
3. Changelog Duplo e Backup Intermediário:
   - Registrar a adequação na versão sequencial 1.66 (`aplicativo_v1.66_harmonizacao_trava_visualizacao_hallmark.html`).

---

## 3. Especificação de Implementação Passo a Passo (Snippets Exatos)

### Passo 1: Atualização da Asserção em `js/audit/audit_engine.js`

Localizar no arquivo `js/audit/audit_engine.js` (em torno da linha 3461):

```javascript
              // 16. BLINDAGEM E TRAVA DE VISUALIZAÇÃO DESKTOP (ELIMINAÇÃO DE SCROLL LATERAL E ZOOM INDESEJADO)
              const docEl = document.documentElement;
              const htmlStyle = window.getComputedStyle(docEl);
              const bodyStyle = window.getComputedStyle(document.body);

              if (htmlStyle.overflowX !== 'hidden' && bodyStyle.overflowX !== 'hidden') {
                throw new Error(`Trava de visualização violada: html e body devem conter overflow-x: hidden (html: ${htmlStyle.overflowX}, body: ${bodyStyle.overflowX})`);
              }
```

Substituir por:

```javascript
              // 16. BLINDAGEM E TRAVA DE VISUALIZAÇÃO DESKTOP (ELIMINAÇÃO DE SCROLL LATERAL E ZOOM INDESEJADO - HALLMARK STANDARD)
              const docEl = document.documentElement;
              const htmlStyle = window.getComputedStyle(docEl);
              const bodyStyle = window.getComputedStyle(document.body);

              const isContained = (val) => val === 'clip' || val === 'hidden';
              if (!isContained(htmlStyle.overflowX) && !isContained(bodyStyle.overflowX)) {
                throw new Error(`Trava de visualização violada: html e body devem conter overflow-x: clip ou hidden (html: ${htmlStyle.overflowX}, body: ${bodyStyle.overflowX})`);
              }
```

---

## 4. Critérios de Aceite e Roteiro de Teste

### Critérios de Aceite
1. **Conformidade com o Hallmark Standard:**
   - `html` e `body` permanecem com `overflow-x: clip`, respeitando integralmente a regra 4 do Hallmark Floor.
2. **Aprovação na Auditoria Automatizada:**
   - O Módulo 12 (`navegacao_layout`) atinge 17/17 testes aprovados (100%).
   - A suíte completa atinge 181/181 testes aprovados sem falhas.
3. **Blindagem Sintática Pré-Voo:**
   - 100% de integridade léxica/sintática via `python3 audit_platform.py --check-syntax`.

---

## 5. Seção Obrigatória de Auditoria: Mapeamento para o `audit_platform.py` e `audit_engine.js`

### 5.1 Alterações / Adições no Motor de Testes (`js/audit/audit_engine.js`)
- Harmonização da cláusula de validação do Item 16 para reconhecer `overflow-x: clip` conforme o padrão arquitetural Hallmark.

### 5.2 Validação Sintática Pré-Voo
- Executar `python3 audit_platform.py --check-syntax` antes do commit.

### 5.3 Auditoria Pós-Deploy
- Executar `python3 audit_platform.py --silent-on-success` após o deploy na branch `main` e confirmar 0 falhas reportadas.
