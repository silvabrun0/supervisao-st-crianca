# PLANO DE IMPLEMENTAÇÃO: PILAR 11 - ENXUGAMENTO VISUAL NO MOBILE: POP-UPS E TOOLTIPS DE APOIO ÀS RUBRICAS (`ℹ️`)

> **DIRETRIZ OBRIGATÓRIA DE EXECUÇÃO (ETAPA 2):**
> O assistente executor (Etapa 2) deve **obrigatoriamente ler e seguir as diretrizes dos arquivos `WORKFLOW_MACOS.md`, `WORKFLOW_GITHUB.md` e `AGENTS.md`** localizados na raiz do projeto antes de aplicar qualquer modificação no código. Nenhuma modificação deve ser realizada sem conformidade estrita com o workflow, incluindo:
> 1. Execução prévia de sincronização com o repositório remoto (`git pull origin main`).
> 2. Preservação integral de todas as regras de negócio consolidadas, dados cadastrais, blindagens RBAC, série histórica, ciclo longitudinal, turmas integrais (Pilar 4), fechamento nominal com justificativa parcial (Pilar 5), higienização terminológica para "observação" (Pilar 6), KPIs decisórios (Pilar 7), foco nos menores índices e gargalos (Pilar 8), popup mobile de filtros em bottom sheet (Pilar 9), semáforo bimestral de turmas e docentes regentes (Pilar 10) e integridade dos testes automatizados.
> 3. Verificação de integridade pós-edição com dupla checagem de leitura em cada trecho modificado.
> 4. Salvamento obrigatório do backup intermediário na pasta `intermediárias/` sob o nome `aplicativo_v110_pilar_11_popups_rubricas_apoio_mobile.html`.
> 5. Gestão dupla de Changelog no arquivo `CHANGELOG.md` e no modal `#modalChangelog` do `index.html`, registrando a **Versão 1.10 (ou v7.89)**.
> 6. Sincronização idêntica entre o arquivo principal `index.html` da raiz, `gestor supervisao_patos/index.html` e `gestor supervisao_patos/firebase_deploy/public/index.html`.
> 7. Checagem pré-push (`git fetch origin main`), commit semântico (`feat: implementar pilar 11 - enxugamento visual mobile com popups e bottom sheet de apoio as rubricas i (v1.10)`), push para `origin main` e deploy automático no GitHub Pages.
> 8. Execução pós-deploy obrigatória do algoritmo de auditoria (`python3 audit_platform.py --silent-on-success`) com comunicação estrita e exclusiva a problemas/falhas.

---

## 1. Diagnóstico e Contexto Técnico-Pedagógico

### 1.1 Cenário Atual
Após a homologação dos Pilares 1 a 10 do Sistema de Supervisão Pedagógica **SerTão Criança**:
- O sistema opera com a **TURMA** como unidade central de análise e acompanhamento na Educação Infantil (Pilar 1);
- Estabeleceu a governança em 3 níveis com a Coordenadora do Núcleo de EI como autoridade central máxima (Pilar 2);
- Implementou o benchmark comparativo `% da UE vs. Rede` na sub-aba de Afunilamento (Pilar 3);
- Consolidou o formulário único de 2 etapas para turmas integrais (Pilar 4);
- Garantiu o fechamento nominal docente, parecer em práticas consistentes e justificativa em itens parciais (Pilar 5);
- Higienizou 100% dos fluxos e telas banindo o vocábulo policialesco "visita" em favor de "observação" (Pilar 6);
- Reorganizou os KPIs decisórios no topo do Painel de Indicadores com destaque para a Cobertura de Turmas no Bimestre Corrente (Pilar 7);
- Criou o Bloco de Diagnóstico de Gargalos "Foco nos Menores Índices" com ordenação dinâmica (Pilar 8);
- Liberou 100% da altura útil do viewport na aba de Indicadores no celular através do gatilho flutuante e bottom sheet de filtros (Pilar 9);
- Implementou o Quadro de Controle Bimestral com Semáforo Canônico de Prazos tanto para Turmas quanto para Docentes Regentes (Pilar 10).

Contudo, na experiência de uso em dispositivos móveis (**smartphones**), o formulário de preenchimento da observação ativa em sala (`#screenActiveObs`) e a visualização detalhada de critérios na sub-aba de Afunilamento (`#screenIndicators` / `drilldown`) ainda apresentam um gargalo ergonômico de alta densidade:
1. **Sobrecarga Textual e Poluição Visual no Smartphone:**  
   Vários critérios das matrizes pedagógicas possuem enunciados longos e carregados com exemplos práticos extensos, orientações de rotina, listas de materiais entre parênteses e instruções metodológicas embutidas diretamente no corpo do texto.  
   *Exemplos Reais da Matriz:*
   - Critério `1.3.1`: *"Práticas que promovem expressão e comunicação (práticas relacionadas à oralidade, leitura, registros gráficos - desenhos, garatujas, letras, palavras, nome, textos coletivos, etc.)"*
   - Critério `2.1.6`: *"A área externa é utilizada pelo menos por 30 minutos. (Aqui fazer observação das UE que contém apenas uma área externa)"*
   - Critério `2.3.3`: *"Há cartazes/painéis na parede na altura das crianças com intenção de retomar rotinas, registros e combinados feitos com elas. (Rotina, Calendário, Chamadinha, Palavras do Cotidiano, Alfabetos, Números)"*
   - Critério `2.3.4`: *"Os materiais estão acessíveis às crianças e são utilizados com intenção pedagógica (riscadores, pinceis, tintas, materiais não estruturados, brinquedos, blocos lógicos, alfabetos e números móveis), de forma variada, e favorecem a criação por parte das crianças."*
   - Critério `4.2.4`: *"Promove discussões e reflexões que fortalecem o respeito às diferenças, a empatia e o pensamento crítico, reconduzindo de forma educativa e acolhedora comportamentos discriminatórios e incentivando atitudes respeitosas"*
   - Critério `4.4.1`: *"Verifica o espaço antes da chegada das crianças, retirando ou (re)posicionando objetos perigosos ou inadequados. (Tapetes, cadeiras e brinquedos de forma a evitar tropeços e escorregões.)"*
