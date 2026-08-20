<#
.SYNOPSIS
    Script auxiliar para instalar e verificar dependências do exportador

.DESCRIPTION
    Este script verifica e auxilia na instalação do Pandoc,
    necessário para exportar requisitos Markdown para Word.

#>

# Cores para mensagens
function Write-Success { Write-Host "✓ $args" -ForegroundColor Green }
function Write-Info { Write-Host "ℹ $args" -ForegroundColor Cyan }
function Write-Warning { Write-Host "⚠ $args" -ForegroundColor Yellow }
function Write-Error { Write-Host "✗ $args" -ForegroundColor Red }

Write-Host "`n════════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host "   INSTALADOR DE DEPENDÊNCIAS - EXPORTADOR WORD" -ForegroundColor Magenta
Write-Host "════════════════════════════════════════════════════════`n" -ForegroundColor Magenta

# Verificar Pandoc
Write-Info "Verificando instalação do Pandoc..."
$pandocInstalled = Get-Command pandoc -ErrorAction SilentlyContinue

if ($pandocInstalled) {
    $pandocVersion = (pandoc --version | Select-Object -First 1)
    Write-Success "Pandoc já está instalado!"
    Write-Host "  Versão: $pandocVersion`n" -ForegroundColor Gray
    
    Write-Host "Você já pode usar o exportador:" -ForegroundColor Green
    Write-Host "  .\exportar-para-word.ps1`n" -ForegroundColor White
    exit 0
}

Write-Warning "Pandoc não está instalado."
Write-Host "`nO Pandoc é necessário para converter Markdown em Word (.docx)`n"

# Detectar gerenciadores de pacotes
Write-Info "Detectando gerenciadores de pacotes disponíveis...`n"

$chocoInstalled = Get-Command choco -ErrorAction SilentlyContinue
$scoopInstalled = Get-Command scoop -ErrorAction SilentlyContinue

$opcoes = @()
$metodos = @{}

if ($chocoInstalled) {
    Write-Success "Chocolatey encontrado"
    $opcoes += "1"
    $metodos["1"] = @{
        Nome = "Chocolatey"
        Comando = "choco install pandoc -y"
        Admin = $true
    }
}

if ($scoopInstalled) {
    Write-Success "Scoop encontrado"
    $opcao = if ($chocoInstalled) { "2" } else { "1" }
    $opcoes += $opcao
    $metodos[$opcao] = @{
        Nome = "Scoop"
        Comando = "scoop install pandoc"
        Admin = $false
    }
}

$opcaoManual = if ($opcoes.Count -gt 0) { ($opcoes.Count + 1).ToString() } else { "1" }
$opcoes += $opcaoManual
$metodos[$opcaoManual] = @{
    Nome = "Download Manual"
    URL = "https://pandoc.org/installing.html"
    Manual = $true
}

$opcaoSair = ($opcoes.Count + 1).ToString()

# Mostrar opções
Write-Host "`nEscolha um método de instalação:`n" -ForegroundColor Cyan

foreach ($opcao in $opcoes) {
    $metodo = $metodos[$opcao]
    if ($metodo.Manual) {
        Write-Host "  [$opcao] $($metodo.Nome)" -ForegroundColor Yellow
    }
    else {
        Write-Host "  [$opcao] Via $($metodo.Nome)" -ForegroundColor White
        Write-Host "      Comando: $($metodo.Comando)" -ForegroundColor DarkGray
    }
}

Write-Host "  [$opcaoSair] Cancelar`n" -ForegroundColor Red

# Solicitar escolha
$escolha = Read-Host "Digite o número da opção"

if ($escolha -eq $opcaoSair -or -not $opcoes.Contains($escolha)) {
    Write-Warning "`nInstalação cancelada."
    Write-Host "Você pode instalar o Pandoc manualmente em: https://pandoc.org/installing.html`n"
    exit 0
}

$metodoEscolhido = $metodos[$escolha]

if ($metodoEscolhido.Manual) {
    Write-Info "`nAbrindo página de download do Pandoc..."
    Start-Process $metodoEscolhido.URL
    Write-Host "`nApós instalar o Pandoc:" -ForegroundColor Yellow
    Write-Host "  1. Feche e reabra o PowerShell" -ForegroundColor White
    Write-Host "  2. Execute: .\exportar-para-word.ps1`n" -ForegroundColor White
    exit 0
}

# Verificar necessidade de admin
if ($metodoEscolhido.Admin) {
    $isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
    
    if (-not $isAdmin) {
        Write-Warning "`nEste método requer privilégios de Administrador."
        Write-Host "Reiniciando PowerShell como Administrador...`n"
        
        Start-Process powershell.exe -Verb RunAs -ArgumentList "-NoExit", "-Command", $metodoEscolhido.Comando
        exit 0
    }
}

# Executar instalação
Write-Info "`nInstalando Pandoc via $($metodoEscolhido.Nome)..."
Write-Host "Comando: $($metodoEscolhido.Comando)`n" -ForegroundColor Gray

try {
    Invoke-Expression $metodoEscolhido.Comando
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "`nPandoc instalado com sucesso!"
        Write-Host "`nVerificando instalação..." -ForegroundColor Cyan
        
        # Atualizar PATH na sessão atual
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        
        $pandocCheck = Get-Command pandoc -ErrorAction SilentlyContinue
        if ($pandocCheck) {
            $pandocVersion = (pandoc --version | Select-Object -First 1)
            Write-Success "$pandocVersion"
            Write-Host "`nVocê já pode usar o exportador:" -ForegroundColor Green
            Write-Host "  .\exportar-para-word.ps1`n" -ForegroundColor White
        }
        else {
            Write-Warning "Pandoc instalado, mas não detectado no PATH."
            Write-Host "Por favor, feche e reabra o PowerShell, depois execute:" -ForegroundColor Yellow
            Write-Host "  .\exportar-para-word.ps1`n" -ForegroundColor White
        }
    }
    else {
        Write-Error "`nFalha na instalação."
        Write-Host "Tente instalar manualmente: https://pandoc.org/installing.html`n"
    }
}
catch {
    Write-Error "`nErro durante a instalação: $_"
    Write-Host "Tente instalar manualmente: https://pandoc.org/installing.html`n"
}
