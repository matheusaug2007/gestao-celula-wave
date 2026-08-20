[Cadastro Membros](../../README.md) > [Spec Kit](./README.md) > **Estrutura de Arquivos**

---

# 📂 Estrutura de Pastas e Arquivos

Documentação completa da estrutura esperada do repositório.

## 1. Estrutura Raiz

```
cadastro-membros/
├── Documentação/             # Configurações e diretrizes operacionais
│   ├── thiago-spec-kit/      # Kit de padrões e convenções
│   │   ├── README.md           # Índice do Spec Kit
│   │   ├── GUIDELINES.md       # Guia geral de contribuição
│   │   ├── NAMING_CONVENTIONS.md   # Padrões de nomenclatura
│   │   ├── GIT_WORKFLOW.md     # Workflow Git e commits
│   │   ├── FILE_STRUCTURE.md   # Este arquivo
│   │   └── STANDARDS.md        # Padrões de documentação de requisitos
│   │
│   ├── templates/              # Templates reutilizáveis (uso por POs e IAs)
│   │   ├── README.md           # Documentação de templates
│   │   └── requisitos/         # Templates de requisitos
│   │       ├── base/           # Template base
│   │       ├── tipo-a/         # Templates de requisitos Tipo A (CRUD)
│   │       ├── tipo-b/         # Templates de requisitos Tipo B (Capacidade)
│   │       └── prompts/        # Prompts centralizados para preenchimento
│   │
│   └── word-exporter/          # Ferramentas de exportação para Word (.docx)
│
├── assets/                     # Recursos estáticos (globais)
│   ├── imagens/               # Imagens institucionais
│   │   ├── logos/             # Logos institucionais
│   │   ├── icons/             # Ícones globais
│   │   └── diagramas-globais/ # Diagramas conceituais e arquitetura
│   └── logo-produto.png       # Logo principal
│
├── requisitos/                 # Documentação de requisitos
│   ├── README.md              # Guia de requisitos
│   ├── funcionais/            # Requisitos funcionais
│   │   ├── <dominio-1>/        # Domínio (ex: cadastros/)
│   │   │   └── <subdominio-1>/ # Subdomínio (ex: modelos-equipamentos/)
│   │   │       ├── listar-modelos-equipamentos.md
│   │   │       ├── criar-modelo-equipamento.md
│   │   │       ├── editar-modelo-equipamento.md
│   │   │       ├── fluxos/        # Fluxos e diagramas do subdomínio
│   │   │       ├── imagens/       # Imagens do subdomínio
│   │   │       └── anexos/        # Anexos do subdomínio
│   │   ├── <dominio-2>/        # Domínio (ex: solicitacoes/)
│   │   │   └── <subdominio-2>/ # Subdomínio (ex: equipamentos/)
│   │   │       ├── criar-solicitacao-equipamento.md
│   │   │       ├── aprovar-solicitacao.md
│   │   │       ├── fluxos/        # Fluxos e diagramas do subdomínio
│   │   │       ├── imagens/       # Imagens do subdomínio
│   │   │       └── anexos/        # Anexos do subdomínio
│   │   └── ...
│   ├── técnicos/              # Requisitos técnicos
│   │   ├── <dominio-1>/        # Domínio técnico (ex: integracoes/)
│   │   │   └── <subdominio-1>/ # Subdomínio (ex: api-externa/)
│   │   │       ├── integracao-sistema-externo.md
│   │   │       ├── autenticacao-api.md
│   │   │       ├── fluxos/        # Fluxos e diagramas do subdomínio
│   │   │       ├── imagens/       # Imagens do subdomínio
│   │   │       └── anexos/        # Anexos do subdomínio
│   │   └── ...
│   └── discovery/             # Descobertas e validações
│       ├── discovery-*.md
│       └── ...
│
├── README.md                   # Documentação principal do repositório
├── CONTRIBUTING.md             # Guia de contribuição (público)
└── .gitignore                 # Git ignore rules
```

## 2. Pasta `Documentação/` (Operacional)

### Propósito
Contém documentação operacional, padrões e diretrizes do projeto.

