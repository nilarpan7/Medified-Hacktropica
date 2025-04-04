// DOM Elements and Initialization
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser || currentUser.userType !== 'patient') {
        // Redirect to login if not logged in or not a doctor
        window.location.href = 'index.html';
        return;
    }
    
    // DOM elements
    const userNameElements = document.querySelectorAll('.user-name');
    const userSpecializationElement = document.querySelector('.user-specialization');
    const userInitialsElements = document.querySelectorAll('.user-initials');
    const patientsTableBody = document.getElementById('patientsTableBody');
    const patientSearchInput = document.getElementById('patientSearchInput');
    const statusFilter = document.getElementById('appointmentStatusFilter');
    const applyFiltersBtn = document.getElementById('applyPatientFilters');
    const resetFiltersBtn = document.getElementById('resetPatientFilters');
    const totalPatientsCountElement = document.getElementById('totalPatientsCount');
    const newPatientsCountElement = document.getElementById('newPatientsCount');
    const followUpCountElement = document.getElementById('followUpCount');
    
    // Initialize page
    initializePage();
    
    // Event Listeners
    if (patientSearchInput) {
        patientSearchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            filterPatients(searchTerm, statusFilter.value);
        });
    }
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            const searchTerm = patientSearchInput.value.toLowerCase().trim();
            filterPatients(searchTerm, statusFilter.value);
        });
    }
    
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            patientSearchInput.value = '';
            statusFilter.value = '';
            loadPatients();
        });
    }
    
    // Functions
    function initializePage() {
        // Set user information
        if (userNameElements) {
            userNameElements.forEach(element => {
                element.textContent = currentUser.name;
            });
        }
        
        if (userSpecializationElement) {
            userSpecializationElement.textContent = currentUser.specialization || '';
        }
        
        if (userInitialsElements) {
            userInitialsElements.forEach(element => {
                element.textContent = getInitials(currentUser.name);
            });
        }
        
        // Load patients and update statistics
        loadPatients();
        updatePatientStatistics();
    }
    
    function getInitials(name) {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase();
    }
    
    function loadPatients() {
        if (!patientsTableBody) return;
        
        // Get all users
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Filter to get only patients who have had appointments with this doctor
        const patients = users.filter(user => 
            user.userType === 'patient' && 
            (user.appointments || []).some(appointment => appointment.doctorId === currentUser.id)
        );
        
        if (patients.length === 0) {
            patientsTableBody.innerHTML = '<tr><td colspan="6" class="no-data">No patients found.</td></tr>';
            return;
        }
        
        renderPatients(patients);
    }
    
    function renderPatients(patients) {
        if (!patientsTableBody) return;
        
        if (patients.length === 0) {
            patientsTableBody.innerHTML = '<tr><td colspan="6" class="no-data">No patients match your criteria.</td></tr>';
            return;
        }
        
        let patientsHTML = '';
        
        patients.forEach(patient => {
            // Get patient's appointments with this doctor
            const appointments = (patient.appointments || []).filter(a => a.doctorId === currentUser.id);
            
            // Sort by date (newest first)
            appointments.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // Get last appointment and next appointment
            const lastAppointment = appointments.find(a => a.status === 'Completed') || {};
            const nextAppointment = appointments.find(a => a.status === 'Upcoming') || {};
            
            // Determine patient status
            let status = '';
            let statusClass = '';
            
            if (appointments.length === 1 && appointments[0].status === 'Upcoming') {
                status = 'New Patient';
                statusClass = 'status-upcoming';
            } else if (nextAppointment.id) {
                status = 'Active';
                statusClass = 'status-upcoming';
            } else if (lastAppointment.id) {
                // Last appointment was more than a month ago - follow up
                const lastDate = new Date(lastAppointment.date);
                const oneMonthAgo = new Date();
                oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                
                if (lastDate < oneMonthAgo) {
                    status = 'Follow-up Required';
                    statusClass = 'status-cancelled';
                } else {
                    status = 'Completed';
                    statusClass = 'status-completed';
                }
            }
            
            patientsHTML += `
            <tr>
                <td>${patient.name}</td>
                <td>${patient.email}</td>
                <td>${lastAppointment.date ? formatDate(lastAppointment.date) : 'No visits yet'}</td>
                <td>${nextAppointment.date ? formatDate(nextAppointment.date) + ' at ' + nextAppointment.time : 'None scheduled'}</td>
                <td><span class="status-badge ${statusClass}">${status}</span></td>
                <td>
                    <button class="action-btn" onclick="viewPatientDetails('${patient.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn" onclick="scheduleAppointment('${patient.id}')">
                        <i class="fas fa-calendar-plus"></i>
                    </button>
                    ${nextAppointment.type === 'video-call' ? 
                    `<button class="action-btn" onclick="startVideoCall('${nextAppointment.id}')">
                        <i class="fas fa-video"></i>
                    </button>` : ''}
                </td>
            </tr>
            `;
        });
        
        patientsTableBody.innerHTML = patientsHTML;
    }
    
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
    
    function filterPatients(searchTerm, statusFilter) {
        // Get all users
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Filter to get only patients who have had appointments with this doctor
        let patients = users.filter(user => 
            user.userType === 'patient' && 
            (user.appointments || []).some(appointment => appointment.doctorId === currentUser.id)
        );
        
        // Apply search term filter
        if (searchTerm) {
            patients = patients.filter(patient => 
                patient.name.toLowerCase().includes(searchTerm) || 
                patient.email.toLowerCase().includes(searchTerm)
            );
        }
        
        // Apply status filter
        if (statusFilter) {
            patients = patients.filter(patient => {
                const appointments = (patient.appointments || []).filter(a => a.doctorId === currentUser.id);
                
                // Sort by date (newest first)
                appointments.sort((a, b) => new Date(b.date) - new Date(a.date));
                
                const lastAppointment = appointments.find(a => a.status === 'Completed') || {};
                const nextAppointment = appointments.find(a => a.status === 'Upcoming') || {};
                
                switch(statusFilter) {
                    case 'active':
                        return nextAppointment.id;
                    case 'new':
                        return appointments.length === 1 && appointments[0].status === 'Upcoming';
                    case 'follow-up':
                        if (!lastAppointment.id) return false;
                        const lastDate = new Date(lastAppointment.date);
                        const oneMonthAgo = new Date();
                        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                        return lastDate < oneMonthAgo && !nextAppointment.id;
                    default:
                        return true;
                }
            });
        }
        
        renderPatients(patients);
    }
    
    function updatePatientStatistics() {
        // Get all users
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Filter to get only patients who have had appointments with this doctor
        const patients = users.filter(user => 
            user.userType === 'patient' && 
            (user.appointments || []).some(appointment => appointment.doctorId === currentUser.id)
        );
        
        // Total patients
        if (totalPatientsCountElement) {
            totalPatientsCountElement.textContent = patients.length;
        }
        
        // New patients (this month)
        if (newPatientsCountElement) {
            const thisMonth = new Date().getMonth();
            const thisYear = new Date().getFullYear();
            
            const newPatients = patients.filter(patient => {
                const appointments = (patient.appointments || []).filter(a => a.doctorId === currentUser.id);
                
                if (appointments.length === 0) return false;
                
                // Sort by date (oldest first)
                appointments.sort((a, b) => new Date(a.date) - new Date(b.date));
                
                // Check if first appointment is this month
                const firstDate = new Date(appointments[0].date);
                return firstDate.getMonth() === thisMonth && firstDate.getFullYear() === thisYear;
            });
            
            newPatientsCountElement.textContent = newPatients.length;
        }
        
        // Follow-up required
        if (followUpCountElement) {
            const followUpPatients = patients.filter(patient => {
                const appointments = (patient.appointments || []).filter(a => a.doctorId === currentUser.id);
                
                if (appointments.length === 0) return false;
                
                // Sort by date (newest first)
                appointments.sort((a, b) => new Date(b.date) - new Date(a.date));
                
                const lastAppointment = appointments.find(a => a.status === 'Completed') || {};
                const nextAppointment = appointments.find(a => a.status === 'Upcoming') || {};
                
                if (!lastAppointment.id) return false;
                
                const lastDate = new Date(lastAppointment.date);
                const oneMonthAgo = new Date();
                oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                
                return lastDate < oneMonthAgo && !nextAppointment.id;
            });
            
            followUpCountElement.textContent = followUpPatients.length;
        }
    }
});

