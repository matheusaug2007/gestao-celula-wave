/* ============================================
   CONFIGURAÇÕES E CONSTANTES
   ============================================ */

const CONFIG = {
  API_URL: 'http://localhost:5180/api',
  TOKEN_KEY: 'cadastro_membros_token',
  USER_KEY: 'cadastro_membros_user',
  DEMO_MODE_KEY: 'cadastro_membros_demo_mode',
  DEMO_MEMBERS_KEY: 'cadastro_membros_demo_members',
  DEMO_CELLS_KEY: 'cadastro_membros_demo_cells',
  DEMO_USERS_KEY: 'cadastro_membros_demo_users',
  DEMO_VERSION_KEY: 'cadastro_membros_demo_version',
  CHURCH_NAME: 'Comunidade Crista Wave',
  TIMEOUT: 10000
};

const DEMO_VERSION = '5';

const DEMO_LEADERS = [
  { id: '90000000-0000-0000-0000-000000000001', fullName: 'Pastor Rafael Miamoto', category: 'Adulto' },
  { id: '90000000-0000-0000-0000-000000000002', fullName: 'Pastora Flávia Miamoto', category: 'Adulto' }
];

const DEMO_CELLS_BASE = [
  {
    id: 'c-90000000-0000-0000-0000-000000000001',
    name: 'Célula Pastor Rafael Miamoto',
    audience: 'homens',
    meetingDay: 2,
    meetingTime: '19:30:00',
    neighborhood: 'Centro',
    city: 'Mandaguari - PR',
    street: 'Rua da Consolacao',
    number: '101',
    complement: null,
    types: ['Adulto'],
    leaderId: '90000000-0000-0000-0000-000000000001'
  },
  {
    id: 'c-90000000-0000-0000-0000-000000000002',
    name: 'Célula Pastora Flávia Miamoto',
    audience: 'mulheres',
    meetingDay: 4,
    meetingTime: '20:00:00',
    neighborhood: 'Vila Mariana',
    city: 'Mandaguari - PR',
    street: 'Rua Vergueiro',
    number: '202',
    complement: null,
    types: ['Adulto'],
    leaderId: '90000000-0000-0000-0000-000000000002'
  }
];

const DEMO_MEMBER_NAMES = [
  'Lucas Almeida', 'Mariana Alves', 'Pedro Santos', 'Camila Rocha', 'Thiago Martins',
  'Beatriz Lima', 'Gabriel Costa', 'Juliana Ferreira', 'Bruno Carvalho', 'Larissa Oliveira',
  'Felipe Barros', 'Renata Gomes', 'Diego Nunes', 'Patricia Mendes', 'Vinicius Araujo',
  'Aline Ribeiro', 'Rafael Souza', 'Debora Teixeira', 'Eduardo Campos', 'Vanessa Pinto',
  'Marcelo Dias', 'Tatiane Moraes', 'Ricardo Freitas', 'Priscila Duarte', 'Andre Batista',
  'Natalia Rezende', 'Leandro Cardoso', 'Jessica Faria', 'Rodrigo Pires', 'Simone Castro',
  'Daniel Tavares', 'Bianca Lopes', 'Caio Fernandes', 'Fernanda Coelho', 'Igor Sampaio',
  'Karina Melo', 'Wesley Cunha', 'Elaine Machado', 'Gustavo Peixoto', 'Monica Vieira',
  'Samuel Braga', 'Cristiane Neves', 'Heitor Ramos', 'Sabrina Torres', 'Jonathan Queiroz',
  'Milena Andrade', 'Cesar Maia', 'Paula Aguiar', 'Leonardo Prado', 'Isabela Monteiro'
];

const DEMO_MEMBERS_SEED = (() => {
  const pastorId = DEMO_LEADERS[0].id;
  const pastoraId = DEMO_LEADERS[1].id;
  const pastorCellId = DEMO_CELLS_BASE[0].id;
  const pastoraCellId = DEMO_CELLS_BASE[1].id;
  const categorias = ['Adulto', 'Teens', 'Adolescente', 'Kids'];

  const superiores = [
    {
      id: 'm-pastor-rafael',
      fullName: 'Pastor Rafael Miamoto',
      email: 'rafael.miamoto@wave.local',
      phone: '11990000001',
      birthDate: '1981-03-12',
      joinDate: '2010-02-01',
      joinType: 'Batismo',
      category: 'Adulto',
      addressStreet: 'Rua da Consolacao',
      addressNumber: '101',
      addressComplement: null,
      addressNeighborhood: 'Centro',
      addressCity: 'Mandaguari - PR',
      isActive: true,
      isCellLeader: true,
      leaderId: pastoraId,
      cellId: pastorCellId
    },
    {
      id: 'm-pastora-flavia',
      fullName: 'Pastora Flávia Miamoto',
      email: 'flavia.miamoto@wave.local',
      phone: '11990000002',
      birthDate: '1983-07-24',
      joinDate: '2011-03-05',
      joinType: 'Recepção',
      category: 'Adulto',
      addressStreet: 'Rua Vergueiro',
      addressNumber: '202',
      addressComplement: null,
      addressNeighborhood: 'Vila Mariana',
      addressCity: 'Mandaguari - PR',
      isActive: true,
      isCellLeader: true,
      leaderId: pastorId,
      cellId: pastoraCellId
    }
  ];

  const membros = DEMO_MEMBER_NAMES.map((nome, index) => {
    const usaPastor = index % 2 === 0;
    const leaderId = usaPastor ? pastorId : pastoraId;
    const cellId = usaPastor ? pastorCellId : pastoraCellId;
    const numero = String(index + 1).padStart(3, '0');
    const mes = String((index % 12) + 1).padStart(2, '0');
    const dia = String((index % 28) + 1).padStart(2, '0');
    const anoNasc = 1986 + (index % 16);
    const anoIngresso = 2016 + (index % 8);

    return {
      id: `m-${numero}`,
      fullName: nome,
      email: `membro${numero}@wave.local`,
      phone: `11991${String(10000 + index).slice(-5)}`,
      birthDate: `${anoNasc}-${mes}-${dia}`,
      joinDate: `${anoIngresso}-${mes}-${dia}`,
      joinType: index % 2 === 0 ? 'Batismo' : 'Recepção',
      category: categorias[index % categorias.length],
      addressStreet: `Rua ${index % 2 === 0 ? 'Esperanca' : 'Vitoria'}`,
      addressNumber: String(300 + index),
      addressComplement: null,
      addressNeighborhood: index % 2 === 0 ? 'Centro' : 'Vila Mariana',
      addressCity: 'Mandaguari - PR',
      isActive: true,
      isCellLeader: false,
      leaderId,
      cellId
    };
  });

  return [...superiores, ...membros];
})();