### Estrutura
```
Documentação/
├── thiago-spec-kit/        # Kit de padrões e convenções
│   ├── README.md           # Índice do Spec Kit
│   ├── GUIDELINES.md       # Guia geral de contribuição e operação
│   ├── NAMING_CONVENTIONS.md   # Padrões de nomenclatura
│   ├── GIT_WORKFLOW.md     # Fluxo Git, padrões de branch e commit
│   ├── FILE_STRUCTURE.md   # Este arquivo (estrutura esperada)
│   └── STANDARDS.md        # Padrões para escrita e qualidade de requisitos
│
├── templates/              # Templates reutilizáveis (uso por POs e IAs)
│   ├── README.md           # Documentação de templates
│   └── requisitos/         # Templates de requisitos
│       ├── base/           # Template base
│       ├── tipo-a/         # Templates Tipo A (CRUD)
│       ├── tipo-b/         # Templates Tipo B (Capacidade)
│       └── prompts/        # Prompts centralizados
│
└── word-exporter/          # Ferramentas de exportação para Word (.docx)
    ├── README.md           # Documentação completa
    ├── EXPORTACAO-WORD.md  # Guia detalhado com parâmetros avançados
    ├── GUIA-RAPIDO-EXPORTACAO.md  # Início rápido em 3 passos
    ├── CHANGELOG.md        # Histórico de versões
    ├── exportar-para-word.ps1     # Script principal de exportação
    ├── exportar-rapido.ps1        # Script com menu interativo
    ├── instalar-dependencias.ps1  # Instalação do Pandoc
    ├── gerar-template-word.ps1    # Geração de template .docx personalizável
    ├── preprocessor.ps1           # Pré-processamento de Markdown
    ├── format-bdd.lua             # Filtro Lua para formatação BDD
    └── resize-images.lua          # Filtro Lua para redimensionamento de imagens
```

### Spec Kit
Conjunto de padrões e convenções para documentação de requisitos:

- **README.md** – Índice e guia de uso do kit
- **GUIDELINES.md** – Guia geral de contribuição e operação
- **NAMING_CONVENTIONS.md** – Padrões de nomenclatura para arquivos, pastas, commits
- **GIT_WORKFLOW.md** – Fluxo Git, padrões de branch e commit
- **FILE_STRUCTURE.md** – Este arquivo (estrutura esperada)
- **STANDARDS.md** – Padrões para escrita e qualidade de requisitos

### Templates
Recursos operacionais para criação de documentação, organizados por tipo e ação. Acessíveis por POs e agentes de IA, mas não exibidos como conteúdo de leitura principal do repositório.

## 2.1 Versionamento de Documentos

### Versão no Cabeçalho

Todo documento de requisito deve conter um cabeçalho de versão no topo (antes do título):

```markdown
**Versão:** X.Y | **Última Atualização:** YYYY-MM-DD
```

Onde:
- **X** = Versão em **produção** (publicada em `main`)
- **Y** = Versão em **homologação** (aprovada em `spec-approved`)

### Regra de Incremento

- **Incrementar X**: Ao fazer merge em `main` (publicação oficial)
  - Representa: Documentação disponível para usuários finais
  - Exemplo: 1.0 → 2.0 (ao fazer merge spec-approved → main)

- **Incrementar Y**: Ao fazer merge em `spec-approved` (aprovação cliente)
  - Representa: Documentação validada e pronta para DEV trabalhar
  - Exemplo: 1.0 → 1.1 (ao fazer merge spec → spec-approved)

### Observações

- ⚠️ **Não altere a versão em branches isoladas** (`spec/`, `discovery/`, etc.)
- A versão é atualizada **apenas no momento do merge**
- O Git mantém o histórico detalhado via commits e PRs
- A versão indica o **estado oficial de consumo**, não histórico granular

### Exemplo de Evolução

```
Branch spec/DCU-604 (trabalho isolado)
  ↓ [não altera versão]
Merge em spec-approved → Versão 1.1 (cliente aprova)
  ↓ [incrementa Y]
Merge em main → Versão 2.0 (publicação oficial)
  ↓ [incrementa X, reinicia Y em 0]
```

## 3. Pasta `assets/` (Raiz do Repositório)

### Propósito
A pasta `assets/` na raiz do repositório é **exclusiva para arquivos institucionais ou globais**, utilizados em mais de um contexto. **NÃO contém imagens de funcionalidades específicas** — essas devem estar nas pastas `imagens/` dos módulos correspondentes.

