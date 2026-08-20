# Prompt Unificado — Cabeçalho do Requisito

Este prompt define as instruções **obrigatórias** para geração e manutenção do cabeçalho de **qualquer documento de requisito**, independentemente da ação (Tipo A) ou capacidade (Tipo B).

O cabeçalho é a moldura institucional que envolve todo requisito, garantindo rastreabilidade, identidade visual e navegação clara.

---

## 1. REGRA DE OURO

Use o template como "molde". Não reescreva o cabeçalho por conta própria.

Copie e preencha os placeholders mantendo a estrutura original.

Cada campo do cabeçalho tem um propósito funcional:
- **Logo**: identidade visual institucional
- **Breadcrumb**: navegação e localização no repositório
- **Título**: nome semanticamente equivalente ao arquivo
- **Versão e Data**: rastreabilidade e atualização
- **Separadores**: delimitação clara de seções

---

## 2. LOGO INSTITUCIONAL

### Obrigatoriedade
Este documento DEVE iniciar com o logo institucional.

### Regra
- Não remover
- Não mover para outra posição

### Observação sobre Caminhos
O caminho relativo da imagem pode variar conforme o nível de pastas onde o requisito se encontra, considerando que o logo institucional está **SEMPRE** localizado na pasta `assets/` na raiz do repositório.

O logo institucional é opcional. Se existir, use caminhos relativos corretos conforme a profundidade do arquivo.

**Importante:** Valide SEMPRE o caminho relativo antes de gerar o documento final.

---

## 3. SEPARADORES OBRIGATÓRIOS (---)

### Quantidade
O template contém **DOIS separadores obrigatórios** no cabeçalho:

1. Um separador logo abaixo do logo
2. Um separador logo abaixo da linha de versão/data

### Regras
- NÃO remover esses separadores
- NÃO adicionar novos separadores em outras partes do documento
- NÃO utilizar separadores para propósitos decorativos

### Interpretação
"Não inserir separadores artificiais" significa:
- Não criar separadores extras para fins visuais
- Os separadores do cabeçalho definidos no template são **obrigatórios** e não devem ser alterados

---

## 4. BREADCRUMB E TÍTULO

### Padrão Estrutural

```
[Módulo: {{NOME_DO_MODULO}}](../../README.md) › **{{NOME_DO_REQUISITO}}**
```

### Regras de Denominação

#### A. Padrão Universal (Tipo A e Tipo B)
Estrutura: **\<Ação no infinitivo\> \<Entidade(s)\>**

#### B. Exemplos Válidos para Tipo A
- Listar Usuários
- Criar Estabelecimentos Comerciais
- Editar Igrejas
- Visualizar PDVs
- Excluir Adquirentes
- Ativar/Inativar Contratos

#### C. Exemplos Válidos para Tipo B
- Autenticação de Usuário
- Sincronização de Dados
- Conciliação Automática
- Validação de Equipamentos

#### D. Restrições Absolutas

**NÃO utilizar nomes baseados em UI:**
- ❌ "Listagem de Usuários"
- ❌ "Tela de Cadastro"
- ❌ "Formulário de Edição"
- ❌ "Interface de Controle"

**NÃO utilizar estruturas vagas:**
- ❌ "Gerenciar Usuarios"
- ❌ "Operações com PDVs"
- ❌ "Sistema de Controle"

**NÃO utilizar nomenclaturas técnicas:**
- ❌ "API de Listagem"
- ❌ "Endpoint de Sincronização"
- ❌ "Serviço de Autenticação"

#### E. Equivalência Arquivo ↔ Título

O nome exibido no documento (título/breadcrumb) **DEVE** ser semanticamente equivalente ao nome do arquivo, mudando apenas a formatação:

| Arquivo (kebab-case) | Título (PT-BR formatado) |
|---|---|
| listar-usuarios.md | Listar Usuários |
| criar-estabelecimentos-comerciais.md | Criar Estabelecimentos Comerciais |
| editar-modelos-de-equipamentos.md | Editar Modelos de Equipamentos |
| autenticacao-usuario.md | Autenticação de Usuário |

#### F. Breadcrumb (Navegação)

- `{{NOME_DO_MODULO}}`: nome da pasta que contém o requisito  
  Exemplos: "Acesso Inicial", "Gestão Institucional"
- **Link relativo**: deve apontar para o README.md da pasta imediatamente acima
- **Título**: deve estar em negrito após o símbolo ›

#### G. Validação Final

Antes de gerar o documento, confirme:
- ✓ O título reflete exatamente o objetivo do requisito
- ✓ O título é compreensível para um usuário não técnico
- ✓ O arquivo e o título têm equivalência semântica
- ✓ Não há ambiguidade no título

---

## 5. VERSÃO E DATA

### Formato Obrigatório

```
**Versão:** X.Y | **Última atualização:** DD/MM/AAAA
```

### Regras de Formatação
- Manter ambos os campos em negrito (`**texto**`)
- Usar barra vertical ( | ) como separador
- Manter a ordem: Versão → Data
- Não substituir por variações como "Versão: ..." ou "Data de Atualização: ..."

### Regras de Versionamento

#### A. Versionamento Semântico Simplificado
- Formato: **X.Y** (duas casas decimais)
- **X** = versão principal (incrementa em merges para main)
- **Y** = versão secundária (incrementa em merges para spec-approved)

#### B. Ciclo de Vida do Documento