const DEMO_CELLS = DEMO_CELLS_BASE.map(celula => ({
  ...celula,
  leader: DEMO_LEADERS.find(l => l.id === celula.leaderId) || null,
  members: DEMO_MEMBERS_SEED
    .filter(membro => membro.cellId === celula.id)
    .map(membro => ({ id: membro.id }))
}));

const DEMO_MEMBERS = DEMO_MEMBERS_SEED.map(membro => {
  const leader = DEMO_LEADERS.find(l => l.id === membro.leaderId) || null;
  const cell = DEMO_CELLS.find(c => c.id === membro.cellId) || null;

  return {
    ...membro,
    leader,
    cell: cell ? { id: cell.id, name: cell.name } : null
  };
});

const DEMO_DATA = {
  lideres: DEMO_LEADERS,
  usuarios: [
    {
      id: '00000000-0000-0000-0000-000000000001',
      fullName: 'Administrador Demo',
      email: 'admin@wave.local',
      role: 'Admin',
      isActive: true,
      createdAt: '2026-01-10T10:00:00.000Z',
      temporaryPassword: 'Temp@2026'
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      fullName: 'Secretaria Demo',
      email: 'secretaria@wave.local',
      role: 'Secretary',
      isActive: true,
      createdAt: '2026-02-01T13:00:00.000Z',
      temporaryPassword: 'Temp@2026'
    }
  ],
  celulas: DEMO_CELLS,
  membros: DEMO_MEMBERS
};

class ModoVisual {
  static ativo() {
    return localStorage.getItem(CONFIG.DEMO_MODE_KEY) === '1';
  }

  static ativar() {
    localStorage.setItem(CONFIG.DEMO_MODE_KEY, '1');

    const versaoAtual = localStorage.getItem(CONFIG.DEMO_VERSION_KEY);
    if (versaoAtual !== DEMO_VERSION) {
      // Em troca de versão, sempre atualiza a base demo para refletir a massa mais recente.
      localStorage.setItem(CONFIG.DEMO_MEMBERS_KEY, JSON.stringify(DEMO_DATA.membros));
      localStorage.setItem(CONFIG.DEMO_CELLS_KEY, JSON.stringify(DEMO_DATA.celulas));
      localStorage.setItem(CONFIG.DEMO_USERS_KEY, JSON.stringify(DEMO_DATA.usuarios));

      localStorage.setItem(CONFIG.DEMO_VERSION_KEY, DEMO_VERSION);
      return;
    }

    if (!localStorage.getItem(CONFIG.DEMO_MEMBERS_KEY)) {
      localStorage.setItem(CONFIG.DEMO_MEMBERS_KEY, JSON.stringify(DEMO_DATA.membros));
    }

    if (!localStorage.getItem(CONFIG.DEMO_CELLS_KEY)) {
      localStorage.setItem(CONFIG.DEMO_CELLS_KEY, JSON.stringify(DEMO_DATA.celulas));
    }

    if (!localStorage.getItem(CONFIG.DEMO_USERS_KEY)) {
      localStorage.setItem(CONFIG.DEMO_USERS_KEY, JSON.stringify(DEMO_DATA.usuarios));
    }
  }

  static desativar() {
    localStorage.removeItem(CONFIG.DEMO_MODE_KEY);
    localStorage.removeItem(CONFIG.DEMO_MEMBERS_KEY);
    localStorage.removeItem(CONFIG.DEMO_CELLS_KEY);
    localStorage.removeItem(CONFIG.DEMO_USERS_KEY);
    localStorage.removeItem(CONFIG.DEMO_VERSION_KEY);
  }

