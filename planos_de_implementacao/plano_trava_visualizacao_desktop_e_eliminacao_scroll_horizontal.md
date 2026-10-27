# Plano de Implementação: Trava de Visualização Desktop, Eliminação de Transbordo Horizontal e Blindagem da Viewport

---

## 0. Diretriz de Execução Obrigatória (Etapa 2)
> [!IMPORTANT]
> **Atenção Executor / Operário:** Antes de aplicar qualquer modificação em código, leia obrigatoriamente o manual [`WORKFLOW_MACOS.md`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md) e a skill do Antigravity [`.agents/skills/execucao-operario/SKILL.md`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/.agents/skills/execucao-operario/SKILL.md).
> Siga estritamente este plano sem improvisações, mantendo a integridade sintática via JSC (`python3 audit_platform.py --check-syntax`), gerando a versão intermediária de backup, atualizando o changelog duplo para a versão **1.34** e rodando a auditoria modular silenciosa pós-deploy (`python3 audit_platform.py --silent-on-success`).

---

## 1. Diagnóstico e Contexto

### 1.1. O Problema Reportado
O usuário constatou: *"o site não está travado. é possível mover a visualização pelo computador. crie um plano para resolver isso."*

Ao inspecionar a interface em computadores (notebooks e desktops rodando macOS, Windows ou Linux, com mouse ou trackpad):
1. **Ausência de Trava na Raiz do Documento (`html` e `body`):**
   - O elemento `html` não possui qualquer regra CSS declarada.
   - O elemento `body` possui apenas `min-height: 100vh; display: flex; flex-direction: column;` e cores de fundo/texto.
   - Não há declaração de `overflow-x: hidden;`, `width: 100%;`, `max-width: 100vw;` ou `overscroll-behavior-x: none;`.
2. **Efeito Elástico e Deslocamento Lateral via Trackpad / Magic Mouse:**
   - No ecossistema macOS (MacBook trackpads, Magic Mouse, ou trackpads de notebooks PC), qualquer rolagem bimanual diagonal ou horizontal faz com que o viewport deslize lateralmente para fora da tela (*wobble* / *pan lateral*), além de acionar o efeito elástico de "borracha" (*rubber-banding bounce*) e o gesto acidental de voltar/avançar histórico do navegador.
3. **Transbordo Físico do Cabeçalho Desktop (`.desktop-nav` + `.navbar-actions`):**
   - A barra superior desktop possui a marca (`.navbar-brand` ~280px), 8 botões de abas com texto integral (`.desktop-nav` ~1080px) e o agrupamento de ações (`.navbar-actions`: seletor de ano letivo, crachá de perfil "Coordenação Pedagógica" ou "Supervisora / Técnica SerTão Criança", botão de changelog e avatar ~460px).
   - Somados, os componentes exigem até **1820px** de largura horizontal em linha reta (`flex-wrap: nowrap`).
   - Em telas de computadores comuns (1280px, 1366px, 1440px ou monitores de 15" e 13" em resoluções lógicas padrão do MacBook), o cabeçalho ultrapassa a largura da viewport (`scrollWidth > clientWidth`). Como consequência direta, **o navegador cria uma barra/área de rolagem horizontal invisível ou visível que permite deslocar a tela lateralmente**, destravando a visualização.
4. **Falta de Blindagem da Viewport contra Zoom Gestual e Arraste:**
   - A tag `<meta name="viewport" content="width=device-width, initial-scale=1.0">` não possui travas contra redimensionamento acidental de escala (`maximum-scale=1.0, user-scalable=no, viewport-fit=cover`).
   - Gestos de pinça no trackpad ampliam a tela no computador e criam uma área de visualização solta e arrastável em 2D.
5. **Arraste Acidental de Elementos Estáticos:**
   - Imagens (como o logotipo oficial `assets/logo_sertao_crianca.png`), vetores SVG e barras de menu não possuem bloqueio nativo de arraste (`-webkit-user-drag: none; user-select: none;`), fazendo com que o clique e arraste com o mouse puxe "fantasmas" visuais na tela.

---

## 2. Arquitetura e Pontos de Impacto

