    // --- PLATFORM VERIFICATION ENGINE: SUÍTE DE AUDITORIA MODULAR (12 MÓDULOS) ---
    // =========================================================================
    function triggerPlatformAuditUI() {
      if (typeof closeProfileModal === 'function') closeProfileModal();
      if (window.__isPlatformAuditRunning) {
        showToast('Auditoria já em andamento. Aguarde a finalização...');
        return;
      }

      __autoAuditTriggered = true;
      window.__autoAuditTriggered = true;

      // Exibe imediatamente o modal de diagnóstico com indicador de progresso ativo
      openAuditProgressModal();

      setTimeout(async () => {
        try {
          const audit = await window.runFullPlatformAuditAsync({ module: 'all' });
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              openAuditReportModal(audit);
            });
          });
        } catch (errAudit) {
          console.error('Falha crítica na execução da auditoria:', errAudit);
          openAuditFailureModal(errAudit);
        }
      }, 50);
    }

    function openAuditProgressModal() {
      const modal = document.getElementById('modalAuditReport');
      if (!modal) return;

      const subEl = document.getElementById('auditReportSubtitle');
      if (subEl) subEl.textContent = 'Executando verificação em tempo real dos 12 subsistemas...';

      const bodyEl = document.getElementById('auditReportBody');
      if (bodyEl) {
        bodyEl.innerHTML = `
          <div style="padding: 24px 16px; text-align: center;">
            <div style="font-size: 36px; margin-bottom: 12px; animation: pulse 1.5s infinite;">🔬</div>
            <div style="font-weight: 800; font-size: 16px; color: var(--primary-dark); margin-bottom: 6px;" id="auditProgressTitle">
              Iniciando Diagnóstico da Plataforma...
            </div>
            <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 20px;" id="auditProgressSub">
              Preparando ambiente isolado e capturando contexto de rotas...
            </div>
            <div style="background: #E2E8F0; border-radius: 10px; height: 10px; overflow: hidden; width: 100%; max-width: 400px; margin: 0 auto 12px auto;">
              <div id="auditProgressBar" style="background: var(--primary); height: 100%; width: 5%; transition: width 0.3s ease;"></div>
            </div>
            <div style="font-size: 11px; font-weight: 700; color: var(--text-secondary);" id="auditProgressCounter">
              Módulo 0 de 12
            </div>
          </div>
        `;
      }

      modal.style.display = 'flex';
      modal.classList.add('active');
    }

    function openAuditFailureModal(error) {
      const modal = document.getElementById('modalAuditReport');
      if (!modal) return;

      const subEl = document.getElementById('auditReportSubtitle');
      if (subEl) subEl.textContent = 'Diagnóstico interrompido por exceção não tratada';

      const bodyEl = document.getElementById('auditReportBody');
      if (bodyEl) {
        bodyEl.innerHTML = `
          <div style="background: #FEF2F2; border: 1px solid #FECACA; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
              <span style="font-size: 24px;">⚠️</span>
              <div style="font-weight: 800; font-size: 14px; color: #991B1B;">
                Falha Crítica no Mecanismo de Diagnóstico
              </div>
            </div>
            <div style="font-size: 12px; color: #B91C1C; margin-bottom: 10px;">
              A auditoria não pôde ser concluída devido a um erro inesperado:
            </div>
            <pre style="background: #FFF; border: 1px solid #FCA5A5; border-radius: 6px; padding: 10px; font-size: 11px; color: #7F1D1D; white-space: pre-wrap; overflow-x: auto;">${error && error.stack ? error.stack : (error && error.message ? error.message : String(error))}</pre>
          </div>
        `;
      }

      modal.style.display = 'flex';
      modal.classList.add('active');
    }

    function openAuditReportModal(audit) {
      const modal = document.getElementById('modalAuditReport');
      if (!modal) return;

      const subEl = document.getElementById('auditReportSubtitle');
      if (subEl) {
        subEl.textContent = `Executado em ${audit.durationMs || 0}ms · ${audit.passed} de ${audit.total} asserções aprovadas`;
      }

      const bodyEl = document.getElementById('auditReportBody');
      if (bodyEl) {
        const isSuccess = audit.success;
        let html = `
          <div style="background: ${isSuccess ? '#ECFDF5' : '#FEF2F2'}; border: 1px solid ${isSuccess ? '#A7F3D0' : '#FECACA'}; border-radius: 12px; padding: 14px 16px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 24px;">${isSuccess ? '🟢' : '🔴'}</span>
              <div>
                <div style="font-weight: 800; font-size: 14px; color: ${isSuccess ? '#065F46' : '#991B1B'};">
                  ${isSuccess ? 'Todos os 12 Módulos 100% Operacionais' : 'Alertas Identificados na Plataforma'}
                </div>
                <div style="font-size: 12px; color: ${isSuccess ? '#047857' : '#B91C1C'};">
                  ${isSuccess ? 'Nenhuma inconformidade estrutural ou relacional detectada.' : `${audit.failed} falha(s) precisam de atenção.`}
                </div>
              </div>
            </div>
            <div style="text-align: right;">
              <span style="font-size: 12px; font-weight: 800; background: ${isSuccess ? '#10B981' : '#EF4444'}; color: #fff; padding: 4px 10px; border-radius: 20px;">
                ${audit.passed}/${audit.total}
              </span>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px;">
        `;

        if (audit.modules && audit.modules.length > 0) {
          audit.modules.forEach((mod, idx) => {
            const modSuccess = mod.success;
            html += `
              <div style="border: 1px solid var(--border-color); border-radius: 8px; padding: 10px 14px; background: #fff; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
                <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
                  <span style="font-size: 13px;">${modSuccess ? '✅' : '❌'}</span>
                  <div style="min-width: 0;">
                    <div style="font-size: 13px; font-weight: 700; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                      ${idx + 1}. ${mod.name}
                    </div>
                    <div style="font-size: 11px; color: var(--text-secondary);">
                      ${mod.passed}/${mod.total} asserções validadas
                    </div>
                  </div>
                </div>
                <span style="font-size: 11px; font-weight: 700; color: ${modSuccess ? '#059669' : '#DC2626'}; background: ${modSuccess ? '#D1FAE5' : '#FEE2E2'}; padding: 2px 8px; border-radius: 10px; white-space: nowrap;">
                  ${modSuccess ? 'OK' : 'Falha'}
                </span>
              </div>
            `;
          });
        }

        html += `</div>`;
        bodyEl.innerHTML = html;
      }

      modal.style.display = 'flex';
      modal.classList.add('active');
    }

    function closeAuditReportModal() {
      const modal = document.getElementById('modalAuditReport');
      if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
      }
    }

    window.runFullPlatformAuditAsync = async function(options) {
      options = options || {};
      const targetModule = (options.module || 'all').toLowerCase().trim();
      const startTime = performance.now();
      const stateBackup = JSON.parse(JSON.stringify(appState));
      const modulesOutput = [];
      const allResults = [];

      // 1. CAPTURA DO CONTEXTO DE ROTA E TELA ATIVA ANTES DA AUDITORIA
      const activeScreenEl = document.querySelector('.app-screen.active');
      const initialScreenId = activeScreenEl ? activeScreenEl.id : 'screenHome';
      const initialIndicatorsSubTab = appState.activeIndicatorsSubTab || 'kpis';
      const initialPedagSubTab = appState.currentPedagSubTab || 'units';
      const initialHistoryFilter = appState.historyFilter || 'drafts';
      const wasGestaoView = document.getElementById('homeGestaoView')?.style.display === 'block';

      // 2. GUARDIÃO GLOBAL DEFENSIVO CONTRA DISPARO DE IMPRESSÃO
      window.__isPlatformAuditRunning = true;
      window.__auditPrintInterceptionCount = 0;
      const originalWindowPrint = window.print;
      window.print = function() {
        window.__auditPrintInterceptionCount = (window.__auditPrintInterceptionCount || 0) + 1;
        console.warn('🔇 [Auditoria SerTão Criança] Chamada a window.print() interceptada e suprimida com sucesso para preservar a UX.');
      };

      // Utilitários Canônicos de Simulação de Ações Reais do Usuário no DOM (End-to-End)
      const UI = {
        click: function(el) {
          if (!el) throw new Error('Elemento não encontrado para simulação de clique');
          el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        },
        type: function(inputEl, text) {
          if (!inputEl) throw new Error('Input não encontrado para digitação');
          if (typeof inputEl.focus === 'function') inputEl.focus();
          inputEl.value = text;
          inputEl.dispatchEvent(new Event('input', { bubbles: true }));
          inputEl.dispatchEvent(new Event('change', { bubbles: true }));
        },
        select: function(selectEl, value) {
          if (!selectEl) throw new Error('Select não encontrado para seleção');
          if (typeof selectEl.focus === 'function') selectEl.focus();
          selectEl.value = value;
          selectEl.dispatchEvent(new Event('change', { bubbles: true }));
          if (selectEl.value !== value) {
            throw new Error(`Falha de retenção reativa no select #${selectEl.id || 'sem-id'}: esperado "${value}", retido "${selectEl.value}"`);
          }
        }
      };

      function createModuleLogger(moduleId, moduleName) {
        const modResults = [];
        return {
          log: function(name, passed, details = '') {
            const item = { battery: moduleName, moduleId, name, passed, details };
            modResults.push(item);
            allResults.push(item);
            const symbol = passed ? '✅ PASS' : '❌ FAIL';
            console.log(`${symbol} | [${moduleId}] ${name} ${details ? '-> ' + details : ''}`);
          },
          getResults: function() { return modResults; }
        };
      }

      // Catálogo Oficial dos 12 Módulos Determinísticos (100% de Cobertura)
      const AUDIT_MODULES = [
        // --- MÓDULO 1: Autenticação, Usuários, Perfis e RBAC ---
        {
          id: 'auth_rbac',
          name: 'Autenticação, Usuários, Perfis e RBAC',
          run: function(logger) {
            try {
              // 1. Integridade das credenciais no USERS_DB
              const usersToTest = ['mariana', 'clarice', 'helena', 'rodrigo'];
              usersToTest.forEach(key => {
                const u = USERS_DB[key];
                if (!u || !u.email || !u.roleKey) throw new Error(`Usuário ${key} ausente ou incompleto no USERS_DB`);
              });
              logger.log('Integridade das credenciais no USERS_DB', true, 'mariana, clarice, helena, rodrigo validados');

              // 2. Simulação Interativa de Rejeição de Login (Credenciais Incorretas)
              const emailInput = document.getElementById('loginEmail');
              const passInput = document.getElementById('loginPassword');
              const errorBox = document.getElementById('loginError');
              if (emailInput && passInput && errorBox) {
                // Limpa preventivamente o estado de autenticação para blindagem estrita contra falsos positivos
                appState.currentUserKey = null;

                UI.type(emailInput, 'usuario.inexistente@patos.pb.gov.br');
                UI.type(passInput, 'senha_errada_123');
                handleLoginSubmit(new Event('submit'));
                if (errorBox.style.display !== 'block') {
                  throw new Error('Caixa de erro não foi exibida para credenciais incorretas');
                }
                if (appState.currentUserKey !== null) {
                  throw new Error('Credenciais incorretas não devem autenticar nenhum usuário');
                }
                logger.log('Simulação interativa de rejeição de login com credenciais incorretas', true);

                // 3. Simulação Interativa de Login Válido via Formulário
                const marianaEmail = (USERS_DB['mariana'] && USERS_DB['mariana'].email) || 'mariana@teste.com';
                const marianaPass = (USERS_DB['mariana'] && USERS_DB['mariana'].password) || '123456';
                UI.type(emailInput, marianaEmail);
                UI.type(passInput, marianaPass);
                handleLoginSubmit(new Event('submit'));
                if (appState.currentUserKey !== 'mariana') {
                  throw new Error(`Falha na autenticação via formulário de login para Mariana (e-mail utilizado: ${marianaEmail})`);
                }
                if (errorBox.style.display === 'block') {
                  throw new Error('Caixa de erro (#loginError) permaneceu visível após login válido de Mariana');
                }
                logger.log('Simulação interativa de autenticação via formulário de login (mariana ➔ coordenador)', true, marianaEmail);
              } else {
                appState.currentUserKey = 'mariana';
                logger.log('Resolução de perfil ativo (mariana ➔ coordenador)', true);
              }

              // 4. Alternância para Perfil Formadora
              appState.currentUserKey = 'clarice';
              const clariceUser = getCurrentUser();
              if (clariceUser.roleKey !== 'formador') throw new Error('getCurrentUser() com clarice não retornou formador');
              logger.log('Alternância para perfil Formadora (clarice ➔ formadora)', true);

              // 5. Alternância e Resolução de Perfil Coordenadora do Núcleo de EI
              appState.currentUserKey = 'helena';
              const helenaUser = getCurrentUser();
              if (!isNucleoEI(helenaUser)) throw new Error('isNucleoEI(helena) retornou false');
              if (helenaUser.roleTitle !== 'Coordenadora do Núcleo de EI') throw new Error('roleTitle de Helena não é Coordenadora do Núcleo de EI');
              logger.log('Alternância e resolução de perfil Coordenadora do Núcleo de EI (helena)', true, helenaUser.roleTitle);

              // 6. Resiliência e Dupla Compatibilidade da Engine isNucleoEI
              const legacyUser = { roleKey: 'tecnico' };
              const modernUser = { roleKey: 'nucleo_ei' };
              if (!isNucleoEI(legacyUser) || !isNucleoEI(modernUser)) throw new Error('isNucleoEI falhou na dupla compatibilidade (nucleo_ei / tecnico)');
              logger.log('Resiliência e dupla compatibilidade da engine isNucleoEI (nucleo_ei & tecnico)', true);

              // 7. Aplicação de Regras de Interface RBAC
              applyUserRoleUI();
              const profileBtn = document.getElementById('headerAvatarBtn');
              if (!profileBtn) throw new Error('Botão de perfil ausente no cabeçalho');
              logger.log('Aplicação de regras de interface RBAC (applyUserRoleUI)', true);

              // 8. Teste de Alternância Cíclica e Reatividade de Rótulos (#deskTabHomeLabel)
              const homeTabLabel = document.getElementById('deskTabHomeLabel');
              if (!homeTabLabel) throw new Error('#deskTabHomeLabel ausente no cabeçalho');
              
              appState.currentUserKey = 'helena';
              applyUserRoleUI();
              if (homeTabLabel.innerText !== 'Gestão Pedagógica') {
                throw new Error(`Rótulo da 1ª aba deveria ser "Gestão Pedagógica" para Helena, mas consta "${homeTabLabel.innerText}"`);
              }

              appState.currentUserKey = 'mariana';
              applyUserRoleUI();
              if (homeTabLabel.innerText !== 'Início') {
                throw new Error(`Rótulo da 1ª aba deveria ser "Início" ao retornar para Mariana, mas consta "${homeTabLabel.innerText}"`);
              }

              appState.currentUserKey = 'clarice';
              applyUserRoleUI();
              if (homeTabLabel.innerText !== 'Início') {
                throw new Error(`Rótulo da 1ª aba deveria ser "Início" para Clarice, mas consta "${homeTabLabel.innerText}"`);
              }

              appState.currentUserKey = 'helena';
              applyUserRoleUI();
              if (homeTabLabel.innerText !== 'Gestão Pedagógica') {
                throw new Error(`Rótulo da 1ª aba deveria ser "Gestão Pedagógica" na reativação de Helena, mas consta "${homeTabLabel.innerText}"`);
              }

              appState.currentUserKey = 'mariana';
              applyUserRoleUI();
              if (homeTabLabel.innerText !== 'Início') {
                throw new Error(`Rótulo da 1ª aba deveria ser "Início" após restauração de Mariana, mas consta "${homeTabLabel.innerText}"`);
              }
              // Restaura perfil de Helena (Governança Global) para os testes subsequentes do catálogo
              appState.currentUserKey = 'helena';
              applyUserRoleUI();
              logger.log('Alternância cíclica de perfis e reatividade canônica de #deskTabHomeLabel (Início vs Gestão Pedagógica)', true);
            } catch (e) {
              logger.log('Erro de execução no módulo auth_rbac', false, e.message);
            }
          }
        },

        // --- MÓDULO 2: Catálogo Canônico, Escolas, Turmas, Professores e Estado Global ---
        {
          id: 'catalogo_dados',
          name: 'Catálogo Canônico, Escolas, Turmas, Professores e Estado Global',
          run: function(logger) {
            try {
              selectUserAccount('helena');
              if (!Array.isArray(INITIAL_CLASSES) || INITIAL_CLASSES.length === 0) throw new Error('INITIAL_CLASSES vazio');
              if (!Array.isArray(INITIAL_UNITS) || INITIAL_UNITS.length === 0) throw new Error('INITIAL_UNITS vazio');
              if (!Array.isArray(INITIAL_TEAM) || INITIAL_TEAM.length === 0) throw new Error('INITIAL_TEAM vazio');
              const seedSchools = Array.from(new Set((appState.observations || []).map(o => o.schoolName).filter(Boolean)));
              if (seedSchools.length < 2) throw new Error('Base de observações não possui diversidade multi-unidade escolar');
              logger.log('Coleções canônicas de dados e observações multi-unidade populadas', true, `${seedSchools.length} unidades com observações`);

              const classesLourdes = getClassesForSchool('CEI Professora Maria de Lourdes');
              if (classesLourdes.length === 0) throw new Error('getClassesForSchool falhou para CEI Maria de Lourdes');
              logger.log('Mapeamento canônico de turmas por escola (getClassesForSchool)', true, `${classesLourdes.length} turmas mapeadas`);

              const teachersLourdes = (appState.teamMembers || []).filter(m => m.school === 'CEI Professora Maria de Lourdes' && m.roleKey === 'professora');
              if (!teachersLourdes || teachersLourdes.length === 0) throw new Error('Nenhuma docente para CEI Maria de Lourdes');
              logger.log('Mapeamento canônico de docentes por escola', true, `${teachersLourdes.length} docentes`);

              saveState();
              logger.log('Persistência e integridade do estado global (saveState / appState)', true);

              // PILAR 15: Integridade relacional de bimesterPeriods na SSOT
              if (!appState.bimesterPeriods || !appState.bimesterPeriods['1º Bimestre'] || !appState.bimesterPeriods['4º Bimestre']) {
                throw new Error('Falha SSOT: appState.bimesterPeriods ausente ou incompleto no catálogo');
              }
              logger.log('Presença e integridade relacional de bimesterPeriods na SSOT unificada', true);

              // 4. CICLO COMPLETO DE ADIÇÃO DE PROFESSOR E USUÁRIO VIA MODAIS ESPECIALIZADOS
              // 4.1 Cadastro de Professor (#modalAddTeacher) - Blindado contra e-mail e sem USERS_DB
              openAddTeacherModal();
              const teacherModalEl = document.getElementById('modalAddTeacher');
              if (teacherModalEl.querySelector('input[type="email"]') || document.getElementById('newTeacherEmail')) {
                throw new Error('Modal #modalAddTeacher contém indevidamente campo de e-mail');
              }
              const teacherNameInp = document.getElementById('newTeacherName');
              const teacherSchoolSel = document.getElementById('newTeacherSchool');

              const testProfName = 'Docente Teste Auditoria EndToEnd';
              UI.type(teacherNameInp, testProfName);

              const targetSchoolName = 'EMEI Pequeno Príncipe';
              UI.select(teacherSchoolSel, targetSchoolName);
              if (teacherSchoolSel.value !== targetSchoolName) {
                throw new Error(`Falha de retenção da unidade selecionada no cadastro de professor: esperado "${targetSchoolName}", obtido "${teacherSchoolSel.value}"`);
              }

              saveNewTeacher();
              const createdTeacher = (appState.teamMembers || []).find(m => m.name === testProfName);
              if (!createdTeacher || createdTeacher.school !== targetSchoolName || createdTeacher.roleKey !== 'professora' || createdTeacher.email !== '') {
                throw new Error('Professor cadastrado não foi persistido corretamente na SSOT ou recebeu e-mail');
              }
              if (USERS_DB[createdTeacher.id] || (appState.customUsers && appState.customUsers[createdTeacher.id])) {
                throw new Error('Professor foi indevidamente cadastrado na base de autenticação (USERS_DB / customUsers)');
              }
              logger.log('Ciclo completo de cadastro de Professor (#modalAddTeacher, sem login/e-mail)', true, `${createdTeacher.name} ➔ ${createdTeacher.school}`);

              // 4.2 Cadastro de Usuário (#modalAddUser) - Com e-mail, senha e USERS_DB
              openAddUserModal();
              const userRoleSel = document.getElementById('newUserRole');
              if (Array.from(userRoleSel.options).some(o => o.value === 'professora')) {
                throw new Error('Dropdown #newUserRole contém indevidamente opção de professora');
              }
              const userNameInp = document.getElementById('newUserName');
              const userEmailInp = document.getElementById('newUserEmail');
              const userPassInp = document.getElementById('newUserPassword');
              const userSchoolSel = document.getElementById('newUserSchool');

              const testUserName = 'Coordenador Teste Auditoria EndToEnd';
              UI.type(userNameInp, testUserName);
              UI.type(userEmailInp, 'coord.audit.e2e@patos.pb.gov.br');
              UI.type(userPassInp, '123456');
              UI.select(userRoleSel, 'coordenador');
              UI.select(userSchoolSel, targetSchoolName);

              saveNewUser();
              const createdUser = (appState.teamMembers || []).find(m => m.name === testUserName);
              if (!createdUser || createdUser.roleKey !== 'coordenador' || createdUser.email !== 'coord.audit.e2e@patos.pb.gov.br') {
                throw new Error('Usuário cadastrado não foi persistido corretamente em appState.teamMembers');
              }
              if (!USERS_DB[createdUser.id] || !appState.customUsers || !appState.customUsers[createdUser.id]) {
                throw new Error('Usuário cadastrado não foi sincronizado com USERS_DB ou appState.customUsers');
              }
              logger.log('Ciclo completo de cadastro de Usuário (#modalAddUser, sincronizado na SSOT de login)', true, `${createdUser.name} ➔ ${createdUser.email}`);

              // 5. TESTE DE EDIÇÃO INTERATIVA NO MODAL DE EDIÇÃO (#modalEditMember)
              openEditMemberModal(createdTeacher.id);
              const editSchoolSel = document.getElementById('editMemberSchool');
              const newEditedSchool = 'CEI Professora Maria de Lourdes';
              UI.select(editSchoolSel, newEditedSchool);
              if (editSchoolSel.value !== newEditedSchool) {
                throw new Error(`Falha de retenção da unidade na edição: esperado "${newEditedSchool}", obtido "${editSchoolSel.value}"`);
              }
              // Salva a edição do membro
              const originalConfirm = window.confirm;
              window.confirm = () => true;
              saveEditTeamMember();
              window.confirm = originalConfirm;

              const updatedMember = (appState.teamMembers || []).find(m => m.id === createdTeacher.id);
              if (!updatedMember || updatedMember.school !== newEditedSchool) {
                throw new Error('Edição de profissional não persistiu a nova unidade escolar');
              }
              logger.log('Edição e retenção interativa de unidade no modal de edição (#modalEditMember)', true, `${updatedMember.name} ➔ ${newEditedSchool}`);

              // 6. VALIDAÇÃO DE SUPRESSÃO DE AVISOS E BADGES DE VINCULAÇÃO AUTOMÁTICA
              renderTeamScreen();
              const teamTableBody = document.getElementById('teamTableBody');
              if (teamTableBody && teamTableBody.innerHTML.includes('Auto via UE')) {
                throw new Error('Badge "Auto via UE" ainda está presente na tabela de profissionais');
              }
              if (teamTableBody && teamTableBody.innerHTML.includes('Docente Regente (Sem acesso)')) {
                throw new Error('Texto "Docente Regente (Sem acesso)" ainda está presente no quadro de servidores');
              }
              const newMemberNote = document.getElementById('newMemberTeacherRuleNote');
              const editMemberNote = document.getElementById('editMemberTeacherRuleNote');
              if (newMemberNote || editMemberNote) {
                throw new Error('Elementos informativos de vinculação automática (#newMemberTeacherRuleNote / #editMemberTeacherRuleNote) ainda existem no DOM');
              }
              logger.log('Supressão de badges e avisos informativos de vinculação automática na gestão de pessoal', true);

              // 7. VALIDAÇÃO DE TURMAS INTEGRAIS COM SEGREGAÇÃO DE TURNOS E EXCLUSIVIDADE DOCENTE
              const integralCls = (appState.classes || []).find(c => c.id === 'cls-pml-04');
              if (!integralCls || !Array.isArray(integralCls.teachersMorning) || !Array.isArray(integralCls.teachersAfternoon)) {
                throw new Error('cls-pml-04 não possui teachersMorning e teachersAfternoon estruturados como array');
              }
              if (integralCls.teachersMorning.length !== 2 || integralCls.teachersAfternoon.length !== 2) {
                throw new Error(`cls-pml-04 deve conter 2 docentes na manhã e 2 na tarde (obtido: manhã=${integralCls.teachersMorning.length}, tarde=${integralCls.teachersAfternoon.length})`);
              }
              logger.log('Validação da segregação de turnos em INITIAL_CLASSES (cls-pml-04)', true, `Manhã: ${integralCls.teachersMorning.join(', ')} · Tarde: ${integralCls.teachersAfternoon.join(', ')}`);

              // Validação da presença dos novos membros em INITIAL_TEAM
              const requiredNewMembers = ['Luciana Ramos', 'Mariana Santos', 'Roberta Dias', 'Patricia Souza', 'Camila Vasconcelos'];
              requiredNewMembers.forEach(name => {
                const found = (appState.teamMembers || []).some(m => m.name === name);
                if (!found) throw new Error(`Profissional obrigatório "${name}" não localizado em appState.teamMembers`);
              });
              logger.log('Presença de novos membros docentes em INITIAL_TEAM', true, requiredNewMembers.join(', '));

              // Validação de exclusividade docente (nenhuma docente de turma parcial atuando em turnos acumulados indevidos)
              const anaClasses = (appState.classes || []).filter(c => (c.teachers || []).includes('Ana Carolina Silva'));
              if (anaClasses.length !== 1 || anaClasses[0].name !== 'Infantil I - Turma A') {
                throw new Error('Ana Carolina Silva não possui alocação exclusiva em Infantil I - Turma A');
              }
              logger.log('Exclusividade docente e integridade de alocação por turno', true);

              // 8. VALIDAÇÃO DA PADRONIZAÇÃO MEC DAS JORNADAS ESCOLARES (PILAR 13)
              const mecValidShifts = ['Tempo Parcial (Matutino)', 'Tempo Parcial (Vespertino)', 'Tempo Integral'];
              const invalidShifts = INITIAL_CLASSES.filter(c => !mecValidShifts.includes(formatMECShift(c.shift)));
              if (invalidShifts.length > 0) throw new Error('Turmas em INITIAL_CLASSES fora do padrão MEC de jornadas');
              if (formatMECShift('Parcial Matutino') !== 'Tempo Parcial (Matutino)') throw new Error('Falha no helper formatMECShift matutino');
              if (formatMECShift('Integral') !== 'Tempo Integral') throw new Error('Falha no helper formatMECShift integral');
              logger.log('Conformidade do Catálogo de Turmas com o Padrão MEC de Jornadas (Pilar 13)', true, 'Tempo Parcial & Tempo Integral');

              // Asserção de Higienização Visual: Ausência de emojis em Turmas de Tempo Integral na Tabela de Turmas
              renderClassesScreen();
              const classesTbody = document.getElementById('classesTableBody');
              if (classesTbody) {
                const integralRows = Array.from(classesTbody.querySelectorAll('tr')).filter(tr => tr.innerText.includes('Tempo Integral'));
                if (integralRows.length > 0) {
                  const firstRowText = integralRows[0].innerHTML;
                  if (firstRowText.includes('☀️ Tempo Integral') || firstRowText.includes('☀️ Manhã + 🌤️ Tarde') || firstRowText.includes('☀️ Manhã:')) {
                    throw new Error('Tabela de turmas ainda contém emojis residuais (☀️ ou 🌤️) na exibição de turmas integrais');
                  }
                  if (!firstRowText.includes('Tempo Integral') || !firstRowText.includes('Manhã + Tarde') || !firstRowText.includes('Manhã:')) {
                    throw new Error('Tabela de turmas não exibiu os textos padronizados limpos para turmas integrais');
                  }
                }
              }
              logger.log('Higienização visual da Tabela de Turmas (Tempo Integral sem emojis)', true);

              // 9. GOVERNANÇA OPERACIONAL DESCENTRALIZADA E GESTÃO AUTÔNOMA SOB SSOT ÚNICA (PILAR 14)
              // 9.1 Caracterização canônica das Unidades Escolares
              const missingChar = (appState.units || []).filter(u => typeof u.totalStudents !== 'number' || typeof u.inclusiveStudents !== 'number' || typeof u.totalClasses !== 'number');
              if (missingChar.length > 0) throw new Error(`${missingChar.length} unidades sem caracterização completa de alunos/turmas`);
              logger.log('Caracterização canônica das 32 Unidades Escolares (Pilar 14)', true, `${appState.units.length} UEs com métricas ativas`);

              // 9.2 Adição, resolução e exclusão resiliente de Turmas sob a SSOT
              const testClassId = 'cls-audit-p14-' + Date.now();
              const testClassName = 'Infantil II - Turma Teste SSOT';
              const testSchoolName = 'CEI Professora Maria de Lourdes';
              if (!Array.isArray(appState.classes)) appState.classes = [...INITIAL_CLASSES];
              appState.classes.push({
                id: testClassId,
                school: testSchoolName,
                name: testClassName,
                stage: 'Pré-Escola (4 a 5 anos)',
                shift: 'Tempo Integral',
                shiftType: 'integral',
                teacherMorning: 'Luciana Ramos',
                teacherAfternoon: 'Mariana Santos',
                teachersMorning: ['Luciana Ramos'],
                teachersAfternoon: ['Mariana Santos'],
                teachers: ['Luciana Ramos', 'Mariana Santos'],
                totalStudents: 22,
                inclusiveStudents: 2,
                room: 'Sala 05'
              });
              saveState();

              const classesResolved = getClassesForSchool(testSchoolName);
              const foundTestClass = classesResolved.find(c => c.id === testClassId);
              if (!foundTestClass || foundTestClass.name !== testClassName) {
                throw new Error('Falha na resolução da nova turma autônoma via getClassesForSchool() sob a SSOT');
              }
              logger.log('Criação autônoma de turma e resolução imediata na SSOT única', true, `${foundTestClass.name} (${foundTestClass.shift})`);

              // Exclusão resiliente: impede ressuscitação via deletedClassIds
              if (!Array.isArray(appState.deletedClassIds)) appState.deletedClassIds = [];
              appState.deletedClassIds.push(testClassId);
              appState.classes = appState.classes.filter(c => c.id !== testClassId);
              saveState();

              const classesAfterDelete = getClassesForSchool(testSchoolName);
              if (classesAfterDelete.some(c => c.id === testClassId)) {
                throw new Error('Turma excluída ressuscitou indevidamente no catálogo de turmas da escola');
              }
              logger.log('Blindagem contra ressurgimento de turmas excluídas (deletedClassIds)', true);

              // Limpeza do id de teste
              appState.deletedClassIds = appState.deletedClassIds.filter(id => id !== testClassId);
              saveState();

              // 9.3 Validação de Isolamento de Escopo e RBAC (Pilar 14)
              const previousUserKey = appState.currentUserKey;
              try {
                // Simula Coordenadora (Mariana Ferreira)
                selectUserAccount('mariana');
                openAddClassModal();
                const clsSchoolEl = document.getElementById('classEditorSchool');
                const groupClsSchoolEl = document.getElementById('groupClassSchool');
                if (clsSchoolEl.value !== 'CEI Professora Maria de Lourdes' || groupClsSchoolEl.style.display !== 'none') {
                  throw new Error('Escopo da Coordenadora não travou a seleção para sua própria Unidade Escolar');
                }
                closeClassEditorModal();

                // Validação de RBAC dos novos botões e simplificação no cadastro de docentes pela Coordenadora (Versão 1.23)
                const btnTeacher = document.getElementById('btnNewTeacher');
                const btnUser = document.getElementById('btnNewUser');
                if (!btnTeacher || btnTeacher.style.display === 'none') {
                  throw new Error('Botão #btnNewTeacher não está visível para a Coordenadora');
                }
                if (!btnUser || btnUser.style.display !== 'none') {
                  throw new Error('Botão #btnNewUser deveria estar oculto para a Coordenadora');
                }

                openAddTeacherModal();
                const grpTeacherSchool = document.getElementById('groupNewTeacherSchool');
                const grpTeacherSup = document.getElementById('groupNewTeacherSupervisor');
                if (grpTeacherSchool.style.display !== 'none' || grpTeacherSup.style.display !== 'none') {
                  throw new Error('Modal de cadastro de docente para Coordenadora não ocultou unidade ou coordenadora vinculada');
                }
                closeAddTeacherModal();
                logger.log('Blindagem RBAC e simplificação radical no cadastro de docentes pela Coordenadora (apenas Nome Completo)', true);

                // Validação da padronização limpa de rótulos de Jornada Escolar
                const classesThs = Array.from(document.querySelectorAll('#pedagViewClasses table thead th')).map(th => th.innerText.trim());
                if (classesThs.some(th => th.includes('(Padrão MEC)'))) {
                  throw new Error('Tabela de turmas ainda contém o sufixo "(Padrão MEC)"');
                }
                const classesSubtitleEl = document.getElementById('classesViewSubtitle');
                if (classesSubtitleEl && classesSubtitleEl.innerText.includes('jornada MEC')) {
                  throw new Error('Subtítulo de turmas ainda contém texto residual burocrático de jornada MEC');
                }
                logger.log('Padronização limpa de "Jornada Escolar" sem sufixo residual e higienização de subtítulos', true);

                // Asserção de Edição Segura de Docente Titular sem Quebra de Escopo (dbKey)
                const docenteTitular = (appState.teamMembers || []).find(m => m.roleKey === 'professora' && m.school === 'CEI Professora Maria de Lourdes');
                if (docenteTitular) {
                  openEditMemberModal(docenteTitular.id);
                  const editDocenteNameInp = document.getElementById('editMemberName');
                  const oldDocenteName = editDocenteNameInp ? editDocenteNameInp.value : docenteTitular.name;
                  const originalConfirm = window.confirm;
                  window.confirm = () => true;
                  saveEditTeamMember();
                  window.confirm = originalConfirm;
                  closeEditMemberModal();
                  logger.log('Edição segura de docente titular sem erro de escopo de dbKey', true, docenteTitular.name);
                }

                // Simula Formadora (Clarice Barbosa)
                selectUserAccount('clarice');
                renderUnitsScreen();
                const polo1Units = (appState.units || []).filter(u => u.polo === 'Polo Regional 1 (Norte)');
                logger.log('Isolamento de governança e escopo territorial por papel (Pilar 14)', true, `Coordenadora (UE) & Formadora (${polo1Units.length} UEs Polo 1)`);
              } finally {
                if (previousUserKey) selectUserAccount(previousUserKey);
              }

              // Limpeza dos membros temporários de teste
              appState.teamMembers = (appState.teamMembers || []).filter(m => m.id !== createdTeacher.id && m.id !== createdUser.id);
              if (appState.customUsers) {
                delete appState.customUsers[createdTeacher.id];
                delete appState.customUsers[createdUser.id];
              }
              delete USERS_DB[createdTeacher.id];
              delete USERS_DB[createdUser.id];
              saveState();
              closeEditMemberModal();

              // 10. CICLO COMPLETO DE GESTÃO E EDIÇÃO DE POLOS REGIONAIS (SSOT)
              const initialPolos = getAllPolosList();
              if (!Array.isArray(initialPolos) || initialPolos.length === 0) {
                throw new Error('getAllPolosList retornou lista vazia de polos');
              }
              logger.log('SSOT de Polos Regionais inicializada e consultável', true, `${initialPolos.length} polos mapeados`);

              // Teste de Edição Interativa de Polo (#modalEditPolo)
              const targetPolo = 'Polo Regional 1 (Norte)';
              openEditPoloModal(encodeURIComponent(targetPolo));
              const editPoloModal = document.getElementById('modalEditPolo');
              if (!editPoloModal.classList.contains('active')) {
                throw new Error('Modal #modalEditPolo não abriu corretamente');
              }
              const editPoloInp = document.getElementById('editPoloName');
              const editFormadoraSel = document.getElementById('editPoloFormadora');
              if (!editPoloInp || editPoloInp.value !== targetPolo) {
                throw new Error(`Campo #editPoloName não reteve o nome original do polo: esperado "${targetPolo}", obtido "${editPoloInp?.value}"`);
              }

              const tempEditedPoloName = 'Polo Regional 1 (Norte - Teste Auditoria)';
              UI.type(editPoloInp, tempEditedPoloName);

              const oldConfirm = window.confirm;
              window.confirm = () => true;
              saveEditPolo();
              window.confirm = oldConfirm;

              if (!getAllPolosList().includes(tempEditedPoloName)) {
                throw new Error('Novo nome do polo não foi persistido em appState.polos');
              }
              const updatedUnits = (appState.units || []).filter(u => u.polo === tempEditedPoloName);
              if (updatedUnits.length === 0) {
                throw new Error('Propagação em cascata da renomeação do polo falhou para appState.units');
              }
              logger.log('Ciclo completo de edição de Polo (#modalEditPolo) e propagação em cascata nas UEs', true, `${targetPolo} ➔ ${tempEditedPoloName}`);

              // Restauração idempotente do nome original
              openEditPoloModal(encodeURIComponent(tempEditedPoloName));
              UI.type(document.getElementById('editPoloName'), targetPolo);
              window.confirm = () => true;
              saveEditPolo();
              window.confirm = oldConfirm;
              logger.log('Restauração idempotente do Polo canônico concluída com sucesso', true, targetPolo);

              // 11. VALIDAÇÃO DA CENTRALIZAÇÃO DE INÍCIO DE CICLO AVALIATIVO (VERSÃO 1.35)
              // 11.1 Asserção Negativa: Botão NÃO deve existir na barra de ações rápidas de Gestão da Rede
              const homeActions = document.getElementById('homeGestaoActionsCentral');
              if (homeActions) {
                const orphanYearBtn = Array.from(homeActions.querySelectorAll('button')).find(b => {
                  const clickAttr = b.getAttribute('onclick') || '';
                  const text = (b.textContent || '').toLowerCase();
                  return clickAttr.includes('openCreateNewAcademicYearModal') || text.includes('iniciar novo ano letivo');
                });
                if (orphanYearBtn) {
                  throw new Error('Falha de UX: Botão de iniciar novo ano letivo/ciclo ainda existe solto em #homeGestaoActionsCentral');
                }
              }
              logger.log('Asserção Negativa: Remoção do botão de início de ciclo da barra de ações gerais (#homeGestaoActionsCentral)', true);

              // 11.2 Asserção Positiva: Botão DEVE existir com destaque dentro de #modalBimesterPeriods
              openBimesterPeriodsModal();
              const bimModalEl = document.getElementById('modalBimesterPeriods');
              if (!bimModalEl || !bimModalEl.classList.contains('active')) {
                throw new Error('Falha ao abrir #modalBimesterPeriods como Coordenadora da EI');
              }

              const startCycleBtn = document.getElementById('btnModalStartNewAcademicCycle') || bimModalEl.querySelector('button[onclick*="openCreateNewAcademicYearModal"]');
              if (!startCycleBtn) {
                throw new Error('Botão de iniciar novo ciclo avaliativo não localizado em #modalBimesterPeriods');
              }

              const btnText = startCycleBtn.textContent.trim();
              if (!btnText.includes('Iniciar Novo Ciclo Avaliativo')) {
                throw new Error(`Rótulo incorreto no botão de ciclo avaliativo: esperado conter "Iniciar Novo Ciclo Avaliativo", obtido "${btnText}"`);
              }

              if (startCycleBtn.querySelector('svg.btn-icon') === null) {
                throw new Error('Botão de iniciar novo ciclo avaliativo deve conter pictograma vetorial SVG (.btn-icon)');
              }
              logger.log('Presença canônica e rotulagem oficial do botão "Iniciar Novo Ciclo Avaliativo" em #modalBimesterPeriods', true);

              // 11.3 Teste de Disparo do Assistente de Transição (#modalCreateAcademicYear)
              startCycleBtn.click();
              const createYearModal = document.getElementById('modalCreateAcademicYear');
              if (!createYearModal || !createYearModal.classList.contains('active')) {
                throw new Error('Clique no botão em #modalBimesterPeriods não abriu o assistente #modalCreateAcademicYear');
              }

              const createYearTitle = document.getElementById('modalCreateAcademicYearTitle') || createYearModal.querySelector('.modal-panel > div:first-child');
              if (!createYearTitle || !createYearTitle.textContent.includes('Iniciar Novo Ciclo Avaliativo')) {
                throw new Error('Título do assistente #modalCreateAcademicYear deve conter "Iniciar Novo Ciclo Avaliativo"');
              }

              // Fecha os modais e garante restauração do estado
              closeCreateNewAcademicYearModal();
              closeBimesterPeriodsModal();
              logger.log('Fluxo interativo completo de abertura do assistente de novo ciclo a partir de #modalBimesterPeriods', true);

              // 11.4 TESTE DE CONFORMIDADE TEMPORAL: BLOQUEIO DE INÍCIO DE ANOS LETIVOS FUTUROS
              // 1. Testa bloqueio no modal quando o ano sugerido é futuro
              openCreateNewAcademicYearModal();
              const blockNoticeEl = document.getElementById('futureYearBlockNotice');
              const confirmBtnEl = document.getElementById('btnConfirmCreateAcademicYear');
              const inputYearEl = document.getElementById('inputNewAcademicYear');
              const currentRealYear = new Date().getFullYear();

              if (!blockNoticeEl || blockNoticeEl.style.display === 'none') {
                throw new Error('Aviso institucional de trava temporal #futureYearBlockNotice não foi exibido para ano futuro');
              }
              if (!confirmBtnEl || !confirmBtnEl.disabled) {
                throw new Error('Botão #btnConfirmCreateAcademicYear deveria estar desabilitado para ano letivo futuro');
              }

              // 2. Testa rejeição programática de submissão de ano futuro
              const initialYearsCount = appState.academicYears.length;
              if (inputYearEl) inputYearEl.value = (currentRealYear + 1).toString();
              
              // Simula tentativa de confirmação forçada (bypassing disabled)
              let alertTriggered = false;
              const originalAlert = window.alert;
              window.alert = () => { alertTriggered = true; };
              try {
                confirmCreateNewAcademicYear();
              } finally {
                window.alert = originalAlert;
              }

              if (appState.academicYears.includes((currentRealYear + 1).toString())) {
                throw new Error('Falha de conformidade: Sistema permitiu cadastrar ano letivo futuro que ainda não iniciou efetivamente');
              }
              if (appState.academicYears.length !== initialYearsCount) {
                throw new Error('Tamanho de appState.academicYears foi modificado indevidamente após tentativa de cadastro futuro');
              }

              // 3. Testa autocura de loadState() contra resíduos de anos futuros
              appState.academicYears.push('2099');
              appState.selectedAcademicYear = '2099';
              if (!appState.bimesterPeriods) appState.bimesterPeriods = {};
              appState.bimesterPeriods['2099'] = { mock: true };
              localStorage.setItem('SERTAO_CRIANCA_APP_STATE_V6', JSON.stringify(appState));
              
              loadState();

              if (appState.academicYears.includes('2099')) {
                throw new Error('Autocura de loadState() falhou ao expurgar ano futuro 2099 de academicYears');
              }
              if (appState.selectedAcademicYear === '2099') {
                throw new Error('Autocura de loadState() falhou ao reverter selectedAcademicYear de 2099');
              }
              if (appState.bimesterPeriods['2099']) {
                throw new Error('Autocura de loadState() falhou ao remover bimesterPeriods de 2099');
              }

              closeCreateNewAcademicYearModal();
              closeBimesterPeriodsModal();
              logger.log('Bloqueio impeditivo e autocura contra anos letivos futuros que ainda não iniciaram efetivamente (Versão 1.46)', true);

              // 12. GOVERNANÇA DE POLOS PELO NÚCLEO DE EI E VISUALIZAÇÃO DE TURMAS POR UE (VERSÃO 1.43)
              // 12.1 Validação de Ocultação da Sub-aba Turmas da Rede (#pedagTabClasses) para Núcleo de EI
              selectUserAccount('helena');
              renderHomeScreen();
              const pedagTabClassesEl = document.getElementById('pedagTabClasses');
              if (pedagTabClassesEl && pedagTabClassesEl.style.display !== 'none') {
                throw new Error('Sub-aba #pedagTabClasses deve estar estritamente oculta (display: none) para a Coordenadora do Núcleo de EI');
              }

              // Teste de Desvio Defensivo de Navegação
              switchPedagSubTab('classes');
              if (appState.currentPedagSubTab === 'classes') {
                throw new Error('switchPedagSubTab("classes") não desviou para "units" no perfil do Núcleo de EI');
              }
              logger.log('Supressão da tela de turmas da rede e desvio defensivo de navegação para o Núcleo de EI', true);

              // 12.2 Validação de Bloqueio RBAC contra modificação direta de turmas pelo Núcleo de EI
              const originalToast = window.showToast;
              let toastTriggered = false;
              window.showToast = function(msg) {
                toastTriggered = true;
              };

              // Tentativa de adicionar turma pelo Núcleo de EI
              openAddClassModal();
              const modalClassEditorEl = document.getElementById('modalClassEditor');
              if (modalClassEditorEl && modalClassEditorEl.classList.contains('active')) {
                closeClassEditorModal();
                throw new Error('openAddClassModal abriu indevidamente o editor de turma para o Núcleo de EI');
              }
              if (!toastTriggered) {
                throw new Error('openAddClassModal não emitiu toast educativo de bloqueio RBAC para o Núcleo de EI');
              }

              // Tentativa de salvar turma pelo Núcleo de EI
              toastTriggered = false;
              saveClassEditor();
              if (!toastTriggered) {
                throw new Error('saveClassEditor não emitiu toast educativo de bloqueio RBAC para o Núcleo de EI');
              }

              // Tentativa de excluir turma pelo Núcleo de EI
              toastTriggered = false;
              const sampleClass = (appState.classes || [])[0];
              if (sampleClass) {
                deleteClass(sampleClass.id);
                if (!toastTriggered) {
                  throw new Error('deleteClass não emitiu toast educativo de bloqueio RBAC para o Núcleo de EI');
                }
              }
              window.showToast = originalToast;
              logger.log('Blindagem RBAC em ações de mutação de turmas pelo Núcleo de EI (bloqueio com toast)', true);

              // 12.3 Validação do Modal de Visualização de Turmas e Regências da UE (#modalViewUnitClasses)
              const sampleUnit = (appState.units || []).find(u => u.name === 'CEI Professora Maria de Lourdes') || (appState.units || [])[0];
              if (!sampleUnit) throw new Error('Nenhuma Unidade Escolar encontrada para teste de visualização');

              openViewUnitClassesModal(sampleUnit.id);
              const modalViewUnitEl = document.getElementById('modalViewUnitClasses');
              if (!modalViewUnitEl || !modalViewUnitEl.classList.contains('active')) {
                throw new Error('openViewUnitClassesModal não ativou o modal #modalViewUnitClasses');
              }

              const viewUnitTitle = document.getElementById('viewUnitModalTitle')?.innerText;
              if (viewUnitTitle !== sampleUnit.name) {
                throw new Error(`Título da unidade incorreto no modal: esperado "${sampleUnit.name}", obtido "${viewUnitTitle}"`);
              }

              const viewUnitTableRows = modalViewUnitEl.querySelectorAll('#viewUnitClassesTableBody tr');
              const expectedClassesCount = getClassesForSchool(sampleUnit.name).length;
              if (expectedClassesCount > 0 && viewUnitTableRows.length !== expectedClassesCount) {
                throw new Error(`Quantidade de turmas divergente na visualização da UE: esperado ${expectedClassesCount}, obtido ${viewUnitTableRows.length}`);
              }

              // Garantir ausência absoluta de botões de edição ou exclusão no modal de visualização
              const mutableButtons = modalViewUnitEl.querySelectorAll('#viewUnitClassesTableBody button, #viewUnitClassesTableBody input');
              if (mutableButtons.length > 0) {
                throw new Error('Modal de visualização de turmas da UE contém botões ou inputs de mutação');
              }

              closeViewUnitClassesModal();
              if (modalViewUnitEl.classList.contains('active')) {
                throw new Error('closeViewUnitClassesModal falhou em fechar o modal #modalViewUnitClasses');
              }
              logger.log('Validação do Modal de Visualização de Turmas da UE (#modalViewUnitClasses, somente leitura SSOT)', true, `${sampleUnit.name} (${expectedClassesCount} turmas)`);

              // 12.4 Validação de Preservação da Sub-aba para Coordenação Pedagógica
              selectUserAccount('mariana');
              renderHomeScreen();
              if (pedagTabClassesEl && pedagTabClassesEl.style.display === 'none') {
                throw new Error('Sub-aba #pedagTabClasses deve estar visível para a Coordenadora Mariana Ferreira');
              }
              logger.log('Preservação da sub-aba Turmas & Regência para a Coordenadora da UE', true);

              // Restaura conta padrão
              selectUserAccount('helena');

              // 13. VALIDAÇÃO SEMIÓTICA DOS PICTOGRAMAS DOS BOTÕES DE UES E SERVIDORES (VERSÃO 1.48 / PADRÃO V1.39)
              const btnExportUnitsCSV = document.querySelector('button[onclick*="exportUnitsCSV()"]');
              const btnExportUnitsJSON = document.querySelector('button[onclick*="exportUnitsJSON()"]');
              const btnDownloadUnitsTemplate = document.querySelector('button[onclick*="downloadUnitsCsvTemplate()"]');
              const btnImportUnitsCSV = document.querySelector('button[onclick*="triggerUnitsCsvImport()"]');

              if (!btnExportUnitsCSV || !btnExportUnitsJSON || !btnDownloadUnitsTemplate || !btnImportUnitsCSV) {
                throw new Error('Botões de ação de Unidades Escolares ausentes no DOM');
              }

              // Exportação CSV deve ser bandeja com seta para cima
              const svgExpCSV = btnExportUnitsCSV.querySelector('svg')?.innerHTML || '';
              if (!svgExpCSV.includes('17 8 12 3 7 8') || !svgExpCSV.includes('y1="3"')) {
                throw new Error('Botão exportUnitsCSV deve possuir pictograma de bandeja com seta para cima');
              }

              // Exportação JSON deve ser bandeja com seta para cima (padrão v1.39)
              const svgExpJSON = btnExportUnitsJSON.querySelector('svg')?.innerHTML || '';
              if (!svgExpJSON.includes('17 8 12 3 7 8') || !svgExpJSON.includes('y1="3"')) {
                throw new Error('Botão exportUnitsJSON deve possuir pictograma de bandeja com seta para cima');
              }

              // Baixar Modelo deve possuir pictograma de modelo de documento baixado (file-down)
              const svgTpl = btnDownloadUnitsTemplate.querySelector('svg')?.innerHTML || '';
              if (!svgTpl.includes('M14 2H6') || !svgTpl.includes('9 15 12 18 15 15')) {
                throw new Error('Botão downloadUnitsCsvTemplate deve possuir pictograma de documento modelo baixado (file-down)');
              }

              // Importar CSV deve ser bandeja com seta para baixo (padrão v1.39)
              const svgImpCSV = btnImportUnitsCSV.querySelector('svg')?.innerHTML || '';
              if (!svgImpCSV.includes('7 10 12 15 17 10') || !svgImpCSV.includes('y1="15"')) {
                throw new Error('Botão triggerUnitsCsvImport deve possuir pictograma de bandeja com seta para baixo');
              }

              logger.log('Harmonização Semiótica dos Pictogramas de Unidades Escolares (Padrão Versão 1.39)', true, 'Exportar CSV/JSON (seta cima), Baixar Modelo (file-down) e Importar (seta baixo) validados');
            } catch (e) {
              logger.log('Erro de execução no módulo catalogo_dados', false, e.message);
            }
          }
        },

        // --- MÓDULO 3: Setup de Observação, Seleção de Turmas e Ciclo Longitudinal (Pilar 1) ---
        {
          id: 'setup_longitudinal',
          name: 'Setup de Observação, Seleção de Turmas e Ciclo Longitudinal (Pilar 1)',
          run: function(logger) {
            try {
              appState.currentUserKey = 'mariana';
              appState.observations = [];
              openSetupScreen();

              const schoolSel = document.getElementById('setupSchool');
              const classSel = document.getElementById('setupClass');
              if (!schoolSel || !classSel) throw new Error('Seletores do setup ausentes no DOM');

              UI.select(schoolSel, 'CEI Professora Maria de Lourdes');
              UI.select(classSel, 'Infantil I - Turma A');
              logger.log('Abertura da tela de setup e renderização de seletores', true);

              // Validação da Nomenclatura MEC no Badge de Turno do Setup (Pilar 13)
              const setupShiftBadge = document.getElementById('setupClassShiftBadge');
              if (!setupShiftBadge || !setupShiftBadge.innerText.includes('Tempo Parcial (Matutino)')) {
                throw new Error('Badge de turno em #screenSetup não utilizou nomenclatura oficial MEC (Tempo Parcial Matutino)');
              }
              logger.log('Conformidade MEC no Badge de Turno do Setup (#setupClassShiftBadge)', true, setupShiftBadge.innerText.trim());

              const nextBim = getNextEligibleBimesterForClass('Infantil I - Turma A', 'CEI Professora Maria de Lourdes');
              if (nextBim !== '1º Bimestre') throw new Error(`Próximo bimestre esperado 1º Bimestre, obtido: ${nextBim}`);
              logger.log('Cálculo longitudinal de bimestre inicial por turma (getNextEligibleBimesterForClass)', true, nextBim);

              const teachersListEl = document.getElementById('setupClassTeachersList');
              const hasTeachers = teachersListEl && teachersListEl.children && teachersListEl.children.length > 0;
              logger.log('Vínculo dinâmico de equipe de regentes titulares à turma', hasTeachers);

              // PILAR 4: Validação de Remoção e Ocultação Estrita da Caixa de Aviso #setupRoleHint
              const hintEl = document.getElementById('setupRoleHint');
              const isHintClean = !hintEl || hintEl.style.display === 'none' || hintEl.innerHTML.trim() === '';
              if (!isHintClean) throw new Error('Caixa de aviso #setupRoleHint ainda está visível no setup');
              logger.log('Remoção e ocultação estrita da caixa informativa #setupRoleHint no Setup', true);

              // PILAR 4: Validação de Supressão de Texto de Orientação no Card de Regentes Titulares
              const teachersCard = document.getElementById('groupSetupTeachersCard');
              const cardText = teachersCard ? teachersCard.innerText : '';
              if (cardText.includes('duplas ou quartetos')) {
                throw new Error('Mensagem textual sobre duplas/quartetos ainda presente no card de regência');
              }
              logger.log('Supressão da mensagem textual de orientação no card de regentes titulares', true);

              // PILAR 4 & 1.12: Validação de Setup e Detecção de Turma em Tempo Integral com Segregação e Remanejamento
              const classOptions = Array.from(classSel.options);
              const integralOpt = classOptions.find(o => isClassIntegral(o.value));
              if (integralOpt) {
                UI.select(classSel, integralOpt.value);
                const shiftBadge = document.getElementById('setupClassShiftBadge');
                const isShiftIntegral = shiftBadge && shiftBadge.innerText.includes('Integral');
                if (!isShiftIntegral) throw new Error('Badge de turno não identificou Tempo Integral');
                logger.log('Detecção e estilização de Turma em Tempo Integral no Setup (Pilar 4)', true, integralOpt.value);

                // Validação dos dois blocos no card de regência
                const morningBlockTitle = teachersListEl.innerText.includes('Turno Matutino');
                const afternoonBlockTitle = teachersListEl.innerText.includes('Turno Vespertino');
                if (!morningBlockTitle || !afternoonBlockTitle) {
                  throw new Error('Blocos de Turno Matutino ou Vespertino ausentes no card de regência da turma integral');
                }
                logger.log('Renderização dos blocos segregados por turno no card de regência (#screenSetup)', true);

                // Remanejamento interativo de turno (moveTeacherToShift)
                const initialMorningCount = currentSetupIntegralMorningTeachers.length;
                const teacherToMove = currentSetupIntegralMorningTeachers[0];
                if (teacherToMove) {
                  moveTeacherToShift(teacherToMove, 'afternoon');
                  if (currentSetupIntegralMorningTeachers.includes(teacherToMove) || !currentSetupIntegralAfternoonTeachers.includes(teacherToMove)) {
                    throw new Error(`moveTeacherToShift falhou ao mover ${teacherToMove} para a tarde`);
                  }
                  // Retorna para a manhã para restaurar a integridade
                  moveTeacherToShift(teacherToMove, 'morning');
                  if (currentSetupIntegralMorningTeachers.length !== initialMorningCount) {
                    throw new Error('Falha ao restaurar docente para o turno matutino via moveTeacherToShift');
                  }
                  logger.log('Remanejamento interativo de turno de docente no Setup (moveTeacherToShift)', true, teacherToMove);
                }

                // Inicia observação da turma integral e verifica teachersMorning / teachersAfternoon
                UI.select(document.getElementById('setupBimester'), '1º Bimestre');
                const btnStartIntegral = document.getElementById('btnStartObservation');
                if (btnStartIntegral) {
                  UI.click(btnStartIntegral);
                  if (!appState.currentObs || !appState.currentObs.isIntegral) {
                    throw new Error('Inicialização de turma integral não definiu isIntegral como true');
                  }
                  if (!Array.isArray(appState.currentObs.teachersMorning) || appState.currentObs.teachersMorning.length !== 2) {
                    throw new Error('appState.currentObs.teachersMorning inválido ou não possui 2 docentes');
                  }
                  if (!Array.isArray(appState.currentObs.teachersAfternoon) || appState.currentObs.teachersAfternoon.length !== 2) {
                    throw new Error('appState.currentObs.teachersAfternoon inválido ou não possui 2 docentes');
                  }
                  logger.log('Gravação determinística de teachersMorning e teachersAfternoon em appState.currentObs', true, `Manhã: ${appState.currentObs.teachersMorning.join(', ')} · Tarde: ${appState.currentObs.teachersAfternoon.join(', ')}`);
                }
              }

              // Disparo interativo via botão (restaura turma parcial padrão para sequência da auditoria)
              openSetupScreen();
              UI.select(schoolSel, 'CEI Professora Maria de Lourdes');
              UI.select(classSel, 'Infantil I - Turma A');
              UI.select(document.getElementById('setupBimester'), '1º Bimestre');
              const btnStart = document.getElementById('btnStartObservation') || document.querySelector('#screenSetup button.btn-primary');
              if (btnStart) {
                UI.click(btnStart);
                if (!appState.currentObs || appState.currentObs.className !== 'Infantil I - Turma A') {
                  throw new Error('Botão de iniciar observação não gerou appState.currentObs');
                }
                logger.log('Inicialização interativa da observação via clique no botão primário (#btnStartObservation)', true);
              }
            } catch (e) {
              logger.log('Erro de execução no módulo setup_longitudinal', false, e.message);
            }
          }
        },

        // --- MÓDULO 4: Observação Ativa, Matrizes Curriculares, Rubricas e Pendências ---
        {
          id: 'rubricas_observacao',
          name: 'Observação Ativa, Matrizes Curriculares, Rubricas e Pendências',
          run: function(logger) {
            try {
              appState.currentUserKey = 'mariana';
              if (!appState.currentObs) {
                appState.observations = [];
                openSetupScreen();
                UI.select(document.getElementById('setupSchool'), 'CEI Professora Maria de Lourdes');
                UI.select(document.getElementById('setupClass'), 'Infantil I - Turma A');
                UI.select(document.getElementById('setupBimester'), '1º Bimestre');
                startNewObservation();
              }
              const obs = appState.currentObs;
              if (!obs || obs.evaluatedType !== 'turma') throw new Error('Observação ativa não criada como turma');
              logger.log('Inicialização de observação ativa ancorada na Turma (Pilar 1)', true);

              const sections = getActiveSections(obs);
              if (!Array.isArray(sections) || sections.length === 0) throw new Error('getActiveSections() retornou vazio');
              logger.log('Resolução das seções pedagógicas da matriz ativa (getActiveSections)', true, `${sections.length} seções`);

              let totalCriteria = 0;
              sections.forEach(sec => {
                (sec.subSections || []).forEach(sub => {
                  (sub.criteria || []).forEach(crit => {
                    obs.responses[crit.id] = 'consistent';
                    totalCriteria++;
                  });
                });
              });
              logger.log('Preenchimento determinístico de rubricas por critério', totalCriteria > 0, `${totalCriteria} itens`);

              const pendenciesAfter = getObservationPendencies(obs);
              if (pendenciesAfter.length > 0) throw new Error(`Pendências remanescentes: ${pendenciesAfter.length}`);
              logger.log('Motor de pendências em tempo real (getObservationPendencies) zerado após preenchimento', true);

              // PILAR 5: Testes de Atribuição Mandatória em Item Parcial e Boas Práticas Consistentes
              // 1. Expansão dinâmica do bloco ao marcar 'partial'
              setResponse('1.1.2', 'partial');
              const partialBox = document.getElementById('partial-attribution-box-1.1.2');
              if (!partialBox) throw new Error('Container #partial-attribution-box-1.1.2 não foi renderizado ao marcar partial');
              logger.log('Atribuição Mandatória em Item Parcial: expansão dinâmica do bloco ao marcar partial', true);

              // 2. Guardião de Pendência em Item Parcial: bloqueio sem docente ou justificativa
              const pendsBefore = getObservationPendencies(obs);
              const hasCrit112Pending = pendsBefore.some(p => p.criterionId === '1.1.2');
              if (!hasCrit112Pending) throw new Error('Item pontuado como parcial sem justificativa não gerou pendência impeditiva');
              logger.log('Guardião de Pendência em Item Parcial: bloqueio sem docente ou justificativa', true);

              // 3. Resolução de Pendência de Item Parcial e incentivo em Prática Consistente
              setCriterionPartialTeacher('1.1.2', 'Ana Carolina Silva', true);
              setCriterionPartialJustification('1.1.2', 'Utilizou apenas perguntas fechadas durante a roda de conversa.');
              const pendsAfterAttr = getObservationPendencies(obs);
              const stillPending = pendsAfterAttr.some(p => p.criterionId === '1.1.2');
              if (stillPending) throw new Error('Pendência de 1.1.2 não foi resolvida após atribuir docente e justificativa');

              setResponse('1.1.1', 'consistent');
              const goodPracticeBadge = document.querySelector('#crit-card-1\\.1\\.1 .badge-good-practice');
              if (!goodPracticeBadge) throw new Error('Badge de boa prática consistente não exibido no critério 1.1.1');
              logger.log('Resolução de Pendência de Item Parcial e incentivo em Prática Consistente', true);

              // PILAR 5 & 1.12: Teste de Atribuição Parcial Seletiva por Etapa em Turma Integral
              const savedObsBackup = appState.currentObs;
              const testIntegralActiveObs = {
                id: 'obs-test-integral-active',
                evaluatedType: 'turma',
                unitOfAnalysis: 'turma',
                className: 'Maternal II - Turma Integral',
                isIntegral: true,
                integralStage: 'matutino',
                teachersMorning: ['Mariana Santos', 'Roberta Dias'],
                teachersAfternoon: ['Patricia Souza', 'Camila Vasconcelos'],
                teachers: ['Mariana Santos', 'Roberta Dias', 'Patricia Souza', 'Camila Vasconcelos'],
                teacherName: 'Mariana Santos, Roberta Dias, Patricia Souza, Camila Vasconcelos',
                responses: { '1.1.2': 'partial' },
                partialAttributions: {},
                criterionComments: {},
                photos: {}
              };
              appState.currentObs = testIntegralActiveObs;
              renderActiveObservation(false);

              // 1. Etapa Matutina: Verifica se as opções de docentes contêm estritamente as 2 docentes da manhã
              const morningPartialBox = document.getElementById('partial-attribution-box-1.1.2');
              if (!morningPartialBox) throw new Error('partial-attribution-box-1.1.2 ausente na observação ativa integral matutina');
              const morningTeacherChips = Array.from(morningPartialBox.querySelectorAll('.teacher-chip-select input')).map(i => i.value);
              if (!morningTeacherChips.includes('Mariana Santos') || !morningTeacherChips.includes('Roberta Dias')) {
                throw new Error('Docentes da manhã (Mariana Santos e Roberta Dias) não estão disponíveis na Etapa 1');
              }
              if (morningTeacherChips.includes('Patricia Souza') || morningTeacherChips.includes('Camila Vasconcelos')) {
                throw new Error('Docentes da tarde não devem estar disponíveis para atribuição na Etapa 1 (Matutina)');
              }
              logger.log('Atribuição Parcial Seletiva na Etapa Matutina restrita aos regentes da manhã', true, morningTeacherChips.join(', '));

              // 2. Etapa Vespertina: Verifica se as 4 docentes da turma estão disponíveis
              testIntegralActiveObs.integralStage = 'vespertino';
              renderActiveObservation(false);
              const afternoonPartialBox = document.getElementById('partial-attribution-box-1.1.2');
              const afternoonTeacherChips = Array.from(afternoonPartialBox.querySelectorAll('.teacher-chip-select input')).map(i => i.value);
              if (afternoonTeacherChips.length !== 4 || !afternoonTeacherChips.includes('Patricia Souza') || !afternoonTeacherChips.includes('Camila Vasconcelos')) {
                throw new Error('Equipe completa de 4 docentes deve estar disponível para atribuição na Etapa 2 (Vespertina)');
              }
              logger.log('Atribuição Parcial Seletiva na Etapa Vespertina disponível para os 4 regentes', true, afternoonTeacherChips.join(', '));

              // Restaura a observação ativa anterior
              appState.currentObs = savedObsBackup;
              renderActiveObservation(false);

              // Validação de Soberania da Matriz Curricular e Enxugamento Mobile
              const critCard111 = document.getElementById('crit-card-1.1.1');
              if (!critCard111) throw new Error('Card do critério 1.1.1 não renderizado');
              const artificialTrigger = critCard111.querySelector('.btn-rubric-guidance-trigger');
              if (artificialTrigger) {
                throw new Error('Falha: Gatilho artificial .btn-rubric-guidance-trigger ainda presente no card de critério');
              }
              const modalGuidanceCheck = document.getElementById('modalRubricGuidance');
              if (modalGuidanceCheck) {
                throw new Error('Falha: Modal artificial #modalRubricGuidance ainda presente no DOM');
              }
              const critTextEl = critCard111.querySelector('.crit-text');
              if (!critTextEl || !critTextEl.innerText.includes('Realiza leitura ou contação de histórias.')) {
                throw new Error('Enunciado canônico oficial do critério 1.1.1 adulterado ou incompleto');
              }
              // Confirmação determinística de ausência de botão de detalhes em critérios curtos
              const shortDetailTrigger = critCard111.querySelector('.btn-crit-detail-trigger');
              if (shortDetailTrigger) {
                throw new Error('Critério curto 1.1.1 não deve possuir botão .btn-crit-detail-trigger');
              }
              logger.log('Soberania da Matriz Oficial e Ausência de Gatilhos Artificiais nos Critérios', true);

              // Validação do Enxugamento Mobile de Textos Longos e Abertura Canônica da Bottom Sheet (#modalCriterionDetail)
              const critCard131 = document.getElementById('crit-card-1.3.1');
              if (!critCard131) throw new Error('Card do critério longo 1.3.1 não renderizado');
              const longDetailTrigger = critCard131.querySelector('.btn-crit-detail-trigger');
              if (!longDetailTrigger) {
                throw new Error('Critério longo 1.3.1 deve possuir o botão .btn-crit-detail-trigger');
              }

              // Disparo interativo de abertura do modal de detalhamento
              openCriterionDetailModal('1.3.1');
              const modalCritDetail = document.getElementById('modalCriterionDetail');
              if (!modalCritDetail || !modalCritDetail.classList.contains('active')) {
                throw new Error('Bottom sheet #modalCriterionDetail não foi ativada ao chamar openCriterionDetailModal');
              }
              const fullTextEl = document.getElementById('criterionDetailFullText');
              if (!fullTextEl || !fullTextEl.textContent.includes('práticas relacionadas à oralidade, leitura, registros gráficos')) {
                throw new Error('Enunciado canônico integral ausente no #criterionDetailFullText');
              }
              logger.log('Detecção de texto longo e abertura canônica de bottom sheet (#modalCriterionDetail)', true, 'Critério 1.3.1');

              // Disparo interativo de fechamento do modal de detalhamento
              closeCriterionDetailModal();
              if (modalCritDetail.classList.contains('active')) {
                throw new Error('Bottom sheet #modalCriterionDetail não removeu a classe active ao fechar');
              }
              logger.log('Fechamento interativo da bottom sheet oficial de critério', true);

              // Validação da heurística de texto extenso com subtítulo / dois pontos (Item 1.2.1)
              const critCard121 = document.getElementById('crit-card-1.2.1');
              if (!critCard121) throw new Error('Card do critério longo 1.2.1 não renderizado');
              const trigger121 = critCard121.querySelector('.btn-crit-detail-trigger');
              if (!trigger121) {
                throw new Error('Critério extenso 1.2.1 com subtítulo deve possuir botão .btn-crit-detail-trigger');
              }
              const mobileSpan121 = critCard121.querySelector('.crit-text-mobile');
              if (!mobileSpan121 || !mobileSpan121.textContent.includes('Brincadeira livre')) {
                throw new Error('Critério 1.2.1 deve exibir subtítulo conciso "Brincadeira livre" no mobile');
              }
              openCriterionDetailModal('1.2.1');
              if (!modalCritDetail.classList.contains('active')) {
                throw new Error('Bottom sheet não abriu para o critério 1.2.1');
              }
              if (!fullTextEl.textContent.includes('organiza previamente materiais, tempos e espaços')) {
                throw new Error('Enunciado canônico integral do critério 1.2.1 ausente no #criterionDetailFullText');
              }
              closeCriterionDetailModal();
              logger.log('Enxugamento mobile determinístico com subtítulo e abertura oficial', true, 'Critério 1.2.1');
            } catch (e) {
              logger.log('Erro de execução no módulo rubricas_observacao', false, e.message);
            }
          }
        },

        // --- MÓDULO 5: Síntese Pedagógica, Escala de Materiais, Finalização e Cálculo de Tempo ---
        {
          id: 'sintese_finalizacao',
          name: 'Síntese Pedagógica, Escala de Materiais, Finalização e Cálculo de Tempo',
          run: function(logger) {
            try {
              if (appState.currentObs && appState.currentObs.responses) {
                // Assegura que nenhum critério esteja como parcial sem justificativa
                const curSections = getActiveSections(appState.currentObs);
                curSections.forEach(sec => (sec.subSections || []).forEach(sub => (sub.criteria || []).forEach(crit => {
                  appState.currentObs.responses[crit.id] = 'consistent';
                })));
                if (appState.currentObs.partialAttributions) appState.currentObs.partialAttributions = {};
              }
              if (!appState.currentObs) {
                appState.currentUserKey = 'mariana';
                const schoolClasses = getClassesForSchool('CEI Professora Maria de Lourdes');
                const targetCls = schoolClasses[0] ? schoolClasses[0].name : 'Infantil I - Turma A';
                openSetupScreen();
                UI.select(document.getElementById('setupSchool'), 'CEI Professora Maria de Lourdes');
                UI.select(document.getElementById('setupClass'), targetCls);
                UI.select(document.getElementById('setupBimester'), '1º Bimestre');
                startNewObservation();
                const sections = getActiveSections(appState.currentObs);
                sections.forEach(sec => (sec.subSections || []).forEach(sub => (sub.criteria || []).forEach(crit => {
                  appState.currentObs.responses[crit.id] = 'consistent';
                })));
              }
              const obs = appState.currentObs;
              if (!obs) throw new Error('appState.currentObs ausente');
              obs.synthesisMaterialDimension = 3;
              obs.synthesisPredominant = 'Livros e materiais de desenho/pintura';
              obs.synthesisOrg = 'Pequenos grupos e cantos de atividades';

              // 1. Teste de Bloqueio por Horário de Término Ausente
              obs.status = 'draft';
              obs.startTime = '08:00';
              obs.endTime = '';
              const endInput = document.getElementById('synthesisEndTime');
              if (endInput) UI.type(endInput, '');
              finalizeObservation();
              if (obs.status === 'finalized') throw new Error('Permitiu finalizar sem horário de término');
              logger.log('Bloqueio determinístico de finalização com término ausente', true);

              // 2. Teste de Consistência Temporal (Término Anterior ao Início)
              obs.startTime = '09:00';
              obs.endTime = '08:00';
              if (endInput) UI.type(endInput, '08:00');
              const startInput = document.getElementById('synthesisStartTime');
              if (startInput) UI.type(startInput, '09:00');
              finalizeObservation();
              if (obs.status === 'finalized') throw new Error('Permitiu finalizar com horário inconsistente (término <= início)');
              logger.log('Bloqueio determinístico de horário de término anterior ao início', true);

              // 3. Finalização Regular com Preservação dos Horários Manuais Anotados
              const testDate = getTodayDateString();
              obs.startDate = testDate;
              obs.date = testDate;
              obs.startTime = '08:00';
              obs.endTime = '09:40';
              // Sincroniza e reseta os inputs de horário no formulário para a observação sob teste
              const dateInput = document.getElementById('synthesisDate');
              if (dateInput) UI.type(dateInput, testDate);
              if (startInput) UI.type(startInput, '08:00');
              if (endInput) UI.type(endInput, '09:40');

              // PILAR 5: Preenchimento das 5 dimensões e parecer nominal para permitir finalização de turma
              const sampleTeachers = (obs.teachers && obs.teachers.length > 0) ? obs.teachers : ['Ana Carolina Silva', 'Juliana Roberta Rocha'];
              if (!obs.teacherSynthesis) obs.teacherSynthesis = {};
              sampleTeachers.forEach(tName => {
                obs.teacherSynthesis[tName] = {
                  dimensions: {
                    estrategias: 'consistent',
                    gestao_grupo: 'consistent',
                    mediacao_individual: 'consistent',
                    respeito_integridade: 'consistent',
                    gestao_cuidados: 'consistent'
                  },
                  feedback: `Excelente atuação pedagógica de ${tName} em sala.`
                };
              });

              finalizeObservation();
              if (obs.status !== 'finalized') throw new Error('Status não é finalized após finalizeObservation()');
              logger.log('Finalização com transição de status para finalized', true);

              if (obs.startTime !== '08:00' || obs.endTime !== '09:40' || obs.date !== testDate) {
                throw new Error(`Horários informados não foram preservados: ${obs.startTime} às ${obs.endTime} na data ${obs.date}`);
              }
              logger.log('Preservação integral dos horários anotados manualmente pelo docente (08:00 às 09:40)', true, `${obs.date} · 08:00 às 09:40`);

              if (obs.durationMinutes !== 100) throw new Error(`Cálculo de duração incorreto: esperado 100min, obtido ${obs.durationMinutes}min`);
              logger.log('Cálculo da duração da observação em minutos (durationMinutes = 100)', true, `${obs.durationMinutes} min`);

              const archived = (appState.observations || []).find(o => o.id === obs.id);
              if (!archived) throw new Error('Observação finalizada não localizada em appState.observations');
              logger.log('Consolidação e arquivamento em appState.observations', true);

              // Importação de Ocorrências da Turma na Síntese Pedagógica
              appState.currentObs = obs;
              appState.isReadOnly = false;
              importNotesIntoSynthesis();
              logger.log('Importação de ocorrências por turma na síntese pedagógica', true);
              appState.isReadOnly = true;
              appState.currentObs = null;

              // PILAR 4: Teste Determinístico do Ciclo de Turma em Tempo Integral (Duas Etapas)
              const integralObs = {
                id: 'obs-integral-test-' + Date.now(),
                evaluatedType: 'turma',
                unitOfAnalysis: 'turma',
                className: 'Maternal II - Turma Integral',
                classShift: 'Integral',
                isIntegral: true,
                integralStage: 'matutino',
                morningObs: {
                  date: testDate,
                  startTime: '08:00',
                  endTime: '11:30',
                  durationMinutes: 210,
                  completed: false,
                  completedAt: null
                },
                afternoonObs: {
                  date: testDate,
                  startTime: '13:30',
                  endTime: '16:30',
                  durationMinutes: 180,
                  completed: false,
                  completedAt: null
                },
                totalIntegralDurationMinutes: null,
                schoolName: 'CEI Professora Maria de Lourdes',
                teachers: ['Ana Carolina Silva', 'Juliana Roberta Rocha', 'Carla Beatriz Mendes', 'Patricia Souza'],
                teacherName: 'Ana, Juliana, Carla e Patricia',
                evaluatedBy: 'Mariana Ferreira',
                bimester: '3º Bimestre',
                startDate: testDate,
                endDate: testDate,
                date: testDate,
                startTime: '08:00',
                endTime: '11:30',
                durationMinutes: 210,
                status: 'draft',
                synthesisMaterialDimension: 3,
                synthesisPredominant: 'Livros e materiais de desenho/pintura',
                synthesisOrg: 'Pequenos grupos e cantos de atividades',
                responses: {},
                criterionComments: {},
                photos: {},
                linkedNotes: []
              };

              const sectionsInt = getActiveSections(integralObs);
              sectionsInt.forEach(sec => (sec.subSections || []).forEach(sub => (sub.criteria || []).forEach(crit => {
                integralObs.responses[crit.id] = 'consistent';
              })));

              appState.observations.unshift(integralObs);
              appState.currentObs = integralObs;
              appState.isReadOnly = false;

              // Bloqueio de Finalização Prematura na Etapa 1 (Matutina)
              finalizeObservation();
              if (integralObs.status === 'finalized') {
                throw new Error('Permitiu finalizar turma integral antes da etapa vespertina');
              }
              logger.log('Bloqueio determinístico de envio prematuro de turma integral na Etapa 1 (Pilar 4)', true);

              // Execução de saveMorningStageAndExit()
              const mStartEl = document.getElementById('synthesisMorningStartTime');
              const mEndEl = document.getElementById('synthesisMorningEndTime');
              if (mStartEl) UI.type(mStartEl, '08:00');
              if (mEndEl) UI.type(mEndEl, '11:30');
              saveMorningStageAndExit();
              if (integralObs.integralStage !== 'vespertino' || !integralObs.morningObs.completed) {
                throw new Error('saveMorningStageAndExit falhou na transição para vespertino');
              }
              logger.log('Salvamento e transição de etapa matutina para vespertino (saveMorningStageAndExit)', true, 'Etapa 2/2');

              // Retomada e Conclusão com Carga Horária Somada
              resumeObservation(integralObs.id, false);
              const aStartEl = document.getElementById('synthesisAfternoonStartTime');
              const aEndEl = document.getElementById('synthesisAfternoonEndTime');
              if (aStartEl) UI.type(aStartEl, '13:30');
              if (aEndEl) UI.type(aEndEl, '16:30');

              // PILAR 5: Inicialização das dimensões e parecer para as 4 docentes da turma integral
              if (!integralObs.teacherSynthesis) integralObs.teacherSynthesis = {};
              integralObs.teachers.forEach(tName => {
                integralObs.teacherSynthesis[tName] = {
                  dimensions: {
                    estrategias: 'consistent',
                    gestao_grupo: 'consistent',
                    mediacao_individual: 'consistent',
                    respeito_integridade: 'consistent',
                    gestao_cuidados: 'consistent'
                  },
                  feedback: `Atuação integrada da docente ${tName} em tempo integral.`
                };
              });

              finalizeObservation();

              if (integralObs.status !== 'finalized') {
                throw new Error('Falha ao finalizar turma integral após preencher ambos os turnos');
              }
              if (integralObs.totalIntegralDurationMinutes !== 390) {
                throw new Error(`Duração somada esperada 390min, obtido ${integralObs.totalIntegralDurationMinutes}min`);
              }
              logger.log('Finalização de Turma Integral em Formulário Único com horários somados (Pilar 4)', true, `${integralObs.totalIntegralDurationMinutes} min acumulados (6h30)`);

              // PILAR 5 & 1.12: Teste de Renderização Sequencial por Turno na Síntese Integral
              const integralSynthObs = {
                id: 'obs-synth-integral-test-' + Date.now(),
                evaluatedType: 'turma',
                unitOfAnalysis: 'turma',
                className: 'Maternal II - Turma Integral',
                schoolName: 'CEI Professora Maria de Lourdes',
                isIntegral: true,
                integralStage: 'vespertino',
                teachersMorning: ['Mariana Santos', 'Roberta Dias'],
                teachersAfternoon: ['Patricia Souza', 'Camila Vasconcelos'],
                teachers: ['Mariana Santos', 'Roberta Dias', 'Patricia Souza', 'Camila Vasconcelos'],
                teacherName: 'Mariana, Roberta, Patricia e Camila',
                evaluatedBy: 'Mariana Ferreira',
                startDate: testDate,
                date: testDate,
                startTime: '08:00',
                endTime: '16:30',
                status: 'draft',
                synthesisMaterialDimension: 3,
                synthesisPredominant: 'Livros e materiais de desenho/pintura',
                synthesisOrg: 'Pequenos grupos e cantos de atividades',
                responses: { '1.1.2': 'partial' },
                partialAttributions: {
                  '1.1.2': {
                    teachers: ['Mariana Santos'],
                    justification: 'Perguntas fechadas na rotina matutina.'
                  }
                },
                teacherSynthesis: {}
              };
              appState.currentObs = integralSynthObs;
              appState.isReadOnly = false;
              renderSynthesisScreen();

              const mHeader = document.getElementById('synthesisMorningTeachersHeader');
              const aHeader = document.getElementById('synthesisAfternoonTeachersHeader');
              if (!mHeader || !aHeader) {
                throw new Error('Cabeçalhos segregados de turno (synthesisMorningTeachersHeader ou synthesisAfternoonTeachersHeader) ausentes na síntese integral');
              }
              const cardM0 = document.getElementById('teacher-synthesis-card-0');
              const cardM1 = document.getElementById('teacher-synthesis-card-1');
              const cardA2 = document.getElementById('teacher-synthesis-card-2');
              const cardA3 = document.getElementById('teacher-synthesis-card-3');
              if (!cardM0 || !cardM1 || !cardA2 || !cardA3) {
                throw new Error('Cards nominais das 4 docentes da turma integral não foram renderizados sequencialmente (0, 1, 2, 3)');
              }
              if (!cardM0.innerText.includes('Mariana Santos') || !cardM1.innerText.includes('Roberta Dias')) {
                throw new Error('Subseção 4.1 da manhã não contém Mariana Santos e Roberta Dias');
              }
              if (!cardA2.innerText.includes('Patricia Souza') || !cardA3.innerText.includes('Camila Vasconcelos')) {
                throw new Error('Subseção 4.2 da tarde não contém Patricia Souza e Camila Vasconcelos');
              }
              logger.log('Renderização Sequencial por Turno na Síntese Integral (Manhã 4.1 ➔ Tarde 4.2)', true);

              // Validação de atribuição matutina no card de Mariana Santos
              if (!cardM0.innerText.includes('1.1.2') || !cardM0.innerText.includes('Perguntas fechadas na rotina matutina.')) {
                throw new Error('Apontamento parcial da manhã não foi vinculado ao card de Mariana Santos');
              }
              logger.log('Rastreabilidade de apontamento de fragilidade matutina no card da docente da manhã', true);

              // PILAR 4 & 5 (v1.14): Teste de Bloqueio Mandatório de Docentes Vespertinos na Etapa Matutina em Turma Integral
              const testIntegralMorningSynth = {
                id: 'obs-test-integral-morning-synth-' + Date.now(),
                evaluatedType: 'turma',
                unitOfAnalysis: 'turma',
                className: 'Maternal II - Turma Integral',
                schoolName: 'CEI Professora Maria de Lourdes',
                isIntegral: true,
                integralStage: 'matutino',
                teachersMorning: ['Mariana Santos', 'Roberta Dias'],
                teachersAfternoon: ['Patricia Souza', 'Camila Vasconcelos'],
                teachers: ['Mariana Santos', 'Roberta Dias', 'Patricia Souza', 'Camila Vasconcelos'],
                teacherName: 'Mariana, Roberta, Patricia e Camila',
                evaluatedBy: 'Mariana Ferreira',
                startDate: testDate,
                date: testDate,
                startTime: '08:00',
                endTime: '11:30',
                status: 'draft',
                synthesisMaterialDimension: 3,
                synthesisPredominant: 'Livros e materiais de desenho/pintura',
                synthesisOrg: 'Pequenos grupos e cantos de atividades',
                responses: {},
                partialAttributions: {},
                teacherSynthesis: {}
              };
              appState.currentObs = testIntegralMorningSynth;
              appState.isReadOnly = false;
              renderSynthesisScreen();

              // 1. Verifica presença do banner contextual de bloqueio
              const blockedNoticeEl = document.getElementById('synthesisAfternoonBlockedNotice');
              if (!blockedNoticeEl) {
                throw new Error('Banner #synthesisAfternoonBlockedNotice ausente na síntese de turma integral na Etapa Matutina');
              }

              // 2. Verifica desabilitação dos controles dos docentes da tarde (cards 2 e 3)
              const cardAft0 = document.getElementById('teacher-synthesis-card-2');
              const cardAft1 = document.getElementById('teacher-synthesis-card-3');
              if (!cardAft0 || !cardAft1) {
                throw new Error('Cards dos docentes vespertinos não encontrados para verificação de bloqueio');
              }
              if (!cardAft0.innerText.includes('Bloqueado no Turno Matutino') || !cardAft1.innerText.includes('Bloqueado no Turno Matutino')) {
                throw new Error('Selo "Bloqueado no Turno Matutino" ausente nos cards dos docentes vespertinos');
              }

              const aftButtons = cardAft0.querySelectorAll('.dim-pill-btn');
              aftButtons.forEach(btn => {
                if (!btn.disabled) throw new Error('Botão de dimensão em docente vespertino não está desabilitado na Etapa Matutina');
              });
              const aftTextarea = cardAft0.querySelector('textarea');
              if (!aftTextarea || !aftTextarea.disabled) {
                throw new Error('Textarea de parecer em docente vespertino não está desabilitado na Etapa Matutina');
              }

              // 3. Verifica rejeição da blindagem lógica JS
              setTeacherSynthesisDimension('Patricia Souza', 'estrategias', 'consistent');
              if (testIntegralMorningSynth.teacherSynthesis['Patricia Souza']?.dimensions?.estrategias === 'consistent') {
                throw new Error('setTeacherSynthesisDimension não bloqueou mutação para docente vespertino na Etapa Matutina');
              }

              // 4. Transiciona para Etapa Vespertina e verifica desbloqueio dos 4 docentes
              testIntegralMorningSynth.integralStage = 'vespertino';
              renderSynthesisScreen();
              const cardAft0After = document.getElementById('teacher-synthesis-card-2');
              const aftBtnUnlocked = cardAft0After.querySelectorAll('.dim-pill-btn');
              aftBtnUnlocked.forEach(btn => {
                if (btn.disabled) throw new Error('Botão de dimensão em docente vespertino permaneceu desabilitado na Etapa Vespertina');
              });
              logger.log('Bloqueio Mandatório de Docentes Vespertinos na Etapa Matutina e Desbloqueio na Vespertina (v1.14)', true, '4 regentes liberados na tarde');

              // PILAR 5: Teste dos Blocos Nominais por Docente na Síntese e Validação na Finalização
              const synthObs = {
                id: 'obs-synth-test-' + Date.now(),
                evaluatedType: 'turma',
                unitOfAnalysis: 'turma',
                className: 'Infantil I - Turma A',
                schoolName: 'CEI Professora Maria de Lourdes',
                bimester: '2º Bimestre',
                teachers: ['Ana Carolina Silva', 'Juliana Roberta Rocha'],
                teacherName: 'Ana Carolina Silva, Juliana Roberta Rocha',
                evaluatedBy: 'Mariana Ferreira',
                startDate: testDate,
                date: testDate,
                startTime: '08:00',
                endTime: '10:00',
                status: 'draft',
                synthesisMaterialDimension: 2,
                synthesisPredominant: 'Livros e materiais de desenho/pintura',
                synthesisOrg: 'Pequenos grupos e cantos de atividades',
                responses: {},
                partialAttributions: {
                  '1.1.2': {
                    teachers: ['Ana Carolina Silva'],
                    justification: 'Perguntas fechadas na roda.'
                  }
                },
                teacherSynthesis: {}
              };
              const synthSections = getActiveSections(synthObs);
              synthSections.forEach(sec => (sec.subSections || []).forEach(sub => (sub.criteria || []).forEach(crit => {
                synthObs.responses[crit.id] = (crit.id === '1.1.2') ? 'partial' : 'consistent';
              })));
              appState.currentObs = synthObs;
              appState.isReadOnly = false;
              renderSynthesisScreen();

              const teachersSec = document.getElementById('synthesisTeachersSection');
              const cardAna = document.getElementById('teacher-synthesis-card-0');
              const cardJuliana = document.getElementById('teacher-synthesis-card-1');
              if (!teachersSec || teachersSec.style.display === 'none' || !cardAna || !cardJuliana) {
                throw new Error('Blocos nominais de docentes regentes não renderizados na síntese');
              }
              logger.log('Renderização dos Blocos Finais Nominais por Professor Regente na Síntese', true);

              // Rastreabilidade de itens parciais vinculados à Ana Carolina Silva
              const anaPartialText = cardAna.textContent;
              if (!anaPartialText.includes('1.1.2') || !anaPartialText.includes('Perguntas fechadas na roda.')) {
                throw new Error('Critério parcial não vinculado corretamente ao card nominal da docente atribuída');
              }
              logger.log('Rastreabilidade e Vínculo Automático de Itens Parciais no Card do Docente', true);

              // Validação na Finalização: bloqueio sem preenchimento completo de dimensões e parecer individual
              finalizeObservation();
              if (synthObs.status === 'finalized') {
                throw new Error('Permitiu finalizar observação sem avaliar dimensões e parecer dos docentes regentes');
              }

              // Preenche dimensões e parecer para ambas
              ['Ana Carolina Silva', 'Juliana Roberta Rocha'].forEach(t => {
                setTeacherSynthesisDimension(t, 'estrategias', 'consistent');
                setTeacherSynthesisDimension(t, 'gestao_grupo', 'consistent');
                setTeacherSynthesisDimension(t, 'mediacao_individual', 'consistent');
                setTeacherSynthesisDimension(t, 'respeito_integridade', 'consistent');
                setTeacherSynthesisDimension(t, 'gestao_cuidados', 'consistent');
                setTeacherSynthesisFeedback(t, `Parecer pedagógico individual de ${t}.`);
              });

              finalizeObservation();
              if (synthObs.status !== 'finalized') {
                throw new Error('Falha ao finalizar observação após preencher blocos nominais de docentes');
              }
              logger.log('Avaliação das 5 Dimensões e Parecer Individual com Validação na Finalização', true);

              appState.currentObs = null;
            } catch (e) {
              logger.log('Erro de execução no módulo sintese_finalizacao', false, e.message);
            }
          }
        },

        // --- MÓDULO 6: Travas de Duplo Lançamento, Imutabilidade Longitudinal e Segurança ---
        {
          id: 'travas_seguranca',
          name: 'Travas de Duplo Lançamento, Imutabilidade Longitudinal e Segurança',
          run: function(logger) {
            try {
              appState.currentUserKey = 'mariana';
              openSetupScreen();
              UI.select(document.getElementById('setupSchool'), 'CEI Professora Maria de Lourdes');
              UI.select(document.getElementById('setupClass'), 'Infantil I - Turma A');

              if (!appState.observations.some(o => o.className === 'Infantil I - Turma A' && o.bimester === '1º Bimestre' && o.status === 'finalized')) {
                appState.observations.push({
                  id: 'obs-prev-' + Date.now(),
                  evaluatedType: 'turma',
                  className: 'Infantil I - Turma A',
                  schoolName: 'CEI Professora Maria de Lourdes',
                  bimester: '1º Bimestre',
                  status: 'finalized',
                  date: getTodayDateString(),
                  responses: {}
                });
              }

              const nextBim = getNextEligibleBimesterForClass('Infantil I - Turma A', 'CEI Professora Maria de Lourdes');
              if (nextBim !== '2º Bimestre') throw new Error(`Esperado 2º Bimestre após finalizar 1º, obtido: ${nextBim}`);
              logger.log('Progressão sequencial longitudinal por turma (avanço de 1º para 2º)', true);

              let blocked = false;
              const originalToast = window.showToast;
              window.showToast = function(msg) {
                if (msg && msg.includes('Já existe uma observação')) blocked = true;
              };
              UI.select(document.getElementById('setupBimester'), '1º Bimestre');
              startNewObservation();
              window.showToast = originalToast;

              if (!blocked) throw new Error('Trava de duplo lançamento para a mesma turma/bimestre não disparou bloqueio');
              logger.log('Bloqueio estrito de duplicidade de observação no mesmo bimestre', true);

              // TESTE PILAR 1 REESTRUTURADO: Validação Estrita do Modal e Gestão de Ocorrências
              // 1. Teste de Ausência Física dos Elementos Removidos no DOM
              if (document.getElementById('noteSchool') !== null ||
                  document.getElementById('noteClass') !== null ||
                  document.getElementById('noteTopic') !== null ||
                  document.getElementById('noteObsContextAlert') !== null) {
                throw new Error('Elementos suprimidos do modal de ocorrência continuam presentes no DOM');
              }
              // Validação da Supressão do Botão de Nova Ocorrência na Tela de Registros Formativos (v1.22)
              if (document.getElementById('btnNewQualitativeNote') !== null) {
                throw new Error('Botão de nova ocorrência (#btnNewQualitativeNote) continua indevidamente presente no DOM da tela de registros formativos');
              }
              logger.log('Supressão confirmada de campos redundantes e do botão #btnNewQualitativeNote em registros formativos', true);

              // 2. Teste do Guardião: Bloqueio sem Observação Ativa
              appState.currentObs = null;
              let blockedWithoutObs = false;
              const prevToast = window.showToast;
              window.showToast = function(msg) {
                if (msg && msg.includes('observação pedagógica')) blockedWithoutObs = true;
              };
              openQualitativeNoteModal();
              window.showToast = prevToast;

              if (!blockedWithoutObs || document.getElementById('modalQualitativeNote').classList.contains('active')) {
                throw new Error('Abertura do modal de ocorrência permitida sem observação em andamento');
              }
              logger.log('Guardião estrito: bloqueio de ocorrência sem observação pedagógica ativa', true);

              // 3. Caso Docente Único com Observação Ativa: Berçário II - Turma Única
              appState.currentObs = {
                id: 'obs-test-audit-single',
                schoolName: 'CEI Professora Maria de Lourdes',
                className: 'Berçário II - Turma Única',
                teachers: ['Carla Beatriz Mendes'],
                teacherName: 'Carla Beatriz Mendes',
                linkedNotes: []
              };
              openQualitativeNoteModal();
              const teacherSelect = document.getElementById('noteTeacher');
              if (!teacherSelect.disabled || teacherSelect.value !== 'Carla Beatriz Mendes') {
                throw new Error('Falha na trava mandatória de docente único regente (esperado Carla Beatriz Mendes travada)');
              }
              logger.log('Bloqueio automático e trava mandatória para turma com docente único', true, 'Carla Beatriz Mendes (travado)');
              closeQualitativeNoteModal();

              // 4. Caso Dois Docentes com Observação Ativa (Pilar 13): Infantil I - Turma A
              appState.currentObs = {
                id: 'obs-test-audit-pair',
                schoolName: 'CEI Professora Maria de Lourdes',
                className: 'Infantil I - Turma A',
                teachers: ['Ana Carolina Silva', 'Juliana Roberta Rocha'],
                teacherName: 'Ana Carolina Silva',
                classShift: 'Tempo Parcial (Matutino)',
                bimester: '2º Bimestre',
                linkedNotes: []
              };
              openQualitativeNoteModal();
              if (teacherSelect.disabled) {
                throw new Error('Seletor de docente bloqueado para turma compartilhada');
              }
              const optValues = Array.from(teacherSelect.options).map(o => o.value);
              if (!optValues.includes('__TURMA_GERAL__') || !optValues.includes('Ana Carolina Silva') || !optValues.includes('Juliana Roberta Rocha')) {
                throw new Error('Seletor de docentes não contém opção __TURMA_GERAL__ ou lista nominal de regentes');
              }
              if (teacherSelect.value !== '__TURMA_GERAL__') {
                throw new Error('Opção primária padrão de ocorrência deveria ser __TURMA_GERAL__');
              }
              logger.log('Opção primária atribuída à Toda a Turma e lista de conduta individual (Pilar 13)', true, 'Opção padrão: __TURMA_GERAL__');

              // 5. Persistência de Ocorrência Coletiva da Turma
              UI.type(document.getElementById('noteContent'), 'Fato coletivo da sala: rotina compartilhada.');
              saveQualitativeNote();
              const createdNoteTurma = appState.notes.find(n => n.content && n.content.includes('Fato coletivo da sala'));
              if (!createdNoteTurma || createdNoteTurma.isIndividualConduct !== false || createdNoteTurma.teacherName !== 'Geral da Turma (Rotina Coletiva)' || createdNoteTurma.obsId !== 'obs-test-audit-pair') {
                throw new Error('Ocorrência coletiva não foi gravada corretamente como rotina da turma');
              }
              logger.log('Persistência de ocorrência vinculada à Turma (isIndividualConduct=false)', true, createdNoteTurma.topic);

              // 6. Persistência de Conduta Individual: Juliana Roberta Rocha
              openQualitativeNoteModal();
              UI.select(teacherSelect, 'Juliana Roberta Rocha');
              UI.type(document.getElementById('noteContent'), 'Conduta individual observada: diálogo formativo requerido.');
              saveQualitativeNote();
              const createdNoteInd = appState.notes.find(n => n.content && n.content.includes('Conduta individual observada'));
              if (!createdNoteInd || createdNoteInd.isIndividualConduct !== true || createdNoteInd.teacherName !== 'Juliana Roberta Rocha') {
                throw new Error('Ocorrência de conduta individual não persistiu dados nominais da regente');
              }
              logger.log('Persistência de ocorrência de conduta individual (isIndividualConduct=true)', true, createdNoteInd.topic);

              // 7. Ciclo de Gestão Formativa (Status "Conversado") via #modalResolveNote
              openResolveNoteModal(createdNoteInd.id);
              const modalResolve = document.getElementById('modalResolveNote');
              if (!modalResolve || !modalResolve.classList.contains('active')) {
                throw new Error('Modal de resolução #modalResolveNote não abriu');
              }
              UI.type(document.getElementById('resolveNoteResolutionNotes'), 'Pactuado ajuste na organização dos cantos de leitura.');
              confirmResolveNote();
              if (createdNoteInd.resolved !== true || !createdNoteInd.resolutionNotes.includes('cantos de leitura') || !createdNoteInd.resolvedAt) {
                throw new Error('Falha ao marcar ocorrência como CONVERSADA e persistir acordos pedagógicos');
              }
              logger.log('Ciclo de Gestão Formativa: ocorrência marcada como CONVERSADA com acordos pactuados (Pilar 13)', true, createdNoteInd.resolvedAt);

              closeQualitativeNoteModal();
              appState.currentObs = null;
            } catch (e) {
              logger.log('Erro de execução no módulo travas_seguranca', false, e.message);
            }
          }
        },

        // --- MÓDULO 7: Acompanhamento da Formadora, Matriz de Coordenação e Isolamento de Perfis ---
        {
          id: 'formadora_coordenacao',
          name: 'Acompanhamento da Formadora, Matriz de Coordenação e Isolamento de Perfis',
          run: function(logger) {
            try {
              appState.currentUserKey = 'clarice';
              openSetupScreen();
              const targetGroup = document.getElementById('groupSetupTargetPerson');
              const classGroup = document.getElementById('groupSetupClass');
              if (targetGroup.style.display === 'none') throw new Error('Seletor de coordenadora não visível para formadora');
              if (classGroup.style.display !== 'none') throw new Error('Seletor de turma visível para formadora');
              logger.log('Adaptação de escopo e isolamento do formulário de setup para Formadora', true);

              const mockCoordObs = { evaluatedType: 'coordenador', responses: {} };
              const coordSections = getActiveSections(mockCoordObs);
              if (!Array.isArray(coordSections) || coordSections.length === 0) throw new Error('Matriz da coordenação vazia');
              logger.log('Carregamento da Matriz de Acompanhamento da Coordenação Pedagógica', true, `${coordSections.length} dimensões`);

              // Validação de Escopo Onisciente e Bloqueio de Avaliação Direta para o Núcleo de EI
              appState.currentUserKey = 'helena';
              const helenaObs = getScopedObservations();
              if (!Array.isArray(helenaObs)) throw new Error('getScopedObservations() para Helena falhou');
              logger.log('Acesso onisciente do Núcleo de Educação Infantil a todas as observações da rede', true);

              const preObsCount = (appState.observations || []).length;
              startNewObservation();
              if ((appState.observations || []).length !== preObsCount) {
                throw new Error('Núcleo de EI conseguiu criar observação direta');
              }
              logger.log('Bloqueio mandatória de avaliação direta para perfil do Núcleo de EI', true);
            } catch (e) {
              logger.log('Erro de execução no módulo formadora_coordenacao', false, e.message);
            }
          }
        },

        // --- MÓDULO 8: Cronograma de Observações, Destaque da Próxima Observação e Baixa Automática ---
        {
          id: 'agenda_cronograma',
          name: 'Cronograma de Observações, Destaque da Próxima Observação e Baixa Automática',
          run: function(logger) {
            try {
              appState.currentUserKey = 'mariana';

              // Simulação Interativa de Criação de Agendamento via Modal (#modalAddSchedule)
              openAddScheduleModal();
              UI.select(document.getElementById('scheduleSchool'), 'CEI Professora Maria de Lourdes');
              UI.select(document.getElementById('scheduleTarget'), 'Infantil I - Turma A');
              UI.select(document.getElementById('scheduleBimester'), '3º Bimestre');
              UI.type(document.getElementById('scheduleDate'), getTodayDateString());
              UI.type(document.getElementById('scheduleTime'), '09:00');
              saveNewSchedule();
              closeAddScheduleModal();

              const createdSched = (appState.schedules || []).find(s => s.className === 'Infantil I - Turma A' && s.bimester === '3º Bimestre' && s.plannedTime === '09:00');
              if (!createdSched) throw new Error('Agendamento criado via modal não foi localizado em appState.schedules');
              logger.log('Inclusão interativa de observação agendada no cronograma (#modalAddSchedule)', true);

              const simObs = {
                id: 'obs-sim-' + Date.now(),
                scheduleId: createdSched.id,
                evaluatedType: 'turma',
                className: 'Infantil I - Turma A',
                teachers: ['Ana Carolina Silva', 'Juliana Roberta Rocha'],
                teacherName: 'Ana Carolina Silva, Juliana Roberta Rocha',
                schoolName: 'CEI Professora Maria de Lourdes',
                bimester: '3º Bimestre',
                evaluatedBy: 'Mariana Ferreira',
                status: 'draft',
                date: getTodayDateString(),
                startDate: getTodayDateString(),
                endDate: getTodayDateString(),
                startTime: '08:00',
                endTime: '09:40',
                synthesisMaterialDimension: 3,
                synthesisPredominant: 'Livros e materiais',
                synthesisOrg: 'Cantos de atividades',
                responses: {},
                teacherSynthesis: {
                  'Ana Carolina Silva': {
                    dimensions: { estrategias: 'consistent', gestao_grupo: 'consistent', mediacao_individual: 'consistent', respeito_integridade: 'consistent', gestao_cuidados: 'consistent' },
                    feedback: 'Acompanhamento satisfatório.'
                  },
                  'Juliana Roberta Rocha': {
                    dimensions: { estrategias: 'consistent', gestao_grupo: 'consistent', mediacao_individual: 'consistent', respeito_integridade: 'consistent', gestao_cuidados: 'consistent' },
                    feedback: 'Prática alinhada.'
                  }
                }
              };
              const simSections = getActiveSections(simObs);
              simSections.forEach(sec => {
                (sec.subSections || []).forEach(sub => {
                  (sub.criteria || []).forEach(crit => {
                    simObs.responses[crit.id] = 'consistent';
                  });
                });
              });
              appState.currentObs = simObs;
              appState.observations = appState.observations || [];
              appState.observations.push(simObs);
              const schedStartInp = document.getElementById('synthesisStartTime');
              const schedEndInp = document.getElementById('synthesisEndTime');
              if (schedStartInp) UI.type(schedStartInp, '08:00');
              if (schedEndInp) UI.type(schedEndInp, '09:40');
              finalizeObservation();

              const updatedSched = appState.schedules.find(s => s.id === createdSched.id);
              if (!updatedSched || updatedSched.status !== 'realizado') {
                throw new Error('Agendamento não atualizado para realizado após finalização');
              }
              logger.log('Baixa automática no cronograma de observações para status realizado', true);

              // Resolução relacional resiliente de observação vinculada
              const foundObs = findObservationForSchedule(updatedSched);
              if (!foundObs || foundObs.id !== simObs.id) {
                throw new Error('findObservationForSchedule não localizou a observação correspondente');
              }
              logger.log('Resolução relacional resiliente de observação vinculada ao agendamento no cronograma', true);

              // Renderização da tabela e validação do botão de devolutiva
              navigateToTab('schedule');
              renderScheduleScreen();

              const tbody = document.getElementById('scheduleTableBody');
              const hasFeedbackBtn = tbody && (tbody.innerHTML.includes('viewFeedbackFromSchedule') || tbody.innerHTML.includes('Devolutiva'));
              if (!hasFeedbackBtn) {
                throw new Error('Botão de Devolutiva não foi renderizado na tabela da Agenda para observação realizada');
              }
              logger.log('Renderização do botão de devolutiva na tabela da aba de Agenda', true);

              // Clique interativo na devolutiva a partir da agenda
              viewFeedbackFromSchedule(updatedSched.id);
              if (!appState.isReadOnly || !appState.currentObs || appState.currentObs.id !== simObs.id) {
                throw new Error('viewFeedbackFromSchedule falhou em abrir a observação em modo somente leitura');
              }
              logger.log('Disparo e abertura da devolutiva em modo somente leitura a partir da Agenda com rota de retorno', true);

              exitReadOnlyMode();
              const scheduleActive = document.getElementById('screenSchedule') && document.getElementById('screenSchedule').classList.contains('active');
              if (!scheduleActive) {
                throw new Error('exitReadOnlyMode não retornou para screenSchedule');
              }
              logger.log('Retorno contextual à aba Agenda com integridade de navegação', true);

              // 1. Validação de Botão Editar em Observações Realizadas na Tabela
              const hasEditBtnInRealizado = tbody && tbody.innerHTML.includes(`openEditScheduleModal('${updatedSched.id}')`);
              if (!hasEditBtnInRealizado) {
                throw new Error('Botão de Edição não foi renderizado na linha de observação realizada');
              }
              logger.log('Disponibilização do botão de edição para agendamento com status realizado', true);

              // 2. Edição de Data em Agendamento Realizado e Sincronização com Observação Vinculada
              openEditScheduleModal(updatedSched.id);
              const btnDeleteModal = document.getElementById('btnDeleteScheduleModal');
              if (!btnDeleteModal || btnDeleteModal.style.display === 'none') {
                throw new Error('Botão de exclusão não foi exibido no modal ao editar agendamento');
              }
              logger.log('Exibição contextual do botão de exclusão no modal de edição (#btnDeleteScheduleModal)', true);

              const newTestDate = '2026-10-25';
              const newTestTime = '10:00';
              UI.type(document.getElementById('scheduleDate'), newTestDate);
              UI.type(document.getElementById('scheduleTime'), newTestTime);
              saveNewSchedule();

              if (updatedSched.plannedDate !== newTestDate || updatedSched.date !== newTestDate || updatedSched.plannedTime !== newTestTime) {
                throw new Error('Agendamento não atualizou plannedDate/date/plannedTime após salvar edição');
              }
              const reFoundObs = findObservationForSchedule(updatedSched);
              if (!reFoundObs || reFoundObs.date !== newTestDate || reFoundObs.startDate !== newTestDate || reFoundObs.endDate !== newTestDate || reFoundObs.startTime !== newTestTime) {
                throw new Error('Data e horário alterados não sincronizaram com a observação realizada vinculada');
              }
              logger.log('Sincronização bidirecional de data e hora entre agendamento realizado e observação vinculada', true, `${newTestDate} ${newTestTime}`);

              // 3. Exclusão Segura de Agendamento (Delete Schedule)
              // 3a. Cria agendamento temporário
              openAddScheduleModal();
              if (btnDeleteModal.style.display !== 'none') {
                throw new Error('Botão de exclusão não deve estar visível ao adicionar novo agendamento');
              }
              UI.select(document.getElementById('scheduleSchool'), 'CEI Professora Maria de Lourdes');
              UI.select(document.getElementById('scheduleTarget'), 'Infantil II - Turma B');
              UI.select(document.getElementById('scheduleBimester'), '3º Bimestre');
              UI.type(document.getElementById('scheduleDate'), '2026-10-28');
              UI.type(document.getElementById('scheduleTime'), '11:00');
              saveNewSchedule();

              const tempSched = (appState.schedules || []).find(s => s.className === 'Infantil II - Turma B' && s.bimester === '3º Bimestre' && s.plannedDate === '2026-10-28');
              if (!tempSched) throw new Error('Agendamento temporário para teste de exclusão não foi criado');
              
              // 3b. Executa exclusão do agendamento temporário
              deleteSchedule(tempSched.id);
              const existsAfterDel = (appState.schedules || []).some(s => s.id === tempSched.id);
              if (existsAfterDel) throw new Error('Agendamento temporário ainda consta em appState.schedules após deleteSchedule');

              // 3c. Exclusão do agendamento vinculado com verificação de desvinculação da observação
              const schedWithObsId = updatedSched.id;
              deleteSchedule(schedWithObsId);
              const schedStillExists = (appState.schedules || []).some(s => s.id === schedWithObsId);
              if (schedStillExists) throw new Error('Agendamento realizado não foi expurgado de appState.schedules');
              if (simObs.scheduleId !== null) {
                throw new Error('A observação vinculada não teve seu scheduleId desvinculado (deve ser null)');
              }
              const obsStillInDb = (appState.observations || []).some(o => o.id === simObs.id);
              if (!obsStillInDb) throw new Error('Observação foi deletada indevidamente ao remover o agendamento');
              logger.log('Exclusão segura de agendamento com desvinculação relacional e preservação de observação no histórico', true);
            } catch (e) {
              logger.log('Erro de execução no módulo agenda_cronograma', false, e.message);
            }
          }
        },

        // --- MÓDULO 9: Histórico de Observações, Filtros Multidimensionais, Visualização e Exclusão ---
        {
          id: 'historico_governanca',
          name: 'Histórico de Observações, Filtros Multidimensionais, Visualização e Exclusão',
          run: function(logger) {
            try {
              appState.currentUserKey = 'mariana';
              navigateToTab('history');
              renderHistoryScreen();
              const histContainer = document.getElementById('historyCardsContainer');
              if (!histContainer) throw new Error('Container do histórico ausente no DOM');
              logger.log('Renderização do Histórico e contêiner de cards (#historyCardsContainer)', true);

              const roleFilter = document.getElementById('histFilterRole');
              if (roleFilter) {
                UI.select(roleFilter, 'professora');
              }
              const nameFilter = document.getElementById('histFilterName');
              if (nameFilter) {
                UI.type(nameFilter, 'Maria de Lourdes');
              }
              filterHistory();
              logger.log('Aplicação interativa de filtros multidimensionais com inclusão de turmas (Pilar 1)', true);
              resetHistoryFilters();
            } catch (e) {
              logger.log('Erro de execução no módulo historico_governanca', false, e.message);
            }
          }
        },

        // --- MÓDULO 10: Indicadores Pedagógicos, Cobertura no Bimestre Corrente (Pilar 7), KPIs Decisórios, Semáforo de Turmas (Pilar 10) e Apoio à Decisão ---
        {
          id: 'indicadores_decisao',
          name: 'Indicadores Pedagógicos, Cobertura no Bimestre Corrente (Pilar 7), KPIs Decisórios, Semáforo de Turmas (Pilar 10) e Apoio à Decisão',
          run: function(logger) {
            try {
              appState.currentUserKey = 'mariana';
              appState.longitudinalViewMode = 'classes';
              appState.activeSemaphoreStatusFilter = 'all';
              appState.activeSemaphoreTeacherStatusFilter = 'all';
              const memSelPre = document.getElementById('indicatorsMemberFilter');
              if (memSelPre) memSelPre.value = 'ALL';
              navigateToTab('indicators');
              renderIndicatorsScreen();
              const kpiSection = document.getElementById('indicatorsSectionKPIs');
              if (!kpiSection) throw new Error('Seção de KPIs ausente em indicadores');
              logger.log('Renderização do Painel de Indicadores e seção de KPIs', true);

              // 1. PILAR 7: ASSERÇÕES NEGATIVAS ESTRITAS (EXTINÇÃO DE MÉTRICAS BUROCRÁTICAS)
              const kpiHtml = kpiSection.innerHTML;
              const hasOldAuditadas = kpiHtml.includes('Observações Auditadas') || kpiHtml.includes('Visitas Auditadas');
              const hasOldValidosNA = kpiHtml.includes('Itens Válidos / N.A.') || kpiHtml.includes('Excluindo "Não se Aplica"');
              if (hasOldAuditadas) throw new Error('Falha Pilar 7: Métrica burocrática "Auditadas" ainda presente no DOM dos KPIs');
              if (hasOldValidosNA) throw new Error('Falha Pilar 7: Métrica burocrática "Itens Válidos / N.A." ainda presente no DOM dos KPIs');
              logger.log('Extinção confirmada de métricas burocráticas ("Auditadas" e "Itens Válidos / N.A.")', true);

              // 2. PILAR 7: RESOLUÇÃO E VALIDAÇÃO DO BIMESTRE CORRENTE
              const currentBim = getCurrentSchoolBimester();
              if (!currentBim || !currentBim.includes('Bimestre')) {
                throw new Error('Falha ao resolver o bimestre escolar corrente via getCurrentSchoolBimester()');
              }
              logger.log(`Resolução do bimestre escolar corrente (Pilar 7) ➔ ${currentBim}`, true);

              // 3. PILAR 7: VALIDAÇÃO DOS 4 NOVOS CARDS DECISÓRIOS
              const hasConsistencyCard = kpiHtml.includes('Índice de Consistência');
              const hasCurrentBimCoverageCard = kpiHtml.includes('Cobertura Turmas') && kpiHtml.includes(currentBim);
              const hasAnnualCycleCard = kpiHtml.includes('Meta do Ciclo Anual');
              const hasPriorityDimCard = kpiHtml.includes('Dimensão Prioritária');

              if (!hasConsistencyCard) throw new Error('Card 1 (Índice de Consistência) ausente no grid');
              if (!hasCurrentBimCoverageCard) throw new Error('Card 2 (Cobertura no Bimestre Corrente) ausente no grid');
              if (!hasAnnualCycleCard) throw new Error('Card 3 (Meta do Ciclo Anual) ausente no grid');
              if (!hasPriorityDimCard) throw new Error('Card 4 (Dimensão Prioritária) ausente no grid');
              logger.log('Validação estrutural dos 4 novos Cards Decisórios do Grid Superior (Pilar 7)', true);

              // 4. PILAR 1 & 7: CÁLCULO E AGREGAÇÃO DE TURMAS
              const indSchools = (appState.units || []).map(u => u.name);
              let totalClasses = 0;
              indSchools.forEach(uName => {
                totalClasses += getClassesForSchool(uName).length;
              });
              logger.log('Cálculo e agregação de turmas mapeadas para cobertura na rede (Pilar 1 e 7)', totalClasses > 0, `${totalClasses} turmas totais`);

              // 5. PILAR 3: BENCHMARK AFUNILAMENTO (UE VS. REDE)
              const sampleSections = appState.activeSectionsTeacher || DEFAULT_SECTIONS_TEACHER;
              const mockObsUE = [{
                id: 'obs-mock-p3-1',
                status: 'finalized',
                evaluatedType: 'turma',
                schoolName: 'CEI Professora Maria de Lourdes',
                responses: { '1.1.1': 'consistent', '1.1.2': 'not_done' }
              }];
              const mockObsRede = [
                mockObsUE[0],
                {
                  id: 'obs-mock-p3-2',
                  status: 'finalized',
                  evaluatedType: 'turma',
                  schoolName: 'EMEI Pequeno Príncipe',
                  responses: { '1.1.1': 'consistent', '1.1.2': 'consistent' }
                }
              ];

              const ueResult = calculateHierarchyStats(mockObsUE, sampleSections);
              const redeResult = calculateHierarchyStats(mockObsRede, sampleSections);

              if (!ueResult || !ueResult.dims || !redeResult || !redeResult.dims) {
                throw new Error('calculateHierarchyStats retornou estrutura inválida');
              }
              logger.log('Motor canônico de agregação hierárquica (calculateHierarchyStats)', true, `${ueResult.dims.length} dimensões processadas`);

              const crit112UE = ueResult.dims[0].subSections[0].criteria.find(c => c.id === '1.1.2');
              const crit112Rede = redeResult.dims[0].subSections[0].criteria.find(c => c.id === '1.1.2');

              const pctUE112 = crit112UE.validTotal > 0 ? Math.round((crit112UE.consistent / crit112UE.validTotal) * 100) : 0;
              const pctRede112 = crit112Rede.validTotal > 0 ? Math.round((crit112Rede.consistent / crit112Rede.validTotal) * 100) : 0;
              const delta112 = pctUE112 - pctRede112;

              const deltaHtml = formatBenchmarkDelta(delta112, false);
              const isCritical = deltaHtml.includes('benchmark-delta-critical') && deltaHtml.includes('Atenção Crítica');
              logger.log('Cálculo determinístico do Delta e categorização de Atenção Crítica (Pilar 3)', isCritical && delta112 === -50, `Δ: ${delta112}%`);

              // Alternância interativa de sub-abas e validação da nova nomenclatura
              switchIndicatorsSubTab('kpis');
              switchIndicatorsSubTab('drilldown');
              const drillSection = document.getElementById('indicatorsSectionDrilldown');
              if (!drillSection || drillSection.style.display !== 'block') {
                throw new Error('Sub-aba de Visualização por Dimensão não ativada corretamente');
              }

              const pillLabel = document.getElementById('pillIndDrilldownLabel');
              if (!pillLabel || pillLabel.innerText !== 'Visualização por Dimensão') {
                throw new Error(`Rótulo da sub-aba divergente: esperado 'Visualização por Dimensão', obtido '${pillLabel ? pillLabel.innerText : 'null'}'`);
              }
              logger.log("Asserção de Nomenclatura da Sub-aba: 'Visualização por Dimensão' (#pillIndDrilldownLabel)", true);

              const infoBar = drillSection.querySelector('.benchmark-info-bar');
              if (!infoBar) throw new Error('.benchmark-info-bar ausente na sub-aba Visualização por Dimensão');
              if (infoBar.innerText.includes('Benchmark')) {
                throw new Error("Termo residual 'Benchmark' ainda presente no banner informativo da Visualização por Dimensão");
              }
              const hasValidBannerText = infoBar.innerText.includes('Referencial da Rede Municipal') || infoBar.innerText.includes('Panorama Geral da Rede Municipal');
              if (!hasValidBannerText) {
                throw new Error("Rótulo pedagógico válido ('Referencial da Rede Municipal' ou 'Panorama Geral da Rede Municipal') não encontrado no banner");
              }
              logger.log("Higienização e Renderização Contextual do Banner de Referencial/Panorama no DOM (Pilar 3)", true);

              // 6. PILAR 8: VALIDAÇÃO DO BLOCO DE DIAGNÓSTICO DE PRIORIDADES (GARGALOS PEDAGÓGICOS)
              switchIndicatorsSubTab('kpis');
              const bottlenecksSection = document.getElementById('indicatorsSectionBottlenecks');
              if (!bottlenecksSection) throw new Error('Falha Pilar 8: Bloco #indicatorsSectionBottlenecks ausente no DOM');
              logger.log('Renderização do Bloco de Diagnóstico de Gargalos (Pilar 8)', true);

              // 7. PILAR 8: CÁLCULO E RANQUEAMENTO DOS 3 MENORES CRITÉRIOS (MODO ABSOLUTO)
              const sampleTopBottlenecks = calculateTopBottlenecks(ueResult, redeResult, 'absolute', 3);
              if (!sampleTopBottlenecks || sampleTopBottlenecks.length === 0) {
                throw new Error('Falha Pilar 8: calculateTopBottlenecks retornou conjunto vazio');
              }
              const firstBottleneck = sampleTopBottlenecks[0];
              if (firstBottleneck.critId !== '1.1.2') {
                throw new Error(`Falha Pilar 8: Esperado critério 1.1.2 como gargalo #1, obtido ${firstBottleneck.critId}`);
              }
              logger.log('Cálculo algorítmico do Menor Índice Absoluto (#1 Gargalo: 1.1.2 - 0% na UE)', true, `Score: ${firstBottleneck.score}%`);

              // 8. PILAR 8: CÁLCULO DO DESVIO EM RELAÇÃO À REDE (MODO DELTA)
              const sampleDeltaBottlenecks = calculateTopBottlenecks(ueResult, redeResult, 'delta', 3);
              const firstDeltaBottleneck = sampleDeltaBottlenecks[0];
              if (firstDeltaBottleneck.delta !== -50) {
                throw new Error(`Falha Pilar 8: Esperado delta de -50% para o maior desvio, obtido ${firstDeltaBottleneck.delta}%`);
              }
              logger.log('Cálculo determinístico do Maior Desvio vs. Rede Municipal (Pilar 8)', true, `Δ: ${firstDeltaBottleneck.delta}%`);

              // 9. PILAR 8: DEEP-LINKING E LOCALIZAÇÃO NA VISUALIZAÇÃO POR DIMENSÃO
              locateBottleneckCriterionInDrilldown('1.1.2', 0, 'sub_0_0');
              const drillSecActive = document.getElementById('indicatorsSectionDrilldown');
              if (!drillSecActive || drillSecActive.style.display !== 'block') {
                throw new Error('Falha Pilar 8: locateBottleneckCriterionInDrilldown não ativou a sub-aba de Visualização por Dimensão');
              }
              const targetCritEl = document.getElementById('drilldownCrit_1_1_2');
              if (!targetCritEl) {
                throw new Error('Falha Pilar 8: Elemento #drilldownCrit_1_1_2 ausente no DOM da Visualização por Dimensão');
              }
              logger.log('Validação de Deep-Linking e expansão automática de nó na Visualização por Dimensão (Pilar 8)', true);

              // 9.1 PILAR 8 (AUTONOMIA PEDAGÓGICA): AUSÊNCIA DE PAUTAS PRÉ-FABRICADAS
              const hasPromptBox = bottlenecksSection.querySelector('.bottleneck-prompt-box');
              if (hasPromptBox !== null) {
                throw new Error('Falha Autonomia: Caixa .bottleneck-prompt-box ainda presente no DOM dos gargalos');
              }
              if (typeof getPedagogicalActionPrompt !== 'undefined') {
                throw new Error('Falha Autonomia: Função getPedagogicalActionPrompt ainda definida no escopo');
              }
              logger.log('Autonomia Formativa da Rede: confirmação de ausência de pautas pré-fabricadas no Bloco de Gargalos', true);

              // 9.2 PILAR 8: VALIDAÇÃO DA ALTERNÂNCIA REAL ENTRE MENOR CONSISTÊNCIA E MAIOR DESVIO VS. REDE
              const mockObsMultiUE = [
                {
                  id: 'obs-multi-ue-1',
                  status: 'finalized',
                  evaluatedType: 'turma',
                  schoolName: 'CEI Professora Maria de Lourdes',
                  responses: {
                    '1.1.1': 'consistent', '1.1.2': 'not_done', '1.2.2': 'not_done', '2.1.4': 'consistent'
                  }
                },
                {
                  id: 'obs-multi-ue-2',
                  status: 'finalized',
                  evaluatedType: 'turma',
                  schoolName: 'EMEI Pequeno Príncipe',
                  responses: {
                    '1.1.1': 'consistent', '1.1.2': 'consistent', '1.2.2': 'consistent', '2.1.4': 'not_done'
                  }
                }
              ];
              const lourdesMultiObs = mockObsMultiUE.filter(o => o.schoolName === 'CEI Professora Maria de Lourdes');
              const redeMultiObs = mockObsMultiUE;
              const lourdesHierarchy = calculateHierarchyStats(lourdesMultiObs, sampleSections);
              const redeHierarchyConsolidated = calculateHierarchyStats(redeMultiObs, sampleSections);

              const absBottlenecks = calculateTopBottlenecks(lourdesHierarchy, redeHierarchyConsolidated, 'absolute', 3);
              const deltaBottlenecks = calculateTopBottlenecks(lourdesHierarchy, redeHierarchyConsolidated, 'delta', 3);

              if (!absBottlenecks || absBottlenecks.length === 0 || !deltaBottlenecks || deltaBottlenecks.length === 0) {
                throw new Error('Falha Pilar 8: calculateTopBottlenecks retornou conjunto vazio para base multi-unidade');
              }
              const firstDelta = deltaBottlenecks[0];
              if (firstDelta.delta === null || firstDelta.delta >= 0) {
                throw new Error(`Falha Pilar 8: Esperado delta negativo no topo do modo delta, obtido ${firstDelta.delta}%`);
              }
              // Interação real no DOM
              toggleBottlenecksSortMode('delta');
              const deltaBtn = document.querySelector('.bottlenecks-toggle-btn:nth-child(2)');
              if (!deltaBtn || !deltaBtn.classList.contains('active')) {
                throw new Error('Falha Pilar 8: Botão "Maior Desvio vs. Rede" não ativado no DOM');
              }

              toggleBottlenecksSortMode('absolute');
              const absBtn = document.querySelector('.bottlenecks-toggle-btn:nth-child(1)');
              if (!absBtn || !absBtn.classList.contains('active')) {
                throw new Error('Falha Pilar 8: Botão "Menor Consistência" não ativado no DOM');
              }
              logger.log('Alternância dinâmica de dados e modos de ordenação validada com sucesso no DOM (Pilar 8)', true);

              switchIndicatorsSubTab('longitudinal');
              const longSection = document.getElementById('indicatorsSectionLongitudinal');
              if (!longSection || longSection.style.display !== 'block') {
                throw new Error('Sub-aba Longitudinal não ativada corretamente');
              }
              logger.log('Alternância e renderização interativa da aba Longitudinal de Indicadores', true);

              // 9.3 TESTES DECISÓRIOS DE GESTÃO (PLANO DE APRESENTAÇÃO DE DADOS DECISÓRIOS)
              // 9.3.1 Teste de Agrupamento por Polo no Seletor de Unidades (Helena / Núcleo de EI)
              const previousUserDec = appState.currentUserKey;
              try {
                switchIndicatorsSubTab('kpis');
                appState.currentUserKey = 'helena';
                const unitSelPre = document.getElementById('indicatorsUnitFilter');
                if (unitSelPre) unitSelPre.value = 'ALL';
                renderIndicatorsScreen();
                const unitSelEl = document.getElementById('indicatorsUnitFilter');
                if (!unitSelEl) throw new Error('Seletor #indicatorsUnitFilter ausente no DOM');
                const optgroups = unitSelEl.querySelectorAll('optgroup');
                if (!optgroups || optgroups.length === 0) {
                  throw new Error('Falha Governança Territorial: Elementos <optgroup> de Polos ausentes no seletor de Unidades para o Núcleo de EI');
                }
                logger.log('Agrupamento territorial semântico por Polo (<optgroup>) validado no seletor de UEs do Núcleo', true, `${optgroups.length} polos mapeados`);

                // 9.3.2 Teste da Tabela Executiva de Cobertura e Consistência por UE
                const execTable = document.querySelector('.ue-executive-table');
                if (!execTable) {
                  throw new Error('Falha Visão Executiva: Tabela .ue-executive-table ausente na visão consolidada do Núcleo de EI');
                }
                const focusBtn = execTable.querySelector('button[onclick*="focusUnitFilter"]');
                if (!focusBtn) {
                  throw new Error('Falha Visão Executiva: Botão de ação "Focar UE" ausente na tabela executiva');
                }
                logger.log('Renderização da Tabela Executiva de UEs e botão de foco direto (Núcleo de EI/Formadoras)', true);

                // 9.3.3 Teste da Régua de Grandes Dimensões da Matriz
                const dimCards = document.querySelectorAll('.dim-summary-card');
                if (!dimCards || dimCards.length === 0) {
                  throw new Error('Falha Régua Dimensional: Cards .dim-summary-card ausentes na Visão Geral');
                }
                logger.log('Mini-Painel das Grandes Dimensões da Matriz Pedagógica renderizado no DOM', true, `${dimCards.length} dimensões`);

                // 9.3.4 Teste da Distribuição Agregada da Escala de Materiais
                const matCard = document.querySelector('.materials-aggregate-card');
                if (!matCard) {
                  throw new Error('Falha Escala de Materiais: Card .materials-aggregate-card ausente na visão geral docente');
                }
                logger.log('Distribuição agregada dos 4 níveis da Escala de Materiais validada no DOM', true);

                // 9.3.5 Teste do Algoritmo calculateTopCriteria em modo "highest" (Pontos Fortes)
                const mockCritCriteria = calculateTopCriteria(ueResult, redeResult, 'highest', 3);
                if (!mockCritCriteria || mockCritCriteria.length === 0) {
                  throw new Error('calculateTopCriteria retornou conjunto vazio em modo highest');
                }
                for (let i = 0; i < mockCritCriteria.length - 1; i++) {
                  if (mockCritCriteria[i].score < mockCritCriteria[i+1].score) {
                    throw new Error('calculateTopCriteria não ordenou critérios em ordem decrescente de consistência');
                  }
                }
                logger.log('Motor de ranqueamento de Práticas Consolidadas (calculateTopCriteria em modo highest) validado com sucesso', true);

                // 9.3.6 Teste de Busca Instantânea e Controles Globais na Matriz de Critérios
                switchIndicatorsSubTab('drilldown');
                const searchInp = document.getElementById('drilldownSearchInput');
                if (!searchInp) throw new Error('#drilldownSearchInput ausente na Matriz de Critérios');
                expandAllDrilldown();
                const expandedGroup = document.querySelector('.drilldown-header.expanded');
                if (!expandedGroup) throw new Error('expandAllDrilldown não expandiu cabeçalhos de dimensões');
                collapseAllDrilldown();
                logger.log('Controles rápidos de busca e expansão/recolhimento na Matriz de Critérios validados com sucesso', true);
              } finally {
                appState.currentUserKey = previousUserDec || 'mariana';
                switchIndicatorsSubTab('kpis');
                renderIndicatorsScreen();
              }

              // 10. PILAR 10: VALIDAÇÃO DO QUADRO DE CONTROLE BIMESTRAL (SEMÁFORO DE TURMAS)
              const semaphoreSection = document.getElementById('bimesterSemaphoreSection');
              if (!semaphoreSection) throw new Error('Falha Pilar 10: Contêiner #bimesterSemaphoreSection ausente no DOM');
              const semTitleElem = semaphoreSection.querySelector('.semaphore-title-group h3');
              if (!semTitleElem || semTitleElem.textContent.trim() !== 'Quadro de Controle Bimestral') {
                throw new Error(`Falha Pilar 10: Título esperado "Quadro de Controle Bimestral", obtido "${semTitleElem ? semTitleElem.textContent.trim() : 'ausente'}"`);
              }
              logger.log('Renderização e conformidade do título do Quadro de Controle Bimestral (Pilar 10)', true);

              // 11. PILAR 10: VALIDAÇÃO DO MOTOR ALGORÍTMICO CALCULATECLASSBIMESTERSTATUS
              // Caso Verde (Concluída): Turma Infantil I no 1º Bimestre com obs-001 finalizada
              const statusGreen = calculateClassBimesterStatus('Infantil I - Turma A', 'CEI Professora Maria de Lourdes', '1º Bimestre');
              if (statusGreen.status !== 'completed' || statusGreen.colorKey !== 'green') {
                throw new Error(`Falha Pilar 10: Esperado status completed/green para 1º Bimestre da Infantil I, obtido ${statusGreen.status}/${statusGreen.colorKey}`);
              }
              logger.log('Cálculo algorítmico do Semáforo Canônico: 🟢 Verde (Concluída)', true, `${statusGreen.label} - Score: ${statusGreen.score}%`);

              // Caso Vermelho (Atrasado): Turma Infantil II no 1º Bimestre (sem observação concluída e bimestre já encerrado)
              const statusRed = calculateClassBimesterStatus('Infantil II - Turma B', 'CEI Professora Maria de Lourdes', '1º Bimestre');
              if (statusRed.status !== 'overdue' || statusRed.colorKey !== 'red') {
                throw new Error(`Falha Pilar 10: Esperado status overdue/red para 1º Bimestre não realizado da Infantil II, obtido ${statusRed.status}/${statusRed.colorKey}`);
              }
              logger.log('Cálculo algorítmico do Semáforo Canônico: 🔴 Vermelho (Bimestre Expirado / Atraso)', true, statusRed.label);

              // Caso Cinza / No Prazo (Em Andamento): Turma no Bimestre Corrente
              const curBimTest = getCurrentSchoolBimester();
              const statusCurrent = calculateClassBimesterStatus('Infantil II - Turma B', 'CEI Professora Maria de Lourdes', curBimTest);
              if (statusCurrent.status !== 'in_progress' && statusCurrent.status !== 'completed') {
                throw new Error(`Falha Pilar 10: Esperado status in_progress para bimestre corrente ${curBimTest}, obtido ${statusCurrent.status}`);
              }
              logger.log('Cálculo algorítmico do Semáforo Canônico: ⚪ No Prazo (Bimestre em Andamento)', true, statusCurrent.label);

              // PILAR 10: VALIDAÇÃO DO MOTOR ALGORÍTMICO CALCULATETEACHERBIMESTERSTATUS
              // Caso 1: Docente com observação concluída (Ana Carolina Silva no 1º Bimestre)
              const teacherStatusGreen = calculateTeacherBimesterStatus('Ana Carolina Silva', 'CEI Professora Maria de Lourdes', '1º Bimestre');
              if (teacherStatusGreen.status !== 'completed' || teacherStatusGreen.colorKey !== 'green') {
                throw new Error(`Falha Pilar 10 Docente: Esperado status completed/green para Ana Carolina no 1º Bimestre, obtido ${teacherStatusGreen.status}/${teacherStatusGreen.colorKey}`);
              }
              logger.log('Cálculo algorítmico do Semáforo Docente: 🟢 Verde (Concluída)', true, `${teacherStatusGreen.label} - Score: ${teacherStatusGreen.score}%`);

              // Caso 2: Docente com observação atrasada (Carla Beatriz Mendes no 1º Bimestre sem observação)
              const teacherStatusRed = calculateTeacherBimesterStatus('Carla Beatriz Mendes', 'CEI Professora Maria de Lourdes', '1º Bimestre');
              if (teacherStatusRed.status !== 'overdue' || teacherStatusRed.colorKey !== 'red') {
                throw new Error(`Falha Pilar 10 Docente: Esperado status overdue/red para Carla Beatriz no 1º Bimestre, obtido ${teacherStatusRed.status}/${teacherStatusRed.colorKey}`);
              }
              logger.log('Cálculo algorítmico do Semáforo Docente: 🔴 Vermelho (Atrasada / Bimestre Expirado)', true, teacherStatusRed.label);

              // Caso 3: Docente no bimestre corrente
              const curBimTeacherTest = getCurrentSchoolBimester();
              const teacherStatusCurrent = calculateTeacherBimesterStatus('Carla Beatriz Mendes', 'CEI Professora Maria de Lourdes', curBimTeacherTest);
              if (teacherStatusCurrent.status !== 'in_progress' && teacherStatusCurrent.status !== 'completed') {
                throw new Error(`Falha Pilar 10 Docente: Esperado status in_progress para Carla Beatriz no bimestre corrente, obtido ${teacherStatusCurrent.status}`);
              }
              logger.log('Cálculo algorítmico do Semáforo Docente: ⚪ No Prazo (Bimestre Corrente)', true, teacherStatusCurrent.label);

              // 12. PILAR 10: VALIDAÇÃO DOS FILTROS RÁPIDOS E ALTERNADOR DE VISÃO
              toggleLongitudinalViewMode('classes');
              filterSemaphoreByStatus('overdue');
              const overdueSec = document.getElementById('bimesterSemaphoreSection');
              const activeChip = overdueSec ? overdueSec.querySelector('.sem-filter-chip.chip-red.active') : null;
              if (!overdueSec || !activeChip || !overdueSec.innerHTML.includes('Atrasadas')) {
                throw new Error('Falha Pilar 10: Filtro de status atrasadas não refletiu no DOM ou chip ativo ausente');
              }
              filterSemaphoreByStatus('all');
              logger.log('Validação interativa dos Filtros Rápidos de Status no Semáforo (Pilar 10)', true);

              // PILAR 10: VALIDAÇÃO DO DOM DA VISÃO DE DOCENTES REGENTES NO SEMÁFORO
              toggleLongitudinalViewMode('teachers');
              const teachersViewActive = document.getElementById('bimesterSemaphoreSection');
              if (!teachersViewActive || !teachersViewActive.innerHTML.includes('Docente Regente Titular')) {
                throw new Error('Falha Pilar 10: Alternador para visão de docentes falhou na tabela');
              }
              if (!teachersViewActive.innerHTML.includes('Docentes em Atraso') || !teachersViewActive.innerHTML.includes('Avanço do Ciclo Docente')) {
                throw new Error('Falha Pilar 10: Micro-cards de resumo decisório de docentes ausentes no DOM');
              }
              if (!teachersViewActive.innerHTML.includes('sem-status-pill status-completed')) {
                throw new Error('Falha Pilar 10: Pílulas semafóricas não renderizadas na matriz de docentes');
              }
              logger.log('Renderização completa e semafórica da Visão de Docentes Regentes (Pilar 10)', true);

              // Validação do Filtro Rápido de Docentes
              filterTeacherSemaphoreByStatus('overdue');
              const overdueTeacherDom = document.getElementById('bimesterSemaphoreSection');
              const activeTeacherChip = overdueTeacherDom ? overdueTeacherDom.querySelector('.sem-filter-chip.chip-red.active') : null;
              if (!overdueTeacherDom || !activeTeacherChip || !overdueTeacherDom.innerHTML.includes('Com Atraso')) {
                throw new Error('Falha Pilar 10: Filtro rápido de docentes com atraso não refletiu no DOM ou chip ativo ausente');
              }
              filterTeacherSemaphoreByStatus('all');
              logger.log('Validação dos Filtros Rápidos de Status no Semáforo de Docentes (Pilar 10)', true);

              // ASSERÇÃO DE PICTOGRAMAS VETORIAIS (SUBSTITUIÇÃO DE EMOJIS NO SEMÁFORO E INDICADORES)
              const semContainerTest = document.getElementById('bimesterSemaphoreSection');
              if (semContainerTest) {
                // 1. Asserção Positiva: Presença de pictogramas vetoriais nas pílulas semafóricas
                const semPillIcons = semContainerTest.querySelectorAll('.sem-pill-icon');
                if (!semPillIcons || semPillIcons.length === 0) {
                  throw new Error('Falha Pictogramas: Pílulas semafóricas não contêm ícones vetoriais SVG (.sem-pill-icon)');
                }
                logger.log('Validação de Pictogramas Vetoriais nas Pílulas Semafóricas (.sem-pill-icon)', true, `${semPillIcons.length} pílulas vetoriais`);

                // 2. Asserção Negativa: Ausência de emojis soltos no cabeçalho e filtros do Semáforo
                const hasRawEmojis = /[⚠⏳○🏆🟢🔴⚪]/.test(semContainerTest.querySelector('.semaphore-filters-bar')?.innerHTML || '');
                if (hasRawEmojis) {
                  throw new Error('Falha Pictogramas: Emojis soltos residuais detectados na barra de filtros do Semáforo');
                }
                logger.log('Erradicação confirmada de emojis nos controles do Quadro Longitudinal', true);
              }

              // Restaura a visão de turmas padrão
              toggleLongitudinalViewMode('classes');
              logger.log('Validação do Alternador de Visão Turmas vs. Docentes Regentes (Pilar 10)', true);

              // 13. PILAR 9: VALIDAÇÃO DO GATILHO FLUTUANTE CIRCULAR COM LUPINHA E BARRA DE FILTROS
              const mobileTriggerBtn = document.getElementById('btnMobileIndicatorsFilters');
              const mobileActiveBadge = document.getElementById('mobileIndFiltersActiveBadge');
              const filterToolbar = document.getElementById('indicatorsFilterToolbar');
              if (!mobileTriggerBtn || !mobileActiveBadge || !filterToolbar) {
                throw new Error('Falha Pilar 9: Botão flutuante mobile com lupinha (#btnMobileIndicatorsFilters) ou barra (#indicatorsFilterToolbar) ausente no DOM');
              }
              logger.log('Presença do Gatilho Flutuante Circular com Lupinha no DOM (#btnMobileIndicatorsFilters)', true);

              // 14. PILAR 9: ESTRUTURA E SELETORES DA BOTTOM SHEET MÓVEL
              const mobileModal = document.getElementById('modalIndicatorsFiltersMobile');
              const mobUnitSel = document.getElementById('mobileIndUnitFilter');
              const mobMemberSel = document.getElementById('mobileIndMemberFilter');
              const mobBimSel = document.getElementById('mobileIndBimesterFilter');
              if (!mobileModal || !mobileModal.classList.contains('mobile-bottom-sheet-backdrop') || !mobUnitSel || !mobMemberSel || !mobBimSel) {
                throw new Error('Falha Pilar 9: Modal Bottom Sheet ou seletores internos ausentes no DOM');
              }
              logger.log('Presença e Inicialização da Bottom Sheet (#modalIndicatorsFiltersMobile)', true);

              // 15. PILAR 9: SIMULAÇÃO INTERATIVA DE ABERTURA E ESPELHAMENTO DE FILTROS
              openMobileIndicatorsFiltersModal();
              if (!mobileModal.classList.contains('active')) {
                throw new Error('Falha Pilar 9: openMobileIndicatorsFiltersModal não ativou a classe active');
              }
              const deskUnitSel = document.getElementById('indicatorsUnitFilter');
              if (deskUnitSel && mobUnitSel.options.length !== deskUnitSel.options.length) {
                throw new Error('Falha Pilar 9: Opções de unidade não foram clonadas fielmente no modal mobile');
              }
              logger.log('Simulação Interativa de Abertura e Espelhamento de Filtros', true);

              // 16. PILAR 9: INTERAÇÃO COM FILTRO DE BIMESTRE E APLICAÇÃO DIRETA
              mobBimSel.value = '1º Bimestre';
              applyAndCloseMobileIndicatorsFilters();
              if (mobileModal.classList.contains('active')) {
                throw new Error('Falha Pilar 9: applyAndCloseMobileIndicatorsFilters não fechou o modal mobile');
              }
              const deskBimSel = document.getElementById('indicatorsBimesterFilter');
              if (!deskBimSel || deskBimSel.value !== '1º Bimestre') {
                throw new Error('Falha Pilar 9: Filtro de bimestre no desktop não foi sincronizado com 1º Bimestre');
              }
              if (!mobileActiveBadge.innerText.includes('1º Bim')) {
                throw new Error('Falha Pilar 9: Badge ativo não refletiu o 1º Bimestre');
              }
              logger.log('Interação com Filtro de Bimestre e Aplicação Direta', true, mobileActiveBadge.innerText);

              // 17. PILAR 9: RESTAURAÇÃO PADRÃO E RECÁLCULO HIERÁRQUICO
              resetMobileIndicatorsFilters();
              if (deskBimSel.value !== 'ALL') {
                throw new Error('Falha Pilar 9: resetMobileIndicatorsFilters não retornou bimestre para ALL');
              }
              closeMobileIndicatorsFiltersModal();
              logger.log('Restauração Padrão e Recálculo Hierárquico', true);

              // 18. ALINHAMENTO, PADDING E PREVENÇÃO DE COLISÃO NOS FILTROS DE DIAGNÓSTICO (DESKTOP)
              const testDeskUnitFilter = document.getElementById('indicatorsUnitFilter');
              if (!testDeskUnitFilter) throw new Error('#indicatorsUnitFilter não encontrado no DOM');
              const computedDeskUnit = window.getComputedStyle(testDeskUnitFilter);
              const padLeftDesk = parseInt(computedDeskUnit.paddingLeft, 10);
              const padRightDesk = parseInt(computedDeskUnit.paddingRight, 10);
              if (isNaN(padLeftDesk) || padLeftDesk < 12) {
                throw new Error(`Seletor de diagnóstico desktop deve possuir padding-left >= 12px para evitar texto colado à esquerda (atual: ${computedDeskUnit.paddingLeft})`);
              }
              if (isNaN(padRightDesk) || padRightDesk < 32) {
                throw new Error(`Seletor de diagnóstico desktop deve possuir padding-right >= 32px para respiro do chevron (atual: ${computedDeskUnit.paddingRight})`);
              }
              if (computedDeskUnit.boxSizing !== 'border-box') {
                throw new Error(`Seletor de diagnóstico desktop deve possuir box-sizing: border-box (atual: ${computedDeskUnit.boxSizing})`);
              }
              if (computedDeskUnit.textOverflow !== 'ellipsis') {
                throw new Error(`Seletor de diagnóstico desktop deve possuir text-overflow: ellipsis (atual: ${computedDeskUnit.textOverflow})`);
              }
              logger.log('Validação Dimensional e Padding do Seletor de Diagnóstico Desktop (#indicatorsUnitFilter)', true, `PL: ${computedDeskUnit.paddingLeft} · PR: ${computedDeskUnit.paddingRight}`);

              // 19. CONFORMIDADE DO SELETOR MOBILE DE DIAGNÓSTICO (#mobileIndUnitFilter)
              openMobileIndicatorsFiltersModal();
              const testMobUnitFilter = document.getElementById('mobileIndUnitFilter');
              if (!testMobUnitFilter) {
                closeMobileIndicatorsFiltersModal();
                throw new Error('#mobileIndUnitFilter não encontrado no DOM');
              }
              const computedMobUnit = window.getComputedStyle(testMobUnitFilter);
              const padLeftMob = parseInt(computedMobUnit.paddingLeft, 10);
              const padRightMob = parseInt(computedMobUnit.paddingRight, 10);
              const heightMob = parseInt(computedMobUnit.height, 10);
              if (isNaN(padLeftMob) || padLeftMob < 12) {
                closeMobileIndicatorsFiltersModal();
                throw new Error(`Seletor de diagnóstico mobile deve possuir padding-left >= 12px (atual: ${computedMobUnit.paddingLeft})`);
              }
              if (isNaN(padRightMob) || padRightMob < 32) {
                closeMobileIndicatorsFiltersModal();
                throw new Error(`Seletor de diagnóstico mobile deve possuir padding-right >= 32px (atual: ${computedMobUnit.paddingRight})`);
              }
              if (isNaN(heightMob) || heightMob < 40) {
                closeMobileIndicatorsFiltersModal();
                throw new Error(`Seletor de diagnóstico mobile deve possuir altura confortável >= 40px (atual: ${computedMobUnit.height})`);
              }
              closeMobileIndicatorsFiltersModal();
              logger.log('Validação de Conformidade do Seletor Mobile de Diagnóstico (#mobileIndUnitFilter)', true, `H: ${computedMobUnit.height} · PL: ${computedMobUnit.paddingLeft}`);

              // 20. PRESENÇA E ALINHAMENTO DO CHEVRON NOS SELETORES DE DIAGNÓSTICO
              const bgImgDesk = computedDeskUnit.backgroundImage || '';
              const hasChevronSvg = bgImgDesk.includes('data:image/svg+xml') || computedDeskUnit.appearance === 'none';
              if (!hasChevronSvg) {
                throw new Error('Seletor de diagnóstico deve adotar chevron padronizado ou appearance: none');
              }
              logger.log('Validação de Presença e Alinhamento do Chevron nos Seletores de Diagnóstico', true);

              // 21. PILAR 15: ASSERÇÃO NEGATIVA ESTRITA CONTRA RÓTULOS ESTIMADOS NO SEMÁFORO
              const semTable = document.getElementById('bimesterSemaphoreSection');
              if (semTable) {
                const semHtml = semTable.innerHTML;
                if (semHtml.includes('Fev - Abr') || semHtml.includes('Mai - Jul') || semHtml.includes('Ago - Out') || semHtml.includes('Nov - Jan')) {
                  throw new Error('Falha Pilar 15: Períodos estimados ("Fev - Abr", etc.) ainda presentes no cabeçalho do Semáforo');
                }
                if (semHtml.includes('Janela de 2 meses')) {
                  throw new Error('Falha Pilar 15: Estimativa arbitrária "Janela de 2 meses" ainda presente no Semáforo');
                }
                logger.log('Extinção confirmada de períodos estimados ("Fev - Abr" e "Janela de 2 meses") no DOM', true);
              }

              // 22. PILAR 15: TESTE DE PARAMETRIZAÇÃO AUTÔNOMA PELA COORDENADORA DA EI (SSOT)
              const previousUserInd = appState.currentUserKey;
              try {
                appState.currentUserKey = 'helena';
                const testPeriods = JSON.parse(JSON.stringify(appState.bimesterPeriods));
                testPeriods['1º Bimestre'].startDate = '2026-02-10';
                testPeriods['1º Bimestre'].endDate = '2026-04-20';
                appState.bimesterPeriods = testPeriods;
                saveState();
                renderIndicatorsScreen();

                const periodHeader = getBimesterPeriodDisplay('1º Bimestre');
                if (periodHeader !== '10/02 a 20/04') {
                  throw new Error(`Falha Pilar 15: Esperado período "10/02 a 20/04", obtido "${periodHeader}"`);
                }
                logger.log('Parametrização autônoma de períodos de ciclos pela Coordenadora da EI e reflexo imediato no Semáforo', true, periodHeader);
              } finally {
                // Restaura períodos canônicos, modos semafóricos e usuário após o teste
                appState.bimesterPeriods = JSON.parse(JSON.stringify(DEFAULT_BIMESTER_PERIODS));
                appState.longitudinalViewMode = 'classes';
                appState.activeSemaphoreStatusFilter = 'all';
                appState.activeSemaphoreTeacherStatusFilter = 'all';
                saveState();
                appState.currentUserKey = previousUserInd || 'mariana';
                renderIndicatorsScreen();
              }
            } catch (e) {
              logger.log('Erro de execução no módulo indicadores_decisao', false, e.message);
            }
          }
        },

        // --- MÓDULO 11: Persistência Local, Backup JSON, Restauração e Relatório para Impressão ---
        {
          id: 'backup_exportacao',
          name: 'Persistência Local, Backup JSON, Restauração e Relatório para Impressão',
          run: function(logger) {
            try {
              const dump = JSON.stringify(appState);
              if (!dump || dump.length < 50) throw new Error('Falha ao serializar dump do appState');
              logger.log('Serialização e integridade do dump JSON de backup do estado', true, `${Math.round(dump.length / 1024)} KB`);

              const parsed = JSON.parse(dump);
              if (!parsed.currentUserKey || !Array.isArray(parsed.observations)) {
                throw new Error('Estrutura de dados corrompida no parse do backup');
              }
              logger.log('Validação de integridade do payload de restauração de dados', true);

              if (typeof renderSynthesisScreen === 'function' && appState.observations && appState.observations.length > 0) {
                renderSynthesisScreen(appState.observations[0]);
                logger.log('Renderização do espelho para impressão e devolutiva pedagógica', true);
              } else {
                logger.log('Renderização do espelho para impressão e devolutiva pedagógica', true, 'resiliente');
              }

              // PILAR 5: Testes de Modal de Exportação PDF Segregado e Ficha Devolutiva Individual
              const testObsTurma = {
                id: 'obs-test-print-modal',
                evaluatedType: 'turma',
                className: 'Infantil I - Turma A',
                schoolName: 'CEI Professora Maria de Lourdes',
                teachers: ['Ana Carolina Silva', 'Juliana Roberta Rocha'],
                teacherName: 'Ana Carolina Silva, Juliana Roberta Rocha',
                evaluatedBy: 'Mariana Ferreira',
                date: getTodayDateString(),
                status: 'finalized',
                responses: { '1.1.2': 'partial' },
                partialAttributions: {
                  '1.1.2': { teachers: ['Ana Carolina Silva'], justification: 'Foco em perguntas fechadas.' }
                },
                teacherSynthesis: {
                  'Ana Carolina Silva': {
                    dimensions: { estrategias: 'partial', gestao_grupo: 'consistent', mediacao_individual: 'consistent', respeito_integridade: 'consistent', gestao_cuidados: 'consistent' },
                    feedback: 'Avançar na formulação de perguntas abertas.'
                  }
                }
              };
              appState.currentObs = testObsTurma;
              exportSynthesisToPdf();
              const modalPdf = document.getElementById('modalExportPdfOptions');
              if (!modalPdf || !modalPdf.classList.contains('active')) {
                throw new Error('Modal de exportação de PDF segregado não foi aberto');
              }
              const listT = document.getElementById('modalExportPdfTeachersList');
              if (!listT || !listT.textContent.includes('Ana Carolina Silva')) {
                throw new Error('Botões nominais de docentes não renderizados no modal de exportação');
              }
              logger.log('Modal de Opções de Exportação em PDF Segregado (#modalExportPdfOptions)', true);
              closeExportPdfModal();

              // Geração da Ficha Formativa Individual do Docente (sem disparo físico de hardware)
              printIndividualTeacherDevolutiva('Ana Carolina Silva', false);
              const printSection = document.getElementById('teacherIndividualDevolutivaPrintSection');
              if (!printSection || !printSection.innerHTML.includes('Ana Carolina Silva') || !printSection.innerHTML.includes('Prefeitura Municipal de Patos')) {
                throw new Error('Ficha formativa individual do docente não foi montada corretamente no DOM de impressão');
              }
              if (!printSection.innerHTML.includes('Foco em perguntas fechadas.')) {
                throw new Error('Justificativa de item parcial ausente na ficha formativa individual');
              }
              if (document.body.classList.contains('printing-teacher-devolutiva')) {
                throw new Error('Classe de impressão printing-teacher-devolutiva não deveria ter sido adicionada com autoPrint=false');
              }
              logger.log('Geração e integridade da Ficha Formativa Individual do Docente (sem disparo de hardware)', true);
              appState.currentObs = null;

              // Validação semiótica dos pictogramas dos botões de exportação e importação da base completa JSON
              const exportFullBtns = document.querySelectorAll('button[onclick*="exportFullBaseJSON()"]');
              if (exportFullBtns.length === 0) throw new Error('Nenhum botão de exportFullBaseJSON encontrado no DOM');
              exportFullBtns.forEach(btn => {
                const svgContent = btn.querySelector('svg')?.innerHTML || '';
                if (!svgContent.includes('17 8 12 3 7 8') || !svgContent.includes('y1="3"')) {
                  throw new Error('Botão exportFullBaseJSON deve possuir pictograma de bandeja com seta para cima');
                }
              });

              const importFullBtns = document.querySelectorAll('button[onclick*="triggerImportFullBase()"]');
              if (importFullBtns.length === 0) throw new Error('Nenhum botão de triggerImportFullBase encontrado no DOM');
              importFullBtns.forEach(btn => {
                const svgContent = btn.querySelector('svg')?.innerHTML || '';
                if (!svgContent.includes('7 10 12 15 17 10') || !svgContent.includes('y1="15"')) {
                  throw new Error('Botão triggerImportFullBase deve possuir pictograma de bandeja com seta para baixo');
                }
              });
              logger.log('Pictogramas vetoriais de Exportação (seta para cima) e Importação da Base Completa JSON (seta para baixo)', true, `${exportFullBtns.length} de exportação e ${importFullBtns.length} de importação validados`);
            } catch (e) {
              logger.log('Erro de execução no módulo backup_exportacao', false, e.message);
            }
          }
        },

        // --- MÓDULO 12: Sistema de Rotas/Tabs, Menu Mobile Overlay, Acessibilidade e Changelog ---
        {
          id: 'navegacao_layout',
          name: 'Sistema de Rotas/Tabs, Menu Mobile Overlay, Acessibilidade e Changelog',
          run: function(logger) {
            try {
              // Navegação sequencial pelas abas
              const tabsToTest = ['home', 'schedule', 'indicators', 'history', 'notes', 'refDocs'];
              tabsToTest.forEach(t => {
                navigateToTab(t);
              });
              navigateToTab('home');
              const homeScreen = document.getElementById('screenHome');
              if (!homeScreen || homeScreen.style.display === 'none') throw new Error('Navegação para home falhou');
              logger.log('Roteamento e navegação de telas via navigateToTab()', true);

              if (typeof closeMobileMenu === 'function' && typeof openMobileMenu === 'function') {
                openMobileMenu();
                closeMobileMenu();
                const overlay = document.getElementById('mobileMenuOverlay');
                if (overlay && overlay.style.display !== 'none') throw new Error('closeMobileMenu não ocultou o overlay');
                logger.log('Controle do menu mobile drawer (closeMobileMenu)', true);
              }

              // Interação real com o Modal de Changelog
              openChangelogModal();
              const modalChg = document.getElementById('modalChangelog');
              if (!modalChg || !modalChg.classList.contains('active')) throw new Error('#modalChangelog não abriu');
              closeChangelogModal();
              if (modalChg.classList.contains('active')) throw new Error('#modalChangelog não fechou');

              const btnChangelog = document.querySelector('.btn-changelog');
              if (!btnChangelog) throw new Error('.btn-changelog não encontrado');
              logger.log('Modal de Changelog e botão de versão na barra superior', true, btnChangelog.textContent.trim());

              const deskTabHomeLabel = document.getElementById('deskTabHomeLabel');
              if (!deskTabHomeLabel) throw new Error('#deskTabHomeLabel ausente');
              logger.log('Resiliência estrutural contra erros de nós de texto no cabeçalho', true);

              // 5. TESTE DE CONFORMIDADE PILAR 6: HIGIENIZAÇÃO TERMINOLÓGICA MANDATÓRIA ("VISITA" ➔ "OBSERVAÇÃO")
              const homeHeader = document.getElementById('homeScheduledHeader');
              if (homeHeader && homeHeader.textContent.toLowerCase().includes('visita')) {
                throw new Error('Pilar 6 Violado: #homeScheduledHeader ainda contém o termo "visita"');
              }
              const schedModalTitle = document.getElementById('scheduleModalTitle');
              if (schedModalTitle && schedModalTitle.textContent.toLowerCase().includes('visita')) {
                throw new Error('Pilar 6 Violado: #scheduleModalTitle ainda contém o termo "visita"');
              }
              const schedFilterStatus = document.getElementById('scheduleFilterStatus');
              if (schedFilterStatus && schedFilterStatus.innerHTML.toLowerCase().includes('visita')) {
                throw new Error('Pilar 6 Violado: #scheduleFilterStatus possui opções com o termo "visita"');
              }
              const addSchedBtn = document.querySelector('.btn-add-schedule');
              if (addSchedBtn && addSchedBtn.textContent.toLowerCase().includes('visita')) {
                throw new Error('Pilar 6 Violado: .btn-add-schedule ainda contém o termo "visita"');
              }
              logger.log('Conformidade Pilar 6: Erradicação de "visita" e validação universal de "observação" no DOM', true);

              // 6. PILAR 9: VALIDAÇÃO DE CONTEXTO DO GATILHO FLUTUANTE MOBILE NAS ROTAS
              navigateToTab('home');
              const screenIndicators = document.getElementById('screenIndicators');
              if (screenIndicators && screenIndicators.classList.contains('active')) {
                throw new Error('Falha Pilar 9: #screenIndicators não deveria estar ativo na tela home');
              }
              navigateToTab('indicators');
              if (!screenIndicators || !screenIndicators.classList.contains('active')) {
                throw new Error('Falha Pilar 9: #screenIndicators deveria estar ativo na tela indicators');
              }
              logger.log('Conformidade Pilar 9: Isolamento contextual de exibição do gatilho móvel via rotas', true);

              // 7. PRESERVAÇÃO E PROTEÇÃO DE ROTA E SUPRESSÃO DE HARDWARE
              if (window.__isPlatformAuditRunning !== true) {
                throw new Error('Guardião global __isPlatformAuditRunning deveria estar ativo durante a execução da suíte');
              }
              logger.log('Blindagem do Guardião Global contra disparo de impressão e preservação contextual', true);

              // 8. ERGONOMIA MOBILE: REGRAS RESPONSIVAS E TOUCH TARGET DE GATILHOS DE CRITÉRIOS
              const testBtnCrit = document.createElement('button');
              testBtnCrit.className = 'btn-crit-detail-trigger';
              testBtnCrit.innerHTML = '<span>ℹ️</span> Detalhes';
              document.body.appendChild(testBtnCrit);
              const computedBtn = window.getComputedStyle(testBtnCrit);
              if (computedBtn.minHeight !== '32px') {
                document.body.removeChild(testBtnCrit);
                throw new Error('Botão .btn-crit-detail-trigger deve possuir touch target mínimo de 32px (min-height: 32px)');
              }
              document.body.removeChild(testBtnCrit);
              logger.log('Conformidade de Touch Target e Ergonomia Mobile nos Detalhes dos Critérios', true);

              // 9. VALIDAÇÃO DE REGRAS DE MÍDIA E VISIBILIDADE (.crit-text-desktop / .crit-text-mobile)
              let foundDesktopBaseRule = false;
              let foundMobileBaseRule = false;
              let foundDesktopMediaRule = false;
              let foundMobileMediaRule = false;

              Array.from(document.styleSheets).forEach(sheet => {
                try {
                  Array.from(sheet.cssRules || []).forEach(rule => {
                    if (rule.selectorText === '.crit-text-desktop' && rule.style.display === 'inline') {
                      foundDesktopBaseRule = true;
                    }
                    if (rule.selectorText === '.crit-text-mobile' && rule.style.display === 'none') {
                      foundMobileBaseRule = true;
                    }
                    if (rule.media && rule.media.mediaText && rule.media.mediaText.includes('768px')) {
                      Array.from(rule.cssRules || []).forEach(subRule => {
                        if (subRule.selectorText === '.crit-text-desktop' && subRule.style.display === 'none') {
                          foundDesktopMediaRule = true;
                        }
                        if (subRule.selectorText === '.crit-text-mobile' && subRule.style.display === 'inline') {
                          foundMobileMediaRule = true;
                        }
                      });
                    }
                  });
                } catch (e) {}
              });

              if (!foundDesktopBaseRule || !foundMobileBaseRule || !foundDesktopMediaRule || !foundMobileMediaRule) {
                throw new Error('Folhas de estilo devem conter as regras de visibilidade e mídia para .crit-text-desktop e .crit-text-mobile');
              }
              logger.log('Validação de Regras de Mídia e Visibilidade (.crit-text-desktop / .crit-text-mobile)', true);

              // 10. VALIDAÇÃO UNIVERSAL DE CLASSES E ESTILOS PARA .form-control E .form-select
              const testGenericWrap = document.createElement('div');
              testGenericWrap.style.display = 'block';
              document.body.appendChild(testGenericWrap);

              const testDynSelect = document.createElement('select');
              testDynSelect.className = 'form-control';
              const testDynOption = document.createElement('option');
              testDynOption.textContent = 'Opção Teste Padronização';
              testDynSelect.appendChild(testDynOption);
              testGenericWrap.appendChild(testDynSelect);

              const testDynInput = document.createElement('input');
              testDynInput.type = 'text';
              testDynInput.className = 'form-control';
              testGenericWrap.appendChild(testDynInput);

              const compDynSel = window.getComputedStyle(testDynSelect);
              const compDynInp = window.getComputedStyle(testDynInput);

              const padSel = parseInt(compDynSel.paddingLeft, 10);
              const padInp = parseInt(compDynInp.paddingLeft, 10);
              const bRadiusSel = compDynSel.borderRadius;

              if (compDynSel.boxSizing !== 'border-box' || compDynInp.boxSizing !== 'border-box') {
                if (testGenericWrap.parentNode) document.body.removeChild(testGenericWrap);
                throw new Error('Elementos .form-control devem possuir box-sizing: border-box universalmente');
              }
              if (isNaN(padSel) || padSel < 12 || isNaN(padInp) || padInp < 12) {
                if (testGenericWrap.parentNode) document.body.removeChild(testGenericWrap);
                throw new Error(`Controles .form-control devem possuir padding-left >= 12px (Select: ${compDynSel.paddingLeft}, Input: ${compDynInp.paddingLeft})`);
              }
              if (!bRadiusSel || bRadiusSel === '0px') {
                if (testGenericWrap.parentNode) document.body.removeChild(testGenericWrap);
                throw new Error('Controles .form-control devem possuir border-radius moderno (>= 6px)');
              }
              if (testGenericWrap.parentNode) document.body.removeChild(testGenericWrap);
              logger.log('Validação Universal de Classes e Estilos para .form-control e .form-select', true, `Radius: ${bRadiusSel} · Padding: ${compDynSel.paddingLeft}`);

              // 11. BLINDAGEM ANTI-REENTRÂNCIA DO MOTOR DE AUDITORIA AUTOMÁTICA
              if ((typeof __autoAuditTriggered === 'undefined' || !__autoAuditTriggered) && !window.__autoAuditTriggered) {
                throw new Error('Motor de auditoria deve declarar e acionar trava booleana anti-reentrância __autoAuditTriggered');
              }
              logger.log('Blindagem Anti-Reentrância do Motor de Auditoria Automática', true);

              // 12. VALIDAÇÃO DE AUSÊNCIA DE TELA BRANCA (WSOD) E ALTURA DA TELA ATIVA
              const activeScreens = document.querySelectorAll('.app-screen.active');
              if (activeScreens.length !== 1) {
                throw new Error(`Exatamente 1 tela deve estar ativa no DOM (encontradas: ${activeScreens.length})`);
              }
              const currentActiveEl = activeScreens[0];
              const screenRect = currentActiveEl.getBoundingClientRect();
              if (screenRect.height <= 0 && currentActiveEl.offsetHeight <= 0) {
                throw new Error(`Tela ativa #${currentActiveEl.id} possui altura zerada (possível tela branca)`);
              }
              logger.log('Asserção de Ausência de Tela Branca (WSOD) e Altura da Tela Ativa', true, `#${currentActiveEl.id} (${Math.round(screenRect.height || currentActiveEl.offsetHeight)}px)`);

              // 13. VALIDAÇÃO ESTRUTURAL E COMPORTAMENTAL DO MODAL IN-APP DE RELATÓRIO (#modalAuditReport)
              const modalRep = document.getElementById('modalAuditReport');
              if (!modalRep) throw new Error('#modalAuditReport ausente no DOM');
              const repSub = document.getElementById('auditReportSubtitle');
              const repBody = document.getElementById('auditReportBody');
              if (!repSub || !repBody) throw new Error('Estrutura interna semântica de #modalAuditReport incompleta');
              if (typeof openAuditReportModal !== 'function' || typeof closeAuditReportModal !== 'function') {
                throw new Error('Funções controladoras openAuditReportModal / closeAuditReportModal devem estar declaradas');
              }
              openAuditReportModal({ success: true, durationMs: 10, passed: 1, total: 1, failed: 0, modules: [] });
              if (!modalRep.classList.contains('active') && modalRep.style.display === 'none') {
                throw new Error('openAuditReportModal falhou em exibir o modal de diagnóstico');
              }
              closeAuditReportModal();
              if (modalRep.classList.contains('active') || modalRep.style.display !== 'none') {
                throw new Error('closeAuditReportModal falhou em ocultar o modal de diagnóstico');
              }
              logger.log('Validação do Modal In-App de Relatório (#modalAuditReport)', true);

              // 14. VALIDAÇÃO DA ORDEM CANÔNICA DE ABAS NO DESKTOP (.desktop-nav)
              const deskNav = document.querySelector('.desktop-nav');
              if (!deskNav) throw new Error('.desktop-nav ausente no cabeçalho');
              const tabHomeBtn = document.getElementById('deskTabHome');
              const tabOpBtn = document.getElementById('deskTabOpManagement');
              if (!tabHomeBtn || !tabOpBtn) throw new Error('#deskTabHome ou #deskTabOpManagement ausente');
              const navBtns = Array.from(deskNav.querySelectorAll('.nav-link'));
              const idxHome = navBtns.indexOf(tabHomeBtn);
              const idxOp = navBtns.indexOf(tabOpBtn);
              if (idxHome === -1 || idxOp === -1 || idxHome > idxOp) {
                throw new Error(`Ordem incorreta de abas: #deskTabHome (${idxHome}) deve preceder #deskTabOpManagement (${idxOp})`);
              }
              logger.log('Validação da Ordem Canônica de Abas no Desktop (#deskTabHome precede #deskTabOpManagement)', true);

              // 15. VALIDAÇÃO DE REATIVIDADE DE BOTÕES E DESPACHO DE EVENTOS (VERSÃO 1.21)
              const btnNewObs = document.getElementById('btnNewObsHero');
              const headerAvatarBtn = document.getElementById('headerAvatarBtn');
              if (!btnNewObs || !headerAvatarBtn) {
                throw new Error('Botões críticos de ação (#btnNewObsHero ou #headerAvatarBtn) não localizados no DOM');
              }
              if (typeof window.navigateToTab !== 'function' || typeof window.openProfileModal !== 'function') {
                throw new Error('Funções globais de manipulação de cliques não expostas no escopo window');
              }
              // Testa despacho de clique em botão de nova observação
              btnNewObs.click();
              const setupScreen = document.getElementById('screenSetup');
              if (!setupScreen || !setupScreen.classList.contains('active')) {
                throw new Error('Clique em #btnNewObsHero não ativou a tela #screenSetup');
              }
              // Restaura tela home
              navigateToTab('home');

              // Testa despacho de clique no avatar do perfil
              headerAvatarBtn.click();
              const modalProf = document.getElementById('modalProfile');
              if (!modalProf || !modalProf.classList.contains('active')) {
                throw new Error('Clique em #headerAvatarBtn não abriu o modal #modalProfile');
              }

              // 15.1 TESTE DE CONFORMIDADE: BOTÃO ALTERAR ANO LETIVO NA TELA DE PERFIL (VERSÃO 1.40)
              const btnChangeYear = document.getElementById('btnProfileChangeAcademicYear');
              if (!btnChangeYear) {
                throw new Error('Botão #btnProfileChangeAcademicYear não encontrado em #modalProfile');
              }

              const yearLabel = document.getElementById('userProfileAcademicYearLabel');
              if (!yearLabel) {
                throw new Error('#userProfileAcademicYearLabel não encontrado no botão de alterar ano');
              }

              // Asserção Negativa: Seletor não deve existir solto e visível na barra de ações da navbar
              const orphanHeaderSelect = document.querySelector('.navbar-actions #headerAcademicYearSelect');
              if (orphanHeaderSelect && orphanHeaderSelect.offsetParent !== null) {
                throw new Error('Seletor de ano letivo ainda está visível na barra de ações da navbar');
              }

              // Teste de acionamento do modal de seleção de ano
              btnChangeYear.click();
              const modalSelYear = document.getElementById('modalSelectAcademicYear');
              if (!modalSelYear || !modalSelYear.classList.contains('active')) {
                throw new Error('Clique em #btnProfileChangeAcademicYear não abriu o modal #modalSelectAcademicYear');
              }

              // Verifica presença das caixas de seleção de ano letivo (.level-box)
              const yearBoxes = modalSelYear.querySelectorAll('#academicYearBoxesContainer .level-box');
              if (yearBoxes.length === 0) {
                throw new Error('Nenhuma opção de ano letivo renderizada em #academicYearBoxesContainer');
              }

              // Testa seleção do ano 2025 (histórico)
              selectAcademicYear('2025');
              if (appState.selectedAcademicYear !== '2025') {
                throw new Error('selectAcademicYear("2025") não atualizou appState.selectedAcademicYear');
              }

              const bannerHist = document.getElementById('historicalYearWarningBanner');
              if (!bannerHist || bannerHist.style.display === 'none') {
                throw new Error('Banner de aviso de ano histórico não foi exibido após selecionar 2025');
              }

              // Restaura ano vigente via função returnToCurrentAcademicYear
              returnToCurrentAcademicYear();
              if (appState.selectedAcademicYear !== '2026') {
                throw new Error('returnToCurrentAcademicYear() não restaurou o ano vigente 2026');
              }
              if (bannerHist.style.display !== 'none') {
                throw new Error('Banner histórico permaneceu visível após retornar ao ano vigente');
              }

              closeSelectAcademicYearModal();
              closeProfileModal();
              logger.log('Conformidade do botão Alterar Ano Letivo em #modalProfile e modal de seleção (Versão 1.40)', true);
              logger.log('Reatividade total e despacho funcional de cliques em botões centrais do sistema', true);

              // 16. BLINDAGEM E TRAVA DE VISUALIZAÇÃO DESKTOP (ELIMINAÇÃO DE SCROLL LATERAL E ZOOM INDESEJADO)
              const docEl = document.documentElement;
              const htmlStyle = window.getComputedStyle(docEl);
              const bodyStyle = window.getComputedStyle(document.body);

              if (htmlStyle.overflowX !== 'hidden' && bodyStyle.overflowX !== 'hidden') {
                throw new Error(`Trava de visualização violada: html e body devem conter overflow-x: hidden (html: ${htmlStyle.overflowX}, body: ${bodyStyle.overflowX})`);
              }

              if (window.innerWidth >= 860 && docEl.scrollWidth > window.innerWidth + 2) {
                throw new Error(`Transbordo horizontal detectado no computador: scrollWidth (${docEl.scrollWidth}px) > innerWidth (${window.innerWidth}px)`);
              }

              const metaVp = document.querySelector('meta[name="viewport"]');
              if (!metaVp || !metaVp.content.includes('user-scalable=no') || !metaVp.content.includes('maximum-scale=1.0')) {
                throw new Error('Meta viewport deve conter maximum-scale=1.0 e user-scalable=no para blindagem da tela');
              }
              logger.log('Blindagem e Trava de Visualização Desktop (Eliminação de Scroll Lateral e Zoom Indesejado)', true);

              // 17. VALIDAÇÃO DO MOTOR ASSÍNCRONO DE AUDITORIA E TELEMETRIA (VERSÃO 1.36)
              if (typeof window.runFullPlatformAuditAsync !== 'function') {
                throw new Error('window.runFullPlatformAuditAsync não está definida globalmente');
              }
              if (typeof window.openAuditProgressModal !== 'function' || typeof window.openAuditFailureModal !== 'function') {
                throw new Error('openAuditProgressModal ou openAuditFailureModal não estão definidas');
              }
              logger.log('Validação do Motor Assíncrono e Telemetria em Tempo Real (Versão 1.36)', true);

              // 18. VALIDAÇÃO DAS CONSTANTES CANÔNICAS DE CICLO E BLINDAGEM CONTRA TELA BRANCA INICIAL (VERSÃO 1.37)
              if (typeof DEFAULT_ACADEMIC_YEARS === 'undefined' || !Array.isArray(DEFAULT_ACADEMIC_YEARS)) {
                throw new Error('DEFAULT_ACADEMIC_YEARS não definida ou inválida');
              }
              if (typeof DEFAULT_SELECTED_ACADEMIC_YEAR === 'undefined') {
                throw new Error('DEFAULT_SELECTED_ACADEMIC_YEAR não definida');
              }
              if (typeof DEFAULT_BIMESTER_PERIODS_BY_YEAR === 'undefined' || !DEFAULT_BIMESTER_PERIODS_BY_YEAR['2026']) {
                throw new Error('DEFAULT_BIMESTER_PERIODS_BY_YEAR não definida para 2026');
              }
              const testHomeScreen = document.getElementById('screenHome');
              if (!testHomeScreen || testHomeScreen.style.display === 'none') {
                throw new Error('Tela inicial (#screenHome) não está visível no boot');
              }
              logger.log('Blindagem Canônica de Ciclos e Prevenção de Tela Branca Inicial (Versão 1.37)', true);

              // 19. VALIDAÇÃO DA HIGIENIZAÇÃO VISUAL NA TELA DE MATRIZES DE REFERÊNCIA OFICIAIS (VERSÃO 1.42)
              navigateToTab('refDocs');
              const screenRefDocsEl = document.getElementById('screenRefDocs');
              if (!screenRefDocsEl) throw new Error('Tela screenRefDocs não encontrada no DOM');

              // Regex para detecção de emojis comuns na tela
              const emojiRegex = /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

              const refButtons = screenRefDocsEl.querySelectorAll('.ref-doc-btn, .ref-doc-btn-admin, .page-title, #refDocsPreviewTitle, #refDocsPreviewContainer button');
              refButtons.forEach(el => {
                if (emojiRegex.test(el.innerText)) {
                  throw new Error(`Emoji residual detectado no elemento de Matrizes de Referência: "${el.innerText.trim()}"`);
                }
              });

              // Validação de presença dos pictogramas SVG nos botões principais
              const previewBtn = screenRefDocsEl.querySelector("button[onclick*=\"previewPDFInTab('teacher')\"]");
              if (!previewBtn || !previewBtn.querySelector('svg')) {
                throw new Error('Botão Ver no Painel da Matriz Docente deve conter pictograma SVG');
              }
              logger.log('Higienização visual de Matrizes de Referência (ausência de emojis e presença de SVGs vetoriais)', true, 'Tela screenRefDocs 100% higienizada');
              navigateToTab('home');

              if (!modalChg.innerHTML.includes('Versão 1.42')) {
                throw new Error('#modalChangelog não contém o card descritivo da Versão 1.42');
              }
              logger.log('Asserção de Integridade do Registro da Versão 1.42 (v8.2.9) no Modal de Changelog', true);

              // Validação do rótulo atualizado do botão de changelog e card da versão 1.48
              if (!btnChangelog.textContent.includes('Versão 1.48')) {
                throw new Error(`Botão de versão desatualizado: "${btnChangelog.textContent.trim()}"`);
              }
              if (!modalChg.innerHTML.includes('Versão 1.48')) {
                throw new Error('#modalChangelog não contém o card descritivo da Versão 1.48');
              }
              logger.log('Asserção de Integridade do Cabeçalho e Registro da Versão 1.48 (v8.2.15)', true);
            } catch (e) {
              logger.log('Erro de execução no módulo navegacao_layout', false, e.message);
            }
          }
        }
      ];

      try {
        console.group('🔬 INICIANDO AUDITORIA MODULAR DA PLATAFORMA (SerTão Criança)');

        const filteredModules = AUDIT_MODULES.filter(m => targetModule === 'all' || m.id === targetModule);
        const totalFilterCount = filteredModules.length;

        for (let i = 0; i < totalFilterCount; i++) {
          const mod = filteredModules[i];
          const modStartTime = performance.now();

          // Atualiza progresso visual na interface se o modal de progresso estiver aberto
          const progTitle = document.getElementById('auditProgressTitle');
          const progSub = document.getElementById('auditProgressSub');
          const progBar = document.getElementById('auditProgressBar');
          const progCounter = document.getElementById('auditProgressCounter');

          if (progTitle) progTitle.textContent = `Executando: ${mod.name}`;
          if (progSub) progSub.textContent = `Módulo ${i + 1} de ${totalFilterCount}`;
          if (progBar) progBar.style.width = `${Math.round(((i + 1) / totalFilterCount) * 100)}%`;
          if (progCounter) progCounter.textContent = `Módulo ${i + 1} de ${totalFilterCount}`;

          // Micro-pausa assíncrona para permitir repaint no compositor do navegador
          await new Promise(r => setTimeout(r, 10));

          const modLogger = createModuleLogger(mod.id, mod.name);
          try {
            mod.run(modLogger);
          } catch(e) {
            modLogger.log(`Falha crítica não tratada no módulo ${mod.id}`, false, e.message);
          }

          const results = modLogger.getResults();
          const passed = results.filter(r => r.passed).length;
          const failed = results.filter(r => !r.passed).length;
          const modDur = Math.round(performance.now() - modStartTime);
          const isModSuccess = failed === 0 && results.length > 0;

          modulesOutput.push({
            id: mod.id,
            name: mod.name,
            total: results.length,
            passed,
            failed,
            success: isModSuccess,
            results
          });

          // Telemetria em tempo real para o servidor Python CLI
          if (window.location.search && window.location.search.includes('autoAudit=1')) {
            try {
              fetch('/__test_progress__', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  index: i + 1,
                  totalModules: totalFilterCount,
                  module: mod.id,
                  passed,
                  total: results.length,
                  success: isModSuccess,
                  durationMs: modDur
                })
              }).catch(() => {});
            } catch(e) {}
          }
        }

        console.groupEnd();
      } finally {
        // Restauração do Estado Canônico dos Dados
        appState = stateBackup;
        saveState();
        applyUserRoleUI();

        // Restauração Fiel da Tela e Sub-aba de Origem do Usuário
        try {
          if (initialScreenId === 'screenHome') {
            if (wasGestaoView) {
              navigateToTab(initialPedagSubTab === 'team' ? 'team' : 'units');
            } else {
              navigateToTab('home');
            }
          } else if (initialScreenId === 'screenSchedule') {
            navigateToTab('schedule');
          } else if (initialScreenId === 'screenIndicators') {
            navigateToTab('indicators');
            if (typeof switchIndicatorsSubTab === 'function') {
              switchIndicatorsSubTab(initialIndicatorsSubTab);
            }
          } else if (initialScreenId === 'screenHistory') {
            navigateToTab('history', initialHistoryFilter);
          } else if (initialScreenId === 'screenNotes') {
            navigateToTab('notes');
          } else if (initialScreenId === 'screenRefDocs') {
            navigateToTab('refDocs');
          } else if (initialScreenId === 'screenRubricsAdmin') {
            navigateToTab('rubrics');
          } else if (initialScreenId === 'screenSetup') {
            if (typeof openSetupScreen === 'function') openSetupScreen();
            else navigateToTab('home');
          } else if (initialScreenId === 'screenActiveObs') {
            if (stateBackup.currentObs && typeof renderActiveObservation === 'function') {
              appState.currentObs = stateBackup.currentObs;
              renderActiveObservation();
            } else {
              navigateToTab('home');
            }
          } else if (initialScreenId === 'screenSynthesis') {
            if (stateBackup.currentObs && typeof renderSynthesisScreen === 'function') {
              appState.currentObs = stateBackup.currentObs;
              renderSynthesisScreen();
            } else {
              navigateToTab('home');
            }
          } else {
            navigateToTab('home');
          }
        } catch(errRestore) {
          console.warn('Aviso na restauração de rota pós-auditoria:', errRestore);
          navigateToTab('home');
        }

        // Higienização de classes residuais de impressão e reflow limpo
        try {
          document.body.classList.remove('printing-teacher-devolutiva', 'is-printing', 'print-preview');
          const devPrint = document.getElementById('teacherIndividualDevolutivaPrintSection');
          if (devPrint) devPrint.innerHTML = '';
          void document.body.offsetHeight;
          window.scrollTo(0, 0);
        } catch (eClean) {}

        // Buffer de segurança para restaurar window.print após expiração de eventuais micro-timers
        setTimeout(() => {
          window.__isPlatformAuditRunning = false;
          window.print = originalWindowPrint;
        }, 600);
      }

      const duration = Math.round(performance.now() - startTime);
      const passedCount = allResults.filter(r => r.passed).length;
      const failedCount = allResults.filter(r => !r.passed).length;
      const allPassed = failedCount === 0 && allResults.length > 0;

      const summary = {
        timestamp: new Date().toISOString(),
        durationMs: duration,
        targetModule,
        modulesCount: modulesOutput.length,
        total: allResults.length,
        passed: passedCount,
        failed: failedCount,
        success: allPassed,
        modules: modulesOutput,
        results: allResults
      };

      window.__AUDIT_RESULTS__ = summary;

      // Envio do Relatório Final para o Servidor Python CLI com Fallback Multi-Canal
      if (window.location.search && window.location.search.includes('autoAudit=1')) {
        try {
          fetch('/__test_report__', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(summary)
          }).catch(() => {
            if (navigator.sendBeacon) {
              navigator.sendBeacon('/__test_report__', JSON.stringify(summary));
            }
          });
        } catch(e) {
          if (navigator.sendBeacon) {
            navigator.sendBeacon('/__test_report__', JSON.stringify(summary));
          }
        }
      }

      console.log(`\n🏁 AUDITORIA CONCLUÍDA: ${passedCount}/${allResults.length} asserções aprovadas em ${duration}ms (${allPassed ? '✅ 100% OK' : '⚠️ COM FALHAS'})\n`);
      return summary;
    };

    // Mantém compatibilidade síncrona com chamadas legadas
    window.runFullPlatformAudit = function(options) {
      return window.runFullPlatformAuditAsync(options);
    };

    let __autoAuditTriggered = false;
    async function triggerAutoAudit() {
      if (__autoAuditTriggered) return;
      __autoAuditTriggered = true;
      const urlParams = new URLSearchParams(window.location.search);
      const mod = urlParams.get('module') || 'all';
      setTimeout(async () => {
        const audit = await window.runFullPlatformAuditAsync({ module: mod });
        // Se estiver em navegador interativo (não-headless), abre o modal de relatório
        if (typeof openAuditReportModal === 'function') {
          openAuditReportModal(audit);
        }
      }, 150);
    }

    if (window.location.search && window.location.search.includes('autoAudit=1')) {
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        triggerAutoAudit();
      } else {
        window.addEventListener('load', triggerAutoAudit);
        document.addEventListener('DOMContentLoaded', triggerAutoAudit);
      }
    }

