---
name: git-colaboracao
description: Protocolo de sincronização prévia, checagem pré-push de concorrência e deploy seguro via GitHub Pages.
---

# Skill: Colaboração Git e Deploy Seguro

Esta skill orienta as operações de versionamento e sincronização com o repositório remoto.

## Regras de Concorrência
1. **Puxe no início:** `git pull origin main` antes de qualquer análise ou edição.
2. **Cheque antes de subir:** `git fetch origin main` seguido de `git log HEAD..origin/main --oneline`.
3. **Integre via rebase se houverem novos commits do colega:**
   ```bash
   git pull --rebase origin main
   ```
4. **Commits semânticos:** Use mensagens claras com prefixos padrão (`feat:`, `fix:`, `docs:`, `test:`, `refactor:`).
5. **Deploy automático:** Ao enviar com `git push origin main`, o GitHub Pages atualiza a versão de produção automaticamente.
