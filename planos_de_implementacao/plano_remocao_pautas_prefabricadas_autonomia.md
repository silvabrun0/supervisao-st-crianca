# PLANO DE IMPLEMENTAÇÃO: REMOÇÃO DE PAUTAS FORMATIVAS PRÉ-FABRICADAS (AUTONOMIA PEDAGÓGICA DA REDE)

> **DIRETRIZ OBRIGATÓRIA DE EXECUÇÃO (ETAPA 1 - ARQUITETO):**
> Este documento constitui o planejamento detalhado para a **remoção estrita de sugestões/pautas pré-fabricadas e diretrizes formativas pré-concebidas** do Bloco de Menores Índices (Gargalos Pedagógicos - Pilar 8).
> A intervenção garante a total **autonomia pedagógica, formativa e reflexiva da Rede Municipal de Patos/PB**, assegurando que o sistema atue estritamente como **instrumento diagnóstico objetivo e fidedigno de evidências**, deixando a construção de combinados, pautas e intervenções a cargo das Coordenadoras, Formadoras e Professoras.
> O assistente executor (Etapa 2) deverá seguir os protocolos de `WORKFLOW_MACOS.md`, `AGENTS.md` e `GEMINI.md`.

---

## 1. Diagnóstico e Fundamentação Técnico-Pedagógica

### 1.1 Motivação da Remoção
No Bloco de Diagnóstico "Foco nos Menores Índices (Gargalos Pedagógicos)" (Pilar 8), foi incluído:
1. Uma caixa amarela (`.bottleneck-prompt-box`) em cada card exibindo um texto predefinido ("💡 Pauta Formativa para Alinhamento").
2. Uma função `getPedagogicalActionPrompt(critId, subId, targetType)` com frases pré-fabricadas atribuídas a cada subdimensão.
3. No botão de cópia de pauta (`copyMeetingAgendaToClipboard`), uma linha injetando essa diretriz pronta (`• Diretriz Formativa: ...`).

### 1.2 Princípio da Autonomia Formativa da Rede
Conforme deliberação da gestão e diretrizes da supervisão:
- **A construção da pauta é prerrogativa pedagógica da equipe da escola e da formação municipal.** Prescrever textos genéricos ou pré-formatados engessa a mediação pedagógica e desrespeita a contextualização singular de cada unidade escolar e de cada grupo docente.
- O papel do software de supervisão deve limitar-se à **exposição clara, matemática e visual dos fatos e evidências observadas no chão da escola**:
  - Código e texto oficial do critério avaliado;
  - Localização precisa na matriz (Dimensão e Subdimensão);
  - Média percentual da Unidade Escolar / Polo;
  - Média percentual da Rede Municipal de Patos;
  - Desvio relativo ($\Delta \pm\%$);
  - Quantitativo de evidências registradas em sala (`Consistente`, `Parcial`, `Não Realizado`).
- As reflexões, combinados e pautas formativas devem emergir de forma autônoma e dialógica nos encontros pedagógicos (HTPC / planejamento coletivo).

---

## 2. Escopo Exato das Remoções e Modificações

### 2.1 O que será REMOVIDO:
1. **Função `getPedagogicalActionPrompt` em `index.html`:**
   - Exclusão completa da função e de seu dicionário de frases pré-fabricadas.
2. **Caixa Visual de Pauta no Card (`.bottleneck-prompt-box`):**
   - Remoção do contêiner HTML `<div class="bottleneck-prompt-box">` dentro da renderização em `renderBottlenecksPrioritySection`.
3. **Regra de Estilo CSS de `.bottleneck-prompt-box`:**
   - Remoção da classe CSS no bloco de estilos do Pilar 8.
4. **Injeção de "Diretriz Formativa" no Botão Copiar:**
   - No método `copyMeetingAgendaToClipboard`, remover a linha `• Diretriz Formativa: ...`.
   - Ajustar o botão de cópia para `📋 Copiar Dados dos Gargalos` (ou `📋 Copiar Resumo dos Gargalos`), gerando um relatório limpo e objetivo contendo apenas os dados factuais dos 3 critérios, seu benchmark frente à rede e os contadores de evidências, sem prescrições artificiais de conteúdo.
