# Prompt Unificado — Contextualização do Requisito

Este prompt define as instruções **obrigatórias** para preenchimento da seção **Contextualização** em **qualquer documento de requisito**, independentemente do tipo (Tipo A ou Tipo B).

A seção Contextualização explica **POR QUE** o requisito é necessário, focando no **problema de negócio** ou **necessidade operacional** que a funcionalidade resolve.

---

## 1. OBJETIVO DA SEÇÃO

Permitir que **usuários-chave e stakeholders** entendam:
- Qual problema ou limitação existe no cenário atual
- Quem é impactado por esse problema
- Qual ganho ou melhoria se espera ao resolver o problema
- Por que a solução é relevante para o negócio/operação

---

## 2. PÚBLICO-ALVO

**Primário:** Usuário-chave, Product Owner, Stakeholder  
**Secundário:** Time técnica (para contexto de negócio)

---

## 3. INSTRUÇÕES DE ESCRITA

### A. Linguagem Obrigatória
- Linguagem **de negócio**, clara e objetiva
- Tom **profissional e neutro**
- Evitar jargão técnico ou termos específicos de implementação
- Quando necessário usar termos técnicos, incluir breve explicação em linguagem simples

### B. Linguagem Ubíqua (Ubiquitous Language)

**IMPORTANTE:** Identifique e use consistentemente os **termos-chave do domínio** que serão usados em todo o projeto.

**Diretrizes:**

1. **Use termos do negócio** (não traduza para termos genéricos ou técnicos)
   - ✅ "Estabelecimento Comercial" (se é assim que o negócio chama)
   - ❌ "Loja", "Store", "EC" (evitar sinônimos)

2. **Mantenha consistência** ao longo de todo o requisito
   - Se começou chamando de "Doação", não alterne para "Contribuição"
   - Use sempre o mesmo termo em todo o documento

3. **Destaque conceitos-chave** do domínio (substantivos principais)
   - Entidades principais: Usuário, Estabelecimento, Transação, PDV
   - Processos importantes: Sincronização, Autenticação, Validação
   - Estados relevantes: Ativo, Inativo, Pendente, Sincronizado

4. **Estes termos se tornarão:**
   - **Entidades/Agregados** no modelo de domínio
   - **Nomes de classes** no código
   - **Nomes de tabelas** no banco de dados
   - **Termos nos cenários BDD** e testes automatizados

**Exemplo prático:**

❌ **Sem Linguagem Ubíqua:**
```
Atualmente, o processo de adicionar novos pontos de venda no sistema
é manual, dificultando o controle...
```

✅ **Com Linguagem Ubíqua:**
```
Atualmente, o processo de cadastro de **PDVs (Pontos de Venda)**
é manual, dificultando o controle de **Estabelecimentos Comerciais** ativos...
```

**Benefício:** Os termos "PDV" e "Estabelecimento Comercial" aparecerão consistentemente em:
- Requisitos (esta seção)
- Código (`class PDV`, `class EstabelecimentoComercial`)
- Banco (`table pdv`, `table estabelecimento_comercial`)
- Testes ("Dado que existe um PDV ativo...")

### C. Estrutura e Comprimento
- Limite-se a **1 a 3 parágrafos curtos** (cada parágrafo com até ~4 linhas)
- Usar texto corrido (sem listas ou bullets)
- Começar com afirmação direta do problema ou necessidade
- Progredir para contexto → impacto → relevância

### D. Progressão Lógica Recomendada

**Parágrafo 1 – Situação Atual / Problema**
- Descrever a situação atual ou dificuldade existente
- Exemplos: "Atualmente, o processo de validação de PDVs é manual, consumindo...", "Não há visibilidade sobre...", "A sincronização de dados entre sistemas é lenta..."

**Parágrafo 2 – Impacto ou Necessidade**
- Explicar qual impacto o problema gera (dificuldade operacional, risco, ineficiência, perda de controle)
- Quem é afetado (usuários, áreas, processos)
- Exemplos: "Isso resulta em...", "O impacto é...", "Necessitamos garantir que..."

**Parágrafo 3 – Ganho Esperado (opcional, se aplicável)**
- Brevemente indicar qual melhoria ou ganho se espera
- Não descrever COMO a solução funcionará (isso vem nas seções seguintes)
- Exemplos: "Com essa funcionalidade, espera-se...", "Isso permitirá...", "O ganho será..."

### E. Restrições Absolutas

**NÃO fazer:**
- ❌ Descrever telas, interfaces ou elementos visuais
- ❌ Explicar fluxos de navegação ou ações do usuário
- ❌ Detalhar comportamento técnico do sistema ("O sistema irá carregar dados em...", "Será utilizado algoritmo X")
- ❌ Justificar decisões de design ou implementação técnica
- ❌ Misturar contexto com regras funcionais
- ❌ Usar termos como "tela", "botão", "formulário", "interface", "dados" (quando puder usar "informação")
- ❌ Incluir números excessivos ou métricas muito específicas sem contexto

