// DOM Elements and Initialization
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        // Redirect to login if not logged in
        window.location.href = 'index.html';
        return;
    }
    
    // Determine which profile page we're on
    const isPatientProfile = window.location.pathname.includes('profile.html');
    const isDoctorProfile = window.location.pathname.includes('profile.html');
    
    // Common DOM elements
    const userNameElements = document.querySelectorAll('.user-name');
    const userEmailElement = document.querySelector('.user-email');
    const userInitialsElements = document.querySelectorAll('.user-initials');
    const userTypeDisplay = document.querySelector('.user-type-display');
    const profileTabs = document.querySelectorAll('.profile-tab');
    const profileContentTabs = document.querySelectorAll('.profile-content-tab');
    
    // Forms
    const changePasswordForm = document.getElementById('changePasswordForm');
    
    // Initialize page based on profile type
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
    
    // Patient-specific form
    const patientInfoForm = document.getElementById('patientInfoForm');
    if (patientInfoForm) {
        patientInfoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            savePatientInfo();
        });
    }
    
    // Doctor-specific form
    const doctorInfoForm = document.getElementById('doctorInfoForm');
    if (doctorInfoForm) {
        doctorInfoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveDoctorInfo();
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
        
        // Populate form fields
        if (isPatientProfile) {
            populatePatientProfileForm();
        } else if (isDoctorProfile) {
            populateDoctorProfileForm();
        }
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
        
        // Add active class to selected tab
        const selectedTab = document.querySelector(`.profile-tab[data-tab="${tabName}"]`);
        if (selectedTab) selectedTab.classList.add('active');
        
        // Hide all content tabs
        profileContentTabs.forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Show selected content tab
        const selectedContent = document.getElementById(`${tabName}-tab`);
        if (selectedContent) selectedContent.classList.add('active');
    }
    
    // Patient-specific functions
    function populatePatientProfileForm() {
        if (!isPatientProfile) return;
        
        // Populate personal information
        document.getElementById('patientProfileName').value = currentUser.name || '';
        document.getElementById('patientProfileEmail').value = currentUser.email || '';
        document.getElementById('patientProfilePhone').value = currentUser.phone || '';
        document.getElementById('patientProfileDob').value = currentUser.dob || '';
        document.getElementById('patientProfileGender').value = currentUser.gender || '';
        document.getElementById('patientProfileAddress').value = currentUser.address || '';
        
        // Populate patient-specific fields
        if (currentUser.emergencyContact) {
            document.getElementById('patientProfileEmergencyContact').value = currentUser.emergencyContact.name || '';
            document.getElementById('patientProfileEmergencyPhone').value = currentUser.emergencyContact.phone || '';
        }
        
        document.getElementById('patientProfileBloodType').value = currentUser.bloodType || '';
        
        // Medical history
        if (document.getElementById('allergies') && currentUser.medicalHistory) {
            document.getElementById('allergies').value = currentUser.medicalHistory.allergies || '';
            document.getElementById('medications').value = currentUser.medicalHistory.medications || '';
            document.getElementById('conditions').value = currentUser.medicalHistory.conditions || '';
            document.getElementById('surgeries').value = currentUser.medicalHistory.surgeries || '';
            document.getElementById('familyHistory').value = currentUser.medicalHistory.familyHistory || '';
            document.getElementById('vaccinations').value = currentUser.medicalHistory.vaccinations || '';
        }
        
        // Notification settings
        if (currentUser.notifications) {
            document.getElementById('emailNotifications').checked = currentUser.notifications.email !== false;
            document.getElementById('smsNotifications').checked = currentUser.notifications.sms === true;
            document.getElementById('appointmentReminders').checked = currentUser.notifications.appointmentReminders !== false;
            
            if (document.getElementById('medicationReminders')) {
                document.getElementById('medicationReminders').checked = currentUser.notifications.medicationReminders !== false;
            }
        }
    }
    
    function savePatientInfo() {
        if (!isPatientProfile) return;
        
        // Update user object
        currentUser.name = document.getElementById('patientProfileName').value;
        currentUser.email = document.getElementById('patientProfileEmail').value;
        currentUser.phone = document.getElementById('patientProfilePhone').value;
        currentUser.dob = document.getElementById('patientProfileDob').value;
        currentUser.gender = document.getElementById('patientProfileGender').value;
        currentUser.address = document.getElementById('patientProfileAddress').value;
        
        // Update emergency contact
        currentUser.emergencyContact = {
            name: document.getElementById('patientProfileEmergencyContact').value,
            phone: document.getElementById('patientProfileEmergencyPhone').value
        };
        
        currentUser.bloodType = document.getElementById('patientProfileBloodType').value;
        
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update user in users array
        updateUserInArray();
        
        // Show success message
        alert('Profile information updated successfully!');
    }
    
    // Doctor-specific functions
    function populateDoctorProfileForm() {
        if (!isDoctorProfile) return;
        
        // Populate personal information
        document.getElementById('doctorProfileName').value = currentUser.name || '';
        document.getElementById('doctorProfileEmail').value = currentUser.email || '';
        document.getElementById('doctorProfilePhone').value = currentUser.phone || '';
        document.getElementById('doctorProfileDob').value = currentUser.dob || '';
        document.getElementById('doctorProfileGender').value = currentUser.gender || '';
        document.getElementById('doctorProfileAddress').value = currentUser.address || '';
        
        // Populate doctor-specific fields
        document.getElementById('doctorProfileSpecialization').value = currentUser.specialization || '';
        document.getElementById('doctorProfileExperience').value = currentUser.experience || '';
        document.getElementById('doctorProfileBio').value = currentUser.bio || '';
        
        // Professional details tab
        if (document.getElementById('doctorSpecialization')) {
            document.getElementById('doctorSpecialization').value = currentUser.specialization || '';
            
            if (currentUser.medicalSpecialties) {
                document.getElementById('specialties').value = currentUser.medicalSpecialties.specialties || '';
                document.getElementById('services').value = currentUser.medicalSpecialties.services || '';
                document.getElementById('certifications').value = currentUser.medicalSpecialties.certifications || '';
            }
            
            if (currentUser.consultationFee) {
                document.getElementById('consultationFee').value = currentUser.consultationFee;
            }
            
            if (currentUser.availableHours) {
                document.getElementById('availableHours').value = currentUser.availableHours;
            }
        }
        
        // Notification settings
        if (currentUser.notifications) {
            document.getElementById('emailNotifications').checked = currentUser.notifications.email !== false;
            document.getElementById('smsNotifications').checked = currentUser.notifications.sms === true;
            document.getElementById('appointmentReminders').checked = currentUser.notifications.appointmentReminders !== false;
        }
    }
    
    function saveDoctorInfo() {
        if (!isDoctorProfile) return;
        
        // Update user object
        currentUser.name = document.getElementById('doctorProfileName').value;
        currentUser.email = document.getElementById('doctorProfileEmail').value;
        currentUser.phone = document.getElementById('doctorProfilePhone').value;
        currentUser.dob = document.getElementById('doctorProfileDob').value;
        currentUser.gender = document.getElementById('doctorProfileGender').value;
        currentUser.address = document.getElementById('doctorProfileAddress').value;
        
        // Update doctor-specific fields
        currentUser.specialization = document.getElementById('doctorProfileSpecialization').value;
        currentUser.experience = document.getElementById('doctorProfileExperience').value;
        currentUser.bio = document.getElementById('doctorProfileBio').value;
        
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update user in users array
        updateUserInArray();
        
        // Show success message
        alert('Profile information updated successfully!');
    }
    
    // Common functions
    function changePassword() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;
        
        // Validate current password (for a real app, would check against backend)
        if (currentPassword !== currentUser.password) {
            alert('Current password is incorrect');
            return;
        }
        
        // Validate new password
        if (newPassword.length < 6) {
            alert('New password must be at least 6 characters');
            return;
        }
        
        // Validate password confirmation
        if (newPassword !== confirmNewPassword) {
            alert('New passwords do not match');
            return;
        }
        
        // Update password
        currentUser.password = newPassword;
        
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update user in users array
        updateUserInArray();
        
        // Clear form
        document.getElementById('changePasswordForm').reset();
        
        // Show success message
        alert('Password changed successfully!');
    }
    
    function updateUserInArray() {
        if (currentUser.userType === 'patient') {
            // Get patients array from localStorage
            const patients = JSON.parse(localStorage.getItem('patients')) || [];
            
            // Find and update current user
            const patientIndex = patients.findIndex(p => p.id === currentUser.id);
            
            if (patientIndex !== -1) {
                patients[patientIndex] = currentUser;
                localStorage.setItem('patients', JSON.stringify(patients));
            }
        } else if (currentUser.userType === 'doctor') {
            // Get doctors array from localStorage
            const doctors = JSON.parse(localStorage.getItem('doctors')) || [];
            
            // Find and update current user
            const doctorIndex = doctors.findIndex(d => d.id === currentUser.id);
            
            if (doctorIndex !== -1) {
                doctors[doctorIndex] = currentUser;
                localStorage.setItem('doctors', JSON.stringify(doctors));
            }
        }
    }
    
    // Add event listeners for medical history form
    if (isPatientProfile && document.getElementById('patientMedicalContent')) {
        document.querySelector('#patientMedicalContent .save-profile-btn').addEventListener('click', saveMedicalHistory);
    }
    
    // Add event listeners for doctor specialties form
    if (isDoctorProfile && document.getElementById('doctorMedicalContent')) {
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
        
        // Add the new patient-specific fields
        if (document.getElementById('familyHistory')) {
            currentUser.medicalHistory.familyHistory = document.getElementById('familyHistory').value;
        }
        
        if (document.getElementById('vaccinations')) {
            currentUser.medicalHistory.vaccinations = document.getElementById('vaccinations').value;
        }
        
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
        
        // Update new doctor-specific fields
        if (document.getElementById('consultationFee')) {
            currentUser.consultationFee = document.getElementById('consultationFee').value;
        }
        
        if (document.getElementById('availableHours')) {
            currentUser.availableHours = document.getElementById('availableHours').value;
        }
        
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update user in users array
        updateUserInArray();
        
        // Show success message
        alert('Professional information updated successfully!');
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
        
        // Check for patient-specific notification settings
        if (isPatientProfile && document.getElementById('medicationReminders')) {
            currentUser.notifications.medicationReminders = document.getElementById('medicationReminders').checked;
        }
        
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update user in users array
        updateUserInArray();
        
        // Show success message
        alert('Notification settings updated successfully!');
    }
});