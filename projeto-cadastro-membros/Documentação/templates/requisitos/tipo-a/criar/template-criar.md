<!--

AGENT IA - INSTRUÇÕES DE PREENCHIMENTO PARA CABEÇALHO

Para instruções COMPLETAS e DETALHADAS sobre o cabeçalho, consulte:
📄 ../../prompts/prompt-cabecalho-unificado.md

RESUMO RÁPIDO:
✓ Logo institucional obrigatória (caminho relativo)
✓ 2 separadores --- (abaixo do logo e versão/data)
✓ Breadcrumb: [Módulo: Nome](../../README.md) › **Título**
✓ Título formato "Ação Entidade" (ex: Listar Usuários)
✓ Versão X.Y | Data DD/MM/AAAA (ambos em negrito)
✓ Rodapé institucional obrigatório
✓ Checklist completo disponível no prompt centralizado
   -->


[Módulo: {{MODULO}}](../../README.md) › **Criar {{ENTIDADE_NO_PLURAL}}**

**Versão:** X.Y | **Última atualização:** DD/MM/AAAA

---
# Contextualização

<!--

AGENT IA - INSTRUÇÕES DE PREENCHIMENTO PARA CONTEXTUALIZAÇÃO

Para instruções COMPLETAS e DETALHADAS sobre contextualização, consulte:
📄 ../../prompts/prompt-contextualizacao-unificada.md

RESUMO RÁPIDO:
✓ Explique o PROBLEMA DE NEGÓCIO que motiva este requisito
✓ 1 a 3 parágrafos curtos, linguagem de negócio
✓ Responde "POR QUE" é necessário, não "COMO" funciona
✓ NÃO mencionar telas, fluxos, UI ou elementos visuais
✓ Tom profissional, objetivo e institucional
✓ 4 exemplos práticos disponíveis no prompt centralizado
   -->

{{DESCREVER_O_CONTEXTO_DA_ENTIDADE}}

# Detalhamento Funcional

<!--
AGENT IA - INSTRUÇÕES DE PREENCHIMENTO:
Descreva de forma objetiva e narrativa a composição da tela, preparando o leitor para a leitura do detalhamento funcional.

O texto deve:

- Apresentar a tela como um todo, explicando sua estrutura geral como um formulário de cadastro organizado em seções ou blocos de informação.
- Indicar o propósito da tela do ponto de vista do usuário (ex.: registrar, configurar ou manter informações de uma entidade).
- Mencionar de forma breve os principais blocos visuais do formulário
  (ex.: dados institucionais, informações associadas, dados operacionais, ações Salvar/Cancelar),
  sem antecipar regras detalhadas.
- Quando existirem informações relacionadas ao cadastro principal
  (ex.: registros vinculados, históricos ou itens associados),
  indicar que esses dados podem ser apresentados em formato de lista dentro do formulário,
  deixando claro que um cadastro pode possuir múltiplos registros associados,
  sem detalhar colunas, ações ou comportamentos.
- Não listar campos individuais, valores, validações ou regras específicas
  (estes serão detalhados nas seções seguintes do requisito).
- Ser escrito em texto corrido, em um único parágrafo curto (3 a 5 linhas),
  com linguagem clara, institucional e acessível.
- Evitar termos técnicos; quando inevitável, incluir uma breve explicação em linguagem simples.

Se houver imagem de protótipo, inserir logo abaixo do parágrafo, utilizando o padrão definido no template.

- Todas as imagens utilizadas nos requisitos devem estar localizadas na pasta `imagens/`,
  no mesmo nível do arquivo do requisito.

- O caminho da imagem deve ser sempre relativo ao próprio arquivo `.md`.

- Utilizar obrigatoriamente o padrão:

  ![Descrição da imagem](./imagens/nome-do-arquivo.png)

- Não utilizar caminhos absolutos ou relativos a outras pastas do repositório
  (ex.: ../../../iamgens, /assets, etc.).

