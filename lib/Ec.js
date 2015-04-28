var h = require('../lib/Hardware');
var t = require('../lib/Target');
var c = require('../lib/Config');
//var w = require('Water');

function Ec() {
	if (!(this instanceof Ec))
		return new Ec();

	this.sn = require('../lib/Sn');
	this.reader = h.SN.Ec;
	this.efficiency = c.solutionPer10liters;
	this.solutions = [h.SN.Control.SolutionA, h.SN.Control.SolutionB];
	this.solutions.send = function(ml) {
        this[0].Send(ml / 2, function () { // mando la solucion A 
			this[1].Send(ml / 2); // Despues mando la solucion B
		}.bind(this));
	}
	this.target = t.SN.Ec.Target;
	this.tolerance = t.SN.Ec.Tolerance;
	this.min = t.SN.Ec.Min;
	this.max = t.SN.Ec.Max;

	var timerCorrect;
	this.startCheck = function() {
		timerCorrect = setInterval(this.correct, c.ecCorrectEvery);
    };
    this.stopCheck = function() {
        clearInterval(timerCorrect);
        
	};
	this.correct = function() {
		//mejorar ver donde va
		this.down.efficiency = c.phDownEfficiency;
		this.up.efficiency = c.phUpEfficiency;



		if (this.isOk) return;
		if (this.value > this.max) {
			///alerta aca 
			return;
		}
		if (this.desviation < 0) return; // la ec no se puede bajar 

		if (this.solutions) { //si el systema no cuenta con el hardware de phup o phdown devuelven false
			var docify = Math.abs(this.desviation) //desviacion multiplciada por la eficiencia del ph+
				* this.efficiency //eficiencia 
				* (this.sn.waterLevel / 10) // multiplicada por cada 20 litros en el tange 
				* 0.9; // para nunca pasarme y corregirlo de ultima en la siguiente iteracion

			//this.Water.Mixing();
			this.solutions.send(docify);
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
module.exports = new Ec();