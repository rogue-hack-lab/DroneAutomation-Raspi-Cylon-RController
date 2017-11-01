'use strict'

const Cylon = require('cylon')
const Potentiometer = require('./Potentiometer.js')

/**
 * A grouping of controls that sends output instructions through CylonJS to Raspberry Pi GPIO
 */
module.exports = DroneController

function DroneController(name) {
	this.id = 0

	Cylon.robot({
		name: name,

		connections: {
			raspi: { adaptor: 'raspi' },
		},

		devices: {
			led:      { driver: 'led', pin: 37 },

			throttle:	{ driver: 'servo', pin: 27 },
			rudder:   { driver: 'servo', pin: 22 },
			aileron:  { driver: 'servo', pin: 4 },
			elevator: { driver: 'servo', pin: 17 },
		},

		work: () => {},

		commands: {
			test: (pack) => {console.log('received:',pack) }
		},

	})

	this.controls = {
		throttle: new Potentiometer( Cylon.throttle,{ origin: 0, returnToOrigin: false }),
		rudder: new Potentiometer( Cylon.rudder,{origin: 0.5, returnToOrigin: true }),
		aileron: new Potentiometer( Cylon.aileron,{origin: 0.5, returnToOrigin: true }),
		elevator: new Potentiometer( Cylon.elevator,{origin: 0.5, returnToOrigin: true })
	}
}

DroneController.prototype.connect = (ip,port) => {
	(port) ? null : port = '3000'
	(ip) ? null : ip = '0.0.0.0'
	Cylon.api('http',	{
		host: ip,
		port: port
	})
}

DroneController.prototype.start = () => {	Cylon.start() }