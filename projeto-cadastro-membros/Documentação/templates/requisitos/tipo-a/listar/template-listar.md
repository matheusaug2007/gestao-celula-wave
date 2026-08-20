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

---

[Módulo: {{NOME_DO_MODULO}}](../../README.md) › **{{NOME_DO_REQUISITO}}**

**Versão:** {{VERSAO}} | **Última atualização:** {{DATA}}

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

{{DESCRICAO_CONTEXTO}}

# Detalhamento Funcional

<!--
AGENTE:
Descreva de forma objetiva e narrativa a composição da tela, preparando o leitor para a leitura do detalhamento funcional.

O texto deve:
- Apresentar a tela como um todo, explicando sua estrutura geral (ex.: filtros e listagem paginada).
- Indicar o propósito da tela do ponto de vista do usuário.
- Mencionar de forma breve os principais elementos visuais, sem antecipar regras detalhadas.
- Não listar campos, filtros ou comportamentos específicos (estes serão detalhados nas seções seguintes).
- Utilizar texto corrido, em um único parágrafo curto, com linguagem clara e institucional.

Se houver imagem de protótipo, inserir logo abaixo do texto, utilizando o padrão definido no template.

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

## Consulta e Listagem de {{ENTIDADE}}

### Acesso à Funcionalidade

<!--
AGENTE:
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

## Comportamento de Consulta e Filtragem

<!--
AGENTE:
Se existir separação entre filtros gerais e específicos, detalhar ambos.
Se não existir, remova a subseção que não se aplica e mantenha apenas "Filtros".
Não invente filtros: peça ao PO a lista de filtros e os comportamentos.
-->

### Filtros Gerais

<!--
AGENTE:
Utilize esta seção sempre que a tela possuir uma **barra de busca inteligente** baseada na criação de pares (campo + valor).

Na explicação, deixe claro e de forma objetiva:

- Como o usuário inicia a busca (digitação do valor).
- Em que momento o sistema apresenta os campos disponíveis para associação.
- Como o par de busca (campo + valor) é criado.
- Se o valor pode ou não ser editado após a criação do par.
- Se o mecanismo permite a criação de múltiplos pares de busca.
- Qual operador lógico é aplicado entre os pares (E / OU).
- Se a ordem de inclusão dos pares altera ou não o resultado da busca.
- Quais tipos de comparação são aplicados (ex.: igualdade, contém, inicia com), utilizando linguagem funcional e acessível.
- Quais campos estão disponíveis para uso neste mecanismo.
- Se existe algum filtro obrigatório ou se todos os filtros são opcionais.

Utilizar linguagem clara e orientada ao comportamento do usuário, evitando termos técnicos.
-->

{{DESCRICAO_FILTROS_GERAIS}}

#### Campos disponíveis

<!--
AGENTE:
Para cada campo ou filtro disponível, descrever obrigatoriamente no formato abaixo,
mantendo linguagem clara, funcional e institucional.

Estrutura obrigatória:

1. Nome do filtro em negrito, seguido de uma breve descrição em texto corrido,
   explicando:
   - o que o filtro representa;
   - como ele restringe ou influencia o resultado da busca.

2. Em seguida, listar apenas os atributos aplicáveis:

- Tipo: informar o tipo do campo (ex.: texto, númerico, lista suspensa, intervalo de datas).
- Critério: descrever a forma de comparação utilizada na busca, em linguagem simples
  (ex.: igualdade, contém, intervalo).
- Observações: utilizar apenas quando houver necessidade de complementar a explicação,
  registrar exceções, comportamentos específicos ou particularidades que não couberam
  na descrição principal.

Regras obrigatórias:
- A descrição inicial deve concentrar o entendimento principal do filtro.
- Não repetir na descrição informações que já estejam explícitas nos atributos.
- O item "Observações" só deve ser incluído quando for realmente necessário.
- Evitar termos técnicos sempre que possível.
- Quando um termo técnico for indispensável, explicá-lo de forma simples.

-->

<!--
AGENTE:
Informar explicitamente se todos os filtros são opcionais.
-->

### Filtros Específicos

Os filtros específicos devem ser exibidos abaixo da barra de filtros gerais, utilizando componentes visuais adequados ao tipo de dado, com foco em usabilidade e redução de erro de entrada.

