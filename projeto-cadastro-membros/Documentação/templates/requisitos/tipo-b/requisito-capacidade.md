<!--

AGENT IA - INSTRUÇÕES DE PREENCHIMENTO PARA CABEÇALHO

Para instruções COMPLETAS e DETALHADAS sobre o cabeçalho, consulte:
📄 ../prompts/prompt-cabecalho-unificado.md

RESUMO RÁPIDO:
✓ Logo institucional obrigatória (caminho relativo)
✓ 2 separadores --- (abaixo do logo e versão/data)
✓ Breadcrumb: [Módulo: Nome](../../README.md) › **Título**
✓ Título conforme tipo (Ação Entidade ou Substantivo Composto)
✓ Versão X.Y | Data DD/MM/AAAA (ambos em negrito)
✓ Rodapé institucional obrigatório
✓ Checklist completo disponível no prompt centralizado

-->

---

[Módulo: {{NOME_DO_MODULO}}](../../README.md) › **{{NOME_DO_REQUISITO}}**

**Versão:** X.Y | **Última atualização:** DD/MM/AAAA

---

# Contextualização

<!--

AGENT IA - INSTRUÇÕES DE PREENCHIMENTO PARA CONTEXTUALIZAÇÃO

Para instruções COMPLETAS e DETALHADAS sobre contextualização, consulte:
📄 ../prompts/prompt-contextualizacao-unificada.md

RESUMO RÁPIDO:
✓ Explique o PROBLEMA DE NEGÓCIO que motiva este requisito
✓ 1 a 3 parágrafos curtos, linguagem de negócio
✓ Responde "POR QUE" é necessário, não "COMO" funciona
✓ NÃO mencionar telas, fluxos, UI ou elementos visuais
✓ Tom profissional, objetivo e institucional
✓ 4 exemplos práticos disponíveis no prompt centralizado
   -->

{{DESCREVER_O_CONTEXTO_DA_ENTIDADE}}

# Detalhamento Funcional

<!--
AGENT IA - INSTRUÇÕES DE PREENCHIMENTO — SEÇÃO: DETALHAMENTO FUNCIONAL
PÚBLICO-ALVO: FUNCIONAL / TÉCNICO

OBJETIVO DA SEÇÃO:
Descrever de forma clara e objetiva COMO O SISTEMA DEVE SE COMPORTAR para atender ao objetivo do requisito, considerando fluxos, regras,
comportamentos observáveis e estados visuais das telas.

Esta seção é a principal base para:
- entendimento funcional pelo time de desenvolvimento
- validação por usuários-chave
- definição de critérios de aceite
- conversão da documentação em código ou testes automatizados

INSTRUÇÕES DE ESCRITA:
- Utilize linguagem funcional e objetiva.
- Descreva o comportamento do SISTEMA, não a narrativa do usuário.
- Seja preciso e determinístico.
- Estruture o texto em tópicos, subtópicos ou listas numeradas quando aplicável.
- Um comportamento ou regra por item sempre que possível.

USO DE IMAGENS (OBRIGATÓRIO PARA TELAS):
- Utilize imagens para representar telas, estados ou fluxos visuais relevantes.
- Imagens NÃO substituem o texto: elas complementam a descrição funcional.
- Toda imagem inserida DEVE ser seguida de uma breve descrição textual explicando o que a imagem evidencia.

LOCALIZAÇÃO DAS IMAGENS:
- As imagens do requisito DEVEM estar localizadas na pasta `imagens/` dentro da mesma pasta onde se encontra o arquivo do requisito.
- A pasta `assets/` na raiz do repositório é reservada exclusivamente para imagens globais ou institucionais do projeto (ex.: logos, diagramas conceituais reutilizáveis) e NÃO deve ser utilizada para imagens específicas de requisitos.

DESCRIÇÃO DAS IMAGENS:
- A descrição deve explicar:
  - qual tela ou estado está sendo representado
  - o que deve ser observado na imagem
  - por que a imagem é relevante para o entendimento do requisito
- Evitar descrições genéricas como "Tela inicial do sistema".

REGRAS PARA INSERÇÃO:
- Inserir a imagem logo após o tópico ao qual ela se refere.
- Utilizar o padrão oficial de nomenclatura e localização de assets.
- Não duplicar imagens que não agregam novos estados ou comportamentos.

RESTRIÇÕES (OBRIGATÓRIAS):
- NÃO repetir o texto da Contextualização.
- NÃO justificar decisões de negócio.
- NÃO misturar critérios de aceite nesta seção.
- NÃO descrever detalhes de implementação técnica
  (ex.: tecnologias, frameworks, APIs internas).

