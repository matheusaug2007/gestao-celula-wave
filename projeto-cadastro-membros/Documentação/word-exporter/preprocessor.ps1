<#
.SYNOPSIS
    Pré-processador de Markdown para melhorar formatação na exportação Word

.DESCRIPTION
    Este script processa o markdown antes da exportação para Pandoc,
    garantindo que:
    1. Listas de bullets sejam mantidas com quebras de linha
    2. Cenários BDD (Dado que, E, Quando, Então) mantenham quebras de linha
    3. Bullets sob "Então" sejam preservados como lista

#>

param(
    [Parameter(Mandatory=$true)]
    [string]$MarkdownContent
)

# Função para preprocessar conteúdo markdown
function Preprocess-Markdown {
    param([string]$content)
    
    # 1. Fixar padrão de Cenários BDD
    # Adiciona quebra de linha dupla (força nova linha em docx) antes de "Dado que", "Quando", "Então"
    # Mas preserva os "E" como continuação
    
    # Primeiro, identifica os blocos de cenários (começam com **Dado que**)
    # E assegura que cada linha de "Dado que", "E", "Quando", "Então" tenha quebra dupla
    
    $lines = $content -split "`n"
    $result = @()
    $inScenario = $false
    $lastLineWas = ""
    
    foreach ($line in $lines) {
        $trimmed = $line.Trim()
        
        # Detectar início de cenário BDD
        if ($trimmed -match '^\*\*Dado que\*\*') {
            # Se linha anterior não é vazia, adiciona quebra dupla
            if ($result.Count -gt 0 -and $result[-1].TrimEnd() -ne "") {
                $result += ""
            }
            $result += $line
            $inScenario = $true
            $lastLineWas = "dado"
        }
        # Linhas de "E" no contexto BDD (seguem "Dado que" ou "E")
        elseif ($inScenario -and $trimmed -match '^\*\*E\*\*(?!\s*$)' -and $lastLineWas -in @("dado", "e")) {
            # Garantir linha vazia antes do "E" para que Pandoc trate como parágrafo separado
            if ($result.Count -gt 0 -and $result[-1].TrimEnd() -ne "") {
                $result += ""
            }
            $result += $line
            $lastLineWas = "e"
        }
        # "Quando" - quebra nova seção
        elseif ($inScenario -and $trimmed -match '^\*\*Quando\*\*') {
            if ($result.Count -gt 0 -and $result[-1].TrimEnd() -ne "") {
                $result += ""
            }
            $result += $line
            $lastLineWas = "quando"
        }
        # "Então" - quebra nova seção
        elseif ($inScenario -and $trimmed -match '^\*\*Então\*\*') {
            if ($result.Count -gt 0 -and $result[-1].TrimEnd() -ne "") {
                $result += ""
            }
            $result += $line
            $lastLineWas = "entao"
            $inScenario = $false
        }
        # Bullets dentro de "Então" mantêm indentação
        elseif ($trimmed -match '^\s*-\s' -and $lastLineWas -eq "entao") {
            $result += $line
        }
        else {
            $result += $line
            if ($trimmed -eq "") {
                $lastLineWas = ""
            }
        }
    }
    
    $finalContent = $result -join "`n"
    
    # 2. Garantir que listas bullets em seções como "Mapeamento Técnico" 
    # tenham quebras de linha adequadas (são mais robustos ao Pandoc)
    # Este padrão já deve estar correto no markdown, então apenas validamos
    
    return $finalContent
}

# Executar preprocessamento
$processedContent = Preprocess-Markdown -content $MarkdownContent
return $processedContent
