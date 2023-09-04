import { Device, SimpleClass } from 'homey';
import vanmoofbike from '../../lib/vanmoofbike';


class vanMoof extends Device {
  /**
   * onInit is called when the device is initialized.
   */
  async onInit () {
    this.log('Vanmoof Bike has been initialized')
    const store = this.getStore()
    const bike = new vanmoofbike('S1', store.encryptionKey, store.userKeyId)


    // Check if the deviceid is known (This is not the same as we get from Vanmoof)
    // const knownDeviceId = await this.detirminDeviceId()
     //if (!knownDeviceId) {
       //this.setUnavailable('Cannot find device ID of the bike, bring closer to Homey and try again')
    // }
    
    // Get the Device ID
    //const deviceId = this.homey.settings.get('deviceId');
    // MANUALLY PUT DEVICE ID HERE!!!
    const deviceId = '5xxx';

    // Attempt a connection
    this.log(`Trying to connect to bike with ID ${deviceId}`)
    const bikeConnection = await this.connectToBike(deviceId)
    if (bikeConnection) {
      await bike.authenticate(bikeConnection)

      //const message = await this.vanMoofLib.readFromBike(bikeConnection, '8e7f1a50-087a-44c9-b292-a2c628fdd9aa', '8e7f1a54-087a-44c9-b292-a2c628fdd9aa')
      //this.log(message)
      const motorBatteryLevel = await bike.getMotorBatteryLevel(bikeConnection)
      this.log('battery level', motorBatteryLevel)
      // Distance
      const distance = motorBatteryLevel[11] + (motorBatteryLevel[12] << 8) + (motorBatteryLevel[13] << 16) + (motorBatteryLevel[14] << 24);
      const distance1 = distance / 10;
      this.log('distance', distance1);
      this.setCapabilityValue('distance', distance1);

      // Battery  
      const batterylevel = motorBatteryLevel[5]
      this.log('battery', batterylevel);
      this.setCapabilityValue('measure_battery', batterylevel);
      //Module Battery
      const modulelevel = motorBatteryLevel[6]
      this.log('modulelevel', modulelevel);
      this.setCapabilityValue('measure_module', modulelevel);
      // Module State
      const modulestate = motorBatteryLevel[2]
      if (modulestate == 0) {
        this.setCapabilityValue('modulestate', ('ON'));
      } else if (modulestate == 1) {
        this.setCapabilityValue('modulestate', ('OFF'));
      } else if (modulestate == 2) {
        this.setCapabilityValue('modulestate', ('SHIPPING'));
      } else if (modulestate == 3) {
        this.setCapabilityValue('modulestate', ('STANDBY'));
      } else if (modulestate == 4) {
        this.setCapabilityValue('modulestate', ('ALARM ONE'));
      } else if (modulestate == 5) {
        this.setCapabilityValue('modulestate', ('ALARM TWO'));
      } else if (modulestate == 6) {
        this.setCapabilityValue('modulestate', ('ALARM THREE'));
      } else if (modulestate == 7) {
        this.setCapabilityValue('modulestate', ('SLEEPING'));    
      } else if (modulestate == 8) {
        this.setCapabilityValue('modulestate', ('TRACKING'));   
      } 
      // Lock state
      const lockstate = motorBatteryLevel[3]
      if (lockstate == 0) {
        this.setCapabilityValue('lockstate', ('UNLOCKED'));
      } else if (lockstate == 1) {
        this.setCapabilityValue('lockstate', ('LOCKED'));
      } 
       // Region
       const region = motorBatteryLevel[9]
       if (region == 0) {
         this.setCapabilityValue('region', ('UNSUPPORTED'));
       } else if (region == 1) {
         this.setCapabilityValue('region', ('EU'));
       } else if (region == 2) {
         this.setCapabilityValue('region', ('US'));
       } else if (region == 3) {
         this.setCapabilityValue('region', ('OFFROAD'));
       } else if (region == 4) {
         this.setCapabilityValue('region', ('JAPAN'));
       } 
      // Lights
      const lightlevel = motorBatteryLevel[7]
      if (lightlevel == 0) {
        this.setCapabilityValue('lights', ('AUTO'));
      } else if (lightlevel == 1) {
        this.setCapabilityValue('lights', ('ON'));
      } else if (lightlevel == 2) {
        this.setCapabilityValue('lights', ('OFF'));
      } else if (lightlevel == 3) {
        this.setCapabilityValue('lights', ('REAR FLASH'));
      } else if (lightlevel == 4) {
        this.setCapabilityValue('lights', ('REAR FLASH OFF'));
      } 
      // Power level
      const powerlevel = motorBatteryLevel[8]
      this.setCapabilityValue('powerlevel', powerlevel);
      // Error Code
      const error = (motorBatteryLevel[15] & 248) >> 3;
      this.log('error', error);
      this.setCapabilityValue('error', error);

      // Run mode
      const runmode = (motorBatteryLevel[15] & 7);
      this.log('runmode', runmode);
      /*
      if (runmode == 0) {
        this.setCapabilityValue('runmode', ('IGNORE'));
      } else if (runmode == 1) {
        this.setCapabilityValue('runmode', ('INITIAL'));
      } else if (runmode == 1) {
        this.setCapabilityValue('runmode', ('NORMAL'));
      } else if (runmode == 1) {
        this.setCapabilityValue('runmode', ('SMART'));
      } else if (runmode == 1) {
        this.setCapabilityValue('runmode', ('ERROR'));
      } 
*/


    } else {
      this.setUnavailable('Could not connect to bike')
    }
  }

