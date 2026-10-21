# Plano de Implementação · Versão 0.99 (v7.78)
## Remoção de Badges e Avisos de Vinculação Automática na Aba de Pessoal

---

### 1. Visão Geral e Objetivo
O objetivo desta intervenção é promover a despoluição e simplificação da interface gráfica na aba de **Equipe & Profissionais da Rede** (`#screenTeam`), eliminando elementos visuais e textuais redundantes associados à regra de vinculação entre docentes e coordenadoras pedagógicas:
1. **Remoção do Badge `"Auto via UE"`** na tabela de listagem de membros da equipe (`#teamTableBody`).
2. **Remoção da Caixa de Aviso Informativo `"ℹ️ Vinculação Automática: Conforme a regra de negócio da rede, docentes são vinculadas automaticamente à Coordenadora Pedagógica da Unidade Escolar selecionada."`** no modal de cadastro manual de profissionais (`#modalAddMember`).
3. **Remoção da Caixa de Aviso Informativo correspondente** no modal de edição de profissionais da rede (`#modalEditMember`).

> [!IMPORTANT]
> **Preservação da Regra de Negócio Subjacente:** A regra de negócio funcional permanece 100% íntegra e ativa. Ao atribuir uma docente a uma Unidade Escolar, o sistema continua resolvendo e vinculando automaticamente a Coordenadora Pedagógica em exercício na unidade como superior imediata (`supervisor`), mantendo intactas as agregações hierárquicas, relatórios, histórico e indicadores da rede. Apenas o ruído visual (badge `"Auto via UE"` e alertas em caixas azuis) é suprimido.

---

### 2. Análise Técnica e Locais Exatos de Modificação

#### 2.1. Listagem de Profissionais da Rede (`index.html`)
* **Local:** Função `renderTeamMembersTable()` (linhas ~13315-13356).
* **Diagnóstico:**
  Atualmente, para cada membro com função docente (`m.roleKey === 'professora'`), o código busca a Coordenadora Pedagógica da mesma unidade e adiciona uma tag visual formatada:
  ```javascript
  let supervisorDisplay = m.supervisor || 'Gestão Geral';
  let autoBadge = '';
  if (m.roleKey === 'professora') {
    const cp = appState.teamMembers.find(c => c.roleKey === 'coordenador' && c.school === m.school);
    if (cp) {
      supervisorDisplay = cp.name;
      autoBadge = ' <span style="font-size:10px; background:#EFF6FF; color:#1E40AF; padding:2px 6px; border-radius:10px; font-weight:700;">Auto via UE</span>';
    }
  }
  ...
  <td>${supervisorDisplay}${autoBadge}</td>
  ```
* **Alteração:**
  Eliminar completamente a variável `autoBadge` e a tag HTML associada, renderizando puramente a coordenadora responsável (ou superior imediato):
  ```javascript
  let supervisorDisplay = m.supervisor || 'Gestão Geral';
  if (m.roleKey === 'professora') {
    const cp = appState.teamMembers.find(c => c.roleKey === 'coordenador' && c.school === m.school);
    if (cp) {
      supervisorDisplay = cp.name;
    }
  }
  ...
  <td>${supervisorDisplay}</td>
  ```

---

#### 2.2. Modal de Cadastro de Novo Profissional (`#modalAddMember`)
* **Local HTML:** Linhas ~6095-6097 em `#modalAddMember`.
* **Diagnóstico:**
  Existe um container `<div id="newMemberTeacherRuleNote">` posicionado imediatamente abaixo do select `#newMemberSupervisor`:
  ```html
  <div id="newMemberTeacherRuleNote" style="display:none; font-size:11px; color:#1E40AF; background:#EFF6FF; border:1px solid #BFDBFE; padding:8px 10px; border-radius:6px; margin-top:6px;">
    ℹ️ <strong>Vinculação Automática:</strong> Conforme a regra de negócio da rede, docentes são vinculadas automaticamente à Coordenadora Pedagógica da Unidade Escolar selecionada.
  </div>
  ```
* **Local JS:** Função `onNewMemberRoleChange()` (linhas ~13375, 13407, 13421, 13439, 13447).
* **Alteração:**
  1. Excluir o elemento `<div id="newMemberTeacherRuleNote">` do HTML.
  2. Remover as referências a `ruleNote` e as atribuições `ruleNote.style.display = ...` na função `onNewMemberRoleChange()`.

---

