# 🚀 GUIA RÁPIDO - Exportação para Word

> **📍 Localização:** Execute os comandos a partir da **raiz do projeto**

## Início Rápido (3 passos)

### 1️⃣ Instalar Pandoc

```powershell
.\.luby\word-exporter\instalar-dependencias.ps1
```

O script irá detectar e instalar o Pandoc automaticamente.

### 2️⃣ Exportar

```powershell
# Menu interativo (recomendado)
.\.luby\word-exporter\exportar-rapido.ps1

# OU exportar diretamente
.\.luby\word-exporter\exportar-para-word.ps1
```

Exporta todos os requisitos para a pasta `exportados/`

### 3️⃣ Pronto!

Os arquivos `.docx` estarão em `exportados/{branch}/` (na raiz do projeto) mantendo a estrutura de pastas original.

**Exemplo:** Se você está na branch `main`, os arquivos estarão em `exportados/main/`

---

## Menu de Atalhos

```powershell
.\.luby\word-exporter\exportar-rapido.ps1
```

Exibe um menu interativo com opções:
- Exportar todos os requisitos
- Exportar apenas um módulo específico
- Criar arquivo ZIP
- E mais...

---

## Comandos Úteis

### Exportar arquivo específico
```powershell
.\.luby\word-exporter\exportar-para-word.ps1 -Arquivo "requisitos\operacao-doacao\tela-inicial\exibir-tela-inicial-pdv.md"
```

### Limpar e exportar tudo
```powershell
.\.luby\word-exporter\exportar-para-word.ps1 -LimparDestino
```

### Exportar para pasta customizada
```powershell
.\.luby\word-exporter\exportar-para-word.ps1 -PastaDestino "minha-pasta"
```

### Criar ZIP dos exportados
```powershell
# ZIP da branch atual
.\.luby\word-exporter\exportar-rapido.ps1
# Escolha opção 6

# OU manualmente:
$branch = git rev-parse --abbrev-ref HEAD
Compress-Archive -Path "exportados\$branch" -DestinationPath "requisitos-$branch-$(Get-Date -Format 'yyyy-MM-dd').zip"
```

---

## Personalização

### Gerar template Word customizado
```powershell
.\.luby\word-exporter\gerar-template-word.ps1
```

Isso cria um arquivo `template-requisito.docx` na pasta `.luby/word-exporter/` que você pode editar no Word para customizar:
- Fontes e cores
- Estilos de títulos
- Cabeçalhos e rodapés
- Margens e layout

---

## Estrutura de Arquivos

```
📁 cadastro-membros/
├── 📁 .luby/
│   └── 📁 word-exporter/              # 🔧 Ferramentas de exportação
│       ├── 📄 exportar-para-word.ps1  # Script principal
│       ├── 📄 exportar-rapido.ps1     # Menu de atalhos
│       ├── 📄 instalar-dependencias.ps1
│       ├── 📄 gerar-template-word.ps1
│       ├── 📄 README.md               # Documentação
│       ├── 📄 EXPORTACAO-WORD.md
│       └── 📄 GUIA-RAPIDO-EXPORTACAO.md
├── 📁 requisitos/                     # Requisitos em Markdown
└── 📁 exportados/                     # Arquivos .docx (gerado)
    ├── 📂 main/                       # Branch 'main'
    ├── 📂 develop/                    # Branch 'develop'
    └── 📂 feature-xyz/                # Outras branches
```

---

## Problemas Comuns

### ❌ "Pandoc não encontrado"
**Solução:** Execute `.\.luby\word-exporter\instalar-dependencias.ps1`

### ❌ "Imagens não aparecem"
**Solução:** As imagens são copiadas automaticamente. Verifique se os caminhos no Markdown estão corretos.

### ❌ "Erro de permissão"
**Solução:** Execute o PowerShell como Administrador

### ❌ "Script não executa"
**Solução:** Configure a política de execução:
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## Ajuda Completa

Para documentação detalhada, consulte:
- [EXPORTACAO-WORD.md](EXPORTACAO-WORD.md) - Guia completo
- [README.md](README.md) - Documentação da ferramenta
- [../../README.md](../../README.md) - Visão geral do projeto

---

## Suporte

Em caso de problemas:
1. Verifique se o Pandoc está instalado: `pandoc --version`
2. Consulte a documentação completa
3. Entre em contato com a equipe de desenvolvimento

---

**Desenvolvido por:** Cadastro Membros  
**Projeto:** Cadastro Membros - Documentação de Requisitos
