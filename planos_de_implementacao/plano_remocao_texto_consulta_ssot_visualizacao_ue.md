# PLANO DE IMPLEMENTAÇÃO: Remoção do Texto Informativo de Modo de Consulta SSOT da Visualização da UE

## 1. Identificação da Demanda e Diagnóstico Estrutural
- **Solicitação do Usuário:**
  Retirar o texto `"🔒 Modo de Consulta SSOT: Visualização centralizada de turmas e regências conectadas em tempo real. A enturmação e gestão de turmas são de autonomia exclusiva da Coordenação Pedagógica da escola."` da visualização da UE. Somente retirar esse texto.
- **Localização no Código:**
  No modal `#modalViewUnitClasses` (Modal de Visualização de Turmas e Regências da Escola pelo Núcleo de EI):
  ```html
  <!-- Rodapé com Badge de Governança Institucional e Botão de Fechar -->
  <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; border-top:1px solid var(--border); padding-top:12px;">
    <div style="font-size:11px; color:var(--text-secondary); max-width:540px; line-height:1.4;">
      🔒 <strong>Modo de Consulta SSOT:</strong> Visualização centralizada de turmas e regências conectadas em tempo real. A enturmação e gestão de turmas são de autonomia exclusiva da Coordenação Pedagógica da escola.
    </div>
    <button class="btn btn-secondary" onclick="closeViewUnitClassesModal()">Fechar Visualização</button>
  </div>
  ```
- **Ação Requerida:**
  Remover estritamente a div contendo o texto informativo `"🔒 Modo de Consulta SSOT: Visualização centralizada de turmas e regências conectadas em tempo real. A enturmação e gestão de turmas são de autonomia exclusiva da Coordenação Pedagógica da escola."`.
  Ajustar o rodapé para alinhar o botão "Fechar Visualização" à direita (`justify-content: flex-end;`).

---

## 2. Escopo Cirúrgico de Modificações

### Arquivos Alvo:
1. `index.html`
2. `gestor supervisao_patos/index.html` (cópia espelho)
3. `gestor supervisao_patos/firebase_deploy/public/index.html` (cópia espelho)

### Modificação Específica no HTML:
Substituir o bloco:
```html
      <!-- Rodapé com Badge de Governança Institucional e Botão de Fechar -->
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; border-top:1px solid var(--border); padding-top:12px;">
        <div style="font-size:11px; color:var(--text-secondary); max-width:540px; line-height:1.4;">
          🔒 <strong>Modo de Consulta SSOT:</strong> Visualização centralizada de turmas e regências conectadas em tempo real. A enturmação e gestão de turmas são de autonomia exclusiva da Coordenação Pedagógica da escola.
        </div>
        <button class="btn btn-secondary" onclick="closeViewUnitClassesModal()">Fechar Visualização</button>
      </div>
```
Por:
```html
      <!-- Rodapé com Botão de Fechar -->
      <div style="display:flex; justify-content:flex-end; align-items:center; flex-wrap:wrap; gap:10px; border-top:1px solid var(--border); padding-top:12px;">
        <button class="btn btn-secondary" onclick="closeViewUnitClassesModal()">Fechar Visualização</button>
      </div>
```

---

## 3. Alterações / Adições / Exclusões no Algoritmo de Auditoria (`audit_platform.py`)
- O algoritmo atual não possui asserção obrigatória do texto que será removido (verificado via grep: não há ocorrência de "Modo de Consulta" em `audit_platform.py`).
- Adicionaremos uma verificação no Módulo 14 / Auditoria de Governança ou Módulo 12 garantindo que o texto `Modo de Consulta SSOT` foi expurgado com sucesso de `index.html`.

---

## 4. Checklist da Etapa 2 (Operário)
1. Criar backup intermediário: `intermediárias/aplicativo_v145_remocao_texto_consulta_ssot_visualizacao_ue.html`.
2. Aplicar modificação cirúrgica em `index.html` e nas cópias espelhadas.
3. Atualizar versão para **1.45 (v8.2.12)**:
   - No cabeçalho `.btn-changelog` de `index.html`.
   - No `#modalChangelog` de `index.html`.
   - No `CHANGELOG.md`.
4. Validar sintaxe JSC: `python3 audit_platform.py --check-syntax`.
5. Checagem pré-push (`git fetch origin main`).
6. Commit e Push: `git push origin main`.
7. Pós-Deploy: `python3 audit_platform.py --silent-on-success`.
