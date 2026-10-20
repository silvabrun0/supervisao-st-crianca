# PLANO DE IMPLEMENTAÇÃO: REGISTRO MANUAL E FIDEDIGNO DE HORÁRIOS DA OBSERVAÇÃO PEDAGÓGICA (ELIMINAÇÃO DE GRAVAÇÃO AUTOMÁTICA)

> **DIRETRIZ OBRIGATÓRIA DE EXECUÇÃO (ETAPA 1 & ETAPA 2 - WORKFLOW_MACOS.md / AGENTS.md / GEMINI.md):**
> 1. O assistente executor (Etapa 2) DEVE obrigatoriamente ler e seguir as diretrizes deste plano e do `WORKFLOW_MACOS.md` antes de aplicar qualquer modificação.
> 2. Sincronização prévia obrigatória: executar `git pull origin main` antes de iniciar a edição.
> 3. Aplicar estritamente as alterações de interface, lógica e validação especificadas neste documento, eliminando a gravação forçada automática de horários do relógio no início e término da observação e permitindo que o docente registre e preserve seus horários reais anotados em visita.
> 4. Dupla checagem obrigatória: reler as linhas modificadas no `index.html` para certificar-se da correta persistência.
> 5. Salvamento de backup intermediário: salvar cópia idêntica em `intermediárias/aplicativo_v88_registro_manual_horarios_observacao.html`.
> 6. Gestão dupla de Changelog no arquivo `CHANGELOG.md` e no modal `#modalChangelog` do `index.html`, elevando a versão oficial para **Versão 0.88 (v7.67)**.
> 7. Sincronização espelhada obrigatória entre `index.html` (raiz), `gestor supervisao_patos/index.html` e `gestor supervisao_patos/firebase_deploy/public/index.html`.
> 8. Checagem pré-push (`git fetch origin main`), rebase se necessário, commit semântico (`feat: registro manual e fidedigno de horarios da observacao pedagogica`) e envio para `origin main` com deploy automático no **GitHub Pages**.
> 9. Execução pós-deploy do algoritmo de auditoria (`python3 audit_platform.py --silent-on-success`), reportando ao usuário **somente se houverem problemas**.

---

## 1. Diagnóstico e Contexto

### 1.1 Cenário Atual
Atualmente, o fluxo de acompanhamento pedagógico possui uma mecânica de "Registro Temporal Automático":
1. Ao clicar no botão `INICIAR INSTRUMENTO DE OBSERVAÇÃO →` em `#screenSetupObs`, a função `startNewObservation()` grava silenciosamente a data atual (`todayStr`) e a hora atual do relógio (`getNowTimeString()`) nos campos ocultos `setupDate` e `setupStartTime`, limpando `setupEndTime`. O usuário é informado por um card informativo que: *"A data e horário de início são registrados no exato momento em que você iniciar a observação. O horário e data de término serão gravados automaticamente na finalização."*
2. Durante o preenchimento da observação ativa e na tela de Síntese Final (`#screenSynthesis`), os campos de data e horário de início e término são elementos ocultos (`<input type="hidden">`), exibindo apenas valores textuais fixos. O bloco de término e duração permanece invisível enquanto a observação está em rascunho (`#synthesisEndTimeBox` e `#synthesisDurationBox` ocultos), acompanhados do aviso `#synthesisAutoTimeNotice` reforçando que o término será gerado ao finalizar.
3. Ao acionar o botão de conclusão na função `finalizeObservation()`, o sistema sobrescreve compulsoriamente os campos `obs.endDate` e `obs.endTime` com a data e hora do exato segundo em que o botão foi clicado (`nowTimeStr = getNowTimeString()`).
4. **Problema Crítico Identificado:** Esse modelo não reflete o cotidiano do acompanhamento pedagógico na Educação Infantil de Patos/PB. Muitas vezes a supervisora ou coordenadora realiza a observação em sala de aula pela manhã (ex: das 07:30 às 09:15), anota suas observações e reflexões, mas só abre o sistema para lançar ou concluir a síntese à tarde, à noite ou no dia subsequente. Sob a mecânica atual:
   - Se o rascunho foi iniciado pela manhã e finalizado à noite, a duração calculada torna-se artificialmente gigante (ex: 12 a 15 horas de observação);
   - Se o formulário é iniciado apenas no momento da digitação posterior, o horário registrado torna-se fictício (ex: 21:00 às 21:15), deturpando o turno e a rotina escolar observada;
   - Descumpre a diretriz fundamental do projeto: **Dados e Indicadores devem ser fidedignos e apoiar a tomada de decisão pedagógica real**.

