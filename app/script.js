
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('newAlarmModal');
    const modalTitle = document.getElementById('modalDeviceTitle');
    let currentDeviceCard = null;

    document.querySelectorAll('.add-alarm').forEach(button => {
        button.addEventListener('click', (e) => {
            const deviceCard = e.target.closest('.device-card');
            currentDeviceCard = deviceCard;
            const deviceName = deviceCard.querySelector('h3').textContent;
            modalTitle.textContent = `Nueva alarma - ${deviceName}`;
            modal.style.display = 'flex';

            document.getElementById('alarmTime').value = '';
            document.getElementById('alarmDate').value = '';
            document.getElementById('assistantToggle').checked = false;
        });
    });

    document.querySelector('.close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
        currentDeviceCard = null;
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            currentDeviceCard = null;
        }
    });

    document.querySelector('.save-alarm').addEventListener('click', () => {
        const timeInput = document.getElementById('alarmTime').value;
        const dateInput = document.getElementById('alarmDate').value;
        const assistantEnabled = document.getElementById('assistantToggle').checked;

        if (!timeInput || !dateInput) {
            alert('Please enter time and date for the alarm');
            return;
        }

        if (currentDeviceCard) {
            const alarmsList = currentDeviceCard.querySelector('.alarms-list');

            const noAlarmsMsg = alarmsList.querySelector('.no-alarms');
            if (noAlarmsMsg) {
                noAlarmsMsg.remove();
            }

            const timeObj = new Date(`2000-01-01T${timeInput}`);
            const formattedTime = timeObj.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });

            const alarmItem = document.createElement('div');
            alarmItem.className = 'alarm-item';

            const dateObj = new Date(dateInput);
            const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

            alarmItem.innerHTML = `
          <div class="alarm-info">
            <span>${formattedTime}</span>
            <div class="alarm-details">${assistantEnabled ? 'con' : 'sin'} asistente - Repite: ${dayOfWeek}</div>
          </div>
          <div class="alarm-actions">
            <button class="edit-btn">✎</button>
            <button class="delete-btn">🗑</button>
          </div>
        `;

            alarmItem.querySelector('.edit-btn').addEventListener('click', function () {
                alert('Edit functionality will be implemented');
            });

            alarmItem.querySelector('.delete-btn').addEventListener('click', function () {
                if (confirm('Are you sure you want to delete this alarm?')) {
                    alarmItem.remove();

                    if (alarmsList.children.length === 0) {
                        const noAlarmsMsg = document.createElement('p');
                        noAlarmsMsg.className = 'no-alarms';
                        noAlarmsMsg.textContent = 'No registra alarmas para este dispositivo';
                        alarmsList.appendChild(noAlarmsMsg);
                    }
                }
            });
            alarmsList.appendChild(alarmItem);

            modal.style.display = 'none';
            currentDeviceCard = null;
        }
    });

    const newAssistantModal = document.getElementById('newAssistantModal');
    const newAssistantButton = document.querySelector('.add-assistant');
    const closeAssistantModal = document.querySelector('.close-modal');
    newAssistantButton.addEventListener('click', () => {
        newAssistantModal.style.display = 'flex';
    });
    closeAssistantModal.addEventListener('click', () => {
        newAssistantModal.style.display = 'none';
    });
    newAssistantModal.addEventListener('click', (e) => {
        if (e.target === newAssistantModal) {
            newAssistantModal.style.display = 'none';
        }
    });
    document.querySelector('.save-assistant').addEventListener('click', () => {
        const assistantName = document.getElementById('assistantName').value;
        const assistantVoice = document.getElementById('assistantVoice').value;
        const assistantSpeed = document.getElementById('assistantSpeed').value;
        const assistantTone = document.getElementById('assistantTone').value;
        if (!assistantName) {
            alert('Please enter a name for the assistant');
            return;
        }
        const assistantsGrid = document.querySelector('.assistants-grid');
        const assistantItem = document.createElement('div');
        assistantItem.className = 'assistant-card';
        assistantItem.innerHTML = `
        <h3>${assistantName}</h3>
        <div class="assistant-details">
            <span>Tipo: ${assistantVoice}</span>
            <span>Velocidad: ${assistantSpeed}x</span>
            <span>Tono: ${assistantTone}</span>
        </div>
        <div class="assistant-actions">
            <button class="edit-btn">✎</button>
            <button class="delete-btn">🗑</button>
        </div>
        `;
        assistantItem.querySelector('.edit-btn').addEventListener('click', function () {
            alert('Edit functionality will be implemented');
        });

        assistantItem.querySelector('.delete-btn').addEventListener('click', function () {
            if (confirm('Are you sure you want to delete this assistant?')) {
                assistantItem.remove();
            }
        });
        assistantsGrid.appendChild(assistantItem);
        newAssistantModal.style.display = 'none';
    });

    const navLinks = document.querySelectorAll('.nav-links a');
    const features = document.querySelectorAll('.feature');

    features.forEach(feature => {
        feature.style.cursor = 'pointer';
        feature.addEventListener('click', () => {
            const section = feature.dataset.section;
            const correspondingLink = Array.from(navLinks).find(link => link.textContent === section);
            if (correspondingLink) {
                correspondingLink.click();
            }
        });
    });
    const homeContent = document.getElementById('home-content');
    const alarmsContent = document.getElementById('alarms-content');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            navLinks.forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');

            const calendarContent = document.getElementById('calendar-content');

            const allContentSections = [
                homeContent,
                alarmsContent,
                calendarContent,
                document.getElementById('assistants-content'),
                document.getElementById('reports-content')
            ];
            allContentSections.forEach(section => {
                if (section) section.style.display = 'none';
            });

            if (e.target.textContent === 'Alarmas') {
                alarmsContent.style.display = 'block';
            } else if (e.target.textContent === 'Inicio') {
                homeContent.style.display = 'block';
            } else if (e.target.textContent === 'Calendario') {
                calendarContent.style.display = 'block';
            } else if (e.target.textContent === 'Asistentes') {
                document.getElementById('assistants-content').style.display = 'block';
            } else if (e.target.textContent === 'Reportes') {
                document.getElementById('reports-content').style.display = 'block';
            }
        });
    });
});