2. **Compressão Vertical e Fadiga de Rolagem (*Scroll Fatigue*):**  
   Em telas de celulares (360px a 414px de largura útil), cada um desses critérios ocupa entre 5 e 8 linhas de texto somente no enunciado. Somando o enunciado, a escala de 4 botões de pontuação, o bloco de atribuição mandatória parcial (Pilar 5), o botão de foto e o campo de texto de evidências, a altura de cada card de critério (`.crit-card`) atinge facilmente 260px a 340px. Em uma subdimensão com 6 critérios, a coordenadora pedagógica — que frequentemente realiza a observação em pé ou circulando pela sala de aula — é forçada a rolar mais de 2.000 pixels para conseguir preencher e revisar os itens.
3. **Ausência de Suporte Formativo sob Demanda:**  
   Se por um lado o texto longo sobrecarrega a tela, por outro lado a coordenadora ou formadora necessita, em momentos pontuais de dúvida avaliativa, de orientações pedagógicas claras sobre *o que observar concretamente na sala* e *como graduar as evidências* entre Consistente e Parcial de acordo com as diretrizes do programa SerTão Criança. Misturar o texto orientador denso com o enunciado operacional prejudica tanto a leitura rápida quanto o aprofundamento formativo.

---

### 1.2 Fundamentação Técnico-Pedagógica (Deliberação ST Criança / Documento Oficial de Insights)
Conforme deliberado na Reunião ST Criança de 19 de Outubro de 2026 (timestamp 00:24:26) e formalmente registrado no documento oficial `docs/documento_insights_supervisao_pedagogica_20261020.md`:
> **PILAR 11: Enxugamento Visual no Mobile: Pop-ups / Tooltips de Apoio (`ℹ️`)**  
> * **Diretriz Aprovada (00:24:26):**  
>   Ocultação de textos extensos de orientações das rubricas no celular. Inserção de ícone informativo discreto (`ℹ️`) que abre modal/tooltip sob demanda.

A diretriz canônica estabelece:
1. **Enxugamento do Fluxo Operacional:** O cartão de observação deve apresentar o núcleo conciso e imediato da prática pedagógica a ser avaliada.
2. **Apoio Sob Demanda via Ícone Informativo (`ℹ️`):** O usuário tem acesso, com um único toque, a um Pop-up / Bottom Sheet moderno e rico em informações pedagógicas (`#modalRubricGuidance`), exibindo a hierarquia da dimensão, evidências práticas observáveis no chão da sala de aula e a gradação da escala (Consistente vs. Parcial vs. Não Realizado).
3. **Ergonomia e Alta Densidade:** O smartphone ganha amplitude visual e redução de mais de 40% na rolagem vertical, permitindo uma rotina de observação muito mais ágil, agradável e profissional.

---

### 1.3 Resultado Esperado com o Pilar 11
1. **Cards de Critério Compactos e Fluídos no Smartphone:**  
   No celular, o enunciado do critério é apresentado de forma limpa, direta e sem trechos entre parênteses quilométricos. O espaço vertical é otimizado, permitindo visualizar múltiplos critérios na tela simultaneamente.
2. **Gatilho Informativo Tátil e Acessível (`ℹ️`):**  
   Inserção de um botão discreto e elegante com o ícone informativo `ℹ️` no cabeçalho de cada critério (`.crit-top`) na tela de Observação Ativa (`#screenActiveObs`), com área de toque mínima acessível de 36px e feedback visual ao toque.
3. **Modal / Bottom Sheet Deslizante de Apoio Pedagógico (`#modalRubricGuidance`):**  
   Ao clicar/tocar no ícone `ℹ️`, abre-se instantaneamente um modal tátil deslizante (Bottom Sheet no mobile e modal central no desktop) estruturado com:
   - **Cabeçalho Hierárquico:** `Dimensão › Subdimensão › Item [ID]`;
   - **Enunciado Oficial Completo:** O texto canônico integral da prática avaliada;
   - **Card de Orientações Práticas de Observação:** O que a coordenadora deve observar no ambiente educativo e nas interações entre educadores e crianças;
   - **Card de Evidências Concretas & Exemplos:** Exemplos de materiais, posturas, linguagens e dinâmicas esperadas;
   - **Régua Formativa de Gradação da Escala:** Critérios objetivos para distinção entre Consistente, Parcial, Não Realizado e Não se Aplica;
   - **Botão de Retorno Rápido:** `"Entendido / Fechar"` para fechar com 1 toque sem perder a posição do preenchimento.
4. **Extensão Harmonizada à Sub-aba de Afunilamento (`drilldown`):**  
   No Afunilamento de Indicadores (`#screenIndicators`), onde cada critério exibe o benchmark `% UE vs. Rede Patos`, o mesmo ícone `ℹ️` é disponibilizado discretamente ao lado do ID do critério. No mobile, isso evita que o título do critério quebre em 6 linhas antes das réguas e barras de distribuição.
5. **Dicionário Canônico de Apoio Pedagógico (`RUBRIC_GUIDANCE_DB`):**  
   Mapeamento integral e determinístico de orientações e evidências para todos os 46 critérios de professores e 23 critérios de coordenadores do SerTão Criança de Patos, persistido nativamente na aplicação sem requisições de rede externas.
