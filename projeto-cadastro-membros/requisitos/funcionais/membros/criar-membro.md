---

[Módulo: Membros](../../README.md) › **Criar Membro**

**Versão:** 0.2 | **Última atualização:** 30/04/2026

---

# Contextualização

O cadastro de membros é a operação central da plataforma. É por meio dele que cada pessoa vinculada à congregação passa a existir no sistema, com seus dados pessoais, informações de ingresso e vínculo com um líder de célula (discipulado por).

A necessidade decorre da ausência de um registro centralizado e estruturado da base de membros. Sem um cadastro formal, a secretaria não consegue gerar relatórios confiáveis, distribuir membros em células ou acompanhar o crescimento da congregação ao longo do tempo.

O formulário de criação é utilizado pela secretaria e pelos administradores sempre que um novo membro ingressa na igreja — seja por batismo, seja por recepção de outro contexto. Membros que também exercem a função de líderes de célula têm campos adicionais expostos dinamicamente no mesmo formulário, com suporte para cadastrar múltiplas células.

Esta funcionalidade alimenta diretamente a listagem de membros, o dashboard e os relatórios, sendo o ponto de entrada de todos os dados do sistema.

> **Premissa de implantação:** O campo "Discipulado por" é obrigatório para todos os membros, incluindo líderes. Para que o primeiro cadastro manual seja possível, o sistema deve ser provisionado com ao menos um líder raiz (pastor/coordenador) via seed de implantação, antes do uso da interface.

---

# Detalhamento Funcional

## Acesso à Funcionalidade

O usuário acessa o formulário de criação de membro a partir da tela de listagem de membros, por meio do botão **"Novo Membro"**.

## Formulário de Cadastro

### Dados Pessoais

- **Nome completo**
  - Tipo: texto
  - Obrigatório: sim

- **Telefone (celular)**
  - Tipo: texto com máscara `(##) # ####-####`
  - Obrigatório: sim
  - Aceita apenas números de celular (11 dígitos)

- **Data de nascimento**
  - Tipo: data
  - Obrigatório: sim
  - Não deve aceitar datas futuras

- **Data de ingresso**
  - Tipo: data
  - Obrigatório: sim
  - Não deve aceitar datas futuras

- **Tipo de ingresso**
  - Tipo: seleção (radio ou select)
  - Obrigatório: sim
  - Valores: `Batismo` | `Recepção`

### Endereço

- **Rua**
  - Tipo: texto
  - Obrigatório: sim

- **Número**
  - Tipo: texto
  - Obrigatório: sim

- **Complemento**
  - Tipo: texto
  - Obrigatório: não

- **Bairro**
  - Tipo: texto
  - Obrigatório: sim

- **Cidade**
  - Tipo: texto
  - Obrigatório: sim

### Vínculo com Líder

- **Líder (discipulado por)**
  - Tipo: busca/seleção entre líderes ativos
  - Obrigatório: sim
  - Comportamento: campo de busca/seleção pelo nome do líder; exibe apenas membros com o flag `é líder de célula` ativo e status Ativo; o próprio membro não aparece como opção
  - Não é possível salvar o cadastro sem selecionar um líder

### Campo: É líder de célula?

- **É líder de célula**
  - Tipo: checkbox ou toggle
  - Obrigatório: não (desmarcado por padrão)
  - Comportamento: ao marcar, o sistema exibe dinamicamente a seção **Detalhes da célula** no mesmo formulário; ao desmarcar, a seção é ocultada e seus valores descartados

### Detalhes da célula (exibido dinamicamente quando "É líder de célula" estiver marcado)

O líder pode liderar uma ou mais células. O formulário exibe um bloco por célula, com o botão **"+ Adicionar outra célula"** para incluir células adicionais. Cada bloco de célula contém:

- **Dia da célula**
  - Tipo: seleção (dia da semana: Segunda a Domingo)
  - Obrigatório: sim

- **Horário da célula**
  - Tipo: hora
  - Obrigatório: sim

