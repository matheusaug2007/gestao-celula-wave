[Cadastro Membros](../../README.md) > [Spec Kit](./README.md) > **Git Workflow**

---

# 🔄 Workflow Git e Padrões de Commit

Diretrizes para uso de Git, branches e commits neste repositório.

## 1. Estratégia de Branches

### Branches Permanentes

#### `main` – Produção Oficial
- Documentação oficial da **versão do produto publicada em produção**
- Requisitos que **já foram desenvolvidos, testados, homologados e aceitos**
- Sempre estável e rastreável
- Protegida, requer PR com aprovação
- Histórico limpo com tags para releases
- **Versão**: X.0 (ex: 1.0, 2.0)

#### `spec-approved` – Especificações Aprovadas
- Requisitos cuja **especificação foi aprovada pelo cliente**
- Liberados para **planejamento e desenvolvimento** pelo time
- Base oficial para DEV, QA e homologação iniciarem o trabalho
- Protegida, requer PR com aprovação
- **Versão**: X.Y (ex: 1.1, 1.2)

### Branches Temporárias (Isoladas)
Sempre nascem a partir de `spec-approved` e encerram com merge em `spec-approved`.

Formato obrigatório:
```
<prefixo>/<ID-Jira>-<descricao-curta>
```

Prefixos permitidos:
```
spec/<ID-Tarefa>-<descricao>       – Especificação de requisitos
discovery/<ID-Tarefa>-<descricao>  – Estudos exploratórios
bug/<ID-Tarefa>-<descricao>        – Correção de erros
hotfix/<ID-Tarefa>-<descricao>     – Correções urgentes (merge direto em main)
chore/<ID-Tarefa>-<descricao>      – Manutenção organizacional
```

> **Importante:** O `<ID-Tarefa>` deve ser o **ID da tarefa de especificação criada pelo PO**, não do Épico/História de tema. Isso permite rastrear cada iteração/versão dos requisitos independentemente.

Exemplos:
```
spec/DCU-604-cadastro-ec        (Tarefa de especificação inicial)
spec/DCU-721-validacao-ec       (Tarefa de ajuste/evolução do mesmo tema)
discovery/DCU-800-estudo-integracao
bug/DCU-1050-corrigir-regra
```

### Relação com Jira

```
Épico/História (DCU-500): Cadastro de Estabelecimentos Comerciais
  ├─ Tarefa DCU-604: Especificação inicial → Branch: spec/DCU-604-cadastro-ec
  └─ Tarefa DCU-721: Ajuste de regras   → Branch: spec/DCU-721-validacao-ec
```

Cada tarefa de especificação representa um **momento específico** do projeto. Se o objetivo muda significativamente, o PO cria uma **nova tarefa** em vez de reutilizar a anterior, mantendo o histórico limpo.

### Ciclo de Vida da Documentação

A documentação progride através das branches conforme o projeto evolui:

| Fase | Branch | Status | Consumidor | O que Representa |
|------|--------|--------|-----------|-----------------|
| **Descoberta/Definição** | `discovery/`,`spec/` | 🔄 Em desenvolvimento | Autor, Revisores | Ideias e requisitos em validação |
| **Aprovação/Homologação** | `spec-approved` | ✅ Aprovado | Time DEV, QA | Requisitos que o time vai implementar |
| **Publicação** | `main` | 📦 Publicado | Usuários, Stakeholders | Documentação do que já foi entregue em produção |

**Importante:** A documentação está **sempre disponível para usuários com acesso**, mas o que muda é o **estado de evolução** do projeto que ela descreve.

## 2. Fluxo de Branches

### 1️⃣ Criar Branch
```bash
# Sincronize spec-approved (sempre!)
git checkout spec-approved
git pull origin spec-approved

# Obtenha o ID da tarefa de especificação do PO (ex: DCU-604, DCU-721)
# A branch nasce com ESTE ID (não do Épico/História de tema)

# Crie nova branch a partir de spec-approved
git checkout -b spec/DCU-604-cadastro-ec

# Padrão: <prefixo>/<ID-Tarefa>-<descricao>
```

