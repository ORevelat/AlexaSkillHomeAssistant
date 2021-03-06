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
		token: 'very_secret_token',
	},
	api: {
		turn_on: 'services/switch/turn_on',
		turn_off: 'services/switch/turn_off',
		light_on: 'services/light/turn_on',
		light_off: 'services/light/turn_off',
		cover_open: 'services/cover/open_cover',
		cover_close: 'services/cover/close_cover',
		cover_set: 'services/cover/set_cover_position',
		remote_on: 'services/remote/turn_on',
		remote_off: 'services/remote/turn_off',
		state: 'states'
	},
	cmds: [
		/*
		{
			name: 'definition
			type: 'switch' / 'light' / 'cover' / 'remote'
			description: 'description of definition'
			categories: 'SWITCH' / 'LIGHT' / 'TEMPERATURE_SENSOR' / 'TV' see alexa skill kit doc.
			id: 'light.xxxxx',
			[temp_id: 'sensor.xxxxx',]	// if temp sensor also available for same room/device
			cmd: [ 'state', ['temp']],
			[data: {activity: 'Watch TV'}]
		}
		*/
		{
			name: 'Prise',
			type: 'switch',
			description: 'Prise bureau avec température de la pièce',
			categories: 'SWITCH',
			id: 'switch.neo_coolcam_power_plug_12a_switch',
			temp_id: 'sensor.oregontemphygro_728f5_temp',
			cmd: [ 'state', 'temp' ]
		},
    ]
};
