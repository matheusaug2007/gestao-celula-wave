[Cadastro Membros](../../README.md) > [Spec Kit](./README.md) > **Guidelines**

---

# 📋 Guia Geral de Contribuição e Operação

Este arquivo contém as diretrizes gerais para contribuições e operação no repositório.

## 1. Princípios Gerais

- **Qualidade Primeiro** – Requisitos bem escritos economizam tempo em desenvolvimento
- **Rastreabilidade** – Toda mudança deve ser rastreável (Jira + Git)
- **Consistência** – Seguir padrões garante legibilidade
- **Evolução Governada** – Documentação é versionada e controlada

## 1.1 Estratégia de Branches

O repositório utiliza a seguinte estratégia para documentação:

| Branch | Propósito | Status | O Que Representa |
|--------|-----------|--------|-----------------|
| **`main`** | Documentação oficial da versão publicada em produção | ✅ Publicado | Requisitos já desenvolvidos, testados e homologados |
| **`spec-approved`** | Requisitos aprovados pelo cliente, prontos para DEV começar | ✅ Aprovado | Funcionalidades que o time vai implementar |
| **Branches isoladas** | Trabalho em andamento (spec, discovery, bug, hotfix, chore) | 🔄 Em definição | Ideias e requisitos em validação |

**Ciclo de Evolução:**
```
spec/DCU-604 → spec-approved → main
(Em definição)  (Aprovado) (Publicado)
```

**Fluxo essencial:**
1. Branches **isoladas nascem sempre a partir de `spec-approved`**
2. Ao concluir, fazem **merge em `spec-approved`** (cliente aprova)
3. Após implementado em produção, `spec-approved` faz **merge em `main`** (documenta o que foi entregue)
4. **Nunca fazer commit direto** em `main` ou `spec-approved`

**Importante:** A documentação está **sempre disponível para usuários**, mas reflete o **estado de evolução** do projeto em cada branch.

Para detalhes completos, consulte [GIT_WORKFLOW.md](./GIT_WORKFLOW.md).

## 1.2 Modelo de Cards no Jira

### Estrutura de Cards

O Jira utiliza uma **hierarquia de cards** para rastrear funcionalidades e suas evoluções:

```
📌 Épico ou História (Card de Tema)
   ├─ 🎯 Tarefa de Especificação #1 (versão inicial)
   │   └─ Branch: spec/DCU-604-v1
   │
   ├─ 🎯 Tarefa de Especificação #2 (ajustes)
   │   └─ Branch: spec/DCU-605-v2
   │
   └─ 🎯 Tarefa de Especificação #3 (evolução)
       └─ Branch: spec/DCU-606-v3
```

### Por que essa estrutura?

- **Card de Tema (Épico/História):** Representa a **funcionalidade geral** e seu objetivo estratégico
- **Tarefa de Especificação:** Criada pelo PO para cada **iteração ou versão** dos requisitos
- **Branch:** Usa o ID da **tarefa de especificação**, não do tema

### Benefícios

✅ **Rastreabilidade completa:** Cada versão da especificação tem seu próprio card e branch  
✅ **Histórico limpo:** Quando o objetivo muda, uma nova tarefa é criada (não polui o card original)  
✅ **Governança clara:** Cada tarefa = um momento específico da definição  
✅ **Flexibilidade:** O projeto pode evoluir sem perder o histórico

### Exemplo Prático

```
Épico: DCU-500 (Cadastro de Estabelecimentos Comerciais)
  ├─ Tarefa: DCU-604 (Especificação inicial)
  │  └─ Branch: spec/DCU-604-cadastro-ec
  │  └─ Resultado: Merge em spec-approved (v0.1)
  │
  └─ Tarefa: DCU-721 (Ajuste de regras de validação)
     └─ Branch: spec/DCU-721-validacao-ec
     └─ Resultado: Merge em spec-approved (v0.2)
     └─ Após publicação em main: v1.0
```

**Significado das versões:**
- **v0.Y** = Funcionalidade em homologação, ainda não publicada em produção (X=0)
- **v1.0+** = Funcionalidade já foi publicada (X≥1)

## 2. Fluxo de Contribuição

### Passo 1: Preparação
1. Acesse o card Jira relacionado
2. Crie uma branch a partir de `spec-approved` seguindo [GIT_WORKFLOW.md](./GIT_WORKFLOW.md)
3. Consulte o template de requisitos apropriado em `Documentação/templates/`

