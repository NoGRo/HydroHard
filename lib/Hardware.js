var five = require('johnny-five'),
	events = require('events'),
	util = require("util");
/*esta clase significa la definicion hardware 
cada parte se pasa a un metodo constructor que asigna la logica corresondiente a cada piesa
segun su typo y si configuracion

 */
util.inherits(Hardware, events.EventEmitter);

function Hardware(board) {
	if (!(this instanceof Hardware)) {
		return new Hardware(board);
	}
	this.isBusy = false;
	this.SN = {
		Water: {
			Type: 'shr-40',
			Pin: [10],

			Capacity: 50,
			FullCm: 5,
			EmptyCm: 40
		},
		Ph: {
			Type: 'Analog',
			Decimals: 1,
			Pin: 'A0',
			Scale: [0, 14]
		},
		Ec: {
			Type: 'Analog',
			Pin: 'A1',
			Scale: [0, 2]
		},
		Temperature: false,
		Control: {
			Circulatory: {
				Type: 'Reley',
				Pin: 2
			},
			Drain: {
				Type: 'Reley',
				Pin: 3
			},
			TapWater: {
				Type: 'Reley',
				Pin: 4
			},
			Mixing: {
				Type: 'Reley',
				Pin: 4
			},
			Temperature: false,
			PhUp: false,
			PhDown: {
				Type: 'Peristaltic',
				Pin: 13,
				Calibration: 80,
			},
			Solution1: {
				Type: 'Peristaltic',
				Pin: 10,
				Calibration: 80
			},
			Solution2: {
				Type: 'Peristaltic',
				Pin: 11,
				Calibration: 80
			},
		}
	};
	this.Enviroment = {
		Temperature: false,
		Humidity: false,
		Sun: false,
		Wind: false,
		WindDirection: false,
		Control: {
			Light: false,
			Fan: false
		}
	};

	board.on("ready", function() {

		initHard(hardware.SN.Control.PhDown);
		initHard(hardware.SN.Ph);
		//initHard(hardware.SN.Ec);
		initHard(hardware.SN.Water);

		hardware.isReady = true;
		hardware.emit('ready', hardware);
	});

	var initHard = function(piece) {
		if (piece) {
			hardDefinition[piece.Type](piece);
		};
	}
	var hardDefinition = {
		'Peristaltic': function(piece) {
			var led = new five.Led(piece.Pin);

			piece.Send = function(ml, Next) {
				hardware.isBusy =  true;
				led.on();
				setTimeout(function() {
						led.off();
						hardware.isBusy =  false;
						if (Next) Next();
					},
					piece.Calibration * ml);
			};
		},
		'Reley': function(piece) {
			var led = new five.Led(piece.Pin);
			var timerTimeout;

			piece.On = function(time, Next) {
				if(timerTimeout) clearTimeout(timerTimeout);
				led.on();
				if(time)
				{
					timerTimeout = setTimeout(function() {
							led.off();
							if (Next) Next();
						},
						time);
				}
				piece.Off = led.off;
			};
		},
		'Analog': function(piece) {
			var sensor = new five.Sensor({
				pin: piece.Pin,
				freq: 250
			});
			sensor.scale(piece.Scale).on("data", function() {
				piece.Value = Math.round(this.value * 10) / 10;
				//piece.Value =this.value;
			});
		},
		'shr-40': function(piece) {
			/*ping = new five.Ping(piece.Pin[0]);
			ping.on("change", function(err, value) {
				piece.cm = this.cm;
			});
			piece.Read = function () {
				piece.cm = ping.cm;
				return ping.cm;
			};*/
		}

	}


}



var board = new five.Board({
	port: 'COM3'
});
var hardware = new Hardware(board);

module.exports = hardware;