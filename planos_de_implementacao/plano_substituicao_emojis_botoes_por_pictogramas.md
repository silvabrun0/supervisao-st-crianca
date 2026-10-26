# Plano de Implementação: Substituição de Emojis nos Botões Principais por Pictogramas Vetoriais (SVGs)

---

## 0. Diretriz de Execução (Obrigatória para o Operário - Etapa 2)
> [!IMPORTANT]
> **Leitura Prévia Obrigatória:** Antes de executar qualquer ação deste plano, o assistente na **Etapa 2 (O Operário)** DEVE consultar e seguir rigorosamente:
> 1. [WORKFLOW_MACOS.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_MACOS.md)
> 2. [WORKFLOW_GITHUB.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/WORKFLOW_GITHUB.md)
> 3. [.agents/skills/execucao-operario/SKILL.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/.agents/skills/execucao-operario/SKILL.md)
> 4. [.agents/skills/auditoria-plataforma/SKILL.md](file:///Users/bruno/Desktop/gestor%20supervisao_patos/.agents/skills/auditoria-plataforma/SKILL.md)
>
> **Trava de Fidelidade e Estabilidade:** Este plano tem como foco a substituição visual higiênica de emojis nos botões e controles principais da plataforma *SerTão Criança* por pictogramas vetoriais (SVGs inline padronizados). Todos os IDs, classes CSS funcionais, manipuladores de evento (`onclick`), lógica de negócio, travas de segurança e rotas de estado DEVEM ser mantidos 100% intactos.

---

## 1. Diagnóstico e Contexto

### 1.1 Contexto e Justificativa Pedagógica
Ao longo das iterações e melhorias incrementais na plataforma *SerTão Criança*, diversos botões, abas e barras de ações receberam emojis Unicode coloridos (por exemplo: 💾, 📥, 📤, 📄, 🖨️, 📑, 📅, ✏️, 🗑️, ➕, 🏢, 🏫, 👥, 📊, 🔍, 🚦, 📌, 📋, 👁️, 📦, 📷, 🔄, ⭐). 

Embora tenham sido introduzidos para apoiar a identificação rápida de comandos, a proliferação excessiva de emojis gera problemas graves de ergonomia visual e identidade institucional:
1. **Inconsistência Visual Entre Dispositivos:** Emojis são glifos tipográficos renderizados pelo sistema operacional. Um emoji em macOS/iOS tem visual 3D brilhante, enquanto no Windows tem bordas pretas cartunescas e no Android outro desenho, causando descontinuidade estética na rede municipal.
2. **Ruído Cognitivo e Falta de Sobriedade:** O excesso de cores primárias e estilos gráficos aleatórios em botões diminui a sobriedade institucional exigida em um sistema de apoio à decisão pedagógica do Núcleo de Educação Infantil.
3. **Quebra de Harmonia com o Design System:** O cabeçalho desktop (`#mainNavTabs`), a barra móvel inferior (`#bottomBar`) e o botão hero de Nova Observação (`#btnNewObsHero`) já utilizam pictogramas vetoriais limpos no padrão *Feather / Lucide* (`viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"`). Os botões com emojis colidem diretamente com essa linguagem visual consolidada.

### 1.2 Princípio da Transição para Pictogramas
A transição substitui os emojis nos **botões principais** por **pictogramas vetoriais SVG monocromáticos** que:
- Herdam a cor do texto do botão via `stroke="currentColor"`;
- Mantêm alinhamento perfeito via regras flexbox existentes em `.btn` (`gap: 8px; align-items: center; justify-content: center;`);
- Garantem legibilidade nítida em qualquer resolução (telas Retina / alta densidade);
- Padronizam as dimensões visuais (16x16px para botões normais, 14x14px para botões compactos/badges e 18x18px para botões de destaque).

### 1.3 Delimitação de Escopo
- **Alvo Primário:** Botões de ação, botões de cabeçalho, sub-abas de navegação, botões de exportação/importação, botões de linhas de tabela (editar/excluir/agendar), botões de modais estruturais e botões de ação flutuante (FAB).
- **Preservação:** Os chips de filtro rápido semafórico do Pilar 10 (`🔴 Atrasadas`, `⚪ No Prazo`, `🟢 Concluídas`, `🏆 Ciclo 100%`) possuem asserções lexicais específicas na suíte de testes in-app (linhas 25677 e 25700 do `index.html`). O plano mantém seus indicadores ou realiza a sincronização correspondente com a suíte de testes.

---

## 2. Arquitetura e Mapeamento de Pontos de Impacto

Os arquivos afetados no projeto são:
- [index.html](file:///Users/bruno/Desktop/gestor%20supervisao_patos/index.html)
- [firebase_deploy/public/index.html](file:///Users/bruno/Desktop/gestor%20supervisao_patos/firebase_deploy/public/index.html) (cópia espelhada obrigatória)

### 2.1 Especificação das Classes CSS Utilitárias de Pictogramas
Para assegurar renderização padronizada e sem código redundante inline, adiciona-se ao CSS de botões (`index.html` ~linha 340):

```css
.btn-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
}
.btn-icon-sm {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
}
.btn-icon-lg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
}
```

### 2.2 Catálogo Canônico de Pictogramas SVG

| Nome do Pictograma | viewBox & Paths SVG | Usos Principais |
| :--- | :--- | :--- |
| **Download / CSV / Baixar** | `<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>` | Exportar CSV, Baixar Modelo, Baixar PDF |
| **Upload / Importar** | `<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>` | Importar CSV, Importar JSON, Atualizar PDF |
| **Documento / JSON / PDF** | `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>` | Exportar JSON, Exportar PDF, Matrizes Oficiais |
| **Salvar / Persistir** | `<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>` | Salvar Rascunho, Salvar Prazos na SSOT, Backup |
| **Lixeira / Excluir** | `<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>` | Excluir Agendamento, Excluir Polo/UE/Docente/Turma |
| **Lápis / Editar** | `<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>` | Editar Polo/UE/Membro/Turma, Renomear Dimensão |
| **Impressora / Imprimir** | `<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>` | Exportar em PDF, Imprimir Ficha Devolutiva |
| **Adicionar / Plus** | `<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>` | Inserir Antes, Nova Dimensão, Subdimensão, Adicionar Item |
| **Tag / Changelog** | `<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>` | Botão de Versão no Cabeçalho (`.btn-changelog`) |
| **Livro / Matrizes** | `<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>` | Botão de Matrizes no Cabeçalho (`#headerRefDocsBtn`) |
| **Gráfico de Barras** | `<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>` | Sub-aba Visão Geral (`#pillIndKpis`), Extrações SSOT |
| **Atividade / Radar** | `<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>` | Sub-aba Acompanhamento Longitudinal (`#pillIndLongitudinal`) |
| **Lupa / Analítico** | `<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>` | Sub-aba Visualização por Dimensão (`#pillIndDrilldown`), Raio-X |
| **Prédio / Unidades** | `<path d="M3 21h18M3 7l9-4 9 4v14M9 21V9h6v12"/>` | Sub-aba Unidades Escolares & Polos (`#pedagTabUnits`) |
| **Grid / Turmas** | `<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>` | Sub-aba Turmas & Regência Titular (`#pedagTabClasses`) |
| **Usuários / Equipe** | `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>` | Sub-aba Equipes & Servidores (`#pedagTabTeam`) |
| **Pacote / Arquivo** | `<line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>` | Auto-Arquivar, Baixar Pacote Atual, Arquivar |
| **Recarregar / Reset** | `<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>` | Limpar Filtros, Restaurar Padrões |
| **Prancheta / Devolutiva**| `<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>` | Devolutiva, Ver Devolutiva, Copiar Diagnóstico |
| **Câmera / Foto** | `<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>` | Anexar Foto |
| **Estrela / Oficial** | `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>` | Definir Novo Padrão de Rubricas |
| **Sair / Logout** | `<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>` | Sair sem Salvar (Menu FAB) |
| **Diálogo / Mensagem** | `<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>` | Marcar como Conversado |

### 2.3 Mapeamento Detalhado dos Botões Afetados

| Grupo Funcional | ID / Seletor | Situação Atual | Situação Pretendida (Pictograma + Texto) |
| :--- | :--- | :--- | :--- |
| **Cabeçalho** | `.btn-changelog` | `📌 Versão 1.28 (v8.1.4)` | SVG Tag + `Versão 1.28` |
| **Cabeçalho** | `#headerRefDocsBtn` | `📑 Matrizes (PDF)` | SVG Livro + `Matrizes (PDF)` |
| **Gestão da Rede** | `#pedagTabUnits` | `🏢 Unidades Escolares & Polos` | SVG Prédio + `Unidades Escolares & Polos` |
| **Gestão da Rede** | `#pedagTabClasses` | `🏫 Turmas & Regência Titular` | SVG Grid + `Turmas & Regência Titular` |
| **Gestão da Rede** | `#pedagTabTeam` | `👥 Equipes & Servidores da Rede` | SVG Usuários + `Equipes & Servidores` |
| **Gestão da Rede** | `#pedagTabExports` | `📊 Extrações & Relatórios SSOT` | SVG Gráfico + `Extrações & Relatórios SSOT` |
| **Gestão da Rede** | `exportUnitsCSV()` | `💾 Exportar UEs (CSV)` | SVG Download + `Exportar UEs (CSV)` |
| **Gestão da Rede** | `exportUnitsJSON()` | `📄 Exportar UEs (JSON)` | SVG Documento + `Exportar UEs (JSON)` |
| **Gestão da Rede** | `downloadUnitsCsvTemplate()` | `📥 Baixar Modelo (CSV)` | SVG Download + `Baixar Modelo (CSV)` |
| **Gestão da Rede** | `triggerUnitsCsvImport()` | `📤 Importar CSV` | SVG Upload + `Importar CSV` |
| **Gestão da Rede** | `exportTeamMembersCSV()` | `💾 Exportar Servidores (CSV)` | SVG Download + `Exportar Servidores (CSV)` |
| **Gestão da Rede** | `exportTeamMembersJSON()`| `📄 Exportar Servidores (JSON)`| SVG Documento + `Exportar Servidores (JSON)`|
| **Gestão da Rede** | `downloadTeamCsvTemplate()` | `📥 Baixar Modelo (CSV)` | SVG Download + `Baixar Modelo (CSV)` |
| **Gestão da Rede** | `triggerTeamCsvImport()` | `📤 Importar CSV` | SVG Upload + `Importar CSV` |
| **Gestão da Rede (SSOT)**| `exportFullBaseJSON()` | `💾 Exportar Base Completa (.JSON)` | SVG Salvar + `Exportar Base Completa (.JSON)` |
| **Gestão da Rede (SSOT)**| `triggerImportFullBase()`| `📂 Importar / Sobrescrever (.JSON)` | SVG Upload + `Importar / Sobrescrever (.JSON)` |
| **Indicadores Subtabs** | `#pillIndKpis` | `<span class="tab-icon">📊</span> Visão Geral` | SVG Gráfico + `Visão Geral` |
| **Indicadores Subtabs** | `#pillIndLongitudinal` | `<span class="tab-icon">🚦</span> Acompanhamento...` | SVG Atividade + `Acompanhamento Longitudinal` |
| **Indicadores Subtabs** | `#pillIndDrilldown` | `<span class="tab-icon">🔍</span> Visualização...` | SVG Lupa + `Visualização por Dimensão` |
| **Histórico** | `exportHistoryFilteredCSV`| `📥 CSV` | SVG Download + `CSV` |
| **Histórico** | `exportHistoryFilteredPDF`| `📄 PDF` | SVG Impressora + `PDF` |
| **Histórico** | `#btnArchiveOldObs` | `📦 Auto-Arquivar` | SVG Pacote + `Auto-Arquivar` |
| **Histórico** | `resetHistoryFilters()` | `🔄 Limpar Filtros` | SVG Recarregar + `Limpar Filtros` |
| **Registros Formativos**| `exportNotesFilteredCSV` | `📥 CSV` | SVG Download + `CSV` |
| **Registros Formativos**| `exportNotesFilteredPDF` | `📄 PDF` | SVG Impressora + `PDF` |
| **Registros Formativos**| `archiveAllResolvedNotes`| `📦 Arquivar Resolvidas` | SVG Pacote + `Arquivar Resolvidas` |
| **Registros Formativos**| `openResolveNoteModal` | `💬 Marcar como Conversado` | SVG Diálogo + `Marcar como Conversado` |
| **Rubricas** | `openRefDocsModal()` | `📑 Matrizes Oficiais (PDF / Upload)` | SVG Livro + `Matrizes Oficiais (PDF / Upload)` |
| **Rubricas** | `exportRubricsCSV()` | `💾 Exportar (CSV)` | SVG Download + `Exportar (CSV)` |
| **Rubricas** | `exportRubricsJSON()` | `📄 Exportar (JSON)` | SVG Documento + `Exportar (JSON)` |
| **Rubricas** | `triggerImportRubricsJSON()`| `📥 Importar (JSON)` | SVG Upload + `Importar (JSON)` |
| **Rubricas** | `#btnSetNewDefaultRubrics` | `⭐ Definir Novo Padrão` | SVG Estrela + `Definir Novo Padrão` |
| **Rubricas (Árvore)** | Botões `promptAddDimension`| `➕ Inserir Antes`, `➕ Nova Dimensão` | SVG Adicionar + `Inserir Antes` |
| **Rubricas (Árvore)** | Botões `promptEditDimension`| `✏️ Renomear` | SVG Lápis + `Renomear` |
| **Rubricas (Árvore)** | Botões `confirmDeleteDimension`| `🗑️ Excluir` | SVG Lixeira + `Excluir` |
| **Cronograma (Linhas)** | `viewFeedbackFromSchedule`| `📋 Devolutiva` / `📋 Ver Devolutiva` | SVG Prancheta + `Devolutiva` |
| **Cronograma (Linhas)** | `openEditScheduleModal` | `✏️ Editar` | SVG Lápis + `Editar` |
| **Cronograma (Linhas)** | `confirmDeleteSchedule` | `🗑️ Excluir` | SVG Lixeira + `Excluir` |
| **Modal Agendamento** | `#btnDeleteScheduleModal` | `🗑️ Excluir Agendamento` | SVG Lixeira + `Excluir Agendamento` |
| **Modal Prazos SSOT** | `saveBimesterPeriodsSettings`| `💾 Salvar Prazos na SSOT` | SVG Salvar + `Salvar Prazos na SSOT` |
| **Menu Flutuante FAB** | Salvar Rascunho | Ícone `💾` | SVG Salvar |
| **Menu Flutuante FAB** | Ocorrência de Campo | Ícone `📝` | SVG Documento/Nota |
| **Menu Flutuante FAB** | Sair sem Salvar | Ícone `🚪` | SVG Logout |
| **Observação Ativa** | `triggerPhotoUpload` | `📷 Anexar Foto` | SVG Câmera + `Anexar Foto` |
| **Observação Ativa** | `saveMorningStageAndExit` | `SALVAR TURNO MATUTINO... 🌤️`| SVG Relógio/Turno + `Salvar Turno Matutino e Aguardar Tarde` |
| **Síntese Final** | `exportSynthesisToPdf()` | `🖨️ Exportar em PDF` | SVG Impressora + `Exportar em PDF` |

---

## 3. Especificação de Implementação Passo a Passo

### Passo 1: Inclusão das Classes CSS de Pictogramas
Em `index.html` (abaixo da definição de `.btn` ~linha 340):
```css
    .btn-icon {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
      fill: none;
    }
    .btn-icon-sm {
      width: 13px;
      height: 13px;
      flex-shrink: 0;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
      fill: none;
    }
    .btn-icon-lg {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
      stroke: currentColor;
      stroke-width: 2.2;
      stroke-linecap: round;
      stroke-linejoin: round;
      fill: none;
    }
```

---

### Passo 2: Cabeçalho & Ações Globais (`.btn-changelog` e `#headerRefDocsBtn`)
Em `index.html` (~linhas 3490-3497):

**Antes:**
```html
        <!-- Matrizes em PDF Header Action Button (Mobile e Desktop) -->
        <button class="btn-ref-docs" onclick="navigateToTab('refDocs')" id="headerRefDocsBtn" style="display:none;" title="Arquivos Oficiais em PDF das Matrizes Curriculares">
          📑 <span class="btn-ref-docs-text">Matrizes (PDF)</span>
        </button>

        <button class="btn-changelog" onclick="openChangelogModal()" title="Histórico Integral de Modificações e Diretrizes">
          📌 Versão 1.28 (v8.1.4)
        </button>
```

**Depois:**
```html
        <!-- Matrizes em PDF Header Action Button (Mobile e Desktop) -->
        <button class="btn-ref-docs" onclick="navigateToTab('refDocs')" id="headerRefDocsBtn" style="display:none;" title="Arquivos Oficiais em PDF das Matrizes Curriculares">
          <svg class="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          <span class="btn-ref-docs-text">Matrizes (PDF)</span>
        </button>

        <button class="btn-changelog" onclick="openChangelogModal()" title="Histórico Integral de Modificações e Diretrizes">
          <svg class="btn-icon-sm" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
          <span>Versão 1.28 (v8.1.4)</span>
        </button>
```

---

### Passo 3: Sub-abas de Navegação da Gestão da Rede (`#pedagNavSubTabs`)
Em `index.html` (~linhas 3620-3635):

**Antes:**
```html
        <button class="btn pedag-subtab-btn active" id="pedagTabUnits" onclick="switchPedagSubTab('units')">
          <span id="pedagTabUnitsLabel">🏢 Unidades Escolares & Polos</span>
        </button>
        <button class="btn pedag-subtab-btn" id="pedagTabClasses" onclick="switchPedagSubTab('classes')">
          <span id="pedagTabClassesLabel">🏫 Turmas & Regência Titular</span>
        </button>
        <button class="btn pedag-subtab-btn" id="pedagTabTeam" onclick="switchPedagSubTab('team')">
          <span id="pedagTabTeamLabel">👥 Equipes & Servidores da Rede</span>
        </button>
        <button class="btn pedag-subtab-btn" id="pedagTabExports" onclick="switchPedagSubTab('exports')">
          📊 Extrações & Relatórios SSOT
        </button>
```

**Depois:**
```html
        <button class="btn pedag-subtab-btn active" id="pedagTabUnits" onclick="switchPedagSubTab('units')">
          <svg class="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M3 7l9-4 9 4v14M9 21V9h6v12"/></svg>
          <span id="pedagTabUnitsLabel">Unidades Escolares & Polos</span>
        </button>
        <button class="btn pedag-subtab-btn" id="pedagTabClasses" onclick="switchPedagSubTab('classes')">
          <svg class="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
          <span id="pedagTabClassesLabel">Turmas & Regência Titular</span>
        </button>
        <button class="btn pedag-subtab-btn" id="pedagTabTeam" onclick="switchPedagSubTab('team')">
          <svg class="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span id="pedagTabTeamLabel">Equipes & Servidores da Rede</span>
        </button>
        <button class="btn pedag-subtab-btn" id="pedagTabExports" onclick="switchPedagSubTab('exports')">
          <svg class="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          <span>Extrações & Relatórios SSOT</span>
        </button>
```

---

### Passo 4: Sub-abas de Navegação do Painel de Indicadores
Em `index.html` (~linhas 4445-4475):

**Antes:**
```html
        <button type="button" class="indicators-icon-tab-btn indicators-subtab-pill active" id="pillIndKpis" onclick="switchIndicatorsSubTab('kpis')" title="Painel Decisório da Rede e Metas" aria-label="Visão Geral">
          <span class="tab-icon">📊</span>
          <span class="tab-text" id="pillIndKpisLabel">Visão Geral</span>
        </button>
        <button type="button" class="indicators-icon-tab-btn indicators-subtab-pill" id="pillIndLongitudinal" onclick="switchIndicatorsSubTab('longitudinal')" title="Acompanhamento Longitudinal e Semáforo Bimestral" aria-label="Acompanhamento Longitudinal">
          <span class="tab-icon">🚦</span>
          <span class="tab-text" id="pillIndLongitudinalLabel">Acompanhamento Longitudinal</span>
        </button>
        <button type="button" class="indicators-icon-tab-btn indicators-subtab-pill" id="pillIndDrilldown" onclick="switchIndicatorsSubTab('drilldown')" title="Visualização por Dimensão" aria-label="Visualização por Dimensão">
          <span class="tab-icon">🔍</span>
          <span class="tab-text" id="pillIndDrilldownLabel">Visualização por Dimensão</span>
        </button>
```

**Depois:**
```html
        <button type="button" class="indicators-icon-tab-btn indicators-subtab-pill active" id="pillIndKpis" onclick="switchIndicatorsSubTab('kpis')" title="Painel Decisório da Rede e Metas" aria-label="Visão Geral">
          <svg class="tab-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          <span class="tab-text" id="pillIndKpisLabel">Visão Geral</span>
        </button>
        <button type="button" class="indicators-icon-tab-btn indicators-subtab-pill" id="pillIndLongitudinal" onclick="switchIndicatorsSubTab('longitudinal')" title="Acompanhamento Longitudinal e Semáforo Bimestral" aria-label="Acompanhamento Longitudinal">
          <svg class="tab-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          <span class="tab-text" id="pillIndLongitudinalLabel">Acompanhamento Longitudinal</span>
        </button>
        <button type="button" class="indicators-icon-tab-btn indicators-subtab-pill" id="pillIndDrilldown" onclick="switchIndicatorsSubTab('drilldown')" title="Visualização por Dimensão" aria-label="Visualização por Dimensão">
          <svg class="tab-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <span class="tab-text" id="pillIndDrilldownLabel">Visualização por Dimensão</span>
        </button>
```

---

### Passo 5: Botões de Ação na Gestão da Rede (Unidades, Servidores e Backup)
Em `index.html` (~linhas 3650-3655 e 3778-3783):

**Antes (Aba Unidades):**
```html
        <button class="btn btn-secondary" onclick="exportUnitsCSV()">💾 Exportar UEs (CSV)</button>
        <button class="btn btn-secondary" onclick="exportUnitsJSON()">📄 Exportar UEs (JSON)</button>
        <button class="btn btn-secondary" onclick="downloadUnitsCsvTemplate()">📥 Baixar Modelo (CSV)</button>
        <button class="btn btn-secondary" onclick="triggerUnitsCsvImport()">📤 Importar CSV</button>
```

**Depois (Aba Unidades):**
```html
        <button class="btn btn-secondary" onclick="exportUnitsCSV()">
          <svg class="btn-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Exportar UEs (CSV)
        </button>
        <button class="btn btn-secondary" onclick="exportUnitsJSON()">
          <svg class="btn-icon" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          Exportar UEs (JSON)
        </button>
        <button class="btn btn-secondary" onclick="downloadUnitsCsvTemplate()">
          <svg class="btn-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Baixar Modelo (CSV)
        </button>
        <button class="btn btn-secondary" onclick="triggerUnitsCsvImport()">
          <svg class="btn-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Importar CSV
        </button>
```

*(Idem para a Aba Servidores ~linhas 3778-3783, substituindo 💾, 📄, 📥 e 📤 pelos mesmos pictogramas vetoriais).*

**Na Aba de Backup SSOT (~linhas 3855-3865):**
**Antes:**
```html
              <button class="btn" style="background:#166534; color:#fff;" onclick="exportFullBaseJSON()">
                💾 Exportar Base Completa (.JSON)
              </button>
              <button class="btn" style="background:#DC2626; color:#fff;" onclick="triggerImportFullBase()">
                📂 Importar / Sobrescrever (.JSON)
              </button>
```

**Depois:**
```html
              <button class="btn" style="background:#166534; color:#fff;" onclick="exportFullBaseJSON()">
                <svg class="btn-icon" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                Exportar Base Completa (.JSON)
              </button>
              <button class="btn" style="background:#DC2626; color:#fff;" onclick="triggerImportFullBase()">
                <svg class="btn-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Importar / Sobrescrever (.JSON)
              </button>
```

---

### Passo 6: Botões de Ação no Histórico e Registros Formativos
Em `index.html` (~linhas 4505-4515 e 4618-4628):

**Antes (Histórico):**
```html
          <div class="history-actions-grid">
            <button class="btn btn-secondary history-action-btn" onclick="exportHistoryFilteredCSV()" title="Exportar observações visíveis em CSV">
              📥 CSV
            </button>
            <button class="btn btn-secondary history-action-btn" onclick="exportHistoryFilteredPDF()" title="Imprimir ou salvar observações visíveis em PDF">
              📄 PDF
            </button>
            <button class="btn btn-secondary history-action-btn history-archive-btn" onclick="archiveAllOldObservations()" id="btnArchiveOldObs" title="Arquivar observações concluídas registradas há 4 dias ou mais">
              📦 Auto-Arquivar
            </button>
          </div>
```

**Depois (Histórico):**
```html
          <div class="history-actions-grid">
            <button class="btn btn-secondary history-action-btn" onclick="exportHistoryFilteredCSV()" title="Exportar observações visíveis em CSV">
              <svg class="btn-icon-sm" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              CSV
            </button>
            <button class="btn btn-secondary history-action-btn" onclick="exportHistoryFilteredPDF()" title="Imprimir ou salvar observações visíveis em PDF">
              <svg class="btn-icon-sm" viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              PDF
            </button>
            <button class="btn btn-secondary history-action-btn history-archive-btn" onclick="archiveAllOldObservations()" id="btnArchiveOldObs" title="Arquivar observações concluídas registradas há 4 dias ou mais">
              <svg class="btn-icon-sm" viewBox="0 0 24 24"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              Auto-Arquivar
            </button>
          </div>
```

**Antes (Limpar Filtros do Histórico ~linha 4585):**
```html
          <button class="btn btn-secondary" style="width:100%; padding:10px; font-weight:700;" onclick="resetHistoryFilters()">
            🔄 Limpar Filtros
          </button>
```

**Depois (Limpar Filtros do Histórico):**
```html
          <button class="btn btn-secondary" style="width:100%; padding:10px; font-weight:700;" onclick="resetHistoryFilters()">
            <svg class="btn-icon" viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
            Limpar Filtros
          </button>
```

*(Idem para a barra de ações de Registros Formativos ~linhas 4618-4628: CSV, PDF e Arquivar Resolvidas).*

---

### Passo 7: Botões de Ação em Matrizes de Referência / Rubricas
Em `index.html` (~linhas 4820-4830):

**Antes:**
```html
          <button class="btn btn-secondary" onclick="openRefDocsModal()" title="Consultar, baixar ou atualizar as matrizes oficiais em PDF">📑 Matrizes Oficiais (PDF / Upload)</button>
          <button class="btn btn-secondary" onclick="exportRubricsCSV()">💾 Exportar (CSV)</button>
          <button class="btn btn-secondary" onclick="exportRubricsJSON()">📄 Exportar (JSON)</button>
          <button class="btn btn-secondary" onclick="triggerImportRubricsJSON()" title="Importar arquivo JSON com nova estrutura de rubricas">📥 Importar (JSON)</button>
          <button class="btn btn-secondary" onclick="setCustomDefaultRubricsPrompt()" id="btnSetNewDefaultRubrics" title="Salvar as rubricas atuais como o padrão oficial da rede">⭐ Definir Novo Padrão</button>
          <button class="btn btn-secondary" onclick="restoreDefaultRubricsPrompt()" id="btnRestoreRubrics" title="Restaurar parâmetros da rede ou de fábrica">↺ Restaurar Padrão</button>
```

**Depois:**
```html
          <button class="btn btn-secondary" onclick="openRefDocsModal()" title="Consultar, baixar ou atualizar as matrizes oficiais em PDF">
            <svg class="btn-icon" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            Matrizes Oficiais (PDF / Upload)
          </button>
          <button class="btn btn-secondary" onclick="exportRubricsCSV()">
            <svg class="btn-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Exportar (CSV)
          </button>
          <button class="btn btn-secondary" onclick="exportRubricsJSON()">
            <svg class="btn-icon" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            Exportar (JSON)
          </button>
          <button class="btn btn-secondary" onclick="triggerImportRubricsJSON()" title="Importar arquivo JSON com nova estrutura de rubricas">
            <svg class="btn-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Importar (JSON)
          </button>
          <button class="btn btn-secondary" onclick="setCustomDefaultRubricsPrompt()" id="btnSetNewDefaultRubrics" title="Salvar as rubricas atuais como o padrão oficial da rede">
            <svg class="btn-icon" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            Definir Novo Padrão
          </button>
          <button class="btn btn-secondary" onclick="restoreDefaultRubricsPrompt()" id="btnRestoreRubrics" title="Restaurar parâmetros da rede ou de fábrica">
            <svg class="btn-icon" viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
            Restaurar Padrão
          </button>
```

---

### Passo 8: Botões do Menu Flutuante da Observação (FAB Speed Dial)
Em `index.html` (~linhas 4914-4932):

**Antes:**
```html
      <button class="fab-menu-item" onclick="handleFabSaveDraft()">
        <span class="fab-menu-icon" style="background:#EFF6FF; color:#2563EB;">💾</span>
        <div>
          <div class="fab-menu-title">Salvar Rascunho</div>
          <div class="fab-menu-desc">Salva o progresso e retorna à tela inicial</div>
        </div>
      </button>
      <button class="fab-menu-item" onclick="handleFabNote()">
        <span class="fab-menu-icon" style="background:#FEF3C7; color:#D97706;">📝</span>
        <div>
          <div class="fab-menu-title">Ocorrência de Campo</div>
          <div class="fab-menu-desc">Registrar apontamento qualitativo desta observação</div>
        </div>
      </button>
      <button class="fab-menu-item danger" onclick="handleFabExitWithoutSaving()">
        <span class="fab-menu-icon" style="background:#FEE2E2; color:#DC2626;">🚪</span>
        <div>
          <div class="fab-menu-title" style="color:#DC2626;">Sair sem Salvar</div>
          <div class="fab-menu-desc">Descarta alterações não salvas desta sessão</div>
        </div>
      </button>
```

**Depois:**
```html
      <button class="fab-menu-item" onclick="handleFabSaveDraft()">
        <span class="fab-menu-icon" style="background:#EFF6FF; color:#2563EB;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
        </span>
        <div>
          <div class="fab-menu-title">Salvar Rascunho</div>
          <div class="fab-menu-desc">Salva o progresso e retorna à tela inicial</div>
        </div>
      </button>
      <button class="fab-menu-item" onclick="handleFabNote()">
        <span class="fab-menu-icon" style="background:#FEF3C7; color:#D97706;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        </span>
        <div>
          <div class="fab-menu-title">Ocorrência de Campo</div>
          <div class="fab-menu-desc">Registrar apontamento qualitativo desta observação</div>
        </div>
      </button>
      <button class="fab-menu-item danger" onclick="handleFabExitWithoutSaving()">
        <span class="fab-menu-icon" style="background:#FEE2E2; color:#DC2626;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </span>
        <div>
          <div class="fab-menu-title" style="color:#DC2626;">Sair sem Salvar</div>
          <div class="fab-menu-desc">Descarta alterações não salvas desta sessão</div>
        </div>
      </button>
```

---

### Passo 9: Botões de Ação Dinâmicos em Linhas de Tabelas e Cards
Nas funções JavaScript de renderização (`renderScheduleScreen`, `renderUnitsScreen`, `renderRubricsScreen`, `renderNotesScreen`):

1. **Botão Excluir Agendamento (`#btnDeleteScheduleModal` ~linha 7791):**
   - Substituir `🗑️ Excluir Agendamento` por `<svg class="btn-icon" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg> Excluir Agendamento`.

2. **Botões Editar e Excluir do Cronograma (`renderScheduleScreen` ~linhas 15195-15245):**
   - Substituir `✏️ Editar` por `<svg class="btn-icon-sm" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Editar`.
   - Substituir `🗑️ Excluir` por `<svg class="btn-icon-sm" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg> Excluir`.
   - Substituir `📋 Devolutiva` / `📋 Ver Devolutiva` por `<svg class="btn-icon-sm" viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg> Devolutiva`.

3. **Botão Editar Polo Regional (`renderUnitsScreen` ~linha 16400):**
   - Substituir `✏️ Editar` por `<svg class="btn-icon-sm" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Editar`.

4. **Botões de Edição da Árvore de Rubricas (`renderRubricsScreen` ~linhas 22440-22520):**
   - Substituir `➕ Inserir Antes` por `<svg class="btn-icon-sm" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Inserir Antes`.
   - Substituir `✏️ Renomear` por `<svg class="btn-icon-sm" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Renomear`.
   - Substituir `➕ Subdimensão` por `<svg class="btn-icon-sm" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Subdimensão`.
   - Substituir `➕ Adicionar Item` por `<svg class="btn-icon-sm" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Adicionar Item`.
   - Substituir `🗑️ Excluir` por `<svg class="btn-icon-sm" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg> Excluir`.

5. **Botão de Exportação em PDF na Síntese (`exportSynthesisToPdf` ~linha 4165 e 13250):**
   - Substituir `🖨️ Exportar em PDF` por `<svg class="btn-icon" viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg> Exportar em PDF`.

6. **Botão Anexar Foto na Observação (`triggerPhotoUpload` ~linha 12200):**
   - Substituir `📷 Anexar Foto` por `<svg class="btn-icon-sm" viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg> Anexar Foto`.

---

## 4. Critérios de Aceite e Roteiro de Teste

### 4.1 Critérios de Aceite
1. **Zero Emojis nos Botões Principais:** Nenhum dos botões de cabeçalho, sub-abas de navegação, ações de dados, ações de tabela e menus de observação deve exibir emojis Unicode. Todos devem exibir seus respectivos pictogramas vetoriais SVG monocromáticos.
2. **Harmonia e Alinhamento Visual:** Os pictogramas devem estar verticalmente alinhados com os rótulos de texto de cada botão, sem distorção, sem overflow e respeitando a cor de texto ativa via `currentColor`.
3. **Integridade de Funcionalidades:** Todas as rotas, cliques, aberturas de modal, downloads de arquivos e persistência de dados continuam funcionando exatamente como antes.
4. **Validação Sintática Absoluta:** O arquivo `index.html` deve ser validado via motor `JavaScriptCore` sem acusar nenhum erro léxico ou sintático (`python3 audit_platform.py --check-syntax`).
5. **Espelhamento Fiel:** O arquivo `firebase_deploy/public/index.html` deve ser sincronizado com o mesmo conteúdo integral do `index.html`.

### 4.2 Roteiro de Teste do Operário
1. Executar `python3 audit_platform.py --check-syntax` e verificar a saída de sucesso.
2. Criar o backup intermediário em `intermediárias/aplicativo_v[N]_substituicao_emojis_por_pictogramas.html`.
3. Atualizar o Changelog no `CHANGELOG.md` e no `#modalChangelog` / botão `.btn-changelog` do `index.html`.
4. Sincronizar em `firebase_deploy/public/index.html`.
5. Fazer commit e push.
6. Executar a auditoria pós-deploy: `python3 audit_platform.py --silent-on-success`.

---

## 5. Seção Obrigatória de Auditoria (`audit_platform.py` e testes do `index.html`)

### 5.1 Alterações / Adições / Exclusões no `audit_platform.py`
- **Nenhuma alteração necessária no script `audit_platform.py`**. O motor de auditoria em Python apenas orquestra o Google Chrome headless e verifica a chegada do payload `/__test_report__`.

### 5.2 Alterações nas Asserções de Testes In-App em `index.html`
- A suíte de testes in-app de `index.html` (linhas 23000-26300) foi exaustivamente inspecionada:
  1. A asserção do Changelog (L26166) utiliza `btnChangelog.textContent.includes('Versão 1.28')`, a qual é plenamente compatível com o novo rótulo com SVG.
  2. As asserções dos botões de exportação e sub-abas pesquisam IDs específicos (`#deskTabHome`, `#pillIndKpis`, `#pillIndLongitudinal`, `#pillIndDrilldown`, `#btnExportIndicatorsView`), que permanecem 100% inalterados.
  3. **Nota sobre Chips Semafóricos do Pilar 10 (L25677 e L25700):** As asserções `overdueSec.innerHTML.includes('🔴 Atrasadas')` e `overdueTeacherDom.innerHTML.includes('🔴 Com Atraso')` testam os chips de filtro rápido de status do semáforo. Como este plano foca categoricamente nos botões de ação e navegação e preserva os marcadores de status semafórico, nenhuma quebra ou ajuste léxico será introduzido nessas asserções.
