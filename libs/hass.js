'use strict';

const utils = require('./utils');
const request = require('./request');

class Hass {
    constructor(cfg = {}) {
        this.Config = {
            host: cfg.config.hass.host,
            port: cfg.config.hass.port,
            path: cfg.config.hass.path,
            token: cfg.config.hass.token,
            api: {
                turn_on: cfg.config.api.turn_on,
                turn_off: cfg.config.api.turn_off,
                light_on: cfg.config.api.light_on,
                light_off: cfg.config.api.light_off,
                cover_open: cfg.config.api.cover_open,
                cover_close: cfg.config.api.cover_close,
                cover_set: cfg.config.api.cover_set,
                remote_on: cfg.config.api.remote_on,
                remote_off: cfg.config.api.remote_off,
                state: cfg.config.api.state,
            }
        };
        this.Commands = cfg.config.cmds;
    }

    getById(deviceId) {
        const id = deviceId.replace("@", ".");
        const device = this.Commands.find((c) => c.id == id);
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
                        token: cfg.token,
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
                        token: cfg.token,
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
                        token: cfg.token,
                        json: false,
                    },
                    'POST',
                    {
                        'entity_id': device.id
                    }
                );
            });
    }

    turnLightOn(device) {
        return this.getServerInfo()
            .then((cfg) => {
                return request({
                        host: cfg.host,
                        port: cfg.port,
                        path: cfg.path + '/' + cfg.api.light_on,
                        token: cfg.token,
                        json: false,
                    },
                    'POST',
                    {
                        'entity_id': device.id,
                    }
                );
            });
    }

    turnLightOff(device) {
        return this.getServerInfo()
            .then((cfg) => {
                return request({
                        host: cfg.host,
                        port: cfg.port,
                        path: cfg.path + '/' + cfg.api.light_off,
                        token: cfg.token,
                        json: false,
                    },
                    'POST',
                    {
                        'entity_id': device.id,
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
                        path: cfg.path + '/' + cfg.api.light_on,
                        token: cfg.token,
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

    getLightPercent(device) {
        return this.getDeviceStatus(device)
            .then((status) => {
                return parseInt(status.attributes.brightness * 100 / 255);
            });
    }

    turnCoverOn(device, position) {
        return this.getServerInfo()
            .then((cfg) => {
                return request({
                        host: cfg.host,
                        port: cfg.port,
                        path: cfg.path + '/' + cfg.api.cover_open,
                        token: cfg.token,
                        json: false,
                    },
                    'POST',
                    {
                        'entity_id': device.id,
                    }
                );
            });
    }

    turnCoverOff(device, position) {
        return this.getServerInfo()
            .then((cfg) => {
                return request({
                        host: cfg.host,
                        port: cfg.port,
                        path: cfg.path + '/' + cfg.api.cover_close,
                        token: cfg.token,
                        json: false,
                    },
                    'POST',
                    {
                        'entity_id': device.id,
                    }
                );
            });
    }

    setCoverPosition(device, position) {
        return this.getServerInfo()
            .then((cfg) => {
                return request({
                        host: cfg.host,
                        port: cfg.port,
                        path: cfg.path + '/' + cfg.api.cover_set,
                        token: cfg.token,
                        json: false,
                    },
                    'POST',
                    {
                        'entity_id': device.id,
                        'position': position
                    }
                );
            });
    }

    getCoverPosition(device) {
        return this.getDeviceStatus(device)
            .then((status) => {
                return parseInt(status.attributes.current_position);
            });
    }
   
    turnRemoteOn(device) {
        return this.getServerInfo()
            .then((cfg) => {
                return request({
                        host: cfg.host,
                        port: cfg.port,
                        path: cfg.path + '/' + cfg.api.remote_on,
                        token: cfg.token,
                        json: false,
                    },
                    'POST',
                    {
                        'entity_id': device.id,
                        'activity': device.data.activity
                    }
                );
            });
    }

    turnRemoteOff(device) {
        return this.getServerInfo()
            .then((cfg) => {
                return request({
                        host: cfg.host,
                        port: cfg.port,
                        path: cfg.path + '/' + cfg.api.remote_off,
                        token: cfg.token,
                        json: false,
                    },
                    'POST',
                    {
                        'entity_id': device.id,
                    }
                );
            });
    }
}

module.exports = Hass;