  async connectToBike (deviceID: string) {
    try {
      const advertisement = await this.homey.ble.find(deviceID)
      const bikeConnection = await advertisement.connect()
      if (bikeConnection) {
        this.log('Connected to bike')
        return bikeConnection
      } else {
        this.log('Could not connect to bike')
        throw new Error('Could not connect to bike')
      }
    }
    catch (error) {
      this.log(error);
    }
  }

  async detirminDeviceId () {
    try {
      const data = this.getData()
      const settings = this.getSettings();
      const advertisements = await this.homey.ble.discover();
      const filteredAdvertisements = advertisements.filter(advertisement =>
        advertisement.localName?.endsWith(data.uuid.toUpperCase())
      );
      if (settings.deviceId === undefined) {
        if (filteredAdvertisements.length === 0) {
          this.log('No device ID found')
          return false
        } else {
          this.log(`Found device ID - ${filteredAdvertisements[0].id}`)
          this.homey.settings.set('deviceId', filteredAdvertisements[0].id);
          return true
        }
      } else {
        this.log(`Device ID already known as ${settings.deviceId}`) 
        return true
      }
    }
    catch (error) {
      this.log(error)
    }
  }
  /**
   * onAdded is called when the user adds the device, called just after pairing.
   */
  async onAdded() {
    this.log('Vanmoof Bike has been added')
    const knownDeviceId = await this.detirminDeviceId()
    if (!knownDeviceId) {
      this.setUnavailable('Cannot find device ID of the bike, bring closer to Homey and try again')
    }
  }

  /**
   * onSettings is called when the user updates the device's settings.
   * @param {object} event the onSettings event data
   * @param {object} event.oldSettings The old settings object
   * @param {object} event.newSettings The new settings object
   * @param {string[]} event.changedKeys An array of keys changed since the previous version
   * @returns {Promise<string|void>} return a custom message that will be displayed
   */
  async onSettings({ oldSettings: {}, newSettings: {}, changedKeys: {} }): Promise<string|void> {
    this.log('Vanmoof Bike settings where changed');
  }

  /**
   * onRenamed is called when the user updates the device's name.
   * This method can be used this to synchronise the name to the device.
   * @param {string} name The new name
   */
  async onRenamed(name: string) {
    this.log('Vanmoof Bike was renamed');
  
  }

  /**
   * onDeleted is called when the user deleted the device.
   */
  async onDeleted() {
    this.log('Vanmoof Bike has been deleted');
  }
}

module.exports = vanMoof;
