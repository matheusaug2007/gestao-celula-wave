<#
.SYNOPSIS
    Script para gerar um template Word customizado

.DESCRIPTION
    Este script cria um template básico de documento Word (.docx) que pode ser
    editado no Microsoft Word para personalizar estilos, fontes, cores e formatação.
    O template gerado pode ser usado com o parâmetro --reference-doc do Pandoc.

#>

# Cores para mensagens
function Write-Success { Write-Host "✓ $args" -ForegroundColor Green }
function Write-Info { Write-Host "ℹ $args" -ForegroundColor Cyan }
function Write-Warning { Write-Host "⚠ $args" -ForegroundColor Yellow }
function Write-Error { Write-Host "✗ $args" -ForegroundColor Red }

Write-Host "`n════════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host "   GERADOR DE TEMPLATE WORD" -ForegroundColor Magenta
Write-Host "════════════════════════════════════════════════════════`n" -ForegroundColor Magenta

# Verificar Pandoc
$pandocInstalled = Get-Command pandoc -ErrorAction SilentlyContinue
if (-not $pandocInstalled) {
    Write-Error "Pandoc não encontrado!"
    Write-Host "Execute: .\instalar-dependencias.ps1`n"
    exit 1
}

# Criar Markdown de exemplo com todos os estilos
$markdownExemplo = @"
![Logo Universal](assets/logo-universal.png)

---

[Módulo: Exemplo](../README.md) › **Nome do Requisito**

**Versão:** 1.0 | **Última atualização:** $(Get-Date -Format "dd/MM/yyyy")

---

# Título Nível 1

Este é um parágrafo de exemplo que demonstra o estilo de texto normal. O template utiliza todos os estilos comuns encontrados nos requisitos.

## Título Nível 2

Mais um exemplo de parágrafo com **texto em negrito**, *texto em itálico*, e `código inline`.

### Título Nível 3

Aqui temos uma lista não ordenada:

- Item um da lista
- Item dois da lista
  - Sub-item aninhado
  - Outro sub-item
- Item três da lista

#### Título Nível 4

E uma lista ordenada:

1. Primeiro item
2. Segundo item
3. Terceiro item

##### Título Nível 5

### Tabelas

Exemplo de tabela formatada:

| Coluna 1 | Coluna 2 | Coluna 3 |
|----------|----------|----------|
| Valor A  | Valor B  | Valor C  |
| Valor D  | Valor E  | Valor F  |
| Valor G  | Valor H  | Valor I  |

### Blocos de Código

Exemplo de bloco de código:

``````javascript
function exemplo() {
    console.log("Este é um exemplo de código");
    return true;
}
``````

### Citações

> Esta é uma citação em bloco.
> Pode ter múltiplas linhas.
> 
> E múltiplos parágrafos.

### Links e Referências

- [Link de exemplo](https://example.com)
- [Referência a outro requisito](../outro-requisito.md)

### Imagens

![Exemplo de Imagem](imagens/exemplo.png)

---

## Seções Especiais

### Mensagens e Estados

Este requisito possui as seguintes mensagens:

- **Sucesso**: Operação concluída com sucesso
- **Erro**: Falha ao processar a operação
- **Aviso**: Atenção necessária

### Critérios de Aceite

- Critério 1: O sistema deve fazer X
- Critério 2: O sistema deve validar Y
- Critério 3: O sistema deve exibir Z

### Regras e Comportamentos

1. Regra de negócio 1
2. Regra de negócio 2
3. Regra de negócio 3

---

<div align="center">
  <sub><strong>🔒 Documento Confidencial</strong> • Uso Interno</sub>
</div>
"@

# Salvar Markdown de exemplo
$pastaScript = $PSScriptRoot
$templateMd = Join-Path $pastaScript "template-exemplo.md"
$markdownExemplo | Out-File -FilePath $templateMd -Encoding UTF8

Write-Info "Arquivo Markdown de exemplo criado: template-exemplo.md"

# Gerar DOCX básico
$templateDocx = Join-Path $pastaScript "template-requisito.docx"

Write-Info "Gerando template Word básico..."

try {
    & pandoc -f markdown -t docx -s -o $templateDocx $templateMd
    
    if ($LASTEXITCODE -eq 0 -and (Test-Path $templateDocx)) {
        Write-Success "Template gerado com sucesso: template-requisito.docx"
        
        Write-Host "`n════════════════════════════════════════════════════════" -ForegroundColor Cyan
        Write-Host "   PRÓXIMOS PASSOS" -ForegroundColor Cyan
        Write-Host "════════════════════════════════════════════════════════`n" -ForegroundColor Cyan
        
        Write-Host "1. Abra o arquivo template-requisito.docx no Microsoft Word" -ForegroundColor White
        Write-Host "`n2. Customize os estilos:" -ForegroundColor White
        Write-Host "   - Título 1, Título 2, Título 3, etc." -ForegroundColor Gray
        Write-Host "   - Corpo de texto (Normal)" -ForegroundColor Gray
        Write-Host "   - Cabeçalhos e rodapés" -ForegroundColor Gray
        Write-Host "   - Cores, fontes e espaçamentos" -ForegroundColor Gray
        Write-Host "   - Margens e layout da página" -ForegroundColor Gray
        
        Write-Host "`n3. Salve o arquivo template-requisito.docx" -ForegroundColor White
        
        Write-Host "`n4. Use o template ao exportar:" -ForegroundColor White
        Write-Host "   Edite o arquivo exportar-para-word.ps1" -ForegroundColor Gray
        Write-Host "   Adicione: --reference-doc=template-requisito.docx" -ForegroundColor Gray
        Write-Host "   Na linha ~157, na variável " -NoNewline -ForegroundColor Gray
        Write-Host "`$pandocArgs" -ForegroundColor Yellow
        
        Write-Host "`n════════════════════════════════════════════════════════`n" -ForegroundColor Cyan
        
        $resposta = Read-Host "Deseja abrir o template no Word agora? (S/N)"
        if ($resposta -eq 'S' -or $resposta -eq 's') {
            Start-Process $templateDocx
        }
        
        # Limpar arquivo temporário
        Remove-Item $templateMd -Force
    }
    else {
        Write-Error "Falha ao gerar template"
    }
}
catch {
    Write-Error "Erro ao gerar template: $_"
}

Write-Host "`n"