<!--
AGENTE:
Use esta seção quando houver filtros com componentes visuais específicos (select, datepicker, checkbox).
Para cada filtro, deixar claro:

- Tipo do componente
- Valores disponíveis
- Se permite seleção única ou múltipla
- Valor padrão (se houver)
- Comportamento ao selecionar "Todos" (se aplicável)
- Atualização automática da listagem (on change) vs botão "Buscar"
- Combinação entre filtros (operador lógico E)
-->

#### Filtros disponíveis (Filtros Específicos)

- **{{NOME_FILTRO_1}}**
  - Tipo: {{COMPONENTE}}
  - Valores disponíveis: {{VALORES}}
  - Seleção: {{UNICA_OU_MULTIPLA}}
  - Valor padrão: {{DEFAULT_SE_HOUVER}}
  - Comportamento: {{REGRAS}}

- **{{NOME_FILTRO_2}}**
  - Tipo: {{COMPONENTE}}
  - Valores disponíveis: {{VALORES}}
  - Seleção: {{UNICA_OU_MULTIPLA}}
  - Valor padrão: {{DEFAULT_SE_HOUVER}}
  - Comportamento: {{REGRAS}}

#### Comportamento geral dos filtros

<!--
AGENTE:
Consolidar regras gerais:
- Integração entre filtros gerais e específicos
- Reaplicação automática
- Reset/limpar filtros (se existe)
- Persistência de filtros (se existe)
-->

{{REGRAS_GERAIS_FILTROS}}

## Estrutura da Listagem

<!--
AGENTE:
Listar colunas exibidas, ordenação padrão e comportamento de ordenação por coluna.
Não inventar colunas: peça ao PO.
-->

### Colunas

- {{COLUNA_1}}
- {{COLUNA_2}}
- {{COLUNA_3}}



<!--
AGENTE:
Após a última coluna, descrever a ordenação padrão da listagem em **texto corrido**, de forma clara,
objetiva e institucional.

O texto deve obrigatoriamente informar:
- qual é o campo utilizado como ordenação padrão;
- a direção da ordenação (ascendente ou descendente);
- eventuais observações relevantes (ex.: critério secundário, comportamento em empates),
  apenas quando aplicável.

Evitar listas, bullets ou enumerações.
Utilizar linguagem funcional, com uso de **negrito** apenas para destacar o campo
principal de ordenação.
-->

### Paginação

<!--
AGENTE:
Descrever paginação e tamanhos por página.
-->

- A listagem deve ser paginada.
- Opções de registros por página: {{OPCOES_EX: 10, 25, 50, 100}}.
- A ordenação deve ser alterável pelo cabeçalho das colunas:
  - **Primeiro clique**: ordena a coluna em ordem crescente (A-Z, 0-9, mais antigo para mais recente).
  - **Segundo clique** na mesma coluna: inverte para ordem decrescente (Z-A, 9-0, mais recente para mais antigo).
  - **Terceiro clique** na mesma coluna: remove a ordenação e retorna à ordenação padrão.
  - Ao clicar em outra coluna, a nova coluna passa a ser o critério de ordenação principal.
  - O sistema deve exibir indicador visual (seta ou ícone) ao lado do nome da coluna indicando a direção da ordenação aplicada.
- Comportamento ao mudar página/tamanho: {{REGRAS}}

## Navegação e Ações

<!--
AGENTE:
Descrever as ações disponíveis diretamente na listagem.
Deixar claro:
- Quais ações exigem abertura de formulário
- Quais ações são executadas diretamente na listagem
- Que todas as ações respeitam permissões e não devem ser exibidas sem permissão
-->


Ao dar **duplo clique** em uma linha da listagem:
- Se o usuário possuir permissão `{{PERMISSAO_EDITAR}}`, o sistema deve abrir o formulário em modo **edição**.
- Caso contrário, o sistema deve abrir o formulário em modo **visualização**.

- O botão **{{NOME_BOTAO_NOVO}}** deve ser exibido apenas para usuários com permissão `{{PERMISSAO_CADASTRAR}}`.

- As ações por linha devem ser exibidas em um menu de ações (ex.: três pontos), localizado ao final de cada linha da listagem.

### Ações disponíveis na listagem

