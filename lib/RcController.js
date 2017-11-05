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
		},

		work: (my) => {
			every((1).second(), my.led.toggle)
		},

		commands: {
			report_controls: () => { _.forEach( this.controls, (def, name) => { console.log('def',def,'name',name)} )},
			set: (t,r,a,e) => {
				return moveAllSticks(this,t,r,a,e)
			},
			get: () => {
				return [
					this.controls.throttle.position,
					this.controls.rudder.position,
					this.controls.aileron.position,
					this.controls.elevator.position
				]
			},
			kill: () => {
				return moveAllSticks(this,
					this.controls.throttle.origin,
					this.controls.rudder.origin,
					this.controls.aileron.origin,
					this.controls.elevator.origin
				)
			}
		}
	}),


	this.robot = Cylon.MCP.robots[name],

	this.controls = {
		throttle: new Potentiometer( 27, { origin: 0, returnToOrigin: false }),
		rudder: new Potentiometer( 22, {origin: 0.5, returnToOrigin: true, deadzone: { min: 0.4, max: 0.6 } }),
		aileron: new Potentiometer( 17, {origin: 0.5, returnToOrigin: true }),
		elevator: new Potentiometer( 4, {origin: 0.5, returnToOrigin: true })
	},

	_.forEach(this.controls, (def,name) => {
		this.robot.commands[name + '_up'] = () => { return moveStick( this.controls[name], this.controls[name].position + this.controls[name].increment ) }
		this.robot.commands[name + '_down'] = () => { return moveStick( this.controls[name], this.controls[name].position - this.controls[name].increment ) }
		this.robot.commands[name + '_origin'] = () => { return moveStick( this.controls[name], this.controls[name].origin ) }
		this.robot.commands[name + '_set'] = (value) => { return moveStick(this.controls[name], value) }
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
	var setLimits = Math.min(Math.max(destination, stick.range.min ), stick.range.max )
	var ignoreDeadzone = (stick.deadzone.min <= setLimits && setLimits <= stick.deadzone.max) ? ignoreDeadzone = stick.origin : ignoreDeadzone = setLimits
	stick.position = ignoreDeadzone
	_piblaster.setPwm( stick.pin, destination )
	return stick.position
}

function moveAllSticks (robot,t,r,a,e) {
	return[
		moveStick ( robot.controls.throttle, t ),
		moveStick ( robot.controls.rudder, r ),
		moveStick ( robot.controls.aileron, a ),
		moveStick ( robot.controls.elevator, e )
	]
}