document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const symptomsList = document.getElementById('symptoms-list');
  const symptomInput = document.getElementById('symptom-input');
  const addSymptomBtn = document.getElementById('add-symptom-btn');
  const submitBtn = document.getElementById('submit-btn');
  const dnaLoader = document.getElementById('dna-loader');
  const dnaAnimation = document.querySelector('.dna-animation');
  const resultsContainer = document.getElementById('results-container');
  const diagnosisDetails = document.getElementById('diagnosis-details');
  const treatmentPlan = document.getElementById('treatment-plan');
  const confidenceLevel = document.getElementById('confidence-level');

  // Initial symptoms (user can modify these)
  const initialSymptoms = [
      'severe headache',
      'fever',
      'fatigue',
      'sensitivity to light'
  ];

  // Create DNA animation nodes
  function createDnaNodes() {
      const nodeCount = 15;
      const height = 300;
      const spacing = height / (nodeCount - 1);
      
      for (let i = 0; i < nodeCount; i++) {
          const node = document.createElement('div');
          node.className = 'dna-node';
          node.style.top = `${i * spacing}px`;
          node.style.animationDelay = `${i * 0.1}s`;
          dnaAnimation.appendChild(node);
      }
  }

  // Add symptom to list
  function addSymptom(symptom) {
      if (!symptom.trim()) return;
      
      const symptomTag = document.createElement('div');
      symptomTag.className = 'symptom-tag';
      symptomTag.innerHTML = `
          ${symptom}
          <button class="remove-symptom" data-symptom="${symptom}">×</button>
      `;
      
      symptomsList.appendChild(symptomTag);
      symptomInput.value = '';
      
      // Add remove event
      symptomTag.querySelector('.remove-symptom').addEventListener('click', function() {
          symptomTag.style.animation = 'fadeOut 0.3s ease';
          setTimeout(() => {
              symptomsList.removeChild(symptomTag);
          }, 300);
      });
  }

  // Get current symptoms
  function getSymptoms() {
      const symptoms = [];
      document.querySelectorAll('.symptom-tag').forEach(tag => {
          symptoms.push(tag.textContent.replace('×', '').trim());
      });
      return symptoms;
  }

  // Submit diagnosis request
  async function submitDiagnosis() {
      const symptoms = getSymptoms();
      if (symptoms.length === 0) {
          alert('Please add at least one symptom');
          return;
      }

      // Show DNA loader
      dnaLoader.classList.add('active');
      
      // Prepare request data
      const patientInfo = {
          age: parseInt(document.getElementById('age').value),
          gender: document.getElementById('gender').value,
          height: parseInt(document.getElementById('height').value),
          weight: parseInt(document.getElementById('weight').value),
          medicalHistory: document.getElementById('medical-history').value.split(',').map(item => item.trim()),
          currentMedications: document.getElementById('medications').value.split(',').map(item => item.trim()),
          allergies: document.getElementById('allergies').value.split(',').map(item => item.trim()),
          lifestyle: document.getElementById('lifestyle').value
      };

      const requestData = {
          symptoms: symptoms,
          patientInfo: patientInfo,
          lang: 'en'
      };

      const url = 'https://ai-medical-diagnosis-api-symptoms-to-results.p.rapidapi.com/analyzeSymptomsAndDiagnose?noqueue=1';
      const options = {
          method: 'POST',
          headers: {
              'x-rapidapi-key': 'a63a48d41bmsh053b40b87283c6bp19b259jsnb61bc576058a',
              'x-rapidapi-host': 'ai-medical-diagnosis-api-symptoms-to-results.p.rapidapi.com',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)
      };

      try {
          const response = await fetch(url, options);
          
          if (!response.ok) {
              throw new Error(`API request failed with status ${response.status}`);
          }
          
          const result = await response.json();
          
          // Display results from API only
          displayResults(result);
      } catch (error) {
          console.error('Error:', error);
          alert('An error occurred while processing your request. Please try again.');
      } finally {
          dnaLoader.classList.remove('active');
      }
  }

  // Display results from API response
  function displayResults(result) {
      // Show results container
      resultsContainer.style.display = 'block';
      
      // Clear previous results
      diagnosisDetails.innerHTML = '';
      treatmentPlan.innerHTML = '';
      
      // Check if the API returned valid data
      if (!result || typeof result !== 'object') {
          diagnosisDetails.innerHTML = '<div class="diagnosis-item"><p>No valid diagnosis data received from the API.</p></div>';
          return;
      }
      
      // Display confidence level if available
      if (result.confidence !== undefined) {
          const confidencePercent = Math.round((result.confidence || 0) * 100);
          confidenceLevel.style.width = `${confidencePercent}%`;
      }
      
      // Display diagnosis details
      if (result.diagnosis && Array.isArray(result.diagnosis)) {
          result.diagnosis.forEach(diag => {
              const diagItem = document.createElement('div');
              diagItem.className = 'diagnosis-item';
              
              const condition = diag.condition || 'Unknown condition';
              const description = diag.description || 'No description available';
              
              diagItem.innerHTML = `
                  <h3>${condition}</h3>
                  <p>${description}</p>
              `;
              diagnosisDetails.appendChild(diagItem);
          });
      } else {
          diagnosisDetails.innerHTML = '<div class="diagnosis-item"><p>No diagnosis information available from the API.</p></div>';
      }
      
      // Display treatment plan if available
      if (result.treatmentPlan && Array.isArray(result.treatmentPlan)) {
          result.treatmentPlan.forEach(treatment => {
              const treatmentItem = document.createElement('div');
              treatmentItem.className = 'treatment-item';
              
              const type = treatment.type || 'treatment';
              const name = treatment.name || 'Unnamed treatment';
              const description = treatment.description || 'No description available';
              const dosage = treatment.dosage || '';
              
              treatmentItem.innerHTML = `
                  <div class="treatment-icon">${type === 'medication' ? '💊' : '🏥'}</div>
                  <div class="treatment-content">
                      <h4>${name}</h4>
                      <p>${description}</p>
                      ${dosage ? `<p><strong>Dosage:</strong> ${dosage}</p>` : ''}
                  </div>
              `;
              treatmentPlan.appendChild(treatmentItem);
          });
      } else {
          treatmentPlan.innerHTML = '<div class="treatment-item"><p>No treatment plan available from the API.</p></div>';
      }
      
      // Scroll to results
      setTimeout(() => {
          resultsContainer.scrollIntoView({ behavior: 'smooth' });
      }, 500);
  }

  // Initialize
  createDnaNodes();
  
  // Add initial symptoms (user can modify these before submitting)
  initialSymptoms.forEach(symptom => addSymptom(symptom));

  // Event listeners
  addSymptomBtn.addEventListener('click', () => {
      addSymptom(symptomInput.value);
  });

  symptomInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
          addSymptom(symptomInput.value);
      }
  });

  submitBtn.addEventListener('click', submitDiagnosis);
});