# Agentes Cadastro Membros

Agentes e skills utilizados pelo time de POs.

Os arquivos são distribuídos automaticamente para cada ferramenta de IA utilizada pelo time via `sync.sh`.

## Agentes disponíveis

| Nome | Descrição | Arquivo |
|---|---|---|
| Commit Padronizado | Commita alterações seguindo o padrão do GIT_WORKFLOW.md | `commit-padronizado.agent.md` |
| Revisor de Requisitos | Revisão crítica de requisitos funcionais — lacunas, ambiguidades, perguntas para PO | `revisor-requisitos.agent.md` |
| Descrição de História Jira | Gera o texto de descrição de história Jira a partir dos commits e requisitos da branch | `descricao-historia-jira.agent.md` |
| Analista de Código Fonte | Analisa código-fonte existente e produz contexto funcional para o Escritor de Requisitos | `analista-codigo-fonte.agent.md` |
| Escritor de Requisitos | Escreve requisitos funcionais completos no padrão thiago-spec-kit | `escritor-requisitos.agent.md` |
| Revisor de Branch e Preparação para PR | Revisa arquivos alterados na branch contra a destino, valida padrões e gera relatório ou prévia do PR | `revisor-branch-pr.agent.md` |
| Gerador de Requisito a partir do Jira | Gera requisito funcional completo a partir de notas brutas ou exportação do Jira | `gerador-requisito-jira.agent.md` |
| Auditor Requisitos vs Código | Orquestra auditoria cruzada entre requisitos funcionais e código-fonte, delegando para agentes especializados com aprovação do PO | `auditor-requisitos-codigo.agent.md` |

## Skills disponíveis

Skills são atalhos rápidos que delegam para um agente existente.

| Arquivo | Nome | Agente base |
|---|---|---|
| `prompts/revisao-rapida-requisito.skill.md` | Revisão Rápida de Requisito | Revisor de Requisitos |

## Como configurar na sua ferramenta

A pasta `Documentação/agents/` é a fonte da verdade. Cada pessoa configura sua ferramenta para apontar para cá.

### Claude Code (VS Code)

```bash
bash Documentação/agents/sync.sh claude
```

Cria um symlink de `.claude/commands/` para `Documentação/agents/`. Reinicie o VS Code após executar.

### Copilot Pro (VS Code)

```bash
bash Documentação/agents/sync.sh copilot
```

Copia os arquivos para `.github/instructions/`. Os arquivos gerados não são versionados.

### Outras ferramentas

Configure manualmente sua ferramenta para ler arquivos `.md` de `Documentação/agents/`, ou copie os arquivos para o diretório exigido pela ferramenta.

## Como adicionar um novo agente

1. Crie o arquivo seguindo a convenção em `docs/AGENT_CONVENTIONS.md`
2. Faça commit com prefixo `chore:`
3. Cada pessoa re-executa o script de setup da sua ferramenta

## Como usar cada agente

### Auditor Requisitos vs Código

**Arquivo:** `auditor-requisitos-codigo.agent.md`

**Quando usar:** quando você precisa verificar se os requisitos funcionais documentados ainda refletem o comportamento real do código-fonte. Ideal após ciclos de desenvolvimento sem atualização de documentação ou antes de uma entrega.

**O que ele faz:** orquestra um pipeline de 5 etapas —  Mapeamento do escopo, análise do código, geração de contexto, revisão cruzada e aprovação do PO — delegando para os agentes especializados (`Analista de Código Fonte`, `Revisor de Requisitos` e `Escritor de Requisitos`). **Nenhuma alteração é feita sem aprovação explícita.**

#### Como invocar

No chat do Copilot ou Claude, selecione o agente **Auditor Requisitos vs Código** e informe:

```
Audite o módulo [nome do módulo].
Repositório de código: [caminho ou URL do repo de código]
Repositório de requisitos: [caminho ou diretório]
PO responsável: [nome]
Card Jira: [ex: CM-123] (opcional)
```

**Exemplo real:**
```
Audite o módulo de autenticação.
Repositório de código: ../cadastro-de-membros/src/auth
Repositório de requisitos: requisitos/autenticacao-login
PO responsável: Alexandre
```

#### Fluxo de execução

```
Etapa 0 — Mapeamento do escopo (lista todos os requisitos do módulo)
    ↓
Etapa 1 — Análise do código-fonte (por requisito, via @Analista de Código Fonte)
    ↓
Etapa 2 — Comparação: código vs documentação (divergências por severidade)
    ↓
Etapa 3 — Revisão qualitativa (via @Revisor de Requisitos)
    ↓
Etapa 4 — Apresentação ao PO → aprovação → execução (via @Escritor de Requisitos)
```

#### O que esperar como saída

Para cada requisito auditado, o agente apresenta:

- **Status geral:** `Conforme`, `Precisa ajustes`, `Desatualizado` ou `Incompleto`
- **Divergências** classificadas por severidade (Alta / Média / Baixa)
- **Perguntas** para o PO decidir antes de qualquer alteração
- **Ações propostas** com checkbox para aprovação item a item

Após aprovação do PO, as alterações são aplicadas automaticamente pelo Escritor de Requisitos com versionamento correto.

#### Dicas

- Processe **um módulo por vez** para manter foco e qualidade
- Se o escopo for grande, comece pelos módulos com entregas recentes ou com maior dívida documental
- O agente respeita o princípio "código é a fonte de verdade" — comportamentos implementados prevalecem sobre suposições

---

## Convenções

Consulte `docs/AGENT_CONVENTIONS.md` para regras completas de nomenclatura, frontmatter e estrutura de conteúdo.