**FAZER:**
- ✅ Focar no problema do negócio
- ✅ Usar linguagem acessível a não-técnicos
- ✅ Ser conciso e direto
- ✅ Validar com PO se não há informação suficiente

---

## 4. EXEMPLOS DE BOA CONTEXTUALIZAÇÃO

### Exemplo 1: Tipo A - Listar Usuários
```
Atualmente, administradores da plataforma não possuem uma visão centralizada 
e filtrada dos usuários cadastrados, dificultando auditorias, controle de acessos 
e identificação de usuários inativos. Isso resulta em processo manual de busca 
em banco de dados e impede validações rápidas de permissões.

Com a funcionalidade de listagem, administradores poderão consultar, filtrar 
e validar usuários de forma rápida e segura, melhorando o controle institucional.
```

### Exemplo 2: Tipo A - Criar Estabelecimentos Comerciais
```
A criação de novos estabelecimentos comerciais é essencial para manter a base 
de dados atualizada e garantir que o sistema tenha registros precisos de todas 
as unidades operacionais. Sem um processo estruturado, há risco de duplicação, 
inconsistência de dados e perda de informações críticas.

Essa funcionalidade padroniza o cadastro e assegura que todas as informações 
obrigatórias sejam preenchidas antes de registrar um novo estabelecimento.
```

### Exemplo 3: Tipo B - Autenticação de Usuário
```
A segurança do acesso é um pilar crítico para proteger dados institucionais 
e garantir que apenas usuários autorizados utilizem o sistema. Sem um mecanismo 
de autenticação robusto, há risco de acesso não autorizado e comprometimento 
de informações sensíveis.

O requisito de autenticação define como o sistema valida identidade e credenciais, 
estabelecendo o padrão de segurança para todo acesso à plataforma.
```

### Exemplo 4: Tipo B - Sincronização de Dados
```
Em ambientes com múltiplos sistemas ou módulos, a desincronização de dados 
pode gerar inconsistências, decisões baseadas em informações incorretas e 
falhas operacionais. Há necessidade de garantir que dados críticos estejam 
sempre em sincronia.

A sincronização automática reduz intervenção manual, melhora a confiabilidade 
e permite que usuários operem com informações sempre atualizadas.
```

---

## 5. CHECKLIST DE VALIDAÇÃO DA CONTEXTUALIZAÇÃO

Antes de finalizar a seção, confirme:

- [ ] Texto enfoca PROBLEMA DE NEGÓCIO, não solução técnica
- [ ] Linguagem é compreensível para usuário não-técnico
- [ ] Não há descrição de telas, elementos UI ou fluxos de navegação
- [ ] Não há detalhes de implementação ou tecnologia
- [ ] Parágrafos têm até ~4 linhas cada
- [ ] Total de 1 a 3 parágrafos
- [ ] Responde: "Por quê isso é necessário?"
- [ ] Não se mistura com Detalhamento Funcional (que responde "Como?")
- [ ] Tom é profissional, sem linguagem promocional
- [ ] Não há redundância com o título ou objetivo do documento
- [ ] Termos-chave do domínio estão identificados e usados consistentemente (Linguagem Ubíqua)

---

## 6. REGRA DE OURO

> **Se a frase descreve COMO o sistema funciona ou O QUE o usuário faz, ela NÃO pertence à Contextualização.**

A Contextualização responde a **POR QUE** existe, não a **COMO** funciona.

---

## 7. QUANDO INFORMAÇÃO ESTÁ INSUFICIENTE

Se faltar clareza sobre o problema ou necessidade:

1. **Solicite esclarecimentos** antes de preencher
2. **Faça perguntas objetivas ao PO:**
   - "Qual é o problema atual que esta funcionalidade resolve?"
   - "Quem é impactado por esse problema?"
   - "Qual dificuldade operacional existe hoje?"
   - "Há riscos ou ineficiências relacionados?"

3. **Não invente** contexto ou justificativas

---

## 8. INTEGRAÇÃO COM OUTRAS SEÇÕES

| Seção | Relação |
|-------|---------|
| **Cabeçalho** | Usa o título para referência; não repete |
| **Detalhamento Funcional** | Responde "COMO" o sistema funciona (complementa esta seção) |
| **Critérios de Aceite** | Validam que o requisito resolve o problema descrito aqui |
| **Histórico** | Rastreia mudanças no contexto (se problema evolui) |

---

## 9. REFERÊNCIAS RELACIONADAS

- [Prompt Cabeçalho](./prompt-cabecalho-unificado.md)
- [Prompt Detalhamento Funcional](./prompt-detalhamento-funcional-unificado.md) *(em desenvolvimento)*
- [STANDARDS.md](../../STANDARDS.md) — Padrões gerais
- [Índice de Prompts](./README.md) — Todos os prompts unificados

---

