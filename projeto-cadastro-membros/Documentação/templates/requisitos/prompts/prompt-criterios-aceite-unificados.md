# Prompt Unificado: Critérios de Aceite

## Objetivo da Seção

Definir **COMO SABER** que o requisito foi corretamente implementado, por meio de critérios **objetivos, observáveis e verificáveis**. Os critérios representam as **condições mínimas** para considerar o requisito concluído e aprovado.

---

## Público-Alvo

- Usuário-chave
- Time funcional
- Time técnico

---

## Regras Obrigatórias

- **Iniciar TODOS os critérios com**: `O sistema deve...`
- **Descrever apenas o RESULTADO ESPERADO** do sistema (não o caminho para chegar nele).
- Cada critério deve ser **observável e verificável**, sem interpretação subjetiva.
- **Um comportamento por critério**.
- Utilizar linguagem **clara, objetiva e normativa**.

---

## O que NÃO Fazer

- **NÃO** descrever fluxos, passos, telas ou cenários.
- **NÃO** repetir o Detalhamento Funcional.
- **NÃO** repetir regras automáticas já descritas em **Regras e Comportamentos do Sistema**.
- **NÃO** utilizar Given / When / Then.
- **NÃO** utilizar termos subjetivos (ex.: adequado, bom, intuitivo, simples).

---

## Relação com Outras Seções

- Todo critério de aceite **DEVE** estar baseado em comportamentos **já descritos** no Detalhamento Funcional.
- Se um comportamento **não estiver descrito** lá, ele **NÃO deve aparecer** aqui.
- Quando houver impacto entre requisitos, **explicitar o impacto logo abaixo do critério** no formato:

```markdown
- O sistema deve ...
  - Impacta: <Nome do Requisito ou Funcionalidade>
```

---

## Coberturas Esperadas (quando aplicável)

Ao elaborar critérios, verificar se faz sentido cobrir:

- **Sucesso, erro e cancelamento**
- **Permissões e restrições de acesso**
- **Filtros, ordenação e paginação** (quando houver listagem)
- **Mensagens e estados relevantes**
- **Restrições funcionais** que afetam o resultado esperado

> **Nota:** incluir apenas o que for **realmente aplicável** ao requisito.

---

## Exemplos Práticos

### Exemplo 1: Listagem com filtros e paginação

```markdown
- O sistema deve permitir o acesso à funcionalidade apenas para usuários com a permissão `PERMISSAO_VISUALIZAR`.
- O sistema deve exibir os filtros definidos para a listagem.
- O sistema deve retornar apenas registros que atendam aos filtros informados.
- O sistema deve permitir paginação com as opções definidas de registros por página.
- O sistema deve exibir a mensagem “Nenhum resultado encontrado” quando não houver registros.
```

### Exemplo 2: Criação com sucesso e cancelamento

```markdown
- O sistema deve salvar o registro quando todos os campos obrigatórios estiverem preenchidos corretamente.
- O sistema deve exibir mensagem de confirmação após o salvamento com sucesso.
- O sistema deve descartar alterações não salvas ao acionar a ação **Cancelar**.
```

### Exemplo 3: Impacto em outro requisito

```markdown
- O sistema deve redirecionar para a tela de confirmação ao concluir a operação.
  - Impacta: Confirmar Operação
```

---

## Checklist de Validação

Antes de concluir esta seção, verificar:

- [ ] Todos os critérios começam com **"O sistema deve..."**
- [ ] Cada critério descreve **resultado esperado**, não fluxo
- [ ] Cada critério é **observável e verificável**
- [ ] Não há termos subjetivos
- [ ] Não há Given/When/Then
- [ ] Critérios estão **alinhados ao Detalhamento Funcional**
- [ ] Impactos entre requisitos foram explicitados quando aplicável
- [ ] Coberturas essenciais foram consideradas (sucesso/erro/cancelamento, permissões, filtros, paginação)

---

## Regra de Ouro

Se o texto descreve **APENAS o resultado esperado**, ele pertence aos **Critérios de Aceite**.
Se descreve **COMO** o sistema se comporta (fluxo, tela, passos), ele pertence ao **Detalhamento Funcional**.

---

## Informação Insuficiente

Se não for possível definir um critério objetivo com as informações disponíveis, **questionar o PO** antes de inventar ou assumir comportamentos.

---

