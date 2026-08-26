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

    // 2. Busca as credenciais seguras da Netlify Function
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
      try {
        const fallbackRes = await fetch('/.netlify/functions/config');
        if (fallbackRes.ok) {
          const cfg = await fallbackRes.json();
          url = cfg.supabaseUrl;
          key = cfg.supabaseAnonKey;
        }
      } catch (err) {}
    }

    // 2.1 Fallback seguro para desenvolvimento local (Live Server / localhost)
    const isLocal = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' || 
                    window.location.protocol === 'file:';

    if ((!url || !key) && isLocal) {
      // Tenta carregar do script local se existir
      if (!window.SUPABASE_URL && !window.SUPABASE_ANON_KEY) {
        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'config.local.js';
          script.onload = resolve;
          script.onerror = () => resolve(); // se não existir, segue sem erro
          document.head.appendChild(script);
        });
      }

      url = window.SUPABASE_URL || localStorage.getItem('SUPABASE_URL') || '';
      key = window.SUPABASE_ANON_KEY || localStorage.getItem('SUPABASE_ANON_KEY') || '';
    }

    // 3. Inicializa o cliente do Supabase com as credenciais obtidas
    if (url && key && window.supabase && window.supabase.createClient) {
      window.supabaseClient = window.supabase.createClient(url, key);
      console.log('✅ Supabase conectado com sucesso!');
      if (window.WaveData && window.WaveData.syncSupabase) {
        window.WaveData.syncSupabase();
      }
      return window.supabaseClient;
    } else {
      console.warn('⚠️ Supabase: Credenciais não retornadas.');
      return null;
    }
  } catch (error) {
    console.error('Erro na inicialização do Supabase:', error);
    return null;
  }
})();

window.WaveSupabase = {
  active: true,

  async _ensureClient() {
    if (!window.supabaseClient && window.supabaseInitPromise) {
      await window.supabaseInitPromise;
    }
    return window.supabaseClient;
  },

  // 1. Membros & Líderes (pessoas)
  async fetchPessoas() {
    const client = await this._ensureClient();
    if (!client) return [];
    try {
      const { data, error } = await client.from('pessoas').select('*');
      if (error) throw error;
      return data || [];
    } catch (e) {
      console.warn('Erro ao carregar pessoas do Supabase:', e);
      return [];
    }
  },

  async addPessoa(pessoa) {
    const client = await this._ensureClient();
    if (!client) {
      console.warn('Supabase client não está inicializado.');
      return null;
    }
    try {
      const { data, error } = await client.from('pessoas').insert([pessoa]).select();
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
    const client = await this._ensureClient();
    if (!client) return null;
    try {
      const { data, error } = await client.from('pessoas').update(dados).eq('id', id).select();
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
  },

  async updatePessoasLider(ids, novoLiderNome, novoLiderId = null) {
    const client = await this._ensureClient();
    if (!client || !ids || ids.length === 0) return true;
    try {
      const payload = { lider: novoLiderNome };
      if (novoLiderId) {
        payload.discipulador_id = novoLiderId;
      }
      const { error } = await client.from('pessoas').update(payload).in('id', ids);
      if (error) {
        console.error('Erro ao atualizar lote de discípulos no Supabase:', error);
        return false;
      }
      return true;
    } catch (e) {
      console.error('Erro de conexão no lote do Supabase:', e);
      return false;
    }
  }
};
