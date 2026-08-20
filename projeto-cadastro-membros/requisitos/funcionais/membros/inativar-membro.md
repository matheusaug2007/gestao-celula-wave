---

[Módulo: Membros](../../README.md) › **Inativar Membro**

**Versão:** 0.3 | **Última atualização:** 30/04/2026

---

# Contextualização

A inativação de membro registra formalmente o afastamento de uma pessoa da congregação, preservando todo o seu histórico no sistema sem excluir dados permanentemente.

Situações como mudança de cidade, desligamento voluntário ou simples perda de contato são comuns na dinâmica de uma igreja. Manter esses registros acessíveis — ainda que inativos — permite que a liderança acompanhe a evolução da base ao longo do tempo e eventualmente reintegre membros que retornem.

Quando o membro a ser inativado é um líder de célula com membros **ativos** vinculados, o sistema exige a redistribuição prévia desses membros antes de confirmar a inativação, garantindo que nenhum membro ativo fique sem célula. Membros **inativos** vinculados ao líder mantêm o vínculo histórico e serão tratados individualmente no momento de cada reativação futura.

A inativação é acessada a partir da listagem de membros ou da tela de visualização, e está disponível apenas para membros com status Ativo.

---

# Detalhamento Funcional

## Acesso à Funcionalidade

A ação **"Inativar"** está disponível:
- Em cada linha da listagem de membros (para membros Ativos)
- Na tela de visualização do membro (para membros Ativos)

## Fluxo de Inativação — Membro sem liderança (ou líder sem membros vinculados)

Ao clicar em "Inativar", o sistema exibe um modal de confirmação simples:

> "Tem certeza que deseja inativar **[Nome do membro]**? Esta ação pode ser desfeita a qualquer momento."

**Ações disponíveis:**
- **Confirmar** — inativa o membro e exibe feedback de sucesso
- **Cancelar** — fecha o modal sem alterações

## Fluxo de Inativação — Líder de célula com membros vinculados

Quando o membro a ser inativado é um líder com membros ativos vinculados, o sistema **bloqueia a confirmação direta** e exibe o **modal de redistribuição** antes do modal de inativação.

### Modal de Redistribuição

O modal exibe:

- Título: "Redistribuir membros de [Nome do líder]"
- Mensagem: "Antes de inativar este líder, transfira todos os membros ativos liderados por ele para outros líderes."
- Lista de todos os membros **ativos** vinculados ao líder, cada um com:
  - Nome do membro
  - Líder atual
  - Seletor de novo líder (busca/seleção entre líderes ativos com flag de líder ativo, excluindo o líder sendo inativado)
- Indicador de progresso: "X de Y redistribuídos"
- Botão **"Confirmar redistribuição e inativar"** — habilitado somente quando todos os membros ativos tiverem nova célula selecionada
- Botão **"Cancelar"** — fecha o modal sem realizar nenhuma alteração

O administrador pode direcionar os membros para a mesma célula ou para células diferentes.

**Membros inativos** vinculados ao líder **não aparecem no modal**. Eles mantêm o vínculo histórico e serão tratados na reativação individual futura.

Ao confirmar:
1. Todos os membros ativos listados são transferidos para os novos líderes selecionados
2. O membro (ex-líder) é inativado
3. O flag `é líder de célula` e as células vinculadas são **preservados no banco de dados** em estado oculto — não são apagados. Ao reativar o membro, o flag e as células são restaurados automaticamente.
4. O usuário recebe feedback de sucesso

## Estado após a inativação

O membro passa a ter status **Inativo** e:
- Deixa de aparecer na listagem padrão (que exibe apenas Ativos)
- Não aparece como opção no seletor de líderes
- Tem seus dados (incluindo células e flag de líder) preservados integralmente no banco de dados
- Pode ser reativado a qualquer momento, com restauração automática do flag e das células

---

# Mensagens e Estados

- **Confirmação simples**
  - **Condição:** Membro não é líder, ou é líder sem membros vinculados
  - **Mensagem exibida:** "Tem certeza que deseja inativar [Nome do membro]? Esta ação pode ser desfeita a qualquer momento."

- **Modal de redistribuição bloqueante**
  - **Condição:** Membro é líder com membros ativos vinculados
  - **Mensagem exibida:** "Antes de inativar este líder, transfira todos os membros da sua célula para outros líderes."

- **Sem líderes disponíveis para redistribuição**
  - **Condição:** Não existe nenhuma outra célula ativa no sistema para receber os membros
  - **Comportamento do sistema:** Bloqueia a inativação sem abrir o modal de redistribuição
  - **Mensagem exibida:** "Não há outras células ativas disponíveis para redistribuição. Cadastre outro líder antes de inativar este."

- **Botão desabilitado na redistribuição**
  - **Condição:** Nem todos os membros possuem novo líder selecionado
  - **Mensagem exibida:** Indicador "X de Y redistribuídos"

- **Inativação concluída**
  - **Condição:** Inativação confirmada com sucesso
  - **Mensagem exibida:** Toast "Membro inativado com sucesso."

---

# Fluxos Relacionados e Navegação

## Fluxos Anteriores

- **[Listar Membros](./listar-membros.md)**
  Ação "Inativar" disponível nas linhas da listagem para membros Ativos.

- **[Visualizar Membro](./visualizar-membro.md)**
  Botão "Inativar" disponível na tela de visualização para membros Ativos.

## Fluxos Alternativos

- **[Reativar Membro](./reativar-membro.md)**
  A inativação pode ser desfeita a qualquer momento pela ação de reativação.

---

# Regras e Comportamentos do Sistema

- O sistema deve exibir a ação "Inativar" apenas para membros com status **Ativo**.

