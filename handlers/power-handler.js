'use strict';

const utils = require('../libs/utils');
const res = require('../libs/responses');

module.exports = function powerHandler(hass, request) {
    const correlationToken = request.directive.header.correlationToken;
    const directive = request.directive.header.name || 'unknown';

	let endpointId = request.directive.endpoint.endpointId.substr(request.directive.endpoint.endpointId.indexOf("-") + 1);

    return hass.getById(endpointId)
        .then((device) => changePower(device, directive, hass))
        .then((props) => res.createResponseObj(props, endpointId, correlationToken));
};

function changePower(device, directive, hass) {
    if (directive !== 'TurnOn' && directive !== 'TurnOff') {
        return Promise.reject(utils.error('INVALID_DIRECTIVE', `Unsupported directive: ${directive}`));
    }

    switch (device.type) {
		case 'light': return turnLight(device, directive, hass);
		case 'cover': return turnCover(device, directive, hass);
		case 'switch': return turnSwitch(device, directive, hass);
		default:
            return Promise.reject(utils.error('INVALID_DIRECTIVE', `Unsupported device type ${device.type}`));
    }
}

function turnLight(device, directive, hass) {
    let action = null;
    if (directive === 'TurnOn') {
        action = hass.turnLightOn(device).then(() => 1);
    }
    else if (directive === 'TurnOff') {
        action = hass.turnLightOff(device).then(() => 0);
    }

    return action
        .then((state) => {
            return [
                res.createContextProperty('Alexa.EndpointHealth', 'connectivity', {value: 'OK'}),
                res.createContextProperty('Alexa.PowerController', 'powerState', Number(state) === 1 ? 'ON' : 'OFF', 1000)
            ];
    });
}

function turnCover(device, directive, hass) {
    let action = null;
    if (directive === 'TurnOn') {
        action = hass.turnCoverOn(device).then(() => 1);
    }
    else if (directive === 'TurnOff') {
        action = hass.turnCoverOff(device).then(() => 0);
    }

    return action
        .then((state) => {
            return [
                res.createContextProperty('Alexa.EndpointHealth', 'connectivity', {value: 'OK'}),
                res.createContextProperty('Alexa.PowerController', 'powerState', Number(state) === 1 ? 'ON' : 'OFF', 1000)
            ];
    });
}

function turnSwitch(device, directive, hass) {
    let action = null;
    if (directive === 'TurnOn') {
        action = hass.turnSwitchOn(device).then(() => 1);
    }
    else if (directive === 'TurnOff') {
        action = hass.turnSwitchOff(device).then(() => 0);
    }

    return action
        .then((state) => {
            return [
                res.createContextProperty('Alexa.EndpointHealth', 'connectivity', {value: 'OK'}),
                res.createContextProperty('Alexa.PowerController', 'powerState', Number(state) === 1 ? 'ON' : 'OFF', 1000)
            ];
    });
}
