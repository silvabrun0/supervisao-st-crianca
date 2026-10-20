# Plano de Implementação - Correção da Seleção de Unidade Escolar no Cadastro de Novo Profissional

## 1. Contexto e Diagnóstico do Problema
O usuário reportou:
> "quando tento adicionar um novo profissional à rede, não consigo selecionar outra unidade para atriubir-lhe. localize o problema e resolva-o, sem mexer em absolutamente mais nada"

### Causa Raiz
No modal de cadastro de novo profissional (`#modalAddMember`), o elemento `<select id="newMemberSchool">` possui o listener:
```html
<select id="newMemberSchool" class="form-select" onchange="onNewMemberRoleChange()">
```
Quando o usuário altera a unidade no `<select>`, o evento `onchange` dispara `onNewMemberRoleChange()`.
Dentro de `onNewMemberRoleChange()`, a função reinicializa o select recriando todas as opções do zero a cada execução:
```javascript
schoolSelect.innerHTML = '';
if (role === 'formador') {
  ...
} else {
  appState.units.forEach(u => {
    const opt = document.createElement('option');
    opt.value = u.name; opt.text = u.name;
    schoolSelect.appendChild(opt);
  });
}
```
Como não preserva o valor previamente selecionado (`schoolSelect.value`), o `<select>` é repovoado e redefinido para a primeira opção da lista (`appState.units[0].name`). Assim, qualquer tentativa do usuário de escolher outra unidade no dropdown faz o select voltar imediatamente para a primeira unidade.

Além disso:
- No modal de edição (`#modalEditMember`), essa preservação já foi implementada através de:
  ```javascript
  const currentSchoolVal = schoolSelect.value;
  ...
  if(Array.from(schoolSelect.options).some(o => o.value === currentSchoolVal)){
      schoolSelect.value = currentSchoolVal;
  }
  ```
- No cadastro de novo membro (`onNewMemberRoleChange`), faltava essa mesma preservação de valor ao repovoar o `<select>`.

## 2. Solução Pontual e Cirúrgica
1. Em `onNewMemberRoleChange()`:
   - Capturar `const currentSchoolVal = schoolSelect.value;` antes de limpar `schoolSelect.innerHTML = '';`.
   - Após recriar as opções de `schoolSelect`, se `currentSchoolVal` existir entre as opções, restaurar `schoolSelect.value = currentSchoolVal;`.
2. Não alterar nenhuma outra regra de negócio, layout ou fluxo.
3. Atualizar versão para **0.93** no Changelog duplo (`CHANGELOG.md`, `#modalChangelog` no `index.html` e indicador de versão no topo).
4. Gerar intermediária `intermediárias/aplicativo_v93_correcao_selecao_unidade_novo_profissional.html`.
5. Manter espelho `firebase_deploy/public/index.html` sincronizado com `index.html`.

## 3. Seção Obrigatória de Auditoria
- **Adições / Atualizações na Engine de Testes:**
  - No Módulo `catalogo_dados`, adicionar teste unitário automatizado simulando a abertura do modal de novo profissional (`openAddMemberModal`), selecionando uma unidade diferente da primeira (ex: segunda ou terceira unidade), disparando o `change` e verificando se `schoolSelect.value` permanece na unidade selecionada e não é resetado para a primeira.
- **Execução Pós-Deploy:**
  - Executar `python3 audit_platform.py --silent-on-success` e reportar estritamente falhas (ou confirmação concisa se 100% aprovado).
