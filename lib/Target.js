var fs = require('fs');
var extend = require("xtend");
module.exports = {
			SN: {
				Ph: {
					Target: 6.2,
					Tolerance: 0.2,
					Min: 5.5,
					Max: 6.5
				},
				WaterLevel: {
					Target: 30,
					Min: 20,
					Max: 32
				},
				Ec: {
					Target: 300,
					Min: 300,
					Max: 500
				},
				Temperature: {
					Target: 23,
					Min: 20,
					Max: 28
				},
				Control: {
					Circulatory: [10, 50],
					Drain: '10 Days'
				}
			}
		};

/*{

	Save: function() {
		fs.writeFile('Target.json', JSON.stringify(thi), function(err) {
			if (err) throw err;
			console.log('It\'s saved!');
		});
	},
	Get: function() {
		var t = 
		return t; //extend(module.exports , JSON.parse(fs.readFileSync('Target.json')));
	}
};*/