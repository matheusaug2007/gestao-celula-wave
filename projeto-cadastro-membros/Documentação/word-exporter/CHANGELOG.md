# 📌 Changelog - Word Exporter

## v2.1 - Melhorias de Performance e Usabilidade

### ✨ Novos Recursos

#### 1️⃣ Sanitização de Nomes de Pasta (Branch)
- **Problema:** Windows tem limite de 260 caracteres em caminhos completos. Branches longas causavam erros.
- **Solução:** Nomes de branch agora são sanitizados e limitados a 50 caracteres
  - Caracteres inválidos são substituídos por `_`
  - Nomes muito longos são truncados automaticamente
  - Exemplo: `spec/DCU-1544-melhorias-performance-usabilidade` → `spec_DCU-1544-melhorias-performance`

#### 2️⃣ Exportação Apenas de Arquivos Markdown
- **Mudança:** Agora exporta **apenas arquivos `.md`**, sem copiar imagens e anexos
- **Benefícios:**
  - Reduz tamanho dos arquivos exportados
  - Mantém estrutura limpa sem pastas extras
  - Imagens ainda são incorporadas nos DOCX
  - Se necessário, PO adiciona manualmente imagens após revisão

#### 3️⃣ Redimensionamento Automático de Imagens
- **Implementação:** Novo filtro Lua (`resize-images.lua`) que processa imagens durante exportação
- **Ajuste:** Imagens redimensionadas para **~3.4 polegadas (40% da página)**
  - Mantém proporção automática
  - Melhora legibilidade no documento
  - Garante consistência visual entre requisitos

#### 4️⃣ Melhoria na Exportação de HTML (Rodapés)
- **Problema:** HTML no markdown (rodapé confidencial) não era exportado corretamente para Word
- **Solução:** 
  - Filtro Lua preserva elementos RawBlock e RawInline
  - Pandoc agora usa `--embed-resources` para melhor processamento
  - HTML em rodapés é mantido intacto no DOCX
  - Exemplo: `<div align="center">` com logo agora exporta corretamente

### 🔧 Mudanças Técnicas

**Comando Pandoc atualizado:**
```powershell
# Antes
pandoc -f markdown -t docx -s --resource-path=... -o output.docx input.md

# Agora
pandoc -f markdown -t docx -s --embed-resources --resource-path=... \
  --lua-filter=resize-images.lua -o output.docx input.md
```

**Caminhos de recurso:** Simplificados para apenas diretórios relevantes
- Diretório markdown
- Pasta global de assets
- Raiz do projeto

### 📊 Impacto

| Aspecto | Antes | Depois |
|---------|-------|--------|
| Tamanho pasta exportados | Grande (com imagens) | Menor (sem imagens duplicadas) |
| Nomes de pasta | Podem exceder limite Windows | Sempre dentro do limite |
| Tamanho imagens em DOCX | Variável | Consistente 35-40% |
| HTML no rodapé | ❌ Incorreto | ✅ Correto |

---

## v2.0 - Organização por Branch

### 🆕 Novidade: Organização por Branch

### O que mudou?

A partir desta versão, os arquivos exportados são organizados automaticamente por **branch Git**, criando uma estrutura hierárquica que facilita o controle de versões.

### Estrutura Anterior (v1.0)

```
exportados/
├── funcionalidades-de-apoio/
│   └── menu/
│       └── acessar-menu-principal.docx
├── operacao-doacao/
└── preparacao-do-pdv/
```

**❌ Problema:** Ao trocar de branch, os arquivos eram sobrescritos, dificultando comparações.

### Estrutura Nova (v2.0)

```
exportados/
├── main/                                    ← Branch 'main'
│   ├── funcionalidades-de-apoio/
│   │   └── menu/
│   │       └── acessar-menu-principal.docx
│   ├── operacao-doacao/
│   └── preparacao-do-pdv/
├── develop/                                 ← Branch 'develop'
│   ├── funcionalidades-de-apoio/
│   └── ...
└── spec/DCU-1544-melhorias/                ← Branch de feature
    └── ...
```

