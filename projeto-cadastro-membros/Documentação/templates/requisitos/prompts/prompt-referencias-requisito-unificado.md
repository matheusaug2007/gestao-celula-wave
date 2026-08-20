# Prompt Unificado: Referências do Requisito

## Objetivo da Seção

Centralizar referências externas ou complementares que auxiliem o entendimento, validação, homologação ou detalhamento deste requisito. Esta seção conecta o requisito com artefatos visuais (protótipos, diagramas), fluxos relacionados e documentação complementar.

---

## Caráter da Seção

Esta seção é **OPCIONAL**. Criar apenas se existirem referências **REAIS e EXISTENTES** que agreguem valor.

---

## Critério para Criar a Seção

A seção **"Referências do Requisito"** deve ser criada **apenas** se existir pelo menos uma referência **REAL, DISPONÍVEL e RELEVANTE** para o requisito.

### NÃO CRIAR A SEÇÃO SE:

- não existir protótipo, diagrama, fluxo ou anexo relevante;
- a referência não agregar entendimento ao requisito;
- a referência ainda não estiver disponível ou estiver em sigilo.

---

## Regras Obrigatórias

- Nunca criar a seção vazia.
- Nunca manter títulos, subtítulos ou placeholders sem conteúdo.
- Nunca incluir comentários, instruções ou orientações no documento final.
- Não inventar links, arquivos ou referências.
- Cada subtópico **DEVE** ser precedido de uma descrição narrativa (não apenas um link nu).
- Sempre incluir um breve texto introdutório contextualizando as referências quando houver múltiplas fontes.

---

## Estrutura e Conteúdo

### Introdução (Opcional, mas recomendada)

Se a seção contiver múltiplas referências (protótipo + diagrama + anexos), iniciar com uma frase contextualizando o que o leitor encontrará.

**Exemplo:**

"Esta funcionalidade foi definida com base nos seguintes artefatos e referências:"

### Subsecções (criar apenas com conteúdo real)

#### Protótipo
**Quando usar:**
- Quando existir protótipo visual em Figma ou ferramenta similar.
- Quando o protótipo foi usado para definir UX, estados visuais, layout ou comportamento.

**Instruções de escrita:**
1. Iniciar com 1-2 parágrafos descrevendo:
   - O que o protótipo representa (qual tela, fluxo ou funcionalidade)
   - Quais aspectos foram definidos a partir dele (estados visuais, disposição, comportamento, etc.)
   - Por que o protótipo é relevante para este requisito
2. Listar o link após a descrição com nome descritivo.

**Formato:**
```markdown
[Descrição de 1-2 parágrafos sobre o que o protótipo representa e seus usos]

- [Figma – [Projeto] | [Nome descritivo do protótipo]](URL com node-id ou parâmetros específicos se houver)
```

#### Diagramas
**Quando usar:**
- Quando existir diagrama de fluxo, sequência ou arquitetura relevante.
- Quando o diagrama auxilia no entendimento da lógica ou comportamento do sistema.

**Instruções de escrita:**
1. Descrever brevemente o diagrama e seu propósito.
2. Listar o link ou arquivo após a descrição.

**Exemplo:**
```markdown
O diagrama abaixo mostra a sequência de eventos do processo de validação:

- [Diagrama: Sequência de Validação](./fluxos/validacao-sequencia.png)
```

#### Fluxos
**Quando usar:**
- Quando existir fluxograma relacionado.
- Quando o fluxo complementa o detalhamento funcional.

**Instruções de escrita:**
1. Descrever brevemente o fluxo.
2. Listar o link ou arquivo.

#### Requisitos Relacionados (quando aplicável)
**Quando usar:**
- Quando for necessário garantir rastreabilidade e dependências entre funcionalidades.
- Quando outro requisito parametriza, alimenta, é impactado ou precisa ser acompanhado, mesmo sem vínculo direto.

**Instruções de escrita:**
1. Listar o requisito com nome completo.
2. Descrever brevemente o motivo do relacionamento (por que está sendo citado).
3. Incluir link para o requisito com caminho relativo/URL.

**Formato recomendado:**
```markdown
- **[Nome do Requisito]:** [Descrição do motivo do relacionamento].

   Para mais detalhes, consulte [Nome do Requisito](caminho/relativo/requisito.md).
```

#### Anexos
**Quando usar:**
- Quando existirem documentos complementares, exemplos, templates ou dados.
- Exemplos: especificação técnica de integração, arquivo de exemplo, comprovante, manual.
- **NÃO** usar para protótipos ou diagramas (criar subsecções específicas).

**Instruções de escrita:**
1. Usar tabela apenas se houver 2+ anexos.
2. Se 1 anexo apenas, usar formato de lista com descrição.
3. Cada linha deve ter: **Nome/Link** | **Descrição clara do conteúdo e utilidade**.

**Exemplo com 1 anexo (usar lista):**
```markdown
- [Exemplo de Resposta CIELO](./anexos/exemplo-resposta-cielo-v2.json) – Exemplo de resposta JSON retornada pela integração CIELO, utilizado como referência para entendimento do fluxo técnico.
```

**Exemplo com múltiplos anexos (usar tabela):**
```markdown
| Nome / Link | Descrição |
| --- | --- |
| [Documentação CIELO API v2](./anexos/cielo-api-v2-spec.pdf) | Especificação completa da API CIELO utilizada para integração de transações |
| [Exemplo: Requisição de Débito](./anexos/exemplo-requisicao-debito.json) | Exemplo estruturado de requisição para transação de débito |
| [Exemplo: Resposta de Sucesso](./anexos/exemplo-resposta-sucesso.json) | Exemplo de resposta bem-sucedida com ID de transação e comprovante |
```

---

## Checklist de Validação

- [ ] A seção só existe quando há referências reais
- [ ] Não há placeholders ou comentários no documento final
- [ ] Cada subtópico tem descrição narrativa
- [ ] Links funcionam e estão atualizados
- [ ] Referências são complementares (não repetem regras do requisito)
- [ ] Introdução foi incluída quando há múltiplas referências

---

## Observações Importantes

- Esta seção **NÃO substitui** o Detalhamento Funcional.
- As referências são **COMPLEMENTARES** — devem auxiliar na validação, não explicar o que já está no requisito.
- Priorizar links com caminhos relativos (quando interno) ou URLs públicas (quando externo).

---

