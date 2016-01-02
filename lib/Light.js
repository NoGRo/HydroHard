var h = require('../lib/Hardware');
var t = require('../lib/Target');
var c = require('../lib/Config');
var moment = require('moment');

function Light() {
    if (!(this instanceof Light))
        return new Light();
    this.bulb = h.Enviroment.Control.Light;
    this.startTime = t.Envitorment.Light.StartTime;
    this.duration = t.Envitorment.Light.Duration;
    this.checkState = function (){
        
        var now = moment();
        var startTime = now.hours(0).minutes(0).seconds(0).add(this.startTime),
            endTime = startTime.add(this.duration);

        if (now.isBetween(startTime, endTime)) {
            this.bulb.on();
        } else {
            this.bulb.off();
        }

    };
    this.start = function() {
        this.inteval = setInterval(this.checkState.bind(this), 1000);
    }
    this.stop = function () {
        this.bulb.off();
        clearInterval(this.inteval);
    }
    
}

module.exports = new Light();