### 2️⃣ Trabalhar Localmente
```bash
# Faça suas alterações
# Edite arquivos, crie novos arquivos

# Verifique status
git status

# Adicione arquivos
git add .

# Commit (veja seção 4 – Padrões de Commit)
git commit -m "spec: detalhar regras de ativacao de pdv"
```

### 3️⃣ Push e Pull Request
```bash
# Push para repositório remoto
git push origin spec/DCU-604-cadastro-ec

# Abra PR no GitHub apontando para spec-approved com:
# - Título: DCU-604 | Especificação: Cadastro de EC
# - Descrição: Contexto, mudanças, arquivos impactados
# - Link para a Tarefa de Especificação no Jira (não apenas o Épico)
# - Checklist de verificação
```

### 4️⃣ Revisão e Merge
```bash
# Após aprovação de 2+ reviewers

# No GitHub:
# 1. Clique em "Squash and merge" (preferido)
# 2. Verifique a mensagem final do commit
# 3. Confirme merge em spec-approved

# Localmente: Delete branch local
git branch -d spec/DCU-604-cadastro-ec
```

### 5️⃣ Promoção de spec-approved → main (Publicação Oficial)
```bash
# Quando a feature foi desenvolvida, testada e homologada em produção
# Criar PR: spec-approved → main
#
# Requisitos para merge:
# - Documentação validada e aprovada
# - Feature foi implementada e testada
# - Versão incrementada no cabeçalho (X.Y → X+1.0)
# - Todas as features de uma release incluídas

# Após merge em main:
# - Criar release tag (git tag -a v1.0)
# - Documentação agora reflete o estado da produção
```

## 4. Padrões de Commit

### Formato Obrigatório
```
<prefixo>: <titulo>

<descrição detalhada (opcional, quando impacto relevante)>
```

Onde:
- `<prefixo>`: spec | fix | docs | chore (não use feat, refactor, test)
- `<titulo>`: ação clara, máximo 50 caracteres, sem ponto final

### Prefixos Permitidos

| Prefixo | Uso | Exemplo |
|---------|-----|---------|
| **`spec`** | Inclusão/alteração de requisitos (regras, fluxos, critérios) | `spec: detalhar regras de ativacao de pdv` |
| **`fix`** | Correção de erro documental (regra descrita incorretamente, link quebrado) | `fix: corrigir link do modulo de seguranca` |
| **`docs`** | Ajustes textuais e organização geral (sem alterar requisitos) | `docs: ajustar introducao da documentacao` |
| **`chore`** | Manutenção técnica (pastas, renomeações, padronizações) | `chore: padronizar nomes de arquivos do modulo ec` |

### Exemplos ✅ Válidos

```bash
# Novo requisito
spec: detalhar regras de ativacao de pdv

# Correção de erro
fix: corrigir link do modulo de seguranca

# Documentação geral
docs: ajustar introducao da documentacao

# Manutenção organizacional
chore: padronizar nomes de arquivos do modulo ec

# Com descrição detalhada
spec: detalhar fluxo de transacao

Inclui pré-condições, validações e critérios de aceite.
Alinha o fluxo com o atendimento do Suporte MDC.
```

### Exemplos ❌ Inválidos

```bash
# Muito genérico
atualizacao

# Sem prefixo
documentacao atualizada

# Muito longo (>50 caracteres)
docs: atualizacao completa do repositorio com varias melhorias

# Com ID numérico (evitar)
spec(REQ-001): adiciona autenticacao
```

## 5. Convenção de Mensagens

### Regras Gerais

1. **Ação Clara no Infinitivo**
   - ✅ `spec: detalhar requisitos`
   - ❌ `spec: detalhando requisitos`

2. **Letra Minúscula no Início**
   - ✅ `spec: detalhar`
   - ❌ `spec: Detalhar`

3. **Sem Ponto Final**
   - ✅ `spec: detalhar regras de ativacao`
   - ❌ `spec: detalhar regras de ativacao.`