<!--
AGENTE:
Para cada ação, indicar:
- Se é executada diretamente na listagem ou se abre formulário
- Qual permissão controla a ação
- Qual impacto esperado no registro

- Se não existir a ação, excluir


-->

- **Editar**
  - Tipo: abre formulário de edição
  - Permissão: `{{PERMISSAO_EDITAR}}`
  - Comportamento:
    - Abre o formulário em modo edição com os dados do registro selecionado.
    - Se o usuário não possuir a permissão, esta opção não deve ser exibida.

- **Excluir**
  - Tipo: ação direta na listagem
  - Permissão: `{{PERMISSAO_EXCLUIR}}`
  - Comportamento:
    - Remove definitivamente o registro, respeitando regras de vínculo impeditivo, quando aplicável.

- **Inativar / Ativar**
  - Tipo: ação direta na listagem
  - Permissão: `{{PERMISSAO_INATIVAR}}`
  - Comportamento:
    - Quando o registro estiver **Ativo**, o sistema deve apresentar a ação **Inativar**.
    - Quando o registro estiver **Inativo**, o sistema deve apresentar a ação **Ativar**.
    - A ação deve apenas alterar o status do registro, sem abrir o formulário de edição.
    - O status exibido na listagem deve ser atualizado imediatamente após a execução da ação.

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
AGENTE:
Para instruções COMPLETAS e DETALHADAS sobre cenários BDD, consulte:
📄 ../prompts/prompt-cenarios-comportamento-bdd.md

Regras obrigatórias:
- Usar formato Given-When-Then (Dado que-Quando-Então)
- Dados CONCRETOS (não placeholders genéricos)
- Um cenário = um comportamento específico
- Títulos descritivos

CENÁRIOS MÍNIMOS PARA LISTAGEM:
1. Listagem inicial com ordenação padrão (happy path)
2. Filtragem com resultado único ou múltiplo
3. Filtragem sem resultados (lista vazia)
4. Tentativa de acesso sem permissão
5. Ordenação por coluna
6. Paginação e navegação entre páginas
7. Ações: Inativar/Ativar, Excluir (quando aplicável)
8. Abertura para edição vs visualização (baseado em permissão)
-->

## Cenário 1: Tentativa de acesso à listagem sem permissão

**Dado que** o usuário NÃO possui permissão "{{PERMISSAO_VISUALIZAR}}"
**E** está autenticado no sistema

**Quando** tenta acessar o menu "{{CAMINHO_MENU}}"

**Então** o sistema deve:
  - Bloquear o acesso à funcionalidade
  - Exibir mensagem "Você não possui permissão para visualizar {{ENTIDADE_NO_PLURAL}}"
  - Não exibir a opção "{{NOME_MENU}}" no menu
  - Manter o usuário na tela atual

**E quando** o usuário tenta acessar a funcionalidade diretamente via URL

**Então** o sistema deve:
  - Bloquear o acesso à funcionalidade
  - Exibir mensagem "Você não possui permissão para visualizar {{ENTIDADE_NO_PLURAL}}"
  - Redirecionar ou manter o usuário na tela anterior

---

## Cenário 2: Listagem inicial com ordenação padrão

**Dado que** o usuário possui permissão "{{PERMISSAO_VISUALIZAR}}"
**E** está autenticado no sistema
**E** existem {{QUANTIDADE_EXEMPLO}} {{ENTIDADE_NO_PLURAL}} cadastrados no sistema

**Quando** acessa o menu "{{CAMINHO_MENU}}"

**Então** o sistema deve:
  - Exibir a listagem de {{ENTIDADE_NO_PLURAL}}
  - Aplicar ordenação por "{{CAMPO_ORDENACAO_PADRAO}}" em ordem {{CRESCENTE_OU_DECRESCENTE}}
  - Exibir {{REGISTROS_POR_PAGINA_PADRAO}} registros na primeira página
  - Exibir as colunas: {{LISTA_COLUNAS}}
  - Exibir indicador de paginação mostrando "Página 1 de {{TOTAL_PAGINAS}}"

---

## Cenário 3: Filtragem por {{CAMPO_FILTRO}} com resultado único

**Dado que** o usuário está na tela de listagem de {{ENTIDADE_NO_PLURAL}}
**E** existem múltiplos {{ENTIDADE_NO_PLURAL}} cadastrados

