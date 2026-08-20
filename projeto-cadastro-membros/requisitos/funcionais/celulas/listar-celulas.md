---

[Módulo: Células](../../README.md) › **Listar Células**

**Versão:** 0.2 | **Última atualização:** 30/04/2026

---

# Contextualização

A listagem de células oferece à liderança e à secretaria uma visão consolidada de todas as células ativas da congregação, permitindo consultar rapidamente sua distribuição por dia, horário e localização.

Uma célula não possui nome próprio — sua identidade é formada pelo líder que a conduz, o endereço onde se reúne, o dia da semana e o horário. A listagem traduz essa composição em uma tabela navegável, com informações suficientes para identificar cada célula sem ambiguidade.

O filtro dinâmico desta tela é especialmente útil para a secretaria durante a alocação de novos membros: permite cruzar dia, horário e bairro para identificar qual célula é mais conveniente geograficamente para um novo membro.

A tela serve de ponto de entrada para as operações de visualização e edição de cada célula.

---

# Detalhamento Funcional

## Acesso à Funcionalidade

O usuário acessa a listagem pelo menu principal, na seção **Células**. A tela carrega exibindo por padrão apenas células cujos líderes estão com status **Ativo**.

## Estrutura da Listagem

### Colunas

| Coluna | Descrição | Ordenável |
|--------|-----------|-----------|
| **Líder** | Nome do membro que lidera a célula | Sim |
| **Dia** | Dia da semana em que a célula se reúne | Sim |
| **Horário** | Horário de início da célula | Sim |
| **Tipos** | Tipos da célula (ex: "Adulto" ou "Adulto, Teens") | Não |
| **Bairro / Cidade** | Bairro e cidade do endereço da célula | Sim |
| **Membros ativos** | Quantidade de membros ativos vinculados ao líder desta célula. Se o líder possuir múltiplas células, todas as linhas do líder exibem o mesmo total (todos os membros do líder). | Sim |

Um líder com múltiplas células aparece em múltiplas linhas — uma linha por célula.

A ordenação padrão é por **Líder** em ordem alfabética crescente (A–Z).

Ao clicar no cabeçalho de uma coluna ordenável, a listagem alterna entre crescente e decrescente. Um indicador visual mostra a coluna ativa e a direção da ordenação.

### Paginação

A listagem é paginada com opções de **10 / 50 / 100** registros por página. O padrão é **50**. A paginação exibe a página atual, o total de páginas e o total de registros encontrados.

## Células Exibidas por Padrão

Apenas células de líderes **Ativos** são exibidas no carregamento inicial. Células de líderes inativados ficam ocultas (preservadas no banco em estado oculto) e não são acessíveis por esta listagem em nenhuma condição no MVP — não há filtro de status de líder para visualizá-las. Elas são restauradas automaticamente quando o líder é reativado.

## Filtro Dinâmico

Segue o mesmo modelo da listagem de membros: o usuário escolhe um **campo**, uma **condição** e um **valor**, podendo empilhar múltiplos filtros. A relação entre filtros é **E (AND)**.

### Campos disponíveis para filtro

| Campo | Tipo | Condições disponíveis |
|-------|------|-----------------------|
| Líder | Texto | contém, começa com, é igual a |
| Dia | Seleção | é igual a |
| Horário | Hora | é igual a, é depois de, é antes de |
| Tipo | Seleção múltipla | contém (retorna células que possuam ao menos um dos tipos selecionados) |
| Bairro | Texto | contém, é igual a |
| Cidade | Texto | contém, é igual a |
| Membros ativos | Número | é igual a, maior que, menor que |

O botão **"Limpar filtros"** remove todos os filtros aplicados e retorna a listagem ao estado padrão. Os filtros são aplicados ao clicar em **"Aplicar"** ou ao pressionar Enter. A paginação reinicia à primeira página a cada aplicação.

## Ações por Registro

Cada linha da tabela oferece acesso às ações disponíveis para a célula:

- **Visualizar** — abre a tela de detalhe da célula
- **Editar** — abre o formulário de edição da célula

---

# Mensagens e Estados

- **Lista vazia**
  - **Condição:** Não há células com líderes ativos cadastrados
  - **Comportamento do sistema:** Exibe área vazia com mensagem orientativa
  - **Mensagem exibida:** "Nenhuma célula encontrada. Cadastre um líder de célula para começar."

- **Filtro sem resultado**
  - **Condição:** Os filtros aplicados não retornam nenhuma célula
  - **Comportamento do sistema:** Exibe área vazia com opção de limpar filtros
  - **Mensagem exibida:** "Nenhum resultado encontrado para os filtros aplicados."

- **Erro ao carregar**
  - **Condição:** Falha de comunicação ao buscar os dados
  - **Comportamento do sistema:** Exibe mensagem de erro com opção de tentar novamente
  - **Mensagem exibida:** "Não foi possível carregar a listagem. Tente novamente."

