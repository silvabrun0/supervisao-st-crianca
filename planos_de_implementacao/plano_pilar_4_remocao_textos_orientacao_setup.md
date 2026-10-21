# PLANO DE IMPLEMENTAÇÃO: PILAR 4 - REMOÇÃO DE TEXTOS E CAIXAS DE ORIENTAÇÃO NA ABA DE INICIAR OBSERVAÇÃO

> **DIRETRIZ OBRIGATÓRIA DE EXECUÇÃO (ETAPA 2):**
> O assistente executor (Etapa 2) deve **obrigatoriamente ler e seguir as diretrizes dos arquivos `WORKFLOW_MACOS.md` e `AGENTS.md`** localizados na raiz do projeto antes de aplicar qualquer modificação no código. Nenhuma modificação deve ser realizada sem conformidade estrita com o workflow, incluindo:
> 1. Execução prévia de sincronização com o repositório remoto (`git pull origin main`).
> 2. Preservação integral de todas as regras de negócio pedagógicas, blindagens RBAC, catálogo de turmas e dados históricos.
> 3. Verificação de integridade pós-edição com dupla checagem de leitura em cada trecho modificado.
> 4. Salvamento obrigatório do backup intermediário na pasta `intermediárias/` sob o nome `aplicativo_v96_remocao_avisos_orientacao_setup_pilar4.html`.
> 5. Gestão dupla de Changelog no arquivo `CHANGELOG.md` e no modal `#modalChangelog` do `index.html`, registrando a **Versão 0.96**.
> 6. Sincronização idêntica entre o arquivo principal `index.html` da raiz, `gestor supervisao_patos/index.html` e `gestor supervisao_patos/firebase_deploy/public/index.html`.
> 7. Checagem pré-push (`git fetch origin main`), commit semântico (`fix: remover caixas de texto e orientacoes redundantes no setup da observacao pilar 4`), push para `origin main` e deploy automático no GitHub Pages.
> 8. Execução pós-deploy obrigatória do algoritmo de auditoria (`python3 audit_platform.py --silent-on-success`) com comunicação restrita exclusivamente a eventuais problemas/falhas.

---

## 1. Diagnóstico e Contexto

### 1.1 Cenário Atual
Após a consolidação das melhorias do Pilar 4 (Formulário Único de Turmas em Tempo Integral em 2 Etapas: Manhã e Tarde) e das diretrizes do Pilar 1 (Inversão da Unidade de Análise para a Turma), a tela de configuração de nova observação pedagógica (`#screenSetup`, aba "Iniciar Observação") passou a conter textos explicativos/didáticos que se tornaram redundantes e sobrecarregam a experiência visual da Coordenadora Pedagógica e da equipe de gestão:

1. **Caixa de Unidade de Análise (`#setupRoleHint`):**
   - Ao selecionar ou abrir o setup com o perfil de Coordenador, uma caixa azul de aviso é renderizada no topo do formulário com o seguinte conteúdo:
     > *"Unidade de Análise: TURMA · Você está avaliando a rotina pedagógica na unidade CEI Professora Maria de Lourdes. O instrumento analisa as experiências das crianças e a atuação articulada das professoras regentes."*
   - Uma vez que a plataforma já possui identidade consolidada, a escola já é indicada no seletor e a turma é o elemento focal evidente, essa caixa cria poluição visual inicial desnecessária.

2. **Mensagem explicativa sobre composição docente de Patos no card de regência (`#groupSetupTeachersCard`):**
   - No card azul que lista os badges com os nomes das professoras regentes da turma selecionada (`#groupSetupTeachersCard`), há um rodapé em itálico com a seguinte mensagem:
     > *"💡 Em Patos, as turmas contam com duplas ou quartetos de professoras regentes titulares. A supervisão pedagógica analisa a rotina, o ambiente educativo e as oportunidades de aprendizagem recebidas pelas crianças na turma."*
   - As coordenadoras pedagógicas e técnicas já conhecem perfeitamente a organização pedagógica do município de Patos, tornando essa orientação estática e redundante.