ESCOPO DO CONTEÚDO:
Nesta seção DEVEM ser descritos, quando aplicável:
- Acesso à funcionalidade (pré-condições funcionais)
- Fluxo principal do sistema
- Estados visuais relevantes das telas
- Comportamentos alternativos ou exceções
- Regras funcionais associadas ao fluxo

DIRETRIZES IMPORTANTES:
- Prefira frases no formato:
  "O sistema deve <ação observável>."
- Evite termos vagos como "pode", "idealmente", "quando possível".
- Se um comportamento precisar ser validado para aceite,
  ele deve existir aqui primeiro.

REGRA DE OURO:
Se o texto descreve APENAS o resultado esperado, ele provavelmente pertence aos Critérios de Aceite.
Se descreve COMO o sistema se comporta (incluindo o que é exibido na tela), ele pertence ao Detalhamento Funcional.
-->

## Mensagens e Estados

<!--
AGENT IA - INSTRUÇÕES DE PREENCHIMENTO PARA MENSAGENS E ESTADOS

Para instruções COMPLETAS e DETALHADAS sobre Mensagens e Estados, consulte:
📄 ../prompts/prompt-mensagens-estados-unificado.md

RESUMO RÁPIDO:
✓ Documentar apenas estados relevantes (com impacto no comportamento ou fluxo)
✓ Descrever condição, comportamento e mensagem (quando aplicável)
✓ Não listar estados triviais
✓ Referenciar Critérios de Aceite quando necessário
  -->

- **{{ESTADO_1}}**
  - **Condição:** {{CONDICAO_DO_ESTADO}}
  - **Comportamento do sistema:** {{COMPORTAMENTO}}
  - **Mensagem exibida:** {{MENSAGEM}}

- **{{ESTADO_2}}**
  - **Condição:** {{CONDICAO_DO_ESTADO}}
  - **Comportamento do sistema:** {{COMPORTAMENTO}}
  - **Mensagem exibida:** {{MENSAGEM}}

# Fluxos Relacionados e Navegação

<!--

AGENT IA - INSTRUÇÕES DE PREENCHIMENTO PARA FLUXOS RELACIONADOS E NAVEGAÇÃO

Para instruções COMPLETAS e DETALHADAS sobre fluxos relacionados, consulte:
📄 ../prompts/prompt-fluxos-navegacao-unificado.md

RESUMO RÁPIDO:
✓ Documente apenas relações COM IMPACTO FUNCIONAL
✓ Categorize em: Fluxos Anteriores, Posteriores, Alternativos (apenas se existirem)
✓ Explique BREVEMENTE o papel de cada relação
✓ Use links relativos corretos
✓ Marque requisitos em desenvolvimento com "(requisito em desenvolvimento)"
✓ NÃO documente navegação padrão (menu, botão voltar)
✓ 4 exemplos práticos disponíveis no prompt centralizado

-->

{{RELACOES_ENTRE_REQUISITOS}}

# Regras e Comportamentos do Sistema

<!--
AGENT IA - INSTRUÇÕES DE PREENCHIMENTO PARA REGRAS E COMPORTAMENTOS DO SISTEMA

Para instruções COMPLETAS e DETALHADAS sobre regras e comportamentos, consulte:
📄 ../prompts/prompt-regras-comportamentos-sistema-unificado.md

RESUMO RÁPIDO:
✓ Regras automáticas e restrições transversais
✓ Não dependem do fluxo visual
✓ Frases no formato "O sistema deve..."
✓ Um comportamento por item
✓ Referenciar Critérios de Aceite quando aplicável
  -->

- {{REGRA_1}}
- {{REGRA_2}}



# Referências do Requisito

<!--
AGENT IA - INSTRUÇÕES DE PREENCHIMENTO PARA REFERÊNCIAS DO REQUISITO

Para instruções COMPLETAS e DETALHADAS sobre referências, consulte:
📄 ../prompts/prompt-referencias-requisito-unificado.md

RESUMO RÁPIDO:
✓ Seção OPCIONAL — criar apenas com referências reais
✓ Não criar seção vazia e não manter placeholders
✓ Descrever cada referência antes do link
✓ Incluir Protótipo/Diagramas/Fluxos/Anexos quando aplicável
✓ Referências são complementares (não repetem regras do requisito)
-->

## Protótipo

<!-- EXCLUIR SE NÃO EXISTIR -->

- {{LINK_DESCRITIVO_PROTO}}