### 1.2 Resultado Esperado
1. **Eliminação da Sobrescrita Automática de Horários na Finalização:**
   - A função `finalizeObservation()` NUNCA deve sobrescrever a data, o início ou o término com o timestamp atual do relógio.
   - Os horários gravados na observação devem ser estritamente aqueles informados/anotados pelo docente/coordenador.
2. **Edição e Visualização Transparente na Síntese Final (`#screenSynthesis`):**
   - Na tela de Síntese, o usuário terá à disposição campos claros e editáveis para **Data da Observação** (`<input type="date">`), **Horário de Início** (`<input type="time">`) e **Horário de Término** (`<input type="time">`).
   - A duração observada (`synthesisDurationText`) será recalculada dinamicamente e em tempo real a cada alteração desses campos.
   - Se a observação for finalizada ou estiver em modo somente leitura (`isReadOnly`), os campos são bloqueados/desabilitados, garantindo a imutabilidade do registro histórico.
   - Mensagem de aviso informará com clareza: *"Atenção aos Horários: Se você estiver enviando este instrumento após a aula, certifique-se de registrar o horário exato em que a visita iniciou e terminou na sala."*
3. **Configuração Prévia Editável no Setup (`#screenSetupObs`):**
   - Substituição dos inputs ocultos por campos visíveis de Data, Horário de Início e Horário Previsto de Término no formulário de configuração.
   - Valores padrão sensatos: data atual e horários sugeridos da rotina escolar ou do agendamento vinculado, sendo 100% editáveis pelo usuário antes de iniciar o instrumento.
   - Substituição do card informativo de "gravação automática" por orientação sobre a fidedignidade dos horários.
4. **Validações de Consistência Temporal:**
   - Obrigatoriedade dos campos de data, início e término para a conclusão da observação.
   - Bloqueio de datas futuras.
   - Trava de consistência: o horário de término deve ser estritamente posterior ao horário de início, prevenindo durações negativas ou nulas.
   - Mensagem de toast amigável ao concluir: *"Observação finalizada com sucesso!"* (sem texto de gravação automática).

---

## 2. Arquitetura e Pontos de Impacto

Os seguintes blocos de código e elementos de interface serão afetados diretamente no `index.html`:

```
┌────────────────────────────────────────────────────────────────────────────────┐
│ SCREEN 3: SETUP DA OBSERVAÇÃO (#screenSetupObs)                                 │
│  - Campos #setupDate, #setupStartTime, #setupEndTime (visíveis e interativos)  │
│  - Substituição do card #setupDateValidationHint / Registro Temporal           │
│  - Funções JS: openSetupScreen(), validateSetupDateUI(), startNewObservation() │
└──────────────────────────────────────┬─────────────────────────────────────────┘
                                       │
                                       ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│ SCREEN 4: OBSERVAÇÃO ATIVA (#screenActiveObs)                                  │
│  - Exibição fidedigna da data e horário de início anotados (#activeObsMeta)   │
└──────────────────────────────────────┬─────────────────────────────────────────┘
                                       │
                                       ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│ SCREEN 5: SÍNTESE FINAL (#screenSynthesis)                                     │
│  - Painel de Registro de Período e Duração com inputs editáveis:               │
│    #synthesisDate, #synthesisStartTime, #synthesisEndTime                     │
│  - Recalculador de Tempo Total em tempo real (#synthesisDurationText)          │
│  - Substituição do card #synthesisAutoTimeNotice por instrução de envio tardio │
│  - Funções JS: renderSynthesisScreen(), onSynthesisTimeChange(),               │
│    recalculateSynthesisDuration(), finalizeObservation()                       │
└──────────────────────────────────────┬─────────────────────────────────────────┘
                                       │
                                       ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│ PERSISTÊNCIA, AUDITORIA E GOVERNANÇA                                           │
│  - Objeto newObs: preservação fiel de startDate, endDate, date, startTime,     │
│    endTime e durationMinutes informados manualmente                            │
│  - Módulo de Auditoria: sintese_finalizacao (validação determinística de       │
│    consistência manual de horários)                                            │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Especificação Passo a Passo de Implementação

### 3.1 Tela de Configuração da Observação (`#screenSetupObs` em `index.html`)