5. **Rótulo do Cabeçalho do Bloco:**
   - No subtítulo de `#indicatorsSectionBottlenecks`, ajustar sutilmente o texto para enfatizar a identificação diagnóstica dos critérios mais frágeis para reflexão da equipe, sem sugerir prescrição do sistema.

### 2.2 O que será PRESERVADO (100% Intacto):
- O Grid de KPIs Decisórios (Cards 1 a 4 do Pilar 7).
- A identificação algorítmica exata dos 3 menores critérios (função `calculateTopBottlenecks`).
- O alternador dinâmico de modo: `📉 Menor Consistência` vs. `🔻 Maior Desvio vs. Rede`.
- As réguas duplas e indicadores comparativos (`% UE`, `% Rede Patos`, `Δ%`).
- Os contadores de respostas (`C:`, `P:`, `NR:`).
- O deep-linking direto para o Afunilamento (`🔍 Ver no Afunilamento`) com expansão e destaque luminoso (`highlight-bottleneck-pulse`).
- O atalho interativo no Card 4 (`🎯 Ver os 3 Critérios Críticos ↓`).
- Todas as blindagens RBAC, série histórica longitudinal e testes de auditoria.

---

## 3. Mapeamento Técnico de Alterações (Linha a Linha)

### 3.1 Em `index.html`:

#### A. Remoção da classe CSS `.bottleneck-prompt-box`:
Localizar (~linha 965):
```css
    .bottleneck-prompt-box {
      background: #FFFBEB;
      border: 1px dashed #FCD34D;
      border-radius: 8px;
      padding: 10px 12px;
      font-size: 11px;
      color: #78350F;
      line-height: 1.4;
      margin-bottom: 12px;
    }
```
**Ação:** Excluir integralmente este bloco CSS.

---

#### B. Remoção da função `getPedagogicalActionPrompt`:
Localizar (~linhas 14870 a 14892):
```javascript
    /**
     * Mapeamento de pautas formativas recomendadas por subdimensão/tópico para subsidiar
     * o alinhamento pedagógico e formação interna na Unidade Escolar.
     */
    function getPedagogicalActionPrompt(critId, subId, targetType) {
      ...
    }
```
**Ação:** Excluir integralmente a função e seus comentários.

---

#### C. Limpeza na Função `copyMeetingAgendaToClipboard`:
Localizar (~linhas 15050 a 15065):
```javascript
      bottlenecks.forEach((b, idx) => {
        const rank = idx + 1;
        const deltaText = b.delta !== null ? `${b.delta > 0 ? '+' : ''}${b.delta}% vs. Rede Patos` : 'Sem benchmark';
        text += `${rank}. [${b.critId}] ${b.critText}\n`;
        text += `   • Localização: ${b.dimTitle} · ${b.subTitle}\n`;
        text += `   • Consistência na UE: ${b.score}% (Rede Municipal: ${b.redeScore !== null ? b.redeScore + '%' : '—'} · Δ: ${deltaText})\n`;
        text += `   • Evidências Observadas: C: ${b.consistent} | P: ${b.partial} | NR: ${b.notDone}\n`;
        text += `   • Diretriz Formativa: ${getPedagogicalActionPrompt(b.critId, b.subId, targetType)}\n\n`;
      });
```
**Substituir por:**
```javascript
      bottlenecks.forEach((b, idx) => {
        const rank = idx + 1;
        const deltaText = b.delta !== null ? `${b.delta > 0 ? '+' : ''}${b.delta}% vs. Rede Patos` : 'Sem benchmark';
        text += `${rank}. [${b.critId}] ${b.critText}\n`;
        text += `   • Localização: ${b.dimTitle} · ${b.subTitle}\n`;
        text += `   • Consistência na UE: ${b.score}% (Rede Municipal: ${b.redeScore !== null ? b.redeScore + '%' : '—'} · Δ: ${deltaText})\n`;
        text += `   • Evidências Observadas: C: ${b.consistent} | P: ${b.partial} | NR: ${b.notDone}\n\n`;
      });
```
E ajustar o feedback do toast de cópia para:
`showToast('Resumo diagnóstico dos gargalos copiado para a área de transferência! 📋');`