  static membros() {
    const raw = localStorage.getItem(CONFIG.DEMO_MEMBERS_KEY);
    if (!raw) {
      localStorage.setItem(CONFIG.DEMO_MEMBERS_KEY, JSON.stringify(DEMO_DATA.membros));
      return [...DEMO_DATA.membros];
    }
    return JSON.parse(raw);
  }

  static salvarMembros(membros) {
    localStorage.setItem(CONFIG.DEMO_MEMBERS_KEY, JSON.stringify(membros));
  }

  static celulas() {
    const raw = localStorage.getItem(CONFIG.DEMO_CELLS_KEY);
    if (!raw) {
      localStorage.setItem(CONFIG.DEMO_CELLS_KEY, JSON.stringify(DEMO_DATA.celulas));
      return [...DEMO_DATA.celulas];
    }
    return JSON.parse(raw);
  }

  static salvarCelulas(celulas) {
    localStorage.setItem(CONFIG.DEMO_CELLS_KEY, JSON.stringify(celulas));
  }

  static usuarios() {
    const raw = localStorage.getItem(CONFIG.DEMO_USERS_KEY);
    if (!raw) {
      localStorage.setItem(CONFIG.DEMO_USERS_KEY, JSON.stringify(DEMO_DATA.usuarios));
      return [...DEMO_DATA.usuarios];
    }
    return JSON.parse(raw);
  }

  static salvarUsuarios(usuarios) {
    localStorage.setItem(CONFIG.DEMO_USERS_KEY, JSON.stringify(usuarios));
  }
}

/* ============================================
   GERENCIAMENTO DE TOKEN
   ============================================ */

class TokenManager {
  static salvarToken(token, expiresInMinutes) {
    localStorage.setItem(CONFIG.TOKEN_KEY, token);
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60000);
    localStorage.setItem('token_expires_at', expiresAt.toISOString());
  }

  static obterToken() {
    return localStorage.getItem(CONFIG.TOKEN_KEY);
  }

  static removerToken() {
    localStorage.removeItem(CONFIG.TOKEN_KEY);
    localStorage.removeItem('token_expires_at');
  }

  static estaExpirado() {
    const expiresAt = localStorage.getItem('token_expires_at');
    if (!expiresAt) return true;
    return new Date() > new Date(expiresAt);
  }

  static temToken() {
    const token = this.obterToken();
    return token && !this.estaExpirado();
  }
}

/* ============================================
   GERENCIAMENTO DE USUÁRIO
   ============================================ */

class UsuarioManager {
  static salvarUsuario(usuario) {
    localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(usuario));
  }

  static obterUsuario() {
    const usuario = localStorage.getItem(CONFIG.USER_KEY);
    return usuario ? JSON.parse(usuario) : null;
  }

  static removerUsuario() {
    localStorage.removeItem(CONFIG.USER_KEY);
  }

  static estaAutenticado() {
    return TokenManager.temToken() && this.obterUsuario();
  }
}

/* ============================================
   REQUISIÇÕES HTTP COM API
   ============================================ */

