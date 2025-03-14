function openAddAlarmPopup() {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.style.borderRadius = '10px';
    popup.innerHTML = `
    <span class="close-popup" style="font-size: 24px; position: absolute; top: 20px; right: 20px; cursor: pointer;">&times;</span>
    <h2 style="font-size: 24px; padding-top: 10px;">Configurar alarma</h2>
    <hr style="border: 0.2px solid black; margin: 10px 0;">
    <div class="popup-content" style="border-radius: 10px; padding: 0 20px; min-width: 390px;">
        <div style="margin-top: 20px;">
            <label for="alarmTime" style="display: block; margin-bottom: 8px;">Hora:</label>
            <input type="time" id="alarmTime" required style="border: none; border-bottom: 1px solid #212529; width: 100%; padding: 8px; margin-bottom: 20px;">
        </div>
        
        <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 10px;">Repite:</label>
            <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
                <label style="display: inline-flex; align-items: center; margin-right: 10px; margin-bottom: 10px;">
                    <input type="checkbox" name="repeatDay" value="Lun" style="margin-right: 5px;">
                    <span>Lun</span>
                </label>
                <label style="display: inline-flex; align-items: center; margin-right: 10px; margin-bottom: 10px;">
                    <input type="checkbox" name="repeatDay" value="Mar" style="margin-right: 5px;">
                    <span>Mar</span>
                </label>
                <label style="display: inline-flex; align-items: center; margin-right: 10px; margin-bottom: 10px;">
                    <input type="checkbox" name="repeatDay" value="Mie" style="margin-right: 5px;">
                    <span>Mie</span>
                </label>
                <label style="display: inline-flex; align-items: center; margin-right: 10px; margin-bottom: 10px;">
                    <input type="checkbox" name="repeatDay" value="Jue" style="margin-right: 5px;">
                    <span>Jue</span>
                </label>
                <label style="display: inline-flex; align-items: center; margin-right: 10px; margin-bottom: 10px;">
                    <input type="checkbox" name="repeatDay" value="Vie" style="margin-right: 5px;">
                    <span>Vie</span>
                </label>
                <label style="display: inline-flex; align-items: center; margin-right: 10px; margin-bottom: 10px;">
                    <input type="checkbox" name="repeatDay" value="Sab" style="margin-right: 5px;">
                    <span>Sab</span>
                </label>
                <label style="display: inline-flex; align-items: center; margin-right: 10px; margin-bottom: 10px;">
                    <input type="checkbox" name="repeatDay" value="Dom" style="margin-right: 5px;">
                    <span>Dom</span>
                </label>
            </div>
        </div>
        
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px;">
            <label for="assistantToggle" style="margin-right: 10px;">Activar asistente:</label>
            <label class="switch">
                <input type="checkbox" id="assistantToggle">
                <span class="slider round"></span>
            </label>
        </div>
        
        <div style="display: flex; justify-content: center;">
            <button id="saveAlarm" style="margin:20px 0; background-color: #38388E; color: white; padding: 10px 20px; border: none; border-radius: 100px; cursor: pointer; width: 153px; font-size: 14px;">Guardar</button>
        </div>
    </div>
    `;
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.backgroundColor = 'white';
    popup.style.padding = '20px';
    popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    popup.style.zIndex = '1000';

    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '999';
    document.body.appendChild(overlay);

    overlay.addEventListener('click', () => {
        popup.remove();
        overlay.remove();
    });
    document.body.appendChild(popup);

    const closePopup = popup.querySelector('.close-popup');
    closePopup.addEventListener('click', () => {
        popup.remove();
        overlay.remove();
    });

    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.remove();
            overlay.remove();
        }
    });

    // Handle save button click
    const saveButton = popup.querySelector('#saveAlarm');
    saveButton.addEventListener('click', () => {
        const time = popup.querySelector('#alarmTime').value;
        const assistantEnabled = popup.querySelector('#assistantToggle').checked;
        
        // Get selected days
        const selectedDays = [];
        popup.querySelectorAll('input[name="repeatDay"]:checked').forEach(checkbox => {
            selectedDays.push(checkbox.value);
        });
        
        if (!time) {
            alert('Por favor seleccione una hora para la alarma');
            return;
        }
        
        // Add alarm to the current device card (from the global state)
        if (currentDeviceCard) {
            addAlarmToDevice(currentDeviceCard, time, selectedDays, assistantEnabled);
            popup.remove();
            overlay.remove();
        }
    });
}

