var target = require('Target'),
	 hardware = require('Hardware'),
	 five = require('johnny-five'),
	 extend = require("xtend");

var Target = target.Get();
var Hardware = hardware.Get();


//algo asi ponele
Hardware.SN.Ph.Correct = function()
{
	var Ph = extend(Target.SN.Ph, Hardware.SN.Ph, Read.SN.Ph);
	var Water = extend(Hardware.SN.Water, Read.SN.Water);
	var PhControl = nothing;

	//   ejemplo:       6.2         7
	Ph.Desviation = Ph.Target - Ph.Value;

	if ( Math.abs(Ph.Desviation) >= Ph.Tolerance) { // si se pasa de la tolerancia lo ajusto
		PhControl = Ph.Desviation < 0 ?  Ph.Control.PhDown : Ph.Control.PhUp;
	}// si la diferencia es negatica ahi que bajar el pH
	
	if (PhControl) { //si el systema no cuenta con el hardware de phup o phdown devuelven false
		var docify = Math.abs(Ph.Desviation) //desviacion multiplciada por la eficiencia del ph+
				* PhControl.Efficiency //eficiencia para un litro de agua
				* Water.Value // multiplicada por la cantidad de litros en el tange 
				* 0.9; // para nunca pasarme y corregirlo de ultima en la siguiente iteracion
		//habria que hacer un corrector de eficiencia basado en la ultima correccion del ph y su resultado 
		PhControl.Send(docify);
	}// ay, que prolijo que soy.
	if (Ph.Value > Ph.Max || Ph.Value < Ph.Min) {
		//mandar alguna alerta (no se como)
		//no estaria mal exponer por lo menos uno o dos led en el aparato o uno RGB
	};

}

Hardware.SN.Ec.Correct = function()
{
	var Ec = extend(Target.SN.Ec, Hardware.SN.Ec, Read.SN.Ec);
	var Water = extend(Hardware.SN.Water, Read.SN.Water);
	var EcControl = nothing;

	//   ejemplo:       6.2         7
	Ec.Desviation = Ec.Target - Ec.Value;

	if ( Math.abs(Ec.Desviation) >= Ec.Tolerance) { // si se pasa de la tolerancia lo ajusto
		EcControl = Ec.Desviation < 0 ?  Ec.Control.EcDown : Ec.Control.EcUp;
	}// si la diferencia es negatica ahi que bajar el Ec
	
	if (EcControl) { //si el systema no cuenta con el hardware de Ecup o Ecdown devuelven false
		var docify = Math.abs(Ec.Desviation) //desviacion multiplciada por la eficiencia del Ec+
				* EcControl.Efficiency //eficiencia para un litro de agua
				* Water.Value // multiplicada por la cantidad de litros en el tange 
				* 0.9; // para no pasarme y corregirlo de ultima en la siguiente iteracion
		//habria que hacer un corrector de eficiencia basado en la ultima correccion del Ec y su resultado 
		EcControl.Send(docify);
	}// ay, que prolijo que soy.
	if (Ec.Value > Ec.Max || Ec.Value < Ec.Min) {
		//mandar alguna alerta (no se como)
		//no estaria mal exponer por lo menos uno o dos led en el aparato o uno RGB
	};
}