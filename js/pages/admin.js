/* ============================================
   WAVE CÉLULAS — Admin Dashboard (Painel Pastoral)
   (Especificação PO v1: Sem gráfico, Aniversariantes do Mês com WhatsApp individual)
   ============================================ */

window.WavePages = window.WavePages || {};

WavePages.admin = {

  _showAniversariantesModal: false,
  _modeloSelecionado: 'espiritual',
  _showNovoModeloForm: false,

  render() {
    const stats = WaveData.igrejaStats;
    const todosMembros = WaveData.getAllMembrosIgreja();
    const membrosAtivos = todosMembros.filter(m => (m.status || 'ATIVO') === 'ATIVO');
    const lideresAtivos = WaveData.getAllLideresAtivos();
    const aniversariantesMes = WaveData.getAniversariantesDoMes();

    const membrosAtivosCount = membrosAtivos.length;
    const totalMembrosCadastrados = todosMembros.length;
    const totalCelulasAtivas = stats.totalCelulas;
    const modelos = WaveData.getModelosAniversario();
    const modeloAtual = modelos.find(m => m.id === this._modeloSelecionado) || modelos[0];

    // Exemplo de pré-visualização para o modelo ativo
    const exemploMembroPreview = aniversariantesMes.length > 0 ? aniversariantesMes[0] : { nome: 'João Silva', dataNascimento: '2000-01-01', sexo: 'MASCULINO' };
    const textoPreview = WaveData.gerarMensagemParabens(exemploMembroPreview, this._modeloSelecionado);

    return `
      <!-- Dashboard Header com Logo Oficial da Wave -->
      <div class="admin-dash-header animate-in" style="margin-bottom:var(--space-md);">
        <div>
          <span style="font-size:0.8rem;color:var(--text-secondary);font-weight:500;">Visão Geral da Comunidade</span>
          <h1 style="font-size:1.6rem;font-weight:900;letter-spacing:-0.5px;margin-top:2px;">Painel Administrativo</h1>
        </div>
        <img src="imagens/W_logo.jpg" alt="Wave Logo" style="width:44px;height:44px;border-radius:var(--radius-md);object-fit:cover;box-shadow:0 6px 18px rgba(255,255,255,0.12);">
      </div>

      <!-- Cards Estatísticos (Ponto 11) -->
      <div class="cards-stat-grid animate-in" style="margin-bottom:var(--space-lg);">
        
        <!-- Membros Ativos -->
        <div class="card-stat-box membros" onclick="WaveApp.navigate('admin-membros')" style="cursor:pointer;" title="Ver Listagem de Membros">
          <div class="card-stat-box-header">
            <div>
              <div class="card-stat-box-title">Membros Ativos</div>
              <div class="card-stat-box-value">${membrosAtivosCount}</div>
            </div>
            <div class="card-stat-box-icon">
              <i data-lucide="users"></i>
            </div>
          </div>
          <div class="card-stat-box-footer">
            Total Cadastrado: <span>${totalMembrosCadastrados}</span>
          </div>
        </div>

        <!-- Células Ativas (Clicável -> Células) -->
        <div class="card-stat-box celulas" onclick="WaveApp.navigate('admin-lideres')" style="cursor:pointer;" title="Ver Listagem de Células">
          <div class="card-stat-box-header">
            <div>
              <div class="card-stat-box-title">Células Ativas</div>
              <div class="card-stat-box-value">${totalCelulasAtivas}</div>
            </div>
            <div class="card-stat-box-icon">
              <i data-lucide="crown" style="color:var(--success);"></i>
            </div>
          </div>
        </div>

        <!-- Aniversariantes do Mês (Clicável -> Modal com WhatsApp individual) -->
        <div class="card-stat-box aniversariantes" onclick="WavePages.admin.abrirAniversariantesModal()" style="cursor:pointer;" title="Ver Aniversariantes do Mês">
          <div class="card-stat-box-header">
            <div>
              <div class="card-stat-box-title">Aniversários do Mês</div>
              <div class="card-stat-box-value">${aniversariantesMes.length}</div>
            </div>
            <div class="card-stat-box-icon">
              <i data-lucide="cake" style="color:var(--warning);"></i>
            </div>
          </div>
          <div class="card-stat-box-footer">
            Neste mês: <span>${aniversariantesMes.length} aniversariante(s)</span>
          </div>
        </div>

        <!-- Líderes -->
        <div class="card-stat-box lideres" onclick="WaveApp.navigate('admin-lideres')" style="cursor:pointer;" title="Ver Líderes">
          <div class="card-stat-box-header">
            <div>
              <div class="card-stat-box-title">Líderes de Célula</div>
              <div class="card-stat-box-value">${lideresAtivos.length}</div>
            </div>
            <div class="card-stat-box-icon">
              <i data-lucide="crown" style="color:var(--danger);"></i>
            </div>
          </div>
        </div>

      </div>

      <!-- Modal: Aniversariantes do Mês com WhatsApp e Modelos de Mensagem -->
      <div class="modal-overlay ${this._showAniversariantesModal ? 'open' : ''}" onclick="WavePages.admin.fecharAniversariantesOutside(event)">
        <div class="modal-sheet" style="max-width:620px;">
          <div class="sheet-handle"></div>
          <div class="sheet-header">
            <div style="display:flex;align-items:center;gap:8px;">
              <h3 class="sheet-title">🎉 Aniversariantes deste Mês</h3>
              <span class="badge badge-success" style="font-size:0.75rem;">${aniversariantesMes.length} pessoa(s)</span>
            </div>
            <button class="sheet-close" onclick="WavePages.admin.fecharAniversariantesModal()">
              <i data-lucide="x" style="width:18px;height:18px;"></i>
            </button>
          </div>

          <div style="display:flex;flex-direction:column;gap:var(--space-md);max-height:75vh;overflow-y:auto;padding-right:4px;">
            
            <!-- Caixa de Seleção e Criação de Modelos -->
            <div style="background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:var(--space-md);display:flex;flex-direction:column;gap:10px;">
              <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
                <label style="font-size:0.78rem;font-weight:700;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.5px;">
                  Modelo de Mensagem:
                </label>

                <button type="button" class="btn btn-ghost" onclick="WavePages.admin.toggleNovoModeloForm()" style="font-size:0.75rem;padding:4px 8px;gap:4px;color:var(--white);">
                  <i data-lucide="${this._showNovoModeloForm ? 'chevron-up' : 'plus'}" style="width:14px;height:14px;"></i>
                  <span>${this._showNovoModeloForm ? 'Fechar Criador' : 'Criar Novo Modelo'}</span>
                </button>
              </div>

              <!-- Select de Modelos -->
              <div style="display:flex;gap:8px;align-items:center;">
                <select class="input-field" style="flex:1;font-size:0.85rem;" onchange="WavePages.admin.selecionarModelo(this.value)">
                  ${modelos.map(m => `
                    <option value="${m.id}" ${this._modeloSelecionado === m.id ? 'selected' : ''}>
                      ${m.titulo} ${m.isCustom ? '(Personalizado)' : ''}
                    </option>
                  `).join('')}
                </select>

                ${modeloAtual && modeloAtual.isCustom ? `
                  <button type="button" class="btn btn-ghost" onclick="WavePages.admin.removerModelo('${modeloAtual.id}')" title="Excluir este modelo" style="color:var(--danger);padding:8px;">
                    <i data-lucide="trash-2" style="width:16px;height:16px;"></i>
                  </button>
                ` : ''}
              </div>

              <!-- Formulário Inline para Criar Novo Modelo -->
              ${this._showNovoModeloForm ? `
                <div style="background:var(--bg-card);border:1px dashed var(--border-medium);border-radius:var(--radius-sm);padding:var(--space-md);margin-top:4px;display:flex;flex-direction:column;gap:8px;" class="animate-in">
                  <span style="font-size:0.78rem;font-weight:700;color:var(--text-primary);">Cadastrar Novo Modelo de Mensagem</span>
                  
                  <input type="text" id="novo-modelo-titulo" placeholder="Ex: 🔥 Super Descontraído / Jovem" class="input-field" style="font-size:0.82rem;">
                  
                  <textarea id="novo-modelo-template" placeholder="Escreva a mensagem aqui... Use as tags dinâmicas: {nome}, {idade}, {tratamento}, {complementoIdade}" class="input-field" style="min-height:85px;font-size:0.82rem;line-height:1.4;resize:vertical;"></textarea>
                  
                  <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px;">
                    <div style="display:flex;gap:4px;flex-wrap:wrap;">
                      <button type="button" class="btn btn-ghost" onclick="WavePages.admin.inserirTag('{nome}')" style="font-size:0.7rem;padding:2px 6px;background:rgba(255,255,255,0.06);">+ {nome}</button>
                      <button type="button" class="btn btn-ghost" onclick="WavePages.admin.inserirTag('{idade}')" style="font-size:0.7rem;padding:2px 6px;background:rgba(255,255,255,0.06);">+ {idade}</button>
                      <button type="button" class="btn btn-ghost" onclick="WavePages.admin.inserirTag('{tratamento}')" style="font-size:0.7rem;padding:2px 6px;background:rgba(255,255,255,0.06);">+ {tratamento}</button>
                    </div>

                    <button type="button" class="btn btn-primary" onclick="WavePages.admin.salvarNovoModeloSubmit()" style="padding:6px 14px;font-size:0.78rem;">
                      Salvar Modelo
                    </button>
                  </div>
                </div>
              ` : ''}

              <!-- Preview da Mensagem com o Tom Escolhido -->
              <div style="background:var(--bg-card);border-radius:var(--radius-sm);padding:10px 12px;border:1px solid var(--border-subtle);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                  <span style="font-size:0.7rem;color:var(--text-tertiary);text-transform:uppercase;font-weight:700;">Pré-visualização da Mensagem:</span>
                  <button type="button" class="btn btn-ghost" onclick="WavePages.admin.copiarTexto('${encodeURIComponent(textoPreview)}')" style="font-size:0.7rem;padding:2px 6px;color:var(--text-secondary);" title="Copiar pré-visualização">
                    <i data-lucide="copy" style="width:12px;height:12px;"></i> Copiar
                  </button>
                </div>
                <p style="font-size:0.8rem;color:var(--text-primary);line-height:1.45;margin:0;font-style:italic;">
                  "${textoPreview}"
                </p>
              </div>

            </div>

            <!-- Lista de Aniversariantes do Mês -->
            ${aniversariantesMes.length === 0 ? `
              <div class="card empty-state" style="padding:var(--space-2xl);">
                <i data-lucide="cake" style="width:40px;height:40px;color:var(--text-tertiary);"></i>
                <p style="color:var(--text-secondary);margin-top:var(--space-sm);font-size:0.85rem;">Nenhum aniversariante registrado para este mês.</p>
              </div>
            ` : `
              <div style="display:flex;flex-direction:column;gap:8px;">
                ${aniversariantesMes.map(m => {
      const nasc = new Date(m.dataNascimento);
      const diaNasc = String(nasc.getDate()).padStart(2, '0');
      const mesNasc = String(nasc.getMonth() + 1).padStart(2, '0');
      const idade = WaveData.calcIdade(m.dataNascimento);
      const msgCustom = WaveData.gerarMensagemParabens(m, this._modeloSelecionado);
      const msgEncoded = encodeURIComponent(msgCustom);

      return `
                    <div class="card" style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border:1px solid var(--border-subtle);gap:12px;">
                      <div style="display:flex;align-items:center;gap:10px;min-width:0;flex:1;">
                        <div style="width:36px;height:36px;border-radius:var(--radius-full);background:var(--bg-elevated);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;flex-shrink:0;color:var(--white);">
                          ${m.nome.charAt(0)}
                        </div>
                        <div style="min-width:0;flex:1;">
                          <strong style="font-size:0.88rem;color:var(--white);display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${m.nome}</strong>
                          <span style="font-size:0.72rem;color:var(--warning);font-weight:600;">📅 ${diaNasc}/${mesNasc} (${idade} anos)</span>
                        </div>
                      </div>

                      ${m.whatsapp ? `
                        <a href="https://wa.me/${m.whatsapp.replace(/\D/g, '')}?text=${msgEncoded}" target="_blank" class="btn btn-whatsapp" style="padding:7px 14px;font-size:0.78rem;border-radius:var(--radius-md);text-decoration:none;display:inline-flex;align-items:center;gap:6px;flex-shrink:0;font-weight:600;">
                          <i data-lucide="message-circle" style="width:15px;height:15px;"></i> Enviar Parabéns
                        </a>
                      ` : `
                        <span style="font-size:0.7rem;color:var(--text-tertiary);">Sem WhatsApp</span>
                      `}
                    </div>
                  `;
    }).join('')}
              </div>
            `}
          </div>
        </div>
      </div>
    `;
  },

  selecionarModelo(modeloId) {
    this._modeloSelecionado = modeloId;
    WaveApp.renderCurrentPage();
  },

  toggleNovoModeloForm() {
    this._showNovoModeloForm = !this._showNovoModeloForm;
    WaveApp.renderCurrentPage();
  },

  inserirTag(tag) {
    const textarea = document.getElementById('novo-modelo-template');
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const val = textarea.value;
      textarea.value = val.substring(0, start) + tag + val.substring(end);
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + tag.length;
    }
  },

  salvarNovoModeloSubmit() {
    const tituloInput = document.getElementById('novo-modelo-titulo');
    const templateInput = document.getElementById('novo-modelo-template');
    const titulo = tituloInput ? tituloInput.value.trim() : '';
    const template = templateInput ? templateInput.value.trim() : '';

    if (!titulo || !template) {
      WaveApp.showToast('Preencha o título e a mensagem do modelo.', 'danger');
      return;
    }

    const ok = WaveData.salvarNovoModeloAniversario(titulo, template);
    if (ok) {
      const modelos = WaveData.getModelosAniversario();
      const recemCriado = modelos[modelos.length - 1];
      if (recemCriado) {
        this._modeloSelecionado = recemCriado.id;
      }
      this._showNovoModeloForm = false;
      WaveApp.showToast('✅ Novo modelo de mensagem salvo com sucesso!', 'success');
      WaveApp.renderCurrentPage();
    } else {
      WaveApp.showToast('Erro ao salvar modelo.', 'danger');
    }
  },

  async removerModelo(modeloId) {
    const confirmar = await WaveApp.confirm('Deseja realmente excluir este modelo personalizado?', 'Excluir Modelo', {
      confirmText: 'Sim, Excluir',
      cancelText: 'Cancelar',
      type: 'danger'
    });
    if (confirmar) {
      WaveData.removerModeloAniversario(modeloId);
      this._modeloSelecionado = 'espiritual';
      WaveApp.showToast('Modelo removido.', 'info');
      WaveApp.renderCurrentPage();
    }
  },

  copiarTexto(textoEncoded) {
    const texto = decodeURIComponent(textoEncoded);
    navigator.clipboard.writeText(texto).then(() => {
      WaveApp.showToast('📋 Mensagem copiada para a área de transferência!', 'success');
    }).catch(() => {
      WaveApp.showToast('Não foi possível copiar automaticamente.', 'danger');
    });
  },

  abrirAniversariantesModal() {
    this._showAniversariantesModal = true;
    WaveApp.renderCurrentPage();
  },

  fecharAniversariantesModal() {
    this._showAniversariantesModal = false;
    this._showNovoModeloForm = false;
    WaveApp.renderCurrentPage();
  },

  fecharAniversariantesOutside(e) {
    if (e.target.classList.contains('modal-overlay')) {
      this.fecharAniversariantesModal();
    }
  }
};
