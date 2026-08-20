---

[Módulo: Dashboard](../../README.md) › **Dashboard Geral**

**Versão:** 0.2 | **Última atualização:** 30/04/2026

---

# Contextualização

O dashboard é a primeira tela exibida após o login e oferece à liderança e à secretaria uma leitura imediata da saúde e do crescimento da congregação, sem necessidade de navegar por relatórios ou filtros.

A necessidade surge da dificuldade em ter uma visão consolidada do estado atual da igreja: quantos membros estão ativos, quantas células estão em funcionamento, quem faz aniversário neste mês e como a base cresceu ao longo do tempo. Essas informações, reunidas em um único painel, apoiam decisões pastorais e operacionais do dia a dia.

O dashboard é utilizado por administradores e secretaria como ponto de partida de cada sessão, oferecendo contexto antes de qualquer ação específica.

---

# Detalhamento Funcional

## Acesso à Funcionalidade

O dashboard é exibido automaticamente após o login bem-sucedido. Também é acessível pelo menu principal, na opção **Dashboard** ou equivalente.

## Cards de Métricas

O dashboard exibe três cards de leitura rápida, sempre com dados em tempo real:

### Card 1 — Total de Membros Ativos

Exibe o número total de membros com status **Ativo** no sistema.

- Atualizado em tempo real com base no banco de dados
- Não inclui membros inativos

### Card 2 — Total de Células Ativas

Exibe o número total de células cujos líderes estão com status **Ativo**.

- Cada célula ativa de um líder ativo é contabilizada individualmente (um líder com duas células conta como duas células ativas)
- Líderes inativos não são contabilizados

**Comportamento ao clicar no card:**

Ao clicar, o sistema navega diretamente para a **tela de listagem de células**, sem nenhum filtro pré-aplicado, permitindo ao usuário consultar o detalhamento das células ativas.

### Card 3 — Aniversariantes do Mês

Exibe o número total de membros **ativos** cujo mês de nascimento corresponde ao mês atual do calendário.

**Comportamento ao clicar no card:**

Ao clicar, o sistema abre uma lista modal ou painel lateral com todos os aniversariantes do mês, contendo:

- Nome do membro
- Data de aniversário (dia e mês, no formato `DD/MM`)
- Botão **"Enviar parabéns"** — ao clicar, abre o WhatsApp do dispositivo com o número do membro pré-carregado e a mensagem padrão de aniversário já escrita no campo de texto

**Mensagem padrão de aniversário:**

> 🎉 Feliz aniversário, [Nome do membro]! Hoje celebramos a vida que Deus plantou em você — única, preciosa e cheia de propósito. A [Nome da Igreja] está ao seu lado, crendo que os melhores anos da sua história ainda estão por vir. Que o Senhor te abençoe e guarde em cada passo deste novo ciclo! 🙏✨

- `[Nome do membro]` é substituído pelo nome real do membro
- `[Nome da Igreja]` é substituído pelo nome do tenant cadastrado no sistema. No MVP, o valor fixo é **"Comunidade Cristã Wave"**; em versões futuras, deve ser lido dinamicamente do cadastro do tenant. **No MVP, este valor deve ser configurado via variável de ambiente ou constante no arquivo de configuração — não deve ser definido inline no código.**
- O link gerado segue o formato `https://wa.me/55[DDD][número]?text=[mensagem_codificada]`, com o telefone do membro sem máscara e a mensagem codificada em URL

A lista é ordenada pelo dia do aniversário em ordem crescente (quem faz aniversário primeiro no mês aparece no topo).

## Gráfico de Crescimento de Membros

Abaixo dos cards, o dashboard exibe um gráfico de linha ou área mostrando a **evolução acumulada do total de membros ativos** ao longo do tempo.

### Seletores de período

O usuário pode selecionar o período de visualização pelas opções:

| Opção | Comportamento |
|-------|---------------|
| **Anual** | Exibe os últimos 12 meses, com um ponto por mês |
| **Semestral** | Exibe os últimos 6 meses, com um ponto por mês |
| **Trimestral** | Exibe os últimos 3 meses, com um ponto por mês |
| **Personalizado** | Exibe o intervalo definido pelo usuário via datepicker (data início e data fim), com agrupamento por mês |

A opção padrão ao carregar o dashboard é **Anual**.

### Leitura do gráfico

- **Eixo Y:** total acumulado líquido de membros ativos (ingressos menos inativações até aquele mês)
- **Eixo X:** meses do período selecionado
- **Rótulo em cada ponto:** não exibido diretamente sobre o gráfico

**Tooltip ao passar o cursor sobre um ponto:**

Ao posicionar o cursor sobre qualquer ponto do gráfico, um tooltip é exibido com as informações do mês correspondente:

