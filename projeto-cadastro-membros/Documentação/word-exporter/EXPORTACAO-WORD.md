# Exportador de Requisitos - Markdown → Word

Ferramentas para exportar documentos de requisitos em Markdown para o formato Word (.docx), mantendo formatação, imagens e estrutura de pastas.

> **📍 Localização:** `.luby/word-exporter/`  
> **🎯 Execução:** Sempre execute os scripts a partir da **raiz do projeto**

## 📋 Pré-requisitos

### Pandoc

O script utiliza [Pandoc](https://pandoc.org/) para converter Markdown em DOCX. Você precisa instalá-lo antes de usar o exportador.

#### Instalação Automática (Recomendado):

```powershell
.\.luby\word-exporter\instalar-dependencias.ps1
```

Este script detecta automaticamente seu gerenciador de pacotes (Chocolatey ou Scoop) e instala o Pandoc para você.

#### Opções de Instalação Manual:

**1. Via Chocolatey:**
```powershell
choco install pandoc
```

**2. Via Scoop:**
```powershell
scoop install pandoc
```

**3. Via Instalador Oficial:**
- Baixe em: https://pandoc.org/installing.html
- Execute o instalador MSI para Windows

**4. Verificar instalação:**
```powershell
pandoc --version
```

## 🚀 Como Usar

### Menu Interativo (Recomendado)

```powershell
.\.luby\word-exporter\exportar-rapido.ps1
```

Exibe um menu com opções:
- Exportar todos os requisitos
- Exportar por módulo específico
- Criar arquivo ZIP
- E mais...

### Exportar Todos os Requisitos

Execute o script na raiz do projeto:

```powershell
.\.luby\word-exporter\exportar-para-word.ps1
```

Isso irá:
- Processar todos os arquivos `.md` dentro da pasta `requisitos/`
- Criar a pasta `exportados/` (na raiz do projeto) se não existir
- Manter a estrutura de pastas original
- Copiar todas as imagens referenciadas
- Gerar arquivos `.docx` correspondentes

### Exportar um Arquivo Específico

```powershell
.\.luby\word-exporter\exportar-para-word.ps1 -Arquivo "requisitos\operacao-doacao\tela-inicial\exibir-tela-inicial-pdv.md"
```

### Limpar Pasta de Exportação Antes de Exportar

```powershell
.\.luby\word-exporter\exportar-para-word.ps1 -LimparDestino
```

### Especificar Pasta de Destino Customizada

```powershell
.\.luby\word-exporter\exportar-para-word.ps1 -PastaDestino "docs-exportados"
```

### Combinar Opções

```powershell
.\.luby\word-exporter\exportar-para-word.ps1 -PastaDestino "meus-docs" -LimparDestino
```

## 📁 Estrutura de Exportação

O script mantém a estrutura de pastas original. Arquivos são exportados para `exportados/{branch}/` **na raiz do projeto**:

```
cadastro-membros/                    ← Raiz do projeto
├── .luby/
│   └── word-exporter/            ← Scripts estão aqui
├── requisitos/                   ← Requisitos em Markdown
└── exportados/                   ← 📤 Pasta de exportações
    ├── main/                     ← Branch 'main'
    │   ├── funcionalidades-de-apoio/
    │   │   ├── menu/
    │   │   │   ├── acessar-menu-principal.docx
    │   │   │   ├── assets/
    │   │   │   │   ├── logo-produto.png
    │   │   │   │   └── logo-produto-small.png
    │   │   │   └── imagens/
    │   │   │       └── menu-principal-tela.png
    │   │   └── suporte/
    │   ├── operacao-doacao/
    │   └── preparacao-do-pdv/
    ├── develop/                  ← Branch 'develop'
    └── feature-xyz/              ← Outras branches
```

**💡 Vantagens da organização por branch:**
- Cada branch tem sua própria pasta de exportação
- Permite comparar exportações entre branches
- Evita conflitos ao trocar de branch
- Facilita auditoria de alterações entre versões

## 🎨 Personalização Avançada

### Gerar Template Word Customizado

Você pode criar um template Word (.docx) com estilos personalizados:

```powershell
.\.luby\word-exporter\gerar-template-word.ps1
```

Isso cria um arquivo `template-requisito.docx` na pasta `.luby/word-exporter/` com todos os estilos utilizados nos requisitos.

**Passos para personalizar:**

1. Execute o comando acima para gerar o template base
2. Abra `.luby/word-exporter/template-requisito.docx` no Microsoft Word
3. Customize os estilos (Título 1, Título 2, Normal, etc.)
4. Salve o arquivo
5. Edite o script `exportar-para-word.ps1` (linha ~157) e adicione:

```powershell
$pandocArgs = @(
    "-f", "markdown",
    "-t", "docx",
    "-s",
    "--reference-doc=.luby\word-exporter\template-requisito.docx",  # Adicionar esta linha
    "--resource-path=$resourcePaths",
    "-o", $destFile,
    $SourceFile
)
```

### Adicionar Índice (Table of Contents)

Para incluir um índice automático, adicione `--toc` aos argumentos:

```powershell
$pandocArgs = @(
    "-f", "markdown",
    "-t", "docx",
    "-s",
    "--toc",  # Adicionar esta linha
    "--resource-path=$resourcePaths",
    "-o", $destFile,
    $SourceFile
)
```

## 🔧 Solução de Problemas

### Erro: "Pandoc não encontrado"
- Verifique se o Pandoc está instalado: `pandoc --version`
- Reinicie o PowerShell após a instalação
- Verifique se o Pandoc está no PATH do sistema

### Imagens não aparecem no Word
- Verifique se as imagens existem nos caminhos referenciados
- Confirme que os caminhos relativos estão corretos
- O script copia automaticamente as imagens; verifique a pasta `exportados/`

### Erro de permissão
- Execute o PowerShell como Administrador
- Certifique-se de que a política de execução permite scripts:
  ```powershell
  Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```

### Formatação perdida
- Use um template Word customizado com `--reference-doc`
- Verifique se a sintaxe Markdown está correta no arquivo fonte

## 📝 Parâmetros do Script

| Parâmetro | Tipo | Obrigatório | Descrição | Padrão |
|-----------|------|-------------|-----------|--------|
| `-Arquivo` | String | Não | Caminho de um arquivo específico para exportar | Todos os arquivos |
| `-PastaDestino` | String | Não | Nome da pasta de destino | `exportados` |
| `-LimparDestino` | Switch | Não | Limpa a pasta de destino antes de exportar | Desativado |

## 📊 Funcionalidades

✅ Exporta Markdown para Word (.docx)  
✅ Mantém estrutura de pastas original  
✅ Copia todas as imagens referenciadas  
✅ Preserva formatação de tabelas, listas e código  
✅ Suporta imagens em caminhos relativos  
✅ Relatório detalhado de progresso  
✅ Validação de dependências  
✅ Opção de exportação seletiva  

## 🎯 Exemplos de Uso

### Cenário 1: Exportação completa do projeto
```powershell
# Opção A: Menu interativo
.\.luby\word-exporter\exportar-rapido.ps1
# Escolha opção 1

# Opção B: Exportação direta
.\.luby\word-exporter\exportar-para-word.ps1

# Resultado: 30+ arquivos .docx na pasta exportados/
```

### Cenário 2: Exportar apenas um módulo
```powershell
# Exportar apenas requisitos de operação de doação
.\.luby\word-exporter\exportar-rapido.ps1
# Escolha opção 3

# OU manualmente:
Get-ChildItem "requisitos\operacao-doacao" -Filter *.md -Recurse | ForEach-Object {
    .\.luby\word-exporter\exportar-para-word.ps1 -Arquivo $_.FullName
}
```

### Cenário 3: Exportação limpa para entrega
```powershell
# Limpar e exportar tudo
.\.luby\word-exporter\exportar-para-word.ps1 -LimparDestino

# Criar ZIP da branch atual para envio
$branch = git rev-parse --abbrev-ref HEAD
$data = Get-Date -Format "yyyy-MM-dd"
Compress-Archive -Path "exportados\$branch" -DestinationPath "requisitos-$branch-$data.zip"
```

### Cenário 4: Comparar exportações entre branches
```powershell
# Exportar na branch main
git checkout main
.\.luby\word-exporter\exportar-para-word.ps1

# Exportar na branch develop
git checkout develop
.\.luby\word-exporter\exportar-para-word.ps1

# Agora você tem:
# exportados/main/
# exportados/develop/
# E pode comparar os arquivos .docx entre as branches
```

## 🤝 Contribuindo

Para melhorias no script:
1. Teste suas alterações
2. Documente novos parâmetros
3. Atualize este README

## 📄 Licença

Uso interno - Cadastro Membros

---

**Desenvolvido por:** Cadastro Membros  
**Projeto:** Cadastro Membros - Documentação de Requisitos
