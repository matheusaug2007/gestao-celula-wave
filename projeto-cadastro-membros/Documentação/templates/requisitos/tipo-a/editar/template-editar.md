<!--

AGENT IA - INSTRUÇÕES DE PREENCHIMENTO PARA CABEÇALHO

Para instruções COMPLETAS e DETALHADAS sobre o cabeçalho, consulte:
📄 ../prompts/prompt-cabecalho-unificado.md

RESUMO RÁPIDO:
✓ Logo institucional obrigatória (caminho relativo)
✓ 2 separadores --- (abaixo do logo e versão/data)
✓ Breadcrumb: [Módulo: Nome](../../README.md) › **Título**
✓ Título conforme tipo (Ação Entidade ou Substantivo Composto)
✓ Versão X.Y | Data DD/MM/AAAA (ambos em negrito)
✓ Rodapé institucional obrigatório
✓ Checklist completo disponível no prompt centralizado

-->



---

[Módulo: {{MODULO}}](../../README.md) › **Editar {{ENTIDADE_NO_PLURAL}}**

**Versão:** X.Y | **Última atualização:** DD/MM/AAAA

---

# Contextualização

<!--

AGENT IA - INSTRUÇÕES DE PREENCHIMENTO PARA CONTEXTUALIZAÇÃO

Para instruções COMPLETAS e DETALHADAS sobre contextualização, consulte:
📄 ../prompts/prompt-contextualizacao-unificada.md

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
AGENTE:
Descreva de forma objetiva e narrativa a composição da tela de edição,
preparando o leitor para a leitura do detalhamento funcional.

O texto deve:
- Apresentar a tela como um formulário de manutenção de dados existentes.
- Explicar que os dados são carregados previamente.
- Indicar que alguns campos podem ser editáveis e outros apenas para leitura.
- Mencionar as ações principais (ex.: Salvar e Cancelar).
- Não listar campos nem regras específicas.
- Utilizar um único parágrafo curto.

Se houver imagem de protótipo, inserir logo abaixo do texto, utilizando o padrão definido no template.

- Todas as imagens utilizadas nos requisitos devem estar localizadas na pasta `imagens/`,
  no mesmo nível do arquivo do requisito.

- O caminho da imagem deve ser sempre relativo ao próprio arquivo `.md`.

- Utilizar obrigatoriamente o padrão:

  ![Descrição da imagem](./imagens/nome-do-arquivo.png)

- Não utilizar caminhos absolutos ou relativos a outras pastas do repositório
  (ex.: ../../../imagens, /assets, etc.).

- O nome do arquivo da imagem deve ser descritivo, em kebab-case, e refletir
  claramente o conteúdo exibido.

-->

{{DESCRICAO_TELA}}

![{{DESCRICAO_DA_IMAGEM}}](./imagens/{{NOME_DA_IMAGEM}})


## Acesso à Funcionalidade


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

{{DESCRICAO_ACESSO}}


## Carregamento dos Dados

<!--
AGENTE:
Explique como o sistema localiza e carrega os dados do registro selecionado.

Incluir:
- Identificador utilizado para localizar o registro.
- Comportamento esperado ao carregar os dados.
- Tratamento em caso de registro inexistente ou inacessível.
-->

{{DESCRICAO_CARREGAMENTO}}


## Preenchimento e Comportamento do Formulário

<!--
AGENTE:
Descrever o comportamento geral do formulário de edição.

- Informar que os dados são apresentados já preenchidos.
- Explicar que alguns campos são editáveis e outros apenas para leitura.
- Justificar, de forma simples, o motivo de bloqueio dos campos não editáveis.
-->

{{DESCRICAO_FORMULARIO}}


### Campos do Formulário

<!--
AGENTE:
Para cada campo disponível no formulário, informar de forma clara e acessível:

- Nome do campo
- Breve descrição funcional (o que representa no negócio)
- Tipo do campo (ex.: texto, número, data ou lista de opções)
- Editável: sim ou não (com justificativa quando não)
- Obrigatório: sim ou não
- Regras ou comportamentos relevantes

Evitar termos técnicos.
Quando inevitáveis, explicar em linguagem simples.
-->

{{DESCRICAO_CAMPOS}}


## Salvamento da Edição

Ao acionar a ação **Salvar**, o sistema deve validar os dados alterados e persistir as modificações realizadas.

Em caso de sucesso, o sistema deve retornar à tela de origem e exibir a seguinte mensagem ao usuário:

> “{{MENSAGEM_SUCESSO}}”

Caso haja erro de validação, o sistema deve apresentar mensagens claras e orientativas, indicando o motivo do impedimento.


## Cancelamento da Edição

Ao acionar a ação **Cancelar**, o sistema deve descartar todas as alterações não salvas e retornar à tela anterior, sem persistir nenhuma modificação.

