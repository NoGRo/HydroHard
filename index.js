var target = require('./lib/Target'),
	Hardware = require('./lib/Hardware'),
	config = require('./lib/config'),
	five = require('johnny-five'),
	extend = require("xtend");

var Target = target.Get();


Hardware.CorrectAll = function() {
	/*Hardware.SN.Ec.Correct();
	if (!hardware.isBusy)*/
	Hardware.SN.Ph.Correct();
};

Hardware.on('ready', function() {
	 timerCorrect = setInterval(Hardware.CorrectAll,
		config.phCorrectEvery * 60 * 1000);
})




//algo asi ponele
Hardware.SN.Ph.Check = function() {

	var Ph = extend(Target.SN.Ph, Hardware.SN.Ph);
	//   ejemplo:       6.2         7
	Ph.Desviation = Ph.Target - Ph.Value;
	Ph.isOk = !(Math.abs(Ph.Desviation) >= Ph.Tolerance);
	return Ph.isOk;
}
Hardware.SN.Ph.Correct = function() {
	var Ph = extend(Target.SN.Ph, Hardware.SN.Ph);

	var PhControl;
	debugger;
	Ph.Check();

	if (!Ph.isOk) {

		PhControl = Ph.Desviation < 0 ? Ph.Control.PhDown : Ph.Control.PhUp;
	} // si la diferencia es negativa ahi que bajar el pH

	if (PhControl) { //si el systema no cuenta con el hardware de phup o phdown devuelven false
		var docify = Math.abs(Ph.Desviation) //desviacion multiplciada por la eficiencia del ph+
			* PhControl.Efficiency //eficiencia para un litro de agua
			* Water.Value // multiplicada por la cantidad de litros en el tange 
			* 0.9; // para nunca pasarme y corregirlo de ultima en la siguiente iteracion

		Hardware.SN.Control.Mixing.On(mixingDuraton * 60 * 1000);
		PhControl.Send(docify);
	} // ay, que prolijo que soy.
	if (Ph.Value > Ph.Max || Ph.Value < Ph.Min) {
		//mandar alguna alerta (no se como)
		//no estaria mal exponer por lo menos uno o dos led en el aparato o uno RGB
	};
};

Hardware.SN.Ec.Correct = function() {
	var Ec = extend(Target.SN.Ec, Hardware.SN.Ec);
	var Water = extend(Hardware.SN.Water, Read.SN.Water);
	var EcControl = nothing;

	//   ejemplo:       6.2         7
	Ec.Desviation = Ec.Target - Ec.Value;

	if (Math.abs(Ec.Desviation) >= Ec.Tolerance) { // si se pasa de la tolerancia lo ajusto
		EcControl = Ec.Desviation < 0 ? Ec.Control.EcDown : Ec.Control.EcUp;
	} // si la diferencia es negatica ahi que bajar el Ec

	if (EcControl) { //si el systema no cuenta con el hardware de EcUp o Ecdown devuelven false
		var docify = Math.abs(Ec.Desviation) //desviacion multiplciada por la eficiencia del Ec+
			* EcControl.Efficiency //eficiencia para un litro de agua
			* Water.Value // multiplicada por la cantidad de litros en el tange 
			* 0.9; // para no pasarme y corregirlo de ultima en la siguiente iteracion
		//habria que hacer un corrector de eficiencia basado en la ultima correccion del Ec y su resultado 
		EcControl.Send(docify);
	} // ay, que prolijo que soy.
	if (Ec.Value > Ec.Max || Ec.Value < Ec.Min) {
		//mandar alguna alerta (no se como)
		//no estaria mal exponer por lo menos uno o dos led en el aparato o uno RGB
	};
};