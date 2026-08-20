/* ============================================
   WAVE CÉLULAS — Módulo de Importação de Base via CSV
   (Especificação PO v1: Carga Anual em Massa com Múltiplas Células e Finalidade)
   ============================================ */

window.WavePages = window.WavePages || {};

WavePages.importacao = {

  _rowsPreview: [],
  _validCount: 0,
  _errorCount: 0,
  _fileLoaded: false,

  downloadTemplate() {
    let csv = 'Nome;WhatsApp;DataNascimento;DataIngresso;TipoIngresso;Sexo;Rua;Numero;Bairro;Cidade;Complemento;LiderResponsavel;ELider;FinalidadeCelula;FaixaEtariaCelula;DiaCelula;HorarioCelula;TipoEnderecoCelula;RuaCelula;NumeroCelula;BairroCelula;CidadeCelula\n';
    csv += 'Lucas Bomfonti;(44) 99806-3481;1992-05-14;2024-01-10;Batismo;MASCULINO;Av. Amazonas;100;Centro;Mandaguari;;—;Sim;Evangelística;Adulto;Quinta;20:00;residencial;;;;\n';
    csv += 'Lucas Bomfonti;(44) 99806-3481;1992-05-14;2024-01-10;Batismo;MASCULINO;Av. Amazonas;100;Centro;Mandaguari;;—;Sim;Liderança;Adulto;Terça;19:30;residencial;;;;\n';
    csv += 'Maria Clara Souza;(44) 99123-4567;1998-08-22;2025-03-15;Recepção;FEMININO;Rua Vítor do Amaral;250;Centro;Mandaguari;Apto 12;—;Não;;;;;;;;;\n';

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'modelo_importacao_membros_wave.csv';
    link.click();

    WaveApp.showToast('📥 Modelo CSV baixado com sucesso!', 'success');
  },

  render() {
    return `
      <!-- Header da Página Importação -->
      <section class="page-header animate-in" style="margin-bottom:var(--space-md);display:flex;align-items:center;justify-content:space-between;gap:var(--space-md);">
        <h2 class="page-title" style="margin:0;">Importar Base de Discípulos & Células</h2>

        <button class="btn btn-secondary" onclick="WavePages.importacao.downloadTemplate()">
          <i data-lucide="download" style="width:16px;height:16px;"></i> Baixar Modelo CSV
        </button>
      </section>

      <!-- Card de Instruções -->
      <div class="card animate-in" style="margin-bottom:var(--space-lg);border-left:4px solid var(--white);">
        <h3 style="font-size:0.95rem;font-weight:700;margin-bottom:6px;color:var(--white);">📋 Carga Anual em Massa via CSV</h3>
        <p style="font-size:0.82rem;color:var(--text-secondary);line-height:1.5;">
          1. Baixe o <strong>Modelo CSV padrão</strong> no botão acima.<br>
          2. Um líder com mais de uma célula pode ter múltiplas linhas (uma para cada célula: Evangelística / Liderança).<br>
          3. O sistema processa em <strong>duas passagens</strong>: primeiro cadastra os líderes e células, depois vincula os discípulos.<br>
          4. O sistema valida automaticamente duplicidades (Nome + Data de Nascimento) e consistência de gênero.
        </p>
      </div>

      <!-- Área de Upload -->
      <div class="card animate-in" style="text-align:center;padding:var(--space-2xl) var(--space-xl);border:2px dashed var(--border-medium);cursor:pointer;margin-bottom:var(--space-lg);" onclick="document.getElementById('csv-file-input').click()">
        <i data-lucide="upload-cloud" style="width:48px;height:48px;color:var(--text-tertiary);margin-bottom:var(--space-sm);"></i>
        <h3 style="font-size:1.1rem;font-weight:800;color:var(--white);">Clique aqui para selecionar seu arquivo CSV</h3>
        <span style="font-size:0.8rem;color:var(--text-tertiary);">Formatos aceitos: .csv (Separador ";" ou ",")</span>
        <input type="file" id="csv-file-input" accept=".csv" style="display:none;" onchange="WavePages.importacao.handleFileUpload(event)">
      </div>

      <!-- Tabela de Prévia dos Dados -->
      ${this._fileLoaded ? `
        <div class="card animate-in" style="margin-bottom:var(--space-lg);">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-md);flex-wrap:wrap;gap:var(--space-sm);">
            <div>
              <h3 style="font-size:1rem;font-weight:800;">Prévia de Validação</h3>
              <span style="font-size:0.8rem;color:var(--text-tertiary);">
                Prontos para importar: <strong style="color:var(--success);">${this._validCount}</strong> · 
                Com pendências: <strong style="color:var(--danger);">${this._errorCount}</strong>
              </span>
            </div>

            <button class="btn btn-primary" onclick="WavePages.importacao.confirmarImportacao()" ${this._validCount === 0 ? 'disabled' : ''}>
              <i data-lucide="check" style="width:16px;height:16px;"></i> Importar Registros Válidos (${this._validCount})
            </button>
          </div>

          <div style="overflow-x:auto;">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Linha</th>
                  <th>Nome</th>
                  <th>WhatsApp</th>
                  <th>Data Nasc.</th>
                  <th>Líder</th>
                  <th>Função</th>
                  <th>Status Validação</th>
                </tr>
              </thead>
              <tbody>
                ${this._rowsPreview.map((r, idx) => `
                  <tr>
                    <td>#${idx + 1}</td>
                    <td><strong>${r.nome || '—'}</strong></td>
                    <td>${r.whatsapp || '—'}</td>
                    <td>${r.dataNascimento || '—'}</td>
                    <td>${r.liderResponsavel || '—'}</td>
                    <td>${r.eLider ? '<span style="color:var(--warning);font-weight:700;">👑 Líder</span>' : 'Discípulo'}</td>
                    <td>
                      ${r.valido ? `
                        <span class="status-badge-ativo">Pronto para importar</span>
                      ` : `
                        <span class="status-badge-inativo">${r.erro}</span>
                      `}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      ` : ''}
    `;
  },

  handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      this.processCSVText(text);
    };
    reader.readAsText(file);
  },

  processCSVText(text) {
    const lines = text.split(/\r\n|\n/).filter(l => l.trim() !== '');
    if (lines.length <= 1) {
      WaveApp.showToast('O arquivo CSV está vazio ou contém apenas o cabeçalho.', 'danger');
      return;
    }

    const delimiter = lines[0].includes(';') ? ';' : ',';

    this._rowsPreview = [];
    this._validCount = 0;
    this._errorCount = 0;

    // Primeira extração dos objetos para permitir cruzamento entre linhas do CSV
    const parsedRowsRaw = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(delimiter).map(c => c.trim().replace(/^"|"$/g, ''));
      if (cols.length < 2) continue;

      parsedRowsRaw.push({
        nome: cols[0] || '',
        whatsapp: cols[1] || '',
        dataNascimento: cols[2] || '',
        dataIngresso: cols[3] || new Date().toISOString().split('T')[0],
        tipoIngresso: cols[4] || 'Recepção',
        sexo: (cols[5] || 'FEMININO').toUpperCase(),
        rua: cols[6] || '',
        numero: cols[7] || '',
        bairro: cols[8] || '',
        cidade: cols[9] || 'Mandaguari',
        complemento: cols[10] || '',
        liderResponsavel: cols[11] || '—',
        eLider: (cols[12] || '').toLowerCase() === 'sim' || (cols[12] || '').toLowerCase() === 'true',
        finalidadeCelula: cols[13] || 'Evangelística',
        faixaEtariaCelula: cols[14] || 'Adulto',
        diaCelula: cols[15] || 'Quinta',
        horarioCelula: cols[16] || '20:00',
        tipoEnderecoCelula: cols[17] || 'residencial',
        ruaCelula: cols[18] || '',
        numeroCelula: cols[19] || '',
        bairroCelula: cols[20] || '',
        cidadeCelula: cols[21] || 'Mandaguari',
        valido: true,
        erro: ''
      });
    }

    // Segunda passagem: validações de campos, duplicata e consistência de gênero
    for (const obj of parsedRowsRaw) {
      if (!obj.nome) {
        obj.valido = false;
        obj.erro = 'Nome obrigatório ausente';
      } else if (!obj.dataNascimento) {
        obj.valido = false;
        obj.erro = 'Data de Nascimento ausente';
      } else if (WaveData.isDuplicado(obj.nome, obj.dataNascimento)) {
        obj.valido = false;
        obj.erro = 'Já cadastrado no banco';
      } else if (obj.liderResponsavel && obj.liderResponsavel !== '—') {
        // Validação de consistência de gênero entre Líder e Discípulo (Ponto 16 / v1.2)
        let liderEncontrado = WaveData.getMembroByNome(obj.liderResponsavel);
        if (!liderEncontrado) {
          const liderNoCsv = parsedRowsRaw.find(r => r.eLider && r.nome && (
            r.nome.trim().toLowerCase() === obj.liderResponsavel.trim().toLowerCase() ||
            r.nome.toLowerCase().includes(obj.liderResponsavel.toLowerCase()) ||
            obj.liderResponsavel.toLowerCase().includes(r.nome.toLowerCase())
          ));
          if (liderNoCsv) {
            liderEncontrado = { nome: liderNoCsv.nome, sexo: liderNoCsv.sexo };
          }
        }

        if (liderEncontrado && liderEncontrado.sexo && liderEncontrado.sexo !== obj.sexo) {
          obj.valido = false;
          obj.erro = `Gênero incompatível: Discípulo (${obj.sexo === 'MASCULINO' ? 'Masculino' : 'Feminino'}) e Líder (${liderEncontrado.sexo === 'MASCULINO' ? 'Masculino' : 'Feminino'})`;
        }
      }

      if (obj.valido) {
        this._validCount++;
      } else {
        this._errorCount++;
      }

      this._rowsPreview.push(obj);
    }

    this._fileLoaded = true;
    WaveApp.renderCurrentPage();
    WaveApp.showToast(`📊 CSV processado: ${this._validCount} válidos, ${this._errorCount} com erros.`, 'success');
  },

  async confirmarImportacao() {
    const validRows = this._rowsPreview.filter(r => r.valido);

    if (validRows.length === 0) return;

    WaveApp.showToast('🔄 Importando registros no Supabase...', 'warning');

    // 1ª Passagem: Agrupar e cadastrar líderes com suas células
    const lideresMap = new Map();
    validRows.filter(r => r.eLider).forEach(r => {
      const key = `${r.nome.toLowerCase()}_${r.dataNascimento}`;
      if (!lideresMap.has(key)) {
        lideresMap.set(key, {
          ...r,
          celulas: []
        });
      }
      lideresMap.get(key).celulas.push({
        id: 'cel-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        finalidade: r.finalidadeCelula || 'Evangelística',
        faixaEtaria: r.faixaEtariaCelula || 'Adulto',
        diaSemana: r.diaCelula || 'Quinta',
        horario: r.horarioCelula || '20:00',
        tipoEndereco: r.tipoEnderecoCelula || 'residencial',
        rua: r.ruaCelula || '',
        numero: r.numeroCelula || '',
        bairro: r.bairroCelula || '',
        cidade: r.cidadeCelula || 'Mandaguari'
      });
    });

    for (const [key, l] of lideresMap.entries()) {
      await WaveData.addMembro({
        nome: l.nome,
        whatsapp: l.whatsapp,
        dataNascimento: l.dataNascimento,
        dataIngresso: l.dataIngresso,
        tipoIngresso: l.tipoIngresso,
        sexo: l.sexo,
        rua: l.rua,
        numero: l.numero,
        complemento: l.complemento,
        bairro: l.bairro,
        cidade: l.cidade,
        lider: l.liderResponsavel || '—',
        eLider: true,
        celulas: l.celulas,
        status: 'ATIVO'
      });
    }

    // 2ª Passagem: Cadastrar discípulos comuns
    const membrosComuns = validRows.filter(r => !r.eLider);
    for (const r of membrosComuns) {
      await WaveData.addMembro({
        nome: r.nome,
        whatsapp: r.whatsapp,
        dataNascimento: r.dataNascimento,
        dataIngresso: r.dataIngresso,
        tipoIngresso: r.tipoIngresso,
        sexo: r.sexo,
        rua: r.rua,
        numero: r.numero,
        complemento: r.complemento,
        bairro: r.bairro,
        cidade: r.cidade,
        lider: r.liderResponsavel || '—',
        eLider: false,
        celulas: [],
        status: 'ATIVO'
      });
    }

    await WaveData.syncSupabase();

    WaveApp.showToast(`✅ ${validRows.length} registro(s) importado(s) com sucesso!`, 'success');
    this._fileLoaded = false;
    this._rowsPreview = [];
    WaveApp.navigate('admin-membros');
  }
};