#### 3.1.1 Substituição do Bloco de Inputs Ocultos e Card Temporal
Localizar no `index.html` (aproximadamente linhas 2893 a 2908):
```html
          <!-- Hidden inputs para compatibilidade com rotinas legadas -->
          <input type="hidden" id="setupDate">
          <input type="hidden" id="setupStartTime">
          <input type="hidden" id="setupEndTime">
          <div id="setupDateValidationHint" style="display:none;"></div>

          <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:10px; padding:14px; margin-bottom:18px;">
            <div style="display:flex; align-items:center; gap:8px; font-size:13px; font-weight:700; color:var(--primary-dark); margin-bottom:4px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284C7" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Registro Temporal Automático
            </div>
            <div style="font-size:12px; color:#475569; line-height:1.5;">
              A <strong>data e horário de início</strong> são registrados no exato momento em que você iniciar a observação. O <strong>horário e data de término</strong> serão gravados automaticamente na finalização.
            </div>
          </div>
```

**Substituir exatamente por:**
```html
          <!-- Bloco de Registro Temporal Real da Visita Pedagógica -->
          <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:10px; padding:16px; margin-bottom:18px;">
            <div style="display:flex; align-items:center; gap:8px; font-size:13px; font-weight:700; color:var(--primary-dark); margin-bottom:4px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284C7" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Data e Horários da Visita Pedagógica
            </div>
            <div style="font-size:12px; color:#475569; line-height:1.4; margin-bottom:12px;">
              Informe os horários reais em que o acompanhamento ocorreu ou está ocorrendo. Se for enviar o formulário depois, seus horários anotados serão mantidos.
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:10px;">
              <div>
                <label class="form-label" style="font-weight:600; font-size:11px;">Data da Observação</label>
                <input type="date" id="setupDate" class="form-control" onchange="validateSetupDateUI()" style="font-size:12px; font-weight:600; padding:8px 10px;">
              </div>
              <div>
                <label class="form-label" style="font-weight:600; font-size:11px;">Horário de Início</label>
                <input type="time" id="setupStartTime" class="form-control" onchange="validateSetupDateUI()" style="font-size:12px; font-weight:600; padding:8px 10px;">
              </div>
              <div>
                <label class="form-label" style="font-weight:600; font-size:11px;">Horário de Término (Real ou Previsto)</label>
                <input type="time" id="setupEndTime" class="form-control" onchange="validateSetupDateUI()" style="font-size:12px; font-weight:600; padding:8px 10px;">
              </div>
            </div>
            <div id="setupDateValidationHint" style="font-size:12px; margin-top:8px; font-weight:600; display:none;"></div>
          </div>
```

---

### 3.2 Inicialização e Validação no Setup (`openSetupScreen` e `validateSetupDateUI`)