### 1.2 Resultado Esperado
- **Remoção da Caixa de Unidade de Análise:** A tela de setup deve iniciar diretamente com o seletor de agendamento (quando houver) e os campos essenciais (Unidade Escolar, Turma, etc.), eliminando a exibição do elemento `#setupRoleHint` e seu conteúdo textual explicativo.
- **Remoção do Rodapé de Orientação no Card de Regentes:** O card `#groupSetupTeachersCard` deve exibir unicamente o cabeçalho (`👩‍🏫 Equipe de Regência Titular da Turma` com o badge de turno `setupClassShiftBadge`) e os badges dinâmicos das professoras regentes titulares (`#setupClassTeachersList`), sem o texto de orientação sobre duplas/quartetos de Patos.
- **Interface Limpa, Fluida e Operacional:** Proporcionar uma entrada mais limpa, moderna e direta ao preenchimento da observação, respeitando o princípio de usabilidade de alta densidade sem ruído cognitivo.
- **Manutenção de 100% de Integridade dos Testes:** Garantir que o motor automatizado de testes ponta a ponta (`audit_platform.py` e testes modulares no `index.html`) permaneça 100% aprovado.

---

## 2. Arquitetura e Pontos de Impacto

### 2.1 Arquivos Afetados
- `index.html` (Arquivo mestre de produção servido pelo GitHub Pages)
- `gestor supervisao_patos/index.html` (Cópia espelhada local)
- `gestor supervisao_patos/firebase_deploy/public/index.html` (Cópia espelhada Firebase)
- `CHANGELOG.md` (Registro da Versão 0.96)
- `intermediárias/aplicativo_v96_remocao_avisos_orientacao_setup_pilar4.html` (Backup intermediário obrigatório)
- `audit_platform.py` e engine de testes modular em `index.html`

### 2.2 Componentes e Funções JS Impactadas

1. **HTML - Markup do Setup (`#screenSetup`):**
   - Linha 2918 de `index.html`: Remoção ou ocultação definitiva do contêiner `<div id="setupRoleHint">`.
   - Linhas 2964–2966 de `index.html`: Remoção do elemento `<div style="font-size:11px; color:#475569; margin-top:10px; line-height:1.4;">💡 <em>Em Patos, as turmas contam com duplas ou quartetos...</em></div>` de dentro do `#groupSetupTeachersCard`.

2. **JavaScript - Função `openSetupScreen()`:**
   - Linhas 8037, 8048–8051 e 8064–8067 de `index.html`:
     - Eliminar a injeção do texto `<strong>Unidade de Análise: TURMA</strong>...` em `hintEl.innerHTML`.
     - Garantir que `hintEl` não seja exibido (`style.display = 'none'`) ou que a manipulação de `hintEl` seja limpa com segurança, sem erros em tempo de execução.

3. **Engine de Auditoria Modular (`index.html`):**
   - Módulo 3 (`setup_longitudinal`): Adição de validações para assegurar que `#setupRoleHint` não está visível e que a mensagem de "duplas ou quartetos" não consta no card de docentes.

---

## 3. Especificação de Implementação Passo a Passo (Exata)

### Passo 1: Limpeza do HTML em `#screenSetup` (`index.html`)

#### 1.1 Remoção do elemento `#setupRoleHint`
**Localização:** Linhas ~2917–2919 de `index.html`.

**Código Original:**
```html
        <div class="card">
          <div id="setupRoleHint" style="display:none; background:#EFF6FF; border:1px solid #BFDBFE; padding:12px; border-radius:8px; margin-bottom:16px; font-size:12px; color:#1E3A8A; font-weight:600;"></div>

          <!-- Seletor Rápido de Agendamento do Cronograma -->
```

