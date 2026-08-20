/* ============================================
   WAVE CÉLULAS — Conexão Direta com Banco de Dados Supabase
   Project Ref: dkdtgdmcmvofolukynri
   ============================================ */

const SUPABASE_URL = 'https://dkdtgdmcmvofolukynri.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrZHRnZG1jbXZvZm9sdWt5bnJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MTU5NjYsImV4cCI6MjEwMjE5MTk2Nn0.Ond6uL_hhHjuDm_xdNn6PsPB2q6Gw_JgDdO45tAeT5c';

window.supabaseClient = null;

(function initSupabase() {
  if (typeof supabase !== 'undefined' && supabase.createClient) {
    window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } else {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.onload = () => {
      if (window.supabase && window.supabase.createClient) {
        window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase Client conectado com sucesso!');
        if (window.WaveData && window.WaveData.syncSupabase) {
          window.WaveData.syncSupabase();
        }
      }
    };
    document.head.appendChild(script);
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
