'use strict';

const utils = require('../libs/utils');
const res = require('../libs/responses');

module.exports = function reportStateHandler(hass, request) {
	const correlationToken = request.directive.header.correlationToken;

	let endpointId = request.directive.endpoint.endpointId.substr(request.directive.endpoint.endpointId.indexOf("-") + 1);

	return hass.getById(endpointId)
		.then((device) => reportState(device, hass))
		.then((props) => res.createResponseObj(props, endpointId, correlationToken, 'Alexa', 'StateReport'));
};

function reportState(device, hass) {
	if (! device.cmd.includes("state"))
		return Promise.reject(utils.error('NO_SUCH_ENDPOINT', `Unknown cmd state for device id=${device.id}`));

	if (device.cmd.includes("temp")) {
		return Promise.all([hass.getDeviceStatus(device), hass.getDeviceStatus(device, true)])
			.then(([dStatus, dTemp]) => createDeviceStateContextProps(device, dStatus, dTemp));
	}

	return hass.getDeviceStatus(device)
		.then((dStatus) => createDeviceStateContextProps(device, dStatus));
}

function createDeviceStateContextProps(device, jsonstate, jsontemp) {
	switch (device.type) {
		case 'light': return createLightContextProps(device, jsonstate, jsontemp);
		case 'cover': return createCoverContextProps(device, jsonstate, jsontemp);
		case 'switch': return createSwitchContextProps(device, jsonstate, jsontemp);
		case 'temp': return createTemperatureSensorContextProps(device, jsonstate);
		default: return [];
	}
}

function createLightContextProps(device, jsonstate, jsontemp) {
	let context = [
		res.createContextProperty('Alexa.EndpointHealth', 'connectivity', {value: 'OK'}),
		res.createContextProperty('Alexa.PowerController', 'powerState', jsonstate.state.toUpperCase()),
	];

	if (jsonstate.state.toUpperCase() == "OFF")
		jsonstate.attributes.brightness = 0;

	context.push(res.createContextProperty('Alexa.BrightnessController', 'brightness', Number(jsonstate.attributes.brightness)));

	if (jsontemp) {
		const temperature = {value: Number(jsontemp.state), scale: 'CELSIUS'};
		context.push(res.createContextProperty('Alexa.TemperatureSensor', 'temperature', temperature));
	}

	return context;
}

function createCoverContextProps(device, jsonstate, jsontemp) {
	if (jsonstate.state.toUpperCase() == 'OPEN')
		jsonstate.state = 'ON';
	else if (jsonstate.state.toUpperCase() == 'CLOSE')
		jsonstate.state = 'OFF';

	let context = [
		res.createContextProperty('Alexa.EndpointHealth', 'connectivity', {value: 'OK'}),
		res.createContextProperty('Alexa.PowerController', 'powerState', jsonstate.state.toUpperCase()),
	];

	if (jsonstate.state.toUpperCase() == "OFF")
		jsonstate.attributes.brightness = 0;

	context.push(res.createContextProperty('Alexa.PowerLevelController', 'level', Number(jsonstate.attributes.current_position)));

	if (jsontemp) {
		const temperature = {value: Number(jsontemp.state), scale: 'CELSIUS'};
		context.push(res.createContextProperty('Alexa.TemperatureSensor', 'temperature', temperature));
	}

	return context;
}

function createSwitchContextProps(device, jsonstate, jsontemp) {
	let context = [
		res.createContextProperty('Alexa.EndpointHealth', 'connectivity', {value: 'OK'}),
		res.createContextProperty('Alexa.PowerController', 'powerState', jsonstate.state.toUpperCase())
	];

	if (jsontemp) {
		const temperature = {value: Number(jsontemp.state), scale: 'CELSIUS'};
		context.push(res.createContextProperty('Alexa.TemperatureSensor', 'temperature', temperature));
	}

	return context;
}

function createTemperatureSensorContextProps(device, jsonstate) {
	const temperature = {value: Number(jsonstate.state), scale: 'CELSIUS'};

	return [
		res.createContextProperty('Alexa.EndpointHealth', 'connectivity', {value: 'OK'}),
		res.createContextProperty('Alexa.TemperatureSensor', 'temperature', temperature)
	];
}
