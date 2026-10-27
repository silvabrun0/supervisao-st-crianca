    // --- 6. INSTRUMENT & OBSERVATION EXECUTION ---
    function startNewObservation() {
      const user = getCurrentUser();
      if (isNucleoEI(user)) {
        showToast('A Coordenadora do Núcleo de EI não aplica avaliações diretas.');
        return;
      }
      const schoolSelect = document.getElementById('setupSchool');
      const schoolName = schoolSelect.value;
      const bimester = document.getElementById('setupBimester').value;
      const todayStr = getTodayDateString();
      const currentNowTime = getNowTimeString();

      const dateEl = document.getElementById('setupDate');
      const startEl = document.getElementById('setupStartTime');
      const endEl = document.getElementById('setupEndTime');

      const chosenDate = (dateEl && dateEl.value) ? dateEl.value : todayStr;
      const chosenStart = (startEl && startEl.value) ? startEl.value : currentNowTime;
      const chosenEnd = (endEl && endEl.value) ? endEl.value : null;

      // Se término for informado, valida se é posterior ao início
      if (chosenEnd && chosenEnd <= chosenStart) {
        showToast('Atenção: O horário de término deve ser posterior ao horário de início.');
        return;
      }

      let className = '';
      let targetClassObj = null;
      let teachersList = [];
      let teacherName = '';

      const bimNumMatch = bimester.match(/([1-4])/);
      const curBimNum = bimNumMatch ? bimNumMatch[1] : '1';
      const BIMESTERS_SEQUENCE = ['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre'];
      const bimIndex = BIMESTERS_SEQUENCE.findIndex(b => (b.match(/([1-4])/) || [])[1] === curBimNum);

      if (user.roleKey === 'coordenador') {
        const classSelect = document.getElementById('setupClass');
        className = classSelect ? classSelect.value : '';
        if (!className) {
          showToast('Selecione a turma da Educação Infantil a ser observada.');
          return;
        }

        const schoolClasses = getClassesForSchool(schoolName);
        targetClassObj = schoolClasses.find(c => c.name === className);
        teachersList = targetClassObj?.teachers || [];
        teacherName = teachersList.length > 0 ? teachersList.join(', ') : 'Professoras da Turma';

        // 1. Bloqueio rigoroso de duplo lançamento para a MESMA TURMA no mesmo bimestre
        const cleanClass = className.trim().toLowerCase();
        const existingObs = (appState.observations || []).find(o => {
          if (!o.className || o.className.trim().toLowerCase() !== cleanClass) return false;
          if (o.schoolName && o.schoolName.trim().toLowerCase() !== schoolName.trim().toLowerCase()) return false;
          const obsBimNum = (o.bimester || '').match(/([1-4])/);
          if (!obsBimNum || obsBimNum[1] !== curBimNum) return false;
          return o.status !== 'archived';
        });

        if (existingObs) {
          showToast(`Ação bloqueada: Já existe uma observação (rascunho ou finalizada) para a turma ${className} no ${bimester}.`);
          return;
        }

        // 2. Bloqueio rigoroso de sequência longitudinal dos bimestres para a TURMA
        if (bimIndex > 0) {
          const prevBim = BIMESTERS_SEQUENCE[bimIndex - 1];
          const prevBimNum = prevBim.match(/([1-4])/)[1];

          const hasPrevFinalized = (appState.observations || []).some(o => {
            if (!o.className || o.className.trim().toLowerCase() !== cleanClass) return false;
            if (o.schoolName && o.schoolName.trim().toLowerCase() !== schoolName.trim().toLowerCase()) return false;
            const obsBimNum = (o.bimester || '').match(/([1-4])/);
            if (!obsBimNum || obsBimNum[1] !== prevBimNum) return false;
            return o.status === 'finalized' || o.status === 'concluida';
          });

          if (!hasPrevFinalized) {
            const hasPrevDraft = (appState.observations || []).some(o => {
              if (!o.className || o.className.trim().toLowerCase() !== cleanClass) return false;
              if (o.schoolName && o.schoolName.trim().toLowerCase() !== schoolName.trim().toLowerCase()) return false;
              const obsBimNum = (o.bimester || '').match(/([1-4])/);
              if (!obsBimNum || obsBimNum[1] !== prevBimNum) return false;
              return o.status === 'draft';
            });

            if (hasPrevDraft) {
              showToast(`Ação bloqueada: A observação da turma ${className} no ${prevBim} ainda está em rascunho. Conclua-a antes de iniciar o ${bimester}.`);
            } else {
              showToast(`Ação bloqueada: A turma ${className} não possui observação concluída no ${prevBim}. O ciclo longitudinal exige que os bimestres ocorram em sequência.`);
            }
            return;
          }
        }

      } else {
        // FLUXO DE FORMADORA ACOMPANHANDO COORDENADORA
        teacherName = document.getElementById('setupTargetPerson').value;
        className = 'Coordenação Pedagógica';

        if (!teacherName) {
          showToast('Nenhuma coordenadora disponível para avaliação neste escopo.');
          return;
        }
        if (teacherName === user.name) {
          showToast('Não é permitido realizar autoavaliação.');
          return;
        }

        const cleanTarget = teacherName.trim().toLowerCase();
        const existingObs = (appState.observations || []).find(o => {
          if (!o.teacherName || o.teacherName.trim().toLowerCase() !== cleanTarget) return false;
          const obsBimNum = (o.bimester || '').match(/([1-4])/);
          if (!obsBimNum || obsBimNum[1] !== curBimNum) return false;
          return o.status !== 'archived';
        });
        if (existingObs) {
          showToast(`Ação bloqueada: Já existe um acompanhamento para ${teacherName} no ${bimester}.`);
          return;
        }

        // Sequência longitudinal para coordenadora
        if (bimIndex > 0) {
          const prevBim = BIMESTERS_SEQUENCE[bimIndex - 1];
          const prevBimNum = prevBim.match(/([1-4])/)[1];
          const hasPrevFinalized = (appState.observations || []).some(o => {
            if (!o.teacherName || o.teacherName.trim().toLowerCase() !== cleanTarget) return false;
            const obsBimNum = (o.bimester || '').match(/([1-4])/);
            if (!obsBimNum || obsBimNum[1] !== prevBimNum) return false;
            return o.status === 'finalized' || o.status === 'concluida';
          });
          if (!hasPrevFinalized) {
            showToast(`Ação bloqueada: ${teacherName} não possui acompanhamento concluído no ${prevBim}.`);
            return;
          }
        }
      }

      const isIntegral = isClassIntegral(targetClassObj?.shift || className);
      const morningStart = chosenStart || '08:00';
      const morningEnd = chosenEnd || (isIntegral ? '11:30' : null);
      const morningDuration = morningEnd ? calculateObservationDuration({ startDate: chosenDate, endDate: chosenDate, startTime: morningStart, endTime: morningEnd }) : null;

      let finalMorningTeachers = [];
      let finalAfternoonTeachers = [];
      if (isIntegral) {
        if (currentSetupIntegralMorningTeachers && currentSetupIntegralMorningTeachers.length > 0) {
          finalMorningTeachers = [...currentSetupIntegralMorningTeachers];
        } else if (targetClassObj?.teachersMorning && targetClassObj.teachersMorning.length > 0) {
          finalMorningTeachers = [...targetClassObj.teachersMorning];
        } else {
          finalMorningTeachers = teachersList.slice(0, 2);
        }

        if (currentSetupIntegralAfternoonTeachers && currentSetupIntegralAfternoonTeachers.length > 0) {
          finalAfternoonTeachers = [...currentSetupIntegralAfternoonTeachers];
        } else if (targetClassObj?.teachersAfternoon && targetClassObj.teachersAfternoon.length > 0) {
          finalAfternoonTeachers = [...targetClassObj.teachersAfternoon];
        } else {
          finalAfternoonTeachers = teachersList.slice(2);
        }
        teachersList = [...finalMorningTeachers, ...finalAfternoonTeachers];
        teacherName = teachersList.join(', ');
      }

      const newObs = {
        id: 'obs-' + Date.now(),
        scheduleId: appState.currentSetupScheduleId || null,
        evaluatedType: user.roleKey === 'coordenador' ? 'turma' : 'coordenador',
        unitOfAnalysis: user.roleKey === 'coordenador' ? 'turma' : 'coordenador',
        classId: targetClassObj?.id || null,
        className: className,
        classShift: targetClassObj?.shift || (isIntegral ? 'Integral' : 'Parcial Matutino'),
        isIntegral: isIntegral,
        integralStage: isIntegral ? 'matutino' : 'concluido',
        teachersMorning: isIntegral ? finalMorningTeachers : null,
        teachersAfternoon: isIntegral ? finalAfternoonTeachers : null,
        morningObs: isIntegral ? {
          date: chosenDate,
          startTime: morningStart,
          endTime: morningEnd,
          durationMinutes: morningDuration,
          completed: false,
          completedAt: null
        } : null,
        afternoonObs: isIntegral ? {
          date: chosenDate,
          startTime: '13:30',
          endTime: '16:30',
          durationMinutes: null,
          completed: false,
          completedAt: null
        } : null,
        totalIntegralDurationMinutes: null,
        teachers: teachersList,
        teacherName: teacherName, // Mantido para compatibilidade retroativa
        schoolName: schoolName,
        evaluatedBy: user.name,
        bimester: bimester,
        startDate: chosenDate,
        endDate: chosenEnd ? chosenDate : null,
        date: chosenDate,
        startTime: chosenStart,
        endTime: chosenEnd,
        durationMinutes: chosenEnd ? calculateObservationDuration({ startDate: chosenDate, endDate: chosenDate, startTime: chosenStart, endTime: chosenEnd }) : null,
        status: 'draft',
        synthesisMaterialDimension: null,
        synthesisPredominant: null,
        synthesisOrg: null,
        comments: '',
        responses: {},
        criterionComments: {},
        photos: {},
        linkedNotes: [],
        partialAttributions: {},
        teacherSynthesis: {}
      };

      // Inicializa os nós individuais dos docentes da turma em teacherSynthesis
      if (newObs.evaluatedType === 'turma' && Array.isArray(teachersList)) {
        teachersList.forEach(tName => {
          newObs.teacherSynthesis[tName] = {
            dimensions: {
              estrategias: null,
              gestao_grupo: null,
              mediacao_individual: null,
              respeito_integridade: null,
              gestao_cuidados: null
            },
            feedback: ''
          };
        });
      }

      appState.observations.unshift(newObs);
      appState.currentObs = newObs;
      appState.activeTabIndex = 0;
      appState.isReadOnly = false;
      saveState();

      renderActiveObservation();
    }

    function resumeObservation(obsId, isReadOnly = false) {
      const obs = appState.observations.find(o => o.id === obsId);
      if (!obs) return;

      const user = getCurrentUser();

      // STRICT PROTECTION: If someone else tries to resume a draft, force read-only or deny!
      if (obs.status === 'draft' && obs.evaluatedBy !== user.name) {
        showToast('Acesso negado: este rascunho pertence a outro profissional.');
        return;
      }

      // If user is technician or supervisor viewing finalized, always read-only
      if (obs.status === 'finalized' || isNucleoEI(user)) {
        isReadOnly = true;
      }

      // PILAR 4: Se for turma integral com etapa matutina concluída e em rascunho, assegura avanço para etapa vespertina
      if (obs.isIntegral && obs.status === 'draft' && obs.morningObs && obs.morningObs.completed && obs.integralStage === 'matutino') {
        obs.integralStage = 'vespertino';
        saveState();
      }

      appState.currentObs = obs;
      appState.activeTabIndex = 0;
      appState.isReadOnly = isReadOnly;
      renderActiveObservation();
    }

    function getObservationPendencies(obs) {
      const current = obs || appState.currentObs;
      if (!current) return [];
      const responses = current.responses || {};
      const pendencies = [];
      const sections = getActiveSections(current);
      (sections || []).forEach((sec, sIdx) => {
        (sec.subSections || []).forEach(sub => {
          (sub.criteria || []).forEach(crit => {
            const val = responses[crit.id];
            if (!val) {
              pendencies.push({
                dimensionIndex: sIdx,
                dimensionTitle: sec.title,
                criterionId: crit.id,
                criterionText: crit.text
              });
            } else if (val === 'partial' && current.evaluatedType === 'turma') {
              // PILAR 5: Validação mandatória de Itens Parciais (Docente + Justificativa >= 5 chars)
              const attr = (current.partialAttributions && current.partialAttributions[crit.id]) || null;
              const hasTeachers = attr && Array.isArray(attr.teachers) && attr.teachers.length > 0;
              const hasJustification = attr && typeof attr.justification === 'string' && attr.justification.trim().length >= 5;

              if (!hasTeachers) {
                pendencies.push({
                  dimensionIndex: sIdx,
                  dimensionTitle: sec.title,
                  criterionId: crit.id,
                  criterionText: `${crit.text} (Item Parcial requer seleção do(a) docente responsável)`
                });
              } else if (!hasJustification) {
                pendencies.push({
                  dimensionIndex: sIdx,
                  dimensionTitle: sec.title,
                  criterionId: crit.id,
                  criterionText: `${crit.text} (Item Parcial requer justificativa descritiva com mínimo de 5 caracteres)`
                });
              }
            }
          });
        });
      });
      return pendencies;
    }

    // --- HELPER: ÍCONES DAS DIMENSÕES (SOMENTE ÍCONES) ---
    function getDimensionIconSvg(dimKeyOrTitle, index) {
      const normalized = (dimKeyOrTitle || '').toString().toLowerCase();
      
      if (normalized.includes('estratég') || normalized.includes('estrateg') || normalized.includes('didát')) {
        return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`;
      }
      if (normalized.includes('gestão do grupo') || normalized.includes('gestao_grupo') || normalized.includes('grupo') || normalized.includes('turma')) {
        return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
      }
      if (normalized.includes('mediação') || normalized.includes('mediacao') || normalized.includes('individual')) {
        return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
      }
      if (normalized.includes('respeito') || normalized.includes('integridade')) {
        return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
      }
      if (normalized.includes('cuidado') || normalized.includes('saúde') || normalized.includes('acolhimento')) {
        return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
      }
      if (normalized.includes('planeja')) {
        return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>`;
      }
      if (normalized.includes('prática docente') || normalized.includes('pratica_docente')) {
        return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`;
      }
      if (normalized.includes('formação') || normalized.includes('formacao') || normalized.includes('formacoes')) {
        return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`;
      }
      if (normalized.includes('externo') || normalized.includes('parque') || normalized.includes('ambiente')) {
        return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
      }
      if (normalized.includes('família') || normalized.includes('familia') || normalized.includes('comunidade')) {
        return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
      }

      // Ícones alternativos numerados
      const fallbacks = [
        `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><text x="12" y="16" text-anchor="middle" font-size="11" font-weight="bold" fill="currentColor" stroke="none">1</text></svg>`,
        `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><text x="12" y="16" text-anchor="middle" font-size="11" font-weight="bold" fill="currentColor" stroke="none">2</text></svg>`,
        `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><text x="12" y="16" text-anchor="middle" font-size="11" font-weight="bold" fill="currentColor" stroke="none">3</text></svg>`,
        `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><text x="12" y="16" text-anchor="middle" font-size="11" font-weight="bold" fill="currentColor" stroke="none">4</text></svg>`,
        `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><text x="12" y="16" text-anchor="middle" font-size="11" font-weight="bold" fill="currentColor" stroke="none">5</text></svg>`,
        `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><text x="12" y="16" text-anchor="middle" font-size="11" font-weight="bold" fill="currentColor" stroke="none">6</text></svg>`,
        `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><text x="12" y="16" text-anchor="middle" font-size="11" font-weight="bold" fill="currentColor" stroke="none">7</text></svg>`
      ];
      return fallbacks[index % fallbacks.length];
    }

    // --- HELPER: ACORDEÃO DE SUBDIMENSÕES ---
    function toggleSubdimension(subId) {
      if (!appState.openSubdimensions) appState.openSubdimensions = {};
      appState.openSubdimensions[subId] = !appState.openSubdimensions[subId];
      renderActiveObservation(true);
    }

    // --- HELPER: GESTO DE SWIPE NA TELA (ARRASTAR ESQUERDA/DIREITA) ---
    let touchStartX = 0;
    let touchStartY = 0;

    function initSwipeGesture() {
      const screen = document.getElementById('screenActiveObs');
      if (!screen || screen.dataset.swipeInitialized) return;
      screen.dataset.swipeInitialized = 'true';

      screen.addEventListener('touchstart', function(e) {
        if (e.target.closest('input, textarea, select, .fab-draggable, .fab-menu-panel, .scale-opt, .btn, .photo-thumb-wrapper, .photo-del-btn, .btn-add-photo')) {
          touchStartX = 0;
          touchStartY = 0;
          return;
        }
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
      }, { passive: true });

      screen.addEventListener('touchend', function(e) {
        if (!touchStartX && !touchStartY) return;
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        touchStartX = 0;
        touchStartY = 0;

        // Se o deslocamento horizontal for maior que 50px e pelo menos 1.3x o vertical
        if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
          if (deltaX < 0) {
            // Arrastou para a esquerda -> Próxima dimensão
            const sections = getActiveSections(appState.currentObs);
            if (appState.activeTabIndex < sections.length - 1) {
              nextDimension();
            } else {
              renderSynthesisScreen();
            }
          } else {
            // Arrastou para a direita -> Dimensão anterior
            if (appState.activeTabIndex > 0) {
              prevDimension();
            }
          }
        }
      }, { passive: true });
    }

    // --- HELPER: BOTÃO FLUTUANTE ARRASTÁVEL (FAB) ---
    let fabDrag = {
      isDragging: false,
      startX: 0,
      startY: 0,
      initialLeft: 0,
      initialTop: 0,
      hasMoved: false
    };

    function initDraggableFab() {
      const fab = document.getElementById('fabActiveObs');
      if (!fab || fab.dataset.dragInitialized) return;
      fab.dataset.dragInitialized = 'true';

      fab.addEventListener('pointerdown', function(e) {
        fabDrag.isDragging = true;
        fabDrag.hasMoved = false;
        fabDrag.startX = e.clientX;
        fabDrag.startY = e.clientY;
        const rect = fab.getBoundingClientRect();
        fabDrag.initialLeft = rect.left;
        fabDrag.initialTop = rect.top;
        try { fab.setPointerCapture(e.pointerId); } catch(err) {}
      });

      fab.addEventListener('pointermove', function(e) {
        if (!fabDrag.isDragging) return;
        const dx = e.clientX - fabDrag.startX;
        const dy = e.clientY - fabDrag.startY;
        if (Math.hypot(dx, dy) > 6) {
          fabDrag.hasMoved = true;
        }
        if (fabDrag.hasMoved) {
          let newLeft = fabDrag.initialLeft + dx;
          let newTop = fabDrag.initialTop + dy;
          const maxLeft = window.innerWidth - fab.offsetWidth - 10;
          const maxTop = window.innerHeight - fab.offsetHeight - 10;
          newLeft = Math.max(10, Math.min(newLeft, maxLeft));
          newTop = Math.max(10, Math.min(newTop, maxTop));
          fab.style.left = newLeft + 'px';
          fab.style.top = newTop + 'px';
          fab.style.right = 'auto';
          fab.style.bottom = 'auto';
        }
      });

      fab.addEventListener('pointerup', function(e) {
        if (!fabDrag.isDragging) return;
        fabDrag.isDragging = false;
        try { fab.releasePointerCapture(e.pointerId); } catch(err) {}
        if (!fabDrag.hasMoved) {
          toggleFabMenu();
        }
      });

      fab.addEventListener('pointercancel', function(e) {
        fabDrag.isDragging = false;
        try { fab.releasePointerCapture(e.pointerId); } catch(err) {}
      });
    }

    function toggleFabMenu(forceState) {
      const panel = document.getElementById('fabActiveObsMenu');
      const backdrop = document.getElementById('fabMenuBackdrop');
      if (!panel || !backdrop) return;

      const isVisible = panel.style.display === 'block';
      const shouldShow = typeof forceState === 'boolean' ? forceState : !isVisible;

      if (shouldShow) {
        const fab = document.getElementById('fabActiveObs');
        if (fab) {
          const rect = fab.getBoundingClientRect();
          let top = rect.top - 200;
          let left = rect.left - 230;
          if (top < 10) top = rect.bottom + 10;
          if (left < 10) left = 10;
          if (left + 290 > window.innerWidth) left = window.innerWidth - 300;
          
          panel.style.top = `${top}px`;
          panel.style.left = `${left}px`;
          panel.style.bottom = 'auto';
          panel.style.right = 'auto';
        }
        panel.style.display = 'block';
        backdrop.style.display = 'block';
      } else {
        panel.style.display = 'none';
        backdrop.style.display = 'none';
      }
    }

    function handleFabSaveDraft() {
      toggleFabMenu(false);
      saveDraftAndExit();
    }

    function handleFabNote() {
      toggleFabMenu(false);
      openQualitativeNoteModal();
    }

    function handleFabExitWithoutSaving() {
      toggleFabMenu(false);
      const isDraft = appState.currentObs && (appState.currentObs.status === 'draft' || !appState.currentObs.status);
      const confirmMsg = isDraft 
        ? "Deseja realmente sair sem salvar? O rascunho desta avaliação será descartado e não ficará salvo na tela inicial."
        : "Deseja realmente sair sem salvar as alterações feitas nesta sessão de avaliação?";

      if (confirm(confirmMsg)) {
        if (isDraft && appState.currentObs) {
          const draftId = appState.currentObs.id;
          appState.observations = (appState.observations || []).filter(o => o.id !== draftId);
          appState.currentObs = null;
          saveState();
          showToast('Rascunho descartado com sucesso.');
        } else {
          appState.currentObs = null;
        }

        const mainTabbar = document.getElementById('mainMobileTabbar') || document.querySelector('.mobile-tabbar');
        if (mainTabbar) mainTabbar.style.display = '';
        const dimBottomBar = document.getElementById('dimBottomBar');
        if (dimBottomBar) dimBottomBar.style.display = 'none';
        const fabContainer = document.getElementById('fabActiveObsContainer');
        if (fabContainer) fabContainer.style.display = 'none';
        navigateToTab('home');
      }
    }

    // Helper determinístico para formatação de enunciado enxuto no mobile
    function formatCriterionMobileDisplay(crit) {
      if (!crit || !crit.text) return { isLong: false, mainText: '', fullText: '' };
      const text = crit.text;
      const parenMatch = text.match(/\(([^)]+)\)/);
      if (parenMatch && parenMatch[1].length > 20) {
        let mainText = text.replace(/\s*\([^)]+\)/, '');
        mainText = mainText.replace(/\s+([.,?!;:])/g, '$1').trim();
        return { isLong: true, mainText: mainText, fullText: text };
      }
      return { isLong: false, mainText: text, fullText: text };
    }

    function renderActiveObservation(preserveScroll = false) {
      const obs = appState.currentObs;
      if (!obs) return;

      const previousScroll = preserveScroll ? window.scrollY : 0;

      document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));
      document.getElementById('screenActiveObs').classList.add('active');

      const dateDisplay = formatObservationDateRange(obs) || formatDateBR(obs.startDate || obs.date || getTodayDateString());
      if (obs.evaluatedType === 'turma') {
        document.getElementById('activeObsTeacher').innerText = `Turma: ${obs.className} (${obs.bimester || 'Acompanhamento'})`;
        const teachersDisplay = obs.teachers && obs.teachers.length > 0 ? obs.teachers.join(', ') : obs.teacherName;
        document.getElementById('activeObsMeta').innerText = `Docentes Regentes: ${teachersDisplay} · Escola: ${obs.schoolName} · Supervisor(a): ${obs.evaluatedBy} · Data: ${dateDisplay} · Início: ${obs.startTime || '08:00'}`;
      } else {
        document.getElementById('activeObsTeacher').innerText = `${obs.teacherName} (${obs.bimester || 'Acompanhamento'})`;
        document.getElementById('activeObsMeta').innerText = `Agrupamento: ${obs.className} · Escola: ${obs.schoolName} · Supervisor(a): ${obs.evaluatedBy} · Data: ${dateDisplay} · Início: ${obs.startTime || '08:00'}`;
      }
      
      // Oculta barra de abas inferior principal e exibe barra de dimensões
      const mainTabbar = document.getElementById('mainMobileTabbar') || document.querySelector('.mobile-tabbar');
      if (mainTabbar) mainTabbar.style.display = 'none';

      const dimBottomBar = document.getElementById('dimBottomBar');
      if (dimBottomBar) dimBottomBar.style.display = 'flex';

      const fabContainer = document.getElementById('fabActiveObsContainer');
      if (fabContainer) fabContainer.style.display = 'block';
      const fabBtn = document.getElementById('fabActiveObs');
      if (fabBtn) fabBtn.style.display = 'flex';

      initDraggableFab();
      initSwipeGesture();

      // Exibe a tarja de modo somente leitura exclusivamente em observações finalizadas
      const isFinalized = !!(obs && (obs.status === 'finalized' || obs.status === 'concluida'));
      const roWarning = document.getElementById('readOnlyWarning');
      if (roWarning) {
        roWarning.style.display = isFinalized ? 'flex' : 'none';
      }

      const isReadOnlyOrFinalized = isFinalized || appState.isReadOnly;

      const pendencies = getObservationPendencies(obs);

      // PILAR 4: Banner Contextual de Etapa para Turmas em Tempo Integral
      const integralBanner = document.getElementById('activeObsIntegralBanner');
      if (integralBanner) {
        if (obs.isIntegral) {
          integralBanner.style.display = 'flex';
          const iconEl = document.getElementById('activeObsIntegralIcon');
          const titleEl = document.getElementById('activeObsIntegralTitle');
          const descEl = document.getElementById('activeObsIntegralDesc');
          const badgeEl = document.getElementById('activeObsIntegralBadge');

          if (obs.integralStage === 'vespertino') {
            integralBanner.style.background = '#FFFBEB';
            integralBanner.style.borderColor = '#FCD34D';
            if (iconEl) iconEl.innerText = '🌅';
            if (titleEl) {
              titleEl.innerText = 'ETAPA 2/2: TURNO VESPERTINO (TARDE)';
              titleEl.style.color = '#B45309';
            }
            if (descEl) {
              const mStart = obs.morningObs?.startTime || '08:00';
              const mEnd = obs.morningObs?.endTime || '11:30';
              const mDur = obs.morningObs?.durationMinutes ? `${obs.morningObs.durationMinutes}min` : '';
              descEl.innerText = `Você está complementando a observação da turma com as práticas da tarde. A etapa matutina (${mStart} às ${mEnd}${mDur ? ' · ' + mDur : ''}) já foi registrada com sucesso.`;
              descEl.style.color = '#92400E';
            }
            if (badgeEl) {
              badgeEl.style.background = '#FEF3C7';
              badgeEl.style.color = '#92400E';
              badgeEl.innerText = 'Etapa 2 · Tarde';
            }
          } else {
            integralBanner.style.background = '#EFF6FF';
            integralBanner.style.borderColor = '#BFDBFE';
            if (iconEl) iconEl.innerText = '☀️';
            if (titleEl) {
              titleEl.innerText = 'ETAPA 1/2: TURNO MATUTINO (MANHÃ)';
              titleEl.style.color = '#1D4ED8';
            }
            if (descEl) {
              descEl.innerText = 'Você está observando a rotina da manhã. Ao encerrar o período matutino, salve o rascunho da manhã para retomar à tarde e concluir a turma.';
              descEl.style.color = '#1E40AF';
            }
            if (badgeEl) {
              badgeEl.style.background = '#DBEAFE';
              badgeEl.style.color = '#1E40AF';
              badgeEl.innerText = 'Etapa 1 · Manhã';
            }
          }
        } else {
          integralBanner.style.display = 'none';
        }
      }

      const valBanner = document.getElementById('activeObsValidationBanner');
      if (valBanner) {
        if (pendencies.length > 0 && !appState.isReadOnly) {
          valBanner.classList.add('visible');
          valBanner.style.display = 'flex';
          document.getElementById('validationAlertTitle').innerText = `${pendencies.length} pergunta(s) pendente(s) no formulário`;
          document.getElementById('validationAlertDesc').innerText = `Pelo plano SerTão Criança, o preenchimento integral é obrigatório antes da finalização. Toque para ir à primeira pendência.`;
        } else {
          valBanner.classList.remove('visible');
          valBanner.style.display = 'none';
        }
      }

      // Renderização da Barra Inferior de Dimensões (Somente Ícones)
      if (dimBottomBar) {
        dimBottomBar.innerHTML = '';
        const sections = getActiveSections(appState.currentObs);
        sections.forEach((sec, idx) => {
          let filled = 0, total = 0;
          sec.subSections.forEach(sub => sub.criteria.forEach(c => {
            total++;
            if (obs.responses[c.id]) filled++;
          }));

          const isPendingInDim = filled < total;
          const isActive = idx === appState.activeTabIndex;
          const btn = document.createElement('button');
          btn.className = `dim-icon-btn ${isActive ? 'active' : ''} ${isPendingInDim && !appState.isReadOnly ? 'pending-alert' : ''}`;
          btn.setAttribute('title', `${idx + 1}. ${sec.title} (${filled}/${total}${isPendingInDim ? ' - Pendente' : ' - Completo'})`);
          btn.setAttribute('aria-label', `${idx + 1}. ${(sec.title || '').replace(/^Dimens[aã]o\s*\d*\s*[:\.\-]?\s*/i, '').trim()}`);
          
          btn.innerHTML = `
            ${getDimensionIconSvg(sec.key || sec.title, idx)}
            ${isPendingInDim && !appState.isReadOnly ? `<span class="dim-pending-dot"></span>` : ''}
          `;
          btn.onclick = () => {
            appState.activeTabIndex = idx;
            renderActiveObservation(false);
          };
          dimBottomBar.appendChild(btn);
        });

        // Ícone para Avançar para a Síntese Final
        const synthBtn = document.createElement('button');
        const isAllDone = pendencies.length === 0;
        synthBtn.className = `dim-icon-btn synthesis-btn ${isAllDone ? 'synthesis-ready' : ''}`;
        synthBtn.setAttribute('title', 'Síntese Final da Observação');
        synthBtn.setAttribute('aria-label', 'Síntese Final da Observação');
        synthBtn.innerHTML = `
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 11l3 3L22 4"/>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
        `;
        synthBtn.onclick = () => {
          renderSynthesisScreen();
        };
        dimBottomBar.appendChild(synthBtn);
      }

      // Helper determinístico para formatação de enunciado enxuto no mobile
      function formatCriterionMobileDisplay(crit) {
        if (!crit || !crit.text) return { isLong: false, mainText: '', fullText: '' };
        const text = crit.text;

        // Condição 1: Presença de parênteses explicativo longo (> 20 caracteres)
        const parenMatch = text.match(/\(([^)]+)\)/);
        if (parenMatch && parenMatch[1].length > 20) {
          let mainText = text.replace(/\s*\([^)]+\)/, '');
          mainText = mainText.replace(/\s+([.,?!;:])/g, '$1').trim();
          return { isLong: true, mainText: mainText, fullText: text };
        }

        // Condição 2: Extensão total excessiva (> 90 caracteres) e divisível logicamente por ':' ou '—'
        if (text.length > 90) {
          if (text.includes(':')) {
            const parts = text.split(':');
            const prefix = parts[0].trim();
            if (prefix.length > 0 && prefix.length <= 55) {
              return { isLong: true, mainText: prefix, fullText: text };
            }
          } else if (text.includes('—')) {
            const parts = text.split('—');
            const prefix = parts[0].trim();
            if (prefix.length > 0 && prefix.length <= 65) {
              return { isLong: true, mainText: prefix, fullText: text };
            }
          }
        }

        return { isLong: false, mainText: text, fullText: text };
      }

      // Helper para renderizar os cards individuais de critérios
      function renderCriterionCard(crit, obsInstance) {
        const resp = (obsInstance.responses && obsInstance.responses[crit.id]) || null;
        const comm = (obsInstance.criterionComments && obsInstance.criterionComments[crit.id]) || '';
        const photos = (obsInstance.photos && obsInstance.photos[crit.id]) ? obsInstance.photos[crit.id] : [];

        const card = document.createElement('div');
        card.id = `crit-card-${crit.id}`;
        card.className = `crit-card ${resp === null ? 'unanswered' : ''}`;

        const mobileFormat = formatCriterionMobileDisplay(crit);

        let html = `
          <div class="crit-top">
            <div class="crit-text">
              <span class="crit-text-desktop">${crit.text}</span>
              <span class="crit-text-mobile">${mobileFormat.mainText}</span>
              ${mobileFormat.isLong ? `
                <button type="button" class="btn-crit-detail-trigger" onclick="openCriterionDetailModal('${crit.id}')" title="Ver enunciado canônico oficial completo">
                  <span>ℹ️</span> Detalhes
                </button>
              ` : ''}
            </div>
            <div class="crit-tag">Item ${crit.id}</div>
          </div>

          <div class="scale-4col-group">
            <button class="scale-opt ${resp === 'consistent' ? 'active-consistent' : ''}" 
                    onclick="setResponse('${crit.id}', 'consistent')" ${appState.isReadOnly ? 'disabled' : ''}>
              ${obsInstance.evaluatedType === 'coordenador' ? 'Sim / Cons.' : 'Consistente'}
            </button>
            <button class="scale-opt ${resp === 'partial' ? 'active-partial' : ''}" 
                    onclick="setResponse('${crit.id}', 'partial')" ${appState.isReadOnly ? 'disabled' : ''}>
              Parcial
            </button>
            <button class="scale-opt ${resp === 'not_done' ? 'active-notdone' : ''}" 
                    onclick="setResponse('${crit.id}', 'not_done')" ${appState.isReadOnly ? 'disabled' : ''}>
              ${obsInstance.evaluatedType === 'coordenador' ? 'Não / Não R.' : 'Não Realizado'}
            </button>
            <button class="scale-opt ${resp === 'na' ? 'active-na' : ''}" 
                    onclick="setResponse('${crit.id}', 'na')" ${appState.isReadOnly ? 'disabled' : ''}
                    title="Item não aplicável na rotina deste dia">
              Não se Aplica
            </button>
          </div>

          ${(resp === 'partial' && obsInstance.evaluatedType === 'turma') ? `
            <!-- PILAR 5: ATRIBUIÇÃO MANDATÓRIA (ITEM PARCIAL) -->
            <div id="partial-attribution-box-${crit.id}" class="partial-attribution-box">
              <div style="display:flex; align-items:center; justify-content:space-between; gap:6px; margin-bottom:6px;">
                <div style="display:flex; align-items:center; gap:6px;">
                  <span style="font-size:14px;">⚠️</span>
                  <span style="font-size:12px; font-weight:800; color:#B45309; text-transform:uppercase;">
                    Atribuição Mandatória (Item Parcial)
                  </span>
                </div>
                ${obsInstance.isIntegral ? `
                  <span style="font-size:10px; font-weight:700; padding:2px 8px; border-radius:10px; ${obsInstance.integralStage === 'matutino' ? 'background:#DBEAFE; color:#1E40AF;' : 'background:#FEF3C7; color:#92400E;'}">
                    ${obsInstance.integralStage === 'matutino' ? '☀️ Etapa Matutina: Restrita aos Regentes da Manhã' : '🌅 Etapa Vespertina: Equipe Completa (4 Regentes)'}
                  </span>
                ` : ''}
              </div>
              <p style="font-size:11px; color:#92400E; margin-bottom:10px; line-height:1.4;">
                ${obsInstance.isIntegral && obsInstance.integralStage === 'matutino'
                  ? '☀️ <strong>Etapa Matutina:</strong> Indique o(a) docente regente da manhã responsável por esta fragilidade e justifique objetivamente.'
                  : 'Indique o(a) docente regente responsável por esta prática e justifique a pontuação parcial com evidências objetivas.'}
              </p>

              <div style="margin-bottom:10px;">
                <label style="font-size:11px; font-weight:700; color:#78350F; display:block; margin-bottom:6px;">
                  Docente(s) Regente(s) Responsável(is):
                </label>
                <div style="display:flex; flex-wrap:wrap; gap:8px;">
                  ${(() => {
                    let teachers = (obsInstance.teachers && obsInstance.teachers.length > 0) 
                      ? obsInstance.teachers 
                      : (obsInstance.teacherName ? [obsInstance.teacherName] : []);

                    if (obsInstance.isIntegral) {
                      if (obsInstance.integralStage === 'matutino') {
                        teachers = (obsInstance.teachersMorning && obsInstance.teachersMorning.length > 0)
                          ? obsInstance.teachersMorning
                          : teachers.slice(0, 2);
                      } else {
                        teachers = (obsInstance.teachers && obsInstance.teachers.length > 0)
                          ? obsInstance.teachers
                          : teachers;
                      }
                    }

                    const currentAttr = (obsInstance.partialAttributions && obsInstance.partialAttributions[crit.id]) || { teachers: [], justification: '' };
                    const selectedTeachers = currentAttr.teachers || [];
                    const isSingle = teachers.length === 1;

                    return teachers.map(tName => {
                      const isChecked = isSingle || selectedTeachers.includes(tName);
                      return `
                        <label class="teacher-chip-select ${isChecked ? 'selected' : ''}">
                          <input type="checkbox" 
                                 value="${tName}" 
                                 ${isChecked ? 'checked' : ''} 
                                 ${(isSingle || appState.isReadOnly) ? 'disabled' : ''} 
                                 onchange="setCriterionPartialTeacher('${crit.id}', '${tName}', this.checked)"
                                 style="cursor:pointer;">
                          <span>${tName}</span>
                          ${isSingle ? '<span style="font-size:9px; background:#FEF3C7; padding:1px 4px; border-radius:4px; margin-left:4px;">Único Regente</span>' : ''}
                        </label>
                      `;
                    }).join('');
                  })()}
                </div>
              </div>

              <div>
                <label style="font-size:11px; font-weight:700; color:#78350F; display:block; margin-bottom:4px;">
                  Justificativa da Pontuação Parcial (Mínimo de 5 caracteres):
                </label>
                <textarea class="form-textarea" 
                          style="min-height:64px; background:#FFFFFF; border-color:#FDE68A; font-size:12px;"
                          placeholder="${appState.isReadOnly ? 'Sem justificativa.' : 'Descreva a fragilidade ou aspecto parcial observado nesta prática...'}"
                          oninput="setCriterionPartialJustification('${crit.id}', this.value)"
                          ${appState.isReadOnly ? 'disabled' : ''}>${((obsInstance.partialAttributions && obsInstance.partialAttributions[crit.id] && obsInstance.partialAttributions[crit.id].justification) || '')}</textarea>
              </div>
            </div>
          ` : ''}

          <div class="crit-evidence-container">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:11px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">
                Evidências e Observações Pontuais
              </span>
              ${!appState.isReadOnly ? `
                <button class="btn-add-photo" onclick="triggerPhotoUpload('${crit.id}')">
                  📷 Anexar Foto
                </button>
              ` : ''}
            </div>

            ${(resp === 'consistent' && obsInstance.evaluatedType === 'turma') ? `
              <div style="margin-top:8px;">
                <span class="badge-good-practice">✨ Prática Consistente · Evidência de Boa Prática</span>
              </div>
            ` : ''}

            <div class="photo-evidence-bar" id="photo-box-${crit.id}">
        `;

        photos.forEach((photoUri, pIdx) => {
          html += `
            <div class="photo-thumb-wrapper">
              <img src="${photoUri}" alt="Evidência ${crit.id}" onclick="previewImage('${photoUri}')">
              ${!appState.isReadOnly ? `
                <button class="photo-del-btn" onclick="removePhoto('${crit.id}', ${pIdx})">✕</button>
              ` : ''}
            </div>
          `;
        });

        html += `
            </div>

            <div class="crit-comment-input">
              <textarea class="form-textarea" 
                        placeholder="${appState.isReadOnly ? 'Sem anotações complementares.' : 'Descreva a evidência ou observação pontual...'}"
                        onchange="setComment('${crit.id}', this.value)"
                        ${appState.isReadOnly ? 'disabled' : ''}>${comm}</textarea>
            </div>
          </div>
        `;

        card.innerHTML = html;
        return card;
      }

      // Critérios organizados:
      // Se for Coordenador (Instrumento do Formador): SEM subdimensões -> variáveis sempre visíveis diretamente!
      // Se for Professor: COM subdimensões em acordeão (clique no nome da subdimensão expande/recolhe variáveis).
      const currentSec = getActiveSections(appState.currentObs)[appState.activeTabIndex];
      const container = document.getElementById('criteriaListContainer');
      container.innerHTML = `
        <div style="font-size:18px; font-weight:800; color:var(--primary-dark); margin-bottom:14px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
          <span>${appState.activeTabIndex + 1}. ${(currentSec.title || '').replace(/^Dimens[aã]o\s*\d*\s*[:\.\-]?\s*/i, '').trim()}</span>
        </div>
      `;

      const isCoordinator = obs.evaluatedType === 'coordenador';

      if (isCoordinator) {
        // Instrumento do Formador: Não há subdimensões. As variáveis são exibidas diretamente.
        currentSec.subSections.forEach(sub => {
          sub.criteria.forEach(crit => {
            const card = renderCriterionCard(crit, obs);
            container.appendChild(card);
          });
        });
      } else {
        // Instrumento da Professora: Possui subdimensões em formato acordeão
        if (!appState.openSubdimensions) {
          appState.openSubdimensions = {};
        }

        currentSec.subSections.forEach(sub => {
          let subFilled = 0;
          const subTotal = sub.criteria.length;
          sub.criteria.forEach(c => {
            if (obs.responses[c.id]) subFilled++;
          });
          const isSubPending = subFilled < subTotal;
          const isOpen = !!appState.openSubdimensions[sub.id];

          const subCard = document.createElement('div');
          subCard.className = `subdim-accordion-card ${isSubPending && !appState.isReadOnly ? 'pending-highlight' : ''}`;

          subCard.innerHTML = `
            <div class="subdim-accordion-header" onclick="toggleSubdimension('${sub.id}')" title="Clique para ${isOpen ? 'recolher' : 'abrir'} critérios da subdimensão">
              <div class="subdim-title-group">
                <span class="subdim-number-tag">${sub.id}</span>
                <span class="subdim-title-text">${sub.title}</span>
              </div>
              <div class="subdim-header-right">
                ${isSubPending && !appState.isReadOnly ? `
                  <span class="subdim-pending-badge">
                    <span class="subdim-dot"></span>
                    ${subTotal - subFilled} pendente(s)
                  </span>
                ` : `
                  <span class="subdim-completed-badge">
                    ✓ ${subFilled}/${subTotal}
                  </span>
                `}
                <svg class="subdim-chevron ${isOpen ? 'open' : ''}" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>
            <div class="subdim-body ${isOpen ? 'open' : ''}">
            </div>
          `;

          const subBody = subCard.querySelector('.subdim-body');

          sub.criteria.forEach(crit => {
            const card = renderCriterionCard(crit, obs);
            subBody.appendChild(card);
          });

          container.appendChild(subCard);
        });
      }

      // Actions Footer (removido botão de salvar rascunho e próxima dimensão; na última dimensão dá opção de síntese)
      const footer = document.getElementById('obsFooterActions');
      const isLast = appState.activeTabIndex === getActiveSections(appState.currentObs).length - 1;
      if (footer) {
        if (isLast) {
          footer.style.display = 'flex';
          footer.innerHTML = `
            <button class="btn btn-primary" onclick="renderSynthesisScreen()" style="margin-left:auto;">
              ${appState.isReadOnly ? 'VER SÍNTESE FINAL →' : 'AVANÇAR PARA SÍNTESE →'}
            </button>
          `;
        } else {
          footer.style.display = 'none';
          footer.innerHTML = '';
        }
      }

      if (preserveScroll) {
        window.scrollTo({ top: previousScroll, behavior: 'instant' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    function setResponse(critId, val) {
      if (appState.isReadOnly || !appState.currentObs) return;
      appState.currentObs.responses[critId] = val;

      // PILAR 5: Se for pontuado como 'partial', inicializa ou limpa partialAttributions
      if (!appState.currentObs.partialAttributions) appState.currentObs.partialAttributions = {};
      if (val === 'partial') {
        if (!appState.currentObs.partialAttributions[critId]) {
          const teachers = (appState.currentObs.teachers && appState.currentObs.teachers.length > 0)
            ? appState.currentObs.teachers
            : (appState.currentObs.teacherName ? [appState.currentObs.teacherName] : []);
          appState.currentObs.partialAttributions[critId] = {
            teachers: teachers.length === 1 ? [teachers[0]] : [],
            justification: ''
          };
        }
      } else {
        // Se mudou de parcial para outra nota, remove a atribuição parcial
        delete appState.currentObs.partialAttributions[critId];
      }

      saveState();
      renderActiveObservation(true);
    }

    function updateActiveObsHeaderValidationUI() {
      const obs = appState.currentObs;
      if (!obs) return;
      const pendencies = getObservationPendencies(obs);
      const valBanner = document.getElementById('activeObsValidationBanner');
      if (valBanner) {
        if (pendencies.length > 0 && !appState.isReadOnly) {
          valBanner.classList.add('visible');
          valBanner.style.display = 'flex';
          const titleEl = document.getElementById('validationAlertTitle');
          const descEl = document.getElementById('validationAlertDesc');
          if (titleEl) titleEl.innerText = `${pendencies.length} pergunta(s) pendente(s) no formulário`;
          if (descEl) descEl.innerText = `Pelo plano SerTão Criança, o preenchimento integral é obrigatório antes da finalização. Toque para ir à primeira pendência.`;
        } else {
          valBanner.classList.remove('visible');
          valBanner.style.display = 'none';
        }
      }
    }

    // PILAR 5: Manipulação Reativa de Atribuição a Docente em Itens Parciais
    function setCriterionPartialTeacher(critId, teacherName, isChecked) {
      if (appState.isReadOnly || !appState.currentObs) return;
      if (!appState.currentObs.partialAttributions) appState.currentObs.partialAttributions = {};
      if (!appState.currentObs.partialAttributions[critId]) {
        appState.currentObs.partialAttributions[critId] = { teachers: [], justification: '' };
      }

      let teachers = appState.currentObs.partialAttributions[critId].teachers || [];
      if (isChecked) {
        if (!teachers.includes(teacherName)) teachers.push(teacherName);
      } else {
        teachers = teachers.filter(t => t !== teacherName);
      }
      appState.currentObs.partialAttributions[critId].teachers = teachers;
      saveState();
      // Atualiza o banner de validação e contador de pendências sem perder foco
      updateActiveObsHeaderValidationUI();
    }

    // PILAR 5: Manipulação Reativa da Justificativa Descritiva em Itens Parciais
    function setCriterionPartialJustification(critId, text) {
      if (appState.isReadOnly || !appState.currentObs) return;
      if (!appState.currentObs.partialAttributions) appState.currentObs.partialAttributions = {};
      if (!appState.currentObs.partialAttributions[critId]) {
        appState.currentObs.partialAttributions[critId] = { teachers: [], justification: '' };
      }
      appState.currentObs.partialAttributions[critId].justification = text;
      saveState();
      // Atualiza o banner de validação e contador de pendências sem perder foco
      updateActiveObsHeaderValidationUI();
    }

    function setComment(critId, val) {
      if (appState.isReadOnly || !appState.currentObs) return;
      appState.currentObs.criterionComments[critId] = val;
      saveState();
    }

    function triggerPhotoUpload(critId) {
      if (appState.isReadOnly) return;
      appState.uploadTargetCritId = critId;
      document.getElementById('evidenceFileInput').click();
    }

    function handlePhotoUpload(e) {
      const file = e.target.files[0];
      if (!file || !appState.uploadTargetCritId || !appState.currentObs) return;

      const reader = new FileReader();
      reader.onload = function(evt) {
        const img = new Image();
        img.onload = function() {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_SIZE = 1024;

          if (width > height) {
            if (width > MAX_SIZE) {
              height = Math.round(height * (MAX_SIZE / width));
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width = Math.round(width * (MAX_SIZE / height));
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Comprime para JPEG com 60% de qualidade para aliviar o localStorage
          const base64 = canvas.toDataURL('image/jpeg', 0.6);

          if (!appState.currentObs.photos) appState.currentObs.photos = {};
          if (!appState.currentObs.photos[appState.uploadTargetCritId]) {
            appState.currentObs.photos[appState.uploadTargetCritId] = [];
          }
          
          appState.currentObs.photos[appState.uploadTargetCritId].push(base64);
          
          const saved = saveState();
          if (saved) {
            const isSynth = document.getElementById('screenSynthesis') && document.getElementById('screenSynthesis').classList.contains('active');
            if (isSynth) {
              renderSynthesisScreen(true);
            } else {
              renderActiveObservation(true);
            }
            showToast('Foto anexada com sucesso!');
          } else {
            // Se falhar ao salvar (ex: localStorage lotado), remove a foto do estado em memória
            appState.currentObs.photos[appState.uploadTargetCritId].pop();
          }
        };
        img.src = evt.target.result;
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }

    function removePhoto(critId, pIdx) {
      if (appState.isReadOnly || !appState.currentObs) return;
      if (appState.currentObs.photos && appState.currentObs.photos[critId]) {
        appState.currentObs.photos[critId].splice(pIdx, 1);
        if (appState.currentObs.photos[critId].length === 0) {
          delete appState.currentObs.photos[critId];
        }
        saveState();
        const isSynth = document.getElementById('screenSynthesis') && document.getElementById('screenSynthesis').classList.contains('active');
        if (isSynth) {
          renderSynthesisScreen(true);
        } else {
          renderActiveObservation(true);
        }
      }
    }

    function previewImage(src) {
      const w = window.open('');
      w.document.write(`<img src="${src}" style="max-width:100%; height:auto; display:block; margin:20px auto; border-radius:8px;">`);
    }

    function nextDimension() {
      if (appState.activeTabIndex < getActiveSections(appState.currentObs).length - 1) {
        appState.activeTabIndex++;
        renderActiveObservation(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    function prevDimension() {
      if (appState.activeTabIndex > 0) {
        appState.activeTabIndex--;
        renderActiveObservation(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    function backToCriteria() {
      renderActiveObservation(false);
    }

    function goToFirstPending() {
      const obs = appState.currentObs;
      if (!obs) return;
      const pendencies = getObservationPendencies(obs);
      if (pendencies.length === 0) return;

      const target = pendencies[0];
      appState.activeTabIndex = target.dimensionIndex;

      // Garante que a subdimensão seja aberta
      const sections = getActiveSections(obs);
      const sec = sections[target.dimensionIndex];
      if (sec) {
        sec.subSections.forEach(sub => {
          if (sub.criteria.some(c => c.id === target.criterionId)) {
            if (!appState.openSubdimensions) appState.openSubdimensions = {};
            appState.openSubdimensions[sub.id] = true;
          }
        });
      }

      renderActiveObservation(false);

      setTimeout(() => {
        const el = document.getElementById(`crit-card-${target.criterionId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.style.boxShadow = '0 0 0 3px #EF4444';
          setTimeout(() => el.style.boxShadow = '', 2500);
        }
      }, 250);
    }

