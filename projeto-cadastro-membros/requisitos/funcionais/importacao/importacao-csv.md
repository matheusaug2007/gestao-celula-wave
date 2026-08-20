---

[Módulo: Importação](../../README.md) › **Importação de Base via CSV**

**Versão:** 0.2 | **Última atualização:** 30/04/2026

---

# Contextualização

A importação de base via CSV é a funcionalidade de onboarding que permite à secretaria carregar de uma vez toda a base de membros existente da congregação, sem necessidade de cadastrar cada pessoa manualmente.

Toda igreja que adota a plataforma já possui registros de membros — em planilhas, cadernos ou sistemas anteriores. Sem um mecanismo de importação em lote, o processo de implantação se tornaria inviável: centenas de cadastros manuais representam horas de trabalho e alto risco de erros de digitação.

A funcionalidade é projetada para ser transparente e segura: o usuário baixa um template com as colunas exatas esperadas, preenche com a base existente, faz o upload e recebe uma prévia linha a linha antes de confirmar qualquer inserção. Linhas com problema são destacadas com clareza, permitindo que o usuário decida importar apenas as válidas ou corrigir o arquivo e reimportar tudo.

É utilizada pela secretaria na fase de implantação e também em eventuais integrações de novas bases (ex.: fusão de congregações).

---

# Detalhamento Funcional

## Acesso à Funcionalidade

O usuário acessa a importação pelo menu principal, em **Importação** ou equivalente. A tela apresenta as etapas do processo de forma sequencial.

## Etapa 1 — Download do Template

A tela oferece o botão **"Baixar template CSV"**. O arquivo baixado é um único arquivo `.csv` com a seguinte estrutura:

- **Linhas de exemplo (primeiras linhas):** 2 a 3 linhas de dados fictícios precedem o cabeçalho. Cada linha de exemplo contém o texto `EXEMPLO` na primeira coluna, indicando visualmente que devem ser apagadas antes de preencher. Ao menos um exemplo de líder de célula (com múltiplas células, se aplicável) e um exemplo de membro simples são incluídos.
- **Linha de cabeçalho:** segue imediatamente após os exemplos, com todas as colunas nomeadas em linguagem clara (sem abreviações ou termos técnicos).
- **Linhas de dados:** o usuário preenche abaixo do cabeçalho após apagar os exemplos.

O sistema ignora automaticamente linhas onde a primeira coluna contenha o texto `EXEMPLO` durante o processamento do upload.

### Colunas do template

| Coluna | Obrigatório | Formato | Observação |
|--------|-------------|---------|------------|
| Nome completo | Sim | Texto | — |
| Telefone | Sim | `(##) # ####-####` ou apenas dígitos | Normalizado automaticamente |
| Data de nascimento | Sim | `DD/MM/AAAA` | — |
| Data de ingresso | Sim | `DD/MM/AAAA` | — |
| Tipo de ingresso | Sim | `Batismo` ou `Recepção` | Normalizado automaticamente (case-insensitive, acento opcional) |
| Rua | Sim | Texto | — |
| Número | Sim | Texto | — |
| Complemento | Não | Texto | — |
| Bairro | Sim | Texto | — |
| Cidade | Sim | Texto | — |
| É líder de célula | Sim | `Sim` ou `Não` | Normalizado automaticamente (case-insensitive) |
| Número da célula | Sim se líder | Número inteiro (`1`, `2`, `3`…) | Identifica qual célula do líder a linha descreve. Líderes com múltiplas células aparecem em múltiplas linhas com o mesmo número da célula diferente. |
| Dia da célula | Sim se líder | `Segunda` / `Terça` / `Quarta` / `Quinta` / `Sexta` / `Sábado` / `Domingo` | Normalizado automaticamente |
| Horário da célula | Sim se líder | `HH:MM` | — |
| Tipos da célula | Sim se líder | `Kids`, `Teens`, `Adolescente`, `Adulto` (separados por vírgula se múltiplos) | Ex: `Adulto` ou `Adulto,Teens` |
| Endereço da célula — Rua | Sim se líder | Texto (ou `mesmo` para usar endereço residencial) | — |
| Endereço da célula — Número | Sim se líder | Texto (ou `mesmo`) | — |
| Endereço da célula — Complemento | Não | Texto | — |
| Endereço da célula — Bairro | Sim se líder | Texto (ou `mesmo`) | — |
| Endereço da célula — Cidade | Sim se líder | Texto (ou `mesmo`) | — |
| Nome do líder (discipulado por) | Sim | Texto | Deve corresponder a um nome presente no arquivo ou já cadastrado no sistema |

## Etapa 2 — Upload do Arquivo

O usuário seleciona e envia o arquivo CSV preenchido. O sistema aceita apenas arquivos com extensão `.csv`. Após o upload, o sistema processa o arquivo e exibe a **prévia de validação**.

