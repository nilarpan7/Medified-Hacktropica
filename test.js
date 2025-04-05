const unirest = require('unirest');

const req = unirest('GET', 'https://drug-info-and-price-history.p.rapidapi.com/1/druginfo');

req.query({
	drug: 'dextromethorphan'
});

req.headers({
	'x-rapidapi-key': 'cf2ddb8c00msh697a715556d5e9fp1255c4jsnbac3068a0ca9',
	'x-rapidapi-host': 'drug-info-and-price-history.p.rapidapi.com'
});

req.end(function (res) {
	if (res.error) throw new Error(res.error);

	console.log(res.body);
});