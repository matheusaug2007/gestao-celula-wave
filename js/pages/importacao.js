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
                    <td>Linha ${r.linhaNum || (idx + 2)}</td>
                    <td><strong>${WaveApp.escapeHTML(r.nome) || '—'}</strong></td>
                    <td>${WaveApp.escapeHTML(r.whatsapp) || '—'}</td>
                    <td>${WaveApp.escapeHTML(r.dataNascimento) || '—'}</td>
                    <td>${WaveApp.escapeHTML(r.liderResponsavel) || '—'}</td>
                    <td>${r.eLider ? '<span style="color:var(--warning);font-weight:700;">👑 Líder</span>' : 'Discípulo'}</td>
                    <td>
                      ${r.valido ? `
                        <span class="status-badge-ativo">Pronto para importar</span>
                      ` : `
                        <span class="status-badge-inativo">${WaveApp.escapeHTML(r.erro)}</span>
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

    // Validação básica de tamanho (ex: max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      WaveApp.showToast('O arquivo CSV selecionado é muito grande (máximo 10MB).', 'danger');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      this.processCSVText(text);
    };
    reader.readAsText(file, 'UTF-8');
  },

  // Normaliza qualquer formato de data (DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD) para ISO YYYY-MM-DD
  normalizarDataParaISO(str) {
    if (!str || typeof str !== 'string') return null;
    const clean = str.trim();
    if (!clean) return null;

    // Já é YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) return clean;

    // DD/MM/YYYY ou DD-MM-YYYY
    const brMatch = clean.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (brMatch) {
      const dia = brMatch[1].padStart(2, '0');
      const mes = brMatch[2].padStart(2, '0');
      const ano = brMatch[3];
      return `${ano}-${mes}-${dia}`;
    }

    // YYYY/MM/DD
    const isoSlashMatch = clean.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
    if (isoSlashMatch) {
      const ano = isoSlashMatch[1];
      const mes = isoSlashMatch[2].padStart(2, '0');
      const dia = isoSlashMatch[3].padStart(2, '0');
      return `${ano}-${mes}-${dia}`;
    }

    return null;
  },

  // BUG-06: Parser CSV completo compatível com RFC 4180
  parseCSV(text) {
    if (!text) return { rows: [], errors: [], delimiter: ';' };

    // 1. Remove UTF-8 BOM se presente
    if (text.charCodeAt(0) === 0xFEFF) {
      text = text.slice(1);
    }

    // 2. Detecta delimitador analisando a primeira linha fora de aspas
    let delimiter = ';';
    let inQuotesDetect = false;
    let countSemi = 0;
    let countComma = 0;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (c === '"') inQuotesDetect = !inQuotesDetect;
      else if (!inQuotesDetect) {
        if (c === ';') countSemi++;
        else if (c === ',') countComma++;
        else if (c === '\n' || c === '\r') break;
      }
    }
    if (countComma > countSemi) delimiter = ',';

    // 3. State-machine parser RFC 4180
    const rows = [];
    const errors = [];
    let currentRow = [];
    let currentField = '';
    let inQuote = false;
    let lineNumber = 1;
    let quoteStartLine = 1;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];

      if (char === '"') {
        if (inQuote) {
          if (nextChar === '"') {
            // Aspa escapada: ""
            currentField += '"';
            i++;
          } else {
            // Fecha aspas
            inQuote = false;
          }
        } else {
          // Abre aspas
          inQuote = true;
          quoteStartLine = lineNumber;
        }
      } else if (char === delimiter && !inQuote) {
        // Fim de coluna
        currentRow.push(currentField.trim());
        currentField = '';
      } else if ((char === '\r' || char === '\n') && !inQuote) {
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
        currentRow.push(currentField.trim());
        currentField = '';

        // Ignora linhas vazias ou linhas apenas com delimitadores e espaços (ex: ;;;;;;;)
        const hasContent = currentRow.some(f => f.replace(/^["'\s]+|["'\s]+$/g, '').trim() !== '');
        if (hasContent) {
          rows.push({ lineNumber, cols: currentRow });
        }
        currentRow = [];
        lineNumber++;
      } else {
        if (char === '\n') lineNumber++;
        currentField += char;
      }
    }

    if (currentField.length > 0 || currentRow.length > 0) {
      currentRow.push(currentField.trim());
      const hasContent = currentRow.some(f => f.replace(/^["'\s]+|["'\s]+$/g, '').trim() !== '');
      if (hasContent) {
        rows.push({ lineNumber, cols: currentRow });
      }
    }

    if (inQuote) {
      errors.push({
        lineNumber: quoteStartLine,
        message: `Aspas abertas na linha ${quoteStartLine} não foram fechadas corretamente.`
      });
    }

    return { rows, errors, delimiter };
  },

  processCSVText(text) {
    const { rows, errors, delimiter } = this.parseCSV(text);

    if (errors.length > 0) {
      WaveApp.showToast(`❌ Erro no formato do CSV: ${errors[0].message}`, 'danger');
      return;
    }

    if (rows.length <= 1) {
      WaveApp.showToast('O arquivo CSV está vazio ou contém apenas o cabeçalho.', 'danger');
      return;
    }

    this._rowsPreview = [];
    this._validCount = 0;
    this._errorCount = 0;

    // Validação do cabeçalho
    const headerCols = rows[0].cols.map(c => c.toLowerCase().trim());
    const hasHeaderNome = headerCols.some(c => c.includes('nome'));
    const startIndex = hasHeaderNome ? 1 : 0;

    // Função auxiliar para sanitizar tamanho e neutralizar fórmulas perigosas
    const sanitizeField = (val, maxLen = 120) => {
      if (!val) return '';
      let s = String(val).trim();
      // Remove aspas externas residuais
      s = s.replace(/^"|"$/g, '');
      // Remove caracteres de controle ou início de fórmula maliciosa
      if (/^[=+\-@\t\r]/.test(s)) {
        s = s.replace(/^[=+\-@\t\r]+/, '');
      }
      if (s.length > maxLen) {
        s = s.substring(0, maxLen);
      }
      return s;
    };

    // Primeira extração das linhas
    const parsedRowsRaw = [];
    for (let i = startIndex; i < rows.length; i++) {
      const { lineNumber, cols } = rows[i];

      // Ignora se todos os campos da linha forem vazios
      const hasAnyField = cols.some(c => c && c.trim() !== '');
      if (!hasAnyField) continue;

      if (cols.length < 2) {
        parsedRowsRaw.push({
          linhaNum: lineNumber,
          nome: '',
          valido: false,
          erro: 'Linha com número insuficiente de colunas'
        });
        continue;
      }

      const rawNome = sanitizeField(cols[0], 120);
      const rawNasc = sanitizeField(cols[2], 20);
      const rawIngresso = sanitizeField(cols[3], 20);

      const dataNascISO = this.normalizarDataParaISO(rawNasc);
      const dataIngressoISO = this.normalizarDataParaISO(rawIngresso) || new Date().toISOString().split('T')[0];

      const rowObj = {
        linhaNum: lineNumber,
        nome: rawNome,
        whatsapp: sanitizeField(cols[1], 30),
        dataNascimento: dataNascISO || rawNasc,
        dataIngresso: dataIngressoISO,
        tipoIngresso: sanitizeField(cols[4], 40) || 'Recepção',
        sexo: (sanitizeField(cols[5], 20) || 'FEMININO').toUpperCase(),
        rua: sanitizeField(cols[6], 150),
        numero: sanitizeField(cols[7], 20),
        bairro: sanitizeField(cols[8], 100),
        cidade: sanitizeField(cols[9], 80) || 'Mandaguari',
        complemento: sanitizeField(cols[10], 150),
        liderResponsavel: sanitizeField(cols[11], 120) || '—',
        eLider: (cols[12] || '').toLowerCase() === 'sim' || (cols[12] || '').toLowerCase() === 'true',
        finalidadeCelula: sanitizeField(cols[13], 50) || 'Evangelística',
        faixaEtariaCelula: sanitizeField(cols[14], 50) || 'Adulto',
        diaCelula: sanitizeField(cols[15], 30) || 'Quinta',
        horarioCelula: sanitizeField(cols[16], 20) || '20:00',
        tipoEnderecoCelula: sanitizeField(cols[17], 30) || 'residencial',
        ruaCelula: sanitizeField(cols[18], 150),
        numeroCelula: sanitizeField(cols[19], 20),
        bairroCelula: sanitizeField(cols[20], 100),
        cidadeCelula: sanitizeField(cols[21], 80) || 'Mandaguari',
        valido: true,
        erro: ''
      };

      if (!rawNome) {
        rowObj.valido = false;
        rowObj.erro = 'Nome obrigatório ausente';
      } else if (!rawNasc) {
        rowObj.valido = false;
        rowObj.erro = 'Data de Nascimento ausente';
      } else if (!dataNascISO) {
        rowObj.valido = false;
        rowObj.erro = 'Data de Nasc. inválida (use AAAA-MM-DD ou DD/MM/AAAA)';
      }

      parsedRowsRaw.push(rowObj);
    }

    // Segunda passagem: validações de regras de negócio
    for (const obj of parsedRowsRaw) {
      if (!obj.valido) {
        this._errorCount++;
        this._rowsPreview.push(obj);
        continue;
      }

      if (!obj.eLider && (!obj.liderResponsavel || obj.liderResponsavel === '—' || obj.liderResponsavel.trim() === '')) {
        obj.valido = false;
        obj.erro = 'Líder Responsável obrigatório';
      } else if (WaveData.isDuplicado(obj.nome, obj.dataNascimento)) {
        obj.valido = false;
        obj.erro = 'Já cadastrado no banco';
      } else if (obj.liderResponsavel && obj.liderResponsavel !== '—') {
        // Validação de consistência de gênero entre Líder e Discípulo (Ponto 16)
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
    WaveApp.showToast(`📊 CSV processado (${delimiter === ';' ? 'Ponto e vírgula' : 'Vírgula'}): ${this._validCount} válidos, ${this._errorCount} com pendências.`, 'success');
  },

  async confirmarImportacao() {
    const validRows = this._rowsPreview.filter(r => r.valido);

    if (validRows.length === 0) return;

    WaveApp.showToast('🔄 Importando registros no Supabase...', 'warning');

    let sucessos = 0;
    let falhas = 0;
    let ultimaFalhaMsg = '';

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
      const res = await WaveData.addMembro({
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

      if (res && res.ok) {
        sucessos++;
      } else {
        falhas++;
        ultimaFalhaMsg = res?.message || 'Falha ao salvar líder.';
      }
    }

    // 2ª Passagem: Cadastrar discípulos comuns
    const membrosComuns = validRows.filter(r => !r.eLider);
    for (const r of membrosComuns) {
      const res = await WaveData.addMembro({
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

      if (res && res.ok) {
        sucessos++;
      } else {
        falhas++;
        ultimaFalhaMsg = res?.message || 'Falha ao salvar discípulo.';
      }
    }

    await WaveData.syncSupabase();

    if (falhas === 0) {
      WaveApp.showToast(`✅ ${sucessos} registro(s) importado(s) com sucesso!`, 'success');
      this._fileLoaded = false;
      this._rowsPreview = [];
      WaveApp.navigate('admin-membros');
    } else {
      WaveApp.showToast(`⚠️ Importação finalizada: ${sucessos} importados, ${falhas} falhas. (${ultimaFalhaMsg})`, 'danger');
      if (sucessos > 0) {
        this._fileLoaded = false;
        this._rowsPreview = [];
        WaveApp.navigate('admin-membros');
      }
    }
  }
};