---

#### D. Remoção do Bloco de Pauta em `renderBottlenecksPrioritySection`:
Localizar no card HTML (~linhas 15123 e 15174 a 15179):
```javascript
          const promptText = getPedagogicalActionPrompt(b.critId, b.subId, targetType);
```
e
```javascript
                <!-- PAUTA DE ALINHAMENTO FORMATIVO -->
                <div class="bottleneck-prompt-box">
                  <strong style="display:block; margin-bottom:3px; color:#92400E;">💡 Pauta Formativa para Alinhamento:</strong>
                  ${promptText}
                </div>
```
**Ação:** Excluir a constante `promptText` e o bloco HTML `.bottleneck-prompt-box`.

Ajustar o botão de cópia no cabeçalho do bloco de:
```html
<button type="button" class="btn btn-secondary" onclick="copyMeetingAgendaToClipboard('${scopeLabelText}', '${targetType}')" style="font-size:11px; padding:5px 10px; font-weight:700; display:inline-flex; align-items:center; gap:4px;" title="Copiar pauta estruturada para reunião pedagógica">
  📋 Copiar Pauta
</button>
```
para:
```html
<button type="button" class="btn btn-secondary" onclick="copyMeetingAgendaToClipboard('${scopeLabelText}', '${targetType}')" style="font-size:11px; padding:5px 10px; font-weight:700; display:inline-flex; align-items:center; gap:4px;" title="Copiar dados diagnósticos dos 3 gargalos">
  📋 Copiar Diagnóstico
</button>
```

E no cabeçalho textual do bloco (~linha 15198):
```html
              <p>
                Identificação algorítmica dos 3 critérios mais frágeis ${audienceName} em <strong>${scopeLabelText}</strong> para subsidiar a reflexão pedagógica e o planejamento da equipe.
              </p>
```

---

## 4. Gestão de Versão e Documentação

1. **Versão Oficial:** Incrementar para **Versão 1.03 (v7.82)**.
2. **Atualização no Cabeçalho:**
   - Botão no cabeçalho: `📌 Versão 1.03 (v7.82)`.
3. **Changelog no Modal `#modalChangelog` em `index.html`:**
   - Adicionar o card da Versão 1.03 destacando:
     * *Remoção de Pautas Pré-fabricadas no Diagnóstico de Gargalos:* Supressão definitiva de sugestões e textos formativos predefinidos, em respeito estrito à autonomia formativa das escolas e da equipe pedagógica municipal.
     * *Foco Estrito em Evidências e Dados Objetivos:* O bloco concentra-se exclusivamente na identificação dos critérios críticos, réguas de consistência, desvios comparativos e contagem de respostas.
4. **Atualização do `CHANGELOG.md`:**
   - Incluir a linha da Versão 1.03 no Sumário Executivo.
   - Criar seção detalhada da Versão 1.03.
5. **Arquivo Intermediário Obrigatório:**
   - Salvar cópia funcional em `intermediárias/aplicativo_v103_remocao_pautas_prefabricadas_autonomia.html`.
6. **Sincronização de Espelhos:**
   - `index.html` (raiz)
   - `gestor supervisao_patos/index.html`
   - `gestor supervisao_patos/firebase_deploy/public/index.html`

---

## 5. Seção Obrigatória de Auditoria: Alterações, Adições e Exclusões no Algoritmo de Auditoria

> **DIRETRIZ MANDATÓRIA (WORKFLOW_MACOS.md - Seções 2 e 6):**
> O algoritmo de auditoria da plataforma (`audit_platform.py` e testes modulares no `index.html`) deve garantir cobertura efetiva de 100% da plataforma com as alterações propostas.

