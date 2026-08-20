# Prompt Unificado: Regras e Comportamentos do Sistema

## Objetivo da Seção

Documentar regras, restrições e comportamentos automáticos executados pelo sistema que **NÃO** dependem exclusivamente do fluxo visual ou da navegação do usuário.

---

## Público-Alvo

PÚBLICO-ALVO: **FUNCIONAL / TÉCNICO**

---

## Critério para Documentar uma Regra

Uma regra **DEVE** ser listada aqui apenas se:

- for aplicada automaticamente pelo sistema, ou
- representar uma validação ou restrição transversal, ou
- ocorrer independentemente da tela em que o usuário esteja, ou
- impactar dados, status ou fluxo **sem ação explícita** do usuário.

### NÃO DOCUMENTAR

- regras puramente visuais ou de layout;
- comportamentos já totalmente descritos no Detalhamento Funcional;
- resultados esperados que pertencem aos Critérios de Aceite.

---

## Categorias de Regras

Classifique as regras em uma das categorias abaixo:

### 1. **Invariantes de Negócio**

**Definição:** Regras que **SEMPRE** devem ser verdadeiras sobre uma entidade ou agregado, independentemente de qualquer operação.

**Características:**
- Protegem a consistência do modelo de domínio
- Não podem ser violadas em nenhuma circunstância
- São verificadas **antes** de qualquer persistência
- Se violadas, a operação deve ser impedida

**Formato obrigatório:**
```
- **[INVARIANTE]** <Descrição da regra que SEMPRE deve ser verdadeira>
```

**Exemplos:**

**Criar:**
- **[INVARIANTE]** Um Estabelecimento Comercial SEMPRE deve ter um CNPJ único no sistema
- **[INVARIANTE]** Um Usuário SEMPRE deve ter um email único e válido
- **[INVARIANTE]** Uma Doação SEMPRE deve ter valor maior que zero

**Editar:**
- **[INVARIANTE]** O CNPJ de um Estabelecimento Comercial não pode ser alterado após criação
- **[INVARIANTE]** Um Pedido com status "Finalizado" não pode ter itens modificados

**Listar:**
- **[INVARIANTE]** Apenas registros do contexto delimitado (Bounded Context) do usuário devem ser exibidos

**Diferença entre Invariante e Validação:**

| Tipo | Quando Verificar | Pode ser Violado? | Exemplo |
|------|------------------|-------------------|---------|
| **Invariante** | Sempre, antes de qualquer operação | ❌ Nunca | CNPJ único |
| **Validação** | Durante input do usuário | ✅ Sim (temporariamente) | Campo obrigatório vazio |

**Por que documentar Invariantes?**
- Invariantes se tornam **regras protegidas pela entidade ou agregado**
- Time técnico implementa invariantes como validações nas entidades principais
- Invariantes definem **limites** (boundaries) do modelo de domínio

---

### 2. **Validações de Entrada**

**Definição:** Verificações aplicadas aos dados fornecidos pelo usuário.

**Exemplos:**
- O sistema deve validar formato do CNPJ (99.999.999/9999-99)
- O sistema deve validar que o campo "Razão Social" não ultrapasse 100 caracteres
- O sistema deve validar que a data de nascimento seja anterior à data atual

---

### 3. **Regras Automáticas e Comportamentos do Sistema**

**Definição:** Ações executadas automaticamente pelo sistema sem intervenção do usuário.

**Exemplos:**
- O sistema deve registrar automaticamente data e hora de criação
- O sistema deve atribuir status "Ativo" por padrão em novos cadastros
- O sistema deve sincronizar dados com sistema externo a cada 5 minutos

---

### 4. **Restrições Transversais**

**Definição:** Regras que afetam múltiplos fluxos ou contextos.

**Exemplos:**
- O sistema deve impedir exclusão de Estabelecimentos com Transações associadas
- O sistema deve aplicar filtro de dados baseado no perfil de acesso do usuário
- O sistema deve manter histórico de alterações em todas as entidades auditáveis

---

## Instruções de Escrita

- Descreva cada regra de forma objetiva e independente.
- Preferir frases no formato: **"O sistema deve <comportamento automático ou restrição>."**
- Uma regra por item.
- Evitar justificativas ou explicações longas.

---

## Relação com Outras Seções

- Esta seção **NÃO substitui** os Critérios de Aceite.
- Se uma regra precisar ser validada formalmente, ela **DEVE** ser referenciada também nos Critérios de Aceite.

---

## Exemplos por Tipo (quando aplicável)

### Listar
- combinação de filtros;
- regras de escopo de dados (ex.: considerar ativos e inativos se houver vínculo);
- restrições de acesso por permissão;
- regras de performance (quando relevante).

### Criar
- validações obrigatórias;
- impedimento de duplicidade;
- valores padrão carregados automaticamente;
- restrições de vínculo com outras entidades;
- campos que não poderão ser alterados após a criação.

### Editar
- campos que não podem ser alterados após a criação;
- validações reaplicadas na edição;
- impactos em outras entidades ou processos.

---

## Checklist de Validação

- [ ] As regras listadas não dependem do fluxo visual
- [ ] Cada regra está objetiva e verificável
- [ ] Não há duplicação com Detalhamento Funcional
- [ ] Regras críticas foram refletidas nos Critérios de Aceite ou Cenários BDD
- [ ] Invariantes estão marcados com **[INVARIANTE]** (facilita refinamento técnico)
- [ ] Regras usam termos da Linguagem Ubíqua consistentemente

---


