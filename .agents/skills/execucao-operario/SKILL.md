---
name: execucao-operario
description: Protocolo da Etapa 2 (O Operário) para executar com precisão mecânica um plano de implementação aprovado no Gestor Supervisão Patos.
---

# Skill: Execução Mecânica Fiel (Etapa 2 - O Operário)

Esta skill orienta o assistente durante a **Etapa 2** do workflow, aplicando fielmente o plano de implementação.

## ⛔ Guardrails Invioláveis
1. **NÃO invente soluções ou refatore código fora do plano.** Siga as instruções do plano como verdade absoluta.
2. **NÃO abra o Google Chrome gráfico.**
3. **NUNCA faça commit antes da validação sintática (`python3 audit_platform.py --check-syntax`).**
4. **NUNCA esqueça a sincronização espelhada, o backup intermediário e o changelog duplo.**
5. **NUNCA sequestre a demanda entrando em loops de correção de auditoria:** Se a auditoria acusar erro não correlato à alteração (ex: teste pré-existente de outro módulo), NUNCA passe horas consertando a suíte. Reporte pontualmente ao usuário e finalize a entrega pontual em 2 a 3 minutos.
6. **NUNCA use comandos Git/shell interativos:** Use sempre `--no-pager` para evitar travamentos de background.

## Checklist Passo a Passo Obrigatório

1. **Sincronização Inicial:**
   ```bash
   git pull origin main
   ```
2. **Aplicação do Código:**
   - Modificar estritamente as linhas e blocos indicados no plano em `index.html`.
3. **Dupla Checagem:**
   - Reler os blocos modificados para garantir que foram salvos com integridade.
4. **Validação Sintática Pré-Voo (JSC):**
   ```bash
   python3 audit_platform.py --check-syntax
   ```
   *Se falhar, corrija a sintaxe imediatamente antes de prosseguir.*
5. **Sincronização de Cópias Espelhadas:**
   - Copiar `index.html` para `gestor supervisao_patos/index.html`.
   - Copiar `index.html` para `gestor supervisao_patos/firebase_deploy/public/index.html`.
6. **Backup Intermediário:**
   - Salvar cópia em `intermediárias/aplicativo_v[N]_[descrição].html`.
7. **Gestão Dupla do Changelog:**
   - Atualizar `CHANGELOG.md` (tabela de sumário e seção com inclusões, alterações e exclusões).
   - Atualizar `index.html` (botão `.btn-changelog` e modal `#modalChangelog`).
8. **Checagem de Concorrência Pré-Push:**
   ```bash
   git fetch origin main
   git log HEAD..origin/main --oneline
   ```
   *Se houver commits remotos, integrar com `git pull --rebase origin main`.*
9. **Commit e Deploy (GitHub Pages):**
   ```bash
   git add .
   git commit -m "feat/fix: mensagem semântica objetiva"
   git push origin main
   ```
10. **Auditoria Pós-Deploy Silenciosa:**
    ```bash
    python3 audit_platform.py --silent-on-success
    ```
    - Se aprovada: reportar apenas a aprovação sucinta e deploy concluído.
    - Se reprovada: relatar exclusivamente as falhas pontuais.
