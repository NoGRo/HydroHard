var h = require('../lib/Hardware');
var t = require('../lib/Target');
var c = require('../lib/Config');
var moment = require('moment');

function Fan() {
    if (!(this instanceof Fan))
        return new Fan();
    this.fan = h.Enviroment.Control.Fan;
    this.start = function () {
        this.fan.on();
    }
    this.stop = function () {
        this.fan.off();
    }
}
module.exports = new Fan();