**Quando** utiliza o filtro geral digitando "{{VALOR_FILTRO_EXEMPLO}}" no campo de busca
**E** seleciona o campo "{{CAMPO_FILTRO}}" na lista de campos disponíveis

**Então** o sistema deve:
  - Criar o par de busca "{{CAMPO_FILTRO}} = {{VALOR_FILTRO_EXEMPLO}}"
  - Exibir apenas o(a) {{ENTIDADE}} com {{CAMPO_FILTRO}} "{{VALOR_FILTRO_EXEMPLO}}"
  - Exibir contador "1 registro encontrado"
  - Manter o par de busca visível na barra de filtros

---

## Cenário 4: Filtragem sem resultados correspondentes

**Dado que** o usuário está na tela de listagem de {{ENTIDADE_NO_PLURAL}}

**Quando** aplica um filtro que não corresponde a nenhum registro cadastrado
**E** o campo "{{CAMPO_FILTRO}}" é preenchido com "{{VALOR_INEXISTENTE}}"

**Então** o sistema deve:
  - Exibir a mensagem "Nenhum resultado encontrado"
  - Não exibir a grid de listagem
  - Manter os filtros aplicados visíveis
  - Permitir que o usuário remova ou altere os filtros

---

## Cenário 5: Ordenação por coluna {{NOME_COLUNA}}

**Dado que** o usuário está na tela de listagem com múltiplos {{ENTIDADE_NO_PLURAL}}

**Quando** clica no cabeçalho da coluna "{{NOME_COLUNA}}"

**Então** o sistema deve:
  - Reordenar a listagem por "{{NOME_COLUNA}}" em ordem crescente
  - Exibir indicador visual de ordenação ascendente na coluna "{{NOME_COLUNA}}"
  - Manter os filtros aplicados (se houver)
  - Retornar para a primeira página da listagem

---

## Cenário 6: Alternância de ordenação crescente e decrescente

**Dado que** o usuário está na tela de listagem com múltiplos {{ENTIDADE_NO_PLURAL}}
**E** a listagem está ordenada por "{{NOME_COLUNA}}" em ordem crescente

**Quando** clica novamente no cabeçalho da coluna "{{NOME_COLUNA}}"

**Então** o sistema deve:
  - Reordenar a listagem por "{{NOME_COLUNA}}" em ordem decrescente
  - Exibir indicador visual de ordenação descendente na coluna "{{NOME_COLUNA}}"
  - Manter os filtros aplicados (se houver)
  - Retornar para a primeira página da listagem

---

## Cenário 7: Navegação entre páginas da listagem

**Dado que** o usuário está na tela de listagem
**E** existem {{TOTAL_REGISTROS}} {{ENTIDADE_NO_PLURAL}} cadastrados
**E** a listagem exibe {{REGISTROS_POR_PAGINA}} registros por página

**Quando** clica no botão "Próxima página"

**Então** o sistema deve:
  - Exibir os próximos {{REGISTROS_POR_PAGINA}} registros
  - Atualizar o indicador de paginação para "Página 2 de {{TOTAL_PAGINAS}}"
  - Manter a ordenação aplicada
  - Manter os filtros aplicados (se houver)

---

## Cenário 8: Ação de inativar {{ENTIDADE_NO_SINGULAR}} ativo

<!--
AGENTE: Criar apenas se a funcionalidade possuir ação Inativar/Ativar
Se não aplicável, EXCLUIR este cenário.
-->

**Dado que** o usuário possui permissão "{{PERMISSAO_INATIVAR}}"
**E** está na listagem de {{ENTIDADE_NO_PLURAL}}
**E** existe um(a) {{ENTIDADE}} "{{NOME_EXEMPLO}}" com status "Ativo"

**Quando** clica no menu de ações (três pontos) da linha do(a) {{ENTIDADE}}
**E** seleciona a ação "Inativar"

**Então** o sistema deve:
  - Alterar o status do(a) {{ENTIDADE}} para "Inativo"
  - Atualizar a coluna "Status" da listagem exibindo "Inativo"
  - Exibir mensagem "{{ENTIDADE}} inativado(a) com sucesso"
  - Manter o(a) {{ENTIDADE}} visível na listagem
  - Alterar a ação disponível de "Inativar" para "Ativar"
  - Registrar data/hora da inativação e usuário responsável

