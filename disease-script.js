document.getElementById('predict-btn').addEventListener('click', async function() {
    const symptomsInput = document.getElementById('symptoms').value.trim();
    const resultsContainer = document.getElementById('results');
    
    if (!symptomsInput) {
        resultsContainer.innerHTML = '<p class="error">Please enter symptoms to predict</p>';
        return;
    }
    
    // Show loading state
    resultsContainer.innerHTML = '<p class="loading">Analyzing symptoms... Please wait</p>';
    
    try {
        const url = 'https://human-disease-detector.p.rapidapi.com/human_disease/predict';
        const options = {
            method: 'POST',
            headers: {
                'x-rapidapi-key': 'a63a48d41bmsh053b40b87283c6bp19b259jsnb61bc576058a',
                'x-rapidapi-host': 'human-disease-detector.p.rapidapi.com',
                'Content-Type': 'application/json',
                'x-token': 'Makshad Nai Bhoolna @ 2025'
            },
            body: JSON.stringify({
                symptoms: symptomsInput
            })
        };

        const response = await fetch(url, options);
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        
        const result = await response.json();
        
        // Display results
        if (result && result.predictions) {
            let html = '';
            result.predictions.forEach(prediction => {
                html += `
                <div class="disease-result">
                    <h3>${prediction.disease}</h3>
                    <p><strong>Confidence:</strong> ${(prediction.confidence * 100).toFixed(2)}%</p>
                    <p><strong>Description:</strong> ${prediction.description || 'Not available'}</p>
                    <p><strong>Recommended Action:</strong> ${prediction.recommendation || 'Consult with a healthcare professional'}</p>
                </div>
                `;
            });
            resultsContainer.innerHTML = html;
        } else {
            resultsContainer.innerHTML = '<p class="error">No predictions found for these symptoms</p>';
        }
    } catch (error) {
        console.error('Error:', error);
        resultsContainer.innerHTML = `<p class="error">Error: ${error.message || 'Failed to fetch predictions'}</p>`;
    }
});