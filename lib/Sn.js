var h = require('../lib/Hardware'),
	c = require('../lib/Config'),

function Sn() {
	this.ph = require('../lib/Ph');
	this.mixing = function() {
		h.SN.Control.Mixing.on(c.mixingDuraton * 60 * 1000);
	}
	Object.defineProperties(this, {
		waterLevel: {
			get: function() {
				return  h.SN.Water.Value.toFixed(1);
			}
		}
	});

}
module.exports = new Sn();