/* ============================================
   WAVE CÉLULAS — Avisos Page (Secretaria)
   ============================================ */

window.WavePages = window.WavePages || {};

WavePages.avisos = {

  _filter: 'todos',

  render() {
    let avisos = [...WaveData.avisos];

    // Filter
    if (this._filter !== 'todos') {
      avisos = avisos.filter(a => a.categoria === this._filter);
    }

    // Sort: não lidos primeiro, depois por data
    avisos.sort((a, b) => {
      if (a.lido !== b.lido) return a.lido ? 1 : -1;
      return new Date(b.criadoEm) - new Date(a.criadoEm);
    });

    const naoLidos = WaveData.avisos.filter(a => !a.lido).length;

    const categorias = [
      { key: 'todos', label: 'Todos' },
      { key: 'urgente', label: '🔴 Urgente' },
      { key: 'evento', label: '📅 Eventos' },
      { key: 'ministerio', label: '⭐ Ministério' },
      { key: 'geral', label: 'Geral' }
    ];

    return `
      <section class="page-header animate-in">
        <button class="back-btn" onclick="WaveApp.navigate('home')">
          <i data-lucide="arrow-left" style="width:18px;height:18px;"></i>
        </button>
        <h2 class="page-title">Avisos</h2>
        ${naoLidos > 0 ? `<span class="badge badge-white" style="margin-left:auto;">${naoLidos} novos</span>` : ''}
      </section>

      <!-- Filtros -->
      <div class="filter-chips animate-in">
        ${categorias.map(cat => `
          <span class="chip ${this._filter === cat.key ? 'active' : ''}" 
                onclick="WavePages.avisos.setFilter('${cat.key}')">
            ${cat.label}
          </span>
        `).join('')}
      </div>

      <!-- Lista de Avisos -->
      <div class="avisos-list stagger">
        ${avisos.length > 0
          ? avisos.map(a => WaveComponents.avisoCard(a)).join('')
          : `<div class="empty-state">
              <i data-lucide="bell-off"></i>
              <p>Nenhum aviso nessa categoria.</p>
            </div>`
        }
      </div>
    `;
  },

  setFilter(filter) {
    this._filter = filter;
    WaveApp.renderCurrentPage();
  }
};
