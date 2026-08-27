/* ============================================
   WAVE CÉLULAS — Gestão de Células & Líderes
   (Especificação PO v1: Múltiplas Células, Finalidade, Faixa Etária e Sem Botão Novo Líder)
   ============================================ */

window.WavePages = window.WavePages || {};

WavePages['admin-lideres'] = {

  _search: '',
  _filterFinalidade: 'todos',
  _filterFaixaEtaria: 'todos',
  _filterDiaCelula: 'todos',
  _filterBairro: 'todos',
  _filterCidade: 'todos',
  _filterSexo: 'todos',
  _showFiltrosDrawer: false,
  _showColunasDropdown: false,
  _liderSelecionado: null,
  _editandoLider: false,
  _fecharCelulaComRedistribuicao: null, // CT-CEL-02: Modal de redistribuição ao fechar célula com discípulos

  // Colunas disponíveis para seleção dinâmica (Ponto 19)
  _availableCols: [
    { key: 'lider', label: 'Líder da Célula', required: true },
    { key: 'finalidade', label: 'Finalidade' },
    { key: 'faixaEtaria', label: 'Faixa Etária' },
    { key: 'diaHorario', label: 'Dia / Horário' },
    { key: 'discipulos', label: 'Discípulos' },
    { key: 'endereco', label: 'Bairro / Cidade' },
    { key: 'whatsapp', label: 'WhatsApp' }
  ],
  _visibleCols: ['lider', 'finalidade', 'faixaEtaria', 'diaHorario', 'discipulos', 'endereco', 'whatsapp'],

  getColStorageKey() {
    const user = WaveAuth.getUser ? WaveAuth.getUser() : null;
    return 'wave_cols_celulas_' + (user && user.email ? user.email.toLowerCase() : 'default');
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
    if (key === 'lider') return; // Líder sempre fixo
    if (this._visibleCols.includes(key)) {
      this._visibleCols = this._visibleCols.filter(c => c !== key);
    } else {
      this._visibleCols.push(key);
    }
    localStorage.setItem(this.getColStorageKey(), JSON.stringify(this._visibleCols));
    WaveApp.renderCurrentPage();
  },

  isColVisible(key) {
    return this._visibleCols.includes(key);
  },

  toggleColunasDropdown(e) {
    if (e) e.stopPropagation();
    this._showColunasDropdown = !this._showColunasDropdown;
    WaveApp.renderCurrentPage();
  },

  formatNameWords(name, maxWords) {
    if (!name || name === '—') return '—';
    const parts = name.trim().split(/\s+/);
    if (parts.length <= maxWords) return name;
    return parts.slice(0, maxWords).join(' ');
  },

  getAllCelulasFlat() {
    const todosLideres = WaveData.getAllLideresAtivos();
    const list = [];
    todosLideres.forEach(l => {
      const discipulos = WaveData.getDiscipulosByLider(l.nome);
      const celulas = l.celulas || [];
      if (celulas.length === 0) {
        list.push({
          id: 'cel-' + l.id + '-padrao',
          celulaId: null,
          liderId: l.id,
          liderNome: l.nome,
          liderSexo: l.sexo,
          liderWhatsapp: l.whatsapp,
          liderBairro: l.bairro,
          liderCidade: l.cidade,
          finalidade: 'Evangelística',
          faixaEtaria: 'Adulto',
          diaSemana: 'Quinta',
          horario: '20:00',
          tipoEndereco: 'residencial',
          enderecoFormatado: `${l.rua || ''} ${l.numero || 's/n'} (Residencial) - ${l.bairro || 'Centro'}`,
          totalDiscipulos: discipulos.length,
          liderObj: l
        });
      } else {
        celulas.forEach((c, idx) => {
          const endereco = c.tipoEndereco === 'outro'
            ? `${c.rua || ''} ${c.numero || 's/n'}, ${c.bairro || ''} - ${c.cidade || 'Mandaguari'}`
            : `${l.rua || ''} ${l.numero || 's/n'} (Residencial) - ${l.bairro || 'Centro'}`;

          list.push({
            id: c.id || `cel-${l.id}-${idx}`,
            celulaId: c.id,
            liderId: l.id,
            liderNome: l.nome,
            liderSexo: l.sexo,
            liderWhatsapp: l.whatsapp,
            liderBairro: l.bairro,
            liderCidade: l.cidade,
            finalidade: c.finalidade || 'Evangelística',
            faixaEtaria: c.faixaEtaria || 'Adulto',
            diaSemana: c.diaSemana || 'Quinta',
            horario: c.horario || '20:00',
            tipoEndereco: c.tipoEndereco || 'residencial',
            enderecoFormatado: endereco,
            totalDiscipulos: discipulos.length,
            liderObj: l,
            celulaObj: c
          });
        });
      }
    });
    return list;
  },

  getUniqueBairros(celulas) {
    const bairros = celulas.map(c => c.liderBairro || c.bairro).filter(b => b && b.trim() !== '' && b !== '—');
    return [...new Set(bairros)].sort();
  },

  getUniqueCidades(celulas) {
    const cidades = celulas.map(c => c.liderCidade || c.cidade || 'Mandaguari').filter(c => c && c.trim() !== '');
    return [...new Set(cidades)].sort();
  },

  applyAllFilters(celulas) {
    let list = [...celulas];

    if (this._filterFinalidade !== 'todos') {
      list = list.filter(c => c.finalidade === this._filterFinalidade);
    }

    if (this._filterFaixaEtaria !== 'todos') {
      list = list.filter(c => WaveData.celulaContemFaixa(c, this._filterFaixaEtaria));
    }

    if (this._filterDiaCelula !== 'todos') {
      list = list.filter(c => c.diaSemana === this._filterDiaCelula);
    }

    if (this._filterBairro !== 'todos') {
      list = list.filter(c => c.liderBairro === this._filterBairro || c.bairro === this._filterBairro);
    }

    if (this._filterCidade !== 'todos') {
      list = list.filter(c => (c.liderCidade || c.cidade || 'Mandaguari') === this._filterCidade);
    }

    if (this._filterSexo !== 'todos') {
      list = list.filter(c => c.liderSexo === this._filterSexo);
    }

    if (this._search) {
      const q = this._search.toLowerCase().trim();
      list = list.filter(c => {
        const faixaStr = WaveData.formatFaixaEtaria(c.faixaEtaria).toLowerCase();
        const nomeStr = (c.liderNome || '').toLowerCase();
        const bairroStr = (c.liderBairro || c.bairro || '').toLowerCase();
        const cidadeStr = (c.liderCidade || c.cidade || '').toLowerCase();
        const diaStr = (c.diaSemana || '').toLowerCase();
        const finStr = (c.finalidade || '').toLowerCase();
        const endStr = (c.enderecoFormatado || '').toLowerCase();

        return nomeStr.includes(q) ||
          bairroStr.includes(q) ||
          cidadeStr.includes(q) ||
          diaStr.includes(q) ||
          finStr.includes(q) ||
          faixaStr.includes(q) ||
          endStr.includes(q);
      });
    }

    return list;
  },

  exportarCSV() {
    const todasCelulas = this.getAllCelulasFlat();
    const filtradas = this.applyAllFilters(todasCelulas);

    if (filtradas.length === 0) {
      WaveApp.showToast('Nenhuma célula para exportar.', 'danger');
      return;
    }

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Lider;Sexo;WhatsApp;Finalidade;FaixaEtaria;DiaCelula;Horario;Discipulos;Endereco\n';

    filtradas.forEach(c => {
      const row = [
        WaveApp.sanitizeCSVCell(c.liderNome),
        WaveApp.sanitizeCSVCell(c.liderSexo),
        WaveApp.sanitizeCSVCell(c.liderWhatsapp),
        WaveApp.sanitizeCSVCell(c.finalidade),
        WaveApp.sanitizeCSVCell(c.faixaEtaria),
        WaveApp.sanitizeCSVCell(c.diaSemana),
        WaveApp.sanitizeCSVCell(c.horario),
        WaveApp.sanitizeCSVCell(c.totalDiscipulos),
        WaveApp.sanitizeCSVCell(c.enderecoFormatado)
      ].join(';');
      csvContent += row + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `celulas_wave_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    WaveApp.showToast('📊 Relatório de Células exportado com sucesso!', 'success');
  },

  exportarPDF() {
    const todasCelulas = this.getAllCelulasFlat();
    const filtradas = this.applyAllFilters(todasCelulas);

    if (filtradas.length === 0) {
      WaveApp.showToast('Nenhuma célula para exportar.', 'danger');
      return;
    }

    const win = window.open('', '_blank');
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Relatório de Células — Comunidade Wave</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #111; font-size: 12px; }
          h2 { margin-bottom: 4px; }
          p { margin-top: 0; color: #666; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background: #f4f4f4; font-weight: bold; }
        </style>
      </head>
      <body>
        <h2>Comunidade Cristã Wave — Relatório de Células</h2>
        <p>Exportado em ${new Date().toLocaleDateString('pt-BR')} | Total: ${filtradas.length} célula(s) filtrada(s)</p>
        <table>
          <thead>
            <tr>
              <th>Líder</th>
              <th>WhatsApp</th>
              <th>Finalidade</th>
              <th>Faixa Etária</th>
              <th>Dia / Horário</th>
              <th>Discípulos</th>
              <th>Localidade</th>
            </tr>
          </thead>
          <tbody>
            ${filtradas.map(c => `
              <tr>
                <td><strong>${c.liderNome}</strong></td>
                <td>${c.liderWhatsapp || '—'}</td>
                <td>${c.finalidade}</td>
                <td>${c.faixaEtaria}</td>
                <td>${c.diaSemana} às ${c.horario}</td>
                <td>${c.totalDiscipulos} discípulo(s)</td>
                <td>${c.enderecoFormatado}</td>
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
    const todasCelulas = this.getAllCelulasFlat();
    const celulasFiltradas = this.applyAllFilters(todasCelulas);
    const bairrosUnicos = this.getUniqueBairros(todasCelulas);
    const cidadesUnicas = this.getUniqueCidades(todasCelulas);

    return `
      <!-- Header da Página Células & Líderes (Sem botão Novo Líder - Ponto 9) -->
      <section class="page-header animate-in" style="margin-bottom:var(--space-md);">
        <div>
          <h2 class="page-title">Células & Líderes</h2>
        </div>

        <div style="display:flex;gap:var(--space-sm);align-items:center;">
          <!-- Botão Colunas com Dropdown (Ponto 19) -->
          <div style="position:relative;" class="desktop-only">
            <button class="btn btn-secondary" onclick="WavePages['admin-lideres'].toggleColunasDropdown(event)" style="padding:10px 14px;font-size:0.85rem;" title="Configurar Colunas">
              <i data-lucide="columns-3" style="width:16px;height:16px;"></i> <span>Colunas</span>
            </button>

            ${this._showColunasDropdown ? `
              <div class="card" style="position:absolute;right:0;top:46px;width:210px;z-index:9999;background:var(--bg-elevated);border:1px solid var(--border-medium);border-radius:var(--radius-md);padding:var(--space-sm);display:flex;flex-direction:column;gap:6px;box-shadow:0 12px 36px rgba(0,0,0,0.85);" onclick="event.stopPropagation();">
                <span style="font-size:0.75rem;font-weight:700;color:var(--text-secondary);padding:4px 8px;">Colunas Visíveis</span>
                ${this._availableCols.map(c => `
                  <label style="display:flex;align-items:center;gap:8px;font-size:0.82rem;padding:4px 8px;cursor:${c.required ? 'not-allowed' : 'pointer'};color:${c.required ? 'var(--text-tertiary)' : 'var(--text-primary)'};">
                    <input type="checkbox" ${this.isColVisible(c.key) ? 'checked' : ''} ${c.required ? 'disabled' : ''} onchange="WavePages['admin-lideres'].toggleCol('${c.key}')" style="accent-color:var(--white);">
                    ${c.label} ${c.required ? '(Fixo)' : ''}
                  </label>
                `).join('')}
              </div>
            ` : ''}
          </div>

          <button class="btn btn-secondary desktop-only" onclick="WavePages['admin-lideres'].exportarCSV()" style="padding:10px 14px;font-size:0.85rem;" title="Exportar CSV">
            <i data-lucide="file-spreadsheet" style="width:16px;height:16px;"></i> <span>CSV</span>
          </button>
          <button class="btn btn-secondary desktop-only" onclick="WavePages['admin-lideres'].exportarPDF()" style="padding:10px 14px;font-size:0.85rem;" title="Exportar PDF">
            <i data-lucide="file-text" style="width:16px;height:16px;"></i> <span>PDF</span>
          </button>
        </div>
      </section>

      <!-- Linha da Busca & Filtro Avançado -->
      <div style="display:flex;gap:var(--space-sm);align-items:center;margin-bottom:var(--space-md);" class="animate-in">
        <div class="search-bar" style="flex:1;">
          <i data-lucide="search" class="search-icon"></i>
          <input type="text" placeholder="Buscar por líder, dia, bairro, faixa etária..." id="admin-lideres-search" value="${this._search}" oninput="WavePages['admin-lideres'].onSearchInput(this.value)" autocomplete="off">
        </div>

        <button id="btn-limpar-filtros-lideres" class="btn btn-ghost" onclick="WavePages['admin-lideres'].limparFiltros()" title="Limpar todos os filtros" style="display:${this.temFiltrosAtivos() ? 'inline-flex' : 'none'};color:var(--danger);white-space:nowrap;height:44px;padding:0 14px;border:1px dashed rgba(239, 68, 68, 0.4);border-radius:var(--radius-md);align-items:center;justify-content:center;gap:6px;background:rgba(239, 68, 68, 0.06);cursor:pointer;flex-shrink:0;">
          <i data-lucide="x" style="width:15px;height:15px;"></i> <span>Limpar</span>
        </button>

        <button class="btn btn-secondary desktop-only" onclick="WavePages['admin-lideres'].toggleDrawer()" style="font-size:0.85rem;white-space:nowrap;height:44px;padding:0 18px;display:inline-flex;align-items:center;justify-content:center;gap:8px;position:relative;flex-shrink:0;">
          <i data-lucide="sliders-horizontal" style="width:16px;height:16px;"></i> <span>Filtros</span>
          <span id="dot-filtros-lideres-desk" style="display:${this.temFiltrosAtivos() ? 'block' : 'none'};width:7px;height:7px;background:var(--warning);border-radius:50%;position:absolute;top:6px;right:6px;pointer-events:none;"></span>
        </button>

        <button class="btn btn-secondary mobile-only" onclick="WavePages['admin-lideres'].toggleDrawer()" title="Filtros" style="width:44px;height:44px;padding:0;display:flex;align-items:center;justify-content:center;flex-shrink:0;position:relative;">
          <i data-lucide="sliders-horizontal" style="width:18px;height:18px;"></i>
          <span id="dot-filtros-lideres-mob" style="display:${this.temFiltrosAtivos() ? 'block' : 'none'};width:7px;height:7px;background:var(--warning);border-radius:50%;position:absolute;top:6px;right:6px;pointer-events:none;"></span>
        </button>
      </div>

      <!-- Contador de Células Encontradas (Ponto 1 / v1.2) -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-md);" class="animate-in">
        <div style="font-size:0.85rem;color:var(--text-tertiary);">
          Exibindo <strong style="color:var(--white);" id="lideres-count">${celulasFiltradas.length}</strong> célula(s) ativa(s)
        </div>
      </div>

      <!-- 1) GRID COMPLETO DESKTOP (1 card por célula) -->
      <div id="lideres-desktop-grid" class="desktop-only celulas-grid-2 animate-in" style="margin-bottom:var(--space-xl);">
        ${this.renderDesktopCards(celulasFiltradas)}
      </div>

      <!-- 2) LISTA MOBILE (1 card por célula) -->
      <div id="lideres-mobile-list" class="mobile-only animate-in" style="display:flex;flex-direction:column;gap:8px;">
        ${this.renderMobileCards(celulasFiltradas)}
      </div>

      <!-- Drawer Lateral de Filtros das Células (Termo 1 / Termo 8) -->
      <div class="filtros-drawer-overlay ${this._showFiltrosDrawer ? 'open' : ''}" onclick="WavePages['admin-lideres'].toggleDrawer()"></div>
      
      <div class="filtros-drawer ${this._showFiltrosDrawer ? 'open' : ''}">
        <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:var(--space-sm);border-bottom:1px solid var(--border-subtle);">
          <h3 style="font-size:1.1rem;font-weight:800;">Filtros de Células</h3>
          <button class="sheet-close" onclick="WavePages['admin-lideres'].toggleDrawer()">
            <i data-lucide="x" style="width:18px;height:18px;"></i>
          </button>
        </div>

        <div style="display:flex;flex-direction:column;gap:var(--space-md);overflow-y:auto;padding-right:4px;">
          
          <div class="input-group">
            <label class="input-label">Finalidade da Célula</label>
            <select class="input-field" onchange="WavePages['admin-lideres'].setFinalidade(this.value)">
              <option value="todos" ${this._filterFinalidade === 'todos' ? 'selected' : ''}>Todas as Finalidades</option>
              <option value="Evangelística" ${this._filterFinalidade === 'Evangelística' ? 'selected' : ''}>Evangelística</option>
              <option value="Liderança" ${this._filterFinalidade === 'Liderança' ? 'selected' : ''}>Liderança</option>
            </select>
          </div>

          <div class="input-group">
            <label class="input-label">Faixa Etária</label>
            <select class="input-field" onchange="WavePages['admin-lideres'].setFaixaEtaria(this.value)">
              <option value="todos" ${this._filterFaixaEtaria === 'todos' ? 'selected' : ''}>Todas as Faixas</option>
              <option value="Kids" ${this._filterFaixaEtaria === 'Kids' ? 'selected' : ''}>Kids (0 a 9 anos)</option>
              <option value="Teens" ${this._filterFaixaEtaria === 'Teens' ? 'selected' : ''}>Teens (10 a 12 anos)</option>
              <option value="Adolescente" ${this._filterFaixaEtaria === 'Adolescente' ? 'selected' : ''}>Adolescente (13 a 17 anos)</option>
              <option value="Jovem Adulto" ${this._filterFaixaEtaria === 'Jovem Adulto' ? 'selected' : ''}>Jovem Adulto (18 a 29 anos)</option>
              <option value="Adulto" ${this._filterFaixaEtaria === 'Adulto' ? 'selected' : ''}>Adulto (30+ anos)</option>
            </select>
          </div>

          <div class="input-group">
            <label class="input-label">Dia da Célula</label>
            <select class="input-field" onchange="WavePages['admin-lideres'].setDiaCelula(this.value)">
              <option value="todos" ${this._filterDiaCelula === 'todos' ? 'selected' : ''}>Todos os Dias</option>
              <option value="Quinta" ${this._filterDiaCelula === 'Quinta' ? 'selected' : ''}>Quinta-feira</option>
              <option value="Terça" ${this._filterDiaCelula === 'Terça' ? 'selected' : ''}>Terça-feira</option>
              <option value="Quarta" ${this._filterDiaCelula === 'Quarta' ? 'selected' : ''}>Quarta-feira</option>
              <option value="Sexta" ${this._filterDiaCelula === 'Sexta' ? 'selected' : ''}>Sexta-feira</option>
              <option value="Sábado" ${this._filterDiaCelula === 'Sábado' ? 'selected' : ''}>Sábado</option>
              <option value="Domingo" ${this._filterDiaCelula === 'Domingo' ? 'selected' : ''}>Domingo</option>
              <option value="Segunda" ${this._filterDiaCelula === 'Segunda' ? 'selected' : ''}>Segunda-feira</option>
            </select>
          </div>

          <div class="input-group">
            <label class="input-label">Gênero do Líder</label>
            <select class="input-field" onchange="WavePages['admin-lideres'].setSexo(this.value)">
              <option value="todos" ${this._filterSexo === 'todos' ? 'selected' : ''}>Todos</option>
              <option value="MASCULINO" ${this._filterSexo === 'MASCULINO' ? 'selected' : ''}>Masculino</option>
              <option value="FEMININO" ${this._filterSexo === 'FEMININO' ? 'selected' : ''}>Feminino</option>
            </select>
          </div>

          <div class="input-group">
            <label class="input-label">Filtrar por Bairro</label>
            <select class="input-field" onchange="WavePages['admin-lideres'].setBairro(this.value)">
              <option value="todos">Todos os Bairros</option>
              ${bairrosUnicos.map(b => `<option value="${b}" ${this._filterBairro === b ? 'selected' : ''}>${b}</option>`).join('')}
            </select>
          </div>

          <div class="input-group">
            <label class="input-label">Filtrar por Cidade</label>
            <select class="input-field" onchange="WavePages['admin-lideres'].setCidade(this.value)">
              <option value="todos">Todas as Cidades</option>
              ${cidadesUnicas.map(c => `<option value="${c}" ${this._filterCidade === c ? 'selected' : ''}>${c}</option>`).join('')}
            </select>
          </div>

          <!-- Exportar para Mobile dentro do Drawer -->
          <div class="mobile-only" style="display:flex;flex-direction:column;gap:8px;padding-top:var(--space-sm);border-top:1px solid var(--border-subtle);margin-top:4px;">
            <span style="font-size:0.75rem;font-weight:700;color:var(--text-secondary);text-transform:uppercase;">Exportar Dados Filtrados</span>
            <div style="display:flex;gap:8px;">
              <button type="button" class="btn btn-secondary" onclick="WavePages['admin-lideres'].exportarCSV()" style="flex:1;padding:8px;font-size:0.8rem;">
                <i data-lucide="file-spreadsheet" style="width:14px;height:14px;"></i> CSV
              </button>
              <button type="button" class="btn btn-secondary" onclick="WavePages['admin-lideres'].exportarPDF()" style="flex:1;padding:8px;font-size:0.8rem;">
                <i data-lucide="file-text" style="width:14px;height:14px;"></i> PDF
              </button>
            </div>
          </div>

        </div>

        <div style="display:flex;gap:var(--space-md);margin-top:auto;padding-top:var(--space-md);border-top:1px solid var(--border-subtle);">
          <button class="btn btn-secondary" onclick="WavePages['admin-lideres'].limparFiltros()" style="flex:1;">
            Limpar
          </button>
          <button class="btn btn-primary" onclick="WavePages['admin-lideres'].toggleDrawer()" style="flex:1;">
            Aplicar
          </button>
        </div>
      </div>

      <!-- Modal Sheet: Ficha da Célula (Ponto 10: Sem discípulos duplicados) -->
      <div class="modal-overlay ${this._liderSelecionado ? 'open' : ''}" onclick="WavePages['admin-lideres'].fecharFichaOutside(event)">
        <div class="modal-sheet" style="max-width:600px;">
          <div class="sheet-handle"></div>
          <div class="sheet-header">
            <h3 class="sheet-title">Ficha da Célula</h3>
            <button class="sheet-close" onclick="WavePages['admin-lideres'].fecharFicha()">
              <i data-lucide="x" style="width:18px;height:18px;"></i>
            </button>
          </div>

          ${this._liderSelecionado ? (() => {
            const l = this._liderSelecionado;
            // Ponto 10: Garante lista única de discípulos ativos
            const discipulos = WaveData.getDiscipulosByLider(l.nome);
            const celulas = l.celulas || [];

            return `
              <div style="display:flex;flex-direction:column;gap:var(--space-md);max-height:75vh;overflow-y:auto;padding-right:4px;">
                
                <!-- Cabeçalho do Líder (Clicável -> Abre a Ficha do Membro do Líder) -->
                <div onclick="WavePages['admin-lideres'].navegarParaFichaDoMembro('${l.id}')" style="display:flex;align-items:center;justify-content:space-between;padding:12px;background:var(--bg-elevated);border-radius:var(--radius-md);border:1px solid var(--border-subtle);cursor:pointer;transition:border-color 0.15s, background 0.15s;" title="Clique para ver os dados cadastrais deste líder">
                  <div style="display:flex;align-items:center;gap:var(--space-md);min-width:0;flex:1;">
                    <div style="width:50px;height:50px;border-radius:var(--radius-full);background:var(--bg-card);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1.1rem;color:var(--white);border:2px solid var(--border-medium);flex-shrink:0;">
                      ${l.nome.charAt(0)}
                    </div>
                    <div style="flex:1;min-width:0;">
                      <h2 style="font-size:1.1rem;font-weight:800;color:var(--white);">${l.nome} 👑</h2>
                      <span style="font-size:0.75rem;color:var(--text-tertiary);">${l.sexo === 'MASCULINO' ? 'Masculino' : 'Feminino'} · ${l.bairro || 'Centro'} (${l.cidade || 'Mandaguari'})</span>
                      <div style="font-size:0.75rem;color:var(--whatsapp);margin-top:2px;">📱 ${l.whatsapp || '—'}</div>
                    </div>
                  </div>
                  <div style="display:flex;align-items:center;gap:4px;flex-shrink:0;color:var(--text-tertiary);font-size:0.75rem;padding-left:8px;">
                    <span>Ver dados →</span>
                  </div>
                </div>

                <!-- Células sob Liderança (Ponto 1 e Ponto 20) -->
                <div>
                  <h4 style="font-size:0.85rem;font-weight:700;color:var(--warning);margin-bottom:6px;">Células Lideradas (${celulas.length})</h4>
                  <div style="display:flex;flex-direction:column;gap:8px;">
                    ${celulas.map((c, i) => `
                      <div style="padding:10px;background:var(--bg-elevated);border-radius:var(--radius-md);border:1px solid var(--border-subtle);font-size:0.82rem;">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                          <strong style="color:var(--white);">Célula ${i + 1} — ${c.finalidade}</strong>
                          <div style="display:flex;align-items:center;gap:6px;">
                            <div style="display:flex;gap:4px;flex-wrap:wrap;">
                              ${WaveData.renderFaixaEtariaBadges(c.faixaEtaria, 'font-size:0.65rem;')}
                            </div>
                            <button type="button" class="btn btn-ghost" onclick="WavePages['admin-lideres'].fecharCelulaIndividualClick('${l.id}', '${c.id}')" style="color:var(--danger);font-size:0.7rem;padding:2px 6px;height:auto;min-height:unset;" title="Fechar/Encerrar esta Célula (Ponto 20)">
                              <i data-lucide="x-circle" style="width:12px;height:12px;"></i> Fechar
                            </button>
                          </div>
                        </div>
                        <div style="color:var(--text-secondary);font-size:0.75rem;">
                          📅 <strong>Toda ${c.diaSemana}</strong> às <strong>${c.horario}</strong>
                        </div>
                        <div style="color:var(--text-tertiary);font-size:0.72rem;margin-top:2px;">
                          📍 ${c.tipoEndereco === 'outro' ? `${c.rua || ''} ${c.numero || ''}, ${c.bairro || ''} - ${c.cidade || 'Mandaguari'}` : 'Endereço Residencial do Líder'}
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>

                <!-- Lista de Discípulos Ativos (Ponto 10: Sem duplicatas) -->
                <div>
                  <h4 style="font-size:0.85rem;font-weight:700;color:var(--white);margin-bottom:6px;">Discípulos Ativos (${discipulos.length})</h4>
                  ${discipulos.length === 0 ? `
                    <div style="text-align:center;padding:var(--space-md);color:var(--text-tertiary);font-size:0.8rem;background:var(--bg-elevated);border-radius:var(--radius-md);">
                      Nenhum discípulo ativo vinculado a este líder.
                    </div>
                  ` : `
                    <div style="display:flex;flex-direction:column;gap:6px;">
                      ${discipulos.map(d => `
                        <div onclick="WavePages['admin-lideres'].navegarParaFichaDoMembro('${d.id}')" style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:var(--bg-elevated);border-radius:var(--radius-md);border:1px solid var(--border-subtle);cursor:pointer;transition:border-color 0.15s, background 0.15s;" title="Clique para ver a Ficha deste membro">
                          <div style="display:flex;align-items:center;gap:8px;">
                            <div style="width:30px;height:30px;border-radius:var(--radius-full);background:var(--bg-card);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.75rem;border:1px solid var(--border-subtle);">
                              ${d.nome.charAt(0)}
                            </div>
                            <div>
                              <strong style="font-size:0.82rem;color:var(--white);display:block;">${d.nome} ${d.eLider ? '<span style="color:var(--warning);font-size:0.65rem;">👑 (Líder)</span>' : ''}</strong>
                              <span style="font-size:0.68rem;color:var(--text-tertiary);">${d.whatsapp || 'Sem WhatsApp'}</span>
                            </div>
                          </div>
                          <div style="display:flex;align-items:center;gap:8px;">
                            <span class="status-badge-ativo" style="font-size:0.65rem;padding:2px 8px;">
                              Ativo
                            </span>
                            <span style="font-size:0.72rem;color:var(--text-tertiary);">Ver ficha →</span>
                          </div>
                        </div>
                      `).join('')}
                    </div>
                  `}
                </div>

                <button class="btn btn-secondary" onclick="WavePages['admin-lideres'].fecharFicha()" style="width:100%;margin-top:var(--space-sm);">
                  Fechar Ficha
                </button>
              </div>
            `;
          })() : ''}
        </div>
      </div>

      <!-- Modal de Redistribuição ao Fechar Célula (CT-CEL-02 / Ponto 20) -->
      <div class="modal-overlay ${this._fecharCelulaComRedistribuicao ? 'open' : ''}" style="z-index: 100000;">
        <div class="modal-sheet" style="max-width:620px;max-height:88vh;display:flex;flex-direction:column;padding:var(--space-xl) var(--space-xl) var(--space-md) var(--space-xl);">
          <div class="sheet-handle"></div>
          <div class="sheet-header">
            <h3 class="sheet-title" style="color:var(--danger);display:flex;align-items:center;gap:6px;">
              <i data-lucide="shuffle" style="width:20px;height:20px;"></i> Redistribuir Discípulos ao Fechar Célula
            </h3>
            <button class="sheet-close" onclick="WavePages['admin-lideres']._fecharCelulaComRedistribuicao = null; WaveApp.renderCurrentPage();">
              <i data-lucide="x" style="width:18px;height:18px;"></i>
            </button>
          </div>

          ${this._fecharCelulaComRedistribuicao ? (() => {
            const { lider, celula, discipulos } = this._fecharCelulaComRedistribuicao;
            const lideresMesmoSexo = WaveData.getLideresPorSexo(lider.sexo);

            return `
              <div style="overflow-y:auto;padding-right:4px;display:flex;flex-direction:column;gap:var(--space-md);">
                <p style="font-size:0.85rem;color:var(--text-secondary);line-height:1.4;margin:0;">
                  A Célula <strong>${celula.finalidade}</strong> (${celula.diaSemana} às ${celula.horario}) de <strong>${lider.nome}</strong> possui <strong>${discipulos.length} discípulo(s) ativo(s)</strong> vinculados.
                  <br>Defina o destino de cada discípulo antes de confirmar o encerramento desta célula:
                </p>

                <!-- Atalho para aplicar o mesmo líder a todos -->
                <div style="background:var(--bg-elevated);padding:10px 12px;border-radius:var(--radius-md);border:1px solid var(--border-subtle);display:flex;align-items:center;gap:var(--space-md);justify-content:space-between;flex-wrap:wrap;">
                  <span style="font-size:0.8rem;color:var(--text-secondary);font-weight:600;">Definir o mesmo destino para todos:</span>
                  <select class="input-field" style="max-width:240px;font-size:0.8rem;padding:6px 10px;" onchange="WavePages['admin-lideres'].aplicarLiderParaTodosRedistribuicao(this.value)">
                    <option value="">Selecione um líder...</option>
                    ${lideresMesmoSexo.map(l => `<option value="${l.nome}">${l.nome} ${l.nome === lider.nome ? '(Manter na outra célula)' : ''}</option>`).join('')}
                  </select>
                </div>

                <!-- Lista Individual de Discípulos -->
                <div style="display:flex;flex-direction:column;gap:8px;">
                  ${discipulos.map((d, idx) => `
                    <div style="display:flex;align-items:center;justify-content:space-between;gap:var(--space-md);padding:10px 12px;background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:var(--radius-md);flex-wrap:wrap;">
                      <div style="display:flex;align-items:center;gap:8px;min-width:180px;">
                        <div style="width:28px;height:28px;border-radius:var(--radius-full);background:var(--bg-elevated);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.75rem;border:1px solid var(--border-subtle);">
                          ${d.nome.charAt(0)}
                        </div>
                        <div>
                          <strong style="font-size:0.82rem;color:var(--white);display:block;">${d.nome}</strong>
                          <span style="font-size:0.68rem;color:var(--text-tertiary);">${d.whatsapp || 'Sem WhatsApp'}</span>
                        </div>
                      </div>

                      <div style="flex:1;min-width:200px;">
                        <select class="input-field select-redistribuir-celula-individual" data-discipulo-id="${d.id}" style="font-size:0.8rem;padding:6px 10px;" required>
                          ${lideresMesmoSexo.map(l => `
                            <option value="${l.nome}" data-lider-id="${l.id}" ${l.nome === lider.nome ? 'selected' : ''}>
                              ${l.nome} ${l.nome === lider.nome ? '(Manter na outra célula)' : ''}
                            </option>
                          `).join('')}
                        </select>
                      </div>
                    </div>
                  `).join('')}
                </div>

                <div style="display:flex;gap:var(--space-md);margin-top:var(--space-md);padding-top:var(--space-sm);border-top:1px solid var(--border-subtle);">
                  <button class="btn btn-secondary" onclick="WavePages['admin-lideres']._fecharCelulaComRedistribuicao = null; WaveApp.renderCurrentPage();" style="flex:1;">
                    Cancelar
                  </button>
                  <button class="btn btn-primary" onclick="WavePages['admin-lideres'].confirmarRedistribuicaoEFecharCelula()" style="flex:1.2;background:var(--danger);border-color:var(--danger);">
                    <i data-lucide="check-circle" style="width:16px;height:16px;"></i> Confirmar e Encerrar Célula
                  </button>
                </div>
              </div>
            `;
          })() : ''}
        </div>
      </div>
    `;
  },

  renderDesktopCards(celulas) {
    if (!celulas || celulas.length === 0) {
      return `
        <div class="card empty-state" style="grid-column: span 2; padding:var(--space-2xl);">
          <i data-lucide="search-x" style="width:40px;height:40px;color:var(--text-tertiary);"></i>
          <p style="color:var(--text-secondary);margin-top:var(--space-sm);font-size:0.85rem;">Nenhuma célula encontrada.</p>
        </div>
      `;
    }

    return celulas.map(c => {
      return `
        <div class="card" style="display:flex;flex-direction:column;justify-content:space-between;padding:var(--space-xl);border:1px solid var(--border-subtle);gap:var(--space-md);">
          <div>
            <!-- Cabeçalho do Card da Célula -->
            <div style="display:flex;align-items:center;gap:var(--space-md);margin-bottom:var(--space-md);">
              <div style="width:46px;height:46px;border-radius:var(--radius-full);background:var(--bg-elevated);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1.1rem;color:var(--white);border:2px solid var(--border-medium);flex-shrink:0;">
                ${c.liderNome.charAt(0)}
              </div>
              <div style="flex:1;min-width:0;">
                <h3 style="font-size:1.05rem;font-weight:800;color:var(--white);">${c.liderNome} 👑</h3>
                <span style="font-size:0.78rem;color:var(--text-tertiary);">${c.liderSexo === 'MASCULINO' ? 'Masculino' : 'Feminino'} · ${c.liderBairro || 'Centro'} (${c.liderCidade || 'Mandaguari'})</span>
              </div>
            </div>

            <!-- Dados da Célula Individual (Ponto 1: 1 linha/card por célula) -->
            <div style="background:var(--bg-elevated);border-radius:var(--radius-md);padding:10px 14px;border:1px solid var(--border-subtle);display:flex;flex-direction:column;gap:6px;margin-bottom:var(--space-md);font-size:0.82rem;">
              <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;">
                <span class="badge ${c.finalidade === 'Liderança' ? 'badge-warning' : 'badge-white'}" style="font-size:0.75rem;font-weight:700;">
                  ${c.finalidade}
                </span>
                ${c.finalidade !== 'Liderança' ? `
                  <div style="display:flex;gap:4px;flex-wrap:wrap;justify-content:flex-end;">
                    ${WaveData.renderFaixaEtariaBadges(c.faixaEtaria, 'font-size:0.7rem;')}
                  </div>
                ` : ''}
              </div>
              
              <div style="color:var(--white);font-weight:600;font-size:0.85rem;margin-top:2px;">
                📅 Toda <strong>${c.diaSemana}</strong> às <strong>${c.horario}</strong>
              </div>

              <div style="color:var(--text-tertiary);font-size:0.75rem;">
                📍 ${c.enderecoFormatado}
              </div>
            </div>

            <!-- Total de Discípulos -->
            <div style="display:flex;align-items:center;gap:6px;font-size:0.8rem;color:var(--text-secondary);">
              <i data-lucide="users" style="width:14px;height:14px;color:var(--success);"></i>
              <span><strong style="color:var(--white);">${c.totalDiscipulos} discípulo(s)</strong> vinculados ao líder</span>
            </div>
          </div>

          <button class="btn btn-secondary" onclick="WavePages['admin-lideres'].abrirFichaLider('${c.liderId}')" style="width:100%;font-size:0.85rem;padding:10px;">
            Ver Ficha da Célula
          </button>
        </div>
      `;
    }).join('');
  },

  renderMobileCards(celulas) {
    if (!celulas || celulas.length === 0) {
      return `
        <div class="card empty-state" style="padding:var(--space-2xl);">
          <i data-lucide="search-x" style="width:40px;height:40px;color:var(--text-tertiary);"></i>
          <p style="color:var(--text-secondary);margin-top:var(--space-sm);font-size:0.85rem;">Nenhuma célula encontrada.</p>
        </div>
      `;
    }

    return celulas.map(c => {
      const nomeCurto = this.formatNameWords(c.liderNome, 3);

      return `
        <div class="card" onclick="WavePages['admin-lideres'].abrirFichaLider('${c.liderId}')" style="display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border:1px solid var(--border-subtle);gap:12px;cursor:pointer;">
          <div style="display:flex;align-items:center;gap:12px;min-width:0;flex:1;">
            <div style="width:36px;height:36px;border-radius:var(--radius-full);background:var(--bg-elevated);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;flex-shrink:0;color:var(--white);border:1px solid var(--border-subtle);">
              ${c.liderNome.charAt(0)}
            </div>
            <div style="min-width:0;flex:1;">
              <div style="display:flex;align-items:center;gap:6px;">
                <strong style="font-size:0.88rem;color:var(--white);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${nomeCurto}</strong>
                <span style="font-size:0.7rem;">👑</span>
                <span class="badge ${c.finalidade === 'Liderança' ? 'badge-warning' : 'badge-white'}" style="font-size:0.6rem;padding:1px 4px;">${c.finalidade}</span>
              </div>
              <div style="display:flex;align-items:center;gap:4px;margin-top:4px;flex-wrap:wrap;">
                <span style="font-size:0.72rem;color:var(--text-tertiary);margin-right:2px;">${c.diaSemana} às ${c.horario}</span>
                ${c.finalidade !== 'Liderança' ? `
                  <span>·</span>
                  ${WaveData.renderFaixaEtariaBadges(c.faixaEtaria, 'font-size:0.62rem;padding:1px 6px;')}
                ` : ''}
              </div>
            </div>
          </div>

          <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">
            <div style="text-align:right;">
              <span style="font-size:0.75rem;font-weight:700;color:var(--white);">${c.totalDiscipulos}</span>
              <span style="font-size:0.65rem;color:var(--text-tertiary);display:block;">discípulos</span>
            </div>
            <button class="btn btn-secondary" onclick="event.stopPropagation(); WavePages['admin-lideres'].abrirFichaLider('${c.liderId}')" style="padding:6px 10px;font-size:0.75rem;border-radius:var(--radius-md);">
              <i data-lucide="eye" style="width:14px;height:14px;"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');
  },

  onSearchInput(val) {
    this._search = val;
    this.filterCardsLive();
  },

  onMount() {
    this.initCols();

    const input = document.getElementById('admin-lideres-search');
    if (input) {
      input.value = this._search;
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
    const input = document.getElementById('admin-lideres-search');
    if (input) {
      input.value = '';
      input.focus();
    }
    this.filterCardsLive();
  },

  filterCardsLive() {
    const todasCelulas = this.getAllCelulasFlat();
    const celulasFiltradas = this.applyAllFilters(todasCelulas);

    const deskGrid = document.getElementById('lideres-desktop-grid');
    const mobileList = document.getElementById('lideres-mobile-list');
    const countEl = document.getElementById('lideres-count');

    if (deskGrid) deskGrid.innerHTML = this.renderDesktopCards(celulasFiltradas);
    if (mobileList) mobileList.innerHTML = this.renderMobileCards(celulasFiltradas);
    if (countEl) countEl.textContent = celulasFiltradas.length;

    // Atualização reativa dos botões de Limpar e Indicadores
    const btnLimpar = document.getElementById('btn-limpar-filtros-lideres');
    if (btnLimpar) btnLimpar.style.display = this.temFiltrosAtivos() ? 'inline-flex' : 'none';

    const btnClearSearch = document.getElementById('btn-clear-search-lideres');
    if (btnClearSearch) btnClearSearch.style.display = this._search ? 'flex' : 'none';

    const dotDesk = document.getElementById('dot-filtros-lideres-desk');
    if (dotDesk) dotDesk.style.display = this.temFiltrosAtivos() ? 'block' : 'none';

    const dotMob = document.getElementById('dot-filtros-lideres-mob');
    if (dotMob) dotMob.style.display = this.temFiltrosAtivos() ? 'block' : 'none';

    if (window.lucide) lucide.createIcons();
  },

  toggleDrawer() {
    this._showFiltrosDrawer = !this._showFiltrosDrawer;
    WaveApp.renderCurrentPage();
  },

  setFinalidade(val) { this._filterFinalidade = val; this.filterCardsLive(); },
  setFaixaEtaria(val) { this._filterFaixaEtaria = val; this.filterCardsLive(); },
  setDiaCelula(val) { this._filterDiaCelula = val; this.filterCardsLive(); },
  setBairro(val) { this._filterBairro = val; this.filterCardsLive(); },
  setCidade(val) { this._filterCidade = val; this.filterCardsLive(); },
  setSexo(val) { this._filterSexo = val; this.filterCardsLive(); },

  temFiltrosAtivos() {
    return (
      (this._search && this._search.trim() !== '') ||
      this._filterFinalidade !== 'todos' ||
      this._filterFaixaEtaria !== 'todos' ||
      this._filterDiaCelula !== 'todos' ||
      this._filterBairro !== 'todos' ||
      this._filterCidade !== 'todos' ||
      this._filterSexo !== 'todos'
    );
  },

  limparFiltros() {
    this._filterFinalidade = 'todos';
    this._filterFaixaEtaria = 'todos';
    this._filterDiaCelula = 'todos';
    this._filterBairro = 'todos';
    this._filterCidade = 'todos';
    this._filterSexo = 'todos';
    this._search = '';
    this._showFiltrosDrawer = false;
    const input = document.getElementById('admin-lideres-search');
    if (input) input.value = '';
    WaveApp.renderCurrentPage();
  },

  abrirFichaLider(liderId) {
    const l = WaveData.getAllLideresAtivos().find(item => item.id === liderId);
    if (l) {
      this._liderSelecionado = l;
      this._editandoLider = false;
      WaveApp.renderCurrentPage();
    }
  },

  fecharFicha() {
    this._liderSelecionado = null;
    this._editandoLider = false;
    WaveApp.renderCurrentPage();
  },

  fecharFichaOutside(e) {
    if (e.target.classList.contains('modal-overlay')) {
      this.fecharFicha();
    }
  },

  // Melhoria 9: Navegar da Ficha da Célula para a Ficha do Membro/Discípulo
  navegarParaFichaDoMembro(membroId) {
    this.fecharFicha();
    WaveApp.navigate('admin-membros');
    setTimeout(() => {
      if (WavePages['admin-membros'] && WavePages['admin-membros'].abrirDetalhes) {
        WavePages['admin-membros'].abrirDetalhes(membroId);
      }
    }, 60);
  },

  aplicarLiderParaTodosRedistribuicao(liderNome) {
    if (!liderNome) return;
    const selects = document.querySelectorAll('.select-redistribuir-celula-individual');
    selects.forEach(sel => {
      sel.value = liderNome;
    });
  },

  async confirmarRedistribuicaoEFecharCelula() {
    if (!this._fecharCelulaComRedistribuicao) return;
    const { liderId, celulaId, lider, celula } = this._fecharCelulaComRedistribuicao;

    const selects = document.querySelectorAll('.select-redistribuir-celula-individual');
    const mapa = [];

    selects.forEach(sel => {
      const discipuloId = sel.getAttribute('data-discipulo-id');
      const novoLiderNome = sel.value;
      const opt = sel.options[sel.selectedIndex];
      const novoLiderId = opt ? opt.getAttribute('data-lider-id') : null;

      // Se o discípulo foi redistribuído para outro líder diferente do original
      if (novoLiderNome && novoLiderNome !== lider.nome) {
        mapa.push({ discipuloId, novoLiderNome, novoLiderId });
      }
    });

    if (mapa.length > 0) {
      const resRedist = await WaveData.redistribuirDiscipulos(mapa);
      if (!resRedist || !resRedist.ok) {
        WaveApp.showToast(`❌ Falha ao redistribuir discípulos: ${resRedist?.message || 'Erro no banco.'}`, 'danger');
        return;
      }
    }

    const res = await WaveData.fecharCelulaIndividual(liderId, celulaId);
    if (res.ok) {
      this._fecharCelulaComRedistribuicao = null;
      WaveApp.showToast(`✅ Célula encerrada com sucesso! ${mapa.length > 0 ? `(${mapa.length} discípulo(s) transferidos)` : ''}`, 'success');
      if (this._liderSelecionado && this._liderSelecionado.id === liderId) {
        this._liderSelecionado = WaveData.getMembroById(liderId);
      }
      WaveApp.renderCurrentPage();
    } else {
      await WaveApp.alert(res.message, 'Erro ao Encerrar Célula', 'danger');
    }
  },

  // Ponto 20 (v1.3) / CT-CEL-02: Fechar uma célula individual
  async fecharCelulaIndividualClick(liderId, celulaId) {
    const lider = WaveData.getMembroById(liderId);
    if (!lider) return;

    const celula = (lider.celulas || []).find(c => c.id === celulaId);
    if (!celula) return;

    // Regra Ponto 20: Se for a última Evangelística, avisa e bloqueia
    const celulasEvangRestantes = (lider.celulas || []).filter(c => c.finalidade === 'Evangelística' && c.id !== celulaId);
    if (celula.finalidade === 'Evangelística' && celulasEvangRestantes.length === 0) {
      await WaveApp.alert('Todo líder precisa de ao menos 1 célula Evangelística ativa.\n\nCaso este líder não vá mais liderar nenhuma célula, realize a inativação do próprio líder pela tela de Membros.', 'Encerramento Bloqueado', 'warning');
      return;
    }

    // Regra: Bloqueio de encerramento de célula de Liderança se houver discípulos líderes
    if (celula.finalidade === 'Liderança') {
      const celulasLidRestantes = (lider.celulas || []).filter(c => c.finalidade === 'Liderança' && c.id !== celulaId);
      const discipulosLideres = WaveData.membros.filter(m => m.lider === lider.nome && m.eLider && (m.status || 'ATIVO') === 'ATIVO');
      if (celulasLidRestantes.length === 0 && discipulosLideres.length > 0) {
        const nomes = discipulosLideres.map(d => d.nome).join(', ');
        await WaveApp.alert(
          `Não é possível encerrar a célula de Liderança de "${lider.nome}", pois ele(a) discipula ${discipulosLideres.length} discípulo(s) que lideram células:\n\n• ${nomes}\n\nPara encerrar esta célula, primeiro altere o líder responsável desses discípulos ou desmarque-os como líderes.`,
          'Célula de Liderança em Uso',
          'warning'
        );
        return;
      }
    }

    // CT-CEL-02: Se a célula fechada for Evangelística e o líder possuir discípulos ativos vinculados, EXIGE redistribuição
    const discipulos = WaveData.getDiscipulosByLider(lider.nome);
    if (celula.finalidade === 'Evangelística' && discipulos.length > 0) {
      this._fecharCelulaComRedistribuicao = {
        liderId,
        celulaId,
        lider,
        celula,
        discipulos
      };
      WaveApp.renderCurrentPage();
      return;
    }

    const confirmar = await WaveApp.confirm(`Deseja realmente encerrar a Célula ${celula.finalidade} (${celula.diaSemana} às ${celula.horario}) de ${lider.nome}?`, 'Encerrar Célula', {
      confirmText: 'Sim, Encerrar',
      cancelText: 'Cancelar',
      type: 'danger'
    });
    if (!confirmar) return;

    const res = await WaveData.fecharCelulaIndividual(liderId, celulaId);
    if (res.ok) {
      WaveApp.showToast(`✅ Célula encerrada com sucesso.`, 'success');
      if (this._liderSelecionado && this._liderSelecionado.id === liderId) {
        this._liderSelecionado = WaveData.getMembroById(liderId);
      }
      WaveApp.renderCurrentPage();
    } else {
      await WaveApp.alert(res.message, 'Erro ao Encerrar Célula', 'danger');
    }
  }
};