- O nome do arquivo da imagem deve ser descritivo, em kebab-case, e refletir
  claramente o conteúdo exibido.

-->

{{DESCRICAO_TELA}}

![{{DESCRICAO_DA_IMAGEM}}](./imagens/{{NOME_DA_IMAGEM}})

## Criar {{ENTIDADE_NO_PLURAL}}

<!--
AGENT IA - INSTRUÇÕES DE PREENCHIMENTO:
Utilizar sempre verbo no infinitivo + entidade no plural.
Exemplos:
- Criar Usuários
- Criar Modelos de Equipamentos
- Criar Estabelecimentos Comerciais
-->

### Acesso à Funcionalidade

<!--
AGENT IA - INSTRUÇÕES DE PREENCHIMENTO:
Descreva de forma objetiva como o usuário acessa a funcionalidade no sistema.

O texto deve:

- Informar claramente o caminho de acesso (menu ou navegação).
- Indicar qual permissão é necessária para acessar e visualizar a funcionalidade.
- Explicar, quando aplicável, a existência de restrição de acesso por Estado, incluindo:
  - aplicação automática da restrição no carregamento inicial da tela;
  - limitação dos dados exibidos conforme os Estados autorizados ao usuário;
  - comportamento do sistema quando o usuário não possui permissão para nenhum Estado.

Utilize texto corrido, com parágrafos curtos, sem listas, sem ícones e sem linguagem técnica excessiva.
-->

{{DESCREVER_COMO_O_USUARIO_ACESSA_A_ACAO}}

## Preenchimento e Comportamento

O formulário de criação deve conter os seguintes campos:

{{LISTA_DE_CAMPOS}}

<!--
AGENT IA - INSTRUÇÕES DE PREENCHIMENTO – PADRÃO PARA CAMPOS DE FORMULÁRIO

Para cada campo, seguir OBRIGATORIAMENTE o modelo abaixo:

- **Nome do Campo:** descrição curta e funcional do que este campo representa no negócio.
  - Tipo: texto | seleção | número | data | etc.
  - Obrigatório: sim | não
  - Valor padrão: informar se existir
  - Regras específicas: validações, filtros, dependências, restrições

Regras de escrita:
- A descrição após ":" deve explicar O QUE o campo é, não COMO funciona.
- Não repetir regras técnicas na descrição.
- Não deixar o campo sem descrição.
-->

Ao acionar a ação **Salvar**, o sistema deve validar os dados informados e persistir o novo registro.

Em caso de sucesso, o sistema deve redirecionar o usuário para a tela de listagem da entidade, exibindo mensagem de confirmação.

{{MENSAGEM_DE_SUCESSO}}

<!--
AGENT IA - INSTRUÇÕES DE PREENCHIMENTO:
A mensagem de sucesso deve ser explícita, clara e padronizada.
Exemplo:
> “{{ENTIDADE}} cadastrada com sucesso.”
> -->

Ao acionar a ação **Cancelar**, o sistema deve descartar as alterações não salvas e retornar à tela anterior.

## Mensagens e Estados

<!--
AGENT IA - INSTRUÇÕES DE PREENCHIMENTO PARA MENSAGENS E ESTADOS

Para instruções COMPLETAS e DETALHADAS sobre Mensagens e Estados, consulte:
📄 ../../prompts/prompt-mensagens-estados-unificado.md

RESUMO RÁPIDO:
✓ Documentar apenas estados relevantes (com impacto no comportamento ou fluxo)
✓ Descrever condição, comportamento e mensagem (quando aplicável)
✓ Não listar estados triviais
✓ Referenciar Critérios de Aceite quando necessário
-->

- **{{ESTADO_1}}**
  - **Condição:** {{CONDICAO_DO_ESTADO}}
  - **Comportamento do sistema:** {{COMPORTAMENTO}}
  - **Mensagem exibida:** {{MENSAGEM}}

