# 🤖 Convenções de Nomenclatura para Agentes

Este documento define os padrões oficiais para criação, nomenclatura e estruturação de agentes customizados no GitHub Copilot.

---

## 1. Nomenclatura de Arquivos

### Formato Obrigatório
```
<descricao-funcao>.agent.md
```

**Regras:**
- Nome em **kebab-case** (minúsculas separadas por hífen)
- Descreve a **função ou responsabilidade** do agente
- Extensão obrigatória: `.agent.md`
- Máximo 4 palavras no nome

### Exemplos Válidos ✅

- `commit-padronizado.agent.md` — Agente para commits Git padronizados
- `revisor-requisitos.agent.md` — Agente para revisão de requisitos
- `gerador-documentacao.agent.md` — Agente para gerar documentação
- `validador-estrutura.agent.md` — Agente para validar estrutura de arquivos

### Exemplos Inválidos ❌

- `CommitPadronizado.agent.md` — Usa PascalCase
- `commit_padronizado.agent.md` — Usa underscore
- `agente-de-commit-padronizado-completo.agent.md` — Nome muito longo
- `cp.agent.md` — Sigla não descritiva
- `commit-padronizado.md` — Falta extensão `.agent.md`

---

## 2. Estrutura do Frontmatter YAML

Todo agente deve iniciar com um bloco YAML delimitado por `---` contendo metadados obrigatórios.

### Template Completo

```yaml
---
name: Nome do Agente
description: "Use quando: [descrição clara de quando invocar este agente]"
tools: [lista, de, ferramentas]
argument-hint: "Dica sobre os argumentos esperados (opcional)"
user-invocable: true
---
```

### Campos Obrigatórios

#### `name` (obrigatório)
- **Formato:** Title Case (primeira letra de cada palavra maiúscula)
- **Descrição:** Nome legível do agente para exibição
- **Exemplos:**
  - ✅ `Commit Padronizado`
  - ✅ `Revisor de Requisitos`
  - ✅ `Gerador de Documentação`
  - ❌ `commit-padronizado` (kebab-case não é permitido)
  - ❌ `COMMIT PADRONIZADO` (all caps não é permitido)

#### `description` (obrigatório)
- **Formato:** Frase descritiva iniciando com "Use when:" ou "Use quando:"
- **Descrição:** Explica quando o agente deve ser invocado
- **Deve conter:** Contexto claro, ações esperadas, limitações
- **Exemplos:**
  ```yaml
  description: "Use quando: realizando commit padronizado com revisão de alterações"
  description: "Use when: reviewing functional requirements and identifying gaps"
  ```

#### `tools` (obrigatório)
- **Formato:** Lista YAML de strings
- **Valores permitidos:**
  - `read` — Leitura de arquivos
  - `write` — Escrita/edição de arquivos
  - `execute` — Execução de comandos/terminal
  - `search` — Busca semântica e grep
  - `web` — Acesso à web (quando disponível)
- **Exemplos:**
  ```yaml
  tools: [read, search]
  tools: [execute, read, search]
  tools: [read, write, search]
  ```

#### `user-invocable` (obrigatório)
- **Formato:** Boolean (`true` ou `false`)
- **Descrição:** Define se o usuário pode invocar o agente diretamente
- **Valor padrão recomendado:** `true`

#### `argument-hint` (opcional, mas recomendado)
- **Formato:** String descritiva
- **Descrição:** Orienta o usuário sobre quais argumentos fornecer
- **Exemplos:**
  ```yaml
  argument-hint: "Informe o caminho do requisito e o contexto da feature"
  argument-hint: "Não requer argumentos - analisa alterações Git automaticamente"
  ```

---

## 3. Estrutura do Conteúdo

Após o frontmatter YAML, o agente deve conter:

### 3.1 Título Principal
```markdown
# Agente de [Nome da Função]
```
Ou
```markdown
# [Nome do Agente]
```

### 3.2 Descrição do Papel
Um ou dois parágrafos explicando:
- Qual é o papel do agente
- O que ele faz e não faz
- Restrições importantes

**Exemplo:**
```markdown
Você é um especialista em padronização de commits Git conforme o **GIT_WORKFLOW.md** 
deste repositório. Seu trabalho é revisar alterações, padronizar a mensagem de commit 
em **português**, adicionar arquivos (respeitando `.gitignore`), executar commit e push.
```

### 3.3 Seções Estruturadas

Organize o conteúdo em seções claras:

- **Objetivo** — O que o agente deve alcançar
- **Fluxo de Trabalho** — Passos que o agente executa
- **Regras e Constraints** — Restrições e validações
- **Formato de Saída** — Como o agente deve responder
- **Exemplos** — Casos de uso práticos (quando aplicável)

