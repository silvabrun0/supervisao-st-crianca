# Plano de Implementação: Alinhamento, Centralização e Padronização Visual das Caixas de Filtros para Diagnóstico e Formulários Globais

> **Status:** Proposto para Aprovação (Etapa 1 - Arquiteto)  
> **Data:** 22/10/2026  
> **Alvo:** `index.html`, `audit_platform.py` e `firebase_deploy/public/index.html`  
> **Versão:** 0.93  

---

## 1. Diagnóstico e Causa Raiz do Problema

### 1.1. Sintoma Relatado pelo Usuário
> *"quando eu vou visualizar algumas coisas, como os filtros para diagnóstico, as opções das caixas ficam descentralizadas, ficando muito à esquerda, quase que passando. crie um plano para solucionar isso."*

### 1.2. Investigação Técnica e Identificação da Causa Raiz

A investigação aprofundada no código-fonte (`index.html`) identificou um conjunto de causas técnicas interligadas que provocam exatamente o sintoma descrito:

1. **Ausência da Regra CSS para `.form-control`:**
   - Na barra de filtros desktop de Diagnóstico (`#indicatorsFilterToolbar`, linhas 4079-4110) e no modal deslizante mobile com o título canônico **"Filtros para Diagnóstico"** (`#modalIndicatorsFiltersMobile`, linhas 6859-6885), todos os 8 elementos `<select>` foram declarados com `class="form-control"`:
     - `#indicatorsTargetTypeFilter` (Público-Alvo)
     - `#indicatorsUnitFilter` (Unidade Escolar)
     - `#indicatorsMemberFilter` (Professora / Docente / Coordenador)
     - `#indicatorsBimesterFilter` (Bimestre de Referência)
     - `#mobileIndTargetTypeFilter` (Público-Alvo Mobile)
     - `#mobileIndUnitFilter` (Unidade Escolar Mobile)
     - `#mobileIndMemberFilter` (Professora / Docente Mobile)
     - `#mobileIndBimesterFilter` (Bimestre de Referência Mobile)
   - Contudo, **a classe `.form-control` não possui nenhuma declaração CSS no `<style>` global**. O projeto define apenas `.form-select, .form-input` (linha 1474).

2. **Impacto do Reset Universal `* { margin: 0; padding: 0; }`:**
   - Na linha 40 de `index.html`:
     ```css
     * {
       box-sizing: border-box;
       margin: 0;
       padding: 0;
       font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
       -webkit-tap-highlight-color: transparent;
     }
     ```
   - O seletor universal zera o padding de todos os nós do DOM. Como `.form-control` não existe no CSS e os estilos inline dos seletores continham apenas `width: 100%; height: 42px; font-size: 13px;` (ou `height: 44px`), **o padding interno horizontal foi forçado para `0px` (`padding-left: 0; padding-right: 0;`)**.

3. **Consequências Visuais Críticas:**
   - **Descentralização e Colagem à Esquerda ("muito à esquerda"):** Sem espaçamento interno (`padding-left: 0`), o texto da opção atualmente selecionada dentro da caixa (e das opções do dropdown nativo) é renderizado encostando no pixel zero da borda esquerda do seletor, eliminando qualquer margem de respiro.
   - **Transbordamento Visual ("quase que passando"):** Opções com nomes longos (como *"EMEF PROFESSORA MARIA DO SOCORRO LUCENA SILVA - POLO CENTRO"* ou *"Ano Letivo Completo (Todos os Bimestres)"*) começam no extremo esquerdo e avançam por toda a caixa, colidindo com a borda direita ou passando por baixo do ícone nativo de seta, sem reserva de `padding-right` e sem `text-overflow: ellipsis`.
   - **Descentralização Vertical:** Fixar `height: 42px` ou `height: 44px` com `padding: 0` faz com que navegadores WebKit/Blink e Gecko alinhem a linha de base do texto mais acima ou mais abaixo, quebrando a harmonia geométrica.
   - **Bordas e Cantos Crus:** Sem estilização CSS associada, os seletores perdem `border: 1px solid var(--border);`, `border-radius: 8px;` e `background: var(--surface);`, herdando o visual cinza cru ou chanfrado do sistema operacional.