## Mensagens e Estados

<!--
AGENT IA - INSTRUÇÕES DE PREENCHIMENTO PARA MENSAGENS E ESTADOS

Para instruções COMPLETAS e DETALHADAS sobre Mensagens e Estados, consulte:
📄 ../prompts/prompt-mensagens-estados-unificado.md

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
📄 ../prompts/prompt-fluxos-navegacao-unificado.md

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

<!--
AGENT IA - INSTRUÇÕES DE PREENCHIMENTO PARA REGRAS E COMPORTAMENTOS DO SISTEMA

Para instruções COMPLETAS e DETALHADAS sobre regras e comportamentos, consulte:
📄 ../prompts/prompt-regras-comportamentos-sistema-unificado.md

RESUMO RÁPIDO:
✓ Regras automáticas e restrições transversais
✓ Não dependem do fluxo visual
✓ Frases no formato "O sistema deve..."
✓ Um comportamento por item
✓ Referenciar Critérios de Aceite quando aplicável
  -->

- {{REGRA_1}}
- {{REGRA_2}}


# Referências do Requisito

<!--
AGENTE DE IA – REFERÊNCIAS DO REQUISITO

Objetivo desta seção:
Centralizar materiais de apoio e dependências funcionais que complementam
o entendimento deste requisito, sem repetir regras já descritas no documento.

Diretrizes obrigatórias:

- Esta seção é OPCIONAL.
- Criar esta seção apenas se houver ao menos UMA referência real.
- Não criar seções vazias.
- Não deixar placeholders, comentários ou blocos não utilizados.
- Sempre incluir um breve texto introdutório contextualizando as referências.
- Utilizar esta seção para:
  - Protótipos de tela
  - Diagramas técnicos ou funcionais
  - Fluxos complementares
  - Requisitos relacionados (dependências entre funcionalidades)
- Não duplicar regras funcionais já descritas no requisito.
- Manter linguagem clara, objetiva e institucional.

-->

{{REFERENCIAS_DO_REQUISITO}}

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

CENÁRIOS MÍNIMOS PARA EDIÇÃO:
1. Edição bem-sucedida com alteração de dados (happy path)
2. Validação de campos obrigatórios removidos
3. Tentativa de edição com dado duplicado (se aplicável)
4. Validação de formato inválido em campos alterados
5. Tentativa de acesso à edição sem permissão
6. Cancelamento descartando alterações
7. Tentativa de edição de campos não editáveis (se aplicável)
-->

## Cenário 1: Edição bem-sucedida de {{ENTIDADE_NO_SINGULAR}} com alteração de dados

**Dado que** o usuário possui permissão "{{PERMISSAO_EDITAR}}"
**E** está autenticado no sistema
**E** acessa a listagem de {{ENTIDADE_NO_PLURAL}}
**E** existe um(a) {{ENTIDADE}} com os seguintes dados:
  - {{CAMPO_1}}: "{{VALOR_ORIGINAL_1}}"
  - {{CAMPO_2}}: "{{VALOR_ORIGINAL_2}}"

**Quando** clica na linha do(a) {{ENTIDADE}} para editar
**E** altera os seguintes campos:
  - {{CAMPO_1}}: "{{VALOR_NOVO_1}}"
  - {{CAMPO_2}}: "{{VALOR_NOVO_2}}"

**E** clica no botão "Salvar"

**Então** o sistema deve:
  - Exibir a mensagem "{{ENTIDADE}} atualizado(a) com sucesso"
  - Redirecionar para a tela de listagem de {{ENTIDADE_NO_PLURAL}}
  - Exibir o(a) {{ENTIDADE}} com os dados atualizados na listagem
  - Preservar os campos não alterados
  - Registrar data e hora da última alteração
  - Registrar o usuário que realizou a alteração

---

## Cenário 2: Validação de campos obrigatórios removidos durante edição

**Dado que** o usuário está editando um(a) {{ENTIDADE}} existente
**E** o(a) {{ENTIDADE}} possui os seguintes campos obrigatórios preenchidos:
  - {{CAMPO_OBRIGATORIO_1}}: "{{VALOR_PREENCHIDO_1}}"
  - {{CAMPO_OBRIGATORIO_2}}: "{{VALOR_PREENCHIDO_2}}"

**Quando** remove o valor dos seguintes campos obrigatórios:
  - {{CAMPO_OBRIGATORIO_1}}
  - {{CAMPO_OBRIGATORIO_2}}

**E** clica no botão "Salvar"

**Então** o sistema deve:
  - Exibir mensagem de erro "Preencha todos os campos obrigatórios"
  - Destacar em vermelho os campos não preenchidos
  - Não persistir nenhuma alteração
  - Manter o foco no primeiro campo obrigatório não preenchido
  - Preservar os dados alterados nos demais campos