Os seguintes pontos do ecossistema serão ajustados:
1. **`index.html` (e espelho `firebase_deploy/public/index.html`):**
   - **Tag `<meta name="viewport">`:** Adição de `maximum-scale=1.0, user-scalable=no, viewport-fit=cover`.
   - **Regras CSS Raiz (`html`, `body`):** Trava absoluta com `overflow-x: hidden; width: 100%; max-width: 100vw; overscroll-behavior-x: none; touch-action: pan-y;`.
   - **Regras CSS do Cabeçalho Desktop (`.navbar`, `.navbar-container`, `.desktop-nav`, `.nav-link`, `.navbar-actions`, `.role-badge-btn`):**
     - `.navbar`: `width: 100%; overflow: clip;` (ou `overflow: hidden`).
     - Regras responsivas `@media (min-width: 860px) and (max-width: 1400px)` para compactação ergonômica inteligente das abas e botões do header, prevenindo que ultrapassem a largura da tela em notebooks e MacBooks.
   - **Bloqueio de Drag Acidental de Interface:** Imagens, ícones e barras de navegação com `-webkit-user-drag: none; user-select: none;`.
   - **Garantia de Isolamento de Transbordo Interno:** Assegurar que contêineres tabulares (`.semaphore-table-view`, `.schedule-table-view`, `.ue-executive-table-wrap`) possuam `max-width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch;`, contendo o scroll exclusivamente dentro da sua caixa, sem propagar para o `body`.
   - **Identificação da Versão 1.34:** No botão `.btn-changelog`, no modal `#modalChangelog` e no arquivo `CHANGELOG.md`.
2. **Suíte de Auditoria (`index.html` e `audit_platform.py`):**
   - No módulo `navegacao_layout`:
     - Teste de asserção de ausência de transbordo no viewport raiz (`document.documentElement.scrollWidth <= window.innerWidth`).
     - Teste de presença das propriedades `overflow-x: hidden` e `overscroll-behavior-x: none` computadas no `html` e `body`.
     - Teste de conformidade da tag `<meta name="viewport">` com bloqueio de escala indevida.
     - Atualização da verificação de versão para a **Versão 1.34**.

---

## 3. Especificação de Implementação Passo a Passo (Snippets Exatos)

### Passo 1: Atualização da Tag Viewport no `<head>`
Localizar na linha 5 de `index.html`:
```html
<!-- ANTES -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
```

Substituir por:
```html
<!-- DEPOIS -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
```

---

### Passo 2: Blindagem e Trava Estrita em `html` e `body`
Localizar na seção de estilos globais (por volta das linhas 40-55 de `index.html`):
```css
/* ANTES */
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-tap-highlight-color: transparent;
    }

    body {
      background: var(--bg);
      color: var(--text-primary);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
```

Substituir por:
```css
/* DEPOIS */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-tap-highlight-color: transparent;
    }

    html {
      width: 100%;
      max-width: 100vw;
      overflow-x: hidden;
      overscroll-behavior-x: none;
      touch-action: pan-y;
      -webkit-text-size-adjust: 100%;
    }

    body {
      background: var(--bg);
      color: var(--text-primary);
      min-height: 100vh;
      width: 100%;
      max-width: 100vw;
      overflow-x: hidden;
      overscroll-behavior-x: none;
      touch-action: pan-y;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    /* Prevenção de arraste acidental de elementos gráficos no desktop */
    img, svg, .navbar, .mobile-tabbar {
      -webkit-user-drag: none;
      user-select: none;
    }
```

---

### Passo 3: Prevenção de Transbordo no Cabeçalho Desktop (`.navbar`)
Localizar as regras da navbar (linhas 57-77 de `index.html`):
```css
/* ANTES */
    .navbar {
      background: var(--surface);
      height: var(--header-height);
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 20px;
      box-shadow: var(--shadow-sm);
    }
    .navbar-container {
      width: 100%;
      max-width: 1240px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
```

Substituir por:
```css
/* DEPOIS */
    .navbar {
      background: var(--surface);
      height: var(--header-height);
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 16px;
      box-shadow: var(--shadow-sm);
      width: 100%;
      max-width: 100vw;
      overflow: hidden;
      box-sizing: border-box;
    }
    .navbar-container {
      width: 100%;
      max-width: 1360px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      box-sizing: border-box;
    }
```

