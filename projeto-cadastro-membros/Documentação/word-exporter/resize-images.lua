-- Filtro Lua para Pandoc: Redimensionar imagens e melhorar HTML
-- Ajusta imagens para aproximadamente 35-40% da largura da página
-- Também melhora o processamento de elementos HTML

-- Configurações
local IMAGE_WIDTH = "3.8in"  -- Aproximadamente 60% de uma página A4
local IMAGE_HEIGHT = "auto"  -- Manter proporção
local HEADER_LOGO_WIDTH = "1.7in"  -- Metade do tamanho padrão

-- Configuracao de tabela para historico de alteracoes
-- Tamanho total da tabela (largura util da pagina)
local TABLE_WIDTH_CM = 16.5

-- Tamanhos das colunas em cm (devem somar TABLE_WIDTH_CM)
local DATE_COL_CM = 2.9
local JIRA_COL_CM = 2.9
local AUTHOR_COL_CM = 4.4
local DESC_COL_CM = 6.3  -- Ajustado para somar 16.5 cm

local function col_width(value)
  if pandoc.ColWidth then
    return pandoc.ColWidth(value)
  end
  return value
end

local function normalize_header(text)
  local lower = string.lower(text or "")
  local no_punct = string.gsub(lower, "[^%w%s]", "")
  local compact = string.gsub(no_punct, "%s+", " ")
  return string.gsub(compact, "^%s*(.-)%s*$", "%1")
end

local function is_history_table(elem)
  if not elem.head or not elem.head.rows or #elem.head.rows == 0 then
    return false
  end

  local row = elem.head.rows[1]
  if not row.cells or #row.cells < 4 then
    return false
  end

  local headers = {}
  for i, cell in ipairs(row.cells) do
    headers[i] = normalize_header(pandoc.utils.stringify(cell))
  end

  return string.find(headers[1], "data", 1, true)
    and string.find(headers[2], "card jira", 1, true)
    and string.find(headers[3], "autor", 1, true)
    and string.find(headers[4], "descr", 1, true)
end

local function apply_history_table_widths(elem)
  -- Calcular fracoes baseadas no tamanho total da tabela (16.5 cm)
  -- Como as colunas somam 16.5cm, cada fracao representa sua proporcao do total
  local date_frac = DATE_COL_CM / TABLE_WIDTH_CM
  local jira_frac = JIRA_COL_CM / TABLE_WIDTH_CM
  local author_frac = AUTHOR_COL_CM / TABLE_WIDTH_CM
  local desc_frac = DESC_COL_CM / TABLE_WIDTH_CM

  local current_colspec = elem.colspecs or {}
  if #current_colspec == 0 then
    current_colspec = {
      {pandoc.AlignDefault, nil},
      {pandoc.AlignDefault, nil},
      {pandoc.AlignDefault, nil},
      {pandoc.AlignDefault, nil}
    }
  end

  local new_colspec = {}
  for i, col in ipairs(current_colspec) do
    local align = col[1]
    if i == 1 then
      new_colspec[i] = {align, col_width(date_frac)}
    elseif i == 2 then
      new_colspec[i] = {align, col_width(jira_frac)}
    elseif i == 3 then
      new_colspec[i] = {align, col_width(author_frac)}
    elseif i == 4 then
      new_colspec[i] = {align, col_width(desc_frac)}
    else
      new_colspec[i] = col
    end
  end

  elem.colspecs = new_colspec
  
  -- Adicionar atributo de largura customizado
  if elem.attr then
    elem.attr.attributes = elem.attr.attributes or {}
    elem.attr.attributes["custom-width"] = tostring(TABLE_WIDTH_CM) .. "cm"
  end
  
  -- Retornar tabela com RawBlock OpenXML para forcar largura
  -- 16.5 cm = 9354 twips (1 cm = 567 twips)
  local width_twips = math.floor(TABLE_WIDTH_CM * 567)
  local openxml = string.format('<w:tblPr><w:tblW w:w="%d" w:type="dxa"/></w:tblPr>', width_twips)
  
  -- Injetar propriedade no elemento (não funciona diretamente, mas vamos tentar)
  return {
    pandoc.RawBlock("openxml", openxml),
    elem
  }
end

-- Função para processar imagens
function Image(elem)
  -- Adicionar atributos de largura à imagem
  if elem.attributes == nil then
    elem.attributes = {}
  end
  
  -- Definir largura da imagem
  if elem.src ~= nil and string.find(elem.src, "logo-universal", 1, true) then
    elem.attributes.width = HEADER_LOGO_WIDTH
  else
    elem.attributes.width = IMAGE_WIDTH
  end

  -- Remover legenda/caption da imagem
  if elem.caption ~= nil then
    elem.caption = {}
  end

  -- Limpar title para evitar legenda/tooltip no Word
  elem.title = ""
  
  -- Se for figura com caption, envolver em div customizada
  return elem
end

-- Inserir quebra de pagina antes de Titulo 1
function Header(elem)
  if elem.level == 1 then
    local pagebreak = pandoc.RawBlock("openxml", "<w:p><w:r><w:br w:type=\"page\"/></w:r></w:p>")
    return {pagebreak, elem}
  end
  return elem
end

-- Remover legendas geradas por figura implicita (imagem sozinha no paragrafo)
function Figure(elem)
  if elem.caption ~= nil then
    elem.caption = {}
  end
  return elem
end

-- Função para processar elementos RawInline (HTML inline)
function RawInline(elem)
  if elem.format == "html" then
    -- Convert raw HTML into native inlines so DOCX keeps images/links
    local doc = pandoc.read(elem.text, "html")
    return doc.blocks[1] and doc.blocks[1].content or nil
  end
  return nil
end

-- Função para processar elementos RawBlock (HTML em bloco)
function RawBlock(elem)
  if elem.format == "html" then
    -- Convert raw HTML into native blocks so DOCX keeps images/links
    return pandoc.read(elem.text, "html").blocks
  end
  return nil
end

-- Função para processar imagens dentro de parágrafos
function Para(elem)
  local new_content = {}
  
  for i, item in ipairs(elem.content) do
    if item.t == "Image" then
      -- Aplicar redimensionamento
      Image(item)
    end
    table.insert(new_content, item)
  end
  
  elem.content = new_content
  return elem
end

function Table(elem)
  if is_history_table(elem) then
    return apply_history_table_widths(elem)
  end
  return elem
end

return {
  {Image = Image},
  {Figure = Figure},
  {Header = Header},
  {RawInline = RawInline},
  {RawBlock = RawBlock},
  {Para = Para},
  {Table = Table}
}
