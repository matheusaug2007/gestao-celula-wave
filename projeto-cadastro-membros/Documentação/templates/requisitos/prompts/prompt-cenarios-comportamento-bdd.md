# Prompt Unificado: Cenários de Comportamento (BDD)

## Objetivo da Seção

A seção **"Cenários de Comportamento"** tem como objetivo documentar o comportamento esperado do sistema através de **exemplos concretos e executáveis**, utilizando a metodologia **BDD (Behavior-Driven Development)**.

Esta seção substitui o formato tradicional de "Critérios de Aceite" por cenários estruturados que:
- Facilitam a comunicação entre negócio, desenvolvimento e QA
- Podem ser convertidos diretamente em testes automatizados
- Utilizam linguagem ubíqua (comum a todos os stakeholders)
- Descrevem comportamentos através de exemplos reais com dados concretos

## Público-Alvo

- **Primário**: Desenvolvedores, QA (automação de testes), Product Owner (validação)
- **Secundário**: Stakeholders de negócio, novos membros do time (onboarding)

## Por Que Esta Seção Existe

1. **Automação de Testes**: Cenários BDD podem ser convertidos diretamente em testes automatizados (Cucumber, SpecFlow, Behave, etc.)
2. **Redução de Ambiguidade**: Exemplos concretos eliminam interpretações subjetivas
3. **Documentação Viva**: Testes automatizados validam que a documentação está atualizada
4. **Colaboração**: Linguagem acessível para técnicos e não-técnicos
5. **Cobertura Completa**: Estrutura força documentação de fluxo principal, exceções, validações e edge cases

## Estrutura BDD (Given-When-Then)

Cada cenário deve seguir a estrutura Gherkin:

```gherkin
Cenário N: Título descritivo do cenário

Dado que [contexto/pré-condição]
E [contexto adicional]
E [mais contexto se necessário]

Quando [ação do usuário ou evento do sistema]
E [ação adicional]

Então o sistema deve:
  - [resultado esperado 1]
  - [resultado esperado 2]
  - [resultado esperado N]
```

### Tradução dos Termos Gherkin

| Inglês | Português | Uso |
|--------|-----------|-----|
| **Given** | **Dado que** | Define o contexto inicial e pré-condições |
| **And** (após Given) | **E** | Adiciona mais contexto/pré-condições |
| **When** | **Quando** | Descreve a ação do usuário ou evento |
| **And** (após When) | **E** | Adiciona mais ações |
| **Then** | **Então** | Especifica os resultados esperados |
| **And** (após Then) | **E** | Adiciona mais resultados esperados |

## Diretrizes Obrigatórias para Escrita

### 1. Uso de Dados Concretos (NÃO usar placeholders genéricos)

❌ **ERRADO:**
```
Quando preenche o campo "Nome" com "{{NOME}}"
```

✅ **CORRETO:**
```
Quando preenche o campo "Nome" com "Restaurante Exemplo LTDA"
```

### 2. Título do Cenário Deve Ser Descritivo

❌ **ERRADO:**
```
Cenário 1: Cadastro
```

✅ **CORRETO:**
```
Cenário 1: Cadastro bem-sucedido de estabelecimento com dados válidos
```

### 3. Contexto (Given) Deve Estabelecer TODAS as Pré-condições

✅ **CORRETO:**
```
Dado que o usuário possui permissão "ESTABELECIMENTO_CRIAR"
E está autenticado no sistema
E acessa o menu "Cadastros > Estabelecimentos Comerciais"
E clica no botão "Novo Estabelecimento"
```

### 4. Ação (When) Deve Descrever O QUE o Usuário Faz

✅ **CORRETO:**
```
Quando preenche os seguintes dados:
  - Razão Social: "Restaurante Exemplo LTDA"
  - CNPJ: "12.345.678/0001-90"
  - Estado: "São Paulo"
E clica no botão "Salvar"
```

### 5. Resultado (Then) Deve Ser Observável e Verificável