E no bloco `@media (min-width: 860px)` (linhas 314-325 de `index.html`), introduzir regras de compressão adaptativa para que as abas e ações nunca forcem a largura em notebooks/desktops intermediários (860px a 1400px):
```css
/* DEPOIS (Adicionar ou enriquecer no bloco desktop) */
    @media (min-width: 860px) {
      .desktop-nav { display: flex; align-items: center; gap: 3px; }
      .mobile-tabbar { display: none !important; }
      .main-wrapper { padding-bottom: 40px; max-width: 1320px; width: 100%; box-sizing: border-box; }
      .grid-2col { grid-template-columns: 1.25fr 0.75fr; }
      .grid-3col { grid-template-columns: repeat(3, 1fr); }
      .card { padding: 24px; }
      .form-textarea { font-size: 14px; }
      .data-table { font-size: 14px; }
      .filter-panel { grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); }
    }

    /* Adaptação Ergonômica de Alta Densidade para Laptops e MacBooks (860px - 1400px) */
    @media (min-width: 860px) and (max-width: 1400px) {
      .navbar-container { gap: 6px; padding: 0 4px; }
      .navbar-brand { gap: 6px; }
      .brand-logo-img { height: 34px; max-height: 34px; }
      .brand-text span { font-size: 10px; }
      .desktop-nav { gap: 2px; }
      .nav-link { padding: 6px 8px; font-size: 12px; gap: 4px; }
      .nav-link svg { width: 15px; height: 15px; }
      .navbar-actions { gap: 6px; }
      .role-badge-btn { padding: 5px 8px; font-size: 11px; max-width: 145px; }
      .role-badge-btn span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .btn-changelog { padding: 5px 8px; font-size: 11px; }
      .academic-year-selector-wrapper { padding: 2px 6px; font-size: 11px; }
    }
```

---

### Passo 4: Isolamento Estrito de Rolagem em Tabelas e Dados Densos
Garantir que todas as classes de tabelas matriciais desktop mantenham confinamento estrito de rolagem horizontal:
```css
/* Assegurar em CSS */
.semaphore-table-view,
.schedule-table-view,
.ue-executive-table-wrap {
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
}
```

---

### Passo 5: Atualização da Versão e Registro do Changelog Duplo (v1.34)
1. **Botão de Versão no Header:**
   Atualizar `.btn-changelog` para exibir: `📌 Versão 1.34`.
2. **Modal de Changelog (`#modalChangelog`):**
   Inserir o card da versão 1.34 no topo da listagem de versões:
   ```html
   <!-- VERSÃO 1.34 -->
   <div style="background:#FFFFFF; border:1px solid var(--border); border-radius:10px; padding:16px; margin-bottom:16px; box-shadow:var(--shadow-sm);">
     <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
       <span style="font-size:14px; font-weight:800; color:var(--primary-dark);">📌 Versão 1.34 (v8.2.1)</span>
       <span style="font-size:11px; font-weight:700; color:var(--text-secondary); background:var(--bg-light); padding:2px 8px; border-radius:12px; border:1px solid var(--border);">OFICIAL</span>
     </div>
     <div style="font-size:12px; color:var(--text-secondary); margin-top:4px;">
       Trava de Visualização Desktop, Eliminação de Transbordo Horizontal e Blindagem da Viewport:
     </div>
     <ul style="font-size:12px; color:var(--text-primary); margin-top:8px; line-height:1.6; padding-left:16px;">
       <li><strong>Trava Absoluta Raiz (<code>html, body</code>):</strong> Aplicação de <code>overflow-x: hidden</code>, <code>width: 100%</code>, <code>max-width: 100vw</code> e <code>overscroll-behavior-x: none</code>, eliminando por completo o deslocamento lateral indesejado da página no computador e o efeito elástico (rubber-band bounce) em trackpads do macOS e navegadores desktop.</li>
       <li><strong>Compactação Ergonômica do Cabeçalho Desktop:</strong> Ajuste responsivo para telas de 860px a 1400px (notebooks e MacBooks), impedindo que as 8 abas de navegação e botões de ação ultrapassem a largura do monitor e forcem rolagem na janela.</li>
       <li><strong>Blindagem da Viewport contra Zoom Gestual:</strong> Adição de <code>maximum-scale=1.0, user-scalable=no, viewport-fit=cover</code> e <code>touch-action: pan-y</code> para evitar ampliação desordenada que torne a tela arrastável em 2D.</li>
       <li><strong>Prevenção de Arraste Indesejado de Elementos:</strong> Bloqueio de drag nativo em imagens de logotipo e barras de navegação (<code>-webkit-user-drag: none</code> e <code>user-select: none</code>).</li>
     </ul>
   </div>
   ```
3. **Arquivo `CHANGELOG.md`:**
   Adicionar a entrada oficial no topo da tabela e a seção detalhada da Versão 1.34.

---