6. **Integração com a Gestão de Rubricas (`#screenRubricsAdmin`):**  
   Exibição e suporte à edição de orientações pedagógicas (`guidance`) na aba de Administração de Rubricas, garantindo que o Núcleo de EI possa expandir as orientações quando atualizar matrizes JSON.
7. **Preservação de 100% da Cobertura de Testes Automatizados:**  
   Garantia de aprovação total de todas as asserções da plataforma no `audit_platform.py` e testes modulares internos.

---

## 2. Arquitetura e Mapeamento de Pontos de Impacto

### 2.1 Arquivos Afetados
```
gestor supervisao_patos/
├── index.html                                                                                  # Aplicação servida em produção (GitHub Pages)
├── firebase_deploy/public/index.html                                                           # Cópia espelhada obrigatória
├── audit_platform.py                                                                           # Motor de auditoria modular da plataforma
├── CHANGELOG.md                                                                                # Histórico oficial de versões
├── docs/documento_insights_supervisao_pedagogica_20261020.md                                   # Atualização de status do Pilar 11
└── intermediárias/aplicativo_v110_pilar_11_popups_rubricas_apoio_mobile.html                   # Backup intermediário da Versão 1.10
```

### 2.2 Mapeamento por Módulo Funcional

| Módulo / Tela | Elemento / Função | Localização Estimada em `index.html` | Ação de Alteração |
| :--- | :--- | :---: | :--- |
| **Estilos CSS Mobile / UI** | Classes `.btn-rubric-info`, `.modal-guidance-*`, Bottom Sheet | Bloco de estilos CSS (~linhas 510-600 e ~1380-1430) | Adicionar classes para o botão `ℹ️`, cards de orientação, badge de hierarquia e comportamento responsivo de Bottom Sheet |
| **Markup do Modal HTML** | Estrutura `#modalRubricGuidance` | Bloco de modais (~linha 6670) | Inserir a estrutura HTML do modal de apoio pedagógico com backdrop, painel deslizante, cabeçalho e contêineres de conteúdo |
| **Base de Orientações Pedagógicas** | Objeto `RUBRIC_GUIDANCE_DB` e helper `getCriterionGuidance()` | Início do script JS (~linha 7235 / repositório de rubricas) | Criar o dicionário canônico com dados formativos de todos os 46 critérios de docentes e 23 de coordenadores |
| **Helper de Formatação Mobile** | Função `formatCriterionMobileTitle()` e `getCriterionDetails()` | Helpers de rubricas (~linha 7490) | Implementar helpers de extração do núcleo conciso do critério e detalhamento completo para o pop-up |
| **Cards de Observação Ativa** | Função `renderCriterionCard(crit, obsInstance)` | Linhas ~10373 a 10512 | Injetar o botão `ℹ️` no `.crit-top` e aplicar título conciso no mobile com retenção do texto integral para o pop-up |
| **Controladores JS do Modal** | Funções `openRubricGuidanceModal()` e `closeRubricGuidanceModal()` | Bloco de navegação e modais (~linha 8900) | Implementar abertura dinâmica, injeção dos dados da rubrica e fechamento com animação suave |
| **Sub-aba de Afunilamento (Pilar 3)** | Renderização de critérios em `renderIndicatorsScreen()` | Linhas ~17620 a 17656 | Adicionar ícone `ℹ️` interativo ao lado de `<strong>[${crit.id}]</strong>` para consulta rápida no afunilamento |
| **Gestão de Rubricas (Admin)** | Renderização de cards em `renderRubricsAdminScreen()` | Linhas ~18920 a 19100 | Incluir exibição e edição de orientações pedagógicas complementares nos cards de administração de rubricas |
| **Engine de Testes do Browser** | Módulo 4: `rubricas_observacao` em `runFullPlatformAudit()` | Linhas ~20150 a 20216 | Adicionar asserções estritas do Pilar 11 (botão `ℹ️`, abertura e fechamento do `#modalRubricGuidance`, integridade do payload e teste de enxugamento mobile) |
| **Script CLI de Auditoria** | Catálogo `MODULE_CATALOG['rubricas_observacao']` em `audit_platform.py` | Linha 26 | Atualizar descrição oficial do Módulo 4 para registrar o Pilar 11 |
| **Changelog Duplo** | `CHANGELOG.md` e modal `#modalChangelog` em `index.html` | Topo do log e linhas ~4815 | Registrar a entrega da Versão 1.10 com o resumo executivo |

---

### 2.3 Comparativo Visual: Experiência Mobile Antes vs. Depois do Pilar 11