✅ **CORRETO:**
```
Então o sistema deve:
  - Exibir a mensagem "Estabelecimento cadastrado com sucesso"
  - Redirecionar para a tela de listagem de estabelecimentos
  - Exibir o estabelecimento "Restaurante Exemplo LTDA" na primeira linha
  - Registrar o estabelecimento com status "Ativo"
```

### 6. Um Cenário = Um Comportamento Específico

Cada cenário deve testar **um único comportamento** ou **uma única variação**.

Não misturar múltiplos comportamentos em um único cenário.

### 7. Separar Cenários com Linha Horizontal

Use `---` para separar visualmente os cenários.

## Categorias de Cenários (Cobertura Completa)

Para garantir cobertura completa, documentar cenários nas seguintes categorias:

### 1. Fluxo Principal (Happy Path)
- Cenário de sucesso com todos os dados válidos
- **Exemplo**: "Cadastro bem-sucedido de estabelecimento com dados válidos"

### 2. Validações de Entrada
- Campos obrigatórios não preenchidos
- Formatos inválidos
- Valores fora do intervalo permitido
- **Exemplo**: "Tentativa de cadastro com campos obrigatórios em branco"

### 3. Regras de Negócio
- Impedimentos por duplicidade
- Restrições de relacionamento entre entidades
- Regras de consistência
- **Exemplo**: "Tentativa de cadastro com CNPJ duplicado"

### 4. Permissões e Segurança
- Acesso sem permissão
- Ações restritas por perfil
- Tentativa de acesso não autorizado
- **Exemplo**: "Tentativa de acesso à criação sem permissão"

### 5. Tratamento de Erros
- Erros de comunicação com backend
- Timeouts
- Erros inesperados
- **Exemplo**: "Erro ao salvar por falha na comunicação com o servidor"

### 6. Edge Cases (Casos Extremos)
- Valores limite (mínimo/máximo)
- Combinações incomuns de dados
- Condições raras mas possíveis
- **Exemplo**: "Cadastro com razão social contendo caracteres especiais permitidos"

### 7. Cancelamento e Reversão
- Cancelar operação
- Descartar alterações
- Voltar sem salvar
- **Exemplo**: "Cancelamento do cadastro descartando alterações"

## Modelo de Nomenclatura de Cenários

Seguir o padrão:

```
Cenário [N]: [Ação] [resultado] [condição específica]
```

**Exemplos:**
- Cenário 1: Cadastro bem-sucedido com dados válidos
- Cenário 2: Tentativa de cadastro com CNPJ duplicado
- Cenário 3: Validação de campos obrigatórios não preenchidos
- Cenário 4: Tentativa de acesso sem permissão
- Cenário 5: Cancelamento do cadastro descartando alterações

## Template Base para Cenários

```markdown
# Cenários de Comportamento

## Cenário 1: [Título descritivo - fluxo principal]

**Dado que** [contexto/pré-condição]
**E** [contexto adicional]

**Quando** [ação do usuário]
**E** [ação adicional]

**Então** o sistema deve:
  - [resultado esperado 1]
  - [resultado esperado 2]
  - [resultado esperado N]

---

## Cenário 2: [Título descritivo - validação]

**Dado que** [contexto/pré-condição]

**Quando** [ação do usuário]

**Então** o sistema deve:
  - [resultado esperado 1]
  - [resultado esperado 2]

---

## Cenário 3: [Título descritivo - regra de negócio]

**Dado que** [pré-condição específica da regra]
**E** [contexto adicional]

**Quando** [ação que viola a regra]

**Então** o sistema deve:
  - [comportamento esperado ao violar regra]
  - [mensagem de erro específica]
  - [estado resultante do sistema]

---

## Cenário N: [Título descritivo - edge case]

**Dado que** [contexto do caso extremo]

**Quando** [ação com valor limite ou condição rara]

**Então** o sistema deve:
  - [comportamento esperado]
```

## Exemplos Práticos Completos

### Exemplo 1: Template Criar (Estabelecimento Comercial)

