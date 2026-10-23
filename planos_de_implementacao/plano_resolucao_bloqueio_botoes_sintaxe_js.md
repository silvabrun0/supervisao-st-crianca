# Plano de Implementação: Resolução Definitiva do Bloqueio Global de Botões e Blindagem de Sintaxe JS

> **Diretriz de Execução (Obrigatório - Instruções ao Executor):**  
> O assistente executor da **Etapa 2 (Operário)** DEVE OBRIGATORIAMENTE ler e seguir integralmente as diretrizes do arquivo [WORKFLOW_MACOS.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md) e do [WORKFLOW_GITHUB.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_GITHUB.md) antes de aplicar quaisquer modificações no código-fonte. A execução deve ser estrita, cirúrgica e atenta à dupla checagem (reler arquivos alterados após modificação), versionamento sequencial duplo (`CHANGELOG.md` e `#modalChangelog` no `index.html`), criação de cópia intermediária em `intermediárias/` e sincronização integral das cópias espelhadas do projeto (`gestor supervisao_patos/index.html` e `gestor supervisao_patos/firebase_deploy/public/index.html`). Ao finalizar o deploy via `git push origin main`, é mandatória a execução de `python3 audit_platform.py --silent-on-success`, comunicando ao usuário **exclusivamente a ocorrência de falhas/problemas**, ou confirmando o sucesso de forma limpa e sucinta caso 100% dos testes sejam aprovados.

---

> **Status:** 📐 Planejamento Concluído (Etapa 1 - Arquiteto)  
> **Data:** 23/10/2026  
> **Versão Alvo:** `1.21` (`v7.99`)  
> **Arquivo de Backup Intermediário:** `intermediárias/aplicativo_v121_resolucao_bloqueio_botoes_sintaxe_js.html`  
> **Arquivos Principais Afetados:**  
> - `index.html` (raiz da aplicação / deploy GitHub Pages)  
> - `gestor supervisao_patos/index.html` (cópia espelho local)  
> - `gestor supervisao_patos/firebase_deploy/public/index.html` (cópia espelho de produção)  
> - `audit_platform.py` (motor automatizado de auditoria modular)  
> - `CHANGELOG.md` (registro histórico unificado de versões)  

---

## 1. Diagnóstico do Problema e Análise Forense da Causa-Raiz

### 1.1 Sintoma Relatado
O usuário relatou o bloqueio absoluto de operação na plataforma:
> *"a plataforma está com um problema: nao consigo apertar em nenhum botão."*

Ao interagir com o sistema no navegador, absolutamente nenhum botão da interface responde (como abas do cabeçalho, botão de nova observação, avatar do perfil, botões de ação e modais), aparentando um congelamento completo da aplicação.

---

### 1.2 Mapa Forense de Causa-Raiz

Uma auditoria analítica no repositório, nos commits recentes do Git e no interpretador JavaScript revelou a causa técnica exata em três camadas:

1. **Erro Fatal de Sintaxe JavaScript (`Uncaught SyntaxError: Unexpected token '}'`):**
   - No commit `764086f18e07bed67efa42efe0cbabb3fba5c980` (ativo no ramo `main` e servido pela GitHub Pages em produção), a linha 16738 de `index.html` contém uma chave de fechamento duplicada órfã `}` imediatamente após a função `saveNewTeamMember()`:
     ```javascript
           renderTeamScreen();
           showToast(user.roleKey === 'coordenador' ? 'Docente cadastrada com sucesso!' : 'Profissional cadastrado com sucesso!');
         }
         } // <--- CHAVE DUPLICADA ÓRFÃ AQUI (LINHA 16738)

         function openEditMemberModal(id) {
     ```
   - Em JavaScript inline, uma chave de fechamento fora de bloco provoca um erro sintático irrecuperável de compilação (*parser error*), verificado deterministamente via JavaScriptCore (`jsc`):
     ```text
     Exception: SyntaxError: Parser error at /tmp/origin_main_script_0.js:8919
     ```
   - Como resultado de uma falha de compilação em um bloco `<script>`, os navegadores (V8, JavaScriptCore, Gecko) **abortam imediatamente a execução de todo o script**.
   - Nenhuma função é exposta no escopo global (`navigateToTab`, `renderHomeScreen`, `openProfileModal`, `openAddMemberModal`, etc.).
   - O evento `DOMContentLoaded` nunca é acionado, de modo que `loadState()` e `renderHomeScreen()` não rodam.
   - Todo clique em elementos com manipuladores inline `onclick="..."` dispara silenciosamente no console `Uncaught ReferenceError: <função> is not defined`.
   - Para o usuário, a interface fica inerte e nada responde aos cliques.

