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

    // 2.1 Fallback inteligente para desenvolvimento local (Live Server / localhost)
    const isLocal = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' || 
                    window.location.protocol === 'file:';

    if ((!url || !key) && isLocal) {
      console.info('ℹ️ Modo de Desenvolvimento Local detectado (Live Server). Usando fallback de conexão.');
      url = 'https://dkdtgdmcmvofolukynri.supabase.co';
      key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrZHRnZG1jbXZvZm9sdWt5bnJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MTU5NjYsImV4cCI6MjEwMjE5MTk2Nn0.Ond6uL_hhHjuDm_xdNn6PsPB2q6Gw_JgDdO45tAeT5c';
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
  },

  async updatePessoasLider(ids, novoLiderNome, novoLiderId = null) {
    if (!window.supabaseClient || !ids || ids.length === 0) return true;
    try {
      const payload = { lider: novoLiderNome };
      if (novoLiderId) {
        payload.discipulador_id = novoLiderId;
      }
      const { error } = await supabaseClient.from('pessoas').update(payload).in('id', ids);
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
