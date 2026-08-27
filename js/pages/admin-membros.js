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
  _reativarComoLider: false,
  _reativarFaixasSelecionadas: ['Adulto'],
  _confirmacaoTrocaLider: null,
  _pendingFormState: null, // BUG-02: preserva dados do form durante fluxo auxiliar de célula
  _modalLiderancaData: null, // Modal de criação de célula de liderança do líder

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
        WaveApp.sanitizeCSVCell(m.nome),
        WaveApp.sanitizeCSVCell(m.whatsapp),
        WaveApp.sanitizeCSVCell(m.dataNascimento),
        WaveApp.sanitizeCSVCell(WaveData.calcIdade(m.dataNascimento)),
        WaveApp.sanitizeCSVCell(m.dataIngresso),
        WaveApp.sanitizeCSVCell(m.tipoIngresso),
        WaveApp.sanitizeCSVCell(m.sexo),
        WaveApp.sanitizeCSVCell(m.bairro),
        WaveApp.sanitizeCSVCell(m.cidade || 'Mandaguari'),
        WaveApp.sanitizeCSVCell(m.lider),
        WaveApp.sanitizeCSVCell(m.eLider ? 'Sim' : 'Não'),
        WaveApp.sanitizeCSVCell(m.status || 'ATIVO')
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
      ${(() => {
        const draft = this._pendingFormState ? (this._pendingFormState.formData || {}) : null;
        const isEditing = this._editandoMembro && this._membroDetalhes;
        const valNome = draft ? (draft.nome || '') : (isEditing ? this._membroDetalhes.nome : '');
        const valWhats = draft ? (draft.whatsapp || '') : (isEditing ? this._membroDetalhes.whatsapp : '');
        const valNasc = draft ? (draft.dataNascimento || '') : (isEditing ? this._membroDetalhes.dataNascimento : '');
        const valIngresso = draft ? (draft.dataIngresso || hojeData) : (isEditing ? (this._membroDetalhes.dataIngresso || hojeData) : hojeData);
        const valTipoIngresso = draft ? (draft.tipoIngresso || '') : (isEditing ? this._membroDetalhes.tipoIngresso : '');
        const valSexo = draft ? (draft.sexo || '') : (isEditing ? this._membroDetalhes.sexo : '');
        const valRua = draft ? (draft.rua || '') : (isEditing ? (this._membroDetalhes.rua || '') : '');
        const valNum = draft ? (draft.numero || '') : (isEditing ? (this._membroDetalhes.numero || '') : '');
        const valBairro = draft ? (draft.bairro || '') : (isEditing ? (this._membroDetalhes.bairro || '') : '');
        const valCidade = draft ? (draft.cidade || 'Mandaguari') : (isEditing ? (this._membroDetalhes.cidade || 'Mandaguari') : 'Mandaguari');
        const valCompl = draft ? (draft.complemento || '') : (isEditing ? (this._membroDetalhes.complemento || '') : '');
        const valLider = draft ? (draft.lider || '—') : (isEditing ? this._membroDetalhes.lider : '—');
        const valELider = draft ? (draft.eLider === 'true' || draft.eLider === true) : (isEditing ? this._membroDetalhes.eLider : false);
        const isOpen = this._showForm || !!this._pendingFormState;

        return `
          <div class="modal-overlay ${isOpen ? 'open' : ''}" onclick="WavePages['admin-membros'].closeFormOutside(event)">
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
                  
                  ${this._pendingFormState ? `
                    <div style="background:rgba(34, 197, 94, 0.15);border:1px solid var(--success);color:var(--white);padding:10px 14px;border-radius:var(--radius-md);font-size:0.82rem;display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                      <i data-lucide="check-circle" style="width:18px;height:18px;color:var(--success);flex-shrink:0;"></i>
                      <span><strong>Cadastro Restaurado:</strong> Os dados que você estava preenchendo foram preservados. Selecione o líder regularizado e salve!</span>
                    </div>
                  ` : ''}

                  <div class="input-group">
                    <label class="input-label">Nome Completo *</label>
                    <input class="input-field" type="text" name="nome" id="form-membro-nome" value="${valNome}" placeholder="Ex: Maria Clara Souza" required>
                  </div>

                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md);">
                    <div class="input-group">
                      <label class="input-label">WhatsApp *</label>
                      <input class="input-field tel-mask" type="text" name="whatsapp" value="${valWhats}" placeholder="(44) 99999-9999" oninput="WavePages['admin-membros'].maskPhone(this)" required>
                    </div>
                    <div class="input-group">
                      <label class="input-label">Data Nasc. *</label>
                      <input class="input-field" type="date" name="dataNascimento" id="form-membro-nasc" min="1900-01-01" max="2099-12-31" value="${valNasc}" oninput="WavePages['admin-membros'].validarMaxAnoData(this)" required>
                    </div>
                  </div>

                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md);">
                    <div class="input-group">
                      <label class="input-label">Data Ingresso *</label>
                      <input class="input-field" type="date" name="dataIngresso" min="1900-01-01" max="2099-12-31" value="${valIngresso}" oninput="WavePages['admin-membros'].validarMaxAnoData(this)" required>
                    </div>
                    <div class="input-group">
                      <label class="input-label">Tipo Ingresso *</label>
                      <select class="input-field" name="tipoIngresso" required>
                        <option value="" ${!valTipoIngresso ? 'selected' : ''} disabled>Selecione uma opção</option>
                        <option value="Recepção" ${valTipoIngresso === 'Recepção' ? 'selected' : ''}>Recepção</option>
                        <option value="Batismo" ${valTipoIngresso === 'Batismo' ? 'selected' : ''}>Batismo</option>
                      </select>
                    </div>
                  </div>

                  <div class="input-group">
                    <label class="input-label">Sexo *</label>
                    <select class="input-field" name="sexo" id="form-membro-sexo" onchange="WavePages['admin-membros'].atualizarOpcoesLiderPorSexo(this.value)" required>
                      <option value="" ${!valSexo ? 'selected' : ''} disabled>Selecione uma opção</option>
                      <option value="FEMININO" ${valSexo === 'FEMININO' ? 'selected' : ''}>Feminino</option>
                      <option value="MASCULINO" ${valSexo === 'MASCULINO' ? 'selected' : ''}>Masculino</option>
                    </select>
                  </div>

                  <!-- Endereço Residencial -->
                  <div style="font-size:0.8rem;font-weight:700;color:var(--text-secondary);margin-top:4px;padding-top:8px;border-top:1px solid var(--border-subtle);">
                    ENDEREÇO RESIDENCIAL
                  </div>

                  <div style="display:grid;grid-template-columns:3fr 1fr;gap:var(--space-md);">
                    <div class="input-group">
                      <label class="input-label">Rua / Logradouro</label>
                      <input class="input-field" type="text" name="rua" value="${valRua}" placeholder="Ex: Av. Amazonas">
                    </div>
                    <div class="input-group">
                      <label class="input-label">Nº</label>
                      <input class="input-field" type="text" name="numero" value="${valNum}" placeholder="123">
                    </div>
                  </div>

                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md);">
                    <div class="input-group">
                      <label class="input-label">Bairro</label>
                      <input class="input-field" type="text" name="bairro" value="${valBairro}" placeholder="Ex: Centro">
                    </div>
                    <div class="input-group">
                      <label class="input-label">Cidade</label>
                      <input class="input-field" type="text" name="cidade" value="${valCidade}">
                    </div>
                  </div>

                  <div class="input-group">
                    <label class="input-label">Complemento</label>
                    <input class="input-field" type="text" name="complemento" value="${valCompl}" placeholder="Ex: Apto 12">
                  </div>

                  <!-- Termo 5: VÍNCULO & LIDERANÇA -->
                  <div style="font-size:0.8rem;font-weight:700;color:var(--text-secondary);margin-top:4px;padding-top:8px;border-top:1px solid var(--border-subtle);">
                    VÍNCULO & LIDERANÇA
                  </div>

                  <div class="input-group">
                    <label class="input-label">Líder Responsável * (Discipulado por)</label>
                    <select class="input-field" name="lider" id="form-lider-select" required>
                      ${this.renderLideresOptions(valSexo, valLider)}
                    </select>
                  </div>

                  <div class="input-group">
                    <label class="input-label">É Líder de Célula? *</label>
                    <select class="input-field" name="eLider" id="form-e-lider-select" onchange="WavePages['admin-membros'].toggleLiderCells(this.value)" required>
                      <option value="false" ${!valELider ? 'selected' : ''}>Não (Apenas Discípulo)</option>
                      <option value="true" ${valELider ? 'selected' : ''}>Sim (Líder de Célula)</option>
                    </select>
                  </div>

                  <!-- Ponto 1: Bloco de Múltiplas Células do Líder -->
                  <div id="celulas-container-bloco" style="display:${valELider ? 'flex' : 'none'};flex-direction:column;gap:var(--space-md);background:var(--bg-elevated);padding:var(--space-md);border-radius:var(--radius-lg);border:1px solid var(--border-medium);">
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
        `;
      })()}

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
                              ${c.finalidade !== 'Liderança' ? `
                                <div style="display:flex;gap:4px;flex-wrap:wrap;justify-content:flex-end;">
                                  ${WaveData.renderFaixaEtariaBadges(c.faixaEtaria, 'font-size:0.65rem;')}
                                </div>
                              ` : ''}
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
      <!-- Modal de Redistribuição de Discípulos ao Inativar Líder (BUG-04: Redistribuição Individual) -->
      <div class="modal-overlay ${this._membroParaRedistribuir ? 'open' : ''}">
        <div class="modal-sheet" style="max-height:88vh;display:flex;flex-direction:column;max-width:580px;">
          <div class="sheet-handle"></div>
          <div class="sheet-header" style="margin-bottom:var(--space-sm);">
            <h3 class="sheet-title" style="color:var(--warning);display:flex;align-items:center;gap:6px;">
              👑 Redistribuição de Discípulos
            </h3>
            <button class="sheet-close" onclick="WavePages['admin-membros']._membroParaRedistribuir = null; WaveApp.renderCurrentPage();">
              <i data-lucide="x" style="width:18px;height:18px;"></i>
            </button>
          </div>

          ${this._membroParaRedistribuir ? (() => {
        const liderInativado = this._membroParaRedistribuir;
        const discipulos = WaveData.getDiscipulosByLider(liderInativado.nome);
        const outrosLideres = WaveData.getAllLideresAtivos().filter(l => l.id !== liderInativado.id && l.sexo === liderInativado.sexo);

        return `
              <div style="display:flex;flex-direction:column;gap:var(--space-sm);flex:1;min-height:0;overflow:hidden;">
                <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:2px;">
                  O líder <strong>${liderInativado.nome}</strong> possui <strong style="color:var(--white);">${discipulos.length} discípulo(s)</strong> vinculados a ele.
                  Defina o novo líder responsável para cada um (${liderInativado.sexo === 'MASCULINO' ? 'Líderes Masculinos' : 'Líderes Femininos'}):
                </p>

                <!-- Atalho: Aplicar a todos de uma vez -->
                ${outrosLideres.length > 0 ? `
                  <div style="background:var(--bg-elevated);padding:8px 12px;border-radius:var(--radius-md);border:1px solid var(--border-subtle);display:flex;align-items:center;gap:8px;">
                    <span style="font-size:0.75rem;font-weight:700;color:var(--text-secondary);white-space:nowrap;">Definir para todos:</span>
                    <select class="input-field" style="padding:4px 8px;font-size:0.8rem;flex:1;" onchange="WavePages['admin-membros'].aplicarLiderParaTodos(this.value)">
                      <option value="">-- Escolha para preencher todos --</option>
                      ${outrosLideres.map(l => `<option value="${l.nome}" data-lider-id="${l.id}">${l.nome}</option>`).join('')}
                    </select>
                  </div>
                ` : ''}

                <!-- Lista de Discípulos com Seletor Individual -->
                <div style="flex:1;min-height:0;overflow-y:auto;padding-right:4px;display:flex;flex-direction:column;gap:6px;margin:4px 0;">
                  ${discipulos.map((d, idx) => `
                    <div style="background:var(--bg-card);padding:8px 12px;border-radius:var(--radius-sm);border:1px solid var(--border-subtle);display:flex;align-items:center;justify-content:space-between;gap:10px;">
                      <div style="min-width:0;flex:1;">
                        <div style="display:flex;align-items:center;gap:6px;">
                          <strong style="font-size:0.83rem;color:var(--white);">${idx + 1}. ${d.nome}</strong>
                          ${d.eLider ? '<span style="font-size:0.65rem;color:var(--warning);font-weight:700;">👑 (Líder)</span>' : ''}
                        </div>
                        <span style="font-size:0.72rem;color:var(--text-tertiary);">${d.bairro || 'Mandaguari'} · ${d.sexo === 'MASCULINO' ? 'Masc' : 'Fem'}</span>
                      </div>
                      <div style="flex-shrink:0;min-width:170px;">
                        <select class="input-field select-redistribuir-individual" data-discipulo-id="${d.id}" style="padding:4px 8px;font-size:0.8rem;width:100%;">
                          ${outrosLideres.map(l => `<option value="${l.nome}" data-lider-id="${l.id}">${l.nome}</option>`).join('')}
                        </select>
                      </div>
                    </div>
                  `).join('')}
                </div>

                <div style="display:flex;gap:var(--space-md);padding-top:var(--space-sm);border-top:1px solid var(--border-subtle);margin-top:auto;">
                  <button class="btn btn-secondary" onclick="WavePages['admin-membros']._membroParaRedistribuir = null; WaveApp.renderCurrentPage();" style="flex:1;">
                    Cancelar
                  </button>
                  <button class="btn btn-primary" id="btn-confirmar-redistribuicao" onclick="WavePages['admin-membros'].confirmarRedistribuicaoEInativar()" style="flex:1;background:var(--warning);color:var(--black);font-weight:700;">
                    Reatribuir & Inativar
                  </button>
                </div>
              </div>
            `;
      })() : ''}
        </div>
      </div>

      <!-- Modal de Reativação com Pergunta de Liderança (CT-MEM-09: Nova Célula Obrigatória ao Reativar Líder) -->
      <div class="modal-overlay ${this._membroParaReativar ? 'open' : ''}">
        <div class="modal-sheet" style="max-width:580px;max-height:88vh;display:flex;flex-direction:column;padding:var(--space-xl) var(--space-xl) var(--space-md) var(--space-xl);">
          <div class="sheet-handle"></div>
          <div class="sheet-header">
            <h3 class="sheet-title">Reativar Discípulo</h3>
            <button class="sheet-close" onclick="WavePages['admin-membros']._membroParaReativar = null; WavePages['admin-membros']._reativarComoLider = false; WaveApp.renderCurrentPage();">
              <i data-lucide="x" style="width:18px;height:18px;"></i>
            </button>
          </div>

          ${this._membroParaReativar ? `
            <div style="overflow-y:auto;padding-right:4px;display:flex;flex-direction:column;gap:var(--space-md);">
              <p style="font-size:0.9rem;color:var(--text-primary);margin:0;">
                Você está reativando o cadastro de <strong>${this._membroParaReativar.nome}</strong>.
              </p>

              <div class="input-group">
                <label class="input-label">Reativar também como líder de célula? *</label>
                <select class="input-field" id="reativar-como-lider-select" onchange="WavePages['admin-membros'].onReativarComoLiderChange(this.value)">
                  <option value="nao" ${!this._reativarComoLider ? 'selected' : ''}>Não (Reativar como discípulo comum)</option>
                  <option value="sim" ${this._reativarComoLider ? 'selected' : ''}>Sim (Reativar como líder de célula)</option>
                </select>
              </div>

              <div class="input-group">
                <label class="input-label">Líder Responsável Obrigatório * (Discipulado por)</label>
                <select class="input-field" id="reativar-lider-responsavel-select">
                  ${WaveData.getLideresPorSexo(this._membroParaReativar.sexo).map(l => `<option value="${l.nome}">${l.nome}</option>`).join('')}
                </select>
              </div>

              ${this._reativarComoLider ? `
                <!-- CT-MEM-09: Configuração Obrigatória da Nova Célula Evangelística -->
                <div style="background:var(--bg-elevated);padding:var(--space-md);border-radius:var(--radius-md);border:1px solid var(--border-subtle);display:flex;flex-direction:column;gap:var(--space-sm);">
                  <span style="font-size:0.85rem;font-weight:700;color:var(--white);display:flex;align-items:center;gap:6px;">
                    👑 Nova Célula Evangelística (Obrigatória)
                  </span>
                  <span style="font-size:0.75rem;color:var(--text-tertiary);">
                    Como o membro está voltando a liderar, configure a nova célula ativa (as células antigas não retornam):
                  </span>

                  <!-- Faixa Etária -->
                  <div class="input-group" style="margin-top:4px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                      <label class="input-label" style="margin-bottom:0;">Público / Faixa Etária *</label>
                      <span style="font-size:0.75rem;color:var(--warning);font-weight:600;">${(this._reativarFaixasSelecionadas || []).join(', ')}</span>
                    </div>
                    <div style="display:flex;flex-wrap:wrap;gap:6px;">
                      ${['Kids', 'Teens', 'Adolescente', 'Jovem Adulto', 'Adulto'].map(faixa => {
                        const isSel = (this._reativarFaixasSelecionadas || []).includes(faixa);
                        return `
                          <button type="button" 
                            onclick="WavePages['admin-membros'].toggleFaixaReativacao('${faixa}')"
                            class="btn btn-sm ${isSel ? 'btn-primary' : 'btn-secondary'}"
                            style="font-size:0.75rem;padding:4px 10px;border-radius:var(--radius-full);border:1px solid ${isSel ? 'var(--white)' : 'var(--border-subtle)'};cursor:pointer;">
                            ${isSel ? '✓ ' : ''}${faixa}
                          </button>
                        `;
                      }).join('')}
                    </div>
                  </div>

                  <!-- Dia e Horário -->
                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md);">
                    <div class="input-group">
                      <label class="input-label">Dia da Célula *</label>
                      <select class="input-field" id="reativar-celula-dia">
                        <option value="Quinta" selected>Quinta-feira</option>
                        <option value="Terça">Terça-feira</option>
                        <option value="Quarta">Quarta-feira</option>
                        <option value="Sexta">Sexta-feira</option>
                        <option value="Sábado">Sábado</option>
                        <option value="Domingo">Domingo</option>
                        <option value="Segunda">Segunda-feira</option>
                      </select>
                    </div>
                    <div class="input-group">
                      <label class="input-label">Horário * (HH:mm)</label>
                      <input class="input-field" type="text" id="reativar-celula-horario" value="20:00" placeholder="20:00" maxlength="5">
                    </div>
                  </div>

                  <!-- Tipo de Endereço -->
                  <div class="input-group">
                    <label class="input-label">Endereço da Célula *</label>
                    <select class="input-field" id="reativar-celula-tipo-endereco" onchange="WavePages['admin-membros'].onTipoEnderecoReativacaoChange(this.value)">
                      <option value="residencial" selected>Endereço Residencial do Líder</option>
                      <option value="igreja">Templo / Igreja</option>
                      <option value="outro">Outro Endereço</option>
                    </select>
                  </div>

                  <!-- Campos se for outro endereço -->
                  <div id="reativar-celula-campos-endereco" style="display:none;flex-direction:column;gap:var(--space-sm);">
                    <div style="display:grid;grid-template-columns:2fr 1fr;gap:var(--space-sm);">
                      <div class="input-group">
                        <label class="input-label">Rua / Logradouro *</label>
                        <input class="input-field" type="text" id="reativar-celula-rua" placeholder="Ex: Rua Brasil">
                      </div>
                      <div class="input-group">
                        <label class="input-label">Número *</label>
                        <input class="input-field" type="text" id="reativar-celula-numero" placeholder="123">
                      </div>
                    </div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-sm);">
                      <div class="input-group">
                        <label class="input-label">Bairro *</label>
                        <input class="input-field" type="text" id="reativar-celula-bairro" placeholder="Centro">
                      </div>
                      <div class="input-group">
                        <label class="input-label">Cidade *</label>
                        <input class="input-field" type="text" id="reativar-celula-cidade" value="Mandaguari">
                      </div>
                    </div>
                    <div class="input-group">
                      <label class="input-label">Complemento</label>
                      <input class="input-field" type="text" id="reativar-celula-complemento" placeholder="Apto, Bloco...">
                    </div>
                  </div>
                </div>
              ` : ''}

              <div style="display:flex;gap:var(--space-md);margin-top:var(--space-md);">
                <button class="btn btn-secondary" onclick="WavePages['admin-membros']._membroParaReativar = null; WavePages['admin-membros']._reativarComoLider = false; WaveApp.renderCurrentPage();" style="flex:1;">
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

      <!-- Modal: Cadastro de Célula de Liderança do Líder Responsável -->
      <div class="modal-overlay ${this._modalLiderancaData ? 'open' : ''}" style="z-index: 100000;" onclick="WavePages['admin-membros'].fecharModalLiderancaOutside(event)">
        <div class="modal-sheet" style="max-height:88vh;display:flex;flex-direction:column;max-width:580px;padding:var(--space-xl) var(--space-xl) var(--space-md) var(--space-xl);">
          <div class="sheet-handle"></div>
          <div class="sheet-header" style="margin-bottom:var(--space-sm);">
            <h3 class="sheet-title" style="color:var(--warning);display:flex;align-items:center;gap:6px;">
              👑 Cadastrar Célula de Liderança
            </h3>
            <button class="sheet-close" onclick="WavePages['admin-membros'].cancelarModalLideranca()">
              <i data-lucide="x" style="width:18px;height:18px;"></i>
            </button>
          </div>

          ${this._modalLiderancaData ? (() => {
            const { liderObj, membroDraftPayload } = this._modalLiderancaData;
            return `
              <form onsubmit="WavePages['admin-membros'].salvarModalLiderancaSubmit(event)" style="display:flex;flex-direction:column;flex:1;min-height:0;overflow:hidden;">
                <div style="display:flex;flex-direction:column;gap:var(--space-md);overflow-y:auto;padding-right:6px;flex:1;padding-bottom:var(--space-md);">
                  
                  <div style="background:rgba(234, 179, 8, 0.12);border:1px solid rgba(234, 179, 8, 0.35);color:var(--white);padding:10px 14px;border-radius:var(--radius-md);font-size:0.82rem;display:flex;align-items:flex-start;gap:8px;">
                    <i data-lucide="info" style="width:18px;height:18px;color:var(--warning);flex-shrink:0;margin-top:2px;"></i>
                    <span>Para que <strong>${membroDraftPayload.nome}</strong> seja promovido(a) a Líder, o líder responsável <strong>${liderObj.nome}</strong> precisa ter uma Célula de Liderança cadastrada. Preencha os dados abaixo:</span>
                  </div>

                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md);">
                    <div class="input-group">
                      <label class="input-label">Líder da Célula</label>
                      <input class="input-field" type="text" value="${liderObj.nome}" readonly style="opacity:0.85;background:var(--bg-elevated);cursor:not-allowed;">
                    </div>
                    <div class="input-group">
                      <label class="input-label">Finalidade da Célula</label>
                      <input class="input-field" type="text" value="Liderança" readonly style="opacity:0.85;background:var(--bg-elevated);color:var(--warning);font-weight:700;cursor:not-allowed;">
                    </div>
                  </div>

                  <!-- Dia e Horário -->
                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md);">
                    <div class="input-group">
                      <label class="input-label">Dia do Encontro *</label>
                      <select class="input-field" name="diaSemana" required>
                        <option value="Terça" selected>Terça-feira</option>
                        <option value="Segunda">Segunda-feira</option>
                        <option value="Quarta">Quarta-feira</option>
                        <option value="Quinta">Quinta-feira</option>
                        <option value="Sexta">Sexta-feira</option>
                        <option value="Sábado">Sábado</option>
                        <option value="Domingo">Domingo</option>
                      </select>
                    </div>
                    <div class="input-group">
                      <label class="input-label">Horário *</label>
                      <input class="input-field" type="time" name="horario" value="19:30" required>
                    </div>
                  </div>

                  <!-- Endereço da Célula -->
                  <div style="font-size:0.8rem;font-weight:700;color:var(--text-secondary);margin-top:4px;padding-top:8px;border-top:1px solid var(--border-subtle);">
                    LOCAL / ENDEREÇO DA CÉLULA DE LIDERANÇA
                  </div>

                  <div class="input-group">
                    <label class="input-label">Tipo de Endereço *</label>
                    <select class="input-field" name="tipoEndereco" onchange="WavePages['admin-membros'].onTipoEnderecoLiderancaChange(this.value)" required>
                      <option value="residencial" selected>Endereço Residencial do Líder (${liderObj.nome})</option>
                      <option value="igreja">Igreja Wave (Comunidade Cristã Wave)</option>
                      <option value="outro">Outro Endereço</option>
                    </select>
                  </div>

                  <div id="bloco-endereco-lideranca" style="display:flex;flex-direction:column;gap:var(--space-md);">
                    <div style="display:grid;grid-template-columns:3fr 1fr;gap:var(--space-md);">
                      <div class="input-group">
                        <label class="input-label">Rua / Logradouro</label>
                        <input class="input-field" type="text" name="rua" id="input-lid-rua" value="${liderObj.rua || ''}" placeholder="Ex: Av. Amazonas">
                      </div>
                      <div class="input-group">
                        <label class="input-label">Nº</label>
                        <input class="input-field" type="text" name="numero" id="input-lid-numero" value="${liderObj.numero || ''}" placeholder="123">
                      </div>
                    </div>

                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md);">
                      <div class="input-group">
                        <label class="input-label">Bairro</label>
                        <input class="input-field" type="text" name="bairro" id="input-lid-bairro" value="${liderObj.bairro || ''}" placeholder="Ex: Centro">
                      </div>
                      <div class="input-group">
                        <label class="input-label">Cidade</label>
                        <input class="input-field" type="text" name="cidade" id="input-lid-cidade" value="${liderObj.cidade || 'Mandaguari'}">
                      </div>
                    </div>

                    <div class="input-group">
                      <label class="input-label">Complemento</label>
                      <input class="input-field" type="text" name="complemento" id="input-lid-complemento" value="${liderObj.complemento || ''}" placeholder="Ex: Apto ou Referência">
                    </div>
                  </div>

                </div>

                <div style="display:flex;gap:var(--space-md);padding-top:var(--space-md);border-top:1px solid var(--border-subtle);background:var(--bg-card);flex-shrink:0;margin-top:auto;">
                  <button type="button" class="btn btn-secondary" onclick="WavePages['admin-membros'].cancelarModalLideranca()" style="flex:1;">
                    Voltar
                  </button>
                  <button type="submit" class="btn btn-primary" style="flex:2;">
                    <i data-lucide="check" style="width:18px;height:18px;"></i>
                    Salvar Célula e Concluir
                  </button>
                </div>
              </form>
            `;
          })() : ''}
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
      return `<option value="" selected disabled>Selecione o sexo do discípulo primeiro</option>`;
    }
    const lideres = WaveData.getLideresPorSexo(sexoFiltro);
    if (lideres.length === 0) {
      return `<option value="" selected disabled>Nenhum líder ativo encontrado para este sexo</option>`;
    }
    const isSemLider = !liderSelecionado || liderSelecionado === '—' || liderSelecionado === '';
    let html = `<option value="" disabled ${isSemLider ? 'selected' : ''}>Selecione o Líder Responsável</option>`;
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
              <select class="input-field" onchange="WavePages['admin-membros'].onFinalidadeCelulaChange(${idx}, this.value)" required>
                <option value="Evangelística" ${c.finalidade === 'Evangelística' ? 'selected' : ''}>Evangelística</option>
                <option value="Liderança" ${c.finalidade === 'Liderança' ? 'selected' : ''}>Liderança</option>
              </select>
            `}
          </div>

          ${c.finalidade !== 'Liderança' ? `
            <!-- Seleção de Faixa Etária (apenas para Evangelística) -->
            <div class="input-group">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                <label class="input-label" style="margin-bottom:0;">Faixa Etária *</label>
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
              <div id="aviso-faixa-erro-${idx}" style="display:${this._erroFaixaIdx === idx ? 'flex' : 'none'};align-items:center;gap:6px;margin-top:6px;color:var(--danger);font-size:0.78rem;font-weight:700;background:rgba(239, 68, 68, 0.12);padding:6px 10px;border-radius:var(--radius-sm);border:1px solid var(--danger);">
                <i data-lucide="alert-circle" style="width:15px;height:15px;flex-shrink:0;"></i>
                <span>A célula deve possuir ao menos 1 faixa etária selecionada.</span>
              </div>
            </div>
          ` : ''}

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

  _erroFaixaIdx: null,
  _erroFaixaTimeout: null,

  onFinalidadeCelulaChange(idx, val) {
    if (this._tempCelulasForm[idx]) {
      this._tempCelulasForm[idx].finalidade = val;
      const container = document.getElementById('lista-celulas-temp');
      if (container) {
        container.innerHTML = this.renderCelulasTempHtml();
        if (window.lucide) lucide.createIcons();
      }
    }
  },

  toggleFaixaEtariaCelula(idx, faixa) {
    if (!this._tempCelulasForm[idx]) return;
    const c = this._tempCelulasForm[idx];
    let faixas = WaveData.getFaixasArray(c.faixaEtaria);

    if (faixas.includes(faixa)) {
      if (faixas.length > 1) {
        faixas = faixas.filter(f => f !== faixa);
        this._erroFaixaIdx = null;
        if (this._erroFaixaTimeout) clearTimeout(this._erroFaixaTimeout);
      } else {
        // Usuário tentou remover a única faixa (deixando sem nenhuma)
        this._erroFaixaIdx = idx;
        if (this._erroFaixaTimeout) clearTimeout(this._erroFaixaTimeout);

        const container = document.getElementById('lista-celulas-temp');
        if (container) {
          container.innerHTML = this.renderCelulasTempHtml();
          if (window.lucide) lucide.createIcons();
        }

        WaveApp.showToast('A célula deve possuir ao menos 1 faixa etária selecionada.', 'danger');

        // Some automaticamente após 3.5 segundos
        this._erroFaixaTimeout = setTimeout(() => {
          this._erroFaixaIdx = null;
          const avisoEl = document.getElementById(`aviso-faixa-erro-${idx}`);
          if (avisoEl) avisoEl.style.display = 'none';
        }, 3500);

        return;
      }
    } else {
      faixas.push(faixa);
      this._erroFaixaIdx = null;
      if (this._erroFaixaTimeout) clearTimeout(this._erroFaixaTimeout);
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

  // Máscara fluida de telefone que permite apagar normalmente com Backspace
  maskPhone(input) {
    if (!input) return;
    let v = input.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);

    if (v.length === 0) {
      input.value = '';
      return;
    }

    if (v.length > 10) {
      input.value = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
    } else if (v.length > 6) {
      input.value = `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`;
    } else if (v.length > 2) {
      input.value = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    } else {
      input.value = `(${v}`;
    }
  },

  // Impede que o ano tenha mais de 4 dígitos
  validarMaxAnoData(input) {
    if (!input || !input.value) return;
    const parts = input.value.split('-');
    if (parts.length === 3 && parts[0].length > 4) {
      const ano = parts[0].slice(0, 4);
      input.value = `${ano}-${parts[1]}-${parts[2]}`;
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
    this._erroFaixaIdx = null;
    if (this._erroFaixaTimeout) clearTimeout(this._erroFaixaTimeout);
    this._showForm = true;
    WaveApp.renderCurrentPage();
  },

  restaurarFormPendente() {
    this._erroFaixaIdx = null;
    if (this._erroFaixaTimeout) clearTimeout(this._erroFaixaTimeout);
    this._showForm = true;
    WaveApp.renderCurrentPage();
  },

  abrirEdicaoMembroForm() {
    this._editandoMembro = true;
    this._showForm = true;
    this._erroFaixaIdx = null;
    if (this._erroFaixaTimeout) clearTimeout(this._erroFaixaTimeout);
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
    this._erroFaixaIdx = null;
    if (this._erroFaixaTimeout) clearTimeout(this._erroFaixaTimeout);
    this._pendingFormState = null; // BUG-02: descarta estado pendente ao fechar manualmente
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
        const res = await WaveData.inativarMembro(membroId);
        if (res && res.ok) {
          WaveApp.showToast(`O discípulo ${m.nome} foi inativado.`, 'warning');
          WaveApp.renderCurrentPage();
        } else {
          WaveApp.showToast(`❌ Falha ao inativar ${m.nome}: ${res?.message || 'Erro de persistência remota'}`, 'danger');
        }
      }
    } else {
      // Reativação: Ponto 4 (Pergunta obrigatória)
      this._membroParaReativar = m;
      WaveApp.renderCurrentPage();
    }
  },

  aplicarLiderParaTodos(liderNome) {
    if (!liderNome) return;
    const selects = document.querySelectorAll('.select-redistribuir-individual');
    selects.forEach(sel => {
      sel.value = liderNome;
    });
  },

  async confirmarRedistribuicaoEInativar() {
    if (!this._membroParaRedistribuir) return;

    const selects = document.querySelectorAll('.select-redistribuir-individual');
    const mapa = [];
    let faltou = false;

    selects.forEach(sel => {
      const discipuloId = sel.getAttribute('data-discipulo-id');
      const novoLiderNome = sel.value;
      const opt = sel.options[sel.selectedIndex];
      const novoLiderId = opt ? opt.getAttribute('data-lider-id') : null;

      if (!novoLiderNome || novoLiderNome === '—') {
        faltou = true;
      } else {
        mapa.push({ discipuloId, novoLiderNome, novoLiderId });
      }
    });

    if (faltou || (selects.length > 0 && mapa.length !== selects.length)) {
      await WaveApp.alert('Por favor, selecione um líder de destino para todos os discípulos antes de continuar.', 'Seleção Incompleta', 'warning');
      return;
    }

    const btn = document.getElementById('btn-confirmar-redistribuicao');
    const originalBtnText = btn ? btn.innerHTML : '';
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span>Processando redistribuição...</span>';
    }

    try {
      const liderInativado = this._membroParaRedistribuir;

      if (mapa.length > 0) {
        const resRedist = await WaveData.redistribuirMapaDiscipulos(mapa);
        if (!resRedist || !resRedist.ok) {
          WaveApp.showToast(`❌ Erro na redistribuição: ${resRedist?.message || 'Falha remota'}`, 'danger');
          return;
        }
      }

      const resInat = await WaveData.inativarMembro(liderInativado.id);
      if (!resInat || !resInat.ok) {
        WaveApp.showToast(`❌ Erro ao inativar líder: ${resInat?.message || 'Falha remota'}`, 'danger');
        return;
      }

      const total = mapa.length;
      this._membroParaRedistribuir = null;
      WaveApp.showToast(`✅ ${total} discípulo(s) redistribuídos e ${liderInativado.nome} inativado com sucesso!`, 'success');
      WaveApp.renderCurrentPage();
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalBtnText;
      }
    }
  },

  onReativarComoLiderChange(val) {
    this._reativarComoLider = (val === 'sim');
    if (!this._reativarFaixasSelecionadas || this._reativarFaixasSelecionadas.length === 0) {
      this._reativarFaixasSelecionadas = ['Adulto'];
    }
    WaveApp.renderCurrentPage();
  },

  toggleFaixaReativacao(faixa) {
    if (!this._reativarFaixasSelecionadas) this._reativarFaixasSelecionadas = ['Adulto'];
    if (this._reativarFaixasSelecionadas.includes(faixa)) {
      if (this._reativarFaixasSelecionadas.length > 1) {
        this._reativarFaixasSelecionadas = this._reativarFaixasSelecionadas.filter(f => f !== faixa);
      } else {
        WaveApp.showToast('A célula deve possuir ao menos 1 faixa etária selecionada.', 'warning');
        return;
      }
    } else {
      this._reativarFaixasSelecionadas.push(faixa);
    }
    WaveApp.renderCurrentPage();
  },

  onTipoEnderecoReativacaoChange(val) {
    const container = document.getElementById('reativar-celula-campos-endereco');
    if (container) {
      container.style.display = (val === 'outro') ? 'flex' : 'none';
    }
  },

  async confirmarReativacao() {
    if (!this._membroParaReativar) return;

    const reativarComoLider = this._reativarComoLider;
    const liderRespSelect = document.getElementById('reativar-lider-responsavel-select');
    const novoLider = liderRespSelect ? liderRespSelect.value : '—';

    if (!novoLider || novoLider === '—') {
      await WaveApp.alert('Por favor, selecione um Líder Responsável para o discípulo.', 'Líder Obrigatório', 'warning');
      return;
    }

    let novasCelulas = [];

    if (reativarComoLider) {
      // CT-MEM-09: Validações estritas da nova célula Evangelística
      if (!this._reativarFaixasSelecionadas || this._reativarFaixasSelecionadas.length === 0) {
        await WaveApp.alert('Por favor, selecione ao menos uma Faixa Etária para a nova Célula Evangelística.', 'Faixa Etária Obrigatória', 'warning');
        return;
      }

      const diaEl = document.getElementById('reativar-celula-dia');
      const horarioEl = document.getElementById('reativar-celula-horario');
      const tipoEndEl = document.getElementById('reativar-celula-tipo-endereco');

      const diaSemana = diaEl ? diaEl.value : 'Quinta';
      const horario = horarioEl ? horarioEl.value.trim() : '';
      const tipoEndereco = tipoEndEl ? tipoEndEl.value : 'residencial';

      if (!diaSemana || !horario) {
        await WaveApp.alert('Por favor, defina o Dia do Encontro e o Horário da nova célula.', 'Campos Obrigatórios', 'warning');
        return;
      }

      let rua = '', numero = '', bairro = '', cidade = 'Mandaguari', complemento = '';

      if (tipoEndereco === 'outro') {
        const ruaEl = document.getElementById('reativar-celula-rua');
        const numEl = document.getElementById('reativar-celula-numero');
        const bairroEl = document.getElementById('reativar-celula-bairro');
        const cidadeEl = document.getElementById('reativar-celula-cidade');
        const complEl = document.getElementById('reativar-celula-complemento');

        rua = ruaEl ? ruaEl.value.trim() : '';
        numero = numEl ? numEl.value.trim() : '';
        bairro = bairroEl ? bairroEl.value.trim() : '';
        cidade = cidadeEl ? cidadeEl.value.trim() || 'Mandaguari' : 'Mandaguari';
        complemento = complEl ? complEl.value.trim() : '';

        if (!rua || !numero || !bairro || !cidade) {
          await WaveApp.alert('Por favor, preencha o endereço completo da nova célula (Rua, Número, Bairro e Cidade).', 'Endereço Incompleto', 'warning');
          return;
        }
      } else if (tipoEndereco === 'igreja') {
        rua = 'Comunidade Cristã Wave';
        numero = 's/n';
        bairro = 'Centro';
        cidade = 'Mandaguari';
        complemento = 'Templo Principal';
      } else {
        rua = this._membroParaReativar.rua || '';
        numero = this._membroParaReativar.numero || '';
        bairro = this._membroParaReativar.bairro || '';
        cidade = this._membroParaReativar.cidade || 'Mandaguari';
        complemento = this._membroParaReativar.complemento || '';
      }

      novasCelulas = [{
        id: 'cel-' + Date.now(),
        finalidade: 'Evangelística',
        faixaEtaria: this._reativarFaixasSelecionadas,
        diaSemana,
        horario,
        tipoEndereco,
        rua,
        numero,
        bairro,
        cidade,
        complemento
      }];
    }

    const res = await WaveData.reativarMembro(this._membroParaReativar.id, novoLider, reativarComoLider, novasCelulas);
    if (res && res.ok) {
      const nome = this._membroParaReativar.nome;
      this._membroParaReativar = null;
      this._reativarComoLider = false;
      WaveApp.showToast(`✅ ${nome} foi reativado(a) com sucesso!`, 'success');
      WaveApp.renderCurrentPage();
    } else {
      WaveApp.showToast(`❌ Falha ao reativar: ${res?.message || 'Erro no banco de dados.'}`, 'danger');
    }
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

      // Validação obrigatória de Líder Responsável
      if (!lider || lider === '—' || lider.trim() === '') {
        await WaveApp.alert('É obrigatório selecionar um Líder Responsável para o discípulo.', 'Líder Obrigatório', 'warning');
        return;
      }

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
          const liderObj = WaveData.getMembroByNome(lider);
          const criarCelula = await WaveApp.confirm(
            `O líder responsável "${lider}" ainda não possui uma célula de finalidade "Liderança" cadastrada.\n\nDeseja configurar a célula de Liderança para "${lider}" agora?`,
            'Célula de Liderança Obrigatória',
            { confirmText: 'Configurar Célula Agora', cancelText: 'Corrigir o Líder', type: 'warning' }
          );

          if (criarCelula && liderObj) {
            // Guarda o rascunho completo do membro atual para concluir após preencher a célula de liderança
            this._modalLiderancaData = {
              liderObj,
              membroDraftPayload: {
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
                celulas: eLider ? this._tempCelulasForm : [],
                isEditing: this._editandoMembro,
                membroId: idAtual
              }
            };
            this._showForm = false;
            WaveApp.renderCurrentPage();
            return;
          } else {
            // Permanece no formulário para correção do líder
            return;
          }
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

      // Validação de segurança: se o membro editado possuir discípulos líderes, ele NÃO pode ficar sem Célula de Liderança
      if (this._editandoMembro && this._membroDetalhes) {
        const celulasLidNovas = (eLider ? this._tempCelulasForm : []).filter(c => c.finalidade === 'Liderança');
        const discipulosLideres = WaveData.membros.filter(m => m.lider === this._membroDetalhes.nome && m.eLider && (m.status || 'ATIVO') === 'ATIVO' && m.id !== idAtual);
        if (celulasLidNovas.length === 0 && discipulosLideres.length > 0) {
          const nomes = discipulosLideres.map(d => d.nome).join(', ');
          await WaveApp.alert(
            `"${nome}" não pode ficar sem ao menos 1 Célula de Liderança, pois ele(a) discipula ${discipulosLideres.length} discípulo(s) que lideram células:\n\n• ${nomes}\n\nPara remover a célula de liderança de "${nome}", altere primeiro o líder responsável desses discípulos ou desmarque-os como líderes.`,
            'Célula de Liderança em Uso',
            'warning'
          );
          return;
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
        const res = await WaveData.updateMembro(this._membroDetalhes.id, payload);
        if (!res.ok) {
          WaveApp.showToast(`❌ Falha ao atualizar dados de ${nome}: ${res.message}`, 'danger');
          return;
        }
        WaveApp.showToast(`✅ Dados de ${nome} atualizados com sucesso!`, 'success');
      } else {
        payload.id = 'm-' + Date.now();
        payload.status = 'ATIVO';
        const res = await WaveData.addMembro(payload);
        if (!res.ok) {
          WaveApp.showToast(`❌ Falha ao cadastrar ${nome}: ${res.message}`, 'danger');
          return;
        }
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
  },

  onTipoEnderecoLiderancaChange(val) {
    const inputRua = document.getElementById('input-lid-rua');
    const inputNum = document.getElementById('input-lid-numero');
    const inputBairro = document.getElementById('input-lid-bairro');
    const inputCidade = document.getElementById('input-lid-cidade');
    const inputCompl = document.getElementById('input-lid-complemento');

    if (!this._modalLiderancaData || !this._modalLiderancaData.liderObj) return;
    const lider = this._modalLiderancaData.liderObj;

    if (val === 'residencial') {
      if (inputRua) inputRua.value = lider.rua || '';
      if (inputNum) inputNum.value = lider.numero || '';
      if (inputBairro) inputBairro.value = lider.bairro || '';
      if (inputCidade) inputCidade.value = lider.cidade || 'Mandaguari';
      if (inputCompl) inputCompl.value = lider.complemento || '';
    } else if (val === 'igreja') {
      if (inputRua) inputRua.value = 'Comunidade Cristã Wave';
      if (inputNum) inputNum.value = 's/n';
      if (inputBairro) inputBairro.value = 'Centro';
      if (inputCidade) inputCidade.value = 'Mandaguari';
      if (inputCompl) inputCompl.value = 'Templo Principal';
    } else {
      if (inputRua) inputRua.value = '';
      if (inputNum) inputNum.value = '';
      if (inputBairro) inputBairro.value = '';
      if (inputCidade) inputCidade.value = 'Mandaguari';
      if (inputCompl) inputCompl.value = '';
    }
  },

  cancelarModalLideranca() {
    if (this._modalLiderancaData && this._modalLiderancaData.membroDraftPayload) {
      // Restaura o formulário com os dados preenchidos
      this._pendingFormState = { formData: this._modalLiderancaData.membroDraftPayload };
      this._editandoMembro = !!this._modalLiderancaData.membroDraftPayload.isEditing;
    }
    this._modalLiderancaData = null;
    this._showForm = true;
    WaveApp.renderCurrentPage();
  },

  fecharModalLiderancaOutside(e) {
    if (e.target.classList.contains('modal-overlay')) {
      this.cancelarModalLideranca();
    }
  },

  async salvarModalLiderancaSubmit(e) {
    e.preventDefault();
    if (!this._modalLiderancaData) return;

    const form = e.target;
    const data = new FormData(form);
    const { liderObj, membroDraftPayload } = this._modalLiderancaData;

    const diaSemana = data.get('diaSemana');
    const horario = data.get('horario');
    const tipoEndereco = data.get('tipoEndereco') || 'residencial';
    const rua = (data.get('rua') || '').trim();
    const numero = (data.get('numero') || '').trim();
    const bairro = (data.get('bairro') || '').trim();
    const cidade = (data.get('cidade') || '').trim() || 'Mandaguari';
    const complemento = (data.get('complemento') || '').trim();

    if (!diaSemana || !horario) {
      await WaveApp.alert('Por favor, informe o Dia do Encontro e o Horário da célula.', 'Campos Obrigatórios', 'warning');
      return;
    }

    if (tipoEndereco !== 'igreja' && (!rua || !numero || !bairro || !cidade)) {
      await WaveApp.alert('Por favor, preencha o endereço completo da célula (Rua, Número, Bairro e Cidade).', 'Endereço Incompleto', 'warning');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i data-lucide="loader-2" class="spin" style="width:18px;height:18px;"></i> Salvando...`;
      if (window.lucide) lucide.createIcons();
    }

    try {
      const novaCelulaLideranca = {
        id: 'cel-' + Date.now() + '-lid',
        finalidade: 'Liderança',
        faixaEtaria: [],
        diaSemana,
        horario,
        tipoEndereco,
        rua,
        numero,
        bairro,
        cidade,
        complemento
      };

      const novasCelulasLider = [
        ...(liderObj.celulas || []),
        novaCelulaLideranca
      ];

      const resLider = await WaveData.updateMembro(liderObj.id, {
        celulas: novasCelulasLider
      });

      if (!resLider || !resLider.ok) {
        WaveApp.showToast(`Falha ao criar Célula de Liderança: ${resLider?.message || 'Erro no banco.'}`, 'danger');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<i data-lucide="check" style="width:18px;height:18px;"></i> Salvar Célula e Concluir`;
          if (window.lucide) lucide.createIcons();
        }
        return;
      }

      WaveApp.showToast(`👑 Célula de Liderança criada para ${liderObj.nome}!`, 'success');

      // 2. Agora salva o membro
      const payloadMembro = {
        nome: membroDraftPayload.nome,
        whatsapp: membroDraftPayload.whatsapp,
        dataNascimento: membroDraftPayload.dataNascimento,
        dataIngresso: membroDraftPayload.dataIngresso,
        tipoIngresso: membroDraftPayload.tipoIngresso,
        sexo: membroDraftPayload.sexo,
        rua: membroDraftPayload.rua,
        numero: membroDraftPayload.numero,
        bairro: membroDraftPayload.bairro,
        cidade: membroDraftPayload.cidade,
        complemento: membroDraftPayload.complemento,
        lider: membroDraftPayload.lider,
        eLider: membroDraftPayload.eLider,
        celulas: membroDraftPayload.celulas
      };

      if (membroDraftPayload.isEditing && membroDraftPayload.membroId) {
        const resMembro = await WaveData.updateMembro(membroDraftPayload.membroId, payloadMembro);
        if (!resMembro.ok) {
          WaveApp.showToast(`❌ Falha ao atualizar dados de ${membroDraftPayload.nome}: ${resMembro.message}`, 'danger');
          return;
        }
        WaveApp.showToast(`✅ Dados de ${membroDraftPayload.nome} atualizados com sucesso!`, 'success');
      } else {
        payloadMembro.id = 'm-' + Date.now();
        payloadMembro.status = 'ATIVO';
        const resMembro = await WaveData.addMembro(payloadMembro);
        if (!resMembro.ok) {
          WaveApp.showToast(`❌ Falha ao cadastrar ${membroDraftPayload.nome}: ${resMembro.message}`, 'danger');
          return;
        }
        WaveApp.showToast(`✅ Discípulo ${membroDraftPayload.nome} cadastrado com sucesso!`, 'success');
      }

      this._modalLiderancaData = null;
      this._pendingFormState = null;
      this._showForm = false;
      this._editandoMembro = false;
      this._membroDetalhes = null;
      WaveApp.renderCurrentPage();
    } catch (err) {
      console.error('Erro ao salvar célula de liderança e membro:', err);
      WaveApp.showToast('Erro ao processar salvamento.', 'danger');
    }
  }
};
