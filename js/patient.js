// DOM Elements and Initialization
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser || currentUser.userType !== 'patient') {
        // Redirect to login if not logged in or not a patient
        window.location.href = 'index.html';
        return;
    }
    
    // DOM elements
    const userNameElements = document.querySelectorAll('.user-name');
    const userEmailElement = document.querySelector('.user-email');
    const userInitialsElement = document.querySelector('.user-initials');
    const logoutBtn = document.getElementById('logoutBtn');
    const doctorListContainer = document.getElementById('doctorList');
    const appointmentCardsContainer = document.getElementById('appointmentCards');
    const bookAppointmentModal = document.getElementById('bookAppointmentModal');
    const bookAppointmentForm = document.getElementById('bookAppointmentForm');
    const modalCloseBtn = document.querySelector('.modal-close');
    const modalCancelBtn = document.querySelector('.modal-cancel');
    const appointmentCountElement = document.getElementById('appointmentCount');
    const upcomingCountElement = document.getElementById('upcomingCount');
    const completedCountElement = document.getElementById('completedCount');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Notification elements
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationBadge = document.getElementById('notificationBadge');
    const notificationDropdown = document.getElementById('notificationDropdown');
    const notificationContent = document.getElementById('notificationContent');
    
    // Initialize page
    initializePage();
    
    // Event Listeners
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }
    
    if (modalCancelBtn) {
        modalCancelBtn.addEventListener('click', closeModal);
    }
    
    if (bookAppointmentForm) {
        bookAppointmentForm.addEventListener('submit', bookAppointment);
    }
    
    // Add event listeners for filter buttons
    if (filterButtons) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Reload appointments with filter
                loadAppointments();
            });
        });
    }
    
    // Notification button event listener
    if (notificationBtn) {
        notificationBtn.addEventListener('click', toggleNotificationDropdown);
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            if (!notificationBtn.contains(event.target) && !notificationDropdown.contains(event.target)) {
                notificationDropdown.classList.remove('show');
            }
        });
    }
    
    // Add event listeners for sidebar navigation
    document.getElementById('dashboard-link')?.addEventListener('click', function() {
        // Show all sections
        document.querySelectorAll('.dashboard-content > div').forEach(section => {
            section.style.display = 'block';
        });
        
        // Update active menu item
        updateActiveMenuItem(this);
    });
    
    document.getElementById('appointments-link')?.addEventListener('click', function() {
        // Hide all sections first
        document.querySelectorAll('.dashboard-content > div').forEach(section => {
            section.style.display = 'none';
        });
        
        // Show only the appointments section
        document.querySelector('.appointments').style.display = 'block';
        
        // Update active menu item
        updateActiveMenuItem(this);
    });
    
    document.getElementById('doctors-link')?.addEventListener('click', function() {
        // Hide all sections first
        document.querySelectorAll('.dashboard-content > div').forEach(section => {
            section.style.display = 'none';
        });
        
        // Show only the doctors section
        document.querySelector('.doctors').style.display = 'block';
        
        // Update active menu item
        updateActiveMenuItem(this);
    });
    
    document.getElementById('prescriptions-link')?.addEventListener('click', function() {
        // Hide all sections first
        document.querySelectorAll('.dashboard-content > div').forEach(section => {
            section.style.display = 'block';
        });
        
        // Show only the prescriptions section
        document.querySelector('.prescriptions-section').style.display = 'block';
        
        // Update active menu item
        updateActiveMenuItem(this);
    });
    
    // Helper function to update active menu item
    function updateActiveMenuItem(activeItem) {
        // Remove active class from all menu items
        document.querySelectorAll('.sidebar-menu .menu-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to clicked menu item
        activeItem.classList.add('active');
    }
    
    // Functions
    function initializePage() {
        // Set user information
        if (userNameElements) {
            userNameElements.forEach(element => {
                element.textContent = currentUser.name;
            });
        }
        
        if (userEmailElement) {
            userEmailElement.textContent = currentUser.email;
        }
        
        if (userInitialsElement) {
            userInitialsElement.textContent = getInitials(currentUser.name);
        }
        
        // Load doctors list
        loadDoctors();
        
        // Load appointments
        loadAppointments();
        
        // Load prescriptions
        loadPrescriptions();
        
        // Update dashboard counts
        updateDashboardCounts();
        
        // Load notifications
        loadNotifications();
    }
    
    function getInitials(name) {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase();
    }
    
    function logout() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
    
    function loadDoctors() {
        if (!doctorListContainer) return;
        
        const doctors = JSON.parse(localStorage.getItem('doctors')) || [];
        
        if (doctors.length === 0) {
            doctorListContainer.innerHTML = '<p class="no-data">No doctors available at the moment.</p>';
            return;
        }
        
        let doctorHTML = '';
        
        doctors.forEach(doctor => {
            doctorHTML += `
            <div class="doctor-card">
                <div class="doctor-header">
                    <div class="doctor-avatar">${getInitials(doctor.name)}</div>
                    <h3>${doctor.name}</h3>
                    <p>${doctor.specialization}</p>
                </div>
                <div class="doctor-details">
                    <div class="doctor-info">
                        <div class="doctor-info-item">
                            <i class="fas fa-briefcase"></i>
                            <span>${doctor.experience} Years Experience</span>
                        </div>
                        <div class="doctor-info-item">
                            <i class="fas fa-envelope"></i>
                            <span>${doctor.email}</span>
                        </div>
                    </div>
                    <div class="doctor-action">
                        <button class="book-btn" onclick="openBookingModal('${doctor.id}', '${doctor.name}', '${doctor.specialization}')">
                            Book Appointment
                        </button>
                    </div>
                </div>
            </div>
            `;
        });
        
        doctorListContainer.innerHTML = doctorHTML;
    }
    
    function loadAppointments() {
        if (!appointmentCardsContainer) return;
        
        // Get current user's appointments
        const appointments = currentUser.appointments || [];
        
        if (appointments.length === 0) {
            appointmentCardsContainer.innerHTML = '<div class="no-data">No appointments scheduled.</div>';
            return;
        }
        
        // Sort by date (newest first)
        appointments.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Get active filter
        const activeFilter = document.querySelector('.filter-btn.active');
        const filterValue = activeFilter ? activeFilter.dataset.filter : 'all';
        
        // Filter appointments based on active filter
        const filteredAppointments = filterValue === 'all' ? 
            appointments : 
            appointments.filter(appointment => {
                if (filterValue === 'upcoming') return appointment.status === 'Upcoming';
                if (filterValue === 'completed') return appointment.status === 'Completed';
                if (filterValue === 'cancelled') return appointment.status === 'Cancelled';
                return true;
            });
        
        if (filteredAppointments.length === 0) {
            appointmentCardsContainer.innerHTML = `<div class="no-data">No ${filterValue} appointments found.</div>`;
            return;
        }
        
        let appointmentHTML = '';
        
        filteredAppointments.forEach(appointment => {
            const statusClass = getStatusClass(appointment.status);
            const appointmentDate = new Date(appointment.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const isToday = appointmentDate.getTime() === today.getTime();
            const isTomorrow = appointmentDate.getTime() === today.getTime() + 86400000;
            const isPast = appointmentDate < today;
            
            let dateLabel = formatDate(appointment.date);
            if (isToday) dateLabel = 'Today';
            if (isTomorrow) dateLabel = 'Tomorrow';
            
            // Set appropriate icon based on appointment status
            let statusIcon = 'fa-calendar-check';
            if (appointment.status === 'Completed') statusIcon = 'fa-check-circle';
            if (appointment.status === 'Cancelled') statusIcon = 'fa-times-circle';
            
            // Create priority label for appointments
            let priorityLabel = '';
            let priorityClass = '';
            
            if (isToday && appointment.status === 'Upcoming') {
                priorityLabel = 'Today';
                priorityClass = 'priority-high';
            } else if (isTomorrow && appointment.status === 'Upcoming') {
                priorityLabel = 'Tomorrow';
                priorityClass = 'priority-medium';
            } else if (!isPast && appointment.status === 'Upcoming') {
                priorityLabel = 'Upcoming';
                priorityClass = 'priority-low';
            }
            
            appointmentHTML += `
            <div class="appointment-card ${statusClass.replace('status-', '')}">
                <div class="appointment-card-header">
                    <div class="appointment-status">
                        <i class="fas ${statusIcon}"></i>
                        <span class="status-badge ${statusClass}">${appointment.status}</span>
                    </div>
                    ${priorityLabel ? `<div class="priority-badge ${priorityClass}">${priorityLabel}</div>` : ''}
                </div>
                <div class="appointment-card-body">
                    <div class="appointment-doctor">
                        <div class="doctor-avatar">${getInitials(appointment.doctorName)}</div>
                        <div class="doctor-info">
                            <h3>${appointment.doctorName}</h3>
                            <p>${appointment.specialization}</p>
                        </div>
                    </div>
                    <div class="appointment-details">
                        <div class="appointment-detail">
                            <i class="fas fa-calendar-alt"></i>
                            <span>${dateLabel}</span>
                        </div>
                        <div class="appointment-detail">
                            <i class="fas fa-clock"></i>
                            <span>${appointment.time}</span>
                        </div>
                        <div class="appointment-detail">
                            <i class="fas fa-stethoscope"></i>
                            <span>${appointment.reason || 'General Consultation'}</span>
                        </div>
                        <div class="appointment-detail">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${appointment.type === 'in-person' ? 'In-Person Visit' : 'In-Person Visit'}</span>
                        </div>
                    </div>
                </div>
                <div class="appointment-card-footer">
                    <button class="btn-secondary" onclick="viewAppointmentDetails('${appointment.id}')">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    ${appointment.status === 'Upcoming' ? 
                    `<button class="btn-danger" onclick="cancelAppointment('${appointment.id}')">
                        <i class="fas fa-times"></i> Cancel
                    </button>` : ''}
                </div>
            </div>
            `;
        });
        
        appointmentCardsContainer.innerHTML = appointmentHTML;
    }
    
    function getStatusClass(status) {
        switch(status) {
            case 'Upcoming':
                return 'status-upcoming';
            case 'Completed':
                return 'status-completed';
            case 'Cancelled':
                return 'status-cancelled';
            default:
                return '';
        }
    }
    
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
    
    function updateDashboardCounts() {
        // Get current user's appointments
        const appointments = currentUser.appointments || [];
        
        // Count total appointments
        if (appointmentCountElement) {
            appointmentCountElement.textContent = appointments.length;
        }
        
        // Count upcoming appointments
        if (upcomingCountElement) {
            const upcomingCount = appointments.filter(a => a.status === 'Upcoming').length;
            upcomingCountElement.textContent = upcomingCount;
        }
        
        // Count completed appointments
        if (completedCountElement) {
            const completedCount = appointments.filter(a => a.status === 'Completed').length;
            completedCountElement.textContent = completedCount;
        }
    }
    
    function openModal() {
        if (bookAppointmentModal) {
            bookAppointmentModal.classList.add('active');
        }
    }
    
    function closeModal() {
        if (bookAppointmentModal) {
            bookAppointmentModal.classList.remove('active');
            // Reset form if needed
            if (bookAppointmentForm) {
                bookAppointmentForm.reset();
            }
        }
    }
    
    function bookAppointment(e) {
        e.preventDefault();
        
        // Get form data
        const doctorId = document.getElementById('appointmentDoctorId').value;
        const doctorName = document.getElementById('appointmentDoctorName').textContent;
        const specialization = document.getElementById('appointmentSpecialization').textContent;
        const date = document.getElementById('appointmentDate').value;
        const time = document.getElementById('appointmentTime').value;
        const reason = document.getElementById('appointmentReason').value;
        const type = document.getElementById('appointmentType').value;
        
        if (!date || !time) {
            alert('Please select a date and time for your appointment.');
            return;
        }
        
        // Create appointment object
        const appointment = {
            id: generateAppointmentId(),
            doctorId,
            doctorName,
            specialization,
            patientId: currentUser.id,
            patientName: currentUser.name,
            date,
            time,
            reason: reason || 'General Consultation',
            type: type || 'in-person',
            status: 'Upcoming',
            notes: '',
            createdAt: new Date().toISOString()
        };
        
        // Add to current user's appointments
        currentUser.appointments = currentUser.appointments || [];
        currentUser.appointments.push(appointment);
        
        // Update localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update the users array
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        // Add to doctor's appointments
        const doctors = JSON.parse(localStorage.getItem('doctors')) || [];
        const doctor = doctors.find(d => d.id === doctorId);
        
        if (doctor) {
            doctor.appointments = doctor.appointments || [];
            doctor.appointments.push(appointment);
            
            // Update doctor in doctors array
            const doctorIndex = doctors.findIndex(d => d.id === doctor.id);
            
            if (doctorIndex !== -1) {
                doctors[doctorIndex] = doctor;
                localStorage.setItem('doctors', JSON.stringify(doctors));
            }
            
            // Update doctor in users array
            const doctorUserIndex = users.findIndex(u => u.id === doctor.id);
            
            if (doctorUserIndex !== -1) {
                users[doctorUserIndex] = doctor;
                localStorage.setItem('users', JSON.stringify(users));
            }
        }
        
        // Close modal and refresh
        closeModal();
        
        // Reload appointments
        loadAppointments();
        
        // Update dashboard counts
        updateDashboardCounts();
        
        alert('Appointment booked successfully!');
    }
    
    // Notification Functions
    function toggleNotificationDropdown() {
        notificationDropdown.classList.toggle('show');
    }
    
    function loadNotifications() {
        if (!notificationContent) return;
        
        // Initialize notifications array in user data if it doesn't exist
        if (!currentUser.notifications) {
            currentUser.notifications = [];
        }
        
        // Get prescription notifications
        const prescriptions = currentUser.prescriptions || [];
        const unviewedPrescriptions = prescriptions.filter(p => p.status === 'new');
        
        // Add prescription notifications if they don't already exist
        unviewedPrescriptions.forEach(prescription => {
            const notificationExists = currentUser.notifications.some(
                n => n.type === 'prescription' && n.id === prescription.id
            );
            
            if (!notificationExists) {
                currentUser.notifications.push({
                    id: generateId(),
                    type: 'prescription',
                    prescriptionId: prescription.id,
                    message: `New prescription from ${prescription.doctorName}`,
                    date: new Date().toISOString(),
                    read: false
                });
            }
        });
        document.getElementById('prescriptions-link')?.addEventListener('click', function() {
            // Navigate to prescriptions page
            window.location.href = 'prescriptions.html';
            
            // Update active menu item
            updateActiveMenuItem(this);
        });
        // Get appointment notifications
        const appointments = currentUser.appointments || [];
        const upcomingAppointments = appointments.filter(a => a.status === 'Upcoming');
        
        // Sort by date (most recent first)
        upcomingAppointments.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // Update notification badge
        let unreadCount = currentUser.notifications.filter(notification => !notification.read).length;
        notificationBadge.textContent = unreadCount;
        notificationBadge.style.display = unreadCount > 0 ? 'flex' : 'none';
        
        // Update local storage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Generate notification items HTML
        if (upcomingAppointments.length === 0) {
            notificationContent.innerHTML = '<div class="notification-empty">No notifications</div>';
            return;
        }
        
        let notificationsHTML = '';
        
        upcomingAppointments.forEach(appointment => {
            const appointmentDate = new Date(appointment.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const isToday = appointmentDate.getTime() === today.getTime();
            const isTomorrow = appointmentDate.getTime() === today.getTime() + 86400000;
            
            let dateLabel = formatDate(appointment.date);
            if (isToday) dateLabel = 'Today';
            if (isTomorrow) dateLabel = 'Tomorrow';
            
            const doctors = JSON.parse(localStorage.getItem('doctors')) || [];
            const doctor = doctors.find(doc => doc.id === appointment.doctorId) || { name: 'Unknown Doctor' };
            
            notificationsHTML += `
            <div class="notification-item" onclick="viewAppointmentDetails('${appointment.id}')">
                <div class="notification-content">
                    <div class="notification-title">Appointment with ${doctor.name}</div>
                    <div class="notification-message">${dateLabel} at ${appointment.time}</div>
                </div>
                <div class="notification-time">${appointment.type}</div>
            </div>
            `;
        });
        
        notificationContent.innerHTML = notificationsHTML;
    }
});

// Global functions (accessible from HTML)
function generateAppointmentId() {
    return 'appt_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function openBookingModal(doctorId, doctorName, specialization) {
    const modal = document.getElementById('bookAppointmentModal');
    const doctorIdField = document.getElementById('appointmentDoctorId');
    const doctorNameField = document.getElementById('appointmentDoctorName');
    const specializationField = document.getElementById('appointmentSpecialization');
    
    // Set minimum date to today
    const dateField = document.getElementById('appointmentDate');
    if (dateField) {
        const today = new Date().toISOString().split('T')[0];
        dateField.min = today;
    }
    
    if (modal && doctorIdField && doctorNameField && specializationField) {
        doctorIdField.value = doctorId;
        doctorNameField.textContent = doctorName;
        specializationField.textContent = specialization;
        
        // Update modal title
        const modalTitle = modal.querySelector('.modal-title');
        if (modalTitle) {
            modalTitle.textContent = `Book Appointment with ${doctorName}`;
        }
        
        modal.classList.add('active');
    }
}

function viewAppointmentDetails(appointmentId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) return;
    
    const appointment = currentUser.appointments.find(a => a.id === appointmentId);
    
    if (appointment) {
        alert(`Appointment Details:
Doctor: ${appointment.doctorName}
Specialization: ${appointment.specialization}
Date: ${new Date(appointment.date).toLocaleDateString()}
Time: ${appointment.time}
Status: ${appointment.status}
Reason: ${appointment.reason || 'Not specified'}`);
    }
}