---

# Fluxos Relacionados e Navegação

## Fluxos Posteriores

- **[Visualizar Célula](./visualizar-celula.md)**
  Ação "Visualizar" em cada linha navega para o detalhe da célula.

- **[Editar Célula](./editar-celula.md)**
  Ação "Editar" em cada linha abre o formulário de edição.

## Fluxos Relacionados

- **[Listar Membros](../membros/listar-membros.md)**
  O filtro de "Discipulado por" na listagem de membros complementa esta visão, permitindo ver todos os membros discipulados por determinado líder.

---

# Regras e Comportamentos do Sistema

- O sistema deve exibir apenas células cujos líderes possuem status **Ativo**. Células de líderes inativos não aparecem na listagem.

- O sistema deve calcular a coluna **Membros ativos** contando apenas membros com status Ativo vinculados ao respectivo líder; membros inativos não entram na contagem. Se o líder possuir múltiplas células, todas as linhas do líder exibem o mesmo total de membros (o vínculo é membro→líder, não membro→célula específica).

- O sistema deve aplicar todos os filtros ativos com relação **E (AND)** entre eles.

- O sistema deve reiniciar a paginação para a primeira página sempre que os filtros forem alterados ou aplicados.

- O sistema deve preservar os filtros ativos ao navegar entre páginas da paginação.

- O sistema deve exibir indicador visual na coluna que está sendo usada para ordenação e a direção (crescente/decrescente).

---

# Cenários de Comportamento

## Cenário 1: Carregamento padrão da listagem

**Dado que** existem 10 células com líderes ativos e 3 células com líderes inativos

**Quando** o usuário acessa a listagem de células

**Então** o sistema deve:
  - Exibir apenas as 10 células de líderes ativos
  - Ordenar por Líder em ordem alfabética crescente
  - Não exibir as 3 células de líderes inativos

---

## Cenário 2: Filtro por dia da semana

**Dado que** existem 4 células que se reúnem na `Quarta-feira`

**Quando** o usuário aplica o filtro: Campo `Dia` | Condição `é igual a` | Valor `Quarta-feira`

**Então** o sistema deve:
  - Exibir apenas as 4 células de quarta-feira
  - Exibir total: 4 registros encontrados

---

## Cenário 3: Filtro combinado por dia e bairro

**Dado que** há 2 células que se reúnem na `Sexta-feira` no bairro `Centro`

**Quando** o usuário aplica: Dia `é igual a` `Sexta-feira` E Bairro `é igual a` `Centro`

**Então** o sistema deve:
  - Exibir apenas as 2 células que satisfazem ambos os critérios

---

## Cenário 4: Filtro por quantidade de membros

**Dado que** existem 3 células com mais de 15 membros ativos

**Quando** o usuário aplica: Membros ativos `maior que` `15`

**Então** o sistema deve:
  - Exibir apenas as 3 células com mais de 15 membros ativos

---

## Cenário 5: Ordenação por horário

**Dado que** a listagem está carregada com múltiplas células

**Quando** o usuário clica no cabeçalho "Horário"

**Então** o sistema deve:
  - Ordenar as células pelo horário de início em ordem crescente
  - Exibir indicador visual na coluna Horário

**Quando** clica novamente em "Horário"

**Então** o sistema deve:
  - Inverter a ordenação para decrescente

---

## Cenário 6: Coluna "Membros ativos" exclui membros inativos e reflete vínculo com líder

**Dado que** `Carlos Souza` possui 10 membros ativos e 3 inativos vinculados a ele como líder
**E** `Carlos Souza` lidera 2 células (Quarta 19:30 e Sexta 20:00)

**Quando** o usuário visualiza as linhas de `Carlos Souza` na listagem

**Então** o sistema deve:
  - Exibir `10` na coluna Membros ativos em ambas as linhas do líder
  - Não contabilizar os 3 membros inativos
  - Exibir as duas células em linhas separadas, ambas com o mesmo total de membros ativos

---

# Permissões e Regras de Acesso

| Permissão | Descrição |
|-----------|-----------|
| `CELULA_VISUALIZAR` | Permite acessar a listagem e consultar células |

No MVP, o perfil **Administrador** possui esta permissão por padrão.

---

# Histórico de Alterações

| Data       | Card | Autor           | Descrição da Alteração        |
|------------|------|-----------------|-------------------------------|
| 29/04/2026 | —    | Thiago Oliveira | Criação inicial do requisito  |
| 30/04/2026 | —    | Thiago Oliveira | Coluna e filtro de tipos de célula; suporte a múltiplas células por líder (uma linha por célula) |
| 30/04/2026 | —    | Thiago Oliveira | Membros ativos vinculados ao líder (não à célula específica); células inativas documentadas como ocultas (restauradas na reativação do líder) |

---

<div align="center">
  <sub><strong>🔒 Documento Confidencial</strong> • Uso Interno</sub>
</div>
