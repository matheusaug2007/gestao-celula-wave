/* ============================================
   WAVE CÉLULAS — Admin Eventos & Avisos (Conectado 100% ao Supabase)
   ============================================ */

window.WavePages = window.WavePages || {};

WavePages['admin-eventos'] = {

  _tab: 'eventos',
  _showFormModal: false,
  _tipoPublicacao: 'eventos', // 'eventos', 'avisos', 'recorrentes'

  render() {
    const todosEventos = WaveData.eventos || [];
    const todosAvisos = WaveData.avisos || [];

    const eventosEspeciais = todosEventos.filter(e => !e.recorrente && (e.categoria === 'eventos' || !e.categoria));
    const eventosRecorrentes = todosEventos.filter(e => e.recorrente || e.categoria === 'recorrentes');
    const avisos = [...todosAvisos].sort((a, b) => new Date(b.criadoEm || 0) - new Date(a.criadoEm || 0));

    return `
      <!-- Header da Página Eventos (Sem botão de voltar) -->
      <section class="page-header animate-in" style="margin-bottom:var(--space-md);display:flex;align-items:center;justify-content:space-between;gap:var(--space-md);">
        <h2 class="page-title" style="margin:0;">Eventos, Avisos & Programação</h2>

        <button class="btn btn-primary" onclick="WavePages['admin-eventos'].abrirFormModal()">
          <i data-lucide="plus" style="width:16px;height:16px;"></i> Nova Publicação
        </button>
      </section>

      <!-- Tabs de Categoria -->
      <div class="filter-chips animate-in" style="margin-bottom:var(--space-lg);">
        <span class="chip ${this._tab === 'eventos' ? 'active' : ''}" onclick="WavePages['admin-eventos'].setTab('eventos')">
          📅 Eventos Especiais (${eventosEspeciais.length})
        </span>
        <span class="chip ${this._tab === 'avisos' ? 'active' : ''}" onclick="WavePages['admin-eventos'].setTab('avisos')">
          📢 Avisos Gerais (${avisos.length})
        </span>
        <span class="chip ${this._tab === 'recorrentes' ? 'active' : ''}" onclick="WavePages['admin-eventos'].setTab('recorrentes')">
          🔁 Programação Fixa (${eventosRecorrentes.length})
        </span>
      </div>

      <!-- Conteúdo da Aba Ativa -->
      ${this._tab === 'eventos' ? this._renderEventos(eventosEspeciais) : ''}
      ${this._tab === 'avisos' ? this._renderAvisos(avisos) : ''}
      ${this._tab === 'recorrentes' ? this._renderRecorrentes(eventosRecorrentes) : ''}

      <!-- Modal Único de Criação com Escolha de Categoria -->
      <div class="modal-overlay ${this._showFormModal ? 'open' : ''}" onclick="WavePages['admin-eventos'].closeFormModalOutside(event)">
        <div class="modal-sheet">
          <div class="sheet-handle"></div>
          <div class="sheet-header">
            <h3 class="sheet-title">Nova Publicação</h3>
            <button class="sheet-close" onclick="WavePages['admin-eventos'].fecharFormModal()">
              <i data-lucide="x" style="width:18px;height:18px;"></i>
            </button>
          </div>

          <form onsubmit="WavePages['admin-eventos'].submitPublicacao(event)">
            <div style="display:flex;flex-direction:column;gap:var(--space-md);max-height:75vh;overflow-y:auto;padding-right:4px;">
              
              <!-- Seletor de Categoria Principal -->
              <div class="input-group">
                <label class="input-label">Qual categoria deseja publicar? *</label>
                <select class="input-field" name="categoriaPrincipal" onchange="WavePages['admin-eventos'].onCategoriaChange(this.value)" required>
                  <option value="eventos" ${this._tipoPublicacao === 'eventos' ? 'selected' : ''}>📅 Evento Especial (Com Data & Horário)</option>
                  <option value="avisos" ${this._tipoPublicacao === 'avisos' ? 'selected' : ''}>📢 Aviso Geral (Comunicado Pastoral)</option>
                  <option value="recorrentes" ${this._tipoPublicacao === 'recorrentes' ? 'selected' : ''}>🔁 Programação Fixa (Culto Semanal)</option>
                </select>
              </div>

              <!-- Título Comum -->
              <div class="input-group">
                <label class="input-label">Título da Publicação *</label>
                <input class="input-field" type="text" name="titulo" placeholder="Ex: Noite de Louvor e Adoração" required>
              </div>

              <!-- Campos de Evento Especial -->
              ${this._tipoPublicacao === 'eventos' ? `
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md);">
                  <div class="input-group">
                    <label class="input-label">Data do Evento *</label>
                    <input class="input-field" type="date" name="data" required>
                  </div>
                  <div class="input-group">
                    <label class="input-label">Horário *</label>
                    <input class="input-field" type="time" name="horario" value="19:30" required>
                  </div>
                </div>
                <div class="input-group">
                  <label class="input-label">Local do Evento *</label>
                  <input class="input-field" type="text" name="local" value="Templo Wave" placeholder="Ex: Templo Wave - Mandaguari" required>
                </div>
              ` : ''}

              <!-- Campos de Aviso Geral -->
              ${this._tipoPublicacao === 'avisos' ? `
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md);">
                  <div class="input-group">
                    <label class="input-label">Tipo de Urgência *</label>
                    <select class="input-field" name="categoriaAviso">
                      <option value="geral">📋 Geral</option>
                      <option value="urgente">🔴 Urgente</option>
                      <option value="evento">📅 Evento</option>
                      <option value="ministerio">⭐ Ministério</option>
                    </select>
                  </div>
                  <div class="input-group">
                    <label class="input-label">Autor do Aviso *</label>
                    <input class="input-field" type="text" name="autor" value="Secretaria Wave">
                  </div>
                </div>
                <div class="input-group">
                  <label class="input-label">Conteúdo da Mensagem *</label>
                  <textarea class="input-field" name="conteudo" rows="4" placeholder="Escreva aqui o comunicado para a igreja..." required style="resize:vertical;min-height:90px;"></textarea>
                </div>
              ` : ''}

              <!-- Campos de Programação Fixa -->
              ${this._tipoPublicacao === 'recorrentes' ? `
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md);">
                  <div class="input-group">
                    <label class="input-label">Dia da Semana *</label>
                    <select class="input-field" name="diaSemana">
                      <option value="0">Domingo</option>
                      <option value="1">Segunda-feira</option>
                      <option value="2">Terça-feira</option>
                      <option value="3">Quarta-feira</option>
                      <option value="4">Quinta-feira</option>
                      <option value="5">Sexta-feira</option>
                      <option value="6">Sábado</option>
                    </select>
                  </div>
                  <div class="input-group">
                    <label class="input-label">Horário *</label>
                    <input class="input-field" type="time" name="horario" value="19:30" required>
                  </div>
                </div>
                <div class="input-group">
                  <label class="input-label">Local *</label>
                  <input class="input-field" type="text" name="local" value="Templo Wave" required>
                </div>
              ` : ''}

              <button type="submit" class="btn btn-primary-lg" style="margin-top:var(--space-md);">
                <i data-lucide="check" style="width:18px;height:18px;"></i>
                Publicar no Banco de Dados
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  _renderEventos(eventos) {
    if (eventos.length === 0) {
      return `
        <div class="card empty-state animate-in" style="text-align:center;padding:var(--space-2xl);">
          <i data-lucide="calendar" style="width:44px;height:44px;color:var(--text-tertiary);"></i>
          <p style="color:var(--text-secondary);margin-top:var(--space-sm);">Nenhum evento especial cadastrado.</p>
          <button class="btn btn-primary" onclick="WavePages['admin-eventos'].abrirFormModal('eventos')">
            Criar Primeiro Evento
          </button>
        </div>
      `;
    }

    return `
      <div style="display:flex;flex-direction:column;gap:var(--space-sm);" class="stagger">
        ${eventos.map(ev => `
          <div class="card" style="display:flex;gap:var(--space-md);align-items:center;">
            <div style="min-width:52px;height:52px;background:var(--bg-elevated);border-radius:var(--radius-md);display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0;border:1px solid var(--border-subtle);">
              <span style="font-size:1.1rem;font-weight:800;color:var(--white);">${ev.data ? ev.data.split('-')[2] : '1'}</span>
              <span style="font-size:0.6rem;color:var(--text-tertiary);text-transform:uppercase;">${ev.data ? ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'][parseInt(ev.data.split('-')[1]) - 1] : ''}</span>
            </div>
            <div style="flex:1;min-width:0;">
              <strong style="font-size:0.9rem;color:var(--white);display:block;">${ev.titulo}</strong>
              <span style="font-size:0.75rem;color:var(--text-tertiary);">${ev.horario || ''} · ${ev.local || 'Templo Wave'}</span>
            </div>
            <button class="btn btn-ghost" onclick="WavePages['admin-eventos'].removerEvento('${ev.id}')" title="Excluir do banco" style="padding:6px;">
              <i data-lucide="trash-2" style="width:16px;height:16px;color:var(--danger);"></i>
            </button>
          </div>
        `).join('')}
      </div>
    `;
  },

  _renderAvisos(avisos) {
    if (avisos.length === 0) {
      return `
        <div class="card empty-state animate-in" style="text-align:center;padding:var(--space-2xl);">
          <i data-lucide="megaphone" style="width:44px;height:44px;color:var(--text-tertiary);"></i>
          <p style="color:var(--text-secondary);margin-top:var(--space-sm);">Nenhum aviso publicado ainda.</p>
          <button class="btn btn-primary" onclick="WavePages['admin-eventos'].abrirFormModal('avisos')">
            Publicar Primeiro Aviso
          </button>
        </div>
      `;
    }

    return `
      <div class="avisos-list stagger" style="display:flex;flex-direction:column;gap:var(--space-sm);">
        ${avisos.map(a => `
          <div class="card" style="display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-md);">
            <div style="flex:1;">
              <div style="font-size:0.72rem;color:var(--text-tertiary);margin-bottom:2px;">
                <strong>${a.autor || 'Secretaria Wave'}</strong> · ${a.criadoEm ? new Date(a.criadoEm).toLocaleDateString('pt-BR') : 'Hoje'}
              </div>
              <h4 style="font-size:0.95rem;font-weight:700;color:var(--white);margin-bottom:4px;">${a.titulo}</h4>
              <p style="font-size:0.82rem;color:var(--text-secondary);line-height:1.4;">${a.conteudo || ''}</p>
            </div>
            <button class="btn btn-ghost" onclick="WavePages['admin-eventos'].removerAviso('${a.id}')" title="Excluir do banco" style="padding:6px;">
              <i data-lucide="trash-2" style="width:16px;height:16px;color:var(--danger);"></i>
            </button>
          </div>
        `).join('')}
      </div>
    `;
  },

  _renderRecorrentes(eventos) {
    const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

    if (eventos.length === 0) {
      return `
        <div class="card empty-state animate-in" style="text-align:center;padding:var(--space-2xl);">
          <i data-lucide="repeat" style="width:44px;height:44px;color:var(--text-tertiary);"></i>
          <p style="color:var(--text-secondary);margin-top:var(--space-sm);">Nenhuma programação fixa semanal cadastrada.</p>
          <button class="btn btn-primary" onclick="WavePages['admin-eventos'].abrirFormModal('recorrentes')">
            Cadastrar Culto Fixo
          </button>
        </div>
      `;
    }

    return `
      <div style="display:flex;flex-direction:column;gap:var(--space-sm);" class="stagger">
        ${eventos.sort((a, b) => (a.diaSemana || 0) - (b.diaSemana || 0)).map(ev => `
          <div class="card" style="display:flex;gap:var(--space-md);align-items:center;">
            <div style="width:4px;height:40px;background:var(--white);border-radius:var(--radius-full);"></div>
            <div style="flex:1;">
              <strong style="font-size:0.9rem;color:var(--white);">${ev.titulo}</strong>
              <span style="display:block;font-size:0.75rem;color:var(--text-tertiary);">${dias[ev.diaSemana || 0]} · ${ev.horario || '19:30'} · ${ev.local || 'Templo Wave'}</span>
            </div>
            <button class="btn btn-ghost" onclick="WavePages['admin-eventos'].removerEvento('${ev.id}')" title="Excluir do banco" style="padding:6px;">
              <i data-lucide="trash-2" style="width:16px;height:16px;color:var(--danger);"></i>
            </button>
          </div>
        `).join('')}
      </div>
    `;
  },

  setTab(tab) { this._tab = tab; WaveApp.renderCurrentPage(); },

  abrirFormModal(tipo = 'eventos') {
    this._tipoPublicacao = tipo;
    this._showFormModal = true;
    WaveApp.renderCurrentPage();
  },

  fecharFormModal() {
    this._showFormModal = false;
    WaveApp.renderCurrentPage();
  },

  closeFormModalOutside(e) {
    if (e.target.classList.contains('modal-overlay')) {
      this.fecharFormModal();
    }
  },

  onCategoriaChange(val) {
    this._tipoPublicacao = val;
    WaveApp.renderCurrentPage();
  },

  async submitPublicacao(e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    const cat = data.get('categoriaPrincipal');
    const titulo = data.get('titulo');

    if (cat === 'avisos') {
      const novoAviso = {
        id: 'av-' + Date.now(),
        categoria: data.get('categoriaAviso') || 'geral',
        titulo: titulo,
        conteudo: data.get('conteudo'),
        autor: data.get('autor') || 'Secretaria Wave',
        criadoEm: new Date().toISOString()
      };
      await WaveData.addAviso(novoAviso);
      WaveApp.showToast(`✅ Aviso "${titulo}" salvo com sucesso no banco de dados!`, 'success');
      this._tab = 'avisos';
    } else if (cat === 'recorrentes') {
      const novoFixo = {
        id: 'ev-fixo-' + Date.now(),
        titulo: titulo,
        tipo: 'culto',
        categoria: 'recorrentes',
        horario: data.get('horario') || '19:30',
        local: data.get('local') || 'Templo Wave',
        recorrente: true,
        diaSemana: parseInt(data.get('diaSemana') || '0')
      };
      await WaveData.addEvento(novoFixo);
      WaveApp.showToast(`✅ Culto Fixo "${titulo}" salvo com sucesso no banco de dados!`, 'success');
      this._tab = 'recorrentes';
    } else {
      const novoEvento = {
        id: 'ev-' + Date.now(),
        titulo: titulo,
        tipo: 'evento',
        categoria: 'eventos',
        data: data.get('data'),
        horario: data.get('horario') || '19:30',
        local: data.get('local') || 'Templo Wave',
        recorrente: false
      };
      await WaveData.addEvento(novoEvento);
      WaveApp.showToast(`✅ Evento "${titulo}" salvo com sucesso no banco de dados!`, 'success');
      this._tab = 'eventos';
    }

    this._showFormModal = false;
    WaveApp.renderCurrentPage();
  },

  async removerEvento(id) {
    await WaveData.removeEvento(id);
    WaveApp.showToast('Item removido do banco de dados.', 'danger');
    WaveApp.renderCurrentPage();
  },

  async removerAviso(id) {
    await WaveData.removeAviso(id);
    WaveApp.showToast('Aviso removido do banco de dados.', 'danger');
    WaveApp.renderCurrentPage();
  }
};
