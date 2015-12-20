var sn = require('../lib/Sn');
var light = require('../lib/Light');
var fan = require('../lib/Fan');
var h = require('../lib/Hardware');

h.on('ready', function() {
    
    light.start();
    fan.start();
    sn.start();
})