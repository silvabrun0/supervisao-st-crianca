---
name: planejamento-arquiteto
description: Protocolo da Etapa 1 (O Arquiteto) para planejar intervenções no Gestor Supervisão Patos sem alterar código de produção.
---

# Skill: Planejamento Profundo (Etapa 1 - O Arquiteto)

Esta skill orienta o assistente durante a **Etapa 1** do workflow do projeto.

## ⛔ Guardrails Invioláveis
1. **NUNCA altere arquivos de código de produção (`index.html`, `audit_platform.py`).**
2. **NUNCA abra o Google Chrome gráfico** ou tente executar comandos de teste no navegador.
3. **NUNCA comite ou suba código.** A árvore do Git (`git status`) deve permanecer intacta ao final da Etapa 1.

## Roteiro de Ação
1. **Sincronização Inicial:**
   ```bash
   git pull origin main
   ```
2. **Investigação do Código:**
   - Usar ferramentas de leitura (`read_file`) e busca/grep (`run_command` com grep).
   - Localizar funções, variáveis, escopos e estruturas HTML envolvidas.
3. **Perspectiva Pedagógica e Decisória:**
   - Se a demanda envolver a aba de Indicadores ou visualizações, desenhar métricas orientadas estritamente a subsidiar tomadas de decisão da gestão e coordenação pedagógica.
4. **Elaboração do Documento do Plano:**
   - Salvar o documento em `./planos_de_implementacao/plano_[nome].md`.
   - Estrutura obrigatória:
     0. **Diretriz de Execução:** Instruir o executor a ler `WORKFLOW_MACOS.md` e a skill `execucao-operario`.
     1. **Diagnóstico e Contexto.**
     2. **Arquitetura e Pontos de Impacto.**
     3. **Especificação de Implementação Passo a Passo (snippets exatos).**
     4. **Critérios de Aceite e Roteiro de Teste.**
     5. **Seção Obrigatória de Auditoria:** Mapear alterações, inclusões e exclusões para o `audit_platform.py` e testes do `index.html`.
5. **Finalização:**
   - Apresentar o plano ao usuário e aguardar expressamente a ordem de execução (Etapa 2) antes de qualquer modificação em código.