- **Total acumulado:** `N membros ativos`
- **Novos ingressos:** `+N` (membros cuja data de ingresso está dentro do mês). Exibido apenas se `N > 0`
- **Inativações:** `-N` (membros inativados naquele mês). Exibido apenas se `N > 0`

O gráfico reflete sempre o estado atual dos dados — membros inativados reduzem o total acumulado no período em que foram inativados.

---

# Mensagens e Estados

- **Sem aniversariantes no mês**
  - **Condição:** Nenhum membro ativo tem data de nascimento no mês atual
  - **Comportamento do sistema:** Card exibe `0`; ao clicar, exibe mensagem vazia
  - **Mensagem exibida:** "Nenhum aniversariante este mês."

- **Sem dados suficientes para o gráfico**
  - **Condição:** Não há membros cadastrados com data de ingresso no período selecionado
  - **Comportamento do sistema:** Exibe gráfico vazio com mensagem orientativa
  - **Mensagem exibida:** "Sem dados de ingresso para o período selecionado."

- **Erro ao carregar o dashboard**
  - **Condição:** Falha de comunicação ao buscar os dados
  - **Comportamento do sistema:** Exibe mensagem de erro com opção de recarregar
  - **Mensagem exibida:** "Não foi possível carregar o dashboard. Tente novamente."

---

# Fluxos Relacionados e Navegação

## Fluxos Anteriores

- **[Autenticação de Usuário](../autenticacao/autenticacao-usuario.md)**
  O dashboard é o destino imediato após o login bem-sucedido.

## Fluxos Relacionados

- **[Listar Membros](../membros/listar-membros.md)**
  Os cards de métricas são uma visão agregada dos dados gerenciados na listagem de membros.

- **[Listar Células](../celulas/listar-celulas.md)**
  O card de células ativas reflete o estado da listagem de células. Ao clicar no card, o usuário é direcionado para esta tela.

---

# Regras e Comportamentos do Sistema

- O sistema deve calcular o total de membros ativos excluindo membros com status Inativo.

- O sistema deve calcular o total de células ativas considerando apenas células cujos líderes possuem status Ativo — cada célula ativa é contada individualmente, independentemente de o mesmo líder ter mais de uma célula.

- O sistema opera no fuso horário de **Brasília (UTC-3)** para todas as operações de data e hora — carregamento de dashboard, cálculo de aniversariantes do mês e geração de timestamps de auditoria.

- O sistema deve calcular os aniversariantes do mês com base no mês atual no fuso horário de Brasília, comparando apenas o mês da data de nascimento (não o ano). Apenas membros Ativos entram na contagem.

- O sistema deve montar o link do WhatsApp substituindo todos os caracteres não numéricos do telefone, prefixando com `55` (código do Brasil) e codificando a mensagem em URL antes de gerar o link.

- O sistema deve substituir `[Nome do membro]` pelo nome completo do membro e `[Nome da Igreja]` pelo nome do tenant cadastrado no sistema ao montar a mensagem do WhatsApp.

- O sistema deve calcular o total acumulado de membros por mês no gráfico considerando: membros com data de ingresso até o último dia do mês representado e que ainda estavam Ativos ao final daquele mês.

- O sistema deve exibir o tooltip ao passar o cursor sobre cada ponto do gráfico, contendo: total acumulado do mês, novos ingressos (`+N`, somente se `N > 0`) e inativações (`-N`, somente se `N > 0`).

- O card "Total de Células Ativas" deve ser clicável e navegar para a listagem de células.

- Todos os cards e o gráfico devem refletir o estado atual dos dados sem necessidade de recarregar a página manualmente.

---

# Cenários de Comportamento

## Cenário 1: Carregamento do dashboard após login

**Dado que** o sistema possui 120 membros ativos, 14 células ativas e 5 membros com aniversário no mês corrente

**Quando** o usuário faz login e é redirecionado ao dashboard

**Então** o sistema deve:
  - Exibir o card "Total de Membros Ativos" com o valor `120`
  - Exibir o card "Total de Células Ativas" com o valor `14`
  - Exibir o card "Aniversariantes do Mês" com o valor `5`
  - Exibir o gráfico de crescimento com o período Anual selecionado por padrão

---

## Cenário 2: Abrir lista de aniversariantes e enviar parabéns via WhatsApp

**Dado que** o card "Aniversariantes do Mês" exibe `5`
**E** um dos aniversariantes é `Ana Paula Ferreira`, com telefone `(11) 9 8765-4321` e aniversário no dia `12`

**Quando** o usuário clica no card

**Então** o sistema deve:
  - Exibir a lista dos 5 aniversariantes ordenada pelo dia do aniversário
  - Exibir `Ana Paula Ferreira — 12/05` com botão "Enviar parabéns"

