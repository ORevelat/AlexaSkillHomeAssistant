'use strict';

const utils = require('../libs/utils');
const res = require('../libs/responses');

module.exports = function discoveryHandler(hass) {
	return hass.getControllerInfo()
	  .then((results) => collectEndpoints(results))
	  .then((endpoints) => res.createDiscoveryResponseObj(endpoints));
};

function collectEndpoints(results) {
	let endpoints = [];
	
	results.forEach((device) => {
		endpoints.push(createEndpointFromDevice(device));
	});

	return endpoints.filter((e) => e);
}

function createEndpointFromDevice(device) {
	switch (device.type)
	{
		case 'light':
			return createLightEndpoint(device);
		case 'cover':
			return createCoverEndpoint(device);
		case 'switch':
			return createSwitchEndpoint(device);
		case 'temp':
			return createTemperatureSensorEndpoint(device);
		case 'remote':
			return createRemoteEndpoint(device);
		default:
			return null;
	}
}

function createLightEndpoint(device) {
	const endpoint = createStandardDeviceEndpointProps(device);
	endpoint.capabilities = [
		createDiscoveryCapability('Alexa'),
		createDiscoveryCapability('Alexa.EndpointHealth', ['connectivity']),
		createDiscoveryCapability('Alexa.PowerController', ['powerState']),
	];

	endpoint.capabilities.push(createDiscoveryCapability('Alexa.BrightnessController', ['brightness']));

	// if we have temperature sensor add it
	// allow to say 
	//    alexa turn on the living room
	//    alexa what is the temperature in the living room
	if (device.cmd.includes("temp")) {
		endpoint.capabilities.push(createDiscoveryCapability('Alexa.TemperatureSensor', ['temperature']));
	}

	return endpoint;
}

function createCoverEndpoint(device) {
	const endpoint = createStandardDeviceEndpointProps(device);
	endpoint.capabilities = [
		createDiscoveryCapability('Alexa'),
		createDiscoveryCapability('Alexa.EndpointHealth', ['connectivity']),
		createDiscoveryCapability('Alexa.PowerController', ['powerState']),
	];

 	endpoint.capabilities.push(createDiscoveryCapability('Alexa.PowerLevelController', ['powerLevel']));

	// if we have temperature sensor add it
	// allow to say 
	//    alexa turn on the living room
	//    alexa what is the temperature in the living room
	if (device.cmd.includes("temp")) {
		endpoint.capabilities.push(createDiscoveryCapability('Alexa.TemperatureSensor', ['temperature']));
	}

	return endpoint;
}

function createSwitchEndpoint(device) {
	const endpoint = createStandardDeviceEndpointProps(device);
	endpoint.capabilities = [
		createDiscoveryCapability('Alexa'),
		createDiscoveryCapability('Alexa.EndpointHealth', ['connectivity']),
		createDiscoveryCapability('Alexa.PowerController', ['powerState'])
	];

	// if we have temperature sensor add it
	if (device.cmd.includes("temp")) {
		endpoint.capabilities.push(createDiscoveryCapability('Alexa.TemperatureSensor', ['temperature']));
	}
	
	return endpoint;
}

function createTemperatureSensorEndpoint(device) {
	const endpoint = createStandardDeviceEndpointProps(device);
	endpoint.capabilities = [
		createDiscoveryCapability('Alexa'),
		createDiscoveryCapability('Alexa.EndpointHealth', ['connectivity']),
		createDiscoveryCapability('Alexa.TemperatureSensor', ['temperature']),
	];

	return endpoint;
}

function createRemoteEndpoint(device) {
	const endpoint = createStandardDeviceEndpointProps(device);
	endpoint.capabilities = [
		createDiscoveryCapability('Alexa'),
		createDiscoveryCapability('Alexa.EndpointHealth', ['connectivity']),
		createDiscoveryCapability('Alexa.PowerController', ['powerState']),
		createDiscoveryCapability('Alexa.Speaker', ['volume', 'muted']),
		createDiscoveryCapability('Alexa.ChannelController', ['channel']),
	];

	return endpoint;
}

function createStandardDeviceEndpointProps(device) {
	const id = device.id.replace(".", "@");
	return {
		endpointId: `device-${id}`,
		manufacturerName: 'home assistant',
		friendlyName: sanitizeFriendlyName(device.name),
		description: device.description,
		displayCategories: [device.categories],
		cookie: {
			room: device.roomName || 'none'
		}
	};
}

function createDiscoveryCapability(iface, supported) {
	const capability = {
	  type: 'AlexaInterface',
	  interface: iface,
	  version: '3'
	};
	if (supported) {
	  capability.properties = {
		supported: supported.map((s) => ({name: s})),
		retrievable: true,
		proactivelyReported: false
	  };
	}
	return capability;
}

function sanitizeFriendlyName(name) {
	return name.replace(/[-_]/g, ' ').replace(/[^a-zA-Z0-9 ]/g, '');
}
