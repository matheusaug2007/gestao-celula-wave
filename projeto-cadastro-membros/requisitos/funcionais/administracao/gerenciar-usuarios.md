---

[Módulo: Administração](../../README.md) › **Gerenciar Usuários do Sistema**

**Versão:** 0.2 | **Última atualização:** 30/04/2026

---

# Contextualização

O gerenciamento de usuários do sistema permite que o administrador gerencie quem tem acesso à plataforma de gestão de membros. Usuários do sistema são distintos dos membros da congregação: são as pessoas (secretaria, pastores, coordenadores) que operam a plataforma.

A necessidade surge da implantação inicial e do dia a dia operacional: novos colaboradores da secretaria precisam de acesso, pessoas que saem da função precisam ter o acesso removido, e senhas temporárias precisam ser geradas de forma controlada.

No MVP, o sistema opera com um único perfil de usuário: **Administrador**, com acesso total. O sistema de permissões é extensível para perfis futuros (Líder de Célula, Membro) conforme premissa técnica do produto.

> **Seed de implantação:** O primeiro usuário administrador é criado via seed de implantação (fora da interface), antes do primeiro uso da plataforma. A partir daí, novos usuários são criados por este fluxo.

---

# Detalhamento Funcional

## Acesso à Funcionalidade

O usuário acessa o gerenciamento de usuários pelo menu principal, na seção **Administração > Usuários**.

## Listagem de Usuários

A tela exibe uma tabela com todos os usuários cadastrados no sistema:

| Coluna | Descrição | Ordenável |
|--------|-----------|-----------|
| **Nome** | Nome completo do usuário | Sim |
| **E-mail** | E-mail de acesso | Sim |
| **Status** | `Ativo` ou `Inativo` | Sim |
| **Criado em** | Data de criação do usuário | Sim |

A ordenação padrão é por **Nome** em ordem alfabética crescente.

A listagem exibe por padrão apenas usuários **Ativos**. Um filtro de status permite visualizar Inativos ou Todos.

> **Paginação:** A listagem de usuários **não é paginada** no MVP. O volume esperado é de até 20 usuários simultâneos — todos são exibidos na mesma tela.

## Criar Usuário

O administrador pode criar um novo usuário pelo botão **"Novo Usuário"** na listagem. O formulário de criação contém:

- **Nome completo**
  - Tipo: texto
  - Obrigatório: sim

- **E-mail**
  - Tipo: texto com validação de formato de e-mail
  - Obrigatório: sim
  - Deve ser único no sistema — dois usuários não podem ter o mesmo e-mail

- **Senha temporária**
  - Tipo: senha (com alternância de visibilidade)
  - Obrigatório: sim
  - Regra: mínimo de 8 caracteres
  - O administrador define a senha inicial; o novo usuário pode alterá-la pelo fluxo de recuperação de senha

Ao salvar, o sistema cria o usuário com status **Ativo** e redireciona para a listagem de usuários.

## Editar Usuário

O administrador pode editar os dados de um usuário existente. Os campos editáveis são:

- **Nome completo**
- **E-mail** (com validação de unicidade)

A senha **não é editável** por este formulário — alterações de senha são feitas pelo fluxo de recuperação de senha iniciado pelo próprio usuário.

## Inativar Usuário

O administrador pode inativar um usuário ativo. A inativação:

- Exibe um modal de confirmação: "Tem certeza que deseja inativar **[Nome do usuário]**? O acesso será encerrado imediatamente."
- Ao confirmar, o status é alterado para **Inativo** e todas as sessões ativas do usuário são encerradas no servidor
- O usuário inativado não consegue mais fazer login

O administrador não pode se auto-inativar (inativar o próprio usuário que está logado).

## Reativar Usuário

O administrador pode reativar um usuário inativo. A reativação:

- Exibe um modal de confirmação: "Deseja reativar **[Nome do usuário]**? O acesso será restaurado."
- Ao confirmar, o status é alterado para **Ativo**; o usuário pode fazer login com as credenciais existentes

---

# Mensagens e Estados

- **E-mail já cadastrado**
  - **Condição:** O e-mail informado já existe para outro usuário no sistema
  - **Comportamento do sistema:** Impede o salvamento; destaca o campo
  - **Mensagem exibida:** "Este e-mail já está em uso por outro usuário."

- **Campo obrigatório vazio**
  - **Condição:** Usuário tenta salvar sem preencher campo obrigatório
  - **Mensagem exibida:** "Preencha este campo."

- **Senha com menos de 8 caracteres**
  - **Condição:** Senha temporária com menos de 8 caracteres
  - **Mensagem exibida:** "A senha deve ter no mínimo 8 caracteres."

- **Usuário criado com sucesso**
  - **Mensagem exibida:** Toast "Usuário criado com sucesso."

- **Usuário atualizado com sucesso**
  - **Mensagem exibida:** Toast "Usuário atualizado com sucesso."

- **Usuário inativado com sucesso**
  - **Mensagem exibida:** Toast "Usuário inativado com sucesso."

- **Usuário reativado com sucesso**
  - **Mensagem exibida:** Toast "Usuário reativado com sucesso."

- **Tentativa de auto-inativação**
  - **Condição:** Administrador tenta inativar o próprio usuário logado
  - **Comportamento do sistema:** Bloqueia a ação sem exibir o modal
  - **Mensagem exibida:** "Você não pode inativar o seu próprio usuário."

---

# Fluxos Relacionados e Navegação

## Fluxos Posteriores

- **[Autenticação de Usuário](../autenticacao/autenticacao-usuario.md)**
  Usuários criados aqui acessam a plataforma pelo fluxo de autenticação.

