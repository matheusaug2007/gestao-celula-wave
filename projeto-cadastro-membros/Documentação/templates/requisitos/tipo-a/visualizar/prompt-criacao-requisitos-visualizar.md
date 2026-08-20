# Snippet Oficial — Prompt para Criação de Requisito de Visualização

Utilize este prompt sempre que for necessário criar um requisito da ação **Visualizar** para qualquer entidade do sistema cuja tela reutilize a estrutura de edição, porém **sem permitir alterações nos dados**.

------

## Prompt Padrão — Criação de Requisito de Visualização

Crie o requisito da funcionalidade **Visualizar [ENTIDADE]** no sistema.

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

- O requisito da ação **Listar** da mesma entidade, especialmente para:
  - forma de acesso à visualização;
  - contexto de navegação;
  - identificação do registro selecionado.
- A história Jira associada à funcionalidade, extraindo **exclusivamente** as informações relacionadas à ação de **visualização**.
- O protótipo da tela (quando existir), utilizando-o como referência visual para disposição dos campos e seções.

### Escopo do requisito

- O requisito deve tratar **exclusivamente da ação de visualização**.
- Descrever de forma clara:
  - Como o usuário acessa a funcionalidade de visualização (ex.: a partir da listagem)
  - Quais informações são exibidas na tela
  - Que todos os campos devem ser apresentados **preenchidos e desabilitados**, não permitindo edição
  - Ausência de ações de salvamento ou alteração de dados
  - Restrições, dependências e impactos relacionados à consulta dos dados
- Não incluir funcionalidades de criação, edição, exclusão ou ativação/inativação, exceto quando forem **necessárias para contextualização da visualização**, apenas como referência.

### Comportamento da Tela

- Todos os campos devem ser exibidos em modo **somente leitura**.
- Nenhum campo pode ser editado ou alterado pelo usuário.
- A tela não deve permitir ações de salvamento, confirmação ou cancelamento de alterações.
- A funcionalidade tem caráter exclusivamente informativo, servindo como apoio à consulta e análise dos dados.

### Linguagem e padrão de escrita

- Utilizar linguagem **clara, neutra e institucional**.
- Evitar termos técnicos sempre que possível.
- Quando o uso de um termo técnico for necessário, incluir **breve explicação em linguagem simples**, voltada a leitores não técnicos.
- Manter consistência de termos e nomenclaturas com os demais requisitos do projeto.