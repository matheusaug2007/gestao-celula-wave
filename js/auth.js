/* ============================================
   WAVE CÉLULAS — Autenticação & Persistência de Sessão
   (Validação Estrita de Senha no Banco Supabase e Sincronização em Tempo Real)
   ============================================ */

window.WaveAuth = {
  DEFAULT_AVATAR: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%2327272a' rx='40'/%3E%3Ccircle cx='40' cy='31' r='13' fill='%23a1a1aa'/%3E%3Cpath d='M19 67c0-11.6 9.4-21 21-21s21 9.4 21 21z' fill='%23a1a1aa'/%3E%3C/svg%3E",
  _sessionUser: null,

  init() {
    this._restoreSession();
  },

  _restoreSession() {
    try {
      // 1. Tenta recuperar do sessionStorage (sessão atual da aba)
      const sessionData = sessionStorage.getItem('wave_auth_session');
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        if (parsed && parsed.user) {
          this._sessionUser = parsed.user;
          this._updateDataState();
          return;
        }
      }

      // 2. Tenta recuperar do localStorage ("Lembrar de mim" - 7 dias)
      const persistentData = localStorage.getItem('wave_auth_session');
      if (persistentData) {
        const parsed = JSON.parse(persistentData);
        if (parsed && parsed.user) {
          const now = Date.now();
          if (parsed.expiresAt && now > parsed.expiresAt) {
            // Sessão expirada
            localStorage.removeItem('wave_auth_session');
            this._sessionUser = null;
          } else {
            this._sessionUser = parsed.user;
            this._updateDataState();
          }
        }
      }
    } catch (e) {
      console.warn('Erro ao restaurar sessão persistida:', e);
      this._sessionUser = null;
    }
  },

  getUser() {
    return this._sessionUser;
  },

  isAuthenticated() {
    return !!this._sessionUser;
  },

  async login(email, senha, lembrarDeMim = false) {
    const cleanEmail = email.trim().toLowerCase();

    // Validação Estrita e Dinâmica via Banco Supabase
    try {
      if (window.supabaseInitPromise) {
        await window.supabaseInitPromise;
      }
      if (window.supabaseClient) {
        const queryPromise = supabaseClient
          .from('usuarios')
          .select('*')
          .eq('email', cleanEmail)
          .eq('ativo', true)
          .single();

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Tempo de resposta excedido ao conectar ao banco de dados.')), 5000)
        );

        const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

        if (data && !error) {
          // Usuário existe no banco -> Validação da senha gravada no Supabase
          if (data.senha_hash === senha) {
            this._sessionUser = {
              id: data.id,
              nome: data.nome || 'Administrador',
              email: data.email,
              role: data.role || 'ADMIN',
              pessoaId: data.pessoa_id,
              whatsapp: data.whatsapp || data.telefone || '',
              telefone: data.telefone || data.whatsapp || '',
              foto: data.foto_url || null
            };
            this._saveSession(lembrarDeMim);
            this._updateDataState();
            if (window.WaveData && window.WaveData.syncSupabase) {
              window.WaveData.syncSupabase();
            }
            return { ok: true, user: this._sessionUser };
          } else {
            return { ok: false, message: 'E-mail ou senha incorretos.' };
          }
        } else {
          return { ok: false, message: 'Usuário não encontrado ou acesso inativo.' };
        }
      } else {
        return { ok: false, message: 'Conexão com o banco de dados indisponível.' };
      }
    } catch (err) {
      console.error('Falha na autenticação via Supabase:', err);
      return { ok: false, message: 'Erro ao conectar ao banco de dados. Verifique sua conexão e tente novamente.' };
    }
  },

  _saveSession(lembrarDeMim) {
    if (!this._sessionUser) return;

    const payload = {
      user: this._sessionUser
    };

    sessionStorage.setItem('wave_auth_session', JSON.stringify(payload));

    if (lembrarDeMim) {
      const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
      localStorage.setItem('wave_auth_session', JSON.stringify({
        ...payload,
        expiresAt
      }));
    } else {
      localStorage.removeItem('wave_auth_session');
    }
  },

  _updateDataState() {
    if (this._sessionUser && window.WaveData) {
      WaveData.currentUser.nome = this._sessionUser.nome;
      WaveData.currentUser.role = this._sessionUser.role || 'ADMIN';
      WaveData.currentUser.email = this._sessionUser.email;
      WaveData.currentUser.whatsapp = this._sessionUser.whatsapp || this._sessionUser.telefone || '';
      WaveData.currentUser.foto = this._sessionUser.foto || null;
    }

    const nameEl = document.getElementById('header-user-name');
    const roleEl = document.getElementById('header-user-role');
    const dropNameEl = document.getElementById('dropdown-user-name');
    const dropEmailEl = document.getElementById('dropdown-user-email');
    const headerDesktop = document.getElementById('header-avatar-img');
    const headerMobile = document.getElementById('mobile-header-avatar-img');

    if (this._sessionUser) {
      if (nameEl) nameEl.textContent = this._sessionUser.nome ? this._sessionUser.nome.split(' ')[0] : 'Admin';
      if (roleEl) roleEl.textContent = this._sessionUser.role || 'ADMIN';
      if (dropNameEl) dropNameEl.textContent = this._sessionUser.nome || 'Administrador';
      if (dropEmailEl) dropEmailEl.textContent = this._sessionUser.email || '';
    }

    const foto = (this._sessionUser && this._sessionUser.foto) ? this._sessionUser.foto : this.DEFAULT_AVATAR;
    if (headerDesktop) headerDesktop.src = foto;
    if (headerMobile) headerMobile.src = foto;
  },

  updateUserSession(partialData) {
    if (!this._sessionUser) return;
    this._sessionUser = { ...this._sessionUser, ...partialData };
    
    // Atualiza storage
    const sessionRaw = sessionStorage.getItem('wave_auth_session');
    if (sessionRaw) {
      try {
        const parsed = JSON.parse(sessionRaw);
        parsed.user = this._sessionUser;
        sessionStorage.setItem('wave_auth_session', JSON.stringify(parsed));
      } catch (e) {}
    }
    const localRaw = localStorage.getItem('wave_auth_session');
    if (localRaw) {
      try {
        const parsed = JSON.parse(localRaw);
        parsed.user = this._sessionUser;
        localStorage.setItem('wave_auth_session', JSON.stringify(parsed));
      } catch (e) {}
    }

    this._updateDataState();
  },

  killSessionIfCurrentUser(userId, userEmail) {
    if (this._sessionUser) {
      if (this._sessionUser.id === userId || (userEmail && this._sessionUser.email.toLowerCase() === userEmail.toLowerCase())) {
        this.logout();
        if (window.WaveApp && window.WaveApp.showToast) {
          WaveApp.showToast('Sua sessão foi encerrada porque o acesso foi bloqueado.', 'danger');
        }
      }
    }
  },

  logout() {
    this._sessionUser = null;
    sessionStorage.removeItem('wave_auth_session');
    localStorage.removeItem('wave_auth_session');
    if (window.WaveData && window.WaveData.currentUser) {
      WaveData.currentUser.foto = null;
      WaveData.currentUser.nome = 'Administrador';
      WaveData.currentUser.email = '';
      WaveData.currentUser.whatsapp = '';
    }
    const headerDesktop = document.getElementById('header-avatar-img');
    const headerMobile = document.getElementById('mobile-header-avatar-img');
    if (headerDesktop) headerDesktop.src = this.DEFAULT_AVATAR;
    if (headerMobile) headerMobile.src = this.DEFAULT_AVATAR;
    WaveApp.navigate('login');
  }
};

WaveAuth.init();
