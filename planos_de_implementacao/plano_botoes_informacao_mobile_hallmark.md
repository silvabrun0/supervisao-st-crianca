# Plano de Implementação: Botões de Informação e Descluttering Mobile (Padrão Hallmark)

## 0. Diretriz de Execução (Obrigatória para a Etapa 2)
> [!IMPORTANT]
> **Atenção Executor (Operário da Etapa 2):**
> Antes de aplicar qualquer alteração de código descrita neste plano, é **estritamente obrigatório**:
> 1. Ler o documento normativo [WORKFLOW_MACOS.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md);
> 2. Consultar a skill do workspace `.agents/skills/execucao-operario/SKILL.md`;
> 3. Seguir à risca as regras de proteção: **NUNCA abrir o Google Chrome gráfico interativo**, validar previamente a sintaxe do JavaScript inline via `python3 audit_platform.py --check-syntax`, gerar backup intermediário versionado em `intermediárias/aplicativo_v1.60_botoes_informacao_mobile_hallmark.html`, atualizar o changelog duplo (`CHANGELOG.md` e `#modalChangelog` / `.btn-changelog`), espelhar simultaneamente em `firebase_deploy/public/`, realizar checagem pré-push (`git fetch origin main`) e rodar a auditoria headless (`python3 audit_platform.py --silent-on-success`) como etapa final pós-deploy.

---

## 1. Diagnóstico e Contexto

### 1.1. O Problema da Poluição Textual no Mobile
Atualmente, o sistema **SerTão Criança** possui múltiplos parágrafos e legendas descritivas associadas aos cabeçalhos de telas, seções e cartões funcionais. Exemplos notáveis incluem:
- Na tabela executiva do Painel de Indicadores: *"Acompanhamento consolidado para priorização de suporte e visitas de campo"*;
- No card de Materiais: *"Proporção de observações registradas em cada nível de materiais na Educação Infantil..."*;
- No Raio-X Longitudinal: *"Comparativo cronológico de cada critério avaliado entre o 1º, 2º, 3º e 4º Bimestres"*;
- Na tela de Histórico: *"Consultas e auditoria de registros com filtros avançados"*;
- Na tela de Ocorrências: *"Anotações qualitativas para subsidiar a devolutiva final e intervenções pedagógicas"*;
- Na Matriz de Referência e nos cartões de Extração SSOT: múltiplos parágrafos explicativos de 2 a 4 linhas.

Em monitores desktop ou notebooks (>= 1024px), esses textos distribuem-se harmoniosamente em linhas horizontais e orientam a usuária. No entanto, em **dispositivos móveis (smartphones, viewport ≤ 768px)**:
1. **Consumo excessivo de área nobre vertical:** Cada parágrafo consome entre 40px e 90px de altura útil na tela, empurrando os componentes operacionais decisivos (tabelas, filtros, gráficos e botões de ação) para baixo da dobra (*below the fold*);
2. **Fadiga cognitiva e desarmonia visual:** A formadora ou coordenadora de campo precisa rolar a tela repetidamente durante a visita técnica apenas para ultrapassar blocos de texto repetitivos que ela já conhece;
3. **Inconformidade com o Hallmark Floor:** A regra 13 do padrão Hallmark estabelece o teto de *cerca de 80 palavras por tela* ("about 80 words on any one screen"). A proliferação de descrições estáticas viola esse princípio em telas de smartphone.

