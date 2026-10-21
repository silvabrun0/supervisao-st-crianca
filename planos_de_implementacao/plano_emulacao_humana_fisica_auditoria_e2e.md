# PLANO DE IMPLEMENTAÇÃO EXECUTIVO (ETAPA 1)
## Emulação Comportamental e Física Integral de Acesso Humano no Algoritmo de Auditoria (100% End-to-End)

---

### 1. Visão Geral e Objetivos Estratégicos
O objetivo deste plano é elevar a suíte determinística de testes da plataforma **SerTão Criança** (`audit_platform.py` e engine interna do `index.html`) do patamar atual (híbrido de DOM com injeção de estado) para um **Motor de Emulação Comportamental e Física Integral de Acesso Humano**.

A emulação física garante que a auditoria não apenas verifique se o código JavaScript funciona logicamente em memória, mas simule com estrita fidelidade a interação de um usuário real:
1. **Física do Clique e Coordenadas (*Hit-Testing*):** Garantir que nenhum clique ocorra se o elemento estiver oculto, fora da tela ou coberto por outro elemento (como backdrops de modais ou menus overlay).
2. **Ciclo Completo de Teclado e Foco:** Acionar sequencialmente `focus` ➔ `keydown` ➔ `keypress` ➔ `input` ➔ `keyup` ➔ `change` ➔ `blur`.
3. **Erradicação de Atalhos Lógicos na Observação:** Preencher as 46 rubricas da matriz curricular clicando elemento a elemento na interface, testando a reatividade da barra de progresso e o fechamento dinâmico de pendências.
4. **Isolamento de Sessão (*Sandboxing*):** Garantir que cada módulo rode em ambiente isolado e imune a resíduos de sessões anteriores.
5. **Emulação Mobile-First:** Permitir a validação da interface em viewport estreito de smartphone (`390x844`) com eventos touch ativados.

---

### 2. Diagnóstico das Lacunas Atuais vs. Arquitetura Proposta

| Dimensão de Teste | Comportamento Atual (Híbrido) | Nova Arquitetura (Emulação Física Humana) |
| :--- | :--- | :--- |
| **Disparo de Clique** | `el.dispatchEvent(new MouseEvent('click'))` aciona o handler mesmo que o botão esteja coberto ou invisível. | Calcula coordenadas centrais `(cx, cy)`, executa `document.elementFromPoint(cx, cy)` e valida se o elemento está fisicamente visível e desobstruído. |
| **Digitação de Textos** | Atribui `.value` com `input` e `change`. Não aciona eventos de teclado nem perda de foco. | Executa cadeia completa: `focus()` ➔ `keydown` ➔ `keypress` ➔ mutação do valor ➔ `input` ➔ `keyup` ➔ `change` ➔ `blur()`. |
| **Seleção de Dropdowns** | Atribui `.value` no `<select>` diretamente. | Foca o elemento, valida se a `<option>` existe fisicamente no DOM, altera a seleção, dispara `change` e valida retenção. |
| **Preenchimento de Rubricas** | Atribui `responses[critId] = 'consistent'` no objeto JavaScript da observação. | Clica fisicamente em cada um dos 46 botões de rubrica renderizados no DOM, monitorando o avanço visual do progresso. |
| **Síntese e Pareceres** | Preenchimento direto do payload JSON. | Clica no botão de avanço, digita nos textareas dos pareceres docentes e clica no botão formal de finalização. |
| **Isolamento de Testes** | Estado global compartilhado em memória entre os 12 módulos sequenciais. | Execução de rotina de *Sandbox Reset* antes de cada bateria, zerando `localStorage`, restaurando dados canônicos e limpando credenciais. |
| **Ambiente Mobile** | Execução apenas em resolução padrão desktop (1280x800). | Suporte no CLI (`--device mobile`) com resolução de smartphone (390x844) e toque emulado. |

---

### 3. Detalhamento Arquitetural das Modificações

#### 3.1. Reestruturação do Helper Canônico `UI` em `index.html`

O objeto utilitário `UI` em `index.html` será expandido com recursos avançados de inspeção espacial e simulação de eventos:

