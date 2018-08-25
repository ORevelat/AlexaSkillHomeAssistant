'use strict';

const config = require('./libs/config');
const Hass = require('./libs/hass');
const responses = require('./libs/responses');

const discoveryHandler = require('./handlers/discovery-handler');
const reportStateHandler = require('./handlers/reportstate-handler');
const powerHandler = require('./handlers/power-handler');
const brightnessHandler = require('./handlers/brightness-handler');

const hass = new Hass( {
    config,
});

var callback = function(e, m) {
    console.log(JSON.stringify(m));
};

let request = { 
    directive: {
        header: {
            correlationToken: 'the-token-aabb',
            namespace: 'Alexa.PowerController',
            name: 'TurnOn',
        },
        endpoint: {
            endpointId: 'device-light@fibaro_system_fgd212_dimmer_2_level_18'
        },
        payload: {
        }
    }
};
let context = null;

let handler = discoveryHandler(hass, request, context, callback);
//let handler = reportStateHandler(hass, request, context, callback);
//let handler = powerHandler(hass, request, context, callback);
//let handler = brightnessHandler(hass, request, context, callback);

handler.then((response) => callback(null, response))
        .catch((err) => {
            const correlationToken = request.directive.header.correlationToken;
            const endpointId = request.directive.endpoint && request.directive.endpoint.endpointId;
            callback(null, responses.createErrorResponse(err, correlationToken, endpointId));
});