#### 3.2.1 Inicialização dos Inputs em `openSetupScreen`
No `index.html`, na função `openSetupScreen(prefilledSchedule)` (por volta das linhas 7670 a 7740), assegurar que os inputs de data e horários sejam preenchidos com defaults inteligentes sem bloquear a intervenção do usuário:
- Se houver visita agendada vinculada (`prefilledSchedule`), carregar `plannedDate` e `plannedTime`, calculando o término sugerido para 90 minutos após o início (`addMinutesToTime(plannedTime, 90)`).
- Se for observação avulsa: preencher `setupDate` com `todayStr`, `setupStartTime` com o horário atual ou `08:00` (caso turno matutino) e sugerir `setupEndTime` para 90 minutos depois ou deixá-lo com placeholder para preenchimento.

#### 3.2.2 Validação Temporal em `validateSetupDateUI()`
Aprimorar a função `validateSetupDateUI()` para validar também a relação entre início e término, caso ambos estejam preenchidos no setup:
- Bloquear data futura (`dateEl.value > todayStr`).
- Se `setupStartTime` e `setupEndTime` estiverem preenchidos e `setupEndTime <= setupStartTime`, exibir aviso orientativo de que o término deve ser posterior ao início.

#### 3.2.3 Leitura Fidedigna em `startNewObservation()`
Localizar no `index.html` em `startNewObservation()` (por volta das linhas 8015 a 8025):
```javascript
      const todayStr = getTodayDateString();
      const currentNowTime = getNowTimeString();

      const dateEl = document.getElementById('setupDate');
      const startEl = document.getElementById('setupStartTime');
      const endEl = document.getElementById('setupEndTime');

      if (dateEl) dateEl.value = todayStr;
      if (startEl) startEl.value = currentNowTime;
      if (endEl) endEl.value = '';
```

**Substituir por:**
```javascript
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
```

E no momento de instanciar `newObs` (por volta da linha 8151):
```javascript
        startDate: chosenDate,
        endDate: chosenEnd ? chosenDate : null,
        date: chosenDate,
        startTime: chosenStart,
        endTime: chosenEnd,
        durationMinutes: chosenEnd ? calculateObservationDuration({ startDate: chosenDate, endDate: chosenDate, startTime: chosenStart, endTime: chosenEnd }) : null,
```

---

### 3.3 Painel de Período e Duração na Síntese Final (`#screenSynthesis`)

#### 3.3.1 Estrutura HTML em `#screenSynthesis`
Localizar no `index.html` (aproximadamente linhas 2987 a 3025):
```html
          <!-- Time and Period Box in Synthesis -->
          <div style="background:#F1F5F9; border:1px solid #CBD5E1; border-radius:10px; padding:16px; margin-bottom:20px; page-break-inside:avoid;">
            <div style="font-size:14px; font-weight:800; color:var(--primary-dark); margin-bottom:10px;">
              ⏱️ Registro de Período e Duração da Observação
            </div>
            <!-- Hidden inputs para retrocompatibilidade -->
            <input type="hidden" id="synthesisDate">
            <input type="hidden" id="synthesisStartTime">
            <input type="hidden" id="synthesisEndTime">
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:12px;">
              <div>
                <label class="form-label">Data da Observação</label>
                <div style="padding:9px 12px; background:#fff; border:1px solid var(--border); border-radius:8px; font-size:13px; font-weight:700; color:var(--primary-dark);" id="synthesisDateDisplay">
                  --
                </div>
              </div>
              <div>
                <label class="form-label">Horário de Início</label>
                <div style="padding:9px 12px; background:#fff; border:1px solid var(--border); border-radius:8px; font-size:13px; font-weight:700; color:var(--primary-dark);" id="synthesisStartTimeDisplay">
                  --
                </div>
              </div>
              <div id="synthesisEndTimeBox" style="display:none;">
                <label class="form-label">Horário de Término</label>
                <div style="padding:9px 12px; background:#fff; border:1px solid var(--border); border-radius:8px; font-size:13px; font-weight:700; color:var(--primary-dark);" id="synthesisEndTimeDisplay">
                  --
                </div>
              </div>
              <div id="synthesisDurationBox" style="display:none;">
                <label class="form-label">Tempo Total Observado</label>
                <div style="padding:9px 12px; background:#fff; border:1px solid var(--border); border-radius:8px; font-size:13px; font-weight:700; color:var(--primary-dark);" id="synthesisDurationText">
                  --
                </div>
              </div>
            </div>
            <div id="synthesisAutoTimeNotice" style="font-size:12px; color:#475569; margin-top:10px; background:#fff; border:1px solid #E2E8F0; padding:10px 12px; border-radius:8px; display:flex; align-items:center; gap:8px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0284C7" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>O horário e data de término são gravados automaticamente na finalização da observação.</span>
            </div>
          </div>
```