### Passo 2: Desenvolvimento
1. Crie ou edite arquivos seguindo [NAMING_CONVENTIONS.md](./NAMING_CONVENTIONS.md)
2. Mantenha a estrutura definida em [FILE_STRUCTURE.md](./FILE_STRUCTURE.md)
3. Selecione o template mais apropriado conforme o tipo de requisito em `Documentação/templates/requisitos/`
4. Verifique os padrões em [STANDARDS.md](./STANDARDS.md)

### Passo 3: Commit e Push
1. Commit seguindo [GIT_WORKFLOW.md](./GIT_WORKFLOW.md)
2. Push para sua branch
3. Abra um Pull Request com descrição clara
4. Aguarde revisão de pelo menos um aprovador

### Passo 4: Merge
1. Após aprovação, merge via GitHub
2. Delete a branch remota
3. Atualize o card Jira com links

## 3. Tipo de Contribuições

Este repositório aceita diferentes tipos de contribuições, cada uma com regras específicas.
Apesar das particularidades, **todas seguem um conjunto comum de práticas obrigatórias**, descritas ao final desta seção.

### 📝 Novo Requisito

**Quando usar:**  

Criação de uma nova funcionalidade, tela, fluxo ou processo ainda inexistente na documentação do produto.

**Pré-requisitos:**
- Obrigatório: card Jira do tipo *Tarefa de Especificação*, vinculado ao tema funcional.
- Consulte [1.2 Modelo de Cards no Jira](#12-modelo-de-cards-no-jira) para entender como a tarefa deve ser criada

**Branch:**
- Criar a partir de `spec-approved`.
- Nome obrigatório: `spec/<ID-Jira>-<descricao-curta>`
- Consulte [GIT_WORKFLOW.md](./GIT_WORKFLOW.md) para mais informações

**Template:**
- Selecionar o template mais apropriado conforme o tipo de requisito:
  - **Requisito Base**: `Documentação/templates/requisitos/base/template-requisito-base.md`
  - **Tipo A (CRUD)**: `Documentação/templates/requisitos/tipo-a/<ação>/` (criar, editar, listar, visualizar)
  - **Tipo B (Capacidade)**: `Documentação/templates/requisitos/tipo-b/`

**Local do arquivo:**
- Salvar em: `requisitos/<tipo>/<modulo>/`

- Exemplo: `requisitos/funcionais/` ou `requisitos/técnicos/`

- Seguir o padrão definido em [FILE_STRUCTURE.md](./FILE_STRUCTURE.md).

**Nomenclatura do arquivo:**
- Seguir obrigatoriamente o padrão definido em [NAMING_CONVENTIONS.md](./NAMING_CONVENTIONS.md).
- Exemplo: `autenticacao-usuario.md`, `ativacao-terminal.md`
- Não incluir IDs numéricos (ex: REQ-001) no nome do arquivo

**Versão:**
- Iniciar em `0.1`.
- Regra: X = 0 enquanto o requisito não estiver publicado em `main`.

**Passos:**
1. Criar a estrutura de pastas conforme `FILE_STRUCTURE.md`.
2. Criar o arquivo do requisito a partir do template mais apropriado em `Documentação/templates/requisitos/`.
3. Preencher todas as seções obrigatórias do template.
4. Atualizar a tabela **Histórico de Alterações** no próprio arquivo.
5. Realizar commits pequenos e frequentes seguindo padrão em [GIT_WORKFLOW.md](./GIT_WORKFLOW.md)
6. Submeter a documentação para validação e aprovação (fora do Git).
7. Somente após a documentação aprovada, abrir Pull Request para `spec-approved`, referenciando o card Jira.

**Saídas esperadas:**
- Requisito criado com versão `0.1`.
- Histórico de alterações preenchido.
- PR aberto para `spec-approved`.

### ✏️ Edição de Requisito Existente

**Quando usar:**  
Alterar requisito existente sem mudança de escopo funcional.

**Pré-requisitos:**
- Obrigatório: card Jira do tipo *Tarefa de Especificação*.
- Consulte [1.2 Modelo de Cards no Jira](#12-modelo-de-cards-no-jira) para entender como a tarefa deve ser criada

**Branch:**
- Criar a partir de `spec-approved`.
- Nome obrigatório: `spec/<ID-Jira>-<descricao-curta>`
- Consulte [GIT_WORKFLOW.md](./GIT_WORKFLOW.md) para mais informações

**Arquivos**

- Altere os arquivos existentes
- Se necessário adicione novos arquivos utilizando o template mais apropriado em `Documentação/templates/requisitos/`

**Versão:**
- Não alterar X.
- Incrementar apenas Y.  
Exemplo: `0.2 -> 0.3` ou `1.1 -> 1.2`.

**Passos:**
1. Localizar o arquivo do requisito.
2. Alterar apenas as seções impactadas.
3. Atualizar a versão conforme regra definida.
4. Atualizar a tabela **Histórico de Alterações**.
5. Realizar commits pequenos e frequentes seguindo padrão em [GIT_WORKFLOW.md](./GIT_WORKFLOW.md)
6. Submeter a documentação para validação e aprovação (fora do Git).
7. Somente após a documentação aprovada, abrir Pull Request para `spec-approved`, referenciando o card Jira.

**Saídas esperadas:**
- Requisito atualizado com incremento em Y.
- Histórico de alterações atualizado.
- PR aberto para `spec-approved`.

### 🐛 Correção de Bugs/Erros
**Quando usar:**
Corrigir erro na documentação sem alterar o escopo funcional.

**Pré-requisitos:**
- Obrigatório: card Jira.
- Consulte [1.2 Modelo de Cards no Jira](#12-modelo-de-cards-no-jira) para entender como a tarefa deve ser criada

**Branch:**
- Criar a partir de `spec-approved`.
- Nome obrigatório: `bug/<ID-Jira>-<descricao-curta>`
- Consulte [GIT_WORKFLOW.md](./GIT_WORKFLOW.md) para mais informações


**Template:**
- Manter o template existente.

**Local do arquivo:**
- Manter o local atual do requisito.

**Nomenclatura do arquivo:**
- Não alterar.

**Versão:**
- Incrementar apenas Y (mesma regra da edição).

**Passos:**
1. Localizar o arquivo com erro.
2. Corrigir o erro mantendo o escopo original.
3. Atualizar a versão conforme regra definida.
4. Atualizar a tabela **Histórico de Alterações**.
5. Realizar commits pequenos e frequentes.
6. Submeter a documentação para validação e aprovação (fora do Git).
7. Somente após a documentação aprovada, abrir Pull Request para `spec-approved`, referenciando o card Jira.

**Saídas esperadas:**
- Erro documental corrigido.
- Histórico de alterações atualizado.
- PR aberto para `spec-approved`.

### 📚 Melhoria de Documentação
**Quando usar:**  
Alterar READMEs, guias, templates, padrões ou estrutura do repositório.

**Pré-requisitos:**
- Card Jira não obrigatório.
- Issue do repositório recomendada para mudanças relevantes.

**Branch:**
- Criar a partir de `spec-approved`.
- Nome obrigatório: `docs/<descricao-curta>` ou `chore/<descricao-curta>`
- Consulte [GIT_WORKFLOW.md](./GIT_WORKFLOW.md) para mais informações

**Template:**
- Não se aplica.

**Local do arquivo:**
- Conforme escopo da alteração.

**Nomenclatura do arquivo:**
- Seguir  [NAMING_CONVENTIONS.md](./NAMING_CONVENTIONS.md).

**Versão:**
- Não se aplica, exceto quando houver alteração direta em requisitos versionados.

**Passos:**
1. Editar ou criar os arquivos necessários.
2. Atualizar histórico de alterações quando aplicável.
3. Realizar commits pequenos e frequentes.
4. Abrir Pull Request para `spec-approved`.
5. Após merge em `spec-approved`, realizar merge equivalente em `main`.

**Saídas esperadas:**
- Documentação ou template atualizado em `spec-approved` e `main`.

## 4. Revisão de Qualidade

Antes de fazer commit, verifique:

- [ ] Nomes seguem convenções ([NAMING_CONVENTIONS.md](./NAMING_CONVENTIONS.md))
- [ ] Arquivos estão na pasta correta ([FILE_STRUCTURE.md](./FILE_STRUCTURE.md))
- [ ] Conteúdo segue template de requisito ([.luby/templates/requisitos/](../.luby/templates/requisitos/))
- [ ] Padrões respeitados ([STANDARDS.md](./STANDARDS.md))
- [ ] Links funcionam e referências estão corretas
- [ ] Ortografia e gramática verificadas

## 5. Comunicação

- **Issues**: Para discussões e planejamento
- **Pull Requests**: Para revisão de código/documentação
- **Jira**: Para tracking de tarefas
- **Comentários**: Use em PRs para feedback construtivo

## 6. Dúvidas?

- Consulte os documentos desta pasta (`Documentação/thiago-spec-kit/`)
- Revise o template em `templates/`
- Converse no Pull Request ou Issue
- Valide com o PO ou Tech Lead

---
