# Word Exporter - Ferramentas de Exportação

![Cadastro Membros](../../assets/logo-produto-small.png)

Ferramentas para exportação de requisitos Markdown para o formato Microsoft Word (.docx).

## 📋 Visão Geral

Este diretório contém scripts PowerShell que permitem converter a documentação de requisitos em Markdown para arquivos Word (.docx), mantendo formatação, estrutura e todas as imagens referenciadas.

## 🚀 Início Rápido

### 1️⃣ Instalar Dependências

Execute a partir da **raiz do projeto**:

```powershell
.\.luby\word-exporter\instalar-dependencias.ps1
```

Este script instalará automaticamente o **Pandoc**, ferramenta necessária para a conversão.

### 2️⃣ Exportar Requisitos

**Opção A - Menu Interativo (Recomendado):**

```powershell
.\.luby\word-exporter\exportar-rapido.ps1
```

Exibe um menu com opções:
- Exportar todos os requisitos
- Exportar por módulo (Preparação, Operação, Apoio)
- Criar arquivo ZIP dos exportados
- Entre outros

**Opção B - Exportação Direta:**

```powershell
# Exportar todos os requisitos
.\.luby\word-exporter\exportar-para-word.ps1

# Exportar arquivo específico
.\.luby\word-exporter\exportar-para-word.ps1 -Arquivo "requisitos\operacao-doacao\tela-inicial\exibir-tela-inicial-pdv.md"

# Limpar pasta exportados/ antes de exportar
.\.luby\word-exporter\exportar-para-word.ps1 -LimparDestino
```

### 3️⃣ Arquivos Exportados

Os arquivos `.docx` serão criados em: `exportados/{nome-da-branch}/` (na raiz do projeto)

A estrutura de pastas original será mantida, organizada por branch:
```
exportados/
└── main/                          ← Nome da branch atual
    ├── funcionalidades-de-apoio/
    │   ├── menu/
    │   │   ├── acessar-menu-principal.docx
    │   │   ├── assets/
    │   │   │   ├── logo-produto.png
    │   │   │   └── logo-produto-small.png
    │   │   └── imagens/
    │   │       └── menu-principal-tela.png
    ├── operacao-doacao/
    └── preparacao-do-pdv/
```

**💡 Vantagens:**
- Cada branch tem sua própria pasta de exportação
- Permite comparar exportações entre branches
- Evita conflitos ao trocar de branch

## 📁 Arquivos Disponíveis

| Arquivo | Descrição |
|---------|-----------|
| **exportar-para-word.ps1** | Script principal de exportação com todas as funcionalidades |
| **exportar-rapido.ps1** | Menu interativo com atalhos para exportações comuns |
| **instalar-dependencias.ps1** | Instalador automático do Pandoc |
| **gerar-template-word.ps1** | Gerador de template Word customizável |
| **EXPORTACAO-WORD.md** | Documentação completa e detalhada |
| **GUIA-RAPIDO-EXPORTACAO.md** | Guia rápido de uso |

## � Melhorias Recentes (v2.1)

### 📦 O que mudou:

1. **Sanitização de Nomes de Branch**
   - Branches com nomes longos são automaticamente ajustadas para Windows
   - Limite de 50 caracteres para nomes de pasta
   - Caracteres inválidos convertidos para underscores

2. **Apenas Arquivos Markdown**
   - ✅ Exporta: Requisitos `.md`
   - ❌ Não exporta: Imagens soltas e anexos
   - ✨ Resultado: Imagens embutidas nos DOCX, estrutura mais limpa

3. **Imagens Redimensionadas Automaticamente**
   - Tamanho consistente: ~40% da largura da página
   - Mantém proporções automática
   - Melhora legibilidade e aparência dos documentos

4. **HTML no Rodapé Exportado Corretamente**
   - Rodapés confidenciais agora exibem corretamente em Word
   - Logos e formatação HTML preservados

## 🎨 Personalização (Avançado)

### Criar Template Customizado

```powershell
.\.luby\word-exporter\gerar-template-word.ps1
```

Este script cria um arquivo `template-requisito.docx` que você pode editar no Microsoft Word para personalizar:
- Fontes e cores
- Estilos de títulos (Heading 1, 2, 3, etc.)
- Cabeçalhos e rodapés
- Margens e layout da página