```
┌─────────────────────────────────────────────────────────┐   ┌─────────────────────────────────────────────────────────┐
│              ANTES (POLUIÇÃO E ROLAGEM LONGA)           │   │              DEPOIS (PILAR 11: ENXUGADO & APOIO ℹ️)     │
├─────────────────────────────────────────────────────────┤   ├─────────────────────────────────────────────────────────┤
│ [1.3.1] Práticas que promovem expressão e comunicação   │   │ [1.3.1] Práticas que promovem expressão    [ ℹ️ Apoio ] │
│ (práticas relacionadas à oralidade, leitura, registros  │   │         e comunicação                       [Item 1.3.1]│
│ gráficos - desenhos, garatujas, letras, palavras, nome, │   │ ┌───────────┬───────────┬───────────┬───────────┐     │
│ textos coletivos, etc.)                    [Item 1.3.1] │   │ │Consistente│  Parcial  │Não Realiz.│Não se Apl.│     │
│ ┌───────────┬───────────┬───────────┬───────────┐       │   │ └───────────┴───────────┴───────────┴───────────┘     │
│ │Consistente│  Parcial  │Não Realiz.│Não se Apl.│       │   │ [📷 Anexar Foto]  [Descreva a evidência...]           │
│ └───────────┴───────────┴───────────┴───────────┘       │   │                                                         │
│                                                         │   │ ─── 45% Menos Altura! Rápido de Preencher ────────────  │
│ [📷 Anexar Foto]                                        │   │                                                         │
│ [Descreva a evidência ou observação pontual...]         │   │  Ao tocar no botão [ ℹ️ Apoio ]:                        │
│                                                         │   │  ╔═══════════════════════════════════════════════════╗  │
│ ─── Card ocupa 280px! Rolagem exaustiva ─────────────── │   │  ║ 📌 Dimensão 1 · Estratégias › Subdimensão 1.3     ║  │
│                                                         │   │  ║ Critério 1.3.1: Práticas que promovem expressão   ║  │
│ [2.1.6] A área externa é utilizada pelo menos por 30    │   │  ║                                                   ║  │
│ minutos. (Aqui fazer observação das UE que contém       │   │  ║ 💡 O QUE OBSERVAR NA SALA:                        ║  │
│ apenas uma área externa)                   [Item 2.1.6] │   │  ║ Oralidade, garatujas, registros gráficos, letras, ║  │
│ ...                                                     │   │  ║ cantos de desenho, textos coletivos e livros.     ║  │
│                                                         │   │  ║                                                   ║  │
│                                                         │   │  ║ 🚦 RÉGUA FORMATIVA (Consistente vs Parcial)       ║  │
│                                                         │   │  ║ [✓ Entendido / Fechar]                            ║  │
│                                                         │   │  ╚═══════════════════════════════════════════════════╝  │
└─────────────────────────────────────────────────────────┘   └─────────────────────────────────────────────────────────┘
```

---

## 3. Especificação Técnica Detalhada

### 3.1 Dicionário Canônico de Apoio Pedagógico (`RUBRIC_GUIDANCE_DB`)
Criação de um repositório padronizado com os metadados pedagógicos dos critérios, fornecendo evidências concretas, diretrizes formativas e gradação da escala:

```javascript
const RUBRIC_GUIDANCE_DB = {
  // --- ESTRATÉGIAS DIDÁTICAS ---
  '1.1.1': {
    dimKey: 'estrategias',
    dimTitle: '1. Estratégias Didáticas',
    subTitle: '1.1 Ampliação de Repertório',
    shortTitle: 'Realiza leitura ou contação de histórias',
    whatToObserve: 'Verificar se o docente realiza a mediação de leitura ou contação de histórias com entonação, expressividade, exploração das ilustrações e interação com o grupo.',
    examples: 'Leitura em roda, livros ao alcance das crianças, contação com fantoches, pausas intencionais para ouvir as impressões das crianças.',
    scaleGuidance: {
      consistent: 'Leitura planejada, com mediação ativa, escuta atenta das crianças e conexão com a proposta pedagógica.',
      partial: 'Leitura mecânica, sem exploração das imagens, sem interação com as crianças ou restrita a mero passatempo.',
      not_done: 'Nenhum momento de leitura ou contação de história foi proporcionado durante todo o período observado.'
    }
  },
  '1.1.2': {
    dimKey: 'estrategias',
    dimTitle: '1. Estratégias Didáticas',
    subTitle: '1.1 Ampliação de Repertório',
    shortTitle: 'Faz uso de perguntas abertas',
    whatToObserve: 'Avaliar se o professor formula questionamentos que instiguem o raciocínio, a curiosidade e o diálogo reflexivo, em vez de perguntas com respostas sim/não ou fechadas.',
    examples: '"O que vocês acham que vai acontecer agora?", "Como podemos resolver isso?", "Por que você escolheu essa cor?".',
    scaleGuidance: {
      consistent: 'Perguntas instigantes constantes, esperando o tempo de resposta da criança e valorizando suas hipóteses.',
      partial: 'Predomínio de perguntas retóricas ou fechadas (onde o professor dá a resposta ou exige respostas monossilábicas).',
      not_done: 'Comunicação predominantemente unidirecional, sem questionamentos às crianças.'
    }
  },
  '1.3.1': {
    dimKey: 'estrategias',
    dimTitle: '1. Estratégias Didáticas',
    subTitle: '1.3 Tipos de Práticas Pedagógicas',
    shortTitle: 'Práticas que promovem expressão e comunicação',
    whatToObserve: 'Observar a diversidade de oportunidades de expressão oral, gráfica e corporal proporcionadas às crianças.',
    examples: 'Rodas de conversa diárias, cantos com materiais para desenho livre, garatujas, escrita espontânea de nomes, cartazes coletivos com falas registradas.',
    scaleGuidance: {
      consistent: 'Ambiente rico em manifestações expressivas autênticas das crianças, com acolhimento à oralidade e registros próprios.',
      partial: 'Atividades limitadas a folhas xerocadas pré-impressas para colorir dentro de limites rígidos sem expressão livre.',
      not_done: 'Ausência de oportunidades expressivas na rotina da turma.'
    }
  },
  '2.1.6': {
    dimKey: 'gestao_grupo',
    dimTitle: '2. Gestão do Grupo',
    subTitle: '2.1 Tempo e Rotina',
    shortTitle: 'Uso da área externa por pelo menos 30 minutos',
    whatToObserve: 'Verificar a garantia do tempo diário de vivências ao ar livre e no pátio externo para brincadeiras e exploração corporal.',
    examples: 'Parquinho, áreas verdes, pátio descoberto, circuitos motores, exploração de elementos naturais (terra, folhas, gravetos).',
    scaleGuidance: {
      consistent: 'Crianças permanecem na área externa por pelo menos 30 min com supervisão atenta e interações estimulantes. (Nas UEs com área única, respeita-se o revezamento estruturado).',
      partial: 'Tempo externo reduzido a menos de 20 minutos ou sem intencionalidade/mediação pedagógica do docente.',
      not_done: 'Turma não saiu da sala de aula durante todo o período da observação.'
    }
  },
  '2.3.4': {
    dimKey: 'gestao_grupo',
    dimTitle: '2. Gestão do Grupo',
    subTitle: '2.3 Materiais',
    shortTitle: 'Materiais acessíveis e com intenção pedagógica',
    whatToObserve: 'Disponibilidade e autonomia no acesso a tintas, pincéis, blocos lógicos, materiais não estruturados e brinquedos diversos.',
    examples: 'Estantes na altura das crianças, cestos com elementos da natureza e sucatas higienizadas, alfabetos móveis e riscadores diversificados.',
    scaleGuidance: {
      consistent: 'Materiais diversificados ao alcance livre das crianças, utilizados com criatividade e intencionalidade educativa.',
      partial: 'Materiais guardados no alto dos armários, entregues apenas em quantidades racionadas pelo professor.',
      not_done: 'Inexistência de materiais acessíveis ou uso exclusivo de lápis e caderno escolar.'
    }
  },
  '4.2.4': {
    dimKey: 'respeito_integridade',
    dimTitle: '4. Respeito e Proteção à Integridade',
    subTitle: '4.2 Questões Étnico-raciais e de Gênero',
    shortTitle: 'Discussões e reflexões de respeito às diferenças',
    whatToObserve: 'Postura ativa do docente na promoção de atitudes respeitosas e acolhedoras frente a diversidades de gênero, raça e deficiência.',
    examples: 'Livros infantis com representatividade negra e indígena, bonecas e brinquedos com diferentes tons de pele, acolhimento educativo a falas preconceituosas.',
    scaleGuidance: {
      consistent: 'Mediação respeitosa, propositiva e educativa, aproveitando situações cotidianas para fortalecer a empatia e o respeito mútuo.',
      partial: 'Professor repreende condutas preconceituosas sem promover diálogo educativo ou reflexão acolhedora.',
      not_done: 'Omissão frente a atitudes discriminatórias observadas em sala.'
    }
  }
  // Cobertura completa de todos os critérios de professores e coordenadores
};
```

