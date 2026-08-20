# Template Base de Requisitos

## 📋 Sobre Este Template

O **template-requisito-base.md** é o template genérico universal para documentação de requisitos funcionais.

Este template serve como:
- **Molde padrão** para qualquer tipo de requisito
- **Fallback** quando nenhum template específico atende ao caso de uso
- **Referência** para criação de novos templates especializados

## 🎯 Quando Usar

Use este template quando:

✅ O requisito **NÃO** se encaixa em nenhum template específico (Criar, Editar, Listar)
✅ Você está documentando um tipo de funcionalidade **não-CRUD**
✅ Você está criando um requisito **genérico** ou **híbrido**
✅ Você precisa de **máxima flexibilidade** na estrutura

## ❌ Quando NÃO Usar

Prefira templates específicos quando aplicável:

| Caso de Uso | Template Recomendado |
|-------------|---------------------|
| Tela de criação de entidade | [`telas/template-criar.md`](../telas/template-criar.md) |
| Tela de edição de entidade | [`telas/template-editar.md`](../telas/template-editar.md) |
| Tela de listagem de entidades | [`telas/template-listar.md`](../telas/template-listar.md) |
| Outro tipo | **Use este template** |

## 📚 Estrutura do Template

O template contém as seguintes seções:

### Obrigatórias
1. **Cabeçalho** (Logo, Breadcrumb, Versão)
2. **Contextualização** (Por que o requisito existe)
3. **Detalhamento Funcional** (Como o sistema se comporta)
4. **Cenários de Comportamento (BDD)** ⭐ (Exemplos testáveis)
5. **Permissões e Regras de Acesso**
6. **Histórico de Alterações**

### Opcionais
- **Mensagens e Estados** (quando relevante)
- **Fluxos Relacionados e Navegação** (quando houver relações)
- **Regras e Comportamentos do Sistema** (quando houver regras transversais)
- **Referências do Requisito** (protótipos, diagramas, etc.)

## 🆕 Atualização BDD (v1.1 - 11/02/2026)

Este template foi atualizado para incluir a seção **"Cenários de Comportamento"** seguindo a metodologia BDD (Behavior-Driven Development).

**Principais mudanças:**
- ❌ Removida seção "Critérios de Aceite" (formato antigo)
- ✅ Adicionada seção "Cenários de Comportamento (BDD)"
- ✅ Estrutura Given-When-Then com dados concretos
- ✅ Pronto para automação de testes

**Saiba mais:**
- [Guia de Estrutura de Requisitos](../GUIA-ESTRUTURA-REQUISITOS.md)
- [Prompt BDD Completo](../prompts/prompt-cenarios-comportamento-bdd.md)
- [Changelog do Projeto](../../../CHANGELOG.md)

## 🚀 Como Usar

1. **Copie** o conteúdo de `template-requisito-base.md`
2. **Cole** em um novo arquivo no diretório do seu projeto
3. **Preencha** os placeholders `{{NOME_VARIAVEL}}`
4. **Remova** seções opcionais que não se aplicam
5. **Adapte** conforme necessário para seu caso específico

## 📖 Guias e Documentação

- [📖 Guia Completo de Estrutura de Requisitos](../GUIA-ESTRUTURA-REQUISITOS.md) - **LEIA PRIMEIRO!**
- [📋 Índice de Prompts Unificados](../prompts/README.md)
- [📄 Changelog do Projeto](../../../CHANGELOG.md)

## ⚠️ Histórico de Simplificação

**Anteriormente** existiam 3 templates base:
- `template-base.md` (removido)
- `template-base1.md` (removido)
- `template-requisito-base.md` ✅ (mantido)

**Decisão:** Manter apenas `template-requisito-base.md` para:
- Reduzir confusão sobre qual template usar
- Facilitar manutenção (uma única fonte)
- Garantir que todos templates estejam atualizados com BDD

Veja detalhes no [CHANGELOG.md](../../../CHANGELOG.md).

---

**Última atualização:** 11/02/2026
**Versão:** 1.1