class ApiClient {
  static async fetch(url, opcoes = {}) {
    const urlCompleta = `${CONFIG.API_URL}${url}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...opcoes.headers
      },
      ...opcoes
    };

    if (TokenManager.temToken()) {
      config.headers.Authorization = `Bearer ${TokenManager.obterToken()}`;
    }

    try {
      const response = await fetch(urlCompleta, config);
      
      if (response.status === 401) {
        this.naoAutorizado();
        throw new Error('Não autorizado');
      }

      if (!response.ok) {
        const dados = await response.json().catch(() => ({}));
        throw {
          status: response.status,
          mensagem: dados.mensagem || dados.message || 'Erro na requisição',
          dados
        };
      }

      return await response.json();
    } catch (erro) {
      throw erro;
    }
  }

  static async get(url) {
    return this.fetch(url, { method: 'GET' });
  }

  static async post(url, dados) {
    return this.fetch(url, {
      method: 'POST',
      body: JSON.stringify(dados)
    });
  }

  static async patch(url, dados) {
    return this.fetch(url, {
      method: 'PATCH',
      body: JSON.stringify(dados)
    });
  }

  static async delete(url) {
    return this.fetch(url, { method: 'DELETE' });
  }

  static naoAutorizado() {
    ModoVisual.desativar();
    TokenManager.removerToken();
    UsuarioManager.removerUsuario();
    navegarPara('/login.html');
  }
}

/* ============================================
   ENDPOINTS - AUTENTICAÇÃO
   ============================================ */

class AuthApi {
  static async login(email, senha) {
    if (ModoVisual.ativo()) {
      return {
        accessToken: 'demo-token',
        expiresInMinutes: 720,
        user: {
          id: '00000000-0000-0000-0000-000000000001',
          fullName: 'Administrador Demo',
          email,
          role: 'Admin',
          tenantId: '00000000-0000-0000-0000-000000000100'
        }
      };
    }

    return ApiClient.post('/auth/login', { email, senha });
  }

  static async obterUsuarioAtual() {
    if (ModoVisual.ativo()) {
      return UsuarioManager.obterUsuario();
    }

    return ApiClient.get('/auth/me');
  }

  static logout() {
    ModoVisual.desativar();
    TokenManager.removerToken();
    UsuarioManager.removerUsuario();
    navegarPara('/login.html');
  }
}

/* ============================================
   ENDPOINTS - MEMBROS
   ============================================ */

class MembrosApi {
  static async listar(pagina = 1, tamanho = 10, filtro = {}) {
    if (ModoVisual.ativo()) {
      let itens = ModoVisual.membros();

      if (filtro.search) {
        const termo = filtro.search.toLowerCase();
        itens = itens.filter(x =>
          (x.fullName || '').toLowerCase().includes(termo) ||
          (x.email || '').toLowerCase().includes(termo) ||
          (x.phone || '').toLowerCase().includes(termo)
        );
      }

      if (filtro.email) {
        const email = filtro.email.toLowerCase();
        itens = itens.filter(x => (x.email || '').toLowerCase().includes(email));
      }

      if (filtro.phone) {
        const phone = filtro.phone.toLowerCase();
        itens = itens.filter(x => (x.phone || '').toLowerCase().includes(phone));
      }

      if (filtro.onlyActive !== undefined) {
        itens = itens.filter(x => x.isActive === filtro.onlyActive);
      }

      if (filtro.neighborhood) {
        const bairro = filtro.neighborhood.toLowerCase();
        itens = itens.filter(x => (x.addressNeighborhood || '').toLowerCase().includes(bairro));
      }

      if (filtro.leaderId) {
        itens = itens.filter(x => x.leaderId === filtro.leaderId);
      }

      if (filtro.cellId) {
        itens = itens.filter(x => x.cellId === filtro.cellId);
      }

      if (filtro.category) {
        const categoria = filtro.category.toLowerCase();
        itens = itens.filter(x => (x.category || '').toLowerCase() === categoria);
      }

      if (filtro.birthDate) {
        itens = itens.filter(x => (x.birthDate || '') === filtro.birthDate);
      }

      if (filtro.birthDateFrom) {
        itens = itens.filter(x => (x.birthDate || '') >= filtro.birthDateFrom);
      }

      if (filtro.birthDateTo) {
        itens = itens.filter(x => (x.birthDate || '') <= filtro.birthDateTo);
      }

      const totalItems = itens.length;
      const totalPages = Math.max(1, Math.ceil(totalItems / tamanho));
      const start = (pagina - 1) * tamanho;
      const pageItems = itens.slice(start, start + tamanho);

      return {
        items: pageItems,
        page: pagina,
        pageSize: tamanho,
        totalItems,
        totalPages
      };
    }

    const params = new URLSearchParams({
      page: pagina,
      pageSize: tamanho,
      ...(filtro.search && { search: filtro.search }),
      ...(filtro.email && { email: filtro.email }),
      ...(filtro.phone && { phone: filtro.phone }),
      ...(filtro.onlyActive !== undefined && { onlyActive: filtro.onlyActive }),
      ...(filtro.neighborhood && { neighborhood: filtro.neighborhood }),
      ...(filtro.leaderId && { leaderId: filtro.leaderId }),
      ...(filtro.cellId && { cellId: filtro.cellId }),
      ...(filtro.category && { category: filtro.category }),
      ...(filtro.birthDate && { birthDate: filtro.birthDate }),
      ...(filtro.birthDateFrom && { birthDateFrom: filtro.birthDateFrom }),
      ...(filtro.birthDateTo && { birthDateTo: filtro.birthDateTo })
    });

    return ApiClient.get(`/members?${params.toString()}`);
  }

  static async obter(id) {
    if (ModoVisual.ativo()) {
      return ModoVisual.membros().find(x => x.id === id) || null;
    }

    return ApiClient.get(`/members/${id}`);
  }

  static async criar(dados) {
    if (ModoVisual.ativo()) {
      const membros = ModoVisual.membros();
      const celulas = ModoVisual.celulas();
      const celula = celulas.find(c => c.id === dados.cellId);
      const lider = membros.find(x => x.id === dados.leaderId)
        || DEMO_DATA.lideres.find(l => l.id === dados.leaderId)
        || null;
      const novo = {
        id: `m${Date.now()}`,
        fullName: dados.fullName,
        birthDate: dados.birthDate,
        joinDate: dados.joinDate || null,
        joinType: dados.joinType || null,
        phone: dados.phone,
        email: dados.email,
        category: dados.category || 'Adulto',
        addressStreet: dados.addressStreet,
        addressNumber: dados.addressNumber,
        addressComplement: dados.addressComplement,
        addressNeighborhood: dados.addressNeighborhood,
        addressCity: dados.addressCity,
        leaderId: dados.leaderId,
        leader: lider,
        cellId: dados.cellId,
        cell: celula ? { id: celula.id, name: celula.name } : null,
        isCellLeader: !!dados.isCellLeader,
        isActive: true
      };
      membros.unshift(novo);
      ModoVisual.salvarMembros(membros);
      return novo;
    }

    return ApiClient.post('/members', dados);
  }

  static async atualizar(id, dados) {
    if (ModoVisual.ativo()) {
      const membros = ModoVisual.membros();
      const idx = membros.findIndex(x => x.id === id);

      if (idx < 0) {
        throw new Error('Membro não encontrado');
      }

      const celulas = ModoVisual.celulas();
      const celula = celulas.find(c => c.id === dados.cellId);
      const lider = membros.find(x => x.id === dados.leaderId)
        || DEMO_DATA.lideres.find(l => l.id === dados.leaderId)
        || null;

      membros[idx] = {
        ...membros[idx],
        ...dados,
        joinDate: dados.joinDate ?? membros[idx].joinDate ?? null,
        joinType: dados.joinType ?? membros[idx].joinType ?? null,
        addressComplement: dados.addressComplement ?? membros[idx].addressComplement ?? null,
        isCellLeader: dados.isCellLeader ?? membros[idx].isCellLeader ?? false,
        category: dados.category || membros[idx].category || 'Adulto',
        leader: lider || membros[idx].leader,
        cell: celula ? { id: celula.id, name: celula.name } : membros[idx].cell,
        id
      };

      ModoVisual.salvarMembros(membros);
      return membros[idx];
    }

    return ApiClient.patch(`/members/${id}`, dados);
  }

  static async inativar(id) {
    if (ModoVisual.ativo()) {
      const membros = ModoVisual.membros();
      const idx = membros.findIndex(x => x.id === id);
      if (idx >= 0) {
        membros[idx].isActive = false;
        ModoVisual.salvarMembros(membros);
      }
      return { success: true };
    }

    return ApiClient.patch(`/members/${id}/inactivate`, {});
  }

  static async reativar(id) {
    if (ModoVisual.ativo()) {
      const membros = ModoVisual.membros();
      const idx = membros.findIndex(x => x.id === id);
      if (idx >= 0) {
        membros[idx].isActive = true;
        ModoVisual.salvarMembros(membros);
      }
      return { success: true };
    }

    return ApiClient.patch(`/members/${id}/reactivate`, {});
  }

  static async importarCsv(arquivo) {
    if (ModoVisual.ativo()) {
      return {
        imported: 3,
        errors: 0,
        message: 'Importacao simulada em modo visual.'
      };
    }

    const formData = new FormData();
    formData.append('file', arquivo);

    return fetch(`${CONFIG.API_URL}/members/import-csv`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${TokenManager.obterToken()}`
      },
      body: formData
    }).then(res => res.json());
  }
}