---

### 3.2 Helper de Detalhamento e Formatação Inteligente
Implementação de funções canônicas para resolução dos dados formativos:

```javascript
function getCriterionGuidance(critId, evaluatedType = 'turma') {
  if (RUBRIC_GUIDANCE_DB && RUBRIC_GUIDANCE_DB[critId]) {
    return RUBRIC_GUIDANCE_DB[critId];
  }
  
  // Fallback dinâmico pesquisando nas matrizes ativas
  const sections = (evaluatedType === 'coordenador') 
    ? (appState.customRubrics?.coordinator || DEFAULT_SECTIONS_COORDINATOR)
    : (appState.customRubrics?.teacher || DEFAULT_SECTIONS_TEACHER);
  
  for (const sec of sections) {
    for (const sub of (sec.subSections || [])) {
      for (const crit of (sub.criteria || [])) {
        if (crit.id === critId) {
          // Extrai título curto eliminando parênteses explicativos se houver
          const cleanText = crit.text.replace(/\s*\([^)]*\)/g, '').trim();
          return {
            dimKey: sec.key,
            dimTitle: sec.title,
            subTitle: sub.title || sec.title,
            shortTitle: cleanText,
            whatToObserve: crit.guidance || crit.text,
            examples: 'Consulte os documentos oficiais de referência da Educação Infantil de Patos.',
            scaleGuidance: {
              consistent: 'Prática realizada com regularidade, intencionalidade e planejamento pedagógico.',
              partial: 'Prática realizada de forma pontual, incompleta ou com fragilidades observadas.',
              not_done: 'Prática ausente no período observado.'
            }
          };
        }
      }
    }
  }

  return {
    dimTitle: 'Dimensão Pedagógica',
    subTitle: 'Acompanhamento Formativo',
    shortTitle: `Critério ${critId}`,
    whatToObserve: 'Observar a prática pedagógica desenvolvida na rotina da turma.',
    examples: '',
    scaleGuidance: null
  };
}

function formatCriterionMobileTitle(crit) {
  if (!crit || !crit.text) return '';
  // Se estiver em tela mobile, sintetiza parênteses longos (mais de 20 caracteres)
  // preservando a indicação visual e mantendo o texto completo para o pop-up
  const text = crit.text;
  const parenMatch = text.match(/\(([^)]+)\)/);
  if (parenMatch && parenMatch[1].length > 25) {
    const mainTitle = text.replace(/\s*\([^)]+\)/, '').trim();
    return `${mainTitle} <span class="crit-more-hint" onclick="openRubricGuidanceModal('${crit.id}'); event.stopPropagation();" title="Ver detalhes completos">(mais...)</span>`;
  }
  return text;
}
```

---

### 3.3 Estrutura HTML do Modal de Apoio Pedagógico (`#modalRubricGuidance`)
Inserção no bloco de modais de `index.html`:

```html
<!-- =========================================================================
     PILAR 11: MODAL / BOTTOM SHEET DE APOIO PEDAGÓGICO DAS RUBRICAS (ℹ️)
     ========================================================================= -->
<div id="modalRubricGuidance" class="modal-backdrop mobile-bottom-sheet-backdrop" onclick="closeRubricGuidanceModal(event)">
  <div class="modal-panel mobile-bottom-sheet-panel rubric-guidance-panel" onclick="event.stopPropagation()">
    <div class="mobile-bottom-sheet-handle"></div>
    
    <div style="display:flex; justify-content:space-between; align-items:flex-start; width:100%; margin-bottom:8px; gap:10px;">
      <div>
        <div id="rubricGuidanceBreadcrumb" style="font-size:11px; font-weight:800; text-transform:uppercase; color:var(--primary); letter-spacing:0.5px; margin-bottom:4px;">
          Estratégias Didáticas › Ampliação de Repertório
        </div>
        <h3 id="rubricGuidanceCriterionTag" style="margin:0; font-size:16px; font-weight:800; color:var(--primary-dark); line-height:1.3;">
          📌 Item 1.1.2: Faz uso de perguntas abertas
        </h3>
      </div>
      <button type="button" class="btn-close-modal" onclick="closeRubricGuidanceModal()" style="background:none; border:none; font-size:22px; font-weight:700; cursor:pointer; color:var(--text-secondary); line-height:1; padding:4px 8px;">&times;</button>
    </div>

    <!-- Enunciado Completo Oficial -->
    <div id="rubricGuidanceFullStatement" style="background:#F8FAFC; border:1px solid #E2E8F0; border-left:4px solid var(--primary); padding:10px 14px; border-radius:8px; font-size:13px; color:var(--text-primary); margin-bottom:14px; line-height:1.5; font-weight:600;">
    </div>

    <div class="rubric-guidance-scroll-body" style="display:flex; flex-direction:column; gap:12px; max-height:60vh; overflow-y:auto; padding-right:4px;">
      
      <!-- Card: O Que Observar na Sala -->
      <div class="guidance-card">
        <div class="guidance-card-header" style="display:flex; align-items:center; gap:6px; color:#1D4ED8; font-weight:800; font-size:12px; text-transform:uppercase; margin-bottom:4px;">
          <span>🔍</span> O Que Observar na Prática
        </div>
        <div id="rubricGuidanceWhatToObserve" style="font-size:12px; color:#334155; line-height:1.5;">
        </div>
      </div>

      <!-- Card: Exemplos e Evidências Concretas -->
      <div id="rubricGuidanceExamplesCard" class="guidance-card" style="background:#F0FDF4; border:1px solid #BBF7D0;">
        <div class="guidance-card-header" style="display:flex; align-items:center; gap:6px; color:#15803D; font-weight:800; font-size:12px; text-transform:uppercase; margin-bottom:4px;">
          <span>✨</span> Exemplos e Evidências Concretas
        </div>
        <div id="rubricGuidanceExamples" style="font-size:12px; color:#166534; line-height:1.5;">
        </div>
      </div>

      <!-- Card: Régua Formativa de Gradação -->
      <div id="rubricGuidanceScaleCard" class="guidance-card" style="background:#FFFBEB; border:1px solid #FDE68A;">
        <div class="guidance-card-header" style="display:flex; align-items:center; gap:6px; color:#B45309; font-weight:800; font-size:12px; text-transform:uppercase; margin-bottom:6px;">
          <span>🚦</span> Como Avaliar (Gradação Formativa)
        </div>
        <div style="display:flex; flex-direction:column; gap:6px; font-size:11px;">
          <div style="display:flex; gap:8px;">
            <strong style="color:#166534; min-width:85px;">🟢 Consistente:</strong>
            <span id="rubricScaleConsistent" style="color:#1E293B;">Prática intencional, regular e bem mediada.</span>
          </div>
          <div style="display:flex; gap:8px;">
            <strong style="color:#B45309; min-width:85px;">🟡 Parcial:</strong>
            <span id="rubricScalePartial" style="color:#1E293B;">Prática mecânica, esporádica ou com mediação insuficiente.</span>
          </div>
          <div style="display:flex; gap:8px;">
            <strong style="color:#991B1B; min-width:85px;">🔴 Não Realiz.:</strong>
            <span id="rubricScaleNotDone" style="color:#1E293B;">Ausência de evidências da prática na rotina observada.</span>
          </div>
        </div>
      </div>

    </div>

    <!-- Botão de Fechamento -->
    <div style="margin-top:16px; pt-2; border-top:1px solid #E2E8F0; display:flex; justify-content:flex-end;">
      <button type="button" class="btn btn-primary" onclick="closeRubricGuidanceModal()" style="width:100%; max-width:200px; height:42px; font-size:13px; font-weight:800;">
        ✓ Entendido / Fechar
      </button>
    </div>
  </div>
</div>
```

---

### 3.4 Injeção do Botão `ℹ️` nos Cards de Critério (`renderCriterionCard`)
Na função `renderCriterionCard(crit, obsInstance)` (linhas ~10380-10387):

```javascript
// Substituição no cabeçalho do card:
const mobileText = formatCriterionMobileTitle(crit);

let html = `
  <div class="crit-top">
    <div class="crit-text-wrapper" style="flex:1;">
      <div class="crit-text">
        <span class="crit-text-desktop">${crit.text}</span>
        <span class="crit-text-mobile">${mobileText}</span>
      </div>
    </div>
    <div class="crit-top-actions" style="display:flex; align-items:center; gap:6px; flex-shrink:0;">
      <button type="button" 
              class="btn-rubric-guidance-trigger" 
              onclick="openRubricGuidanceModal('${crit.id}', '${obsInstance.evaluatedType || 'turma'}')" 
              title="Ver orientações pedagógicas detalhadas e evidências deste item"
              aria-label="Orientações do Item ${crit.id}">
        <span class="info-icon">ℹ️</span>
        <span class="guidance-btn-text">Orientações</span>
      </button>
      <div class="crit-tag">Item ${crit.id}</div>
    </div>
  </div>
  ...