- **{{ESTADO_2}}**
  - **Condição:** {{CONDICAO_DO_ESTADO}}
  - **Comportamento do sistema:** {{COMPORTAMENTO}}
  - **Mensagem exibida:** {{MENSAGEM}}

# Fluxos Relacionados e Navegação

<!--

AGENT IA - INSTRUÇÕES DE PREENCHIMENTO PARA FLUXOS RELACIONADOS E NAVEGAÇÃO

Para instruções COMPLETAS e DETALHADAS sobre fluxos relacionados, consulte:
📄 ../../prompts/prompt-fluxos-navegacao-unificado.md

RESUMO RÁPIDO:
✓ Documente apenas relações COM IMPACTO FUNCIONAL
✓ Categorize em: Fluxos Anteriores, Posteriores, Alternativos (apenas se existirem)
✓ Explique BREVEMENTE o papel de cada relação
✓ Use links relativos corretos
✓ Marque requisitos em desenvolvimento com "(requisito em desenvolvimento)"
✓ NÃO documente navegação padrão (menu, botão voltar)
✓ 4 exemplos práticos disponíveis no prompt centralizado

-->

{{RELACOES_ENTRE_REQUISITOS}}

# Regras e Comportamentos do Sistema

{{REGRAS_DE_NEGOCIO}}

<!--
AGENT IA - INSTRUÇÕES DE PREENCHIMENTO PARA REGRAS E COMPORTAMENTOS DO SISTEMA

Para instruções COMPLETAS e DETALHADAS sobre regras e comportamentos, consulte:
📄 ../../prompts/prompt-regras-comportamentos-sistema-unificado.md

RESUMO RÁPIDO:
✓ Regras automáticas e restrições transversais
✓ Não dependem do fluxo visual
✓ Frases no formato "O sistema deve..."
✓ Um comportamento por item
✓ Referenciar Critérios de Aceite quando aplicável
-->



# Referências do Requisito

<!--
AGENT IA - INSTRUÇÕES DE PREENCHIMENTO PARA REFERÊNCIAS DO REQUISITO

Para instruções COMPLETAS e DETALHADAS sobre referências, consulte:
📄 ../../prompts/prompt-referencias-requisito-unificado.md

RESUMO RÁPIDO:
✓ Seção OPCIONAL — criar apenas com referências reais
✓ Não criar seção vazia e não manter placeholders
✓ Descrever cada referência antes do link
✓ Incluir Protótipo/Diagramas/Fluxos/Anexos quando aplicável
✓ Referências são complementares (não repetem regras do requisito)

-->

## Protótipo da Tela

<!-- Criar apenas se existir -->

Texto introdutório explicando que o protótipo é uma referência visual da funcionalidade.

- {{LINK_DESCRITIVO_PROTO}}

## Requisitos Relacionados

<!-- EXCLUIR SE NÃO EXISTIR -->

- **[{{NOME_REQUISITO}}]:** {{DESCRICAO_DO_MOTIVO_DO_RELACIONAMENTO}}.

   Para mais detalhes, consulte [{{NOME_REQUISITO}}]({{CAMINHO_RELATIVO_REQUISITO}}).


## Diagramas

<!-- Criar apenas se existir -->

Diagramas que auxiliam na compreensão técnica ou de fluxo da funcionalidade.

- {{LINK_DESCRITIVO_DIAGRAMA}}

## Fluxos Complementares

<!-- Criar apenas se existir -->

Fluxos externos ou complementares que ajudam a entender o processo como um todo.

- {{LINK_DESCRITIVO_FLUXO}}

## Anexos

<!-- Criar apenas se existir -->

| Nome / Link         | Descrição clara e objetiva |
| ------------------- | -------------------------- |
| {{LINK_OU_ARQUIVO}} | {{DESCRICAO}}              |



# Cenários de Comportamento

<!--
AGENT IA - INSTRUÇÕES DE PREENCHIMENTO PARA CENÁRIOS DE COMPORTAMENTO (BDD)