/* ============================================
   ENDPOINTS - CÉLULAS
   ============================================ */

class CelulasApi {
  static async listar(pagina = 1, tamanho = 10) {
    if (ModoVisual.ativo()) {
      const cells = ModoVisual.celulas();
      const totalItems = cells.length;
      const totalPages = Math.max(1, Math.ceil(totalItems / tamanho));
      const start = (pagina - 1) * tamanho;
      return {
        items: cells.slice(start, start + tamanho),
        page: pagina,
        pageSize: tamanho,
        totalItems,
        totalPages
      };
    }

    const params = new URLSearchParams({ page: pagina, pageSize: tamanho });
    return ApiClient.get(`/cells?${params.toString()}`);
  }

  static async obter(id) {
    if (ModoVisual.ativo()) {
      return ModoVisual.celulas().find(x => x.id === id) || null;
    }

    return ApiClient.get(`/cells/${id}`);
  }

  static async criar(dados) {
    if (ModoVisual.ativo()) {
      const leader = DEMO_DATA.lideres.find(x => x.id === dados.leaderId)
        || ModoVisual.membros().find(x => x.id === dados.leaderId)
        || null;
      const nova = {
        id: `c${Date.now()}`,
        name: dados.name,
        audience: dados.audience || 'todas',
        meetingDay: Number(dados.meetingDay),
        meetingTime: dados.meetingTime,
        neighborhood: dados.neighborhood,
        city: dados.city,
        street: dados.street,
        number: dados.number,
        complement: dados.complement,
        types: Array.isArray(dados.types) ? dados.types : [],
        leaderId: dados.leaderId,
        leader,
        members: []
      };

      const cells = ModoVisual.celulas();
      cells.unshift(nova);
      ModoVisual.salvarCelulas(cells);
      return nova;
    }

    return ApiClient.post('/cells', dados);
  }

  static async atualizar(id, dados) {
    if (ModoVisual.ativo()) {
      const cells = ModoVisual.celulas();
      const idx = cells.findIndex(x => x.id === id);
      if (idx < 0) {
        throw new Error('Célula não encontrada');
      }

      const leader = DEMO_DATA.lideres.find(x => x.id === dados.leaderId)
        || ModoVisual.membros().find(x => x.id === dados.leaderId)
        || cells[idx].leader
        || null;

      cells[idx] = {
        ...cells[idx],
        ...dados,
        leader,
        id
      };

      ModoVisual.salvarCelulas(cells);
      return cells[idx];
    }

    return ApiClient.patch(`/cells/${id}`, dados);
  }
}

/* ============================================
   ENDPOINTS - LÍDERES/USUÁRIOS
   ============================================ */

class LideresApi {
  static async listar(pagina = 1, tamanho = 100) {
    if (ModoVisual.ativo()) {
      const totalItems = DEMO_DATA.lideres.length;
      const totalPages = Math.max(1, Math.ceil(totalItems / tamanho));
      const start = (pagina - 1) * tamanho;
      return {
        items: DEMO_DATA.lideres.slice(start, start + tamanho),
        page: pagina,
        pageSize: tamanho,
        totalItems,
        totalPages
      };
    }

    const params = new URLSearchParams({ page: pagina, pageSize: tamanho });
    return ApiClient.get(`/users?${params.toString()}`);
  }