---

## Cenário 9: Ação de ativar {{ENTIDADE_NO_SINGULAR}} inativo

<!--
AGENTE: Criar apenas se a funcionalidade possuir ação Inativar/Ativar
Se não aplicável, EXCLUIR este cenário.
-->

**Dado que** o usuário possui permissão "{{PERMISSAO_INATIVAR}}"
**E** está na listagem de {{ENTIDADE_NO_PLURAL}}
**E** existe um(a) {{ENTIDADE}} "{{NOME_EXEMPLO}}" com status "Inativo"

**Quando** clica no menu de ações (três pontos) da linha do(a) {{ENTIDADE}}
**E** seleciona a ação "Ativar"

**Então** o sistema deve:
  - Alterar o status do(a) {{ENTIDADE}} para "Ativo"
  - Atualizar a coluna "Status" da listagem exibindo "Ativo"
  - Exibir mensagem "{{ENTIDADE}} ativado(a) com sucesso"
  - Manter o(a) {{ENTIDADE}} visível na listagem
  - Alterar a ação disponível de "Ativar" para "Inativar"
  - Registrar data/hora da ativação e usuário responsável

---

## Cenário 10: Abertura de {{ENTIDADE_NO_SINGULAR}} em modo edição via duplo clique

**Dado que** o usuário possui permissão "{{PERMISSAO_EDITAR}}"
**E** está na listagem de {{ENTIDADE_NO_PLURAL}}

**Quando** dá duplo clique em uma linha da listagem

**Então** o sistema deve:
  - Abrir o formulário de edição do(a) {{ENTIDADE}}
  - Exibir todos os campos preenchidos com os dados atuais
  - Exibir o botão "Salvar"
  - Permitir alteração dos campos editáveis

---

## Cenário 11: Abertura de {{ENTIDADE_NO_SINGULAR}} em modo edição via menu de ações

**Dado que** o usuário possui permissão "{{PERMISSAO_EDITAR}}"
**E** está na listagem de {{ENTIDADE_NO_PLURAL}}

**Quando** clica no menu de ações (três pontos) da linha do(a) {{ENTIDADE}}
**E** seleciona a opção "Editar"

**Então** o sistema deve:
  - Abrir o formulário de edição do(a) {{ENTIDADE}}
  - Exibir todos os campos preenchidos com os dados atuais
  - Exibir o botão "Salvar"
  - Permitir alteração dos campos editáveis

---

## Cenário 12: Abertura de {{ENTIDADE_NO_SINGULAR}} em modo visualização via duplo clique

**Dado que** o usuário NÃO possui permissão "{{PERMISSAO_EDITAR}}"
**E** possui permissão "{{PERMISSAO_VISUALIZAR}}"
**E** está na listagem de {{ENTIDADE_NO_PLURAL}}

**Quando** dá duplo clique em uma linha da listagem

**Então** o sistema deve:
  - Abrir o formulário em modo visualização (somente leitura)
  - Exibir todos os campos com os dados atuais
  - Não exibir o botão "Salvar"
  - Desabilitar todos os campos de entrada
  - Exibir indicação visual de que está em modo visualização
  - Não exibir a opção "Editar" no menu de ações

---

## Cenário 13: Exibição do botão "Novo {{ENTIDADE}}" para usuário com permissão

**Dado que** o usuário possui permissão "{{PERMISSAO_CADASTRAR}}"
**E** está na listagem de {{ENTIDADE_NO_PLURAL}}

**Quando** a tela é carregada

**Então** o sistema deve:
  - Exibir o botão "Novo {{ENTIDADE}}" visível e habilitado
  - Permitir que o usuário clique no botão para criar novo(a) {{ENTIDADE}}

---

## Cenário 14: Ocultação do botão "Novo {{ENTIDADE}}" para usuário sem permissão

**Dado que** o usuário NÃO possui permissão "{{PERMISSAO_CADASTRAR}}"
**E** possui permissão "{{PERMISSAO_VISUALIZAR}}"
**E** está na listagem de {{ENTIDADE_NO_PLURAL}}

**Quando** a tela é carregada

**Então** o sistema deve:
  - Não exibir o botão "Novo {{ENTIDADE}}"
  - Permitir apenas visualização dos registros existentes

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
<br>