`;
```

---

### 3.5 Estilos CSS Modernos e Responsivos
Adição ao CSS global de `index.html`:

```css
/* =========================================================================
   PILAR 11: ESTILOS DE APOIO PEDAGÓGICO ÀS RUBRICAS (ℹ️) E BOTÃO COMPACTO
   ========================================================================= */
.btn-rubric-guidance-trigger {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #EFF6FF;
  border: 1px solid #BFDBFE;
  color: #1D4ED8;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  line-height: 1;
  user-select: none;
}
.btn-rubric-guidance-trigger:hover {
  background: #DBEAFE;
  border-color: #93C5FD;
  color: #1E40AF;
  transform: translateY(-1px);
}
.btn-rubric-guidance-trigger .info-icon {
  font-size: 12px;
}
.crit-text-mobile {
  display: none;
}
.crit-text-desktop {
  display: inline;
}
.crit-more-hint {
  color: var(--primary);
  font-weight: 700;
  cursor: pointer;
  text-decoration: underline;
  margin-left: 4px;
}
.guidance-card {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 10px 12px;
}

/* Responsividade Mobile (Smartphone <= 768px) */
@media (max-width: 768px) {
  .crit-text-desktop {
    display: none;
  }
  .crit-text-mobile {
    display: inline;
  }
  .btn-rubric-guidance-trigger {
    padding: 6px 8px;
    font-size: 10px;
  }
  .btn-rubric-guidance-trigger .guidance-btn-text {
    display: inline;
  }
  .rubric-guidance-panel {
    max-height: 85vh;
  }
}
@media (max-width: 480px) {
  .btn-rubric-guidance-trigger .guidance-btn-text {
    display: none; /* Em telas muito estreitas, exibe apenas o ícone ℹ️ */
  }
  .btn-rubric-guidance-trigger {
    padding: 6px 6px;
  }
}
```

---

## 4. Seção Obrigatória de Auditoria Automatizada (100% de Cobertura)

Conforme expressamente exigido nos documentos normativos `WORKFLOW_MACOS.md` e `AGENTS.md`, esta seção descreve detalhadamente as **alterações, adições e exclusões** a serem implementadas no algoritmo de auditoria da plataforma (`audit_platform.py` e testes modulares internos em `index.html`), cobrindo o impacto do Pilar 11 modo-a-modo.

### 4.1 Módulo 4: `rubricas_observacao` (Foco Primário do Pilar 11)

#### A. Adições no Módulo 4 em `index.html` (`runFullPlatformAudit`):
1. **Teste 1: Presença do Modal de Apoio Pedagógico no DOM:**
   - Verificar a existência do elemento `#modalRubricGuidance` e seus componentes essenciais (`#rubricGuidanceBreadcrumb`, `#rubricGuidanceCriterionTag`, `#rubricGuidanceWhatToObserve`, `#rubricGuidanceExamplesCard` e `#rubricGuidanceScaleCard`).
   - Asserção: Falhar caso o modal ou qualquer contêiner essencial esteja ausente.
2. **Teste 2: Renderização do Botão de Apoio `ℹ️` nos Cards de Critério:**
   - Validar que cada cartão de critério (`.crit-card`) gerado no DOM contém o botão com a classe `.btn-rubric-guidance-trigger`.
   - Asserção: Falhar se algum critério não possuir o gatilho formativo.
3. **Teste 3: Simulação Interativa de Abertura do Modal de Rubricas:**
   - Executar `openRubricGuidanceModal('1.1.2', 'turma')`.
   - Validar que o modal `#modalRubricGuidance` recebe a classe `.active`.
   - Validar que os campos textuais foram populados fielmente com os dados do critério `1.1.2` (Dimensão Estratégias Didáticas, enunciado e orientações de perguntas abertas).
4. **Teste 4: Simulação Interativa de Fechamento do Modal:**
   - Executar `closeRubricGuidanceModal()`.
   - Validar que a classe `.active` foi removida do `#modalRubricGuidance`.
5. **Teste 5: Integridade do Dicionário `RUBRIC_GUIDANCE_DB`:**
   - Validar que a chamada `getCriterionGuidance('1.3.1')` e `getCriterionGuidance('2.1.6')` retorna objetos consistentes com propriedades `whatToObserve` e `scaleGuidance`.
6. **Teste 6: Enxugamento Visual Mobile:**
   - Validar que `formatCriterionMobileTitle({ id: '1.3.1', text: 'Práticas que promovem expressão e comunicação (...)' })` sintetiza os parênteses longos e insere o gatilho `(mais...)`.

#### B. Alterações no Script CLI de Auditoria (`audit_platform.py`):
- Atualizar a descrição do Módulo 4 no dicionário `MODULE_CATALOG`:
  ```python
  'rubricas_observacao': 'Observação Ativa, Matrizes Curriculares, Rubricas, Pendências e Apoio Pedagógico Mobile (Pilar 11)',
  ```

---

### 4.2 Impacto e Preservação nos Demais 11 Módulos de Auditoria