---

## Cenário 3: Tentativa de edição com {{CAMPO_UNICO}} duplicado

<!--
AGENTE: Criar apenas se existir regra de unicidade (ex.: CNPJ, email, código, etc.)
Se não aplicável, EXCLUIR este cenário.
-->

**Dado que** existem dois {{ENTIDADE_NO_PLURAL}} cadastrados:
  - {{ENTIDADE}} A com {{CAMPO_UNICO}} "{{VALOR_A}}"
  - {{ENTIDADE}} B com {{CAMPO_UNICO}} "{{VALOR_B}}"

**E** o usuário está editando o(a) {{ENTIDADE}} A

**Quando** tenta alterar o {{CAMPO_UNICO}} de "{{VALOR_A}}" para "{{VALOR_B}}"
**E** clica no botão "Salvar"

**Então** o sistema deve:
  - Exibir a mensagem de erro "{{CAMPO_UNICO}} já cadastrado no sistema"
  - Manter o usuário na tela de edição
  - Destacar o campo "{{CAMPO_UNICO}}" em vermelho
  - Preservar os dados preenchidos nos demais campos
  - Não persistir nenhuma alteração

---

## Cenário 4: Validação de formato de {{CAMPO_COM_FORMATO}} inválido durante edição

<!--
AGENTE: Criar para campos com formato específico (CNPJ, CPF, email, telefone, CEP, etc.)
Se não aplicável, EXCLUIR este cenário.
-->

**Dado que** o usuário está editando um(a) {{ENTIDADE}} existente

**Quando** altera o campo "{{CAMPO_COM_FORMATO}}" para "{{VALOR_FORMATO_INVALIDO}}"
**E** clica no botão "Salvar"

**Então** o sistema deve:
  - Exibir mensagem de erro "{{CAMPO_COM_FORMATO}} inválido. Utilize o formato: {{FORMATO_ESPERADO}}"
  - Destacar o campo "{{CAMPO_COM_FORMATO}}" em vermelho
  - Não persistir nenhuma alteração
  - Manter o foco no campo "{{CAMPO_COM_FORMATO}}"

---

## Cenário 5: Tentativa de acesso à edição sem permissão

**Dado que** o usuário NÃO possui permissão "{{PERMISSAO_EDITAR}}"
**E** está autenticado no sistema
**E** acessa a listagem de {{ENTIDADE_NO_PLURAL}}

**Quando** clica em uma linha da listagem

**Então** o sistema deve:
  - Abrir o formulário em modo visualização (somente leitura)
  - Não exibir o botão "Salvar"
  - Desabilitar todos os campos de entrada
  - Exibir indicação visual de que está em modo visualização

---

## Cenário 6: Cancelamento da edição descartando alterações

**Dado que** o usuário está editando um(a) {{ENTIDADE}} existente
**E** o(a) {{ENTIDADE}} possui originalmente:
  - {{CAMPO_1}}: "{{VALOR_ORIGINAL_1}}"
  - {{CAMPO_2}}: "{{VALOR_ORIGINAL_2}}"

**E** alterou os campos para:
  - {{CAMPO_1}}: "{{VALOR_NOVO_1}}"
  - {{CAMPO_2}}: "{{VALOR_NOVO_2}}"

**Quando** clica no botão "Cancelar"

**Então** o sistema deve:
  - Descartar todas as alterações não salvas
  - Redirecionar para a tela de listagem de {{ENTIDADE_NO_PLURAL}}
  - Manter o(a) {{ENTIDADE}} com os dados originais
  - Não persistir nenhuma alteração no banco de dados

---

## Cenário 7: Tentativa de edição de campo não editável

<!--
AGENTE: Criar apenas se existirem campos que não podem ser editados após criação
(ex.: CNPJ, código identificador, data de criação, etc.)
Se não aplicável, EXCLUIR este cenário.
-->

**Dado que** o usuário está editando um(a) {{ENTIDADE}} existente
**E** o campo "{{CAMPO_NAO_EDITAVEL}}" não pode ser alterado após a criação

**Quando** acessa o formulário de edição

**Então** o sistema deve:
  - Exibir o campo "{{CAMPO_NAO_EDITAVEL}}" desabilitado (somente leitura)
  - Exibir o valor atual do campo
  - Não permitir alteração do campo
  - Permitir edição dos demais campos editáveis


# Permissões e Regras de Acesso

| Permissão            | Descrição |
| -------------------- | --------- |
| {{PERMISSAO_EDITAR}} |           |


# Histórico de Alterações

| Data | Card Jira | Autor | Descrição |
| ---- | --------- | ----- | --------- |

---

<div align="center">
  <sub><strong>🔒 Documento Confidencial</strong> • Uso Interno</sub>
</div>
<br>
