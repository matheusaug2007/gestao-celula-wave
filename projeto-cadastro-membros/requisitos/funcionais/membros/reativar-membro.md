---

[Módulo: Membros](../../README.md) › **Reativar Membro**

**Versão:** 0.2 | **Última atualização:** 30/04/2026

---

# Contextualização

A reativação de membro permite restabelecer o vínculo ativo de uma pessoa que havia sido inativada, reintegrando-a à congregação no sistema sem necessidade de um novo cadastro.

É comum que membros que se afastaram temporariamente retornem — por mudança de situação pessoal, reconciliação com a congregação ou simples retomada de participação. Nesses casos, o histórico completo do membro já está preservado no sistema, e a reativação deve ser um processo simples e direto.

Diferente da inativação, a reativação não envolve redistribuição de membros. O único ponto de atenção é que o membro reativado precisa ter um líder válido e ativo vinculado — caso o líder anterior tenha sido inativado ou não seja mais líder, o sistema deve solicitar a seleção de um novo líder no momento da reativação.

Caso o membro sendo reativado **era líder de célula** quando foi inativado, o sistema também restaura automaticamente o flag `é líder de célula` e reativa as células que estavam em estado oculto.

---

# Detalhamento Funcional

## Acesso à Funcionalidade

A ação **"Reativar"** está disponível:
- Em cada linha da listagem de membros (visível ao filtrar membros Inativos)
- Na tela de visualização do membro inativo

## Fluxo de Reativação — Líder anterior ainda válido

Ao clicar em "Reativar", o sistema verifica se o líder ao qual o membro estava vinculado ainda está ativo e ainda possui o flag de líder de célula.

Se o líder anterior ainda for válido, o sistema exibe um modal de confirmação simples:

> "Deseja reativar **[Nome do membro]**? Ele voltará a ser vinculado ao líder **[Nome do líder]**."

**Ações disponíveis:**
- **Confirmar** — reativa o membro e restaura o vínculo com o líder anterior
- **Cancelar** — fecha o modal sem alterações

## Fluxo de Reativação — Líder anterior inválido

O líder anterior é considerado inválido em dois casos:
1. O líder está **inativo** como membro
2. O líder está ativo como membro, mas **não é mais líder de célula** (perdeu o flag)

Ambos os casos são tratados da mesma forma — o sistema não pode restaurar o vínculo original. O modal de reativação exibe:

> "O líder anterior de **[Nome do membro]** não está mais disponível. Selecione um novo líder para concluir a reativação."

O modal apresenta um seletor de líderes ativos (busca/seleção entre membros com flag de líder ativo e status Ativo). A confirmação só é habilitada após selecionar um líder.

## Fluxo de Reativação — Ex-líder de célula

Quando o membro sendo reativado **era líder de célula** no momento da inativação, o sistema:
1. Restaura o flag `é líder de célula`
2. Reativa as células que estavam em estado oculto (preservadas no banco durante a inativação)
3. As células voltam a aparecer na listagem de células
4. Exibe toast "Membro reativado com sucesso."

Este fluxo ocorre de forma automática, sem interação adicional do usuário (além da confirmação padrão de reativação).

## Estado após a reativação

O membro passa a ter status **Ativo** e:
- Volta a aparecer na listagem padrão
- Volta a ser contabilizado nos totais do dashboard
- Fica vinculado ao líder confirmado na reativação
- Se era líder: tem o flag e as células restaurados automaticamente

---

# Mensagens e Estados

- **Confirmação com líder válido**
  - **Condição:** Líder anterior ainda está ativo e ainda possui o flag de líder de célula
  - **Mensagem exibida:** "Deseja reativar [Nome do membro]? Ele voltará a ser vinculado ao líder [Nome do líder]."

- **Confirmação com seleção de novo líder**
  - **Condição:** Líder anterior inválido — líder inativo OU líder ativo sem o flag de líder de célula
  - **Mensagem exibida:** "O líder anterior de [Nome do membro] não está mais disponível. Selecione um novo líder para concluir a reativação."

- **Reativação concluída**
  - **Condição:** Reativação confirmada com sucesso
  - **Mensagem exibida:** Toast "Membro reativado com sucesso."

---

# Fluxos Relacionados e Navegação

## Fluxos Anteriores

- **[Listar Membros](./listar-membros.md)**
  Ação "Reativar" visível ao filtrar membros com status Inativo.

- **[Visualizar Membro](./visualizar-membro.md)**
  Botão "Reativar" disponível na tela de visualização de membros Inativos.

## Fluxos Alternativos

- **[Inativar Membro](./inativar-membro.md)**
  A reativação reverte o efeito da inativação.

---

# Regras e Comportamentos do Sistema

- O sistema deve exibir a ação "Reativar" apenas para membros com status **Inativo**.

- O sistema deve verificar, no momento da reativação, se o líder anterior do membro ainda está válido. O líder é considerado válido somente se estiver ativo **e** ainda possuir o flag de líder de célula ativo.

- O sistema deve exigir a seleção de um novo líder quando o líder anterior for inválido — independentemente de estar inativo como membro ou ter apenas perdido o flag de líder. Ambos os casos exibem o mesmo fluxo de seleção de novo líder.

- O sistema deve bloquear a confirmação da reativação até que um novo líder seja selecionado (nos casos de líder inválido).

