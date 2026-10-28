    // --- 11. UNITS & TEAM MANAGEMENT WITH SPREADSHEET IMPORT ---
    // =========================================================================
    // MOTOR DE CARACTERIZAÇÃO QUANTITATIVA E AGREGAÇÃO SSOT
    // =========================================================================

    // Retorna agregados de uma unidade escolar a partir do somatório de suas turmas
    function getSchoolClassesAggregates(schoolName) {
      const classes = (appState.classes || []).filter(c => c.school === schoolName);
      let totalStudents = 0;
      let inclusiveStudents = 0;

      classes.forEach(c => {
        const tot = typeof c.totalStudents === 'number' && !isNaN(c.totalStudents) ? c.totalStudents : 20;
        const inc = typeof c.inclusiveStudents === 'number' && !isNaN(c.inclusiveStudents) ? c.inclusiveStudents : 0;
        totalStudents += tot;
        inclusiveStudents += inc;
      });

      const regularStudents = Math.max(0, totalStudents - inclusiveStudents);
      const inclusionRate = totalStudents > 0 ? ((inclusiveStudents / totalStudents) * 100).toFixed(1) : '0.0';
      const teachersCount = (appState.teamMembers || []).filter(m => m.school === schoolName && m.roleKey === 'professora').length;

      return {
        schoolName,
        totalClasses: classes.length,
        totalStudents,
        inclusiveStudents,
        regularStudents,
        inclusionRate,
        teachersCount,
        classes
      };
    }

    // Retorna agregados de um polo regional somando as turmas de todas as suas UEs
    function getPoloClassesAggregates(poloName) {
      const poloUnits = (appState.units || []).filter(u => u.polo === poloName).map(u => u.name);
      let totalClasses = 0;
      let totalStudents = 0;
      let inclusiveStudents = 0;

      poloUnits.forEach(uName => {
        const agg = getSchoolClassesAggregates(uName);
        totalClasses += agg.totalClasses;
        totalStudents += agg.totalStudents;
        inclusiveStudents += agg.inclusiveStudents;
      });

      const regularStudents = Math.max(0, totalStudents - inclusiveStudents);
      const inclusionRate = totalStudents > 0 ? ((inclusiveStudents / totalStudents) * 100).toFixed(1) : '0.0';

      return {
        poloName,
        totalUnits: poloUnits.length,
        totalClasses,
        totalStudents,
        inclusiveStudents,
        regularStudents,
        inclusionRate
      };
    }

    // Retorna o agregado global da Rede Municipal (soma de todas as turmas)
    function getNetworkClassesAggregates() {
      let totalClasses = 0;
      let totalStudents = 0;
      let inclusiveStudents = 0;

      const allClasses = appState.classes || [];
      allClasses.forEach(c => {
        const tot = typeof c.totalStudents === 'number' && !isNaN(c.totalStudents) ? c.totalStudents : 20;
        const inc = typeof c.inclusiveStudents === 'number' && !isNaN(c.inclusiveStudents) ? c.inclusiveStudents : 0;
        totalStudents += tot;
        inclusiveStudents += inc;
        totalClasses++;
      });

      const regularStudents = Math.max(0, totalStudents - inclusiveStudents);
      const inclusionRate = totalStudents > 0 ? ((inclusiveStudents / totalStudents) * 100).toFixed(1) : '0.0';
      const totalUnits = (appState.units || []).length;

      return {
        totalUnits,
        totalClasses,
        totalStudents,
        inclusiveStudents,
        regularStudents,
        inclusionRate
      };
    }

    // Sincroniza dinamicamente appState.units com o somatório de suas turmas
    function syncUnitCharacterizationFromClasses() {
      if (!Array.isArray(appState.units)) return;
      appState.units.forEach(u => {
        const agg = getSchoolClassesAggregates(u.name);
        u.totalClasses = agg.totalClasses;
        u.totalStudents = agg.totalStudents;
        u.inclusiveStudents = agg.inclusiveStudents;
      });
    }

    // Helpers de controle de visualização da caracterização na Coordenadora
    function setCoordinatorCharView(mode) {
      const coordContainer = document.getElementById('coordinatorUnitCardContainer');
      if (coordContainer) {
        coordContainer.dataset.viewMode = mode;
        renderUnitsScreen();
      }
    }

    function setCoordinatorCharClass(classId) {
      const coordContainer = document.getElementById('coordinatorUnitCardContainer');
      if (coordContainer) {
        coordContainer.dataset.viewMode = 'class';
        coordContainer.dataset.selectedClassId = classId;
        renderUnitsScreen();
      }
    }

    function saveSchoolAddressOnly() {
      const user = getCurrentUser();
      const schoolName = user.school;
      const unit = (appState.units || []).find(u => u.name === schoolName);
      if (!unit) {
        showToast('Unidade escolar não encontrada.');
        return;
      }
      const address = document.getElementById('coordUnitAddress')?.value.trim();
      if (address !== undefined) {
        unit.address = address;
        saveState();
        showToast('Endereço da unidade escolar salvo com sucesso!');
      }
    }

    function renderUnitsScreen() {
      const user = getCurrentUser();
      const coordContainer = document.getElementById('coordinatorUnitCardContainer');
      const unitsMgmtContainer = document.getElementById('unitsManagementContainer');
      const addUnitBtn = document.getElementById('btnAddUnitMain');

      if (user.roleKey === 'coordenador') {
        if (coordContainer) {
          coordContainer.style.display = 'block';
          const myUnit = (appState.units || []).find(u => u.name === user.school) || {
            name: user.school,
            polo: 'Polo Municipal',
            address: ''
          };
          const agg = getSchoolClassesAggregates(user.school);
          const schoolClasses = agg.classes;

          // Recupera modo de visualização ativo (consolidado ou turma específica)
          const activeViewMode = coordContainer.dataset.viewMode || 'aggregated';
          const selectedClassId = coordContainer.dataset.selectedClassId || (schoolClasses[0] ? schoolClasses[0].id : '');
          const currentClass = schoolClasses.find(c => c.id === selectedClassId) || schoolClasses[0];

          let detailHtml = '';
          if (activeViewMode === 'class' && currentClass) {
            const clsTot = typeof currentClass.totalStudents === 'number' ? currentClass.totalStudents : 20;
            const clsInc = typeof currentClass.inclusiveStudents === 'number' ? currentClass.inclusiveStudents : 0;
            const clsReg = Math.max(0, clsTot - clsInc);
            const clsTeachers = Array.isArray(currentClass.teachers) && currentClass.teachers.length > 0 ? currentClass.teachers.join(', ') : 'Aguardando atribuição';

            detailHtml = `
              <div style="background:#F8FAFC; border:1px solid var(--border); border-radius:10px; padding:16px; margin-bottom:16px;">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
                  <div>
                    <h4 style="margin:0; font-size:15px; font-weight:800; color:var(--primary-dark);">${currentClass.name}</h4>
                    <span style="font-size:12px; color:var(--text-secondary);">${currentClass.stage || 'Educação Infantil'} · ${currentClass.shift || 'Parcial'}</span>
                  </div>
                  <button class="btn btn-secondary" style="font-size:11px; padding:5px 10px;" onclick="openEditClassModal('${currentClass.id}')">
                    ✏️ Editar Turma
                  </button>
                </div>
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:10px;">
                  <div style="background:#FFFFFF; border:1px solid var(--border); border-radius:8px; padding:10px;">
                    <div style="font-size:11px; font-weight:700; color:var(--text-secondary);">Total de Alunos</div>
                    <div style="font-size:20px; font-weight:800; color:#1E40AF; margin-top:2px;">${clsTot}</div>
                    <div style="font-size:10px; color:var(--text-secondary);">Crianças matriculadas</div>
                  </div>
                  <div style="background:#FFFFFF; border:1px solid var(--border); border-radius:8px; padding:10px;">
                    <div style="font-size:11px; font-weight:700; color:var(--text-secondary);">Necessidades Especiais</div>
                    <div style="font-size:20px; font-weight:800; color:#059669; margin-top:2px;">${clsInc}</div>
                    <div style="font-size:10px; color:var(--text-secondary);">${clsInc > 0 ? 'Público AEE nesta turma' : 'Nenhum aluno AEE'}</div>
                  </div>
                  <div style="background:#FFFFFF; border:1px solid var(--border); border-radius:8px; padding:10px;">
                    <div style="font-size:11px; font-weight:700; color:var(--text-secondary);">Alunos Regulares</div>
                    <div style="font-size:20px; font-weight:800; color:#475569; margin-top:2px;">${clsReg}</div>
                    <div style="font-size:10px; color:var(--text-secondary);">Sem necessidade especial</div>
                  </div>
                  <div style="background:#FFFFFF; border:1px solid var(--border); border-radius:8px; padding:10px;">
                    <div style="font-size:11px; font-weight:700; color:var(--text-secondary);">Docentes Regentes</div>
                    <div style="font-size:12px; font-weight:700; color:#1E293B; margin-top:6px; line-height:1.3;">${clsTeachers}</div>
                  </div>
                </div>
              </div>
            `;
          } else {
            detailHtml = `
              <!-- Grid de Métricas Agregadas da UE -->
              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:14px; margin-bottom:20px;">
                <div style="background:#F8FAFC; border:1px solid var(--border); border-radius:10px; padding:14px;">
                  <div style="font-size:11px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Alunos Matriculados (Soma)</div>
                  <div style="font-size:22px; font-weight:800; color:#1E40AF; margin-top:6px;">${agg.totalStudents}</div>
                  <div style="font-size:11px; color:var(--text-secondary); margin-top:4px;">Somatório de todas as ${agg.totalClasses} turmas</div>
                </div>

                <div style="background:#F8FAFC; border:1px solid var(--border); border-radius:10px; padding:14px;">
                  <div style="font-size:11px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Educação Inclusiva / AEE</div>
                  <div style="font-size:22px; font-weight:800; color:#059669; margin-top:6px;">${agg.inclusiveStudents} <span style="font-size:13px; font-weight:600; color:var(--text-secondary);">(${agg.inclusionRate}%)</span></div>
                  <div style="font-size:11px; color:var(--text-secondary); margin-top:4px;">Crianças com necessidades especiais</div>
                </div>

                <div style="background:#F8FAFC; border:1px solid var(--border); border-radius:10px; padding:14px;">
                  <div style="font-size:11px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Turmas em Atividade</div>
                  <div style="font-size:22px; font-weight:800; color:#6D28D9; margin-top:6px;">${agg.totalClasses}</div>
                  <div style="font-size:11px; color:var(--text-secondary); margin-top:4px;">Turmas ativas sob sua gestão</div>
                </div>

                <div style="background:#F8FAFC; border:1px solid var(--border); border-radius:10px; padding:14px;">
                  <div style="font-size:11px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Docentes na UE</div>
                  <div style="font-size:22px; font-weight:800; color:#D97706; margin-top:6px;">${agg.teachersCount}</div>
                  <div style="font-size:11px; color:var(--text-secondary); margin-top:4px;">Professoras titulares lotadas</div>
                </div>
              </div>
            `;
          }

          coordContainer.innerHTML = `
            <div class="card" style="border-left: 4px solid var(--primary); padding: 20px;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
                <div>
                  <div style="display:flex; align-items:center; gap:8px;">
                    <svg class="btn-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M3 7l9-4 9 4v14M9 21V9h6v12"/></svg>
                    <h3 style="font-size:18px; font-weight:800; color:var(--primary-dark); margin:0;">${myUnit.name}</h3>
                  </div>
                  <p style="font-size:12px; color:var(--text-secondary); margin:4px 0 0 0;">Caracterização calculada a partir do somatório canônico de turmas da unidade escolar.</p>
                </div>
                
                <!-- Seletor de Modo de Visualização da Coordenadora -->
                <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                  <div class="btn-group" style="display:inline-flex; border:1px solid var(--border); border-radius:8px; overflow:hidden;">
                    <button class="btn btn-secondary ${activeViewMode === 'aggregated' ? 'active' : ''}" style="font-size:11px; padding:6px 12px; border:none; ${activeViewMode === 'aggregated' ? 'background:var(--primary); color:#FFF;' : ''}" onclick="setCoordinatorCharView('aggregated')">
                      Consolidado da Escola
                    </button>
                    <button class="btn btn-secondary ${activeViewMode === 'class' ? 'active' : ''}" style="font-size:11px; padding:6px 12px; border:none; ${activeViewMode === 'class' ? 'background:var(--primary); color:#FFF;' : ''}" onclick="setCoordinatorCharView('class')">
                      Especificar por Turma
                    </button>
                  </div>
                  ${activeViewMode === 'class' ? `
                    <select id="coordCharClassSelect" class="form-select" style="font-size:12px; padding:5px 10px; width:auto;" onchange="setCoordinatorCharClass(this.value)">
                      ${schoolClasses.map(c => `<option value="${c.id}" ${c.id === (currentClass ? currentClass.id : '') ? 'selected' : ''}>${c.name}</option>`).join('')}
                    </select>
                  ` : ''}
                </div>
              </div>

              ${detailHtml}

              <div class="form-group" style="margin-bottom:12px;">
                <label class="form-label" style="font-size:12px;">Endereço / Bairro da Unidade Escolar</label>
                <div style="display:flex; gap:10px;">
                  <input type="text" id="coordUnitAddress" class="form-input" value="${myUnit.address || ''}" placeholder="Ex: Bairro Alto das Flores, Rua das Acácias, nº 120">
                  <button class="btn btn-primary" onclick="saveSchoolAddressOnly()" style="font-size:12px; padding:8px 14px; white-space:nowrap;">
                    Salvar Endereço
                  </button>
                </div>
              </div>
            </div>
          `;
        }
        if (unitsMgmtContainer) unitsMgmtContainer.style.display = 'none';
        return;
      }

      if (coordContainer) coordContainer.style.display = 'none';
      if (unitsMgmtContainer) unitsMgmtContainer.style.display = 'block';
      if (addUnitBtn) addUnitBtn.style.display = isNucleoEI(user) ? 'inline-flex' : 'none';

      // 1. Matriz de Cobertura da Rede por Polo Regional (Requisito 7)
      const covTbody = document.getElementById('networkCoverageTableBody');
      const addPoloBtn = document.getElementById('btnAddPoloMain');
      if (addPoloBtn) {
        addPoloBtn.style.display = isNucleoEI(user) ? 'inline-flex' : 'none';
      }

      if (covTbody) {
        covTbody.innerHTML = '';
        
        let polos = getAllPolosList();

        if (user.roleKey === 'formador') {
          polos = polos.filter(p => p === user.school || p.toLowerCase().includes(user.school.toLowerCase()));
        }

        polos.forEach(poloName => {
          const unitsInPolo = appState.units.filter(u => u.polo === poloName);
          const unitNames = unitsInPolo.map(u => u.name);
          
          const formadora = appState.teamMembers.find(m => m.roleKey === 'formador' && m.school === poloName);
          const formadoraName = formadora ? formadora.name : '<span style="color:var(--text-secondary); font-style:italic;">A definir / Secretaria</span>';

          const cpsInPolo = appState.teamMembers.filter(m => m.roleKey === 'coordenador' && unitNames.includes(m.school));
          const cpNames = cpsInPolo.length > 0 ? cpsInPolo.map(c => `<strong>${c.name}</strong> (${c.school})`).join('<br>') : '<span style="color:var(--text-secondary); font-style:italic;">Nenhuma CP alocada</span>';

          const teachersCount = appState.teamMembers.filter(m => m.roleKey === 'professora' && unitNames.includes(m.school)).length;

          const canEditPolo = isNucleoEI(user) || (user.roleKey === 'formador' && user.school === poloName);
          const canDeletePolo = isNucleoEI(user) && unitsInPolo.length === 0;

          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td><strong style="color:var(--primary);">${poloName}</strong></td>
            <td><span style="font-weight:700; color:#1E293B;">${formadoraName}</span></td>
            <td>
              ${unitsInPolo.map(u => `
                <div style="cursor:pointer; color:var(--primary); font-weight:600; margin-bottom:3px; display:inline-block;" onclick="openViewUnitClassesModal('${u.id}')" title="Clique para visualizar turmas e docentes atribuídos em ${u.name}">
                  🏢 ${u.name}
                </div>
              `).join('<br>') || '<span style="color:var(--text-secondary); font-style:italic;">Nenhuma UE alocada</span>'}
            </td>
            <td style="font-size:12px; line-height:1.4;">${cpNames}</td>
            <td><span class="status-badge" style="background:#EFF6FF; color:#1E40AF; font-weight:700;">${teachersCount} Docentes</span></td>
            <td><span class="status-badge" style="background:#DCFCE7; color:#166534; font-weight:700;">Ativo</span></td>
            <td style="text-align:center; white-space:nowrap;">
              ${canEditPolo ? `<button class="btn btn-secondary" style="padding:4px 8px; font-size:11px; margin-right:4px;" onclick="openEditPoloModal('${encodeURIComponent(poloName)}')">✏️ Editar</button>` : '<span style="color:var(--text-secondary); font-size:11px;">Somente Leitura</span>'}
              ${canDeletePolo ? `<button class="btn btn-secondary" style="padding:4px 8px; font-size:11px; color:var(--red);" onclick="removePolo('${encodeURIComponent(poloName)}')">Excluir</button>` : ''}
            </td>
          `;
          covTbody.appendChild(tr);
        });
      }

      // 2. Popular Dropdown de Filtro por Polo (Requisito 3)
      const filterPoloSelect = document.getElementById('unitsFilterPolo');
      if (filterPoloSelect) {
        const curVal = filterPoloSelect.value;
        filterPoloSelect.innerHTML = '<option value="ALL">Todos os Polos Regionais</option>';
        let uniquePolos = getAllPolosList();
        if (user.roleKey === 'formador') {
          uniquePolos = uniquePolos.filter(p => p === user.school);
        }
        uniquePolos.forEach(p => {
          const opt = document.createElement('option');
          opt.value = p;
          opt.text = p;
          if (p === curVal) opt.selected = true;
          filterPoloSelect.appendChild(opt);
        });
      }

      // 3. Tabela de Unidades Escolares Cadastradas com Filtros
      const tbody = document.getElementById('unitsTableBody');
      if (!tbody) return;
      tbody.innerHTML = '';

      const poloFilter = document.getElementById('unitsFilterPolo')?.value || 'ALL';
      const searchFilter = (document.getElementById('unitsFilterSearch')?.value || '').trim().toLowerCase();

      let filteredUnits = appState.units;
      if (user.roleKey === 'formador') {
        filteredUnits = filteredUnits.filter(u => u.polo === user.school || u.name === user.school);
      } else if (poloFilter !== 'ALL') {
        filteredUnits = filteredUnits.filter(u => u.polo === poloFilter);
      }
      if (searchFilter) {
        filteredUnits = filteredUnits.filter(u => u.name.toLowerCase().includes(searchFilter) || (u.address && u.address.toLowerCase().includes(searchFilter)));
      }

      if (filteredUnits.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-secondary); padding:20px;">Nenhuma unidade escolar encontrada com os filtros selecionados.</td></tr>`;
        return;
      }

      filteredUnits.forEach(u => {
        const teachersCount = appState.teamMembers.filter(m => m.school === u.name).length;
        const canDelete = isNucleoEI(user);
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>
            <span style="cursor:pointer; color:var(--primary); font-weight:700;" onclick="openViewUnitClassesModal('${u.id}')" title="Clique para visualizar turmas e docentes atribuídos">
              ${u.name}
            </span>
          </td>
          <td><span class="status-badge" style="background:#DCFCE7; color:#166534; font-weight:700; font-size:11px;">${u.polo}</span></td>
          <td>${u.address || 'Não informado'}</td>
          <td><span class="status-badge" style="background:#EFF6FF; color:#1E40AF;">${teachersCount} Profissionais</span></td>
          <td style="text-align:center; white-space:nowrap;">
            <button class="btn btn-secondary" style="padding:4px 8px; font-size:11px; margin-right:4px;" onclick="openViewUnitClassesModal('${u.id}')" title="Visualizar turmas e regentes titulares desta UE">👁️ Ver Turmas</button>
            <button class="btn btn-secondary" style="padding:4px 8px; font-size:11px; margin-right:4px;" onclick="openEditUnitModal('${u.id}')">Editar</button>
            ${canDelete ? `<button class="btn btn-secondary" style="padding:4px 8px; font-size:11px; color:var(--red);" onclick="removeUnit('${u.id}')">Excluir</button>` : ''}
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    // --- VISUALIZAÇÃO DE TURMAS E DOCENTES DA UE (SOMENTE LEITURA SSOT) ---
    function openViewUnitClassesModal(unitId) {
      const unit = (appState.units || []).find(u => u.id === unitId || u.name === unitId);
      if (!unit) {
        showToast('Unidade Escolar não localizada.');
        return;
      }

      // Preenchimento de Metadados
      const titleEl = document.getElementById('viewUnitModalTitle');
      const poloEl = document.getElementById('viewUnitModalPolo');
      const addrEl = document.getElementById('viewUnitModalAddress');
      const coordEl = document.getElementById('viewUnitModalCoord');
      const classesCountEl = document.getElementById('viewUnitModalClassesCount');
      const teachersCountEl = document.getElementById('viewUnitModalTeachersCount');
      const studentsEl = document.getElementById('viewUnitModalStudents');

      if (titleEl) titleEl.innerText = unit.name;
      if (poloEl) poloEl.innerText = unit.polo || 'Polo Regional';
      if (addrEl) addrEl.innerText = unit.address || 'Endereço não informado';

      const cp = (appState.teamMembers || []).find(m => m.roleKey === 'coordenador' && m.school === unit.name);
      if (coordEl) coordEl.innerText = cp ? cp.name : 'A definir / Sem CP';

      const unitClasses = getClassesForSchool(unit.name);
      const unitTeachers = (appState.teamMembers || []).filter(m => m.school === unit.name && m.roleKey === 'professora');

      if (classesCountEl) classesCountEl.innerText = `${unitClasses.length} turma(s)`;
      if (teachersCountEl) teachersCountEl.innerText = `${unitTeachers.length} docente(s)`;
      if (studentsEl) {
        const tot = unit.totalStudents !== undefined ? unit.totalStudents : 120;
        const inc = unit.inclusiveStudents !== undefined ? unit.inclusiveStudents : 5;
        studentsEl.innerText = `${tot} (${inc} AEE)`;
      }

      // Renderização da Tabela de Turmas & Docentes Atribuídos
      const tbody = document.getElementById('viewUnitClassesTableBody');
      if (tbody) {
        tbody.innerHTML = '';

        if (unitClasses.length === 0) {
          tbody.innerHTML = `
            <tr>
              <td colspan="4" style="text-align:center; padding:24px; color:var(--text-secondary); font-style:italic;">
                Nenhuma turma cadastrada no momento pela Coordenação Pedagógica desta Unidade Escolar.
              </td>
            </tr>
          `;
        } else {
          unitClasses.forEach(cls => {
            const isIntegral = (cls.shift || '').toLowerCase().includes('integral');
            const jornadaBadge = isIntegral 
              ? `<span class="status-badge" style="background:#EDE9FE; color:#6D28D9; font-weight:700;">Tempo Integral</span>`
              : `<span class="status-badge" style="background:#EFF6FF; color:#1E40AF; font-weight:700;">Tempo Parcial</span>`;

            let turnoBadge = `<span class="status-badge" style="background:#FEF3C7; color:#92400E; font-size:11px;">${cls.shift || 'Parcial'}</span>`;
            if (isIntegral) {
              turnoBadge = `<span class="status-badge" style="background:#DCFCE7; color:#166534; font-size:11px;">Manhã + Tarde</span>`;
            }

            let teachersDisplay = '';
            if (isIntegral && (cls.teachersMorning || cls.teachersAfternoon)) {
              const mList = (Array.isArray(cls.teachersMorning) && cls.teachersMorning.length > 0) ? cls.teachersMorning.join(', ') : 'A definir';
              const aList = (Array.isArray(cls.teachersAfternoon) && cls.teachersAfternoon.length > 0) ? cls.teachersAfternoon.join(', ') : 'A definir';
              teachersDisplay = `
                <div style="font-size:11px; line-height:1.4;">
                  <div><strong style="color:#B45309;">Manhã:</strong> ${mList}</div>
                  <div><strong style="color:#4338CA;">Tarde:</strong> ${aList}</div>
                </div>
              `;
            } else {
              const tList = (Array.isArray(cls.teachers) && cls.teachers.length > 0) ? cls.teachers.join(', ') : '<span style="color:var(--text-secondary); font-style:italic;">Aguardando atribuição de regente</span>';
              teachersDisplay = `<div style="font-size:12px; font-weight:600; color:#1E293B;">${tList}</div>`;
            }

            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>
                <strong style="color:var(--primary-dark); font-size:13px;">${cls.name}</strong><br>
                <span class="status-badge" style="background:#F1F5F9; color:#475569; font-size:10px;">${cls.stage || 'Educação Infantil'}</span>
              </td>
              <td>${jornadaBadge}</td>
              <td>${turnoBadge}</td>
              <td>${teachersDisplay}</td>
            `;
            tbody.appendChild(tr);
          });
        }
      }

      document.getElementById('modalViewUnitClasses').classList.add('active');
    }

    function closeViewUnitClassesModal() {
      const modal = document.getElementById('modalViewUnitClasses');
      if (modal) modal.classList.remove('active');
    }

    // --- GESTÃO E EDIÇÃO DE POLOS REGIONAIS (SSOT) ---
    function openEditPoloModal(encodedPoloName) {
      const poloName = decodeURIComponent(encodedPoloName);
      const poloObj = (appState.polos || []).find(p => (typeof p === 'object' ? p.name : p) === poloName) || { name: poloName, region: '' };

      document.getElementById('editPoloOriginalName').value = poloName;
      document.getElementById('editPoloName').value = poloName;
      document.getElementById('editPoloRegion').value = poloObj.region || '';
      document.getElementById('modalEditPoloTitle').innerText = `Editar ${poloName}`;

      // Formadora responsável atual
      const formadoraSelect = document.getElementById('editPoloFormadora');
      formadoraSelect.innerHTML = '<option value="">Nenhuma formadora vinculada / A definir</option>';
      const currentFormadora = (appState.teamMembers || []).find(m => m.roleKey === 'formador' && m.school === poloName);

      const allFormadoras = (appState.teamMembers || []).filter(m => m.roleKey === 'formador');
      allFormadoras.forEach(f => {
        const opt = document.createElement('option');
        opt.value = f.name;
        opt.text = `${f.name} (${f.school || 'Sem Polo'})`;
        if (currentFormadora && currentFormadora.name === f.name) opt.selected = true;
        formadoraSelect.appendChild(opt);
      });

      // Lista de UEs vinculadas com checkboxes
      const unitsListContainer = document.getElementById('editPoloUnitsList');
      unitsListContainer.innerHTML = '';
      (appState.units || []).forEach(u => {
        const isBelonging = u.polo === poloName;
        const row = document.createElement('div');
        row.style.cssText = 'display:flex; align-items:center; gap:8px; margin-bottom:6px; font-size:12px;';
        row.innerHTML = `
          <input type="checkbox" id="chkPoloUnit_${u.id}" class="edit-polo-unit-chk" value="${u.id}" ${isBelonging ? 'checked' : ''} style="cursor:pointer;">
          <label for="chkPoloUnit_${u.id}" style="cursor:pointer; color:var(--text-primary); margin:0;">
            🏢 <strong>${u.name}</strong> ${!isBelonging && u.polo ? `<span style="color:var(--text-secondary); font-size:11px;">(${u.polo})</span>` : ''}
          </label>
        `;
        unitsListContainer.appendChild(row);
      });

      document.getElementById('modalEditPolo').classList.add('active');
    }

    function closeEditPoloModal() {
      document.getElementById('modalEditPolo').classList.remove('active');
    }

    function saveEditPolo() {
      const oldName = document.getElementById('editPoloOriginalName').value.trim();
      const newName = document.getElementById('editPoloName').value.trim();
      const selectedFormadoraName = document.getElementById('editPoloFormadora').value;
      const region = document.getElementById('editPoloRegion').value.trim();

      if (!newName) {
        showToast('Informe o nome do Polo Regional.');
        return;
      }

      const allPolos = getAllPolosList();
      if (newName !== oldName && allPolos.includes(newName)) {
        showToast('Já existe um Polo cadastrado com este nome.');
        return;
      }

      if (!confirm(`Deseja salvar as alterações no Polo Regional "${newName}"?`)) {
        return;
      }

      // 1. Atualiza na coleção de polos
      if (!Array.isArray(appState.polos)) appState.polos = [];
      const poloIndex = appState.polos.findIndex(p => (typeof p === 'object' ? p.name : p) === oldName);
      if (poloIndex !== -1) {
        appState.polos[poloIndex] = {
          id: appState.polos[poloIndex].id || ('polo-' + Date.now()),
          name: newName,
          region: region
        };
      } else {
        appState.polos.push({ id: 'polo-' + Date.now(), name: newName, region: region });
      }

      // 2. Propagação de renomeação em unidades existentes
      if (oldName !== newName) {
        (appState.units || []).forEach(u => {
          if (u.polo === oldName) u.polo = newName;
        });
      }

      // 3. Atualização das UEs selecionadas no checklist
      const chks = document.querySelectorAll('.edit-polo-unit-chk');
      chks.forEach(chk => {
        const u = (appState.units || []).find(unit => unit.id === chk.value);
        if (u) {
          if (chk.checked) {
            u.polo = newName;
          } else if (u.polo === newName || u.polo === oldName) {
            u.polo = 'Sede Central'; // Destino padrão seguro se desmarcada
          }
        }
      });

      // 4. Propagação da Formadora Responsável e Supervisão de Coordenadoras
      const currentPoloUnits = (appState.units || []).filter(u => u.polo === newName).map(u => u.name);

      // Desvincula formadora anterior caso uma nova tenha sido selecionada ou caso o polo fique sem formadora
      (appState.teamMembers || []).forEach(m => {
        if (m.roleKey === 'formador' && (m.school === oldName || m.school === newName) && m.name !== selectedFormadoraName) {
          m.school = 'A definir / Secretaria';
          syncUserToAuthDb(m);
        }
      });

      if (selectedFormadoraName) {
        (appState.teamMembers || []).forEach(m => {
          // Se for a formadora escolhida, atualiza sua escola/polo
          if (m.roleKey === 'formador' && m.name === selectedFormadoraName) {
            m.school = newName;
            syncUserToAuthDb(m);
          }
          // Coordenadoras das unidades do polo passam a ter esta formadora como supervisora
          if (m.roleKey === 'coordenador' && currentPoloUnits.includes(m.school)) {
            m.supervisor = selectedFormadoraName;
            syncUserToAuthDb(m);
          }
        });
      }

      // Se renomeou o polo, atualiza a formadora que estava vinculada a ele anteriormente
      if (oldName !== newName) {
        (appState.teamMembers || []).forEach(m => {
          if (m.roleKey === 'formador' && m.school === oldName) {
            m.school = newName;
            syncUserToAuthDb(m);
          }
        });
      }

      // Reatividade imediata de sessão se o usuário ativo for afetado
      const curr = getCurrentUser();
      if (curr && (curr.school === oldName || curr.name === selectedFormadoraName)) {
        curr.school = newName;
        applyUserRoleUI();
      }

      saveState();
      closeEditPoloModal();
      renderUnitsScreen();
      showToast(`Polo Regional "${newName}" atualizado com sucesso!`);
    }

    function openAddPoloModal() {
      document.getElementById('newPoloName').value = '';
      document.getElementById('newPoloRegion').value = '';
      const formadoraSelect = document.getElementById('newPoloFormadora');
      formadoraSelect.innerHTML = '<option value="">Nenhuma formadora vinculada / A definir</option>';
      const allFormadoras = (appState.teamMembers || []).filter(m => m.roleKey === 'formador');
      allFormadoras.forEach(f => {
        const opt = document.createElement('option');
        opt.value = f.name;
        opt.text = `${f.name} (${f.school || 'Sem Polo'})`;
        formadoraSelect.appendChild(opt);
      });
      document.getElementById('modalAddPolo').classList.add('active');
    }

    function closeAddPoloModal() {
      document.getElementById('modalAddPolo').classList.remove('active');
    }

    function saveNewPolo() {
      const name = document.getElementById('newPoloName').value.trim();
      const region = document.getElementById('newPoloRegion').value.trim();
      const formadoraName = document.getElementById('newPoloFormadora').value;

      if (!name) {
        showToast('Informe o nome do Polo Regional.');
        return;
      }

      const allPolos = getAllPolosList();
      if (allPolos.includes(name)) {
        showToast('Já existe um Polo cadastrado com este nome.');
        return;
      }

      if (!confirm(`Deseja cadastrar o novo Polo Regional "${name}"?`)) {
        return;
      }

      if (!Array.isArray(appState.polos)) appState.polos = [];
      appState.polos.push({
        id: 'polo-' + Date.now(),
        name: name,
        region: region
      });

      if (formadoraName) {
        const fMember = (appState.teamMembers || []).find(m => m.roleKey === 'formador' && m.name === formadoraName);
        if (fMember) {
          fMember.school = name;
          syncUserToAuthDb(fMember);
        }
      }

      saveState();
      closeAddPoloModal();
      renderUnitsScreen();
      showToast(`Polo Regional "${name}" cadastrado com sucesso!`);
    }

    function removePolo(encodedPoloName) {
      const poloName = decodeURIComponent(encodedPoloName);
      const unitsInPolo = (appState.units || []).filter(u => u.polo === poloName);
      if (unitsInPolo.length > 0) {
        alert(`Não é possível excluir o "${poloName}" pois existem ${unitsInPolo.length} Unidade(s) Escolar(es) vinculada(s) a ele. Reatribua as escolas antes de excluir.`);
        return;
      }

      if (!confirm(`Tem certeza que deseja remover o Polo Regional "${poloName}"?`)) {
        return;
      }

      appState.polos = (appState.polos || []).filter(p => (typeof p === 'object' ? p.name : p) !== poloName);
      // Desvincula formadoras que tinham este polo
      (appState.teamMembers || []).forEach(m => {
        if (m.roleKey === 'formador' && m.school === poloName) {
          m.school = 'A definir / Secretaria';
          syncUserToAuthDb(m);
        }
      });

      saveState();
      renderUnitsScreen();
      showToast(`Polo Regional "${poloName}" removido com sucesso.`);
    }

    function openAddUnitModal() {
      document.getElementById('newUnitName').value = '';
      document.getElementById('newUnitAddress').value = '';
      const poloSelect = document.getElementById('newUnitPolo');
      if (poloSelect) {
        poloSelect.innerHTML = '';
        getAllPolosList().forEach(p => {
          const opt = document.createElement('option');
          opt.value = p;
          opt.text = p;
          poloSelect.appendChild(opt);
        });
      }
      document.getElementById('modalAddUnit').classList.add('active');
    }
    function closeAddUnitModal() {
      document.getElementById('modalAddUnit').classList.remove('active');
    }

    function saveNewUnit() {
      const name = document.getElementById('newUnitName').value.trim();
      const polo = document.getElementById('newUnitPolo').value;
      const address = document.getElementById('newUnitAddress').value.trim();

      if (!name) {
        showToast('Informe o nome da Unidade Escolar.');
        return;
      }

      if (!confirm('Tem certeza que deseja cadastrar esta nova Unidade Escolar?')) {
        return;
      }

      const newUnit = {
        id: 'ue-' + Date.now(),
        name,
        polo,
        address,
        totalStudents: 120,
        inclusiveStudents: 5,
        totalClasses: 4
      };

      appState.units.push(newUnit);
      saveState();
      closeAddUnitModal();
      renderUnitsScreen();
      showToast(`Unidade ${name} cadastrada com sucesso!`);
    }

    function openEditUnitModal(id) {
      const unit = (appState.units || []).find(u => u.id === id);
      if (!unit) {
        showToast('Unidade não encontrada.');
        return;
      }

      document.getElementById('editUnitId').value = unit.id;
      document.getElementById('editUnitName').value = unit.name || '';
      document.getElementById('editUnitAddress').value = unit.address || '';
      if (document.getElementById('editUnitStudents')) {
        document.getElementById('editUnitStudents').value = unit.totalStudents !== undefined ? unit.totalStudents : 120;
      }
      if (document.getElementById('editUnitInclusive')) {
        document.getElementById('editUnitInclusive').value = unit.inclusiveStudents !== undefined ? unit.inclusiveStudents : 5;
      }

      // Popula opções de polo com base nos polos via getAllPolosList()
      const poloSelect = document.getElementById('editUnitPolo');
      if (poloSelect) {
        poloSelect.innerHTML = '';
        getAllPolosList().forEach(p => {
          const opt = document.createElement('option');
          opt.value = p;
          opt.text = p;
          if (p === unit.polo) opt.selected = true;
          poloSelect.appendChild(opt);
        });
      }

      document.getElementById('modalEditUnit').classList.add('active');
    }

    function closeEditUnitModal() {
      document.getElementById('modalEditUnit').classList.remove('active');
    }

    function saveEditUnit() {
      const id = document.getElementById('editUnitId').value;
      const name = document.getElementById('editUnitName').value.trim();
      const polo = document.getElementById('editUnitPolo').value;
      const address = document.getElementById('editUnitAddress').value.trim();
      const totStudents = parseInt(document.getElementById('editUnitStudents')?.value, 10);
      const incStudents = parseInt(document.getElementById('editUnitInclusive')?.value, 10);

      if (!name) {
        showToast('Informe o nome da Unidade Escolar.');
        return;
      }

      const unitIndex = (appState.units || []).findIndex(u => u.id === id);
      if (unitIndex === -1) {
        showToast('Unidade não encontrada.');
        return;
      }

      if (!confirm('Tem certeza que deseja salvar as alterações nesta Unidade Escolar?')) {
        return;
      }

      const oldName = appState.units[unitIndex].name;

      // Atualiza a unidade escolar
      appState.units[unitIndex] = {
        ...appState.units[unitIndex],
        name,
        polo,
        address: address || '',
        totalStudents: !isNaN(totStudents) ? totStudents : (appState.units[unitIndex].totalStudents || 120),
        inclusiveStudents: !isNaN(incStudents) ? incStudents : (appState.units[unitIndex].inclusiveStudents || 5)
      };

      // Propagação de integridade relacional se o nome da unidade mudou
      if (oldName && oldName !== name) {
        if (appState.teamMembers) {
          appState.teamMembers.forEach(m => {
            if (m.school === oldName) {
              m.school = name;
            }
          });
        }
        if (appState.customUsers) {
          Object.values(appState.customUsers).forEach(u => {
            if (u.school === oldName) {
              u.school = name;
            }
          });
        }
        if (typeof USERS_DB !== 'undefined') {
          Object.values(USERS_DB).forEach(u => {
            if (u.school === oldName) {
              u.school = name;
            }
          });
        }
        if (appState.classes) {
          appState.classes.forEach(c => {
            if (c.school === oldName) {
              c.school = name;
            }
          });
        }
        if (appState.notes) {
          appState.notes.forEach(n => {
            if (n.schoolName === oldName) {
              n.schoolName = name;
            }
          });
        }
        if (appState.schedules) {
          appState.schedules.forEach(s => {
            if (s.schoolName === oldName) {
              s.schoolName = name;
            }
          });
        }
        if (appState.observations) {
          appState.observations.forEach(o => {
            if (o.schoolName === oldName) {
              o.schoolName = name;
            }
          });
        }
      }

      saveState();
      closeEditUnitModal();
      renderUnitsScreen();
      showToast(`Unidade "${name}" atualizada com sucesso!`);
    }

    function removeUnit(id) {
      if (!confirm('Tem certeza que deseja remover esta Unidade Escolar?')) {
        return;
      }
      appState.units = appState.units.filter(u => u.id !== id);
      saveState();
      renderUnitsScreen();
      showToast('Unidade removida do SerTão Criança.');
    }

    function downloadUnitsCsvTemplate() {
      const csvContent = "Nome_Unidade,Polo_Regional,Endereco\nCEI Novo Horizonte,Polo Regional 1 (Norte),Bairro Central\nEMEI Estrela da Manha,Polo Regional 2 (Sul),Zona Rural";
      downloadFile(csvContent, 'modelo_unidades_sertao_crianca.csv', 'text/csv');
      showToast('Planilha modelo de UEs baixada!');
    }

    function triggerUnitsCsvImport() {
      document.getElementById('unitsCsvFileInput').click();
    }

    function handleUnitsCsvUpload(e) {
      const file = e.target.files[0];
      if (!file) return;

      if (!confirm('Tem certeza que deseja importar as unidades escolares desta planilha?')) {
        e.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = function(evt) {
        const text = evt.target.result;
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        let imported = 0;

        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].split(',').map(p => p.trim());
          if (parts[0]) {
            appState.units.push({
              id: 'ue-' + Date.now() + '-' + i,
              name: parts[0],
              polo: parts[1] || 'Polo Regional 1 (Norte)',
              address: parts[2] || 'Importado via planilha',
              totalStudents: 120,
              inclusiveStudents: 5,
              totalClasses: 4
            });
            imported++;
          }
        }

        saveState();
        renderUnitsScreen();
        showToast(`${imported} Unidade(s) importada(s) via planilha!`);
      };
      reader.readAsText(file);
      e.target.value = '';
    }

    // --- CARACTERIZAÇÃO DA ESCOLA (PILAR 14) ---
    function saveSchoolCharacterization() {
      const user = getCurrentUser();
      const schoolName = user.school;
      const unit = (appState.units || []).find(u => u.name === schoolName);
      if (!unit) {
        showToast('Unidade escolar não encontrada.');
        return;
      }

      const totalStud = parseInt(document.getElementById('coordUnitTotalStudents')?.value, 10);
      const inclStud = parseInt(document.getElementById('coordUnitInclusiveStudents')?.value, 10);
      const totClasses = parseInt(document.getElementById('coordUnitTotalClasses')?.value, 10);
      const address = document.getElementById('coordUnitAddress')?.value.trim();

      if (!isNaN(totalStud)) unit.totalStudents = totalStud;
      if (!isNaN(inclStud)) unit.inclusiveStudents = inclStud;
      if (!isNaN(totClasses)) unit.totalClasses = totClasses;
      if (address !== undefined) unit.address = address;

      saveState();
      renderUnitsScreen();
      showToast(`Caracterização do ${schoolName} salva com sucesso!`);
    }

    // --- GESTÃO DESCENTRALIZADA DE TURMAS (PILAR 14) ---
    // Helpers de controle de modo do painel analítico de turmas
    function setClassesCharView(mode) {
      const panel = document.getElementById('characterizationFilterPanel');
      if (panel) {
        panel.dataset.viewMode = mode;
        renderClassesScreen();
      }
    }

    function setClassesCharPolo(poloName) {
      const panel = document.getElementById('characterizationFilterPanel');
      if (panel) {
        panel.dataset.selectedPolo = poloName;
        renderClassesScreen();
      }
    }

    function setClassesCharSchool(schoolName) {
      const panel = document.getElementById('characterizationFilterPanel');
      if (panel) {
        panel.dataset.selectedSchool = schoolName;
        renderClassesScreen();
      }
    }

    function setClassesCharClass(classId) {
      const panel = document.getElementById('characterizationFilterPanel');
      if (panel) {
        panel.dataset.viewMode = 'class';
        panel.dataset.selectedClassId = classId;
        renderClassesScreen();
      }
    }

    function renderClassesScreen() {
      const user = getCurrentUser();
      const tbody = document.getElementById('classesTableBody');
      if (!tbody) return;
      tbody.innerHTML = '';

      const filterCard = document.getElementById('classesFilterCard');
      const schoolFilterSelect = document.getElementById('classesFilterSchool');
      const searchInput = document.getElementById('classesFilterSearch');
      const filterSearch = (searchInput ? searchInput.value : '').trim().toLowerCase();
      const charPanel = document.getElementById('characterizationFilterPanel');

      let targetSchool = 'ALL';

      if (user.roleKey === 'coordenador') {
        if (filterCard) filterCard.style.display = 'none';
        targetSchool = user.school;
        const title = document.getElementById('classesViewTitle');
        const subtitle = document.getElementById('classesViewSubtitle');
        if (title) title.innerText = `Turmas & Regência · ${user.school}`;
        if (subtitle) {
          subtitle.innerText = '';
          subtitle.style.display = 'none';
        }
      } else if (user.roleKey === 'formador') {
        if (filterCard) filterCard.style.display = 'block';
        const formadorUnits = (appState.units || []).filter(u => u.polo === user.school || u.name === user.school).map(u => u.name);
        if (schoolFilterSelect) {
          const userCacheKey = `${user.name}|${user.school}`;
          if (schoolFilterSelect.dataset.populatedFor !== userCacheKey) {
            schoolFilterSelect.innerHTML = '<option value="ALL">Todas as UEs do Polo</option>';
            formadorUnits.forEach(uName => {
              const opt = document.createElement('option');
              opt.value = uName;
              opt.text = uName;
              schoolFilterSelect.appendChild(opt);
            });
            schoolFilterSelect.dataset.populatedFor = userCacheKey;
          }
          targetSchool = schoolFilterSelect.value;
        }
      } else if (isNucleoEI(user)) {
        if (filterCard) filterCard.style.display = 'block';
        if (schoolFilterSelect) {
          if (schoolFilterSelect.dataset.populatedFor !== 'nucleo') {
            schoolFilterSelect.innerHTML = '<option value="ALL">Todas as Unidades Escolares da Rede</option>';
            (appState.units || []).forEach(u => {
              const opt = document.createElement('option');
              opt.value = u.name;
              opt.text = u.name;
              schoolFilterSelect.appendChild(opt);
            });
            schoolFilterSelect.dataset.populatedFor = 'nucleo';
          }
          targetSchool = schoolFilterSelect.value;
        }
      }

      // --- RENDERIZAÇÃO DO PAINEL ANALÍTICO DE CARACTERIZAÇÃO MULTINÍVEL ---
      if (charPanel) {
        const activeViewMode = charPanel.dataset.viewMode || 'aggregated';

        if (user.roleKey === 'coordenador') {
          const agg = getSchoolClassesAggregates(user.school);
          const schoolClasses = agg.classes;
          const selectedClassId = charPanel.dataset.selectedClassId || (schoolClasses[0] ? schoolClasses[0].id : '');
          const currentClass = schoolClasses.find(c => c.id === selectedClassId) || schoolClasses[0];

          let kpiContent = '';
          if (activeViewMode === 'class' && currentClass) {
            const clsTot = typeof currentClass.totalStudents === 'number' ? currentClass.totalStudents : 20;
            const clsInc = typeof currentClass.inclusiveStudents === 'number' ? currentClass.inclusiveStudents : 0;
            const clsReg = Math.max(0, clsTot - clsInc);

            kpiContent = `
              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:10px; margin-top:12px;">
                <div style="background:#FFFFFF; border:1px solid var(--border); border-radius:8px; padding:10px;">
                  <div style="font-size:10px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Alunos na Turma</div>
                  <div style="font-size:18px; font-weight:800; color:#1E40AF; margin-top:2px;">${clsTot}</div>
                  <div style="font-size:10px; color:var(--text-secondary);">Matriculados</div>
                </div>
                <div style="background:#FFFFFF; border:1px solid var(--border); border-radius:8px; padding:10px;">
                  <div style="font-size:10px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Necessidades Especiais</div>
                  <div style="font-size:18px; font-weight:800; color:#059669; margin-top:2px;">${clsInc}</div>
                  <div style="font-size:10px; color:var(--text-secondary);">${clsInc > 0 ? 'Público AEE' : 'Nenhum AEE'}</div>
                </div>
                <div style="background:#FFFFFF; border:1px solid var(--border); border-radius:8px; padding:10px;">
                  <div style="font-size:10px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Alunos Regulares</div>
                  <div style="font-size:18px; font-weight:800; color:#475569; margin-top:2px;">${clsReg}</div>
                  <div style="font-size:10px; color:var(--text-secondary);">Sem necessidade especial</div>
                </div>
                <div style="background:#FFFFFF; border:1px solid var(--border); border-radius:8px; padding:10px;">
                  <div style="font-size:10px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Jornada / Turno</div>
                  <div style="font-size:12px; font-weight:700; color:var(--primary-dark); margin-top:6px;">${currentClass.shift || 'Parcial'}</div>
                  <div style="font-size:10px; color:var(--text-secondary);">${currentClass.stage || 'Educação Infantil'}</div>
                </div>
              </div>
            `;
          } else {
            kpiContent = `
              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:10px; margin-top:12px;">
                <div style="background:#FFFFFF; border:1px solid var(--border); border-radius:8px; padding:10px;">
                  <div style="font-size:10px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Alunos Matriculados</div>
                  <div style="font-size:18px; font-weight:800; color:#1E40AF; margin-top:2px;">${agg.totalStudents}</div>
                  <div style="font-size:10px; color:var(--text-secondary);">Soma das turmas</div>
                </div>
                <div style="background:#FFFFFF; border:1px solid var(--border); border-radius:8px; padding:10px;">
                  <div style="font-size:10px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Educação Inclusiva (AEE)</div>
                  <div style="font-size:18px; font-weight:800; color:#059669; margin-top:2px;">${agg.inclusiveStudents} <span style="font-size:11px; font-weight:600; color:var(--text-secondary);">(${agg.inclusionRate}%)</span></div>
                  <div style="font-size:10px; color:var(--text-secondary);">Necessidades especiais</div>
                </div>
                <div style="background:#FFFFFF; border:1px solid var(--border); border-radius:8px; padding:10px;">
                  <div style="font-size:10px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Alunos Regulares</div>
                  <div style="font-size:18px; font-weight:800; color:#475569; margin-top:2px;">${agg.regularStudents}</div>
                  <div style="font-size:10px; color:var(--text-secondary);">Sem necessidades especiais</div>
                </div>
                <div style="background:#FFFFFF; border:1px solid var(--border); border-radius:8px; padding:10px;">
                  <div style="font-size:10px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Turmas Ativas</div>
                  <div style="font-size:18px; font-weight:800; color:#6D28D9; margin-top:2px;">${agg.totalClasses}</div>
                  <div style="font-size:10px; color:var(--text-secondary);">${agg.teachersCount} docente(s)</div>
                </div>
              </div>
            `;
          }

          charPanel.innerHTML = `
            <div class="card" style="padding:14px; background:#F8FAFC; border:1px solid var(--border);">
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                <div>
                  <strong style="font-size:13px; color:var(--primary-dark);">Caracterização por Turma & Inclusão (AEE) · ${user.school}</strong>
                </div>
                <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                  <div class="btn-group" style="display:inline-flex; border:1px solid var(--border); border-radius:8px; overflow:hidden;">
                    <button class="btn btn-secondary ${activeViewMode === 'aggregated' ? 'active' : ''}" style="font-size:11px; padding:4px 10px; border:none; ${activeViewMode === 'aggregated' ? 'background:var(--primary); color:#FFF;' : ''}" onclick="setClassesCharView('aggregated')">
                      Consolidado da Escola
                    </button>
                    <button class="btn btn-secondary ${activeViewMode === 'class' ? 'active' : ''}" style="font-size:11px; padding:4px 10px; border:none; ${activeViewMode === 'class' ? 'background:var(--primary); color:#FFF;' : ''}" onclick="setClassesCharView('class')">
                      Especificar por Turma
                    </button>
                  </div>
                  ${activeViewMode === 'class' ? `
                    <select class="form-select" style="font-size:11px; padding:4px 8px; width:auto;" onchange="setClassesCharClass(this.value)">
                      ${schoolClasses.map(c => `<option value="${c.id}" ${c.id === (currentClass ? currentClass.id : '') ? 'selected' : ''}>${c.name}</option>`).join('')}
                    </select>
                  ` : ''}
                </div>
              </div>
              ${kpiContent}
            </div>
          `;
        } else if (user.roleKey === 'formador') {
          const poloName = user.school;
          const poloUnits = (appState.units || []).filter(u => u.polo === poloName || u.name === poloName).map(u => u.name);
          const poloAgg = getPoloClassesAggregates(poloName);

          const selectedSchoolName = charPanel.dataset.selectedSchool || (poloUnits[0] || '');
          const schoolAgg = getSchoolClassesAggregates(selectedSchoolName);
          const poloClasses = (appState.classes || []).filter(c => poloUnits.includes(c.school));
          const selectedClassId = charPanel.dataset.selectedClassId || (poloClasses[0] ? poloClasses[0].id : '');
          const currentClass = poloClasses.find(c => c.id === selectedClassId) || poloClasses[0];

          let kpiContent = '';
          if (activeViewMode === 'class' && currentClass) {
            const clsTot = typeof currentClass.totalStudents === 'number' ? currentClass.totalStudents : 20;
            const clsInc = typeof currentClass.inclusiveStudents === 'number' ? currentClass.inclusiveStudents : 0;
            const clsReg = Math.max(0, clsTot - clsInc);

            kpiContent = `
              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:10px; margin-top:12px;">
                <div style="background:#FFFFFF; border:1px solid var(--border); border-radius:8px; padding:10px;">
                  <div style="font-size:10px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Alunos na Turma</div>
                  <div style="font-size:18px; font-weight:800; color:#1E40AF; margin-top:2px;">${clsTot}</div>
                  <div style="font-size:10px; color:var(--text-secondary);">${currentClass.school}</div>
                </div>
                <div style="background:#FFFFFF; border:1px solid var(--border); border-radius:8px; padding:10px;">
                  <div style="font-size:10px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Necessidades Especiais</div>
                  <div style="font-size:18px; font-weight:800; color:#059669; margin-top:2px;">${clsInc}</div>
                  <div style="font-size:10px; color:var(--text-secondary);">${clsInc > 0 ? 'Público AEE' : 'Nenhum AEE'}</div>
                </div>
                <div style="background:#FFFFFF; border:1px solid var(--border); border-radius:8px; padding:10px;">
                  <div style="font-size:10px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Alunos Regulares</div>
                  <div style="font-size:18px; font-weight:800; color:#475569; margin-top:2px;">${clsReg}</div>
                  <div style="font-size:10px; color:var(--text-secondary);">Sem necessidades especiais</div>
                </div>
                <div style="background:#FFFFFF; border:1px solid var(--border); border-radius:8px; padding:10px;">
                  <div style="font-size:10px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Regência / Turno</div>
                  <div style="font-size:12px; font-weight:700; color:var(--primary-dark); margin-top:6px;">${currentClass.shift || 'Parcial'}</div>
                  <div style="font-size:10px; color:var(--text-secondary);">${currentClass.stage || 'Educação Infantil'}</div>
                </div>
              </div>
            `;
          } else if (activeViewMode === 'school') {
            kpiContent = `
              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:10px; margin-top:12px;">
                <div style="background:#FFFFFF; border:1px solid var(--border); border-radius:8px; padding:10px;">
                  <div style="font-size:10px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Alunos na UE</div>
                  <div style="font-size:18px; font-weight:800; color:#1E40AF; margin-top:2px;">${schoolAgg.totalStudents}</div>
                  <div style="font-size:10px; color:var(--text-secondary);">Soma de ${schoolAgg.totalClasses} turmas</div>
                </div>
                <div style="background:#FFFFFF; border:1px solid var(--border); border-radius:8px; padding:10px;">
                  <div style="font-size:10px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Educação Inclusiva (AEE)</div>
                  <div style="font-size:18px; font-weight:800; color:#059669; margin-top:2px;">${schoolAgg.inclusiveStudents} <span style="font-size:11px; font-weight:600; color:var(--text-secondary);">(${schoolAgg.inclusionRate}%)</span></div>
                  <div style="font-size:10px; color:var(--text-secondary);">Alunos com AEE na UE</div>
                </div>
                <div style="background:#FFFFFF; border:1px solid var(--border); border-radius:8px; padding:10px;">
                  <div style="font-size:10px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Alunos Regulares</div>
                  <div style="font-size:18px; font-weight:800; color:#475569; margin-top:2px;">${schoolAgg.regularStudents}</div>
                  <div style="font-size:10px; color:var(--text-secondary);">Sem necessidades especiais</div>
                </div>
                <div style="background:#FFFFFF; border:1px solid var(--border); border-radius:8px; padding:10px;">
                  <div style="font-size:10px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Turmas / Docentes</div>
                  <div style="font-size:18px; font-weight:800; color:#6D28D9; margin-top:2px;">${schoolAgg.totalClasses}</div>
                  <div style="font-size:10px; color:var(--text-secondary);">${schoolAgg.teachersCount} docente(s)</div>
                </div>
              </div>
            `;
          } else {
            // Consolidado do Polo
            kpiContent = `
              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:10px; margin-top:12px;">
                <div style="background:#FFFFFF; border:1px solid var(--border); border-radius:8px; padding:10px;">
                  <div style="font-size:10px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Total de Alunos (Polo)</div>
                  <div style="font-size:18px; font-weight:800; color:#1E40AF; margin-top:2px;">${poloAgg.totalStudents}</div>
                  <div style="font-size:10px; color:var(--text-secondary);">Soma das turmas do polo</div>
                </div>
                <div style="background:#FFFFFF; border:1px solid var(--border); border-radius:8px; padding:10px;">
                  <div style="font-size:10px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Educação Inclusiva (AEE)</div>
                  <div style="font-size:18px; font-weight:800; color:#059669; margin-top:2px;">${poloAgg.inclusiveStudents} <span style="font-size:11px; font-weight:600; color:var(--text-secondary);">(${poloAgg.inclusionRate}%)</span></div>
                  <div style="font-size:10px; color:var(--text-secondary);">Total AEE no Polo</div>
                </div>
                <div style="background:#FFFFFF; border:1px solid var(--border); border-radius:8px; padding:10px;">
                  <div style="font-size:10px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Alunos Regulares</div>
                  <div style="font-size:18px; font-weight:800; color:#475569; margin-top:2px;">${poloAgg.regularStudents}</div>
                  <div style="font-size:10px; color:var(--text-secondary);">Sem necessidades especiais</div>
                </div>
                <div style="background:#FFFFFF; border:1px solid var(--border); border-radius:8px; padding:10px;">
                  <div style="font-size:10px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">UEs / Turmas</div>
                  <div style="font-size:18px; font-weight:800; color:#6D28D9; margin-top:2px;">${poloAgg.totalUnits} <span style="font-size:11px; font-weight:600; color:var(--text-secondary);">(${poloAgg.totalClasses} turmas)</span></div>
                  <div style="font-size:10px; color:var(--text-secondary);">Estrutura do Polo</div>
                </div>
              </div>
            `;
          }

          charPanel.innerHTML = `
            <div class="card" style="padding:14px; background:#F8FAFC; border:1px solid var(--border);">
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                <div>
                  <strong style="font-size:13px; color:var(--primary-dark);">Caracterização Multinível · ${poloName}</strong>
                </div>
                <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                  <div class="btn-group" style="display:inline-flex; border:1px solid var(--border); border-radius:8px; overflow:hidden;">
                    <button class="btn btn-secondary ${activeViewMode === 'aggregated' ? 'active' : ''}" style="font-size:11px; padding:4px 10px; border:none; ${activeViewMode === 'aggregated' ? 'background:var(--primary); color:#FFF;' : ''}" onclick="setClassesCharView('aggregated')">
                      Consolidado do Polo
                    </button>
                    <button class="btn btn-secondary ${activeViewMode === 'school' ? 'active' : ''}" style="font-size:11px; padding:4px 10px; border:none; ${activeViewMode === 'school' ? 'background:var(--primary); color:#FFF;' : ''}" onclick="setClassesCharView('school')">
                      Por Unidade Escolar
                    </button>
                    <button class="btn btn-secondary ${activeViewMode === 'class' ? 'active' : ''}" style="font-size:11px; padding:4px 10px; border:none; ${activeViewMode === 'class' ? 'background:var(--primary); color:#FFF;' : ''}" onclick="setClassesCharView('class')">
                      Especificar por Turma
                    </button>
                  </div>
                  ${activeViewMode === 'school' ? `
                    <select class="form-select" style="font-size:11px; padding:4px 8px; width:auto;" onchange="setClassesCharSchool(this.value)">
                      ${poloUnits.map(u => `<option value="${u}" ${u === selectedSchoolName ? 'selected' : ''}>${u}</option>`).join('')}
                    </select>
                  ` : ''}
                  ${activeViewMode === 'class' ? `
                    <select class="form-select" style="font-size:11px; padding:4px 8px; width:auto;" onchange="setClassesCharClass(this.value)">
                      ${poloClasses.map(c => `<option value="${c.id}" ${c.id === (currentClass ? currentClass.id : '') ? 'selected' : ''}>${c.name} (${c.school})</option>`).join('')}
                    </select>
                  ` : ''}
                </div>
              </div>
              ${kpiContent}
            </div>
          `;
        } else if (isNucleoEI(user)) {
          // Núcleo de EI: Agregado da Rede Municipal / Polo / UE / Turma
          const netAgg = getNetworkClassesAggregates();
          const allPolos = getAllPolosList();
          const selectedPolo = charPanel.dataset.selectedPolo || (allPolos[0] || 'Polo Regional 1 (Norte)');
          const poloAgg = getPoloClassesAggregates(selectedPolo);

          const allUnits = (appState.units || []).map(u => u.name);
          const selectedSchoolName = charPanel.dataset.selectedSchool || (allUnits[0] || '');
          const schoolAgg = getSchoolClassesAggregates(selectedSchoolName);

          const allClasses = appState.classes || [];
          const selectedClassId = charPanel.dataset.selectedClassId || (allClasses[0] ? allClasses[0].id : '');
          const currentClass = allClasses.find(c => c.id === selectedClassId) || allClasses[0];

          let kpiContent = '';
          if (activeViewMode === 'class' && currentClass) {
            const clsTot = typeof currentClass.totalStudents === 'number' ? currentClass.totalStudents : 20;
            const clsInc = typeof currentClass.inclusiveStudents === 'number' ? currentClass.inclusiveStudents : 0;
            const clsReg = Math.max(0, clsTot - clsInc);

            kpiContent = `
              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:10px; margin-top:12px;">
                <div style="background:#FFFFFF; border:1px solid var(--border); border-radius:8px; padding:10px;">
                  <div style="font-size:10px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Alunos na Turma</div>
                  <div style="font-size:18px; font-weight:800; color:#1E40AF; margin-top:2px;">${clsTot}</div>
                  <div style="font-size:10px; color:var(--text-secondary);">${currentClass.school}</div>
                </div>
                <div style="background:#FFFFFF; border:1px solid var(--border); border-radius:8px; padding:10px;">
                  <div style="font-size:10px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Necessidades Especiais</div>
                  <div style="font-size:18px; font-weight:800; color:#059669; margin-top:2px;">${clsInc}</div>
                  <div style="font-size:10px; color:var(--text-secondary);">${clsInc > 0 ? 'Público AEE' : 'Nenhum AEE'}</div>
                </div>
                <div style="background:#FFFFFF; border:1px solid var(--border); border-radius:8px; padding:10px;">
                  <div style="font-size:10px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Alunos Regulares</div>
                  <div style="font-size:18px; font-weight:800; color:#475569; margin-top:2px;">${clsReg}</div>
                  <div style="font-size:10px; color:var(--text-secondary);">Sem necessidades especiais</div>
                </div>
                <div style="background:#FFFFFF; border:1px solid var(--border); border-radius:8px; padding:10px;">
                  <div style="font-size:10px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Regência / Turno</div>
                  <div style="font-size:12px; font-weight:700; color:var(--primary-dark); margin-top:6px;">${currentClass.shift || 'Parcial'}</div>
                  <div style="font-size:10px; color:var(--text-secondary);">${currentClass.stage || 'Educação Infantil'}</div>
                </div>
              </div>
            `;
          } else if (activeViewMode === 'school') {
            kpiContent = `
              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:10px; margin-top:12px;">
                <div style="background:#FFFFFF; border:1px solid var(--border); border-radius:8px; padding:10px;">
                  <div style="font-size:10px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Alunos na UE</div>
                  <div style="font-size:18px; font-weight:800; color:#1E40AF; margin-top:2px;">${schoolAgg.totalStudents}</div>
                  <div style="font-size:10px; color:var(--text-secondary);">Soma de ${schoolAgg.totalClasses} turmas</div>
                </div>
                <div style="background:#FFFFFF; border:1px solid var(--border); border-radius:8px; padding:10px;">
                  <div style="font-size:10px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Educação Inclusiva (AEE)</div>
                  <div style="font-size:18px; font-weight:800; color:#059669; margin-top:2px;">${schoolAgg.inclusiveStudents} <span style="font-size:11px; font-weight:600; color:var(--text-secondary);">(${schoolAgg.inclusionRate}%)</span></div>
                  <div style="font-size:10px; color:var(--text-secondary);">Total AEE na escola</div>
                </div>
                <div style="background:#FFFFFF; border:1px solid var(--border); border-radius:8px; padding:10px;">
                  <div style="font-size:10px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Alunos Regulares</div>
                  <div style="font-size:18px; font-weight:800; color:#475569; margin-top:2px;">${schoolAgg.regularStudents}</div>
                  <div style="font-size:10px; color:var(--text-secondary);">Sem necessidades especiais</div>
                </div>
                <div style="background:#FFFFFF; border:1px solid var(--border); border-radius:8px; padding:10px;">
                  <div style="font-size:10px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Turmas / Docentes</div>
                  <div style="font-size:18px; font-weight:800; color:#6D28D9; margin-top:2px;">${schoolAgg.totalClasses}</div>
                  <div style="font-size:10px; color:var(--text-secondary);">${schoolAgg.teachersCount} docente(s)</div>
                </div>
              </div>
            `;
          } else if (activeViewMode === 'polo') {
            kpiContent = `
              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:10px; margin-top:12px;">
                <div style="background:#FFFFFF; border:1px solid var(--border); border-radius:8px; padding:10px;">
                  <div style="font-size:10px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Alunos no Polo</div>
                  <div style="font-size:18px; font-weight:800; color:#1E40AF; margin-top:2px;">${poloAgg.totalStudents}</div>
                  <div style="font-size:10px; color:var(--text-secondary);">Soma das turmas</div>
                </div>
                <div style="background:#FFFFFF; border:1px solid var(--border); border-radius:8px; padding:10px;">
                  <div style="font-size:10px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Educação Inclusiva (AEE)</div>
                  <div style="font-size:18px; font-weight:800; color:#059669; margin-top:2px;">${poloAgg.inclusiveStudents} <span style="font-size:11px; font-weight:600; color:var(--text-secondary);">(${poloAgg.inclusionRate}%)</span></div>
                  <div style="font-size:10px; color:var(--text-secondary);">Total AEE no Polo</div>
                </div>
                <div style="background:#FFFFFF; border:1px solid var(--border); border-radius:8px; padding:10px;">
                  <div style="font-size:10px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Alunos Regulares</div>
                  <div style="font-size:18px; font-weight:800; color:#475569; margin-top:2px;">${poloAgg.regularStudents}</div>
                  <div style="font-size:10px; color:var(--text-secondary);">Sem necessidades especiais</div>
                </div>
                <div style="background:#FFFFFF; border:1px solid var(--border); border-radius:8px; padding:10px;">
                  <div style="font-size:10px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">UEs / Turmas</div>
                  <div style="font-size:18px; font-weight:800; color:#6D28D9; margin-top:2px;">${poloAgg.totalUnits} <span style="font-size:11px; font-weight:600; color:var(--text-secondary);">(${poloAgg.totalClasses} turmas)</span></div>
                  <div style="font-size:10px; color:var(--text-secondary);">Estrutura do Polo</div>
                </div>
              </div>
            `;
          } else {
            // Agregado da Rede Municipal
            kpiContent = `
              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:10px; margin-top:12px;">
                <div style="background:#FFFFFF; border:1px solid var(--border); border-radius:8px; padding:10px;">
                  <div style="font-size:10px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Total Geral da Rede</div>
                  <div style="font-size:18px; font-weight:800; color:#1E40AF; margin-top:2px;">${netAgg.totalStudents}</div>
                  <div style="font-size:10px; color:var(--text-secondary);">Crianças matriculadas</div>
                </div>
                <div style="background:#FFFFFF; border:1px solid var(--border); border-radius:8px; padding:10px;">
                  <div style="font-size:10px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Educação Inclusiva (AEE)</div>
                  <div style="font-size:18px; font-weight:800; color:#059669; margin-top:2px;">${netAgg.inclusiveStudents} <span style="font-size:11px; font-weight:600; color:var(--text-secondary);">(${netAgg.inclusionRate}%)</span></div>
                  <div style="font-size:10px; color:var(--text-secondary);">Crianças com necessidades especiais</div>
                </div>
                <div style="background:#FFFFFF; border:1px solid var(--border); border-radius:8px; padding:10px;">
                  <div style="font-size:10px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Alunos Regulares</div>
                  <div style="font-size:18px; font-weight:800; color:#475569; margin-top:2px;">${netAgg.regularStudents}</div>
                  <div style="font-size:10px; color:var(--text-secondary);">Sem necessidades especiais</div>
                </div>
                <div style="background:#FFFFFF; border:1px solid var(--border); border-radius:8px; padding:10px;">
                  <div style="font-size:10px; font-weight:700; color:var(--text-secondary); text-transform:uppercase;">Estrutura da Rede</div>
                  <div style="font-size:18px; font-weight:800; color:#6D28D9; margin-top:2px;">${netAgg.totalUnits} UEs <span style="font-size:11px; font-weight:600; color:var(--text-secondary);">(${netAgg.totalClasses} turmas)</span></div>
                  <div style="font-size:10px; color:var(--text-secondary);">Rede Municipal de Patos</div>
                </div>
              </div>
            `;
          }

          charPanel.innerHTML = `
            <div class="card" style="padding:14px; background:#F8FAFC; border:1px solid var(--border);">
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                <div>
                  <strong style="font-size:13px; color:var(--primary-dark);">Caracterização da Educação Infantil · Visão Agregada da Rede</strong>
                </div>
                <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                  <div class="btn-group" style="display:inline-flex; border:1px solid var(--border); border-radius:8px; overflow:hidden;">
                    <button class="btn btn-secondary ${activeViewMode === 'aggregated' ? 'active' : ''}" style="font-size:11px; padding:4px 10px; border:none; ${activeViewMode === 'aggregated' ? 'background:var(--primary); color:#FFF;' : ''}" onclick="setClassesCharView('aggregated')">
                      Agregado da Rede
                    </button>
                    <button class="btn btn-secondary ${activeViewMode === 'polo' ? 'active' : ''}" style="font-size:11px; padding:4px 10px; border:none; ${activeViewMode === 'polo' ? 'background:var(--primary); color:#FFF;' : ''}" onclick="setClassesCharView('polo')">
                      Por Polo
                    </button>
                    <button class="btn btn-secondary ${activeViewMode === 'school' ? 'active' : ''}" style="font-size:11px; padding:4px 10px; border:none; ${activeViewMode === 'school' ? 'background:var(--primary); color:#FFF;' : ''}" onclick="setClassesCharView('school')">
                      Por UE
                    </button>
                    <button class="btn btn-secondary ${activeViewMode === 'class' ? 'active' : ''}" style="font-size:11px; padding:4px 10px; border:none; ${activeViewMode === 'class' ? 'background:var(--primary); color:#FFF;' : ''}" onclick="setClassesCharView('class')">
                      Especificar por Turma
                    </button>
                  </div>
                  ${activeViewMode === 'polo' ? `
                    <select class="form-select" style="font-size:11px; padding:4px 8px; width:auto;" onchange="setClassesCharPolo(this.value)">
                      ${allPolos.map(p => `<option value="${p}" ${p === selectedPolo ? 'selected' : ''}>${p}</option>`).join('')}
                    </select>
                  ` : ''}
                  ${activeViewMode === 'school' ? `
                    <select class="form-select" style="font-size:11px; padding:4px 8px; width:auto;" onchange="setClassesCharSchool(this.value)">
                      ${allUnits.map(u => `<option value="${u}" ${u === selectedSchoolName ? 'selected' : ''}>${u}</option>`).join('')}
                    </select>
                  ` : ''}
                  ${activeViewMode === 'class' ? `
                    <select class="form-select" style="font-size:11px; padding:4px 8px; width:auto;" onchange="setClassesCharClass(this.value)">
                      ${allClasses.map(c => `<option value="${c.id}" ${c.id === (currentClass ? currentClass.id : '') ? 'selected' : ''}>${c.name} (${c.school})</option>`).join('')}
                    </select>
                  ` : ''}
                </div>
              </div>
              ${kpiContent}
            </div>
          `;
        }
      }

      // Obter turmas
      let classesToRender = [];
      if (user.roleKey === 'coordenador') {
        classesToRender = getClassesForSchool(user.school);
      } else if (user.roleKey === 'formador') {
        const formadorUnits = (appState.units || []).filter(u => u.polo === user.school || u.name === user.school).map(u => u.name);
        if (targetSchool === 'ALL') {
          formadorUnits.forEach(uName => {
            classesToRender = classesToRender.concat(getClassesForSchool(uName));
          });
        } else {
          classesToRender = getClassesForSchool(targetSchool);
        }
      } else {
        if (targetSchool === 'ALL') {
          (appState.units || []).forEach(u => {
            classesToRender = classesToRender.concat(getClassesForSchool(u.name));
          });
        } else {
          classesToRender = getClassesForSchool(targetSchool);
        }
      }

      // Deduplicar por id
      const seenIds = new Set();
      classesToRender = classesToRender.filter(c => {
        if (seenIds.has(c.id)) return false;
        seenIds.add(c.id);
        return true;
      });

      if (filterSearch) {
        classesToRender = classesToRender.filter(c => 
          c.name.toLowerCase().includes(filterSearch) || 
          (c.stage && c.stage.toLowerCase().includes(filterSearch)) ||
          (c.school && c.school.toLowerCase().includes(filterSearch)) ||
          (Array.isArray(c.teachers) && c.teachers.some(t => t.toLowerCase().includes(filterSearch)))
        );
      }

      if (classesToRender.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:var(--text-secondary); padding:24px;">Nenhuma turma encontrada. Clique em "+ Cadastrar Nova Turma" para adicionar.</td></tr>`;
        return;
      }

      classesToRender.forEach(cls => {
        const isIntegral = (cls.shift || '').toLowerCase().includes('integral');
        const jornadaBadge = isIntegral 
          ? `<span class="status-badge" style="background:#EDE9FE; color:#6D28D9; font-weight:700;">Tempo Integral</span>`
          : `<span class="status-badge" style="background:#EFF6FF; color:#1E40AF; font-weight:700;">Tempo Parcial</span>`;

        let turnoBadge = `<span class="status-badge" style="background:#FEF3C7; color:#92400E; font-size:11px;">${cls.shift || 'Não definido'}</span>`;
        if (isIntegral) {
          turnoBadge = `<span class="status-badge" style="background:#DCFCE7; color:#166534; font-size:11px;">Manhã + Tarde</span>`;
        }

        const totStudents = typeof cls.totalStudents === 'number' ? cls.totalStudents : 20;
        const incStudents = typeof cls.inclusiveStudents === 'number' ? cls.inclusiveStudents : 0;
        const incBadge = incStudents > 0 
          ? `<span class="status-badge" style="background:#DCFCE7; color:#166534; font-weight:700;">${incStudents} AEE</span>`
          : `<span style="color:var(--text-secondary); font-size:12px;">0</span>`;

        let teachersDisplay = '';
        if (isIntegral && (cls.teachersMorning || cls.teachersAfternoon)) {
          const mList = (cls.teachersMorning && cls.teachersMorning.length > 0) ? cls.teachersMorning.join(', ') : 'A definir';
          const aList = (cls.teachersAfternoon && cls.teachersAfternoon.length > 0) ? cls.teachersAfternoon.join(', ') : 'A definir';
          teachersDisplay = `
            <div style="font-size:11px; line-height:1.4;">
              <div><strong style="color:#B45309;">Manhã:</strong> ${mList}</div>
              <div><strong style="color:#4338CA;">Tarde:</strong> ${aList}</div>
            </div>
          `;
        } else {
          const tList = (Array.isArray(cls.teachers) && cls.teachers.length > 0) ? cls.teachers.join(', ') : '<span style="color:var(--text-secondary); font-style:italic;">Nenhum regente alocado</span>';
          teachersDisplay = `<div style="font-size:12px; font-weight:600; color:#1E293B;">${tList}</div>`;
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>
            <strong style="color:var(--primary-dark); font-size:13px;">${cls.name}</strong><br>
            <span class="status-badge" style="background:#F1F5F9; color:#475569; font-size:10px;">${cls.stage || 'Educação Infantil'}</span>
          </td>
          <td style="font-size:12px;">${cls.school}</td>
          <td style="font-size:13px; font-weight:700; color:#1E40AF;">${totStudents} alunos</td>
          <td>${incBadge}</td>
          <td>${jornadaBadge}</td>
          <td>${turnoBadge}</td>
          <td>${teachersDisplay}</td>
          <td style="text-align:center; white-space:nowrap;">
            <button class="btn btn-secondary" style="padding:4px 8px; font-size:11px; margin-right:4px;" onclick="openEditClassModal('${cls.id}')">Editar</button>
            <button class="btn btn-secondary" style="padding:4px 8px; font-size:11px; color:var(--red);" onclick="deleteClass('${cls.id}')">Excluir</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    function openAddClassModal() {
      const user = getCurrentUser();
      if (isNucleoEI(user)) {
        showToast('Acesso restrito: A coordenadora do Núcleo de EI não gerencia turmas de UEs diretamente. A gestão de turmas é descentralizada na Coordenadora Pedagógica da unidade.');
        return;
      }
      document.getElementById('modalClassEditorTitle').innerText = 'Cadastrar Nova Turma';
      document.getElementById('editClassId').value = '';
      document.getElementById('classEditorName').value = '';
      document.getElementById('classEditorStage').value = 'Infantil I';
      document.getElementById('classEditorShiftType').value = 'parcial';
      document.getElementById('classEditorShiftPeriod').value = 'Tempo Parcial (Matutino)';
      const totInput = document.getElementById('classEditorTotalStudents');
      const incInput = document.getElementById('classEditorInclusiveStudents');
      if (totInput) totInput.value = '25';
      if (incInput) incInput.value = '0';
      document.getElementById('btnDeleteClassEditor').style.display = 'none';

      const schoolSelect = document.getElementById('classEditorSchool');
      const groupSchool = document.getElementById('groupClassSchool');
      schoolSelect.innerHTML = '';

      if (user.roleKey === 'coordenador') {
        if (groupSchool) groupSchool.style.display = 'none';
        const opt = document.createElement('option');
        opt.value = user.school;
        opt.text = user.school;
        schoolSelect.appendChild(opt);
        schoolSelect.value = user.school;
      } else if (user.roleKey === 'formador') {
        if (groupSchool) groupSchool.style.display = 'block';
        const formadorUnits = (appState.units || []).filter(u => u.polo === user.school || u.name === user.school);
        formadorUnits.forEach(u => {
          const opt = document.createElement('option');
          opt.value = u.name;
          opt.text = u.name;
          schoolSelect.appendChild(opt);
        });
      } else {
        if (groupSchool) groupSchool.style.display = 'block';
        (appState.units || []).forEach(u => {
          const opt = document.createElement('option');
          opt.value = u.name;
          opt.text = u.name;
          schoolSelect.appendChild(opt);
        });
      }

      onClassShiftTypeChange();
      populateClassEditorTeachers();
      document.getElementById('modalClassEditor').classList.add('active');
    }

    function openEditClassModal(classId) {
      const user = getCurrentUser();
      if (isNucleoEI(user)) {
        showToast('Acesso restrito: A coordenadora do Núcleo de EI não gerencia turmas de UEs diretamente. A gestão de turmas é descentralizada na Coordenadora Pedagógica da unidade.');
        return;
      }
      const cls = (appState.classes || []).find(c => c.id === classId);
      if (!cls) {
        showToast('Turma não encontrada.');
        return;
      }

      // Restrição estrita de escopo
      if (user.roleKey === 'coordenador' && cls.school !== user.school) {
        showToast('Acesso negado: você só pode gerenciar turmas da sua escola.');
        return;
      }

      document.getElementById('modalClassEditorTitle').innerText = `Editar Turma: ${cls.name}`;
      document.getElementById('editClassId').value = cls.id;
      document.getElementById('classEditorName').value = cls.name;
      document.getElementById('classEditorStage').value = cls.stage || 'Infantil I';
      
      const isIntegral = (cls.shift || '').toLowerCase().includes('integral');
      document.getElementById('classEditorShiftType').value = isIntegral ? 'integral' : 'parcial';
      if (!isIntegral && cls.shift) {
        document.getElementById('classEditorShiftPeriod').value = cls.shift;
      }

      const schoolSelect = document.getElementById('classEditorSchool');
      const groupSchool = document.getElementById('groupClassSchool');
      schoolSelect.innerHTML = '';

      if (user.roleKey === 'coordenador') {
        if (groupSchool) groupSchool.style.display = 'none';
        const opt = document.createElement('option');
        opt.value = user.school;
        opt.text = user.school;
        schoolSelect.appendChild(opt);
        schoolSelect.value = user.school;
      } else if (user.roleKey === 'formador') {
        if (groupSchool) groupSchool.style.display = 'block';
        const formadorUnits = (appState.units || []).filter(u => u.polo === user.school || u.name === user.school);
        formadorUnits.forEach(u => {
          const opt = document.createElement('option');
          opt.value = u.name;
          opt.text = u.name;
          if (u.name === cls.school) opt.selected = true;
          schoolSelect.appendChild(opt);
        });
      } else {
        if (groupSchool) groupSchool.style.display = 'block';
        (appState.units || []).forEach(u => {
          const opt = document.createElement('option');
          opt.value = u.name;
          opt.text = u.name;
          if (u.name === cls.school) opt.selected = true;
          schoolSelect.appendChild(opt);
        });
      }

      onClassShiftTypeChange();
      populateClassEditorTeachers(cls);
      document.getElementById('btnDeleteClassEditor').style.display = 'inline-block';
      document.getElementById('modalClassEditor').classList.add('active');
    }

    function closeClassEditorModal() {
      document.getElementById('modalClassEditor').classList.remove('active');
    }

    function onClassShiftTypeChange() {
      const shiftType = document.getElementById('classEditorShiftType').value;
      const groupShiftDetail = document.getElementById('groupClassShiftDetail');
      const groupTeachersSingle = document.getElementById('groupTeachersSingle');
      const groupTeachersIntegral = document.getElementById('groupTeachersIntegral');

      if (shiftType === 'integral') {
        if (groupShiftDetail) groupShiftDetail.style.display = 'none';
        if (groupTeachersSingle) groupTeachersSingle.style.display = 'none';
        if (groupTeachersIntegral) groupTeachersIntegral.style.display = 'block';
      } else {
        if (groupShiftDetail) groupShiftDetail.style.display = 'block';
        if (groupTeachersSingle) groupTeachersSingle.style.display = 'block';
        if (groupTeachersIntegral) groupTeachersIntegral.style.display = 'none';
      }
    }

    function onClassEditorSchoolChange() {
      populateClassEditorTeachers();
    }

    function populateClassEditorTeachers(existingClass = null) {
      const school = document.getElementById('classEditorSchool').value;
      const teachers = (appState.teamMembers || []).filter(m => m.school === school && m.roleKey === 'professora');

      const singleContainer = document.getElementById('classEditorTeachersList');
      const morningContainer = document.getElementById('classEditorTeachersMorningList');
      const afternoonContainer = document.getElementById('classEditorTeachersAfternoonList');

      if (!singleContainer || !morningContainer || !afternoonContainer) return;

      if (teachers.length === 0) {
        const emptyMsg = '<div style="font-size:12px; color:var(--text-secondary); font-style:italic;">Nenhuma professora cadastrada nesta unidade escolar.</div>';
        singleContainer.innerHTML = emptyMsg;
        morningContainer.innerHTML = emptyMsg;
        afternoonContainer.innerHTML = emptyMsg;
        return;
      }

      // 1. Single Shift Checkboxes
      singleContainer.innerHTML = teachers.map(t => {
        const checked = existingClass && Array.isArray(existingClass.teachers) && existingClass.teachers.includes(t.name) ? 'checked' : '';
        return `
          <label style="display:flex; align-items:center; gap:8px; font-size:13px; cursor:pointer;">
            <input type="checkbox" name="classTeacherSingle" value="${t.name}" ${checked}>
            <span>${t.name}</span>
          </label>
        `;
      }).join('');

      // 2. Morning Shift Checkboxes
      morningContainer.innerHTML = teachers.map(t => {
        const checked = existingClass && Array.isArray(existingClass.teachersMorning) && existingClass.teachersMorning.includes(t.name) ? 'checked' : '';
        return `
          <label style="display:flex; align-items:center; gap:8px; font-size:13px; cursor:pointer;">
            <input type="checkbox" name="classTeacherMorning" value="${t.name}" ${checked}>
            <span>${t.name}</span>
          </label>
        `;
      }).join('');

      // 3. Afternoon Shift Checkboxes
      afternoonContainer.innerHTML = teachers.map(t => {
        const checked = existingClass && Array.isArray(existingClass.teachersAfternoon) && existingClass.teachersAfternoon.includes(t.name) ? 'checked' : '';
        return `
          <label style="display:flex; align-items:center; gap:8px; font-size:13px; cursor:pointer;">
            <input type="checkbox" name="classTeacherAfternoon" value="${t.name}" ${checked}>
            <span>${t.name}</span>
          </label>
        `;
      }).join('');
    }

    function saveClassEditor() {
      const user = getCurrentUser();
      if (isNucleoEI(user)) {
        showToast('Acesso restrito: Apenas a Coordenadora Pedagógica da Unidade Escolar pode cadastrar ou alterar turmas.');
        return;
      }
      const id = document.getElementById('editClassId').value;
      const school = document.getElementById('classEditorSchool').value;
      const name = document.getElementById('classEditorName').value.trim();
      const stage = document.getElementById('classEditorStage').value;
      const shiftType = document.getElementById('classEditorShiftType').value;
      const shiftPeriod = document.getElementById('classEditorShiftPeriod').value;

      if (!name) {
        showToast('Por favor, informe o nome da turma.');
        return;
      }

      let finalShift = 'Tempo Parcial (Matutino)';
      let finalTeachers = [];
      let finalMorning = [];
      let finalAfternoon = [];

      if (shiftType === 'integral') {
        finalShift = 'Tempo Integral';
        document.querySelectorAll('input[name="classTeacherMorning"]:checked').forEach(cb => finalMorning.push(cb.value));
        document.querySelectorAll('input[name="classTeacherAfternoon"]:checked').forEach(cb => finalAfternoon.push(cb.value));
        finalTeachers = Array.from(new Set([...finalMorning, ...finalAfternoon]));
      } else {
        finalShift = shiftPeriod;
        document.querySelectorAll('input[name="classTeacherSingle"]:checked').forEach(cb => finalTeachers.push(cb.value));
      }

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

      if (id) {
        // Modo Edição
        const idx = (appState.classes || []).findIndex(c => c.id === id);
        if (idx === -1) {
          showToast('Turma não encontrada para edição.');
          return;
        }
        const oldName = appState.classes[idx].name;
        appState.classes[idx] = {
          ...appState.classes[idx],
          name,
          school,
          stage,
          shift: finalShift,
          teachers: finalTeachers,
          teachersMorning: finalMorning,
          teachersAfternoon: finalAfternoon
        };

        // Propagação de integridade relacional SSOT se o nome da turma mudou
        if (oldName && oldName !== name) {
          if (Array.isArray(appState.schedules)) {
            appState.schedules.forEach(s => {
              if (s.className === oldName && s.schoolName === school) {
                s.className = name;
                s.targetName = name;
              }
            });
          }
          if (Array.isArray(appState.notes)) {
            appState.notes.forEach(n => {
              if (n.className === oldName && n.schoolName === school) {
                n.className = name;
              }
            });
          }
          if (Array.isArray(appState.observations)) {
            appState.observations.forEach(o => {
              if (o.className === oldName && o.schoolName === school) {
                o.className = name;
              }
            });
          }
        }
        showToast(`Turma "${name}" atualizada com sucesso!`);
      } else {
        // Modo Criação
        const newId = 'cls-' + Date.now();
        const newClass = {
          id: newId,
          name,
          school,
          stage,
          shift: finalShift,
          teachers: finalTeachers,
          teachersMorning: finalMorning,
          teachersAfternoon: finalAfternoon
        };
        if (!appState.classes) appState.classes = [];
        appState.classes.push(newClass);
        showToast(`Turma "${name}" cadastrada com sucesso!`);
      }

      saveState();
      closeClassEditorModal();
      renderClassesScreen();
    }

    function deleteClass(classId) {
      const cls = (appState.classes || []).find(c => c.id === classId);
      if (!cls) return;

      const user = getCurrentUser();
      if (isNucleoEI(user)) {
        showToast('Acesso restrito: Apenas a Coordenadora Pedagógica da Unidade Escolar pode excluir turmas.');
        return;
      }
      if (user.roleKey === 'coordenador' && cls.school !== user.school) {
        showToast('Acesso negado: você só pode excluir turmas da sua escola.');
        return;
      }

      if (!confirm(`Tem certeza que deseja excluir a turma "${cls.name}"? Esta ação removerá a turma do catálogo da unidade.`)) {
        return;
      }

      appState.classes = (appState.classes || []).filter(c => c.id !== classId);
      if (!appState.deletedClassIds) appState.deletedClassIds = [];
      if (!appState.deletedClassIds.includes(classId)) {
        appState.deletedClassIds.push(classId);
      }

      saveState();
      closeClassEditorModal();
      renderClassesScreen();
      showToast(`Turma "${cls.name}" excluída com sucesso!`);
    }

    function deleteClassFromEditor() {
      const id = document.getElementById('editClassId').value;
      if (id) deleteClass(id);
    }

    // Team Management
    function renderTeamScreen() {
      const supSelect = document.getElementById('teamFilterSupervisor');
      if (supSelect && supSelect.options.length <= 1) {
        const sups = Array.from(new Set(appState.teamMembers.map(m => m.supervisor).filter(Boolean)));
        sups.forEach(s => {
          const opt = document.createElement('option');
          opt.value = s;
          opt.text = s;
          supSelect.appendChild(opt);
        });
      }

      const schoolOrPoloSelect = document.getElementById('teamFilterSchoolOrPolo');
      if (schoolOrPoloSelect && schoolOrPoloSelect.options.length <= 1) {
        const distinctLocations = Array.from(new Set(appState.units.map(u => u.name).concat(appState.units.map(u => u.polo))));
        distinctLocations.forEach(loc => {
          const opt = document.createElement('option');
          opt.value = loc;
          opt.text = loc;
          schoolOrPoloSelect.appendChild(opt);
        });
      }

      const tbody = document.getElementById('teamTableBody');
      if (!tbody) return;
      tbody.innerHTML = '';

      const roleFilter = document.getElementById('teamFilterRole')?.value || 'ALL';
      const supervisorFilter = document.getElementById('teamFilterSupervisor')?.value || 'ALL';
      const schoolOrPoloFilter = document.getElementById('teamFilterSchoolOrPolo')?.value || 'ALL';
      const searchQuery = (document.getElementById('teamFilterSearch')?.value || '').trim().toLowerCase();

      let members = appState.teamMembers;
      const user = getCurrentUser();

      if (user.roleKey === 'coordenador') {
        members = members.filter(m => m.school === user.school && m.roleKey === 'professora');
      } else if (user.roleKey === 'formador') {
        const formadorUnits = (appState.units || []).filter(u => u.polo === user.school || u.name === user.school).map(u => u.name);
        members = members.filter(m => m.roleKey === 'coordenador' && formadorUnits.includes(m.school));
      } else {
        if (roleFilter !== 'ALL') {
          if (roleFilter === 'nucleo_ei' || roleFilter === 'tecnico') {
            members = members.filter(m => isNucleoEI(m));
          } else {
            members = members.filter(m => m.roleKey === roleFilter);
          }
        }

        if (supervisorFilter !== 'ALL') {
          members = members.filter(m => {
            let sup = m.supervisor;
            if (m.roleKey === 'professora') {
              const cp = appState.teamMembers.find(c => c.roleKey === 'coordenador' && c.school === m.school);
              if (cp) sup = cp.name;
            }
            return sup === supervisorFilter;
          });
        }

        if (schoolOrPoloFilter !== 'ALL') {
          members = members.filter(m => {
            if (m.roleKey === 'pendente') return true; // Sempre exibe pendentes para facilitar a atribuição pelo admin
            const ue = appState.units.find(u => u.name === m.school);
            const polo = ue ? ue.polo : m.school;
            return m.school === schoolOrPoloFilter || polo === schoolOrPoloFilter;
          });
        }
      }

      if (searchQuery) {
        members = members.filter(m => m.name.toLowerCase().includes(searchQuery) || (m.school && m.school.toLowerCase().includes(searchQuery)));
      }

      if (members.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-secondary); padding:20px;">Nenhum profissional encontrado com os filtros selecionados.</td></tr>`;
        return;
      }

      members.forEach((m) => {
        const ue = appState.units.find(u => u.name === m.school);
        const poloName = ue ? ue.polo : (m.roleKey === 'formador' ? m.school : 'Polo Municipal');

        let supervisorDisplay = m.supervisor || 'Gestão Geral';
        if (m.roleKey === 'professora') {
          const cp = appState.teamMembers.find(c => c.roleKey === 'coordenador' && c.school === m.school);
          if (cp) {
            supervisorDisplay = cp.name;
          }
        }

        const tr = document.createElement('tr');
        let memberEmail = m.email;
        if (!memberEmail && m.roleKey !== 'professora') {
          const dbKey = Object.keys(USERS_DB).find(k => k === m.id || USERS_DB[k].id === m.id || (USERS_DB[k].name && USERS_DB[k].name.toLowerCase() === m.name.toLowerCase()));
          if (dbKey && USERS_DB[dbKey] && USERS_DB[dbKey].email) {
            memberEmail = USERS_DB[dbKey].email;
            m.email = memberEmail;
          }
        }
        const emailSubtitle = (m.roleKey === 'professora')
          ? ''
          : `<br><span style="font-size:11px; color:var(--text-secondary);">${memberEmail ? `✉️ ${memberEmail}` : 'Sem e-mail vinculado'}</span>`;
        
        tr.innerHTML = `
          <td>
            <strong>${m.name}</strong>${emailSubtitle}
          </td>
          <td><span style="font-size:12px; font-weight:700; color:var(--primary);">${m.roleTitle}</span></td>
          <td>${m.school || 'Rede Municipal'}</td>
          <td><span class="status-badge" style="background:#F1F5F9; color:#475569; font-size:11px;">${poloName}</span></td>
          <td>${supervisorDisplay}</td>
          <td style="text-align:center;">
            <button class="btn btn-secondary" style="color:var(--primary); padding:4px 8px; font-size:11px;" onclick="openEditMemberModal('${m.id}')">
              Editar
            </button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    // =========================================================================
    // SINCRONIZADOR UNIVERSAL DE AUTENTICAÇÃO E SSOT (USERS_DB & customUsers)
    // =========================================================================
    // Sincronizador Bidirecional entre SSOT (teamMembers) e Autenticação (USERS_DB / customUsers)
    function syncUserToAuthDb(member) {
      if (!member || member.roleKey === 'professora') return; // Docentes não acessam o sistema
      const dbKey = (typeof findUserDbKey === 'function' ? findUserDbKey(member.id) || findUserDbKey(member.name) || findUserDbKey(member.email) : null) || member.id;
      
      if (!USERS_DB[dbKey]) {
        USERS_DB[dbKey] = {
          id: dbKey,
          name: member.name,
          roleKey: member.roleKey,
          roleTitle: member.roleTitle,
          school: member.school,
          supervisor: member.supervisor,
          email: member.email || `${dbKey}@teste.com`,
          password: '123456',
          avatarText: member.name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
        };
      } else {
        USERS_DB[dbKey].name = member.name;
        USERS_DB[dbKey].roleKey = member.roleKey;
        USERS_DB[dbKey].roleTitle = member.roleTitle;
        USERS_DB[dbKey].school = member.school;
        USERS_DB[dbKey].supervisor = member.supervisor;
        if (member.email) USERS_DB[dbKey].email = member.email;
      }

      if (!appState.customUsers) appState.customUsers = {};
      appState.customUsers[dbKey] = { ...USERS_DB[dbKey] };
    }

    // =========================================================================
    // GESTÃO DE PROFESSORES (SEM LOGIN, SEM COLETA DE E-MAIL, ESCRITA NA SSOT)
    // =========================================================================
    function openAddTeacherModal() {
      const user = getCurrentUser();
      const modalTitle = document.getElementById('modalAddTeacherTitle');
      const grpSchool = document.getElementById('groupNewTeacherSchool');
      const schoolSelect = document.getElementById('newTeacherSchool');
      const grpSup = document.getElementById('groupNewTeacherSupervisor');
      const btnSave = document.getElementById('btnSaveTeacher');

      document.getElementById('newTeacherName').value = '';
      schoolSelect.innerHTML = '';

      if (user.roleKey === 'coordenador') {
        if (modalTitle) modalTitle.innerText = `Cadastrar Docente · ${user.school}`;
        if (btnSave) btnSave.innerText = 'Salvar Docente';
        schoolSelect.innerHTML = `<option value="${user.school}">${user.school}</option>`;
        schoolSelect.value = user.school;
        schoolSelect.disabled = true;
        if (grpSchool) grpSchool.style.display = 'none';
        if (grpSup) grpSup.style.display = 'none';
      } else if (user.roleKey === 'formador') {
        if (modalTitle) modalTitle.innerText = 'Cadastrar Novo Professor no Polo';
        if (btnSave) btnSave.innerText = 'Salvar Professor';
        const formadorUnits = (appState.units || []).filter(u => u.polo === user.school || u.name === user.school);
        formadorUnits.forEach(u => {
          const opt = document.createElement('option');
          opt.value = u.name;
          opt.text = u.name;
          schoolSelect.appendChild(opt);
        });
        schoolSelect.disabled = false;
        if (grpSchool) grpSchool.style.display = 'block';
        if (grpSup) grpSup.style.display = 'block';
        onNewTeacherSchoolChange();
      } else {
        // Helena / Núcleo de EI / Admin
        if (modalTitle) modalTitle.innerText = 'Cadastrar Novo Professor na Rede';
        if (btnSave) btnSave.innerText = 'Salvar Professor';
        (appState.units || []).forEach(u => {
          const opt = document.createElement('option');
          opt.value = u.name;
          opt.text = u.name;
          schoolSelect.appendChild(opt);
        });
        schoolSelect.disabled = false;
        if (grpSchool) grpSchool.style.display = 'block';
        if (grpSup) grpSup.style.display = 'block';
        onNewTeacherSchoolChange();
      }

      document.getElementById('modalAddTeacher').classList.add('active');
    }

    function closeAddTeacherModal() {
      const modal = document.getElementById('modalAddTeacher');
      if (modal) modal.classList.remove('active');
    }

    function onNewTeacherSchoolChange() {
      const schoolSelect = document.getElementById('newTeacherSchool');
      const supDisplay = document.getElementById('newTeacherSupervisorDisplay');
      if (!schoolSelect || !supDisplay) return;

      const selSchool = schoolSelect.value;
      const cp = (appState.teamMembers || []).find(m => m.roleKey === 'coordenador' && m.school === selSchool);
      supDisplay.value = cp ? `${cp.name} (Coordenação Pedagógica da Unidade)` : 'Coordenação Pedagógica da Unidade';
    }

    function saveNewTeacher() {
      const user = getCurrentUser();
      const nameInput = document.getElementById('newTeacherName');
      const name = (nameInput ? nameInput.value : '').trim();
      const schoolSelect = document.getElementById('newTeacherSchool');
      
      if (!name) {
        showToast('Por favor, informe o nome completo do professor.');
        return;
      }

      const school = (user.roleKey === 'coordenador') ? user.school : (schoolSelect ? schoolSelect.value : '');
      if (!school) {
        showToast('Por favor, selecione a Unidade Escolar do docente.');
        return;
      }

      let supervisor = '';
      if (user.roleKey === 'coordenador') {
        supervisor = user.name;
      } else {
        const cp = (appState.teamMembers || []).find(m => m.roleKey === 'coordenador' && m.school === school);
        supervisor = cp ? cp.name : 'Coordenação Pedagógica da Unidade';
      }

      const newId = 'usr-' + Date.now();
      const newTeacher = {
        id: newId,
        name: name,
        roleKey: 'professora',
        roleTitle: 'Professora',
        school: school,
        supervisor: supervisor,
        email: '',
        password: '',
        avatarText: name.substring(0, 2).toUpperCase(),
        mustChangePassword: false
      };

      if (!Array.isArray(appState.teamMembers)) appState.teamMembers = [];
      appState.teamMembers.push(newTeacher);

      // Docentes não acessam o sistema: não sincronizar em USERS_DB nem em customUsers
      saveState();
      closeAddTeacherModal();
      renderTeamScreen();
      showToast(user.roleKey === 'coordenador' ? 'Docente cadastrada com sucesso!' : 'Professor cadastrado com sucesso!');
    }

    // =========================================================================
    // GESTÃO DE USUÁRIOS DA PLATAFORMA (COM LOGIN, SENHA E BASE DE AUTENTICAÇÃO)
    // =========================================================================
    function openAddUserModal() {
      const user = getCurrentUser();
      const modalTitle = document.getElementById('modalAddUserTitle');
      const roleSelect = document.getElementById('newUserRole');

      document.getElementById('newUserName').value = '';
      document.getElementById('newUserEmail').value = '';
      document.getElementById('newUserPassword').value = '';

      if (user.roleKey === 'formador') {
        if (modalTitle) modalTitle.innerText = `Cadastrar Coordenadora · ${user.school}`;
        roleSelect.value = 'coordenador';
        roleSelect.disabled = true;
      } else {
        if (modalTitle) modalTitle.innerText = 'Cadastrar Novo Usuário da Plataforma';
        roleSelect.disabled = false;
        roleSelect.value = 'coordenador';
      }

      onNewUserRoleChange();
      document.getElementById('modalAddUser').classList.add('active');
    }

    function closeAddUserModal() {
      const modal = document.getElementById('modalAddUser');
      if (modal) modal.classList.remove('active');
    }

    function onNewUserRoleChange() {
      const user = getCurrentUser();
      const role = document.getElementById('newUserRole').value;
      const schoolGroup = document.getElementById('groupNewUserSchool');
      const schoolSelect = document.getElementById('newUserSchool');
      const schoolLabel = document.getElementById('newUserSchoolLabel');
      const supLabel = document.getElementById('newUserSupervisorLabel');
      const supSelect = document.getElementById('newUserSupervisor');

      supSelect.innerHTML = '';
      schoolSelect.innerHTML = '';

      if (role === 'coordenador') {
        if (schoolGroup) schoolGroup.style.display = 'block';
        if (schoolLabel) schoolLabel.innerText = 'Unidade Escolar';
        if (supLabel) supLabel.innerText = 'Formadora Responsável';
        supSelect.disabled = false;

        if (user.roleKey === 'formador') {
          const formadorUnits = (appState.units || []).filter(u => u.polo === user.school || u.name === user.school);
          formadorUnits.forEach(u => {
            const opt = document.createElement('option');
            opt.value = u.name; opt.text = u.name;
            schoolSelect.appendChild(opt);
          });
          supSelect.innerHTML = `<option value="${user.name}">${user.name} (Formadora do Polo)</option>`;
          supSelect.disabled = true;
        } else {
          (appState.units || []).forEach(u => {
            const opt = document.createElement('option');
            opt.value = u.name; opt.text = u.name;
            schoolSelect.appendChild(opt);
          });
          const formadores = (appState.teamMembers || []).filter(m => m.roleKey === 'formador');
          if (formadores.length > 0) {
            formadores.forEach(f => {
              const opt = document.createElement('option');
              opt.value = f.name; opt.text = `${f.name} (${f.school})`;
              supSelect.appendChild(opt);
            });
          } else {
            supSelect.innerHTML = `<option value="Helena Martins">Helena Martins (Núcleo de EI)</option>`;
          }
        }
      } else if (role === 'formador') {
        if (schoolGroup) schoolGroup.style.display = 'block';
        if (schoolLabel) schoolLabel.innerText = 'Polo Regional / Vinculação';
        if (supLabel) supLabel.innerText = 'Supervisão Institucional';
        supSelect.disabled = true;
        supSelect.innerHTML = `<option value="Helena Martins">Helena Martins (Coordenadora do Núcleo de EI)</option>`;

        const polos = getAllPolosList();
        polos.forEach(p => {
          const opt = document.createElement('option');
          opt.value = p; opt.text = p;
          schoolSelect.appendChild(opt);
        });
      } else if (isNucleoEI(role)) {
        if (schoolGroup) schoolGroup.style.display = 'none';
        if (supLabel) supLabel.innerText = 'Supervisão Institucional';
        supSelect.disabled = true;
        supSelect.innerHTML = `<option value="Sede / Gestão Geral">Sede / Gestão Geral</option>`;
      } else if (role === 'pendente') {
        if (schoolGroup) schoolGroup.style.display = 'none';
        if (supLabel) supLabel.innerText = 'Supervisão Institucional';
        supSelect.disabled = true;
        supSelect.innerHTML = `<option value="Aguardando Definição">Aguardando Definição</option>`;
      }
    }

    function onNewUserSchoolChange() {
      const role = document.getElementById('newUserRole').value;
      if (role === 'coordenador') {
        const schoolVal = document.getElementById('newUserSchool').value;
        const unitObj = (appState.units || []).find(u => u.name === schoolVal);
        if (unitObj) {
          const formadora = (appState.teamMembers || []).find(m => m.roleKey === 'formador' && m.school === unitObj.polo);
          const supSelect = document.getElementById('newUserSupervisor');
          if (formadora && supSelect && !supSelect.disabled) {
            supSelect.value = formadora.name;
          }
        }
      }
    }

    function saveNewUser() {
      const user = getCurrentUser();
      const name = (document.getElementById('newUserName')?.value || '').trim();
      const email = (document.getElementById('newUserEmail')?.value || '').trim().toLowerCase();
      const password = document.getElementById('newUserPassword')?.value || '';
      const roleKey = document.getElementById('newUserRole').value;
      const school = document.getElementById('newUserSchool')?.value || '';
      const supervisor = document.getElementById('newUserSupervisor')?.value || '';

      if (!name) {
        showToast('Por favor, informe o nome completo do usuário.');
        return;
      }
      if (!email || !email.includes('@')) {
        showToast('Por favor, informe um e-mail válido para login.');
        return;
      }
      if (!password) {
        showToast('Por favor, informe uma senha provisória.');
        return;
      }

      let roleTitle = 'Coordenadora Pedagógica';
      if (roleKey === 'formador') roleTitle = 'Formadora Pedagógica';
      if (isNucleoEI(roleKey)) roleTitle = 'Coordenadora do Núcleo de EI';
      if (roleKey === 'pendente') roleTitle = 'Acesso Pendente';

      const schoolVal = isNucleoEI(roleKey) ? 'Sede / Gestão Geral' : ((roleKey === 'pendente') ? 'Aguardando Definição' : school);
      const supVal = (roleKey === 'pendente') ? 'Aguardando Definição' : (supervisor || 'Helena Martins');

      const newId = 'usr-' + Date.now();
      const newUser = {
        id: newId,
        name,
        roleKey,
        roleTitle,
        school: schoolVal,
        supervisor: supVal,
        email,
        password,
        avatarText: name.substring(0, 2).toUpperCase(),
        mustChangePassword: true
      };

      if (!Array.isArray(appState.teamMembers)) appState.teamMembers = [];
      appState.teamMembers.push(newUser);

      // Sincronização na base de autenticação (SSOT)
      if (!appState.customUsers) appState.customUsers = {};
      appState.customUsers[newId] = newUser;
      USERS_DB[newId] = newUser;

      saveState();
      closeAddUserModal();
      renderTeamScreen();
      showToast('Usuário cadastrado com sucesso!');
    }

    // Aliases para retrocompatibilidade
    function openAddMemberModal() { openAddTeacherModal(); }
    function closeAddMemberModal() { closeAddTeacherModal(); closeAddUserModal(); }
    function saveNewTeamMember() { saveNewTeacher(); }

    function openEditMemberModal(id) {
      const user = getCurrentUser();
      const member = appState.teamMembers.find(m => m.id === id);
      if (!member) return;

      // Scoping RBAC check:
      if (user.roleKey === 'coordenador') {
        if (member.roleKey !== 'professora' || member.school !== user.school) {
          showToast('Permissão restrita: você só pode editar docentes da sua própria unidade escolar.');
          return;
        }
      } else if (user.roleKey === 'formador') {
        const poloUnits = (appState.units || []).filter(u => u.polo === user.school || u.name === user.school).map(u => u.name);
        if (member.roleKey !== 'coordenador' || !poloUnits.includes(member.school)) {
          showToast('Permissão restrita: você só pode editar coordenadoras vinculadas ao seu polo regional.');
          return;
        }
      }

      const modalTitle = document.getElementById('modalEditMemberTitle');
      const grpEmail = document.getElementById('groupEditMemberEmail');
      const grpRole = document.getElementById('groupEditMemberRole');
      const grpSchool = document.getElementById('groupEditMemberSchool');
      const grpSup = document.getElementById('groupEditMemberSupervisor');
      const delBtn = document.getElementById('btnDeleteMember');

      document.getElementById('editMemberId').value = member.id;
      document.getElementById('editMemberName').value = member.name;
      if (document.getElementById('editMemberEmail')) {
        let emailVal = member.email || '';
        if (!emailVal) {
          const dbKey = Object.keys(USERS_DB).find(k => k === id || USERS_DB[k].id === id || (USERS_DB[k].name && USERS_DB[k].name.toLowerCase() === member.name.toLowerCase()));
          if (dbKey && USERS_DB[dbKey] && USERS_DB[dbKey].email) {
            emailVal = USERS_DB[dbKey].email;
            member.email = emailVal;
          }
        }
        document.getElementById('editMemberEmail').value = emailVal;
      }
      
      const roleSelect = document.getElementById('editMemberRole');
      roleSelect.value = member.roleKey;

      if (user.roleKey === 'coordenador' || member.roleKey === 'professora') {
        if (modalTitle) modalTitle.innerText = `Editar Docente · ${member.school}`;
        if (delBtn) delBtn.innerText = 'Excluir Docente';
        if (grpEmail) grpEmail.style.display = 'none';
        if (grpRole) grpRole.style.display = 'none';
        if (grpSchool) grpSchool.style.display = 'none';
        if (grpSup) grpSup.style.display = 'none';
        roleSelect.disabled = true;
      } else {
        if (modalTitle) modalTitle.innerText = 'Editar Profissional';
        if (delBtn) delBtn.innerText = 'Excluir Profissional';
        if (grpEmail) grpEmail.style.display = 'block';
        if (grpRole) grpRole.style.display = 'block';
        if (grpSchool) grpSchool.style.display = 'block';
        if (grpSup) grpSup.style.display = 'block';
        if (user.roleKey === 'formador') {
          roleSelect.disabled = true;
        } else {
          roleSelect.disabled = false;
        }
      }
      
      const schoolSelect = document.getElementById('editMemberSchool');
      // Setamos um option temporario para o onRoleChange preservar
      if (!isNucleoEI(member.roleKey) && member.roleKey !== 'pendente') {
        schoolSelect.innerHTML = `<option value="${member.school}">${member.school}</option>`;
        schoolSelect.value = member.school;
      }

      onEditMemberRoleChange(member.supervisor);
      
      document.getElementById('modalEditMember').classList.add('active');
    }

    function closeEditMemberModal() {
      document.getElementById('modalEditMember').classList.remove('active');
    }

    function onEditMemberRoleChange(currentSupervisor) {
      const user = getCurrentUser();
      const role = document.getElementById('editMemberRole').value;
      const schoolGroup = document.getElementById('groupEditMemberSchool');
      const schoolSelect = document.getElementById('editMemberSchool');
      const schoolLabel = document.querySelector('#groupEditMemberSchool .form-label');
      const supLabel = document.getElementById('editMemberSupervisorLabel');
      const supSelect = document.getElementById('editMemberSupervisor');
      
      supSelect.innerHTML = '';
      
      const currentSchoolVal = schoolSelect.value;
      schoolSelect.innerHTML = '';

      if (user.roleKey === 'coordenador') {
        schoolSelect.innerHTML = `<option value="${user.school}">${user.school}</option>`;
        schoolSelect.value = user.school;
        schoolSelect.disabled = true;
        if (schoolGroup) schoolGroup.style.display = 'none';
        if (document.getElementById('groupEditMemberEmail')) document.getElementById('groupEditMemberEmail').style.display = 'none';
        if (document.getElementById('groupEditMemberRole')) document.getElementById('groupEditMemberRole').style.display = 'none';
        if (document.getElementById('groupEditMemberSupervisor')) document.getElementById('groupEditMemberSupervisor').style.display = 'none';
      } else if (user.roleKey === 'formador') {
        const formadorUnits = (appState.units || []).filter(u => u.polo === user.school || u.name === user.school);
        formadorUnits.forEach(u => {
          const opt = document.createElement('option');
          opt.value = u.name; opt.text = u.name;
          schoolSelect.appendChild(opt);
        });
        schoolSelect.disabled = false;
        if (schoolGroup) schoolGroup.style.display = 'block';
      } else {
        schoolSelect.disabled = false;
        if (schoolGroup) schoolGroup.style.display = 'block';
        if (role === 'formador') {
          const polos = getAllPolosList();
          polos.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p; opt.text = p;
            schoolSelect.appendChild(opt);
          });
        } else {
          appState.units.forEach(u => {
            const opt = document.createElement('option');
            opt.value = u.name; opt.text = u.name;
            schoolSelect.appendChild(opt);
          });
        }
      }
      
      // Preserve choice if it still exists
      if(Array.from(schoolSelect.options).some(o => o.value === currentSchoolVal)){
          schoolSelect.value = currentSchoolVal;
      }

      if (role === 'professora') {
        if (user.roleKey !== 'coordenador') {
          if (schoolGroup) schoolGroup.style.display = 'block';
          if(schoolLabel) schoolLabel.innerText = 'Unidade Escolar';
          if (supLabel) supLabel.innerText = 'Coordenadora Pedagógica Vinculada (Automática)';
          supSelect.disabled = true;
          
          const selSchool = schoolSelect.value;
          const cp = appState.teamMembers.find(m => m.roleKey === 'coordenador' && m.school === selSchool);
          if (cp) {
            supSelect.innerHTML = `<option value="${cp.name}">${cp.name} (CP da Unidade)</option>`;
          } else {
            supSelect.innerHTML = `<option value="">Vinculação Automática pela Unidade</option>`;
          }
        }
      } else if (role === 'coordenador') {
        if (schoolGroup) schoolGroup.style.display = 'block';
        if(schoolLabel) schoolLabel.innerText = 'Unidade Escolar';
        if (supLabel) supLabel.innerText = 'Formadora Responsável';
        if (user.roleKey === 'formador') {
          supSelect.disabled = true;
          supSelect.innerHTML = `<option value="${user.name}">${user.name} (${user.school})</option>`;
        } else {
          supSelect.disabled = false;
          const formadores = appState.teamMembers.filter(m => m.roleKey === 'formador');
          if (formadores.length > 0) {
            formadores.forEach(f => {
              const opt = document.createElement('option');
              opt.value = f.name;
              opt.text = `${f.name} (${f.school})`;
              supSelect.appendChild(opt);
            });
          } else {
            supSelect.innerHTML = `<option value="">Sem formadoras cadastradas</option>`;
          }
          if (typeof currentSupervisor === 'string' && currentSupervisor) supSelect.value = currentSupervisor;
        }
      } else if (role === 'formador') {
        if (schoolGroup) schoolGroup.style.display = 'block';
        if(schoolLabel) schoolLabel.innerText = 'Polo Regional / Vinculação';
        if (supLabel) supLabel.innerText = 'Supervisão Institucional';
        supSelect.disabled = false;
        supSelect.innerHTML = `
          <option value="Helena Martins">Helena Martins (Coordenadora do Núcleo de EI / Secretaria)</option>
        `;
        if (typeof currentSupervisor === 'string' && currentSupervisor) supSelect.value = currentSupervisor;
      } else if (isNucleoEI(role)) {
        if (schoolGroup) schoolGroup.style.display = 'none';
        if (supLabel) supLabel.innerText = 'Supervisão Institucional';
        supSelect.disabled = true;
        supSelect.innerHTML = `
          <option value="Sede / Gestão Geral">Sede / Gestão Geral</option>
        `;
      } else if (role === 'pendente') {
        if (schoolGroup) schoolGroup.style.display = 'none';
        if (supLabel) supLabel.innerText = 'Supervisão Institucional';
        supSelect.disabled = true;
        const ruleNote = document.getElementById('groupEditMemberRuleNote');
        if (ruleNote) ruleNote.style.display = 'none';
        supSelect.innerHTML = `
          <option value="Aguardando Definição">Aguardando Definição</option>
        `;
      }
    }

    function saveEditTeamMember() {
      const user = getCurrentUser();
      const id = document.getElementById('editMemberId').value;
      const name = document.getElementById('editMemberName').value.trim();
      const roleKey = document.getElementById('editMemberRole').value;
      let emailVal = '';
      if (document.getElementById('editMemberEmail')) {
        emailVal = document.getElementById('editMemberEmail').value.trim().toLowerCase();
      }
      const school = document.getElementById('editMemberSchool').value;
      let supervisor = document.getElementById('editMemberSupervisor').value;

      if (!name) {
        showToast('Por favor, informe o nome do profissional.');
        return;
      }

      // Validação de Escopo / RBAC
      if (user.roleKey === 'coordenador') {
        if (roleKey !== 'professora' || school !== user.school) {
          showToast('Permissão restrita: você só pode gerenciar docentes da sua própria unidade escolar.');
          return;
        }
      } else if (user.roleKey === 'formador') {
        const poloUnits = (appState.units || []).filter(u => u.polo === user.school || u.name === user.school).map(u => u.name);
        if (roleKey !== 'coordenador' || !poloUnits.includes(school)) {
          showToast('Permissão restrita: você só pode gerenciar coordenadoras do seu polo regional.');
          return;
        }
      }

      if (!confirm('Tem certeza que deseja salvar as alterações neste profissional?')) {
        return;
      }

      let roleTitle = 'Professora';
      if (roleKey === 'coordenador') roleTitle = 'Coordenadora Pedagógica';
      if (roleKey === 'formador') roleTitle = 'Formadora Pedagógica';
      if (isNucleoEI(roleKey)) roleTitle = 'Coordenadora do Núcleo de EI';
      if (roleKey === 'pendente') roleTitle = 'Acesso Pendente';

      const memberIndex = appState.teamMembers.findIndex(m => m.id === id);
      if (memberIndex === -1) {
        showToast('Profissional não encontrado.');
        return;
      }

      const oldMember = { ...appState.teamMembers[memberIndex] };
      const oldSchool = oldMember.school;
      const oldName = oldMember.name;
      const oldRole = oldMember.roleKey;

      // 1. Resolução de Supervisor para o próprio profissional
      if (roleKey === 'professora') {
        const cp = appState.teamMembers.find(m => m.id !== id && m.roleKey === 'coordenador' && m.school === school);
        supervisor = cp ? cp.name : 'Coordenação Pedagógica da Unidade';
      } else if (roleKey === 'coordenador') {
        const unitObj = (appState.units || []).find(u => u.name === school);
        const unitPolo = unitObj ? unitObj.polo : null;
        const formadora = appState.teamMembers.find(m => m.roleKey === 'formador' && m.school === unitPolo);
        if (formadora) {
          supervisor = formadora.name;
        } else if (!supervisor) {
          supervisor = 'Helena Martins';
        }
      }

      const schoolVal = ((isNucleoEI(roleKey)) ? 'Sede / Gestão Geral' : ((roleKey === 'pendente') ? 'Aguardando Definição' : school));
      const supVal = (roleKey === 'pendente') ? 'Aguardando Definição' : (supervisor || 'Helena Martins');

      // Se for docente, ela não acessa o sistema (sem credenciais de login)
      if (roleKey === 'professora') {
        emailVal = '';
      } else if (!emailVal && oldMember.email) {
        emailVal = oldMember.email;
      }

      // 2. Atualiza os dados do próprio profissional
      appState.teamMembers[memberIndex] = {
        ...appState.teamMembers[memberIndex],
        name,
        roleKey,
        roleTitle,
        school: schoolVal,
        supervisor: supVal,
        email: emailVal
      };

      // 3. Sincronização com USERS_DB e customUsers apenas para usuários com login (não docentes)
      let dbKey = null;
      if (roleKey !== 'professora') {
        dbKey = (typeof findUserDbKey === 'function' ? findUserDbKey(id) || findUserDbKey(oldName) || findUserDbKey(emailVal) : null) || id;
        syncUserToAuthDb(appState.teamMembers[memberIndex]);
      }

      // 4. PROPAGAÇÃO RELACIONAL AO MUDAR DE UNIDADE ESCOLAR / POLO
      const unitChanged = (oldSchool !== schoolVal);
      const nameChanged = (oldName !== name);

      if (unitChanged || nameChanged) {
        // A. Se for COORDENADORA que mudou de unidade escolar
        if (oldRole === 'coordenador' || roleKey === 'coordenador') {
          if (unitChanged) {
            // Vincula automaticamente à formadora do polo da nova UE
            const targetUnit = (appState.units || []).find(u => u.name === schoolVal);
            if (targetUnit && targetUnit.polo) {
              const targetFormadora = (appState.teamMembers || []).find(m => m.roleKey === 'formador' && m.school === targetUnit.polo);
              if (targetFormadora) {
                appState.teamMembers[memberIndex].supervisor = targetFormadora.name;
                syncUserToAuthDb(appState.teamMembers[memberIndex]);
              }
            }

            // Garante que a nova UE tenha suas turmas catalogadas na SSOT
            getClassesForSchool(schoolVal);

            // Docentes da unidade antiga: desvincula da coordenadora que saiu
            const remainingCpOldSchool = appState.teamMembers.find(m => 
              m.id !== id && m.roleKey === 'coordenador' && m.school === oldSchool
            );
            const fallbackSupOldSchool = remainingCpOldSchool ? remainingCpOldSchool.name : 'Coordenação Pedagógica da Unidade';

            appState.teamMembers.forEach(m => {
              if (m.roleKey === 'professora' && m.school === oldSchool && m.supervisor === oldName) {
                m.supervisor = fallbackSupOldSchool;
              }
            });

            // Docentes da nova unidade: vincula à coordenadora recém-chegada
            appState.teamMembers.forEach(m => {
              if (m.roleKey === 'professora' && m.school === schoolVal) {
                m.supervisor = name;
              }
            });
          } else if (nameChanged) {
            appState.teamMembers.forEach(m => {
              if (m.supervisor === oldName) {
                m.supervisor = name;
              }
            });
          }
        }

        // B. Se for FORMADORA que mudou de polo regional
        if (oldRole === 'formador' || roleKey === 'formador') {
          if (unitChanged) {
            const oldPoloUnits = (appState.units || []).filter(u => u.polo === oldSchool).map(u => u.name);
            const newPoloUnits = (appState.units || []).filter(u => u.polo === schoolVal).map(u => u.name);

            // Coordenadoras do polo antigo são desvinculadas
            appState.teamMembers.forEach(m => {
              if (m.roleKey === 'coordenador' && oldPoloUnits.includes(m.school) && m.supervisor === oldName) {
                m.supervisor = 'Helena Martins';
              }
            });

            // Coordenadoras do novo polo passam a ser supervisionadas por esta formadora
            appState.teamMembers.forEach(m => {
              if (m.roleKey === 'coordenador' && newPoloUnits.includes(m.school)) {
                m.supervisor = name;
              }
            });
          } else if (nameChanged) {
            appState.teamMembers.forEach(m => {
              if (m.supervisor === oldName) {
                m.supervisor = name;
              }
            });
          }
        }

        // C. Se for PROFESSORA que mudou de unidade escolar
        if (oldRole === 'professora' && unitChanged) {
          // Atualiza agendamentos futuros não realizados para a nova unidade
          if (Array.isArray(appState.schedules)) {
            appState.schedules.forEach(s => {
              if (s.targetName === oldName && s.status !== 'realizado' && !s.archived) {
                s.schoolName = schoolVal;
                s.supervisor = supVal;
              }
            });
          }
          // Atualiza rascunhos de observação da docente para a nova unidade
          if (Array.isArray(appState.observations)) {
            appState.observations.forEach(o => {
              if (o.teacherName === oldName && o.status === 'draft') {
                o.schoolName = schoolVal;
              }
            });
          }
          // Atualiza notas formativas não resolvidas
          if (Array.isArray(appState.notes)) {
            appState.notes.forEach(n => {
              if (n.teacherName === oldName && !n.resolved) {
                n.schoolName = schoolVal;
              }
            });
          }
        }
      }

      // 5. Se o usuário editado for o usuário logado ativo, atualiza UI da sessão imediatamente
      if (appState.currentUserKey === dbKey || appState.currentUserKey === id) {
        applyUserRoleUI();
      }

      saveState();
      renderTeamScreen();
      
      // 6. Atualização reativa imediata das telas ativas se estiverem visíveis
      if (document.getElementById('screenIndicators')?.classList.contains('active')) {
        renderIndicatorsScreen();
      }
      if (document.getElementById('screenClasses')?.classList.contains('active')) {
        renderClassesScreen();
      }
      if (document.getElementById('screenHome')?.classList.contains('active')) {
        renderHomeScreen();
      }
      if (document.getElementById('screenSchedule')?.classList.contains('active')) {
        renderScheduleScreen();
      }
      if (document.getElementById('screenNotes')?.classList.contains('active')) {
        renderNotesScreen();
      }

      closeEditMemberModal();
      showToast('Profissional atualizado e vínculos revalidados com sucesso.');
    }

    function deleteTeamMember() {
      const user = getCurrentUser();
      const id = document.getElementById('editMemberId').value;
      const member = (appState.teamMembers || []).find(m => m.id === id);
      if (!member) return;

      // Validação de Escopo / RBAC para exclusão
      if (user.roleKey === 'coordenador') {
        if (member.roleKey !== 'professora' || member.school !== user.school) {
          showToast('Permissão restrita: você só pode excluir docentes da sua própria unidade escolar.');
          return;
        }
      } else if (user.roleKey === 'formador') {
        const poloUnits = (appState.units || []).filter(u => u.polo === user.school || u.name === user.school).map(u => u.name);
        if (member.roleKey !== 'coordenador' || !poloUnits.includes(member.school)) {
          showToast('Permissão restrita: você só pode excluir coordenadoras vinculadas ao seu polo regional.');
          return;
        }
      }

      if (id === appState.currentUserKey || member.name === user.name) {
        showToast('Não é permitido excluir o usuário atualmente em sessão.');
        return;
      }

      if(confirm(`Tem certeza que deseja excluir o(a) profissional "${member.name}"? Os agendamentos futuros e rascunhos vinculados serão removidos para preservar a integridade das métricas.`)) {
        const memberName = member.name;
        
        // 1. Remove da lista de servidores
        appState.teamMembers = appState.teamMembers.filter(m => m.id !== id);
        if (appState.customUsers && appState.customUsers[id]) {
          delete appState.customUsers[id];
        }
        if (USERS_DB[id]) {
          delete USERS_DB[id];
        }

        // 2. Remove agendamentos e rascunhos vinculados ao profissional excluído
        if (appState.schedules) {
          appState.schedules = appState.schedules.filter(s => s.targetName !== memberName);
        }
        if (appState.observations) {
          appState.observations = appState.observations.filter(o => !(o.status === 'draft' && o.teacherName === memberName));
        }

        // 3. Limpa alocações docentes em turmas da SSOT
        if (Array.isArray(appState.classes)) {
          appState.classes.forEach(c => {
            if (c.teacher === memberName) c.teacher = '';
            if (c.teacherMorning === memberName) c.teacherMorning = '';
            if (c.teacherAfternoon === memberName) c.teacherAfternoon = '';
            if (Array.isArray(c.teachers)) {
              c.teachers = c.teachers.filter(t => t !== memberName);
            }
          });
        }

        saveState();
        renderTeamScreen();
        
        // Atualiza telas ativas se estiverem visíveis
        if (document.getElementById('screenIndicators')?.classList.contains('active')) {
          renderIndicatorsScreen();
        }
        if (document.getElementById('screenHome')?.classList.contains('active')) {
          renderHomeScreen();
        }

        closeEditMemberModal();
        showToast(`Profissional "${memberName}" removido e métricas recalculadas.`);
      }
    }

    function renderTeamTable() {
      renderTeamScreen();
    }

    function downloadTeamCsvTemplate() {
      const headers = ["Nome", "Cargo", "Unidade", "Supervisor", "Turma", "Email"];
      const sampleRows = [
        ["Maria Aparecida dos Santos", "Professora", "CEI Professora Maria de Lourdes", "Mariana Ferreira", "Infantil I", "maria.santos@escola.gov.br"],
        ["Sônia Regina Alcantara", "Coordenadora Pedagógica", "EMEI Pequeno Príncipe", "Clarice Barbosa", "", "sonia.alcantara@escola.gov.br"],
        ["Clarice Barbosa", "Formadora Pedagógica", "Polo Regional 1 (Norte)", "Helena Martins", "", "clarice.barbosa@escola.gov.br"],
        ["Rodrigo Toledo", "Núcleo de EI (Governança & Dados)", "Secretaria Municipal de Educação", "Helena Martins", "", "rodrigo.toledo@escola.gov.br"]
      ];
      const csvContent = [headers.join(','), ...sampleRows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
      downloadFile(csvContent, 'modelo_servidores_sertao_crianca.csv', 'text/csv');
      showToast('Planilha modelo de Servidores baixada com sucesso!');
    }

    function triggerTeamCsvImport() {
      document.getElementById('teamCsvFileInput').click();
    }

    // Parser auxiliar robusto para linhas CSV com suporte a delimitadores dentro de aspas
    function parseCsvLineCustom(line, delimiter = ',') {
      const result = [];
      let cur = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (c === '"') {
          if (inQuotes && line[i + 1] === '"') {
            cur += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (c === delimiter && !inQuotes) {
          result.push(cur.trim());
          cur = '';
        } else {
          cur += c;
        }
      }
      result.push(cur.trim());
      return result;
    }

    function normalizeRoleData(rawRole) {
      const r = (rawRole || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (r.includes('coord')) {
        return { roleKey: 'coordenador', roleTitle: 'Coordenadora Pedagógica' };
      } else if (r.includes('formad')) {
        return { roleKey: 'formador', roleTitle: 'Formadora Pedagógica' };
      } else if (r.includes('nucleo') || r.includes('tecnic') || r.includes('admin') || r.includes('gestao') || r.includes('secretaria') || r.includes('ei')) {
        return { roleKey: 'nucleo_ei', roleTitle: 'Coordenadora do Núcleo de EI' };
      } else if (r.includes('pendent') || r.includes('aguard')) {
        return { roleKey: 'pendente', roleTitle: 'Acesso Pendente' };
      } else {
        return { roleKey: 'professora', roleTitle: 'Professora' };
      }
    }

    function handleTeamCsvUpload(e) {
      const file = e.target.files[0];
      if (!file) return;

      if (!confirm('Tem certeza que deseja importar os profissionais desta planilha? Os registros serão adicionados ou atualizados no sistema.')) {
        e.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = function(evt) {
        const text = evt.target.result;
        const rawLines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
        if (rawLines.length === 0) {
          showToast('A planilha selecionada está vazia.');
          return;
        }

        // Detecta delimitador (, ou ;)
        const firstLine = rawLines[0];
        const delimiter = (firstLine.indexOf(';') !== -1 && firstLine.split(';').length >= firstLine.split(',').length) ? ';' : ',';

        const headerCols = parseCsvLineCustom(firstLine, delimiter).map(h => 
          h.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '')
        );

        // Mapeamento dinâmico de colunas
        let colId = headerCols.findIndex(h => h === 'id' || h === 'codigo' || h === 'identificador');
        let colName = headerCols.findIndex(h => h.includes('nome') || h === 'servidor' || h === 'profissional' || h === 'docente' || h === 'usuario');
        let colRole = headerCols.findIndex(h => h.includes('cargo') || h.includes('funcao') || h.includes('perfil') || h.includes('role'));
        let colSchool = headerCols.findIndex(h => h.includes('unidade') || h.includes('escola') || h.includes('ue') || h.includes('polo') || h.includes('lotacao'));
        let colSupervisor = headerCols.findIndex(h => h.includes('supervisor') || h.includes('formadora') || h.includes('coordenadora') || h.includes('superior'));
        let colClass = headerCols.findIndex(h => h.includes('turma') || h.includes('agrupamento') || h.includes('sala') || h.includes('classe'));
        let colEmail = headerCols.findIndex(h => h.includes('email') || h.includes('correio'));

        const hasHeader = (colName !== -1 || colRole !== -1 || colSchool !== -1);
        const startIndex = hasHeader ? 1 : 0;

        // Fallback por índice se não houver cabeçalhos explícitos
        if (!hasHeader) {
          const sample = parseCsvLineCustom(rawLines[0], delimiter);
          if (sample.length >= 6) {
            colId = 0; colName = 1; colRole = 2; colSchool = 3; colSupervisor = 4; colClass = 5;
          } else {
            colName = 0; colRole = 1; colSchool = 2; colSupervisor = 3; colClass = 4;
          }
        } else if (colName === -1) {
          // Se encontrou cabeçalho mas colName não foi detectada, assume coluna 1 se colId === 0, senão 0
          colName = (colId === 0) ? 1 : 0;
        }

        let imported = 0;
        if (!appState.customUsers) appState.customUsers = {};

        for (let i = startIndex; i < rawLines.length; i++) {
          const parts = parseCsvLineCustom(rawLines[i], delimiter);
          if (!parts || parts.length === 0 || !parts.some(p => p.length > 0)) continue;

          let rawName = (colName !== -1 && parts[colName]) ? parts[colName] : '';
          let rawId = (colId !== -1 && parts[colId]) ? parts[colId] : '';

          // Se o nome estiver vazio mas houver ID, ou se o nome for um ID de hard user, resolve
          if (!rawName && rawId) {
            rawName = rawId;
          }

          let resolvedName = resolveCanonicalUserName(rawName);

          // Se o nome ainda parecer um ID não canônico, tenta buscar pelo ID se fornecido
          if (!resolvedName && rawId) {
            resolvedName = resolveCanonicalUserName(rawId);
          }

          if (!resolvedName) continue;

          const rawRole = (colRole !== -1 && parts[colRole]) ? parts[colRole] : 'Professora';
          const { roleKey, roleTitle } = normalizeRoleData(rawRole);

          const school = (colSchool !== -1 && parts[colSchool]) ? parts[colSchool] : 'CEI Professora Maria de Lourdes';
          let supervisor = (colSupervisor !== -1 && parts[colSupervisor]) ? parts[colSupervisor] : '';
          supervisor = resolveCanonicalUserName(supervisor) || (roleKey === 'professora' ? 'Coordenação Pedagógica' : 'Helena Martins');
          
          const classAssigned = (colClass !== -1 && parts[colClass]) ? parts[colClass] : (roleKey === 'professora' ? 'Infantil I' : '');
          const email = (colEmail !== -1 && parts[colEmail]) ? parts[colEmail].toLowerCase() : '';

          const memberId = rawId || ('usr-' + Date.now() + '-' + i);

          // Verifica se já existe um membro com esse ID ou mesmo Nome
          const existingIdx = appState.teamMembers.findIndex(m => m.id === memberId || (m.name.toLowerCase() === resolvedName.toLowerCase() && m.roleKey === roleKey));

          const memberData = {
            id: memberId,
            name: resolvedName,
            roleKey,
            roleTitle,
            school,
            supervisor,
            classAssigned,
            email,
            avatarText: resolvedName.substring(0, 2).toUpperCase()
          };

          if (roleKey === 'professora') {
            email = '';
            memberData.email = '';
          }

          if (existingIdx >= 0) {
            appState.teamMembers[existingIdx] = { ...appState.teamMembers[existingIdx], ...memberData };
          } else {
            appState.teamMembers.push(memberData);
          }

          // Sincroniza com USERS_DB e customUsers apenas se NÃO for docente
          if (roleKey !== 'professora' && (email || memberId.startsWith('usr-') || USERS_DB[memberId])) {
            const authRecord = {
              id: memberId,
              name: resolvedName,
              email: email || `${resolvedName.toLowerCase().replace(/\s+/g, '.')}@sertao.edu`,
              password: '123456',
              roleKey,
              roleTitle,
              school,
              supervisor,
              avatarText: resolvedName.substring(0, 2).toUpperCase(),
              mustChangePassword: true
            };
            if (!appState.customUsers) appState.customUsers = {};
            appState.customUsers[memberId] = authRecord;
            USERS_DB[memberId] = authRecord;
          }

          imported++;
        }

        saveState();
        renderTeamScreen();
        showToast(`${imported} Servidor(es) importado(s)/sincronizado(s) com sucesso!`);
      };
      reader.readAsText(file);
      e.target.value = '';
    }

    function downloadFile(content, fileName, contentType) {
      const a = document.createElement("a");
      const file = new Blob([content], { type: contentType });
      a.href = URL.createObjectURL(file);
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(a.href);
    }

