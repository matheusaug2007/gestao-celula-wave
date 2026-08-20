/* ============================================
   WAVE CÉLULAS — Tela de Login & Autenticação
   (Com suporte a "Lembrar de mim" por 7 dias e Olho de Senha Dinâmico)
   ============================================ */

window.WavePages = window.WavePages || {};

WavePages.login = {

  _errorMessage: '',
  _showPassword: false,

  render() {
    return `
      <div class="login-container animate-in">
        
        <!-- Header / Logo Oficial da Wave -->
        <div class="login-brand">
          <img src="imagens/Logo-Wave-Vertical.png" alt="Comunidade Wave" style="height:110px;width:auto;object-fit:contain;margin-bottom:var(--space-sm);filter:drop-shadow(0 0 24px rgba(255,255,255,0.18));">
          <p class="login-subtitle">Sistema de Gestão de Células & Membros</p>
        </div>

        <!-- Card de Formulário -->
        <div class="card login-card">
          <h2 style="font-size:1.15rem;font-weight:700;margin-bottom:var(--space-md);text-align:center;">Entrar na Conta</h2>

          <div id="login-error-container">
            ${this._errorMessage ? `
              <div class="alert-card danger" style="margin-bottom:var(--space-md);padding:var(--space-md);">
                <div class="alert-reason" style="color:var(--danger);display:flex;align-items:center;gap:6px;">
                  <i data-lucide="alert-circle" style="width:16px;height:16px;"></i>
                  ${this._errorMessage}
                </div>
              </div>
            ` : ''}
          </div>

          <form id="login-form" onsubmit="WavePages.login.handleSubmit(event)">
            <div style="display:flex;flex-direction:column;gap:var(--space-lg);">
              
              <div class="input-group">
                <label class="input-label">E-mail *</label>
                <input class="input-field" type="email" id="login-email" name="email" value="" placeholder="seuemail@wave.com" required autocomplete="username">
              </div>

              <div class="input-group">
                <label class="input-label">Senha *</label>
                <div style="position:relative;display:flex;align-items:center;">
                  <input class="input-field" type="password" id="login-senha" name="senha" value="" placeholder="••••••••" required autocomplete="current-password" style="padding-right:42px;width:100%;">
                  <button type="button" id="btn-toggle-senha" onclick="WavePages.login.togglePasswordVisibility()" style="position:absolute;right:10px;background:none;border:none;color:var(--text-tertiary);cursor:pointer;padding:6px;display:flex;align-items:center;justify-content:center;z-index:2;">
                    <i data-lucide="eye" style="width:18px;height:18px;"></i>
                  </button>
                </div>
              </div>

              <!-- Checkbox Lembrar de Mim (Sessão de 7 dias) -->
              <div style="display:flex;align-items:center;gap:8px;cursor:pointer;" onclick="document.getElementById('login-lembrar').click()">
                <input type="checkbox" id="login-lembrar" name="lembrar" checked style="width:16px;height:16px;accent-color:var(--white);cursor:pointer;" onclick="event.stopPropagation()">
                <label for="login-lembrar" style="font-size:0.8rem;color:var(--text-secondary);cursor:pointer;user-select:none;">Lembrar de mim (manter conectado por 7 dias)</label>
              </div>

              <button type="submit" id="btn-login-submit" class="btn btn-primary-lg" style="margin-top:var(--space-xs);cursor:pointer;">
                <i data-lucide="log-in" style="width:18px;height:18px;"></i> Entrar no Sistema
              </button>
            </div>
          </form>
        </div>

      </div>
    `;
  },

  togglePasswordVisibility() {
    this._showPassword = !this._showPassword;
    const input = document.getElementById('login-senha');
    const iconBtn = document.getElementById('btn-toggle-senha');
    
    if (input) {
      input.type = this._showPassword ? 'text' : 'password';
    }
    if (iconBtn) {
      iconBtn.innerHTML = `<i data-lucide="${this._showPassword ? 'eye-off' : 'eye'}" style="width:18px;height:18px;"></i>`;
      if (window.lucide) lucide.createIcons();
    }
  },

  async handleSubmit(e) {
    if (e) e.preventDefault();

    const emailInput = document.getElementById('login-email');
    const senhaInput = document.getElementById('login-senha');
    const lembrarInput = document.getElementById('login-lembrar');
    const btnSubmit = document.getElementById('btn-login-submit');
    const errorContainer = document.getElementById('login-error-container');

    const email = emailInput ? emailInput.value : '';
    const senha = senhaInput ? senhaInput.value : '';
    const lembrar = lembrarInput ? lembrarInput.checked : false;

    if (!email || !senha) {
      this._errorMessage = 'Por favor, preencha o e-mail e a senha.';
      if (errorContainer) {
        errorContainer.innerHTML = `
          <div class="alert-card danger" style="margin-bottom:var(--space-md);padding:var(--space-md);">
            <div class="alert-reason" style="color:var(--danger);display:flex;align-items:center;gap:6px;">
              <i data-lucide="alert-circle" style="width:16px;height:16px;"></i>
              ${this._errorMessage}
            </div>
          </div>
        `;
        if (window.lucide) lucide.createIcons();
      }
      return;
    }

    if (btnSubmit) {
      btnSubmit.disabled = true;
      btnSubmit.innerHTML = `<i data-lucide="loader-2" class="spin" style="width:18px;height:18px;"></i> Entrando...`;
      if (window.lucide) lucide.createIcons();
    }

    try {
      const result = await WaveAuth.login(email, senha, lembrar);

      if (result.ok) {
        this._errorMessage = '';
        WaveApp.navigate('boas-vindas');
        WaveApp.renderCurrentPage();
      } else {
        this._errorMessage = result.message || 'Falha ao autenticar.';
        if (btnSubmit) {
          btnSubmit.disabled = false;
          btnSubmit.innerHTML = `<i data-lucide="log-in" style="width:18px;height:18px;"></i> Entrar no Sistema`;
        }
        if (errorContainer) {
          errorContainer.innerHTML = `
            <div class="alert-card danger" style="margin-bottom:var(--space-md);padding:var(--space-md);">
              <div class="alert-reason" style="color:var(--danger);display:flex;align-items:center;gap:6px;">
                <i data-lucide="alert-circle" style="width:16px;height:16px;"></i>
                ${this._errorMessage}
              </div>
            </div>
          `;
        }
        if (window.lucide) lucide.createIcons();
      }
    } catch (err) {
      console.error('Erro durante login:', err);
      if (btnSubmit) {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = `<i data-lucide="log-in" style="width:18px;height:18px;"></i> Entrar no Sistema`;
      }
      if (errorContainer) {
        errorContainer.innerHTML = `
          <div class="alert-card danger" style="margin-bottom:var(--space-md);padding:var(--space-md);">
            <div class="alert-reason" style="color:var(--danger);display:flex;align-items:center;gap:6px;">
              <i data-lucide="alert-circle" style="width:16px;height:16px;"></i>
              Erro inesperado ao conectar. Tente novamente.
            </div>
          </div>
        `;
      }
      if (window.lucide) lucide.createIcons();
    }
  }
};
