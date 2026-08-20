/* ============================================
   WAVE CÉLULAS — Reusable UI Components
   (v1 — Apenas componentes utilizados no fluxo Admin)
   ============================================ */

window.WaveComponents = {

  searchBar(placeholder = 'Buscar...', id = 'search-input') {
    return `
      <div class="search-bar">
        <i data-lucide="search" class="search-icon"></i>
        <input type="text" placeholder="${placeholder}" id="${id}">
      </div>
    `;
  },

  sectionHeader(icon, title, actionText = '', actionClick = '') {
    return `
      <div class="section-header">
        <h3 class="section-title">
          <i data-lucide="${icon}"></i> ${title}
        </h3>
        ${actionText ? `<span class="section-action" onclick="${actionClick}">${actionText}</span>` : ''}
      </div>
    `;
  },

  birthdayCard(membro) {
    const hoje = new Date();
    const nasc = new Date(membro.dataNascimento);
    const diaNasc = nasc.getDate();
    const diaHoje = hoje.getDate();

    let dateLabel = '';
    if (diaNasc === diaHoje) dateLabel = 'Hoje 🎉';
    else if (diaNasc === diaHoje + 1) dateLabel = 'Amanhã';
    else {
      const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      const d = new Date(hoje.getFullYear(), hoje.getMonth(), diaNasc);
      dateLabel = dias[d.getDay()] + ', ' + diaNasc + '/' + (hoje.getMonth() + 1);
    }

    const nome = membro.nome.split(' ')[0];
    const whatsNum = (membro.whatsapp || '').replace(/\D/g, '');
    const msg = encodeURIComponent(`Fala ${nome}, parabéns! Que Deus te abençoe muito nesse novo ano de vida! Tamo junto na célula! 🙏🎂`);

    return `
      <div class="birthday-card animate-in">
        <div style="width:36px;height:36px;border-radius:var(--radius-full);background:var(--bg-elevated);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;color:var(--white);flex-shrink:0;">
          ${membro.nome.charAt(0)}
        </div>
        <span class="birthday-name">${membro.nome}</span>
        <span class="birthday-date">${dateLabel}</span>
        ${whatsNum ? `
          <a href="https://wa.me/${whatsNum}?text=${msg}" target="_blank" class="btn btn-whatsapp" style="width:100%;margin-top:4px;">
            <i data-lucide="message-circle" style="width:14px;height:14px;"></i> Parabéns
          </a>
        ` : ''}
      </div>
    `;
  },

  hubCard(icon, title, subtitle, onclick) {
    return `
      <div class="hub-card" onclick="${onclick}">
        <div class="hub-icon white">
          <i data-lucide="${icon}" style="width:22px;height:22px;"></i>
        </div>
        <span class="hub-card-title">${title}</span>
        <span class="hub-card-sub">${subtitle}</span>
      </div>
    `;
  }
};
