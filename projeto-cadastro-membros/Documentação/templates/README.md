# Templates

Este diretório concentra os templates oficiais utilizados para a criação de artefatos de documentação nos projetos da Igreja Universal.

Os templates definem padrões estruturais, semânticos e normativos, com o objetivo de garantir consistência, clareza, rastreabilidade e escalabilidade na documentação dos produtos e sistemas.

A estrutura foi projetada para evoluir ao longo do tempo, suportando diferentes tipos de artefatos, como requisitos, diagramas, fluxos e outros documentos de apoio.

## Visão Geral

O modelo adotado separa claramente:

- Templates: modelos reutilizáveis que orientam a criação de documentos.
- Conteúdo real: documentos efetivamente utilizados nos projetos (armazenados fora deste diretório).

Dentro de templates, os arquivos são organizados por tipo de artefato, e não por projeto ou sistema.

## Estrutura de Templates

```text
cadastro-membros/
    ├─ README.md
    └─ templates/
       ├─ README.md
       ├─ release-notes/
       │  └─ template-release-notes-base.md
       └─ requisitos/
          ├─ base/
          │  └─ template-requisito-base.md
          ├─ tipo-a/
          │  ├─ criar/
          │  │  └─ template-criar.md
          │  ├─ editar/
          │  │  └─ template-editar.md
          │  ├─ listar/
          │  │  └─ template-listar.md
          │  └─ visualizar/
          ├─ tipo-b/
          │  └─ requisito-capacidade.md
          └─ prompts/
             ├─ README.md
             └─ (prompts unificados)
```

## Tipos de Templates

### Templates de Requisitos

Localizados em `.luby/templates/requisitos/`, são utilizados para documentar funcionalidades, regras e comportamentos do sistema.

Esses templates seguem um modelo, composto por:

- Um template base, que define a estrutura mínima obrigatória de um requisito.
- Templates derivados, especializados por contexto ou tipo de funcionalidade.

#### Categorias atuais

- **Base:** Define a estrutura canônica do requisito, incluindo contextualização, escopo, regras, critérios de aceite, permissões e histórico.
- **Tipo A:** Templates para requisitos operacionais com interface (CRUD), organizados por ação:
  - Criar
  - Editar
  - Listar
  - Visualizar
- **Tipo B:** Templates para requisitos de capacidade/volume e outros requisitos não orientados a CRUD.
- **Prompts:** Biblioteca de instruções unificadas por seção, utilizada pelos templates para manter padronização e rastreabilidade.

Novos templates e categorias são adicionados conforme padrões reais são identificados e consolidados.

### Templates de Release Notes

Localizados em `.luby/templates/release-notes/`, são utilizados para documentar entregas de versões de sistemas em formato padronizado.

O template base cobre: visão geral da entrega, histórias entregues (com rastreabilidade Jira), funcionalidades por épico, melhorias, recomendações de teste, ações de implantação, riscos, documentação de requisitos e contatos de suporte.

### Templates de Diagramas

> Esta categoria será adicionada quando os padrões de diagramas forem consolidados.

## Como Utilizar os Templates

1. Identifique o tipo de artefato que será criado (requisito, diagrama, etc.).
2. Acesse o diretório correspondente dentro de templates.
3. Selecione o template mais adequado ao contexto.
4. Copie o conteúdo do template.
5. Crie um novo arquivo no diretório apropriado de conteúdo (ex.: /requisitos).
6. Preencha apenas as seções aplicáveis, removendo aquelas que não fizerem sentido.

## Templates Disponíveis

### Requisitos

- [Template Base de Requisito](requisitos/base/template-requisito-base.md)
- [Template Tipo A - Criar (CRUD)](requisitos/tipo-a/criar/template-criar.md)
- [Template Tipo A - Editar (CRUD)](requisitos/tipo-a/editar/template-editar.md)
- [Template Tipo A - Listar (CRUD)](requisitos/tipo-a/listar/template-listar.md)
- [Template Tipo B - Requisito de Capacidade](requisitos/tipo-b/requisito-capacidade.md)

### Release Notes

- [Template Base de Release Notes](release-notes/template-release-notes-base.md)

### Prompts Unificados

- [Índice de Prompts](requisitos/prompts/README.md)

## Evolução dos Templates

Os templates são evoluídos de forma incremental e colaborativa.

Sempre que um novo tipo de funcionalidade ou artefato surgir:

- Um novo template pode ser criado.
- Um template existente pode ser refinado.
- Ajustes devem refletir aprendizados reais e uso prático.

Evita-se a criação de templates sem aplicação concreta.

## Uso por PO e Agentes de IA

Product Owners e Agentes de IA devem:

- Selecionar o template conforme o tipo de artefato.
- Respeitar a estrutura e as regras definidas.
- Excluir seções opcionais quando não houver conteúdo aplicável.
- Não alterar caminhos institucionais (ex.: logo).
- Manter o histórico de alterações atualizado.

---