#### 2.3. Modal de Edição de Profissional (`#modalEditMember`)
* **Local HTML:** Linhas ~6150-6152 em `#modalEditMember`.
* **Diagnóstico:**
  Existe um container `<div id="editMemberTeacherRuleNote">` posicionado imediatamente abaixo do select `#editMemberSupervisor`:
  ```html
  <div id="editMemberTeacherRuleNote" style="display:none; font-size:11px; color:#1E40AF; background:#EFF6FF; border:1px solid #BFDBFE; padding:8px 10px; border-radius:6px; margin-top:6px;">
    ℹ️ <strong>Vinculação Automática:</strong> Conforme a regra de negócio da rede, docentes são vinculadas automaticamente à Coordenadora Pedagógica da Unidade Escolar selecionada.
  </div>
  ```
* **Local JS:** Função `onEditMemberRoleChange()` (linhas ~13564, 13595, 13609, 13628, 13637).
* **Alteração:**
  1. Excluir o elemento `<div id="editMemberTeacherRuleNote">` do HTML.
  2. Remover as referências a `ruleNote` e as atribuições `ruleNote.style.display = ...` na função `onEditMemberRoleChange()`.

---

### 3. Gestão de Versão e Documentação (Dupla Checagem)

1. **Atualização do Changelog Duplo:**
   - **`CHANGELOG.md`:** Adicionar a seção completa da **Versão 0.99 (v7.78)** no sumário executivo e no corpo cronológico detalhado.
   - **`#modalChangelog` no `index.html`:** Inserir o cartão da versão 0.99 no topo da listagem de versões.
   - **Barra Superior (`index.html`):** Atualizar o botão de versão no cabeçalho para `Versão 0.99 · v7.78`.
2. **Cópia de Segurança Intermediária:**
   - Salvar o arquivo snapshot do aplicativo em:
     `intermediárias/aplicativo_v99_remocao_avisos_vinculacao_automatica_pessoal.html`.

---

### 4. Seção Obrigatória de Auditoria Modular

Em conformidade estrita com as diretrizes do projeto (`WORKFLOW_MACOS.md`), segue o mapeamento determinístico de alterações a serem aplicadas no motor de testes e no algoritmo de auditoria da plataforma (`audit_platform.py` e engine em `index.html`), garantindo **100% de cobertura determinística**:

#### 4.1. Módulo: Catálogo Canônico, Escolas, Turmas, Professores e Estado Global (`catalogo_dados`)
* **Adição de Asserções Determinísticas:**
  1. **Supressão do Badge `"Auto via UE"`:** Executar `renderTeamMembersTable()`, inspecionar o conteúdo textual e HTML renderizado no contêiner da tabela (`#teamTableBody`) e validar com asserção estrita que:
     - O nome da Coordenadora da unidade (ex: *Mariana Ferreira*) consta corretamente como vinculação da docente.
     - A substring ou badge `"Auto via UE"` **não** está presente em nenhuma célula da tabela.
  2. **Ausência dos Alertas Informáticos de Vinculação:**
     - Validar que os nós `#newMemberTeacherRuleNote` e `#editMemberTeacherRuleNote` foram removidos do DOM ou que nenhuma caixa com o texto `"Vinculação Automática"` está visível/renderizada ao selecionar o perfil de Professora nos modais de cadastro e edição.

#### 4.2. Módulo: Síntese Pedagógica e Cronograma (`sintese_finalizacao` & `agenda_cronograma`)
* **Blindagem e Resiliência de Estado Pré-Finalização:**
  - Garantir no harness de teste que, antes de disparar `finalizeObservation()`, os inputs de horário do formulário (`#synthesisStartTime` e `#synthesisEndTime`) sejam sincronizados e resetados com os horários válidos da observação sob teste, prevenindo que resíduos do teste de erro temporal (09:00 vs 08:00) interfiram em asserções de finalizações subsequentes no módulo 5 e no módulo 8 (`agenda_cronograma`).
  - Restabelecer 100% de aprovação (56/56 testes verdes) em toda a suíte.

---

### 5. Checklist de Verificação Pós-Execução
- [ ] Tabela de profissionais renderiza a Coordenadora da escola sem o badge `"Auto via UE"`.
- [ ] Modal de cadastro de novo profissional não exibe a caixa azul de vinculação automática ao escolher docente.
- [ ] Modal de edição de profissional não exibe a caixa azul de vinculação automática ao escolher docente.
- [ ] A vinculação de dados funcional continua intacta (docente segue associada à coordenadora correta no estado global).
- [ ] Cópia salva em `intermediárias/aplicativo_v99_remocao_avisos_vinculacao_automatica_pessoal.html`.
- [ ] Changelog duplo atualizado (`CHANGELOG.md` e `#modalChangelog` no `index.html`).
- [ ] `python3 audit_platform.py --silent-on-success` executado com aprovação integral de 100%.