4. **Escopo Global de Outros Campos Afetados:**
   - Vários inputs de formulário em `#screenSetup` (`setupDate`, `setupStartTime`, `setupEndTime`) e `#screenSynthesis` (`synthesisDate`, `synthesisStartTime`, `synthesisEndTime`, etc.) também usam `class="form-control"`, dependendo de inline styles pontuais ou sofrendo inconsistências de padding.

---

## 2. Objetivos da Solução

1. **Centralização e Alinhamento Perfeito:** Garantir que o texto de qualquer opção selecionada ou campo de filtro tenha um respiro interno confortável e simétrico (`padding-left: 14px`), ficando visualmente centralizado na vertical e horizontal.
2. **Eliminação de Transbordamento ("quase que passando"):** Reservar `padding-right: 36px` e aplicar `text-overflow: ellipsis; white-space: nowrap; overflow: hidden;` para que nomes extensos de escolas ou turmas sejam truncados de forma refinada, sem nunca ultrapassar os limites da caixa nem colidir com a seta.
3. **Padronização Visual Canônica (Chevron Moderno):** Unificar os seletores com `appearance: none; -webkit-appearance: none;` acompanhado de um ícone SVG canônico de chevron sutil e elegante posicionado à direita (`right: 12px; center`), idêntico aos melhores design systems modernos.
4. **Unificação Arquitetural no CSS:** Definir regras completas para `.form-control`, `.form-select`, `select.form-control` e `select.form-select` no CSS central, corrigindo tanto os filtros de Diagnóstico quanto quaisquer outros campos do sistema.
5. **Garantia de Responsividade no Modal Mobile:** Harmonizar a visualização das caixas dentro do modal `#modalIndicatorsFiltersMobile` para telas pequenas (360px a 420px), assegurando que botões, rótulos e seletores mantenham proporções ideais.

---

## 3. Especificação Técnica das Alterações

### 3.1. Folha de Estilos Global (`<style>` em `index.html`)

#### A. Criação da Classe Canônica Unificada `.form-control` e `.form-select`
Substituir e expandir o bloco de controles de formulário (linhas 1471-1494):

```css
/* Form Controls & Global Selectors Unificados */
.form-group {
  margin-bottom: 14px;
}
.form-label {
  display: block;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 6px;
  letter-spacing: 0.3px;
}

/* Regra Unificada para Entradas e Seletores */
.form-control, .form-select, .form-input {
  display: block;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  height: 42px;
  line-height: 40px;
  padding: 0 14px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  background-color: var(--surface);
  color: var(--text-primary);
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.form-control:focus, .form-select:focus, .form-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.form-control:disabled, .form-select:disabled, .form-input:disabled {
  background-color: #F1F5F9;
  color: #94A3B8;
  cursor: not-allowed;
  opacity: 0.85;
}

/* Especialização para Seletores (<select>): Chevron SVG e Proteção de Truncamento */
select.form-control, select.form-select, select {
  padding-right: 36px !important;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px 16px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
}

/* Especialização para Inputs de Data e Hora */
input[type="date"].form-control,
input[type="date"].form-input,
input[type="time"].form-control,
input[type="time"].form-input {
  line-height: normal;
  padding: 8px 12px;
  font-weight: 600;
}
```

#### B. Refinamento Mobile para o Bottom Sheet de Filtros de Diagnóstico
Ajustar as regras em `@media (max-width: 768px)` para garantir conforto no toque e centralização:
```css
@media (max-width: 768px) {
  .mobile-bottom-sheet-panel select.form-control,
  .mobile-bottom-sheet-panel select.form-select {
    height: 46px; /* Altura ideal de toque (Touch Target) */
    line-height: 44px;
    font-size: 14px;
    padding-left: 14px;
    padding-right: 38px;
    border-radius: 10px;
  }
}
```