## Etapa 3 — Prévia com Validação Linha a Linha

O sistema exibe uma tabela com todas as linhas do arquivo, com as seguintes informações por linha:

- **Número da linha** (referência ao arquivo original)
- **Nome do membro**
- **Status de validação**: `✓ Válida` ou `✗ Inválida`
- **Descrição do erro** (exibida somente para linhas inválidas, com clareza sobre o que está errado)

### Linhas inválidas

Linhas com erro são exibidas normalmente na prévia — não são ocultadas — com destaque visual diferenciado (ex.: fundo vermelho claro ou ícone de alerta) e a descrição do problema. O usuário vê exatamente qual linha falhou e por quê.

Linhas inválidas são bloqueadas para importação: não podem ser selecionadas nem importadas independentemente das outras.

### Tipos de erro detectados por linha

| Erro | Descrição exibida ao usuário |
|------|------------------------------|
| Campo obrigatório ausente | "Campo [nome do campo] é obrigatório e está vazio." |
| Formato de data inválido | "Data de nascimento em formato inválido. Use DD/MM/AAAA." |
| Tipo de ingresso inválido | "Tipo de ingresso deve ser 'Batismo' ou 'Recepção'." |
| Líder referenciado não encontrado | "O líder '[nome]' não foi encontrado no arquivo nem no sistema." |
| Nome de líder ambíguo | "Múltiplos líderes encontrados com o nome '[nome]'. Corrija o arquivo para que o nome do líder seja único." |
| Campos de célula ausentes para líder | "Membro marcado como líder requer Dia, Horário, Tipos e Endereço da célula." |
| Tipo de célula inválido | "Tipo de célula inválido: '[valor]'. Use Kids, Teens, Adolescente ou Adulto." |
| Possível duplicata | "Possível duplicata: já existe um membro com o nome '[nome]' e data de nascimento '[data]' no sistema." |

### Resumo da prévia

Acima da tabela, o sistema exibe um resumo:

- Total de linhas no arquivo
- Total de linhas válidas
- Total de linhas inválidas

### Opções disponíveis na prévia

O usuário pode escolher entre duas ações:

- **"Importar apenas as linhas válidas"** — confirma a importação somente das linhas sem erro; linhas inválidas são ignoradas
- **"Cancelar"** — descarta o upload; o usuário pode corrigir o arquivo e reimportar

Não há opção de editar linhas diretamente na prévia — correções devem ser feitas no arquivo original.

## Etapa 4 — Processamento da Importação

Ao confirmar, o sistema processa a importação das linhas válidas em duas passagens:

1. **Primeira passagem:** processa e cadastra todos os membros marcados como **líderes de célula**. Para líderes com múltiplas linhas (representando múltiplas células), o sistema cria **um único registro de membro** e associa **múltiplas células** a ele com base nas linhas agrupadas por nome + data de nascimento.

2. **Segunda passagem:** processa os demais membros, vinculando-os ao líder identificado pelo campo "Nome do líder (discipulado por)", já cadastrado na primeira passagem ou já existente no sistema.

Essa ordem elimina a dependência de sequência das linhas no arquivo: o usuário não precisa colocar os líderes antes dos membros.

## Etapa 5 — Resumo Pós-Importação

Após a conclusão, o sistema exibe um resumo da operação:

- Total de registros importados com sucesso
- Total de registros ignorados (linhas inválidas)
- Lista das linhas ignoradas, com o número da linha e a descrição do erro

O usuário pode baixar um relatório da importação (lista de erros) para usar como guia na correção do arquivo.

---

# Mensagens e Estados

- **Arquivo em formato inválido**
  - **Condição:** Usuário tenta fazer upload de arquivo que não é `.csv`
  - **Comportamento do sistema:** Rejeita o arquivo antes do processamento
  - **Mensagem exibida:** "Formato de arquivo inválido. Envie um arquivo .csv."

- **Arquivo vazio**
  - **Condição:** O arquivo CSV enviado não contém nenhuma linha de dados (apenas o cabeçalho)
  - **Comportamento do sistema:** Exibe aviso e não prossegue para a prévia
  - **Mensagem exibida:** "O arquivo enviado não contém dados para importar."

- **Todas as linhas inválidas**
  - **Condição:** Nenhuma linha do arquivo passou na validação
  - **Comportamento do sistema:** Exibe a prévia com todas as linhas marcadas como inválidas; desabilita o botão "Importar apenas as linhas válidas"
  - **Mensagem exibida:** "Nenhuma linha válida encontrada. Corrija o arquivo e tente novamente."

- **Importação concluída com sucesso total**
  - **Condição:** Todas as linhas foram importadas sem erro
  - **Mensagem exibida:** "[N] membros importados com sucesso. Nenhum erro encontrado."

