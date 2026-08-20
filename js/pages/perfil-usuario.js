/* ============================================
   WAVE CÉLULAS — Perfil do Usuário Logado & Configurações
   (Integração Total em Tempo Real com Banco de Dados Supabase)
   ============================================ */

window.WavePages = window.WavePages || {};

WavePages['perfil-usuario'] = {

  _mensagemSucesso: '',
  _showModalSenha: false,
  _showNovaSenhaModal: false,
  _showConfSenhaModal: false,

  formatPhone(value) {
    if (!value) return '';
    let v = String(value).replace(/\D/g, '');
    if (v.startsWith('55') && v.length > 11) {
      v = v.slice(2);
    }
    if (v.length > 11) v = v.slice(0, 11);

    if (v.length > 6) {
      return `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
    } else if (v.length > 2) {
      return `(${v.slice(0, 2)}) ${v.slice(2)}`;
    } else if (v.length > 0) {
      return `(${v}`;
    }
    return v;
  },

  maskPhone(input) {
    input.value = this.formatPhone(input.value);
  },

  async onMount() {
    // Sincronização em tempo real com o banco de dados Supabase
    const user = WaveAuth.getUser();
    if (user && user.id && window.supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('usuarios')
          .select('id, nome, email, role, whatsapp, telefone, foto_url, pessoa_id')
          .eq('id', user.id)
          .single();

        if (data && !error) {
          const freshData = {
            id: data.id,
            nome: data.nome || user.nome,
            email: data.email || user.email,
            role: data.role || user.role || 'ADMIN',
            whatsapp: data.whatsapp || data.telefone || '',
            telefone: data.telefone || data.whatsapp || '',
            foto: data.foto_url || null,
            pessoaId: data.pessoa_id || user.pessoaId
          };

          // Se houve alteração de dados no banco, atualiza a sessão local
          if (
            freshData.nome !== user.nome ||
            freshData.email !== user.email ||
            freshData.whatsapp !== (user.whatsapp || '') ||
            freshData.foto !== user.foto
          ) {
            WaveAuth.updateUserSession(freshData);
            WaveApp.updateNav();
            WaveApp.renderCurrentPage();
          }
        }
      } catch (err) {
        console.warn('Não foi possível sincronizar perfil com o banco:', err);
      }
    }
  },

  render() {
    const user = WaveAuth.getUser() || (window.WaveData && window.WaveData.currentUser) || {};
    const nome = user.nome || 'Administrador';
    const email = user.email || '';
    const role = user.role || 'ADMIN';
    const foto = user.foto || null;
    const initialLetter = nome ? nome.trim().charAt(0).toUpperCase() : 'U';
    const rawPhone = user.whatsapp || user.telefone || '';
    const whatsappFormatado = this.formatPhone(rawPhone);

    return `
      <div class="perfil-native-page animate-in">
        
        <!-- Topo com Botão Voltar -->
        <div class="perfil-native-topbar">
          <button type="button" class="perfil-native-back-btn" onclick="WaveApp.navigate('admin')" title="Voltar ao Painel">
            <i data-lucide="arrow-left" style="width:20px;height:20px;"></i>
            <span class="perfil-desktop-back-text">Voltar ao Painel</span>
          </button>
        </div>

        ${this._mensagemSucesso ? `
          <div class="alert-card warning animate-in" style="margin-bottom:var(--space-md);background:var(--success-muted);border-color:var(--success-border);">
            <div class="alert-left" style="display:flex;align-items:center;gap:8px;">
              <i data-lucide="check-circle" style="width:20px;height:20px;color:var(--success);"></i>
              <span style="font-size:0.88rem;color:var(--success);font-weight:600;">${this._mensagemSucesso}</span>
            </div>
          </div>
        ` : ''}

        <div class="perfil-desktop-grid">
          
          <!-- Coluna Esquerda: Hero do Usuário -->
          <div class="perfil-left-col">
            <div class="perfil-native-hero">
              <div class="perfil-native-hero-top">
                <div class="perfil-native-avatar-wrapper" onclick="document.getElementById('perfil-foto-input').click()" title="Clique para alterar sua foto">
                  <div class="perfil-native-avatar-circle" id="perfil-avatar-circle-box">
                    ${foto ? `
                      <img id="perfil-avatar-preview" src="${foto}" alt="${nome}" class="perfil-native-avatar-img">
                    ` : `
                      <span id="perfil-avatar-preview-text" class="perfil-native-avatar-text">${initialLetter}</span>
                    `}
                  </div>
                  <div class="perfil-native-camera-badge">
                    <i data-lucide="camera" style="width:14px;height:14px;"></i>
                  </div>
                  <input type="file" id="perfil-foto-input" accept="image/*" style="display:none;" onchange="WavePages['perfil-usuario'].handleFotoUpload(event)">
                </div>

                <div class="perfil-native-hero-info">
                  <h2 class="perfil-native-user-name">${nome}</h2>
                  <span class="perfil-desktop-user-email">${email}</span>
                  
                  <div class="perfil-native-pills-row">
                    <span class="perfil-native-pill role">
                      <i data-lucide="shield" style="width:13px;height:13px;"></i> ${this.formatRole(role)}
                    </span>
                    <span class="perfil-native-pill status">
                      <span class="perfil-native-dot-green"></span> Ativo
                    </span>
                  </div>
                </div>
              </div>

              <!-- Sair da Conta exclusivo no painel lateral do desktop -->
              <div class="perfil-desktop-side-logout">
                <button type="button" class="perfil-native-btn-logout" onclick="WaveAuth.logout()">
                  <i data-lucide="log-out" style="width:16px;height:16px;"></i> Sair da conta
                </button>
              </div>
            </div>
          </div>

          <!-- Coluna Direita: Informações e Acesso -->
          <div class="perfil-right-col">
            <form id="form-perfil-dados" onsubmit="WavePages['perfil-usuario'].salvarPerfil(event)" class="perfil-native-form">
              
              <!-- Seção 1: Informações Pessoais -->
              <div class="perfil-native-section">
                <div class="perfil-native-section-header">
                  <div class="perfil-native-section-title">
                    <i data-lucide="user" style="width:18px;height:18px;color:var(--text-primary);"></i>
                    <span>Informações pessoais</span>
                  </div>
                  <p class="perfil-native-section-sub">Atualize seus dados pessoais</p>
                </div>

                <div class="perfil-native-fields">
                  <div class="perfil-native-field-group">
                    <label class="perfil-native-label">Nome completo</label>
                    <input class="perfil-native-input" type="text" name="nome" id="input-perfil-nome" value="${nome}" placeholder="Nome e sobrenome" required>
                  </div>

                  <div class="perfil-grid-2-desktop">
                    <div class="perfil-native-field-group">
                      <label class="perfil-native-label">E-mail de acesso</label>
                      <input class="perfil-native-input" type="email" name="email" id="input-perfil-email" value="${email}" placeholder="seu@email.com" required>
                    </div>

                    <div class="perfil-native-field-group">
                      <label class="perfil-native-label">WhatsApp / Telefone</label>
                      <input class="perfil-native-input tel-mask" type="text" name="whatsapp" id="input-perfil-whats" value="${whatsappFormatado}" placeholder="(44) 99999-9999" oninput="WavePages['perfil-usuario'].maskPhone(this)" required>
                    </div>
                  </div>
                </div>
              </div>

              <div class="perfil-divider-desktop"></div>

              <!-- Seção 2: Segurança -->
              <div class="perfil-native-section">
                <div class="perfil-native-section-header">
                  <div class="perfil-native-section-title">
                    <i data-lucide="lock" style="width:18px;height:18px;color:var(--text-primary);"></i>
                    <span>Segurança</span>
                  </div>
                  <p class="perfil-native-section-sub">Gerencie suas credenciais de acesso</p>
                </div>

                <div class="perfil-native-security-card" onclick="WavePages['perfil-usuario'].abrirModalSenha()">
                  <div class="perfil-native-security-left">
                    <span class="perfil-native-security-label">Senha de acesso</span>
                    <span class="perfil-native-security-dots">••••••••••••••••</span>
                  </div>
                  <div class="perfil-native-security-right">
                    <i data-lucide="key" style="width:15px;height:15px;color:var(--text-secondary);"></i>
                    <span>Alterar senha</span>
                    <i data-lucide="chevron-right" style="width:16px;height:16px;color:var(--text-tertiary);"></i>
                  </div>
                </div>
              </div>

              <!-- Ações na Base -->
              <div class="perfil-native-actions">
                <button type="submit" class="perfil-native-btn-submit" id="btn-salvar-perfil">
                  <i data-lucide="save" style="width:18px;height:18px;"></i> Salvar alterações
                </button>

                <button type="button" class="perfil-native-btn-cancel" onclick="WaveApp.navigate('admin')">
                  Cancelar
                </button>

                <button type="button" class="perfil-native-btn-logout mobile-only-logout" onclick="WaveAuth.logout()">
                  <i data-lucide="log-out" style="width:16px;height:16px;"></i> Sair da conta
                </button>
              </div>

            </form>
          </div>

        </div>

      </div>

      <!-- Modal Exclusivo: Troca de Senha com Validação de Senha Forte -->
      <div class="modal-overlay ${this._showModalSenha ? 'open' : ''}" onclick="WavePages['perfil-usuario'].fecharModalSenhaOutside(event)">
        <div class="modal-sheet" style="max-width:480px;">
          <div class="sheet-handle"></div>
          <div class="sheet-header">
            <h3 class="sheet-title" style="display:flex;align-items:center;gap:8px;">
              <i data-lucide="lock" style="width:18px;height:18px;"></i> Alterar Senha de Acesso
            </h3>
            <button class="sheet-close" onclick="WavePages['perfil-usuario'].fecharModalSenha()">
              <i data-lucide="x"></i>
            </button>
          </div>

          <form id="form-alterar-senha-usuario" onsubmit="WavePages['perfil-usuario'].salvarNovaSenha(event)">
            <div style="display:flex;flex-direction:column;gap:var(--space-md);padding-top:var(--space-sm);">
              
              <!-- Senha Atual -->
              <div class="input-group">
                <label class="input-label">Senha Atual *</label>
                <input class="input-field" type="password" id="input-senha-atual" name="senha_atual" placeholder="••••••••" required>
              </div>

              <!-- Nova Senha -->
              <div class="input-group">
                <label class="input-label">Nova Senha *</label>
                <div style="position:relative;display:flex;align-items:center;">
                  <input class="input-field" type="password" id="input-nova-senha" name="nova_senha" placeholder="••••••••" required oninput="WavePages['perfil-usuario'].avaliarForcaSenha(this.value)" style="padding-right:40px;width:100%;">
                  <button type="button" onclick="WavePages['perfil-usuario'].toggleVisibilidadeSenha('input-nova-senha', this)" style="position:absolute;right:8px;background:none;border:none;color:var(--text-tertiary);cursor:pointer;padding:6px;">
                    <i data-lucide="eye" style="width:18px;height:18px;"></i>
                  </button>
                </div>

                <!-- Checklist Visual de Requisitos de Senha Forte -->
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-top:4px;font-size:0.7rem;color:var(--text-tertiary);">
                  <div id="req-len" style="display:flex;align-items:center;gap:4px;">
                    <i data-lucide="circle" style="width:12px;height:12px;"></i> Mínimo 8 caracteres
                  </div>
                  <div id="req-upper" style="display:flex;align-items:center;gap:4px;">
                    <i data-lucide="circle" style="width:12px;height:12px;"></i> Letra maiúscula
                  </div>
                  <div id="req-num" style="display:flex;align-items:center;gap:4px;">
                    <i data-lucide="circle" style="width:12px;height:12px;"></i> Ao menos um número
                  </div>
                  <div id="req-special" style="display:flex;align-items:center;gap:4px;">
                    <i data-lucide="circle" style="width:12px;height:12px;"></i> Símbolo especial (!@#$)
                  </div>
                </div>
              </div>

              <!-- Confirmar Nova Senha -->
              <div class="input-group">
                <label class="input-label">Confirmar Nova Senha *</label>
                <div style="position:relative;display:flex;align-items:center;">
                  <input class="input-field" type="password" id="input-conf-senha" name="conf_senha" placeholder="••••••••" required oninput="WavePages['perfil-usuario'].verificarMatchSenha()" style="padding-right:40px;width:100%;">
                  <button type="button" onclick="WavePages['perfil-usuario'].toggleVisibilidadeSenha('input-conf-senha', this)" style="position:absolute;right:8px;background:none;border:none;color:var(--text-tertiary);cursor:pointer;padding:6px;">
                    <i data-lucide="eye" style="width:18px;height:18px;"></i>
                  </button>
                </div>
                <span id="match-senha-status" style="font-size:0.72rem;margin-top:2px;display:none;"></span>
              </div>

              <div style="display:flex;justify-content:flex-end;gap:var(--space-md);margin-top:var(--space-lg);">
                <button type="button" class="btn btn-secondary" onclick="WavePages['perfil-usuario'].fecharModalSenha()">Cancelar</button>
                <button type="submit" class="btn btn-primary" id="btn-submit-senha">
                  <i data-lucide="key" style="width:16px;height:16px;"></i> Atualizar Senha
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>
    `;
  },

  formatRole(role) {
    if (role === 'ADMIN') return 'Administrador Geral';
    if (role === 'PASTOR') return 'Pastor / Coordenador';
    return 'Líder de Célula';
  },

  abrirModalSenha() {
    this._showModalSenha = true;
    WaveApp.renderCurrentPage();
  },

  fecharModalSenha() {
    this._showModalSenha = false;
    WaveApp.renderCurrentPage();
  },

  fecharModalSenhaOutside(e) {
    if (e.target.classList.contains('modal-overlay')) {
      this.fecharModalSenha();
    }
  },

  toggleVisibilidadeSenha(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    btn.innerHTML = `<i data-lucide="${isPassword ? 'eye-off' : 'eye'}" style="width:18px;height:18px;"></i>`;
    if (window.lucide) lucide.createIcons();
  },

  avaliarForcaSenha(val) {
    const hasLen = val.length >= 8;
    const hasUpper = /[A-Z]/.test(val);
    const hasNum = /[0-9]/.test(val);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(val);

    this.atualizarReq('req-len', hasLen);
    this.atualizarReq('req-upper', hasUpper);
    this.atualizarReq('req-num', hasNum);
    this.atualizarReq('req-special', hasSpecial);

    this.verificarMatchSenha();
  },

  atualizarReq(id, valid) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.color = valid ? 'var(--success)' : 'var(--text-tertiary)';
    el.innerHTML = `<i data-lucide="${valid ? 'check-circle' : 'circle'}" style="width:12px;height:12px;color:${valid ? 'var(--success)' : 'var(--text-tertiary)'};"></i> ${el.innerText.trim()}`;
    if (window.lucide) lucide.createIcons();
  },

  verificarMatchSenha() {
    const nova = document.getElementById('input-nova-senha')?.value || '';
    const conf = document.getElementById('input-conf-senha')?.value || '';
    const statusEl = document.getElementById('match-senha-status');
    if (!statusEl) return;

    if (!conf) {
      statusEl.style.display = 'none';
      return;
    }

    statusEl.style.display = 'block';
    if (nova === conf) {
      statusEl.textContent = '✓ As senhas conferem';
      statusEl.style.color = 'var(--success)';
    } else {
      statusEl.textContent = '✗ As senhas não coincidem';
      statusEl.style.color = 'var(--danger)';
    }
  },

  async handleFotoUpload(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // Valida se é imagem
    if (!file.type.startsWith('image/')) {
      WaveApp.alert('Por favor, selecione um arquivo de imagem válido (JPG, PNG ou WebP).', 'Arquivo Inválido', 'warning');
      return;
    }

    // Validação de tamanho (máximo 4MB)
    if (file.size > 4 * 1024 * 1024) {
      WaveApp.alert('A imagem selecionada deve ter no máximo 4MB.', 'Imagem muito pesada', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Image = event.target.result;

      const user = WaveAuth.getUser();
      if (!user) return;

      try {
        if (window.supabaseClient) {
          const { error } = await supabaseClient
            .from('usuarios')
            .update({ foto_url: base64Image })
            .eq('id', user.id);

          if (error) {
            console.error('Erro ao salvar foto no Supabase:', error);
            WaveApp.alert('Não foi possível salvar sua foto no banco de dados.', 'Erro', 'danger');
            return;
          }
        }

        // Atualiza na sessão local e headers
        WaveAuth.updateUserSession({ foto: base64Image });
        WaveApp.showToast('Foto de perfil atualizada com sucesso!', 'success');
        WaveApp.updateNav();
        WaveApp.renderCurrentPage();
      } catch (err) {
        console.error('Falha no upload da foto:', err);
        WaveApp.alert('Falha ao processar a foto. Tente novamente.', 'Erro', 'danger');
      }
    };

    reader.readAsDataURL(file);
  },

  async salvarPerfil(e) {
    if (e) e.preventDefault();

    const form = document.getElementById('form-perfil-dados');
    if (!form) return;

    const formData = new FormData(form);
    const nome = (formData.get('nome') || '').trim();
    const email = (formData.get('email') || '').trim().toLowerCase();
    const whatsapp = (formData.get('whatsapp') || '').replace(/\D/g, '');

    // Validação de Nome Completo (Obrigatório ao menos 2 nomes)
    const partesNome = nome.split(/\s+/).filter(Boolean);
    if (partesNome.length < 2) {
      await WaveApp.alert('Por favor, informe seu nome completo, ao menos nome e sobrenome.', 'Nome Incompleto', 'warning');
      const inputNome = document.getElementById('input-perfil-nome');
      if (inputNome) inputNome.focus();
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      WaveApp.alert('Por favor, insira um e-mail de acesso válido.', 'E-mail Inválido', 'warning');
      return;
    }

    const user = WaveAuth.getUser();
    if (!user) return;

    const btnSubmit = document.getElementById('btn-salvar-perfil');
    if (btnSubmit) {
      btnSubmit.disabled = true;
      btnSubmit.innerHTML = `<i data-lucide="loader-2" class="spin" style="width:16px;height:16px;"></i> Gravando no banco...`;
      if (window.lucide) lucide.createIcons();
    }

    try {
      if (window.supabaseClient) {
        // Verifica se o e-mail não pertence a outro usuário
        const { data: existingUser } = await supabaseClient
          .from('usuarios')
          .select('id')
          .eq('email', email)
          .neq('id', user.id)
          .maybeSingle();

        if (existingUser) {
          if (btnSubmit) {
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = `<i data-lucide="save" style="width:18px;height:18px;"></i> Salvar alterações`;
            if (window.lucide) lucide.createIcons();
          }
          WaveApp.alert('Este endereço de e-mail já está sendo utilizado por outro usuário.', 'E-mail já Cadastrado', 'warning');
          return;
        }

        // Grava alterações no banco de dados na tabela 'usuarios'
        const { error: errUpdate } = await supabaseClient
          .from('usuarios')
          .update({
            nome: nome,
            email: email,
            whatsapp: whatsapp,
            telefone: whatsapp
          })
          .eq('id', user.id);

        if (errUpdate) {
          console.error('Erro ao atualizar perfil no Supabase:', errUpdate);
          if (btnSubmit) {
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = `<i data-lucide="save" style="width:18px;height:18px;"></i> Salvar alterações`;
            if (window.lucide) lucide.createIcons();
          }
          WaveApp.alert('Erro ao salvar os novos dados no banco de dados.', 'Erro no Servidor', 'danger');
          return;
        }

        // Se o usuário possuir pessoa_id vinculada, atualiza na tabela pessoas também
        if (user.pessoaId) {
          await supabaseClient
            .from('pessoas')
            .update({
              nome_completo: nome,
              email: email,
              telefone: whatsapp
            })
            .eq('id', user.pessoaId);
        }
      }

      // Atualiza na sessão ativa e propaga para toda a interface
      WaveAuth.updateUserSession({
        nome: nome,
        email: email,
        whatsapp: whatsapp,
        telefone: whatsapp
      });

      WaveApp.updateNav();

      this._mensagemSucesso = 'Informações atualizadas e gravadas com sucesso no banco!';
      WaveApp.showToast('Dados do perfil salvos no banco!', 'success');
      WaveApp.renderCurrentPage();

      setTimeout(() => {
        this._mensagemSucesso = '';
        WaveApp.renderCurrentPage();
      }, 4000);

    } catch (err) {
      console.error('Erro ao salvar perfil:', err);
      if (btnSubmit) {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = `<i data-lucide="save" style="width:18px;height:18px;"></i> Salvar alterações`;
        if (window.lucide) lucide.createIcons();
      }
      WaveApp.alert('Falha inesperada ao atualizar os dados do perfil.', 'Erro', 'danger');
    }
  },

  async salvarNovaSenha(e) {
    if (e) e.preventDefault();

    const form = document.getElementById('form-alterar-senha-usuario');
    if (!form) return;

    const formData = new FormData(form);
    const senhaAtual = formData.get('senha_atual') || '';
    const novaSenha = formData.get('nova_senha') || '';
    const confSenha = formData.get('conf_senha') || '';

    if (!senhaAtual || !novaSenha || !confSenha) {
      WaveApp.alert('Por favor, preencha todos os campos de senha.', 'Campos Obrigatórios', 'warning');
      return;
    }

    if (novaSenha !== confSenha) {
      WaveApp.alert('A nova senha e a confirmação não conferem.', 'Senhas Divergentes', 'warning');
      return;
    }

    // Validação de Senha Forte
    const hasLen = novaSenha.length >= 8;
    const hasUpper = /[A-Z]/.test(novaSenha);
    const hasNum = /[0-9]/.test(novaSenha);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(novaSenha);

    if (!hasLen || !hasUpper || !hasNum || !hasSpecial) {
      WaveApp.alert('Sua nova senha deve atender a todos os critérios de segurança (ao menos 8 dígitos, 1 maiúscula, 1 número e 1 caractere especial).', 'Senha Fraca', 'warning');
      return;
    }

    const user = WaveAuth.getUser();
    if (!user) return;

    const btn = document.getElementById('btn-submit-senha');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<i data-lucide="loader-2" class="spin" style="width:16px;height:16px;"></i> Validando...`;
      if (window.lucide) lucide.createIcons();
    }

    try {
      if (window.supabaseClient) {
        // Valida senha atual no banco
        const { data: userData, error: userErr } = await supabaseClient
          .from('usuarios')
          .select('senha_hash')
          .eq('id', user.id)
          .single();

        if (userErr || !userData || userData.senha_hash !== senhaAtual) {
          WaveApp.alert('A senha atual digitada está incorreta.', 'Senha Incorreta', 'danger');
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = `<i data-lucide="key" style="width:16px;height:16px;"></i> Atualizar Senha`;
            if (window.lucide) lucide.createIcons();
          }
          return;
        }

        // Atualiza para nova senha no banco
        const { error: updateErr } = await supabaseClient
          .from('usuarios')
          .update({ senha_hash: novaSenha })
          .eq('id', user.id);

        if (updateErr) {
          WaveApp.alert('Não foi possível gravar sua nova senha no servidor.', 'Erro', 'danger');
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = `<i data-lucide="key" style="width:16px;height:16px;"></i> Atualizar Senha`;
            if (window.lucide) lucide.createIcons();
          }
          return;
        }
      }

      this.fecharModalSenha();
      WaveApp.showToast('Senha alterada com sucesso!', 'success');

    } catch (err) {
      console.error('Erro ao alterar senha:', err);
      WaveApp.alert('Falha ao atualizar senha. Tente novamente.', 'Erro', 'danger');
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<i data-lucide="key" style="width:16px;height:16px;"></i> Atualizar Senha`;
        if (window.lucide) lucide.createIcons();
      }
    }
  }
};
