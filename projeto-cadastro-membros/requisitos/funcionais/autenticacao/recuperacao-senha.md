---

[Módulo: Autenticação](../../README.md) › **Recuperação de Senha**

**Versão:** 0.1 | **Última atualização:** 29/04/2026

---

# Contextualização

A recuperação de senha permite que usuários da plataforma redefinem o acesso de forma autônoma, sem depender de intervenção de outro administrador.

A necessidade surge naturalmente do cotidiano operacional: senhas esquecidas interrompem o trabalho da secretaria e da liderança, e um canal seguro de autorrecuperação reduz a fricção e a dependência de suporte.

O fluxo é utilizado por administradores e secretaria sempre que perdem o acesso às próprias credenciais. O processo ocorre fora da sessão autenticada e exige apenas acesso ao e-mail cadastrado.

Esta funcionalidade complementa diretamente a autenticação de usuário, sendo acessada pelo link "Esqueci minha senha" na tela de login.

---

# Detalhamento Funcional

## Solicitação de Recuperação

O usuário acessa o fluxo de recuperação pelo link **"Esqueci minha senha"** disponível na tela de login.

A tela de recuperação exibe um formulário com um único campo:

- **E-mail**
  - Tipo: texto, com validação de formato de e-mail
  - Obrigatório: sim

Ao submeter, o sistema verifica se o e-mail informado pertence a um usuário cadastrado:

- **E-mail encontrado:** o sistema envia um e-mail com link de redefinição e exibe confirmação na tela. O link tem validade de **1 hora** a partir do envio.
- **E-mail não encontrado:** o sistema exibe mensagem informando que o e-mail não foi localizado no sistema.

## E-mail de Redefinição

O e-mail enviado ao usuário deve conter:

- Texto explicativo informando que uma solicitação de redefinição de senha foi feita
- Link único e de uso único para redefinição da senha
- Informação clara sobre o prazo de validade do link (1 hora)
- Orientação para ignorar o e-mail caso não tenha solicitado a redefinição

## Redefinição da Senha

Ao acessar o link recebido por e-mail, o usuário é direcionado à tela de redefinição de senha. Esta tela exibe:

- **Nova senha**
  - Tipo: senha (caracteres ocultos por padrão, com alternância de visibilidade)
  - Obrigatório: sim
  - Regra: mínimo de 8 caracteres

- **Confirmar nova senha**
  - Tipo: senha (caracteres ocultos por padrão, com alternância de visibilidade)
  - Obrigatório: sim
  - Regra: deve ser idêntica ao campo "Nova senha"

Ao salvar com dados válidos, o sistema:

1. Atualiza a senha do usuário
2. Invalida o link de redefinição utilizado
3. Encerra todas as sessões ativas do usuário em outros dispositivos
4. Autentica o usuário automaticamente com a nova senha
5. Redireciona para o Dashboard

## Estados do Link de Redefinição

O link pode se encontrar em três estados ao ser acessado:

- **Válido:** exibe a tela de redefinição normalmente
- **Expirado:** o prazo de 1 hora foi ultrapassado — exibe mensagem de expiração com opção de solicitar novo link
- **Já utilizado:** o link já foi usado uma vez — exibe mensagem informando que o link é inválido e oferece opção de solicitar novo link

---

# Mensagens e Estados

- **E-mail não encontrado**
  - **Condição:** O e-mail informado não está cadastrado no sistema
  - **Comportamento do sistema:** Mantém o usuário na tela de recuperação
  - **Mensagem exibida:** "Não encontramos nenhuma conta com este e-mail."

- **E-mail enviado com sucesso**
  - **Condição:** O e-mail informado está cadastrado e o e-mail de redefinição foi enviado
  - **Comportamento do sistema:** Exibe confirmação na tela; o usuário permanece na tela (não redireciona)
  - **Mensagem exibida:** "Enviamos um link de redefinição para `[e-mail]`. Verifique sua caixa de entrada."

- **Link expirado**
  - **Condição:** O usuário acessa o link após 1 hora da solicitação
  - **Comportamento do sistema:** Exibe tela de erro com opção de solicitar novo link
  - **Mensagem exibida:** "Este link expirou. Solicite um novo link de redefinição."

- **Link já utilizado**
  - **Condição:** O usuário tenta acessar um link que já foi usado
  - **Comportamento do sistema:** Exibe tela de erro com opção de solicitar novo link
  - **Mensagem exibida:** "Este link já foi utilizado. Solicite um novo link de redefinição."

- **Senhas não coincidem**
  - **Condição:** O valor do campo "Confirmar nova senha" difere do campo "Nova senha"
  - **Comportamento do sistema:** Impede o salvamento; destaca o campo de confirmação
  - **Mensagem exibida:** "As senhas não coincidem."

- **Senha com menos de 8 caracteres**
  - **Condição:** A nova senha digitada tem menos de 8 caracteres
  - **Comportamento do sistema:** Impede o salvamento; destaca o campo
  - **Mensagem exibida:** "A senha deve ter no mínimo 8 caracteres."

---

# Fluxos Relacionados e Navegação

## Fluxos Anteriores

- **[Autenticação de Usuário](./autenticacao-usuario.md)**
  O fluxo de recuperação é iniciado pelo link "Esqueci minha senha" na tela de login.

## Fluxos Posteriores

- **[Dashboard](../dashboard/dashboard.md)**
  Após redefinição bem-sucedida, o usuário é autenticado automaticamente e redirecionado ao Dashboard.

---

# Regras e Comportamentos do Sistema

