<#
.SYNOPSIS
    Script para exportar requisitos Markdown para formato Word (.docx)

.DESCRIPTION
    Este script exporta todos os arquivos .md da pasta requisitos/ para o formato .docx,
    mantendo a estrutura de pastas e copiando todas as imagens referenciadas.
    
    Requer: Pandoc instalado (https://pandoc.org/installing.html)

.EXAMPLE
    .\exportar-para-word.ps1
    Exporta todos os requisitos
    
.EXAMPLE
    .\exportar-para-word.ps1 -Arquivo "requisitos/operacao-doacao/tela-inicial/exibir-tela-inicial-pdv.md"
    Exporta apenas um arquivo específico

#>

param(
    [Parameter(Mandatory=$false)]
    [string]$Arquivo = "",
    
    [Parameter(Mandatory=$false)]
    [string]$PastaDestino = "exportados",
    
    [Parameter(Mandatory=$false)]
    [switch]$LimparDestino
)

# Cores para mensagens
function Write-Success { Write-Host "[OK] $args" -ForegroundColor Green }
function Write-Info { Write-Host "[INFO] $args" -ForegroundColor Cyan }
function Write-Warning { Write-Host "[WARN] $args" -ForegroundColor Yellow }
function Write-ErrorMsg { Write-Host "[ERROR] $args" -ForegroundColor Red }

# Banner
Write-Host "`n============================================================" -ForegroundColor Magenta
Write-Host "   EXPORTADOR DE REQUISITOS - MARKDOWN -> WORD (.docx)" -ForegroundColor Magenta
Write-Host "============================================================`n" -ForegroundColor Magenta

# 1. Verificar se Pandoc está instalado
Write-Info "Verificando dependencias..."
$pandocInstalled = Get-Command pandoc -ErrorAction SilentlyContinue

if (-not $pandocInstalled) {
    Write-ErrorMsg "Pandoc nao encontrado!"
    Write-Host "`nPara instalar o Pandoc:" -ForegroundColor Yellow
    Write-Host "  1. Via Chocolatey: choco install pandoc" -ForegroundColor White
    Write-Host "  2. Via Scoop: scoop install pandoc" -ForegroundColor White
    Write-Host "  3. Via instalador: https://pandoc.org/installing.html`n" -ForegroundColor White
    exit 1
}

$pandocVersion = (pandoc --version | Select-Object -First 1)
Write-Success "Pandoc encontrado: $pandocVersion"

# 2. Configurar caminhos
# Como o script está em .luby/word-exporter/, precisamos subir 2 níveis para chegar à raiz
$raizProjeto = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$pastaRequisitos = Join-Path $raizProjeto "requisitos"
$pastaAssets = Join-Path $raizProjeto "assets"

# Verificar se a pasta requisitos existe
if (-not (Test-Path $pastaRequisitos)) {
    Write-ErrorMsg "Pasta 'requisitos' nao encontrada em: $pastaRequisitos"
    exit 1
}

# 2.1. Função para sanitizar e limitar tamanho de nomes de pasta
function Sanitize-FolderName {
    param([string]$name)
    
    # Remover caracteres inválidos em nomes de pasta Windows
    $invalid = [System.IO.Path]::GetInvalidFileNameChars()
    $sanitized = $name
    foreach ($char in $invalid) {
        $sanitized = $sanitized.Replace($char, '_')
    }
    
    # Limitar a 50 caracteres (Windows permite até 255, mas sendo conservador)
    if ($sanitized.Length -gt 50) {
        $sanitized = $sanitized.Substring(0, 50)
    }
    
    return $sanitized
}

# 2.2. Obter nome da branch atual do Git
Write-Info "Detectando branch Git..."
$branchAtual = ""
try {
    Push-Location $raizProjeto
    $gitBranch = git rev-parse --abbrev-ref HEAD 2>$null
    if ($LASTEXITCODE -eq 0 -and $gitBranch) {
        $branchAtualRaw = $gitBranch.Trim()
        $branchAtual = Sanitize-FolderName -name $branchAtualRaw
        Write-Success "Branch detectada: $branchAtualRaw"
        if ($branchAtualRaw -ne $branchAtual) {
            Write-Info "  Pasta sanitizada: $branchAtual"
        }
    }
    else {
        Write-Warning "Repositorio Git nao detectado. Usando 'exportacao' como pasta padrao."
        $branchAtual = "exportacao"
    }
    Pop-Location
}
catch {
    Write-Warning "Nao foi possivel detectar a branch Git. Usando 'exportacao' como pasta padrao."
    $branchAtual = "exportacao"
    Pop-Location
}

# 2.2. Criar estrutura: exportados/{branch}/
$pastaExportadosBase = Join-Path $raizProjeto $PastaDestino
$pastaExportados = Join-Path $pastaExportadosBase $branchAtual

# 3. Limpar pasta de destino se solicitado
if ($LimparDestino) {
    if (Test-Path $pastaExportados) {
        Write-Warning "Limpando pasta de destino: $branchAtual/"
        Remove-Item $pastaExportados -Recurse -Force
    }
}

# 4. Criar pasta de destino
if (-not (Test-Path $pastaExportados)) {
    New-Item -Path $pastaExportados -ItemType Directory -Force | Out-Null
    Write-Success "Estrutura criada: $PastaDestino/$branchAtual/"
}

# 5. Função para resolver caminhos de imagens (manter referências funcionando)
function Resolve-ImagePaths {
    param(
        [string]$MarkdownFile,
        [string]$SourceDirectory
    )
    
    # Ler conteúdo do arquivo
    $content = Get-Content $MarkdownFile -Raw -ErrorAction SilentlyContinue
    if (-not $content) {
        return $content
    }
    
    # As imagens referenciadas no markdown continuam sendo procuradas nos locais originais
    # Pandoc irá resolver os caminhos automaticamente usando --resource-path
    return $content
}


# 5.1 Função para pré-processar Markdown - Adicionar linhas em branco antes de listas
function Preprocess-MarkdownForPandoc {
    param(
        [string]$MarkdownContent
    )
    
    # Objetivo: Adicionar linha em branco entre texto e listas
    # Pandoc requer isso para reconhecer corretamente listas em Word
    
    $lines = $MarkdownContent -split "`n"
    $result = @()
    
    for ($i = 0; $i -lt $lines.Count; $i++) {
        $currentLine = $lines[$i]
        
        # Se é uma linha de bullet ou numero de lista
        if ($currentLine -match '^\s*[-*+]\s+\S' -or $currentLine -match '^\s*\d+\.\s+\S') {
            # Verificar se a linha anterior não é vazia e não é um bullet/número
            if ($result.Count -gt 0) {
                $lastLine = $result[-1]
                $lastLineTrimmed = $lastLine.Trim()
                
                # Se linha anterior não é vazia, não é um bullet e não é uma quebra de seção
                if ($lastLineTrimmed -ne "" -and 
                    -not ($lastLineTrimmed -match '^\s*[-*+]\s+') -and
                    -not ($lastLineTrimmed -match '^\s*\d+\.\s+') -and
                    -not ($lastLineTrimmed -match '^#+\s') -and
                    -not ($lastLineTrimmed -match '^---+$')) {
                    
                    # Adicionar linha em branco
                    $result += ""
                }
            }
        }
        
        $result += $currentLine
    }

    $joined = $result -join "`n"

    # Substituir os dois primeiros separadores "---" por "- - -" para evitar que o Pandoc
    # os interprete como delimitadores de bloco YAML (o conteúdo entre eles pode ter "|" etc.)
    $dashCount = 0
    $lines2 = $joined -split "`n"
    $joined = ($lines2 | ForEach-Object {
        if ($_ -match '^---\s*$' -and $dashCount -lt 2) {
            $dashCount++
            '- - -'
        } else {
            $_
        }
    }) -join "`n"

    # Garantir linha em branco antes de linhas BDD "**E**", "**Quando**", "**Então**"
    # quando precedidas de outra linha BDD ou bullet sem linha em branco entre elas
    $bddPattern = '(?m)([^\n]+)\n(\*\*(?:E|Quando|Ent.o)\*\*)'
    $bddReplacement = '$1' + [System.Environment]::NewLine + [System.Environment]::NewLine + '$2'
    $joined = [System.Text.RegularExpressions.Regex]::Replace($joined, $bddPattern, $bddReplacement)

    return $joined
}


# 6. Função para exportar um arquivo
function Export-MarkdownToWord {
    param(
        [string]$SourceFile
    )
    
    # Calcular caminho relativo ao diretório requisitos
    # Normalizar o caminho e garantir que pastaRequisitos termine com \
    $pastaRequisitosNorm = $pastaRequisitos.TrimEnd('\') + '\'
    $relativePath = $SourceFile.Replace($pastaRequisitosNorm, "").TrimStart('\', '/')
    
    # Construir caminho de destino
    $destFolder = Join-Path $pastaExportados (Split-Path $relativePath -Parent)
    $destFileName = [System.IO.Path]::GetFileNameWithoutExtension($SourceFile) + ".docx"
    $destFile = Join-Path $destFolder $destFileName
    
    # Criar estrutura de pastas
    if (-not (Test-Path $destFolder)) {
        New-Item -Path $destFolder -ItemType Directory -Force | Out-Null
    }
    
    Write-Info "Processando: $relativePath"
    
    # Pré-processar markdown para adicionar linhas em branco antes de listas
    Write-Info "  Pré-processando markdown..."
    $markdownContent = Get-Content $SourceFile -Raw -Encoding UTF8
    $processedContent = Preprocess-MarkdownForPandoc -MarkdownContent $markdownContent
    
    # Salvar conteúdo processado em arquivo temporário
    $tempFile = Join-Path $env:TEMP "pandoc-temp-$(Get-Random).md"
    Set-Content -Path $tempFile -Value $processedContent -Encoding UTF8 -Force
    
    # Converter para DOCX usando Pandoc
    try {
        # Opções do Pandoc:
        # -f markdown: formato de entrada
        # -t docx: formato de saída
        # --resource-path: diretórios para buscar imagens
        # --embed-resources: embutir recursos (imagens) no DOCX
        # -s: standalone document
        # --lua-filter: usar filtro Lua para processamento customizado
        
        $resourcePaths = @(
            (Split-Path $SourceFile -Parent),
            $pastaAssets,
            $raizProjeto
        ) -join [System.IO.Path]::PathSeparator
        
        $luaFilterPath = Join-Path $PSScriptRoot "resize-images.lua"
        
        $pandocArgs = @(
            "-f", "markdown",
            "-t", "docx",
            "-s",
            "--embed-resources",
            "--resource-path=$resourcePaths",
            "-o", $destFile,
            $tempFile
        )
        
        # Adicionar filtro Lua se existir
        if (Test-Path $luaFilterPath) {
            $pandocArgs += "--lua-filter=$luaFilterPath"
        }
        
        & pandoc $pandocArgs 2>&1 | Out-Null
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "  Exportado: $destFileName"
            # Limpar arquivo temporário
            if (Test-Path $tempFile) {
                Remove-Item $tempFile -Force -ErrorAction SilentlyContinue
            }
            return $true
        }
        else {
            Write-ErrorMsg "  Falha ao exportar: $destFileName"
            # Limpar arquivo temporário
            if (Test-Path $tempFile) {
                Remove-Item $tempFile -Force -ErrorAction SilentlyContinue
            }
            return $false
        }
    }
    catch {
        Write-ErrorMsg "  Erro ao processar: $_"
        # Limpar arquivo temporário
        if (Test-Path $tempFile) {
            Remove-Item $tempFile -Force -ErrorAction SilentlyContinue
        }
        return $false
    }
}

# 7. Processar arquivos
$arquivosParaProcessar = @()

if ($Arquivo) {
    # Processar arquivo específico
    $fullPath = Join-Path $raizProjeto $Arquivo
    if (Test-Path $fullPath) {
        $arquivosParaProcessar = @($fullPath)
    }
    else {
        Write-ErrorMsg "Arquivo nao encontrado: $fullPath"
        exit 1
    }
}
else {
    # Processar todos os arquivos .md em requisitos/
    $temp = Get-ChildItem -Path $pastaRequisitos -Filter "*.md" -Recurse -File
    # Forçar conversão para array de caminhos completos
    $arquivosParaProcessar = @($temp | ForEach-Object { $_.FullName })
}

Write-Info "`nEncontrados $($arquivosParaProcessar.Count) arquivo(s) para processar`n"

# 8. Exportar arquivos
$contador = 0
$sucesso = 0
$falhas = 0

foreach ($arquivo in $arquivosParaProcessar) {
    $contador++
    Write-Host "[$contador/$($arquivosParaProcessar.Count)] " -NoNewline -ForegroundColor Gray
    
    # Obter caminho do arquivo (já vem como string ou garantir que seja string)
    $caminhoArquivo = $arquivo.ToString()
    
    if (Export-MarkdownToWord -SourceFile $caminhoArquivo) {
        $sucesso++
    }
    else {
        $falhas++
    }
}

# 9. Relatório final
Write-Host "`n============================================================" -ForegroundColor Magenta
Write-Host "   EXPORTACAO CONCLUIDA" -ForegroundColor Magenta
Write-Host "============================================================`n" -ForegroundColor Magenta

Write-Success "Arquivos processados: $contador"
Write-Success "Exportados com sucesso: $sucesso"

if ($falhas -gt 0) {
    Write-Warning "Falhas: $falhas"
}

Write-Info "`nEstrutura de exportacao:"
Write-Host "  - $PastaDestino/" -ForegroundColor DarkGray
Write-Host "    - $branchAtual/" -ForegroundColor Yellow
Write-Host "      - $sucesso arquivo(s) .docx`n" -ForegroundColor Gray

Write-Info "Caminho completo: $pastaExportados"

# 10. Abrir pasta de destino (opcional)
$resposta = Read-Host "`nDeseja abrir a pasta de exportacao? (S/N)"
if ($resposta -eq 'S' -or $resposta -eq 's') {
    Start-Process explorer.exe $pastaExportados
}

Write-Host "`n"