Para instruções COMPLETAS e DETALHADAS sobre cenários BDD, consulte:
📄 ../../prompts/prompt-cenarios-comportamento-bdd.md

RESUMO RÁPIDO:
✓ Usar formato Given-When-Then (Dado que-Quando-Então)
✓ Dados CONCRETOS (não placeholders genéricos)
✓ Um cenário = um comportamento específico
✓ Cobrir: fluxo principal, validações, regras, permissões, erros, edge cases
✓ Títulos descritivos para cada cenário
✓ Separar cenários com ---
✓ Resultados observáveis e verificáveis

CATEGORIAS MÍNIMAS:
✓ Cenário 1: Fluxo principal (happy path)
✓ Cenário 2+: Validações de entrada
✓ Cenário N: Regras de negócio, permissões, cancelamento
-->

## Cenário 1: Cadastro bem-sucedido de {{ENTIDADE_NO_SINGULAR}} com dados válidos

**Dado que** o usuário possui permissão "{{PERMISSAO_CRIAR}}"
**E** está autenticado no sistema
**E** acessa {{CAMINHO_DE_ACESSO}}
**E** clica no botão "Novo {{ENTIDADE}}"

**Quando** preenche os seguintes dados:
  - {{CAMPO_1}}: "{{VALOR_EXEMPLO_1}}"
  - {{CAMPO_2}}: "{{VALOR_EXEMPLO_2}}"
  - {{CAMPO_N}}: "{{VALOR_EXEMPLO_N}}"

**E** clica no botão "Salvar"

**Então** o sistema deve:
  - Exibir a mensagem "{{ENTIDADE}} cadastrado(a) com sucesso"
  - Redirecionar para a tela de listagem de {{ENTIDADE_NO_PLURAL}}
  - Exibir o(a) {{ENTIDADE}} "{{VALOR_IDENTIFICADOR}}" na listagem
  - Registrar o(a) {{ENTIDADE}} com status "Ativo"
  - Registrar data e hora de criação
  - Registrar o usuário criador

---

## Cenário 2: Validação de campos obrigatórios não preenchidos

**Dado que** o usuário está na tela de criação de {{ENTIDADE_NO_PLURAL}}

**Quando** deixa os seguintes campos obrigatórios em branco:
  - {{CAMPO_OBRIGATORIO_1}}
  - {{CAMPO_OBRIGATORIO_2}}
  - {{CAMPO_OBRIGATORIO_N}}

**E** clica no botão "Salvar"

**Então** o sistema deve:
  - Exibir mensagem de erro "Preencha todos os campos obrigatórios"
  - Destacar em vermelho os campos não preenchidos
  - Não criar nenhum registro
  - Manter o foco no primeiro campo obrigatório não preenchido
  - Preservar os dados preenchidos nos demais campos

---

## Cenário 3: Tentativa de cadastro com {{CAMPO_UNICO}} duplicado

<!--
AGENTE: Criar apenas se existir regra de unicidade (ex.: CNPJ, email, código, etc.)
Se não aplicável, EXCLUIR este cenário.
-->

**Dado que** existe um(a) {{ENTIDADE}} cadastrado(a) com {{CAMPO_UNICO}} "{{VALOR_DUPLICADO}}"
**E** o usuário está na tela de criação de {{ENTIDADE_NO_PLURAL}}

**Quando** preenche o campo "{{CAMPO_UNICO}}" com "{{VALOR_DUPLICADO}}"
**E** clica no botão "Salvar"

**Então** o sistema deve:
  - Exibir a mensagem de erro "{{CAMPO_UNICO}} já cadastrado no sistema"
  - Manter o usuário na tela de criação
  - Destacar o campo "{{CAMPO_UNICO}}" em vermelho
  - Preservar os dados preenchidos nos demais campos
  - Não criar nenhum registro no banco de dados