```javascript
const UI = {
  // 1. Verificação de Visibilidade e Hit-Testing Espacial
  isElementInteractable: function(el) {
    if (!el) return { ok: false, reason: 'Elemento nulo ou inexistente' };
    
    // Dimensões físicas mínimas
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) {
      return { ok: false, reason: 'Elemento sem dimensões visíveis (width/height zero)' };
    }

    // Estilos computados
    const style = window.getComputedStyle(el);
    if (style.display === 'none') return { ok: false, reason: 'Elemento com display: none' };
    if (style.visibility === 'hidden') return { ok: false, reason: 'Elemento com visibility: hidden' };
    if (parseFloat(style.opacity) < 0.05) return { ok: false, reason: 'Elemento invisível (opacity < 0.05)' };
    if (style.pointerEvents === 'none') return { ok: false, reason: 'Elemento com pointer-events: none' };

    // Obstrução física de renderização (Hit-Testing)
    const cx = Math.floor(rect.left + rect.width / 2);
    const cy = Math.floor(rect.top + rect.height / 2);
    
    // Se o ponto estiver fora da janela, rola até o centro
    if (cx < 0 || cy < 0 || cx > window.innerWidth || cy > window.innerHeight) {
      el.scrollIntoView({ behavior: 'instant', block: 'center', inline: 'center' });
    }

    const updatedRect = el.getBoundingClientRect();
    const testX = Math.floor(updatedRect.left + updatedRect.width / 2);
    const testY = Math.floor(updatedRect.top + updatedRect.height / 2);

    const topElement = document.elementFromPoint(testX, testY);
    if (!topElement) return { ok: false, reason: 'Nenhum elemento detectado nas coordenadas do cursor' };

    const isMatch = topElement === el || el.contains(topElement) || topElement.contains(el);
    if (!isMatch) {
      const topDesc = `<${topElement.tagName.toLowerCase()} class="${topElement.className}" id="${topElement.id}">`;
      return { ok: false, reason: `Elemento bloqueado por sobreposição visual de ${topDesc}` };
    }

    return { ok: true, x: testX, y: testY };
  },

  // 2. Clique Físico com Validação Espacial
  click: function(el) {
    if (!el) throw new Error('Elemento não encontrado para simulação de clique');
    
    // Garante que o elemento está na viewport
    el.scrollIntoView({ behavior: 'instant', block: 'center', inline: 'center' });
    
    const check = this.isElementInteractable(el);
    if (!check.ok) {
      throw new Error(`Falha física ao clicar em [${el.id || el.className || el.tagName}]: ${check.reason}`);
    }

    // Sequência canônica de eventos do ponteiro
    const mouseOpts = { bubbles: true, cancelable: true, clientX: check.x, clientY: check.y, view: window };
    el.dispatchEvent(new PointerEvent('pointerdown', mouseOpts));
    el.dispatchEvent(new MouseEvent('mousedown', mouseOpts));
    if (typeof el.focus === 'function') el.focus();
    el.dispatchEvent(new PointerEvent('pointerup', mouseOpts));
    el.dispatchEvent(new MouseEvent('mouseup', mouseOpts));
    el.dispatchEvent(new MouseEvent('click', mouseOpts));
  },

  // 3. Digitação Real com Cadeia de Eventos de Teclado
  type: function(inputEl, text) {
    if (!inputEl) throw new Error('Input não encontrado para digitação');
    
    inputEl.scrollIntoView({ behavior: 'instant', block: 'center' });
    const check = this.isElementInteractable(inputEl);
    if (!check.ok) {
      throw new Error(`Falha física ao digitar em [${inputEl.id || inputEl.name}]: ${check.reason}`);
    }

    if (typeof inputEl.focus === 'function') inputEl.focus();
    
    // Limpa valor anterior simulando seleção total e substituição
    inputEl.value = '';
    
    // Dispara eventos característicos de início
    inputEl.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Process' }));
    inputEl.value = text;
    inputEl.dispatchEvent(new Event('input', { bubbles: true }));
    inputEl.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'Process' }));
    inputEl.dispatchEvent(new Event('change', { bubbles: true }));
    
    if (typeof inputEl.blur === 'function') inputEl.blur();
  },

  // 4. Seleção Interativa com Verificação de Opções
  select: function(selectEl, value) {
    if (!selectEl) throw new Error('Select não encontrado para seleção');
    
    selectEl.scrollIntoView({ behavior: 'instant', block: 'center' });
    const check = this.isElementInteractable(selectEl);
    if (!check.ok) {
      throw new Error(`Falha física ao selecionar em [${selectEl.id || selectEl.name}]: ${check.reason}`);
    }

    // Valida se a opção existe fisicamente no seletor
    const hasOption = Array.from(selectEl.options).some(opt => opt.value === value);
    if (!hasOption) {
      throw new Error(`Opção "${value}" não existe no seletor #${selectEl.id}`);
    }

    if (typeof selectEl.focus === 'function') selectEl.focus();
    selectEl.value = value;
    selectEl.dispatchEvent(new Event('input', { bubbles: true }));
    selectEl.dispatchEvent(new Event('change', { bubbles: true }));
    
    if (selectEl.value !== value) {
      throw new Error(`Falha de retenção reativa no select #${selectEl.id}: esperado "${value}", obtido "${selectEl.value}"`);
    }

    if (typeof selectEl.blur === 'function') selectEl.blur();
  },

  // 5. Sandboxing e Reset de Sessão entre Módulos
  resetSandbox: function(defaultUserKey = null) {
    // Fecha quaisquer modais ou gavetas ativas
    document.querySelectorAll('.modal-backdrop.active, .modal-backdrop[style*="display: block"]').forEach(m => {
      m.classList.remove('active');
      m.style.display = 'none';
    });
    
    // Restaura estado limpo da aplicação
    appState.currentUserKey = defaultUserKey;
    appState.currentObs = null;
    appState.observations = [];
    if (defaultUserKey) {
      applyUserRoleUI();
    }
  }
};
```

---

#### 3.2. Refatoração dos Módulos para Interação 100% End-to-End

##### Módulo 4: `rubricas_observacao` (Preenchimento das 46 Rubricas via Cliques Reais)
1. **Abertura da Observação no DOM:** O módulo inicia uma observação real e abre a tela de formulário (`#screenObservation`).
2. **Varredura e Clique Físico em cada Rubrica:**
   * O teste obtém todas as seções ativas da matriz (`getActiveSections()`).
   * Para cada critério, localiza o botão visual de rádio correspondente no DOM (ex.: `document.querySelector(`input[name="radio_${crit.id}"][value="consistent"]`)` ou o botão de pílula correspondente).
   * Executa `UI.click(opcao)`;
   * Verifica se o card do critério foi marcado como preenchido no DOM.
