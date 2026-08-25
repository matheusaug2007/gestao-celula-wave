/* ============================================
   WAVE CÉLULAS — Controller Principal & Router SPA
   (V1: Foco Exclusivo em Administrador com Gestor de Tema Dark/Light)
   ============================================ */

window.WaveTheme = {
  init() {
    const saved = localStorage.getItem('wave_theme') || 'dark';
    this.setTheme(saved);
  },

  getTheme() {
    return document.documentElement.getAttribute('data-theme') || 'dark';
  },

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('wave_theme', theme);
    this.updateToggles();
  },

  toggle() {
    const current = this.getTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  },

  updateToggles() {
    const current = this.getTheme();
    const isDark = current === 'dark';
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.innerHTML = `<i data-lucide="${isDark ? 'sun' : 'moon'}" style="width:16px;height:16px;"></i>`;
      btn.title = isDark ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro';
    });
    if (window.lucide) lucide.createIcons();
  }
};

// Inicialização imediata de tema para evitar flashes
WaveTheme.init();

window.WaveApp = {
  _currentPage: 'login',
  _pageParam: null,
  _history: [],

  init() {
    WaveTheme.init();

    const hash = window.location.hash.slice(1);
    if (hash) {
      const parts = hash.split('/');
      this._currentPage = parts[0] || 'login';
      this._pageParam = parts[1] || null;
    } else {
      this._currentPage = WaveAuth.isAuthenticated() ? 'admin' : 'login';
    }

    if (!WaveAuth.isAuthenticated() && this._currentPage !== 'login') {
      this._currentPage = 'login';
      window.location.hash = 'login';
    }

    this.renderCurrentPage();
    this.updateNav();

    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.slice(1);
      const parts = hash.split('/');
      this._currentPage = parts[0] || 'login';
      this._pageParam = parts[1] || null;

      if (!WaveAuth.isAuthenticated() && this._currentPage !== 'login') {
        this._currentPage = 'login';
        window.location.hash = 'login';
      }

      this.renderCurrentPage();
      this.updateNav();
    });

    // Fechar menu do usuário ao clicar fora
    document.addEventListener('click', (e) => {
      const container = document.querySelector('.admin-user-menu-container');
      if (container && !container.contains(e.target)) {
        this.closeUserMenu();
      }
    });
  },

  navigate(page, param = null) {
    this._history.push({ page: this._currentPage, param: this._pageParam });
    this._currentPage = page;
    this._pageParam = param;

    const hash = param ? `${page}/${param}` : page;
    if (window.location.hash === `#${hash}`) {
      this.renderCurrentPage();
      this.updateNav();
    } else {
      window.location.hash = hash;
    }
  },

  goBack() {
    if (this._history.length > 0) {
      const prev = this._history.pop();
      this._currentPage = prev.page;
      this._pageParam = prev.param;
      const hash = prev.param ? `${prev.page}/${prev.param}` : prev.page;
      window.location.hash = hash;
    } else {
      this.navigate('admin');
    }
  },

  renderCurrentPage() {
    const container = document.getElementById('page-content');
    if (!container) return;

    let html = '';
    const page = WavePages[this._currentPage];

    if (page) {
      html = page.render(this._pageParam);
    } else {
      html = `
        <div class="card empty-state" style="padding:var(--space-4xl);">
          <i data-lucide="alert-circle" style="width:48px;height:48px;color:var(--text-tertiary);"></i>
          <h3 style="margin-top:var(--space-md);color:var(--text-primary);">Página não encontrada</h3>
          <p style="color:var(--text-secondary);margin-top:var(--space-xs);margin-bottom:var(--space-lg);">A rota informada não existe ou foi descontinuada na v1.</p>
          <button class="btn btn-primary" onclick="WaveApp.navigate('admin')">Voltar ao Painel</button>
        </div>
      `;
    }

    container.innerHTML = html;

    if (window.lucide) {
      lucide.createIcons();
    }

    container.scrollTop = 0;
    window.scrollTo(0, 0);

    if (page && page.onMount) {
      page.onMount();
    }

    this.updateNav();
  },

  updateNav() {
    const isLogin = this._currentPage === 'login';
    const isWelcome = this._currentPage === 'boas-vindas';
    const isCleanLayout = isLogin || isWelcome;
    const adminNav = document.getElementById('admin-nav');
    const adminTopNavbar = document.getElementById('admin-top-navbar');
    const mobileHeader = document.getElementById('mobile-header');

    const appEl = document.querySelector('.app');
    if (appEl) {
      appEl.classList.toggle('is-login', isLogin);
      appEl.classList.toggle('is-welcome', isWelcome);
      appEl.classList.toggle('admin-mode', !isCleanLayout);
    }

    if (isCleanLayout) {
      if (adminNav) adminNav.style.display = 'none';
      if (adminTopNavbar) adminTopNavbar.style.display = 'none';
      if (mobileHeader) mobileHeader.style.display = 'none';
      return;
    }

    // Exibição responsiva de navegação para Admin
    const isPerfil = this._currentPage === 'perfil-usuario';
    if (adminTopNavbar) adminTopNavbar.style.display = window.innerWidth > 768 ? 'block' : 'none';
    if (adminNav) adminNav.style.display = window.innerWidth <= 768 ? 'flex' : 'none';
    if (mobileHeader) mobileHeader.style.display = (window.innerWidth <= 768 && !isPerfil) ? 'flex' : 'none';

    // Atualiza dados do usuário logado no cabeçalho
    const user = WaveAuth.getUser() || WaveData.currentUser;
    if (user) {
      const headerName = document.getElementById('header-user-name');
      const headerRole = document.getElementById('header-user-role');
      const dropName = document.getElementById('dropdown-user-name');
      const dropEmail = document.getElementById('dropdown-user-email');
      const headerImg = document.getElementById('header-avatar-img');
      const mobileHeaderImg = document.getElementById('mobile-header-avatar-img');

      if (headerName) headerName.textContent = user.nome ? user.nome.split(' ')[0] : 'Administrador';
      if (headerRole) headerRole.textContent = 'ADMIN';
      if (dropName) dropName.textContent = user.nome || 'Administrador Wave';
      if (dropEmail) dropEmail.textContent = user.email || '';
      const defaultAvatar = (window.WaveAuth && window.WaveAuth.DEFAULT_AVATAR) ? window.WaveAuth.DEFAULT_AVATAR : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%2327272a' rx='40'/%3E%3Ccircle cx='40' cy='31' r='13' fill='%23a1a1aa'/%3E%3Cpath d='M19 67c0-11.6 9.4-21 21-21s21 9.4 21 21z' fill='%23a1a1aa'/%3E%3C/svg%3E";
      const fotoSrc = (user && user.foto) ? user.foto : defaultAvatar;
      if (headerImg) headerImg.src = fotoSrc;
      if (mobileHeaderImg) mobileHeaderImg.src = fotoSrc;
    }

    if (window.WaveTheme) {
      WaveTheme.updateToggles();
    }

    document.querySelectorAll('#admin-nav .nav-item').forEach(item => {
      const page = item.getAttribute('data-page');
      item.classList.toggle('active', page === this._currentPage);
    });

    document.querySelectorAll('.admin-nav-link').forEach(item => {
      const page = item.getAttribute('data-page');
      item.classList.toggle('active', page === this._currentPage);
    });
  },

  toggleUserMenu(e) {
    if (e) e.stopPropagation();
    const dropdown = document.getElementById('admin-user-dropdown');
    const pill = document.getElementById('admin-user-pill');
    const user = WaveAuth.getUser() || (window.WaveData && window.WaveData.currentUser);
    if (user) {
      const dropName = document.getElementById('dropdown-user-name');
      const dropEmail = document.getElementById('dropdown-user-email');
      if (dropName) dropName.textContent = user.nome || 'Administrador Wave';
      if (dropEmail) dropEmail.textContent = user.email || '';
    }
    if (dropdown) dropdown.classList.toggle('open');
    if (pill) pill.classList.toggle('open');
  },

  closeUserMenu() {
    const dropdown = document.getElementById('admin-user-dropdown');
    const pill = document.getElementById('admin-user-pill');
    if (dropdown) dropdown.classList.remove('open');
    if (pill) pill.classList.remove('open');
  },

  showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-notification ${type === 'danger' ? 'danger' : ''}`;
    toast.innerHTML = `
      <i data-lucide="${type === 'danger' ? 'alert-circle' : 'check-circle'}" style="width:18px;height:18px;color:${type === 'danger' ? 'var(--danger)' : 'var(--success)'};"></i>
      <span>${this.escapeHTML(message)}</span>
    `;

    container.appendChild(toast);
    if (window.lucide) lucide.createIcons();

    setTimeout(() => {
      toast.style.transition = 'all 0.3s var(--ease-out)';
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  // BUG-07: Sanitização estrita contra XSS
  escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  },

  // BUG-07: Neutralização de CSV Formula Injection (RFC 4180 + Segurança OWASP)
  sanitizeCSVCell(val) {
    if (val === null || val === undefined) return '""';
    let str = String(val).trim();
    // Neutraliza fórmulas perigosas (=, +, -, @, \t, \r)
    if (/^[=+\-@\t\r]/.test(str)) {
      str = "'" + str;
    }
    return `"${str.replace(/"/g, '""')}"`;
  },

  dialog({
    title = 'Atenção',
    message = '',
    type = 'warning', // 'warning', 'danger', 'info', 'success'
    confirmText = 'OK',
    cancelText = null, // se fornecido, exibe botão de cancelar e retorna booleano
    danger = false
  } = {}) {
    return new Promise((resolve) => {
      // Remove qualquer dialog anterior se existir
      const existing = document.getElementById('wave-global-dialog');
      if (existing) existing.remove();

      let iconName = 'alert-triangle';
      if (type === 'danger') iconName = 'alert-circle';
      else if (type === 'success') iconName = 'check-circle';
      else if (type === 'info') iconName = 'info';

      const isDangerAction = danger || type === 'danger';

      const overlay = document.createElement('div');
      overlay.id = 'wave-global-dialog';
      overlay.className = 'wave-dialog-overlay';
      overlay.innerHTML = `
        <div class="wave-dialog-card animate-in" onclick="event.stopPropagation()">
          <div class="wave-dialog-icon ${type}">
            <i data-lucide="${iconName}" style="width:26px;height:26px;"></i>
          </div>
          <div class="wave-dialog-body">
            <h3 class="wave-dialog-title">${title}</h3>
            <p class="wave-dialog-message">${message}</p>
          </div>
          <div class="wave-dialog-actions ${cancelText ? 'dual' : 'single'}">
            ${cancelText ? `
              <button type="button" class="btn btn-secondary wave-dialog-btn" id="wave-dialog-cancel-btn">
                ${cancelText}
              </button>
            ` : ''}
            <button type="button" class="btn ${isDangerAction ? 'wave-dialog-btn-danger' : 'btn-primary'} wave-dialog-btn" id="wave-dialog-confirm-btn">
              ${confirmText}
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);
      if (window.lucide) lucide.createIcons();

      // Forçar reflow para ativar transição CSS
      requestAnimationFrame(() => {
        overlay.classList.add('open');
      });

      const close = (result) => {
        overlay.classList.remove('open');
        document.removeEventListener('keydown', handleKey);
        setTimeout(() => {
          overlay.remove();
          resolve(result);
        }, 220);
      };

      const handleKey = (e) => {
        if (e.key === 'Escape') {
          close(cancelText ? false : true);
        } else if (e.key === 'Enter') {
          close(true);
        }
      };

      document.addEventListener('keydown', handleKey);

      overlay.addEventListener('click', () => {
        close(cancelText ? false : true);
      });

      const confirmBtn = overlay.querySelector('#wave-dialog-confirm-btn');
      if (confirmBtn) {
        confirmBtn.addEventListener('click', () => close(true));
        confirmBtn.focus();
      }

      const cancelBtn = overlay.querySelector('#wave-dialog-cancel-btn');
      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => close(false));
      }
    });
  },

  alert(message, title = 'Atenção', type = 'warning') {
    return this.dialog({
      title,
      message,
      type,
      confirmText: 'Entendi'
    });
  },

  confirm(message, title = 'Confirmação', { confirmText = 'Confirmar', cancelText = 'Cancelar', type = 'warning', danger = false } = {}) {
    return this.dialog({
      title,
      message,
      type,
      confirmText,
      cancelText,
      danger: danger || type === 'danger'
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  WaveApp.init();
  window.addEventListener('resize', () => WaveApp.updateNav());
});
