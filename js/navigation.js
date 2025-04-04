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
    
    // Initialize theme functionality
    initializeTheme();
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('show');
        });
    }
    
    // Close sidebar when clicking outside of it (mobile only)
    document.addEventListener('click', function(event) {
        if (sidebar && !sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
            if (window.innerWidth < 992 && sidebar.classList.contains('show')) {
                sidebar.classList.remove('show');
            }
        }
    });
});

// Initialize theme functionality
function initializeTheme() {
    // Check if theme preference is stored in localStorage
    const storedTheme = localStorage.getItem('theme');
    
    if (storedTheme) {
        // Apply stored theme preference
        document.documentElement.setAttribute('data-theme', storedTheme);
    } else {
        // Check if user prefers dark mode via system settings
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (prefersDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    }
    
    // Setup the toggle button
    setupThemeToggle();
}

// Toggle between light and dark themes
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Apply new theme
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Save preference to localStorage
    localStorage.setItem('theme', newTheme);
    
    // Add transition effect
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    // Provide visual feedback
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.classList.add('active');
        setTimeout(() => {
            themeToggle.classList.remove('active');
        }, 300);
    }
    
    console.log('Theme changed to:', newTheme);
}

// Setup theme toggle button
function setupThemeToggle() {
    // Create toggle button if it doesn't exist or move it to the correct position
    createToggleButtonIfNeeded();
    
    // Add event listener to existing button
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        
        // Set initial icon based on current theme
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            themeToggle.title = "Switch to Light Mode";
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            themeToggle.title = "Switch to Dark Mode";
        }
    }
}

// Create theme toggle button if it doesn't exist or move it to the correct position
function createToggleButtonIfNeeded() {
    // Remove any existing toggle buttons first to ensure consistency
    const existingToggle = document.getElementById('themeToggle');
    if (existingToggle) {
        existingToggle.remove();
    }
    
    // Find the top bar actions and notification button
    const topBarActions = document.querySelector('.top-bar-actions');
    const notificationBtn = document.querySelector('.notification-btn');
    
    if (topBarActions && notificationBtn) {
        // Create the toggle button with appropriate styling and icons
        const themeToggle = document.createElement('div');
        themeToggle.id = 'themeToggle';
        themeToggle.className = 'theme-toggle';
        themeToggle.title = "Toggle Dark/Light Mode";
        
        // Determine which icon to show based on current theme
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
        
        // Insert after notification button
        notificationBtn.after(themeToggle);
        console.log('Theme toggle button created in standard position');
    } else {
        console.error('Could not find top-bar-actions or notification-btn to add theme toggle');
    }
}

// Call initialization on page load
document.addEventListener('DOMContentLoaded', function() {
    // Add listener for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        if (!localStorage.getItem('theme')) {
            // Only apply system preference if user hasn't set a preference
            const newTheme = event.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
        }
    });
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