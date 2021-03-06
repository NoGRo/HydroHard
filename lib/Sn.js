var h = require('../lib/Hardware'),
	c = require('../lib/Config'),
	t = require('../lib/Target');

Number.prototype.map = function(in_min, in_max, out_min, out_max) {
	return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}


function Sn() {
    var self = this;
	this.ph = require('../lib/Ph');
	this.ec = require('../lib/Ec');
	this.capacity = c.waterCapacity;

	this.start = function() {
		this.ec.startCheck();
        this.ph.startCheck();
	    this.startCirculateCheck();
	};
	this.stop = function() {
		this.ec.stopCheck();
        this.ph.stopCheck();
        this.stopCirculateCheck();
	};
	this.mixing = function() {
		h.SN.Control.Mixing.on(c.mixingDuraton * 60 * 1000);
	};
    
    this.circulate = function () {
        h.SN.Control.Circulatory.on(t.SN.Control.Circulatory[0] * 60 * 1000);
    };
    this.timerCirculare = 0;
    
    this.stopCirculateCheck = function () {
        h.SN.Control.Circulatory.off();
        clearInterval(this.timerCirculare);
    };
    this.startCirculateCheck = function() {
        this.timerCirculare = setInterval(function() {
            self.circulate();
        }, ((t.SN.Control.Circulatory[0] * 60 * 1000) + 
            (t.SN.Control.Circulatory[1] * 60 * 1000)));
    };

	this.addWater = function(liters, next) {
		this.fill(this.waterLevel + liters, next);
    };

    this.pumpFill = h.SN.Control.Fill;
	this.fill = function(liters, next) {
		this.stopChecks();
	    (typeof(liters) == 'function') && (next = liters, liters = 0);

		liters = (liters || capacity);

		if (liters > capacity) liters = capacity;

	    var lastLevel = this.waterLevel.toFixed(0);
	    var timerCheck = 0;
	    var timerTarjet = 0;
	    var timeoutProgress = 0;

        pumpFill.On((c.fillCheckEvery + 1) * 1000); // dreno por un minutos 2 segundos

		var stop = function(err) {
			clearInterval(timerCheck);
			clearInterval(timerTarjet);
			clearTimeout(timeoutProgress); // termino bien cancelo el timeout
			this.startChecks();
            pumpFill.Off();
			if (next) next(err);
		};

		timeoutProgress = setTimeout(function() {
			//aca tambien termino pero todo mal ponele 
			stop('timeout');
		}, 2 * 60 * 60 * 1000); //2 horas maximo // de terimnar bien este timer se cancela 

		timerTarjet = setInterval(function() { //podria ser remplazdo por un evento change
			if (this.waterLevel >= liters) { //termino bien
				stop();
			}
		}, 1000);

		timerCheck = setInterval(function() { //monitorea el progreso del llenado 
			var level = this.waterLevel.toFixed(0);
			if (level === lastLevel) { // ver que onda el ruido 
				stop('noProgress'); // termino bien cancelo el timeout
			} else if (level < liters) {
                pumpFill.On((c.fillCheckEvery + 1) * 1000) // vuelvo a ponerle otro minuto
			}
			lastLevel = this.waterLevel.toFixed(0);
		}, c.fillCheckEvery * 1000); //si no termino le doy otro minuto a la bomba 
	};

	this.drain = function(next) {
		this.stopChecks();
		if (!h.SN.Control.Drain) return;

		var lastLevel = this.waterLevel.toFixed(0),
			initialLevel = this.waterLevel.toFixed(0),
            timerCheck = 0,
            timerTarjet = 0,
            timeoutProgress = 0;

		var stop = function(err) {
			clearInterval(timerCheck);
			clearInterval(timerTarjet);
			clearTimeout(timeoutProgress); // termino bien cancelo el timeout
            h.SN.Control.Drain.Off();
			if (err) this.startChecks();
			if (next) next(err);
		};

		timeoutProgress = setTimeout(function() {
			//aca tambien termino pero todo mal ponele 
			stop('timeout');
		}, 1 * 60 * 60 * 1000); //2 horas maximo // de terimnar bien este timer se cancela 


		timerTarjet = setInterval(function() {
			if (this.waterLevel <= 0) //termino bien
				stop();
		}, 1000);

	    h.SN.Control.Drain.On((c.drainCheckEvery + 1) * 1000); // dreno por un minutos 2 segundos

		timerCheck = setInterval(function() { // va mirado que avance como se espera hasta que ya no avanza mas y ahi termino 
		    var level = this.waterLevel.toFixed(0);
			if (level === lastLevel) { // ver que onda el ruido 
                if (level < (initialLevel / 2)) {  // si hace un minuto que no cambia y tiene menos que la mitad de lo que empezo termino
					stop();
				} else { // aca paso algo y y el tanke no se vacia o esta mal calibrado 
					stop('noProgress');
				}

			} else {
                h.SN.Control.Drain.On((c.drainCheckEvery + 1) * 1000) // vuelvo a ponerle otro minuto
			}
			lastLevel = this.waterLevel.toFixed(0);
		}, c.drainCheckEvery * 1000); // chekea una ves por minuto ver si este tiempo esta bien 
	};

	Object.defineProperties(this, {
		waterLevel: {
            get: function () {
                if (!h.SN.Water.Value) return h.SN.Water.Capacity;
				return h.SN.Water.Value.toFixed(1)
					.map(c.waterCalibrationEmptyCm, c.waterCalibrationFullCm,
						0, c.waterCapacity);
			}
		}
	});

}
module.exports = new Sn();