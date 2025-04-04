document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const steps = document.querySelectorAll('.step');
    const stepContents = document.querySelectorAll('.step-content');
    const prevBtn = document.querySelector('.btn-prev');
    const nextBtn = document.querySelector('.btn-next');
    const submitBtn = document.querySelector('.btn-submit');
    const progressBar = document.querySelector('.progress-bar');
    const notification = document.querySelector('.notification');
    const serviceCards = document.querySelectorAll('.service-card');
    const calendarGrid = document.querySelector('.calendar-grid');
    const timeSlotsGrid = document.querySelector('.time-slots-grid');
    const monthYear = document.querySelector('.month-year');
    const prevMonthBtn = document.querySelector('.prev-month');
    const nextMonthBtn = document.querySelector('.next-month');
    
    // State
    let currentStep = 1;
    let selectedService = null;
    let selectedDate = null;
    let selectedTime = null;
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    
    // Initialize
    updateStepVisibility();
    generateCalendar(currentMonth, currentYear);
    generateTimeSlots();
    
    // Event Listeners
    prevBtn.addEventListener('click', goToPreviousStep);
    nextBtn.addEventListener('click', goToNextStep);
    submitBtn.addEventListener('click', submitAppointment);
    
    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateCalendar(currentMonth, currentYear);
    });
    
    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar(currentMonth, currentYear);
    });
    
    // Service Card Selection
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            serviceCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            this.style.animation = 'none';
            void this.offsetWidth;
            this.style.animation = 'pulseSelect 0.5s ease';
            selectedService = this.getAttribute('data-service');
        });
    });
    
    // Functions
    function goToNextStep() {
        if (validateCurrentStep()) {
            if (currentStep < 4) {
                currentStep++;
                updateStepVisibility();
                animateStepTransition('next');
            }
        }
    }
    
    function goToPreviousStep() {
        if (currentStep > 1) {
            currentStep--;
            updateStepVisibility();
            animateStepTransition('prev');
        }
    }
    
    function updateStepVisibility() {
        steps.forEach(step => {
            const stepNumber = parseInt(step.getAttribute('data-step'));
            if (stepNumber === currentStep) {
                step.classList.add('active');
                const stepNumberEl = step.querySelector('.step-number');
                stepNumberEl.style.animation = 'none';
                void stepNumberEl.offsetWidth;
                stepNumberEl.style.animation = 'bounce 0.5s ease';
            } else if (stepNumber < currentStep) {
                step.classList.remove('active');
                step.classList.add('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
        
        const progressPercentage = ((currentStep - 1) / 3) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        
        stepContents.forEach(content => {
            const contentStep = parseInt(content.getAttribute('data-step-content'));
            if (contentStep === currentStep) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
        
        prevBtn.disabled = currentStep === 1;
        
        if (currentStep === 4) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'flex';
            updateConfirmationDetails();
        } else {
            nextBtn.style.display = 'flex';
            submitBtn.style.display = 'none';
        }
        
        if (currentStep === 2) {
            animateCalendarAppearance();
        } else if (currentStep === 4) {
            animateConfirmation();
        }
    }
    
    function animateStepTransition(direction) {
        const currentContent = document.querySelector(`.step-content[data-step-content="${currentStep}"]`);
        const prevContent = document.querySelector(`.step-content[data-step-content="${direction === 'next' ? currentStep - 1 : currentStep + 1}"]`);
        
        currentContent.style.opacity = '0';
        if (direction === 'next') {
            currentContent.style.transform = 'translateX(30px)';
            prevContent.style.transform = 'translateX(-30px)';
        } else {
            currentContent.style.transform = 'translateX(-30px)';
            prevContent.style.transform = 'translateX(30px)';
        }
        
        setTimeout(() => {
            currentContent.style.transition = 'all 0.4s ease';
            prevContent.style.transition = 'all 0.4s ease';
            
            currentContent.style.opacity = '1';
            currentContent.style.transform = 'translateX(0)';
            prevContent.style.opacity = '0';
            
            setTimeout(() => {
                currentContent.style.transition = '';
                prevContent.style.transition = '';
                prevContent.style.transform = '';
                prevContent.style.opacity = '';
            }, 400);
        }, 10);
    }
    
    function validateCurrentStep() {
        if (currentStep === 1) {
            if (!selectedService) {
                showNotification('Please select a consultation type');
                return false;
            }
        } else if (currentStep === 2) {
            if (!selectedDate) {
                showNotification('Please select a date');
                return false;
            }
            if (!selectedTime) {
                showNotification('Please select a time slot');
                return false;
            }
        } else if (currentStep === 3) {
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            
            if (!name) {
                showNotification('Please enter your name');
                return false;
            }
            
            if (!email) {
                showNotification('Please enter your email');
                return false;
            } else if (!validateEmail(email)) {
                showNotification('Please enter a valid email');
                return false;
            }
            
            if (!phone) {
                showNotification('Please enter your phone number');
                return false;
            }
        }
        
        return true;
    }
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function showNotification(message) {
        notification.textContent = message;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
        
        notification.style.animation = 'none';
        void notification.offsetWidth;
        notification.style.animation = 'shake 0.5s ease';
    }
    
    function generateCalendar(month, year) {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        monthYear.textContent = `${monthNames[month]} ${year}`;
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        const isCurrentMonth = month === today.getMonth() && year === today.getFullYear();
        
        calendarGrid.innerHTML = '';
        
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayNames.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'day-header';
            dayElement.textContent = day;
            calendarGrid.appendChild(dayElement);
        });
        
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyCell);
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            
            if (isCurrentMonth && day === today.getDate()) {
                dayElement.classList.add('today');
            }
            
            // Check if date is more than 4 months in the future
            const fourMonthsFromNow = new Date();
            fourMonthsFromNow.setMonth(fourMonthsFromNow.getMonth() + 4);
            const currentDate = new Date(year, month, day);
            
            if (currentDate < today) {
                dayElement.classList.add('disabled');
            } else {
                dayElement.addEventListener('click', function() {
                    document.querySelectorAll('.calendar-day').forEach(day => {
                        day.classList.remove('selected');
                    });
                    
                    this.classList.add('selected');
                    selectedDate = new Date(year, month, day);
                    generateTimeSlots();
                    
                    this.style.animation = 'none';
                    void this.offsetWidth;
                    this.style.animation = 'daySelect 0.3s ease';
                });
            }
            
            calendarGrid.appendChild(dayElement);
        }
        
        animateCalendarAppearance();
    }
    
    function animateCalendarAppearance() {
        const days = document.querySelectorAll('.calendar-day:not(.empty)');
        days.forEach((day, index) => {
            day.style.opacity = '0';
            day.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                day.style.transition = `all 0.3s ease ${index * 0.05}s`;
                day.style.opacity = '1';
                day.style.transform = 'translateY(0)';
                
                setTimeout(() => {
                    day.style.transition = '';
                }, 500);
            }, 10);
        });
    }
    
    function generateTimeSlots() {
        timeSlotsGrid.innerHTML = '';
        if (!selectedDate) return;
        
        const startHour = 8;
        const endHour = 20;
        const slots = [];
        
        // Calculate date 4 months from now
        const fourMonthsFromNow = new Date();
        fourMonthsFromNow.setMonth(fourMonthsFromNow.getMonth() + 4);
        
        for (let hour = startHour; hour < endHour; hour++) {
            slots.push({
                time: `${hour}:00`,
                // Only mark as booked if date is within 4 months
                booked: selectedDate <= fourMonthsFromNow && Math.random() < 0.3
            });
            
            if (hour < endHour - 1) {
                slots.push({
                    time: `${hour}:30`,
                    // Only mark as booked if date is within 4 months
                    booked: selectedDate <= fourMonthsFromNow && Math.random() < 0.3
                });
            }
        }
        
        slots.forEach(slot => {
            const slotElement = document.createElement('div');
            slotElement.className = 'time-slot';
            slotElement.textContent = formatTime(slot.time);
            
            if (slot.booked) {
                slotElement.classList.add('booked');
            } else {
                slotElement.addEventListener('click', function() {
                    document.querySelectorAll('.time-slot').forEach(s => {
                        s.classList.remove('selected');
                    });
                    
                    this.classList.add('selected');
                    selectedTime = slot.time;
                    
                    this.style.animation = 'none';
                    void this.offsetWidth;
                    this.style.animation = 'slotSelect 0.3s ease';
                });
            }
            
            timeSlotsGrid.appendChild(slotElement);
        });
        
        const timeSlots = document.querySelectorAll('.time-slot');
        timeSlots.forEach((slot, index) => {
            slot.style.opacity = '0';
            slot.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                slot.style.transition = `all 0.3s ease ${index * 0.03}s`;
                slot.style.opacity = '1';
                slot.style.transform = 'scale(1)';
                
                setTimeout(() => {
                    slot.style.transition = '';
                }, 500);
            }, 10);
        });
    }
    
    function formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${period}`;
    }
    
    function updateConfirmationDetails() {
        if (selectedService) {
            const serviceMap = {
                'general': 'General Health Consultation',
                'mental': 'Mental Wellness Session',
                'nutrition': 'Nutrition Planning',
                'fitness': 'Fitness Coaching'
            };
            document.getElementById('confirm-service').textContent = serviceMap[selectedService];
        }
        
        if (selectedDate) {
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            document.getElementById('confirm-date').textContent = selectedDate.toLocaleDateString('en-US', options);
        }
        
        if (selectedTime) {
            document.getElementById('confirm-time').textContent = formatTime(selectedTime);
        }
        
        document.getElementById('confirm-name').textContent = document.getElementById('name').value;
        document.getElementById('confirm-email').textContent = document.getElementById('email').value;
    }
    
    function animateConfirmation() {
        const aiIcon = document.querySelector('.ai-icon');
        const eyes = document.querySelectorAll('.ai-eye');
        const mouth = document.querySelector('.ai-mouth');
        
        aiIcon.style.animation = 'none';
        eyes.forEach(eye => eye.style.animation = 'none');
        mouth.style.animation = 'none';
        void aiIcon.offsetWidth;
        
        aiIcon.style.animation = 'float 3s ease-in-out infinite';
        eyes.forEach(eye => {
            eye.style.animation = 'blink 4s infinite';
        });
        mouth.style.animation = 'talk 0.5s infinite alternate';
    }
    
    function submitAppointment() {
        const appointmentData = {
            service: selectedService,
            date: selectedDate,
            time: selectedTime,
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            concerns: document.getElementById('concerns').value
        };
        
        console.log('Appointment submitted:', appointmentData);
        showNotification('Appointment booked successfully!');
        
        setTimeout(() => {
            selectedService = null;
            selectedDate = null;
            selectedTime = null;
            
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('phone').value = '';
            document.getElementById('concerns').value = '';
            
            document.querySelectorAll('.service-card').forEach(card => {
                card.classList.remove('selected');
            });
            
            document.querySelectorAll('.calendar-day').forEach(day => {
                day.classList.remove('selected');
            });
            
            document.querySelectorAll('.time-slot').forEach(slot => {
                slot.classList.remove('selected');
            });
            
            currentStep = 1;
            updateStepVisibility();
        }, 2000);
    }
});