---

### 3.2. Marcação HTML (`index.html`)

#### A. Barra Desktop de Filtros de Diagnóstico (`#indicatorsFilterToolbar`, linhas 4072-4127)
Atualizar os 4 seletores para adotar a dupla classe canônica `class="form-select form-control"`, limpando estilos inline conflitantes de padding/borda:
1. `#indicatorsTargetTypeFilter`: `class="form-select form-control"` com estilo enxuto `font-weight:700; color:var(--primary-dark);`
2. `#indicatorsUnitFilter`: `class="form-select form-control"` com estilo enxuto `font-weight:600; color:var(--text-primary);`
3. `#indicatorsMemberFilter`: `class="form-select form-control"` com estilo enxuto `font-weight:600; color:var(--primary);`
4. `#indicatorsBimesterFilter`: `class="form-select form-control"` com estilo enxuto `font-weight:700; color:var(--text-primary);`

#### B. Modal / Bottom Sheet Mobile (`#modalIndicatorsFiltersMobile`, linhas 6854-6893)
Atualizar os 4 seletores do modal móvel:
1. `#mobileIndTargetTypeFilter`: `class="form-select form-control"`
2. `#mobileIndUnitFilter`: `class="form-select form-control"`
3. `#mobileIndMemberFilter`: `class="form-select form-control"`
4. `#mobileIndBimesterFilter`: `class="form-select form-control"`

#### C. Outros Campos do Sistema com `.form-control`
Revisar os campos de data e horário em `#screenSetup` e `#screenSynthesis`, garantindo que utilizem a classe unificada `.form-control` e herdem o padding e raio de borda padronizados.

---

### 3.3. Estabilidade do Motor de Testes e Auditoria

Durante a investigação profunda inicial, foram detectados dois pontos de fragilidade no ecossistema de testes que serão corrigidos preventivamente para assegurar 100% de confiabilidade na auditoria contínua:

1. **Prevenção de Disparo Concorrente em `triggerAutoAudit`:**
   - Adicionar uma trava booleana `__autoAuditTriggered = true` em `index.html` para evitar que os eventos `DOMContentLoaded` e `load` executem simultaneamente a auditoria no Chrome headless.
2. **Refinamento do Casamento de Turmas em `calculateClassBimesterStatus`:**
   - O algoritmo utilizava `cleanClass.includes(oCls)`. Quando a turma era `"Infantil II - Turma B"`, a string `"infantil ii"` continha a substring `"infantil i"`, provocando falso positivo com observações da turma Infantil I. A verificação será convertida para tokenização de palavras ou comparação de termos exatos (`\bInfantil I\b` vs `\bInfantil II\b`).

---

## 4. Plano de Execução Passo a Passo (Etapa 2 - Operário)

1. **Sincronização Inicial Pré-Execução:**
   - Executar `git pull origin main` (já validado).
2. **Backup de Segurança:**
   - Gerar cópia intermediária em `intermediárias/aplicativo_v0.93_alinhamento_filtros_diagnostico.html`.
3. **Aplicação do CSS Canônico:**
   - Inserir as regras de `.form-control`, `.form-select` e `select.form-control` em `index.html`.
4. **Atualização da Marcação dos Seletores:**
   - Ajustar os 8 seletores de Diagnóstico (desktop e mobile).
   - Ajustar os inputs de formulário com `.form-control`.
5. **Ajuste Preventivo na Engine de Testes:**
   - Inserir trava `__autoAuditTriggered` e tokenização precisa de turmas em `calculateClassBimesterStatus`.
6. **Espelhamento Obrigatório:**
   - Sincronizar fielmente as alterações de `gestor supervisao_patos/index.html` para `gestor supervisao_patos/firebase_deploy/public/index.html`.
