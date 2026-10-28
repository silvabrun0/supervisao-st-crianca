    function exportCurrentRubricsBackup() {
      exportRubricsJSON();
      setTimeout(() => exportRubricsCSV(), 400);
      showToast('Pacote completo de rubricas (JSON e CSV) exportado!');
    }

    function triggerImportRubricsJSON() {
      if (!window.isRubricsEditMode) {
        if (!confirm("Habilitar Modo de Edição para importar um arquivo de rubricas?")) return;
        const chk = document.getElementById('toggleRubricsEditMode');
        if (chk) { chk.checked = true; toggleRubricsEditMode(true); }
      }
      const inp = document.getElementById('importRubricsFileInput');
      if (inp) inp.click();
    }

    function importRubricsJSON(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;

      const matrixType = document.getElementById('rubricMatrixSelect')?.value || 'teacher';
      const label = matrixType === 'coordinator' ? 'Coordenadores' : 'Professores';

      if (!confirm(`Deseja importar a matriz do arquivo "${file.name}" para a Matriz de ${label}? Esta ação substituirá as rubricas ativas desta matriz no SSOT.`)) {
        event.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (Array.isArray(data)) {
            if (matrixType === 'coordinator') {
              appState.activeSectionsCoordinator = data;
            } else {
              appState.activeSectionsTeacher = data;
            }
            saveState();
            renderRubricsAdminScreen();
            showToast(`Matriz de ${label} importada com sucesso no SSOT!`);
          } else {
            alert("Estrutura do arquivo JSON inválida. O arquivo deve conter uma lista (array) de dimensões de rubricas.");
          }
        } catch (err) {
          alert("Erro ao processar arquivo JSON: " + err.message);
        }
      };
      reader.readAsText(file);
      event.target.value = '';
    }

    function exportRubricsJSON(filename = null) {
      const matrixType = document.getElementById('rubricMatrixSelect') ? document.getElementById('rubricMatrixSelect').value : 'teacher';
      const targetMatrix = getActiveMatrixSections(matrixType);
      const fname = filename || (matrixType === 'coordinator' ? "sertao_crianca_rubricas_coordenadores.json" : "sertao_crianca_rubricas_professores.json");
      downloadAsJSON(targetMatrix, fname);
      showToast('Rubricas exportadas com sucesso (JSON).');
    }

    function exportRubricsCSV(filename = null) {
      const matrixType = document.getElementById('rubricMatrixSelect') ? document.getElementById('rubricMatrixSelect').value : 'teacher';
      const targetMatrix = getActiveMatrixSections(matrixType);

      const headers = ["Dimensao", "Subdimensao_ID", "Subdimensao_Titulo", "Item_ID", "Descritor"];
      const rows = [];
      targetMatrix.forEach((s, sIdx) => {
        (s.subSections || []).forEach(sub => {
          (sub.criteria || []).forEach(c => {
            rows.push([
              `"${(s.title || '').replace(/"/g, '""')}"`,
              `"${(sub.id || '').replace(/"/g, '""')}"`,
              `"${(sub.title || '').replace(/"/g, '""')}"`,
              `"${(c.id || '').replace(/"/g, '""')}"`,
              `"${(c.text || '').replace(/"/g, '""')}"`
            ]);
          });
        });
      });

      const csvContent = "\uFEFF" + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
      const fname = filename || (matrixType === 'coordinator' ? 'sertao_crianca_rubricas_coordenadores.csv' : 'sertao_crianca_rubricas_professores.csv');
      downloadFile(csvContent, fname, 'text/csv;charset=utf-8;');
      showToast('Rubricas exportadas com sucesso (CSV).');
    }

    // =========================================================================
    // EXPORTAÇÃO JSON (COMPLETA, UES, MEMBROS E RUBRICAS)
    // =========================================================================
    function downloadAsJSON(dataObj, filename) {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataObj, null, 2));
      const dlAnchorElem = document.createElement('a');
      dlAnchorElem.setAttribute("href", dataStr);
      dlAnchorElem.setAttribute("download", filename);
      dlAnchorElem.click();
    }

    function exportFullBaseJSON() {
      const exportState = JSON.parse(JSON.stringify(appState));
      
      if (exportState.teamMembers) {
        exportState.teamMembers = exportState.teamMembers.map(m => {
          delete m.password;
          return m;
        });
      }
      
      if (exportState.customUsers) {
        Object.keys(exportState.customUsers).forEach(key => {
          delete exportState.customUsers[key].password;
        });
      }

      downloadAsJSON(exportState, "sertao_crianca_base_completa.json");
      showToast('Base completa exportada com sucesso (JSON).');
    }

    function exportTeamMembersJSON() {
      const safeMembers = (appState.teamMembers || []).map(m => {
        const { password, ...rest } = m;
        return rest;
      });
      downloadAsJSON(safeMembers, "sertao_crianca_servidores.json");
      showToast('Servidores exportados com sucesso (JSON).');
    }

    function exportUnitsJSON() {
      downloadAsJSON(appState.units, "sertao_crianca_ues.json");
      showToast('Unidades Escolares exportadas com sucesso (JSON).');
    }

    function exportAllNotesJSON() {
      downloadAsJSON(appState.notes, "sertao_crianca_anotacoes.json");
      showToast('Anotações formativas exportadas com sucesso (JSON).');
    }

    function exportAllObservationsJSON() {
      downloadAsJSON(appState.observations, "sertao_crianca_observacoes.json");
      showToast('Observações exportadas com sucesso (JSON).');
    }

    function triggerImportFullBase() {
      const input = document.getElementById('importFullBaseFileInput');
      if (input) input.click();
    }

    function importFullBaseJSON(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;

      if (!confirm('ATENÇÃO: A importação de um backup completo substituirá TODOS os dados atuais (incluindo UEs, membros e rubricas). Tem certeza que deseja prosseguir?')) {
        event.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data && typeof data === 'object') {
            // Preservar senhas existentes na memória atual ou definir padrão para novos
            if (data.teamMembers) {
              data.teamMembers.forEach(m => {
                const existing = (appState.teamMembers || []).find(ex => ex.id === m.id);
                if (existing && existing.password) m.password = existing.password;
              });
            }
            if (data.customUsers) {
              Object.keys(data.customUsers).forEach(key => {
                const existing = appState.customUsers && appState.customUsers[key];
                if (existing && existing.password) {
                  data.customUsers[key].password = existing.password;
                  data.customUsers[key].mustChangePassword = existing.mustChangePassword;
                } else {
                  data.customUsers[key].password = '123456';
                  data.customUsers[key].mustChangePassword = true;
                }
              });
            }
            if (Array.isArray(data.polos)) {
              appState.polos = data.polos;
            }

            appState = { ...appState, ...data };
            saveState();
            showToast('Base completa importada com sucesso!');
            setTimeout(() => location.reload(), 600);
          }
        } catch (err) {
          alert('Erro ao importar arquivo JSON: ' + err.message);
        }
      };
      reader.readAsText(file);
      event.target.value = '';
    }

    // =========================================================================
    // EXPORTAÇÃO CSV E AUXILIARES
    // =========================================================================
    function exportUnitsCSV() {
      const headers = ["ID", "Nome_Unidade", "Polo_Regional", "Endereco"];
      const rows = (appState.units || []).map(u => [u.id, `"${u.name}"`, `"${u.polo}"`, `"${u.address || ''}"`]);
      const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      downloadFile(csv, 'sertao_crianca_ues.csv', 'text/csv');
      showToast('Unidades Escolares exportadas com sucesso (CSV).');
    }

    function exportTeamMembersCSV() {
      const headers = ["ID", "Nome", "Cargo", "Unidade", "Supervisor", "Turma", "E-mail"];
      const rows = (appState.teamMembers || []).map(m => [m.id, `"${m.name}"`, `"${m.roleTitle || m.roleKey}"`, `"${m.school || ''}"`, `"${m.supervisor || ''}"`, `"${m.classAssigned || ''}"`, `"${m.email || ''}"`]);
      const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      downloadFile(csv, 'sertao_crianca_servidores.csv', 'text/csv');
      showToast('Servidores exportados com sucesso (CSV).');
    }

    function exportAllNotesCSV() {
      const headers = ["ID", "Data", "Unidade", "Turma", "Docente", "Registrado_Por", "Topico", "Conteudo", "Resolvido"];
      const rows = (appState.notes || []).map(n => [
        n.id, 
        n.date, 
        `"${n.schoolName}"`, 
        `"${n.className || 'Geral'}"`,
        `"${n.teacherName}"`, 
        `"${n.reportedBy}"`, 
        `"${n.topic}"`, 
        `"${(n.content || '').replace(/"/g, '""')}"`, 
        n.resolved ? 'Sim' : 'Nao'
      ]);
      const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      downloadFile(csv, 'sertao_crianca_anotacoes.csv', 'text/csv');
      showToast('Anotações formativas exportadas com sucesso (CSV).');
    }

    function exportAllObservationsCSV() {
      const headers = ["ID", "Data", "Unidade", "Docente", "Avaliador", "Status"];
      const rows = (appState.observations || []).map(o => [o.id, `"${formatObservationDateRange(o) || o.date}"`, `"${o.schoolName}"`, `"${o.teacherName}"`, `"${o.evaluatedBy}"`, o.status]);
      const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      downloadFile(csv, 'sertao_crianca_observacoes.csv', 'text/csv');
      showToast('Observações exportadas com sucesso (CSV).');
    }

    function exportHistoryFilteredCSV() {
      const items = getScopedObservations().filter(o => o.status === appState.historyFilter);
      const headers = ["ID", "Data", "Unidade", "Docente", "Avaliador", "Status"];
      const rows = items.map(o => [o.id, `"${formatObservationDateRange(o) || o.date}"`, `"${o.schoolName}"`, `"${o.teacherName}"`, `"${o.evaluatedBy}"`, o.status]);
      const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      downloadFile(csv, 'historico_filtrado.csv', 'text/csv');
      showToast('Histórico exportado (CSV).');
    }

    function exportHistoryFilteredPDF() {
      window.print();
    }

    function exportNotesFilteredCSV() {
      const items = getScopedNotes();
      const headers = [
        "ID", "Data_Registro", "Unidade", "Turma", "Jornada_MEC", 
        "Tipo_Ocorrencia", "Docente_Foco", "Registrado_Por", 
        "Conteudo", "Status_Conversado", "Data_Conversa", 
        "Conversado_Por", "Acordos_Pedagogicos", "ID_Observacao_Origem"
      ];
      const rows = items.map(n => [
        n.id,
        n.date,
        `"${n.schoolName}"`,
        `"${n.className || 'Turma'}"`,
        `"${n.classShift || formatMECShift(n.shift)}"`,
        n.isIndividualConduct ? '"Conduta Individual"' : '"Rotina Coletiva da Turma"',
        `"${n.teacherName || 'Geral'}"`,
        `"${n.reportedBy}"`,
        `"${(n.content || '').replace(/"/g, '""')}"`,
        n.resolved ? '"Conversado"' : '"Aguardando Conversa"',
        `"${n.resolvedAt || ''}"`,
        `"${n.resolvedBy || ''}"`,
        `"${(n.resolutionNotes || '').replace(/"/g, '""')}"`,
        `"${n.obsId || ''}"`
      ]);
      const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      downloadFile(csv, 'sertao_crianca_ocorrencias_campo.csv', 'text/csv');
      showToast('Ocorrências de campo exportadas com sucesso (CSV).');
    }

    function exportNotesFilteredPDF() {
      window.print();
    }

    // Modal Changelog Controls
    function openChangelogModal() {
      document.getElementById('modalChangelog').classList.add('active');
    }
    function closeChangelogModal() {
      document.getElementById('modalChangelog').classList.remove('active');
    }

    // =========================================================================
    // PILAR 15: GESTÃO DE CICLOS LETIVOS E ANOS PLURIANUAIS (SSOT)
    // =========================================================================
    let activeModalBimesterConfigYear = '2026';

    function openSelectAcademicYearModal() {
      renderAcademicYearBoxes();
      const m = document.getElementById('modalSelectAcademicYear');
      if (m) m.classList.add('active');
    }

    function closeSelectAcademicYearModal() {
      const m = document.getElementById('modalSelectAcademicYear');
      if (m) m.classList.remove('active');
    }

    function renderAcademicYearBoxes() {
      const container = document.getElementById('academicYearBoxesContainer');
      if (!container) return;

      const defaultYears = (typeof DEFAULT_ACADEMIC_YEARS !== 'undefined' && Array.isArray(DEFAULT_ACADEMIC_YEARS)) ? DEFAULT_ACADEMIC_YEARS : ['2026', '2025'];
      const defaultSelected = (typeof DEFAULT_SELECTED_ACADEMIC_YEAR !== 'undefined') ? DEFAULT_SELECTED_ACADEMIC_YEAR : '2026';

      if (!appState.academicYears || !Array.isArray(appState.academicYears) || appState.academicYears.length === 0) {
        appState.academicYears = [...defaultYears];
      }
      if (!appState.selectedAcademicYear) {
        appState.selectedAcademicYear = defaultSelected;
      }

      const sortedYears = [...appState.academicYears].sort((a, b) => b.localeCompare(a));
      const latestYear = sortedYears[0];
      const currentSelected = appState.selectedAcademicYear || latestYear;

      container.innerHTML = sortedYears.map(y => {
        const isSelected = (y === currentSelected);
        const isVigente = (y === latestYear);
        const tagBadge = isVigente
          ? '<span style="background:#DCFCE7; color:#15803D; font-size:10px; font-weight:800; padding:2px 8px; border-radius:12px; text-transform:uppercase;">Vigente</span>'
          : '<span style="background:#FEF3C7; color:#B45309; font-size:10px; font-weight:800; padding:2px 8px; border-radius:12px; text-transform:uppercase;">Histórico</span>';
        const descText = isVigente
          ? 'Ano letivo em andamento. Lançamentos, acompanhamentos e observações regulares.'
          : 'Modo de consulta histórica dos registros e indicadores consolidados deste período.';

        return `
          <div class="level-box ${isSelected ? 'selected' : ''}" onclick="selectAcademicYear('${y}')" style="cursor:pointer;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <div class="level-box-title" style="display:flex; align-items:center; gap:8px;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <span>Ano Letivo ${y}</span>
              </div>
              ${tagBadge}
            </div>
            <div class="level-box-desc">${descText}</div>
          </div>
        `;
      }).join('');
    }

    function selectAcademicYear(year) {
      closeSelectAcademicYearModal();
      onGlobalAcademicYearChange(year);
    }

    function renderGlobalAcademicYearSelector() {
      try {
        const defaultYears = (typeof DEFAULT_ACADEMIC_YEARS !== 'undefined' && Array.isArray(DEFAULT_ACADEMIC_YEARS)) ? DEFAULT_ACADEMIC_YEARS : ['2026', '2025'];
        const defaultSelected = (typeof DEFAULT_SELECTED_ACADEMIC_YEAR !== 'undefined') ? DEFAULT_SELECTED_ACADEMIC_YEAR : '2026';

        if (!appState.academicYears || !Array.isArray(appState.academicYears) || appState.academicYears.length === 0) {
          appState.academicYears = [...defaultYears];
        }
        if (!appState.selectedAcademicYear) {
          appState.selectedAcademicYear = defaultSelected;
        }

        const sortedYears = [...appState.academicYears].sort((a, b) => b.localeCompare(a));
        const latestYear = sortedYears[0];

        // Atualiza rótulo no botão do modal de perfil se presente
        const profileLabel = document.getElementById('userProfileAcademicYearLabel');
        if (profileLabel) {
          profileLabel.innerText = appState.selectedAcademicYear;
        }

        // Suporte defensivo caso o select ainda exista em algum contexto
        const select = document.getElementById('headerAcademicYearSelect');
        if (select) {
          select.innerHTML = sortedYears.map(y => `<option value="${y}" ${y === appState.selectedAcademicYear ? 'selected' : ''}>Ano ${y}</option>`).join('');
        }

        // Se o modal de seleção estiver aberto, sincroniza seus cards
        const modalSel = document.getElementById('modalSelectAcademicYear');
        if (modalSel && modalSel.classList.contains('active')) {
          renderAcademicYearBoxes();
        }

        // Banner informativo se estiver visualizando ano anterior ao mais recente
        const banner = document.getElementById('historicalYearWarningBanner');
        const bannerLabel = document.getElementById('historicalYearBannerLabel');
        if (banner) {
          if (appState.selectedAcademicYear !== latestYear) {
            banner.style.display = 'flex';
            if (bannerLabel) bannerLabel.innerText = appState.selectedAcademicYear;
          } else {
            banner.style.display = 'none';
          }
        }
      } catch (errSel) {
        console.warn('Falha defensiva ao renderizar renderGlobalAcademicYearSelector:', errSel);
      }
    }

    function onGlobalAcademicYearChange(selectedYear) {
      if (!selectedYear) return;
      appState.selectedAcademicYear = selectedYear;
      saveState();
      renderGlobalAcademicYearSelector();

      // Recarrega telas ativas de acordo com a aba visível
      const screenInd = document.getElementById('screenIndicators');
      if (screenInd && screenInd.classList.contains('active')) {
        renderIndicatorsScreen();
      }
      const screenHome = document.getElementById('screenHome');
      if (screenHome && screenHome.classList.contains('active')) {
        renderHomeScreen();
      }
      const screenHist = document.getElementById('screenHistory');
      if (screenHist && screenHist.classList.contains('active')) {
        renderHistoryScreen();
      }

      showToast(`Contexto alterado para o Ano Letivo ${selectedYear}`);
    }

    function returnToCurrentAcademicYear() {
      const sortedYears = [...(appState.academicYears || ['2026'])].sort((a, b) => b.localeCompare(a));
      const latestYear = sortedYears[0] || '2026';
      onGlobalAcademicYearChange(latestYear);
    }

    // Modal Bimester Periods (SSOT) Controls
    function openBimesterPeriodsModal() {
      const user = getCurrentUser();
      if (!isNucleoEI(user)) {
        showToast('Acesso restrito à Coordenadora do Núcleo de EI.');
        return;
      }

      activeModalBimesterConfigYear = appState.selectedAcademicYear || '2026';

      // Popula select de anos no modal
      const modalYearSelect = document.getElementById('modalBimesterPeriodYearSelect');
      if (modalYearSelect) {
        const sortedYears = [...(appState.academicYears || ['2026'])].sort((a, b) => b.localeCompare(a));
        modalYearSelect.innerHTML = sortedYears.map(y => `<option value="${y}" ${y === activeModalBimesterConfigYear ? 'selected' : ''}>Ano Letivo ${y}</option>`).join('');
      }

      loadBimesterPeriodsForModalYear(activeModalBimesterConfigYear);

      const modal = document.getElementById('modalBimesterPeriods');
      if (modal) {
        modal.classList.add('active');
        modal.classList.add('show');
      }
    }

    function onModalBimesterYearChange(newYear) {
      activeModalBimesterConfigYear = newYear;
      loadBimesterPeriodsForModalYear(newYear);
    }

    function loadBimesterPeriodsForModalYear(year) {
      let yearPeriods = null;
      if (appState && appState.bimesterPeriods && appState.bimesterPeriods[year]) {
        yearPeriods = appState.bimesterPeriods[year];
      } else if (appState && appState.bimesterPeriods && appState.bimesterPeriods['1º Bimestre']) {
        yearPeriods = appState.bimesterPeriods;
      }
      const periods = yearPeriods || (DEFAULT_BIMESTER_PERIODS_BY_YEAR[year] || DEFAULT_BIMESTER_PERIODS_BY_YEAR['2026']);

      const bimMap = {
        1: '1º Bimestre',
        2: '2º Bimestre',
        3: '3º Bimestre',
        4: '4º Bimestre'
      };

      for (let i = 1; i <= 4; i++) {
        const bName = bimMap[i];
        const p = periods[bName] || DEFAULT_BIMESTER_PERIODS_BY_YEAR['2026'][bName];
        const startInput = document.getElementById(`bimPeriodStart_${i}`);
        const endInput = document.getElementById(`bimPeriodEnd_${i}`);
        if (startInput) startInput.value = (p && p.startDate) ? p.startDate : '';
        if (endInput) endInput.value = (p && p.endDate) ? p.endDate : '';
      }
    }

    function closeBimesterPeriodsModal() {
      const modal = document.getElementById('modalBimesterPeriods');
      if (modal) {
        modal.classList.remove('active');
        modal.classList.remove('show');
      }
    }

    function saveBimesterPeriodsSettings() {
      const user = getCurrentUser();
      if (!isNucleoEI(user)) {
        showToast('Acesso restrito à Coordenadora do Núcleo de EI.');
        return;
      }

      const bimMap = {
        1: '1º Bimestre',
        2: '2º Bimestre',
        3: '3º Bimestre',
        4: '4º Bimestre'
      };

      const newPeriods = {};

      for (let i = 1; i <= 4; i++) {
        const bName = bimMap[i];
        const startInput = document.getElementById(`bimPeriodStart_${i}`);
        const endInput = document.getElementById(`bimPeriodEnd_${i}`);
        const startVal = startInput ? startInput.value : '';
        const endVal = endInput ? endInput.value : '';

        if (!startVal || !endVal) {
          alert(`Por favor, preencha as datas de início e fim do ${bName}.`);
          return;
        }

        if (startVal > endVal) {
          alert(`A data inicial do ${bName} não pode ser posterior à data final.`);
          return;
        }

        newPeriods[bName] = {
          startDate: startVal,
          endDate: endVal,
          label: bName
        };
      }

      if (!appState.bimesterPeriods) appState.bimesterPeriods = {};
      appState.bimesterPeriods[activeModalBimesterConfigYear] = newPeriods;
      saveState();
      closeBimesterPeriodsModal();
      showToast(`Períodos dos ciclos avaliativos do ano ${activeModalBimesterConfigYear} atualizados com sucesso na SSOT!`);

      const screenInd = document.getElementById('screenIndicators');
      if (screenInd && screenInd.classList.contains('active')) {
        renderIndicatorsScreen();
      }
    }

    function restoreDefaultBimesterPeriodsPrompt() {
      if (!confirm(`Deseja restaurar os períodos oficiais padrão do município para os 4 bimestres do ano ${activeModalBimesterConfigYear}?`)) {
        return;
      }
      const defaultForYear = DEFAULT_BIMESTER_PERIODS_BY_YEAR[activeModalBimesterConfigYear] || DEFAULT_BIMESTER_PERIODS_BY_YEAR['2026'];
      if (!appState.bimesterPeriods) appState.bimesterPeriods = {};
      appState.bimesterPeriods[activeModalBimesterConfigYear] = JSON.parse(JSON.stringify(defaultForYear));
      saveState();
      loadBimesterPeriodsForModalYear(activeModalBimesterConfigYear);
      showToast(`Padrões municipais para o ano ${activeModalBimesterConfigYear} restaurados com sucesso na SSOT!`);
      const screenInd = document.getElementById('screenIndicators');
      if (screenInd && screenInd.classList.contains('active')) {
        renderIndicatorsScreen();
      }
    }

    // Modal Create New Academic Year Controls
    function openCreateNewAcademicYearModal() {
      const user = getCurrentUser();
      if (!isNucleoEI(user)) {
        showToast('Apenas a Coordenadora do Núcleo de EI pode iniciar um novo ciclo avaliativo.');
        return;
      }

      const currentRealYear = new Date().getFullYear();
      const inputYear = document.getElementById('inputNewAcademicYear');
      const blockNotice = document.getElementById('futureYearBlockNotice');
      const confirmBtn = document.getElementById('btnConfirmCreateAcademicYear');
      const sortedYears = [...(appState.academicYears || ['2026'])].map(y => parseInt(y, 10)).sort((a, b) => b - a);
      const nextSuggested = (sortedYears[0] || currentRealYear) + 1;

      if (inputYear) {
        inputYear.max = currentRealYear;
      }

      if (nextSuggested > currentRealYear) {
        // Próximo ano ainda não iniciou efetivamente
        if (inputYear) {
          inputYear.value = nextSuggested;
          inputYear.disabled = true;
        }
        if (blockNotice) {
          blockNotice.style.display = 'block';
          blockNotice.innerHTML = `
            <div style="font-size:12px; font-weight:700; color:#991B1B; margin-bottom:4px;">🛡️ Bloqueio de Conformidade Temporal:</div>
            <div style="font-size:11px; color:#B91C1C; line-height:1.4;">
              O ciclo do Ano Letivo <strong>${sortedYears[0] || currentRealYear}</strong> está vigente em andamento. O ciclo de <strong>${nextSuggested}</strong> só poderá ser iniciado quando o respectivo ano civil iniciar efetivamente (a partir de <strong>01/01/${nextSuggested}</strong>). Não é permitido iniciar ou planejar ciclos de anos futuros antecipadamente.
            </div>
          `;
        }
        if (confirmBtn) {
          confirmBtn.disabled = true;
          confirmBtn.style.opacity = '0.5';
          confirmBtn.style.cursor = 'not-allowed';
          confirmBtn.title = `O ano ${nextSuggested} só poderá ser iniciado em ${nextSuggested}.`;
        }
      } else {
        if (inputYear) {
          inputYear.value = nextSuggested;
          inputYear.disabled = false;
        }
        if (blockNotice) {
          blockNotice.style.display = 'none';
        }
        if (confirmBtn) {
          confirmBtn.disabled = false;
          confirmBtn.style.opacity = '1';
          confirmBtn.style.cursor = 'pointer';
          confirmBtn.title = '';
        }
      }

      const modal = document.getElementById('modalCreateAcademicYear');
      if (modal) {
        modal.classList.add('active');
        modal.classList.add('show');
      }
    }

    function closeCreateNewAcademicYearModal() {
      const modal = document.getElementById('modalCreateAcademicYear');
      if (modal) {
        modal.classList.remove('active');
        modal.classList.remove('show');
      }
    }

    function confirmCreateNewAcademicYear() {
      const user = getCurrentUser();
      if (!isNucleoEI(user)) {
        showToast('Acesso negado.');
        return;
      }

      const inputYear = document.getElementById('inputNewAcademicYear');
      const yearVal = inputYear ? inputYear.value.trim() : '';

      if (!yearVal || !/^\d{4}$/.test(yearVal)) {
        alert('Por favor, informe um ano letivo válido com 4 dígitos (ex: 2026).');
        return;
      }

      const currentRealYear = new Date().getFullYear();
      const targetYearNum = parseInt(yearVal, 10);

      // Trava Impeditiva SSOT: Não permitir iniciar anos que não iniciaram efetivamente
      if (targetYearNum > currentRealYear) {
        alert(`Não é permitido iniciar o Ano Letivo ${targetYearNum}, pois ele ainda não iniciou efetivamente. O ciclo só poderá ser iniciado a partir de 01/01/${targetYearNum}.`);
        return;
      }

      if (appState.academicYears.includes(yearVal)) {
        alert(`O Ano Letivo ${yearVal} já está cadastrado no sistema.`);
        return;
      }

      const optionEl = document.querySelector('input[name="newYearClassesOption"]:checked');
      const option = optionEl ? optionEl.value : 'clone';

      // 1. Cadastra o novo ano na lista SSOT
      appState.academicYears.push(yearVal);
      appState.academicYears.sort();

      // 2. Inicializa os 4 bimestres do novo ano baseando-se no ano base
      const templatePeriods = DEFAULT_BIMESTER_PERIODS_BY_YEAR['2026'] || DEFAULT_BIMESTER_PERIODS;
      const newYearPeriods = {};
      const yearDiff = targetYearNum - 2026;
      ['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre'].forEach(bName => {
        const tmpl = templatePeriods[bName] || DEFAULT_BIMESTER_PERIODS[bName];
        const adjustDate = (isoStr) => {
          if (!isoStr) return '';
          const parts = isoStr.split('-');
          const y = parseInt(parts[0], 10) + yearDiff;
          return `${y}-${parts[1]}-${parts[2]}`;
        };
        newYearPeriods[bName] = {
          startDate: adjustDate(tmpl.startDate),
          endDate: adjustDate(tmpl.endDate),
          label: bName
        };
      });

      if (!appState.bimesterPeriods) appState.bimesterPeriods = {};
      appState.bimesterPeriods[yearVal] = newYearPeriods;

      // 3. Matriz de turmas
      if (option === 'clone') {
        const sortedYears = [...appState.academicYears].filter(y => y !== yearVal).sort((a, b) => b.localeCompare(a));
        const prevYear = sortedYears[0] || '2026';
        const prevClasses = (appState.classes || []).filter(c => (c.academicYear || '2026') === prevYear);

        prevClasses.forEach((prevC, idx) => {
          const clonedClass = {
            id: 'cls-' + yearVal + '-' + Date.now() + '-' + idx,
            name: prevC.name,
            school: prevC.school,
            academicYear: yearVal,
            stage: prevC.stage,
            shift: prevC.shift,
            teachers: [...(prevC.teachers || [])],
            teachersMorning: [...(prevC.teachersMorning || [])],
            teachersAfternoon: [...(prevC.teachersAfternoon || [])]
          };
          appState.classes.push(clonedClass);
        });
      }

      // 4. Define o novo ano como ativo
      appState.selectedAcademicYear = yearVal;
      saveState();

      closeCreateNewAcademicYearModal();
      renderGlobalAcademicYearSelector();

      // Se o modal de bimestres estava aberto ou for necessário atualizar telas:
      const modalBim = document.getElementById('modalBimesterPeriods');
      if (modalBim && modalBim.classList.contains('active')) {
        openBimesterPeriodsModal();
      }

      showToast(`Novo Ciclo Avaliativo (${yearVal}) iniciado com sucesso! Todas as UEs e Servidores foram mantidos.`);
      renderHomeScreen();
    }

    // Modal Reference Docs Controls
    function openRefDocsModal() {
      navigateToTab('refDocs');
    }
    function closeRefDocsModal() {
      const modal = document.getElementById('modalRefDocs');
      if (modal) modal.classList.remove('active');
    }

    // Sincronização reativa e imediata de dados da SSOT entre abas abertas no navegador
    window.addEventListener('storage', (e) => {
      if (e.key === 'SERTAO_CRIANCA_APP_STATE_V6') {
        try {
          const updated = JSON.parse(e.newValue);
          if (updated && updated.bimesterPeriods) {
            appState.bimesterPeriods = updated.bimesterPeriods;
            const screenInd = document.getElementById('screenIndicators');
            if (screenInd && screenInd.classList.contains('active')) {
              renderIndicatorsScreen();
            }
          }
        } catch (err) {
          console.warn('Sincronização SSOT inter-abas ignorada:', err);
        }
      }
    });

    // App Initialization (Universal Multi-State Lifecycle Guard)
    function initializeAppLifecycle() {
      try {
        loadState();
        renderHomeScreen();
      } catch (errInit) {
        console.error('Falha na inicialização do ciclo de vida da aplicação:', errInit);
        navigateToTab('home');
      }

      ['indicatorsTargetTypeFilter', 'indicatorsUnitFilter', 'indicatorsMemberFilter'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.addEventListener('change', syncIndicatorsFilterUI);
          el.addEventListener('input', syncIndicatorsFilterUI);
        }
      });
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      initializeAppLifecycle();
    } else {
      document.addEventListener('DOMContentLoaded', initializeAppLifecycle);
      window.addEventListener('load', initializeAppLifecycle);
    }

    // ================= MOBILE MENU FUNCTIONS =================
    function openMobileMenu() {
      document.getElementById('mobileMenuOverlay').style.display = 'flex';
      // Ativa visualmente o botão de menu
      document.querySelectorAll('.tabbar-item').forEach(el => el.classList.remove('active'));
      document.getElementById('mobTabMenu').classList.add('active');
    }

    function closeMobileMenu() {
      document.getElementById('mobileMenuOverlay').style.display = 'none';
    }

    function navigateToFromMenu(tabName) {
      closeMobileMenu();
      navigateToTab(tabName);
      
      // Quando estamos em uma sub-rota (Histórico/Notas/Matrizes), destacamos o "Mais"
      document.querySelectorAll('.tabbar-item, .nav-link').forEach(el => el.classList.remove('active'));
      if(document.getElementById('mobTabMenu')) {
        document.getElementById('mobTabMenu').classList.add('active');
      }
    }

    // =========================================================================
