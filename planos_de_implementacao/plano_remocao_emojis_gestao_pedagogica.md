# PLANO DE IMPLEMENTAÇÃO: Remoção de Emojis das Sub-abas da Gestão Pedagógica

## 1. Diagnóstico e Contexto
Na aba de **Gestão Pedagógica / Gestão da Rede**, os botões do seletor horizontal de sub-abas contêm ícones SVG vetoriais já embutidos (`.btn-icon`), mas dinamicamente recebem ou contêm rótulos com emojis em diferentes perfis de usuário (especialmente `isNucleoEI`).
Os rótulos citados pelo usuário:
1. `🏢 Unidades Escolares & Polos`
2. `🏫 Turmas da Rede Municipal`
3. `👥 Equipes & Servidores da Rede`
4. `Extrações & Relatórios SSO` (na marcação HTML: `<span>Extrações & Relatórios SSOT</span>`)

Adicionalmente, analisou-se o comportamento de `renderNavBar()`, onde o JavaScript reatribui dinamicamente os textos dos spans `#pedagTabUnitsLabel`, `#pedagTabClassesLabel` e `#pedagTabTeamLabel` dependendo do perfil de acesso:
- `coordenador`:
  - `pedagUnitsLabel`: `'🏢 Minha Escola'` -> Deve passar para `'Minha Escola'`
  - `pedagClassesLabel`: `'🏫 Turmas & Regência'` -> Deve passar para `'Turmas & Regência'`
  - `pedagTeamLabel`: `'👩‍🏫 Docentes da UE'` -> Deve passar para `'Docentes da UE'`
- `formador`:
  - `pedagUnitsLabel`: `'🏢 Escolas do Polo'` -> Deve passar para `'Escolas do Polo'`
  - `pedagClassesLabel`: `'🏫 Turmas do Polo'` -> Deve passar para `'Turmas do Polo'`
  - `pedagTeamLabel`: `'👥 Coordenações Pedagógicas'` -> Deve passar para `'Coordenações Pedagógicas'`
- `isNucleoEI`:
  - `pedagUnitsLabel`: `'🏢 Unidades Escolares & Polos'` -> Deve passar para `'Unidades Escolares & Polos'`
  - `pedagClassesLabel`: `'🏫 Turmas da Rede Municipal'` -> Deve passar para `'Turmas da Rede Municipal'`
  - `pedagTeamLabel`: `'👥 Equipes & Servidores da Rede'` -> Deve passar para `'Equipes & Servidores da Rede'`

Também na sub-aba de extrações (`#pedagViewExports`), há o card de exportação:
- `<div class="export-card-title">🏢 Unidades Escolares & Polos</div>` -> Higienizar para `Unidades Escolares & Polos`
- `<div class="export-card-title">👥 Servidores & Membros da Rede</div>` -> Higienizar para `Servidores & Membros da Rede`
- Outros cards similares da sub-aba de exportações para manter consistência profissional e visual padronizado.

## 2. Alterações Propostas

### 2.1 Em `index.html` e `firebase_deploy/public/index.html`
1. **Marcação HTML dos botões de sub-aba (linhas ~3739-3755):**
   - Garantir que `#pedagTabUnitsLabel`, `#pedagTabClassesLabel`, `#pedagTabTeamLabel` e o `span` de `#pedagTabExports` não possuam nenhum emoji em seus textos estáticos (já possuem os SVGs `.btn-icon`).
2. **Atualização Dinâmica dos Rótulos em `renderNavBar()` (linhas ~10651-10696):**
   - Remover os emojis dos textos atribuídos a `pedagUnitsLabel`, `pedagClassesLabel` e `pedagTeamLabel` para coordenador, formador e núcleo EI.
3. **Cards de Exportação em `#pedagViewExports`:**
   - Remover emojis redundantes dos títulos dos cards em `.export-card-title` (`Unidades Escolares & Polos`, `Servidores & Membros da Rede`, etc.).

## 3. Alterações / Adições / Exclusões no Algoritmo de Auditoria (`audit_platform.py`)
- O script `audit_platform.py` não valida a presença literal desses emojis nem busca pelos emojis nos botões da gestão pedagógica.
- Executar `python3 audit_platform.py --check-syntax` para validação léxica pré-commit.
- Nenhuma alteração é necessária no código de `audit_platform.py`.

## 4. Checklist da Etapa 2 (Operário)
- [ ] Criar backup em `intermediárias/aplicativo_v124_remocao_emojis_gestao_pedagocica.html`.
- [ ] Aplicar modificações em `index.html`.
- [ ] Espelhar as alterações em `firebase_deploy/public/index.html`.
- [ ] Executar `python3 audit_platform.py --check-syntax`.
- [ ] Atualizar o `CHANGELOG.md` e o modal de changelog no `index.html`.
- [ ] Realizar checagem pré-push (`git fetch origin main` e `git log HEAD..origin/main --oneline`).
- [ ] Commitar e fazer push para a branch `main`.
- [ ] Rodar `python3 audit_platform.py --silent-on-success` pós-deploy.
