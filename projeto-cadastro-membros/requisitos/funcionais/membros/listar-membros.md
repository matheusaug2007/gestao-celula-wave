---

[Módulo: Membros](../../README.md) › **Listar Membros**

**Versão:** 0.2 | **Última atualização:** 30/04/2026

---

# Contextualização

A listagem de membros é a tela central de consulta da plataforma, oferecendo à secretaria e à liderança uma visão consolidada de toda a base de membros ativos da congregação.

Mais do que uma simples tabela, esta funcionalidade responde a necessidades operacionais frequentes: localizar um membro específico, identificar quais membros pertencem a determinada célula, verificar a distribuição por cidade ou bairro e apoiar decisões de realocação de membros entre células.

O filtro dinâmico é o diferencial desta tela: ele permite combinar múltiplos critérios de busca de forma flexível, sem depender de relatórios pré-formatados. A secretaria pode, por exemplo, filtrar membros de um bairro específico que se reúnem numa determinada célula num dia da semana.

Esta funcionalidade serve de hub de navegação para as demais operações sobre membros — visualizar, editar, inativar e reativar — e é o destino padrão após criação e edição de registros.

---

# Detalhamento Funcional

## Acesso à Funcionalidade

O usuário acessa a listagem pelo menu principal, na seção **Membros**. A tela carrega com o filtro de Status pré-aplicado como **Ativo** — ou seja, apenas membros com status Ativo são exibidos por padrão. O usuário pode alterar ou remover este filtro via filtro dinâmico.

## Estrutura da Listagem

### Colunas

| Coluna | Descrição | Ordenável |
|--------|-----------|-----------|
| **Nome** | Nome completo do membro | Sim |
| **Telefone** | Celular no formato `(##) # ####-####` | Não |
| **Discipulado por** | Nome do líder ao qual o membro está vinculado. A informação completa do vínculo (células, dias e horários do líder) está disponível na tela de Visualizar Membro. | Sim |
| **Cidade** | Cidade do endereço residencial do membro | Sim |
| **Status** | `Ativo` ou `Inativo` | Sim |

A ordenação padrão é por **Nome** em ordem alfabética crescente (A–Z).

Ao clicar no cabeçalho de uma coluna ordenável, a listagem alterna entre crescente e decrescente. Um indicador visual (ícone de seta) mostra a coluna ativa e a direção da ordenação.

### Paginação

A listagem é paginada. O usuário pode selecionar a quantidade de registros exibidos por página nas opções: **10 / 50 / 100**. A opção padrão é **50**.

A paginação exibe: número da página atual, total de páginas e total de registros encontrados.

## Filtro Dinâmico

O filtro dinâmico é o único mecanismo de filtragem da listagem. A tela carrega com o filtro **Status = Ativo** pré-aplicado. O usuário pode alterar, adicionar ou remover filtros livremente.

Cada filtro adicionado é composto por três elementos:

1. **Campo** — atributo pelo qual deseja filtrar
2. **Condição** — lógica de comparação, condicionada ao tipo do campo
3. **Valor** — o dado buscado

Múltiplos filtros podem ser combinados. A relação entre filtros é **E (AND)** — o sistema retorna apenas registros que satisfaçam todos os filtros aplicados simultaneamente.

### Campos disponíveis para filtro

| Campo | Tipo | Condições disponíveis |
|-------|------|-----------------------|
| Nome | Texto | contém, começa com, é igual a |
| Telefone | Texto | contém, é igual a |
| Discipulado por (líder) | Seleção | é igual a |
| Cidade | Texto | contém, é igual a |
| Bairro | Texto | contém, é igual a |
| Dia da célula | Seleção | é igual a (retorna apenas membros que são líderes de célula e possuem ao menos uma célula neste dia) |
| Horário da célula | Hora | é igual a, é depois de, é antes de (retorna apenas membros que são líderes de célula e possuem ao menos uma célula neste horário) |
| Tipo de ingresso | Seleção | é igual a |
| Data de ingresso | Data | é igual a, é depois de, é antes de |
| Data de nascimento | Data | é igual a, é depois de, é antes de |
| Status | Seleção | é igual a (`Ativo` / `Inativo` / `Todos`) |

O usuário pode adicionar quantos filtros quiser. Cada filtro pode ser removido individualmente. Há também um botão **"Limpar filtros"** que remove todos os filtros aplicados e restaura o filtro padrão (Status = Ativo).

### Comportamento da busca

Os filtros são aplicados ao clicar em **"Aplicar"** ou automaticamente ao pressionar Enter. A listagem atualiza sem recarregar a página. A paginação é reiniciada à primeira página a cada nova aplicação de filtros.

