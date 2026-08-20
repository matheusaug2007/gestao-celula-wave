[Cadastro Membros](../README.md) > **Validação Pós-Entrega — Produção (v1)**

---

# Validação Pós-Entrega — Produção

**Versão:** 1.2 | **Data da validação:** 19/08/2026 | **Autor:** Thiago Oliveira (com apoio de IA)

**Ambiente testado:** https://gestao-wave.netlify.app/ (produção)

**Base:** [`plano-revisao-implementacao-v1.md`](./plano-revisao-implementacao-v1.md) (v1.3) — cada item abaixo referencia o Ponto/Termo correspondente.

---

## Como ler este documento

Testei a entrega em duas rodadas: pela interface (clique a clique) e, para os pontos mais difíceis de reproduzir manualmente, direto no código-fonte servido em produção (via leitura dos arquivos `.js`). Isso permitiu confirmar com certeza alguns comportamentos e **encontrar a causa raiz** de um dos bugs, não só o sintoma.

- ✅ **Confirmado correto** — nenhuma ação necessária
- 🚨 **Bug / gap a corrigir** — precisa de ajuste do dev
- ⚠️ **Confirmado parcialmente** — funciona, mas com uma divergência específica

---

## ✅ Confirmado correto (23 itens — não mexer)

| # | Item | Ponto/Termo |
|---|---|---|
| 1 | Sessão persiste; checkbox "Lembrar de mim" (7 dias) | Ponto 2 |
| 2 | Sem link de recuperação de senha na tela de login | Ponto 3 |
| 3 | Gráfico "Ingressos por Mês" removido do Dashboard | Ponto 18 |
| 4 | Módulo Eventos/Avisos/Programação removido | Seção 8.2 |
| 5 | Modo Líder totalmente removido (sem "Minha Célula", sem arquivo `modo-lider.js`, sem erros de console) | Ponto 14 |
| 6 | Card "Aniversariantes do Mês" abre modal com lista + botão WhatsApp por linha | Ponto 11 |
| 7 | Card "Total de Células Ativas" clicável | Ponto 11 |
| 8 | Contadores corretos desde o primeiro carregamento (Dashboard e Permissões) | Ponto 11 / 15 |
| 9 | Campo "Grupo" removido do Membro | Termo 1 |
| 10 | Célula ganhou campo "Faixa Etária" com as 5 opções corretas | Termo 1 |
| 11 | Terminologia "Discípulo" aplicada consistentemente | Termo 2 |
| 12 | "Líder Responsável" aparece antes de "É Líder de Célula?" no formulário | Termo 5 |
| 13 | Rótulo "Dia da Célula" (não mais "Dia do Encontro") | Termo 8 |
| 14 | Múltiplas células por líder + botão "Adicionar outra Célula" | Ponto 1 |
| 15 | Campo "Finalidade" (Evangelística/Liderança) no cadastro de célula | Ponto 1 |
| 16 | Toggle "Usar meu endereço residencial" / "Outro endereço" funcional | Ponto 1 |
| 17 | Validação de célula de Liderança obrigatória ao promover discípulo a líder | Ponto 1 |
| 18 | Idade Atual + Tempo de Membro na ficha do discípulo | Ponto 6 |
| 19 | Paginação, ordenação por coluna, filtros, exportação CSV/PDF e Colunas dinâmicas — **em Membros** | Pontos 7, 17, 19 |
| 20 | Botão "Novo Líder" removido de Células | Ponto 9 |
| 21 | Ação "Fechar Célula" individual, com bloqueio correto se for a última evangelística | Ponto 20 |
| 22 | Só perfil "Administrador" selecionável; auto-bloqueio de admin prevenido (botão nem aparece); "Editar Administrador" funcional | Pontos 13, 15 |
| 23 | Validação de mesmo sexo líder↔discípulo — bloqueia por completo e o seletor já filtra dinamicamente | Ponto 16 |
| 24 | Alerta de duplicata (nome + data nascimento) — não-bloqueante, "Salvar Mesmo Assim" / "Revisar Cadastro" | Ponto 8 |
| 25 | Redistribuição de discípulos ao inativar líder — filtra por ativos + mesmo sexo; inclui discípulos-líder | Ponto 4 |
| 26 | Modal de confirmação simples ao inativar membro sem discípulos | Ponto 4 |
| 27 | Reativação pergunta explicitamente se reativa como líder | Ponto 4 |
| 28 | Template CSV com colunas de Finalidade/Faixa Etária; agrupamento correto de múltiplas linhas do mesmo líder em 1 membro com N células | Ponto 12 |