3. **Validação do Caso Especial (Item Parcial `1.1.2`):**
   * Clica no botão de opção "Parcial" (`value="partial"`).
   * Verifica no DOM se a gaveta dinâmica de atribuição docente se expandiu.
   * Executa `UI.click` no checkbox do docente regente.
   * Executa `UI.type` no textarea de justificativa pedagógica.
4. **Verificação dos Indicadores Visuais da Interface:**
   * Confirma que a barra de progresso no topo da tela (`#obsProgressBar`) exibe `100%`.
   * Confirma que o contador de pendências em tempo real (`#obsPendingCount`) foi zerado.

##### Módulo 5: `sintese_finalizacao` (Finalização através do Formulário Real)
1. **Navegação Física para a Síntese:**
   * Executa `UI.click` no botão primário "Avançar para Síntese" (`#btnGoToSynthesis` ou equivalente).
2. **Preenchimento dos Campos de Texto e Horários:**
   * Executa `UI.type(document.getElementById('synthesisStartTime'), '08:00')`.
   * Executa `UI.type(document.getElementById('synthesisEndTime'), '09:40')`.
   * Seleciona o nível predominante na Escala de Materiais via `UI.click` no card de nível correspondente.
3. **Avaliação das 5 Dimensões e Pareceres por Docente:**
   * Para cada professor regente da turma, seleciona as notas das 5 dimensões e digita o parecer no textarea via `UI.type`.
4. **Acionamento do Botão de Finalização:**
   * Executa `UI.click(document.getElementById('btnFinalizeObservation'))`.
   * Valida a transição de tela para o Histórico ou tela inicial com o toast de confirmação.

---

#### 3.3. Adaptação do Script CLI `audit_platform.py`

O runner em Python receberá novos argumentos de linha de comando para emular dispositivos reais:

```python
parser.add_argument(
    '--device',
    choices=['desktop', 'mobile'],
    default='desktop',
    help="Modo de emulação de dispositivo no Google Chrome (padrão: desktop)"
)
```

Quando `--device mobile` for selecionado:
* Resolução da janela ajustada para **390x844** (tamanho exato de um smartphone padrão).
* Flags do Chrome adicionadas:
  ```python
  "--window-size=390,844",
  "--touch-events=enabled",
  "--enable-viewport",
  "--force-device-scale-factor=2"
  ```
* A auditoria valida se a gaveta *Bottom Sheet* do Pilar 9 (`#modalIndicatorsFiltersMobile`) e o botão flutuante de filtro no polegar (`#btnMobileIndicatorsFilters`) operam de forma impecável sem overflow ou cortes visuais.

---

