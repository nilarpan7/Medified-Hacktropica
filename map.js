// Example Node.js endpoint
app.get('/api/maps', (req, res) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    res.send(`https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&libraries=places&v=weekly`);
  });