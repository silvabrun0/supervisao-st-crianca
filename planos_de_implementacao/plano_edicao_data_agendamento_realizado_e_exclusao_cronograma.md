# Plano de Implementação: Edição de Data de Agendamento Realizado e Exclusão Segura no Cronograma

**Data de Elaboração:** 22/10/2026  
**Responsável:** Arquiteto de Software & Engenheiro de Usabilidade  
**Contexto Normativo:** Alinhado com [WORKFLOW_MACOS.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md) e [WORKFLOW_GITHUB.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_GITHUB.md)  
**Versão Alvo:** Versão 1.15 · v7.93  

---

## 1. Visão Geral e Diagnóstico das Falhas

O usuário relatou dois problemas críticos no fluxo de gestão do Cronograma de Acompanhamento Longitudinal:
1. **Impossibilidade de salvar alterações de data em agendamentos já realizados:** ao tentar alterar a data de um agendamento já realizado, o dado modificado não é refletido ou persistido devidamente.
2. **Inexistência de mecanismo para exclusão de agendamentos:** o sistema não disponibiliza nenhuma funcionalidade para remover observações planejadas ou agendamentos cadastrados por engano.

### Diagnóstico Técnico das Causas Raízes:

#### Causa 1: Bloqueio de Edição de Agendamentos Realizados e Arquivados na Interface
Na renderização da tela de cronograma (`renderScheduleScreen()`, linhas 13815–13915 de `index.html`), a ação `openEditScheduleModal()` estava restrita unicamente a observações em estado não realizado (`s.status !== 'realizado'` e `!s.archived`).  
Quando uma observação atingia o status de `realizado`, a tabela desktop e os cards mobile substituíam as ações pelo botão de "📋 Devolutiva" e "Arquivar", privando o gestor ou coordenador de abrir o modal de edição para ajustar datas, horários ou metadados da visita.

#### Causa 2: Ausência de Sincronização Relacional entre o Agendamento e a Observação Concluída
Ao iniciar uma visita a partir do cronograma (`openSetupScreenFromSchedule`), o formulário de configuração permite a alteração da data da observação (`#setupDate`). No entanto, ao concluir e finalizar a observação em `finalizeObservation()` (linhas 12706–12723):
- O status do agendamento é alterado para `'realizado'` e recebe `sched.observationId = obs.id`.
- **Porém**, `sched.plannedDate` e `sched.date` **não são atualizados** com a data real em que a visita foi efetuada (`obs.date`).
- Como consequência, a tabela do cronograma continuava exibindo a data original antiga, criando a discrepância em que a alteração de data parece "não ter sido salva".
- Da mesma forma, se a data do agendamento for editada via `saveNewSchedule()`, o sistema atualizava apenas o objeto `sched` no array `appState.schedules`, mas **não propagava** a nova data para a observação vinculada (`obs.date`, `obs.startDate`, `obs.endDate`, `obs.morningObs.date`, etc.). Isso fazia com que o Histórico, a Devolutiva em PDF e o Semáforo Bimestral do Pilar 10 continuassem exibindo a data antiga.

#### Causa 3: Inconsistência de Nomenclatura de Propriedades (`plannedDate` vs `date`)
Enquanto o array canônico `INITIAL_SCHEDULES` define a propriedade como `plannedDate`, o cálculo semafórico do Pilar 10 (`calculateClassBimesterStatus`, linha 16831) lia `sched.date`. Em caso de agendamentos gerados ou manipulados sem a propriedade espelho `date`, ocorriam falhas na exibição e formatação de datas.

#### Causa 4: Ausência Total de Fluxo de Exclusão no Cronograma (CRUD Incompleto)
Na plataforma, não existe a função `deleteSchedule` nem qualquer botão de exclusão:
- Nem no modal `#modalAddSchedule` (que possui apenas os botões "Cancelar" e "Salvar no Cronograma").
- Nem nas colunas de ações da tabela do cronograma desktop (`#scheduleTableBody`).
- Nem na barra de ações dos cards mobile (`#scheduleCardsContainer`).
Caso o usuário crie um agendamento duplicado, selecione uma turma errada ou precise cancelar uma visita planejada, não havia caminho nativo para sua remoção, forçando acúmulo de sujeira relacional no estado global.

---

## 2. Solução Arquitetural Proposta

