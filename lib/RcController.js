'use strict'

const Cylon = require('cylon')
const Potentiometer = require('./Potentiometer.js')
const _piblaster = require('pi-blaster.js')

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

			// throttle:	{ driver: 'direct-pin', pin: 13 },
			// rudder:   { driver: 'direct-pin', pin: 15 },
			// aileron:  { driver: 'direct-pin', pin: 11 },
			// elevator: { driver: 'direct-pin', pin: 7 },
		},

		work: (my) => {
			every((1).second(), my.led.toggle)
		},

		commands: {
			reportControls: () => { console.log( this.controls )},
			throttleUp: () => { 
				const throttle = this.controls.throttle
				moveStick( throttle, 1 )
			},
			throttleDown: () => { 
				const throttle = this.controls.throttle
				moveStick( throttle, -1 )
			}
		},
		
	}),

	this.robot = Cylon.MCP.robots[name],

	this.controls = {
		throttle: new Potentiometer( 27, { origin: 0, returnToOrigin: false }),
		rudder: new Potentiometer( 22, {origin: 0.5, returnToOrigin: true }),
		aileron: new Potentiometer( 17, {origin: 0.5, returnToOrigin: true }),
		elevator: new Potentiometer( 4, {origin: 0.5, returnToOrigin: true })
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

function moveStick (stick,direction) {
	stick.position += (stick.increment * Math.sign(direction))
	_piblaster.setPwm( stick.pin, stick.position )
}