**✅ Vantagens:**
- Cada branch mantém sua própria exportação
- Facilita comparação entre versões
- Evita sobrescrever arquivos ao trocar de branch
- Permite auditoria de alterações
- Exportações paralelas sem conflitos

## 🔧 Como Funciona

### Detecção Automática da Branch

O script detecta automaticamente a branch Git atual:

```powershell
# Executando na branch 'main'
.\.luby\word-exporter\exportar-para-word.ps1
# ✓ Exporta para: exportados/main/

# Executando na branch 'develop'
.\.luby\word-exporter\exportar-para-word.ps1
# ✓ Exporta para: exportados/develop/

# Executando na branch 'feature/nova-funcionalidade'
.\.luby\word-exporter\exportar-para-word.ps1
# ✓ Exporta para: exportados/feature-nova-funcionalidade/
```

### Fallback para Não-Git

Se o repositório Git não for detectado (ou não existir), o script usa uma pasta padrão:

```powershell
# Sem Git
.\.luby\word-exporter\exportar-para-word.ps1
# ✓ Exporta para: exportados/exportacao/
```

## 📝 Exemplos de Uso

### Caso de Uso 1: Comparar Requisitos Entre Branches

```powershell
# 1. Exportar requisitos da branch main
git checkout main
.\.luby\word-exporter\exportar-para-word.ps1

# 2. Exportar requisitos da branch develop
git checkout develop
.\.luby\word-exporter\exportar-para-word.ps1

# 3. Resultado:
# exportados/
# ├── main/              ← Requisitos da main
# └── develop/           ← Requisitos da develop

# 4. Agora você pode comparar os arquivos .docx entre as duas pastas
```

### Caso de Uso 2: Criar Pacote de Entrega por Branch

```powershell
# Exportar e criar ZIP da branch atual
.\.luby\word-exporter\exportar-rapido.ps1
# Escolha opção 1 (Exportar tudo)
# Depois opção 6 (Criar ZIP)

# Resultado: requisitos-{branch}-{data}.zip
# Exemplo: requisitos-main-2026-02-25.zip
```

### Caso de Uso 3: Exportar Feature Específica

```powershell
# Você está na branch feature/nova-tela
git checkout feature/nova-tela

# Exportar apenas o requisito alterado
.\.luby\word-exporter\exportar-para-word.ps1 -Arquivo "requisitos\operacao-doacao\nova-tela\requisito.md"

# Resultado:
# exportados/feature-nova-tela/operacao-doacao/nova-tela/requisito.docx
```

## 🎯 Relatório de Exportação Melhorado

O script agora exibe informações mais claras:

```
════════════════════════════════════════════════════════
   EXPORTAÇÃO CONCLUÍDA
════════════════════════════════════════════════════════

✓ Arquivos processados: 15
✓ Exportados com sucesso: 15

ℹ Estrutura de exportação:
  📁 exportados/
  └── 📂 main/
      └── 📄 15 arquivo(s) .docx

ℹ Caminho completo: C:\...\exportados\main

Deseja abrir a pasta de exportação? (S/N)
```

## 🔄 Migração da v1.0 para v2.0

### Arquivos Antigos

Se você tinha arquivos exportados na estrutura antiga (v1.0):

```
exportados/
├── funcionalidades-de-apoio/
└── operacao-doacao/
```

### Após Atualização

Você pode:

**Opção A: Mover manualmente para uma branch**
```powershell
# Criar pasta da branch
New-Item -ItemType Directory -Path "exportados\main" -Force

# Mover arquivos antigos
Move-Item "exportados\funcionalidades-de-apoio" "exportados\main\"
Move-Item "exportados\operacao-doacao" "exportados\main\"
```

**Opção B: Limpar e reexportar**
```powershell
# Limpar exportações antigas
.\.luby\word-exporter\exportar-para-word.ps1 -LimparDestino

# Isso criará a nova estrutura automaticamente
```

