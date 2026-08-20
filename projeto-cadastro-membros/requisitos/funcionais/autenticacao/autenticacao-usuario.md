---

[Módulo: Autenticação](../../README.md) › **Autenticação de Usuário**

**Versão:** 0.2 | **Última atualização:** 30/04/2026

---

# Contextualização

A autenticação de usuário é o ponto de entrada obrigatório da plataforma de gestão de membros. Ela garante que apenas pessoas autorizadas — administradores e secretaria — acessem os dados institucionais da congregação.

A necessidade decorre do caráter sigiloso das informações gerenciadas: dados pessoais de membros, vínculos familiares e hierarquias de liderança exigem controle de acesso efetivo desde o primeiro acesso.

O processo é utilizado por administradores e secretaria no início de cada sessão de trabalho, tanto em acessos rotineiros quanto após períodos de inatividade ou troca de dispositivo.

Esta funcionalidade é pré-requisito para todas as demais da plataforma. Sem autenticação válida, nenhuma outra tela ou operação é acessível.

---

# Detalhamento Funcional

## Acesso à Funcionalidade

A tela de autenticação é exibida automaticamente sempre que o usuário acessa a URL da plataforma sem uma sessão ativa válida. Não há caminho de menu — é o ponto de entrada único e obrigatório do sistema.

Usuários com sessão ativa e dentro do prazo de validade são redirecionados diretamente ao Dashboard, sem passar pela tela de login.

## Formulário de Login

A tela de autenticação apresenta um formulário com os seguintes campos:

- **E-mail**
  - Tipo: texto, com validação de formato de e-mail
  - Obrigatório: sim

- **Senha**
  - Tipo: senha (caracteres ocultos por padrão)
  - Obrigatório: sim
  - O campo deve oferecer alternância de visibilidade (ícone de olho)

- **Lembrar de mim**
  - Tipo: checkbox
  - Comportamento: quando marcado, mantém a sessão ativa por **7 dias** após o login bem-sucedido; quando desmarcado, a sessão expira ao fechar o navegador

A tela deve oferecer também o link **"Esqueci minha senha"**, que direciona ao fluxo de recuperação de senha.

## Fluxo de Autenticação

Ao submeter o formulário, o sistema valida as credenciais contra o banco de dados.

**Credenciais válidas:** o sistema inicia a sessão autenticada e redireciona o usuário ao Dashboard.

**Credenciais inválidas:** o sistema exibe uma mensagem de erro inline, abaixo do formulário, sem indicar qual dos dois campos está incorreto. Os campos permanecem preenchidos (exceto a senha, que é limpa) para facilitar a redigitação.

Não há bloqueio de conta por número de tentativas. Cada tentativa falha exibe o feedback e permite nova tentativa imediata.

## Logout

O logout é realizado exclusivamente pelo usuário, por meio de ação explícita no menu da aplicação. A ação é executada diretamente, sem modal de confirmação:

- A sessão é encerrada no servidor
- O token/cookie de sessão é invalidado
- O usuário é redirecionado à tela de login

O sistema não realiza logout automático por inatividade.

---

# Mensagens e Estados

- **Credenciais inválidas**
  - **Condição:** E-mail ou senha não correspondem a nenhum usuário ativo
  - **Comportamento do sistema:** Mantém o usuário na tela de login; limpa o campo senha; mantém o campo e-mail preenchido
  - **Mensagem exibida:** "E-mail ou senha incorretos."

- **Campo obrigatório vazio**
  - **Condição:** Usuário tenta submeter o formulário sem preencher e-mail ou senha
  - **Comportamento do sistema:** Impede o envio; destaca o(s) campo(s) vazio(s)
  - **Mensagem exibida:** "Preencha este campo." (inline, abaixo de cada campo vazio)

- **Formato de e-mail inválido**
  - **Condição:** Valor digitado no campo e-mail não atende ao formato de e-mail válido
  - **Comportamento do sistema:** Impede o envio; destaca o campo
  - **Mensagem exibida:** "Digite um e-mail válido."

- **Sessão expirada**
  - **Condição:** Usuário tenta acessar uma rota autenticada com sessão inválida ou expirada
  - **Comportamento do sistema:** Redireciona para a tela de login
  - **Mensagem exibida:** "Sua sessão expirou. Faça login novamente."

---

# Fluxos Relacionados e Navegação

## Fluxos Posteriores

- **[Recuperação de Senha](./recuperacao-senha.md)**
  Acessado pelo link "Esqueci minha senha" na tela de login. Permite que o usuário redefina a senha sem intervenção de um administrador.

- **[Dashboard](../dashboard/dashboard.md)**
  Destino imediato após autenticação bem-sucedida. Primeira tela da sessão autenticada.

---

# Regras e Comportamentos do Sistema

- O sistema deve impedir o acesso a qualquer rota autenticada sem sessão válida, redirecionando para a tela de login.

- O sistema deve invalidar a sessão no servidor no momento do logout, garantindo que o token não possa ser reutilizado após a ação.

- O sistema deve manter a sessão ativa por 7 dias quando "Lembrar de mim" estiver marcado, ou até o fechamento do navegador quando desmarcado.

- O sistema não deve indicar, na mensagem de erro, se o e-mail ou a senha é o campo incorreto, evitando enumeração de usuários cadastrados.

- O sistema deve limpar o campo senha após uma tentativa de login inválida, mantendo o campo e-mail preenchido.

- O sistema deve registrar o evento de login bem-sucedido e de logout (data, hora e identificador do usuário) para fins de auditoria.

