[Cadastro Membros](../../README.md) > [Spec Kit](./README.md) > **Nomenclatura**

---

# 📝 Convenções de Nomenclatura

Este documento define os padrões oficiais para nomes de arquivos, pastas, imagens e anexos do repositório **Cadastro Membros**.

As regras aqui descritas devem ser seguidas tanto por colaboradores humanos quanto por agentes automatizados.

## Linguagem Ubíqua e Terminologia

Os nomes de arquivos, pastas, entidades e processos devem seguir a **Linguagem Ubíqua** (Ubiquitous Language) do domínio, garantindo que:

- **Termos do negócio** sejam usados consistentemente em toda documentação, código e testes
- **Um conceito = Um termo** (evitar sinônimos para a mesma coisa)
- **Alinhamento total** entre o que o PO escreve, o que o desenvolvedor implementa e o que o QA testa
- **Evitar tradução** de termos já estabelecidos pelos usuários finais

### Exemplos de Termos da Linguagem Ubíqua

| ✅ Termo Correto | ❌ Evitar | Contexto | Justificativa |
|------------------|-----------|----------|---------------|
| Membro | "Participante", "Filiado", "Member" | Cadastros | Termo oficial usado pelo negócio |
| Grupo | "Célula", "Turma", "Team" | Grupos | Linguagem dos usuários finais |
| Congregação | "Local", "Unidade", "Branch" | Organização | Termo consolidado internamente |
| Perfil | "Dados", "Ficha", "Profile" | Membros | Termo consistente no sistema |
| Usuário | "User", "Operador" | Autenticação | Termo consistente no sistema |

### Regra de Ouro

> **Se o time de negócio chama de "Membro", então:**
> - Arquivo de requisito: `criar-membro.md`
> - Classe no código: `Membro`
> - Tabela no banco: `Membro` ou `membro`
> - Teste BDD: "Dado que existe um Membro cadastrado..."

**Não use:** `criar-participante.md`, `class Member`, `tb_user`, "Dado que existe um Participant..."

### Benefícios da Linguagem Ubíqua

1. **Elimina tradução** entre negócio e técnico
2. **Facilita comunicação** em reuniões e refinamentos
3. **Reduz ambiguidade** (todos falam a mesma língua)
4. **Acelera onboarding** de novos membros
5. **Facilita modelagem técnica** (conceitos já mapeados)

---

## Conceitos Estruturais

Toda a documentação do repositório segue obrigatoriamente a hierarquia abaixo:

Domínio → Subdomínio → Requisitos

Onde:

- **Domínio:** Representa um contexto delimitado amplo do sistema
  Ex.: `cadastros`, `solicitacoes`, `relatorios`, `configuracoes`

- **Subdomínio:** Representa uma entidade, agregado ou área específica dentro do domínio
  Ex.: `usuarios`, `modelos-equipamentos`, `equipamentos`, `doacoes`

- **Requisito:** Documento que descreve uma **ação principal** ou **capacidade** do subdomínio

Toda documentação de requisitos deve respeitar essa hierarquia.

### Exemplo Prático

```
requisitos/funcionais/
└── cadastros/                          # Domínio
    └── modelos-equipamentos/           # Subdomínio
        ├── listar-modelos-equipamentos.md
        ├── criar-modelo-equipamento.md
        ├── editar-modelo-equipamento.md
        ├── excluir-modelo-equipamento.md
        └── inativar-modelo-equipamento.md
```

## 1. Arquivos de Requisitos

Os nomes dos arquivos de requisitos devem refletir **o propósito principal do requisito**, e não a lista completa de ações disponíveis.

Os arquivos de requisitos **devem sempre estar dentro de um subdomínio**.

Antes de nomear um arquivo, classifique o requisito em um dos dois tipos abaixo.

### 1.1 Tipo A — Ação Principal sobre uma Entidade

Utilize este padrão quando o requisito existir **por causa de uma ação principal clara**, mesmo que existam ações de suporte associadas.

**Formato:**
`<acao>-<entidade>.md`


Onde:
- `<acao>` = verbo no infinitivo que representa a ação principal
- `<entidade>` = substantivo que identifica o recurso (preferencialmente no plural)

**Ações de suporte permitidas (não afetam o nome):**
- filtrar
- ordenar
- paginar
- pesquisar
- selecionar
- destacar

Essas ações **não justificam** a criação de outro requisito nem a alteração do nome.

**Exemplos válidos:**
- `listar-usuarios.md`
- `listar-pdvs.md`
- `criar-doacoes.md`
- `cancelar-doacoes.md`
- `reimprimir-comprovantes.md`
- `visualizar-dados-pdv.md`

**Quando usar este padrão:**

- Quando a ação principal justifica a existência da tela ou fluxo
- Quando as ações secundárias não fazem sentido sem a ação principal

### 1.2 Tipo B — Capacidade ou Fluxo Funcional

