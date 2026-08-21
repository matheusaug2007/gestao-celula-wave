/* ============================================
   WAVE CÉLULAS — Gestão de Membros
   (Especificação PO v1: Ciclo de Vida, Múltiplas Células, Colunas Dinâmicas e Exportação)
   ============================================ */

window.WavePages = window.WavePages || {};

WavePages['admin-membros'] = {

  _search: '',
  _filterSexo: 'todos',
  _filterStatus: 'ATIVO',
  _filterELider: 'todos',
  _filterBairro: 'todos',
  _filterCidade: 'todos',
  _filterDiaCelula: 'todos',
  _filterFaixaEtaria: 'todos',
  _filterLider: 'todos',
  _showForm: false,
  _showFiltrosDrawer: false,
  _showColunasDropdown: false,
  _membroDetalhes: null,
  _editandoMembro: false,
  _membroParaRedistribuir: null,
  _membroParaReativar: null,
  _confirmacaoTrocaLider: null,

  // Paginação e Ordenação
  _pageSize: 50,
  _currentPageNum: 1,
  _sortCol: 'nome',
  _sortAsc: true,

  // Colunas disponíveis para seleção dinâmica (Ponto 19)
  _availableCols: [
    { key: 'nome', label: 'Nome / Discípulo', required: true },
    { key: 'lider', label: 'Líder Responsável' },
    { key: 'whatsapp', label: 'WhatsApp' },
    { key: 'idade', label: 'Idade' },
    { key: 'endereco', label: 'Bairro / Cidade' },
    { key: 'status', label: 'Status' }
  ],
  _visibleCols: ['nome', 'lider', 'whatsapp', 'idade', 'endereco', 'status'],

  // Células em edição temporária no formulário de membro
  _tempCelulasForm: [],

  getColStorageKey() {
    const user = WaveAuth.getUser();
    return 'wave_cols_membros_' + (user && user.email ? user.email.toLowerCase() : 'default');
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
    if (key === 'nome') return; // Nome sempre visível
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

  formatNameWords(name, maxWords) {
    if (!name || name === '—') return '—';
    const parts = name.trim().split(/\s+/);
    if (parts.length <= maxWords) return name;
    return parts.slice(0, maxWords).join(' ');
  },

  getUniqueBairros(membros) {
    const bairros = membros.map(m => m.bairro).filter(b => b && b.trim() !== '' && b !== '—');
    return [...new Set(bairros)].sort();
  },

  getUniqueCidades(membros) {
    const cidades = membros.map(m => m.cidade || 'Mandaguari').filter(c => c && c.trim() !== '');
    return [...new Set(cidades)].sort();
  },

  applyAllFilters(membros) {
    let list = [...membros];

    if (this._filterSexo !== 'todos') {
      list = list.filter(m => m.sexo === this._filterSexo);
    }
    if (this._filterStatus !== 'todos') {
      list = list.filter(m => (m.status || 'ATIVO') === this._filterStatus);
    }
    if (this._filterELider !== 'todos') {
      const eL = this._filterELider === 'sim';
      list = list.filter(m => (m.eLider ?? false) === eL);
    }
    if (this._filterBairro !== 'todos') {
      list = list.filter(m => m.bairro === this._filterBairro);
    }
    if (this._filterCidade !== 'todos') {
      list = list.filter(m => (m.cidade || 'Mandaguari') === this._filterCidade);
    }
    if (this._filterDiaCelula !== 'todos') {
      list = list.filter(m => {
        if (!m.celulas || m.celulas.length === 0) return false;
        return m.celulas.some(c => c.finalidade === 'Evangelística' && c.diaSemana === this._filterDiaCelula);
      });
    }
    if (this._filterFaixaEtaria !== 'todos') {
      list = list.filter(m => {
        const idade = WaveData.calcIdade(m.dataNascimento);
        if (this._filterFaixaEtaria === 'kids') return idade >= 0 && idade <= 9;
        if (this._filterFaixaEtaria === 'teens') return idade >= 10 && idade <= 12;
        if (this._filterFaixaEtaria === 'adolescente') return idade >= 13 && idade <= 17;
        if (this._filterFaixaEtaria === 'jovem_adulto') return idade >= 18 && idade <= 29;
        if (this._filterFaixaEtaria === 'adulto') return idade >= 30;
        return true;
      });
    }

    if (this._filterLider !== 'todos') {
      list = list.filter(m => m.lider === this._filterLider);
    }

    if (this._search) {
      const q = this._search.toLowerCase().trim();
      list = list.filter(m => (m.nome || '').toLowerCase().includes(q));
    }

    // Ordenação
    list.sort((a, b) => {
      let valA = a[this._sortCol] || '';
      let valB = b[this._sortCol] || '';
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return this._sortAsc ? -1 : 1;
      if (valA > valB) return this._sortAsc ? 1 : -1;
      return 0;
    });

    return list;
  },

  setSort(col) {
    if (this._sortCol === col) {
      this._sortAsc = !this._sortAsc;
    } else {
      this._sortCol = col;
      this._sortAsc = true;
    }
    this.renderListsLive();
  },

  exportarCSV() {
    const todos = WaveData.getAllMembrosIgreja();
    const filtrados = this.applyAllFilters(todos);

    if (filtrados.length === 0) {
      WaveApp.showToast('Nenhum membro na lista para exportar.', 'danger');
      return;
    }

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Nome;WhatsApp;DataNascimento;Idade;DataIngresso;TipoIngresso;Sexo;Bairro;Cidade;LiderResponsavel;ELider;Status\n';

    filtrados.forEach(m => {
      const row = [
        `"${m.nome || ''}"`,
        `"${m.whatsapp || ''}"`,
        `"${m.dataNascimento || ''}"`,
        `"${WaveData.calcIdade(m.dataNascimento)}"`,
        `"${m.dataIngresso || ''}"`,
        `"${m.tipoIngresso || ''}"`,
        `"${m.sexo || ''}"`,
        `"${m.bairro || ''}"`,
        `"${m.cidade || 'Mandaguari'}"`,
        `"${m.lider || ''}"`,
        `"${m.eLider ? 'Sim' : 'Não'}"`,
        `"${m.status || 'ATIVO'}"`
      ].join(';');
      csvContent += row + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `membros_wave_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    WaveApp.showToast('📊 Relatório CSV exportado com sucesso!', 'success');
  },

  exportarPDF() {
    const todos = WaveData.getAllMembrosIgreja();
    const filtrados = this.applyAllFilters(todos);

    if (filtrados.length === 0) {
      WaveApp.showToast('Nenhum membro na lista para exportar.', 'danger');
      return;
    }

    // Geração de PDF limpo para impressão/download do navegador
    const win = window.open('', '_blank');
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Relatório de Membros — Comunidade Wave</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #111; font-size: 12px; }
          h2 { margin-bottom: 4px; }
          p { margin-top: 0; color: #666; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background: #f4f4f4; font-weight: bold; }
          .badge { padding: 2px 6px; border-radius: 4px; font-size: 10px; }
        </style>
      </head>
      <body>
        <h2>Comunidade Cristã Wave — Relatório de Membros</h2>
        <p>Exportado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')} | Total: ${filtrados.length} membros filtrados</p>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>WhatsApp</th>
              <th>Sexo</th>
              <th>Idade</th>
              <th>Líder Responsável</th>
              <th>Bairro / Cidade</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${filtrados.map(m => `
              <tr>
                <td><strong>${m.nome}</strong> ${m.eLider ? '(Líder)' : ''}</td>
                <td>${m.whatsapp || '—'}</td>
                <td>${m.sexo === 'MASCULINO' ? 'M' : 'F'}</td>
                <td>${WaveData.calcIdade(m.dataNascimento)} anos</td>
                <td>${m.lider || '—'}</td>
                <td>${m.bairro || '—'}, ${m.cidade || 'Mandaguari'}</td>
                <td>${m.status || 'ATIVO'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;
    win.document.write(html);
    win.document.close();
  },

  render() {
    this.initCols();
    const todosMembros = WaveData.getAllMembrosIgreja();
    const membrosFiltrados = this.applyAllFilters(todosMembros);
    const bairrosUnicos = this.getUniqueBairros(todosMembros);
    const cidadesUnicas = this.getUniqueCidades(todosMembros);
    const hojeData = new Date().toISOString().split('T')[0];

    // Paginação
    const totalItems = membrosFiltrados.length;
    const totalPages = Math.ceil(totalItems / this._pageSize) || 1;
    const startIndex = (this._currentPageNum - 1) * this._pageSize;
    const paginatedItems = membrosFiltrados.slice(startIndex, startIndex + this._pageSize);

    return `
      <!-- Header da Página Membros -->
      <section class="page-header animate-in" style="margin-bottom:var(--space-md);position:relative;z-index:20;">
        <div style="min-width:0;">
          <h2 class="page-title">Membros</h2>
        </div>

        <div style="display:flex;gap:var(--space-sm);align-items:center;flex-shrink:0;">
          <!-- Botão Colunas Dinâmicas (Apenas no Desktop) -->
          <div class="desktop-only" style="position:relative;z-index:110;">
            <button class="btn btn-secondary" onclick="WavePages['admin-membros'].toggleColunasDropdown(event)" style="padding:10px 14px;font-size:0.85rem;" title="Selecionar Colunas">
              <i data-lucide="columns-3" style="width:16px;height:16px;"></i> <span>Colunas</span>
            </button>

            ${this._showColunasDropdown ? `
              <div class="card" style="position:absolute;right:0;top:46px;width:210px;z-index:9999;background:var(--bg-elevated);border:1px solid var(--border-medium);border-radius:var(--radius-md);padding:var(--space-sm);display:flex;flex-direction:column;gap:6px;box-shadow:0 12px 36px rgba(0,0,0,0.85);" onclick="event.stopPropagation();">
                <span style="font-size:0.75rem;font-weight:700;color:var(--text-secondary);padding:4px 8px;">Colunas Visíveis</span>
                ${this._availableCols.map(c => `
                  <label style="display:flex;align-items:center;gap:8px;font-size:0.82rem;padding:4px 8px;cursor:${c.required ? 'not-allowed' : 'pointer'};color:${c.required ? 'var(--text-tertiary)' : 'var(--text-primary)'};">
                    <input type="checkbox" ${this.isColVisible(c.key) ? 'checked' : ''} ${c.required ? 'disabled' : ''} onchange="WavePages['admin-membros'].toggleCol('${c.key}')" style="accent-color:var(--white);">
                    ${c.label} ${c.required ? '(Fixo)' : ''}
                  </label>
                `).join('')}
              </div>
            ` : ''}
          </div>

          <!-- Botões de Exportação no Desktop -->
          <button class="btn btn-secondary desktop-only" onclick="WavePages['admin-membros'].exportarCSV()" style="padding:10px 14px;font-size:0.85rem;" title="Exportar CSV">
            <i data-lucide="file-spreadsheet" style="width:16px;height:16px;"></i> <span>CSV</span>
          </button>
          <button class="btn btn-secondary desktop-only" onclick="WavePages['admin-membros'].exportarPDF()" style="padding:10px 14px;font-size:0.85rem;" title="Exportar PDF">
            <i data-lucide="file-text" style="width:16px;height:16px;"></i> <span>PDF</span>
          </button>

          <!-- Novo Membro -->
          <button class="btn btn-primary" onclick="WavePages['admin-membros'].abrirNovoMembroForm()" style="padding:10px 14px;font-size:0.85rem;white-space:nowrap;">
            <i data-lucide="user-plus" style="width:16px;height:16px;"></i> <span class="desktop-only">Novo Membro</span><span class="mobile-only">+ Novo</span>
          </button>
        </div>
      </section>

      <!-- Linha da Busca & Filtro Avançado -->
      <div style="display:flex;gap:var(--space-sm);align-items:center;margin-bottom:var(--space-md);position:relative;z-index:10;" class="animate-in">
        <div class="search-bar" style="flex:1;">
          <i data-lucide="search" class="search-icon"></i>
          <input type="text" placeholder="Buscar por nome do membro..." id="admin-membros-search" value="${this._search}" oninput="WavePages['admin-membros'].onSearchInput(this.value)" autocomplete="off">
        </div>

        <button id="btn-limpar-filtros-membros" class="btn btn-ghost" onclick="WavePages['admin-membros'].limparFiltros()" title="Limpar todos os filtros" style="display:${this.temFiltrosAtivos() ? 'inline-flex' : 'none'};color:var(--danger);white-space:nowrap;height:44px;padding:0 14px;border:1px dashed rgba(239, 68, 68, 0.4);border-radius:var(--radius-md);align-items:center;justify-content:center;gap:6px;background:rgba(239, 68, 68, 0.06);cursor:pointer;flex-shrink:0;">
          <i data-lucide="x" style="width:15px;height:15px;"></i> <span>Limpar</span>
        </button>

        <button class="btn btn-secondary desktop-only" onclick="WavePages['admin-membros'].toggleDrawer()" style="font-size:0.85rem;white-space:nowrap;height:44px;padding:0 18px;display:inline-flex;align-items:center;justify-content:center;gap:8px;position:relative;flex-shrink:0;">
          <i data-lucide="sliders-horizontal" style="width:16px;height:16px;"></i> <span>Filtros</span>
          <span id="dot-filtros-membros-desk" style="display:${this.temFiltrosAtivos() ? 'block' : 'none'};width:7px;height:7px;background:var(--warning);border-radius:50%;position:absolute;top:6px;right:6px;pointer-events:none;"></span>
        </button>

        <button class="btn btn-secondary mobile-only" onclick="WavePages['admin-membros'].toggleDrawer()" title="Filtros" style="width:44px;height:44px;padding:0;display:flex;align-items:center;justify-content:center;flex-shrink:0;position:relative;">
          <i data-lucide="sliders-horizontal" style="width:18px;height:18px;"></i>
          <span id="dot-filtros-membros-mob" style="display:${this.temFiltrosAtivos() ? 'block' : 'none'};width:7px;height:7px;background:var(--warning);border-radius:50%;position:absolute;top:6px;right:6px;pointer-events:none;"></span>
        </button>
      </div>

      <!-- Contador de Resultados & Seletor de Página -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-sm);" class="animate-in">
        <div style="font-size:0.85rem;color:var(--text-tertiary);">
          Mostrando <strong style="color:var(--white);" id="membros-count">${paginatedItems.length}</strong> de <strong style="color:var(--white);">${totalItems}</strong> membro(s)
        </div>

        <div style="display:flex;align-items:center;gap:var(--space-sm);">
          <span style="font-size:0.78rem;color:var(--text-tertiary);">Itens por página:</span>
          <select class="input-field" style="width:75px;height:32px;padding:2px 6px;font-size:0.78rem;" onchange="WavePages['admin-membros'].setPageSize(this.value)">
            <option value="10" ${this._pageSize === 10 ? 'selected' : ''}>10</option>
            <option value="50" ${this._pageSize === 50 ? 'selected' : ''}>50</option>
            <option value="100" ${this._pageSize === 100 ? 'selected' : ''}>100</option>
          </select>
        </div>
      </div>

      <!-- 1) TABELA DESKTOP -->
      <div class="desktop-table-container animate-in">
        <table class="admin-table">
          <thead>
            <tr>
              <th onclick="WavePages['admin-membros'].setSort('nome')" style="cursor:pointer;">
                Nome ${this._sortCol === 'nome' ? (this._sortAsc ? '▲' : '▼') : ''}
              </th>
              ${this.isColVisible('lider') ? `
                <th onclick="WavePages['admin-membros'].setSort('lider')" style="cursor:pointer;">
                  Líder Responsável ${this._sortCol === 'lider' ? (this._sortAsc ? '▲' : '▼') : ''}
                </th>
              ` : ''}
              ${this.isColVisible('whatsapp') ? `<th>WhatsApp</th>` : ''}
              ${this.isColVisible('idade') ? `<th>Idade</th>` : ''}
              ${this.isColVisible('endereco') ? `<th>Bairro / Cidade</th>` : ''}
              ${this.isColVisible('status') ? `<th>Status</th>` : ''}
              <th style="text-align:right;">Ações</th>
            </tr>
          </thead>
          <tbody id="membros-table-body">
            ${this.renderDesktopRows(paginatedItems)}
          </tbody>
        </table>
      </div>

      <!-- Paginação Rodapé -->
      ${totalPages > 1 ? `
        <div style="display:flex;justify-content:center;align-items:center;gap:var(--space-sm);margin-top:var(--space-md);" class="animate-in">
          <button class="btn btn-secondary" onclick="WavePages['admin-membros'].changePage(${this._currentPageNum - 1})" ${this._currentPageNum === 1 ? 'disabled' : ''} style="padding:6px 12px;font-size:0.8rem;">
            Anterior
          </button>
          <span style="font-size:0.82rem;color:var(--text-secondary);">Página ${this._currentPageNum} de ${totalPages}</span>
          <button class="btn btn-secondary" onclick="WavePages['admin-membros'].changePage(${this._currentPageNum + 1})" ${this._currentPageNum === totalPages ? 'disabled' : ''} style="padding:6px 12px;font-size:0.8rem;">
            Próxima
          </button>
        </div>
      ` : ''}

      <!-- 2) LISTA MOBILE -->
      <div id="membros-mobile-list" class="mobile-only animate-in" style="display:flex;flex-direction:column;gap:6px;">
        ${this.renderMobileList(paginatedItems)}
      </div>

      <!-- Drawer Lateral de Filtros -->
      <div class="filtros-drawer-overlay ${this._showFiltrosDrawer ? 'open' : ''}" onclick="WavePages['admin-membros'].toggleDrawer()"></div>
      
      <div class="filtros-drawer ${this._showFiltrosDrawer ? 'open' : ''}">
        <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:var(--space-sm);border-bottom:1px solid var(--border-subtle);">
          <h3 style="font-size:1.1rem;font-weight:800;">Filtros de Membros</h3>
          <button class="sheet-close" onclick="WavePages['admin-membros'].toggleDrawer()">
            <i data-lucide="x" style="width:18px;height:18px;"></i>
          </button>
        </div>

        <div style="display:flex;flex-direction:column;gap:var(--space-md);overflow-y:auto;padding-right:4px;">
          
          <div class="input-group">
            <label class="input-label">Status</label>
            <select class="input-field" onchange="WavePages['admin-membros'].setStatus(this.value)">
              <option value="ATIVO" ${this._filterStatus === 'ATIVO' ? 'selected' : ''}>Apenas Ativos</option>
              <option value="INATIVO" ${this._filterStatus === 'INATIVO' ? 'selected' : ''}>Apenas Inativos</option>
              <option value="todos" ${this._filterStatus === 'todos' ? 'selected' : ''}>Todos os Registros</option>
            </select>
          </div>

          <div class="input-group">
            <label class="input-label">Função (Líder / Discípulo)</label>
            <select class="input-field" onchange="WavePages['admin-membros'].setELider(this.value)">
              <option value="todos" ${this._filterELider === 'todos' ? 'selected' : ''}>Todos</option>
              <option value="sim" ${this._filterELider === 'sim' ? 'selected' : ''}>👑 Apenas Líderes</option>
              <option value="nao" ${this._filterELider === 'nao' ? 'selected' : ''}>Apenas Discípulos</option>
            </select>
          </div>

          <div class="input-group">
            <label class="input-label">Líder Responsável</label>
            <select class="input-field" onchange="WavePages['admin-membros'].setLider(this.value)">
              <option value="todos" ${this._filterLider === 'todos' ? 'selected' : ''}>Todos os Líderes</option>
              ${WaveData.getAllLideresAtivos().map(l => `<option value="${l.nome}" ${this._filterLider === l.nome ? 'selected' : ''}>${l.nome}</option>`).join('')}
            </select>
          </div>

          <div class="input-group">
            <label class="input-label">Gênero</label>
            <select class="input-field" onchange="WavePages['admin-membros'].setSexo(this.value)">
              <option value="todos">Todos</option>
              <option value="MASCULINO" ${this._filterSexo === 'MASCULINO' ? 'selected' : ''}>Masculino</option>
              <option value="FEMININO" ${this._filterSexo === 'FEMININO' ? 'selected' : ''}>Feminino</option>
            </select>
          </div>

          <div class="input-group">
            <label class="input-label">Faixa Etária</label>
            <select class="input-field" onchange="WavePages['admin-membros'].setFaixaEtaria(this.value)">
              <option value="todos">Todas as Faixas</option>
              <option value="kids" ${this._filterFaixaEtaria === 'kids' ? 'selected' : ''}>Kids (0 a 9 anos)</option>
              <option value="teens" ${this._filterFaixaEtaria === 'teens' ? 'selected' : ''}>Teens (10 a 12 anos)</option>
              <option value="adolescente" ${this._filterFaixaEtaria === 'adolescente' ? 'selected' : ''}>Adolescente (13 a 17 anos)</option>
              <option value="jovem_adulto" ${this._filterFaixaEtaria === 'jovem_adulto' ? 'selected' : ''}>Jovem Adulto (18 a 29 anos)</option>
              <option value="adulto" ${this._filterFaixaEtaria === 'adulto' ? 'selected' : ''}>Adulto (30+ anos)</option>
            </select>
          </div>

          <div class="input-group">
            <label class="input-label">Dia da Célula Evangelística</label>
            <select class="input-field" onchange="WavePages['admin-membros'].setDiaCelula(this.value)">
              <option value="todos">Todos os Dias</option>
              <option value="Terça" ${this._filterDiaCelula === 'Terça' ? 'selected' : ''}>Terça-feira</option>
              <option value="Quarta" ${this._filterDiaCelula === 'Quarta' ? 'selected' : ''}>Quarta-feira</option>
              <option value="Quinta" ${this._filterDiaCelula === 'Quinta' ? 'selected' : ''}>Quinta-feira</option>
              <option value="Sexta" ${this._filterDiaCelula === 'Sexta' ? 'selected' : ''}>Sexta-feira</option>
              <option value="Sábado" ${this._filterDiaCelula === 'Sábado' ? 'selected' : ''}>Sábado</option>
              <option value="Domingo" ${this._filterDiaCelula === 'Domingo' ? 'selected' : ''}>Domingo</option>
              <option value="Segunda" ${this._filterDiaCelula === 'Segunda' ? 'selected' : ''}>Segunda-feira</option>
            </select>
          </div>

          <div class="input-group">
            <label class="input-label">Filtrar por Bairro</label>
            <select class="input-field" onchange="WavePages['admin-membros'].setBairro(this.value)">
              <option value="todos">Todos os Bairros</option>
              ${bairrosUnicos.map(b => `<option value="${b}" ${this._filterBairro === b ? 'selected' : ''}>${b}</option>`).join('')}
            </select>
          </div>

          <div class="input-group">
            <label class="input-label">Filtrar por Cidade</label>
            <select class="input-field" onchange="WavePages['admin-membros'].setCidade(this.value)">
              <option value="todos">Todas as Cidades</option>
              ${cidadesUnicas.map(c => `<option value="${c}" ${this._filterCidade === c ? 'selected' : ''}>${c}</option>`).join('')}
            </select>
          </div>

          <!-- Exportar para Mobile dentro do Drawer -->
          <div class="mobile-only" style="display:flex;flex-direction:column;gap:8px;padding-top:var(--space-sm);border-top:1px solid var(--border-subtle);margin-top:4px;">
            <span style="font-size:0.75rem;font-weight:700;color:var(--text-secondary);text-transform:uppercase;">Exportar Dados Filtrados</span>
            <div style="display:flex;gap:8px;">
              <button type="button" class="btn btn-secondary" onclick="WavePages['admin-membros'].exportarCSV()" style="flex:1;padding:8px;font-size:0.8rem;">
                <i data-lucide="file-spreadsheet" style="width:14px;height:14px;"></i> CSV
              </button>
              <button type="button" class="btn btn-secondary" onclick="WavePages['admin-membros'].exportarPDF()" style="flex:1;padding:8px;font-size:0.8rem;">
                <i data-lucide="file-text" style="width:14px;height:14px;"></i> PDF
              </button>
            </div>
          </div>

        </div>

        <div style="display:flex;gap:var(--space-md);margin-top:auto;padding-top:var(--space-md);border-top:1px solid var(--border-subtle);">
          <button class="btn btn-secondary" onclick="WavePages['admin-membros'].limparFiltros()" style="flex:1;">
            Limpar
          </button>
          <button class="btn btn-primary" onclick="WavePages['admin-membros'].toggleDrawer()" style="flex:1;">
            Aplicar
          </button>
        </div>
      </div>

      <!-- Modal: Formulário de Membro (Criar / Editar) -->
      <div class="modal-overlay ${this._showForm ? 'open' : ''}" onclick="WavePages['admin-membros'].closeFormOutside(event)">
        <div class="modal-sheet" style="max-height:88vh;display:flex;flex-direction:column;padding:var(--space-xl) var(--space-xl) var(--space-md) var(--space-xl);">
          <div class="sheet-handle"></div>
          <div class="sheet-header" style="margin-bottom:var(--space-sm);">
            <h3 class="sheet-title">${this._editandoMembro ? 'Editar Membro' : 'Novo Cadastro de Membro'}</h3>
            <button class="sheet-close" onclick="WavePages['admin-membros'].fecharForm()">
              <i data-lucide="x" style="width:18px;height:18px;"></i>
            </button>
          </div>

          <form id="member-main-form" onsubmit="WavePages['admin-membros'].salvarMembroSubmit(event)" style="display:flex;flex-direction:column;flex:1;min-height:0;overflow:hidden;">
            <div style="display:flex;flex-direction:column;gap:var(--space-md);overflow-y:auto;padding-right:6px;flex:1;padding-bottom:var(--space-md);">
              
              <div class="input-group">
                <label class="input-label">Nome Completo *</label>
                <input class="input-field" type="text" name="nome" id="form-membro-nome" value="${this._editandoMembro && this._membroDetalhes ? this._membroDetalhes.nome : ''}" placeholder="Ex: Maria Clara Souza" required>
              </div>

              <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md);">
                <div class="input-group">
                  <label class="input-label">WhatsApp *</label>
                  <input class="input-field tel-mask" type="text" name="whatsapp" value="${this._editandoMembro && this._membroDetalhes ? this._membroDetalhes.whatsapp : ''}" placeholder="(44) 99999-9999" oninput="WavePages['admin-membros'].maskPhone(this)" required>
                </div>
                <div class="input-group">
                  <label class="input-label">Data Nasc. *</label>
                  <input class="input-field" type="date" name="dataNascimento" id="form-membro-nasc" value="${this._editandoMembro && this._membroDetalhes ? this._membroDetalhes.dataNascimento : ''}" required>
                </div>
              </div>

              <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md);">
                <div class="input-group">
                  <label class="input-label">Data Ingresso *</label>
                  <input class="input-field" type="date" name="dataIngresso" value="${this._editandoMembro && this._membroDetalhes ? (this._membroDetalhes.dataIngresso || hojeData) : hojeData}" required>
                </div>
                <div class="input-group">
                  <label class="input-label">Tipo Ingresso *</label>
                  <select class="input-field" name="tipoIngresso" required>
                    <option value="" ${!this._editandoMembro || !this._membroDetalhes || !this._membroDetalhes.tipoIngresso ? 'selected' : ''} disabled>Selecione uma opção</option>
                    <option value="Recepção" ${this._editandoMembro && this._membroDetalhes && this._membroDetalhes.tipoIngresso === 'Recepção' ? 'selected' : ''}>Recepção</option>
                    <option value="Batismo" ${this._editandoMembro && this._membroDetalhes && this._membroDetalhes.tipoIngresso === 'Batismo' ? 'selected' : ''}>Batismo</option>
                  </select>
                </div>
              </div>

              <div class="input-group">
                <label class="input-label">Sexo *</label>
                <select class="input-field" name="sexo" id="form-membro-sexo" onchange="WavePages['admin-membros'].atualizarOpcoesLiderPorSexo(this.value)" required>
                  <option value="" ${!this._editandoMembro || !this._membroDetalhes || !this._membroDetalhes.sexo ? 'selected' : ''} disabled>Selecione uma opção</option>
                  <option value="FEMININO" ${this._editandoMembro && this._membroDetalhes && this._membroDetalhes.sexo === 'FEMININO' ? 'selected' : ''}>Feminino</option>
                  <option value="MASCULINO" ${this._editandoMembro && this._membroDetalhes && this._membroDetalhes.sexo === 'MASCULINO' ? 'selected' : ''}>Masculino</option>
                </select>
              </div>

              <!-- Endereço Residencial -->
              <div style="font-size:0.8rem;font-weight:700;color:var(--text-secondary);margin-top:4px;padding-top:8px;border-top:1px solid var(--border-subtle);">
                ENDEREÇO RESIDENCIAL
              </div>

              <div style="display:grid;grid-template-columns:3fr 1fr;gap:var(--space-md);">
                <div class="input-group">
                  <label class="input-label">Rua / Logradouro</label>
                  <input class="input-field" type="text" name="rua" value="${this._editandoMembro && this._membroDetalhes ? (this._membroDetalhes.rua || '') : ''}" placeholder="Ex: Av. Amazonas">
                </div>
                <div class="input-group">
                  <label class="input-label">Nº</label>
                  <input class="input-field" type="text" name="numero" value="${this._editandoMembro && this._membroDetalhes ? (this._membroDetalhes.numero || '') : ''}" placeholder="123">
                </div>
              </div>

              <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md);">
                <div class="input-group">
                  <label class="input-label">Bairro</label>
                  <input class="input-field" type="text" name="bairro" value="${this._editandoMembro && this._membroDetalhes ? (this._membroDetalhes.bairro || '') : ''}" placeholder="Ex: Centro">
                </div>
                <div class="input-group">
                  <label class="input-label">Cidade</label>
                  <input class="input-field" type="text" name="cidade" value="${this._editandoMembro && this._membroDetalhes ? (this._membroDetalhes.cidade || 'Mandaguari') : 'Mandaguari'}">
                </div>
              </div>

              <div class="input-group">
                <label class="input-label">Complemento</label>
                <input class="input-field" type="text" name="complemento" value="${this._editandoMembro && this._membroDetalhes ? (this._membroDetalhes.complemento || '') : ''}" placeholder="Ex: Apto 12">
              </div>

              <!-- Termo 5: VÍNCULO & LIDERANÇA -->
              <div style="font-size:0.8rem;font-weight:700;color:var(--text-secondary);margin-top:4px;padding-top:8px;border-top:1px solid var(--border-subtle);">
                VÍNCULO & LIDERANÇA
              </div>

              <div class="input-group">
                <label class="input-label">Líder Responsável * (Discipulado por)</label>
                <select class="input-field" name="lider" id="form-lider-select">
                  ${this.renderLideresOptions(this._editandoMembro && this._membroDetalhes ? this._membroDetalhes.sexo : '', this._editandoMembro && this._membroDetalhes ? this._membroDetalhes.lider : '—')}
                </select>
              </div>

              <div class="input-group">
                <label class="input-label">É Líder de Célula? *</label>
                <select class="input-field" name="eLider" id="form-e-lider-select" onchange="WavePages['admin-membros'].toggleLiderCells(this.value)" required>
                  <option value="false" ${this._editandoMembro && this._membroDetalhes && !this._membroDetalhes.eLider ? 'selected' : ''}>Não (Apenas Discípulo)</option>
                  <option value="true" ${this._editandoMembro && this._membroDetalhes && this._membroDetalhes.eLider ? 'selected' : ''}>Sim (Líder de Célula)</option>
                </select>
              </div>

              <!-- Ponto 1: Bloco de Múltiplas Células do Líder -->
              <div id="celulas-container-bloco" style="display:${this._editandoMembro && this._membroDetalhes && this._membroDetalhes.eLider ? 'flex' : 'none'};flex-direction:column;gap:var(--space-md);background:var(--bg-elevated);padding:var(--space-md);border-radius:var(--radius-lg);border:1px solid var(--border-medium);">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <span style="font-size:0.8rem;color:var(--warning);font-weight:700;">👑 Células Lideradas (Múltiplas Células)</span>
                  <button type="button" class="btn btn-secondary" onclick="WavePages['admin-membros'].adicionarCelulaTemp()" style="font-size:0.72rem;padding:4px 8px;">
                    <i data-lucide="plus" style="width:12px;height:12px;"></i> Adicionar outra Célula
                  </button>
                </div>

                <div id="lista-celulas-temp" style="display:flex;flex-direction:column;gap:var(--space-md);">
                  ${this.renderCelulasTempHtml()}
                </div>
              </div>

            </div>

            <!-- Rodapé Fixo com Botão de Salvar -->
            <div style="display:flex;gap:var(--space-md);padding-top:var(--space-md);border-top:1px solid var(--border-subtle);background:var(--bg-card);flex-shrink:0;margin-top:auto;">
              <button type="button" class="btn btn-secondary" onclick="WavePages['admin-membros'].fecharForm()" style="flex:1;">
                Cancelar
              </button>
              <button type="submit" class="btn btn-primary" style="flex:2;">
                <i data-lucide="check" style="width:18px;height:18px;"></i>
                ${this._editandoMembro ? 'Salvar Alterações' : 'Cadastrar Discípulo'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal: Ficha Detalhada do Discípulo / Membro -->
      <div class="modal-overlay ${this._membroDetalhes && !this._showForm ? 'open' : ''}" onclick="WavePages['admin-membros'].fecharDetalhesOutside(event)">
        <div class="modal-sheet" style="max-height:88vh;display:flex;flex-direction:column;padding:var(--space-xl) var(--space-xl) var(--space-md) var(--space-xl);">
          <div class="sheet-handle"></div>
          <div class="sheet-header" style="margin-bottom:var(--space-sm);">
            <h3 class="sheet-title">${this._membroDetalhes && this._membroDetalhes.eLider ? 'Ficha do Membro' : 'Ficha do Discípulo'}</h3>
            <button class="sheet-close" onclick="WavePages['admin-membros'].fecharDetalhes()">
              <i data-lucide="x" style="width:18px;height:18px;"></i>
            </button>
          </div>

          ${this._membroDetalhes ? (() => {
        const m = this._membroDetalhes;
        const idade = WaveData.calcIdade(m.dataNascimento);
        const tempoMembro = WaveData.calcTempoMembro(m.dataIngresso);
        const infoLider = WaveData.calcInfoLideranca(m);

        return `
              <div style="display:flex;flex-direction:column;flex:1;min-height:0;overflow:hidden;">
                <div style="display:flex;flex-direction:column;gap:var(--space-md);overflow-y:auto;padding-right:6px;flex:1;padding-bottom:var(--space-md);">
                  
                  <!-- Hero do Perfil -->
                  <div style="display:flex;align-items:center;gap:var(--space-md);padding-bottom:var(--space-md);border-bottom:1px solid var(--border-subtle);">
                    <div style="width:52px;height:52px;border-radius:var(--radius-full);background:var(--bg-elevated);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1.2rem;color:var(--white);border:2px solid var(--border-medium);flex-shrink:0;">
                      ${m.nome.charAt(0)}
                    </div>
                    <div>
                      <h2 style="font-size:1.2rem;font-weight:800;line-height:1.2;">${m.nome} ${m.eLider ? '<span style="color:var(--warning);font-size:0.75rem;font-weight:700;">👑 (Líder)</span>' : ''}</h2>
                      <span style="font-size:0.8rem;color:var(--text-tertiary);">${m.sexo === 'MASCULINO' ? 'Masculino' : 'Feminino'} · Status: ${(m.status || 'ATIVO') === 'ATIVO' ? '<span style="color:var(--success);">Ativo</span>' : '<span style="color:var(--danger);">Inativo</span>'}</span>
                    </div>
                  </div>

                  <!-- Cards Calculados em Destaque -->
                  <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(130px, 1fr));gap:var(--space-sm);">
                    <div class="card" style="padding:var(--space-md);text-align:center;">
                      <span style="font-size:0.7rem;color:var(--text-tertiary);text-transform:uppercase;font-weight:700;">Idade Atual</span>
                      <div style="font-size:1.2rem;font-weight:800;color:var(--white);">${idade} anos</div>
                    </div>
                    <div class="card" style="padding:var(--space-md);text-align:center;">
                      <span style="font-size:0.7rem;color:var(--text-tertiary);text-transform:uppercase;font-weight:700;">Tempo de Membro</span>
                      <div style="font-size:1rem;font-weight:800;color:var(--white);">${tempoMembro}</div>
                    </div>
                    ${m.eLider && infoLider ? `
                      <div class="card" onclick="WavePages['admin-membros'].navegarParaCelulaDoLider('${m.id}')" style="padding:var(--space-md);text-align:center;border-color:rgba(255,200,0,0.3);cursor:pointer;background:rgba(255,200,0,0.04);transition:transform 0.15s, border-color 0.15s;" title="Clique para abrir a Ficha da Célula deste líder">
                        <span style="font-size:0.7rem;color:var(--warning);text-transform:uppercase;font-weight:700;display:flex;align-items:center;justify-content:center;gap:4px;">
                          <i data-lucide="crown" style="width:12px;height:12px;"></i> Discípulos Liderados
                        </span>
                        <div style="font-size:1.1rem;font-weight:800;color:var(--white);margin:4px 0 2px 0;">${infoLider.totalDiscipulos} discípulo(s)</div>
                        <span style="font-size:0.7rem;color:var(--warning);font-weight:600;display:block;margin-top:2px;">Ver Célula & Discípulos →</span>
                      </div>
                    ` : ''}
                  </div>

                  <!-- Dados Cadastrais -->
                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md);font-size:0.85rem;">
                    <div>
                      <div style="font-size:0.72rem;color:var(--text-tertiary);">WHATSAPP</div>
                      <strong style="color:var(--white);">${m.whatsapp || '—'}</strong>
                    </div>
                    <div>
                      <div style="font-size:0.72rem;color:var(--text-tertiary);">LÍDER RESPONSÁVEL</div>
                      <strong style="color:var(--white);">${m.lider || '—'}</strong>
                    </div>
                    <div>
                      <div style="font-size:0.72rem;color:var(--text-tertiary);">DATA / TIPO DE INGRESSO</div>
                      <strong style="color:var(--white);">${m.dataIngresso || '—'} (${m.tipoIngresso || 'Recepção'})</strong>
                    </div>
                    <div>
                      <div style="font-size:0.72rem;color:var(--text-tertiary);">ENDEREÇO RESIDENCIAL</div>
                      <strong style="color:var(--white);">${m.rua || '—'}, ${m.numero || 's/n'} ${m.complemento ? '(' + m.complemento + ')' : ''}</strong>
                      <div style="font-size:0.75rem;color:var(--text-tertiary);">${m.bairro || '—'} - ${m.cidade || 'Mandaguari'}</div>
                    </div>
                  </div>

                  <!-- Células do Líder (se for líder) -->
                  ${m.eLider && m.celulas && m.celulas.length > 0 ? `
                    <div style="background:var(--bg-elevated);padding:var(--space-md);border-radius:var(--radius-md);border:1px solid var(--border-subtle);">
                      <span style="font-size:0.75rem;color:var(--warning);font-weight:700;display:block;margin-bottom:var(--space-sm);">👑 CÉLULAS SOB SUA LIDERANÇA (${m.celulas.length})</span>
                      <div style="display:flex;flex-direction:column;gap:8px;">
                        ${m.celulas.map((c, i) => `
                          <div style="padding:8px;background:var(--bg-card);border-radius:var(--radius-sm);font-size:0.8rem;border:1px solid var(--border-subtle);">
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;gap:6px;">
                              <strong style="color:var(--white);">Célula ${i + 1} — ${c.finalidade}</strong>
                              <div style="display:flex;gap:4px;flex-wrap:wrap;justify-content:flex-end;">
                                ${WaveData.renderFaixaEtariaBadges(c.faixaEtaria, 'font-size:0.65rem;')}
                              </div>
                            </div>
                            <div style="color:var(--text-secondary);font-size:0.75rem;">
                              📅 <strong>${c.diaSemana}</strong> às <strong>${c.horario}</strong>
                            </div>
                            <div style="color:var(--text-tertiary);font-size:0.72rem;margin-top:2px;">
                              📍 ${c.tipoEndereco === 'outro' ? `${c.rua || ''} ${c.numero || ''}, ${c.bairro || ''} - ${c.cidade || 'Mandaguari'}` : 'Endereço Residencial do Líder'}
                            </div>
                          </div>
                        `).join('')}
                      </div>
                    </div>
                  ` : ''}

                </div>

                <!-- Botões de Ação Fixos no Rodapé -->
                <div style="display:flex;gap:var(--space-md);padding-top:var(--space-md);border-top:1px solid var(--border-subtle);background:var(--bg-card);flex-shrink:0;margin-top:auto;">
                  <button class="btn btn-primary" onclick="WavePages['admin-membros'].abrirEdicaoMembroForm()" style="flex:1;">
                    <i data-lucide="edit-3" style="width:16px;height:16px;"></i> Editar Dados
                  </button>
                  <button class="btn btn-secondary" onclick="WavePages['admin-membros'].fecharDetalhes()" style="flex:1;">
                    Fechar
                  </button>
                </div>
              </div>
            `;
      })() : ''}
        </div>
      </div>

      <!-- Modal de Redistribuição de Discípulos ao Inativar Líder (Ponto 4) -->
      <div class="modal-overlay ${this._membroParaRedistribuir ? 'open' : ''}">
        <div class="modal-sheet">
          <div class="sheet-handle"></div>
          <div class="sheet-header">
            <h3 class="sheet-title" style="color:var(--warning);">👑 Redistribuição de Discípulos</h3>
            <button class="sheet-close" onclick="WavePages['admin-membros']._membroParaRedistribuir = null; WaveApp.renderCurrentPage();">
              <i data-lucide="x" style="width:18px;height:18px;"></i>
            </button>
          </div>

          ${this._membroParaRedistribuir ? (() => {
        const liderInativado = this._membroParaRedistribuir;
        const discipulos = WaveData.getDiscipulosByLider(liderInativado.nome);
        const outrosLideres = WaveData.getAllLideresAtivos().filter(l => l.id !== liderInativado.id && l.sexo === liderInativado.sexo);

        return `
              <div style="display:flex;flex-direction:column;gap:var(--space-md);">
                <p style="font-size:0.88rem;color:var(--text-secondary);">
                  O líder <strong>${liderInativado.nome}</strong> possui <strong style="color:var(--white);">${discipulos.length} discípulo(s)</strong> vinculados a ele.
                  Antes de inativá-lo, todos os seus discípulos (e discípulos-líder) serão reatribuídos para outro líder do mesmo sexo (${liderInativado.sexo === 'MASCULINO' ? 'Masculino' : 'Feminino'}):
                </p>

                <div class="input-group">
                  <label class="input-label">Selecione o Novo Líder Responsável *</label>
                  <select class="input-field" id="select-novo-lider-redistribuir">
                    ${outrosLideres.map(l => `<option value="${l.nome}">${l.nome}</option>`).join('')}
                  </select>
                </div>

                <div style="display:flex;gap:var(--space-md);margin-top:var(--space-md);">
                  <button class="btn btn-secondary" onclick="WavePages['admin-membros']._membroParaRedistribuir = null; WaveApp.renderCurrentPage();" style="flex:1;">
                    Cancelar
                  </button>
                  <button class="btn btn-primary" onclick="WavePages['admin-membros'].confirmarRedistribuicaoEInativar()" style="flex:1;background:var(--warning);color:var(--black);">
                    Reatribuir & Inativar
                  </button>
                </div>
              </div>
            `;
      })() : ''}
        </div>
      </div>

      <!-- Modal de Reativação com Pergunta de Liderança (Ponto 4) -->
      <div class="modal-overlay ${this._membroParaReativar ? 'open' : ''}">
        <div class="modal-sheet">
          <div class="sheet-handle"></div>
          <div class="sheet-header">
            <h3 class="sheet-title">Reativar Discípulo</h3>
            <button class="sheet-close" onclick="WavePages['admin-membros']._membroParaReativar = null; WaveApp.renderCurrentPage();">
              <i data-lucide="x" style="width:18px;height:18px;"></i>
            </button>
          </div>

          ${this._membroParaReativar ? `
            <div style="display:flex;flex-direction:column;gap:var(--space-md);">
              <p style="font-size:0.9rem;color:var(--text-primary);">
                Você está reativando o cadastro de <strong>${this._membroParaReativar.nome}</strong>.
              </p>

              <div class="input-group">
                <label class="input-label">Reativar também como líder de célula? *</label>
                <select class="input-field" id="reativar-como-lider-select">
                  <option value="nao" selected>Não (Reativar como discípulo comum)</option>
                  <option value="sim">Sim (Reativar como líder de célula)</option>
                </select>
              </div>

              <div class="input-group">
                <label class="input-label">Líder Responsável Obrigatório * (Discipulado por)</label>
                <select class="input-field" id="reativar-lider-responsavel-select">
                  ${WaveData.getLideresPorSexo(this._membroParaReativar.sexo).map(l => `<option value="${l.nome}">${l.nome}</option>`).join('')}
                </select>
              </div>

              <div style="display:flex;gap:var(--space-md);margin-top:var(--space-md);">
                <button class="btn btn-secondary" onclick="WavePages['admin-membros']._membroParaReativar = null; WaveApp.renderCurrentPage();" style="flex:1;">
                  Cancelar
                </button>
                <button class="btn btn-primary" onclick="WavePages['admin-membros'].confirmarReativacao()" style="flex:1;">
                  Confirmar Reativação
                </button>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  },

  renderDesktopRows(membros) {
    if (!membros || membros.length === 0) {
      return `<tr><td colspan="7" style="text-align:center;padding:var(--space-2xl);color:var(--text-tertiary);">Nenhum discípulo encontrado com os filtros atuais.</td></tr>`;
    }

    return membros.map(m => {
      const nomeExibicao = this.formatNameWords(m.nome, 3);
      const liderExibicao = this.formatNameWords(m.lider, 2);
      const idade = WaveData.calcIdade(m.dataNascimento);

      return `
        <tr style="cursor:pointer;" onclick="WavePages['admin-membros'].abrirDetalhes('${m.id}')">
          <td>
            <div style="display:flex;align-items:center;gap:10px;">
              <div style="width:34px;height:34px;border-radius:var(--radius-full);background:var(--bg-elevated);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;flex-shrink:0;">
                ${m.nome.charAt(0)}
              </div>
              <div style="min-width:0;">
                <strong style="display:block;font-size:0.85rem;color:var(--white);">${nomeExibicao} ${m.eLider ? '<span style="font-size:0.65rem;color:var(--warning);font-weight:700;">(Líder)</span>' : ''}</strong>
                <span style="font-size:0.72rem;color:var(--text-tertiary);">${m.sexo === 'MASCULINO' ? 'Masculino' : 'Feminino'}</span>
              </div>
            </div>
          </td>

          ${this.isColVisible('lider') ? `
            <td>
              <span style="font-size:0.85rem;font-weight:500;">${liderExibicao}</span>
            </td>
          ` : ''}

          ${this.isColVisible('whatsapp') ? `
            <td>
              <span style="font-size:0.8rem;color:var(--text-secondary);">${m.whatsapp || '—'}</span>
            </td>
          ` : ''}

          ${this.isColVisible('idade') ? `
            <td>
              <span style="font-size:0.8rem;color:var(--text-secondary);">${idade} anos</span>
            </td>
          ` : ''}

          ${this.isColVisible('endereco') ? `
            <td>
              <span style="font-size:0.8rem;color:var(--text-tertiary);">${m.bairro || '—'} / ${m.cidade || 'Mandaguari'}</span>
            </td>
          ` : ''}

          ${this.isColVisible('status') ? `
            <td>
              <span class="${(m.status || 'ATIVO') === 'ATIVO' ? 'status-badge-ativo' : 'status-badge-inativo'}">
                ${(m.status || 'ATIVO') === 'ATIVO' ? 'Ativo' : 'Inativo'}
              </span>
            </td>
          ` : ''}

          <td style="text-align:right;" onclick="event.stopPropagation();">
            <div style="display:inline-flex;gap:4px;align-items:center;justify-content:flex-end;">
              <button class="btn btn-ghost" onclick="WavePages['admin-membros'].abrirDetalhes('${m.id}')" title="Ver Ficha / Detalhes" style="padding:6px;">
                <i data-lucide="file-text" style="width:16px;height:16px;color:var(--text-primary);"></i>
              </button>
              <button class="btn btn-ghost" onclick="WavePages['admin-membros'].abrirEdicaoDireta('${m.id}')" title="Editar Discípulo" style="padding:6px;">
                <i data-lucide="edit-3" style="width:16px;height:16px;color:var(--text-secondary);"></i>
              </button>
              <button class="btn btn-ghost" onclick="WavePages['admin-membros'].toggleStatusMembro('${m.id}')" title="${(m.status || 'ATIVO') === 'ATIVO' ? 'Inativar Cadastro' : 'Reativar Cadastro'}" style="padding:6px;">
                <i data-lucide="power" style="width:16px;height:16px;color:${(m.status || 'ATIVO') === 'ATIVO' ? 'var(--success)' : 'var(--text-tertiary)'};"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  renderMobileList(membros) {
    if (!membros || membros.length === 0) {
      return `
        <div class="card empty-state" style="padding:var(--space-2xl);">
          <i data-lucide="users" style="width:40px;height:40px;color:var(--text-tertiary);"></i>
          <p style="color:var(--text-secondary);margin-top:var(--space-sm);font-size:0.85rem;">Nenhum discípulo encontrado.</p>
        </div>
      `;
    }

    return membros.map(m => {
      const nomeExibicao = this.formatNameWords(m.nome, 3);
      const liderExibicao = this.formatNameWords(m.lider, 2);

      return `
        <div class="card" onclick="WavePages['admin-membros'].abrirDetalhes('${m.id}')" style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border:1px solid var(--border-subtle);gap:10px;cursor:pointer;">
          <div style="display:flex;align-items:center;gap:10px;min-width:0;flex:1;">
            <div style="width:34px;height:34px;border-radius:var(--radius-full);background:var(--bg-elevated);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.75rem;flex-shrink:0;color:var(--white);border:1px solid var(--border-subtle);">
              ${m.nome.charAt(0)}
            </div>
            <div style="min-width:0;flex:1;">
              <div style="display:flex;align-items:center;gap:6px;">
                <strong style="font-size:0.85rem;color:var(--white);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${nomeExibicao}</strong>
                ${m.eLider ? '<span style="font-size:0.6rem;color:var(--warning);font-weight:700;">👑</span>' : ''}
              </div>
              <div style="font-size:0.7rem;color:var(--text-tertiary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                ${m.lider && m.lider !== '—' ? `Líder: ${liderExibicao} · ` : ''}${m.bairro || 'Mandaguari'}
              </div>
            </div>
          </div>

          <div style="display:flex;align-items:center;gap:4px;flex-shrink:0;" onclick="event.stopPropagation();">
            <span class="${(m.status || 'ATIVO') === 'ATIVO' ? 'status-badge-ativo' : 'status-badge-inativo'}" style="font-size:0.65rem;padding:2px 8px;">
              ${(m.status || 'ATIVO') === 'ATIVO' ? 'Ativo' : 'Inativo'}
            </span>
            <button class="btn btn-ghost" onclick="WavePages['admin-membros'].abrirDetalhes('${m.id}')" title="Ver Ficha" style="padding:4px;">
              <i data-lucide="file-text" style="width:15px;height:15px;color:var(--text-primary);"></i>
            </button>
            <button class="btn btn-ghost" onclick="WavePages['admin-membros'].abrirEdicaoDireta('${m.id}')" title="Editar" style="padding:4px;">
              <i data-lucide="edit-3" style="width:15px;height:15px;color:var(--text-secondary);"></i>
            </button>
            <button class="btn btn-ghost" onclick="WavePages['admin-membros'].toggleStatusMembro('${m.id}')" title="Status" style="padding:4px;">
              <i data-lucide="power" style="width:15px;height:15px;color:${(m.status || 'ATIVO') === 'ATIVO' ? 'var(--success)' : 'var(--text-tertiary)'};"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');
  },

  renderLideresOptions(sexoFiltro, liderSelecionado = '—') {
    if (!sexoFiltro || sexoFiltro === '') {
      return `<option value="—" selected disabled>Selecione o sexo do discípulo primeiro</option>`;
    }
    const lideres = WaveData.getLideresPorSexo(sexoFiltro);
    let html = `<option value="—">Selecione o Líder Responsável</option>`;
    lideres.forEach(l => {
      const selected = l.nome === liderSelecionado ? 'selected' : '';
      html += `<option value="${l.nome}" ${selected}>${l.nome}</option>`;
    });
    return html;
  },

  atualizarOpcoesLiderPorSexo(sexo) {
    const select = document.getElementById('form-lider-select');
    if (select) {
      select.innerHTML = this.renderLideresOptions(sexo);
    }
  },

  renderCelulasTempHtml() {
    if (this._tempCelulasForm.length === 0) {
      // Cria uma célula evangelística padrão
      this._tempCelulasForm.push({
        id: 'cel-temp-1',
        finalidade: 'Evangelística',
        faixaEtaria: ['Adulto'],
        diaSemana: 'Quinta',
        horario: '20:00',
        tipoEndereco: 'residencial',
        rua: '',
        numero: '',
        bairro: '',
        cidade: 'Mandaguari',
        complemento: ''
      });
    }

    const opcoesFaixas = ['Kids', 'Teens', 'Adolescente', 'Jovem Adulto', 'Adulto'];

    return this._tempCelulasForm.map((c, idx) => {
      const faixasSel = WaveData.getFaixasArray(c.faixaEtaria);

      return `
        <div style="background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:var(--space-md);display:flex;flex-direction:column;gap:var(--space-sm);">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <strong style="font-size:0.85rem;color:var(--white);">Célula ${idx + 1}</strong>
            ${this._tempCelulasForm.length > 1 ? `
              <button type="button" class="btn btn-ghost" onclick="WavePages['admin-membros'].removerCelulaTemp(${idx})" style="color:var(--danger);padding:2px 6px;font-size:0.75rem;">
                <i data-lucide="trash-2" style="width:14px;height:14px;"></i> Remover
              </button>
            ` : ''}
          </div>

          <div class="input-group">
            <label class="input-label">Finalidade da Célula *</label>
            ${this._editandoMembro && c.id && !c.id.startsWith('cel-temp-') ? `
              <input class="input-field" type="text" value="${c.finalidade}" readonly style="background:var(--bg-input);opacity:0.85;cursor:not-allowed;" title="A finalidade não pode ser alterada após a criação.">
              <span style="font-size:0.65rem;color:var(--text-tertiary);">Imutável após criação</span>
            ` : `
              <select class="input-field" onchange="WavePages['admin-membros']._tempCelulasForm[${idx}].finalidade = this.value" required>
                <option value="Evangelística" ${c.finalidade === 'Evangelística' ? 'selected' : ''}>Evangelística</option>
                <option value="Liderança" ${c.finalidade === 'Liderança' ? 'selected' : ''}>Liderança</option>
              </select>
            `}
          </div>

          <!-- Seleção de Faixa Etária (Permite até 2 tipos) -->
          <div class="input-group">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
              <label class="input-label" style="margin-bottom:0;">Faixa Etária * <span style="font-size:0.72rem;color:var(--text-tertiary);font-weight:normal;">(Selecione até 2)</span></label>
              <span style="font-size:0.75rem;color:var(--warning);font-weight:600;">${WaveData.formatFaixaEtaria(c.faixaEtaria)}</span>
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:6px;">
              ${opcoesFaixas.map(faixa => {
        const isSel = faixasSel.includes(faixa);
        return `
                  <button type="button" 
                    onclick="WavePages['admin-membros'].toggleFaixaEtariaCelula(${idx}, '${faixa}')"
                    class="btn btn-sm ${isSel ? 'btn-primary' : 'btn-secondary'}"
                    style="font-size:0.75rem;padding:4px 10px;border-radius:var(--radius-full);border:1px solid ${isSel ? 'var(--white)' : 'var(--border-subtle)'};cursor:pointer;">
                    ${isSel ? '✓ ' : ''}${faixa}
                  </button>
                `;
      }).join('')}
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md);">
            <div class="input-group">
              <label class="input-label">Dia da Célula *</label>
              <select class="input-field" onchange="WavePages['admin-membros']._tempCelulasForm[${idx}].diaSemana = this.value" required>
                <option value="Quinta" ${c.diaSemana === 'Quinta' ? 'selected' : ''}>Quinta-feira</option>
                <option value="Terça" ${c.diaSemana === 'Terça' ? 'selected' : ''}>Terça-feira</option>
                <option value="Quarta" ${c.diaSemana === 'Quarta' ? 'selected' : ''}>Quarta-feira</option>
                <option value="Sexta" ${c.diaSemana === 'Sexta' ? 'selected' : ''}>Sexta-feira</option>
                <option value="Sábado" ${c.diaSemana === 'Sábado' ? 'selected' : ''}>Sábado</option>
                <option value="Domingo" ${c.diaSemana === 'Domingo' ? 'selected' : ''}>Domingo</option>
                <option value="Segunda" ${c.diaSemana === 'Segunda' ? 'selected' : ''}>Segunda-feira</option>
              </select>
            </div>
            <div class="input-group">
              <label class="input-label">Horário * (HH:mm)</label>
              <input class="input-field" type="text" value="${c.horario || '20:00'}" oninput="WavePages['admin-membros'].maskTime(this, ${idx})" placeholder="20:00" maxlength="5" required>
            </div>
          </div>

          <div class="input-group">
            <label class="input-label">Local / Endereço da Célula *</label>
            <select class="input-field" onchange="WavePages['admin-membros'].toggleTipoEnderecoCelula(${idx}, this.value)">
              <option value="residencial" ${c.tipoEndereco !== 'outro' ? 'selected' : ''}>Usar meu endereço residencial</option>
              <option value="outro" ${c.tipoEndereco === 'outro' ? 'selected' : ''}>Outro endereço</option>
            </select>
          </div>

          <div id="celula-outro-end-${idx}" style="display:${c.tipoEndereco === 'outro' ? 'flex' : 'none'};flex-direction:column;gap:var(--space-sm);padding:8px;background:var(--bg-elevated);border-radius:var(--radius-sm);">
            <div style="display:grid;grid-template-columns:3fr 1fr;gap:var(--space-sm);">
              <input class="input-field" type="text" placeholder="Rua da Célula" value="${c.rua || ''}" oninput="WavePages['admin-membros']._tempCelulasForm[${idx}].rua = this.value">
              <input class="input-field" type="text" placeholder="Nº" value="${c.numero || ''}" oninput="WavePages['admin-membros']._tempCelulasForm[${idx}].numero = this.value">
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-sm);">
              <input class="input-field" type="text" placeholder="Bairro" value="${c.bairro || ''}" oninput="WavePages['admin-membros']._tempCelulasForm[${idx}].bairro = this.value">
              <input class="input-field" type="text" placeholder="Cidade" value="${c.cidade || 'Mandaguari'}" oninput="WavePages['admin-membros']._tempCelulasForm[${idx}].cidade = this.value">
            </div>
            <input class="input-field" type="text" placeholder="Complemento" value="${c.complemento || ''}" oninput="WavePages['admin-membros']._tempCelulasForm[${idx}].complemento = this.value">
          </div>
        </div>
      `;
    }).join('');
  },

  toggleFaixaEtariaCelula(idx, faixa) {
    if (!this._tempCelulasForm[idx]) return;
    const c = this._tempCelulasForm[idx];
    let faixas = WaveData.getFaixasArray(c.faixaEtaria);

    if (faixas.includes(faixa)) {
      if (faixas.length > 1) {
        faixas = faixas.filter(f => f !== faixa);
      } else {
        WaveApp.showToast('Selecione pelo menos 1 faixa etária para a célula.', 'warning');
        return;
      }
    } else {
      if (faixas.length >= 2) {
        faixas.shift(); // Limite máximo de 2 faixas etárias por célula
      }
      faixas.push(faixa);
    }

    c.faixaEtaria = faixas;
    const container = document.getElementById('lista-celulas-temp');
    if (container) {
      container.innerHTML = this.renderCelulasTempHtml();
      if (window.lucide) lucide.createIcons();
    }
  },

  maskTime(input, idx) {
    let v = input.value.replace(/\D/g, '');
    if (v.length > 4) v = v.slice(0, 4);

    if (v.length >= 3) {
      let hh = parseInt(v.slice(0, 2), 10);
      let mm = parseInt(v.slice(2, 4), 10);
      if (hh > 23) hh = 23;
      if (mm > 59) mm = 59;
      let hhStr = String(hh).padStart(2, '0');
      let mmStr = v.slice(2);
      input.value = `${hhStr}:${mmStr}`;
    } else {
      input.value = v;
    }

    if (idx !== undefined && this._tempCelulasForm[idx]) {
      this._tempCelulasForm[idx].horario = input.value;
    }
  },

  adicionarCelulaTemp() {
    this._tempCelulasForm.push({
      id: 'cel-temp-' + Date.now(),
      finalidade: 'Evangelística',
      faixaEtaria: ['Adulto'],
      diaSemana: 'Quinta',
      horario: '20:00',
      tipoEndereco: 'residencial',
      rua: '',
      numero: '',
      bairro: '',
      cidade: 'Mandaguari',
      complemento: ''
    });
    const container = document.getElementById('lista-celulas-temp');
    if (container) {
      container.innerHTML = this.renderCelulasTempHtml();
      if (window.lucide) lucide.createIcons();
    }
  },

  removerCelulaTemp(index) {
    this._tempCelulasForm.splice(index, 1);
    const container = document.getElementById('lista-celulas-temp');
    if (container) {
      container.innerHTML = this.renderCelulasTempHtml();
      if (window.lucide) lucide.createIcons();
    }
  },

  toggleTipoEnderecoCelula(index, val) {
    this._tempCelulasForm[index].tipoEndereco = val;
    const el = document.getElementById(`celula-outro-end-${index}`);
    if (el) {
      el.style.display = val === 'outro' ? 'flex' : 'none';
    }
  },

  toggleLiderCells(val) {
    const el = document.getElementById('celulas-container-bloco');
    if (el) {
      el.style.display = val === 'true' ? 'flex' : 'none';
    }
  },

  toggleColunasDropdown(e) {
    if (e) e.stopPropagation();
    this._showColunasDropdown = !this._showColunasDropdown;
    WaveApp.renderCurrentPage();
  },

  toggleDrawer() {
    this._showFiltrosDrawer = !this._showFiltrosDrawer;
    WaveApp.renderCurrentPage();
  },

  temFiltrosAtivos() {
    return (
      (this._search && this._search.trim() !== '') ||
      this._filterSexo !== 'todos' ||
      this._filterStatus !== 'ATIVO' ||
      this._filterELider !== 'todos' ||
      this._filterLider !== 'todos' ||
      this._filterFaixaEtaria !== 'todos' ||
      this._filterDiaCelula !== 'todos' ||
      this._filterBairro !== 'todos' ||
      this._filterCidade !== 'todos'
    );
  },

  onSearchInput(val) {
    this._search = val;
    this._currentPageNum = 1;
    this.filterLive();
  },

  limparFiltros() {
    this._filterSexo = 'todos';
    this._filterStatus = 'ATIVO';
    this._filterELider = 'todos';
    this._filterLider = 'todos';
    this._filterBairro = 'todos';
    this._filterCidade = 'todos';
    this._filterDiaCelula = 'todos';
    this._filterFaixaEtaria = 'todos';
    this._search = '';
    this._currentPageNum = 1;
    this._showFiltrosDrawer = false;
    WaveApp.renderCurrentPage();
  },

  setPageSize(size) {
    this._pageSize = parseInt(size) || 50;
    this._currentPageNum = 1;
    WaveApp.renderCurrentPage();
  },

  changePage(page) {
    this._currentPageNum = page;
    WaveApp.renderCurrentPage();
  },

  setStatus(val) { this._filterStatus = val; this._currentPageNum = 1; this.filterLive(); },
  setELider(val) { this._filterELider = val; this._currentPageNum = 1; this.filterLive(); },
  setLider(val) { this._filterLider = val; this._currentPageNum = 1; this.filterLive(); },
  setSexo(val) { this._filterSexo = val; this._currentPageNum = 1; this.filterLive(); },
  setFaixaEtaria(val) { this._filterFaixaEtaria = val; this._currentPageNum = 1; this.filterLive(); },
  setDiaCelula(val) { this._filterDiaCelula = val; this._currentPageNum = 1; this.filterLive(); },
  setBairro(val) { this._filterBairro = val; this._currentPageNum = 1; this.filterLive(); },
  setCidade(val) { this._filterCidade = val; this._currentPageNum = 1; this.filterLive(); },

  maskPhone(input) {
    let v = input.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);

    if (v.length > 6) {
      input.value = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
    } else if (v.length > 2) {
      input.value = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    } else if (v.length > 0) {
      input.value = `(${v}`;
    }
  },

  abrirEdicaoDireta(membroId) {
    const m = WaveData.getMembroById(membroId);
    if (m) {
      this._membroDetalhes = m;
      this.abrirEdicaoMembroForm();
    }
  },

  onMount() {
    const input = document.getElementById('admin-membros-search');
    if (input) {
      input.value = this._search;
      input.addEventListener('input', (e) => {
        this._search = e.target.value;
        this._currentPageNum = 1;
        this.filterLive();
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

  limparBusca() {
    this._search = '';
    const input = document.getElementById('admin-membros-search');
    if (input) {
      input.value = '';
      input.focus();
    }
    this.filterLive();
  },

  filterLive() {
    const todosMembros = WaveData.getAllMembrosIgreja();
    const membrosFiltrados = this.applyAllFilters(todosMembros);
    const startIndex = (this._currentPageNum - 1) * this._pageSize;
    const paginatedItems = membrosFiltrados.slice(startIndex, startIndex + this._pageSize);

    const tbody = document.getElementById('membros-table-body');
    const mobileList = document.getElementById('membros-mobile-list');
    const countEl = document.getElementById('membros-count');

    if (tbody) tbody.innerHTML = this.renderDesktopRows(paginatedItems);
    if (mobileList) mobileList.innerHTML = this.renderMobileList(paginatedItems);
    if (countEl) countEl.textContent = paginatedItems.length;

    // Atualização reativa dos botões de Limpar e Indicadores
    const btnLimpar = document.getElementById('btn-limpar-filtros-membros');
    if (btnLimpar) btnLimpar.style.display = this.temFiltrosAtivos() ? 'inline-flex' : 'none';

    const btnClearSearch = document.getElementById('btn-clear-search-membros');
    if (btnClearSearch) btnClearSearch.style.display = this._search ? 'flex' : 'none';

    const dotDesk = document.getElementById('dot-filtros-membros-desk');
    if (dotDesk) dotDesk.style.display = this.temFiltrosAtivos() ? 'block' : 'none';

    const dotMob = document.getElementById('dot-filtros-membros-mob');
    if (dotMob) dotMob.style.display = this.temFiltrosAtivos() ? 'block' : 'none';

    if (window.lucide) lucide.createIcons();
  },

  renderListsLive() {
    this.filterLive();
  },

  abrirNovoMembroForm() {
    this._editandoMembro = false;
    this._membroDetalhes = null;
    this._tempCelulasForm = [];
    this._showForm = true;
    WaveApp.renderCurrentPage();
  },

  abrirEdicaoMembroForm() {
    this._editandoMembro = true;
    this._showForm = true;
    if (this._membroDetalhes && this._membroDetalhes.celulas) {
      this._tempCelulasForm = JSON.parse(JSON.stringify(this._membroDetalhes.celulas));
    } else {
      this._tempCelulasForm = [];
    }
    WaveApp.renderCurrentPage();
  },

  fecharForm() {
    this._showForm = false;
    this._editandoMembro = false;
    this._tempCelulasForm = [];
    WaveApp.renderCurrentPage();
  },

  closeFormOutside(e) {
    if (e.target.classList.contains('modal-overlay')) {
      this.fecharForm();
    }
  },

  abrirDetalhes(membroId) {
    const m = WaveData.getMembroById(membroId);
    if (m) {
      this._membroDetalhes = m;
      this._editandoMembro = false;
      WaveApp.renderCurrentPage();
    }
  },

  fecharDetalhes() {
    this._membroDetalhes = null;
    this._editandoMembro = false;
    WaveApp.renderCurrentPage();
  },

  fecharDetalhesOutside(e) {
    if (e.target.classList.contains('modal-overlay')) {
      this.fecharDetalhes();
    }
  },

  // Melhoria 8: Navegar da Ficha do Membro (Líder) para a Ficha da Célula
  navegarParaCelulaDoLider(liderId) {
    this.fecharDetalhes();
    WaveApp.navigate('admin-lideres');
    setTimeout(() => {
      if (WavePages['admin-lideres'] && WavePages['admin-lideres'].abrirFichaLider) {
        WavePages['admin-lideres'].abrirFichaLider(liderId);
      }
    }, 60);
  },

  async toggleStatusMembro(membroId) {
    const m = WaveData.getMembroById(membroId);
    if (!m) return;

    if (m.status === 'ATIVO') {
      // Inativação
      if (m.eLider) {
        const discipulos = WaveData.getDiscipulosByLider(m.nome);
        if (discipulos.length > 0) {
          // Ponto 4: Exige modal de redistribuição
          this._membroParaRedistribuir = m;
          WaveApp.renderCurrentPage();
          return;
        }
      }

      // Membro sem liderados: modal de confirmação simples
      const confirmar = await WaveApp.confirm(`Deseja inativar o cadastro do discípulo ${m.nome}?`, 'Inativar Discípulo', {
        confirmText: 'Sim, Inativar',
        cancelText: 'Cancelar',
        type: 'danger'
      });
      if (confirmar) {
        await WaveData.inativarMembro(membroId);
        WaveApp.showToast(`O discípulo ${m.nome} foi inativado.`, 'warning');
        WaveApp.renderCurrentPage();
      }
    } else {
      // Reativação: Ponto 4 (Pergunta obrigatória)
      this._membroParaReativar = m;
      WaveApp.renderCurrentPage();
    }
  },

  async confirmarRedistribuicaoEInativar() {
    if (!this._membroParaRedistribuir) return;

    const select = document.getElementById('select-novo-lider-redistribuir');
    const novoLiderNome = select ? select.value : '';

    if (!novoLiderNome) {
      await WaveApp.alert('Selecione um líder válido para redistribuir os discípulos.', 'Seleção Obrigatória', 'warning');
      return;
    }

    const liderInativado = this._membroParaRedistribuir;
    await WaveData.redistribuirDiscipulos(liderInativado.nome, novoLiderNome);
    await WaveData.inativarMembro(liderInativado.id);

    this._membroParaRedistribuir = null;
    WaveApp.showToast(`✅ Discípulos reatribuídos para ${novoLiderNome} e ${liderInativado.nome} inativado com sucesso!`, 'success');
    WaveApp.renderCurrentPage();
  },

  async confirmarReativacao() {
    if (!this._membroParaReativar) return;

    const comoLiderSelect = document.getElementById('reativar-como-lider-select');
    const liderRespSelect = document.getElementById('reativar-lider-responsavel-select');

    const reativarComoLider = comoLiderSelect ? comoLiderSelect.value === 'sim' : false;
    const novoLider = liderRespSelect ? liderRespSelect.value : '—';

    // Se reativar como líder, cria 1 célula evangelística padrão
    const novasCelulas = reativarComoLider ? [{
      id: 'cel-' + Date.now(),
      finalidade: 'Evangelística',
      faixaEtaria: 'Adulto',
      diaSemana: 'Quinta',
      horario: '20:00',
      tipoEndereco: 'residencial'
    }] : [];

    await WaveData.reativarMembro(this._membroParaReativar.id, novoLider, reativarComoLider, novasCelulas);

    const nome = this._membroParaReativar.nome;
    this._membroParaReativar = null;
    WaveApp.showToast(`✅ ${nome} foi reativado(a) com sucesso!`, 'success');
    WaveApp.renderCurrentPage();
  },

  _salvandoMembro: false,

  async salvarMembroSubmit(e) {
    e.preventDefault();
    if (this._salvandoMembro) return;
    this._salvandoMembro = true;

    const form = e.target;
    const submitBtn = form ? form.querySelector('button[type="submit"]') : null;
    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';
      submitBtn.innerHTML = `<span>Salvando no banco...</span>`;
    }

    try {
      const data = new FormData(form);

      const nome = data.get('nome').trim();
      const whatsapp = data.get('whatsapp');
      const dataNascimento = data.get('dataNascimento');
      const dataIngresso = data.get('dataIngresso');
      const tipoIngresso = data.get('tipoIngresso');
      const sexo = data.get('sexo');
      const rua = data.get('rua');
      const numero = data.get('numero');
      const bairro = data.get('bairro');
      const cidade = data.get('cidade') || 'Mandaguari';
      const complemento = data.get('complemento');
      const lider = data.get('lider');
      const eLider = data.get('eLider') === 'true';

      const idAtual = this._editandoMembro && this._membroDetalhes ? this._membroDetalhes.id : null;

      // Ponto 16: Validação de Mesmo Sexo entre Líder e Discípulo
      const validacaoSexo = WaveData.validarMesmoSexo(sexo, lider);
      if (!validacaoSexo.ok) {
        await WaveApp.alert(validacaoSexo.message, 'Inconsistência de Gênero', 'warning');
        return;
      }

      // Ponto 1: Validação de Célula de Liderança caso vire líder
      if (eLider) {
        const validacaoLideranca = WaveData.validarLideradoVirarLider(lider);
        if (!validacaoLideranca.ok) {
          await WaveApp.alert(validacaoLideranca.message, 'Célula de Liderança Obrigatória', 'warning');
          return;
        }
      }

      // Ponto 8: Alerta de Duplicata (Não-Bloqueante)
      if (WaveData.isDuplicado(nome, dataNascimento, idAtual)) {
        const continuar = await WaveApp.confirm(`Já existe um membro cadastrado com o nome "${nome}" e a data de nascimento ${dataNascimento}.\n\nDeseja continuar e salvar mesmo assim?`, 'Possível Duplicidade', {
          confirmText: 'Salvar Mesmo Assim',
          cancelText: 'Revisar Cadastro',
          type: 'warning'
        });
        if (!continuar) return;
      }

      // Ponto 5: Modal de Confirmação ao Trocar Líder de Membro Ativo
      if (this._editandoMembro && this._membroDetalhes && (this._membroDetalhes.status || 'ATIVO') === 'ATIVO') {
        const liderAnterior = this._membroDetalhes.lider || '—';
        if (liderAnterior !== lider && lider !== '—') {
          const confirmarTroca = await WaveApp.confirm(`Você está transferindo ${nome} do líder "${liderAnterior}" para o líder "${lider}".\n\nConfirmar transferência?`, 'Transferência de Líder', {
            confirmText: 'Confirmar Transferência',
            cancelText: 'Cancelar',
            type: 'info'
          });
          if (!confirmarTroca) return;
        }
      }

      const payload = {
        nome,
        whatsapp,
        dataNascimento,
        dataIngresso,
        tipoIngresso,
        sexo,
        rua,
        numero,
        bairro,
        cidade,
        complemento,
        lider,
        eLider,
        celulas: eLider ? this._tempCelulasForm : []
      };

      if (this._editandoMembro && this._membroDetalhes) {
        await WaveData.updateMembro(this._membroDetalhes.id, payload);
        WaveApp.showToast(`✅ Dados de ${nome} atualizados com sucesso!`, 'success');
      } else {
        payload.id = 'm-' + Date.now();
        payload.status = 'ATIVO';
        await WaveData.addMembro(payload);
        WaveApp.showToast(`✅ Discípulo ${nome} cadastrado com sucesso!`, 'success');
      }

      this.fecharForm();
      this.fecharDetalhes();
      WaveApp.renderCurrentPage();
    } finally {
      this._salvandoMembro = false;
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.innerHTML = originalBtnHtml;
      }
    }
  }
};