## Requisitos Relacionados

<!-- EXCLUIR SE NÃO EXISTIR -->

- **[{{NOME_REQUISITO}}]:** {{DESCRICAO_DO_MOTIVO_DO_RELACIONAMENTO}}.

   Para mais detalhes, consulte [{{NOME_REQUISITO}}]({{CAMINHO_RELATIVO_REQUISITO}}).

## Diagramas

<!-- EXCLUIR SE NÃO EXISTIR -->

- {{LINK_DESCRITIVO_DIAGRAMA}}

## Fluxos

<!-- EXCLUIR SE NÃO EXISTIR -->

- {{LINK_DESCRITIVO_FLUXO}}

## Anexos

<!-- EXCLUIR SE NÃO EXISTIR -->

| Nome / Link         | Descrição     |
| ------------------- | ------------- |
| {{LINK_OU_ARQUIVO}} | {{DESCRICAO}} |

# Cenários de Comportamento

<!--
AGENT IA - INSTRUÇÕES DE PREENCHIMENTO PARA CENÁRIOS DE COMPORTAMENTO (BDD)

Para instruções COMPLETAS e DETALHADAS sobre cenários BDD, consulte:
📄 ../prompts/prompt-cenarios-comportamento-bdd.md

RESUMO RÁPIDO:
✓ Usar formato Given-When-Then (Dado que-Quando-Então)
✓ Dados CONCRETOS (não placeholders genéricos)
✓ Um cenário = um comportamento específico
✓ Cobrir: fluxo principal, validações, regras, permissões, erros, edge cases
✓ Títulos descritivos para cada cenário
✓ Separar cenários com ---
✓ Resultados observáveis e verificáveis

CATEGORIAS MÍNIMAS:
✓ Cenário 1: Fluxo principal (happy path)
✓ Cenário 2+: Validações e regras de negócio
✓ Cenário N: Permissões, erros, edge cases
-->

## Cenário 1: {{TITULO_CENARIO_PRINCIPAL}}

**Dado que** {{CONDICAO_INICIAL}}
**E** {{CONTEXTO_ADICIONAL}}

**Quando** {{ACAO_DO_USUARIO}}

**Então** o sistema deve:
  - {{RESULTADO_ESPERADO_1}}
  - {{RESULTADO_ESPERADO_2}}

---

## Cenário 2: {{TITULO_CENARIO_VALIDACAO}}

**Dado que** {{CONDICAO_INICIAL}}

**Quando** {{ACAO_INVALIDA}}

**Então** o sistema deve:
  - {{COMPORTAMENTO_ERRO}}
  - {{MENSAGEM_EXIBIDA}}



# Permissões e Regras de Acesso

<!--
AGENT IA - INSTRUÇÕES DE PREENCHIMENTO PARA PERMISSÕES E REGRAS DE ACESSO

Para instruções COMPLETAS e DETALHADAS sobre permissões, consulte:
📄 ../prompts/prompt-permissoes-regras-acesso-unificado.md

RESUMO RÁPIDO:
✓ Modelo com permissões (tabela) quando houver controle de acesso
✓ Modelo sem permissões quando acesso é irrestrito
✓ Não listar permissões CRUD sem aplicabilidade
✓ Não confundir controles externos com permissões de usuário
  -->

O aplicativo PDV **não possui controle de permissões por usuário**.

Uma vez que o PDV esteja devidamente ativado e operacional, **todas as funcionalidades disponíveis no aplicativo podem ser acessadas por qualquer operador**, não havendo diferenciação de acesso, perfis ou restrições funcionais no nível da aplicação.



# Histórico de Alterações

<!--
AGENT IA - INSTRUÇÕES DE PREENCHIMENTO PARA HISTÓRICO DE ALTERAÇÕES

Para instruções COMPLETAS e DETALHADAS sobre histórico de alterações, consulte:
📄 ../prompts/prompt-historico-alteracoes-unificado.md

RESUMO RÁPIDO:
✓ Seção obrigatória
✓ Registrar alterações funcionais/documentais
✓ Descrição objetiva (O QUE mudou)
✓ Data DD/MM/AAAA e Card Jira quando aplicável
-->

| Data     | Card Jira | Autor     | Descrição da Alteração |
| -------- | --------- | --------- | ---------------------- |
| {{DATA}} | {{JIRA}}  | {{AUTOR}} | {{DESCRICAO}}          |

---

<div align="center">
  <sub><strong>🔒 Documento Confidencial</strong> • Uso Interno</sub>
</div>
<br>