- **Tipos da célula**
  - Tipo: seleção múltipla (multi-select)
  - Valores disponíveis: `Kids` / `Teens` / `Adolescente` / `Adulto`
  - Obrigatório: sim (ao menos um tipo deve ser selecionado)
  - Comportamento: o usuário pode selecionar múltiplos tipos simultaneamente

- **Endereço da célula**
  - Comportamento: o usuário pode marcar a opção **"Usar meu endereço residencial"**; ao marcar, o sistema preenche automaticamente os campos do endereço da célula com o endereço residencial informado no formulário (preenchimento inicial apenas — o usuário pode editar livremente após o preenchimento sem impactar o endereço residencial). O usuário pode também informar um endereço diferente manualmente.
  - Campos: Rua, Número, Complemento, Bairro, Cidade (mesma estrutura do endereço pessoal)
  - Obrigatório: sim (exceto Complemento)

Cada bloco de célula adicional (exceto o primeiro) exibe um botão **"Remover célula"**, que descarta o bloco inteiro. O primeiro bloco não pode ser removido enquanto o flag "É líder de célula" estiver marcado.

## Ação de Salvar

Ao clicar em **"Salvar"**, o sistema valida todos os campos obrigatórios e regras definidas. Se válidos, cria o registro e redireciona o usuário para a **listagem de membros**. Se houver erros, exibe as mensagens inline e mantém o usuário no formulário com os dados preenchidos preservados.

---

# Mensagens e Estados

- **Campo obrigatório vazio**
  - **Condição:** Usuário tenta salvar sem preencher um campo obrigatório
  - **Comportamento do sistema:** Impede o salvamento; destaca o(s) campo(s) pendente(s)
  - **Mensagem exibida:** "Preencha este campo." (inline, abaixo de cada campo)

- **Líder não selecionado**
  - **Condição:** Usuário tenta salvar sem selecionar um líder
  - **Comportamento do sistema:** Impede o salvamento; destaca o campo de seleção
  - **Mensagem exibida:** "Selecione o líder responsável por este membro."

- **Possível duplicata detectada**
  - **Condição:** Já existe um membro cadastrado com o mesmo nome completo e data de nascimento
  - **Comportamento do sistema:** Exibe alerta (não bloqueia o salvamento); o usuário pode confirmar o cadastro ou cancelar
  - **Mensagem exibida:** Alerta: "Já existe um membro cadastrado com este nome e data de nascimento. Deseja continuar mesmo assim?"

- **Tipo de célula não selecionado**
  - **Condição:** Bloco de célula de liderança sem nenhum tipo selecionado
  - **Comportamento do sistema:** Impede o salvamento; destaca o campo de tipos
  - **Mensagem exibida:** "Selecione ao menos um tipo para esta célula."

- **Data futura**
  - **Condição:** Data de nascimento ou data de ingresso informada é posterior à data atual
  - **Comportamento do sistema:** Impede o salvamento; destaca o campo
  - **Mensagem exibida:** "A data não pode ser futura."

- **Membro salvo com sucesso**
  - **Condição:** Todos os campos válidos; registro criado com sucesso
  - **Comportamento do sistema:** Redireciona para a listagem de membros
  - **Mensagem exibida:** Toast de confirmação "Membro cadastrado com sucesso."

---

# Fluxos Relacionados e Navegação

## Fluxos Anteriores

- **[Listar Membros](./listar-membros.md)**
  O botão "Novo Membro" que dá acesso ao formulário de criação está localizado na tela de listagem.

## Fluxos Posteriores

- **[Listar Membros](./listar-membros.md)**
  Após salvar com sucesso, o usuário é redirecionado de volta para a listagem, onde o novo membro já deve aparecer.

## Fluxos Alternativos

- **[Editar Membro](./editar-membro.md)**
  Caso o usuário precise corrigir dados logo após o cadastro, pode acessar a edição a partir da listagem.

---

# Regras e Comportamentos do Sistema

- O sistema deve exibir no seletor de líder apenas membros com o flag `é líder de célula` marcado como ativo e status Ativo. O próprio membro sendo cadastrado não deve aparecer como opção no seletor (prevenindo auto-referência).

- O sistema deve exigir ao menos um bloco de célula preenchido (dia, horário, tipos, endereço) somente quando o flag "É líder de célula" estiver marcado.