**Substituir exatamente por:**
```html
          <!-- Time and Period Box in Synthesis (Registro Fidedigno Manual) -->
          <div style="background:#F8FAFC; border:1px solid #CBD5E1; border-radius:10px; padding:16px; margin-bottom:20px; page-break-inside:avoid;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <div style="font-size:14px; font-weight:800; color:var(--primary-dark); display:flex; align-items:center; gap:6px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0066CC" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Registro de Período e Duração da Visita
              </div>
              <span id="synthesisTimeBadge" style="font-size:11px; font-weight:700; background:#E0F2FE; color:#0369A1; padding:3px 10px; border-radius:12px;">
                Horários Efetivos de Sala
              </span>
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(170px, 1fr)); gap:12px;">
              <div>
                <label class="form-label" style="font-weight:700; font-size:12px;">Data da Observação</label>
                <input type="date" id="synthesisDate" class="form-control" onchange="onSynthesisTimeChange()" style="font-weight:700; font-size:13px; color:var(--primary-dark);">
                <div id="synthesisDateDisplay" style="display:none; padding:9px 12px; background:#fff; border:1px solid var(--border); border-radius:8px; font-size:13px; font-weight:700; color:var(--primary-dark);">--</div>
              </div>
              <div>
                <label class="form-label" style="font-weight:700; font-size:12px;">Horário de Início</label>
                <input type="time" id="synthesisStartTime" class="form-control" onchange="onSynthesisTimeChange()" style="font-weight:700; font-size:13px; color:var(--primary-dark);">
                <div id="synthesisStartTimeDisplay" style="display:none; padding:9px 12px; background:#fff; border:1px solid var(--border); border-radius:8px; font-size:13px; font-weight:700; color:var(--primary-dark);">--</div>
              </div>
              <div id="synthesisEndTimeBox">
                <label class="form-label" style="font-weight:700; font-size:12px;">Horário de Término</label>
                <input type="time" id="synthesisEndTime" class="form-control" onchange="onSynthesisTimeChange()" style="font-weight:700; font-size:13px; color:var(--primary-dark);">
                <div id="synthesisEndTimeDisplay" style="display:none; padding:9px 12px; background:#fff; border:1px solid var(--border); border-radius:8px; font-size:13px; font-weight:700; color:var(--primary-dark);">--</div>
              </div>
              <div id="synthesisDurationBox">
                <label class="form-label" style="font-weight:700; font-size:12px;">Tempo Total Observado</label>
                <div style="padding:9px 12px; background:#fff; border:1px solid var(--border); border-radius:8px; font-size:13px; font-weight:700; color:var(--primary-dark);" id="synthesisDurationText">
                  --
                </div>
              </div>
            </div>

            <div id="synthesisTimeValidationHint" style="font-size:12px; margin-top:8px; font-weight:600; display:none;"></div>

            <div id="synthesisTimeNotice" style="font-size:12px; color:#475569; margin-top:12px; background:#fff; border:1px solid #E2E8F0; padding:10px 12px; border-radius:8px; display:flex; align-items:center; gap:8px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0284C7" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>💡 <strong>Registro Fidedigno:</strong> Se você estiver finalizando este instrumento em momento posterior à observação, verifique e ajuste os horários exatos em que você esteve em sala de aula.</span>
            </div>
          </div>
```