- O sistema deve verificar se o membro é líder de célula com membros ativos vinculados antes de exibir qualquer modal.

- O sistema deve bloquear a inativação direta de líderes com membros **ativos** vinculados em qualquer de suas células, exigindo redistribuição prévia de todos eles.

- O sistema deve excluir o líder sendo inativado das opções no seletor de novo líder dentro do modal de redistribuição.

- O sistema deve habilitar o botão "Confirmar redistribuição e inativar" somente após todos os membros ativos listados receberem nova célula selecionada.

- O sistema **não deve** incluir membros inativos no modal de redistribuição. Membros inativos mantêm o vínculo histórico com o líder inativado.

- O sistema deve efetivar a redistribuição e a inativação de forma atômica — ou tudo ocorre com sucesso, ou nenhuma alteração é persistida em caso de falha.

- A inativação não deve excluir dados do membro — apenas alterar o campo de status para **Inativo**. O flag `é líder de célula` e as células vinculadas ao líder inativado são preservados no banco em estado oculto, para restauração automática em caso de reativação.

- Quando não houver nenhuma outra célula ativa disponível para redistribuição (ex.: o líder sendo inativado é o único líder ativo do sistema), o sistema deve bloquear a inativação e exibir a mensagem: "Não há outras células ativas disponíveis para redistribuição. Cadastre outro líder antes de inativar este."

- O sistema deve registrar data, hora e usuário responsável pela inativação para fins de auditoria.

---

# Cenários de Comportamento

## Cenário 1: Inativação de membro simples (não líder)

**Dado que** `Ana Paula Ferreira` é um membro ativo não líder
**E** o usuário clica em "Inativar" na linha de `Ana Paula Ferreira` na listagem

**Quando** o sistema exibe o modal de confirmação simples
**E** o usuário clica em "Confirmar"

**Então** o sistema deve:
  - Alterar o status de `Ana Paula Ferreira` para Inativo
  - Exibir toast "Membro inativado com sucesso."
  - Remover `Ana Paula Ferreira` da listagem padrão (que exibe apenas Ativos)

---

## Cenário 2: Cancelamento da inativação

**Dado que** o modal de confirmação de inativação está aberto para `Ana Paula Ferreira`

**Quando** o usuário clica em "Cancelar"

**Então** o sistema deve:
  - Fechar o modal
  - Manter `Ana Paula Ferreira` com status Ativo
  - Não realizar nenhuma alteração

---

## Cenário 3: Inativação de líder com membros vinculados — redistribuição obrigatória

**Dado que** `Carlos Souza` é líder ativo com 8 membros ativos vinculados
**E** o usuário clica em "Inativar" na linha de `Carlos Souza`

**Quando** o sistema verifica que `Carlos Souza` é líder com membros vinculados

**Então** o sistema deve:
  - Exibir o modal de redistribuição com os 8 membros listados
  - Exibir indicador "0 de 8 redistribuídos"
  - Exibir botão "Confirmar redistribuição e inativar" desabilitado
  - Não exibir o modal de confirmação simples

---

## Cenário 4: Inativação de líder após redistribuição completa

**Dado que** o modal de redistribuição está aberto com 8 membros de `Carlos Souza`
**E** o usuário atribuiu novos líderes a todos os 8 membros

**Quando** clica em "Confirmar redistribuição e inativar"

**Então** o sistema deve:
  - Transferir os 8 membros para os novos líderes selecionados
  - Inativar `Carlos Souza`
  - Preservar no banco o flag de líder e as células de `Carlos Souza` (em estado oculto)
  - Exibir toast "Membro inativado com sucesso."
  - Remover `Carlos Souza` da listagem padrão

---

## Cenário 5: Inativação de líder sem membros vinculados

**Dado que** `Juliana Costa` é líder ativa sem membros vinculados

**Quando** o usuário clica em "Inativar" na linha de `Juliana Costa`

**Então** o sistema deve:
  - Exibir o modal de confirmação simples (sem redistribuição)
  - Ao confirmar, inativar `Juliana Costa` diretamente

---

## Cenário 6: Membro inativo some da listagem padrão mas preserva dados

**Dado que** `Ana Paula Ferreira` foi inativada com sucesso

**Quando** o usuário acessa a listagem de membros sem nenhum filtro aplicado

**Então** o sistema deve:
  - Não exibir `Ana Paula Ferreira` na listagem
  - Manter todos os dados de `Ana Paula Ferreira` no banco de dados
  - Permitir que `Ana Paula Ferreira` seja encontrada ao aplicar o filtro Status `Inativo`

---

# Permissões e Regras de Acesso

| Permissão | Descrição |
|-----------|-----------|
| `MEMBRO_INATIVAR` | Permite inativar membros ativos |

No MVP, o perfil **Administrador** possui esta permissão por padrão.

---

# Histórico de Alterações

| Data       | Card | Autor           | Descrição da Alteração        |
|------------|------|-----------------|-------------------------------|
| 29/04/2026 | —    | Thiago Oliveira | Criação inicial do requisito  |
| 30/04/2026 | —    | Thiago Oliveira | Redistribuição de ativos por célula específica; inativos mantêm vínculo histórico; suporte a múltiplas células por líder |
| 30/04/2026 | —    | Thiago Oliveira | Ciclo de vida do líder: flag e células preservados em estado oculto ao inativar (restaurados na reativação); estado de erro sem líderes disponíveis |
| 30/04/2026 | —    | Thiago Oliveira | Modal de redistribuição corrigido: seletor de "novo líder" (não nova célula); terminologia alinhada com vínculo membro→líder |

---

<div align="center">
  <sub><strong>🔒 Documento Confidencial</strong> • Uso Interno</sub>
</div>