```markdown
# Cenários de Comportamento

## Cenário 1: Cadastro bem-sucedido de estabelecimento com dados válidos

**Dado que** o usuário possui permissão "ESTABELECIMENTO_CRIAR"
**E** está autenticado no sistema
**E** acessa o menu "Cadastros > Estabelecimentos Comerciais"
**E** clica no botão "Novo Estabelecimento"

**Quando** preenche os seguintes dados:
  - Razão Social: "Restaurante Exemplo LTDA"
  - CNPJ: "12.345.678/0001-90"
  - Estado: "São Paulo"
  - Categoria: "Alimentação"
  - Email: "contato@restaurante.com"

**E** clica no botão "Salvar"

**Então** o sistema deve:
  - Exibir a mensagem "Estabelecimento cadastrado com sucesso"
  - Redirecionar para a tela de listagem de estabelecimentos
  - Exibir o estabelecimento "Restaurante Exemplo LTDA" na primeira linha da listagem
  - Registrar o estabelecimento com status "Ativo"
  - Registrar data e hora de criação
  - Registrar o usuário criador

---

## Cenário 2: Tentativa de cadastro com CNPJ duplicado

**Dado que** existe um estabelecimento cadastrado com CNPJ "12.345.678/0001-90"
**E** o usuário está na tela de criação de estabelecimento

**Quando** preenche os seguintes dados:
  - Razão Social: "Novo Restaurante LTDA"
  - CNPJ: "12.345.678/0001-90"
  - Estado: "Rio de Janeiro"

**E** clica no botão "Salvar"

**Então** o sistema deve:
  - Exibir a mensagem de erro "CNPJ já cadastrado no sistema"
  - Manter o usuário na tela de criação
  - Destacar o campo "CNPJ" em vermelho
  - Preservar os dados preenchidos nos demais campos
  - Não criar nenhum registro no banco de dados

---

## Cenário 3: Validação de campos obrigatórios não preenchidos

**Dado que** o usuário está na tela de criação de estabelecimento

**Quando** deixa os seguintes campos obrigatórios em branco:
  - Razão Social
  - CNPJ
  - Estado

**E** clica no botão "Salvar"

**Então** o sistema deve:
  - Exibir mensagem de erro "Preencha todos os campos obrigatórios"
  - Destacar em vermelho os campos não preenchidos: Razão Social, CNPJ e Estado
  - Não criar nenhum registro
  - Manter o foco no primeiro campo obrigatório não preenchido
  - Preservar os dados preenchidos nos campos não obrigatórios

---

## Cenário 4: Tentativa de acesso à criação sem permissão

**Dado que** o usuário NÃO possui permissão "ESTABELECIMENTO_CRIAR"
**E** está autenticado no sistema

**Quando** tenta acessar a tela de criação de estabelecimentos

**Então** o sistema deve:
  - Bloquear o acesso à funcionalidade
  - Exibir a mensagem "Você não possui permissão para criar estabelecimentos"
  - Redirecionar o usuário para a tela anterior
  - Não exibir o botão "Novo Estabelecimento" na listagem

---

## Cenário 5: Validação de formato de CNPJ inválido

**Dado que** o usuário está na tela de criação de estabelecimento

**Quando** preenche o campo "CNPJ" com "123.456.789-00" (formato de CPF)
**E** clica no botão "Salvar"

**Então** o sistema deve:
  - Exibir mensagem de erro "CNPJ inválido. Utilize o formato: 00.000.000/0000-00"
  - Destacar o campo "CNPJ" em vermelho
  - Não criar nenhum registro
  - Manter o foco no campo "CNPJ"

---

## Cenário 6: Cancelamento do cadastro descartando alterações

**Dado que** o usuário está na tela de criação de estabelecimento
**E** preencheu os seguintes campos:
  - Razão Social: "Restaurante Teste LTDA"
  - CNPJ: "98.765.432/0001-10"

**Quando** clica no botão "Cancelar"

**Então** o sistema deve:
  - Descartar todas as alterações não salvas
  - Redirecionar para a tela de listagem de estabelecimentos
  - Não criar nenhum registro no banco de dados
  - Não exibir mensagem de confirmação (descarte direto)
```

### Exemplo 2: Template Listar (Estabelecimentos Comerciais)

