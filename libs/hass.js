'use strict';

const utils = require('./utils');
const request = require('./request');

class Hass {
    constructor(cfg = {}) {
        this.Config = {
            host: cfg.config.hass.host,
            port: cfg.config.hass.port,
            path: cfg.config.hass.path,
            apikey: cfg.config.hass.apikey,
            api: {
                turn_on: cfg.config.api.turn_on,
                turn_off: cfg.config.api.turn_off,
                light_set: cfg.config.api.light_set,
                state: cfg.config.api.state,
            }
        };
        this.Commands = cfg.config.cmds;
    }

    getById(deviceId) {
        const device = this.Commands.find((c) => c.id == deviceId);
        if (!device) {
            return Promise.reject(utils.error('NO_SUCH_ENDPOINT', `The device was not found: ${deviceId}`));
        }
        return Promise.resolve(device);
    }

    getServerInfo() {
        return Promise.resolve(this.Config);
    }

    getControllerInfo() {
        return Promise.resolve(this.Commands);
    }

    getDeviceStatus(device, istemp = false) {
        return this.getServerInfo()
            .then((cfg) => {
                return request({
                        host: cfg.host,
                        port: cfg.port,
                        path: cfg.path + '/' + cfg.api.state + '/' + (istemp ? device.temp_id : device.id),
                        apikey: cfg.apikey,
                        json: true,
                    },
                    'GET',
                    {}
                );
            });
    }

    turnSwitchOn(device) {
        return this.getServerInfo()
            .then((cfg) => {
                return request({
                        host: cfg.host,
                        port: cfg.port,
                        path: cfg.path + '/' + cfg.api.turn_on,
                        apikey: cfg.apikey,
                        json: false,
                    },
                    'POST',
                    {
                        'entity_id': device.id
                    }
                );
            });
    }

    turnSwitchOff(device) {
        return this.getServerInfo()
            .then((cfg) => {
                return request({
                        host: cfg.host,
                        port: cfg.port,
                        path: cfg.path + '/' + cfg.api.turn_off,
                        apikey: cfg.apikey,
                        json: false,
                    },
                    'POST',
                    {
                        'entity_id': device.id
                    }
                );
            });
    }

    setLightPercent(device, percentage) {
        return this.getServerInfo()
        .then((cfg) => {
            return request({
                    host: cfg.host,
                    port: cfg.port,
                    path: cfg.path + '/' + cfg.api.light_set,
                    apikey: cfg.apikey,
                    json: false,
                },
                'POST',
                {
                    'entity_id': device.id,
                    'brightness_pct': percentage
                }
            );
        });
    }
   
}

module.exports = Hass;
