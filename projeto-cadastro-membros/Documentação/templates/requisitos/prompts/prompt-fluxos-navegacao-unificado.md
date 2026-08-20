# Prompt Unificado: Fluxos Relacionados e Navegação

## Objetivo da Seção

Registrar apenas as **RELAÇÕES RELEVANTES** entre este requisito e outros fluxos ou requisitos do sistema, categorizando-as como fluxos anteriores (origem), fluxos posteriores (destino) ou fluxos alternativos, quando essas relações impactarem o entendimento do escopo ou o comportamento esperado do sistema.

---

## Critério para Documentar uma Relação

Uma relação **DEVE** ser documentada apenas se:

- o usuário chega a este fluxo a partir de outro requisito específico (**fluxo anterior**), ou
- este fluxo direciona para outro requisito de forma relevante (**fluxo posterior**), ou
- existe um caminho alternativo que diverge deste fluxo (**fluxo alternativo**), ou
- existe dependência funcional clara entre requisitos, ou
- a execução de um requisito impacta diretamente o outro.

### NÃO DOCUMENTAR:

- navegação padrão ou óbvia (ex.: menu principal, botão voltar),
- relações genéricas sem impacto funcional,
- listas extensas de requisitos sem explicação do vínculo.

---

## Instruções de Escrita

### 1. Estruturação por Tipo de Fluxo

Organizar as relações em categorias:

- **Fluxos Anteriores:** pré-requisitos e requisitos que precedem este fluxo
- **Fluxos Posteriores:** sequência esperada e requisitos que sucedem este fluxo
- **Fluxos Alternativos:** caminhos paralelos ou desvios opcionais

**Regra:** Se apenas uma ou duas categorias existirem, incluir apenas essas.

### 2. Formato Recomendado para cada Relação

```markdown
- **[Nome do Requisito]:** [Descrição clara do papel e contexto da relação].
  
  Para mais detalhes, consulte [Link para o requisito](caminho/relativo/requisito.md).
```

### 3. Descrição da Relação

- Explique **BREVEMENTE** o papel do requisito relacionado neste contexto
- Deixe claro **POR QUE** ele é relevante para este fluxo
- Indique se o requisito está em desenvolvimento entre parênteses: `(requisito em desenvolvimento)`

### 4. Links

- Sempre fornecer links com caminhos relativos corretos
- Use nomes descritivos no link (não IDs técnicos)
- Links devem funcionar a partir de qualquer branch

### 5. Múltiplas Relações do Mesmo Tipo

- Se houver múltiplos fluxos anteriores ou posteriores, listar todos
- Manter a mesma formatação e nível de detalhe para cada um

### 6. Requisitos Futuros

- Se um fluxo subsequente ainda não foi especificado, adicionar nota `(requisito em desenvolvimento)`
- Manter um comentário TODO se houver dúvida sobre o nome ou caminho correto do requisito futuro

---

## Exemplos Práticos

### Exemplo 1: Fluxos Anteriores (Tipo A - Listar)

```markdown
## Fluxos Anteriores

- **Acessar Módulo de Gestão:** Fluxo anterior que apresenta o menu principal do módulo. 
  Após a seleção da opção de listagem, o sistema redireciona automaticamente para este fluxo.

  Para mais detalhes, consulte [Acessar Módulo de Gestão](../acesso/acessar-modulo.md).
```

### Exemplo 2: Fluxos Posteriores (Tipo A - Listar para Criar/Editar)

```markdown
## Fluxos Posteriores

- **Criar Nova Entidade:** Fluxo subsequente acionado quando o operador clica no botão "Novo". 
  Permite que o usuário registre uma nova entidade no sistema.

  Para mais detalhes, consulte [Criar Nova Entidade](./criar-entidade.md).

- **Editar Entidade Existente:** Fluxo subsequente acionado ao selecionar uma entidade na listagem 
  e clicar no ícone de edição. Permite modificar dados da entidade selecionada.

  Para mais detalhes, consulte [Editar Entidade Existente](./editar-entidade.md).

- **Visualizar Detalhes da Entidade:** Fluxo alternativo acionado ao clicar sobre o nome ou 
  visualizar informações detalhadas da entidade sem modificá-la.

  Para mais detalhes, consulte [Visualizar Detalhes da Entidade](./visualizar-entidade.md).
```

### Exemplo 3: Fluxos com Requisitos em Desenvolvimento (Tipo B)

```markdown
## Fluxos Anteriores

- **Autenticação do Operador:** Fluxo anterior obrigatório que valida as credenciais do usuário. 
  Após autenticação bem-sucedida, o sistema redireciona para este fluxo.

  Para mais detalhes, consulte [Autenticação do Operador](../../acesso-inicial/login/realizar-login.md).

## Fluxos Posteriores

- **Confirmação de Transação:** Fluxo subsequente acionado após a conclusão do pagamento. 
  Exibe comprovante e opções de ações adicionais.

  Para mais detalhes, consulte [Confirmação de Transação](./confirmacao-transacao.md) (requisito em desenvolvimento).
```

### Exemplo 4: Fluxos Alternativos Simples

```markdown
## Fluxos Alternativos

- **Cancelar Operação:** Caminho alternativo disponível em qualquer etapa do fluxo. 
  Permite que o operador abandone a operação sem aplicar alterações.

  Para mais detalhes, consulte [Cancelar Operação](./cancelar-operacao.md).
```

---

## Checklist de Validação

Antes de concluir esta seção, verificar:

- [ ] Todas as relações documentadas têm impacto funcional ou de navegação claro?
- [ ] As descrições explicam o papel da relação, não apenas listam requisitos?
- [ ] Os links utilizam caminhos relativos corretos?
- [ ] Requisitos em desenvolvimento estão marcados com `(requisito em desenvolvimento)`?
- [ ] Cada categoria (Anterior/Posterior/Alternativo) está presente apenas se necessária?
- [ ] As descrições são breves e objetivas (máx. 2 linhas por relação)?
- [ ] Nenhuma navegação padrão ou óbvia foi documentada?

---

## Diferenciação em Relação a Outras Seções

| Seção | O quê | Exemplo |
|-------|-------|---------|
| **Detalhamento Funcional** | COMO o sistema se comporta (fluxo visual e regras internas) | "Quando o usuário seleciona uma opção, o sistema valida e exibe mensagem de sucesso" |
| **Fluxos Relacionados** | PARA ONDE o usuário vai (navegação entre requisitos) | "Este fluxo redireciona para [Criar Entidade] após confirmação" |
| **Critérios de Aceite** | RESULTADO esperado (validação) | "O requisito está aceito se o link redireciona corretamente para o fluxo posterior" |

---

## Notas Importantes

- **Esta seção NÃO substitui** o Detalhamento Funcional (que descreve COMO o sistema se comporta internamente)
- **Esta seção DOCUMENTA** a NAVEGAÇÃO e SEQUÊNCIA entre requisitos (fluxo do usuário entre telas/funcionalidades)
- **Não incluir** comportamentos visuais ou técnicos — apenas fluxo e navegação
- **Relevância é a chave:** quando em dúvida, não documente a relação. Apenas relate o que é verdadeiramente importante para o entendimento do fluxo

---

