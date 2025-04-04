// Navigation helper for dashboard pages
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        // Redirect to login if not logged in
        window.location.href = 'index.html';
        return;
    }
    
    // Get navigation elements
    const dashboardLink = document.getElementById('dashboard-link');
    const appointmentsLink = document.getElementById('appointments-link');
    const doctorsLink = document.getElementById('doctors-link');
    const patientsLink = document.getElementById('patients-link');
    const videoCallLink = document.getElementById('video-call-link');
    const profileLink = document.getElementById('profile-link');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Set up navigation based on user type
    if (currentUser.userType === 'patient') {
        // Patient navigation
        if (dashboardLink) {
            dashboardLink.addEventListener('click', function() {
                window.location.href = 'patient-dashboard.html';
            });
        }
        
        if (appointmentsLink) {
            appointmentsLink.addEventListener('click', function() {
                window.location.href = 'patient-dashboard.html#appointments';
            });
        }
        
        if (doctorsLink) {
            doctorsLink.addEventListener('click', function() {
                window.location.href = 'find-doctors.html';
            });
        }
        
        if (videoCallLink) {
            videoCallLink.addEventListener('click', function() {
                window.location.href = 'WEB_UIKITS.html';
            });
        }
    } else if (currentUser.userType === 'doctor') {
        // Doctor navigation
        if (dashboardLink) {
            dashboardLink.addEventListener('click', function() {
                window.location.href = 'doctor-dashboard.html';
            });
        }
        
        if (appointmentsLink) {
            appointmentsLink.addEventListener('click', function() {
                window.location.href = 'doctor-dashboard.html#appointments';
            });
        }
        
        // Doctors can't find other doctors
        if (doctorsLink) {
            doctorsLink.parentElement.removeChild(doctorsLink);
        }
        
        if (patientsLink) {
            patientsLink.addEventListener('click', function() {
                window.location.href = 'doctor-dashboard.html#patients';
            });
        }
        
        if (videoCallLink) {
            videoCallLink.addEventListener('click', function() {
                window.location.href = 'WEB_UIKITS.html';
            });
        }
    }
    
    // Profile link (common for both user types)
    if (profileLink) {
        profileLink.addEventListener('click', function() {
            if (currentUser.userType === 'patient') {
                window.location.href = 'patient-profile.html';
            } else if (currentUser.userType === 'doctor') {
                window.location.href = 'doctor-profile.html';
            }
        });
    }
    
    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }
    
    // Handle notification badge visibility
    updateNotificationBadge();
    
    // Theme Toggle Functionality
    setupThemeToggle();
});

// Function to update notification badges
function updateNotificationBadge() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    const notificationBadges = document.querySelectorAll('.notification-badge');
    
    // Count upcoming appointments for notifications
    const upcomingAppointments = (currentUser.appointments || []).filter(
        a => a.status === 'Upcoming'
    ).length;
    
    notificationBadges.forEach(badge => {
        if (upcomingAppointments > 0) {
            badge.textContent = upcomingAppointments;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    });
}

// Function to set up theme toggle
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    // Load user's theme preference from localStorage or use system preference
    loadThemePreference();
    
    // Add click event to toggle theme
    themeToggle.addEventListener('click', function() {
        toggleTheme();
    });
}

// Function to toggle between light and dark themes
function toggleTheme() {
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
}

// Function to load theme preference from localStorage
function loadThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        // Use saved preference
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
        // Check if user prefers dark mode in their OS settings
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }
}