Utilize este padrão quando o requisito descrever uma **capacidade do sistema**, um **fluxo completo** ou um **conjunto de ações relacionadas**.

**Formato:**
`<capacidade-ou-processo>.md`


**Regras:**
- Não iniciar com verbo
- Usar substantivo ou substantivo composto
- O nome deve representar a funcionalidade como um todo

**Exemplos válidos:**
- `autenticacao-usuario.md`
- `ativacao-pdv.md`
- `sincronizacao-doacoes-mdc.md`
- `processamento-transacoes.md`
- `conciliacao-recebiveis.md`
- `relatorios-financeiros.md`

**Quando usar este padrão:**

- Quando o requisito envolve múltiplas ações relevantes
- Quando a tela funciona como container funcional
- Quando o escopo não pode ser resumido a um único verbo



### 1.3 Regra de Decisão Rápida

Utilize as regras abaixo para decidir o padrão correto:

- Se o requisito descreve **uma ação principal** → use `<acao>-<entidade>.md`
- Se o requisito descreve **um fluxo ou capacidade** → use `<capacidade>.md`
- Se o conteúdo envolver **mais de um verbo relevante**, não use verbo no nome



### 1.4 Regras Gerais de Nomenclatura

- Utilizar apenas letras minúsculas
- Utilizar hífen (`-`) como separador
- Máximo recomendado: 50 caracteres
- Extensão obrigatória: `.md`
- Não utilizar IDs numéricos no nome do arquivo
- O nome deve ser único dentro do subdomínio
- O nome deve refletir o propósito principal do requisito
- **Seguir a Linguagem Ubíqua:** usar os mesmos termos da documentação, código e testes



### 1.5 Exemplos ❌ Inválidos

- `REQ-001-autenticacao.md` (contém ID)
- `autenticar-usuario.md` (ação reduz escopo indevidamente)
- `criar-editar-excluir-usuarios.md` (múltiplas ações no nome)
- `autenticacao.md` (genérico demais)
- `Autenticacao-Usuario.md` (maiúsculas)
- `autenticacao_usuario.md` (underscore)
- `autenticacao-usuario-do-sistema-com-validacoes.md` (muito longo)

### Padrão Geral
```
descricao-breve-do-requisito.md
```

## 2. Pastas e Diretórios

### Estrutura Padrão
```
requisitos/
 ├── funcionais/
 ├── técnicos/
 ├── fluxos/
 └── discovery/
```

### Regras
- Apenas minúsculas
- Sem espaços (usar hífen)
- Não iniciar com números
- Não pular níveis da hierarquia
- Requisitos não devem ser salvos diretamente no módulo

### Exemplos ✅ Válidos
- `requisitos/` (pasta raiz)
- `requisitos/funcionais/`
- `requisitos/técnicos/`
- `requisitos/fluxos/`
- `templates/` (pasta raiz)

### Exemplos ❌ Inválidos
- `Requisitos/` (maiúscula)
- `requisitos-do-pdv/` (muito descritivo, use `requisitos/`)
- `1_requisitos/` (número no início)

## 3. Imagens e Assets

Imagens e assets visuais devem ser nomeados de forma padronizada para garantir **clareza, rastreabilidade e reutilização**, permitindo identificar o conteúdo **sem a necessidade de abrir o arquivo**.

As imagens **sempre pertencem a uma funcionalidade** e devem refletir o contexto funcional documentado.

### Localizações Possíveis

Imagens podem estar em dois locais:

#### Assets Globais (Raiz)
```
assets/imagens/[categoria]/nome-descritivo.png
```

**Uso:** Imagens institucionais, logos, diagramas conceituais ou artefatos reutilizados em múltiplos módulos ou funcionalidades.

#### Imagens por Funcionalidade (Recomendado)
```
requisitos/<subdominio>/<funcionalidade>/imagens/<categoria>/nome-descritivo.png
```

**Uso:** Screenshots, diagramas e destaques específicos de um módulo funcional.

### Padrão de Nomenclatura de Imagens

```
<tela-ou-processo>-<componente-ou-foco>-<complemento>.ext
```

Onde:
- `<tela-ou-processo>`  Nome da tela ou fluxo principal ao qual a imagem se refere.  
  Exemplos:  `listagem-usuarios`, `cadastro-ec`, `coleta-doacao`
- `<componente-ou-foco>`  Elemento da tela ou parte específica em destaque.  
  Exemplos:  `filtros`, `tabela`, `formulario`, `campo-status`, `validacao`
- `<complemento>`  Bloco **obrigatório** que identifica o tipo da imagem e pode ser **estendido** para detalhar estados ou variações.

- `.ext` = extensão (png, jpg, svg)

### Regras
- Pasta: `assets/imagens/` (global) ou `<subdominio>/imagens/` (local)
- Subcategorias: `screenshots/`, `diagramas/`, `logos/`, `fluxos/` (conforme necessidade)
- Nome: **kebab-case** (minúsculas, hífens), máximo 50 caracteres
- Formato: PNG (preferido), JPG ou SVG
- Resolução: 72 DPI mínimo para web
- Tamanho: máximo 500KB por imagem

