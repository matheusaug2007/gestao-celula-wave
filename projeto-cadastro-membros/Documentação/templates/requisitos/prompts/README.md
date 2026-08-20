# 📚 Índice de Prompts Unificados

Este diretório centraliza todos os prompts de instruções para preenchimento de requisitos. Cada prompt fornece orientações detalhadas sobre como preencher uma seção específica do requisito, **independentemente do tipo de funcionalidade (Tipo A ou Tipo B)**.

## 🎯 Objetivo

Evitar duplicação de instruções nos templates, mantendo uma **única fonte de verdade** para cada seção comum. Isso facilita:

✅ Manutenção centralizada  
✅ Consistência entre templates  
✅ Atualizações em um único lugar  
✅ Referências claras nos templates  

---


## 📋 Prompts Disponíveis


### 1. **Cabeçalho do Requisito**

📄 [`prompt-cabecalho-unificado.md`](./prompt-cabecalho-unificado.md)

**Escopo:**
- Logo institucional
- Breadcrumb e navegação
- Título (Ação + Entidade)
- Versionamento (X.Y)
- Data de atualização (DD/MM/AAAA)
- Separadores obrigatórios
- Rodapé institucional

**Aplicável a:** ✅ Tipo A | ✅ Tipo B | ✅ Base

**Status:** ✅ Disponível (04/02/2026)

---

### 2. **Contextualização**

📄 [`prompt-contextualizacao-unificada.md`](./prompt-contextualizacao-unificada.md)

**Escopo:**
- Explicação do problema ou necessidade de negócio
- Público impactado
- Impacto esperado com a solução
- Restrições: não misturar com detalhamento técnico ou UI
- 4 exemplos práticos inclusos

**Aplicável a:** ✅ Tipo A | ✅ Tipo B | ✅ Base

**Status:** ✅ Disponível (04/02/2026)

---

### 3. **Mensagens e Estados**

📄 [`prompt-mensagens-estados-unificado.md`](./prompt-mensagens-estados-unificado.md)

**Escopo:**
- Estados relevantes com impacto no comportamento do sistema
- Mensagens associadas quando aplicável
- Critérios para listar e o que não listar
- Formato recomendado e exemplos práticos
- Checklist de validação

**Aplicável a:** ✅ Tipo A | ✅ Tipo B | ✅ Base

**Status:** ✅ Disponível (04/02/2026)

---

### 4. **Fluxos Relacionados e Navegação**

📄 [`prompt-fluxos-navegacao-unificado.md`](./prompt-fluxos-navegacao-unificado.md)

**Escopo:**
- Fluxos anteriores (origem/pré-requisitos)
- Fluxos posteriores (destino/sequência)
- Fluxos alternativos (caminhos paralelos)
- Relações entre requisitos com impacto funcional
- 4 exemplos práticos inclusos
- Diferenciação em relação a Detalhamento Funcional e Critérios de Aceite

**Aplicável a:** ✅ Tipo A | ✅ Tipo B | ✅ Base

**Status:** ✅ Disponível (04/02/2026)

---

### 5. **Regras e Comportamentos do Sistema**

📄 [`prompt-regras-comportamentos-sistema-unificado.md`](./prompt-regras-comportamentos-sistema-unificado.md)

**Escopo:**
- Regras automáticas e restrições transversais
- Comportamentos que não dependem do fluxo visual
- Formato obrigatório de escrita
- Exemplos por tipo (Listar/Criar/Editar)
- Checklist de validação

**Aplicável a:** ✅ Tipo A | ✅ Tipo B | ✅ Base

**Status:** ✅ Disponível (04/02/2026)

---

### 6. **Permissões e Regras de Acesso**

📄 [`prompt-permissoes-regras-acesso-unificado.md`](./prompt-permissoes-regras-acesso-unificado.md)

**Escopo:**
- Modelo com permissões (tabela)
- Modelo sem permissões (acesso irrestrito)
- Critérios de uso e exclusões
- Checklist de validação

**Aplicável a:** ✅ Tipo A | ✅ Tipo B | ✅ Base

**Status:** ✅ Disponível (04/02/2026)

---

### 7. **Referências do Requisito**

📄 [`prompt-referencias-requisito-unificado.md`](./prompt-referencias-requisito-unificado.md)

**Escopo:**
- Referências complementares (protótipos, diagramas, fluxos, anexos)
- Requisitos relacionados quando houver dependência
- Regras de criação (não criar seção vazia, sem placeholders)
- Formatos recomendados e exemplos
- Checklist de validação

**Aplicável a:** ✅ Tipo A | ✅ Tipo B | ✅ Base

**Status:** ✅ Disponível (04/02/2026)

---

### 8. **Detalhamento Funcional**

📄 `prompt-detalhamento-funcional-unificado.md` *(em desenvolvimento)*

**Escopo esperado:**
- Descrição narrativa da tela/fluxo
- Composição visual (sem detalhar campos individuais)
- Imagens e protótipos
- Comportamento do sistema
- Regras e validações