2. **Vulnerabilidade de Escopo de Variável (`ReferenceError: dbKey is not defined`):**
   - Na linha 17028 do mesmo commit, a variável `dbKey` foi declarada com `const dbKey` no interior do bloco `if (roleKey !== 'professora') { ... }`.
   - Na linha 17160 (fora do bloco `if`), o código tenta avaliar:
     ```javascript
     if (appState.currentUserKey === dbKey || appState.currentUserKey === id) {
       applyUserRoleUI();
     }
     ```
   - Ao editar o cadastro de uma docente regente (`roleKey === 'professora'`), `dbKey` não existe no escopo, disparando uma exceção de runtime.

3. **Origem do Problema Operacional e Lacuna na Auditoria:**
   - As correções sintáticas e de escopo foram aplicadas localmente em arquivos auxiliares, mas **permaneceram não comitadas na raiz do projeto**, mantendo o GitHub Pages com o código quebrado do commit `764086f1`.
   - O algoritmo `audit_platform.py` não possuía uma verificação sintática prévia (*pre-flight check*). Ao auditar um arquivo com erro sintático fatal, o Chrome Headless não conseguia executar o script de teste in-app (pois `autoAudit` nunca rodava), resultando em um timeout lento de 35 segundos em vez de uma falha instantânea de diagnóstico com linha e erro explícitos.

---

## 2. Objetivos da Intervenção

1. **Restauração Imediata da Interatividade Global:**
   - Eliminar a chave duplicada órfã `}` na linha 16738 de `index.html`.
   - Ajustar o escopo da variável `dbKey` para `let dbKey = null;` antes do bloco condicional na linha 17028.
2. **Sincronização Rigorosa das Cópias Espelhadas:**
   - Garantir paridade absoluta de 100% de bytes entre:
     - `index.html` (raiz / produção GitHub Pages)
     - `gestor supervisao_patos/index.html`
     - `gestor supervisao_patos/firebase_deploy/public/index.html`
3. **Blindagem do Algoritmo de Auditoria (`audit_platform.py`):**
   - Implementar validação léxica e sintática pré-voo (*pre-flight JS check*) em menos de 100ms via `jsc` nativo do macOS antes do início do Chrome Headless.
   - Qualquer erro de compilação ou sintaxe em scripts inline abortará a auditoria imediatamente, apontando a linha e coluna exatas do erro.
4. **Governança e Rastreabilidade do Ciclo de Versões (Versão 1.21 · v7.99):**
   - Gerar cópia intermediária em `intermediárias/aplicativo_v121_resolucao_bloqueio_botoes_sintaxe_js.html`.
   - Atualizar a gestão dupla do Changelog no `CHANGELOG.md` e no `#modalChangelog` do `index.html`.
   - Atualizar o botão de versão no cabeçalho para `📌 Versão 1.21 (v7.99)`.

---

## 3. Especificação Técnica Passo a Passo

### 3.1 Correção Sintática em `index.html` (Linhas 16733 a 16743)

**Localização:** Função `saveNewTeamMember()` em `index.html`.

**Snippet Original com Falha (Commit `764086f1`):**
```javascript
      // Limpa os campos após salvar
      document.getElementById('newMemberName').value = '';
      if(document.getElementById('newMemberEmail')) document.getElementById('newMemberEmail').value = '';
      if(document.getElementById('newMemberPassword')) document.getElementById('newMemberPassword').value = '';

      renderTeamScreen();
      showToast(user.roleKey === 'coordenador' ? 'Docente cadastrada com sucesso!' : 'Profissional cadastrado com sucesso!');
    }
    }

    function openEditMemberModal(id) {
```

