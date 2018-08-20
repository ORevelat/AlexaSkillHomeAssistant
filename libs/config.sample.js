'use strict';

/* 
    ===========================
    === rename to config.js ===
    ===========================
*/

module.exports = {
    hass: {
		port: 80,
		host: 'my-domotique.google.com',
		path: '/api',
		apikey: 'very_secret_pwd',
	},
	api: {
		turn_on: 'services/switch/turn_on',
		turn_off: 'services/switch/turn_off',
		state: 'states'
	},
	cmds: [
		{
			name: 'Prise',
			type: 'switch',
			description: 'Prise bureau avec température de la pièce',
			categories: 'SWITCH',
			id: 'switch.neo_coolcam_power_plug_12a_switch',
			temp_id: 'sensor.oregontemphygro_728f5_temp',
			cmd: [ 'on', 'off', 'state', 'temp' ]
		},
    ]
};
