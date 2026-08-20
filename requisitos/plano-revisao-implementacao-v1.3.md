[Cadastro Membros](../README.md) > **Plano de Revisão — Especificação vs. Implementação (v1)**

---

# Plano de Revisão — Especificação vs. Implementação (v1)

**Versão:** 1.3 | **Última atualização:** 17/08/2026 | **Autor:** Thiago Oliveira (com apoio de IA)

**Status:** 🔴 Em construção — enquanto está sendo escrito com o PO. **Cada ponto marcado como fechado (✅/🔧/➕/❌ com decisão registrada) já é especificação válida para execução imediata** — não é backlog para priorização futura.

---

## Objetivo deste documento

⚠️ **Este documento é uma ordem de serviço, não um backlog.** O time construiu a plataforma (`gestao-wave.netlify.app`) a partir de uma conversa com IA, sem seguir formalmente os requisitos já documentados em [`requisitos/README.md`](./README.md) e em `requisitos/funcionais/`. Este documento audita o que foi **realmente construído** contra o que foi **especificado**, registra a decisão final do PO para cada divergência, e **será entregue diretamente ao time de desenvolvimento (e à IA de código deles) para implementação imediata** de tudo que aqui estiver marcado como decidido. Não há fase de priorização posterior — o que está fechado aqui é para ser feito agora.

Para cada fluxo/tela, marcamos a ação que o time de desenvolvimento deve executar:

| Ação | Significado para o desenvolvimento |
|---------|-------------|
| ✅ **Manter** | Nenhuma mudança de código necessária neste ponto |
| 🔧 **Ajustar** | Existe, mas diverge da especificação ou tem bug — corrigir/retrabalhar conforme a decisão registrada |
| ➕ **Inserir** | Construir do zero, conforme a decisão registrada |
| ❌ **Retirar** | Remover do código/produto — não deve continuar existindo na v1 |
| ❓ **Decidir** | Ainda em aberto — **não implementar até este documento ser atualizado com a decisão final** |

> Este arquivo referencia os requisitos detalhados em `requisitos/funcionais/` para contexto completo (campos, mensagens, cenários BDD), mas **as decisões registradas aqui têm precedência** sobre qualquer versão anterior desses arquivos quando houver conflito — elas refletem a última palavra do PO.

---

## Decisões de produto já confirmadas (nesta rodada)

Estas premissas foram confirmadas por você e já estão refletidas nas seções abaixo:

1. **Ponto focal é o Membro.** Toda tela relevante deve deixar claro: quem é o líder desse membro, se ele próprio é líder, e quem são seus liderados.
2. **Um membro pode ser líder de uma ou mais células.** Isso já estava especificado em `requisitos/README.md` (Módulo 3) e em `criar-membro.md`/`editar-membro.md` — mas **não é o que está implementado**. O app hoje trata cada líder como dono de exatamente uma célula (um bloco só de dia/horário/endereço).
3. **V1 = apenas Admin loga no sistema.** Membros e líderes de célula **não têm login nem acesso a nenhuma tela**. Isso já era a intenção original (`Perfis de Usuário` no EAP marca Líder e Membro como 🟣 Futuro) — mas a implementação real construiu um "modo Líder" completo (telas de Início, Chamada, Agenda, "Minha Célula"). Esse modo **sai do escopo v1** ([Ponto 14](#ponto-14--modo-líder-início-chamada-agenda-minha-célula-botão-painel-admin)).
4. **Módulos secundários** ainda serão definidos com você, um a um (seção final deste documento).

---

## Registro de Decisões — Pontos Divergentes

Percorremos os pontos divergentes um a um: especificado vs. implementado, minha opinião como PO, e a decisão final sua. Esta seção é o registro cronológico dessas decisões — as tabelas de módulo mais abaixo referenciam cada ponto.

### Ponto 1 — Líder pode liderar múltiplas células, com finalidade Evangelística ou Liderança

**📄 Especificado (antes desta rodada):** líder pode ter N células (bloco repetível no formulário), cada uma com dia/horário/tipos de público/endereço próprios.

**🖥️ Implementado:** cada líder só pode ter 1 célula (bloco fixo, sem "+ Adicionar outra célula").

**💬 Contexto de negócio trazido pelo PO:** existem duas finalidades de célula:
- **Evangelística** — célula aberta, para convidar pessoas a conhecer Jesus. Um líder precisa ter ao menos 1 para ser considerado líder, e pode ter mais de uma (dias/horários diferentes).
- **Liderança** — célula fechada, onde um líder forma seus liderados que também se tornaram líderes. Só é obrigatória quando o líder tem ao menos um liderado que também é líder.

**✅ Decisão final:**
1. Célula ganha um novo campo **Finalidade**: `Evangelística` | `Liderança` (além do tipo de público existente — Kids/Teens/Adolescente/Adulto). Célula de Liderança usa a mesma entidade/campos (dia, horário, endereço) — não é um cadastro à parte.
2. **Regra de validação obrigatória:** ao cadastrar/editar um membro marcando "É líder de célula = Sim" com "Discipulado por" = Líder X, o sistema verifica se o Líder X já possui ao menos 1 célula de Finalidade `Liderança`. Se não possuir, **bloqueia o salvamento** com a mensagem: *"Para que [Liderado] se torne líder, [Líder X] precisa ter uma célula de Liderança cadastrada. Cadastre-a antes de continuar."*
3. Uma única célula de Liderança atende **todos** os liderados-líder de um mesmo líder — não é uma célula de Liderança por liderado-líder.

**🖥️ Levantamento adicional (verificação completa e literal dos campos, feita ao vivo a pedido do PO, para garantir que nenhuma lacuna ficasse escondida):**

O bloco "👑 Dados da Célula" no cadastro de membro (Novo Membro → "É Líder de Célula = Sim") contém **apenas 3 campos**: Dia do Encontro, Horário, Líder Responsável. O texto do próprio formulário assume literalmente que a célula é **"em sua residência"** — não há nenhuma opção de endereço diferente na criação. O formulário de edição de célula ("Editar Líder") tem Rua/Número/Bairro/Cidade da célula (sem Complemento), mas sem toggle de "mesmo endereço/outro endereço" nem campo de Faixa Etária.

**Lacunas confirmadas (nada além destas nos dois formulários):**

| Campo | Criar (Novo Membro→Sim) | Editar (Editar Líder) |
|---|---|---|
| Faixa Etária (Kids/Teens/Adolescente/Jovem Adulto/Adulto — [Termo 1](#termo-1--grupo-kidsteensmovementripefamília)) | ❌ Ausente | ❌ Ausente |
| Finalidade (Evangelística/Liderança) | ❌ Ausente | ❌ Ausente |
| Endereço da célula (Rua/Nº/Bairro/Cidade/Complemento) | ❌ Totalmente ausente | ⚠️ Parcial (sem Complemento) |
| Toggle "Usar meu endereço residencial" / "Outro endereço" | ❌ Ausente | ❌ Ausente |
| "+ Adicionar outra célula" | ❌ Ausente | ➖ Não se aplica |

4. **➕ Inserir:** opção **"Usar meu endereço residencial"** (padrão, pré-selecionada) ou **"Outro endereço"** ao definir uma célula (criação e edição). Se "Outro endereço" for selecionado, habilita os campos Rua, Número, Bairro, Cidade, Complemento para preenchimento manual — cobre o cenário de uma célula realizada fora da casa do líder (ex: quadra de futebol de outro bairro). **Sem campo de "ponto de referência/local"** — apenas os campos de endereço padrão.
5. **➕ Inserir:** campo de Faixa Etária (Termo 1) e Finalidade (item 1 acima) em ambos os formulários (criar e editar).
6. Reescrever o texto do formulário, removendo a suposição fixa de "em sua residência".
7. **Regra adicional (esclarecida após revisão de QA):** a **Finalidade** de uma célula (Evangelística ou Liderança) é definida **apenas na criação** e **não pode ser alterada depois** pela tela de Editar Célula — o campo aparece lá somente como leitura/contexto, não editável. Para mudar a finalidade de um encontro, a célula atual deve ser fechada ([Ponto 20](#ponto-20--fechar-uma-célula-individual-sem-inativar-o-líder)) e uma nova criada com a finalidade correta.

**Impacto em outros pontos deste documento:** afeta diretamente o formulário de Criar/Editar Membro (`membros/criar-membro.md`, `membros/editar-membro.md`), o formulário "Editar Líder"/Editar Célula (`celulas/editar-celula.md`), a Listagem de Células (`celulas/listar-celulas.md` — nova coluna/filtro de Finalidade e Faixa Etária) e a Importação CSV (`importacao/importacao-csv.md` — novas colunas no template).

---

### Ponto 2 — Sessão não persiste (reload desloga o usuário)

**📄 Especificado (`autenticacao-usuario.md`):** checkbox "Lembrar de mim" mantém a sessão ativa por 7 dias; sem marcar, a sessão dura até o navegador fechar. Em ambos os casos, um reload de página não deveria derrubar a sessão.

**🖥️ Implementado:** não existe checkbox "Lembrar de mim". Qualquer atualização (F5) da página desloga o usuário imediatamente, mesmo minutos depois do login.

**✅ Decisão final:** ➕ **Inserir, prioridade máxima.** Implementar persistência de sessão (token/cookie de sessão sobrevivendo a reload da página) como pré-requisito de qualquer outra entrega — sem isso, nenhuma outra funcionalidade é utilizável na prática. Manter o requisito original: checkbox "Lembrar de mim" estende a sessão para 7 dias; sem marcar, a sessão dura até o navegador fechar (mas sempre sobrevive a um simples reload/F5, que é o comportamento quebrado hoje).

---

### Ponto 3 — Recuperação de senha ausente

**📄 Especificado (`recuperacao-senha.md`):** fluxo completo via e-mail — link com validade de 1h, redefinição, autenticação automática.

**🖥️ Implementado:** não existe. O único mecanismo de reset é o admin definir manualmente uma "senha inicial" para outro usuário na tela de Permissões/Acessos.

**✅ Decisão final:** ❌ **Retirar do escopo v1.** Não implementar fluxo de recuperação de senha por e-mail nesta versão. O reset manual pelo admin (já existente na tela de Permissões/Acessos) é suficiente para o volume e o perfil de usuários do v1 (equipe pequena, admins com contato direto entre si). Revisitar esta decisão caso o v2 introduza múltiplos admins sem relação direta ou login de líder/membro.

**Ação para o requisito original:** marcar `autenticacao/recuperacao-senha.md` como **fora do escopo v1** — não implementar nenhum item desse arquivo por enquanto.

---

### Ponto 4 — Ciclo de vida do membro ausente (Inativar / Reativar)

**📄 Especificado (`inativar-membro.md`, `reativar-membro.md`):** ação "Inativar" para membros ativos, com modal de redistribuição obrigatório se o membro for líder com liderados ativos; ação "Reativar" para membros inativos, com tentativa de restauração automática do vínculo se o líder anterior ainda for válido.

**🖥️ Implementado (corrigido após teste ao vivo — a avaliação inicial estava errada):**
- A ação "Inativar/Reativar" **existe** na listagem (a auditoria inicial só olhou os ícones e presumiu erroneamente que não existia).
- O **modal de redistribuição de discípulos já funciona**: testado ao vivo, tentar inativar um líder com liderados ativos abre o modal "👑 Redistribuição de Discípulos", bloqueia a ação e exige selecionar um novo líder antes de confirmar "Reatribuir & Inativar".
- **Gap real confirmado:** inativar um membro **sem** liderados dispara a inativação **imediatamente, sem nenhum modal de confirmação** (um clique só). Reativar também **não exibe nenhum modal** — nem confirmação, nem pergunta sobre restaurar o status de líder, nem seleção de novo líder responsável.
- Confirmado que é soft-delete real (membro fica com status "Inativo", dado preservado, reaparece com filtro "Todos os Registros").

**✅ Decisão final (regra de negócio consolidada com o PO):**

1. Um membro que sai da igreja pode ser **inativado**.
2. Se o membro inativado é **líder**, todos os seus liderados — comuns **e os que também são líderes** (formados na célula de Liderança dele) — precisam ser **redistribuídos para outro líder/mentor antes** da inativação se concretizar. **Isso já funciona** — apenas confirmar que a redistribuição cobre também liderados-líder (célula de Liderança), não só liderados comuns.
3. Ao ser efetivamente inativado, **todas as células do líder são fechadas** (não ficam em estado oculto preservado — são encerradas de fato).
4. **➕ Inserir:** modal de confirmação simples para inativar membro sem liderados (hoje inexistente — ação dispara direto no clique).
5. Na **reativação**, o sistema **sempre pergunta explicitamente**: *"Este membro era líder antes de ser inativado. Reativar também como líder de célula?"* (hoje inexistente — reativação também dispara direto no clique, sem nenhuma pergunta).
   - Se **sim**: ele precisa ter (ou cadastrar no mesmo fluxo) ao menos 1 célula Evangelística nova, conforme regra do [Ponto 1](#ponto-1--líder-pode-liderar-múltiplas-células-com-finalidade-evangelística-ou-liderança). Não há restauração automática das células antigas — são recriadas do zero.
   - Se **não**: o membro reativa como membro comum.
6. **➕ Inserir:** em qualquer caso de reativação, o sistema deve exigir a **seleção de um líder responsável** para o membro reativado — pode ser o mesmo líder de antes da inativação ou um novo. **Não há tentativa de restauração automática** do vínculo anterior — a escolha é sempre manual. Hoje a reativação não pede nada disso.

**Ação para o requisito original:** `inativar-membro.md` e `reativar-membro.md` precisam ser reescritos com esta regra consolidada. A redistribuição de líder com liderados já está construída e deve ser mantida/estendida (cobrir liderados-líder); os pontos 4-6 acima são os gaps reais a implementar.

---

### Ponto 5 — Modal de confirmação ao trocar o líder de um membro

**📄 Especificado (`editar-membro.md`):** ao alterar o campo "Líder (discipulado por)" de um membro **ativo**, o sistema exige confirmação via modal antes de efetivar a troca. Para membros inativos, a troca é salva direto, sem modal.

**🖥️ Implementado:** não há indício desse modal na interface — a edição parece salvar direto.

**✅ Decisão final:** ➕ **Inserir**, mantendo a regra original: confirmação obrigatória ao trocar líder de membro **ativo** (mensagem: *"Você está transferindo [Nome] do líder [Atual] para o líder [Novo]. Confirmar transferência?"*); sem modal para membros inativos.

---

### Ponto 6 — Campos calculados na Visualização de Membro

**📄 Especificado (`visualizar-membro.md`):** cards em destaque com **idade atual**, **"membro há X anos/meses"** e, se for líder, **"X membros liderados (em N células)"**.

**🖥️ Implementado:** ficha básica — nome, contato, endereço, líder. Nenhum dos três campos calculados presente.

**✅ Decisão final:** ➕ **Inserir os três campos calculados**, mantendo a especificação original. Com a mudança do [Ponto 1](#ponto-1--líder-pode-liderar-múltiplas-células-com-finalidade-evangelística-ou-liderança), o "(em N células)" deve contar apenas células de finalidade Evangelística (a de Liderança não conta membro vinculado da mesma forma).

---

### Ponto 7 — Filtros e paginação da Listagem de Membros

**📄 Especificado (`listar-membros.md`):** paginação 10/50/100 (padrão 50); ordenação clicável por coluna; filtro dinâmico incluindo Dia da célula e Horário da célula.

**🖥️ Implementado:** sem paginação nem ordenação por coluna. Filtros existentes: Status, Função, Grupo, Gênero, Bairro, Cidade — sem Dia/Horário da célula.

**✅ Decisão final:** ➕ **Inserir** paginação (10/50/100, padrão 50), ordenação por coluna e os filtros de Dia/Horário da célula. Com o [Ponto 1](#ponto-1--líder-pode-liderar-múltiplas-células-com-finalidade-evangelística-ou-liderança), o filtro de Dia/Horário deve considerar apenas células de finalidade **Evangelística** (são as que recebem novos membros — célula de Liderança não é destino de alocação).

---

### Ponto 8 — Alerta de duplicata ao cadastrar membro

**📄 Especificado (`criar-membro.md`):** antes de salvar, verifica duplicata por **nome completo + data de nascimento**. Se encontrada, exibe alerta não-bloqueante ("Deseja continuar mesmo assim?") — não impede o cadastro automaticamente.

**🖥️ Implementado:** não encontrado na interface.

**✅ Decisão final:** ➕ **Inserir**, mantendo o comportamento não-bloqueante (alerta, não impedimento) e o critério nome completo + data de nascimento.

---

### Ponto 9 — Bug: botão "Novo Líder" abre o formulário errado

**📄 Especificado:** não há requisito separado para "Novo Líder" — virar líder é feito pelo formulário de Membro, marcando "É líder de célula = Sim".

**🖥️ Implementado:** o botão "Novo Líder" (em Células) redireciona para Membros e abre o modal genérico "Novo Cadastro de Membro" **sem** marcar "É líder de célula" — risco real de cadastro incompleto por engano.

**✅ Decisão final:**
1. ❌ **Remover o botão "Novo Líder"** da tela de Células por completo.
2. Virar líder passa a ser **exclusivamente** consequência de editar um membro já existente e marcar "É líder de célula = Sim" — o que obriga o preenchimento da(s) célula(s), conforme regra do [Ponto 1](#ponto-1--líder-pode-liderar-múltiplas-células-com-finalidade-evangelística-ou-liderança).
3. **Desejável (não bloqueante):** no mesmo fluxo de marcar "É líder de célula", oferecer a opção de selecionar membros já existentes para virarem discípulos dele imediatamente (atribuição em lote). Se não viabilizar no v1, o caminho alternativo — editar cada membro individualmente e trocar o líder — já cobre a necessidade, então isso não deve bloquear a entrega do restante.

---

### Ponto 10 — Bug: discípulo duplicado na ficha da célula

**📄 Especificado (`visualizar-celula.md`):** lista de membros ativos discipulados pelo líder, cada um aparecendo uma única vez.

**🖥️ Implementado:** o mesmo discípulo apareceu duas vezes na ficha de uma célula — uma linha "Ativo", outra "Inativo".

**✅ Decisão final:** 🔧 **Ajustar** — correção técnica direta (consulta/JOIN duplicado ou dado de teste malformado), sem necessidade de nova regra de produto. A lista deve exibir cada discípulo **ativo** uma única vez; membros inativos não devem aparecer nessa lista (consistente com o [Ponto 4](#ponto-4--ciclo-de-vida-do-membro-ausente-inativar--reativar)).

---

### Ponto 11 — Dashboard: contadores errados no carregamento + recursos clicáveis

**📄 Especificado (`dashboard.md`):** cards sempre em tempo real; card "Total de Células Ativas" clicável → listagem de células; card "Aniversariantes do Mês" clicável → lista com botão "Enviar parabéns" via WhatsApp (mensagem pré-formatada).

**🖥️ Implementado (testado ao vivo — corrigido após reteste):**
- Bug de contador confirmado (reproduzido de novo em Permissões: "Total de Usuários: 1" no primeiro carregamento).
- ✅ Card **"Total de Células Ativas" já é clicável e funciona** — testado ao vivo, navega corretamente para a listagem de células.
- ❌ Card **"Aniversariantes do Mês" não reage a nenhum clique** — confirmado ao vivo, sem modal, sem lista, sem WhatsApp.

**✅ Decisão final:**
- 🔧 **Ajustar** o bug de carregamento — os cards devem exibir o valor correto desde o primeiro render (corrigir ordem de cálculo/carregamento dos dados).
- ✅ **Manter** o card "Total de Células Ativas" — já funciona conforme especificado, nenhuma mudança necessária.
- ➕ **Inserir** o comportamento completo do card "Aniversariantes do Mês", conforme especificação original — **sem ambiguidade de escopo:**
  1. Ao clicar no card, abre um **modal** (popup — não uma página própria/nova URL) com **todos os aniversariantes do mês corrente**, ordenada pelo dia do aniversário. Mesmo padrão visual já usado em "Ficha do Membro" e "Ficha da Célula", para manter consistência.
  2. Cada **linha da lista** exibe: nome do membro e data do aniversário (DD/MM).
  3. Cada **linha tem seu próprio botão** "Enviar Parabéns" — não é um botão único para o card inteiro. Ao clicar, abre o WhatsApp com o número daquele membro específico e a mensagem de aniversário pré-formatada já preenchida.

---

### Ponto 12 — Importação CSV: estrutura não suporta o novo modelo de células

**📄 Especificado (`importacao-csv.md`):** template com colunas incluindo Dia/Horário/Tipos da célula, suportando múltiplas linhas por líder (uma por célula).

**🖥️ Implementado:** provável limitação a 1 célula por líder (mesma restrição do cadastro manual); sem coluna de Finalidade (Evangelística/Liderança).

**💬 Contexto de negócio trazido pelo PO:** na realidade da igreja, existe **1 entrada em massa de líderes por ano** (onboarding/reposição de base); ao longo do ano, novas células são abertas **incrementalmente** para líderes que já existem no sistema.

**✅ Decisão final:**
1. 🔧 **Ajustar** o template e a lógica de importação para refletir o modelo de N células por líder + coluna de **Finalidade** (Evangelística/Liderança), com a mesma validação do [Ponto 1](#ponto-1--líder-pode-liderar-múltiplas-células-com-finalidade-evangelística-ou-liderança) (todo líder precisa de ao menos 1 célula Evangelística).
2. **Escopo explicitamente limitado:** a Importação CSV serve **apenas** para carga inicial/anual em massa. **Não precisa** suportar adicionar uma célula a um líder que já existe no sistema via reimportação — esse crescimento incremental ao longo do ano é sempre feito pelo fluxo manual de Editar Membro + "Adicionar outra célula" ([Ponto 1](#ponto-1--líder-pode-liderar-múltiplas-células-com-finalidade-evangelística-ou-liderança)). Não construir lógica de merge/atualização incremental via CSV — evita esforço em um caso de uso que não existe na prática.

---

### Ponto 13 — Administração: 4 perfis de acesso oferecidos vs. MVP com só Administrador

**📄 Especificado (`gerenciar-usuarios.md`, EAP):** MVP com apenas o perfil **Administrador**; Pastor/Pastora, Secretaria e Líder de Célula são perfis futuros, sem permissões diferenciadas definidas.

**🖥️ Implementado:** a tela de criação de usuário já oferece os 4 perfis para seleção, mas nenhuma diferença de comportamento real existe entre eles — nenhum controle de permissão aplicado por perfil.

**✅ Decisão final:** 🔧 **Ajustar** — manter **apenas "Administrador"** como opção selecionável no formulário de criação de usuário. Remover Pastor/Pastora, Secretaria e Líder de Célula da lista até que exista implementação real de permissões diferenciadas por perfil (fora do escopo v1, conforme premissa já confirmada de que só Admin loga no sistema).

---

### Ponto 14 — "Modo Líder" (Início, Chamada, Agenda, "Minha Célula", botão "Painel Admin")

**📄 Especificado:** nenhum requisito documenta esse modo. O EAP marca "Líder de célula" e "Membro" como perfis futuros, sem login previsto no v1.

**🖥️ Implementado:** modo completo de login/navegação para líderes (telas "Início", "Chamada", "Agenda", link "Minha Célula", botão "Painel Admin") — **quebrado**: todo ponto de entrada dispara `TypeError: WaveData.getCelulasByLider is not a function`, travando a aplicação até reload.

**✅ Decisão final:** ❌ **Retirar por completo.** Remover as telas ("Início", "Chamada", "Agenda"), o link "Minha Célula", o botão de alternância "Painel Admin" e toda a lógica/rota associada, incluindo a função quebrada `getCelulasByLider`. Esta funcionalidade contradiz a decisão confirmada de que apenas Admin loga no v1. Caso login de líder seja decidido no futuro (v2), deve nascer como especificação nova — não reaproveitar este código.

---

### Ponto 15 — Administração: Editar / Inativar / Reativar usuário

**📄 Especificado (`gerenciar-usuarios.md`):** "Editar" altera nome/e-mail; "Inativar" bloqueia com confirmação e **encerra todas as sessões ativas do usuário no servidor**; admin **não pode se auto-inativar** (backend rejeita com HTTP 403); "Reativar" restaura o acesso.

**🖥️ Implementado (testado ao vivo nesta auditoria):**
- Bloquear/Liberar Acesso (inativar/reativar) **funcionam** corretamente, alternando o status.
- "Alterar Cargo" é um **botão morto** — não abre nada, não muda nada. Não existe edição de nome/e-mail/cargo de usuário já criado.
- 🚨 **Bug crítico de segurança confirmado ao vivo:** foi possível bloquear o próprio usuário admin logado, sem nenhum aviso ou impedimento.
- O desbloqueio imediato em seguida funcionou, o que indica que bloquear **não encerra a sessão ativa** no servidor.
- Cards de contagem no topo não atualizam após a ação (mesma causa raiz do [Ponto 11](#ponto-11--dashboard-contadores-errados-no-carregamento--recursos-clicáveis)).

**✅ Decisão final:**
1. ➕ **Inserir** a regra de bloqueio de auto-inativação: impedir na interface e rejeitar no backend (HTTP 403) qualquer tentativa do admin logado de bloquear a si mesmo. **Prioridade alta** — combinado com a remoção de recuperação de senha por e-mail ([Ponto 3](#ponto-3--recuperação-de-senha-ausente)), se o único admin se bloquear por engano, ninguém mais acessa o sistema.
2. ➕ **Inserir** o encerramento de sessões ativas do usuário no momento em que ele é bloqueado.
3. ➕ **Inserir** a edição de usuário (nome/e-mail) — hoje o botão "Alterar Cargo" existe mas não executa nenhuma ação.
4. 🔧 **Ajustar** o bug de contador — mesma correção do [Ponto 11](#ponto-11--dashboard-contadores-errados-no-carregamento--recursos-clicáveis).

---

### Ponto 16 — Vínculo líder-liderado sem validação de mesmo sexo

**📄 Especificado (`escopo_projeto`, seção 5):** parâmetro de célula por gênero (masculina/feminina/mista) previsto no modelo de dados desde o início, mas **documentado como sem validação ativa no MVP** — decisão original era adiar.

**🖥️ Implementado (testado ao vivo):** confirmado que não há validação nenhuma — vinculei ao vivo uma membro do sexo Feminino (Ana Luiza) a um líder do sexo Masculino (Lucas Bomfonti) sem qualquer aviso ou impedimento do sistema.

**✅ Decisão final:** ➕ **Inserir agora** (revertendo a decisão original de adiar) — **ativar a validação de mesmo sexo entre líder e liderado**. Ao vincular um membro a um líder (no cadastro, edição ou reativação), o sistema **bloqueia por completo** o salvamento se o gênero do membro divergir do gênero do líder — **não é um alerta contornável, é impedimento total** (diferente do alerta de duplicata do Ponto 8, que é contornável). O seletor de "Líder Responsável" deve, idealmente, já **filtrar** para mostrar apenas líderes do mesmo sexo do membro sendo cadastrado/editado, evitando que o usuário selecione uma opção inválida e só descubra o bloqueio ao salvar.

**Ação para o requisito original:** `criar-membro.md`, `editar-membro.md` e `reativar-membro.md` precisam incorporar esta validação no seletor de "Líder Responsável" — filtrando (preferencial) ou bloqueando no salvamento líderes de gênero diferente do membro sendo vinculado. Esta mesma regra (só líderes do mesmo sexo) também se aplica ao seletor de "novo líder" no modal de redistribuição de discípulos ([Ponto 4](#ponto-4--ciclo-de-vida-do-membro-ausente-inativar--reativar)) e ao seletor de líder na reativação de membro — em ambos os casos, o seletor deve mostrar apenas líderes **ativos e do mesmo sexo**.

---

### Ponto 17 — Relatórios e Exportação de Listagem consolidados em "exportar com filtro"

**📄 Especificado (EAP, seção "Módulos do Sistema"):** dois itens separados, ambos P2/Futuro — "Relatório de Células" (visão consolidada por célula) e "Relatório de Aniversariantes" (membros com aniversário no mês/período); e um terceiro item, também P2, "Exportação de Listagem" em PDF e Excel.

**🖥️ Implementado:** a listagem de Membros já tem um botão "Exportar CSV" (visto na auditoria). A listagem de Células não tem nenhum botão de exportação. Nenhuma das duas telas de relatório dedicadas existe.

**💬 Contexto trazido pelo PO:** em vez de construir telas de relatório fixas, usar os filtros dinâmicos que já existem (ou estão sendo inseridos, [Ponto 7](#ponto-7--filtros-e-paginação-da-listagem-de-membros)) em cada listagem, combinados com exportação — o usuário filtra a listagem para o recorte que quiser (ex: aniversariantes do mês, membros de uma célula) e exporta dali. Isso funciona como um "relatório dinâmico", sem precisar de telas dedicadas.

**✅ Decisão final:**
1. **Substitui** as necessidades de "Relatório de Células" e "Relatório de Aniversariantes" — não serão construídas como telas separadas. A necessidade é resolvida por: filtro dinâmico na listagem (Membros e Células) + exportação do resultado filtrado.
2. ➕ **Inserir** exportação em **CSV e PDF** (respeitando os filtros ativos no momento da exportação) em **toda tela de listagem com filtro dinâmico** — Membros (confirmar que o botão existente já respeita os filtros ativos, ajustando se não respeitar) e Células (não existe, precisa ser inserido do zero).
3. **Excel fica fora do v1** — adiado para o futuro, conforme decisão do PO.

**Ação para o requisito original:** os itens "Relatório de Células", "Relatório de Aniversariantes" e "Exportação de Listagem" do EAP (`requisitos/README.md`) devem ser substituídos por um único requisito: "Exportar Listagem com Filtro Aplicado (CSV e PDF)", aplicável a Membros e Células.

---

### Ponto 18 — Retirar o gráfico "Ingressos de Membros por Mês" do Dashboard

**📄 Especificado (`dashboard.md`):** gráfico de linha/área mostrando evolução acumulada de membros ativos, com seletores de período (Anual/Semestral/Trimestral/Personalizado) e tooltip com ingressos/inativações do mês.

**🖥️ Implementado:** gráfico "Ingressos por Mês" presente no Dashboard, com seletores "Ano Atual / 6 Meses / 3 Meses" e barras mensais.

**✅ Decisão final:** ❌ **Retirar completamente** o gráfico "Ingressos de Membros por Mês" do Dashboard — remover o componente do gráfico, os seletores de período associados a ele, e qualquer lógica de cálculo por trás.

**Ação para o requisito original:** remover a seção "Gráfico de Crescimento de Membros" de `dashboard/dashboard.md` — deixa de fazer parte do escopo v1.

---

### Ponto 19 — Seleção dinâmica de colunas em todas as telas de listagem

**📄 Especificado:** nenhum requisito documenta isso — funcionalidade nova trazida pelo PO.

**🖥️ Implementado:** nenhuma listagem (Membros, Células, Usuários) permite ocultar/exibir colunas — todas as colunas definidas aparecem sempre.

**💬 Contexto trazido pelo PO:** todas as telas com listagem devem ter um componente onde o usuário escolhe quais colunas quer ver.

**✅ Decisão final:** ➕ **Inserir** um controle de "Colunas" (ex: botão com dropdown de checkboxes, um por coluna disponível) em **toda tela de listagem** — Membros, Células e Usuários (Permissões/Acessos). O usuário marca/desmarca quais colunas aparecem na tabela.

- A coluna **"Ações"** (ícones de editar/inativar/etc.) nunca pode ser ocultada — sempre visível.
- Todas as demais colunas de cada listagem começam **visíveis por padrão**; o usuário pode ocultar as que não quiser ver.
- **A preferência de colunas é lembrada** — persiste por **usuário** (vinculada à conta, não ao navegador/dispositivo — se o mesmo usuário logar em outro computador, a preferência continua valendo).

**Ação para o requisito original:** adicionar esta funcionalidade como requisito transversal em `membros/listar-membros.md`, `celulas/listar-celulas.md` e `administracao/gerenciar-usuarios.md`.

---

### Ponto 20 — Fechar uma célula individual sem inativar o líder

**📄 Especificado:** nenhum requisito documenta isso — lacuna identificada durante revisão de QA sobre o Ponto 1.

**🖥️ Implementado:** não existe — a única forma de "remover" uma célula hoje é inativar o líder inteiro, o que fecha **todas** as células dele ([Ponto 4](#ponto-4--ciclo-de-vida-do-membro-ausente-inativar--reativar)).

**💬 Contexto:** com o Ponto 1 permitindo múltiplas células por líder, surge um cenário legítimo: um líder para de fazer a célula de terça, mas continua com a de quinta. Inativar o líder inteiro para fechar 1 célula específica destruiria a célula que continua ativa.

**✅ Decisão final:** ➕ **Inserir** uma ação de **"Fechar Célula"** na ficha/edição de uma célula individual — independente de inativar o líder. Ao fechar uma célula específica:
1. Se a célula fechada for do tipo **Evangelística** e tiver discípulos vinculados, o sistema exige a mesma redistribuição já usada na inativação de líder (não é possível fechar deixando discípulos "no ar").
2. Se for a célula de **Liderança** e o líder tiver discípulos-líder formados nela, mesma regra: redistribuir para outro mentor antes.
3. Se for a **última célula Evangelística** do líder, o sistema **bloqueia** o fechamento com aviso ("Todo líder precisa de ao menos 1 célula Evangelística — inative o próprio líder em vez de fechar esta célula, se for o caso").

**Ação para o requisito original:** adicionar esta ação em `celulas/editar-celula.md` como novo fluxo "Fechar Célula".

---

## 1. Autenticação

| Requisito | Arquivo | Especificado | Implementado | Decisão |
|---|---|---|---|---|
| Login/Logout | [`autenticacao/autenticacao-usuario.md`](./funcionais/autenticacao/autenticacao-usuario.md) | Sessão persistente (7 dias c/ "lembrar de mim", ou até fechar navegador); mensagem genérica de erro; sem bloqueio por tentativas | Login funciona, mas **sessão não persiste** — qualquer reload desloga o usuário. Sem checkbox "Lembrar de mim" | ➕ **Inserir, prioridade máxima** — decisão fechada em [Ponto 2](#ponto-2--sessão-não-persiste-reload-desloga-o-usuário) |
| Recuperação de Senha | [`autenticacao/recuperacao-senha.md`](./funcionais/autenticacao/recuperacao-senha.md) | Fluxo completo via e-mail, link de 1h de validade | Não existe nenhum link "Esqueci minha senha" na tela de login | ❌ **Retirar do v1** — decisão fechada em [Ponto 3](#ponto-3--recuperação-de-senha-ausente) |

---

## 2. Membros

| Requisito | Arquivo | Especificado | Implementado | Decisão |
|---|---|---|---|---|
| Criar Membro | [`membros/criar-membro.md`](./funcionais/membros/criar-membro.md) | Vínculo membro→líder; líder pode cadastrar **múltiplas células** no mesmo formulário (bloco repetível); tipos de célula multi-select (Kids/Teens/Adolescente/Adulto); alerta de duplicata (nome+nascimento) | Formulário existe, mas **só permite 1 célula por líder** (sem "+ Adicionar outra célula"); Grupo é single-select com valores diferentes (Kids/Teens/Movement/Ripe/Família); sem alerta de duplicata visível | 🔧 **Ajustar** — decisão fechada em [Ponto 1](#ponto-1--líder-pode-liderar-múltiplas-células-com-finalidade-evangelística-ou-liderança): adicionar campo Finalidade (Evangelística/Liderança) + validação de célula de Liderança obrigatória; alerta de duplicata decidido em [Ponto 8](#ponto-8--alerta-de-duplicata-ao-cadastrar-membro); campo "Grupo" removido do membro, ver [Termo 1](#termo-1--grupo-kidsteensmovementripefamília) |
| Listar Membros | [`membros/listar-membros.md`](./funcionais/membros/listar-membros.md) | Paginação 10/50/100; filtro por Dia/Horário da célula; ordenação por coluna | Lista simples, sem paginação nem ordenação por coluna visível; filtros não incluem Dia/Horário da célula | ➕ **Inserir** — decisão fechada em [Ponto 7](#ponto-7--filtros-e-paginação-da-listagem-de-membros) |
| Visualizar Membro | [`membros/visualizar-membro.md`](./funcionais/membros/visualizar-membro.md) | Cards calculados: idade atual, "membro há X", "X membros liderados (em N células)"; bloco por célula se for líder | Ficha existe mas é básica — não vi os campos calculados nem o detalhamento de células do líder na visualização de membro (testado via célula, não via membro diretamente) | ➕ **Inserir** — decisão fechada em [Ponto 6](#ponto-6--campos-calculados-na-visualização-de-membro); bloco de células deve exibir Finalidade (Evangelística/Liderança) por bloco, conforme [Ponto 1](#ponto-1--líder-pode-liderar-múltiplas-células-com-finalidade-evangelística-ou-liderança) |
| Editar Membro | [`membros/editar-membro.md`](./funcionais/membros/editar-membro.md) | Modal de confirmação ao trocar líder; **modal de redistribuição obrigatório** ao remover flag de líder com membros ativos vinculados | Não testamos edição a fundo, mas não há indício de modais de redistribuição na interface | ➕ **Inserir** — modal de troca de líder decidido em [Ponto 5](#ponto-5--modal-de-confirmação-ao-trocar-o-líder-de-um-membro); redistribuição segue a mesma regra do [Ponto 4](#ponto-4--ciclo-de-vida-do-membro-ausente-inativar--reativar) quando o flag de líder é removido |
| Inativar Membro | [`membros/inativar-membro.md`](./funcionais/membros/inativar-membro.md) | Ação "Inativar" com modal simples (ou redistribuição se for líder) | Ação existe; redistribuição de líder com liderados **já funciona** (testado ao vivo); falta modal de confirmação simples para membro sem liderados (dispara direto) | 🔧 **Ajustar** — decisão fechada em [Ponto 4](#ponto-4--ciclo-de-vida-do-membro-ausente-inativar--reativar): inserir modal de confirmação simples; estender redistribuição para cobrir liderados-líder; fechar células ao inativar |
| Reativar Membro | [`membros/reativar-membro.md`](./funcionais/membros/reativar-membro.md) | Ação "Reativar", com tratamento de líder inválido | Ação existe mas dispara **sem nenhum modal** — não confirma, não pergunta sobre status de líder, não pede seleção de novo líder responsável | 🔧 **Ajustar** — decisão fechada em [Ponto 4](#ponto-4--ciclo-de-vida-do-membro-ausente-inativar--reativar): inserir pergunta "reativar como líder?" + seleção obrigatória de líder responsável, sempre manual |

**Achado do bug de duplicidade:** na ficha da célula, o mesmo discípulo apareceu duas vezes (um "Ativo", um "Inativo") — mesmo sem existir fluxo de inativação na UI, há dado inconsistente no banco. Isso reforça que falta o ciclo de vida completo (inativar/reativar) e sugere dados de teste/seed malformados.

---

## 3. Células

| Requisito | Arquivo | Especificado | Implementado | Decisão |
|---|---|---|---|---|
| Listar Células | [`celulas/listar-celulas.md`](./funcionais/celulas/listar-celulas.md) | Uma linha por célula (líder com N células aparece em N linhas); coluna "Membros ativos"; filtros por Dia/Horário/Tipo | Uma linha por líder (não por célula); sem filtro de dia/horário/tipo | 🔧 **Ajustar** — decorrência do [Ponto 1](#ponto-1--líder-pode-liderar-múltiplas-células-com-finalidade-evangelística-ou-liderança); listagem também precisa de coluna/filtro de **Finalidade** (Evangelística/Liderança) e de **Faixa Etária** (Kids/Teens/Adolescente/Jovem Adulto/Adulto, ver [Termo 1](#termo-1--grupo-kidsteensmovementripefamília)) no lugar de "Tipo" |
| Visualizar Célula | [`celulas/visualizar-celula.md`](./funcionais/celulas/visualizar-celula.md) | Lista de membros ativos discipulados pelo líder; total no topo | Existe, mas com bug de discípulo duplicado | 🔧 **Ajustar** — decisão fechada em [Ponto 10](#ponto-10--bug-discípulo-duplicado-na-ficha-da-célula) |
| Editar Célula | [`celulas/editar-celula.md`](./funcionais/celulas/editar-celula.md) | Edita apenas dados operacionais (dia/horário/tipo/endereço); líder não é editável aqui | Não testamos a fundo | 🔧 **Ajustar** — adaptar para o modelo de N células por líder ([Ponto 1](#ponto-1--líder-pode-liderar-múltiplas-células-com-finalidade-evangelística-ou-liderança)) |
| Botão "Novo Líder" | — (sem requisito próprio) | N/A | Redireciona para Membros e abre o modal genérico "Novo Cadastro de Membro", sem marcar "É líder de célula" | ❌ **Retirar** — decisão fechada em [Ponto 9](#ponto-9--bug-botão-novo-líder-abre-o-formulário-errado): virar líder passa a ser exclusivamente via edição de Membro |

---

## 4. Dashboard

| Requisito | Arquivo | Especificado | Implementado | Decisão |
|---|---|---|---|---|
| Dashboard Geral | [`dashboard/dashboard.md`](./funcionais/dashboard/dashboard.md) | Card de aniversariantes clicável → lista + botão "Enviar parabéns" via WhatsApp; card de células clicável → navega para listagem; tooltip no gráfico com +ingressos/−inativações | Testado ao vivo: card de células **funciona** (navega corretamente); card de aniversariantes **não reage a clique**; contadores com valor errado no primeiro carregamento (bug reproduzido 2x) | 🔧 **Ajustar** / ➕ **Inserir** — decisão fechada em [Ponto 11](#ponto-11--dashboard-contadores-errados-no-carregamento--recursos-clicáveis); gráfico de crescimento **retirado**, ver [Ponto 18](#ponto-18--retirar-o-gráfico-ingressos-de-membros-por-mês-do-dashboard) |

---

## 5. Importação CSV

| Requisito | Arquivo | Especificado | Implementado | Decisão |
|---|---|---|---|---|
| Importação CSV | [`importacao/importacao-csv.md`](./funcionais/importacao/importacao-csv.md) | Template com linhas `EXEMPLO`; prévia linha a linha com erros específicos; duas passagens (líderes primeiro); resumo pós-importação | Tela existe (download de modelo, upload, instruções), mas não testamos o processamento real de um arquivo — a estrutura de colunas provavelmente não suporta múltiplas células por líder (mesmo problema do cadastro manual) | 🔧 **Ajustar** — decisão fechada em [Ponto 12](#ponto-12--importação-csv-estrutura-não-suporta-o-novo-modelo-de-células); escopo limitado à carga inicial/anual em massa |

---

## 6. Administração (Usuários do sistema)

| Requisito | Arquivo | Especificado | Implementado | Decisão |
|---|---|---|---|---|
| Gerenciar Usuários | [`administracao/gerenciar-usuarios.md`](./funcionais/administracao/gerenciar-usuarios.md) | MVP com **apenas perfil Administrador**; sem paginação (até 20 usuários); admin não pode se auto-inativar | Tela ("Permissões"/"Acessos") já **oferece 4 perfis para seleção** (Administrador, Pastor/Pastora, Secretaria, Líder de Célula) — mais do que o MVP prevê; contador de usuários com bug de carregamento já registrado | 🔧 **Ajustar** — decisão fechada em [Ponto 13](#ponto-13--administração-4-perfis-de-acesso-oferecidos-vs-mvp-com-só-administrador); bug de contador coberto pelo [Ponto 11](#ponto-11--dashboard-contadores-errados-no-carregamento--recursos-clicáveis) |
| Editar/Inativar/Reativar Usuário | [`administracao/gerenciar-usuarios.md`](./funcionais/administracao/gerenciar-usuarios.md) | Editar (nome/e-mail); Inativar com kill de sessão; auto-inativação bloqueada (403); Reativar | Bloquear/Liberar funcionam; "Alterar Cargo" é botão morto (sem edição real); **auto-bloqueio permitido** (bug crítico); sem kill de sessão | ➕ **Inserir** — decisão fechada em [Ponto 15](#ponto-15--administração-editar--inativar--reativar-usuário) |

**Nota de segurança já levantada:** o admin define a senha inicial manualmente ao criar um usuário (sem convite por e-mail). Isso está de acordo com o requisito documentado ("Senha temporária" definida pelo admin) — não é bug, mas vale confirmar que este é o comportamento desejado para o v1.

---

## 7. Autorização / Perfis futuros (Líder, Membro)

De acordo com o EAP, **líder de célula e membro não devem ter login em v1** — confirmado por você nesta conversa. A tela "Meu Perfil & Dados" (edição de dados do próprio usuário Admin) funciona normalmente e deve ser mantida.

| Item | Decisão |
|---|---|
| Tela "Meu Perfil & Dados" (dados do usuário logado) | ✅ **Manter** |

---

## 8. Módulos construídos sem especificação (fora do escopo documentado)

A IA construiu dois blocos de funcionalidade que **não existem em nenhum requisito documentado**:

### 8.1 "Modo Líder" (Início, Chamada, Agenda, "Minha Célula", botão "Painel Admin")

**❌ Retirar — decisão final fechada em [Ponto 14](#ponto-14--modo-líder-início-chamada-agenda-minha-célula-botão-painel-admin).** Remover por completo: telas, rotas, botão de alternância e a função quebrada `getCelulasByLider`.

### 8.2 "Eventos, Avisos & Programação"

**❌ Retirar do v1 — decisão fechada.** Módulo com 3 sub-abas (Eventos Especiais / Avisos Gerais / Programação Fixa), 100% vazio em uso, construído sem pedido formal. O produto é um gestor de membros e células — este módulo não faz parte do escopo v1. Remover as telas, o modal "Nova Publicação" e as rotas associadas.

---

## 9. Módulos secundários — pauta a percorrer com você

Você mencionou que a ferramenta pode ter módulos secundários acoplados e que vamos passar por quais você quer. Lista de candidatos identificados até agora (a partir do que já existe implementado ou especificado) — para irmos decidindo um a um:

- [x] **Eventos, Avisos & Programação** — ❌ **Retirar do v1** (ver seção 8.2 acima)
- [x] **Organograma hierárquico** — ✅ **Mantém como P2/Futuro.** Navegação clique a clique (membro → líder → liderados) já cobre a necessidade básica no v1; não é substituto real de uma árvore visual completa exportável/imprimível, mas isso não bloqueia o v1 dado o volume atual de membros.
- [x] **Relatórios + Exportação de listagem** — ➕ **Inseridos no v1, consolidados em um único requisito** ([Ponto 17](#ponto-17--relatórios-e-exportação-de-listagem-consolidados-em-exportar-com-filtro)): exportação em CSV e PDF respeitando os filtros ativos, disponível em Membros e Células. Excel adiado.
- [ ] *(espaço para os módulos que você ainda vai trazer)*

> Assim que você indicar por qual módulo secundário quer começar, detalhamos ele nesta seção com o mesmo formato: especificado / implementado / decisão.

---

## 10. Resumo executivo (para acompanhamento rápido)

**20 de 20 pontos divergentes decididos.** 3 de 3 módulos secundários candidatos originais já decididos (Eventos/Avisos retirado; Organograma mantido como P2; Relatórios+Exportação inseridos e consolidados). Pontos 18-20 e diversos esclarecimentos vieram da revisão crítica de QA sobre `criterios-aceitacao-qa-v1.md`. Restam quaisquer outros módulos que o PO ainda for trazer.

| Categoria | Contagem |
|---|---|
| 🔧 Ajustar (existe, mas diverge ou tem bug) | 11 |
| ➕ Inserir (especificado ou novo, não implementado) | 13 |
| ❌ Retirar (implementado sem escopo, contradiz decisão v1) | 3 (Modo Líder inteiro + botão "Novo Líder" + Eventos/Avisos/Programação) |
| ✅ Manter | 4 (Meu Perfil & Dados + redistribuição de líder já funcional + card "Células Ativas" do Dashboard + Organograma como P2) |

**Achado de maior risco:** o bug de auto-bloqueio de admin ([Ponto 15](#ponto-15--administração-editar--inativar--reativar-usuário)), combinado com a ausência de recuperação de senha ([Ponto 3](#ponto-3--recuperação-de-senha-ausente)), pode deixar a equipe totalmente fora do sistema sem nenhum caminho de recuperação — priorizar junto com o Ponto 2 (sessão).

---

## Pauta ainda em aberto (para fecharmos o documento)

Estes pontos ainda **não têm decisão do PO** e por isso não podem ser implementados ainda — nada aqui é backlog para "depois", é o que falta decidir para completar a ordem de serviço:

1. Quaisquer módulos secundários adicionais que o PO ainda queira trazer (os 3 candidatos originais da seção 9 já foram todos decididos).

Assim que cada ponto acima for decidido, ele deixa de estar "em aberto" e passa a ser instrução direta de implementação, como os demais pontos já registrados no "Registro de Decisões".

---

## 11. Glossário e Riscos de Ambiguidade de Linguagem

Percorremos termo a termo do produto para garantir que a ferramenta usa a **mesma linguagem que a igreja já usa** no dia a dia — não termos genéricos inventados durante a construção com IA. Formato: onde o termo aparece, para que servia (ou parecia servir), e a decisão final.

### Termo 1 — "Grupo" (Kids/Teens/Movement/Ripe/Família)

**📍 Onde aparece:** campo "Grupo *" no cadastro/edição de Membro; sufixo nos seletores de líder (ex: "Lucas Bomfonti (RIPE)"); coluna "GRUPO" na listagem de Membros; exibido também na ficha da Célula (herdado do líder, célula não tinha campo próprio).

**🎯 Para que servia:** classificação solta do membro/líder, sem padrão claro nos dados de teste (só exemplos com "RIPE").

**✅ Decisão final:**
1. ❌ **Remover completamente** o campo "Grupo" do Membro — um membro não deve estar vinculado a um grupo específico. Remove o campo do formulário, a coluna da listagem, o filtro e o sufixo nos seletores de líder.
2. A Célula (não o membro) ganha um campo próprio de classificação, com nome e opções corrigidos: **"Faixa Etária"** — `Kids` / `Teens` / `Adolescente` / `Jovem Adulto` / `Adulto` (5 opções; substitui o antigo "Tipos de célula" do requisito original, que tinha só 4 opções sem "Jovem Adulto"). Este campo é atributo da célula (o encontro), nunca do membro individual.

**Ação para o requisito original:** remover "Grupo" de `membros/criar-membro.md`, `membros/editar-membro.md`, `membros/listar-membros.md`; renomear "Tipos da célula" para "Faixa Etária" em `celulas/*.md` e no bloco de célula dentro de `membros/criar-membro.md`/`editar-membro.md`, atualizando a lista de opções para as 5 novas.

---

### Termo 2 — "Discípulo" x "Liderado" x "Membro"

**📍 Onde aparece:** uso intercambiável nos requisitos originais e neste documento ("membros liderados", "liderados", "discípulos"). No app implementado, já aparece consistentemente como "**discípulo**" (ficha da célula: "2 discípulo(s) liderado(s)"; modal de redistribuição: "Redistribuição de Discípulos").

**🎯 Para que serve:** mesmo conceito em todos os casos — um membro comum vinculado a um líder específico.

**✅ Decisão final:** **"Discípulo" é o termo oficial** — é como a igreja chama. Padronizar em toda a interface e em todos os requisitos, substituindo "liderado" e usos genéricos de "membro" sempre que o contexto for especificamente a relação membro→líder.

**Ação para o requisito original:** revisar todos os arquivos em `requisitos/funcionais/` substituindo "liderado(s)" por "discípulo(s)" onde a relação membro→líder for o assunto (mantém "membro" apenas quando o contexto for genérico, sem relação a um líder específico).

---

### Termo 3 — "Célula Evangelística" x "Célula de Liderança"

**📍 Onde aparece:** só no [Ponto 1](#ponto-1--líder-pode-liderar-múltiplas-células-com-finalidade-evangelística-ou-liderança) deste documento — nomes criados por mim ao traduzir a regra de negócio descrita pelo PO. Não existiam em nenhum requisito ou tela anterior.

**🎯 Para que serve:** distinguir a finalidade de cada célula de um líder — evangelismo/crescimento vs. formação de novos líderes.

**✅ Decisão final:** **Confirmado — são os termos corretos.** "Célula Evangelística" e "Célula de Liderança" são exatamente como a igreja chama. Nenhuma alteração necessária no [Ponto 1](#ponto-1--líder-pode-liderar-múltiplas-células-com-finalidade-evangelística-ou-liderança).

---

### Termo 4 — "Bloquear/Liberar Acesso" (usuários do sistema) x "Inativar/Reativar" (membros da igreja)

**📍 Onde aparece:** tela de Permissões/Acessos usa "Bloquear Acesso" / "Liberar Acesso" para usuários do sistema; tela de Membros usa "Inativar" / "Reativar" para membros da igreja.

**🎯 Para que serve:** conceitos distintos — acesso ao sistema (login) vs. status de vínculo com a igreja.

**✅ Decisão final:** **Intencional — mantém os dois pares de termos como estão.** Nenhuma unificação de linguagem necessária; são conceitos diferentes e devem continuar com nomes diferentes.

---

### Termo 5 — "Líder Responsável (Discipulado por)"

**📍 Onde aparece:** campo no formulário de Membro (testado ao vivo) — label duplo "Líder Responsável * (Discipulado por)".

**🎯 Para que serve:** identifica o líder responsável pelo membro/discípulo — o vínculo membro→líder usado em todo este documento.

**✅ Decisão final:**
1. **Nome mantido como está** — "Líder Responsável (Discipulado por)" continua com os dois termos juntos.
2. 🔧 **Correção de ordem no formulário:** o campo "Líder Responsável * (Discipulado por)" deve aparecer **antes** do campo "É Líder de Célula? *" (hoje aparece depois, só no final da seção "Vínculo & Liderança", quando "É Líder de Célula" está marcado "Sim"). Todo membro tem um líder responsável, líder ou não — esse campo deve ser perguntado primeiro, e só depois se pergunta se ele próprio também é líder de célula.

**Ação para o requisito original:** ajustar a ordem de campos em `membros/criar-membro.md` e `membros/editar-membro.md`, seção "Vínculo & Liderança": "Líder Responsável (Discipulado por)" primeiro, "É Líder de Célula?" depois (isso também está mais alinhado com a ordem original documentada no requisito, que já tinha "Vínculo com Líder" antes do bloco de liderança).

---

### Termo 6 — "Tipo de Ingresso: Recepção / Batismo"

**📍 Onde aparece:** campo "Tipo Ingresso *" no cadastro de membro.

**🎯 Para que serve:** indica como a pessoa formalmente ingressou como membro — batismo nas águas na igreja, ou recepção (já batizada, vinda de outro contexto).

**✅ Decisão final:** **Confirmado — apenas esses dois valores estão corretos.** Nenhuma alteração necessária.

---

### Termo 7 — "Movement" em inglês no meio de uma lista em português

**📍 Onde aparece:** valor do campo "Grupo" (Kids/Teens/**Movement**/Ripe/Família).

**🎯 Para que serve:** categoria dentro de "Grupo", provavelmente dado de exemplo/placeholder da IA.

**✅ Decisão final:** **Resolvido automaticamente pelo [Termo 1](#termo-1--grupo-kidsteensmovementripefamília)** — como o campo "Grupo" foi removido do Membro por completo, este valor desaparece junto. Sem decisão separada necessária.

---

### Termo 8 — "Dia do Encontro" x "Dia da Célula"

**📍 Onde aparece (3 lugares confirmados ao vivo):**
1. Bloco de célula no cadastro/edição de Membro
2. Painel "Filtros de Células" (listagem de Células)
3. Modal **"Editar Líder"** — nome dado ao formulário de edição de célula na implementação atual; mistura campos do líder (Nome, WhatsApp, Grupo) com campos da célula (Dia do Encontro, Horário, Endereço) no mesmo formulário

**🎯 Para que serve:** dia da semana em que a célula do líder se reúne.

**✅ Decisão final:** 🔧 **Trocar o rótulo em todos os 3 lugares** de "Dia do Encontro" para "**Dia da Célula**".

**Achado adicional (fora do escopo deste termo, registrado para referência):** o modal "Editar Líder" também expõe o campo "Grupo" do líder (Kids/Teens/Movement/Ripe/Família) — mesmo campo que o [Termo 1](#termo-1--grupo-kidsteensmovementripefamília) decidiu remover do Membro. O painel "Filtros de Células" tem o mesmo problema, com um filtro rotulado "Grupo / Faixa Etária" que ainda usa os valores antigos de Grupo em vez das 5 opções de Faixa Etária decididas no Termo 1. Ambos precisam ser corrigidos junto com a implementação do Termo 1.

**Ação para o requisito original:** ajustar o label em `membros/criar-membro.md`, `membros/editar-membro.md` e `celulas/*.md` (formulário de edição e filtros) de "Dia do Encontro" para "Dia da Célula"; remover campo "Grupo" e atualizar filtro para "Faixa Etária" (5 opções) nos mesmos locais, conforme Termo 1.

---

# Histórico de Alterações

| Data | Autor | Descrição |
|---|---|---|
| 15/08/2026 | Thiago Oliveira (com apoio de IA) | Criação inicial: auditoria da implementação (`gestao-wave.netlify.app`) contra a especificação existente (`requisitos/funcionais/`), com decisões preliminares por fluxo |
| 15/08/2026 | Thiago Oliveira (com apoio de IA) | Documento reposicionado como ordem de serviço para implementação imediata (não backlog); 14 pontos divergentes percorridos e decididos com o PO: célula com Finalidade Evangelística/Liderança (Ponto 1), persistência de sessão (Ponto 2), remoção de recuperação de senha do v1 (Ponto 3), ciclo de vida completo de inativação/reativação de membro (Ponto 4), modal de troca de líder (Ponto 5), campos calculados na ficha do membro (Ponto 6), paginação/filtros da listagem (Ponto 7), alerta de duplicata (Ponto 8), remoção do botão "Novo Líder" (Ponto 9), correção de discípulo duplicado (Ponto 10), bugs e recursos do Dashboard (Ponto 11), escopo da Importação CSV limitado à carga anual (Ponto 12), restrição de perfis de acesso ao Administrador (Ponto 13), remoção total do "Modo Líder" (Ponto 14) |
| 15/08/2026 | Thiago Oliveira (com apoio de IA) | Ponto 15 testado ao vivo e decidido: bug crítico de auto-bloqueio de admin, ausência de kill de sessão e edição de usuário não funcional em Administração |
| 15/08/2026 | Thiago Oliveira (com apoio de IA) | Ponto 4 corrigido após teste ao vivo (inativar/reativar e redistribuição de líder já existem — gaps reais são só os modais faltantes); Ponto 16 registrado e decidido (ativar validação de vínculo por mesmo sexo, revertendo o adiamento original); módulo Eventos/Avisos/Programação retirado do v1; Organograma mantido como P2/Futuro |
| 15/08/2026 | Thiago Oliveira (com apoio de IA) | Revalidação ao vivo de todos os 16 pontos a pedido do PO, para garantir que o documento não reporte nada "de ouvido": 13 pontos reconfirmados com teste direto, 1 corrigido (Ponto 11 — card "Total de Células Ativas" já funciona; só o card de Aniversariantes está inoperante), 1 mantido como não totalmente confirmado (Ponto 8, alerta de duplicata — teste inconclusivo por instabilidade da ferramenta de automação, decisão mantida por precaução) |
| 15/08/2026 | Thiago Oliveira (com apoio de IA) | Ponto 17 registrado e decidido: "Relatório de Células", "Relatório de Aniversariantes" e "Exportação de Listagem" (todos P2 no EAP original) consolidados em um único requisito de exportação (CSV + PDF) com filtro aplicado, em Membros e Células; Excel adiado; corrigida ordenação dos pontos no documento (Ponto 14 estava fora de sequência) |
| 15/08/2026 | Thiago Oliveira (com apoio de IA) | Seção 11 (Glossário e Riscos de Ambiguidade de Linguagem) criada: 7 termos revisados com o PO — campo "Grupo" removido do Membro; Célula ganha campo "Faixa Etária" (Kids/Teens/Adolescente/Jovem Adulto/Adulto); "Discípulo" confirmado como termo oficial; "Célula Evangelística"/"Célula de Liderança" confirmados; "Bloquear/Liberar" x "Inativar/Reativar" mantidos como termos intencionalmente distintos; ordem de campos corrigida no cadastro de membro (Líder Responsável antes de É Líder de Célula); "Tipo de Ingresso" confirmado sem alteração |
| 15/08/2026 | Thiago Oliveira (com apoio de IA) | Termo 8 adicionado: label "Dia do Encontro" trocado para "Dia da Célula" no bloco de célula do cadastro de membro |
| 15/08/2026 | Thiago Oliveira (com apoio de IA) | Termo 8 expandido após busca ao vivo por mais ocorrências de "Encontro": achadas mais 2 (Filtros de Células; modal "Editar Líder"). Achado adicional registrado: modal "Editar Líder" e painel de Filtros de Células ainda expõem o campo "Grupo" antigo, que precisa ser removido/atualizado junto com o Termo 1 |
| 15/08/2026 | Thiago Oliveira (com apoio de IA) | Ponto 1 expandido com levantamento completo e literal dos formulários de criar/editar célula, a pedido do PO para garantir que nenhuma lacuna ficasse escondida: endereço da célula totalmente ausente na criação (formulário assume "em sua residência"), toggle "mesmo endereço/outro endereço" inserido para cobrir cenário de célula fora de casa (ex: quadra de futebol), sem campo de ponto de referência |
| 15/08/2026 | Thiago Oliveira (com apoio de IA) | Ponto 18 registrado e decidido: gráfico "Ingressos de Membros por Mês" retirado do Dashboard |
| 15/08/2026 | Thiago Oliveira (com apoio de IA) | Ponto 11 esclarecido: card de Aniversariantes abre lista com todos os aniversariantes do mês, cada linha com seu próprio botão "Enviar Parabéns" via WhatsApp (não um botão único para o card) |
| 15/08/2026 | Thiago Oliveira (com apoio de IA) | Ponto 19 registrado e decidido: seleção dinâmica de colunas em todas as telas de listagem (Membros, Células, Usuários), com preferência persistida por usuário; coluna "Ações" sempre visível |
| 17/08/2026 | Thiago Oliveira (com apoio de IA) | Ajustes a partir da análise crítica do QA sobre `criterios-aceitacao-qa-v1.md`: Ponto 16 esclarecido (validação de mesmo sexo é bloqueio total, não alerta contornável; regra estendida a redistribuição e reativação); Ponto 1 esclarecido (Finalidade da célula é imutável após criação); Ponto 11 esclarecido (Aniversariantes abre como modal, não página); Ponto 19 esclarecido (persistência de colunas é por usuário/conta, não por navegador); Ponto 20 criado (ação de fechar 1 célula individual sem inativar o líder inteiro) |

---

<div align="center">
  <sub><strong>🔒 Documento Confidencial</strong> • Uso Interno</sub>
</div>