### 5.1 Verificação no `audit_platform.py`:
- Nenhuma alteração de catálogo necessária, pois o Módulo 10 já cobre "Foco nos Menores Índices (Pilar 8)".

### 5.2 Alterações e Adições na Engine de Testes Modular do Browser (`index.html`):
No arquivo `index.html`, dentro de `runFullPlatformAudit()`, suíte do **Módulo 10 (`indicadores_decisao`)**:

#### A. Adição de Asserção Negativa Estrita (Garantia de Não Regressão):
Adicionar no Módulo 10 um teste assertivo garantindo que:
1. `getPedagogicalActionPrompt` não existe mais no escopo global (`typeof window.getPedagogicalActionPrompt === 'undefined'`).
2. O contêiner `.bottleneck-prompt-box` não é renderizado em nenhum dos cards de gargalo gerados no DOM.

```javascript
              // 9.1 PILAR 8 (AUTONOMIA PEDAGÓGICA): AUSÊNCIA DE PAUTAS PRÉ-FABRICADAS
              const hasPromptBox = bottlenecksSection.querySelector('.bottleneck-prompt-box');
              if (hasPromptBox !== null) {
                throw new Error('Falha Autonomia: Caixa .bottleneck-prompt-box ainda presente no DOM dos gargalos');
              }
              if (typeof getPedagogicalActionPrompt !== 'undefined') {
                throw new Error('Falha Autonomia: Função getPedagogicalActionPrompt ainda definida no escopo');
              }
              logger.log('Autonomia Formativa da Rede: confirmação de ausência de pautas pré-fabricadas no Bloco de Gargalos', true);
```

#### B. Resumo de Alterações na Auditoria:
| Tipo | Módulo | Descrição Técnica |
| :---: | :---: | :--- |
| **ADIÇÃO** | `index.html` (Módulo 10) | Asserção negativa comprovando a ausência física de `.bottleneck-prompt-box` no DOM |
| **ADIÇÃO** | `index.html` (Módulo 10) | Asserção comprovando a eliminação da função `getPedagogicalActionPrompt` |
| **PRESERVAÇÃO** | `index.html` (Módulo 10) | Preservação de todos os demais testes: cálculo dos 3 gargalos, alternância de modos (`absolute` vs `delta`) e deep-linking com destaque no Afunilamento |

---

## 6. Checklist de Execução para a Etapa 2 (Operário)

- [ ] Executar `git pull origin main` no início da tarefa.
- [ ] Remover a classe CSS `.bottleneck-prompt-box` de `index.html`.
- [ ] Remover a função `getPedagogicalActionPrompt` e suas referências.
- [ ] Remover o bloco `<div class="bottleneck-prompt-box">` de `renderBottlenecksPrioritySection`.
- [ ] Limpar o payload textual de `copyMeetingAgendaToClipboard` e renomear botão para `📋 Copiar Diagnóstico`.
- [ ] Atualizar o subtítulo de `#indicatorsSectionBottlenecks`.
- [ ] Adicionar asserção de teste negativo de autonomia no Módulo 10 do motor de auditoria de `index.html`.
- [ ] Atualizar o modal `#modalChangelog` e o botão de versão para `Versão 1.03 (v7.82)`.
- [ ] Atualizar o `CHANGELOG.md` com os detalhes da Versão 1.03.
- [ ] Aplicar dupla checagem visual e de integridade de código.
- [ ] Salvar cópia em `intermediárias/aplicativo_v103_remocao_pautas_prefabricadas_autonomia.html`.
- [ ] Sincronizar os arquivos espelho do projeto.
- [ ] Executar `python3 audit_platform.py` e verificar 100% de aprovação.
- [ ] Checagem de concorrência (`git fetch origin main`), commit semântico e push para `origin main`.
- [ ] Rodar auditoria pós-deploy (`python3 audit_platform.py --silent-on-success`) comunicando estritamente se houver falhas.