- O sistema deve emitir headers HTTP que impeçam o cache de páginas autenticadas (`Cache-Control: no-store`), garantindo que o botão Voltar do navegador não reacesse áreas autenticadas após o logout.

---

# Cenários de Comportamento

## Cenário 1: Login bem-sucedido com "Lembrar de mim" marcado

**Dado que** existe um usuário administrador com e-mail `secretaria@igrejabetania.com.br` e senha `Senha@2026`
**E** o usuário acessa a plataforma sem sessão ativa

**Quando** preenche o campo e-mail com `secretaria@igrejabetania.com.br`
**E** preenche o campo senha com `Senha@2026`
**E** marca o checkbox "Lembrar de mim"
**E** clica no botão "Entrar"

**Então** o sistema deve:
  - Autenticar o usuário com sucesso
  - Criar uma sessão com validade de 7 dias
  - Redirecionar para o Dashboard
  - Exibir o Dashboard sem mensagem de erro

---

## Cenário 2: Login bem-sucedido sem "Lembrar de mim"

**Dado que** existe um usuário com e-mail `pastor@igrejabetania.com.br` e senha `Fé@2026`
**E** o usuário acessa a plataforma sem sessão ativa

**Quando** preenche as credenciais corretamente
**E** deixa o checkbox "Lembrar de mim" desmarcado
**E** clica em "Entrar"

**Então** o sistema deve:
  - Autenticar o usuário com sucesso
  - Criar uma sessão que expira ao fechar o navegador
  - Redirecionar para o Dashboard

---

## Cenário 3: Tentativa de login com senha incorreta

**Dado que** existe um usuário com e-mail `secretaria@igrejabetania.com.br`
**E** o usuário está na tela de login

**Quando** preenche o campo e-mail com `secretaria@igrejabetania.com.br`
**E** preenche o campo senha com `SenhaErrada123`
**E** clica em "Entrar"

**Então** o sistema deve:
  - Manter o usuário na tela de login
  - Exibir a mensagem "E-mail ou senha incorretos."
  - Limpar o campo senha
  - Manter o campo e-mail preenchido com `secretaria@igrejabetania.com.br`
  - Não bloquear a conta

---

## Cenário 4: Tentativa de login com e-mail não cadastrado

**Dado que** não existe nenhum usuário com o e-mail `desconhecido@teste.com`
**E** o usuário está na tela de login

**Quando** preenche o campo e-mail com `desconhecido@teste.com`
**E** preenche o campo senha com qualquer valor
**E** clica em "Entrar"

**Então** o sistema deve:
  - Exibir a mesma mensagem "E-mail ou senha incorretos."
  - Não revelar que o e-mail não existe no sistema

---

## Cenário 5: Submissão com campos obrigatórios vazios

**Dado que** o usuário está na tela de login
**E** não preencheu nenhum campo

**Quando** clica no botão "Entrar"

**Então** o sistema deve:
  - Impedir o envio do formulário
  - Exibir "Preencha este campo." abaixo do campo e-mail
  - Exibir "Preencha este campo." abaixo do campo senha
  - Manter o foco na tela

---

## Cenário 6: Acesso direto a rota autenticada com sessão expirada

**Dado que** o usuário possuía uma sessão ativa que expirou
**E** tenta acessar diretamente a URL `/dashboard`

**Quando** o sistema verifica a sessão

**Então** o sistema deve:
  - Redirecionar o usuário para a tela de login
  - Exibir a mensagem "Sua sessão expirou. Faça login novamente."

---

## Cenário 7: Logout explícito

**Dado que** o usuário está autenticado e em qualquer tela da plataforma

**Quando** clica na opção "Sair" no menu da aplicação

**Então** o sistema deve:
  - Invalidar a sessão no servidor
  - Remover o cookie/token de sessão
  - Redirecionar para a tela de login
  - Impedir que o botão "Voltar" do navegador reacesse a área autenticada (via header `Cache-Control: no-store` nas páginas autenticadas)

---

## Cenário 8: Usuário com sessão válida acessa a URL de login

**Dado que** o usuário está autenticado com sessão válida

**Quando** acessa diretamente a URL `/login`

**Então** o sistema deve:
  - Redirecionar automaticamente para o Dashboard
  - Não exibir a tela de login

---

## Cenário 9: Login com usuário inativo

**Dado que** existe um usuário com e-mail `secretaria@igrejabetania.com.br` e status **Inativo** no sistema

**Quando** o usuário preenche o campo e-mail com `secretaria@igrejabetania.com.br`
**E** preenche o campo senha com a senha correta
**E** clica em "Entrar"

**Então** o sistema deve:
  - Recusar a autenticação
  - Exibir a mesma mensagem "E-mail ou senha incorretos."
  - Não revelar que a conta existe ou que está inativa
  - Limpar o campo senha
  - Manter o campo e-mail preenchido

---

# Permissões e Regras de Acesso

A tela de autenticação é pública — não exige permissão prévia para ser acessada.

Após autenticação bem-sucedida, o perfil **Administrador** tem acesso total ao sistema. O sistema de permissões é extensível para perfis futuros (Líder de Célula, Membro), conforme premissa técnica do produto.

---

# Histórico de Alterações

| Data       | Card | Autor           | Descrição da Alteração         |
|------------|------|-----------------|-------------------------------|
| 29/04/2026 | —    | Thiago Oliveira | Criação inicial do requisito  |
| 30/04/2026 | —    | Thiago Oliveira | Cenário 9 (usuário inativo); regra de cache header para botão Voltar; versão incrementada para 0.2 |

---

<div align="center">
  <sub><strong>🔒 Documento Confidencial</strong> • Uso Interno</sub>
</div>
