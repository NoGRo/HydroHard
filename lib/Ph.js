var h = require('../lib/Hardware');
var t = require('../lib/Target');
var c = require('../lib/Config');
//var w = require('Water');

function Ph() {
	if (!(this instanceof Ph))
		return new Ph();

	this.sn = require('../lib/Sn');
	this.reader = h.SN.Ph;
	this.up = h.SN.Control.PhUp;
	this.down = h.SN.Control.PhDown;
	this.target = t.SN.Ph.Target;
	this.tolerance = t.SN.Ph.Tolerance;
	this.min = t.SN.Ph.Min;
	this.max = t.SN.Ph.Max;
	var timerCorrect;
	this.startCheck = function() {
		timerCorrect = setInterval(this.correct, c.phCorrectEvery * 1000 * 60);
	};
	this.stopCheck = function() {
		clearInterval(timerCorrect);
    };

    var phDown = this.down;

    h.on('ready', function() {
        h.Button1.b.on("down", function () {
            phDown.On();
        }).on("up", function () {
            phDown.Off();
            //calibration
            //phDown.Send(60);
           /* var ml = 60;
            var inter = setInterval(function() {
                ml--;
                phDown.Send(1);
                if (ml === 0) clearInterval(inter);
            }, 1500);*/

        });
    });
  

	this.correct = function() {
		//mejorar ver donde va
		if (this.down)
			this.down.efficiency = c.phDownEfficiency;
		if (this.up)
			this.up.efficiency = c.phUpEfficiency;

		var phControl;

		if (!this.isOk) {
			phControl = this.desviation < 0 ? this.down : this.up;
		} // si la diferencia es negativa ahi que bajar el pH

		if (phControl) { //si el systema no cuenta con el hardware de phup o phdown devuelven false
			var docify = Math.abs(this.desviation) //desviacion multiplciada por la eficiencia del ph+
				* phControl.efficiency //eficiencia para un litro de agua
				* (this.sn.waterLevel / 10) // multiplicada por cada 10 litros en el tange 
				* 0.9; // para nunca pasarme y corregirlo de ultima en la siguiente iteracion

			
			phControl.Send(docify, this.sn.mixing);

		} // ay, que prolijo que soy.
	};
	Object.defineProperties(this, {
		value: {
			get: function() {
				return this.reader.Value.toFixed(1);
			}
		},
		desviation: {
			get: function() {
				return this.target - this.value;
			}
		},
		isOk: {
			get: function() {
				return !(Math.abs(this.desviation) >= this.tolerance);
			}
		}
	});
}
module.exports = new Ph();