- **[Recuperação de Senha](../autenticacao/recuperacao-senha.md)**
  Usuários que desejam alterar a senha temporária ou recuperar acesso utilizam este fluxo.

---

# Regras e Comportamentos do Sistema

- O sistema deve garantir que o e-mail seja único entre todos os usuários do sistema (ativos e inativos).

- O sistema deve criar usuários com status **Ativo** por padrão.

- O sistema deve encerrar imediatamente todas as sessões ativas de um usuário ao inativá-lo.

- O sistema deve impedir que o administrador logado inative o próprio usuário. **O servidor deve rejeitar requisições de inativação cujo ID do usuário-alvo seja igual ao ID do usuário autenticado na sessão, retornando erro HTTP 403 — independentemente de qualquer validação feita na interface.**

- A senha definida na criação é uma senha temporária. O sistema não força a troca de senha no primeiro acesso no MVP — o usuário pode usar a senha definida pelo administrador ou alterá-la via recuperação de senha.

- O sistema deve registrar data, hora e usuário responsável por cada criação, edição, inativação e reativação para fins de auditoria.

- A exclusão permanente de usuários não é permitida — apenas inativação.

---

# Cenários de Comportamento

## Cenário 1: Criação bem-sucedida de novo usuário

**Dado que** o administrador está na tela de listagem de usuários

**Quando** clica em "Novo Usuário"
**E** preenche:
  - Nome completo: `Maria Santos`
  - E-mail: `maria@igrejabetania.com.br`
  - Senha temporária: `Temp@2026`
**E** clica em "Salvar"

**Então** o sistema deve:
  - Criar o usuário `Maria Santos` com status Ativo
  - Exibir toast "Usuário criado com sucesso."
  - Redirecionar para a listagem de usuários
  - Exibir `Maria Santos` na listagem

---

## Cenário 2: Tentativa de criar usuário com e-mail duplicado

**Dado que** já existe um usuário com e-mail `secretaria@igrejabetania.com.br`

**Quando** o administrador tenta criar um novo usuário com o mesmo e-mail
**E** clica em "Salvar"

**Então** o sistema deve:
  - Impedir o salvamento
  - Exibir "Este e-mail já está em uso por outro usuário." abaixo do campo e-mail

---

## Cenário 3: Inativação de usuário

**Dado que** o administrador está na listagem e `Maria Santos` está Ativa

**Quando** clica em "Inativar" na linha de `Maria Santos`
**E** o modal de confirmação é exibido
**E** clica em "Confirmar"

**Então** o sistema deve:
  - Alterar o status de `Maria Santos` para Inativo
  - Encerrar todas as sessões ativas de `Maria Santos`
  - Exibir toast "Usuário inativado com sucesso."

---

## Cenário 4: Tentativa de auto-inativação

**Dado que** o administrador logado é `Pastor João`

**Quando** tenta inativar o próprio usuário `Pastor João`

**Então** o sistema deve:
  - Bloquear a ação sem abrir o modal
  - Exibir "Você não pode inativar o seu próprio usuário."

---

## Cenário 5: Reativação de usuário inativo


**Dado que** `Maria Santos` está Inativa

**Quando** o administrador aplica o filtro Status `Inativo` na listagem
**E** clica em "Reativar" na linha de `Maria Santos`
**E** confirma no modal

**Então** o sistema deve:
  - Alterar o status de `Maria Santos` para Ativo
  - Exibir toast "Usuário reativado com sucesso."

---

## Cenário 6: Edição bem-sucedida de usuário

**Dado que** o administrador está na listagem e `Maria Santos` está Ativa

**Quando** clica em "Editar" na linha de `Maria Santos`
**E** altera o Nome completo para `Maria Santos Oliveira`
**E** clica em "Salvar"

**Então** o sistema deve:
  - Salvar as alterações
  - Exibir toast "Usuário atualizado com sucesso."
  - Exibir `Maria Santos Oliveira` na listagem

---

## Cenário 7: Edição com e-mail duplicado

**Dado que** já existe um usuário com e-mail `joao@igrejabetania.com.br`
**E** o administrador está editando `Maria Santos`

**Quando** altera o e-mail de `Maria Santos` para `joao@igrejabetania.com.br`
**E** clica em "Salvar"

**Então** o sistema deve:
  - Impedir o salvamento
  - Exibir "Este e-mail já está em uso por outro usuário." abaixo do campo e-mail
  - Manter o usuário no formulário com os demais dados preservados

---

# Permissões e Regras de Acesso

| Permissão | Descrição |
|-----------|-----------|
| `USUARIO_VISUALIZAR` | Permite acessar a listagem de usuários |
| `USUARIO_CRIAR` | Permite criar novos usuários |
| `USUARIO_EDITAR` | Permite editar dados de usuários existentes |
| `USUARIO_INATIVAR` | Permite inativar usuários ativos |
| `USUARIO_REATIVAR` | Permite reativar usuários inativos |

No MVP, o perfil **Administrador** possui todas estas permissões por padrão.

---

# Histórico de Alterações

| Data       | Card | Autor           | Descrição da Alteração        |
|------------|------|-----------------|-------------------------------|
| 30/04/2026 | —    | Thiago Oliveira | Criação inicial do requisito  |
| 30/04/2026 | —    | Thiago Oliveira | Regra backend 403 para auto-inativação; sem paginação no MVP; Cenários 6 (edição) e 7 (e-mail duplicado na edição) |

---

<div align="center">
  <sub><strong>🔒 Documento Confidencial</strong> • Uso Interno</sub>
</div>
