    // --- 8. HOME & HISTORY SCREENS ---
    
    function switchPedagSubTab(tabName) {
      const user = getCurrentUser();
      // Se for referenciada sub-aba legada 'rubrics', direciona para 'units'
      if (tabName === 'rubrics') tabName = 'units';
      // Núcleo de EI não possui a tela de turmas da rede municipal: direciona suavemente para 'units'
      if (isNucleoEI(user) && tabName === 'classes') {
        tabName = 'units';
      }
      appState.currentPedagSubTab = tabName;
      document.querySelectorAll('.pedag-subtab-btn').forEach(btn => btn.classList.remove('active'));
      const activeBtn = document.getElementById('pedagTab' + tabName.charAt(0).toUpperCase() + tabName.slice(1));
      if(activeBtn) activeBtn.classList.add('active');

      document.querySelectorAll('.pedag-subview').forEach(view => view.style.display = 'none');
      const activeView = document.getElementById('pedagView' + tabName.charAt(0).toUpperCase() + tabName.slice(1));
      if(activeView) activeView.style.display = 'block';

      if (tabName === 'units') renderUnitsScreen();
      if (tabName === 'classes') renderClassesScreen();
      if (tabName === 'team') renderTeamScreen();
    }

    function renderHomeScreen() {
      checkAndAutoArchive(true);
      const scopedObs = getScopedObservations();
      const user = getCurrentUser();

      // Only creator's drafts
      const drafts = scopedObs.filter(o => o.status === 'draft' && o.evaluatedBy === user.name);
      const finalized = scopedObs.filter(o => o.status === 'finalized');
      const notes = getScopedNotes();
      const activeNotes = notes.filter(n => !n.archived);
      const activeFinalized = finalized.filter(f => !f.archived);

      const draftsHeader = document.getElementById('homeDraftsHeader');
      if (draftsHeader) draftsHeader.innerText = `📝 Meus Rascunhos em Andamento (${drafts.length})`;
      const finCount = document.getElementById('homeFinalizedCount');
      if (finCount) finCount.innerText = `${activeFinalized.length} Observações Ativas`;
      const notesCount = document.getElementById('homeNotesCountText');
      if (notesCount) notesCount.innerText = `${activeNotes.length} Ocorrências Ativas`;

      
      const isGestao = isNucleoEI(user);
      
      const homeStandardView = document.getElementById('homeStandardView');
      const homeGestaoView = document.getElementById('homeGestaoView');
      
      if(homeStandardView) homeStandardView.style.display = isGestao ? 'none' : 'block';
      if(homeGestaoView) {
        homeGestaoView.style.display = isGestao ? 'block' : 'none';
        if (isGestao && (!appState.currentPedagSubTab || appState.currentPedagSubTab === 'rubrics')) {
          switchPedagSubTab('units');
        } else if (isGestao) {
          switchPedagSubTab(appState.currentPedagSubTab);
        }
      }

      // Renderização dinâmica de observações agendadas pendentes na Tela Inicial
      const scheduledSection = document.getElementById('homeScheduledSection');
      const scheduledCardsList = document.getElementById('homeScheduledCardsList');
      if (scheduledSection && scheduledCardsList) {
        if (isGestao || user.roleKey === 'pendente' || user.roleKey === 'professora') {
          scheduledSection.style.display = 'none';
        } else {
          scheduledSection.style.display = 'block';
          const pendingSchedules = getActionablePendingSchedules();

          if (pendingSchedules.length === 0) {
            scheduledCardsList.innerHTML = `
              <div class="card" style="padding:16px; margin-bottom:0; color:var(--text-secondary); font-size:13px; grid-column:1/-1; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; border-left:4px solid var(--border);">
                <span>Você não possui nenhuma observação agendada pendente no momento.</span>
                <button class="btn btn-secondary" style="font-size:11px; padding:6px 12px;" onclick="openAddScheduleModal()">
                  + Agendar Nova Observação
                </button>
              </div>
            `;
          } else {
            pendingSchedules.sort((a, b) => (a.plannedDate || '').localeCompare(b.plannedDate || ''));
            const todayStr = getTodayDateString();
            scheduledCardsList.innerHTML = '';

            // Exibe as 4 observações mais próximas na Home
            pendingSchedules.slice(0, 4).forEach(s => {
              let badgeHtml = '';
              if (s.plannedDate === todayStr) {
                badgeHtml = `<span style="font-size:10px; font-weight:700; background:#DCFCE7; color:#166534; padding:2px 6px; border-radius:10px;">● Hoje</span>`;
              } else if (s.plannedDate < todayStr) {
                badgeHtml = `<span style="font-size:10px; font-weight:700; background:#FEE2E2; color:#991B1B; padding:2px 6px; border-radius:10px;">⚠ Em Atraso</span>`;
              } else {
                badgeHtml = `<span style="font-size:10px; font-weight:700; background:#EFF6FF; color:#1E40AF; padding:2px 6px; border-radius:10px;">🗓️ Prevista</span>`;
              }

              const card = document.createElement('div');
              card.className = 'card';
              card.style.cssText = 'padding:14px; margin-bottom:0; display:flex; flex-direction:column; justify-content:space-between; border-left:4px solid var(--primary);';
              card.innerHTML = `
                <div>
                  <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px;">
                    <strong style="font-size:14px; color:var(--text-primary);">${s.targetName}</strong>
                    ${badgeHtml}
                  </div>
                  <div style="font-size:11px; color:var(--text-secondary); line-height:1.4; margin-bottom:10px;">
                    ${s.schoolName}<br>
                    <span style="font-weight:700; color:var(--primary);">${s.bimester}</span> · ${s.className || 'Coordenação'} · ${formatDateBR(s.plannedDate)} às ${s.plannedTime || '08:00'}
                  </div>
                </div>
                <button class="btn btn-primary" style="padding:6px 12px; font-size:11px; font-weight:700; width:100%;" onclick="openSetupScreenFromSchedule('${s.id}')">
                  Iniciar Observação →
                </button>
              `;
              scheduledCardsList.appendChild(card);
            });
          }
        }
      }

      const container = document.getElementById('homeDraftsContainer');
      container.innerHTML = '';

      if (drafts.length === 0) {
        container.innerHTML = `<div class="card" style="color:var(--text-secondary); font-size:13px;">Você não possui nenhum rascunho em andamento.</div>`;
      } else {
        drafts.slice(0, 3).forEach(d => {
          const item = document.createElement('div');
          item.className = 'draft-card';
          let title = d.evaluatedType === 'turma' ? `📚 Turma: ${d.className}` : (d.evaluatedType === 'coordenador' ? `📋 Coordenadora: ${d.teacherName}` : d.teacherName);
          let stageBadge = '';
          let actionBtnText = 'Continuar';
          let actionBtnStyle = 'padding:8px 14px;';

          if (d.isIntegral) {
            if (d.integralStage === 'vespertino') {
              stageBadge = `<span style="font-size:10px; font-weight:700; background:#FFFBEB; color:#B45309; border:1px solid #FDE68A; padding:2px 8px; border-radius:10px; margin-left:6px;">🌤️ Aguardando Tarde (Etapa 2/2)</span>`;
              actionBtnText = 'Retomar à Tarde →';
              actionBtnStyle = 'padding:8px 14px; background:#7C3AED; border-color:#6D28D9; font-weight:700;';
            } else {
              stageBadge = `<span style="font-size:10px; font-weight:700; background:#FAF5FF; color:#7C3AED; border:1px solid #E9D5FF; padding:2px 8px; border-radius:10px; margin-left:6px;">☀️ Etapa 1: Manhã</span>`;
            }
          }

          let meta = d.evaluatedType === 'turma'
            ? `👩‍🏫 Regência: ${d.teachers && d.teachers.length > 0 ? d.teachers.join(', ') : d.teacherName} · ${d.bimester || 'Bimestre'} · ${formatObservationDateRange(d) || d.date}`
            : `Turma: ${d.className} · ${d.bimester || 'Bimestre'} · ${formatObservationDateRange(d) || d.date}`;

          if (d.isIntegral && d.morningObs && d.morningObs.completed) {
            meta += ` · <span style="color:#1D4ED8; font-weight:700;">Manhã: ${d.morningObs.startTime || '08:00'}-${d.morningObs.endTime || '11:30'} (${d.morningObs.durationMinutes || '--'}m)</span>`;
          }

          item.innerHTML = `
            <div>
              <div class="draft-teacher" style="display:flex; align-items:center; flex-wrap:wrap; gap:4px;">
                <span>${title}</span>
                ${stageBadge}
              </div>
              <div class="draft-meta">${meta}</div>
            </div>
            <div style="display:flex; gap:8px;">
              <button class="btn btn-secondary" style="color:var(--red); padding:8px 12px;" onclick="confirmDeleteObservation('${d.id}')">Excluir</button>
              <button class="btn btn-primary" style="${actionBtnStyle}" onclick="resumeObservation('${d.id}', false)">${actionBtnText}</button>
            </div>
          `;
          container.appendChild(item);
        });
      }
    }

    function filterHistory(type) {
      appState.historyFilter = type;
      document.getElementById('btnHistDrafts').style.background = type === 'drafts' ? 'var(--primary)' : 'transparent';
      document.getElementById('btnHistDrafts').style.color = type === 'drafts' ? '#fff' : 'var(--text-secondary)';
      document.getElementById('btnHistFinalized').style.background = type === 'finalized' ? 'var(--primary)' : 'transparent';
      document.getElementById('btnHistFinalized').style.color = type === 'finalized' ? '#fff' : 'var(--text-secondary)';
      renderHistoryScreen();
    }

    function populateHistoryClassFilter() {
      const classSelect = document.getElementById('histFilterClass');
      if (!classSelect) return;
      const currentVal = classSelect.value || 'ALL';
      const user = getCurrentUser();

      let availableClasses = [];
      if (user.roleKey === 'coordenador') {
        availableClasses = getClassesForSchool(user.school);
      } else if (user.roleKey === 'formador') {
        const poloUnits = (appState.units || []).filter(u => u.polo === user.school).map(u => u.name);
        poloUnits.forEach(uName => {
          availableClasses = availableClasses.concat(getClassesForSchool(uName));
        });
      } else {
        availableClasses = appState.classes || [];
      }

      let html = `<option value="ALL">Todas as Turmas</option>`;
      if (availableClasses.length > 0) {
        const uniqueNames = Array.from(new Set(availableClasses.map(c => c.name))).sort();
        uniqueNames.forEach(cName => {
          html += `<option value="${cName}">${cName}</option>`;
        });
      } else {
        ['Berçário I', 'Berçário II', 'Maternal I', 'Maternal II', 'Infantil I', 'Infantil II'].forEach(etapa => {
          html += `<option value="${etapa}">${etapa}</option>`;
        });
      }
      classSelect.innerHTML = html;
      if (Array.from(classSelect.options).some(o => o.value === currentVal)) {
        classSelect.value = currentVal;
      } else {
        classSelect.value = 'ALL';
      }
    }

    function resetHistoryFilters() {
      document.getElementById('histFilterName').value = '';
      document.getElementById('histFilterStartDate').value = '';
      document.getElementById('histFilterEndDate').value = '';
      document.getElementById('histFilterMaterial').value = 'ALL';
      document.getElementById('histFilterClass').value = 'ALL';
      document.getElementById('histFilterBimester').value = 'ALL';
      const roleFilter = document.getElementById('histFilterRole');
      if (roleFilter) roleFilter.value = 'ALL';
      const archFilter = document.getElementById('histFilterArchiveStatus');
      if (archFilter) archFilter.value = 'active';
      renderHistoryScreen();
    }

    function renderHistoryScreen() {
      checkAndAutoArchive(true);
      populateHistoryClassFilter();
      const user = getCurrentUser();
      const scopedObs = getScopedObservations();
      let items = scopedObs.filter(o => o.status === appState.historyFilter);

      // Filters
      const nameQuery = document.getElementById('histFilterName').value.trim().toLowerCase();
      const startDate = document.getElementById('histFilterStartDate').value;
      const endDate = document.getElementById('histFilterEndDate').value;
      const matFilter = document.getElementById('histFilterMaterial').value;
      const classFilter = document.getElementById('histFilterClass').value;
      const bimFilter = document.getElementById('histFilterBimester').value;
      const roleFilterEl = document.getElementById('histFilterRole');
      let roleFilter = roleFilterEl ? roleFilterEl.value : 'ALL';
      if (user.roleKey === 'coordenador') {
        roleFilter = 'professora'; // Coordenadora só visualiza histórico de professoras
      }
      const archFilterEl = document.getElementById('histFilterArchiveStatus');
      const archFilter = archFilterEl ? archFilterEl.value : 'active';

      // Filtro de arquivamento (aplicável a observações concluídas)
      if (appState.historyFilter === 'finalized') {
        if (archFilter === 'active') {
          items = items.filter(o => !o.archived);
        } else if (archFilter === 'archived') {
          items = items.filter(o => o.archived === true);
        }
      }

      if (nameQuery) {
        items = items.filter(o => {
          const classMatch = (o.className || '').toLowerCase().includes(nameQuery);
          const schoolMatch = (o.schoolName || '').toLowerCase().includes(nameQuery);
          const teacherMatch = (o.teacherName || '').toLowerCase().includes(nameQuery);
          const evaluatorMatch = (o.evaluatedBy || '').toLowerCase().includes(nameQuery);
          const regentsMatch = Array.isArray(o.teachers) && o.teachers.some(t => (t || '').toLowerCase().includes(nameQuery));
          return classMatch || schoolMatch || teacherMatch || evaluatorMatch || regentsMatch;
        });
      }
      
      // Filtro flexível por período: início opcional, fim opcional ou ambos
      if (startDate) {
        items = items.filter(o => (o.endDate || o.date || o.startDate || '') >= startDate);
      }
      if (endDate) {
        items = items.filter(o => (o.startDate || o.date || o.endDate || '') <= endDate);
      }

      if (matFilter !== 'ALL') {
        items = items.filter(o => String(o.synthesisMaterialDimension) === matFilter);
      }
      if (classFilter !== 'ALL') {
        items = items.filter(o => o.className.includes(classFilter));
      }
      if (bimFilter !== 'ALL') {
        items = items.filter(o => o.bimester === bimFilter);
      }
      if (roleFilter !== 'ALL') {
        items = items.filter(o => {
          if (roleFilter === 'professora') {
            return o.evaluatedType === 'professora' || o.evaluatedType === 'turma';
          }
          return o.evaluatedType === roleFilter;
        });
      }

      document.getElementById('histCountFeedback').innerText = `Exibindo ${items.length} registro(s) encontrado(s)`;

      const container = document.getElementById('historyCardsContainer');
      container.innerHTML = '';

      if (items.length === 0) {
        container.innerHTML = `<div class="card" style="grid-column: 1 / -1; text-align:center; padding:32px; color:var(--text-secondary);">Nenhuma observação encontrada para os filtros selecionados.</div>`;
        return;
      }

      items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.cursor = 'pointer';

        if (item.status === 'finalized') {
          const badgeClass = item.archived ? 'archived' : 'concluded';
          let badgeText = item.archived ? '📦 Arquivada' : '✓ Concluída (Read-Only)';
          let timeLine = `<span>⏱️ ${item.startTime || '--'} às ${item.endTime || '--'} (${item.durationMinutes ? item.durationMinutes + 'm' : '--'})</span>`;

          if (item.isIntegral) {
            badgeText = item.archived ? '📦 Arquivada (Tempo Integral)' : '✓ Concluída · Tempo Integral (2 Turnos)';
            const mStart = item.morningObs?.startTime || '08:00';
            const mEnd = item.morningObs?.endTime || '11:30';
            const aStart = item.afternoonObs?.startTime || '13:30';
            const aEnd = item.afternoonObs?.endTime || '16:30';
            timeLine = `<span>⏱️ <strong>Manhã:</strong> ${mStart}-${mEnd} | <strong>Tarde:</strong> ${aStart}-${aEnd} (Total: ${item.durationMinutes || '--'}m)</span>`;
          }

          const cardTitle = item.evaluatedType === 'turma' ? `📚 Turma: ${item.className}` : (item.evaluatedType === 'coordenador' ? `📋 Coordenadora: ${item.teacherName}` : item.teacherName);
          const cardMeta = item.evaluatedType === 'turma'
            ? `👩‍🏫 Regência: ${item.teachers && item.teachers.length > 0 ? item.teachers.join(', ') : item.teacherName} · ${item.bimester || 'Bimestre'} · ${formatObservationDateRange(item) || item.date}`
            : `Turma: ${item.className} · ${item.bimester || 'Bimestre'} · ${formatObservationDateRange(item) || item.date}`;

          card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
              <div>
                <div style="font-size:16px; font-weight:800; color:var(--text-primary);">${cardTitle}</div>
                <div style="font-size:12px; color:var(--text-secondary);">${cardMeta}</div>
              </div>
              <span class="status-badge ${badgeClass}" style="${item.isIntegral ? 'background:#FAF5FF; color:#7C3AED; border:1px solid #E9D5FF;' : ''}">${badgeText}</span>
            </div>
            <div style="display:flex; gap:12px; font-size:12px; color:var(--text-secondary); margin-top:4px;">
              ${timeLine}
              <span>🏫 ${item.schoolName}</span>
            </div>
            ${item.synthesisMaterialDimension ? `<div style="font-size:12px; font-weight:700; color:var(--primary-dark); margin-top:6px;">Uso de Materiais: Nível ${item.synthesisMaterialDimension}</div>` : ''}
            ${item.comments ? `<div style="font-size:12px; color:var(--text-secondary); font-style:italic; margin-top:6px;">"${item.comments}"</div>` : ''}
            <div style="margin-top:14px; padding-top:10px; border-top:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; font-size:12px; font-weight:700;">
              <span style="color:var(--text-secondary);">Avaliador: ${item.evaluatedBy}</span>
              <div style="display:flex; gap:8px; align-items:center;">
                ${item.archived ? `
                  <button class="btn btn-secondary" style="padding:4px 8px; font-size:11px;" onclick="event.stopPropagation(); unarchiveObservation('${item.id}')" title="Desarquivar observação">
                    📥 Desarquivar
                  </button>
                ` : `
                  <button class="btn btn-secondary" style="padding:4px 8px; font-size:11px;" onclick="event.stopPropagation(); archiveObservation('${item.id}')" title="Arquivar observação">
                    📦 Arquivar
                  </button>
                `}
                <span style="color:var(--primary);">Ver Devolutiva →</span>
              </div>
            </div>
          `;
          card.onclick = () => resumeObservation(item.id, true);
        } else {
          // Draft: ONLY the creator can edit!
          const isCreator = item.evaluatedBy === user.name;
          const cardTitle = item.evaluatedType === 'turma' ? `📚 Turma: ${item.className}` : (item.evaluatedType === 'coordenador' ? `📋 Coordenadora: ${item.teacherName}` : item.teacherName);
          const cardMeta = item.evaluatedType === 'turma'
            ? `👩‍🏫 Regência: ${item.teachers && item.teachers.length > 0 ? item.teachers.join(', ') : item.teacherName} · ${item.bimester || 'Bimestre'} · ${formatObservationDateRange(item) || item.date}`
            : `Turma: ${item.className} · ${item.bimester || 'Bimestre'} · ${formatObservationDateRange(item) || item.date}`;

          let draftBadgeHtml = '<span class="status-badge draft">Rascunho Editável</span>';
          let resumeBtnText = 'Continuar Preenchimento →';
          let resumeBtnStyle = 'padding:6px 14px; font-size:12px;';

          if (item.isIntegral) {
            if (item.integralStage === 'vespertino') {
              draftBadgeHtml = '<span class="status-badge" style="background:#FFFBEB; color:#B45309; border:1px solid #FDE68A; font-size:11px;">🌤️ Aguardando Turno Vespertino (Etapa 2/2)</span>';
              resumeBtnText = 'Retomar no Turno da Tarde →';
              resumeBtnStyle = 'padding:6px 14px; font-size:12px; background:#7C3AED; border-color:#6D28D9; font-weight:700;';
            } else {
              draftBadgeHtml = '<span class="status-badge" style="background:#FAF5FF; color:#7C3AED; border:1px solid #E9D5FF; font-size:11px;">☀️ Tempo Integral · Etapa 1 (Manhã)</span>';
            }
          }

          card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
              <div>
                <div style="font-size:16px; font-weight:800; color:var(--text-primary);">${cardTitle}</div>
                <div style="font-size:12px; color:var(--text-secondary);">${cardMeta}</div>
              </div>
              ${draftBadgeHtml}
            </div>
            <div style="font-size:12px; color:var(--text-secondary); margin-top:4px;">
              Iniciado em: ${item.startTime || '08:00'} · Autor: <strong>${item.evaluatedBy}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px; padding-top:10px; border-top:1px solid var(--border);">
              ${isCreator ? `
                <button class="btn btn-secondary" style="color:var(--red); padding:6px 12px; font-size:12px;" onclick="event.stopPropagation(); confirmDeleteObservation('${item.id}')">Excluir</button>
                <button class="btn btn-primary" style="${resumeBtnStyle}" onclick="event.stopPropagation(); resumeObservation('${item.id}', false)">${resumeBtnText}</button>
              ` : `
                <span style="font-size:11px; color:var(--text-secondary); font-style:italic;">Rascunho reservado ao criador.</span>
              `}
            </div>
          `;
          if (isCreator) {
            card.onclick = () => resumeObservation(item.id, false);
          }
        }

        container.appendChild(card);
      });
    }

    function archiveObservation(obsId) {
      const obs = appState.observations.find(o => o.id === obsId);
      if (!obs) return;
      obs.archived = true;
      obs.manuallyUnarchived = false;
      saveState();
      renderHistoryScreen();
      applyUserRoleUI();
      showToast('Observação arquivada com sucesso! Movida para Observações Arquivadas.');
    }

    function unarchiveObservation(obsId) {
      const obs = appState.observations.find(o => o.id === obsId);
      if (!obs) return;
      obs.archived = false;
      obs.manuallyUnarchived = true;
      saveState();
      renderHistoryScreen();
      applyUserRoleUI();
      showToast('Observação desarquivada com sucesso! Movida para Observações Ativas.');
    }

    function archiveAllOldObservations() {
      const count = checkAndAutoArchive(false);
      if (count === 0) {
        showToast('Nenhuma observação com 4 dias ou mais pendente de arquivamento.');
      }
      renderHistoryScreen();
      applyUserRoleUI();
    }

    // --- ROTINAS DE EXCLUSÃO SEGURA DE RASCUNHOS COM CAIXA DE CONFIRMAÇÃO ---
    let pendingDeleteDraftId = null;

    function confirmDeleteObservation(id) {
      const obs = (appState.observations || []).find(o => o.id === id);
      if (!obs) {
        showToast('Rascunho não localizado.');
        return;
      }

      pendingDeleteDraftId = id;
      const isCoord = (obs.evaluatedType === 'coordenador');

      const titleEl = document.getElementById('confirmDeleteDraftTitle');
      const msgEl = document.getElementById('confirmDeleteDraftMessage');
      const detailsEl = document.getElementById('confirmDeleteDraftDetails');

      if (titleEl) {
        titleEl.innerText = isCoord ? 'Excluir Rascunho de Entrevista' : 'Excluir Rascunho de Observação';
      }
      
      if (msgEl) {
        msgEl.innerText = isCoord 
          ? 'Tem certeza que deseja excluir este rascunho de entrevista formativa da Coordenação Pedagógica? Esta ação é definitiva e não poderá ser desfeita.'
          : 'Tem certeza que deseja excluir este rascunho de observação pedagógica docente? Esta ação é definitiva e não poderá ser desfeita.';
      }

      const answeredCriteria = Object.keys(obs.responses || {}).length;
      const photoCount = Object.keys(obs.photos || {}).length;
      const formattedDate = typeof formatDateBR === 'function' ? formatDateBR(obs.date) : obs.date;

      if (detailsEl) {
        detailsEl.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span style="font-weight:700; color:var(--text-primary); font-size:14px;">${obs.teacherName || 'Profissional'}</span>
            <span class="status-badge" style="${isCoord ? 'background:#FEF3C7; color:#92400E; border:1px solid #FDE68A;' : 'background:#EFF6FF; color:#1E40AF; border:1px solid #BFDBFE;'}">
              ${isCoord ? 'Entrevista · Coordenação' : 'Observação · Docente'}
            </span>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; color:var(--text-secondary); font-size:12px;">
            <div>🏫 <strong>Unidade:</strong> ${obs.schoolName || '--'}</div>
            <div>${isCoord ? '📋 <strong>Instrumento:</strong> Escuta Formativa' : `📚 <strong>Turma:</strong> ${obs.className || 'EI'}`}</div>
            <div>📅 <strong>Bimestre:</strong> ${obs.bimester || 'Acompanhamento'}</div>
            <div>🗓️ <strong>Data:</strong> ${formatObservationDateRange(obs) || formattedDate || '--'}</div>
          </div>
          <div style="margin-top:10px; padding-top:8px; border-top:1px dashed var(--border); font-size:12px; color:var(--text-secondary); display:flex; gap:14px; flex-wrap:wrap;">
            <span>📝 <strong>${answeredCriteria}</strong> critério(s) respondido(s)</span>
            <span>📷 <strong>${photoCount}</strong> foto(s) anexada(s)</span>
          </div>
        `;
      }

      const modal = document.getElementById('modalConfirmDeleteDraft');
      if (modal) {
        modal.classList.add('active');
      }
    }

    function closeConfirmDeleteDraftModal() {
      pendingDeleteDraftId = null;
      const modal = document.getElementById('modalConfirmDeleteDraft');
      if (modal) {
        modal.classList.remove('active');
      }
    }

    function escapeCriterionHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    // Modal / Bottom Sheet de Detalhamento Canônico Oficial do Critério (Mobile)
    function openCriterionDetailModal(critId) {
      const modal = document.getElementById('modalCriterionDetail');
      if (!modal) return;

      let targetCrit = null;
      let targetSec = null;
      let targetSub = null;

      const allSecs = (appState.currentObs && appState.currentObs.evaluatedType === 'coordenador')
        ? (appState.activeSectionsCoordinator || DEFAULT_SECTIONS_COORDINATOR)
        : (appState.activeSectionsTeacher || DEFAULT_SECTIONS_TEACHER);

      if (Array.isArray(allSecs)) {
        for (const sec of allSecs) {
          if (sec && sec.subSections) {
            for (const sub of sec.subSections) {
              if (sub && sub.criteria) {
                const found = sub.criteria.find(c => String(c.id) === String(critId));
                if (found) {
                  targetCrit = found;
                  targetSec = sec;
                  targetSub = sub;
                  break;
                }
              }
            }
          }
          if (targetCrit) break;
        }
      }

      if (!targetCrit) return;

      const badgeEl = document.getElementById('criterionDetailBadge');
      const secTagEl = document.getElementById('criterionDetailSectionTag');
      const titleEl = document.getElementById('criterionDetailTitle');
      const textEl = document.getElementById('criterionDetailFullText');

      if (badgeEl) badgeEl.textContent = `Critério ${targetCrit.id}`;
      if (secTagEl) {
        const secName = targetSec ? targetSec.title : 'Matriz Oficial';
        const subName = targetSub && targetSub.title ? ` · ${targetSub.title}` : '';
        secTagEl.textContent = `${secName}${subName}`;
      }
      if (titleEl) {
        const mobileFormat = formatCriterionMobileDisplay(targetCrit);
        titleEl.textContent = mobileFormat.mainText || `Critério ${targetCrit.id}`;
      }
      if (textEl) {
        const text = targetCrit.text || '';
        const parenMatch = text.match(/\(([^)]+)\)/);
        if (parenMatch && parenMatch[1].length > 20) {
          let mainPart = text.replace(/\s*\([^)]+\)/, '');
          mainPart = mainPart.replace(/\s+([.,?!;:])/g, '$1').trim();
          const parenPart = parenMatch[1].trim();
          textEl.innerHTML = `
            <div style="font-size:13.5px; font-weight:700; color:var(--text-primary); margin-bottom:12px; line-height:1.5;">
              ${escapeCriterionHtml(mainPart)}
            </div>
            <div style="background:#EFF6FF; border:1px solid #BFDBFE; border-left:4px solid #2563EB; border-radius:8px; padding:10px 12px; font-size:12.5px; color:#1E40AF; line-height:1.5;">
              <div style="font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px; color:#1D4ED8;">
                📌 Notas e Exemplos Práticos da Matriz:
              </div>
              (${escapeCriterionHtml(parenPart)})
            </div>
          `;
        } else if (text.length > 90 && text.includes(':')) {
          const parts = text.split(':');
          const prefix = parts[0].trim();
          const rest = parts.slice(1).join(':').trim();
          textEl.innerHTML = `
            <div style="font-size:14px; font-weight:800; color:var(--primary-dark); margin-bottom:8px;">
              ${escapeCriterionHtml(prefix)}:
            </div>
            <div style="font-size:13px; color:var(--text-primary); line-height:1.6; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:10px 12px;">
              ${escapeCriterionHtml(rest)}
            </div>
          `;
        } else if (text.length > 90 && text.includes('—')) {
          const parts = text.split('—');
          const prefix = parts[0].trim();
          const rest = parts.slice(1).join('—').trim();
          textEl.innerHTML = `
            <div style="font-size:14px; font-weight:800; color:var(--primary-dark); margin-bottom:8px;">
              ${escapeCriterionHtml(prefix)}
            </div>
            <div style="font-size:13px; color:var(--text-primary); line-height:1.6; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:10px 12px;">
              — ${escapeCriterionHtml(rest)}
            </div>
          `;
        } else {
          textEl.textContent = text;
        }
      }

      modal.classList.add('active');
    }

    function closeCriterionDetailModal(e) {
      if (e && e.target && e.target.id !== 'modalCriterionDetail') return;
      const modal = document.getElementById('modalCriterionDetail');
      if (modal) {
        modal.classList.remove('active');
      }
    }

    function executeDeleteDraft() {
      if (!pendingDeleteDraftId) {
        closeConfirmDeleteDraftModal();
        return;
      }

      const idToDelete = pendingDeleteDraftId;
      const obs = (appState.observations || []).find(o => o.id === idToDelete);
      const isCoord = obs ? (obs.evaluatedType === 'coordenador') : false;

      // Remove dos registros globais de observação
      appState.observations = (appState.observations || []).filter(o => o.id !== idToDelete);

      // Desassocia caso seja a observação atualmente carregada na sessão
      if (appState.currentObs && appState.currentObs.id === idToDelete) {
        appState.currentObs = null;
      }

      saveState();
      closeConfirmDeleteDraftModal();
      renderHomeScreen();
      renderHistoryScreen();

      showToast(isCoord ? 'Rascunho de entrevista excluído com sucesso.' : 'Rascunho de observação excluído com sucesso.');
    }

    // Função mantida para retrocompatibilidade segura
    function deleteObservation(id, skipConfirm = false) {
      if (skipConfirm) {
        pendingDeleteDraftId = id;
        executeDeleteDraft();
      } else {
        confirmDeleteObservation(id);
      }
    }

    // --- 10. QUALITATIVE FORMATIVE NOTES (PILAR 13: GESTÃO & RASTREABILIDADE) ---
    function renderNotesScreen() {
      checkAndAutoArchive(true);
      const container = document.getElementById('notesListContainer');
      const filterStatusEl = document.getElementById('notesFilterStatus');
      const filterStatus = filterStatusEl ? filterStatusEl.value : 'active';
      let notes = getScopedNotes();

      // Filtragem por status de gestão
      if (filterStatus === 'active') {
        notes = notes.filter(n => !n.archived);
      } else if (filterStatus === 'pending') {
        notes = notes.filter(n => !n.archived && !n.resolved);
      } else if (filterStatus === 'resolved') {
        notes = notes.filter(n => !n.archived && n.resolved === true);
      } else if (filterStatus === 'archived') {
        notes = notes.filter(n => n.archived === true);
      }

      if (notes.length === 0) {
        container.innerHTML = `
          <div class="card" style="text-align:center; padding:40px; color:var(--text-secondary);">
            Nenhuma ocorrência encontrada para os filtros selecionados.
          </div>
        `;
        return;
      }

      container.innerHTML = '';
      notes.forEach((not) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.borderLeft = not.archived 
          ? '4px solid #94A3B8' 
          : (not.resolved ? '4px solid #16A34A' : '4px solid #EAB308');

        // Status Badge Canônico do Pilar 13
        let badgeHtml = '';
        if (not.archived) {
          badgeHtml = '<span class="status-badge archived">📦 Arquivada</span>';
        } else if (not.resolved) {
          badgeHtml = '<span class="status-badge note" style="background:#DCFCE7; color:#15803D; border:1px solid #86EFAC; font-weight:700;">🟢 Conversado</span>';
        } else {
          badgeHtml = '<span class="status-badge note" style="background:#FEF9C3; color:#A16207; border:1px solid #FDE047; font-weight:700;">🟡 Aguardando Conversa</span>';
        }

        // Metadados MEC da Turma e Conduta
        const shiftBadge = getMECShiftBadgeHtml(not.classShift || not.shift || 'Tempo Parcial (Matutino)');
        const condutaBadge = not.isIndividualConduct 
          ? `<span style="font-size:11px; background:#EFF6FF; color:#1E40AF; padding:2px 6px; border-radius:4px; font-weight:700;">👤 Conduta Individual: ${not.teacherName}</span>`
          : `<span style="font-size:11px; background:#F1F5F9; color:#475569; padding:2px 6px; border-radius:4px; font-weight:700;">👥 Rotina Coletiva da Turma</span>`;

        // Rastreabilidade da Observação Originária
        let obsTraceHtml = '';
        if (not.obsId) {
          const originObs = (appState.observations || []).find(o => o.id === not.obsId);
          const obsDateStr = originObs ? (originObs.date || originObs.startDate || 'Data da visita') : not.date;
          const obsBimStr = originObs ? (originObs.bimester || not.bimester || '') : (not.bimester || '');
          obsTraceHtml = `
            <div style="background:#EFF6FF; border:1px solid #DBEAFE; padding:8px 12px; border-radius:6px; margin-top:8px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
              <div style="font-size:12px; color:#1E40AF;">
                🔗 <strong>Origem:</strong> Observação de <strong>${not.className || 'Turma'}</strong> · ${obsBimStr ? obsBimStr + ' · ' : ''}Em ${obsDateStr}
              </div>
              <button class="btn btn-secondary" style="font-size:11px; padding:3px 8px; color:var(--primary); font-weight:700;" onclick="resumeObservation('${not.obsId}', true)">
                🔍 Ver Observação Vinculada →
              </button>
            </div>
          `;
        }

        // Bloco de Conversa Formativa Concluída
        let resolutionBlockHtml = '';
        if (not.resolved) {
          resolutionBlockHtml = `
            <div style="background:#F0FDF4; border:1px solid #BBF7D0; padding:10px 12px; border-radius:6px; margin-top:8px;">
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:4px;">
                <div style="font-size:12px; font-weight:800; color:#15803D;">
                  💬 Diálogo Formativo Realizado em ${not.resolvedAt || not.date}
                </div>
                <div style="font-size:11px; color:#166534;">
                  Registrado por: <strong>${not.resolvedBy || not.reportedBy}</strong>
                </div>
              </div>
              ${not.resolutionNotes ? `
                <div style="font-size:12px; color:#14532D; margin-top:4px; line-height:1.4;">
                  <strong>Acordos Pedagógicos:</strong> ${not.resolutionNotes}
                </div>
              ` : ''}
            </div>
          `;
        }

        card.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px; flex-wrap:wrap; gap:8px;">
            <div>
              <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                <span style="font-size:15px; font-weight:800; color:var(--primary-dark);">📚 ${not.className || 'Turma'}</span>
                ${shiftBadge}
                ${condutaBadge}
              </div>
              <div style="font-size:12px; color:var(--text-secondary); margin-top:4px;">
                Unidade: <strong>${not.schoolName}</strong> · Registrado em <strong>${not.date}</strong> por <strong>${not.reportedBy}</strong>
              </div>
            </div>
            ${badgeHtml}
          </div>

          <div style="background:#F8FAFC; border:1px solid #E2E8F0; padding:12px; border-radius:8px; font-size:13px; color:var(--text-primary); line-height:1.5; margin-top:8px;">
            ${not.content}
          </div>

          ${resolutionBlockHtml}
          ${obsTraceHtml}

          <div style="display:flex; justify-content:flex-end; align-items:center; gap:8px; margin-top:12px; flex-wrap:wrap;">
            ${!not.resolved && !not.archived ? `
              <button class="btn btn-primary" style="font-size:11px; padding:5px 12px; background:#15803D; border-color:#166534;" onclick="openResolveNoteModal('${not.id}')">
                💬 Marcar como Conversado
              </button>
            ` : ''}
            ${not.resolved && !not.archived ? `
              <button class="btn btn-secondary" style="font-size:11px; padding:5px 10px;" onclick="reopenNoteForConversation('${not.id}')" title="Reabrir ocorrência para novo diálogo">
                ↩️ Reabrir Conversa
              </button>
            ` : ''}
            ${not.archived ? `
              <button class="btn btn-secondary" style="font-size:11px; padding:5px 10px;" onclick="unarchiveNote('${not.id}')" title="Desarquivar ocorrência">
                📥 Desarquivar
              </button>
            ` : `
              <button class="btn btn-secondary" style="font-size:11px; padding:5px 10px;" onclick="archiveNote('${not.id}')" title="Arquivar esta ocorrência">
                📦 Arquivar
              </button>
            `}
            <button class="btn btn-secondary" style="font-size:11px; padding:5px 10px; color:var(--red);" onclick="deleteNote('${not.id}')">
              Excluir
            </button>
          </div>
        `;
        container.appendChild(card);
      });
    }

    function openQualitativeNoteModal() {
      const user = getCurrentUser();
      if (isNucleoEI(user)) {
        showToast('A Coordenadora do Núcleo de EI não realiza lançamento de ocorrências de campo.');
        return;
      }

      // VINCULAÇÃO ESTRITA: Ocorrências exigem observação pedagógica em andamento
      if (!appState.currentObs) {
        showToast('Para registrar uma ocorrência de campo, inicie ou continue uma observação pedagógica.');
        return;
      }

      const obs = appState.currentObs;
      const schoolName = obs.schoolName;
      const className = obs.className;
      const classShift = obs.classShift || (obs.isIntegral ? 'Tempo Integral' : 'Tempo Parcial (Matutino)');
      
      const teacherSelect = document.getElementById('noteTeacher');
      const teacherHint = document.getElementById('noteTeacherHint');
      const subLabel = document.getElementById('subLabelNoteTeacher');
      const btnSave = document.getElementById('btnSaveQualitativeNote');

      // Atualiza o Cabeçalho Contextual do Modal com Padrão MEC
      const ctxClassEl = document.getElementById('noteContextClassName');
      const ctxSchoolEl = document.getElementById('noteContextSchoolName');
      const ctxBadgeEl = document.getElementById('noteContextShiftBadge');
      if (ctxClassEl) ctxClassEl.textContent = className;
      if (ctxSchoolEl) ctxSchoolEl.textContent = schoolName;
      if (ctxBadgeEl) ctxBadgeEl.innerHTML = getMECShiftBadgeHtml(classShift);

      teacherSelect.innerHTML = '';
      if (teacherHint) {
        teacherHint.innerHTML = '';
        teacherHint.style.display = 'none';
      }

      // Identifica os docentes vinculados à turma
      let teachers = (Array.isArray(obs.teachers) && obs.teachers.length > 0) ? [...obs.teachers] : [];
      if (teachers.length === 0) {
        const schoolClasses = getClassesForSchool(schoolName);
        const targetClass = schoolClasses.find(c => c.name === className);
        if (targetClass && Array.isArray(targetClass.teachers) && targetClass.teachers.length > 0) {
          teachers = [...targetClass.teachers];
        } else if (obs.teacherName) {
          teachers = [obs.teacherName];
        }
      }

      // 1. CASO DOCENTE ÚNICO REGENTE: TRAVA MANDATÓRIA
      if (teachers.length === 1) {
        const singleTeacher = teachers[0];
        const opt = document.createElement('option');
        opt.value = singleTeacher;
        opt.text = `${singleTeacher} (Docente Único Regente Titular)`;
        opt.selected = true;
        teacherSelect.appendChild(opt);
        teacherSelect.disabled = true;

        if (subLabel) subLabel.textContent = '(Docente único travado)';
        if (teacherHint) {
          teacherHint.style.display = 'block';
          teacherHint.style.color = 'var(--text-secondary)';
          teacherHint.innerHTML = `🔒 <strong>Docente único titular:</strong> Ocorrência vinculada a <strong>${singleTeacher}</strong>.`;
        }
      }
      // 2. CASO REGÊNCIA COMPARTILHADA (2 OU MAIS DOCENTES / TEMPO INTEGRAL):
      // Opção primária: Toda a Turma (Rotina Coletiva). Opções secundárias: Conduta Individual
      else if (teachers.length >= 2) {
        teacherSelect.disabled = false;

        // Opção Primária Coletiva
        const optTurma = document.createElement('option');
        optTurma.value = '__TURMA_GERAL__';
        optTurma.text = '👥 Toda a Turma / Ambas as Regentes (Rotina Coletiva da Sala)';
        optTurma.selected = true;
        teacherSelect.appendChild(optTurma);

        // Opções Nominais Individuais
        teachers.forEach((tName, idx) => {
          const opt = document.createElement('option');
          opt.value = tName;
          opt.text = `👤 ${tName} (Conduta Individual · Docente Regente ${String.fromCharCode(65 + idx)})`;
          teacherSelect.appendChild(opt);
        });

        if (subLabel) subLabel.textContent = '(Selecione se for conduta individual)';
        if (teacherHint) {
          teacherHint.style.display = 'block';
          teacherHint.style.color = '#1D4ED8';
          teacherHint.innerHTML = `👥 <strong>Atribuição Primária à Turma:</strong> Mantenha em <em>Toda a Turma</em> para aspectos da rotina ou escolha a docente se houver conduta individual.`;
        }
      }
      // 3. SEM DOCENTES ATRIBUÍDOS
      else {
        const opt = document.createElement('option');
        opt.value = '__TURMA_GERAL__';
        opt.text = '👥 Toda a Turma (Equipe Docente)';
        opt.selected = true;
        teacherSelect.appendChild(opt);
        teacherSelect.disabled = false;
      }

      if (btnSave) {
        btnSave.disabled = false;
        btnSave.style.opacity = '1';
        btnSave.style.cursor = 'pointer';
      }

      document.getElementById('noteContent').value = '';
      document.getElementById('modalQualitativeNote').classList.add('active');
    }

    function closeQualitativeNoteModal() {
      document.getElementById('modalQualitativeNote').classList.remove('active');
    }

    function saveQualitativeNote() {
      const user = getCurrentUser();

      if (!appState.currentObs) {
        showToast('Nenhuma observação pedagógica em andamento para vincular a ocorrência.');
        return;
      }

      const obs = appState.currentObs;
      const schoolName = obs.schoolName;
      const className = obs.className;
      const classId = obs.classId || null;
      const classShift = formatMECShift(obs.classShift || (obs.isIntegral ? 'Tempo Integral' : 'Tempo Parcial (Matutino)'));

      const teacherSelect = document.getElementById('noteTeacher');
      const rawTeacherVal = teacherSelect ? teacherSelect.value : '__TURMA_GERAL__';
      const content = document.getElementById('noteContent').value.trim();

      if (!content) {
        showToast('Por favor, informe a anotação formativa dos fatos observados.');
        return;
      }

      const isIndividualConduct = (rawTeacherVal !== '__TURMA_GERAL__');
      const teacherName = isIndividualConduct ? rawTeacherVal : 'Geral da Turma (Rotina Coletiva)';

      const targetClassObj = getClassesForSchool(schoolName).find(c => c.name === className);
      const teachersList = (Array.isArray(obs.teachers) && obs.teachers.length > 0)
        ? obs.teachers
        : ((targetClassObj && targetClassObj.teachers) ? targetClassObj.teachers : (isIndividualConduct ? [teacherName] : []));

      const newNote = {
        id: 'not-' + Date.now(),
        date: new Date().toISOString().split('T')[0],
        schoolName: schoolName,
        className: className,
        classId: classId || targetClassObj?.id || null,
        classShift: classShift,
        targetType: 'turma',
        isIndividualConduct: isIndividualConduct,
        teacherName: teacherName,
        teachers: teachersList,
        reportedBy: user.name,
        topic: isIndividualConduct ? `Ocorrência: ${teacherName}` : 'Ocorrência: Toda a Turma',
        content: content,
        resolved: false,
        resolvedAt: null,
        resolvedBy: null,
        resolutionNotes: '',
        archived: false,
        obsId: obs.id,
        bimester: obs.bimester || 'Bimestre Corrente',
        isSample: false
      };

      appState.notes.unshift(newNote);

      // Vinculação mandatória e imediata à observação ativa
      if (!obs.linkedNotes) {
        obs.linkedNotes = [];
      }
      const labelDocente = isIndividualConduct ? `[Docente: ${teacherName}]` : '[Toda a Turma]';
      const textToLink = `${labelDocente} ${newNote.content}`;
      if (!obs.linkedNotes.includes(textToLink)) {
        obs.linkedNotes.push(textToLink);
      }

      saveState();
      closeQualitativeNoteModal();
      applyUserRoleUI();

      if (document.getElementById('screenNotes').classList.contains('active')) {
        renderNotesScreen();
      }
      if (document.getElementById('screenSynthesis').classList.contains('active')) {
        renderSynthesisScreen();
      }

      showToast('Ocorrência de campo registrada com sucesso!');
    }

    // Modal de Resolução e Diálogo Formativo (Pilar 13)
    function openResolveNoteModal(noteId) {
      const note = appState.notes.find(n => n.id === noteId);
      if (!note) return;

      document.getElementById('resolveNoteTargetId').value = noteId;
      const headerEl = document.getElementById('resolveNoteSummaryHeader');
      const contentEl = document.getElementById('resolveNoteSummaryContent');
      if (headerEl) {
        headerEl.textContent = `📚 ${note.className} · ${note.isIndividualConduct ? 'Docente: ' + note.teacherName : 'Rotina Coletiva da Turma'}`;
      }
      if (contentEl) {
        contentEl.textContent = `"${note.content}"`;
      }

      const dateEl = document.getElementById('resolveNoteDate');
      if (dateEl) {
        const todayStr = getTodayDateString();
        dateEl.value = todayStr;
        dateEl.max = todayStr;
      }
      const notesEl = document.getElementById('resolveNoteResolutionNotes');
      if (notesEl) {
        notesEl.value = '';
      }

      document.getElementById('modalResolveNote').classList.add('active');
    }

    function closeResolveNoteModal() {
      document.getElementById('modalResolveNote').classList.remove('active');
    }

    function confirmResolveNote() {
      const noteId = document.getElementById('resolveNoteTargetId').value;
      const note = appState.notes.find(n => n.id === noteId);
      if (!note) return;

      const dateVal = document.getElementById('resolveNoteDate').value || getTodayDateString();
      const resolutionNotes = document.getElementById('resolveNoteResolutionNotes').value.trim();
      const user = getCurrentUser();

      if (!resolutionNotes) {
        showToast('Por favor, registre os acordos pedagógicos e encaminhamentos acordados no diálogo.');
        return;
      }

      note.resolved = true;
      note.resolvedAt = dateVal;
      note.resolvedBy = user.name;
      note.resolutionNotes = resolutionNotes;

      saveState();
      closeResolveNoteModal();
      renderNotesScreen();
      applyUserRoleUI();
      showToast('Ocorrência marcada como CONVERSADA e diálogo formativo registrado!');
    }

    function reopenNoteForConversation(noteId) {
      const note = appState.notes.find(n => n.id === noteId);
      if (!note) return;

      if (!confirm('Deseja reabrir esta ocorrência para novo diálogo formativo?')) return;

      note.resolved = false;
      saveState();
      renderNotesScreen();
      applyUserRoleUI();
      showToast('Ocorrência reaberta como pendente de diálogo.');
    }

    function resolveNote(id) {
      openResolveNoteModal(id);
    }

    function deleteNote(id) {
      appState.notes = appState.notes.filter(x => x.id !== id);
      saveState();
      renderNotesScreen();
      applyUserRoleUI();
      showToast('Anotação removida.');
    }

    function archiveNote(id) {
      const n = appState.notes.find(x => x.id === id);
      if (n) {
        n.archived = true;
        n.manuallyUnarchived = false;
        saveState();
        renderNotesScreen();
        applyUserRoleUI();
        showToast('Ocorrência arquivada com sucesso! Movida para Ocorrências Arquivadas.');
      }
    }

    function unarchiveNote(id) {
      const n = appState.notes.find(x => x.id === id);
      if (n) {
        n.archived = false;
        n.manuallyUnarchived = true;
        saveState();
        renderNotesScreen();
        applyUserRoleUI();
        showToast('Ocorrência desarquivada com sucesso! Movida para Ocorrências Ativas.');
      }
    }

    function archiveAllResolvedNotes() {
      const scopedNotes = getScopedNotes();
      const resolvedActive = scopedNotes.filter(n => n.resolved && !n.archived);

      if (resolvedActive.length === 0) {
        showToast('Não há ocorrências conversadas ativas para arquivar.');
        return;
      }

      if (!confirm(`Deseja arquivar ${resolvedActive.length} ocorrência(s) já conversada(s)?`)) {
        return;
      }

      resolvedActive.forEach(n => {
        n.archived = true;
        n.manuallyUnarchived = false;
      });

      saveState();
      renderNotesScreen();
      applyUserRoleUI();
      showToast(`${resolvedActive.length} ocorrência(s) arquivada(s) com sucesso!`);
    }