- **Importação concluída com erros parciais**
  - **Condição:** Parte das linhas foi importada; outras foram ignoradas
  - **Mensagem exibida:** "[N] membros importados com sucesso. [M] linhas ignoradas por erro."

---

# Fluxos Relacionados e Navegação

## Fluxos Posteriores

- **[Listar Membros](../membros/listar-membros.md)**
  Após a importação, os membros cadastrados passam a aparecer na listagem de membros.

- **[Listar Células](../celulas/listar-celulas.md)**
  Líderes importados passam a aparecer como células na listagem de células.

---

# Regras e Comportamentos do Sistema

- O sistema deve processar líderes de célula antes dos membros simples, em duas passagens, eliminando a dependência de ordem das linhas no arquivo.

- O sistema deve agrupar múltiplas linhas de um mesmo líder (mesmo nome + data de nascimento) em um único registro de membro com múltiplas células associadas durante a primeira passagem.

- O sistema deve detectar possíveis duplicatas comparando **nome completo + data de nascimento** com registros já existentes no banco de dados. Duplicatas detectadas são sinalizadas como erro na prévia e não são importadas.

- O sistema deve normalizar automaticamente os valores dos campos antes de validar: maiúsculas/minúsculas são ignoradas, acentos em campos de seleção são opcionais (ex: `batismo`, `BATISMO`, `Batismo` são todos aceitos; `Recepcao` é aceito como `Recepção`; `sim`/`SIM`/`Sim` são aceitos).

- O sistema deve sinalizar erro quando o nome do líder referenciado corresponder a mais de um registro (no arquivo ou no sistema), exigindo que o usuário corrija o arquivo para que o nome do líder seja único.

- O sistema deve detectar duplicatas **tanto** entre linhas do próprio arquivo **quanto** em relação ao banco de dados. A primeira ocorrência de um membro no arquivo é tratada como nova entrada; ocorrências subsequentes no mesmo arquivo com o mesmo nome completo e data de nascimento são sinalizadas como duplicata e bloqueadas para importação.

- O sistema deve ignorar automaticamente as linhas de exemplo do template (identificadas pelo texto `EXEMPLO` na primeira coluna) sem sinalizá-las como erro.

- O sistema deve aplicar na importação as mesmas regras de validação do cadastro manual: campos obrigatórios, formatos de data, valores válidos de tipo de ingresso, dia da semana e tipos de célula.

- O sistema deve exibir linhas inválidas na prévia — nunca ocultá-las — com destaque visual e descrição clara e específica do erro por linha.

- O sistema deve bloquear linhas inválidas para importação; apenas linhas válidas podem ser importadas.

- O sistema deve verificar se o líder referenciado em cada linha existe no próprio arquivo (será criado na primeira passagem) ou já está cadastrado no sistema; caso não encontrado em nenhuma das duas fontes, a linha deve ser marcada como inválida.

- O sistema deve aceitar apenas arquivos com extensão `.csv`.

- O sistema deve registrar data, hora e usuário responsável pela importação para fins de auditoria.

- Membros importados devem ser cadastrados com status **Ativo** por padrão.

---

# Cenários de Comportamento

## Cenário 1: Download e visualização do template

**Dado que** o usuário está na tela de importação

**Quando** clica em "Baixar template CSV"

**Então** o sistema deve:
  - Iniciar o download de um arquivo `.csv`
  - O arquivo deve conter o cabeçalho com todas as colunas esperadas
  - O arquivo deve conter ao menos 2 linhas de exemplo prefixadas com `EXEMPLO` na primeira coluna: uma para líder (com dados de célula preenchidos) e uma para membro simples
  - O sistema deve ignorar automaticamente essas linhas de exemplo no processamento do upload

---

## Cenário 2: Upload e prévia com linhas válidas e inválidas

**Dado que** o usuário fez upload de um arquivo CSV com 20 linhas: 17 válidas e 3 com erro (linha 5 sem cidade, linha 12 com data de nascimento inválida, linha 18 com líder não encontrado)

**Quando** o sistema processa o arquivo e exibe a prévia

**Então** o sistema deve:
  - Exibir o resumo: "20 linhas no arquivo | 17 válidas | 3 inválidas"
  - Exibir as 20 linhas na tabela — incluindo as 3 inválidas com destaque visual
  - Exibir na linha 5: "Campo Cidade é obrigatório e está vazio."
  - Exibir na linha 12: "Data de nascimento em formato inválido. Use DD/MM/AAAA."
  - Exibir na linha 18: "O líder 'Roberto Nunes' não foi encontrado no arquivo nem no sistema."
  - Exibir o botão "Importar apenas as linhas válidas" habilitado
  - Exibir o botão "Cancelar" habilitado

---

## Cenário 3: Importação das linhas válidas

**Dado que** a prévia exibe 17 linhas válidas e 3 inválidas

