/* ============================================
   WAVE CÉLULAS — Tela de Boas-Vindas Pós-Login
   (Layout Fullscreen com Animações Stagger de Entrada e Transição Suave de Saída)
   ============================================ */

window.WavePages = window.WavePages || {};

WavePages['boas-vindas'] = {

  _timerExit: null,
  _timerRedirect: null,

  getSaudacao() {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) return 'Bom dia';
    if (hora >= 12 && hora < 18) return 'Boa tarde';
    return 'Boa noite';
  },

  render() {
    const user = WaveAuth.getUser() || WaveData.currentUser || {};
    const nomeCompleto = user.nome || 'Líder';
    const primeiroNome = nomeCompleto.trim().split(/\s+/)[0] || 'Líder';
    const saudacao = this.getSaudacao();

    return `
      <div class="welcome-fullscreen" id="welcome-screen">
        
        <!-- Logo borrada de fundo com leve pulso e iluminação de profundidade -->
        <div class="welcome-bg-blur"></div>

        <!-- Conteúdo central com animações em cascata (stagger) -->
        <div class="welcome-content">
          <img src="imagens/Logo-Wave-(Padrao).png" alt="Comunidade Wave" class="welcome-logo welcome-anim-1">
          
          <h1 class="welcome-greeting welcome-anim-2">${saudacao}, ${primeiroNome}!</h1>
          
          <p class="welcome-desc welcome-anim-3">
            Estamos preparando o seu painel de gestão de membros!
          </p>

          <div class="welcome-bar-track welcome-anim-4">
            <div class="welcome-bar-fill"></div>
          </div>
        </div>

      </div>
    `;
  },

  onMount() {
    if (this._timerExit) clearTimeout(this._timerExit);
    if (this._timerRedirect) clearTimeout(this._timerRedirect);

    // Inicia a transição de saída suave aos 3.55s
    this._timerExit = setTimeout(() => {
      const screen = document.getElementById('welcome-screen');
      if (screen) {
        screen.classList.add('welcome-exit');
      }
    }, 3550);

    // Redireciona para o painel principal ao completar os 4.0s
    this._timerRedirect = setTimeout(() => {
      this.irParaPainel();
    }, 4000);
  },

  irParaPainel() {
    if (this._timerExit) {
      clearTimeout(this._timerExit);
      this._timerExit = null;
    }
    if (this._timerRedirect) {
      clearTimeout(this._timerRedirect);
      this._timerRedirect = null;
    }
    WaveApp.navigate('admin');
  }
};
