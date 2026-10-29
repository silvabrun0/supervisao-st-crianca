    // --- 7. SYNTHESIS FINAL SCREEN ---
    function renderSynthesisScreen(preserveScroll = false) {
      const obs = appState.currentObs;
      if (!obs) return;

      document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));
      document.getElementById('screenSynthesis').classList.add('active');
      
      // Oculta a barra de dimensões e o FAB ao entrar na tela de síntese
      const dimBottomBar = document.getElementById('dimBottomBar');
      if (dimBottomBar) dimBottomBar.style.display = 'none';
      const fabContainer = document.getElementById('fabActiveObsContainer');
      if (fabContainer) fabContainer.style.display = 'none';
      if (typeof toggleFabMenu === 'function') toggleFabMenu(false);

      // Exibe a tarja de modo somente leitura exclusivamente em observações finalizadas
      const isFinalized = !!(obs && (obs.status === 'finalized' || obs.status === 'concluida'));
      const roWarning = document.getElementById('readOnlyWarning');
      if (roWarning) {
        roWarning.style.display = isFinalized ? 'flex' : 'none';
      }

      // Evita o scroll jump no mobile ao alternar opções
      if (!preserveScroll) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Conditional rendering for didactic section (coordinators skip 1-4)
      const didacticSection = document.getElementById('synthesisDidacticSection');
      const feedbackTitle = document.getElementById('synthesisFeedbackTitle');
      if (obs.evaluatedType === 'coordenador') {
        if (didacticSection) didacticSection.style.display = 'none';
        if (feedbackTitle) feedbackTitle.innerText = '1. Parecer Pedagógico e Devolutiva Formativa';
      } else {
        if (didacticSection) didacticSection.style.display = 'block';
        if (feedbackTitle) feedbackTitle.innerText = '5. Parecer Pedagógico e Devolutiva Formativa';
      }

      // População do Bloco de Identificação Oficial da Observação
      const metaTarget = document.getElementById('synthesisMetaTarget');
      const metaSchool = document.getElementById('synthesisMetaSchool');
      const metaClassBox = document.getElementById('synthesisMetaClassBox');
      const metaClass = document.getElementById('synthesisMetaClass');
      const metaBimester = document.getElementById('synthesisMetaBimester');
      const metaEvaluator = document.getElementById('synthesisMetaEvaluator');
      const metaDate = document.getElementById('synthesisMetaDate');
      const roleBadge = document.getElementById('synthesisRoleBadge');

      if (metaTarget) metaTarget.innerText = obs.teacherName || '--';
      if (metaSchool) metaSchool.innerText = obs.schoolName || '--';
      if (metaBimester) metaBimester.innerText = obs.bimester || 'Acompanhamento';
      if (metaEvaluator) metaEvaluator.innerText = obs.evaluatedBy || '--';
      if (metaDate) metaDate.innerText = formatObservationDateRange(obs) || formatDateBR(obs.date || getTodayDateString());

      if (obs.evaluatedType === 'coordenador') {
        if (metaTarget) metaTarget.innerText = obs.teacherName || '--';
        if (roleBadge) {
          roleBadge.innerText = 'Coordenação Pedagógica';
          roleBadge.style.background = '#FEF3C7';
          roleBadge.style.color = '#92400E';
          roleBadge.style.borderColor = '#FDE68A';
        }
        if (metaClassBox) metaClassBox.style.display = 'none';
      } else {
        // PILAR 1: Síntese focada na TURMA e sua equipe de regência
        const regentsText = obs.teachers && obs.teachers.length > 0 ? obs.teachers.join(', ') : obs.teacherName;
        if (metaTarget) metaTarget.innerHTML = `<strong>Turma:</strong> ${obs.className} <br><span style="font-size:12px; font-weight:600; color:var(--text-secondary);">Regência Titular: ${regentsText}</span>`;
        if (roleBadge) {
          roleBadge.innerText = 'Observação da Turma (Educação Infantil)';
          roleBadge.style.background = '#EFF6FF';
          roleBadge.style.color = '#1E40AF';
          roleBadge.style.borderColor = '#BFDBFE';
        }
        if (metaClassBox) {
          metaClassBox.style.display = 'block';
          if (metaClass) metaClass.innerText = `${obs.className} (${obs.classShift || 'Parcial'})`;
        }
      }

      // População do Bloco de Período e Duração (Pilar 4: Suporte Adaptativo a Tempo Integral)
      const sStandardBlock = document.getElementById('synthesisStandardScheduleBlock');
      const sIntegralBlock = document.getElementById('synthesisIntegralScheduleBlock');

      if (obs.isIntegral) {
        if (sStandardBlock) sStandardBlock.style.display = 'none';
        if (sIntegralBlock) sIntegralBlock.style.display = 'block';

        const stageBadge = document.getElementById('synthesisIntegralStageBadge');
        const mStatusBadge = document.getElementById('synthesisMorningStatusBadge');
        const aStatusBadge = document.getElementById('synthesisAfternoonStatusBadge');

        const mStartInput = document.getElementById('synthesisMorningStartTime');
        const mEndInput = document.getElementById('synthesisMorningEndTime');
        const mStartDisp = document.getElementById('synthesisMorningStartTimeDisp');
        const mEndDisp = document.getElementById('synthesisMorningEndTimeDisp');

        const aStartInput = document.getElementById('synthesisAfternoonStartTime');
        const aEndInput = document.getElementById('synthesisAfternoonEndTime');
        const aStartDisp = document.getElementById('synthesisAfternoonStartTimeDisp');
        const aEndDisp = document.getElementById('synthesisAfternoonEndTimeDisp');

        if (mStartInput) mStartInput.value = obs.morningObs?.startTime || obs.startTime || '08:00';
        if (mEndInput) mEndInput.value = obs.morningObs?.endTime || '11:30';

        if (aStartInput) aStartInput.value = obs.afternoonObs?.startTime || '13:30';
        if (aEndInput) aEndInput.value = obs.afternoonObs?.endTime || '16:30';

        if (isFinalized || appState.isReadOnly) {
          if (stageBadge) {
            stageBadge.innerText = '✓ Tempo Integral Concluído (2 Turnos)';
            stageBadge.style.background = '#DCFCE7';
            stageBadge.style.color = '#166534';
            stageBadge.style.borderColor = '#BBF7D0';
          }
          if (mStatusBadge) {
            mStatusBadge.innerText = '✓ Manhã concluída';
            mStatusBadge.style.background = '#DCFCE7';
            mStatusBadge.style.color = '#166534';
          }
          if (aStatusBadge) {
            aStatusBadge.innerText = '✓ Tarde concluída';
            aStatusBadge.style.background = '#DCFCE7';
            aStatusBadge.style.color = '#166534';
          }

          if (mStartInput) mStartInput.style.display = 'none';
          if (mEndInput) mEndInput.style.display = 'none';
          if (mStartDisp) {
            mStartDisp.style.display = 'block';
            mStartDisp.innerText = obs.morningObs?.startTime || obs.startTime || '--';
          }
          if (mEndDisp) {
            mEndDisp.style.display = 'block';
            mEndDisp.innerText = obs.morningObs?.endTime || '--';
          }

          if (aStartInput) aStartInput.style.display = 'none';
          if (aEndInput) aEndInput.style.display = 'none';
          if (aStartDisp) {
            aStartDisp.style.display = 'block';
            aStartDisp.innerText = obs.afternoonObs?.startTime || '--';
          }
          if (aEndDisp) {
            aEndDisp.style.display = 'block';
            aEndDisp.innerText = obs.afternoonObs?.endTime || obs.endTime || '--';
          }
        } else {
          // Modo Rascunho
          if (obs.integralStage === 'vespertino') {
            if (stageBadge) {
              stageBadge.innerText = '🌅 Etapa 2: Turno Vespertino (Tarde)';
              stageBadge.style.background = '#FFFBEB';
              stageBadge.style.color = '#B45309';
              stageBadge.style.borderColor = '#FDE68A';
            }
            if (mStatusBadge) {
              mStatusBadge.innerText = '✓ Manhã concluída';
              mStatusBadge.style.background = '#DCFCE7';
              mStatusBadge.style.color = '#166534';
            }
            if (aStatusBadge) {
              aStatusBadge.innerText = 'Em andamento (Tarde)';
              aStatusBadge.style.background = '#FEF3C7';
              aStatusBadge.style.color = '#92400E';
            }
            if (aStartInput) aStartInput.disabled = false;
            if (aEndInput) aEndInput.disabled = false;
          } else {
            // Etapa 1: Matutino
            if (stageBadge) {
              stageBadge.innerText = '☀️ Etapa 1: Turno Matutino (Manhã)';
              stageBadge.style.background = '#FAF5FF';
              stageBadge.style.color = '#6B21A8';
              stageBadge.style.borderColor = '#E9D5FF';
            }
            if (mStatusBadge) {
              mStatusBadge.innerText = 'Em andamento (Manhã)';
              mStatusBadge.style.background = '#DBEAFE';
              mStatusBadge.style.color = '#1E40AF';
            }
            if (aStatusBadge) {
              aStatusBadge.innerText = 'Aguardando retorno à tarde';
              aStatusBadge.style.background = '#F1F5F9';
              aStatusBadge.style.color = '#64748B';
            }
            if (aStartInput) aStartInput.disabled = true;
            if (aEndInput) aEndInput.disabled = true;
          }

          if (mStartInput) mStartInput.style.display = 'block';
          if (mEndInput) mEndInput.style.display = 'block';
          if (mStartDisp) mStartDisp.style.display = 'none';
          if (mEndDisp) mEndDisp.style.display = 'none';

          if (aStartInput) aStartInput.style.display = 'block';
          if (aEndInput) aEndInput.style.display = 'block';
          if (aStartDisp) aStartDisp.style.display = 'none';
          if (aEndDisp) aEndDisp.style.display = 'none';
        }

        onSynthesisIntegralTimeChange();

      } else {
        // Observação Parcial padrão
        if (sStandardBlock) sStandardBlock.style.display = 'block';
        if (sIntegralBlock) sIntegralBlock.style.display = 'none';

        const sDateDisp = document.getElementById('synthesisDateDisplay');
        const sStartDisp = document.getElementById('synthesisStartTimeDisplay');
        const sEndDisp = document.getElementById('synthesisEndTimeDisplay');
        const sDurDisp = document.getElementById('synthesisDurationText');
        const sEndBox = document.getElementById('synthesisEndTimeBox');
        const sDurBox = document.getElementById('synthesisDurationBox');
        const sTimeNotice = document.getElementById('synthesisTimeNotice');
        const sTimeBadge = document.getElementById('synthesisTimeBadge');

        const dateInput = document.getElementById('synthesisDate');
        const startInput = document.getElementById('synthesisStartTime');
        const endInput = document.getElementById('synthesisEndTime');

        const effectiveDate = obs.endDate || obs.startDate || obs.date || getTodayDateString();
        const effectiveStart = obs.startTime || '';
        const effectiveEnd = obs.endTime || '';

        if (dateInput) dateInput.value = effectiveDate;
        if (startInput) startInput.value = effectiveStart;
        if (endInput) endInput.value = effectiveEnd;

        const dateStr = formatObservationDateRange(obs) || formatDateBR(effectiveDate);
        if (sDateDisp) sDateDisp.innerText = dateStr;
        if (sStartDisp) sStartDisp.innerText = effectiveStart || '--';
        if (sEndDisp) sEndDisp.innerText = effectiveEnd || '--';

        if (obs.status === 'finalized' || obs.status === 'concluida' || appState.isReadOnly) {
          if (sEndBox) sEndBox.style.display = 'block';
          if (sDurBox) sDurBox.style.display = 'block';
          if (sTimeNotice) sTimeNotice.style.display = 'none';
          if (sTimeBadge) sTimeBadge.innerText = 'Registro Consolidado';

          if (dateInput) dateInput.style.display = 'none';
          if (startInput) startInput.style.display = 'none';
          if (endInput) endInput.style.display = 'none';
          if (sDateDisp) sDateDisp.style.display = 'block';
          if (sStartDisp) sStartDisp.style.display = 'block';
          if (sEndDisp) sEndDisp.style.display = 'block';
        } else {
          if (sEndBox) sEndBox.style.display = 'block';
          if (sDurBox) sDurBox.style.display = 'block';
          if (sTimeNotice) sTimeNotice.style.display = 'flex';
          if (sTimeBadge) sTimeBadge.innerText = 'Horários Efetivos de Sala';

          if (dateInput) {
            dateInput.style.display = 'block';
            dateInput.disabled = false;
          }
          if (startInput) {
            startInput.style.display = 'block';
            startInput.disabled = false;
          }
          if (endInput) {
            endInput.style.display = 'block';
            endInput.disabled = false;
          }
          if (sDateDisp) sDateDisp.style.display = 'none';
          if (sStartDisp) sStartDisp.style.display = 'none';
          if (sEndDisp) sEndDisp.style.display = 'none';
        }

        recalculateSynthesisDuration();
      }

      // Signatures for PDF
      document.getElementById('printSignObserverName').innerText = obs.evaluatedBy || 'Supervisor(a) Pedagógico(a)';
      const observedDisplay = obs.evaluatedType === 'turma' 
        ? `Turma: ${obs.className} (${obs.teachers && obs.teachers.length > 0 ? obs.teachers.join(', ') : obs.teacherName})` 
        : (obs.teacherName || 'Docente');
      document.getElementById('printSignObservedName').innerText = observedDisplay;
      document.getElementById('printCurrentDate').innerText = formatObservationDateRange(obs) || obs.date || new Date().toLocaleDateString('pt-BR');

      const pendencies = getObservationPendencies(obs);
      const pendencyBox = document.getElementById('synthesisValidationBox');
      const pendencyText = document.getElementById('synthesisPendencyCountText');

      if (pendencies.length > 0 && !appState.isReadOnly) {
        pendencyBox.classList.add('visible');
        pendencyText.innerText = `Existem ${pendencies.length} item(ns) em branco nas dimensões do instrumento. O preenchimento integral é obrigatório.`;
      } else {
        pendencyBox.classList.remove('visible');
      }

      // Synthesis Levels
      const levelsGrid = document.getElementById('synthesisLevelsGrid');
      levelsGrid.innerHTML = '';
      SYNTHESIS_LEVELS.forEach(lvl => {
        const isSel = obs.synthesisMaterialDimension === lvl.level;
        const box = document.createElement('div');
        box.className = `level-box ${isSel ? 'selected' : ''}`;
        box.innerHTML = `
          <div class="level-box-title">${lvl.title} ${isSel ? '✓' : ''}</div>
          <div class="level-box-desc">${lvl.desc}</div>
        `;
        if (!appState.isReadOnly) {
          box.onclick = () => {
            obs.synthesisMaterialDimension = lvl.level;
            saveState();
            renderSynthesisScreen(true); // preserve scroll on mobile
          };
        }
        levelsGrid.appendChild(box);
      });

      // Predominant Material
      const matList = document.getElementById('synthesisMaterialsList');
      matList.innerHTML = '';
      SYNTHESIS_MATERIALS.forEach(opt => {
        const isSel = obs.synthesisPredominant === opt;
        const row = document.createElement('div');
        row.style.cssText = `display:flex; align-items:center; gap:10px; padding:10px 0; cursor:${appState.isReadOnly ? 'default' : 'pointer'}; min-height:44px;`;
        row.innerHTML = `
          <div style="width:22px; height:22px; border-radius:11px; border:2px solid ${isSel ? 'var(--primary)' : 'var(--border)'}; background:${isSel ? 'var(--primary)' : 'transparent'}; flex-shrink:0;"></div>
          <span style="font-size:13px; font-weight:${isSel ? '700' : '500'}; color:var(--text-primary); line-height:1.4;">${opt}</span>
        `;
        if (!appState.isReadOnly) {
          row.onclick = () => {
            obs.synthesisPredominant = opt;
            saveState();
            renderSynthesisScreen(true); // preserve scroll on mobile
          };
        }
        matList.appendChild(row);
      });

      // Organization
      const orgList = document.getElementById('synthesisOrgList');
      orgList.innerHTML = '';
      SYNTHESIS_ORGANIZATION.forEach(opt => {
        const isSel = obs.synthesisOrg === opt;
        const row = document.createElement('div');
        row.style.cssText = `display:flex; align-items:center; gap:10px; padding:10px 0; cursor:${appState.isReadOnly ? 'default' : 'pointer'}; min-height:44px;`;
        row.innerHTML = `
          <div style="width:22px; height:22px; border-radius:11px; border:2px solid ${isSel ? 'var(--primary)' : 'var(--border)'}; background:${isSel ? 'var(--primary)' : 'transparent'}; flex-shrink:0;"></div>
          <span style="font-size:13px; font-weight:${isSel ? '700' : '500'}; color:var(--text-primary); line-height:1.4;">${opt}</span>
        `;
        if (!appState.isReadOnly) {
          row.onclick = () => {
            obs.synthesisOrg = opt;
            saveState();
            renderSynthesisScreen(true); // preserve scroll on mobile
          };
        }
        orgList.appendChild(row);
      });

      // Linked Qualitative Notes
      const notesContainer = document.getElementById('synthesisLinkedNotesContainer');
      notesContainer.innerHTML = '';
      if (!obs.linkedNotes || obs.linkedNotes.length === 0) {
        notesContainer.innerHTML = `<div style="font-size:12px; color:var(--text-secondary); font-style:italic;">Nenhuma ocorrência vinculada a este roteiro de observação.</div>`;
      } else {
        obs.linkedNotes.forEach((noteText, nIdx) => {
          const item = document.createElement('div');
          item.style.cssText = 'background:#F8FAFC; border:1px solid #E2E8F0; padding:10px 14px; border-radius:8px; margin-bottom:6px; font-size:12px; display:flex; justify-content:space-between; align-items:center;';
          item.innerHTML = `
            <span>📌 ${noteText}</span>
            ${!appState.isReadOnly ? `<button class="btn btn-secondary" style="padding:2px 8px; font-size:10px; color:var(--red);" onclick="removeLinkedNoteFromSynthesis(${nIdx})">✕</button>` : ''}
          `;
          notesContainer.appendChild(item);
        });
      }

      // ==========================================
      // PILAR 5: RENDERIZAÇÃO DOS BLOCOS NOMINAIS POR PROFESSOR REGENTE NA SÍNTESE
      // ==========================================
      const synthTeachersSection = document.getElementById('synthesisTeachersSection');
      const synthTeachersCardsContainer = document.getElementById('synthesisTeacherCardsContainer');
      const synthTeachersSectionTitle = document.getElementById('synthesisTeachersSectionTitle');

      if (synthTeachersSection && synthTeachersCardsContainer) {
        if (obs.evaluatedType !== 'turma') {
          synthTeachersSection.style.display = 'none';
        } else {
          synthTeachersSection.style.display = 'block';
          if (synthTeachersSectionTitle) {
            synthTeachersSectionTitle.innerText = '4. Avaliação Nominal e Devolutiva por Professor(a) Regente';
          }
          synthTeachersCardsContainer.innerHTML = '';

          const dimLabels = [
            { key: 'estrategias', title: '1. Estratégias Didáticas' },
            { key: 'gestao_grupo', title: '2. Gestão do Grupo e Ambiente' },
            { key: 'mediacao_individual', title: '3. Mediação Individualizada' },
            { key: 'respeito_integridade', title: '4. Respeito, Diversidade e Proteção' },
            { key: 'gestao_cuidados', title: '5. Gestão dos Cuidados e Autonomia' }
          ];

          if (!obs.teacherSynthesis) obs.teacherSynthesis = {};

          // Helper interno para gerar o card de cada docente (com suporte a bloqueio condicional por turno)
          function buildTeacherCard(tName, globalIdx, shiftTag = null, isBlocked = false) {
            if (!obs.teacherSynthesis[tName]) {
              obs.teacherSynthesis[tName] = {
                dimensions: {
                  estrategias: null,
                  gestao_grupo: null,
                  mediacao_individual: null,
                  respeito_integridade: null,
                  gestao_cuidados: null
                },
                feedback: ''
              };
            }
            const tData = obs.teacherSynthesis[tName];
            const tDims = tData.dimensions || {};
            const isDisabled = appState.isReadOnly || isBlocked;

            // Mapeia critérios com nota parcial atribuídos a esta docente
            const assignedPartialItems = [];
            const responses = obs.responses || {};
            const attributions = obs.partialAttributions || {};
            const sections = getActiveSections(obs);

            Object.keys(responses).forEach(critId => {
              if (responses[critId] === 'partial') {
                const attr = attributions[critId];
                if (attr && Array.isArray(attr.teachers) && attr.teachers.includes(tName)) {
                  let critObj = null;
                  sections.forEach(s => s.subSections.forEach(sub => sub.criteria.forEach(c => {
                    if (c.id === critId) critObj = c;
                  })));
                  assignedPartialItems.push({
                    id: critId,
                    text: critObj ? critObj.text : `Critério ${critId}`,
                    justification: attr.justification || 'Sem justificativa registrada.'
                  });
                }
              }
            });

            const card = document.createElement('div');
            card.className = `teacher-synthesis-card ${isBlocked ? 'teacher-card-blocked' : ''}`;
            card.id = `teacher-synthesis-card-${globalIdx}`;
            if (isBlocked) {
              card.style.opacity = '0.72';
              card.style.background = '#F8FAFC';
              card.style.border = '1px dashed #CBD5E1';
              card.style.transition = 'all 0.2s ease';
            }

            let cardHtml = `
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; padding-bottom:10px; border-bottom:1px solid #E2E8F0;">
                <div style="display:flex; align-items:center; gap:10px;">
                  <div style="width:36px; height:36px; border-radius:18px; background:${isBlocked ? '#94A3B8' : 'var(--primary)'}; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:14px;">
                    ${tName.split(' ').map(n=>n[0]).slice(0,2).join('')}
                  </div>
                  <div>
                    <div style="font-size:15px; font-weight:800; color:${isBlocked ? '#64748B' : 'var(--text-primary)'};">${tName}</div>
                    <div style="font-size:11px; color:var(--text-secondary);">Docente Regente Titular</div>
                  </div>
                </div>
                <div style="display:flex; align-items:center; gap:6px;">
                  ${shiftTag ? `
                    <span class="badge" style="font-size:10px; font-weight:700; ${shiftTag.style}">
                      ${shiftTag.label}
                    </span>
                  ` : ''}
                  ${isBlocked ? `
                    <span class="badge" style="background:#F1F5F9; color:#475569; border:1px solid #CBD5E1; font-size:10px; font-weight:700;">
                      🔒 Bloqueado no Turno Matutino
                    </span>
                  ` : `
                    <span class="badge" style="background:#EFF6FF; color:#1E40AF; border:1px solid #BFDBFE; font-size:10px;">
                      Devolutiva Individual
                    </span>
                  `}
                </div>
              </div>

              ${isBlocked ? `
                <div style="background:#FFFBEB; border:1px solid #FDE68A; border-left:4px solid #D97706; border-radius:6px; padding:8px 12px; margin-bottom:14px; font-size:11px; color:#92400E; display:flex; align-items:center; gap:8px;">
                  <span>🔒</span>
                  <span><strong>Avaliação Bloqueada:</strong> Esta docente atua no <strong>Turno Vespertino (Tarde)</strong>. A avaliação das dimensões estruturantes e parecer pedagógico será habilitada na <strong>Etapa 2 (Tarde)</strong>.</span>
                </div>
              ` : ''}

              <!-- Grade das 5 Dimensões -->
              <div style="margin-bottom:16px;">
                <div style="font-size:12px; font-weight:800; color:${isBlocked ? '#64748B' : 'var(--primary-dark)'}; text-transform:uppercase; margin-bottom:8px;">
                  Avaliação nas 5 Dimensões Estruturantes:
                </div>
                <div style="display:flex; flex-direction:column; gap:8px;">
            `;

            dimLabels.forEach(d => {
              const currentVal = tDims[d.key];
              cardHtml += `
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; background:${isBlocked ? '#F1F5F9' : '#F8FAFC'}; border:1px solid ${isBlocked ? '#E2E8F0' : '#E2E8F0'}; padding:8px 12px; border-radius:8px;">
                  <span style="font-size:12px; font-weight:700; color:${isBlocked ? '#64748B' : '#334155'};">${d.title}</span>
                  <div style="display:flex; gap:6px;">
                    <button type="button" 
                            class="dim-pill-btn ${currentVal === 'consistent' ? 'active-cons' : ''}" 
                            onclick="setTeacherSynthesisDimension('${tName}', '${d.key}', 'consistent')"
                            ${isDisabled ? 'disabled' : ''}
                            style="${isDisabled ? 'cursor:not-allowed; opacity:0.55;' : ''}">
                      Consistente
                    </button>
                    <button type="button" 
                            class="dim-pill-btn ${currentVal === 'partial' ? 'active-parc' : ''}" 
                            onclick="setTeacherSynthesisDimension('${tName}', '${d.key}', 'partial')"
                            ${isDisabled ? 'disabled' : ''}
                            style="${isDisabled ? 'cursor:not-allowed; opacity:0.55;' : ''}">
                      Parcial
                    </button>
                    <button type="button" 
                            class="dim-pill-btn ${currentVal === 'not_done' ? 'active-notdone' : ''}" 
                            onclick="setTeacherSynthesisDimension('${tName}', '${d.key}', 'not_done')"
                            ${isDisabled ? 'disabled' : ''}
                            style="${isDisabled ? 'cursor:not-allowed; opacity:0.55;' : ''}">
                      Não Realizado
                    </button>
                  </div>
                </div>
              `;
            });

            cardHtml += `
                </div>
              </div>

              <!-- Rastreabilidade de Itens Parciais Atribuídos -->
              <div style="margin-bottom:16px;">
                <div style="font-size:12px; font-weight:800; color:${isBlocked ? '#94A3B8' : '#B45309'}; text-transform:uppercase; margin-bottom:6px;">
                  📌 Critérios com Nota Parcial Atribuída a esta Docente (${assignedPartialItems.length}):
                </div>
            `;

            if (assignedPartialItems.length === 0) {
              cardHtml += `
                <div style="font-size:11px; color:${isBlocked ? '#64748B' : '#15803D'}; background:${isBlocked ? '#F1F5F9' : '#DCFCE7'}; border:1px solid ${isBlocked ? '#E2E8F0' : '#BBF7D0'}; border-radius:6px; padding:8px 12px;">
                  ${isBlocked ? '🔒 Sem registros de fragilidades pontuais no período matutino.' : '✓ Nenhum apontamento de fragilidade pontual atribuído nos critérios individuais.'}
                </div>
              `;
            } else {
              cardHtml += `<div style="display:flex; flex-direction:column; gap:6px;">`;
              assignedPartialItems.forEach(item => {
                cardHtml += `
                  <div style="background:#FFFBEB; border:1px solid #FDE68A; border-left:4px solid #D97706; border-radius:6px; padding:8px 12px; font-size:11px;">
                    <div style="font-weight:700; color:#92400E;">[Item ${item.id}] ${item.text}</div>
                    <div style="color:#78350F; margin-top:2px;"><strong>Justificativa da Nota:</strong> ${item.justification}</div>
                  </div>
                `;
              });
              cardHtml += `</div>`;
            }

            cardHtml += `
              </div>

              <!-- Parecer Formativo e Combinados Individuais -->
              <div>
                <label style="font-size:12px; font-weight:800; color:${isBlocked ? '#64748B' : 'var(--primary-dark)'}; display:block; margin-bottom:4px;">
                  Parecer Formativo Individual e Combinados de Desenvolvimento:
                </label>
                <textarea class="form-textarea" 
                          id="teacherFeedback-${globalIdx}"
                          style="min-height:76px; font-size:12px; ${isBlocked ? 'background:#F1F5F9; cursor:not-allowed; color:#64748B; border-color:#CBD5E1;' : ''}"
                          placeholder="${isBlocked ? '🔒 Avaliação bloqueada: esta docente atua no turno vespertino e será avaliada na Etapa 2 (Tarde)...' : (appState.isReadOnly ? 'Sem parecer individual registrado.' : 'Pontos fortes observados, evidências de práticas consistentes e combinados de aprimoramento individual para o próximo ciclo...')}"
                          onchange="setTeacherSynthesisFeedback('${tName}', this.value)"
                          ${isDisabled ? 'disabled' : ''}>${tData.feedback || ''}</textarea>
              </div>
            `;

            card.innerHTML = cardHtml;
            return card;
          }

          if (obs.isIntegral) {
            // RENDERIZAÇÃO SEGREGADA SEQUENCIAL POR TURNO: MANHÃ (4.1) ➔ TARDE (4.2)
            const mTeachers = (obs.teachersMorning && obs.teachersMorning.length > 0)
              ? obs.teachersMorning
              : (obs.teachers ? obs.teachers.slice(0, 2) : []);
            const aTeachers = (obs.teachersAfternoon && obs.teachersAfternoon.length > 0)
              ? obs.teachersAfternoon
              : (obs.teachers ? obs.teachers.slice(2) : []);

            let globalIdx = 0;

            // --- Subseção 4.1: Turno Matutino ---
            const morningHeader = document.createElement('div');
            morningHeader.id = 'synthesisMorningTeachersHeader';
            morningHeader.style.cssText = 'background:#FAF5FF; border:1px solid #DDD6FE; border-left:5px solid #7C3AED; border-radius:8px; padding:12px 14px; margin-top:14px; margin-bottom:12px;';
            morningHeader.innerHTML = `
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <div style="font-size:13px; font-weight:800; color:#581C87; display:flex; align-items:center; gap:6px;">
                    <span>☀️</span> <span>4.1 · Avaliação e Devolutiva dos Docentes da Manhã (Turno Matutino)</span>
                  </div>
                  <div style="font-size:11px; color:#6B21A8; margin-top:2px;">
                    Práticas pedagógicas, rotinas e mediações observadas no período matutino (${mTeachers.length} docentes)
                  </div>
                </div>
                <span style="font-size:10px; background:#EDE9FE; color:#6D28D9; border:1px solid #DDD6FE; padding:2px 8px; border-radius:12px; font-weight:700;">Etapa 1</span>
              </div>
            `;
            synthTeachersCardsContainer.appendChild(morningHeader);

            mTeachers.forEach(tName => {
              const card = buildTeacherCard(tName, globalIdx, { label: '☀️ Turno Matutino', style: 'background:#F5F3FF; color:#6D28D9; border:1px solid #DDD6FE;' });
              synthTeachersCardsContainer.appendChild(card);
              globalIdx++;
            });

            // --- Subseção 4.2: Turno Vespertino ---
            const afternoonHeader = document.createElement('div');
            afternoonHeader.id = 'synthesisAfternoonTeachersHeader';
            afternoonHeader.style.cssText = 'background:#FFF7ED; border:1px solid #FED7AA; border-left:5px solid #EA580C; border-radius:8px; padding:12px 14px; margin-top:20px; margin-bottom:12px;';
            afternoonHeader.innerHTML = `
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <div style="font-size:13px; font-weight:800; color:#9A3412; display:flex; align-items:center; gap:6px;">
                    <span>🌅</span> <span>4.2 · Avaliação e Devolutiva dos Docentes da Tarde (Turno Vespertino)</span>
                  </div>
                  <div style="font-size:11px; color:#C2410C; margin-top:2px;">
                    Práticas pedagógicas, rotinas e mediações observadas no período vespertino (${aTeachers.length} docentes)
                  </div>
                </div>
                <span style="font-size:10px; background:#FFEDD5; color:#EA580C; border:1px solid #FDBA74; padding:2px 8px; border-radius:12px; font-weight:700;">Etapa 2</span>
              </div>
            `;
            synthTeachersCardsContainer.appendChild(afternoonHeader);

            const isMorningStage = (obs.integralStage === 'matutino');

            if (isMorningStage) {
              const noticeCard = document.createElement('div');
              noticeCard.id = 'synthesisAfternoonBlockedNotice';
              noticeCard.style.cssText = 'background:#FFFBEB; border:1px solid #F59E0B; border-left:5px solid #D97706; border-radius:8px; padding:12px 14px; margin-bottom:14px; font-size:12px; color:#B45309; line-height:1.5;';
              noticeCard.innerHTML = `
                <div style="font-weight:800; display:flex; align-items:center; gap:6px; margin-bottom:4px;">
                  <span>🔒</span> <span>Avaliação Bloqueada no Turno Matutino (Etapa 1/2)</span>
                </div>
                <div>Os docentes abaixo atuam no <strong>Turno Vespertino (Tarde)</strong> e não podem ser avaliados durante a observação matutina. A avaliação nominal das 5 dimensões e parecer individual será liberada na <strong>Etapa 2 (Tarde)</strong>, quando os 4 regentes estarão disponíveis para fechamento. Salve o turno matutino abaixo para retomar à tarde.</div>
              `;
              synthTeachersCardsContainer.appendChild(noticeCard);
            }

            aTeachers.forEach(tName => {
              const card = buildTeacherCard(
                tName, 
                globalIdx, 
                { label: '🌅 Turno Vespertino', style: 'background:#FFF7ED; color:#EA580C; border:1px solid #FED7AA;' },
                isMorningStage // isBlocked: true na etapa matutina, false na etapa vespertina
              );
              synthTeachersCardsContainer.appendChild(card);
              globalIdx++;
            });

          } else {
            // Renderização Padrão para Turmas Parciais
            const teachers = (obs.teachers && obs.teachers.length > 0)
              ? obs.teachers
              : (obs.teacherName ? [obs.teacherName] : []);

            teachers.forEach((tName, tIdx) => {
              const card = buildTeacherCard(tName, tIdx);
              synthTeachersCardsContainer.appendChild(card);
            });
          }
        }
      }

      // Comments
      const commArea = document.getElementById('synthesisGeneralComments');
      commArea.value = obs.comments || '';
      commArea.disabled = appState.isReadOnly;
      commArea.onchange = (e) => {
        obs.comments = e.target.value;
        saveState();
      };

      // Actions Footer
      const actions = document.getElementById('synthesisActionButtons');
      const isReadOnlyOrFinalized = !!(obs && (obs.status === 'finalized' || obs.status === 'concluida')) || appState.isReadOnly;
      if (isReadOnlyOrFinalized) {
        const returnTab = appState.returnTab || 'history';
        const returnLabel = returnTab === 'schedule' ? 'Voltar à Agenda' : 'Voltar ao Histórico';
        actions.innerHTML = `
          <button class="btn btn-secondary" onclick="exportSynthesisToPdf()">
            <svg class="btn-icon" viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            Exportar em PDF
          </button>
          <button class="btn btn-primary" onclick="navigateToTab('${returnTab}')">${returnLabel}</button>
        `;
      } else if (obs.isIntegral && obs.integralStage === 'matutino') {
        // PILAR 4: Na Etapa 1 (Matutino), o formulário prioriza salvar a etapa matutina para aguardar a tarde
        actions.innerHTML = `
          <button class="btn btn-secondary" onclick="saveDraftAndExit()">Salvar Rascunho Simples</button>
          <button class="btn btn-primary" style="background:#7C3AED; border-color:#6D28D9; font-weight:700; display:inline-flex; align-items:center; gap:6px;" onclick="saveMorningStageAndExit()">
            <svg class="btn-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            SALVAR TURNO MATUTINO E AGUARDAR TARDE
          </button>
        `;
      } else {
        const canFinalize = pendencies.length === 0;
        const finalizeText = obs.isIntegral 
          ? (canFinalize ? 'FINALIZAR OBSERVAÇÃO INTEGRAL COMPLETA (MANHÃ + TARDE) ✓' : `PREENCHIMENTO INCOMPLETO (${pendencies.length} RESTANTES)`)
          : (canFinalize ? 'FINALIZAR E SINCRONIZAR (READ-ONLY)' : `PREENCHIMENTO INCOMPLETO (${pendencies.length} RESTANTES)`);
        actions.innerHTML = `
          <button class="btn btn-secondary" onclick="saveDraftAndExit()">Salvar Rascunho</button>
          <button class="btn ${canFinalize ? 'btn-primary' : 'btn-secondary'}" 
                  style="${!canFinalize ? 'opacity:0.6;' : (obs.isIntegral ? 'background:#16A34A; border-color:#15803D;' : '')}" 
                  onclick="finalizeObservation()">
            ${finalizeText}
          </button>
        `;
      }

      // ==========================================
      // Renderização do Bloco Interativo de Fotos na Síntese (UI em Tela)
      // ==========================================
      const photosGalleryContainer = document.getElementById('synthesisPhotosGalleryContainer');
      const photosTitle = document.getElementById('synthesisPhotosTitle');
      const photosActionBox = document.getElementById('synthesisPhotosActionBox');
      
      if (photosGalleryContainer && obs) {
        let allPhotos = [];
        if (obs.photos) {
          Object.keys(obs.photos).forEach(k => {
            const arr = obs.photos[k];
            if (Array.isArray(arr)) {
              arr.forEach((uri, idx) => {
                allPhotos.push({ critId: k, uri: uri, index: idx });
              });
            }
          });
        }

        if (photosTitle) {
          photosTitle.innerHTML = `📷 Evidências Fotográficas Anexadas (${allPhotos.length})`;
        }

        if (photosActionBox) {
          photosActionBox.innerHTML = !appState.isReadOnly ? `
            <button class="btn btn-secondary no-print" style="font-size:11px; padding:6px 10px;" onclick="triggerPhotoUpload('geral')">
              + Anexar Foto da Síntese / Geral
            </button>
          ` : '';
        }

        if (allPhotos.length === 0) {
          photosGalleryContainer.innerHTML = `
            <div style="font-size:12px; color:var(--text-secondary); font-style:italic; background:#F8FAFC; border:1px dashed #CBD5E1; border-radius:8px; padding:12px; text-align:center;">
              Nenhuma evidência fotográfica anexada aos critérios desta observação.
            </div>
          `;
        } else {
          let gHtml = `<div style="display:flex; flex-wrap:wrap; gap:12px; margin-top:8px;">`;
          allPhotos.forEach(item => {
            const badgeLabel = item.critId === 'geral' ? 'Geral' : `Crit. ${item.critId}`;
            gHtml += `
              <div style="background:#F8FAFC; border:1px solid #CBD5E1; border-radius:8px; padding:6px; display:flex; flex-direction:column; align-items:center; gap:6px; position:relative;">
                <div class="photo-thumb-wrapper" style="width:64px; height:64px; cursor:pointer;" onclick="previewImage('${item.uri}')" title="Clique para ampliar evidência">
                  <img src="${item.uri}" alt="${badgeLabel}">
                </div>
                <span style="font-size:10px; font-weight:700; color:var(--primary); background:#EFF6FF; padding:2px 6px; border-radius:4px; border:1px solid #BFDBFE;">${badgeLabel}</span>
                ${!appState.isReadOnly ? `
                  <button class="photo-del-btn" style="top:2px; right:2px;" onclick="removePhoto('${item.critId}', ${item.index})" title="Remover foto">✕</button>
                ` : ''}
              </div>
            `;
          });
          gHtml += `</div>`;
          photosGalleryContainer.innerHTML = gHtml;
        }
      }

      // ==========================================
      // Injeção do Resumo Completo das Rubricas para PDF (com Fotos e Comentários)
      // ==========================================
      const rubricsPrintContainer = document.getElementById('synthesisRubricsPrintSection');
      if (rubricsPrintContainer && obs) {
        let rubricsHtml = '<h3 style="font-size:16px; font-weight:800; color:#334155; margin-bottom:15px; text-transform:uppercase;">Resumo das Avaliações (Indicadores)</h3>';
        
        getActiveSections(obs).forEach((sec, sIdx) => {
          const dimTitleClean = (sec.title || '').replace(/^Dimens[aã]o\s*\d*\s*[:\.\-]?\s*/i, '').trim();
          rubricsHtml += `<div style="margin-bottom: 16px;">`;
          rubricsHtml += `<h4 style="font-size:14px; font-weight:700; background:#E2E8F0; padding:6px 10px; border-radius:4px; color:#1E293B;">${sIdx + 1}. ${dimTitleClean}</h4>`;
          
          sec.subSections.forEach(sub => {
            const subTitleClean = (sub.title || '').replace(/^Subdimens[aã]o\s*[\d\.]*\s*[:\.\-]?\s*/i, '').trim();
            rubricsHtml += `<div style="margin-left:8px; margin-top:8px;">`;
            rubricsHtml += `<h5 style="font-size:13px; font-weight:700; color:#475569; margin-bottom:6px; border-left: 3px solid #94A3B8; padding-left: 6px;">${sub.id} ${subTitleClean}</h5>`;
            
            sub.criteria.forEach(c => {
              const r = obs.responses ? obs.responses[c.id] : null;
              let rLabel = 'Sem resposta';
              let rColor = '#64748B';
              let rBg = '#F1F5F9';

              if (r === 'consistent' || r === 'yes') {
                rLabel = obs.evaluatedType === 'coordenador' ? 'Sim / Consistente' : 'Consistente';
                rColor = '#166534';
                rBg = '#DCFCE7';
              } else if (r === 'partial') {
                rLabel = 'Parcial';
                rColor = '#B45309';
                rBg = '#FEF3C7';
              } else if (r === 'not_done' || r === 'no') {
                rLabel = obs.evaluatedType === 'coordenador' ? 'Não / Não Realizado' : 'Não Realizado';
                rColor = '#991B1B';
                rBg = '#FEE2E2';
              } else if (r === 'na' || r === 'nao_observado') {
                rLabel = 'Não se Aplica (N/A)';
                rColor = '#475569';
                rBg = '#F1F5F9';
              }

              rubricsHtml += `<div class="print-rubric-item" style="margin-bottom:8px; font-size:11px; padding:8px 10px; border:1px solid #CBD5E1; border-radius:4px; background:#F8FAFC; page-break-inside:avoid;">`;
              rubricsHtml += `<div style="margin-bottom:4px; font-weight:600; color:#334155;">[${c.id}] ${c.text}</div>`;
              rubricsHtml += `<div>Resposta: <span style="font-weight:700; color:${rColor}; background:${rBg}; padding:2px 8px; border-radius:4px; border:1px solid ${rColor}33; display:inline-block; margin-left:4px;">${rLabel}</span></div>`;
              
              const commentText = (obs.criterionComments && obs.criterionComments[c.id]) || (obs.notes && obs.notes[c.id]);
              if (commentText) {
                rubricsHtml += `<div style="margin-top:4px; font-style:italic; color:#475569; border-top:1px solid #E2E8F0; padding-top:4px;">Obs: ${commentText}</div>`;
              }

              // Injeção de Evidências Fotográficas do Critério no Relatório Impresso
              const critPhotos = (obs.photos && obs.photos[c.id]) ? obs.photos[c.id] : [];
              if (critPhotos.length > 0) {
                rubricsHtml += `<div class="photo-evidence-bar" style="margin-top:8px;">`;
                critPhotos.forEach((photoUri, pIdx) => {
                  rubricsHtml += `
                    <div class="photo-thumb-wrapper">
                      <img src="${photoUri}" alt="Evidência ${c.id} - Foto ${pIdx + 1}" onclick="previewImage('${photoUri}')">
                    </div>
                  `;
                });
                rubricsHtml += `</div>`;
              }

              rubricsHtml += `</div>`;
            });
            rubricsHtml += `</div>`;
          });
          rubricsHtml += `</div>`;
        });

        // Injeção de Evidências Gerais da Observação no Relatório Impresso
        if (obs.photos && obs.photos['geral'] && obs.photos['geral'].length > 0) {
          rubricsHtml += `<div style="margin-top:16px; margin-bottom:16px; page-break-inside:avoid;">`;
          rubricsHtml += `<h4 style="font-size:14px; font-weight:700; background:#E2E8F0; padding:6px 10px; border-radius:4px; color:#1E293B;">Evidências Gerais da Observação Pedagógica</h4>`;
          rubricsHtml += `<div class="photo-evidence-bar" style="margin-top:8px;">`;
          obs.photos['geral'].forEach((pUri, pIdx) => {
            rubricsHtml += `
              <div class="photo-thumb-wrapper">
                <img src="${pUri}" alt="Evidência Geral - Foto ${pIdx + 1}" onclick="previewImage('${pUri}')">
              </div>
            `;
          });
          rubricsHtml += `</div></div>`;
        }

        rubricsPrintContainer.innerHTML = rubricsHtml;
      }
    }

    function onSynthesisTimeChange() {
      const obs = appState.currentObs;
      if (!obs || appState.isReadOnly) return;

      const dateEl = document.getElementById('synthesisDate');
      const startEl = document.getElementById('synthesisStartTime');
      const endEl = document.getElementById('synthesisEndTime');
      const hintEl = document.getElementById('synthesisTimeValidationHint');
      const todayStr = getTodayDateString();

      if (dateEl && dateEl.value && dateEl.value > todayStr) {
        showToast(`Ação bloqueada: A data da observação não pode ser futura. Ajustada para ${formatDateBR(todayStr)}.`);
        dateEl.value = todayStr;
      }

      const dateVal = dateEl ? dateEl.value : (obs.date || todayStr);
      const startVal = startEl ? startEl.value : obs.startTime;
      const endVal = endEl ? endEl.value : obs.endTime;

      let hasError = false;
      if (startVal && endVal) {
        if (endVal <= startVal) {
          hasError = true;
          if (hintEl) {
            hintEl.style.display = 'block';
            hintEl.style.color = '#DC2626';
            hintEl.innerHTML = '🚫 <strong>Horário Inconsistente:</strong> O horário de término deve ser posterior ao horário de início.';
          }
        }
      }

      if (!hasError && hintEl) {
        hintEl.style.display = 'none';
      }

      obs.date = dateVal;
      obs.startDate = dateVal;
      obs.endDate = dateVal;
      obs.startTime = startVal;
      obs.endTime = endVal;

      if (!hasError && startVal && endVal) {
        obs.durationMinutes = calculateObservationDuration(obs);
      } else {
        obs.durationMinutes = null;
      }

      recalculateSynthesisDuration();
      saveState();
    }

    function saveDraftAndExit() {
      // Bloqueio rigoroso: nunca salvar como rascunho observações que já estão finalizadas
      if (appState.currentObs && (appState.currentObs.status === 'finalized' || appState.currentObs.status === 'concluida' || appState.isReadOnly)) {
        navigateToTab('history');
        return;
      }

      if (appState.currentObs) {
        const todayStr = getTodayDateString();
        const dateEl = document.getElementById('synthesisDate');
        const startEl = document.getElementById('synthesisStartTime');
        const endEl = document.getElementById('synthesisEndTime');

        if (dateEl && dateEl.value) {
          appState.currentObs.startDate = dateEl.value;
          appState.currentObs.endDate = dateEl.value;
          appState.currentObs.date = dateEl.value;
        } else if (!appState.currentObs.startDate) {
          appState.currentObs.startDate = appState.currentObs.date || todayStr;
          appState.currentObs.date = appState.currentObs.startDate;
        }

        if (startEl && startEl.value) {
          appState.currentObs.startTime = startEl.value;
        } else if (!appState.currentObs.startTime) {
          appState.currentObs.startTime = getNowTimeString();
        }

        if (endEl && endEl.value) {
          appState.currentObs.endTime = endEl.value;
        }

        if (appState.currentObs.startTime && appState.currentObs.endTime && appState.currentObs.endTime > appState.currentObs.startTime) {
          appState.currentObs.durationMinutes = calculateObservationDuration(appState.currentObs);
        }

        recalculateSynthesisDuration();
      }
      saveState();
      showToast('Rascunho salvo com sucesso!');
      navigateToTab('home');
    }

    function recalculateSynthesisDuration() {
      const obs = appState.currentObs;
      if (!obs) return;
      const durText = document.getElementById('synthesisDurationText');
      if (!durText) return;

      const dateEl = document.getElementById('synthesisDate');
      const startEl = document.getElementById('synthesisStartTime');
      const endEl = document.getElementById('synthesisEndTime');

      const sTime = (startEl && startEl.value) ? startEl.value : obs.startTime;
      const eTime = (endEl && endEl.value) ? endEl.value : obs.endTime;

      if (!sTime || !eTime) {
        durText.innerText = 'Aguardando horário de término';
        return;
      }

      if (eTime <= sTime) {
        durText.innerText = 'Horário inválido';
        return;
      }

      const tempObs = {
        startDate: (dateEl && dateEl.value) ? dateEl.value : (obs.startDate || obs.date || getTodayDateString()),
        endDate: (dateEl && dateEl.value) ? dateEl.value : (obs.endDate || obs.date || getTodayDateString()),
        startTime: sTime,
        endTime: eTime
      };

      const durationMins = calculateObservationDuration(tempObs);
      const hours = Math.floor(durationMins / 60);
      const mins = durationMins % 60;
      durText.innerText = hours > 0 ? `${hours}h ${mins}min (${durationMins} minutos)` : `${mins} minutos`;
    }

    // PILAR 4: Recalcula horários e soma acumulada para Turmas em Tempo Integral
    function onSynthesisIntegralTimeChange() {
      const obs = appState.currentObs;
      if (!obs || !obs.isIntegral) return;

      const mStartEl = document.getElementById('synthesisMorningStartTime');
      const mEndEl = document.getElementById('synthesisMorningEndTime');
      const mDurText = document.getElementById('synthesisMorningDurationText');

      const aStartEl = document.getElementById('synthesisAfternoonStartTime');
      const aEndEl = document.getElementById('synthesisAfternoonEndTime');
      const aDurText = document.getElementById('synthesisAfternoonDurationText');

      const totalDurText = document.getElementById('synthesisIntegralTotalDurationText');

      const todayStr = getTodayDateString();
      const curDate = obs.startDate || obs.date || todayStr;

      let mDur = 0;
      const mStart = (mStartEl && mStartEl.value) ? mStartEl.value : (obs.morningObs?.startTime || '08:00');
      const mEnd = (mEndEl && mEndEl.value) ? mEndEl.value : (obs.morningObs?.endTime || '11:30');
      if (mStart && mEnd && mEnd > mStart) {
        mDur = calculateObservationDuration({ startDate: curDate, endDate: curDate, startTime: mStart, endTime: mEnd });
        if (mDurText) {
          const h = Math.floor(mDur / 60);
          const m = mDur % 60;
          mDurText.innerText = h > 0 ? `Duração: ${h}h ${m}min (${mDur}m)` : `Duração: ${mDur}m`;
        }
      } else if (mDurText) {
        mDurText.innerText = 'Duração: --';
      }

      let aDur = 0;
      const aStart = (aStartEl && aStartEl.value) ? aStartEl.value : (obs.afternoonObs?.startTime || '13:30');
      const aEnd = (aEndEl && aEndEl.value) ? aEndEl.value : (obs.afternoonObs?.endTime || '16:30');
      if (aStart && aEnd && aEnd > aStart) {
        aDur = calculateObservationDuration({ startDate: curDate, endDate: curDate, startTime: aStart, endTime: aEnd });
        if (aDurText) {
          const h = Math.floor(aDur / 60);
          const m = aDur % 60;
          aDurText.innerText = h > 0 ? `Duração: ${h}h ${m}min (${aDur}m)` : `Duração: ${aDur}m`;
        }
      } else if (aDurText) {
        aDurText.innerText = 'Duração: --';
      }

      const totalMins = mDur + aDur;
      if (totalDurText) {
        if (totalMins > 0) {
          const h = Math.floor(totalMins / 60);
          const m = totalMins % 60;
          totalDurText.innerText = h > 0 ? `${h}h ${m}min (${totalMins} minutos somados)` : `${totalMins} minutos`;
        } else {
          totalDurText.innerText = '--';
        }
      }

      // Atualiza valores parciais no objeto em memória
      if (!obs.morningObs) obs.morningObs = {};
      obs.morningObs.startTime = mStart;
      obs.morningObs.endTime = mEnd;
      obs.morningObs.durationMinutes = mDur;

      if (!obs.afternoonObs) obs.afternoonObs = {};
      obs.afternoonObs.startTime = aStart;
      obs.afternoonObs.endTime = aEnd;
      obs.afternoonObs.durationMinutes = aDur;

      obs.totalIntegralDurationMinutes = totalMins;
      saveState();
    }

    // PILAR 4: Salva a Etapa 1 (Turno Matutino) como rascunho com transição para o turno vespertino
    function saveMorningStageAndExit() {
      const obs = appState.currentObs;
      if (!obs || !obs.isIntegral) return;

      const mStartEl = document.getElementById('synthesisMorningStartTime');
      const mEndEl = document.getElementById('synthesisMorningEndTime');
      const todayStr = getTodayDateString();
      const mDate = obs.startDate || obs.date || todayStr;
      const mStart = (mStartEl && mStartEl.value) ? mStartEl.value : (obs.morningObs?.startTime || '08:00');
      const mEnd = (mEndEl && mEndEl.value) ? mEndEl.value : (obs.morningObs?.endTime || '11:30');

      if (!mStart) {
        showToast('Informe o horário de início da observação matutina.');
        if (mStartEl) mStartEl.focus();
        return;
      }
      if (!mEnd) {
        showToast('Informe o horário de término da observação matutina.');
        if (mEndEl) mEndEl.focus();
        return;
      }
      if (mEnd <= mStart) {
        showToast('Horário matutino inválido: o término deve ser posterior ao início da manhã.');
        if (mEndEl) mEndEl.focus();
        return;
      }

      const mDur = calculateObservationDuration({ startDate: mDate, endDate: mDate, startTime: mStart, endTime: mEnd });

      if (!obs.morningObs) obs.morningObs = {};
      obs.morningObs.date = mDate;
      obs.morningObs.startTime = mStart;
      obs.morningObs.endTime = mEnd;
      obs.morningObs.durationMinutes = mDur;
      obs.morningObs.completed = true;
      obs.morningObs.completedAt = new Date().toISOString();

      // Transiciona etapa
      obs.integralStage = 'vespertino';
      obs.startTime = mStart;
      obs.endTime = mEnd;
      obs.durationMinutes = mDur;

      const commentsEl = document.getElementById('synthesisGeneralComments');
      if (commentsEl) obs.comments = commentsEl.value;

      saveState();
      showToast('Turno matutino salvo com sucesso! O formulário foi guardado como rascunho. Retome no turno vespertino para registrar as práticas da tarde e concluir a turma.');
      navigateToTab('home');
    }

    function addMinutesToTime(timeStr, minsToAdd) {
      const [h, m] = timeStr.split(':').map(Number);
      const total = h * 60 + m + minsToAdd;
      const finalH = Math.floor(total / 60) % 24;
      const finalM = total % 60;
      return `${String(finalH).padStart(2, '0')}:${String(finalM).padStart(2, '0')}`;
    }

    // PILAR 5: Manipulação Reativa das Dimensões no Bloco Nominal do Docente
    function setTeacherSynthesisDimension(teacherName, dimKey, rating) {
      if (appState.isReadOnly || !appState.currentObs) return;
      const obs = appState.currentObs;

      // BLINDAGEM DE TURNO: Em turma integral na etapa matutina, bloqueia avaliação de docentes da tarde!
      if (obs.isIntegral && obs.integralStage === 'matutino') {
        const afternoonTeachers = obs.teachersAfternoon || [];
        if (afternoonTeachers.includes(teacherName)) {
          showToast(`Ação bloqueada: ${teacherName} pertence ao turno vespertino e só pode ser avaliada na Etapa 2 (Tarde).`);
          return;
        }
      }

      if (!obs.teacherSynthesis) obs.teacherSynthesis = {};
      if (!obs.teacherSynthesis[teacherName]) {
        obs.teacherSynthesis[teacherName] = {
          dimensions: {},
          feedback: ''
        };
      }
      if (!obs.teacherSynthesis[teacherName].dimensions) {
        obs.teacherSynthesis[teacherName].dimensions = {};
      }
      obs.teacherSynthesis[teacherName].dimensions[dimKey] = rating;
      saveState();
      renderSynthesisScreen(true);
    }

    // PILAR 5: Manipulação Reativa do Parecer Individual no Bloco Nominal do Docente
    function setTeacherSynthesisFeedback(teacherName, feedbackText) {
      if (appState.isReadOnly || !appState.currentObs) return;
      const obs = appState.currentObs;

      // BLINDAGEM DE TURNO: Em turma integral na etapa matutina, bloqueia parecer de docentes da tarde!
      if (obs.isIntegral && obs.integralStage === 'matutino') {
        const afternoonTeachers = obs.teachersAfternoon || [];
        if (afternoonTeachers.includes(teacherName)) {
          showToast(`Ação bloqueada: ${teacherName} pertence ao turno vespertino e só pode receber parecer na Etapa 2 (Tarde).`);
          return;
        }
      }

      if (!obs.teacherSynthesis) obs.teacherSynthesis = {};
      if (!obs.teacherSynthesis[teacherName]) {
        obs.teacherSynthesis[teacherName] = {
          dimensions: {},
          feedback: ''
        };
      }
      obs.teacherSynthesis[teacherName].feedback = feedbackText;
      saveState();
    }

    function importNotesIntoSynthesis() {
      const obs = appState.currentObs;
      if (!obs || appState.isReadOnly) return;

      // 1. FILTRAGEM INTEGRADA: Ocorrências da Turma, da Observação ou dos Docentes da Turma
      const matchingNotes = appState.notes.filter(n => 
        !n.isSample && 
        n.schoolName === obs.schoolName && 
        (
          (n.className && obs.className && n.className === obs.className) ||
          (n.obsId && n.obsId === obs.id) ||
          (n.teacherName && obs.teacherName && (n.teacherName === obs.teacherName || obs.teacherName.includes(n.teacherName))) ||
          (n.teachers && obs.teachers && n.teachers.some(t => obs.teachers.includes(t)))
        )
      );

      const targetLabel = obs.className ? `Turma ${obs.className}` : (obs.teacherName || 'observação');

      if (matchingNotes.length === 0) {
        showToast(`Nenhuma ocorrência encontrada para ${targetLabel}.`);
        return;
      }

      if (!obs.linkedNotes) obs.linkedNotes = [];
      let importedCount = 0;

      // 2. Priorização inteligente: ocorrências da observação atual (obsId) ou da turma são incorporadas
      matchingNotes.forEach(n => {
        const text = `[${n.topic} · ${n.teacherName || n.className || 'Geral'}] ${n.content}`;
        if (!obs.linkedNotes.includes(text)) {
          obs.linkedNotes.push(text);
          importedCount++;
        }
      });

      saveState();
      renderSynthesisScreen();

      if (importedCount > 0) {
        showToast(`${importedCount} ocorrência(s) vinculada(s) à síntese com sucesso!`);
      } else {
        showToast(`As ocorrências de ${targetLabel} já constam vinculadas a esta síntese.`);
      }
    }

    function removeLinkedNoteFromSynthesis(idx) {
      const obs = appState.currentObs;
      if (!obs || appState.isReadOnly) return;
      obs.linkedNotes.splice(idx, 1);
      saveState();
      renderSynthesisScreen();
    }

    function finalizeObservation() {
      const obs = appState.currentObs;
      if (!obs) return;

      const pendencies = getObservationPendencies(obs);
      if (pendencies.length > 0) {
        showToast(`Impossível enviar: faltam ${pendencies.length} itens a responder.`);
        goToFirstPending();
        return;
      }

      if (obs.evaluatedType !== 'coordenador') {
        if (!obs.synthesisMaterialDimension) {
          showToast('Selecione o Nível de Predominância de Materiais antes de concluir.');
          return;
        }
        if (!obs.synthesisPredominant) {
          showToast('Selecione o Tipo de Material Predominante antes de concluir.');
          return;
        }
        if (!obs.synthesisOrg) {
          showToast('Selecione o Tipo de Organização do Grupo antes de concluir.');
          return;
        }
      }

      // PILAR 4: Validação mandatória de Turmas em Tempo Integral (Duas Etapas: Manhã e Tarde)
      if (obs.isIntegral) {
        if (obs.integralStage === 'matutino' || !obs.morningObs || !obs.morningObs.completed) {
          showToast('Ação bloqueada: Para turmas de Tempo Integral, é obrigatório registrar os dois turnos (Manhã e Tarde). Salve a etapa matutina e retome à tarde.');
          return;
        }

        const aStartEl = document.getElementById('synthesisAfternoonStartTime');
        const aEndEl = document.getElementById('synthesisAfternoonEndTime');
        const todayStr = getTodayDateString();
        const aDate = obs.endDate || obs.startDate || obs.date || todayStr;
        const aStart = (aStartEl && aStartEl.value) ? aStartEl.value : (obs.afternoonObs?.startTime || '13:30');
        const aEnd = (aEndEl && aEndEl.value) ? aEndEl.value : (obs.afternoonObs?.endTime || '16:30');

        if (!aStart) {
          showToast('Informe o horário de início do turno vespertino (tarde).');
          if (aStartEl) aStartEl.focus();
          return;
        }
        if (!aEnd) {
          showToast('Informe o horário de término do turno vespertino antes de finalizar.');
          if (aEndEl) aEndEl.focus();
          return;
        }
        if (aEnd <= aStart) {
          showToast('Ação bloqueada: O horário de término da tarde deve ser posterior ao horário de início da tarde.');
          if (aEndEl) aEndEl.focus();
          return;
        }

        const aDur = calculateObservationDuration({ startDate: aDate, endDate: aDate, startTime: aStart, endTime: aEnd });
        if (!obs.afternoonObs) obs.afternoonObs = {};
        obs.afternoonObs.date = aDate;
        obs.afternoonObs.startTime = aStart;
        obs.afternoonObs.endTime = aEnd;
        obs.afternoonObs.durationMinutes = aDur;
        obs.afternoonObs.completed = true;
        obs.afternoonObs.completedAt = new Date().toISOString();

        obs.totalIntegralDurationMinutes = (obs.morningObs.durationMinutes || 0) + aDur;
        obs.durationMinutes = obs.totalIntegralDurationMinutes;
        obs.integralStage = 'concluido';
        obs.endDate = aDate;
        obs.endTime = aEnd;
      }

      // Validação rigorosa dos horários anotados pelo docente/coordenador
      const dateEl = document.getElementById('synthesisDate');
      const startEl = document.getElementById('synthesisStartTime');
      const endEl = document.getElementById('synthesisEndTime');
      const todayStr = getTodayDateString();

      const finalDate = (dateEl && dateEl.value) ? dateEl.value : (obs.startDate || obs.date || todayStr);
      const finalStart = (startEl && startEl.value) ? startEl.value : obs.startTime;
      const finalEnd = (endEl && endEl.value) ? endEl.value : obs.endTime;

      if (!finalDate) {
        showToast('Informe a data da observação antes de finalizar.');
        return;
      }
      if (finalDate > todayStr) {
        showToast('Ação bloqueada: A data da observação não pode ser futura.');
        return;
      }
      if (!finalStart) {
        showToast('Informe o horário de início da observação.');
        return;
      }
      if (!finalEnd) {
        showToast('Informe o horário de término da observação antes de concluir.');
        if (endEl) endEl.focus();
        return;
      }
      if (finalEnd <= finalStart) {
        showToast('Ação bloqueada: O horário de término deve ser posterior ao horário de início.');
        if (endEl) endEl.focus();
        return;
      }

      // PILAR 5: Validação mandatória dos blocos nominais de docentes regentes na observação de turma
      if (obs.evaluatedType === 'turma') {
        const teachers = (obs.teachers && obs.teachers.length > 0)
          ? obs.teachers
          : (obs.teacherName ? [obs.teacherName] : []);
        
        if (!obs.teacherSynthesis) obs.teacherSynthesis = {};

        const dimKeys = ['estrategias', 'gestao_grupo', 'mediacao_individual', 'respeito_integridade', 'gestao_cuidados'];
        const dimDisplayNames = {
          estrategias: 'Estratégias Didáticas',
          gestao_grupo: 'Gestão do Grupo',
          mediacao_individual: 'Mediação Individualizada',
          respeito_integridade: 'Respeito e Proteção',
          gestao_cuidados: 'Gestão dos Cuidados'
        };

        for (let i = 0; i < teachers.length; i++) {
          const tName = teachers[i];
          const synth = obs.teacherSynthesis[tName] || { dimensions: {}, feedback: '' };
          const dims = synth.dimensions || {};

          for (let k = 0; k < dimKeys.length; k++) {
            const dk = dimKeys[k];
            if (!dims[dk]) {
              showToast(`Ação bloqueada: Avalie a dimensão "${dimDisplayNames[dk]}" para ${tName}.`);
              const cardEl = document.getElementById(`teacher-synthesis-card-${i}`);
              if (cardEl) {
                cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                cardEl.style.boxShadow = '0 0 0 3px #F59E0B';
                setTimeout(() => cardEl.style.boxShadow = '', 2500);
              }
              return;
            }
          }

          if (!synth.feedback || synth.feedback.trim().length === 0) {
            showToast(`Ação bloqueada: Registre o parecer pedagógico formativo individual para ${tName}.`);
            const fbEl = document.getElementById(`teacherFeedback-${i}`);
            if (fbEl) fbEl.focus();
            return;
          }
        }
      }

      // Atribuição fidedigna dos dados manuais (SEM sobrescrever com hora do relógio)
      obs.status = 'finalized';
      obs.startDate = finalDate;
      obs.endDate = finalDate;
      obs.date = finalDate;
      obs.startTime = finalStart;
      obs.endTime = finalEnd;
      obs.durationMinutes = calculateObservationDuration(obs);

      const commentsEl = document.getElementById('synthesisGeneralComments');
      if (commentsEl) obs.comments = commentsEl.value;

      appState.isReadOnly = true;

      // Atualiza o status do agendamento correspondente para 'realizado' (Pilar 1 e individual) e vincula observationId
      let sched = null;
      if (obs.scheduleId) {
        sched = appState.schedules.find(s => s.id === obs.scheduleId);
      }
      if (!sched) {
        sched = appState.schedules.find(s => 
          ((s.targetName && (s.targetName === obs.teacherName || (obs.teachers && obs.teachers.includes(s.targetName)))) ||
           (s.className && s.className === obs.className) ||
           (s.schoolName === obs.schoolName && obs.teachers && obs.teachers.includes(s.targetName))) &&
          s.bimester === obs.bimester && !s.archived
        );
      }
      if (sched) {
        sched.status = 'realizado';
        sched.observationId = obs.id;
        sched.plannedDate = obs.date;
        sched.date = obs.date;
        if (obs.startTime) sched.plannedTime = obs.startTime;
      }

      saveState();
      showToast('Observação finalizada com sucesso!');
      navigateToTab('history', 'finalized');
    }

    // PILAR 5: Exportação Parametrizada de PDF Segregado
    function exportSynthesisToPdf() {
      const obs = appState.currentObs;
      if (!obs) return;

      if (obs.evaluatedType === 'turma') {
        openExportPdfModal();
      } else {
        // Observação de coordenação: dispara impressão direta padrão
        renderSynthesisScreen(true);
        setTimeout(() => {
          window.print();
        }, 100);
      }
    }

    function openExportPdfModal() {
      const obs = appState.currentObs;
      if (!obs) return;

      const modal = document.getElementById('modalExportPdfOptions');
      const listContainer = document.getElementById('modalExportPdfTeachersList');
      if (!modal || !listContainer) return;

      listContainer.innerHTML = '';
      const teachers = (obs.teachers && obs.teachers.length > 0)
        ? obs.teachers
        : (obs.teacherName ? [obs.teacherName] : []);

      teachers.forEach(tName => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-primary';
        btn.style.cssText = 'width:100%; justify-content:center; padding:10px 14px; font-weight:700; font-size:13px; display:inline-flex; align-items:center; gap:8px;';
        btn.innerHTML = `🖨️ Imprimir Ficha Devolutiva: ${tName}`;
        btn.onclick = () => {
          closeExportPdfModal();
          printIndividualTeacherDevolutiva(tName);
        };
        listContainer.appendChild(btn);
      });

      modal.classList.add('active');
    }

    function closeExportPdfModal() {
      const modal = document.getElementById('modalExportPdfOptions');
      if (modal) modal.classList.remove('active');
    }

    function printIntegratedClassReport() {
      closeExportPdfModal();
      if (appState.currentObs) {
        renderSynthesisScreen(true);
      }
      setTimeout(() => {
        window.print();
      }, 150);
    }

    // PILAR 5: Renderização e Impressão da Ficha Formativa Individual do Docente
    function printIndividualTeacherDevolutiva(teacherName, autoPrint = true) {
      const obs = appState.currentObs;
      if (!obs) return;

      const printContainer = document.getElementById('teacherIndividualDevolutivaPrintSection');
      if (!printContainer) return;

      const synth = (obs.teacherSynthesis && obs.teacherSynthesis[teacherName]) || { dimensions: {}, feedback: '' };
      const dims = synth.dimensions || {};

      // Coleta critérios parciais atribuídos
      const assignedPartialItems = [];
      const responses = obs.responses || {};
      const attributions = obs.partialAttributions || {};
      const sections = getActiveSections(obs);

      Object.keys(responses).forEach(critId => {
        if (responses[critId] === 'partial') {
          const attr = attributions[critId];
          if (attr && Array.isArray(attr.teachers) && attr.teachers.includes(teacherName)) {
            let critObj = null;
            sections.forEach(s => s.subSections.forEach(sub => sub.criteria.forEach(c => {
              if (c.id === critId) critObj = c;
            })));
            assignedPartialItems.push({
              id: critId,
              text: critObj ? critObj.text : `Critério ${critId}`,
              justification: attr.justification || 'Sem justificativa registrada.'
            });
          }
        }
      });

      const dimDisplayList = [
        { key: 'estrategias', title: 'Estratégias Didáticas' },
        { key: 'gestao_grupo', title: 'Gestão do Grupo e Ambiente' },
        { key: 'mediacao_individual', title: 'Mediação Individualizada' },
        { key: 'respeito_integridade', title: 'Respeito, Diversidade e Proteção à Integridade' },
        { key: 'gestao_cuidados', title: 'Gestão dos Cuidados e Promoção da Autonomia' }
      ];

      const formatDimRating = (val) => {
        if (val === 'consistent') return '<strong style="color:#166534; background:#DCFCE7; padding:2px 8px; border-radius:4px;">Consistente</strong>';
        if (val === 'partial') return '<strong style="color:#B45309; background:#FEF3C7; padding:2px 8px; border-radius:4px;">Parcial</strong>';
        if (val === 'not_done') return '<strong style="color:#991B1B; background:#FEE2E2; padding:2px 8px; border-radius:4px;">Não Realizado</strong>';
        return '<span style="color:#64748B;">Não Avaliado</span>';
      };

      const todayStr = new Date().toLocaleDateString('pt-BR');
      const obsDateFormatted = formatObservationDateRange(obs) || formatDateBR(obs.date || getTodayDateString());

      let html = `
        <div style="font-family:inherit; padding:15px; color:#1E293B;">
          <!-- Cabeçalho Oficial Institucional -->
          <div style="border-bottom: 2.5px solid #004C99; padding-bottom: 12px; margin-bottom: 16px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div>
                <div style="font-size:16pt; font-weight:800; color:#004C99; text-transform:uppercase; letter-spacing:0.5px;">
                  Prefeitura Municipal de Patos · Paraíba
                </div>
                <div style="font-size:11pt; font-weight:700; color:#334155; margin-top:2px;">
                  Secretaria Municipal de Educação · Programa SerTão Criança
                </div>
                <div style="font-size:10pt; color:#64748B; font-weight:600;">
                  Ficha Individual de Devolutiva Pedagógica e Acompanhamento Formativo
                </div>
              </div>
              <div style="text-align:right; font-size:9pt; color:#64748B;">
                <strong>Emissão Oficial</strong><br>
                Data: ${todayStr}
              </div>
            </div>
          </div>

          <!-- Dossiê do Docente e da Observação -->
          <div style="border:1px solid #CBD5E1; border-radius:8px; padding:12px; margin-bottom:16px; background:#F8FAFC;">
            <table style="width:100%; font-size:10pt; border-collapse:collapse;">
              <tr>
                <td style="padding:4px 8px; width:50%;"><strong>Docente Regente:</strong> ${teacherName}</td>
                <td style="padding:4px 8px; width:50%;"><strong>Unidade Escolar:</strong> ${obs.schoolName || '--'}</td>
              </tr>
              <tr>
                <td style="padding:4px 8px;"><strong>Turma / Turno:</strong> ${obs.className || '--'} (${obs.classShift || 'Parcial'})</td>
                <td style="padding:4px 8px;"><strong>Bimestre:</strong> ${obs.bimester || '--'}</td>
              </tr>
              <tr>
                <td style="padding:4px 8px;"><strong>Data da Observação:</strong> ${obsDateFormatted}</td>
                <td style="padding:4px 8px;"><strong>Avaliador(a):</strong> ${obs.evaluatedBy || '--'}</td>
              </tr>
            </table>
          </div>

          <!-- Tabela de Avaliação das 5 Dimensões -->
          <div style="margin-bottom:18px;">
            <div style="font-size:11pt; font-weight:800; color:#004C99; text-transform:uppercase; margin-bottom:8px; border-bottom:1.5px solid #CBD5E1; padding-bottom:4px;">
              1. Avaliação Estruturante das 5 Dimensões da Prática Docente
            </div>
            <table style="width:100%; border-collapse:collapse; font-size:10pt;">
              <thead>
                <tr style="background:#F1F5F9;">
                  <th style="border:1px solid #CBD5E1; padding:8px 10px; text-align:left; width:70%;">Dimensão da Prática Pedagógica</th>
                  <th style="border:1px solid #CBD5E1; padding:8px 10px; text-align:center; width:30%;">Conceito Alcançado</th>
                </tr>
              </thead>
              <tbody>
      `;

      dimDisplayList.forEach(d => {
        html += `
          <tr>
            <td style="border:1px solid #CBD5E1; padding:8px 10px; font-weight:600;">${d.title}</td>
            <td style="border:1px solid #CBD5E1; padding:8px 10px; text-align:center;">${formatDimRating(dims[d.key])}</td>
          </tr>
        `;
      });

      html += `
              </tbody>
            </table>
          </div>

          <!-- Relatório de Fragilidades Pontuais e Oportunidades (Itens Parciais Atribuídos) -->
          <div style="margin-bottom:18px; page-break-inside:avoid;">
            <div style="font-size:11pt; font-weight:800; color:#B45309; text-transform:uppercase; margin-bottom:8px; border-bottom:1.5px solid #FDE68A; padding-bottom:4px;">
              2. Evidências de Oportunidades de Aprendizagem (Critérios Parciais Atribuídos)
            </div>
      `;

      if (assignedPartialItems.length === 0) {
        html += `
          <div style="border:1px solid #BBF7D0; background:#DCFCE7; color:#166534; padding:10px 14px; border-radius:6px; font-size:10pt;">
            ✓ <strong>Prática Segura:</strong> Nenhum critério individual recebeu pontuação parcial durante este ciclo de acompanhamento na turma.
          </div>
        `;
      } else {
        html += `
          <table style="width:100%; border-collapse:collapse; font-size:9.5pt;">
            <thead>
              <tr style="background:#FEF3C7; color:#92400E;">
                <th style="border:1px solid #FDE68A; padding:6px 8px; text-align:left; width:15%;">Item</th>
                <th style="border:1px solid #FDE68A; padding:6px 8px; text-align:left; width:45%;">Critério da Matriz</th>
                <th style="border:1px solid #FDE68A; padding:6px 8px; text-align:left; width:40%;">Evidência / Justificativa Anotada</th>
              </tr>
            </thead>
            <tbody>
        `;
        assignedPartialItems.forEach(item => {
          html += `
            <tr>
              <td style="border:1px solid #CBD5E1; padding:6px 8px; font-weight:700;">Item ${item.id}</td>
              <td style="border:1px solid #CBD5E1; padding:6px 8px;">${item.text}</td>
              <td style="border:1px solid #CBD5E1; padding:6px 8px; font-style:italic;">"${item.justification}"</td>
            </tr>
          `;
        });
        html += `
            </tbody>
          </table>
        `;
      }

      html += `
          </div>

          <!-- Parecer Formativo e Combinados -->
          <div style="margin-bottom:24px; page-break-inside:avoid;">
            <div style="font-size:11pt; font-weight:800; color:#004C99; text-transform:uppercase; margin-bottom:8px; border-bottom:1.5px solid #CBD5E1; padding-bottom:4px;">
              3. Parecer Pedagógico Formativo Individual e Combinados de Desenvolvimento
            </div>
            <div style="border:1px solid #CBD5E1; border-radius:8px; padding:12px; font-size:10pt; line-height:1.5; background:#FFFFFF; min-height:80px;">
              ${synth.feedback ? synth.feedback.replace(/\n/g, '<br>') : '<em style="color:#64748B;">Nenhum parecer formativo individual registrado.</em>'}
            </div>
          </div>

          <!-- Bloco Oficial de Assinaturas e Ciência -->
          <div class="print-signatures-box" style="margin-top:35px; page-break-inside:avoid;">
            <div class="print-signature-line">
              <span style="font-weight:700;">${obs.evaluatedBy || 'Supervisor(a) Pedagógico(a)'}</span><br>
              Avaliador(a) / Coordenação Pedagógica
            </div>
            <div class="print-signature-line">
              <span style="font-weight:700;">${teacherName}</span><br>
              Docente Regente Titular Acompanhada (Ciência)
            </div>
          </div>
        </div>
      `;

      printContainer.innerHTML = html;

      // Se autoPrint for falso (ex: testes automatizados/auditoria), interrompe aqui
      // garantindo que o DOM seja montado para inspeção sem acionar a impressora física
      if (!autoPrint) {
        return;
      }

      // Dispara impressão isolada via classe no body
      document.body.classList.add('printing-teacher-devolutiva');
      setTimeout(() => {
        window.print();
        setTimeout(() => {
          document.body.classList.remove('printing-teacher-devolutiva');
        }, 1000);
      }, 150);
    }