  static async obter(id) {
    if (ModoVisual.ativo()) {
      return DEMO_DATA.lideres.find(x => x.id === id) || null;
    }

    return ApiClient.get(`/users/${id}`);
  }
}

class UsuariosApi {
  static async listar() {
    if (ModoVisual.ativo()) {
      return ModoVisual.usuarios().slice().sort((a, b) => (a.fullName || '').localeCompare(b.fullName || '', 'pt-BR'));
    }

    return ApiClient.get('/users');
  }

  static async criar(dados) {
    if (ModoVisual.ativo()) {
      const usuarios = ModoVisual.usuarios();
      const email = (dados.email || '').toLowerCase();
      const duplicado = usuarios.some(u => (u.email || '').toLowerCase() === email);
      if (duplicado) {
        throw {
          status: 409,
          mensagem: 'Este e-mail já está em uso por outro usuário.'
        };
      }

      const novo = {
        id: `u${Date.now()}`,
        fullName: dados.fullName,
        email,
        role: dados.role || 'Admin',
        isActive: true,
        createdAt: new Date().toISOString(),
        temporaryPassword: dados.temporaryPassword || ''
      };

      usuarios.push(novo);
      ModoVisual.salvarUsuarios(usuarios);
      return novo;
    }

    return ApiClient.post('/users', dados);
  }

  static async atualizar(id, dados) {
    if (ModoVisual.ativo()) {
      const usuarios = ModoVisual.usuarios();
      const idx = usuarios.findIndex(u => u.id === id);
      if (idx < 0) {
        throw {
          status: 404,
          mensagem: 'Usuário não encontrado.'
        };
      }

      const email = (dados.email || '').toLowerCase();
      const duplicado = usuarios.some(u => u.id !== id && (u.email || '').toLowerCase() === email);
      if (duplicado) {
        throw {
          status: 409,
          mensagem: 'Este e-mail já está em uso por outro usuário.'
        };
      }

      usuarios[idx] = {
        ...usuarios[idx],
        fullName: dados.fullName,
        email
      };

      ModoVisual.salvarUsuarios(usuarios);
      return usuarios[idx];
    }

    return ApiClient.patch(`/users/${id}`, dados);
  }

  static async inativar(id) {
    if (ModoVisual.ativo()) {
      const usuarioAtual = UsuarioManager.obterUsuario();
      if (usuarioAtual?.id === id) {
        throw {
          status: 403,
          mensagem: 'Você não pode inativar o seu próprio usuário.'
        };
      }

      const usuarios = ModoVisual.usuarios();
      const idx = usuarios.findIndex(u => u.id === id);
      if (idx < 0) {
        throw {
          status: 404,
          mensagem: 'Usuário não encontrado.'
        };
      }

      usuarios[idx].isActive = false;
      ModoVisual.salvarUsuarios(usuarios);
      return { success: true };
    }

    return ApiClient.patch(`/users/${id}/inactivate`, {});
  }

  static async reativar(id) {
    if (ModoVisual.ativo()) {
      const usuarios = ModoVisual.usuarios();
      const idx = usuarios.findIndex(u => u.id === id);
      if (idx < 0) {
        throw {
          status: 404,
          mensagem: 'Usuário não encontrado.'
        };
      }

      usuarios[idx].isActive = true;
      ModoVisual.salvarUsuarios(usuarios);
      return { success: true };
    }

    return ApiClient.patch(`/users/${id}/reactivate`, {});
  }
}

/* ============================================
   UTILITÁRIOS - FORMATAÇÃO
   ============================================ */

class Formatador {
  static data(dataString) {
    if (!dataString) return '';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  }

  static dataBR(dataString) {
    if (!dataString) return '';
    const data = new Date(dataString + 'T00:00:00');
    return data.toLocaleDateString('pt-BR');
  }

  static dataHora(dataString) {
    if (!dataString) return '';
    const data = new Date(dataString);
    return data.toLocaleString('pt-BR');
  }

  static telefone(telefone) {
    if (!telefone) return '';
    const apenasDigitos = telefone.replace(/\D/g, '');
    if (apenasDigitos.length === 11) {
      return `(${apenasDigitos.slice(0, 2)}) ${apenasDigitos.slice(2, 7)}-${apenasDigitos.slice(7)}`;
    }
    if (apenasDigitos.length === 10) {
      return `(${apenasDigitos.slice(0, 2)}) ${apenasDigitos.slice(2, 6)}-${apenasDigitos.slice(6)}`;
    }
    return telefone;
  }

  static email(email) {
    if (!email) return '';
    return email.toLowerCase();
  }