---

## 4. Localização dos Arquivos

### Estrutura de Pastas
```
.github/
├── agents/
│   ├── README.md                      # Índice de agentes
│   ├── commit-padronizado.agent.md
│   ├── revisor-requisitos.agent.md
│   ├── [outro-agente].agent.md
│   ├── docs/                          # Documentação
│   │   └── AGENT_CONVENTIONS.md       # Este documento
│   ├── prompts/                       # Prompts reutilizáveis
│   │   └── [nome-prompt].prompt.md
│   └── skills/                        # Skills especializadas
│       └── [nome-skill].skill.md
```

### Regras de Localização

- ✅ Todos os agentes em `.github/agents/`
- ✅ Documentação em `.github/agents/docs/`
- ✅ Prompts em `.github/agents/prompts/`
- ✅ Skills em `.github/agents/skills/`
- ❌ Não criar subpastas adicionais sem justificativa
- ❌ Não colocar agentes na raiz ou em outras pastas
- ⚠️ Arquivos `.md` que não são agentes devem ficar em `docs/` para não aparecer como invocáveis

---

## 5. Boas Práticas

### 5.1 Nomenclatura Clara e Descritiva
- Use nomes que indiquem claramente a função do agente
- Prefira substantivos ou adjetivos + substantivos
- Evite verbos no nome do arquivo (use no campo `description`)

### 5.2 Responsabilidade Única
- Cada agente deve ter **uma responsabilidade bem definida**
- Não crie agentes genéricos que fazem "tudo"
- Se um agente ficou complexo demais, considere dividir em dois

### 5.3 Documentação Completa
- Documente todas as regras e restrições
- Inclua exemplos de uso quando apropriado
- Seja explícito sobre o que o agente **não faz**

### 5.4 Consistência com Padrões do Repositório
- Agentes devem seguir os padrões definidos em `.luby/luby-spec-kit/`
- Referencie documentos oficiais quando necessário
- Mantenha alinhamento com convenções gerais do projeto

### 5.5 Manutenibilidade
- Mantenha o código do agente simples e direto
- Prefira instruções claras a lógica complexa
- Facilite futuras atualizações

---

## 6. Exemplo Completo

```markdown
---
name: Commit Padronizado
description: "Use quando: realizando commit padronizado com revisão de alterações, padronizando título e descrição segundo GIT_WORKFLOW.md"
tools: [execute, read, search]
argument-hint: "Não requer argumentos - analisa alterações Git automaticamente"
user-invocable: true
---

# Agente de Commit Padronizado

Você é um especialista em padronização de commits Git conforme o **GIT_WORKFLOW.md** 
deste repositório. Seu trabalho é revisar alterações, padronizar a mensagem de commit 
em **português**, adicionar arquivos (respeitando `.gitignore`), executar commit e push.

## Objetivo
Garantir que todos os commits sigam o padrão definido no GIT_WORKFLOW.md.

## Fluxo de Trabalho
1. Revisar alterações com `git status` e `git diff`
2. Selecionar prefixo apropriado (spec/fix/docs/chore)
3. Criar mensagem padronizada
4. Executar commit e push

## Regras
- SEMPRE use prefixos válidos: spec, fix, docs, chore
- NUNCA exceda 50 caracteres no título
- SEMPRE respeite `.gitignore`

## Formato de Saída
1. Resumo das alterações
2. Mensagem de commit proposta
3. Confirmação de execução
```

---

## 7. Checklist de Validação

Antes de criar ou modificar um agente, valide:

- [ ] Nome do arquivo em kebab-case com extensão `.agent.md`
- [ ] Frontmatter YAML completo e válido
- [ ] Campo `name` em Title Case
- [ ] Campo `description` claro e iniciando com "Use quando:"
- [ ] Campo `tools` com lista apropriada
- [ ] Campo `user-invocable` definido
- [ ] Conteúdo estruturado com seções claras
- [ ] Documentação de regras e constraints
- [ ] Alinhamento com padrões do repositório
- [ ] Arquivo localizado em `.github/agents/`

---

## 8. Versionamento e Histórico

- Alterações nos agentes devem seguir o padrão de commit do projeto
- Use prefixo `chore:` para criação/modificação de agentes
- Documente mudanças significativas no corpo do commit

**Exemplo de commit:**
```
chore: adicionar agente de validacao de estrutura

- Cria agente validador-estrutura.agent.md
- Valida conformidade com FILE_STRUCTURE.md
- Ferramentas: read, search
```

---

