/* ============================================
   WAVE CÉLULAS — Home Page (Visão do Líder de Célula)
   Interface limpa, intuitiva e focada na experiência do usuário
   ============================================ */

window.WavePages = window.WavePages || {};

WavePages.home = {

  _aniversarianteModal: null,
  _mensagemTom: 'espiritual',

  render() {
    const liderId = WaveData.currentUser.id;
    const celulas = WaveData.getCelulasByLider(liderId);
    const proximaCelula = celulas[0] || { nome: 'Célula', horario: '18:00', endereco: 'Templo Wave' };
    const nomeCelulaFormatado = WaveData.formatNomeCelula(proximaCelula, celulas.length);

    const membros = WaveData.membros;
    const totalMembros = membros.length;

    // Aniversariantes da semana
    const aniversariantes = WaveData.getAniversariantes();
    const alertas = WaveData.getAlertasAusencia();

    const hoje = new Date();
    const diaTexto = WaveData.getDiaSemanaTexto(hoje.getDay());

    return `
      <!-- Saudação Líder -->
      <section class="animate-in">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
          <div>
            <span style="font-size:0.85rem;color:var(--text-tertiary);font-weight:500;">Graça e Paz,</span>
            <h1 style="font-size:1.6rem;font-weight:800;letter-spacing:-0.5px;margin-top:2px;">${WaveData.currentUser.nome}</h1>
          </div>
          <div style="text-align:right;">
            <span class="badge badge-white" style="font-size:0.75rem;">
              <i data-lucide="home" style="width:12px;height:12px;display:inline;"></i> ${nomeCelulaFormatado}
            </span>
          </div>
        </div>
      </section>

      <!-- Card da Próxima Encontro de Célula -->
      <section class="hero-card animate-in" style="background:var(--bg-card);border:1px solid var(--border-medium);border-radius:var(--radius-xl);padding:var(--space-xl);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-md);">
          <span style="font-size:0.75rem;color:var(--text-tertiary);font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Próxima Reunião</span>
          <span style="font-size:0.8rem;color:var(--white);font-weight:600;">${diaTexto} · ${proximaCelula.horario}</span>
        </div>

        <h2 style="font-size:1.4rem;font-weight:800;margin-bottom:var(--space-xs);">${nomeCelulaFormatado}</h2>
        <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:var(--space-lg);">${proximaCelula.endereco}</p>

        <button class="btn btn-primary-lg" onclick="WaveApp.navigate('chamada')" style="width:100%;">
          <i data-lucide="check-square" style="width:20px;height:20px;"></i>
          Fazer Chamada da Célula
        </button>
      </section>

      <!-- Aniversariantes da Semana com Gerador Mensagens (Zero Emojis) -->
      ${aniversariantes.length > 0 ? `
        <section class="section animate-in">
          ${WaveComponents.sectionHeader('cake', 'Aniversariantes da Semana')}
          <div class="h-scroll">
            ${aniversariantes.map(m => `
              <div class="birthday-card" onclick="WavePages.home.abrirGeradorParabens('${m.id}')" style="cursor:pointer;min-width:160px;">
                <img class="avatar avatar-md" src="${m.foto}" alt="${m.nome}">
                <div class="birthday-name">${m.nome}</div>
                <div class="birthday-date">${new Date(m.dataNascimento).getDate()}/${new Date(m.dataNascimento).getMonth() + 1} · ${WaveData.calcIdade(m.dataNascimento)} anos</div>
                <span class="btn btn-secondary" style="font-size:0.7rem;padding:4px 8px;margin-top:4px;width:100%;">
                  Gerar Mensagem
                </span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Alertas Pastorais de Ausência -->
      ${alertas.length > 0 ? `
        <section class="section animate-in">
          ${WaveComponents.sectionHeader('alert-triangle', 'Atenção Pastoral (Faltas)')}
          <div style="display:flex;flex-direction:column;gap:var(--space-sm);">
            ${alertas.map(m => `
              <div class="alert-card warning">
                <div class="alert-left">
                  <img class="avatar avatar-sm" src="${m.foto}" alt="${m.nome}">
                  <div class="alert-info">
                    <span class="alert-name">${m.nome}</span>
                    <span class="alert-reason">${m.faltasConsecutivas} faltas consecutivas na célula</span>
                  </div>
                </div>
                <a href="https://wa.me/${m.whatsapp}" target="_blank" class="btn-whatsapp-icon" title="Enviar Mensagem">
                  <i data-lucide="message-circle" style="width:16px;height:16px;"></i>
                </a>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Módulos de Gestão Rápida -->
      <section class="section animate-in">
        ${WaveComponents.sectionHeader('layout-grid', 'Acesso Rápido')}
        <div class="grid-2 stagger">
          <div class="hub-card" onclick="WaveApp.navigate('membros')">
            <div class="hub-icon white"><i data-lucide="users" style="width:22px;height:22px;"></i></div>
            <span class="hub-card-title">Meus Discípulos</span>
            <span class="hub-card-sub">${totalMembros} membros cadastrados</span>
          </div>

          <div class="hub-card" onclick="WaveApp.navigate('chamada')">
            <div class="hub-icon white"><i data-lucide="check-square" style="width:22px;height:22px;"></i></div>
            <span class="hub-card-title">Frequência</span>
            <span class="hub-card-sub">Registrar chamada</span>
          </div>

          <div class="hub-card" onclick="WaveApp.navigate('agenda')">
            <div class="hub-icon white"><i data-lucide="calendar" style="width:22px;height:22px;"></i></div>
            <span class="hub-card-title">Agenda</span>
            <span class="hub-card-sub">Cultos e eventos</span>
          </div>

          <div class="hub-card" onclick="WaveApp.navigate('avisos')">
            <div class="hub-icon white"><i data-lucide="bell" style="width:22px;height:22px;"></i></div>
            <span class="hub-card-title">Avisos da Igreja</span>
            <span class="hub-card-sub">Comunicados secretaria</span>
          </div>
        </div>
      </section>

      <!-- Modal: Gerador Personalizado de Mensagem de Parabéns -->
      <div class="modal-overlay ${this._aniversarianteModal ? 'open' : ''}" onclick="WavePages.home.fecharModalOutside(event)">
        <div class="modal-sheet">
          <div class="sheet-handle"></div>
          <div class="sheet-header">
            <h3 class="sheet-title">Mensagem de Parabéns Personalizada</h3>
            <button class="sheet-close" onclick="WavePages.home.fecharModal()">
              <i data-lucide="x" style="width:18px;height:18px;"></i>
            </button>
          </div>

          ${this._aniversarianteModal ? (() => {
            const m = WaveData.getMembroById(this._aniversarianteModal);
            if (!m) return '';
            const msg = WaveData.gerarMensagemParabens(m, this._mensagemTom);

            return `
              <div style="display:flex;flex-direction:column;gap:var(--space-md);">
                <div style="display:flex;align-items:center;gap:var(--space-md);">
                  <img class="avatar avatar-md" src="${m.foto}" alt="${m.nome}">
                  <div>
                    <strong style="display:block;font-size:1rem;">${m.nome}</strong>
                    <span style="font-size:0.8rem;color:var(--text-tertiary);">${WaveData.calcIdade(m.dataNascimento)} anos</span>
                  </div>
                </div>

                <div class="input-group">
                  <label class="input-label">Selecione o Tom da Mensagem</label>
                  <select class="input-field" onchange="WavePages.home.alterarTom(this.value)">
                    <option value="espiritual" ${this._mensagemTom === 'espiritual' ? 'selected' : ''}>Tom Espiritual & Benção</option>
                    <option value="carinhoso" ${this._mensagemTom === 'carinhoso' ? 'selected' : ''}>Tom Carinhoso & Afetivo</option>
                    <option value="fraterno" ${this._mensagemTom === 'fraterno' ? 'selected' : ''}>Tom Fraterno & Amizade</option>
                  </select>
                </div>

                <div class="input-group">
                  <label class="input-label">Mensagem Gerada (Texto Limpo)</label>
                  <textarea class="input-field" id="mensagem-parabens-texto" rows="5" readonly style="resize:none;line-height:1.5;font-size:0.88rem;">${msg}</textarea>
                </div>

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md);margin-top:var(--space-xs);">
                  <button class="btn btn-secondary" onclick="WavePages.home.copiarTexto()">
                    <i data-lucide="copy" style="width:16px;height:16px;"></i> Copiar Texto
                  </button>

                  <a href="https://wa.me/${m.whatsapp}?text=${encodeURIComponent(msg)}" target="_blank" class="btn btn-primary" style="display:flex;align-items:center;justify-content:center;gap:var(--space-xs);">
                    <i data-lucide="message-circle" style="width:16px;height:16px;"></i> Enviar no WhatsApp
                  </a>
                </div>
              </div>
            `;
          })() : ''}
        </div>
      </div>
    `;
  },

  abrirGeradorParabens(membroId) {
    this._aniversarianteModal = membroId;
    WaveApp.renderCurrentPage();
  },

  fecharModal() {
    this._aniversarianteModal = null;
    WaveApp.renderCurrentPage();
  },

  fecharModalOutside(e) {
    if (e.target.classList.contains('modal-overlay')) {
      this._aniversarianteModal = null;
      WaveApp.renderCurrentPage();
    }
  },

  alterarTom(novoTom) {
    this._mensagemTom = novoTom;
    WaveApp.renderCurrentPage();
  },

  copiarTexto() {
    const area = document.getElementById('mensagem-parabens-texto');
    if (area) {
      area.select();
      document.execCommand('copy');
      WaveApp.showToast('✅ Mensagem copiada com sucesso!', 'success');
    }
  }
};
