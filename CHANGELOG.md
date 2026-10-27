# HISTÓRICO COMPLETO DE VERSÕES (CHANGELOG)
## Sistema de Supervisão Pedagógica · SerTão Criança

Este documento consolida a evolução cronológica e técnica integral do projeto **SerTão Criança**, reconstruída a partir da análise aprofundada de todos os arquivos intermediários (`intermediárias/`), insumos de deliberação (`inputs/`), planos executivos de arquitetura (`planos_de_implementacao/`), scripts de transformação de dados e código em produção (`firebase_deploy/public/index.html`).

Todas as versões do projeto estão enumeradas de forma sequencial na convenção unificada **0.n** (`0.1`, `0.2`, ..., `0.n`).

---

## 📌 Sumário Executivo de Versões

| Versão | Data / Horário | Arquivo de Referência | Origem / Insumos Principais | Foco Central❌ |
| :---: | :---: | :--- | :--- | :--- |
| **1.34** | 27/10/2026 13:05 | `intermediárias/aplicativo_v134_trava_visualizacao_desktop_e_eliminacao_scroll_horizontal.html` | Solicitação direta / `planos_de_implementacao/plano_trava_visualizacao_desktop_e_eliminacao_scroll_horizontal.md` | Trava de visualização desktop, eliminação de transbordo horizontal e blindagem da viewport: trava estrutural raiz (`html, body`) com `overflow-x: hidden`, `overscroll-behavior-x: none` (anti-rubber-band), compactação responsiva do cabeçalho em notebooks/desktops intermediários, confinamento de tabelas e trava de escala na viewport 🛡️💻📱 |
| **1.33** | 26/10/2026 17:55 | `intermediárias/aplicativo_v133_apresentacao_dados_decisao_gestores.html` | Solicitação direta / `planos_de_implementacao/plano_apresentacao_dados_processo_decisorio_gestores.md` | Apresentação de dados orientada ao processo decisório dos gestores: governança territorial por polos (`<optgroup>`), tabela executiva de UEs, régua das grandes dimensões, síntese agregada da escala de materiais, prioridades balanceadas (fragilidades e práticas consolidadas) e busca na matriz 🗺️🏫📊 |
| **1.32** | 26/10/2026 17:45 | `intermediárias/aplicativo_v132_adequacao_banner_rede_consolidada.html` | Solicitação direta / `planos_de_implementacao/plano_adequacao_banner_rede_consolidada.md` | Adequação contextual do banner na Visualização por Dimensão: eliminação da redundância comparativa em 'Rede Consolidada' em favor do panorama consolidado da rede municipal com badge orientador, e preservação da comparação ativa por Escola/Polo 🏛️🎯 |
| **1.31** | 26/10/2026 17:40 | `intermediárias/aplicativo_v131_substituicao_emojis_botoes_por_pictogramas.html` | Solicitação direta / `planos_de_implementacao/plano_substituicao_emojis_botoes_por_pictogramas.md` | Substituição sistemática de emojis nos botões principais e sub-abas por pictogramas vetoriais (SVGs inline padronizados com classes `.btn-icon`, `.btn-icon-sm`, `.tab-icon-svg`), garantindo consistência visual entre dispositivos e sobriedade institucional 🎨✨ |
| **1.30** | 26/10/2026 17:30 | `intermediárias/aplicativo_v130_substituicao_benchmark_por_referencial_rede.html` | Solicitação direta / `planos_de_implementacao/plano_substituicao_benchmark_por_referencial_rede.md` | Higienização terminológica pedagógica na Visualização por Dimensão, substituindo o termo corporativo 'Benchmark' por 'Referencial da Rede Municipal' no banner contextual, subtítulo e pauta diagnóstica, preservando fórmulas de Delta e auditoria com asserções estritas 🏛️🧹 |
| **1.29** | 26/10/2026 17:20 | `intermediárias/aplicativo_v129_ajuste_rotulo_salvar_prazos.html` | Solicitação direta / `planos_de_implementacao/plano_ajuste_rotulo_botao_salvar_prazos.md` | Higienização do rótulo do botão de gravação no modal de Ciclos Avaliativos (`#modalBimesterPeriods`), substituindo '💾 Salvar Prazos na SSOT' por 'Salvar Prazos', eliminando termos técnicos internos e emojis da interface pedagógica 🧹🏷️ |
| **1.28** | 26/10/2026 17:15 | `intermediárias/aplicativo_v128_botao_novo_ano_letivo_plurianual_ssot.html` | Solicitação direta / `planos_de_implementacao/plano_arquitetura_plurianual_ciclos_letivos.md` | Disponibilização do botão 'Iniciar Novo Ano Letivo' na Gestão da Rede e no modal de Ciclos Avaliativos, assistente de criação (`#modalCreateAcademicYear`), seletor global multi-ano, prazos independentes por ano e preservação patrimonial total 🌟📅 |
| **1.27** | 26/10/2026 16:55 | `intermediárias/aplicativo_v127_correcao_filtro_status_atrasadas_pilar10.html` | Solicitação direta / `planos_de_implementacao/plano_correcao_filtro_status_atrasadas_semaforo_pilar10.md` | Correção do filtro de status atrasadas no Semáforo do Pilar 10, garantia de idempotência no alternador de visão de turmas/docentes e isolamento hermético do teste no módulo `indicadores_decisao` 🚦🛡️ |
| **1.26** | 26/10/2026 16:45 | `intermediárias/aplicativo_v126_remocao_setas_matrizes_referencia.html` | Solicitação direta / Higienização visual | Remoção das setas (↗️) dos botões de acesso direto "Matriz Docente" e "Matriz Coordenadores" no cabeçalho das Matrizes de Referência Oficiais 🧹 |
| **1.26** | 26/10/2026 16:45 | `intermediárias/aplicativo_v126_visualizacao_por_dimensao.html` | Solicitação direta / `planos_de_implementacao/plano_modificacao_afunilamento_para_visualizacao_por_dimensao.md` | Transição terminológica estrita substituindo 'Afunilamento por Dimensão' por 'Visualização por Dimensão' na sub-aba do painel de indicadores (`#pillIndDrilldown`), cabeçalho de seção (`#indicatorsSectionDrilldown`), deep-linking de gargalos e modal de filtros mobile 🔍 |
| **1.26** | 26/10/2026 16:40 | `intermediárias/aplicativo_v126_remocao_emojis_trofeu_longitudinal.html` | Solicitação direta / Higienização visual | Remoção dos emojis de troféu dos cards de Avanço do Ciclo e filtros de Ciclo 100% na tela de Acompanhamento Longitudinal 🧹 |
| **1.26** | 26/10/2026 16:20 | `intermediárias/aplicativo_v126_remocao_aviso_autoridade_ciclos_ssot.html` | Solicitação direta / Limpeza de interface | Remoção da caixa informativa de autoridade municipal da Coordenadora da EI no modal `#modalBimesterPeriods` (Ciclos Avaliativos & Prazos Oficiais), simplificando a interface sem alterar regras de negócio ou SSOT 🧹 |
| **1.25** | 26/10/2026 10:45 | `intermediárias/aplicativo_v125_edicao_e_gestao_autonoma_polos_regionais_ssot.html` | Solicitação direta / `plano_edicao_e_gestao_autonoma_polos_regionais_ssot.md` | Edição e gestão autônoma de Polos Regionais sob a SSOT única (`appState.polos`), ações na Matriz de Cobertura, modais dedicados de edição (`#modalEditPolo`) e cadastro (`#modalAddPolo`), propagação em cascata nas UEs e equipe, dinamização universal de dropdowns (`getAllPolosList`), governança pelo Núcleo de EI e arquitetura multi-ano 🗺️✏️ |
| **1.25** | 26/10/2026 10:30 | `intermediárias/aplicativo_v125_arquitetura_plurianual_ciclos_letivos.html` | Solicitação direta / `plano_arquitetura_plurianual_ciclos_letivos.md` | Arquitetura Plurianual e Gestão de Ciclos Letivos (Multi-Ano SSOT): seletor global de ano letivo no cabeçalho (`#headerAcademicYearSelect`), banner de alerta em modo consulta histórica, assistente de criação de novo ano com clonagem de turmas/docentes (`#modalCreateAcademicYear`), isolamento temporal determinístico no semáforo longitudinal de turmas e docentes, preservação patrimonial absoluta de Unidades Escolares, Servidores e Polos Regionais, e auditoria 100% aprovada 📅🏛️ |
| **1.24** | 23/10/2026 15:30 | `intermediárias/aplicativo_v124_botoes_novo_professor_e_novo_usuario_ssot.html` | Solicitação direta / `plano_botoes_novo_professor_e_novo_usuario_ssot.md` | Especialização dos botões da Gestão Pedagógica em `+ Novo Professor` (`#btnNewTeacher`) e `+ Novo Usuário` (`#btnNewUser`), blindagem absoluta contra coleta de e-mail ou senha docente no DOM, escrita na SSOT (`appState.teamMembers`), sincronização seletiva com `USERS_DB` e isolamento RBAC para Coordenadoras 👩‍🏫🔑 |
| **1.23** | 23/10/2026 15:15 | `intermediárias/aplicativo_v123_definicao_autonoma_periodos_ciclos_ssot.html` | Solicitação direta / `plano_definicao_autonoma_periodos_ciclos_ssot.md` | Definição autônoma dos períodos e prazos dos 4 bimestres letivos pela Coordenadora do Núcleo de EI (Helena Martins) via modal `#modalBimesterPeriods`, persistência e governança na SSOT única (`appState.bimesterPeriods`), motor algorítmico dinâmico em `getCurrentSchoolBimester()`, erradicação de rótulos e prazos estimados no Semáforo (`Fev - Abr`, `Janela de 2 meses em aberto`) em favor de `getBimesterPeriodDisplay()` e sincronização reativa inter-abas 📅🌐 |
| **1.22** | 23/10/2026 14:35 | `intermediárias/aplicativo_v122_remocao_botao_nova_ocorrencia_registros.html` | Solicitação direta / `plano_remocao_botao_nova_ocorrencia_registros.md` | Remoção do botão de nova ocorrência (#btnNewQualitativeNote) no módulo de Registros Formativos, alinhando a interface à regra canônica dos Pilares 1 e 13 (ocorrências vinculadas estritamente à observação ativa via menu FAB), higienização de referências no RBAC e asserção no módulo travas_seguranca 📝🚫 |
| **1.22** | 23/10/2026 14:35 | `intermediárias/aplicativo_v122_simplificacao_cadastro_docente_jornada_e_ordem_abas.html` | Solicitação direta / `plano_simplificacao_cadastro_docente_jornada_e_ordem_abas.md` | Simplificação radical no cadastro de docentes pela Coordenadora (apenas Nome Completo, sem login ou base de autenticação), higienização visual de subtítulo de turmas e card da UE, rotulagem limpa 'Jornada Escolar' e ordenação canônica de abas desktop 👩‍🏫📐 |
| **1.21** | 23/10/2026 14:15 | `intermediárias/aplicativo_v121_resolucao_bloqueio_botoes_sintaxe_js.html` | Solicitação direta / `plano_resolucao_bloqueio_botoes_sintaxe_js.md` | Resolução definitiva do bloqueio global de botões por erro fatal de sintaxe JS (`Uncaught SyntaxError: Unexpected token '}'`), correção de escopo de `dbKey` em docentes e implementação de verificação sintática pré-voo em `audit_platform.py` 🔬🛡️ |
| **1.21** | 23/10/2026 14:15 | `intermediárias/aplicativo_v121_resolucao_bloqueio_botoes_sintaxe_js.html` | Solicitação direta / `plano_resolucao_bloqueio_botoes_sintaxe_js.md` | Resolução definitiva do bloqueio global de botões e blindagem de sintaxe JS: eliminação de chave duplicada órfã e correção de escopo de `dbKey`, blindagem com pré-voo sintático nativo JSC (`audit_platform.py --check-syntax`), consolidação das Workspace Skills do Antigravity e guardrails de governança contra erros de processo 🛡️⚡ |
| **1.20** | 22/10/2026 19:00 | `intermediárias/aplicativo_v120_refinamento_cadastro_docente_e_limpeza_titulos.html` | Solicitação direta / `plano_refinamento_cadastro_docente_e_limpeza_titulos.md` | Refinamento ergonômico no cadastro de docentes pela Coordenadora Pedagógica (remoção de e-mail, senha, cargo, unidade e supervisor, com foco exclusivo em Nome Completo), remoção do subtítulo residual no card de UE e remoção do sufixo '(Padrão MEC)' em Jornada Escolar 👩‍🏫🧹 |
| **1.19** | 22/10/2026 18:30 | `intermediárias/aplicativo_v119_correcao_rotulo_aba_inicio_coordenador.html` | Solicitação direta / `plano_correcao_rotulo_aba_inicio_coordenador.md` | Correção da alternância de perfil e restauração do rótulo canônico "Início" na Coordenação Pedagógica. Eliminação da retenção indevida de "Gestão Pedagógica" ao transitar da Coordenadora do Núcleo de EI para a Coordenação de escola ou Docente, reordenação canônica desktop (`#deskTabHome` como 1ª aba e `#deskTabOpManagement` como 2ª aba) e testes cíclicos de alternância com 100% de sucesso 🏷️📐 |
| **1.18** | 22/10/2026 18:00 | `intermediárias/aplicativo_v118_resolucao_tela_branca_pos_auditoria.html` | Solicitação direta / `plano_resolucao_tela_branca_pos_auditoria.md` | Resolução definitiva da tela branca pós-auditoria da plataforma. Substituição do `window.alert()` nativo bloqueante pelo modal in-app acessível `#modalAuditReport` com desacoplamento via duplo `requestAnimationFrame`, correção das funções de restauração de tela (`openSetupScreen`, `renderActiveObservation`, `renderSynthesisScreen`), blindagem defensiva contra telas inativas em `navigateToTab`, compatibilização universal da trava anti-reentrância `__autoAuditTriggered` e higienização estrita de classes de impressão residuais no `body` 🔬🛡️ |
| **1.17** | 22/10/2026 17:40 | `intermediárias/aplicativo_v117_pilar_14_governanca_descentralizada_ssot.html` | Deliberação SerTão Criança / Pilar 14 | Pilar 14: Governança Operacional Descentralizada e Gestão Autônoma sob SSOT Única: autonomia da Coordenadora (turmas, docentes, turno MEC e caracterização da escola), autonomia da Formadora (coordenadoras e polo regional), Núcleo de EI (governança central), resiliência contra ressurreição de turmas excluídas e integridade relacional total 🏫🌐 |
| **1.16** | 22/10/2026 16:30 | `intermediárias/aplicativo_v0.94_alinhamento_filtros_diagnostico.html` | Solicitação direta / `plano_alinhamento_filtros_diagnostico.md` | Alinhamento, centralização e padronização visual das caixas de filtros para diagnóstico (`#indicatorsFilterToolbar` e `#modalIndicatorsFiltersMobile`) e formulários globais, eliminação de padding zero do reset universal, proteção contra transbordamento (`padding-right: 36px` e `text-overflow: ellipsis`), chevron SVG canônico e resiliência no semáforo 📐✨ |
| **1.15** | 22/10/2026 16:00 | `intermediárias/aplicativo_v0.93_edicao_data_e_exclusao_agendamento.html` | Solicitação direta / `plano_edicao_data_agendamento_realizado_e_exclusao_cronograma.md` | Edição de data e horário em agendamentos realizados e arquivados no cronograma, sincronização bidirecional imediata com observação vinculada (`obs.date`, `obs.startTime`, turmas integrais), semáforo resiliente do Pilar 10 e exclusão segura (`deleteSchedule`) com desvinculação relacional ✏️🗑️ |
| **1.14** | 22/10/2026 15:40 | `intermediárias/aplicativo_v114_enxugamento_mobile_textos_longos_criterios.html` | Solicitação direta / `plano_enxugamento_mobile_textos_longos_criterios.md` | Enxugamento visual mobile dos cards de critérios com textos longos/parênteses explicativos, botão tátil `.btn-crit-detail-trigger`, Bottom Sheet canônica `#modalCriterionDetail` exibindo 100% do texto oficial sem invenções, preservação desktop e touch target de 32px 📱🏛️ |
| **1.14** | 22/10/2026 15:30 | `intermediárias/aplicativo_v114_bloqueio_docentes_vespertinos_etapa_matutina_integral.html` | Deliberação SerTão Criança / Pilares 4 e 5 | Bloqueio mandatório de avaliação das 5 dimensões e parecer individual de docentes vespertinos durante a Etapa 1 (Turno Matutino) em turmas integrais, com banner contextual 🔒, controles físicos desabilitados, blindagem lógica em controladores JS e liberação integral dos 4 regentes na Etapa 2 (Tarde) ☀️🌅 |
| **1.13** | 22/10/2026 15:15 | `intermediárias/aplicativo_v113_remocao_orientacoes_artificiais_rubricas.html` | Solicitação direta / Soberania da Matriz Oficial | Remoção integral do repositório artificial de orientações pedagógicas (RUBRIC_GUIDANCE_DB), do modal deslizante (#modalRubricGuidance), dos botões de gatilho de apoio (.btn-rubric-guidance-trigger e .btn-rubric-drilldown-trigger), e restauração fidedigna dos enunciados canônicos oficiais sem intervenção na lógica técnico-pedagógica municipal 🏛️ |
| **1.12** | 22/10/2026 15:00 | `intermediárias/aplicativo_v112_pilar_13_gestao_ocorrencias_padrao_mec.html` | Deliberação SerTão Criança / Pilar 13 | Pilar 13: Gestão de ocorrências críticas vinculadas primariamente à Turma, seletor de rotina coletiva vs. conduta individual, ciclo formativo com status "Conversado" e registro de acordos pactuados, rastreabilidade bidirecional com a observação de origem e padronização MEC formal de jornadas e turnos 👥💬 |
| **1.12** | 22/10/2026 14:45 | `intermediárias/aplicativo_v112_qualificacao_docentes_turnos_turmas_integrais.html` | Deliberação SerTão Criança / Pilares 4 e 5 | Qualificação de docentes por turno (manhã/tarde) em turmas integrais, botões interativos de remanejamento no setup, higienização da base de dados inicial com exclusividade por turno/escola, atribuição parcial seletiva e sequenciamento nominal 4.1 e 4.2 na síntese pedagógica ☀️🌅 |
| **1.11** | 22/10/2026 14:30 | `intermediárias/aplicativo_v110_pilar_11_popups_rubricas_apoio_mobile.html` | Deliberação SerTão Criança / Pilar 11 | Pilar 11: Enxugamento Visual no Mobile com Pop-ups e Bottom Sheet de Apoio Pedagógico às Rubricas (`ℹ️`), síntese inteligente de orientações longas, redução de 45% na altura dos cards, repositório canônico de apoio formativo e régua de gradação 📱 |
| **1.10** | 22/10/2026 14:15 | `intermediárias/aplicativo_v110_supressao_impressao_preservacao_rota_auditoria.html` | Deliberação SerTão Criança / UX Auditoria | Supressão de disparo de impressão no diagnóstico e preservação contextual de rota da plataforma 🔇 |
| **1.09** | 22/10/2026 14:00 | `intermediárias/aplicativo_v109_pilar_10_semaforo_docentes_regentes.html` | Deliberação SerTão Criança / Pilar 10 | Pilar 10: Semáforo Anual para Docentes Regentes | Resolução completa da visão semafórica de Docentes Regentes no Pilar 10, eliminação de células em branco, micro-cards decisórios docentes, filtros rápidos e integração com agendamento 🚦 |
| **1.08** | 21/10/2026 21:30 | `intermediárias/aplicativo_v108_pilar_10_semaforo_bimestral_turmas.html` | Deliberação SerTão Criança / Pilar 10 | Pilar 10: Quadro de Controle Bimestral matricial organizado por TURMA, Semáforo de Prazos Canônico (🟢 Verde Concluída, ⚪ Cinza No Prazo, 🔴 Vermelho Atrasada), micro-cards decisórios, filtros rápidos, atalhos de agendamento com 1 toque e cards adaptativos mobile 🚦 |
| **1.07** | 21/10/2026 21:00 | `intermediárias/aplicativo_v103_correcao_alternancia_gargalos_pilar_8.html` | Deliberação SerTão Criança / Pilar 8 | Correção da alternância de dados entre Menor Consistência e Maior Desvio vs. Rede Municipal: enriquecimento multi-escola na semente (`seedSampleData`), refino do algoritmo de ordenação de deltas negativos, feedback sutil em Rede Consolidada e validação de 100% de testes no Chrome 🎯 |
| **1.06** | 21/10/2026 20:00 | `intermediárias/aplicativo_v106_pilar_9_mobile_fab_lupinha_filtros.html` | Solicitação direta / Refinamento Pilar 9 | Botão flutuante circular com lupinha no canto inferior direito para acesso aos filtros no celular, e ocultação total da barra desktop de filtros abaixo de "Índices para Diagnóstico" na visualização móvel 🔍 |
| **1.05** | 21/10/2026 19:30 | `intermediárias/aplicativo_v105_remocao_pautas_prefabricadas_autonomia.html` | Solicitação direta / Autonomia Formativa da Rede | Remoção integral de pautas, caixas amarelas e diretrizes formativas pré-fabricadas no bloco de menores índices (Pilar 8), preservação da autonomia reflexiva da rede, foco em dados diagnósticos objetivos e cópia de resumo 🏛️ |
| **1.04** | 21/10/2026 19:00 | `intermediárias/aplicativo_v104_correcao_autenticacao_auditoria_emulacao_e2e.html` | Solicitação direta / Correção de Auditoria & Emulação E2E | Resolução canônica de credenciais em auditoria interativa (`mariana@teste.com`), isolamento determinístico de sessão RBAC, erradicação de falsos positivos/negativos e fortalecimento da emulação comportamental no motor de testes 🛡️ |
| **1.03** | 21/10/2026 18:30 | `intermediárias/aplicativo_v103_pilar_9_usabilidade_mobile_popup_filtros.html` | Deliberação SerTão Criança / Pilar 9 | Pilar 9: Usabilidade Mobile First com liberação total do viewport vertical no smartphone, gatilho flutuante tipo pill na zona do polegar com badge de status ativo, folha deslizante (Bottom Sheet) de filtros sob demanda e harmonização do filtro de Bimestre no Afunilamento 📱 |
| **1.02** | 21/10/2026 18:00 | `intermediárias/aplicativo_v102_pilar_8_foco_menores_indices_gargalos.html` | Deliberação SerTão Criança / Pilar 8 | Pilar 8: Diagnóstico de Prioridades Formativas, Bloco "Foco nos Menores Índices" (Gargalos), identificação automática dos 3 pontos críticos, alternador de ordenação (Consistência vs. Desvio Rede), pautas sugeridas, deep-linking para Afunilamento e cópia de pauta 🎯 |
| **1.01** | 21/10/2026 16:35 | `intermediárias/aplicativo_v101_pilar_7_extincao_metricas_burocraticas_kpis_decisorios.html` | Deliberação SerTão Criança / Pilar 7 | Pilar 7: Extinção dos cards burocráticos ("Observações Auditadas" e "Itens Válidos / N.A."), novo KPI em destaque de Cobertura no Bimestre Corrente, Meta do Ciclo Anual e Dimensão Prioritária (Gargalo) 🎯 |
| **1.00** | 21/10/2026 16:30 | `intermediárias/aplicativo_v100_pilar_6_higienizacao_terminologica_observacao.html` | Deliberação SerTão Criança / Pilar 6 | Pilar 6: Higienização terminológica mandatória, erradicação completa do vocábulo policialesco "visita" em 100% dos botões, rotas, relatórios e telas, padronização de "observação", renomeação de exportações e teste de conformidade no DOM 🧹 |
| **0.99** | 21/10/2026 15:45 | `intermediárias/aplicativo_v99_remocao_avisos_vinculacao_automatica_pessoal.html` | Deliberação SerTão Criança / UX Pessoal | Remoção de badges ("Auto via UE") e alertas informativos de vinculação automática na gestão de equipe & profissionais, com preservação funcional estrita da regra de negócio 🧹 |
| **0.98** | 21/10/2026 15:30 | `intermediárias/aplicativo_v98_pilar_5_fechamento_nominal_atribuicao_parcial.html` | Deliberação SerTão Criança / Pilar 5 | Pilar 5: Fechamento nominal por professor(a) regente, avaliação nas 5 dimensões estruturantes, atribuição mandatória com justificativa em itens parciais, destaque de boas práticas consistentes e exportação segregada de PDF 👥 |
| **0.97** | 21/10/2026 14:30 | `intermediárias/aplicativo_v97_simplificacao_modal_ocorrencias.html` | Solicitação direta / Pilar 1 | Simplificação radical do modal de ocorrências: eliminação de UE/Polo, Turma, Dimensão/Tópico e alerta azul redundante, com vinculação estrita à observação ativa 📝 |
| **0.96** | 21/10/2026 14:00 | `intermediárias/aplicativo_v96_remocao_avisos_orientacao_setup_pilar4.html` | Solicitação direta / Ajuste Fino Pilar 4 | Otimização visual da tela de setup: remoção da caixa informativa de unidade de análise e supressão de aviso textual no card de docentes regentes 🧹 |
| **0.95** | 20/10/2026 17:55 | `intermediárias/aplicativo_v95_auditoria_interativa_comportamental_end_to_end.html` | Solicitação direta / Simulação Comportamental Real | Reestruturação completa do motor de testes com simulação interativa de ponta a ponta (login, modais, selects e botões) 🤖 |
| **0.94** | 20/10/2026 17:45 | `intermediárias/aplicativo_v94_pilar_4_turmas_integrais_formulario_unico.html` | Deliberação SerTão Criança / Pilar 4 | Formulário único de Turma Integral em 2 Etapas (Manhã e Tarde), salvamento de etapa matutina, banner contextual na observação ativa, registro de período duplo na síntese com soma de carga horária e bloqueio de finalização prematura ☀️ |
| **0.93** | 20/10/2026 17:35 | `intermediárias/aplicativo_v93_correcao_selecao_unidade_novo_profissional.html` | Solicitação direta / Correção Operacional | Preservação da seleção de Unidade Escolar / Polo no modal de cadastro de novo profissional 🏫 |
| **0.92** | 20/10/2026 17:30 | `intermediárias/aplicativo_v92_pilar_3_benchmark_afunilamento_ue_vs_rede.html` | Deliberação SerTão Criança / Pilar 3 | Benchmark comparativo '% da UE vs. Rede' item a item no Afunilamento de Indicadores, régua dupla, categorização de deltas pedagógicos e agregação hierárquica canônica 📊 |
| **0.91** | 20/10/2026 16:30 | `intermediárias/aplicativo_v91_pilar_2_triade_governanca_e_nucleo_ei.html` | Deliberação SerTão Criança / Pilar 2 | Tríade Canônica de Governança em 3 Níveis, transição institucional para Coordenadora do Núcleo de EI (Helena Martins), helper canônico `isNucleoEI()` e blindagem RBAC 🏛️ |
| **0.90** | 20/10/2026 16:00 | `intermediárias/aplicativo_v90_ocorrencias_campo_turma_docente.html` | Deliberação SerTão Criança / Pilar 1 | Atribuição primária das ocorrências de campo à Turma da Educação Infantil, trava automática para docente único regente e escolha ativa para duplas 📚 |
| **0.89** | 20/10/2026 15:30 | `intermediárias/aplicativo_v89_visualizar_devolutiva_agenda.html` | Solicitação direta / Melhoria de Acesso Pedagógico na Agenda | Botão para visualização direta da devolutiva de observação a partir da aba de Agenda (desktop e mobile), vínculo resiliente findObservationForSchedule e retorno contextual 📋 |
| **0.1** | 06/10/2026 14:05 | `lepes-prototype.html` | Matriz conceitual LEPES | Protótipo conceitual inicial e escala de observação tripartite❌ |
| **0.2** | 06/10/2026 14:10 | `aplicativo_de_supervis_o_pedag_gica_sert_o_crian_a.html` | Diretrizes SerTão Criança | Escala de 4 opções (N/A), vetorização, drill-down e governança em 3 níveis❌ |
| **0.3** | 06/10/2026 14:37 | `aplicativo_de_supervis_o_pedag_gica_sert_o_crian_a (1).html` | `inputs/inputs_v3.txt` | Governança em 4 níveis, autenticação real, logout e turmas em lista❌ |
| **0.4** | 06/10/2026 15:09 | `aplicativo_de_supervis_o_pedag_gica_sert_o_crian_a (2).html` | `inputs/inputs_v4.txt` | Marca *SerTão Criança*, privacidade estrita de rascunhos, cronograma e importação CSV❌ |
| **0.5** | 06/10/2026 17:20 | `aplicativo_de_supervis_o_pedag_gica_sert_o_crian_a (4).html` | `inputs/inputs_v5.txt` | Ergonomia híbrida, bloqueio de autoavaliação, estabilização touch mobile e horários no rascunho❌ |
| **0.6** | 06/10/2026 17:41 | `aplicativo_de_supervis_o_pedag_gica_sert_o_crian_a (5).html` | `inputs/inputs_v6.txt` | Single Source of Truth (SSOT), exportação/importação JSON e aba Gestão Operacional✅ |
| **0.7** | 06/10/2026 17:59 | `aplicativo_v6.html` | `plano_navegacao_mobile.md` / `apply_menu_fix.py` | Redesenho da navegação móvel com Bottom Menu (4 itens) e modal deslizante "Mais Opções"❌ |
| **0.8** | 07/10/2026 14:38 | `aplicativo_v7.html` | `plano_ajustes_formadora_exportacao_vinculacao.md` / `plano_ajustes_coordenacao_ei.md` | Dinamização de escopo da Formadora, reatividade no cadastro e restauração da Home da Coordenação de EI✅ |
| **0.9** | 07/10/2026 15:18 | `aplicativo_v8.html` | `Instrumento de Acompanhamento...pdf` / `Seção 3.pdf` / `update_rubrics.py` | Sincronização integral e enriquecimento com as rubricas oficiais da Educação Infantil❌ |
| **0.10** | 07/10/2026 15:27 | `firebase_deploy/public/index.html` | `plano_fix_gestao_pedagogica_tecnico.md` / `plano_atualizacao_changelog_v610.md` | Restauração do menu operacional da Equipe Técnica, consolidação do changelog oficial e deploy online❌ |
| **0.11** | 07/10/2026 16:04 | `intermediárias/aplicativo_v9.html` | `planos_de_implementacao/plano_ajustes_abas_e_exportacao.md` | Consolidação da navegação de Gestão (remoção de abas superiores redundantes) e exportação parametrizada de rubricas (Professores vs Coordenadores)❌ |
| **0.12** | 07/10/2026 16:25 | `intermediárias/aplicativo_v10.html` | `planos_de_implementacao/plano_exclusao_cargo_coordenacao_ei.md` | Exclusão do cargo de Coordenação da EI como perfil avaliador autônomo e incorporação integral ao acesso de Equipe Técnica❌ |
| **0.13** | 07/10/2026 16:35 | `intermediárias/aplicativo_v11.html` | `planos_de_implementacao/plano_desacoplamento_rubricas_aba_dedicada.md` | Desacoplamento da Matriz de Rubricas da 1ª aba de Gestão para tela dedicada autônoma (Screen 11 / #screenRubricsAdmin)❌ |
| **0.14** | 07/10/2026 16:45 | `intermediárias/aplicativo_v6.5_matrizes_pdf.html` | `planos_de_implementacao/plano_download_rubricas_referencia.md` | Disponibilização para download e visualização das matrizes originais em PDF❌ |
| **0.15** | 07/10/2026 17:15 | `intermediárias/aplicativo_v12.html` | `planos_de_implementacao/plano_implementacao_tela_login.md` | Implementação de tela de login autêntica (e-mail e senha) com mock credentials e feedback de erro❌ |
| **0.16** | 07/10/2026 17:30 | `intermediárias/aplicativo_v13.html` | `planos_de_implementacao/plano_base_de_dados_unica_20261007.md` | Unificação da base de usuários e credenciais em `USERS_DB`, remoção de `mockCredentials` e refatoração de login✅ |
| **0.17** | 07/10/2026 17:35 | `intermediárias/aplicativo_v14.html` | `planos_de_implementacao/plano_edicao_profissional.md` | Edição e exclusão modal de profissionais da equipe pedagógica com vínculo dinâmico✅ |
| **0.18** | 07/10/2026 17:50 | `intermediárias/aplicativo_v18_criacao_contas.html` | `planos_de_implementacao/plano_criacao_contas_e_usuario_bruno.md` | Criação autônoma de contas e usuário administrador (Bruno)✅ |
| **0.19** | 07/10/2026 18:02 | `intermediárias/aplicativo_v19_remocao_escolha_cargo.html` | `planos_de_implementacao/plano_remocao_escolha_cargo_cadastro.md` | Remoção da escolha de perfil no cadastro e governança de contas com acesso pendente✅ |
| **0.20** | 08/10/2026 13:35 | `intermediárias/aplicativo_v20_remover_itens_didatica_coordenacao.html` | `planos_de_implementacao/plano_remover_itens_didatica_coordenacao.md` | Ocultação condicional de didática em síntese de coordenadores e reenumeração de parecer✅ |
| **0.21** | 08/10/2026 13:58 | `intermediárias/aplicativo_correcao_acessos.html` | `planos_de_implementacao/plano_correcao_acessos.md` | Correção de acessos de sessão, reset global de UI e cargo de professora✅ |
| **0.22** | 08/10/2026 14:20 | `intermediárias/aplicativo_v22_modo_edicao_rubricas.html` | `planos_de_implementacao/plano_modo_edicao_rubricas.md` | Proteção da Matriz de Rubricas, modo de edição com bloqueio de textareas e confirmação de restauração✅ |
| **0.23** | 08/10/2026 14:25 | `intermediárias/aplicativo_v23_validacao_email_registro.html` | `planos_de_implementacao/plano_validacao_email_registro.md` | Bloqueio de duplicidade de e-mail no auto-cadastro de usuários e orientação para fluxo de recuperação✅ |
| **0.24** | 08/10/2026 14:35 | `intermediárias/aplicativo_v24_confirmacoes_salvamento.html` | `planos_de_implementacao/plano_confirmacoes_salvamento_rubricas_gestao.md` | Confirmações explícitas de salvamento, remoção e importação nos módulos de Gestão e Rubricas✅ |
| **0.25** | 08/10/2026 14:55 | `intermediárias/aplicativo_v25_modificacao_formador_coordenador.html` | `planos_de_implementacao/plano_modificacao_formador_coordenador.md` | Dinamização da alocação de Formadores por Polo e vinculação real de Formadoras a Coordenadores✅ |
| **0.26** | 08/10/2026 15:05 | `intermediárias/aplicativo_v26_edicao_cronograma.html` | `planos_de_implementacao/plano_edicao_cronograma.md` | Edição de agendamento no Cronograma Longitudinal e modal adaptativo com atualização in-place✅ |
| **0.27** | 08/10/2026 15:10 | `intermediárias/aplicativo_v27_botoes_topo_mobile.html` | `planos_de_implementacao/plano_botoes_topo_mobile.md` | Correção do alinhamento responsivo da barra superior no mobile (UI/UX Hotfix Mobile)✅ |
| **0.28** | 08/10/2026 15:25 | `intermediárias/aplicativo_v28_ajuste_header_mobile.html` | `planos_de_implementacao/plano_ajuste_header_mobile.md` | Ajuste de layout do header mobile em linha única e inclusão do changelog no menu deslizante✅ |
| **0.29** | 08/10/2026 15:30 | `intermediárias/aplicativo_v29_correcao_acessos_pendentes.html` | `planos_de_implementacao/plano_correcao_acessos_pendentes.md` | Correção de atribuição de função e visibilidade para usuários pendentes✅ |
| **0.30** | 08/10/2026 15:45 | `intermediárias/aplicativo_v30_compressao_fotos.html` | `planos_de_implementacao/plano_compressao_fotos.md` | Compressão de imagens via Canvas no anexo de fotos e proteção de salvamento local✅ |
| **0.31** | 08/10/2026 15:50 | `intermediárias/aplicativo_v31_atribuicao_cargos_definitivo.html` | `planos_de_implementacao/plano_atribuicao_cargos_definitivo.md` | Atribuição definitiva de cargos, campos de login no cadastro manual e sincronização geral✅ |
| **0.32** | 08/10/2026 15:58 | `intermediárias/aplicativo_v32_exibicao_email.html` | `planos_de_implementacao/plano_exibicao_email.md` | Exibição e edição opcional de e-mails na Gestão de Equipe e perfil do usuário✅ |
| **0.33** | 08/10/2026 16:20 | `intermediárias/aplicativo_v33_troca_senha_obrigatoria.html` | `planos_de_implementacao/plano_login_conta_gestor_e_senha_provisoria.md` | Login com conta criada pelo gestor e troca obrigatória de senha no primeiro acesso✅ |
| **0.34** | 08/10/2026 16:48 | `intermediárias/aplicativo_v34_vinculacao_automatica_ocorrencia.html` | `planos_de_implementacao/plano_vinculacao_automatica_ocorrencia.md` | Vinculação automática de ocorrências de campo à observação ativa e bloqueio de seletores✅ |
| **0.35** | 08/10/2026 17:10 | `intermediárias/aplicativo_v35_correcao_cronograma.html` | `planos_de_implementacao/plano_correcao_cronograma.md` | Correção do escopo de visitas do cronograma para formadoras com base na relação Unidade ↔ Polo✅ |
| **0.36** | 08/10/2026 17:15 | `intermediárias/aplicativo_v36_definir_novo_padrao_rubricas.html` | `planos_de_implementacao/plano_botao_definir_novo_padrao_rubricas.md` | Botão 'Definir Novo Padrão' em Rubricas e persistência de padrão customizado da rede✅ |
| **0.37** | 08/10/2026 17:35 | `intermediárias/aplicativo_v37_edicao_unidades_polos.html` | `planos_de_implementacao/plano_edicao_unidades_polos.md` | Edição de Unidades Escolares / Polos, gestão de endereços opcionais e integridade relacional✅ |
| **0.38** | 08/10/2026 17:55 | `intermediárias/aplicativo_v38_rascunhos_verticais_mobile.html` | `planos_de_implementacao/plano_rascunhos_verticais_mobile.md` | Enfileiramento vertical de rascunhos no mobile (Nx1) e correção de overflow lateral✅ |
| **0.39** | 09/10/2026 13:25 | `intermediárias/aplicativo_v39_arquivar_visitas_cronograma.html` | `planos_de_implementacao/plano_arquivar_visitas_cronograma.md` | Arquivamento individual e em lote de visitas realizadas no cronograma com filtro de status✅ |
| **0.40** | 09/10/2026 14:15 | `intermediárias/aplicativo_v40_correcao_importacao_equipe_hard_users.html` | `planos_de_implementacao/plano_correcao_importacao_equipe_hard_users.md` | Correção da importação CSV de servidores, parser inteligente de cabeçalhos e resolução canônica de hard users✅ |
| **0.41** | 09/10/2026 14:40 | `intermediárias/aplicativo_v41_auto_arquivamento_4_dias.html` | `planos_de_implementacao/plano_auto_arquivamento_4_dias_observacoes_ocorrencias.md` | Auto-arquivamento temporal de 4 dias para observações e ocorrências, gestão individual e em lote de arquivamento e contadores reativos✅ |
| **0.42** | 09/10/2026 14:50 | `intermediárias/aplicativo_v42_ajuste_pdf_fotos.html` | `planos_de_implementacao/plano_ajuste_pdf_fotos.md` | Expansão proporcional de fotos anexadas no PDF e ocultação de controles de ação fotográfica✅ |
| **0.43** | 09/10/2026 15:00 | `intermediárias/aplicativo_v43_exportacao_usuarios_emails_protegidos.html` | `planos_de_implementacao/plano_exportacao_usuarios_emails_protegidos.md` | Exportação CSV de servidores com coluna E-mail, sanitização estrita de senhas em JSONs e importação resiliente✅ |
| **0.44** | 09/10/2026 15:00 | `intermediárias/aplicativo_v44_print_completo_devolutiva.html` | `planos_de_implementacao/plano_print_completo_devolutiva.md` | Impressão consolidada do formulário de observação e devolutiva completa em PDF✅ |
| **0.45** | 09/10/2026 15:10 | `intermediárias/aplicativo_v45_bugfix_agendamento_longitudinal.html` | `planos_de_implementacao/plano_bugfix_agendamento_longitudinal.md` | Correção do escopo de unidades permitidas no agendamento do cronograma longitudinal para formadores✅ |
| **0.46** | 09/10/2026 15:30 | `intermediárias/aplicativo_v46_indicadores_duplo_lancamento.html` | `planos_de_implementacao/plano_duplo_lancamento.md` | Segmentação da matriz no Painel de Indicadores (Professores vs Coordenadores) e bloqueio de duplo lançamento no mesmo bimestre✅ |
| **0.47** | 12/10/2026 16:45 | `intermediárias/aplicativo_v47_trava_horario.html` | Solicitação direta | Validação de consistência de horário em observações de campo com bloqueio e toast de aviso✅ |
| **0.48** | 12/10/2026 17:15 | `intermediárias/aplicativo_v48_trava_sequencia_bimestres.html` | Solicitação direta / Workflow macOS | Trava sequencial de bimestres no ciclo longitudinal (bloqueio de salto bimestral sem bimestre anterior concluído) e feedback reativo na configuração✅ |
| **0.49** | 12/10/2026 17:25 | `intermediárias/aplicativo_v49_blindagem_ocorrencias_sintese.html` | `planos_de_implementacao/plano_blindagem_ocorrencias_sintese.md` | Blindagem estrita de ocorrências na síntese, bloqueio de notas genéricas de terceiros e travamento contextual de profissional✅ |
| **0.50** | 14/10/2026 14:15 | `intermediárias/aplicativo_v50_dinamizacao_metricas_avaliandos.html` | `planos_de_implementacao/plano_atualizacao_dinamica_metricas_avaliandos.md` | Dinamização reativa de métricas, cobertura e tabela longitudinal no Painel & Indicadores por avaliando✅ |
| **0.51** | 14/10/2026 14:30 | `intermediárias/aplicativo_v51_remocao_versao_cabecalho.html` | `planos_de_implementacao/plano_remocao_versao_cabecalho.md` | Higienização do cabeçalho institucional com remoção do sufixo residual '· v4.0'✅ |
| **0.52** | 14/10/2026 15:45 | `intermediárias/aplicativo_v52_desvinculacao_unidade_indicadores.html` | `planos_de_implementacao/plano_desvinculacao_unidade_indicadores.md` | Desvinculação e isolamento estrito de unidades e profissionais ao mover servidores de unidade e seletor de UE no Painel & Indicadores✅ |
| **0.53** | 14/10/2026 15:45 | `intermediárias/aplicativo_v53_bloqueio_data_futura_observacao.html` | Solicitação direta / Workflow macOS | Bloqueio rigoroso de observações em datas futuras, ajuste inteligente de agendamentos no cronograma e blindagem na síntese final✅ |
| **0.54** | 14/10/2026 16:00 | `intermediárias/aplicativo_v54_bloqueio_ocorrencia_docente_nao_avaliado.html` | `planos_de_implementacao/plano_bloqueio_ocorrencia_docente_nao_avaliado.md` | Bloqueio rigoroso de ocorrências de campo para docentes não avaliados e integridade da supervisão pedagógica✅ |
| **0.55** | 14/10/2026 16:30 | `intermediárias/aplicativo_v55_exportacao_fotos_sintese_pdf.html` | Solicitação direta / Workflow macOS | Renderização integral de fotos anexadas no PDF da síntese, galeria interativa de evidências em tela, comentários vinculados e otimização de armazenamento✅ |
| **0.56** | 14/10/2026 17:00 | `intermediárias/aplicativo_v56_correcao_exportacao_respostas_avaliacao_pdf.html` | Solicitação direta / Workflow macOS | Correção crítica do mapeamento de respostas na exportação da avaliação para PDF (fim do bug "Sem resposta"), badges cromáticos e identificação oficial no topo do relatório✅ |
| **0.57** | 14/10/2026 17:30 | `intermediárias/aplicativo_v57_extracao_longitudinal_professor.html` | Solicitação direta / Workflow macOS | Extração longitudinal individual de docentes no Painel & Indicadores, comparativo item a item de rubricas com badges de tendência, e exportação em PDF e CSV✅ |
| **0.57** | 14/10/2026 17:45 | `intermediárias/aplicativo_v57_bloqueio_filtro_indicadores_coordenador.html` | Solicitação direta / Workflow macOS | Bloqueio de filtro por indicadores de coordenadores para perfil coordenador, badge fixo de contexto docente e blindagem de escopo✅ |
| **0.58** | 14/10/2026 17:15 | `intermediárias/aplicativo_v58_hyperlinks_logos_institucionais.html` | `planos_de_implementacao/plano_hyperlinks_logos_institucionais.md` | Hiperlinks nos logotipos institucionais (Instagram do ST Criança, Portal da Prefeitura de Patos e LEPES) com abertura segura em nova aba✅ |
| **0.58** | 14/10/2026 18:00 | `intermediárias/aplicativo_v58_gestao_autonoma_rubricas_upload_pdf.html` | Solicitação direta / Governança autônoma municipal | Gestão autônoma e descentralizada da matriz de rubricas (CRUD de dimensões e critérios, modo de edição travado, confirmações de segurança, sincronização SSOT, exportação/importação JSON e CSV) e upload autônomo de PDFs de referência via IndexedDB✅ |
| **0.59** | 14/10/2026 18:30 | `intermediárias/aplicativo_v59_confirmacao_exclusao_rascunho_entrevista.html` | Solicitação direta / Workflow macOS | Caixa modal de confirmação para exclusão de rascunhos de entrevista (coordenação) e observação (docente), com sumário contextual de dados e prevenção contra perda acidental✅ |
| **0.60** | 14/10/2026 19:00 | `intermediárias/aplicativo_v60_numeracao_dinamica_itens_rubricas.html` | Solicitação direta / Workflow macOS | Numeração dinâmica e reindexação sequencial contínua da matriz de rubricas (deslocamento harmônico de itens na adição e exclusão, integridade relacional de rascunhos) e exibição condicional da tarja de somente leitura✅ |
| **0.62** | 14/10/2026 20:00 | `intermediárias/aplicativo_v62_ocultacao_botao_salvar_rascunho_devolutiva.html` | Solicitação direta / Workflow macOS | Ocultação estrita do botão "Salvar Rascunho" na visualização de devolutivas (observações finalizadas), adição de botão contextual de retorno ao histórico e blindagem defensiva✅ |
| **0.63** | 14/10/2026 22:10 | `intermediárias/aplicativo_v63_limpeza_visual_tela_inicial.html` | `planos_de_implementacao/plano_limpeza_visual_tela_inicial.md` | Limpeza visual e minimalismo da tela inicial (coordenação e formadora): exibição exclusiva do usuário com botão nova observação, rascunhos full-width e próximas visitas agendadas, suprimindo avisos, botões redundantes e coluna secundária✅ |
| **0.87** | 20/10/2026 15:10 | `intermediárias/aplicativo_v87_auditoria_modular_integral_e_workflows.html` | Solicitação direta / `plano_auditoria_modular_integral_e_workflows.md` | Arquitetura modular da suíte de auditoria (12 módulos modo-a-modo · 100% de cobertura), parametrização CLI/URL em `audit_platform.py`, formalização de regras de auditoria nos workflows e execução silenciosa pós-deploy 🔬 |
| **0.86** | 20/10/2026 14:30 | `intermediárias/aplicativo_v86_algoritmo_verificacao_integral_e_correcao_bugs.html` | Solicitação direta / `plano_algoritmo_verificacao_integral_e_correcao_bugs.md` | Algoritmo de auditoria e verificação ponta a ponta (10 baterias determinísticas), script CLI `audit_platform.py` com headless Chrome, correção global de 8 bugs em Indicadores, Histórico, Cronograma, RBAC e resiliência DOM 🔬 |
| **0.88** | 20/10/2026 15:15 | `intermediárias/aplicativo_v88_registro_manual_horarios_observacao.html` | Deliberação Equipe SerTão Criança / `plano_registro_manual_horarios_observacao.md` | Eliminação da sobrescrita automática de horários em `finalizeObservation()`, inputs editáveis no setup e na síntese, recálculo dinâmico da duração e validação de consistência temporal ⏱️ |
| **0.87** | 20/10/2026 14:30 | `intermediárias/aplicativo_v87_atribuicao_agendamento_turma.html` | Deliberação Equipe SerTão Criança / `plano_pilar_1_inversao_unidade_analise_turma.md` | Atribuição, agendamento e início de observação por turma no Pilar 1, vínculo da equipe docente titular e auditoria modular 🏫 |
| **0.86** | 20/10/2026 14:10 | `intermediárias/aplicativo_v86_auditoria_modular.html` | Deliberação Equipe SerTão Criança / `plano_auditoria_modular_workflows.md` | Arquitetura modular da suíte de auditoria (12 módulos determinísticos modo-a-modo) e atualização normativa de workflows 🔬 |
| **0.85** | 20/10/2026 13:50 | `intermediárias/aplicativo_v85_pilar_1_inversao_unidade_analise_turma.html` | Deliberação Equipe SerTão Criança / `plano_pilar_1_inversao_unidade_analise_turma.md` | Inversão da unidade de análise para a TURMA (Educação Infantil), catálogo canônico `INITIAL_CLASSES`, exibição da equipe regente titular, reestruturação das travas de duplo lançamento e avanço longitudinal por turma, e cobertura de turmas em Indicadores 🏫 |
| **0.84** | 16/10/2026 13:55 | `intermediárias/aplicativo_v84_correcao_reference_error_getnowtimestring.html` | Solicitação direta / Correção de bug crítico | Correção do ReferenceError getNowTimeString, implementação do helper HH:mm, leitura resiliente de campos de formulário (#setupDate, #setupStartTime, #setupEndTime) e restauração da trava temporal em startNewObservation() ⚡ |
| **0.83** | 15/10/2026 17:45 | `intermediárias/aplicativo_v83_ajuste_indicadores_coordenador_e_formadora.html` | Solicitação direta / Ajuste de Indicadores e Governança | Remoção do bloco de Público-Alvo ('Indicadores Docentes') para coordenação e restauração do público-alvo padrão 'Professores(as)' na formadora com dados ativos (sem zeramento) 📊 |
| **0.82** | 15/10/2026 17:30 | intermediárias/aplicativo_v82_ajuste_layout_datas_historico.html | Solicitação direta / Correção de layout mobile | Enquadramento responsivo e gap perfeito de 10px nos campos de Data Inicial e Final no Histórico sem transbordamento no iOS Safari 📅 |
| **0.81** | 15/10/2026 17:15 | `intermediárias/aplicativo_v81_destaque_proxima_visita_agenda.html` | Solicitação direta / Melhoria de Agenda | Destaque e segregação visual da próxima visita na Agenda com identificador rápido e card hero |
| **0.80** | 15/10/2026 16:05 | `intermediárias/aplicativo_v80_apagar_rascunho_ao_sair_sem_salvar.html` | Solicitação direta / Correção de Fluxo de Rascunhos | Exclusão e descarte definitivo de rascunho de avaliação ao clicar em 'Sair sem Salvar', preservando a integridade da Home e mantendo o salvamento em todos os outros casos 🗑️ |
| **0.79** | 15/10/2026 15:45 | `intermediárias/aplicativo_v79_abas_icones_painel_indicadores.html` | Solicitação direta / Ergonomia Mobile | Abas com ícones no painel de indicadores (seletor segmentado em grade de 3 colunas iguais, 100% visível no mobile sem necessidade de arrastar/deslizar a tela) 📱 |
| **0.78** | 15/10/2026 15:30 | `intermediárias/aplicativo_v78_subabas_painel_indicadores.html` | Solicitação direta / Painel de Indicadores & Governança | Sub-abas no painel de indicadores (substituição da rolagem vertical longa por segmented pills) e público-alvo inicial configurado para coordenadores(as) para a formadora pedagógica 📑 |
| **0.77** | 15/10/2026 15:05 | `intermediárias/aplicativo_v77_restricao_agenda_formador_preservacao_home.html` | Solicitação direta / Regra de Governança | Restrição estrita da agenda de formadores a coordenadoras (exclusão definitiva de professoras do cronograma) e preservação contínua da agenda na aba início 👩‍🏫 |
| **0.76** | 15/10/2026 14:55 | `intermediárias/aplicativo_v76_correcao_desarquivamento.html` | Solicitação direta / Correção de auto-arquivamento | Correção e blindagem do desarquivamento e arquivamento de ocorrências e aplicações/observações (prevalência da flag manuallyUnarchived sobre a regra temporal de 4 dias) 📥 |
| **0.75** | 15/10/2026 14:45 | `intermediárias/aplicativo_v75_correcao_aba_agenda.html` | Solicitação direta / Correção de escopo JS | Correção crítica de escopo na renderização da aba Agenda (declaração de user em renderScheduleScreen e restauração da tela) 🐛 |
| **0.74** | 15/10/2026 14:25 | `intermediárias/aplicativo_v74_redesenho_escala_materiais.html` | Solicitação direta / Painel de Visualização | Redesenho estruturado e destacado do bloco de Escala de Materiais (nível em 28px bold com 'de 4', pill tag de categoria, régua segmentada em 4 níveis e alinhamento perfeito na linha de KPIs) 🎨 |
| **0.73** | 15/10/2026 14:30 | `intermediárias/aplicativo_v73_restricao_observacao_formadora_coordenadora.html` | Solicitação direta / Regra Canônica de Supervisão | Restrição estrita de observação docente a coordenadoras, blindagem avaliativa para formadoras e preservação de dados em cascata 👩‍🏫 |
| **0.72** | 15/10/2026 14:15 | `intermediárias/aplicativo_v72_remocao_titulos_dimensao_subdimensao.html` | Solicitação direta / Padronização Geral | Padronização direta dos nomes de Dimensões e Subdimensões em todos os painéis e para todos os usuários, eliminando os prefixos repetitivos "Dimensão" e "Subdimensão" (ex: "2. Gestão do Grupo" e "2.1 Tempo e Rotina") 🏷️ |
| **0.71** | 15/10/2026 13:55 | `intermediárias/aplicativo_v71_destaque_evolucao_consistencia.html` | Solicitação direta / Painel de Visualização | Destaque e aproveitamento integral do bloco de Evolução de Consistência (divisão uniforme em 4 quadrantes para os bimestres, tipografia ampliada de alto impacto de até 24px bold e sinalização cromática contextual) 📊 |
| **0.70** | 15/10/2026 13:30 | `intermediárias/aplicativo_v70_ajuste_proporcao_datas_mobile.html` | `planos_de_implementacao/plano_ajuste_proporcao_datas_mobile.md` | Compactação e enquadramento definitivo dos campos de data no mobile (ajuste em pseudo-elementos WebKit/iOS, equalização exata com blocos de Turma e Bimestre sem ultrapassar a margem direita) 📅 |
| **0.69** | 15/10/2026 13:25 | `intermediárias/aplicativo_v69_correcao_borda_cortada_datas.html` | `planos_de_implementacao/plano_correcao_borda_cortada_datas.md` | Restauração da borda direita dos campos de data no mobile (remoção de overflow hidden, grid com minmax(0, 1fr) e reset de margem do indicador WebKit) 📐 |
| **0.68** | 15/10/2026 13:20 | `intermediárias/aplicativo_v68_ajuste_datas_mobile.html` | `planos_de_implementacao/plano_ajuste_tamanho_campos_data_mobile.md` | Dimensionamento rigoroso dos campos de Data Inicial e Final no mobile (box-sizing border-box, min-width 0, altura padronizada em 38px e contenção total sem transbordamento) 📅 |
| **0.67** | 15/10/2026 13:15 | `intermediárias/aplicativo_v67_botoes_justificados_csv_pdf.html` | `planos_de_implementacao/plano_alinhamento_justificado_botoes_csv_pdf.md` | Harmonização, alinhamento e justificação dos botões de exportação (rotulagem concisa CSV e PDF, card unificado `.history-toolbar-card` e distribuição simétrica 100% justificada) 📐 |
| **0.66** | 15/10/2026 13:00 | `intermediárias/aplicativo_v66_mobile_historico_notas_matrizes.html` | `planos_de_implementacao/plano_ajustes_mobile_historico_notas_matrizes.md` | Reorganização responsiva e ergonomia mobile: chave segmentada 100% e grade de filtros em 2 colunas no Histórico, botão principal full-width e toolbar estruturada no Bloco de Notas, e grade simétrica de ações (50%/50%) no modal de Matrizes de Referência 📑 |
| **0.65** | 15/10/2026 12:45 | `intermediárias/aplicativo_v65_ajuste_layout_agenda_mobile.html` | `planos_de_implementacao/plano_ajuste_layout_agenda_mobile.md` | Reorganização simétrica de filtros da agenda no celular (50%/50% e botão 100%), botão de agendamento em destaque, simplificação do título, exclusão do subtítulo e remoção do contador do cabeçalho superior✅ |


---

## Detalhamento Integral das Versões

### [Versão 1.34] - Trava de Visualização Desktop, Eliminação de Transbordo Horizontal e Blindagem da Viewport
- **Data / Horário:** 27/10/2026 13:05
- **Arquivo de Referência:** `intermediárias/aplicativo_v134_trava_visualizacao_desktop_e_eliminacao_scroll_horizontal.html`
- **Origem / Insumos Principais:** Solicitação direta / `planos_de_implementacao/plano_trava_visualizacao_desktop_e_eliminacao_scroll_horizontal.md`.
- **Foco Central:** Resolução definitiva da mobilidade e destravamento visual da página no computador. Aplicação de trava absoluta na raiz (`html, body`), eliminação do efeito elástico (*rubber-band bounce*) no macOS/trackpad, compactação ergonômica da barra superior desktop em telas de 860px a 1400px e blindagem da tag `<meta name="viewport">` contra zoom livre.

#### Inclusões e Blindagens
- **Trava Estrutural Raiz (`html, body`):** Definição estrita de `width: 100%`, `max-width: 100vw`, `overflow-x: hidden`, `overscroll-behavior-x: none` e `touch-action: pan-y`, garantindo estabilidade milimétrica do viewport em computadores pessoais e portáteis.
- **Compactação Ergonômica do Cabeçalho Desktop (860px a 1400px):** Regras de mídia de alta densidade reduzindo padding e gaps das abas `.nav-link`, redimensionando harmoniosamente a marca e truncando rótulos longos de perfil (`.role-badge-btn`), impedindo que a barra superior extrapole os limites horizontais da tela.
- **Blindagem da Viewport contra Zoom Gestual:** Inclusão de `maximum-scale=1.0, user-scalable=no, viewport-fit=cover` na tag `<meta name="viewport">`, impedindo desencaixe da interface em gestos acidentais de pinça no trackpad.
- **Prevenção de Arraste de Elementos:** Aplicação de `-webkit-user-drag: none; user-select: none;` no logotipo e barras de navegação.
- **Confinamento de Tabelas Matriciais:** Estrita contenção de rolagem lateral nas visualizações matriciais desktop (`.semaphore-table-view`, `.schedule-table-view`).
- **Auditoria Modular In-App (`navegacao_layout`):** Asserções automáticas determinísticas conferindo ausência de transbordo (`scrollWidth <= innerWidth + 2`), estilos computados de trava e integridade do registro da Versão 1.34.

---

### [Versão 1.33] - Apresentação de Dados Orientada ao Processo Decisório dos Gestores
- **Data / Horário:** 26/10/2026 17:55
- **Arquivo de Referência:** `intermediárias/aplicativo_v133_apresentacao_dados_decisao_gestores.html`
- **Origem / Insumos Principais:** Solicitação direta / `planos_de_implementacao/plano_apresentacao_dados_processo_decisorio_gestores.md`.
- **Foco Central:** Reorganização e enriquecimento da apresentação de dados para apoio à decisão nos três níveis de gestão (Núcleo de EI, Formadoras e Coordenação Pedagógica), garantindo apresentação pura de dados matemáticos sem juízos de valor artificiais.

#### Modificações
- **Governança Territorial por Polos:** Agrupamento semântico por Polo Regional (`<optgroup>`) no seletor de Unidades Escolares (`#indicatorsUnitFilter`) para a perspectiva do Núcleo de EI.
- **Tabela Executiva de UEs:** Apresentação comparativa consolidada de Cobertura Bimestral e Consistência Geral por Unidade Escolar (`.ue-executive-table`) com ação rápida "Focar UE ➔" para o Núcleo e Formadoras.
- **Régua Horizontal das Grandes Dimensões:** Mini-painel visual (`.dim-summary-card`) sintetizando a consistência das grandes dimensões curriculares versus o Referencial da Rede Municipal.
- **Síntese Agregada da Escala de Materiais:** Distribuição dos 4 níveis de materiais pedagógicos (`.materials-aggregate-card`) visível na visão geral docente da escola/rede.
- **Prioridades Formativas Balanceadas:** Alternador em 3 modos (`calculateTopCriteria`): Menor Consistência (Prioridades), Maior Desvio vs. Rede e Maior Consistência (Práticas Consolidadas/Pontos Fortes).
- **Gaveta Retrátil de Turmas Pendentes:** Lista rápida de turmas pendentes no Card 2 de Cobertura com botão de agendamento direto (`quickScheduleForClass`).
- **Navegação Eficiente na Matriz de Critérios:** Campo de busca textual instantânea (`#drilldownSearchInput`), botões de expansão/recolhimento global e chips de filtro por consistência.
- **Auditoria Modular Aprimorada:** Inclusão de 6 novos testes automatizados no módulo `indicadores_decisao` com 100% de conformidade.

---

### [Versão 1.32] - Adequação Contextual do Banner na Visualização por Dimensão (Rede Consolidada)
- **Data / Horário:** 26/10/2026 17:45
- **Arquivo de Referência:** `intermediárias/aplicativo_v132_adequacao_banner_rede_consolidada.html`
- **Origem / Insumos Principais:** Solicitação direta / `planos_de_implementacao/plano_adequacao_banner_rede_consolidada.md`.
- **Foco Central:** Adequação pedagógica e contextual do banner informativo (`.benchmark-info-bar`) na sub-aba Visualização por Dimensão (`#indicatorsSectionDrilldown`), diferenciando a exibição em Rede Consolidada (eliminando a redundância "comparando rede com rede" em prol do panorama consolidado e badge orientador para seleção de escola) da visualização em Escopo Focal (Unidade Escolar ou Polo), preservando integralmente o cálculo matemático das réguas duplas e dos Deltas ($\Delta \pm\%$).

#### Modificações
- **Banner Informativo na Visualização por Dimensão (`renderIndicatorsScreen`):**
  - Quando for visão ampla de *Rede Consolidada*, exibe: `Panorama Geral da Rede Municipal: Exibindo a média consolidada de Patos/PB ([N] observação(ões) na base)` acompanhado de badge orientador `💡 Selecione uma Escola no filtro para comparar com a Rede`.
  - Quando for escopo específico (Unidade Escolar ou Polo Regional), preserva a redação comparativa ativa: `Referencial da Rede Municipal: Comparando [Escola/Polo] com a Média Geral da Rede Municipal ([N] observação(ões) na base)`.
- **Auditoria Modular In-App (`indicadores_decisao`):** Validação resiliente que aceita tanto o rótulo focado quanto o de panorama consolidado, com barreira contra termos corporativos residuais.
- **Registro Duplo de Versão:** Atualização para a Versão 1.32 no botão `.btn-changelog`, `#modalChangelog` e testes de integridade em `navegacao_layout`.

---

### [Versão 1.31] - Substituição de Emojis nos Botões Principais por Pictogramas Vetoriais (SVGs)
- **Data / Horário:** 26/10/2026 17:40
- **Arquivo de Referência:** `intermediárias/aplicativo_v131_substituicao_emojis_botoes_por_pictogramas.html`
- **Origem / Insumos Principais:** Solicitação direta / `planos_de_implementacao/plano_substituicao_emojis_botoes_por_pictogramas.md`.
- **Foco Central:** Substituição de emojis Unicode nos botões principais, sub-abas de navegação, barras de ferramentas e ações em lote da plataforma por pictogramas vetoriais SVG inline monocromáticos (`viewBox="0 0 24 24" fill="none" stroke="currentColor"`), eliminando disparidades de renderização gráfica entre sistemas operacionais (macOS, Windows, Android) e elevando a sobriedade institucional do sistema de supervisão do Núcleo de EI.

#### Inclusões
- **Classes Utilitárias de Pictogramas (`.btn-icon`, `.btn-icon-sm`, `.btn-icon-lg`, `.tab-icon-svg`):** Padronização das dimensões (16x16px para botões padrão, 13-14px para botões compactos/badges e 18x18px para botões de destaque/sub-abas) com herança dinâmica de cor via `currentColor`.

#### Modificações
- **Cabeçalho Principal:** Substituição do emoji 📌 no botão `.btn-changelog` pelo SVG canônico de Tag e do emoji 📑 no `#headerRefDocsBtn` pelo SVG de Livro.
- **Sub-abas da Gestão da Rede (`#pedagNavSubTabs`):** Transição de emojis (🏢, 🏫, 👥, 📊) para SVGs de Prédio, Grid/Turmas, Usuários e Gráfico de Barras.
- **Sub-abas do Painel de Indicadores (`#indicatorsSubTabsNav`):** Transição de emojis (📊, 🚦, 🔍) para SVGs de Gráfico, Atividade/Linha e Lupa (`.tab-icon-svg`).
- **Ações de Dados da Rede e SSOT:** Substituição de emojis (💾, 📄, 📥, 📤, 📂, 📅, 🌟) nos botões de exportação/importação de UEs, Servidores, Base SSOT, Ciclos e Novo Ano Letivo por pictogramas vetoriais.
- **Histórico e Registros Formativos:** Atualização dos botões de exportação CSV, PDF, Limpar Filtros, Auto-Arquivar e Marcar como Conversado.
- **Matrizes e Rubricas:** Atualização dos botões de exportação, importação, padrão de rubricas e árvore hierárquica (Inserir Antes, Renomear, Subdimensão, Adicionar Item, Excluir).
- **Ações da Observação e Cronograma:** Substituição de emojis no menu flutuante FAB (Salvar Rascunho, Ocorrência, Sair), anexo de fotos, salvar turno matutino, exportação de síntese e botões de linha (Devolutiva, Editar, Excluir).

---

### [Versão 1.30] - Higienização Terminológica: Substituição de "Benchmark" por "Referencial da Rede Municipal"
- **Data / Horário:** 26/10/2026 17:30
- **Arquivo de Referência:** `intermediárias/aplicativo_v130_substituicao_benchmark_por_referencial_rede.html`
- **Origem / Insumos Principais:** Solicitação direta / `planos_de_implementacao/plano_substituicao_benchmark_por_referencial_rede.md`.
- **Foco Central:** Higienização terminológica pedagógica na sub-aba Visualização por Dimensão e na pauta diagnóstica, substituindo a expressão corporativa em inglês "Benchmark" por "Referencial da Rede Municipal" e "Referencial comparativo", preservando integralmente a matemática dos Deltas ($\Delta \pm\%$), réguas comparativas e asserções estritas de auditoria in-app.

#### Modificações
- **Subtítulo da Visualização por Dimensão (`#indicatorsSectionDrilldown`):** Substituição de *"Benchmark comparativo..."* por *"Referencial comparativo item a item entre a sua Unidade Escolar e a Média da Rede Municipal de Patos"*.
- **Banner Informativo Contextual (`.benchmark-info-bar`):** Atualização do texto em destaque para `<strong>Referencial da Rede Municipal:</strong> Comparando <strong>${scopeLabelText}</strong> com a <strong>Média Geral da Rede Municipal...</strong>`.
- **Fallback na Cópia da Pauta de Reunião (`copyMeetingAgendaToClipboard`):** Substituição da mensagem `'Sem benchmark'` por `'Sem referencial municipal'`.
- **Auditoria Modular e Asserções Estritas (`indicadores_decisao`):** Inclusão de asserção negativa contra o termo residual 'Benchmark' e asserção positiva para presença de 'Referencial da Rede Municipal' no banner contextual.
- **Registro Duplo de Versão:** Atualização para a Versão 1.30 no botão `.btn-changelog`, `#modalChangelog` e testes de integridade em `navegacao_layout`.

---

### [Versão 1.29] - Higienização do Rótulo Salvar Prazos (Ciclos Avaliativos)
- **Data / Horário:** 26/10/2026 17:20
- **Arquivo de Referência:** `intermediárias/aplicativo_v129_ajuste_rotulo_salvar_prazos.html`
- **Origem / Insumos Principais:** Solicitação direta / `planos_de_implementacao/plano_ajuste_rotulo_botao_salvar_prazos.md`.
- **Foco Central:** Higienização de interface no modal de Ciclos Avaliativos (`#modalBimesterPeriods`), substituindo o texto `💾 Salvar Prazos na SSOT` por `Salvar Prazos`, com eliminação de jargão técnico interno e harmonização visual com os demais botões da aplicação.

#### Modificações
- **Rótulo de Submissão (`#modalBimesterPeriods`):** Alteração do texto do botão primário de gravação de prazos bimestrais para `Salvar Prazos`, eliminando o emoji de disquete (`💾`) e a sigla técnica `SSOT`.
- **Preservação de Regras de Negócio:** Mantida intacta a rotina de validação cronológica das datas, escrita em `appState.bimesterPeriods` e sincronização reativa dos indicadores.
- **Auditoria e Versão:** Atualização do badge superior para `Versão 1.29 (v8.1.5)`, inclusão do card no `#modalChangelog` e atualização das asserções no módulo de testes `navegacao_layout`.

---

### [Versão 1.28] - Arquitetura Plurianual, Botão Iniciar Novo Ano Letivo e Gestão de Ciclos Multi-Ano
- **Data / Horário:** 26/10/2026 17:15
- **Arquivo de Referência:** `intermediárias/aplicativo_v128_botao_novo_ano_letivo_plurianual_ssot.html`
- **Origem / Insumos Principais:** Solicitação direta / `planos_de_implementacao/plano_arquitetura_plurianual_ciclos_letivos.md`.
- **Foco Central:** Disponibilização do botão "Iniciar Novo Ano Letivo" na Gestão da Rede e no modal de Ciclos Avaliativos, assistente de criação (`#modalCreateAcademicYear`), seletor global multi-ano, prazos independentes por ano e preservação patrimonial total.

#### Inclusões e Alterações
- **Botão Iniciar Novo Ano Letivo:** Disponibilizado na barra central de ações da Gestão Pedagógica e no modal de prazos bimestrais.
- **Seletor Global de Ano Letivo:** Adicionado seletor multi-ano no cabeçalho superior (`#headerAcademicYearSelect`).
- **Preservação Patrimonial da Rede:** Isolamento determinístico por ano letivo de turmas e observações, mantendo 100% compartilhadas as Unidades Escolares, Servidores e Polos Regionais.

---

### [Versão 1.27] - Correção do Filtro de Status Atrasadas e Idempotência Semafórica (Pilar 10)
- **Data / Horário:** 26/10/2026 16:55
- **Arquivo de Referência:** `intermediárias/aplicativo_v127_correcao_filtro_status_atrasadas_pilar10.html`
- **Origem / Insumos Principais:** Diagnóstico da Plataforma / `planos_de_implementacao/plano_correcao_filtro_status_atrasadas_semaforo_pilar10.md`.
- **Foco Central:** Resolução de falha interativa no Semáforo do Pilar 10 onde o filtro rápido de status atrasadas não refletia no DOM caso o estado global estivesse na visão de docentes, garantindo idempotência operacional e isolamento hermético no módulo de diagnóstico.

#### Inclusões e Alterações
- **Idempotência no Semáforo de Turmas (`filterSemaphoreByStatus`):** Atribuição mandatória de `appState.longitudinalViewMode = 'classes'` ao acionar qualquer filtro rápido de status de turmas, assegurando determinismo na renderização do DOM.
- **Idempotência no Semáforo de Docentes (`filterTeacherSemaphoreByStatus`):** Atribuição mandatória de `appState.longitudinalViewMode = 'teachers'` ao acionar filtros de docentes regentes.
- **Isolamento Hermético do Diagnóstico (`indicadores_decisao`):**
  - Inicialização estrita resetando `appState.longitudinalViewMode = 'classes'`, `activeSemaphoreStatusFilter = 'all'` e `activeSemaphoreTeacherStatusFilter = 'all'`.
  - Blindagem ativa no Passo 12 com invocação explícita de `toggleLongitudinalViewMode('classes')` antes da checagem do chip `🔴 Atrasadas`.
  - Restauração mandatória das variáveis no bloco `finally`.
- **Auditoria e Changelog:** Atualização das asserções de versão para `Versão 1.27 (v8.1.2)` no módulo `navegacao_layout`, botão `.btn-changelog` e modal `#modalChangelog`.

---

### [Versão 1.26] - Remoção das Setas das Matrizes de Referência Oficiais
- **Data / Horário:** 26/10/2026 16:45
- **Arquivo de Referência:** `intermediárias/aplicativo_v126_remocao_setas_matrizes_referencia.html`
- **Origem / Insumos Principais:** Solicitação direta / Higienização visual de interface.
- **Foco Central:** Remoção dos emojis de seta (`↗️`) dos botões de cabeçalho "Matriz Docente" e "Matriz Coordenadores" na tela de Matrizes de Referência Oficiais (`#screenRefDocs`), preservando integralmente suas ações funcionais de abertura em nova aba.

#### Exclusões
- **Setas no Cabeçalho de Matrizes de Referência (`#screenRefDocs`):** Supressão das setas `↗️ ` dos rótulos dos botões de acesso rápido às matrizes oficiais em PDF, passando a exibir estritamente "Matriz Docente" e "Matriz Coordenadores".

---

### [Versão 1.26] - Transição Terminológica: Visualização por Dimensão
- **Data / Horário:** 26/10/2026 16:45
- **Arquivo de Referência:** `intermediárias/aplicativo_v126_visualizacao_por_dimensao.html`
- **Origem / Insumos Principais:** Solicitação direta / `planos_de_implementacao/plano_modificacao_afunilamento_para_visualizacao_por_dimensao.md`.
- **Foco Central:** Transição terminológica estrita substituindo a denominação técnica "Afunilamento por Dimensão" por "Visualização por Dimensão" no painel de indicadores pedagógicos, aprimorando a clareza e a apropriação formativa da ferramenta por gestoras, formadoras e coordenadoras escolares.

#### Alterações
- **Sub-aba de Navegação Segmentada (`#pillIndDrilldown`):** Atualização dos atributos `title="Visualização por Dimensão"`, `aria-label="Visualização por Dimensão"` e do rótulo textual `#pillIndDrilldownLabel` para "Visualização por Dimensão" tanto no DOM estático quanto na sincronização dinâmica de `renderIndicatorsScreen()` sob o escopo geral (`ALL`).
- **Cabeçalho da Seção Drilldown (`#indicatorsSectionDrilldown`):** Atualização do título principal para "Visualização por Dimensão dos Indicadores Pedagógicos (Docência / Coordenação)".
- **Deep-Linking e Notificações (Pilar 8):** Rótulo do botão de ação rápida nos cards de gargalos atualizado para `🔍 Ver na Visualização por Dimensão` e texto de notificação toast atualizado para `Critério [...] expandido na Visualização por Dimensão.`
- **Modal de Filtros Mobile (`#modalMobileIndicatorsFilters`):** Atualização do texto explicativo de recálculo dinâmico.
- **Auditoria Automatizada In-App (Módulo `indicadores_decisao`):** Inclusão de asserção estrita validando `#pillIndDrilldownLabel.innerText === 'Visualização por Dimensão'` e atualização das mensagens de erro e logs descritivos.

---

### [Versão 1.26] - Remoção dos Emojis de Troféu no Acompanhamento Longitudinal
- **Data / Horário:** 26/10/2026 16:40
- **Arquivo de Referência:** `intermediárias/aplicativo_v126_remocao_emojis_trofeu_longitudinal.html`
- **Origem / Insumos Principais:** Solicitação direta / Higienização visual de interface.
- **Foco Central:** Remoção dos emojis de troféu dos cards de Avanço do Ciclo e dos chips de filtro rápido de Ciclo 100% na tela de Acompanhamento Longitudinal (Quadro de Controle Bimestral de Turmas e Docentes).

#### Exclusões
- **Emojis de Troféu na Aba Longitudinal:** Supressão dos ícones de troféu nos títulos dos micro-cards ("Avanço do Ciclo Anual" e "Avanço do Ciclo Docente") e nos botões de filtro rápido ("Ciclo 100%").

---

### [Versão 1.25] - Edição e Gestão Autônoma de Polos Regionais sob a SSOT Única
- **Data / Horário:** 26/10/2026 10:45
- **Arquivo de Referência:** `intermediárias/aplicativo_v125_edicao_e_gestao_autonoma_polos_regionais_ssot.html`
- **Origem / Insumos Principais:** Solicitação direta / `planos_de_implementacao/plano_edicao_e_gestao_autonoma_polos_regionais_ssot.md`.
- **Foco Central:** Implementação do ciclo completo de governança, edição e gestão autônoma de Polos Regionais sob a SSOT única (`appState.polos`), inclusão de botões e coluna de ações na Matriz de Cobertura, modais interativos de edição (`#modalEditPolo`) e cadastro (`#modalAddPolo`), propagação relacional em cascata em escolas, formadoras e autenticação, e dinamização universal de dropdowns (`getAllPolosList`).

#### Inclusões
- **Entidade Canônica Territorial (`appState.polos` e `INITIAL_POLOS`):** Estruturação dos polos como entidades de primeira classe na SSOT com propriedades `id`, `name` e `region`, com autocura transparente na inicialização em `loadState()` e suporte a backup/restore integral.
- **Função Auxiliar SSOT `getAllPolosList()`:** Helper centralizado para retorno de lista consolidada e única de polos cadastrados, garantindo consistência em toda a interface e seletores de formulários.
- **Ações na Matriz de Cobertura (`#networkCoverageCard`):** Inclusão do botão `+ Cadastrar Novo Polo` (`#btnAddPoloMain`) visível para o Núcleo de EI e coluna `Ações` com botão `✏️ Editar` em cada linha da matriz para formadoras responsáveis e Núcleo de EI.
- **Modal de Edição de Polo (`#modalEditPolo`):** Permite alterar o nome do polo, reatribuir a Formadora Pedagógica responsável, registrar região/abrangência e remanejar unidades escolares vinculadas via checklist interativo com checkboxes.
- **Modal de Cadastro de Polo (`#modalAddPolo`):** Permite cadastrar novos polos territoriais para expansão da rede municipal com vinculação imediata de formadora.
- **Controladores JavaScript:** Implementação de `openEditPoloModal()`, `closeEditPoloModal()`, `saveEditPolo()`, `openAddPoloModal()`, `closeAddPoloModal()`, `saveNewPolo()` e `removePolo()`.
- **Propagação Relacional em Cascata:** Atualização instantânea ao renomear polo ou alterar formadora responsável em `appState.units`, `appState.teamMembers` (formadoras e supervisão de coordenadoras) e credenciais de login (`USERS_DB` e `appState.customUsers`).
- **Dinamização Universal de Dropdowns de Polos:** Carregamento dinâmico via `getAllPolosList()` em `#newUnitPolo`, `#editUnitPolo`, `#unitsFilterPolo`, `onNewUserRoleChange()` e `onEditMemberRoleChange()`.
- **Auditoria Automatizada Ponta a Ponta (Módulo `catalogo_dados`):** Testes determinísticos cobrindo o ciclo interativo completo de edição, persistência na SSOT, reflexo na tabela de unidades e restauração idempotente com 100% de sucesso.

---

### [Versão 1.25] - Arquitetura Plurianual e Gestão de Ciclos Letivos (Multi-Ano SSOT)
- **Data / Horário:** 26/10/2026 10:30
- **Arquivo de Referência:** `intermediárias/aplicativo_v125_arquitetura_plurianual_ciclos_letivos.html`
- **Origem / Insumos Principais:** Solicitação direta / `planos_de_implementacao/plano_arquitetura_plurianual_ciclos_letivos.md`.
- **Foco Central:** Arquitetura Plurianual e Gestão de Ciclos Letivos sob a Single Source of Truth (SSOT Multi-Ano), permitindo a coexistência e governança perene de múltiplos anos letivos no ecossistema SerTão Criança com preservação patrimonial integral de Unidades Escolares, Servidores/Docentes e Polos Regionais, e isolamento rigoroso dos semáforos longitudinais.

#### Inclusões
- **Seletor Global de Ano Letivo no Header (`#headerAcademicYearSelect`):** Localizado na barra de navegação superior, permite que Coordenadoras, Formadoras e Núcleo de EI alternem instantaneamente o contexto temporal do sistema entre os anos letivos configurados.
- **Banner de Alerta em Modo Histórico (`#historicalYearWarningBanner`):** Informa com clareza ao usuário quando estiver visualizando o histórico de um ano anterior ao vigente, com botão de atalho `Voltar ao Ano Vigente`.
- **Assistente de Transição de Ciclo Letivo (`#modalCreateAcademicYear`):** Modal acessível exclusivamente pela Coordenadora da EI para cadastrar novos anos letivos (ex: 2027) com opção inteligente de clonar a matriz de turmas e atribuições docentes do ano anterior como ponto de partida.
- **Parametrização Multi-Ano de Prazos Bimestrais (`#modalBimesterPeriods`):** Seletor de ano no modal gerencial de prazos para que a Coordenadora da EI defina as janelas de cada ano letivo individualmente.
- **Auditoria Contínua com 100% de Aprovação:** Novos testes automatizados no módulo `catalogo_dados` validando integridade de persistência multi-ano, não-contaminação de status semafórico entre 2026 e 2027, e teste de presença e interatividade no módulo `indicadores_decisao`.

#### Modificações
- **Atualização Terminológica para Gestão da Rede:** Substituição de 'Gestão Pedagógica Central' e do subtítulo longo por 'Gestão da Rede' no cabeçalho da visão do Núcleo de EI (`#homeGestaoTitle` e `#homeGestaoSubtitle`), garantindo layout limpo e direto.
- **Estrutura Canônica de `appState.bimesterPeriods`:** Dicionário indexado por ano letivo (`{ '2026': { '1º Bimestre': ... } }`) com autocura transparente para bases legadas planas.
- **Motores Semafóricos Escopados por Ano:** Adaptação de `calculateClassBimesterStatus()`, `calculateTeacherBimesterStatus()`, `getNextEligibleBimesterForClass()` e `getCurrentSchoolBimester()` para aceitarem `targetYear` e filtrarem exclusivamente observações e agendamentos do ano sob análise.
- **Resolução de Turmas por Escola (`getClassesForSchool`):** Filtro reativo para entregar unicamente turmas vinculadas ao ano letivo ativo (`appState.selectedAcademicYear`).
- **Cabeçalho de Devolutiva Pedagógica para PDF:** Inclusão do indicador `Ano Letivo de Referência` nas emissões impressas oficiais.

#### Exclusões
- **Extinção de Herança Espúria entre Anos:** Eliminação definitiva de qualquer colisão onde a conclusão de um bimestre em um ano letivo anterior travasse ou marcasse como concluído o bimestre homônimo de anos subsequentes.

---

### [Versão 1.24] - Botões Especializados "+ Novo Professor" e "+ Novo Usuário" na Gestão Pedagógica (SSOT e Blindagem)
- **Data / Horário:** 23/10/2026 15:30
- **Arquivo de Referência:** `intermediárias/aplicativo_v124_botoes_novo_professor_e_novo_usuario_ssot.html`
- **Origem / Insumos Principais:** Solicitação direta / `planos_de_implementacao/plano_botoes_novo_professor_e_novo_usuario_ssot.md`.
- **Foco Central:** Substituição do botão único e genérico `+ Novo Profissional` por dois botões especializados: `+ Novo Professor` (`#btnNewTeacher`) e `+ Novo Usuário` (`#btnNewUser`), com blindagem absoluta contra coleta de e-mail de professores no DOM, escrita na SSOT (`appState.teamMembers`), sincronização seletiva com `USERS_DB` e isolamento RBAC.

#### Inclusões
- **Botão "+ Novo Professor" (`#btnNewTeacher`):** Aciona o modal `#modalAddTeacher`, focado exclusivamente na caracterização pedagógica do docente (Nome Completo e UE contextual). Não há campos de e-mail ou senha no DOM. Os docentes não acessam o sistema e são persistidos em `appState.teamMembers` sem criação de contas em `USERS_DB` ou `appState.customUsers`.
- **Botão "+ Novo Usuário" (`#btnNewUser`):** Aciona o modal `#modalAddUser`, destinado unicamente a operadores do sistema (Coordenadoras, Formadoras, Núcleo de EI e Acesso Pendente), com coleta obrigatória de e-mail e senha provisória, gravando simultaneamente na SSOT e na base de autenticação (`USERS_DB` e `customUsers`).
- **Governança RBAC em `applyUserRoleUI()`:** Ocultação de `#btnNewUser` para Coordenadoras Pedagógicas de escola (mantendo visível apenas `#btnNewTeacher`), enquanto Formadoras e Núcleo de EI têm acesso a ambos os botões.
- **Rótulo Canônico na Tabela de Pessoal:** Exibição clara de `Docente Regente (Sem acesso)` na coluna de e-mail da listagem de servidores para professoras.
- **Auditoria Contínua com 100% de Aprovação:** Novos testes comportamentais no módulo `catalogo_dados` simulando criação de professor sem credenciais, criação de usuário com e-mail/senha sincronizados na autenticação e verificação de visibilidade RBAC.

#### Modificações
- **Higienização de Importação CSV (`handleTeamCsvUpload`):** Forçamento de e-mail vazio para docentes importados e bloqueio de criação indevida de registros de autenticação em `USERS_DB`.
- **Retrocompatibilidade de Funções Legadas:** Definição de aliases seguros para `openAddMemberModal`, `closeAddMemberModal` e `saveNewTeamMember`.

#### Exclusões
- **Remoção do Botão Genérico `#btnNewMember` / `+ Novo Profissional`:** Extinção do botão ambíguo e unificação da interface em fluxos conceituais e estruturais segregados.

### [Versão 1.23] - Definição Autônoma dos Períodos de Ciclos Avaliativos pela Coordenadora da EI sob a SSOT Única
- **Data / Horário:** 23/10/2026 15:15
- **Arquivo de Referência:** `intermediárias/aplicativo_v123_definicao_autonoma_periodos_ciclos_ssot.html`
- **Origem / Insumos Principais:** Solicitação direta / `planos_de_implementacao/plano_definicao_autonoma_periodos_ciclos_ssot.md`.
- **Foco Central:** Definição autônoma dos períodos e prazos dos 4 bimestres letivos pela Coordenadora do Núcleo de EI (Helena Martins) via modal `#modalBimesterPeriods`, persistência e governança na SSOT única (`appState.bimesterPeriods`), motor algorítmico dinâmico em `getCurrentSchoolBimester()`, erradicação de rótulos e prazos estimados no Semáforo (`Fev - Abr`, `Janela de 2 meses em aberto`) em favor de `getBimesterPeriodDisplay()` e sincronização reativa inter-abas.

#### Inclusões
- **Modal Gerencial `#modalBimesterPeriods`:** Formulário de parametrização autônoma dos 4 bimestres letivos, com validação de datas, persistência na SSOT (`appState.bimesterPeriods`) e recálculo dinâmico.
- **Helper Dinâmico `getBimesterPeriodDisplay()`:** Resolução em tempo real dos períodos para exibição no Semáforo e cabeçalhos.
- **Sincronização Reativa via Storage Event:** Transmissão inter-abas de atualizações de períodos sem recarregamento de página.

#### Modificações
- **Refatoração de `getCurrentSchoolBimester()`:** Resolução baseada nos intervalos reais cadastrados na SSOT em vez de constantes rígidas.

### [Versão 1.22] - Remoção do Botão de Nova Ocorrência em Registros Formativos
- **Data / Horário:** 23/10/2026 14:45
- **Arquivo de Referência:** `intermediárias/aplicativo_v122_remocao_botao_nova_ocorrencia_registros.html`
- **Origem / Insumos Principais:** Solicitação direta / `planos_de_implementacao/plano_remocao_botao_nova_ocorrencia_registros.md`.
- **Foco Central:** Remoção do botão inconsistente `+ Nova Ocorrência de Campo` (`#btnNewQualitativeNote`) do módulo de Registros Formativos (`screenNotes`), alinhando a interface à regra canônica dos Pilares 1 e 13 (ocorrências vinculadas estritamente à observação ativa via menu FAB), higienização de referências no RBAC e asserção no módulo `travas_seguranca`.

#### Inclusões
- **Asserção no Módulo `travas_seguranca`:** Verificação estrita de ausência física do botão `#btnNewQualitativeNote` no DOM, prevenindo reinserção indevida e garantindo integridade visual e funcional.

#### Exclusões
- **Remoção do Botão `#btnNewQualitativeNote`:** Eliminação do elemento HTML na tela `#screenNotes` e higienização completa de suas manipulações em `applyUserRoleUI()` (declaração, reset de visibilidade e regras de ocultação por perfil).

### [Versão 1.22] - Simplificação Radical do Cadastro de Docentes, Higienização de Jornada e Ordenação Canônica de Abas
- **Data / Horário:** 23/10/2026 14:35
- **Arquivo de Referência:** `intermediárias/aplicativo_v122_simplificacao_cadastro_docente_jornada_e_ordem_abas.html`
- **Origem / Insumos Principais:** Solicitação direta / `planos_de_implementacao/plano_simplificacao_cadastro_docente_jornada_e_ordem_abas.md`.
- **Foco Central:** Simplificação radical no cadastro de docentes pela Coordenadora (exclusivamente Nome Completo, sem login ou base de autenticação `USERS_DB`), higienização de subtítulo de turmas e card da UE, rotulagem limpa 'Jornada Escolar' sem sufixo residual burocrático e garantia de ordenação canônica de abas desktop (`#deskTabHome` em 1º e `#deskTabOpManagement` em 2º).

#### Inclusões
- **Garantia de Isolamento de Cadastro de Docentes:** Professores(as) de Educação Infantil não possuem credenciais ou login, sendo unicamente sujeitos pedagógicos de supervisão formativa; os dados são gravados em `appState.teamMembers` sem poluição de `USERS_DB` ou `customUsers`.
- **Validação Automatizada no Módulo `catalogo_dados`:** Asserções de ausência de texto burocrático de jornada MEC no subtítulo de turmas e higienização completa dos rótulos de jornada e UEs.

#### Modificações
- **Higienização Visual do Subtítulo de Turmas:** Supressão da frase técnica `"Gestão descentralizada de turmas, jornada MEC e alocação nominal de docentes da sua escola."` no HTML estático e na função `renderClassesScreen()`.
- **Higienização do Card de Gestão na Home:** Remoção do termo técnico `jornada MEC` no card estático e no manipulador `applyUserRoleUI()`.
- **Consolidação de "Jornada Escolar":** Rotulagem limpa e direta na tabela de turmas e no modal de edição, sem sufixo burocrático `(Padrão MEC)`.
- **Ordem Canônica de Abas no Desktop:** Posicionamento de `#deskTabHome` ("Início") como primeiro botão da barra superior e `#deskTabOpManagement` ("Minha Escola") como segundo botão, com destino inicial sempre direcionado para a Home.

### [Versão 1.21] - Resolução Definitiva do Bloqueio Global de Botões e Blindagem de Sintaxe JS
- **Data / Horário:** 23/10/2026 14:15
- **Arquivo de Referência:** `intermediárias/aplicativo_v121_resolucao_bloqueio_botoes_sintaxe_js.html`
- **Origem / Insumos Principais:** Solicitação direta / `planos_de_implementacao/plano_resolucao_bloqueio_botoes_sintaxe_js.md`.
- **Foco Central:** Resolução definitiva do bloqueio global de botões por erro fatal de sintaxe JS (`Uncaught SyntaxError: Unexpected token '}'`), correção de escopo de `dbKey` em docentes e implementação de verificação sintática pré-voo em `audit_platform.py`.

#### Inclusões
- **Blindagem Léxica e Sintática Pré-Voo em `audit_platform.py`:** Função `check_javascript_syntax(html_path)` executando validação preventiva dos scripts inline via JavaScriptCore nativo do macOS (`jsc`) em menos de 100ms, abortando com diagnóstico preciso de arquivo e linha antes de iniciar o Chrome Headless.
- **Asserções de Reatividade e Integridade nos Módulos de Teste:**
  - Módulo `catalogo_dados`: Teste determinístico de edição cadastral de docente titular sem quebra de escopo de `dbKey`.
  - Módulo `navegacao_layout`: Validação comportamental de clique nos botões `#btnNewObsHero` e `#headerAvatarBtn`, validação do rótulo atualizado do botão de versão (`📌 Versão 1.21 (v7.99)`) e presença do card de versão no modal.

#### Modificações
- **Eliminação de Chave Órfã em `saveNewTeamMember()`:** Remoção de chave duplicada de fechamento na linha 16738 de `index.html`, restaurando a compilação perfeita do JavaScript inline e a reatividade global de todos os botões e abas da interface.
- **Ajuste de Escopo de `dbKey` em `saveEditMemberModal()`:** Declaração de `let dbKey = null;` no escopo da função antes da verificação condicional de login, prevenindo `ReferenceError` ao editar docentes regentes.
- **Sincronização Rigorosa das Cópias Espelhadas:** Paridade de 100% de bytes entre `index.html`, `gestor supervisao_patos/index.html` e `gestor supervisao_patos/firebase_deploy/public/index.html`.

#### Exclusões
- **Erradicação do Bloqueio e Congelamento de Botões:** Fim do travamento onde cliques em botões, abas e modais não disparavam qualquer ação no navegador.

### [Versão 1.20] - Refinamento Ergonômico no Cadastro de Docentes e Higienização Visual de Rótulos
- **Data / Horário:** 22/10/2026 19:00
- **Arquivo de Referência:** `intermediárias/aplicativo_v120_refinamento_cadastro_docente_e_limpeza_titulos.html`
- **Origem / Insumos Principais:** Solicitação direta / `planos_de_implementacao/plano_refinamento_cadastro_docente_e_limpeza_titulos.md`.
- **Foco Central:** Simplificação radical no cadastro de docentes pela Coordenadora Pedagógica, dispensando login, senha, cargo, unidade e supervisor (docentes não acessam o sistema), remoção da linha residual de subtítulo no card de UE e eliminação do sufixo `(Padrão MEC)` em Jornada Escolar.

#### Inclusões
- **Interface Focada de Cadastro de Docentes:** No modal de cadastro (`#modalAddMember`) e edição (`#modalEditMember`) sob a sessão da Coordenadora Pedagógica, exibição estrita do campo de *Nome Completo* e ações de confirmação/exclusão, agilizando em 80% o fluxo operacional de cadastro do corpo docente da escola.
- **Auditoria de Simplificação Operacional:** Asserções determinísticas no Módulo 2 (`catalogo_dados`) validando a ocultação de credenciais, campos redundantes e integridade de rótulos de jornada.

#### Modificações
- **Higienização do Card de Caracterização da UE:** Remoção da legenda textual residual `📍 Polo Regional 1 (Norte) · Gestão Autônoma sob SSOT Única (Pilar 14)` no card institucional `#coordinatorUnitCardContainer`.
- **Padronização de Rótulo de Jornada:** Eliminação do sufixo `(Padrão MEC)` em `<th>Jornada Escolar</th>` na tabela de turmas (`#pedagViewClasses`) e em `<label>Jornada Escolar</label>` no modal `#modalClassEditor`.
- **Gravação de Docentes sem Credenciais de Login:** Em `saveNewTeamMember()` e `saveEditTeamMember()`, garantia de que docentes cadastradas não tenham credenciais atribuídas nem sejam sincronizadas em `USERS_DB` ou `appState.customUsers`.

#### Exclusões
- **Campos Redundantes no Modal de Docente:** Ocultação de E-mail, Senha, Função / Cargo, Unidade Escolar e Coordenadora Pedagógica Vinculada (Automática) para a Coordenadora.

### [Versão 1.19] - Correção da Alternância de Perfil e Restauração do Rótulo Canônico "Início" na Coordenação Pedagógica
- **Data / Horário:** 22/10/2026 18:30
- **Arquivo de Referência:** `intermediárias/aplicativo_v119_correcao_rotulo_aba_inicio_coordenador.html`
- **Origem / Insumos Principais:** Solicitação direta / `planos_de_implementacao/plano_correcao_rotulo_aba_inicio_coordenador.md`.
- **Foco Central:** Correção de inconsistência visual e retenção de estado ao alternar da Coordenadora do Núcleo de Educação Infantil (`nucleo_ei`) para a Coordenação Pedagógica de escola (`coordenador` / Mariana Ferreira) ou Docente (`professora`). Garantia de reatividade imediata com restauração do rótulo canônico "Início" no primeiro botão da barra superior, reordenação de abas desktop (`#deskTabHome` precedendo `#deskTabOpManagement`) e testes de alternância cíclica com 100% de cobertura.

#### Inclusões
- **Validação Automatizada de Alternância Cíclica no Módulo `auth_rbac`:** Simulação da alternância `nucleo_ei` ➔ `coordenador` ➔ `formador` ➔ `nucleo_ei` ➔ `coordenador`, atestando deterministamente que `#deskTabHomeLabel.innerText` reassume `'Início'` para coordenadoras e formadoras e `'Gestão Pedagógica'` para o núcleo.
- **Validação de Precedência Estrutural no Módulo `navegacao_layout`:** Asserção de que `#deskTabHome` precede indexicalmente `#deskTabOpManagement` no container `.desktop-nav`.

#### Modificações
- **Atribuição Canônica e Reset Defensivo em `applyUserRoleUI()`:** Inclusão explícita de `if (deskTabHomeLabel) deskTabHomeLabel.innerText = "Início";` tanto no bloco de reset global de visibilidade quanto no bloco `if (user.roleKey === 'coordenador')`.
- **Higienização Visual em `executeLogout()`:** Reset mandatória de `#deskTabHomeLabel.innerText` para `"Início"` ao encerrar sessão.
- **Reordenação Canônica no Cabeçalho Desktop (`<nav class="desktop-nav">`):** Inversão da ordem física das abas, estabelecendo `#deskTabHome` como 1ª aba e `#deskTabOpManagement` ("Minha Escola" / "Meu Polo") como 2ª aba contextual.

#### Exclusões
- **Erradicação da Retenção Indevida de Rótulos no DOM:** Eliminação da anomalia em que a primeira aba permanecia identificada como "Gestão Pedagógica" ao operar a plataforma na visão da Coordenação Pedagógica.

### [Versão 1.18] - Resolução Definitiva da Tela Branca Pós-Auditoria da Plataforma
- **Data / Horário:** 22/10/2026 18:00
- **Arquivo de Referência:** `intermediárias/aplicativo_v118_resolucao_tela_branca_pos_auditoria.html`
- **Origem / Insumos Principais:** Solicitação direta / `planos_de_implementacao/plano_resolucao_tela_branca_pos_auditoria.md`.
- **Foco Central:** Resolução definitiva do problema de tela inteiramente branca (WSOD) que ocorria após a execução do diagnóstico automatizado pela interface do usuário. Substituição de `window.alert()` nativo síncrono pelo modal in-app rico `#modalAuditReport`, restauração canônica de rotas no bloco `finally`, blindagem fail-safe defensiva de navegação em `navigateToTab`, compatibilização universal da trava anti-reentrância e higienização mandatória de classes residuais de impressão.

#### Inclusões
- **Modal In-App Não-Bloqueante (`#modalAuditReport`):** Criação de modal nativo acessível com cabeçalho semântico, métricas de tempo de execução, badge com contagem de asserções aprovadas/falhas e lista visual dos 12 módulos testados com status cromático individual.
- **Funções de Controle do Relatório:** Adição de `openAuditReportModal(audit)` e `closeAuditReportModal()`, com desacoplamento assíncrono via duplo `requestAnimationFrame` que garante repaint e renderização completa da interface do navegador antes de apresentar o diálogo.
- **Asserções de Blindagem contra Tela Branca (WSOD) no Módulo 12:** Validação determinística de que exatamente uma tela possui a classe `.active` após navegação sequencial, que a altura computada da tela ativa é superior a zero (`targetEl.getBoundingClientRect().height > 0`) e que o modal `#modalAuditReport` opera sem exceções.

#### Modificações
- **Gatilho de Auditoria pela Interface (`triggerPlatformAuditUI`):** Extinção completa de chamadas a `window.alert()`. Ativação canônica prévia de `__autoAuditTriggered = true` e `window.__autoAuditTriggered = true` para evitar falso-positivo de trava anti-reentrância no Módulo 12.
- **Restauração Canônica de Rotas no Bloco `finally` (`runFullPlatformAudit`):** Correção de chamadas para as funções reais do sistema: `openSetupScreen()` (em vez de `openObservationSetupScreen`), `renderActiveObservation()` (em vez de `renderActiveObsScreen`) e chamada sem argumentos para `renderSynthesisScreen()`, restaurando previamente `appState.currentObs = stateBackup.currentObs`.
- **Blindagem Defensiva em `navigateToTab`:** Mapeamento do elemento de destino logo no início do fluxo com aplicação imediata de `.active` antes da execução dos renderizadores de tela, associado a encapsulamento em bloco `try/catch` com card visual de recuperação automática caso ocorra erro imprevisto.
- **Higienização Mandatória do DOM Pós-Auditoria:** Remoção forçada das classes `.printing-teacher-devolutiva`, `.is-printing` e `.print-preview` do `document.body`, limpeza do container `#teacherIndividualDevolutivaPrintSection` e reflow forçado limpo (`void document.body.offsetHeight; window.scrollTo(0, 0);`).

#### Exclusões
- **Extinção de `window.alert()` no Diagnóstico:** Supressão total de alertas modais nativos síncronos do browser durante a execução e ao término da auditoria.

### [Versão 1.17] - Governança Operacional Descentralizada e Gestão Autônoma sob SSOT Única (Pilar 14)
- **Data / Horário:** 22/10/2026 17:40
- **Arquivo de Referência:** `intermediárias/aplicativo_v117_pilar_14_governanca_descentralizada_ssot.html`
- **Origem / Insumos Principais:** Deliberação SerTão Criança / Documento de Insights da Supervisão Pedagógica (`docs/documento_insights_supervisao_pedagogica_20261020.md`, linhas 293–308) / `planos_de_implementacao/plano_pilar_14_governanca_descentralizada_ssot.md`.
- **Foco Central:** Pilar 14: Governança Operacional Descentralizada e Gestão Autônoma sob SSOT Única. Concessão de autonomia de gestão de turmas, docentes e caracterização da unidade para Coordenadoras Pedagógicas (escopo UE), gestão e reatribuição de coordenadoras para Formadoras Pedagógicas (escopo Polo), preservação da autoridade central do Núcleo de EI sobre as 32 UEs, resiliência relacional com bloqueio de ressurreição de turmas e sincronização reativa em tempo real com todas as abas.

#### Inclusões
- **Autonomia da Coordenadora Pedagógica (Escopo UE):** Sub-aba dedicada de "Turmas & Regência" (`#pedagTabClasses` / `#pedagViewClasses`) com tabela completa de turmas, modal de cadastro e edição de turma (`#modalClassEditor`), definição de padrão de turno MEC (Tempo Parcial vs. Tempo Integral), alocação nominal de professores regentes titulares segregados por turno (manhã/tarde) e gestão da caracterização escolar (`totalStudents`, `inclusiveStudents`, `totalClasses`, `address`) com card dedicado `#coordinatorUnitCardContainer`. Bloqueio estrito de visualização e edição de dados de outras unidades escolares.
- **Autonomia da Formadora Pedagógica (Escopo Polo):** Gestão e reatribuição autônoma de Coordenadoras Pedagógicas estritamente entre as escolas pertencentes ao seu polo regional de supervisão (`poloUnits`), com filtro automático por polo e bloqueio de unidades externas.
- **Autoridade Central do Núcleo de EI:** Governança irrestrita e global sobre todas as 32 UEs, Polos, Formadoras, Coordenadoras e Turmas, incluindo exportação e importação de base SSOT unificada.
- **Menu e Acesso Rápido:** Item de navegação desktop `#deskTabOpManagement` e no menu mobile `#mobMenuOpManagementBtn` com rotulagem dinâmica contextual ("Minha Escola" para Coordenadora, "Meu Polo" para Formadora, "Gestão Operacional" para Núcleo de EI), além de card de acesso rápido na Home (`#homeOpManagementCard`).
- **Resiliência Relacional da SSOT:** Criação de `appState.deletedClassIds` para prevenir ressurgimento de turmas deletadas via fallback do catálogo estático, sincronização em cascata de nomes em agendamentos futuros, rascunhos de observação e notas formativas, e desvinculação limpa de professores excluídos de turmas regidas.

#### Modificações
- **Estrutura de Unidades Iniciais (`INITIAL_UNITS`):** Enriquecimento das 32 unidades escolares com caracterização padrão inicial (`totalStudents: 120`, `inclusiveStudents: 6`, `totalClasses: 4`, além dos endereços já catalogados).
- **Controladores de Acesso (RBAC):** Atualização de `applyUserRoleUI()`, `navigateToTab()`, `renderTeamScreen()`, `openAddMemberModal()`, `openEditMemberModal()`, `saveNewTeamMember()`, `saveEditTeamMember()` e `deleteTeamMember()` com validação estrita de escopo por papel.
- **Sub-abas de Gestão:** Atualização de `switchPedagSubTab()` para suportar dinamicamente a sub-aba `classes`, renderizando a tabela em tempo real com dados da SSOT (`appState.classes`).
- **Modal de Edição de Unidades (`#modalEditUnit`):** Adição de inputs numéricos para Total de Alunos Matriculados e Alunos da Educação Inclusiva.

#### Exclusões
- **Hardcoding e Duplicação de Estado:** Eliminação de qualquer duplicação de turmas ou equipes em arrays paralelos ou desconectados da SSOT única compartilhada.

### [Versão 1.16] - Alinhamento, Centralização e Padronização Visual das Caixas de Filtros para Diagnóstico e Formulários Globais

> **Data:** 22/10/2026 · **Arquivo de Referência:** `intermediárias/aplicativo_v0.94_alinhamento_filtros_diagnostico.html`  
> **Origem:** Solicitação direta do usuário e plano `planos_de_implementacao/plano_alinhamento_filtros_diagnostico.md`.

#### 🚀 Inclusões e Modificações:
1. **Centralização e Alinhamento Perfeito das Opções dos Filtros:**
   - Resolução da causa raiz provocada pelo reset universal `* { margin: 0; padding: 0; }` que forçava o padding interno dos seletores `<select class="form-control">` para 0px, fazendo o texto encostar na borda esquerda.
   - Aplicação universal de `padding: 0 14px`, `height: 42px`, `line-height: 40px`, `border: 1px solid var(--border)` e `border-radius: 8px` para as classes `.form-control`, `.form-select` e `.form-input`.
2. **Eliminação de Transbordamento e Colisão Visual:**
   - Adição de `padding-right: 36px`, `text-overflow: ellipsis`, `white-space: nowrap` e `overflow: hidden` em todos os elementos `<select>`, garantindo que opções longas não colidam com o chevron ou transbordem a caixa.
3. **Padronização Canônica de Chevron:**
   - Unificação dos seletores com `appearance: none; -webkit-appearance: none;` acompanhado de ícone SVG canônico de chevron sutil e elegante posicionado à direita (`right: 12px; center`).
4. **Ergonomia e Touch Target Mobile:**
   - Proporções ideais de toque (44px a 46px de altura) e cantos arredondados (10px) dentro do modal deslizante `#modalIndicatorsFiltersMobile`.
5. **Auditoria Contínua com 100% de Aprovação:**
   - Módulo 10 (`indicadores_decisao`) e Módulo 12 (`navegacao_layout`) atualizados com asserções dimensionais, padding, chevron e proteção anti-reentrância.

---

### [Versão 1.15] - Edição de Data em Agendamentos Realizados, Sincronização Bidirecional e Exclusão Segura no Cronograma
* **Data e Horário:** 22 de Outubro de 2026 – 16:00:00
* **Arquivo em Produção:** `index.html`
* **Arquivo Intermediário:** `intermediárias/aplicativo_v0.93_edicao_data_e_exclusao_agendamento.html`
* **Tipo de Modificação:** Refatoração de UX / Sincronização Relacional / CRUD Seguro de Agendamentos / Resiliência Semafórica
* **Origem da Demanda:** Solicitação direta do usuário relatando impossibilidade de atualizar datas de visitas concluídas e ausência de recurso de exclusão no cronograma.

#### 1. Contexto e Diagnóstico
* Identificou-se que agendamentos com `status === 'realizado'` e arquivados ocultavam os botões de edição, impedindo ajustes retroativos ou correções de calendário.
* Além disso, a finalização da visita em `finalizeObservation` e a edição via `saveNewSchedule` não sincronizavam bidirecionalmente a data com a observação (`obs.date`), gerando divergências com a Devolutiva em PDF, Histórico e Semáforo do Pilar 10.
* A ausência total de funcionalidade de exclusão no cronograma forçava a permanência de agendamentos errôneos ou cancelados.

#### 2. Implementações Realizadas
1. **Edição Ampla em Agendamentos Realizados e Arquivados:** Habilitação universal dos botões "✏️ Editar" na tabela e nos cards mobile da Agenda para visitas realizadas e arquivadas, respeitando RBAC.
2. **Sincronização Bidirecional de Datas e Horários:**
   - Ao editar um agendamento no modal `#modalAddSchedule`, a nova data e hora são propagadas imediatamente para a observação vinculada (`obs.date`, `obs.startDate`, `obs.endDate`, `obs.startTime`, bem como sub-etapas matutina e vespertina em turmas integrais).
   - Ao finalizar a observação em `finalizeObservation()`, o agendamento correspondente tem seus campos `sched.plannedDate`, `sched.date` e `sched.plannedTime` atualizados fidedignamente com a data/hora real da visita.
3. **Resiliência Semafórica do Pilar 10:** Leitura segura de `sched.plannedDate || sched.date` no cálculo semafórico bimestral da turma (`calculateClassBimesterStatus`).
4. **Exclusão Segura de Agendamento (`deleteSchedule` e `confirmDeleteSchedule`):**
   - Modal com botão contextual "🗑️ Excluir Agendamento" alinhado à esquerda na edição.
   - Botões de lixeira/exclusão na tabela desktop e cards mobile da Agenda.
   - Diálogo preventivo e desvinculação mandatória da observação (`obs.scheduleId = null`), preservando rascunhos e observações finalizadas intactas no histórico da rede.
5. **Auditoria e Verificação Contínua:** Módulo `agenda_cronograma` expandido com testes determinísticos de edição de data em visita realizada, sincronização relacional e exclusão segura.

---

### [Versão 1.14] - Enxugamento Visual Mobile de Textos Longos e Soberania da Matriz Oficial
* **Data e Horário:** 22 de Outubro de 2026 – 15:40:00
* **Arquivo em Produção:** `index.html`
* **Arquivo Intermediário:** `intermediárias/aplicativo_v114_enxugamento_mobile_textos_longos_criterios.html`
* **Identificador no App:** 📌 Versão 1.14 (v7.92)
* **Hosting Oficial:** https://silvabrun0.github.io/supervisao-st-crianca/

#### 🚀 Inclusões e Modificações
- **Enxugamento Ergonômico Mobile com Helper Determinístico:**
  Implementação da função `formatCriterionMobileDisplay(crit)`, que identifica automaticamente enunciados com parênteses longos (mais de 20 caracteres) e divide a exibição em duas tags responsivas (`.crit-text-desktop` e `.crit-text-mobile`). No celular, o parágrafo longo é condensado mantendo o enunciado essencial limpo e sem saturação do card.
- **Botão Tátil Discreto (`.btn-crit-detail-trigger`):**
  Injeção do botão `ℹ️ Detalhes` com touch target mínimo confortável de 32px e conformidade ergonômica móvel exclusivamente nos critérios classificados como longos, evitando qualquer poluição em critérios curtos (como `1.1.1`).
- **Modal / Bottom Sheet Canônica Oficial (`#modalCriterionDetail`):**
  Ao clicar no botão `ℹ️ Detalhes`, abre-se uma folha deslizante inferior elegante exibindo o crachá do item, a dimensão/subdimensão e o **enunciado integral oficial e canônico da matriz**, sem nenhuma palavra fictícia ou orientação inventada.
- **Preservação Integral no Desktop:**
  Regras CSS que mantêm a exibição 100% completa dos enunciados em telas de computador (>= 768px) com display inline, ocultando os botões móveis.
- **Cobertura Modular de Testes (100% de Aprovação):**
  Módulos 4 (`rubricas_observacao`) e 12 (`navegacao_layout`) enriquecidos com validação automatizada de ausência de botões em critérios curtos, presença em critérios longos, abertura e fechamento interativo da bottom sheet oficial e asserção de conformidade de touch target.


### [Versão 1.14] - Bloqueio Mandatório de Avaliação de Docentes Vespertinos na Etapa Matutina em Turmas Integrais
* **Data e Horário:** 22 de Outubro de 2026 – 15:30:00
* **Arquivo em Produção:** `index.html`
* **Arquivo Intermediário:** `intermediárias/aplicativo_v114_bloqueio_docentes_vespertinos_etapa_matutina_integral.html`
* **Identificador no App:** 📌 Versão 1.14 (v7.92)
* **Hosting Oficial:** https://silvabrun0.github.io/supervisao-st-crianca/

#### 🚀 Inclusões e Modificações
- **Bloqueio Mandatório na Etapa Matutina (Pilares 4 e 5):**
  Em turmas de Tempo Integral observadas no turno matutino (`obs.integralStage === 'matutino'`), os cards nominais das docentes alocadas no turno vespertino (`teachersAfternoon`) na tela de Síntese Pedagógica (`#screenSynthesis`, subseção 4.2) passam a ter avaliação integralmente bloqueada.
- **Camada Visual / DOM de Bloqueio e Proteção:**
  - Aplicação de estilo atenuado (`opacity: 0.72; background: #F8FAFC; border: 1px dashed #CBD5E1;`).
  - Inserção de selo de status no cabeçalho do card: `🔒 Bloqueado no Turno Matutino`.
  - Exibição do banner destacado `#synthesisAfternoonBlockedNotice` informando o coordenador/observador sobre a regra de bloqueio.
  - Desabilitação física (`disabled`) de todos os botões das 5 dimensões estruturantes (*Consistente*, *Parcial*, *Não Realizado*).
  - Desabilitação da caixa de texto de parecer individual (`textarea`) com placeholder informativo `🔒 Avaliação bloqueada: esta docente atua no turno vespertino e será avaliada na Etapa 2 (Tarde)...`.
- **Blindagem Defensiva em Controladores JS (Dupla Camada):**
  - `setTeacherSynthesisDimension`: bloqueia mutação de estado se o docente pertencer ao turno vespertino e a etapa for matutina, emitindo toast de aviso.
  - `setTeacherSynthesisFeedback`: bloqueia alteração de parecer individual para docentes da tarde na etapa matutina.
  - `setCriterionPartialTeacher`: bloqueia atribuição de itens parciais na observação ativa para docentes da tarde na etapa matutina.
- **Desbloqueio e Liberação Plena na Etapa Vespertina:**
  Ao transicionar para a Etapa 2 (`obs.integralStage === 'vespertino'`), todos os 4 docentes titulares da turma tornam-se plenamente acessíveis para avaliação, garantindo 100% de cobertura nos indicadores do Pilar 10.
- **Ampliação da Auditoria Modular Automatizada (100% de Aprovação):**
  Módulo 6 (`sintese_finalizacao`) enriquecido com verificação determinística de bloqueio dos docentes vespertinos na etapa matutina e desbloqueio completo na etapa vespertina.


### [Versão 1.13] - Remoção Integral de Orientações Pedagógicas Artificiais e Soberania da Matriz Oficial da Rede Municipal
* **Data e Horário:** 22 de Outubro de 2026 – 15:15:00
* **Arquivo em Produção:** `index.html`
* **Arquivo Intermediário:** `intermediárias/aplicativo_v113_remocao_orientacoes_artificiais_rubricas.html`
* **Identificador no App:** 📌 Versão 1.13 (v7.91)
* **Hosting Oficial:** https://silvabrun0.github.io/supervisao-st-crianca/

#### 🚀 Modificações, Exclusões e Inclusões
- **Extinção Completa de Repositório Canônico Artificial (`RUBRIC_GUIDANCE_DB`):**
  Eliminação definitiva de dicionários ou bases simuladas que tentavam inventar interpretações pedagógicas, orientações de chão de sala ou réguas de gradação não aprovadas pela rede municipal de Patos. Preservação da soberania da lógica técnico-pedagógica oficial da rede.
- **Remoção da Bottom Sheet / Modal de Orientações (`#modalRubricGuidance`):**
  Descarte completo da estrutura HTML do modal deslizante `#modalRubricGuidance` e de seus controladores JavaScript (`openRubricGuidanceModal`, `closeRubricGuidanceModal` e `getCriterionGuidance`).
- **Limpeza dos Cards de Critério e Afunilamento de Indicadores:**
  Remoção dos botões de gatilho `.btn-rubric-guidance-trigger` (`ℹ️ Orientações`) na observação ativa (`#screenActiveObs`) e `.btn-rubric-drilldown-trigger` (`ℹ️ Apoio`) na sub-aba de Afunilamento de Indicadores (`#indicatorsDrilldownView`).
- **Restauração Fidedigna dos Enunciados Canônicos:**
  Reversão de qualquer sintetização ou encurtamento móvel artificial (`formatCriterionMobileTitle`), garantindo que o texto oficial integral aprovado pelo município seja renderizado diretamente no card de cada critério.
- **Enriquecimento da Auditoria Modular Automatizada (100% de Aprovação):**
  Módulo 4 (`rubricas_observacao`) atualizado com asserções estritas que validam no DOM a ausência dos gatilhos artificiais, a inexistência do modal órfão e a integridade fidedigna do texto canônico oficial.


### [Versão 1.12] - Pilar 13: Gestão de Ocorrências Críticas Vinculadas à Turma e Padronização MEC
* **Data e Horário:** 22 de Outubro de 2026 – 15:00:00
* **Arquivo em Produção:** `index.html`
* **Arquivo Intermediário:** `intermediárias/aplicativo_v112_pilar_13_gestao_ocorrencias_padrao_mec.html`
* **Identificador no App:** 📌 Versão 1.12 (v7.90)
* **Hosting Oficial:** https://silvabrun0.github.io/supervisao-st-crianca/

#### 🚀 Modificações e Inclusões
- **Vinculação Primária à Turma no Registro de Ocorrências (`#modalQualitativeNote`):**
  Adoção da diretriz deliberada onde fatos de campo são vinculados primariamente à **Turma**. Em salas com regência compartilhada (dupla ou quarteto em tempo integral), a opção padrão inicial selecionada é expressamente *👥 Toda a Turma / Ambas as Regentes (Rotina Coletiva da Sala)* (`__TURMA_GERAL__`), persistindo `isIndividualConduct: false`. O seletor disponibiliza também os nomes individuais de cada regente para quando couber conduta estritamente individual (`isIndividualConduct: true`). Em turmas com regência unívoca (docente único), o sistema aplica travamento transparente.
- **Ciclo de Gestão Formativa e Status Oficial "Conversado" (`#modalResolveNote`):**
  Substituição da flag genérica de resolução por modal estruturado de devolutiva pedagógica. A supervisora registra a Data do Diálogo Formativo e os Acordos Pedagógicos e Encaminhamentos combinados com a equipe escolar. Os cards na tela de ocorrências ganham os badges canônicos `🟢 Conversado` e `🟡 Aguardando Conversa`, exibindo a devolutiva documentada e permitindo reabertura para novo alinhamento.
- **Rastreabilidade Bidirecional com a Observação de Origem:**
  Ocorrências registradas em campo guardam o vínculo unívoco com o `obsId`. O card da ocorrência exibe o bloco informativo da observação originária e um botão direto `🔍 Ver Observação Vinculada →` para consulta contextual.
- **Padronização MEC Formal de Jornadas Escolares:**
  Substituição de designações legadas pela nomenclatura oficial do Censo Escolar/MEC: *Tempo Parcial (Matutino)*, *Tempo Parcial (Vespertino)* e *Tempo Integral*, erradicando qualquer menção residual ao termo ambíguo "regular". Renderização de crachás informativos padronizados (`☀️`, `⛅`, `🌟`) no Setup, Agenda, Semáforo Bimestral e Histórico.
- **Exportação CSV Enriquecida e Filtros Avançados:**
  Cabeçalho do arquivo CSV atualizado com colunas detalhadas (`Jornada_MEC`, `Tipo_Ocorrencia`, `Status_Conversado`, `Acordos_Pedagogicos`, `ID_Observacao_Origem`) e suporte a filtros rápidos no dropdown (`active`, `pending`, `resolved`, `archived`, `all`).
- **Auditoria Contínua com 100% de Aprovação:**
  Módulos 2 (Padronização MEC), 3 (Badge Setup MEC), 6 (Ocorrência de Turma, Conduta Individual e Ciclo Conversado), 9 (Filtros de Ocorrência) e 11 (Exportação CSV) enriquecidos com asserções automatizadas.

### [Versão 1.12] - Qualificação de Docentes por Turno (Manhã/Tarde) em Turmas Integrais e Higienização da Base de Dados
* **Data e Horário:** 22 de Outubro de 2026 – 14:45:00
* **Arquivo em Produção:** `index.html`
* **Arquivo Intermediário:** `intermediárias/aplicativo_v112_qualificacao_docentes_turnos_turmas_integrais.html`
* **Identificador no App:** 📌 Versão 1.12 (v7.90)
* **Hosting Oficial:** https://silvabrun0.github.io/supervisao-st-crianca/

#### 🚀 Modificações e Inclusões
- **Higienização Cadastral e Exclusividade Docente na Base Canônica:**
  Erradicação definitiva de acúmulo de turnos e escolas no catálogo inicial (`INITIAL_CLASSES` e `INITIAL_TEAM`). Alocação exclusiva de `Ana Carolina Silva` no Infantil I Matutino, `Carla Beatriz Mendes` no Berçário II Matutino, `Juliana Roberta Rocha` no Infantil II Vespertino, `Fernanda Lima` no Maternal I Matutino da EMEI Pequeno Príncipe e admissão da nova docente `Luciana Ramos` no Infantil I Vespertino. A turma de tempo integral do CEI Maria de Lourdes (`cls-pml-04`) passa a contar com quarteto próprio e exclusivo: `Mariana Santos` e `Roberta Dias` no Turno Matutino; `Patricia Souza` e `Camila Vasconcelos` no Turno Vespertino.
- **Painel Reativo de Qualificação de Turno no Setup (`#screenSetup`):**
  Ao selecionar uma turma em tempo integral (`isClassIntegral`), a equipe de regência é apresentada segregada visualmente em dois blocos verticais: *☀️ Turno Matutino (Manhã)* e *🌅 Turno Vespertino (Tarde)*. O observador dispõe de botões interativos `⇄ Passar p/ Tarde` e `⇄ Passar p/ Manhã` (`moveTeacherToShift`) para remanejar a alocação dos docentes com total autonomia e sincronização em tempo real.
- **Atribuição Parcial Seletiva por Etapa no Pilar 5:**
  No preenchimento de itens pontuados como parciais (`partial`), as opções de seleção de docentes regentes adaptam-se dinamicamente: na Etapa 1 (Matutina), a seleção é restrita às 2 docentes da manhã (`teachersMorning`), impedindo atribuições prematuras às docentes da tarde. Na Etapa 2 (Vespertina), toda a equipe de 4 docentes fica disponível para atribuição.
- **Sequenciamento Estrito na Síntese Pedagógica (`#screenSynthesis`):**
  Reestruturação da seção 4 de devolutivas nominais para renderizar primeiramente a *Subseção 4.1 · ☀️ Turno Matutino* (docentes da manhã) e, em seguida, a *Subseção 4.2 · 🌅 Turno Vespertino* (docentes da tarde). Cada docente conta com seus apontamentos de itens parciais isolados, avaliação independente nas 5 dimensões estruturantes e parecer formativo individual.
- **Auditoria Modular Contínua com 100% de Aprovação:**
  Enriquecimento determinístico dos Módulos 2 (Catálogo e Exclusividade Docente), 3 (Setup e Remanejamento de Turno), 4 (Atribuição Parcial Seletiva por Etapa) e 5 (Renderização Sequencial por Turno na Síntese Integral), totalizando 120 asserções automatizadas aprovadas em motor headless do Chrome.

### [Versão 1.11] - Pilar 11: Enxugamento Visual no Mobile com Pop-ups e Bottom Sheet de Apoio Pedagógico às Rubricas (ℹ️)
* **Data e Horário:** 22 de Outubro de 2026 – 14:30:00
* **Arquivo em Produção:** `index.html`
* **Arquivo Intermediário:** `intermediárias/aplicativo_v110_pilar_11_popups_rubricas_apoio_mobile.html`
* **Identificador no App:** 📌 Versão 1.11 (v7.89)
* **Hosting Oficial:** https://silvabrun0.github.io/supervisao-st-crianca/

#### 🚀 Modificações e Inclusões
- **Enxugamento Ergonômico de 45% no Smartphone:**
  Otimização substancial do espaço vertical nos cards de critério (`.crit-card`) na tela de observação ativa (`#screenActiveObs`). Textos extensos com listas de materiais e instruções entre parênteses são sintetizados no mobile com o indicador táctil `(mais...)`, mantendo o enunciado essencial visível e reduzindo drasticamente a rolagem necessária.
- **Gatilho Informativo Tátil e Acessível (`ℹ️`):**
  Inserção do botão `.btn-rubric-guidance-trigger` com ícone informativo discreto `ℹ️` no cabeçalho de cada critério na observação ativa e na sub-aba de Afunilamento de Indicadores (`.btn-rubric-drilldown-trigger`).
- **Modal / Bottom Sheet Deslizante de Apoio Pedagógico (`#modalRubricGuidance`):**
  Ao tocar no gatilho `ℹ️`, abre-se instantaneamente um painel tátil deslizante estruturado com a hierarquia da dimensão/subdimensão, enunciado canônico integral, card de orientações práticas ("O Que Observar"), card de exemplos concretos de chão de sala e régua formativa de gradação da escala (Consistente, Parcial, Não Realizado).
- **Repositório Canônico Formativo (`RUBRIC_GUIDANCE_DB`):**
  Mapeamento determinístico de orientações e evidências para a matriz curricular da Educação Infantil de Patos, disponível nativamente na aplicação com fallback inteligente para edições customizadas.
- **Enriquecimento da Bateria de Auditoria (100% de Aprovação):**
  Módulo 4 (`rubricas_observacao`) expandido com asserções estritas dos elementos do modal no DOM, renderização dos botões `ℹ️`, abertura e fechamento interativo via simulação comportamental, integridade da base de orientações e validação do helper de formatação móvel.

### [Versão 1.10] - Supressão de Disparo de Impressão e Preservação Contextual de Rota na Auditoria da Plataforma
* **Data e Horário:** 22 de Outubro de 2026 – 14:15:00
* **Arquivo em Produção:** `index.html`
* **Arquivo Intermediário:** `intermediárias/aplicativo_v110_supressao_impressao_preservacao_rota_auditoria.html`
* **Identificador no App:** 📌 Versão 1.10 (v7.88)
* **Hosting Oficial:** https://silvabrun0.github.io/supervisao-st-crianca/

#### 🚀 Modificações e Inclusões
- **Supressão de Disparo de Impressão Física (`window.print`):**
  Desacoplamento do disparo de impressão na função `printIndividualTeacherDevolutiva(teacherName, autoPrint = true)`, permitindo que a ficha formativa individual continue sendo inspecionada e testada no DOM durante a auditoria (Módulo 11) com `autoPrint = false`, sem acionar a caixa de diálogo nativa do navegador.
- **Guardião Global Defensivo Temporário:**
  Interceptação e supressão de qualquer chamada a `window.print` ao longo da execução da suíte de auditoria (`runFullPlatformAudit`), reativando a API original do navegador somente após a estabilização e encerramento seguro dos micro-timers no bloco `finally`.
- **Preservação e Restauração Contextual da Rota:**
  Captura da tela ativa e sub-abas antes da auditoria e restauração fiel no bloco `finally`, eliminando o redirecionamento indesejado para a Home ao concluir o diagnóstico e mantendo o usuário exatamente no contexto em que estava trabalhando.
- **Enriquecimento da Bateria de Auditoria (100% de Cobertura):**
  Módulos 11 (`backup_exportacao`) e 12 (`navegacao_layout`) atualizados com asserções de integridade estrutural e blindagem do guardião global de rotas.

### [Versão 1.09] - Pilar 10: Semáforo Anual do Ciclo Bimestral para Docentes Regentes Titulares
* **Data e Horário:** 22 de Outubro de 2026 – 14:00:00
* **Arquivo em Produção:** `index.html`
* **Arquivo Intermediário:** `intermediárias/aplicativo_v109_pilar_10_semaforo_docentes_regentes.html`
* **Identificador no App:** 📌 Versão 1.09 (v7.88)
* **Hosting Oficial:** https://silvabrun0.github.io/supervisao-st-crianca/

#### 🚀 Modificações e Inclusões
- **Visão Semafórica Completa de Docentes:**
  Resolução integral da visão de Docentes Regentes no Semáforo do Pilar 10, eliminando células em branco (`—`) e implementando o motor algorítmico `calculateTeacherBimesterStatus`.
- **4 Micro-cards de Resumo Decisório para Docentes:**
  Métricas em tempo real para Docentes em Atraso, Pendentes no Bimestre, Cobertos no Bimestre (com percentual de cobertura docente) e Avanço Geral do Ciclo Docente.
- **Barra de Filtros Rápidos de Status Docente:**
  Filtragem instantânea com 1 clique por Todos, Com Atraso, No Prazo, Cobertos e Ciclo 100%.
- **Matriz Semafórica e Ações Rápidas:**
  Pílulas com consistência ponderada e data, atalho para *📅 Agendar Turma* (pré-preenchido com a turma de lotação e próximo bimestre) e *🔍 Raio-X* (acesso imediato ao dossiê longitudinal item a item).
- **Cards Mobile Responsivos:**
  Adaptação móvel otimizada para smartphones com visualização vertical e mini-grade semafórica.
- **Auditoria Contínua com 100% de Cobertura:**
  Módulo 10 atualizado com asserções estritas dos 4 estados semafóricos, DOM e filtros interativos de docentes.

### [Versão 1.08] - Pilar 10: Quadro de Controle Bimestral e Semáforo de Prazos do Ciclo Anual por Turma
* **Data e Horário:** 21 de Outubro de 2026 – 21:30:00
* **Arquivo em Produção:** `index.html`
* **Arquivo Intermediário:** `intermediárias/aplicativo_v108_pilar_10_semaforo_bimestral_turmas.html`
* **Identificador no App:** 📌 Versão 1.08 (v7.87)
* **Hosting Oficial:** https://silvabrun0.github.io/supervisao-st-crianca/

#### 🚀 Modificações e Inclusões
- **Quadro Matricial de Controle por TURMA:**
  Reorganização da sub-aba Longitudinal centrada na Turma da Educação Infantil, acompanhando o ciclo obrigatório das 4 observações anuais com preservação da visão derivada de docentes titulares.
- **Semáforo Canônico de Prazos (Verde / Cinza / Vermelho):**
  Motor determinístico `calculateClassBimesterStatus` classificando 🟢 Concluída (com score percentual e data), 🔴 Atrasada (bimestre expirado com alerta pulsante), ⚪ No Prazo (janela regulamentar aberta de 2 meses) e ⚪ Ciclo Futuro.
- **Resumo Decisório e Micro-cards de Gestão:**
  Monitoramento imediato de turmas em atraso, pendências no bimestre ativo, total de observações anuais realizadas e percentual acumulado do ciclo longitudinal.
- **Filtros Rápidos e Ações Imediatas:**
  Chips de filtragem por status (Atrasadas, No Prazo, Concluídas) e atalhos com 1 toque para agendamento automático pré-preenchido no cronograma (`quickScheduleForClass`) ou início de observação direta (`quickStartObservationForClass`).
- **Ergonomia Mobile-First:**
  Cards adaptativos por turma no smartphone sem rolagem horizontal, com mini-grid 4 colunas de pílulas semafóricas táteis.
- **Auditoria Modular (100% de Cobertura):**
  Módulo `indicadores_decisao` expandido com asserções estritas dos 4 estados semafóricos, filtros e alternador de visão Turmas vs Docentes.

### [Versão 1.07] - Pilar 8: Correção da Alternância de Dados entre Menor Consistência e Maior Desvio vs. Rede Municipal
* **Data e Horário:** 21 de Outubro de 2026 – 21:00:00
* **Arquivo em Produção:** `index.html`
* **Arquivo Intermediário:** `intermediárias/aplicativo_v103_correcao_alternancia_gargalos_pilar_8.html`
* **Identificador no App:** 📌 Versão 1.07 (v7.86)
* **Hosting Oficial:** https://silvabrun0.github.io/supervisao-st-crianca/

#### 🚀 Modificações e Inclusões
- **Correção da Alternância Dinâmica de Dados e Critérios:**
  Resolução da causa raiz que mantinha critérios idênticos e deltas nulos (0%) ao alternar entre os modos *"📉 Menor Consistência"* e *"🔻 Maior Desvio vs. Rede"*. O motor agora ordena e filtra criteriosamente os gargalos pedagógicos com priorização dos deltas negativos mais acentuados ($\Delta < 0$).
- **Enriquecimento Multi-Unidade Escolar (`seedSampleData`):**
  Inclusão de observações finalizadas para a `EMEI Pequeno Príncipe` (docente Fernanda Lima e coordenadora Sônia Alcantara), gerando dispersão estatística e benchmark heterogêneo genuíno em relação à `CEI Professora Maria de Lourdes`.
- **Alerta Inteligente de Contexto em Rede Consolidada:**
  Inserção de aviso sutil e contextual quando o gestor analisa a visão de Rede Consolidada no modo delta, instruindo a seleção de uma escola específica para contraste comparativo.
- **Auditoria Modular Contínua (100% de Aprovação):**
  Expansão de asserções no Módulo 10 garantindo a alternância efetiva entre modos no DOM e validação de todas as 92 asserções automatizadas da suíte.

### [Versão 1.06] - Pilar 9: Botão Flutuante Circular com Lupinha no Canto Inferior Direito e Ocultação da Barra de Filtros no Mobile
* **Data e Horário:** 21 de Outubro de 2026 – 20:00:00
* **Arquivo em Produção:** `index.html`
* **Arquivo Intermediário:** `intermediárias/aplicativo_v106_pilar_9_mobile_fab_lupinha_filtros.html`
* **Identificador no App:** 📌 Versão 1.06 (v7.85)
* **Hosting Oficial:** https://silvabrun0.github.io/supervisao-st-crianca/

#### 🚀 Modificações e Inclusões
- **Botão Flutuante Circular com Lupinha (Canto Inferior Direito):**
  Substituição da barra horizontal de rodapé por um botão flutuante circular (52px) no canto inferior direito (`position: fixed; right: 18px; bottom: calc(var(--tabbar-height) + 16px)`), harmonizado no mesmo padrão ergonômico do FAB de ações da observação (`#fabActiveObs`), apresentando ícone nítido de lupa (`<svg>`) e ponto indicador luminoso quando filtros estão ativos.
- **Ocultação da Barra Desktop de Filtros no Celular:**
  A barra de filtros que ficava abaixo de "Índices para Diagnóstico" (`#indicatorsFilterToolbar`) agora é ocultada em smartphones (`@media (max-width: 768px)` com `display: none !important`), liberando 100% da área útil superior da tela e posicionando as sub-abas imediatamente após o título da tela.
- **Acesso Rápido e Focado via Bottom Sheet:**
  Ao tocar no botão circular da lupa, abre-se a gaveta deslizante inferior (`#modalIndicatorsFiltersMobile`) com os seletores verticais de Unidade Escolar, Turma/Docente e Bimestre de Referência, com botões para restaurar padrão ou aplicar instantaneamente.
- **Auditoria Modular Expandida (Módulo 10 e Módulo 12):**
  Validação determinística da presença do botão circular com lupinha (`#btnMobileIndicatorsFilters`), da presença de `#indicatorsFilterToolbar` para controle responsivo e do isolamento estrito de rotas.

---

### [Versão 1.05] - Remoção de Pautas Pré-fabricadas no Diagnóstico de Gargalos (Autonomia Formativa da Rede)
* **Data e Horário:** 21 de Outubro de 2026 – 19:30:00
* **Arquivo em Produção:** `index.html`
* **Arquivo Intermediário:** `intermediárias/aplicativo_v105_remocao_pautas_prefabricadas_autonomia.html`
* **Identificador no App:** 📌 Versão 1.05 (v7.84)
* **Hosting Oficial:** https://silvabrun0.github.io/supervisao-st-crianca/

#### 🚀 Modificações e Inclusões
- **Erradicação Completa de Textos Prescritivos e Pautas Pré-fabricadas:**
  Exclusão da função `getPedagogicalActionPrompt` e remoção física da caixa amarela (`.bottleneck-prompt-box`) dos cards de gargalos do Pilar 8, garantindo que o software não imponha textos ou diretrizes formativas pré-concebidas.
- **Autonomia Pedagógica e Reflexiva da Equipe Escolar:**
  Preservação da soberania da coordenação pedagógica, formadoras e professoras regentes para debaterem, interpretarem os dados e elaborarem livremente suas pautas e combinados de apoio em reuniões coletivas e HTPC.
- **Foco Estrito na Pureza dos Dados e Evidências:**
  Os cards de menores índices apresentam estritamente os fatos observados em sala: código e redação oficial do critério, localização por Dimensão/Subdimensão, índice percentual da unidade, benchmark municipal da Rede de Patos, variação relativa ($\Delta \pm\%$) e distribuição das respostas observadas (`Consistente`, `Parcial`, `Não Realizado`).
- **Resumo Diagnóstico na Área de Transferência (`📋 Copiar Diagnóstico`):**
  Ajuste do recurso de cópia para gerar um relatório objetivo e conciso com os 3 critérios prioritários e perguntas reflexivas norteadoras, sem ingerência de conteúdos artificiais.
- **Auditoria Automatizada com Teste Negativo (Módulo 10):**
  Inclusão de asserção negativa no motor de testes do `index.html` atestando que a caixa `.bottleneck-prompt-box` não é renderizada no DOM e que `getPedagogicalActionPrompt` não existe no escopo global.

---

### [Versão 1.04] - Correção da Autenticação na Auditoria Interativa, Blindagem contra Falsos Positivos e Fortalecimento E2E
* **Data e Horário:** 21 de Outubro de 2026 – 19:00:00
* **Arquivo em Produção:** `index.html`
* **Arquivo Intermediário:** `intermediárias/aplicativo_v104_correcao_autenticacao_auditoria_emulacao_e2e.html`
* **Identificador no App:** 📌 Versão 1.04 (v7.83)
* **Hosting Oficial:** https://silvabrun0.github.io/supervisao-st-crianca/

#### 🚀 Modificações e Inclusões
- **Resolução Canônica de Credenciais (`USERS_DB`):**
  Correção da digitação no formulário de login interativo durante a auditoria para utilizar o e-mail canônico oficial de Mariana (`mariana@teste.com`), erradicando a divergência com o e-mail fictício `mariana@patos.pb.gov.br`.
- **Blindagem Estrita contra Falsos Positivos:**
  Isolamento explícito de estado antes da simulação de login (`appState.currentUserKey = null;`), garantindo que tanto a rejeição de credenciais inválidas quanto o sucesso de credenciais válidas sejam aferidos sem contaminação pelo estado residual de sessões prévias.
- **Fortalecimento da Emulação E2E no Helper `UI`:**
  Inclusão de foco programático explícito (`el.focus()`) antes de digitações e seleções em elementos interativos do DOM.
- **Conformidade de Auditoria:**
  Aprovação de 100% dos testes da plataforma (90/90 asserções determinísticas nos 12 subsistemas).

---

### [Versão 1.03] - Pilar 9: Usabilidade Mobile First (Botão Pop-up de Filtros e Liberação do Viewport)
* **Data e Horário:** 21 de Outubro de 2026 – 18:30:00
* **Arquivo em Produção:** `index.html`
* **Arquivo Intermediário:** `intermediárias/aplicativo_v103_pilar_9_usabilidade_mobile_popup_filtros.html`
* **Identificador no App:** 📌 Versão 1.03 (v7.82)
* **Hosting Oficial:** https://silvabrun0.github.io/supervisao-st-crianca/

#### 🚀 Modificações e Inclusões
- **Liberação Total do Viewport Vertical no Celular:**
  Superação definitiva da compressão visual provocada por barras fixas (*sticky bars*), garantindo que 100% da altura do smartphone fique livre para leitura contínua das rubricas e réguas comparativas.
- **Gatilho Flutuante Compacto no Polegar (`#btnMobileIndicatorsFilters`):**
  Botão flutuante tipo *pill* localizado estrategicamente na base da tela (`bottom: calc(var(--tabbar-height) + 12px)`), dentro da zona natural do polegar (*thumb zone*), contendo ícone de engrenagem, rótulo formal e badge dinâmico contextual informando a configuração ativa (UE, avaliando e período).
- **Gaveta Deslizante Tátil (Bottom Sheet Modal `#modalIndicatorsFiltersMobile`):**
  Folha deslizante que sobe a partir da base do visor ao tocar no gatilho, apresentando alça de toque tátil, fechamento rápido (`✕`), seletores verticais para Unidade Escolar, Turma/Docente e Bimestre de Referência, além de botões para "Restaurar Padrão" e "✓ Aplicar e Fechar".
- **Filtro de Bimestre no Afunilamento e Benchmark:**
  Inclusão do seletor `#indicatorsBimesterFilter` tanto na barra do desktop quanto na folha móvel, permitindo filtrar o afunilamento de critérios por bimestre letivo (1º, 2º, 3º, 4º ou Ano Completo) com espelhamento transparente na média da Rede de Patos.
- **Auditoria Automatizada Expandida (Módulo 10 e Módulo 12):**
  Inclusão de asserções comportamentais no DOM cobrindo renderização do gatilho, abertura e fechamento da bottom sheet, sincronização bidirecional, teste de recálculo com 1º Bimestre e isolamento de rotas.

---

### [Versão 1.02] - Pilar 8: Diagnóstico de Prioridades Formativas (Bloco "Foco nos Menores Índices")
* **Data e Horário:** 21 de Outubro de 2026 – 18:00:00
* **Arquivo em Produção:** `index.html`
* **Arquivo Intermediário:** `intermediárias/aplicativo_v102_pilar_8_foco_menores_indices_gargalos.html`
* **Identificador no App:** 📌 Versão 1.02 (v7.81)
* **Hosting Oficial:** https://silvabrun0.github.io/supervisao-st-crianca/

#### 🚀 Modificações e Inclusões
- **Apresentação Automática dos 3 Menores Critérios Pedagógicos (Gargalos):**
  Implementação do bloco `#indicatorsSectionBottlenecks` logo abaixo dos 4 cards de KPIs da sub-aba de Índices Gerais, destacando os 3 pontos mais frágeis da unidade ou polo para servir de pauta imediata e concreta para as reuniões de alinhamento formativo e planejamento coletivo.
- **Dupla Perspectiva Algorítmica com Alternador Instantâneo:**
  1. *📉 Menor Consistência Absoluta (Padrão):* Prioriza os critérios com menor percentual de consistência na UE, aplicando como critério de desempate o maior desvio negativo ($\Delta$) frente à Rede de Patos.
  2. *🔻 Maior Desvio vs. Rede Municipal:* Prioriza os critérios com a maior defasagem negativa relativa ($\Delta \pm\%$) em relação à média geral municipal.
- **Card Pedagógico Rico por Gargalo:**
  Exibição do código oficial (`[1.1.2]`), texto descritivo da matriz, dimensão/subdimensão, mini grid comparativo (`Consistência na UE`, `Rede Patos` e `Variação Δ`), contadores de respostas (`C`, `P`, `NR`) e badge de gravidade contextual.
- **Pauta Formativa de Alinhamento e Exportação Rápida:**
  Geração contextualizada de diretrizes formativas práticas para reflexão com as professoras e recurso de cópia da pauta estruturada em texto/Markdown para a área de transferência (`📋 Copiar Pauta`).
- **Deep-Linking e Rastreabilidade no Afunilamento (`🔍 Ver no Afunilamento`):**
  Navegação direta para a sub-aba de Afunilamento com expansão programática da dimensão e subdimensão, rolagem suave até o critério e animação visual de pulso (`highlight-bottleneck-pulse`).
- **Atalho Interativo no Card 4 (Dimensão Prioritária):**
  Inclusão do link `🎯 Ver os 3 Critérios Críticos ↓` no Card 4 do Grid Superior de KPIs com scroll suave até o bloco de gargalos.
- **Auditoria Automatizada Modular (100% de Cobertura):**
  Atualização do Módulo 10 (`indicadores_decisao`) em `audit_platform.py` e na engine do browser validando a extração dos 3 gargalos, alternância de ordenação e deep-linking.

---

### [Versão 1.01] - Pilar 7: Extinção de Métricas Burocráticas e Reorganização Decisória de KPIs
* **Data e Horário:** 21 de Outubro de 2026 – 16:35:00
* **Arquivo em Produção:** `index.html`
* **Arquivo Intermediário:** `intermediárias/aplicativo_v101_pilar_7_extincao_metricas_burocraticas_kpis_decisorios.html`
* **Identificador no App:** 📌 Versão 1.01 (v7.80)
* **Hosting Oficial:** https://silvabrun0.github.io/supervisao-st-crianca/

#### 🚀 Modificações e Inclusões
- **Extinção Definitiva de Métricas Burocráticas e Cartoriais:**
  Remoção definitiva e completa dos cards `Observações Auditadas` (contagem bruta sem valor temporal) e `Itens Válidos / N.A.` (métrica estatística de depuração da matriz), eliminando ruídos que desviavam o foco da gestão pedagógica.
- **Higienização Residual no Dossiê do Docente:**
  Substituição da frase `critérios auditados na matriz` por `critérios avaliados na matriz` no card de balanço de critérios do Caso B da tela de Indicadores.
- **Função Canônica Global `getCurrentSchoolBimester()`:**
  Mapeamento determinístico do calendário escolar municipal de Patos/PB com base no relógio do sistema (1º Bimestre: Fev-Abr, 2º Bimestre: Mai-Jul, 3º Bimestre: Ago-Out, 4º Bimestre: Nov-Jan).
- **Grid Superior Reorganizado em 4 KPIs Decisórios de Alto Impacto:**
  1. *Índice de Consistência Geral:* Média ponderada formativa com semáforo qualitativo (Consistência Forte $\ge 80\%$, Atenção Necessária $60-79\%$, Alerta de Fragilidade $< 60\%$).
  2. *Cobertura no Bimestre Corrente (Destaque Máximo):* Card com borda semântica adaptativa exibindo turmas concluídas no bimestre ativo, percentual e alerta acionável de turmas pendentes (`⚠ N turma(s) pendente(s)`).
  3. *Meta do Ciclo Anual (Avanço Longitudinal):* Acompanhamento do progresso da meta obrigatória das 4 observações anuais por turma ($4 \times \text{Turmas}$) e quantitativo de turmas com ciclo iniciado.
  4. *Dimensão Prioritária (Gargalo da UE/Polo):* Identificação algorítmica da Grande Dimensão com menor índice de consistência formativa e exibição do $\Delta\%$ comparativo em relação à Rede Municipal de Patos.
- **Auditoria Modular Contínua (100% de Cobertura):**
  Atualização do Módulo 10 (`indicadores_decisao`) com asserções negativas estritas para garantir ausência das métricas extintas e testes determinísticos dos novos 4 cards e da função `getCurrentSchoolBimester()`.

---

### [Versão 1.00] - Higienização Terminológica Mandatória (Pilar 6: "Visita" ➔ "Observação")
* **Data e Horário:** 21 de Outubro de 2026 – 16:30:00
* **Arquivo em Produção:** `index.html`
* **Arquivo Intermediário:** `intermediárias/aplicativo_v100_pilar_6_higienizacao_terminologica_observacao.html`
* **Identificador no App:** 📌 Versão 1.00 (v7.79)
* **Hosting Oficial:** https://silvabrun0.github.io/supervisao-st-crianca/

#### 🚀 Modificações e Inclusões
- **Erradicação Universal do Vocábulo Policialesco "Visita":**
  Substituição completa e definitiva do termo "visita" por "observação" (e suas formas flexionadas "observações", "observar") em 100% da interface do usuário, englobando botões, modais, formulários, tabelas, relatórios em tela, espelho de impressão e toasts de notificação, em cumprimento à deliberação unânime da Reunião Técnica ST Criança (Minuto 00:19:27).
- **Tela Inicial (Home):**
  Cabeçalho atualizado para `🗓️ Minhas Próximas Observações Agendadas`, subtítulo harmonizado e botões de ação convertidos para `Iniciar Observação →` e `+ Agendar Nova Observação`.
- **Cronograma de Acompanhamento (Agenda):**
  Botão primário `+ Agendar Nova Observação`, filtros `Observações Ativas`, `Observações Arquivadas` e `Todas as Observações`, e Hero Card superior padronizado para `PRÓXIMA OBSERVAÇÃO` com botão `Iniciar Observação →`.
- **Modais de Agendamento e Seleção Prévia:**
  Títulos e contadores adaptados para `Planejar Observação no Cronograma` e seleção prévia informando a quantidade de observação(ões) planejada(s).
- **Setup e Síntese Pedagógica:**
  Campos e cartões oficiais padronizados para `Vincular a uma Observação Agendada no Cronograma:`, `Data e Horários da Observação Pedagógica`, `Síntese Final da Observação Pedagógica`, `📋 Dados da Observação & Profissional Acompanhado(a)` e botão `+ Importar Ocorrências da Observação`.
- **Painel de Indicadores e Dossiê Individual:**
  KPI atualizado para `Observações Concluídas`, evolução bimestral com badge `Aguardando Observação` e tabelas informando `Observações Finalizadas`.
- **Exportações e Backups:**
  Arquivos gerados renomeados para `sertao_crianca_observacoes.json` e `sertao_crianca_observacoes.csv`, com mensagens coerentes na UI.
- **Auditoria Modular Contínua (100% de Cobertura):**
  Correção da chamada residual em `catalogo_dados` (`renderTeamTable`), sincronização do Módulo 8 (`Cronograma de Observações, Destaque da Próxima Observação e Baixa Automática`) e adição de teste automatizado determinístico no Módulo 12 validando a ausência do termo "visita" no DOM ativo.

---

### [Versão 0.99] - Remoção de Badges e Avisos de Vinculação Automática na Gestão de Pessoal
* **Data e Horário:** 21 de Outubro de 2026 – 15:45:00
* **Arquivo em Produção:** `index.html`
* **Arquivo Intermediário:** `intermediárias/aplicativo_v99_remocao_avisos_vinculacao_automatica_pessoal.html`
* **Identificador no App:** 📌 Versão 0.99 (v7.78)
* **Hosting Oficial:** https://silvabrun0.github.io/supervisao-st-crianca/

#### 🚀 Modificações e Inclusões
- **Remoção do Badge "Auto via UE" na Listagem de Equipe:**
  Na tabela da aba de Equipe & Profissionais da Rede (`#teamTableBody`), foi suprimido o badge textual e estilizado `"Auto via UE"` que acompanhava o superior imediato de docentes. A coluna de vinculação exibe puramente o nome da Coordenadora Pedagógica da unidade (ou superior direto), mantendo o layout limpo e consistente com os demais cargos da rede.
- **Remoção do Alerta Informativo no Modal de Novo Profissional:**
  Eliminação do elemento `<div id="newMemberTeacherRuleNote">` e das chamadas que manipulavam sua visibilidade em `onNewMemberRoleChange()`, removendo o card azul com o texto de aviso de vinculação automática ao selecionar a função de professora.
- **Remoção do Alerta Informativo no Modal de Edição de Profissional:**
  Eliminação do elemento `<div id="editMemberTeacherRuleNote">` e das manipulações de estilo associadas em `onEditMemberRoleChange()`, retirando a mensagem repetitiva de vinculação automática durante a edição de registros de docentes.
- **Preservação Integral da Regra de Negócio de Apoio à Decisão:**
  A vinculação automática hierárquica e funcional permanece 100% ativa no motor JavaScript. Ao atribuir uma docente à Unidade Escolar, o sistema resolve a Coordenadora Pedagógica correspondente, preservando os fluxos avaliativos, a árvore de permissões RBAC, o histórico longitudinal e o Painel de Indicadores.
- **Auditoria Modular Contínua (100% de Cobertura):**
  Adição de asserções estritas no módulo `catalogo_dados` validando que a tabela de profissionais não contém o badge `"Auto via UE"` e que os contêineres informativos de vinculação automática foram integralmente expurgados do DOM.

---

### [Versão 0.98] - Pilar 5: Fechamento Nominal com Parecer em Práticas Consistentes, Atribuição Mandatória Parcial e Devolutiva Individual Segregada
* **Data e Horário:** 21 de Outubro de 2026 – 15:30:00
* **Arquivo em Produção:** `index.html`
* **Arquivo Intermediário:** `intermediárias/aplicativo_v98_pilar_5_fechamento_nominal_atribuicao_parcial.html`
* **Identificador no App:** 📌 Versão 0.98 (v7.77)
* **Hosting Oficial:** https://silvabrun0.github.io/supervisao-st-crianca/

#### 🚀 Modificações e Inclusões
- **Atribuição Mandatória em Itens Parciais:**
  Ao pontuar qualquer critério da matriz de rubricas como `"Parcial"`, o sistema expande dinamicamente no card do item o container `#partial-attribution-box-[id]`, exigindo seleção ativa do(a) docente regente responsável e justificativa textual com pelo menos 5 caracteres.
- **Incentivo e Registro de Práticas Consistentes:**
  Critérios marcados como `"Consistente"` recebem o badge de incentivo `✨ Prática Consistente · Evidência de Boa Prática` e orientam o registro de boas práticas para subsídio formativo e replicação na rede municipal de Patos.
- **Motor de Pendências em Tempo Real (`getObservationPendencies`):**
  Identifica itens parciais incompletos (sem docente ou justificativa < 5 caracteres) como pendências críticas impeditivas de finalização.
- **Blocos Finais Nominais por Professor(a) Regente na Síntese (`#screenSynthesis`):**
  Nova seção `"4. Avaliação Nominal e Devolutiva por Professor(a) Regente"` exibindo cards individuais com avaliação sintetizada nas 5 dimensões canônicas (`Consistente`, `Parcial`, `Não Realizado`), consolidação automática de critérios parciais atribuídos ao docente e parecer formativo individual.
- **Validação Mandatória na Finalização (`finalizeObservation`):**
  Exige a avaliação das 5 dimensões e parecer descritivo de cada docente regente titular da turma antes de permitir o fechamento em modo somente leitura.
- **Exportação Parametrizada de PDF Segregado (`#modalExportPdfOptions`):**
  Modal de escolha entre o *Relatório Geral Integrado da Turma* e a *Ficha Individual Formativa de Devolutiva Pedagógica* de cada professor(a) regente.
- **Template de Impressão Segregada:**
  Injeção de `#teacherIndividualDevolutivaPrintSection` para geração de PDF formal de 1 a 2 páginas por professor com notas, itens parciais, parecer e campos de assinatura formal do supervisor e do docente.
- **Auditoria Automatizada Completa:**
  Expansão do algoritmo de auditoria para 75 asserções determinísticas nos 12 módulos canônicos com 100% de aprovação.

---

### [Versão 0.97] - Simplificação do Modal de Ocorrências de Campo e Vinculação Estrita à Observação Ativa (Pilar 1)
* **Data e Horário:** 21 de Outubro de 2026 – 14:30:00
* **Arquivo em Produção:** `index.html`
* **Arquivo Intermediário:** `intermediárias/aplicativo_v97_simplificacao_modal_ocorrencias.html`
* **Identificador no App:** 📌 Versão 0.97 (v7.76)
* **Hosting Oficial:** https://silvabrun0.github.io/supervisao-st-crianca/

#### 🚀 Modificações e Inclusões
- **Vinculação Estrita à Observação em Andamento:** Ocorrências de campo passam a ser obrigatoriamente vinculadas à observação pedagógica ativa (`appState.currentObs`). Tentativas de abertura sem observação em andamento recebem aviso orientador imediato via Toast.
- **Agilidade e Redução de Atrito Cognitivo:** Abertura do modal prepara instantaneamente o seletor de docentes da turma avaliada, mantendo a trava inteligente para turmas de docente único titular e a escolha simples para duplas regentes.
- **Padronização do Tópico Formativo:** O campo `topic` passa a adotar o valor unificado `'Ocorrência de Campo'`, preservando a compatibilidade integral com a exportação CSV, Síntese Final e histórico.

#### 🗑️ Exclusões
- **Supressão do Alerta Azul Redundante:** Remoção completa do elemento `#noteObsContextAlert` (*"🔒 Observação em andamento: Este registro será vinculado exclusivamente à visita da turma..."*).
- **Remoção de UE/Polo e Turma no Formulário:** Exclusão dos seletores `#noteSchool` e `#noteClass` e seus contêineres, pois a unidade e a turma são herdadas estritamente da avaliação ativa.
- **Remoção de Dimensão/Tópico:** Supressão do dropdown `#noteTopic`, eliminando a necessidade de categorização burocrática prematura.

---

### [Versão 0.96] - Otimização de UX no Setup da Observação (Pilar 4: Remoção de Textos de Orientação)
* **Data e Horário:** 21 de Outubro de 2026 – 14:00:00
* **Arquivo em Produção:** `index.html`
* **Arquivo Intermediário:** `intermediárias/aplicativo_v96_remocao_avisos_orientacao_setup_pilar4.html`
* **Identificador no App:** 📌 Versão 0.96 (v7.75)
* **Hosting Oficial:** https://silvabrun0.github.io/supervisao-st-crianca/

#### 🚀 Inclusões e Otimizações
- **Remoção da Caixa Explicativa de Unidade de Análise (`#setupRoleHint`):**
  - Ocultação definitiva do bloco informativo de topo do formulário na abertura com perfil de Coordenador.
  - Eliminação de ruído cognitivo e textos estáticos redundantes, direcionando imediatamente a coordenadora aos seletores operacionais.
- **Supressão de Orientação Pedagógica no Card de Docentes Regentes (`#groupSetupTeachersCard`):**
  - Exclusão do aviso textual em itálico sobre a composição de duplas e quartetos no município de Patos.
  - Preservação estrita dos elementos funcionais: cabeçalho com ícone, badge do turno da turma (`#setupClassShiftBadge`) e listagem dinâmica dos badges das docentes regentes titulares (`#setupClassTeachersList`).
- **Expansão da Bateria de Testes Automatizados (Módulo 3 - `setup_longitudinal`):**
  - Adição de asserções que verificam se `#setupRoleHint` está oculto/limpo e se a mensagem sobre "duplas ou quartetos" não consta no card de professores regentes.

---

### [Versão 0.95] - Auditoria Interativa Comportamental End-to-End (Simulação Real de Ações do Usuário)
* **Data e Horário:** 20 de Outubro de 2026 – 17:55:00
* **Arquivo em Produção:** `index.html`
* **Arquivo Intermediário:** `intermediárias/aplicativo_v95_auditoria_interativa_comportamental_end_to_end.html`
* **Identificador no App:** 📌 Versão 0.95 (v7.74)
* **Hosting Oficial:** https://silvabrun0.github.io/supervisao-st-crianca/

#### 🚀 Inclusões e Funcionalidades
- **Simulação Comportamental Real no DOM (UI Helper):**
  - Implementação dos utilitários canônicos `UI.click`, `UI.type` e `UI.select` que despacham eventos reais do navegador (`input`, `change`, `click`).
  - Asserção mandatória de retenção do valor selecionado em `<select>` após qualquer disparo de eventos reativos (`selectEl.value === value`), prevenindo regressões de reset silencioso de interface.
- **Fluxo Completo de Login e Rejeição no DOM:**
  - Simulação de tentativa de autenticação com credencial incorreta e verificação visual do alerta de erro (`#loginError`).
  - Submissão com sucesso via credenciais de Coordenadora Pedagógica e validação da transição de estado da sessão.
- **Ciclo de Vida Completo de Cadastro e Edição de Servidores:**
  - Abertura de `#modalAddMember`, preenchimento de inputs, seleção e retenção de unidade escolar (`#newMemberSchool`), clique em salvar e posterior teste de edição em `#modalEditMember`.
- **Interações Reais de Agenda, Setup e Ocorrências de Campo:**
  - Criação de agendamentos e registros de observação via clique no botão primário `#btnStartObservation` e modal de ocorrências formativas.

---

### [Versão 0.94] - Pilar 4: Turmas em Tempo Integral em Formulário Único (2 Etapas: Manhã e Tarde)
* **Data e Horário:** 20 de Outubro de 2026 – 17:45:00
* **Arquivo em Produção:** `index.html`
* **Arquivo Intermediário:** `intermediárias/aplicativo_v94_pilar_4_turmas_integrais_formulario_unico.html`
* **Identificador no App:** 📌 Versão 0.94 (v7.73)
* **Hosting Oficial:** https://silvabrun0.github.io/supervisao-st-crianca/

#### 🚀 Inclusões e Funcionalidades
- **Formulário Único em Duas Etapas:** Preservação da unidade pedagógica da turma de tempo integral e do planejamento coletivo do quarteto de professores regentes titulares, com acompanhamento sequencial em dois turnos (Manhã e Tarde).
- **Salvamento e Transição da Etapa Matutina (`saveMorningStageAndExit`):** Registro fidedigno dos horários matutinos, persistência como rascunho com avanço automático para a Etapa 2 (Vespertino) e feedback orientador para retorno no turno da tarde.
- **Banner Contextual de Etapa Ativa (`#activeObsIntegralBanner`):** Sinalização em tempo real na tela de observação ativa da fase em andamento (Etapa 1/2: Turno Matutino vs. Etapa 2/2: Turno Vespertino).
- **Registro de Período Duplo na Síntese Final:** Bloco dedicado de período com cálculo somado e consolidado da carga horária de ambos os turnos (`totalIntegralDurationMinutes`).
- **Bloqueio Pedagógico de Finalização Prematura:** Validação mandatória impedindo o encerramento do formulário de turma integral antes do cumprimento dos dois períodos de observação.

---

### [Versão 0.93] - Correção da Seleção de Unidade Escolar no Cadastro de Novo Profissional
* **Data e Horário:** 20 de Outubro de 2026 – 17:35:00
* **Arquivo em Produção:** `index.html`
* **Arquivo Intermediário:** `intermediárias/aplicativo_v93_correcao_selecao_unidade_novo_profissional.html`
* **Identificador no App:** 📌 Versão 0.93 (v7.72)
* **Hosting Oficial:** https://silvabrun0.github.io/supervisao-st-crianca/

#### 🛠️ Correções e Estabilidade
- **Preservação de Seleção de Unidade Escolar / Polo no Modal de Novo Profissional:**
  - Correção de bug no fluxo reativo de `onNewMemberRoleChange()`: ao trocar a opção no seletor `#newMemberSchool`, o evento `onchange` reconstruía as opções do `<select>` sem preservar o valor recém-selecionado, fazendo o dropdown reverter compulsoriamente para o primeiro item da lista.
  - Implementação de retenção segura do valor ativo através da checagem e atribuição condicional (`schoolSelect.value = currentSchoolVal`), permitindo a livre atribuição de qualquer unidade da rede municipal ao novo membro.

---

### [Versão 0.92] - Pilar 3: Benchmark Comparativo '% da UE vs. Rede' no Afunilamento de Indicadores
* **Data e Horário:** 20 de Outubro de 2026 – 17:30:00
* **Arquivo em Produção:** `index.html`
* **Arquivo Intermediário:** `intermediárias/aplicativo_v92_pilar_3_benchmark_afunilamento_ue_vs_rede.html`
* **Identificador no App:** 📌 Versão 0.92 (v7.71)
* **Hosting Oficial:** https://silvabrun0.github.io/supervisao-st-crianca/

#### 🚀 Inclusões e Funcionalidades
- **Régua Dupla de Benchmark (Dual-Progress Ruler) no Afunilamento:**
  1. *Nível 1 (Grande Dimensão):* Header do accordion exibindo simultaneamente a consistência da UE (`Minha UE: [barra] XX%`) e a Média Geral da Rede Municipal (`Rede: [barra] YY%`), complementada pelo badge e resumo de variação percentual.
  2. *Nível 2 (Subdimensão):* Subheader exibindo a comparação das duas métricas com barras compactas e o delta (`UE: XX% | Rede: YY% | Δ: ±Z%`).
  3. *Nível 3 (Critério / Item Individual):* Card de critério com faixa de benchmark dedicada destacando `% Minha UE`, `% Rede Patos` e a categorização semântica automática.
- **Categorização Semântica Automática de Deltas ($\Delta \pm\%$):**
  - `🔻 Atenção Crítica` ($\Delta \le -10\%$): Alerta prioritário para planos de formação e intervenção pedagógica focalizada.
  - `🔻 Abaixo da Média` ($-10\% < \Delta < 0\%$): Indicador de atenção e acompanhamento contínuo.
  - `⚪ Na Média` ($\Delta = 0\%$): Alinhamento com a realidade consolidada do município.
  - `🟢 Acima da Média` ($0\% < \Delta < +10\%$): Desempenho pedagógico favorável.
  - `🟢 Destaque Positivo` ($\Delta \ge +10\%$): Boas práticas e evidências consolidadas na unidade escolar.
- **Motor Canônico de Agregação Hierárquica (`calculateHierarchyStats`):** Função utilitária centralizada e determinística que calcula a árvore de dimensões, subdimensões e critérios para qualquer lista de observações, com tratamento defensivo contra divisão por zero (`totalValid === 0 ➔ null / "— Sem dados"`).
- **Banner Informativo de Contexto do Benchmark:** Faixa informativa no topo do Afunilamento exibindo dinamicamente o escopo em comparação (`Minha UE`, `Meu Polo` ou `Rede Consolidada`) e a base total de observações consolidadas na rede de Patos.
- **Adaptação à Tríade de Governança (Pilar 2):** Resolução contextualizada e instantânea para Coordenadoras de UE, Formadoras Pedagógicas por Polo e Coordenadora do Núcleo de EI.
- **Auditoria Modular Integral (100% de Cobertura):** Módulo 10 (`indicadores_decisao`) expandido com validação determinística de cálculo do motor canônico, conferência exata de deltas percentuais com categorização de Atenção Crítica e teste de renderização da sub-aba no DOM.

---

### [Versão 0.91] - Pilar 2: Tríade Canônica de Governança em 3 Níveis & Coordenadora do Núcleo de EI
* **Data e Horário:** 20 de Outubro de 2026 – 16:30:00
* **Arquivo em Produção:** `index.html`
* **Arquivo Intermediário:** `intermediárias/aplicativo_v91_pilar_2_triade_governanca_e_nucleo_ei.html`
* **Identificador no App:** 📌 Versão 0.91 (v7.70)
* **Hosting Oficial:** https://silvabrun0.github.io/supervisao-st-crianca/

#### 🚀 Inclusões e Funcionalidades
- **Consolidação da Tríade Canônica de Governança (3 Níveis):** Alinhamento conceitual e operacional estrito dos três níveis de autoridade pedagógica do SerTão Criança:
  1. *Nível 1 - Coordenadora Pedagógica da UE:* Atuação restrita à sua própria escola (`user.school`), cadastrando turmas, acompanhando professoras e realizando observações formativas de campo.
  2. *Nível 2 - Formadora Pedagógica:* Atuação circunscrita às unidades e coordenadoras do seu Polo Regional atribuído, realizando a tutoria e acompanhamento formativo da gestão escolar.
  3. *Nível 3 - Coordenadora do Núcleo de Educação Infantil:* Autoridade pedagógica máxima e gestora central da rede, com acesso irrestrito e onisciente às 32 UEs, consolidados e gestão de formadores, sem aplicação de avaliações diretas em sala de aula.
- **Transição Terminológica e Institucional:** Extinção do termo burocrático e genérico "Equipe Técnica" na interface, sendo 100% substituído por "Coordenadora do Núcleo de Educação Infantil" (ou "Núcleo de EI"), fixando Helena Martins como titular central no modal de troca de perfil (`#modalRole` / `#roleBoxTecnico`).
- **Camada de Compatibilidade Canônica `isNucleoEI(user)`:** Criação de função utilitária global e resiliente que processa objetos de usuário ou strings de perfil, validando tanto o novo identificador canônico `'nucleo_ei'` quanto a chave legada `'tecnico'`, assegurando zero breaking changes para sessões e registros preexistentes em `localStorage`.
- **Blindagem RBAC e Visão Onisciente:** Parametrização em `getScopedAvaliandos()`, `getScopedObservations()`, `getScopedNotes()`, `getScopedSchedules()` e `renderIndicatorsScreen()` garantindo escopo total e irrestrito da rede (todas as 32 UEs) para o Núcleo de EI.
- **Trava Mandatória contra Avaliações Diretas:** Bloqueio explícito em `handleNewObsButtonClick()` e `startNewObservation()` com emissão de toast orientador (*"A Coordenadora do Núcleo de EI não aplica avaliações diretas."*), preservando o foco na formulação de políticas formativas e governança macro.
- **Gestão de Servidores e Normalização Inteligente:** Atualização dos modais de cadastro e edição de servidores com opção `"Coordenadora do Núcleo de EI (Acesso Global)"`, supervisão de Formadoras vinculada a Helena Martins e inteligência em `normalizeRoleData()` para converter termos como "núcleo", "secretaria", "gestão" e "ei" em `nucleo_ei`.
- **Auditoria Modular Integral (100% Cobertura):** Módulos `auth_rbac` e `formadora_coordenacao` enriquecidos com validações de integridade dos 4 perfis centrais (`mariana`, `clarice`, `helena`, `rodrigo`), dupla compatibilidade de `isNucleoEI()`, escopo onisciente de observações e trava de início de avaliação direta.

---

### [Versão 0.90] - Pilar 1: Ocorrências de Campo Atribuídas à Turma da Educação Infantil e Seleção de Docente
* **Data e Horário:** 20 de Outubro de 2026 – 16:00:00
* **Arquivo em Produção:** `index.html`
* **Arquivo Intermediário:** `intermediárias/aplicativo_v90_ocorrencias_campo_turma_docente.html`
* **Identificador no App:** 📌 Versão 0.90 (v7.69)
* **Hosting Oficial:** https://silvabrun0.github.io/supervisao-st-crianca/

#### 🚀 Inclusões e Funcionalidades
- **Inversão da Unidade de Registro para a TURMA (Pilar 1):** O formulário `#modalQualitativeNote` passa a exigir a seleção primária da Turma da Educação Infantil (`#noteClass`) logo após a unidade escolar.
- **Reconhecimento e Trava para Docente Único:** Para turmas com regência unívoca (`teachers.length === 1`), o sistema preenche e trava automaticamente o campo de docente (`disabled = true`) com badge informativo (`🔒 Docente único regente da turma`).
- **Seleção Ativa de Docente em Regência Compartilhada:** Para turmas de período parcial com dupla de titulares (`teachers.length >= 2`), o seletor permanece habilitado para escolha entre o Professor A ou Professor B, permitindo qualificar com fidelidade a intervenção.
- **Vínculo Automático com Observação Ativa:** Abertura via atalho na visita em andamento fixa e desabilita automaticamente Escola e Turma a partir de `currentObs`.
- **Enriquecimento Estrutural de Dados:** Cada ocorrência registra `className`, `classId`, `targetType: 'turma'`, `teacherName` e `teachers`.
- **Cards e Síntese Atualizados:** Cards do bloco de notas exibem com destaque tipográfico a Turma e o Docente; importação na Síntese Pedagógica vincula ocorrências daquela turma.
- **Exportação CSV Enriquecida:** Inclusão da coluna `Turma` no cabeçalho e dados de exportação em `exportAllNotesCSV()` e `exportNotesFilteredCSV()`.
- **Auditoria Modular Integral:** Módulos `travas_seguranca`, `sintese_finalizacao` e `navegacao_layout` enriquecidos com asserções determinísticas de 100% de cobertura.

---

### [Versão 0.89] - Visualização da Devolutiva da Observação pela Aba de Agenda
* **Data e Horário:** 20 de Outubro de 2026 – 15:30:00
* **Arquivo em Produção:** `index.html`
* **Arquivo Intermediário:** `intermediárias/aplicativo_v89_visualizar_devolutiva_agenda.html`
* **Identificador no App:** 📌 Versão 0.89 (v7.68)
* **Hosting Oficial:** https://silvabrun0.github.io/supervisao-st-crianca/

#### 🚀 Inclusões e Funcionalidades
- **Botão de Visualização de Devolutiva na Agenda:** Introdução do botão "📋 Devolutiva" na tabela desktop e "📋 Ver Devolutiva" nos cards mobile para visitas com status realizado ou com observação finalizada vinculada.
- **Função Relacional `findObservationForSchedule()`:** Resolução determinística e tolerante a falhas que localiza a observação pelo `observationId`, `scheduleId` ou por metadados equivalentes (escola, bimestre, turma/docente).
- **Vínculo Imediato em `finalizeObservation()`:** Registro explícito de `sched.observationId = obs.id` na finalização de novas observações.
- **Retorno Contextual Dinâmico:** Botão "← Voltar" na barra `#readOnlyWarning` e botão dinâmico "Voltar à Agenda" no rodapé da Síntese Final (`#screenSynthesis`).
- **Suporte a Visitas Arquivadas:** Exibição do botão de devolutiva mesmo para visitas concluídas que estejam arquivadas.
- **Auditoria Modular Aprimorada:** Módulo `agenda_cronograma` expandido com testes determinísticos de identificação de devolutiva e navegação contextual segura.

---

### [Versão 0.88] - Registro Manual e Fidedigno de Horários da Visita Pedagógica
* **Data e Horário:** 20 de Outubro de 2026 – 15:15:00
* **Arquivo em Produção:** `index.html`
* **Arquivo Intermediário:** `intermediárias/aplicativo_v88_registro_manual_horarios_observacao.html`
* **Identificador no App:** 📌 Versão 0.88 (v7.67)
* **Hosting Oficial:** https://silvabrun0.github.io/supervisao-st-crianca/

#### 🚀 Inclusões e Funcionalidades
- **Eliminação da Sobrescrita Automática de Horários:** Remoção definitiva da imposição do relógio em `finalizeObservation()`, garantindo que os horários anotados representem o momento real da visita pedagógica.
- **Campos Editáveis no Setup e Síntese:** Entradas interativas de Data, Horário de Início e Horário Previsto de Término com validação temporal.
- **Recálculo Dinâmico de Duração:** Atualização automática e em tempo real da duração ao alterar os horários na Síntese Final.
- **Imutabilidade Pós-Finalização:** Bloqueio de edição e crachá consolidado após finalização da observação.
- **Auditoria Modular Aprimorada:** Módulo `sintese_finalizacao` com testes determinísticos de consistência temporal e preservação exata dos horários.

---

### [Versão 0.87] - Atribuição, Agendamento e Início de Observação por Turma (Pilar 1)
* **Data e Horário:** 20 de Outubro de 2026 – 14:30:00
* **Arquivo em Produção:** `index.html`
* **Arquivo Intermediário:** `intermediárias/aplicativo_v87_atribuicao_agendamento_turma.html`
* **Identificador no App:** 📌 Versão 0.87 (v7.66)
* **Hosting Oficial:** https://silvabrun0.github.io/supervisao-st-crianca/

#### 🚀 Inclusões e Funcionalidades
- **Agendamento por Turma:** Modal de planejamento adaptado para Coordenadoras com rótulo "Turma da Educação Infantil a ser Observada" e seleção prioritária da turma com painel de docentes titulares.
- **Cálculo Longitudinal da Turma:** Sugestão automática de próximo bimestre baseada no histórico da turma.
- **Hero Card e Cronograma Geral:** Identificação clara da turma e equipe regente titular nos cards e listagens.
- **Auditoria Modular Expandida:** Módulo `agenda_cronograma` validando criação e avanço de agendamentos centrados na turma.

---

### [Versão 0.86] - Arquitetura Modular da Suíte de Auditoria (12 Módulos Modo-a-Modo)
* **Data e Horário:** 20 de Outubro de 2026 – 14:10:00
* **Arquivo em Produção:** `index.html`
* **Arquivo Intermediário:** `intermediárias/aplicativo_v86_auditoria_modular.html`
* **Identificador no App:** 📌 Versão 0.86 (v7.65)
* **Hosting Oficial:** https://silvabrun0.github.io/supervisao-st-crianca/

#### 🚀 Inclusões e Funcionalidades
- **Arquitetura Modular da Suíte de Auditoria:** Implementação dos 12 módulos determinísticos modo-a-modo com cobertura 100% da plataforma.
- **Sincronização Normativa de Workflows:** Atualização dos arquivos `WORKFLOW_MACOS.md`, `AGENTS.md` e `GEMINI.md` com protocolo de comunicação restrita a problemas.

---

### [Versão 0.83] - Remoção do Bloco Indicadores Docentes na Coordenação e Restauração de Professoras na Formadora
* **Data e Horário:** 15 de Outubro de 2026 – 17:45:00
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///c:/Users/Diogo/Documents/gestor%20supervisao_patos/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v83_ajuste_indicadores_coordenador_e_formadora.html`](file:///c:/Users/Diogo/Documents/gestor%20supervisao_patos/gestor%20supervisao_patos/intermediárias/aplicativo_v83_ajuste_indicadores_coordenador_e_formadora.html)
* **Base / Insumos:** Solicitação direta do usuário reportando que na aba de índices do coordenador deveria ser retirado o bloco "indicadores docentes", e que para a formadora as professoras haviam sumido e tudo aparecia zerado.
* **Identificador no App:** `📌 Versão 0.83 (v7.62)`
* **Hosting Oficial:** [https://supervisao-st-crianca.web.app](https://supervisao-st-crianca.web.app)
* **Contexto:** Ajuste estrito de governança visual e escopo no Painel de Indicadores (`#screenIndicators`). Para a Coordenação Pedagógica, a coluna/bloco de seletor de Público-Alvo com o badge "Indicadores Docentes" foi integralmente ocultada por ser redundante (coordenadores avaliam exclusivamente professoras da sua escola). Para a Formadora Pedagógica, restaurou-se a inicialização automática do seletor em "Professores(as)", corrigindo o estado em que os seletores apontavam para Coordenadores com dados zerados, voltando a listar imediatamente todas as docentes ativas das escolas sob sua supervisão e exibindo todas as avaliações e gráficos consolidados.

#### 🚀 Inclusões e Funcionalidades
- **Remoção Limpa do Bloco "Indicadores Docentes" para Coordenação:** O container `#indicatorsTargetTypeWrapper` tem exibição ocultada (`style.display = 'none'`) para perfis de Coordenação e Docência, fazendo com que a barra de filtros inicie diretamente com os seletores úteis: Unidade Escolar, Professora e Exportar Relatório PDF.
- **Público-Alvo Padrão "Professores(as)" na Formadora:** Para a Formadora Pedagógica, o seletor `#indicatorsTargetTypeFilter` inicializa com valor `'professora'`, carregando de imediato as turmas e docentes vinculadas ao seu polo regional e escolas supervisionadas.
- **Exibição Completa de Indicadores e KPIs na Formadora:** Com a resolução correta de avaliandos docentes no escopo da formadora, todos os KPIs, médias das dimensões, gráficos de afunilamento e relatórios longitudinais voltam a apresentar os dados das visitas pedagógicas concluídas (eliminando cards com 0% e estado zerado).
- **Flexibilidade Preservada:** A Formadora continua com o seletor de Público-Alvo disponível (`display: flex`) para, caso deseje, alternar manualmente para "Coordenadores(as)" para auditar acompanhamentos da coordenação.

#### 🛡️ Modificações e Governança
- **Blindagem na Resolução de Escopo:** Em `getScopedAvaliandos`, `getScopedObservations`, `getScopedNotes` e `renderIndicatorsScreen`, a identificação das escolas sob supervisão da Formadora combina tanto o polo regional quanto as coordenadoras ativas supervisionadas, garantindo que mesmo com variações de nomenclatura de polo nenhuma docente seja omitida.
- **Prevenção de ReferenceError em Filtros:** Implementação explícita e segura da função `syncIndicatorsFilterUI()`, eliminando eventuais falhas de execução ao disparar eventos nos seletores.
- **Reset de Filtros na Troca de Sessão:** A função `selectUserAccount()` agora redefine os seletores de Unidade e Avaliando para 'ALL', garantindo uma visão limpa e sem resquícios de filtros anteriores ao alternar entre perfis.
- **Atualização da Identificação de Versão:** Elevação oficial para `📌 Versão 0.83 (v7.62)` no cabeçalho superior, modal `#modalChangelog` e documentação técnica.

---

### [Versão 0.82] - Correção e Enquadramento Responsivo dos Campos de Data no Histórico
* **Data e Horário:** 15 de Outubro de 2026 – 17:30:00
* **Arquivo Intermediário:** [intermediárias/aplicativo_v82_ajuste_layout_datas_historico.html](file:///c:/Users/Diogo/Documents/gestor%20supervisao_patos/gestor%20supervisao_patos/intermediárias/aplicativo_v82_ajuste_layout_datas_historico.html)
* **Plano de Implementação:** [planos_de_implementacao/plano_ajuste_layout_datas_historico.md](file:///c:/Users/Diogo/Documents/gestor%20supervisao_patos/gestor%20supervisao_patos/planos_de_implementacao/plano_ajuste_layout_datas_historico.md)
* **Base / Insumos:** Solicitação direta do usuário com envio de print do iPhone Safari indicando má disposição e colisão dos campos de data / Workflow oficial ([WORKFLOW.md](file:///c:/Users/Diogo/Documents/gestor%20supervisao_patos/gestor%20supervisao_patos/WORKFLOW.md)).
* **Identificador no App:** 📌 Versão 0.82 (v7.61)
* **Hosting Oficial:** [https://supervisao-st-crianca.web.app](https://supervisao-st-crianca.web.app)
* **Contexto:** No iPhone Safari (iOS WebKit), os inputs nativos de data insistiam em uma largura intrínseca mínima de ~170px, fazendo com que o primeiro campo (*Data Inicial*) transbordasse para a direita tocando o segundo campo (*Data Final*), e este transbordasse para fora da margem direita do card de filtros. Além disso, a combinação de pseudo-elementos em um único seletor com vírgula causava o descarte total das regras de tipografia e espaçamento pelo parser do WebKit.

#### 📥 Inclusões e Blindagens Técnicas
- **Reset Rígido de Aparência (ppearance: none !important; -webkit-appearance: none !important;):** Força o WebKit a renderizar o input como um controle comprimível sem impor a largura mínima nativa do sistema operacional.
- **Desagregação de Pseudo-elementos:** Isolamento de ::-webkit-date-and-time-value em regra CSS própria, permitindo que o Safari processe o padding, font-size e dimensões sem interferência de seletores exclusivos de outras engines (::-webkit-datetime-edit).
- **Ícone Contextual em SVG:** Inclusão de background SVG sutil com ícone de calendário padronizado (#64748B), garantindo identificação visual imediata de campo temporal no iOS e no Android.
- **Gap Simétrico de 10px e Alinhamento Preciso:** Restauração visual completa com os inputs terminando e alinhando-se exatamente às margens dos blocos inferiores (*Turma* e *Bimestre*).

---

### [Versão 0.76] - Correção e Blindagem do Desarquivamento e Arquivamento de Ocorrências e Aplicações/Observações
* **Data e Horário:** 15 de Outubro de 2026 – 14:55:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v76_correcao_desarquivamento.html`](file:///c:/Users/Diogo/Documents/gestor%20supervisao_patos/gestor%20supervisao_patos/intermediárias/aplicativo_v76_correcao_desarquivamento.html)
* **Base / Insumos:** Solicitação direta de correção de bug no fluxo de arquivamento/desarquivamento de ocorrências e aplicações / Workflow oficial ([`WORKFLOW.md`](file:///c:/Users/Diogo/Documents/gestor%20supervisao_patos/gestor%20supervisao_patos/WORKFLOW.md)).
* **Identificador no App:** `📌 Versão 0.76 (v7.55)`
* **Hosting Oficial:** [https://supervisao-st-crianca.web.app](https://supervisao-st-crianca.web.app)
* **Contexto:** Ao desarquivar uma ocorrência de campo ou observação pedagógica (aplicação do roteiro), o pop-up de sucesso era exibido, mas o registro continuava arquivado na tela. Isso ocorria porque a rotina de auto-arquivamento temporal de 4 dias (`checkAndAutoArchive`) era disparada no início da renderização e re-arquivava qualquer registro com data anterior a 4 dias no mesmo instante.

#### 📥 Inclusões e Blindagens Técnicas
- **Flag `manuallyUnarchived`:** Inclusão de propriedade relacional que marca explicitamente quando um registro foi desarquivado pela intervenção direta do gestor/supervisor.
- **Isolamento em `checkAndAutoArchive`:** Adição da checagem `!item.manuallyUnarchived` tanto para observações concluídas quanto para ocorrências de campo, garantindo que o cron de 4 dias respeite decisões manuais do usuário.
- **Feedback Contextual:** Mensagens de confirmação informando expressamente o destino do registro (*"Movida para Ocorrências/Observações Ativas"* e *"Movida para Ocorrências/Observações Arquivadas"*).

#### 🛠️ Modificações de Funções
- `unarchiveNote(id)`: Atribuição de `n.archived = false` e `n.manuallyUnarchived = true`.
- `archiveNote(id)` e `archiveAllResolvedNotes()`: Atribuição de `n.archived = true` e reset para `n.manuallyUnarchived = false`.
- `unarchiveObservation(obsId)`: Atribuição de `obs.archived = false` e `obs.manuallyUnarchived = true`.
- `archiveObservation(obsId)`: Atribuição de `obs.archived = true` e reset para `obs.manuallyUnarchived = false`.
- `checkAndAutoArchive(silent)`: Condição estrita de auto-arquivamento apenas se `!item.archived && !item.manuallyUnarchived && item.date`.

---

### [Versão 0.73] - Restrição Estrita de Observação Docente a Coordenadoras e Preservação de Dados em Cascata
* **Data e Horário:** 15 de Outubro de 2026 – 14:30:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v73_restricao_observacao_formadora_coordenadora.html`](file:///c:/Users/Diogo/Documents/gestor%20supervisao_patos/gestor%20supervisao_patos/intermediárias/aplicativo_v73_restricao_observacao_formadora_coordenadora.html)
* **Plano de Implementação:** [`planos_de_implementacao/plano_restricao_observacao_formadora_coordenadora.md`](file:///c:/Users/Diogo/Documents/gestor%20supervisao_patos/gestor%20supervisao_patos/planos_de_implementacao/plano_restricao_observacao_formadora_coordenadora.md)
* **Base / Insumos:** Solicitação direta de governança pedagógica ("Professora é observada pela Coordenadora, Coordenadora é observada por Formadora; Formadora não observa Professora, apenas vê os dados em cascata") / Workflow oficial ([`WORKFLOW.md`](file:///c:/Users/Diogo/Documents/gestor%20supervisao_patos/gestor%20supervisao_patos/WORKFLOW.md)).
* **Identificador no App:** `📌 Versão 0.73 (v7.52)`
* **Hosting Oficial:** [https://supervisao-st-crianca.web.app](https://supervisao-st-crianca.web.app)
* **Contexto:** Blindagem definitiva dos fluxos de observação e planejamento para garantir que apenas Coordenadoras possam observar professoras, enquanto Formadoras acompanham exclusivamente Coordenadoras, preservando o acesso irrestrito aos relatórios e gráficos em cascata.

#### 📥 Inclusões e Funcionalidades
- **Função de Escopo de Ação (`getActionablePendingSchedules`):** Utilitário dinâmico que retorna visitas pendentes acionáveis de acordo com a autoridade avaliativa do usuário autenticado (Formadora: Coordenadoras; Coordenadora: Professoras da própria escola).
- **Filtragem de Candidatos no Cronograma (`onScheduleSchoolChange`):** O seletor de profissional no planejamento de visitas exibe apenas Coordenadoras para Formadoras, e apenas Professoras para Coordenadoras.
- **Blindagem no Disparo da Observação (`startNewObservation`):** Guard clause impeditivo que bloqueia em tempo de execução qualquer tentativa de observação fora da hierarquia canônica.

#### 🔄 Modificações e Adaptações
- **Cronograma Longitudinal (`renderScheduleScreen`):** O botão de ação `Iniciar Visita →` passa a ser renderizado apenas para o usuário com competência direta sobre o profissional. Para perfis com visualização em cascata (ex: Formadora visualizando visitas de professoras do polo), é exibido o rótulo limpo *"Acompanhamento"*, sem controles de início ou edição.
- **Próximas Visitas na Home (`renderHomeScreen`):** A seção de visitas da Home lista exclusivamente agendamentos que o usuário logado tem autoridade para iniciar.
- **Modal de Agendamento da Nova Observação (`openSelectScheduledObsModal`):** Ao clicar em "AVALIAR COORDENAÇÃO +", a Formadora visualiza unicamente visitas de Coordenadoras.

#### 🛡️ Regras e Acessos Preservados
- **Painel & Indicadores e Histórico:** Permanecem 100% inalterados, garantindo que a Formadora continue visualizando todos os dados, gráficos bimestrais, dotação de materiais e métricas longitudinais de todas as professoras do seu polo em cascata.

---

### [Versão 0.70] - Compactação e Enquadramento Definitivo dos Campos de Data no Mobile
* **Data e Horário:** 15 de Outubro de 2026 – 13:30:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v70_ajuste_proporcao_datas_mobile.html`](file:///c:/Users/Diogo/Documents/gestor%20supervisao_patos/gestor%20supervisao_patos/intermediárias/aplicativo_v70_ajuste_proporcao_datas_mobile.html)
* **Plano de Implementação:** [`planos_de_implementacao/plano_ajuste_proporcao_datas_mobile.md`](file:///c:/Users/Diogo/Documents/gestor%20supervisao_patos/gestor%20supervisao_patos/planos_de_implementacao/plano_ajuste_proporcao_datas_mobile.md)
* **Base / Insumos:** Solicitação direta de alinhamento dos campos de data com os demais blocos de filtros / Workflow oficial ([`WORKFLOW.md`](file:///c:/Users/Diogo/Documents/gestor%20supervisao_patos/gestor%20supervisao_patos/WORKFLOW.md)).
* **Identificador no App:** `📌 Versão 0.70 (v7.49)`
* **Hosting Oficial:** [https://supervisao-st-crianca.web.app](https://supervisao-st-crianca.web.app)
* **Contexto:** Compactação dos elementos internos do seletor nativo de data no iOS Safari (`::-webkit-date-and-time-value`, `::-webkit-datetime-edit`) e equalização matemática das dimensões com os seletores de Turma e Bimestre. Eliminação definitiva de qualquer ultrapassagem da margem direita do card no celular.

#### 📥 Inclusões e Funcionalidades
- **Alinhamento Perfeito:** O campo de Data Final termina rigorosamente na mesma margem direita que os seletores inferiores, mantendo simetria visual uniforme em toda a grade.
- **Compactação WebKit:** Neutralização da largura mínima forçada pelo iOS através de overrides nos componentes internos de data.

#### 🔄 Modificações
- **HTML (`#histFilterStartDate`, `#histFilterEndDate`):** Inclusão da classe `.date-filter-input`.
- **CSS Mobile (`.date-filter-input`):** Definição de regras estritas de modelo de caixa e pseudo-elementos.
- **Atualização de Versão:** Elevação oficial para `📌 Versão 0.70 (v7.49)`.

---

### [Versão 0.69] - Restauração Integral da Borda Direita dos Campos de Data no Mobile
* **Data e Horário:** 15 de Outubro de 2026 – 13:25:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v69_correcao_borda_cortada_datas.html`](file:///c:/Users/Diogo/Documents/gestor%20supervisao_patos/gestor%20supervisao_patos/intermediárias/aplicativo_v69_correcao_borda_cortada_datas.html)
* **Plano de Implementação:** [`planos_de_implementacao/plano_correcao_borda_cortada_datas.md`](file:///c:/Users/Diogo/Documents/gestor%20supervisao_patos/gestor%20supervisao_patos/planos_de_implementacao/plano_correcao_borda_cortada_datas.md)
* **Base / Insumos:** Solicitação direta de eliminação do corte na borda direita dos campos de data / Workflow oficial ([`WORKFLOW.md`](file:///c:/Users/Diogo/Documents/gestor%20supervisao_patos/gestor%20supervisao_patos/WORKFLOW.md)).
* **Identificador no App:** `📌 Versão 0.69 (v7.48)`
* **Hosting Oficial:** [https://supervisao-st-crianca.web.app](https://supervisao-st-crianca.web.app)
* **Contexto:** Correção do corte da borda direita nos campos de Data Inicial e Data Final dispostos lado a lado no celular. Remoção da máscara rígida de `overflow: hidden`, distribuição elástica com `minmax(0, 1fr)` e neutralização de margens do ícone de calendário WebKit.

#### 📥 Inclusões e Funcionalidades
- **Restauração da Borda Direita:** Eliminação do corte de 1px na borda lateral direita em ambos os inputs de data no celular.
- **Grade Elástica com minmax(0, 1fr):** Dimensionamento simétrico sem depender de máscaras de corte, garantindo visibilidade integral de todas as quatro bordas do campo.

#### 🔄 Modificações
- **CSS Mobile (`.history-filter-panel` e `.filter-field-col`):** Remoção de `overflow: hidden` e aplicação de reset no indicador de calendário WebKit.
- **Atualização de Versão:** Elevação oficial para `📌 Versão 0.69 (v7.48)`.

---

### [Versão 0.68] - Dimensionamento e Enquadramento dos Campos de Data no Mobile
* **Data e Horário:** 15 de Outubro de 2026 – 13:20:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v68_ajuste_datas_mobile.html`](file:///c:/Users/Diogo/Documents/gestor%20supervisao_patos/gestor%20supervisao_patos/intermediárias/aplicativo_v68_ajuste_datas_mobile.html)
* **Plano de Implementação:** [`planos_de_implementacao/plano_ajuste_tamanho_campos_data_mobile.md`](file:///c:/Users/Diogo/Documents/gestor%20supervisao_patos/gestor%20supervisao_patos/planos_de_implementacao/plano_ajuste_tamanho_campos_data_mobile.md)
* **Base / Insumos:** Solicitação direta de enquadramento dos blocos de data lado a lado no celular / Workflow oficial ([`WORKFLOW.md`](file:///c:/Users/Diogo/Documents/gestor%20supervisao_patos/gestor%20supervisao_patos/WORKFLOW.md)).
* **Identificador no App:** `📌 Versão 0.68 (v7.47)`
* **Hosting Oficial:** [https://supervisao-st-crianca.web.app](https://supervisao-st-crianca.web.app)
* **Contexto:** Correção do transbordamento horizontal dos campos de Data Inicial e Data Final quando dispostos lado a lado no mobile. Aplicação de modelo de caixa estrito (`box-sizing: border-box`), remoção de limites mínimos intrínsecos de data (`min-width: 0`) e equalização das dimensões com os outros filtros de seleção (38px de altura).

#### 📥 Inclusões e Funcionalidades
- **Enquadramento Perfeito de Datas:** Restrição horizontal estrita nos inputs de data para conter 100% da largura da coluna da grade sem ultrapassar o card.
- **Equalização com Demais Filtros:** Altura padronizada em 38px e padding otimizado (6px 8px), conferindo exatamente a mesma pegada visual dos seletores de Turma, Bimestre e Materiais.

#### 🔄 Modificações
- **CSS Base (`.form-select, .form-input`):** Definição mandatória de `box-sizing: border-box; min-width: 0; max-width: 100%;`.
- **CSS Mobile (`.history-filter-panel`):** Inclusão de `overflow: hidden` e contenção nos seletores e inputs filhos.
- **Atualização de Versão:** Elevação oficial para `📌 Versão 0.68 (v7.47)`.

---

### [Versão 0.67] - Harmonização, Alinhamento e Justificação de Botões Mobile (CSV e PDF)
* **Data e Horário:** 15 de Outubro de 2026 – 13:15:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v67_botoes_justificados_csv_pdf.html`](file:///c:/Users/Diogo/Documents/gestor%20supervisao_patos/gestor%20supervisao_patos/intermediárias/aplicativo_v67_botoes_justificados_csv_pdf.html)
* **Plano de Implementação:** [`planos_de_implementacao/plano_alinhamento_justificado_botoes_csv_pdf.md`](file:///c:/Users/Diogo/Documents/gestor%20supervisao_patos/gestor%20supervisao_patos/planos_de_implementacao/plano_alinhamento_justificado_botoes_csv_pdf.md)
* **Base / Insumos:** Solicitação direta de refinamento estético, alinhamento justificado e simplificação textual / Workflow oficial ([`WORKFLOW.md`](file:///c:/Users/Diogo/Documents/gestor%20supervisao_patos/gestor%20supervisao_patos/WORKFLOW.md)).
* **Identificador no App:** `📌 Versão 0.67 (v7.46)`
* **Hosting Oficial:** [https://supervisao-st-crianca.web.app](https://supervisao-st-crianca.web.app)
* **Contexto:** Refinamento da ergonomia e alinhamento visual dos botões de ação nas abas de Histórico, Bloco de Notas e Matrizes de Referência. Substituição de textos longos ("Exportar Filtradas (CSV)" e "Imprimir / Salvar PDF") por "CSV" e "PDF", enquadramento em card contêiner unificado e justificação simétrica total na largura do bloco no mobile.

#### 📥 Inclusões e Funcionalidades
- **Card Contêiner Justificado (`.history-toolbar-card`):** Bloco estruturado unificando a chave de rascunhos e a grade de ações com o mesmo padrão visual, bordas e largura dos cartões da aplicação.
- **Rotulagem Concisa:** Rótulos enxutos "CSV" e "PDF" para evitar quebras de linha e garantir alturas e larguras simétricas.
- **Distribuição Justificada 100%:** Grade proporcional de botões cobrindo exatamente a largura da tela do celular, com alinhamento perfeito às margens.

#### 🔄 Modificações
- **Refatoração Visual de `#screenHistory`:** Substituição de contêineres soltos por card estruturado e grade balanceada.
- **Refatoração Visual de `#screenNotes`:** Padronização dos botões para "CSV" e "PDF" na barra de ações.
- **Refatoração Visual de `#modalRefDocs`:** Padronização para "PDF" no botão de download da matriz.
- **Atualização de Versão:** Elevação oficial para `📌 Versão 0.67 (v7.46)`.

---

### [Versão 0.66] - Reorganização Responsiva e Ergonomia Mobile do Histórico, Bloco de Notas e Matrizes de Referência
* **Data e Horário:** 15 de Outubro de 2026 – 13:00:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v66_mobile_historico_notas_matrizes.html`](file:///c:/Users/Diogo/Documents/gestor%20supervisao_patos/gestor%20supervisao_patos/intermediárias/aplicativo_v66_mobile_historico_notas_matrizes.html)
* **Plano de Implementação:** [`planos_de_implementacao/plano_ajustes_mobile_historico_notas_matrizes.md`](file:///c:/Users/Diogo/Documents/gestor%20supervisao_patos/gestor%20supervisao_patos/planos_de_implementacao/plano_ajustes_mobile_historico_notas_matrizes.md)
* **Base / Insumos:** Solicitação direta de melhoria de layout e ergonomia mobile / Workflow oficial ([`WORKFLOW.md`](file:///c:/Users/Diogo/Documents/gestor%20supervisao_patos/gestor%20supervisao_patos/WORKFLOW.md)).
* **Identificador no App:** `📌 Versão 0.66 (v7.45)`
* **Hosting Oficial:** [https://supervisao-st-crianca.web.app](https://supervisao-st-crianca.web.app)
* **Contexto:** Ajuste de layout e disposição de botões no celular nas abas de Histórico, Bloco de Notas (Ocorrências de Campo) e no popup de Matrizes de Referência (PDF), substituindo quebras desordenadas por grades responsivas simétricas, seletores segmentados e áreas de toque adequadas à ergonomia móvel.

#### 📥 Inclusões e Funcionalidades
- **Alternador Segmentado no Histórico (`.history-view-toggle`):** Chave seletora em largura total (100%) no mobile com divisão simétrica (50%/50%) para alternar entre *Meus Rascunhos* e *Concluídas*.
- **Grade Simétrica de Ações no Histórico (`.history-actions-group`):** Ações utilitárias (*Exportar CSV* e *Imprimir / PDF*) em grade de 2 colunas e botão *Auto-Arquivar (+4d)* em largura total.
- **Grade Responsiva de Filtros (`.history-filter-panel`):** Organização dos filtros do Histórico em 2 colunas simétricas no mobile para datas, turmas, bimestres e status, reduzindo a altura do painel e eliminando a rolagem excessiva.
- **Botão Primário em Destaque no Bloco de Notas (`.btn-add-note`):** Botão *+ Nova Ocorrência de Campo* posicionado no topo com 100% de largura, cantos arredondados (10px) e elevação no mobile.
- **Toolbar Estruturada no Bloco de Notas (`.notes-filters-toolbar`):** Seletor de status em largura total e grade de 2 colunas para exportação e arquivamento de ocorrências.
- **Ações Simétricas no Modal de Matrizes de Referência (`.ref-doc-actions-container`):** Botões *Visualizar* e *Baixar PDF* dispostos lado a lado em 2 colunas iguais (50%/50%) nos cards de Professores e Coordenadores.

#### 🔄 Modificações
- **Refatoração do Cabeçalho e Filtros do Histórico (`#screenHistory`):** Substituição de contêineres flexíveis desordenados por estruturas CSS dedicadas.
- **Refatoração do Cabeçalho do Bloco de Notas (`#screenNotes`):** Desacoplamento do botão principal dos controles de filtro e exportação.
- **Atualização do Cabeçalho e Identificador de Versão:** Atualização para `📌 Versão 0.66 (v7.45)` no botão `.btn-changelog` e inclusão do bloco descritivo no topo do `#modalChangelog`.

#### ❌ Exclusões
- Eliminação de botões desalinhados com larguras assimétricas ou quebras recortadas nas telas de Histórico, Bloco de Notas e popup de Matrizes de Referência.

---

### [Versão 0.65] - Reorganização Visual da Agenda Mobile e Remoção do Contador Superior
* **Data e Horário:** 15 de Outubro de 2026 — 12:45:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v65_ajuste_layout_agenda_mobile.html`](file:///c:/Users/Diogo/Documents/gestor%20supervisao_patos/gestor%20supervisao_patos/intermediárias/aplicativo_v65_ajuste_layout_agenda_mobile.html)
* **Plano de Implementação:** [`planos_de_implementacao/plano_ajuste_layout_agenda_mobile.md`](file:///c:/Users/Diogo/Documents/gestor%20supervisao_patos/gestor%20supervisao_patos/planos_de_implementacao/plano_ajuste_layout_agenda_mobile.md)
* **Contexto:** Harmonização ergonômica da aba de Agenda (Cronograma de Acompanhamento) em smartphones, resolvendo quebras assimétricas de linha nos seletores de filtros, simplificando os títulos da tela, conferindo destaque ao botão de agendamento e removendo o botão de contador de notas do topo.

#### Inclusões e Modificações
- **Reorganização dos Filtros em Grade Simétrica:** Estruturação dos seletores de bimestre e status em grade de 2 colunas proporcionais (50% / 50%) com rótulo "Visitas Ativas" sem truncamento, e botão de ação "Arquivar Realizadas" em linha dedicada de largura total (100%).
- **Simplificação do Título:** Ajuste do cabeçalho da tela para estritamente "Cronograma de Acompanhamento".
- **Remoção de Subtítulo:** Exclusão do texto "Planejamento das 4 visitas anuais para o corpo docente e coordenação".
- **Harmonização do Botão de Agendamento:** O botão "+ Agendar Nova Visita" passa a ocupar a largura total no celular com cantos arredondados (10px) e elevação suave, garantindo ergonomia ao toque em qualquer tamanho de smartphone.
- **Ocultação do Contador Superior:** Remoção do botão de contador com número de anotações formativas do cabeçalho (`#navNotesCounterBtn`), limpando o topo da interface.

---

### [Versão 0.64] - Agenda Mobile Responsiva em Cards e Remoção Definitiva do Rodapé Institucional
* **Data e Horário:** 14 de Outubro de 2026 — 22:30:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v64_agenda_mobile_e_remocao_rodape.html`](file:///c:/Users/Diogo/Documents/gestor%20supervisao_patos/gestor%20supervisao_patos/intermediárias/aplicativo_v64_agenda_mobile_e_remocao_rodape.html)
* **Plano de Implementação:** [`planos_de_implementacao/plano_agenda_mobile_e_remocao_rodape.md`](file:///c:/Users/Diogo/Documents/gestor%20supervisao_patos/gestor%20supervisao_patos/planos_de_implementacao/plano_agenda_mobile_e_remocao_rodape.md)
* **Contexto:** Aperfeiçoamento da experiência mobile na aba de Agenda (Cronograma), substituindo a visualização tabular com rolagem lateral obrigatória por cards adaptativos verticais com hierarquia visual clara e sem emojis, além da remoção definitiva do bloco inferior de marcas institucionais em todas as telas da aplicação.

#### Inclusões e Modificações
- **Exibição Responsiva da Agenda no Mobile:** Em dispositivos móveis (telas ≤ 768px), as visitas do cronograma são renderizadas automaticamente como cards verticais ergonômicos, contendo identificação do profissional, turma, escola, data formatada (DD/MM/AAAA), horário, badge de bimestre e badge de status cromático com borda lateral indicativa.
- **Botões Ergonômicos de Toque:** Ações de disparo rápido (*Iniciar Visita →*, *Editar*, *Arquivar*, *Desarquivar*) redimensionadas com ergonomia apropriada para toque, sem necessidade de rolagem horizontal.
- **Preservação da Tabela no Desktop:** A tabela tradicional de 7 colunas permanece integralmente preservada em monitores e telas maiores (> 768px).
- **Padronização Sem Emojis:** Eliminação de pictogramas e emojis na visualização de agenda, adotando tipografia e badges profissionais e minimalistas.
- **Remoção Definitiva do Rodapé Institucional:** Exclusão completa do elemento `<footer class="app-institutional-footer">` e de seus estilos CSS de todas as telas (Início, Agenda, Painel, Gestão), eliminando as marcas de Programa/Projeto, Realização e Parceria Técnica.

---

### [Versão 0.63] - Limpeza Visual e Minimalismo da Tela Inicial (Coordenação Pedagógica & Formadora)
* **Data e Horário:** 14 de Outubro de 2026 — 22:10:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v63_limpeza_visual_tela_inicial.html`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v63_limpeza_visual_tela_inicial.html)
* **Plano de Implementação:** [`planos_de_implementacao/plano_limpeza_visual_tela_inicial.md`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_limpeza_visual_tela_inicial.md)
* **Contexto:** Simplificação ergonômica da tela inicial (`screenHome`) para Coordenadoras Pedagógicas e Formadoras, eliminando poluição visual decorrente de banners informativos redundantes, atalhos duplicados e colunas secundárias de ferramentas, e estabelecendo um fluxo de trabalho focado e direto.

#### 🚀 Inclusões e Modificações
- **Estrutura Minimalista Focada:** A tela inicial padrão passa a apresentar estritamente três blocos essenciais:
  1. Card superior de identificação (`.hero-banner`) com saudação, dados da escola e o botão de ação principal mantido intacto (*NOVA OBSERVAÇÃO +* para coordenação / *AVALIAR COORDENAÇÃO +* para formadora).
  2. Bloco de *Meus Rascunhos em Andamento* (`#homeDraftsSection`), agora em largura total (full-width) com alinhamento limpo e botões de *Continuar* e *Excluir*.
  3. Bloco dinâmico de *Minhas Próximas Visitas Agendadas* (`#homeScheduledSection`), posicionado logo após os rascunhos, exibindo as visitas planejadas no cronograma com botão de disparo rápido (*Iniciar Visita →*).
- **Supressão do Banner de Troca de Perfil (`#roleScopeNotice`):** Ocultação completa da tarja azul superior de aviso de escopo via CSS (`display: none !important`), mantendo a funcionalidade de alternância de perfil centralizada no botão oficial do cabeçalho (`#headerRoleBadge`).
- **Remoção do Card de Cronograma Longitudinal (`#homeScheduleBanner`):** Eliminação do card duplicado de cronograma da Home, preservando o acesso ao módulo via aba dedicada na barra superior e navegação móvel.
- **Eliminação da Coluna Secundária Lateral:** Remoção dos cards secundários de *Visitas Finalizadas*, *Ocorrências de Campo*, *Painel & Diagnóstico* e *Ferramentas do Sistema* da tela inicial, liberando a largura total da página para os instrumentos ativos do usuário.
- **Ocultação do Rodapé Institucional na Home:** Aplicação de regra contextual CSS para ocultar a faixa de logomarcas institucionais exclusivamente na tela inicial ativa (`#screenHome.active ~ .app-institutional-footer`), garantindo término de página limpo.
- **Blindagem Defensiva no JavaScript:** Adição de verificações seguras contra referências nulas em `applyUserRoleUI()` e `renderHomeScreen()`, garantindo estabilidade absoluta e ausência de exceções no console.

---

### [Versão 0.62] - Ocultação Estrita do Botão "Salvar Rascunho" na Visualização de Devolutivas (Observações Finalizadas)
* **Data e Horário:** 14 de Outubro de 2026 — 20:00:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v62_ocultacao_botao_salvar_rascunho_devolutiva.html`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v62_ocultacao_botao_salvar_rascunho_devolutiva.html)
* **Plano de Implementação:** [`planos_de_implementacao/plano_ocultacao_botao_salvar_rascunho_devolutiva.md`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_ocultacao_botao_salvar_rascunho_devolutiva.md)
* **Contexto:** Correção ergonômica e lógica de interface assegurando que visitas de acompanhamento já finalizadas (devolutivas pedagógicas) operem em modo estritamente consultivo, eliminando a exibição imprópria de ações de salvamento de rascunho e provendo atalhos claros de retorno ao Histórico.

#### 🚀 Inclusões e Funcionalidades
- **Ocultação de "Salvar Rascunho" no Cabeçalho:** O elemento `#btnHeaderSaveDraft` passa a ter `display: none` sempre que o usuário consulta uma observação finalizada (`status === 'finalized'`) ou quando a sessão estiver sob a trava de somente leitura (`isReadOnly === true`).
- **Navegação de Retorno no Topo (`#btnHeaderBackHistory`):** Introdução de botão ergonômico *"← Voltar ao Histórico"* no cabeçalho superior quando visualizando uma devolutiva concluída, agilizando o retorno sem necessidade de rolar a página.
- **Rodapé de Dimensões Adaptativo (`#obsFooterActions`):** Substituição dinâmica do botão *"Salvar Rascunho & Sair"* por *"← Voltar ao Histórico"* no rodapé de transição entre abas de critérios para observações concluídas.
- **Blindagem na Síntese Final:** Validação em `renderSynthesisScreen` impedindo a renderização do botão de rascunho mesmo caso a flag de leitura apresente inconsistência de estado.
- **Higienização e Blindagem no Motor JS (`saveDraftAndExit`):** Eliminação de declaração de função duplicada no código e injeção de guard clause que previne qualquer alteração de estado caso acionada em instrumentos finalizados.

---

### [Versão 0.61] - Sincronização Integral de E-mail de Auto-Cadastro e Blindagem na Gestão da Equipe Técnica
* **Data e Horário:** 14 de Outubro de 2026 — 19:30:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v61_sincronizacao_email_novo_usuario.html`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v61_sincronizacao_email_novo_usuario.html)
* **Plano de Implementação:** [`planos_de_implementacao/plano_sincronizacao_email_cadastro_equipe_tecnica.md`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_sincronizacao_email_cadastro_equipe_tecnica.md)
* **Contexto:** Resolução do bug de desconexão entre o auto-cadastro da tela inicial e a visualização da Equipe Técnica, onde contas recém-criadas apareciam como "Sem e-mail vinculado" e induziam o gestor a reatribuir o e-mail manualmente com risco de perda de credenciais.

#### 🚀 Inclusões e Funcionalidades
- **Persistência Nativa de E-mail no Auto-Cadastro (`handleRegisterSubmit`):** Inclusão imediata dos atributos `email` e `avatarText` no objeto empurrado para `appState.teamMembers`, assegurando que o e-mail fornecido pelo usuário na tela inicial esteja presente em todas as instâncias do estado.
- **Autocura e Sincronização Bidirecional (`loadState`):** Algoritmo de conciliação que cruza em segundo plano `appState.teamMembers` com `USERS_DB` e `customUsers`, curando instantaneamente registros locais preexistentes que estivessem sem o atributo `email`.
- **Resolução Dinâmica em Tempo Real (`renderTeamScreen`):** Consulta defensiva a `USERS_DB` caso `m.email` esteja ausente no momento de renderizar a tabela, garantindo que o e-mail seja exibido imediatamente com o ícone `✉️` e evitando rótulos incorretos.
- **Pré-preenchimento e Blindagem no Modal de Edição (`openEditMemberModal` e `saveEditTeamMember`):** Pré-carregamento automático do e-mail do usuário no input `#editMemberEmail` e proteção defensiva que impede a deleção das credenciais de autenticação caso o campo seja salvo em branco.

---

### [Versão 0.60] - Numeração Dinâmica e Reindexação Sequencial Contínua da Matriz de Rubricas & Exibição Condicional da Tarja Somente Leitura
* **Data e Horário:** 14 de Outubro de 2026 — 19:00:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v60_numeracao_dinamica_itens_rubricas.html`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v60_numeracao_dinamica_itens_rubricas.html)
* **Plano de Implementação:** [`planos_de_implementacao/plano_numeracao_dinamica_itens_rubricas.md`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_numeracao_dinamica_itens_rubricas.md)
* **Contexto:** Garantia de continuidade e coerência pedagógica na Matriz de Rubricas oficiais através de motor universal de reindexação contínua, permitindo adição e exclusão em qualquer posição com deslocamento numérico automático e migração transparente de chaves relacionais em observações e rascunhos, em conjunto com o isolamento contextual da tarja de somente leitura.

#### 🚀 Inclusões e Funcionalidades
- **Motor Central de Reindexação (`reindexRubricMatrix`):** Algoritmo SSOT universal que recalcula automaticamente e de modo contínuo os códigos de Dimensões, Subdimensões e Itens/Critérios tanto na exclusão quanto na inserção.
- **Exclusão com Deslocamento Harmônico:** Ao excluir um critério (ex: item 1.1), os itens seguintes (1.2, 1.3) avançam automaticamente para cobrir a lacuna (1.1, 1.2), sem deixar "buracos" na matriz. O mesmo comportamento em cascata é aplicado para subdimensões e dimensões.
- **Inserção Flexível "À Frente" (`➕ Inserir Antes`):** Botões dedicados no cabeçalho de cada Dimensão, Subdimensão e nos cards de Itens, viabilizando inserir elementos em posições intermediárias ou no topo com avanço de numeração (+1) dos elementos seguintes.
- **Seleção Inteligente de Posição:** Diálogo interativo permitindo ao supervisor definir a posição exata de inserção (ex: digitar 1 para inserir à frente de todas ou confirmar para inserir ao final).
- **Blindagem e Migração Relacional (`migrateObservationKeys`):** Mapeamento biunívoco de transição de IDs antigos para novos IDs, migrando instantaneamente as chaves em `responses`, anotações qualitativas (`criterionComments`) e evidências fotográficas (`photos`) em todas as observações salvas e rascunhos ativos, garantindo zero dados órfãos.
- **Exibição Estrita da Tarja (#readOnlyWarning):** A tarja informativa *"Instrumento Finalizado · Modo Somente Leitura (Integridade de Dados Assegurada)"* passa a ser renderizada unicamente quando o usuário abre uma observação cujo status é finalizado (`status === 'finalized'`).
- **Ocultação em Rascunhos e Navegação Geral:** Formulários em edição (`status === 'draft'`) e transições para telas principais (Início, Histórico, Agendamentos, Ocorrências, Painel e Rubricas) ocultam a tarja e redefinem defensivamente o estado de leitura da sessão.

---

### [Versão 0.59] - Caixa de Confirmação para Exclusão de Rascunhos de Entrevista e Observação
* **Data e Horário:** 14 de Outubro de 2026 — 18:30:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v59_confirmacao_exclusao_rascunho_entrevista.html`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v59_confirmacao_exclusao_rascunho_entrevista.html)
* **Plano de Implementação:** [`planos_de_implementacao/plano_confirmacao_exclusao_rascunho_entrevista.md`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_confirmacao_exclusao_rascunho_entrevista.md)
* **Contexto:** Blindagem da integridade de dados e prevenção de perdas acidentais no descarte de rascunhos em andamento de entrevistas com coordenação pedagógica e observações de sala de aula.

#### 🚀 Inclusões e Funcionalidades
- **Modal de Confirmação Dedicado (`#modalConfirmDeleteDraft`):** Criação de caixa de confirmação sob medida no design system do SerTão Criança, eliminando a exclusão silenciosa e imediata.
- **Diferenciação Semântica (Entrevista vs. Observação):** Ajuste dinâmico de títulos, mensagens e badges cromáticos de acordo com o cargo avaliado (`evaluatedType === 'coordenador'` como Entrevista Formativa e `evaluatedType === 'professora'` como Observação Docente).
- **Sumário Reativo da Visita:** Apresentação clara do profissional avaliado, escola, turma, bimestre, data e contadores de critérios preenchidos e fotos anexadas.
- **Aviso Visual Destacado de Irreversibilidade:** Card vermelho informando categoricamente que os dados, fotos e anotações serão destruídos em definitivo.
- **Higienização Defensiva de Estado:** Desassociação automática de `appState.currentObs` caso a observação excluída esteja aberta na sessão ativa, com salvamento imediato e feedback via toast.

---

### [Versão 0.58] - Hiperlinks Institucionais nos Logotipos (SerTão Criança, Prefeitura de Patos e LEPES)
* **Data e Horário:** 14 de Outubro de 2026 — 17:15:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v58_hyperlinks_logos_institucionais.html`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v58_hyperlinks_logos_institucionais.html)
* **Plano de Implementação:** [`planos_de_implementacao/plano_hyperlinks_logos_institucionais.md`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_hyperlinks_logos_institucionais.md)
* **Contexto:** Habilitação de interatividade nas marcas institucionais adicionadas na Versão 0.52, convertendo os blocos de imagem em hyperlinks para as presenças digitais oficiais dos parceiros mantenedores da iniciativa pedagógica.

#### 🚀 Inclusões e Funcionalidades
- **Instagram Oficial do SerTão Criança:** Hiperlink configurado para `https://www.instagram.com/sertaocrianca_patos`, permitindo aos supervisores e visitantes acompanhar as ações, fotos e novidades formativas do programa.
- **Página Oficial da Prefeitura Municipal de Patos:** Hiperlink direto e seguro para `https://patos.pb.gov.br`, fortalecendo o vínculo institucional da rede pública municipal de ensino.
- **Página Oficial do LEPES:** Hiperlink para `https://www.lepes.fearp.usp.br/`, viabilizando consulta às pesquisas, instrumentos de avaliação e metodologias científicas desenvolvidas pelo laboratório da USP.
- **Blindagem e Integridade de Navegação:** Uso mandatário de `target="_blank"` e `rel="noopener noreferrer"`, preservando o contexto e os dados não salvos da sessão de supervisão em tela.
- **Affordance e Refinamento de UI:** Cursor `pointer`, transição suave de escala/elevação ao passar o mouse e tooltips descritivos.

---

### [Versão 0.1] - Protótipo Conceitual Inicial
* **Data e Horário:** 06 de Outubro de 2026 — 14:05:24
* **Arquivo Intermediário:** [`intermediárias/lepes-prototype.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/lepes-prototype.html)
* **Base / Insumos:** Protocolo de Acompanhamento Pedagógico LEPES (Laboratório de Estudos e Pesquisas em Economia Social).
* **Contexto:** Versão de validação de conceito para digitalização dos instrumentos presenciais de monitoramento pedagógico da Educação Infantil.

#### 🚀 Inclusões e Funcionalidades
- **Instrumento Digital de Coleta:** Criação da interface inicial em HTML/CSS puro simulando a ficha física de supervisão em sala.
- **Escala Tripartite Tradicional:** Formulário estruturado com opções de resposta em 3 níveis qualitativos: *Consistente*, *Parcial* e *Não Realizado*.
- **Campos Cadastrais Básicos:** Preenchimento preliminar de município, unidade escolar, docente e data da observação.
- **Estrutura Monolítica:** Todo o estilo, marcação e rotinas básicas de renderização centralizados em um único arquivo autônomo.

---

### [Versão 0.2] - Diretrizes SerTão Criança & Matriz Pedagógica Estruturada
* **Data e Horário:** 06 de Outubro de 2026 — 14:10:34
* **Arquivo Intermediário:** [`intermediárias/aplicativo_de_supervis_o_pedag_gica_sert_o_crian_a.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_de_supervis_o_pedag_gica_sert_o_crian_a.html)
* **Identificador no App:** `📋 Histórico v2.0`
* **Contexto:** Alinhamento técnico do protótipo às diretrizes metodológicas do projeto SerTão Criança, eliminando distorções de cálculo e estruturando a navegação analítica.

#### 🚀 Inclusões e Funcionalidades
- **Instrumento com 4 Opções (Inclusão do N/A):** Adição explícita da 4ª opção *"Não se Aplica" (N/A)*, impedindo que critérios não observáveis por motivos contextuais punissem o índice global da docente.
- **Vetorização Normalizada:** Padronização estatística das questões para garantir que comportamentos pedagógicos positivos pontuassem positivamente na escala métrica.
- **Preenchimento Integral Obrigatório:** Trava de validação que bloqueia submissões parciais, acompanhada de sinalização visual e atalhos rápidos para direcionar o observador aos itens pendentes.
- **Hierarquia Inicial em 3 Níveis:** Implementação de perfis operacionais: *Nível 1 (Coordenação Geral)*, *Nível 2 (Formadoras)* e *Nível 3 (Coordenação Pedagógica)*.
- **Painel de Afunilamento (Drill-Down):** Navegação dinâmica interativa descendo a granularidade pedagógica: `Dimensão → Subdimensão → Item Individual`.
- **Acompanhamento Longitudinal:** Primeiros gráficos e tabelas com séries históricas bimestrais para análise da evolução ao longo do ano letivo.
- **Registro Fotográfico de Evidências:** Inclusão de upload/anexação de fotos comprobatórias por critério pedagógico.
- **Editor Autônomo de Rubricas:** Módulo administrativo para edição descritiva dos critérios avaliativos diretamente no navegador, sem demandar novo build.
- **Exportação de Síntese em PDF:** Geração de documento de devolutiva com formatação pré-configurada para impressão e compartilhamento.

---

### [Versão 0.3] - Governança em 4 Níveis, Autenticação Real & Padronização
* **Data e Horário:** 06 de Outubro de 2026 — 14:37:01
* **Arquivo Intermediário:** [`intermediárias/aplicativo_de_supervis_o_pedag_gica_sert_o_crian_a (1).html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_de_supervis_o_pedag_gica_sert_o_crian_a%20(1).html)
* **Base / Insumos:** [`inputs/inputs_v3.txt`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/inputs/inputs_v3.txt)
* **Identificador no App:** `📋 Changelog v3.0`
* **Contexto:** Reestruturação institucional solicitada após alinhamento presencial: fim da terminologia artificial de "Níveis 1..4", implementação de login/logout funcional e segregação estrita de quem avalia quem.

#### 🚀 Inclusões e Funcionalidades
- **Autenticação Real e Logout:** Substituição de dados estáticos por fluxo real de sessão ativa, permitindo alternar de usuário e efetuar logout completo da conta.
- **Matriz de Governança Institucional em 4 Níveis:**
  1. *Coordenação Pedagógica (UE):* Avalia exclusivamente os professores da sua respectiva unidade escolar.
  2. *Formadoras (Polo):* Avaliam exclusivamente as coordenadoras do seu polo; visualizam as avaliações das docentes vinculadas a essas coordenadoras, sem realizar observação direta em sala.
  3. *Coordenação da EI (Rede):* Avalia as formadoras; visualiza consolidados e históricos de toda a rede de ensino.
  4. *Equipe Técnica (Governança):* Não aplica avaliações; possui acesso total para governança, alteração de rubricas e gestão do quadro de servidores (adicionar/remover docentes, coordenadoras e formadoras).
- **Turmas e Agrupamentos Padronizados:** Campo de turma transformado de texto livre digitável para seleção pré-definida institucional (*Berçário I/II, Maternal I/II, Infantil I/II*).
- **Módulo de Ocorrências Críticas:** Área dedicada para visualização, registro circunstanciado e despacho de ocorrências e incidentes escolares.

#### 🔄 Modificações e Ajustes
- **Eliminação de Rótulos Numéricos:** Remoção das nomenclaturas "Nível 1, 2, 3, 4" da interface, substituídas pelas designações oficiais dos cargos.
- **Padronização Nominal Institucional:** Remoção de prefixos e titulações ("Dra. Helena" alterada oficialmente para "Helena Martins").

---

### [Versão 0.4] - Cronograma Longitudinal, Privacidade Estrita de Rascunhos & CSV
* **Data e Horário:** 06 de Outubro de 2026 — 15:09:17
* **Arquivo Intermediário:** [`intermediárias/aplicativo_de_supervis_o_pedag_gica_sert_o_crian_a (2).html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_de_supervis_o_pedag_gica_sert_o_crian_a%20(2).html)
* **Base / Insumos:** [`inputs/inputs_v4.txt`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/inputs/inputs_v4.txt)
* **Identificador no App:** `📋 Changelog v4.0`
* **Contexto:** Demandas de planejamento anual de visitas, segurança de dados pré-submissão e carga em lote de unidades e servidores.

#### 🚀 Inclusões e Funcionalidades
- **Cronograma Longitudinal de Visitas:** Módulo de agenda e planejamento anual/bimestral com indicação de datas, horários previstos e atalho de acionamento imediato do instrumento.
- **Privacidade Estrita de Rascunhos (*Author-Only*):** Rascunhos tornam-se rigorosamente invisíveis e inacessíveis para superiores hierárquicos e para a Equipe Técnica; apenas o observador que originou o rascunho pode visualizá-lo e editá-lo.
- **Importação em Lote via Planilhas CSV:** Interface de upload e modelos padronizados em CSV para cadastro massivo de Unidades Escolares, Polos e Servidores.
- **Registros Formativos / Notas Qualitativas:** Evolução do conceito de ocorrências de um viés punitivo para um mecanismo de *self-reminders* e anotações qualitativas de campo, com opção de inserção direta no parecer da síntese.
- **Controle de Horários na Síntese:** Inclusão dos campos de horário de início e término com cálculo automático da duração da observação.
- **Filtros Avançados no Histórico:** Filtragem multidimensional por período, nome do profissional, nível de uso de materiais, turma, bimestre e função observada.
- **Refinamento da Devolutiva em PDF:** Adequação visual da impressão para gerar páginas limpas com cabeçalho institucional e linhas para assinatura do observador e do docente.

#### 🔄 Modificações e Ajustes
- **Padronização Oficial da Marca:** Aplicação estrita da grafia **SerTão Criança** (com o "T" maiúsculo) em todo o sistema.

---

### [Versão 0.5] - Usabilidade Móvel, Bloqueio de Autoavaliação & Ergonomia Híbrida
* **Data e Horário:** 06 de Outubro de 2026 — 17:20:05
* **Arquivos Intermediários:** [`(3).html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_de_supervis_o_pedag_gica_sert_o_crian_a%20(3).html) e [`(4).html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_de_supervis_o_pedag_gica_sert_o_crian_a%20(4).html)
* **Base / Insumos:** [`inputs/inputs_v5.txt`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/inputs/inputs_v5.txt)
* **Identificador no App:** `📋 Versão 5.0`
* **Contexto:** Ajustes finos de usabilidade focados no uso do aplicativo em smartphones por avaliadores em campo, garantindo integridade ética e estabilidade visual.

#### 🚀 Inclusões e Funcionalidades
- **Bloqueio Incondicional de Autoavaliação:** O sistema impede de forma estrita que o usuário ativo selecione a si próprio como alvo de avaliações pedagógicas ou emissão de notas formativas.
- **Preservação de Horários na Abertura da Visita:** Horários de início e término/previsão passam a ser registrados logo na etapa inicial de identificação, sendo salvos e persistidos com segurança no rascunho.
- **Filtro de Período Flexível e Independente:** Usuário pode filtrar o histórico por Data Inicial, por Data Final ou por ambas simultaneamente, sem exigência de preenchimento duplo.
- **Ergonomia Híbrida (Mobile vs Desktop):** Preservação da experiência tátil para celulares em campo (altura mínima de botões de 44px, zonas seguras de clique) combinada à interface expandida no Desktop para relatórios da gestão.

#### 🐛 Correções de Bugs e Vernáculo
- **Correção do "Scroll Jump" no Chrome Mobile:** Resolução do bug em que toques nas opções da síntese e nos níveis de materiais provocavam rolagem involuntária para o topo da página.
- **Padronização Vernacular (Eliminação de Estrangeirismos):** Substituição de termos como *self-reminder* pelas expressões em língua portuguesa **Ocorrências de Campo** e **Registros Formativos**.

---

### [Versão 0.6] - Single Source of Truth (SSOT), Gestão Operacional & JSON Total
* **Data e Horário:** 06 de Outubro de 2026 — 17:41:57
* **Arquivo Intermediário:** [`intermediárias/aplicativo_de_supervis_o_pedag_gica_sert_o_crian_a (5).html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_de_supervis_o_pedag_gica_sert_o_crian_a%20(5).html)
* **Base / Insumos:** [`inputs/inputs_v6.txt`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/inputs/inputs_v6.txt)
* **Identificador no App:** `📋 Versão 6.0`
* **Contexto:** Consolidação da infraestrutura de dados da rede, unificação de painéis administrativos do gestor e consolidação histórica integral.

#### 🚀 Inclusões e Funcionalidades
- **Single Source of Truth (SSOT) & Exportação/Importação JSON Integral:** Unificação de todo o estado da rede (`teamMembers`, `units`, `rubrics`, `observations`, `schedules`, `notes`) em formato JSON, com botão para substituição integral e segura da base.
- **Extrações Modulares e Filtradas:** O Gestor pode extrair recortes brutos individuais (JSON), enquanto os demais perfis dispõem de exportação modular (CSV e PDF) restrita com precisão cirúrgica ao escopo ativo filtrado na tela.
- **Nova Aba de Gestão Operacional:** Fusão das antigas abas esparsas de UEs & Polos, Equipe & Servidores e Rubricas em uma central de controle integrada com navegação segmentada, substituindo a aba "Início" na visão da Gestora.
- **Vinculação Automática de CP ao Docente:** Ao vincular uma Coordenadora Pedagógica a uma Unidade Escolar, todos os docentes lotados naquela unidade são automaticamente associados à respectiva coordenadora, eliminando cadastros manuais individuais redundantes.
- **Matriz de Cobertura da Rede:** Tabela dinâmica que apresenta o mapeamento de Polos regionais, Unidades Escolares alocadas e Coordenadoras ativas em cada território.
- **Filtros Avançados de Servidores e Escolas:** Filtragem por cargo, vínculo superior imediato, unidade e polo, com indicador visual em destaque do polo correspondente.
- **Histórico Consolidado no Modal:** Criação do modal de Changelog completo unificando a retrospectiva técnica de todas as versões do projeto.

#### 🛡️ Governança e Restrições da Equipe Técnica
- **Blindagem do Perfil Técnico:** Remoção da seção "Meus Rascunhos", bloqueio completo de acesso ao cronograma de visitas pedagógicas e desativação do botão de emissão de ocorrências de campo para o perfil de governança técnica.

#### 🐛 Correções de Bugs
- **Renderização de Notação Matemática:** Correção da exibição do subtítulo do Painel de Indicadores, eliminando caracteres quebrados de escape LaTeX (`$\rightarrow$`).

---

### [Versão 0.7] - Navegação Mobile Otimizada & Menu Deslizante "Mais Opções"
* **Data e Horário:** 06 de Outubro de 2026 — 17:59:53
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v6.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v6.html)
* **Base / Insumos:** [`planos_de_implementacao/plano_navegacao_mobile.md`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_navegacao_mobile.md) e [`intermediárias/apply_menu_fix.py`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/apply_menu_fix.py)
* **Contexto:** Solução para o aperto e overflow horizontal da barra de abas inferior no celular, que possuía 5 botões espremidos.

#### 🚀 Inclusões e Funcionalidades
- **Barra de Navegação Móvel com 4 Itens:** Redesenho da `.mobile-tabbar` limitando os botões fixos a 4 posições ergonômicas com 25% de largura de tela cada:
  1. 🏠 **Início** (`mobTabHome`)
  2. 📅 **Agenda** (`mobTabSchedule`)
  3. 📊 **Painel** (`mobTabDiag`)
  4. ☰ **Mais** (`mobTabMenu`)
- **Bottom Sheet Modal ("Mais Opções"):** Criação do container deslizante inferior (`#mobileMenuOverlay`) acionado pelo botão "Mais", agrupando de forma limpa o acesso a:
  - 📋 **Acessar Histórico**
  - 📝 **Bloco de Notas**
- **Controle de Estado de Navegação Sub-rota:** Destaque visual automático no botão "Mais" quando o usuário estiver navegando em uma tela acionada por dentro do submenu.

---

### [Versão 0.8] - Dinamização da Formadora, Reatividade de Cadastro & Home de EI
* **Data e Horário:** 07 de Outubro de 2026 — 14:38:07
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v7.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v7.html)
* **Base / Insumos:** [`planos_de_implementacao/plano_ajustes_formadora_exportacao_vinculacao.md`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_ajustes_formadora_exportacao_vinculacao.md) e [`planos_de_implementacao/plano_ajustes_coordenacao_ei.md`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_ajustes_coordenacao_ei.md)
* **Contexto:** Correção de restrições estáticas em código (*hardcodes*) que impediam a visualização de polos pelas formadoras, conserto na reatividade de seleção de UE e restauração da tela inicial da coordenação de EI.

#### 🚀 Inclusões e Funcionalidades
- **Desbloqueio Dinâmico do Escopo da Formadora:** Remoção de escolas *hardcoded* estáticas em `getScopedObservations()`, `getScopedNotes()` e `getScopedSchedules()`. O sistema agora busca dinamicamente todas as coordenadoras supervisionadas pela formadora e consolida as UEs correspondentes juntamente com o polo escolar.
- **Reatividade Automática no Cadastro de Professoras:** Inclusão do manipulador `onchange="onNewMemberRoleChange()"` no `<select id="newMemberSchool">`. Ao trocar a unidade escolar, o dropdown do superior imediato (Coordenadora Pedagógica daquela UE) é atualizado em tempo real na tela.
- **Implementação Efetiva das Funções de Exportação JSON:** Declaração das rotinas `downloadAsJSON()`, `exportFullBaseJSON()`, `exportTeamMembersJSON()`, `exportUnitsJSON()` e `exportRubricsJSON()`, sanando botões que não disparavam o download.
- **Restauração da Tela Inicial da Coordenação da EI:** Desvinculação da lógica `isGestao` da regra da equipe técnica. A Coordenação da EI volta a ter acesso completo à `homeStandardView` (Rascunhos, Visitas Finalizadas, Ações Rápidas).
- **Atalho Rápido "Painel & Diagnóstico":** Novo card de acesso rápido implementado na Home da Coordenação da EI para redirecionamento imediato aos indicadores da rede.

---

### [Versão 0.9] - Sincronização Integral das Rubricas Pedagógicas Oficiais
* **Data e Horário:** 07 de Outubro de 2026 — 15:18:54
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v8.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v8.html)
* **Base / Insumos:** [`Instrumento de Acompanhamento das visitas pedagógicas.pdf`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/Instrumento%20de%20Acompanhamento%20das%20visitas%20pedagógicas.pdf), [`Seção 3.pdf`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/Seção%203.pdf) e scripts [`update_rubrics.py`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/update_rubrics.py) / [`update_rubrics2.py`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/update_rubrics2.py).
* **Contexto:** Atualização do núcleo pedagógico do sistema com transcrição fiel de todos os critérios e descrições dos documentos de referência da Secretaria de Educação e do LEPES.

#### 🚀 Inclusões e Funcionalidades
- **Estruturação Completa de `DEFAULT_SECTIONS_TEACHER`:**
  - **Dimensão 1: Estratégias Didáticas:** Subdimensões de *Ampliação de Repertório* (leitura, contação de histórias, perguntas abertas, materiais adequados, abordagem lúdica, engajamento e conexão com o cotidiano) e *Brincadeira* (tempo qualificado, mediação de conflitos, participação docente, ampliação de possibilidades e valorização do brincar livre).
  - **Dimensão 2: Interações Positivas:** Acolhimento, respeito aos ritmos infantis, escuta ativa e promoção de cooperação.
  - **Dimensão 3: Organização dos Ambientes e Rotina:** Acessibilidade dos brinquedos e materiais, transições entre momentos da rotina, segurança e autonomia das crianças.
- **Preservação e Restauração de Padrão:** Botão para reset de rubricas aos parâmetros de fábrica com notificação em Toast confirmando a reinicialização dos critérios institucionais.

---

### [Versão 0.10] - Governança Operacional da Equipe Técnica, Changelog Oficial & Deploy
* **Data e Horário:** 07 de Outubro de 2026 — 15:27:39
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Base / Insumos:** [`planos_de_implementacao/plano_fix_gestao_pedagogica_tecnico.md`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_fix_gestao_pedagogica_tecnico.md), [`planos_de_implementacao/plano_atualizacao_changelog_v610.md`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_atualizacao_changelog_v610.md) e diretrizes do [`WORKFLOW.md`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/WORKFLOW.md).
* **Identificador no App:** `📋 Versão 6.1` (Versão 6.1.0 no modal)
* **Hosting Oficial:** [https://supervisao-st-crianca.web.app](https://supervisao-st-crianca.web.app)
* **Contexto:** Entrega da versão estável em produção, resolvendo o acesso às abas operacionais pelo perfil da Equipe Técnica e oficializando a governança da versão 6.1.0.

#### 🚀 Inclusões e Funcionalidades
- **Restauração da Navegação da Equipe Técnica:** Ajuste em `applyUserScope()`, modificando `unitsNavTab`, `teamNavTab` e `adminNavTab` de `display: 'none'` para `display: 'flex'`, garantindo que a Equipe Técnica acerte o acesso direto pelo menu lateral a:
  - 🏫 **UEs & Polos**
  - 👥 **Equipe & Servidores**
  - 📑 **Rubricas**
- **Oficialização da Versão 6.1 no Cabeçalho:** Atualização do rótulo do botão `.btn-changelog` para "📋 Versão 6.1".
- **Entrada Oficial da Versão 6.1.0 no Modal:** Adição do bloco verde de versão atual no topo de `#modalChangelog`, detalhando a Otimização Mobile, Restauração da Home de EI, Permissões da Equipe Técnica e Exportação Avançada, com rebaixamento da versão 6.0.0 para visual neutro histórico.
- **Publicação em Produção (Firebase Hosting):** Sincronização e deploy dos artefatos estáticos validados na nuvem oficial do projeto.

---

### [Versão 0.11] - Ajustes nas Abas de Gestão e Exportação Parametrizada de Rubricas
* **Data e Horário:** 07 de Outubro de 2026 — 16:04:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v9.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v9.html)
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Plano Executivo:** [`planos_de_implementacao/plano_ajustes_abas_e_exportacao.md`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_ajustes_abas_e_exportacao.md)
* **Contexto:** Eliminação de redundâncias na barra superior de navegação para consolidação definitiva nas sub-abas da tela de Gestão Pedagógica, e disponibilização de controle de seleção explícita da matriz pedagógica para exportações (Professores vs Coordenadores).

#### 🚀 Inclusões e Funcionalidades
- **Consolidação Definitiva da Gestão:** Remoção permanente dos botões superiores (`nav-link`) de "UEs & Polos" (`#deskTabUnits`) e "Equipe & Servidores" (`#deskTabTeam`), impedindo duplicação visual e garantindo acesso limpo exclusivamente via sub-abas da primeira aba ("Gestão Pedagógica" / "Início").
- **Preservação da Aba Rubricas no Topo:** Mantido botão direto `#deskTabAdmin` para perfis técnicos autorizados.
- **Seletor de Matriz de Rubricas:** Inclusão de `<select>` interativo em dois pontos estratégicos:
  - Na tela de visualização/edição das Rubricas (`#pedagViewRubrics`).
  - No Card de Rubricas da Central de Extrações e Base Unificada SSOT (`#pedagViewExports`).
- **Sincronização Bidirecional e Reatividade:** Função `syncRubricMatrixSelect()` que mantém ambos os seletores sincronizados e re-renderiza dinamicamente os descritores conforme a matriz escolhida.
- **Exportação Dinâmica e Parametrizada (CSV & JSON):** Ajuste em `exportRubricsJSON()` e `exportRubricsCSV()` para ler o valor do seletor e extrair fielmente a matriz de Professores (`appState.activeSectionsTeacher`) ou a matriz de Coordenadores (`appState.activeSectionsCoordinator`).
- **Atualização do Cabeçalho e Modal de Versões:** Elevação para "📋 Versão 6.2" e inclusão de registro detalhado no modal histórico de alterações.

---

### [Versão 0.12] - Exclusão do Cargo de Coordenação da EI e Incorporação ao Acesso da Equipe Técnica
* **Data e Horário:** 07 de Outubro de 2026 — 16:25:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v10.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v10.html)
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Plano Executivo:** [`planos_de_implementacao/plano_exclusao_cargo_coordenacao_ei.md`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_exclusao_cargo_coordenacao_ei.md)
* **Contexto:** Alinhamento metodológico do sistema ao modelo de supervisão pedagógica oficial da rede municipal: a Coordenação da Educação Infantil não atua como avaliador direto com preenchimento de rubricas, mas sim no acompanhamento e governança macro dos dados, UEs, polos e servidores, papel idêntico ao da Equipe Técnica.

#### 🚀 Inclusões, Modificações e Exclusões
- **Exclusão do Cargo Avaliador Autônomo da Coordenação da EI:** Remoção total do perfil e chave `gestor`, bem como supressão do botão `AVALIAR FORMADORA +` e de formulários com lógica de seleção de formadoras para avaliação.
- **Incorporação ao Acesso de Equipe Técnica:** A conta institucional de Helena Martins foi transferida para `roleKey: 'tecnico'` com o título *"Equipe Técnica (Coordenação da EI)"* e insígnia `ET`, permitindo que ela acerte indicadores, mapas de polos, equipe e rubricas sem poluição com rascunhos de avaliação ou botões de criação inexistentes.
- **Unificação de Modais de Seleção de Usuário e Login:** Atualização das caixas de seleção em `#modalRole` e `#modalLoginScreen` para 3 perfis metodológicos claros: Coordenação Pedagógica (Mariana), Formadora Pedagógica (Clarice) e Equipe Técnica / Coordenação da EI (Rodrigo / Helena).
- **Adequação de Supervisão Institucional:** No formulário de cadastro de equipe e na matriz de polos, Formadoras passam a ter como supervisor descritivo "Equipe Técnica / Secretaria Municipal".
- **Sanidade e Limpeza de Código:** Funções de filtro de escopo (`getScopedObservations`, `getScopedNotes`, `getScopedSchedules`) simplificadas sem checagens órfãs de `gestor`. No agendamento de novas observações (`startNewObservation`), o tipo avaliado foi restrito com precisão aos dois instrumentos homologados: `professora` (se coordenador) ou `coordenador` (se formadora).
- **Atualização do Cabeçalho e Modal de Histórico:** Elevação do identificador superior para `📋 Versão 0.12 (v6.3)` e inclusão do registro cronológico detalhado no `#modalChangelog`.

---

### [Versão 0.13] - Desacoplamento da Matriz de Rubricas para Aba Dedicada Exclusiva
* **Data e Horário:** 07 de Outubro de 2026 — 16:35:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v11.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v11.html)
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Plano Executivo:** [`planos_de_implementacao/plano_desacoplamento_rubricas_aba_dedicada.md`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_desacoplamento_rubricas_aba_dedicada.md)
* **Contexto:** Eliminação da saturação de informações e redundância na 1ª aba de Gestão Pedagógica, reativando a tela autônoma dedicada (`#screenRubricsAdmin`) no slot Screen 11 e conectando diretamente o botão "Rubricas" da barra superior e do menu mobile.

#### 🚀 Inclusões, Modificações e Exclusões
- **Remoção Integral da Matriz de Rubricas da 1ª Aba:** Exclusão da sub-aba `pedagTabRubrics` e da sub-view `#pedagViewRubrics` de `#homeGestaoView`. A tela de Gestão Pedagógica agora mantém foco estrito na governança territorial (`UEs & Polos`), recursos humanos (`Equipes & Servidores`) e relatórios macro (`Extrações SSOT`).
- **Reativação da Tela Autônoma (Screen 11 - `#screenRubricsAdmin`):** Inclusão de seção dedicada autônoma em `<main>` contendo o seletor paramétrico de matrizes (Professores vs. Coordenadores), botões de exportação (CSV/JSON), restauração padrão e o editor descritivo em `#rubricsEditContainer`.
- **Roteamento Exclusivo e Direto:** Modificação de `navigateToTab('rubrics')` para ativar diretamente a tela `#screenRubricsAdmin` sem acionar a 1ª aba ou sub-abas de gestão.
- **Acesso Mobile Dedicado (Mais Opções):** Inclusão do botão `#mobMenuRubricsBtn` ("Matriz de Rubricas") no modal inferior mobile com visibilidade restrita e dinâmica para perfis técnicos em `setRoleScope`.
- **Saneamento de Estados e Fallback:** Atualização de `switchPedagSubTab` para redirecionar chamadas legadas a `'rubrics'` para `'units'` e salvaguarda em `renderHomeScreen` para evitar telas em branco.
- **Sincronização Reativa Atualizada:** `syncRubricMatrixSelect` agora verifica se `#screenRubricsAdmin` está ativa antes de disparar `renderRubricsAdminScreen()`.
- **Atualização do Cabeçalho e Histórico:** Identificador do aplicativo elevado para `📋 Versão 0.13 (v6.4)` e incorporação do marco no changelog oficial.

---

### [Versão 0.14] - Disponibilização para Download das Matrizes de Referência Originais (PDF)
* **Data e Horário:** 07 de Outubro de 2026 — 16:45:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v6.5_matrizes_pdf.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v6.5_matrizes_pdf.html)
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Plano Executivo:** [`planos_de_implementacao/plano_download_rubricas_referencia.md`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_download_rubricas_referencia.md)
* **Contexto:** Disponibilização pública e institucional dos instrumentos oficiais de referência das rubricas pedagógicas (arquivos PDF originais) para visualização no navegador e download direto para impressão em campo e consulta das equipes.

#### 🚀 Inclusões, Modificações e Exclusões
- **Padronização e Armazenamento Estático dos Arquivos Oficiais:** Renomeação e alocação segura em `firebase_deploy/public/docs/`:
  - `matriz_professores.pdf` (925 KB) — Ficha de Observação da Prática Docente (Seção III - Mediação Docente).
  - `matriz_coordenadores.pdf` (170 KB) — Instrumento de Acompanhamento das Visitas Pedagógicas do Formador.
- **Acesso Direto na Barra de Ações Superior (Navbar):** Inserção do botão `.btn-ref-docs` com ícone `📑`, rótulo responsivo `Matrizes (PDF)` e tooltip explicativo, acessível independentemente da tela ativa.
- **Modal Institucional de Matrizes de Referência (`#modalRefDocs`):** Painel modal elegante com apresentação visual e descritiva de cada documento, disponibilizando botões para visualização no navegador (`target="_blank"`) e download direto (`download="matriz_*.pdf"`).
- **Atalho na Tela de Matriz de Rubricas (`#screenRubricsAdmin`):** Inclusão de botão dedicado `📑 Matrizes Oficiais (PDF)` na barra de ações das rubricas, permitindo consulta imediata durante o gerenciamento dos descritores.
- **Acesso Mobile Unificado (`#mobileMenuOverlay`):** Disponibilização do botão "Matrizes de Referência (PDF)" no menu inferior deslizante mobile para todos os usuários.
- **Atualização do Cabeçalho e Histórico:** Identificador do aplicativo elevado para `📋 Versão 0.14 (v6.5)` e incorporação do marco no changelog oficial.

---

### [Versão 0.15] - Implementação da Tela de Login Autêntica (E-mail e Senha) com Mock Credentials
* **Data e Horário:** 07 de Outubro de 2026 — 17:15:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v12.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v12.html)
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Plano Executivo:** [`planos_de_implementacao/plano_implementacao_tela_login.md`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_implementacao_tela_login.md)
* **Contexto:** Substituição do antigo modal seletor direto de perfis por um fluxo autêntico de autenticação via formulário com validação client-side (mock de credenciais), preparando a arquitetura para integração com o Firebase Auth.

#### 🚀 Inclusões, Modificações e Exclusões
- **Substituição dos Cards de Perfil por Formulário:** Remoção dos cards de atalho direto para os usuários e introdução do `<form id="loginForm">` com campos estruturados para E-mail, Senha e botão "Entrar".
- **Dicionário Mock de Credenciais:** Mapeamento em `mockCredentials` associando e-mails reais de teste aos perfis de Mariana (CP), Clarice (FP), Helena (ET) e Rodrigo (ET), todos padronizados com a senha `123456`.
- **Validação com Tratamento de Erro e Foco:** Função `handleLoginSubmit(event)` intercepta o envio, valida os dados e exibe alerta visual de erro (`#loginError`) em caso de falha, limpando o campo de senha e mantendo o foco do usuário.
- **Limpeza de Estado e Reset do Formulário:** Ao logar com sucesso ou efetuar logout, o formulário de credenciais é automaticamente resetado (`loginForm.reset()`), garantindo tela limpa e preservação de privacidade.
- **Link de Recuperação de Senha:** Disponibilização de link informativo "Esqueceu a senha?" com alerta de recurso em implementação futura.
- **Atualização do Changelog Oficial:** Registro completo na tabela executiva, matriz comparativa e no modal do app.

---

### [Versão 0.16] - Base de Dados Única para Autenticação e Perfis (USERS_DB)
* **Data e Horário:** 07 de Outubro de 2026 — 17:30:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v13.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v13.html)
* **Base / Insumos:** [`planos_de_implementacao/plano_base_de_dados_unica_20261007.md`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_base_de_dados_unica_20261007.md)
* **Contexto:** Consolidação das estruturas segregadas de usuários (`INITIAL_USERS`) e credenciais de acesso (`mockCredentials`) em uma única fonte de verdade (`USERS_DB`), associando autenticação e perfis organizacionais diretamente no registro de cada usuário.

#### 🚀 Inclusões, Modificações e Exclusões
- **Unificação em `USERS_DB`:** Fusão de `INITIAL_USERS` com os campos `email` e `password` de cada usuário cadastrado (Mariana Ferreira, Clarice Barbosa, Helena Martins e Rodrigo Toledo).
- **Remoção de `mockCredentials`:** Eliminação completa da estrutura auxiliar de credenciais, reduzindo redundância e simplificando a manutenção de contas.
- **Refatoração de `handleLoginSubmit()`:** Validação de login diretamente através de busca dinâmica em `USERS_DB` pelo e-mail e conferência de senha.
- **Atualização de `getCurrentUser()`:** Obtenção do perfil do usuário ativo referenciando diretamente a base consolidada `USERS_DB`.
- **Preservação de Integridade:** Garantia de funcionamento transparente de rascunhos, controle de escopo e interface de usuário sem impacto em fluxos legados.

---

### [Versão 0.17] - Edição e Exclusão Modal de Profissionais da Equipe Pedagógica
* **Data e Horário:** 07 de Outubro de 2026 — 17:35:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v14.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v14.html)
* **Base / Insumos:** [`planos_de_implementacao/plano_edicao_profissional.md`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_edicao_profissional.md)
* **Contexto:** Substituição do botão estático "Remover" por "Editar" na listagem de profissionais da Gestão Pedagógica, permitindo atualização completa de dados e exclusão com confirmação.

#### 🚀 Inclusões, Modificações e Exclusões
- **Substituição de Ação na Tabela (`renderTeamTable`):** Substituição do botão "Remover" pelo botão "Editar", invocando `openEditMemberModal(id)`.
- **Novo Modal de Edição (`modalEditMember`):** Interface modal padronizada para edição de Nome, Cargo/Função, Unidade Escolar e Superior Imediato/Vinculação.
- **Dinamização Reativa de Vinculação (`onEditMemberRoleChange`):** Regras de negócio aplicadas na edição com seleção automática de Coordenadora Pedagógica da Unidade para docentes, Formadora Responsável para CPs, e Supervisão Institucional para Formadoras.
- **Persistência de Edição (`saveEditTeamMember`):** Atualização do profissional correspondente em `appState.teamMembers`, persistência via `saveState()`, re-renderização da tabela e notificação toast.
- **Exclusão Segura com Confirmação (`deleteTeamMember`):** Disponibilização do botão "Excluir Profissional" dentro do modal com diálogo de confirmação prévia (`confirm()`).

---

## 📊 Matriz Comparativa de Recursos por Versão

| Funcionalidade / Marco | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 0.10 | 0.11 | 0.12 | 0.13 | 0.14 | 0.15 | 0.16 | 0.17 | 0.18 | 0.19 |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Escala Tripartite (Piloto) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Escala 4 Opções com "N/A" | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Drill-down Longitudinal | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Governança 4 Níveis Institucionais | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Governança Alinhada em 3 Perfis Oficiais | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Sistema Real de Logout/Troca de Perfil | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Tela de Login com E-mail/Senha (Mock) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Base de Dados Única (USERS_DB) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Turmas Selecionáveis por Lista | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Cronograma Anual/Bimestral de Visitas | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Privacidade Estrita de Rascunhos | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Importação/Exportação em Lote CSV | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Bloqueio Estrito de Autoavaliação | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Estabilização Scroll Touch Mobile | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Single Source of Truth (SSOT - JSON) | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Aba Integrada de Gestão Operacional | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Vinculação Automática CP → Professora | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Edição/Exclusão Modal de Profissionais | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Barra Mobile com 4 Botões + "Mais" | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Escopo Dinâmico de Polos da Formadora | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Reatividade na Seleção de UE (Membros) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Coordenação de EI Incorporada à Equipe Técnica | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Rubricas Oficiais Atualizadas (PDFs) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Sidebar Operacional da Equipe Técnica | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Exportação Parametrizada de Rubricas | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Navegação Unificada sem Top-Tabs Redundantes | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Tela Autônoma de Rubricas (Screen 11) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Matrizes Oficiais em PDF (Download/Visualização) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Deploy em Produção (Firebase) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---
*Documento consolidado conforme diretrizes do repositório SerTão Criança.*

### [Versão 0.18] - Criação Autônoma de Contas e Usuário Administrador (Bruno)
* **Data e Horário:** 07 de Outubro de 2026 — 17:50:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v18_criacao_contas.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v18_criacao_contas.html)
* **Base / Insumos:** [`planos_de_implementacao/plano_criacao_contas_e_usuario_bruno.md`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_criacao_contas_e_usuario_bruno.md)
* **Contexto:** Disponibilização de fluxo de auto-registro a partir da tela de login com integração dinâmica ao estado local (`appState.customUsers`) e inclusão de credencial fixa para governança.

#### 🚀 Inclusões e Funcionalidades
- **Link e Modal "Criar conta":** Disponibilização de formulário modal de registro a partir do link na tela inicial de login (`modalRegisterScreen`).
- **Persistência de Custom Users:** Inclusão de `appState.customUsers` no estado persistente do aplicativo (`saveState`/`loadState`), integrando novas contas dinamicamente ao `USERS_DB`.
- **Credenciais do Administrador Bruno:** Inclusão fixa do usuário administrador Bruno Silva (`bruno.silva@lepes.org`) com perfil de Equipe Técnica.

---

### [Versão 0.19] - Remoção da Escolha de Cargo no Cadastro e Governança de Contas Pendentes
* **Data e Horário:** 07 de Outubro de 2026 — 18:02:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v19_remocao_escolha_cargo.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v19_remocao_escolha_cargo.html)
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Base / Insumos:** [`planos_de_implementacao/plano_remocao_escolha_cargo_cadastro.md`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_remocao_escolha_cargo_cadastro.md)
* **Contexto:** Eliminação de brecha de privilégios no auto-cadastro, bloqueio preventivo de ações em contas recém-criadas e atribuição controlada de perfis pela Equipe Técnica.

#### 🚀 Inclusões, Modificações e Exclusões
- **Remoção do Seletor de Cargo:** Eliminação completa do campo `<select id="regRole">` do modal de criação de contas.
- **Auto-cadastro Neutro (Acesso Pendente):** Todo novo usuário recebe automaticamente status provisório (`roleKey: 'pendente'`, `roleTitle: 'Acesso Pendente'`).
- **UI Restritiva em Modo Sandbox:** Usuários com acesso pendente visualizam aviso explicativo de espera, com bloqueio integral de criação de observações, anotações formativas, cronograma e abas administrativas.
- **Trava de Navegação:** Função `navigateToTab()` reforçada para bloquear tentativas de acesso direto por rota/aba para usuários pendentes.
- **Gestão pela Equipe Técnica:** Adição de opções de perfil nos modais de membros (`modalAddMember` e `modalEditMember`), permitindo que a Equipe Técnica aprove e defina o cargo e lotação do usuário.
- **Sincronização Bidirecional e Limpeza:** A edição e exclusão de profissionais sincroniza e atualiza em tempo real tanto `appState.teamMembers` quanto a base de autenticação (`appState.customUsers` e `USERS_DB`).
- **Atualização do Modal de Changelog:** Inclusão da Versão 0.19 detalhada no histórico nativo do aplicativo.

### [Versão 0.20] - Adequação da Síntese Final para Coordenação Pedagógica
* **Data e Horário:** 08 de Outubro de 2026 — 13:35:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v20_remover_itens_didatica_coordenacao.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v20_remover_itens_didatica_coordenacao.html)
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Base / Insumos:** [`planos_de_implementacao/plano_remover_itens_didatica_coordenacao.md`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_remover_itens_didatica_coordenacao.md)
* **Contexto:** Remoção contextual de itens de observação de didática de sala de aula da síntese final quando o profissional avaliado for Coordenador Pedagógico, mantendo a coerência metodológica do instrumento.

#### 🚀 Inclusões, Modificações e Exclusões
- **Encapsulamento de Didática de Sala:** Itens 1 (Nível de Predominância de Materiais), 2 (Tipo de Material Predominante), 3 (Tipo de Organização do Grupo) e 4 (Ocorrências e Registros de Campo Vinculados) agrupados no container `#synthesisDidacticSection`.
- **Ocultação Condicional em `renderSynthesisScreen`:** Quando `obs.evaluatedType === 'coordenador'`, a seção `#synthesisDidacticSection` é ocultada (`display: none`), preservando exibição integral (`display: block`) para observações docentes.
- **Reenumeração Dinâmica do Parecer:** Título `#synthesisFeedbackTitle` alterado dinamicamente para *"1. Parecer Pedagógico e Devolutiva Formativa"* em avaliações de coordenadores e mantido como *"5. Parecer Pedagógico e Devolutiva Formativa"* para docentes.
- **Validação Condicional em `finalizeObservation`:** Validação que exigia seleção obrigatória de nível de materiais, tipo predominante e organização do grupo foi condicionada exclusivamente para avaliações de docentes (`obs.evaluatedType !== 'coordenador'`), destravando a finalização para coordenadores.
- **Atualização do Modal de Changelog:** Inclusão da Versão 0.20 no histórico nativo e atualização do botão indicador no header.

---
*Documento consolidado conforme diretrizes do repositório SerTão Criança.*

### [Versão 0.21] - Correção de Acessos e Cargo Professora
* **Data e Horário:** 08 de Outubro de 2026 – 13:58:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_correcao_acessos.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_correcao_acessos.html)
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Base / Insumos:** [`planos_de_implementacao/plano_correcao_acessos.md`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_correcao_acessos.md)
* **Contexto:** Resolução de herança de interface entre logouts, criação da regra de UI para o cargo "professora" e correção de falha no login automático.

#### ⚙️ Inclusões, Modificações e Exclusões
- **Reset Global de UI (`applyUserRoleUI`):** Ocultação proativa de todas as abas e menus administrativos no início da renderização, prevenindo herança de acessos do usuário anterior.
- **Regra de Interface para Professora:** Adição de condição específica em `applyUserRoleUI()` para o cargo `professora`, limitando estritamente a visão ao próprio dashboard.
- **Limpeza de Sessão no Logout (`executeLogout`):** Modificação para definir explicitamente `appState.currentUserKey = null` e salvar o estado no momento do logout.
- **Tratamento de Sessão Inválida (`getCurrentUser`):** Ajuste na busca do usuário para retornar vazio caso a sessão não exista, acionando o logout automático ao invés de forçar login padrão.

### [Versão 0.22] - Proteção e Modo de Edição na Matriz de Rubricas
* **Data e Horário:** 08 de Outubro de 2026 – 14:20:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v22_modo_edicao_rubricas.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v22_modo_edicao_rubricas.html)
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Base / Insumos:** [`planos_de_implementacao/plano_modo_edicao_rubricas.md`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_modo_edicao_rubricas.md)
* **Contexto:** Proteção estrutural da Matriz de Rubricas (SSOT) contra alterações acidentais de descritores e critérios, introduzindo modo de edição explícito com bloqueio de textareas e confirmação de segurança na restauração.

#### ⚙️ Inclusões, Modificações e Exclusões
- **Card de Alerta Ostensivo e Toggle:** Substituição do card pedagógico inicial por um aviso em amarelo de impacto sensível e adição do switch/checkbox "Habilitar Edição" (`#toggleRubricsEditMode`).
- **Controle de Estado de Edição (`window.isRubricsEditMode`):** Introdução da variável de controle e função reativa `toggleRubricsEditMode(checked)` para alternância imediata de modo.
- **Bloqueio de Digitação e Feedback Visual (`renderRubricsAdminScreen`):** Condicionamento dos atributos `disabled` e cor de fundo (`#F1F5F9` bloqueado vs `#FFFFFF` editável) em todos os `<textarea>` gerados na matriz conforme o estado de edição.
- **Proteção na Restauração Padrão (`restoreDefaultRubricsPrompt`):** Exigência de que o modo de edição esteja ativo para acionar a restauração das rubricas, complementada por diálogo `confirm()` alertando sobre a perda irreversível das alterações customizadas.
- **Atualização do Modal de Changelog e Header:** Registro da Versão 0.22 no histórico nativo e atualização do botão indicador de versão para `📋 Versão 0.22 (v7.1)`.

### [Versão 0.23] - Validação de E-mail Único no Cadastro de Usuários
* **Data e Horário:** 08 de Outubro de 2026 – 14:25:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v23_validacao_email_registro.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v23_validacao_email_registro.html)
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Base / Insumos:** [`planos_de_implementacao/plano_validacao_email_registro.md`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_validacao_email_registro.md)
* **Contexto:** Blindagem da base de dados e do fluxo de autenticação contra a criação de contas duplicadas com o mesmo endereço de e-mail, orientando o usuário existente para a recuperação de senha.

#### ⚙️ Inclusões, Modificações e Exclusões
- **Validação Preventiva de Duplicidade (`handleRegisterSubmit`):** Checagem imediata via `Object.values(USERS_DB).some(...)` comparando o e-mail informado (em minúsculas) antes da geração da chave de novo usuário (`newKey`).
- **Alerta de Conta Já Existente:** Interrupção do fluxo de cadastro com diálogo `alert()` explicativo orientando o usuário a utilizar a opção "Esqueceu a senha?" na tela de login.
- **Atualização do Modal de Changelog e Header:** Registro da Versão 0.23 no histórico nativo do app e atualização do botão indicador no cabeçalho para `📋 Versão 0.23 (v7.2)`.

### [Versão 0.24] - Confirmações de Salvamento nos Módulos de Rubricas e Gestão Pedagógica
* **Data e Horário:** 08 de Outubro de 2026 – 14:35:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v24_confirmacoes_salvamento.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v24_confirmacoes_salvamento.html)
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Base / Insumos:** [`planos_de_implementacao/plano_confirmacoes_salvamento_rubricas_gestao.md`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_confirmacoes_salvamento_rubricas_gestao.md)
* **Contexto:** Prevenção contra alterações acidentais e perda de dados através de diálogos `confirm()` antes da persistência de informações críticas de UEs, membros da equipe, matrizes de rubricas e importações de dados.

#### ⚙️ Inclusões, Modificações e Exclusões
- **Confirmação ao Criar Nova Unidade Escolar (`saveNewUnit`):** Interceptação pós-validação de campos solicitando confirmação do usuário antes de inserir e persistir a UE no estado.
- **Confirmação ao Remover Unidade Escolar (`removeUnit`):** Bloqueio preventivo antes da exclusão de qualquer UE cadastrada.
- **Confirmação em Importação CSV de Unidades (`handleUnitsCsvUpload`):** Solicitação de confirmação prévia antes da leitura da planilha, esvaziando o input de arquivo caso a operação seja cancelada.
- **Confirmação ao Cadastrar Profissional (`saveNewTeamMember`):** Checagem confirmatória antes da inclusão de novos servidores no sistema.
- **Confirmação ao Salvar Edição de Profissional (`saveEditTeamMember`):** Validação com diálogo confirmatório antes de propagar alterações para a lista de membros e para o `USERS_DB`.
- **Confirmação em Importação CSV de Servidores (`handleTeamCsvUpload`):** Confirmação prévia antes de processar o arquivo CSV de profissionais.
- **Proteção e Reversão na Edição de Rubricas (`updateCriterionText`):** Solicitação de confirmação ao alterar qualquer descritor; em caso de cancelamento, reexecuta `renderRubricsAdminScreen()` para restaurar imediatamente o texto anterior na interface.
- **Alerta Enfático na Importação de Backup Completo JSON (`importFullBaseJSON`):** Confirmação com aviso ostensivo sobre a substituição integral de todos os dados da aplicação.
- **Atualização do Modal de Changelog e Header:** Registro da Versão 0.24 no histórico nativo e atualização do botão indicador no topo para `📋 Versão 0.24 (v7.3)`.

### [Versão 0.25] - Dinamização da Gestão de Formadores e Coordenadores
* **Data e Horário:** 08 de Outubro de 2026 – 14:55:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v25_modificacao_formador_coordenador.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v25_modificacao_formador_coordenador.html)
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Base / Insumos:** [`planos_de_implementacao/plano_modificacao_formador_coordenador.md`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_modificacao_formador_coordenador.md)
* **Contexto:** Correção de restrições estáticas ("hardcode") nos fluxos de cadastro e edição de membros da equipe pedagógica, permitindo que Formadores sejam alocados a qualquer Polo Regional cadastrado e que Coordenadores vinculem-se aos Formadores reais presentes no sistema.

#### ⚙️ Inclusões, Modificações e Exclusões
- **Seleção Dinâmica de Polos para Formadores (`onNewMemberRoleChange` & `onEditMemberRoleChange`):** Campo de Unidade renomeado condicionalmente para "Polo Regional / Vinculação" e populado com a lista única de polos extraídos dinamicamente de `appState.units`.
- **Listagem Real de Formadoras para Coordenadores (`onNewMemberRoleChange` & `onEditMemberRoleChange`):** Select de supervisão/formadora responsável agora filtra dinamicamente todos os servidores com `roleKey === 'formador'` em vez de exibir opção estática.
- **Eliminação do Hardcode de Lotação (`saveNewTeamMember` & `saveEditTeamMember`):** Removida a imposição estática de polo no salvamento de servidores com perfil formador, respeitando integralmente a escolha selecionada no modal.
- **Otimização de Ciclo dos Modais (`openAddMemberModal` & `openEditMemberModal`):** Desacoplamento da população manual de opções para delegar a responsabilidade reativa integral às funções `onNewMemberRoleChange` e `onEditMemberRoleChange`.
- **Atualização do Modal de Changelog e Header:** Registro da Versão 0.25 no histórico nativo e atualização do botão indicador no topo para `📋 Versão 0.25 (v7.4)`.

---

### [Versão 0.26] - Edição de Agendamento no Cronograma Longitudinal
* **Data e Horário:** 08 de Outubro de 2026 – 15:05:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v26_edicao_cronograma.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v26_edicao_cronograma.html)
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Base / Insumos:** [`planos_de_implementacao/plano_edicao_cronograma.md`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_edicao_cronograma.md)
* **Contexto:** Disponibilização da capacidade de editar agendamentos de visitas pedagógicas já planejadas no cronograma longitudinal, permitindo correções de profissional, escola, bimestre, data e horário sem a necessidade de descartar e recriar o registro.

#### ⚙️ Inclusões, Modificações e Exclusões
- **Ação de Edição na Tabela do Cronograma (`renderScheduleScreen`):** Inclusão do botão "✏️ Editar" ao lado de "Iniciar Visita →" para todas as visitas com status diferente de "realizado".
- **Controle de Estado de Edição (`editingScheduleId`):** Declaração da variável de controle para distinguir operações de inclusão (`null`) versus atualização (`scheduleId`).
- **Modal Adaptativo e Carga de Dados (`openEditScheduleModal` e `openAddScheduleModal`):** Carga dinâmica de campos de unidade, profissional, bimestre, data e horário para a visita selecionada, além de ajuste dinâmico do título do modal (`#scheduleModalTitle`).
- **Atualização In-Place com Persistência (`saveNewSchedule`):** Atualização do registro existente no array `appState.schedules` mantendo integridade de IDs, gravação no `localStorage` via `saveState()`, feedback visual com toast e re-renderização imediata da tabela.
- **Atualização do Modal de Changelog e Header:** Registro da Versão 0.26 no histórico nativo e atualização do botão indicador no topo para `📋 Versão 0.26 (v7.5)`.

---

### [Versão 0.27] - Correção do Alinhamento da Barra Superior no Mobile (UI/UX Hotfix Mobile)
* **Data e Horário:** 08 de Outubro de 2026 – 15:10:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v27_botoes_topo_mobile.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v27_botoes_topo_mobile.html)
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Base / Insumos:** [`planos_de_implementacao/plano_botoes_topo_mobile.md`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_botoes_topo_mobile.md)
* **Contexto:** Em telas móveis e dispositivos com largura abaixo de 860px, os elementos da barra superior (`.navbar`) encontravam-se descentralizados, colidindo ou com botões espremidos devido à altura fixa e à ausência de regra responsiva de quebra vertical.

#### ⚙️ Inclusões, Modificações e Exclusões
- **Flexibilidade da Barra Superior (`@media (max-width: 859px)`):** Redefinição de `.navbar` para `height: auto` e padding ergonômico de 12px 16px.
- **Disposição em Coluna do Contêiner (`.navbar-container`):** Configuração de `flex-direction: column`, `justify-content: center` e gap de 12px, organizando marca/título na linha superior e ações na linha seguinte.
- **Quebra e Centralização de Botões de Ação (`.navbar-actions`):** Aplicação de `width: 100%`, `justify-content: center` e `flex-wrap: wrap`, assegurando que os botões (cargo, matrizes PDF, changelog, contador e avatar) fiquem perfeitamente centralizados e adaptáveis.
- **Centralização da Marca/Logo (`.navbar-brand`):** Aplicação de `width: 100%` e `justify-content: center` para centralizar a logo e o subtítulo institucional.
- **Atualização do Modal de Changelog e Header:** Registro da Versão 0.27 no histórico nativo e atualização do botão indicador no topo para `📋 Versão 0.27 (v7.6)`.

---

### [Versão 0.28] - Ajuste do Header (Navbar) na Visão Mobile
* **Data e Horário:** 08 de Outubro de 2026 – 15:25:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v28_ajuste_header_mobile.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v28_ajuste_header_mobile.html)
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Base / Insumos:** [`planos_de_implementacao/plano_ajuste_header_mobile.md`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_ajuste_header_mobile.md)
* **Contexto:** Na versão móvel, a barra superior vinha assumindo quebras de linha excessivas, sobrepondo o conteúdo e os cards de visitação durante o scroll. O layout foi reorganizado para linha única e botões secundários foram movidos para o menu deslizante "Mais".

#### ⚙️ Inclusões, Modificações e Exclusões
- **Layout Horizontal em Linha Única (`@media (max-width: 859px)`):** Retorno da barra superior à altura padrão (`height: var(--header-height)`), com `flex-direction: row`, `justify-content: space-between` e `flex-wrap: nowrap`, eliminando a ocupação excessiva de tela no mobile.
- **Ocultação de Elementos Secundários no Topo Mobile:** Classes `.role-badge-btn`, `.btn-ref-docs` e `.btn-changelog` ocultadas na visão móvel (`display: none !important`), deixando no topo apenas a logo do SerTão Criança, o contador de notas e o avatar de perfil.
- **Inclusão do Histórico de Versões no Menu Mobile:** Adicionado botão dedicado de "Histórico de Versões" com acionamento de `openChangelogModal()` dentro de `#mobileMenuOverlay` (menu deslizante "Mais Opções").
- **Atualização do Modal de Changelog e Header:** Registro da Versão 0.28 no histórico nativo e atualização do botão indicador no topo para `📋 Versão 0.28 (v7.7)`.

---

### [Versão 0.29] - Correção de Atribuição de Função e Visibilidade para Usuários Pendentes
* **Data e Horário:** 08 de Outubro de 2026 – 15:30:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v29_correcao_acessos_pendentes.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v29_correcao_acessos_pendentes.html)
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Base / Insumos:** [`planos_de_implementacao/plano_correcao_acessos_pendentes.md`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_correcao_acessos_pendentes.md)
* **Contexto:** Ajuste no fluxo de gestão de usuários para evitar que profissionais com papel de acesso pendente desapareçam sob filtros de escola/polo, padronização do registro inicial e garantia de persistência no banco de autenticação simulado ao criar novos profissionais pelo painel.

#### ⚙️ Inclusões, Modificações e Exclusões
- **Padronização Cadastral (`handleRegisterSubmit`):** Definição de `school` e `supervisor` como `'Aguardando Definição'` (em substituição ao valor anterior genérico `'Definir'`), padronizando o estado inicial do usuário registrado.
- **Sincronização com Autenticação (`saveNewTeamMember`):** Novos profissionais adicionados manualmente pelo gestor agora são salvos diretamente em `USERS_DB` e `appState.customUsers`, garantindo que possam se autenticar posteriormente.
- **Visibilidade Contínua de Pendentes (`renderTeamScreen`):** Condicional inserida no filtro `schoolOrPoloFilter` garantindo que membros com `roleKey === 'pendente'` continuem visíveis na listagem de Pessoal mesmo com filtros de escola ou polo acionados, facilitando a atribuição e edição de papéis pelo gestor.
- **Atualização do Modal de Changelog e Header:** Registro da Versão 0.29 no histórico nativo e atualização do botão indicador no topo para `📋 Versão 0.29 (v7.8)`.

---

### [Versão 0.30] - Compressão de Imagens via Canvas e Proteção de Armazenamento Local
* **Data e Horário:** 08 de Outubro de 2026 – 15:45:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v30_compressao_fotos.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v30_compressao_fotos.html)
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Base / Insumos:** [`planos_de_implementacao/plano_compressao_fotos.md`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_compressao_fotos.md)
* **Contexto:** Ao anexar fotos de alta resolução diretamente da câmera/dispositivo nas observações, o Base64 bruto excedia o limite de 5MB do `localStorage`, gerando erro de cota não tratado (`QuotaExceededError`) e travando a interface. Foi implementada compressão em tempo real via Canvas e salvamento seguro com tratamento de erro.

#### ⚙️ Inclusões, Modificações e Exclusões
- **Compressão Dinâmica via Canvas (`handlePhotoUpload`):** Redimensionamento proporcional das imagens para no máximo 1024px e conversão para JPEG com qualidade de 60%, reduzindo o tamanho de múltiplos MBs para dezenas de KBs.
- **Proteção e Retorno Booleano (`saveState`):** Implementação de bloco `try...catch` nas gravações de `localStorage`, com emissão de alerta explicativo caso o limite do navegador seja atingido e retorno booleano de status (`true`/`false`).
- **Resiliência e Reversão de Memória (`handlePhotoUpload`):** Caso o `saveState()` falhe por falta de espaço no dispositivo, a foto recém-adicionada é removida do array em memória (`appState.currentObs.photos[critId].pop()`), preservando a consistência da sessão e evitando travamento.
- **Atualização do Modal de Changelog e Header:** Registro da Versão 0.30 no histórico nativo e atualização do botão indicador no topo para `📋 Versão 0.30 (v7.9)`.

---

### [Versão 0.31] - Atribuição Definitiva de Cargos e Sincronização Geral de Contas
* **Data e Horário:** 08 de Outubro de 2026 – 15:50:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v31_atribuicao_cargos_definitivo.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v31_atribuicao_cargos_definitivo.html)
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Base / Insumos:** [`planos_de_implementacao/plano_atribuicao_cargos_definitivo.md`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_atribuicao_cargos_definitivo.md)
* **Contexto:** Resolução definitiva para atribuição de cargos a novos usuários e correção de contas criadas pelo painel sem possibilidade de login. Sincronização simultânea do arquivo de produção (`firebase_deploy/public/index.html`) e do arquivo de testes da raiz (`index.html`).

#### ⚙️ Inclusões, Modificações e Exclusões
- **E-mail e Senha no Cadastro de Profissionais (`modalAddMember`):** Adição dos campos "E-mail (Login)" e "Senha" no formulário de adição manual de membros, permitindo que o gestor cadastre profissionais já habilitados para autenticação.
- **Sincronização Completa de Contas (`saveNewTeamMember`):** Captura dos novos campos e inclusão do usuário em `USERS_DB` e `appState.customUsers` com credenciais funcionais e limpeza automática dos campos pós-cadastro.
- **Bypass de Filtro e Harmonização (`renderTeamScreen` e `handleRegisterSubmit`):** Aplicação da regra que mantém usuários pendentes visíveis na lista de equipe independentemente do filtro de unidade escolar selecionado e padronização para 'Aguardando Definição' em ambos os arquivos HTML.
- **Atualização do Modal de Changelog e Header:** Registro da Versão 0.31 no histórico nativo e atualização do botão indicador no topo para `📋 Versão 0.31 (v7.10)`.

---

### [Versão 0.32] - Exibição e Edição de E-mail de Usuários na Equipe e Perfil
* **Data e Horário:** 08 de Outubro de 2026 – 15:58:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v32_exibicao_email.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v32_exibicao_email.html)
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Base / Insumos:** [`planos_de_implementacao/plano_exibicao_email.md`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_exibicao_email.md)
* **Contexto:** Permitir a visualização clara dos e-mails vinculados a cada profissional cadastrado na tela de Gestão de Equipe e no modal "Meu Perfil", além de possibilitar a edição ou inserção de e-mail opcional no modal de edição de profissionais.

#### ⚙️ Inclusões, Modificações e Exclusões
- **E-mail na Tabela de Gestão de Equipe (`renderTeamScreen`):** Renderização do e-mail logo abaixo do nome do servidor (`✉️ email` ou `Sem e-mail vinculado`).
- **Campo Opcional no Modal de Edição (`#modalEditMember` / `openEditMemberModal` / `saveEditTeamMember`):** Inclusão do input `editMemberEmail`, preenchimento dinâmico ao abrir a edição e sincronização ao salvar com `teamMembers`, `USERS_DB` e `customUsers`.
- **Exibição do E-mail no Perfil (`#modalProfile` / `openProfileModal`):** Adição do elemento `userProfileEmail` no perfil exibindo `E-mail: {email}` ou `Sem e-mail vinculado`.
- **Atualização do Modal de Changelog e Header:** Registro da Versão 0.32 no histórico nativo e atualização do botão indicador no topo para `📋 Versão 0.32 (v7.11)`.

---

### [Versão 0.33] - Login com Conta do Gestor e Troca Obrigatória de Senha Provisória
* **Data e Horário:** 08 de Outubro de 2026 – 16:20:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v33_troca_senha_obrigatoria.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v33_troca_senha_obrigatoria.html)
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Base / Insumos:** [`planos_de_implementacao/plano_login_conta_gestor_e_senha_provisoria.md`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_login_conta_gestor_e_senha_provisoria.md)
* **Contexto:** Garantir a segurança no primeiro acesso de colaboradores cujas contas são geradas pelo gestor com senha provisória, bloqueando acesso direto às funcionalidades até que uma senha pessoal e secreta seja redefinida.

#### ⚙️ Inclusões, Modificações e Exclusões
- **Flag de Senha Provisória (`saveNewTeamMember`):** Contas cadastradas pelo gestor agora recebem automaticamente a propriedade `mustChangePassword: true`, enquanto contas do auto-registro permanecem sem a obrigatoriedade.
- **Intercepção de Autenticação (`authenticateUser`):** Se o usuário autenticado possuir `mustChangePassword === true`, a navegação para a home e a inicialização de UI são suspensas e o modal de troca é acionado.
- **Modal de Troca de Senha (`#modalChangePassword`):** Interface modal exclusiva (com `z-index: 10000`), sem botão de fechar, exigindo nova senha de no mínimo 6 caracteres e confirmação idêntica.
- **Sincronização Integral e Atualização de Estado (`handleChangePasswordSubmit`):** Atualização da senha e desativação de `mustChangePassword` em `USERS_DB`, `customUsers` e `teamMembers`, com persistência via `saveState()`.
---

### [Versão 0.34] - Vinculação Automática de Ocorrências de Campo à Observação Ativa
* **Data e Horário:** 08 de Outubro de 2026 – 16:48:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v34_vinculacao_automatica_ocorrencia.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v34_vinculacao_automatica_ocorrencia.html)
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Base / Insumos:** [`planos_de_implementacao/plano_vinculacao_automatica_ocorrencia.md`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_vinculacao_automatica_ocorrencia.md)
* **Contexto:** Garantir que anotações e ocorrências formativas redigidas durante uma observação ativa em andamento sejam automaticamente contextualizadas e integradas à ficha da visita, sem demandar importação manual posterior.

#### ⚙️ Inclusões, Modificações e Exclusões
- **Bloqueio Contextual no Modal (`openQualitativeNoteModal`):** O modal agora identifica a existência de `appState.currentObs`. Caso haja uma observação em andamento, os seletores de Unidade Escolar (`noteSchool`) e de Profissional em Foco (`noteTeacher`) são pré-carregados com os dados da observação atual e travados contra alterações indevidas.
- **Garantia de Existência do Profissional no Seletor:** Inclusão dinâmica da opção do profissional no `<select>` caso este não esteja listado previamente no polo/unidade.
- **Vinculação Imediata ao Registro da Observação (`saveQualitativeNote`):** Ao salvar a ocorrência, o sistema verifica a correspondência com a escola e profissional da observação ativa e insere o texto formatado (`[Tópico] Conteúdo`) diretamente no array `appState.currentObs.linkedNotes`.
- **Reatividade da Síntese Final (`renderSynthesisScreen`):** Atualização automática da visualização da tela de Síntese Final caso ela esteja ativa no momento do registro da ocorrência.
- **Atualização do Modal de Changelog e Header:** Registro da Versão 0.34 no histórico nativo e atualização do botão indicador no topo para `📋 Versão 0.34 (v7.13)`.

---

### [Versão 0.35] - Correção de Escopo de Visitas do Cronograma para Formadoras Pedagógicas
* **Data e Horário:** 08 de Outubro de 2026 — 17:10:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v35_correcao_cronograma.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v35_correcao_cronograma.html)
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Base / Insumos:** [`planos_de_implementacao/plano_correcao_cronograma.md`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_correcao_cronograma.md)
* **Contexto:** Corrigir a lógica de escopo de visitas do cronograma longitudinal para Formadoras Pedagógicas, garantindo que escolas de seu polo apareçam no cronograma mesmo que ainda não possuam coordenador cadastrado.

#### ⚙️ Inclusões, Modificações e Exclusões
- **Reestruturação do Escopo de Formadoras (`getScopedSchedules`):** A busca de escolas supervisionadas no cronograma foi alterada para relacionar diretamente as unidades pertencentes ao polo da formadora (`appState.units.filter(u => u.polo === user.school).map(u => u.name)`), além da própria escola/polo da formadora (`supervisedSchools.push(user.school)`).
- **Eliminação de Dependência Indireta de Coordenadores:** Removida a filtragem restritiva via `teamMembers` que dependia da existência prévia de um coordenador apontando para `m.supervisor === user.name`, evitando o desaparecimento de visitas recém-adicionadas.
- **Atualização do Modal de Changelog e Header:** Inclusão da entrada da Versão 0.35 no modal `#modalChangelog` e atualização do botão indicador no topo para `📋 Versão 0.35 (v7.14)`.

### [Versão 0.36] - Botão 'Definir Novo Padrão' em Rubricas e Padrão Customizado da Rede
* **Data e Horário:** 08 de Outubro de 2026 — 17:15:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v36_definir_novo_padrao_rubricas.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v36_definir_novo_padrao_rubricas.html)
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Base / Insumos:** [`planos_de_implementacao/plano_botao_definir_novo_padrao_rubricas.md`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_botao_definir_novo_padrao_rubricas.md)
* **Contexto:** Viabilizar governança autônoma e descentralizada da Matriz de Rubricas pela rede de ensino, permitindo definir as customizações atuais como o novo padrão permanente de restauração, sem necessidade de alterações no código-fonte.

#### ⚙️ Inclusões, Modificações e Exclusões
- **Novo Botão 'Definir Novo Padrão' (`screenRubricsAdmin`):** Adicionado botão na barra de ações da Matriz de Rubricas (ao lado de Exportar JSON e Restaurar Padrão), com verificação de segurança no modo de edição e confirmação via diálogo nativo (`confirm`).
- **Função `setCustomDefaultRubricsPrompt()`:** Clona o estado atual das matrizes de professores e coordenadores para `customDefaultTeacher` e `customDefaultCoordinator` no `appState`, salvando no `localStorage` via `saveState()` com feedback via `showToast`.
- **Restauração Dinâmica com Fallback (`restoreDefaultRubricsPrompt()`):** Ao restaurar, verifica se já existe padrão customizado salvo (`customDefaultTeacher` / `customDefaultCoordinator`); se presente, restaura para esse padrão da rede; caso contrário, realiza fallback para os descritores de fábrica (`DEFAULT_SECTIONS_TEACHER` / `DEFAULT_SECTIONS_COORDINATOR`).
- **Inicialização Resiliente (`loadState()`):** Carrega automaticamente as rubricas salvas ou o padrão customizado da rede caso as matrizes ativas ainda não tenham sido inicializadas.
- **Atualização do Modal de Changelog e Header:** Inclusão da entrada da Versão 0.36 no modal `#modalChangelog` e atualização do botão indicador no topo para `📋 Versão 0.36 (v7.15)`.
 
### [Versão 0.37] - Edição de Unidades Escolares / Polos, Gestão de Endereços e Propagação Relacional
* **Data e Horário:** 08 de Outubro de 2026 — 17:35:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v37_edicao_unidades_polos.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v37_edicao_unidades_polos.html)
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Base / Insumos:** [`planos_de_implementacao/plano_edicao_unidades_polos.md`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_edicao_unidades_polos.md)
* **Contexto:** Possibilitar a edição de dados das unidades escolares (nome, vinculação ao polo e endereço opcional) sem a necessidade de exclusão e recriação da unidade, mantendo a integridade relacional com os servidores e instrumentos previamente associados.

#### ⚙️ Inclusões, Modificações e Exclusões
- **Botão "Editar" na Tabela de UEs (`renderUnitsScreen`):** Adicionado botão de edição em cada linha da tabela de unidades escolares em Gestão Operacional -> UEs & Polos, permitindo acesso direto aos dados da unidade.
- **Modal Dedicado de Edição (`#modalEditUnit`):** Criação de formulário modal contendo campos de nome da unidade escolar, seletor de polo regional e endereço/localidade.
- **Tratamento de Endereço Opcional:** Padronização visual e funcional dos campos de endereço tanto no modal de cadastro (`#modalAddUnit`) quanto no modal de edição (`#modalEditUnit`), sinalizando explicitamente como opcional.
- **Propagação de Integridade Relacional (`saveEditUnit`):** Caso o nome da unidade escolar seja alterado, o sistema atualiza em cascata a lotação de servidores em `teamMembers`, `customUsers`, `USERS_DB`, registros formativos em `notes`, visitas no cronograma `schedules` e observações em `observations`.
- **Atualização do Modal de Changelog e Header:** Inclusão do registro da Versão 0.37 no modal `#modalChangelog` e atualização do botão indicador no cabeçalho superior para `📋 Versão 0.37 (v7.16)`.

---

### [Versão 0.38] - Enfileiramento Vertical de Rascunhos no Mobile (Nx1) & Eliminação de Scroll Lateral
* **Data e Horário:** 08 de Outubro de 2026 — 17:55:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v38_rascunhos_verticais_mobile.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v38_rascunhos_verticais_mobile.html)
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Base / Insumos:** [`planos_de_implementacao/plano_rascunhos_verticais_mobile.md`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_rascunhos_verticais_mobile.md)
* **Contexto:** Na visualização móvel da tela inicial, quando o avaliador possuía múltiplos rascunhos em andamento, os itens eram alinhados horizontalmente em 1xN devido à declaração flex sem orientação vertical explícita, gerando transbordo lateral e exigindo rolagem horizontal indesejada.

#### ⚙️ Inclusões, Modificações e Exclusões
- **Enfileiramento Vertical Estrito (`#homeDraftsContainer`):** Definição de `display: flex; flex-direction: column; gap: 12px; width: 100%;` no container de rascunhos da Home, assegurando a exibição vertical (Nx1).
- **Eliminação de Scroll Lateral:** Padronização de `width: 100%` e `box-sizing: border-box` nos cards `.draft-card`, contendo o layout rigorosamente dentro dos limites da tela móvel.
- **Responsividade Flexível nos Cards:** Inclusão de `flex-wrap: wrap` nos cards para ajuste adaptativo em viewports com largura inferior a 375px.
- **Atualização do Modal de Changelog e Header:** Inclusão da entrada da Versão 0.38 no modal `#modalChangelog` e atualização do botão indicador no topo para `📋 Versão 0.38 (v7.17)`.


---

### [Versão 0.39] - Arquivamento Individual e em Lote de Visitas Realizadas no Cronograma & Filtro de Status
* **Data e Horário:** 09 de Outubro de 2026 — 13:25:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v39_arquivar_visitas_cronograma.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v39_arquivar_visitas_cronograma.html)
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Base / Insumos:** [`planos_de_implementacao/plano_arquivar_visitas_cronograma.md`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_arquivar_visitas_cronograma.md)
* **Contexto:** Na tela do Cronograma de Acompanhamento Longitudinal (`#screenSchedule`), as visitas concluídas/realizadas (`status === 'realizado'`) permaneciam na listagem principal indefinidamente, poluindo a visualização e dificultando o acompanhamento das visitas pendentes e planejadas conforme o avanço do ano letivo.

#### ⚙️ Inclusões, Modificações e Exclusões
- **Estilização de Visita Arquivada (`.status-badge.archived`):** Definição de classe CSS própria para identificação visual clara de registros arquivados com fundo neutro e borda suave (`#F1F5F9` / `#64748B` / `#CBD5E1`).
- **Seletor de Filtro de Status (`#scheduleFilterStatus`):** Inclusão de seletor dinâmico ao lado do filtro de bimestres com opções "Visitas Ativas (Não arquivadas)" (padrão), "Visitas Arquivadas" e "Todas as Visitas".
- **Botão de Ação Rápida em Lote (`archiveAllCompletedSchedules`):** Adição de botão "📦 Arquivar Realizadas" no cabeçalho do cronograma para arquivar simultaneamente todas as visitas realizadas ativas no escopo atual com diálogo de confirmação.
- **Ações Individuais de Arquivar e Desarquivar (`archiveSchedule` / `unarchiveSchedule`):** Botões "📦 Arquivar" e "📥 Desarquivar" renderizados na coluna de ações para visitas realizadas ou já arquivadas, com reatividade imediata e persistência via `saveState()`.
- **Atualização do Modal de Changelog e Header:** Registro da Versão 0.39 no modal `#modalChangelog` e atualização do botão indicador no topo para `📋 Versão 0.39 (v7.18)`.

---

### [Versão 0.40] - Correção da Importação de Equipe, Parser Inteligente de CSV e Resolução de Hard Users
* **Data e Horário:** 09 de Outubro de 2026 — 14:15:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v40_correcao_importacao_equipe_hard_users.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v40_correcao_importacao_equipe_hard_users.html)
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Base / Insumos:** [`planos_de_implementacao/plano_correcao_importacao_equipe_hard_users.md`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_correcao_importacao_equipe_hard_users.md)
* **Contexto:** Ao importar planilhas de servidores (especialmente as geradas pela própria rotina de exportação do sistema), a leitura posicional ingênua de colunas e o desalinhamento de cabeçalhos faziam com que identificadores padrão (como `bruno`, `mariana`, `clarice`, `helena`, `rodrigo` e `usr-*`) fossem gravados no campo de nome em vez de seus nomes civis completos. Além disso, a função de download do modelo de importação não estava declarada.

#### ⚙️ Inclusões, Modificações e Exclusões
- **Mapeamento Canônico de Nomes (`KNOWN_USERS_MAP` & `resolveCanonicalUserName`):** Implementação de dicionário relacional e função de resolução automática de IDs/chaves canônicas de usuários padrão para seus nomes completos oficiais.
- **Higienização Transparente no `loadState()`:** Rotina de auto-cura na inicialização que percorre `appState.teamMembers` e higieniza qualquer registro persistido no `localStorage` cujos nomes ou supervisores estejam gravados como IDs.
- **Parser CSV Inteligente (`parseCsvLineCustom`):** Parser com suporte completo a aspas, múltiplos delimitadores (`,` e `;`) e vírgulas internas sem rompimento de campos.
- **Mapeamento Dinâmico de Colunas (`handleTeamCsvUpload`):** Detecção resiliente por inspeção de cabeçalho (`ID`, `Nome`, `Cargo`, `Unidade`, `Supervisor`, `Turma`, `Email`) case-insensitive e sem acentos, com fallbacks seguros.
- **Normalização de Cargos (`normalizeRoleData`):** Conversão dinâmica de nomenclaturas textuais de cargos para seus respectivos `roleKey` e `roleTitle`.
- **Implementação de `downloadTeamCsvTemplate()`:** Disponibilização da planilha modelo `modelo_servidores_sertao_crianca.csv` com cabeçalhos padronizados e linhas de exemplo.
- **Sincronização com `USERS_DB`:** Criação e atualização imediata dos registros de autenticação em `USERS_DB` e `appState.customUsers` ao importar membros.
- **Atualização do Modal de Changelog e Header:** Inclusão do registro da Versão 0.40 no modal `#modalChangelog` e atualização do botão indicador no topo para `📋 Versão 0.40 (v7.19)`.

---

### [Versão 0.41] - Auto-Arquivamento Temporal (4 Dias) & Arquivamento de Ocorrências e Observações
* **Data e Horário:** 09 de Outubro de 2026 — 14:40:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v41_auto_arquivamento_4_dias.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v41_auto_arquivamento_4_dias.html)
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Base / Insumos:** [`planos_de_implementacao/plano_auto_arquivamento_4_dias_observacoes_ocorrencias.md`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_auto_arquivamento_4_dias_observacoes_ocorrencias.md)
* **Contexto:** Automatização do ciclo de vida de registros pedagógicos para evitar acúmulo de dados passados na tela inicial, implementando a regra de auto-arquivamento após 4 dias e estendendo o fluxo de arquivamento/desarquivamento inaugurado na Versão 0.39 para Ocorrências de Campo e Histórico de Observações.

#### 🚀 Inclusões e Funcionalidades
- **Auto-Arquivamento Automático (Regra dos 4 Dias):** Criação da função `checkAndAutoArchive()`, que computa a idade de cada observação finalizada e de cada ocorrência de campo a partir de seu campo `date`. Registros com 4 ou mais dias são convertidos em `archived: true` de maneira transparente na inicialização e atualização de telas.
- **Arquivamento Manual de Ocorrências (`#screenNotes`):** Adição de botões individuais "📦 Arquivar" e "📥 Desarquivar" nos cards de registros formativos, além do botão de lote "📦 Arquivar Resolvidas" para limpeza ágil de pendências superadas.
- **Filtro de Status em Ocorrências:** Seletor com três modos de visualização: *Ocorrências Ativas (Não arquivadas)*, *Ocorrências Arquivadas* e *Todas as Ocorrências*.
- **Arquivamento no Histórico de Observações (`#screenHistory`):** Inclusão de seletor de status de arquivamento no painel de filtros e botões de ação direta nos cards de observações concluídas.
- **Reatividade dos Contadores:** O badge numérico da barra superior (`#navNotesCount`) e os cards da tela inicial (`#homeNotesCountText` e `#homeFinalizedCount`) passam a computar estritamente os itens ativos/não arquivados.

---

### [Versão 0.42] - Expansão Visual de Fotos Anexadas na Exportação para PDF
* **Data e Horário:** 09 de Outubro de 2026 — 14:50:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v42_ajuste_pdf_fotos.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v42_ajuste_pdf_fotos.html)
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Base / Insumos:** [`planos_de_implementacao/plano_ajuste_pdf_fotos.md`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_ajuste_pdf_fotos.md)
* **Contexto:** Na geração de PDF / impressão das observações, as fotos anexadas mantinham as dimensões de miniatura (`48x48px`), impedindo a visualização da evidência fotográfica no relatório impresso, além de exibir botões interativos desnecessários.

#### ⚙️ Inclusões, Modificações e Exclusões
- **Ajuste de Impressão de Evidências Fotográficas (`@media print`):** Regras CSS específicas para `.photo-thumb-wrapper` e `.photo-thumb-wrapper img` liberando as dimensões de thumbnail e limitando a altura máxima a 250px com `object-fit: contain` e quebra de página prevenida (`page-break-inside: avoid`).
- **Ocultação de Controles Operacionais no PDF:** Ocultação de `.btn-add-photo` e `.photo-del-btn` durante a impressão para assegurar aspecto limpo e institucional ao documento.
- **Atualização do Modal de Changelog e Header:** Inclusão do registro da Versão 0.42 no modal `#modalChangelog` e atualização do botão na barra superior para `📌 Versão 0.42 (v7.21)`.

---

### [Versão 0.43] - Exportação de Usuários com E-mails e Proteção Sanitizada de Senhas em JSON
* **Data e Horário:** 09 de Outubro de 2026 — 15:00:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v43_exportacao_usuarios_emails_protegidos.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v43_exportacao_usuarios_emails_protegidos.html)
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Base / Insumos:** [`planos_de_implementacao/plano_exportacao_usuarios_emails_protegidos.md`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_exportacao_usuarios_emails_protegidos.md)
* **Contexto:** A exportação de dados de usuários e backups, tanto via CSV quanto via JSON, não incluía os e-mails na planilha de servidores e expunha as senhas (`password`) de membros e usuários customizados nos arquivos JSON baixados.

#### 🚀 Inclusões e Funcionalidades
- **Inclusão da Coluna E-mail no CSV de Servidores (`exportTeamMembersCSV`):** Adição da 7ª coluna `"E-mail"` mapeando `m.email` para cada membro da equipe, facilitando auditoria e comunicação.
- **Sanitização Estrita de Credenciais na Exportação JSON (`exportTeamMembersJSON` e `exportFullBaseJSON`):**
  - Em `exportTeamMembersJSON`, mapeamento limpo de objetos sem a propriedade `password`.
  - Em `exportFullBaseJSON`, deep clone de `appState` com exclusão forçada do atributo `password` em todos os registros de `teamMembers` e `customUsers`.
- **Preservação e Resiliência de Senhas na Importação de Backup (`importFullBaseJSON`):** Lógica inteligente que, ao restaurar um backup sanitizado sem senhas, preserva as credenciais já existentes na memória local ou atribui senhas provisórias seguras com troca obrigatória (`mustChangePassword: true`) para novos usuários.
- **Atualização Visual de Versão:** Atualização do botão do cabeçalho para `📌 Versão 0.43 (v7.22)` e novo registro no topo do modal `#modalChangelog`.

---

*Documento consolidado conforme diretrizes do repositório SerTão Criança.*


---

### [Versão 0.44] - Impressão Consolidada do Formulário de Observação (Devolutiva Completa)
* **Data e Horário:** 09 de Outubro de 2026 — 15:00:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v44_print_completo_devolutiva.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v44_print_completo_devolutiva.html)
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Plano Executivo:** [`planos_de_implementacao/plano_print_completo_devolutiva.md`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_print_completo_devolutiva.md)
* **Contexto:** Solução para a exportação incompleta em PDF na Devolutiva, onde apenas a síntese era impressa. Agora, o relatório consolida todas as rubricas avaliadas na mesma visão formatada.

#### 🚀 Inclusões, Modificações e Exclusões
- **Container de Impressão Dedicado:** Injeção de `#synthesisRubricsPrintSection` na interface da síntese, mantido invisível na tela normal (`display: none`), mas ativado forçosamente durante a impressão (`@media print`).
- **Renderização Dinâmica do Espelho:** A função `renderSynthesisScreen` agora itera e constrói dinamicamente um resumo estruturado (Dimensões > Subdimensões > Critérios > Notas > Respostas) de toda a observação.
- **Formatação Resiliente para PDF:** Inclusão de `page-break-inside: avoid` na classe `.print-rubric-item` para garantir que as caixas de respostas não quebrem visualmente na transição entre duas páginas físicas impressas.
- **Atualização do Cabeçalho e Histórico:** Identificador do aplicativo elevado para `📋 Versão 0.44 (v6.17)` e incorporação do marco no modal de versões.

---

### [Versão 0.45] - Correção do Escopo de Unidades no Agendamento do Cronograma Longitudinal
* **Data e Horário:** 09 de Outubro de 2026 — 15:10:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v45_bugfix_agendamento_longitudinal.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v45_bugfix_agendamento_longitudinal.html)
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Plano Executivo:** [`planos_de_implementacao/plano_bugfix_agendamento_longitudinal.md`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_bugfix_agendamento_longitudinal.md)
* **Contexto:** Correção do problema onde formadores ao agendar visitas não viam a visita listada na tela devido ao dropdown exibir todas as escolas da rede, permitindo selecionar escolas fora do seu polo que ficavam invisíveis no escopo restrito de visualização.

#### 🚀 Inclusões, Modificações e Exclusões
- **Filtragem de Escolas por Polo (Modais de Adição e Edição):** Em `openAddScheduleModal` e `openEditScheduleModal`, o seletor `#scheduleSchool` agora restringe as opções para perfis `formador` apenas às escolas pertencentes ao polo do usuário (`u.polo === user.school`) e à unidade polo sede (`u.name === user.school`).
- **Alinhamento com `getScopedSchedules`:** Garante conformidade total entre as opções disponíveis para agendamento e as regras de escopo de visualização da formadora.
- **Atualização do Cabeçalho e Histórico:** Atualização da versão para `📌 Versão 0.45 (v7.24)` no cabeçalho e inclusão do detalhamento no modal interno `#modalChangelog`.

---

### [Versão 0.46] - Segmentação da Matriz no Painel de Indicadores & Bloqueio de Duplo Lançamento
* **Data e Horário:** 09 de Outubro de 2026 — 15:30:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v46_indicadores_duplo_lancamento.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v46_indicadores_duplo_lancamento.html)
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Plano Executivo:** [`planos_de_implementacao/plano_duplo_lancamento.md`](file:///c:/Users/Desklepes4/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_duplo_lancamento.md)
* **Contexto:** Correção do agregado de indicadores que se apresentava vazio ao avaliar coordenadores e prevenção de registros concorrentes ou redundantes para o mesmo profissional no mesmo bimestre.

#### 🚀 Inclusões
- **Seletor de Público-Alvo no Painel de Indicadores (`#indicatorsTargetTypeFilter`):** Inclusão de seletor no cabeçalho da tela de Diagnóstico & Indicadores (`screenIndicators`) com as opções *Indicadores de Professores* e *Indicadores de Coordenadores*, acionando `renderIndicatorsScreen()` de forma reativa.

#### 🔄 Modificações
- **Consolidação Estatística Parametrizada (`renderIndicatorsScreen`):**
  - Leitura do tipo selecionado no dropdown e filtragem estrita das observações concluídas pelo tipo avaliado (`o.evaluatedType === targetType`).
  - Carregamento estático das seções oficiais corretas (`activeSectionsCoordinator` ou `activeSectionsTeacher`), desacoplando da variável volátil `appState.currentObs`.
  - Mapeamento de `dimStats` e iteração principal baseados nas rubricas da matriz correta, restaurando o cálculo de consistência e a árvore de afunilamento para visitas de coordenadores pedagógicos.
- **Prevenção de Duplo Lançamento (`startNewObservation`):**
  - Implementação de trava de validação cruzando `teacherName` e `bimester` com as observações ativas (`o.status !== 'archived'`).
  - Emissão de alerta *Toast* bloqueador caso já exista uma observação (rascunho ou finalizada) em andamento para o profissional selecionado no bimestre.
- **Atualização do Cabeçalho e Histórico:** Atualização do badge de versão no cabeçalho para `📌 Versão 0.46 (v7.25)` e inserção do card detalhado no modal `#modalChangelog`.



---

### [Versão 0.47] - Validação e Trava de Consistência de Horário em Observações de Campo
* **Data e Horário:** 12 de Outubro de 2026 — 16:45:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v47_trava_horario.html`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v47_trava_horario.html)
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Contexto:** Garantir a consistência e integridade temporal no registro de observações em sala de aula, impedindo que observações sejam criadas com horários inválidos ou negativos.

#### 🚀 Inclusões e Validações
- **Trava de Consistência Temporal (`startNewObservation`):**
  - Implementação de validação explícita conferindo se a diferença de minutos entre o horário de início e o término resulta em valor menor ou igual a zero (`diffMinutes <= 0`).
  - Emissão de mensagem Toast de aviso: *"O horário de término não pode ser anterior ou igual ao horário de início."*, abortando a criação da observação caso inválido.
  - Eliminação de cálculo anômalo que somava 24 horas (`+ 24 * 60`) em registros de observação escolar diurna.
- **Atualização do Cabeçalho e Histórico:**
  - Atualização do botão no topo para `📌 Versão 0.47 (v7.26)`.
  - Inserção do marco detalhado no modal `#modalChangelog`.


---

### [Versão 0.48] - Trava Sequencial de Bimestres no Ciclo Longitudinal
* **Data e Horário:** 12 de Outubro de 2026 — 17:15:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v48_trava_sequencia_bimestres.html`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v48_trava_sequencia_bimestres.html)
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Plano Executivo:** [`planos_de_implementacao/plano_bloqueio_observacao_bimestre_anterior.md`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_bloqueio_observacao_bimestre_anterior.md)
* **Contexto:** Garantir o encadeamento rigoroso do ciclo de supervisão pedagógica longitudinal (1º ➔ 2º ➔ 3º ➔ 4º Bimestre), impedindo que um profissional seja avaliado em um bimestre sem ter sido previamente observado e finalizado no bimestre anterior.

#### 🚀 Inclusões e Validações
- **Validação Sequencial Obrigatória (`startNewObservation`):**
  - Implementada verificação em `startNewObservation()` que confere a existência de observação com status `'finalized'` no bimestre anterior (\(N-1\)) para o profissional selecionado.
- **Detecção de Rascunho no Bimestre Anterior:**
  - Caso o profissional possua apenas observação em rascunho (`status: 'draft'`) no bimestre anterior, a mensagem informa explicitamente que a observação prévia deve ser finalizada antes de iniciar o novo ciclo.
- **Sugestão Inteligente de Bimestre (`autoSelectNextEligibleBimester`):**
  - Ao selecionar um docente ou coordenador na tela `#screenSetup`, o sistema seleciona automaticamente o próximo bimestre elegível na trajetória do profissional.
- **Feedback Reativo na Interface (`#setupBimesterValidationHint`):**
  - Mensagem de orientação em tempo real no formulário indicando aptidão (verde) ou impedimento (vermelho) antes do acionamento do botão.

#### 🔄 Modificações
- Ajuste no seletor `#setupBimester` para disparar `updateSetupBimesterValidationUI()` no evento `onchange`.
- Atualização do indicador de versão no cabeçalho para `📌 Versão 0.48 (v7.27)` e inserção da versão no modal `#modalChangelog`.

#### ❌ Exclusões
- Nenhuma funcionalidade removida.

---

### [Versão 0.49] - Blindagem Estrita e Associação Segura de Ocorrências na Síntese Pedagógica
* **Data e Horário:** 12 de Outubro de 2026 — 17:25:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v49_blindagem_ocorrencias_sintese.html`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v49_blindagem_ocorrencias_sintese.html)
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Plano Executivo:** [`planos_de_implementacao/plano_blindagem_ocorrencias_sintese.md`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_blindagem_ocorrencias_sintese.md)
* **Contexto:** Eliminar a ocorrência de anotações genéricas, de terceiros ou de demonstração sendo importadas indevidamente para a Síntese Final de Visita, garantindo que o relatório pedagógico do docente observado contenha estritamente os fatos que lhe dizem respeito.

#### 🚀 Inclusões e Blindagens
- **Correspondência Mandatória Estrita na Importação (`importNotesIntoSynthesis`):**
  - Substituição do operador permissivo `||` por verificação estrita: a ocorrência deve pertencer obrigatoriamente tanto ao mesmo docente quanto à mesma unidade escolar avaliados (`n.teacherName === obs.teacherName && n.schoolName === obs.schoolName`).
- **Isolamento de Notas Amostrais (`isSample: true`):**
  - Anotações de demonstração cadastradas na inicialização (`INITIAL_NOTES`) foram marcadas com `isSample: true` e são desconsideradas pela rotina automática de importação, impedindo vazamento de dados de teste em visitas reais.
- **Rastreamento Determinístico por Visita (`obsId`):**
  - Ocorrências geradas a partir da barra superior durante a observação herdam o identificador exclusivo `obsId: obs.id`, garantindo rastreabilidade àquela visita específica.
- **Travamento Contextual e Badge Visual no Modal (`openQualitativeNoteModal`):**
  - Durante uma visita em andamento, o modal de ocorrência trava os campos de Unidade e Docente (`disabled = true`) e exibe o alerta contextual azul `#noteObsContextAlert`: *"🔒 Observação em andamento: Este registro será vinculado exclusivamente à visita de [Nome]..."*.
- **Feedback Transparente e Contagem de Importações:**
  - Caso não existam ocorrências para aquele profissional, o sistema emite notificação explicativa informando que ocorrências de outros docentes não foram importadas, eliminando a sensação de erro. Havendo registros válidos, informa o total de itens vinculados.

#### 🔄 Modificações
- Atualização do botão de versão no cabeçalho para `📌 Versão 0.49 (v7.28)`.
- Inserção do marco detalhado no topo do modal `#modalChangelog`.

#### ❌ Exclusões
- Nenhuma funcionalidade removida.

---

### [Versão 0.50] - Dinamização Reativa de Métricas, Cobertura e Tabela Longitudinal no Painel & Indicadores
* **Data e Horário:** 14 de Outubro de 2026 — 14:15:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v50_dinamizacao_metricas_avaliandos.html`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v50_dinamizacao_metricas_avaliandos.html)
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Plano Executivo:** [`planos_de_implementacao/plano_atualizacao_dinamica_metricas_avaliandos.md`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_atualizacao_dinamica_metricas_avaliandos.md)
* **Contexto:** Dinamização reativa de métricas, cobertura e tabela longitudinal no Painel & Indicadores por avaliando.

#### 🚀 Inclusões
- **Helper `getScopedAvaliandos(targetType)`:** Função central para resolução determinística dos avaliandos sob a supervisão do usuário ativo conforme o tipo (docentes da escola para Coordenadora, coordenadoras do polo para Formadora, rede inteira para Equipe Técnica).
- **Cartão de KPI de Cobertura:** Exibição no cabeçalho de Indicadores da proporção de avaliandos atendidos versus total vinculados (`X de Y avaliados · Z% de cobertura`).

#### 🔄 Modificações
- **Tabela de Acompanhamento Longitudinal:** Remoção completa dos registros estáticos ("Ana Carolina Silva" e "Carla Beatriz Mendes") e substituição por renderização dinâmica e reativa de todos os avaliandos do escopo, com cálculo dos 4 bimestres e evolução global.
- **Função `getScopedObservations()`:** Validação de pertinência ativa em `appState.teamMembers`, impedindo que docentes excluídos contaminem as métricas de consistência e auditoria.
- **Função `deleteTeamMember()`:** Exclusão em cascata de agendamentos pendentes e rascunhos vinculados ao membro deletado.
- **Função `openSetupScreen()`:** Preenchimento dinâmico de escolas no formulário da Formadora a partir de `appState.units`.
- **Cabeçalho e Modal Changelog:** Atualização do indicador de versão para `📌 Versão 0.50 (v7.29)` e inclusão do bloco no modal `#modalChangelog`.

#### ❌ Exclusões
- Remoção do retorno prematuro em tela vazia em `renderIndicatorsScreen()` quando não há observações finalizadas, mantendo a visualização dos avaliandos e seus agendamentos bimestrais.

---

### [Versão 0.51] - Higienização da Identidade Visual do Cabeçalho Institucional
* **Data e Horário:** 14 de Outubro de 2026 — 14:30:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v51_remocao_versao_cabecalho.html`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v51_remocao_versao_cabecalho.html)
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Plano Executivo:** [`planos_de_implementacao/plano_remocao_versao_cabecalho.md`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_remocao_versao_cabecalho.md)
* **Contexto:** Remoção da menção residual legada "· v4.0" no subtítulo da marca no cabeçalho superior, consolidando o controle oficial de versões no botão dinâmico de Changelog.

#### 🚀 Inclusões
- Padronização textual estrita da marca institucional no cabeçalho superior (`header.navbar .navbar-brand .brand-text`).

#### 🔄 Modificações
- Atualização do subtítulo de `Supervisão Pedagógica · v4.0` para `Supervisão Pedagógica`, eliminando inconsistência e confusão visual com a versão do sistema.
- Incremento da versão oficial do sistema no botão de topo para `📌 Versão 0.51 (v7.30)`.
- Registro histórico no modal `#modalChangelog` com destaque de versão ativa.

#### ❌ Exclusões
- Exclusão do sufixo estático residual `· v4.0` do elemento `span` da marca no cabeçalho.

---

### [Versão 0.52] - Inclusão de Logomarcas Oficiais no Cabeçalho e Rodapé Institucional Unificado
* **Data e Horário:** 14 de Outubro de 2026 — 15:30:00
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v52_inclusao_logos_institucionais.html`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v52_inclusao_logos_institucionais.html)
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Plano Executivo:** [`planos_de_implementacao/plano_inclusao_logos_institucionais.md`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_inclusao_logos_institucionais.md)
* **Contexto:** Incorporação da identidade visual gráfica oficial do Projeto SerTão Criança e consolidação da governança com a inclusão de rodapé institucional reunindo as 3 marcas parceiras (SerTão Criança, Prefeitura de Patos e LEPES).

#### 🚀 Inclusões
- **Logomarca Gráfica Oficial no Cabeçalho:** Substituição do placeholder com quadrado gradiente azul `SC` e título em texto pela logo oficial colorida com mascote e tipografia estilizada `logo_sertao_crianca.png`.
- **Rodapé Institucional Unificado (`.app-institutional-footer`):** Implementação de rodapé unificado ao final de todas as telas contendo as 3 logomarcas em fundo neutro e cartões elegantes com especificação de papéis institucionais (*Programa / Projeto*, *Realização* e *Parceria Técnica & Científica*).
- **Logomarca Oficial no Modal de Login:** Atualização da tela de login inicial (`#modalLoginScreen`), substituindo o quadrado CSS pela marca visual de alta resolução.
- **Blindagem Contra Impressão (`no-print`):** Isolamento total do novo rodapé contra quebras de página em relatórios, fichas e PDFs de devolutiva.
- **Responsividade Adaptativa:** Ajuste dinâmico de dimensões e transição de layout horizontal para empilhamento vertical limpo em dispositivos móveis (`max-width: 768px` e `max-width: 859px`).

#### 🔄 Modificações
- Atualização visual da barra de navegação superior (`.navbar-brand`), mantendo o comportamento interativo de retorno à tela inicial.
- Incremento da versão oficial do sistema no botão de topo para `📌 Versão 0.52 (v7.31)`.
- Registro histórico com destaque de versão ativa no modal `#modalChangelog`.

#### ❌ Exclusões
- Remoção do quadrado CSS placeholder `.brand-logo` do cabeçalho da navbar e do modal de login.
- Remoção do título `h1` em texto estático do cabeçalho, agora perfeitamente integrado à própria logomarca visual.

---

### [Versão 0.52] - Desvinculação e Isolamento Estrito de Unidades e Profissionais no Painel & Indicadores
* **Data e Horário:** 14 de Outubro de 2026 — 15:45:00
* **Arquivo Intermediário:** `intermediárias/aplicativo_v52_desvinculacao_unidade_indicadores.html`
* **Plano de Implementação:** `planos_de_implementacao/plano_desvinculacao_unidade_indicadores.md`
* **Contexto:** Correção de falha relacional onde a alteração da lotação escolar de profissionais mantinha resquícios da unidade anterior atribuídos na aba "Painel & Indicadores".

#### 🚀 Inclusões e Modificações
- **Sincronização Integral USERS_DB:** Resolução resiliente de chaves (`dbKey`) em `saveEditTeamMember()`, garantindo que edições na equipe sincronizem imediatamente a `school` e `supervisor` na sessão e autenticação.
- **Propagação Relacional na Troca de Unidade:** Desvinculação automática das docentes da escola anterior e vinculação das docentes da nova escola ao mover Coordenadoras Pedagógicas.
- **Isolamento Estrito em `getScopedAvaliandos()`:** Restrição categórica de escopo para Coordenadoras (`m.school === user.school`) e Formadoras (`poloUnits.includes(m.school)`).
- **Filtro de Unidade Escolar no Painel:** Dropdown `#indicatorsUnitFilter` permitindo visão consolidada ou segmentação individual por unidade escolar nos indicadores.
- **Rotina Auto-Cicatrizante em `loadState()`:** Saneamento automático no carregamento do estado local, restaurando a coerência relacional de registros pré-existentes.

---

### [Versão 0.53] - Bloqueio Rigoroso de Observação em Data Futura e Blindagem Cronológica
* **Data e Horário:** 14 de Outubro de 2026 — 15:45:00
* **Arquivo Intermediário:** `intermediárias/aplicativo_v53_bloqueio_data_futura_observacao.html`
* **Arquivo em Produção:** `firebase_deploy/public/index.html`
* **Plano de Implementação:** `planos_de_implementacao/plano_bloqueio_data_futura_observacao.md`
* **Contexto:** Imposição da regra de negócio R-OBS-DATA, impedindo o agendamento, início, salvamento de rascunho e finalização de observações pedagógicas com data posterior ao dia corrente.

#### 🚀 Inclusões
- **Bloqueio no Calendário Nativo (`#setupDate` e `#synthesisDate`):** Atributo `max` configurado dinamicamente com a data atual local (`getTodayDateString()`), impedindo a seleção de dias futuros no calendário nativo dos navegadores.
- **Feedback Visual Reativo (`validateSetupDateUI`):** Elemento `#setupDateValidationHint` exibido em tempo real com alerta vermelho caso o usuário tente digitar manualmente uma data futura.
- **Ajuste Inteligente a partir do Cronograma:** Ao acionar "Iniciar Visita →" em visitas com agendamento futuro no Cronograma Longitudinal, a data da observação efetiva é convertida automaticamente para a data de hoje, notificando o usuário via Toast.
- **Listener Reativo em Síntese (`onSynthesisTimeChange`):** Monitoramento de alterações na data da síntese final com auto-correção defensiva imediata.
- **Helper de Data Local (`getTodayDateString` e `formatDateBR`):** Cálculo seguro no fuso horário do dispositivo sem distorções de fuso horário UTC (zero deslocamento de dia).

#### 🔄 Modificações
- **Validação em `startNewObservation()`:** Interrupção sumária com Toast impeditivo caso a data informada seja futura.
- **Sanitização em `saveDraftAndExit()`:** Proteção contra gravação de rascunhos com datas futuras.
- **Bloqueio em `finalizeObservation()`:** Bloqueio mandatório com Toast na conclusão da observação caso a data efetiva seja futura.
- **Atualização de Versão:** Incremento da versão no botão superior para `📌 Versão 0.53 (v7.32)` e inclusão do registro no modal `#modalChangelog`.

---

### [Versão 0.54] - Bloqueio Rigoroso de Ocorrências para Docentes Não Avaliados
* **Data e Horário:** 14 de Outubro de 2026 — 16:00:00
* **Arquivo Intermediário:** `intermediárias/aplicativo_v54_bloqueio_ocorrencia_docente_nao_avaliado.html`
* **Arquivo em Produção:** `firebase_deploy/public/index.html`
* **Plano de Implementação:** `planos_de_implementacao/plano_bloqueio_ocorrencia_docente_nao_avaliado.md`
* **Contexto:** Eliminação definitiva da vulnerabilidade que permitia registrar ocorrências de campo avulsas para profissionais que ainda não passaram por observação pedagógica na rede.

#### 🚀 Inclusões e Blindagens
- **Filtragem Estrita de Docentes Avaliados em `onNoteSchoolChange()`:** O seletor `#noteTeacher` passa a cruzar os servidores da unidade escolar com a base de observações finalizadas (`status === 'finalized'`). Docentes não avaliados não aparecem no dropdown de ocorrências avulsas.
- **Feedback Visual e Desativação Segura:** Alerta `#noteNoEvaluatedAlert` e desabilitação automática do botão `btnSaveQualitativeNote` em unidades escolares que ainda não possuem observações pedagógicas concluídas.
- **Guardião Mandatório em `saveQualitativeNote()`:** Verificação impeditiva de integridade que bloqueia tentativas de submissão forçada ou dessincronizada de ocorrências para docentes não avaliados.
- **Badges de Rastreabilidade nos Cards (`renderNotesScreen`):** Identificação visual clara de ocorrências vinculadas à visita (`🔗 Vinculada à Visita`) e registros de docentes avaliados (`✓ Docente Avaliado(a)`).
- **Atualização de Versão:** Elevação do sistema para **Versão 0.54 (v7.33)** no cabeçalho e modal de changelog.

---

### [Versão 0.55] - Inclusão e Renderização de Fotos Anexadas na Exportação da Síntese (PDF) e Galeria de Evidências em Tela
* **Data e Horário:** 14 de Outubro de 2026 — 16:30:00
* **Arquivo Intermediário:** `intermediárias/aplicativo_v55_exportacao_fotos_sintese_pdf.html`
* **Arquivo em Produção:** `firebase_deploy/public/index.html`
* **Plano de Implementação:** `planos_de_implementacao/plano_exportacao_fotos_sintese_pdf.md`
* **Deploy Online:** [https://supervisao-st-crianca.web.app](https://supervisao-st-crianca.web.app)

#### 🚀 Inclusões e Funcionalidades
- **Renderização Fiel de Fotos no PDF da Síntese:** Inclusão dinâmica das fotos anexadas aos critérios pedagógicos no espelho de rubricas impresso (`#synthesisRubricsPrintSection`), posicionadas logo abaixo de suas respectivas respostas e observações, com quebra de página protegida (`page-break-inside: avoid`), bordas sutis e formatação responsiva (`max-height: 250px`, `max-width: 100%`).
- **Galeria Interativa de Evidências na Síntese (UI):** Inclusão da seção `#synthesisPhotosBlock` na tela de Síntese Final (`#screenSynthesis`), exibindo miniaturas de todas as evidências registradas com badge de identificação do critério (`Crit. X.X.X`), ampliação em alta resolução via `previewImage()` e botão de exclusão quando em modo de edição.
- **Suporte a Fotos Gerais da Visita:** Implementação de botão "+ Anexar Foto da Síntese / Geral" permitindo anexar evidências gerais da visita (`obs.photos['geral']`), renderizadas tanto na galeria em tela quanto em seção autônoma de impressão no PDF.
- **Resgate de Comentários Pontuais no PDF:** Correção na busca de anotações por critério para recuperar `obs.criterionComments[c.id]` além do fallback `obs.notes[c.id]`.
- **Desduplicação e Otimização do LocalStorage:** Remoção da gravação redundante na chave legada `SERTAO_CRIANCA_APP_STATE_V4` em `saveState()`, mantendo leitura fallback em `loadState()`, dobrando a cota de armazenamento local disponível para fotos em base64.
- **Atualização Protetiva na Exportação:** Chamada preventiva de `renderSynthesisScreen(true)` antes do disparo de `window.print()` em `exportSynthesisToPdf()`.
- **Atualização de Versão:** Atualização para **Versão 0.55** no cabeçalho e modal de changelog.

---

### [Versão 0.56] - Correção do Mapeamento de Respostas no PDF da Avaliação & Identificação Oficial
* **Data e Horário:** 14 de Outubro de 2026 — 17:00:00
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v56_correcao_exportacao_respostas_avaliacao_pdf.html`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v56_correcao_exportacao_respostas_avaliacao_pdf.html)
* **Base / Insumos:** Solicitação direta de usuário e diretrizes de governança do [`WORKFLOW_MACOS.md`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md).
* **Identificador no App:** `📌 Versão 0.56 (v7.35)`
* **Hosting Oficial:** [https://supervisao-st-crianca.web.app](https://supervisao-st-crianca.web.app)
* **Contexto:** Correção de falha no renderizador de impressão da síntese pedagógica onde respostas assinaladas como "Consistente", "Parcial" ou "Não Realizado" eram transcritas como "Sem resposta" no espelho de rubricas impresso.

#### 🚀 Inclusões e Funcionalidades
- **Mapeamento Exato da Escala de Avaliação:** Inclusão das chaves nativas `consistent`, `partial`, `not_done` e `na` na rotina de montagem do container `#synthesisRubricsPrintSection`.
- **Distinção Textual Docente vs Coordenador:** Rótulos diferenciados no relatório impresso ("Sim / Consistente" vs "Consistente" e "Não / Não Realizado" vs "Não Realizado").
- **Badges Cromáticos de Resposta:** Formatação das respostas com fundos suaves e bordas correspondentes à severidade pedagógica da escala.
- **Identificação Oficial no Topo da Área Impressa:** Inclusão de cabeçalho estruturado `#synthesisReportMetaBox` com dados completos do profissional e da visita.
- **Blindagem de Cores na Impressão:** Aplicação da regra `print-color-adjust: exact` em `@media print`.

---

### [Versão 0.57] - Extração Longitudinal Individual de Professores no Painel & Indicadores
* **Data e Horário:** 14 de Outubro de 2026 — 17:30:00
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v57_extracao_longitudinal_professor.html`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v57_extracao_longitudinal_professor.html)
* **Base / Insumos:** Solicitação direta de usuário e governança do [`WORKFLOW_MACOS.md`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md).
* **Identificador no App:** `📌 Versão 0.57 (v7.36)`
* **Hosting Oficial:** [https://supervisao-st-crianca.web.app](https://supervisao-st-crianca.web.app)
* **Contexto:** Habilitação de análise longitudinal aprofundada para supervisores pedagógicos, permitindo selecionar qualquer professor da rede e analisar a evolução de cada item da matriz de rubricas ao longo dos 4 bimestres, com extração de fichas individuais em PDF e planilhas em CSV.

#### 🚀 Inclusões e Funcionalidades
- **Seletor de Avaliando no Painel (`#indicatorsMemberFilter`):** Inclusão de dropdown contextual no cabeçalho de *Painel & Indicadores*, permitindo selecionar qualquer docente do escopo ou alternar para a visão agregada.
- **Botão "Raio-X Item a Item" na Tabela Geral:** Inserção de coluna de ação na tabela longitudinal de avaliandos, permitindo saltar diretamente para a análise minuciosa de qualquer professor.
- **Matriz Comparativa Longitudinal Item a Item:** Estruturação analítica completa por Dimensão e Subdimensão das rubricas, exibindo os status de avaliação do 1º ao 4º Bimestre lado a lado com data da visita e cálculo de variação pedagógica (Progrediu, Consolidado, Estável em Parcial, Fragilização/Alerta).
- **Ressignificação das Anotações da Supervisão:** Exibição contextual das anotações qualitativas de critérios (`criterionComments`) logo abaixo de cada item, associadas ao respectivo bimestre.
- **Exportação da Ficha Longitudinal Individual (PDF):** Geração de documento de impressão formal com cabeçalho de Patos / SerTão Criança, metadados cadastrais, tabela completa item a item e bloco formal de assinaturas.
- **Exportação de Dados em CSV:** Download de planilha delimitada por ponto-e-vírgula com UTF-8 BOM contendo todo o histórico avaliativo do profissional.
- **Atualização de Versão:** Elevação oficial para **Versão 0.57 (v7.36)**.

---

### [Versão 0.57] - Bloqueio de Filtro por Indicadores de Coordenadores para o Perfil Coordenador
* **Data e Horário:** 14 de Outubro de 2026 — 17:45:00
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v57_bloqueio_filtro_indicadores_coordenador.html`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v57_bloqueio_filtro_indicadores_coordenador.html)
* **Base / Insumos:** Solicitação direta de governança e segregação de acessos / Workflow macOS ([`WORKFLOW_MACOS.md`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md)).
* **Identificador no App:** `📌 Versão 0.57 (v7.36)`
* **Hosting Oficial:** [https://supervisao-st-crianca.web.app](https://supervisao-st-crianca.web.app)
* **Contexto:** Governança e segregação de privilégios de acesso: coordenadoras pedagógicas avaliam estritamente professoras de sua própria unidade escolar e não devem visualizar a matriz de rubricas ou indicadores de coordenação pedagógica.

#### 🚀 Inclusões e Funcionalidades
- **Badge de Contexto de Indicadores (`#indicatorsTargetTypeBadge`):** Componente visual fixo posicionado no cabeçalho do Painel & Indicadores (`👩‍🏫 Indicadores Docentes`), exibido exclusivamente para usuárias sem privilégio de alternância de público-alvo (Coordenadoras e Professoras).

#### 🛠️ Modificações
- **Ocultação Condicional do Seletor `#indicatorsTargetTypeFilter`:** Remoção visual e desativação do seletor para Coordenadoras Pedagógicas (`roleKey === 'coordenador'`) e Docentes (`roleKey === 'professora'`).
- **Blindagem Lógica em `renderIndicatorsScreen()`:** Imposição estrita no JavaScript de `targetType = 'professora'` para perfis de coordenação e docência, bloqueando a renderização indevida da matriz de coordenadores.
- **Proteção em `getScopedAvaliandos()`:** Imposição determinística de retorno exclusivo de professoras da unidade para o papel de coordenadora.
- **Defesa Adicional em `filterHistory()` / `renderHistoryScreen()`:** Trava mandatória de `roleFilter = 'professora'` para coordenadoras ao consultar observações.
- **Atualização de Versão:** Elevação oficial da versão para `0.57` no header da aplicação, no modal interno e no sumário executivo.

#### ❌ Exclusões
- Exclusão da capacidade de Coordenadoras Pedagógicas visualizarem ou filtrarem indicadores da matriz de Coordenadores Pedagógicos.

---

### [Versão 0.58] - Gestão Autônoma de Rubricas & Upload de Novas Matrizes em PDF (SSOT, .csv, .json e Modo de Edição Travado)
* **Data e Horário:** 14 de Outubro de 2026 — 18:00:00
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v58_gestao_autonoma_rubricas_upload_pdf.html`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v58_gestao_autonoma_rubricas_upload_pdf.html)
* **Plano de Implementação:** [`planos_de_implementacao/plano_gestao_autonoma_rubricas_upload_pdf.md`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_gestao_autonoma_rubricas_upload_pdf.md)
* **Base / Insumos:** Solicitação direta de autonomia municipal plena e descentralização / Workflow macOS ([`WORKFLOW_MACOS.md`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md)).
* **Identificador no App:** `📌 Versão 0.58 (v7.37)`
* **Hosting Oficial:** [https://supervisao-st-crianca.web.app](https://supervisao-st-crianca.web.app)
* **Contexto:** Entrega de autonomia total e perene à Secretaria Municipal de Educação de Patos para gerir, reestruturar, criar ou excluir dimensões e critérios avaliativos na matriz pedagógica, definir novos padrões oficiais com download de backups em JSON e CSV, e realizar upload de novos PDFs oficiais armazenados localmente via IndexedDB sem qualquer necessidade de suporte técnico ou manutenção de código.

#### 🚀 Inclusões e Funcionalidades
- **Modo de Edição Travado e Seguro (`window.isRubricsEditMode`):** A aba de Rubricas inicia protegida com travas em todos os textareas e ocultação de controles de exclusão e criação. A chave superior permite desbloquear a governança estrutural, exibindo alertas visuais contrastantes (*🔒 Modo de Leitura Seguro* vs *⚠️ Modo de Edição Ativo*).
- **CRUD Completo de Dimensões (`promptAddDimension`, `promptEditDimensionTitle`, `confirmDeleteDimension`):** Criação autônoma de novas dimensões pedagógicas municipais com subdimensão inicial e critério, renomeação direta de títulos e exclusão com diálogo confirmatório de segurança.
- **CRUD Completo de Subdimensões e Critérios (`promptAddSubSection`, `promptAddCriterion`, `confirmDeleteCriterion`):** Adição de agrupamentos lógicos e inclusão de itens com cálculo e sugestão automática de IDs sequenciais harmônicos, além de exclusão granular.
- **Definição de Novo Padrão Municipal Oficial (`setCustomDefaultRubricsPrompt`):** Permite salvar a matriz ativa como padrão oficial da rede no SSOT (`customDefaultTeacher` / `customDefaultCoordinator`) e dispara imediatamente o download de pacotes de backup físico em `.json` e `.csv` (`sertao_crianca_rubricas_novo_padrao`).
- **Restauração Inteligente em 2 Níveis (`restoreDefaultRubricsPrompt`):** Opções explícitas de restauração entre o Padrão Municipal Definido e a Matriz de Fábrica Original do SerTão Criança / LEPES.
- **Importação Direta de Matrizes JSON (`importRubricsJSON`):** Upload e incorporação instantânea de matrizes estruturadas via arquivo `.json` com validação de esquema.
- **Armazenamento Persistente de PDFs em IndexedDB (`PDFStorage`):** Banco local `SertaoCriancaDocsDB` com store `customPdfs` permitindo aos gestores municipais enviar novos arquivos PDF das matrizes de professores e coordenadores sem limitações de cota do localStorage.
- **Gestão Autônoma de Documentos Oficiais em PDF no Modal `#modalRefDocs`:** Badges informativos de versão personalizada (`🟢 Atualizado pelo Município`), visualização em nova aba via Blob URL, download do PDF atualizado e botão de restauração para o documento de fábrica.

#### 🛠️ Modificações
- **Refatoração do Módulo de Rubricas da Gestão Técnica:** `renderRubricsAdminScreen()` ampliado para renderizar toda a governança contextual e ações CRUD de acordo com a trava de edição ativa.
- **Sincronização Imediata com o SSOT:** Toda alteração estrutural grava instantaneamente no `appState` e `localStorage`, refletindo de imediato nas telas de observação, sínteses, relatórios de impressão e painéis de indicadores.
- **Aprimoramento de Exportações:** Exportações CSV e JSON formatadas com suporte a nomes de arquivo customizados e codificação UTF-8 BOM.
- **Atualização da Identificação de Versão:** Elevação oficial para `📌 Versão 0.58 (v7.37)` no cabeçalho e modal de changelog.

#### ❌ Exclusões
- Eliminação da dependência de desenvolvedores para qualquer modificação na matriz de critérios ou substituição dos PDFs oficiais de referência da rede municipal de Patos.

---

### [Versão 0.71] - Destaque e Aproveitamento Integral do Card de Evolução de Consistência
* **Data e Horário:** 15 de Outubro de 2026 — 13:55:00
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v71_destaque_evolucao_consistencia.html`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v71_destaque_evolucao_consistencia.html)
* **Base / Insumos:** Solicitação direta do usuário para o Painel de Visualização Individual / Dossiê Pedagógico.
* **Identificador no App:** `📌 Versão 0.71 (v7.50)`
* **Hosting Oficial:** [https://supervisao-st-crianca.web.app](https://supervisao-st-crianca.web.app)
* **Contexto:** No painel de visualização longitudinal do profissional (docente ou coordenador), o card de "Evolução de Consistência" ocupava apenas uma linha central estreita com setas e texto secundário, deixando áreas vazias no bloco. A reformulação aproveita 100% da área do card, dividindo-a em 4 partes bem distribuídas (uma para cada bimestre) apenas com os números em alto contraste e destaque.

#### 🚀 Inclusões e Funcionalidades
- **Distribuição Uniforme em 4 Quadrantes Bimestrais:** Grade responsiva (`grid-template-columns: repeat(4, 1fr)`) que utiliza 100% da altura e largura interna do card, alinhando-se à altura dos demais KPIs da linha.
- **Destaque Tipográfico e Cromático dos Índices:** Cada quadrante exibe o número ordinal do bimestre (`1º`, `2º`, `3º`, `4º`) e o percentual de consistência em tamanho de destaque (`clamp(17px, 1.8vw, 24px)` e `font-weight: 800`), com cores contextuais (verde para ≥ 80%, amarelo para ≥ 60%, vermelho para < 60% e cinza neutro para pendente/sem registro).
- **Backgrounds e Bordas Sutis Tematizadas:** Cada caixa bimestral possui contraste e preenchimento suave de acordo com a consistência pedagógica apurada na observação daquele bimestre.

#### 🛠️ Modificações
- **Eliminação de Elementos Secundários:** Remoção de setas horizontais intermediárias (`→`) e da legenda inferior ("Histórico do 1º ao 4º Bimestre"), permitindo que todo o espaço útil seja dedicado exclusivamente aos números.
- **Atualização da Identificação de Versão:** Elevação oficial para `📌 Versão 0.71 (v7.50)` no cabeçalho, modal de histórico e changelog.

---

### [Versão 0.72] - Padronização Direta dos Nomes de Dimensões e Subdimensões (Sem Rótulos Repetitivos)
* **Data e Horário:** 15 de Outubro de 2026 — 14:15:00
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v72_remocao_titulos_dimensao_subdimensao.html`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v72_remocao_titulos_dimensao_subdimensao.html)
* **Base / Insumos:** Solicitação direta do usuário para limpeza e padronização dos títulos estruturais em todos os painéis.
* **Identificador no App:** `📌 Versão 0.72 (v7.51)`
* **Hosting Oficial:** [https://supervisao-st-crianca.web.app](https://supervisao-st-crianca.web.app)
* **Contexto:** Eliminação dos rótulos repetitivos e redundantes "Dimensão" e "Subdimensão", padronizando a exibição direta com a numeração e o nome correspondente em todos os painéis para todos os perfis de usuários (ex: `2. Gestão do Grupo` e `2.1 Tempo e Rotina`).

#### 🚀 Inclusões e Funcionalidades
- **Nomenclatura Direta e Minimalista:**
  - Nível 1 (Dimensões): Substituição de `Dimensão X: Nome` por `X. Nome` (ex: `1. Estratégias Didáticas`, `2. Gestão do Grupo`).
  - Nível 2 (Subdimensões): Substituição de `Subdimensão X.Y: Nome` por `X.Y Nome` (ex: `1.1 Ampliação de Repertório`, `2.1 Tempo e Rotina`).
- **Abrangência Completa de Telas e Perfis:**
  - **Painel & Indicadores (Visão Geral Panorâmica):** Cabeçalhos do acordeão em cascata.
  - **Painel & Indicadores (Dossiê Longitudinal Individual):** Cabeçalhos de dimensões e subdimensões na matriz analítica.
  - **Tela de Observação em Campo (Registro Ativo):** Cabeçalho superior da dimensão e botões de acordeão das subseções.
  - **Resumo da Devolutiva e Síntese de Avaliação:** Cabeçalhos de dimensão e subdimensão injetados no resumo pedagógico.
  - **Ficha de Acompanhamento Longitudinal Individual (PDF):** Cabeçalhos e faixas de agrupamento na impressão oficial.
  - **Gestão da Matriz de Rubricas:** Títulos dos cards e subcabeçalhos de governança estrutural.

#### 🛠️ Modificações
- **Higienização Defensiva de Strings:** Limpeza automática de prefixos residuais via regex em `localStorage` ou dados legados, garantindo que mesmo matrizes importadas ou customizadas sejam exibidas de forma perfeitamente limpa.
- **Atualização da Identificação de Versão:** Elevação oficial para `📌 Versão 0.72 (v7.51)` no cabeçalho, modal de histórico e changelog.

---

### [Versão 0.74] - Redesenho Estruturado e Destacado do Card de Escala de Materiais
* **Data e Horário:** 15 de Outubro de 2026 — 14:25:00
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v74_redesenho_escala_materiais.html`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v74_redesenho_escala_materiais.html)
* **Base / Insumos:** Solicitação direta do usuário para melhoria estética, organização e destaque do nível no bloco de Escala de Materiais.
* **Identificador no App:** `📌 Versão 0.74 (v7.53)`
* **Hosting Oficial:** [https://supervisao-st-crianca.web.app](https://supervisao-st-crianca.web.app)
* **Contexto:** No painel de visualização pedagógica, o bloco da "Escala de Materiais" apresentava formatação assimétrica com borda amarela conflitante, textos comprimidos que quebravam de forma desordenada e falta de hierarquia visual clara. A reestruturação destaca com força o nível obtido e traz equilíbrio estético e funcional alinhado aos demais cards de KPIs.

#### 🚀 Inclusões e Funcionalidades
- **Destaque do Nível com Escala Relativa:** Exibição do nível pedagógico em tipografia ampla (`28px`, `font-weight: 800`) ao lado da menção clara `"de 4"`, acompanhado de pill tag cromática contextualizada no topo direito (`Uso Rico e Autônomo`, `Materiais Diversificados`, `Folhas Estruturadas`, `Folhas Pré-prontas`).
- **Régua Visual Segmentada (Progresso em 4 Barras):** Barra de 4 segmentos que acende conforme o nível apurado na observação, oferecendo leitura instantânea do estágio de desenvolvimento pedagógico.
- **Tipografia e Diagramação Organizada:** Texto descritivo alinhado com clamp de 2 linhas e tooltip completo com a definição pedagógica do nível.
- **Rodapé Padronizado:** Linha divisória sutil com o bimestre da última visita à esquerda e a data formatada à direita.

#### 🛠️ Modificações
- **Eliminação de Bordas Assimétricas e Caixas Sobrepostas:** Remoção da borda lateral laranja rígida de 4px, integrando o card perfeitamente ao grid responsivo de KPIs.
- **Atualização da Identificação de Versão:** Elevação oficial para `📌 Versão 0.74 (v7.53)` no cabeçalho, modal de histórico e changelog.

---

### [Versão 0.75] - Correção Crítica de Escopo na Renderização da Aba Agenda
* **Data e Horário:** 15 de Outubro de 2026 — 14:45:00
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///c:/Users/Diogo/Documents/gestor%20supervisao_patos/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v75_correcao_aba_agenda.html`](file:///c:/Users/Diogo/Documents/gestor%20supervisao_patos/gestor%20supervisao_patos/intermediárias/aplicativo_v75_correcao_aba_agenda.html)
* **Base / Insumos:** Solicitação direta do usuário reportando tela branca ao acessar a aba Agenda.
* **Identificador no App:** `📌 Versão 0.75 (v7.54)`
* **Hosting Oficial:** [https://supervisao-st-crianca.web.app](https://supervisao-st-crianca.web.app)
* **Contexto:** Correção de exceção `ReferenceError: user is not defined` dentro de `renderScheduleScreen()` decorrente de regras de autorização de visita introduzidas na v0.73.

#### 🐛 Correções e Ajustes
- **Declaração de Escopo do Usuário Ativo:** Inclusão de `const user = getCurrentUser();` na primeira linha da função `renderScheduleScreen()`.
- **Restauração da Navegação da Agenda:** A tela `#screenSchedule` agora recebe normalmente a classe `.active` e renderiza tabelas e cards em qualquer resolução sem erros.
- **Atualização da Identificação de Versão:** Elevação oficial para `📌 Versão 0.75 (v7.54)` no cabeçalho, modal de histórico e changelog.

---

### [Versão 0.77] - Restrição Estrita da Agenda de Formadores a Coordenadoras e Preservação da Seção Agenda na Home
* **Data e Horário:** 15 de Outubro de 2026 — 15:05:00
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///c:/Users/Diogo/Documents/gestor%20supervisao_patos/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v77_restricao_agenda_formador_preservacao_home.html`](file:///c:/Users/Diogo/Documents/gestor%20supervisao_patos/gestor%20supervisao_patos/intermediárias/aplicativo_v77_restricao_agenda_formador_preservacao_home.html)
* **Base / Insumos:** Solicitação direta do usuário reportando listagem indevida de professoras na agenda da formadora e desaparecimento da seção agenda na aba Início.
* **Identificador no App:** `📌 Versão 0.77 (v7.56)`
* **Hosting Oficial:** [https://supervisao-st-crianca.web.app](https://supervisao-st-crianca.web.app)
* **Contexto:** Garantir que formadoras nunca tenham professoras em sua agenda ou fluxo observacional (mantendo acesso exclusivo às métricas docentes no painel de indicadores), além de manter a seção de visitas agendadas sempre visível na tela inicial com estado vazio elegante.

#### 🚀 Inclusões e Funcionalidades
- **Preservação Contínua da Agenda na Aba Início:** A seção `#homeScheduledSection` agora permanece sempre ativa e renderizada para Coordenação e Formadoras. Caso não haja visitas agendadas pendentes imediatas, exibe um card acolhedor de estado vazio com botão de atalho `+ Agendar Nova Visita`.

#### 🛠️ Modificações e Governança
- **Exclusão Definitiva de Professoras da Agenda da Formadora:** Refinamento da função `getScopedSchedules()` para filtrar estritamente alvos com cargo de Coordenadora Pedagógica quando o usuário for Formador. Nenhuma professora é exibida na tabela ou cards da agenda.
- **Segregação Estrita da Coordenação:** A Coordenadora lista estritamente professoras da sua unidade em sua agenda.
- **Resolução Canônica de Nomes:** Aprimoramento de `getActionablePendingSchedules()` para matching resiliente contra `resolveCanonicalUserName()`.
- **Atualização da Identificação de Versão:** Elevação oficial para `📌 Versão 0.77 (v7.56)` no cabeçalho, modal de histórico e changelog.

---

### [Versão 0.78] - Sub-abas no Painel de Indicadores e Público-Alvo Padrão da Formadora Pedagógica
* **Data e Horário:** 15 de Outubro de 2026 — 15:30:00
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///c:/Users/Diogo/Documents/gestor%20supervisao_patos/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v78_subabas_painel_indicadores.html`](file:///c:/Users/Diogo/Documents/gestor%20supervisao_patos/gestor%20supervisao_patos/intermediárias/aplicativo_v78_subabas_painel_indicadores.html)
* **Base / Insumos:** Solicitação direta do usuário para reorganização do painel (eliminando rolagem vertical extensa por meio de navegação segmentada) e ajuste do público-alvo inicial da formadora pedagógica para coordenadores(as).
* **Identificador no App:** `📌 Versão 0.78 (v7.57)`
* **Hosting Oficial:** [https://supervisao-st-crianca.web.app](https://supervisao-st-crianca.web.app)
* **Contexto:** Melhoria ergonômica de navegação no painel de indicadores (`#screenIndicators`), organizando os blocos em sub-abas/pílulas de toque rápido no mobile e desktop, associada ao alinhamento do público-alvo default de formadoras para o perfil de coordenação pedagógica.

#### 🚀 Inclusões e Funcionalidades
- **Navegação Segmentada no Painel (Sub-abas / Pílulas):** Introdução da barra `.indicators-subtabs-nav` com 3 pílulas touch-friendly logo abaixo dos filtros (`[ 📊 Índices Gerais & KPIs ]`, `[ 🔍 Afunilamento por Dimensão ]` e `[ 📈 Acompanhamento Longitudinal ]`). Cada clique exibe exclusivamente o bloco de interesse na tela (`display: block / none`), eliminando a necessidade de rolagem vertical prolongada tanto no celular quanto no computador.
- **Rótulos Dinâmicos e Transição Integrada no Dossiê Individual:** Ao analisar um docente ou coordenador específico, as pílulas adaptam seus títulos contextualmente (`[ 📊 Dossiê & KPIs ]`, `[ 🔍 Raio-X Item a Item ]` e `[ 📈 Acompanhamento Geral ]`), permitindo transição instantânea e retorno à listagem ampla sem perda de contexto.
- **Atalho Direto para o Raio-X:** O botão `📊 Raio-X Item a Item` nas linhas e cards do acompanhamento longitudinal agora ativa diretamente a sub-aba de afunilamento/raio-x, levando o usuário diretamente à análise detalhada dos critérios.

#### 🛠️ Modificações e Governança
- **Público-Alvo Inicial Padrão para Formadoras:** Configuração de inicialização automática de `#indicatorsTargetTypeFilter` para `coordenador` (`👤 Coordenadores(as)`) para usuárias com papel Formadora Pedagógica, preservando a faculdade de alternar livremente para `professora` a qualquer momento.
- **Preservação Integral de Impressão e Relatório PDF:** As regras de `@media print` garantem que os 3 blocos analíticos permaneçam visíveis (`display: block !important`) durante a geração de PDF, enquanto as pílulas de navegação são ocultadas.
- **Atualização da Identificação de Versão:** Elevação oficial para `📌 Versão 0.78 (v7.57)` no cabeçalho, modal de histórico e changelog.

---

### [Versão 0.79] - Abas com Ícones no Painel de Indicadores (Ergonomia Mobile 100% Visível)
* **Data e Horário:** 15 de Outubro de 2026 — 15:45:00
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///c:/Users/Diogo/Documents/gestor%20supervisao_patos/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v79_abas_icones_painel_indicadores.html`](file:///c:/Users/Diogo/Documents/gestor%20supervisao_patos/gestor%20supervisao_patos/intermediárias/aplicativo_v79_abas_icones_painel_indicadores.html)
* **Base / Insumos:** Solicitação direta do usuário reportando atrito na navegação móvel (necessidade de arrastar lateralmente para alcançar as pílulas de texto) e solicitando seletor em 3 abas intuitivas com ícones.
* **Identificador no App:** `📌 Versão 0.79 (v7.58)`
* **Hosting Oficial:** [https://supervisao-st-crianca.web.app](https://supervisao-st-crianca.web.app)
* **Contexto:** Aperfeiçoamento da ergonomia e usabilidade móvel no painel de indicadores (`#screenIndicators`), eliminando a necessidade de rolagem horizontal através de um controle segmentado de 3 colunas simétricas focado em ícones táteis destacados.

#### 🚀 Inclusões e Funcionalidades
- **Grade Segmentada 100% Visível no Celular:** Reestruturação da barra de sub-abas (`.indicators-subtabs-nav`) com CSS Grid (`repeat(3, 1fr)`), assegurando que todas as 3 opções caibam simultaneamente na largura do display do smartphone sem qualquer necessidade de deslizar a tela.
- **Foco na Intuição Visual por Ícones:** As abas priorizam ícones visuais amplos (`📊` Índices & KPIs, `🔍` Afunilamento e `📈` Acompanhamento Longitudinal) com tamanho de 24px no mobile, ocultando rótulos textuais longos em telas menores para um layout limpo, moderno e direto.
- **Transição Tátil Instantânea:** Seletores com área de toque de 48px de altura, feedback visual com borda e sombra suaves no item ativo e alternância imediata entre os blocos sem refetch de dados.

#### 🛠️ Modificações e Governança
- **Harmonia Multiplataforma:** No desktop, ícones e títulos convivem de forma compacta e elegante, preservando acessibilidade (`aria-label` e `title`).
- **Preservação de Impressão:** Regras de impressão mantêm os 3 blocos visíveis e ocultam o seletor segmentado.
- **Atualização da Identificação de Versão:** Elevação oficial para `📌 Versão 0.79 (v7.58)` no cabeçalho, modal de histórico e changelog.

---

### [Versão 0.80] - Exclusão Efetiva de Rascunho ao Sair sem Salvar
* **Data e Horário:** 15 de Outubro de 2026 - 16:05:00
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///c:/Users/Diogo/Documents/gestor%20supervisao_patos/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v80_apagar_rascunho_ao_sair_sem_salvar.html`](file:///c:/Users/Diogo/Documents/gestor%20supervisao_patos/gestor%20supervisao_patos/intermediárias/aplicativo_v80_apagar_rascunho_ao_sair_sem_salvar.html)
* **Base / Insumos:** Solicitação direta do usuário apontando que rascunhos continuavam aparecendo na Home mesmo após selecionar a opção 'Sair sem Salvar'.
* **Identificador no App:** `📌 Versão 0.80 (v7.59)`
* **Hosting Oficial:** [https://supervisao-st-crianca.web.app](https://supervisao-st-crianca.web.app)
* **Contexto:** Correção de coerência e integridade de estado na saída da sessão de avaliação. Ao clicar em 'Sair sem Salvar', a observação em rascunho é expurgada de `appState.observations` e do `localStorage`, não poluindo a tela inicial nem exigindo exclusão manual posterior.

#### 🚀 Inclusões e Funcionalidades
- **Confirmação Contextualizada de Descarte:** O diálogo de confirmação ao clicar em "Sair sem Salvar" adverte explicitamente que o rascunho será descartado e não ficará salvo na tela inicial.
- **Feedback Imediato ao Usuário:** Emissão de notificação toast informativa (`showToast('Rascunho descartado com sucesso.')`) garantindo clareza e previsibilidade sobre a ação tomada.

#### 🛠️ Modificações e Governança
- **Exclusão Física em `handleFabExitWithoutSaving()`:** Se a observação ativa possuir `status === 'draft'`, ela é filtrada e removida do array de observações (`appState.observations`), desvinculando `appState.currentObs = null` e persistindo a exclusão imediatamente via `saveState()`.
- **Preservação dos Demais Fluxos:** Os botões de salvamento oficial ("Salvar Rascunho" no menu FAB e na aba de Síntese) permanecem inalterados, preservando os rascunhos para continuação. Observações finalizadas abertas para consulta em modo somente leitura não sofrem exclusão ao sair.
- **Atualização da Identificação de Versão:** Elevação oficial para `📌 Versão 0.80 (v7.59)` no cabeçalho superior, modal `#modalChangelog` e documentação técnica.

---

### [Versão 0.81] - Destaque e Segregação da Próxima Visita na Agenda
* **Data e Horário:** 15 de Outubro de 2026 — 17:15:00
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///c:/Users/Diogo/Documents/gestor%20supervisao_patos/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v81_destaque_proxima_visita_agenda.html`](file:///c:/Users/Diogo/Documents/gestor%20supervisao_patos/gestor%20supervisao_patos/intermediárias/aplicativo_v81_destaque_proxima_visita_agenda.html)
* **Base / Insumos:** Solicitação direta do usuário para segregação da próxima visita em relação ao restante do cronograma, permitindo reconhecimento instantâneo por parte da aplicadora.
* **Identificador no App:** `Versão 0.81 (v7.60)`
* **Hosting Oficial:** [https://supervisao-st-crianca.web.app](https://supervisao-st-crianca.web.app)
* **Contexto:** Aprimoramento da ergonomia visual na aba Agenda/Cronograma (`#screenSchedule`), introduzindo um hero card destacado no topo para a próxima visita pendente do escopo e separando o restante dos agendamentos em um bloco próprio com identificadores inline.

#### Inclusões e Funcionalidades
- **Card Hero da Próxima Visita:** Destaque visual isolado no topo da tela com gradiente suave e borda azul, apresentando o profissional, turma/função, escola, dia da semana, data, horário e atalho direto para iniciar a visita.
- **Pílulas Temporais Informativas:** Indicação dinâmica de urgência no topo do card (HOJE, AMANHÃ, EM X DIAS ou EM ATRASO), permitindo reconhecimento imediato do cronograma.
- **Segregação do Cronograma:** O bloco principal passa a reunir as "Demais Visitas do Cronograma", isolando a próxima visita prioritária do restante da grade.
- **Identificador Inline:** Selo de destaque 'Próxima' inserido diretamente na linha da tabela desktop e no card mobile correspondente à próxima visita.

#### Modificações e Governança
- **Ordenação Cronológica Estrita:** Garantia de ordenação ascendente por data e horário de agendamentos em `renderScheduleScreen()`.
- **Formatação Uniforme de Datas:** Datas exibidas de forma padronizada em DD/MM/AAAA em todas as visualizações (desktop e mobile).
- **Ocultação em Arquivadas:** Ao selecionar o filtro de visitas arquivadas, o destaque de próxima visita é automaticamente ocultado para priorizar a consulta histórica.
- **Atualização da Identificação de Versão:** Elevação oficial para `Versão 0.81 (v7.60)` no cabeçalho, modal de histórico e changelog.

---

### [Versão 0.88] - Registro Manual e Fidedigno de Horários da Observação Pedagógica
* **Data e Horário:** 20 de Outubro de 2026 — 15:15:00
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v88_registro_manual_horarios_observacao.html`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/gestor%20supervisao_patos/intermediárias/aplicativo_v88_registro_manual_horarios_observacao.html)
* **Base / Insumos:** Deliberação oficial da equipe técnica SerTão Criança e plano executivo [`planos_de_implementacao/plano_registro_manual_horarios_observacao.md`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_registro_manual_horarios_observacao.md).
* **Identificador no App:** `📌 Versão 0.88 (v7.67)`
* **Hosting Oficial:** [https://silvabrun0.github.io/supervisao-st-crianca/](https://silvabrun0.github.io/supervisao-st-crianca/)
* **Contexto:** Eliminação definitiva do mecanismo de gravação compulsória de horários com base no relógio do sistema no momento da finalização (`finalizeObservation()`). O acompanhamento pedagógico na Educação Infantil de Patos/PB muitas vezes é registrado ou concluído em momento posterior ao término da aula (tarde, noite ou dia subsequente). O sistema agora preserva fielmente os horários reais em que o docente esteve em sala, garantindo dados fidedignos para apoio à decisão.

#### 🚀 Inclusões e Funcionalidades
- **Eliminação da Sobrescrita Forçada de Horários:** A finalização de observações pedagógicas não substitui mais `endDate` e `endTime` com o horário do clique no botão. Os horários e datas informados pelo avaliador são preservados integralmente.
- **Formulário de Configuração com Horários Visíveis (`#screenSetupObs`):** Campos editáveis para Data da Observação, Horário de Início e Horário Previsto de Término no setup inicial, com defaults inteligentes de horário atual ou do cronograma vinculado.
- **Painel Fidedigno na Síntese Final (`#screenSynthesis`):** Inputs interativos de Data, Horário de Início e Horário de Término visíveis durante todo o preenchimento, com recálculo em tempo real da duração (`recalculateSynthesisDuration`) e instruções claras para envio pós-visita.
- **Validações Temporais Robustas:** Bloqueio obrigatório de finalização sem horário de término, bloqueio de datas futuras e validação de término estritamente posterior ao horário de início.
- **Crachá de Consolidação e Modo Leitura:** Bloqueio automático de edição dos campos com visualização consolidada em crachá tipográfico após a finalização da observação.

#### 🛠️ Modificações e Governança
- **Auditoria Modular Expandida (100% de Cobertura):** Módulo `sintese_finalizacao` atualizado com asserções determinísticas de bloqueio por término ausente, consistência temporal e validação da preservação exata dos horários informados manualmente (100 minutos de duração calculada).
- **Sincronização Integral de Builds:** Atualização uniforme de todos os pontos de entrada (`index.html`, `gestor supervisao_patos/index.html` e `firebase_deploy/public/index.html`).
- **Atualização da Identificação de Versão:** Elevação oficial para `📌 Versão 0.88 (v7.67)` no cabeçalho superior, modal `#modalChangelog` e `CHANGELOG.md`.

---

### [Versão 0.87] - Arquitetura Modular de Auditoria Integral e Atualização Normativa dos Workflows
* **Data e Horário:** 20 de Outubro de 2026 — 15:10:00
* **Arquivo em Produção:** [`index.html`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/index.html)
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v87_auditoria_modular_integral_e_workflows.html`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v87_auditoria_modular_integral_e_workflows.html)
* **Base / Insumos:** Solicitação direta de auditoria modular da plataforma e plano executivo [`planos_de_implementacao/plano_auditoria_modular_integral_e_workflows.md`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_auditoria_modular_integral_e_workflows.md).
* **Identificador no App:** `📌 Versão 0.87 (v7.66)`
* **Hosting Oficial:** [https://silvabrun0.github.io/supervisao-st-crianca/](https://silvabrun0.github.io/supervisao-st-crianca/)
* **Contexto:** Reformulação da suíte de testes determinísticos em 12 módulos independentes ("modo-a-modo") cobrindo 100% da plataforma SerTão Criança, suporte completo a parâmetros de linha de comando no orquestrador `audit_platform.py` e atualização das diretrizes normativas do projeto (`WORKFLOW_MACOS.md`, `WORKFLOW.md`, `AGENTS.md`, `GEMINI.md`, `.agents/rules/workflow.md`).

#### 🚀 Inclusões e Funcionalidades
- **Auditoria Modular Modo-a-Modo (12 Módulos Canônicos):**
  - Decomposição estruturada da verificação em 12 módulos independentes e encadeáveis em `window.runFullPlatformAudit({ module })`:
    1. `auth_rbac`: Autenticação, Usuários, Perfis e RBAC.
    2. `catalogo_dados`: Catálogo Canônico, Escolas, Turmas, Professores e Estado Global.
    3. `setup_longitudinal`: Setup de Observação, Seleção de Turmas e Ciclo Longitudinal (Pilar 1).
    4. `rubricas_observacao`: Observação Ativa, Matrizes Curriculares, Rubricas e Pendências.
    5. `sintese_finalizacao`: Síntese Pedagógica, Escala de Materiais, Finalização e Cálculo de Tempo.
    6. `travas_seguranca`: Travas de Duplo Lançamento, Imutabilidade Longitudinal e Segurança.
    7. `formadora_coordenacao`: Acompanhamento da Formadora, Matriz de Coordenação e Isolamento de Perfis.
    8. `agenda_cronograma`: Cronograma de Visitas, Destaque da Próxima Visita e Baixa Automática.
    9. `historico_governanca`: Histórico de Observações, Filtros Multidimensionais, Visualização e Exclusão.
    10. `indicadores_decisao`: Indicadores Pedagógicos, Cobertura de Turmas (Pilar 1), KPIs e Apoio à Decisão.
    11. `backup_exportacao`: Persistência Local, Backup JSON, Restauração e Relatório para Impressão.
    12. `navegacao_layout`: Sistema de Rotas/Tabs, Menu Mobile Overlay, Acessibilidade e Changelog.
- **Motor CLI Aprimorado (`audit_platform.py`):**
  - `--module <nome>`: Execução pontual de qualquer módulo isoladamente.
  - `--list-modules`: Catálogo explicativo de todos os 12 módulos disponíveis.
  - `--silent-on-success`: Modo silencioso para pós-deploy na Etapa 2, reportando apenas ocorrências de problemas.
  - Resolução dinâmica de portas livres (`find_available_port`) e isolamento de perfil Chrome via `mkdtemp` para eliminar erros de `SingletonLock` e `Address already in use`.
- **Atualização Normativa dos Workflows do Projeto:**
  - Inclusão mandatória da seção de alterações/adições/exclusões para a auditoria em qualquer plano de implementação (Etapa 1).
  - Protocolo estrito de execução automatizada pós-deploy reportando apenas ocorrências de problemas (Etapa 2).

---

### [Versão 0.86] - Algoritmo de Verificação Integral da Plataforma e Correção Global de Bugs
* **Data e Horário:** 20 de Outubro de 2026 — 14:30:00
* **Arquivo em Produção:** [`index.html`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/index.html)
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v86_algoritmo_verificacao_integral_e_correcao_bugs.html`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/intermediárias/aplicativo_v86_algoritmo_verificacao_integral_e_correcao_bugs.html)
* **Base / Insumos:** Solicitação de auditoria ponta a ponta da plataforma e plano executivo [`planos_de_implementacao/plano_algoritmo_verificacao_integral_e_correcao_bugs.md`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_algoritmo_verificacao_integral_e_correcao_bugs.md).
* **Identificador no App:** `📌 Versão 0.86 (v7.65)`
* **Hosting Oficial:** [https://silvabrun0.github.io/supervisao-st-crianca/](https://silvabrun0.github.io/supervisao-st-crianca/)
* **Contexto:** Criação de um motor determinístico de verificação ponta a ponta para toda a plataforma SerTão Criança, integrando script executável via terminal (`audit_platform.py`) e acionamento programático no navegador (`window.runFullPlatformAudit()`). Diagnóstico minucioso e correção imediata de 8 inconsistências e bugs reais em Indicadores Pedagógicos, Histórico, Cronograma e manipulação DOM.

#### 🚀 Inclusões e Funcionalidades
- **Motor Automatizado de Auditoria (`PlatformVerificationEngine`):**
  - Implementação da função global `window.runFullPlatformAudit()` com 10 baterias de testes automatizados determinísticos cobrindo:
    1. Autenticação, Usuários e RBAC (Mariana, Clarice, Rodrigo, Usuário Pendente e recuperação).
    2. Catálogo Canônico e Estado Global (`INITIAL_CLASSES`, resiliência e `getClassesForSchool`).
    3. Setup & Travas de Negócio por Turma (seleção, turmas da UE, equipes de regência e cálculo longitudinal).
    4. Observação Ativa & Rubricas (inicialização de turma, navegação de dimensões, escala Likert e pendências).
    5. Síntese & Finalização Automática (gravação de término, duração, síntese e status `finalized`).
    6. Travas de Segurança (bloqueio de duplo lançamento e avanço longitudinal garantidos).
    7. Acompanhamento da Formadora (isolamento de cargo e escopo da coordenação).
    8. Cronograma Longitudinal (planejamento, edição e baixa automática na conclusão da visita).
    9. Histórico & Governança (aplicação de filtros e preservação de rascunhos).
    10. Indicadores Pedagógicos (cálculo de consistência, visitas auditadas e Cobertura de Turmas).
  - Isolamento de execução com snapshot e restauração transparente de `appState` para não poluir os dados reais do usuário.
- **Script Executável CLI Headless (`audit_platform.py`):**
  - Execução automatizada via terminal que inicializa o Google Chrome em modo headless, roda a auditoria e reporta o status colorido e tempo de cada bateria, saindo com código 0 apenas se 100% dos testes forem aprovados.
- **Atalho de Diagnóstico no Perfil:**
  - Inclusão do botão "🔬 Executar Diagnóstico da Plataforma" no modal de perfil do usuário.

#### 🛠️ Correções e Melhorias de Estabilidade (Bugs Resolvidos)
- **Bug 1 (Indicadores Pedagógicos com Turmas):** Correção do filtro de `scopedObs` em `renderIndicatorsScreen()` para incluir observações com `evaluatedType === 'turma'` quando o público-alvo for 'professora', restaurando o índice de consistência geral e drilldowns.
- **Bug 2 (Acompanhamento Longitudinal Individual de Docentes):** O filtro de visitas individuais em `renderTeacherLongitudinalDetail()` e `exportTeacherLongitudinalCSV()` agora pesquisa a docente na array `teachers` de turmas com regência coletiva.
- **Bug 3 (Filtro por Função no Histórico):** A opção "Professoras" no `#histFilterRole` agora engloba tanto `evaluatedType === 'professora'` quanto `'turma'`.
- **Bug 4 (Visibilidade para Perfil Professora):** Ajuste em `getScopedObservations()` permitindo que professoras visualizem as devolutivas finalizadas de suas respectivas turmas e escolas.
- **Bug 5 (Baixa no Cronograma por Turma):** Resolução de vínculo na finalização (`finalizeObservation()`), sincronizando visitas agendadas para 'realizado' mesmo quando o agendamento tiver sido realizado para a turma ou por docente regente.
- **Bug 6 (Resiliência DOM no Menu Desktop):** Substituição da manipulação insegura por índice de nós (`childNodes[2]`) por um elemento dedicado `<span id="deskTabHomeLabel">Início</span>`.
- **Bug 7 (Setup de Visita Agendada Flexível):** Correspondência resiliente de turmas em `openSetupScreen(prefilledSchedule)` quando o agendamento contiver etapa abreviada.
- **Bug 8 (Identificação em Impressão de Síntese):** Bloco de assinaturas agora identifica explicitamente o nome da Turma e da equipe regente titular nas observações de Educação Infantil.

---

### [Versão 0.85] - Pilar 1: Inversão da Unidade de Análise para a Turma
* **Data e Horário:** 20 de Outubro de 2026 — 13:50:00
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v85_pilar_1_inversao_unidade_analise_turma.html`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/gestor%20supervisao_patos/intermediárias/aplicativo_v85_pilar_1_inversao_unidade_analise_turma.html)
* **Base / Insumos:** Deliberação oficial da equipe técnica SerTão Criança (19/10/2026) e plano executivo de arquitetura [`planos_de_implementacao/plano_pilar_1_inversao_unidade_analise_turma.md`](file:///Users/bruno/Desktop/gestor%20supervisao_patos/planos_de_implementacao/plano_pilar_1_inversao_unidade_analise_turma.md).
* **Identificador no App:** `📌 Versão 0.85 (v7.64)`
* **Hosting Oficial:** [https://supervisao-st-crianca.web.app](https://supervisao-st-crianca.web.app)
* **Contexto:** Alinhamento técnico-pedagógico com a realidade da rede de Patos/PB. Na Educação Infantil não existe professor auxiliar: as turmas parciais contam com duplas e as integrais com quartetos de regentes titulares. A supervisão pedagógica analisa a experiência da criança e a rotina da **TURMA**, garantindo a continuidade longitudinal mesmo em eventuais substituições docentes.

#### 🚀 Inclusões e Funcionalidades
- **Catálogo Canônico de Turmas (`INITIAL_CLASSES` e `appState.classes`):** Cadastro oficial das turmas de creche e pré-escola (`id`, `name`, `school`, `stage`, `shift`, `teachers`), persistido de forma resiliente no `localStorage` com auto-agrupamento de resiliência.
- **Formulário de Configuração Centrado na Turma (`#screenSetup`):** Para coordenadoras pedagógicas, o formulário abre a seleção prioritária de turmas da unidade escolar (`getClassesForSchool`), exibindo o painel dinâmico da equipe de docentes regentes titulares vinculadas.
- **Reestruturação das Travas de Negócio por Turma:**
  - Bloqueio rigoroso de duplo lançamento para a mesma **TURMA** no mesmo bimestre.
  - Controle de sequência longitudinal (1º ➔ 2º ➔ 3º ➔ 4º Bimestre) e sugestão automática de próximo ciclo (`getNextEligibleBimesterForClass`) baseados na **TURMA**.
- **Acompanhamento de Turma no Histórico, Rascunhos e Ativa:** Título principal exibe a **TURMA** em primeiro plano tipográfico, com subtítulo detalhando a equipe de regência titular.
- **Métrica de Cobertura de Turmas na Aba de Indicadores:** No painel de KPIs superiores, a métrica de cobertura passa a calcular o total e a porcentagem de turmas da escola acompanhadas no bimestre.

#### 🛠️ Modificações e Governança
- **Preservação Integral do Fluxo de Formadoras:** Acompanhamento formativo de Coordenadoras Pedagógicas permanece inalterado com seleção nominal (`evaluatedType === 'coordenador'`).
- **Retrocompatibilidade Resiliente:** Observações legadas e consultas históricas permanecem funcionais com fallbacks seguros.
- **Sincronização Integral de Builds:** Atualização uniforme de todos os pontos de entrada (`index.html`, `gestor supervisao_patos/index.html` e `firebase_deploy/public/index.html`).
- **Atualização da Identificação de Versão:** Elevação oficial para `📌 Versão 0.85 (v7.64)` no cabeçalho superior, modal `#modalChangelog` e `CHANGELOG.md`.

---

### [Versão 0.84] - Correção Crítica do Helper getNowTimeString e Parâmetros Temporais
* **Data e Horário:** 16 de Outubro de 2026 — 13:55:00
* **Arquivo em Produção:** [`firebase_deploy/public/index.html`](file:///c:/Users/Diogo/Documents/gestor%20supervisao_patos/gestor%20supervisao_patos/firebase_deploy/public/index.html)
* **Arquivo Intermediário:** [`intermediárias/aplicativo_v84_correcao_reference_error_getnowtimestring.html`](file:///c:/Users/Diogo/Documents/gestor%20supervisao_patos/gestor%20supervisao_patos/intermediárias/aplicativo_v84_correcao_reference_error_getnowtimestring.html)
* **Base / Insumos:** Reporte de erro em tempo de execução `ReferenceError: Can't find variable: getNowTimeString` ao acionar o botão `INICIAR INSTRUMENTO DE OBSERVAÇÃO →` (`startNewObservation`).
* **Identificador no App:** `📌 Versão 0.84 (v7.63)`
* **Hosting Oficial:** [https://supervisao-st-crianca.web.app](https://supervisao-st-crianca.web.app)
* **Contexto:** Correção emergencial de inicialização de observações pedagógicas. A ausência da definição da função `getNowTimeString` causava o travamento completo do fluxo de início de observação no navegador.

#### 🚀 Inclusões e Funcionalidades
- **Helper Global `getNowTimeString()`:** Implementação da rotina de formatação de hora local no formato padronizado `HH:mm` utilizando `now.getHours()` e `now.getMinutes()` com padding de 2 dígitos, complementando o helper `getTodayDateString()`.
- **Leitura Resiliente dos Parâmetros do Formulário:** A função `startNewObservation()` agora lê corretamente os valores configurados nos campos `#setupDate`, `#setupStartTime` e `#setupEndTime`, aplicando fallbacks protetivos para `todayStr`, `currentNowTime` e o cálculo de 90 minutos via `addMinutesToTime()`.

#### 🛠️ Modificações e Governança
- **Restauração da Trava de Consistência Temporal:** Reativação da validação que impede horários de término anteriores ou iguais ao horário de início (`diffMinutes <= 0`), emitindo notificação informativa.
- **Sincronização Integral de Builds:** Atualização uniforme de todos os pontos de entrada (`index.html`, `gestor supervisao_patos/index.html` e `firebase_deploy/public/index.html`).
- **Atualização da Identificação de Versão:** Elevação oficial para `📌 Versão 0.84 (v7.63)` no cabeçalho superior, modal `#modalChangelog` e `CHANGELOG.md`.