---

### 3.4 Lógica de Renderização e Sincronização (`renderSynthesisScreen` e `onSynthesisTimeChange`)

#### 3.4.1 Atualização de `renderSynthesisScreen`
Na função `renderSynthesisScreen()` (por volta das linhas 8970 a 9015):
- Carregar os valores de `obs.startDate || obs.date || getTodayDateString()` no campo `#synthesisDate`.
- Carregar `obs.startTime || '08:00'` no campo `#synthesisStartTime`.
- Carregar `obs.endTime || ''` no campo `#synthesisEndTime`.
- Tratar o estado de permissão (`appState.isReadOnly` ou status finalizado):
  - **Se Finalizado / Somente Leitura:**
    - Ocultar os inputs interativos (`synthesisDate.style.display = 'none'`, etc.) e exibir as divs de texto (`synthesisDateDisplay.style.display = 'block'`, etc.) ou aplicar atributo `disabled` nos inputs;
    - Exibir a data e horários gravados com destaque tipográfico;
    - Ocultar o card informativo `#synthesisTimeNotice`.
  - **Se Rascunho / Aberto:**
    - Garantir que os inputs estejam visíveis e habilitados para edição;
    - Manter `#synthesisEndTimeBox` e `#synthesisDurationBox` visíveis;
    - Exibir `#synthesisTimeNotice`.
- Invocar `recalculateSynthesisDuration()`.

#### 3.4.2 Atualização da Função `onSynthesisTimeChange()`
Atualizar a função `onSynthesisTimeChange()` (por volta das linhas 9289 a 9301) para manter `appState.currentObs` sincronizado reativamente com os inputs:
```javascript
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
      }

      recalculateSynthesisDuration();
      saveState();
    }
```

#### 3.4.3 Atualização de `recalculateSynthesisDuration()`
Garantir que a função `recalculateSynthesisDuration()` exiba a duração dinâmica tanto em rascunhos quanto em observações concluídas, desde que início e término estejam preenchidos:
- Se início e término estiverem preenchidos e válidos: calcular a duração e exibir em formato amigável (ex: `1h 45min (105 minutos)`).
- Se término estiver pendente de preenchimento pelo usuário: exibir *"Aguardando horário de término"*.
- Se `endTime <= startTime`: exibir *"Horário inválido"*.

---

### 3.5 Finalização Estrita e Fiel aos Dados Informados (`finalizeObservation`)

Localizar no `index.html` a função `finalizeObservation()` (por volta das linhas 9397 a 9459):

```javascript
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

      const todayStr = getTodayDateString();
      const nowTimeStr = getNowTimeString();

      obs.status = 'finalized';
      obs.startDate = obs.startDate || obs.date || todayStr;
      obs.startTime = obs.startTime || nowTimeStr;
      obs.endDate = todayStr;
      obs.endTime = nowTimeStr;
      obs.date = obs.startDate;
      obs.durationMinutes = calculateObservationDuration(obs);
      
      const commentsEl = document.getElementById('synthesisGeneralComments');
      if (commentsEl) obs.comments = commentsEl.value;

      appState.isReadOnly = true;

      // ... baixa em cronograma e persistência ...

      saveState();
      showToast('Observação finalizada com sucesso! Horário e data de término gravados automaticamente.');
      navigateToTab('history', 'finalized');
    }
```

**Substituir a seção de validação e atribuição temporal por:**

```javascript
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

      // Atualiza o status do agendamento correspondente para 'realizado'
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
      }

      saveState();
      showToast('Observação finalizada com sucesso!');
      navigateToTab('history', 'finalized');
    }
```

---

## 4. Critérios de Aceite e Roteiro de Teste/Validação

