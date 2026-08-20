<#
.SYNOPSIS
    Scripts de atalho para exportações comuns

.DESCRIPTION
    Este arquivo contém exemplos de comandos para exportações específicas.
    Copie e cole os comandos no PowerShell ou execute este arquivo diretamente.

#>

# Cores para mensagens
function Write-Success { Write-Host "✓ $args" -ForegroundColor Green }
function Write-Info { Write-Host "ℹ $args" -ForegroundColor Cyan }
function Write-MenuOption { 
    param($numero, $descricao)
    Write-Host "  [$numero] " -NoNewline -ForegroundColor Yellow
    Write-Host $descricao -ForegroundColor White
}

# Configurar caminhos (script está em .luby/word-exporter/)
$raizProjeto = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$scriptExportar = Join-Path $PSScriptRoot "exportar-para-word.ps1"
$pastaRequisitos = Join-Path $raizProjeto "requisitos"
$pastaExportados = Join-Path $raizProjeto "exportados"

Write-Host "`n════════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host "   EXPORTADOR WORD - ATALHOS RÁPIDOS" -ForegroundColor Magenta
Write-Host "════════════════════════════════════════════════════════`n" -ForegroundColor Magenta

Write-Host "Escolha uma opção de exportação:`n" -ForegroundColor Cyan

Write-MenuOption "1" "Exportar TODOS os requisitos"
Write-MenuOption "2" "Exportar apenas: Preparação do PDV"
Write-MenuOption "3" "Exportar apenas: Operação de Doação"
Write-MenuOption "4" "Exportar apenas: Funcionalidades de Apoio"
Write-MenuOption "5" "Limpar pasta exportados/ e exportar tudo"
Write-MenuOption "6" "Criar arquivo ZIP dos exportados"
Write-MenuOption "7" "Mostrar comandos personalizados"
Write-MenuOption "0" "Sair"

Write-Host ""
$opcao = Read-Host "Digite o número da opção"

switch ($opcao) {
    "1" {
        Write-Info "`nExportando todos os requisitos..."
        & $scriptExportar
    }
    
    "2" {
        Write-Info "`nExportando requisitos de Preparação do PDV..."
        $modulo = Join-Path $pastaRequisitos "preparacao-do-pdv"
        Get-ChildItem $modulo -Filter *.md -Recurse | ForEach-Object {
            & $scriptExportar -Arquivo $_.FullName
        }
        Write-Success "`nExportação concluída!"
    }
    
    "3" {
        Write-Info "`nExportando requisitos de Operação de Doação..."
        $modulo = Join-Path $pastaRequisitos "operacao-doacao"
        Get-ChildItem $modulo -Filter *.md -Recurse | ForEach-Object {
            & $scriptExportar -Arquivo $_.FullName
        }
        Write-Success "`nExportação concluída!"
    }
    
    "4" {
        Write-Info "`nExportando requisitos de Funcionalidades de Apoio..."
        $modulo = Join-Path $pastaRequisitos "funcionalidades-de-apoio"
        Get-ChildItem $modulo -Filter *.md -Recurse | ForEach-Object {
            & $scriptExportar -Arquivo $_.FullName
        }
        Write-Success "`nExportação concluída!"
    }
    
    "5" {
        Write-Info "`nLimpando pasta exportados/ e exportando tudo..."
        & $scriptExportar -LimparDestino
    }
    
    "6" {
        # Detectar branch atual
        Push-Location $raizProjeto
        $branchAtual = git rev-parse --abbrev-ref HEAD 2>$null
        if ($LASTEXITCODE -ne 0 -or -not $branchAtual) {
            $branchAtual = "exportacao"
        }
        Pop-Location
        
        $pastaExportadosBranch = Join-Path $pastaExportados $branchAtual
        
        if (Test-Path $pastaExportadosBranch) {
            Write-Info "`nCriando arquivo ZIP da branch '$branchAtual'..."
            $dataAtual = Get-Date -Format "yyyy-MM-dd"
            $nomeZip = Join-Path $raizProjeto "requisitos-$branchAtual-$dataAtual.zip"
            
            if (Test-Path $nomeZip) {
                Remove-Item $nomeZip -Force
            }
            
            Compress-Archive -Path (Join-Path $pastaExportadosBranch "*") -DestinationPath $nomeZip
            Write-Success "Arquivo criado: requisitos-$branchAtual-$dataAtual.zip"
            
            $tamanho = (Get-Item $nomeZip).Length / 1MB
            Write-Host "Tamanho: $([math]::Round($tamanho, 2)) MB`n" -ForegroundColor Gray
        }
        else {
            Write-Warning "`nPasta exportados/$branchAtual/ não encontrada."
            Write-Host "Execute a exportação primeiro.`n"
        }
    }
    
    "7" {
        Write-Host "`n════════════════════════════════════════════════════════" -ForegroundColor Cyan
        Write-Host "   COMANDOS PERSONALIZADOS" -ForegroundColor Cyan
        Write-Host "════════════════════════════════════════════════════════`n" -ForegroundColor Cyan
        
        Write-Host "Exportar arquivo específico:" -ForegroundColor Yellow
        Write-Host '  .\.luby\word-exporter\exportar-para-word.ps1 -Arquivo "requisitos\operacao-doacao\tela-inicial\exibir-tela-inicial-pdv.md"' -ForegroundColor White
        
        Write-Host "`nExportar com pasta customizada:" -ForegroundColor Yellow
        Write-Host '  .\.luby\word-exporter\exportar-para-word.ps1 -PastaDestino "meus-docs"' -ForegroundColor White
        
        Write-Host "`nExportar todos de um módulo:" -ForegroundColor Yellow
        Write-Host '  Get-ChildItem "requisitos\operacao-doacao" -Filter *.md -Recurse | ForEach-Object {' -ForegroundColor White
        Write-Host '      .\.luby\word-exporter\exportar-para-word.ps1 -Arquivo $_.FullName' -ForegroundColor White
        Write-Host '  }' -ForegroundColor White
        
        Write-Host "`nContar quantos requisitos existem:" -ForegroundColor Yellow
        Write-Host '  (Get-ChildItem "requisitos" -Filter *.md -Recurse).Count' -ForegroundColor White
        
        Write-Host "`nListar todos os requisitos:" -ForegroundColor Yellow
        Write-Host '  Get-ChildItem "requisitos" -Filter *.md -Recurse | Select-Object FullName' -ForegroundColor White
        
        Write-Host "`n"
    }
    
    "0" {
        Write-Info "`nSaindo...`n"
        exit 0
    }
    
    default {
        Write-Warning "`nOpção inválida!`n"
    }
}

Write-Host ""

