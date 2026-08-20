# 📖 Guia Completo: Estrutura de Requisitos

## 🎯 Objetivo deste Guia

Este documento explica **cada seção** dos templates de requisitos, detalhando:
- **Objetivo** de cada seção
- **Público-alvo** (quem usa/lê)
- **Por que deve existir**
- **Como preencher** (resumo)

**Público-alvo deste guia:** Novos membros do time, POs, Analistas, Desenvolvedores, QA

---

## 📋 Índice de Seções

1. [Cabeçalho (Logo, Breadcrumb, Versão)](#1-cabeçalho)
2. [Contextualização](#2-contextualização)
3. [Detalhamento Funcional](#3-detalhamento-funcional)
4. [Mensagens e Estados](#4-mensagens-e-estados)
5. [Fluxos Relacionados e Navegação](#5-fluxos-relacionados-e-navegação)
6. [Regras e Comportamentos do Sistema](#6-regras-e-comportamentos-do-sistema)
7. [Referências do Requisito](#7-referências-do-requisito)
8. [Cenários de Comportamento (BDD)](#8-cenários-de-comportamento-bdd) ⭐ **NOVA**
9. [Permissões e Regras de Acesso](#9-permissões-e-regras-de-acesso)
10. [Histórico de Alterações](#10-histórico-de-alterações)

---

## 1. Cabeçalho

### 🎯 Objetivo
Identificação institucional e rastreabilidade documental

### 👥 Público-alvo
Todos os stakeholders (negócio, técnico, gestão)

### 💡 Por que deve existir

**Identidade institucional**
- O logo garante que o documento seja imediatamente reconhecido como parte do acervo oficial da organização

**Navegação contextual**
- O breadcrumb `[Módulo: Nome] › Título` permite entender rapidamente onde o requisito se encaixa na estrutura do produto

**Versionamento e auditoria**

- A versão e data permitem rastrear evolução do documento, essencial para governança e conformidade

**Padronização**
- Garante consistência visual e estrutural entre todos os requisitos

### 📝 Como preencher

```markdown
---

[Módulo: Cadastros](../../README.md) › **Criar Estabelecimentos Comerciais**

**Versão:** 1.0 | **Última atualização:** 11/02/2026

---
```

**Regras:**
- Logo sempre no início
- Título: `<Ação no infinitivo> <Entidade>` (ex: Listar Usuários, Criar PDVs)
- Versão inicia em 0.1 (branches de trabalho)
- Incrementa Y em merge para *spec-approved*
- Incrementa X e zera Y em merge para *main*

**Referência completa:** [`prompts/prompt-cabecalho-unificado.md`](./prompts/prompt-cabecalho-unificado.md)

---

## 2. Contextualização

### 🎯 Objetivo
Explicar o **PORQUÊ** do requisito existir do ponto de vista de negócio

### 👥 Público-alvo
- **Primário:** Product Owner, stakeholders de negócio, líderes de área
- **Secundário:** Desenvolvedores (para entender o valor)

### 💡 Por que deve existir

**Alinhamento estratégico**

- Conecta o requisito aos objetivos de negócio e necessidades operacionais

**Priorização**

- Ajuda a entender o valor e impacto da funcionalidade

**Onboarding**

- Permite que novos membros do time entendam rapidamente o propósito

**Decisões técnicas**

- Desenvolvedores podem fazer melhores escolhas de implementação quando entendem o problema real

**Validação**

- Facilita validar se a solução proposta resolve o problema correto

### 📝 Como preencher

**Estrutura recomendada (4 parágrafos):**

1. **Definição da funcionalidade** - O que é e qual entidade gerencia
2. **Problema que resolve** - Necessidade operacional/institucional
3. **Público e momento de uso** - Quem usa e quando
4. **Integração com fluxos** - Como se conecta a outras funcionalidades

**Exemplo:**

```markdown
# Contextualização

A funcionalidade de listagem de estabelecimentos comerciais permite a
consulta centralizada de todos os pontos de venda cadastrados no sistema,
independentemente do estado ou região.

Esta listagem atende à necessidade de controle operacional e fiscalização
dos estabelecimentos ativos, facilitando a identificação rápida de pontos
comerciais para vinculação com dispositivos PDV e auditoria de dados
cadastrais.

É utilizada pela equipe de operações e suporte técnico durante o processo
de ativação de novos PDVs ou consulta a estabelecimentos já existentes.

Esta funcionalidade se integra diretamente aos processos de criação,
edição e inativação de estabelecimentos comerciais, servindo como ponto
central de navegação e consulta.
```

**O que NÃO fazer:**

- ❌ Mencionar telas, UI ou elementos visuais
- ❌ Descrever COMO funciona (isso vai no Detalhamento Funcional)
- ❌ Usar linguagem promocional
- ❌ Antecipar regras técnicas

**Referência completa:** [`prompts/prompt-contextualizacao-unificada.md`](./prompts/prompt-contextualizacao-unificada.md)

---

## 3. Detalhamento Funcional

### 🎯 Objetivo
Descrever **COMO** o sistema deve se comportar para atender ao objetivo

### 👥 Público-alvo
- **Primário:** Desenvolvedores, QA, analistas funcionais
- **Secundário:** Product Owner (validação), usuários-chave

### 💡 Por que deve existir

**Base para implementação**

- É a fonte primária para desenvolvimento

**Validação funcional**

- Permite que usuários-chave confirmem se o comportamento atende às necessidades

**Definição de testes**

- QA usa para criar cenários de teste

**Documentação viva**

- Serve como referência após deploy

**Redução de ambiguidade**
- Especificação clara reduz retrabalho e bugs

### 📝 Como preencher

Esta seção varia conforme o tipo de requisito (Criar, Editar, Listar, etc.)

**Subseções comuns:**

#### 3.1. Acesso à Funcionalidade
Define pré-condições e caminho de entrada

```markdown
## Acesso à Funcionalidade

O usuário acessa esta funcionalidade através do menu principal,
navegando para "Cadastros > Estabelecimentos Comerciais".

Para visualizar a listagem, é necessário possuir a permissão
"ESTABELECIMENTO_VISUALIZAR".

A listagem aplica automaticamente restrição por Estado, limitando
os dados exibidos aos Estados autorizados ao usuário logado.
```

#### 3.2. Preenchimento e Comportamento (Criar/Editar)
Especifica campos, validações e comportamentos

```markdown
## Preenchimento e Comportamento

O formulário de criação deve conter os seguintes campos:

- **Razão Social:** nome completo do estabelecimento.
  - Tipo: texto
  - Obrigatório: sim
  - Regras específicas: mínimo 3 caracteres

- **CNPJ:** identificador único do estabelecimento.
  - Tipo: texto com máscara
  - Obrigatório: sim
  - Regras específicas: validação de CNPJ válido, sem duplicidade
```

#### 3.3. Estrutura da Listagem (Listar)
Define colunas, ordenação e paginação

```markdown
## Estrutura da Listagem

### Colunas
- Razão Social
- CNPJ
- Estado
- Categoria
- Status

A listagem aplica ordenação padrão por **Razão Social** em ordem
alfabética crescente (A-Z).
```

**Uso de imagens:**
- Inserir protótipos/screenshots quando disponível
- Localização: pasta `imagens/` no mesmo nível do requisito
- Sempre seguir com breve descrição textual

**Referência completa:** Veja comentários inline nos templates específicos

---

## 4. Mensagens e Estados

### 🎯 Objetivo
Documentar estados relevantes do sistema e mensagens ao usuário

### 👥 Público-alvo
- **Primário:** Desenvolvedores, UX Writers, QA
- **Secundário:** Product Owner

### 💡 Por que deve existir

**Feedback ao usuário**
- Garante comunicação clara em diferentes estados

**Tratamento de exceções**
- Documenta comportamento em cenários de erro

**Consistência de UX**
- Padroniza mensagens em todo o sistema

**Cobertura de testes**
- QA pode validar todos os estados possíveis

### 📝 Como preencher

Documentar apenas estados **relevantes** (com impacto no comportamento)

```markdown
# Mensagens e Estados

- **Lista vazia**
  - **Condição:** Nenhum estabelecimento cadastrado ou filtros sem resultado
  - **Comportamento do sistema:** Exibe área vazia com mensagem
  - **Mensagem exibida:** "Nenhum resultado encontrado"

- **Erro ao carregar**
  - **Condição:** Falha de comunicação com backend
  - **Comportamento do sistema:** Mantém última visualização válida
  - **Mensagem exibida:** "Erro ao carregar dados. Tente novamente."
```

**O que NÃO documentar:**
- ❌ Estados triviais sem impacto funcional
- ❌ Mensagens de loading padrão
- ❌ Comportamentos já descritos no Detalhamento Funcional

**Referência completa:** [`prompts/prompt-mensagens-estados-unificado.md`](./prompts/prompt-mensagens-estados-unificado.md)

---

## 5. Fluxos Relacionados e Navegação

### 🎯 Objetivo
Mapear relações funcionais entre requisitos

### 👥 Público-alvo
- **Primário:** Product Owner, Arquitetos, Desenvolvedores
- **Secundário:** QA, Analistas de negócio

### 💡 Por que deve existir

**Visão sistêmica**
- Mostra como funcionalidades se conectam

**Planejamento de implementação**

- Identifica dependências técnicas

**Impacto de mudanças**
- Facilita análise de impacto de alterações

**Onboarding**
- Ajuda novos membros a entender fluxos completos

### 📝 Como preencher

Categorizar relações em:

```markdown
# Fluxos Relacionados e Navegação

## Fluxos Anteriores
- **[Listar Estabelecimentos](./listar-estabelecimentos.md)**
  A partir da listagem, o usuário acessa a criação através do botão
  "Novo Estabelecimento".

## Fluxos Posteriores
- **[Criar PDV](../pdv/criar-pdv.md)**
  Após cadastrar o estabelecimento, é possível vinculá-lo a um PDV
  no processo de ativação de dispositivos.

## Fluxos Alternativos
- **[Editar Estabelecimento](./editar-estabelecimento.md)**
  Permite alterar dados de estabelecimentos já cadastrados.
```

**Quando usar:**
- ✅ Relações COM IMPACTO FUNCIONAL
- ✅ Navegação que não é óbvia
- ✅ Dependências de dados entre requisitos

**Quando NÃO usar:**
- ❌ Navegação padrão (menu, botão voltar)
- ❌ Links que já estão no Detalhamento Funcional

**Referência completa:** [`prompts/prompt-fluxos-navegacao-unificado.md`](./prompts/prompt-fluxos-navegacao-unificado.md)

---

## 6. Regras e Comportamentos do Sistema

### 🎯 Objetivo
Documentar regras automáticas e restrições transversais

### 👥 Público-alvo
- **Primário:** Desenvolvedores, Arquitetos
- **Secundário:** QA, Product Owner

### 💡 Por que deve existir

**Regras de negócio centralizadas**

- Evita que regras fiquem implícitas

**Validações sistêmicas**
- Documenta comportamentos que não dependem de fluxo visual

**Integridade de dados**
- Especifica restrições que garantem consistência

**Comportamentos transversais**

- Documenta regras que afetam múltiplos fluxos

### 📝 Como preencher

Usar formato: "O sistema deve..."

```markdown
# Regras e Comportamentos do Sistema

- O sistema deve impedir o cadastro de estabelecimentos com CNPJ duplicado,
  mesmo que inativos.

- O sistema deve aplicar validação de dígitos verificadores do CNPJ antes
  de permitir o salvamento.

- O sistema deve registrar automaticamente data/hora de criação e usuário
  criador em todos os cadastros.

- O sistema deve restringir a listagem de estabelecimentos aos Estados
  autorizados ao usuário logado, aplicando filtro automaticamente no
  carregamento inicial.
```

**Exemplos de regras:**
- Impedimento de duplicidade
- Validações de integridade referencial
- Cálculos automáticos
- Regras de auditoria
- Restrições de acesso por escopo (Estado, Regional, etc.)

**Referência completa:** [`prompts/prompt-regras-comportamentos-sistema-unificado.md`](./prompts/prompt-regras-comportamentos-sistema-unificado.md)

---

## 7. Referências do Requisito

### 🎯 Objetivo
Centralizar materiais complementares

### 👥 Público-alvo
Todos os stakeholders

### 💡 Por que deve existir

**Acesso a protótipos**
- Link direto para designs de referência

**Diagramas técnicos**
- Complementa entendimento com representações visuais

**Fluxos complementares**
- Referencia processos externos ou complexos

**Requisitos Relacionados**
- Documenta rastreabilidade e dependências entre funcionalidades
- Conecta requisitos que parametrizam, alimentam ou são impactados, mesmo sem vínculo direto de navegação

**Rastreabilidade**
- Conecta requisito a materiais de origem

### 📝 Como preencher

**⚠️ Seção OPCIONAL** - Criar apenas quando houver referências reais

```markdown
# Referências do Requisito

## Protótipo da Tela

Protótipo navegável da funcionalidade de listagem de estabelecimentos.

- [Protótipo Figma - Listagem Estabelecimentos](https://figma.com/...)

## Requisitos Relacionados

- **[Parametrização de Estados](../configuracao/parametrizar-estados.md)**
  Define quais Estados o usuário pode acessar, impactando diretamente
  os dados exibidos nesta listagem.

## Diagramas

- [Diagrama de Fluxo - Criação de Estabelecimento](./diagramas/fluxo-criacao.png)
```

**Subseções possíveis:**
- Protótipo da Tela
- Requisitos Relacionados
- Diagramas
- Fluxos Complementares
- Anexos

**Regras:**
- ❌ NÃO criar seção vazia
- ❌ NÃO deixar placeholders
- ✅ Sempre incluir texto introdutório contextualizando

**Referência completa:** [`prompts/prompt-referencias-requisito-unificado.md`](./prompts/prompt-referencias-requisito-unificado.md)

---

## 8. Cenários de Comportamento (BDD)

### 🎯 Objetivo
Documentar comportamentos através de **exemplos concretos e executáveis** usando BDD

### 👥 Público-alvo
- **Primário:** Desenvolvedores, QA (automação), Product Owner (validação)
- **Secundário:** Stakeholders de negócio, novos membros (onboarding)

### 💡 Por que deve existir

**Automação de Testes**
- Cenários BDD podem ser convertidos diretamente em testes automatizados (Cucumber, SpecFlow, Behave)

**Redução de Ambiguidade**
- Exemplos concretos eliminam interpretações subjetivas

**Documentação Viva**
- Testes automatizados validam que a documentação está atualizada

**Colaboração**
- Linguagem acessível para técnicos e não-técnicos

**Cobertura Completa**
- Estrutura força documentação de happy path, validações, regras, permissões, erros e edge cases

### 📝 Como preencher

**Estrutura Given-When-Then (Dado que-Quando-Então):**

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

**E** clica no botão "Salvar"

**Então** o sistema deve:
  - Exibir a mensagem "Estabelecimento cadastrado com sucesso"
  - Redirecionar para a tela de listagem de estabelecimentos
  - Exibir o estabelecimento "Restaurante Exemplo LTDA" na listagem
  - Registrar o estabelecimento com status "Ativo"
  - Registrar data e hora de criação
  - Registrar o usuário criador

---

## Cenário 2: Tentativa de cadastro com CNPJ duplicado

**Dado que** existe um estabelecimento cadastrado com CNPJ "12.345.678/0001-90"
**E** o usuário está na tela de criação de estabelecimento

**Quando** preenche o campo "CNPJ" com "12.345.678/0001-90"
**E** clica no botão "Salvar"

**Então** o sistema deve:
  - Exibir a mensagem de erro "CNPJ já cadastrado no sistema"
  - Manter o usuário na tela de criação
  - Destacar o campo "CNPJ" em vermelho
  - Preservar os dados preenchidos nos demais campos
  - Não criar nenhum registro no banco de dados
```

### 🎓 Conceitos BDD

| Termo | Tradução | Uso |
|-------|----------|-----|
| **Given** | **Dado que** | Define contexto inicial e pré-condições |
| **When** | **Quando** | Descreve a ação do usuário ou evento |
| **Then** | **Então** | Especifica os resultados esperados |
| **And** | **E** | Conecta múltiplos Given, When ou Then |

### 📋 Categorias de Cenários

Cobrir ao menos estas categorias:

1. **Fluxo Principal (Happy Path)**
   - Cenário de sucesso com todos os dados válidos

2. **Validações de Entrada**
   - Campos obrigatórios não preenchidos
   - Formatos inválidos
   - Valores fora do intervalo

3. **Regras de Negócio**
   - Impedimentos por duplicidade
   - Restrições de relacionamento
   - Regras de consistência

4. **Permissões e Segurança**
   - Acesso sem permissão
   - Ações restritas por perfil

5. **Tratamento de Erros**
   - Erros de validação
   - Mensagens específicas

6. **Edge Cases**
   - Valores limite (mínimo/máximo)
   - Combinações incomuns

7. **Cancelamento e Reversão**
   - Cancelar operação
   - Descartar alterações

### ✅ Regras de Ouro

**FAZER:**
- ✅ Usar dados CONCRETOS ("12.345.678/0001-90" não "{{CNPJ}}")
- ✅ Títulos descritivos nos cenários
- ✅ Um cenário = um comportamento
- ✅ Separar cenários com `---`

**NÃO FAZER:**
- ❌ Usar placeholders genéricos nos exemplos
- ❌ Misturar múltiplos comportamentos em um cenário
- ❌ Títulos vagos ("Cenário 1: Cadastro")
- ❌ Resultados não verificáveis ("funcionar corretamente")

### 🔄 Diferença: Detalhamento Funcional vs Cenários BDD

| Detalhamento Funcional | Cenários de Comportamento (BDD) |
|------------------------|----------------------------------|
| Descreve COMO o sistema funciona (narrativa geral) | Descreve exemplos CONCRETOS de uso |
| Linguagem funcional descritiva | Linguagem estruturada (Given-When-Then) |
| "A tela possui campos X, Y. Ao salvar, valida..." | "Dado que preenche X com 'Valor', Quando clica Salvar, Então..." |

**Ambas as seções são complementares:**
- **Detalhamento Funcional** = visão geral do comportamento
- **Cenários de Comportamento** = exemplos específicos testáveis

### 🚀 Ferramentas de Automação

Cenários BDD podem ser automatizados com:
- **Cucumber** (Java, JavaScript, Ruby)
- **SpecFlow** (.NET/C#)
- **Behave** (Python)
- **Behat** (PHP)
- **Gauge** (Multiplataforma)

### 📚 Relação com Critérios de Aceite (Legado)

**Para requisitos novos:**
- ✅ Usar seção "Cenários de Comportamento (BDD)"
- ❌ NÃO usar seção "Critérios de Aceite"

**Para requisitos legados:**
- ⚠️ Manter seção "Critérios de Aceite" existente
- 🔄 Migrar gradualmente quando oportuno

**Referência completa:** [`prompts/prompt-cenarios-comportamento-bdd.md`](./prompts/prompt-cenarios-comportamento-bdd.md)

---

## 9. Permissões e Regras de Acesso

### 🎯 Objetivo
Documentar controle de acesso e segurança

### 👥 Público-alvo
- **Primário:** Desenvolvedores, Arquitetos de Segurança
- **Secundário:** Product Owner, Auditoria

### 💡 Por que deve existir

**Segurança**
- Garante que acessos sejam controlados conforme modelo de permissões

**Conformidade**
- Documenta quem pode fazer o quê (auditoria)

**Implementação correta**
- Desenvolvedores sabem exatamente quais permissões aplicar

**Testes de segurança**
- QA pode validar restrições de acesso

### 📝 Como preencher

**Modelo com permissões:**

```markdown
# Permissões e Regras de Acesso

| Permissão | Descrição |
|-----------|-----------|
| ESTABELECIMENTO_VISUALIZAR | Permite visualizar a listagem de estabelecimentos |
| ESTABELECIMENTO_CRIAR | Permite criar novos estabelecimentos comerciais |
| ESTABELECIMENTO_EDITAR | Permite editar dados de estabelecimentos existentes |
| ESTABELECIMENTO_INATIVAR | Permite inativar/ativar estabelecimentos |
```

**Modelo sem permissões:**

```markdown
# Permissões e Regras de Acesso

O aplicativo PDV **não possui controle de permissões por usuário**.

Uma vez que o PDV esteja devidamente ativado e operacional, **todas as
funcionalidades disponíveis no aplicativo podem ser acessadas por qualquer
operador**, não havendo diferenciação de acesso, perfis ou restrições
funcionais no nível da aplicação.
```

**Referência completa:** [`prompts/prompt-permissoes-regras-acesso-unificado.md`](./prompts/prompt-permissoes-regras-acesso-unificado.md)

---

## 10. Histórico de Alterações

### 🎯 Objetivo
Rastrear evolução do documento ao longo do tempo

### 👥 Público-alvo
Todos os stakeholders

### 💡 Por que deve existir

**Auditoria**
- Registro de quem alterou, quando e por quê

**Rastreabilidade**
- Conecta mudanças documentais a cards de trabalho (Jira)

**Evolução funcional**
- Permite entender como requisito evoluiu

**Governança**
- Facilita análise de impacto de mudanças históricas

**Conformidade**
- Mantém trilha de alterações para processos de certificação

### 📝 Como preencher

```markdown
# Histórico de Alterações

| Data       | Card Jira  | Autor     | Descrição da Alteração |
|------------|------------|-----------|------------------------|
| 11/02/2026 | PROJ-1234  | Alexandre | Criação inicial do requisito |
| 15/02/2026 | PROJ-1456  | Maria     | Adicionado filtro por categoria |
| 20/02/2026 | PROJ-1567  | João      | Ajuste na ordenação padrão |
```

**Elementos obrigatórios:**
- Data (DD/MM/AAAA)
- Card Jira (quando aplicável, pode usar "-" se não houver)
- Autor
- Descrição objetiva da alteração (O QUE mudou)

**Referência completa:** [`prompts/prompt-historico-alteracoes-unificado.md`](./prompts/prompt-historico-alteracoes-unificado.md)

---

## 📊 Resumo: Seções Obrigatórias vs Opcionais

### Seções OBRIGATÓRIAS

Devem existir em todos os requisitos:

1. ✅ Cabeçalho (Logo, Breadcrumb, Versão)
2. ✅ Contextualização
3. ✅ Detalhamento Funcional
4. ✅ Cenários de Comportamento (BDD) ⭐ **ou** Critérios de Aceite (legado)
5. ✅ Permissões e Regras de Acesso
6. ✅ Histórico de Alterações

### Seções OPCIONAIS

Criar apenas quando houver conteúdo relevante:

- 🔶 Mensagens e Estados (criar quando houver estados relevantes)
- 🔶 Fluxos Relacionados e Navegação (criar quando houver relações funcionais)
- 🔶 Regras e Comportamentos do Sistema (criar quando houver regras transversais)
- 🔶 Referências do Requisito (criar quando houver protótipos, diagramas, etc.)

---

## 🎓 Filosofia do Template

O template segue uma estrutura lógica que separa claramente:

| Seção | Responde |
|-------|----------|
| **Contextualização** | **POR QUE** (problema de negócio) |
| **Detalhamento Funcional** | **COMO** (comportamento do sistema) |
| **Cenários de Comportamento** | **O QUE VALIDAR** (exemplos testáveis) |
| **Permissões** | **QUEM PODE** (controle de acesso) |
| **Histórico** | **QUANDO MUDOU** (rastreabilidade) |

Essa separação garante que cada stakeholder encontre rapidamente a informação relevante para seu papel, mantendo o documento coeso e utilizável ao longo de todo o ciclo de vida do produto.

---

## 🚀 Guia Rápido por Perfil

### Para Product Owners

**Seções que você mais vai escrever:**
1. Contextualização (problema de negócio)
2. Detalhamento Funcional (comportamento esperado)
3. Cenários de Comportamento (exemplos de uso)
4. Permissões e Regras de Acesso

**Dica:** Use dados reais nos exemplos BDD. Evite placeholders genéricos.

### Para Desenvolvedores

**Seções que você mais vai ler:**
1. Detalhamento Funcional (como implementar)
2. Cenários de Comportamento (casos de teste)
3. Regras e Comportamentos do Sistema (validações)
4. Permissões e Regras de Acesso (segurança)

**Dica:** Cenários BDD podem virar testes automatizados diretamente.

### Para QA

**Seções que você mais vai usar:**
1. Cenários de Comportamento (base para testes)
2. Detalhamento Funcional (entender fluxos)
3. Mensagens e Estados (validar feedback)
4. Permissões e Regras de Acesso (testes de segurança)

**Dica:** Use Cucumber/SpecFlow para converter cenários BDD em testes automatizados.

### Para Analistas de Negócio

**Seções que você mais vai criar/validar:**
1. Contextualização (alinhamento com negócio)
2. Fluxos Relacionados (integração entre processos)
3. Regras e Comportamentos (regras de negócio)
4. Referências do Requisito (protótipos, diagramas)

**Dica:** Mantenha linguagem acessível, evite jargão técnico excessivo.

---

## 📚 Materiais Complementares

### Prompts Unificados
Consulte [`prompts/README.md`](./prompts/README.md) para acesso a todos os prompts detalhados de cada seção.

### Mudanças Recentes
Consulte o [`CHANGELOG.md`](../../../CHANGELOG.md) do projeto para entender todas as mudanças implementadas, incluindo a adoção da metodologia BDD.

### Templates Disponíveis

- [`base/template-requisito-base.md`](./base/template-requisito-base.md) - Template genérico
- [`telas/template-criar.md`](./telas/template-criar.md) - Template para criação
- [`telas/template-editar.md`](./telas/template-editar.md) - Template para edição
- [`telas/template-listar.md`](./telas/template-listar.md) - Template para listagem

---

## 🤝 Contribuindo

Ao encontrar melhorias neste guia ou nos templates:

1. Documente o caso específico
2. Proponha ajuste no guia ou prompt correspondente
3. Teste em pelo menos um requisito real
4. Faça PR com descrição clara

---