```markdown
# Cenários de Comportamento

## Cenário 1: Listagem inicial com ordenação padrão

**Dado que** o usuário possui permissão "ESTABELECIMENTO_VISUALIZAR"
**E** está autenticado no sistema
**E** existem 50 estabelecimentos cadastrados no sistema

**Quando** acessa o menu "Cadastros > Estabelecimentos Comerciais"

**Então** o sistema deve:
  - Exibir a listagem de estabelecimentos
  - Aplicar ordenação por "Razão Social" em ordem alfabética crescente (A-Z)
  - Exibir 25 registros na primeira página (paginação padrão)
  - Exibir as colunas: Razão Social, CNPJ, Estado, Categoria, Status
  - Exibir indicador de paginação mostrando "Página 1 de 2"

---

## Cenário 2: Filtragem por CNPJ com resultado único

**Dado que** o usuário está na tela de listagem de estabelecimentos
**E** existem múltiplos estabelecimentos cadastrados

**Quando** utiliza o filtro geral digitando "12.345.678/0001-90" no campo de busca
**E** seleciona o campo "CNPJ" na lista de campos disponíveis

**Então** o sistema deve:
  - Criar o par de busca "CNPJ = 12.345.678/0001-90"
  - Exibir apenas o estabelecimento com CNPJ "12.345.678/0001-90"
  - Exibir contador "1 registro encontrado"
  - Manter o par de busca visível na barra de filtros

---

## Cenário 3: Tentativa de acesso à listagem sem permissão

**Dado que** o usuário NÃO possui permissão "ESTABELECIMENTO_VISUALIZAR"
**E** está autenticado no sistema

**Quando** tenta acessar o menu "Cadastros > Estabelecimentos Comerciais"

**Então** o sistema deve:
  - Bloquear o acesso à funcionalidade
  - Exibir mensagem "Você não possui permissão para visualizar estabelecimentos"
  - Não exibir a opção "Estabelecimentos Comerciais" no menu
  - Manter o usuário na tela atual

---

## Cenário 4: Listagem vazia sem registros cadastrados

**Dado que** o usuário está na tela de listagem de estabelecimentos
**E** não existem estabelecimentos cadastrados no sistema

**Quando** a listagem é carregada

**Então** o sistema deve:
  - Exibir a mensagem "Nenhum resultado encontrado"
  - Não exibir a grid de listagem
  - Exibir o botão "Novo Estabelecimento" (se usuário tiver permissão de criação)
  - Não exibir controles de paginação

---

## Cenário 5: Ação de inativar estabelecimento ativo

**Dado que** o usuário possui permissão "ESTABELECIMENTO_INATIVAR"
**E** está na listagem de estabelecimentos
**E** existe um estabelecimento "Restaurante Exemplo LTDA" com status "Ativo"

**Quando** clica no menu de ações (três pontos) da linha do estabelecimento
**E** seleciona a ação "Inativar"

**Então** o sistema deve:
  - Alterar o status do estabelecimento para "Inativo"
  - Atualizar a coluna "Status" da listagem exibindo "Inativo"
  - Exibir mensagem "Estabelecimento inativado com sucesso"
  - Manter o estabelecimento visível na listagem
  - Alterar a ação disponível de "Inativar" para "Ativar"
  - Registrar data/hora da inativação e usuário responsável

---

## Cenário 6: Ordenação por coluna CNPJ

**Dado que** o usuário está na tela de listagem com múltiplos estabelecimentos

**Quando** clica no cabeçalho da coluna "CNPJ"

**Então** o sistema deve:
  - Reordenar a listagem por CNPJ em ordem crescente
  - Exibir indicador visual de ordenação ascendente na coluna "CNPJ"
  - Manter os filtros aplicados (se houver)
  - Retornar para a primeira página da listagem
```

## Diferença Entre "Detalhamento Funcional" e "Cenários de Comportamento"

### Detalhamento Funcional
- Descreve COMO o sistema funciona (narrativa geral)
- Usa linguagem funcional descritiva
- **Exemplo**: "A tela é composta por um formulário com campos de entrada. Ao clicar em Salvar, o sistema valida os dados e persiste o registro."