**FASE 1: Criação (Branch spec/*)**
- Novos documentos iniciam SEMPRE em **0.1**
- Não incrementar versão durante trabalho em branch de especificação
- Exemplo: 0.1 → 0.1 → 0.1 (múltiplas edições na mesma branch)

**FASE 2: Merge em spec-approved**
- Incrementar apenas **Y** (a segunda casa decimal)
- 0.1 → 0.2 → 0.3 (sucessivos merges em spec-approved)
- Exemplo de progressão: 0.1 → 0.2 → 0.3 → 0.4 → 0.5 → 1.0

**FASE 3: Merge em main (produção)**
- Incrementar **X** (a primeira casa decimal)
- Reiniciar **Y** para 0
- 0.5 → 1.0 (primeiro merge em main)
- Próximos merges em main: 1.0 → 2.0 → 3.0

**FASE 4: Atualizações em main**
- Se houve mudanças em spec-approved antes de retornar a main:
  incrementar **X** novamente (ex.: 1.0 → 2.0)

#### C. Data de Atualização
- Formato: **DD/MM/AAAA** (brasileiro)
- Sempre refletir a data do último commit que modificou o requisito
- Atualizar manualmente ou via automação de CI/CD

#### D. Exemplos Válidos
- `**Versão:** 0.1 | **Última atualização:** 04/02/2026`
- `**Versão:** 1.0 | **Última atualização:** 04/02/2026`
- `**Versão:** 2.3 | **Última atualização:** 04/02/2026`

---

## 6. ESTILO GERAL DE ESCRITA

Padrões aplicáveis ao cabeçalho e a todo o documento:

- Não utilizar ícones, emojis ou caracteres especiais desnecessários
- Preferir texto claro, bullets e listas numeradas
- Manter linguagem objetiva, técnica e consistente entre requisitos
- Evitar redundâncias entre campos (ex.: não repetir o título na breadcrumb)
- Usar pontuação de forma coerente (evitar múltiplos pontos ou parênteses)

---

## 7. RODAPÉ INSTITUCIONAL

### Obrigatoriedade
Este documento DEVE terminar com o rodapé institucional.

### Regra
- Não remover

### Formato

```
---

**Rodapé Institucional** — Cadastro Membros © AAAA — Todos os direitos reservados.
```

### Detalhes
- Utilizar o ano corrente no formato AAAA
- Manter a estrutura exata (separador, negrito, © símbolo)
- Manter a descrição "Cadastro Membros"

---

## 8. INFORMAÇÃO INSUFICIENTE

Se faltar informação para preencher qualquer campo obrigatório do cabeçalho:

1. **Solicite esclarecimentos ANTES** de gerar o documento
2. **Faça perguntas objetivas:**
   - "Qual é o nome exato do módulo contendo este requisito?"
   - "Qual é a data de criação do documento?"
   - "Há alguma versão anterior deste requisito?"
3. **Não invente** ou assuma valores para placeholders

---

## 9. CHECKLIST DE VALIDAÇÃO DO CABEÇALHO

Antes de finalizar o requisito, verifique:

- [ ] Logo institucional presente e com caminho relativo correto
- [ ] Primeiro separador (---) logo abaixo do logo
- [ ] Breadcrumb com link válido e módulo correto
- [ ] Título em negrito, seguindo padrão "Ação Entidade"
- [ ] Título equivalente semanticamente ao arquivo
- [ ] Segundo separador (---) logo abaixo da versão/data
- [ ] Versão no formato X.Y (não X.Y.Z ou X_Y)
- [ ] Data no formato DD/MM/AAAA
- [ ] Barra vertical ( | ) como separador entre campos
- [ ] Ambos os campos em negrito
- [ ] Nenhum placeholder ({{...}}) deixado sem preenchimento
- [ ] Caminho do logo testado (acessível do nível da pasta)
- [ ] Arquivo correlato (se existe) tem nome equivalente ao título

---

## 10. EXEMPLOS PRÁTICOS (REFERÊNCIA)

### EXEMPLO 1: Requisito Tipo A (Listar)

**Arquivo:** `listar-usuarios.md`  
**Caminho:** `requisitos/acesso-inicial/listar-usuarios.md`

```markdown
---

[Módulo: Acesso Inicial](../../README.md) › **Listar Usuários**

**Versão:** 1.2 | **Última atualização:** 04/02/2026

---
```

### EXEMPLO 2: Requisito Tipo A (Criar)

**Arquivo:** `criar-estabelecimentos-comerciais.md`  
**Caminho:** `requisitos/gestao-institucional/criar-estabelecimentos-comerciais.md`

```markdown
---

[Módulo: Gestão Institucional](../../README.md) › **Criar Estabelecimentos Comerciais**

**Versão:** 0.3 | **Última atualização:** 03/02/2026

---
```

### EXEMPLO 3: Requisito Tipo B (Capacidade)

**Arquivo:** `autenticacao-usuario.md`  
**Caminho:** `requisitos/capacidades/autenticacao-usuario.md`

```markdown
---

[Módulo: Segurança](../../README.md) › **Autenticação de Usuário**

**Versão:** 2.0 | **Última atualização:** 01/02/2026

---
```

---

## Referências Relacionadas

- [NAMING_CONVENTIONS.md](../../NAMING_CONVENTIONS.md) — Padrões de nomenclatura (Tipo A/B)
- [STANDARDS.md](../../STANDARDS.md) — Padrões gerais de documentação
- [Índice de Prompts](./README.md) — Todos os prompts unificados

---

