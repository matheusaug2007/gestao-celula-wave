/* ============================================
   WAVE CÉLULAS — Conexão Segura com Supabase via Netlify Cloud
   ============================================ */

window.supabaseClient = null;

// Inicialização assíncrona segura através de variáveis de ambiente do Netlify
window.supabaseInitPromise = (async function initSupabase() {
  try {
    // 1. Garante que o SDK do Supabase está carregado
    if (typeof supabase === 'undefined' || !supabase.createClient) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    // 2. Busca as credenciais seguras da Netlify Function (sem expor no código)
    let url = '';
    let key = '';

    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const cfg = await res.json();
        url = cfg.supabaseUrl;
        key = cfg.supabaseAnonKey;
      }
    } catch (e) {
      console.warn('Tentando rota direta de functions...');
      try {
        const fallbackRes = await fetch('/.netlify/functions/config');
        if (fallbackRes.ok) {
          const cfg = await fallbackRes.json();
          url = cfg.supabaseUrl;
          key = cfg.supabaseAnonKey;
        }
      } catch (err) {}
    }

    // 3. Inicializa o cliente do Supabase com as credenciais obtidas
    if (url && key && window.supabase && window.supabase.createClient) {
      window.supabaseClient = window.supabase.createClient(url, key);
      console.log('✅ Supabase conectado com sucesso via Netlify Environment Variables!');
      if (window.WaveData && window.WaveData.syncSupabase) {
        window.WaveData.syncSupabase();
      }
      return window.supabaseClient;
    } else {
      console.warn('⚠️ Supabase: Credenciais não retornadas pelo endpoint da nuvem.');
      return null;
    }
  } catch (error) {
    console.error('Erro na inicialização do Supabase:', error);
    return null;
  }
})();

window.WaveSupabase = {
  active: true,

  // 1. Membros & Líderes (pessoas)
  async fetchPessoas() {
    if (!window.supabaseClient) return [];
    try {
      const { data, error } = await supabaseClient.from('pessoas').select('*');
      if (error) throw error;
      return data || [];
    } catch (e) {
      console.warn('Erro ao carregar pessoas do Supabase:', e);
      return [];
    }
  },

  async addPessoa(pessoa) {
    if (!window.supabaseClient) {
      console.warn('Supabase client não está inicializado.');
      return null;
    }
    try {
      const { data, error } = await supabaseClient.from('pessoas').insert([pessoa]).select();
      if (error) {
        console.error('Erro ao salvar pessoa no Supabase:', error);
        if (window.WaveApp && window.WaveApp.showToast) {
          WaveApp.showToast('Erro no Banco: ' + (error.message || 'Falha ao salvar'), 'danger');
        }
        return null;
      }
      return data ? data[0] : null;
    } catch (e) {
      console.error('Erro de conexão ao salvar pessoa no Supabase:', e);
      return null;
    }
  },

  async updatePessoa(id, dados) {
    if (!window.supabaseClient) return null;
    try {
      const { data, error } = await supabaseClient.from('pessoas').update(dados).eq('id', id).select();
      if (error) {
        console.error('Erro ao atualizar pessoa no Supabase:', error);
        if (window.WaveApp && window.WaveApp.showToast) {
          WaveApp.showToast('Erro no Banco: ' + (error.message || 'Falha ao atualizar'), 'danger');
        }
        return null;
      }
      return data ? data[0] : null;
    } catch (e) {
      console.error('Erro de conexão ao atualizar pessoa no Supabase:', e);
      return null;
    }
  }
};
