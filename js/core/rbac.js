    // --- 4. HIERARCHY, USER ROLES & SCOPES ---
    // Utilitário Canônico de Resolução de Chaves de Autenticação (USERS_DB)
    function findUserDbKey(identifier) {
      if (!identifier) return null;
      const idStr = String(identifier).trim().toLowerCase();
      return Object.keys(USERS_DB).find(k => 
        k.toLowerCase() === idStr ||
        (USERS_DB[k].id && String(USERS_DB[k].id).toLowerCase() === idStr) ||
        (USERS_DB[k].name && USERS_DB[k].name.toLowerCase() === idStr) ||
        (USERS_DB[k].email && USERS_DB[k].email.toLowerCase() === idStr)
      ) || null;
    }

    // Resolução Dinâmica SSOT em Tempo Real do Usuário Autenticado
    function getCurrentUser() {
      if (!appState.currentUserKey) return {};
      const authRecord = USERS_DB[appState.currentUserKey] || (appState.customUsers && appState.customUsers[appState.currentUserKey]);
      if (!authRecord) return {};

      // Sincronização Dinâmica em Tempo Real contra a SSOT de Equipe (appState.teamMembers)
      const member = (appState.teamMembers || []).find(m => 
        m.id === appState.currentUserKey ||
        (authRecord.id && m.id === authRecord.id) ||
        (m.name && authRecord.name && m.name.toLowerCase() === authRecord.name.toLowerCase()) ||
        (m.email && authRecord.email && m.email.toLowerCase() === authRecord.email.toLowerCase())
      );

      if (member) {
        authRecord.name = member.name;
        authRecord.roleKey = member.roleKey;
        authRecord.roleTitle = member.roleTitle;
        authRecord.school = member.school;
        authRecord.supervisor = member.supervisor;
        if (member.classAssigned) authRecord.classAssigned = member.classAssigned;
        if (member.email) authRecord.email = member.email;
      }

      return authRecord;
    }

    // --- RESOLUÇÃO DINÂMICA DE AVALIANDOS ATIVOS DO ESCOPO ---
    function getScopedAvaliandos(targetType = null) {
      const user = getCurrentUser();
      let type = targetType || (document.getElementById('indicatorsTargetTypeFilter')?.value || 'professora');
      if (user.roleKey === 'coordenador' || user.roleKey === 'professora') {
        type = 'professora'; // Coordenadores e docentes nunca avaliam ou acessam escopo de coordenação
      }
      if (!appState.teamMembers) return [];

      if (isNucleoEI(user)) {
        return appState.teamMembers.filter(m => m.roleKey === type);
      } else if (user.roleKey === 'formador') {
        const pedagTabClassesEl = document.getElementById('pedagTabClasses');
        if (pedagTabClassesEl) pedagTabClassesEl.style.display = 'inline-flex';
        // Unidades vinculadas ao Polo Regional da Formadora ou às Coordenadoras sob sua supervisão
        const userPolo = (user.school || '').trim().toLowerCase();
        const poloUnits = (appState.units || []).filter(u => {
          if (!u.polo) return false;
          const up = u.polo.trim().toLowerCase();
          return up === userPolo || up.includes(userPolo) || userPolo.includes(up);
        }).map(u => u.name);
        const supervisedCoords = (appState.teamMembers || []).filter(m => 
          m.roleKey === 'coordenador' && (m.supervisor === user.name || (m.school && poloUnits.includes(m.school)))
        );
        const formadorUnits = Array.from(new Set([...poloUnits, ...supervisedCoords.map(c => c.school)])).filter(Boolean);
        const effectiveUnits = formadorUnits.length > 0 ? formadorUnits : (appState.units || []).map(u => u.name);

        if (type === 'coordenador') {
          // Coordenadoras das unidades do polo ou supervisionadas pela Formadora
          return appState.teamMembers.filter(m => 
            m.roleKey === 'coordenador' && 
            (effectiveUnits.includes(m.school) || m.supervisor === user.name) &&
            m.name !== user.name
          );
        } else {
          // Professoras das unidades do polo da Formadora
          return appState.teamMembers.filter(m => 
            m.roleKey === 'professora' && 
            effectiveUnits.includes(m.school) &&
            m.name !== user.name
          );
        }
      } else if (user.roleKey === 'coordenador') {
        if (type === 'coordenador') {
          return []; // Coordenadora pedagógica não avalia outras coordenadoras
        }
        // ISOLAMENTO ESTRITO: Apenas professoras da unidade escolar ATUAL da Coordenadora
        return appState.teamMembers.filter(m => 
          m.roleKey === 'professora' && 
          m.school === user.school &&
          m.name !== user.name
        );
      } else if (user.roleKey === 'professora') {
        return appState.teamMembers.filter(m => m.name === user.name);
      }
      return [];
    }

    // STRICT DRAFT VISIBILITY E VÍNCULO DETERMINÍSTICO DE AVALIANDOS ATIVOS (COM ESCOPO DE ANO LETIVO):
    function getScopedObservations(targetYear = null) {
      const user = getCurrentUser();
      if (!appState.observations) return [];
      const activeYear = targetYear || (appState && appState.selectedAcademicYear) || '2026';

      return appState.observations.filter(obs => {
        // Filtro estrito de Ano Letivo
        if ((obs.academicYear || '2026') !== activeYear) return false;

        // Se a observação for da TURMA (Pilar 1), valida se a escola e turma pertencem ao escopo
        if (obs.evaluatedType === 'turma') {
          if (obs.status === 'draft') {
            return obs.evaluatedBy === user.name;
          }
          if (isNucleoEI(user)) {
            return true;
          } else if (user.roleKey === 'formador') {
            const userPolo = (user.school || '').trim().toLowerCase();
            const poloUnits = (appState.units || []).filter(u => u.polo && u.polo.trim().toLowerCase() === userPolo).map(u => u.name);
            return poloUnits.includes(obs.schoolName);
          } else if (user.roleKey === 'coordenador') {
            return obs.schoolName === user.school;
          } else if (user.roleKey === 'professora') {
            return (obs.status === 'finalized' || obs.status === 'concluida') &&
                   obs.schoolName === user.school &&
                   ((obs.teachers && obs.teachers.includes(user.name)) || obs.className === user.classAssigned);
          }
          return false;
        }

        // Para observações nominais legadas ou de coordenação pedagógica:
        const targetMemberExists = (appState.teamMembers || []).some(m => m.name === obs.teacherName);
        if (!targetMemberExists) return false;

        if (obs.status === 'draft') {
          return obs.evaluatedBy === user.name;
        }

        if (isNucleoEI(user)) {
          return true;
        } else if (user.roleKey === 'formador') {
          const userPolo = (user.school || '').trim().toLowerCase();
          const poloUnits = (appState.units || []).filter(u => {
            if (!u.polo) return false;
            const up = u.polo.trim().toLowerCase();
            return up === userPolo || up.includes(userPolo) || userPolo.includes(up);
          }).map(u => u.name);
          const supervisedCoords = (appState.teamMembers || []).filter(m => 
            m.roleKey === 'coordenador' && (m.supervisor === user.name || (m.school && poloUnits.includes(m.school)))
          );
          const formadorUnits = Array.from(new Set([...poloUnits, ...supervisedCoords.map(c => c.school)])).filter(Boolean);
          const effectiveUnits = formadorUnits.length > 0 ? formadorUnits : (appState.units || []).map(u => u.name);

          const validTeachers = getScopedAvaliandos('professora').map(m => m.name);
          const validCoords = getScopedAvaliandos('coordenador').map(m => m.name);
          
          if (obs.evaluatedType === 'coordenador') {
            return validCoords.includes(obs.teacherName) && effectiveUnits.includes(obs.schoolName);
          } else {
            return validTeachers.includes(obs.teacherName) && effectiveUnits.includes(obs.schoolName);
          }
        } else if (user.roleKey === 'coordenador') {
          const validTeachers = getScopedAvaliandos('professora').map(m => m.name);
          return validTeachers.includes(obs.teacherName) && obs.schoolName === user.school;
        }
        return false;
      });
    }

    // Formative Notes Scope: Only from direct subordinate level
    function getScopedNotes() {
      const user = getCurrentUser();
      if (isNucleoEI(user)) {
        return appState.notes;
      } else if (user.roleKey === 'formador') {
        const userPolo = (user.school || '').trim().toLowerCase();
        const poloUnits = (appState.units || []).filter(u => {
          if (!u.polo) return false;
          const up = u.polo.trim().toLowerCase();
          return up === userPolo || up.includes(userPolo) || userPolo.includes(up);
        }).map(u => u.name);
        const supervisedCoords = (appState.teamMembers || []).filter(m => 
          m.roleKey === 'coordenador' && (m.supervisor === user.name || (m.school && poloUnits.includes(m.school)))
        );
        const formadorUnits = Array.from(new Set([...poloUnits, ...supervisedCoords.map(c => c.school)])).filter(Boolean);
        const effectiveUnits = formadorUnits.length > 0 ? formadorUnits : (appState.units || []).map(u => u.name);
        return appState.notes.filter(n => effectiveUnits.includes(n.schoolName));
      } else {
        // Coordinator manages notes for teachers in their school
        return appState.notes.filter(n => n.schoolName === user.school);
      }
    }

    function getScopedSchedules() {
      const user = getCurrentUser();
      if (isNucleoEI(user)) {
        return appState.schedules;
      } else if (user.roleKey === 'formador') {
        // Extrai todas as escolas que pertencem ao polo da formadora
        const supervisedSchools = appState.units
          .filter(u => u.polo === user.school)
          .map(u => u.name);
        supervisedSchools.push(user.school);

        return appState.schedules.filter(s => {
          if (!supervisedSchools.includes(s.schoolName)) return false;
          // O Formador acompanha e agenda EXCLUSIVAMENTE Coordenadoras Pedagógicas (nunca Professoras)
          const target = (appState.teamMembers || []).find(m => 
            m.name === s.targetName || 
            resolveCanonicalUserName(m.name) === resolveCanonicalUserName(s.targetName)
          );
          return target ? target.roleKey === 'coordenador' : (s.className && s.className.toLowerCase().includes('coord'));
        });
      } else if (user.roleKey === 'coordenador') {
        // A Coordenadora acompanha e agenda EXCLUSIVAMENTE Professoras da sua unidade
        return appState.schedules.filter(s => {
          if (s.schoolName !== user.school) return false;
          const target = (appState.teamMembers || []).find(m => 
            m.name === s.targetName || 
            resolveCanonicalUserName(m.name) === resolveCanonicalUserName(s.targetName)
          );
          return target ? target.roleKey === 'professora' : (!s.className || !s.className.toLowerCase().includes('coord'));
        });
      } else {
        return [];
      }
    }

    function openRoleModal() {
      document.getElementById('modalRole').classList.add('active');
      document.querySelectorAll('#modalRole .level-box').forEach(b => b.classList.remove('selected'));
      const u = getCurrentUser();
      if (u.roleKey === 'coordenador') document.getElementById('roleBoxCoord').classList.add('selected');
      if (u.roleKey === 'formador') document.getElementById('roleBoxFormador').classList.add('selected');
      if (isNucleoEI(u)) document.getElementById('roleBoxTecnico').classList.add('selected');
    }
    function closeRoleModal() {
      document.getElementById('modalRole').classList.remove('active');
    }

    function selectUserAccount(userKey) {
      appState.currentUserKey = userKey;
      closeRoleModal();
      const indUnit = document.getElementById('indicatorsUnitFilter');
      if (indUnit) indUnit.value = 'ALL';
      const indMember = document.getElementById('indicatorsMemberFilter');
      if (indMember) indMember.value = 'ALL';
      
      // Limpeza de caches de seletores de tela
      const schoolFilterSelect = document.getElementById('classesFilterSchool');
      if (schoolFilterSelect) delete schoolFilterSelect.dataset.populatedFor;
      
      applyUserRoleUI();
      saveState();
      
      // Re-renderização reativa das telas ativas
      if (document.getElementById('screenIndicators')?.classList.contains('active')) {
        renderIndicatorsScreen();
      }
      if (document.getElementById('screenClasses')?.classList.contains('active')) {
        renderClassesScreen();
      }
      if (document.getElementById('screenSchedule')?.classList.contains('active')) {
        renderScheduleScreen();
      }
      
      navigateToTab('home');
      showToast(`Sessão ativa: ${getCurrentUser().name} (${getCurrentUser().roleTitle})`);
    }

    function openProfileModal() {
      const u = getCurrentUser();
      document.getElementById('userProfileName').innerText = u.name;
      document.getElementById('userProfileRoleDesc').innerText = `Cargo: ${u.roleTitle}`;
      
      const emailEl = document.getElementById('userProfileEmail');
      if (emailEl) {
        emailEl.innerText = u.email ? `E-mail: ${u.email}` : 'Sem e-mail vinculado';
      }
      
      document.getElementById('userProfileSchool').innerText = u.school;
      document.getElementById('userProfileAvatar').innerText = u.avatarText;

      document.getElementById('modalProfile').classList.add('active');
    }
    function closeProfileModal() {
      document.getElementById('modalProfile').classList.remove('active');
    }

    function executeLogout() {
      closeProfileModal();
      appState.currentUserKey = null;
      saveState();

      // Reset visual imediato da interface de fundo
      const headerRoleText = document.getElementById('headerRoleText');
      if (headerRoleText) headerRoleText.innerText = 'Desconectado';
      const headerAvatarBtn = document.getElementById('headerAvatarBtn');
      if (headerAvatarBtn) headerAvatarBtn.innerText = '--';
      const homeGreeting = document.getElementById('homeGreeting');
      if (homeGreeting) homeGreeting.innerText = 'Bem-vindo(a)';
      const homeSubGreeting = document.getElementById('homeSubGreeting');
      if (homeSubGreeting) homeSubGreeting.innerText = 'Faça login para continuar';
      const scopeTitle = document.getElementById('roleScopeTitle');
      if (scopeTitle) scopeTitle.innerText = 'Identificação necessária:';
      const scopeDesc = document.getElementById('roleScopeDesc');
      if (scopeDesc) scopeDesc.innerText = 'Por favor, autentique-se para visualizar suas informações.';

      const deskTabHomeLabel = document.getElementById('deskTabHomeLabel');
      if (deskTabHomeLabel) deskTabHomeLabel.innerText = 'Início';
      const heroBtn = document.getElementById('btnNewObsHero');
      if (heroBtn) heroBtn.style.display = 'none';
      const scheduleNavTab = document.getElementById('deskTabSchedule');
      if (scheduleNavTab) scheduleNavTab.style.display = 'none';
      const homeScheduleBanner = document.getElementById('homeScheduleBanner');
      if (homeScheduleBanner) homeScheduleBanner.style.display = 'none';
      const homeDraftsContainer = document.getElementById('homeDraftsContainer');
      if (homeDraftsContainer) homeDraftsContainer.innerHTML = '';

      document.getElementById('modalLoginScreen').classList.add('active');
    }

    function showRegisterForm() {
      document.getElementById('modalLoginScreen').classList.remove('active');
      document.getElementById('modalRegisterScreen').classList.add('active');
    }

    function hideRegisterForm() {
      document.getElementById('modalRegisterScreen').classList.remove('active');
      document.getElementById('modalLoginScreen').classList.add('active');
    }

    function handleRegisterSubmit(event) {
      event.preventDefault();
      const name = document.getElementById('regName').value.trim();
      const email = document.getElementById('regEmail').value.trim().toLowerCase();
      const password = document.getElementById('regPassword').value;
      const roleKey = 'pendente';
      
      // Verifica se algum usuário no USERS_DB já possui o e-mail informado
      const emailExists = Object.values(USERS_DB).some(user => user.email && user.email.toLowerCase() === email);

      if (emailExists) {
        alert("Você já possui uma conta com este e-mail.\n\nCaso a tenha esquecido, feche esta tela e aperte em 'Esqueceu a senha?'.");
        return;
      }

      const newKey = 'user_' + Date.now();
      
      let roleTitle = 'Acesso Pendente';
      let avatarText = name.substring(0, 2).toUpperCase();

      const newUser = {
        id: newKey,
        email: email,
        password: password,
        name: name,
        roleKey: roleKey,
        roleTitle: roleTitle,
        avatarText: avatarText,
        school: 'Aguardando Definição',
        supervisor: 'Aguardando Definição'
      };

      if (!appState.customUsers) appState.customUsers = {};
      
      // Adiciona na Base de Autenticação e no Estado de Usuários Salvos
      appState.customUsers[newKey] = newUser;
      USERS_DB[newKey] = newUser;
      
      // Adiciona na Lista de Profissionais/Membros Visíveis no App
      if(!appState.teamMembers) appState.teamMembers = [];
      appState.teamMembers.push({
        id: newKey,
        name: name,
        roleKey: roleKey,
        roleTitle: roleTitle,
        school: 'Aguardando Definição',
        supervisor: 'Aguardando Definição',
        email: email,
        avatarText: avatarText
      });
      
      saveState();
      
      alert('Conta criada com sucesso! Faça login.');
      hideRegisterForm();
      document.getElementById('registerForm').reset();
    }

    function handleLoginSubmit(event) {
      event.preventDefault();
      const email = document.getElementById('loginEmail').value.trim().toLowerCase();
      const password = document.getElementById('loginPassword').value;
      const errorBox = document.getElementById('loginError');
      
      // Busca o usuário pelo e-mail na base unificada
      const userKey = Object.keys(USERS_DB).find(key => USERS_DB[key].email === email);
      const record = userKey ? USERS_DB[userKey] : null;
      
      if (record && record.password === password) {
        // Sucesso
        errorBox.style.display = 'none';
        document.getElementById('loginForm').reset();
        authenticateUser(record.id);
      } else {
        // Falha
        errorBox.style.display = 'block';
        document.getElementById('loginPassword').value = '';
        document.getElementById('loginPassword').focus();
      }
    }

    function authenticateUser(userKey) {
      appState.currentUserKey = userKey;
      saveState();

      const user = USERS_DB[userKey];

      // Verifica se o usuário precisa trocar a senha provisória
      if (user && user.mustChangePassword) {
        document.getElementById('modalLoginScreen').classList.remove('active');
        openChangePasswordModal();
        return;
      }

      document.getElementById('modalLoginScreen').classList.remove('active');
      applyUserRoleUI();
      navigateToTab('home');
      showToast(`Bem-vindo(a), ${getCurrentUser().name}!`);
    }

    function openChangePasswordModal() {
      document.getElementById('changePwError').style.display = 'none';
      document.getElementById('changePasswordForm').reset();
      document.getElementById('modalChangePassword').classList.add('active');
    }

    function handleChangePasswordSubmit(event) {
      event.preventDefault();
      const newPw = document.getElementById('newPwInput').value;
      const confirmPw = document.getElementById('confirmPwInput').value;
      const errorBox = document.getElementById('changePwError');

      // Validação 1: Tamanho mínimo
      if (newPw.length < 6) {
        errorBox.innerText = 'A senha deve ter no mínimo 6 caracteres.';
        errorBox.style.display = 'block';
        return;
      }

      // Validação 2: Senhas coincidem
      if (newPw !== confirmPw) {
        errorBox.innerText = 'As senhas não coincidem. Tente novamente.';
        errorBox.style.display = 'block';
        document.getElementById('confirmPwInput').value = '';
        document.getElementById('confirmPwInput').focus();
        return;
      }

      // Atualizar a senha no USERS_DB
      const userKey = appState.currentUserKey;
      if (!userKey || !USERS_DB[userKey]) {
        errorBox.innerText = 'Erro interno: usuário não identificado.';
        errorBox.style.display = 'block';
        return;
      }

      // Persistir nova senha em todas as fontes de dados
      USERS_DB[userKey].password = newPw;
      USERS_DB[userKey].mustChangePassword = false;

      if (appState.customUsers && appState.customUsers[userKey]) {
        appState.customUsers[userKey].password = newPw;
        appState.customUsers[userKey].mustChangePassword = false;
      }

      // Sincronizar também com teamMembers (se tiver o campo password)
      const teamMember = appState.teamMembers.find(m => m.id === userKey);
      if (teamMember) {
        teamMember.password = newPw;
        teamMember.mustChangePassword = false;
      }

      saveState();

      // Fechar modal e prosseguir com o fluxo normal de autenticação
      document.getElementById('modalChangePassword').classList.remove('active');
      applyUserRoleUI();
      navigateToTab('home');
      showToast(`Senha redefinida com sucesso! Bem-vindo(a), ${getCurrentUser().name}!`);
    }

    function applyUserRoleUI() {
      const user = getCurrentUser();
      if (!user || !user.roleKey) {
        executeLogout();
        return;
      }
      
      document.getElementById('headerRoleText').innerText = user.roleTitle;
      document.getElementById('headerAvatarBtn').innerText = user.avatarText;
      document.getElementById('homeGreeting').innerText = `Olá, ${user.name}!`;
      document.getElementById('homeSubGreeting').innerText = `${user.roleTitle} · ${user.school}`;

      const unitsNavTab = document.getElementById('deskTabUnits');
      const teamNavTab = document.getElementById('deskTabTeam');
      const adminNavTab = document.getElementById('deskTabAdmin');
      const deskTabHomeLabel = document.getElementById('deskTabHomeLabel');
      const heroBtn = document.getElementById('btnNewObsHero');
      const heroBtnText = document.getElementById('btnNewObsText');
      const roleFilterGroup = document.getElementById('histFilterRoleGroup');
      const scheduleNavTab = document.getElementById('deskTabSchedule');
      const histNavTab = document.getElementById('deskTabHist');
      const mobMenuHistBtn = document.getElementById('mobMenuHistBtn');
      const homeDraftsHeader = document.getElementById('homeDraftsHeader');
      const homeDraftsContainer = document.getElementById('homeDraftsContainer');
      const homeScheduleBanner = document.getElementById('homeScheduleBanner');

      const scopeTitle = document.getElementById('roleScopeTitle');
      const scopeDesc = document.getElementById('roleScopeDesc');
      const indicatorsTargetFilter = document.getElementById('indicatorsTargetTypeFilter');
      const indicatorsTargetBadge = document.getElementById('indicatorsTargetTypeBadge');

      // Global Reset visibility
      if (unitsNavTab) unitsNavTab.style.display = 'none';
      if (teamNavTab) teamNavTab.style.display = 'none';
      if (adminNavTab) adminNavTab.style.display = 'none';
      if (heroBtn) heroBtn.style.display = 'none';
      if (roleFilterGroup) roleFilterGroup.style.display = 'none';
      if (indicatorsTargetFilter) indicatorsTargetFilter.style.display = 'inline-block';
      if (indicatorsTargetBadge) indicatorsTargetBadge.style.display = 'none';
      if (deskTabHomeLabel) deskTabHomeLabel.innerText = "Início";

      // Reset visibility for these before applying rules
      if (scheduleNavTab) scheduleNavTab.style.display = 'flex';
      if (histNavTab) histNavTab.style.display = 'flex';
      if (mobMenuHistBtn) mobMenuHistBtn.style.display = 'flex';
      if (homeScheduleBanner) homeScheduleBanner.style.display = 'none';
      if (homeDraftsHeader) homeDraftsHeader.style.display = 'block';
      if (homeDraftsContainer) {
        homeDraftsContainer.style.display = 'flex';
        homeDraftsContainer.style.flexDirection = 'column';
      }

      if (user.roleKey === 'coordenador') {
        const pedagTabClassesEl = document.getElementById('pedagTabClasses');
        if (pedagTabClassesEl) pedagTabClassesEl.style.display = 'inline-flex';
        if (scopeTitle) scopeTitle.innerText = 'Coordenação Pedagógica:';
        if (scopeDesc) scopeDesc.innerText = `Você avalia as professoras da sua Unidade Escolar (${user.school}). Seus rascunhos são estritamente privados.`;
        if (unitsNavTab) unitsNavTab.style.display = 'none';
        if (teamNavTab) teamNavTab.style.display = 'none';
        if (adminNavTab) adminNavTab.style.display = 'none';
        roleFilterGroup.style.display = 'none';
        const targetTypeWrapper = document.getElementById('indicatorsTargetTypeWrapper');
        if (targetTypeWrapper) targetTypeWrapper.style.display = 'none';
        if (indicatorsTargetFilter) {
          indicatorsTargetFilter.value = 'professora';
          indicatorsTargetFilter.style.display = 'none';
        }
        if (indicatorsTargetBadge) {
          indicatorsTargetBadge.style.display = 'none';
        }
        if (deskTabHomeLabel) deskTabHomeLabel.innerText = "Início";
        heroBtn.style.display = 'inline-flex';
        heroBtnText.innerText = 'NOVA OBSERVAÇÃO';
      } else if (user.roleKey === 'formador') {
        if (scopeTitle) scopeTitle.innerText = 'Formadora Pedagógica:';
        if (scopeDesc) scopeDesc.innerText = `Acompanhamento formativo e supervisão pedagógica do seu polo.`;
        if (unitsNavTab) unitsNavTab.style.display = 'none';
        if (teamNavTab) teamNavTab.style.display = 'none';
        if (adminNavTab) adminNavTab.style.display = 'none';
        roleFilterGroup.style.display = 'block';
        const targetTypeWrapper = document.getElementById('indicatorsTargetTypeWrapper');
        if (targetTypeWrapper) targetTypeWrapper.style.display = 'flex';
        if (indicatorsTargetFilter) {
          indicatorsTargetFilter.style.display = 'inline-block';
          if (!indicatorsTargetFilter.dataset.userSelectedRole || indicatorsTargetFilter.dataset.userSelectedRole !== user.email) {
            indicatorsTargetFilter.value = 'professora';
            indicatorsTargetFilter.dataset.userSelectedRole = user.email;
          }
        }
        if (indicatorsTargetBadge) indicatorsTargetBadge.style.display = 'none';
        if (deskTabHomeLabel) deskTabHomeLabel.innerText = "Início";
        heroBtn.style.display = 'inline-flex';
        heroBtnText.innerText = 'AVALIAR COORDENAÇÃO';
      } else if (isNucleoEI(user)) {
        if (scopeTitle) scopeTitle.innerText = 'Coordenadora do Núcleo de EI:';
        if (scopeDesc) scopeDesc.innerText = `Governança global da rede municipal SerTão Criança. Acesso onisciente a todas as 32 UEs, consolidados municipais, gestão de polos, atribuição de formadores e rubricas.`;
        if (deskTabHomeLabel) deskTabHomeLabel.innerText = "Gestão Pedagógica";
        if (unitsNavTab) unitsNavTab.style.display = 'none';
        if (teamNavTab) teamNavTab.style.display = 'none';
        if (adminNavTab) adminNavTab.style.display = 'flex';

        // Ocultação da aba Histórico no cabeçalho desktop e no menu drawer mobile
        if (histNavTab) histNavTab.style.display = 'none';
        if (mobMenuHistBtn) mobMenuHistBtn.style.display = 'none';

        roleFilterGroup.style.display = 'block';
        if (indicatorsTargetFilter) indicatorsTargetFilter.style.display = 'inline-block';
        if (indicatorsTargetBadge) indicatorsTargetBadge.style.display = 'none';
        heroBtn.style.display = 'none';
        
        if (scheduleNavTab) scheduleNavTab.style.display = 'none';
        if (homeScheduleBanner) homeScheduleBanner.style.display = 'none';
        if (homeDraftsHeader) homeDraftsHeader.style.display = 'none';
        if (homeDraftsContainer) homeDraftsContainer.style.display = 'none';

        // Redirecionamento defensivo caso o usuário estivesse na tela de Histórico
        if (document.getElementById('screenHistory')?.classList.contains('active')) {
          navigateToTab('home');
        }
      } else if (user.roleKey === 'pendente') {
        if (scopeTitle) scopeTitle.innerText = 'Acesso Pendente:';
        if (scopeDesc) scopeDesc.innerText = 'Sua conta foi criada e está aguardando liberação de acesso pela Coordenadora do Núcleo de EI.';
        if (deskTabHomeLabel) deskTabHomeLabel.innerText = "Início";
        if (unitsNavTab) unitsNavTab.style.display = 'none';
        if (teamNavTab) teamNavTab.style.display = 'none';
        if (adminNavTab) adminNavTab.style.display = 'none';
        if (histNavTab) histNavTab.style.display = 'none';
        if (mobMenuHistBtn) mobMenuHistBtn.style.display = 'none';
        roleFilterGroup.style.display = 'none';
        if (indicatorsTargetFilter) indicatorsTargetFilter.style.display = 'none';
        if (indicatorsTargetBadge) indicatorsTargetBadge.style.display = 'none';
        heroBtn.style.display = 'none';
        
        if (scheduleNavTab) scheduleNavTab.style.display = 'none';
        if (homeScheduleBanner) homeScheduleBanner.style.display = 'none';
        if (homeDraftsHeader) homeDraftsHeader.style.display = 'none';
        if (homeDraftsContainer) homeDraftsContainer.style.display = 'none';
      } else if (user.roleKey === 'professora') {
        if (scopeTitle) scopeTitle.innerText = 'Docente:';
        if (scopeDesc) scopeDesc.innerText = 'Visualização do próprio painel e observações.';
        if (deskTabHomeLabel) deskTabHomeLabel.innerText = "Início";
        if (unitsNavTab) unitsNavTab.style.display = 'none';
        if (teamNavTab) teamNavTab.style.display = 'none';
        if (adminNavTab) adminNavTab.style.display = 'none';
        if (roleFilterGroup) roleFilterGroup.style.display = 'none';
        const targetTypeWrapper = document.getElementById('indicatorsTargetTypeWrapper');
        if (targetTypeWrapper) targetTypeWrapper.style.display = 'none';
        if (indicatorsTargetFilter) {
          indicatorsTargetFilter.value = 'professora';
          indicatorsTargetFilter.style.display = 'none';
        }
        if (indicatorsTargetBadge) {
          indicatorsTargetBadge.style.display = 'none';
        }
        if (heroBtn) heroBtn.style.display = 'none';
        
        if (scheduleNavTab) scheduleNavTab.style.display = 'none';
        if (homeScheduleBanner) homeScheduleBanner.style.display = 'none';
        if (homeDraftsHeader) homeDraftsHeader.style.display = 'none';
        if (homeDraftsContainer) homeDraftsContainer.style.display = 'none';
      }

      const mobRubricsBtn = document.getElementById('mobMenuRubricsBtn');
      if (mobRubricsBtn) mobRubricsBtn.style.display = isNucleoEI(user) ? 'flex' : 'none';

      // Pilar 14: Governança Operacional Descentralizada & SSOT Única
      const opNavTab = document.getElementById('deskTabOpManagement');
      const opNavLabel = document.getElementById('deskTabOpManagementLabel');
      const homeOpCard = document.getElementById('homeOpManagementCard');
      const homeOpTitle = document.getElementById('homeOpManagementTitle');
      const homeOpSubtitle = document.getElementById('homeOpManagementSubtitle');
      const homeOpBtn = document.getElementById('homeOpManagementBtn');
      const mobMenuOpBtn = document.getElementById('mobMenuOpManagementBtn');
      const mobMenuOpText = document.getElementById('mobMenuOpManagementText');

      const pedagUnitsLabel = document.getElementById('pedagTabUnitsLabel');
      const pedagClassesLabel = document.getElementById('pedagTabClassesLabel');
      const pedagTeamLabel = document.getElementById('pedagTabTeamLabel');
      const pedagExportsTab = document.getElementById('pedagTabExports');
      const homeGestaoActionsCentral = document.getElementById('homeGestaoActionsCentral');
      const homeGestaoTitle = document.getElementById('homeGestaoTitle');
      const homeGestaoSubtitle = document.getElementById('homeGestaoSubtitle');

      if (user.roleKey === 'coordenador') {
        if (opNavTab) {
          opNavTab.style.display = 'flex';
          if (opNavLabel) opNavLabel.innerText = 'Minha Escola';
        }
        if (homeOpCard) {
          homeOpCard.style.display = 'block';
          if (homeOpTitle) homeOpTitle.innerText = 'Gestão da Minha Escola';
          if (homeOpSubtitle) homeOpSubtitle.innerText = `Gerencie as turmas, docentes regentes titulares e caracterização de ${user.school}.`;
          if (homeOpBtn) homeOpBtn.innerText = 'Acessar Gestão da Escola';
        }
        if (mobMenuOpBtn) {
          mobMenuOpBtn.style.display = 'flex';
          if (mobMenuOpText) mobMenuOpText.innerText = 'Gestão da Minha Escola';
        }
        if (pedagUnitsLabel) pedagUnitsLabel.innerHTML = '<span class="pedag-tab-full-text">Minha Escola</span><span class="pedag-tab-mobile-text">Escola</span>';
        if (pedagClassesLabel) pedagClassesLabel.innerHTML = '<span class="pedag-tab-full-text">Turmas & Regência</span><span class="pedag-tab-mobile-text">Turmas</span>';
        if (pedagTeamLabel) pedagTeamLabel.innerHTML = '<span class="pedag-tab-full-text">Docentes da UE</span><span class="pedag-tab-mobile-text">Docentes</span>';
        if (pedagExportsTab) pedagExportsTab.style.display = 'none';
        if (homeGestaoActionsCentral) homeGestaoActionsCentral.style.display = 'none';
        if (homeGestaoTitle) homeGestaoTitle.innerText = `Gestão da Unidade Escolar · ${user.school}`;
        if (homeGestaoSubtitle) {
          homeGestaoSubtitle.innerText = 'Administração autônoma de turmas, docentes e caracterização da escola sob SSOT única.';
          homeGestaoSubtitle.style.display = 'block';
        }
      } else if (user.roleKey === 'formador') {
        if (opNavTab) {
          opNavTab.style.display = 'flex';
          if (opNavLabel) opNavLabel.innerText = 'Meu Polo';
        }
        if (homeOpCard) {
          homeOpCard.style.display = 'block';
          if (homeOpTitle) homeOpTitle.innerText = 'Gestão do Polo Regional';
          if (homeOpSubtitle) homeOpSubtitle.innerText = `Supervisão territorial das escolas e coordenações do ${user.school}.`;
          if (homeOpBtn) homeOpBtn.innerText = 'Acessar Gestão do Polo';
        }
        if (mobMenuOpBtn) {
          mobMenuOpBtn.style.display = 'flex';
          if (mobMenuOpText) mobMenuOpText.innerText = 'Gestão do Polo Regional';
        }
        if (pedagUnitsLabel) pedagUnitsLabel.innerHTML = '<span class="pedag-tab-full-text">Escolas do Polo</span><span class="pedag-tab-mobile-text">Escolas</span>';
        if (pedagClassesLabel) pedagClassesLabel.innerHTML = '<span class="pedag-tab-full-text">Turmas do Polo</span><span class="pedag-tab-mobile-text">Turmas</span>';
        if (pedagTeamLabel) pedagTeamLabel.innerHTML = '<span class="pedag-tab-full-text">Coordenações Pedagógicas</span><span class="pedag-tab-mobile-text">Coordenações</span>';
        if (pedagExportsTab) pedagExportsTab.style.display = 'none';
        if (homeGestaoActionsCentral) homeGestaoActionsCentral.style.display = 'none';
        if (homeGestaoTitle) homeGestaoTitle.innerText = `Gestão do Polo Regional · ${user.school}`;
        if (homeGestaoSubtitle) {
          homeGestaoSubtitle.innerText = 'Supervisão territorial das Unidades Escolares e gestão de coordenações sob SSOT única.';
          homeGestaoSubtitle.style.display = 'block';
        }
      } else if (isNucleoEI(user)) {
        if (opNavTab) opNavTab.style.display = 'none';
        if (homeOpCard) homeOpCard.style.display = 'none';
        if (mobMenuOpBtn) {
          mobMenuOpBtn.style.display = 'flex';
          if (mobMenuOpText) mobMenuOpText.innerText = 'Gestão da Rede Municipal';
        }
        if (pedagUnitsLabel) pedagUnitsLabel.innerHTML = '<span class="pedag-tab-full-text">Unidades Escolares & Polos</span><span class="pedag-tab-mobile-text">Escolas & Polos</span>';
        // A Coordenadora do Núcleo de EI gerencia somente os polos; a tela de turmas da rede é retirada
        const pedagTabClassesEl = document.getElementById('pedagTabClasses');
        if (pedagTabClassesEl) pedagTabClassesEl.style.display = 'none';
        if (pedagClassesLabel) pedagClassesLabel.innerHTML = '';
        if (pedagTeamLabel) pedagTeamLabel.innerHTML = '<span class="pedag-tab-full-text">Equipes & Servidores da Rede</span><span class="pedag-tab-mobile-text">Servidores</span>';
        if (pedagExportsTab) pedagExportsTab.style.display = 'block';
        if (homeGestaoActionsCentral) homeGestaoActionsCentral.style.display = 'flex';
        if (homeGestaoTitle) homeGestaoTitle.innerText = 'Gestão da Rede';
        if (homeGestaoSubtitle) {
          homeGestaoSubtitle.innerText = '';
          homeGestaoSubtitle.style.display = 'none';
        }
      } else {
        if (opNavTab) opNavTab.style.display = 'none';
        if (homeOpCard) homeOpCard.style.display = 'none';
        if (mobMenuOpBtn) mobMenuOpBtn.style.display = 'none';
      }

      const mobTabSchedule = document.getElementById('mobTabSchedule');
      if (mobTabSchedule) {
        mobTabSchedule.style.display = (isNucleoEI(user) || user.roleKey === 'pendente' || user.roleKey === 'professora') ? 'none' : 'flex';
      }

      const notes = getScopedNotes();
      const activeNotes = notes.filter(n => !n.archived);
      const navNotesEl = document.getElementById('navNotesCount');
      if (navNotesEl) navNotesEl.innerText = activeNotes.length;

      // Gestão de Matrizes: botões de upload e restauração restritos estritamente à Coordenadora do Núcleo de EI
      const isTecnico = isNucleoEI(user);
      const adminTeacher = document.getElementById('adminRefDocsTeacher');
      const adminCoord = document.getElementById('adminRefDocsCoordinator');
      if (adminTeacher) adminTeacher.style.display = isTecnico ? 'flex' : 'none';
      if (adminCoord) adminCoord.style.display = isTecnico ? 'flex' : 'none';
      const adminTeacherModal = document.getElementById('adminRefDocsTeacherModal');
      const adminCoordModal = document.getElementById('adminRefDocsCoordinatorModal');
      if (adminTeacherModal) adminTeacherModal.style.display = isTecnico ? 'flex' : 'none';
      if (adminCoordModal) adminCoordModal.style.display = isTecnico ? 'flex' : 'none';

      // Governança RBAC para criação de profissionais/usuários
      const btnNewTeacher = document.getElementById('btnNewTeacher');
      const btnNewUser = document.getElementById('btnNewUser');

      if (user.roleKey === 'coordenador') {
        if (btnNewTeacher) btnNewTeacher.style.display = 'inline-flex';
        if (btnNewUser) btnNewUser.style.display = 'none'; // Coordenadora gerencia unicamente o corpo docente da escola
      } else if (user.roleKey === 'formador') {
        if (btnNewTeacher) btnNewTeacher.style.display = 'inline-flex';
        if (btnNewUser) btnNewUser.style.display = 'inline-flex';
      } else {
        // Helena / Núcleo de EI / Administrador
        if (btnNewTeacher) btnNewTeacher.style.display = 'inline-flex';
        if (btnNewUser) btnNewUser.style.display = 'inline-flex';
      }

      // Renderiza Seletor Global de Ano Letivo com proteção defensiva
      try {
        renderGlobalAcademicYearSelector();
      } catch (errYearSel) {
        console.warn('Proteção de inicialização: renderGlobalAcademicYearSelector ignorado defensivamente:', errYearSel);
      }
    }

