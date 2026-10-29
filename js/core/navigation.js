    // --- 5. NAVIGATION ---
    function navigateToTab(tabName, subFilter = null) {
      const user = getCurrentUser();

      if (tabName === 'schedule' && (isNucleoEI(user) || user.roleKey === 'pendente' || user.roleKey === 'professora')) {
        showToast('Acesso ao cronograma restrito.');
        return;
      }
      if (tabName === 'history' && (isNucleoEI(user) || user.roleKey === 'pendente')) {
        showToast('Acesso ao histórico restrito: a Coordenadora do Núcleo de EI não realiza observações.');
        return;
      }
      if ((tabName === 'opManagement' || tabName === 'units' || tabName === 'rubricsAdmin' || tabName === 'admin' || tabName === 'team') && (user.roleKey === 'pendente' || user.roleKey === 'professora')) {
        showToast('Acesso restrito ao perfil docente.');
        return;
      }


      document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));
      document.querySelectorAll('.nav-link, .tabbar-item').forEach(t => t.classList.remove('active'));

      // Mapeamento canônico da tela alvo para blindagem fail-safe antecipada
      const screenMap = {
        'home': 'screenHome',
        'opManagement': 'screenHome',
        'units': 'screenHome',
        'team': 'screenHome',
        'schedule': 'screenSchedule',
        'indicators': 'screenIndicators',
        'history': 'screenHistory',
        'notes': 'screenNotes',
        'refDocs': 'screenRefDocs',
        'rubrics': 'screenRubricsAdmin'
      };
      const targetScreenId = screenMap[tabName] || 'screenHome';
      const targetScreenEl = document.getElementById(targetScreenId);
      if (targetScreenEl) {
        targetScreenEl.classList.add('active');
      }

      try {
        if (tabName === 'opManagement' || tabName === 'units') {
          const opNav = document.getElementById('deskTabOpManagement');
          if (opNav && opNav.style.display !== 'none') {
            opNav.classList.add('active');
          } else {
            document.getElementById('deskTabHome')?.classList.add('active');
          }
          if (targetScreenEl) targetScreenEl.classList.add('active');
          const homeStandardView = document.getElementById('homeStandardView');
          const homeGestaoView = document.getElementById('homeGestaoView');
          if (homeStandardView) homeStandardView.style.display = 'none';
          if (homeGestaoView) homeGestaoView.style.display = 'block';
          
          let initialSubTab = 'units';
          if (user.roleKey === 'coordenador') {
            initialSubTab = appState.currentPedagSubTab || 'classes';
          } else {
            initialSubTab = appState.currentPedagSubTab || 'units';
          }
          switchPedagSubTab(initialSubTab);
        } else if (tabName === 'home') {
          document.getElementById('deskTabHome')?.classList.add('active');
          document.getElementById('mobTabHome')?.classList.add('active');
          renderHomeScreen();
          if (targetScreenEl) targetScreenEl.classList.add('active');
        } else if (tabName === 'schedule') {
          document.getElementById('deskTabSchedule')?.classList.add('active');
          document.getElementById('mobTabSchedule')?.classList.add('active');
          renderScheduleScreen();
          if (targetScreenEl) targetScreenEl.classList.add('active');
        } else if (tabName === 'indicators') {
          document.getElementById('deskTabDiag')?.classList.add('active');
          document.getElementById('mobTabDiag')?.classList.add('active');
          renderIndicatorsScreen();
          if (targetScreenEl) targetScreenEl.classList.add('active');
        } else if (tabName === 'history') {
          document.getElementById('deskTabHist')?.classList.add('active');
          if(document.getElementById('mobTabMenu')) document.getElementById('mobTabMenu').classList.add('active');
          if (subFilter) appState.historyFilter = subFilter;
          renderHistoryScreen();
          if (targetScreenEl) targetScreenEl.classList.add('active');
        } else if (tabName === 'notes') {
          document.getElementById('deskTabNotes')?.classList.add('active');
          if(document.getElementById('mobTabMenu')) document.getElementById('mobTabMenu').classList.add('active');
          renderNotesScreen();
          if (targetScreenEl) targetScreenEl.classList.add('active');
        } else if (tabName === 'refDocs') {
          document.getElementById('deskTabRefDocs')?.classList.add('active');
          if(document.getElementById('mobTabMenu')) document.getElementById('mobTabMenu').classList.add('active');
          renderRefDocsScreen();
          if (targetScreenEl) targetScreenEl.classList.add('active');
        } else if (tabName === 'team') {
          document.getElementById('deskTabHome')?.classList.add('active');
          if (targetScreenEl) targetScreenEl.classList.add('active');
          const homeStandardView = document.getElementById('homeStandardView');
          const homeGestaoView = document.getElementById('homeGestaoView');
          if (homeStandardView) homeStandardView.style.display = 'none';
          if (homeGestaoView) homeGestaoView.style.display = 'block';
          switchPedagSubTab('team');
        } else if (tabName === 'rubrics') {
          document.getElementById('deskTabAdmin')?.classList.add('active');
          if(document.getElementById('mobTabMenu')) document.getElementById('mobTabMenu').classList.add('active');
          renderRubricsAdminScreen();
          if (targetScreenEl) targetScreenEl.classList.add('active');
        }
      } catch (errRender) {
        console.error(`Erro de renderização ao navegar para [${tabName}]:`, errRender);
        if (targetScreenEl && (!targetScreenEl.innerHTML || !targetScreenEl.innerHTML.trim())) {
          targetScreenEl.innerHTML = `
            <div class="card" style="margin: 20px; text-align: center; padding: 30px;">
              <h3 style="color: var(--primary);">Recuperação Automática de Interface</h3>
              <p style="color: var(--text-secondary); margin: 12px 0;">Ocorreu uma instabilidade pontual ao carregar esta tela.</p>
              <button class="btn btn-primary" onclick="navigateToTab('home')">Voltar ao Início</button>
            </div>
          `;
        }
        if (targetScreenEl) targetScreenEl.classList.add('active');
      }

      // Restaura barra inferior principal e oculta barra de dimensões / FAB
      const mainTabbar = document.getElementById('mainMobileTabbar') || document.querySelector('.mobile-tabbar');
      if (mainTabbar) mainTabbar.style.display = '';
      const dimBottomBar = document.getElementById('dimBottomBar');
      if (dimBottomBar) dimBottomBar.style.display = 'none';
      const fabContainer = document.getElementById('fabActiveObsContainer');
      if (fabContainer) fabContainer.style.display = 'none';
      if (typeof toggleFabMenu === 'function') toggleFabMenu(false);

      // A tarja de modo somente leitura é exclusiva de observações finalizadas em visualização
      const roWarning = document.getElementById('readOnlyWarning');
      if (roWarning) roWarning.style.display = 'none';
      appState.isReadOnly = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Retorna exclusivamente observações pendentes que o usuário ativo tem permissão para iniciar/observar
    function getActionablePendingSchedules() {
      const user = getCurrentUser();
      const scopedSchedules = getScopedSchedules();
      const pending = scopedSchedules.filter(s => {
        if (s.archived || s.status === 'realizado') return false;
        // Blindagem resiliente: se já houver observação finalizada vinculada, desconsidera
        if (typeof findObservationForSchedule === 'function') {
          const obs = findObservationForSchedule(s);
          if (obs && (obs.status === 'finalized' || obs.status === 'concluida')) return false;
        }
        return true;
      });

      if (user.roleKey === 'formador') {
        // Formadora observa unicamente Coordenadoras do seu polo
        return pending.filter(s => {
          const isCoordTarget = s.targetType === 'coordenador' || (s.className && s.className.toLowerCase().includes('coord'));
          const tm = (appState.teamMembers || []).find(m => 
            m.name === s.targetName || 
            (typeof resolveCanonicalUserName === 'function' && resolveCanonicalUserName(m.name) === resolveCanonicalUserName(s.targetName))
          );
          return isCoordTarget || (tm && tm.roleKey === 'coordenador');
        });
      } else if (user.roleKey === 'coordenador') {
        // Coordenadora observa Turmas e Docentes da sua unidade escolar (Pilar 1)
        return pending.filter(s => {
          if (s.schoolName !== user.school) return false;
          // Exclui observações de coordenação pedagógica (que cabem à formadora)
          if (s.targetType === 'coordenador' || (s.className && s.className.toLowerCase().includes('coord'))) return false;
          return true;
        });
      }
      return [];
    }

    function handleNewObsButtonClick() {
      const user = getCurrentUser();
      if (isNucleoEI(user)) {
        showToast('A Coordenadora do Núcleo de EI não aplica avaliações diretas.');
        return;
      }

      // 1. Verifica observações pendentes de atribuição direta do usuário ativo
      const pendingSchedules = getActionablePendingSchedules();

      // 2. Se houver agendamentos pertinentes, abre o modal de escolha prévia
      if (pendingSchedules.length > 0) {
        openSelectScheduledObsModal();
      } else {
        // Se não houver, segue diretamente para a configuração em branco
        openSetupScreen(null);
      }
    }

    function openSelectScheduledObsModal() {
      const modal = document.getElementById('modalSelectScheduledObs');
      const listContainer = document.getElementById('selectScheduledObsList');
      if (!modal || !listContainer) {
        openSetupScreen(null);
        return;
      }

      const pendingSchedules = getActionablePendingSchedules();

      if (pendingSchedules.length === 0) {
        openSetupScreen(null);
        return;
      }

      // Ordena: data mais próxima primeiro
      pendingSchedules.sort((a, b) => (a.plannedDate || '').localeCompare(b.plannedDate || ''));

      const countTextEl = document.getElementById('selectScheduledObsCountText');
      if (countTextEl) {
        countTextEl.innerText = `Identificamos ${pendingSchedules.length} observação(ões) planejada(s) sob sua supervisão direta. Selecione um agendamento abaixo para iniciar ou opte por uma observação avulsa.`;
      }

      const todayStr = getTodayDateString();
      listContainer.innerHTML = '';

      pendingSchedules.forEach(s => {
        let badgeHtml = '';
        if (s.plannedDate === todayStr) {
          badgeHtml = `<span style="font-size:11px; font-weight:700; background:#DCFCE7; color:#166534; padding:2px 8px; border-radius:12px;">● Prevista para Hoje</span>`;
        } else if (s.plannedDate < todayStr) {
          badgeHtml = `<span style="font-size:11px; font-weight:700; background:#FEE2E2; color:#991B1B; padding:2px 8px; border-radius:12px;">⚠ Em Atraso (${formatDateBR(s.plannedDate)})</span>`;
        } else {
          badgeHtml = `<span style="font-size:11px; font-weight:700; background:#EFF6FF; color:#1E40AF; padding:2px 8px; border-radius:12px;">🗓️ Prevista (${formatDateBR(s.plannedDate)})</span>`;
        }

        const card = document.createElement('div');
        card.style.cssText = 'background:#FFFFFF; border:1px solid #E2E8F0; border-radius:10px; padding:12px 14px; display:flex; justify-content:space-between; align-items:center; gap:12px; box-shadow:var(--shadow-sm); transition:border-color 0.15s, background 0.15s;';
        card.onmouseenter = () => { card.style.borderColor = 'var(--primary)'; card.style.background = '#F8FAFC'; };
        card.onmouseleave = () => { card.style.borderColor = '#E2E8F0'; card.style.background = '#FFFFFF'; };

        card.innerHTML = `
          <div style="flex:1;">
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px; flex-wrap:wrap;">
              <span style="font-size:14px; font-weight:800; color:var(--text-primary);">${s.targetName}</span>
              ${badgeHtml}
            </div>
            <div style="font-size:12px; color:var(--text-secondary); line-height:1.4;">
              <strong>Escola:</strong> ${s.schoolName}<br>
              <strong>Bimestre:</strong> <span style="font-weight:700; color:var(--primary);">${s.bimester}</span> · 
              <strong>Função/Turma:</strong> ${s.className || 'Educação Infantil'} · 
              <strong>Horário:</strong> ${s.plannedTime || '08:00'}
            </div>
          </div>
          <div>
            <button class="btn btn-primary" style="white-space:nowrap; padding:7px 12px; font-size:12px; font-weight:700;" onclick="startObsFromScheduledModal('${s.id}')">
              Iniciar Observação →
            </button>
          </div>
        `;
        listContainer.appendChild(card);
      });

      modal.classList.add('active');
    }

    function closeSelectScheduledObsModal() {
      const modal = document.getElementById('modalSelectScheduledObs');
      if (modal) modal.classList.remove('active');
    }

    function startObsFromScheduledModal(scheduleId) {
      closeSelectScheduledObsModal();
      openSetupScreenFromSchedule(scheduleId);
    }

    function startBlankObsFromModal() {
      closeSelectScheduledObsModal();
      openSetupScreen(null);
    }

    function openSetupScreen(prefilledSchedule = null) {
      const user = getCurrentUser();

      // BLINDAGEM CANÔNICA DE CARGO
      if (prefilledSchedule) {
        const targetMember = (appState.teamMembers || []).find(m => m.name === prefilledSchedule.targetName);
        if (user.roleKey === 'formador' && targetMember && targetMember.roleKey === 'professora') {
          showToast('Ação bloqueada: Formadoras acompanham coordenadoras e não realizam observação direta de professoras.');
          navigateToTab('home');
          return;
        }
        if (user.roleKey === 'coordenador' && targetMember && targetMember.roleKey !== 'professora') {
          showToast('Ação bloqueada: Coordenadoras avaliam exclusivamente turmas e professoras da unidade escolar.');
          navigateToTab('home');
          return;
        }
      }

      document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));
      document.getElementById('screenSetup').classList.add('active');

      const roWarning = document.getElementById('readOnlyWarning');
      if (roWarning) roWarning.style.display = 'none';
      appState.isReadOnly = false;

      appState.currentSetupScheduleId = prefilledSchedule ? prefilledSchedule.id : null;

      const titleEl = document.getElementById('setupScreenTitle');
      const hintEl = document.getElementById('setupRoleHint');
      const schoolSelect = document.getElementById('setupSchool');
      const classGroup = document.getElementById('groupSetupClass');
      const teachersCard = document.getElementById('groupSetupTeachersCard');
      const targetGroup = document.getElementById('groupSetupTargetPerson');
      const targetLabel = document.getElementById('setupTargetPersonLabel');

      schoolSelect.innerHTML = '';

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
        targetLabel.innerText = 'Coordenadora Pedagógica Avaliada';
        schoolSelect.disabled = false;

        const poloUnits = (appState.units || []).filter(u => u.polo === user.school).map(u => u.name);
        const supervisedCoords = (appState.teamMembers || []).filter(m => m.roleKey === 'coordenador' && (m.supervisor === user.name || poloUnits.includes(m.school)));
        const availableSchools = Array.from(new Set([...poloUnits, ...supervisedCoords.map(c => c.school)])).filter(Boolean);

        if (availableSchools.length === 0) {
          (appState.units || []).forEach(u => availableSchools.push(u.name));
        }

        availableSchools.forEach(s => {
          const opt = document.createElement('option');
          opt.value = s;
          opt.text = s;
          schoolSelect.appendChild(opt);
        });
      }

      onSetupSchoolChange();

      const todayStr = getTodayDateString();
      const setupDateEl = document.getElementById('setupDate');
      const setupStartEl = document.getElementById('setupStartTime');
      const setupEndEl = document.getElementById('setupEndTime');

      if (setupDateEl) {
        setupDateEl.max = todayStr;
        setupDateEl.value = todayStr;
      }
      if (setupStartEl) {
        setupStartEl.value = getNowTimeString();
      }
      if (setupEndEl) {
        setupEndEl.value = addMinutesToTime(setupStartEl ? setupStartEl.value : getNowTimeString(), 90);
      }

      // Atualiza o seletor rápido de agendamento pendente no topo do setup (APENAS OBSERVAÇÕES ACIONÁVEIS)
      const scheduleSelectGroup = document.getElementById('setupScheduleSelectorGroup');
      const scheduleSelect = document.getElementById('setupLinkedSchedule');
      if (scheduleSelectGroup && scheduleSelect) {
        const pendingSchedules = getActionablePendingSchedules();

        if (pendingSchedules.length > 0) {
          scheduleSelectGroup.style.display = 'block';
          scheduleSelect.innerHTML = '<option value="">-- Observação Avulsa (Não vinculada ao cronograma) --</option>';
          pendingSchedules.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.id;
            opt.text = `${s.targetName} (${s.bimester} · ${formatDateBR(s.plannedDate)} · ${s.schoolName})`;
            scheduleSelect.appendChild(opt);
          });
          scheduleSelect.value = prefilledSchedule ? prefilledSchedule.id : '';
        } else {
          scheduleSelectGroup.style.display = 'none';
        }
      }

      // Se houver observação do cronograma vinculada
      if (prefilledSchedule) {
        if (prefilledSchedule.schoolName) schoolSelect.value = prefilledSchedule.schoolName;
        onSetupSchoolChange();

        if (user.roleKey === 'coordenador') {
          const classSelect = document.getElementById('setupClass');
          if (classSelect && prefilledSchedule.className) {
            const targetCls = Array.from(classSelect.options).find(opt => 
              opt.value === prefilledSchedule.className || 
              opt.value.toLowerCase().includes(prefilledSchedule.className.toLowerCase()) ||
              prefilledSchedule.className.toLowerCase().includes(opt.value.toLowerCase())
            );
            if (targetCls) {
              classSelect.value = targetCls.value;
            } else {
              classSelect.value = prefilledSchedule.className;
            }
            onSetupClassChange();
          }
        } else {
          const targetSelect = document.getElementById('setupTargetPerson');
          if (targetSelect && prefilledSchedule.targetName) {
            targetSelect.value = prefilledSchedule.targetName;
            onSetupTeacherChange();
          }
        }

        if (prefilledSchedule.bimester) {
          const bimSelect = document.getElementById('setupBimester');
          if (bimSelect) bimSelect.value = prefilledSchedule.bimester;
        }

        // Bloqueio de data futura vinda de agendamento do cronograma:
        if (prefilledSchedule.plannedDate) {
          if (prefilledSchedule.plannedDate > todayStr) {
            setupDateEl.value = todayStr;
            showToast(`A observação agendada era futura (${formatDateBR(prefilledSchedule.plannedDate)}). A data foi ajustada para hoje.`);
          } else {
            setupDateEl.value = prefilledSchedule.plannedDate;
          }
        }
        if (prefilledSchedule.plannedTime) {
          const startInput = document.getElementById('setupStartTime');
          if (startInput) startInput.value = prefilledSchedule.plannedTime;
          const endInput = document.getElementById('setupEndTime');
          if (endInput) endInput.value = addMinutesToTime(prefilledSchedule.plannedTime, 90);
        }
      }

      validateSetupDateUI();
      updateSetupBimesterValidationUI();
    }

    function onSetupLinkedScheduleChange() {
      const scheduleSelect = document.getElementById('setupLinkedSchedule');
      if (!scheduleSelect) return;
      const schedId = scheduleSelect.value;
      if (!schedId) {
        appState.currentSetupScheduleId = null;
        return;
      }
      const sched = appState.schedules.find(s => s.id === schedId);
      if (sched) {
        openSetupScreen(sched);
      }
    }

    function onSetupSchoolChange() {
      const user = getCurrentUser();
      const schoolName = document.getElementById('setupSchool').value;

      if (user.roleKey === 'coordenador') {
        // Popula o seletor de TURMAS da Unidade Escolar
        const classSelect = document.getElementById('setupClass');
        classSelect.innerHTML = '';

        const schoolClasses = getClassesForSchool(schoolName);
        schoolClasses.forEach(cls => {
          const opt = document.createElement('option');
          opt.value = cls.name;
          const teacherCount = cls.teachers ? cls.teachers.length : 0;
          const teacherText = teacherCount > 0 ? ` (${teacherCount} regente${teacherCount > 1 ? 's' : ''})` : ' (Sem regente atribuída)';
          opt.text = `${cls.name} · ${formatMECShift(cls.shift)}${teacherText}`;
          classSelect.appendChild(opt);
        });

        onSetupClassChange();

      } else if (user.roleKey === 'formador') {
        const targetSelect = document.getElementById('setupTargetPerson');
        targetSelect.innerHTML = '';

        let candidates = appState.teamMembers.filter(m => m.roleKey === 'coordenador' && m.school === schoolName);
        candidates = candidates.filter(m => m.name !== user.name);

        if (candidates.length === 0) {
          const opt = document.createElement('option');
          opt.value = '';
          opt.text = 'Nenhuma coordenadora disponível nesta unidade';
          targetSelect.appendChild(opt);
          return;
        }

        candidates.forEach(t => {
          const opt = document.createElement('option');
          opt.value = t.name;
          opt.text = `${t.name} (${t.roleTitle || 'Coordenadora Pedagógica'})`;
          targetSelect.appendChild(opt);
        });

        onSetupTeacherChange();
      }
    }

    // Controle temporário de turnos no Setup para Turmas Integrais
    let currentSetupIntegralMorningTeachers = [];
    let currentSetupIntegralAfternoonTeachers = [];

    function renderSetupIntegralTeachersUI() {
      const teachersListEl = document.getElementById('setupClassTeachersList');
      if (!teachersListEl) return;
      teachersListEl.innerHTML = '';
      teachersListEl.style.flexDirection = 'column';
      teachersListEl.style.width = '100%';

      const container = document.createElement('div');
      container.style.cssText = 'display:flex; flex-direction:column; gap:12px; width:100%;';

      // Bloco Manhã
      const morningBox = document.createElement('div');
      morningBox.style.cssText = 'background:#FFFFFF; border:1px solid #DDD6FE; border-radius:8px; padding:10px 12px; box-shadow:0 1px 2px rgba(0,0,0,0.04);';
      let morningHtml = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <div style="font-size:12px; font-weight:800; color:#6D28D9; display:flex; align-items:center; gap:6px;">
            <span>☀️</span> <span>Turno Matutino (Manhã · ${currentSetupIntegralMorningTeachers.length} Docentes)</span>
          </div>
          <span style="font-size:10px; background:#FAF5FF; color:#7C3AED; border:1px solid #E9D5FF; padding:1px 6px; border-radius:10px; font-weight:700;">Etapa 1</span>
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:8px;">
      `;
      if (currentSetupIntegralMorningTeachers.length === 0) {
        morningHtml += '<span style="font-size:11px; color:#DC2626; font-style:italic;">Nenhuma docente alocada na manhã.</span>';
      } else {
        currentSetupIntegralMorningTeachers.forEach(tName => {
          morningHtml += `
            <div style="background:#F5F3FF; border:1px solid #DDD6FE; border-radius:18px; padding:3px 10px; font-size:12px; font-weight:700; color:#5B21B6; display:inline-flex; align-items:center; gap:8px;">
              <span>👩‍🏫 ${tName}</span>
              <button type="button" 
                      onclick="moveTeacherToShift('${tName}', 'afternoon')" 
                      title="Mover para o Turno Vespertino (Tarde)"
                      style="background:#EDE9FE; border:1px solid #C4B5FD; color:#6D28D9; border-radius:10px; font-size:10px; font-weight:700; padding:2px 6px; cursor:pointer;">
                ⇄ Passar p/ Tarde
              </button>
            </div>
          `;
        });
      }
      morningHtml += '</div>';
      morningBox.innerHTML = morningHtml;
      container.appendChild(morningBox);

      // Bloco Tarde
      const afternoonBox = document.createElement('div');
      afternoonBox.style.cssText = 'background:#FFFFFF; border:1px solid #FED7AA; border-radius:8px; padding:10px 12px; box-shadow:0 1px 2px rgba(0,0,0,0.04);';
      let afternoonHtml = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <div style="font-size:12px; font-weight:800; color:#C2410C; display:flex; align-items:center; gap:6px;">
            <span>🌅</span> <span>Turno Vespertino (Tarde · ${currentSetupIntegralAfternoonTeachers.length} Docentes)</span>
          </div>
          <span style="font-size:10px; background:#FFF7ED; color:#EA580C; border:1px solid #FFEDD5; padding:1px 6px; border-radius:10px; font-weight:700;">Etapa 2</span>
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:8px;">
      `;
      if (currentSetupIntegralAfternoonTeachers.length === 0) {
        afternoonHtml += '<span style="font-size:11px; color:#DC2626; font-style:italic;">Nenhuma docente alocada na tarde.</span>';
      } else {
        currentSetupIntegralAfternoonTeachers.forEach(tName => {
          afternoonHtml += `
            <div style="background:#FFF7ED; border:1px solid #FDBA74; border-radius:18px; padding:3px 10px; font-size:12px; font-weight:700; color:#9A3412; display:inline-flex; align-items:center; gap:8px;">
              <span>👩‍🏫 ${tName}</span>
              <button type="button" 
                      onclick="moveTeacherToShift('${tName}', 'morning')" 
                      title="Mover para o Turno Matutino (Manhã)"
                      style="background:#FFEDD5; border:1px solid #FDBA74; color:#C2410C; border-radius:10px; font-size:10px; font-weight:700; padding:2px 6px; cursor:pointer;">
                ⇄ Passar p/ Manhã
              </button>
            </div>
          `;
        });
      }
      afternoonHtml += '</div>';
      afternoonBox.innerHTML = afternoonHtml;
      container.appendChild(afternoonBox);

      teachersListEl.appendChild(container);
    }

    function moveTeacherToShift(teacherName, targetShift) {
      if (targetShift === 'afternoon') {
        currentSetupIntegralMorningTeachers = currentSetupIntegralMorningTeachers.filter(t => t !== teacherName);
        if (!currentSetupIntegralAfternoonTeachers.includes(teacherName)) {
          currentSetupIntegralAfternoonTeachers.push(teacherName);
        }
      } else if (targetShift === 'morning') {
        currentSetupIntegralAfternoonTeachers = currentSetupIntegralAfternoonTeachers.filter(t => t !== teacherName);
        if (!currentSetupIntegralMorningTeachers.includes(teacherName)) {
          currentSetupIntegralMorningTeachers.push(teacherName);
        }
      }
      renderSetupIntegralTeachersUI();
    }

    function onSetupClassChange() {
      const user = getCurrentUser();
      const schoolName = document.getElementById('setupSchool').value;
      const classSelect = document.getElementById('setupClass');
      if (!classSelect) return;
      const className = classSelect.value;

      const schoolClasses = getClassesForSchool(schoolName);
      const targetClass = schoolClasses.find(c => c.name === className);

      const shiftBadge = document.getElementById('setupClassShiftBadge');
      const teachersListEl = document.getElementById('setupClassTeachersList');
      const isIntegral = isClassIntegral(targetClass?.shift || targetClass?.name || '');
      const integralNotice = document.getElementById('setupIntegralNotice');
      const startBtn = document.getElementById('btnStartObservation');

      if (targetClass) {
        if (shiftBadge) {
          if (isIntegral) {
            shiftBadge.innerText = '🌟 Tempo Integral (2 Turnos: Manhã + Tarde)';
            shiftBadge.style.background = '#FAF5FF';
            shiftBadge.style.color = '#7C3AED';
            shiftBadge.style.border = '1px solid #DDD6FE';
          } else {
            const formattedShift = formatMECShift(targetClass.shift);
            if (formattedShift === 'Tempo Parcial (Vespertino)') {
              shiftBadge.innerText = '⛅ Tempo Parcial (Vespertino)';
              shiftBadge.style.background = '#EFF6FF';
              shiftBadge.style.color = '#1E40AF';
              shiftBadge.style.border = '1px solid #BFDBFE';
            } else {
              shiftBadge.innerText = '☀️ Tempo Parcial (Matutino)';
              shiftBadge.style.background = '#EFF6FF';
              shiftBadge.style.color = '#1E40AF';
              shiftBadge.style.border = '1px solid #BFDBFE';
            }
          }
        }
        if (integralNotice) {
          integralNotice.style.display = isIntegral ? 'block' : 'none';
        }
        if (startBtn) {
          startBtn.innerText = isIntegral ? 'INICIAR OBSERVAÇÃO · ETAPA 1 (TURNO MATUTINO) →' : 'INICIAR INSTRUMENTO DE OBSERVAÇÃO →';
        }
        if (teachersListEl) {
          if (isIntegral) {
            // Inicializa listas de docentes por turno a partir da turma
            const mTeachers = (targetClass.teachersMorning && targetClass.teachersMorning.length > 0)
              ? [...targetClass.teachersMorning]
              : (targetClass.teachers ? targetClass.teachers.slice(0, 2) : []);
            const aTeachers = (targetClass.teachersAfternoon && targetClass.teachersAfternoon.length > 0)
              ? [...targetClass.teachersAfternoon]
              : (targetClass.teachers ? targetClass.teachers.slice(2) : []);

            currentSetupIntegralMorningTeachers = mTeachers;
            currentSetupIntegralAfternoonTeachers = aTeachers;
            renderSetupIntegralTeachersUI();
          } else {
            teachersListEl.style.flexDirection = 'row';
            teachersListEl.style.width = 'auto';
            teachersListEl.innerHTML = '';
            const teachers = targetClass.teachers || [];
            if (teachers.length === 0) {
              teachersListEl.innerHTML = '<span style="font-size:12px; color:#DC2626; font-style:italic;">⚠️ Nenhuma professora regente vinculada no cadastro desta turma.</span>';
            } else {
              teachers.forEach(tName => {
                const pill = document.createElement('div');
                pill.style.cssText = 'background:#FFFFFF; border:1px solid #BFDBFE; border-radius:20px; padding:4px 12px; font-size:12px; font-weight:700; color:#1E40AF; display:inline-flex; align-items:center; gap:6px; box-shadow:0 1px 2px rgba(0,0,0,0.05);';
                pill.innerHTML = `<span>👩‍🏫</span> <span>${tName}</span> <span style="font-size:10px; background:#EFF6FF; color:#2563EB; padding:1px 6px; border-radius:10px;">Regente Titular</span>`;
                teachersListEl.appendChild(pill);
              });
            }
          }
        }
      }

      // Sugere automaticamente o próximo bimestre longitudinal da TURMA
      autoSelectNextEligibleBimesterForClass(className, schoolName);
      updateSetupBimesterValidationUI();
    }

    function onSetupTeacherChange() {
      const teacherName = document.getElementById('setupTargetPerson').value;
      autoSelectNextEligibleBimester(teacherName);
      updateSetupBimesterValidationUI();
    }

    // =========================================================================
    // PILAR 7 & 15: Resolução do Bimestre Corrente do Ano Letivo via SSOT (Patos/PB)
    // =========================================================================
    function getCurrentSchoolBimester(referenceDate = new Date()) {
      const d = (referenceDate instanceof Date && !isNaN(referenceDate)) ? referenceDate : new Date(referenceDate);
      const periods = (appState && appState.bimesterPeriods) ? appState.bimesterPeriods : DEFAULT_BIMESTER_PERIODS;
      const BIMESTERS_CANONICAL = ['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre'];

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const refDateStr = `${year}-${month}-${day}`;

      // 1. Procura se a data coincide diretamente com a janela de algum dos 4 bimestres
      for (const bName of BIMESTERS_CANONICAL) {
        const p = periods[bName];
        if (p && p.startDate && p.endDate) {
          if (refDateStr >= p.startDate && refDateStr <= p.endDate) {
            return bName;
          }
        }
      }

      // 2. Se a data de referência for anterior ao 1º Bimestre oficial:
      const firstBim = periods['1º Bimestre'];
      if (firstBim && firstBim.startDate && refDateStr < firstBim.startDate) {
        return '1º Bimestre';
      }

      // 3. Se a data estiver em janela de recesso/transição entre bimestres, aponta para o próximo
      for (let i = 0; i < BIMESTERS_CANONICAL.length - 1; i++) {
        const curBim = periods[BIMESTERS_CANONICAL[i]];
        const nextBim = periods[BIMESTERS_CANONICAL[i + 1]];
        if (curBim && nextBim && curBim.endDate && nextBim.startDate) {
          if (refDateStr > curBim.endDate && refDateStr < nextBim.startDate) {
            return BIMESTERS_CANONICAL[i + 1];
          }
        }
      }

      // 4. Se for posterior ao encerramento do ano letivo oficial:
      return '4º Bimestre';
    }

    /**
     * Retorna o período oficial formatado de um bimestre para exibição em tabelas (ex: "02/02 a 30/04")
     */
    function getBimesterPeriodDisplay(bName) {
      const periods = (appState && appState.bimesterPeriods) ? appState.bimesterPeriods : DEFAULT_BIMESTER_PERIODS;
      const p = periods[bName];
      if (!p || !p.startDate || !p.endDate) return '';

      const fmt = (isoStr) => {
        if (!isoStr || isoStr.length < 10) return '';
        const parts = isoStr.split('-');
        return `${parts[2]}/${parts[1]}`;
      };

      const s = fmt(p.startDate);
      const e = fmt(p.endDate);
      return (s && e) ? `${s} a ${e}` : '';
    }

    // PILAR 1: Retorna o próximo bimestre necessário no ciclo longitudinal da TURMA
    function getNextEligibleBimesterForClass(className, schoolName) {
      const BIMESTERS = ['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre'];
      if (!className) return '1º Bimestre';
      const cleanClass = className.trim().toLowerCase();
      const cleanSchool = (schoolName || '').trim().toLowerCase();

      for (let i = 0; i < BIMESTERS.length; i++) {
        const bim = BIMESTERS[i];
        const bimNum = bim.match(/([1-4])/)[1];

        // Verifica se a TURMA já possui observação avaliada (finalizada) neste bimestre
        const hasFinalized = (appState.observations || []).some(o => {
          if (!o.className || o.className.trim().toLowerCase() !== cleanClass) return false;
          if (cleanSchool && o.schoolName && o.schoolName.trim().toLowerCase() !== cleanSchool) return false;
          const obsBimNum = (o.bimester || '').match(/([1-4])/);
          if (!obsBimNum || obsBimNum[1] !== bimNum) return false;
          return o.status === 'finalized' || o.status === 'concluida';
        });

        // Se este bimestre ainda não foi concluído para esta turma, ele é o próximo necessário!
        if (!hasFinalized) {
          return bim;
        }
      }
      return '4º Bimestre';
    }

    function autoSelectNextEligibleBimesterForClass(className, schoolName, selectId = 'setupBimester') {
      const bimesterSelect = document.getElementById(selectId);
      if (!bimesterSelect) return;
      bimesterSelect.value = getNextEligibleBimesterForClass(className, schoolName);
    }

    // Retorna o próximo bimestre necessário no ciclo longitudinal para o profissional (Formadoras)
    function getNextEligibleBimester(targetName) {
      const BIMESTERS = ['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre'];
      if (!targetName) return '1º Bimestre';
      const cleanTarget = targetName.trim().toLowerCase();

      for (let i = 0; i < BIMESTERS.length; i++) {
        const bim = BIMESTERS[i];
        const bimNum = bim.match(/([1-4])/)[1];

        const hasFinalized = (appState.observations || []).some(o => {
          if (!o.teacherName || o.teacherName.trim().toLowerCase() !== cleanTarget) return false;
          const obsBimNum = (o.bimester || '').match(/([1-4])/);
          if (!obsBimNum || obsBimNum[1] !== bimNum) return false;
          return o.status === 'finalized' || o.status === 'concluida';
        });

        if (!hasFinalized) {
          return bim;
        }
      }
      return '4º Bimestre';
    }

    function autoSelectNextEligibleBimester(targetName, selectId = 'setupBimester') {
      const bimesterSelect = document.getElementById(selectId);
      if (!bimesterSelect) return;
      bimesterSelect.value = getNextEligibleBimester(targetName);
    }

    // Atualiza feedback visual de elegibilidade do bimestre selecionado (Suporta Turma e Profissional)
    function updateSetupBimesterValidationUI() {
      const user = getCurrentUser();
      const bimesterEl = document.getElementById('setupBimester');
      const hintEl = document.getElementById('setupBimesterValidationHint');
      if (!hintEl || !bimesterEl) return;

      const bimester = bimesterEl.value;
      const bimNumMatch = bimester.match(/([1-4])/);
      const curBimNum = bimNumMatch ? bimNumMatch[1] : '1';
      const BIMESTERS = ['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre'];
      const curIdx = BIMESTERS.findIndex(b => (b.match(/([1-4])/) || [])[1] === curBimNum);

      if (user.roleKey === 'coordenador') {
        const classSelect = document.getElementById('setupClass');
        const schoolSelect = document.getElementById('setupSchool');
        const className = classSelect ? classSelect.value : '';
        const schoolName = schoolSelect ? schoolSelect.value : '';

        if (!className) {
          hintEl.style.display = 'none';
          return;
        }

        const cleanClass = className.trim().toLowerCase();
        const cleanSchool = (schoolName || '').trim().toLowerCase();

        // 1. Verificação de duplicidade de observação no mesmo bimestre para a TURMA
        const duplicateObs = (appState.observations || []).find(o => {
          if (!o.className || o.className.trim().toLowerCase() !== cleanClass) return false;
          if (cleanSchool && o.schoolName && o.schoolName.trim().toLowerCase() !== cleanSchool) return false;
          const obsBimNum = (o.bimester || '').match(/([1-4])/);
          if (!obsBimNum || obsBimNum[1] !== curBimNum) return false;
          return o.status !== 'archived';
        });
        if (duplicateObs) {
          hintEl.style.display = 'block';
          hintEl.style.color = '#dc2626';
          hintEl.innerHTML = `⚠️ Já existe uma observação (${duplicateObs.status === 'draft' ? 'rascunho em andamento' : 'concluída'}) para a turma ${className} no ${bimester}.`;
          return;
        }

        // 2. Verificação de pré-requisito do bimestre anterior para a TURMA
        if (curIdx > 0) {
          const prevBimester = BIMESTERS[curIdx - 1];
          const prevBimNum = prevBimester.match(/([1-4])/)[1];
          const prevFinalized = (appState.observations || []).some(o => {
            if (!o.className || o.className.trim().toLowerCase() !== cleanClass) return false;
            if (cleanSchool && o.schoolName && o.schoolName.trim().toLowerCase() !== cleanSchool) return false;
            const obsBimNum = (o.bimester || '').match(/([1-4])/);
            if (!obsBimNum || obsBimNum[1] !== prevBimNum) return false;
            return o.status === 'finalized' || o.status === 'concluida';
          });

          if (!prevFinalized) {
            const prevDraft = (appState.observations || []).some(o => {
              if (!o.className || o.className.trim().toLowerCase() !== cleanClass) return false;
              if (cleanSchool && o.schoolName && o.schoolName.trim().toLowerCase() !== cleanSchool) return false;
              const obsBimNum = (o.bimester || '').match(/([1-4])/);
              if (!obsBimNum || obsBimNum[1] !== prevBimNum) return false;
              return o.status === 'draft';
            });

            hintEl.style.display = 'block';
            hintEl.style.color = '#dc2626';
            if (prevDraft) {
              hintEl.innerHTML = `🚫 Bloqueado: A observação da turma ${className} no <strong>${prevBimester}</strong> está em rascunho. Finalize-a antes de iniciar o ${bimester}.`;
            } else {
              hintEl.innerHTML = `🚫 Bloqueado: Necessário observar a turma ${className} no <strong>${prevBimester}</strong> antes de lançar o ${bimester}.`;
            }
            return;
          }
        }

        // 3. Pré-requisito atendido para a TURMA
        hintEl.style.display = 'block';
        hintEl.style.color = '#16a34a';
        if (curIdx <= 0) {
          hintEl.innerHTML = `✅ Apto para o 1º Bimestre da turma (Diagnóstico Inicial).`;
        } else {
          const prevBimester = BIMESTERS[curIdx - 1];
          hintEl.innerHTML = `✅ Pré-requisito atendido: Observação da turma no ${prevBimester} concluída.`;
        }

      } else {
        // FLUXO FORMADORA (COORDENADORA ACOMPANHADA)
        const targetNameEl = document.getElementById('setupTargetPerson');
        const targetName = targetNameEl ? targetNameEl.value : '';

        if (!targetName) {
          hintEl.style.display = 'none';
          return;
        }

        const cleanTarget = targetName.trim().toLowerCase();

        // 1. Verificação de duplicidade de observação no mesmo bimestre
        const duplicateObs = (appState.observations || []).find(o => {
          if (!o.teacherName || o.teacherName.trim().toLowerCase() !== cleanTarget) return false;
          const obsBimNum = (o.bimester || '').match(/([1-4])/);
          if (!obsBimNum || obsBimNum[1] !== curBimNum) return false;
          return o.status !== 'archived';
        });
        if (duplicateObs) {
          hintEl.style.display = 'block';
          hintEl.style.color = '#dc2626';
          hintEl.innerHTML = `⚠️ Já existe um acompanhamento (${duplicateObs.status === 'draft' ? 'rascunho em andamento' : 'concluído'}) para ${targetName} no ${bimester}.`;
          return;
        }

        // 2. Verificação de pré-requisito do bimestre anterior
        if (curIdx > 0) {
          const prevBimester = BIMESTERS[curIdx - 1];
          const prevBimNum = prevBimester.match(/([1-4])/)[1];
          const prevFinalized = (appState.observations || []).some(o => {
            if (!o.teacherName || o.teacherName.trim().toLowerCase() !== cleanTarget) return false;
            const obsBimNum = (o.bimester || '').match(/([1-4])/);
            if (!obsBimNum || obsBimNum[1] !== prevBimNum) return false;
            return o.status === 'finalized' || o.status === 'concluida';
          });

          if (!prevFinalized) {
            const prevDraft = (appState.observations || []).some(o => {
              if (!o.teacherName || o.teacherName.trim().toLowerCase() !== cleanTarget) return false;
              const obsBimNum = (o.bimester || '').match(/([1-4])/);
              if (!obsBimNum || obsBimNum[1] !== prevBimNum) return false;
              return o.status === 'draft';
            });

            hintEl.style.display = 'block';
            hintEl.style.color = '#dc2626';
            if (prevDraft) {
              hintEl.innerHTML = `🚫 Bloqueado: O acompanhamento de ${targetName} no <strong>${prevBimester}</strong> está em rascunho pendente. Finalize-o antes de iniciar o ${bimester}.`;
            } else {
              hintEl.innerHTML = `🚫 Bloqueado: Necessário acompanhar no <strong>${prevBimester}</strong> antes de lançar o ${bimester}.`;
            }
            return;
          }
        }

        hintEl.style.display = 'block';
        hintEl.style.color = '#16a34a';
        if (curIdx <= 0) {
          hintEl.innerHTML = `✅ Apto para o 1º Bimestre (Diagnóstico Inicial).`;
        } else {
          const prevBimester = BIMESTERS[curIdx - 1];
          hintEl.innerHTML = `✅ Pré-requisito atendido: Acompanhamento do ${prevBimester} concluído.`;
        }
      }
    }

