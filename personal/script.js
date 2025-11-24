// Funções compartilhadas entre todas as páginas

// Função para formatar data
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Função para mostrar mensagens
function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `message ${type}`;
    element.style.display = 'block';
}

// Funções específicas da página inicial (dashboard)
function initDashboard() {
    const appointmentForm = document.getElementById('appointment-form');
    const appointmentsModal = document.getElementById('appointments-modal');
    const appointmentsList = document.getElementById('appointments-list');
    const viewAppointmentsBtn = document.getElementById('view-appointments-btn');
    const closeModalBtn = document.querySelector('.close-modal');
    const logoutBtn = document.getElementById('logout-btn');

    let currentDate = new Date();

    // Event Listeners
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', handleAppointmentSubmit);
    }

    if (viewAppointmentsBtn) {
        viewAppointmentsBtn.addEventListener('click', showAppointmentsModal);
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            appointmentsModal.style.display = 'none';
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Navegação do calendário
    document.getElementById('prev-month').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });

    document.getElementById('next-month').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });

    // Inicializar calendário
    renderCalendar(currentDate);
}

function handleAppointmentSubmit(e) {
    e.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        alert('Você precisa estar logado para fazer um agendamento!');
        window.location.href = 'login.html';
        return;
    }
    
    const date = document.getElementById('appointment-date').value;
    const time = document.getElementById('appointment-time').value;
    const location = document.getElementById('appointment-location').value;
    
    // Verificar se já existe um agendamento no mesmo horário
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const existingAppointment = appointments.find(a => 
        a.date === date && a.time === time
    );
    
    if (existingAppointment) {
        alert('Já existe um agendamento para este horário!');
        return;
    }
    
    const newAppointment = {
        id: Date.now().toString(),
        userId: currentUser.id,
        date,
        time,
        location,
        clientName: currentUser.name
    };
    
    appointments.push(newAppointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    
    alert('Agendamento realizado com sucesso!');
    document.getElementById('appointment-form').reset();
    
    // Atualizar calendário
    const currentDate = new Date(date);
    renderCalendar(currentDate);
}

function renderCalendar(date) {
    const calendarBody = document.getElementById('calendar-body');
    const currentMonthElement = document.getElementById('current-month');
    
    // Limpar o calendário
    calendarBody.innerHTML = '';
    
    // Atualizar o mês atual
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    currentMonthElement.textContent = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    
    // Primeiro dia do mês
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    // Último dia do mês
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    // Dia da semana do primeiro dia (0 = Domingo, 1 = Segunda, etc.)
    const firstDayOfWeek = firstDay.getDay();
    
    // Número de dias no mês
    const daysInMonth = lastDay.getDate();
    
    let dayCounter = 1;
    
    // Criar as linhas do calendário
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('tr');
        
        // Criar as células para cada dia da semana
        for (let j = 0; j < 7; j++) {
            const cell = document.createElement('td');
            
            if (i === 0 && j < firstDayOfWeek) {
                // Células vazias antes do primeiro dia do mês
                cell.textContent = '';
            } else if (dayCounter > daysInMonth) {
                // Células vazias após o último dia do mês
                cell.textContent = '';
            } else {
                // Dia do mês
                cell.textContent = dayCounter;
                
                // Verificar se é hoje
                const today = new Date();
                if (dayCounter === today.getDate() && 
                    date.getMonth() === today.getMonth() && 
                    date.getFullYear() === today.getFullYear()) {
                    cell.classList.add('today');
                }
                
                // Verificar se há agendamentos neste dia
                const cellDate = new Date(date.getFullYear(), date.getMonth(), dayCounter);
                const formattedDate = formatDate(cellDate);
                const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
                const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                const dayAppointments = appointments.filter(a => 
                    a.date === formattedDate && a.userId === currentUser.id
                );
                
                if (dayAppointments.length > 0) {
                    cell.classList.add('has-appointments');
                    cell.title = `${dayAppointments.length} agendamento(s)`;
                }
                
                dayCounter++;
            }
            
            row.appendChild(cell);
        }
        
        calendarBody.appendChild(row);
        
        // Parar se já preenchemos todos os dias
        if (dayCounter > daysInMonth) {
            break;
        }
    }
}

function showAppointmentsModal() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const userAppointments = appointments.filter(a => a.userId === currentUser.id);
    const appointmentsList = document.getElementById('appointments-list');
    const appointmentsModal = document.getElementById('appointments-modal');
    
    appointmentsList.innerHTML = '';
    
    if (userAppointments.length === 0) {
        appointmentsList.innerHTML = '<li class="appointment-item">Nenhum agendamento encontrado.</li>';
    } else {
        userAppointments.forEach(appointment => {
            const li = document.createElement('li');
            li.className = 'appointment-item';
            
            const date = new Date(appointment.date);
            const formattedDate = date.toLocaleDateString('pt-BR');
            
            li.innerHTML = `
                <div class="appointment-info">
                    <h4>Treino com ${appointment.clientName}</h4>
                    <p>Data: ${formattedDate} | Horário: ${appointment.time}</p>
                    <p>Local: ${appointment.location}</p>
                </div>
                <div class="appointment-actions">
                    <button class="cancel-appointment" data-id="${appointment.id}">Cancelar</button>
                </div>
            `;
            
            appointmentsList.appendChild(li);
        });
        
        // Adicionar event listeners para os botões de cancelar
        document.querySelectorAll('.cancel-appointment').forEach(button => {
            button.addEventListener('click', (e) => {
                const appointmentId = e.target.getAttribute('data-id');
                cancelAppointment(appointmentId);
            });
        });
    }
    
    appointmentsModal.style.display = 'flex';
}

function cancelAppointment(appointmentId) {
    let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    appointments = appointments.filter(a => a.id !== appointmentId);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    showAppointmentsModal();
    
    // Atualizar calendário
    const currentDate = new Date();
    renderCalendar(currentDate);
}

function handleLogout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Fechar modal clicando fora dele
document.addEventListener('click', (e) => {
    const modal = document.getElementById('appointments-modal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});