### 2.1. Habilitação de Edição Ampla e Sincronização Bidirecional de Datas
1. **Interface Flexível:** Estender os botões "✏️ Editar" tanto para agendamentos com `status === 'realizado'` quanto para agendamentos arquivados, aplicando rigorosamente as regras de permissão (RBAC) já consolidadas (`canEditSchedule`: Coordenadoras editam turmas de sua unidade, Formadoras editam coordenações de seu polo, e Núcleo de EI possui escopo global).
2. **Sincronização no Salvamento (`saveNewSchedule`):**
   - Ao salvar uma edição em que `editingScheduleId` esteja preenchido:
     - Atualizar `sched.plannedDate = plannedDate` e `sched.date = plannedDate`.
     - Atualizar `sched.plannedTime = plannedTime`.
     - Localizar se há observação vinculada através de `findObservationForSchedule(sched)` ou `sched.observationId`.
     - Caso exista observação vinculada (seja em rascunho ou finalizada), sincronizar imediatamente:
       - `obs.date = plannedDate;`
       - `obs.startDate = plannedDate;`
       - `obs.endDate = plannedDate;`
       - `obs.startTime = plannedTime;`
       - Se for turma de Tempo Integral (`obs.isIntegral`): atualizar `obs.morningObs.date` e `obs.afternoonObs.date`.
3. **Sincronização na Finalização da Visita (`finalizeObservation`):**
   - Ao finalizar uma observação vinculada a um agendamento:
     - Além de definir `sched.status = 'realizado'` e `sched.observationId = obs.id`, atualizar deterministamente:
       - `sched.plannedDate = obs.date;`
       - `sched.date = obs.date;`
       - `sched.plannedTime = obs.startTime;`
4. **Resiliência no Semáforo do Pilar 10:**
   - Garantir leitura segura `sched.plannedDate || sched.date` em todas as rotinas de verificação e renderização.

### 2.2. Implementação do Fluxo de Exclusão Segura de Agendamentos (Delete Schedule)
1. **Função Canônica de Exclusão (`deleteSchedule`):**
   - Localizar o agendamento em `appState.schedules`.
   - Se possuir observação vinculada (`findObservationForSchedule(sched)`):
     - Se a observação for **Rascunho (`draft`)**: desvincular o agendamento (`obs.scheduleId = null`), preservando o rascunho para que o avaliador não perca anotações em andamento (fica como observação avulsa).
     - Se a observação for **Finalizada (`finalized`)**: desvincular o agendamento (`obs.scheduleId = null`), preservando o documento formativo e histórico oficial da rede.
   - Remover o agendamento de `appState.schedules`:
     ```javascript
     appState.schedules = appState.schedules.filter(s => s.id !== scheduleId);
     ```
   - Fechar o modal caso a exclusão ocorra a partir de `#modalAddSchedule`.
   - Persistir o estado via `saveState()`.
   - Emitir feedback orientador via `showToast('Agendamento excluído com sucesso do cronograma.')`.
   - Re-renderizar as telas afetadas: `renderScheduleScreen()`, `renderHomeScreen()` e `renderIndicatorsScreen()`.
2. **Confirmação Preventiva de Segurança (`confirmDeleteSchedule`):**
   - Diálogo com mensagens claras e contextuais:
     - Agendamento comum: *"Tem certeza que deseja excluir este agendamento do cronograma? Esta ação não poderá ser desfeita."*
     - Agendamento com observação finalizada: *"Este agendamento já possui uma observação realizada e finalizada. Deseja realmente removê-lo do cronograma? A observação concluída no histórico continuará preservada."*
3. **Pontos de Acesso na Interface:**
   - **No Modal `#modalAddSchedule`:** Inclusão do botão estilizado `<button type="button" class="btn btn-secondary" style="color:var(--red); border-color:var(--red); margin-right:auto;" onclick="confirmDeleteSchedule(editingScheduleId)">🗑️ Excluir Agendamento</button>`, exibido exclusivamente quando `editingScheduleId !== null`.
   - **Na Tabela Desktop (`#scheduleTableBody`):** Inclusão de botão de ação de exclusão (ícone de lixeira ou "Excluir") disponível para coordenadoras, formadoras e gestão.
   - **Nos Cards Mobile (`#scheduleCardsContainer`):** Inclusão do botão "Excluir" na barra de ações inferior de cada card.

---

## 3. Arquivos Envolvidos e Modificações Detalhadas

| Arquivo | Componente / Linhas | Modificação |
| :--- | :--- | :--- |
| `index.html` | Modal `#modalAddSchedule` (~linha 7116) | Adição do botão "🗑️ Excluir Agendamento" alinhado à esquerda na barra de ações quando em modo de edição. |
| `index.html` | `renderScheduleScreen()` (~linha 13815–13915) | Inclusão do botão "✏️ Editar" e "🗑️ Excluir" para visitas com `status === 'realizado'` e arquivadas, mantendo o botão "📋 Devolutiva". |
| `index.html` | `openEditScheduleModal()` (~linha 14067) | Ajuste na inicialização do modal para exibir o botão de exclusão e popular fielmente campos de data/hora mesmo para agendamentos realizados. |
| `index.html` | `saveNewSchedule()` (~linha 14222) | Propagação bidirecional da data e horário alterados para a observação vinculada (`obs.date`, `obs.startDate`, `obs.endDate`, `obs.startTime`, turmas integrais). |
| `index.html` | `finalizeObservation()` (~linha 12706) | Sincronização pós-finalização gravando `sched.plannedDate = obs.date` e `sched.plannedTime = obs.startTime`. |
| `index.html` | Novas funções (`confirmDeleteSchedule` e `deleteSchedule`) (~linha 14010) | Rotina segura de exclusão com desvinculação relacional e persistência no LocalStorage. |
| `gestor supervisao_patos/firebase_deploy/public/index.html` | Espelho integral | Cópia fiel idêntica das alterações realizadas em `index.html`. |
| `CHANGELOG.md` e `#modalChangelog` | Registro de versão | Atualização documental para a Versão 1.15. |
| `audit_platform.py` & Engine de Testes | Módulo `agenda_cronograma` (~linha 21870) | Expansão determinística validando edição de data em agendamento realizado, sincronização com observação e exclusão segura. |

