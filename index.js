'use strict'
const RcController = require('./lib/RcController.js')
const Drone = new RcController('Drone')

Drone.connect('0.0.0.0','3000')
Drone.robot.start()