### Exemplos ✅ Válidos

**Global:**
- `assets/imagens/logos/logo-produto.png`
- `assets/imagens/diagramas/arquitetura-sistema.png`

**Por módulo:**
- `requisitos/funcionais/autenticacao/imagens/screenshots/login-tela.png`
- `requisitos/funcionais/autenticacao/imagens/screenshots/login-validacao-destaque.png`
- `requisitos/funcionais/coleta-doacoes/imagens/screenshots/coleta-doacao-formulario.png`
- `requisitos/funcionais/coleta-doacoes/imagens/diagramas/fluxo-coleta-sequencia.png`
- `requisitos/técnicos/integracao-cielo/imagens/diagramas/integracao-cielo-arquitetura.png`

### Exemplos ❌ Inválidos
- `assets/Imagens/` (maiúscula)
- `assets/imagens/screenshot_01.png` (underscore, muito genérico)
- `assets/imagens/Screenshot_Tela.PNG` (maiúsculas)
- `assets/imagens/tela1.png` (sem contexto)
- `assets/imagens/print-final-ok.jpg` (subjetivo, sem relevância funcional)

## 4. Anexos e Arquivos de Apoio

### Padrão
```
<processo>-<tipo-arquivo>-<origem-ou-fornecedor>.ext
```

Onde:
- `<processo>` = processo funcional ou domínio (ex: `importacao`, `conciliacao`, `ativacao`, `integracao`)
- `<tipo-arquivo>` = tipo ou layout do arquivo (ex: `cnab240`, `layout-extrato`, `exemplo-resposta`, `modelo-api`)
- `<origem-ou-fornecedor>` = banco, adquirente ou sistema origem (ex: `banco-brasil`, `cielo`, `sistema-origem`)
- `.ext` = extensão (txt, csv, json, xml, sql, etc)

### Regras
- Nome: **kebab-case** (minúsculas, hífens)
- Localização: `<dominio>/<subdominio>/anexos/` ou `requisitos/<dominio>/<subdominio>/anexos/`
- Sem acentos ou caracteres especiais
- O nome deve deixar claro o que contém e de onde vem

### Exemplos ✅ Válidos

**Arquivos de integração:**
- `integracao-cielo-exemplo-resposta-autenticacao.json`
- `integracao-sistema-externo-modelo-webhook.json`
- `integracao-cielo-documentacao-api.pdf`

**Layouts e formatos:**
- `importacao-cnab240-banco-brasil.txt`
- `importacao-cnab240-bradesco.txt`
- `extrato-vendas-cielo04-exemplo.csv`
- `extrato-transacoes-sistema-externo-exemplo.json`

**Modelos e templates:**
- `modelo-requisicao-cielo-venda.json`
- `modelo-resposta-sistema-externo-webhook.json`
- `template-sincronizacao-doacoes.sql`

### Exemplos ❌ Inválidos
- `exemplo.json` (muito genérico)
- `API_Cielo_v2.pdf` (maiúsculas, sem contexto claro)
- `cielo_resposta_ok.json` (underscore, subjetivo)
- `novo_arquivo.txt` (sem significado funcional)

## 5. Referências Cruzadas

Ao referenciar requisitos em documentos, use o **nome do arquivo** como identificador principal:

### Formato
```markdown
[Autenticação do Operador](requisitos/funcionais/autenticacao/autenticacao-usuario.md)
```

### Com Contexto Jira
Se necessário rastrear pelo Jira, inclua o ID da tarefa de especificação no documento:

```markdown
| **Card Jira** | [DCU-604](https://jira.empresa.com/browse/DCU-604) |
```

### Exemplo Completo
```markdown
Este requisito depende de [Ativação do Terminal](requisitos/funcionais/autenticacao/ativacao-terminal.md).

Referência de especificação: Tarefa Jira [DCU-604](https://jira.url)
```

### Boas Práticas
- Use nomes descritivos nos links (não `REQ-001` ou `requisito-1`)
- Mantenha IDs Jira apenas para rastreabilidade de tarefas, não para nomenclatura de arquivos
- Links internos devem ser relativos e funcionar em qualquer branch

---

## Checklist de Nomenclatura

Antes de fazer commit:

- [ ] Arquivo nomeado com descrição clara em minúsculas e hífens
- [ ] Sem IDs numéricos no nome do arquivo
- [ ] Sem caracteres especiais ou espaços
- [ ] Pasta correta conforme estrutura (funcionais/, técnicos/, etc)
- [ ] Imagens (se houver) em pasta `imagens/` do subdomínio ou em `assets/imagens/`
- [ ] Nomes de imagens seguem padrão
- [ ] Referências cruzadas usam nomes descritivos, não IDs
- [ ] ID Jira referenciado apenas no cabeçalho do documento

---