// Function to add the alarm to a device card
function addAlarmToDevice(deviceCard, time, repeatDays, assistantEnabled) {
    const alarmsList = deviceCard.querySelector('.alarms-list');
    
    // Remove "no alarms" message if it exists
    const noAlarmsMsg = alarmsList.querySelector('.no-alarms');
    if (noAlarmsMsg) {
        noAlarmsMsg.remove();
    }
    
    // Format time for display (convert from 24h to 12h format)
    const timeObj = new Date(`2000-01-01T${time}`);
    const formattedTime = timeObj.toLocaleTimeString('es-ES', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    
    // Create alarm item
    const alarmItem = document.createElement('div');
    alarmItem.className = 'alarm-item';
    
    // Format repeat days
    const repeatText = repeatDays.length > 0 ? repeatDays.join(', ') : 'No se repite';
    
    alarmItem.innerHTML = `
        <div class="alarm-info">
            <span>${formattedTime}</span>
            <div class="alarm-details">${assistantEnabled ? 'con' : 'sin'} asistente - Repite: ${repeatText}</div>
        </div>
        <div class="alarm-actions">
            <button class="edit-btn">✎</button>
            <button class="delete-btn">🗑</button>
        </div>
    `;
    
    // Add event listeners to buttons
    alarmItem.querySelector('.edit-btn').addEventListener('click', function() {
        alert('Función de edición será implementada próximamente');
    });
    
    alarmItem.querySelector('.delete-btn').addEventListener('click', function() {
        if (confirm('¿Está seguro que desea eliminar esta alarma?')) {
            alarmItem.remove();
            
            // Add back "no alarms" message if no alarms left
            if (alarmsList.children.length === 0) {
                const noAlarmsMsg = document.createElement('p');
                noAlarmsMsg.className = 'no-alarms';
                noAlarmsMsg.textContent = 'No registra alarmas para este dispositivo';
                alarmsList.appendChild(noAlarmsMsg);
            }
        }
    });
    
    // Add to alarms list
    alarmsList.appendChild(alarmItem);
}

function openPopup() {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.style.borderRadius = '10px';
    popup.innerHTML = `
        <div class="popup-content" style="border-radius: 10px; padding: 0 20px; min-width: 500px;">
            <span class="close-popup" style="font-size: 24px; position: absolute; top: 10px; right: 10px; cursor: pointer;">&times;</span>
            <h2 style="font-size: 24px; padding-top: 20px;">Log in</h2>
            <form style="display: flex; flex-direction: column; align-items: center;">
                <input type="email" id="email" name="email" required placeholder="correo" style="border: none; border-bottom: 1px solid #212529; width: 100%; padding: 8px; margin-bottom: 16px;">
                <input type="password" id="password" name="password" required placeholder="contraseña" style="border: none; border-bottom: 1px solid #212529; width: 100%; padding: 8px; margin-bottom: 16px;">
                <p style="text-align: left; margin-bottom: 16px; color: #212529;font-size: 12px; width: 100%;">¿Olvidó su contraseña?</p>
                <button type="submit" style="background-color: #38388E; color: white; padding: 10px 20px; border: none; border-radius: 100px; cursor: pointer; width: 153px;font-size: 22px;">Log in</button>
            </form>
            <p style="text-align: left; margin-top: 16px; color: #212529;font-size: 12px;">¿No tienes cuenta? <a href="#" class="sign-up-link">Sign up</a></p>
            <hr style="margin: 16px 0;">
            <p style="text-align: center; margin: 16px 0;">o ingresa con</p>
            <div style="display: flex; justify-content: center; gap: 16px;">
                <img src="./static/google-image.png" alt="Google" style="width: 69px; height: 78px; cursor: pointer;">
                <img src="./static/facebook.image.png" alt="Facebook" style="width: 69px; height: 78px; cursor: pointer;">
            </div>
        </div>
    `;
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.backgroundColor = 'white';
    popup.style.padding = '20px';
    popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    popup.style.zIndex = '1000';

    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '999';
    document.body.appendChild(overlay);

    overlay.addEventListener('click', () => {
        popup.remove();
        overlay.remove();
    });
    document.body.appendChild(popup);

    const closePopup = popup.querySelector('.close-popup');
    closePopup.addEventListener('click', () => {
        popup.remove();
        overlay.remove();
    });

    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.remove();
            overlay.remove();
        }
    });

    const signUpLink = popup.querySelector('.sign-up-link');
    signUpLink.addEventListener('click', (e) => {
        e.preventDefault();
        popup.remove();
        overlay.remove();
        openSignUpPopup();
    });
}

