# Prompt Unificado: Permissões e Regras de Acesso

## Objetivo da Seção

Registrar como o acesso às funcionalidades é controlado **ou**, quando aplicável, documentar explicitamente a **inexistência de controle de permissões**.

---

## Público-Alvo

PÚBLICO-ALVO: **FUNCIONAL / TÉCNICO**

---

## Quando Usar (Modelos)

### Modelo A — **Com controle de permissões**

Use quando houver perfis, papéis ou permissões que **restringem** acesso às funcionalidades.

### Modelo B — **Sem controle de permissões**

Use quando **não há diferenciação** de acesso entre usuários (todos acessam as mesmas funcionalidades). Nesse caso, **não criar tabela** de permissões.

---

## Regras Obrigatórias

- Não criar tabela de permissões quando **não existir diferenciação de acesso**.
- Não listar permissões CRUD quando elas **não forem aplicáveis**.
- Registrar explicitamente quando o acesso é **irrestrito**.
- Controles de acesso **externos** à aplicação (ex.: ativação, status de equipamento, vínculo com EC) **não** devem ser tratados como permissões de usuário.

---

## Formatos Recomendados

### Modelo A — Com permissão

```markdown
| Permissão | Descrição |
| --- | --- |
| PERMISSAO_VISUALIZAR | Descrição clara do que permite |
| PERMISSAO_CADASTRAR | Descrição clara do que permite |
| PERMISSAO_EDITAR | Descrição clara do que permite |
| PERMISSAO_EXCLUIR | Descrição clara do que permite |
```

**Observações:**
- Listar apenas as permissões **efetivamente usadas** neste requisito.
- Descrever o **alcance funcional** da permissão (não apenas o nome técnico).

### Modelo B — Sem permissão

```markdown
A aplicação **não possui controle de permissões por usuário**.

Uma vez que o sistema esteja devidamente operacional, **todas as funcionalidades disponíveis podem ser acessadas por qualquer operador**, não havendo diferenciação de acesso, perfis ou restrições funcionais no nível da aplicação.
```

---

## Checklist de Validação

- [ ] O modelo selecionado (com/sem permissão) é coerente com a funcionalidade
- [ ] Não há tabela quando o acesso é irrestrito
- [ ] Permissões listadas são apenas as aplicáveis ao requisito
- [ ] Descrições explicam o alcance funcional de cada permissão
- [ ] Controles externos não foram confundidos com permissões de usuário

---