**Aplicável a:** ✅ Tipo A | ✅ Tipo B | ✅ Base

**Status:** 🔄 Em desenvolvimento

---

### 9. **Cenários de Comportamento (BDD)**

📄 [`prompt-cenarios-comportamento-bdd.md`](./prompt-cenarios-comportamento-bdd.md)

**Escopo:**
- Documentação de comportamentos através de exemplos concretos executáveis
- Metodologia BDD (Behavior-Driven Development)
- Estrutura Given-When-Then (Dado que-Quando-Então)
- Uso de dados reais (não placeholders genéricos)
- Cobertura completa: happy path, validações, regras de negócio, permissões, erros, edge cases
- Automação de testes (conversão direta para Cucumber, SpecFlow, Behave)
- Exemplos práticos completos e checklist de validação

**Aplicável a:** ✅ Tipo A | ✅ Tipo B | ✅ Base

**Status:** ✅ Disponível (11/02/2026)

**Nota:** Esta seção **substitui** a seção "Critérios de Aceite" para novos requisitos. Requisitos legados mantêm "Critérios de Aceite" até migração.

---

### 10. **Critérios de Aceite (Legado)**

📄 [`prompt-criterios-aceite-unificados.md`](./prompt-criterios-aceite-unificados.md)

**Escopo:**
- Resultados esperados observáveis e verificáveis
- Linguagem normativa: "O sistema deve..."
- Alinhamento obrigatório ao Detalhamento Funcional
- Regras de não-uso (sem passos, sem Given/When/Then, sem termos subjetivos)
- Coberturas esperadas quando aplicável (sucesso/erro/cancelamento, permissões, filtros, paginação)
- Exemplos práticos e checklist de validação

**Aplicável a:** ✅ Tipo A | ✅ Tipo B | ✅ Base

**Status:** ⚠️ Legado - Mantido para requisitos existentes (04/02/2026)

**Nota:** Para **novos requisitos**, utilizar a seção "Cenários de Comportamento (BDD)" ao invés desta.

---

### 11. **Histórico de Alterações**

📄 [`prompt-historico-alteracoes-unificado.md`](./prompt-historico-alteracoes-unificado.md)

**Escopo:**
- Formato de tabela
- Rastreamento de versões
- Autoria e datas
- Resumo de mudanças
- Regras de versionamento

**Aplicável a:** ✅ Tipo A | ✅ Tipo B | ✅ Base

**Status:** ✅ Disponível (04/02/2026)

---

## 🔗 Como Referenciar nos Templates

Em cada template, ao invés de copiar todo o bloco de instruções, adicione uma **referência simples**:

```markdown
<!--
AGENT IA - INSTRUÇÕES DE PREENCHIMENTO PARA CABEÇALHO DO REQUISITO

Para instruções completas e detalhadas, consulte:
📄 ../prompts/prompt-cabecalho-unificado.md

RESUMO RÁPIDO (para referência):
- Logo obrigatória, caminho relativo
- 2 separadores --- (abaixo do logo e versão)
- Formato: [Módulo](link) › **Título**
- Versão X.Y | Data DD/MM/AAAA
- Checklist no prompt completo

-->
```

---

## ✅ Checklist de Uso

Ao criar ou atualizar um template:

- [ ] Remover blocos duplicados de instruções
- [ ] Adicionar referência ao prompt unificado correspondente
- [ ] Manter resumo rápido inline (para referência rápida)
- [ ] Validar que a referência relativa funciona (`../prompts/`)
- [ ] Testar o template com agentes de IA

---

## 📝 Roadmap

| Prompt | Status | Data | Responsável |
|--------|--------|------|-------------|
| Cabeçalho | ✅ Concluído | 04/02/2026 | Alexandre |
| Contextualização | ✅ Concluído | 04/02/2026 | Alexandre |
| Mensagens e Estados | ✅ Concluído | 04/02/2026 | Alexandre |
| Fluxos Relacionados e Navegação | ✅ Concluído | 04/02/2026 | Alexandre |
| Regras e Comportamentos do Sistema | ✅ Concluído | 04/02/2026 | Alexandre |
| Permissões e Regras de Acesso | ✅ Concluído | 04/02/2026 | Alexandre |
| Referências do Requisito | ✅ Concluído | 04/02/2026 | Alexandre |
| Detalhamento Funcional | 🔄 Em progresso | - | - |
| Cenários de Comportamento (BDD) | ✅ Concluído | 11/02/2026 | Alexandre |
| Critérios de Aceite (Legado) | ✅ Concluído | 04/02/2026 | Alexandre |
| Histórico de Alterações | ✅ Concluído | 04/02/2026 | Alexandre |
---

## 🤝 Contribuindo

Ao atualizar qualquer prompt:

1. Editar o arquivo correspondente em `prompts/`
2. Testar com pelo menos um template
3. Atualizar a data e status neste README.md
4. Fazer commit com padrão: `docs(prompts): [descrição]`

---


