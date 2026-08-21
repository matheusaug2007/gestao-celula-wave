/* ============================================
   WAVE CÉLULAS — Store de Dados & Regras de Negócio
   Comunidade Cristã Wave
   ============================================ */

window.WaveData = {

  currentUser: {
    id: null,
    nome: '',
    foto: null,
    whatsapp: '',
    sexo: '',
    email: '',
    role: 'ADMIN'
  },

  membros: [],
  celulas: [],

  igrejaStats: {
    totalMembros: 0,
    totalCelulas: 0,
    totalLideres: 0,
    novosMembrosEsteMes: 0
  },

  todosLideres: [],
  todosMembrosIgreja: [],

  normalizarFaixaEtariaItem(val) {
    if (!val) return 'Adulto';
    const v = String(val).trim();
    const map = {
      'kids': 'Kids',
      'teens': 'Teens',
      'adolescente': 'Adolescente',
      'adolescentes': 'Adolescente',
      'jovem adulto': 'Jovem Adulto',
      'jovens': 'Jovem Adulto',
      'jovem': 'Jovem Adulto',
      'adulto': 'Adulto',
      'adultos': 'Adulto',
      'ripe': 'Adulto',
      'movement': 'Jovem Adulto'
    };
    const lower = v.toLowerCase();
    if (map[lower]) return map[lower];
    const validas = ['Kids', 'Teens', 'Adolescente', 'Jovem Adulto', 'Adulto'];
    const encontrada = validas.find(f => f.toLowerCase() === lower);
    return encontrada || 'Adulto';
  },

  getFaixasArray(faixa) {
    if (!faixa) return ['Adulto'];
    if (Array.isArray(faixa)) {
      return faixa.length > 0 ? faixa.map(f => this.normalizarFaixaEtariaItem(f)) : ['Adulto'];
    }
    const parts = String(faixa).split(/[,·\/+;]/).map(s => s.trim()).filter(Boolean);
    if (parts.length === 0) return ['Adulto'];
    return [...new Set(parts.map(p => this.normalizarFaixaEtariaItem(p)))];
  },

  formatFaixaEtaria(faixa) {
    const arr = this.getFaixasArray(faixa);
    return arr.join(' · ');
  },

  getFaixaBadgeClass(faixaItem) {
    const norm = this.normalizarFaixaEtariaItem(faixaItem);
    switch (norm) {
      case 'Teens': return 'badge-faixa-teens';
      case 'Adolescente': return 'badge-faixa-adolescente';
      case 'Jovem Adulto': return 'badge-faixa-jovem-adulto';
      case 'Kids': return 'badge-faixa-kids';
      case 'Adulto':
      default: return 'badge-faixa-adulto';
    }
  },

  renderFaixaEtariaBadges(faixa, extraStyle = '') {
    const arr = this.getFaixasArray(faixa);
    return arr.map(f => {
      const cls = this.getFaixaBadgeClass(f);
      return `<span class="badge ${cls}" style="${extraStyle}">${f}</span>`;
    }).join('');
  },

  celulaContemFaixa(c, faixaAlvo) {
    if (!faixaAlvo || faixaAlvo === 'todos') return true;
    const faixas = this.getFaixasArray(c.faixaEtaria);
    return faixas.some(f => f.toLowerCase() === faixaAlvo.toLowerCase());
  },

  normalizarFaixaEtaria(val) {
    return this.getFaixasArray(val);
  },

  async syncSupabase() {
    try {
      if (window.WaveSupabase) {
        const pessoasDB = await WaveSupabase.fetchPessoas();
        if (pessoasDB && pessoasDB.length > 0) {
          this.membros = pessoasDB.map(p => this._parsePessoaFromDB(p));
          this.recalcularEstatisticas();

          // Migração pontual de dados legados no Supabase (ex: 'RIPE', 'Movement', etc.) e autorreferência
          for (const p of pessoasDB) {
            let precisouMigrar = false;
            let celulas = [];
            try {
              celulas = typeof p.celulas_json === 'string' ? JSON.parse(p.celulas_json) : (p.celulas_json || []);
            } catch (e) { celulas = []; }

            const celulasNormalizadas = celulas.map(c => {
              const fNormalizada = this.normalizarFaixaEtaria(c.faixaEtaria);
              if (c.faixaEtaria !== fNormalizada) precisouMigrar = true;
              return { ...c, faixaEtaria: fNormalizada };
            });

            if (precisouMigrar) {
              WaveSupabase.updatePessoa(p.id, {
                celulas_json: JSON.stringify(celulasNormalizadas)
              }).catch(e => console.warn('Erro ao migrar dado legado no Supabase:', e));
            }

            // Sanitização de autorreferência (líder apontando para si mesmo)
            const nomeL = (p.nome || '').trim().toLowerCase();
            const liderL = (p.lider || '').trim().toLowerCase();
            if (liderL && liderL !== '—' && (liderL === nomeL || nomeL.includes(liderL) || liderL.includes(nomeL))) {
              WaveSupabase.updatePessoa(p.id, { lider: '—' }).catch(e => console.warn('Erro ao limpar autorreferência:', e));
            }
          }
        }
      }
    } catch (err) {
      console.warn('Falha na sincronização Supabase:', err);
    }

    if (window.WaveApp && window.WaveApp.renderCurrentPage) {
      WaveApp.renderCurrentPage();
    }
  },

  _parsePessoaFromDB(p) {
    let celulasParsed = [];
    if (p.celulas_json) {
      try {
        celulasParsed = typeof p.celulas_json === 'string' ? JSON.parse(p.celulas_json) : p.celulas_json;
      } catch (e) {
        celulasParsed = [];
      }
    }

    // Normaliza todas as faixas etárias das células parsed
    celulasParsed = (celulasParsed || []).map(c => ({
      ...c,
      faixaEtaria: this.normalizarFaixaEtaria(c.faixaEtaria)
    }));

    // Fallback caso tenha dia_encontro legado e e_lider
    if (celulasParsed.length === 0 && p.e_lider) {
      celulasParsed.push({
        id: 'cel-' + p.id + '-1',
        finalidade: 'Evangelística',
        faixaEtaria: this.normalizarFaixaEtaria(p.faixa_etaria_lider || 'Adulto'),
        diaSemana: p.dia_encontro || 'Quinta',
        horario: p.horario_encontro || '20:00',
        tipoEndereco: 'residencial',
        rua: p.rua || '',
        numero: p.numero || '',
        bairro: p.bairro || '',
        cidade: p.cidade || 'Mandaguari',
        complemento: p.complemento || ''
      });
    }

    // Sanitiza autorreferência no campo lider
    let liderParsed = p.lider || '—';
    const nomeLimpo = (p.nome || '').trim().toLowerCase();
    const liderLimpo = (p.lider || '').trim().toLowerCase();
    if (liderLimpo && liderLimpo !== '—' && (liderLimpo === nomeLimpo || nomeLimpo.includes(liderLimpo) || liderLimpo.includes(nomeLimpo))) {
      liderParsed = '—';
    }

    return {
      id: p.id,
      nome: p.nome,
      foto: p.foto_url || null,
      whatsapp: p.whatsapp || '',
      dataNascimento: p.data_nascimento || '',
      dataIngresso: p.data_ingresso || p.criado_em ? p.criado_em.split('T')[0] : new Date().toISOString().split('T')[0],
      tipoIngresso: p.tipo_ingresso || 'Recepção',
      sexo: p.sexo || 'MASCULINO',
      rua: p.rua || '',
      numero: p.numero || '',
      complemento: p.complemento || '',
      bairro: p.bairro || '',
      cidade: p.cidade || 'Mandaguari',
      status: p.status || 'ATIVO',
      lider: liderParsed,
      eLider: p.e_lider ?? false,
      celulas: celulasParsed
    };
  },

  recalcularEstatisticas() {
    this.todosMembrosIgreja = [...this.membros];
    const membrosAtivos = this.membros.filter(m => m.status === 'ATIVO');
    this.todosLideres = membrosAtivos.filter(m => m.eLider === true && m.celulas && m.celulas.length > 0);

    // Contagem de células ativas
    let totalCelulasAtivas = 0;
    this.todosLideres.forEach(l => {
      totalCelulasAtivas += (l.celulas || []).length;
    });

    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();

    const novosMes = membrosAtivos.filter(m => {
      if (!m.dataIngresso) return false;
      const d = new Date(m.dataIngresso);
      return d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
    }).length;

    this.igrejaStats.totalMembros = membrosAtivos.length;
    this.igrejaStats.totalLideres = this.todosLideres.length;
    this.igrejaStats.totalCelulas = totalCelulasAtivas;
    this.igrejaStats.novosMembrosEsteMes = novosMes;
  },

  getMembroById(id) {
    return this.membros.find(m => m.id === id);
  },

  getAllMembrosIgreja() {
    return this.membros;
  },

  getMembroByNome(nome) {
    if (!nome || nome === '—') return null;
    const clean = nome.trim().toLowerCase();
    return this.membros.find(m => m.nome.trim().toLowerCase() === clean);
  },

  getAllLideresAtivos() {
    return this.membros.filter(m => m.eLider === true && m.status === 'ATIVO');
  },

  getLideresPorSexo(sexo) {
    return this.getAllLideresAtivos().filter(l => l.sexo === sexo);
  },

  getDiscipulosByLider(liderNome) {
    if (!liderNome || liderNome === '—') return [];
    const cleanLider = liderNome.trim().toLowerCase();
    const primeirONomeLider = cleanLider.split(/\s+/).slice(0, 2).join(' ');
    return this.membros.filter(m => {
      if (!m.lider || m.lider === '—' || m.status !== 'ATIVO') return false;

      // Exclusão explícita do próprio líder para evitar autorreferência (Bug 1 - Crítico)
      const cleanMembroNome = (m.nome || '').trim().toLowerCase();
      const primeirONomeMembro = cleanMembroNome.split(/\s+/).slice(0, 2).join(' ');
      if (cleanMembroNome === cleanLider || primeirONomeMembro === primeirONomeLider) return false;

      const mLider = m.lider.trim().toLowerCase();
      return mLider.includes(primeirONomeLider) || primeirONomeLider.includes(mLider);
    });
  },

  getDiscipulosTodosStatusByLider(liderNome) {
    if (!liderNome || liderNome === '—') return [];
    const cleanLider = liderNome.trim().toLowerCase();
    const primeirONomeLider = cleanLider.split(/\s+/).slice(0, 2).join(' ');
    return this.membros.filter(m => {
      if (!m.lider || m.lider === '—') return false;

      // Exclusão explícita do próprio líder para evitar autorreferência (Bug 1 - Crítico)
      const cleanMembroNome = (m.nome || '').trim().toLowerCase();
      const primeirONomeMembro = cleanMembroNome.split(/\s+/).slice(0, 2).join(' ');
      if (cleanMembroNome === cleanLider || primeirONomeMembro === primeirONomeLider) return false;

      const mLider = m.lider.trim().toLowerCase();
      return mLider.includes(primeirONomeLider) || primeirONomeLider.includes(mLider);
    });
  },

  getDiscipulosLideresByLider(liderNome) {
    const discipulos = this.getDiscipulosByLider(liderNome);
    return discipulos.filter(d => d.eLider === true);
  },

  liderTemCelulaLideranca(liderNome) {
    const lider = this.getMembroByNome(liderNome);
    if (!lider || !lider.celulas) return false;
    return lider.celulas.some(c => c.finalidade === 'Liderança');
  },

  // Ponto 1: Validação de Célula de Liderança Obrigatória
  validarLideradoVirarLider(liderResponsavelNome) {
    if (!liderResponsavelNome || liderResponsavelNome === '—') {
      return { ok: true };
    }
    const lider = this.getMembroByNome(liderResponsavelNome);
    if (!lider) return { ok: true };

    const temLideranca = this.liderTemCelulaLideranca(liderResponsavelNome);
    if (!temLideranca) {
      return {
        ok: false,
        message: `Para que este membro se torne líder, ${lider.nome} precisa ter uma célula de Liderança cadastrada. Cadastre-a antes de continuar.`
      };
    }
    return { ok: true };
  },

  // Ponto 16: Validação de Mesmo Sexo entre Líder e Discípulo
  validarMesmoSexo(membroSexo, liderResponsavelNome) {
    if (!liderResponsavelNome || liderResponsavelNome === '—') return { ok: true };
    const lider = this.getMembroByNome(liderResponsavelNome);
    if (!lider) return { ok: true };

    if (lider.sexo !== membroSexo) {
      return {
        ok: false,
        message: `Inconsistência de Gênero: O discípulo (${membroSexo === 'MASCULINO' ? 'Masculino' : 'Feminino'}) não pode ser liderado por um líder do sexo oposto (${lider.nome} - ${lider.sexo === 'MASCULINO' ? 'Masculino' : 'Feminino'}). Selecione um líder do mesmo sexo.`
      };
    }
    return { ok: true };
  },

  // Ponto 8: Alerta de Duplicata (Nome Completo + Data de Nascimento)
  isDuplicado(nome, dataNasc, idIgnorar = null) {
    if (!nome || !dataNasc) return false;
    const nClean = nome.trim().toLowerCase();
    return this.membros.some(m => {
      if (idIgnorar && m.id === idIgnorar) return false;
      const mNome = (m.nome || '').trim().toLowerCase();
      return mNome === nClean && m.dataNascimento === dataNasc;
    });
  },

  // Ponto 6: Campos calculados
  calcIdade(dataNascimento) {
    if (!dataNascimento) return 0;
    const hoje = new Date();
    const nasc = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nasc.getFullYear();
    const m = hoje.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
    return idade;
  },

  calcTempoMembro(dataIngresso) {
    if (!dataIngresso) return 'Recente';
    const hoje = new Date();
    const ingresso = new Date(dataIngresso);
    let anos = hoje.getFullYear() - ingresso.getFullYear();
    let meses = hoje.getMonth() - ingresso.getMonth();

    if (meses < 0) {
      anos--;
      meses += 12;
    }

    if (anos > 0) {
      return meses > 0 ? `${anos} ano(s) e ${meses} m` : `${anos} ano(s)`;
    }
    return meses > 0 ? `${meses} mês(es)` : 'Menos de 1 mês';
  },

  calcInfoLideranca(membro) {
    if (!membro.eLider) return null;
    const discipulos = this.getDiscipulosByLider(membro.nome);
    const celulasEvang = (membro.celulas || []).filter(c => c.finalidade === 'Evangelística').length;
    return {
      totalDiscipulos: discipulos.length,
      celulasEvangelisticas: celulasEvang
    };
  },

  // Ponto 11: Aniversariantes do Mês Corrente
  getAniversariantesDoMes(mesAlvo = new Date().getMonth()) {
    return this.membros.filter(m => {
      if (!m.dataNascimento || m.status !== 'ATIVO') return false;
      const nasc = new Date(m.dataNascimento);
      return nasc.getMonth() === mesAlvo;
    }).sort((a, b) => {
      const dA = new Date(a.dataNascimento).getDate();
      const dB = new Date(b.dataNascimento).getDate();
      return dA - dB;
    });
  },

  getModelosAniversario() {
    const padroes = [
      {
        id: 'espiritual',
        titulo: '🕊️ Espiritual / Pastoral',
        descricao: 'Bíblica, inspiradora e abençoadora',
        template: 'Paz do Senhor, {nome}! Parabéns{complementoIdade}! Que o Senhor continue derramando bênçãos sem medida sobre a sua vida, te fortalecendo a cada dia e realizando os desejos do seu coração segundo a vontade Dele. É uma alegria imensa ter você caminhando conosco na Wave. Conte sempre com as nossas orações! 🙏✨'
      },
      {
        id: 'descontraida',
        titulo: '🎉 Descontraída & Animada',
        descricao: 'Alegre, comemorativa e descontraída',
        template: 'Fala {nome}, parabéns pelo seu dia! 🎂🚀 Que seu novo ano seja incrível, cheio de momentos felizes, muitas risadas, conquistas e churrasco pra comemorar! Tamo junto na Wave, aproveita muito seu dia! 🎈🥳'
      },
      {
        id: 'afetuosa',
        titulo: '💛 Acolhedora & Fraterna',
        descricao: 'Carinhosa, próxima e de profunda consideração',
        template: 'Feliz aniversário, {nome} {tratamento}! 💛 Desejo que o seu dia seja repleto de paz, alegria e muito amor ao lado de quem você ama. Sua vida é um presente e uma bênção em nossa comunidade Wave. Um abraço bem apertado e parabéns! ✨'
      },
      {
        id: 'formal',
        titulo: '📜 Clássica & Formal',
        descricao: 'Sóbria, elegante e institucional',
        template: 'Prezado(a) {nome}, em nome de toda a Comunidade Wave, desejamos a você um feliz aniversário! Que este novo ciclo seja de prosperidade, saúde e contínuo crescimento. Parabéns por esta data tão significativa.'
      }
    ];

    try {
      const custom = localStorage.getItem('wave_modelos_aniversario_custom');
      if (custom) {
        const customArr = JSON.parse(custom);
        if (Array.isArray(customArr)) {
          return [...padroes, ...customArr];
        }
      }
    } catch (e) {}

    return padroes;
  },

  salvarNovoModeloAniversario(titulo, template) {
    if (!titulo || !template) return false;
    const novo = {
      id: 'custom-' + Date.now(),
      titulo: '✍️ ' + titulo,
      descricao: 'Modelo personalizado',
      template: template,
      isCustom: true
    };
    try {
      const customStr = localStorage.getItem('wave_modelos_aniversario_custom');
      const customArr = customStr ? JSON.parse(customStr) : [];
      customArr.push(novo);
      localStorage.setItem('wave_modelos_aniversario_custom', JSON.stringify(customArr));
      return true;
    } catch (e) {
      return false;
    }
  },

  removerModeloAniversario(modeloId) {
    try {
      const customStr = localStorage.getItem('wave_modelos_aniversario_custom');
      if (customStr) {
        let customArr = JSON.parse(customStr);
        customArr = customArr.filter(m => m.id !== modeloId);
        localStorage.setItem('wave_modelos_aniversario_custom', JSON.stringify(customArr));
      }
    } catch (e) {}
  },

  gerarMensagemParabens(membro, modeloId = 'espiritual') {
    const nome = membro.nome ? membro.nome.split(' ')[0] : 'Irmão(ã)';
    const idade = membro.dataNascimento ? this.calcIdade(membro.dataNascimento) : null;
    const sexo = membro.sexo || 'MASCULINO';
    const tratamento = sexo === 'MASCULINO' ? 'querido' : 'querida';
    const complementoIdade = idade ? ` pelos seus ${idade} anos de vida` : '';

    const modelos = this.getModelosAniversario();
    const modelo = modelos.find(m => m.id === modeloId) || modelos[0];

    let texto = (modelo && modelo.template) ? modelo.template : '';
    texto = texto.replace(/\{nome\}/g, nome);
    texto = texto.replace(/\{tratamento\}/g, tratamento);
    texto = texto.replace(/\{idade\}/g, idade ? String(idade) : '');
    texto = texto.replace(/\{complementoIdade\}/g, complementoIdade);

    return texto;
  },

  async redistribuirDiscipulos(liderOrigemNome, novoLiderNome) {
    const discipulos = this.getDiscipulosTodosStatusByLider(liderOrigemNome);
    for (const d of discipulos) {
      d.lider = novoLiderNome;
      if (window.WaveSupabase) {
        await WaveSupabase.updatePessoa(d.id, { lider: novoLiderNome });
      }
    }
    this.recalcularEstatisticas();
  },

  async inativarMembro(membroId) {
    const membro = this.getMembroById(membroId);
    if (!membro) return;

    membro.status = 'INATIVO';

    // Ponto 4: Ao inativar líder, todas as suas células são encerradas
    if (membro.eLider) {
      membro.eLider = false;
      membro.celulas = [];
    }

    if (window.WaveSupabase) {
      await WaveSupabase.updatePessoa(membroId, {
        status: 'INATIVO',
        e_lider: false,
        celulas_json: JSON.stringify([])
      });
    }

    this.recalcularEstatisticas();
  },

  // Ponto 20 (v1.3): Fechar uma célula individual sem inativar o líder
  async fecharCelulaIndividual(liderId, celulaId) {
    const lider = this.getMembroById(liderId);
    if (!lider || !lider.celulas) return { ok: false, message: 'Líder não encontrado.' };

    const celulaIndex = lider.celulas.findIndex(c => c.id === celulaId);
    if (celulaIndex === -1) return { ok: false, message: 'Célula não encontrada.' };

    const celulaParaFechar = lider.celulas[celulaIndex];
    const celulasEvangRestantes = lider.celulas.filter(c => c.finalidade === 'Evangelística' && c.id !== celulaId);

    // Se for a última célula Evangelística:
    if (celulaParaFechar.finalidade === 'Evangelística' && celulasEvangRestantes.length === 0) {
      return {
        ok: false,
        message: 'Todo líder precisa de ao menos 1 célula Evangelística ativa. Inative o próprio líder em vez de fechar esta célula, se for o caso.'
      };
    }

    // Remove a célula da lista do líder
    lider.celulas.splice(celulaIndex, 1);

    if (window.WaveSupabase) {
      await WaveSupabase.updatePessoa(liderId, {
        celulas_json: JSON.stringify(lider.celulas)
      });
    }

    this.recalcularEstatisticas();
    return { ok: true };
  },

  async reativarMembro(membroId, novoLiderResponsavel, reativarComoLider, novasCelulas = []) {
    const membro = this.getMembroById(membroId);
    if (!membro) return;

    membro.status = 'ATIVO';
    membro.lider = novoLiderResponsavel || '—';
    membro.eLider = reativarComoLider;
    membro.celulas = reativarComoLider ? novasCelulas : [];

    if (window.WaveSupabase) {
      await WaveSupabase.updatePessoa(membroId, {
        status: 'ATIVO',
        lider: membro.lider,
        e_lider: membro.eLider,
        celulas_json: JSON.stringify(membro.celulas)
      });
    }

    this.recalcularEstatisticas();
  },

  async addMembro(membro) {
    const payload = {
      nome: membro.nome ? membro.nome.trim() : '',
      whatsapp: membro.whatsapp ? membro.whatsapp.trim() : null,
      data_nascimento: membro.dataNascimento || null,
      data_ingresso: membro.dataIngresso || new Date().toISOString().split('T')[0],
      tipo_ingresso: membro.tipoIngresso || 'Recepção',
      sexo: membro.sexo || 'FEMININO',
      rua: membro.rua ? membro.rua.trim() : null,
      numero: membro.numero ? membro.numero.trim() : null,
      complemento: membro.complemento ? membro.complemento.trim() : null,
      bairro: membro.bairro ? membro.bairro.trim() : null,
      cidade: membro.cidade ? membro.cidade.trim() : 'Mandaguari',
      status: membro.status || 'ATIVO',
      e_lider: membro.eLider ?? false,
      lider: membro.lider || '—',
      celulas_json: membro.celulas || []
    };

    if (window.WaveSupabase) {
      const saved = await WaveSupabase.addPessoa(payload);
      if (saved && saved.id) {
        membro.id = saved.id;
      }
    }

    this.membros.push(membro);
    this.recalcularEstatisticas();
  },

  async updateMembro(membroId, dadosAtualizados) {
    const idx = this.membros.findIndex(m => m.id === membroId);
    if (idx !== -1) {
      this.membros[idx] = { ...this.membros[idx], ...dadosAtualizados };

      const payload = {
        nome: this.membros[idx].nome ? this.membros[idx].nome.trim() : '',
        whatsapp: this.membros[idx].whatsapp ? this.membros[idx].whatsapp.trim() : null,
        data_nascimento: this.membros[idx].dataNascimento || null,
        data_ingresso: this.membros[idx].dataIngresso || null,
        tipo_ingresso: this.membros[idx].tipoIngresso || 'Recepção',
        sexo: this.membros[idx].sexo || 'FEMININO',
        rua: this.membros[idx].rua ? this.membros[idx].rua.trim() : null,
        numero: this.membros[idx].numero ? this.membros[idx].numero.trim() : null,
        complemento: this.membros[idx].complemento ? this.membros[idx].complemento.trim() : null,
        bairro: this.membros[idx].bairro ? this.membros[idx].bairro.trim() : null,
        cidade: this.membros[idx].cidade ? this.membros[idx].cidade.trim() : 'Mandaguari',
        status: this.membros[idx].status || 'ATIVO',
        e_lider: this.membros[idx].eLider ?? false,
        lider: this.membros[idx].lider || '—',
        celulas_json: this.membros[idx].celulas || []
      };

      if (window.WaveSupabase) {
        await WaveSupabase.updatePessoa(membroId, payload);
      }

      this.recalcularEstatisticas();
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  WaveData.syncSupabase();
});