## Ações por Registro

Cada linha da tabela oferece acesso às ações disponíveis para o membro:

- **Visualizar** — abre a tela de visualização detalhada do membro
- **Editar** — abre o formulário de edição
- **Inativar** — disponível apenas para membros Ativos
- **Reativar** — disponível apenas para membros Inativos

---

# Mensagens e Estados

- **Lista vazia (sem registros ativos)**
  - **Condição:** Não há membros cadastrados com status Ativo
  - **Comportamento do sistema:** Exibe área vazia com mensagem e botão de ação
  - **Mensagem exibida:** "Nenhum membro ativo encontrado. Cadastre o primeiro membro."

- **Filtro sem resultado**
  - **Condição:** Os filtros aplicados não retornam nenhum registro
  - **Comportamento do sistema:** Exibe área vazia com mensagem e opção de limpar filtros
  - **Mensagem exibida:** "Nenhum resultado encontrado para os filtros aplicados."

- **Listagem com Status "Todos"**
  - **Condição:** Usuário aplica no filtro dinâmico: Status `é igual a` `Todos`
  - **Comportamento do sistema:** Exibe membros ativos e inativos na mesma listagem; o badge de status de cada linha indica claramente `Ativo` ou `Inativo`

- **Erro ao carregar**
  - **Condição:** Falha de comunicação ao buscar os dados
  - **Comportamento do sistema:** Exibe mensagem de erro com opção de tentar novamente
  - **Mensagem exibida:** "Não foi possível carregar a listagem. Tente novamente."

---

# Fluxos Relacionados e Navegação

## Fluxos Anteriores

- **[Criar Membro](./criar-membro.md)**
  Após salvar um novo membro, o usuário é redirecionado para esta listagem.

- **[Editar Membro](./editar-membro.md)**
  Após salvar uma edição, o usuário retorna para esta listagem.

## Fluxos Posteriores

- **[Criar Membro](./criar-membro.md)**
  Botão "Novo Membro" presente na listagem abre o formulário de criação.

- **[Visualizar Membro](./visualizar-membro.md)**
  Ação "Visualizar" em cada linha navega para o detalhe do membro.

- **[Editar Membro](./editar-membro.md)**
  Ação "Editar" em cada linha abre o formulário de edição.

- **[Inativar Membro](./inativar-membro.md)**
  Ação "Inativar" disponível para membros Ativos.

- **[Reativar Membro](./reativar-membro.md)**
  Ação "Reativar" disponível para membros Inativos.

---

# Regras e Comportamentos do Sistema

- O sistema deve pré-aplicar o filtro Status = `Ativo` no carregamento inicial da tela. O usuário pode alterar ou remover este filtro via filtro dinâmico.

- O campo Status no filtro dinâmico aceita os valores `Ativo`, `Inativo` e `Todos`. Ao selecionar `Todos`, o sistema exibe membros de qualquer status na mesma listagem.

- O sistema deve aplicar todos os filtros ativos simultaneamente com relação **E (AND)** entre eles.

- O sistema deve reiniciar a paginação para a primeira página sempre que os filtros forem aplicados ou alterados.

- O sistema deve preservar os filtros ativos ao navegar entre páginas da paginação.

- O sistema deve exibir indicador visual claro na coluna que está sendo usada como critério de ordenação e a direção (crescente/decrescente).

- O sistema deve reiniciar a paginação para a primeira página ao alterar a ordenação por coluna.

- O sistema deve aplicar a máscara de telefone `(##) # ####-####` na exibição da coluna, independentemente do formato armazenado.

- O sistema deve disponibilizar as ações de cada linha com base no status do membro: "Inativar" apenas para Ativos; "Reativar" apenas para Inativos.

---

# Cenários de Comportamento

## Cenário 1: Carregamento padrão da listagem

**Dado que** o usuário está autenticado
**E** existem 80 membros ativos e 15 membros inativos cadastrados

**Quando** acessa a tela de listagem de membros

**Então** o sistema deve:
  - Carregar com o filtro Status = Ativo pré-aplicado no filtro dinâmico
  - Exibir apenas os 80 membros com status Ativo
  - Ordenar por nome em ordem alfabética crescente
  - Exibir 50 registros na primeira página (padrão)
  - Exibir paginação indicando: página 1 de 2, 80 registros encontrados
  - Não exibir os 15 membros inativos

---

## Cenário 2: Filtro por cidade

