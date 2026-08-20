/* ============================================
   WAVE CÉLULAS — Liberação de Acessos & Permissões
   (Apenas Administradores no v1 + Proteção contra Auto-Bloqueio + Colunas Dinâmicas)
   ============================================ */

window.WavePages = window.WavePages || {};

WavePages['admin-usuarios'] = {

  _search: '',
  _filterStatus: 'todos',
  _showNovoModal: false,
  _showEditModal: false,
  _editingUser: null,
  _showModalPassword: false,
  _loading: false,
  _fetchedOnce: false,
  _showColunasDropdown: false,

  _availableCols: [
    { key: 'nome', label: 'Usuário', required: true },
    { key: 'email', label: 'E-mail' },
    { key: 'role', label: 'Nível de Acesso' },
    { key: 'status', label: 'Status' }
  ],
  _visibleCols: ['nome', 'email', 'role', 'status'],

  _usuariosList: [],

  getColStorageKey() {
    const user = WaveAuth.getUser();
    return 'wave_cols_usuarios_' + (user && user.email ? user.email.toLowerCase() : 'default');
  },

  initCols() {
    try {
      const saved = localStorage.getItem(this.getColStorageKey());
      if (saved) {
        this._visibleCols = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Erro ao carregar colunas salvas:', e);
    }
  },

  toggleCol(key) {
    if (key === 'nome') return;
    if (this._visibleCols.includes(key)) {
      this._visibleCols = this._visibleCols.filter(c => c !== key);
    } else {
      this._visibleCols.push(key);
    }
    localStorage.setItem(this.getColStorageKey(), JSON.stringify(this._visibleCols));
    this.renderListsLive();
  },

  isColVisible(key) {
    return this._visibleCols.includes(key);
  },

  toggleColunasDropdown(e) {
    if (e) e.stopPropagation();
    this._showColunasDropdown = !this._showColunasDropdown;
    WaveApp.renderCurrentPage();
  },

  async fetchUsuariosSupabase() {
    if (window.supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('usuarios').select('*').order('nome', { ascending: true });
        if (data && !error) {
          this._usuariosList = data.map(u => ({
            id: u.id,
            email: u.email,
            nome: u.nome || 'Usuário',
            role: 'ADMIN', // V1: apenas Administrador
            ativo: u.ativo ?? true,
            criadoEm: u.criado_em ? u.criado_em.split('T')[0] : new Date().toISOString().split('T')[0]
          }));
          this.renderListsLive();
        }
      } catch (err) {
        console.warn('Supabase fetch usuários erro:', err);
      }
    }
  },

  renderDesktopRows(usuarios) {
    if (!usuarios || usuarios.length === 0) {
      return `<tr><td colspan="5" style="text-align:center;padding:var(--space-2xl);color:var(--text-tertiary);">Nenhum usuário encontrado.</td></tr>`;
    }

    const currentLoggedIn = WaveAuth.getUser();

    return usuarios.map(u => {
      const isSelf = currentLoggedIn && (currentLoggedIn.id === u.id || (currentLoggedIn.email && currentLoggedIn.email.toLowerCase() === u.email.toLowerCase()));

      return `
        <tr>
          <td>
            <div style="display:flex;align-items:center;gap:var(--space-sm);">
              <div style="width:34px;height:34px;border-radius:var(--radius-full);background:var(--bg-elevated);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:0.8rem;flex-shrink:0;">
                ${u.nome.charAt(0)}
              </div>
              <div>
                <strong style="font-size:0.85rem;">${u.nome}</strong>
                ${isSelf ? '<span class="badge badge-white" style="font-size:0.65rem;margin-left:6px;">Você</span>' : ''}
              </div>
            </div>
          </td>
          ${this.isColVisible('email') ? `<td style="color:var(--text-secondary);font-size:0.85rem;">${u.email}</td>` : ''}
          ${this.isColVisible('role') ? `<td><span class="badge badge-white" style="font-size:0.75rem;">Administrador</span></td>` : ''}
          ${this.isColVisible('status') ? `
            <td>
              <span class="${u.ativo ? 'status-badge-ativo' : 'status-badge-inativo'}" style="font-size:0.75rem;padding:3px 8px;">
                ${u.ativo ? 'Liberado' : 'Bloqueado'}
              </span>
            </td>
          ` : ''}
          <td style="text-align:right;">
            <div style="display:inline-flex;gap:6px;">
              <button class="btn btn-ghost" onclick="WavePages['admin-usuarios'].abrirEdicao('${u.id}')" title="Editar Administrador" style="padding:6px;">
                <i data-lucide="edit-2" style="width:16px;height:16px;"></i>
              </button>
              ${!isSelf ? `
                <button class="btn btn-ghost" onclick="WavePages['admin-usuarios'].toggleStatus('${u.id}')" title="${u.ativo ? 'Bloquear Acesso' : 'Liberar Acesso'}" style="padding:6px;color:${u.ativo ? 'var(--danger)' : 'var(--success)'};">
                  <i data-lucide="${u.ativo ? 'shield-ban' : 'shield-check'}" style="width:16px;height:16px;"></i>
                </button>
              ` : `
                <span style="font-size:0.75rem;color:var(--text-tertiary);padding:6px;" title="Você não pode bloquear o seu próprio usuário administrador">
                  (Seu Acesso)
                </span>
              `}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  renderMobileList(usuarios) {
    if (!usuarios || usuarios.length === 0) {
      return `
        <div class="card empty-state" style="padding:var(--space-2xl);">
          <i data-lucide="shield-alert" style="width:40px;height:40px;color:var(--text-tertiary);"></i>
          <p style="color:var(--text-secondary);margin-top:var(--space-sm);font-size:0.85rem;">Nenhum administrador encontrado.</p>
        </div>
      `;
    }

    const currentLoggedIn = WaveAuth.getUser();

    return usuarios.map(u => {
      const isSelf = currentLoggedIn && (currentLoggedIn.id === u.id || (currentLoggedIn.email && currentLoggedIn.email.toLowerCase() === u.email.toLowerCase()));

      return `
        <div class="card" style="padding:var(--space-md);display:flex;align-items:center;justify-content:space-between;border:1px solid var(--border-subtle);gap:10px;">
          <div style="display:flex;align-items:center;gap:10px;min-width:0;flex:1;">
            <div style="width:38px;height:38px;border-radius:var(--radius-full);background:var(--bg-elevated);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:0.85rem;flex-shrink:0;">
              ${u.nome.charAt(0)}
            </div>
            <div style="min-width:0;flex:1;">
              <strong style="font-size:0.88rem;color:var(--white);display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                ${u.nome} ${isSelf ? '<span class="badge badge-white" style="font-size:0.65rem;margin-left:4px;">Você</span>' : ''}
              </strong>
              <span style="font-size:0.75rem;color:var(--text-tertiary);display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${u.email}</span>
              <div style="margin-top:4px;">
                <span class="${u.ativo ? 'status-badge-ativo' : 'status-badge-inativo'}" style="font-size:0.65rem;padding:2px 6px;">
                  ${u.ativo ? 'Liberado' : 'Bloqueado'}
                </span>
              </div>
            </div>
          </div>

          <div style="display:flex;gap:4px;flex-shrink:0;">
            <button class="btn btn-ghost" onclick="WavePages['admin-usuarios'].abrirEdicao('${u.id}')" title="Editar" style="padding:8px;">
              <i data-lucide="edit-2" style="width:16px;height:16px;"></i>
            </button>
            ${!isSelf ? `
              <button class="btn btn-ghost" onclick="WavePages['admin-usuarios'].toggleStatus('${u.id}')" title="${u.ativo ? 'Bloquear Acesso' : 'Liberar Acesso'}" style="padding:8px;color:${u.ativo ? 'var(--danger)' : 'var(--success)'};">
                <i data-lucide="${u.ativo ? 'shield-ban' : 'shield-check'}" style="width:16px;height:16px;"></i>
              </button>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  },

  updateCounters() {
    const totalAtivos = this._usuariosList.filter(u => u.ativo).length;
    const totalInativos = this._usuariosList.filter(u => !u.ativo).length;

    const elTotal = document.getElementById('stat-total-usuarios');
    const elAtivos = document.getElementById('stat-usuarios-ativos');
    const elInativos = document.getElementById('stat-usuarios-inativos');

    if (elTotal) elTotal.textContent = this._usuariosList.length;
    if (elAtivos) elAtivos.textContent = totalAtivos;
    if (elInativos) elInativos.textContent = totalInativos;
  },

  renderListsLive() {
    let usuarios = this._usuariosList;

    if (this._filterStatus !== 'todos') {
      const eAtivo = this._filterStatus === 'ATIVO';
      usuarios = usuarios.filter(u => u.ativo === eAtivo);
    }
    if (this._search) {
      const q = this._search.toLowerCase();
      usuarios = usuarios.filter(u => u.nome.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }

    const tbody = document.getElementById('usuarios-table-body');
    const mobileContainer = document.getElementById('usuarios-mobile-list');

    if (tbody) tbody.innerHTML = this.renderDesktopRows(usuarios);
    if (mobileContainer) mobileContainer.innerHTML = this.renderMobileList(usuarios);
    this.updateCounters();
    if (window.lucide) lucide.createIcons();
  },

  render() {
    this.initCols();
    let usuarios = this._usuariosList;

    if (this._filterStatus !== 'todos') {
      const eAtivo = this._filterStatus === 'ATIVO';
      usuarios = usuarios.filter(u => u.ativo === eAtivo);
    }
    if (this._search) {
      const q = this._search.toLowerCase();
      usuarios = usuarios.filter(u => u.nome.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }

    const totalAtivos = this._usuariosList.filter(u => u.ativo).length;
    const totalInativos = this._usuariosList.filter(u => !u.ativo).length;

    return `
      <!-- Header da Página -->
      <section class="page-header animate-in" style="margin-bottom:var(--space-md);position:relative;z-index:20;">
        <div>
          <h2 class="page-title">Permissões & Acessos de Administradores</h2>
        </div>

        <div style="display:flex;gap:var(--space-sm);align-items:center;">
          <!-- Botão Colunas Dinâmicas no Desktop (Ponto 19) -->
          <div class="desktop-only" style="position:relative;z-index:110;">
            <button class="btn btn-secondary" onclick="WavePages['admin-usuarios'].toggleColunasDropdown(event)" style="padding:10px 14px;font-size:0.85rem;" title="Selecionar Colunas">
              <i data-lucide="columns-3" style="width:16px;height:16px;"></i> <span>Colunas</span>
            </button>

            ${this._showColunasDropdown ? `
              <div class="card" style="position:absolute;right:0;top:46px;width:210px;z-index:9999;background:var(--bg-elevated);border:1px solid var(--border-medium);border-radius:var(--radius-md);padding:var(--space-sm);display:flex;flex-direction:column;gap:6px;box-shadow:0 12px 36px rgba(0,0,0,0.85);" onclick="event.stopPropagation();">
                <span style="font-size:0.75rem;font-weight:700;color:var(--text-secondary);padding:4px 8px;">Colunas Visíveis</span>
                ${this._availableCols.map(c => `
                  <label style="display:flex;align-items:center;gap:8px;font-size:0.82rem;padding:4px 8px;cursor:${c.required ? 'not-allowed' : 'pointer'};color:${c.required ? 'var(--text-tertiary)' : 'var(--text-primary)'};">
                    <input type="checkbox" ${this.isColVisible(c.key) ? 'checked' : ''} ${c.required ? 'disabled' : ''} onchange="WavePages['admin-usuarios'].toggleCol('${c.key}')" style="accent-color:var(--white);">
                    ${c.label} ${c.required ? '(Fixo)' : ''}
                  </label>
                `).join('')}
              </div>
            ` : ''}
          </div>

          <button class="btn btn-primary" onclick="WavePages['admin-usuarios'].toggleNovoModal()" style="padding:10px 16px;font-size:0.85rem;">
            <i data-lucide="user-plus" style="width:16px;height:16px;"></i> <span class="desktop-only">Novo Administrador</span><span class="mobile-only">+ Novo</span>
          </button>
        </div>
      </section>

      <!-- Indicadores de Acesso -->
      <div class="cards-stat-grid animate-in" style="margin-bottom:var(--space-lg);">
        <div class="card-stat-box membros">
          <div class="card-stat-box-title">Total de Administradores</div>
          <div class="card-stat-box-value" id="stat-total-usuarios">${this._usuariosList.length}</div>
        </div>
        <div class="card-stat-box celulas">
          <div class="card-stat-box-title">Acessos Liberados</div>
          <div class="card-stat-box-value" id="stat-usuarios-ativos" style="color:var(--success);">${totalAtivos}</div>
        </div>
        <div class="card-stat-box lideres">
          <div class="card-stat-box-title">Acessos Bloqueados</div>
          <div class="card-stat-box-value" id="stat-usuarios-inativos" style="color:var(--danger);">${totalInativos}</div>
        </div>
      </div>

      <!-- Barra de Busca Rápida e Filtros -->
      <div style="display:flex;gap:var(--space-sm);align-items:center;margin-bottom:var(--space-md);flex-wrap:wrap;position:relative;z-index:10;" class="animate-in">
        <div style="flex:2;min-width:220px;" class="search-bar">
          <i data-lucide="search" class="search-icon"></i>
          <input type="text" placeholder="Buscar por nome ou e-mail..." id="admin-usuarios-search" value="${this._search}">
        </div>

        <select class="input-field" style="flex:1;min-width:140px;height:44px;" onchange="WavePages['admin-usuarios'].setStatus(this.value)">
          <option value="todos" ${this._filterStatus === 'todos' ? 'selected' : ''}>Status: Todos</option>
          <option value="ATIVO" ${this._filterStatus === 'ATIVO' ? 'selected' : ''}>Liberados (Ativos)</option>
          <option value="INATIVO" ${this._filterStatus === 'INATIVO' ? 'selected' : ''}>Bloqueados (Inativos)</option>
        </select>
      </div>

      <!-- TABELA DESKTOP -->
      <div class="desktop-table-container animate-in">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Usuário</th>
              ${this.isColVisible('email') ? `<th>E-mail</th>` : ''}
              ${this.isColVisible('role') ? `<th>Nível de Acesso</th>` : ''}
              ${this.isColVisible('status') ? `<th>Status do Acesso</th>` : ''}
              <th style="text-align:right;">Ações</th>
            </tr>
          </thead>
          <tbody id="usuarios-table-body">
            ${this.renderDesktopRows(usuarios)}
          </tbody>
        </table>
      </div>

      <!-- LISTA MOBILE -->
      <div id="usuarios-mobile-list" class="mobile-only animate-in" style="display:flex;flex-direction:column;gap:6px;">
        ${this.renderMobileList(usuarios)}
      </div>

      <!-- Modal: Cadastrar Novo Administrador (Perfil único no v1) -->
      <div class="modal-overlay ${this._showNovoModal ? 'open' : ''}" onclick="WavePages['admin-usuarios'].fecharModalOutside(event)">
        <div class="modal-sheet">
          <div class="sheet-handle"></div>
          <div class="sheet-header">
            <h3 class="sheet-title">Cadastrar Novo Administrador</h3>
            <button class="sheet-close" onclick="WavePages['admin-usuarios'].toggleNovoModal()">
              <i data-lucide="x" style="width:18px;height:18px;"></i>
            </button>
          </div>

          <form onsubmit="WavePages['admin-usuarios'].salvarNovoUsuario(event)">
            <div style="display:flex;flex-direction:column;gap:var(--space-md);">
              <div class="input-group">
                <label class="input-label">Nome Completo *</label>
                <input class="input-field" type="text" name="nome" placeholder="Ex: Lucas Bomfonti" required>
              </div>

              <div class="input-group">
                <label class="input-label">E-mail de Acesso *</label>
                <input class="input-field" type="email" name="email" placeholder="admin@wave.com" required>
              </div>

              <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md);">
                <div class="input-group">
                  <label class="input-label">Perfil de Acesso</label>
                  <input class="input-field" type="text" value="Administrador" readonly style="opacity:0.8;background:var(--bg-card);cursor:not-allowed;">
                </div>

                <div class="input-group">
                  <label class="input-label">Senha Inicial *</label>
                  <div style="position:relative;display:flex;align-items:center;">
                    <input class="input-field" type="password" id="input-novo-usuario-senha" name="senha" placeholder="123456" required style="padding-right:42px;width:100%;">
                    <button type="button" id="btn-toggle-novo-usuario-senha" onclick="WavePages['admin-usuarios'].togglePasswordVisibility('input-novo-usuario-senha', 'btn-toggle-novo-usuario-senha')" style="position:absolute;right:10px;background:none;border:none;color:var(--text-tertiary);cursor:pointer;padding:4px;display:flex;align-items:center;justify-content:center;">
                      <i data-lucide="eye" style="width:18px;height:18px;"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div class="input-group">
                <label class="input-label">Status Inicial do Acesso</label>
                <select class="input-field" name="ativo">
                  <option value="true">Liberado Imediatamente</option>
                  <option value="false">Bloqueado</option>
                </select>
              </div>

              <button type="submit" class="btn btn-primary-lg" style="margin-top:var(--space-md);">
                <i data-lucide="check" style="width:18px;height:18px;"></i>
                Salvar Administrador
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal: Editar Dados do Usuário -->
      <div class="modal-overlay ${this._showEditModal ? 'open' : ''}" onclick="WavePages['admin-usuarios'].fecharModalOutside(event)">
        <div class="modal-sheet">
          <div class="sheet-handle"></div>
          <div class="sheet-header">
            <h3 class="sheet-title">Editar Administrador</h3>
            <button class="sheet-close" onclick="WavePages['admin-usuarios'].fecharEdicao()">
              <i data-lucide="x" style="width:18px;height:18px;"></i>
            </button>
          </div>

          ${this._editingUser ? `
            <form onsubmit="WavePages['admin-usuarios'].salvarEdicao(event)">
              <div style="display:flex;flex-direction:column;gap:var(--space-md);">
                <div class="input-group">
                  <label class="input-label">Nome Completo *</label>
                  <input class="input-field" type="text" name="nome" value="${this._editingUser.nome}" required>
                </div>

                <div class="input-group">
                  <label class="input-label">E-mail de Acesso *</label>
                  <input class="input-field" type="email" name="email" value="${this._editingUser.email}" required>
                </div>

                <div class="input-group">
                  <label class="input-label">Nova Senha (Opcional - deixe em branco para não alterar)</label>
                  <div style="position:relative;display:flex;align-items:center;">
                    <input class="input-field" type="password" id="input-edit-usuario-senha" name="nova_senha" placeholder="••••••••" style="padding-right:42px;width:100%;">
                    <button type="button" id="btn-toggle-edit-usuario-senha" onclick="WavePages['admin-usuarios'].togglePasswordVisibility('input-edit-usuario-senha', 'btn-toggle-edit-usuario-senha')" style="position:absolute;right:10px;background:none;border:none;color:var(--text-tertiary);cursor:pointer;padding:4px;display:flex;align-items:center;justify-content:center;">
                      <i data-lucide="eye" style="width:18px;height:18px;"></i>
                    </button>
                  </div>
                </div>

                <button type="submit" class="btn btn-primary-lg" style="margin-top:var(--space-md);">
                  <i data-lucide="check" style="width:18px;height:18px;"></i>
                  Salvar Alterações
                </button>
              </div>
            </form>
          ` : ''}
        </div>
      </div>
    `;
  },

  togglePasswordVisibility(inputId = 'input-novo-usuario-senha', btnId = 'btn-toggle-novo-usuario-senha') {
    const input = document.getElementById(inputId);
    const btn = document.getElementById(btnId);
    if (input && btn) {
      const isPass = input.type === 'password';
      input.type = isPass ? 'text' : 'password';
      btn.innerHTML = `<i data-lucide="${isPass ? 'eye-off' : 'eye'}" style="width:18px;height:18px;"></i>`;
      if (window.lucide) lucide.createIcons();
    }
  },

  onMount() {
    this.fetchUsuariosSupabase();

    const input = document.getElementById('admin-usuarios-search');
    if (input) {
      input.value = this._search;
      input.addEventListener('input', (e) => {
        this._search = e.target.value;
        this.renderListsLive();
      });
    }

    // Fechar dropdown de colunas ao clicar fora
    document.addEventListener('click', (e) => {
      if (this._showColunasDropdown) {
        this._showColunasDropdown = false;
        WaveApp.renderCurrentPage();
      }
    });
  },

  setStatus(val) { this._filterStatus = val; this.renderListsLive(); },

  toggleNovoModal() {
    this._showNovoModal = !this._showNovoModal;
    WaveApp.renderCurrentPage();
  },

  abrirEdicao(userId) {
    const u = this._usuariosList.find(item => item.id === userId);
    if (u) {
      this._editingUser = { ...u };
      this._showEditModal = true;
      WaveApp.renderCurrentPage();
    }
  },

  fecharEdicao() {
    this._showEditModal = false;
    this._editingUser = null;
    WaveApp.renderCurrentPage();
  },

  fecharModalOutside(e) {
    if (e.target.classList.contains('modal-overlay')) {
      this._showNovoModal = false;
      this._showEditModal = false;
      this._editingUser = null;
      WaveApp.renderCurrentPage();
    }
  },

  async toggleStatus(userId) {
    const u = this._usuariosList.find(item => item.id === userId);
    if (!u) return;

    // Regra Ponto 15: Proteger contra auto-bloqueio
    const currentLoggedIn = WaveAuth.getUser();
    if (currentLoggedIn && (currentLoggedIn.id === u.id || (currentLoggedIn.email && currentLoggedIn.email.toLowerCase() === u.email.toLowerCase()))) {
      await WaveApp.alert('Operação não permitida: Você não pode bloquear o seu próprio usuário administrador.', 'Ação Bloqueada', 'warning');
      return;
    }

    u.ativo = !u.ativo;
    const statusTxt = u.ativo ? 'LIBERADO' : 'BLOQUEADO';

    // Regra Ponto 15: Kill de sessão ao bloquear usuário
    if (!u.ativo) {
      WaveAuth.killSessionIfCurrentUser(u.id, u.email);
    }

    if (window.supabaseClient) {
      try {
        await supabaseClient.from('usuarios').update({ ativo: u.ativo }).eq('id', u.id);
      } catch (err) {
        console.warn('Supabase update status erro:', err);
      }
    }

    WaveApp.showToast(`Acesso de ${u.nome} alterado para ${statusTxt}`, u.ativo ? 'success' : 'danger');
    this.renderListsLive();
  },

  async salvarEdicao(e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    const novoNome = data.get('nome').trim();
    const novoEmail = data.get('email').trim().toLowerCase();
    const novaSenha = data.get('nova_senha');

    const u = this._usuariosList.find(item => item.id === this._editingUser.id);
    if (u) {
      u.nome = novoNome;
      u.email = novoEmail;

      if (window.supabaseClient) {
        try {
          const updatePayload = { nome: novoNome, email: novoEmail };
          if (novaSenha && novaSenha.trim()) {
            updatePayload.senha_hash = novaSenha.trim();
          }
          await supabaseClient.from('usuarios').update(updatePayload).eq('id', u.id);
        } catch (err) {
          console.warn('Supabase update erro:', err);
        }
      }

      this._showEditModal = false;
      this._editingUser = null;
      WaveApp.showToast(`✅ Dados de ${novoNome} atualizados com sucesso!`, 'success');
      WaveApp.renderCurrentPage();
    }
  },

  async salvarNovoUsuario(e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    const nome = data.get('nome').trim();
    const email = data.get('email').trim().toLowerCase();
    const senha = data.get('senha').trim();
    const ativo = data.get('ativo') === 'true';

    if (!nome || !email || !senha) {
      await WaveApp.alert('Por favor, preencha todos os campos obrigatórios para cadastrar o administrador.', 'Campos Obrigatórios', 'warning');
      return;
    }

    const payload = {
      id: 'u-' + Date.now(),
      nome,
      email,
      role: 'ADMIN',
      ativo,
      senha_hash: senha
    };

    if (window.supabaseClient) {
      try {
        const { data: saved, error } = await supabaseClient.from('usuarios').insert([payload]).select().single();
        if (saved && !error) {
          payload.id = saved.id;
        }
      } catch (err) {
        console.warn('Supabase insert usuário erro:', err);
      }
    }

    this._usuariosList.push({
      id: payload.id,
      email: payload.email,
      nome: payload.nome,
      role: 'ADMIN',
      ativo: payload.ativo,
      criadoEm: new Date().toISOString().split('T')[0]
    });

    this._showNovoModal = false;
    WaveApp.showToast(`✅ Administrador ${nome} cadastrado com sucesso!`, 'success');
    WaveApp.renderCurrentPage();
  }
};