---

## 🚨 Bugs e gaps a corrigir

### 1. [CRÍTICO] Líder aparece como discípulo de si mesmo — bug de dado + falha de robustez na função

**Onde:** Ficha da célula de Matheus Augusto Lopes de Oliveira — ele mesmo aparece na lista "Discípulos Ativos" da própria célula.

**Causa raiz identificada no código:** a função `getDiscipulosByLider()` (`data.js`) faz um match textual do nome do líder contra o campo `lider` de cada membro, **sem excluir o próprio líder da busca**. Como o registro de Matheus tem o campo `lider` = "Matheus Augusto" (autorreferência — provavelmente resquício de dado de teste/seed), a função encontra ele mesmo como "discípulo".

**Correção necessária (2 partes):**
1. **Dado:** corrigir o registro de Matheus Augusto Lopes de Oliveira para que o campo `lider` não aponte para ele mesmo (deve ser "—" se for líder raiz, ou o nome de outro líder real).
2. **Código:** adicionar uma exclusão explícita em `getDiscipulosByLider()` (e em qualquer outra função parecida) para nunca retornar o próprio líder como resultado, mesmo que o dado esteja errado — isso evita que o mesmo bug reapareça no futuro com outro registro malformado.

---

### 2. [ALTO] Importação CSV: validação de gênero não implementada (mas anunciada na tela)

**Onde:** tela de Importar — o texto diz *"O sistema valida automaticamente duplicidades (Nome + Data de Nascimento) e consistência de gênero."*

**Problema:** conferi a função `processCSVText()` (`importacao.js`) inteira — ela só valida nome ausente, data de nascimento ausente e duplicata. **Não existe nenhuma validação de sexo entre líder e discípulo na importação**, apesar do texto prometer isso. A mesma regra que já existe no cadastro manual (Ponto 16) precisa ser replicada aqui.

**Correção necessária:** adicionar, dentro do loop de `processCSVText()`, uma checagem chamando a mesma função `validarMesmoSexo()` já usada no cadastro manual — marcando a linha como inválida com uma mensagem clara (ex: "Sexo do discípulo incompatível com o líder informado") quando divergir.

---

### 3. [MÉDIO] Listagem de Células ainda é "1 linha por líder", não "1 linha por célula"

**Onde:** tela de Células — o contador mostra "Exibindo X **líder(es)** de célula" e cada líder aparece em **1 card só**, mesmo tendo múltiplas células (as células só aparecem juntas quando se abre a Ficha do líder).

**Especificado (Ponto 1):** um líder com 2 células deveria aparecer em **2 linhas/cards separados** na listagem principal — uma por célula.

**Correção necessária:** mudar a fonte de dados da listagem principal de "iterar sobre líderes" para "iterar sobre células" (flat-map: cada célula de cada líder vira um item da lista), mantendo a Ficha do líder (que já funciona bem) como está.

---

### 4. [MÉDIO] Dado legado não migrado: célula mostra valor antigo de "Faixa Etária"

**Onde:** célula de Matheus Augusto Lopes de Oliveira mostra **"RIPE"** como Faixa Etária — não é uma das 5 opções novas (Kids/Teens/Adolescente/Jovem Adulto/Adulto), é o valor antigo do campo "Grupo" que foi removido (Termo 1).

**Correção necessária:** rodar uma migração pontual nos dados existentes, convertendo/limpando valores antigos de "Grupo" (RIPE, Movement, etc.) que ficaram órfãos no campo Faixa Etária das células já cadastradas antes desta entrega. Provavelmente afeta só este 1 registro de teste, mas vale confirmar se há mais.

---

### 5. [BAIXO] "Colunas" e "Exportar CSV/PDF" não chegaram na tela de Células

**Onde:** tela de Células — confirmei tanto ao vivo quanto no código-fonte (`admin-lideres.js`) que não existe nenhuma menção a "colunas" no arquivo.

**Especificado:** Pontos 17 e 19 pedem essas duas funcionalidades em **toda** tela de listagem (Membros, Células, Usuários) — hoje só existem em Membros e Permissões.

**Correção necessária:** replicar os componentes de "Selecionar Colunas" e "Exportar CSV/PDF" (já existentes e funcionando em Membros) na tela de Células.

---

### 6. [BAIXO] Dashboard: card "Discípulos Ativos" deveria ser "Membros Ativos"