7. **Gestão Dupla do Changelog:**
   - Atualizar `CHANGELOG.md` com a versão `0.93`.
   - Atualizar `#modalChangelog` no `index.html`.
8. **Validação e Auditoria:**
   - Executar suíte de auditoria completa: `python3 audit_platform.py`.
9. **Deploy e Pós-Deploy:**
   - `git push origin main`.
   - Executar `python3 audit_platform.py --silent-on-success` com comunicação restrita a problemas.

---

## 5. Seção Obrigatória de Auditoria: Alterações, Adições e Exclusões na Suíte de Testes

Para garantir conformidade estrita com o **WORKFLOW_MACOS.md** e as diretrizes do projeto, esta seção detalha as modificações estruturadas modo-a-modo a serem incorporadas em `audit_platform.py` e na engine de testes do `index.html`, assegurando cobertura efetiva de 100% da plataforma.

### 5.1. Módulo 10: `indicadores_decisao` (Indicadores Pedagógicos e Usabilidade dos Filtros)

* **Adições (Novas Asserções):**
  1. `Validação Dimensional e Padding do Seletor de Diagnóstico Desktop (#indicatorsUnitFilter)`:
     - Inspecionar via `window.getComputedStyle(indicatorsUnitFilter)` e assegurar que:
       - `paddingLeft` seja exatamente igual ou superior a `12px` (eliminando a colagem à borda pixel zero).
       - `paddingRight` seja igual ou superior a `32px` (protegendo contra colisão com o chevron).
       - `boxSizing` seja `border-box`.
       - `textOverflow` seja `ellipsis`.
  2. `Validação de Conformidade do Seletor Mobile de Diagnóstico (#mobileIndUnitFilter)`:
     - Abrir `#modalIndicatorsFiltersMobile` via `openMobileIndicatorsFiltersModal()`.
     - Inspecionar `mobileIndUnitFilter` e validar que possui `paddingLeft >= 12px`, `paddingRight >= 32px` e `height >= 42px`.
     - Fechar o modal com `closeMobileIndicatorsFiltersModal()`.
  3. `Validação de Presença e Alinhamento do Chevron nos Seletores de Diagnóstico`:
     - Garantir que o valor computado de `backgroundImage` nos seletores de diagnóstico contenha a tag SVG do chevron (`data:image/svg+xml`) ou que a propriedade `appearance` seja `none`.
* **Alterações:**
  - Ajustar a asserção do Semáforo Canônico da Turma Infantil II no 1º Bimestre para confirmar a correta categorização `overdue/red` após a resolução da tokenização de numerais romanos.
* **Exclusões:**
  - Nenhuma exclusão necessária.

### 5.2. Módulo 12: `navegacao_layout` (Ergonomia de Layout, Formulários e Resiliência)

* **Adições (Novas Asserções):**
  1. `Validação Universal de Classes e Estilos para .form-control e .form-select`:
     - Criar dinamicamente um elemento `<select class="form-control">` e um `<input type="text" class="form-control">`.
     - Confirmar que ambos recebem automaticamente `box-sizing: border-box`, `border-radius: 8px` e `padding-left >= 12px`, comprovando que nenhuma caixa de formulário do sistema fica descentralizada ou encostada à esquerda.
  2. `Blindagem Anti-Reentrância do Motor de Auditoria Automática`:
     - Testar a presença da trava `__autoAuditTriggered` para garantir que chamadas múltiplas de inicialização de página não provoquem condições de corrida.
* **Alterações:**
  - Nenhuma alteração nos testes existentes.
* **Exclusões:**
  - Nenhuma exclusão.

### 5.3. Algoritmo de Execução Headless (`audit_platform.py`)

* **Alterações:**
  - Ajustar o timeout de espera padrão para 45s (conferindo folga para inicialização de instâncias limpas do Chrome no macOS).
  - Manter suporte integral aos argumentos `--module`, `--list-modules` e `--silent-on-success`.