- O sistema deve gerar um token único, aleatório e não previsível para cada solicitação de redefinição.

- O sistema deve invalidar o token imediatamente após seu uso, garantindo que cada link funcione uma única vez.

- O sistema deve expirar automaticamente qualquer token não utilizado após 1 hora da geração.

- O sistema deve encerrar todas as sessões ativas do usuário em outros dispositivos no momento da redefinição bem-sucedida.

- O sistema deve aceitar apenas uma solicitação de redefinição ativa por usuário. Caso o usuário solicite novamente antes da expiração, o token anterior deve ser invalidado e um novo token deve ser gerado.

- O sistema não deve confirmar nem negar a existência de um e-mail quando ele não for encontrado de forma ambígua — neste produto, optou-se por informar explicitamente quando o e-mail não é encontrado.

- O sistema deve registrar o evento de redefinição de senha (data, hora, identificador do usuário) para fins de auditoria.

---

# Cenários de Comportamento

## Cenário 1: Recuperação bem-sucedida com e-mail válido

**Dado que** existe um usuário com e-mail `secretaria@igrejabetania.com.br`
**E** o usuário está na tela de recuperação de senha

**Quando** preenche o campo e-mail com `secretaria@igrejabetania.com.br`
**E** clica em "Enviar link"

**Então** o sistema deve:
  - Gerar um link único de redefinição com validade de 1 hora
  - Enviar o e-mail com o link para `secretaria@igrejabetania.com.br`
  - Exibir a mensagem "Enviamos um link de redefinição para secretaria@igrejabetania.com.br. Verifique sua caixa de entrada."

---

## Cenário 2: Redefinição de senha bem-sucedida

**Dado que** o usuário `secretaria@igrejabetania.com.br` recebeu um link de redefinição válido
**E** acessa o link dentro de 1 hora

**Quando** preenche o campo "Nova senha" com `Novinha@2026`
**E** preenche o campo "Confirmar nova senha" com `Novinha@2026`
**E** clica em "Redefinir senha"

**Então** o sistema deve:
  - Atualizar a senha do usuário
  - Invalidar o link de redefinição utilizado
  - Encerrar todas as sessões ativas do usuário em outros dispositivos
  - Autenticar o usuário automaticamente
  - Redirecionar para o Dashboard

---

## Cenário 3: Tentativa de recuperação com e-mail não cadastrado

**Dado que** não existe nenhum usuário com o e-mail `naoexiste@teste.com`
**E** o usuário está na tela de recuperação de senha

**Quando** preenche o campo e-mail com `naoexiste@teste.com`
**E** clica em "Enviar link"

**Então** o sistema deve:
  - Não enviar nenhum e-mail
  - Exibir a mensagem "Não encontramos nenhuma conta com este e-mail."
  - Manter o usuário na tela de recuperação

---

## Cenário 4: Acesso a link expirado

**Dado que** o usuário solicitou recuperação de senha há mais de 1 hora
**E** ainda não utilizou o link

**Quando** clica no link recebido por e-mail

**Então** o sistema deve:
  - Exibir a mensagem "Este link expirou. Solicite um novo link de redefinição."
  - Oferecer opção para solicitar novo link

---

## Cenário 5: Acesso a link já utilizado

**Dado que** o usuário já redefiniu a senha com sucesso usando o link
**E** tenta acessar o mesmo link novamente

**Quando** clica no link já utilizado

**Então** o sistema deve:
  - Exibir a mensagem "Este link já foi utilizado. Solicite um novo link de redefinição."
  - Não permitir nova redefinição pelo mesmo link

---

## Cenário 6: Nova solicitação invalida link anterior

**Dado que** o usuário `pastor@igrejabetania.com.br` já possui um link de redefinição ativo (não expirado)

**Quando** solicita um novo link de redefinição para o mesmo e-mail

**Então** o sistema deve:
  - Invalidar o link anterior
  - Gerar um novo link com nova validade de 1 hora
  - Enviar o novo e-mail de redefinição

---

## Cenário 7: Senhas não coincidem na redefinição

**Dado que** o usuário acessou um link de redefinição válido

**Quando** preenche "Nova senha" com `Forca@2026`
**E** preenche "Confirmar nova senha" com `Força@2027`
**E** clica em "Redefinir senha"

**Então** o sistema deve:
  - Impedir o salvamento
  - Exibir "As senhas não coincidem." abaixo do campo de confirmação
  - Manter o usuário na tela de redefinição

---

## Cenário 8: Nova senha com menos de 8 caracteres

**Dado que** o usuário acessou um link de redefinição válido

**Quando** preenche "Nova senha" com `Ab@1`
**E** preenche "Confirmar nova senha" com `Ab@1`
**E** clica em "Redefinir senha"

**Então** o sistema deve:
  - Impedir o salvamento
  - Exibir "A senha deve ter no mínimo 8 caracteres." abaixo do campo nova senha

---

# Permissões e Regras de Acesso

O fluxo de recuperação de senha é público — não exige autenticação prévia. Qualquer pessoa com acesso à URL da plataforma pode iniciar o processo, mas a redefinição só é concluída mediante acesso ao e-mail cadastrado.

---

# Histórico de Alterações

| Data       | Card | Autor           | Descrição da Alteração        |
|------------|------|-----------------|-------------------------------|
| 29/04/2026 | —    | Thiago Oliveira | Criação inicial do requisito  |

---

<div align="center">
  <sub><strong>🔒 Documento Confidencial</strong> • Uso Interno</sub>
</div>