**Dado que** a listagem está carregada com membros ativos
**E** existem 12 membros ativos com cidade `Guarulhos`

**Quando** adiciona um filtro: Campo `Cidade` | Condição `é igual a` | Valor `Guarulhos`
**E** clica em "Aplicar"

**Então** o sistema deve:
  - Exibir apenas os 12 membros de Guarulhos
  - Reiniciar a paginação para a página 1
  - Exibir total: 12 registros encontrados

---

## Cenário 3: Filtro por dia da célula retorna líderes com célula naquele dia

**Dado que** existem 3 membros que são líderes de célula com ao menos uma célula na `Quarta-feira`
**E** existem 20 membros que não são líderes

**Quando** adiciona o filtro: Campo `Dia da célula` | Condição `é igual a` | Valor `Quarta-feira`
**E** clica em "Aplicar"

**Então** o sistema deve:
  - Exibir apenas os 3 membros-líderes que possuem ao menos uma célula na quarta-feira
  - Não exibir membros que não são líderes de célula
  - Não exibir líderes que não possuem célula na quarta-feira

---

## Cenário 4: Filtrar membros inativos

**Dado que** a listagem está no estado padrão (filtro Status = Ativo pré-aplicado)
**E** existem 15 membros inativos

**Quando** altera o filtro de Status para `Inativo` no filtro dinâmico
**E** clica em "Aplicar"

**Então** o sistema deve:
  - Exibir apenas os 15 membros com status Inativo
  - Não exibir membros Ativos

---

## Cenário 5: Limpar filtros retorna ao estado padrão

**Dado que** o usuário aplicou os filtros: Cidade `Guarulhos` e Dia da célula `Quarta-feira`
**E** a listagem mostra 5 resultados

**Quando** clica em "Limpar filtros"

**Então** o sistema deve:
  - Remover todos os filtros aplicados pelo usuário
  - Restaurar o filtro padrão: Status = Ativo
  - Exibir novamente todos os membros Ativos
  - Reiniciar a paginação para a página 1

---

## Cenário 6: Ordenação por coluna

**Dado que** a listagem exibe membros ordenados por Nome (A–Z)

**Quando** clica no cabeçalho da coluna "Cidade"

**Então** o sistema deve:
  - Reordenar a listagem por Cidade em ordem crescente (A–Z)
  - Exibir indicador visual na coluna Cidade com seta para cima
  - Reiniciar a paginação para a página 1

**Quando** clica novamente no cabeçalho da coluna "Cidade"

**Então** o sistema deve:
  - Reordenar por Cidade em ordem decrescente (Z–A)
  - Inverter o indicador visual para seta para baixo
  - Reiniciar a paginação para a página 1

---

## Cenário 7: Troca de quantidade de registros por página

**Dado que** a listagem exibe 50 registros por página (padrão)
**E** há 80 membros ativos

**Quando** seleciona a opção `100` no seletor de registros por página

**Então** o sistema deve:
  - Exibir todos os 80 membros em uma única página
  - Atualizar o indicador de paginação: página 1 de 1, 80 registros

---

## Cenário 8: Filtro sem resultado exibe estado vazio

**Dado que** o usuário aplicou o filtro: Cidade `é igual a` `Manaus`
**E** não há membros cadastrados com cidade Manaus

**Quando** o sistema processa o filtro

**Então** o sistema deve:
  - Exibir a mensagem "Nenhum resultado encontrado para os filtros aplicados."
  - Não exibir linhas na tabela
  - Manter os filtros aplicados visíveis para que o usuário possa ajustá-los

---

# Permissões e Regras de Acesso

| Permissão | Descrição |
|-----------|-----------|
| `MEMBRO_VISUALIZAR` | Permite acessar a listagem e consultar membros |

No MVP, o perfil **Administrador** possui esta permissão por padrão.

---

# Histórico de Alterações

| Data       | Card | Autor           | Descrição da Alteração        |
|------------|------|-----------------|-------------------------------|
| 29/04/2026 | —    | Thiago Oliveira | Criação inicial do requisito  |
| 30/04/2026 | —    | Thiago Oliveira | Consolidação de filtros: status removido como filtro fixo, integrado ao filtro dinâmico com valor padrão Ativo; nota na coluna Discipulado por; regra de paginação ao reordenar; versão 0.2 |
| 30/04/2026 | —    | Thiago Oliveira | Semântica dos filtros Dia e Horário da célula explicitada: retornam membros cujo líder possui célula no dia/horário informado |

---

<div align="center">
  <sub><strong>🔒 Documento Confidencial</strong> • Uso Interno</sub>
</div>
