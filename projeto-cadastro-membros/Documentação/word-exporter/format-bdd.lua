-- Filtro Lua para Pandoc: Melhorar formatação de Cenários BDD e Listas
-- Trata especialmente:
-- 1. Linhas "Dado que", "E", "Quando", "Então" para manter quebras
-- 2. Listas de bullets em seções de Mapeamento Técnico

local function is_bdd_keyword(text)
  if not text then return false end
  local str = pandoc.utils.stringify(text)
  -- Verifica se começa com padrão BDD
  return string.match(str, "^%*%*Dado que%*%*") or
         string.match(str, "^%*%*E%*%*") or
         string.match(str, "^%*%*Quando%*%*") or
         string.match(str, "^%*%*Então%*%*")
end

local function process_blocks(blocks)
  local result = {}
  local i = 1
  
  while i <= #blocks do
    local block = blocks[i]
    
    -- Se é um parágrafo que começa com BDD keyword, converter para formato melhor
    if block.t == "Para" and block.content and #block.content > 0 then
      local first_inline = block.content[1]
      local text = pandoc.utils.stringify(block.content)
      
      if string.match(text, "^%*%*Dado que%*%*") then
        -- Manter parágrafo BDD com espaçamento apropriado
        table.insert(result, block)
        
        -- Procurar próximas linhas "E" e juntá-las com quebra adequada
        local bdd_content = {block}
        i = i + 1
        
        while i <= #blocks do
          local next_block = blocks[i]
          if next_block.t == "Para" then
            local next_text = pandoc.utils.stringify(next_block.content)
            if string.match(next_text, "^%*%*E%*%*") then
              -- Adicionar quebra antes do "E", mantendo ele em parágrafo separado
              table.insert(result, next_block)
              i = i + 1
            elseif string.match(next_text, "^%*%*Quando%*%*") then
              -- Encontrou "Quando", quebra do loop
              break
            else
              break
            end
          else
            break
          end
        end
        
        -- Não incrementar i aqui pois o loop já fez
        i = i - 1
      end
    end
    
    table.insert(result, block)
    i = i + 1
  end
  
  return result
end

function Pandoc(doc)
  -- Processar blocos do documento
  doc.blocks = process_blocks(doc.blocks)
  return doc
end