// Global Functions
function viewPatientDetails(patientId) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const patient = users.find(u => u.id === patientId);
    
    if (!patient) {
        alert('Patient not found');
        return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        alert('Please log in again');
        return;
    }
    
    // Get patient's appointments with this doctor
    const appointments = (patient.appointments || []).filter(a => a.doctorId === currentUser.id);
    
    // Sort by date (newest first)
    appointments.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Populate modal
    const modal = document.getElementById('patientDetailModal');
    
    if (modal) {
        document.getElementById('modalPatientName').textContent = patient.name;
        document.getElementById('modalPatientEmail').textContent = patient.email;
        document.getElementById('modalPatientPhone').textContent = patient.phone || 'Not provided';
        document.getElementById('modalPatientDob').textContent = patient.dob ? new Date(patient.dob).toLocaleDateString() : 'Not provided';
        
        // Medical history
        if (patient.medicalHistory) {
            const history = [];
            
            if (patient.medicalHistory.conditions) {
                history.push(`<strong>Conditions:</strong> ${patient.medicalHistory.conditions}`);
            }
            
            if (patient.medicalHistory.surgeries) {
                history.push(`<strong>Previous Surgeries:</strong> ${patient.medicalHistory.surgeries}`);
            }
            
            document.getElementById('modalPatientHistory').innerHTML = history.length > 0 ? 
                history.join('<br><br>') : 'No history recorded';
            
            document.getElementById('modalPatientMedications').textContent = 
                patient.medicalHistory.medications || 'None';
            
            document.getElementById('modalPatientAllergies').textContent = 
                patient.medicalHistory.allergies || 'None';
        } else {
            document.getElementById('modalPatientHistory').textContent = 'No history recorded';
            document.getElementById('modalPatientMedications').textContent = 'None';
            document.getElementById('modalPatientAllergies').textContent = 'None';
        }
        
        // Appointment history
        const historyContainer = document.getElementById('patientAppointmentHistory');
        
        if (historyContainer) {
            if (appointments.length === 0) {
                historyContainer.innerHTML = '<p>No appointments found for this patient.</p>';
            } else {
                let historyHTML = '<table class="appointment-history-table"><thead><tr><th>Date</th><th>Time</th><th>Type</th><th>Status</th></tr></thead><tbody>';
                
                appointments.forEach(appointment => {
                    const statusClass = 
                        appointment.status === 'Upcoming' ? 'status-upcoming' :
                        appointment.status === 'Completed' ? 'status-completed' :
                        'status-cancelled';
                    
                    historyHTML += `
                    <tr>
                        <td>${new Date(appointment.date).toLocaleDateString()}</td>
                        <td>${appointment.time}</td>
                        <td>${appointment.type === 'video-call' ? 'Video Call' : 'In-Person'}</td>
                        <td><span class="status-badge ${statusClass}">${appointment.status}</span></td>
                    </tr>
                    `;
                });
                
                historyHTML += '</tbody></table>';
                historyContainer.innerHTML = historyHTML;
            }
        }
        
        // Set up buttons
        const scheduleBtn = document.getElementById('scheduleAppointmentBtn');
        if (scheduleBtn) {
            scheduleBtn.onclick = function() {
                scheduleAppointment(patientId);
                closeModal();
            };
        }
        
        
        
        // Set up close button
        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = modal.querySelector('.modal-cancel');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', closeModal);
        }
        
        // Show modal
        modal.classList.add('active');
    }
}

function closeModal() {
    const modal = document.getElementById('patientDetailModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function scheduleAppointment(patientId) {
    alert('Schedule appointment functionality will be implemented soon.');
    // In a real implementation, you would show a form to schedule a new appointment
}