**Quando** o usuário clica em "Importar apenas as linhas válidas"

**Então** o sistema deve:
  - Processar os líderes primeiro (primeira passagem)
  - Processar os membros simples em seguida, vinculando-os aos líderes (segunda passagem)
  - Cadastrar os 17 membros válidos com status Ativo
  - Exibir o resumo: "17 membros importados com sucesso. 3 linhas ignoradas por erro."
  - Listar as 3 linhas ignoradas com número e descrição do erro
  - Oferecer download do relatório de erros

---

## Cenário 4: Detecção de duplicata por nome + data de nascimento

**Dado que** já existe no sistema um membro `Ana Paula Ferreira` com data de nascimento `12/03/1990`
**E** o arquivo CSV contém uma linha com `Ana Paula Ferreira` e data de nascimento `12/03/1990`

**Quando** o sistema processa a prévia

**Então** o sistema deve:
  - Marcar a linha como inválida
  - Exibir: "Possível duplicata: já existe um membro com o nome 'Ana Paula Ferreira' e data de nascimento '12/03/1990' no sistema."
  - Não importar a linha duplicada

---

## Cenário 5: Arquivo sem extensão .csv é rejeitado

**Dado que** o usuário tenta fazer upload de um arquivo `.xlsx`

**Quando** seleciona o arquivo

**Então** o sistema deve:
  - Rejeitar o arquivo antes de processar
  - Exibir: "Formato de arquivo inválido. Envie um arquivo .csv."
  - Não prosseguir para a prévia

---

## Cenário 6: Todas as linhas inválidas desabilita a importação

**Dado que** o arquivo enviado contém 5 linhas, todas com erros de validação

**Quando** o sistema exibe a prévia

**Então** o sistema deve:
  - Exibir todas as 5 linhas com destaque de erro e descrição
  - Desabilitar o botão "Importar apenas as linhas válidas"
  - Exibir: "Nenhuma linha válida encontrada. Corrija o arquivo e tente novamente."

---

## Cenário 7: Líder referenciado está no próprio arquivo (ordem independente)

**Dado que** o arquivo contém na linha 10 o membro `João Silva` (não líder) com o líder referenciado `Carlos Souza`
**E** `Carlos Souza` está definido como líder na linha 15 do mesmo arquivo (depois de João)
**E** `Carlos Souza` ainda não existe no sistema

**Quando** o sistema processa a importação após confirmação

**Então** o sistema deve:
  - Criar `Carlos Souza` na primeira passagem (como líder)
  - Criar `João Silva` na segunda passagem, vinculado a `Carlos Souza`
  - Não marcar nenhuma das duas linhas como inválida por causa da ordem

---

## Cenário 8: Cancelamento da importação na prévia

**Dado que** a prévia está exibida com linhas válidas e inválidas

**Quando** o usuário clica em "Cancelar"

**Então** o sistema deve:
  - Descartar o arquivo processado
  - Não importar nenhum registro
  - Retornar o usuário à tela inicial de importação

---

## Cenário 9: Palavra-chave "mesmo" nos campos de endereço da célula copia o endereço residencial do líder

**Dado que** o arquivo CSV contém um líder `Carlos Souza` com endereço residencial preenchido normalmente
**E** nos campos "Endereço da célula — Rua", "Endereço da célula — Número", "Endereço da célula — Bairro" e "Endereço da célula — Cidade" está o valor `mesmo`

**Quando** o sistema processa a linha durante a importação

**Então** o sistema deve:
  - Copiar automaticamente os valores do endereço residencial do líder para os campos de endereço da célula
  - Tratar a linha como válida (não sinalizar erro nos campos de endereço da célula)
  - Criar a célula com o endereço residencial do líder como endereço da célula

---

# Permissões e Regras de Acesso

| Permissão | Descrição |
|-----------|-----------|
| `IMPORTACAO_EXECUTAR` | Permite acessar, fazer upload e confirmar a importação de CSV |

No MVP, o perfil **Administrador** possui esta permissão por padrão.

---

# Histórico de Alterações

| Data       | Card | Autor           | Descrição da Alteração        |
|------------|------|-----------------|-------------------------------|
| 29/04/2026 | —    | Thiago Oliveira | Criação inicial do requisito  |
| 30/04/2026 | —    | Thiago Oliveira | Cenário 1 corrigido (terminologia CSV, sem "abas"); mensagem de líder ambíguo sem menção a data de nascimento; regra de duplicata intra-arquivo; Cenário 9 (palavra-chave "mesmo" no endereço da célula) |
| 30/04/2026 | —    | Thiago Oliveira | Coluna "Número da célula do líder" removida (vínculo membro→líder, não célula específica) |

---

<div align="center">
  <sub><strong>🔒 Documento Confidencial</strong> • Uso Interno</sub>
</div>
