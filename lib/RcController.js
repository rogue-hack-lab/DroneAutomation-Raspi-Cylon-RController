'use strict'

const Cylon = require('cylon')
const Potentiometer = require('./Potentiometer.js')
const _piblaster = require('pi-blaster.js')
const _ = require('lodash')
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
			reportControls: () => { _.forEach( this.controls, (def, name) => { console.log('def',def,'name',name)} )},
			
			// throttleUp: () => { 
			// 	const throttle = this.controls.throttle
			// 	moveStick( throttle, 1 )
			// },
			// throttleDown: () => { 
			// 	const throttle = this.controls.throttle
			// 	moveStick( throttle, -1 )
			// }
		},

	}),

	this.robot = Cylon.MCP.robots[name],

	this.controls = {
		throttle: new Potentiometer( 27, { origin: 0, returnToOrigin: false }),
		rudder: new Potentiometer( 22, {origin: 0.5, returnToOrigin: true }),
		aileron: new Potentiometer( 17, {origin: 0.5, returnToOrigin: true }),
		elevator: new Potentiometer( 4, {origin: 0.5, returnToOrigin: true })
	},

	_.forEach(this.controls, (def,name) => {
		this.robot.commands[name + '_up'] = () => { moveStick( this.controls[name], this.controls[name].position + this.controls[name].increment ) }
		this.robot.commands[name + '_down'] = () => { moveStick( this.controls[name], this.controls[name].position - this.controls[name].increment ) }
		this.robot.commands[name + '_origin'] = () => { moveStick( this.controls[name], this.controls[name].origin ) }
	})

}

DroneController.prototype.connect = (ip,port) => {
	(port) ? null : port = '3000'
	(ip) ? null : ip = '0.0.0.0'
	Cylon.api('http',	{
		host: ip,
		port: port
	})
}

function moveStick (stick,destination) {
	stick.position = Math.min(Math.max( destination, 0 ), 1 )
	_piblaster.setPwm( stick.pin, destination )
}