function openSignUpPopup() {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.style.borderRadius = '10px';
    popup.innerHTML = `
        <div class="popup-content" style="border-radius: 10px; padding: 0 20px; min-width: 500px;">
            <span class="close-popup" style="font-size: 24px; position: absolute; top: 10px; right: 10px; cursor: pointer;">&times;</span>
            <h2 style="font-size: 24px; padding-top: 20px;">Sign up</h2>
            <form style="display: flex; flex-direction: column; align-items: center;">
                <input type="email" id="email" name="email" required placeholder="correo" style="border: none; border-bottom: 1px solid #212529; width: 100%; padding: 8px; margin-bottom: 16px;">
                <input type="password" id="password" name="password" required placeholder="contraseña" style="border: none; border-bottom: 1px solid #212529; width: 100%; padding: 8px; margin-bottom: 16px;">
                <input type="password" id="password" name="password" required placeholder="confirma contraseña" style="border: none; border-bottom: 1px solid #212529; width: 100%; padding: 8px; margin-bottom: 16px;">
                <button type="submit" style="margin:40px 0; background-color: #38388E; color: white; padding: 10px 20px; border: none; border-radius: 100px; cursor: pointer; width: 153px;font-size: 22px;">Sign up</button>
            </form>
        </div>
    `;
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.backgroundColor = 'white';
    popup.style.padding = '20px';
    popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    popup.style.zIndex = '1000';

    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '999';
    document.body.appendChild(overlay);

    overlay.addEventListener('click', () => {
        popup.remove();
        overlay.remove();
    });
    document.body.appendChild(popup);

    const closePopup = popup.querySelector('.close-popup');
    closePopup.addEventListener('click', () => {
        popup.remove();
        overlay.remove();
    });

    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.remove();
            overlay.remove();
        }
    });

    const logInLink = popup.querySelector('.log-in-link');
    logInLink.addEventListener('click', (e) => {
        e.preventDefault();
        popup.remove();
        overlay.remove();
        openPopup();
    });
}

function openAssistantPopup() {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.style.borderRadius = '10px';
    popup.innerHTML = `
    <span class="close-popup" style="font-size: 24px; position: absolute; top: 20px; right: 20px; cursor: pointer;">&times;</span>
    <h2 style="font-size: 24px; padding-top: 10px;">Configuración de asistente</h2>
    <hr style="border: 0.2px solid black; margin: 10px 0;">
    <div class="popup-content" style="border-radius: 10px; padding: 0 20px; min-width: 390px;">
        <h2 style="font-size: 16px; padding-top: 20px; margin-top:10px;"><strong>Configuración de asistente</strong></h2>
        <input placeholder="Nombre" style="border: none; border-bottom: 1px solid #212529; width: 100%; padding: 8px; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
            <div style="display: flex; align-items: center;">
                <span class="material-symbols-outlined" style="color: #38398f;">
                record_voice_over
                </span>
                <p for="assistantVoice" style="margin-left: 8px; margin-top: 15px;">Voz del asistente:</p>
            </div>
            <select id="assistantVoice" name="assistantVoice" style="border: none; border-bottom: 1px solid #38398f; color: #38398f; padding: 8px; max-width: 110px; display: block;">
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
            </select>
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
            <div style="display: flex; align-items: center;">
                <span class="material-symbols-outlined" style="color: #38398f;">
                speed
                </span>
                <p for="assistantSpeed" style="margin-left: 8px; margin-top: 15px;">Velocidad del habla:</p>
            </div>
            <input type="range" id="assistantSpeed" name="assistantSpeed" min="0" max="100" value="50" style="accent-color: #38398f; color: #38398f; width: 100%; max-width:100px; background: #38398f;">
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
            <div style="display: flex; align-items: center;">
                <span class="material-symbols-outlined" style="color: #38398f;">
                voice_selection
                </span>
                <p for="assistantTone" style="margin-left: 8px; margin-top: 15px;">Tono de voz:</p>
            </div>
            <select id="assistantTone" name="assistantTone" style="border: none; border-bottom: 1px solid #38398f; color: #38398f; padding: 8px; max-width: 110px; display: block;">
                <option value="bajo">Bajo</option>
                <option value="medio">Medio</option>
                <option value="alto">Alto</option>
            </select>
        </div>
        <div style="display: flex; justify-content: center;">
            <button type="submit" style="margin:20px 0; background-color: #38388E; color: white; padding: 10px 20px; border: none; border-radius: 100px; cursor: pointer; width: 153px;font-size: 14px;">Guardar</button>
        </div>
    </div>
    `;
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.backgroundColor = 'white';
    popup.style.padding = '20px';
    popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    popup.style.zIndex = '1000';

    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '999';
    document.body.appendChild(overlay);

    overlay.addEventListener('click', () => {
        popup.remove();
        overlay.remove();
    });
    document.body.appendChild(popup);

    const closePopup = popup.querySelector('.close-popup');
    closePopup.addEventListener('click', () => {
        popup.remove();
        overlay.remove();
    });

    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.remove();
            overlay.remove();
        }
    });

    const signUpLink = popup.querySelector('.sign-up-link');
    signUpLink.addEventListener('click', (e) => {
        e.preventDefault();
        popup.remove();
        overlay.remove();
        openSignUpPopup();
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('newAlarmModal');
    const modalTitle = document.getElementById('modalDeviceTitle');
    let currentDeviceCard = null;

    document.querySelectorAll('.add-alarm').forEach(button => {
        button.addEventListener('click', (e) => {
            const deviceCard = e.target.closest('.device-card');
            currentDeviceCard = deviceCard; // Set global state
            openAddAlarmPopup();
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
            
            if (section === 'Alarmas') {
                window.location.href = 'alarmas.html';
            } else if (section === 'Calendario') {
                window.location.href = 'calendario.html';
            } else if (section === 'Asistentes') {
                window.location.href = 'asistentes.html';
            } else if (section === 'Reportes') {
                window.location.href = 'reportes.html';
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