### Exemplos de Uso
- Logotipo do cliente
- Imagens institucionais (ícones globais, padrões visuais)
- Diagramas conceituais globais (arquitetura geral do sistema, não fluxos de funcionalidades)

### Subpastas

#### `assets/imagens/`
```
imagens/
├── logos/               # Logos institucionais
├── icons/               # Ícones globais reutilizáveis
└── diagramas-globais/   # Diagramas conceituais e arquitetura global
```

#### `assets/imagens/logos/`
```
logos/
├── logo-produto.png
├── logo-cliente.png
└── ...
```

#### `assets/imagens/icons/`
```
icons/
├── icone-check.png
├── icone-erro.png
├── icone-menu.png
└── ...
```

#### `assets/imagens/diagramas-globais/`
```
diagramas-globais/
├── arquitetura-sistema.png          # Arquitetura geral
├── fluxo-dados-global.png           # Fluxo de dados geral
└── diagrama-componentes.png         # Componentes principais
```

### Regras
- Formato: PNG (preferido), JPG, SVG
- Resolução: 72 DPI mínimo para web
- Tamanho: Comprimido (máx 500KB por imagem)
- Nome: minúsculas com hífens (vide NAMING_CONVENTIONS.md)
- **Screenshots e diagramas de funcionalidades → pasta `imagens/` do subdomínio correspondente**

## 3.1 Pasta `imagens/` por Subdomínio (Recomendado)

### Propósito
Cada subdomínio funcional pode (e deve) possuir suas próprias pastas internas para arquivos de apoio, especialmente imagens relacionadas àquele subdomínio específico.

### Estrutura Recomendada
```
<produto>-docs
    └── requisitos/
        ├── README.md
        └── funcionais/                     # ou técnicos/
            └── <dominio>/                  # ex: cadastros/
                └── <subdominio>/           # ex: modelos-equipamentos/
                    ├── <requisito>.md
                    ├── fluxos/
                    ├── imagens/
                    └── anexos/
```

### Benefícios
- **Links relativos curtos**: Reduz risco de quebra quando a estrutura evolui
- **Organização modular**: Fluxos, imagens e anexos agrupados com seus requisitos relacionados
- **Manutenção facilitada**: Fácil identificar quais arquivos pertencem a cada subdomínio
- **Escalabilidade**: Funciona bem conforme o projeto cresce

### Exemplo Prático
```
requisitos/
├── funcionais/
│   ├── cadastros/                          # Domínio
│   │   └── modelos-equipamentos/           # Subdomínio
│   │       ├── listar-modelos-equipamentos.md
│   │       ├── criar-modelo-equipamento.md
│   │       ├── editar-modelo-equipamento.md
│   │       ├── fluxos/
│   │       │   └── fluxo-cadastro-modelo.md
│   │       ├── imagens/
│   │       │   └── screenshots/
│   │       │       ├── listagem-modelos-tela.png
│   │       │       └── cadastro-modelo-formulario.png
│   │       └── anexos/
│   │
│   └── operacoes/                          # Outro domínio
│       └── coleta-doacoes/                 # Subdomínio
│           ├── coletar-doacao-cartao.md
│           ├── validar-transacao.md
│           ├── fluxos/
│           │   └── fluxo-coleta-doacao.md
│           ├── imagens/
│           │   └── screenshots/
│           │       └── tela-coleta-doacao.png
│           └── anexos/
```

## 4. Pasta `Documentação/templates/`

### Localização
`Documentação/templates/`

### Propósito
Templates reutilizáveis para novos requisitos e documentação, organizados por tipo e ação. **Não são exibidos como conteúdo de leitura**, mas sim como recursos operacionais para POs e agentes de IA.

