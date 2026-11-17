# PLANO DE IMPLEMENTAÇÃO: PILAR 17 - SUPORTE A DOCENTES MULTI-TURMA (DESBLOQUEIO DE DUPLA MATRÍCULA, REGIME DE DOBRA E CONTRATOS DUPLOS)

> **DIRETRIZ OBRIGATÓRIA DE EXECUÇÃO (ETAPA 2):**  
> O assistente executor (Etapa 2 - O Operário) deve **obrigatoriamente ler e seguir as diretrizes dos arquivos `WORKFLOW_MACOS.md`, `AGENTS.md` e a skill `execucao-operario`** antes de aplicar qualquer modificação no código. Nenhuma modificação deve ser realizada sem conformidade estrita com o workflow, incluindo:  
> 1. Execução prévia de sincronização com o repositório remoto (`git pull origin main`).  
> 2. Preservação integral das regras de negócio existentes, dados cadastrais SSOT, blindagens RBAC, série histórica, ciclo longitudinal, formulário único integral (Pilar 4), anotações em consistente (Pilar 16) e suíte determinística de auditoria.  
> 3. Verificação de integridade pós-edição com dupla checagem de leitura em cada trecho modificado.  
> 4. Validação sintática pré-voo obrigatória via JSC (`python3 audit_platform.py --check-syntax`).  
> 5. Salvamento obrigatório do backup intermediário na pasta `intermediárias/` sob o nome `aplicativo_v1.73_pilar_17_docentes_multiturma_dupla_matricula.html`.  
> 6. Gestão dupla de Changelog no arquivo `CHANGELOG.md` e no modal `#modalChangelog` / botão `.btn-changelog` do `index.html`, registrando a **Versão 1.73**.  
> 7. Sincronização idêntica entre o arquivo principal `index.html` da raiz, `gestor supervisao_patos/index.html` e `gestor supervisao_patos/firebase_deploy/public/index.html`.  
> 8. Checagem pré-push (`git fetch origin main`), commit semântico (`feat: implementar pilar 17 - desbloqueio de dupla matricula, dobra docente e consolidacao multi-turma`), push para `origin main` e deploy automático no GitHub Pages.  
> 9. Execução pós-deploy obrigatória do algoritmo de auditoria (`python3 audit_platform.py --silent-on-success`) com comunicação estrita a falhas.

---

## 1. Diagnóstico e Contexto Técnico-Pedagógico

### 1.1 Cenário Real do Magistério Municipal de Patos/PB
Na rede municipal de Educação Infantil de Patos/PB, o quadro docente apresenta uma configuração funcional comum nas redes públicas brasileiras, porém historicamente incompatível com sistemas que impõem modelagens unívocas estritas (1 docente = 1 turma).

Conforme deliberado na reunião oficial com a liderança pedagógica do programa SerTão Criança (Carolina Machado, reunião de 03/11/2026, marca temporal `[00:59:59]`):
> *"Ocorre sim! Temos professores que dão aula de manhã e de tarde. Concursados com duas matrículas, concursados que fazem 'dobra' de turno, e professores contratados com contrato duplo."*

Atualmente, na Educação Infantil de Patos, coexistem três regimes jurídicos e funcionais que geram multivinculação:
1. **Duas Matrículas Públicas de Concurso:** O profissional foi aprovado em dois concursos públicos distintos para o magistério municipal (ex: Matrícula A no Matutino e Matrícula B no Vespertino, na mesma Unidade Escolar ou em unidades distintas).
2. **Matrícula Efetiva com Regime de Dobra Remunerada:** O docente titular de uma turma matutina assume, mediante convocação administrativa e regime de dobra, a regência de outra turma no contraturno vespertino.
3. **Contratos Temporários com Lotação em Dois Turnos:** Professores contratados sob regime especial para suprir carências em turmas de turnos distintos.

### 1.2 O Gargalo do Código Atual (Trava Cega de Turno Único)
No arquivo `js/features/management.js` (linhas 1865–1880), a função `saveClassEditor()` continha uma trava cega de exclusividade que impedia qualquer docente alocado em uma turma parcial de ser associado a outra turma parcial da mesma unidade:

```javascript
// Código Atual em js/features/management.js:
if (finalShift !== 'Tempo Integral') {
  const currentYear = appState.selectedAcademicYear || '2026';
  const otherClasses = (appState.classes || []).filter(c => 
    c.id !== id && 
    (c.academicYear || '2026') === currentYear &&
    c.school === school &&
    c.shift !== 'Tempo Integral'
  );
  for (const tName of finalTeachers) {
    const conflictingCls = otherClasses.find(c => (c.teachers || []).includes(tName));
    if (conflictingCls) {
      showToast(`A docente "${tName}" já possui alocação na turma "${conflictingCls.name}". Não é permitida alocação dupla em turmas de tempo parcial.`);
      return;
    }
  }
}
```

**Problemas desta modelagem:**
1. **Bloqueio Indevido de Turnos Opostos:** Se a professora *Juliana Roberta Rocha* leciona em *Infantil II - Turma B* no turno Vespertino, a coordenadora era sumariamente bloqueada de atribuí-la à *Infantil I - Turma A* no turno Matutino, mesmo sendo turnos fisicamente desconexos.
2. **Falta de Inteligência Anti-Colisão:** A validação não comparava se o turno (`shift`) da turma em edição colidia temporalmente com o turno da turma pré-existente (`Tempo Parcial (Matutino)` vs. `Tempo Parcial (Vespertino)`).
3. **Cegueira na Ficha Individual do Docente (`indicators.js`):** Na aba de Indicadores (`#screenIndicators`), o filtro individual de docente executava `scopedObs.filter(o => o.teacherName === activeMemberFilter)` (linha 2159). Como as observações do Pilar 1 e 16 são centradas na Turma (`o.evaluatedType = 'turma'` e `o.teachers = [...]`), os relatórios de turmas onde o docente atua ficavam inacessíveis ou fragmentados, e a tela exibia apenas uma única turma estática (`selectedMember?.classAssigned`), ignorando a multivinculação.
4. **Semáforo Bimestral de Docentes:** O quadro semafórico de docentes regentes exibia uma única turma estática no subtítulo de identificação, ocultando da coordenação e da formadora a realidade de turmas múltiplas daquele profissional.

---

## 2. Arquitetura e Padrão Visual Hallmark

### 2.1 Princípios Arquiteturais do Pilar 17
1. **Desbloqueio Inteligente de Alocação Multi-Turma:** Um mesmo docente pode constar como regente em até 2 turmas regulares de turnos distintos (ex: Matutino + Vespertino) ou em regime compartilhado em turmas integrais.
2. **Validação Anti-Colisão Real (Mesmo Turno Proibido):** O sistema passa a validar a colisão pelo turno efetivo de funcionamento. Uma docente NÃO PODE ser alocada em duas turmas no **mesmo turno** (ex: duas turmas parciais matutinas, ou matutino de integral + matutino parcial).
3. **Visão Consolidada do Docente Multivinculado:**
   - Na **Tabela de Equipe** (`renderTeamScreen`), indicar as turmas atribuídas e destacar o status de `Dobra / Multi-Turma` com badge sóbrio.
   - No **Dossiê Longitudinal do Docente** (`#screenIndicators`), agregar e exibir todas as observações finalizadas de todas as turmas onde o educador atua, detalhando o desempenho consolidado na rede.
   - No **Semáforo de Docentes Regentes** (Quadro de Controle Bimestral), exibir todas as turmas vinculadas ao docente em formato tipográfico limpo.
   - Na **Ficha de Impressão PDF** (`exportTeacherLongitudinalPDF`), listar todas as turmas/turnos de atuação no cabeçalho institucional.