**Código de Substituição:**
```html
        <div class="card">
          <!-- setupRoleHint removido para maior clareza visual (Pilar 4 / Versão 0.96) -->
          <div id="setupRoleHint" style="display:none !important;"></div>

          <!-- Seletor Rápido de Agendamento do Cronograma -->
```
*(Nota: Manter a tag oculta com `style="display:none !important;"` preserva compatibilidade absoluta com qualquer referência de busca de elemento, eliminando qualquer risco de `null pointer exception` em scripts legados).*

#### 1.2 Remoção da mensagem sobre duplas e quartetos em `#groupSetupTeachersCard`
**Localização:** Linhas ~2951–2967 de `index.html`.

**Código Original:**
```html
          <!-- Card Dinâmico com a Equipe de Docentes Regentes Titulares da Turma (Pilar 1) -->
          <div id="groupSetupTeachersCard" style="display:none; background:#F0F7FF; border:1px solid #BFDBFE; border-left:5px solid #2563EB; border-radius:10px; padding:14px; margin-bottom:18px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <span style="font-size:11px; font-weight:800; text-transform:uppercase; color:#1D4ED8; letter-spacing:0.5px;">
                👩‍🏫 Equipe de Regência Titular da Turma
              </span>
              <span id="setupClassShiftBadge" style="font-size:10px; font-weight:700; background:#DBEAFE; color:#1E40AF; padding:2px 8px; border-radius:12px;">
                Parcial Matutino
              </span>
            </div>
            <div id="setupClassTeachersList" style="display:flex; flex-wrap:wrap; gap:8px; margin-top:8px;">
              <!-- Badges dinâmicos das docentes -->
            </div>
            <div style="font-size:11px; color:#475569; margin-top:10px; line-height:1.4;">
              💡 <em>Em Patos, as turmas contam com duplas ou quartetos de professoras regentes titulares. A supervisão pedagógica analisa a rotina, o ambiente educativo e as oportunidades de aprendizagem recebidas pelas crianças na turma.</em>
            </div>
          </div>
```

**Código de Substituição:**
```html
          <!-- Card Dinâmico com a Equipe de Docentes Regentes Titulares da Turma (Pilar 1) -->
          <div id="groupSetupTeachersCard" style="display:none; background:#F0F7FF; border:1px solid #BFDBFE; border-left:5px solid #2563EB; border-radius:10px; padding:14px; margin-bottom:18px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <span style="font-size:11px; font-weight:800; text-transform:uppercase; color:#1D4ED8; letter-spacing:0.5px;">
                👩‍🏫 Equipe de Regência Titular da Turma
              </span>
              <span id="setupClassShiftBadge" style="font-size:10px; font-weight:700; background:#DBEAFE; color:#1E40AF; padding:2px 8px; border-radius:12px;">
                Parcial Matutino
              </span>
            </div>
            <div id="setupClassTeachersList" style="display:flex; flex-wrap:wrap; gap:8px; margin-top:8px;">
              <!-- Badges dinâmicos das docentes -->
            </div>
          </div>
```

---

### Passo 2: Ajuste no JavaScript de `openSetupScreen()` (`index.html`)

**Localização:** Linhas ~8046–8068 de `index.html`.

**Código Original:**
```javascript
      if (user.roleKey === 'coordenador') {
        titleEl.innerText = 'Nova Observação Pedagógica da Turma';
        if (hintEl) {
          hintEl.style.display = 'block';
          hintEl.innerHTML = `<strong>Unidade de Análise: TURMA</strong> · Você está avaliando a rotina pedagógica na unidade <strong>${user.school}</strong>. O instrumento analisa as experiências das crianças e a atuação articulada das professoras regentes.`;
        }
        classGroup.style.display = 'block';
        teachersCard.style.display = 'block';
        targetGroup.style.display = 'none';

        const opt = document.createElement('option');
        opt.value = user.school;
        opt.text = user.school;
        schoolSelect.appendChild(opt);
        schoolSelect.disabled = true;

      } else if (user.roleKey === 'formador') {
        titleEl.innerText = 'Acompanhamento Formativo da Coordenação';
        if (hintEl) {
          hintEl.innerText = '';
          hintEl.style.display = 'none';
        }
        classGroup.style.display = 'none';
        teachersCard.style.display = 'none';
        targetGroup.style.display = 'block';
```