### 4.1 Roteiro de Verificação Manual
1. **Verificação de Formulário de Setup:**
   - Acessar a aplicação e clicar em "Nova Avaliação".
   - Constatar que os campos `Data da Observação`, `Horário de Início` e `Horário de Término` estão visíveis e interativos.
   - Definir intencionalmente data de ontem (ex: `2026-10-19`), início `08:00` e término `09:30`.
   - Iniciar o instrumento e verificar que `#activeObsMeta` no topo da tela de observação ativa exibe a data e o início configurados.
2. **Verificação da Síntese e Recalculador Reativo:**
   - Avançar até a Síntese Final.
   - Constatar que os campos `synthesisDate`, `synthesisStartTime` e `synthesisEndTime` refletem os valores escolhidos.
   - Alterar o término para `10:00` e constatar que o `synthesisDurationText` recalcula instantaneamente para `2h 0min (120 minutos)`.
   - Tentar definir o término para `07:30` (anterior ao início `08:00`) e verificar a exibição da mensagem de inconsistência em vermelho.
3. **Verificação de Finalização com Preservação de Horários:**
   - Responder todas as rubricas e os 3 critérios de materiais na síntese.
   - Ajustar os horários para: Data: `2026-10-18`, Início: `07:45`, Término: `09:15` (duração 90 minutos).
   - Clicar em "Finalizar e Enviar Observação".
   - Constatar o toast limpo: *"Observação finalizada com sucesso!"*.
   - Acessar o card recém-criado no Histórico: verificar que os horários registrados são exatamente `07:45 às 09:15 (90m)`, comprovando que o horário atual do relógio NÃO sobrescreveu os dados.
4. **Verificação de Bloqueio sem Horário de Término:**
   - Abrir uma nova observação ou rascunho, apagar o horário de término na síntese e tentar finalizar.
   - Verificar que a finalização é bloqueada exigindo o preenchimento do término.

---

## 5. Seção Obrigatória: Alterações / Adições / Exclusões no Algoritmo de Auditoria

Conforme diretriz mandatória de `WORKFLOW_MACOS.md`, `AGENTS.md` e `GEMINI.md`, a suíte determinística de auditoria (`audit_platform.py` e engine em `index.html`) deve ser atualizada para garantir 100% de cobertura das alterações:

### 5.1 No arquivo `index.html` (Engine de Testes do `AppAuditEngine`)

#### Módulo: `sintese_finalizacao` (ID `sintese_finalizacao`)
- **Modificações:**
  - Atualizar o teste para atribuir explicitamente os horários anotados pelo usuário antes da finalização:
    `obs.startDate = '2026-03-12'; obs.startTime = '08:00'; obs.endTime = '09:40'; obs.date = '2026-03-12';`
  - Reavaliar a asserção após a execução de `finalizeObservation()`: verificar que `obs.startTime === '08:00'`, `obs.endTime === '09:40'` e `obs.durationMinutes === 100`.
  - Substituir o log `"Registro automático de data/hora de término"` por `"Preservação integral dos horários anotados manualmente pelo docente (08:00 às 09:40)"`.
- **Adições:**
  - **Teste de Bloqueio por Horário de Término Ausente:**
    Tentar finalizar uma observação em que `obs.endTime = ''` e validar que a transição para `finalized` é impedida.
  - **Teste de Consistência Temporal (Término Anterior ao Início):**
    Tentar finalizar com `obs.startTime = '09:00'` e `obs.endTime = '08:00'` e validar que a plataforma rejeita a finalização, mantendo a consistência dos dados de duração.
- **Exclusões:**
  - Remover qualquer validação que espere que `obs.endDate` ou `obs.endTime` sejam preenchidos automaticamente com a data e hora do relógio no instante da execução.

### 5.2 No arquivo `audit_platform.py`
- Nenhuma alteração estrutural necessária no catálogo CLI de módulos (`MODULE_CATALOG`), pois o módulo `sintese_finalizacao` já está devidamente catalogado e continuará sendo executado de forma modo-a-modo e na suíte integral.
