/* ============================================
   WAVE CÉLULAS — Membros Page
   ============================================ */

window.WavePages = window.WavePages || {};

WavePages.membros = {

  _filter: 'todos',
  _search: '',

  render() {
    const celulas = WaveData.getCelulasByLider(WaveData.currentUser.id);
    const todosMembros = celulas.flatMap(c => WaveData.getMembrosByCelula(c.id));

    // Remove duplicates
    const unique = [];
    const seen = new Set();
    todosMembros.forEach(m => {
      if (!seen.has(m.id)) { seen.add(m.id); unique.push(m); }
    });

    // Filter
    let filtered = unique;
    if (this._filter !== 'todos') {
      filtered = filtered.filter(m => m.celulaId === this._filter);
    }
    if (this._search) {
      const q = this._search.toLowerCase();
      filtered = filtered.filter(m => m.nome.toLowerCase().includes(q));
    }

    // Sort by name
    filtered.sort((a, b) => a.nome.localeCompare(b.nome));

    return `
      <section class="page-header animate-in">
        <button class="back-btn" onclick="WaveApp.navigate('home')">
          <i data-lucide="arrow-left" style="width:18px;height:18px;"></i>
        </button>
        <h2 class="page-title">Discípulos</h2>
      </section>

      <div class="animate-in">
        ${WaveComponents.searchBar('Buscar por nome...', 'membros-search')}
      </div>

      <!-- Filtros -->
      <div class="filter-chips animate-in">
        <span class="chip ${this._filter === 'todos' ? 'active' : ''}" onclick="WavePages.membros.setFilter('todos')">
          Todos (${unique.length})
        </span>
        ${celulas.map(c => {
          const count = c.membrosIds.length;
          const label = c.geracao === 'MOVEMENT' ? 'Movement' : c.geracao === 'TEENS' ? 'Teens' : c.geracao;
          return `<span class="chip ${this._filter === c.id ? 'active' : ''}" onclick="WavePages.membros.setFilter('${c.id}')">${label} (${count})</span>`;
        }).join('')}
      </div>

      <!-- Lista -->
      <div class="membros-list stagger">
        ${filtered.length > 0 
          ? filtered.map(m => WaveComponents.memberListItem(m)).join('')
          : '<div class="empty-state"><i data-lucide="search-x"></i><p>Nenhum membro encontrado.</p></div>'
        }
      </div>
    `;
  },

  setFilter(filter) {
    this._filter = filter;
    WaveApp.renderCurrentPage();
  },

  onMount() {
    const input = document.getElementById('membros-search');
    if (input) {
      input.value = this._search;
      input.addEventListener('input', (e) => {
        this._search = e.target.value;
        WaveApp.renderCurrentPage();
        // Refocus and restore cursor
        const newInput = document.getElementById('membros-search');
        if (newInput) {
          newInput.focus();
          newInput.setSelectionRange(newInput.value.length, newInput.value.length);
        }
      });
    }
  }
};