### Cenários de Comportamento (BDD)
- Descreve exemplos CONCRETOS de uso
- Usa linguagem estruturada (Given-When-Then)
- **Exemplo**: "Dado que o usuário preenche 'Razão Social' com 'Restaurante X', Quando clica em Salvar, Então exibe mensagem 'Cadastrado com sucesso'."

**Ambas as seções são complementares:**
- Detalhamento Funcional = visão geral do comportamento
- Cenários de Comportamento = exemplos específicos testáveis

## Relação com Critérios de Aceite (Legado)

### Para Requisitos Novos
- Utilizar APENAS a seção "Cenários de Comportamento"
- NÃO criar seção "Critérios de Aceite"

### Para Requisitos Legados (já escritos)
- Manter seção "Critérios de Aceite" existente
- Gradualmente migrar para "Cenários de Comportamento"
- Durante migração, ambas seções podem coexistir

## Checklist de Qualidade para Cenários BDD

Antes de considerar a seção completa, validar:

- [ ] Todos os cenários usam dados concretos (não placeholders genéricos)
- [ ] Cenário de fluxo principal (happy path) está documentado
- [ ] Cenários de validação de entrada estão cobertos
- [ ] Cenários de regras de negócio estão cobertos
- [ ] Cenários de permissões e segurança estão cobertos
- [ ] Cenário de cancelamento/reversão está documentado
- [ ] Todos os cenários seguem estrutura Given-When-Then
- [ ] Títulos dos cenários são descritivos e específicos
- [ ] Resultados esperados (Then) são observáveis e verificáveis
- [ ] Cenários estão separados por `---`
- [ ] Não há repetição de comportamentos entre cenários
- [ ] Linguagem está acessível (sem jargão técnico excessivo)

## Erros Comuns a Evitar

### ❌ Erro 1: Usar placeholders em vez de dados concretos
```markdown
Quando preenche o campo "Nome" com "{{NOME_DO_ESTABELECIMENTO}}"
```

### ✅ Correto:
```markdown
Quando preenche o campo "Nome" com "Restaurante Exemplo LTDA"
```

---

### ❌ Erro 2: Títulos genéricos
```markdown
Cenário 1: Cadastro
```

### ✅ Correto:
```markdown
Cenário 1: Cadastro bem-sucedido de estabelecimento com dados válidos
```

---

### ❌ Erro 3: Misturar múltiplos comportamentos em um cenário
```markdown
Cenário: Validações
Dado que o usuário está na tela
Quando deixa campos vazios OU preenche CNPJ inválido
```

### ✅ Correto: Separar em dois cenários
```markdown
Cenário 2: Validação de campos obrigatórios não preenchidos
Cenário 3: Validação de formato de CNPJ inválido
```

---

### ❌ Erro 4: Resultado não verificável
```markdown
Então o sistema deve funcionar corretamente
```

### ✅ Correto:
```markdown
Então o sistema deve:
  - Exibir a mensagem "Cadastrado com sucesso"
  - Redirecionar para a tela de listagem
```

---

### ❌ Erro 5: Não estabelecer contexto completo
```markdown
Quando o usuário clica em Salvar
```

### ✅ Correto:
```markdown
Dado que o usuário possui permissão "ESTABELECIMENTO_CRIAR"
E está na tela de criação de estabelecimento
Quando preenche todos os campos obrigatórios
E clica em Salvar
```

## Ferramentas de Automação Compatíveis

Cenários escritos neste formato podem ser convertidos para:

- **Cucumber** (Java, JavaScript, Ruby)
- **SpecFlow** (.NET)
- **Behave** (Python)
- **Behat** (PHP)
- **Gauge** (multiplataforma)

## Referências e Materiais de Apoio

- [The Cucumber Book](https://cucumber.io/docs/guides/)
- [BDD in Action](https://www.manning.com/books/bdd-in-action)
- [Gherkin Reference](https://cucumber.io/docs/gherkin/reference/)

---

**Nota Final**: Esta seção é a ponte entre requisitos de negócio e implementação técnica. Cenários bem escritos reduzem drasticamente o retrabalho e facilitam a manutenção do sistema ao longo do tempo.
