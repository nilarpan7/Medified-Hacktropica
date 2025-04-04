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
    const userInitialsElements = document.querySelectorAll('.user-initials');
    const doctorListContainer = document.getElementById('doctorList');
    const doctorSearchInput = document.getElementById('doctorSearchInput');
    const specialtyFilter = document.getElementById('specialtyFilter');
    const experienceFilter = document.getElementById('experienceFilter');
    const availabilityFilter = document.getElementById('availabilityFilter');
    const applyFiltersBtn = document.getElementById('applyFilters');
    const resetFiltersBtn = document.getElementById('resetFilters');
    
    // Update user information
    updateUserInfo();
    
    // Load doctors
    loadDoctors();
    
    // Event Listeners
    if (doctorSearchInput) {
        doctorSearchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            filterDoctors(searchTerm, specialtyFilter.value, experienceFilter.value);
        });
    }
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            const searchTerm = doctorSearchInput.value.toLowerCase().trim();
            filterDoctors(searchTerm, specialtyFilter.value, experienceFilter.value);
        });
    }
    
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            doctorSearchInput.value = '';
            specialtyFilter.value = '';
            experienceFilter.value = '';
            availabilityFilter.value = '';
            loadDoctors(); // Reset to showing all doctors
        });
    }
    
    // Functions
    function updateUserInfo() {
        if (userNameElements) {
            userNameElements.forEach(element => {
                element.textContent = currentUser.name;
            });
        }
        
        if (userInitialsElements) {
            userInitialsElements.forEach(element => {
                element.textContent = getInitials(currentUser.name);
            });
        }
    }
    
    function getInitials(name) {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase();
    }
    
    function loadDoctors() {
        if (!doctorListContainer) return;
        
        const doctors = JSON.parse(localStorage.getItem('doctors')) || [];
        
        if (doctors.length === 0) {
            doctorListContainer.innerHTML = '<p class="no-data">No doctors available at the moment.</p>';
            return;
        }
        
        renderDoctors(doctors);
    }
    
    function renderDoctors(doctors) {
        if (!doctorListContainer) return;
        
        if (doctors.length === 0) {
            doctorListContainer.innerHTML = '<p class="no-data">No doctors match your search criteria.</p>';
            return;
        }
        
        let doctorHTML = '';
        
        doctors.forEach(doctor => {
            // Calculate rating (random for demo purposes)
            const rating = (Math.floor(Math.random() * 20) + 35) / 10; // Random rating between 3.5 and 5.0
            const ratingStars = generateRatingStars(rating);
            
            // Determine random availability status
            const isAvailableToday = Math.random() > 0.3; // 70% chance of being available today
            const availabilityText = isAvailableToday ? 'Available Today' : 'Next Available: Tomorrow';
            const availabilityIcon = isAvailableToday ? 'fa-check-circle' : 'fa-calendar-alt';
            
            doctorHTML += `
            <div class="doctor-card">
                <div class="doctor-header">
                    <div class="availability-badge">
                        <i class="fas ${availabilityIcon}"></i> ${availabilityText}
                    </div>
                    <div class="doctor-avatar">${getInitials(doctor.name)}</div>
                    <h3>${doctor.name}</h3>
                    <p>${doctor.specialization}</p>
                    <div class="doctor-rating">
                        ${ratingStars}
                        <span>${rating.toFixed(1)}</span>
                    </div>
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
                        <div class="doctor-info-item">
                            <i class="fas fa-video"></i>
                            <span>Video Consultation Available</span>
                        </div>
                    </div>
                    <div class="doctor-action">
                        <button class="book-btn" onclick="openBookingModal('${doctor.id}', '${doctor.name}', '${doctor.specialization}')">
                            <i class="fas fa-calendar-plus"></i> Book Appointment
                        </button>
                    </div>
                </div>
            </div>
            `;
        });
        
        doctorListContainer.innerHTML = doctorHTML;
    }
    
    function generateRatingStars(rating) {
        let starsHTML = '';
        
        // Full stars
        const fullStars = Math.floor(rating);
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }
        
        // Half star if needed
        if (rating % 1 >= 0.5) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        
        // Empty stars to make it 5 stars total
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }
        
        return starsHTML;
    }
    
    function filterDoctors(searchTerm, specialty, experience) {
        const doctors = JSON.parse(localStorage.getItem('doctors')) || [];
        
        // Apply filters
        const filteredDoctors = doctors.filter(doctor => {
            // Search term filter
            const nameMatch = doctor.name.toLowerCase().includes(searchTerm);
            const specializationMatch = doctor.specialization.toLowerCase().includes(searchTerm);
            const searchMatch = nameMatch || specializationMatch || !searchTerm;
            
            // Specialty filter
            const specialtyMatch = !specialty || doctor.specialization === specialty;
            
            // Experience filter
            let experienceMatch = true;
            if (experience) {
                const exp = parseInt(doctor.experience);
                if (experience === '0-5') {
                    experienceMatch = exp >= 0 && exp <= 5;
                } else if (experience === '5-10') {
                    experienceMatch = exp > 5 && exp <= 10;
                } else if (experience === '10+') {
                    experienceMatch = exp > 10;
                }
            }
            
            return searchMatch && specialtyMatch && experienceMatch;
        });
        
        renderDoctors(filteredDoctors);
    }
});