**Snippet de Substituição Cirúrgica:**
```javascript
      // Limpa os campos após salvar
      document.getElementById('newMemberName').value = '';
      if(document.getElementById('newMemberEmail')) document.getElementById('newMemberEmail').value = '';
      if(document.getElementById('newMemberPassword')) document.getElementById('newMemberPassword').value = '';

      renderTeamScreen();
      showToast(user.roleKey === 'coordenador' ? 'Docente cadastrada com sucesso!' : 'Profissional cadastrado com sucesso!');
    }

    function openEditMemberModal(id) {
```

---

### 3.2 Correção de Escopo em `saveEditMemberModal()` (Linhas 17025 a 17036)

**Localização:** Função `saveEditMemberModal(id)` em `index.html`.

**Snippet Original com Falha (Commit `764086f1`):**
```javascript
      // 3. Sincronização com USERS_DB e customUsers apenas para usuários com login (não docentes)
      if (roleKey !== 'professora') {
        const dbKey = Object.keys(USERS_DB).find(k => 
          k === id || 
          USERS_DB[k].id === id || 
          (USERS_DB[k].name && USERS_DB[k].name.toLowerCase() === oldName.toLowerCase()) ||
          (appState.currentUserKey === k && (USERS_DB[k].name === oldName || USERS_DB[k].id === id))
        );
```

**Snippet de Substituição Cirúrgica:**
```javascript
      // 3. Sincronização com USERS_DB e customUsers apenas para usuários com login (não docentes)
      let dbKey = null;
      if (roleKey !== 'professora') {
        dbKey = Object.keys(USERS_DB).find(k => 
          k === id || 
          USERS_DB[k].id === id || 
          (USERS_DB[k].name && USERS_DB[k].name.toLowerCase() === oldName.toLowerCase()) ||
          (appState.currentUserKey === k && (USERS_DB[k].name === oldName || USERS_DB[k].id === id))
        );
```

---

### 3.3 Blindagem Pré-Voo em `audit_platform.py`

**Localização:** Adição da função `check_javascript_syntax(html_path)` e sua chamada no início de `main()`.

```python
def check_javascript_syntax(html_path):
    """Valida a integridade sintática dos scripts inline via JSC nativo do macOS antes do Chrome Headless."""
    jsc_path = "/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc"
    if not os.path.exists(jsc_path) or not os.path.exists(html_path):
        return True # Fallback seguro se não for macOS
    
    import re
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    scripts = re.findall(r'<script>(.*?)</script>', content, re.DOTALL)
    for i, script in enumerate(scripts):
        with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as tf:
            tf.write("var window = { addEventListener: function() {}, location: { search: '' } };\n")
            tf.write("var document = { addEventListener: function() {}, querySelector: function() { return null; }, querySelectorAll: function() { return []; }, getElementById: function() { return null; } };\n")
            tf.write("var localStorage = { getItem: function() { return null; }, setItem: function() {} };\n")
            tf.write(script)
            tf_path = tf.name
        
        try:
            res = subprocess.run([jsc_path, tf_path], capture_output=True, text=True)
            if res.returncode != 0 and 'SyntaxError' in res.stderr:
                print("=" * 80)
                print(f"❌ ERRO FATAL DE SINTAXE JS DETECTADO NO BLOCO DE SCRIPT #{i+1}:")
                for line in res.stderr.strip().splitlines():
                    if 'SyntaxError' in line or 'at ' in line:
                        print(f"   {line}")
                print("   A auditoria foi interrompida para evitar falsos positivos e timeout.")
                print("=" * 80)
                return False
        finally:
            if os.path.exists(tf_path):
                os.remove(tf_path)
    return True
```

No início da função `main()`:
```python
    # 0. Verificação Pré-Voo de Sintaxe JavaScript
    if not check_javascript_syntax("index.html"):
        sys.exit(1)
```

---

### 3.4 Sincronização Rigorosa das Cópias Espelhadas
Executar cópia fiel de `index.html` para:
- `gestor supervisao_patos/index.html`
- `gestor supervisao_patos/firebase_deploy/public/index.html`

Garantir validação via `diff` sem qualquer discrepância.

