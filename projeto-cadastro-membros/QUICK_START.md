# 🚀 Quick Start - Frontend WAVE

## ⚡ Iniciar em 3 passos

### 1️⃣ Abra a pasta frontend

```bash
cd frontend
```

### 2️⃣ Inicie um servidor local

**Opção A: Python 3**
```bash
python -m http.server 8000
```

**Opção B: Node.js**
```bash
npx http-server
```

**Opção C: PHP**
```bash
php -S localhost:8000
```

**Opção D: VS Code Live Server**
- Clique direito em `index.html` → "Open with Live Server"

### 3️⃣ Abra no navegador

```
http://localhost:8000
```

---

## 🔗 Próximas URLs

| Página | URL |
|--------|-----|
| 🏠 Landing | `http://localhost:8000/` |
| 🔐 Login | `http://localhost:8000/login.html` |
| 📊 Dashboard | `http://localhost:8000/dashboard.html` |
| 👥 Membros | `http://localhost:8000/membros.html` |
| ➕ Novo Membro | `http://localhost:8000/cadastro-membro.html` |
| 🔄 Células | `http://localhost:8000/celulas.html` |
| 📤 Importar CSV | `http://localhost:8000/importacao.html` |

---

## 👤 Login Demo

```
Email: admin@onda.com
Senha: TroqueEssaSenha123!
```

---

## ⚙️ Configurar API

Se sua API está em outro endereço, edite `js/utils.js`:

```javascript
const CONFIG = {
  API_URL: 'http://localhost:5180/api',  // ← Mude aqui
  TOKEN_KEY: 'cadastro_membros_token',
  USER_KEY: 'cadastro_membros_user',
  TIMEOUT: 10000
};
```

---

## 📁 Estrutura

```
frontend/
├── index.html          # Landing page
├── login.html          # Autenticação
├── dashboard.html      # Dashboard
├── membros.html        # Listagem membros
├── cadastro-membro.html # Novo membro
├── celulas.html        # Células
├── importacao.html     # CSV import
├── css/
│   └── styles.css      # Design system + componentes
├── js/
│   └── utils.js        # API + validação + utilitários
├── README.md           # Documentação completa
└── QUICK_START.md      # Este arquivo
```

---

## 🎨 Cores Principais

- 🔵 **Primária**: `#0066cc` (Azul)
- ⬛ **Escuro**: `#1a1a1a` (Preto)
- ⚪ **Claro**: `#ffffff` (Branco)

---

## ✨ Características

✅ Sem dependências externas  
✅ 100% responsivo  
✅ Animações suaves  
✅ JWT authentication  
✅ Validação real-time  
✅ Drag & drop para CSV  

---

## 🔍 Verificar API

Teste se a API está respondendo:

```bash
curl http://localhost:5180/health
curl http://localhost:5180/swagger/index.html
```

Se receber erro de conexão, verifique:
1. Backend está rodando? `dotnet run --project src/CadastroMembros.Api/...`
2. Port está correta? (padrão 5180)
3. URL em `utils.js` bate com backend?

---

## 📱 Testar Responsividade

No navegador:
1. Abra DevTools (F12)
2. Clique em "Toggle device toolbar" (Ctrl+Shift+M)
3. Escolha dispositivo (Mobile, Tablet)

---

## 💾 Browser Storage

Frontend usa localStorage para:
- Token JWT (`cadastro_membros_token`)
- Dados do usuário (`cadastro_membros_user`)
- Data expiração (`token_expires_at`)

Limpar dados (DevTools → Application → Storage → Local Storage):
```javascript
localStorage.clear()
```

---

## 🐛 Debug

Abra Console do navegador (F12 → Console):

```javascript
// Ver token
console.log(localStorage.getItem('cadastro_membros_token'))

// Ver usuário
console.log(JSON.parse(localStorage.getItem('cadastro_membros_user')))

// Testar API
await ApiClient.get('/members')
```

---

## ✅ Checklist Inicial

- [ ] Backend rodando em `http://localhost:5180`
- [ ] Frontend servidor iniciado em `http://localhost:8000`
- [ ] Consegue fazer login com `admin@onda.com`
- [ ] Dashboard carrega com estatísticas
- [ ] Lista de membros funciona
- [ ] Pode criar novo membro

---

## 📞 Problemas?

### CORS bloqueado
→ Configure CORS no backend (Program.cs)

### 404 Not Found  
→ Verifique URL da API em `js/utils.js`

### 401 Unauthorized
→ Faça login novamente

### Página branca
→ Abra Console (F12) e veja erros

---

**Pronto para usar! 🎉**

Para documentação completa, veja `README.md`
