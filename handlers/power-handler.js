'use strict';

const utils = require('../libs/utils');
const res = require('../libs/responses');

module.exports = function powerHandler(hass, request) {
    const correlationToken = request.directive.header.correlationToken;
    const directive = request.directive.header.name || 'unknown';

	const endpointId = request.directive.endpoint.endpointId.substr(request.directive.endpoint.endpointId.indexOf("-") + 1);

    return hass.getById(endpointId)
        .then((device) => changePower(device, directive, hass))
        .then((props) => res.createResponseObj(props, endpointId, correlationToken));
};

function changePower(device, directive, hass) {
    let action = null;
    if (directive === 'TurnOn') {
        action = hass.turnSwitchOn(device).then(() => 1);
    }
    else if (directive === 'TurnOff') {
        action = hass.turnSwitchOff(device).then(() => 0);
    }
    else {
        return Promise.reject(utils.error('INVALID_DIRECTIVE', `Unsupported directive: ${directive}`));
    }

    return action
        .then((state) => {
            return [
                res.createContextProperty('Alexa.EndpointHealth', 'connectivity', {value: 'OK'}),
                res.createContextProperty('Alexa.PowerController', 'powerState', Number(state) === 1 ? 'ON' : 'OFF', 1000)
            ];
    });
}
