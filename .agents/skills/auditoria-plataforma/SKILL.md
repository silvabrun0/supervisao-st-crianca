---
name: auditoria-plataforma
description: Protocolo de auditoria modular da plataforma SerTão Criança, validação sintática pré-voo JSC e pós-deploy headless.
---

# Skill: Auditoria Modular da Plataforma

Esta skill rege a execução de testes automatizados e validações de integridade no projeto.

## ⛔ Guardrails Invioláveis
1. **NUNCA abra o Google Chrome gráfico** na máquina do usuário.
2. **NUNCA execute a suíte headless antes de validar a sintaxe** (`--check-syntax`).
3. **No pós-deploy, utilize SEMPRE `--silent-on-success`** e reporte SOMENTE problemas.
4. **PROIBIDO entrar em loop de refatoração autônoma da auditoria:** Se um teste falhar e for de módulo não relacionado à alteração pontual do usuário, registre apenas o relatório de falha para o usuário. NUNCA gaste tempo alterando `audit_engine.js` ou criando novos planos de teste sem autorização expressa.

## Comandos Oficiais da Suíte

### 1. Validação Sintática Pré-Voo (JSC - Sem Chrome)
Deve ser executada antes de qualquer commit:
```bash
python3 audit_platform.py --check-syntax
```
- Utiliza a engine JavaScriptCore (`jsc`) nativa do macOS.
- Retorna em ~100ms sem necessidade de porta HTTP ou browser.

### 2. Auditoria Pós-Deploy Silenciosa (Headless Chrome)
Executada imediatamente após `git push origin main`:
```bash
python3 audit_platform.py --silent-on-success
```
- Inicia servidor local efêmero e executa os 12 módulos em Chrome headless.
- Se 100% dos testes passarem, encerra silenciosamente com código de saída 0.
- Se houver falha, imprime o relatório de erros e encerra com código 1.

### 3. Execução de Módulo Isolado (Diagnóstico Rápido)
```bash
python3 audit_platform.py --module <nome_do_modulo>
```
Exemplo:
```bash
python3 audit_platform.py --module auth_rbac
```

### 4. Listagem de Módulos Oficiais
```bash
python3 audit_platform.py --list-modules
```
