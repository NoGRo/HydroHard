var five = require('johnny-five');

/*esta clase significa la definicion hardware 
cada parte se pasa a un metodo constructor que asigna la logica corresondiente a cada piesa
segun su typo y si configuracion

 */
function Hardware () { 
	this = {
		Ready: function  () {},
		SN: {
			Water: {
				Capacity: 50,
				Type: 'shr-40',
				Pins: [10],
				CalibrationMin: 1000,
				CalibrationMax: 20
			},
			Ph: {
				Type: 'Evay',
				Pins: [2,5],
				CalibrationPH4: 500,
				CalibrationPH7: 800
			},
			Ec: {
				Type: 'Evay',
				Pins: [2,5],
				Calibration: 600
			},
			Temperature: false,
			Control: {
				Circulatory: {
					Type: 'Reley',
					Pins: [2]
				},
				Drain: false,
				Tap: false,
				Temperature: false,
				PhUp: false,
				PhDown: {
					Type: 'Peristaltic',
					Pins: [13],
					Calibration: 800,
				},
				Solution1: {
					Type: 'Peristaltic',
					Pins: [6],
					Calibration: 800
				},
				Solution2: false
			}
		},
		Enviroment: {
			Temperature: false,
			Humidity: false,
			Sun:false,
			Wind: false,
			WindDirection: false,
			Control: {
				Light: false,
				Fan: false
			}
		}
	}
};

board = new five.Board({port: 'COM4'});
board.on("ready", function() {

  	debugger;
	var phDown = Hardware.SN.Control.PhDown;
	initHard(phDown);
	initHard(Hardware.SN.Water);


  Hardware.Ready();

});


var hardDic = {
	'Peristaltic': function (piece) {
		var led = new five.Led(piece.Pins[0]);

		piece.Send = function(ml) {
			
			led.on();
			setInterval(function(){
				led.off();
				},
				piece.Calibration * ml);
		};
	},
 	'shr-40': function (piece) {
		ping = new five.Ping(piece.Pins[0]);
		ping.on("change", function(err, value) {
			piece.cm = this.cm;
		});
		piece.Read = function () {
			piece.cm = ping.cm;
			return ping.cm;
		};
 	}

}


function initHard (piece) {
	if (piece) {
		hardDic[piece.Type](piece);
	}
}

module.exports = Hardware;