## 📊 Comandos Atualizados

### Menu Interativo

```powershell
.\.luby\word-exporter\exportar-rapido.ps1
```

**Opções disponíveis:**
1. Exportar TODOS os requisitos → `exportados/{branch}/`
2. Exportar apenas: Preparação do PDV → `exportados/{branch}/preparacao-do-pdv/`
3. Exportar apenas: Operação de Doação → `exportados/{branch}/operacao-doacao/`
4. Exportar apenas: Funcionalidades de Apoio → `exportados/{branch}/funcionalidades-de-apoio/`
5. Limpar pasta exportados/**{branch}**/ e exportar tudo
6. Criar arquivo ZIP dos exportados/**{branch}** → `requisitos-{branch}-{data}.zip`

### Comandos Diretos

```powershell
# Exportar tudo na branch atual
.\.luby\word-exporter\exportar-para-word.ps1

# Exportar arquivo específico
.\.luby\word-exporter\exportar-para-word.ps1 -Arquivo "requisitos\...\arquivo.md"

# Limpar exportações da branch atual e exportar tudo
.\.luby\word-exporter\exportar-para-word.ps1 -LimparDestino

# Exportar para pasta customizada (ainda cria subpasta da branch)
.\.luby\word-exporter\exportar-para-word.ps1 -PastaDestino "docs"
# Resultado: docs/{branch}/
```

## 🗂️ .gitignore Atualizado

O `.gitignore` foi atualizado para ignorar toda a pasta `exportados/`:

```gitignore
# Pastas de exportação (organizadas por branch)
exportados/
docs-exportados/

# Arquivos ZIP de exportação (gerados na raiz)
requisitos-*.zip
```

**Isso significa:**
- ✅ Todas as exportações são ignoradas pelo Git
- ✅ ZIPs gerados também são ignorados
- ✅ Você pode exportar em qualquer branch sem afetar o controle de versão

## 📚 Documentação Atualizada

Todos os arquivos de documentação foram atualizados:

- ✅ [README.md](.luby/word-exporter/README.md) - Documentação completa
- ✅ [EXPORTACAO-WORD.md](.luby/word-exporter/EXPORTACAO-WORD.md) - Guia detalhado
- ✅ [GUIA-RAPIDO-EXPORTACAO.md](.luby/word-exporter/GUIA-RAPIDO-EXPORTACAO.md) - Início rápido

## 💡 Dicas e Boas Práticas

### 1. Exportar Antes de Pull Request

```powershell
# Na sua branch de feature
.\.luby\word-exporter\exportar-para-word.ps1

# Revisar arquivos .docx em: exportados/{sua-branch}/
# Incluir no PR para revisão visual
```

### 2. Manter Histórico de Exportações

```powershell
# Criar ZIP com versionamento
$branch = git rev-parse --abbrev-ref HEAD
$data = Get-Date -Format "yyyy-MM-dd_HHmm"
Compress-Archive -Path "exportados\$branch" -DestinationPath "arquivo\requisitos-$branch-$data.zip"
```

### 3. Comparar Versões Visualmente

```powershell
# Exportar em duas branches
# Depois use ferramentas como:
# - Microsoft Word (Compare Documents)
# - WinMerge
# - Beyond Compare
```

## 🎉 Resumo das Melhorias

| Aspecto | v1.0 | v2.0 |
|---------|------|------|
| **Organização** | Uma pasta única | Pasta por branch |
| **Detecção Git** | ❌ Não | ✅ Automática |
| **Comparação** | ❌ Difícil | ✅ Fácil |
| **Conflitos** | ⚠️ Possível | ✅ Evitado |
| **ZIP** | Nome genérico | Nome com branch + data |
| **Estrutura** | Plana | Hierárquica |
| **Auditoria** | ❌ Limitada | ✅ Completa |

---

<div align="center">
  <sub><strong>Word Exporter v2.0</strong> • Cadastro Membros • Fevereiro 2026</sub>
</div>
