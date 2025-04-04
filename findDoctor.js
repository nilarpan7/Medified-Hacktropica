let mapInitialized = false;

function initMap() {
    try {
        directionsService = new google.maps.DirectionsService();
        directionsRenderer = new google.maps.DirectionsRenderer();
        
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 12,
            center: {lat: 37.7749, lng: -122.4194} // Default to San Francisco
        });
        
        directionsRenderer.setMap(map);
        mapInitialized = true;
    } catch (error) {
        console.error("Google Maps failed to load:", error);
        alert("Maps functionality is currently unavailable. Please try again later.");
        mapModal.style.display = 'none';
    }
}
document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const symptomsInput = document.getElementById('symptoms');
    const locationInput = document.getElementById('location');
    const specialtySelect = document.getElementById('specialty');
    const currentLocationBtn = document.getElementById('current-location-btn');
    const searchBtn = document.getElementById('search-btn');
    const loadingDiv = document.getElementById('loading');
    const resultsDiv = document.getElementById('results');
    const resultsGrid = document.getElementById('results-grid');
    const noResultsDiv = document.getElementById('no-results');

    // Sample doctor data (in a real app, this would come from an API)
    const sampleDoctors = [
        {
            id: 1,
            name: "Dr. Dhruba Banerjee, MBBS (Cal)",
            specialty: "Family Medicine",
            address: "opposite Loknath Moshla Corner, 18/2/1 and 32, Kayasthapara Main Rd, opposite Loknath Moshla Corner, Kolkata, West Bengal 700078",
            phone: "89102 21936",
            distance: 0.8,
            acceptsNewPatients: true,
            rating: 4.7,
            image: "https://lh3.googleusercontent.com/p/AF1QipNikLUS5dg1fZ2X4XS_8E9Tbs20dn8OMEGEvCsD=s680-w680-h510"
        },
        {
            id: 2,
            name: "Dr. Sanjoy Ghosh",
            specialty: "Family Medicine",
            address: "Block, Office Tower, Sector 1, City Centre, Salt Lake, Apollo Clinic Salt Lake, Kolkata, West Bengal 700064",
            phone: "1860 500 1066",
            distance: 0.8,
            acceptsNewPatients: true,
            rating: 4.7,
            image: "https://lh3.googleusercontent.com/p/AF1QipOTedCtRG-aM-ym64TB6gAQwPu5lhorR-QASEGN=s1360-w1360-h1020"
        },
        {
            id: 3,
            name: "Dr. Sandip Kumar Chandra",
            specialty: "Family Medicine",
            address: "Apollo Multispeciality Hospitals, 58, Canal Circular Rd, Kadapara, Phool Bagan, Kankurgachi, Kolkata, West Bengal 700054",
            phone: "80 4775 7935",
            distance: 0.8,
            acceptsNewPatients: true,
            rating: 4.7,
            image: "https://lh3.googleusercontent.com/p/AF1QipN48o6kJF8SokaLr9XlwfapZfA5p8d_jpFnKCna=s1360-w1360-h1020"
        },
        {
            id: 4,
            name: "Dr. Amitabha Saha",
            specialty: "Internal Medicine",
            address: "SURAKSHA, CENTRAL POLLUTION CONTROL BOARD, 1582, Rajdanga Main Rd, Kasba New Market, Sector E, East Kolkata Twp, Kolkata, West Bengal 700107",
            phone: "98300 43059",
            distance: 1.2,
            acceptsNewPatients: true,
            rating: 4.5,
            image: "https://lh3.googleusercontent.com/gps-cs-s/AB5caB85pmgK0qyqUE3nRwoI-hEWlGbRvinZyYIdiuNPTMJXOoF0xhZlNjKyGxUFOqgJuX5tQv-AeaH5BH1dApVLSZW3v2aLXEdZvp6i_xXdmZRqkLaiSefQM2UsRNLXRWbTKHPJn9RhNg=s1360-w1360-h1020"
        },
        {
            id: 5,
            name: "Dr. Prattay Ghosh",
            specialty: "Internal Medicine",
            address: "H9GQ+R5Q, Apollo Beliaghata, Phool Bagan, Kankurgachi, Kolkata, West Bengal 700054",
            phone: "98300 43059",
            distance: 1.2,
            acceptsNewPatients: true,
            rating: 4.5,
            image: "https://lh3.googleusercontent.com/p/AF1QipORAd4rrGd06gmN8UBpGxFWtcUjrspBESvrCxC_=s1360-w1360-h1020"
        },
        {
            id: 6,
            name: "Dr. Hirak Mazumder",
            specialty: "Internal Medicine",
            address: "Apollo Multispeciality Hospitals Limited, 58, Canal Circular Rd, beside Mani Square Mall, Kadapara, Phool Bagan, Kankurgachi, Kolkata, West Bengal 700054",
            phone: "98300 43059",
            distance: 1.2,
            acceptsNewPatients: true,
            rating: 4.5,
            image: "https://lh5.googleusercontent.com/p/AF1QipN3zp-VxzzfoeUGhRojJPVBQEtqDqhO4GqB11SG=w325-h218-n-k-no"
        },
        {
            id: 7,
            name: "Dr. Anirban Basu",
            specialty: "Pediatrics",
            address: "Desun More, 720, Eastern Metropolitan Bypass, Golpark, Sector I, Kasba, Kolkata, West Bengal 700107",
            phone: "98304 18151",
            distance: 2.5,
            acceptsNewPatients: true,
            rating: 4.9,
            image: "https://lh5.googleusercontent.com/p/AF1QipMwvvUEjXMhaczgiK2obhOCsuVyQMEsCe1dWgt_=w325-h218-n-k-no"
        },
        {
            id: 8,
            name: "Dr Md Rahiul Islam",
            specialty: "Pediatrics",
            address: "8/30, KF Medical Centre, Fern Rd, Ballygunge Gardens, Gariahat, Kolkata, West Bengal 700019",
            phone: "33 6680 0000",
            distance: 2.5,
            acceptsNewPatients: true,
            rating: 4.9,
            image: "https://lh3.googleusercontent.com/p/AF1QipMa-4yNYfCdyaj5qJv9rToD-QvFeL8KE7h_Dqit=s1360-w1360-h1020"
        },
        {
            id: 9,
            name: "Dr. Arijita Chatterjee",
            specialty: "Pediatrics",
            address: "Desun Hospital, 720, Eastern Metropolitan Bypass, Golpark, Sector I, Kasba, Kolkata, West Bengal 700107",
            phone: "33 66xx 0000",
            distance: 2.5,
            acceptsNewPatients: true,
            rating: 4.9,
            image: "https://lh3.googleusercontent.com/p/AF1QipNGJ4WyZ3qM6OelVu2MInyqwzufxfxCgvaWvXZC=s1360-w1360-h1020"
        },
        {
            id: 10,
            name: "Dr. Saheli Dasgupta",
            specialty: "Pediatrics",
            address: "422, Raja Subodh Chandra Mallick Rd, Selimpur, Jodhpur Park, Kolkata, West Bengal 700068",
            phone: "82401 12375",
            distance: 2.5,
            acceptsNewPatients: true,
            rating: 4.9,
            image: "https://lh5.googleusercontent.com/p/AF1QipOHKuDsMLzQHTYkS4uUAf8M7Y4qsy99-KgdRABt=w325-h218-n-k-no"
        },
        {
            id: 11,
            name: "Dr Parijat Deb Choudhury",
            specialty: "Cardiology",
            address: "Medithics Clinic, 1412, near R. N. Tagore Hospital, Mukundapur Market, Nitai Nagar, Mukundapur, Kolkata, West Bengal 700099",
            phone: "33 4058 5544",
            distance: 2.5,
            acceptsNewPatients: true,
            rating: 4.9,
            image: "https://lh5.googleusercontent.com/p/AF1QipNTtD0Y-5UfUsU9DIqfwaksmNRHDlljjpG5wwDi=w325-h218-n-k-no"
        },
        {
            id: 12,
            name: "Dr. Anup Khetan",
            specialty: "Cardiology",
            address: "1489, Eastern Metropolitan Bypass, Mukundapur Market, Stadium Colony, Mukundapur, Kolkata, West Bengal 700099",
            phone: "80675 06860",
            distance: 2.5,
            acceptsNewPatients: true,
            rating: 4.9,
            image: "https://lh5.googleusercontent.com/p/AF1QipMMre6yi-0lmn338bp5UAscOS0_fTZnldwjewQ2=w325-h218-n-k-no"
        },
        {
            id: 13,
            name: "Dr. Supratip Kundu",
            specialty: "Cardiology",
            address: "AMRI Hospital, Department of Cardiology Block-A, Scheme-L11 P-4&5, Gariahat Rd, Dhakuria, Kolkata, West Bengal 700029",
            phone: "86970 11201",
            distance: 2.5,
            acceptsNewPatients: true,
            rating: 4.9,
            image: "https://lh5.googleusercontent.com/p/AF1QipPI3dqI8RNxgh-0xnyEmuGB3l6EX7C6BOPC2UHf=w325-h218-n-k-no"
        },
        {
            id: 14,
            name: "Dr P K Hazra",
            specialty: "Cardiology",
            address: "amri hospital, Gariahat Rd, near dhakuria bridge, Kolkata, West Bengal 700029",
            phone: "98300 70337",
            distance: 3.1,
            acceptsNewPatients: true,
            rating: 4.8,
            image: "https://lh5.googleusercontent.com/p/AF1QipPhEzljLYvO8rB0q7bpj6QsZMTQWWF5cqSXUsXl=w162-h108-n-k-no"
        },
        {
            id: 15,
            name: "Dr Surajit Gorai",
            specialty: "Dermatology",
            address: "Apollo Multispeciality Hospital (formerly Gleneagles, Kadapara, Phool Bagan, Kankurgachi, Kolkata, West Bengal 700054",
            phone: "91238 56730",
            distance: 3.1,
            acceptsNewPatients: true,
            rating: 4.8,
            image: "https://lh5.googleusercontent.com/p/AF1QipMHDFQgm87NaEvHC6DqgLsZ0tRNhCixpxDJBTa5=w162-h108-n-k-no"
        },
        {
            id: 16,
            name: "Dr. Punam De",
            specialty: "Dermatology",
            address: "Skin Vita Clinic, 4th floor Premlata building, 39, Shakespeare Sarani Rd, opp. Kalamandir, Kolkata, West Bengal 700054",
            phone: "98302 02395",
            distance: 3.1,
            acceptsNewPatients: true,
            rating: 4.8,
            image: "https://lh5.googleusercontent.com/p/AF1QipPiMI6TiFf8m0aGLCRuBg79okbU_J-sne5aqHGY=w325-h218-n-k-no"
        },
        {
            id: 17,
            name: "Dr. Lisa Park",
            specialty: "Dermatology",
            address: "202 Skin Care Blvd, Anytown, ST 12345",
            phone: "(555) 567-8901",
            distance: 1.8,
            acceptsNewPatients: true,
            rating: 4.6,
            image: "https://randomuser.me/api/portraits/women/28.jpg"
        },
        {
            id: 18,
            name: "Dr. Robert Thompson",
            specialty: "Neurology",
            address: "303 Brain Center Dr, Anytown, ST 12345",
            phone: "(555) 678-9012",
            distance: 4.2,
            acceptsNewPatients: true,
            rating: 4.7,
            image: "https://randomuser.me/api/portraits/men/82.jpg"
        }
    ];

    // Get current location
    currentLocationBtn.addEventListener('click', function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    // In a real app, you would reverse geocode to get an address
                    locationInput.value = "Current Location";
                    // Store coordinates for later use
                    locationInput.dataset.lat = position.coords.latitude;
                    locationInput.dataset.lng = position.coords.longitude;
                },
                function(error) {
                    alert("Unable to retrieve your location. Please enter your address manually.");
                    console.error("Geolocation error:", error);
                }
            );
        } else {
            alert("Geolocation is not supported by your browser. Please enter your address manually.");
        }
    });

    // Search for doctors
    searchBtn.addEventListener('click', function() {
        const symptoms = symptomsInput.value.trim();
        const location = locationInput.value.trim();
        const specialty = specialtySelect.value;

        // Validate inputs
        if (!symptoms) {
            alert("Please describe your symptoms.");
            return;
        }

        if (!location) {
            alert("Please enter your location.");
            return;
        }

        // Show loading
        loadingDiv.style.display = 'block';
        resultsDiv.style.display = 'none';
        noResultsDiv.style.display = 'none';

        // Simulate API call with setTimeout
        setTimeout(function() {
            // Hide loading
            loadingDiv.style.display = 'none';

            // Filter doctors based on specialty (if selected)
            let filteredDoctors = sampleDoctors;
            if (specialty) {
                const specialtyMap = {
                    'family': 'Family Medicine',
                    'pediatrics': 'Pediatrics',
                    'internal': 'Internal Medicine',
                    'cardiology': 'Cardiology',
                    'dermatology': 'Dermatology',
                    'neurology': 'Neurology',
                    'orthopedics': 'Orthopedics',
                    'ent': 'ENT (Ear, Nose, Throat)'
                };
                const specialtyText = specialtyMap[specialty];
                filteredDoctors = sampleDoctors.filter(doctor => doctor.specialty === specialtyText);
            }

            // Further filter based on symptoms (simplified for demo)
            // In a real app, this would be done by a medical API
            const symptomKeywords = symptoms.toLowerCase().split(/[ ,]+/);
            const symptomSpecialtyMap = {
                'headache': ['Family Medicine', 'Neurology'],
                'fever': ['Family Medicine', 'Pediatrics', 'Internal Medicine'],
                'stomach': ['Family Medicine', 'Internal Medicine'],
                'rash': ['Dermatology', 'Family Medicine'],
                'heart': ['Cardiology'],
                'ear': ['ENT (Ear, Nose, Throat)'],
                'nose': ['ENT (Ear, Nose, Throat)'],
                'throat': ['ENT (Ear, Nose, Throat)'],
                'skin': ['Dermatology'],
                'child': ['Pediatrics']
            };

            if (!specialty) {
                // If no specialty selected, try to match symptoms to specialties
                const matchedSpecialties = new Set();
                symptomKeywords.forEach(keyword => {
                    if (symptomSpecialtyMap[keyword]) {
                        symptomSpecialtyMap[keyword].forEach(spec => matchedSpecialties.add(spec));
                    }
                });

                if (matchedSpecialties.size > 0) {
                    filteredDoctors = filteredDoctors.filter(doctor => 
                        Array.from(matchedSpecialties).includes(doctor.specialty)
                    );
                }
            }

            // Sort by distance
            filteredDoctors.sort((a, b) => a.distance - b.distance);

            // Display results
            displayResults(filteredDoctors);
        }, 1500); // Simulate network delay
    });

    // Display results
    function displayResults(doctors) {
        resultsGrid.innerHTML = '';

        if (doctors.length === 0) {
            noResultsDiv.style.display = 'block';
            return;
        }

        doctors.forEach(doctor => {
            const doctorCard = document.createElement('div');
            doctorCard.className = 'doctor-card';
            doctorCard.innerHTML = `
                <div class="doctor-info">
                    <img src="${doctor.image}" alt="${doctor.name}" class="doctor-image" style="width:80px;height:80px;border-radius:50%;object-fit:cover;float:right;margin-left:15px;">
                    <h3 class="doctor-name">${doctor.name}</h3>
                    <p class="doctor-specialty">${doctor.specialty}</p>
                    <p class="doctor-rating">
                        ${'★'.repeat(Math.floor(doctor.rating))}${'☆'.repeat(5 - Math.floor(doctor.rating))} 
                        (${doctor.rating.toFixed(1)})
                    </p>
                    <p class="doctor-address"><i class="fas fa-map-marker-alt"></i> ${doctor.address}</p>
                    <p class="doctor-phone"><i class="fas fa-phone"></i> ${doctor.phone}</p>
                    <span class="doctor-distance"><i class="fas fa-walking"></i> ${doctor.distance} miles away</span>
                    ${doctor.acceptsNewPatients ? '<span class="doctor-availability" style="color:green;margin-left:10px;"><i class="fas fa-check-circle"></i> Accepting new patients</span>' : '<span class="doctor-availability" style="color:red;margin-left:10px;"><i class="fas fa-times-circle"></i> Not accepting new patients</span>'}
                </div>
                <div class="doctor-actions">
                    <a href="index.html"><button class="action-btn book-btn" data-id="${doctor.id}">
                        <i class="fas fa-calendar-check"></i> Book Appointment
                    </button></a>
                    <button class="action-btn directions-btn" data-id="${doctor.id}">
                        <i class="fas fa-directions"></i> Get Directions
                    </button>
                </div>
            `;
            resultsGrid.appendChild(doctorCard);
        });

        // // Add event listeners to buttons
        // document.querySelectorAll('.book-btn').forEach(btn => {
        //     btn.addEventListener('click', function() {
        //         const doctorId = this.getAttribute('data-id');
        //         const doctor = sampleDoctors.find(d => d.id == doctorId);
        //         alert(`Booking appointment with ${doctor.name}. In a real app, this would redirect to a booking system.`);
        //     });
        // });

        // document.querySelectorAll('.directions-btn').forEach(btn => {
        //     btn.addEventListener('click', function() {
        //         const doctorId = this.getAttribute('data-id');
        //         const doctor = sampleDoctors.find(d => d.id == doctorId);
        //         alert(`Getting directions to ${doctor.name}'s office at ${doctor.address}. In a real app, this would open Google Maps.`);
        //     });
        // });

        // Add this at the top of the file (after DOM elements are selected)
const mapModal = document.getElementById('mapModal');
const closeBtn = document.querySelector('.close-btn');
const openGoogleMapsBtn = document.getElementById('open-google-maps');
let currentDoctorForMap = null;
let map = null;
let directionsService = null;
let directionsRenderer = null;

// Close modal when clicking X
closeBtn.addEventListener('click', function() {
    mapModal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target === mapModal) {
        mapModal.style.display = 'none';
    }
});