### 1.2. A Solução Arquitetural: Botão de Informação Progressivo (Pictograma Vetorial)
Substituir a exibição desses textos explicativos no celular por um **botão de informação discreto, elegante e acessível**, dotado de um **pictograma vetorial SVG monocromático** (círculo com "i"), preservando o texto explicativo em sua completude através de um **bottom-sheet nativo móvel** sob demanda (*progressive disclosure*).
- **No celular (viewport ≤ 768px):** O texto explicativo fica oculto (`display: none`), e o botão de informação surge inline ao lado do título (`display: inline-flex`), com alvo de toque ergonômico de 44x44px (`touch-target-min`). Ao tocar no pictograma, um bottom-sheet móvel desliza elegantemente com o título da seção, o texto descritivo integral e um botão "Entendido";
- **No desktop (viewport > 768px):** O texto explicativo permanece visível no fluxo natural da página (`display: block`), e o botão de informação fica oculto (`display: none`), evitando redundância;
- **Padrão Hallmark Estrito:** Proibição de emojis (como ℹ️ ou 💡), uso obrigatório de tokens CSS declarados em `:root`, foco instantâneo com `:focus-visible`, transições suaves sem `transition: all`, e respeito integral a `prefers-reduced-motion: reduce`.

---

## 2. Arquitetura e Pontos de Impacto

### 2.1. Componentes Criados
1. **Tokens Semânticos de Informação (`css/01_variables.css`):**
   - `--info-btn-bg`, `--info-btn-text`, `--info-btn-border`, `--info-btn-hover-bg`, `--info-btn-hover-text`, `--info-btn-focus-ring`.
2. **Classes Utilitárias de Interface (`css/03_components.css` e `css/04_screens.css`):**
   - `.btn-platform-info`: Botão circular de informação, alinhado inline com o título.
   - `.info-pictogram`: Ícone SVG de 16x16px vetorial puro com traço de 2px.
   - `.platform-info-text`: Classe universal aplicada a subtítulos e parágrafos explicativos (visível em desktop, oculta em telas ≤ 768px).
3. **Modal / Bottom Sheet Universal `#modalPlatformInfo` (`index.html`):**
   - Modal reaproveitando o layout padronizado `.modal-backdrop.mobile-bottom-sheet-backdrop` e painel `.modal-panel.mobile-bottom-sheet-panel`.
4. **Controlador Global de Informação (`js/core/navigation.js`):**
   - Funções `openPlatformInfoModal(title, text)` e `closePlatformInfoModal(e)`.

### 2.2. Mapa Completo de Pontos de Impacto na Plataforma

