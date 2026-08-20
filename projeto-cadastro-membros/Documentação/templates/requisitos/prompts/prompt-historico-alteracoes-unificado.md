# Prompt Unificado: Histórico de Alterações

## Objetivo da Seção

Registrar, de forma resumida e rastreável, as alterações **FUNCIONAIS** ou **DOCUMENTAIS** realizadas neste requisito ao longo do tempo.

---

## Público-Alvo

PÚBLICO-ALVO: **FUNCIONAL / TÉCNICO**

---

## Caráter da Seção

Esta seção é **OBRIGATÓRIA** para todo requisito.

---

## Regras Obrigatórias

- Toda alteração relevante no requisito **DEVE** ser registrada.
- Cada linha representa uma alteração lógica do requisito, normalmente associada a um PR ou conjunto de commits.
- **Não** registrar detalhes técnicos de implementação.
- **Não** utilizar descrições genéricas como "ajustes", "correções" ou "alterações gerais".

---

## Formato dos Campos

- **Data:** data da alteração no formato **DD/MM/AAAA**.
- **Card Jira:** ID do card relacionado ou **"N/A"** quando não aplicável.
- **Autor:** nome do responsável pela alteração.
- **Descrição da Alteração:**
  - frase curta e objetiva,
  - descrevendo **O QUE** mudou no requisito,
  - evitando **COMO** foi implementado.

---

## Versionamento

- Alterações que impactam o comportamento funcional **devem refletir incremento de versão** conforme o padrão adotado.
- Alterações puramente textuais ou de clareza **devem ser registradas** sem alterar o comportamento descrito.

---

## Formato Recomendado (Tabela)

```markdown
| Data | Card Jira | Autor | Descrição da Alteração |
| --- | --- | --- | --- |
| 01/02/2026 | ABC-123 | João Silva | Ajuste no fluxo de validação de pagamento |
```

---

## Checklist de Validação

- [ ] A seção está presente no requisito
- [ ] Cada alteração relevante foi registrada
- [ ] Descrições são objetivas e não técnicas
- [ ] Datas estão no formato DD/MM/AAAA
- [ ] Versionamento foi aplicado quando necessário

---

