// process.env.NODE_ENV = 'test'

// const Cylon = require('cylon')
// Cylon.config({ testMode: true })
// require('./testbot.js')
// let robot = Cylon.MCP.robots['TestBot']

// const Potentiometer = require('../src/Potentiometer.js')
// let pot = {}

// beforeEach(() => {
// 	robot = Cylon.MCP.robots['TestBot']
// 	pot = new Potentiometer(robot.led)
// })

test.skip('create a potentiometer instance',()=>{
	expect(typeof(pot)).toBe('object')
})

test.skip('position to start at default and move as instructed',()=>{
	expect(pot.defaults.position).toBe(0)
	expect(pot.position).toBe(pot.defaults.position)
	pot.position = 0.5
	expect(pot.postion).not.toBe(pot.defaults.position)
})

test.skip('cylon.led.pin is accessible',()=>{
	console.log(robot)
	expect(pot.device.pin).toBe(1)
})