  static moeda(valor) {
    if (!valor) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  static porcentagem(valor, casas = 1) {
    if (valor === undefined || valor === null) return '0%';
    return (valor * 100).toFixed(casas) + '%';
  }
}

/* ============================================
   VALIDAÇÃO DE FORMULÁRIOS
   ============================================ */

class Validador {
  static email(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  static telefone(telefone) {
    const apenasDigitos = telefone.replace(/\D/g, '');
    return apenasDigitos.length >= 10 && apenasDigitos.length <= 11;
  }

  static dataNascimento(data) {
    const hoje = new Date();
    const dataNasc = new Date(data + 'T00:00:00');
    const idade = hoje.getFullYear() - dataNasc.getFullYear();
    return idade >= 13 && idade <= 150;
  }

  static obrigatorio(valor) {
    return valor && valor.toString().trim().length > 0;
  }

  static minimo(valor, minimo) {
    return valor && valor.toString().length >= minimo;
  }

  static maximo(valor, maximo) {
    return !valor || valor.toString().length <= maximo;
  }
}

/* ============================================
   NOTIFICAÇÕES E MENSAGENS
   ============================================ */

class Notificacao {
  static mostrar(mensagem, tipo = 'info', duracao = 5000) {
    const containerId = 'notificacoes-container';
    let container = document.getElementById(containerId);

    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      container.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        z-index: 3000;
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 400px;
      `;
      document.body.appendChild(container);
    }

    const alerta = document.createElement('div');
    alerta.className = `alerta alerta-${tipo}`;
    alerta.textContent = mensagem;
    alerta.style.cssText = `
      animation: slideInRight 0.4s ease-out;
      margin: 0;
    `;

    container.appendChild(alerta);

    if (duracao > 0) {
      setTimeout(() => {
        alerta.style.opacity = '0';
        alerta.style.transition = 'opacity 0.3s ease-out';
        setTimeout(() => alerta.remove(), 300);
      }, duracao);
    }

    return alerta;
  }

  static sucesso(mensagem, duracao = 5000) {
    return this.mostrar(mensagem, 'sucesso', duracao);
  }

  static erro(mensagem, duracao = 5000) {
    return this.mostrar(mensagem, 'erro', duracao);
  }

  static aviso(mensagem, duracao = 5000) {
    return this.mostrar(mensagem, 'aviso', duracao);
  }

  static info(mensagem, duracao = 5000) {
    return this.mostrar(mensagem, 'info', duracao);
  }
}

/* ============================================
   UTILITÁRIOS - MANIPULAÇÃO DOM
   ============================================ */

class DOM {
  static obter(seletor) {
    return document.querySelector(seletor);
  }

  static obterTodos(seletor) {
    return document.querySelectorAll(seletor);
  }

  static criar(tag, atributos = {}, conteudo = '') {
    const elemento = document.createElement(tag);
    Object.assign(elemento, atributos);
    if (conteudo) elemento.innerHTML = conteudo;
    return elemento;
  }

  static mostrar(elemento) {
    if (typeof elemento === 'string') {
      elemento = this.obter(elemento);
    }
    if (elemento) elemento.classList.remove('oculto');
  }

  static ocultar(elemento) {
    if (typeof elemento === 'string') {
      elemento = this.obter(elemento);
    }
    if (elemento) elemento.classList.add('oculto');
  }

  static toggle(elemento) {
    if (typeof elemento === 'string') {
      elemento = this.obter(elemento);
    }
    if (elemento) elemento.classList.toggle('oculto');
  }

  static limpar(elemento) {
    if (typeof elemento === 'string') {
      elemento = this.obter(elemento);
    }
    if (elemento) elemento.innerHTML = '';
  }

  static adicionarClasse(elemento, classe) {
    if (typeof elemento === 'string') {
      elemento = this.obter(elemento);
    }
    if (elemento) elemento.classList.add(classe);
  }

  static removerClasse(elemento, classe) {
    if (typeof elemento === 'string') {
      elemento = this.obter(elemento);
    }
    if (elemento) elemento.classList.remove(classe);
  }

  static habilitarBotao(botao) {
    if (typeof botao === 'string') {
      botao = this.obter(botao);
    }
    if (botao) botao.disabled = false;
  }

  static desabilitarBotao(botao) {
    if (typeof botao === 'string') {
      botao = this.obter(botao);
    }
    if (botao) botao.disabled = true;
  }
}

/* ============================================
   UTILITÁRIOS - NAVEGAÇÃO
   ============================================ */

function resolverRotaLocal(path) {
  if (!path) return path;

  if (window.location.protocol === 'file:' && /^\/[a-zA-Z]:\//.test(path)) {
    return path;
  }

  if (!path.startsWith('/')) {
    return path;
  }

  if (window.location.protocol !== 'file:') {
    return path;
  }

  const pathname = window.location.pathname || '';
  const ultimaBarra = pathname.lastIndexOf('/');
  const base = ultimaBarra >= 0 ? pathname.slice(0, ultimaBarra + 1) : '/';
  const destino = path.replace(/^\/+/, '');

  return `${base}${destino}`;
}

function navegarPara(path) {
  window.location.href = resolverRotaLocal(path);
}

function adaptarLinksAbsolutosParaArquivo() {
  if (window.location.protocol !== 'file:') {
    return;
  }

  DOM.obterTodos('a[href^="/"]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    link.setAttribute('href', resolverRotaLocal(href));
  });

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="/"]');
    if (!link) return;

    const href = link.getAttribute('href') || '';
    if (/^\/[a-zA-Z]:\//.test(href)) {
      return;
    }

    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      link.target === '_blank'
    ) {
      return;
    }

    event.preventDefault();
    navegarPara(href);
  });
}

/* ============================================
   PROTEÇÃO DE ROTAS
   ============================================ */

function protegerRota() {
  if (!UsuarioManager.estaAutenticado()) {
    navegarPara('/login.html');
    return false;
  }
  return true;
}

function rotaPublica() {
  if (UsuarioManager.estaAutenticado()) {
    navegarPara('/dashboard.html');
  }
}

/* ============================================
   INICIALIZAÇÃO DA NAVBAR
   ============================================ */

function inicializarNavbar() {
  const usuario = UsuarioManager.obterUsuario();
  if (!usuario) return;

  const navbarUser = DOM.obter('.navbar-user span');
  if (navbarUser) {
    navbarUser.textContent = usuario.fullName;
  }

  const btnLogout = DOM.obter('.btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      AuthApi.logout();
    });
  }

  const pathAtual = (window.location.pathname || '').toLowerCase();
  const grupos = {
    dashboard: ['/dashboard.html'],
    membros: ['/membros.html', '/cadastro-membro.html', '/visualizar-membro.html', '/celulas.html', '/visualizar-celula.html'],
    importacao: ['/importacao.html'],
    administracao: ['/gerenciar-usuarios.html']
  };

  let grupoAtivo = '';
  if (grupos.dashboard.some(p => pathAtual.endsWith(p))) grupoAtivo = 'dashboard';
  if (grupos.membros.some(p => pathAtual.endsWith(p))) grupoAtivo = 'membros';
  if (grupos.importacao.some(p => pathAtual.endsWith(p))) grupoAtivo = 'importacao';
  if (grupos.administracao.some(p => pathAtual.endsWith(p))) grupoAtivo = 'administracao';

  const linksMenu = DOM.obterTodos('.navbar-menu a, .navbar-mobile-menu a');
  linksMenu.forEach(link => {
    link.classList.remove('ativo');
    const href = (link.getAttribute('href') || '').toLowerCase();
    if (!href) return;

    const ehDashboard = href.endsWith('/dashboard.html') && grupoAtivo === 'dashboard';
    const ehMembros = href.endsWith('/membros.html') && grupoAtivo === 'membros';
    const ehImportacao = href.endsWith('/importacao.html') && grupoAtivo === 'importacao';
    const ehAdministracao = href.endsWith('/gerenciar-usuarios.html') && grupoAtivo === 'administracao';

    if (ehDashboard || ehMembros || ehImportacao || ehAdministracao) {
      link.classList.add('ativo');
    }
  });
}

// Auto inicializar navbar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  console.log('[utils.js] DOMContentLoaded - Inicializando');

  adaptarLinksAbsolutosParaArquivo();
  
  // Ativar modo visual e autenticação
  ModoVisual.ativar();
  if (!UsuarioManager.obterUsuario()) {
    UsuarioManager.salvarUsuario({ id: '00000000-0000-0000-0000-000000000001', fullName: 'Administrador Demo', email: 'admin@wave.local', role: 'Admin' });
    TokenManager.salvarToken('token-demo', 480);
  }
  
  inicializarNavbar();
});

/* ============================================
   UTILITÁRIOS - PAGINAÇÃO
   ============================================ */

class Paginacao {
  static renderizar(paginaAtual, totalPaginas, callback) {
    const container = DOM.obter('.paginacao');
    if (!container) return;

    DOM.limpar(container);

    // Botão anterior
    if (paginaAtual > 1) {
      const anterior = DOM.criar('a', { href: '#' }, '← Anterior');
      anterior.addEventListener('click', (e) => {
        e.preventDefault();
        callback(paginaAtual - 1);
      });
      container.appendChild(anterior);
    }

    // Números de páginas
    const inicio = Math.max(1, paginaAtual - 2);
    const fim = Math.min(totalPaginas, paginaAtual + 2);

    if (inicio > 1) {
      const primeira = DOM.criar('a', { href: '#' }, '1');
      primeira.addEventListener('click', (e) => {
        e.preventDefault();
        callback(1);
      });
      container.appendChild(primeira);

      if (inicio > 2) {
        const reticencias = DOM.criar('span', {}, '...');
        container.appendChild(reticencias);
      }
    }

    for (let i = inicio; i <= fim; i++) {
      if (i === paginaAtual) {
        const ativa = DOM.criar('span', { className: 'ativa' }, i);
        container.appendChild(ativa);
      } else {
        const link = DOM.criar('a', { href: '#' }, i);
        link.addEventListener('click', (e) => {
          e.preventDefault();
          callback(i);
        });
        container.appendChild(link);
      }
    }

    if (fim < totalPaginas) {
      if (fim < totalPaginas - 1) {
        const reticencias = DOM.criar('span', {}, '...');
        container.appendChild(reticencias);
      }

      const ultima = DOM.criar('a', { href: '#' }, totalPaginas);
      ultima.addEventListener('click', (e) => {
        e.preventDefault();
        callback(totalPaginas);
      });
      container.appendChild(ultima);
    }

    // Botão próximo
    if (paginaAtual < totalPaginas) {
      const proximo = DOM.criar('a', { href: '#' }, 'Próximo →');
      proximo.addEventListener('click', (e) => {
        e.preventDefault();
        callback(paginaAtual + 1);
      });
      container.appendChild(proximo);
    }
  }
}
