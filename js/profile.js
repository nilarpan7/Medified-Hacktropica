// DOM Elements and Initialization
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        // Redirect to login if not logged in
        window.location.href = 'index.html';
        return;
    }
    
    // DOM elements
    const userNameElements = document.querySelectorAll('.user-name');
    const userEmailElement = document.querySelector('.user-email');
    const userInitialsElements = document.querySelectorAll('.user-initials');
    const userTypeDisplay = document.querySelector('.user-type-display');
    const profileTabs = document.querySelectorAll('.profile-tab');
    const profileContentTabs = document.querySelectorAll('.profile-content-tab');
    const doctorProfileFields = document.getElementById('doctorProfileFields');
    const patientMedicalContent = document.getElementById('patientMedicalContent');
    const doctorMedicalContent = document.getElementById('doctorMedicalContent');
    
    // Forms
    const personalInfoForm = document.getElementById('personalInfoForm');
    const changePasswordForm = document.getElementById('changePasswordForm');
    
    // Initialize page
    initializePage();
    
    // Event Listeners
    if (profileTabs.length > 0) {
        profileTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabName = this.getAttribute('data-tab');
                switchTab(tabName);
            });
        });
    }
    
    if (personalInfoForm) {
        personalInfoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            savePersonalInfo();
        });
    }
    
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            changePassword();
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
        
        if (userEmailElement) {
            userEmailElement.textContent = currentUser.email;
        }
        
        if (userInitialsElements) {
            userInitialsElements.forEach(element => {
                element.textContent = getInitials(currentUser.name);
            });
        }
        
        if (userTypeDisplay) {
            userTypeDisplay.textContent = currentUser.userType === 'patient' ? 'Patient' : 'Doctor';
        }
        
        // Show/hide fields based on user type
        if (currentUser.userType === 'doctor') {
            if (doctorProfileFields) doctorProfileFields.style.display = 'block';
            if (patientMedicalContent) patientMedicalContent.style.display = 'none';
            if (doctorMedicalContent) doctorMedicalContent.style.display = 'block';
            
            // Fill doctor-specific fields
            document.getElementById('profileSpecialization').value = currentUser.specialization || '';
            document.getElementById('profileExperience').value = currentUser.experience || '';
            document.getElementById('profileBio').value = currentUser.bio || '';
            
            // Hide patient-specific menu item
            const doctorsLink = document.getElementById('doctors-link');
            if (doctorsLink) doctorsLink.style.display = 'none';
        }
        
        // Populate form fields
        populateProfileForm();
    }
    
    function getInitials(name) {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase();
    }
    
    function switchTab(tabName) {
        // Remove active class from all tabs
        profileTabs.forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Add active class to clicked tab
        const activeTab = document.querySelector(`.profile-tab[data-tab="${tabName}"]`);
        if (activeTab) activeTab.classList.add('active');
        
        // Hide all content tabs
        profileContentTabs.forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Show selected content tab
        const activeContent = document.getElementById(`${tabName}-tab`);
        if (activeContent) activeContent.classList.add('active');
    }
    
    function populateProfileForm() {
        // Populate common fields
        if (document.getElementById('fullName')) {
            document.getElementById('fullName').value = currentUser.name || '';
        }
        
        if (document.getElementById('email')) {
            document.getElementById('email').value = currentUser.email || '';
        }
        
        if (document.getElementById('phone')) {
            document.getElementById('phone').value = currentUser.phone || '';
        }
        
        if (document.getElementById('address')) {
            document.getElementById('address').value = currentUser.address || '';
        }
        
        if (document.getElementById('dob')) {
            document.getElementById('dob').value = currentUser.dob || '';
        }
        
        // Show appropriate fields for user type
        if (currentUser.userType === 'doctor') {
            if (doctorProfileFields) {
                doctorProfileFields.style.display = 'block';
            }
            
            if (patientMedicalContent) {
                patientMedicalContent.style.display = 'none';
            }
            
            if (doctorMedicalContent) {
                doctorMedicalContent.style.display = 'block';
            }
            
            // Populate doctor-specific fields
            if (document.getElementById('experience')) {
                document.getElementById('experience').value = currentUser.experience || '';
            }
            
            if (document.getElementById('license')) {
                document.getElementById('license').value = currentUser.license || '';
            }
            
            // Populate doctor specialization dropdown
            if (document.getElementById('doctorSpecialization')) {
                const specializationDropdown = document.getElementById('doctorSpecialization');
                const currentSpecialization = currentUser.specialization || 'General Physician';
                
                // Find and select the matching option
                for (let i = 0; i < specializationDropdown.options.length; i++) {
                    if (specializationDropdown.options[i].value === currentSpecialization) {
                        specializationDropdown.selectedIndex = i;
                        break;
                    }
                }
            }
        }
        
        // Populate medical history (if patient)
        if (currentUser.userType === 'patient') {
            if (currentUser.medicalHistory) {
                document.getElementById('allergies').value = currentUser.medicalHistory.allergies || '';
                document.getElementById('medications').value = currentUser.medicalHistory.medications || '';
                document.getElementById('conditions').value = currentUser.medicalHistory.conditions || '';
                document.getElementById('surgeries').value = currentUser.medicalHistory.surgeries || '';
            }
        } else if (currentUser.userType === 'doctor') {
            // Populate doctor specialties
            if (currentUser.medicalSpecialties) {
                document.getElementById('specialties').value = currentUser.medicalSpecialties.specialties || '';
                document.getElementById('services').value = currentUser.medicalSpecialties.services || '';
                document.getElementById('certifications').value = currentUser.medicalSpecialties.certifications || '';
            }
        }
        
        // Populate notification settings
        document.getElementById('emailNotifications').checked = currentUser.notifications?.email ?? true;
        document.getElementById('smsNotifications').checked = currentUser.notifications?.sms ?? false;
        document.getElementById('appointmentReminders').checked = currentUser.notifications?.appointmentReminders ?? true;
    }
    
    function savePersonalInfo() {
        // Get form values
        const name = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const dob = document.getElementById('dob').value;
        const gender = document.getElementById('gender').value;
        const address = document.getElementById('address').value;
        
        // Update current user object
        currentUser.name = name;
        currentUser.email = email;
        currentUser.phone = phone;
        currentUser.dob = dob;
        currentUser.gender = gender;
        currentUser.address = address;
        
        // Update doctor-specific fields
        if (currentUser.userType === 'doctor') {
            currentUser.specialization = document.getElementById('profileSpecialization').value;
            currentUser.experience = document.getElementById('profileExperience').value;
            currentUser.bio = document.getElementById('profileBio').value;
        }
        
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update user in users array
        updateUserInArray();
        
        // Show success message
        alert('Profile information updated successfully!');
        
        // Update displayed name
        userNameElements.forEach(element => {
            element.textContent = name;
        });
        
        // Update initials
        const initials = getInitials(name);
        userInitialsElements.forEach(element => {
            element.textContent = initials;
        });
    }
    
    function changePassword() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;
        
        // Validate current password
        if (currentPassword !== currentUser.password) {
            alert('Current password is incorrect.');
            return;
        }
        
        // Validate password match
        if (newPassword !== confirmNewPassword) {
            alert('New passwords do not match.');
            return;
        }
        
        // Update password
        currentUser.password = newPassword;
        
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update user in users array
        updateUserInArray();
        
        // Clear form and show success message
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmNewPassword').value = '';
        
        alert('Password updated successfully!');
    }
    
    function updateUserInArray() {
        // Get users array
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Find and update user
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        // If doctor, also update in doctors array
        if (currentUser.userType === 'doctor') {
            const doctors = JSON.parse(localStorage.getItem('doctors')) || [];
            const doctorIndex = doctors.findIndex(d => d.id === currentUser.id);
            
            if (doctorIndex !== -1) {
                doctors[doctorIndex] = currentUser;
                localStorage.setItem('doctors', JSON.stringify(doctors));
            }
        }
    }
    
    // Add event listeners for medical history form
    if (document.getElementById('patientMedicalContent')) {
        document.querySelector('#patientMedicalContent .save-profile-btn').addEventListener('click', saveMedicalHistory);
    }
    
    // Add event listeners for doctor specialties form
    if (document.getElementById('doctorMedicalContent')) {
        document.querySelector('#doctorMedicalContent .save-profile-btn').addEventListener('click', saveDoctorSpecialties);
    }
    
    // Add event listeners for notification settings
    if (document.querySelector('#security-tab .save-profile-btn')) {
        document.querySelector('#security-tab .save-profile-btn').addEventListener('click', saveNotificationSettings);
    }
    
    function saveMedicalHistory() {
        // Create medical history object if it doesn't exist
        if (!currentUser.medicalHistory) {
            currentUser.medicalHistory = {};
        }
        
        // Update medical history object
        currentUser.medicalHistory.allergies = document.getElementById('allergies').value;
        currentUser.medicalHistory.medications = document.getElementById('medications').value;
        currentUser.medicalHistory.conditions = document.getElementById('conditions').value;
        currentUser.medicalHistory.surgeries = document.getElementById('surgeries').value;
        
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update user in users array
        updateUserInArray();
        
        // Show success message
        alert('Medical history updated successfully!');
    }
    
    function saveDoctorSpecialties() {
        // Get primary specialization value
        const primarySpecialization = document.getElementById('doctorSpecialization').value;
        
        // Update user's primary specialization
        currentUser.specialization = primarySpecialization || 'General Physician';
        
        // Create specialties object if it doesn't exist
        if (!currentUser.medicalSpecialties) {
            currentUser.medicalSpecialties = {};
        }
        
        // Update specialties object
        currentUser.medicalSpecialties.specialties = document.getElementById('specialties').value;
        currentUser.medicalSpecialties.services = document.getElementById('services').value;
        currentUser.medicalSpecialties.certifications = document.getElementById('certifications').value;
        
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update user in users array
        updateUserInArray();
        
        // Show success message
        alert('Specialty information updated successfully!');
    }
    
    function saveNotificationSettings() {
        // Create notifications object if it doesn't exist
        if (!currentUser.notifications) {
            currentUser.notifications = {};
        }
        
        // Update notifications object
        currentUser.notifications.email = document.getElementById('emailNotifications').checked;
        currentUser.notifications.sms = document.getElementById('smsNotifications').checked;
        currentUser.notifications.appointmentReminders = document.getElementById('appointmentReminders').checked;
        
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update user in users array
        updateUserInArray();
        
        // Show success message
        alert('Notification settings updated successfully!');
    }
});