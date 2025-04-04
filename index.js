const unirest = require('unirest');

const req = unirest('POST', 'https://google-api31.p.rapidapi.com/map');

req.headers({
	'x-rapidapi-key': 'a63a48d41bmsh053b40b87283c6bp19b259jsnb61bc576058a',
	'x-rapidapi-host': 'google-api31.p.rapidapi.com',
	'Content-Type': 'application/json'
});

req.type('json');
req.send({
	text: 'white house',
	place: 'washington DC',
	street: '',
	city: '',
	country: '',
	state: '',
	postalcode: '',
	latitude: '',
	longitude: '',
	radius: ''
});

req.end(function (res) {
	if (res.error) throw new Error(res.error);

	console.log(res.body);
});