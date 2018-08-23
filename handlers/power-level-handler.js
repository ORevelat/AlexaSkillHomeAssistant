'use strict';

const utils = require('../libs/utils');
const res = require('../libs/responses');

module.exports = function powerLevelHandler(hass, request) {
	const correlationToken = request.directive.header.correlationToken;
	const directive = request.directive.header.name || 'unknown';
	const payload = request.directive.payload;
	
	const [endpointType, endpointId] = request.directive.endpoint.endpointId.split('-');

	return hass.getById(endpointId)
        .then((device) => changePower(device, directive, payload, hass))
        .then((props) => res.createResponseObj(props, endpointId, correlationToken));
}

function changePower(device, directive, payload, hass) {
	if (device.type !== 'dimmer') {
		return Promise.reject(utils.error('INVALID_VALUE', `Directive is not supported for this device: ${device.id}`));
	}

	// Set or Adjust
	let action = null;
	if (directive === 'SetPowerLevel') {
		action = setPowerLevel(device, payload, hass);
	}
	else if (directive === 'AdjustPowerLevel') {
		action = adjustPowerLevel(device, payload, hass);
	}
	else {
	  return Promise.reject(utils.error('INVALID_DIRECTIVE', `Unsupported directive: ${directive}`));
  }

  return action
  	.then((level) => {
		return [
			res.createContextProperty('Alexa.EndpointHealth', 'connectivity', {value: 'OK'}),
			res.createContextProperty('Alexa.PowerLevelController', 'powerLevel', Number(level), 1000)
		];
	});
}

function setPowerLevel(device, payload, hass) {
	return hass.setLightPercent(device, utils.clamp(payload.powerLevel, 0, 100))
	  		.then(() => payload.brightness);
}

function adjustPowerLevel(device, payload, hass) {
	return hass.setLightPercent(device.cmd.dim)
		.then((level) => {
			const powerLevel = utils.clamp(Number(level) + payload.powerLevelDelta, 0, 100);
			return hass.dimLight(device, powerLevel).then(() => powerLevel);
		});
}
