/* ============================================
   WAVE CÉLULAS — Perfil do Discípulo Page
   ============================================ */

window.WavePages = window.WavePages || {};

WavePages.perfil = {

  _membroId: null,

  render(membroId) {
    if (membroId) this._membroId = membroId;
    const membro = WaveData.getMembroById(this._membroId);
    if (!membro) {
      return `<div class="empty-state"><i data-lucide="user-x"></i><p>Membro não encontrado.</p></div>`;
    }

    const idade = WaveData.calcIdade(membro.dataNascimento);
    const trilha = WaveData.formatTrilha(membro.statusTrilha);
    const notas = WaveData.getNotasByDiscipulo(membro.id);
    const frequencia = WaveData.frequenciaRecente[membro.id] || [];
    const totalPresencas = frequencia.filter(f => f === 1).length;
    const percentFreq = frequencia.length > 0 ? Math.round((totalPresencas / frequencia.length) * 100) : 0;

    // WhatsApp messages
    const nome = membro.nome.split(' ')[0];
    const celula = WaveData.celulas.find(c => c.membrosIds.includes(membro.id));
    const msgSaudade = encodeURIComponent(`Fala ${nome}, senti sua falta na nossa célula! Tá tudo bem por aí? Se precisar de algo ou de oração, conta comigo! 🙏`);
    const msgLembrete = encodeURIComponent(`Fala ${nome}! Passando pra lembrar que nossa célula é ${celula ? celula.diaSemana.toLowerCase() : 'essa semana'} às ${celula ? celula.horario : ''}h no endereço ${celula ? celula.endereco : ''}. Te espero lá! 🙌`);

    // Frequencia dots (últimas 8 semanas, mais recente primeiro)
    const semanas = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'];
    const freqDots = frequencia.map((f, i) => {
      const cls = f === 1 ? 'present' : 'absent';
      const label = f === 1 ? '✓' : '✗';
      return `<div class="freq-dot ${cls}" title="Semana ${i + 1}">${label}</div>`;
    }).join('');

    // Ministry tags
    const ministryTags = membro.ministerios.length > 0
      ? membro.ministerios.map(m => `<span class="tag"><i data-lucide="star" style="width:12px;height:12px;"></i> ${m}</span>`).join('')
      : '<span style="font-size:0.78rem;color:var(--text-tertiary);">Nenhum ministério</span>';

    // Notas
    const notasHTML = notas.length > 0
      ? notas.map(n => WaveComponents.noteCard(n)).join('')
      : '<p style="font-size:0.82rem;color:var(--text-tertiary);">Nenhuma nota registrada.</p>';

    return `
      <section class="page-header animate-in">
        <button class="back-btn" onclick="WaveApp.goBack()">
          <i data-lucide="arrow-left" style="width:18px;height:18px;"></i>
        </button>
        <h2 class="page-title">Perfil</h2>
      </section>

      <!-- Hero do Perfil -->
      <section class="profile-hero animate-in">
        <img class="avatar avatar-xl avatar-bordered" src="${membro.foto}" alt="${membro.nome}">
        <div>
          <h2 class="profile-name">${membro.nome}</h2>
          <p class="profile-meta">${idade} anos · ${membro.geracao} · ${membro.bairro}</p>
        </div>
        <div class="profile-badges">
          <span class="badge badge-white">${trilha}</span>
          ${membro.faltasConsecutivas >= 3 ? '<span class="badge badge-danger">⚠ Ausente</span>' : ''}
          ${membro.faltasConsecutivas === 2 ? '<span class="badge badge-warning">Atenção</span>' : ''}
        </div>
      </section>

      <!-- Estatísticas Rápidas -->
      <section class="profile-stats animate-in">
        <div class="profile-stat">
          <span class="profile-stat-value">${percentFreq}%</span>
          <span class="profile-stat-label">Frequência</span>
        </div>
        <div class="profile-stat">
          <span class="profile-stat-value">${totalPresencas}</span>
          <span class="profile-stat-label">Presenças</span>
        </div>
        <div class="profile-stat">
          <span class="profile-stat-value">${notas.length}</span>
          <span class="profile-stat-label">Notas</span>
        </div>
      </section>

      <!-- Ações WhatsApp -->
      <section class="profile-actions animate-in">
        <a href="https://wa.me/${membro.whatsapp}?text=${msgSaudade}" target="_blank" class="btn btn-whatsapp" style="flex:1;">
          <i data-lucide="message-circle" style="width:16px;height:16px;"></i> Mensagem
        </a>
        <a href="https://wa.me/${membro.whatsapp}?text=${msgLembrete}" target="_blank" class="btn btn-whatsapp" style="flex:1;">
          <i data-lucide="bell" style="width:16px;height:16px;"></i> Lembrete
        </a>
      </section>

      <!-- Ministérios -->
      <section class="profile-section animate-in">
        <h3 class="profile-section-title">Ministérios (Voluts)</h3>
        <div style="display:flex;flex-wrap:wrap;gap:var(--space-sm);">
          ${ministryTags}
        </div>
      </section>

      <!-- Frequência Recente -->
      <section class="profile-section animate-in">
        <h3 class="profile-section-title">Frequência (Últimas 8 semanas)</h3>
        <div class="frequency-grid">
          ${freqDots}
        </div>
      </section>

      <!-- Notas Pastorais -->
      <section class="profile-section animate-in">
        <div class="section-header">
          <h3 class="profile-section-title">Notas Pastorais</h3>
          <button class="btn btn-ghost" onclick="WavePages.perfil.addNote()">
            <i data-lucide="plus" style="width:16px;height:16px;"></i> Nova
          </button>
        </div>
        <div style="display:flex;flex-direction:column;gap:var(--space-sm);">
          ${notasHTML}
        </div>
      </section>
    `;
  },

  addNote() {
    const nota = prompt('Escreva sua nota pastoral:');
    if (nota && nota.trim()) {
      WaveData.notas.push({
        id: 'nota-' + Date.now(),
        discipiloId: this._membroId,
        autorId: WaveData.currentUser.id,
        tipo: 'PASTOREIO',
        conteudo: nota.trim(),
        criadoEm: new Date().toISOString()
      });
      WaveApp.renderCurrentPage();
    }
  }
};