### 2.2 Padrão Hallmark UI (Design Sobriedade e Acessibilidade)
* **Tokens First:** Uso exclusivo das variáveis CSS corporativas (`var(--primary)`, `var(--primary-dark)`, `var(--surface)`, `var(--surface-subtle)`, `var(--border)`, `var(--text-primary)`, `var(--text-secondary)`, `var(--badge-accent-bg)`, `var(--badge-accent-ink)`). Zero cores hexadecimais literais soltas.
* **Erradicação de Emojis como Ícones:** Substituição completa de emojis por pictogramas vetoriais SVG monocromáticos limpos (Feather/Lucide style).
* **Tipografia e Rótulos:** Rótulos em *sentence case*, sem *all-caps* agressivo, sem tracking artificial forçado.
* **Badges Sóbrios e Silenciosos:** Emprego das classes canônicas `.badge-hallmark-accent` e `.badge-hallmark-neutral` para sinalizar dobra de turno, sem poluição visual.
* **Single-Surface Containment:** Apresentação em camada única plana, sem cartões aninhados (`card inside a card`).
* **Acessibilidade & Foco:** `:focus-visible` explícito e alvos de toque com área mínima de 44px.

---

## 3. Especificação de Implementação Passo a Passo (Snippets Exatos)

### 3.1 Módulo `js/features/management.js`: Algoritmo Anti-Colisão Inteligente

#### Localização: Função `saveClassEditor()` (linhas ~1860–1885)
Substituir a trava cega de turmas parciais pelo algoritmo de resolução de turno e verificação de colisão real:

```javascript
      // =========================================================================
      // PILAR 17: VALIDAÇÃO INTELIGENTE ANTI-COLISÃO DE TURNOS DOCENTES
      // Permite múltiplas matrículas, dobra e contratos duplos em turnos opostos.
      // Bloqueia unicamente a colisão no MESMO turno (ex: Matutino + Matutino).
      // =========================================================================
      const currentYear = appState.selectedAcademicYear || '2026';
      const otherClasses = (appState.classes || []).filter(c => 
        c.id !== id && 
        (c.academicYear || '2026') === currentYear
      );

      // Helper para identificar o turno normalizado de uma turma
      function getClassShifts(clsObj) {
        const s = (clsObj.shift || '').toLowerCase();
        if (s.includes('integral')) {
          return { isIntegral: true, morning: true, afternoon: true };
        }
        if (s.includes('vespertino') || s.includes('tarde')) {
          return { isIntegral: false, morning: false, afternoon: true };
        }
        return { isIntegral: false, morning: true, afternoon: false };
      }

      const targetShifts = getClassShifts({ shift: finalShift });

      // Validação para cada docente selecionado na turma em edição
      for (const tName of finalTeachers) {
        // Se a turma sendo salva possui turno matutino, verifica se a docente já leciona na manhã
        const isSelectedInMorning = targetShifts.isIntegral 
          ? (Array.isArray(finalMorning) && finalMorning.includes(tName))
          : targetShifts.morning;

        const isSelectedInAfternoon = targetShifts.isIntegral 
          ? (Array.isArray(finalAfternoon) && finalAfternoon.includes(tName))
          : targetShifts.afternoon;

        for (const oc of otherClasses) {
          const ocShifts = getClassShifts(oc);
          const inOcMorning = ocShifts.isIntegral 
            ? (Array.isArray(oc.teachersMorning) && oc.teachersMorning.includes(tName))
            : (ocShifts.morning && Array.isArray(oc.teachers) && oc.teachers.includes(tName));

          const inOcAfternoon = ocShifts.isIntegral 
            ? (Array.isArray(oc.teachersAfternoon) && oc.teachersAfternoon.includes(tName))
            : (ocShifts.afternoon && Array.isArray(oc.teachers) && oc.teachers.includes(tName));

          if (isSelectedInMorning && inOcMorning) {
            showToast(`Colisão de horário: A docente "${tName}" já está alocada no turno Matutino na turma "${oc.name}" (${oc.school}). Não é permitida alocação simultânea no mesmo turno.`);
            return;
          }

          if (isSelectedInAfternoon && inOcAfternoon) {
            showToast(`Colisão de horário: A docente "${tName}" já está alocada no turno Vespertino na turma "${oc.name}" (${oc.school}). Não é permitida alocação simultânea no mesmo turno.`);
            return;
          }
        }
      }
```