Após personalizar o template, edite o arquivo [exportar-para-word.ps1](exportar-para-word.ps1) e adicione a linha `--reference-doc=.luby\word-exporter\template-requisito.docx` aos argumentos do Pandoc (aproximadamente linha 157).

### Ajustar Tamanho das Imagens

Se desejar alterar o tamanho das imagens, edite o arquivo `resize-images.lua`:

```lua
-- Linha 4 do arquivo resize-images.lua
local IMAGE_WIDTH = "3.4in"  -- Altere este valor (ex: "4in", "2.5in", etc)
```

Valores recomendados:
- `3.4in` = ~40% da página (padrão)
- `3in` = ~35% da página
- `4in` = ~47% da página

## 🔧 Parâmetros do Script Principal

### exportar-para-word.ps1

```powershell
.\.luby\word-exporter\exportar-para-word.ps1 [<parâmetros>]
```

| Parâmetro | Tipo | Descrição | Padrão |
|-----------|------|-----------|--------|
| `-Arquivo` | String | Caminho específico de um arquivo para exportar | Todos os arquivos |
| `-PastaDestino` | String | Nome da pasta de destino (criada na raiz) | `exportados` |
| `-LimparDestino` | Switch | Limpa a pasta de destino antes de exportar | Desativado |

### Exemplos

```powershell
# Exportar para pasta customizada
.\.luby\word-exporter\exportar-para-word.ps1 -PastaDestino "docs-entrega"

# Exportar apenas um módulo
Get-ChildItem "requisitos\operacao-doacao" -Filter *.md -Recurse | ForEach-Object {
    .\.luby\word-exporter\exportar-para-word.ps1 -Arquivo $_.FullName
}

# Criar ZIP dos exportados
Compress-Archive -Path "exportados" -DestinationPath "requisitos-pdv.zip"
```

## ✨ Funcionalidades

✅ **Conversão Markdown → Word** com preservação de formatação  
✅ **Cópia automática de imagens** (logos, diagramas, screenshots)  
✅ **Estrutura de pastas mantida** conforme organização original  
✅ **Suporte a tabelas, listas, código e links**  
✅ **Template Word customizável**  
✅ **Menu interativo** para facilitar o uso  
✅ **Instalação automática de dependências**  
✅ **Relatório de progresso detalhado**  

## 🐛 Solução de Problemas

### ❌ "Pandoc não encontrado"
Execute: `.\.luby\word-exporter\instalar-dependencias.ps1`

### ❌ "Imagens não aparecem no Word"
As imagens são copiadas automaticamente. Verifique se os caminhos relativos no Markdown estão corretos.

### ❌ "Script não executa"
Configure a política de execução do PowerShell:
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### ❌ "Erro de permissão"
Execute o PowerShell como Administrador (necessário apenas para instalação do Pandoc via Chocolatey).

## 📚 Documentação Completa

Para informações detalhadas, consulte:
- [EXPORTACAO-WORD.md](EXPORTACAO-WORD.md) - Documentação completa
- [GUIA-RAPIDO-EXPORTACAO.md](GUIA-RAPIDO-EXPORTACAO.md) - Guia de início rápido

## 🔄 Fluxo de Trabalho Recomendado

1. **Primeira vez:**
   ```powershell
   # Instalar Pandoc
   .\.luby\word-exporter\instalar-dependencias.ps1
   ```

2. **Exportação regular:**
   ```powershell
   # Usar menu interativo
   .\.luby\word-exporter\exportar-rapido.ps1
   ```

3. **Entrega de documentação:**
   ```powershell
   # Exportar tudo limpo
   .\.luby\word-exporter\exportar-para-word.ps1 -LimparDestino
   
   # Criar ZIP
   Compress-Archive -Path "exportados" -DestinationPath "requisitos-pdv-$(Get-Date -Format 'yyyy-MM-dd').zip"
   ```

## 📝 Notas

- Os arquivos são exportados para a pasta `exportados/` na **raiz do projeto**
- A pasta `exportados/` está incluída no `.gitignore`
- Templates temporários também são ignorados pelo Git
- Execute sempre os scripts a partir da **raiz do projeto**

## 🤝 Contribuindo

Para melhorias ou correções:
1. Documente as alterações
2. Teste com diferentes requisitos
3. Atualize esta documentação

---

<div align="center">
  <sub><strong>🔒 Ferramenta Interna</strong> • Cadastro Membros</sub>
</div>
