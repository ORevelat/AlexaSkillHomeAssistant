'use strict';

const config = require('./libs/config');
const Hass = require('./libs/hass');
const responses = require('./libs/responses');

const discoveryHandler = require('./handlers/discovery-handler');
const reportStateHandler = require('./handlers/reportstate-handler');
const powerHandler = require('./handlers/power-handler');
const brightnessHandler = require('./handlers/brightness-handler');
const powerlevelHandler = require('./handlers/power-level-handler');

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
            namespace: 'Alexa.PowerLevelController',
            name: 'SetPowerLevel',
        },
        endpoint: {
            endpointId: 'device-cover@fibaro_system_fgrm222_roller_shutter_controller_2_level_3'
        },
        payload: {
            powerLevel: 100
        }
    }
};
let context = null;

//let handler = discoveryHandler(hass, request, context, callback);
//let handler = reportStateHandler(hass, request, context, callback);
//let handler = powerHandler(hass, request, context, callback);
//let handler = brightnessHandler(hass, request, context, callback);
let handler = powerlevelHandler(hass, request, context, callback);

handler.then((response) => callback(null, response))
        .catch((err) => {
            const correlationToken = request.directive.header.correlationToken;
            const endpointId = request.directive.endpoint && request.directive.endpoint.endpointId;
            callback(null, responses.createErrorResponse(err, correlationToken, endpointId));
});
