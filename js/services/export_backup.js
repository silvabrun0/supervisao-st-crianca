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
      const user = getCurrentUser();
      if (!isNucleoEI(user)) {
        showToast('Acesso exclusivo à Coordenadora do Núcleo de EI.');
        return;
      }
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
      const user = getCurrentUser();
      if (!isNucleoEI(user)) {
        showToast('Acesso exclusivo à Coordenadora do Núcleo de EI.');
        return;
      }
      const input = document.getElementById('importFullBaseFileInput');
      if (input) input.click();
    }

    function importFullBaseJSON(event) {
      const user = getCurrentUser();
      if (!isNucleoEI(user)) {
        showToast('Acesso exclusivo à Coordenadora do Núcleo de EI.');
        if (event && event.target) event.target.value = '';
        return;
      }
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
      const currentRealYear = new Date().getFullYear();
      const validYears = (appState.academicYears || ['2026'])
        .map(y => parseInt(y, 10))
        .filter(y => !isNaN(y) && y <= currentRealYear)
        .sort((a, b) => b - a);

      const targetYear = (validYears[0] || 2026).toString();
      onGlobalAcademicYearChange(targetYear);
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
            stage: normalizeStageName(prevC.stage),
            multiStages: Array.isArray(prevC.multiStages) ? [...prevC.multiStages] : [],
            shift: prevC.shift,
            teachers: [...(prevC.teachers || [])],
            teachersMorning: [...(prevC.teachersMorning || [])],
            teachersAfternoon: [...(prevC.teachersAfternoon || [])],
            totalStudents: prevC.totalStudents,
            inclusiveStudents: prevC.inclusiveStudents
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
    // PILAR 19: ARQUITETURA DE CARGA EM MASSA VIA PLANILHA GERAL SSOT
    // =========================================================================

    // Cabeçalho Oficial Canônico da Planilha Geral Unificada (18 Colunas)
    const GENERAL_NETWORK_CSV_HEADERS = [
      "Polo_Regional",
      "Unidade_Escolar",
      "Endereco_Unidade",
      "Formadora_Responsavel",
      "Email_Formadora",
      "Coordenadora_Pedagogica",
      "Email_Coordenadora",
      "Nome_Turma",
      "Etapa_Faixa_Etaria",
      "Faixas_Multietapa",
      "Jornada_Escolar",
      "Turno",
      "Total_Alunos",
      "Alunos_AEE_Inclusao",
      "Docente_1_Nome",
      "Docente_1_Email",
      "Docente_2_Nome",
      "Docente_2_Email"
    ];

    // Download do Modelo Padronizado da Rede (.CSV compatível com Excel e UTF-8 com BOM)
    function downloadGeneralNetworkTemplateCSV() {
      const user = getCurrentUser();
      if (!isNucleoEI(user)) {
        showToast('Acesso restrito ao Núcleo de Educação Infantil.');
        return;
      }

      const sampleRows = [
        [
          "Polo Regional 1 (Norte)",
          "CEI Professora Maria de Lourdes",
          "Bairro Alto das Flores, Rua das Acácias, 120",
          "Clarice Barbosa",
          "clarice.barbosa@patos.pb.gov.br",
          "Mariana Ferreira",
          "mariana.ferreira@patos.pb.gov.br",
          "Infantil I - Turma A",
          "4 anos a 4 anos e 11 meses (Pré-escola 1)",
          "",
          "Tempo Parcial",
          "Matutino",
          "22",
          "1",
          "Ana Carolina Silva",
          "ana.silva@patos.pb.gov.br",
          "",
          ""
        ],
        [
          "Polo Regional 1 (Norte)",
          "CEI Professora Maria de Lourdes",
          "Bairro Alto das Flores, Rua das Acácias, 120",
          "Clarice Barbosa",
          "clarice.barbosa@patos.pb.gov.br",
          "Mariana Ferreira",
          "mariana.ferreira@patos.pb.gov.br",
          "Berçário II - Turma Única",
          "1 ano a 1 ano e 11 meses (Creche II)",
          "",
          "Tempo Parcial",
          "Matutino",
          "18",
          "0",
          "Carla Beatriz Mendes",
          "carla.mendes@patos.pb.gov.br",
          "",
          ""
        ],
        [
          "Polo Regional 1 (Norte)",
          "CEI Professora Maria de Lourdes",
          "Bairro Alto das Flores, Rua das Acácias, 120",
          "Clarice Barbosa",
          "clarice.barbosa@patos.pb.gov.br",
          "Mariana Ferreira",
          "mariana.ferreira@patos.pb.gov.br",
          "Maternal II - Turma Integral",
          "3 anos a 3 anos e 11 meses (Creche IV / Pré-escola Inicial)",
          "",
          "Tempo Integral",
          "Manhã + Tarde",
          "25",
          "2",
          "Mariana Santos",
          "mariana.santos@patos.pb.gov.br",
          "Roberta Dias",
          "roberta.dias@patos.pb.gov.br"
        ],
        [
          "Polo Regional 1 (Norte)",
          "EMEI Pequeno Príncipe",
          "Vila Esperança, Rua Projetada B",
          "Clarice Barbosa",
          "clarice.barbosa@patos.pb.gov.br",
          "Sônia Regina Alcantara",
          "sonia.alcantara@patos.pb.gov.br",
          "Maternal I - Turma A",
          "2 anos a 2 anos e 11 meses (Creche III)",
          "",
          "Tempo Parcial",
          "Matutino",
          "20",
          "1",
          "Fernanda Lima",
          "fernanda.lima@patos.pb.gov.br",
          "",
          ""
        ],
        [
          "Polo Regional 2 (Sul)",
          "CEI Vovó Zezé",
          "Jardim do Sertão, Travessa das Flores, 45",
          "Clarice Barbosa",
          "clarice.barbosa@patos.pb.gov.br",
          "Helena Martins",
          "helena.martins@patos.pb.gov.br",
          "Turma Multietapa - Campo",
          "Turma Multietapa (Multiada)",
          "3 anos a 3 anos e 11 meses | 4 anos a 4 anos e 11 meses",
          "Tempo Parcial",
          "Matutino",
          "16",
          "2",
          "Luciana Ramos",
          "luciana.ramos@patos.pb.gov.br",
          "",
          ""
        ]
      ];

      // Geração de CSV com delimitação por ponto e vírgula e aspas seguras para Excel brasileiro
      const csvLines = [
        GENERAL_NETWORK_CSV_HEADERS.join(';'),
        ...sampleRows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(';'))
      ];

      const csvContent = "\uFEFF" + csvLines.join('\r\n');
      downloadFile(csvContent, 'modelo_geral_rede_sertao_crianca.csv', 'text/csv;charset=utf-8;');
      showToast('Planilha modelo geral da rede (SSOT) baixada com sucesso!');
    }

    // Exportação da Malha Atual Completa em Planilha Geral Tabular (.CSV)
    function exportGeneralNetworkCSV() {
      const user = getCurrentUser();
      if (!isNucleoEI(user)) {
        showToast('Acesso restrito ao Núcleo de Educação Infantil.');
        return;
      }

      const rows = [];
      const units = appState.units || [];
      const allClasses = appState.classes || [];
      const members = appState.teamMembers || [];

      // Itera por todas as unidades para garantir cobertura completa mesmo se houver UE sem turmas cadastradas
      units.forEach(u => {
        const uClasses = allClasses.filter(c => c.school === u.name && !((appState.deletedClassIds || []).includes(c.id)));
        const poloName = u.polo || 'Polo Regional 1 (Norte)';
        
        // Formadora do Polo
        const formadora = members.find(m => m.roleKey === 'formador' && (m.school === poloName || m.school === u.name));
        const formadoraName = formadora ? formadora.name : '';
        const formadoraEmail = formadora ? (formadora.email || '') : '';

        // Coordenadora da UE
        const coord = members.find(m => m.roleKey === 'coordenador' && m.school === u.name);
        const coordName = coord ? coord.name : '';
        const coordEmail = coord ? (coord.email || '') : '';

        if (uClasses.length === 0) {
          // Linha sentinela da UE sem turma ainda
          rows.push([
            poloName,
            u.name,
            u.address || '',
            formadoraName,
            formadoraEmail,
            coordName,
            coordEmail,
            "", "", "", "Tempo Parcial", "Matutino", "0", "0", "", "", "", ""
          ]);
        } else {
          uClasses.forEach(c => {
            const isIntegral = (c.shift || '').toLowerCase().includes('integral');
            const jornada = isIntegral ? 'Tempo Integral' : 'Tempo Parcial';
            const turno = c.shift || (isIntegral ? 'Manhã + Tarde' : 'Matutino');
            const totAlunos = typeof c.totalStudents === 'number' ? c.totalStudents : 20;
            const aeeAlunos = typeof c.inclusiveStudents === 'number' ? c.inclusiveStudents : 0;
            
            // Docentes
            const teachers = Array.isArray(c.teachers) ? c.teachers : [];
            const doc1Name = teachers[0] || '';
            const doc2Name = teachers[1] || '';
            const doc1 = members.find(m => m.name === doc1Name && m.school === u.name);
            const doc2 = members.find(m => m.name === doc2Name && m.school === u.name);
            const doc1Email = doc1 ? (doc1.email || '') : '';
            const doc2Email = doc2 ? (doc2.email || '') : '';

            const multiStagesStr = Array.isArray(c.multiStages) ? c.multiStages.join(' | ') : '';

            rows.push([
              poloName,
              u.name,
              u.address || '',
              formadoraName,
              formadoraEmail,
              coordName,
              coordEmail,
              c.name,
              c.stage || 'Infantil I',
              multiStagesStr,
              jornada,
              turno,
              String(totAlunos),
              String(aeeAlunos),
              doc1Name,
              doc1Email,
              doc2Name,
              doc2Email
            ]);
          });
        }
      });

      const csvLines = [
        GENERAL_NETWORK_CSV_HEADERS.join(';'),
        ...rows.map(row => row.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(';'))
      ];

      const csvContent = "\uFEFF" + csvLines.join('\r\n');
      downloadFile(csvContent, 'sertao_crianca_rede_unificada_completa.csv', 'text/csv;charset=utf-8;');
      showToast('Rede municipal completa exportada com sucesso (CSV)!');
    }

    // Disparador de Seleção do Arquivo de Carga Geral
    function triggerGeneralNetworkImport() {
      const user = getCurrentUser();
      if (!isNucleoEI(user)) {
        showToast('Acesso restrito ao Núcleo de Educação Infantil.');
        return;
      }
      const inp = document.getElementById('generalNetworkCsvFileInput');
      if (inp) inp.click();
    }

    // Processamento e Parser da Planilha Geral Unificada (Carga SSOT)
    function handleGeneralNetworkCsvUpload(e) {
      const file = e.target.files[0];
      if (!file) return;

      const user = getCurrentUser();
      if (!isNucleoEI(user)) {
        showToast('Apenas a Coordenação do Núcleo de EI pode efetuar carga da planilha geral.');
        e.target.value = '';
        return;
      }

      if (!confirm(`ATENÇÃO - CARGA EM MASSA DA REDE (SSOT):\n\nA importação do arquivo "${file.name}" consolidará Polos, Unidades Escolares, Coordenadoras, Formadoras, Turmas e Docentes da rede.\n\nRegistros existentes serão enriquecidos e novas entidades serão cadastradas atomicamente. Deseja prosseguir com a carga?`)) {
        e.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = function(evt) {
        try {
          const text = evt.target.result;
          const stats = parseAndApplyGeneralNetworkCSV(text);
          saveState();

          // Sincroniza e re-renderiza todas as telas afetadas
          if (typeof syncUnitCharacterizationFromClasses === 'function') {
            syncUnitCharacterizationFromClasses();
          }
          if (typeof renderUnitsScreen === 'function') renderUnitsScreen();
          if (typeof renderClassesScreen === 'function') renderClassesScreen();
          if (typeof renderTeamScreen === 'function') renderTeamScreen();
          if (typeof renderIndicatorsScreen === 'function') renderIndicatorsScreen();
          if (typeof renderHomeScreen === 'function') renderHomeScreen();

          showToast(`Carga concluída com sucesso! ${stats.unitsCount} UEs, ${stats.classesCount} turmas e ${stats.teachersCount} docentes processados.`);
        } catch (err) {
          console.error('Falha na importação da Planilha Geral SSOT:', err);
          alert('Erro ao processar a planilha geral: ' + err.message);
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    }

    // Motor de Parser e Resolução Relacional da Planilha Geral
    function parseAndApplyGeneralNetworkCSV(csvText) {
      if (!csvText || !csvText.trim()) {
        throw new Error('O arquivo CSV selecionado está vazio.');
      }

      const rawLines = csvText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
      if (rawLines.length < 2) {
        throw new Error('A planilha deve conter o cabeçalho e pelo menos uma linha de dados.');
      }

      const firstLine = rawLines[0];
      const delimiter = (firstLine.indexOf(';') !== -1 && firstLine.split(';').length >= firstLine.split(',').length) ? ';' : ',';
      
      const headerCols = (typeof parseCsvLineCustom === 'function' ? parseCsvLineCustom(firstLine, delimiter) : firstLine.split(delimiter)).map(h => 
        h.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '')
      );

      // Índices dinâmicos por similaridade léxica
      const findIdx = (candidates) => headerCols.findIndex(h => candidates.some(c => h.includes(c)));
      
      const idxPolo = findIdx(['poloregional', 'polo', 'regiao']);
      const idxUE = findIdx(['unidadeescolar', 'unidade', 'escola', 'ue']);
      const idxEnd = findIdx(['enderecounidade', 'endereco', 'bairro']);
      const idxForm = findIdx(['formadoraresponsavel', 'formadora', 'supervisora']);
      const idxFormEmail = findIdx(['emailformadora']);
      const idxCoord = findIdx(['coordenadorapedagogica', 'coordenadora', 'coordenador', 'cp']);
      const idxCoordEmail = findIdx(['emailcoordenadora']);
      const idxTurma = findIdx(['nometurma', 'turma', 'sala']);
      const idxEtapa = findIdx(['etapafaixaetaria', 'etapa', 'faixaetaria', 'faixa']);
      const idxMulti = findIdx(['faixasmultietapa', 'multietapa']);
      const idxJornada = findIdx(['jornadaescolar', 'jornada']);
      const idxTurno = findIdx(['turno']);
      const idxTotAlunos = findIdx(['totalalunos', 'totalmatriculados', 'alunos']);
      const idxAeeAlunos = findIdx(['alunosaeeinclusao', 'alunosaee', 'aee', 'inclusao', 'necessidadesespeciais']);
      const idxDoc1Nome = findIdx(['docente1nome', 'docente1', 'professora1', 'professor1', 'docente']);
      const idxDoc1Email = findIdx(['docente1email']);
      const idxDoc2Nome = findIdx(['docente2nome', 'docente2', 'professora2', 'professor2']);
      const idxDoc2Email = findIdx(['docente2email']);

      if (idxUE === -1) {
        throw new Error('Coluna de Unidade Escolar obrigatória não identificada no cabeçalho.');
      }

      // Inicialização defensiva das coleções de estado
      if (!Array.isArray(appState.units)) appState.units = [];
      if (!Array.isArray(appState.classes)) appState.classes = [];
      if (!Array.isArray(appState.teamMembers)) appState.teamMembers = [];
      if (!Array.isArray(appState.polos)) appState.polos = [];
      if (!appState.customUsers) appState.customUsers = {};

      let unitsCount = 0;
      let classesCount = 0;
      let teachersCount = 0;
      const seenUnits = new Set();
      const seenClasses = new Set();

      for (let i = 1; i < rawLines.length; i++) {
        const parts = typeof parseCsvLineCustom === 'function' ? parseCsvLineCustom(rawLines[i], delimiter) : rawLines[i].split(delimiter);
        if (parts.length === 0 || !parts[idxUE]) continue;

        const ueName = (parts[idxUE] || '').trim();
        if (!ueName) continue;

        const poloName = (idxPolo !== -1 && parts[idxPolo]) ? parts[idxPolo].trim() : 'Polo Regional 1 (Norte)';
        const address = (idxEnd !== -1 && parts[idxEnd]) ? parts[idxEnd].trim() : '';
        const formadoraName = (idxForm !== -1 && parts[idxForm]) ? parts[idxForm].trim() : '';
        const formadoraEmail = (idxFormEmail !== -1 && parts[idxFormEmail]) ? parts[idxFormEmail].trim() : '';
        const coordName = (idxCoord !== -1 && parts[idxCoord]) ? parts[idxCoord].trim() : '';
        const coordEmail = (idxCoordEmail !== -1 && parts[idxCoordEmail]) ? parts[idxCoordEmail].trim() : '';

        // 1. Polo Regional
        let poloObj = appState.polos.find(p => p.name.toLowerCase() === poloName.toLowerCase());
        if (!poloObj && poloName) {
          poloObj = {
            id: 'polo-auto-' + Date.now() + '-' + i,
            name: poloName,
            region: poloName
          };
          appState.polos.push(poloObj);
        }

        // 2. Unidade Escolar (UE)
        let ueObj = appState.units.find(u => u.name.toLowerCase() === ueName.toLowerCase());
        if (!ueObj) {
          ueObj = {
            id: 'ue-auto-' + Date.now() + '-' + i,
            name: ueName,
            polo: poloName,
            address: address || 'Endereço não informado',
            totalStudents: 0,
            inclusiveStudents: 0,
            totalClasses: 0
          };
          appState.units.push(ueObj);
          unitsCount++;
        } else {
          if (poloName) ueObj.polo = poloName;
          if (address) ueObj.address = address;
        }
        seenUnits.add(ueName);

        // 3. Formadora Pedagógica
        if (formadoraName) {
          let formMember = appState.teamMembers.find(m => m.name.toLowerCase() === formadoraName.toLowerCase() && m.roleKey === 'formador');
          if (!formMember) {
            formMember = {
              id: 'usr-form-' + Date.now() + '-' + i,
              name: formadoraName,
              roleKey: 'formador',
              roleTitle: 'Formadora Pedagógica',
              school: poloName,
              supervisor: 'Helena Martins',
              email: formadoraEmail || `${formadoraName.toLowerCase().replace(/\s+/g, '.')}@patos.pb.gov.br`
            };
            appState.teamMembers.push(formMember);
          } else {
            if (formadoraEmail) formMember.email = formadoraEmail;
            formMember.school = poloName;
          }
          if (typeof syncUserToAuthDb === 'function') syncUserToAuthDb(formMember);
        }

        // 4. Coordenadora Pedagógica
        if (coordName) {
          let coordMember = appState.teamMembers.find(m => m.name.toLowerCase() === coordName.toLowerCase() && m.roleKey === 'coordenador');
          if (!coordMember) {
            coordMember = {
              id: 'usr-coord-' + Date.now() + '-' + i,
              name: coordName,
              roleKey: 'coordenador',
              roleTitle: 'Coordenadora Pedagógica',
              school: ueName,
              supervisor: formadoraName || 'Clarice Barbosa',
              email: coordEmail || `${coordName.toLowerCase().replace(/\s+/g, '.')}@patos.pb.gov.br`
            };
            appState.teamMembers.push(coordMember);
          } else {
            coordMember.school = ueName;
            if (formadoraName) coordMember.supervisor = formadoraName;
            if (coordEmail) coordMember.email = coordEmail;
          }
          if (typeof syncUserToAuthDb === 'function') syncUserToAuthDb(coordMember);
        }

        // 5. Turma e Docentes Regentes
        const className = (idxTurma !== -1 && parts[idxTurma]) ? parts[idxTurma].trim() : '';
        if (className) {
          const rawStage = (idxEtapa !== -1 && parts[idxEtapa]) ? parts[idxEtapa].trim() : 'Infantil I';
          const normalizedStage = typeof normalizeStageName === 'function' ? normalizeStageName(rawStage) : rawStage;
          
          const rawMulti = (idxMulti !== -1 && parts[idxMulti]) ? parts[idxMulti].trim() : '';
          const multiStages = rawMulti ? rawMulti.split(/[|,;]/).map(s => s.trim()).filter(Boolean) : [];

          const rawJornada = (idxJornada !== -1 && parts[idxJornada]) ? parts[idxJornada].trim() : '';
          const rawTurno = (idxTurno !== -1 && parts[idxTurno]) ? parts[idxTurno].trim() : '';
          const isIntegral = rawJornada.toLowerCase().includes('integral') || rawTurno.toLowerCase().includes('integral') || rawTurno.toLowerCase().includes('manh');
          
          let shift = 'Tempo Parcial (Matutino)';
          if (isIntegral) {
            shift = 'Tempo Integral (Manhã + Tarde)';
          } else if (rawTurno.toLowerCase().includes('vesp')) {
            shift = 'Tempo Parcial (Vespertino)';
          }

          const totAlunos = parseInt(idxTotAlunos !== -1 ? parts[idxTotAlunos] : '20', 10) || 20;
          const aeeAlunos = parseInt(idxAeeAlunos !== -1 ? parts[idxAeeAlunos] : '0', 10) || 0;

          const doc1Name = (idxDoc1Nome !== -1 && parts[idxDoc1Nome]) ? parts[idxDoc1Nome].trim() : '';
          const doc1Email = (idxDoc1Email !== -1 && parts[idxDoc1Email]) ? parts[idxDoc1Email].trim() : '';
          const doc2Name = (idxDoc2Nome !== -1 && parts[idxDoc2Nome]) ? parts[idxDoc2Nome].trim() : '';
          const doc2Email = (idxDoc2Email !== -1 && parts[idxDoc2Email]) ? parts[idxDoc2Email].trim() : '';

          const teachers = [doc1Name, doc2Name].filter(Boolean);

          // Cadastro / Atualização de Docente 1
          if (doc1Name) {
            let t1 = appState.teamMembers.find(m => m.name.toLowerCase() === doc1Name.toLowerCase() && m.roleKey === 'professora' && m.school === ueName);
            if (!t1) {
              t1 = {
                id: 'usr-prof-' + Date.now() + '-' + i + '-1',
                name: doc1Name,
                roleKey: 'professora',
                roleTitle: 'Professora',
                school: ueName,
                supervisor: coordName || 'Mariana Ferreira',
                classAssigned: className,
                email: doc1Email || `${doc1Name.toLowerCase().replace(/\s+/g, '.')}@patos.pb.gov.br`
              };
              appState.teamMembers.push(t1);
              teachersCount++;
            } else {
              t1.classAssigned = className;
              if (doc1Email) t1.email = doc1Email;
            }
          }

          // Cadastro / Atualização de Docente 2
          if (doc2Name) {
            let t2 = appState.teamMembers.find(m => m.name.toLowerCase() === doc2Name.toLowerCase() && m.roleKey === 'professora' && m.school === ueName);
            if (!t2) {
              t2 = {
                id: 'usr-prof-' + Date.now() + '-' + i + '-2',
                name: doc2Name,
                roleKey: 'professora',
                roleTitle: 'Professora',
                school: ueName,
                supervisor: coordName || 'Mariana Ferreira',
                classAssigned: className,
                email: doc2Email || `${doc2Name.toLowerCase().replace(/\s+/g, '.')}@patos.pb.gov.br`
              };
              appState.teamMembers.push(t2);
              teachersCount++;
            } else {
              t2.classAssigned = className;
              if (doc2Email) t2.email = doc2Email;
            }
          }

          // Localiza ou Cria a Turma
          let clsObj = appState.classes.find(c => c.school.toLowerCase() === ueName.toLowerCase() && c.name.toLowerCase() === className.toLowerCase());
          if (!clsObj) {
            clsObj = {
              id: 'cls-auto-' + Date.now() + '-' + i,
              name: className,
              school: ueName,
              stage: normalizedStage,
              multiStages: multiStages,
              shift: shift,
              totalStudents: totAlunos,
              inclusiveStudents: aeeAlunos,
              teachers: teachers,
              teachersMorning: isIntegral ? (doc1Name ? [doc1Name] : []) : teachers,
              teachersAfternoon: isIntegral ? (doc2Name ? [doc2Name] : [doc1Name]) : []
            };
            appState.classes.push(clsObj);
            classesCount++;
          } else {
            clsObj.stage = normalizedStage;
            if (multiStages.length > 0) clsObj.multiStages = multiStages;
            clsObj.shift = shift;
            clsObj.totalStudents = totAlunos;
            clsObj.inclusiveStudents = aeeAlunos;
            clsObj.teachers = teachers;
            if (isIntegral) {
              clsObj.teachersMorning = doc1Name ? [doc1Name] : [];
              clsObj.teachersAfternoon = doc2Name ? [doc2Name] : [doc1Name];
            }
          }
          seenClasses.add(`${ueName}|${className}`);
        }
      }

      return {
        unitsCount: seenUnits.size,
        classesCount: seenClasses.size,
        teachersCount
      };
    }

    // =========================================================================