// Global functions (accessible from HTML)
function openBookingModal(doctorId, doctorName, specialization) {
    const modal = document.getElementById('bookAppointmentModal');
    const doctorIdField = document.getElementById('doctorId');
    const doctorNameField = document.getElementById('doctorName');
    const doctorSpecField = document.getElementById('doctorSpecialization');
    
    // Set minimum date to today
    const dateField = document.getElementById('appointmentDate');
    if (dateField) {
        const today = new Date().toISOString().split('T')[0];
        dateField.min = today;
    }
    
    if (modal && doctorIdField && doctorNameField && doctorSpecField) {
        doctorIdField.value = doctorId;
        doctorNameField.value = doctorName;
        doctorSpecField.value = specialization;
        
        // Update modal title
        const modalTitle = modal.querySelector('.modal-title');
        if (modalTitle) {
            modalTitle.textContent = `Book Appointment with ${doctorName}`;
        }
        
        // Show modal
        modal.classList.add('active');
        
        // Add form submit handler
        const bookingForm = document.getElementById('bookAppointmentForm');
        if (bookingForm) {
            // Remove any existing event listener
            const newBookingForm = bookingForm.cloneNode(true);
            bookingForm.parentNode.replaceChild(newBookingForm, bookingForm);
            
            // Add new event listener
            newBookingForm.addEventListener('submit', function(e) {
                e.preventDefault();
                bookAppointment();
            });
        }
        
        // Add close handlers
        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = modal.querySelector('.modal-cancel');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', closeModal);
        }
    }
}

function closeModal() {
    const modal = document.getElementById('bookAppointmentModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function bookAppointment() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        alert('You must be logged in to book an appointment');
        return;
    }
    
    const doctorId = document.getElementById('doctorId').value;
    const appointmentDate = document.getElementById('appointmentDate').value;
    const appointmentTime = document.getElementById('appointmentTime').value;
    const appointmentType = document.getElementById('appointmentType').value;
    const appointmentReason = document.getElementById('appointmentReason').value;
    
    // Validation
    if (!appointmentDate || !appointmentTime) {
        alert('Please select both date and time for the appointment');
        return;
    }
    
    // Get doctor info
    const doctors = JSON.parse(localStorage.getItem('doctors')) || [];
    const doctor = doctors.find(d => d.id === doctorId);
    
    if (!doctor) {
        alert('Doctor not found');
        return;
    }
    
    // Create appointment object
    const appointment = {
        id: generateAppointmentId(),
        patientId: currentUser.id,
        patientName: currentUser.name,
        patientEmail: currentUser.email,
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialization: doctor.specialization,
        date: appointmentDate,
        time: appointmentTime,
        type: appointmentType,
        reason: appointmentReason,
        status: 'Upcoming',
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
    
    // Close modal
    closeModal();
    
    // Show success message
    alert('Appointment booked successfully!');
    
    // Redirect to appointments page if video call
    if (appointmentType === 'video-call') {
        if (confirm('Your video appointment has been scheduled. Would you like to view all your upcoming video calls?')) {
            window.location.href = 'video-call.html';
        }
    }
}

function generateAppointmentId() {
    return 'appt_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
}