**Código de Substituição:**
```javascript
      if (user.roleKey === 'coordenador') {
        titleEl.innerText = 'Nova Observação Pedagógica da Turma';
        if (hintEl) {
          hintEl.innerText = '';
          hintEl.style.display = 'none';
        }
        classGroup.style.display = 'block';
        teachersCard.style.display = 'block';
        targetGroup.style.display = 'none';

        const opt = document.createElement('option');
        opt.value = user.school;
        opt.text = user.school;
        schoolSelect.appendChild(opt);
        schoolSelect.disabled = true;

      } else if (user.roleKey === 'formador') {
        titleEl.innerText = 'Acompanhamento Formativo da Coordenação';
        if (hintEl) {
          hintEl.innerText = '';
          hintEl.style.display = 'none';
        }
        classGroup.style.display = 'none';
        teachersCard.style.display = 'none';
        targetGroup.style.display = 'block';
```

---

### Passo 3: Atualização de Versão e Gestão Dupla de Changelog (Versão 0.96)

1. **Atualizar Botão de Versão no Cabeçalho de `index.html`:**
   - Localização: Linha ~2487 de `index.html`.
   - Modificar de:
     ```html
     Versão 0.95 (v7.74)
     ```
     para:
     ```html
     Versão 0.96 (v7.75)
     ```

2. **Inserir Registro de Versão no Modal `#modalChangelog` (`index.html`):**
   Inserir no topo da lista do modal `#modalChangelog`:
   ```html
          <div class="changelog-version-block">
            <div class="changelog-version-header">
              <span class="changelog-badge">Versão 0.96</span>
              <span class="changelog-date">21/10/2026 · 14:00</span>
            </div>
            <div class="changelog-desc">
              <strong>Otimização de UX no Setup da Observação (Pilar 4):</strong>
              Remoção da caixa explicativa estática sobre Unidade de Análise e supressão da mensagem de texto de orientação pedagógica sobre composição de duplas/quartetos em Patos no card de regência da turma, promovendo uma entrada de formulário limpa, fluida e objetiva para as coordenadoras pedagógicas.
            </div>
            <div class="changelog-tags">
              <span class="changelog-tag tag-fix">Otimização de UI/UX</span>
              <span class="changelog-tag tag-feat">Pilar 4</span>
              <span class="changelog-tag tag-refactor">Limpeza de Telas</span>
            </div>
          </div>
   ```

3. **Registrar no `CHANGELOG.md`:**
   - Adicionar nova linha no *Sumário Executivo de Versões*:
     ```markdown
     | **0.96** | 21/10/2026 14:00 | `intermediárias/aplicativo_v96_remocao_avisos_orientacao_setup_pilar4.html` | Solicitação direta / Ajuste Fino Pilar 4 | Otimização visual da tela de setup: remoção da caixa informativa de unidade de análise e supressão de aviso textual no card de docentes regentes 🧹 |
     ```
   - Adicionar a seção completa correspondente da versão `0.96` com a estrutura padrão (Insumos, Modificações, Exclusões e Testes).

---

### Passo 4: Sincronização de Cópias Espelhadas e Backup Intermediário

1. Criar o arquivo de backup:
   `intermediárias/aplicativo_v96_remocao_avisos_orientacao_setup_pilar4.html` (cópia fiel do `index.html` resultante).
2. Sincronizar as cópias idênticas:
   - `gestor supervisao_patos/index.html`
   - `gestor supervisao_patos/firebase_deploy/public/index.html`

---

## 4. Critérios de Aceite e Roteiro de Teste / Validação

