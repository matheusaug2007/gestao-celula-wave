/* ============================================
   WAVE CÉLULAS — Chamada de Frequência (Modo Intuitivo Líderes)
   ============================================ */

window.WavePages = window.WavePages || {};

WavePages.chamada = {

  render() {
    const liderId = WaveData.currentUser.id;
    const celulas = WaveData.getCelulasByLider(liderId);
    const celula = celulas[0] || { nome: 'Célula' };
    const nomeCelula = WaveData.formatNomeCelula(celula, celulas.length);

    const membros = WaveData.membros;
    const presentesCount = WaveData._chamadaPresentes.size;

    return `
      <!-- Header Chamada -->
      <section class="page-header animate-in" style="margin-bottom:var(--space-md);">
        <button class="back-btn" onclick="WaveApp.navigate('home')">
          <i data-lucide="arrow-left" style="width:18px;height:18px;"></i>
        </button>
        <div style="flex:1;">
          <h2 class="page-title">Frequência da ${nomeCelula}</h2>
        </div>
      </section>

      <!-- Card Contador de Presença -->
      <div class="card animate-in" style="display:flex;align-items:center;justify-content:space-between;padding:var(--space-lg);margin-bottom:var(--space-md);background:var(--bg-card);border:1px solid var(--border-medium);">
        <div>
          <span style="font-size:0.75rem;color:var(--text-tertiary);text-transform:uppercase;font-weight:700;">Presença Confirmada</span>
          <div style="font-size:1.6rem;font-weight:800;color:var(--white);" id="chamada-contador">
            ${presentesCount} de ${membros.length} membros
          </div>
        </div>

        <button class="btn btn-primary" onclick="WavePages.chamada.salvarChamada()">
          <i data-lucide="check" style="width:18px;height:18px;"></i> Salvar Chamada
        </button>
      </div>

      <!-- Lista de Membros para Chamada (Interface Intuitiva) -->
      <div style="display:flex;flex-direction:column;gap:var(--space-sm);" class="animate-in stagger">
        ${membros.map(m => {
          const presente = WaveData.isPresente(m.id);
          return `
            <div class="check-item ${presente ? 'checked' : ''}" onclick="WaveApp.toggleChamada(this, '${m.id}')" style="padding:var(--space-md) var(--space-lg);">
              <div class="check-left">
                <img class="avatar avatar-md" src="${m.foto}" alt="${m.nome}">
                <div>
                  <strong style="display:block;font-size:0.95rem;">${m.nome}</strong>
                  <span style="font-size:0.72rem;color:var(--text-tertiary);">${WaveData.formatTrilha(m.statusTrilha)}</span>
                </div>
              </div>

              <div class="check-box" style="width:28px;height:28px;border-radius:8px;">
                <i data-lucide="check" style="width:18px;height:18px;"></i>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  updateCounter() {
    const el = document.getElementById('chamada-contador');
    if (el) {
      const presentesCount = WaveData._chamadaPresentes.size;
      const total = WaveData.membros.length;
      el.textContent = `${presentesCount} de ${total} membros`;
    }
  },

  async salvarChamada() {
    const presentesCount = WaveData._chamadaPresentes.size;
    await WaveApp.alert(`Frequência registrada com sucesso!\nPresenças: ${presentesCount} de ${WaveData.membros.length} discípulos.`, 'Chamada Concluída', 'success');
    WaveApp.navigate('admin');
  }
};
