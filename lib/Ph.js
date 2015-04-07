var h = require('../lib/Hardware');
var t = require('../lib/Target');
var c = require('../lib/Config');
//var w = require('Water');

function Ph() {
	if (!(this instanceof Ph)) {
		return new Ph();
	}
	this.sn = require('../lib/Sn');
	this.reader = h.SN.Ph;
	this.up = h.SN.Control.PhUp;
	this.down = h.SN.Control.PhDown;
	this.target = t.SN.Ph.Target;
	this.tolerance = t.SN.Ph.Tolerance;
	this.min = t.SN.Ph.Min;
	this.max = t.SN.Ph.Max;
	this.correct = function() {
		//mejorar ver donde va
		this.down.efficiency = c.phDownEfficiency;
		this.up.efficiency = c.phUpEfficiency;

		var phControl;

		if (!this.isOk) {
			phControl = this.desviation < 0 ? this.down : this.up;
		} // si la diferencia es negativa ahi que bajar el pH

		if (phControl) { //si el systema no cuenta con el hardware de phup o phdown devuelven false
			var docify = Math.abs(this.desviation) //desviacion multiplciada por la eficiencia del ph+
				* phControl.efficiency //eficiencia para un litro de agua
				* this.sn.waterLevel // multiplicada por la cantidad de litros en el tange 
				* 0.9; // para nunca pasarme y corregirlo de ultima en la siguiente iteracion

			//this.Water.Mixing();
			phControl.Send(docify);
		} // ay, que prolijo que soy.
		/*
		if (this.value > this.mix || Ph.Value < Ph.Min) {
			//mandar alguna alerta (no se como)
			//no estaria mal exponer por lo menos uno o dos led en el aparato o uno RGB
		};
		*/
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