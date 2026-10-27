# Plano de Implementação: Remoção de Ícones e Emojis da Tabela de Turmas & Regência (Jornada, Turno e Docentes de Tempo Integral)

---

## 0. Diretriz de Execução (Obrigatória para o Operário - Etapa 2)
> [!IMPORTANT]
> **Leitura Prévia Obrigatória:** Antes de executar qualquer ação deste plano, o assistente na **Etapa 2 (O Operário)** DEVE consultar e seguir rigorosamente:
> 1. [WORKFLOW_MACOS.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md)
> 2. [WORKFLOW_GITHUB.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_GITHUB.md)
> 3. [.agents/skills/execucao-operario/SKILL.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/.agents/skills/execucao-operario/SKILL.md)
> 4. [.agents/skills/auditoria-plataforma/SKILL.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/.agents/skills/auditoria-plataforma/SKILL.md)
>
> **Trava de Fidelidade, Estabilidade e Não Regressão:** Este plano contempla estritamente a remoção dos ícones e emojis residuais (`☀️` e `🌤️`) nas colunas de **Jornada Escolar**, **Turno** e no detalhamento de **Professores Regentes** das turmas de Tempo Integral na tabela de gestão de turmas (`renderClassesScreen()`).
> Todas as classes CSS (`status-badge`), cores semânticas, atributos de estilo, funções de persistência (`saveState()`), filtros de busca e modais de edição (`#modalClassEditor`) DEVEM ser mantidos 100% intactos.

---

## 1. Diagnóstico e Contexto

### 1.1 Contexto e Justificativa Institucional e Pedagógica
Na plataforma *SerTão Criança*, a tela **Gestão Descentralizada de Turmas & Regência** (`renderClassesScreen()`, acessível em `#pedagViewClasses`) é o instrumento onde Coordenadoras Pedagógicas de cada Unidade Escolar e os membros do Núcleo de Educação Infantil gerenciam a caracterização das turmas da rede municipal de ensino de Patos/PB.

A tabela (`#classesTableBody`) estrutura as turmas com as seguintes colunas canônicas:
1. **Turma:** Nome da turma e etapa da Educação Infantil (ex: *Infantil I - Turma D*, *Pré-Escola*);
2. **Unidade Escolar:** Nome da UE de lotação;
3. **Jornada Escolar:** Classificação conforme diretriz do MEC/Censo Escolar (*Tempo Parcial* vs. *Tempo Integral*);
4. **Turno:** Turno de funcionamento (*Tempo Parcial (Matutino)*, *Tempo Parcial (Vespertino)* ou *Manhã + Tarde*);
5. **Professores Regentes:** Relação nominal das docentes titulares responsáveis;
6. **Ações:** Botões de edição e exclusão.

### 1.2 O Problema Identificado e a Demanda do Usuário
Ao analisar a renderização atual das linhas da tabela:
- Para turmas em **Tempo Parcial**, os dados são exibidos de forma limpa, sóbria e institucional:
  - Jornada: `<span class="status-badge" ...>Tempo Parcial</span>` (sem emojis);
  - Turno: `<span class="status-badge" ...>Tempo Parcial (Matutino)</span>` (sem emojis);
  - Docentes: Relação nominal simples.
- Já para turmas em **Tempo Integral**, foram inseridos emojis do Unicode nos badges e cabeçalhos da linha:
  - **Jornada Escolar:** `☀️ Tempo Integral`
  - **Turno:** `☀️ Manhã + 🌤️ Tarde`
  - **Professores Regentes:** `☀️ Manhã:` e `🌤️ Tarde:`

Essa presença de emojis residuais:
1. Gera **assimetria gráfica injustificada** em relação às turmas de Tempo Parcial;
2. Compromete a **sobriedade institucional** exigida pelas equipes técnicas da Secretaria de Educação;
3. Provoca oscilações de renderização visual entre diferentes sistemas operacionais (macOS, Windows, Android e relatórios impressos/PDF).

**Demanda Expressa do Usuário:**
> *"crie um plano somente para retirar os ícones de ☀️ Tempo Integral	☀️ Manhã + 🌤️ Tarde	
> ☀️ Manhã"*

### 1.3 Solução Proposta
Realizar a higienização tipográfica estrita na função `renderClassesScreen()`, eliminando os emojis gráficos:
1. Na Jornada: Substituir `☀️ Tempo Integral` por `Tempo Integral`.
2. No Turno: Substituir `☀️ Manhã + 🌤️ Tarde` por `Manhã + Tarde`.
3. Nos Docentes Regentes: Substituir `☀️ Manhã:` por `Manhã:` (e, por coerência e simetria do mesmo elemento celular, substituir `🌤️ Tarde:` por `Tarde:`).

