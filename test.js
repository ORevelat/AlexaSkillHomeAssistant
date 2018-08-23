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
            namespace: 'Alexa.BrightnessController',
            name: 'SetBrightness',
        },
        endpoint: {
            endpointId: 'device-light.qubino_zmnhjd1_flush_dimmer_pilot_wire_level_2'
        },
        payload: {
            'brightness': 0
        }
    }
};
let context = null;

//let handler = discoveryHandler(hass, request, context, callback);
//let handler = reportStateHandler(hass, request, context, callback);
//let handler = powerHandler(hass, request, context, callback);
let handler = brightnessHandler(hass, request, context, callback);

handler.then((response) => callback(null, response))
        .catch((err) => {
            const correlationToken = request.directive.header.correlationToken;
            const endpointId = request.directive.endpoint && request.directive.endpoint.endpointId;
            callback(null, responses.createErrorResponse(err, correlationToken, endpointId));
});