function cancelAppointment(appointmentId) {
    if (!confirm('Are you sure you want to cancel this appointment?')) {
        return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) return;
    
    // Find appointment
    const appointmentIndex = currentUser.appointments.findIndex(a => a.id === appointmentId);
    
    if (appointmentIndex === -1) {
        alert('Appointment not found');
        return;
    }
    
    const appointment = currentUser.appointments[appointmentIndex];
    
    // Update status
    appointment.status = 'Cancelled';
    
    // Update in current user
    currentUser.appointments[appointmentIndex] = appointment;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update in users array
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // Update in doctor's appointments
    const doctors = JSON.parse(localStorage.getItem('doctors')) || [];
    const doctor = doctors.find(d => d.id === appointment.doctorId);
    
    if (doctor) {
        const doctorAppointmentIndex = doctor.appointments.findIndex(a => a.id === appointmentId);
        
        if (doctorAppointmentIndex !== -1) {
            doctor.appointments[doctorAppointmentIndex] = appointment;
            
            // Update doctor in doctors array
            const doctorIndex = doctors.findIndex(d => d.id === doctor.id);
            
            if (doctorIndex !== -1) {
                doctors[doctorIndex] = doctor;
                localStorage.setItem('doctors', JSON.stringify(doctors));
            }
            
            // Update doctor in users array
            const doctorUserIndex = users.findIndex(u => u.id === doctor.id);
            
            if (doctorUserIndex !== -1) {
                users[doctorUserIndex] = doctor;
                localStorage.setItem('users', JSON.stringify(users));
            }
        }
    }
    
    // Reload appointments
    const appointmentCardsContainer = document.getElementById('appointmentCards');
    if (appointmentCardsContainer) {
        // Get current user's appointments
        const appointments = currentUser.appointments || [];
        
        if (appointments.length === 0) {
            appointmentCardsContainer.innerHTML = '<div class="no-data">No appointments scheduled.</div>';
            return;
        }
        
        // Sort by date (newest first)
        appointments.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        let appointmentHTML = '';
        
        appointments.forEach(appointment => {
            const statusClass = 
                appointment.status === 'Upcoming' ? 'status-upcoming' :
                appointment.status === 'Completed' ? 'status-completed' :
                'status-cancelled';
            
            const appointmentDate = new Date(appointment.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const isToday = appointmentDate.getTime() === today.getTime();
            const isTomorrow = appointmentDate.getTime() === today.getTime() + 86400000;
            const isPast = appointmentDate < today;
            
            let dateLabel = formatDate(appointment.date);
            if (isToday) dateLabel = 'Today';
            if (isTomorrow) dateLabel = 'Tomorrow';
            
            // Set appropriate icon based on appointment status
            let statusIcon = 'fa-calendar-check';
            if (appointment.status === 'Completed') statusIcon = 'fa-check-circle';
            if (appointment.status === 'Cancelled') statusIcon = 'fa-times-circle';
            
            // Create priority label for appointments
            let priorityLabel = '';
            let priorityClass = '';
            
            if (isToday && appointment.status === 'Upcoming') {
                priorityLabel = 'Today';
                priorityClass = 'priority-high';
            } else if (isTomorrow && appointment.status === 'Upcoming') {
                priorityLabel = 'Tomorrow';
                priorityClass = 'priority-medium';
            } else if (!isPast && appointment.status === 'Upcoming') {
                priorityLabel = 'Upcoming';
                priorityClass = 'priority-low';
            }
            
            appointmentHTML += `
            <div class="appointment-card ${statusClass.replace('status-', '')}">
                <div class="appointment-card-header">
                    <div class="appointment-status">
                        <i class="fas ${statusIcon}"></i>
                        <span class="status-badge ${statusClass}">${appointment.status}</span>
                    </div>
                    ${priorityLabel ? `<div class="priority-badge ${priorityClass}">${priorityLabel}</div>` : ''}
                </div>
                <div class="appointment-card-body">
                    <div class="appointment-doctor">
                        <div class="doctor-avatar">${getInitials(appointment.doctorName)}</div>
                        <div class="doctor-info">
                            <h3>${appointment.doctorName}</h3>
                            <p>${appointment.specialization}</p>
                        </div>
                    </div>
                    <div class="appointment-details">
                        <div class="appointment-detail">
                            <i class="fas fa-calendar-alt"></i>
                            <span>${dateLabel}</span>
                        </div>
                        <div class="appointment-detail">
                            <i class="fas fa-clock"></i>
                            <span>${appointment.time}</span>
                        </div>
                        <div class="appointment-detail">
                            <i class="fas fa-stethoscope"></i>
                            <span>${appointment.reason || 'General Consultation'}</span>
                        </div>
                        <div class="appointment-detail">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${appointment.type === 'in-person' ? 'In-Person Visit' : 'In-Person Visit'}</span>
                        </div>
                    </div>
                </div>
                <div class="appointment-card-footer">
                    <button class="btn-secondary" onclick="viewAppointmentDetails('${appointment.id}')">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    ${appointment.status === 'Upcoming' ? 
                    `<button class="btn-danger" onclick="cancelAppointment('${appointment.id}')">
                        <i class="fas fa-times"></i> Cancel
                    </button>` : ''}
                </div>
            </div>
            `;
        });
        
        appointmentCardsContainer.innerHTML = appointmentHTML;
    }
    
    // Update dashboard counts
    const appointmentCountElement = document.getElementById('appointmentCount');
    const upcomingCountElement = document.getElementById('upcomingCount');
    const completedCountElement = document.getElementById('completedCount');
    
    if (appointmentCountElement) {
        appointmentCountElement.textContent = currentUser.appointments.length;
    }
    
    if (upcomingCountElement) {
        const upcomingCount = currentUser.appointments.filter(a => a.status === 'Upcoming').length;
        upcomingCountElement.textContent = upcomingCount;
    }
    
    if (completedCountElement) {
        const completedCount = currentUser.appointments.filter(a => a.status === 'Completed').length;
        completedCountElement.textContent = completedCount;
    }
    
    alert('Appointment cancelled successfully');
}

// Prescription functions
function loadPrescriptions() {
    const prescriptionCardsContainer = document.getElementById('prescriptionCards');
    if (!prescriptionCardsContainer) {
        console.error('Prescription cards container not found');
        return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // Initialize prescriptions array if it doesn't exist
    if (!currentUser.prescriptions) {
        currentUser.prescriptions = [
            // Sample prescription data - will be replaced with actual data
            {
                id: 'prescription123',
                doctorId: 'doctor1',
                doctorName: 'Dr. Sarah Johnson',
                specialty: 'Cardiologist',
                title: 'Blood Pressure Medication',
                notes: 'Take twice daily with food',
                date: '2025-04-02T10:30:00',
                status: 'new',
                pdfUrl: 'prescriptions/prescription123.pdf'
            },
            {
                id: 'prescription124',
                doctorId: 'doctor2',
                doctorName: 'Dr. James Henderson',
                specialty: 'General Physician',
                title: 'Antibiotic Treatment',
                notes: 'Take three times daily after meals for 7 days',
                date: '2025-03-15T14:00:00',
                status: 'viewed',
                pdfUrl: 'prescriptions/prescription124.pdf'
            }
        ];
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    
    console.log('Loading prescriptions:', currentUser.prescriptions);
    
    // Get active filter
    const activeFilter = document.querySelector('.prescriptions-section .filter-btn.active');
    const filterValue = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
    
    // Filter prescriptions based on active filter
    let filteredPrescriptions = [...currentUser.prescriptions];
    if (filterValue === 'new') {
        filteredPrescriptions = filteredPrescriptions.filter(p => p.status === 'new');
    } else if (filterValue === 'viewed') {
        filteredPrescriptions = filteredPrescriptions.filter(p => p.status === 'viewed');
    }
    
    // Sort prescriptions by date (newest first)
    filteredPrescriptions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Generate HTML for prescriptions
    let prescriptionsHTML = '';
    
    if (filteredPrescriptions.length === 0) {
        prescriptionsHTML = '<div class="no-data-message">No prescriptions found</div>';
    } else {
        filteredPrescriptions.forEach(prescription => {
            const date = new Date(prescription.date);
            const formattedDate = date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
            
            prescriptionsHTML += `
            <div class="prescription-card">
                <div class="prescription-header">
                    <div class="prescription-date">${formattedDate}</div>
                    <div class="prescription-status ${prescription.status}">${prescription.status === 'new' ? 'New' : 'Viewed'}</div>
                </div>
                <div class="prescription-body">
                    <div class="doctor-info">
                        <div class="avatar">${getInitials(prescription.doctorName)}</div>
                        <div class="doctor-details">
                            <div class="doctor-name">${prescription.doctorName}</div>
                            <div class="doctor-specialty">${prescription.specialty}</div>
                        </div>
                    </div>
                    <div class="prescription-details">
                        <div class="prescription-title">${prescription.title}</div>
                        <div class="prescription-notes">${prescription.notes}</div>
                    </div>
                </div>
                <div class="prescription-actions">
                    <button class="btn-primary view-prescription" onclick="viewPrescription('${prescription.id}')">
                        <i class="fas fa-file-pdf"></i> View PDF
                    </button>
                    <button class="btn-secondary download-prescription" onclick="downloadPrescription('${prescription.id}')">
                        <i class="fas fa-download"></i> Download
                    </button>
                </div>
            </div>
            `;
        });
    }
    
    prescriptionCardsContainer.innerHTML = prescriptionsHTML;
    
    // Add event listeners for prescription filter buttons
    const prescriptionFilterButtons = document.querySelectorAll('.prescriptions-section .filter-btn');
    if (prescriptionFilterButtons) {
        prescriptionFilterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                prescriptionFilterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Reload prescriptions with filter
                loadPrescriptions();
            });
        });
    }
}

