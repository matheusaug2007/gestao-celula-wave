---

[Módulo: Células](../../README.md) › **Editar Célula**

**Versão:** 0.2 | **Última atualização:** 30/04/2026

---

# Contextualização

A edição de célula permite atualizar os dados operacionais de uma célula existente — dia, horário e endereço de reunião — sem impactar o vínculo entre o líder e seus membros.

A necessidade surge da dinâmica natural das células: o local de reunião pode mudar, o dia pode ser ajustado por conveniência do grupo ou o horário pode ser alterado por conta de compromissos do líder. Essas mudanças precisam ser refletidas no sistema para que a secretaria e os relatórios mostrem informações sempre atualizadas.

A identidade da célula — quem a lidera — não é editável por este fluxo. O líder de uma célula é definido pelo cadastro do membro; para alterar a liderança, é necessário editar o membro correspondente.

---

# Detalhamento Funcional

## Acesso à Funcionalidade

O usuário acessa o formulário de edição de duas formas:
- Pela ação **"Editar"** em cada linha da listagem de células
- Pelo botão **"Editar"** na tela de visualização da célula

## Formulário de Edição

O formulário apresenta os dados operacionais da célula pré-preenchidos com os valores atuais:

### Dados editáveis

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
  - Comportamento: os tipos atuais são pré-selecionados; o usuário pode adicionar ou remover tipos

- **Endereço da célula**
  - Rua — obrigatório
  - Número — obrigatório
  - Complemento — opcional
  - Bairro — obrigatório
  - Cidade — obrigatório
  - Opção **"Usar endereço residencial do líder"**: ao marcar, o sistema preenche automaticamente o endereço com o endereço residencial atual do líder. O usuário pode manter ou editar manualmente após o preenchimento automático.

### Dados exibidos apenas para contexto (não editáveis)

- **Líder** — nome do líder da célula, exibido em modo somente leitura para identificação
- **Total de membros ativos** — quantidade atual de membros ativos, exibido para contexto

## Ação de Salvar

Ao clicar em **"Salvar"**, o sistema valida os campos obrigatórios. Se válidos, salva as alterações e redireciona para a **listagem de células**. Se houver erros, exibe as mensagens inline e mantém o usuário no formulário com os dados preservados.

Não há modal de confirmação para esta operação — as alterações são salvas diretamente.

---

# Mensagens e Estados

- **Campo obrigatório vazio**
  - **Condição:** Usuário tenta salvar sem preencher um campo obrigatório
  - **Comportamento do sistema:** Impede o salvamento; destaca o campo
  - **Mensagem exibida:** "Preencha este campo."

- **Tipo de célula não selecionado**
  - **Condição:** Usuário tenta salvar sem selecionar ao menos um tipo
  - **Comportamento do sistema:** Impede o salvamento; destaca o campo de tipos
  - **Mensagem exibida:** "Selecione ao menos um tipo para esta célula."

- **Célula atualizada com sucesso**
  - **Condição:** Alterações salvas com sucesso
  - **Comportamento do sistema:** Redireciona para a listagem de células
  - **Mensagem exibida:** Toast "Célula atualizada com sucesso."

---

# Fluxos Relacionados e Navegação

## Fluxos Anteriores

- **[Listar Células](./listar-celulas.md)**
  Ação "Editar" disponível em cada linha da listagem.

- **[Visualizar Célula](./visualizar-celula.md)**
  Botão "Editar" presente na tela de visualização.

## Fluxos Posteriores

- **[Listar Células](./listar-celulas.md)**
  Destino após salvar com sucesso.

## Fluxos Relacionados

- **[Editar Membro](../membros/editar-membro.md)**
  Para alterar o líder de uma célula, o fluxo correto é editar o membro que exerce a liderança e atualizar seus dados de célula.

---

# Regras e Comportamentos do Sistema

- O sistema deve permitir editar apenas os campos operacionais da célula: dia, horário, tipos e endereço.

- O sistema não deve permitir a alteração do líder da célula por este formulário.

- O sistema deve preencher automaticamente o endereço da célula com o endereço residencial atual do líder ao marcar a opção "Usar endereço residencial do líder", sem impactar o endereço residencial do membro-líder.

- O sistema deve registrar data, hora e usuário responsável pela alteração para fins de auditoria.

- A edição de dados operacionais da célula (dia, horário, tipos e endereço) não exige modal de confirmação — as alterações são aplicadas diretamente ao salvar. Os membros vinculados ao líder não recebem notificação automática sobre a mudança.

- A opção "Usar endereço residencial do líder" realiza apenas o preenchimento inicial dos campos do endereço da célula. Após o preenchimento, o usuário pode editar os campos livremente sem impactar o endereço residencial do membro-líder. Não há sincronização em tempo real.

---

# Cenários de Comportamento

## Cenário 1: Edição de horário da célula

**Dado que** a célula de `Carlos Souza` está cadastrada com horário `19:30`
**E** o usuário acessa o formulário de edição desta célula

**Quando** altera o campo Horário para `20:00`
**E** clica em "Salvar"

**Então** o sistema deve:
  - Salvar o novo horário `20:00`
  - Exibir toast "Célula atualizada com sucesso."
  - Redirecionar para a listagem de células
  - Exibir `20:00` na coluna Horário da linha de `Carlos Souza`

---

## Cenário 2: Alteração do endereço com preenchimento automático pelo endereço do líder

**Dado que** o líder `Carlos Souza` tem endereço residencial: `Rua das Palmeiras, 50, Bairro Jardim, São Paulo`
**E** o usuário está no formulário de edição da célula de `Carlos Souza`

**Quando** marca a opção "Usar endereço residencial do líder"

**Então** o sistema deve:
  - Preencher automaticamente os campos do endereço da célula com: `Rua das Palmeiras, 50, Bairro Jardim, São Paulo`

**Quando** o usuário clica em "Salvar"

**Então** o sistema deve:
  - Salvar o endereço da célula com os dados preenchidos
  - Não alterar o endereço residencial do membro `Carlos Souza`

---

## Cenário 3: Tentativa de salvar com campo obrigatório vazio

**Dado que** o usuário apagou o campo Rua no formulário de edição

**Quando** clica em "Salvar"

**Então** o sistema deve:
  - Impedir o salvamento
  - Exibir "Preencha este campo." abaixo do campo Rua
  - Manter todos os demais campos preenchidos

---

## Cenário 4: Campo Líder não é editável

**Dado que** o usuário está no formulário de edição da célula de `Carlos Souza`

**Quando** visualiza o campo Líder

**Então** o sistema deve:
  - Exibir o nome `Carlos Souza` em modo somente leitura
  - Não permitir alteração do líder por este formulário

---

# Permissões e Regras de Acesso

| Permissão | Descrição |
|-----------|-----------|
| `CELULA_EDITAR` | Permite acessar o formulário e salvar alterações nos dados operacionais da célula |

No MVP, o perfil **Administrador** possui esta permissão por padrão.

---

# Histórico de Alterações

| Data       | Card | Autor           | Descrição da Alteração        |
|------------|------|-----------------|-------------------------------|
| 29/04/2026 | —    | Thiago Oliveira | Criação inicial do requisito  |
| 30/04/2026 | —    | Thiago Oliveira | Campo de tipos de célula (multi-select) adicionado; validação de tipo obrigatório |
| 30/04/2026 | —    | Thiago Oliveira | Regra: sem modal de confirmação ao salvar; regra: endereço residencial do líder é preenchimento inicial apenas (sem sincronização em tempo real) |

---

<div align="center">
  <sub><strong>🔒 Documento Confidencial</strong> • Uso Interno</sub>
</div>