### Estrutura de Templates
```
.luby/templates/
├── README.md                      # Documentação de templates
├── requisitos/                    # Templates de requisitos
│   ├── base/
│   │   └── template-requisito-base.md    # Template base para todos os requisitos
│   │
│   ├── tipo-a/                   # Templates para requisitos Tipo A (CRUD)
│   │   ├── criar/
│   │   │   └── template-criar.md
│   │   ├── editar/
│   │   │   └── template-editar.md
│   │   ├── listar/
│   │   │   └── template-listar.md
│   │   └── visualizar/
│   │       └── template-visualizar.md
│   │
│   ├── tipo-b/                   # Templates para requisitos Tipo B (Capacidade)
│   │   └── template-capacidade.md
│   │
│   └── prompts/                  # Prompts centralizados para preenchimento de seções
│       ├── prompt-cabecalho-unificado.md
│       ├── prompt-contextualizacao-unificada.md
│       ├── prompt-criterios-aceite-unificados.md
│       ├── prompt-fluxos-navegacao-unificado.md
│       ├── prompt-historico-alteracoes-unificado.md
│       ├── prompt-mensagens-estados-unificado.md
│       ├── prompt-permissoes-regras-acesso-unificado.md
│       ├── prompt-referencias-requisito-unificado.md
│       └── prompt-regras-comportamentos-sistema-unificado.md
```

### Como Usar
1. Acesse a pasta `Documentação/templates/requisitos/`
2. Copie o arquivo template apropriado conforme o tipo de requisito
3. Renomeie com padrão correto (vide NAMING_CONVENTIONS.md)
4. Mova para a pasta apropriada em `requisitos/`
5. Referencie os prompts centralizados via comentários `<!-- @include ./.luby/templates/requisitos/prompts/prompt-*.md -->`
6. Preencha conforme necessário
7. Delete as instruções iniciais

### Prompts Centralizados
Os prompts unificados fornecem instruções padronizadas para cada seção do requisito, garantindo consistência em toda a documentação. Cada prompt contém:
- **Objetivo**: O que deve ser documentado na seção
- **Resumo Rápido**: Guia conciso de preenchimento
- **Exemplos**: Modelos de formato esperado
- **Checklist**: Validação do conteúdo preenchido

## 5. Pasta `requisitos/`

### Estrutura Geral
```
requisitos/
├── README.md              # Documentação da pasta
├── funcionais/            # Requisitos funcionais (RF)
│   ├── <dominio>/             # Domínio (ex: cadastros, solicitacoes)
│   │   └── <subdominio>/      # Subdomínio (ex: modelos-equipamentos)
│   │       ├── <nome-requisito>.md
│   │       ├── fluxos/        # Fluxos e diagramas do subdomínio
│   │       ├── imagens/       # Imagens do subdomínio
│   │       └── anexos/        # Anexos do subdomínio
│   └── ...
├── técnicos/              # Requisitos técnicos (RT)
│   ├── <dominio>/             # Domínio técnico (ex: integracoes, infraestrutura)
│   │   └── <subdominio>/      # Subdomínio (ex: api-externa, sincronizacao)
│   │       ├── <nome-requisito>.md
│   │       ├── fluxos/        # Fluxos e diagramas do subdomínio
│   │       ├── imagens/       # Imagens do subdomínio
│   │       └── anexos/        # Anexos do subdomínio
│   └── ...
└── discovery/             # Documentação de descobertas
```

### 5.1 Pasta `requisitos/funcionais/`

**Propósito:** Requisitos que descrevem funcionalidades esperadas do sistema.

**Organização por Domínio/Subdomínio (Recomendado):**
```
funcionais/
├── cadastros/                     # Domínio
│   ├── modelos-equipamentos/      # Subdomínio
│   │   ├── listar-modelos-equipamentos.md
│   │   ├── criar-modelo-equipamento.md
│   │   ├── editar-modelo-equipamento.md
│   │   ├── excluir-modelo-equipamento.md
│   │   ├── inativar-modelo-equipamento.md
│   │   ├── fluxos/
│   │   │   └── fluxo-cadastro-modelo.md
│   │   ├── imagens/
│   │   │   └── screenshots/
│   │   │       ├── listagem-modelos-tela.png
│   │   │       └── cadastro-modelo-formulario.png
│   │   └── anexos/
│   │
│   └── fornecedores/              # Outro subdomínio
│       └── ...
│
├── solicitacoes/                  # Outro domínio
│   └── equipamentos/              # Subdomínio
│       ├── criar-solicitacao-equipamento.md
│       ├── aprovar-solicitacao.md
│       └── ...
│
└── ...
```

**Regra de Links Internos:**
- Dentro de um subdomínio, use caminhos relativos: `./imagens/screenshots/listagem-modelos-tela.png`
- Para imagens globais em `assets/`, use: `../../../../assets/imagens/logos/logo-produto.png`

