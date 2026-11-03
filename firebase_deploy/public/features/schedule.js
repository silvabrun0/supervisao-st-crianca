    // --- 9. LONGITUDINAL SCHEDULE LOGIC ---
    let editingScheduleId = null;

    // --- Funções Auxiliares de Datas e Agendamentos para a Agenda ---
    function getDayOfWeekName(dateStr) {
      if (!dateStr) return '';
      const parts = dateStr.split('-');
      if (parts.length !== 3) return '';
      const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
      return days[d.getDay()] || '';
    }

    function getVisitTimingBadgeHtml(dateStr) {
      const todayStr = getTodayDateString();
      if (!dateStr) return '';
      if (dateStr === todayStr) {
        return '<span class="next-visit-timing-badge today">HOJE</span>';
      }
      const partsT = todayStr.split('-').map(Number);
      const partsD = dateStr.split('-').map(Number);
      const dtToday = new Date(partsT[0], partsT[1] - 1, partsT[2]);
      const dtVisit = new Date(partsD[0], partsD[1] - 1, partsD[2]);
      const diffDays = Math.round((dtVisit - dtToday) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        return '<span class="next-visit-timing-badge tomorrow">AMANHÃ</span>';
      } else if (diffDays > 1) {
        return `<span class="next-visit-timing-badge upcoming">EM ${diffDays} DIAS</span>`;
      } else {
        return '<span class="next-visit-timing-badge overdue">EM ATRASO</span>';
      }
    }

    function getNextActionableSchedule(filterBimester) {
      const user = getCurrentUser();
      let candidates = [];
      
      if (typeof getActionablePendingSchedules === 'function') {
        candidates = getActionablePendingSchedules();
      }
      
      if (!candidates || candidates.length === 0) {
        const scoped = typeof getScopedSchedules === 'function' ? getScopedSchedules() : [];
        candidates = scoped.filter(s => {
          if (s.archived || s.status === 'realizado') return false;
          if (typeof findObservationForSchedule === 'function') {
            const obs = findObservationForSchedule(s);
            if (obs && (obs.status === 'finalized' || obs.status === 'concluida')) return false;
          }
          return true;
        });
      }

      // Aplica filtro contextual de bimestre caso especificado
      if (filterBimester && filterBimester !== 'ALL') {
        candidates = candidates.filter(s => s.bimester === filterBimester);
      }

      if (!candidates || candidates.length === 0) return null;

      const todayStr = getTodayDateString();

      const sorted = [...candidates].sort((a, b) => {
        const dtA = (a.plannedDate || '9999-99-99') + ' ' + (a.plannedTime || '00:00');
        const dtB = (b.plannedDate || '9999-99-99') + ' ' + (b.plannedTime || '00:00');
        return dtA.localeCompare(dtB);
      });

      const upcoming = sorted.filter(s => (s.plannedDate || '') >= todayStr);
      if (upcoming.length > 0) return upcoming[0];

      return sorted[0];
    }

    // --- HELPER: LOCALIZAÇÃO DETERMINÍSTICA E RESILIENTE DA OBSERVAÇÃO DE UM AGENDAMENTO ---
    function findObservationForSchedule(sched) {
      if (!sched || !appState.observations || appState.observations.length === 0) return null;

      // 1. Busca direta por observationId gravado no próprio agendamento
      if (sched.observationId) {
        const obsDirect = appState.observations.find(o => o.id === sched.observationId);
        if (obsDirect) return obsDirect;
      }

      // 2. Busca direta por scheduleId gravado na observação (priorizando finalizadas)
      const obsBySchedId = appState.observations.find(o => o.scheduleId === sched.id && (o.status === 'finalized' || o.status === 'concluida'));
      if (obsBySchedId) return obsBySchedId;

      // 3. Busca heurística resiliente por metadados do agendamento em observações finalizadas
      const obsByMeta = appState.observations.find(o => {
        if (o.status !== 'finalized' && o.status !== 'concluida') return false;
        if (sched.schoolName && o.schoolName !== sched.schoolName) return false;
        if (sched.bimester && o.bimester !== sched.bimester) return false;

        const classMatch = !!(sched.className && o.className && sched.className === o.className);
        const targetMatch = !!(sched.targetName && (
          o.teacherName === sched.targetName ||
          (Array.isArray(o.teachers) && o.teachers.includes(sched.targetName)) ||
          (typeof resolveCanonicalUserName === 'function' && resolveCanonicalUserName(o.teacherName) === resolveCanonicalUserName(sched.targetName))
        ));

        return classMatch || targetMatch;
      });
      if (obsByMeta) return obsByMeta;

      // 4. Fallback final: qualquer observação vinculada ao scheduleId (mesmo rascunho)
      return appState.observations.find(o => o.scheduleId === sched.id) || null;
    }

    // --- AÇÃO: VISUALIZAR DEVOLUTIVA DA OBSERVAÇÃO A PARTIR DA AGENDA ---
    function viewFeedbackFromSchedule(scheduleId) {
      const sched = (appState.schedules || []).find(s => s.id === scheduleId);
      if (!sched) {
        showToast('Agendamento não localizado.');
        return;
      }

      const obs = findObservationForSchedule(sched);
      if (!obs) {
        showToast('Nenhuma observação finalizada foi localizada para este agendamento.');
        return;
      }

      // Registra a tela de origem para retorno contextual
      appState.returnTab = 'schedule';

      // Abre a observação finalizada em modo somente leitura (Devolutiva Oficial)
      resumeObservation(obs.id, true);
    }

    // --- AÇÃO: RETORNO CONTEXTUAL DO MODO SOMENTE LEITURA ---
    function exitReadOnlyMode() {
      const targetTab = appState.returnTab || 'schedule';
      navigateToTab(targetTab);
    }

    function renderScheduleScreen() {
      const user = getCurrentUser();
      const tbody = document.getElementById('scheduleTableBody');
      const cardsContainer = document.getElementById('scheduleCardsContainer');
      const highlightContainer = document.getElementById('nextScheduleHighlightContainer');
      const filterBim = document.getElementById('scheduleFilterBimester') ? document.getElementById('scheduleFilterBimester').value : 'ALL';
      const filterStatus = document.getElementById('scheduleFilterStatus') ? document.getElementById('scheduleFilterStatus').value : 'active';
      
      if (tbody) tbody.innerHTML = '';
      if (cardsContainer) cardsContainer.innerHTML = '';

      // 1. Identificação e Renderização do Card de Próxima Observação (em sintonia com o filtro de bimestre)
      const nextVisit = getNextActionableSchedule(filterBim);

      if (highlightContainer) {
        if (nextVisit && filterStatus !== 'archived') {
          const timingBadge = getVisitTimingBadgeHtml(nextVisit.plannedDate);
          const weekday = getDayOfWeekName(nextVisit.plannedDate);
          const formattedDate = typeof formatDateBR === 'function' ? formatDateBR(nextVisit.plannedDate) : nextVisit.plannedDate;
          
          const targetMember = (appState.teamMembers || []).find(m => m.name === nextVisit.targetName || resolveCanonicalUserName(m.name) === resolveCanonicalUserName(nextVisit.targetName));
          const isTargetTeacher = targetMember ? (targetMember.roleKey === 'professora') : true;

          const isNextClass = nextVisit.targetType === 'turma' || user.roleKey === 'coordenador';
          const nextTitle = isNextClass ? `📚 ${nextVisit.className || nextVisit.targetName}` : `👤 ${nextVisit.targetName}`;
          const nextTeachersArr = Array.isArray(nextVisit.teachers) && nextVisit.teachers.length > 0 
            ? nextVisit.teachers 
            : (nextVisit.targetName && nextVisit.targetName !== nextVisit.className ? [nextVisit.targetName] : []);
          const nextSub = isNextClass 
            ? (nextTeachersArr.length > 0 ? `👩‍🏫 Regência: ${nextTeachersArr.join(', ')}` : '<span style="color:#DC2626; font-style:italic;">⚠️ Sem regente atribuída</span>')
            : (nextVisit.className || 'Coordenação Pedagógica');

          const canStartVisit = (user.roleKey === 'coordenador' && isTargetTeacher && nextVisit.schoolName === user.school) ||
                                (user.roleKey === 'formador' && !isTargetTeacher);

          const canEditSchedule = (user.roleKey === 'coordenador' && isTargetTeacher && nextVisit.schoolName === user.school) ||
                                  (user.roleKey === 'formador' && !isTargetTeacher) ||
                                  isNucleoEI(user);

          highlightContainer.innerHTML = `
            <div class="next-visit-hero-card">
              <div class="next-visit-hero-header">
                <div class="next-visit-title-badge">
                  Próxima observação
                </div>
                <div>${timingBadge}</div>
              </div>

              <div class="next-visit-hero-body">
                <div>
                  <h3 class="next-visit-target-name">${nextTitle}</h3>
                  <div class="next-visit-target-sub">
                    <span style="font-weight:700; color:var(--primary);">${nextSub}</span>
                    <span>·</span>
                    <span class="schedule-bimester-tag">${nextVisit.bimester}</span>
                  </div>
                  <div class="next-visit-school-row">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M3 7v14M21 7v14M6 7l6-4 6 4M10 11v2M14 11v2M10 16v2M14 16v2"/></svg>
                    <span>${nextVisit.schoolName}</span>
                  </div>
                </div>

                <div class="next-visit-meta-card">
                  <div class="next-visit-date-highlight">${formattedDate} às ${nextVisit.plannedTime || '08:00'}</div>
                  <div class="next-visit-weekday-label">${weekday || 'Data planejada'}</div>
                </div>
              </div>

              <div class="next-visit-actions-bar">
                ${canEditSchedule ? `
                  <button class="btn btn-secondary" style="padding:8px 14px; font-size:12px;" onclick="openEditScheduleModal('${nextVisit.id}')">
                    Editar Agendamento
                  </button>
                ` : ''}
                ${canStartVisit ? `
                  <button class="btn btn-primary" style="padding:8px 18px; font-size:13px; font-weight:700;" onclick="openSetupScreenFromSchedule('${nextVisit.id}')">
                    Iniciar Observação →
                  </button>
                ` : ''}
              </div>
            </div>
          `;
        } else {
          highlightContainer.innerHTML = '';
        }
      }

      // 2. Filtragem e Ordenação da Listagem Geral
      let schedules = getScopedSchedules();
      if (filterBim !== 'ALL') {
        schedules = schedules.filter(s => s.bimester === filterBim);
      }

      if (filterStatus === 'active') {
        schedules = schedules.filter(s => !s.archived);
      } else if (filterStatus === 'archived') {
        schedules = schedules.filter(s => s.archived === true);
      }

      // Ordenação cronológica por data e hora
      schedules.sort((a, b) => {
        const dtA = (a.plannedDate || '9999-99-99') + ' ' + (a.plannedTime || '00:00');
        const dtB = (b.plannedDate || '9999-99-99') + ' ' + (b.plannedTime || '00:00');
        return dtA.localeCompare(dtB);
      });

      if (schedules.length === 0) {
        if (tbody) {
          tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:var(--text-secondary); padding:24px;">Nenhuma observação encontrada para os filtros selecionados.</td></tr>`;
        }
        if (cardsContainer) {
          cardsContainer.innerHTML = `
            <div class="schedule-empty-state">
              <div style="font-size:14px; font-weight:700; color:var(--text-primary);">Nenhuma observação encontrada</div>
              <div style="font-size:12px; color:var(--text-secondary); margin-top:4px;">Ajuste os filtros de bimestre ou status para visualizar os agendamentos.</div>
            </div>`;
        }
        return;
      }

      schedules.forEach(s => {
        const isThisNextVisit = nextVisit && s.id === nextVisit.id && !s.archived && s.status !== 'realizado';
        let badgeClass = 'planned';
        let badgeText = 'Planejada';
        let borderClass = 'status-border-planned';

        if (s.archived) {
          badgeClass = 'archived';
          badgeText = 'Arquivada';
          borderClass = 'status-border-archived';
        } else if (s.status === 'realizado') {
          badgeClass = 'concluded';
          badgeText = 'Realizada';
          borderClass = 'status-border-concluded';
        } else if (s.status === 'atrasado') {
          badgeClass = 'delayed';
          badgeText = 'Em Atraso';
          borderClass = 'status-border-delayed';
        }

        let actionHtml = '';
        let cardActionHtml = '';

        const linkedObs = findObservationForSchedule(s);
        const hasFeedback = !!linkedObs;

        const targetMember = (appState.teamMembers || []).find(m => m.name === s.targetName || resolveCanonicalUserName(m.name) === resolveCanonicalUserName(s.targetName));
        const isTargetTeacher = targetMember ? (targetMember.roleKey === 'professora') : true;

        const canStartVisit = (user.roleKey === 'coordenador' && isTargetTeacher && s.schoolName === user.school) ||
                              (user.roleKey === 'formador' && !isTargetTeacher);

        const canEditSchedule = (user.roleKey === 'coordenador' && isTargetTeacher && s.schoolName === user.school) ||
                                (user.roleKey === 'formador' && !isTargetTeacher) ||
                                isNucleoEI(user);

        if (s.archived) {
          actionHtml = `
            <div style="display:flex; gap:6px; justify-content:center; align-items:center; flex-wrap:wrap;">
              ${hasFeedback ? `
                <button class="btn btn-primary" style="padding:4px 8px; font-size:11px; display:inline-flex; align-items:center; gap:4px;" onclick="viewFeedbackFromSchedule('${s.id}')" title="Visualizar Devolutiva Pedagógica da Observação">
                  📋 Devolutiva
                </button>
              ` : ''}
              ${canEditSchedule ? `
                <button class="btn btn-secondary" style="padding:4px 8px; font-size:11px;" onclick="openEditScheduleModal('${s.id}')" title="Editar Agendamento">
                  ✏️ Editar
                </button>
                <button class="btn btn-secondary" style="padding:4px 8px; font-size:11px; color:var(--red); border-color:var(--red);" onclick="confirmDeleteSchedule('${s.id}')" title="Excluir Agendamento do Cronograma">
                  🗑️ Excluir
                </button>
              ` : ''}
              <button class="btn btn-secondary" style="padding:4px 8px; font-size:11px;" onclick="unarchiveSchedule('${s.id}')" title="Desarquivar observação">
                Desarquivar
              </button>
            </div>
          `;
          cardActionHtml = `
            <div style="display:flex; gap:8px; width:100%; align-items:center; flex-wrap:wrap;">
              <span style="font-size:11px; color:var(--text-secondary); font-weight:600; margin-right:auto;">Observação Arquivada</span>
              <button class="btn btn-secondary" style="padding:7px 12px; font-size:12px; flex:1;" onclick="unarchiveSchedule('${s.id}')">
                Desarquivar
              </button>
              ${canEditSchedule ? `
                <button class="btn btn-secondary" style="padding:7px 12px; font-size:12px; flex:1;" onclick="openEditScheduleModal('${s.id}')">
                  ✏️ Editar
                </button>
                <button class="btn btn-secondary" style="padding:7px 12px; font-size:12px; flex:1; color:var(--red); border-color:var(--red);" onclick="confirmDeleteSchedule('${s.id}')">
                  🗑️ Excluir
                </button>
              ` : ''}
              ${hasFeedback ? `
                <button class="btn btn-primary" style="padding:7px 12px; font-size:12px; font-weight:700; flex:1.4; display:inline-flex; align-items:center; justify-content:center; gap:5px;" onclick="viewFeedbackFromSchedule('${s.id}')">
                  📋 Ver Devolutiva
                </button>
              ` : ''}
            </div>
          `;
        } else if (s.status === 'realizado') {
          actionHtml = `
            <div style="display:flex; gap:6px; justify-content:center; align-items:center; flex-wrap:wrap;">
              <button class="btn btn-primary" style="padding:4px 8px; font-size:11px; display:inline-flex; align-items:center; gap:4px;" onclick="viewFeedbackFromSchedule('${s.id}')" title="Visualizar Devolutiva Pedagógica da Observação">
                📋 Devolutiva
              </button>
              ${canEditSchedule ? `
                <button class="btn btn-secondary" style="padding:4px 8px; font-size:11px;" onclick="openEditScheduleModal('${s.id}')" title="Editar Agendamento">
                  ✏️ Editar
                </button>
                <button class="btn btn-secondary" style="padding:4px 8px; font-size:11px; color:var(--red); border-color:var(--red);" onclick="confirmDeleteSchedule('${s.id}')" title="Excluir Agendamento do Cronograma">
                  🗑️ Excluir
                </button>
              ` : ''}
              <button class="btn btn-secondary" style="padding:4px 8px; font-size:11px;" onclick="archiveSchedule('${s.id}')" title="Arquivar esta observação realizada">
                Arquivar
              </button>
            </div>
          `;
          cardActionHtml = `
            <div style="display:flex; gap:8px; width:100%; align-items:center; flex-wrap:wrap;">
              ${canEditSchedule ? `
                <button class="btn btn-secondary" style="padding:7px 12px; font-size:12px; flex:1;" onclick="openEditScheduleModal('${s.id}')">
                  ✏️ Editar
                </button>
                <button class="btn btn-secondary" style="padding:7px 12px; font-size:12px; flex:1; color:var(--red); border-color:var(--red);" onclick="confirmDeleteSchedule('${s.id}')">
                  🗑️ Excluir
                </button>
              ` : ''}
              <button class="btn btn-secondary" style="padding:7px 12px; font-size:12px; flex:1;" onclick="archiveSchedule('${s.id}')">
                Arquivar
              </button>
              <button class="btn btn-primary" style="padding:7px 12px; font-size:12px; font-weight:700; flex:1.4; display:inline-flex; align-items:center; justify-content:center; gap:5px;" onclick="viewFeedbackFromSchedule('${s.id}')">
                📋 Ver Devolutiva
              </button>
            </div>
          `;
        } else {
          if (canStartVisit) {
            actionHtml = `
              <div style="display:flex; gap:6px; justify-content:center; align-items:center; flex-wrap:wrap;">
                <button class="btn btn-primary" style="padding:5px 10px; font-size:11px;" onclick="openSetupScreenFromSchedule('${s.id}')">
                  Iniciar Observação →
                </button>
                ${canEditSchedule ? `
                  <button class="btn btn-secondary" style="padding:5px 10px; font-size:11px;" onclick="openEditScheduleModal('${s.id}')" title="Editar Agendamento">
                    ✏️ Editar
                  </button>
                  <button class="btn btn-secondary" style="padding:5px 10px; font-size:11px; color:var(--red); border-color:var(--red);" onclick="confirmDeleteSchedule('${s.id}')" title="Excluir Agendamento do Cronograma">
                    🗑️ Excluir
                  </button>
                ` : ''}
              </div>
            `;
            cardActionHtml = `
              <div style="display:flex; gap:8px; width:100%; align-items:center; flex-wrap:wrap;">
                ${canEditSchedule ? `
                  <button class="btn btn-secondary" style="padding:8px 12px; font-size:12px; flex:1;" onclick="openEditScheduleModal('${s.id}')">
                    ✏️ Editar
                  </button>
                  <button class="btn btn-secondary" style="padding:8px 12px; font-size:12px; flex:1; color:var(--red); border-color:var(--red);" onclick="confirmDeleteSchedule('${s.id}')">
                    🗑️ Excluir
                  </button>
                ` : ''}
                <button class="btn btn-primary" style="padding:8px 14px; font-size:12px; font-weight:700; flex:1.4;" onclick="openSetupScreenFromSchedule('${s.id}')">
                  Iniciar Observação →
                </button>
              </div>
            `;
          } else {
            actionHtml = `
              <div style="display:flex; gap:6px; justify-content:center; align-items:center; flex-wrap:wrap;">
                <span style="font-size:11px; color:var(--text-secondary); font-style:italic;" title="Observação de competência da coordenação local">Acompanhamento</span>
                ${canEditSchedule ? `
                  <button class="btn btn-secondary" style="padding:5px 10px; font-size:11px;" onclick="openEditScheduleModal('${s.id}')" title="Editar Agendamento">
                    ✏️ Editar
                  </button>
                  <button class="btn btn-secondary" style="padding:5px 10px; font-size:11px; color:var(--red); border-color:var(--red);" onclick="confirmDeleteSchedule('${s.id}')" title="Excluir Agendamento do Cronograma">
                    🗑️ Excluir
                  </button>
                ` : ''}
              </div>
            `;
            cardActionHtml = `
              <div style="display:flex; gap:8px; width:100%; align-items:center; flex-wrap:wrap;">
                <span style="font-size:11px; color:var(--text-secondary); font-style:italic; margin-right:auto;">Acompanhamento pedagógico em cascata</span>
                ${canEditSchedule ? `
                  <button class="btn btn-secondary" style="padding:7px 12px; font-size:12px;" onclick="openEditScheduleModal('${s.id}')">
                    ✏️ Editar
                  </button>
                  <button class="btn btn-secondary" style="padding:7px 12px; font-size:12px; color:var(--red); border-color:var(--red);" onclick="confirmDeleteSchedule('${s.id}')">
                    🗑️ Excluir
                  </button>
                ` : ''}
              </div>
            `;
          }
        }

        const nextTagHtml = isThisNextVisit ? '<span class="badge-next-inline">Próxima</span>' : '';

        // Prioridade da Turma como eixo central nos agendamentos escolares
        const isClassSchedule = s.targetType === 'turma' || user.roleKey === 'coordenador';
        const displayTitle = isClassSchedule ? `📚 ${s.className || s.targetName}` : `👤 ${s.targetName}`;
        let displaySub = '';

        if (isClassSchedule) {
          const teachersArr = Array.isArray(s.teachers) && s.teachers.length > 0 
            ? s.teachers 
            : (s.targetName && s.targetName !== s.className ? [s.targetName] : []);
          displaySub = teachersArr.length > 0 
            ? `👩‍🏫 Regência: ${teachersArr.join(', ')}` 
            : `<span style="color:#DC2626; font-style:italic;">⚠️ Sem regente atribuída</span>`;
        } else {
          displaySub = s.className || 'Coordenação Pedagógica';
        }

        // 1. Tabela Desktop
        if (tbody) {
          const tr = document.createElement('tr');
          if (isThisNextVisit) {
            tr.style.backgroundColor = '#F0FDF4';
            tr.style.boxShadow = 'inset 4px 0 0 #2563EB';
          }
          tr.innerHTML = `
            <td>
              <div style="font-size:14px; font-weight:800; color:var(--text-primary);">
                ${displayTitle} ${nextTagHtml}
              </div>
              <div style="font-size:11px; color:var(--text-secondary); margin-top:2px;">
                ${displaySub}
              </div>
            </td>
            <td>${s.schoolName}</td>
            <td><span style="font-weight:700; color:var(--primary);">${s.bimester}</span></td>
            <td>${formatDateBR(s.plannedDate)}</td>
            <td>${s.plannedTime}</td>
            <td><span class="status-badge ${badgeClass}">${badgeText}</span></td>
            <td style="text-align:center;">
              ${actionHtml}
            </td>
          `;
          tbody.appendChild(tr);
        }

        // 2. Cards Mobile
        if (cardsContainer) {
          const card = document.createElement('div');
          card.className = `schedule-mobile-card ${borderClass}`;
          if (isThisNextVisit) {
            card.style.border = '2px solid #3B82F6';
            card.style.boxShadow = '0 3px 10px rgba(59, 130, 246, 0.15)';
          }
          const formattedDate = typeof formatDateBR === 'function' ? formatDateBR(s.plannedDate) : s.plannedDate;

          card.innerHTML = `
            <div class="schedule-card-header">
              <div>
                <div class="schedule-card-target">
                  ${displayTitle}
                  ${nextTagHtml}
                </div>
                <div class="schedule-card-class" style="font-size:11px; color:var(--text-secondary); margin-top:2px;">${displaySub}</div>
              </div>
              <span class="status-badge ${badgeClass}" style="flex-shrink:0;">${badgeText}</span>
            </div>

            <div class="schedule-card-meta">
              <div class="schedule-card-meta-row">
                <span class="schedule-meta-label">Escola:</span>
                <span class="schedule-meta-val">${s.schoolName}</span>
              </div>
              <div class="schedule-card-meta-row" style="justify-content:space-between; flex-wrap:wrap; gap:6px;">
                <div style="display:flex; align-items:center; gap:6px;">
                  <span class="schedule-meta-label">Data:</span>
                  <span class="schedule-meta-val">${formattedDate} às ${s.plannedTime || '08:00'}</span>
                </div>
                <span class="schedule-bimester-tag">
                  ${s.bimester}
                </span>
              </div>
            </div>

            <div class="schedule-card-actions">
              ${cardActionHtml}
            </div>
          `;
          cardsContainer.appendChild(card);
        }
      });
    }

    function confirmDeleteSchedule(scheduleId) {
      if (!scheduleId) return;
      const sched = (appState.schedules || []).find(s => s.id === scheduleId);
      if (!sched) return;

      const linkedObs = findObservationForSchedule(sched);
      let confirmMsg = 'Tem certeza que deseja excluir este agendamento do cronograma? Esta ação não poderá ser desfeita.';
      if (linkedObs && (linkedObs.status === 'finalized' || linkedObs.status === 'concluida')) {
        confirmMsg = 'Este agendamento já possui uma observação realizada e finalizada. Deseja realmente removê-lo do cronograma? A observação concluída no histórico continuará preservada.';
      } else if (linkedObs) {
        confirmMsg = 'Este agendamento possui uma observação em andamento (rascunho). Deseja remover o agendamento? O rascunho de anotações continuará preservado como observação avulsa.';
      }

      if (window.confirm(confirmMsg)) {
        deleteSchedule(scheduleId);
      }
    }

    function deleteSchedule(scheduleId) {
      if (!scheduleId || !appState.schedules) return;
      const schedIndex = appState.schedules.findIndex(s => s.id === scheduleId);
      if (schedIndex === -1) return;

      const sched = appState.schedules[schedIndex];

      // Desvinculação relacional segura: se houver observações vinculadas, desvincula o scheduleId
      if (appState.observations && appState.observations.length > 0) {
        appState.observations.forEach(obs => {
          if (obs.scheduleId === scheduleId) {
            obs.scheduleId = null;
          }
        });
      }

      // Remove do array de agendamentos
      appState.schedules.splice(schedIndex, 1);

      // Fecha o modal caso esteja aberto
      if (typeof closeAddScheduleModal === 'function') {
        closeAddScheduleModal();
      }

      saveState();
      showToast('Agendamento excluído com sucesso do cronograma.');

      if (typeof renderScheduleScreen === 'function') renderScheduleScreen();
      if (typeof renderHomeScreen === 'function') renderHomeScreen();
      if (typeof renderIndicatorsScreen === 'function') renderIndicatorsScreen();
    }

    function archiveSchedule(scheduleId) {
      const sched = appState.schedules.find(s => s.id === scheduleId);
      if (!sched) return;
      sched.archived = true;
      saveState();
      renderScheduleScreen();
      showToast('Observação arquivada com sucesso! Movida para Observações Arquivadas.');
    }

    function unarchiveSchedule(scheduleId) {
      const sched = appState.schedules.find(s => s.id === scheduleId);
      if (!sched) return;
      sched.archived = false;
      saveState();
      renderScheduleScreen();
      showToast('Observação desarquivada com sucesso! Movida para Observações Ativas.');
    }

    function archiveAllCompletedSchedules() {
      const scopedSchedules = getScopedSchedules();
      const completedActive = scopedSchedules.filter(s => s.status === 'realizado' && !s.archived);

      if (completedActive.length === 0) {
        showToast('Não há observações realizadas ativas para arquivar.');
        return;
      }

      if (!confirm(`Deseja arquivar ${completedActive.length} observação(ões) já realizada(s)?`)) {
        return;
      }

      completedActive.forEach(s => {
        s.archived = true;
      });

      saveState();
      renderScheduleScreen();
      showToast(`${completedActive.length} observação(ões) arquivada(s) com sucesso!`);
    }

    function openAddScheduleModal() {
      editingScheduleId = null;
      document.getElementById('scheduleModalTitle').innerText = 'Planejar Observação no Cronograma';
      const user = getCurrentUser();
      const schoolSelect = document.getElementById('scheduleSchool');
      schoolSelect.innerHTML = '';

      let allowedUnits = appState.units;
      if (user.roleKey === 'formador') {
        allowedUnits = appState.units.filter(u => u.polo === user.school || u.name === user.school);
      }

      allowedUnits.forEach(u => {
        const opt = document.createElement('option');
        opt.value = u.name;
        opt.text = u.name;
        schoolSelect.appendChild(opt);
      });

      if (user.roleKey === 'coordenador') {
        schoolSelect.value = user.school;
        schoolSelect.disabled = true;
      } else {
        schoolSelect.disabled = false;
      }

      const targetLabel = document.getElementById('scheduleTargetLabel');
      if (targetLabel) {
        targetLabel.innerText = user.roleKey === 'formador' 
          ? 'Coordenadora Pedagógica a ser Acompanhada' 
          : 'Turma da Educação Infantil a ser Observada';
      }

      onScheduleSchoolChange();
      document.getElementById('scheduleDate').value = getTodayDateString();
      document.getElementById('scheduleTime').value = '08:00';
      const btnDeleteModal = document.getElementById('btnDeleteScheduleModal');
      if (btnDeleteModal) btnDeleteModal.style.display = 'none';
      document.getElementById('modalAddSchedule').classList.add('active');
      checkScheduleDuplicationUI();
    }

    function openEditScheduleModal(scheduleId) {
      editingScheduleId = scheduleId;
      const sched = appState.schedules.find(s => s.id === scheduleId);
      if (!sched) return;

      document.getElementById('scheduleModalTitle').innerText = 'Editar Observação no Cronograma';
      
      const user = getCurrentUser();
      const schoolSelect = document.getElementById('scheduleSchool');
      schoolSelect.innerHTML = '';
      
      let allowedUnits = appState.units;
      if (user.roleKey === 'formador') {
        allowedUnits = appState.units.filter(u => u.polo === user.school || u.name === user.school);
      }

      allowedUnits.forEach(u => {
        const opt = document.createElement('option');
        opt.value = u.name;
        opt.text = u.name;
        schoolSelect.appendChild(opt);
      });

      if (user.roleKey === 'coordenador') {
        schoolSelect.value = user.school;
        schoolSelect.disabled = true;
      } else {
        schoolSelect.disabled = false;
        schoolSelect.value = sched.schoolName;
      }

      const targetLabel = document.getElementById('scheduleTargetLabel');
      if (targetLabel) {
        targetLabel.innerText = user.roleKey === 'formador' 
          ? 'Coordenadora Pedagógica a ser Acompanhada' 
          : 'Turma da Educação Infantil a ser Observada';
      }

      onScheduleSchoolChange();
      
      const targetSelect = document.getElementById('scheduleTarget');
      if (targetSelect) {
        targetSelect.value = sched.className || sched.targetName;
      }
      onScheduleTargetChange();

      document.getElementById('scheduleBimester').value = sched.bimester;
      document.getElementById('scheduleDate').value = sched.plannedDate || sched.date;
      document.getElementById('scheduleTime').value = sched.plannedTime || '08:00';

      const btnDeleteModal = document.getElementById('btnDeleteScheduleModal');
      if (btnDeleteModal) btnDeleteModal.style.display = 'inline-block';

      document.getElementById('modalAddSchedule').classList.add('active');
      checkScheduleDuplicationUI();
    }

    function closeAddScheduleModal() {
      document.getElementById('modalAddSchedule').classList.remove('active');
    }

    function onScheduleSchoolChange() {
      const user = getCurrentUser();
      const school = document.getElementById('scheduleSchool').value;
      const targetSelect = document.getElementById('scheduleTarget');
      const teachersCard = document.getElementById('scheduleClassTeachersCard');
      targetSelect.innerHTML = '';

      if (user.roleKey === 'coordenador') {
        // PILAR 1: Coordenadora agenda observações da TURMA
        if (teachersCard) teachersCard.style.display = 'block';

        const schoolClasses = getClassesForSchool(school);
        if (schoolClasses.length === 0) {
          const opt = document.createElement('option');
          opt.value = '';
          opt.text = 'Nenhuma turma cadastrada nesta unidade escolar';
          targetSelect.appendChild(opt);
          if (teachersCard) teachersCard.style.display = 'none';
          return;
        }

        schoolClasses.forEach(cls => {
          const opt = document.createElement('option');
          opt.value = cls.name;
          const count = cls.teachers ? cls.teachers.length : 0;
          const regText = count > 0 ? (" (" + count + " regente" + (count > 1 ? "s" : "") + ")") : ' (Sem regente atribuída)';
          opt.text = cls.name + " · " + formatMECShift(cls.shift) + regText;
          targetSelect.appendChild(opt);
        });

      } else {
        // FORMADORA OU EQUIPE TÉCNICA: Acompanhamento de Coordenadoras Pedagógicas
        if (teachersCard) teachersCard.style.display = 'none';

        let candidates = appState.teamMembers.filter(m => m.school === school && m.roleKey === 'coordenador');
        candidates = candidates.filter(m => m.name !== user.name); // Bloqueio de autoagendamento

        if (candidates.length === 0) {
          const opt = document.createElement('option');
          opt.value = '';
          opt.text = 'Nenhum(a) coordenador(a) cadastrado(a) nesta unidade';
          targetSelect.appendChild(opt);
          return;
        }

        candidates.forEach(c => {
          const opt = document.createElement('option');
          opt.value = c.name;
          opt.text = c.name + " (" + (c.roleTitle || 'Coordenadora Pedagógica') + ")";
          targetSelect.appendChild(opt);
        });
      }

      onScheduleTargetChange();
    }

    function onScheduleTargetChange() {
      const user = getCurrentUser();
      const schoolName = document.getElementById('scheduleSchool').value;
      const targetSelect = document.getElementById('scheduleTarget');
      if (!targetSelect) return;
      const targetVal = targetSelect.value;

      if (user.roleKey === 'coordenador') {
        const teachersCard = document.getElementById('scheduleClassTeachersCard');
        const shiftBadge = document.getElementById('scheduleClassShiftBadge');
        const listEl = document.getElementById('scheduleClassTeachersList');

        const schoolClasses = getClassesForSchool(schoolName);
        const targetClass = schoolClasses.find(c => c.name === targetVal);

        if (targetClass && listEl && teachersCard) {
          teachersCard.style.display = 'block';
          if (shiftBadge) shiftBadge.innerText = targetClass.shift || 'Parcial Matutino';
          listEl.innerHTML = '';

          const teachers = targetClass.teachers || [];
          if (teachers.length === 0) {
            listEl.innerHTML = '<span style="font-size:12px; color:#DC2626; font-style:italic;">⚠️ Nenhuma professora regente vinculada nesta turma.</span>';
          } else {
            teachers.forEach(tName => {
              const pill = document.createElement('div');
              pill.style.cssText = 'background:#FFFFFF; border:1px solid #BFDBFE; border-radius:20px; padding:3px 10px; font-size:11px; font-weight:700; color:#1E40AF; display:inline-flex; align-items:center; gap:5px;';
              pill.innerHTML = "<span>👩‍🏫</span> <span>" + tName + "</span>";
              listEl.appendChild(pill);
            });
          }
        }

        // Sugere automaticamente o próximo bimestre longitudinal da TURMA
        autoSelectNextEligibleBimesterForClass(targetVal, schoolName, 'scheduleBimester');

      } else {
        // Sugere o próximo bimestre longitudinal da Coordenadora
        autoSelectNextEligibleBimester(targetVal, 'scheduleBimester');
      }
    }

    // --- MOTOR DE DETECÇÃO DE DUPLICIDADE EM AGENDAMENTOS (SSOT) ---
    let isSavingSchedule = false;

    function findDuplicateSchedule(params, ignoreScheduleId = null) {
      if (!appState.schedules || !Array.isArray(appState.schedules)) return null;
      const user = getCurrentUser();
      const { schoolName, targetType, targetName, className, bimester, plannedDate, plannedTime } = params;

      const cleanSchool = (schoolName || '').trim().toLowerCase();
      const cleanTarget = (targetName || '').trim().toLowerCase();
      const cleanClass = (className || '').trim().toLowerCase();
      const cleanBim = (bimester || '').trim();
      const cleanDate = (plannedDate || '').trim();
      const cleanTime = (plannedTime || '').trim();

      // 1. Duplicidade de Bimestre no Ciclo Longitudinal (Mesma Escola + Mesmo Alvo + Mesmo Bimestre)
      const bimDuplicate = appState.schedules.find(s => {
        if (ignoreScheduleId && s.id === ignoreScheduleId) return false;
        if (s.archived) return false;
        if ((s.schoolName || '').trim().toLowerCase() !== cleanSchool) return false;
        if ((s.bimester || '').trim() !== cleanBim) return false;

        if (targetType === 'turma') {
          const sClass = (s.className || s.targetName || '').trim().toLowerCase();
          return sClass === cleanClass || sClass === cleanTarget;
        } else {
          const sTarget = (s.targetName || '').trim().toLowerCase();
          return sTarget === cleanTarget;
        }
      });

      if (bimDuplicate) {
        const formattedDate = typeof formatDateBR === 'function' ? formatDateBR(bimDuplicate.plannedDate) : bimDuplicate.plannedDate;
        const targetLabel = targetType === 'turma' ? `a turma ${className || targetName}` : `a coordenadora ${targetName}`;
        const statusLabel = bimDuplicate.status === 'realizado' ? 'já realizada' : (bimDuplicate.status === 'atrasado' ? 'em atraso' : 'planejada');
        return {
          isDuplicate: true,
          type: 'bimester',
          existingSchedule: bimDuplicate,
          message: `Já existe uma observação (${statusLabel}) para ${targetLabel} no ${bimester} (agendada para ${formattedDate} às ${bimDuplicate.plannedTime || '08:00'}).`
        };
      }

      // 2. Duplicidade de Data no Alvo (Mesma Turma ou Mesma Coordenadora na mesma data)
      if (cleanDate) {
        const dateDuplicate = appState.schedules.find(s => {
          if (ignoreScheduleId && s.id === ignoreScheduleId) return false;
          if (s.archived) return false;
          if ((s.schoolName || '').trim().toLowerCase() !== cleanSchool) return false;
          if ((s.plannedDate || s.date || '').trim() !== cleanDate) return false;

          if (targetType === 'turma') {
            const sClass = (s.className || s.targetName || '').trim().toLowerCase();
            return sClass === cleanClass || sClass === cleanTarget;
          } else {
            const sTarget = (s.targetName || '').trim().toLowerCase();
            return sTarget === cleanTarget;
          }
        });

        if (dateDuplicate) {
          const formattedDate = typeof formatDateBR === 'function' ? formatDateBR(cleanDate) : cleanDate;
          const targetLabel = targetType === 'turma' ? `a turma ${className || targetName}` : `a coordenadora ${targetName}`;
          return {
            isDuplicate: true,
            type: 'date',
            existingSchedule: dateDuplicate,
            message: `Já existe uma visita marcada para ${targetLabel} na data ${formattedDate} (${dateDuplicate.bimester} às ${dateDuplicate.plannedTime || '08:00'}).`
          };
        }
      }

      // 3. Conflito de Horário do Supervisor (Mesmo observador no mesmo dia e horário)
      if (cleanDate && cleanTime && user && user.name) {
        const supervisorConflict = appState.schedules.find(s => {
          if (ignoreScheduleId && s.id === ignoreScheduleId) return false;
          if (s.archived) return false;
          if (s.supervisor && s.supervisor.trim().toLowerCase() !== user.name.trim().toLowerCase()) return false;
          return (s.plannedDate || s.date || '').trim() === cleanDate && (s.plannedTime || '').trim() === cleanTime;
        });

        if (supervisorConflict) {
          const formattedDate = typeof formatDateBR === 'function' ? formatDateBR(cleanDate) : cleanDate;
          return {
            isDuplicate: true,
            type: 'supervisor_time',
            existingSchedule: supervisorConflict,
            message: `Você já possui um agendamento neste mesmo dia e horário (${formattedDate} às ${cleanTime}) para ${supervisorConflict.className || supervisorConflict.targetName} na unidade ${supervisorConflict.schoolName}.`
          };
        }
      }

      // 4. Verificação de Observação Concluída / Em Andamento Existente para o Alvo no Bimestre
      if (appState.observations && Array.isArray(appState.observations)) {
        const bimNumMatch = cleanBim.match(/([1-4])/);
        const bimNum = bimNumMatch ? bimNumMatch[1] : '';

        const obsDuplicate = appState.observations.find(o => {
          if (o.status === 'archived') return false;
          if (cleanSchool && o.schoolName && (o.schoolName || '').trim().toLowerCase() !== cleanSchool) return false;
          const oBimNumMatch = (o.bimester || '').match(/([1-4])/);
          if (!oBimNumMatch || (bimNum && oBimNumMatch[1] !== bimNum)) return false;

          if (targetType === 'turma') {
            const oClass = (o.className || '').trim().toLowerCase();
            return oClass === cleanClass || oClass === cleanTarget;
          } else {
            const oTarget = (o.teacherName || '').trim().toLowerCase();
            return oTarget === cleanTarget;
          }
        });

        if (obsDuplicate) {
          const targetLabel = targetType === 'turma' ? `a turma ${className || targetName}` : `a coordenadora ${targetName}`;
          const obsStatus = (obsDuplicate.status === 'finalized' || obsDuplicate.status === 'concluida') ? 'concluída' : 'em rascunho';
          return {
            isDuplicate: true,
            type: 'observation',
            existingObservation: obsDuplicate,
            message: `Já existe uma observação (${obsStatus}) registrada para ${targetLabel} no ${bimester}. Não é necessário criar um novo agendamento.`
          };
        }
      }

      return null;
    }

    function checkScheduleDuplicationUI() {
      const hintEl = document.getElementById('scheduleDuplicateWarningHint');
      const saveBtn = document.getElementById('btnSaveScheduleModal');
      if (!hintEl) return;

      const schoolSelect = document.getElementById('scheduleSchool');
      const targetSelect = document.getElementById('scheduleTarget');
      const bimesterSelect = document.getElementById('scheduleBimester');
      const dateInput = document.getElementById('scheduleDate');
      const timeInput = document.getElementById('scheduleTime');

      if (!schoolSelect || !targetSelect || !bimesterSelect) return;

      const schoolName = schoolSelect.value;
      const targetVal = targetSelect.value;
      const bimester = bimesterSelect.value;
      const plannedDate = dateInput ? dateInput.value : '';
      const plannedTime = timeInput ? timeInput.value : '';

      if (!targetVal) {
        hintEl.style.display = 'none';
        if (saveBtn) {
          saveBtn.disabled = false;
          saveBtn.style.opacity = '1';
          saveBtn.style.cursor = 'pointer';
        }
        return;
      }

      const user = getCurrentUser();
      const targetType = user.roleKey === 'coordenador' ? 'turma' : 'coordenador';
      const className = targetType === 'turma' ? targetVal : 'Coordenação Pedagógica';
      const targetName = targetVal;

      const dup = findDuplicateSchedule({
        schoolName,
        targetType,
        targetName,
        className,
        bimester,
        plannedDate,
        plannedTime
      }, editingScheduleId);

      if (dup && dup.isDuplicate) {
        hintEl.style.display = 'flex';
        hintEl.style.alignItems = 'flex-start';
        hintEl.style.gap = '8px';
        hintEl.style.background = '#FEF2F2';
        hintEl.style.border = '1px solid #FCA5A5';
        hintEl.style.borderRadius = '8px';
        hintEl.style.padding = '10px 12px';
        hintEl.style.color = '#991B1B';
        hintEl.style.fontSize = '12px';
        hintEl.style.fontWeight = '500';
        hintEl.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2" style="flex-shrink:0; margin-top:1px;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <div>
            <strong style="font-weight:700; color:#991B1B; display:block; margin-bottom:2px;">Agendamento Duplicado Detectado</strong>
            <span>${dup.message}</span>
          </div>
        `;
        if (saveBtn) {
          saveBtn.disabled = true;
          saveBtn.style.opacity = '0.5';
          saveBtn.style.cursor = 'not-allowed';
          saveBtn.title = dup.message;
        }
      } else {
        hintEl.style.display = 'none';
        if (saveBtn) {
          saveBtn.disabled = false;
          saveBtn.style.opacity = '1';
          saveBtn.style.cursor = 'pointer';
          saveBtn.title = '';
        }
      }
    }

    function sanitizeDuplicateSchedules() {
      if (!appState.schedules || !Array.isArray(appState.schedules)) return;
      const seenKeys = new Map();
      const sanitized = [];

      appState.schedules.forEach(s => {
        if (s.archived) {
          sanitized.push(s);
          return;
        }
        const targetKey = `${(s.schoolName || '').trim().toLowerCase()}::${(s.className || s.targetName || '').trim().toLowerCase()}::${(s.bimester || '').trim().toLowerCase()}`;
        if (!seenKeys.has(targetKey)) {
          seenKeys.set(targetKey, s);
          sanitized.push(s);
        } else {
          // Duplicata encontrada: preserva a que possuir observação vinculada
          const existing = seenKeys.get(targetKey);
          const sObs = typeof findObservationForSchedule === 'function' ? findObservationForSchedule(s) : null;
          const existingObs = typeof findObservationForSchedule === 'function' ? findObservationForSchedule(existing) : null;
          
          if (sObs && !existingObs) {
            const idx = sanitized.indexOf(existing);
            if (idx !== -1) sanitized[idx] = s;
            seenKeys.set(targetKey, s);
          }
        }
      });

      if (sanitized.length !== appState.schedules.length) {
        appState.schedules = sanitized;
        saveState();
      }
    }

    function saveNewSchedule() {
      if (isSavingSchedule) return;

      const user = getCurrentUser();
      const schoolName = document.getElementById('scheduleSchool').value;
      const targetVal = document.getElementById('scheduleTarget').value;
      const bimester = document.getElementById('scheduleBimester').value;
      const plannedDate = document.getElementById('scheduleDate').value;
      const plannedTime = document.getElementById('scheduleTime').value || '08:00';

      if (!targetVal) {
        showToast(user.roleKey === 'coordenador' ? 'Selecione a turma para o agendamento.' : 'Selecione o profissional para o agendamento.');
        return;
      }

      let targetType = 'turma';
      let className = targetVal;
      let targetName = targetVal;
      let classId = null;
      let teachersList = [];

      if (user.roleKey === 'coordenador') {
        targetType = 'turma';
        const schoolClasses = getClassesForSchool(schoolName);
        const targetClass = schoolClasses.find(c => c.name === targetVal);
        classId = targetClass ? targetClass.id : null;
        className = targetClass ? targetClass.name : targetVal;
        targetName = targetClass ? targetClass.name : targetVal;
        teachersList = targetClass ? (targetClass.teachers || []) : [];
      } else {
        targetType = 'coordenador';
        className = 'Coordenação Pedagógica';
        targetName = targetVal;
      }

      // --- BARREIRA DE PROTEÇÃO CONTRA AGENDAMENTOS DUPLICADOS ---
      const dup = findDuplicateSchedule({
        schoolName,
        targetType,
        targetName,
        className,
        bimester,
        plannedDate,
        plannedTime
      }, editingScheduleId);

      if (dup && dup.isDuplicate) {
        showToast(dup.message, 'warning');
        checkScheduleDuplicationUI();
        return;
      }

      isSavingSchedule = true;
      const saveBtn = document.getElementById('btnSaveScheduleModal');
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.style.opacity = '0.7';
      }

      try {
        if (editingScheduleId) {
          const schedIndex = appState.schedules.findIndex(s => s.id === editingScheduleId);
          if (schedIndex !== -1) {
            const schedToUpdate = appState.schedules[schedIndex];
            schedToUpdate.schoolName = schoolName;
            schedToUpdate.targetType = targetType;
            schedToUpdate.targetName = targetName;
            schedToUpdate.className = className;
            schedToUpdate.classId = classId;
            schedToUpdate.teachers = teachersList;
            schedToUpdate.bimester = bimester;
            schedToUpdate.plannedDate = plannedDate;
            schedToUpdate.date = plannedDate;
            schedToUpdate.plannedTime = plannedTime;

            // Sincronização relacional bidirecional com observação vinculada (se houver)
            const linkedObs = findObservationForSchedule(schedToUpdate);
            if (linkedObs) {
              linkedObs.date = plannedDate;
              linkedObs.startDate = plannedDate;
              linkedObs.endDate = plannedDate;
              if (plannedTime) linkedObs.startTime = plannedTime;

              // Turmas de Tempo Integral: sincronizar sub-etapas matutina e vespertina
              if (linkedObs.isIntegral) {
                if (linkedObs.morningObs) linkedObs.morningObs.date = plannedDate;
                if (linkedObs.afternoonObs) linkedObs.afternoonObs.date = plannedDate;
              }
            }
          }
          showToast('Observação atualizada com sucesso!');
        } else {
          const newSched = {
            id: 'sch-' + Date.now(),
            schoolName: schoolName,
            targetType: targetType,
            targetName: targetName,
            className: className,
            classId: classId,
            teachers: teachersList,
            bimester: bimester,
            plannedDate: plannedDate,
            plannedTime: plannedTime,
            supervisor: user.name,
            status: 'planejado'
          };
          appState.schedules.unshift(newSched);
          showToast('Observação planejada adicionada ao cronograma!');
        }

        saveState();
        closeAddScheduleModal();
        renderScheduleScreen();
        if (typeof renderHomeScreen === 'function') renderHomeScreen();
      } finally {
        isSavingSchedule = false;
        if (saveBtn) {
          saveBtn.disabled = false;
          saveBtn.style.opacity = '1';
        }
      }
    }

    function openSetupScreenFromSchedule(scheduleId) {
      const sched = appState.schedules.find(s => s.id === scheduleId);
      if (sched) openSetupScreen(sched);
    }

