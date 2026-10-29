    // --- 2. GLOBAL STATE ---
    let appState = {
      currentUserKey: 'mariana',
      activeSectionsTeacher: JSON.parse(JSON.stringify(DEFAULT_SECTIONS_TEACHER)), activeSectionsCoordinator: JSON.parse(JSON.stringify(DEFAULT_SECTIONS_COORDINATOR)),
      polos: JSON.parse(JSON.stringify(INITIAL_POLOS)), // <-- SSOT POLOS REGIONAIS
      units: JSON.parse(JSON.stringify(INITIAL_UNITS)),
      classes: JSON.parse(JSON.stringify(INITIAL_CLASSES)), // <-- PILAR 1: CATÁLOGO DE TURMAS
      deletedClassIds: [], // <-- PILAR 14: SSOT EXCLUSÕES
      bimesterPeriods: JSON.parse(JSON.stringify(DEFAULT_BIMESTER_PERIODS)), // <-- PILAR 15: SSOT CICLOS
      academicYears: [...DEFAULT_ACADEMIC_YEARS],
      selectedAcademicYear: DEFAULT_SELECTED_ACADEMIC_YEAR,
      currentPedagSubTab: 'units',
      teamMembers: JSON.parse(JSON.stringify(INITIAL_TEAM)),
      notes: JSON.parse(JSON.stringify(INITIAL_NOTES)),
      schedules: JSON.parse(JSON.stringify(INITIAL_SCHEDULES)),
      observations: [],
      currentObs: null,
      bottlenecksSortMode: 'absolute',
      activeTabIndex: 0,
      isReadOnly: false,
      historyFilter: 'drafts',
      uploadTargetCritId: null,
      expandedDrilldowns: {}
    };

    function loadState() {
      const saved = localStorage.getItem('SERTAO_CRIANCA_APP_STATE_V6') || localStorage.getItem('SERTAO_CRIANCA_APP_STATE_V4');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          appState = { ...appState, ...parsed };
          if (!appState.units || appState.units.length === 0) appState.units = JSON.parse(JSON.stringify(INITIAL_UNITS));
          if (!appState.polos || !Array.isArray(appState.polos) || appState.polos.length === 0) {
            const existingPolosNames = Array.from(new Set((appState.units || []).map(u => u.polo).filter(Boolean)));
            if (existingPolosNames.length > 0) {
              appState.polos = existingPolosNames.map((pName, idx) => ({
                id: 'polo-' + (idx + 1),
                name: pName,
                region: ''
              }));
            } else {
              appState.polos = JSON.parse(JSON.stringify(INITIAL_POLOS));
            }
          }
          if (!appState.deletedClassIds) appState.deletedClassIds = [];
          if (Array.isArray(appState.units)) {
            appState.units.forEach(u => {
              if (u.totalStudents === undefined) u.totalStudents = 120;
              if (u.inclusiveStudents === undefined) u.inclusiveStudents = 5;
              if (u.totalClasses === undefined) {
                u.totalClasses = (appState.classes || []).filter(c => c.school === u.name).length || 4;
              }
            });
          }
          if (!appState.bottlenecksSortMode) appState.bottlenecksSortMode = 'absolute';
          if (!appState.classes || !Array.isArray(appState.classes) || appState.classes.length === 0) {
            appState.classes = JSON.parse(JSON.stringify(INITIAL_CLASSES));
          } else {
            // Saneamento e deduplicação resiliente contra turmas órfãs com mesmo ID
            const seenClassIds = new Set();
            appState.classes = appState.classes.filter(c => {
              if (!c || !c.id) return false;
              if (seenClassIds.has(c.id)) return false;
              seenClassIds.add(c.id);
              return true;
            });
          }
          if (!appState.bimesterPeriods || typeof appState.bimesterPeriods !== 'object') {
            appState.bimesterPeriods = JSON.parse(JSON.stringify(DEFAULT_BIMESTER_PERIODS));
          } else {
            // Garante presença e integridade dos 4 bimestres canônicos
            ['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre'].forEach(bName => {
              if (!appState.bimesterPeriods[bName] || !appState.bimesterPeriods[bName].startDate || !appState.bimesterPeriods[bName].endDate) {
                appState.bimesterPeriods[bName] = JSON.parse(JSON.stringify(DEFAULT_BIMESTER_PERIODS[bName]));
              }
            });
          }
          if (!appState.academicYears || !Array.isArray(appState.academicYears) || appState.academicYears.length === 0) {
            appState.academicYears = [...DEFAULT_ACADEMIC_YEARS];
          }
          // Sanitização e Autocura contra Anos Letivos Futuros que ainda não iniciaram efetivamente
          const currentRealYear = new Date().getFullYear();
          if (Array.isArray(appState.academicYears)) {
            const hasFutureYears = appState.academicYears.some(y => parseInt(y, 10) > currentRealYear);
            if (hasFutureYears) {
              appState.academicYears = appState.academicYears.filter(y => {
                const parsed = parseInt(y, 10);
                return !isNaN(parsed) && parsed <= currentRealYear;
              });
              if (appState.academicYears.length === 0) {
                appState.academicYears = [...DEFAULT_ACADEMIC_YEARS].filter(y => parseInt(y, 10) <= currentRealYear);
              }
              // Expurgar períodos bimestrais de anos futuros
              if (appState.bimesterPeriods && typeof appState.bimesterPeriods === 'object') {
                Object.keys(appState.bimesterPeriods).forEach(k => {
                  if (/^\d{4}$/.test(k) && parseInt(k, 10) > currentRealYear) {
                    delete appState.bimesterPeriods[k];
                  }
                });
              }
              // Expurgar turmas vinculadas a anos futuros
              if (Array.isArray(appState.classes)) {
                appState.classes = appState.classes.filter(c => {
                  const clsYear = parseInt(c.academicYear, 10);
                  return isNaN(clsYear) || clsYear <= currentRealYear;
                });
              }
              saveState();
            }
          }
          if (!appState.selectedAcademicYear) {
            appState.selectedAcademicYear = DEFAULT_SELECTED_ACADEMIC_YEAR;
          }
          if (appState.selectedAcademicYear && parseInt(appState.selectedAcademicYear, 10) > currentRealYear) {
            const validSortedYears = [...(appState.academicYears || ['2026'])].map(y => parseInt(y, 10)).sort((a, b) => b - a);
            appState.selectedAcademicYear = (validSortedYears[0] || currentRealYear).toString();
            saveState();
          }
          if (!appState.currentPedagSubTab) {
            appState.currentPedagSubTab = 'units';
          }
          if (!appState.teamMembers || appState.teamMembers.length === 0) appState.teamMembers = JSON.parse(JSON.stringify(INITIAL_TEAM));
          if (!appState.notes) appState.notes = JSON.parse(JSON.stringify(INITIAL_NOTES));
          if (!appState.schedules) appState.schedules = JSON.parse(JSON.stringify(INITIAL_SCHEDULES));
          if (!appState.activeSectionsTeacher) appState.activeSectionsTeacher = appState.customDefaultTeacher ? JSON.parse(JSON.stringify(appState.customDefaultTeacher)) : JSON.parse(JSON.stringify(DEFAULT_SECTIONS_TEACHER)); if (!appState.activeSectionsCoordinator) appState.activeSectionsCoordinator = appState.customDefaultCoordinator ? JSON.parse(JSON.stringify(appState.customDefaultCoordinator)) : JSON.parse(JSON.stringify(DEFAULT_SECTIONS_COORDINATOR));
          
          if (!appState.customUsers) appState.customUsers = {};
          Object.assign(USERS_DB, appState.customUsers);

          // Saneamento transparente de agendamentos legados (Pilar 1: Turma)
          if (Array.isArray(appState.schedules)) {
            appState.schedules.forEach(s => {
              if (!s.targetType) {
                const targetCoord = (appState.teamMembers || []).find(m => m.name === s.targetName && m.roleKey === 'coordenador');
                if (targetCoord || (s.className && s.className.toLowerCase().includes('coord'))) {
                  s.targetType = 'coordenador';
                } else {
                  s.targetType = 'turma';
                  const teacherMember = (appState.teamMembers || []).find(m => m.name === s.targetName && m.roleKey === 'professora');
                  if (teacherMember) {
                    s.className = teacherMember.classAssigned || s.className || 'Infantil I - Turma A';
                    s.targetName = s.className;
                    s.teachers = [teacherMember.name];
                  } else if (s.className) {
                    s.targetName = s.className;
                  }
                }
              }
            });
          }

          // Saneamento transparente e sincronização de integridade relacional
          if (Array.isArray(appState.teamMembers)) {
            let sanitized = false;
            appState.teamMembers.forEach(m => {
              const canonicalName = resolveCanonicalUserName(m.name);
              if (canonicalName && canonicalName !== m.name) {
                m.name = canonicalName;
                sanitized = true;
              }
              const canonicalSup = resolveCanonicalUserName(m.supervisor);
              if (canonicalSup && canonicalSup !== m.supervisor && canonicalSup !== 'Nenhum' && canonicalSup !== 'Gestão Geral') {
                m.supervisor = canonicalSup;
                sanitized = true;
              }

              // Sincroniza dados com USERS_DB resolvendo por id canônico ou nome
              const dbKey = (typeof findUserDbKey === 'function' ? findUserDbKey(m.id) || findUserDbKey(m.name) || findUserDbKey(m.email) : null) || Object.keys(USERS_DB).find(k => 
                k === m.id || 
                USERS_DB[k].id === m.id || 
                (USERS_DB[k].name && USERS_DB[k].name.toLowerCase() === m.name.toLowerCase())
              );
              if (dbKey && USERS_DB[dbKey]) {
                if (USERS_DB[dbKey].school !== m.school) {
                  USERS_DB[dbKey].school = m.school;
                  sanitized = true;
                }
                if (USERS_DB[dbKey].supervisor !== m.supervisor) {
                  USERS_DB[dbKey].supervisor = m.supervisor;
                  sanitized = true;
                }
                if (USERS_DB[dbKey].roleKey !== m.roleKey) {
                  USERS_DB[dbKey].roleKey = m.roleKey;
                  sanitized = true;
                }
                // Sincronização bidirecional e autocura de e-mail e avatar
                if (!m.email && USERS_DB[dbKey].email) {
                  m.email = USERS_DB[dbKey].email;
                  sanitized = true;
                } else if (m.email && !USERS_DB[dbKey].email) {
                  USERS_DB[dbKey].email = m.email;
                  sanitized = true;
                }
                if (!m.avatarText && USERS_DB[dbKey].avatarText) {
                  m.avatarText = USERS_DB[dbKey].avatarText;
                  sanitized = true;
                }
                if (!appState.customUsers) appState.customUsers = {};
                if (!appState.customUsers[dbKey]) {
                  appState.customUsers[dbKey] = { ...USERS_DB[dbKey] };
                  sanitized = true;
                } else {
                  appState.customUsers[dbKey].school = m.school;
                  appState.customUsers[dbKey].supervisor = m.supervisor;
                  appState.customUsers[dbKey].roleKey = m.roleKey;
                  if (m.email && !appState.customUsers[dbKey].email) {
                    appState.customUsers[dbKey].email = m.email;
                    sanitized = true;
                  }
                  if (!appState.customUsers[dbKey].avatarText && m.avatarText) {
                    appState.customUsers[dbKey].avatarText = m.avatarText;
                    sanitized = true;
                  }
                }
              }
            });
            if (Array.isArray(appState.classes)) {
              appState.classes.forEach(c => {
                if (typeof c.totalStudents !== 'number' || isNaN(c.totalStudents)) {
                  c.totalStudents = 20;
                  sanitized = true;
                }
                if (typeof c.inclusiveStudents !== 'number' || isNaN(c.inclusiveStudents)) {
                  c.inclusiveStudents = 0;
                  sanitized = true;
                }
                if (c.inclusiveStudents > c.totalStudents) {
                  c.inclusiveStudents = c.totalStudents;
                  sanitized = true;
                }
              });
            }
            if (typeof syncUnitCharacterizationFromClasses === 'function') {
              syncUnitCharacterizationFromClasses();
            }

            if (sanitized) saveState();
          }
        } catch (e) {
          seedSampleData();
        }
      } else {
        seedSampleData();
      }
      checkAndAutoArchive(true);
      applyUserRoleUI();
      const dateEl = document.getElementById('setupDate');
      if (dateEl) {
        const todayStr = getTodayDateString();
        dateEl.value = todayStr;
        dateEl.max = todayStr;
      }
      
      navigateToTab('home');
    }

    // Rotina central de auto-arquivamento após 4 dias de registro
    function checkAndAutoArchive(silent = true) {
      if (!appState) return 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const FOUR_DAYS_MS = 4 * 24 * 60 * 60 * 1000;
      let archivedCount = 0;

      // 1. Auto-arquivar Observações Concluídas registradas há 4 dias ou mais (respeitando desarquivamento manual)
      if (Array.isArray(appState.observations)) {
        appState.observations.forEach(obs => {
          if (obs.status === 'finalized' && !obs.archived && !obs.manuallyUnarchived && (obs.endDate || obs.date || obs.startDate)) {
            const obsDate = new Date((obs.endDate || obs.date || obs.startDate) + 'T00:00:00');
            if (!isNaN(obsDate.getTime())) {
              const diffMs = today.getTime() - obsDate.getTime();
              if (diffMs >= FOUR_DAYS_MS) {
                obs.archived = true;
                archivedCount++;
              }
            }
          }
        });
      }

      // 2. Auto-arquivar Ocorrências de Campo (Notes) registradas há 4 dias ou mais (respeitando desarquivamento manual)
      if (Array.isArray(appState.notes)) {
        appState.notes.forEach(note => {
          if (!note.archived && !note.manuallyUnarchived && note.date) {
            const noteDate = new Date(note.date + 'T00:00:00');
            if (!isNaN(noteDate.getTime())) {
              const diffMs = today.getTime() - noteDate.getTime();
              if (diffMs >= FOUR_DAYS_MS) {
                note.archived = true;
                archivedCount++;
              }
            }
          }
        });
      }

      if (archivedCount > 0) {
        saveState();
        if (!silent) {
          showToast(`${archivedCount} registro(s) com mais de 4 dias foram auto-arquivados.`);
        }
      }
      return archivedCount;
    }

    function saveState() {
      try {
        localStorage.setItem('SERTAO_CRIANCA_APP_STATE_V6', JSON.stringify(appState));
        return true;
      } catch (err) {
        console.error("Erro ao salvar no localStorage", err);
        alert("Erro crítico: Limite de armazenamento local atingido! Libere espaço (exclua observações antigas ou sincronize-as) para continuar salvando.");
        return false;
      }
    }

    // --- SSOT: CONSULTA CANÔNICA DE POLOS REGIONAIS ---
    function getAllPolosList() {
      if (Array.isArray(appState.polos) && appState.polos.length > 0) {
        const list = appState.polos.map(p => (typeof p === 'string' ? p : p.name)).filter(Boolean);
        // Garante inclusão de qualquer polo registrado em unidades existentes
        (appState.units || []).forEach(u => {
          if (u.polo && !list.includes(u.polo)) list.push(u.polo);
        });
        return Array.from(new Set(list));
      }
      const fromUnits = Array.from(new Set((appState.units || []).map(u => u.polo).filter(Boolean)));
      return fromUnits.length > 0 ? fromUnits : ['Polo Regional 1 (Norte)', 'Polo Regional 2 (Sul)'];
    }

    function showToast(msg) {
      const toast = document.getElementById('toastMessage');
      document.getElementById('toastText').innerText = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2600);
    }

    // Helper central de data local no formato YYYY-MM-DD (imune a distorções de fuso horário UTC)
    function getTodayDateString() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    // Helper central de horário local no formato HH:mm
    function getNowTimeString() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    }

    // Formata string YYYY-MM-DD para DD/MM/AAAA
    function formatDateBR(dateStr) {
      if (!dateStr) return '';
      const parts = dateStr.split('-');
      if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
      return dateStr;
    }

    // Regra canônica de datas: se início e fim forem iguais, exibe apenas uma. Se diferentes, exibe ambas.
    function formatObservationDateRange(obs) {
      if (!obs) return '';
      const startRaw = obs.startDate || obs.date || '';
      const endRaw = obs.endDate || (obs.status === 'finalized' || obs.status === 'concluida' ? (obs.date || '') : '');
      const startBR = formatDateBR(startRaw);
      const endBR = formatDateBR(endRaw);

      if (startBR && endBR && startBR !== endBR) {
        return `${startBR} a ${endBR}`;
      }
      return startBR || endBR || '';
    }

    // Helper robusto para cálculo da duração em minutos a partir de início e término
    function calculateObservationDuration(obs) {
      if (!obs || !obs.startTime) return 0;
      const sDate = obs.startDate || obs.date || getTodayDateString();
      const eDate = obs.endDate || sDate;
      const sTime = obs.startTime;
      const eTime = obs.endTime || getNowTimeString();
      try {
        const dStart = new Date(`${sDate}T${sTime}:00`);
        const dEnd = new Date(`${eDate}T${eTime}:00`);
        let diffMs = dEnd.getTime() - dStart.getTime();
        if (isNaN(diffMs) || diffMs < 0) {
          const [h1, m1] = sTime.split(':').map(Number);
          const [h2, m2] = eTime.split(':').map(Number);
          let diff = (h2 * 60 + m2) - (h1 * 60 + m1);
          return diff > 0 ? diff : 1;
        }
        return Math.max(1, Math.round(diffMs / 60000));
      } catch (e) {
        return 0;
      }
    }

    // Validação visual reativa dos campos de data e horários na tela de configuração de observação
    function validateSetupDateUI() {
      const dateEl = document.getElementById('setupDate');
      const startEl = document.getElementById('setupStartTime');
      const endEl = document.getElementById('setupEndTime');
      const hintEl = document.getElementById('setupDateValidationHint');
      if (!dateEl) return true;
      const todayStr = getTodayDateString();
      dateEl.max = todayStr;

      if (dateEl.value && dateEl.value > todayStr) {
        if (hintEl) {
          hintEl.style.display = 'block';
          hintEl.style.color = '#dc2626';
          hintEl.innerHTML = `🚫 Bloqueado: A data da observação não pode ser futura (data máxima permitida: ${formatDateBR(todayStr)}).`;
        }
        return false;
      }

      if (startEl && startEl.value && endEl && endEl.value) {
        if (endEl.value <= startEl.value) {
          if (hintEl) {
            hintEl.style.display = 'block';
            hintEl.style.color = '#dc2626';
            hintEl.innerHTML = `⚠️ Atenção aos Horários: O horário de término deve ser posterior ao horário de início.`;
          }
          return false;
        }
      }

      if (hintEl) {
        hintEl.style.display = 'none';
      }
      return true;
    }

