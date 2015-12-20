module.exports = {

    //Capacidad del tanque en litros
    waterCapacity: 50,
    //Distancia del agua al sensor en Centímetros cuando está LLENO
    waterCalibrationFullCm: 5,
    //Distancia del agua al sensor en Centímetros cuando esta VACIO
    waterCalibrationEmptyCm: 40,

    //rellenar el tanke cada 
    waterRefillEvery: 0, //en horas
    //buscar progreso durante 
    drainCheckEvery: 60, //segundos 
    fillCheckEvery: 60, //segundos 
    //Minutos que tarda la solución en estabilizarse
    afterMakeSnWait: 30,

    //circular solución cada
    circulateEvery: 45, //minutos
    //circular solución durante 
    circulateDuration: 5, //minutos

    //corregir Ph cada
    phCorrectEvery: 5, //minutos

    phDownEfficiency: 0.2, //ml cada 10 litros

    phUpEfficiency: 0,

	//checkear la Ec cada 
	ecCorrectEvery: 20,//minutos
	//Total de A + B por cada 10 litros
	solutionPer10liters: 14, //ml 

	
	//duración del mesclado luego de corregir Ph O Ec en 
	mixingDuraton : 5 // minutos

};
