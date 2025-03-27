"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const homey_1 = require("homey");
const vanmoofbike_1 = __importDefault(require("../../lib/vanmoofbike"));
const util = require('util');
const setTimeoutPromise = util.promisify(setTimeout);
class vanMoof extends homey_1.Device {
    /**
     * onInit is called when the device is initialized.
     */
    async onInit() {
        this.log('Vanmoof Bike has been initialized');
        const store = this.getStore();
        if (!store || !store.encryptionKey) {
            this.error("Missing store properties, user key id");
            return;
        }
        this.vanmoofBikeInstance = new vanmoofbike_1.default('S1', store.encryptionKey);
        let settingsinterval = this.homey.settings.get('interval');
        if (!settingsinterval || typeof settingsinterval !== 'number' || settingsinterval <= 0) {
            this.log('Invalid interval setting, using default 15 minutes.');
            settingsinterval = 15; // Default interval (15 minutes)
        }
        const scan_interval = settingsinterval * 60 * 1000; // x minutes
        this.log('interval', scan_interval);
        try {
            this.intervalId = this.homey.setInterval(async () => {
                await this.scan();
            }, scan_interval);
        }
        catch (error) {
            this.error("error setting interval", error);
        }
        this.scan(); // Initial scan
    }
    // Get the Device ID
    async scan() {
        const deviceId = this.homey.settings.get('deviceId');
        const store = this.getStore();
        const bike = new vanmoofbike_1.default('S1', store.encryptionKey);
        // Check if the deviceid is known (This is not the same as we get from Vanmoof)
        const knownDeviceId = await this.detirminDeviceId();
        if (!knownDeviceId) {
            this.setUnavailable('Cannot find device ID of the bike, bring closer to Homey and try again');
        }
        else {
            // Get the Device ID
            const deviceId = this.getStoreValue("deviceId");
        }
        // Attempt a connection
        this.log(`Trying to connect to bike with ID ${deviceId}`);
        const bikeConnection = await this.connectToBike(deviceId);
        if (bikeConnection) {
            // const authenticate = await bike.authenticate(bikeConnection)
            const parameters = await bike.getParameters(bikeConnection);
            //this.log('battery level', parameters)
            // Distance
            const distance = parameters[11] + (parameters[12] << 8) + (parameters[13] << 16) + (parameters[14] << 24);
            const distance1 = distance / 10;
            //this.log('distance', distance1);
            this.setCapabilityValue('distance', distance1);
            // Battery  
            const batterylevel = parameters[5];
            this.log('battery', batterylevel);
            this.setCapabilityValue('measure_battery', batterylevel);
            //Module Battery
            const modulelevel = parameters[6];
            this.log('modulelevel', modulelevel);
            this.setCapabilityValue('measure_module', modulelevel);
            // Module State
            const modulestate = parameters[2];
            if (modulestate == 0) {
                this.setCapabilityValue('modulestate', ('ON'));
            }
            else if (modulestate == 1) {
                this.setCapabilityValue('modulestate', ('OFF'));
            }
            else if (modulestate == 2) {
                this.setCapabilityValue('modulestate', ('SHIPPING'));
            }
            else if (modulestate == 3) {
                this.setCapabilityValue('modulestate', ('STANDBY'));
            }
            else if (modulestate == 4) {
                this.setCapabilityValue('modulestate', ('ALARM ONE'));
            }
            else if (modulestate == 5) {
                this.setCapabilityValue('modulestate', ('ALARM TWO'));
            }
            else if (modulestate == 6) {
                this.setCapabilityValue('modulestate', ('ALARM THREE'));
            }
            else if (modulestate == 7) {
                this.setCapabilityValue('modulestate', ('SLEEPING'));
            }
            else if (modulestate == 8) {
                this.setCapabilityValue('modulestate', ('TRACKING'));
            }
            //this.log('modulestate', modulestate);
            // Lock state
            const lockstate = parameters[3];
            if (lockstate == 0) {
                this.setCapabilityValue('lockstate', ('UNLOCKED'));
            }
            else if (lockstate == 1) {
                this.setCapabilityValue('lockstate', ('LOCKED'));
            }
            // Region
            const region = parameters[9];
            if (region == 0) {
                this.setCapabilityValue('region', ('UNSUPPORTED'));
            }
            else if (region == 1) {
                this.setCapabilityValue('region', ('EU'));
            }
            else if (region == 2) {
                this.setCapabilityValue('region', ('US'));
            }
            else if (region == 3) {
                this.setCapabilityValue('region', ('OFFROAD'));
            }
            else if (region == 4) {
                this.setCapabilityValue('region', ('JAPAN'));
            }
            // Lights
            const lightlevel = parameters[7];
            if (lightlevel == 0) {
                this.setCapabilityValue('lights', ('AUTO'));
            }
            else if (lightlevel == 1) {
                this.setCapabilityValue('lights', ('ON'));
            }
            else if (lightlevel == 2) {
                this.setCapabilityValue('lights', ('OFF'));
            }
            else if (lightlevel == 3) {
                this.setCapabilityValue('lights', ('REAR FLASH'));
            }
            else if (lightlevel == 4) {
                this.setCapabilityValue('lights', ('REAR FLASH OFF'));
            }
            //this.log('Ligh Level', lightlevel);
            // Power level
            const powerlevel = parameters[8];
            this.setCapabilityValue('powerlevel', powerlevel);
            //this.log('Power Level', powerlevel);
            // Error Code
            const error = (parameters[15] & 248) >> 3;
            //this.log('error', error);
            this.setCapabilityValue('error', error);
            //Last Poll
            var currentdate = new Date();
            var datetime = currentdate.getMinutes();
            this.setCapabilityValue('lastpoll', datetime);
            this.setCapabilityValue('alarm_generic', false);
            //Charging
            const batterycharging = (parameters[15] & 1);
            // this.log('batterycharging', batterycharging);
            if (batterycharging == 0) {
                this.setCapabilityValue('batterycharging', ('OFF'));
            }
            else if (batterycharging == 1) {
                this.setCapabilityValue('batterycharging', ('CHARGING'));
            }
        }
        else {
            //this.log('Could not connect to bike scan');
            this.setCapabilityValue('alarm_generic', true);
            //this.restartDevice()
            throw new Error('Could not connect to bike scan');
            //this.setUnavailable('Could not connect to bike unavailable')
        }
    }
    async connectToBike(deviceID) {
        try {
            const advertisement = await this.homey.ble.find(deviceID);
            const bikeConnection = await advertisement.connect();
            if (bikeConnection) {
                this.log('Connected to bike');
                return bikeConnection;
            }
            else {
                this.log('Could not connect to bike connecttoBike');
                //const bikeDisConnection = await bikeConnection.disconnect();
                this.setCapabilityValue('alarm_generic', true);
                //this.restartDevice()
                //throw new Error('Could not connect to bike after connect to bike')
            }
        }
        catch (error) {
            this.log(error);
        }
    }
    async detirminDeviceId() {
        try {
            this.log('detirmindeviceID');
            const data = this.getData();
            const settings = this.getSettings();
            const advertisements = await this.homey.ble.discover();
            const filteredAdvertisements = advertisements.filter(advertisement => { var _a; return (_a = advertisement.localName) === null || _a === void 0 ? void 0 : _a.endsWith(data.uuid.toUpperCase()); });
            if (settings.deviceId === undefined) {
                if (filteredAdvertisements.length === 0) {
                    this.log('No device ID found');
                    return false;
                }
                else {
                    this.log(`Found device ID - ${filteredAdvertisements[0].id}`);
                    this.homey.settings.set('deviceId', filteredAdvertisements[0].id);
                    return true;
                }
            }
            else {
                this.log(`Device ID already known as ${settings.deviceId}`);
                return true;
            }
        }
        catch (error) {
            this.log(error);
        }
    }
    /**
     * onAdded is called when the user adds the device, called just after pairing.
     */
    async onAdded() {
        this.log('Vanmoof Bike has been added');
        //  const knownDeviceId = await this.detirminDeviceId()
        //  if (!knownDeviceId) {
        //    this.setUnavailable('Cannot find device ID onadded of the bike, bring closer to Homey and try again')
        //  }
    }
    /**
     * onSettings is called when the user updates the device's settings.
     * @param {object} event the onSettings event data
     * @param {object} event.oldSettings The old settings object
     * @param {object} event.newSettings The new settings object
     * @param {string[]} event.changedKeys An array of keys changed since the previous version
     * @returns {Promise<string|void>} return a custom message that will be displayed
     */
    async onSettings({ oldSettings: {}, newSettings: {}, changedKeys: {} }) {
        this.log('Vanmoof Bike settings where changed');
        this.restartDevice();
    }
    async restartDevice() {
        //const dly = 360000;
        const dly = 60000;
        this.homey.clearInterval(this.scan);
        this.log(`Device will restart in ${dly / 1000} seconds`);
        // this.setUnavailable('Device is restarting. Wait a few minutes!');
        //await setTimeoutPromise(dly).then(() => this.scan());    
        await setTimeoutPromise(dly).then(() => this.onInit());
    }
    /**
     * onRenamed is called when the user updates the device's name.
     * This method can be used this to synchronise the name to the device.
     * @param {string} name The new name
     */
    async onRenamed(name) {
        this.log('Vanmoof Bike was renamed');
    }
    /**
     * onDeleted is called when the user deleted the device.
     */
    async onDeleted() {
        this.log('Vanmoof has been deleted');
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}
module.exports = vanMoof;
//# sourceMappingURL=device.js.map