// Open in Google Maps button
openGoogleMapsBtn.addEventListener('click', function() {
    if (currentDoctorForMap) {
        const address = encodeURIComponent(currentDoctorForMap.address);
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, '_blank');
    }
});

// Initialize Google Maps
function initMap() {
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: {lat: 37.7749, lng: -122.4194} // Default to San Francisco
    });
    
    directionsRenderer.setMap(map);
}

// Updated directions button event listener
document.querySelectorAll('.directions-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const doctorId = this.getAttribute('data-id');
        const doctor = sampleDoctors.find(d => d.id == doctorId);
        currentDoctorForMap = doctor;
        
        // Show modal
        mapModal.style.display = 'block';
        
        // Initialize map if not already done
        if (!map) {
            initMap();
        }
        
        // Try to get user's current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    const userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    
                    // Center map between user and doctor
                    const bounds = new google.maps.LatLngBounds();
                    bounds.extend(userLocation);
                    bounds.extend({lat: 37.7749, lng: -122.4194}); // Doctor location (sample)
                    map.fitBounds(bounds);
                    
                    // Calculate and display route
                    calculateAndDisplayRoute(userLocation, {lat: 37.7749, lng: -122.4194});
                },
                function(error) {
                    // If geolocation fails, just center on doctor's location
                    map.setCenter({lat: 37.7749, lng: -122.4194});
                    alert("Couldn't get your location. Showing doctor's location only.");
                }
            );
        } else {
            // Browser doesn't support Geolocation
            map.setCenter({lat: 37.7749, lng: -122.4194});
            alert("Geolocation is not supported by your browser. Showing doctor's location only.");
        }
    });
});

function calculateAndDisplayRoute(start, end) {
    directionsService.route(
        {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING
        },
        function(response, status) {
            if (status === 'OK') {
                directionsRenderer.setDirections(response);
            } else {
                alert('Directions request failed due to ' + status);
            }
        }
    );
}

        resultsDiv.style.display = 'block';
    }
});