---

### 3.2 Módulo `js/features/management.js`: Exibição de Multi-Turma na Aba de Equipe

#### Localização: Função `renderTeamScreen()` (linhas ~2080–2110)
Ajustar a renderização da linha do docente na tabela de equipe para listar suas turmas ativas e destacar a insígnia de multi-turma/dobra:

```javascript
        // PILAR 17: Resolução de turmas atribuídas e regime de dobra do docente
        let classesDisplay = '';
        if (m.roleKey === 'professora') {
          const activeYear = appState.selectedAcademicYear || '2026';
          const assignedClasses = (appState.classes || []).filter(c => 
            (c.academicYear || '2026') === activeYear &&
            (
              (Array.isArray(c.teachers) && c.teachers.includes(m.name)) ||
              (Array.isArray(c.teachersMorning) && c.teachersMorning.includes(m.name)) ||
              (Array.isArray(c.teachersAfternoon) && c.teachersAfternoon.includes(m.name))
            )
          );

          if (assignedClasses.length > 1) {
            const classLabels = assignedClasses.map(c => {
              const shiftShort = (c.shift || '').toLowerCase().includes('vespertino') ? 'Tarde' : 'Manhã';
              return `${c.name} (${shiftShort})`;
            }).join(' · ');
            classesDisplay = `
              <div style="margin-top:3px; font-size:11px; color:var(--text-secondary); line-height:1.3;">
                <span class="badge-hallmark-accent" style="margin-right:4px;">Dobra de Turno</span>
                <span>${classLabels}</span>
              </div>
            `;
          } else if (assignedClasses.length === 1) {
            const c = assignedClasses[0];
            const shiftShort = (c.shift || '').toLowerCase().includes('vespertino') ? 'Tarde' : 'Manhã';
            classesDisplay = `
              <div style="margin-top:2px; font-size:11px; color:var(--text-secondary);">
                <span>${c.name} (${shiftShort})</span>
              </div>
            `;
          } else {
            classesDisplay = `
              <div style="margin-top:2px; font-size:11px; color:var(--text-secondary); font-style:italic;">
                Sem turma vinculada
              </div>
            `;
          }
        }
```

E no template HTML da célula:
```javascript
        tr.innerHTML = `
          <td data-label="Nome do Servidor">
            <strong>${m.name}</strong>${emailSubtitle}${classesDisplay}
          </td>
          <td data-label="Cargo / Função"><span style="font-size:12px; font-weight:700; color:var(--primary);">${m.roleTitle}</span></td>
          <td data-label="Unidade de Lotação">${m.school || 'Rede Municipal'}</td>
          <td data-label="Polo Vinculado"><span class="badge-hallmark-neutral">${poloName}</span></td>
          <td data-label="Superior / Vinculação">${supervisorDisplay}</td>
          <td data-label="Ações" style="text-align:center;">
            <button class="btn btn-secondary" style="color:var(--primary); padding:4px 8px; font-size:11px;" onclick="openEditMemberModal('${m.id}')">
              Editar
            </button>
          </td>
        `;
```

---

### 3.3 Módulo `js/features/indicators.js`: Agregação Multi-Turma no Dossiê Individual

#### Localização: Função `renderIndicatorsScreen()` (linhas ~2150–2180)
Substituir o filtro estrito `o.teacherName === activeMemberFilter` pela agregação completa multiturma do docente:

```javascript
      // =========================================================================
      // CASO B: PROFESSOR ESPECÍFICO SELECIONADO (VISÃO LONGITUDINAL ITEM A ITEM)
      // PILAR 17: Agregação Completa das Observações de Docentes Multi-Turma
      // =========================================================================
      if (activeMemberFilter !== 'ALL') {
        const selectedMember = scopedAvaliandos.find(m => m.name === activeMemberFilter) || 
                               (appState.teamMembers || []).find(m => m.name === activeMemberFilter);
        
        // PILAR 17: Captura observações onde a docente atuou, seja titular, regente compartilhada ou dobrada
        const memberObs = scopedObs.filter(o => 
          o.teacherName === activeMemberFilter ||
          (Array.isArray(o.teachers) && o.teachers.includes(activeMemberFilter)) ||
          (Array.isArray(o.teachersMorning) && o.teachersMorning.includes(activeMemberFilter)) ||
          (Array.isArray(o.teachersAfternoon) && o.teachersAfternoon.includes(activeMemberFilter)) ||
          (o.teacherSynthesis && Object.prototype.hasOwnProperty.call(o.teacherSynthesis, activeMemberFilter))
        );
        memberObs.sort((a, b) => (a.date || '').localeCompare(b.date || ''));

        // PILAR 17: Mapeamento de todas as turmas ativas da docente
        const activeYear = appState.selectedAcademicYear || '2026';
        const teacherClasses = (appState.classes || []).filter(c => 
          (c.academicYear || '2026') === activeYear &&
          (
            (Array.isArray(c.teachers) && c.teachers.includes(activeMemberFilter)) ||
            (Array.isArray(c.teachersMorning) && c.teachersMorning.includes(activeMemberFilter)) ||
            (Array.isArray(c.teachersAfternoon) && c.teachersAfternoon.includes(activeMemberFilter))
          )
        );

        let memberClassDisplay = 'Educação Infantil';
        if (teacherClasses.length > 1) {
          memberClassDisplay = teacherClasses.map(c => {
            const shiftShort = (c.shift || '').toLowerCase().includes('vespertino') ? 'Tarde' : 'Manhã';
            return `${c.name} (${shiftShort})`;
          }).join(' · ');
        } else if (teacherClasses.length === 1) {
          const c = teacherClasses[0];
          const shiftShort = (c.shift || '').toLowerCase().includes('vespertino') ? 'Tarde' : 'Manhã';
          memberClassDisplay = `${c.name} (${shiftShort})`;
        } else {
          memberClassDisplay = selectedMember?.classAssigned || (memberObs[0]?.className) || 'Educação Infantil';
        }

        const memberSchool = selectedMember?.school || (memberObs[0]?.schoolName) || 'Não informada';
        const memberRole = selectedMember?.roleTitle || (targetType === 'coordenador' ? 'Coordenação Pedagógica' : 'Professor(a) de Educação Infantil');
```

E no cabeçalho visual do Dossiê Individual (linhas ~2280–2300):
```javascript
            <h2 style="font-size:22px; font-weight:800; color:var(--text-primary); margin:6px 0 4px 0;">
              ${activeMemberFilter}
            </h2>
            <div style="font-size:13px; color:var(--text-secondary); line-height:1.6;">
              <strong>Unidade:</strong> ${memberSchool} &nbsp;|&nbsp; 
              <strong>Turmas / Regência:</strong> ${memberClassDisplay} ${teacherClasses.length > 1 ? '<span class="badge-hallmark-accent" style="margin-left:4px;">Dobra de Turno</span>' : ''} &nbsp;|&nbsp; 
              <strong>Supervisor(a):</strong> ${memberSupervisor}
            </div>
```

---

### 3.4 Módulo `js/features/indicators.js`: Exibição Consolidada no Semáforo de Docentes

#### Localização: Linha ~4235 em `renderIndicatorsScreen()`
Na renderização da linha de cada docente na tabela semafórica do Quadro de Controle Bimestral:

```javascript
            // PILAR 17: Localização dinâmica de todas as turmas da docente
            const activeYear = appState.selectedAcademicYear || '2026';
            const memberClasses = (appState.classes || []).filter(c => 
              (c.academicYear || '2026') === activeYear &&
              (
                (Array.isArray(c.teachers) && c.teachers.includes(member.name)) ||
                (Array.isArray(c.teachersMorning) && c.teachersMorning.includes(member.name)) ||
                (Array.isArray(c.teachersAfternoon) && c.teachersAfternoon.includes(member.name))
              )
            );

            let classesSummaryHtml = member.classAssigned || 'Turma Regente';
            if (memberClasses.length > 1) {
              const formattedList = memberClasses.map(c => {
                const shiftShort = (c.shift || '').toLowerCase().includes('vespertino') ? 'Tarde' : 'Manhã';
                return `${c.name} (${shiftShort})`;
              }).join(' · ');
              classesSummaryHtml = `<span style="font-weight:700; color:var(--primary);">${formattedList}</span> <span class="badge-hallmark-accent" style="font-size:10px; padding:1px 5px;">Dobra</span>`;
            } else if (memberClasses.length === 1) {
              const c = memberClasses[0];
              const shiftShort = (c.shift || '').toLowerCase().includes('vespertino') ? 'Tarde' : 'Manhã';
              classesSummaryHtml = `<span style="font-weight:700; color:var(--primary);">${c.name} (${shiftShort})</span>`;
            }

            teacherTableRows += `
              <tr>
                <td>
                  <strong style="color:var(--text-primary); font-size:13px;">${member.name}</strong>
                  <div style="font-size:11px; color:var(--text-secondary); margin-top:2px;">
                    ${classesSummaryHtml} · ${memberSchool}
                  </div>
                </td>
                ${bimesterCellsHtml}
                <td>${cycleProgressHtml}</td>
                <td style="text-align:center; white-space:nowrap;">
                  <div style="display:flex; gap:6px; justify-content:center;">
                    <button type="button" class="btn btn-secondary btn-action-sem" style="font-size:11px; padding:5px 9px; display:inline-flex; align-items:center; gap:4px;" onclick="quickScheduleForClass('${(memberClasses[0] ? memberClasses[0].name : targetClass).replace(/'/g, "\\'")}', '${memberSchool.replace(/'/g, "\\'")}', '${nextBim}')" title="Agendar observação para a turma desta docente">
                      <svg class="btn-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      <span>Agendar</span>
                    </button>
                  </div>
                </td>
              </tr>
            `;
```

---

### 3.5 Módulo `js/features/indicators.js`: Ficha de Impressão PDF Longitudinal Individual

#### Localização: Função `exportTeacherLongitudinalPDF()` (linhas ~4360–4415)
Atualizar a captura de dados e cabeçalho na geração da ficha individual impressa em PDF:

```javascript
      // PILAR 17: Mapeamento de todas as turmas para cabeçalho da Ficha Individual
      const activeYear = (appState && appState.selectedAcademicYear) || '2026';
      const teacherClasses = (appState.classes || []).filter(c => 
        (c.academicYear || '2026') === activeYear &&
        (
          (Array.isArray(c.teachers) && c.teachers.includes(teacherName)) ||
          (Array.isArray(c.teachersMorning) && c.teachersMorning.includes(teacherName)) ||
          (Array.isArray(c.teachersAfternoon) && c.teachersAfternoon.includes(teacherName))
        )
      );

      let memberClass = 'Educação Infantil';
      if (teacherClasses.length > 1) {
        memberClass = teacherClasses.map(c => `${c.name} (${c.shift || 'Parcial'})`).join(' | ');
      } else if (teacherClasses.length === 1) {
        memberClass = `${teacherClasses[0].name} (${teacherClasses[0].shift || 'Parcial'})`;
      } else {
        memberClass = member.classAssigned || (memberObs[0]?.className) || 'Educação Infantil';
      }
```

---

## 4. Critérios de Aceite e Roteiro de Teste