// Global prescription functions
function viewPrescription(prescriptionId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.prescriptions) return;
    
    // Find the prescription
    const prescription = currentUser.prescriptions.find(p => p.id === prescriptionId);
    if (!prescription) {
        alert('Prescription not found');
        return;
    }
    
    // Mark prescription as viewed
    prescription.status = 'viewed';
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Remove notification for this prescription
    if (currentUser.notifications) {
        currentUser.notifications = currentUser.notifications.filter(n => 
            !(n.type === 'prescription' && n.prescriptionId === prescriptionId)
        );
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update notification badge
        const notificationBadge = document.getElementById('notificationBadge');
        if (notificationBadge) {
            const unreadCount = currentUser.notifications.filter(n => !n.read).length;
            notificationBadge.textContent = unreadCount;
            notificationBadge.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
    }
    
    // Open prescription PDF in a new tab (in a real app, this would be a real PDF)
    // For demo purposes, we'll show an alert
    alert(`Viewing prescription: ${prescription.title}\nThis would open the prescription PDF in a real application.`);
    
    // Refresh the prescription list to show updated status
    const loadPrescriptions = window.loadPrescriptions || function() {
        console.log('Reloading prescriptions...');
        location.reload();
    };
    loadPrescriptions();
}

function downloadPrescription(prescriptionId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.prescriptions) return;
    
    // Find the prescription
    const prescription = currentUser.prescriptions.find(p => p.id === prescriptionId);
    if (!prescription) {
        alert('Prescription not found');
        return;
    }
    
    // Mark prescription as viewed if it's new
    if (prescription.status === 'new') {
        prescription.status = 'viewed';
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    
    // In a real application, this would trigger a download of the PDF file
    // For demo purposes, we'll show an alert
    alert(`Downloading prescription: ${prescription.title}\nThis would download the prescription PDF in a real application.`);
    
    // Refresh the prescription list
    const loadPrescriptions = window.loadPrescriptions || function() {
        console.log('Reloading prescriptions...');
        location.reload();
    };
    loadPrescriptions();
}

// Helper function to generate a unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}