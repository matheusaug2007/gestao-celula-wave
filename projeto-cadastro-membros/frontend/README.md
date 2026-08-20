# 🌊 WAVE - Frontend

Interface moderna e responsiva para o sistema de Cadastro de Membros. Desenvolvida com **HTML5**, **CSS3** e **JavaScript Vanilla** (sem dependências externas).

---

## 📋 Índice

- [Características](#características)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Como Usar](#como-usar)
- [Configuração da API](#configuração-da-api)
- [Páginas e Funcionalidades](#páginas-e-funcionalidades)
- [Design System](#design-system)
- [Autenticação](#autenticação)
- [Troubleshooting](#troubleshooting)

---

## ✨ Características

✅ **Responsivo** - Funciona em desktop, tablet e mobile  
✅ **Moderno** - Design clean com paleta azul/preto/branco  
✅ **Animações Suaves** - Transições e efeitos visuais elegantes  
✅ **Sem Dependências** - Apenas HTML, CSS e JavaScript puro  
✅ **JWT Authentication** - Token-based com localStorage  
✅ **Validação de Formulários** - Validação real-time e feedback visual  
✅ **Drag & Drop** - Para upload de arquivos CSV  
✅ **Componentes Reutilizáveis** - Carregamento, notificações, paginação  

---

## 📁 Estrutura de Pastas

```
frontend/
├── index.html                 # Página de entrada/landing
├── login.html                 # Tela de autenticação
├── dashboard.html             # Dashboard com estatísticas
├── membros.html              # Listagem de membros
├── cadastro-membro.html      # Criar novo membro
├── celulas.html              # Listagem de células
├── importacao.html           # Importar membros via CSV
├── css/
│   └── styles.css            # CSS global + design system
└── js/
    └── utils.js              # Funções compartilhadas (API, validação, etc)
```

---

## 🚀 Como Usar

### 1. **Servir Localmente**

```bash
# Com Python 3
python -m http.server 8000

# Com Node.js
npx http-server

# Com PHP
php -S localhost:8000

# Com Live Server (VS Code)
# Clique direito no index.html > "Open with Live Server"
```

Acesse: `http://localhost:8000`

### 2. **Configurar API**

Edite o arquivo `js/utils.js` e atualize a URL da API:

```javascript
const CONFIG = {
  API_URL: 'http://seu-servidor:5180/api',  // ← Altere aqui
  TOKEN_KEY: 'cadastro_membros_token',
  USER_KEY: 'cadastro_membros_user',
  TIMEOUT: 10000
};
```

### 3. **Fazer Login**

- Email: `admin@onda.com`
- Senha: `TroqueEssaSenha123!`

---

## ⚙️ Configuração da API

### Variáveis de Ambiente

Criar arquivo `.env.local` (opcional, para sobrescrever CONFIG):

```javascript
API_URL = http://localhost:5180/api
```

### CORS

Certifique-se que a API permite requisições do frontend:

```csharp
// No arquivo Program.cs do backend
var policy = "Frontend";
builder.Services.AddCors(options =>
{
    options.AddPolicy(policy, builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});
```

---

## 📄 Páginas e Funcionalidades

### 🏠 **index.html** - Landing Page

- Página inicial com apresentação
- Links para login ou mais informações
- Redireciona automaticamente se autenticado
- Design marcante com animações de blob

### 🔐 **login.html** - Autenticação

- Form com email e senha
- Validação de email em tempo real
- Armazena token JWT em localStorage
- Demo info com credenciais
- Animações ao enviar

**Dados Demo:**
- Email: `admin@onda.com`
- Senha: `TroqueEssaSenha123!`

### 📊 **dashboard.html** - Painel Principal

- Cards com estatísticas (total membros, células, aniversariantes)
- Menu rápido para ações principais
- Timeline com atividades recentes
- Atualização automática a cada 30s

### 👥 **membros.html** - Listagem de Membros

- Tabela responsiva com todos os membros
- Filtros dinâmicos por nome/email/status
- Paginação com navegação
- Ações: Visualizar, Editar, Inativar/Reativar
- Suporta soft-delete

### ➕ **cadastro-membro.html** - Criar Membro

- Formulário em 3 seções: Dados Pessoais, Vínculo, Endereço
- Validação de todos os campos
- Seletores dinâmicos para Líder e Célula
- Feedback visual de erros
- Botão de cancelamento

### 🔄 **celulas.html** - Listagem de Células

- Cards visuais com informações de cada célula
- Exibe líder, localização e quantidade de membros
- Dia e hora de reunião
- Responsivo em grid

### 📤 **importacao.html** - Importação CSV

- **Drag & Drop** para upload
- Validação de formato CSV
- Preview com primeiras 10 linhas
- Indicador de erros
- Guia de formato das colunas
- Exemplo de CSV pronto para copiar

---

## 🎨 Design System

### Cores Principais

```css
--cor-primaria: #0066cc;          /* Azul principal */
--cor-primaria-dark: #0052a3;     /* Azul escuro */
--cor-primaria-light: #e6f0ff;    /* Azul claro */

--cor-fundo: #ffffff;              /* Branco */
--cor-fundo-alt: #f8f9fa;         /* Cinza bem claro */
--cor-fundo-dark: #1a1a1a;        /* Preto */

--cor-sucesso: #10b981;           /* Verde */
--cor-aviso: #f59e0b;             /* Amarelo */
--cor-erro: #ef4444;              /* Vermelho */
```

### Tipografia

```css
--fonte-principal: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--fonte-tamanho-base: 16px;
--fonte-tamanho-sm: 14px;
--fonte-tamanho-lg: 18px;
--fonte-tamanho-xl: 24px;
```

### Espaçamento

```css
--espaco-xs: 4px;
--espaco-sm: 8px;
--espaco-md: 16px;
--espaco-lg: 24px;
--espaco-xl: 32px;
--espaco-2xl: 48px;
```

---

## 🔐 Autenticação

### Flow JWT

1. Usuário faz login com email/senha
2. Backend valida e retorna token JWT
3. Frontend armazena token em `localStorage`
4. Token é enviado em todas as requisições no header `Authorization: Bearer <token>`
5. Se token expirado (401), usuário é redirecionado para login

### Token Manager

```javascript
TokenManager.salvarToken(token, expiresInMinutes);
TokenManager.obterToken();
TokenManager.removerToken();
TokenManager.estaExpirado();
TokenManager.temToken();
```

### Proteção de Rotas

```javascript
// No início de cada página protegida
if (!protegerRota()) {
  throw new Error('Não autenticado');
}
```

---

## 🔗 API Endpoints Utilizados

### Autenticação
- `POST /auth/login` - Fazer login
- `GET /auth/me` - Dados do usuário atual

### Membros
- `GET /members?page=1&pageSize=10&search=...&onlyActive=true` - Listar membros
- `GET /members/{id}` - Obter um membro
- `POST /members` - Criar membro
- `PATCH /members/{id}/inactivate` - Inativar membro
- `PATCH /members/{id}/reactivate` - Reativar membro
- `POST /members/import-csv` - Importar via CSV

### Células
- `GET /cells?page=1&pageSize=10` - Listar células
- `GET /cells/{id}` - Obter célula
- `POST /cells` - Criar célula
- `PATCH /cells/{id}` - Atualizar célula

### Usuários (Líderes)
- `GET /users?page=1&pageSize=100` - Listar usuários/líderes
- `GET /users/{id}` - Obter usuário

---

## 🛠️ Utilitários JavaScript

### API Client

```javascript
// Fazer requisições com autenticação automática
ApiClient.get('/endpoint')
ApiClient.post('/endpoint', dados)
ApiClient.patch('/endpoint', dados)
ApiClient.delete('/endpoint')
```

### Validação

```javascript
Validador.email('email@test.com')
Validador.telefone('11999999999')
Validador.dataNascimento('2000-01-01')
Validador.obrigatorio(valor)
Validador.minimo(valor, 3)
Validador.maximo(valor, 50)
```

### Formatação

```javascript
Formatador.data('2026-05-12')
Formatador.dataBR('2026-05-12')
Formatador.dataHora('2026-05-12T10:30:00')
Formatador.telefone('11999999999')
Formatador.email('test@example.com')
Formatador.moeda(1000)
```

### Notificações

```javascript
Notificacao.sucesso('Operação realizada com sucesso!')
Notificacao.erro('Algo deu errado')
Notificacao.aviso('Atenção!')
Notificacao.info('Informação útil')
```

### Manipulação DOM

```javascript
DOM.obter('.seletor')
DOM.obterTodos('.seletor')
DOM.criar('div', { className: 'test' }, 'conteúdo')
DOM.mostrar(elemento)
DOM.ocultar(elemento)
DOM.toggle(elemento)
DOM.limpar(elemento)
DOM.habilitarBotao(btn)
DOM.desabilitarBotao(btn)
```

---

## 📋 Formato CSV para Importação

Arquivo deve ter estas colunas (nome exato):

```
FullName,BirthDate,Email,Phone,AddressStreet,AddressNeighborhood,AddressCity,LeaderName,CellName
João Silva,1990-05-15,joao@email.com,(11) 99999-9999,Rua A,Centro,São Paulo,Maria Santos,Célula Centro
Maria Oliveira,1985-08-20,,,(11) 88888-8888,,Zona Norte,São Paulo,Pedro Costa,Célula Norte
```

**Regras:**
- `FullName` - Obrigatório, mínimo 3 caracteres
- `BirthDate` - Obrigatório, formato YYYY-MM-DD
- `Email` - Opcional, deve ser válido se preenchido
- `Phone` - Opcional, 10-11 dígitos
- `LeaderName` - Obrigatório, nome do líder (será procurado na BD)
- `CellName` - Obrigatório, nome da célula (será procurada na BD)
- Endereço - Opcional, cada campo máx 180, 120, 120 caracteres

---

## 🐛 Troubleshooting

### ❌ "CORS error"

**Problema:** Requisições bloqueadas por CORS  
**Solução:** Configure CORS no backend (Program.cs)

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});
```

### ❌ "404 Not Found"

**Problema:** Página ou API não encontrada  
**Solução:** Verifique se a URL da API está correta em `utils.js`

### ❌ "401 Unauthorized"

**Problema:** Token expirado ou inválido  
**Solução:** Faça login novamente

### ❌ "Arquivo CSV não carrega preview"

**Problema:** Validação falhando  
**Solução:** Verifique se o arquivo tem cabeçalho e se o separador é vírgula

### ⚠️ Performance lenta

**Solução:**
- Reduz o tamanho das colunas da tabela
- Aumenta o intervalo de atualização (padrão 30s)
- Usa paginação menor (ex: 10 itens ao invés de 100)

---

## 📱 Responsividade

O frontend é totalmente responsivo:

- **Desktop** (1200px+) - 3+ colunas, tabelas completas
- **Tablet** (768px-1199px) - 2 colunas, tabelas ajustadas
- **Mobile** (<768px) - 1 coluna, layouts empilhados

---

## 🔄 Atualização e Manutenção

### Adicionar Nova Página

1. Criar `novo.html` com template padrão
2. Importar `css/styles.css` e `js/utils.js`
3. Adicionar proteção de rota: `if (!protegerRota()) throw new Error(...)`
4. Usar classes de design system disponíveis

### Modificar Design System

1. Editar cores em `css/styles.css` `:root`
2. Mudar valores de CSS variables
3. Afeta todo frontend automaticamente

---

## 📞 Suporte

Para problemas ou dúvidas:
1. Verifique console do navegador (F12)
2. Valide dados no Swagger: `http://localhost:5180/swagger`
3. Verifique logs do backend

---

**Versão:** 1.0  
**Última Atualização:** Maio 2026  
**Desenvolvido com:** HTML5, CSS3, JavaScript ES6+