---

## Cenário 4: Validação de formato de {{CAMPO_COM_FORMATO}} inválido

<!--
AGENTE: Criar para campos com formato específico (CNPJ, CPF, email, telefone, CEP, etc.)
Se não aplicável, EXCLUIR este cenário.
-->

**Dado que** o usuário está na tela de criação de {{ENTIDADE_NO_PLURAL}}

**Quando** preenche o campo "{{CAMPO_COM_FORMATO}}" com "{{VALOR_FORMATO_INVALIDO}}"
**E** clica no botão "Salvar"

**Então** o sistema deve:
  - Exibir mensagem de erro "{{CAMPO_COM_FORMATO}} inválido. Utilize o formato: {{FORMATO_ESPERADO}}"
  - Destacar o campo "{{CAMPO_COM_FORMATO}}" em vermelho
  - Não criar nenhum registro
  - Manter o foco no campo "{{CAMPO_COM_FORMATO}}"

---

## Cenário 5: Tentativa de acesso à criação sem permissão

**Dado que** o usuário NÃO possui permissão "{{PERMISSAO_CRIAR}}"
**E** está autenticado no sistema

**Quando** tenta acessar a tela de criação de {{ENTIDADE_NO_PLURAL}}

**Então** o sistema deve:
  - Bloquear o acesso à funcionalidade
  - Exibir a mensagem "Você não possui permissão para criar {{ENTIDADE_NO_PLURAL}}"
  - Redirecionar o usuário para a tela anterior
  - Não exibir o botão "Novo {{ENTIDADE}}" na listagem

---

## Cenário 6: Cancelamento do cadastro descartando alterações

**Dado que** o usuário está na tela de criação de {{ENTIDADE_NO_PLURAL}}
**E** preencheu os seguintes campos:
  - {{CAMPO_1}}: "{{VALOR_EXEMPLO_1}}"
  - {{CAMPO_2}}: "{{VALOR_EXEMPLO_2}}"

**Quando** clica no botão "Cancelar"

**Então** o sistema deve:
  - Descartar todas as alterações não salvas
  - Redirecionar para a tela de listagem de {{ENTIDADE_NO_PLURAL}}
  - Não criar nenhum registro no banco de dados
  - Não exibir mensagem de confirmação (descarte direto)

# Permissões e Regras de Acesso

| Permissão                 | Descrição |
| ------------------------- | --------- |
| {{PERMISSOES_APLICAVEIS}} |           |

<!--
AGENT IA - INSTRUÇÕES DE PREENCHIMENTO PARA PERMISSÕES E REGRAS DE ACESSO

Para instruções COMPLETAS e DETALHADAS sobre permissões, consulte:
📄 ../../prompts/prompt-permissoes-regras-acesso-unificado.md

RESUMO RÁPIDO:
✓ Modelo com permissões (tabela) quando houver controle de acesso
✓ Modelo sem permissões quando acesso é irrestrito
✓ Não listar permissões CRUD sem aplicabilidade
✓ Não confundir controles externos com permissões de usuário
-->

# Histórico de Alterações

<!--
AGENT IA - INSTRUÇÕES DE PREENCHIMENTO PARA HISTÓRICO DE ALTERAÇÕES

Para instruções COMPLETAS e DETALHADAS sobre histórico de alterações, consulte:
📄 ../../prompts/prompt-historico-alteracoes-unificado.md

RESUMO RÁPIDO:
✓ Seção obrigatória
✓ Registrar alterações funcionais/documentais
✓ Descrição objetiva (O QUE mudou)
✓ Data DD/MM/AAAA e Card Jira quando aplicável
-->

| Data          | Card Jira | Autor | Descrição da Alteração |
| ------------- | --------- | ----- | ---------------------- |
| {{HISTORICO}} |           |       |                        |

---

<div align="center">
  <sub><strong>🔒 Documento Confidencial</strong> • Uso Interno</sub>
</div>