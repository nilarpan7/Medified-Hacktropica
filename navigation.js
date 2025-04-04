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
                window.location.href = 'dashboard.html';
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
                window.location.href = 'profile.html';
            } else if (currentUser.userType === 'doctor') {
                window.location.href = 'profile.html';
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