4. **Máximo 50 Caracteres (Título)**
   - Conte apenas a parte após o `:`
   - Use descrição detalhada para contexto adicional
   - ❌ `feat(REQ-001): adiciona autenticação.`

4. **Máximo 72 Caracteres** (primeira linha)
   - Garante visibilidade em ferramentas Git

5. **Corpo Detalhado** (quando necessário)
   - Deixe linha em branco entre título e corpo
   - Máximo 72 caracteres por linha
   - Explique O QUE e POR QUE, não COMO

## 5. Rebase e Merge Strategy

### Antes de Fazer Merge

```bash
# Sincronize com main
git fetch origin
git rebase origin/main

# Resolva conflitos se houver
git add .
git rebase --continue
```

### Estratégia de Merge no GitHub

- **Squash and Merge** (Preferido)
  - Limpa histórico de commits
  - Uma única mensagem no main
  - Use para features

- **Create a Merge Commit** (Quando necessário)
  - Mantém histórico completo
  - Use para grandes features ou releases

- **Rebase and Merge** (Raro)
  - Use para hot fixes urgentes

## 6. Histórico de Commits

### Visualizar Histórico
```bash
# Últimos 10 commits
git log -10 --oneline

# Com formatação prettier
git log --graph --oneline --all

# De uma branch específica
git log main --oneline
```

### Exemplo de Histórico Limpo
```
* 3f5a9c2 (main) spec: sincronização com sistema externo (v1.0)
* a7e2b1d (spec-approved) spec: ativação de terminal
* 8c4d6e5 spec: autenticação de operador
* 2b1f9a3 chore: organizar estrutura de pastas
```

## 7. Revertendo Commits

### Se Precisar Desfazer

```bash
# Desfazer último commit (não publicado)
git reset --soft HEAD~1

# Desfazer commit publicado (cria novo commit)
git revert <commit-hash>

# Desfazer múltiplos commits
git revert HEAD~3..HEAD
```

## 8. Tags e Releases

### Criar Tag
```bash
# Após merge de feature importante
git tag -a v1.0.0 -m "Release 1.0.0 - Features iniciais"
git push origin v1.0.0
```

### Padrão de Versionamento
```
v<major>.<minor>.<patch>

Exemplo:
v1.0.0 – Release inicial
v1.1.0 – Nova feature
v1.0.1 – Bug fix
```

## 9. Pull Request (PR)

### Título
```
<ID-Tarefa> | <descrição-curta>

Exemplo:
DCU-604 | Especificação: Cadastro de Estabelecimentos Comerciais
DCU-721 | Ajuste de Regras de Ativação de PDV
IDR-120 | Padronização da Estrutura de Pastas
```

> **Nota:** Use o ID da **Tarefa de Especificação** (criada pelo PO), não do Épico/História de tema.

### Descrição
```markdown
## Contexto
Breve resumo do que está sendo especificado.

## Relacionado a
- **Épico/Tema:** DCU-500 (Cadastro de EC)
- **Tarefa de Especificação:** DCU-604
- **Versão do Requisito:** v1.0 / v1.1

## Mudanças Realizadas
- Detalhar as alterações principais
- Listar arquivos impactados

## Tipo de Mudança
- [ ] Novo requisito (spec)
- [ ] Correção de erro (fix)
- [ ] Documentação geral (docs)
- [ ] Manutenção (chore)

## Jira
- **Tarefa:** [DCU-604](https://jira.url/DCU-604)
- **Épico:** [DCU-500](https://jira.url/DCU-500)

## Validações
- [ ] Nomenclatura segue padrões
- [ ] Estrutura de pastas respeitada
- [ ] Links e referências funcionando
- [ ] Ortografia e gramática OK
- [ ] Duas aprovações obtidas
```

## 10. Configuração Git (Opcional)

### Alias Úteis
```bash
# Adicione ao seu .gitconfig local

git config --local alias.l "log --oneline -10"
git config --local alias.s "status"
git config --local alias.p "push origin"
```

---