- O sistema deve alterar o status do membro para **Ativo** e registrar o vínculo com o líder confirmado.

- O sistema deve verificar se o membro sendo reativado possuía o flag `é líder de célula` quando foi inativado. Em caso positivo, o flag e as células preservadas em estado oculto devem ser restaurados automaticamente na reativação.

- O sistema deve registrar data, hora e usuário responsável pela reativação para fins de auditoria.

---

# Cenários de Comportamento

## Cenário 1: Reativação com líder anterior ativo

**Dado que** `Ana Paula Ferreira` está inativa e estava vinculada ao líder `Carlos Souza`, que permanece ativo com flag de líder
**E** o usuário filtra a listagem por status Inativo
**E** clica em "Reativar" na linha de `Ana Paula Ferreira`

**Quando** o sistema exibe o modal: "Deseja reativar Ana Paula Ferreira? Ela voltará a ser vinculada ao líder Carlos Souza."
**E** o usuário clica em "Confirmar"

**Então** o sistema deve:
  - Alterar o status de `Ana Paula Ferreira` para Ativo
  - Restaurar o vínculo com `Carlos Souza`
  - Exibir toast "Membro reativado com sucesso."
  - `Ana Paula Ferreira` volta a aparecer na listagem padrão

---

## Cenário 2: Reativação com líder anterior inativo — seleção obrigatória de novo líder

**Dado que** `Pedro Alves` está inativo e estava vinculado ao líder `Roberto Nunes`, que também está inativo

**Quando** o usuário clica em "Reativar" na linha de `Pedro Alves`

**Então** o sistema deve:
  - Exibir o modal: "O líder anterior de Pedro Alves não está mais disponível. Selecione um novo líder para concluir a reativação."
  - Exibir seletor com apenas líderes Ativos com flag de líder ativo
  - Manter o botão "Confirmar" desabilitado até a seleção de um líder

**Quando** o usuário seleciona o líder `Marcos Lima`
**E** clica em "Confirmar"

**Então** o sistema deve:
  - Reativar `Pedro Alves` com vínculo ao líder `Marcos Lima`
  - Exibir toast "Membro reativado com sucesso."

---

## Cenário 3: Reativação com líder anterior ativo mas sem flag de líder — tratamento igual ao inativo

**Dado que** `Ana Lima` está inativa e estava vinculada ao líder `Carlos Souza`
**E** `Carlos Souza` está ativo como membro, mas não é mais líder de célula (flag removido)

**Quando** o usuário clica em "Reativar" na linha de `Ana Lima`

**Então** o sistema deve:
  - Detectar que o líder anterior não é mais válido (sem flag de líder)
  - Exibir o mesmo modal de seleção de novo líder: "O líder anterior de Ana Lima não está mais disponível. Selecione um novo líder para concluir a reativação."
  - Não exibir o modal de confirmação simples

---

## Cenário 4: Cancelamento da reativação

**Dado que** o modal de confirmação de reativação está aberto para `Ana Paula Ferreira`

**Quando** o usuário clica em "Cancelar"

**Então** o sistema deve:
  - Fechar o modal
  - Manter `Ana Paula Ferreira` com status Inativo
  - Não realizar nenhuma alteração

---

## Cenário 5: Membro reativado volta à listagem padrão

**Dado que** `Ana Paula Ferreira` foi reativada com sucesso

**Quando** o usuário acessa a listagem de membros sem filtros adicionais

**Então** o sistema deve:
  - Exibir `Ana Paula Ferreira` na listagem (filtro padrão Status = Ativo)
  - Exibir seu status como `Ativo`

---

## Cenário 6: Reativação de ex-líder de célula — flag e células restaurados

**Dado que** `Carlos Souza` era líder de célula (células: Quarta 19:30 e Sexta 20:00) quando foi inativado
**E** durante a inativação seus membros foram redistribuídos para outros líderes
**E** `Carlos Souza` está atualmente com status Inativo e flag de líder preservado em estado oculto

**Quando** o usuário reativa `Carlos Souza` (líder anterior válido: ele é discipulado por outro líder ativo)
**E** confirma o modal de reativação

**Então** o sistema deve:
  - Alterar o status de `Carlos Souza` para Ativo
  - Restaurar automaticamente o flag `é líder de célula`
  - Reativar as células Quarta 19:30 e Sexta 20:00 (removê-las do estado oculto)
  - As células voltam a aparecer na listagem de células
  - Exibir toast "Membro reativado com sucesso."

---

# Permissões e Regras de Acesso

| Permissão | Descrição |
|-----------|-----------|
| `MEMBRO_REATIVAR` | Permite reativar membros inativos |

No MVP, o perfil **Administrador** possui esta permissão por padrão.

---

# Histórico de Alterações

| Data       | Card | Autor           | Descrição da Alteração        |
|------------|------|-----------------|-------------------------------|
| 29/04/2026 | —    | Thiago Oliveira | Criação inicial do requisito  |
| 30/04/2026 | —    | Thiago Oliveira | Vínculo membro→líder; cenários renumerados (1-6); Cenário 6 (reativação de ex-líder com restauração de flag e células); fluxo de "célula inválida" renomeado para "líder inválido"; versão 0.2 |

---

<div align="center">
  <sub><strong>🔒 Documento Confidencial</strong> • Uso Interno</sub>
</div>
