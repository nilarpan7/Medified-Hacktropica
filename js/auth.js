// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Auth Tabs
    const loginTab = document.querySelector('[data-tab="login"]');
    const registerTab = document.querySelector('[data-tab="register"]');
    const loginForm = document.getElementById('login');
    const registerForm = document.getElementById('register');
    
    // Register Form
    const registerFormEl = document.getElementById('registerForm');
    const doctorFields = document.getElementById('doctorFields');
    const doctorRadio = document.getElementById('doctorType');
    const patientRadio = document.getElementById('patientType');
    const experienceField = document.getElementById('experience');
    const licenseField = document.getElementById('license');
    
    // Login Form
    const loginFormEl = document.getElementById('loginForm');

    // Tab Switching
    if (loginTab && registerTab) {
        loginTab.addEventListener('click', () => {
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
        });

        registerTab.addEventListener('click', () => {
            registerTab.classList.add('active');
            loginTab.classList.remove('active');
            registerForm.classList.add('active');
            loginForm.classList.remove('active');
        });
    }
    
    // Toggle Doctor Fields
    if (doctorRadio && patientRadio && doctorFields) {
        doctorRadio.addEventListener('change', () => {
            doctorFields.style.display = 'block';
            console.log('Doctor selected, showing doctor fields');
        });

        patientRadio.addEventListener('change', () => {
            doctorFields.style.display = 'none';
            console.log('Patient selected, hiding doctor fields');
        });
        
        // Enhanced UI for user type selection
        const userTypeOptions = document.querySelectorAll('.user-type-option');
        if (userTypeOptions.length > 0) {
            userTypeOptions.forEach(option => {
                option.addEventListener('click', function() {
                    const radio = this.querySelector('input[type="radio"]');
                    radio.checked = true;
                    
                    // Trigger the change event manually
                    const event = new Event('change');
                    radio.dispatchEvent(event);
                    
                    // Add visual selection
                    userTypeOptions.forEach(opt => opt.classList.remove('selected'));
                    this.classList.add('selected');
                });
            });
        }
        
        // Initialize with default selection (patient)
        if (patientRadio.checked) {
            doctorFields.style.display = 'none';
        }
    }
    
    // Register Form Submission
    if (registerFormEl) {
        registerFormEl.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const userType = document.querySelector('input[name="userType"]:checked').value;
            
            // Validation
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            // Create user object
            const user = {
                id: generateUserId(),
                name,
                email,
                password, // In a real app, you would hash this password
                userType
            };
            
            // Add doctor-specific fields if doctor
            if (userType === 'doctor') {
                const experience = document.getElementById('experience').value;
                const license = document.getElementById('license').value;
                
                if (!license) {
                    alert('Please enter your license number');
                    return;
                }
                
                user.experience = experience || 0;
                user.license = license;
                user.appointments = [];
                user.patients = [];
                
                // Get specialization if available in the form, otherwise use default
                const specializationField = document.getElementById('specialization');
                user.specialization = (specializationField && specializationField.value) ? 
                    specializationField.value : "General Physician";
                    
                // Ensure doctor has an avatar color for consistency
                user.avatarColor = getRandomColor();
            } else if (userType === 'patient') {
                user.appointments = [];
            }
            
            // Save user to localStorage
            saveUser(user);
            
            alert('Registration successful! Please login.');
            
            // Reset form and switch to login tab
            registerFormEl.reset();
            loginTab.click();
        });
    }
    
    // Login Form Submission
    if (loginFormEl) {
        loginFormEl.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const userType = document.querySelector('input[name="loginUserType"]:checked').value;
            
            const user = authenticateUser(email, password, userType);
            
            if (user) {
                // Set logged in user in localStorage
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                // Redirect to appropriate dashboard
                if (user.userType === 'patient') {
                    window.location.href = 'patient-dashboard.html';
                } else if (user.userType === 'doctor') {
                    window.location.href = 'doctor-dashboard.html';
                }
            } else {
                alert('Invalid email, password, or user type!');
            }
        });
    }
});

// Helper Functions
function generateUserId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function saveUser(user) {
    // Get existing users or create empty array
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if email already exists
    const existingUser = users.find(u => u.email === user.email);
    
    if (existingUser) {
        alert('Email already registered!');
        return false;
    }
    
    // Add new user
    users.push(user);
    
    // Save back to localStorage
    localStorage.setItem('users', JSON.stringify(users));
    
    // For doctors, add to doctors list
    if (user.userType === 'doctor') {
        let doctors = JSON.parse(localStorage.getItem('doctors')) || [];
        doctors.push(user);
        localStorage.setItem('doctors', JSON.stringify(doctors));
    }
    
    return true;
}

function authenticateUser(email, password, userType) {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Find user with matching email, password and userType
    const user = users.find(u => u.email === email && u.password === password && u.userType === userType);
    
    return user || null;
}

// Initialize test data if none exists
function initializeTestData() {
    // Check if users exist
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users.length === 0) {
        // Create test doctors
        const doctors = [
            {
                id: 'doc1',
                name: 'Dr. John Smith',
                email: 'john@example.com',
                password: 'password',
                userType: 'doctor',
                specialization: 'Cardiologist',
                experience: 10,
                appointments: []
            },
            {
                id: 'doc2',
                name: 'Dr. Sarah Johnson',
                email: 'sarah@example.com',
                password: 'password',
                userType: 'doctor',
                specialization: 'Dermatologist',
                experience: 8,
                appointments: []
            },
            {
                id: 'doc3',
                name: 'Dr. Michael Chen',
                email: 'michael@example.com',
                password: 'password',
                userType: 'doctor',
                specialization: 'Pediatrician',
                experience: 15,
                appointments: []
            }
        ];
        
        // Create test patient
        const patients = [
            {
                id: 'pat1',
                name: 'Alice Cooper',
                email: 'alice@example.com',
                password: 'password',
                userType: 'patient',
                appointments: []
            }
        ];
        
        // Combine and save
        const allUsers = [...doctors, ...patients];
        localStorage.setItem('users', JSON.stringify(allUsers));
        localStorage.setItem('doctors', JSON.stringify(doctors));
    }
}

// Call to initialize test data
initializeTestData();

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}