
var h = require('Hardware');

h.Ready = function () {
	debugger;
	h.SN.Control.PhDown.Send(10);
	console.log(h.SN.Water.Read());
}
