/* ============================================
   WAVE CÉLULAS — Agenda Page (Calendário)
   ============================================ */

window.WavePages = window.WavePages || {};

WavePages.agenda = {

  _currentMonth: new Date().getMonth(),
  _currentYear: new Date().getFullYear(),
  _selectedDate: new Date(),

  render() {
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                   'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    const diasSemana = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

    const hoje = new Date();
    const hojeStr = `${hoje.getFullYear()}-${hoje.getMonth()}-${hoje.getDate()}`;

    // Calcular dias do mês
    const primeiroDia = new Date(this._currentYear, this._currentMonth, 1);
    const ultimoDia = new Date(this._currentYear, this._currentMonth + 1, 0);
    const diasNoMes = ultimoDia.getDate();
    const diaInicial = primeiroDia.getDay(); // 0=Dom

    // Dias do mês anterior para preencher
    const diasMesAnterior = new Date(this._currentYear, this._currentMonth, 0).getDate();

    // Grid de dias
    let calendarDays = '';

    // Weekday headers
    diasSemana.forEach(d => {
      calendarDays += `<div class="calendar-weekday">${d}</div>`;
    });

    // Dias do mês anterior (esmaecidos)
    for (let i = diaInicial - 1; i >= 0; i--) {
      const dia = diasMesAnterior - i;
      calendarDays += `<div class="calendar-day other-month">${dia}</div>`;
    }

    // Dias do mês atual
    for (let d = 1; d <= diasNoMes; d++) {
      const date = new Date(this._currentYear, this._currentMonth, d);
      const dateStr = `${this._currentYear}-${this._currentMonth}-${d}`;
      const isToday = dateStr === hojeStr;
      const isSelected = this._selectedDate &&
        date.getDate() === this._selectedDate.getDate() &&
        date.getMonth() === this._selectedDate.getMonth() &&
        date.getFullYear() === this._selectedDate.getFullYear();

      const eventos = WaveData.getEventosParaDia(date);
      let dotsHTML = '';
      if (eventos.length > 0) {
        const dots = eventos.slice(0, 3).map(ev =>
          `<span class="calendar-event-dot ${ev.tipo}"></span>`
        ).join('');
        dotsHTML = `<div class="calendar-dot-row">${dots}</div>`;
      }

      let classes = 'calendar-day';
      if (isToday) classes += ' today';
      else if (isSelected) classes += ' selected';

      calendarDays += `
        <div class="${classes}" onclick="WavePages.agenda.selectDate(${this._currentYear}, ${this._currentMonth}, ${d})">
          ${d}
          ${dotsHTML}
        </div>
      `;
    }

    // Dias do próximo mês para completar a grade
    const totalCells = diaInicial + diasNoMes;
    const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let i = 1; i <= remaining; i++) {
      calendarDays += `<div class="calendar-day other-month">${i}</div>`;
    }

    // Eventos do dia selecionado
    const eventosHoje = WaveData.getEventosParaDia(this._selectedDate);
    const selectedDateStr = this._selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

    let eventosHTML = '';
    if (eventosHoje.length > 0) {
      eventosHTML = eventosHoje.map(ev => WaveComponents.eventCard(ev)).join('');
    } else {
      eventosHTML = `
        <div class="empty-state" style="padding:var(--space-2xl);">
          <i data-lucide="calendar-off"></i>
          <p>Nenhum evento neste dia.</p>
        </div>
      `;
    }

    return `
      <section class="page-header animate-in">
        <button class="back-btn" onclick="WaveApp.navigate('home')">
          <i data-lucide="arrow-left" style="width:18px;height:18px;"></i>
        </button>
        <h2 class="page-title">Agenda</h2>
      </section>

      <!-- Navegação do Mês -->
      <div class="calendar-nav animate-in">
        <button class="calendar-nav-btn" onclick="WavePages.agenda.prevMonth()">
          <i data-lucide="chevron-left" style="width:18px;height:18px;"></i>
        </button>
        <span class="calendar-month">${meses[this._currentMonth]} ${this._currentYear}</span>
        <button class="calendar-nav-btn" onclick="WavePages.agenda.nextMonth()">
          <i data-lucide="chevron-right" style="width:18px;height:18px;"></i>
        </button>
      </div>

      <!-- Grid do Calendário -->
      <div class="calendar-grid animate-in">
        ${calendarDays}
      </div>

      <!-- Legenda -->
      <div style="display:flex;gap:var(--space-lg);justify-content:center;padding:var(--space-sm) 0;" class="animate-in">
        <span style="display:flex;align-items:center;gap:4px;font-size:0.68rem;color:var(--text-tertiary);">
          <span class="calendar-event-dot celula" style="width:6px;height:6px;"></span> Célula
        </span>
        <span style="display:flex;align-items:center;gap:4px;font-size:0.68rem;color:var(--text-tertiary);">
          <span class="calendar-event-dot culto" style="width:6px;height:6px;"></span> Culto
        </span>
        <span style="display:flex;align-items:center;gap:4px;font-size:0.68rem;color:var(--text-tertiary);">
          <span class="calendar-event-dot evento" style="width:6px;height:6px;"></span> Evento
        </span>
      </div>

      <div class="divider"></div>

      <!-- Eventos do Dia -->
      <section class="section animate-in">
        ${WaveComponents.sectionHeader('calendar-clock', selectedDateStr)}
        <div class="agenda-events stagger">
          ${eventosHTML}
        </div>
      </section>
    `;
  },

  selectDate(year, month, day) {
    this._selectedDate = new Date(year, month, day);
    WaveApp.renderCurrentPage();
  },

  prevMonth() {
    this._currentMonth--;
    if (this._currentMonth < 0) {
      this._currentMonth = 11;
      this._currentYear--;
    }
    WaveApp.renderCurrentPage();
  },

  nextMonth() {
    this._currentMonth++;
    if (this._currentMonth > 11) {
      this._currentMonth = 0;
      this._currentYear++;
    }
    WaveApp.renderCurrentPage();
  }
};