**Onde:** Dashboard — cards "DISCÍPULOS ATIVOS" e "DISCÍPULOS INATIVOS".

**Problema:** o Termo 2 do plano de revisão define "Discípulo" como termo oficial **especificamente para o vínculo membro→líder** — não como substituto genérico de "Membro" em qualquer contexto. Os cards do Dashboard mostram uma contagem agregada de toda a base (sem relação a nenhum líder específico), então o termo correto ali é **"Membros Ativos"** / **"Membros Inativos"**, como no card "Saúde da Comunidade". A troca de terminologia foi aplicada além do escopo pretendido.

**Correção necessária:** reverter o rótulo desses dois cards específicos do Dashboard para "Membros Ativos" / "Membros Inativos". Não afeta os demais usos de "Discípulo" (esses continuam corretos).

---

## Melhorias solicitadas (não são bugs — pedidos novos do PO)

Fecham o ciclo de navegação Membro ↔ Célula, reforçando o princípio de que o membro é o ponto focal da ferramenta (quem é o líder dele, se ele é líder, quem são os liderados dele — tudo deve estar a 1 clique de distância).

### 7. Título do modal deve virar "Ficha do Membro" quando o membro visualizado for líder

**Onde:** tela de Membros → clicar em um membro que é líder → modal abre com título "Ficha do Discípulo".

**Pedido:** quando o membro visualizado tiver `eLider = true`, o título do modal deve ser **"Ficha do Membro"** em vez de "Ficha do Discípulo" (para membros comuns, o título continua "Ficha do Discípulo" normalmente — essa troca é só quando ele é líder).

### 8. Card "Discípulos liderados" na Ficha do Membro (líder) deve navegar para a Ficha da Célula

**Onde:** dentro do modal de Ficha do Membro de um líder, o card que mostra a contagem de discípulos liderados.

**Pedido:** ao clicar nesse card, fechar o modal atual e abrir o modal **"Ficha da Célula"** daquele líder (a mesma tela que já existe e funciona bem na área de Células), para que o usuário veja a lista completa de discípulos vinculados.

### 9. Discípulo listado na Ficha da Célula deve navegar para a Ficha do Membro dele

**Onde:** tela de Células → "Ver Ficha da Célula" → lista de discípulos vinculados dentro do modal.

**Pedido:** ao clicar em um discípulo da lista, fechar o modal atual e abrir a **"Ficha do Membro"** daquele discípulo específico, para que o usuário veja os dados completos dele.

---

## Resumo para o dev

| Prioridade | Qtd. | Itens |
|---|---|---|
| 🔴 Crítico | 1 | Bug #1 (autorreferência de líder) |
| 🟠 Alto | 1 | Bug #2 (validação de gênero ausente no CSV) |
| 🟡 Médio | 2 | Bugs #3 e #4 (listagem por líder; dado legado) |
| 🟢 Baixo | 2 | Bugs #5 e #6 (colunas/exportação faltando em Células; terminologia do Dashboard) |
| ✨ Melhoria | 3 | Itens 7, 8 e 9 (navegação cruzada Membro ↔ Célula) |

**28 itens confirmados corretos, 6 pendências, 3 melhorias novas.** A entrega está sólida — a maior parte do plano de revisão foi implementada fielmente (o dev inclusive comentou o código com os números dos Pontos, o que facilitou muito esta validação). As pendências acima são objetivas e têm causa raiz identificada, sem necessidade de mais nenhuma decisão de produto — é só ajuste técnico.

---

# Histórico de Alterações

| Data | Autor | Descrição |
|---|---|---|
| 19/08/2026 | Thiago Oliveira (com apoio de IA) | Criação inicial — consolidação da validação pós-entrega de produção em duas rodadas, com achados via teste de interface e leitura de código-fonte |
| 19/08/2026 | Thiago Oliveira (com apoio de IA) | Item 6 adicionado: cards do Dashboard devem voltar a "Membros Ativos/Inativos" — o Termo 2 (Discípulo) foi aplicado além do escopo pretendido |
| 19/08/2026 | Thiago Oliveira (com apoio de IA) | Itens 7, 8 e 9 adicionados: melhorias de navegação cruzada entre Ficha do Membro e Ficha da Célula (título condicional; card de discípulos leva à célula; discípulo listado na célula leva à ficha dele) |

---

<div align="center">
  <sub><strong>🔒 Documento Confidencial</strong> • Uso Interno</sub>
</div>
