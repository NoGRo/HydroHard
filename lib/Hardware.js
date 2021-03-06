var five = require('johnny-five'),
    events = require('events'),
    util = require("util");
/*esta clase significa la definicion hardware 
cada parte se pasa a un metodo constructor que asigna la logica corresondiente a cada piesa
segun su typo y si configuracion

 */
util.inherits(Hardware, events.EventEmitter);

function Hardware(board) {
    if (!(this instanceof Hardware))
        return new Hardware(board);
    this.isBusy = false;
    this.SN = {
        Water: {
            Type: 'shr-40',
            Pin: [10],
            
            Capacity: 10,
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
            Fill: {
                Type: 'Reley',
                Pin: 4
            },
            Mixing: {
                Type: 'Reley',
                Pin: 5
            },
            Temperature: false,
            PhUp: false,
            PhDown: {
                Type: 'Peristaltic',
                Pin: 6,
                Calibration: 1211
            },
            SolutionA: {
                Type: 'Peristaltic',
                Pin: 10,
                Calibration: 1211
            },
            SolutionB: {
                Type: 'Peristaltic',
                Pin: 11,
                Calibration: 1211
            }
        }
    }
    this.Button1 = {
        Type: 'Button',
        Pin: 3
    };
    this.Enviroment = {
        Temperature: false,
        Humidity: false,
        Sun: false,
        Wind: false,
        WindDirection: false,
        Control: {
            Light: {
                Type: 'Reley',
                Pin: 6
            },
            Fan: {
                Type: 'Reley',
                Pin: 7
            }
        }
    };
    
    var initHard = function (piece) {
        if (piece) {
            hardDefinition[piece.Type](piece);
        }        ;
    }
    
    board.on("ready", function () {
        
        
        initHard(hardware.SN.Control.Fill);
        initHard(hardware.SN.Control.Drain);
        initHard(hardware.SN.Control.Mixing);

        initHard(hardware.SN.Control.PhDown);
        initHard(hardware.SN.Control.SolutionA);
        initHard(hardware.SN.Control.SolutionB);
        initHard(hardware.SN.Ph);
        initHard(hardware.Button1);
        //initHard(hardware.SN.Ec);
        initHard(hardware.SN.Water);
        initHard(hardware.Enviroment.Control.Light);
        initHard(hardware.Enviroment.Control.Fan);

        hardware.isReady = true;
        hardware.emit('ready', hardware);
    });
    
    
    var hardDefinition = {
        'Peristaltic': function (piece) {
            var led = new five.Led(piece.Pin);
            piece.On = function () {
                led.on();
            };
            piece.Off = function () {
                led.off();
            };
            piece.Send = function (ml, next) {
                ml = ml + 0.01; // ajuste por arranque 
                hardware.isBusy = true;
                led.on();
                setTimeout(function () {
                    led.off();
                    hardware.isBusy = false;
                    if (next) next();
                },
					piece.Calibration * ml);
            };
        },
        'Reley': function (piece) {
            var led = new five.Led(piece.Pin);
            var timerTimeout;
            
            piece.on = function (time, next) {
                if (timerTimeout) clearTimeout(timerTimeout);
                led.on();
                if (time) {
                    timerTimeout = setTimeout(function () {
                        led.off();
                        if (next) next();
                    },
						time);
                }
            };
            piece.Off = function () {
                led.off();
                if (timerTimeout) clearTimeout(timerTimeout);
            };
        },
        'Analog': function (piece) {
            var sensor = new five.Sensor({
                pin: piece.Pin,
                freq: 250
            });
            piece.Value = 0;
            sensor.scale(piece.Scale).on("data", function () {
                piece.Value = Math.round(this.value * 10) / 10;
            });
        },
        'shr-40': function (piece) {
            //ping = new five.Ping({
            //    pin: piece.Pin[0],
            //    freq: 1000
            //});
            //ping.on("change", function (err, value) {
            //    piece.cm = this.cm;
            //    console.log(piece.cm);
            //});
            //piece.Read = function () {
            //    piece.cm = ping.cm;
                
            //    return ping.cm;
            //};
        },
        'Button': function (piece) {
            piece.b = new five.Button(piece.Pin);
        }
    }
}



var board = new five.Board({
    port: 'COM3'
});
var hardware = new Hardware(board);

module.exports = hardware;