### Passo 6: Atualização da Suíte de Auditoria no Módulo `navegacao_layout`
No arquivo `index.html`, dentro da definição do módulo `navegacao_layout` (em torno da linha 27030):
```javascript
// Adicionar asserções estritas de trava de visualização desktop:
const docEl = document.documentElement;
const htmlStyle = window.getComputedStyle(docEl);
const bodyStyle = window.getComputedStyle(document.body);

if (htmlStyle.overflowX !== 'hidden' && bodyStyle.overflowX !== 'hidden') {
  throw new Error(`Trava de visualização violada: html e body devem conter overflow-x: hidden (html: ${htmlStyle.overflowX}, body: ${bodyStyle.overflowX})`);
}

if (docEl.scrollWidth > window.innerWidth + 2) {
  throw new Error(`Transbordo horizontal detectado no computador: scrollWidth (${docEl.scrollWidth}px) > innerWidth (${window.innerWidth}px)`);
}

const metaVp = document.querySelector('meta[name="viewport"]');
if (!metaVp || !metaVp.content.includes('user-scalable=no') || !metaVp.content.includes('maximum-scale=1.0')) {
  throw new Error('Meta viewport deve conter maximum-scale=1.0 e user-scalable=no para blindagem da tela');
}

logger.log('Blindagem e Trava de Visualização Desktop (Eliminação de Scroll Lateral e Zoom Indesejado)', true);

// Atualizar asserção de versão para Versão 1.34:
if (!btnChangelog.textContent.includes('Versão 1.34')) {
  throw new Error(`Botão de versão desatualizado: "${btnChangelog.textContent.trim()}"`);
}
if (!modalChg.innerHTML.includes('Versão 1.34')) {
  throw new Error('#modalChangelog não contém o card descritivo da Versão 1.34');
}
logger.log('Asserção de Integridade do Cabeçalho e Registro da Versão 1.34 (v8.2.1)', true);
```

---

## 4. Critérios de Aceite e Roteiro de Teste

### Critérios de Aceite
1. **Trava Lateral Estrita:** Em qualquer computador (MacBook, iMac, notebook PC ou desktop), ao rolar a página verticalmente ou deslizar os dedos no trackpad lateralmente, a tela não se move para os lados, não sai da posição e não balança horizontalmente.
2. **Ausência de Scrollbar Horizontal:** Em resoluções comuns de 1024px, 1280px, 1366px, 1440px e superiores, nenhuma barra de rolagem horizontal surge na página principal.
3. **Confinamento de Tabelas:** Tabelas que possuem muitas colunas (ex: Semáforo Bimestral ou Matrizes) contêm o scroll exclusivamente em seus próprios quadros, sem expandir o `body`.
4. **Resistência a Zoom Livre e Arraste:** A tela não se solta como um canvas flutuante através de gestos de pinça no trackpad.
5. **Auditoria Pré e Pós-Deploy:**
   - Sintaxe JS 100% aprovada via JSC (`python3 audit_platform.py --check-syntax`).
   - Auditoria modular 100% aprovada de forma limpa e silenciosa (`python3 audit_platform.py --silent-on-success`).

### Roteiro de Teste do Operário
1. Executar `python3 audit_platform.py --check-syntax` e confirmar sucesso léxico.
2. Criar intermediária `intermediárias/aplicativo_v134_trava_visualizacao_desktop_e_eliminacao_scroll_horizontal.html`.
3. Sincronizar simultaneamente `index.html` e `firebase_deploy/public/index.html`.
4. Efetuar `git fetch origin main` e conferir inexistência de commits divergentes.
5. Commitar com mensagem semântica `feat(ui): travar visualizacao desktop, eliminar transbordo horizontal e blindar viewport (v1.34)`.
6. Enviar alterações com `git push origin main`.
7. Executar `python3 audit_platform.py --silent-on-success` e confirmar aprovação integral dos 12 módulos canônicos.

---

## 5. Seção Obrigatória de Auditoria: Alterações / Adições / Exclusões no Algoritmo de Auditoria (`audit_platform.py`)

### 5.1. No script `audit_platform.py`:
- Nenhuma alteração estrutural necessária nos argumentos de linha de comando ou no handler HTTP.
- O motor headless permanece compatível com os testes determinísticos e validações de sintaxe via JSC.

### 5.2. Nas asserções in-app do Módulo `navegacao_layout` (em `index.html`):
- **Adições:**
  1. Asserção computada de `overflow-x: hidden` e `overscroll-behavior-x: none` em `html` e `body`.
  2. Asserção matemática de ausência de transbordo horizontal no viewport (`document.documentElement.scrollWidth <= window.innerWidth + 2`).
  3. Asserção da presença dos atributos `maximum-scale=1.0` e `user-scalable=no` na tag `<meta name="viewport">`.
  4. Validação da string `Versão 1.34` no botão `.btn-changelog` e no `#modalChangelog`.
- **Exclusões / Atualizações:**
  - Substituição da asserção antiga da versão `1.33` pela versão `1.34`.