---

## 4. Seção Obrigatória de Auditoria (Modo-a-Modo · 100% de Cobertura)

Em conformidade estrita com o [WORKFLOW_MACOS.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md), as alterações, adições e exclusões na suíte de testes são descritas a seguir de maneira estruturada:

### 4.1. Módulo Alvo Primário: `agenda_cronograma`
*Nome Oficial no Catálogo:* `Cronograma de Observações, Destaque da Próxima Observação e Baixa Automática`

#### A. Adições:
1. **Teste de Edição de Data em Agendamento Realizado:**
   - Obter o agendamento `updatedSched` que teve baixa automática para status `realizado`.
   - Executar `openEditScheduleModal(updatedSched.id)` simulando clique de usuário coordenador.
   - Definir nova data no campo `#scheduleDate` (ex: `'2026-10-25'`) e novo horário `#scheduleTime` (ex: `'10:00'`).
   - Disparar `saveNewSchedule()`.
   - **Asserção 1:** Verificar se `updatedSched.plannedDate === '2026-10-25'` e `updatedSched.date === '2026-10-25'`.
   - **Asserção 2:** Localizar a observação vinculada `simObs` em `appState.observations` e atestar que `simObs.date === '2026-10-25'`, `simObs.startDate === '2026-10-25'` e `simObs.endDate === '2026-10-25'`, comprovando a sincronização integral.
   - **Asserção 3:** Verificar se a linha correspondente na tabela da Agenda (`#scheduleTableBody`) e o card mobile exibem a nova data formatada (`25/10/2026`).
2. **Teste de Presença de Botão Editar em Visitas Realizadas:**
   - **Asserção:** Garantir que o HTML da tabela desktop contenha o botão "Editar" (`openEditScheduleModal`) mesmo quando a linha possuir o badge "Realizada".
3. **Teste de Exclusão Segura de Agendamento (`deleteSchedule`):**
   - Criar um novo agendamento temporário de teste via `openAddScheduleModal()` e `saveNewSchedule()`.
   - Validar sua inserção prévia em `appState.schedules`.
   - Disparar `deleteSchedule(tempSched.id)`.
   - **Asserção 1:** Confirmar que o agendamento foi expurgado com sucesso de `appState.schedules`.
   - **Asserção 2:** Validar que a tabela `#scheduleTableBody` foi re-renderizada sem o elemento removido.
   - **Asserção 3:** Se o agendamento possuía observação vinculada, comprovar que `obs.scheduleId` foi sanitizado para `null` e a observação permaneceu íntegra no histórico.
4. **Teste de Renderização do Botão de Exclusão no Modal:**
   - Ao invocar `openEditScheduleModal(id)`, validar que o botão de exclusão `#btnDeleteScheduleModal` esteja visível no DOM.
   - Ao invocar `openAddScheduleModal()`, validar que `#btnDeleteScheduleModal` esteja oculto (pois se trata de nova criação).

#### B. Alterações:
- Atualização do fluxo sequencial do módulo `agenda_cronograma` para encadear a edição de data e a exclusão após o teste de visualização da devolutiva, mantendo a integridade de todas as asserções anteriores.

#### C. Exclusões:
- Nenhuma exclusão de teste pré-existente; todas as 123 asserções vigentes serão rigorosamente preservadas, expandindo a cobertura total para 127+ asserções determinísticas.

---

## 5. Próximos Passos (Transição para a Etapa 2 - Operário)

1. Apresentar este plano estruturado ao usuário para validação e autorização de início.
2. Criar o ponto de restauração intermediário `intermediárias/aplicativo_v0.93_edicao_data_e_exclusao_agendamento.html`.
3. Executar as implementações pontuais no código do `index.html`.
4. Espelhar as alterações em `gestor supervisao_patos/firebase_deploy/public/index.html`.
5. Atualizar o Changelog duplo (versão 1.15 no `CHANGELOG.md` e no `#modalChangelog` do `index.html`).
6. Executar a auditoria automatizada: `python3 audit_platform.py --silent-on-success`.
7. Concluir o deploy no GitHub Pages via commit semântico.
