# Snippet Oficial — Prompt para Criação de Requisito de Edição

Utilize este prompt sempre que for necessário criar um requisito da ação **Editar** para qualquer entidade do sistema.

---

## Prompt Padrão — Criação de Requisito de Edição

Crie o requisito da funcionalidade **Editar [ENTIDADE]** no sistema.

### Regras obrigatórias de estrutura

- Utilize **integralmente** o arquivo de template correspondente à ação de edição (`template-editar.md`) como base do documento.
- O template deve ser seguido **do início ao fim**, **sem remover ou omitir nenhuma seção obrigatória**, incluindo obrigatoriamente:
  - Cabeçalho institucional
  - Contextualização
  - Detalhamento funcional
  - Referências do requisito (quando aplicável)
  - Critérios de Aceite
  - Permissões da Tela
  - Histórico de Alterações
  - Rodapé institucional
- O documento final deve manter **exatamente a estrutura definida no template**, preenchendo cada seção conforme as instruções descritas nos comentários `AGENT IA - INSTRUÇÕES DE PREENCHIMENTO`.
- Caso falte informação para preencher qualquer seção obrigatória, **não inventar conteúdo**. Nessa situação, solicitar esclarecimentos antes de prosseguir.

### Fontes de informação obrigatórias

Utilize como base para o conteúdo funcional:

- O requisito da ação **Criar** da mesma entidade (quando existir), reaproveitando campos, regras e comportamentos aplicáveis à edição.
- A história Jira associada à funcionalidade, extraindo **exclusivamente** as informações relacionadas à ação de **edição**.

### Escopo do requisito

- O requisito deve tratar **exclusivamente da ação de edição**.
- Descrever de forma clara:
  - Como o usuário acessa a funcionalidade de edição
  - Quais campos são editáveis e quais são exibidos apenas para leitura
  - Regras de validação aplicáveis durante a edição
  - Comportamento de salvamento
  - Restrições, dependências e impactos
  - Registro de autoria e histórico de alterações
- Não incluir funcionalidades de listagem, criação, exclusão ou ativação/inativação, exceto quando forem **necessárias para contextualização da edição**.

### Linguagem e padrão de escrita

- Utilizar linguagem **clara, neutra e institucional**.
- Evitar termos técnicos sempre que possível.
- Quando o uso de um termo técnico for necessário, incluir **breve explicação em linguagem simples**, voltada a leitores não técnicos.
- Manter consistência de termos e nomenclaturas com os demais requisitos do projeto.

---

Este snippet define o padrão oficial para geração de requisitos de edição e deve ser seguido em todos os novos documentos deste tipo.