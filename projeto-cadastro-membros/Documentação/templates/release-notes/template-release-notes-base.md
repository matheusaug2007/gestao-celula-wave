<!--
AGENT IA - INSTRUÇÕES DE PREENCHIMENTO PARA CABEÇALHO

RESUMO RÁPIDO:
✓ Logo institucional obrigatória (ajustar caminho relativo conforme localização do arquivo)
✓ 2 separadores --- (abaixo do logo e abaixo dos metadados)
✓ Versão no formato x.x.x (ex: 0.1.0, 1.0.0)
✓ Data no formato DD/MM/AAAA
✓ Ambiente: preencher com o ambiente de destino da entrega (ex: Homologação, Produção)
✓ GMUD: preencher com o link do card Jira da GMUD se aplicável, caso contrário remover o campo
✓ Card de Homologação: preencher com o link do card Jira de homologação se aplicável, caso contrário remover o campo
-->

---

**Release Notes — {{NOME_DO_PROJETO}}**

**Versão:** x.x.x | **Data de publicação:** DD/MM/AAAA | **Ambiente:** {{AMBIENTE}}

**GMUD:** [DCU-XXXX](https://luby.atlassian.net/browse/DCU-XXXX) | **Card de Homologação:** [DCU-XXXX](https://luby.atlassian.net/browse/DCU-XXXX)

---

# 1. Visão Geral

<!--
AGENT IA - INSTRUÇÕES DE PREENCHIMENTO PARA VISÃO GERAL

OBJETIVO DA SEÇÃO:
Apresentar de forma objetiva o propósito desta release e os principais avanços entregues.

INSTRUÇÕES DE ESCRITA:
- Escreva 1 parágrafo introdutório descrevendo o objetivo principal da entrega.
- Liste de 2 a 5 itens resumindo os principais avanços (funcionalidades ou melhorias mais relevantes).
- Linguagem de negócio, sem termos técnicos.
- Responde "O QUE foi entregue e POR QUÊ", não "COMO foi implementado".
-->

{{DESCRICAO_OBJETIVO_DA_RELEASE}}

Os principais avanços desta entrega incluem:
- {{RESUMO_1}}
- {{RESUMO_2}}
- {{RESUMO_3}}

---

# 2. Itens Entregues

<!--
AGENT IA - INSTRUÇÕES DE PREENCHIMENTO PARA ITENS ENTREGUES

OBJETIVO DA SEÇÃO:
Descrever todas as entregas desta release — novas funcionalidades, melhorias e POCs — organizadas por Épico e Funcionalidade/Melhoria.

ESTRUTURA:
- Nível 1 (##): Épico — agrupa entregas relacionadas a um mesmo módulo ou objetivo de negócio. Usar formato: "## Épico: [DCU-XXXX](...) — {{NOME_DO_EPICO}}"
- Nível 2 (###): Funcionalidade ou Melhoria — cada card Jira entregue, identificando o tipo entre colchetes. Usar formato: "### [Nova funcionalidade] [DCU-XXXX](...): {{NOME_DO_ITEM}}" ou "### [Melhoria] [DCU-XXXX](...): {{NOME_DO_ITEM}}"
- Detalhes opcionais: listar em bullets apenas quando houver aspectos relevantes que complementem o entendimento da entrega. Não detalhar implementação técnica.

INSTRUÇÕES DE ESCRITA:
- Descreva o que o usuário passa a conseguir fazer ou o que foi aprimorado.
- Para melhorias, descreva o que foi ajustado e qual benefício isso traz.
- Linguagem orientada ao negócio, sem termos técnicos.
- Se o item não tiver detalhes relevantes além da descrição, omita os bullets.
- Repetir o bloco "## Épico" quantas vezes for necessário.
- Repetir o bloco "### Funcionalidade/Melhoria" dentro de cada épico quantas vezes for necessário.
- Tipos válidos: "Nova funcionalidade", "Melhoria", "POC".
-->

## Épico: [DCU-XXXX](https://luby.atlassian.net/browse/DCU-XXXX) — {{NOME_DO_EPICO}}

### [Nova funcionalidade] [DCU-XXXX](https://luby.atlassian.net/browse/DCU-XXXX): {{NOME_DO_ITEM}}

{{DESCRICAO_BREVE}}

- {{DETALHE_RELEVANTE_1}}
- {{DETALHE_RELEVANTE_2}}

### [Melhoria] [DCU-XXXX](https://luby.atlassian.net/browse/DCU-XXXX): {{NOME_DO_ITEM}}

{{DESCRICAO_BREVE}}

---

## Épico: [DCU-XXXX](https://luby.atlassian.net/browse/DCU-XXXX) — {{NOME_DO_EPICO}}

### [Nova funcionalidade] [DCU-XXXX](https://luby.atlassian.net/browse/DCU-XXXX): {{NOME_DO_ITEM}}

{{DESCRICAO_BREVE}}

---

# 3. Recomendações de Teste

<!--
AGENT IA - INSTRUÇÕES DE PREENCHIMENTO PARA RECOMENDAÇÕES DE TESTE

OBJETIVO DA SEÇÃO:
Orientar o time de homologação sobre os principais fluxos a serem validados.

INSTRUÇÕES DE ESCRITA:
- Adicionar um subtítulo introdutório antes da lista (ex: "Fluxos sugeridos para validação em homologação:").
- Listar os fluxos e cenários mais críticos para validação.
- Não é necessário detalhar passo a passo — apenas citar o fluxo de forma objetiva.
- Os cenários detalhados estão nos requisitos em spec-approved; esta seção é um guia rápido.
- Pode ser organizado por funcionalidade ou épico quando facilitar o entendimento.
- Referenciar os cards Jira relevantes como links clicáveis quando aplicável.
-->

Fluxos sugeridos para validação em homologação:

- {{DESCRICAO_DO_FLUXO_A_VALIDAR}}
- {{DESCRICAO_DO_FLUXO_A_VALIDAR}}
- {{DESCRICAO_DO_FLUXO_A_VALIDAR}}

> Os cenários detalhados de cada funcionalidade estão disponíveis nos requisitos em `spec-approved` do repositório do projeto.

---

# 4. Ações Necessárias para Implantação

<!--
AGENT IA - INSTRUÇÕES DE PREENCHIMENTO PARA AÇÕES NECESSÁRIAS

OBJETIVO DA SEÇÃO:
Informar ações que precisam ser executadas para que a release funcione corretamente no ambiente de destino.

QUANDO UTILIZAR:
- Quando uma funcionalidade sobrescreve ou altera comportamento de algo já existente.
- Quando há necessidade de carga ou migração de dados.
- Quando há configurações, parâmetros ou ajustes de ambiente necessários.
- Quando há instalação manual ou procedimento especial de implantação (ex: instalação via QR Code).

INSTRUÇÕES DE ESCRITA:
- Organizar em subseções (##) quando houver procedimentos distintos (ex: "## Instalação via QR Code").
- Usar blocos de aviso (> **Atenção:**) para alertas críticos.
- Imagens podem ser incluídas quando necessário (ex: QR Codes por modelo de equipamento).
- Indicar quem é responsável pela ação quando aplicável.
- REMOVER esta seção inteiramente se não houver ações necessárias nesta release.
-->

## {{TITULO_DO_PROCEDIMENTO}}

{{DESCRICAO_DO_PROCEDIMENTO}}

> **Atenção:** {{ALERTA_CRITICO}}

- {{ACAO_NECESSARIA_1}}
- {{ACAO_NECESSARIA_2}}

---

# 5. Riscos e Pontos de Atenção

<!--
AGENT IA - INSTRUÇÕES DE PREENCHIMENTO PARA RISCOS E PONTOS DE ATENÇÃO

OBJETIVO DA SEÇÃO:
Registrar riscos conhecidos ou pontos que merecem atenção especial durante a implantação ou homologação.

QUANDO UTILIZAR:
- Quando há dependências externas que podem impactar a entrega.
- Quando há limitações conhecidas nesta versão.
- Quando um fluxo específico exige cuidado redobrado na validação.

INSTRUÇÕES DE ESCRITA:
- Ser objetivo e direto.
- Não usar esta seção para listar funcionalidades fora do escopo (isso seria "itens não entregues", que não devemos evidenciar).
- REMOVER esta seção inteiramente se não houver riscos ou pontos de atenção nesta release.
-->

- {{RISCO_OU_PONTO_DE_ATENCAO_1}}
- {{RISCO_OU_PONTO_DE_ATENCAO_2}}

---

# 6. Documentação de Requisitos

<!--
AGENT IA - INSTRUÇÕES DE PREENCHIMENTO PARA DOCUMENTAÇÃO DE REQUISITOS

Esta seção é fixa. Não alterar o conteúdo, apenas ajustar o nome do repositório se necessário.
-->

A documentação completa dos requisitos está disponível no branch `spec-approved` do repositório do projeto.

---

# 7. Contatos e Suporte

<!--
AGENT IA - INSTRUÇÕES DE PREENCHIMENTO PARA CONTATOS E SUPORTE

OBJETIVO DA SEÇÃO:
Indicar os responsáveis que podem ser acionados em caso de dúvidas ou problemas relacionados a esta entrega.

INSTRUÇÕES DE PREENCHIMENTO:
- Adicionar um texto introdutório antes da tabela (ex: "Em caso de dúvidas ou problemas relacionados a esta entrega:").
- Incluir pelo menos o PO e um representante técnico.
- Contato: preferencialmente e-mail ou canal no Teams/Discord.
-->

Em caso de dúvidas ou problemas relacionados a esta entrega:

| Nome | Função | Contato |
|------|--------|---------|
| {{NOME}} | {{FUNCAO}} | {{CONTATO}} |
| {{NOME}} | {{FUNCAO}} | {{CONTATO}} |

---

# Histórico de Alterações

<!--
AGENT IA - INSTRUÇÕES DE PREENCHIMENTO PARA HISTÓRICO DE ALTERAÇÕES

OBJETIVO DA SEÇÃO:
Registrar o histórico de revisões deste documento de release notes.

INSTRUÇÕES DE PREENCHIMENTO:
- Registrar a criação do documento na primeira linha.
- Adicionar novas linhas a cada revisão relevante do documento (não do sistema).
- Data no formato DD/MM/AAAA.
- Card Jira: informar o card de controle do release notes como link clicável.
- Descrição: descrever o que foi alterado no documento (ex: "Criação do documento", "Inclusão de nova história", "Revisão de recomendações de teste").
-->

| Data | Card Jira | Autor | Descrição |
|------|-----------|-------|-----------|
| DD/MM/AAAA | [DCU-XXXX](https://luby.atlassian.net/browse/DCU-XXXX) | {{AUTOR}} | Criação do documento |

---

<div align="center">
  <sub><strong>🔒 Documento Confidencial</strong> • Uso Interno</sub>
</div>
<br>

