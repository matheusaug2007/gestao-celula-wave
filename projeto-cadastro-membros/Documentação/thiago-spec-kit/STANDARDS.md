[Cadastro Membros](../../README.md) > [Spec Kit](./README.md) > **Standards**

---

# 📘 Standards de Documentação de Requisitos

Este documento define o padrão oficial para escrita, organização e versionamento de requisitos no repositório.

O objetivo é garantir que os requisitos:
- sejam **claros e compreensíveis para usuários-chave**, permitindo validação e aprovação consciente;
- sejam **precisos e estruturados para o time técnico**, servindo como base para implementação, testes e automação;
- possam ser **consumidos por ferramentas de apoio ao desenvolvimento**, incluindo geração assistida de código.

## Como Ler Este Documento

Este padrão foi pensado para atender diferentes públicos:

- **Usuários-chave e stakeholders** devem focar principalmente em:
  - Resumo Executivo
  - Objetivo
  - Fluxo Principal
  - Critérios de Aceite

- **Time técnico e ferramentas automatizadas** devem considerar o documento completo, incluindo:
  - Requisitos Funcionais
  - Requisitos Técnicos
  - Regras e exceções

A ordem das seções reflete essa progressão natural: do entendimento do problema → validação da solução → implementação.



## Princípios Gerais

- O requisito descreve **o que o sistema deve fazer**, não como será implementado.
- Cada requisito deve ser **observável e validável**.
- Evitar textos explicativos ou justificativas dentro de regras.
- Preferir frases objetivas, com uma regra por item.
- Utilizar linguagem neutra e determinística.


## Padrões de Escrita

- Idioma: Português do Brasil (pt-BR); tom profissional e claro.
- Frases curtas; parágrafos com até ~4 linhas.
- Terminologia consistente (ex.: manter o mesmo formato para nomes de produtos/sistemas ao longo do documento).
- Datas no formato dd/mm/aaaa (ex.: 23/01/2026).
- Valores monetários no formato brasileiro (ex.: R$ 1.000,00).
- Encoding do arquivo: UTF-8 (evita problemas de acentuação).
- Evite redundâncias e jargão desnecessário.

Checklist rápido:
- [ ] Ortografia e gramática revisadas
- [ ] Terminologia consistente
- [ ] Datas no padrão dd/mm/aaaa
- [ ] Moeda no padrão R$ 1.000,00


## Formatação Essencial em Markdown

### Títulos
```
# Título Principal (H1)     – Usar uma vez por arquivo
## Seções Principais (H2)   – Nível 2
### Subseções (H3)          – Nível 3
#### Sub-subseções (H4)     – Evitar passar disso
```

### Listas
```
- Item nível 1
  - Item nível 2
    - Item nível 3  
```

Listas ordenadas:
```
1. Primeiro passo
   1. Subpasso
   2. Subpasso
2. Segundo passo
```

### Ênfase
```
**Texto em negrito** – Conceitos importantes
*Texto em itálico*   – Ênfase leve
`Código ou comando`  – Nome de arquivo/variável
```

### Tabelas
```
| Coluna A | Coluna B |
|----------|----------|
| Valor A  | Valor B  |
```

### Blocos de código
````markdown
```bash
echo "Exemplo"
```
````

### Citações
```
> Citação importante
```
### Links

**Regra obrigatória:** Sempre utilize caminhos relativos para referenciar arquivos internos do repositório.

```markdown
[Texto do link](../pasta/arquivo.md)                    – Link relativo interno
[Texto do link](https://exemplo.com)                   – Link externo
[Título Requisito](requisitos/funcionais/REQ-001-*.md) – Link com referência
```

**Benefícios dos caminhos relativos:**
- Evita quebra de links quando a estrutura do repositório muda
- Funciona em diferentes ambientes (local, GitHub, clone)
- Facilita manutenção e portabilidade da documentação



## Estrutura do Documento de Requisito

### Templates Disponíveis

Este repositório oferece templates especializados para diferentes tipos de funcionalidades. Cada template contém **blocos AGENT IA - INSTRUÇÕES DE PREENCHIMENTO integrados** que orientam especificamente como preencher cada seção.

**Localização dos templates:**
- Pasta: `Documentação/templates/requisitos/`
- Acesse: [Documentação/templates/requisitos/](../templates/requisitos/)

**Templates por tipo de funcionalidade:**

Cada template é customizado para um tipo específico de requisito e possui instruções detalhadas (via blocos AGENT IA - INSTRUÇÕES DE PREENCHIMENTO) sobre:
- Quais seções são obrigatórias ou opcionais
- Como preencher cada campo
- Exemplos contextualizados
- Critérios de validação

**Tipificação A e B (Nomenclatura):**

Antes de escolher o template, valide a tipificação do requisito conforme os tipos **A** e **B** definidos em [NAMING_CONVENTIONS.md](./NAMING_CONVENTIONS.md). Essa classificação orienta a escolha do template adequado e evita ambiguidades na estrutura do requisito.

**Importante:**

⚠️ **Não edite este arquivo (STANDARDS.md) para adicionar instruções de preenchimento.** 
As orientações específicas de cada seção estão nos **blocos AGENT IA - INSTRUÇÕES DE PREENCHIMENTO dentro dos templates**.

Essa abordagem:
- ✅ Evita duplicação e inconsistências de informação
- ✅ Permite templates especializados por tipo de funcionalidade
- ✅ Facilita manutenção (uma única fonte de verdade por template)
- ✅ Melhora a experiência de uso com ferramentas de IA

### Como Usar os Templates

1. Acesse a pasta `Documentação/templates/requisitos/`
2. Escolha o template adequado ao tipo de funcionalidade
3. Copie o template para a pasta de destino no módulo apropriado
4. Siga os blocos AGENT IA - INSTRUÇÕES DE PREENCHIMENTO dentro do arquivo para preencher cada seção
5. Os prompts orientam sobre conteúdo obrigatório, formato e boas práticas


## Orientações para Uso com Ferramentas de IA

Para melhor aproveitamento por ferramentas como Cursor, GitHub Spec Kit e similares:

- Preferir frases determinísticas.
- Evitar ambiguidade semântica.
- Manter padrões consistentes de escrita.
- Evitar linguagem opinativa dentro dos requisitos.
- Garantir que cada regra possa ser convertida em comportamento verificável.


## Checklist de Qualidade

Antes de fazer commit ou compartilhar para validação, confirme:

**Conteúdo**
- [ ] Título claro e nome do arquivo segue naming
- [ ] Resumo executivo cobre problema, público e impacto
- [ ] Critérios de aceite são testáveis e objetivos
- [ ] Dependências e referências estão listadas
- [ ] Histórico de alterações atualizado

**Formato**
- [ ] Markdown bem estruturado (títulos, listas, tabelas)
- [ ] Links relativos funcionam
- [ ] Imagens/diagramas seguem pasta e nome padrão

**Escrita**
- [ ] Ortografia e gramática revisadas
- [ ] Linguagem clara, sem ambiguidade
- [ ] Sem justificativas misturadas a regras

---