| ID | Localização / Módulo | Título da Seção | Texto Explicativo (Armazenado no Botão) |
| :---: | :--- | :--- | :--- |
| **01** | `js/features/indicators.js` | Cobertura e Consistência por Unidade Escolar · {Bimestre} | *"Acompanhamento consolidado para priorização de suporte e visitas de campo"* |
| **02** | `js/features/indicators.js` | Distribuição do Uso de Materiais (Síntese Pedagógica) | *"Proporção de observações registradas em cada nível de materiais na Educação Infantil ({matTotal} registros com escala)"* |
| **03** | `js/features/indicators.js` | Raio-X Longitudinal Item a Item · Matriz Pedagógica | *"Comparativo cronológico de cada critério avaliado entre o 1º, 2º, 3º e 4º Bimestres"* |
| **04** | `js/features/indicators.js` | Visualização por Dimensão dos Indicadores Pedagógicos | *"Referencial comparativo item a item entre a sua Unidade Escolar e a Média da Rede Municipal de Patos"* |
| **05** | `js/features/management.js` | Caracterização da Unidade Escolar (Coordenadora) | *"Caracterização calculada a partir do somatório canônico de turmas da unidade escolar."* |
| **06** | `index.html` (#homeScheduledSection) | Minhas Próximas Observações Agendadas | *"Inicie diretamente as observações planejadas no cronograma longitudinal"* |
| **07** | `index.html` (#screenSetup) | Nova Avaliação Pedagógica | *"Preencha os metadados da observação para iniciar o instrumento"* |
| **08** | `index.html` (#screenSynthesis) | Síntese Final da Observação Pedagógica | *"Organização do tempo, materiais, horários e fechamento da supervisão"* |
| **09** | `index.html` (#screenHistory) | Histórico de Observações | *"Consultas e auditoria de registros com filtros avançados"* |
| **10** | `index.html` (#screenNotes) | Ocorrências de Campo | *"Anotações qualitativas para subsidiar a devolutiva final e intervenções pedagógicas"* |
| **11** | `index.html` (#screenRefDocs) | Matrizes de Referência Oficiais | *"Instrumentos oficiais de acompanhamento, consulta pedagógica e upload de diretrizes da Educação Infantil de Patos"* |
| **12** | `index.html` (#screenRefDocs - Banner) | Diretrizes e Instrumentos Oficiais da Rede Municipal | *"Consulte, visualize diretamente no painel ou faça download dos instrumentos oficiais de referência (PDF) utilizados no acompanhamento e na supervisão pedagógica da Educação Infantil do município de Patos."* |
| **13** | `index.html` (#screenRubricsAdmin) | Matriz de Rubricas & Dimensões Avaliativas | *"Governança pedagógica, descritores oficiais e instrumentos autônomos do município de Patos"* |
| **14** | `index.html` (#pedagViewUnits) | Rede Municipal de Ensino: Polos e Unidades | *"Estrutura territorial, lotação de profissionais e cobertura pedagógica"* |
| **15** | `index.html` (#networkCoverageCard) | Matriz de Distribuição e Cobertura da Rede por Polo Regional | *"Mapeamento consolidado das Coordenadoras Pedagógicas e Unidades Escolares alocadas em cada Polo da Rede Municipal."* |
| **16** | `index.html` (#pedagViewTeam) | Quadro de Servidores e Membros da Rede | *"Gestão de docentes, coordenadoras pedagógicas e formadoras"* |
| **17** | `index.html` (#pedagViewExports - 5 Cards) | Servidores / UEs / Rubricas / Ocorrências / Observações | Descrições específicas dos 5 cartões de exportação de dados SSOT |

---

## 3. Especificação de Implementação Passo a Passo (Snippets Exatos)

### Passo 1: Tokens CSS e Estilos Responsivos

#### 1.1. Adicionar tokens em `css/01_variables.css`:
```css
/* Tokens para Botão e Popover de Informação Hallmark (Pilar Mobile Desclutter) */
--info-btn-bg: #F1F5F9;
--info-btn-text: #475569;
--info-btn-border: #CBD5E1;
--info-btn-hover-bg: #E2E8F0;
--info-btn-hover-text: var(--primary);
--info-btn-focus-ring: var(--primary);
```

#### 1.2. Adicionar estilos em `css/03_components.css`:
```css
/* ==========================================================================
   BOTÃO DE INFORMAÇÃO & DESCLUTTERING MOBILE (PADRÃO HALLMARK)
   ========================================================================== */

/* Subtítulos e parágrafos explicativos que se recolhem no mobile */
.platform-info-text {
  display: block;
}

/* Botão de informação com pictograma vetorial SVG */
.btn-platform-info {
  display: none; /* Oculto em desktop, visível no mobile */
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  min-width: 28px;
  min-height: 28px;
  padding: 0;
  margin-left: 6px;
  border: 1px solid var(--info-btn-border);
  border-radius: 50%;
  background: var(--info-btn-bg);
  color: var(--info-btn-text);
  cursor: pointer;
  vertical-align: middle;
  flex-shrink: 0;
  outline: none;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}

.btn-platform-info:hover {
  background: var(--info-btn-hover-bg);
  color: var(--info-btn-hover-text);
  border-color: var(--info-btn-hover-text);
}

.btn-platform-info:focus-visible {
  outline: 2px solid var(--info-btn-focus-ring);
  outline-offset: 2px;
}

.btn-platform-info .info-pictogram {
  width: 15px;
  height: 15px;
  stroke-width: 2.2;
  pointer-events: none;
}

/* Comportamento responsivo para Viewports Móveis (≤ 768px) */
@media (max-width: 768px) {
  /* Oculta os textos explicativos prolixos no celular */
  .platform-info-text {
    display: none !important;
  }

  /* Exibe o botão de informação no celular com hit-target ergonômico */
  .btn-platform-info {
    display: inline-flex !important;
    position: relative;
    touch-action: manipulation;
  }

  /* Alvo de toque expandido de 44x44px sem alterar layout visual (WCAG AAA) */
  .btn-platform-info::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: 44px;
    min-height: 44px;
  }
}

/* Fallback de acessibilidade para movimento reduzido */
@media (prefers-reduced-motion: reduce) {
  .btn-platform-info {
    transition: none !important;
  }
}
```

---

### Passo 2: Estrutura HTML do Modal Universal `#modalPlatformInfo` em `index.html`

Inserir próximo aos modais móveis (logo antes de `<!-- ========================================================================= MODAL / BOTTOM SHEET: DETALHAMENTO CANÔNICO OFICIAL DO CRITÉRIO (MOBILE) ========================================================================= -->`):

```html
  <!-- =========================================================================
       MODAL / BOTTOM SHEET: INFORMAÇÕES EXPLICATIVAS DA SEÇÃO (HALLMARK MOBILE)
       ========================================================================= -->
  <div id="modalPlatformInfo" class="modal-backdrop mobile-bottom-sheet-backdrop" onclick="closePlatformInfoModal(event)" style="display:none;" role="dialog" aria-modal="true" aria-labelledby="platformInfoTitle">
    <div class="modal-panel mobile-bottom-sheet-panel" onclick="event.stopPropagation()">
      <div class="mobile-bottom-sheet-handle"></div>
      
      <div style="display:flex; justify-content:space-between; align-items:flex-start; width:100%; margin-bottom:12px; gap:10px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <div style="width:32px; height:32px; border-radius:50%; background:#EFF6FF; border:1px solid #BFDBFE; display:flex; align-items:center; justify-content:center; color:var(--primary); flex-shrink:0;">
            <svg class="info-pictogram" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
          <h3 id="platformInfoTitle" style="margin:0; font-size:16px; font-weight:800; color:var(--primary-dark); line-height:1.3;">
            Informações
          </h3>
        </div>
        <button type="button" class="btn-close-modal" onclick="closePlatformInfoModal()" aria-label="Fechar informações" style="background:none; border:none; font-size:22px; font-weight:700; cursor:pointer; color:var(--text-secondary); line-height:1; padding:4px;">&times;</button>
      </div>

      <div class="mobile-bottom-sheet-body" style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:10px; padding:16px; margin-bottom:16px; max-height:55vh; overflow-y:auto;">
        <p id="platformInfoText" style="font-size:13px; color:var(--text-primary); line-height:1.6; margin:0; font-weight:500;">
        </p>
      </div>

      <!-- Rodapé com botão de dispensa instantânea -->
      <div style="display:flex; justify-content:flex-end;">
        <button type="button" class="btn btn-primary" onclick="closePlatformInfoModal()" style="width:100%; height:44px; font-weight:800; font-size:13px; display:flex; align-items:center; justify-content:center; gap:6px;">
          <span>✓ Entendido</span>
        </button>
      </div>
    </div>
  </div>
```

---

### Passo 3: Funções JavaScript do Modal em `js/core/navigation.js`

Adicionar ao arquivo `js/core/navigation.js`:

```javascript
/**
 * Abre o Bottom Sheet / Modal Universal de Informações da Seção (Hallmark Mobile)
 * @param {string} title Título da seção ou recurso
 * @param {string} text Texto explicativo associado
 */
function openPlatformInfoModal(title, text) {
  const modal = document.getElementById('modalPlatformInfo');
  const titleEl = document.getElementById('platformInfoTitle');
  const textEl = document.getElementById('platformInfoText');
  if (titleEl) titleEl.innerText = title;
  if (textEl) textEl.innerText = text;
  if (modal) {
    modal.classList.add('active');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

/**
 * Fecha o Modal Universal de Informações da Seção
 * @param {Event} [e] Evento opcional de clique
 */
function closePlatformInfoModal(e) {
  if (e && e.target && e.target !== e.currentTarget && !e.target.classList.contains('btn-close-modal')) {
    return;
  }
  const modal = document.getElementById('modalPlatformInfo');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

// Fechamento via tecla ESC para acessibilidade
document.addEventListener('keydown', function(evt) {
  if (evt.key === 'Escape' || evt.key === 'Esc') {
    const modal = document.getElementById('modalPlatformInfo');
    if (modal && modal.classList.contains('active')) {
      closePlatformInfoModal();
    }
  }
});
```

---

### Passo 4: Atualização dos Cabeçalhos em `index.html`

Aplicar a classe `.platform-info-text` nas legendas e incluir o `.btn-platform-info` ao lado do título correspondente.

#### 4.1. Próximas Observações na Home (`#homeScheduledSection`):
```html
<div class="page-title-row" style="margin-bottom:12px;">
  <div>
    <h3 style="font-size:16px; font-weight:700; color:var(--primary-dark); display:flex; align-items:center;" id="homeScheduledHeader">
      <span>🗓️ Minhas Próximas Observações Agendadas</span>
      <button type="button" class="btn-platform-info" onclick="openPlatformInfoModal('Próximas Observações Agendadas', 'Inicie diretamente as observações planejadas no cronograma longitudinal')" aria-label="Informações sobre próximas observações">
        <svg class="info-pictogram" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
      </button>
    </h3>
    <p class="platform-info-text" style="font-size:12px; color:var(--text-secondary); margin-top:2px;">Inicie diretamente as observações planejadas no cronograma longitudinal</p>
  </div>
</div>
```

#### 4.2. Setup da Observação (`#screenSetup`):
```html
<div class="page-title-row">
  <div>
    <div class="page-title" id="setupScreenTitle" style="display:flex; align-items:center;">
      <span>Nova Avaliação Pedagógica</span>
      <button type="button" class="btn-platform-info" onclick="openPlatformInfoModal('Nova Avaliação Pedagógica', 'Preencha os metadados da observação para iniciar o instrumento')" aria-label="Informações sobre nova avaliação">
        <svg class="info-pictogram" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
      </button>
    </div>
    <div class="page-subtitle platform-info-text" id="setupScreenSubtitle">Preencha os metadados da observação para iniciar o instrumento</div>
  </div>
  <button class="btn btn-secondary" onclick="navigateToTab('home')">Voltar</button>
</div>
```

#### 4.3. Síntese Final (`#screenSynthesis`):
```html
<div class="page-title-row no-print">
  <div>
    <div class="page-title" style="display:flex; align-items:center;">
      <span>Síntese Final da Observação Pedagógica</span>
      <button type="button" class="btn-platform-info" onclick="openPlatformInfoModal('Síntese Final', 'Organização do tempo, materiais, horários e fechamento da supervisão')" aria-label="Informações sobre síntese final">
        <svg class="info-pictogram" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
      </button>
    </div>
    <div class="page-subtitle platform-info-text">Organização do tempo, materiais, horários e fechamento da supervisão</div>
  </div>
```

#### 4.4. Histórico (`#screenHistory`) e Ocorrências (`#screenNotes`):
Aplicar o mesmo padrão nos cabeçalhos de `#screenHistory` (`#historyScreenSubtitle`) e `#screenNotes`.

#### 4.5. Matrizes de Referência (`#screenRefDocs`):
Aplicar no cabeçalho e adicionar a classe `.platform-info-text` ao banner explicativo institucional (`#screenRefDocs .card`).

#### 4.6. Admin de Rubricas (`#screenRubricsAdmin`):
Aplicar no cabeçalho substituindo o subtítulo pelo botão no mobile.

#### 4.7. Polos e Servidores na Gestão (`#pedagViewUnits`, `#networkCoverageCard`, `#pedagViewTeam`):
Aplicar nos cabeçalhos dessas seções e na Matriz de Polos.

#### 4.8. Cards de Exportação SSOT (`#pedagViewExports`):
Em cada um dos 5 cartões (`.export-card`), adicionar o `.btn-platform-info` ao lado do título `.export-card-title` e envolver o texto `.export-card-desc` com a classe `.platform-info-text`.

---

### Passo 5: Atualização das Renderizações Dinâmicas no JavaScript

#### 5.1. Tabela Executiva de UEs em `js/features/indicators.js` (Linhas ~2704-2710) - O Caso de Exemplo Citado:
**Substituir:**
```javascript
                <div style="display:flex; align-items:center; gap:8px;">
                  <svg ...></svg>
                  <h4 style="font-size:15px; font-weight:800; color:var(--primary-dark); margin:0;">
                    Cobertura e Consistência por Unidade Escolar · ${currentBim}
                  </h4>
                </div>
                <p style="font-size:12px; color:var(--text-secondary); margin:2px 0 0 0;">
                  Acompanhamento consolidado para priorização de suporte e visitas de campo
                </p>
```
**Por:**
```javascript
                <div style="display:flex; align-items:center; gap:8px;">
                  <svg ...></svg>
                  <h4 style="font-size:15px; font-weight:800; color:var(--primary-dark); margin:0; display:flex; align-items:center;">
                    <span>Cobertura e Consistência por Unidade Escolar · ${currentBim}</span>
                    <button type="button" class="btn-platform-info" onclick="openPlatformInfoModal('Cobertura e Consistência por Unidade Escolar', 'Acompanhamento consolidado para priorização de suporte e visitas de campo')" aria-label="Informações sobre cobertura e consistência">
                      <svg class="info-pictogram" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    </button>
                  </h4>
                </div>
                <p class="platform-info-text" style="font-size:12px; color:var(--text-secondary); margin:2px 0 0 0;">
                  Acompanhamento consolidado para priorização de suporte e visitas de campo
                </p>
```

#### 5.2. Distribuição do Uso de Materiais em `js/features/indicators.js` (Linhas ~2834-2840):
Adicionar o botão de informação ao lado de `Distribuição do Uso de Materiais` e a classe `.platform-info-text` no `<p>`.

#### 5.3. Raio-X Longitudinal e Visualização por Dimensão em `js/features/indicators.js`:
Adicionar o botão de informação aos títulos de `Raio-X Longitudinal Item a Item` e `Visualização por Dimensão dos Indicadores Pedagógicos`, aplicando `.platform-info-text` nos respectivos parágrafos explicativos.

#### 5.4. Caracterização da UE em `js/features/management.js`:
Adicionar o botão de informação ao título e `.platform-info-text` no parágrafo descritivo.

---

### Passo 6: Espelhamento Fiel em `firebase_deploy/public/`
Replicar rigorosamente as mesmas alterações em:
- `firebase_deploy/public/index.html`
- `firebase_deploy/public/css/`
- `firebase_deploy/public/js/` (e caminhos legados `firebase_deploy/public/features/` se presentes).

---

## 4. Critérios de Aceite e Roteiro de Teste

### 4.1. Critérios de Aceite
1. **No Mobile (viewport ≤ 768px):**
   - Os textos e parágrafos explicativos mapeados estão 100% ocultos visualmente da tela;
   - O botão `.btn-platform-info` é visível inline ao lado dos títulos com seu pictograma SVG nítido;
   - O botão possui hit-box mínimo de 44x44px (`::after`), permitindo acionamento confortável com o polegar;
   - Ao tocar no botão de informação, o modal/bottom-sheet `#modalPlatformInfo` desliza suavemente com o título e texto corretos;
   - O botão "✓ Entendido" ou clique no backdrop fecha o modal imediatamente e restaura o scroll da página.
2. **No Desktop (viewport > 768px):**
   - Os textos explicativos continuam perfeitamente visíveis em seus devidos lugares (`display: block`);
   - Os botões `.btn-platform-info` ficam ocultos (`display: none`), preservando o layout limpo e sem redundância.
3. **Padrão Hallmark & Acessibilidade:**
   - 0% de emojis como ícones no botão (apenas vetor SVG puro com traço semântico);
   - Todos os botões contam com `aria-label` descritivo e `:focus-visible` visível;
   - Suporte a tecla `ESC` para fechar o modal informativo;
   - Ausência de `transition: all` e presença de fallbacks para `prefers-reduced-motion: reduce`.
4. **Blindagem Sintática:**
   - Validação léxica via `python3 audit_platform.py --check-syntax` acusando 100% de sucesso léxico/sintático.

---

## 5. Seção Obrigatória de Auditoria: Alterações / Adições / Exclusões no Algoritmo (`audit_platform.py` / `audit_engine.js`)

Para assegurar a não-regressão e a conformidade perpétua do novo subsistema de informação, as seguintes asserções automatizadas devem ser implementadas no **Módulo 12 (`navegacao_layout`)** de `js/audit/audit_engine.js`:

### 5.1. Teste de Conformidade: Subsistema de Informação Mobile & Descluttering
```javascript
// --- VALIDAÇÃO DO SUBSISTEMA DE INFORMAÇÃO MOBILE (HALLMARK DESCLUTTER) ---
const modalInfo = document.getElementById('modalPlatformInfo');
if (!modalInfo) {
  throw new Error('Falha Estrutural: #modalPlatformInfo não foi encontrado no DOM');
}
const infoTitleEl = document.getElementById('platformInfoTitle');
const infoTextEl = document.getElementById('platformInfoText');
if (!infoTitleEl || !infoTextEl) {
  throw new Error('Falha Estrutural: nós internos #platformInfoTitle ou #platformInfoText ausentes');
}

// Teste de acionamento via função global
openPlatformInfoModal('Teste Unitário Hallmark', 'Texto explicativo para validação');
if (!modalInfo.classList.contains('active') || modalInfo.style.display !== 'flex') {
  throw new Error('Falha Funcional: openPlatformInfoModal() não exibiu #modalPlatformInfo');
}
if (infoTitleEl.innerText !== 'Teste Unitário Hallmark' || infoTextEl.innerText !== 'Texto explicativo para validação') {
  throw new Error('Falha de Conteúdo: os dados informativos não foram populados corretamente no modal');
}

// Teste de fechamento
closePlatformInfoModal();
if (modalInfo.classList.contains('active') || modalInfo.style.display === 'flex') {
  throw new Error('Falha Funcional: closePlatformInfoModal() não ocultou #modalPlatformInfo');
}

// Validação da presença de botões .btn-platform-info e classes .platform-info-text
const infoButtons = document.querySelectorAll('.btn-platform-info');
if (infoButtons.length < 5) {
  throw new Error(`Conformidade Hallmark Violada: esperava-se ampla cobertura de botões de informação, encontrados apenas ${infoButtons.length}`);
}
const infoTexts = document.querySelectorAll('.platform-info-text');
if (infoTexts.length < 5) {
  throw new Error(`Conformidade Hallmark Violada: esperava-se ampla cobertura de classes .platform-info-text, encontradas apenas ${infoTexts.length}`);
}

logger.log('Subsistema de Informação Mobile Hallmark (modal, botões e classes de desclutter)', true);
```

### 5.2. Preservação de Testes Pré-existentes
Nenhum teste pré-existente nos 12 módulos será quebrado ou excluído, pois a estrutura dos títulos originais, IDs e botões de ação foi rigorosamente preservada.