- O sistema deve descartar todos os blocos de célula caso o usuário desmarque o flag "É líder de célula" antes de salvar.

- O sistema deve preencher automaticamente o endereço da célula com o endereço residencial quando o usuário marcar a opção "Usar meu endereço residencial" (preenchimento inicial apenas). Após o preenchimento, o usuário pode editar os campos do endereço da célula livremente, sem impactar o endereço residencial. Não há sincronização em tempo real.

- O sistema deve permitir ao usuário adicionar múltiplos blocos de célula para um líder, criando uma célula independente por bloco.

- O sistema deve registrar o membro com status **Ativo** por padrão no momento da criação.

- O sistema não deve permitir exclusão permanente de registros — o único mecanismo de remoção é a inativação.

- O sistema deve registrar data e hora de criação e o usuário responsável pelo cadastro para fins de auditoria. Os registros de auditoria são armazenados no banco de dados; no MVP não há interface de consulta de auditoria.

- O sistema deve verificar, antes de salvar, se já existe um membro com o mesmo nome completo e data de nascimento. Em caso positivo, deve exibir alerta ao usuário permitindo que ele confirme o cadastro ou cancele (o salvamento não é bloqueado automaticamente — a decisão é do operador).

- Datas de nascimento e de ingresso não devem aceitar valores futuros.

---

# Cenários de Comportamento

## Cenário 1: Cadastro bem-sucedido de membro simples (não líder)

**Dado que** o usuário está autenticado e acessa o formulário de criação de membro

**Quando** preenche os seguintes dados:
  - Nome completo: `Ana Paula Ferreira`
  - Telefone: `(11) 9 8765-4321`
  - Data de nascimento: `12/03/1990`
  - Data de ingresso: `15/04/2026`
  - Tipo de ingresso: `Batismo`
  - Rua: `Rua das Flores`
  - Número: `123`
  - Bairro: `Jardim América`
  - Cidade: `São Paulo`
  - Discipulado por: `Carlos Souza`
  - É líder de célula: desmarcado
**E** clica em "Salvar"

**Então** o sistema deve:
  - Criar o registro de `Ana Paula Ferreira` com status Ativo
  - Registrar o vínculo de discipulado com o líder `Carlos Souza`
  - Exibir o toast "Membro cadastrado com sucesso."
  - Redirecionar para a listagem de membros
  - Exibir `Ana Paula Ferreira` na listagem

---

## Cenário 2: Cadastro bem-sucedido de membro que é líder com uma célula

**Dado que** o usuário está no formulário de criação de membro

**Quando** preenche os dados pessoais e de endereço de `Carlos Souza`
**E** marca o checkbox "É líder de célula"
**E** o sistema exibe dinamicamente a seção "Detalhes da célula"
**E** preenche o bloco da Célula 1:
  - Dia da célula: `Quarta-feira`
  - Horário da célula: `19:30`
  - Tipos da célula: `Adulto`
  - Endereço da célula: marca "Usar meu endereço residencial"
**E** clica em "Salvar"

**Então** o sistema deve:
  - Criar o registro de `Carlos Souza` com status Ativo e flag de líder ativo
  - Registrar uma célula vinculada (Quarta 19:30, tipo Adulto, endereço residencial)
  - Exibir o toast "Membro cadastrado com sucesso."
  - Redirecionar para a listagem de membros

---

## Cenário 9: Cadastro de líder com múltiplas células

**Dado que** o usuário está no formulário de criação de membro

**Quando** preenche os dados pessoais de `Carlos Souza`
**E** marca o checkbox "É líder de célula"
**E** preenche o bloco da Célula 1: `Quarta 19:30`, tipos `Adulto`, endereço residencial
**E** clica em "+ Adicionar outra célula"
**E** o sistema exibe um segundo bloco
**E** preenche o bloco da Célula 2: `Sexta 20:00`, tipos `Teens`, Rua das Acácias, 10, Centro, São Paulo
**E** clica em "Salvar"