**Quando** o usuário clica em "Enviar parabéns" na linha de `Ana Paula Ferreira`

**Então** o sistema deve:
  - Abrir o WhatsApp com o número `5511987654321`
  - Preencher o campo de mensagem com:
    > 🎉 Feliz aniversário, Ana Paula Ferreira! Hoje celebramos a vida que Deus plantou em você — única, preciosa e cheia de propósito. A Comunidade Cristã Wave está ao seu lado, crendo que os melhores anos da sua história ainda estão por vir. Que o Senhor te abençoe e guarde em cada passo deste novo ciclo! 🙏✨

---

## Cenário 3: Gráfico anual com tooltip de ingressos e inativações

**Dado que** nos últimos 12 meses:
- Janeiro: 8 ingressos, 0 inativações
- Fevereiro: 0 ingressos, 3 inativações
- Março: 12 ingressos, 2 inativações

**Quando** o usuário visualiza o gráfico com o período Anual selecionado

**Então** o sistema deve:
  - Exibir 12 pontos no gráfico (um por mês)
  - O valor de cada ponto deve ser o total acumulado líquido ao final daquele mês

**Quando** o usuário passa o cursor sobre o ponto de janeiro

**Então** o sistema deve exibir o tooltip:
  - `Total acumulado: [N] membros ativos`
  - `+8 novos ingressos`
  - (sem linha de inativações, pois é 0)

**Quando** o usuário passa o cursor sobre o ponto de fevereiro

**Então** o sistema deve exibir o tooltip:
  - `Total acumulado: [N] membros ativos`
  - `-3 inativações`
  - (sem linha de novos ingressos, pois é 0)

**Quando** o usuário passa o cursor sobre o ponto de março

**Então** o sistema deve exibir o tooltip:
  - `Total acumulado: [N] membros ativos`
  - `+12 novos ingressos`
  - `-2 inativações`

---

## Cenário 4: Troca de período do gráfico para Trimestral

**Dado que** o dashboard está exibindo o gráfico no período Anual

**Quando** o usuário seleciona a opção "Trimestral"

**Então** o sistema deve:
  - Atualizar o gráfico exibindo apenas os últimos 3 meses
  - Manter o comportamento de tooltip nos pontos correspondentes

---

## Cenário 5: Gráfico com período personalizado

**Dado que** o usuário seleciona a opção "Personalizado"

**Quando** define data início `01/01/2024` e data fim `31/12/2024`

**Então** o sistema deve:
  - Exibir o gráfico com 12 pontos (jan a dez de 2024)
  - Cada ponto representa o total acumulado de membros ativos ao final de cada mês de 2024

---

## Cenário 6: Nenhum aniversariante no mês

**Dado que** nenhum membro ativo tem data de nascimento no mês atual

**Quando** o usuário clica no card "Aniversariantes do Mês"

**Então** o sistema deve:
  - Exibir a mensagem "Nenhum aniversariante este mês."
  - Não exibir nenhum nome na lista

---

## Cenário 7: Total de células ativas exclui líderes inativos e conta células individualmente

**Dado que** existem líderes ativos com o seguinte cenário:
- Carlos Souza (ativo): 2 células
- Marcos Lima (ativo): 1 célula
- Juliana Costa (inativa): 1 célula

**Quando** o dashboard é carregado

**Então** o sistema deve:
  - Exibir o card "Total de Células Ativas" com o valor `3`
  - Não contabilizar a célula de Juliana Costa (inativa)

---

## Cenário 8: Clique no card de células navega para a listagem

**Dado que** o dashboard está carregado com `3` células ativas

**Quando** o usuário clica no card "Total de Células Ativas"

**Então** o sistema deve:
  - Navegar para a tela de listagem de células sem filtros pré-aplicados

---

# Permissões e Regras de Acesso

| Permissão | Descrição |
|-----------|-----------|
| `DASHBOARD_VISUALIZAR` | Permite acessar e visualizar o dashboard com todas as métricas |

No MVP, o perfil **Administrador** possui esta permissão por padrão.

---

# Histórico de Alterações

| Data       | Card | Autor           | Descrição da Alteração        |
|------------|------|-----------------|-------------------------------|
| 29/04/2026 | —    | Thiago Oliveira | Criação inicial do requisito  |
| 30/04/2026 | —    | Thiago Oliveira | Nome da igreja via variável de ambiente; fuso horário de Brasília (UTC-3) como premissa global; Cenário 4 corrigido (tooltip, não rótulos inline) |

---

<div align="center">
  <sub><strong>🔒 Documento Confidencial</strong> • Uso Interno</sub>
</div>