**Seções Esperadas no Arquivo:**
- Identificação (ID Jira, Status)
- Resumo Executivo
- Descrição Detalhada
- Requisitos Funcionais (RF-1, RF-2, ...)
- Critérios de Aceitação
- Casos de Teste
- Dependências

### 5.2 Pasta `requisitos/técnicos/`

**Propósito:** Requisitos técnicos, integrações, especificações arquiteturais.

**Organização por Domínio/Subdomínio (Recomendado):**
```
técnicos/
├── integracoes/                   # Domínio técnico
│   ├── api-externa/               # Subdomínio
│   │   ├── integracao-sistema-externo.md
│   │   ├── autenticacao-api.md
│   │   ├── fluxos/
│   │   │   └── sequencia-integracao.png
│   │   ├── imagens/
│   │   │   └── diagramas/
│   │   │       └── arquitetura-integracao.png
│   │   └── anexos/
│   │       └── especificacoes/
│   │
│   └── servicos-internos/         # Outro subdomínio
│       └── ...
│
├── infraestrutura/                # Outro domínio técnico
│   └── sincronizacao/             # Subdomínio
│       ├── sincronizacao-dados.md
│       ├── tratamento-erro-rede.md
│       └── ...
│
└── ...
```

**Regra de Links Internos:**
- Dentro de um subdomínio, use caminhos relativos: `./imagens/diagramas/arquitetura-integracao.png`
- Para imagens globais em `assets/`, use: `../../../../assets/imagens/diagramas/fluxo-arquitetura.png`

**Seções Esperadas:**
- Identificação (ID Jira, Status)
- Descrição Técnica
- Requisitos Técnicos (RT-1, RT-2, ...)
- Integrações e APIs
- Padrões e Frameworks
- Considerações de Performance

### 5.3 Pasta `requisitos/discovery/`

**Propósito:** Documentação de descobertas, validações, pesquisas com stakeholders.

**Padrão de Nome:** `discovery-<assunto>.md` ou `discovery-<data>-<assunto>.md`

**Exemplo de Conteúdo:**
```
discovery/
├── discovery-2026-01-usuario-church.md
├── discovery-2026-02-casos-erro.md
├── discovery-validacao-cielo.md
└── ...
```

**Seções Esperadas:**
- Data da Descoberta
- Stakeholders Envolvidos
- Findings (Descobertas)
- Recomendações
- Requisitos Derivados (links para requisitos existentes)

## 6. Arquivo `README.md` (Raiz)

### Localização
`cadastro-membros/README.md`

### Propósito
Documentação principal do repositório. Primeiro arquivo que leitores acessam.

### Seções Obrigatórias
1. Logo e Título
2. Descrição breve
3. Objetivo
4. Requisitos (link para pasta)
5. Estrutura de Pastas
6. Público-Alvo
7. Visão Geral do Produto
8. Integrações
9. Como Contribuir (link para CONTRIBUTING.md)
10. Referências

## 7. Arquivo `CONTRIBUTING.md`

### Localização
`cadastro-membros/CONTRIBUTING.md`

### Propósito
Guia público de contribuição para colaboradores.

### Seções
1. Como Contribuir (fluxo)
2. Padrões de Código/Documentação
3. Reportar Bugs
4. Processo de Review
5. Links Úteis

## 8. .gitignore

### Conteúdo Recomendado
```
# Sistema Operacional
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Dependências (se usado)
node_modules/
__pycache__/

# Logs
*.log

# Temporários
.tmp/
*.tmp

# Builds
dist/
build/
```

## 9. Checklist de Estrutura

Ao iniciar novo requisito ou documento:

- [ ] Pasta correta conforme tipo (`funcionais/`, `técnicos/`, etc)
- [ ] Organizado em estrutura domínio/subdomínio (ex: `funcionais/cadastros/modelos-equipamentos/`)
- [ ] Nome segue padrão NAMING_CONVENTIONS.md
- [ ] Template apropriado usado como base
- [ ] Fluxos em pasta `fluxos/` do subdomínio
- [ ] Imagens em pasta `imagens/` do subdomínio (recomendado) ou em `assets/imagens/` (global)
- [ ] Links internos funcionando (caminhos relativos curtos para arquivos locais)
- [ ] README de pasta (se nova pasta criada)
- [ ] Commit message segue GIT_WORKFLOW.md

---