**Então** o sistema deve:
  - Criar o registro de `Carlos Souza` com status Ativo e flag de líder ativo
  - Registrar duas células vinculadas a `Carlos Souza`:
    - Célula 1: Quarta 19:30, tipo Adulto
    - Célula 2: Sexta 20:00, tipo Teens, Rua das Acácias
  - Exibir o toast "Membro cadastrado com sucesso."
  - Redirecionar para a listagem de membros

---

## Cenário 3: Seção de dados da célula aparece e desaparece dinamicamente

**Dado que** o usuário está no formulário de criação
**E** o checkbox "É líder de célula" está desmarcado

**Quando** marca o checkbox "É líder de célula"

**Então** o sistema deve:
  - Exibir imediatamente a seção "Dados da Célula" com os campos dia, horário e endereço da célula

**Quando** desmarca o checkbox "É líder de célula"

**Então** o sistema deve:
  - Ocultar a seção "Dados da Célula"
  - Descartar os valores eventualmente preenchidos nessa seção

---

## Cenário 4: Tentativa de salvar sem selecionar líder

**Dado que** o usuário preencheu todos os campos obrigatórios exceto o líder (discipulado por)

**Quando** clica em "Salvar"

**Então** o sistema deve:
  - Impedir o salvamento
  - Destacar o campo "Líder"
  - Exibir "Selecione o líder responsável por este membro."

---

## Cenário 5: Tentativa de salvar com campos obrigatórios vazios

**Dado que** o usuário está no formulário de criação sem preencher nenhum campo

**Quando** clica em "Salvar"

**Então** o sistema deve:
  - Impedir o salvamento
  - Exibir "Preencha este campo." abaixo de cada campo obrigatório vazio

---

## Cenário 6: Tentativa de cadastro com data de ingresso futura

**Dado que** o usuário está no formulário de criação

**Quando** preenche o campo "Data de ingresso" com uma data posterior ao dia atual
**E** clica em "Salvar"

**Então** o sistema deve:
  - Impedir o salvamento
  - Exibir "A data não pode ser futura." abaixo do campo data de ingresso

---

## Cenário 7: Preenchimento automático do endereço da célula com endereço residencial

**Dado que** o usuário marcou "É líder de célula"
**E** preencheu o endereço residencial: Rua Sol, 45, Bairro Centro, São Paulo

**Quando** marca a opção "Usar meu endereço residencial" no endereço da célula

**Então** o sistema deve:
  - Preencher automaticamente os campos do endereço da célula com: Rua Sol, 45, Bairro Centro, São Paulo
  - Permitir que o usuário edite qualquer campo do endereço da célula livremente após o preenchimento automático
  - Não sincronizar automaticamente caso o endereço residencial seja alterado depois

---

## Cenário 8: Dados preservados após erro de validação

**Dado que** o usuário preencheu parcialmente o formulário (nome, telefone, data de nascimento)
**E** não preencheu o campo cidade

**Quando** clica em "Salvar"

**Então** o sistema deve:
  - Impedir o salvamento
  - Exibir a mensagem de erro no campo cidade
  - Preservar todos os demais campos preenchidos pelo usuário

---

# Permissões e Regras de Acesso

| Permissão | Descrição |
|-----------|-----------|
| `MEMBRO_CRIAR` | Permite acessar o formulário e criar novos membros |

No MVP, o perfil **Administrador** possui esta permissão por padrão. O sistema de permissões é extensível para perfis futuros.

---

# Histórico de Alterações

| Data       | Card | Autor           | Descrição da Alteração        |
|------------|------|-----------------|-------------------------------|
| 29/04/2026 | —    | Thiago Oliveira | Criação inicial do requisito  |
| 30/04/2026 | —    | Thiago Oliveira | Múltiplas células por líder; tipos de célula; seletor de célula específica; premissa de seed; validações adicionais |
| 30/04/2026 | —    | Thiago Oliveira | Vínculo membro→líder (não célula específica); seção renomeada para "Detalhes da célula"; regra de preenchimento de endereço (inicial apenas); alerta de duplicata; regra anti-auto-referência no seletor |

---

<div align="center">
  <sub><strong>🔒 Documento Confidencial</strong> • Uso Interno</sub>
</div>