- [ ] **Abertura do Setup com Coordenadora (ex: Mariana):** Ao navegar para a tela "Iniciar Observação", a caixa azul contendo *"Unidade de Análise: TURMA · Você está avaliando a rotina pedagógica..."* NÃO deve ser exibida no DOM.
- [ ] **Card de Regência Titular (`#groupSetupTeachersCard`):** Ao selecionar uma escola e turma, o card deve exibir o título `👩‍🏫 Equipe de Regência Titular da Turma`, o badge de turno e a listagem de docentes, sem o rodapé de texto *"💡 Em Patos, as turmas contam com duplas ou quartetos..."*.
- [ ] **Fluxo de Inicialização Preservado:** A funcionalidade de seleção de turma, próximo bimestre e botão de iniciar observação (`#btnStartObservation`) devem continuar funcionando perfeitamente sem erros de console.
- [ ] **Perfil Formadora / Coordenadora do Núcleo de EI:** As regras de isolamento e exibição de campos para formadoras e coordenação do núcleo devem permanecer 100% intactas.
- [ ] **Changelog Duplo:** Versão `0.96` exibida no botão do topo, no modal `#modalChangelog` e descrita detalhadamente em `CHANGELOG.md`.
- [ ] **Auditoria Automatizada:** `python3 audit_platform.py` deve rodar com 100% de sucesso (todas as asserções aprovadas).

---

## 5. Seção Obrigatória: Alterações / Adições / Exclusões no Algoritmo de Auditoria (100% de Cobertura)

Conforme a diretriz mandatória do **`WORKFLOW_MACOS.md`**, esta seção detalha as modificações necessárias no motor de auditoria automatizada (`index.html` e `audit_platform.py`), estruturado de forma modular ("modo-a-modo"):

### 5.1 Módulo Afetado: Módulo 3 (`setup_longitudinal`)
- **Adições de Asserções de Limpeza de Interface:**
  No Módulo 3 (`id: 'setup_longitudinal'`), dentro da função `run(logger)`:
  1. **Verificação de Ausência da Caixa de Aviso (`#setupRoleHint`):**
     Validar que o elemento `#setupRoleHint` está oculto (`display === 'none'`) ou com conteúdo de texto vazio após a execução de `openSetupScreen()`.
     ```javascript
     const hintEl = document.getElementById('setupRoleHint');
     const isHintClean = !hintEl || hintEl.style.display === 'none' || hintEl.innerHTML.trim() === '';
     if (!isHintClean) throw new Error('Caixa de aviso #setupRoleHint ainda está visível no setup');
     logger.log('Remoção e ocultação estrita da caixa informativa #setupRoleHint no Setup', true);
     ```
  2. **Verificação de Supressão do Texto de Orientação no Card de Professores:**
     Validar que o elemento `#groupSetupTeachersCard` não contém mais o texto de orientação *"duplas ou quartetos"*.
     ```javascript
     const teachersCard = document.getElementById('groupSetupTeachersCard');
     const cardText = teachersCard ? teachersCard.innerText : '';
     if (cardText.includes('duplas ou quartetos')) {
       throw new Error('Mensagem textual sobre duplas/quartetos ainda presente no card de regência');
     }
     logger.log('Supressão da mensagem textual de orientação no card de regentes titulares', true);
     ```

### 5.2 Módulo 12 (`navegacao_layout`)
- **Atualização de Versão no Teste do Changelog:**
  Atualizar a expectativa do texto do botão de versão na barra superior para refletir a **Versão 0.96**:
  ```javascript
  logger.log('Modal de Changelog e botão de versão na barra superior', true, btnChangelog.innerText.trim());
  ```
  (O teste já captura `btnChangelog.innerText.trim()`, portanto refletirá automaticamente a `Versão 0.96 (v7.75)`).

### 5.3 Exclusões
- Nenhuma asserção anterior é excluída. As asserções existentes para seleção de turmas, cálculo longitudinal de bimestre, vinculação de regentes e turmas integrais permanecem ativas e intactas.

### 5.4 Meta Global de Cobertura
- **Status Esperado:** **100% DE SUCESSO** (65/65 asserções aprovadas) na suíte integral de 12 módulos de `audit_platform.py`.
- **Comunicação Pós-Deploy:** Resposta estritamente limpa e sucinta, reportando apenas eventuais falhas caso ocorram.