---

## 4. Gestão do Changelog Duplo e Salvaguarda

### 4.1 Cópia Intermediária
Salvar cópia completa em:
`intermediárias/aplicativo_v121_resolucao_bloqueio_botoes_sintaxe_js.html`

### 4.2 Atualização no `CHANGELOG.md`
Inserir no topo do sumário executivo e na lista cronológica detalhada:

```markdown
| **1.21** | 23/10/2026 14:15 | `intermediárias/aplicativo_v121_resolucao_bloqueio_botoes_sintaxe_js.html` | Solicitação direta / `plano_resolucao_bloqueio_botoes_sintaxe_js.md` | Resolução definitiva do bloqueio global de botões por erro fatal de sintaxe JS (`Uncaught SyntaxError: Unexpected token '}'`), correção de escopo de `dbKey` em docentes e implementação de verificação sintática pré-voo em `audit_platform.py` 🔬🛡️ |
```

### 4.3 Atualização no `#modalChangelog` e Cabeçalho em `index.html`
- Atualizar botão no cabeçalho:
  `📌 Versão 1.21 (v7.99)`
- Inserir card correspondente à Versão 1.21 com as descrições técnicas das melhorias.

---

## 5. Seção Obrigatória de Auditoria
Em estrita conformidade com o [WORKFLOW_MACOS.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md), as seguintes alterações, adições e exclusões devem ser implementadas no algoritmo de auditoria (`audit_platform.py`) e na engine in-app de `index.html`:

### 5.1 Alterações no Algoritmo de Auditoria (`audit_platform.py`)
- **[ADIÇÃO] Validador Léxico e Sintático Pré-Voo (Pre-Flight JS Check):**
  - Execução preliminar de validação de compilação sintática via `jsc` antes do disparo do Chrome Headless.
  - Interrupção imediata (em menos de 100ms) se qualquer script de `index.html` contiver `SyntaxError`, exibindo o número da linha correspondente.
- **[MANUTENÇÃO] Execução Integral dos 12 Módulos Canônicos:**
  - Manter execução silenciosa no pós-deploy com o parâmetro `--silent-on-success`.

### 5.2 Alterações na Engine de Testes In-App (`index.html`)

#### Módulo 2: `catalogo_dados` (Catálogo, Escolas, Turmas, Governança e Membros)
- **[ADIÇÃO] Asserção de Edição Segura de Docente Titular sem Quebra de Escopo:**
  - Invocar programaticamente o ciclo de edição de docente titular (`roleKey === 'professora'`) chamando `openEditMemberModal(docenteId)` e `saveEditMemberModal(docenteId)`.
  - Assegurar que nenhuma exceção de `ReferenceError: dbKey is not defined` é lançada durante a execução da rotina.
  - Testar o cadastro com `saveNewTeamMember()` garantindo que a remoção da chave extra mantém íntegra a criação de docentes pela coordenadora.

#### Módulo 12: `navegacao_layout` (Navegação, Layout, Rotas e Acessibilidade)
- **[ADIÇÃO] Validação de Reatividade de Botões e Despacho de Eventos:**
  - Validar no DOM que os seletores críticos de navegação (`#deskTabHome`, `#deskTabSchedule`, `#btnNewObsHero`, `#headerAvatarBtn`, `.btn-changelog`) possuem ouvintes de clique vinculados a funções ativas no escopo `window`.
  - Simular o disparo programático de clique em `#btnNewObsHero` e `#headerAvatarBtn`, validando que as respectivas funções de transição de rota (`navigateToTab`) e abertura de modal (`openProfileModal`) são executadas sem erros.
- **[ADIÇÃO] Asserção de Integridade do Cabeçalho e Botão de Versão:**
  - Validar que o botão `.btn-changelog` exibe o rótulo atualizado `📌 Versão 1.21 (v7.99)`.
  - Validar que o `#modalChangelog` contém o card de registro da Versão 1.21.

### 5.3 Cobertura Alvo Pós-Execução
- Cobertura de 100% de sucesso em todos os 12 módulos modo-a-modo (145+ asserções determinísticas sem falsos positivos ou tolerância a falhas).
