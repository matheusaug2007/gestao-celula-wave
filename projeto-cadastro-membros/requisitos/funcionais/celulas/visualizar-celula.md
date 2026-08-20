---

[Módulo: Células](../../README.md) › **Visualizar Célula**

**Versão:** 0.3 | **Última atualização:** 30/04/2026

---

# Contextualização

A tela de visualização de célula reúne em um único lugar todas as informações relevantes sobre uma célula: os dados operacionais (líder, dia, horário e endereço) e a lista de membros ativos discipulados pelo líder dessa célula.

A necessidade surge da rotina de acompanhamento pastoral: a secretaria precisa consultar quais membros estão sob a responsabilidade de um determinado líder, confirmar o endereço de reunião ou verificar o volume de pessoas para apoiar decisões de redistribuição ou crescimento.

Esta tela é somente leitura. Alterações nos dados operacionais da célula são feitas pelo fluxo de edição; alterações no vínculo de membros são feitas pelo cadastro do membro.

---

# Detalhamento Funcional

## Acesso à Funcionalidade

O usuário acessa a visualização de uma célula pela ação **"Visualizar"** disponível em cada linha da listagem de células.

## Dados Exibidos

### Informação Calculada (exibida em destaque)

- **Total de membros ativos** — quantidade de membros ativos discipulados pelo líder desta célula, exibida em card de destaque no topo. Quando o líder conduz mais de uma célula, todas as células desse líder exibem o mesmo total (o vínculo é membro→líder, não membro→célula específica).

### Dados Operacionais da Célula

- **Líder** — nome do membro que lidera a célula (clicável, navega para a visualização do membro-líder)
- **Dia da semana**
- **Horário**
- **Tipo(s)** — tipos da célula exibidos como badges (ex: "Adulto" | "Teens")
- **Endereço completo:** Rua, Número, Complemento (exibido somente se preenchido), Bairro, Cidade

### Lista de Membros Discipulados

Abaixo dos dados operacionais, a tela exibe a lista de todos os membros **ativos** discipulados pelo líder desta célula. Como o vínculo é membro→líder (não membro→célula específica), esta lista é a mesma em todas as células do mesmo líder.

| Coluna | Descrição |
|--------|-----------|
| **Nome** | Nome completo do membro |
| **Telefone** | Celular com máscara `(##) # ####-####` |

A lista é ordenada por **Nome** em ordem alfabética crescente.

Cada linha da lista é clicável e navega para a **tela de visualização do respectivo membro**.

Membros inativos não aparecem nesta lista.

## Ações Disponíveis

- **Editar** — abre o formulário de edição da célula (dados operacionais: dia, horário, endereço)

---

# Mensagens e Estados

- **Célula sem membros ativos**
  - **Condição:** Nenhum membro ativo está discipulado pelo líder desta célula
  - **Comportamento do sistema:** Exibe a área de lista vazia com mensagem orientativa
  - **Mensagem exibida:** "Nenhum membro ativo discipulado por este líder."

---

# Fluxos Relacionados e Navegação

## Fluxos Anteriores

- **[Listar Células](./listar-celulas.md)**
  Ação "Visualizar" em cada linha da listagem de células.

## Fluxos Posteriores

- **[Editar Célula](./editar-celula.md)**
  Botão "Editar" presente na tela de visualização.

- **[Visualizar Membro](../membros/visualizar-membro.md)**
  Clique em qualquer linha da lista de membros navega para o perfil do membro.
  Clique no nome do líder navega para o perfil do membro-líder.

---

# Regras e Comportamentos do Sistema

- O sistema deve exibir na lista de membros apenas os membros com status **Ativo** discipulados pelo líder desta célula. Como o vínculo é membro→líder, todas as células do mesmo líder exibem a mesma lista de membros.

- O sistema deve calcular o total de membros ativos contando os membros com status Ativo discipulados pelo líder — o mesmo total exibido em todas as células desse líder.

- O sistema deve exibir o campo Complemento do endereço somente quando estiver preenchido.

- A tela é somente leitura — nenhum dado pode ser alterado diretamente nela.

---

# Cenários de Comportamento

## Cenário 1: Visualização de célula com membros ativos

**Dado que** `Carlos Souza` possui 8 membros ativos e 2 inativos discipulados por ele
**E** `Carlos Souza` conduz 2 células: Quarta 19:30 (Bairro Centro, São Paulo) e Sexta 20:00

**Quando** o usuário acessa a visualização da célula Quarta 19:30 de `Carlos Souza`

**Então** o sistema deve:
  - Exibir card `Total de membros ativos: 8`
  - Exibir `Líder: Carlos Souza` como link clicável
  - Exibir `Dia: Quarta-feira`, `Horário: 19:30`, endereço completo
  - Listar os 8 membros ativos discipulados por `Carlos Souza`, com nome e telefone, ordenados alfabeticamente
  - Não exibir os 2 membros inativos
  - (A visualização da célula Sexta 20:00 exibiria a mesma lista de 8 membros — todos são discipulados pelo líder, não por célula específica)

---

## Cenário 2: Clique em membro da lista navega para o perfil

**Dado que** o usuário está na tela de visualização da célula de `Carlos Souza`
**E** `Ana Paula Ferreira` aparece na lista de membros

**Quando** clica na linha de `Ana Paula Ferreira`

**Então** o sistema deve:
  - Navegar para a tela de visualização do membro `Ana Paula Ferreira`

---

## Cenário 3: Clique no líder navega para o perfil do líder

**Dado que** o usuário está na tela de visualização da célula

**Quando** clica no nome `Carlos Souza` no campo Líder

**Então** o sistema deve:
  - Navegar para a tela de visualização do membro `Carlos Souza`

---

## Cenário 4: Célula sem membros ativos exibe estado vazio

**Dado que** `Juliana Costa` não possui nenhum membro ativo discipulado por ela

**Quando** o usuário acessa a visualização da célula de `Juliana Costa`

**Então** o sistema deve:
  - Exibir card `Total de membros ativos: 0`
  - Exibir os dados operacionais normalmente
  - Exibir "Nenhum membro ativo discipulado por este líder." na área da lista

---

# Permissões e Regras de Acesso

| Permissão | Descrição |
|-----------|-----------|
| `CELULA_VISUALIZAR` | Permite acessar a tela de visualização da célula |

No MVP, o perfil **Administrador** possui esta permissão por padrão.

---

# Histórico de Alterações

| Data       | Card | Autor           | Descrição da Alteração        |
|------------|------|-----------------|-------------------------------|
| 29/04/2026 | —    | Thiago Oliveira | Criação inicial do requisito  |
| 30/04/2026 | —    | Thiago Oliveira | Exibição de tipos de célula nos dados operacionais |
| 30/04/2026 | —    | Thiago Oliveira | Lista de membros: exibe discipulados pelo líder (não por célula específica); múltiplas células do mesmo líder exibem a mesma lista; terminologia atualizada |

---

<div align="center">
  <sub><strong>🔒 Documento Confidencial</strong> • Uso Interno</sub>
</div>