### 4. Gestão de Riscos e Impacto no Desempenho

| Risco Identificado | Probabilidade | Impacto | Estratégia de Mitigação |
| :--- | :---: | :---: | :--- |
| **Aumento no tempo de execução dos testes** | Alta | Baixo | Como o Chrome precisa calcular layout e desenhar frames para 46 cliques e digitações, o tempo total da auditoria passará de ~1.5s para cerca de **3.5s a 5.0s**. Esse tempo permanece muito rápido para o CI/CLI e é plenamente aceitável para garantir 100% de precisão humana. |
| **Erros de animação CSS (Race Conditions)** | Média | Médio | Utilização de `instant` scroll e execução de microtarefas antes de checagens visuais para garantir que transições de layout sejam computadas imediatamente no motor V8. |
| **Falsos bloqueios em elementos com filhos** | Baixa | Médio | O algoritmo de *hit-testing* valida se o elemento retornado é filho ou pai do elemento clicado (`el.contains(topElement) || topElement.contains(el)`), permitindo que botões com ícones SVG ou textos internos recebam o clique normalmente. |

---

### 5. Seção Obrigatória de Auditoria: Alterações nos Módulos de Teste
Em conformidade estrita com o protocolo normativo de `AGENTS.md` e `WORKFLOW_MACOS.md`, discriminam-se as alterações na suíte de testes:

#### Módulo 1: `auth_rbac` (Autenticação e RBAC)
* **Alterações:**
  - Aplicação de `UI.isElementInteractable()` para validar que os campos de login e o botão "Entrar" não estão ocultos antes da digitação.
  - Teste de perda de foco (`blur`) e limpeza de erro.
* **Adições:**
  - Validação de foco inicial do cursor no campo de e-mail ao abrir o modal de login.

#### Módulo 2: `catalogo_dados` (Gestão de Dados e Equipe)
* **Alterações:**
  - Validação de que os modais `#modalAddMember` e `#modalEditMember` rolam adequadamente o seletor de escolas para a tela antes da seleção.
* **Adições:**
  - Validação física de que cliques fora do modal (backdrop) ou no botão `✕` fecham a janela com sucesso.

#### Módulo 3: `setup_longitudinal` (Setup de Observação)
* **Alterações:**
  - Seleção física de escola e turma via `UI.select()`, validando a reatividade instantânea dos cards de regentes titulares.
  - Clique físico no botão `#btnStartObservation` com verificação de desobstrução visual.

#### Módulo 4: `rubricas_observacao` (Observação Ativa e Rubricas)
* **Alterações:**
  - Substituição da injeção lógica em array por **46 cliques físicos reais** em cada uma das opções de rubrica na interface.
  - Validação do scroll automático de cada critério conforme o avaliador avança na página.
* **Adições:**
  - Teste de expansão física do painel de atribuição de regentes no item `1.1.2` com seleção interativa de checkbox e digitação de justificativa.
  - Verificação de sincronização visual da barra de progresso no DOM (`#obsProgressBar`).

#### Módulo 5: `sintese_finalizacao` (Síntese Pedagógica e Finalização)
* **Alterações:**
  - Navegação para a síntese através do botão de rodapé com validação de clique físico.
  - Digitação física de horários e pareceres por professor via `UI.type()`.
  - Clique no botão `#btnFinalizeObservation` e conferência visual de arquivamento no histórico.
* **Exclusões:**
  - Eliminação de qualquer preenchimento direto de propriedades em `appState.currentObs` sem passar pelos inputs da interface.

#### Módulo 8: `agenda_cronograma` (Cronograma de Observações)
* **Alterações:**
  - Abertura de modal `#modalAddSchedule` e seleção física com validação de dropdown e calendário.
  - Clique no botão de visualização da devolutiva direto na tabela com verificação de rota de retorno.

#### Módulo 10: `indicadores_decisao` (Painel de Indicadores, Gargalos e Mobile)
* **Alterações:**
  - Teste interativo do botão de cópia de pauta (`📋 Copiar Pauta`) com validação de interação com a API de Clipboard.
  - Em modo mobile, validação física de toque no botão flutuante `#btnMobileIndicatorsFilters` e na abertura da *Bottom Sheet* `#modalIndicatorsFiltersMobile`.

#### Módulo 12: `navegacao_layout` (Navegação, Drawer e Acessibilidade)
* **Alterações:**
  - Teste físico de abertura e fechamento da gaveta do menu móvel (`closeMobileMenu`), com validação de que o backdrop bloqueia interações na tela de fundo enquanto ativo.
