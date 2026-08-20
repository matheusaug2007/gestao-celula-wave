# Prompt Unificado: Mensagens e Estados

## Objetivo da Seção

Documentar apenas os **ESTADOS RELEVANTES** da funcionalidade e as **MENSAGENS** associadas a esses estados, quando eles impactarem o comportamento do sistema, o fluxo do usuário ou a tomada de decisão.

---

## Critério para Listar um Estado

Um estado **DEVE** ser listado apenas se:

- alterar o comportamento do sistema, ou
- alterar o fluxo da funcionalidade, ou
- exigir uma ação específica do usuário, ou
- representar uma condição de erro ou bloqueio relevante.

### NÃO LISTAR

- estados triviais ou implícitos
  (ex.: "sucesso", "erro genérico", "processado")
- estados que não alteram comportamento.

---

## Instruções de Escrita

- Liste os estados em **negrito**.
- Para cada estado, descreva:
  - a condição que gera o estado
  - o comportamento esperado do sistema
  - a mensagem exibida ao usuário, quando aplicável
- Utilize linguagem objetiva e funcional.

---

## Formato Recomendado

```markdown
- **Nome do Estado**
  - **Condição:** <o que gera o estado>
  - **Comportamento do sistema:** <o que o sistema faz>
  - **Mensagem exibida (quando aplicável):** <mensagem>
```

---

## Exemplos Práticos

### Exemplo 1: Listagem

```markdown
- **Lista com resultados**
  - **Condição:** Existirem registros compatíveis com os filtros aplicados.
  - **Comportamento do sistema:** Exibir a listagem com os registros retornados.
  - **Mensagem exibida:** Não se aplica.

- **Lista vazia**
  - **Condição:** Não existirem registros compatíveis com os filtros aplicados.
  - **Comportamento do sistema:** Exibir a listagem sem registros.
  - **Mensagem exibida:** “Nenhum resultado encontrado”.
```

### Exemplo 2: Acesso negado

```markdown
- **Sem permissão**
  - **Condição:** Usuário sem a permissão necessária para acessar a funcionalidade.
  - **Comportamento do sistema:** Impedir o acesso à funcionalidade.
  - **Mensagem exibida:** “Acesso não autorizado”.
```

---

## Relação com Outras Seções

- Esta seção **NÃO substitui** os Critérios de Aceite.
- Se um estado exigir validação formal, ele **DEVE** ser referenciado também nos Critérios de Aceite.

---

## Checklist de Validação

- [ ] Apenas estados relevantes foram listados
- [ ] Cada estado descreve condição, comportamento e mensagem (quando aplicável)
- [ ] Não há estados triviais ou implícitos
- [ ] Linguagem objetiva e funcional
- [ ] Estados críticos estão refletidos nos Critérios de Aceite, quando necessário

---

