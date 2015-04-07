
var ph = require('./lib/Ph');
var h = require('./lib/Hardware');

h.on('ready', function () {
	setInterval(function  () {
		console.log(ph.value);
	}, 1000);
});