| # | Cenário de Teste | Ação Executada | Resultado Esperado |
| :---: | :--- | :--- | :--- |
| **CA-01** | **Alocação em Turnos Opostos (Matutino + Vespertino)** | Vincular a docente *Juliana Roberta Rocha* à turma *Infantil I - Turma A* (Matutino) enquanto ela já leciona em *Infantil II - Turma B* (Vespertino). | O sistema salva a turma com sucesso, sem emitir alerta impeditivo, cadastrando a docente nas duas turmas. |
| **CA-02** | **Bloqueio Anti-Colisão Real (Mesmo Turno)** | Tentar vincular a docente *Ana Carolina Silva* à turma *Berçário II - Turma Única* (ambas Matutinas). | O sistema bloqueia a gravação e emite o toast: `"Colisão de horário: A docente 'Ana Carolina Silva' já está alocada no turno Matutino na turma 'Infantil I - Turma A' (...)."` |
| **CA-03** | **Visualização de Dobra na Gestão de Equipe** | Acessar a aba "Equipe" na tela de Gestão Escolar com a docente alocada em duas turmas. | A linha da docente exibe o badge sóbrio `Dobra de Turno` e lista as duas turmas com indicação de turno (Manhã / Tarde). |
| **CA-04** | **Agregação no Dossiê Individual do Docente** | Na aba de Indicadores, selecionar a docente multi-turma no filtro individual. | O cabeçalho exibe as duas turmas e o badge `Dobra de Turno`. As observações de ambas as turmas são agregadas no cálculo de desempenho pedagógico. |
| **CA-05** | **Identificação Clara no Semáforo Docente** | Alternar o Quadro de Controle Bimestral para a visão de "Docentes Regentes". | A coluna de identificação do docente lista todas as turmas em que o educador atua, sem truncamento indevido. |
| **CA-06** | **Ficha de Impressão PDF Consolidada** | Clicar em "Exportar PDF" com a docente multi-turma selecionada. | O cabeçalho da ficha impressa lista ambas as turmas e turnos de atuação na rede. |

---

## 5. Seção Obrigatória de Auditoria (`audit_platform.py` e `audit_engine.js`)

### 5.1 Alterações no Algoritmo de Auditoria (`js/audit/audit_engine.js`)
* **Linhas 587–596 (Módulo 2 - `catalogo_dados`):**  
  - *Comportamento anterior:* O teste exigia estritamente que *Ana Carolina Silva* possuísse apenas 1 turma em `INITIAL_CLASSES` (`anaClasses.length !== 1`), o que testava uma premissa de turno único rígido.  
  - *Ajuste pontual:* Preservar a integridade inicial de *Ana Carolina Silva* em `INITIAL_CLASSES`, porém atualizar o bloco de validação para testar ativamente a nova regra de negócio do Pilar 17:
    1. Executar teste sintético de alocação de uma docente em turma de turno oposto (autorizado).
    2. Executar teste sintético de colisão no mesmo turno (rejeitado com toast).

### 5.2 Novas Asserções no Módulo 2 (`catalogo_dados`)
Adicionar teste automatizado determinístico:
```javascript
// Teste de Conformidade do Pilar 17: Suporte a Múltiplas Matrículas e Validação Anti-Colisão
const testTeacher = 'Juliana Roberta Rocha'; // Já leciona em Infantil II - Turma B (Vespertino)
const mockMorningClass = {
  id: 'cls-test-morning',
  name: 'Turma Teste Matutina',
  school: 'CEI Professora Maria de Lourdes',
  stage: 'Infantil I',
  shift: 'Tempo Parcial (Matutino)',
  teachers: [testTeacher],
  totalStudents: 20,
  inclusiveStudents: 0
};

// Deve permitir alocação em turno matutino para professora vespertina
// Deve bloquear alocação se tentar vincular professora matutina em outra matutina
```

### 5.3 Novas Asserções no Módulo 10 (`indicadores_decisao`)
Validar que a função `calculateTeacherBimesterStatus` e a listagem semafórica reconhecem docentes com múltiplos vínculos sem quebra de layout ou exceções de runtime.

---

## 6. Checklist de Finalização da Etapa 1
- [x] Sincronização inicial executada (`git pull origin main`).
- [x] Investigação profunda de código concluída sem modificação em código de produção.
- [x] Árvore de trabalho do Git (`git status`) mantida 100% limpa de alterações em código de produção.
- [x] Documento do plano estruturado e salvo em `./planos_de_implementacao/plano_pilar_17_docentes_multiturma_dupla_matricula.md`.
- [x] Seção obrigatória de auditoria e conformidade ao Hallmark UI detalhadas.
- [ ] **Aguardando autorização expressa do usuário para início da Etapa 2 (O Operário).**