---

## 2. Arquitetura e Mapeamento de Pontos de Impacto

Os arquivos afetados no repositório são:
- [index.html](file:///Users/bruno/Desktop/gestor%20supervisao_patos/index.html) (função `renderClassesScreen()`, módulo de auditoria e changelog)
- [firebase_deploy/public/index.html](file:///Users/bruno/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html) (cópia espelhada de produção)
- [CHANGELOG.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/CHANGELOG.md)

### 2.1 Mapeamento Localizado das Linhas em `index.html`

Na função `renderClassesScreen()` (em torno das linhas 17490 a 17510):

| Elemento / Coluna | Código Atual | Novo Código |
| :--- | :--- | :--- |
| **Jornada (Linha 17492)** | `? '<span class="status-badge" style="background:#EDE9FE; color:#6D28D9; font-weight:700;">☀️ Tempo Integral</span>'` | `? '<span class="status-badge" style="background:#EDE9FE; color:#6D28D9; font-weight:700;">Tempo Integral</span>'` |
| **Turno (Linha 17497)** | `turnoBadge = '<span class="status-badge" style="background:#DCFCE7; color:#166534; font-size:11px;">☀️ Manhã + 🌤️ Tarde</span>';` | `turnoBadge = '<span class="status-badge" style="background:#DCFCE7; color:#166534; font-size:11px;">Manhã + Tarde</span>';` |
| **Docente Manhã (Linha 17506)** | `<div><strong style="color:#B45309;">☀️ Manhã:</strong> ${mList}</div>` | `<div><strong style="color:#B45309;">Manhã:</strong> ${mList}</div>` |
| **Docente Tarde (Linha 17507)** | `<div><strong style="color:#4338CA;">🌤️ Tarde:</strong> ${aList}</div>` | `<div><strong style="color:#4338CA;">Tarde:</strong> ${aList}</div>` |

---

## 3. Especificação de Implementação Passo a Passo (Snippets Exatos)

### Passo 1: Atualização da Função `renderClassesScreen()` em `index.html`

Localizar o bloco de renderização do `classesToRender.forEach(cls => { ... })` (~linhas 17489-17513 de `index.html`):

**Código Atual:**
```javascript
      classesToRender.forEach(cls => {
        const isIntegral = (cls.shift || '').toLowerCase().includes('integral');
        const jornadaBadge = isIntegral 
          ? `<span class="status-badge" style="background:#EDE9FE; color:#6D28D9; font-weight:700;">☀️ Tempo Integral</span>`
          : `<span class="status-badge" style="background:#EFF6FF; color:#1E40AF; font-weight:700;">Tempo Parcial</span>`;

        let turnoBadge = `<span class="status-badge" style="background:#FEF3C7; color:#92400E; font-size:11px;">${cls.shift || 'Não definido'}</span>`;
        if (isIntegral) {
          turnoBadge = `<span class="status-badge" style="background:#DCFCE7; color:#166534; font-size:11px;">☀️ Manhã + 🌤️ Tarde</span>`;
        }

        let teachersDisplay = '';
        if (isIntegral && (cls.teachersMorning || cls.teachersAfternoon)) {
          const mList = (cls.teachersMorning && cls.teachersMorning.length > 0) ? cls.teachersMorning.join(', ') : 'A definir';
          const aList = (cls.teachersAfternoon && cls.teachersAfternoon.length > 0) ? cls.teachersAfternoon.join(', ') : 'A definir';
          teachersDisplay = `
            <div style="font-size:11px; line-height:1.4;">
              <div><strong style="color:#B45309;">☀️ Manhã:</strong> ${mList}</div>
              <div><strong style="color:#4338CA;">🌤️ Tarde:</strong> ${aList}</div>
            </div>
          `;
        } else {
          const tList = (Array.isArray(cls.teachers) && cls.teachers.length > 0) ? cls.teachers.join(', ') : '<span style="color:var(--text-secondary); font-style:italic;">Nenhum regente alocado</span>';
          teachersDisplay = `<div style="font-size:12px; font-weight:600; color:#1E293B;">${tList}</div>`;
        }
```

**Novo Código:**
```javascript
      classesToRender.forEach(cls => {
        const isIntegral = (cls.shift || '').toLowerCase().includes('integral');
        const jornadaBadge = isIntegral 
          ? `<span class="status-badge" style="background:#EDE9FE; color:#6D28D9; font-weight:700;">Tempo Integral</span>`
          : `<span class="status-badge" style="background:#EFF6FF; color:#1E40AF; font-weight:700;">Tempo Parcial</span>`;

        let turnoBadge = `<span class="status-badge" style="background:#FEF3C7; color:#92400E; font-size:11px;">${cls.shift || 'Não definido'}</span>`;
        if (isIntegral) {
          turnoBadge = `<span class="status-badge" style="background:#DCFCE7; color:#166534; font-size:11px;">Manhã + Tarde</span>`;
        }

        let teachersDisplay = '';
        if (isIntegral && (cls.teachersMorning || cls.teachersAfternoon)) {
          const mList = (cls.teachersMorning && cls.teachersMorning.length > 0) ? cls.teachersMorning.join(', ') : 'A definir';
          const aList = (cls.teachersAfternoon && cls.teachersAfternoon.length > 0) ? cls.teachersAfternoon.join(', ') : 'A definir';
          teachersDisplay = `
            <div style="font-size:11px; line-height:1.4;">
              <div><strong style="color:#B45309;">Manhã:</strong> ${mList}</div>
              <div><strong style="color:#4338CA;">Tarde:</strong> ${aList}</div>
            </div>
          `;
        } else {
          const tList = (Array.isArray(cls.teachers) && cls.teachers.length > 0) ? cls.teachers.join(', ') : '<span style="color:var(--text-secondary); font-style:italic;">Nenhum regente alocado</span>';
          teachersDisplay = `<div style="font-size:12px; font-weight:600; color:#1E293B;">${tList}</div>`;
        }
```

---

### Passo 2: Atualização do Changelog Duplo e Versão Sequencial

Avançar a versão da plataforma para a próxima versão sequencial cabível (**Versão 1.40** ou **Versão 1.41**, dependendo da ordem de merge/execução com outros planos concorrentes):

1. **No Botão do Cabeçalho (`.btn-changelog`):**
   Atualizar para a versão sequencial (ex: `Versão 1.40 (v8.2.7)` ou `Versão 1.41 (v8.2.8)`).

2. **No Modal de Changelog (`#modalChangelog`):**
   Inserir o card descritivo no topo da lista:
   ```html
       <!-- VERSÃO SEQUENCIAL - HIGIENIZAÇÃO VISUAL: REMOÇÃO DE ÍCONES DA TABELA DE TURMAS & REGÊNCIA -->
       <div class="card" style="margin-bottom:16px; border-left:4px solid #7C3AED;">
         <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
           <span style="font-weight:800; font-size:14px; color:var(--text-primary);">📌 Versão [N] ([vX.X.X])</span>
           <span style="font-size:11px; background:#EDE9FE; color:#6D28D9; padding:2px 8px; border-radius:12px; font-weight:700;">27/10/2026</span>
         </div>
         <div style="font-size:12px; font-weight:700; color:var(--text-primary); margin-bottom:6px;">
           Higienização Visual e Sobriedade Institucional na Gestão de Turmas (Pilar 14):
         </div>
         <ul style="font-size:12px; color:var(--text-secondary); margin:0; padding-left:18px; line-height:1.5;">
           <li>🧹 <strong>Remoção de Emojis em Turmas Integrais:</strong> Extinção dos ícones ☀️ e 🌤️ na renderização da tabela de turmas (<code>renderClassesScreen</code>), padronizando os badges de Jornada (<em>Tempo Integral</em>), Turno (<em>Manhã + Tarde</em>) e rótulos de regência (<em>Manhã:</em> e <em>Tarde:</em>) com sobriedade tipográfica e paridade visual com turmas de Tempo Parcial.</li>
           <li>🔬 <strong>Auditoria Contínua com 100% de Aprovação:</strong> Adição de asserções estritas no módulo <code>catalogo_dados</code> validando a ausência de emojis nas células e atualização de integridade no módulo 12.</li>
         </ul>
       </div>
   ```

3. **No Arquivo `CHANGELOG.md`:**
   Adicionar no Sumário Executivo:
   ```markdown
   | **[N]** | 27/10/2026 16:15 | `intermediárias/aplicativo_v[N]_remocao_icones_turmas_tempo_integral.html` | Solicitação direta / `planos_de_implementacao/plano_remocao_icones_turmas_tempo_integral.md` | Higienização visual na Tabela de Turmas & Regência (Pilar 14): remoção dos emojis residuais (☀️ e 🌤️) dos badges de Jornada (Tempo Integral), Turno (Manhã + Tarde) e dos rótulos de docentes regentes, assegurando sobriedade institucional e paridade com turmas de Tempo Parcial 🧹🏛️ |
   ```

---

### Passo 3: Criação do Backup Intermediário e Espelhamento

1. Salvar o backup fiel:
   `intermediárias/aplicativo_v140_remocao_icones_turmas_tempo_integral.html`
2. Espelhar integralmente o `index.html` modificado em:
   `gestor supervisao_patos/firebase_deploy/public/index.html`

---

## 4. Critérios de Aceite e Roteiro de Teste

### 4.1 Critérios de Aceite
- [ ] Ao acessar a tela de **Turmas & Regência** (`#pedagViewClasses`) com qualquer perfil com acesso a turmas (Coordenadora, Formadora ou Núcleo EI):
  - Na linha de qualquer turma de Tempo Integral (ex: `cls-pml-04` no CEI Professora Maria de Lourdes):
    - A coluna **Jornada Escolar** exibe exatamente o texto `Tempo Integral`, sem o emoji `☀️`.
    - A coluna **Turno** exibe exatamente o texto `Manhã + Tarde`, sem os emojis `☀️` ou `🌤️`.
    - A coluna **Professores Regentes** exibe os rótulos `Manhã:` e `Tarde:`, sem os emojis `☀️` ou `🌤️`.
- [ ] As turmas em Tempo Parcial continuam funcionando e sendo renderizadas sem qualquer alteração.
- [ ] Nenhuma funcionalidade de edição (`openEditClassModal`), exclusão (`deleteClass`) ou cadastro (`openAddClassModal`) é afetada.
- [ ] A validação sintática do JavaScript via JSC (`python3 audit_platform.py --check-syntax`) é concluída com 100% de sucesso.
- [ ] A suíte modular completa de testes (`python3 audit_platform.py --silent-on-success`) aprova todos os 12 módulos canônicos.

### 4.2 Roteiro de Teste Visual
1. Fazer login como Coordenadora (`mariana`) ou Administrador (`helena`).
2. Acessar a sub-aba **Turmas & Regência**.
3. Localizar a turma de Tempo Integral `Infantil I - Turma D` (ou similar).
4. Conferir visualmente as células das colunas Jornada, Turno e Regentes, constatando ausência absoluta de emojis e estética limpa.
5. Clicar em **Editar** para confirmar a integridade do modal.

---

## 5. Seção Obrigatória de Auditoria: Alterações, Inclusões e Exclusões no `audit_platform.py` e `index.html`

### 5.1 No Algoritmo de Auditoria (`index.html`)

#### Módulo 2 (`catalogo_dados`):
Inserir asserção determinística no módulo `catalogo_dados` (~linha 25128) logo após a validação do padrão MEC:
```javascript
              // Asserção de Higienização Visual: Ausência de emojis em Turmas de Tempo Integral na Tabela de Turmas
              renderClassesScreen();
              const classesTbody = document.getElementById('classesTableBody');
              if (classesTbody) {
                const integralRows = Array.from(classesTbody.querySelectorAll('tr')).filter(tr => tr.innerText.includes('Tempo Integral'));
                if (integralRows.length > 0) {
                  const firstRowText = integralRows[0].innerHTML;
                  if (firstRowText.includes('☀️ Tempo Integral') || firstRowText.includes('☀️ Manhã + 🌤️ Tarde') || firstRowText.includes('☀️ Manhã:')) {
                    throw new Error('Tabela de turmas ainda contém emojis residuais (☀️ ou 🌤️) na exibição de turmas integrais');
                  }
                  if (!firstRowText.includes('Tempo Integral') || !firstRowText.includes('Manhã + Tarde') || !firstRowText.includes('Manhã:')) {
                    throw new Error('Tabela de turmas não exibiu os textos padronizados limpos para turmas integrais');
                  }
                }
              }
              logger.log('Higienização visual da Tabela de Turmas (Tempo Integral sem emojis)', true);
```

#### Módulo 12 (`navegacao_layout`):
Atualizar a asserção de versão do cabeçalho e changelog (~linhas 27502-27508) para validar a versão sequencial atualizada (ex: `Versão 1.40` ou `Versão 1.41`):
```javascript
              if (!btnChangelog.textContent.includes('Versão [N]')) {
                throw new Error(`Texto do botão .btn-changelog incorreto: ${btnChangelog.textContent}`);
              }
              const modalChg = document.getElementById('modalChangelog');
              if (!modalChg.innerHTML.includes('Versão [N]')) {
                throw new Error('#modalChangelog não contém o card descritivo da Versão [N]');
              }
              logger.log('Asserção de Integridade do Cabeçalho e Registro da Versão [N]', true);
```

### 5.2 No Motor de Auditoria CLI (`audit_platform.py`)
- Nenhuma alteração estrutural no `audit_platform.py` é necessária, pois a suíte ponta-a-ponta rodará os testes via Chrome Headless aproveitando os módulos canônicos existentes.
- Execução mandatória pré-commit:
  ```bash
  python3 audit_platform.py --check-syntax
  ```
- Execução mandatória pós-deploy:
  ```bash
  python3 audit_platform.py --silent-on-success
  ```