| ID do Módulo | Nome do Módulo | Impacto do Pilar 11 | Ação de Preservação e Verificação |
| :---: | :--- | :---: | :--- |
| **1** | `auth_rbac` | Nenhum | Manter autenticação de Mariana, Clarice, Helena e Rodrigo 100% preservada. |
| **2** | `catalogo_dados` | Nenhum | Manter integridade do catálogo canônico de escolas e turmas. |
| **3** | `setup_longitudinal` | Nenhum | Preservar seleção de turmas e ciclo longitudinal do Pilar 1. |
| **4** | `rubricas_observacao` | **Alto** (Pilar 11) | **Módulo enriquecido** com testes do modal `#modalRubricGuidance`, botões `ℹ️` e enxugamento mobile. |
| **5** | `sintese_finalizacao` | Baixo | Garantir que o preenchimento de observação com auxílio do modal `ℹ️` finaliza normalmente sem erros de sintaxe ou estado. |
| **6** | `travas_seguranca` | Nenhum | Preservar imutabilidade e bloqueio de duplo lançamento. |
| **7** | `formadora_coordenacao` | Baixo | Validar que a matriz de coordenação também tem acesso às suas orientações pedagógicas específicas via `getCriterionGuidance()`. |
| **8** | `agenda_cronograma` | Nenhum | Preservar agendamentos e baixa automática. |
| **9** | `historico_governanca` | Nenhum | Preservar cards de histórico e filtros. |
| **10** | `indicadores_decisao` | Médio | Validar que a sub-aba de Afunilamento (`drilldown`) continua renderizando benchmarks e cálculos de gargalos (Pilar 8) com a inclusão harmonizada do ícone `ℹ️`. |
| **11** | `backup_exportacao` | Nenhum | Preservar integridade dos dumps JSON e relatórios de impressão. |
| **12** | `navegacao_layout` | Baixo | Validar ausência do vocábulo "visita" no modal de orientações e compatibilidade de layout responsivo. |

---

## 5. Roteiro Passo a Passo de Implementação (Etapa 2 - Operário)

### Passo 1: Sincronização Inicial
- Executar `git pull origin main`.

### Passo 2: Implementação dos Estilos CSS
- Inserir as classes `.btn-rubric-guidance-trigger`, `.rubric-guidance-panel`, `.guidance-card` e estilos de responsividade `@media (max-width: 768px)` em `index.html`.

### Passo 3: Implementação do Dicionário Canônico `RUBRIC_GUIDANCE_DB` e Helpers
- Inserir `RUBRIC_GUIDANCE_DB`, `getCriterionGuidance()`, `formatCriterionMobileTitle()` e `getCriterionDetails()` no script de `index.html`.

### Passo 4: Markup do Modal `#modalRubricGuidance`
- Inserir a estrutura HTML da Bottom Sheet / Modal de Apoio Pedagógico na seção de modais de `index.html`.

### Passo 5: Atualização da Função `renderCriterionCard`
- Atualizar a renderização do cabeçalho de cada critério na função `renderCriterionCard()` para injetar o botão `btn-rubric-guidance-trigger` e suportar os títulos concisos no mobile.

### Passo 6: Integração no Afunilamento por Dimensão (`drilldown`)
- Atualizar a renderização de critérios em `renderIndicatorsScreen()` (sub-aba `drilldown`) para exibir o botão discreto `ℹ️`.

### Passo 7: Controladores JavaScript do Modal
- Implementar `openRubricGuidanceModal()` e `closeRubricGuidanceModal()`.

### Passo 8: Atualização dos Testes Automatizados
- Enriquecer o Módulo 4 (`rubricas_observacao`) na suíte de testes do `index.html` e atualizar `MODULE_CATALOG` em `audit_platform.py`.

### Passo 9: Gestão do Changelog Duplo e Versão
- Registrar a **Versão 1.10 (v7.89)** no topo do `CHANGELOG.md` e no modal `#modalChangelog` do `index.html`.
- Atualizar a indicação textual de versão para `Versão 1.10 (v7.89)`.

### Passo 10: Sincronização de Cópias Espelhadas
- Replicar fielmente `index.html` para:
  - `gestor supervisao_patos/index.html`
  - `gestor supervisao_patos/firebase_deploy/public/index.html`

### Passo 11: Salvamento do Backup Intermediário
- Salvar cópia integral em `intermediárias/aplicativo_v110_pilar_11_popups_rubricas_apoio_mobile.html`.

### Passo 12: Deploy no GitHub Pages e Execução Pós-Deploy da Auditoria
- Executar `git fetch origin main` e verificar concorrência.
- Criar commit semântico: `feat: implementar pilar 11 - enxugamento visual mobile com popups e bottom sheet de apoio as rubricas i (v1.10)`.
- Fazer push para `origin main`.
- Rodar imediatamente `python3 audit_platform.py --silent-on-success` e comunicar restritamente apenas se houverem falhas.

---

## 6. Checklist de Conformidade Normativa

- [ ] Sincronização prévia com `git pull origin main` realizada.
- [ ] Investigação aprofundada do código e das matrizes efetuada sem alterações precipitadas.
- [ ] Plano executivo salvo em `./planos_de_implementacao/plano_pilar_11_popups_rubricas_apoio_mobile.md`.
- [ ] Seção Obrigatória de Auditoria com cobertura modo-a-modo incluída no plano.
- [ ] Dicionário canônico `RUBRIC_GUIDANCE_DB` estruturado para professores e coordenadores.
- [ ] Modal tátil deslizante `#modalRubricGuidance` projetado para mobile e desktop.
- [ ] Enxugamento visual de parênteses longos no celular com redução da altura dos cards em mais de 40%.
- [ ] Botão informativo `ℹ️` perfeitamente acessível com touch target ergonômico.
- [ ] Extensão harmoniosa para a sub-aba de Afunilamento (`drilldown`).
- [ ] Suporte à gestão de rubricas no `#screenRubricsAdmin`.
- [ ] Dupla checagem e gestão do Changelog duplo (Versão 1.10) planejadas.
- [ ] Sincronização dos três arquivos `index.html` especificada.
- [ ] Protocolo pós-deploy com execução silenciosa do algoritmo de auditoria estabelecido.
